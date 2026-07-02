import { historyKl8 } from "../../../common/kl8.js";
// 16个分区号码池，每区5个号
// 16个分区号码池
// 5个分区号码池
// 快乐8 5个均等分区 1-80，每区16个号
const zones = [
  [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
  [17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32],
  [33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48],
  [49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64],
  [65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80]
];

/**
 * 历史开奖转Set数组加速比对
 * @param {number[][]} historyData
 * @returns {Set<number>[]}
 */
function buildHistorySets(historyData) {
  return historyData.map(draw => new Set(draw));
}

/**
 * 5区每区严格选1个号码，生成一组5码选五
 * @returns {number[]} 升序5个号码
 */
function genOneCombo() {
  const combo = [];
  for (const zone of zones) {
    const idx = Math.floor(Math.random() * zone.length);
    combo.push(zone[idx]);
  }
  return combo.sort((a, b) => a - b);
}

/**
 * 判断该5码是否曾经完整同时开出（5个号同一期全部出现）
 * @param {number[]} combo
 * @param {Set<number>[]} historySets
 * @returns {boolean}
 */
function isFullAppeared(combo, historySets) {
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
 * 计算该组合在所有历史期里【单期最大重合号码个数】
 * @param {number[]} combo
 * @param {Set<number>[]} historySets
 * @returns {number}
 */
function calcMaxOverlap(combo, historySets) {
  const cSet = new Set(combo);
  let maxCnt = 0
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
 * 批量生成候选，过滤已完整开出组合，按最大重合数升序择优
 * @param {Set<number>[]} historySets
 * @param {number} candidateCount 生成多少候选样本
 * @returns {Array} 排序后列表
 */
function getLowOverlapBestCombos(historySets, candidateCount = 500) {
  const candidateList = [];
  const dedup = new Set();

  while (candidateList.length < candidateCount) {
    const combo = genOneCombo();
    const key = combo.join(",");
    if (dedup.has(key)) continue;
    dedup.add(key);

    // 硬性条件：整套从未完整同时开出
    if (isFullAppeared(combo, historySets)) continue;

    // 打分：历史任意一期最多重合几个号
    const maxHit = calcMaxOverlap(combo, historySets);
    candidateList.push({
      nums: combo,
      maxOverlap: maxHit
    });
  }

  // 重合越小越靠前
  candidateList.sort((a, b) => a.maxOverlap - b.maxOverlap);
  return candidateList;
}

// ==================== 测试调用 ====================
const historyData =historyKl8.map(item => item.redBall); // 假设historyKl8每项有redBall数组，包含20个开奖号码

const hSets = buildHistorySets(historyData);
// 生成500组候选，择优排序
const result = getLowOverlapBestCombos(hSets, 500);

console.log("=== 筛选条件：5区各1码 + 从未整套开出 + 按历史单期最大重合升序（越小越好）TOP15 ===");
for (let i = 0; i < 300; i++) {
  const item = result[i];
  console.log(`第${i+1}名 | 号码：${item.nums.join(",")} | 历史单期最多重合${item.maxOverlap}个`);
}

//66,67
//32,35,
//20,47,
//49,58

//1,29,41,52,70 
//16,30,37,64,70 
//6,28,46,55,80
//15,32,36,54,69
//2,17,43,59,73 
//11,24,45,53,68
//15,28,34,59,76 
//13,22,40,54,72 
//5,25,42,52,67 
//15,25,47,58,71