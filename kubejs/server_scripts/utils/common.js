// priority: 1000

/**
 * 从数组中随机获取一个元素
 * 如果数组为空或未定义，则返回 null
 * @param {any[]} array 
 * @returns {any}
 */
function RandomGet(list) {
    if (!list || list.length == 0) return null
    let index = Math.floor(Math.random() * list.length)
    return list[index]
}

/**
 * 对给定的数值进行四舍五入操作，并保留指定的小数位数
 * @param {number} value 
 * @param {number} n 
 * @returns {number}
 */
function RoundFix(value, n) {
    return Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
}


/**
 * 对给定的数值进行下取整操作，并保留指定的小数位数
 * @param {number} value 
 * @param {number} n 
 * @returns {number}
 */
function FloorFix(value, n) {
    return Math.floor(value * Math.pow(10, n)) / Math.pow(10, n);
}

/**
 * 洗牌算法
 * @param {any[]} a 
 * @returns {any[]}
 */
function Shuffle(arr) {
    var length = arr.length,
        temp,
        random;
    while (0 != length) {
        random = Math.floor(Math.random() * length)
        length--;
        // swap
        temp = arr[length];
        arr[length] = arr[random];
        arr[random] = temp;
    }
    return arr;
}

/**
 * 数组交集
 * @param {any[]} arr1 
 * @param {any[]} arr2 
 * @returns {any[]}
 */
function Intersect(arr1, arr2) {
    return arr1.filter(function (value) {
        return arr2.indexOf(value) > -1
    })
}


/**
 * 非重取出
 * @param {any[]} arr
 * @param {number} count
 * @returns {any[]}
 */
function RandomGetN(arr, count) {
    let arrCopy = arr.slice()
    if (count >= arrCopy.length) {
        let concatTimes = count / arrCopy.length
        for (let i = 0; i < concatTimes; i++) {
            arrCopy.concat(arr)
        }
    }
    Shuffle(arrCopy)
    return arrCopy.slice(0, count)
}


/**
 * 权重随机对象
 * @param {any} obj 
 * @param {Number} weight
 * @returns 
 */
function WeightRandomItem(obj, weight) {
    this.obj = obj
    this.weight = weight
    this.startWeight = 0
    this.endWeight = 0
}

function WeightRandomModel() {
    this.weightRandomList = []
}
WeightRandomModel.prototype = {
    addWeightRandom: function (obj, weight) {
        this.weightRandomList.push(new WeightRandomItem(obj, weight))
        return this
    },
    getWeightRandomObj: function () {
        let totalWeight = this.weightRandomList.reduce(function (pre, cur, index) {
            cur.startWeight = pre
            return cur.endWeight = pre + cur.weight
        }, 0)
        let random = Math.ceil(Math.random() * totalWeight)
        let randomObj = this.weightRandomList.find(weightObj => weightObj.startWeight < random && weightObj.endWeight >= random)
        return randomObj.obj
    }
}


/**
 * 幸运重roll
 * @param {number} luck 
 * @returns 
 */

function RandomWithLuck(luck, luckThreshold) {
    let randomList = []
    if (luck > 0) {
        for (let i = 0; i < luck / luckThreshold; i++) {
            randomList.push(Math.random())
        }
        if (luck % luckThreshold > 0 && luck % luckThreshold > Math.random() * luckThreshold) {
            randomList.push(Math.random())
        }
    } else {
        randomList.push(Math.random())
    }
    return Math.max.apply(null, randomList)
}


function RandomWithPlayerLuck(player) {
    let luckDeity = 10
    let luck = player.luck
    if (player.hasEffect('kubejs:luck_deity')) {
        luckDeity = Math.max(9 - player.getEffect('kubejs:luck_deity').getAmplifier(), 2)
    }
    return RandomWithLuck(luck, luckDeity)
}