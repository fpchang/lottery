import {dltHistory} from "../../../common/dlt.js";
/**
 * 后区两码组合遗漏值计算器
 * 功能：计算后区两个号码组合的当前遗漏、历史最大遗漏，支持排序
 */
class BackPairOmissionCalculator {
  /**
   * 构造函数
   * @param {number[][]} historyData 后区历史开奖记录（每一期为2个号码的数组，如 [[01,02], [03,04], ...]）
   * @param {number} maxBackNum 后区号码最大值（默认12，大乐透规则）
   */
  constructor(historyData, maxBackNum = 12) {
    this.maxBackNum = maxBackNum; // 后区最大号码
    this.allPairs = this.generateAllBackPairs(); // 所有合法的后区两码组合
    this.historyData = this.validateAndNormalizeHistory(historyData); // 验证并标准化历史数据
    this.omissionData = this.initOmissionData(); // 初始化组合遗漏数据
    this.calculatePairOmission(); // 计算组合遗漏值
  }

  /**
   * 生成所有合法的后区两码组合（不考虑顺序、不重复）
   * @returns {string[]} 所有组合（格式："01,02"）
   */
  generateAllBackPairs() {
    const pairs = [];
    // 生成C(n,2)组合，n=maxBackNum
    for (let i = 1; i <= this.maxBackNum; i++) {
      for (let j = i + 1; j <= this.maxBackNum; j++) {
        // 标准化为两位数字符串，排序后拼接（如 1和2 → "01,02"）
        const num1 = i.toString().padStart(2, '0');
        const num2 = j.toString().padStart(2, '0');
        pairs.push(`${num1},${num2}`);
      }
    }
    return pairs;
  }

  /**
   * 验证并标准化历史开奖数据
   * @param {number[][]} data 原始历史数据
   * @returns {string[]} 标准化后的每期组合（格式："01,02"）
   */
  validateAndNormalizeHistory(data) {
    if (!Array.isArray(data)) throw new Error("历史数据必须是数组格式");

    const normalizedHistory = [];
    data.forEach((period, index) => {
      // 验证单期必须是2个后区号码
      if (!Array.isArray(period) || period.length !== 2) {
        throw new Error(`第${index + 1}期数据错误：需包含2个后区号码`);
      }

      // 验证号码合法性（1~maxBackNum，整数）
      const validNums = period.map(num => {
        const n = Number(num);
        if (!Number.isInteger(n) || n < 1 || n > this.maxBackNum) {
          throw new Error(`第${index + 1}期包含无效后区号码：${num}（需为1~${this.maxBackNum}的整数）`);
        }
        return n.toString().padStart(2, '0');
      });

      // 验证两个号码不重复
      if (validNums[0] === validNums[1]) {
        throw new Error(`第${index + 1}期后区号码包含重复值`);
      }

      // 排序后拼接为统一格式（如 [02,01] → "01,02"）
      const sortedPair = validNums.sort().join(",");
      normalizedHistory.push(sortedPair);
    });

    return normalizedHistory;
  }

  /**
   * 初始化每个两码组合的遗漏数据
   * @returns {object} 初始化数据，如 { "01,02": { current: 0, max: 0, lastHitPeriod: -1 }, ... }
   */
  initOmissionData() {
    const omission = {};
    this.allPairs.forEach(pair => {
      omission[pair] = {
        currentOmission: 0, // 当前遗漏值
        maxOmission: 0,     // 历史最大遗漏值
        lastHitPeriod: -1   // 上一次开出的期数（-1表示从未开出）
      };
    });
    return omission;
  }

  /**
   * 核心计算：遍历历史记录，统计每个两码组合的遗漏值
   */
  calculatePairOmission() {
    const totalPeriods = this.historyData.length;

    // 逐期遍历（从第1期到最后一期）
    this.historyData.forEach((periodPair, periodIndex) => {
      const currentPeriod = periodIndex + 1; // 期数从1开始

      // 遍历所有两码组合，更新遗漏值
      this.allPairs.forEach(pair => {
        const pairData = this.omissionData[pair];

        // 判断当前期是否开出该组合（完全匹配）
        if (pair === periodPair) {
          // 开出：重置当前遗漏，记录开出期数
          pairData.currentOmission = 0;
          pairData.lastHitPeriod = currentPeriod;
        } else {
          // 未开出：当前遗漏+1
          pairData.currentOmission += 1;

          // 更新历史最大遗漏（如果当前遗漏超过历史最大值）
          if (pairData.currentOmission > pairData.maxOmission) {
            pairData.maxOmission = pairData.currentOmission;
          }
        }
      });
    });

    // 补充：从未开出的组合，当前遗漏 = 总期数，历史最大遗漏 = 总期数
    this.allPairs.forEach(pair => {
      const pairData = this.omissionData[pair];
      if (pairData.lastHitPeriod === -1) {
        pairData.currentOmission = totalPeriods;
        pairData.maxOmission = totalPeriods;
      }
    });
  }

