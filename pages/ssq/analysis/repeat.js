import {ssqHistory} from "../../../common/ssq.js";
// 双色球历史数据（从旧到新）
const historyData = ssqHistory.map(item => item.redBall);
console.log("33333", historyData);
// 合并多期号码
// 合并多期红球
function combine(periods) {
  const s = new Set();
  periods.forEach(p => p.forEach(n => s.add(n)));
  return s;
}

// 计算重复个数
function repeat(curr, set) {
  return curr.filter(n => set.has(n)).length;
}

// ==================== 主计算：每期 对比 前1～5期组合 ====================
function calc() {
  const list = [];
  for (let i = 1; i < historyData.length; i++) { // 从第2期就开始统计！
    const curr = historyData[i];
    list.push({
      r1: repeat(curr, combine(historyData.slice(i-1, i))),
      r2: i >=2 ? repeat(curr, combine(historyData.slice(i-2, i))) : null,
      r3: i >=3 ? repeat(curr, combine(historyData.slice(i-3, i))) : null,
      r4: i >=4 ? repeat(curr, combine(historyData.slice(i-4, i))) : null,
      r5: i >=5 ? repeat(curr, combine(historyData.slice(i-5, i))) : null,
    });
  }
  return list;
}

// ==================== 汇总统计（绝对正确：出现0就+1） ====================
function summary(list) {
  const res = {
    r1: {0:0,1:0,2:0,3:0,4:0,5:0,6:0},
    r2: {0:0,1:0,2:0,3:0,4:0,5:0,6:0},
    r3: {0:0,1:0,2:0,3:0,4:0,5:0,6:0},
    r4: {0:0,1:0,2:0,3:0,4:0,5:0,6:0},
    r5: {0:0,1:0,2:0,3:0,4:0,5:0,6:0},
  };

  for (const item of list) {
    if (item.r1 !== null) res.r1[item.r1]++;
    if (item.r2 !== null) res.r2[item.r2]++;
    if (item.r3 !== null) res.r3[item.r3]++;
    if (item.r4 !== null) res.r4[item.r4]++;
    if (item.r5 !== null) res.r5[item.r5]++;
  }
  return res;
}

// ==================== 执行 ====================
const resultList = calc();
const final = summary(resultList);

// ==================== 输出 ====================
console.log("==== 每期重复明细（每一期都算）====");
console.table(resultList);

console.log("\n==== 最终统计（重复0一定会正确+1）====");
console.log("与前1期重复：", final.r1);
console.log("与前2期组合：", final.r2);
console.log("与前3期组合：", final.r3);
console.log("与前4期组合：", final.r4);
console.log("与前5期组合：", final.r5);