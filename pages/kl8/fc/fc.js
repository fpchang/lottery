/**
 * 随机生成1~80之间无重复N个号码并升序排序
 * @param {number} count 号码个数
 * @returns {number[]}
 */
function randUniqueNums(count) {
  const pool = Array.from({ length: 80 }, (_, i) => i + 1);
  // 洗牌
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count).sort((a, b) => a - b);
}

/**
 * 校验9码组合是否满足：和所有选4组合重合数都 < 2
 * @param {number[]} nineComb 9码选9号码
 * @param {number[][]} fourList 多组选4组合二维数组
 * @returns {boolean, Object} 校验结果+详细重合明细
 */
function checkNineVsAllFour(nineComb, fourList) {
  const nineSet = new Set(nineComb);
  const detail = [];
  let pass = true;

  for (let idx = 0; idx < fourList.length; idx++) {
    const four = fourList[idx];
    let same = 0;
    for (const n of four) {
      if (nineSet.has(n)) same++;
    }
    detail.push({
      选4组序号: idx + 1,
      选4号码: four,
      重合号码数量: same
    });
    if (same >= 2) pass = false;
  }
  return { pass, detail };
}

/**
 * 自动循环生成，直到找到一组合规选9组合
 * @param {number[][]} fourList 多组选4组合
 * @param {number} maxTry 最大重试次数，防止死循环
 * @returns {Object|null}
 */
function findValidNineCombo(fourList, maxTry = 100000) {
  let tryCnt = 0;
  while (tryCnt < maxTry) {
    tryCnt++;
    const nine = randUniqueNums(9);
    const { pass, detail } = checkNineVsAllFour(nine, fourList);
    if (pass) {
      return {
        合规选9组合: nine,
        校验明细: detail,
        尝试生成次数: tryCnt
      };
    }
  }
  return null;
}

// ===================== 测试配置 =====================
// 你自己替换成你的全部选4组合
const fourGroups = [
  [2, 9, 15, 22],
  [7, 13, 31, 44],
  [11, 26, 52, 68],
  [5, 18, 39, 71]
];

// 执行查找
const result = findValidNineCombo(fourGroups);

if (!result) {
  console.log("达到最大重试次数，未找到符合条件的选9组合，可扩大重试上限");
} else {
  console.log("✅ 找到符合要求的选9号码：", result.合规选9组合.join(","));
  console.log("一共尝试生成", result.尝试生成次数, "次");
  console.log("\n逐条重合校验明细：");
  result.校验明细.forEach(item => {
    console.log(`第${item.选4组序号}组选4[${item.选4号码.join(",")}]，重合${item.重合号码数量}个`);
  });
}