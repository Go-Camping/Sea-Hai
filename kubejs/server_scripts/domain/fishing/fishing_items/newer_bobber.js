// priority: 800
FishingItemMiniGameStartStrategy.addStrategy('kubejs:newer_bobber', NewerBobberMiniGameStart)

/**
 * @param {StrategyModel} model
 * @param {Internal.MiniGameStartJS} event 
 */
function NewerBobberMiniGameStart(model, event) {
    model.customData['bobberHeight'].addAttributeModifier(0.2, 'multiple', 'base')
}
