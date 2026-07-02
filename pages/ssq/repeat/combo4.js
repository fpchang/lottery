import {ssqHistory} from "../../../common/ssq.js";
/**
 * 生成一组数字全部4码升序组合，返回格式化字符串
 */
function genFourComboStrList(nums) {
    const arr = [...nums].sort((a, b) => a - b);
    const res = [];
    const len = arr.length;
    for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
            for (let k = j + 1; k < len; k++) {
                for (let m = k + 1; m < len; m++) {
                    const str = [arr[i], arr[j], arr[k], arr[m]]
                        .map(v => String(v).padStart(2, "0"))
                        .join(",");
                    res.push(str);
                }
            }
        }
    }
    return res;
}

/**
 * 统计4码组合：次数、期号、最后开出下标、当前遗漏
 * @param {Array} history 开奖数组，按时间从旧到新排序
 * @returns {Array} 统计原始数组
 */
function statRed4ComboWithMiss(history) {
    const totalPeriod = history.length;
    const comboMap = new Map();

    // 遍历每一期，下标i为期次索引（0最早，totalPeriod-1最新）
    for (let i = 0; i < totalPeriod; i++) {
        const item = history[i];
        const redList = item.redBall;
        const periodNo = item.index;
        const fourList = genFourComboStrList(redList);

        for (const comboStr of fourList) {
            if (!comboMap.has(comboStr)) {
                comboMap.set(comboStr, {
                    hitCount: 0,
                    allPeriods: [],
                    lastIdx: -1
                });
            }
            const info = comboMap.get(comboStr);
            info.hitCount += 1;
            info.allPeriods.push(periodNo);
            info.lastIdx = i; // 更新为当前最新出现的期次下标
        }
    }

    // 组装结果，计算遗漏
    const result = [];
    for (const [combo, data] of comboMap) {
        let currentMiss;
        if (data.lastIdx === -1) {
            // 从未出现，遗漏=总期数
            currentMiss = totalPeriod;
        } else {
            // 最新一期下标 totalPeriod-1
            currentMiss = (totalPeriod - 1) - data.lastIdx;
        }
        result.push({
            fourCombo: combo,
            hitCount: data.hitCount,
            allPeriods: data.allPeriods,
            lastShowPeriod: data.allPeriods.at(-1) ?? "从未开出",
            currentMiss: currentMiss
        });
    }
    return result;
}

/**
 * 排序函数
 * @param {Array} list 统计原始数组
 * @param {string} sortType 可选：countDesc / missDesc / comboAsc
 * @returns 排序后新数组
 */
function sortComboList(list, sortType = "countDesc") {
    const copy = [...list];
    switch (sortType) {
        // 出现次数从多到少
        case "countDesc":
            copy.sort((a, b) => b.hitCount - a.hitCount);
            break;
        // 当前遗漏从大到小
        case "missDesc":
            copy.sort((a, b) => b.currentMiss - a.currentMiss);
            break;
        // 组合号码升序
        case "comboAsc":
            copy.sort((a, b) => a.fourCombo.localeCompare(b.fourCombo));
            break;
        default:
            copy.sort((a, b) => b.hitCount - a.hitCount);
    }
    return copy;
}

// ====================== 测试历史数据（按时间从旧到新）======================
const historyData = ssqHistory;
// ==========================================================================

// 1. 基础统计
const rawStat = statRed4ComboWithMiss(historyData);

// 2. 三种排序示例
const sortByCount = sortComboList(rawStat, "countDesc");    // 次数最多靠前
const sortByMiss = sortComboList(rawStat, "missDesc");      // 遗漏最大靠前
const sortByCombo = sortComboList(rawStat, "comboAsc");     // 组合升序

console.log("===== 按出现次数降序排行 =====");
console.table(sortByCount.slice(0,100));

console.log("\n===== 按当前遗漏降序排行 =====");
console.table(sortByMiss.slice(0,100));

// 导出CSV（以遗漏排序为例，可替换sortByCount/sortByCombo）
// let csvText = "4码红球组合,出现总次数,最后开出期号,当前遗漏期数,全部开出期号\n";
// sortByMiss.forEach(row => {
//     csvText += `${row.fourCombo},${row.hitCount},${row.lastShowPeriod},${row.currentMiss},${row.allPeriods.join("|")}\n`;
// });
// console.log("\n==== CSV表格文本 ====\n", csvText);