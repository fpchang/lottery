import { historyKl8 } from "../../../common/kl8.js";

/**
 * 快乐8选10组合分析工具类
 * 功能：1. 生成20个开奖号的所有选10组合 2. 计算组合与每期开奖的重复号码数
 */
class Happy8Analyzer {
  constructor() {
    // 存储历史开奖记录（格式：[{drawId: 期数, numbers: [20个号码数组]}, ...]）
    this.historyDraws = [];
    // 快乐8号码范围校验
    this.numberMin = 1;
    this.numberMax = 80;
  }

  /**
   * 加载历史开奖记录
   * @param {Array<Object>} historyData - 历史数据，例：[{drawId: 1, numbers: [1,2,...,20]}, {drawId: 2, numbers: [5,6,...,24]}]
   */
  loadHistoryDraws(historyData) {
    if (!Array.isArray(historyData)) {
      throw new Error("历史数据必须是数组格式");
    }

    this.historyDraws = historyData.filter((draw) => {
      // 基础校验
      if (!draw.drawId || !Array.isArray(draw.numbers)) {
        console.warn(
          `无效开奖记录（缺少期数/号码）：${JSON.stringify(draw)}，已跳过`,
        );
        return false;
      }
      if (draw.numbers.length !== 20) {
        console.warn(`期数 ${draw.drawId}：开奖号码数量非20个，已跳过`);
        return false;
      }
      const uniqueNums = [...new Set(draw.numbers)];
      if (uniqueNums.length !== 20) {
        console.warn(`期数 ${draw.drawId}：开奖号码有重复，已跳过`);
        return false;
      }
      const isValidRange = draw.numbers.every(
        (num) => num >= this.numberMin && num <= this.numberMax,
      );
      if (!isValidRange) {
        console.warn(`期数 ${draw.drawId}：号码超出1-80范围，已跳过`);
        return false;
      }
      // 标准化：排序+转Set，方便后续计算交集
      draw.numbers = draw.numbers.sort((a, b) => a - b);
      draw.numberSet = new Set(draw.numbers);
      return true;
    });

    console.log(`成功加载 ${this.historyDraws.length} 条有效历史开奖记录`);
  }

  /**
   * 核心方法：生成20个号码的所有选10组合（回溯算法）
   * @param {Array<number>} numbers - 20个开奖号码
   * @returns {Array<Array<number>>} 所有选10组合（已排序）
   */
  generateAll10Combinations(numbers) {
    // 前置校验
    if (numbers.length !== 20) {
      throw new Error("仅支持从20个号码中生成选10组合");
    }
    const result = [];
    // 回溯函数：start=起始索引，path=当前组合
    const backtrack = (start, path) => {
      // 终止条件：组合长度为10
      if (path.length === 10) {
        result.push([...path]);
        return;
      }
      // 遍历：从start开始，避免重复组合（如[1,2]和[2,1]视为同一组合）
      for (let i = start; i < numbers.length; i++) {
        path.push(numbers[i]);
        backtrack(i + 1, path);
        path.pop(); // 回溯
      }
    };
    // 先排序，保证生成的组合有序
    const sortedNumbers = [...numbers].sort((a, b) => a - b);
    backtrack(0, []);
    console.log(
      `从20个号码中生成了 ${result.length} 个选10组合（C(20,10)=184756）`,
    );
    return result;
  }

  /**
   * 计算单个选10组合与所有历史开奖的重复号码数
   * @param {Array<number>} combo - 选10组合
   * @returns {Array<Object>} 重复数统计，例：[{drawId: 1, repeatCount: 5}, {drawId: 2, repeatCount: 3}]
   */
  calculateRepeatCount(combo) {
    // 组合合法性校验
    if (combo.length !== 10) {
      throw new Error("选10组合必须包含10个号码");
    }
    const comboSet = new Set(combo);
    const repeatStats = [];

    // 遍历所有历史开奖，计算交集数量
    this.historyDraws.forEach((draw) => {
      let repeatCount = 0;
      combo.forEach((num) => {
        if (draw.numberSet.has(num)) {
          repeatCount++;
        }
      });
      repeatStats.push({
        drawId: draw.drawId,
        repeatCount: repeatCount,
        drawNumbers: draw.numbers, // 可选：返回当期开奖号，方便核对
      });
    });

    return repeatStats;
  }

  /**
   * 批量分析：生成指定开奖期数的所有选10组合，并计算每个组合的重复数
   * @param {number} targetDrawId - 目标期数（要生成其选10组合的开奖期）
   * @returns {Array<Object>} 分析结果，例：[{combo: [1,2,...,10], repeatStats: [{drawId:1, repeatCount:5}, ...]}, ...]
   */
  batchAnalyze(targetDrawId) {
    // 找到目标期数的开奖号码
    const targetDraw = this.historyDraws.find((d) => d.drawId === targetDrawId);
    if (!targetDraw) {
      throw new Error(`未找到期数 ${targetDrawId} 的开奖记录`);
    }

    // 生成该期20个号码的所有选10组合
    const allCombos = this.generateAll10Combinations(targetDraw.numbers);

    // 批量计算每个组合的重复数
    const analyzeResult = allCombos.map((combo) => ({
      combo: combo,
      repeatStats: this.calculateRepeatCount(combo),
    }));

    return analyzeResult;
  }
}

// ====================== 使用示例 ======================
// 1. 初始化分析工具
const happy8Analyzer = new Happy8Analyzer();

// 2. 加载历史开奖数据（示例：3期开奖，每期20个号码）
const mockHistoryData = historyKl8.map((item,index) => {
  return { drawId: index+1, numbers: item.redBall };
});
//console.log("111",mockHistoryData);
//  [
//   {
//     drawId: 1,
//     numbers: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
//   },
//   {
//     drawId: 2,
//     numbers: [5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
//   },
//   {
//     drawId: 3,
//     numbers: [10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29]
//   }
// ];
happy8Analyzer.loadHistoryDraws(mockHistoryData);

// 3. 生成期数1的20个号码的所有选10组合，并分析每个组合的重复数
try {
  const analyzeResult = happy8Analyzer.batchAnalyze(1);

  // 示例：打印前2个组合的分析结果（避免输出18万+条数据）
  console.log("前2个选10组合的重复数统计：");
  analyzeResult.slice(0, 2).forEach((item, index) => {
    console.log(`\n组合${index + 1}：[${item.combo}]`);
    item.repeatStats.forEach((stat) => {
      console.log(`  期数${stat.drawId}：重复号码数 = ${stat.repeatCount}`);
    });
  });

  // 示例：查询某个特定组合的重复数
  //const testCombo = [1,2,3,4,5,6,7,8,9,10];
  // const testRepeatStats = happy8Analyzer.calculateRepeatCount(testCombo);
  // console.log(`\n特定组合 [${testCombo}] 的重复数：`);
  testRepeatStats.forEach((stat) => {
    console.log(`  期数${stat.drawId}：${stat.repeatCount}个重复号码`);
  });
} catch (e) {
  console.error("分析失败：", e.message);
}
