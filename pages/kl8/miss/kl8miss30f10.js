import { historyKl8 } from "../../../common/kl8.js";
/**
 * 快乐8 前30选10 遗漏组合计算器
 * 
 * 组合索引规则：将 1~30 中选10个号码，按字典序映射为 0 ~ C(30,10)-1 的索引
 */

class KenoTop30Pick10Missing {
  constructor() {
    this.totalNums = 30;   // 前30个号 (1~30)
    this.pickCount = 10;   // 选10
    this.totalCombos = this.comb(30, 10); // 30045015
    
    // 存储每个组合最后出现的期号，0 表示从未开出
    this.lastAppear = new Uint32Array(this.totalCombos);
    this.currentPeriod = 0; // 当前处理到第几期
    
    // 预计算组合数表，加速索引计算
    this.combTable = this.buildCombTable();
  }

  /**
   * 计算组合数 C(n, k)
   */
  comb(n, k) {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    k = Math.min(k, n - k);
    let result = 1;
    for (let i = 0; i < k; i++) {
      result = result * (n - i) / (i + 1);
    }
    return Math.floor(result);
  }

  /**
   * 预构建组合数表 combTable[n][k] = C(n, k)
   * 用于快速计算组合索引
   */
  buildCombTable() {
    const n = this.totalNums;
    const table = [];
    for (let i = 0; i <= n; i++) {
      table[i] = new Uint32Array(n + 1);
      table[i][0] = 1;
      table[i][i] = 1;
      for (let j = 1; j < i; j++) {
        table[i][j] = table[i - 1][j - 1] + table[i - 1][j];
      }
    }
    return table;
  }

  /**
   * 将排序后的10个号码（1-based）转换为组合索引（字典序）
   * nums: 升序排列的10个号码，如 [1,3,5,7,9,11,13,15,17,19]
   */
  comboToIndex(nums) {
    let index = 0;
    let prev = 0; // 上一个号码的 0-based 值
    for (let i = 0; i < this.pickCount; i++) {
      const curr = nums[i] - 1; // 转为 0-based
      // 累加跳过的组合数
      for (let j = prev; j < curr; j++) {
        // 从剩余的 (totalNums - 1 - j) 个号中选 (pickCount - 1 - i) 个
        index += this.combTable[this.totalNums - 1 - j][this.pickCount - 1 - i];
      }
      prev = curr + 1;
    }
    return index;
  }

  /**
   * 将组合索引还原为10个号码（1-based，升序）
   */
  indexToCombo(index) {
    const nums = [];
    let prev = 0;
    let remaining = index;
    for (let i = 0; i < this.pickCount; i++) {
      let j = prev;
      while (j < this.totalNums) {
        const c = this.combTable[this.totalNums - 1 - j][this.pickCount - 1 - i];
        if (remaining < c) break;
        remaining -= c;
        j++;
      }
      nums.push(j + 1); // 转回 1-based
      prev = j + 1;
    }
    return nums;
  }

  /**
   * 处理一期开奖数据，更新遗漏
   * @param {number[]} drawNumbers - 当期开出的20个号码（1~80）
   * @param {number} periodNumber - 期号（递增整数）
   */
  processDraw(drawNumbers, periodNumber) {
    this.currentPeriod = periodNumber;
    
    // 筛选出前30号中开出的号码，并排序
    const top30Hit = drawNumbers
      .filter(n => n <= 30)
      .sort((a, b) => a - b);
    
    const n = top30Hit.length;
    if (n < this.pickCount) return; // 不足10个，没有组合需要更新
    
    // 枚举 top30Hit 中所有选10的组合，更新最后出现期号
    this.enumerateCombos(top30Hit, this.pickCount, (combo) => {
      const idx = this.comboToIndex(combo);
      this.lastAppear[idx] = periodNumber;
    });
  }

  /**
   * 递归枚举从 nums 中选 k 个的所有组合
   */
  enumerateCombos(nums, k, callback, start = 0, current = []) {
    if (current.length === k) {
      callback(current);
      return;
    }
    const remaining = k - current.length;
    for (let i = start; i <= nums.length - remaining; i++) {
      current.push(nums[i]);
      this.enumerateCombos(nums, k, callback, i + 1, current);
      current.pop();
    }
  }

  /**
   * 获取指定组合的遗漏值
   * @param {number[]} nums - 10个号码（1~30）
   * @returns {number} 遗漏期数，-1 表示从未开出
   */
  getMissing(nums) {
    const sorted = [...nums].sort((a, b) => a - b);
    const idx = this.comboToIndex(sorted);
    const last = this.lastAppear[idx];
    if (last === 0) return -1; // 从未开出
    return this.currentPeriod - last;
  }

