// 原始数据
const data = [
  '双色球 2026034期(2026-03-29)开奖号: 01 03 07 13 22 23+07',
  '双色球 2026035期(2026-03-31)开奖号: 02 06 12 24 25 32+02',
  '双色球 2026036期(2026-04-02)开奖号: 06 10 12 15 22 28+08',
  '双色球 2026037期(2026-04-05)开奖号: 11 22 27 29 31 33+12',
  '双色球 2026038期(2026-04-07)开奖号: 01 02 13 23 25 27+05',
  '双色球 2026039期(2026-04-09)开奖号: 08 17 18 21 25 30+05'
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