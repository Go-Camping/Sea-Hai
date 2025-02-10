// priority: 900
StartupEvents.registry('item', event => {
    event.create('exp_bottle')
        .maxStackSize(1)
        .tag('kubejs:exp_bottle')
        .useAnimation('drink')
        .use((level, player, hand) => {
            return true
        })
        .useDuration(itemStack => 20)
        .finishUsing((itemstack, level, entity) => {
            if (level.isClientSide()) return itemstack
            return global.ExpBottleFinishUsing(itemstack, level, entity)
        })
})