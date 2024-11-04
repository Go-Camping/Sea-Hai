// priority: 800
RegistryPOIStrategy('kubejs:sword_store', DefaultPOIModel)
ServerEvents.recipes(event => {
    event.recipes.custommachinery.custom_machine('kubejs:sword_store', 100)
        .requireFunctionOnEnd(ctx => {
            /**@type {Internal.BlockContainerJS} */
            const block = ctx.block
            const shopPOIModel = new ShopPOIBlock(block)

            let playerBankAccount = $BankSaveData.GetBankAccount(false, ctx.machine.ownerId)
            playerBankAccount.depositMoney(ConvertMainMoneyValue(shopPOIModel.getConsumingMoney()))
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