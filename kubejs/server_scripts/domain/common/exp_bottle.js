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
    if (!ExpFluidMapToSkillCategory[type]) return
    let playerSkill = new PufferskillModel(player)
    let skillCategory = playerSkill.getSkillCategory(ExpFluidMapToSkillCategory[type])
    playerSkill.addExpToCategory(skillCategory, expAmount)
    player.setStatusMessage(Text.translatable('status.kubejs.exp_bottle.gain_exp.1', Text.translatable(ExpFluidMapToSkillName[type]).gold(), Text.gold(expAmount.toFixed(0))))
    return
}

const ExpFluidMapToSkillCategory = {
    'kubejs:fishing_exp_fluid': 'kubejs:fishing'
}

const ExpFluidMapToSkillName = {
    'kubejs:fishing_exp_fluid': 'skill.kubejs.fishing.name'
}