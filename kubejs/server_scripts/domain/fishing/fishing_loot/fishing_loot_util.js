// priority: 601
const FishingLootList = []
const RainLevelMap = ['clear', 'rain', 'thunder']
const FishingValueMap = {}

ServerEvents.tags('item', event => {
    let itemList = Object.keys(FishingValueMap)
    event.add(AllowQualityTag, itemList)
    event.add(AquaticProductsSaleTag, itemList)
})

/**
 * 
 * @param {string} itemId 
 * @param {function(Internal.ItemStack, Internal.ServerPlayer):Internal.ItemStack} func 
 */
function RegisterFishValue(itemId, func) {
    FishingValueMap[itemId] = func
}

function RegisterFishingLoot(customFishingLootModel) {
    FishingLootList.push(customFishingLootModel)
}

/**
 * 
 * @param {Internal.ItemStack} itemStack 
 * @param {Internal.LivingEntity} player
 * @param {number} min 
 * @param {number} max 
 * @returns 
 */
function AverageScoreDistri(itemStack, player, min, max) {
    let luck = 0
    let luckDeity = 10
    if (player && player.isPlayer()) {
        luck = player.luck
        if (player.hasEffect('kubejs:luck_deity')) {
            luckDeity = Math.max(9 - player.getEffect('kubejs:luck_deity').getAmplifier(), 2)
        }
    }
    let itemModel = new ItemQaulityModel(itemStack)
    let random = RandomWithLuck(luck, luckDeity)
    itemModel.setValue(Math.floor(random * (max - min)) + min)
    switch (true) {
        case (random < 0.4):
            itemModel.setQuality(1)
            break
        case (random < 0.7):
            itemModel.setQuality(2)
            break
        case (random < 0.9):
            itemModel.setQuality(3)
            break
        case (random <= 1):
            itemModel.setQuality(3)
            break
    }
    return itemModel.itemStack
}
