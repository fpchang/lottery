// 原始数据
const data = [
  '双色球 2026098期(2026-08-25)开奖号: 08 16 18 22 25 26+07',
  '双色球 2026099期(2026-08-27)开奖号: 01 12 14 18 30 31+02',
  '双色球 2026100期(2026-08-30)开奖号: 03 04 09 13 22 31+04',
  '双色球 2026101期(2026-09-01)开奖号: 05 06 08 09 24 25+12'

  
  
 

  
 
  
  
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