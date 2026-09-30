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
    const index = fullPeriod; // 去掉前2位 → 26029

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
 '大乐透 2026094期(2026-08-19)开奖号: 05 14 15 17 33+01 07',
<<<<<<< HEAD
 '大乐透 2026095期(2026-08-22)开奖号: 04 06 08 10 14+04 05'
=======
 '大乐透 2026095期(2026-08-22)开奖号: 04 06 08 10 14+04 05',
 '大乐透 2026096期(2026-08-24)开奖号: 08 09 10 11 25+04 12',
 '大乐透 2026097期(2026-08-26)开奖号: 03 10 12 20 25+01 09',
 '大乐透 2026098期(2026-08-29)开奖号: 07 09 18 19 21+02 09',
 '大乐透 2026099期(2026-08-31)开奖号: 02 17 20 29 33+08 09',
 '大乐透 2026100期(2026-09-02)开奖号: 02 06 11 15 31+07 08'

>>>>>>> 5e99376d0b3fa08d1fda350168ca77ff6038c4c8

  
  
  
];
const output = parseLotteryData(input);
console.log(output);
