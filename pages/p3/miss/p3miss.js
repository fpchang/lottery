import {historyp3} from "../../../common/p3.js"
// const mockHistoryData = [
//   { issue: '2026001', number: '123' },
  
// ];
const mockHistoryData = historyp3.map(item=>{
    return { issue: item.index, number:item.number }
})

/**
 * 排列3遗漏数据计算工具
 */
class Pl3OmissionCalculator {
  constructor() {
    // 生成排列3所有1000种组合（000-999）
    this.allCombinations = this.generateAllCombinations();
    // 初始化遗漏数据
    this.omissionData = this.initOmissionData();
  }

  /**
   * 生成000-999所有排列3组合
   * @returns {Array} 组合列表，如 ['000', '001', ..., '999']
   */
  generateAllCombinations() {
    const combinations = [];
    for (let i = 0; i < 1000; i++) {
      // 补前导零，确保3位数
      combinations.push(i.toString().padStart(3, '0'));
    }
    return combinations;
  }

  /**
   * 初始化所有组合的遗漏数据
   * @returns {Object} 初始化的遗漏数据
   */
  initOmissionData() {
    const omissionData = {};
    this.allCombinations.forEach(comb => {
      omissionData[comb] = {
        number: comb, // 组合号码
        maxOmission: 0, // 历史最大遗漏
        currentOmission: 0, // 当前遗漏
        avgOmission: 0, // 平均遗漏
        hitCount: 0, // 开出次数
        totalOmissionDays: 0, // 总遗漏天数
        lastHitIndex: -1 // 最后一次开出的期数索引
      };
    });
    return omissionData;
  }

  /**
   * 核心计算：根据历史开奖记录计算遗漏数据
   * @param {Array} historyData 历史开奖数据，格式：[{issue: '2026014', number: '589'}, ...]
   */
  calculateOmission(historyData) {
    // 重置数据
    this.omissionData = this.initOmissionData();

    // 遍历每一期开奖数据，按时间正序（从最早到最新）
    historyData.forEach((draw, index) => {
      const drawNumber = draw.number.padStart(3, '0'); // 确保3位数

      // 1. 先更新所有组合的当前遗漏（每过一期，所有组合遗漏+1）
      this.allCombinations.forEach(comb => {
        this.omissionData[comb].currentOmission += 1;
        // 累计总遗漏天数（用于计算平均遗漏）
        this.omissionData[comb].totalOmissionDays += 1;
      });

      // 2. 如果当前期开出了某个组合，重置该组合的当前遗漏，并更新相关数据
      if (this.omissionData[drawNumber]) {
        const hitComb = this.omissionData[drawNumber];
        // 更新历史最大遗漏
        hitComb.maxOmission = Math.max(hitComb.maxOmission, hitComb.currentOmission);
        // 重置当前遗漏为0
        hitComb.currentOmission = 0;
        // 增加开出次数
        hitComb.hitCount += 1;
        // 记录最后一次开出的索引
        hitComb.lastHitIndex = index;
      }
    });

    // 3. 计算平均遗漏（总遗漏天数 / 开出次数，避免除以0）
    this.allCombinations.forEach(comb => {
      const data = this.omissionData[comb];
      data.avgOmission = data.hitCount > 0 
        ? Number((data.totalOmissionDays / data.hitCount).toFixed(2)) 
        : data.totalOmissionDays; // 从未开出的组合，平均遗漏等于总遗漏天数
    });

    console.log('遗漏数据计算完成！');
  }

  /**
   * 对遗漏数据进行排序
   * @param {String} sortField 排序字段：maxOmission(最大遗漏) / avgOmission(平均遗漏)
   * @param {Boolean} isDesc  是否降序（默认true，从大到小）
   * @returns {Array} 排序后的结果列表
   */
  sortOmissionData(sortField, isDesc = true) {
    // 转换为数组并排序
    const sortedList = Object.values(this.omissionData).sort((a, b) => {
      if (isDesc) {
        return b[sortField] - a[sortField];
      } else {
        return a[sortField] - b[sortField];
      }
    });

    // 返回前20条（可根据需要调整），便于查看
    return sortedList.slice(0, 400);
  }

  /**
   * 格式化输出结果
   * @param {Array} sortedData 排序后的数据
   * @param {String} sortType 排序类型说明
   */
  printResult(sortedData, sortType) {
    console.log(`\n===== 排列3${sortType}排序（前20名）=====`);
    console.log('号码 | 最大遗漏 | 当前遗漏 | 平均遗漏 | 开出次数');
    console.log('---------------------------------------------');
    sortedData.forEach(item => {
      console.log(
        `${item.number} | ${item.maxOmission} | ${item.currentOmission} | ${item.avgOmission} | ${item.hitCount}`
      );
    });
  }
}

// ===================== 示例使用 =====================
// 1. 模拟排列3历史开奖数据（按时间从早到晚排序）
// const mockHistoryData = [
//   { issue: '2026001', number: '123' },
//   { issue: '2026002', number: '456' },
//   { issue: '2026003', number: '789' },
//   { issue: '2026004', number: '123' },
//   { issue: '2026005', number: '000' },
//   { issue: '2026006', number: '456' },
//   { issue: '2026007', number: '888' },
//   { issue: '2026008', number: '999' },
//   { issue: '2026009', number: '111' },
//   { issue: '2026010', number: '222' },
//   { issue: '2026011', number: '333' },
//   { issue: '2026012', number: '444' },
//   { issue: '2026013', number: '555' },
//   { issue: '2026014', number: '589' }
// ];

// 2. 创建计算器实例并计算遗漏数据
const pl3Calculator = new Pl3OmissionCalculator();
pl3Calculator.calculateOmission(mockHistoryData);

// 3. 按最大遗漏降序排序并输出
// const sortedByMax = pl3Calculator.sortOmissionData('maxOmission', true);
// pl3Calculator.printResult(sortedByMax, '最大遗漏降序');

// 4. 按平均遗漏降序排序并输出
// const sortedByAvg = pl3Calculator.sortOmissionData('avgOmission', true);
// pl3Calculator.printResult(sortedByAvg, '平均遗漏降序');

// 5. （可选）按最大遗漏升序排序（遗漏最小的组合）
// const sortedByMaxAsc = pl3Calculator.sortOmissionData('maxOmission', false);
// pl3Calculator.printResult(sortedByMaxAsc, '最大遗漏升序');

// 6. 当前遗漏
const result = pl3Calculator.sortOmissionData('currentOmission', true);
pl3Calculator.printResult(result, '当前遗漏降序');
