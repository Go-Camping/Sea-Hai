// priority: 800
const CrabPotOutputSlotName = ['output_1', 'output_2', 'output_3', 'output_4', 'output_5', 'output_6']
ServerEvents.recipes(event => {
    event.recipes.custommachinery.custom_machine('kubejs:crab_pot', 24)
        .requireFunctionOnEnd(ctx => {
            const { machine } = ctx
            let lootList = Utils.rollChestLoot('kubejs:crab_pot/water_crab_bait')
            lootList.forEach(lootItem => {
                if (!FishingValueMap[lootItem.id]) {
                    insertLoot(ctx, lootItem)
                    return
                }
                for (let i = 0; i < lootItem.count; i++) {
                    insertLoot(ctx, FishingValueMap[lootItem.id](lootItem.withCount(1), machine.getOwner()))
                    return
                }
            })
            return ctx.success()
        })
        .requireItemTag('kubejs:crab_bait', 1, 'bait_input')
        .requireStructure(
            [
                ["aaa", "aaa", "aaa"],
                ["aaa", "ama", "aaa"],
                ["aaa", "aaa", "aaa"]
            ],
            { "a": "minecraft:water" })
        // .resetOnError()
})

/**
 * @param {Internal.RecipeFunction} ctx 
 * @param {Internal.ItemStack} item
 */
function insertLoot(ctx, item) {
    const { machine, block } = ctx
    for (let i = 0; i < CrabPotOutputSlotName.length; i++) {
        let slot = CrabPotOutputSlotName[i]
        let canAdd = machine.addItemToSlot(slot, item, true).isEmpty()
        if (canAdd) {
            machine.addItemToSlot(slot, item, false)
            return
        }
    }
    block.popItemFromFace(item, Direction.UP)
    return
}

