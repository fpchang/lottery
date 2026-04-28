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
    '大乐透 2026027期(2026-03-16)开奖号: 09 10 11 12 16+01 11',
    '大乐透 2026028期(2026-03-18)开奖号: 15 27 29 30 34+01 10',
    '大乐透 2026029期(2026-03-21)开奖号: 03 05 17 33 35+05 07'
]
const output = parseLotteryData(input)
console.log(output)