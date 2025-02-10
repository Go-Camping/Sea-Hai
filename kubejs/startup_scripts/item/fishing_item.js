// priority: 900
const HookIds = []
StartupEvents.registry('item', event => {
    event.createCustom('newer_fishing_line', () => new $DyeableItem(1))
    // 高级鱼线
    event.createCustom('hard_fishing_line', () => new $DyeableItem(1))
    event.createCustom('iron_fishing_line', () => new $DyeableItem(1))
    event.createCustom('golden_fishing_line', () => new $DyeableItem(1))
    event.createCustom('glowing_fishing_line', () => new $DyeableItem(1))
    event.createCustom('lucky_fishing_line', () => new $DyeableItem(1))
    event.createCustom('echo_fishing_line', () => new $DyeableItem(1))
    event.createCustom('ender_fishing_line', () => new $DyeableItem(1))

    event.createCustom('newer_bait', () => $AquacultureAPI.createBait(8, 3))
    // 高级鱼饵
    event.createCustom('mushroom_bait', () => $AquacultureAPI.createBait(8, 1))
    event.createCustom('cod_bait', () => $AquacultureAPI.createBait(8, 1))
    event.createCustom('salmon_bait', () => $AquacultureAPI.createBait(8, 1))
    event.createCustom('puffer_bait', () => $AquacultureAPI.createBait(8, 1))
    event.createCustom('bass_bait', () => $AquacultureAPI.createBait(8, 1))
    event.createCustom('meat_bait', () => $AquacultureAPI.createBait(8, 1))
    event.createCustom('squid_bait', () => $AquacultureAPI.createBait(8, 1))

    event.createCustom('newer_bobber', () => new $DyeableItem(0xf41000, new ResourceLocation('kubejs', 'textures/item/fishing/newer_bobber.png'), new ResourceLocation('kubejs', 'textures/item/fishing/newer_bobber_overlay.png')))
    // 高级浮标
    event.createCustom('duck_bobber', () => new $DyeableItem(0xfcec00, new ResourceLocation('kubejs', 'textures/item/fishing/duck_bobber.png'), new ResourceLocation('kubejs', 'textures/item/fishing/duck_bobber_overlay.png')))
    event.createCustom('octopus_bobber', () => new $DyeableItem(0x6fa5e8, new ResourceLocation('kubejs', 'textures/item/fishing/octopus_bobber.png'), new ResourceLocation('kubejs', 'textures/item/fishing/octopus_bobber_overlay.png')))
    event.createCustom('iron_bobber', () => new $DyeableItem(0xffffff, new ResourceLocation('kubejs', 'textures/item/fishing/iron_bobber.png'), new ResourceLocation('kubejs', 'textures/item/fishing/iron_bobber_overlay.png')))
    event.createCustom('golden_bobber', () => new $DyeableItem(0xffdf0f, new ResourceLocation('kubejs', 'textures/item/fishing/golden_bobber.png'), new ResourceLocation('kubejs', 'textures/item/fishing/golden_bobber_overlay.png')))
    event.createCustom('ball_bobber', () => new $DyeableItem(0xebebeb, new ResourceLocation('kubejs', 'textures/item/fishing/ball_bobber.png'), new ResourceLocation('kubejs', 'textures/item/fishing/ball_bobber_overlay.png')))
    event.createCustom('feather_bobber', () => new $DyeableItem(0xcee6f0, new ResourceLocation('kubejs', 'textures/item/fishing/feather_bobber.png'), new ResourceLocation('kubejs', 'textures/item/fishing/feather_bobber_overlay.png')))
    event.createCustom('dish_bobber', () => new $DyeableItem(0xf0bdd5, new ResourceLocation('kubejs', 'textures/item/fishing/dish_bobber.png'), new ResourceLocation('kubejs', 'textures/item/fishing/dish_bobber_overlay.png')))

    // 特殊浮标
    event.createCustom('pants_bobber', () => new $DyeableItem(0xcca9f8, new ResourceLocation('kubejs', 'textures/item/fishing/pants_bobber.png'), new ResourceLocation('kubejs', 'textures/item/fishing/pants_bobber_overlay.png')))
})


ClientEvents.init(event => {
    let itemColor = Client.instance.getItemColors()
    itemColor.register((stack, tintIndex) =>
        tintIndex > 0 ? -1 : stack.getItem().getColor(stack),
        Item.of('kubejs:newer_fishing_line').getItem(),
        Item.of('kubejs:hard_fishing_line').getItem(),
        Item.of('kubejs:iron_fishing_line').getItem(),
        Item.of('kubejs:golden_fishing_line').getItem(),
        Item.of('kubejs:glowing_fishing_line').getItem(),
        Item.of('kubejs:lucky_fishing_line').getItem(),
        Item.of('kubejs:echo_fishing_line').getItem(),
        Item.of('kubejs:ender_fishing_line').getItem(),
        
        Item.of('kubejs:newer_bobber').getItem(),
        Item.of('kubejs:duck_bobber').getItem(),
        Item.of('kubejs:octopus_bobber').getItem(),
        Item.of('kubejs:iron_bobber').getItem(),
        Item.of('kubejs:golden_bobber').getItem(),
        Item.of('kubejs:ball_bobber').getItem(),
        Item.of('kubejs:feather_bobber').getItem(),
        Item.of('kubejs:dish_bobber').getItem(),
        Item.of('kubejs:pants_bobber').getItem(),
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
    .setDurabilityChance(0.9)
    .setWeight(new Vec3d(1, 1, 1))
)
RegisterHook(new $HookBuilder('ceramics')
    .setFluid(new $TagKey($Registries.FLUID, 'kubejs:ceramics_hook_fluid'))
    .setWeight(new Vec3d(0.5, 1, 0.5))
)
RegisterHook(new $HookBuilder('hotbath')
    .setFluid(new $TagKey($Registries.FLUID, 'kubejs:hotbath_hook_fluid'))
    .setWeight(new Vec3d(0.8, 1, 0.8))
)
RegisterHook(new $HookBuilder('oil')
    .setFluid(new $TagKey($Registries.FLUID, 'kubejs:oil_hook_fluid'))
    .setWeight(new Vec3d(1, 1, 1))
)
RegisterHook(new $HookBuilder('bread')
    .setFluid(new $TagKey($Registries.FLUID, 'kubejs:bread_hook_fluid'))
    .setWeight(new Vec3d(1, 1, 1))
)
RegisterHook(new $HookBuilder('silme')
    .setFluid(new $TagKey($Registries.FLUID, 'kubejs:silme_hook_fluid'))
    .setWeight(new Vec3d(1, 1, 1))
)
RegisterHook(new $HookBuilder('blood')
    .setFluid(new $TagKey($Registries.FLUID, 'kubejs:blood_hook_fluid'))
    .setWeight(new Vec3d(1, 1, 1))
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