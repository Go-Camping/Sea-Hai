// priority: 900
StartupEvents.registry('item', event => {
    event.create('menu').maxStackSize(1)
    event.create('flyer').maxStackSize(64)
})