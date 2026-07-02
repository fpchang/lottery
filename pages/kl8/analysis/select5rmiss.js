import { historyKl8 } from "../../../common/kl8.js";
/**
 * 5分区号码反查分区下标 0~4
 */
function getZoneIndex(num) {
    return Math.floor((num - 1) / 16);
}

/**
 * 快乐8 5分区，固定号码锁定对应区，剩余区遍历组合+遗漏计算
 * @param {number[]} fixedNums 固定号码数组
 * @param {number[][]} historyDraws 历史开奖二维数组，每期20个数字
 */
async function calc5ZoneFixedMiss(fixedNums, historyDraws) {
    // 1、构建5个分区号码列表
    const zones = [];
    for (let z = 0; z < 5; z++) {
        const start = z * 16 + 1;
        const arr = [];
        for (let i = 0; i < 16; i++) {
            arr.push(start + i);
        }
        zones.push(arr);
    }

    // 2、绑定固定号码，合法性校验
    const fixedZoneMap = new Map();
    for (const num of fixedNums) {
        const zIdx = getZoneIndex(num);
        if (!zones[zIdx].includes(num)) {
            throw new Error(`号码${num}不属于分区${zIdx}，参数非法`);
        }
        if (fixedZoneMap.has(zIdx)) {
            throw new Error(`同一分区不能同时固定多个号码`);
        }
        fixedZoneMap.set(zIdx, num);
    }

    const fixedZoneIdxList = [...fixedZoneMap.keys()];
    const freeZoneIdxList = [];
    for (let z = 0; z < 5; z++) {
        if (!fixedZoneMap.has(z)) freeZoneIdxList.push(z);
    }
    console.log("锁定分区下标：", fixedZoneIdxList);
    console.log("自由遍历分区下标：", freeZoneIdxList);

    // 3、预处理历史开奖，剔除断区期
    const validDrawSetList = [];
    for (const drawNums of historyDraws) {
        const drawSet = new Set(drawNums);
        let isBreakZone = false;
        for (const zArr of zones) {
            let zoneHasNum = false;
            for (const n of zArr) {
                if (drawSet.has(n)) {
                    zoneHasNum = true;
                    break;
                }
            }
            if (!zoneHasNum) {
                isBreakZone = true;
                break;
            }
        }
        if (!isBreakZone) validDrawSetList.push(drawSet);
    }
    const totalValid = validDrawSetList.length;
    console.log(`原始总期数：${historyDraws.length}，剔除断区后有效期：${totalValid}`);
    if (totalValid === 0) throw new Error("无有效非断区开奖数据，无法计算");

    // 4、递归生成自由区组合，分片异步防页面卡死
    let allResult = [];
    const batchSize = 15000;
    let batchCache = [];

    async function dfs(pos, curFreeNums) {
        if (pos >= freeZoneIdxList.length) {
            // 拼接完整5区组合
            const fullCombo = [];
            for (let z = 0; z < 5; z++) {
                if (fixedZoneMap.has(z)) {
                    fullCombo.push(fixedZoneMap.get(z));
                } else {
                    const p = freeZoneIdxList.indexOf(z);
                    fullCombo.push(curFreeNums[p]);
                }
            }
            const comboSet = new Set(fullCombo);

            // 统计命中次数、最后命中期下标
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
            let missVal;
            if (lastHitVid === -1) {
                missVal = totalValid;
            } else {
                missVal = (totalValid - 1) - lastHitVid;
            }

            const sortedStr = [...fullCombo]
                .sort((a, b) => a - b)
                .map(v => String(v).padStart(2, "0"))
                .join(",");

            batchCache.push({
                combo: sortedStr,
                hitTimes: hitCnt,
                miss: missVal
            });

            // 分片让出浏览器主线程
            if (batchCache.length >= batchSize) {
                allResult.push(...batchCache);
                batchCache = [];
                await new Promise(res => setTimeout(res, 0));
            }
            return;
        }

        const currZ = freeZoneIdxList[pos];
        for (const num of zones[currZ]) {
            curFreeNums.push(num);
            await dfs(pos + 1, curFreeNums);
            curFreeNums.pop();
        }
    }

    await dfs(0, []);
    if (batchCache.length > 0) allResult.push(...batchCache);

    // 遗漏降序排序
    allResult.sort((a, b) => b.miss - a.miss);

    console.log("总生成组合数量：", allResult.length);
    console.table(allResult.slice(0, 100));

    // 拼接CSV文本，直接复制进Excel
    // let csvTxt = "5码完整组合,命中总次数,当前遗漏值\n";
    // allResult.forEach(item => {
    //     csvTxt += `${item.combo},${item.hitTimes},${item.miss}\n`;
    // });
    // console.log("=====完整CSV内容，全选复制粘贴Excel=====");
    // console.log(csvTxt);

    return allResult;
}

// =====================配置区（自行修改）=====================
// 示例固定号码 [6,80]
const inputFixed = [4,28,38, 80];

// 本地历史开奖二维数组，每期20个数字
const historyData =historyKl8.map(item => item.redBall); 
// =========================================================

calc5ZoneFixedMiss(inputFixed, historyData)
    .catch(err => console.error("计算出错：", err));
