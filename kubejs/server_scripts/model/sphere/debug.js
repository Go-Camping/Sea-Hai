// priority: 500

// todo 调试方法
ItemEvents.rightClicked('stick', event => {
    let player = event.player
    let level = event.level

    let tempSphere = new RingSphereModel()
    .addDecorator(RingFlowerDecorator)
    .setShellProperties(Block.getBlock('minecraft:stone').defaultBlockState(), 8, 1)
    // .addRingProperties(Block.getBlock('minecraft:gold_block').defaultBlockState(), 20, 2, JavaMath.PI / 4, JavaMath.PI / 2)
    .addRingProperties(Block.getBlock('minecraft:grass_block').defaultBlockState(), 25, 2, JavaMath.PI / 3, 2 * JavaMath.PI / 3)
    // .addRingProperties(Block.getBlock('minecraft:diamond_block').defaultBlockState(), 30, 2, JavaMath.PI / 6, 0)
    // .addRingProperties(Block.getBlock('minecraft:emerald_block').defaultBlockState(), 35, 2, JavaMath.PI / 12, 0)
    tempSphere.generateSphere(level, player.block.getPos().atY(100))
})