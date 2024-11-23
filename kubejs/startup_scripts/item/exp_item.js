StartupEvents.registry('item', event => {
    event.create('exp_bottle')
        .maxStackSize(1)
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