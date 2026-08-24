// 原始数据
const data = [
  '双色球 2026095期(2026-08-18)开奖号: 04 06 14 21 22 33+16',
  '双色球 2026096期(2026-08-20)开奖号: 01 04 16 22 26 31+04'
  
  
 

  
 
  
  
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