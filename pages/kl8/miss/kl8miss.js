import { historyKl8 } from "../../../common/kl8.js";
import CombinationCalculator from "../../../common/api/CombinationCalculator.js"
const happy8History1 = [
  { period: 2025285, numbers: [5,6,7,9,11,19,24,29,39,41,45,46,63,67,68,73,80,12,15,22] },
  { period: 2025286, numbers: [6,12,14,16,22,24,25,30,37,39,42,43,54,57,58,61,62,68,74,18] },
  { period: 2025287, numbers: [1,6,17,18,21,22,23,24,31,32,40,43,48,49,52,57,58,60,68,79] },
  // ... 补充更多历史数据
];
const mockHistory=historyKl8.map(item=>{
    return {period:item.index,numbers:item.redBall}
})
/**
 * 快乐8单个选N组合遗漏统计算法（每次仅传一个选数）
 * @param {Array} historyData 历史开奖记录，格式：[{period: 期数, numbers: [1,3,...,20个数字]}, ...]
 * @param {Number} selectN 单个选数（2-10之间的整数，每次仅传一个）
 * @param {Object} options 可选配置
 * @param {Number} options.comboLimit 生成的组合数量上限（默认500，选8-10建议设为100以内）
 * @param {Number} options.numberRange 数字范围（默认80，快乐8标准）
 * @returns {Object} 包含遗漏数据和排序方法的结果对象
 */
function calculateKaiLe8SingleOmission(historyData, selectN, options = {}) {
    // 1. 严格参数校验（核心：确保选N是单个合法整数）
    if (typeof selectN !== 'number' || !Number.isInteger(selectN) || selectN < 2 || selectN > 10) {
        throw new Error('selectN必须是2-10之间的单个整数，每次仅支持传入一个值（如2、5、8）');
    }
    if (!Array.isArray(historyData) || historyData.length === 0) {
        throw new Error('历史开奖数据不能为空，格式需为：[{period: 期数, numbers: [20个开奖数字]}]');
    }
    const { comboLimit = 500, numberRange = 80 } = options;

    // 2. 组合生成函数（仅生成当前选N的组合）
    const generateCombinations = (n, range, maxCount) => {
        const result = [];
        const nums = Array.from({ length: range }, (_, i) => i + 1);

        // 回溯法生成不重复的组合（如[1,2]≠[2,1]）
        const backtrack = (start, path) => {
            if (path.length === n) {
                result.push([...path]);
                return;
            }
            for (let i = start; i < nums.length && result.length < maxCount; i++) {
                path.push(nums[i]);
                backtrack(i + 1, path);
                path.pop();
                if (result.length >= maxCount) break;
            }
        };

        backtrack(0, []);
        console.log(`快乐8选${selectN}：生成${result.length}个组合（上限${maxCount}）`);
        return result;
    };

    // 3. 预处理历史数据（正序排列，转为Set提升查找效率）
    const sortedHistory = [...historyData].sort((a, b) => a.period - b.period);
    const historyWithSet = sortedHistory.map((item, index) => ({
        period: item.period,
        numberSet: new Set(item.numbers),
        index
    }));
    const totalPeriods = sortedHistory.length;

    // 4. 生成当前选N的组合
    const combinations = generateCombinations(selectN, numberRange, comboLimit);

    // 5. 核心：计算每个组合的遗漏数据
    const omissionResult = [];
    for (const combo of combinations) {
        const comboKey = combo.join('-');
        const appearIndexes = []; // 组合出现的期数索引（正序）
        const historyOmissions = [];

        // 收集组合出现的所有期数
        for (let i = 0; i < historyWithSet.length; i++) {
            const { numberSet } = historyWithSet[i];
            // 判定：组合中所有数字都出现在当期开奖号码中
            const isAppeared = combo.every(num => numberSet.has(num));
            if (isAppeared) {
                appearIndexes.push(i);
            }
        }

        // 计算历史遗漏（两次出现的间隔期数）
        for (let i = 1; i < appearIndexes.length; i++) {
            historyOmissions.push(appearIndexes[i] - appearIndexes[i - 1]);
        }

        // 计算当前遗漏
        let currentOmission = 0;
        if (appearIndexes.length === 0) {
            currentOmission = totalPeriods; // 从未出现：总期数
        } else {
            const lastIndex = appearIndexes[appearIndexes.length - 1];
            currentOmission = totalPeriods - 1 - lastIndex; // 最新期 - 最后出现期
        }

        // 计算最大遗漏
        let maxOmission = 0;
        if (historyOmissions.length > 0) {
            maxOmission = Math.max(...historyOmissions);
        } else if (appearIndexes.length === 0) {
            maxOmission = totalPeriods; // 从未出现
        } else {
            maxOmission = totalPeriods - appearIndexes[0]; // 仅出现一次
        }

        // 计算平均遗漏（保留2位小数）
        const avgOmission = historyOmissions.length === 0
            ? 0
            : parseFloat((historyOmissions.reduce((a, b) => a + b, 0) / historyOmissions.length).toFixed(2));

        // 保存结果
        omissionResult.push({
            combination: combo,
            comboKey,
            currentOmission,
            maxOmission,
            avgOmission,
           // historyOmissions,
            appearCount: appearIndexes.length, // 出现次数（便于验证）
            totalPeriods // 总期数（便于验证）
        });
    }

    // 6. 排序方法（支持按当前/最大遗漏排序）
    const sortBy = (field, order = 'desc') => {
        if (!['currentOmission', 'maxOmission'].includes(field)) {
            throw new Error(`排序字段仅支持：currentOmission / maxOmission`);
        }
        return [...omissionResult].sort((a, b) => {
            return order === 'asc' ? a[field] - b[field] : b[field] - a[field];
        });
    };

    // 7. 辅助方法：查询指定组合
    const findCombo = (comboKey) => {
        return omissionResult.find(item => item.comboKey === comboKey);
    };

    // 返回最终结果
    return {
        selectN, // 当前计算的选数
        comboCount: combinations.length, // 生成的组合总数
        rawData: omissionResult, // 原始遗漏数据
        sortBy, // 排序方法
        findCombo // 查询指定组合
    };
}

