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
function Shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i)
        [a[i - 1], a[j]] = [a[j], a[i - 1]]
    }
    return a
}