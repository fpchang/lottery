import { dltHistory } from "../../common/dlt.js";
const historyData =dltHistory.map(item=>{
    return item.redBall
})

/**
 * 大乐透5码组合筛选工具
 */
class LottoFilter {
  /**
   * 构造函数
   * @param {number[][]} historyData - 历史开奖记录，格式如 [[1,3,5,7,9], [2,4,6,8,10], ...]
   */
  constructor(historyData) {
    // 验证历史数据格式
    this.historyData = this.validateHistoryData(historyData);
  }

  /**
   * 验证历史开奖数据格式是否合法
   * @param {number[][]} data 
   * @returns {number[][]} 验证后的合法数据
   */
  validateHistoryData(data) {
    if (!Array.isArray(data)) throw new Error("历史数据必须是数组");
    
    return data.map((item, index) => {
      // 每一期必须是5个数字
      if (!Array.isArray(item) || item.length !== 5) {
        throw new Error(`第${index+1}期数据格式错误，必须包含5个数字`);
      }
      // 验证每个数字是否在1-35之间且不重复
      const uniqueNums = [...new Set(item)];
      if (uniqueNums.length !== 5) {
        throw new Error(`第${index+1}期数据包含重复数字`);
      }
      const validNums = uniqueNums.filter(num => num >= 1 && num <= 35 && Number.isInteger(num));
      if (validNums.length !== 5) {
        throw new Error(`第${index+1}期数据包含无效数字（必须是1-35的整数）`);
      }
      // 排序便于后续对比
      return validNums.sort((a, b) => a - b);
    });
  }

  /**
   * 生成一组1-35之间不重复的5个随机数
   * @returns {number[]} 排序后的5码组合
   */
  generateRandom5Nums() {
    const nums = new Set();
    // 生成5个不重复的1-35之间的数
    while (nums.size < 5) {
      const num = Math.floor(Math.random() * 35) + 1;
      nums.add(num);
    }
    // 转为数组并排序
    return [...nums].sort((a, b) => a - b);
  }

  /**
   * 计算两个5码组合之间的重复数字个数
   * @param {number[]} combo - 待检测的5码组合
   * @param {number[]} historyCombo - 历史开奖组合
   * @returns {number} 重复数字个数
   */
  countDuplicates(combo, historyCombo) {
    let count = 0;
    // 利用Set提高查找效率
    const historySet = new Set(historyCombo);
    combo.forEach(num => {
      if (historySet.has(num)) count++;
    });
    return count;
  }

  /**
   * 检查组合是否符合要求（与所有历史记录重复数≤2）
   * @param {number[]} combo - 待检测的5码组合
   * @returns {boolean} 是否符合条件
   */
  isComboValid(combo) {
    // 遍历所有历史期数，只要有一期重复数>2就不符合
    for (const historyCombo of this.historyData) {
      const duplicateCount = this.countDuplicates(combo, historyCombo);
      if (duplicateCount > 2) {
        return false;
      }
    }
    return true;
  }

  /**
   * 生成指定数量的符合条件的5码组合
   * @param {number} count - 要生成的组合数量
   * @returns {number[][]} 符合条件的组合列表
   */
  generateValidCombos(count) {
    if (count <= 0) throw new Error("生成数量必须大于0");
    
    const validCombos = [];
    // 避免无限循环，设置最大尝试次数（count * 100）
    const maxAttempts = count * 100;
    let attempts = 0;

    while (validCombos.length < count && attempts < maxAttempts) {
      attempts++;
      const randomCombo = this.generateRandom5Nums();
      // 检查是否符合条件，且未重复添加
      if (this.isComboValid(randomCombo) && 
          !validCombos.some(c => JSON.stringify(c) === JSON.stringify(randomCombo))) {
        validCombos.push(randomCombo);
      }
    }

    if (validCombos.length < count) {
      console.warn(`仅生成了${validCombos.length}个符合条件的组合（尝试次数已达上限）`);
    }

    return validCombos;
  }
}

// ===================== 示例使用 =====================
// 1. 模拟大乐透历史开奖记录（实际使用时替换为真实数据）
// const historyData = [
//   [1, 5, 8, 12, 25],
//   [3, 7, 15, 22, 30],
//   [2, 9, 18, 27, 33],
//   [4, 10, 19, 28, 35],
//   [6, 11, 20, 29, 34]
// ];

// 2. 创建筛选实例
const lottoFilter = new LottoFilter(historyData);

// 3. 生成10个符合条件的5码组合
const validCombos = lottoFilter.generateValidCombos(10);

// 4. 输出结果
console.log("符合条件的5码组合（与历史重复≤2个数字）：");
validCombos.forEach((combo, index) => {
  console.log(`组合${index+1}：${combo.join(", ")}`);
});