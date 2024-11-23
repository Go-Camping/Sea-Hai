// priority: 800
/**
 * 状态配方，用于添加控制POI状态的各种配方，往往用于购买状态后的额外信息的处理和同步
 */
RegistryPOIStrategy('kubejs:crock_pot_restaurant', CrockPotRestaurantPOIModel)
ServerEvents.recipes(event => {
    event.recipes.custommachinery.custom_machine('kubejs:crock_pot_restaurant', 100)
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
function CrockPotRestaurantPOIModel(workInPOIModel, poiBlock) {
    // DefaultPOIModel.call(this, workInPOIModel, poiBlock)
    this.workInPOIModel = workInPOIModel
    this.poiBlock = poiBlock
    this.poiBlockModel = new ShopPOIBlock(poiBlock)
}

CrockPotRestaurantPOIModel.prototype = Object.create(DefaultPOIModel.prototype)
CrockPotRestaurantPOIModel.prototype.constructor = CrockPotRestaurantPOIModel

CrockPotRestaurantPOIModel.prototype.workInPOIInit = function () {
    const poiBlockModel = this.poiBlockModel
    const workInPOIModel = this.workInPOIModel
    const mob = workInPOIModel.mob
    const level = this.poiBlock.level
    let posList = poiBlockModel.getRelatedPosList()
    posList.forEach(pos => {
        let relatedBlock = level.getBlock(pos)
        if (relatedBlock.id == 'gelato_galore:ice_cream_cauldron') {
            let curFlavor = relatedBlock.entityData.getString('Flavor')
            if (curFlavor && validFlavors.indexOf(curFlavor) == -1) {
                validFlavors.push(curFlavor)
            }
        }
    })
    if (validFlavors.length == 0) return false
    const poiBlock = workInPOIModel.getPOIBlock()

    workInPOIModel.setSubStatus(SUB_STATUS_GELATO_WAITING_INTERACT)
    return true
}



CrockPotRestaurantPOIModel.prototype.workInPOITick = function () {
    const poiBlockModel = this.poiBlockModel
    const workInPOIModel = this.workInPOIModel
    /**@type {Internal.EntityCustomNpc} */
    const mob = workInPOIModel.mob
    switch (workInPOIModel.getSubStatus()) {
        case SUB_STATUS_GELATO_WAITING_INTERACT:
            return true
        case SUB_STATUS_RETURN_TO_POI:
            if (!workInPOIModel.checkArrivedPOIPos(GOTO_POI_DISTANCE_SLOW)) {
                workInPOIModel.moveToPOIPos()
                return true
            }

            if (mob.navigation.isInProgress()) {
                if (workInPOIModel.checkArrivedPOIPos(GOTO_POI_DISTANCE_STOP)) {
                    mob.navigation.setSpeedModifier(1.0)
                    mob.navigation.stop()
                } else {
                    mob.navigation.setSpeedModifier(0.1)
                }
            }

            if (workInPOIModel.getConsumedMoney() <= 0) {
                // 没有消费则直接返回
                workInPOIModel.clearMovePos()
                workInPOIModel.setSubStatus(SUB_STATUS_NONE)
                return false
            }

            if (poiBlockModel.checkIsShopping()) {
                // 等待释放
                return true
            } else {
                // 金额计算逻辑
                let consumedMoney = workInPOIModel.getConsumedMoney()
                workInPOIModel.clearConsumedMoney()
                if (!poiBlockModel.startShopping(mob.uuid, consumedMoney)) {
                    return true
                }
                workInPOIModel.setSubStatus(SUB_STATUS_START_SHOPPING)
                return true
            }
        case SUB_STATUS_START_SHOPPING:
            let poiPos = workInPOIModel.poiPos
            mob.lookControl.setLookAt(poiPos.x, poiPos.y, poiPos.z)
            if (poiBlockModel.checkIsUUIDShopping(mob.uuid)) {
                return true
            } else {
                mob.saySurrounding(new $Line('感觉很实惠！'))
                workInPOIModel.clearMovePos()
                workInPOIModel.setSubStatus(SUB_STATUS_NONE)
                mob.advanced.setLine(LINE_INTERACT, 0, '', '')
                // 跳出子状态
                return false
            }
        default:
            workInPOIModel.clearMovePos()
            workInPOIModel.setSubStatus(SUB_STATUS_NONE)
            return false
    }
}