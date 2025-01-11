// priority: 900
StartupEvents.registry('block', event => {
    event.create('kubejs:crab_pot', 'custommachinery')
        .machine('kubejs:crab_pot')
})