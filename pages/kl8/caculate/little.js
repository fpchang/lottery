import {
	historyKl8
} from "../../../common/kl8.js";

/**
 * 生成快乐8模拟开奖号
 * 10个分区、每区固定出2码、总计20码、去重升序
 */
function generateHappy8() {
  const zoneList = [];
  // 1. 划分10个区间 1~80
  for (let i = 0; i < 10; i++) {
    const start = i * 8 + 1;
    const end = (i + 1) * 8;
    zoneList.push({
      zone: i + 1,
      nums: Array.from({ length: 8 }, (_, idx) => start + idx)
    });
  }

  const result = [];

  // 2. 每个区随机抽取2个不重复号码
  for (const zone of zoneList) {
    const copy = [...zone.nums];
    const pick = [];
    // 随机取2个
    for (let i = 0; i < 1; i++) {
      const randomIdx = Math.floor(Math.random() * copy.length);
      pick.push(copy.splice(randomIdx, 1)[0]);
    }
    result.push(...pick);
  }

  // 3. 全局升序排序
  result.sort((a, b) => a - b);
  return result;
}



function getmaxrepeat(target=[]) {
  //const target = [3,4,8,19,31,33];
  //const target = [8,14,19,28,34,42,56,62,7,80];
  if(target.length!=10){
    throw new Error("目标不是10位")
  }
  let repeat = 0;
  historyKl8.map((item) => {
    const groupList = new Set([...item.redBall, ...target]);
    const sameNum = 30 - groupList.size;
    if(sameNum>repeat){
     // console.log(item)
    }
    repeat=Math.max(repeat,sameNum);
  });
  //console.log("rr",repeat);
  return repeat;
}

// 调用测试
// const openNum = generateHappy8();
// console.log("快乐8模拟开奖号码：");
// console.log(openNum);
// console.log("开出总数：", openNum.length);
let result =null;
let num=0;
while(num<20){
    const openNum = generateHappy8();
    const repeat = getmaxrepeat(openNum);
    if(repeat<7){  
        num++;
        result=openNum;
        console.log("符合条件的",openNum)
    }
}
