// priority: 600
const FishingLootList = []
const RainLevelMap = ['clear', 'rain', 'thunder']

function RegisterFishingLoot(customFishingLootModel) {
    FishingLootList.push(customFishingLootModel)
}

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('lavafishing:quartz_fish'), 20)
        .withFluidModifier('minecraft:lava', 1)
        .withTimeRangeModifier((time, weight) => time > 22200 ? weight * 3 : weight)
)
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('lavafishing:agni_fish'), 2)
        .withFluidModifier('minecraft:lava', 1)
        .withTimeRangeModifier((time, weight) => time < 8000 && time > 5000 ? weight * 3 : weight)
        .withPlayerModifier((player, weight) => player.hasEffect('minecraft:glowing') ? weight * 3 : weight)
)
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('lavafishing:steam_flying_fish'), 2)
        .withFluidModifier('minecraft:lava', 5)
        .withFluidModifier('minecraft:water', 1)
        .withPlayerModifier((player, weight) => player.y < 30 ? weight * 3 : weight)
)
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('lavafishing:lava_lamprey'), 10)
        .withFluidModifier('minecraft:lava', 1)
        .withWeatherModifier('clear', 1)
        .withTimeRangeModifier((time, weight) => time > 6000 ? weight * 2 : weight)
)
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('lavafishing:arowana_fish'), 1)
        .withFluidModifier('minecraft:lava', 1)
        .withPlayerModifier((player, weight) => player.luck >= 10 ? weight * 5 : weight)
)
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('lavafishing:obsidian_sword_fish'), 10)
        .withFluidModifier('minecraft:lava', 1)
        .withTimeRangeModifier((time, weight) => time > 13800 && time < 22200 ? weight * 3 : weight)
)



// todo 需要添加的战利品
/**
 * [aquaculture:minnow', 'aquaculture:red_grouper', 'aquaculture:red_shrooma', 'aquaculture:brown_shrooma', 'aquaculture:tambaqui', 'aquaculture:piranha', 'aquaculture:arapaima', 'aquaculture:perch', 'aquaculture:tuna', 'aquaculture:blackfish', 'aquaculture:atlantic_cod', 'aquaculture:atlantic_herring', 'aquaculture:atlantic_halibut', 'aquaculture:pacific_halibut', 'aquaculture:bayad', 'aquaculture:rainbow_trout', 'aquaculture:pollock', 'aquaculture:pink_salmon', 'aquaculture:gar', 'aquaculture:catfish', 'aquaculture:carp', 'aquaculture:brown_trout', 'aquaculture:bluegill', 'aquaculture:smallmouth_bass', 'aquaculture:synodontis', 'aquaculture:capitaine', 'aquaculture:boulti', 'aquaculture:muskellunge']
 */