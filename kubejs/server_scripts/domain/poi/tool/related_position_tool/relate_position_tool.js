// priority: 800
/**
 * @constant
 * @type {RelatedPositionToolModel[]}
 */
const RelatedPositionToolStrategy = []

/**
 * @param {string} id 
 * @param {RelatedPositionToolModel} strategy 
 */
function RegistryRelatedPositionToolStrategy(strategy) {
    RelatedPositionToolStrategy.push(strategy)
}

const RELATE_POSITION_TOOL = 'kubejs:relate_position_tool'

ItemEvents.firstRightClicked(RELATE_POSITION_TOOL, event => {
    let { item, player, level } = event
    let rayTraceResult = player.rayTrace(player.blockReach)
    let block = rayTraceResult.block
    if (block) {
        if (!item.hasNBT() || !item.nbt.contains('savedPos')) {
            // 绑定节点
            RelatedPositionToolStrategy.forEach(strategy => {
                if (strategy.bindingTester(event, block)) {
                    strategy.bindingAction(event, block)
                    return
                }
            })
            return
        } else {
            // 绑定后节点
            let savedPos = ConvertNbt2Pos(item.nbt.get('savedPos'))
            let savedBlock = level.getBlock(savedPos)
            if (savedBlock.getPos().equals(block.getPos())) {
                RelatedPositionToolStrategy.forEach(strategy => {
                    if (strategy.selectBindingTester(event, block, savedBlock)) {
                        strategy.selectBindingAction(event, block, savedBlock)
                        return
                    }
                })
            } else {
                RelatedPositionToolStrategy.forEach(strategy => {
                    if (strategy.aleardyBindingTester(event, block, savedBlock)) {
                        strategy.aleardyBindingAction(event, block, savedBlock)
                        return
                    }
                })
            }
            return
        }
    } else {
        if (item.hasNBT() && item.nbt.contains('savedPos')) {
            let savedPos = ConvertNbt2Pos(item.nbt.get('savedPos'))
            let savedBlock = level.getBlock(savedPos)
            RelatedPositionToolStrategy.forEach(strategy => {
                if (strategy.showBindingTester(event, savedBlock)) {
                    strategy.showBindingAction(event, savedBlock)
                    return
                }
            })
            return
        }
    }
})


ItemEvents.firstLeftClicked(RELATE_POSITION_TOOL, event => {
    let { item, player, level } = event
    let rayTraceResult = player.rayTrace(player.blockReach)
    let block = rayTraceResult.block
    if (block) {

    } else {
        if (!item.hasNBT() || !item.nbt.contains('savedPos')) return
        // 解除掉工具对于POI的绑定
        ClearBlockOutlineRender(player)
        item.nbt.remove('savedPos')
        player.setStatusMessage(Text.translatable('status.kubejs.relate_position_tool.clear_selected_poi.1'))
    }
})


/**
 * 
 * @param {Internal.ServerPlayer} player 
 * @param {Internal.BlockContainerJS} savedBlock 
 * @param {Internal.ListTag} relatedPoiPosListNbt 
 */
function RenderOutlineWithSavedBlock(player, savedBlock, relatedPoiPosListNbt) {
    let outLineBlockNbtList = ConvertBlockPosListNbt2OutlineRenderListNbt(relatedPoiPosListNbt.copy(), '#ff0d00')
    let savedPos = ConvertPos2Nbt(savedBlock.pos)
    savedPos.putString('color', '#00ff0d')
    outLineBlockNbtList.add(savedPos)
    RenderBlockOutlineInTimeNbt(player, outLineBlockNbtList, 20 * 15)
}