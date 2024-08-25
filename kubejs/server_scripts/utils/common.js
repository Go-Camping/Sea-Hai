// priority: 950


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
 * @param {number} verticalOffset 
 * @param {isValidTarget} isValidTarget
 * @returns {[]Internal.BlockPos$MutableBlockPos}
 */
function FindNearBlocks(mob, searchRange, verticalSearchRange, verticalOffset, isValidTarget) {
    let blockPos = mob.blockPosition().offset(0, verticalOffset, 0);
    let mutableBlockPos = BlockPos.ZERO.mutable()
    let resBlockPosList = []

    // Y遍历
    for (let k = 0; k <= verticalSearchRange; k = k > 0 ? -k : 1 - k) {
        // X-Z遍历
        for (let l = 0; l < searchRange; ++l) {
            for (let i = 0; i <= l; i = i > 0 ? -i : 1 - i) {
                for (let j = i < l && i > -l ? l : 0; j <= l; j = j > 0 ? -j : 1 - j) {
                    mutableBlockPos.setWithOffset(blockPos, i, k - 1, j);
                    if (mob.isWithinRestriction(mutableBlockPos) && isValidTarget(mob.level, mutableBlockPos)) {
                        resBlockPosList.push(BlockPos.ZERO.mutable().setWithOffset(blockPos, i, k - 1, j))
                    }
                }
            }
        }
    }
    return resBlockPosList
}


/**
 * @callback isValidTarget
 * @param {Internal.LevelReader}
 * @param {BlockPos}
 * @returns {Boolean}
 */
/**
 * 在前进范围内寻找符合条件的方块
 * @param {Internal.PathfinderMob} mob 
 * @param {number} searchRange 
 * @param {number} verticalSearchRange 
 * @param {number} verticalOffset 
 * @param {isValidTarget} isValidTarget
 * @returns {[]Internal.BlockPos$MutableBlockPos}
 */
function FindDirectionNearBlocks(mob, searchRange, verticalSearchRange, verticalOffset, isValidTarget) {
    let blockPos = mob.blockPosition().offset(0, verticalOffset, 0);
    let mutableBlockPos = BlockPos.ZERO.mutable()
    let resBlockPosList = []

    // 粗略朝向方向
    let facing = mob.getFacing()
    let dz = facing.getZ()
    let dx = facing.getX()
    let dy = facing.getY()
    // 如果Y相关，那么全域搜索
    if (dy != 0) return FindNearBlocks(mob, searchRange, verticalSearchRange, verticalOffset, isValidTarget)

    // 遍历范围内的每个方块
    for (let k = 0; k <= verticalSearchRange; k = k > 0 ? -k : 1 - k) {
        // X-Z遍历
        if (dz == 0 && dx != 0) {
            // 如果Z方向为无关方向，那么X方向就是一个关键方向
            // 关键方向是优先级更高的方向
            for (let i = 0; i <= searchRange; i++) {
                for (let j = 0; j <= searchRange; j = j > 0 ? -j : 1 - j) {
                    mutableBlockPos.setWithOffset(blockPos, i * dx, k - 1, j);
                    if (mob.isWithinRestriction(mutableBlockPos) && isValidTarget(mob.level, mutableBlockPos)) {
                        resBlockPosList.push(BlockPos.ZERO.mutable().setWithOffset(blockPos, i * dx, k - 1, j))
                    }
                }
            }
        } else if (dz != 0 && dx == 0) {
            // 如果X方向为无关方向，那么Z方向就是一个关键方向
            for (let j = 0; j <= searchRange; j++) {
                for (let i = 0; i <= searchRange; i = i > 0 ? -i : 1 - i) {
                    mutableBlockPos.setWithOffset(blockPos, i, k - 1, j * dz);
                    if (mob.isWithinRestriction(mutableBlockPos) && isValidTarget(mob.level, mutableBlockPos)) {
                        resBlockPosList.push(BlockPos.ZERO.mutable().setWithOffset(blockPos, i, k - 1, j * dz))
                    }
                }
            }
        }
    }
    return resBlockPosList
}




