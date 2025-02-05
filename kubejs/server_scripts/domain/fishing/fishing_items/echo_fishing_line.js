// priority: 800
FishingItemLootModifyStrategy.addStrategy('kubejs:echo_fishing_line', EchoFishingLineLootModify)

/**
 * @param {StrategyModel} model
 * @param {Internal.MiniGameStartJS} event 
 */
function EchoFishingLineLootModify(model, event) {
    let random = RandomWithPlayerLuck(event.player)
    if (random > 0.5) {
        skillModel.customData['addtionalLootThreshold'] = skillModel.customData['addtionalLootThreshold'] * 0.8
    }
}