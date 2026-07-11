/**
 * 大乐透字符串开奖数据转换算法
 * @param {string[]} arr 原始数组
 * @returns {Array} 格式化后的开奖数据
 */
function parseLotteryData(arr) {
  if (!arr || arr.length === 0) return [];
  const result = [];
  arr.map((item) => {
    const str = item;

    // 1. 匹配期号（2026029 → 26029）
    const periodMatch = str.match(/(\d{7})期/);
    const fullPeriod = periodMatch ? periodMatch[1] : ""; // 2026029
    const index = fullPeriod.slice(2); // 去掉前2位 → 26029

    // 2. 匹配日期
    const dateMatch = str.match(/(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch ? dateMatch[1] : "";

    // 3. 匹配红球 + 蓝球
    const numberMatch = str.match(/开奖号:\s*([\d\s]+)\+([\d\s]+)/);
    if (!numberMatch) return [];

    // 红球
    const redStr = numberMatch[1].trim();
    const redBall = redStr.split(/\s+/).map(Number);

    // 蓝球
    const blueStr = numberMatch[2].trim();
    const blueBall = blueStr.split(/\s+/).map(Number);

    // 组装结果
    result.push({
      index,
      date,
      redBall,
      blueBall,
    });
  });

  return result;
}

const input = [
  "大乐透 2026069期(2026-06-22)开奖号: 12 19 21 24 29+03 10",
  '大乐透 2026070期(2026-06-24)开奖号: 04 05 15 21 32+02 11',
  '大乐透 2026071期(2026-06-27)开奖号: 05 13 22 26 32+02 03',
  '大乐透 2026072期(2026-06-29)开奖号: 01 13 26 29 30+09 11',
  '大乐透 2026073期(2026-07-01)开奖号: 04 10 22 23 33+02 12',
  
  
  
];
const output = parseLotteryData(input);
console.log(output);
