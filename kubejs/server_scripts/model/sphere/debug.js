// priority: 500

// todo 调试方法
ItemEvents.rightClicked('stick', event => {
    let player = event.player
    let level = event.level
    let tempSphere = new RingSphereModel().addRingProperties(Block.getBlock('minecraft:dirt').defaultBlockState(), 20, 3, 0, 0)
    tempSphere.generateSphere(level, player.block.getPos().atY(100))
})