// priority: 900
const HookIds = []
StartupEvents.registry('item', event => {
    // 高级鱼线
    event.createCustom('hard_fishing_line', () => new $DyeableItem(1))
    event.createCustom('iron_fishing_line', () => new $DyeableItem(1))
    event.createCustom('golden_fishing_line', () => new $DyeableItem(1))
    event.createCustom('glowing_fishing_line', () => new $DyeableItem(1))
    event.createCustom('lucky_fishing_line', () => new $DyeableItem(1))
    event.createCustom('echo_fishing_line', () => new $DyeableItem(1))
    event.createCustom('ender_fishing_line', () => new $DyeableItem(1))

    event.createCustom('newer_bait', () => $AquacultureAPI.createBait(8, 1))
    event.createCustom('mushroom_bait', () => $AquacultureAPI.createBait(8, 1))
    event.createCustom('cod_bait', () => $AquacultureAPI.createBait(8, 1))
    event.createCustom('salmon_bait', () => $AquacultureAPI.createBait(8, 1))
    event.createCustom('perch_bait', () => $AquacultureAPI.createBait(8, 1))
    event.createCustom('bass_bait', () => $AquacultureAPI.createBait(8, 1))
    event.createCustom('meat_bait', () => $AquacultureAPI.createBait(8, 1))
    event.createCustom('fish_bait', () => $AquacultureAPI.createBait(8, 1))

    // 高级浮标
    event.createCustom('duck_bobber', () => new $DyeableItem(16575488, new ResourceLocation('kubejs', 'textures/item/fishing/duck_bobber.png'), new ResourceLocation('kubejs', 'textures/item/fishing/duck_bobber_overlay.png')))
    event.createCustom('octopus_bobber', () => new $DyeableItem(7316968, new ResourceLocation('kubejs', 'textures/item/fishing/octopus_bobber.png'), new ResourceLocation('kubejs', 'textures/item/fishing/octopus_bobber_overlay.png')))
    event.createCustom('iron_bobber', () => new $DyeableItem(7316968, new ResourceLocation('kubejs', 'textures/item/fishing/iron_bobber.png'), new ResourceLocation('kubejs', 'textures/item/fishing/octopus_bobber_overlay.png')))
    event.createCustom('golden_bobber', () => new $DyeableItem(7316968, new ResourceLocation('kubejs', 'textures/item/fishing/golden_bobber.png'), new ResourceLocation('kubejs', 'textures/item/fishing/octopus_bobber_overlay.png')))
    event.createCustom('ball_bobber', () => new $DyeableItem(7316968, new ResourceLocation('kubejs', 'textures/item/fishing/ball_bobber.png'), new ResourceLocation('kubejs', 'textures/item/fishing/octopus_bobber_overlay.png')))
    event.createCustom('feather_bobber', () => new $DyeableItem(7316968, new ResourceLocation('kubejs', 'textures/item/fishing/feather_bobber.png'), new ResourceLocation('kubejs', 'textures/item/fishing/octopus_bobber_overlay.png')))
    event.createCustom('dish_bobber', () => new $DyeableItem(7316968, new ResourceLocation('kubejs', 'textures/item/fishing/dish_bobber.png'), new ResourceLocation('kubejs', 'textures/item/fishing/octopus_bobber_overlay.png')))

})


ClientEvents.init(event => {
    let itemColor = Client.instance.getItemColors()
    itemColor.register((stack, tintIndex) =>
        tintIndex > 0 ? -1 : stack.getItem().getColor(stack),
        Item.of('kubejs:hard_fishing_line').getItem(),
        Item.of('kubejs:duck_bobber').getItem(),
        Item.of('kubejs:octopus_bobber').getItem(),
        Item.of('kubejs:iron_bobber').getItem(),
        Item.of('kubejs:golden_bobber').getItem(),
        Item.of('kubejs:ball_bobber').getItem(),
        Item.of('kubejs:feather_bobber').getItem(),
        Item.of('kubejs:dish_bobber').getItem()
    )
})

/**
 * @param {Internal.Hook$HookBuilder} hookBuilder 
 */
function RegisterHook(hookBuilder) {
    let hook = hookBuilder.build()
    let id = 'aquaculture:' + hook.getName() + '_hook'
    HookIds.push(id)
    return
}

RegisterHook(new $HookBuilder('newer')
    .setWeight(new Vec3d(0.8, 1, 0.8))
)
RegisterHook(new $HookBuilder('short_mead')
    .setFluid(new $TagKey($Registries.FLUID, 'kubejs:short_mead'))
    .setWeight(new Vec3d(0.8, 1, 0.8))
)

StartupEvents.modifyCreativeTab('kubejs:tab', event => {
    HookIds.forEach(id => {
        event.add(id)
    })
})

StartupEvents.modifyCreativeTab('aquaculture:tab', event => {
    HookIds.forEach(id => {
        event.remove(id)
    })
})