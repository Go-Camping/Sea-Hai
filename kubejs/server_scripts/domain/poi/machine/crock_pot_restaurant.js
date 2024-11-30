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
    const poiBlock = this.poiBlock
    const machine = ConvertBlockEntity2MachineJS(poiBlock.entity)
    if (!machine) return false
    let menuItems = GetMachineMenuItems(machine)
    if (menuItems.length <= 0) return false
    let posList = poiBlockModel.getRelatedPosList()
    if (posList.length <= 0) return false
    console.log('posList', posList)
    let validTableList = []
    posList.forEach(pos => {
        let relatedBlock = level.getBlock(pos)
        if (relatedBlock.hasTag(TAG_TABLE_BLOCK)) {
            let validChair = FindNearestBlockAroundBlock(relatedBlock, 2, 1, (curBlock) => {
                if (curBlock.hasTag(TAG_CHAIR_BLOCK)) {
                    if (IsAnyOnChair(curBlock)) return false
                }
                return true
            })
            if (validChair) {
                validTableList.push(pos)
            }
        }
    })
    console.log('validTableList', validTableList)
    if (validTableList.length <= 0) return false
    /** @type {Internal.ItemStack} */
    let needMenuItem = RandomGet(menuItems)
    workInPOIModel.addMenuItem(needMenuItem)
    workInPOIModel.setTargetMovePos(RandomGet(validTableList))
    workInPOIModel.setSubStatus(SUB_STATUS_MOVE_RESTAURANT_TABLE)
    console.log(0)
    return true
}



CrockPotRestaurantPOIModel.prototype.workInPOITick = function () {
    const poiBlockModel = this.poiBlockModel
    const workInPOIModel = this.workInPOIModel
    /**@type {Internal.EntityCustomNpc} */
    const mob = workInPOIModel.mob
    const level = mob.level
    switch (workInPOIModel.getSubStatus()) {
        case SUB_STATUS_MOVE_RESTAURANT_TABLE:
            if (!workInPOIModel.checkArrivedTargetMovePos(GOTO_POS_DISTANCE_SLOW)) {
                workInPOIModel.moveToTargetPos()
                return true
            }
            let targetTableBlock = level.getBlock(workInPOIModel.getTargetMovePos())
            let chairBlock = FindNearestBlockAroundBlock(targetTableBlock, 2, 1, (curBlock) => {
                if (curBlock.hasTag(TAG_CHAIR_BLOCK) && !curBlock.blockState.getValue(BLOCKSTATE_TUCKED)) {
                    if (IsAnyOnChair(curBlock)) return false
                    return true
                }
            })
            
            if (!chairBlock) return false
            console.log(chairBlock.blockState.getValue(BLOCKSTATE_DIRECTION))
            SitOnChair(mob, chairBlock.pos, 0.5, chairBlock.blockState.getValue(BLOCKSTATE_DIRECTION))
            workInPOIModel.setSubStatus(SUB_STATUS_WAITING_FOR_DISHES)
            workInPOIModel.setWaitTimer(20 * 10)

            return false
        case SUB_STATUS_WAITING_FOR_DISHES:
            if (workInPOIModel.checkArriveWaitTimer()) return true
            let menuItems = workInPOIModel.getMenuItems()
            if (menuItems.length <= 0) return false
            let needMenuItem = menuItems[0]
            let selectBlock = FindNearestBlock(mob, 1, 1, 0, (curBlock) => {
                if (curBlock.id == needMenuItem.id) {
                    level.removeBlock(curBlock.pos, false)
                    if (needMenuItem.count == 1) {
                        workInPOIModel.clearMenuItems()
                        workInPOIModel.setSubStatus(SUB_STATUS_RETURN_TO_POI)
                    } else if (needMenuItem.count > 1) {
                        workInPOIModel.clearMenuItems()
                        workInPOIModel.setMenuItems(needMenuItem.withCount(needMenuItem.count - 1))
                    }
                    return true
                }
                if (curBlock.id == 'plonk:placed_items' && curBlock.entityData) {
                    let nbt = curBlock.entityData
                    if (nbt.contains('Items')) return false
                    let plonkItemsNbt = nbt.getList('Items', GET_COMPOUND_TYPE)
                    for (let i = 0; i < plonkItemsNbt.size(); i++) {
                        let plonkItemNbt = plonkItemsNbt.getCompound(i)
                        if (plonkItemNbt.getString('id') != needMenuItem.id) continue
                        let hasCount = plonkItemNbt.getInt('Count')
                        if (hasCount < needMenuItem.count) {
                            workInPOIModel.setMenuItems(needMenuItem.withCount(needMenuItem.count - hasCount))
                            plonkItemsNbt.remove(i)
                            workInPOIModel.setWaitTimer(20 * 10)
                        } else if (hasCount == needMenuItem.count) {
                            plonkItemsNbt.remove(i)
                            workInPOIModel.clearMenuItems()
                            workInPOIModel.setSubStatus(SUB_STATUS_RETURN_TO_POI)
                        } else {
                            plonkItemNbt.putInt('Count', hasCount - needMenuItem.count)
                            workInPOIModel.clearMenuItems()
                            workInPOIModel.setSubStatus(SUB_STATUS_RETURN_TO_POI)
                        }
                    }
                    return true
                }
            })
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