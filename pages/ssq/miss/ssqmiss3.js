import {ssqHistory} from "../../../common/ssq.js";
/**
 * 双色球红球 3 码组合遗漏值计算（严格准确版）
 * @param {Array} history 历史开奖，格式 [[r1,r2,r3,r4,r5,r6], ...]
 *                       要求：**最新期在数组最后一位**（正常时间顺序：旧→新）
 * @returns {Array} 按遗漏降序排列，{ combo: [a,b,c], miss: 遗漏期数 }
 */
function calcRed3MissAccurate(history) {
  // 1. 生成所有 1-33 红球的 3 码组合
  const allBalls = Array.from({ length: 33 }, (_, i) => i + 1);
  const all3Combos = generateCombinations(allBalls, 3);

  // 组合 => 最后出现的期号索引
  const lastAppear = new Map();

  // 2. 遍历每一期，记录每个3码组合最后出现的位置
  history.forEach((redBalls, index) => {
    const sorted = [...redBalls].sort((a, b) => a - b);
    const current3 = generateCombinations(sorted, 3);

    current3.forEach(combo => {
      const key = combo.join(',');
      lastAppear.set(key, index); // 覆盖 = 只保留最后一次出现
    });
  });

  const total = history.length;
  const result = all3Combos.map(combo => {
    const key = combo.join(',');
    const lastIdx = lastAppear.get(key);
    const miss = lastIdx == null ? total : total - 1 - lastIdx;
    return { combo, miss };
  });

  // 遗漏从大到小排序
  return result.sort((a, b) => b.miss - a.miss);
}

// 组合生成工具函数
function generateCombinations(arr, k) {
  const res = [];
  function dfs(start, current) {
    if (current.length === k) {
      res.push([...current]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      current.push(arr[i]);
      dfs(i + 1, current);
      current.pop();
    }
  }
  dfs(0, []);
  return res;
}

const history = ssqHistory.map(item=>item.redBall)

const list = calcRed3MissAccurate(history);
console.log(list.slice(0, 100));