// ------------------- 最简使用示例 -------------------
// 1. 模拟快乐8历史数据（5期）


// 2. 单次计算选2的组合遗漏（核心示例）
try {
    // 传入：历史数据 + 单个选N值（2） + 配置项
    // const select2Result = calculateKaiLe8SingleOmission(mockHistory, 2, { comboLimit: 100 });
    
    // // 2.1 按最大遗漏降序排序（取前5）
    // const sortedByMax = select2Result.sortBy('maxOmission', 'desc');
    // console.log(`快乐8选2 - 按最大遗漏降序（前5）：`);
    // console.log(sortedByMax.slice(0, 5));

    // // 2.2 按当前遗漏升序排序（取前5）
    // const sortedByCurrent = select2Result.sortBy('currentOmission', 'asc');
    // console.log(`\n快乐8选2 - 按当前遗漏升序（前5）：`);
    // console.log(sortedByCurrent.slice(0, 5));

    // // 2.3 查询指定组合[3,4]的遗漏数据
    // const combo34 = select2Result.findCombo('3-4');
    // console.log(`\n快乐8选2 - 组合[3,4]的遗漏数据：`);
    // console.log(combo34);

} catch (error) {
    console.error('计算错误：', error.message);
}

// 3. 单次计算选5的组合遗漏（仅需修改第二个参数）
// const select5Result = calculateKaiLe8SingleOmission(mockHistory, 5, { comboLimit: 50 });
function getmiss(n=2){
    const select5Result = calculateKaiLe8SingleOmission(mockHistory, n, { comboLimit: CombinationCalculator.calculate(80,n) });
    const curesult=select5Result.sortBy('currentOmission', 'desc');
    console.log(`选${n}当前遗漏最大值排序`,curesult)
}
getmiss(3);