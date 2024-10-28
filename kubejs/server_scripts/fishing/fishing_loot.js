// priority: 500

const FISHING_ROD_TAG = 'forge:tools/fishing_rods'
const FISH_TAG = 'forge:raw_fishes'
LootJS.modifiers((event) => {
    event.addLootTypeModifier('fishing')
    .apply(ctx => {
        if (!ctx.player) return
        let player = ctx.player
        let fishingItem = GetFishingRodInHand(player)

        if (!fishingItem) return
        let fishingItemHandler = $AquaFishingRodItem.getHandler(fishingItem)
        fishingItemHandler.allItems.forEach(item => {
            if (!FishingItemStrategy[item.id]) return
            let itemModel = FishingItemStrategy[item.id](item)
            itemModel.lootModify(ctx)
        })
    })
})