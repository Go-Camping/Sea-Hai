ItemEvents.rightClicked("minecraft:wooden_axe",event=>{
    let blk = event.player.rayTrace(32,false).block
    let a = new ShopPOIBlock(blk)
    a.calculateDecoration()
    event.level.tell(a.getSellType())
})