// priority: 800
FishingItemLootModifyStrategy.addStrategy('kubejs:echo_fishing_line', EchoFishingLineLootModify)

/**
 * @param {StrategyModel} model
 * @param {Internal.MiniGameStartJS} event 
 */
function EchoFishingLineLootModify(model, event) {
    model.customData['addtionalLootThreshold'] = model.customData['addtionalLootThreshold'] * 0.75
}