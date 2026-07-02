import { historyKl8 } from "../../../common/kl8.js";
import {getMiss3} from "../miss/kl8miss3.js"
/**
 * 求两数组交集个数
 */
function getIntersectCount(arrA, arrB) {
    const s = new Set(arrA);
    let cnt = 0;
    for (let n of arrB) if (s.has(n)) cnt++;
    return cnt;
}

/**
 * 随机生成1~80不重复N个号码并升序
 */
function randUniqueNums(n) {
    const pool = Array.from({ length: 80 }, (_, i) => i + 1);
    const res = [];
    while (res.length < n) {
        const idx = Math.floor(Math.random() * pool.length);
        res.push(pool.splice(idx, 1)[0]);
    }
    return res.sort((a, b) => a - b);
}

/**
 * 递归生成全部无重复组合 C(arr, k)
 */
function genCombination(arr, k) {
    const result = [];
    const dfs = (start, cur) => {
        if (cur.length === k) {
            result.push([...cur]);
            return;
        }
        for (let i = start; i < arr.length; i++) {
            cur.push(arr[i]);
            dfs(i + 1, cur);
            cur.pop();
        }
    };
    dfs(0, []);
    return result;
}

/**
 * 校验开奖是否命中任意一组禁止3码
 * @param {Set} drawSet 当前开奖号码集合
 * @param {number[][]} banList 多组禁止3码
 * @returns {boolean} true=存在被禁止的完整3码，false=合法
 */
function hasAnyBanTriple(drawSet, banList) {
    for (const triple of banList) {
        const [a, b, c] = triple;
        if (drawSet.has(a) && drawSet.has(b) && drawSet.has(c)) {
            return true;
        }
    }
    return false;
}

/**
 * 生成满足所有约束的快乐8单期20码开奖
 * @param {number[][]} history4Draws 4期历史 [最近1期,前2,前3,前4]
 * @param {number[][]} banTripleList 多组禁止选3组合
 * @returns {number[]} 合法20个开奖号
 */
function generateValidDraw(history4Draws, banTripleList) {
    const [d1, d2, d3, d4] = history4Draws;

    while (true) {
        const curr = randUniqueNums(20);
        const currSet = new Set(curr);

        // 校验和前4期重复号码区间
        const c1 = getIntersectCount(curr, d1);
        const c2 = getIntersectCount(curr, d2);
        const c3 = getIntersectCount(curr, d3);
        const c4 = getIntersectCount(curr, d4);
        const rangeOk = c1 >= 2 && c1 <= 8
            && c2 >= 6 && c2 <= 11
            && c3 >= 9 && c3 <= 14
            && c4 >= 11 && c4 <= 16;
        if (!rangeOk) continue;

        // 校验不能包含任意一组禁止3码
        if (hasAnyBanTriple(currSet, banTripleList)) continue;

        // 全部条件通过
        return curr.sort((a, b) => a - b);
    }
}

// ====================== 配置区（自行修改）======================
// 历史4期开奖，顺序：最近1期、前2期、前3期、前4期
const history4 = historyKl8.map(item=>item.redBall)

// 多组禁止选3组合（二维数组，可无限追加）
const banTripleList = getMiss3(historyKl8).slice(0,100)
// ==============================================================
console.log('禁止选3',banTripleList)
// 1、生成符合全部约束的20个开奖号码
const newDraw = generateValidDraw(history4, banTripleList);
const drawSet = new Set(newDraw);

console.log("【生成合法20码开奖】");
console.log(newDraw.map(v => String(v).padStart(2, "0")).join(","));

// 2、打印重复号码校验信息
const [d1, d2, d3, d4] = history4;
console.log("与前1期重复球数：", getIntersectCount(newDraw, d1));
console.log("与前2期重复球数：", getIntersectCount(newDraw, d2));
console.log("与前3期重复球数：", getIntersectCount(newDraw, d3));
console.log("与前4期重复球数：", getIntersectCount(newDraw, d4));

// 3、校验是否规避所有禁止3码
const hitBan = hasAnyBanTriple(drawSet, banTripleList);
console.log("校验：是否包含任意禁止3组？", hitBan ? "是（非法）" : "否（合法）");

// 4、生成本期全部选6、选9组合
const allSelect6 = genCombination(newDraw, 6);
const allSelect9 = genCombination(newDraw, 9);

console.log("\n【本期全部选6组合，总数：" + allSelect6.length + "】");
console.log(allSelect6);
console.log("\n【本期全部选9组合，总数：" + allSelect9.length + "】");
console.log(allSelect9);
