import { historyKl8 } from "../../../common/kl8.js";
/**
 * 快乐8 选6 最热组合统计（流式计算，无 Map 溢出）
 * @param {number[][]} history 历史开奖（旧到新）
 * @param {number} topN 只保留前N个最热，默认50
 * @returns 最热组合列表
 */
function analyzeTopChoose6(history, topN = 50) {
  const total = history.length;
  const freq = new Map();
  const appearPositions = new Map();

  // 流式遍历，只统计出现，不存爆炸数据
  for (let idx = 0; idx < total; idx++) {
    const balls = history[idx];
    const n = balls.length;

    // 6 重循环生成组合
    for (let a = 0; a < n; a++)
    for (let b = a+1; b < n; b++)
    for (let c = b+1; c < n; c++)
    for (let d = c+1; d < n; d++)
    for (let e = d+1; e < n; e++)
    for (let f = e+1; f < n; f++) {
      const comb = [balls[a],balls[b],balls[c],balls[d],balls[e],balls[f]].sort((x,y)=>x-y);
      const key = comb.join(',');

      // 只计数，不存长数组
      freq.set(key, (freq.get(key) || 0) + 1);

      // 只存最后3次出现位置，计算间隔
      const pos = appearPositions.get(key) || [];
      pos.push(idx);
      if (pos.length > 3) pos.shift();
      appearPositions.set(key, pos);
    }

    // 定期清理低频数据（关键！防止Map爆炸）
    if (idx % 200 === 0) {
      const keys = [...freq.keys()];
      for (const k of keys) {
        if (freq.get(k) <= 1) {
          freq.delete(k);
          appearPositions.delete(k);
        }
      }
    }
  }

  // 排序取Top
  const list = [...freq.entries()]
    .sort((a,b)=>b[1]-a[1])
    .slice(0, topN)
    .map(([key, count])=>{
      const pos = appearPositions.get(key) || [];
      const gaps = [];
      for(let i=1;i<pos.length;i++) gaps.push(pos[i]-pos[i-1]);
      return {
        comb: key.split(',').map(Number),
        count,
        gaps: gaps.slice(-5),
        currentMiss: pos.length ? total-1-pos.at(-1) : total
      };
    });

  return list;
}

// 你的历史开奖数据（从之前解析好的 redBall 直接放进来）
const historyData =historyKl8.map(item=>item.redBall);

// 计算：出现最多的 前30 组选6
const topList = analyzeTopChoose6(historyData, 30);

// 输出结果
console.log('=== 快乐8 选6 最热组合 TOP30 ===');
topList.forEach((item, i) => {
  console.log(`第${i+1}名`);
  console.log('组合：', item.comb.join(' '));
  console.log('出现次数：', item.count);
  console.log('开出间隔：', item.gaps.join(' → '));
  console.log('当前遗漏：', item.currentMiss, '期');
  console.log('----------------------------------');
});