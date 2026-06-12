import { historyKl8 } from "../../../common/kl8.js";
// 10分区号码池
// 快乐8 10分区
const zones = [
  [1,2,3,4,5,6,7,8],
  [9,10,11,12,13,14,15,16],
  [17,18,19,20,21,22,23,24],
  [25,26,27,28,29,30,31,32],
  [33,34,35,36,37,38,39,40],
  [41,42,43,44,45,46,47,48],
  [49,50,51,52,53,54,55,56],
  [57,58,59,60,61,62,63,64],
  [65,66,67,68,69,70,71,72],
  [73,74,75,76,77,78,79,80]
];

/**
 * 历史开奖转为Set数组加速比对
 */
function buildHistorySets(historyData) {
  return historyData.map(item => new Set(item));
}

/**
 * 判断10码组合是否曾经完整一次性开出
 */
function isComboEverFullAppear(combo, historySets) {
  const cSet = new Set(combo);
  for (const drawSet of historySets) {
    let allIn = true;
    for (const n of cSet) {
      if (!drawSet.has(n)) {
        allIn = false;
        break;
      }
    }
    if (allIn) return true;
  }
  return false;
}

/**
 * 计算：该组合每一期重合号码数量，并返回【单期最大重合数】
 */
function getMaxOverlap(combo, historySets) {
  const cSet = new Set(combo);
  let maxCnt = 0;
  for (const drawSet of historySets) {
    let curr = 0;
    for (const n of cSet) {
      if (drawSet.has(n)) curr++;
    }
    if (curr > maxCnt) maxCnt = curr;
  }
  return maxCnt;
}

/**
 * 随机生成一注：10区各1个号，排序
 */
function randomOneCombo() {
  const arr = [];
  for (const z of zones) {
    const idx = Math.floor(Math.random() * z.length);
    arr.push(z[idx]);
  }
  return arr.sort((a, b) => a - b);
}

/**
 * 批量生成候选，过滤已完整开出组合，按【单期最大重合数从小到大】排序
 * @param {Set[]} historySets
 * @param {number} genTotal 生成候选总量
 * @returns 排序后的候选列表
 */
function getBestMinSingleOverlap(historySets, genTotal = 300) {
  const list = [];
  const keySet = new Set();

  while (list.length < genTotal) {
    const combo = randomOneCombo();
    const key = combo.join(",");
    if (keySet.has(key)) continue;
    // 过滤曾经整套完整开出的组合
    if (isComboEverFullAppear(combo, historySets)) continue;

    keySet.add(key);
    const maxHit = getMaxOverlap(combo, historySets);
    list.push({
      combo,
      maxSingleHit: maxHit
    });
  }

  // 核心：单期最大重合数升序，越小越靠前
  list.sort((a, b) => a.maxSingleHit - b.maxSingleHit);
  return list;
}

// ==================== 测试调用 ====================
const historyData = historyKl8.map(item => item.redBall); // 假设historyKl8每项有redBall数组，包含20个开奖号码

const hSets = buildHistorySets(historyData);
// 生成300组候选，自动择优
const resultList = getBestMinSingleOverlap(hSets, 300);

console.log("==== 按单期最大重合数升序（越小越好）TOP15 ====");
for (let i = 0; i < 30; i++) {
  const item = resultList[i];
  console.log(
    `排名${i+1} | 号码：${item.combo.join(",")} | 历史任意一期最多重合${item.maxSingleHit}个`
  );
}