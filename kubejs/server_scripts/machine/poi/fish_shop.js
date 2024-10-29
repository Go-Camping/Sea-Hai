// priority: 800
/**
 * 状态配方，用于添加控制POI状态的各种配方，往往用于购买状态后的额外信息的处理和同步
 */
ServerEvents.recipes(event => {
    event.recipes.custommachinery.custom_machine('kubejs:fish_shop', 100)
        .requireFunctionOnEnd(ctx => {
            let { machine, block } = ctx
            let owner = machine.getOwner()
            let shopPOIModel = new ShopPOIBlock(block)
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