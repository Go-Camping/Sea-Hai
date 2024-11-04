// priority: 800
/**
 * 状态配方，用于添加控制POI状态的各种配方，往往用于购买状态后的额外信息的处理和同步
 */
RegistryPOIStrategy('kubejs:fish_store', FishShopPOIModel)
ServerEvents.recipes(event => {
    event.recipes.custommachinery.custom_machine('kubejs:fish_store', 100)
        .requireFunctionOnEnd(ctx => {
            const { machine, block } = ctx
            const owner = machine.getOwner()
            const shopPOIModel = new ShopPOIBlock(block)
            let consumeMoney = shopPOIModel.getConsumingMoney()
            if (owner && owner.isPlayer()) {
                let player = owner
                let playerSkill = new PufferskillModel(player)
                let fishingCate = playerSkill.getSkillCategory('kubejs:fishing')
                playerSkill.addExpToCategory(fishingCate, consumeMoney)
            }
            let playerBankAccount = $BankSaveData.GetBankAccount(false, ctx.machine.ownerId)
            playerBankAccount.depositMoney(ConvertMainMoneyValue(consumeMoney))
            
            shopPOIModel.setIsShopping(false)
            shopPOIModel.setConsumingMoney(0)
            return ctx.success()
        })
        .requireFunctionToStart(ctx => {
            /**@type {Internal.BlockContainerJS} */
            let block = ctx.block
            let shopPOIModel = new ShopPOIBlock(block)
            if (shopPOIModel.checkIsShopping()) return ctx.success()
            return ctx.error('invalid')
        })
})

/** 
* @param {EntityWorkInPOI} workInPOIModel 
* @param {Internal.BlockContainerJS} poiBlock 
*/
function FishShopPOIModel(workInPOIModel, poiBlock) {
    DefaultPOIModel.call(this, workInPOIModel, poiBlock)
}

FishShopPOIModel.prototype = Object.create(DefaultPOIModel.prototype)
FishShopPOIModel.prototype.constructor = FishShopPOIModel

/**
 * @param {Internal.ItemStack} item 
 * @returns 
 */
FishShopPOIModel.prototype.consumeConatinerTester = function (item) {
    let res = item.hasNBT() && item.nbt.contains('value')
    // return res && item.hasTag('minecraft:fishes')
    return res
}