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
'快乐8 2026147期(2026-06-06)开奖号: 03 06 07 10 11 12 14 17 22 24 28 35 37 38 45 50 52 67 77 79',
'快乐8 2026148期(2026-06-07)开奖号: 01 02 07 11 17 18 26 28 30 38 41 42 43 54 59 62 69 71 74 79',
'快乐8 2026149期(2026-06-08)开奖号: 02 04 10 12 13 17 23 30 31 33 37 43 47 55 58 62 65 72 75 77',
'快乐8 2026150期(2026-06-09)开奖号: 07 08 12 18 19 23 24 27 53 54 56 57 59 60 62 70 74 77 78 79',
'快乐8 2026151期(2026-06-10)开奖号: 03 04 06 10 12 21 24 36 37 38 41 42 44 45 49 52 70 73 77 78',
'快乐8 2026152期(昨天)开奖号: 01 03 13 16 18 25 32 35 37 44 45 47 58 59 60 63 66 68 72 75',

];

const result = parseHappy8Data(inputArr);
console.log(JSON.stringify(result, null, 2));
