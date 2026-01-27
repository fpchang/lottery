import {ssqHistory} from "../../common/ssq.js";

const redballAll =[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33]
const history=ssqHistory;
function getRandomRedBall(len=33){
	let result = [];
	while(result.length<6){
		const random = Math.ceil(Math.random()*len)
		let list =[...result];
		list.push(random);
		result= [...new Set(list)];
	}
	result.sort((a,b)=>a-b);
	return result;
}
//与历史开奖组合重合数量
function sameHistory(n=2,historyList=[]){
	const getGroupBall=(index)=>{
		let groupRedBall=[];
		for(let i=index-n;i<index;i++){
			groupRedBall.push(...historyList[i].redBall)
		}
		groupRedBall.sort((a,b)=>a-b);
		groupRedBall=new Set(groupRedBall);
		//console.log("groupRedBall",groupRedBall);
		return groupRedBall;
	}
	let s={};
	for(let i =n;i<historyList.length;i++){
		const grouplist = getGroupBall(i);
		//console.log("111",grouplist);
		const gsize=grouplist.size;
		let groupRedBall_=[...grouplist];
		groupRedBall_.push(...historyList[i].redBall);
		groupRedBall_=new Set(groupRedBall_);
		//console.log("groupRedBall_",groupRedBall_)
		let result = historyList[i].redBall.length-(groupRedBall_.size-gsize);
		//console.log("--------------");
		//console.log("groupRedBall",grouplist);
		//console.log("groupRedBall_",groupRedBall_)
		//console.log(`与前${n}期比较有${result}个球重复-index${i}`);
		if(result<2){
			//console.log(`前${n}期组合为：：`,groupRedBall_);
			//console.log(`当期为：：`,historyList[i]);
			//console.log(`与前${n}期比较有${result}个球重复-index${i}`);
		}
		if(s[result]){
			s[result]++;
		}else{
			s[result]=1;
		}
		
		//console.log("--------------");
		
	}
	console.log(`统计结果：${historyList.length}期与前== ${n}期重复结果 ==`,s)
}
//比较随机与前n期重复数量
function compare(list =[],listHistory=[]){
	let groupList =[]
	for(let i=0;i<listHistory.length;i++){
		groupList.push(...listHistory[i].redBall)
	}
	groupList = [...new Set(groupList)];
	//console.log("groupList",groupList);
	let newList = [...groupList,...list];
	newList=[...new Set(newList)];
	//console.log("newList",newList);
	return list.length+groupList.length-(newList.length);
}
//获取数据组合去重排序
function getGroupList(listHistory){
	let groupList =[]
	for(let i=0;i<listHistory.length;i++){
		groupList.push(...listHistory[i].redBall)
	}
	groupList = [...new Set(groupList)];
	groupList.sort((a,b)=>a-b);
	return groupList;
}
//console.log(getRandomRedBall());
//sameHistory(2,history);
//与所有历史数据相比
function S0(list,history){
	let result =true;
	
	for(let i=0;i<history.length;i++){
		 let newList = new Set([...history[i].redBall,...list]);
		 const repeatCount = 12-newList.size;
		 if(repeatCount>3){
			// console.log("repeat and:"+history[i].index);
			 result=false;
			 break;
		 }
	}
	
	return result;
	
}
//红球算法 与前几期比较
function S1(list,history){
	let count1 = compare(list,history.slice(history.length-1));
	let count2 = compare(list,history.slice(history.length-2));
	let count3 = compare(list,history.slice(history.length-3));
	let count4 = compare(list,history.slice(history.length-4));
	let count5 = compare(list,history.slice(history.length-5));
	let count6 = compare(list,history.slice(history.length-6));
	let count7 = compare(list,history.slice(history.length-7));
	//console.log("count:",count1,count2,count3,count4,count5);
	const s1=count1<2;
	const s2=count2>0&&count2<4;
	const s3=count3>1&&count3<5;
	const s4=count4<6&&count4>1;
	const s5=count5>2&&count5<6;
	const s6=count6>2;
	if(s1&&s1&&s3&&s4&&s5){
		return true
	}
	return false;
}
function S1_stat(list){
	let s={};
	for(let i=0;i<list.length;i++){
		let arr =list[i].redBall;
		for(let j=0;j<arr.length;j++){
			if(s[arr[j].toString()]){
				s[arr[j].toString()]++;
			}else{
				s[arr[j].toString()]=1
			}
		}
		
	}
	return s;
}
//红球冷号
/**
 * @param {Object} list
 * @param {Object} history
 * 1,与前2期 只有0个号重复--6/137
 * 2，与前3期只1个号重复 12/137
 * 3，前4期只有一个号 重复4/137
 * 4,
 */
