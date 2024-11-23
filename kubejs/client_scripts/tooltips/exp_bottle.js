const ExpFluidMapToSkillName = {
    'kubejs:fishing_exp_fluid': 'skill.kubejs.fishing.name'
}

ItemEvents.tooltip((tooltip) => {
    tooltip.addAdvanced('kubejs:exp_bottle', (item, advanced, text) => {
        if (!item.hasNBT() || !item.nbt.contains('type')) return
        const amount = item.nbt.getInt('amount')
        const type = item.nbt.getString('type')
        if (!ExpFluidMapToSkillName[type]) return
        let lineNum = 1
        text.add(lineNum++, Text.translatable('tooltips.kubejs.item.exp_bottle.1', Text.translatable(ExpFluidMapToSkillName[type]).white()).gold())
        text.add(lineNum++, Text.translatable('tooltips.kubejs.item.exp_bottle.2', Text.translatable(amount).white()).gold())

        text.add(lineNum++, Text.translatable('tooltips.kubejs.item.exp_bottle.3', Text.translatable('common.kubejs.key.right_click').gold()))
    })
})