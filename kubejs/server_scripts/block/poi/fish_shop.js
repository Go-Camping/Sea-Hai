ServerEvents.recipes(event => {
	event.recipes.custommachinery.custom_machine('kubejs:fish_shop', 200)
        .requireFunctionToStart(ctx => {
            console.log('test')
            let blockEntity = ctx.tile
            let persistentData = blockEntity.persistentData
            if (persistentData.contains('test') && persistentData.getInt('test') == 1) {
                return ctx.success()
            }
            return ctx.error('invalid')
        })
        .requireFunctionOnEnd(ctx => {
            ctx.tile.persistentData.putInt('test', 0)
            return ctx.success()
        })
        .produceItem(Item.of('minecraft:stone', 1), 'output_1')
})