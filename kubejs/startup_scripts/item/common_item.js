StartupEvents.registry('item', event => {
    event.create('menu').maxStackSize(1)
    event.create('exp_bottle').maxStackSize(1)
})