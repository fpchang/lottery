import { historyKl8 } from "../../../common/kl8.js";
import {getMiss} from "../miss/kl8miss2.js";
import {getNumList,getProfitAmount} from "../../../common/api/getNum.js";
const selectObject={
    select_one:{
        select_num:1,
        singleAmount:4.5,
    },
    select_two:{
        select_num:2,
        singleAmount:19,
    }
}
//历史最大遗漏在接下来300期等待多少期开出奖项目
//1X9，2X5,3X3,4X4
 //18+20+18+.  
 //selectType 选几玩法
function get100miss_found(slelctType=2,historyList,drawHistory){
   // let historyList = historyKl8.map(item=>item.redBall).slice(0,historyKl8.length-400);
    let missMaxList = getMiss(slelctType,historyList);//
    
    //const drawHistory=historyKl8.map(item=>item.redBall).slice(-400);
    // console.log("开奖结果第一期",historyKl8.slice(-400)[0])
    let resultIndexList=[];
    missMaxList=missMaxList.slice(0,5);
    //console.log('选最大遗漏20=',missMaxList);
    missMaxList.forEach(list => {
        let ind =0;
        const formatList = list[0].split(",").map(Number);//[2,3]
        drawHistory.find((item,index)=>{
            ind =index;
           
           return  new Set([...item,...formatList]).size==item.length
        });
        resultIndexList.push(ind+1)
    });
   console.log("开奖等待期数：：",resultIndexList);
   //console.log("第一天开出",resultIndexList.filter(item=>item==0).length,"柱")
    return resultIndexList;
}
function getAmount100(singleAmount=19){
    let listNum = getNumList(1,singleAmount,2,300);
   // console.log("listnum",listNum);
    for(let i =0;i<60;i++){
         const historyList = historyKl8.map(item=>item.redBall).slice(0,historyKl8.length-390-i);
        const drawHistory=historyKl8.map(item=>item.redBall).slice(-390-i);
    
    let grouplist = get100miss_found(2,historyList,drawHistory);
    //console.log("第一天开出",grouplist.filter(item=>item==0).length,"柱");
   // console.log("等待结果小于21",grouplist.filter(item=>item<21).length,"柱")
    
    let resultProfile=0;
    grouplist.forEach(item=>{
        let a = getProfitAmount(item,listNum,singleAmount);
      // console.log("计算利润",a)
       resultProfile+= a.profitAmount;
    })
    console.log("最长等待期为",Math.max(...grouplist));
   console.log("总利润为",resultProfile);
    }
    

}
getAmount100(19);