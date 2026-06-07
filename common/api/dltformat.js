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
  "大乐透 2026050期(2026-05-09)开奖号: 06 10 14 23 33+08 10",
  "大乐透 2026051期(2026-05-11)开奖号: 13 18 28 32 33+02 11",
  "大乐透 2026052期(2026-05-13)开奖号: 02 03 20 28 33+02 12",
  "大乐透 2026053期(2026-05-16)开奖号: 02 09 14 20 31+05 09",
  "大乐透 2026054期(2026-05-18)开奖号: 02 06 14 22 24+08 11",
  "大乐透 2026055期(2026-05-20)开奖号: 09 10 20 33 35+04 11",
  "大乐透 2026056期(2026-05-23)开奖号: 06 07 18 21 30+01 05",
  "大乐透 2026057期(2026-05-25)开奖号: 23 25 26 27 34+04 10",
  "大乐透 2026058期(2026-05-27)开奖号: 07 12 13 18 34+01 05",
  "大乐透 2026059期(2026-05-30)开奖号: 06 13 17 19 26+07 08",
  
];
const output = parseLotteryData(input);
console.log(output);
