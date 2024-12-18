// priority: 1000

/**
 * 
 * @param {Internal.ServerPlayer} player 
 */
function PufferskillModel(player) {
    this.player = player
}

PufferskillModel.prototype = {
    /**
     * @param {string} categoryName 
     * @returns {Internal.Category}
     */
    getSkillCategory: function (categoryName) {
        let cateGoryOpt = $SkillsAPI.getCategory(new ResourceLocation(categoryName))
        if (!cateGoryOpt.get()) return null
        return cateGoryOpt.get()
    },

    /**
     * @param {Internal.Category} category 
     * @param {string} skillName 
     * @returns {Internal.Skill}
     */
    getSkill: function (category, skillName) {
        let skillOpt = category.getSkill(skillName)
        if (!skillOpt.get()) return null
        return skillOpt.get()
    },
    /**
     * @param {Internal.Category} category 
     * @param {string} skillName 
     * @returns {Internal.Skill$State}
     */
    getSkillState: function (category, skillName) {
        let skill = this.getSkill(category, skillName)
        if (skill == null) return false
        return skill.getState(this.player)
    },
    /**
     * 
     * @param {Internal.Category} category 
     * @param {number} exp 
     */
    addExpToCategory: function (category, exp) {
        let experience = category.experience.get()
        experience.addTotal(this.player, exp)
        return experience.getCurrent(this.player)
    },
}





/**
 * 
 * @param {Object<string, function>} skillMap 
 * @param {string} skillCategoryName 
 * @param {any} params 
 * @returns 
 */
function ApplySkillEffect(skillMap, skillCategoryName, params) {
    const cateGoryOpt = $SkillsAPI.getCategory(new ResourceLocation(skillCategoryName))
    if (!cateGoryOpt.isPresent()) return null
    const category = cateGoryOpt.get()

    Object.keys(skillMap).forEach(key => {
        let skillState = skillModel.getSkillState(category, key)
        if (skillState && skillState == $SkillState.UNLOCKED) {
            skillMap[key](params)
        }
    })
}