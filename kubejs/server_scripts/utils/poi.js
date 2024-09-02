// priority: 900
/**
 * 在一定范围内寻找可用的POI
 * @param {Internal.PathfinderMob} mob 
 * @param {number} dist 
 * @returns {Internal.BlockPos$MutableBlockPos[]}
 */
function FindAheadPOIs(mob, dist, secondaryRange) {
    let blockPosList = FindDirectionNearBlocks(mob, dist, secondaryRange, 3, -1, (level, blockPos) => {
        return level.getBlockState(blockPos).tags.anyMatch(tag => tag.equals(POI_ENTRANCE))
    })
    return blockPosList
}

/**
 * 在一定范围内寻找吸引力方块
 * @param {Internal.PathfinderMob} mob 
 * @param {number} dist 
 * @returns {Internal.BlockPos$MutableBlockPos[]}
 */
function FindAroundAttractiveBlocks(mob, dist) {
    let blockPosList = FindNearBlocks(mob, dist, 3, -1, (level, blockPos) => {
        return level.getBlockState(blockPos).tags.anyMatch(tag => tag.equals(ATTRACTIVE_BLOCK))
    })
    return blockPosList
}