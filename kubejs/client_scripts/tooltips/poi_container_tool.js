ItemEvents.tooltip((tooltip) => {

    tooltip.addAdvanced('kubejs:relate_position_tool', (item, advanced, text) => {
        let lineNum = 1
        if (item.hasNBT()) {
            let nbt = item.nbt
            let poiPos= nbt.get('poiPos')
            text.add(lineNum++, [Text.translatable('tooltips.kubejs.item.relate_position_tool.1').gold(), Text.of(` ${poiPos.x}, ${poiPos.y}, ${poiPos.z}`).gray()])


        }
    })
})