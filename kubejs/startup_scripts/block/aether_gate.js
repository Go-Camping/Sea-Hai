// priority: 900
StartupEvents.registry('block', event => {
    event.create('kubejs:aether_gate', 'custommachinery')
        .machine('kubejs:aether_gate')

    event.create('kubejs:way_node')
        .soundType(SoundType.STONE)
        .box(0, 0, 0, 16, 1, 16)
        .textureAll('kubejs:block/node')
        .blockEntity(info => {
            info.initialData({})
        })
        .defaultTranslucent()
})