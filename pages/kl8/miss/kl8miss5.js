import { historyKl8 } from "../../../common/kl8.js";
/**
 * 快乐8选5最大遗漏计算算法
 * 功能：基于历史开奖数据，计算选5组合遗漏值并降序排列
 */

/**
 * 从单期开奖号码中提取所有选5组合（去重、排序）
 * @param {number[]} draw 单期开奖号码（20个，如[1,2,3,...,20]）
 * @returns {string[]} 选5组合字符串数组（如["1,2,3,4,5", "1,2,3,4,6"]）
 */
function generateSelect5Combinations(draw) {
  const combinations = [];
  // 回溯法生成所有选5组合
  const backtrack = (start, path) => {
    if (path.length === 5) {
      // 排序后转字符串，确保组合唯一（如[2,1,3,4,5]转为"1,2,3,4,5"）
      combinations.push(path.sort((a, b) => a - b).join(","));
      return;
    }
    for (let i = start; i < draw.length; i++) {
      path.push(draw[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  };
  backtrack(0, []);
  return combinations;
}

/**
 * 计算选5所有组合的遗漏值
 * @param {number[][]} historyData 历史开奖数据（最新期在前，如[[期0号码], [期1号码], ...]）
 * @returns {Array} 包含组合和遗漏值的数组，格式：[{combination: [1,2,3,4,5], omission: 8}, ...]
 */
function calculateSelect5Omission(historyData) {
  // 1. 校验输入
  if (!Array.isArray(historyData) || historyData.length === 0) {
    throw new Error("历史开奖数据不能为空，且必须是二维数组");
  }
  historyData.forEach((draw, index) => {
    if (!Array.isArray(draw) || draw.length !== 20) {
      throw new Error(`第${index + 1}期开奖数据格式错误，必须包含20个号码`);
    }
  });

  const totalPeriods = historyData.length;
  // 存储每个选5组合最后一次出现的期数索引（key=组合字符串，value=期数索引）
  const lastOccurrenceMap = new Map();

  // 2. 遍历所有历史期，记录组合最后一次出现的期数
  for (let periodIndex = 0; periodIndex < totalPeriods; periodIndex++) {
    const currentDraw = historyData[periodIndex];
    const select5Combs = generateSelect5Combinations(currentDraw);
    // 覆盖更新最后一次出现的期数（后遍历的期数索引更小，是更新的期）
    select5Combs.forEach((combStr) => {
      lastOccurrenceMap.set(combStr, periodIndex);
    });
  }

  // 3. 计算每个组合的遗漏值并格式化结果
  const result = [];
  lastOccurrenceMap.forEach((lastIndex, combStr) => {
    // 遗漏值 = 最后一次出现的期数索引（最新期索引0，遗漏0期；期数索引越大，遗漏值越大）
    const omission = lastIndex;
    result.push({
      combination: combStr.split(",").map(Number), // 转回数字数组
      omission: omission,
    });
  });

  // 4. 处理从未出现的选5组合（可选，遗漏值=历史总期数）
  // 若需要包含从未出现的组合，取消以下注释（注意：选5总组合数极大，会增加计算耗时）
  // const allNumbers = Array.from({ length: 80 }, (_, i) => i + 1);
  // const allSelect5Combs = generateSelect5Combinations(allNumbers);
  // allSelect5Combs.forEach(combStr => {
  //     if (!lastOccurrenceMap.has(combStr)) {
  //         result.push({
  //             combination: combStr.split(',').map(Number),
  //             omission: totalPeriods
  //         });
  //     }
  // });

  // 5. 按遗漏值降序排列
  result.sort((a, b) => b.omission - a.omission);

  return result;
}

// ===================== 测试用例 =====================
// 模拟历史开奖数据（最新期在前，共5期，每期20个号码）
const mockHistoryData = historyKl8.map((item) => item.redBall);

// 执行算法并打印结果
try {
  // const select5OmissionResult = calculateSelect5Omission(mockHistoryData);
  console.log("===== 快乐8选5遗漏值（降序排列） =====");
  // 打印前20个最大遗漏组合（可根据需要调整数量）
  // console.log(select5OmissionResult);
  // select5OmissionResult.slice(0, 200).forEach((item, index) => {
  //     console.log(`第${index+1}名：组合[${item.combination.join(',')}] → 遗漏${item.omission}期`);
  // });
} catch (error) {
  console.error("计算失败：", error.message);
}
export function getkl8miss5(history = mockHistoryData) {
  const select5OmissionResult = calculateSelect5Omission(history);
  return select5OmissionResult.map((item) => item.combination);
}
function test() {
  const historyList = historyKl8
    .map((item) => item.redBall)
    .slice(0, historyKl8.length - 90);
  let miss5 = getkl8miss5(historyList);
  let miss4list = [
    [1, 14, 40, 63],
    [23, 60, 75, 80],
    [3, 8, 62, 67],
    [11, 23, 28, 67],
    [4, 8, 16, 33],
  ];
  let result = [];
  console.log("miss5",miss5.length);
  miss4list.forEach((item) => {
    const obj = miss5.find((list) => {
        let grouplist= new Set([...item, ...list]);
      return grouplist.size == list.length;
    });
    if (obj) {
      result.push(obj);
    } else {
      console.log("nofind");
    }
  });

  console.log("getmiss5", result);
}
test();