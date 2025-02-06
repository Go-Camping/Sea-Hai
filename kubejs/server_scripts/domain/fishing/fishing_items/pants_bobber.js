// priority: 800
FishingItemLootModifyStrategy.addStrategy('kubejs:pants_bobber', PantsBobberLootModify)
/**
 * @param {StrategyModel} model
 * @param {Internal.MiniGameEndJS} event 
 */
function PantsBobberLootModify(model, event) {
    model.customData['addtionalLootThreshold'] = model.customData['addtionalLootThreshold'] * 0.9
    if (event.player.luck >= 10) {
        model.customData['copyAll'] = true
    }
}