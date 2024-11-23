// priority: 600
const FishingLootList = []
const RainLevelMap = ['clear', 'rain', 'thunder']
const FishingValueMap = {}

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
 * @param {number} min 
 * @param {number} max 
 * @returns 
 */
function AverageScoreDistri(itemStack, min, max) {
    let random = Math.random()
    let value = Math.floor(random * (max - min)) + min
    let quality = 1
    switch (random) {
        case (random < 0.4):
            quality = 1
            break
        case (random < 0.7):
            quality = 2
            break
        case (random < 0.9):
            quality = 3
            break
        case (random <= 1):
            quality = 3
            break
    }
    return itemStack.withNBT({ value: NBT.i(value), quality: NBT.i(quality) })
}

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('lavafishing:quartz_fish'), 20)
        .withFluidModifier('minecraft:lava', 1)
        .withTimeRangeModifier((time, weight) => time > 22200 ? weight * 3 : weight)
)
RegisterFishValue('lavafishing:quartz_fish', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('lavafishing:agni_fish'), 2)
        .withFluidModifier('minecraft:lava', 1)
        .withTimeRangeModifier((time, weight) => time < 8000 && time > 5000 ? weight * 3 : weight)
        .withPlayerModifier((player, weight) => player.hasEffect('minecraft:glowing') ? weight * 3 : weight)
)
RegisterFishValue('lavafishing:agni_fish', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('lavafishing:steam_flying_fish'), 2)
        .withFluidModifier('minecraft:lava', 5)
        .withFluidModifier('minecraft:water', 1)
        .withPlayerModifier((player, weight) => player.y < 30 ? weight * 3 : weight)
)
RegisterFishValue('lavafishing:steam_flying_fish', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('lavafishing:lava_lamprey'), 10)
        .withFluidModifier('minecraft:lava', 1)
        .withWeatherModifier('clear', 1)
        .withTimeRangeModifier((time, weight) => time > 6000 ? weight * 2 : weight)
)
RegisterFishValue('lavafishing:lava_lamprey', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('lavafishing:arowana_fish'), 1)
        .withFluidModifier('minecraft:lava', 1)
        .withPlayerModifier((player, weight) => player.luck >= 10 ? weight * 5 : weight)
)
RegisterFishValue('lavafishing:arowana_fish', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('lavafishing:obsidian_sword_fish'), 10)
        .withFluidModifier('minecraft:lava', 1)
        .withTimeRangeModifier((time, weight) => time > 13800 && time < 22200 ? weight * 3 : weight)
)
RegisterFishValue('lavafishing:obsidian_sword_fish', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})



// todo 需要添加的战利品
/**
 * [aquaculture:minnow', 'aquaculture:red_grouper', 'aquaculture:red_shrooma', 'aquaculture:brown_shrooma', 'aquaculture:tambaqui', 'aquaculture:piranha', 'aquaculture:arapaima', 'aquaculture:perch', 'aquaculture:tuna', 'aquaculture:blackfish', 'aquaculture:atlantic_cod', 'aquaculture:atlantic_herring', 'aquaculture:atlantic_halibut', 'aquaculture:pacific_halibut', 'aquaculture:bayad', 'aquaculture:rainbow_trout', 'aquaculture:pollock', 'aquaculture:pink_salmon', 'aquaculture:gar', 'aquaculture:catfish', 'aquaculture:carp', 'aquaculture:brown_trout', 'aquaculture:bluegill', 'aquaculture:smallmouth_bass', 'aquaculture:synodontis', 'aquaculture:capitaine', 'aquaculture:boulti', 'aquaculture:muskellunge']
 */