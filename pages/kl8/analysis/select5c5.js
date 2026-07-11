import { historyKl8 } from "../../../common/kl8.js";
/**
 * 快乐8 5分区，每区取1码 5码组合遗漏统计，按遗漏降序输出
 * @param {Array} historyData 历史数据，旧期在前，最新期在数组末尾
 * 单条结构 {period: "期号", nums: [开奖数字数组]}
 * @returns {Object} 分区规则、原始组合数据、遗漏降序列表
 */
function calcKl8FiveZoneOneOmit(historyData) {
    const totalPeriod = historyData.length;
    const latestIndex = totalPeriod - 1;

    // 5区配置
    const zoneList = [
        { zoneId: 1, min: 1, max: 16 },
        { zoneId: 2, min: 17, max: 32 },
        { zoneId: 3, min: 33, max: 48 },
        { zoneId: 4, min: 49, max: 64 },
        { zoneId: 5, min: 65, max: 80 }
    ];

    // Map存储每个5码组合对应的出现期下标数组
    const comboRecord = new Map();

    // 生成组合唯一key（固定分区顺序拼接，保证同组合key一致）
    const getComboKey = (z1, z2, z3, z4, z5) => `${z1},${z2},${z3},${z4},${z5}`;

    // 遍历每一期开奖数据
    for (let periodIdx = 0; periodIdx < totalPeriod; periodIdx++) {
        const openNums = historyData[periodIdx].nums;
        const numSet = new Set(openNums);

        // 拆分本期各区开出号码
        const zoneOpen = [[], [], [], [], []];
        zoneList.forEach((zone, idx) => {
            openNums.forEach(n => {
                if (n >= zone.min && n <= zone.max) {
                    zoneOpen[idx].push(n);
                }
            });
        });
        const [z1List, z2List, z3List, z4List, z5List] = zoneOpen;

        // 任意一区无开出号码，无法形成5区各1码组合，跳过本期
        if (z1List.length === 0 || z2List.length === 0 || z3List.length === 0 || z4List.length === 0 || z5List.length === 0) {
            continue;
        }

        // 全交叉生成：区11码 × 区21码 × 区31码 × 区41码 × 区51码
        for (const n1 of z1List) {
            for (const n2 of z2List) {
                for (const n3 of z3List) {
                    for (const n4 of z4List) {
                        for (const n5 of z5List) {
                            const key = getComboKey(n1, n2, n3, n4, n5);
                            if (!comboRecord.has(key)) {
                                comboRecord.set(key, []);
                            }
                            comboRecord.get(key).push(periodIdx);
                        }
                    }
                }
            }
        }
    }

    // 计算单组统计信息：总次数、当前遗漏、上次出现期下标
    function getStat(indexArr) {
        const count = indexArr.length;
        if (count === 0) {
            return {
                totalCount: 0,
                currentOmit: totalPeriod,
                lastPeriodIndex: null
            };
        }
        const lastIdx = indexArr.at(-1);
        const omit = latestIndex - lastIdx;
        return {
            totalCount: count,
            currentOmit: omit,
            lastPeriodIndex: lastIdx
        };
    }

    // 组装全部组合统计对象
    const allComboStat = {};
    comboRecord.forEach((indexArr, key) => {
        allComboStat[key] = getStat(indexArr);
    });

    // 按当前遗漏降序排序，遗漏相同则组合数字升序
    const sortOmitDesc = Object.entries(allComboStat)
        .map(([comboStr, stat]) => ({
            combo: comboStr,
            ...stat
        }))
        .sort((a, b) => {
            if (b.currentOmit !== a.currentOmit) {
                return b.currentOmit - a.currentOmit;
            }
            // 遗漏一致，按组合数字从小到大排序
            return a.combo.localeCompare(b.combo, undefined, { numeric: true });
        });

    return {
        totalHistoryPeriod: totalPeriod,
        zoneRule: zoneList,
        rawComboData: allComboStat,
        omitSortDescList: sortOmitDesc
    };
}

// ===================== 测试示例 =====================
const testHistory = historyKl8.map(item => ({ period: item.index, nums: item.redBall }));

// 执行统计
const result = calcKl8FiveZoneOneOmit(testHistory);
console.log("===== 五区各1码组合 按遗漏从大到小排序 =====");
console.log(result.omitSortDescList);