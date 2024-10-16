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
 * @param {Internal.Level} level
 * @param {BlockPos} blockPos 
 * @returns {BlockPos[]}
 */
function getRelatedNodeBlockPos(level, blockPos) {
    let block = level.getBlock(blockPos)
    let nbt = block.entityData
    if (!nbt.contains('relatedNodePos')) return []
    let posNbtList = nbt.getList('relatedNodePos', GET_COMPOUND_TYPE)
    return ConvertNbt2PosList(posNbtList)
}

/**
 * 生成深度图
 * 深度图由[深度][节点信息]组成，npc总会尝试从0深度，随机选择节点前进，到达自己能够前往的最深深度后再随机回溯到深度0
 * @param {Internal.Level} level
 * @param {BlockPos} blockPos 
 */
function genDepthMap(level, blockPos) {
    let depthMap = []
    let nodeMap = new Map()
    let initNodeList = [blockPos]
    let depth = 0
    nextNode(blockPos)

    

    /**
     * 
     * @param {blockPos} curNodePos 
     */
    function nextNode(curNodePos) {
        let nearByNodeList = getRelatedNodeBlockPos(level, curNodePos)
        // 如果直接使用BlockPos会因为指向对象不同而导致无法比较，因此使用toString归一化
        nodeMap.set(curNodePos.toString(), nearByNodeList)
        nearByNodeList.forEach(nodePos => {
            if (nodeMap.has(nodePos.toString())) return
        })
    }
}




CustomMachineryEvents.upgrades(event => {
    event.create(Item.of('kubejs:aether_collector_1'))
        .machine('kubejs:aether_gate')
        .modifier(CMRecipeModifierBuilder.mulInput('custommachinery:speed', 1.2).min(10))
        .build()
})