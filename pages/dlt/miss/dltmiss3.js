import {dltHistory} from "../../../common/dlt.js";
/**
 * 生成大乐透前区全部C(35,3)升序3码组合
 */
function getAllTriplets() {
  const list = [];
  for (let a = 1; a <= 33; a++) {
    for (let b = a + 1; b <= 34; b++) {
      for (let c = b + 1; c <= 35; c++) {
        list.push([a, b, c]);
      }
    }
  }
  return list;
}

/**
 * 全量计算所有3码组合遗漏，返回完整统计表
 * @param {number[][]} historyData 历史前区开奖数据
 * @returns {Array} 全量排序后的统计数组
 */
function calcAllDLTTripletMiss(historyData) {
  const bitmapArr = historyData.map(nums => {
    const bm = new Uint8Array(36);
    for (const n of nums) bm[n] = 1;
    return bm;
  });
  const totalPeriod = bitmapArr.length;
  const allTriplets = getAllTriplets();
  const result = [];

  for (const combo of allTriplets) {
    const [n1, n2, n3] = combo;
    const hitIdx = [];
    for (let i = 0; i < totalPeriod; i++) {
      const bm = bitmapArr[i];
      if (bm[n1] && bm[n2] && bm[n3]) hitIdx.push(i);
    }
    const hitCnt = hitIdx.length;

    let currMiss, maxMiss, avgMiss;
    if (hitCnt === 0) {
      currMiss = totalPeriod;
      maxMiss = totalPeriod;
      avgMiss = totalPeriod;
    } else {
      const lastHit = hitIdx.at(-1);
      currMiss = totalPeriod - 1 - lastHit;
      const gaps = [hitIdx[0] + 1];
      for (let i = 1; i < hitIdx.length; i++) {
        gaps.push(hitIdx[i] - hitIdx[i - 1]);
      }
      maxMiss = Math.max(...gaps);
      avgMiss = gaps.reduce((s, v) => s + v, 0) / gaps.length;
    }

    result.push({
      combo: combo,
      count: hitCnt,
      currMiss: currMiss,
      maxMiss: maxMiss,
      avgMiss: Number(avgMiss.toFixed(2))
    });
  }
  // 当前遗漏降序
  result.sort((a, b) => b.currMiss - a.currMiss);
  return result;
}

/**
 * 统一查询工具函数
 * @param {Array} fullTable 全量统计结果
 * @param {Object} queryOpt 查询配置
    type: 
      exact:精确三码 | 
      hasAny:包含任意一个指定号码 | 
      hasBoth:必须同时包含两个指定号码（本次需求）|
      missRange:遗漏区间
    val: 对应查询值
 * @returns 筛选后的列表
 */
function queryMissData(fullTable, queryOpt) {
  const { type, val } = queryOpt;
  let filterList = [];
  switch (type) {
    // 精确匹配完整三码
    case "exact": {
      const target = [...val].sort((a, b) => a - b);
      filterList = fullTable.filter(item => {
        const c = item.combo;
        return c[0] === target[0] && c[1] === target[1] && c[2] === target[2];
      });
      break;
    }
    // 包含任意一个号码
    case "hasAny": {
      const numSet = new Set(val);
      filterList = fullTable.filter(item => item.combo.some(n => numSet.has(n)));
      break;
    }
    // 【核心需求】3码组合必须同时包含两个指定号码，例 [10,20]
    case "hasBoth": {
      const [numA, numB] = val;
      filterList = fullTable.filter(item => {
        const c = item.combo;
        return c.includes(numA) && c.includes(numB);
      });
      break;
    }
    // 当前遗漏区间筛选
    case "missRange": {
      const [minMiss, maxMiss] = val;
      filterList = fullTable.filter(item => item.currMiss >= minMiss && item.currMiss <= maxMiss);
      break;
    }
    default:
      filterList = fullTable;
  }
  return filterList;
}

// ===================== 测试示例 =====================
const historyData = dltHistory.map(item => item.redBall);

// 一次性全量计算，后续多次查询无需重算
const fullResult = calcAllDLTTripletMiss(historyData);

// 需求：筛选三码组合【一定同时包含10和20】
const qTarget = queryMissData(fullResult, {
  type: "hasBoth",
  val: [3,34]
});

console.log(`同时包含10、20的3码组合总数：${qTarget.length}`);
console.log("组合列表（已按当前遗漏降序）：");
qTarget.forEach((row, idx) => {
  console.log(
    `${idx+1} | 号码：${row.combo.join(",")} | 当前遗漏：${row.currMiss} | 历史开出次数：${row.count}`
  );
});