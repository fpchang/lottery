//分4个区计算遗漏
import { historyKl8 } from "../../../common/kl8.js";
/**
 * 号码获取4分区下标 0/1/2/3
 */
function getZoneIndex(num) {
  return Math.floor((num - 1) / 20);
}

/**
 * 校验单个组合是否满足所有分组条件：每组内数字必须全部存在
 * @param {Set} comboSet 当前4码组合集合
 * @param {number[][]} filterGroups 过滤分组
 * @returns {boolean} true=全部条件满足，保留；false=过滤
 */
function checkAllGroupMatch(comboSet, filterGroups) {
  // 遍历每一组要求
  for (const group of filterGroups) {
    // 当前组所有数字必须都在组合内
    let allHas = true;
    for (const num of group) {
      if (!comboSet.has(num)) {
        allHas = false;
        break;
      }
    }
    if (!allHas) return false;
  }
  return true;
}

/**
 * 4分区选4组合遗漏计算，多组强制全包含过滤
 * @param {number[][]} historyDraws 历史开奖二维数组
 * @param {number[][]} filterGroups 过滤组 [[12],[16,30]]
 */
async function calc4ZoneFilterMiss(historyDraws, filterGroups) {
  // 构建4个分区
  const zones = [];
  for (let z = 0; z < 4; z++) {
    const start = z * 20 + 1;
    const list = [];
    for (let i = 0; i < 20; i++) list.push(start + i);
    zones.push(list);
  }

  // 预处理：剔除断区期
  const validDrawSetList = [];
  for (const drawNums of historyDraws) {
    const drawSet = new Set(drawNums);
    let isBreakZone = false;
    for (const zoneArr of zones) {
      let zoneHasNum = false;
      for (const n of zoneArr) {
        if (drawSet.has(n)) {
          zoneHasNum = true;
          break;
        }
      }
      if (!zoneHasNum) {
        isBreakZone = true;
        break;
      }
    }
    if (!isBreakZone) validDrawSetList.push(drawSet);
  }
  const totalValid = validDrawSetList.length;
  console.log(`原始总期数:${historyDraws.length}，剔除断区后有效期:${totalValid}`);
  if (totalValid === 0) throw new Error("无有效非断区开奖数据");

  let allResult = [];
  const batchSize = 12000;
  let batchCache = [];

  async function dfs(zoneIdx, curCombo) {
    if (zoneIdx >= 4) {
      const comboSet = new Set(curCombo);
      // 校验：所有分组内数字必须全部包含
      const pass = checkAllGroupMatch(comboSet, filterGroups);
      if (!pass) return;

      let hitCnt = 0;
      let lastHitVid = -1;
      for (let vid = 0; vid < totalValid; vid++) {
        const dSet = validDrawSetList[vid];
        let allIn = true;
        for (const num of comboSet) {
          if (!dSet.has(num)) {
            allIn = false;
            break;
          }
        }
        if (allIn) {
          hitCnt++;
          lastHitVid = vid;
        }
      }

      // 计算遗漏
      let missVal = lastHitVid === -1
        ? totalValid
        : (totalValid - 1) - lastHitVid;

      const sortedStr = [...curCombo]
        .sort((a, b) => a - b)
        .map(v => String(v).padStart(2, "0"))
        .join(",");

      batchCache.push({
        combo: sortedStr,
        hitTimes: hitCnt,
        miss: missVal
      });

      if (batchCache.length >= batchSize) {
        allResult.push(...batchCache);
        batchCache = [];
        await new Promise(res => setTimeout(res, 0));
      }
      return;
    }

    for (const num of zones[zoneIdx]) {
      curCombo.push(num);
      await dfs(zoneIdx + 1, curCombo);
      curCombo.pop();
    }
  }

  await dfs(0, []);
  if (batchCache.length > 0) allResult.push(...batchCache);

  // 遗漏从大到小排序
  allResult.sort((a, b) => b.miss - a.miss);

  console.log("筛选后符合条件组合总数：", allResult.length);
  console.table(allResult.slice(0, 100));

  // CSV导出
//   let csvTxt = "4码选4组合,历史命中次数,当前遗漏期数\n";
//   allResult.forEach(item => {
//     csvTxt += `${item.combo},${item.hitTimes},${item.miss}\n`;
//   });
//   console.log("====完整CSV文本，复制到Excel====");
//   console.log(csvTxt);

  return allResult;
}

// ====================== 配置区自行修改 ======================
// 示例：[[12],[16,30]]
// 要求：组合必须同时包含 12、16、30 三个数字
const filterInputGroups = [[16, 30]];

// 历史开奖数据，每期20个数字
const historyData = historyKl8.map(item=>item.redBall);
// ==========================================================

calc4ZoneFilterMiss(historyData, filterInputGroups)
  .catch(err => console.error("计算异常：", err.message));
