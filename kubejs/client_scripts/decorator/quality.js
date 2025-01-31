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

const SaleTagTextMap = {
    'kubejs:aquatic_products': Text.of('tooltips.kubejs.tag.aquatic_products.1').color(Color.rgba(166, 248, 255, 1))
}


ItemEvents.tooltip((tooltip) => {

    tooltip.addAdvancedToAll((item, advanced, text) => {
        let saleTags = []
        item.getTags().toArray().forEach(/**@param {Internal.TagKey<Item>} tag*/tag => {
            console.log(tag.location())
            if (SaleTagTextMap[tag.location().toString()]) {
                saleTags.push(SaleTagTextMap[tag.location().toString()])
                
            }
        })
        if (saleTags.length > 0) {
            text.add(Text.translatable('@ ').gray().append(JoinWithSeparator(' ', saleTags)))
        }
        
        if (!item.hasNBT() || !item.nbt.contains('value')) return
        text.add(Text.translatable('tooltips.kubejs.item.value.1').green().append(Text.gold(item.nbt.getInt('value').toFixed(0) + ' ♥')))
    })
})