import { historyKl8 } from "../../../common/kl8.js";
/**
 * 快乐8选5最大遗漏计算算法（包含从未出现的组合）
 * 功能：计算所有选5组合（出现过+从未出现）的遗漏值，按降序排列
 */

/**
 * 生成指定号码范围内的所有选5组合（回溯法）
 * @param {number[]} numberRange 号码范围（如[1,2,...,20]）
 * @returns {string[]} 选5组合字符串数组（已排序，如["1,2,3,4,5"]）
 */
function generateAllSelect5Combinations(numberRange) {
    const combinations = [];
    const backtrack = (start, path) => {
        if (path.length === 5) {
            combinations.push(path.sort((a, b) => a - b).join(','));
            return;
        }
        for (let i = start; i < numberRange.length; i++) {
            path.push(numberRange[i]);
            backtrack(i + 1, path);
            path.pop();
        }
    };
    backtrack(0, []);
    return combinations;
}

/**
 * 从单期开奖号码中提取所有选5组合
 * @param {number[]} draw 单期开奖号码（20个）
 * @returns {string[]} 选5组合字符串数组
 */
function generateDrawSelect5Combinations(draw) {
    return generateAllSelect5Combinations(draw);
}

/**
 * 计算选5所有组合的遗漏值（包含从未出现的组合）
 * @param {number[][]} historyData 历史开奖数据（最新期在前，二维数组）
 * @param {number[]} numberRange 计算的号码范围（默认1-20，避免性能问题）
 * @returns {Array} 降序排列的遗漏结果
 */
function calculateSelect5Omission(historyData, numberRange = Array.from({ length: 20 }, (_, i) => i + 1)) {
    // 1. 输入校验
    if (!Array.isArray(historyData) || historyData.length === 0) {
        throw new Error("历史开奖数据不能为空，且必须是二维数组");
    }
    historyData.forEach((draw, index) => {
        if (!Array.isArray(draw) || draw.length !== 20) {
            throw new Error(`第${index+1}期开奖数据格式错误，必须包含20个号码`);
        }
    });

    const totalPeriods = historyData.length;
    const lastOccurrenceMap = new Map(); // 记录出现过的组合最后一次出现的期数索引

    // 2. 遍历历史数据，记录出现过的组合
    for (let periodIndex = 0; periodIndex < totalPeriods; periodIndex++) {
        const currentDraw = historyData[periodIndex];
        const select5Combs = generateDrawSelect5Combinations(currentDraw);
        select5Combs.forEach(combStr => {
            lastOccurrenceMap.set(combStr, periodIndex); // 覆盖为最新出现的期数
        });
    }

    // 3. 生成指定号码范围内的所有选5组合（包含从未出现的）
    const allSelect5Combs = generateAllSelect5Combinations(numberRange);
    const result = [];

    // 4. 计算每个组合的遗漏值
    allSelect5Combs.forEach(combStr => {
        let omission;
        if (lastOccurrenceMap.has(combStr)) {
            // 出现过的组合：遗漏值=最后一次出现的期数索引
            omission = lastOccurrenceMap.get(combStr);
        } else {
            // 从未出现的组合：遗漏值=历史总期数
            omission = totalPeriods;
        }
        result.push({
            combination: combStr.split(',').map(Number),
            omission: omission,
            isNeverAppeared: !lastOccurrenceMap.has(combStr) // 标记是否从未出现
        });
    });

    // 5. 按遗漏值降序排列（从未出现的会排在最前）
    result.sort((a, b) => b.omission - a.omission);

    return result;
}

// ===================== 测试用例 =====================
// 模拟历史开奖数据（最新期在前，共5期，每期20个号码）
const mockHistoryData = historyKl8.map(item=>item.redBall);

// 执行算法（计算1-10的选5组合，范围越小速度越快）
try {
    const numberRange = Array.from({ length: 10 }, (_, i) => i + 1); // 1-10的号码范围
    const select5OmissionResult = calculateSelect5Omission(mockHistoryData, numberRange);
    
    console.log("===== 快乐8选5遗漏值（降序排列，包含从未出现的组合） =====");
    console.log(`计算范围：号码${numberRange[0]}-${numberRange[numberRange.length-1]} | 历史总期数：${mockHistoryData.length}期`);
    console.log("--------------------------------------------------------");
    
    // 打印前30个结果（可调整数量）
    select5OmissionResult.slice(0, 30).forEach((item, index) => {
        const status = item.isNeverAppeared ? "[从未出现]" : "[已出现]";
        console.log(`第${index+1}名：${status} 组合[${item.combination.join(',')}] → 遗漏${item.omission}期`);
    });
} catch (error) {
    console.error("计算失败：", error.message);
}