// 原始数据
const data = [
  '双色球 2026055期(2026-05-17)开奖号: 04 11 24 25 32 33+13',
  
 
  
  
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