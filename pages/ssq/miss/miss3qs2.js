import {ssqHistory} from "../../../common/ssq.js"
const ZONES = [
    { name: "A区", min: 1, max: 11 },
    { name: "B区", min: 12, max: 22 },
    { name: "C区", min: 23, max: 33 }
];

// 计算每个红球遗漏
function calcNumberMissStats(history) {
    const list = [...history].sort((a, b) => Number(a.issue) - Number(b.issue));
    const result = [];
    for (let n = 1; n <= 33; n++) {
        const zone = ZONES.find(z => n >= z.min && n <= z.max);
        const hitIndexList = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i].red.includes(n)) hitIndexList.push(i);
        }
        const gaps = [];
        for (let i = 1; i < hitIndexList.length; i++) {
            gaps.push(hitIndexList[i] - hitIndexList[i - 1] - 1);
        }
        const currentGap = hitIndexList.length > 0
            ? list.length - 1 - hitIndexList.at(-1)
            : list.length;
        const maxGap = gaps.length ? Math.max(...gaps) : 0;
        result.push({ num: n, zoneName: zone.name, currentGap, maxGap });
    }
    return result;
}

// 分区按当前遗漏降序
function sortByCurrentMiss(stats, zoneFilter) {
    return [...stats].filter(i => i.zoneName === zoneFilter).sort((a, b) => b.currentGap - a.currentGap);
}

// 获取数组全部两两组合
function getTwoCombinations(arr) {
    const res = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            res.push([arr[i], arr[j]]);
        }
    }
    return res;
}

/**
 * 生成最多50组，A2+B2+C2，红球从小到大排序，附带每个号码遗漏
 * @param {Array} stats
 * @param {number} limit
 * @returns {Array}
 */
function generateComboList(stats, limit = 50) {
    const aSorted = sortByCurrentMiss(stats, "A区");
    const bSorted = sortByCurrentMiss(stats, "B区");
    const cSorted = sortByCurrentMiss(stats, "C区");

    const aPool = aSorted.slice(0, 10);
    const bPool = bSorted.slice(0, 10);
    const cPool = cSorted.slice(0, 10);

    const aPairs = getTwoCombinations(aPool);
    const bPairs = getTwoCombinations(bPool);
    const cPairs = getTwoCombinations(cPool);

    const output = [];
    outer: for (const ap of aPairs) {
        for (const bp of bPairs) {
            for (const cp of cPairs) {
                const sixItems = [...ap, ...bp, ...cp];
                // 号码数字从小到大排序（彩票标准排序）
                sixItems.sort((x, y) => x.num - y.num);
                output.push({
                    red: sixItems.map(d => d.num),
                    missInfo: sixItems.map(d => ({ num: d.num, miss: d.currentGap }))
                });
                if (output.length >= limit) break outer;
            }
        }
    }
    return output;
}

// ============ 使用方式 ============

// 把你的完整历史开奖数据填到这里
const historyData = ssqHistory.map(item => ({
    issue: item.index,
    red: item.redBall
}));

const stats = calcNumberMissStats(historyData);
const list = generateComboList(stats,50);

// 控制台打印
list.forEach((item, idx)=>{
    console.log(`${idx+1}. ${item.red.join(",")}`, item.missInfo);
});


