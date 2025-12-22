/**
 * 生成单期单个选号数的组合（逐个生成，不缓存）
 * @param {Array<number>} sortedDraw 已排序开奖号
 * @param {number} k 选号数
 * @param {Function} callback 单个组合的回调函数 (comboKey: string) => void
 */
export function generateComboStream(sortedDraw, k, callback) {
    const n = sortedDraw.length;
    if (k < 2 || k > n || n === 0) return;

    const pointers = Array.from({ length: k }, (_, i) => i);
    if (pointers.length === 0) return;

    while (true) {
        let comboKey = '';
        for (const p of pointers) {
            if (p >= sortedDraw.length) break;
            comboKey += `${sortedDraw[p]},`;
        }
        comboKey = comboKey.slice(0, -1);
        if (comboKey) callback(comboKey); // 逐个处理组合

        let i = k - 1;
        while (i >= 0 && pointers[i] === n - k + i) i--;
        if (i < 0) break;

        pointers[i]++;
        for (let j = i + 1; j < k; j++) {
            pointers[j] = pointers[j - 1] + 1;
        }
    }
}

/**
 * 组合键转唯一哈希值（避免长字符串存储）
 * @param {string} comboKey 组合键（如"1,2,3"）
 * @returns {bigint} 哈希值
 */
export function comboToHash(comboKey) {
    let hash = 0n;
    const primes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n, 53n, 59n, 61n, 67n, 71n];
    const nums = comboKey.split(',').map(Number);
    nums.forEach((num, idx) => {
        hash = hash * primes[idx % primes.length] + BigInt(num);
    });
    return hash;
}

/**
 * 哈希值转回组合键（用于最终结果）
 * @param {bigint} hash 哈希值
 * @param {number} k 选号数
 * @returns {string} 组合键
 */
export function hashToCombo(hash, k) {
    const primes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n, 53n, 59n, 61n, 67n, 71n];
    const nums = [];
    let currentHash = hash;
    for (let i = k - 1; i >= 0; i--) {
        const prime = primes[i % primes.length];
        nums.push(Number(currentHash % prime));
        currentHash = currentHash / prime;
    }
    return nums.reverse().filter(n => n > 0).join(',');
}

/**
 * 生成模拟历史数据（前10期含重复组合）
 * @param {number} total 期数
 * @returns {Array<Array<number>>}
 */
export function generateMockHistory(total) {
    const history = [];
    const baseNums = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
    for (let i = 0; i < total; i++) {
        let nums = i < 10 ? [...baseNums] : new Set();
        if (!(nums instanceof Set)) {
            history.push(nums.sort((a, b) => a - b));
            continue;
        }
        while (nums.size < 20) {
            nums.add(Math.floor(Math.random() * 80) + 1);
        }
        history.push(Array.from(nums).sort((a, b) => a - b));
    }
    return history;
}

/**
 * 内存监控
 * @returns {string}
 */
export function getMemoryUsage() {
    const mem = process.memoryUsage();
    const format = b => (b / 1024 / 1024).toFixed(2) + 'MB';
    return `堆内存：${format(mem.heapUsed)} / ${format(mem.heapTotal)}`;
}