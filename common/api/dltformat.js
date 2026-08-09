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
  "大乐透 2026075期(2026-07-06)开奖号: 01 06 16 18 26+04 10",
  '大乐透 2026076期(2026-07-08)开奖号: 15 20 27 28 35+02 11',
  '大乐透 2026077期(2026-07-11)开奖号: 04 14 19 24 27+06 07',
  '大乐透 2026078期(2026-07-13)开奖号: 02 13 20 25 32+08 11',
  '大乐透 2026079期(2026-07-15)开奖号: 06 08 23 26 27+05 12',
  '大乐透 2026080期(2026-07-18)开奖号: 05 10 15 21 23+07 08',


  
  
  
];
const output = parseLotteryData(input);
console.log(output);
