StartupEvents.registry('block', event => {
    event.create('kubejs:fish_shop', 'custommachinery')
        .machine('kubejs:fish_shop')
    event.create('kubejs:grocery', 'custommachinery')
        .machine('kubejs:grocery')
})