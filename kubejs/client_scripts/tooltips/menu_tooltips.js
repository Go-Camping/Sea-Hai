
ItemEvents.tooltip((tooltip) => {
    tooltip.addAdvanced('kubejs:menu', (item, advanced, text) => {
        let lineNum = 1
        let menuItemList = []
        if (item.hasNBT() && item.nbt.contains('inventory')) {
            item.nbt.getList('inventory', GET_COMPOUND_TYPE).forEach(/**@param {Internal.CompoundTag} itemNbt*/ itemNbt => {
                if (itemNbt.contains('id')) {
                    menuItemList.push(Item.of(itemNbt.getString('id')).getHoverName())
                }
            })
        }
        
        text.add(lineNum++, Text.translatable('tooltips.kubejs.item.menu.1', menuItemList.length.toFixed(0)).gray())

        if (menuItemList.length > 0) {
            if (tooltip.isShift()) {
                menuItemList.forEach(menuItem => {
                    text.add(lineNum++, Text.translatable('tooltips.kubejs.item.menu.3', Text.yellow(menuItem)))
                })
            } else {
                text.add(lineNum++, Text.translatable('tooltips.kubejs.item.menu.2', Text.translatable('common.kubejs.key.shift').gold()))
            }
        }
    })
})