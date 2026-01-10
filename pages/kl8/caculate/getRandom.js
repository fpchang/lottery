export function getRandomRedBall(len=80){
	let result = [];
	while (result.length < 20) {
		 const randomNum = Math.floor(Math.random() * 80) + 1;
		        
		        // 检查号码是否已存在，不存在则加入数组
		        if (!result.includes(randomNum)) {
		            result.push(randomNum);
		        
				}
		}
	result.sort((a, b) => a - b);
	return result;
}

export function generateHappy8Numbers(mustHaveNumbers = []) {
    // ========== 第一步：将字符串数组转换为数字数组 ==========
    let numArray = [];
    if (mustHaveNumbers.length > 0) {
        numArray = mustHaveNumbers.map(item => {
            // 先转成字符串再去除首尾空格（处理 " 8 " 这类带空格的情况）
            const str = String(item).trim();
            // 转换为数字，失败则返回 NaN
            const num = Number(str);
            return num;
        });

        // 检查是否有转换失败的情况（比如传入 "abc" 这类非数字字符串）
        const hasNaN = numArray.some(num => isNaN(num));
        if (hasNaN) {
            throw new Error("必出号码包含非数字内容！请传入1-80之间的数字或数字字符串");
        }
    }

    // ========== 第二步：校验必出号码的合法性 ==========
    // 1. 检查必出号码数量不能超过20个
    if (numArray.length > 20) {
        throw new Error("必出号码数量不能超过20个！");
    }
    // 2. 检查必出号码是否无重复
    const uniqueCheck = [...new Set(numArray)];
    if (uniqueCheck.length !== numArray.length) {
        throw new Error("必出号码不能包含重复数字！");
    }
    // 3. 检查必出号码是否在1-80范围内
    const validRange = (num) => num >= 1 && num <= 80;
    if (!numArray.every(validRange)) {
        throw new Error("必出号码必须是1-80之间的整数！");
    }

    // ========== 第三步：初始化最终号码数组（先加入必出号码） ==========
    const selectedNumbers = [...numArray];

    // ========== 第四步：随机补充剩余号码（确保不重复、不超出范围） ==========
    const needToAdd = 20 - selectedNumbers.length;
    while (selectedNumbers.length < 20) {
        const randomNum = Math.floor(Math.random() * 80) + 1;
        if (!selectedNumbers.includes(randomNum)) {
            selectedNumbers.push(randomNum);
        }
    }

    // ========== 第五步：排序并返回 ==========
    selectedNumbers.sort((a, b) => a - b);
    return selectedNumbers;
}
