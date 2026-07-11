import { historyKl8 } from "../../../common/kl8.js";
/**
 * 快乐8 5分区，每区2码组合遗漏统计+遗漏降序排序
 * 分区：1(1-16)、2(17-32)、3(33-48)、4(49-64)、5(65-80)
 * @param {Array} historyData 历史数据，旧期在前，新期在后
 * item:{period:string, nums:number[]}
 * @returns {Object} 全部组合原始数据 + 按遗漏降序数组
 */
function calcKl8FiveZoneTwoOmit(historyData) {
    const totalPeriod = historyData.length;
    const latestIdx = totalPeriod - 1;

    // 分区配置
    const zoneConfig = [
        { id: 1, min: 1, max: 16 },
        { id: 2, min: 17, max: 32 },
        { id: 3, min: 33, max: 48 },
        { id: 4, min: 49, max: 64 },
        { id: 5, min: 65, max: 80 }
    ];

    // 存储所有完整五区2码组合的出现期下标
    const comboRecord = new Map();

    // 工具：数字升序拼接成key
    const getComboKey = (z1, z2, z3, z4, z5) => {
        const arr = [...z1, ...z2, ...z3, ...z4, ...z5].sort((a, b) => a - b);
        return arr.join(",");
    };

    // 遍历每一期开奖
    for (let periodIdx = 0; periodIdx < totalPeriod; periodIdx++) {
        const nums = [...historyData[periodIdx].nums].sort((a, b) => a - b);
        const numSet = new Set(nums);

        // 1. 拆分本期各区开出号码
        const zoneNums = [[], [], [], [], []];
        zoneConfig.forEach((z, idx) => {
            nums.forEach(n => {
                if (n >= z.min && n <= z.max) zoneNums[idx].push(n);
            });
        });
        const [z1, z2, z3, z4, z5] = zoneNums;

        // 任意一区开出号码不足2个，本期无完整五区2码组合，跳过
        if (z1.length < 2 || z2.length < 2 || z3.length < 2 || z4.length < 2 || z5.length < 2) {
            continue;
        }

        // 2. 生成单区内所有2码不重复组合
        const getTwoCombos = (list) => {
            const res = [];
            for (let i = 0; i < list.length; i++) {
                for (let j = i + 1; j < list.length; j++) {
                    res.push([list[i], list[j]]);
                }
            }
            return res;
        };
        const z1Two = getTwoCombos(z1);
        const z2Two = getTwoCombos(z2);
        const z3Two = getTwoCombos(z3);
        const z4Two = getTwoCombos(z4);
        const z5Two = getTwoCombos(z5);

        // 3. 全排列组合：区1两码 × 区2两码 × 区3 × 区4 × 区5
        for (const a of z1Two) {
            for (const b of z2Two) {
                for (const c of z3Two) {
                    for (const d of z4Two) {
                        for (const e of z5Two) {
                            const key = getComboKey(a, b, c, d, e);
                            if (!comboRecord.has(key)) comboRecord.set(key, []);
                            comboRecord.get(key).push(periodIdx);
                        }
                    }
                }
            }
        }
    }

    // 计算单组统计：总次数、当前遗漏、上次出现期下标
    const calcStat = (idxList) => {
        const count = idxList.length;
        if (count === 0) {
            return { totalCount: 0, currentOmit: totalPeriod, lastIdx: null };
        }
        const last = idxList.at(-1);
        const omit = latestIdx - last;
        return { totalCount: count, currentOmit: omit, lastIdx: last };
    };

    // 组装所有组合统计对象
    const allComboStat = {};
    comboRecord.forEach((idxList, key) => {
        allComboStat[key] = calcStat(idxList);
    });

    // 按当前遗漏降序排序；遗漏相同按组合数字升序
    const sortByOmitDesc = Object.entries(allComboStat)
        .map(([comboStr, stat]) => ({ combo: comboStr, ...stat }))
        .sort((x, y) => {
            if (y.currentOmit !== x.currentOmit) return y.currentOmit - x.currentOmit;
            return x.combo.localeCompare(y.combo, undefined, { numeric: true });
        });

    return {
        totalHistory: totalPeriod,
        zoneRule: zoneConfig,
        rawComboData: allComboStat,
        sortOmitDesc: sortByOmitDesc
    };
}

// ===================== 测试数据 =====================
const testHistory = historyKl8.map(item => ({ period: item.index, nums: item.redBall }));

// 执行计算
const result = calcKl8FiveZoneTwoOmit(testHistory);
console.log("===== 五区各2码组合（按遗漏降序）=====");
console.log(result.sortOmitDesc);