// priority: 850
/** 
 * 判断是否为上球壳
 * @type {function(BlockPos)}
 */
const IsUpShell = (level, sphere, offset) => {
    return offset.y >= 0
}

/** 
 * 判断是否为下球壳
 * @type {function(BlockPos)}
 */
const IsDownShell = (offset) => {
    return offset.y <= 0
}

/**
 * 球壳内房间生成
 * @type {function(SphereModel, BlockPos)}
 */
const CanGenRoomInShell = (sphere, offset) => {
    // 球壳太小则不进行生成
    if (sphere.shellRadius < 10) {
        return false
    }
    // 房间生成距离为5，排除球心点
    if ((offset.x % 5 == 0 || offset.z % 5 == 0) && (offset.x != 0 && offset.z != 0)) {
        return true
    }
    return false
}

/**
 * 概率生成
 * @type {function(number)}
 */
const RandomChance = (chance) => {
    return Math.random() < chance
}

/**
 * 方块上方为空
 * @type {function(Internal.Level, SphereModel, BlockPos)}
 */
const IsUpEmpty = (level, sphere, offset) => {
    return level.getBlockState(sphere.center.offset(offset).above()).isAir()
}