import {dltHistory} from "../../../common/dlt.js";
const lotteryHistory =dltHistory.map(item=>{
  return { issue: item.index, frontNumbers: item.redBall }
});
/**
 * 大乐透前区3码组合遗漏计算工具（适配数字类型号码）
 */
class Lotto3CombOmissionCalculator {
  constructor() {
    this.frontNumbers = Array.from({ length: 35 }, (_, i) => i + 1); // 前区1-35（纯数字）
    this.all3Combinations = []; // 所有3码组合
    this.omissionData = {}; // 遗漏数据存储

    // 初始化：生成所有3码组合
    this.generateAll3Combinations();
    // 初始化遗漏数据
    this.initOmissionData();
  }

  /**
   * 生成前区所有不重复的3码组合（数字类型，组合不考虑顺序）
   */
  generateAll3Combinations() {
    const combinations = [];
    // 三重循环生成C(35,3)组合，i<j<k确保不重复、不考虑顺序
    for (let i = 0; i < this.frontNumbers.length; i++) {
      for (let j = i + 1; j < this.frontNumbers.length; j++) {
        for (let k = j + 1; k < this.frontNumbers.length; k++) {
          const comb = [this.frontNumbers[i], this.frontNumbers[j], this.frontNumbers[k]];
          const combKey = comb.join('-'); // 组合唯一标识，如 "1-5-12"
          combinations.push({
            key: combKey,
            numbers: comb
          });
        }
      }
    }
    this.all3Combinations = combinations;
    console.log(`生成前区3码组合总数：${combinations.length} 种`);
  }

  /**
   * 初始化所有3码组合的遗漏数据
   */
  initOmissionData() {
    this.omissionData = {};
    this.all3Combinations.forEach(comb => {
      this.omissionData[comb.key] = {
        combination: comb.numbers, // 3码组合（数字数组）
        currentOmission: 0, // 当前遗漏（距离上次开出的期数）
        maxOmission: 0, // 历史最大遗漏
        hitCount: 0, // 开出次数（当期开奖包含该组合则计数）
        totalOmissionPeriods: 0, // 总遗漏期数
        avgOmission: 0, // 平均遗漏
        lastHitIndex: -1 // 最后一次开出的期数索引
      };
    });
  }

  /**
   * 检查当期开奖号码（数字类型）是否包含目标3码组合（不考虑顺序）
   * @param {Array} drawNumbers 当期前区开奖号码（数字数组，如 [1,5,12,23,30]）
   * @param {Array} targetComb 目标3码组合（数字数组，如 [1,5,12]）
   * @returns {Boolean} 是否包含
   */
  checkCombInDraw(drawNumbers, targetComb) {
    // 数字直接对比，无需格式转换，性能更优
    return targetComb.every(num => drawNumbers.includes(num));
  }

  /**
   * 核心计算：根据历史开奖记录（数字类型）计算所有3码组合的遗漏数据
   * @param {Array} historyData 历史开奖数据，格式：[{issue: '2026001', frontNumbers: [1,5,12,23,30]}, ...]
   */
  calculateOmission(historyData) {
    // 重置遗漏数据
    this.initOmissionData();

    // 按时间正序遍历每一期开奖数据（从最早到最新）
    historyData.forEach((draw, index) => {
      const currentFrontNumbers = draw.frontNumbers; // 当期前区5个数字号码

      // 1. 所有组合的当前遗漏+1，总遗漏期数+1
      Object.keys(this.omissionData).forEach(combKey => {
        this.omissionData[combKey].currentOmission += 1;
        this.omissionData[combKey].totalOmissionPeriods += 1;
      });

      // 2. 找出当期开奖包含的所有3码组合，重置其遗漏数据
      this.all3Combinations.forEach(comb => {
        if (this.checkCombInDraw(currentFrontNumbers, comb.numbers)) {
          const combData = this.omissionData[comb.key];
          // 更新历史最大遗漏
          combData.maxOmission = Math.max(combData.maxOmission, combData.currentOmission);
          // 重置当前遗漏为0
          combData.currentOmission = 0;
          // 增加开出次数
          combData.hitCount += 1;
          // 记录最后一次开出的期数索引
          combData.lastHitIndex = index;
        }
      });
    });

    // 3. 计算平均遗漏（总遗漏期数 / 开出次数，避免除以0）
    Object.keys(this.omissionData).forEach(combKey => {
      const data = this.omissionData[combKey];
      data.avgOmission = data.hitCount > 0
        ? Number((data.totalOmissionPeriods / data.hitCount).toFixed(2))
        : data.totalOmissionPeriods; // 从未开出的组合，平均遗漏=总遗漏期数
    });

    console.log('前区3码组合遗漏数据计算完成！');
  }

