import { historyKl8 } from "../../../common/kl8.js";
////////计算选10 10个分区断区基数与非断区期数
/**
 * 快乐8 10个固定分区定义
 */
const zoneRanges = [
  [1, 8],    // 1区
  [9, 16],   // 2区
  [17, 24],  // 3区
  [25, 32],  // 4区
  [33, 40],  // 5区
  [41, 48],  // 6区
  [49, 56],  // 7区
  [57, 64],  // 8区
  [65, 72],  // 9区
  [73, 80]   // 10区
];

/**
 * 单期判断每个区是否出号，返回各区是否断区标记
 * @param {number[]} drawNums 当期20个开奖号码数组
 * @returns {boolean[]} 长度10，true=本区有号开出，false=断区
 */
function getZoneHitStatus(drawNums) {
  const hitStatus = new Array(10).fill(false);
  const numSet = new Set(drawNums);

  for (let z = 0; z < 10; z++) {
    const [start, end] = zoneRanges[z];
    for (let n = start; n <= end; n++) {
      if (numSet.has(n)) {
        hitStatus[z] = true;
        break;
      }
    }
  }
  return hitStatus;
}

/**
 * 批量统计历史开奖：全覆盖期数、断区期数、各区独立断区次数、每期断区个数分布
 * @param {number[][]} historyData 二维数组，每期20个开奖号码
 * @returns {Object} 统计汇总结果
 */
function calcHappy8ZoneStats(historyData) {
  let fullCoverCount = 0;        // 10区全部开出（无断区）期数
  let hasBreakCount = 0;         // 存在至少1个断区的期数
  const zoneBreakTimes = new Array(10).fill(0); // 每个区各自断区总次数
  const breakNumDist = {};       // 断区数量分布 key:断区个数, value:期数

  for (const nums of historyData) {
    const hitStatus = getZoneHitStatus(nums);
    // 统计本期断了几个区
    const breakCnt = hitStatus.filter(flag => !flag).length;
    breakNumDist[breakCnt] = (breakNumDist[breakCnt] || 0) + 1;

    if (breakCnt === 0) {
      fullCoverCount++;
    } else {
      hasBreakCount++;
      // 累加每个断区的次数
      hitStatus.forEach((flag, idx) => {
        if (!flag) zoneBreakTimes[idx]++;
      });
    }
  }

  return {
    totalPeriod: historyData.length,
    fullCoverPeriods: fullCoverCount,
    hasBreakPeriods: hasBreakCount,
    singleZoneBreakCount: zoneBreakTimes.map((cnt, idx) => ({
      zone: `${idx + 1}区`,
      breakTotal: cnt
    })),
    breakNumDistribution: breakNumDist
  };
}

// ============ 测试示例 替换成你的真实历史开奖数据 ============
const testHistory = historyKl8.map(item => item.redBall); // 假设historyKl8每项有redBall数组，包含20个开奖号码

// 执行统计
const statsResult = calcHappy8ZoneStats(testHistory);

// 打印输出
console.log("====快乐8 10分区断区统计汇总====");
console.log(`总统计期数：${statsResult.totalPeriod}`);
console.log(`10个区全部开出（无断区）期数：${statsResult.fullCoverPeriods}`);
console.log(`存在断区的期数：${statsResult.hasBreakPeriods}`);
console.log("\n【各区单独累计断区次数】");
statsResult.singleZoneBreakCount.forEach(item => {
  console.log(`${item.zone} 累计断区：${item.breakTotal}期`);
});
console.log("\n【每期断区数量分布（断N个区：对应期数）】");
Object.entries(statsResult.breakNumDistribution).forEach(([breakNum, pCount]) => {
  console.log(`断${breakNum}个区：${pCount}期`);
});