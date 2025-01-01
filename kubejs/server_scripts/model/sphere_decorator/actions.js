// priority: 850
/**
 * 生成紫颂果
 * @type {function(Internal.Level, SphereModel, BlockPos)}
 */
const GenChorusFruit = (level, sphere, offset) => {
    // todo 需要测试
    $ChorusFlowerBlock.generatePlant(level, sphere.center.offset(offset).above())
}

/**
 * 生成地牢房间
 * @type {function(Internal.Level, SphereModel, BlockPos)}
 */
const GenSquareDungeonRoom = (level, sphere, offset) => {
    let roomRadius = 1
    let roomPos = sphere.center.offset(offset)
    let wallBlock = Block.getBlock('minecraft:stone_bricks').defaultBlockState()
    for (let x = -roomRadius; x <= roomRadius; x++) {
        for (let z = -roomRadius; z <= roomRadius; z++) {
            level.setBlock(roomPos.offset(x, -roomRadius, z), wallBlock, 2)
            level.setBlock(roomPos.offset(x, roomRadius, z), wallBlock, 2)
        }
    }
    for (let y = -roomRadius; y <= roomRadius; y++) {
        for (let x = -roomRadius; x <= roomRadius; x++) {
            level.setBlock(roomPos.offset(x, y, -roomRadius), wallBlock, 2)
            level.setBlock(roomPos.offset(x, y, roomRadius), wallBlock, 2)
        }
    }
    for (let y = -roomRadius; y <= roomRadius; y++) {
        for (let z = -roomRadius; z <= roomRadius; z++) {
            level.setBlock(roomPos.offset(-roomRadius, y, z), wallBlock, 2)
            level.setBlock(roomPos.offset(roomRadius, y, z), wallBlock, 2)
        }
    }
}


/**
 * 生成竹子
 * @type {function(Internal.Level, SphereModel, BlockPos)}
 */
const GenBamboo = (level, sphere, offset) => {
    if (Math.random() < 0.2) {
        let abovePos = sphere.center.offset(offset).above()
        let saplingBlockState = Block.getBlock('minecraft:bamboo_sapling').defaultBlockState()
        level.setBlock(abovePos, saplingBlockState, 2)
    } else {
        let bambooHeight = Math.floor(Math.random() * 8 + 1)
        let curPos = sphere.center.offset(offset)
        let bambooBlockState = Block.getBlock('minecraft:bamboo').defaultBlockState()
        for (let i = 1; i < bambooHeight; i++) {
            let abovePos = curPos.above(i)
            if (i == 3 && bambooHeight < 5) {
                level.setBlock(abovePos, bambooBlockState.setValue($BambooStalkBlock.LEAVES, $BambooLeaves.NONE), 2)
            } else if (i > 4) {
                level.setBlock(abovePos, bambooBlockState.setValue($BambooStalkBlock.LEAVES, $BambooLeaves.LARGE), 2)
            } else if (i > 2) {
                level.setBlock(abovePos, bambooBlockState.setValue($BambooStalkBlock.LEAVES, $BambooLeaves.SMALL), 2)
            } else {
                level.setBlock(abovePos, bambooBlockState.setValue($BambooStalkBlock.LEAVES, $BambooLeaves.NONE), 2)
            }
        }
    }
}