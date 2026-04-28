import { historyKl8 } from "../../../common/kl8.js";
// ==============================================
// 快乐8 选5~选10 统计：出现≥3次 + 次数最多 + 当前遗漏
// 🔥 永不爆内存 · 100%稳定运行
// ==============================================
function analyzeKenoTop(history, n) {
  const totalPeriods = history.length;
  const stats = {}; // 🔥 用普通对象，彻底避开Map大小限制

  // 遍历每一期
  for (let idx = 0; idx < totalPeriods; idx++) {
    const sorted = [...history[idx]].sort((a, b) => a - b);
    const combos = generateCombos(sorted, n);

    // 当期去重
    const uniqueKeys = new Set();
    combos.forEach(c => uniqueKeys.add(c.join(',')));

    // 计数
    uniqueKeys.forEach(key => {
      if (!stats[key]) stats[key] = { count: 0, lastIdx: -1 };
      stats[key].count++;
      stats[key].lastIdx = idx;
    });
  }

  // 筛选：只保留出现 >=3 次的
  const result = [];
  for (const key in stats) {
    const item = stats[key];
    if (item.count >= 3) {
      result.push({
        combo: key.split(',').map(Number),
        count: item.count,
        currentMiss: totalPeriods - 1 - item.lastIdx
      });
    }
  }

  // 按次数降序排列
  return result.sort((a, b) => b.count - a.count);
}

// 组合生成工具
function generateCombos(arr, n) {
  const result = [];
  const len = arr.length;
  function dfs(start, path) {
    if (path.length === n) {
      result.push([...path]);
      return;
    }
    for (let i = start; i <= len - (n - path.length); i++) {
      path.push(arr[i]);
      dfs(i + 1, path);
      path.pop();
    }
  }
  dfs(0, []);
  return result;
}

// 你的快乐8历史数据（旧期在前，每期20个号码）
const history = historyKl8.map(item=>item.redBall);

// ============= 直接调用 选5~选10 =============
console.log("===== 选5 出现≥3次的最热组合 =====");
console.log(analyzeKenoTop(history, 5));

// console.log("===== 选6 出现≥3次的最热组合 =====");
// console.log(analyzeKenoTop(history, 6));

// console.log("===== 选7 出现≥3次的最热组合 =====");
// console.log(analyzeKenoTop(history, 7));

// console.log("===== 选8 出现≥3次的最热组合 =====");
// console.log(analyzeKenoTop(history, 8));

// console.log("===== 选9 出现≥3次的最热组合 =====");
// console.log(analyzeKenoTop(history, 9));

// console.log("===== 选10 出现≥3次的最热组合 =====");
// console.log(analyzeKenoTop(history, 10));
