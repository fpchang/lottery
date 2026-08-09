// 原始数据
const data = [
  '双色球 2026082期(2026-07-19)开奖号: 05 07 10 14 21 28+04',
  '双色球 2026083期(2026-07-21)开奖号: 07 14 15 23 28 33+03',
  '双色球 2026084期(2026-07-23)开奖号: 01 05 06 10 12 16+05',
  '双色球 2026085期(2026-07-26)开奖号: 06 09 13 17 24 28+15',
  '双色球 2026086期(2026-07-28)开奖号: 02 05 14 25 30 32+05',
  '双色球 2026087期(2026-07-30)开奖号: 04 06 10 18 23 31+11',
  '双色球 2026088期(2026-08-02)开奖号: 06 07 11 18 22 33+05',
  '双色球 2026089期(2026-08-04)开奖号: 05 18 23 24 27 33+03',
  
 

  
 
  
  
];

// 转换逻辑
const result = data.map(item => {
  // 匹配期号、日期、红球、蓝球
  const match = item.match(/双色球 (\d+)期\((\d{4}-\d{2}-\d{2})\)开奖号: ([\d\s]+)\+(\d+)/);
  
  if (!match) return null;

  const [, index, date, redStr, blueStr] = match;
  
  // 处理红球：转数字数组
  const redBall = redStr.trim().split(/\s+/).map(Number);
  
  // 蓝球转数字
  const blueBall = Number(blueStr);

  return {
    blueBall,
    date,
    index,
    redBall
  };
}).filter(Boolean);

console.log(result);