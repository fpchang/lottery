import { historyKl8 } from "../../../common/kl8.js";
/**
 * 计算快乐8 选4 遗漏最多的组合
 * @param {number[][]} history 历史开奖数组，按时间顺序：最新期在最后
 * @returns {Array<{comb: number[], miss: number, lastIndex: number}>} 按遗漏降序
 */
function calcTopMissChoose4(history) {
  const totalPeriod = history.length;
  if (totalPeriod === 0) return [];

  // key: "1,2,3,4"  value: 最后出现的期号索引
  const lastAppear = new Map();

  // 遍历每一期，记录每个4码最后出现位置
  for (let idx = 0; idx < history.length; idx++) {
    const balls = history[idx];
    const set = new Set(balls);

    // 生成当期所有4码
    const len = balls.length;
    for (let a = 0; a < len; a++) {
      for (let b = a + 1; b < len; b++) {
        for (let c = b + 1; c < len; c++) {
          for (let d = c + 1; d < len; d++) {
            const comb = [balls[a], balls[b], balls[c], balls[d]].sort((x, y) => x - y);
            const key = comb.join(',');
            lastAppear.set(key, idx);
          }
        }
      }
    }
  }

  // 生成所有可能4码，计算遗漏
  const result = [];

  for (let a = 1; a <= 80; a++) {
    for (let b = a + 1; b <= 80; b++) {
      for (let c = b + 1; c <= 80; c++) {
        for (let d = c + 1; d <= 80; d++) {
          const comb = [a, b, c, d];
          const key = comb.join(',');
          const last = lastAppear.get(key) ?? -1;
          const miss = totalPeriod - 1 - last;

          result.push({ comb, miss, lastIndex: last });
        }
      }
    }
  }

  // 按遗漏从大到小排序
  result.sort((x, y) => y.miss - x.miss);

  return result;
}

// 你的历史数据（从旧到新）
// const history = [
//   [2,3,4,6,8,13,17,20,21,25,26,29,34,40,47,49,51,58,59,69],
//   [2,3,4,6,8,13,17,20,21,25,26,29,34,40,47,49,51,58,59,69],
//   // 更多期...
// ];
const historyData = historyKl8.map(item=>item.redBall);
// 计算
const topList = calcTopMissChoose4(historyData);

// 输出前 50 个遗漏最多的4码
console.log('遗漏最多的前50组选4：');
console.log(topList.slice(600000, 601000).map((item, i) => 
  `${i+1}. ${item.comb.join(' ')}  遗漏 ${item.miss} 期`
));