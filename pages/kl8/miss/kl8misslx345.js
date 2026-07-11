import { historyKl8 } from "../../../common/kl8.js";
/**
 * 快乐8 所有三连/四连/五连组合统计（每组独立次数+遗漏）
 * @param {Array} historyData 历史开奖数组，旧期在前，新期在后
 * 单条结构 {period: String, nums: Number[]}
 * @returns {Object} 全部组合统计结果
 */
/**
 * 快乐8 所有三连/四连/五连组合统计 + 按当前遗漏降序排序
 * @param {Array} historyData 历史开奖数组，旧期在前，新期在后
 * 单条结构 {period: String, nums: Number[]}
 * @returns {Object} 原始明细 + 按遗漏排序后的列表
 */
function calcAllSeriesGroupOmit(historyData) {
  const totalPeriod = historyData.length;
  const latestIndex = totalPeriod - 1;

  // 初始化所有组合存储：key为起始数字，value存储出现过的期下标数组
  const threeGroup = {}; // 三连 n~n+2
  const fourGroup = {};  // 四连 n~n+3
  const fiveGroup = {};  // 五连 n~n+4

  // 初始化全部合法组合
  for (let n = 1; n <= 78; n++) threeGroup[n] = [];
  for (let n = 1; n <= 77; n++) fourGroup[n] = [];
  for (let n = 1; n <= 76; n++) fiveGroup[n] = [];

  // 遍历每一期开奖数据
  for (let periodIdx = 0; periodIdx < totalPeriod; periodIdx++) {
    const rawNums = historyData[periodIdx].nums;
    const nums = [...rawNums].sort((a, b) => a - b);
    const numSet = new Set(nums);

    // 三连组合 n n+1 n+2
    for (let n = 1; n <= 78; n++) {
      if (numSet.has(n) && numSet.has(n + 1) && numSet.has(n + 2)) {
        threeGroup[n].push(periodIdx);
      }
    }
    // 四连组合 n n+1 n+2 n+3
    for (let n = 1; n <= 77; n++) {
      if (numSet.has(n) && numSet.has(n + 1) && numSet.has(n + 2) && numSet.has(n + 3)) {
        fourGroup[n].push(periodIdx);
      }
    }
    // 五连组合 n n+1 n+2 n+3 n+4
    for (let n = 1; n <= 76; n++) {
      if (numSet.has(n) && numSet.has(n + 1) && numSet.has(n + 2) && numSet.has(n + 3) && numSet.has(n + 4)) {
        fiveGroup[n].push(periodIdx);
      }
    }
  }

  // 通用计算：总次数、当前遗漏
  function getSingleStat(idxList) {
    const count = idxList.length;
    if (count === 0) {
      return {
        totalCount: 0,
        currentOmit: totalPeriod,
        lastPeriodIndex: null
      };
    }
    const lastIdx = idxList[idxList.length - 1];
    const omit = latestIndex - lastIdx;
    return {
      totalCount: count,
      currentOmit: omit,
      lastPeriodIndex: lastIdx
    };
  }

  // 组装原始对象
  const threeResult = {};
  const fourResult = {};
  const fiveResult = {};

  for (const start in threeGroup) {
    const n = Number(start);
    const key = `${n},${n+1},${n+2}`;
    threeResult[key] = getSingleStat(threeGroup[n]);
  }
  for (const start in fourGroup) {
    const n = Number(start);
    const key = `${n},${n+1},${n+2},${n+3}`;
    fourResult[key] = getSingleStat(fourGroup[n]);
  }
  for (const start in fiveGroup) {
    const n = Number(start);
    const key = `${n},${n+1},${n+2},${n+3},${n+4}`;
    fiveResult[key] = getSingleStat(fiveGroup[n]);
  }

  // ===== 新增：按当前遗漏降序排序 =====
  function sortByOmitDesc(obj) {
    return Object.entries(obj)
      .map(([groupName, stat]) => ({
        group: groupName,
        ...stat
      }))
      // 遗漏越大排越前；遗漏相同则组合号从小到大
      .sort((a, b) => {
        if (b.currentOmit !== a.currentOmit) {
          return b.currentOmit - a.currentOmit;
        } else {
          // 拆分组合首数字对比
          const aFirst = Number(a.group.split(",")[0]);
          const bFirst = Number(b.group.split(",")[0]);
          return aFirst - bFirst;
        }
      });
  }

  const threeSorted = sortByOmitDesc(threeResult);
  const fourSorted = sortByOmitDesc(fourResult);
  const fiveSorted = sortByOmitDesc(fiveResult);

  return {
    totalHistoryPeriod: totalPeriod,
    // 原始键值对
    threeAllGroup: threeResult,
    fourAllGroup: fourResult,
    fiveAllGroup: fiveResult,
    // 按遗漏降序排好的数组
    threeSortByOmitDesc: threeSorted,
    fourSortByOmitDesc: fourSorted,
    fiveSortByOmitDesc: fiveSorted
  };
}

// ===================== 测试示例 =====================
const testHistory =historyKl8.map(item => ({period: item.index, nums: item.redBall}));

const stat = calcAllSeriesGroupOmit(testHistory);
console.log("===== 三连 按遗漏从大到小 =====");
console.log(stat.threeSortByOmitDesc);
// console.log("===== 四连 按遗漏从大到小 =====");
// console.log(stat.fourSortByOmitDesc);
// console.log("===== 五连 按遗漏从大到小 =====");
// console.log(stat.fiveSortByOmitDesc);