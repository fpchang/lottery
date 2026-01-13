import { historyKl8 } from "../../../common/kl8.js";
const happy8History1 = [
  { period: 2025285, numbers: [5,6,7,9,11,19,24,29,39,41,45,46,63,67,68,73,80,12,15,22] },
  { period: 2025286, numbers: [6,12,14,16,22,24,25,30,37,39,42,43,54,57,58,61,62,68,74,18] },
  { period: 2025287, numbers: [1,6,17,18,21,22,23,24,31,32,40,43,48,49,52,57,58,60,68,79] },
  // ... 补充更多历史数据
];
const happy8History=historyKl8.map(item=>{
    return {period:item.index,numbers:item.redBall}
})
/**
 * 快乐8选3组合遗漏分析算法
 * 选3组合总数：C(80,3) = 80×79×78/(3×2×1) = 82160 种
 * 核心指标：历史最大遗漏、平均遗漏、当前遗漏
 * 性能优化：分批计算 + 内存管理
 */

// ===================== 1. 配置与工具函数 =====================
// 快乐8号码范围
const NUMBER_RANGE = { min: 1, max: 80 };
// 选3组合（可调整为选2/选4等）
const SELECT_COUNT = 3;

/**
 * 生成选N组合（组合数学：C(n,k)）
 * @param {number} n - 总数（快乐8为80）
 * @param {number} k - 选取数（选3为3）
 * @param {number} start - 起始号码
 * @param {Array} current - 当前组合
 * @returns {Array} 所有组合的二维数组
 */
function generateCombinations(n, k, start = 1, current = []) {
  const result = [];
  
  // 递归终止条件：当前组合长度等于选取数
  if (current.length === k) {
    return [current.slice()];
  }
  
  // 剪枝优化：剩余号码足够组成组合
  const remaining = k - current.length;
  for (let i = start; i <= n - remaining + 1; i++) {
    current.push(i);
    result.push(...generateCombinations(n, k, i + 1, current));
    current.pop();
  }
  
  return result;
}

/**
 * 格式化组合为字符串（作为对象键名，避免重复）
 * @param {Array} combo - 数字组合，如 [1,5,8]
 * @returns {String} 格式化键名，如 "1-5-8"
 */
function formatComboKey(combo) {
  return combo.sort((a, b) => a - b).join('-');
}

/**
 * 检查当期开奖是否包含指定选N组合
 * @param {Array} drawNumbers - 当期20个开奖号码
 * @param {Array} combo - 选N组合，如 [1,5,8]
 * @returns {Boolean} 是否包含该组合
 */
function containsCombo(drawNumbers, combo) {
  // 优化：将开奖号码转为Set，提升查询效率
  const drawSet = new Set(drawNumbers);
  return combo.every(num => drawSet.has(num));
}

/**
 * 分批处理组合（避免内存溢出）
 * @param {Array} allCombos - 所有组合
 * @param {number} batchSize - 每批处理数量
 * @returns {Array} 分批后的组合数组
 */
function batchCombos(allCombos, batchSize = 10000) {
  const batches = [];
  for (let i = 0; i < allCombos.length; i += batchSize) {
    batches.push(allCombos.slice(i, i + batchSize));
  }
  return batches;
}

// ===================== 2. 核心遗漏计算逻辑 =====================
/**
 * 计算快乐8选N组合的遗漏数据
 * @param {Array} history - 历史开奖数据 [{period: 期号, numbers: [20个开奖号码]}, ...]
 * @returns {Object} 所有组合的遗漏统计
 */