  /**
   * 按指定维度排序组合遗漏数据
   * @param {string} sortBy 排序维度：currentOmission / maxOmission
   * @param {string} order 排序顺序：asc（升序）/ desc（降序）
   * @returns {object[]} 排序后的数组，如 [{ pair: "01,02", currentOmission: 5, maxOmission: 20 }, ...]
   */
  sortOmissionData(sortBy = 'currentOmission', order = 'desc') {
    // 校验排序维度和顺序
    const validSortBy = ['currentOmission', 'maxOmission'];
    const validOrder = ['asc', 'desc'];
    if (!validSortBy.includes(sortBy)) {
      throw new Error(`排序维度错误，仅支持：${validSortBy.join(", ")}`);
    }
    if (!validOrder.includes(order)) {
      throw new Error(`排序顺序错误，仅支持：${validOrder.join(", ")}`);
    }

    // 转换为数组便于排序
    const omissionArray = Object.entries(this.omissionData).map(([pair, data]) => ({
      pair, // 两码组合
      currentOmission: data.currentOmission,
      maxOmission: data.maxOmission,
      lastHitPeriod: data.lastHitPeriod
    }));

    // 执行排序
    omissionArray.sort((a, b) => {
      if (order === 'asc') {
        return a[sortBy] - b[sortBy];
      } else {
        return b[sortBy] - a[sortBy];
      }
    });

    return omissionArray;
  }

  /**
   * 格式化输出组合遗漏数据（支持分页，避免输出过多）
   * @param {object[]} sortedData 排序后的遗漏数据
   * @param {number} pageSize 每页展示数量（默认10）
   * @returns {string} 格式化字符串
   */
  formatOmissionData(sortedData, pageSize = 10) {
    const totalPairs = this.allPairs.length;
    const totalPages = Math.ceil(sortedData.length / pageSize);

    let output = `==== 后区两码组合遗漏值统计（总组合数：${totalPairs}）====
┌───────────┬──────────────┬──────────────┬──────────────┐
│  两码组合  │ 当前遗漏（期）│ 历史最大遗漏 │ 上一次开出期数 │
├───────────┼──────────────┼──────────────┼──────────────┤
`;

    // 仅展示第一页数据（避免输出66条冗余信息）
    const pageData = sortedData.slice(0, pageSize);
    pageData.forEach(item => {
      const lastHit = item.lastHitPeriod === -1 ? "从未开出" : item.lastHitPeriod;
      output += `│  ${item.pair.padEnd(7)} │  ${item.currentOmission.toString().padEnd(10)} │  ${item.maxOmission.toString().padEnd(10)} │  ${lastHit.toString().padEnd(10)} │
`;
    });

    output += `└───────────┴──────────────┴──────────────┴──────────────┘
注：1. 当前遗漏 = 该组合从上一次完整开出到最新一期的未开出期数；
    2. 历史最大遗漏 = 该组合历史最长未开出期数；
    3. 本次展示前${pageSize}条（共${totalPages}页），可调整pageSize查看更多
`;

    return output.trim();
  }
}

// ===================== 示例使用 =====================
try {
  // 1. 模拟大乐透后区历史开奖记录（每期2个号码，共8期）
  const historyBackData = dltHistory.map(item=>item.blueBall);

  // 2. 创建计算器实例（大乐透后区规则：号码01-12）
  const pairOmissionCalc = new BackPairOmissionCalculator(historyBackData);

  // 3. 按「当前遗漏」降序排序（遗漏值越大，越久未开出）
  const sortedByCurrent = pairOmissionCalc.sortOmissionData('currentOmission', 'desc');
  console.log("=== 按当前遗漏降序排序（前10条）===");
  console.log(pairOmissionCalc.formatOmissionData(sortedByCurrent, 10));

  // 4. 按「历史最大遗漏」升序排序
  const sortedByMax = pairOmissionCalc.sortOmissionData('maxOmission', 'desc');
  //console.log("最大遗漏",sortedByMax)
  console.log("\n=== 按历史最大遗漏升序排序（前10条）===");
  console.log(pairOmissionCalc.formatOmissionData(sortedByMax, 10));

} catch (error) {
  console.error("计算出错：", error.message);
}