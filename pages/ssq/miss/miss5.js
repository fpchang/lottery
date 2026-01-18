import {ssqHistory} from "../../../common/ssq.js"
/**
 * 双色球红球组合计算工具
 * 计算从1-33中选6个红球的所有组合
 */
class DoubleColorBall {
  constructor() {
    this.redBalls = Array.from({ length: 33 }, (_, i) => i + 1); // 生成1-33的红球数组
    this.allCombinations = []; // 存储所有组合
  }

  /**
   * 递归生成组合
   * @param {number[]} current - 当前已选号码
   * @param {number} start - 开始索引（避免重复组合）
   */
  generateCombinations(current = [], start = 0) {
    // 递归终止条件：已选6个号码
    if (current.length === 6) {
      this.allCombinations.push([...current]);
      return;
    }

    // 遍历剩余号码，start确保不重复（只往后选）
    for (let i = start; i < this.redBalls.length; i++) {
      current.push(this.redBalls[i]);
      this.generateCombinations(current, i + 1); // 下一次从i+1开始，避免重复
      current.pop(); // 回溯：移除最后一个元素，尝试下一个号码
    }
  }

  /**
   * 获取所有红球组合
   * @returns {number[][]} 所有6个红球的组合（升序排列）
   */
  getAllRedBallCombinations() {
    this.allCombinations = []; // 重置组合数组
    this.generateCombinations();
    return this.allCombinations;
  }

  /**
   * 格式化组合输出（补零，如 1 → 01）
   * @param {number[]} combination - 单个组合
   * @returns {string} 格式化后的字符串
   */
  formatCombination(combination) {
    return combination.map(num => num.toString().padStart(2, '0')).join(' ');
  }

  /**
   * 打印所有组合（可选，因数量巨大，建议只打印总数）
   */
  printCombinations() {
    const combinations = this.getAllRedBallCombinations();
    console.log(`双色球红球总组合数：${combinations.length}`);
    
    // 示例：只打印前10个组合
    console.log('前10个组合示例：');
    combinations.slice(0, 10).forEach((comb, index) => {
      console.log(`${index + 1}: ${this.formatCombination(comb)}`);
    });
  }
}

function filterList(){
    const ballCalculator = new DoubleColorBall();
 let combinations = ballCalculator.getAllRedBallCombinations();
 //第一步过滤
combinations=combinations.filter(item=>{
    return !item.includes(2)&&!item.includes(6)&&!item.includes(22)&&!item.includes(23)&&!item.includes(24)&&!item.includes(28);
})
console.log("第一步过滤完后",combinations.length);
//第二步定胆
combinations=combinations.filter(item=>{
    return item.includes(9)&&item.includes(13)&&item.includes(29)&&item[0]==9&&item[1]==13;
})
 const ssqHistoryArray=ssqHistory.map(item=>item.redBall);
 console.log(111,combinations.length,2222)
 //第二步过滤
 const list = combinations.filter(item=>{
   let flag= ssqHistoryArray.find(s=> new Set([...s,...item]).size<=7)
   return flag?false:true;
 })
 console.log("过滤后",list.length ,list.slice(300))
}
// 使用示例

//ballCalculator.printCombinations();
filterList();