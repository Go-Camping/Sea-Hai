// priority: 800
FishingItemMiniGameStartStrategy.addStrategy('kubejs:glowing_fishing_line', GlowingFishingLineMiniGameStart)

/**
 * @param {StrategyModel} model
 * @param {Internal.MiniGameStartJS} event 
 */
function GlowingFishingLineMiniGameStart(model, event) {
    model.customData['pointGain'].addAttributeModifier(0.1, 'multiple', 'base')
}