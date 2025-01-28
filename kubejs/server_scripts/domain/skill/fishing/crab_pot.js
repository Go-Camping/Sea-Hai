// priority: 800
/**
 * @this {SkillModel}
 * @type {Object<string, function(SkillModel, Internal.MiniGameStartJS): void>}
 */
const CrabPotRecipeSkillMap = {

}


const CrabPotRecipeSkill = new SkillModel('kubejs:fishing')
    .setInit(
        /** 
         * @param {SkillModel} skillModel
         * @param {Internal.MiniGameStartJS} event
         */
        (skillModel, event) => {
            skillModel.customData = {
                'bobberHeight': new AttributeManagerModel(event.getFishBehavior().getBobberHeight())
            }
        }
    )
    .setDefer(
        /**
         * @param {SkillModel} skillModel
         * @param {Internal.MiniGameStartJS} event
         */
        (skillModel, event) => {
            let behavior = event.getFishBehavior()
            behavior.setBobberHeight(skillModel.customData['bobberHeight'].calResult())
        }
    )
    .setSkillMap(CrabPotRecipeSkillMap)