// priority: 900
StartupEvents.registry('block', event => {
    event.create('kubejs:aether_gate', 'custommachinery')
        .machine('kubejs:aether_gate')
})