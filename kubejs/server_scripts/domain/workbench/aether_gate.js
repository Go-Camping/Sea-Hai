// priority: 800
ServerEvents.recipes(event => {
    event.recipes.custommachinery.custom_machine('kubejs:aether_gate', 300)
        .requireFunctionEachTick(ctx => {
            const { machine, block } = ctx
            let particle = Utils.particleOptions(`crit`)
            block.level.spawnParticles(particle, true, block.x, block.y + 0.1, block.z, 0, 0.5, 0, 1, 0.1)
            block.level.spawnParticles(particle, true, block.x + 1, block.y + 0.1, block.z, 0, 0.5, 0, 1, 0.1)
            block.level.spawnParticles(particle, true, block.x, block.y + 0.1, block.z + 1, 0, 0.5, 0, 1, 0.1)
            block.level.spawnParticles(particle, true, block.x + 1, block.y + 0.1, block.z + 1, 0, 0.5, 0, 1, 0.1)
            return ctx.success()
        })
        .requireFunctionOnEnd(ctx => {
            const { machine, block } = ctx
            let stateItem = machine.getItemStored('state')
            if (!stateItem || !stateItem.hasNBT()) return ctx.error('no target')

            let entity = CreateCustomNPCEntity(block.level)
            let pos = RandomOffsetPos(block.pos, 5)
            entity.setPos(pos.x, pos.y + 1, pos.z)
            let num = Math.ceil(Math.random() * 17)
            entity.display.setSkinTexture(`kubejs:textures/entity/skin/guest_${num}.png`)
            let routeMoveModel = new EntityRouteMove(entity)
            let nodePosList = genDepthMap(block.level, block.pos)
            routeMoveModel.setRelatedPosList(nodePosList)
            SetEntityStatus(entity, STATUS_ROUTE_MOVE)
            block.level.addFreshEntity(entity)
            return ctx.success()
        })
        .requireFunctionToStart(ctx => {
            let machine = ctx.machine
            let stateItem = machine.getItemStored('state')
            if (stateItem && !stateItem.isEmpty()) return ctx.success()
            return ctx.error('')
        })
        .resetOnError()
})

/**
 * @param {Internal.BlockContainerJS} block
 * @returns {BlockPos[]}
 */
function getRelatedNodeBlockPos(block) {
    let nbt = block.entity.persistentData
    if (!nbt.contains('relatedNodePos')) return []
    let posNbtList = nbt.getList('relatedNodePos', GET_COMPOUND_TYPE)
    return ConvertNbt2PosList(posNbtList)
}

/**
 * 获取可行的路径
 * @param {Internal.Level} level
 * @param {BlockPos} spawnPos 
 * @returns {BlockPos[]}
 */
function genDepthMap(level, spawnPos) {
    // 回溯节点Map，key为目标节点，value为回溯路径
    /** @type {Map<BlockPos, BlockPos>} */
    let nodeMap = new Map()
    /** @type {Map<BlockPos, number>} */
    let nodeDepthMap = new Map()
    let exitNodeList = []
    let targetNodeList = []
    let depth = 0
    nextNode(spawnPos)

    // 从目标回溯进入路径
    /** @type {BlockPos} */
    if (targetNodeList.length <= 0) return resNodeList
    let targetNodePos = RandomGet(targetNodeList)

    let resNodeList = getWayNodeList(targetNodePos)
    /** @type {BlockPos} */
    let possibleExit = RandomGet(exitNodeList)
    if (possibleExit.equals(spawnPos)) {
        // 原路返回
        resNodeList = resNodeList.concat(resNodeList.slice(0, -1).reverse())
        resNodeList.push(possibleExit)
    } else if (possibleExit.equals(targetNodePos)) {
        // 就地遣散
        return resNodeList
    } else {
        // 回溯返回
        let exitWayNodeList = getWayNodeList(possibleExit)
        for (let i = 0; i < Math.min(resNodeList.length, exitWayNodeList.length); i++) {
            if (resNodeList[i].equals(exitWayNodeList[i])) {
                continue
            } else {
                // 回溯节点
                resNodeList = resNodeList
                    .concat(resNodeList.slice(i - 1, -1).reverse())
                    .concat(exitWayNodeList.slice(i))
                break
            }
        }
    }
    return resNodeList


    /**
     * @param {BlockPos} curNodePos 
     */
    function nextNode(curNodePos) {
        nodeDepthMap.set(curNodePos.hashCode(), depth++)
        let block = level.getBlock(curNodePos)
        // 区分目标类型
        if (block.tags.contains(TAG_NODE_ENTRANCE)) exitNodeList.push(curNodePos)
        let nearByNodeList = getRelatedNodeBlockPos(block)
        // 打乱节点顺序，这会使得每次生成的路径都不相同
        Shuffle(nearByNodeList)
        let canBeTarget = true
        nearByNodeList.forEach(nodePos => {
            let key = nodePos.hashCode()
            if (!nodeMap.has(key)) {
                nodeMap.set(key, curNodePos)
            }
            if (!nodeDepthMap.has(key)) {
                nextNode(nodePos)
                canBeTarget = false
            }
        })

        // 如果一个节点后继没有新的节点，则说明这个节点是终点
        if ((block.tags.contains(TAG_NODE_BLOCK) || block.tags.contains(TAG_NODE_ENTRANCE)) && canBeTarget) targetNodeList.push(curNodePos)
    }


    /**
     * @param {BlockPos} targetWayNodePos 
     * @returns {BlockPos[]}
     */
    function getWayNodeList(targetWayNodePos) {
        let wayNodeList = []
        findNextWayNode(targetWayNodePos)
        return wayNodeList
        /**
         * 
         * @param {BlockPos} curWayNodePos 
         * @returns 
         */
        function findNextWayNode(curWayNodePos) {
            let key = curWayNodePos.hashCode()
            if (nodeDepthMap.has(key) && nodeDepthMap.get(key) <= 0) return
            // 因为是逆向搜索，需要将地点插入到最前面
            wayNodeList.unshift(curWayNodePos)
            if (nodeMap.has(key)) {
                /** @type {BlockPos} */
                let validBackNode = nodeMap.get(key)
                findNextWayNode(validBackNode)
            }
            return
        }
    }
}




CustomMachineryEvents.upgrades(event => {
    event.create(Item.of('kubejs:aether_collector_1'))
        .machine('kubejs:aether_gate')
        .modifier(CMRecipeModifierBuilder.mulInput('custommachinery:speed', 1.2).min(10))
        .build()
})