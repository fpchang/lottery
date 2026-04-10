// Analyze top repeated Choose-10 combinations & their gaps
import { historyKl8 } from "../../../common/kl8.js";
/**
 * 快乐8 选10 出现次数最多组合 + 开出间隔（安全版，无内存溢出）
 * @param {number[][]} history 历史开奖（旧→新）
 * @param {number} topN 返回前N名
 * @returns 统计结果
 */
function analyzeTopChoose10(history, topN = 50) {
  const total = history.length;
  if (total === 0) return [];

  // 轻量存储：只存出现期数，不存冗余数据
  const combMap = new Map();

  // 遍历每期 → 生成当期10码 → 记录出现期数
  for (let idx = 0; idx < total; idx++) {
    const arr = history[idx];
    generate10Combinations(arr, (comb) => {
      const key = comb.join(',');
      if (!combMap.has(key)) combMap.set(key, []);
      const list = combMap.get(key);
      // 限制长度，避免无限存储
      if (list.length < 100) list.push(idx);
    });

    // 每100期主动释放垃圾，防止内存堆积
    if (idx % 100 === 0) global.gc && global.gc();
  }

  // 组装结果 + 计算间隔
  const result = [];
  for (const [key, periods] of combMap) {
    const gaps = [];
    for (let i = 1; i < periods.length; i++) {
      gaps.push(periods[i] - periods[i - 1]);
    }

    result.push({
      comb: key.split(',').map(Number),
      count: periods.length,
      gaps: gaps.slice(-10), // 只存最近10次间隔，大幅瘦身
      lastPeriod: periods.at(-1),
      currentMiss: total - 1 - periods.at(-1),
    });
  }

  // 按出现次数降序排列
  result.sort((a, b) => b.count - a.count);
  return result.slice(0, topN);
}

/**
 * 生成10码组合（迭代器模式，不占内存）
 */
function generate10Combinations(arr, callback) {
  const n = arr.length;
  for (let a = 0; a < n; a++)
  for (let b = a + 1; b < n; b++)
  for (let c = b + 1; c < n; c++)
  for (let d = c + 1; d < n; d++)
  for (let e = d + 1; e < n; e++)
  for (let f = e + 1; f < n; f++)
  for (let g = f + 1; g < n; g++)
  for (let h = g + 1; h < n; h++)
  for (let i = h + 1; i < n; i++)
  for (let j = i + 1; j < n; j++) {
    callback([
      arr[a], arr[b], arr[c], arr[d], arr[e],
      arr[f], arr[g], arr[h], arr[i], arr[j]
    ].sort((x, y) => x - y));
  }
}

// ==================== Usage ====================

const historyData = historyKl8.map(item=>item.redBall).slice(1500);
console.log(historyData.length)
// const history = [
//   [2,3,4,6,8,13,17,20,21,25,26,29,34,40,47,49,51,58,59,69],
//   [2,3,4,6,8,13,17,20,21,25,26,29,34,40,47,49,51,58,59,69],
//   // 这里放你所有的历史开奖...
// ];

// 统计 出现次数最多的前30组选10
const topList = analyzeTopChoose10(historyData, 30);

// 输出结果
console.log('=== 选10 出现次数最多 TOP30 ===');
topList.forEach((item, i) => {
  console.log(`第${i+1}名`);
  console.log('号码：', item.comb.join(' '));
  console.log('出现次数：', item.count);
  console.log('最近开出间隔：', item.gaps.join(' → '));
  console.log('当前遗漏：', item.currentMiss, '期');
  console.log('----------------------------------');
});