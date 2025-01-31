// priority: 950
/** @type {Internal.RenderJSItemDecorator} */
const QualityDecorator = RenderJSItemDecoratorHandler.registerForAllItem('quality', ctx => { })

QualityDecorator.setRender(ctx => {
    let item = ctx.itemStack
    let guiGraphics = ctx.guiGraphics
    RenderJSRenderSystem.disableDepthTestJS()
    if (!item.isEmpty() && item.getOrCreateTag().contains('quality')) {
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

ItemEvents.tooltip((tooltip) => {
    tooltip.addAdvancedToAll((item, advanced, text) => {
        if (!item.hasNBT() || !item.nbt.contains('value')) return
        text.add(Text.translatable('tooltips.kubejs.item.value.1').green().append(Text.gold(item.nbt.getInt('value').toFixed(0) + ' ♥')))
    })
})