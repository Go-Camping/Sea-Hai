// priority: 800
FishingItemMiniGameEndStrategy.addStrategy('kubejs:lucky_fishing_line', LuckyFishingLineMiniGameEnd)

/**
 * @param {StrategyModel} model
 * @param {Internal.MiniGameStartJS} event 
 */
function LuckyFishingLineMiniGameEnd(model, event) {
    let random = RandomWithPlayerLuck(event.player)
    switch (true) {
        case random > 0.99:
            model.customData['valueModel'].addAttributeModifier(2, 'multiple', 'base')
            break
        case random > 0.95:
            model.customData['valueModel'].addAttributeModifier(0.5, 'multiple', 'base')
            break
        case random > 0.85:
            if (!event.fishSuccess) return
            let playerSkill = new PufferskillModel(event.player)
            let skillCategory = playerSkill.getSkillCategory('kubejs:fishing')
            playerSkill.addExpToCategory(skillCategory, 5)
            break
        case random > 0.7:
            model.customData['valueModel'].addAttributeModifier(0.1, 'multiple', 'base')
            break
        default:
            model.customData['valueModel'].addAttributeModifier(-0.1, 'multiple', 'base')
            break
    }
}