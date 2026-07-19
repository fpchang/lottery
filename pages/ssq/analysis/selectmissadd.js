import {ssqHistory} from "../../../common/ssq.js";
/**
 * 双色球前区：固定N码，生成N+1码组合，计算遗漏并排序
 * @param {number[]} fixedNums 固定号码，长度1~5，1-33不重复
 * @param {number[][]} historyDraws 历史前区开奖，二维数组，每期6个数字
 * @returns 遗漏降序结果数组
 */
function calcSsqFrontNPlus1Miss(fixedNums, historyDraws) {
    // 基础合法性校验
    const n = fixedNums.length;
    if (n < 1 || n > 5) throw new Error("输入数组长度必须1~5");
    const fixedSet = new Set(fixedNums);
    if (fixedSet.size !== n) throw new Error("固定号码不能重复");
    for (const num of fixedNums) {
        if (num < 1 || num > 33) throw new Error("号码范围必须1~33");
    }

    const totalPeriod = historyDraws.length;
    if (totalPeriod === 0) throw new Error("请填充历史开奖数据");
    // 预转为Set加速匹配
    const drawSetList = historyDraws.map(d => new Set(d));

    // 遍历所有可用追加数字x
    const candidates = [];
    for (let x = 1; x <= 33; x++) {
        if (!fixedSet.has(x)) candidates.push(x);
    }

    const result = [];
    for (const x of candidates) {
        const combo = [...fixedNums, x].sort((a, b) => a - b);
        const comboSet = new Set(combo);
        let hitCount = 0;
        let lastHitIdx = -1;

        // 逐期校验是否全部命中
        for (let i = 0; i < totalPeriod; i++) {
            const dSet = drawSetList[i];
            let allIn = true;
            for (const num of comboSet) {
                if (!dSet.has(num)) {
                    allIn = false;
                    break;
                }
            }
            if (allIn) {
                hitCount++;
                lastHitIdx = i;
            }
        }

        // 计算遗漏
        let missVal;
        if (lastHitIdx === -1) {
            missVal = totalPeriod;
        } else {
            missVal = (totalPeriod - 1) - lastHitIdx;
        }

        const comboStr = combo.map(v => String(v).padStart(2, "0")).join(",");
        result.push({
            fixedPart: fixedNums.map(v => String(v).padStart(2, "0")).join(","),
            addNum: String(x).padStart(2, "0"),
            fullCombo: comboStr,
            hitTimes: hitCount,
            missValue: missVal
        });
    }

    // 遗漏从大到小排序
    result.sort((a, b) => {
        if (b.missValue !== a.missValue) return b.missValue - a.missValue;
        return parseInt(a.addNum) - parseInt(b.addNum);
    });
    return result;
}

// ====================== 配置区（自行修改） ======================
// 示例：输入2个号码，自动生成3码组合计算遗漏
<<<<<<< HEAD
const inputFixed = [6,7,8,11,26];
=======
const inputFixed = [6,7,12,23,25];
>>>>>>> refs/remotes/origin/main

// 双色球历史前区开奖数据，每一行是一期6个前区号码
const historyData = ssqHistory.map(item => item.redBall);
// ===============================================================

try {
    const res = calcSsqFrontNPlus1Miss(inputFixed, historyData);
    console.table(res);

    // 导出可复制CSV
    // let csv = "固定号码,追加号码,完整N+1组合,历史命中次数,当前遗漏期数\n";
    // res.forEach(item => {
    //     csv += `${item.fixedPart},${item.addNum},${item.fullCombo},${item.hitTimes},${item.missValue}\n`;
    // });
    // console.log("====完整CSV内容，复制到Excel====");
    // console.log(csv);
} catch (err) {
    console.error("计算失败：", err.message);
}
