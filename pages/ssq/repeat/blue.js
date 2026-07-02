const his=[2,15,2,16,13,4];
const hisstr= his.join(",");
function getRandom1To16() {
  return Math.floor(Math.random() * 16) + 1;
}
function getRandomList(){
const list=[];
for (let i = 0; i < his.length+1; i++) {
  //console.log(getRandom1To16());
  list.push(getRandom1To16());
}
return list;
}


let ranomList = getRandomList();

let liststr = ranomList.slice(0,his.length).join(",");
while(hisstr!=liststr){
    ranomList=getRandomList();
    liststr = ranomList.slice(0,his.length).join(",");
}
console.log("result",ranomList);