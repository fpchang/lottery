import { historyKl8 } from "../../../common/kl8.js";
import {getMiss3} from "../miss/kl8miss3.js"
/**
 * 单组选3计算：自定义周期倍投规则
 * @param {number[]} combo 3码组合
 * @param {number[][]} drawList 连续开奖期数组
 * @returns 统计结果
 */
function calcOne3Combo(combo, drawList) {
    const comboSet = new Set(combo);
    let totalCost = 0;      // 累计总投入
    let totalBonus = 0;     // 累计总奖金
    let hit3Period = null;  // 命中3码的期号
    // 倍投变量
    let currMul = 1;        // 当前投注倍数
    let sumAllMul = 1;      // 历史所有周期倍数总和
    let cycleCount = 0;     // 已完成的25期完整周期数
    let continueNoHit = 0;   // 连续未中3码的期数

    for (let idx = 0; idx < drawList.length; idx++) {
        const periodNo = idx + 1;
        const drawSet = new Set(drawList[idx]);
        let matchNum = 0;
        for (const n of comboSet) {
            if (drawSet.has(n)) matchNum++;
        }

        // 1、本期投注成本
        const periodCost = currMul * 2;
        totalCost += periodCost;
        continueNoHit += 1;

        // 2、本期奖金计算
        let perBonus = 0;
        if (matchNum === 2) {
            perBonus = 3 * currMul;
        } else if (matchNum === 3) {
            perBonus = 53 * currMul;
            totalBonus += perBonus;
            hit3Period = periodNo;
            break;
        }
        totalBonus += perBonus;

        // 3、满25期完整周期，更新倍数
        if (continueNoHit >= 25) {
            cycleCount += 1;
            // 新倍数 = 历史全部倍数总和 + 1
            const newMul = sumAllMul + 1;
            currMul = newMul;
            sumAllMul += newMul;
            continueNoHit = 0; // 重置连续未中计数
        }
    }

    const comboStr = combo.map(v => String(v).padStart(2, "0")).join(",");
    const hitDesc = hit3Period ?? `${drawList.length}期未开出3全中`;
    const profit = totalBonus - totalCost;

    return {
        三码组合: comboStr,
        开出3全中期数: hitDesc,
        最终投注倍数: currMul,
        完成25期周期个数: cycleCount,
        总投入成本_元: totalCost,
        总中奖奖金_元: totalBonus,
        净盈亏_元: profit,
        amount:profit
    };
}

// 批量计算全部组合
function batchCalcAllCombos(comboArr, drawData) {
    const res = [];
    for (const c of comboArr) {
        const s = new Set(c);
        if (c.length !== 3 || s.size !== 3 || c.some(x => x < 1 || x > 80)) {
            console.warn("非法组合跳过：", c);
            continue;
        }
        res.push(calcOne3Combo(c, drawData));
    }
    return res;
}

// ====================== 填入你的数据 ======================

// 待计算的所有选3组合
const targetCombos = getMiss3(historyKl8.slice(0,-800)).slice(0,20)

// 500期开奖数据，每期20个号码
const draw500 = historyKl8.slice(-800).map(item=>item.redBall)
// =========================================================

const resultList = batchCalcAllCombos(targetCombos, draw500);
let amountsum = 0;
resultList.map(item=>amountsum+=item.amount)
console.log("总共亏赚",amountsum);
console.table(resultList);


