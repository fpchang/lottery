/**
 * 解析快乐8开奖数据字符串数组（不去重，保留所有条目）
 * @param {string[]} arr - 原始开奖字符串数组
 * @returns {Array<{index: string, date: string, redBall: number[]}>} 格式化后的开奖数据
 */
function parseHappy8Data(arr) {
  const result = [];

  for (const str of arr) {
    // 1. 提取期号
    const indexMatch = str.match(/快乐8\s*(\d+)期/);
    // 2. 提取日期
    const dateMatch = str.match(/\((\d{4}-\d{2}-\d{2})\)/);
    // 3. 提取所有开奖号码
    const numberMatch = str.match(/:\s*((?:\d{2}\s*)+)/);

    // 数据不完整则跳过
    if (!indexMatch || !dateMatch || !numberMatch) continue;

    const index = indexMatch[1];
    const date = dateMatch[1];

    // 处理号码：自动去掉前导 0 → 03 → 3
    const redBall = numberMatch[1]
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((num) => parseInt(num, 10));

    // 直接 push，不做去重
    result.push({ index, date, redBall });
  }

  return result;
}

// ==================== 测试 ====================
const inputArr = [
'快乐8 2026108期(2026-04-28)开奖号: 03 04 16 18 27 29 32 33 41 45 46 47 49 50 53 61 66 74 77 80',
'快乐8 2026109期(2026-04-29)开奖号: 05 11 18 23 24 25 30 33 36 37 38 39 40 57 61 64 66 70 71 76',
'快乐8 2026110期(昨天)开奖号: 10 13 14 26 27 29 30 39 43 46 47 51 53 55 57 58 68 71 75 76'

];

const result = parseHappy8Data(inputArr);
console.log(JSON.stringify(result, null, 2));
