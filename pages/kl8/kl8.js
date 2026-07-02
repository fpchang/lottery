import {
	historyKl8
} from "../../common/kl8.js";

const history = historyKl8;
const BALL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
	30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
	58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80
]


/**
 * 快乐8算法：统计历史开奖中选2-10组合的出现次数并排序
 * @param {Array<Array<number>>} historyData - 历史开奖数据，每个元素是20个开奖号的数组（1-80，不重复）
 * @param {Object} options - 配置项
 * @param {boolean} options.isDesc - 是否降序排序，默认true
 * @param {Array<number>} options.selectNums - 要统计的选号数，默认[2,3,4,5,6,7,8,9,10]
 * @returns {Object} 统计结果：按选号数分类的组合统计、开奖期数、各选号数的总组合数
 */
function happy8Statistics(historyData, options = {}) {
	const {
		isDesc = true,
			selectNums = [2, 3, 4, 5, 6, 7, 8, 9, 10]
	} = options;

	// 验证选号数合法性（2-10之间的整数，且不超过开奖号数量20）
	const validSelectNums = selectNums.filter(num => Number.isInteger(num) && num >= 2 && num <= 20);
	if (validSelectNums.length === 0) {
		throw new Error('选号数需为2-20之间的整数');
	}

	// 初始化统计容器：key为`select${n}`，value为统计Map
	const statMapContainer = {};
	validSelectNums.forEach(num => {
		statMapContainer[`select${num}`] = new Map();
	});

	/**
	 * 生成组合的核心函数（递归+剪枝）
	 * @param {Array<number>} arr - 源数组（已排序）
	 * @param {number} k - 选k个元素
	 * @returns {Array<Array<number>>} 所有k元素组合
	 */
	function combination(arr, k) {
		const result = [];
		const backtrack = (start, path) => {
			if (path.length === k) {
				result.push([...path]);
				return;
			}
			// 剪枝：剩余元素不足时停止递归，i <= arr.length - (k - path.length)
			for (let i = start; i <= arr.length - (k - path.length); i++) {
				path.push(arr[i]);
				backtrack(i + 1, path);
				path.pop();
			}
		};
		backtrack(0, []);
		return result;
	}

	/**
	 * 标准化组合为字符串（数字升序拼接，确保唯一性）
	 * @param {Array<number>} combo - 组合数组
	 * @returns {string} 标准化的组合字符串
	 */
	function normalizeCombo(combo) {
		return combo.sort((a, b) => a - b).join(',');
	}

	/**
	 * 处理单期开奖数据，生成所有指定选号数的组合并统计
	 * @param {Array<number>} drawNumbers - 单期20个开奖号
	 */
	function processSingleDraw(drawNumbers) {
		// 开奖号先排序，确保组合生成的一致性
		const sortedDraw = drawNumbers.slice().sort((a, b) => a - b);
		// 遍历所有要统计的选号数
		validSelectNums.forEach(selectNum => {
			const combos = combination(sortedDraw, selectNum);
			const map = statMapContainer[`select${selectNum}`];
			// 统计每个组合的出现次数
			combos.forEach(combo => {
				const key = normalizeCombo(combo);
				map.set(key, (map.get(key) || 0) + 1);
			});
		});
	}

	// 遍历所有历史开奖数据，逐期处理
	historyData.forEach(processSingleDraw);

	/**
	 * 将统计Map转换为排序后的结果数组
	 * @param {Map} map - 统计Map
	 * @returns {Array<{combo: string, count: number, numbers: number[]}>} 排序后的结果
	 */
	function convertMapToResult(map) {
		return Array.from(map)
			.map(([comboStr, count]) => ({
				combo: comboStr,
				count,
				numbers: comboStr.split(',').map(Number)
			}))
			.sort((a, b) => isDesc ? b.count - a.count : a.count - b.count);
	}

	// 生成最终统计结果
	const finalResult = {
		totalDraws: historyData.length, // 历史开奖总期数
		totalCombos: {} // 各选号数的不同组合总数
	};
	validSelectNums.forEach(num => {
		const key = `select${num}`;
		const map = statMapContainer[key];
		finalResult[key] = convertMapToResult(map);
		finalResult.totalCombos[key] = map.size;
	});

	return finalResult;
}



