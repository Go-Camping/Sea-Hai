// priority: 900
StartupEvents.registry('block', event => {
    event.create('kubejs:aether_gate', 'custommachinery')
        .machine('kubejs:aether_gate')
})

StartupEvents.registry('item', event => {
    event.create('kubejs:aether_collector_1').maxStackSize(1)
})