  /**
   * 对遗漏数据排序
   * @param {String} sortField 排序字段：currentOmission/maxOmission/avgOmission/hitCount
   * @param {Boolean} isDesc 是否降序（默认true）
   * @returns {Array} 排序后的结果列表
   */
  sortOmissionData(sortField, isDesc = true) {
    const sortedList = Object.values(this.omissionData).sort((a, b) => {
      if (isDesc) {
        return b[sortField] - a[sortField];
      } else {
        return a[sortField] - b[sortField];
      }
    });
    return sortedList;
  }

  /**
   * 格式化输出结果（可指定返回条数）
   * @param {Array} sortedData 排序后的数据
   * @param {Number} limit 返回条数（默认20）
   * @returns {Array} 格式化后的结果
   */
  formatResult(sortedData, limit = 20) {
    return sortedData.slice(0, limit).map(item => ({
      组合: item.combination.join(' '), // 如 "1 5 12"
      当前遗漏: item.currentOmission,
      历史最大遗漏: item.maxOmission,
      平均遗漏: item.avgOmission,
      开出次数: item.hitCount
    }));
  }
}

// ===================== 示例使用（数字类型历史数据） =====================
// 1. 模拟大乐透历史开奖数据（前区5个号码为数字类型，按时间从早到晚排序）
// const mockLottoHistory = [
//   { issue: '2026001', frontNumbers: [1, 5, 12, 23, 30] },
//   { issue: '2026002', frontNumbers: [2, 6, 13, 24, 31] },
//   { issue: '2026003', frontNumbers: [3, 7, 14, 25, 32] },
//   { issue: '2026004', frontNumbers: [4, 8, 15, 26, 33] },
//   { issue: '2026005', frontNumbers: [1, 6, 17, 28, 35] },
//   { issue: '2026006', frontNumbers: [5, 10, 18, 29, 34] },
//   { issue: '2026007', frontNumbers: [1, 5, 19, 20, 27] },
//   { issue: '2026008', frontNumbers: [8, 11, 16, 21, 22] }
// ];

// 2. 创建计算器实例
const lottoCalculator = new Lotto3CombOmissionCalculator();

// 3. 计算遗漏数据
lottoCalculator.calculateOmission(lotteryHistory);

// 4. 按历史最大遗漏降序排序，取前50条
const sortedByMaxOmission = lottoCalculator.sortOmissionData('maxOmission', true);
const formattedMaxOmission = lottoCalculator.formatResult(sortedByMaxOmission, 50);
//console.log('按历史最大遗漏降序（前20）：', formattedMaxOmission);

// 5. 按当前遗漏降序排序，取前50条
const sortedByCurrentOmission = lottoCalculator.sortOmissionData('currentOmission', true);
const formattedCurrentOmission = lottoCalculator.formatResult(sortedByCurrentOmission, 50);
console.log('按当前遗漏降序（前50）：', formattedCurrentOmission);

// 6. 开出最多的取前20条
// const sortHitCount = lottoCalculator.sortOmissionData('hitCount', true);
// const sorthitcountresult = lottoCalculator.formatResult(sortHitCount, 50);
// console.log('出现最多的（前50）：', sorthitcountresult);