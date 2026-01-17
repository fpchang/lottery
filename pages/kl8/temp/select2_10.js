import { historyKl8 } from "../../../common/kl8.js";
import { getMiss } from "../miss/kl8miss2.js";
//import { getkl8miss5 } from "../miss/kl8miss5.js";
import { getNumList, getProfitAmount } from "../../../common/api/getNum.js";
function formatGetMiss(selectType, hislist) {
  let missMaxListAdd = getMiss(selectType, hislist, 80000);
  let result = [];
  missMaxListAdd.forEach((item) => {
    const formatList = item[0].split(",").map(Number); //[2,3，4]
    result.push(formatList);
  });
  return result;
}

//包含组合
function getincludMissList(child, father) {
  let resultList = [];
  child.forEach((item) => {
    const target = father.find(
      (list) => new Set([...list, ...item]).size == list.length
    );
    //  console.log("33333",target);
    if (target) {
      resultList.push(target);
    } else {
      console.error("没有找到");
    }
  });
  return resultList;
}
//等待开奖期数
function waitnumlist(navList,drawHistory){
let resultList = [];
    navList.forEach((list) => {
      let ind = 0;
    const obj = drawHistory.find((item, index) => {
        ind = index;

        return new Set([...item, ...list]).size == item.length;
      });
      if(obj){
      resultList.push(ind + 1);

      }
    });
    return resultList;
}
//历史最大遗漏在接下来300期等待多少期开出奖项目
//1X9，2X5,3X3,4X4
//18+20+18+.
//selectType 选几玩法
function get100miss_found(slelctType = 2, historyList, drawHistory) {
  const getMiss2List = ((count = 5) => {
    let missMaxList = getMiss(slelctType, historyList); //
    missMaxList = missMaxList.slice(0, count);
    // console.log("选最大遗漏5=", missMaxList);
    let result = [];
    missMaxList.forEach((item) => {
      const formatList = item[0].split(",").map(Number); //[2,3]
      result.push(formatList);
    });
    return result;
  })();
  console.log("miss2", getMiss2List);
  //选n+1
  const getMiss3List = formatGetMiss(3, historyList);
  //const getMiss4List = formatGetMiss(4, historyList);
 //const getMiss5List = getkl8miss5(historyList);
//console.log("misslist complete5",getMiss5List);
  //获取与选2包含的组3
  const includMissList32 = getincludMissList(getMiss2List, getMiss3List);
  console.log("miss32,相同选号组合", includMissList32);
  //获取与选43
  //const includMissList43 = getincludMissList(includMissList32, getMiss4List);
  //console.log("miss43,相同选号组合", includMissList43);
   //获取与选54
  // const includMissList54 = getincludMissList(includMissList43, getMiss5List);
  // console.log("miss54,相同选号组合", includMissList54);
  
  
  //选2组合开奖时间
  const waitnumlist2 =waitnumlist(getMiss2List,drawHistory);  
  console.log("选2开奖等待期数：：", waitnumlist2);
  //选3包2组合开奖时间
  const waitnumlist32 = waitnumlist(includMissList32,drawHistory);
  console.log("3包2的开奖时间", waitnumlist32);
  //选4包3组合开奖时间
  //const waitnumlist43 = waitnumlist(includMissList43,drawHistory); 
  //console.log("4包32的开奖时间", waitnumlist43);
//选5包4组合开奖时间
  // const waitnumlist54= waitnumlist(includMissList54,drawHistory); 
  // console.log("4包32的开奖时间", waitnumlist54);

  return waitnumlist2;
}

function getAmount100(SELECT) {
  let listNum = getNumList(
    SELECT.start,
    SELECT.singleAmount,
    SELECT.ticketPrice,
    300
  );
  console.log("listnum", listNum);
  for (let i = 0; i < 1000; i=i+180) {
    const historyList = historyKl8
      .map((item) => item.redBall)
     .slice(0, historyKl8.length - 100 - i);
    const drawHistory = historyKl8.map((item) => item.redBall)
    .slice(historyList.length);
    console.log("tttt", historyKl8[historyList.length - 1], drawHistory[0]);
    let grouplist = get100miss_found(
      SELECT.select_num,
      historyList,
      drawHistory
    );
    //console.log("第一天开出",grouplist.filter(item=>item==0).length,"柱");
    // console.log("等待结果小于21",grouplist.filter(item=>item<21).length,"柱")

    let resultProfile = 0;
    grouplist.forEach((item) => {
      let a = getProfitAmount(item, listNum, SELECT.singleAmount);
      // console.log("计算利润",a)
      resultProfile += a.profitAmount;
    });
    //console.log("最长等待期为", Math.max(...grouplist));
    console.log("最小等待期为", Math.min(...grouplist));
     console.log(`选${SELECT.select_num}总利润为`, resultProfile);
  }
}
const selectObject = {
  select_1: {
    select_num: 1, //选几组合
    singleAmount: 4.5, //中奖单注奖金
    ticketPrice: 2, //票价
    start: 1, //开始投注期数
  },
  select_2: {
    select_num: 2,
    singleAmount: 19,
    ticketPrice: 2,
    start: 1,
  },
  select_2s: {
    select_num: 2,
    singleAmount: 19,
    ticketPrice: 10,
    start: 1,
  },
  select_3: {
    select_num: 3,
    singleAmount: 52,
    ticketPrice: 2,
    start: 1,
  },
};
//选2
getAmount100(selectObject.select_2);
