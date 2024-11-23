// priority: 800
/**
 * 状态配方，用于添加控制POI状态的各种配方，往往用于购买状态后的额外信息的处理和同步
 */
RegistryPOIStrategy('kubejs:fish_store', FishShopPOIModel)
ServerEvents.recipes(event => {
    event.recipes.custommachinery.custom_machine('kubejs:fish_store', 100)
        .requireFunctionOnEnd(ctx => {
            const { machine, block } = ctx
            const shopPOIModel = new ShopPOIBlock(block)
            const consumeMoney = shopPOIModel.getConsumingMoney()
            machine.addFluidToTank('fishing_exp_tank', Fluid.of('kubejs:fishing_exp_fluid', consumeMoney), false)
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

    event.recipes.custommachinery.custom_machine('kubejs:fish_store', 20)
        .requireFunctionOnEnd(ctx => {
            const machine = ctx.machine
            let fluidStack = machine.getFluidStored('fishing_exp_tank')
            let outputStack = machine.getItemStored('exp_output')
            if (outputStack && !outputStack.isEmpty()) {
                return ctx.error(Text.translatable('errors.kubejs.machine.no_enough_output_space'))
            }
            let nbt = new $CompoundTag()
            nbt.putInt('amount', fluidStack.amount)
            nbt.putString('type', fluidStack.getId())
            machine.setItemStored('exp_output', Item.of('kubejs:exp_bottle').withNBT(nbt))
            machine.removeFluidFromTank('fishing_exp_tank', fluidStack.amount, false)
            return ctx.success()
        })
        .requireButtonPressed('dump_fishing_exp')
        .requireFunctionOnStart(ctx => {
            const machine = ctx.machine
            let fluidStack = machine.getFluidStored('fishing_exp_tank')
            let outputStack = machine.getItemStored('exp_output')
            if (outputStack && !outputStack.isEmpty()) {
                return ctx.error(Text.translatable('errors.kubejs.machine.no_enough_output_space'))
            }
            if (fluidStack.amount <= 0) {
                return ctx.error(Text.translatable('errors.kubejs.machine.no_use_output'))
            }
            return ctx.success()
        })
        .resetOnError()

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