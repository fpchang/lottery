import {ssqHistory} from "../../../common/ssq.js";
/**
 * 双色球红球5码组合 - 出现次数前20 + 当前遗漏
 * @param {Array} history 历史数据【旧期在前，最新期在最后】
 * @returns {Array} 前20：combo[5码], count[次数], currentMiss[遗漏]
 */
function getTop20Red5WithMiss(history) {
  const statMap = new Map();

  // 遍历每期开奖
  history.forEach((redBalls, index) => {
    const sorted = [...redBalls].sort((a, b) => a - b);
    const combos = generate5Combos(sorted); // 生成当期所有5码组合

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
      return { combo, count: item.count, currentMiss };
    })
    .sort((a, b) => b.count - a.count);

  return list.slice(0, 20);
}

/**
 * 从6个红球生成所有 C(6,5)=6 个5码组合
 */
function generate5Combos(reds) {
  const [a, b, c, d, e, f] = reds;
  return [
    [a, b, c, d, e], // 去掉f
    [a, b, c, d, f], // 去掉e
    [a, b, c, e, f], // 去掉d
    [a, b, d, e, f], // 去掉c
    [a, c, d, e, f], // 去掉b
    [b, c, d, e, f]  // 去掉a
  ];
}

// 历史数据格式：旧期 → 最新期
const history = ssqHistory.map(item=>item.redBall);

// 计算
const top20Red5 = getTop20Red5WithMiss(history);
console.log("🔴 红球5码组合 TOP20 + 当前遗漏");
console.log(top20Red5);