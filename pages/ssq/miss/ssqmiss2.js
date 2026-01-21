import {ssqHistory} from "../../../common/ssq.js";
const lotteryHistory =ssqHistory.map(item=>{
  return { period: item.index, frontNumbers: item.redBall }
});
/**
 * 大乐透前区两两组合遗漏分析算法（含当前遗漏）
 * 前区号码范围：1-33，两两组合共 C(33,2) = 595 种
 * 新增：当前遗漏值（组合距离最近一次开出的期数）
 */

// ===================== 1. 数据定义与工具函数 =====================
// 示例：大乐透历史开奖数据（按时间从早到晚排序！最新一期在最后）
// 格式：[{period: 期号, frontNumbers: [前区号码数组]}, ...]
// const lotteryHistory = [
//   { period: 25119, frontNumbers: [8, 15, 27, 29, 31] },  // 最早一期
//   { period: 25118, frontNumbers: [2, 8, 9, 12, 21] },
//   { period: 25120, frontNumbers: [11, 13, 22, 26, 33] },
//   { period: 25121, frontNumbers: [2, 3, 8, 13, 21] },
//   { period: 25122, frontNumbers: [2, 3, 6, 16, 17] },    // 最新一期
//   // ... 更多历史数据
// ];

/**
 * 生成所有两两组合（如 [1,2], [1,3]...[34,33]）
 * @returns {Array} 所有组合的数组，每个元素为 [num1, num2]
 */
function generateAllCombinations() {
  const combinations = [];
  for (let i = 1; i <= 33; i++) {
    for (let j = i + 1; j <= 33; j++) {
      combinations.push([i, j]);
    }
  }
  return combinations;
}

/**
 * 检查某期开奖是否包含指定组合
 * @param {Array} drawNumbers - 当期前区号码数组
 * @param {Array} combination - 待检查的组合 [num1, num2]
 * @returns {Boolean} 是否包含该组合
 */
function hasCombination(drawNumbers, combination) {
  const [num1, num2] = combination;
  return drawNumbers.includes(num1) && drawNumbers.includes(num2);
}

/**
 * 格式化组合为字符串（用于作为对象键名）
 * @param {Array} combination - [num1, num2]
 * @returns {String} 格式化后的字符串，如 "1-2"
 */
function formatCombination(combination) {
  return combination.sort((a, b) => a - b).join('-');
}

// ===================== 2. 核心遗漏计算逻辑（新增当前遗漏） =====================
/**
 * 计算所有组合的遗漏数据（含当前遗漏）
 * @param {Array} history - 历史开奖数据数组（按时间从早到晚排序）
 * @returns {Object} 包含所有组合遗漏统计的对象
 */
