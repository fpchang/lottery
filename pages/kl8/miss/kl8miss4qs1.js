import { historyKl8 } from "../../../common/kl8.js";
/**
 * 快乐8 4分区 四区各选1码，计算全部4码组合遗漏
 * 分区：1[1‑20]，2[21‑40]，3[41‑60]，4[61‑80]
 * @param {Array<Array<number>>} historyList 历史开奖二维数组，每一项为该期开奖号码数组，由小到大，例[[1,5,22,...], [3,12,33,...]]
 * @returns {Array<{group:number[],lastIndex:number,miss:number}>} 返回所有4区各1码组合的遗漏数据，miss=从未出现则为总期数
 */
function calcKuaiLe8FourZoneMiss(historyList) {
    const zone1 = [];
    const zone2 = [];
    const zone3 = [];
    const zone4 = [];
    // 生成4个分区号码
    for(let i=1;i<=20;i++) zone1.push(i);
    for(let i=21;i<=40;i++) zone2.push(i);
    for(let i=41;i<=60;i++) zone3.push(i);
    for(let i=61;i<=80;i++) zone4.push(i);

    const totalPeriod = historyList.length;
    // key:组合逗号拼接字符串，value:最后出现的期索引
    const groupLastShow = new Map();

    // 遍历历史每一期
    for(let periodIdx = 0; periodIdx < historyList.length; periodIdx++){
        const openSet = new Set(historyList[periodIdx]);
        // 找出本期4个区分别开出哪些号码
        const z1Hit = zone1.filter(n=>openSet.has(n));
        const z2Hit = zone2.filter(n=>openSet.has(n));
        const z3Hit = zone3.filter(n=>openSet.has(n));
        const z4Hit = zone4.filter(n=>openSet.has(n));
        // 本期所有满足【四区各出1个】的组合全部标记该期为最后出现期
        for(const a of z1Hit){
            for(const b of z2Hit){
                for(const c of z3Hit){
                    for(const d of z4Hit){
                        const key = `${a},${b},${c},${d}`;
                        groupLastShow.set(key, periodIdx);
                    }
                }
            }
        }
    }

    const result = [];
    // 四重循环生成全部4区各1码组合
    for(const a of zone1){
        for(const b of zone2){
            for(const c of zone3){
                for(const d of zone4){
                    const key = `${a},${b},${c},${d}`;
                    const lastIdx = groupLastShow.has(key) ? groupLastShow.get(key) : -1;
                    let miss;
                    if(lastIdx === -1){
                        miss = totalPeriod; // 从未出现，遗漏=全部历史期数
                    }else{
                        miss = totalPeriod - 1 - lastIdx;
                    }
                    result.push({
                        group: [a,b,c,d],
                        lastIndex: lastIdx,
                        miss: miss
                    })
                }
            }
        }
    }
    return result;
}

// --------使用示例--------

// 示例历史数据，替换为真实历史开奖
const history =historyKl8.map(item=>item.redBall);
const missData = calcKuaiLe8FourZoneMiss(history);
// 按遗漏从大到小排序
missData.sort((x,y)=> y.miss - x.miss);
console.log("遗漏最大前100组：", missData.slice(0,100));
