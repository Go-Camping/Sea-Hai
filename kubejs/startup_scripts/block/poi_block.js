StartupEvents.registry('block', event => {
    event.create('kubejs:fish_store', 'custommachinery')
        .machine('kubejs:fish_store')
    event.create('kubejs:grocery', 'custommachinery')
        .machine('kubejs:grocery')
    event.create('kubejs:onsen_resort', 'custommachinery')
        .machine('kubejs:onsen_resort')
    event.create('kubejs:gelato_store', 'custommachinery')
        .machine('kubejs:gelato_store')

    event.create('kubejs:way_node')
        .soundType(SoundType.STONE)
        .box(0, 0, 0, 16, 1, 16)
        .textureAll('kubejs:block/node')
        .blockEntity(info => {
            info.initialData({})
        })
        .defaultTranslucent()
})