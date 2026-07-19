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
'快乐8 2026180期(2026-07-09)开奖号: 01 02 05 12 19 23 36 37 41 42 50 53 56 59 64 68 72 73 74 77',
'快乐8 2026181期(2026-07-10)开奖号: 06 10 12 18 22 28 30 33 35 38 42 48 58 59 63 64 65 71 76 79'



];

const result = parseHappy8Data(inputArr);
console.log(JSON.stringify(result, null, 2));
