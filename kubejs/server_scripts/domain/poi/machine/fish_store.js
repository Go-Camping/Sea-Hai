// priority: 800
/**
 * 状态配方，用于添加控制POI状态的各种配方，往往用于购买状态后的额外信息的处理和同步
 */
RegistryPOIStrategy('kubejs:fish_store', FishStorePOIModel)
ServerEvents.recipes(event => {
    event.recipes.custommachinery.custom_machine('kubejs:fish_store', 100)
        .requireFunctionOnEnd(ctx => {
            const { machine, block } = ctx
            const shopPOIModel = new ShopPOIBlock(block)
            const consumeMoney = shopPOIModel.getConsumingMoney()
            machine.data.exp_bar = machine.data.exp_bar ? Math.min(machine.data.exp_bar + consumeMoney, BAR_MAX) : Math.min(consumeMoney, BAR_MAX)
            let coinSlotItem = machine.getItemStored('coin_output')
            if (coinSlotItem && coinSlotItem.hasTag('lightmanscurrency:wallet')) {
                $WalletItem.PickupCoin(coinSlotItem, Item.of('lightmanscurrency:coin_copper', consumeMoney))
            } else {
                let playerBankAccount = $BankSaveData.GetBankAccount(false, ctx.machine.ownerId)
                playerBankAccount.depositMoney(ConvertMainMoneyValue(consumeMoney))
            }

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

    event.recipes.custommachinery.custom_machine('kubejs:fish_store', 100)
        .requireFunctionOnEnd(ctx => {
            const machine = ctx.machine
            const block = ctx.block
            const level = block.level
            if (!block.entity || !block.entity.persistentData.contains('interactPlayer')) return ctx.error(Text.translatable('errors.kubejs.machine.no_use_output'))
            let playerUuid = block.entity.persistentData.getUUID('interactPlayer')
            let targetPlayer = level.getPlayerByUUID(playerUuid)
            if (!targetPlayer.isAlive()) return ctx.error(Text.translatable('errors.kubejs.machine.no_use_output'))
            if (!machine.data.exp_bar || machine.data.exp_bar <= 0) {
                return ctx.error(Text.translatable('errors.kubejs.machine.no_use_output'))
            }
            let nbt = new $CompoundTag()
            nbt.putInt('amount', machine.data.exp_bar)
            // 经验类型
            nbt.putString('type', 'kubejs:fishing')
            targetPlayer.give(Item.of('kubejs:exp_bottle').withNBT(nbt))
            machine.data.exp_bar = 0
            return ctx.success()
        })
        .requireButtonPressed('dump_exp')
        .requireFunctionOnStart(ctx => {
            const machine = ctx.machine
            const block = ctx.block
            const level = block.level
            
            if (!block.entity || !block.entity.persistentData.contains('interactPlayer')) return ctx.error(Text.translatable('errors.kubejs.machine.no_use_output'))
            let playerUuid = block.entity.persistentData.getUUID('interactPlayer')
            let targetPlayer = level.getPlayerByUUID(playerUuid)
            if (!targetPlayer.isAlive()) return ctx.error(Text.translatable('errors.kubejs.machine.no_use_output'))

            if (!machine.data.exp_bar || machine.data.exp_bar <= 0) {
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
function FishStorePOIModel(workInPOIModel, poiBlock) {
    DefaultPOIModel.call(this, workInPOIModel, poiBlock)
}

FishStorePOIModel.prototype = Object.create(DefaultPOIModel.prototype)
FishStorePOIModel.prototype.constructor = FishStorePOIModel

/**
 * @param {Internal.ItemStack} item 
 * @returns 
 */
FishStorePOIModel.prototype.consumeConatinerTester = function (item) {
    let res = item.hasNBT() && item.nbt.contains('value')
    // return res && item.hasTag('minecraft:fishes')
    return res
}