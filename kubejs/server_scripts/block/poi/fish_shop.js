ServerEvents.recipes(event => {
	event.recipes.custommachinery.custom_machine('kubejs:fish_shop', 200)
        .requireFunctionToStart(ctx => {
            let block = ctx.block
            let shopPOIModel = new ShopPOIBlock(block)
            if (shopPOIModel.checkIsShopping()) return ctx.success()
            return ctx.error('invalid')
        })
        .requireFunctionOnEnd(ctx => {
            /**@type {Internal.BlockContainerJS} */
            let block = ctx.block
            let shopPOIModel = new ShopPOIBlock(block)

            block.popItem(Item.of('lightmanscurrency:coin_copper', shopPOIModel.getConsumingMoney()))
            shopPOIModel.setIsShopping(false)
            shopPOIModel.setConsumingMoney(0)
            return ctx.success()
        })
        .produceItem(Item.of('minecraft:stone', 1), 'output_1')
})