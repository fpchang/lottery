// 原始数据
const data = [
  '双色球 2026076期(2026-07-05)开奖号: 01 03 19 20 24 25+07',
  '双色球 2026077期(2026-07-07)开奖号: 01 04 05 14 18 25+04',
  '双色球 2026078期(2026-07-09)开奖号: 07 11 14 16 27 28+06',
  '双色球 2026079期(2026-07-12)开奖号: 01 11 17 22 24 29+04',

  
 
  
  
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