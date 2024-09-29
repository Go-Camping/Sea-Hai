/** @type {Internal.RenderJSItemDecorator} */
const QualityDecorator = RenderJSItemDecoratorHandler.registerForAllItem('quality', ctx => {})

QualityDecorator.setRender(ctx=>{
    let item = ctx.itemStack
    let guiGraphics = ctx.guiGraphics
    if (item.getOrCreateTag().contains("quality")) {
        guiGraphics.blit(new ResourceLocation('kubejs:textures/decorator/diamond_overlay.png'), ctx.xOffset, ctx.yOffset, 0, 0, 16, 16, 16, 16)
    }
})