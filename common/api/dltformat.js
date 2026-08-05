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
 '大乐透 2026080期(2026-07-18)开奖号: 05 10 15 21 23+07 08',
 '大乐透 2026081期(2026-07-20)开奖号: 08 16 18 24 34+09 12',
 '大乐透 2026082期(2026-07-22)开奖号: 16 26 27 28 34+02 06',
'大乐透 2026083期(2026-07-25)开奖号: 14 15 16 23 26+07 09',
'大乐透 2026084期(2026-07-27)开奖号: 13 25 30 32 33+04 05',
'大乐透 2026085期(2026-07-29)开奖号: 03 04 14 28 31+05 07',
'大乐透 2026086期(2026-08-01)开奖号: 10 11 18 22 35+06 12',
'大乐透 2026087期(2026-08-03)开奖号: 05 10 16 24 27+04 10'
  
  
  
];
const output = parseLotteryData(input);
console.log(output);
