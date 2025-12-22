import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { comboToHash } from './happy8-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 初始化存储目录
 * @param {number} selectNum 选号数
 * @returns {string} 目录路径
 */
export function initStorageDir(selectNum) {
    const dir = path.resolve(__dirname, `./storage/select${selectNum}`);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    return dir;
}

/**
 * 写入单个组合到CSV文件（流式追加）
 * @param {number} selectNum 选号数
 * @param {string} comboKey 组合键
 */
export function writeComboToFile(selectNum, comboKey) {
    const dir = initStorageDir(selectNum);
    const filePath = path.join(dir, 'combos.csv');
    const hash = comboToHash(comboKey).toString();
    // 追加写入CSV行：哈希值,1（1表示出现1次）
    fs.appendFileSync(filePath, `${hash},1\n`, 'utf8');
}

/**
 * 统计CSV文件中的组合重复次数（无Map，仅保留计数≥2的组合）
 * @param {number} selectNum 选号数
 * @returns {Object} 统计结果 { [hash: string]: number }
 */
export function countCombosFromFile(selectNum) {
    const dir = initStorageDir(selectNum);
    const filePath = path.join(dir, 'combos.csv');
    if (!fs.existsSync(filePath)) return {};

    const counts = {};
    const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
    let remaining = '';

    // 流式读取，逐行处理
    stream.on('data', (chunk) => {
        const lines = (remaining + chunk).split('\n');
        remaining = lines.pop() || '';
        lines.forEach(line => {
            if (!line.trim()) return;
            const [hash] = line.split(','); // 忽略次数，默认+1
            counts[hash] = (counts[hash] || 0) + 1;
        });
    });

    // 同步等待流结束（避免异步问题）
    return new Promise((resolve) => {
        stream.on('end', () => {
            // 过滤出重复组合（计数≥2）
            const filtered = {};
            Object.keys(counts).forEach(hash => {
                if (counts[hash] >= 2) filtered[hash] = counts[hash];
            });
            resolve(filtered);
        });
    });
}

/**
 * 清理存储文件
 * @param {number} selectNum 选号数
 */
export function clearStorage(selectNum) {
    const dir = path.resolve(__dirname, `./storage/select${selectNum}`);
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
    }
}