// priority: 1000
/**
 * @callback isValidTarget
 * @param {Internal.LevelReader}
 * @param {BlockPos}
 * @returns {Boolean}
 */
/**
 * 在某个范围内寻找符合条件的方块
 * @param {Internal.BlockContainerJS} block 
 * @param {number} searchRange 
 * @param {number} verticalSearchRange 
 * @param {isValidTarget} isValidTarget
 * @returns {Internal.BlockPos$MutableBlockPos[]}
 */
function FindBlockAroundBlocks(block, searchRange, verticalSearchRange, isValidTarget) {
    let mutableBlockPos = BlockPos.ZERO.mutable()
    let blockPos = block.pos
    let resBlockPosList = []

    // Y遍历
    for (let k = 0; k <= verticalSearchRange; k = k > 0 ? -k : 1 - k) {
        // X-Z遍历
        for (let l = 0; l < searchRange; ++l) {
            for (let i = 0; i <= l; i = i > 0 ? -i : 1 - i) {
                for (let j = i < l && i > -l ? l : 0; j <= l; j = j > 0 ? -j : 1 - j) {
                    mutableBlockPos.setWithOffset(blockPos, i, k, j);
                    if (isValidTarget(block.level, mutableBlockPos)) {
                        resBlockPosList.push(BlockPos.ZERO.mutable().setWithOffset(blockPos, i, k, j))
                    }
                }
            }
        }
    }
    return resBlockPosList
}