// priority: 900
/**
 * 在一定范围内寻找可用的POI
 * @param {Internal.PathfinderMob} mob 
 * @param {number} dist 
 * @returns {Internal.BlockPos$MutableBlockPos[]}
 */
function FindAheadPOIs(mob, dist, secondaryRange) {
    let blockPosList = FindDirectionNearBlocks(mob, dist, secondaryRange, 3, -1, (level, blockPos) => {
        return level.getBlockState(blockPos).tags.anyMatch(tag => tag.equals(TAG_POI_ENTRANCE))
    })
    return blockPosList
}