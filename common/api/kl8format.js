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
'快乐8 2026215期(2026-08-13)开奖号: 01 09 14 19 21 22 24 27 36 41 44 51 55 60 61 69 71 76 78 80',
'快乐8 2026216期(2026-08-14)开奖号: 02 03 13 19 22 24 25 28 29 42 43 45 49 62 63 69 70 72 76 80',
'快乐8 2026217期(昨天)开奖号: 07 08 10 11 14 18 20 21 24 28 29 33 41 46 67 68 74 76 77 78',


];

const result = parseHappy8Data(inputArr);
console.log(JSON.stringify(result, null, 2));
