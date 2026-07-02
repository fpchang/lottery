import { historyKl8 } from "../../../common/kl8.js";
const his =historyKl8.map(item=>{return {period:item.index,nums:item.redBall}})

/**
 * 生成单期20个号码所有4码组合字符串
 */
function gen4ComboList(nums) {
    const arr = [...nums].sort((a, b) => a - b);
    const res = [];
    const len = arr.length;
    for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
            for (let k = j + 1; k < len; k++) {
                for (let m = k + 1; m < len; m++) {
                    const comboStr = [arr[i], arr[j], arr[k], arr[m]]
                        .map(v => String(v).padStart("0", 2))
                        .join(",");
                    res.push(comboStr);
                }
            }
        }
    }
    return res;
}

/**
 * 计算最小、最大、平均间隔
 */
function getIntervalInfo(indexArr) {
    // 只出现1次/从未出现，无间隔数据
    if (indexArr.length < 2) {
        return { min: "-", max: "-", avg: "-" };
    }
    const gaps = [];
    for (let i = 1; i < indexArr.length; i++) {
        gaps.push(indexArr[i] - indexArr[i - 1]);
    }
    const min = Math.min(...gaps);
    const max = Math.max(...gaps);
    const avg = (gaps.reduce((s, v) => s + v, 0) / gaps.length).toFixed(2);
    return { min, max, avg };
}

/**
 * 核心统计函数，返回按开出次数降序的列表
 * @param {Array} history 快乐8历史开奖，旧数据在前、新数据在后
 * @returns {Array} 统计结果数组
 */
function getKl8Top4Combo(history) {
    const total = history.length;
    const comboMap = new Map();

    // 遍历每一期，记录每个4码组合出现的期下标
    for (let idx = 0; idx < total; idx++) {
        const item = history[idx];
        const fourList = gen4ComboList(item.nums);
        for (const combo of fourList) {
            if (!comboMap.has(combo)) {
                comboMap.set(combo, []);
            }
            comboMap.get(combo).push(idx);
        }
    }

    // 组装需要的字段
    let result = [];
    for (const [combo, indexList] of comboMap) {
        const hitCount = indexList.length;
        // 计算当前遗漏
        const lastIdx = indexList.at(-1);
        const currentMiss = (total - 1) - lastIdx;
        // 间隔数据
        const { min, max, avg } = getIntervalInfo(indexList);

        result.push({
            fourCombo: combo,
            hitCount: hitCount,
            minInterval: min,
            maxInterval: max,
            avgInterval: avg,
            currentMiss: currentMiss
        });
    }

    // 按开出次数从多到少排序
    result.sort((a, b) => b.hitCount - a.hitCount);
    return result;
}

// ====================== 配置区：替换成你的完整历史数据 ======================
// const kl8History = [
//     { period: "26156", nums: [5,11,12,15,20,23,28,29,37,38,45,49,51,55,63,64,65,69,77,79] },
//     { period: "26157", nums: [3,9,14,16,22,25,30,31,39,40,44,48,52,56,61,66,70,72,75,78] },
//     { period: "26158", nums: [5,11,12,15,20,23,28,29,37,38,45,49,51,55,63,64,65,69,77,79] },
//     { period: "26160", nums: [5,11,12,15,20,23,28,29,37,38,45,49,51,55,63,64,65,69,77,79] }
// ];
// ============================================================================

// 执行统计
const topList = getKl8Top4Combo(his);
console.log(topList.map(item=>item.fourCombo).slice(0,50))
// 控制台打印表格
console.log("【快乐8选4组合排行（按开出次数降序）】");
console.table(topList.slice(0,50));
