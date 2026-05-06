/**
 * 大乐透字符串开奖数据转换算法
 * @param {string[]} arr 原始数组
 * @returns {Array} 格式化后的开奖数据
 */
function parseLotteryData(arr) {
  if (!arr || arr.length === 0) return [];
   const result = []
  arr.map(item=>{
const str = item
 

  // 1. 匹配期号（2026029 → 26029）
  const periodMatch = str.match(/(\d{7})期/)
  const fullPeriod = periodMatch ? periodMatch[1] : '' // 2026029
  const index = fullPeriod.slice(2) // 去掉前2位 → 26029

  // 2. 匹配日期
  const dateMatch = str.match(/(\d{4}-\d{2}-\d{2})/)
  const date = dateMatch ? dateMatch[1] : ''

  // 3. 匹配红球 + 蓝球
  const numberMatch = str.match(/开奖号:\s*([\d\s]+)\+([\d\s]+)/)
  if (!numberMatch) return []

  // 红球
  const redStr = numberMatch[1].trim()
  const redBall = redStr.split(/\s+/).map(Number)

  // 蓝球
  const blueStr = numberMatch[2].trim()
  const blueBall = blueStr.split(/\s+/).map(Number)

  // 组装结果
  result.push({
    index,
    date,
    redBall,
    blueBall
  })
  })
  

  return result
}

const input = [

    '大乐透 2026030期(2026-03-23)开奖号: 02 13 22 28 34+05 12',
    '大乐透 2026031期(2026-03-25)开奖号: 06 08 22 29 34+05 07',
    '大乐透 2026032期(2026-03-28)开奖号: 03 04 19 26 32+01 12',
    '大乐透 2026033期(2026-03-30)开奖号: 03 05 07 09 18+02 10',
    '大乐透 2026034期(2026-04-01)开奖号: 11 12 25 26 27+08 11',
    '大乐透 2026035期(2026-04-04)开奖号: 02 22 30 33 34+08 12',
    '大乐透 2026036期(2026-04-06)开奖号: 04 07 16 26 32+05 08',
    '大乐透 2026037期(2026-04-08)开奖号: 07 12 13 28 32+06 08',
    '大乐透 2026038期(2026-04-11)开奖号: 08 17 21 33 35+06 07',
    '大乐透 2026039期(2026-04-13)开奖号: 09 11 20 26 27+06 09',
    '大乐透 2026040期(2026-04-15)开奖号: 06 12 13 21 34+08 09',
    '大乐透 2026041期(2026-04-18)开奖号: 24 25 27 29 34+02 06',
    '大乐透 2026042期(2026-04-20)开奖号: 02 07 13 19 24+03 08',
    '大乐透 2026043期(2026-04-22)开奖号: 08 12 14 19 22+11 12',
    '大乐透 2026044期(2026-04-25)开奖号: 03 08 22 26 29+07 10',
    '大乐透 2026045期(2026-04-27)开奖号: 01 15 21 26 33+04 07',
    '大乐透 2026046期(2026-04-29)开奖号: 01 13 18 27 33+04 07',
    '大乐透 2026047期(2026-05-02)开奖号: 09 20 21 23 28+06 11',
    '大乐透 2026048期(2026-05-04)开奖号: 11 17 20 23 35+01 10'
]
const output = parseLotteryData(input)
console.log(output)