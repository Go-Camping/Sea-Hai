// priority: 800
ServerEvents.recipes(event => {
    event.recipes.custommachinery.custom_machine('kubejs:aether_gate', 1000)
        .requireFunctionEachTick(ctx => {
            if (ctx.remainingTime % 100 != 0) return ctx.success()

            let { machine, block } = ctx

            let item = machine.getItemStored('route_marker')
            let entity = CreateCustomNPCEntity(block.level)
            let pos = RandomOffsetPos(block.pos, 5)
            entity.setPos(pos.x, pos.y, pos.z)
            let num = Math.ceil(Math.random() * 11)
            entity.display.setSkinTexture(`kubejs:textures/entity/skin/guest_${num}.png`)
            let routeMoveModel = new EntityRouteMove(entity)
            routeMoveModel.setPosListNbt(item.nbt.getList('posList', GET_COMPOUND_TYPE))
            SetEntityStatus(entity, STATUS_ROUTE_MOVE)
            block.level.addFreshEntity(entity)
            return ctx.success()
        })
        .requireFunctionToStart(ctx => {
            let machine = ctx.machine
            let item = machine.getItemStored('route_marker')
            if (item && !item.isEmpty()) return ctx.success()
            return ctx.error('')
        })

})

/**
 * @param {Internal.BlockContainerJS} block
 * @returns {BlockPos[]}
 */
function getRelatedNodeBlockPos(block) {
    let nbt = block.entityData
    if (!nbt.contains('relatedNodePos')) return []
    let posNbtList = nbt.getList('relatedNodePos', GET_COMPOUND_TYPE)
    return ConvertNbt2PosList(posNbtList)
}

/**
 * 获取可行的路径
 * @param {Internal.Level} level
 * @param {BlockPos} spawnPos 
 */
function genDepthMap(level, spawnPos) {
    // 回溯节点Map，key为目标节点，value为回溯路径
    /** @type {Map<string, BlockPos[]>} */
    let nodeMap = new Map()
    /** @type {Map<string, number>} */
    let nodeDepthMap = new Map()
    let exitNodeList = []
    let targetNodeList = []
    let depth = 0
    nextNode(spawnPos)

    // 从目标回溯进入路径
    /** @type {BlockPos} */
    let targetNodePos = RandomGet(targetNodeList)

    let resNodeList = getWayNodeList(targetNodePos)
    /** @type {BlockPos} */
    let possibleExit = RandomGet(exitNodeList)
    if (possibleExit.equals(spawnPos)) {
        resNodeList.push(resNodeList.slice(0, resNodeList.length - 1).reverse())
    } else {
        let exitWayNodeList = getWayNodeList(possibleExit)
        for (i = 0; i < Math.min(resNodeList.length, exitWayNodeList.length); i++) {
            if (resNodeList[i].equals(exitWayNodeList[i])) {
                continue
            } else {
                // 回溯节点
                resNodeList.push(resNodeList.slice(i - 1, resNodeList.length - 1).reverse())
                // 退出节点
                resNodeList.push(exitNodeList.slice(i, exitNodeList.length))
                break
            }
        }
    }
    return resNodeList


    /**
     * @param {blockPos} curNodePos 
     */
    function nextNode(curNodePos) {
        nodeDepthMap.set(key, depth++)
        let block = level.getBlock(curNodePos)
        let nearByNodeList = getRelatedNodeBlockPos(block)
        nodeList.push(curNodePos)
        // 区分目标类型
        if (block.tags.contains(TAG_NODE_ENTRANCE)) exitNodeList.push(curNodePos)
        else if (block.tags.contains(TAG_NODE_BLOCK)) targetNodeList.push(curNodePos)
        // 如果直接使用BlockPos会因为指向对象不同而导致无法比较，因此使用toString归一化
        nearByNodeList.forEach(nodePos => {
            let key = nodePos.toString()
            if (nodeMap.has(key)) {
                // 因为nextNode遍历的pos不会重复，所以nodeMap各节点也不会出现重复的pos
                nodeMap.set(key, nodeMap.get(key).push(curNodePos))
            } else {
                nodeMap.set(key, [curNodePos])
            }
            if (!nodeDepthMap.has(key)) {
                nextNode(nodePos)
            }
        })
    }


    /**
     * @param {BlockPos} targetNodePos 
     * @returns {BlockPos[]}
     */
    function getWayNodeList(targetNodePos) {
        let wayNodeList = []
        findNextNode(targetNodePos)
        function findNextNode(targetNodePos) {
            let key = targetNodePos.toString()
            if (nodeDepthMap.has(key) && nodeDepthMap.get(key) <= 0) return
            // 因为是逆向搜索，需要将地点插入到最前面
            wayNodeList.unshift(targetNodePos)
            if (nodeMap.has(key)) {
                let validBackNodes = nodeMap.get(key)
                findNextNode(RandomGet(validBackNodes))
            } else {
                console.warn('nodeMap does not exist nodeBlockPos:' + key)
            }
        }
        return wayNodeList
    }
}




CustomMachineryEvents.upgrades(event => {
    event.create(Item.of('kubejs:aether_collector_1'))
        .machine('kubejs:aether_gate')
        .modifier(CMRecipeModifierBuilder.mulInput('custommachinery:speed', 1.2).min(10))
        .build()
})