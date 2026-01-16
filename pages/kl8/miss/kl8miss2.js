import { historyKl8 } from "../../../common/kl8.js";
/**
 * 生成数组的所有n个元素的组合（模拟Python的itertools.combinations）
 * @param {Array} arr - 源数组
 * @param {number} n - 组合长度
 * @returns {Array} 所有组合的二维数组
 */
function combinations(arr, n) {
    const result = [];
    // 递归生成组合
    function backtrack(start, current) {
        if (current.length === n) {
            result.push([...current]);
            return;
        }
        for (let i = start; i < arr.length; i++) {
            current.push(arr[i]);
            backtrack(i + 1, current);
            current.pop();
        }
    }
    backtrack(0, []);
    return result;
}

/**
 * 计算快乐8选n组合的遗漏数据
 * @param {Array} historyData - 历史开奖记录，格式为[[期数1号码1, 期数1号码2,...], [期数2号码1,...], ...]
 * @param {number} selectNum - 选号类型，2-10之间的整数（选2到选10）
 * @returns {Object} 键为组合字符串(如"1,5")，值为遗漏期数
 */
function calculateHappy8Omission(historyData, selectNum) {
   // console.log("快乐8历史记录有::",historyData.length)
    // 输入参数验证
    if (!Number.isInteger(selectNum) || selectNum < 1 || selectNum > 10) {
        throw new Error("选号类型必须是1到10之间的整数");
    }
    if (!Array.isArray(historyData) || historyData.length === 0) {
        throw new Error("历史开奖记录不能为空且必须是数组格式");
    }

    // 生成快乐8所有号码（1-80）
    const allNumbers = Array.from({ length: 80 }, (_, i) => i + 1);
    // 生成所有选n组合
    const allCombinations = combinations(allNumbers, selectNum);
    // 初始化遗漏字典：所有组合初始遗漏为总期数（从未出现）
    const omissionDict = {};
    allCombinations.forEach(comb => {
        // 用逗号拼接组合作为键（如[1,5] → "1,5"）
        const key = comb.join(",");
        omissionDict[key] = historyData.length;
    });

    // 遍历每一期开奖数据，更新组合的最后出现期数
    historyData.forEach((periodNumbers, periodIndex) => {
        // 当期号码去重 + 排序
        const uniqueSorted = [...new Set(periodNumbers)].sort((a, b) => a - b);
        // 生成当期开奖号码中的所有选n组合
        const currentCombinations = combinations(uniqueSorted, selectNum);
        // 更新这些组合的遗漏值
        currentCombinations.forEach(comb => {
            const key = comb.join(",");
            // 遗漏值 = 总期数 - 当前期数（期数从1开始）
            omissionDict[key] = historyData.length - (periodIndex + 1);
        });
    });

    return omissionDict;
}
function sortDesc(omissionDict,num=100){
	const sortedItems = Object.entries(omissionDict)
	    .sort((a, b) => b[1] - a[1]);
	const result = sortedItems.slice(0,num);
	return result;
}
/**
 * 打印遗漏值最高的前N个组合
 * @param {Object} omissionDict - 遗漏数据字典
 * @param {number} topN - 要显示的数量，默认10
 */
function printTopOmission(omissionDict, topN = 10) {
    // 将字典转为数组并按遗漏值降序排序
    const sortedItems = Object.entries(omissionDict)
        .sort((a, b) => b[1] - a[1]);

   // console.log(`\n遗漏值最高的前${topN}个组合：`);
    //console.log("组合\t\t遗漏期数");
    console.log("-".repeat(20));
    
    sortedItems.slice(0, topN).forEach(([combStr, omission], index) => {
        // 格式化输出（将"1,5"转为"1 5"）
        const formattedComb = combStr.replace(/,/g, " ");
        // 补空格让显示对齐
        const padding = " ".repeat(15 - formattedComb.length);
        console.log(`${formattedComb}${padding}\t${omission}`);
    });
}

// ------------------------------
// 测试示例
// ------------------------------
// 模拟历史开奖数据（实际使用时替换为真实数据）


const history = historyKl8.map(item=>item.redBall);
//console.log(history)
// 示例1：计算选2组合的遗漏数据
try {
   const select2Omission = calculateHappy8Omission(history, 2);
   // console.log("=== 快乐8选2组合遗漏数据 ===",sortDesc(select2Omission));
   printTopOmission(select2Omission, 20);

    // 示例2：计算选3组合的遗漏数据
   // const select3Omission = calculateHappy8Omission(history, 3);
   // console.log("\n=== 快乐8选3组合遗漏数据 ===");
   // printTopOmission(select3Omission, 20);
} catch (error) {
    console.error("计算出错：", error.message);
}
/**
 * 
 * @param {*} n 
 * @param {*} historyList 
 * @param {*} num  嫌前num位
 * @returns 
 */
export function getMiss(n=2,historyList=history,num){
	  const selectmission = calculateHappy8Omission(historyList, n);
     // console.log(111,selectmission);
      
	  return sortDesc(selectmission,num);
}