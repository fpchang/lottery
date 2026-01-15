//计算还未开出的组合，并与历史任意一期重复数小于3
import {ssqHistory} from "../../../common/ssq.js";
const historyRedData =ssqHistory.map(item=>item.redBall);
/**
 * 1~33 数字的排列组合生成工具
 * 核心功能：生成选k个数字的所有组合/排列
 */
class NumberCombinationGenerator {
  /**
   * 构造函数
   * @param {number} maxNum 数字范围上限（默认33）
   */
  constructor(maxNum = 33) {
    if (!Number.isInteger(maxNum) || maxNum < 1) {
      throw new Error("数字范围上限必须是正整数");
    }
    this.maxNum = maxNum;
  }

  /**
   * 计算组合数 C(n,k) = n!/(k!(n-k)!)
   * @param {number} n 总数
   * @param {number} k 选取数
   * @returns {number} 组合数
   */
  calculateCombination(n, k) {
    if (k > n) return 0;
    if (k === 0 || k === n) return 1;
    k = Math.min(k, n - k); // 优化：C(n,k) = C(n,n-k)
    let result = 1;
    for (let i = 1; i <= k; i++) {
      result = result * (n - k + i) / i;
    }
    return Math.round(result);
  }

  /**
   * 计算排列数 P(n,k) = n!/(n-k)!
   * @param {number} n 总数
   * @param {number} k 选取数
   * @returns {number} 排列数
   */
  calculatePermutation(n, k) {
    if (k > n) return 0;
    if (k === 0) return 1;
    let result = 1;
    for (let i = 0; i < k; i++) {
      result *= (n - i);
    }
    return result;
  }

  /**
   * 生成选k个数字的所有组合（不考虑顺序、不重复）
   * @param {number} k 选取的数字个数
   * @param {function} progressCallback 进度回调 (current, total, percent)
   * @returns {number[][]} 所有组合列表
   */
  generateCombinations(k, progressCallback) {
    if (!Number.isInteger(k) || k < 1 || k > this.maxNum) {
      throw new Error(`选取个数k必须是1~${this.maxNum}的整数`);
    }

    const n = this.maxNum;
    const total = this.calculateCombination(n, k);
    let currentCount = 0;
    const combinations = [];

    // 初始化索引 [0,1,2,...,k-1]（对应数字 1,2,...,k）
    const indices = Array.from({ length: k }, (_, i) => i);

    while (true) {
      // 索引转实际数字（+1）
      const combo = indices.map(i => i + 1);
      combinations.push(combo);

      // 进度反馈（每10000个更新一次，减少性能损耗）
      currentCount++;
      if (currentCount % 10000 === 0) {
        const percent = ((currentCount / total) * 100).toFixed(2);
        progressCallback?.(currentCount, total, percent);
      }

      // 生成下一个组合（字典序）
      let i = k - 1;
      while (i >= 0 && indices[i] === n - k + i) {
        i--;
      }
      if (i < 0) break; // 所有组合生成完毕

      indices[i]++;
      for (let j = i + 1; j < k; j++) {
        indices[j] = indices[j - 1] + 1;
      }
    }

    // 最终进度反馈
    const percent = "100.00";
    progressCallback?.(total, total, percent);
    return combinations;
  }

  /**
   * 生成单个组合的全排列（考虑顺序）
   * @param {number[]} combo 待排列的组合（如 [1,2,3]）
   * @returns {number[][]} 该组合的所有排列
   */
  generatePermutationsOfCombo(combo) {
    const result = [];
    // 递归生成排列
    const permute = (arr, path = []) => {
      if (arr.length === 0) {
        result.push(path);
        return;
      }
      for (let i = 0; i < arr.length; i++) {
        // 避免重复排列（若组合有重复数字时生效，此处组合无重复）
        if (i > 0 && arr[i] === arr[i - 1]) continue;
        const newArr = [...arr.slice(0, i), ...arr.slice(i + 1)];
        permute(newArr, [...path, arr[i]]);
      }
    };
    permute(combo);
    return result;
  }

  /**
   * 生成选k个数字的所有排列（考虑顺序、不重复）
   * @param {number} k 选取的数字个数
   * @param {function} progressCallback 进度回调 (current, total, percent)
   * @returns {number[][]} 所有排列列表
   */
  generatePermutations(k, progressCallback) {
    if (!Number.isInteger(k) || k < 1 || k > this.maxNum) {
      throw new Error(`选取个数k必须是1~${this.maxNum}的整数`);
    }

    const n = this.maxNum;
    const total = this.calculatePermutation(n, k);
    const combinations = this.generateCombinations(k); // 先生成所有组合
    let currentCount = 0;
    const permutations = [];

    for (const combo of combinations) {
      // 生成单个组合的全排列
      const comboPerms = this.generatePermutationsOfCombo(combo);
      permutations.push(...comboPerms);

      // 进度反馈
      currentCount += comboPerms.length;
      const percent = ((currentCount / total) * 100).toFixed(2);
      progressCallback?.(currentCount, total, percent);
    }

    return permutations;
  }

  /**
   * 格式化输出结果（避免一次性输出过多）
   * @param {number[][]} results 组合/排列列表
   * @param {number} limit 输出数量上限
   * @returns {string} 格式化字符串
   */
  formatResults(results, limit = 10) {
    const displayResults = results.slice(0, limit);
    let output = `共生成 ${results.length.toLocaleString()} 个结果，展示前 ${limit} 个：\n`;
    displayResults.forEach((item, index) => {
      output += `${index + 1}. ${item.join(", ")}\n`;
    });
    if (results.length > limit) {
      output += `...（剩余 ${(results.length - limit).toLocaleString()} 个结果未展示）`;
    }
    return output;
  }
}
function repeatMax2(list,history){
	let flag=true;
	for(let i =0;i<history.length;i++){
		let redBall = history[i].redBall;
		
		let num = list.length + redBall.length - new Set([...redBall,...list]).size;
        if(num>4){
            flag=false;
            break;
        }
		
	}
  
    
	return flag;
}
// ===================== 示例使用 =====================
try {
  // 1. 创建生成器实例（默认1~33）
  const generator = new NumberCombinationGenerator(33);

  // 2. 示例1：生成选6个数字的所有组合（双色球红球规则）
  console.log("=== 生成1~33中选6个数字的所有组合 ===");
  const k = 6;
  // 计算组合数和排列数（提前了解规模）
  const comboCount = generator.calculateCombination(33, k);
  const permCount = generator.calculatePermutation(33, k);
  console.log(`选${k}个数字的组合数：${comboCount.toLocaleString()} 种`);
  console.log(`选${k}个数字的排列数：${permCount.toLocaleString()} 种`);

  // 生成组合（带进度反馈）
  const allCombos = generator.generateCombinations(k, (current, total, percent) => {
   // console.log(`组合生成进度：${current.toLocaleString()}/${total.toLocaleString()} (${percent}%)`);
  });
  //repeatMax2([2,6,22,23,24,28],ssqHistory)
  const filterList = allCombos.filter(item=>repeatMax2(item,ssqHistory));
  console.log(1111,filterList);
  // 格式化输出前10个组合
  //console.log(generator.formatResults(allCombos, 10));

  // 3. 示例2：生成单个组合的排列（演示用，k=3避免数量过大）
//   console.log("\n=== 生成组合 [1,2,3] 的所有排列 ===");
//   const singleCombo = [1, 2, 3];
//   const comboPerms = generator.generatePermutationsOfCombo(singleCombo);
//   console.log(generator.formatResults(comboPerms));

} catch (error) {
  console.error("执行出错：", error.message);
}