/**
 * @callback isValidTarget
 * @param {Internal.LevelReader}
 * @param {BlockPos}
 * @returns {Boolean}
 */
/**
 * 在某个范围内寻找最近符合条件的方块
 * @param {Internal.PathfinderMob} mob 
 * @param {number} searchRange 
 * @param {number} verticalSearchRange 
 * @param {number} verticalOffset 
 * @param {isValidTarget} isValidTarget
 * @returns {Internal.BlockPos$MutableBlockPos}
 */
function FindNearestBlock(mob, searchRange, verticalSearchRange, verticalOffset, isValidTarget) {
    let blockPos = mob.blockPosition().offset(0, verticalOffset, 0);
    let mutableBlockPos = BlockPos.ZERO.mutable()

    // Y遍历
    for (let k = 0; k <= verticalSearchRange; k = k > 0 ? -k : 1 - k) {
        // X-Z遍历
        for (let l = 0; l < searchRange; ++l) {
            for (let i = 0; i <= l; i = i > 0 ? -i : 1 - i) {
                for (let j = i < l && i > -l ? l : 0; j <= l; j = j > 0 ? -j : 1 - j) {
                    mutableBlockPos.setWithOffset(blockPos, i, k - 1, j);
                    if (mob.isWithinRestriction(mutableBlockPos) && isValidTarget(mob.level, mutableBlockPos)) {
                        return mutableBlockPos
                    }
                }
            }
        }
    }
    return null
}


/**
 * @callback isValidTarget
 * @param {Internal.LevelReader}
 * @param {BlockPos}
 * @returns {Boolean}
 */
/**
 * 在前进范围内寻找最近符合条件的方块
 * @param {Internal.PathfinderMob} mob 
 * @param {number} searchRange 
 * @param {number} verticalSearchRange 
 * @param {number} verticalOffset 
 * @param {isValidTarget} isValidTarget
 * @returns {Internal.BlockPos$MutableBlockPos}
 */
function FindDirectionNearestBlock(mob, searchRange, verticalSearchRange, verticalOffset, isValidTarget) {
    let blockPos = mob.blockPosition().offset(0, verticalOffset, 0);
    let mutableBlockPos = BlockPos.ZERO.mutable()

    // 粗略朝向方向
    let facing = mob.getFacing()
    let dz = facing.getZ()
    let dx = facing.getX()
    let dy = facing.getY()
    // 如果Y相关，那么全域搜索
    if (dy != 0) return FindNearestBlock(mob, searchRange, verticalSearchRange, verticalOffset, isValidTarget)

    // 遍历范围内的每个方块
    for (let k = 0; k <= verticalSearchRange; k = k > 0 ? -k : 1 - k) {
        // X-Z遍历
        if (dz == 0 && dx != 0) {
            // 如果Z方向为无关方向，那么X方向就是一个关键方向
            // 关键方向是优先级更高的方向
            for (let i = 0; i <= searchRange; i++) {
                for (let j = 0; j <= searchRange; j = j > 0 ? -j : 1 - j) {
                    mutableBlockPos.setWithOffset(blockPos, i * dx, k - 1, j);
                    if (mob.isWithinRestriction(mutableBlockPos) && isValidTarget(mob.level, mutableBlockPos)) {
                        return mutableBlockPos
                    }
                }
            }
        } else if (dz != 0 && dx == 0) {
            // 如果X方向为无关方向，那么Z方向就是一个关键方向
            for (let j = 0; j <= searchRange; j++) {
                for (let i = 0; i <= searchRange; i = i > 0 ? -i : 1 - i) {
                    mutableBlockPos.setWithOffset(blockPos, i, k - 1, j * dz);
                    if (mob.isWithinRestriction(mutableBlockPos) && isValidTarget(mob.level, mutableBlockPos)) {
                        return mutableBlockPos
                    }
                }
            }
        }
    }
    return null
}