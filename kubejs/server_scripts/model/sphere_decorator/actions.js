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




/**
 * 生成花朵
 * @type {function(Internal.Level, SphereModel, BlockPos)}
 */
const GenFlower = (level, sphere, offset) => {
    let randomFlower = Block.getBlock(RandomGet(FlowerList)).defaultBlockState()
    let abovePos = sphere.center.offset(offset).above()
    level.setBlock(abovePos, randomFlower, 2)
}

