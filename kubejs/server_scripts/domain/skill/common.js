// priority: 600
/**
 * @param {Object<string, function(object): void>} strategy 
 * @param {String} skillCategoryName 
 * @param {Internal.ServerPlayer} player 
 * @param {object} args 
 */
function ApplySkillStrategy(strategy, skillCategoryName, player, args) {
    const cateGoryOpt = $SkillsAPI.getCategory(new ResourceLocation(skillCategoryName))
    if (!cateGoryOpt.isPresent()) return
    const category = cateGoryOpt.get()
    Object.keys(strategy).forEach(skillId => {

        let skillOpt = category.getSkill(skillId)
        if (!skillOpt.isPresent()) return
        let skillState = skillOpt.get().getState(player)
        if (!skillState.equals($SkillState.UNLOCKED)) return

        return strategy[skillId].apply(null, args)
    })
}