function calculateHappy8Omission(history) {
  // 步骤1：生成所有选3组合（82160种）
  console.log(`开始生成选${SELECT_COUNT}组合...`);
  const allCombos = generateCombinations(NUMBER_RANGE.max, SELECT_COUNT);
  console.log(`组合生成完成，共 ${allCombos.length} 种`);

  // 步骤2：分批初始化组合统计数据（避免内存溢出）
  const comboBatches = batchCombos(allCombos);
  let allStats = {};
  
  // 初始化每批组合的统计数据
  comboBatches.forEach((batch, batchIndex) => {
    console.log(`初始化第 ${batchIndex + 1}/${comboBatches.length} 批组合...`);
    batch.forEach(combo => {
      const key = formatComboKey(combo);
      allStats[key] = {
        combo: combo,                // 原始组合
        currentOmission: 0,          // 当前遗漏（核心）
        maxOmission: 0,              // 历史最大遗漏
        avgOmission: 0,              // 平均遗漏
        omissionRecords: [],         // 所有遗漏周期记录
        hitCount: 0,                 // 命中次数
        lastHitPeriod: null,         // 最后命中期号
        totalPeriods: history.length // 总期数
      };
    });
  });

  // 步骤3：逐期遍历历史数据，更新遗漏（核心逻辑）
  console.log('开始遍历历史数据计算遗漏...');
  history.forEach((draw, index) => {
    const { period, numbers } = draw;
    
    // 3.1 所有组合的当前遗漏 +1（未命中则遗漏递增）
    Object.values(allStats).forEach(stat => {
      stat.currentOmission++;
    });

    // 3.2 检查当期命中的组合，重置遗漏并记录
    Object.keys(allStats).forEach(key => {
      const stat = allStats[key];
      if (containsCombo(numbers, stat.combo)) {
        // 记录本次遗漏周期
        stat.omissionRecords.push(stat.currentOmission);
        // 更新命中次数和最后命中期号
        stat.hitCount++;
        stat.lastHitPeriod = period;
        // 重置当前遗漏为0（命中当期遗漏归0）
        stat.currentOmission = 0;
      }
    });

    // 进度提示（每100期输出一次）
    if ((index + 1) % 100 === 0) {
      console.log(`已处理 ${index + 1}/${history.length} 期数据`);
    }
  });

  // 步骤4：计算每个组合的最大/平均遗漏
  console.log('开始计算统计指标...');
  Object.values(allStats).forEach(stat => {
    const { omissionRecords, totalPeriods } = stat;

    if (omissionRecords.length === 0) {
      // 从未命中的组合
      stat.maxOmission = totalPeriods;
      stat.avgOmission = 0;
      stat.currentOmission = totalPeriods; // 当前遗漏=总期数
      stat.lastHitPeriod = '从未命中';
    } else {
      // 计算最大遗漏
      stat.maxOmission = Math.max(...omissionRecords);
      // 计算平均遗漏（保留2位小数）
      const sum = omissionRecords.reduce((total, num) => total + num, 0);
      stat.avgOmission = parseFloat((sum / omissionRecords.length).toFixed(2));
      // 当前遗漏已在遍历中实时更新，无需额外计算
    }
  });

  console.log('遗漏计算完成！');
  return allStats;
}

// ===================== 3. 数据准备与使用示例 =====================
// 示例：快乐8历史开奖数据（按时间从早到晚排序，最新一期在最后）


// 执行遗漏计算
const omissionResult = calculateHappy8Omission(happy8History);

// ===================== 4. 实用查询函数 =====================
/**
 * 查询指定选3组合的遗漏数据
 * @param {number} num1 - 号码1
 * @param {number} num2 - 号码2
 * @param {number} num3 - 号码3
 * @returns {Object} 遗漏统计结果
 */
function queryComboOmission(num1, num2, num3) {
  const combo = [num1, num2, num3];
  const key = formatComboKey(combo);
  const stat = omissionResult[key];
  
  if (!stat) {
    return { error: '组合不存在，请输入1-80之间的有效号码' };
  }
  
  // 返回核心指标（简化展示）
  return {
    选3组合: stat.combo.join(','),
    当前遗漏: stat.currentOmission,
    历史最大遗漏: stat.maxOmission,
    平均遗漏: stat.avgOmission,
    命中次数: stat.hitCount,
    最后命中期号: stat.lastHitPeriod || '从未命中',
    总期数: stat.totalPeriods
  };
}

/**
 * 获取当前遗漏最大的前N个组合
 * @param {number} topN - 前N个
 * @returns {Array} 排序后的组合列表
 */
function getTopCurrentOmission(topN = 10) {
  return Object.values(omissionResult)
    .sort((a, b) => b.currentOmission - a.currentOmission)
    .slice(0, topN)
    .map(stat => ({
      组合: stat.combo.join(','),
      当前遗漏: stat.currentOmission,
      历史最大遗漏: stat.maxOmission,
      平均遗漏: stat.avgOmission
    }));
}
/**
 * 获取历史遗漏最大的前N个组合
 * @param {number} topN - 前N个
 * @returns {Array} 排序后的组合列表
 */
function getTopHistoryOmission(topN = 10) {
  return Object.values(omissionResult)
    .sort((a, b) => b.maxOmission - a.maxOmission)
    .slice(0, topN)
    .map(stat => ({
      组合: stat.combo.join(','),
      当前遗漏: stat.currentOmission,
      历史最大遗漏: stat.maxOmission,
      平均遗漏: stat.avgOmission
    }));
}
// ===================== 5. 使用示例 =====================
// 示例1：查询指定选3组合的遗漏数据
//const combo1_6_22 = queryComboOmission(1, 6, 22);
//console.log('选3组合 [1,6,22] 的遗漏数据：', combo1_6_22);

// 示例2：获取当前遗漏最大的前5个组合
const top5CurrentOmission = getTopCurrentOmission(15);
console.log('当前遗漏最大的前15个选3组合：', top5CurrentOmission);

const top5HistoryOmission = getTopHistoryOmission(15);
console.log('历史遗漏最大的前15个选3组合：', top5HistoryOmission);

// 示例3：导出所有组合数据为JSON（可保存为文件）
// const exportJson = JSON.stringify(omissionResult, null, 2);
// console.log('所有组合遗漏数据JSON：', exportJson);