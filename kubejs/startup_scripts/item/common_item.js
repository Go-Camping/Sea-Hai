// priority: 900
StartupEvents.registry('item', event => {
    event.create('menu').maxStackSize(1)
    event.create('flyer').maxStackSize(64)
    event.create('shining_potion_fish').maxStackSize(1).tag('kubejs:shining_potion')
})