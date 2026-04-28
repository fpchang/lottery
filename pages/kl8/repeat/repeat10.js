// Analyze top repeated Choose-10 combinations & their gaps
import { historyKl8 } from "../../../common/kl8.js";
function getRandomRedBall(len = 80) {
	let result = [];
	while (result.length < 10) {
		const random = Math.ceil(Math.random() * len)
		let list = [...result];
		list.push(random);
		result = [...new Set(list)];
	}
	result.sort((a, b) => a - b);
	return result;
}


let minrepeatobject ={
  count:10,
  target:null
};
for(let i = 0;i<10000000;i++){
const ran=getRandomRedBall();
//console.log("ran",ran);
let max =0;
historyKl8.map(item=>{
  if(max!=10){
    const group=new Set([...ran,...item.redBall]);
    const repeat =30 - group.size;
    max = Math.max(max,repeat);
  }
  
})

 if(max<minrepeatobject.count){
  minrepeatobject={
    count:max,
    target:ran
  }
  console.log("new ",minrepeatobject)
 }
}
