import {ssqHistory} from "../../../common/ssq.js";
/**
 * 双色球红球4码组合 - 出现次数前20名 + 当前遗漏
 * @param {Array} history 历史数据【旧期在前，最新期在最后】
 * @returns {Array} 前20组合：combo[组合], count[出现次数], currentMiss[当前遗漏]
 */
function getTop20Red4WithMiss(history) {
  const statMap = new Map();

  // 遍历每期开奖
  history.forEach((redBalls, index) => {
    const sorted = [...redBalls].sort((a, b) => a - b);
    const combos = generate4Combos(sorted); // 生成当期所有4码组合

    combos.forEach(combo => {
      const key = combo.join(',');
      const item = statMap.get(key) || { count: 0, lastIndex: -1 };
      item.count++;
      item.lastIndex = index;
      statMap.set(key, item);
    });
  });

  const totalPeriods = history.length;

  // 按出现次数降序排列
  const list = Array.from(statMap.entries())
    .map(([key, item]) => {
      const combo = key.split(',').map(Number);
      const currentMiss = totalPeriods - 1 - item.lastIndex;
      return {
        combo,
        count: item.count,
        currentMiss
      };
    })
    .sort((a, b) => b.count - a.count);

  return list.slice(0, 20);
}

/**
 * 从6个红球生成所有 C(6,4)=15 个4码组合
 */
function generate4Combos(reds) {
  const [a, b, c, d, e, f] = reds;
  return [
    [a,b,c,d], [a,b,c,e], [a,b,c,f],
    [a,b,d,e], [a,b,d,f], [a,b,e,f],
    [a,c,d,e], [a,c,d,f], [a,c,e,f],
    [a,d,e,f], [b,c,d,e], [b,c,d,f],
    [b,c,e,f], [b,d,e,f], [c,d,e,f]
  ];
}

// 历史数据：旧 → 新
const history = ssqHistory.map(item=>item.redBall);

const top20Red4 = getTop20Red4WithMiss(history);
console.log('🔴 红球4码组合 出现次数 TOP20 + 当前遗漏');
console.log(top20Red4);