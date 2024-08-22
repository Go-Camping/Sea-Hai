// priority: 1000


/**
 * @callback isValidTarget
 * @param {Internal.LevelReader}
 * @param {BlockPos}
 * @returns {Boolean}
 */
/**
 * 在某个范围内寻找符合条件的方块
 * @param {Internal.PathfinderMob} mob 
 * @param {number} searchRange 
 * @param {number} verticalSearchRange 
 * @param {number} verticalSearchStart 
 * @param {isValidTarget} isValidTarget
 * @returns {Internal.BlockPos$MutableBlockPos}
 */
function findNearestBlock(mob, searchRange, verticalSearchRange, verticalSearchStart, isValidTarget) {
    let j = verticalSearchRange;
    let blockPos = mob.blockPosition();
    let mutableBlockPos = new BlockPos().mutable()

    // Y遍历
    for (let k = verticalSearchStart; k <= j; k = k > 0 ? -k : 1 - k) {
        // X-Z遍历
        for (let l = 0; l < searchRange; ++l) {
            for (let i1 = 0; i1 <= l; i1 = i1 > 0 ? -i1 : 1 - i1) {
                for (let j1 = i1 < l && i1 > -l ? l : 0; j1 <= l; j1 = j1 > 0 ? -j1 : 1 - j1) {
                    mutableBlockPos.setWithOffset(blockPos, i1, k - 1, j1);
                    if (mob.isWithinRestriction(mutableBlockPos) && isValidTarget(mob.level, mutableBlockPos)) {
                        return mutableBlockPos
                    }
                }
            }
        }
    }
    return null
}