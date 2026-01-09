import { Worker } from 'worker_threads';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateMockHistory } from './happy8-utils.js';
import {
	kl8_data
} from "./kl8_data.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 单次统计一个选号数
 * @param {Array} historyData 历史数据
 * @param {number} selectNum 选号数
 * @returns {Promise<Object>}
 */
async function statSingleSelectNum(historyData, selectNum) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.resolve(__dirname, 'happy8-worker.js'), {
            workerData: {
                historyData,
                singleSelectNum: selectNum,
                isDesc: true
            }
        });

        worker.on('message', (msg) => {
            switch (msg.type) {
                case 'progress':
                    console.log(`选${msg.selectNum}：进度${msg.progress}% | ${msg.memory}`);
                    break;
                case 'result':
                    worker.terminate();
                    resolve(msg.data);
                    break;
                case 'error':
                    worker.terminate();
                    reject(new Error(`选${msg.selectNum}失败：${msg.message}`));
                    break;
            }
        });

        worker.on('error', (err) => reject(err));
        worker.on('exit', (code) => {
            if (code !== 0 && !worker.exitedAfterDisconnect) {
                reject(new Error(`选${selectNum}子线程异常退出，码：${code}`));
            }
        });
    });
}

/**
 * 打印前10位组合
 * @param {number} selectNum 选号数
 * @param {Array} data 组合数据
 */
function printTop10(selectNum, data) {
    if (!data || data.length === 0) {
        console.log(`选${selectNum}：无重复组合`);
        return;
    }
    const top10 = data.slice(0, 10);
    console.log(`\n===== 选${selectNum}前10重复组合 =====`);
    top10.forEach((item, idx) => {
        console.log(`${idx + 1}. 组合：${item.combo} | 次数：${item.count}`);
    });
    console.log('=================================\n');
}

/**
 * 主逻辑
 */
async function main() {
    // 配置参数
    const TOTAL_DRAWS = 20;
    const SELECT_NUMS = [5]; // 重点测试大组合数
    //const historyData = generateMockHistory(TOTAL_DRAWS);
	const historyData = kl8_data.map(item=>item.redBall).slice(0,100);
    console.log(`===== 快乐8统计开始 =====`);
    console.log(`模拟期数：${TOTAL_DRAWS}，选号数：${SELECT_NUMS.join(',')}\n`);

    const finalResults = { totalDraws: TOTAL_DRAWS, stats: {} };

    // 循环统计每个选号数
    for (const num of SELECT_NUMS) {
        try {
            console.log(`\n开始统计选${num}组合...`);
            const result = await statSingleSelectNum(historyData, num);
            finalResults.stats[`select${num}`] = result;
            printTop10(num, result.data);

            // 强制GC
            if (typeof gc === 'function') {
                gc();
                console.log('已执行垃圾回收\n');
            }
        } catch (error) {
            console.error(`选${num}统计失败：`, error.message);
            finalResults.stats[`select${num}`] = { error: error.message };
        }
    }

    // 最终汇总
    console.log(`===== 统计完成汇总 =====`);
    console.log(`总期数：${finalResults.totalDraws}`);
    SELECT_NUMS.forEach(num => {
        const stat = finalResults.stats[`select${num}`];
        console.log(`选${num}：${stat.error || `${stat.totalCombos}个重复组合`}`);
    });
}

// 执行
main().catch(err => {
    console.error('主线程异常：', err);
    process.exit(1);
});