import { parentPort, workerData } from 'worker_threads';
import { generateComboStream, getMemoryUsage, hashToCombo } from './happy8-utils.js';
import { writeComboToFile, countCombosFromFile, clearStorage } from './happy8-storage.js';

// 无Map统计，彻底避免Map容量超限
(async () => {
    try {
        const { historyData, singleSelectNum, isDesc } = workerData;
        console.log(`子线程启动：统计选${singleSelectNum}组合，共${historyData.length}期`);

        if (!Number.isInteger(singleSelectNum) || singleSelectNum < 2 || singleSelectNum > 20) {
            throw new Error(`选号数${singleSelectNum}不合法`);
        }

        const totalDraws = historyData.length;
        const batchSize = 5;

        // 逐批处理历史数据，逐个写入组合
        for (let batchIdx = 0; batchIdx < totalDraws; batchIdx += batchSize) {
            const batch = historyData.slice(batchIdx, batchIdx + batchSize);
            batch.forEach(draw => {
                const sortedDraw = draw.sort((a, b) => a - b);
                // 逐个生成组合并写入文件，不缓存
                generateComboStream(sortedDraw, singleSelectNum, (comboKey) => {
                    writeComboToFile(singleSelectNum, comboKey);
                });
            });

            // 发送进度
            const progress = Math.min(((batchIdx + batchSize) / totalDraws * 100).toFixed(2), 100);
            parentPort.postMessage({
                type: 'progress',
                selectNum: singleSelectNum,
                progress,
                memory: getMemoryUsage()
            });
        }

        // 统计文件中的组合重复次数
        console.log(`选${singleSelectNum}：开始统计重复组合...`);
        const countResult = await countCombosFromFile(singleSelectNum);
        const totalCombos = Object.keys(countResult).length;

        // 转换为最终结果（哈希转组合键）
        const data = Object.entries(countResult)
            .map(([hash, count]) => ({
                combo: hashToCombo(BigInt(hash), singleSelectNum),
                count,
                numbers: hashToCombo(BigInt(hash), singleSelectNum).split(',').map(Number)
            }))
            .sort((a, b) => isDesc ? b.count - a.count : a.count - b.count);

        // 清理存储文件
        clearStorage(singleSelectNum);

        // 发送结果
        parentPort.postMessage({
            type: 'result',
            data: {
                selectNum: singleSelectNum,
                totalCombos,
                data
            }
        });
        console.log(`选${singleSelectNum}统计完成，重复组合数：${totalCombos}`);

    } catch (error) {
        console.error(`子线程异常（选${workerData.singleSelectNum}）：`, error);
        parentPort.postMessage({
            type: 'error',
            selectNum: workerData.singleSelectNum,
            message: error.message,
            stack: error.stack
        });
    }
})();