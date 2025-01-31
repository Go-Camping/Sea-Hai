const ExpTypeMapToSkillName = {
    'kubejs:fishing': 'puffskill.kubejs.fishing.title',
    'kubejs:cooking': 'puffskill.kubejs.cooking.title',
    'kubejs:smithing': 'puffskill.kubejs.smithing.title',
    'kubejs:service': 'puffskill.kubejs.service.title',
    'kubejs:other': 'puffskill.kubejs.other.title',
}

ItemEvents.tooltip((tooltip) => {
    tooltip.addAdvanced('kubejs:exp_bottle', (item, advanced, text) => {
        if (!item.hasNBT() || !item.nbt.contains('type')) return
        const amount = item.nbt.getInt('amount')
        const type = item.nbt.getString('type')
        if (!ExpTypeMapToSkillName[type]) return
        let lineNum = 1
        text.add(lineNum++, Text.translatable('tooltips.kubejs.item.exp_bottle.1', Text.translatable(ExpTypeMapToSkillName[type]).yellow()).green())
        text.add(lineNum++, Text.translatable('tooltips.kubejs.item.exp_bottle.2', Text.translatable(amount).yellow()).gold())
        text.add(lineNum++, Text.translatable('tooltips.kubejs.item.exp_bottle.3', Text.translatable('common.kubejs.key.right_click').gold()).gray())
    })
})