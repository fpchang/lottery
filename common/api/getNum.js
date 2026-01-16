//不同彩票的购买买法
export function getNumList(start=1,amount=19,signPrice=2, max=20){
    let list=[];
   

    for(let i = 0;i<max;i++){
        if(list.length<1){
            list.push(start);
            continue;
        }
         let amountAll =0;
            list.map(item=>{
                 amountAll+=item*signPrice;
             });
         const s = amount-signPrice;
         const x = Math.ceil( amountAll/s);
         list.push(x);
    }
    return list;
}
//第index期开出奖荐后一共支出多少钱,利润，奖金
//index 第多少期开出，从1开始，numlist 买法，singleAmount 单注奖金金额
export function getProfitAmount(index=1,numList=[],singleAmount=19){
    let splitNulist = numList.slice(0,index);
    let costnum =0;//支出数量
     splitNulist.map(n=>{
        costnum+=n;
    });
    return {
        index:index,
        costNum:costnum,
        costAmount:costnum*2,
        lastNum:numList[index-1],
        singleAmount:singleAmount,
        bonusAmount:numList[index-1] *singleAmount,
        profitAmount:numList[index-1] *singleAmount - costnum*2
    }
}
try {
  const list= getNumList(1,19,4,30);
 console.log("获取购买票数",list);
} catch (error) {
    
}