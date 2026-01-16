
import { dltHistory } from "../../common/dlt.js";
const redballAll =[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35]
const history=dltHistory;
function getRandomRedBall(ballIndex='redBall'){
	let len=35;
	let num =5;
	
	if(ballIndex=='blueBall'){
		len=16;
		num=2;
		
	}
	let result = [];
	while(result.length<num){
		const random = Math.ceil(Math.random()*len)
		let list =[...result];
		list.push(random);
		result= [...new Set(list)];
	}
	result.sort((a,b)=>a-b);
	return result;
}
function getGroupList(listHistory){
	let groupList =[]
	for(let i=0;i<listHistory.length;i++){
		groupList.push(...listHistory[i].redBall)
	}
	groupList = [...new Set(groupList)];
	groupList.sort((a,b)=>a-b);
	return groupList;
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
//与历史开奖组合重合数量
function sameHistory(n=2,historyList=[],ballindex='redBall'){
	const getGroupBall=(index)=>{
		let groupRedBall=[];
		for(let i=index-n;i<index;i++){
			groupRedBall.push(...historyList[i][ballindex])
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
		groupRedBall_.push(...historyList[i][ballindex]);
		groupRedBall_=new Set(groupRedBall_);
		//console.log("groupRedBall_",groupRedBall_)
		let result = historyList[i][ballindex].length-(groupRedBall_.size-gsize);
		//console.log("--------------");
		//console.log("groupRedBall",grouplist);
		//console.log("groupRedBall_",groupRedBall_)
		//console.log(`与前${n}期比较有${result}个球重复-index${i}`);
		if(result==0){
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
function compare(list =[],listHistory=[],ballindex='redBall'){
	let groupList =[]
	for(let i=0;i<listHistory.length;i++){
		groupList.push(...listHistory[i][ballindex])
	}
	groupList = [...new Set(groupList)];
	//console.log("groupList",groupList);
	let newList = [...groupList,...list];
	newList=[...new Set(newList)];
	//console.log("newList",newList);
	return list.length+groupList.length-(newList.length);
}
//与所有历史数据相比
function S0(list,history){
	let result =true;
	
	for(let i=0;i<history.length;i++){
		 let newList = new Set([...history[i].redBall,...list]);
		 if(newList.size<8){
			console.log("重复数量:",10-newList.size)
			//console.log("与开过的相同太大:",newList,history[i]);
			 result=false;
			 break;
		 }
	}
	
	return result;
	
}
//console.log(getRandomRedBall());
//sameHistory(2,history);
//红球算法 与前几期比较
function S1(list,history){
	let count1 = compare(list,history.slice(history.length-1));
	let count2 = compare(list,history.slice(history.length-2));
	let count3 = compare(list,history.slice(history.length-3));
	let count4 = compare(list,history.slice(history.length-4));
	let count5 = compare(list,history.slice(history.length-5));
	let count6 = compare(list,history.slice(history.length-6));
	let count7 = compare(list,history.slice(history.length-7));
	const s1 =count1<2;
	const s2=count2<3;
	const s3=count3<4;
	const s4= count4>0&&count4<5;
	const s5=count5>0;
	const s6=count6>1;
	
	if(s1&&s2&&s3&&s4&&s5&&s6){
		return true
	}
	return false;
}
function S1_BLUE(list,history){
	let count1 = compare(list,history.slice(history.length-1),'blueBall');
	let count2 = compare(list,history.slice(history.length-2),'blueBall');
	let count3 = compare(list,history.slice(history.length-3),'blueBall');
	
	let count6 = compare(list,history.slice(history.length-6),'blueBall');
	
	let count10 = compare(list,history.slice(history.length-10),'blueBall');
	const s1 =count1<1;
	const s2=count2<2;
	const s3=count3<2;
	const s6=count6>0;
	const s10=count10>1;
	if(s1&&s2&&s3&&s6&&s10){
		return true
	}
	return false;
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
	let count5 = compare(list,history.slice(history.length-5));
	if(count2==0&&count3<2&&count4<2&&count5<3){
		
		return true;
	}
}
//红球绝杀爆冷号
/**
 * @param {Object} list
 * @param {Object} history
 * 1,与前9期 只有0个号重复--1/135
 * 2，与前10期 只有1个号重复--1/135
 * 3，
 * 4,
 */
function S3(list,history){
	//console.log("s3--",history)
	let count9 = compare(list,history.slice(history.length-9));
	let count10 = compare(list,history.slice(history.length-10));
	let count11 = compare(list,history.slice(history.length-11));
	if(count9==0 ||count9==1||count11==1){
		
		return true;
	}
}
function S3_BLUE(list,history){
	
	let count12 = compare(list,history.slice(history.length-12),"blueBall");
	let count13 = compare(list,history.slice(history.length-13),"blueBall");
	if(count12==0 || count13==0){
		
		return true;
	}
}
function caculate(fn,num=5,ballIndex='redBall'){
	

	let thread=0;
	let result =[];
	while(thread<num){
		let list =getRandomRedBall(ballIndex);		
		if(fn&&S0(list,dltHistory.slice(-600))&&S1(list,dltHistory)){
			result.push({valueBall:list})
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
// sameHistory(1,dltHistory,"blueBall");
// sameHistory(2,dltHistory,"blueBall");
//sameHistory(3,dltHistory,"blueBall");
// sameHistory(4,dltHistory,"blueBall");
// sameHistory(5,dltHistory,"blueBall");
// sameHistory(6,dltHistory,"blueBall");
// sameHistory(7,dltHistory,"blueBall");
// sameHistory(8,dltHistory,"blueBall");
// sameHistory(9,dltHistory,"blueBall");
// sameHistory(10,dltHistory,"blueBall");
// sameHistory(11,dltHistory,"blueBall");
// sameHistory(12,dltHistory,"blueBall");
// sameHistory(13,dltHistory,"blueBall");
// sameHistory(14,dltHistory,"blueBall");
// sameHistory(15,dltHistory,"blueBall");
// sameHistory(16,dltHistory,"blueBall");
// sameHistory(17,dltHistory,"blueBall");
// sameHistory(1,dltHistory);
// sameHistory(2,dltHistory);
// sameHistory(3,dltHistory);
// sameHistory(4,dltHistory);
// sameHistory(5,dltHistory);
// sameHistory(6,dltHistory);
// sameHistory(7,dltHistory);
// sameHistory(8,dltHistory);
// sameHistory(9,dltHistory);
// sameHistory(10,dltHistory);
// sameHistory(11,dltHistory);
// sameHistory(12,dltHistory);
//爆冷号
// console.log(caculate(S3,1));
// console.log(caculate(S3_BLUE,1,"blueBall"));
//热号
//console.log("上期开奖",dltHistory[dltHistory.length-1])
console.log(caculate(S1,14));
//console.log(caculate(S1_BLUE,10,"blueBall"));
// const c3=getGroupList(dltHistory.slice(dltHistory.length-3));
// const c4=getGroupList(dltHistory.slice(dltHistory.length-4));
// const c5=getGroupList(dltHistory.slice(dltHistory.length-5));
// const c6=getGroupList(dltHistory.slice(dltHistory.length-6));
// const c7=getGroupList(dltHistory.slice(dltHistory.length-7));
// const c8=getGroupList(dltHistory.slice(dltHistory.length-8));
// const c9=getGroupList(dltHistory.slice(dltHistory.length-9));
// const c10=getGroupList(dltHistory.slice(dltHistory.length-10));
// const c11=getGroupList(dltHistory.slice(dltHistory.length-11));
// console.log("c3",new Set(c3),new Set(c4),new Set(c5),new Set(c6),new Set(c7),new Set(c8),"c9",new Set(c9),new Set(c10),new Set(c11));

function testValid(list=[]){
	const flag = S0(list,dltHistory);
	console.log(list,flag?"有效":"无效")
}
testValid([3,14,15,17,21]);
//testValid([8,11,13,25,28,31]);

// dltHistory.forEach(item => {
// 	const result = repeatSinglHistory(item.redBall,dltHistory);
// 	console.log("result",result)
// });