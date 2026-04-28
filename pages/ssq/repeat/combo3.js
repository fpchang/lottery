import {ssqHistory} from "../../../common/ssq.js";
/**
 * 双色球红球3码组合：找出出现次数最多的组合，并计算出现间隔 + 当前遗漏
 * @param {Array} history 历史开奖 [[r1,r2,r3,r4,r5,r6], ...] 旧→新
 * @returns {Object} 结果：最多组合、次数、间隔列表、当前遗漏
 */
/**
 * 双色球红球3码组合 - 统计出现次数前20名 + 当前遗漏
 * @param {Array} history 历史开奖数据（旧期在前，最新期在最后）
 * @returns {Array} 前20名组合，包含：组合、次数、当前遗漏
 */
function getTop20Red3WithMiss(history) {
  // 记录每个组合：出现次数 + 最后出现位置
  const statMap = new Map();

  // 遍历每一期开奖
  history.forEach((redBalls, index) => {
    // 排序红球，保证组合唯一
    const sortedReds = [...redBalls].sort((a, b) => a - b);
    // 生成当期所有 3 码组合
    const combos = generate3Combos(sortedReds);

    // 更新统计
    combos.forEach(combo => {
      const key = combo.join(',');
      const stat = statMap.get(key) || { count: 0, lastIndex: -1 };
      stat.count++;
      stat.lastIndex = index; // 不断覆盖，保留最后一次出现的期号
      statMap.set(key, stat);
    });
  });

  const totalPeriods = history.length;

  // 转为数组并排序：按出现次数【降序】
  const list = Array.from(statMap.entries())
    .map(([key, stat]) => {
      const combo = key.split(',').map(Number);
      // 计算当前遗漏 = 最新期索引 - 最后出现索引
      const currentMiss = totalPeriods - 1 - stat.lastIndex;
      return {
        combo,
        count: stat.count,
        currentMiss
      };
    })
    .sort((a, b) => b.count - a.count);

  // 返回前 20
  return list.slice(0, 20);
}

/**
 * 从 6 个红球中生成所有 3 码组合
 */
function generate3Combos(reds) {
  const [a, b, c, d, e, f] = reds;
  return [
    [a,b,c],[a,b,d],[a,b,e],[a,b,f],
    [a,c,d],[a,c,e],[a,c,f],[a,d,e],
    [a,d,f],[a,e,f],[b,c,d],[b,c,e],
    [b,c,f],[b,d,e],[b,d,f],[b,e,f],
    [c,d,e],[c,d,f],[c,e,f],[d,e,f]
  ];
}

// 你的双色球历史数据
// 格式：旧期 → 最新期，每期 6 个红球
const history = ssqHistory.map(item=>item.redBall);

// 执行计算
const top20 = getTop20Red3WithMiss(history);

// 输出结果
console.log("📊 红球3码组合 出现次数 TOP20 + 当前遗漏");
console.log(top20);