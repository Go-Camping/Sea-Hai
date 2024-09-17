ServerEvents.recipes(event => {
	event.recipes.custommachinery.custom_machine('kubejs:fish_shop', 200)
        .requireFunctionToStart(ctx => {
            let blockEntity = ctx.tile
            let persistentData = blockEntity.persistentData
            if (persistentData.contains('isShopping') && persistentData.getInt('isShopping') == 1) {
                return ctx.success()
            }
            return ctx.error('invalid')
        })
        .requireFunctionOnEnd(ctx => {
            let blockEntity = ctx.tile
            let persistentData = blockEntity.persistentData
            persistentData.putInt('isShopping', 0)

            if (persistentData.contains('shoppingTime')) {
                let shoppingTime = persistentData.getInt('shoppingTime')
                persistentData.putInt('shoppingTime', shoppingTime + 1)
            } else {
                persistentData.putInt('shoppingTime', 1)
            }
            
            return ctx.success()
        })
        .produceItem(Item.of('minecraft:stone', 1), 'output_1')
})