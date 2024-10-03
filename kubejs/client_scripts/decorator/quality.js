/** @type {Internal.RenderJSItemDecorator} */
const QualityDecorator = RenderJSItemDecoratorHandler.registerForAllItem('quality', ctx => { })

QualityDecorator.setRender(ctx => {
    let item = ctx.itemStack
    let guiGraphics = ctx.guiGraphics
    if (item.getOrCreateTag().contains('quality')) {
        let qualityNum = item.nbt.getInt('quality')
        switch (qualityNum) {
            case 1:
                guiGraphics.blit(new ResourceLocation('kubejs:textures/decorator/iron_overlay.png'), ctx.xOffset, ctx.yOffset, 0, 0, 16, 16, 16, 16)
                break
            case 2:
                guiGraphics.blit(new ResourceLocation('kubejs:textures/decorator/gold_overlay.png'), ctx.xOffset, ctx.yOffset, 0, 0, 16, 16, 16, 16)
                break
            case 3:
                guiGraphics.blit(new ResourceLocation('kubejs:textures/decorator/diamond_overlay.png'), ctx.xOffset, ctx.yOffset, 0, 0, 16, 16, 16, 16)
                break
            case 4:
                guiGraphics.blit(new ResourceLocation('kubejs:textures/decorator/rose_overlay.png'), ctx.xOffset, ctx.yOffset, 0, 0, 16, 16, 16, 16)
                break
        }

    }
})