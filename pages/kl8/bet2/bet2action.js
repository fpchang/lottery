import { historyKl8 } from "../../../common/kl8.js";
import { getMiss } from "../miss/kl8miss2.js";
//import { getkl8miss5 } from "../miss/kl8miss5.js";
import { getNumList, getProfitAmount } from "../../../common/api/getNum.js";

const betNum = 2; //投注数量
const listNum = getNumlist(); //[1,2,3,4,5,6,7,8,9,10,11,12,13,14]
console.log("listnum",listNum);
function getNumlist() {
  let listNum = getNumList(1, 19, 4, 300);
  return listNum;
}

function getCurrentBet(betList, historyList) {
  if (historyList.length < 1) {
    console.log("历史开奖记录不能为空");
    return {};
  }

  const formatHistoryList = historyList.map((item) => item.redBall);
  let returnList = null;
  let prehistoryItem = historyList[historyList.length - 1]; // 上期开奖
  const miss2list = getMiss(2, formatHistoryList).filter(item=>item[1]>139);
  //console.log("prehistoryItem no",prehistoryItem.index)
 // console.log("miss2list", miss2list);
  const preBetItem = betList[betList.length - 1]; //上期投注
  returnList = {
    baseindex: prehistoryItem.index, //根据上次开奖index投注 期号
    valueList: miss2list.slice(0, betNum).map((item) => [item[0], 1, 0]),
  };
  if (!preBetItem) {
    //console.log("当期投注：：", returnList);
    return returnList;
  }
  if (preBetItem.baseindex == prehistoryItem.index) {
    //	console.log("还在等待开奖。。。。");
    return null;
  }
  //上期
  // console.log("listNum",listNum)
  returnList.valueList.forEach((element) => {
    const target = preBetItem.valueList.find((item) => item[0] == element[0]);
    if (target) {
      //console.log("target",target)
      const numindex = target[2] + 1;
      element[1] = listNum[numindex];
      element[2] = numindex;
    }
  });
  //console.log("当期投注：：", returnList);
  return returnList;
}

function formatJOSNBetList(betList) {
  return betList.map((item) => {
    const formatValuList = item.valueList.map((it) => {
      return { numbers: it[0], count: it[1], numindex: it[2] };
    });
    console.log("1111", formatValuList);
    return {
      baseindex: item.baseindex,
      valueList: formatValuList,
    };
  });
}
//支出
function getCost(betList){
	let amount=0;
	betList.forEach(item=>{
		item.valueList.forEach(it=>{
			if(!it){
				console.log("111",it);
			}
			amount+=it[1]*2;
		})
	})
	return amount;
}
//收入
function getAmount(betList,historyList){
	let amount=0;
	betList.forEach(item=>{
		const baseindex =item.baseindex;
		let ind =0;//开奖序列号
		historyList.find((his,index)=>{
			ind=index+1;
			return his.index==baseindex
		});
		const hisObj = historyList[ind];//开奖结果
		
		//console.log("开奖序列号",ind);
		item.valueList.forEach(it=>{
			const parseS2=it[0].split(",").map(Number);
			const issuccess = new Set([...hisObj.redBall,...parseS2]).size == hisObj.redBall.length;
			if(issuccess){
			//	console.log(`${it[0] }开奖期为${hisObj.index}=${hisObj.redBall}`);
				amount+=it[1]*19;
			}
		})
	})
	return amount;
}
export function caculate() {
  let betList = [
    // {
    //   baseindex: 2024082,
    //   valueList: [
    //     ["34,52", 1, 0],
    //     ["3,26", 1, 0],
    //     ["48,54", 1, 0],
    //     ["6,52", 1, 0],
    //     ["26,40", 1, 0],
    //   ],
    // },
  ];

  for (let i = 0; i < 600; i++) {
    const hitoryList = historyKl8.slice(0, 700 + i);
    const drawHistory = historyKl8.slice(701 + i);
    const obj = getCurrentBet(betList, hitoryList);
    if (obj != null) {
      betList.push(obj);
    }
  }
  betList.map(item=>{
	//console.log("baseindex",item.baseindex);
	//console.log("valuelist",item.valueList);
  })
 // console.log("投注列表", betList);
 console.log("投注金额：：",getCost(betList));
 console.log("况奖金额::",getAmount(betList,historyKl8));
 console.log("最后一期还有大概",betNum*19);
 let maxnum =0;
 betList.map(item=>{
	item.valueList.map(it=>{
		maxnum=Math.max(it[2]+1,maxnum);
	})
 })
 console.log("最大等待期",maxnum)
}


caculate();
