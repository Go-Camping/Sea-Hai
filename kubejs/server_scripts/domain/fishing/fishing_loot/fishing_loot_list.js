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
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:minnow'), 10)
        .withFluidModifier('minecraft:water', 1)
        .withBiomeModifier("minecraft:river",1)
        .withPlayerModifier((player, weight) => player.luck >= 10 ? weight * 2 : weight)
)
RegisterFishValue('aquaculture:minnow', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:red_grouper'), 2)
        .withFluidModifier('minecraft:water', 1)
        .withBiomeModifier("minecraft:warm_ocean",5)
        .withBiomeModifier("minecraft:lukewarm_ocean",1)
        .withTimeRangeModifier((time, weight) => time > 13000 ? weight : 0)
)
RegisterFishValue('aquaculture:red_grouper', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:red_shrooma'), 20)
        .withFluidModifier('minecraft:water', 1)
        .withWeatherModifier('rain', 1)
        .withWeatherModifier('thunder', 100)
        .withPlayerModifier((player, weight) => {
            return $AquaFishingRodItem.getBait(GetFishingRodInHand(player)).getId() == 'kubejs:mushroom_bait' ? weight : 0
        })
)
RegisterFishValue('aquaculture:red_shrooma', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:piranha'), 4)
        .withFluidModifier('minecraft:water', 1)
        .withPlayerModifier((player, weight) => ($AquaFishingRodItem.getBait(GetFishingRodInHand(player))).getId() == 'kubejs:meat_bait' ? weight * 10 : weight)
)
RegisterFishValue('aquaculture:piranha', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:arapaima'), 5)
        .withFluidModifier('minecraft:water', 1)
        .withBiomeModifier("minecraft:warm_ocean",1)
        .withBiomeModifier("minecraft:lukewarm_ocean",5)
        .withTimeRangeModifier((time, weight) => time < 6000 ? weight * 2 : weight)
)
RegisterFishValue('aquaculture:arapaima', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:perch'), 20)
        .withFluidModifier('minecraft:water', 1)
        .withBiomeModifier("minecraft:river",1)
)
RegisterFishValue('aquaculture:perch', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:tuna'), 20)
        .withFluidModifier('minecraft:water', 1)
        .withBiomeModifier("minecraft:deep_ocean",1)
        .withPlayerModifier((player, weight) => ($AquaFishingRodItem.getBait(GetFishingRodInHand(player))).getId() == 'kubejs:fish_bait' ? weight : 0)
)
RegisterFishValue('aquaculture:tuna', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:blackfish'), 10)
        .withFluidModifier('minecraft:water', 1)
        .withTimeRangeModifier((time, weight) => time > 13000 ? weight * 2 : weight)
)
RegisterFishValue('aquaculture:blackfish', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:atlantic_cod'), 5)
        .withFluidModifier('minecraft:water', 1)
        .withBiomeModifier("minecraft:deep_ocean",1)
        .withTimeRangeModifier((time, weight) => time > 12000 && time < 18000 ? weight * 4 : weight)
)
RegisterFishValue('aquaculture:atlantic_cod', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:atlantic_herring'), 5)
        .withFluidModifier('minecraft:water', 1)
        .withBiomeModifier("minecraft:deep_ocean",1)
        .withTimeRangeModifier((time, weight) => time > 18000 ? weight * 4 : weight)
)
RegisterFishValue('aquaculture:atlantic_herring', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:atlantic_halibut'), 5)
        .withFluidModifier('minecraft:water', 1)
        .withBiomeModifier("minecraft:deep_ocean",1)
        .withTimeRangeModifier((time, weight) => time < 6000 ? weight * 4 : weight)
)
RegisterFishValue('aquaculture:atlantic_halibut', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:pacific_halibut'), 5)
        .withFluidModifier('minecraft:water', 1)
        .withBiomeModifier("minecraft:deep_lukewarm_ocean",1)
        .withTimeRangeModifier((time, weight) => time < 6000 ? weight * 4 : weight)
)
RegisterFishValue('aquaculture:pacific_halibut', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:bayad'), 2)
        .withFluidModifier('minecraft:water', 1)
        .withBiomeModifier("minecraft:river",1)
        .withTimeRangeModifier((time, weight) => time > 13800 && time < 22200 ? weight * 3 : weight)
        .withPlayerModifier((player, weight) => ($AquaFishingRodItem.getBait(GetFishingRodInHand(player))).hasTag("forge:raw_fishes") ? weight * 5 : weight)
)
RegisterFishValue('aquaculture:bayad', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:rainbow_trout'), 1)
        .withFluidModifier('minecraft:water', 1)
        .withWeatherModifier('clear', 1)
        .withWeatherModifier('rain', 2)
        .withWeatherModifier('thunder', 4)
        .withTimeRangeModifier((time, weight) => time > 18000 && time < 22200 ? weight * 5 : weight)
)
RegisterFishValue('aquaculture:rainbow_trout', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:pollock'), 5)
        .withFluidModifier('minecraft:water', 1)
        .withBiomeModifier("minecraft:deep_ocean",1)
        .withTimeRangeModifier((time, weight) => time > 12000 && time < 18000 ? weight * 4 : weight)
        .withPlayerModifier((player, weight) => $AquaFishingRodItem.getBait(GetFishingRodInHand(player)).getId() == 'kubejs:cod_bait' ? weight : 0)
)
RegisterFishValue('aquaculture:pollock', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:pink_salmon'), 2)
        .withFluidModifier('minecraft:water', 1)
        .withBiomeModifier("minecraft:cold_ocean",5)
        .withBiomeModifier("minecraft:frozen_ocean",1)
        .withTimeRangeModifier((time, weight) => time > 12000 ? weight * 2 : weight)
)
RegisterFishValue('aquaculture:pink_salmon', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:gar'), 5)
        .withFluidModifier('minecraft:water', 1)
        .withPlayerModifier((player, weight) => player.getBlock().down == "minecraft:mud" ? weight * 4 : weight)
)
RegisterFishValue('aquaculture:gar', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:catfish'), 5)
        .withFluidModifier('minecraft:water', 1)
        .withPlayerModifier((player, weight) => player.level.getBiome(player.getBlock().pos) == "minecraft:swamp" ? weight * 4 : weight)
)
RegisterFishValue('aquaculture:catfish', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:carp'), 10)
        .withFluidModifier('minecraft:water', 1)
)
RegisterFishValue('aquaculture:carp', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:brown_trout'), 2)
    .withFluidModifier('minecraft:water', 1)
    .withBiomeModifier("minecraft:cold_ocean",5)
    .withBiomeModifier("minecraft:frozen_ocean",1)
    .withTimeRangeModifier((time, weight) => time > 12000 ? weight * 2 : weight)
    .withPlayerModifier((player, weight) => $AquaFishingRodItem.getBait(GetFishingRodInHand(player)).getId() == 'kubejs:salmon_bait' ? weight : 0)
)
RegisterFishValue('aquaculture:brown_trout', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:bluegill'), 2)
    .withFluidModifier('minecraft:water', 5)
    .withFluidModifier('minecraft:lava', 1)
    .withTimeRangeModifier((time, weight) => time > 13800 && time < 22200 ? 0 : weight)
    .withPlayerModifier((player, weight) => player.block.canSeeSky ? weight : 0)
)
RegisterFishValue('aquaculture:bluegill', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:smallmouth_bass'), 20)
    .withFluidModifier('minecraft:water', 1)
    .withBiomeModifier("minecraft:river",1)
    .withPlayerModifier((player, weight) => $AquaFishingRodItem.getBait(GetFishingRodInHand(player)).getId() == 'kubejs:perch_bait' ? weight : 0)
)
RegisterFishValue('aquaculture:smallmouth_bass', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:synodontis'), 5)
    .withFluidModifier('minecraft:water', 1)
    .withPlayerModifier((player, weight) => {
        let x = player.x
        let y = player.y
        let z = player.z
        let entityList = player.level.getEntitiesWithin(AABB.of( x + 5, y + 5, z + 5, x - 5, y - 5, z - 5))
        entityList.forEach((entity)=>{
            if (entity == "minecraft:cat"){
                return weight * 9
            }
        })
        return weight
    })
)
RegisterFishValue('aquaculture:synodontis', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:capitaine'), 20)
    .withFluidModifier('minecraft:water', 1)
    .withBiomeModifier("minecraft:river",1)
    .withPlayerModifier((player, weight) => $AquaFishingRodItem.getBait(GetFishingRodInHand(player)).getId() == 'kubejs:bass_bait' ? weight : 0)
)
RegisterFishValue('aquaculture:capitaine', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:boulti'), 5)
    .withFluidModifier('minecraft:water', 1)
    .withBiomeModifier("minecraft:river",1)
    .withPlayerModifier((player, weight) => $AquaFishingRodItem.getBait(GetFishingRodInHand(player)).getId() == 'kubejs:bass_bait' && player.hasEffect("minecraft:strength") ? weight * 10 : weight)
)
RegisterFishValue('aquaculture:boulti', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:muskellunge'), 5)
    .withFluidModifier('minecraft:water', 1)
    .withPlayerModifier((player, weight) => {
        let x = player.x
        let y = player.y
        let z = player.z
        let entityList = player.level.getEntitiesWithin(AABB.of( x + 5, y + 5, z + 5, x - 5, y - 5, z - 5))
        entityList.forEach((entity)=>{
            if (entity == "minecraft:wolf"){
                return weight * 10
            }
        })
        return weight
    })
)
RegisterFishValue('aquaculture:muskellunge', (itemStack, player) => {
    return AverageScoreDistri(itemStack, 10, 20)
})
