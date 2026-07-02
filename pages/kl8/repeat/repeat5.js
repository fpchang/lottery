import { historyKl8 } from "../../../common/kl8.js";
/**
 * 快乐8 选5 统计 - 出现次数最多的组合 + 开出间隔
 * 无内存溢出 / 无 Map 溢出
 * @param {number[][]} history 历史开奖数组（旧到新）
 * @param {number} topN 返回前N个最热组合
 */
function analyzeTopChoose5(history, topN = 50) {
  const totalPeriods = history.length;
  const countMap = new Map();
  const lastOccurMap = new Map();

  // 遍历每一期
  for (let idx = 0; idx < totalPeriods; idx++) {
    const arr = history[idx];
    const n = arr.length;

    // 生成当期所有 5 码组合
    for (let a = 0; a < n; a++)
    for (let b = a + 1; b < n; b++)
    for (let c = b + 1; c < n; c++)
    for (let d = c + 1; d < n; d++)
    for (let e = d + 1; e < n; e++) {
      const comb = [arr[a], arr[b], arr[c], arr[d], arr[e]].sort((x, y) => x - y);
      const key = comb.join(',');

      // 计数
      countMap.set(key, (countMap.get(key) || 0) + 1);

      // 只保留最近 3 次出现期号，避免内存爆炸
      const list = lastOccurMap.get(key) || [];
      list.push(idx);
      if (list.length > 3) list.shift();
      lastOccurMap.set(key, list);
    }

    // 🔥 关键：定期清理只出现 1 次的组合，防止 Map 溢出
    if (idx % 150 === 0) {
      for (const [k, v] of countMap) {
        if (v === 1) {
          countMap.delete(k);
          lastOccurMap.delete(k);
        }
      }
    }
  }

  // 排序取最热
  const topList = Array.from(countMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([key, count]) => {
      const occurs = lastOccurMap.get(key) || [];
      const gaps = [];
      for (let i = 1; i < occurs.length; i++) {
        gaps.push(occurs[i] - occurs[i - 1]);
      }
      return {
        comb: key.split(',').map(Number),
        count,
        gaps,
        currentMiss: totalPeriods - 1 - (occurs.at(-1) || -1)
      };
    });

  return topList;
}


// 你的历史开奖数据（从之前解析好的 redBall）
const historyData =historyKl8.map(item=>item.redBall);

// 计算出现最多的 前30 组选5
const result = analyzeTopChoose5(historyData, 30);

// 输出
console.log(result.map(item=>item.comb));
console.log('=== 快乐8 选5 最热组合 TOP30 ===');
result.forEach((item, i) => {
  console.log(`第${i+1}名`);
  console.log('组合：', item.comb.join(' '));
  console.log('出现次数：', item.count);
  console.log('开出间隔：', item.gaps.join(' → '));
  console.log('当前遗漏：', item.currentMiss, '期');
  console.log('----------------------------------');
});