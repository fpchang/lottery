import { historyKl8 } from "../../../common/kl8.js";
/**
 * Calculate top missing Choose-3 combinations for Kuaile 8
 * @param {number[][]} history - draw history, old to new
 * @returns {Array<{ comb: number[], miss: number, lastIndex: number }>}
 */
function calcTopMissChoose3(history) {
  const totalPeriod = history.length;
  if (totalPeriod === 0) return [];

  const lastAppear = new Map();

  for (let idx = 0; idx < totalPeriod; idx++) {
    const balls = history[idx];
    const n = balls.length;

    for (let a = 0; a < n; a++) {
      for (let b = a + 1; b < n; b++) {
        for (let c = b + 1; c < n; c++) {
          const comb = [balls[a], balls[b], balls[c]].sort((x, y) => x - y);
          const key = comb.join(',');
          lastAppear.set(key, idx);
        }
      }
    }
  }

  const result = [];

  for (let a = 1; a <= 80; a++) {
    for (let b = a + 1; b <= 80; b++) {
      for (let c = b + 1; c <= 80; c++) {
        const comb = [a, b, c];
        const key = comb.join(',');
        const last = lastAppear.get(key) ?? -1;
        const miss = totalPeriod - 1 - last;
        result.push({ comb, miss, lastIndex: last });
      }
    }
  }

  result.sort((x, y) => y.miss - x.miss);
  return result;
}


// 计算
//  const list = calcTopMissChoose3(history);
// export const miss3list = list.map(item=>item.comb);
// // 输出前50个遗漏最多的选3组合
// console.log(list);
// list.slice(0, 200).forEach((item, i) => {
//   console.log(
//     (i+1).toString().padStart(2) + ". " +
//     item.comb.join(' ').padEnd(8) +
//     " | missing: " + item.miss
//   );
// });

export const getMiss3=(his)=>{
  // 你的历史开奖数组（从旧到新）
    const history = his.map(item=>item.redBall);
    const list =calcTopMissChoose3(history);
    console.log("miss3",list)
    return list.map(item=>item.comb)
       
}
getMiss3(historyKl8);