function S2(list,history){
	let count2 = compare(list,history.slice(history.length-2));
	let count3 = compare(list,history.slice(history.length-3));
	let count4 = compare(list,history.slice(history.length-4));
	let count7 = compare(list,history.slice(history.length-7));
	if(count4==0&&count7<3){
		
		return true;
	}
	return false;
}
//红球绝杀爆冷号
/**
 * @param {Object} list
 * @param {Object} history
 * 1,与前2期 只有0个号重复--6/137
 * 2，与前3期只1个号重复 12/137
 * 3，前4期只有一个号 重复4/137
 * 4,
 */
function S3(list,history){
	let count2 = compare(list,history.slice(history.length-2));
	let count3 = compare(list,history.slice(history.length-3));
	let count4 = compare(list,history.slice(history.length-4));
	let count5 = compare(list,history.slice(history.length-5));
	let count7 = compare(list,history.slice(history.length-7));
	if(count3==0){
		
		return true;
	}
	return false;
}
function S4(list,history){
	let count2 = compare(list,history.slice(history.length-2));
	let count3 = compare(list,history.slice(history.length-3));
	let count4 = compare(list,history.slice(history.length-4));
	let count5 = compare(list,history.slice(history.length-5));
	let count7 = compare(list,history.slice(history.length-7));
	if(count4==6){
		
		return true;
	}
	return false;
}
//验证自行选择是否在算法内
function validSelfCheck(list){
	if(S0(list,history)&&S1(list,history)){
		return ture
	}
	return false;
}
//与历史每期比较，获取重复数量
function repeatSinglHistory(list,history){
	let result={};
	for(let i =0;i<history.length;i++){
		let redBall = history[i].redBall;
		
		let num = list.length + redBall.length - new Set([...redBall,...list]).size;
		//console.log(num)
		if(result[num]){
			result[num]++
		}else{
			result[num]=1;
		}
	}
	return result;
}
function caculate(fn,n=20){
	

	let thread=0;
	let result =[];
	while(thread<n){
		let list =getRandomRedBall();		
		if(S0(list,history)&&fn(list,history)){
			result.push({redBall:list})
			thread++;
		}
	}
	return result;
}
//结果 与前2期最多重复2，与前3期最多重复3,前4期最多3
//console.log(caculate());
///sameHistory(1,history);
//let flag = S1([ 8, 10, 14, 23, 28, 32 ],history);
//console.log(flag);
//将2024年双色球61到90期开奖结束整理成json格式，要全部开奖数据升序排列，生成附件
sameHistory(1,history);
sameHistory(2,history);
sameHistory(3,history);
sameHistory(4,history);
sameHistory(5,history);
sameHistory(6,history);
sameHistory(7,history);
sameHistory(8,history);
sameHistory(9,history);
sameHistory(10,history);
sameHistory(11,history);
const c2=getGroupList(history.slice(history.length-2));
const c3=getGroupList(history.slice(history.length-3));
const c4=getGroupList(history.slice(history.length-4));
const c5=getGroupList(history.slice(history.length-5));
const c6=getGroupList(history.slice(history.length-6));

 const list=caculate(S1,14);
 console.log(list);
// console.log(S1_stat(list));
// const c6=getGroupList(history.slice(history.length-6));
console.log("c2",c2);
console.log("c3",c3);
console.log("c4",c4);
console.log("c5",c5);
console.log("c6",c6);

// history.forEach(item => {
// 	const result = repeatSinglHistory(item.redBall,history);
// 	console.log("result",result)
// });


//总结
//1，c3中选5加一个冷号
//2，c3与c4前区夹号
