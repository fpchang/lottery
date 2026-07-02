import { historyKl8 } from "../../../common/kl8.js";
/**
 * 工具：根据号码反查所属分区下标（0~9）
 */
function getZoneIndex(num) {
    return Math.floor((num - 1) / 8);
}

/**
 * 固定若干分区号码，剩余分区遍历组合，计算遗漏
 * @param {number[]} fixedNums 固定号码数组，如 [6,80]
 * @param {number[][]} historyDraws 历史开奖二维数组，每期20个数字
 */
async function calcFixedZoneCombMiss(fixedNums, historyDraws) {
    // 1. 初始化10个分区号码列表
    const zones = [];
    for (let z = 0; z < 10; z++) {
        const start = z * 8 + 1;
        const arr = [];
        for (let i = 0; i < 8; i++) arr.push(start + i);
        zones.push(arr);
    }

    // 2. 绑定固定号码到对应分区，校验合法性
    const fixedZoneMap = new Map(); // key:分区下标, value:固定号码
    for (const num of fixedNums) {
        const zIdx = getZoneIndex(num);
        // 校验号码确实属于该分区
        if (!zones[zIdx].includes(num)) {
            throw new Error(`号码${num}不在对应分区内，数据非法`);
        }
        if (fixedZoneMap.has(zIdx)) {
            throw new Error(`同一个分区不能同时固定多个号码`);
        }
        fixedZoneMap.set(zIdx, num);
    }

    // 拆分：固定区下标列表、待遍历的自由区下标列表
    const fixedZoneIdxList = [...fixedZoneMap.keys()];
    const freeZoneIdxList = [];
    for (let z = 0; z < 10; z++) {
        if (!fixedZoneMap.has(z)) freeZoneIdxList.push(z);
    }
    console.log("已固定分区下标：", fixedZoneIdxList);
    console.log("自由遍历分区下标：", freeZoneIdxList);

    // 3. 预处理历史开奖：剔除断区期
    const validDrawSetList = [];
    for (const drawNums of historyDraws) {
        const drawSet = new Set(drawNums);
        let breakZone = false;
        for (const zArr of zones) {
            let hasNum = false;
            for (const n of zArr) {
                if (drawSet.has(n)) {
                    hasNum = true;
                    break;
                }
            }
            if (!hasNum) {
                breakZone = true;
                break;
            }
        }
        if (!breakZone) validDrawSetList.push(drawSet);
    }
    const totalValid = validDrawSetList.length;
    console.log(`原始期数:${historyDraws.length} 剔除断区后有效期数:${totalValid}`);
    if (totalValid === 0) throw new Error("无可用非断区开奖期，无法计算");

    // 4. 递归生成自由区所有组合 + 拼接固定号码
    let allResult = [];
    const batchSize = 15000;
    let batchCache = [];

    async function dfs(pos, curFreeNums) {
        if (pos >= freeZoneIdxList.length) {
            // 拼接完整10区号码
            const fullCombo = [];
            for (let z = 0; z < 10; z++) {
                if (fixedZoneMap.has(z)) {
                    fullCombo.push(fixedZoneMap.get(z));
                } else {
                    const freePos = freeZoneIdxList.indexOf(z);
                    fullCombo.push(curFreeNums[freePos]);
                }
            }
            const comboSet = new Set(fullCombo);

            // 统计命中次数、最后命中期
            let hitCnt = 0;
            let lastHitVid = -1;
            for (let vid = 0; vid < totalValid; vid++) {
                const dSet = validDrawSetList[vid];
                let allIn = true;
                for (const n of comboSet) {
                    if (!dSet.has(n)) {
                        allIn = false;
                        break;
                    }
                }
                if (allIn) {
                    hitCnt++;
                    lastHitVid = vid;
                }
            }

            // 计算遗漏值
            let miss;
            if (lastHitVid === -1) {
                miss = totalValid;
            } else {
                miss = (totalValid - 1) - lastHitVid;
            }

            const sortCombo = [...fullCombo].sort((a, b) => a - b)
                .map(v => String(v).padStart(2, "0")).join(",");

            batchCache.push({
                fullComboStr: sortCombo,
                hitTimes: hitCnt,
                missValue: miss
            });

            // 分片让出主线程，防止页面卡死
            if (batchCache.length >= batchSize) {
                allResult.push(...batchCache);
                batchCache = [];
                await new Promise(res => setTimeout(res, 0));
            }
            return;
        }

        // 当前自由分区所有号码循环遍历
        const zIdx = freeZoneIdxList[pos];
        for (const num of zones[zIdx]) {
            curFreeNums.push(num);
            await dfs(pos + 1, curFreeNums);
            curFreeNums.pop();
        }
    }

    await dfs(0, []);
    // 收尾剩余缓存
    if (batchCache.length > 0) allResult.push(...batchCache);

    // 按遗漏降序排序
    allResult.sort((a, b) => b.missValue - a.missValue);

    // 控制台输出预览
    console.log("生成组合总数：", allResult.length);
    console.table(allResult.slice(0, 100));

    // 拼接CSV，复制到Excel
    let csv = "完整10码组合,命中次数,当前遗漏值\n";
    allResult.forEach(item => {
        csv += `${item.fullComboStr},${item.hitTimes},${item.missValue}\n`;
    });
    console.log("==========完整CSV内容（全选复制）==========");
    console.log(csv);

    return allResult;
}

// ====================== 配置区（自行修改）======================
// 示例：固定 [6,80]
const inputFixedNumbers = [28, 80];

// 本地历史开奖二维数组，每期20个数字
const historyDrawData = historyKl8.map(item => item.redBall); // 假设historyKl8每项有redBall数组，包含20个开奖号码
// =============================================================

// 执行计算
calcFixedZoneCombMiss(inputFixedNumbers, historyDrawData)
    .catch(err => console.error("计算异常：", err));
