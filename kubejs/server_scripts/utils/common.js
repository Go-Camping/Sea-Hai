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

