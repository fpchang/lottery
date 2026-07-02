import { historyKl8 } from "../../../common/kl8.js";
// 6个分区
const zones = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,14, 15, 16, 17, 18, 19, 20],
  [ 21, 22, 23, 24, 25, 26,27, 28, 29, 30, 31, 32,33, 34, 35, 36, 37, 38, 39,40],
  [41, 42, 43, 44, 45, 46, 47, 48,49, 50, 51, 52,53, 54, 55, 56, 57, 58, 59, 60],
  [ 61, 62, 63, 64, 65, 66,67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80],
  []
];
const len = zones.map((z) => z.length);

/**
 * 历史开奖转为位图 Uint8Array[81]
 * arr[x] = 1 代表当期开出号码x
 */
function buildBitmapList(historyData) {
  return historyData.map((draw) => {
    const bm = new Uint8Array(81);
    for (const n of draw) bm[n] = 1;
    return bm;
  });
}

/**
 * 全量枚举 + 位图极速判定，无随机，全局最优
 */
function fastScanAll(bitmapList) {
  const res = [];
  const hTotal = bitmapList.length;

  for (let i0 = 0; i0 < len[0]; i0++) {
    const n1 = zones[0][i0];
    for (let i1 = 0; i1 < len[1]; i1++) {
      const n2 = zones[1][i1];
      for (let i2 = 0; i2 < len[2]; i2++) {
        const n3 = zones[2][i2];
        for (let i3 = 0; i3 < len[3]; i3++) {
          const n4 = zones[3][i3];
   
              // 判定：整套6码是否同一期完整开出
              let fullHit = false;
              for (let h = 0; h < hTotal; h++) {
                const bm = bitmapList[h];
                if (bm[n1] && bm[n2] && bm[n3] && bm[n4]) {
                  fullHit = true;
                  break;
                }
              }
              if (fullHit) continue;

              // 计算单期最大重合个数
              let maxOver = 0;
              for (let h = 0; h < hTotal; h++) {
                const bm = bitmapList[h];
                let curr = 0;
                if (bm[n1]) curr++;
                if (bm[n2]) curr++;
                if (bm[n3]) curr++;
                if (bm[n4]) curr++;
                if (curr > maxOver) maxOver = curr;
              }

              res.push({
                combo: [n1, n2, n3, n4],
                maxOverlap: maxOver,
              });
            
          
        }
      }
    }
  }
  return res;
}

// ==================== 使用示例 ====================
// 替换成你的2000期真实历史数据
const historyData = historyKl8.map((item) => item.redBall); // 假设historyKl8每项有redBall数组，包含20个开奖号码

const bitmapArr = buildBitmapList(historyData);

console.time("完整扫描耗时");
const validList = fastScanAll(bitmapArr);
console.timeEnd("完整扫描耗时");

// 按最大重合数升序，重合越小越靠前
validList.sort((a, b) => a.maxOverlap - b.maxOverlap);

const getResult = (filter = []) => {
  //console.log("有效组合总数：", validList.length);
 // console.log("filter:", filter);
  for (let i = 0; i < validList.length; i++) {
    const item = validList[i];
    const arr= new Set([...item.combo,...filter]);
    if(arr.size === 4){
    console.log(
          //`第${i + 1} | ${item.combo} | 历史单期最大重合：${item.maxOverlap}`,
         `选五 胆${item.combo}  拖[46,80]` 
        );
    }
   
  }
};
//16,30-
//
//36,54
//17,73- 17,22,44,73/ 17,30,42,73
//24 68-4,24,45,68
//20,47-
//1,70-
//15,59-
//40,72
//47,59


getResult([36,54])
getResult([17,73])
getResult([24,68])
getResult([20,47])
getResult([1,70])
getResult([15,59])
getResult([40,72])
getResult([47,59])

getResult([25,42])
getResult([25,58])
getResult([28,80])
getResult([15,62])
getResult([21,56])
getResult([25,47])
getResult([55,78])
getResult([44,74])
getResult([1,67])
getResult([15,71])
getResult([68,73])
getResult([20,43])
getResult([25,74])
// getResult([1,48])
// getResult([1,75])
// getResult([28,68])
// getResult([5,59])
// getResult([34,46])
// getResult([34,59])
// getResult([59,72])
  //getResult([]);

// 第290 | 17,30,42,73 | 历史单期最大重合：3
// 第56 | 4,24,45,68 | 历史单期最大重合：3
// 第96 | 6,25,42,76 | 历史单期最大重合：3
// 第116 | 7,25,58,77 | 历史单期最大重合：3
// 第240 | 15,23,41,62 | 历史单期最大重合：3
// 第250 | 15,35,50,62 | 历史单期最大重合：3
// 第239 | 15,21,56,66 | 历史单期最大重合：3
// 第19 | 1,33,46,67 | 历史单期最大重合：3
// 第353 | 20,24,43,74 | 历史单期最大重合：3
// 第114 | 7,25,49,74 | 历史单期最大重合：3