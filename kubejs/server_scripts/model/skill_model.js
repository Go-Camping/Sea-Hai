// priority: 900

/**
 * @param {String} skillCategoryName 
 */
function SkillModel(category) {
    /**@type {Object<string, function(...any): void>} */
    this.skillMap = {}
    this.customData = {}
    this.skillCategory = category
    this.init = (args) => {}
    this.defer = (args) => {}
    return this
}

SkillModel.prototype = {
    /**
     * @param {Object<string, function(...any): void>} skillMap
     */
    setSkillMap: function (skillMap) {
        this.skillMap = skillMap
        return this
    },
    /**
     * @param {String} skillId
     * @param {function(any[]): void} skillFunc
     */
    addSkill: function (skillId, skillFunc) {
        this.skillMap[skillId] = skillFunc
        return this
    },
    /**
     * @param {function(Internal.ServerPlayer, ...any): void} data
     */
    setInit: function (initFunc) {
        this.init = initFunc
        return this
    },
        /**
     * @param {function(Internal.ServerPlayer, ...any): void} data
     */
    setDefer: function (deferFunc) {
        this.defer = deferFunc
        return this
    },
    /**
     * @param {Internal.ServerPlayer} player 
     * @param {any[]} args 
     */
    run: function (player, args) {
        const cateGoryOpt = $SkillsAPI.getCategory(new ResourceLocation(this.skillCategory))
        if (!cateGoryOpt.isPresent()) return
        const category = cateGoryOpt.get()
        this.init.apply(this, args)
        Object.keys(this.skillMap).forEach(skillId => {
            let skillOpt = category.getSkill(skillId)
            if (!skillOpt.isPresent()) return
            let skillState = skillOpt.get().getState(player)
            if (!skillState.equals($SkillState.UNLOCKED)) return
            return this.skillMap[skillId].apply(this, args)
        })
        this.defer.apply(this, args)
        return
    },
}