function getRandomRedBall(len = 80) {
	let result = [];
	while (result.length < 20) {
		const random = Math.ceil(Math.random() * len)
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
//比较随机与前n期重复数量
function compare(list = [], listHistory = []) {
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

function getWinTime(list, listHistory) {
	let result = {};
	for (let i = 0; i < listHistory.length; i++) {
		let itemList = listHistory[i].redBall;
		let groupList = new Set([...list, ...itemList]);
		let time = itemList.length + list.length - groupList.size;
		if (result[time]) {
			result[time]++
		} else {
			result[time] = 1;
		}
	}
	console.log(`在${listHistory.length}期历史中中奖次数为：`, result);
}
//获取数据组合去重排序
function getGroupList(listHistory) {
	let groupList = []
	for (let i = 0; i < listHistory.length; i++) {
		groupList.push(...listHistory[i].redBall)
	}
	groupList = [...new Set(groupList)];
	groupList.sort((a, b) => a - b);
	return groupList;
}
//console.log(getRandomRedBall());
//sameHistory(2,history);
//与所有历史数据相比 基本在【2，8】之间
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
//红球算法 与前几期比较
//前1期重复【3，7】
//前2期重复【6，11】
//前3期重复【9，14】
//前4期重复【11，16】
//前5期重复【13，19】
//前6期重复【15，19】
//前7期重复【16，19】
//前8期重复【17，20】

function S1(list, history) {
	let count1 = compare(list, history.slice(history.length - 1));
	let count2 = compare(list, history.slice(history.length - 2));
	let count3 = compare(list, history.slice(history.length - 3));
	let count4 = compare(list, history.slice(history.length - 4));
	let count5 = compare(list, history.slice(history.length - 5));
	let count6 = compare(list, history.slice(history.length - 6));
	let count7 = compare(list, history.slice(history.length - 7));
	let count8 = compare(list, history.slice(history.length - 8));
	//console.log("count:",count1,count2,count3,count4,count5,count6,count7,count8);
	const s1 = count1 > 2 && count1 < 8;
	const s2 = count2 > 5 && count2 < 12;
	const s3 = count3 > 8 && count3 < 15;
	const s4 = count4 > 10 && count4 < 17;
	const s5 = count5 > 12 && count5 < 20;
	const s6 = count6 > 14 && count6 < 20;
	const s7 = count7 > 15 && count7 < 20;
	const s8 = count8 > 16;
	//const s = S0(list,history);
	
	if (s1 & s2 && s3 && s4 && s5 && s6 && s7 && s8) {
		return true
	}
	return false;
}

function S1_stat(list) {
	let s = {};
	for (let i = 0; i < list.length; i++) {
		let arr = list[i].redBall;
		for (let j = 0; j < arr.length; j++) {
			if (s[arr[j].toString()]) {
				s[arr[j].toString()]++;
			} else {
				s[arr[j].toString()] = 1
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
function S2(list, history) {
	let count2 = compare(list, history.slice(history.length - 2));
	let count3 = compare(list, history.slice(history.length - 3));
	let count4 = compare(list, history.slice(history.length - 4));
	let count7 = compare(list, history.slice(history.length - 7));
	if (count4 == 0 && count7 < 3) {

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
function S3(list, history) {
	let count2 = compare(list, history.slice(history.length - 2));
	let count3 = compare(list, history.slice(history.length - 3));
	let count4 = compare(list, history.slice(history.length - 4));
	let count5 = compare(list, history.slice(history.length - 5));
	let count7 = compare(list, history.slice(history.length - 7));
	if (count5 == 0 && count7 < 3) {

		return true;
	}
	return false;
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
      console.log(item)
    }
    repeat=Math.max(repeat,sameNum);
  });
  console.log("rr",repeat);
  return repeat;
}

//计算历史开奖中中奖率最高的组合
//n 代表买几，1-10
function S5(n = 4, minNum = 5) {
	// ------------------- 示例测试 -------------------
	// 模拟3期快乐8开奖数据（每期20个不重复的1-80数字）
	// const mockHistoryData = [
	// 	[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], // 第1期
	// 	[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21], // 第2期
	// 	[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 21, 22] // 第3期
	// ];
	const mockHistoryData=history.map(item=>item.redBall);
	try {
		// 执行统计（指定统计选2-10，也可自定义如[2,5,10]）
		const statResult = happy8Statistics(mockHistoryData, {
			isDesc: true, // 降序排序
			selectNums: [10]
		});

		// 输出整体统计信息
		console.log('快乐8统计总览：', {
			"开奖总期数": statResult.totalDraws,
			"各选号数不同组合数": statResult.totalCombos
		});

		// 输出选2组合的TOP5
		//console.log('\n选2组合TOP5：', statResult.select2.slice(0, 5));
		// 输出选10组合的TOP5
		console.log('\n选10组合TOP5：', statResult.select10.slice(0, 5));
		// 输出选5组合的TOP5
		//console.log('\n选5组合TOP5：', statResult.select5.slice(0, 5));
	} catch (error) {
		console.error('统计失败：', error.message);
	}

}

function caculate(fn, n = 20) {
console.log(222222)

	let thread = 0;
	let result = [];
	while (thread < n) {
		let list = getRandomRedBall();
		//console.log(list);
		if (fn(list, history)) {
			result.push({
				redBall: list
			})
			thread++;
		}
	}
	return result;
}
//结果 与前2期最多重复2，与前3期最多重复3,前4期最多3
console.log(caculate(S1,14));
