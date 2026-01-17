import { historyKl8 } from "../../../common/kl8.js";
import { getMiss } from "../miss/kl8miss2.js";
//import { getkl8miss5 } from "../miss/kl8miss5.js";
import { getNumList, getProfitAmount } from "../../../common/api/getNum.js";

const betNum=5;//投注数量
function getNumlist(){
	let listNum = getNumList(1,19,2,100);
	return listNum;
	 
}
function getCurrentBet(betList,historyList){
	if(historyList.length<1){
		console.log("历史开奖记录不能为空")
		return;
	}
	let prehistoryItem=historyList[historyList.length-1];
}
function caculate(){
	let betList=[
		{
			index:120,//投注 期号
			valueList:[
				{
					list:[22,36],//投注号码
					count:1 //投注数量
				},
				{
					list:[23,37],//投注号码
					count:1 //投注数量
				}
			]
			
		}
	];
	const hitoryList = historyKl8.slice(0,1200);
	const drawHistory = historyKl8.slice(1200);
	const miss2list = getMiss(2,hitoryList);
}