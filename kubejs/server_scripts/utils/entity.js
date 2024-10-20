// priority: 1000
/**
 * @callback isValidTarget
 * @param {Internal.Level}
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
 * @returns {Internal.BlockPos$MutableBlockPos[]}
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
                    mutableBlockPos.setWithOffset(blockPos, i, k, j);
                    if (mob.isWithinRestriction(mutableBlockPos) && isValidTarget(mob.level, mutableBlockPos)) {
                        resBlockPosList.push(BlockPos.ZERO.mutable().setWithOffset(blockPos, i, k, j))
                    }
                }
            }
        }
    }
    return resBlockPosList
}


/**
 * 在前进范围内寻找符合条件的方块
 * @param {Internal.PathfinderMob} mob 
 * @param {number} searchRange 
 * @param {number} secondaryRange
 * @param {number} verticalSearchRange 
 * @param {number} verticalOffset 
 * @param {isValidTarget} isValidTarget
 * @returns {Internal.BlockPos$MutableBlockPos[]}
 */
function FindDirectionNearBlocks(mob, searchRange, secondaryRange, verticalSearchRange, verticalOffset, isValidTarget) {
    let blockPos = mob.blockPosition().offset(0, verticalOffset, 0);
    let mutableBlockPos = BlockPos.ZERO.mutable()
    let resBlockPosList = []

    // 粗略朝向方向
    let facing = mob.getHorizontalFacing()
    let dz = facing.getZ()
    let dx = facing.getX()
    // 遍历范围内的每个方块
    for (let k = 0; k <= verticalSearchRange; k = k > 0 ? -k : 1 - k) {
        // X-Z遍历
        if (dz == 0 && dx != 0) {
            // 如果Z方向为无关方向，那么X方向就是一个关键方向
            // 关键方向是优先级更高的方向
            for (let i = 0; i <= searchRange; i++) {
                // 次级范围，在寻找对应方向的方块时，对于非关键方向的视线有限
                for (let j = 0; j <= secondaryRange; j = j > 0 ? -j : 1 - j) {
                    mutableBlockPos.setWithOffset(blockPos, i * dx, k, j);
                    if (mob.isWithinRestriction(mutableBlockPos) && isValidTarget(mob.level, mutableBlockPos)) {
                        resBlockPosList.push(BlockPos.ZERO.mutable().setWithOffset(blockPos, i * dx, k, j))
                    }
                }
            }
        } else if (dz != 0 && dx == 0) {
            // 如果X方向为无关方向，那么Z方向就是一个关键方向
            for (let j = 0; j <= searchRange; j++) {
                for (let i = 0; i <= secondaryRange; i = i > 0 ? -i : 1 - i) {
                    mutableBlockPos.setWithOffset(blockPos, i, k, j * dz);
                    if (mob.isWithinRestriction(mutableBlockPos) && isValidTarget(mob.level, mutableBlockPos)) {
                        resBlockPosList.push(BlockPos.ZERO.mutable().setWithOffset(blockPos, i, k, j * dz))
                    }
                }
            }
        }
    }
    return resBlockPosList
}




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
                    mutableBlockPos.setWithOffset(blockPos, i, k, j);
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
    let facing = mob.getHorizontalFacing()
    let dz = facing.getZ()
    let dx = facing.getX()

    // 遍历范围内的每个方块
    for (let k = 0; k <= verticalSearchRange; k = k > 0 ? -k : 1 - k) {
        // X-Z遍历
        if (dz == 0 && dx != 0) {
            // 如果Z方向为无关方向，那么X方向就是一个关键方向
            // 关键方向是优先级更高的方向
            for (let i = 0; i <= searchRange; i++) {
                for (let j = 0; j <= searchRange; j = j > 0 ? -j : 1 - j) {
                    mutableBlockPos.setWithOffset(blockPos, i * dx, k, j);
                    if (mob.isWithinRestriction(mutableBlockPos) && isValidTarget(mob.level, mutableBlockPos)) {
                        return mutableBlockPos
                    }
                }
            }
        } else if (dz != 0 && dx == 0) {
            // 如果X方向为无关方向，那么Z方向就是一个关键方向
            for (let j = 0; j <= searchRange; j++) {
                for (let i = 0; i <= searchRange; i = i > 0 ? -i : 1 - i) {
                    mutableBlockPos.setWithOffset(blockPos, i, k, j * dz);
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
 * 获取生物状态
 * @param {Internal.PathfinderMob} mob 
 * @returns 
 */
function GetEntityStatus(mob) {
    if (mob.persistentData.contains('status')) {
        return mob.persistentData.getString('status')
    }
    return STATUS_NONE
}

/**
 * 设置生物状态，如果状态没有变更，则不进行设置（这影响到旧状态列表的维护）
 * @param {Internal.PathfinderMob} mob 
 * @param {string} status
 */
function SetEntityStatus(mob, status) {
    mob.persistentData.putString('status', status)
    return
}

/**
 * 获取生物Position，并且输出对应的BlockPos
 * @param {Internal.PathfinderMob} mob 
 * @param {BlockPos} status
 */
function GetEntityPosition(mob) {
    let pos = mob.getPosition(1.0)
    return new BlockPos(pos.x(), pos.y(), pos.z())
}


/**
 * 
 * @param {Internal.PathfinderMob} mob 
 * @param {BlockPos} pos 
 * @param {Number} speed 
 * @returns 
 */
function NavigateWithDegrade(mob, pos, speed) {
    if (!pos) return false
    let navigation = mob.getNavigation()
    if (!navigation.isInProgress() || !navigation.targetPos.equals(pos)) {
        console.log('NavigateWithDegrade: move')
        navigation.moveTo(pos.x, pos.y, pos.z, speed)
        return true
    }
    if (navigation.isStuck()) {
        console.log('NavigateWithDegrade: degrade tp')
        mob.teleportTo(pos.x, pos.y, pos.z)
        navigation.recomputePath()
        return true
    }
    // if (!navigation.getPath().canReach()) {
    //     console.log('NavigateWithDegrade: recompute')
    //     navigation.recomputePath()
    //     return true
    // }
    return true
}

// ItemEvents.entityInteracted('minecraft:blaze_powder', event => {
//     let target = event.target
//     let player = event.player
//     let pos = GetEntityPosition(target)
//     if (target instanceof $EntityCustomNpc) {
//         let list = target.ais.getMovingPath()
//         list.add([pos.getX(), pos.getY(), pos.getZ()])
//         target.ais.setMovingPath(list)
//         target.ais.setMovingPos(0)
// target.ais.setAnimation(11)
//         player.tell(target.ais.getMovingPath().toString())
//     }
// })