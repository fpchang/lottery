import {dltHistory} from "../../../common/dlt.js";
/**
 * 大乐透 固定N码 → 计算 N+1 码组合遗漏
 * @param {number[]} fixedNums 固定号码 [1~4个]，范围1-35，无重复
 * @param {number[][]} historyDraws 历史开奖：每期前区5个号码二维数组
 * @returns {Array} 结果列表，按遗漏降序排列
 */
function calcLottoMiss(fixedNums, historyDraws) {
    // 基础校验
    const n = fixedNums.length;
    if (n < 1 || n > 4) {
        throw new Error("输入数组长度必须为 1~4");
    }
    const numSet = new Set(fixedNums);
    if (numSet.size !== n) {
        throw new Error("固定号码不能存在重复");
    }
    for (const num of fixedNums) {
        if (num < 1 || num > 35) {
            throw new Error("号码必须在 01~35 范围内");
        }
    }

    const totalPeriod = historyDraws.length;
    if (totalPeriod === 0) {
        throw new Error("请填入历史开奖数据");
    }

    // 历史开奖转为Set，加速匹配
    const drawSetList = historyDraws.map(item => new Set(item));
    // 候选追加号码：1~35 排除已固定号码
    const candidateX = [];
    for (let x = 1; x <= 35; x++) {
        if (!numSet.has(x)) {
            candidateX.push(x);
        }
    }

    const result = [];
    // 遍历每一个可追加号码
    for (const x of candidateX) {
        const combo = [...fixedNums, x].sort((a, b) => a - b);
        const comboSet = new Set(combo);

        let hitTimes = 0;
        let lastHitIndex = -1;

        // 逐期判断是否完整命中
        for (let idx = 0; idx < totalPeriod; idx++) {
            const dSet = drawSetList[idx];
            let fullMatch = true;
            for (const num of comboSet) {
                if (!dSet.has(num)) {
                    fullMatch = false;
                    break;
                }
            }
            if (fullMatch) {
                hitTimes++;
                lastHitIndex = idx;
            }
        }

        // 计算当前遗漏
        let missVal;
        if (lastHitIndex === -1) {
            missVal = totalPeriod;
        } else {
            missVal = (totalPeriod - 1) - lastHitIndex;
        }

        // 格式化号码为两位
        const comboStr = combo.map(v => String(v).padStart(2, "0")).join(",");
        result.push({
            fixed: fixedNums.map(v => String(v).padStart(2, "0")).join(","),
            addNum: String(x).padStart(2, "0"),
            fullCombo: comboStr,
            hitCount: hitTimes,
            currentMiss: missVal
        });
    }

    // 按遗漏从大到小排序，遗漏相同则按追加号码升序
    result.sort((a, b) => {
        if (b.currentMiss !== a.currentMiss) {
            return b.currentMiss - a.currentMiss;
        }
        return parseInt(a.addNum) - parseInt(b.addNum);
    });

    return result;
}

// ===================== 【配置区 - 自行修改】=====================
// 1. 输入固定号码 (长度1~4，示例：[1,5] 计算3码组合遗漏)
const inputNums = [1,9,10,24];

// 2. 大乐透历史前区开奖数据：二维数组，每期5个号码
const historyData = dltHistory.map(item=>item.redBall);
// ==============================================================

// 执行计算
try {
    const resList = calcLottoMiss(inputNums, historyData);
    console.log("===== 大乐透 N+1 码组合遗漏结果（按遗漏降序）=====");
    console.table(resList);

    // 导出CSV文本，可直接复制到Excel
    // let csv = "固定号码,追加号码,完整组合,命中次数,当前遗漏期数\n";
    // resList.forEach(item => {
    //     csv += `${item.fixed},${item.addNum},${item.fullCombo},${item.hitCount},${item.currentMiss}\n`;
    // });
    // console.log("\n===== CSV 完整内容（全选复制）=====");
    // console.log(csv);
} catch (err) {
    console.error("运行错误：", err.message);
}
