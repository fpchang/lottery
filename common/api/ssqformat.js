// 原始数据
const data = [
  '双色球 2026091期(2026-08-09)开奖号: 02 13 14 16 20 24+05',
  '双色球 2026092期(2026-08-11)开奖号: 09 11 12 25 30 33+11'
  
  
 

  
 
  
  
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