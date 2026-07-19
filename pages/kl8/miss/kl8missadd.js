import { historyKl8 } from "../../../common/kl8.js";
/**
 * 计算 n+1码组合遗漏
 * @param {number[]} fixedNums 固定n个号码，1<=n<=9
 * @param {number[][]} historyDraws 历史开奖二维数组，每期20个号码
 * @returns {Object[]} 按遗漏降序排序结果
 */
function calcNPlus1Miss(fixedNums, historyDraws) {
    const allNumSet = new Set(fixedNums);
    // 过滤合法x：1-80，不在固定号码内
    const xList = [];
    for (let x = 1; x <= 80; x++) {
        if (!allNumSet.has(x)) {
            xList.push(x);
        }
    }

    const totalPeriod = historyDraws.length;
    const result = [];

    // 遍历每一个候选x
    for (const x of xList) {
        const combo = [...fixedNums, x];
        const comboSet = new Set(combo);
        let hitTimes = 0;
        let lastHitIndex = -1; // 上一次命中的期下标，-1代表从未开出

        // 逐期校验
        for (let periodIdx = 0; periodIdx < historyDraws.length; periodIdx++) {
            const drawSet = new Set(historyDraws[periodIdx]);
            let fullMatch = true;
            for (const num of comboSet) {
                if (!drawSet.has(num)) {
                    fullMatch = false;
                    break;
                }
            }
            if (fullMatch) {
                hitTimes++;
                lastHitIndex = periodIdx;
            }
        }

        // 计算遗漏值
        let missVal;
        if (lastHitIndex === -1) {
            // 从未开出，遗漏=全部历史期数
            missVal = totalPeriod;
        } else {
            // 当前期下标是最后一期totalPeriod-1
            missVal = (totalPeriod - 1) - lastHitIndex;
        }

        result.push({
            fixedPart: fixedNums.join(','),
            addX: x,
            fullCombo: combo.sort((a,b)=>a-b).map(v=>v.toString().padStart(2,'0')).join(','),
            hitTotal: hitTimes,
            miss: missVal
        });
    }

    // 遗漏从大到小排序，遗漏相同则追加号码升序
    result.sort((a, b) => {
        if (b.miss !== a.miss) return b.miss - a.miss;
        return a.addX - b.addX;
    });

    return result;
}

// ====================== 使用者配置区 ======================
// 1. 传入固定n个号码，示例n=2：[10,14]
const inputFixed = [1,7,19,38,39,70];//1,3,5,7,11,

// 2. 粘贴你本地历史开奖数据，二维数组，每期20个数字
const historyData = historyKl8.map(item => item.redBall); // 假设historyKl8每项有redBall数组，包含20个开奖号码
// =========================================================

// 执行计算
const resList = calcNPlus1Miss(inputFixed, historyData);

// 控制台输出表格
console.table(resList);

// // 导出可复制CSV
// let csvText = "固定号码,追加x,完整组合,命中总次数,当前遗漏值\n";
// resList.forEach(item => {
//     csvText += `${item.fixedPart},${item.addX},${item.fullCombo},${item.hitTotal},${item.miss}\n`;
// });
// console.log("===完整CSV，复制到Excel===");
// console.log(csvText);

//选五 【1-16，17-32，33-48，49-64，65-80】
//选10 【1-8，9-16，17-24，25-32，33-40，41-48，49-56，57-64，65-72，73-80】

//80=>[28,80]=>[4,28,80]=>[4,28,34,80]=>[4,11,28,66,80] =>10. [5,13,20,28,38,42,56,64,65,80]
//46=>[6,46]=>[6,46,62]=>[6,31,46,62,74] =>10=[6,11,20,31,35,46,52,62,69,77]
//34=>[34,46]=>[16,34,46]=>[16,17,34,46,70]=>10[3,16,17,31,34,46,49,61,70,78]

//【4,28,49,61,80】-[4,5,21,23,28,49,56,61,75,80]
//[6,7,22,46,49,51,62,69,73,78] + [6,46,49,62,69]
//16,30 -4,16,28,40,42,66,67,72,78,80