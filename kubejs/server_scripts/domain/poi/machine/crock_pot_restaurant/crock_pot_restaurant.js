// priority: 800
/**
 * 状态配方，用于添加控制POI状态的各种配方，往往用于购买状态后的额外信息的处理和同步
 */
RegistryPOIStrategy('kubejs:crock_pot_restaurant', CrockPotRestaurantPOIModel)
ServerEvents.recipes(event => {
    event.recipes.custommachinery.custom_machine('kubejs:crock_pot_restaurant', 100)
        .requireFunctionOnEnd(ctx => {
            const { machine, block } = ctx
            const shopPOIModel = new ShopPOIBlock(block)
            if (!shopPOIModel.consumeMoneyOnMachine(machine)) {
                return ctx.error('')
            }
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

    event.recipes.custommachinery.custom_machine('kubejs:crock_pot_restaurant', 100)
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
            targetPlayer.give(GenExpBottle('kubejs:cooking', machine.data.exp_bar))
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
    if (validTableList.length <= 0) return false
    /** @type {Internal.ItemStack} */
    let needMenuItem = RandomGet(menuItems)
    workInPOIModel.addMenuItem(needMenuItem)
    workInPOIModel.setTargetPos(RandomGet(validTableList))
    workInPOIModel.setSubStatus(SUB_STATUS_MOVE_RESTAURANT_TABLE)
    return true
}



CrockPotRestaurantPOIModel.prototype.workInPOITick = function () {
    const workInPOIModel = this.workInPOIModel
    /**@type {Internal.EntityCustomNpc} */
    switch (workInPOIModel.getSubStatus()) {
        case SUB_STATUS_MOVE_RESTAURANT_TABLE:
            return CrockPotRestaurantMoveResturantTable(this)
        case SUB_STATUS_WAITING_FOR_DISHES:
            return CrockPotRestaurantWaitingForDishes(this)
        case SUB_STATUS_EATING_FOOD:
            return CrockPotRestaurantEatingFood(this)
        case SUB_STATUS_RETURN_TO_POI:
            return CrockPotRestaurantReturnToPOI(this)
        case SUB_STATUS_START_SHOPPING:
            return CrockPotRestaurantStartShopping(this)
        default:
            workInPOIModel.clearTargetPos()
            workInPOIModel.setSubStatus(SUB_STATUS_NONE)
            return false
    }
}

/**
 * @param {CrockPotRestaurantPOIModel} crockPotRestaurantPOIModel 
 * @returns {boolean}
 */
function CrockPotRestaurantMoveResturantTable(crockPotRestaurantPOIModel) {
    const workInPOIModel = crockPotRestaurantPOIModel.workInPOIModel
    /**@type {Internal.EntityCustomNpc} */
    const mob = workInPOIModel.mob
    const level = mob.level
    if (!workInPOIModel.checkArrivedTargetPos(GOTO_POS_DISTANCE_STOP)) {
        workInPOIModel.moveToTargetPos()
        return true
    }
    let targetTableBlock = level.getBlock(workInPOIModel.getTargetPos())
    let chairBlock = FindNearestBlockAroundBlock(targetTableBlock, 2, 1, (curBlock) => {
        if (curBlock.hasTag(TAG_CHAIR_BLOCK) && !curBlock.blockState.getValue(BLOCKSTATE_TUCKED)) {
            if (IsAnyOnChair(curBlock)) return false
            return true
        }
    })
    if (!chairBlock) return false
    let chairFacing = chairBlock.blockState.getValue(BLOCKSTATE_DIRECTION).getOpposite()
    SitOnChair(mob, chairBlock.pos, 0.5, chairFacing, false)
    mob.navigation.stop()
    workInPOIModel.setSubStatus(SUB_STATUS_WAITING_FOR_DISHES)
    workInPOIModel.setWaitTimer(20 * 5)
    return true
}

/**
 * @param {CrockPotRestaurantPOIModel} crockPotRestaurantPOIModel 
 * @returns {boolean}
 */
function CrockPotRestaurantWaitingForDishes(crockPotRestaurantPOIModel) {
    const workInPOIModel = crockPotRestaurantPOIModel.workInPOIModel
    /**@type {Internal.EntityCustomNpc} */
    const mob = workInPOIModel.mob
    if (!workInPOIModel.checkArriveWaitTimer()) return true
    let menuItems = workInPOIModel.getMenuItems()
    if (menuItems.length <= 0) return false
    let needMenuItem = menuItems[0]
    // 寻找对应道具
    let selectBlock = FindNearestBlock(mob, 1, 1, 0, (curBlock) => {
        if (curBlock.id == needMenuItem.id) {
            return true
        } else if (curBlock.entity && curBlock.entity instanceof $TilePlacedItems) {
            let plonkItemTile = curBlock.entity
            for (let i = 0; i < plonkItemTile.allItems.size(); i++) {
                let curItem = plonkItemTile.getItem(i)
                if (curItem.item.id == needMenuItem.id) {
                    return true
                }
            }
        }
    })
    if (!selectBlock) {
        workInPOIModel.setWaitTimer(20 * 5)
        return true
    }
    workInPOIModel.setTargetPos(selectBlock.pos)
    workInPOIModel.setSubStatus(SUB_STATUS_EATING_FOOD)
    workInPOIModel.setWaitTimer(20 * 10)
    return true
}


/**
 * @param {CrockPotRestaurantPOIModel} crockPotRestaurantPOIModel 
 * @returns {boolean}
 */
function CrockPotRestaurantEatingFood(crockPotRestaurantPOIModel) {
    const workInPOIModel = crockPotRestaurantPOIModel.workInPOIModel
    /**@type {Internal.EntityCustomNpc} */
    const mob = workInPOIModel.mob
    const level = mob.level
    let targetPos = workInPOIModel.getTargetPos()
    let targetBlock = level.getBlock(targetPos)
    if (!workInPOIModel.checkArriveWaitTimer()) {
        mob.lookControl.setLookAt(targetPos.x, targetPos.y, targetPos.z)
        if (mob.totalTicksAlive % 10 == 0) {
            mob.swing()
            mob.playSound('minecraft:entity.generic.eat')
        }
        return true
    }

    let menuItems = workInPOIModel.getMenuItems()
    if (menuItems.length <= 0) {
        workInPOIModel.setSubStatus(SUB_STATUS_RETURN_TO_POI)
        return true
    }
    let needMenuItem = menuItems[0]
    if (targetBlock.id == needMenuItem.id) {
        level.removeBlock(targetPos, false)
    } else if (targetBlock.entity && targetBlock.entity instanceof $TilePlacedItems) {
        let plonkItemTile = targetBlock.entity
        let itemLen = plonkItemTile.allItems.size()
        if (itemLen <= 0) {
            workInPOIModel.setWaitTimer(20 * 5)
            workInPOIModel.setSubStatus(SUB_STATUS_WAITING_FOR_DISHES)
            return true
        }

        let hasMenuItem = false
        for (let i = 0; i < itemLen; i++) {
            let curItem = plonkItemTile.getItem(i)
            if (curItem.item.id == needMenuItem.id) {
                plonkItemTile.removeItem(i, needMenuItem.count)
                hasMenuItem = true
                break
            }
        }
        if (!hasMenuItem) {
            workInPOIModel.setWaitTimer(20 * 5)
            workInPOIModel.setSubStatus(SUB_STATUS_WAITING_FOR_DISHES)
            return true
        }
    } else {
        workInPOIModel.setWaitTimer(20 * 5)
        workInPOIModel.setSubStatus(SUB_STATUS_WAITING_FOR_DISHES)
        return true
    }

    if (needMenuItem.count == 1) {
        workInPOIModel.clearMenuItems()
    } else if (needMenuItem.count > 1) {
        workInPOIModel.clearMenuItems()
        workInPOIModel.setMenuItems(needMenuItem.withCount(needMenuItem.count - 1))
    }
    workInPOIModel.setConsumedMoney(100)
    mob.playSound('minecraft:entity.player.burp')
    let curMenuItems = workInPOIModel.getMenuItems()
    if (curMenuItems.length <= 0) {
        mob.unRide()
        workInPOIModel.setSubStatus(SUB_STATUS_RETURN_TO_POI)
        return true
    }
    workInPOIModel.setWaitTimer(20 * 5)
    workInPOIModel.setSubStatus(SUB_STATUS_WAITING_FOR_DISHES)
    return true
}

/**
 * @param {CrockPotRestaurantPOIModel} crockPotRestaurantPOIModel 
 * @returns {boolean}
 */
function CrockPotRestaurantReturnToPOI(crockPotRestaurantPOIModel) {
    const workInPOIModel = crockPotRestaurantPOIModel.workInPOIModel
    /**@type {Internal.EntityCustomNpc} */
    const mob = workInPOIModel.mob
    const poiBlockModel = crockPotRestaurantPOIModel.poiBlockModel
    if (!workInPOIModel.checkArrivedPOIPos(GOTO_POI_DISTANCE_STOP)) {
        workInPOIModel.moveToPOIPos()
        return true
    } else {
        mob.navigation.stop()
    }
    if (workInPOIModel.getConsumedMoney() <= 0) {
        // 没有消费则直接返回
        workInPOIModel.clearTargetPos()
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
}


/**
 * @param {CrockPotRestaurantPOIModel} crockPotRestaurantPOIModel 
 * @returns {boolean}
 */
function CrockPotRestaurantStartShopping(crockPotRestaurantPOIModel) {
    const workInPOIModel = crockPotRestaurantPOIModel.workInPOIModel
    /**@type {Internal.EntityCustomNpc} */
    const mob = workInPOIModel.mob
    const poiBlockModel = crockPotRestaurantPOIModel.poiBlockModel
    let poiPos = workInPOIModel.poiPos
    mob.lookControl.setLookAt(poiPos.x, poiPos.y, poiPos.z)
    if (poiBlockModel.checkIsUUIDShopping(mob.uuid)) {
        return true
    } else {
        NPCSaySurrounding(mob, NPC_LINE_AFTER_SHOPPING_SATISFIED)
        workInPOIModel.clearTargetPos()
        workInPOIModel.setSubStatus(SUB_STATUS_NONE)
        mob.advanced.setLine(LINE_INTERACT, 0, '', '')
        // 跳出子状态
        return false
    }
}