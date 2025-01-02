// priority: 500

// todo 调试方法
ItemEvents.rightClicked('stick', event => {
    let player = event.player
    let level = event.level
    let tempSphere = new FluidSphereModel().addDecorator(UpShellFlowerDecorator)
    tempSphere.generateSphere(level, player.block.getPos().atY(100))
})