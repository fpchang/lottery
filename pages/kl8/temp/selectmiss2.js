import { historyKl8 } from "../../../common/kl8.js";
import {getMiss} from "../miss/kl8miss2.js";
import {getNumList,getProfitAmount} from "../../../common/api/getNum.js"
//历史最大遗漏在接下来300期等待多少期开出奖项目
//1X9，2X5,3X3,4X4
 //18+20+18+.  
 //selectType 选几玩法
function get100miss_found(slelctType=2){
    let historyList = historyKl8.map(item=>item.redBall).slice(0,historyKl8.length-400);
    let missMaxList = getMiss(slelctType,historyList);//
    console.log('选最大遗漏100=',missMaxList);
    const drawHistory=historyKl8.map(item=>item.redBall).slice(-400);
    // console.log("开奖结果第一期",historyKl8.slice(-400)[0])
    let resultIndexList=[];
    missMaxList=missMaxList.slice(0,100);
    missMaxList.forEach(list => {
        let ind =0;
        const formatList = list[0].split(",").map(Number);//[2,3]
        drawHistory.find((item,index)=>{
            ind =index;
           
           return  new Set([...item,...formatList]).size==item.length
        });
        resultIndexList.push(ind)
    });
   console.log("开奖等待期数：：",resultIndexList);
   console.log("第一天开出",resultIndexList.filter(item=>item==0).length,"柱")
    return resultIndexList;
}
//选100个选2组合算当天开出来的有多少
function getselect100Numbers(historyList,drawHistory){
    //let historyList = historyKl8.map(item=>item.redBall).slice(0,historyKl8.length-400);
    let missMaxList = getMiss(2,historyList);//
    console.log('选最大遗漏100=',missMaxList);
    //const drawHistory=historyKl8.map(item=>item.redBall).slice(-400);
    // console.log("开奖结果第一期",historyKl8.slice(-400)[0])
    let resultIndexList=[];
    missMaxList=missMaxList.slice(0,100);
    missMaxList.forEach(list => {
        let ind =0;
        const formatList = list[0].split(",").map(Number);//[2,3]
        drawHistory.find((item,index)=>{
            ind =index;
           
           return  new Set([...item,...formatList]).size==item.length
        });
        resultIndexList.push(ind)
    });
    const currentDaynum = resultIndexList.filter(item=>item==0).length;
   console.log("开奖等待期数：：",resultIndexList);
   console.log("第一天开出",currentDaynum,"柱")
    return currentDaynum;
}
function getAmount100(singleAmount=19){
    let grouplist = get100miss_found();
    let listNum = getNumList(1,singleAmount,300);
    console.log("listnum",listNum);
    let resultProfile=0;
    grouplist.forEach(item=>{
        let a = getProfitAmount(item,listNum,singleAmount);
        console.log("计算利润",a)
       resultProfile+= a.profitAmount;
    })
    console.log("最长等待期为",Math.max(...grouplist));
   console.log("总利润为",resultProfile);

}
getAmount100();