// priority: 500
/** @type {CustomFishingLootModel[]} */
const FISHING_ROD_TAG = 'forge:tools/fishing_rods'
const FISH_TAG = 'forge:raw_fishes'


LootJS.modifiers((event) => {
    event.addLootTypeModifier(LootType.FISHING)
        .removeLoot(Ingredient.all)
        .apply(ctx => {
            if (!ctx.player) return
            const player = ctx.player
            if (!ctx.player.fishing) return
            const fishing = ctx.player.fishing

            let validWeightFishingLoot = new WeightRandomModel()
            let biome = ctx.level.getBiome(ctx.blockPos).toString()
            let weather = RainLevelMap[ctx.level.rainLevel]
            if (!fishing.inFluidType) return
            let fluid = fishing.getEyeInFluidType().toString()
            let time = ctx.level.dayTime()

            FishingLootList.forEach(loot => {
                let weight = loot.weight
                if (Object.keys(loot.fluid).length > 0) {
                    if (!loot.fluid[fluid]) return
                    weight = loot.fluid[fluid] * weight
                }

                if (Object.keys(loot.biome).length > 0) {
                    if (!loot.biome[biome]) return
                    weight = loot.biome[biome] * weight
                }

                if (Object.keys(loot.weather).length > 0) {
                    if (!loot.weather[weather]) return
                    weight = loot.weather[weather] * weight
                }

                if (loot.timeRange) {
                    weight = loot.timeRange(time, weight)
                }
                if (loot.playerFunc) {
                    weight = loot.playerFunc(player, weight)
                }
                if (weight > 0) {
                    validWeightFishingLoot.addWeightRandom(loot.item, Math.floor(weight))
                }
            })

            if (validWeightFishingLoot.weightRandomList.length <= 0) {
                ctx.addLoot(Item.of('minecraft:flint'))
            } else {
                ctx.addLoot(validWeightFishingLoot.getWeightRandomObj())
            }

            let fishingItem = GetFishingRodInHand(player)
            if (!fishingItem) return
            let fishingItemHandler = $AquaFishingRodItem.getHandler(fishingItem)
            let strategyList = []
            fishingItemHandler.allItems.forEach(item => {
                if (!FishingItemStrategy[item.id]) return
                let itemModel = FishingItemStrategy[item.id](item)
                strategyList.push(itemModel)
            })
            strategyList.sort((a, b) => b.priority - a.priority).forEach(itemModel => {
                itemModel.lootModify(ctx)
            })
        })
})




const FishingValueMap = {
    'aquaculture:box_turtle': {
        'maxValue': 100,
        'minValue': 1,
        'fluid': 'minecraft:water'
    },
    'aquaculture:goldfish': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:tuna': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:red_grouper': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:arrau_turtle': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:starshell_turtle': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:atlantic_cod': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:blackfish': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:pacific_halibut': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:atlantic_halibut': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:atlantic_herring': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:pink_salmon': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:pollock': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:rainbow_trout': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:bayad': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:boulti': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:capitaine': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:synodontis': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:smallmouth_bass': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:bluegill': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:brown_trout': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:carp': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:catfish': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:gar': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:minnow': {
        'maxValue': 100,
        'minValue': 1
    },
    '{Damage:0}': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:muskellunge': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:perch': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:arapaima': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:piranha': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:tambaqui': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:brown_shrooma': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:red_shrooma': {
        'maxValue': 100,
        'minValue': 1
    },
    'aquaculture:jellyfish': {
        'maxValue': 100,
        'minValue': 1
    },
    'lavafishing:quartz_fish': {
        'maxValue': 100,
        'minValue': 1
    },
    'lavafishing:agni_fish': {
        'maxValue': 100,
        'minValue': 1
    },
    'lavafishing:steam_flying_fish': {
        'maxValue': 100,
        'minValue': 1
    },
    'lavafishing:lava_lamprey': {
        'maxValue': 100,
        'minValue': 1
    },
    'lavafishing:scaly_foot_snail': {
        'maxValue': 100,
        'minValue': 1
    },
    'lavafishing:yeti_crab': {
        'maxValue': 100,
        'minValue': 1
    },
    'lavafishing:arowana_fish': {
        'maxValue': 100,
        'minValue': 1
    },
    'lavafishing:obsidian_sword_fish': {
        'maxValue': 100,
        'minValue': 1
    },
    'lavafishing:flame_squat_lobster': {
        'maxValue': 100,
        'minValue': 1
    }
}