  /**
   * 获取遗漏值最大的 top N 个组合
   * @param {number} topN - 返回前多少个
   * @param {boolean} includeNever - 是否包含从未开出的组合
   * @returns {Array<{combo: number[], missing: number}>}
   */
  getTopMissing(topN = 20, includeNever = false) {
    const results = [];
    
    for (let i = 0; i < this.totalCombos; i++) {
      const last = this.lastAppear[i];
      const missing = last === 0 ? Infinity : this.currentPeriod - last;
      
      if (!includeNever && last === 0) continue;
      
      if (results.length < topN) {
        results.push({ index: i, missing });
        results.sort((a, b) => b.missing - a.missing);
      } else if (missing > results[results.length - 1].missing) {
        results[results.length - 1] = { index: i, missing };
        results.sort((a, b) => b.missing - a.missing);
      }
    }
    
    return results.map(r => ({
      combo: this.indexToCombo(r.index),
      missing: r.missing === Infinity ? -1 : r.missing
    }));
  }

  /**
   * 统计遗漏分布（按区间统计组合数量）
   * @param {number[]} buckets - 区间边界，如 [0, 10, 50, 100, 500, 1000]
   */
  getMissingDistribution(buckets = [0, 10, 50, 100, 500, 1000, 5000]) {
    const distribution = {};
    let neverCount = 0;
    
    for (let i = 0; i < this.totalCombos; i++) {
      const last = this.lastAppear[i];
      if (last === 0) {
        neverCount++;
        continue;
      }
      const missing = this.currentPeriod - last;
      
      let bucketKey = `${buckets[buckets.length - 1]}+`;
      for (let j = 0; j < buckets.length - 1; j++) {
        if (missing >= buckets[j] && missing < buckets[j + 1]) {
          bucketKey = `${buckets[j]}-${buckets[j + 1] - 1}`;
          break;
        }
      }
      if (missing >= buckets[buckets.length - 1]) {
        bucketKey = `${buckets[buckets.length - 1]}+`;
      }
      
      distribution[bucketKey] = (distribution[bucketKey] || 0) + 1;
    }
    
    return {
      neverAppeared: neverCount,
      distribution
    };
  }

  /**
   * 批量处理多期历史数据
   * @param {Array<{period: number, numbers: number[]}>} history - 历史开奖数据，按期号升序
   */
  batchProcess(history) {
    // 按期号升序排列
    history.sort((a, b) => a.period - b.period);
    
    for (const record of history) {
      this.processDraw(record.numbers, record.period);
    }
  }
}

// ========== 使用示例 ==========

// 模拟一些历史数据（实际使用时替换为真实历史开奖数据）
function generateMockHistory(count = 100) {
  const history = [];
  for (let p = 1; p <= count; p++) {
    // 模拟从1~80中随机选20个
    const pool = Array.from({ length: 80 }, (_, i) => i + 1);
    const numbers = [];
    for (let i = 0; i < 20; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      numbers.push(pool.splice(idx, 1)[0]);
    }
    numbers.sort((a, b) => a - b);
    history.push({ period: p, numbers });
  }
  return history;
}

// 运行示例
const calculator = new KenoTop30Pick10Missing();

// 加载历史数据
const history = historyKl8.map(record => ({
  period: record.index,
  numbers: record.redBall
}));
console.log(`总组合数: ${calculator.totalCombos.toLocaleString()}`);
console.log(`历史期数: ${history.length}`);

console.time('处理耗时');
calculator.batchProcess(history);
console.timeEnd('处理耗时');

// 查询某个组合的遗漏
// const testCombo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// const missing = calculator.getMissing(testCombo);
// console.log(`\n组合 [${testCombo.join(',')}] 遗漏: ${missing === -1 ? '从未开出' : missing + '期'}`);

// 获取遗漏最大的前10个组合
const topMissing = calculator.getTopMissing(10, false);
console.log('\n遗漏最大的前10个组合:');
topMissing.forEach((item, i) => {
  console.log(`  ${i + 1}. [${item.combo.join(',')}] 遗漏 ${item.missing} 期`);
});

// 遗漏分布统计
const dist = calculator.getMissingDistribution([0, 10, 50, 100, 200, 300, 500]);
console.log('\n遗漏分布统计:');
console.log(`  从未开出: ${dist.neverAppeared.toLocaleString()} 个组合`);
for (const [range, count] of Object.entries(dist.distribution)) {
  console.log(`  遗漏 ${range}期: ${count.toLocaleString()} 个组合`);
}