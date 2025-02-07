// priority: 600
RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:tuna'), 2)
        .withFluidModifier('minecraft:water', 1)
        .withBiomeModifier('minecraft:deep_ocean', 1)
        .withPlayerModifier((player, weight) => ($AquaFishingRodItem.getBait(GetFishingRodInHand(player))).getId() == 'kubejs:squid_bait' ? weight * 5 : weight)
)
RegisterFishValue('aquaculture:tuna', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 300, 800)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:atlantic_halibut'), 5)
        .withFluidModifier('minecraft:water', 1)
        .withBiomeModifier('minecraft:deep_ocean', 1)
        .withTimeRangeModifier((time, weight) => time < 6000 ? weight * 4 : weight)
)
RegisterFishValue('aquaculture:atlantic_halibut', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 40, 120)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:pacific_halibut'), 5)
        .withFluidModifier('minecraft:water', 1)
        .withBiomeModifier('minecraft:deep_lukewarm_ocean', 1)
        .withTimeRangeModifier((time, weight) => time < 6000 ? weight * 4 : weight)
)
RegisterFishValue('aquaculture:pacific_halibut', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 40, 120)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:arapaima'), 5)
        .withFluidModifier('minecraft:water', 1)
        .withBiomeModifier('minecraft:warm_ocean', 1)
        .withBiomeModifier('minecraft:lukewarm_ocean', 3)
        .withTimeRangeModifier((time, weight) => time < 6000 ? weight * 2 : weight)
)
RegisterFishValue('aquaculture:arapaima', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 80, 200)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:capitaine'), 5)
        .withFluidModifier('minecraft:water', 1)
        .withBiomeModifier('minecraft:river', 1)
        .withPlayerModifier((player, weight) => $AquaFishingRodItem.getBait(GetFishingRodInHand(player)).getId() == 'kubejs:bass_bait' ? weight * 3 : 0)
)
RegisterFishValue('aquaculture:capitaine', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 120, 250)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:red_grouper'), 3)
        .withFluidModifier('minecraft:water', 1)
        .withBiomeModifier('minecraft:warm_ocean', 5)
        .withBiomeModifier('minecraft:lukewarm_ocean', 1)
        .withTimeRangeModifier((time, weight) => time > 13000 ? weight : 0)
)
RegisterFishValue('aquaculture:red_grouper', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 150, 400)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:minnow'), 5)
        .withFluidModifier('minecraft:water', 1)
        .withBiomeModifier('minecraft:river', 1)
        .withPlayerModifier((player, weight) => player.luck >= 10 ? weight * 8 : weight)
)
RegisterFishValue('aquaculture:minnow', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 10, 300)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:boulti'), 2)
        .withFluidModifier('minecraft:water', 1)
        .withBiomeModifier('minecraft:river', 1)
        .withPlayerModifier((player, weight) => $AquaFishingRodItem.getBait(GetFishingRodInHand(player)).getId() == 'kubejs:bass_bait' && player.hasEffect('minecraft:strength') ? weight * 10 : weight)
)
RegisterFishValue('aquaculture:boulti', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 30, 200)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:pollock'), 3)
        .withFluidModifier('minecraft:water', 1)
        .withBiomeModifier('minecraft:deep_ocean', 1)
        .withTimeRangeModifier((time, weight) => time > 12000 && time < 18000 ? weight * 2 : weight)
        .withPlayerModifier((player, weight) => $AquaFishingRodItem.getBait(GetFishingRodInHand(player)).getId() == 'kubejs:cod_bait' ? weight * 4 : weight)
)
RegisterFishValue('aquaculture:pollock', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 150, 250)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:brown_trout'), 2)
        .withFluidModifier('minecraft:water', 1)
        .withBiomeModifier('minecraft:cold_ocean', 5)
        .withBiomeModifier('minecraft:frozen_ocean', 1)
        .withTimeRangeModifier((time, weight) => time > 12000 ? weight * 2 : weight)
        .withPlayerModifier((player, weight) => $AquaFishingRodItem.getBait(GetFishingRodInHand(player)).getId() == 'kubejs:salmon_bait' ? weight : 0)
)
RegisterFishValue('aquaculture:brown_trout', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 150, 600)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:bluegill'), 10)
        .withFluidModifier('minecraft:water', 1)
        .withTimeRangeModifier((time, weight) => time > 13800 && time < 22200 ? 0 : weight)
        .withPlayerModifier((player, weight) => player.block.canSeeSky ? weight : 0)
)
RegisterFishValue('aquaculture:bluegill', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 20, 80)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:blackfish'), 5)
        .withFluidModifier('minecraft:water', 1)
        .withTimeRangeModifier((time, weight) => time > 13000 ? weight * 3 : weight)
)
RegisterFishValue('aquaculture:blackfish', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 20, 80)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:atlantic_herring'), 5)
        .withFluidModifier('minecraft:water', 1)
        .withBiomeModifier('minecraft:deep_ocean', 1)
        .withTimeRangeModifier((time, weight) => time > 18000 ? weight * 4 : weight)
)
RegisterFishValue('aquaculture:atlantic_herring', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 50, 250)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:pink_salmon'), 2)
        .withFluidModifier('minecraft:water', 1)
        .withBiomeModifier('minecraft:cold_ocean', 5)
        .withBiomeModifier('minecraft:frozen_ocean', 1)
        .withTimeRangeModifier((time, weight) => time > 12000 ? weight * 2 : weight)
)
RegisterFishValue('aquaculture:pink_salmon', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 150, 300)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('minecraft:salmon'), 5)
        .withFluidModifier('minecraft:water', 1)
)
RegisterFishValue('minecraft:salmon', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 10, 40)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('minecraft:pufferfish'), 5)
        .withFluidModifier('minecraft:water', 1)
)
RegisterFishValue('minecraft:pufferfish', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 10, 100)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:perch'), 20)
        .withFluidModifier('minecraft:water', 1)
)
RegisterFishValue('aquaculture:perch', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 10, 80)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:carp'), 10)
        .withFluidModifier('minecraft:water', 1)
)
RegisterFishValue('aquaculture:carp', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 20, 100)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:smallmouth_bass'), 10)
        .withFluidModifier('minecraft:water', 1)
        .withPlayerModifier((player, weight) => $AquaFishingRodItem.getBait(GetFishingRodInHand(player)).getId() == 'kubejs:puffer_bait' ? weight : 0)
)
RegisterFishValue('aquaculture:smallmouth_bass', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 200, 500)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:gar'), 5)
        .withFluidModifier('minecraft:water', 1)
        .withPlayerModifier((player, weight) => player.getBlock().down == 'minecraft:mud' ? weight * 4 : 0)
)
RegisterFishValue('aquaculture:gar', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 50, 200)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:tambaqui'), 3)
        .withFluidModifier('hotbath:hot_water_fluid_type', 1)
)
RegisterFishValue('aquaculture:tambaqui', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 100, 400)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:synodontis'), 3)
        .withFluidModifier('minecraft:water', 1)
        .withPlayerModifier((player, weight) => {
            let { x, y, z } = player
            let entityList = player.level.getEntitiesWithin(AABB.of(x + 5, y + 5, z + 5, x - 5, y - 5, z - 5))
            for (let i = 0; i < entityList.length; i++) {
                if (entityList[i] =='minecraft:cat') {
                    return weight * 8
                } 
            }
            return 0
        })
)
RegisterFishValue('aquaculture:synodontis', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 40, 160)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('minecraft:cod'), 3)
        .withFluidModifier('minecraft:water', 1)
)
RegisterFishValue('minecraft:cod', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 10, 40)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('minecraft:tropical_fish'), 3)
        .withFluidModifier('minecraft:water', 1)
        .withBiomeModifier('minecraft:warm_ocean', 3)
        .withBiomeModifier('minecraft:lukewarm_ocean', 3)
)
RegisterFishValue('minecraft:tropical_fish', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 30, 80)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:rainbow_trout'), 1)
        .withFluidModifier('minecraft:water', 1)
        .withWeatherModifier('rain', 2)
        .withWeatherModifier('thunder', 10)
        .withTimeRangeModifier((time, weight) => time > 18000 && time < 22200 ? weight * 5 : weight)
)
RegisterFishValue('aquaculture:rainbow_trout', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 400, 800)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:piranha'), 2)
        .withFluidModifier('minecraft:water', 1)
        .withPlayerModifier((player, weight) => ($AquaFishingRodItem.getBait(GetFishingRodInHand(player))).getId() == 'kubejs:meat_bait' ? weight * 10 : weight)
)
RegisterFishValue('aquaculture:piranha', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 30, 500)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:red_shrooma'), 5)
        .withFluidModifier('minecraft:water', 1)
        .withWeatherModifier('rain', 1)
        .withWeatherModifier('thunder', 3)
        .withPlayerModifier((player, weight) => {
            return $AquaFishingRodItem.getBait(GetFishingRodInHand(player)).getId() == 'kubejs:mushroom_bait' ? weight * 5 : 0
        })
)
RegisterFishValue('aquaculture:red_shrooma', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 350, 800)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:brown_shrooma'), 1)
        .withFluidModifier('hotbath:hot_water_fluid_type', 1)
        .withPlayerModifier((player, weight) => {
            return $AquaFishingRodItem.getBait(GetFishingRodInHand(player)).getId() == 'kubejs:mushroom_bait' ? weight * 5 : 0
        })
)
RegisterFishValue('aquaculture:brown_shrooma', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 200, 600)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:catfish'), 5)
        .withFluidModifier('minecraft:water', 1)
        .withBiomeModifier('minecraft:swamp', 4)
)
RegisterFishValue('aquaculture:catfish', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 50, 180)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:bayad'), 2)
        .withFluidModifier('hotbath:hot_water_fluid_type', 1)
        .withTimeRangeModifier((time, weight) => time > 13800 && time < 22200 ? weight * 3 : weight)
        .withPlayerModifier((player, weight) => ($AquaFishingRodItem.getBait(GetFishingRodInHand(player))).hasTag('forge:raw_fishes') ? weight * 5 : weight)
)
RegisterFishValue('aquaculture:bayad', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 200, 800)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:atlantic_cod'), 5)
        .withFluidModifier('minecraft:water', 1)
        .withBiomeModifier('minecraft:deep_ocean', 1)
        .withTimeRangeModifier((time, weight) => time > 12000 && time < 18000 ? weight * 4 : weight)
)
RegisterFishValue('aquaculture:atlantic_cod', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 60, 120)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:muskellunge'), 3)
        .withFluidModifier('minecraft:water', 1)
        .withPlayerModifier((player, weight) => {
            let { x, y, z } = player
            let entityList = player.level.getEntitiesWithin(AABB.of(x + 5, y + 5, z + 5, x - 5, y - 5, z - 5))
            for (let i = 0; i < entityList.length; i++) {
                if (entityList[i] =='minecraft:wolf') {
                    return weight * 8
                } 
            }
            return 0
        })
)
RegisterFishValue('aquaculture:muskellunge', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 40, 160)
})


RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('lavafishing:quartz_fish'), 5)
        .withFluidModifier('tconstruct:molten_diamond', 1)
        .withTimeRangeModifier((time, weight) => time > 22200 ? weight * 3 : weight)
)
RegisterFishValue('lavafishing:quartz_fish', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 350, 700)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('lavafishing:agni_fish'), 2)
        .withFluidModifier('minecraft:lava', 1)
        .withTimeRangeModifier((time, weight) => time < 8000 && time > 5000 ? weight * 3 : weight)
        .withPlayerModifier((player, weight) => player.hasEffect('minecraft:glowing') ? weight * 3 : weight)
)
RegisterFishValue('lavafishing:agni_fish', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 200, 500)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('lavafishing:steam_flying_fish'), 1)
        .withFluidModifier('minecraft:lava', 1)
        .withPlayerModifier((player, weight) => player.y < 30 ? weight * 10 : weight)
)
RegisterFishValue('lavafishing:steam_flying_fish', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 250, 600)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('lavafishing:lava_lamprey'), 5)
        .withFluidModifier('minecraft:lava', 1)
        .withWeatherModifier('clear', 1)
        .withTimeRangeModifier((time, weight) => time > 6000 ? weight * 2 : weight)
)
RegisterFishValue('lavafishing:lava_lamprey', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 150, 300)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('lavafishing:arowana_fish'), 1)
        .withFluidModifier('minecraft:lava', 1)
        .withPlayerModifier((player, weight) => player.luck >= 10 ? weight * 5 : weight)
)
RegisterFishValue('lavafishing:arowana_fish', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 400, 650)
})

RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('lavafishing:obsidian_sword_fish'), 1)
        .withFluidModifier('minecraft:lava', 1)
        .withTimeRangeModifier((time, weight) => time > 13800 && time < 22200 ? weight * 5 : weight)
)
RegisterFishValue('lavafishing:obsidian_sword_fish', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 500, 750)
})


RegisterFishingLoot(
    new CustomFishingLootModel(Item.of('aquaculture:brown_shrooma'), 1)
        .withFluidModifier('minecraft:lava', 1)
        .withTimeRangeModifier((time, weight) => time > 13800 && time < 22200 ? weight * 5 : weight)
)
RegisterFishValue('lavafishing:obsidian_sword_fish', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 500, 750)
})


// 蟹笼产出
RegisterFishValue('lavafishing:yeti_crab', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 10, 20)
})
RegisterFishValue('aquaculture:jellyfish', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 10, 20)
})
RegisterFishValue('aquaculture:goldfish', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 10, 20)
})
RegisterFishValue('aquaculture:box_turtle', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 10, 20)
})
RegisterFishValue('aquaculture:starshell_turtle', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 10, 20)
})
RegisterFishValue('aquaculture:arrau_turtle', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 10, 20)
})
RegisterFishValue('lavafishing:scaly_foot_snail', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 10, 20)
})
RegisterFishValue('lavafishing:flame_squat_lobster', (itemStack, player) => {
    return AverageScoreDistri(itemStack, player, 10, 20)
})