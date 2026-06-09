import { dltHistory } from "../../../common/dlt.js";
// ==================== 1. 三区定义 ====================
const zone1 = Array.from({ length: 12 }, (_, i) => i + 1);   // 1-12
const zone2 = Array.from({ length: 12 }, (_, i) => i + 13);  // 13-24
const zone3 = Array.from({ length: 11 }, (_, i) => i + 25);  // 25-35

// ==================== 2. 计算单期三区比例 ====================
function getDLTRatio(balls) {
  let n1 = 0, n2 = 0, n3 = 0;
  for (const num of balls) {
    if (zone1.includes(num)) n1++;
    else if (zone2.includes(num)) n2++;
    else n3++;
  }
  return `${n1}:${n2}:${n3}`;
}

// ==================== 3. 统计多期比例数量分布（核心方法） ====================
function countDLTDistribution(historyData) {
  const result = {};

  // 遍历每一期开奖数据
  for (const balls of historyData) {
    const ratio = getDLTRatio(balls);
    // 统计数量
    result[ratio] = (result[ratio] || 0) + 1;
  }

  // 按出现数量 降序排序
  return Object.entries(result)
    .sort((a, b) => b[1] - a[1])
    .map(([ratio, count]) => ({ ratio, count }));
}

// ==================== 4. 测试数据（替换成你的真实开奖数据） ====================
const historyData = dltHistory.map(item => item.redBall); // 提取红球数据进行分析

// ==================== 5. 执行统计 ====================
const distribution = countDLTDistribution(historyData);

// 输出结果
console.log("==== 大乐透前区三区比例数量分布（按次数降序）====");
distribution.forEach(item => {
  console.log(`${item.ratio}  数量：${item.count}`);
});