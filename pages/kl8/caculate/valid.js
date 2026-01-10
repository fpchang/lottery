/**
 * 合理区间的开奖结果
 */
import {getRandomRedBall} from "./getRandom.js"
import { compare } from "./common.js";
import { kl8_data } from "../kl8_data.js";
const history = kl8_data;
function S0(list, history) {
	let result = {};
	let flag =true;
	for (let i = 0; i < history.length; i++) {
		let newList = new Set([...history[i].redBall, ...list]);
		let num = list.length+history[i].redBall.length - newList.size;
		if (num<2 || num>8) {
			// console.log("repeat and:"+history[i].index);
			flag = false;
			break;
		}
	// 	if(result[num]){
	// 		result[num]++
	// 	}else{
	// 		result[num]=1
	// 	}
	 }
	// console.log("与历史 所有数据相比重复数量 ：",result)
	return flag;

}
function S1(list, history) {
	let count1 = compare(list, history.slice(history.length - 1));
	let count2 = compare(list, history.slice(history.length - 2));
	let count3 = compare(list, history.slice(history.length - 3));
	let count4 = compare(list, history.slice(history.length - 4));
	let count5 = compare(list, history.slice(history.length - 5));
	let count6 = compare(list, history.slice(history.length - 6));
	let count7 = compare(list, history.slice(history.length - 7));
	let count8 = compare(list, history.slice(history.length - 8));
	//console.log("count:",count1,count2,count3,count4,count5);
	const s1 = count1 > 2 && count1 < 8;
	const s2 = count2 > 5 && count2 < 12;
	const s3 = count3 > 8 && count3 < 15;
	const s4 = count4 > 10 && count4 < 17;
	const s5 = count5 > 12 && count4 < 20;
	const s6 = count6 > 14 && count4 < 20;
	const s7 = count7 > 15 && count4 < 20;
	const s8 = count8 > 16;
	const s = S0(list,history);
	if (s&&s1 & s2 && s3 && s4 && s5 && s6 && s7 && s8) {
		return true
	}
	return false;
}
function caculate() {
	let thread = 0;
	let result=null;
	while(result==null){
		let list = getRandomRedBall();
		if (S1(list, history)) {		
			result=list;
		}
	}
	console.log("合格一注开奖结果：",result)
	return result;
}
caculate();