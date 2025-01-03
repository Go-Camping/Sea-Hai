// priority: 500

const RELATE_NODE_TOOL = 'kubejs:relate_node_tool'

ItemEvents.firstRightClicked(RELATE_NODE_TOOL, event => {
    let { item, player, level } = event
    let rayTraceResult = player.rayTrace(player.blockReach)
    let block = rayTraceResult.block
    if (block && (block.tags.contains(TAG_NODE_BLOCK) || block.tags.contains(TAG_NODE_ENTRANCE))) {
        if (!item.hasNBT() || !item.nbt.contains('nodePos')) {
            // 选中POI模式
            ClearBlockOutlineRender(player)
            let nbt = item.getOrCreateTag()
            nbt.put('nodePos', ConvertPos2Nbt(block.getPos()))
            RenderBlockOutlineInTime(player, [new OutlineRenderModel(block.getPos(), '#00ea33')], 20 * 15)
            player.setStatusMessage(Text.translatable('status.kubejs.relate_position_tool.selected_poi.1'))
        } else {
            let nodePos = ConvertNbt2Pos(item.nbt.get('nodePos'))
            let nodeBlock = level.getBlock(nodePos)
            if (!nodeBlock.entity || nodeBlock.getPos().equals(block.getPos())) return
            let nodeEntity = nodeBlock.entity
            let relatedNodePosListNbt = nodeEntity.persistentData.getList('relatedNodePos', GET_COMPOUND_TYPE)
            let relatedNodePosList = ConvertNbt2PosList(relatedNodePosListNbt)
            // 选中node绑定
            if (relatedNodePosList.some(pos => { if (pos.equals(block.getPos())) return true })) return
            relatedNodePosListNbt.add(ConvertPos2Nbt(block.getPos()))
            nodeEntity.persistentData.put('relatedNodePos', relatedNodePosListNbt)
            nodeEntity.setChanged()
            RenderBlockOutlineInTimeNbt(player, ConvertBlockPosListNbt2OutlineRenderListNbt(relatedNodePosListNbt.copy(), '#00ea33'), 20 * 15)
            player.setStatusMessage(Text.translatable('status.kubejs.relate_position_tool.add_relate_position.1'))
        }
    } else {
        if (!item.hasNBT() || !item.nbt.contains('nodePos')) return
        ClearBlockOutlineRender(player)
        // 展示所有node绑定的node
        let nodePos = ConvertNbt2Pos(item.nbt.get('nodePos'))
        let nodeBlock = level.getBlock(nodePos)
        if (!nodeBlock.entity) return
        let nodeEntity = nodeBlock.entity
        let relatedNodePosListNbt = nodeEntity.persistentData.getList('relatedNodePos', GET_COMPOUND_TYPE)
        RenderBlockOutlineInTimeNbt(player, ConvertBlockPosListNbt2OutlineRenderListNbt(relatedNodePosListNbt.copy(), '#00ea33'), 20 * 15)
        player.setStatusMessage(Text.translatable('status.kubejs.relate_position_tool.show_relate_position.1'))
    }
    
})

ItemEvents.firstLeftClicked(RELATE_NODE_TOOL, event => {
    let { item, player, level } = event
    let rayTraceResult = player.rayTrace(player.blockReach)
    let block = rayTraceResult.block
    if (block && (block.tags.contains(TAG_NODE_BLOCK) || block.tags.contains(TAG_NODE_ENTRANCE))) {
        if (!item.hasNBT() || !item.nbt.contains('nodePos')) return
        let nodePos = ConvertNbt2Pos(item.nbt.get('nodePos'))
        let nodeBlock = level.getBlock(nodePos)
        if (!nodeBlock.entity) return
        let nodeEntity = nodeBlock.entity

        if (nodePos.equals(block.getPos())) {
            // 清空node中的所有绑定node
            ClearBlockOutlineRender(player)
            nodeEntity.persistentData.remove('relatedNodePos')
            nodeEntity.setChanged()
            player.setStatusMessage(Text.translatable('status.kubejs.relate_position_tool.clear_relate_position.1'))
        } else {
            let relatedNodePosListNbt = nodeEntity.persistentData.getList('relatedNodePos', GET_COMPOUND_TYPE)
            // 删除node绑定
            relatedNodePosListNbt.removeIf(posNbt => {
                let pos = ConvertNbt2Pos(posNbt)
                return pos.equals(block.getPos())
            })
            nodeEntity.persistentData.put('relatedNodePos', relatedNodePosListNbt)
            nodeEntity.setChanged()
            RemoveBlockOutlineRender(player, [new OutlineRenderModel(block.getPos(), '#00ea33')])
            player.setStatusMessage(Text.translatable('status.kubejs.relate_position_tool.remove_relate_position.1'))
        }        
    } else {
        if (!item.hasNBT() || !item.nbt.contains('nodePos')) return
        // 解除掉工具对于node的绑定
        item.nbt.remove('nodePos')
        ClearBlockOutlineRender(player)
        player.setStatusMessage(Text.translatable('status.kubejs.relate_position_tool.clear_selected_poi.1'))
    }
})