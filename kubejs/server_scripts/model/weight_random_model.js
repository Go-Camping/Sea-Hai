// priority: 900

/**
 * 权重随机对象
 * @param {any} obj 
 * @param {Number} weight
 * @returns 
 */
function WeightRandom(obj, weight) {
    this.obj = obj
    this.weight = weight
    this.startWeight = 0
    this.endWeight = 0
}

/**
 * @param {WeightRandom[]} p 
 * @returns 
 */
function GetWeightRandomObj(p) {
    let totalWeight = p.reduce(function (pre, cur, index) {
      cur.startWeight = pre;
      return cur.endWeight = pre + cur.weight
    }, 0)
    let random = Math.ceil(Math.random() * totalWeight)
    let randomObj = p.find(weightObj => weightObj.startWeight < random && weightObj.endWeight >= random)
    return randomObj.obj
}