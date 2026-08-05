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
'快乐8 2026201期(2026-07-30)开奖号: 02 03 12 13 17 20 24 27 31 32 40 45 50 52 61 67 71 76 79 80',
'快乐8 2026202期(2026-07-31)开奖号: 01 04 07 10 12 15 16 17 26 29 32 40 42 44 49 65 68 73 77 78',
'快乐8 2026203期(2026-08-01)开奖号: 02 09 10 21 22 24 29 32 38 40 42 50 51 53 58 60 63 67 70 74',
'快乐8 2026204期(2026-08-02)开奖号: 03 10 13 21 22 24 28 37 38 46 51 52 54 56 59 60 65 66 70 73',
'快乐8 2026205期(2026-08-03)开奖号: 04 05 09 10 11 19 28 31 32 35 36 39 43 47 53 56 59 70 77 79',
'快乐8 2026206期(2026-08-04)开奖号: 01 06 07 16 17 21 27 32 33 36 44 47 50 51 55 62 64 76 78 79',


];

const result = parseHappy8Data(inputArr);
console.log(JSON.stringify(result, null, 2));
