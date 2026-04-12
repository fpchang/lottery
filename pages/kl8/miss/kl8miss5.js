import { historyKl8 } from "../../../common/kl8.js";
/**
 * 快乐8 选5：从未出现 + 过滤 4 连号、5 连号
 * @param {number[][]} history 历史开奖号码
 * @returns {number[][]} 符合条件的 5 码组合
 */
function getNeverAppearedChoose5(history) {
  const historySets = history.map(nums => new Set([...nums].sort((a, b) => a - b)));
  const result = [];

  // 生成所有 5 码组合
  for (let a = 1; a <= 80; a++) {
    for (let b = a + 1; b <= 80; b++) {
      for (let c = b + 1; c <= 80; c++) {
        for (let d = c + 1; d <= 80; d++) {
          for (let e = d + 1; e <= 80; e++) {
            const comb = [a, b, c, d, e];

            // 1. 判断是否出现过
            let appeared = false;
            for (const set of historySets) {
              if (comb.every(n => set.has(n))) {
                appeared = true;
                break;
              }
            }
            if (appeared) continue;

            // 2. 过滤 4 连号、5 连号
            if (hasFourOrFiveConsecutive(comb)) continue;

            result.push([...comb]);
          }
        }
      }
    }
  }

  return result;
}

/**
 * 判断一组 5 码是否包含 4 连号 或 5 连号
 */
function hasFourOrFiveConsecutive(arr) {
  // 5 连号
  if (arr[4] - arr[0] === 4) return true;

  // 前 4 连号
  if (arr[3] - arr[0] === 3) return true;

  // 后 4 连号
  if (arr[4] - arr[1] === 3) return true;

  return false;
}
// 1. 你的历史开奖数据（必须是数字数组，就是我们上一步解析出来的 redBall）
// const historyData = [
//   [2,3,4,6,8,13,17,20,21,25,26,29,34,40,47,49,51,58,59,69],
//   [2,3,4,6,8,13,17,20,21,25,26,29,34,40,47,49,51,58,59,69]
// ];
const historyData = historyKl8.map(item=>item.redBall)

// 2. 直接调用
const neverAppeared = getNeverAppearedChoose5(historyData);

// 3. 查看结果
console.log('从未出现的 5 码组合总数：', neverAppeared.length);
console.log('前10组示例：', neverAppeared.slice(0,10));