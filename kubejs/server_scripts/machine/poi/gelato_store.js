// priority: 800
/**
 * 状态配方，用于添加控制POI状态的各种配方，往往用于购买状态后的额外信息的处理和同步
 */
ServerEvents.recipes(event => {
    event.recipes.custommachinery.custom_machine('kubejs:gelato_store', 100)
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

// priority: 800
/**
 * @param {EntityWorkInPOI} workInPOIModel 
 * @param {Internal.BlockContainerJS} poiBlock 
 */
function GelatoPOIModel(workInPOIModel, poiBlock) {
    // DefaultPOIModel.call(this, workInPOIModel, poiBlock)
    this.workInPOIModel = workInPOIModel
    this.poiBlock = poiBlock
    this.poiBlockModel = new ShopPOIBlock(poiBlock)
}

GelatoPOIModel.prototype = Object.create(DefaultPOIModel.prototype)
GelatoPOIModel.prototype.constructor = GelatoPOIModel

GelatoPOIModel.prototype.workInPOIInit = function () {
    const poiBlockModel = this.poiBlockModel
    const workInPOIModel = this.workInPOIModel
    const mob = workInPOIModel.mob
    const level = this.poiBlock.level
    let posList = poiBlockModel.getRelatedPosList()
    // todo 需要遍历关联位置，以生成一个可用的需求列表

    const workInPOIConfig = workInPOIModel.workInPOIConfig
    workInPOIConfig.putString('gelatoItem', )

    let entityList = GetLivingWithinRadius(level, mob.position(), 3, (plevel, pentity) => {
        return pentity.isLiving() && GetEntityStatus(pentity) != STATUS_NONE
    })
    if (entityList.length >= 5) {
        // POI周围人数过多，则放弃排队
        return false
    }
    workInPOIModel.setSubStatus(SUB_STATUS_WAITING_INTERACT)
    return true
}

GelatoPOIModel.prototype.workInPOITick = function () {
    const poiBlockModel = this.poiBlockModel
    const workInPOIModel = this.workInPOIModel
    /**@type {Internal.EntityCustomNpc} */
    const mob = workInPOIModel.mob
    switch (workInPOIModel.getSubStatus()) {
        case SUB_STATUS_WAITING_INTERACT:
            return true
        case SUB_STATUS_START_SHOPPING:
            let poiPos = workInPOIModel.poiPos
            mob.lookControl.setLookAt(poiPos.x, poiPos.y, poiPos.z)
            if (poiBlockModel.checkIsShopping()) {
                return true
            } else {
                mob.saySurrounding(new $Line('感觉很实惠！'))
                workInPOIModel.clearMovePos()
                workInPOIModel.setSubStatus(SUB_STATUS_NONE)
                // 跳出子状态
                return false
            }
        default:
            // 没有设置子状态会行进到这里，强制设置到初始化状态
            workInPOIModel.setSubStatus(SUB_STATUS_MOVE_TO_RELATED_POS)
            return true
    }
}


ItemEvents.entityInteracted(event => {
    const {target, player, item} = event
    if (GetEntityStatus(target) != STATUS_WORK_IN_POI) return
    const workInPOIModel = new EntityWorkInPOI(target)
    if (workInPOIModel.getSubStatus() != SUB_STATUS_WAITING_INTERACT) return
    

})