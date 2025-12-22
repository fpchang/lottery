import { Worker } from 'worker_threads';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateMockHistory } from './happy8-utils.js';

// ES模块中手动获取__dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 主线程逻辑：
 * 1. 生成模拟历史数据
 * 2. 创建子线程处理统计
 * 3. 接收进度、内存、结果反馈
 */
async function main() {
    // 模拟历史数据量（可根据机器性能调整，建议从1000期开始测试）
    const TOTAL_DRAWS = 5000;
    console.log(`开始生成${TOTAL_DRAWS}期快乐8模拟开奖数据...`);
    const historyData = generateMockHistory(TOTAL_DRAWS);
    console.log(`模拟数据生成完成，共${historyData.length}期`);

    // 创建子线程
    const worker = new Worker(path.resolve(__dirname, 'happy8-worker.js'));

    // 监听子线程消息
    worker.on('message', (msg) => {
        switch (msg.type) {
            case 'progress':
                console.log(`进度：${msg.progress}% | 内存使用：${msg.memory}`);
                break;
            case 'result':
                console.log('\n================ 统计完成 ================');
                console.log(`总开奖期数：${msg.data.totalDraws}`);
                console.log('各选号数重复组合数：', msg.data.totalCombos);
                console.log('\n选10组合TOP5：', JSON.stringify(msg.data.results.select10.slice(0, 5), null, 2));
                worker.terminate();
                break;
            case 'error':
                console.error('\n================ 统计失败 ================');
                console.error('错误信息：', msg.message);
                console.error('错误堆栈：', msg.stack);
                worker.terminate();
                break;
        }
    });

    // 监听子线程错误
    worker.on('error', (error) => {
        console.error('子线程运行错误：', error);
    });

    // 监听子线程退出
    worker.on('exit', (code) => {
        if (code === 0) {
            console.log('\n子线程正常退出');
        } else {
            console.error(`子线程异常退出，退出码：${code}`);
        }
    });

    // 发送数据给子线程
    console.log('\n启动子线程，开始统计组合...');
    worker.postMessage({
        historyData,
        selectNums: [2, 3, 4, 5, 6, 7, 8, 9, 10], // 要统计的选号数
        isDesc: true // 降序排序
    });
}

// 执行主线程逻辑
main().catch(err => {
    console.error('主线程错误：', err);
    process.exit(1);
});