function calculateCombinationOmission(history) {
  // 初始化所有组合的遗漏统计
  const allCombinations = generateAllCombinations();
  const omissionStats = {};
  
  // 初始化每个组合的统计数据
  allCombinations.forEach(comb => {
    const key = formatCombination(comb);
    omissionStats[key] = {
      combination: comb,          // 组合本身（如 [2,3]）
      omissionRecords: [],        // 所有遗漏周期记录（命中时的遗漏值）
      currentOmission: 0,         // 当前遗漏值（核心新增）
      maxOmission: 0,             // 最大遗漏
      minOmission: Infinity,      // 最小遗漏
      avgOmission: 0,             // 平均遗漏
      hitCount: 0,                // 命中次数
      lastHitPeriod: null,        // 最后一次命中的期号（辅助计算）
      totalPeriods: history.length // 总期数
    };
  });

  // 遍历历史开奖数据，逐期更新遗漏
  history.forEach((draw, index) => {
    const { frontNumbers, period } = draw;
    
    // 1. 先给所有组合的「当前遗漏」+1（未命中则遗漏+1）
    Object.values(omissionStats).forEach(stat => {
      stat.currentOmission++;
    });

    // 2. 检查当期命中的组合，重置遗漏并记录最后命中期号
    allCombinations.forEach(comb => {
      const key = formatCombination(comb);
      const stat = omissionStats[key];
      
      if (hasCombination(frontNumbers, comb)) {
        // 记录本次遗漏周期（命中时的遗漏值）
        stat.omissionRecords.push(stat.currentOmission);
        // 更新命中次数和最后命中期号
        stat.hitCount++;
        stat.lastHitPeriod = period;
        // 重置当前遗漏为0（命中当期遗漏归0）
        stat.currentOmission = 0;
      }
    });
  });

  // 3. 计算每个组合的最大/最小/平均遗漏
  Object.values(omissionStats).forEach(stat => {
    const { omissionRecords, totalPeriods } = stat;
    
    if (omissionRecords.length === 0) {
      // 从未命中的组合：当前遗漏=总期数，最大遗漏=总期数
      stat.maxOmission = totalPeriods;
      stat.minOmission = 0;
      stat.avgOmission = 0;
      stat.currentOmission = totalPeriods; // 从未命中，当前遗漏=总期数
    } else {
      // 计算最大遗漏
      stat.maxOmission = Math.max(...omissionRecords);
      // 计算最小遗漏（排除0，取有效遗漏值）
      const validOmissions = omissionRecords.filter(o => o > 0);
      stat.minOmission = validOmissions.length > 0 ? Math.min(...validOmissions) : 0;
      // 计算平均遗漏（保留2位小数）
      const sum = omissionRecords.reduce((total, num) => total + num, 0);
      stat.avgOmission = parseFloat((sum / omissionRecords.length).toFixed(2));
      // 当前遗漏已在遍历中实时更新，无需额外计算
    }

    // 补充：格式化最后命中期号（提升可读性）
    stat.lastHitPeriod = stat.lastHitPeriod || '从未命中';
  });

  return omissionStats;
}

// ===================== 3. 使用示例 =====================
// 执行遗漏计算（注意：history必须按时间从早到晚排序）
const result = calculateCombinationOmission(lotteryHistory);

// 示例1：查询指定组合的完整遗漏数据（含当前遗漏）
function getCombinationStats(num1, num2) {
  const key = formatCombination([num1, num2]);
  const stat = result[key];
  
  if (!stat) return { error: '组合不存在' };
  
  // 返回核心统计值（简化展示）
  return {
    组合: stat.combination,
    当前遗漏: stat.currentOmission,
    最大遗漏: stat.maxOmission,
    最小遗漏: stat.minOmission,
    平均遗漏: stat.avgOmission,
    命中次数: stat.hitCount,
    最后命中期号: stat.lastHitPeriod,
    总期数: stat.totalPeriods
  };
}

// 查询 [2,3] 组合的遗漏数据（含当前遗漏）
//const combo2_3 = getCombinationStats(2, 3);
//console.log('组合 [2,3] 的完整遗漏数据：', combo2_3);

// 示例2：获取当前遗漏最大的前5个组合
const sortedByCurrentOmission = Object.values(result)
  .sort((a, b) => b.currentOmission - a.currentOmission)
  .slice(0, 30)
  .map(stat => ({
    组合: stat.combination,
    当前遗漏: stat.currentOmission,
    最大遗漏: stat.maxOmission,
    平均遗漏: stat.avgOmission,
    最后命中期号: stat.lastHitPeriod
  }));

console.log('当前遗漏最大的前30个组合：', sortedByCurrentOmission);


const sortedByCurrentOmission2 = Object.values(result)
  .sort((a, b) => b.maxOmission - a.maxOmission)
  .slice(0, 30)
  .map(stat => ({
    组合: stat.combination,
    当前遗漏: stat.currentOmission,
    最大遗漏: stat.maxOmission,
    平均遗漏: stat.avgOmission,
    最后命中期号: stat.lastHitPeriod
  }));

console.log('历史最大的前30个组合：', sortedByCurrentOmission2);

// 示例3：导出所有组合数据为JSON（含当前遗漏）
const exportData = JSON.stringify(result, null, 2);
//console.log('所有组合遗漏数据（JSON）：', exportData);