import {ssqHistory} from "../../../common/ssq.js";
// 双色球 三区划分（标准）
// 一区：1-11   二区：12-22   三区：23-33

// ====================== 在这里填入你的开奖红球数据 ======================
// 格式：每一期是 [红球1,红球2,红球3,红球4,红球5,红球6]
const lotteryData =ssqHistory.map(item => item.redBall);

// ====================== 统计逻辑（不用改） ======================
function countThreeZoneRatio(data) {
  const result = {};

  for (let balls of data) {
    let zone1 = 0, zone2 = 0, zone3 = 0;
    for (let num of balls) {
      if (num >= 1 && num <= 11) zone1++;
      else if (num >= 12 && num <= 22) zone2++;
      else if (num >= 23 && num <= 33) zone3++;
    }
    const ratio = `${zone1}:${zone2}:${zone3}`;
    result[ratio] = (result[ratio] || 0) + 1;
  }

  // 👇 关键：按出现次数 从大到小排序
  return Object.entries(result)
    .sort((a, b) => b[1] - a[1])
    .map(item => ({ ratio: item[0], count: item[1] }));
}

// 执行
const stats = countThreeZoneRatio(lotteryData);

// 输出
console.log("==== 双色球三区比例统计（按数量降序）====");
stats.forEach(item => {
  console.log(`${item.ratio} 数量：${item.count}`);
});