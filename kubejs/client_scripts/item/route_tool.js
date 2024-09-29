ItemEvents.tooltip((tooltip) => {

    tooltip.addAdvanced('kubejs:route_tool', (item, advanced, text) => {
        let lineNum = 1
        if (item.hasNBT()) {
            let nbt = item.nbt
            let posListNbt= nbt.getList('posList', GET_COMPOUND_TYPE)
            let num = 1
            text.add(lineNum++, Text.translatable('tooltips.kubejs.item.route_tool.1').gold())
            posListNbt.forEach((pos) => {
                let posX = pos.getInt('x')
                let posY = pos.getInt('y')
                let posZ = pos.getInt('z')
               text.add(lineNum++, [Text.of(`    ${num++}. `).yellow(), Text.of(`X: ${posX}, Y: ${posY}, Z: ${posZ}`).gray()])
            })
        }
    })
})