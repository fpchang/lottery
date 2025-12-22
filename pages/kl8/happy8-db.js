import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 初始化桶文件目录
 * @param {number} selectNum - 选号数
 */
export async function initBucketDir(selectNum) {
    const dir = path.resolve(__dirname, `./buckets/select${selectNum}`);
    await fs.mkdir(dir, { recursive: true });
    return dir;
}

/**
 * 读取桶文件中的统计数据
 * @param {number} selectNum - 选号数
 * @param {number} bucketIdx - 桶索引
 * @returns {Map<string, number>} 统计结果
 */
export async function readBucketFile(selectNum, bucketIdx) {
    const dir = await initBucketDir(selectNum);
    const filePath = path.join(dir, `bucket${bucketIdx}.json`);
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return new Map(JSON.parse(data));
    } catch (e) {
        return new Map(); // 文件不存在则返回空Map
    }
}

/**
 * 将桶的统计数据写入文件
 * @param {number} selectNum - 选号数
 * @param {number} bucketIdx - 桶索引
 * @param {Map<string, number>} data - 统计数据
 */
export async function writeBucketFile(selectNum, bucketIdx, data) {
    const dir = await initBucketDir(selectNum);
    const filePath = path.join(dir, `bucket${bucketIdx}.json`);
    // 将Map转换为数组后序列化（JSON不支持Map）
    const jsonData = JSON.stringify(Array.from(data));
    await fs.writeFile(filePath, jsonData, 'utf8');
}

/**
 * 合并所有桶文件的统计结果，并过滤重复组合（次数≥2）
 * @param {number} selectNum - 选号数
 * @param {number} bucketCount - 分桶总数
 * @returns {Map<string, number>} 合并后的结果
 */
export async function mergeBucketFiles(selectNum, bucketCount) {
    const mergedMap = new Map();
    for (let i = 0; i < bucketCount; i++) {
        const bucketMap = await readBucketFile(selectNum, i);
        bucketMap.forEach((count, key) => {
            mergedMap.set(key, (mergedMap.get(key) || 0) + count);
        });
        // 读取一个桶后清理内存
        bucketMap.clear();
    }
    // 过滤出重复组合
    const filteredMap = new Map();
    mergedMap.forEach((count, key) => {
        if (count >= 2) {
            filteredMap.set(key, count);
        }
    });
    return filteredMap;
}

/**
 * 删除选号数的桶文件（统计完成后清理）
 * @param {number} selectNum - 选号数
 */
export async function clearBucketFiles(selectNum) {
    const dir = path.resolve(__dirname, `./buckets/select${selectNum}`);
    try {
        await fs.rm(dir, { recursive: true, force: true });
    } catch (e) {
        console.log(`清理选${selectNum}桶文件失败：`, e.message);
    }
}