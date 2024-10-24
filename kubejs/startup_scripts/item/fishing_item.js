StartupEvents.registry('item', event => {
    event.createCustom('newer_bobber', () => new $DyeableItem(15532048))
    event.createCustom('newer_fishing_line', () => new $DyeableItem(1))
    new $HookBuilder('newer').setModID("kubejs").setColor($ChatFromatting.GRAY).setWeight(new Vec3d(0.8, 1, 0.8)).build()
    event.createCustom('newer_bait', () => $AquacultureAPI.createBait(20, 1))
})


ClientEvents.init(event => {
    let itemColor = Client.instance.getItemColors()
    itemColor.register((stack, tintIndex) => tintIndex > 0 ? -1 : stack.getItem().getColor(stack), Item.of('kubejs:newer_bobber').getItem(), Item.of('kubejs:newer_fishing_line').getItem())
})