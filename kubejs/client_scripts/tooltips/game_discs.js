ItemEvents.tooltip((tooltip) => {
    tooltip.addAdvanced('gamediscs:gaming_console', (item, advanced, text) => {
        let lineNum = 1
        if (!item.hasNBT()) return
        let nbt = item.getNbt()
        let totalScore = 0
        nbt.allKeys.forEach((key) => {
            totalScore += nbt.getInt(key)
        })
        text.add(lineNum++, Text.translatable('tooltips.kubejs.item.gaming_console.1', Text.of(totalScore.toFixed(0)).gray()).gold())
    })
})