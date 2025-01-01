// priority: 800
RegistryPOIStrategy('kubejs:grocery', DefaultPOIModel)
ServerEvents.recipes(event => {
    event.recipes.custommachinery.custom_machine('kubejs:grocery', 100)
        .requireFunctionOnEnd(ctx => {
            const { machine, block } = ctx
            const shopPOIModel = new ShopPOIBlock(block)
            const consumeMoney = shopPOIModel.getConsumingMoney()
            machine.data.exp_bar = machine.data.exp_bar ? Math.min(machine.data.exp_bar + consumeMoney, BAR_MAX) : Math.min(consumeMoney, BAR_MAX)
            let coinSlotItem = machine.getItemStored('coin_output')
            if (coinSlotItem && coinSlotItem.hasTag('lightmanscurrency:wallet')) {
                let coinItemList = ConvertMoneyIntoCoinItemList(CoinList, worth)
                coinItemList.forEach(coinItem => {
                    let unpickableItem = $WalletItem.PickupCoin(coinSlotItem, coinItem)
                    ctx.block.popItemFromFace(unpickableItem, Direction.UP)
                })
            } else {
                let playerBankAccount = $BankSaveData.GetBankAccount(false, ctx.machine.ownerId)
                playerBankAccount.depositMoney(ConvertMainMoneyValue(consumeMoney))
            }

            shopPOIModel.setIsShopping(false)
            shopPOIModel.setConsumingMoney  (0)
            return ctx.success()
        })
        .requireFunctionToStart(ctx => {
            /**@type {Internal.BlockContainerJS} */
            let block = ctx.block
            let shopPOIModel = new ShopPOIBlock(block)
            if (shopPOIModel.checkIsShopping()) return ctx.success()
            return ctx.error('invalid')
        })
        .resetOnError()

    event.recipes.custommachinery.custom_machine('kubejs:grocery', 100)
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
            targetPlayer.give(GenExpBottle('kubejs:other', machine.data.exp_bar))
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
