// priority: 500

const FISHING_ROD_TAG = 'forge:tools/fishing_rods'
const FISH_TAG = 'forge:raw_fishes'
LootJS.modifiers((event) => {
    event.addLootTypeModifier('fishing')
    .apply(ctx => {
        if (!ctx.player) return
        let player = ctx.player
        let fishingItem = GetFishingRodInHand(player)

        if (!fishingItem || fishingItem.isEmpty()) return
        let fishingRodModel = new FishingRodModel(fishingItem)
        if (fishingRodModel.hook.id == 'aquaculture:light_hook') {
            ctx.loot.forEach(item => {
                if (item.hasTag(FISH_TAG)) {
                    let nbt = item.getOrCreateTag()
                    nbt.putInt('value', 100)
                }
            })
        }
    })
})

const FISHING_LOOT_MAP = {
    
}