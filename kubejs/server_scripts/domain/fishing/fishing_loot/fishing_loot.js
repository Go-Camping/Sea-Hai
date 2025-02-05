// priority: 500
/** @type {CustomFishingLootModel[]} */
const FISHING_ROD_TAG = 'forge:tools/fishing_rods'
const FISH_TAG = 'forge:raw_fishes'


LootJS.modifiers((event) => {
    event.addLootTypeModifier(LootType.FISHING)
        .removeLoot(ItemFilter.ALWAYS_TRUE)
        .apply(ctx => {
            ctx.loot.clear()
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

            // 根据自定义LootTable选择可能产物
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

            let lootList = []
            if (validWeightFishingLoot.weightRandomList.length <= 0) {
                lootList.push(Item.of('minecraft:flint'))
            } else {
                lootList.push(validWeightFishingLoot.getWeightRandomObj())
            }

            // 根据价值表计算初始价值
            lootList.forEach(lootItem => {
                if (!FishingValueMap[lootItem.id]) {
                    ctx.addLoot(lootItem)
                    return
                }
                for (let i = 0; i < lootItem.count; i++) {
                    ctx.addLoot(FishingValueMap[lootItem.id](lootItem.withCount(1), player))
                    return
                }
            })

            // 执行鱼竿策略
            let fishingItem = GetFishingRodInHand(player)
            if (!fishingItem) return
            let fishingItemHandler = $AquaFishingRodItem.getHandler(fishingItem)
            let fishingItemList = []
            fishingItemHandler.allItems.forEach(item => {
                fishingItemList.push(item.id)
            })
            FishingItemLootModifyStrategy.run(fishingItemList, [ctx])
            FishingLootModifySkill.run(player, [ctx])
        })
})

