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
'快乐8 2026144期(2026-06-03)开奖号: 03 04 12 24 27 30 34 50 53 55 61 63 65 69 70 72 74 75 76 77',
'快乐8 2026145期(2026-06-04)开奖号: 02 04 05 15 19 24 27 29 32 33 36 38 50 52 60 64 66 69 74 75',
'快乐8 2026146期(2026-06-05)开奖号: 04 07 09 10 14 27 38 39 40 43 44 45 48 50 54 56 66 70 77 78',
'快乐8 2026147期(昨天)开奖号: 03 06 07 10 11 12 14 17 22 24 28 35 37 38 45 50 52 67 77 79',
];

const result = parseHappy8Data(inputArr);
console.log(JSON.stringify(result, null, 2));
