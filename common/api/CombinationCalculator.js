/**
 * 组合数计算工具（C(n,k) = n!/(k!(n-k)!)）
 * 核心优化：
 * 1. 利用C(n,k) = C(n, n-k)减少计算量
 * 2. 累乘替代阶乘，避免大数溢出
 * 3. 整数校验和边界处理
 */
export default class CombinationCalculator {
    /**
     * 基础版：通过阶乘计算组合数（易理解，适合小数值）
     * @param {number} n 总数（如12）
     * @param {number} k 选取个数（如2）
     * @returns {number} 组合数结果
     */
    static calculateByFactorial(n, k) {
        // 参数校验
        this._validateParams(n, k);
        
        // 边界情况：选0个或选全部，组合数为1
        if (k === 0 || k === n) return 1;
        
        // 计算阶乘
        const factorial = (num) => {
            let result = 1;
            for (let i = 2; i <= num; i++) {
                result *= i;
            }
            return result;
        };
        
        // 组合数公式：C(n,k) = n!/(k! * (n-k)!)
        return factorial(n) / (factorial(k) * factorial(n - k));
    }

    /**
     * 优化版：累乘计算组合数（高性能，适合大数值，避免阶乘溢出）
     * @param {number} n 总数（如12）
     * @param {number} k 选取个数（如2）
     * @returns {number} 组合数结果
     */
    static calculate(n, k) {
        // 参数校验
        this._validateParams(n, k);
        
        // 边界情况：选0个或选全部，组合数为1
        if (k === 0 || k === n) return 1;
        
        // 优化：C(n,k) = C(n, n-k)，取较小值减少计算量
        k = Math.min(k, n - k);
        
        let result = 1;
        // 累乘公式：C(n,k) = (n*(n-1)*...*(n-k+1)) / (k*(k-1)*...*1)
        for (let i = 1; i <= k; i++) {
            // 先乘后除，保证每一步都是整数，避免浮点数误差
            result = result * (n - k + i) / i;
        }
        
        // 确保结果为整数（避免浮点精度问题）
        return Math.round(result);
    }

    /**
     * 参数校验私有方法
     * @param {number} n 总数
     * @param {number} k 选取个数
     */
    static _validateParams(n, k) {
        if (typeof n !== 'number' || typeof k !== 'number') {
            throw new Error('n和k必须为数字类型');
        }
        if (!Number.isInteger(n) || !Number.isInteger(k)) {
            throw new Error('n和k必须为整数');
        }
        if (n < 0 || k < 0) {
            throw new Error('n和k不能为负数');
        }
        if (k > n) {
            throw new Error('选取个数k不能大于总数n');
        }
    }
}
//export var CombinationCalculator = CombinationCalculator;
// ------------------- 测试使用示例 -------------------
// try {
//     // 示例1：计算C(12,2)（核心需求）
//     const c12_2 = .calculate(12, 2);
//     console.log('C(12,2) =', c12_2); // 输出：66

//     // 示例2：计算快乐8选6的组合数（C(80,6)）
//     const c80_6 = CombinationCalculator.calculate(80, 6);
//     console.log('C(80,6) =', c80_6); // 输出：300500200（约3亿）

//     // 示例3：计算C(10,5)，验证两种方法结果一致
//     const c10_5_fact = CombinationCalculator.calculateByFactorial(10, 5);
//     const c10_5_opt = CombinationCalculator.calculate(10, 5);
//     console.log('C(10,5) 阶乘版：', c10_5_fact); // 252
//     console.log('C(10,5) 优化版：', c10_5_opt); // 252

//     // 示例4：边界测试（C(5,0)=1，C(5,5)=1）
//     console.log('C(5,0) =', CombinationCalculator.calculate(5, 0)); // 1
//     console.log('C(5,5) =', CombinationCalculator.calculate(5, 5)); // 1

// } catch (error) {
//     console.error('计算错误：', error.message);
// }