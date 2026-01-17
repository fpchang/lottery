import { historyKl8 } from "../../../common/kl8.js";
import { getMiss } from "../miss/kl8miss2.js";
import { getNumList, getProfitAmount } from "../../../common/api/getNum.js";

//历史最大遗漏在接下来300期等待多少期开出奖项目
//1X9，2X5,3X3,4X4
//18+20+18+.
//selectType 选几玩法
function get100miss_found(slelctType = 2, historyList, drawHistory) {
  const getMiss2List=((count=5)=>{
        let missMaxList = getMiss(slelctType, historyList); //
        missMaxList = missMaxList.slice(0, count);
       // console.log("选最大遗漏5=", missMaxList);
    let result =[];
    missMaxList.forEach(item=>{
        const formatList = item[0].split(",").map(Number); //[2,3]
        result.push(formatList)
    })
    return result;
  })();
  console.log("miss2",getMiss2List);
  //选n+1
  const getMiss3List = (() => {
    //获取倚楼+1的组合
    let missMaxListAdd = getMiss(slelctType + 1, historyList,80000);
    let result =[];
    missMaxListAdd.forEach(item=>{
        const formatList = item[0].split(",").map(Number); //[2,3，4]
        result.push(formatList)
    })
    return result;
  })();
  //console.log("miss3",getMiss3List)
 //获取与选2包含的组3
 const includMissList=(()=>{
    let resultList=[];
    getMiss2List.forEach(item=>{
       const target= getMiss3List.find(list=>new Set([...list,...item]).size == list.length);
       resultList.push(target)
    });
    return resultList;
 })();
 console.log("miss23,相同选号组合",includMissList);

 //选2组合开奖时间
  const waitnumlist2=(()=>{
    let resultList=[]; 
    getMiss2List.forEach(list=>{
         let ind=0;
         drawHistory.find((item, index) => {
         ind = index;

      return new Set([...item, ...list]).size == item.length;
    });
    resultList.push(ind+1)
    })
    return resultList;
  })();

  console.log("选2开奖等待期数：：", waitnumlist2);


  //选3包2组合开奖时间
  const waitnumlist32=(()=>{
    let resultList=[]; 
    includMissList.forEach(list=>{
         let ind=0;
         drawHistory.find((item, index) => {
         ind = index;

      return new Set([...item, ...list]).size == item.length;
    });
    resultList.push(ind+1)
    })
    return resultList;
  })();
  console.log("3包2的开奖时间",waitnumlist32);
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
  for (let i = 0; i < 30; i++) {
    const historyList = historyKl8
      .map((item) => item.redBall)
     .slice(0, historyKl8.length - 190-i);
    const drawHistory = historyKl8.map((item) => item.redBall).slice(-190-i);
//console.log("tttt",historyKl8[historyList.length-1],historyKl8.slice(-90-i)[0],drawHistory[0])
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
   // console.log(`选${SELECT.select_num}总利润为`, resultProfile);
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
