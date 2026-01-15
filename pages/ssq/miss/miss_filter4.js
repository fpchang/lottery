import {ssqHistory} from "../../../common/ssq.js";
const historyRedData =ssqHistory.map(item=>item.redBall);
/**
 * 双色球红球全组合筛选工具
 * 功能：计算所有符合条件的红球组合（未开出+与历史重复≤2个数字）
 */
class DoubleColorBallRedFilter {
  /**
   * 构造函数
   * @param {number[][]} historyRedData 历史红球记录，格式如 [[1,2,3,4,5,6], [7,8,9,10,11,12], ...]
   */
  constructor(historyRedData) {
    // 验证并标准化历史红球数据（排序、去重、校验规则）
    this.historyRedData = this.validateHistoryRedData(historyRedData);
    // 历史组合转为Set，用于快速判断是否已开出（字符串形式）
    this.historyRedSet = new Set(
      this.historyRedData.map(combo => combo.join(","))
    );
    // 存储最终符合条件的组合
    this.validCombos = [];
  }

  /**
   * 验证历史红球数据合法性
   * @param {number[][]} data 原始历史红球数据
   * @returns {number[][]} 标准化后的合法数据（排序后的6位红球）
   */
  validateHistoryRedData(data) {
    if (!Array.isArray(data)) throw new Error("历史红球数据必须是数组格式");

    const normalized = [];
    const seen = new Set(); // 去重历史重复期数

    data.forEach((combo, index) => {
      // 验证组合长度
      if (!Array.isArray(combo) || combo.length !== 6) {
        throw new Error(`第${index+1}期红球数据错误：必须包含6个数字`);
      }

      // 验证每个数字：1-33、整数、不重复
      const validNums = combo.filter(num => num >= 1 && num <= 33 && Number.isInteger(num));
      const uniqueNums = [...new Set(validNums)];
      if (uniqueNums.length !== 6) {
        throw new Error(`第${index+1}期红球数据错误：必须是6个1-33的不重复整数`);
      }

      // 排序并去重重复的历史期数
      const sortedCombo = uniqueNums.sort((a, b) => a - b);
      const comboStr = sortedCombo.join(",");
      if (!seen.has(comboStr)) {
        seen.add(comboStr);
        normalized.push(sortedCombo);
      }
    });

    return normalized;
  }

  /**
   * 计算两个红球组合的重复数字个数
   * @param {number[]} combo 待检测组合
   * @param {number[]} historyCombo 历史组合
   * @returns {number} 重复数
   */
  countDuplicates(combo, historyCombo) {
    // 用Set提升查找效率
    const historySet = new Set(historyCombo);
    return combo.filter(num => historySet.has(num)).length;
  }

  /**
   * 检查单个红球组合是否符合条件
   * @param {number[]} combo 待检查的6位红球组合
   * @returns {boolean} 是否符合条件
   */
  isComboValid(combo) {
    const comboStr = combo.join(",");
    // 条件1：未在历史中出现过
    if (this.historyRedSet.has(comboStr)) return false;

    // 条件2：与所有历史组合重复数≤2
    for (const historyCombo of this.historyRedData) {
      const duplicateCount = this.countDuplicates(combo, historyCombo);
      if (duplicateCount > 3) return false;
    }

    return true;
  }

  /**
   * 生成C(n,k)组合的核心函数（按字典序生成）
   * @param {number} n 总数（如33）
   * @param {number} k 选取数（如6）
   * @param {function} progressCallback 进度回调函数 (current, total)
   */
  generateCombinations(n, k, progressCallback) {
    const total = this.calculateCombination(33, 6); // 总组合数：1107568
    let currentCount = 0;
    const result = [];

    // 初始化组合索引 [0,1,2,3,4,5]（对应数字1-6）
    const indices = Array.from({ length: k }, (_, i) => i);

    while (true) {
      // 将索引转为实际数字（+1）
      const combo = indices.map(i => i + 1);
      // 检查是否符合条件
      if (this.isComboValid(combo)) {
        result.push(combo);
      }

      // 进度反馈（每10000个组合更新一次，避免性能损耗）
      currentCount++;
      if (currentCount % 10000 === 0) {
        progressCallback(currentCount, total);
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
    progressCallback(total, total);
    return result;
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
    k = Math.min(k, n - k); // 优化计算：C(n,k)=C(n,n-k)
    let result = 1;
    for (let i = 1; i <= k; i++) {
      result = result * (n - k + i) / i;
    }
    return Math.round(result);
  }

  /**
   * 主方法：计算所有符合条件的红球组合
   * @param {function} progressCallback 进度回调 (current, total, percent)
   * @returns {number[][]} 所有符合条件的组合
   */
  calculateAllValidCombos(progressCallback) {
    const totalCombos = this.calculateCombination(33, 6);
    console.log(`开始计算，总红球组合数：${totalCombos.toLocaleString()} 种`);
    console.log(`历史红球期数：${this.historyRedData.length} 期`);

    // 包装进度回调，增加百分比
    const wrappedProgress = (current, total) => {
      const percent = ((current / total) * 100).toFixed(2);
      progressCallback?.(current, total, percent);
    };

    // 生成并筛选所有组合
    this.validCombos = this.generateCombinations(33, 6, wrappedProgress);

    console.log(`计算完成！符合条件的组合数：${this.validCombos.length.toLocaleString()} 种`);
    return this.validCombos;
  }

  /**
   * 导出结果（格式化）
   * @returns {string} 所有符合条件的组合字符串，每行一个
   */
  exportResults() {
    return this.validCombos
      .map((combo, index) => `组合${index+1}：${combo.join(", ")}`)
      .join("\n");
  }
}

// ===================== 示例使用 =====================
// 1. 模拟历史红球记录（实际使用时替换为真实数据）
// const historyRedData = [
//   [1, 5, 8, 12, 25, 30],
//   [3, 7, 15, 22, 28, 33],
//   [2, 9, 18, 27, 31, 32],
//   [6, 11, 20, 23, 26, 34], // 注意：34是无效值，验证时会报错，仅作示例
//   [4, 10, 19, 24, 29, 33]
// ];

try {
  // 2. 创建筛选实例
  const redFilter = new DoubleColorBallRedFilter(historyRedData);

  // 3. 计算所有符合条件的组合（带进度反馈）
  const validCombos = redFilter.calculateAllValidCombos((current, total, percent) => {
    console.log(`进度：${current.toLocaleString()}/${total.toLocaleString()} (${percent}%)`);
  });

  // 4. 输出前10个符合条件的组合（避免输出过多）
  console.log("\n前10个符合条件的红球组合：");
  validCombos.forEach((combo, index) => {
    console.log(`组合${index+1}：${combo.join(", ")}`);
  });

  // 5. 可选：导出所有结果到字符串
  // const allResults = redFilter.exportResults();
  // console.log("\n所有符合条件的组合：\n", allResults);
} catch (error) {
  console.error("执行出错：", error.message);
}