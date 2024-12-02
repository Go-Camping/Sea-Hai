StartupEvents.registry('item', event => {
    new $HookBuilder('newer').setModID("kubejs").setWeight(new Vec3d(0.8, 1, 0.8)).build()

    event.createCustom('hard_fishing_line', () => new $DyeableItem(1))

    event.createCustom('newer_bait', () => $AquacultureAPI.createBait(20, 1))
    event.createCustom('mushroom_bait', () => $AquacultureAPI.createBait(20, 1))
    event.createCustom('cod_bait', () => $AquacultureAPI.createBait(20, 1))
    event.createCustom('salmon_bait', () => $AquacultureAPI.createBait(20, 1))
    event.createCustom('perch_bait', () => $AquacultureAPI.createBait(20, 1))
    event.createCustom('bass_bait', () => $AquacultureAPI.createBait(20, 1))
    event.createCustom('meat_bait', () => $AquacultureAPI.createBait(20, 1))
    event.createCustom('fish_bait', () => $AquacultureAPI.createBait(20, 1))

    event.createCustom('duck_bobber', () => new $DyeableItem(16575488, new ResourceLocation('kubejs', 'textures/item/fishing/duck_bobber.png'), new ResourceLocation('kubejs', 'textures/item/fishing/duck_bobber_overlay.png')))
    event.createCustom('octopus_bobber', () => new $DyeableItem(7316968, new ResourceLocation('kubejs', 'textures/item/fishing/octopus_bobber.png'), new ResourceLocation('kubejs', 'textures/item/fishing/octopus_bobber_overlay.png')))


})


ClientEvents.init(event => {
    let itemColor = Client.instance.getItemColors()
    itemColor.register((stack, tintIndex) =>
        tintIndex > 0 ? -1 : stack.getItem().getColor(stack),
        Item.of('kubejs:hard_fishing_line').getItem(),
        Item.of('kubejs:duck_bobber').getItem(),
        Item.of('kubejs:octopus_bobber').getItem()
    )
})
