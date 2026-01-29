import { historyKl8 } from "../../../common/kl8.js";
/**
 * 快乐8选10算法工具类（适配20个开奖号码规则）
 */
class Happy8Calculator {
  constructor() {
    // 存储历史开奖记录（20个号码的集合，格式为排序后的字符串，如 "1,2,...,20"）
    this.historyDraws = new Set();
    // 快乐8号码范围
    this.numberRange = Array.from({ length: 80 }, (_, i) => i + 1);
  }

  /**
   * 加载历史开奖记录（每期20个号码）
   * @param {Array<Array<number>>} historyData - 历史开奖数据，例：[[1,2,...,20], [5,6,...,24]]
   */
  loadHistoryData(historyData) {
    if (!Array.isArray(historyData)) {
      throw new Error("历史数据必须是数组格式");
    }
    historyData.forEach(drawNumbers => {
      // 校验每期开奖号码数量为20个
      if (drawNumbers.length !== 20) {
        console.warn(`无效开奖记录（非20个号码）：${drawNumbers}，已跳过`);
        return;
      }
      // 去重校验
      const uniqueNumbers = [...new Set(drawNumbers)];
      if (uniqueNumbers.length !== 20) {
        console.warn(`无效开奖记录（有重复号码）：${drawNumbers}，已跳过`);
        return;
      }
      // 范围校验
      if (!drawNumbers.every(num => num >= 1 && num <= 80)) {
        console.warn(`无效开奖记录（号码超出1-80范围）：${drawNumbers}，已跳过`);
        return;
      }
      // 排序后转字符串存储，确保格式统一
      const sortedStr = drawNumbers.sort((a, b) => a - b).join(",");
      this.historyDraws.add(sortedStr);
    });
    console.log(`成功加载 ${this.historyDraws.size} 条不重复的历史开奖记录`);
  }

  /**
   * 验证选10组合是否从未开出过（即未作为任意一期20码开奖号的子集）
   * @param {Array<number>} combination - 待验证的选10组合（10个不重复数字，1-80）
   * @returns {boolean} true=未开出，false=曾开出
   */
  isCombinationUnopened(combination) {
    // 基础校验：选10组合的合法性
    if (combination.length !== 10) return false;
    const uniqueNumbers = [...new Set(combination)];
    if (uniqueNumbers.length !== 10) return false; // 排除重复数字
    if (!combination.every(num => num >= 1 && num <= 80)) return false; // 排除无效数字

    // 遍历所有历史开奖记录，检查该选10组合是否是某期20码的子集
    const comboSet = new Set(combination);
    for (const drawStr of this.historyDraws) {
      const drawNumbers = drawStr.split(",").map(Number);
      const drawSet = new Set(drawNumbers);
      // 检查选10组合的所有号码是否都在当期20个开奖号中
      const isSubset = combination.every(num => drawSet.has(num));
      if (isSubset) {
        return false; // 该组合曾开出过
      }
    }
    return true; // 该组合从未开出过
  }

  /**
   * 批量生成随机的未开出选10组合
   * @param {number} count - 要生成的数量
   * @returns {Array<Array<number>>} 未开出的组合列表
   */
  generateUnopenedCombinations(count) {
    const result = [];
    let attempts = 0;
    const maxAttempts = count * 100; // 最大尝试次数，避免死循环

    while (result.length < count && attempts < maxAttempts) {
      attempts++;
      // 随机生成10个不重复的1-80数字
      const randomCombination = this.generateRandomCombination();
      // 验证是否未开出
      if (this.isCombinationUnopened(randomCombination)) {
        result.push(randomCombination);
      }
    }

    if (result.length < count) {
      console.warn(`仅生成 ${result.length} 个未开出组合（已达最大尝试次数）`);
    }
    return result;
  }

  /**
   * 辅助方法：生成随机选10组合
   * @returns {Array<number>} 10个不重复的数字
   */
  generateRandomCombination() {
    // 深拷贝号码池，避免修改原数组
    const pool = [...this.numberRange];
    const combination = [];
    for (let i = 0; i < 10; i++) {
      // 随机选一个索引
      const randomIndex = Math.floor(Math.random() * pool.length);
      // 取出数字并从池子里删除（避免重复）
      combination.push(pool.splice(randomIndex, 1)[0]);
    }
    // 排序后返回，保持格式统一
    return combination.sort((a, b) => a - b);
  }
}

// ====================== 使用示例 ======================
// 1. 初始化计算器
const happy8 = new Happy8Calculator();

// 2. 加载历史开奖记录（示例数据：每期20个号码）
const mockHistoryData = historyKl8.map(item=>item.redBall);
happy8.loadHistoryData(mockHistoryData);

// 3. 验证单个选10组合是否未开出
const testCombo1 = [1,2,3,4,5,6,7,8,9,10]; // 是第一期20码的子集 → 已开出
console.log(`组合 [${testCombo1}] 是否未开出：`, happy8.isCombinationUnopened(testCombo1)); // false

const testCombo2 = [1,2,3,4,5,6,7,8,9,30]; // 不是任意一期20码的子集 → 未开出
console.log(`组合 [${testCombo2}] 是否未开出：`, happy8.isCombinationUnopened(testCombo2)); // true

// 4. 生成5个未开出的随机选10组合
const unopenedCombos = happy8.generateUnopenedCombinations(5);
console.log("生成的未开出组合：", unopenedCombos);