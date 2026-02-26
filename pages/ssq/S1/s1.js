import { ssqHistory } from "../../../common/ssq.js";
const redballAll = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33,
];
function getRandomRedBall(len = 33) {
  let result = [];
  while (result.length < 6) {
    const random = Math.ceil(Math.random() * len);
    let list = [...result];
    list.push(random);
    result = [...new Set(list)];
  }
  result.sort((a, b) => a - b);
  return result;
}
//与历史开奖组合重合数量
function sameHistory(n = 2, historyList = []) {
  const getGroupBall = (index) => {
    let groupRedBall = [];
    for (let i = index - n; i < index; i++) {
      groupRedBall.push(...historyList[i].redBall);
    }
    groupRedBall.sort((a, b) => a - b);
    groupRedBall = new Set(groupRedBall);
    //console.log("groupRedBall",groupRedBall);
    return groupRedBall;
  };
  let s = {};
  for (let i = n; i < historyList.length; i++) {
    const grouplist = getGroupBall(i);
    //console.log("111",grouplist);
    const gsize = grouplist.size;
    let groupRedBall_ = [...grouplist];
    groupRedBall_.push(...historyList[i].redBall);
    groupRedBall_ = new Set(groupRedBall_);
    //console.log("groupRedBall_",groupRedBall_)
    let result = historyList[i].redBall.length - (groupRedBall_.size - gsize);
    //console.log("--------------");
    //console.log("groupRedBall",grouplist);
    //console.log("groupRedBall_",groupRedBall_)
    //console.log(`与前${n}期比较有${result}个球重复-index${i}`);
    if (result < 2) {
      //console.log(`前${n}期组合为：：`,groupRedBall_);
      //console.log(`当期为：：`,historyList[i]);
      //console.log(`与前${n}期比较有${result}个球重复-index${i}`);
    }
    if (s[result]) {
      s[result]++;
    } else {
      s[result] = 1;
    }

    //console.log("--------------");
  }
  console.log(`统计结果：${historyList.length}期与前== ${n}期重复结果 ==`, s);
}
//比较随机与前n期重复数量
function compare(list = [], listHistory = []) {
  //console.log("1111",listHistory);
  let groupList = [];
  for (let i = 0; i < listHistory.length; i++) {
    groupList.push(...listHistory[i].redBall);
  }
  groupList = [...new Set(groupList)];
  //console.log("groupList",groupList);
  let newList = [...groupList, ...list];
  newList = [...new Set(newList)];
  //console.log("newList",newList);
  return list.length + groupList.length - newList.length;
}
function C1(list, history=ssqHistory) {
  let count1 = compare(list, history.slice(history.length - 1));
  let count2 = compare(list, history.slice(history.length - 2));
  let count3 = compare(list, history.slice(history.length - 3));
  let count4 = compare(list, history.slice(history.length - 4));
  let count5 = compare(list, history.slice(history.length - 5));
  let count6 = compare(list, history.slice(history.length - 6));
  let count7 = compare(list, history.slice(history.length - 7));
  //console.log("count:",count1,count2,count3,count4,count5);
  const s1 = count1 < 3;
  const s2 = count2 > 0 && count2 < 4;
  const s3 = count3 > 0 && count3 < 5;
  const s4 = count4 < 6 && count4 > 1;
  const s5 = count5 > 2 && count5 < 6;
  const s6 = count6 > 2;
  //console.log("SSS:",s1,s2,s3,s4)
  if (s1 && s2 && s3 && s4) {
    return true;
  }
  return false;
}
//zd ===在历史中开出过4，或5
function C2(list){
  const hlis = ssqHistory.slice(0,ssqHistory.length-1200);
    const f=hlis.find(lis=>{
     let newList = new Set([...lis.redBall,...list]);
     let repeatCount = lis.redBall.length + list.length - newList.size;
		 return repeatCount==4|| repeatCount==5;
  })
  return f?true:false;
}
//一定不出现的球
function C3(list,filterarr){
    const groupList =   new Set([...filterarr,...list]);
    return groupList.size == list.length+filterarr.length;

}
//定胆
function C4(list,dan=[]){
    const groupList = new Set([...list,...dan]);
    return groupList.size ==list.length;
}

function main(n=14){
    const dan =[5];
   const filterarr=ssqHistory[ssqHistory.length-1].redBall;
   //const filterarr=[]
    let thread =0;
    let result =[]
    while (thread < n) {
        const list = getRandomRedBall();
        if(C1(list)&&C2(list)&&C3(list,filterarr)&&C4(list,dan)){
             result.push({ redBall: list });
            thread++;
        }

    }
    console.log("result",result);
}
main();