// priority: 500

// todo 调试方法
ItemEvents.rightClicked('stick', event => {
    let player = event.player
    let res = []
    player.inventory.allItems.forEach(itemStack => {
        let item = itemStack.getItem()
        if (item instanceof $BucketItem) {
            res.push(item.getFluid().fluidType)
        }
    })
    // let tempSphere = new GeodeSphereModel()
    // .addVein(Block.getBlock('minecraft:diamond_block').defaultBlockState(), 23, 'cloud')
    // .setFillBlock(Block.getBlock('minecraft:glass').defaultBlockState())
    // .setShellProperties(Block.getBlock('minecraft:glass').defaultBlockState(), 24, 1)
    // tempSphere.generateSphere(level, player.block.getPos().atY(100))
})