// priority: 900
/**
 * 
 * @param {Internal.ItemStack} itemstack 
 * @param {Internal.Level} level 
 * @param {Internal.LivingEntity} entity 
 */
global.ExpBottleFinishUsing = (itemstack, level, entity) => {
    const player = entity
    if (!itemstack.hasNBT() || !itemstack.nbt.contains('amount') || !itemstack.nbt.contains('type')) return itemstack
    const expAmount = itemstack.nbt.getInt('amount')
    if (expAmount <= 0) return itemstack
    const type = itemstack.nbt.getString('type')
    if (!ExpTypeMapToSkillCategory[type]) return
    let playerSkill = new PufferskillModel(player)
    let skillCategory = playerSkill.getSkillCategory(ExpTypeMapToSkillCategory[type])
    playerSkill.addExpToCategory(skillCategory, expAmount)
    player.setStatusMessage(Text.translatable('status.kubejs.exp_bottle.gain_exp.1', Text.translatable(ExpTypeMapToSkillName[type]).gold(), Text.gold(expAmount.toFixed(0))))
    return
}

const ExpTypeMapToSkillCategory = {
    'kubejs:fishing': 'kubejs:fishing'
}

const ExpTypeMapToSkillName = {
    'kubejs:fishing': 'skill.kubejs.fishing.name'
}
