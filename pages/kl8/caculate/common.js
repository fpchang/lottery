/**
 * 公共方法
 */
//比较随机与前n期重复数量
export function compare(list = [], listHistory = []) {
	let groupList = []
	for (let i = 0; i < listHistory.length; i++) {
		groupList.push(...listHistory[i].redBall)
	}
	groupList = [...new Set(groupList)];
	//console.log("groupList",groupList);
	let newList = [...groupList, ...list];
	newList = [...new Set(newList)];
	//console.log("newList",newList);
	return list.length + groupList.length - (newList.length);
}

//与历史开奖组合重合数量
export function sameHistory(n = 2, historyList = []){
	const getGroupBall = (index) => {
		let groupRedBall = [];
		for (let i = index - n; i < index; i++) {
			groupRedBall.push(...historyList[i].redBall)
		}
		groupRedBall.sort((a, b) => a - b);
		groupRedBall = new Set(groupRedBall);
		//console.log("groupRedBall",groupRedBall);
		return groupRedBall;
	}
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
		//console.log(`与前${n}期比较有${result}个球重复-index${historyList[i].index}`);
		if (result < 1) {
			//console.log(`前${n}期组合为：：`,groupRedBall_);
			//console.log(`当期为：：`,historyList[i].index);
			//console.log(`与前${n}期比较有${result}个球重复-index${i}`);
		}
		if (s[result]) {
			s[result]++;
		} else {
			s[result] = 1;
		}

		//console.log("--------------");

	}
	console.log(`统计结果：${historyList.length}期与前== ${n}期重复结果 ==`, s)
}