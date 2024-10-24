StartupEvents.registry('block', event => {
    event.create('kubejs:fish_shop', 'custommachinery')
        .machine('kubejs:fish_shop')
    event.create('kubejs:grocery', 'custommachinery')
        .machine('kubejs:grocery')

        
    event.create('kubejs:way_node')
        .soundType(SoundType.STONE)
        .box(0, 0, 0, 16, 1, 16)
        .textureAll('kubejs:block/node')
        .blockEntity(info => {
            info.initialData({})
        })
        .defaultTranslucent()
})