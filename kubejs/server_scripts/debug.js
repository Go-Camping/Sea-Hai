// priority: 500

// todo 调试方法
ItemEvents.rightClicked('stick', event => {
    let player = event.player
    let level = event.level

    // let tempSphere = new RingSphereModel()
    // .addDecorator(GlobalSetBiomeDecorator)
    // .setShellProperties(Block.getBlock('minecraft:stone').defaultBlockState(), 8, 1)
    // .addRingProperties(Block.getBlock('minecraft:grass_block').defaultBlockState(), 25, 2, JavaMath.PI / 3, 2 * JavaMath.PI / 3)
    // tempSphere.generateSphere(level, player.block.getPos().atY(100).offset(1000, 0, 1000))
    Utils.rollChestLoot('kubejs:crab_pot/water_crab_bait').forEach(item => {
        player.give(item)
    })
})