//按比例生成双色球红球号码

// 三区号码池（固定不变）
const zone1 = [1,2,3,4,5,6,7,8,9,10,11];
const zone2 = [12,13,14,15,16,17,18,19,20,21,22];
const zone3 = [23,24,25,26,27,28,29,30,31,32,33];

// 从数组随机取 n 个不重复数
function randomPick(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

// ====================== 核心通用方法 ======================
/**
 * 生成指定三区比例的双色球红球
 * @param {Array<Array<number>>} allowedRatios 允许的比例数组，如 [[2,2,2], [3,2,1]]
 * @returns {Object} 红球 + 比例
 */
const defaultRatios = [
  [2,2,2],
  [3,2,1],
  [3,1,2],
  [2,3,1],
  [1,3,2],
  [2,1,3],
  [1,2,3]
];
export function generateSSQ(allowedRatios = defaultRatios) {
  // 随机选择一种比例
  const ratio = allowedRatios[Math.floor(Math.random() * allowedRatios.length)];
  const [n1, n2, n3] = ratio;

  // 按三区比例取号
  const redBalls = [
    ...randomPick(zone1, n1),
    ...randomPick(zone2, n2),
    ...randomPick(zone3, n3)
  ].sort((a, b) => a - b);

  // return {
  //   红球: redBalls,
  //   三区比例: `${n1}:${n2}:${n3}`
  // };
  return redBalls;
}

// ====================== 使用示例 ======================
// 你指定的 7 种比例


// 调用时传入比例参数
// console.log(generateSSQ(myRatios)); 

// // 生成 5 注
// for (let i = 0; i < 5; i++) {
//   console.log(generateSSQ(myRatios));
// }