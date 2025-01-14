// priority: 900
StartupEvents.registry('block', event => {
    event.create('kubejs:fish_store', 'custommachinery')
        .machine('kubejs:fish_store')
    event.create('kubejs:onsen_resort', 'custommachinery')
        .machine('kubejs:onsen_resort')
    event.create('kubejs:gelato_store', 'custommachinery')
        .machine('kubejs:gelato_store')
    event.create('kubejs:crock_pot_restaurant', 'custommachinery')
        .machine('kubejs:crock_pot_restaurant')
    event.create('kubejs:equestrian_pavilion', 'custommachinery')
        .machine('kubejs:equestrian_pavilion')
})