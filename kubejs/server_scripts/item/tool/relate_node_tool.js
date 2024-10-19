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
            RenderBlockOutlineInTime(player, [new OutlineRenderModel(block.getPos(), '#000000')], 20 * 15)
            player.setStatusMessage(Text.translatable('status.kubejs.poi_container_tool.selected_poi.1'))
        } else {
            
            let nodePos = ConvertNbt2Pos(item.nbt.get('nodePos'))
            let nodeBlock = level.getBlock(nodePos)
            if (!nodeBlock.entity) return
            player.tell(1)
            let nodeEntity = nodeBlock.entity
            let relatedNodePosListNbt = nodeEntity.persistentData.getList('relatedNodePos', GET_COMPOUND_TYPE)
            let relatedNodePosList = ConvertNbt2PosList(relatedNodePosListNbt)
            // 选中node绑定
            if (relatedNodePosList.some(pos => { if (pos.equals(block.getPos())) return true })) return
            relatedNodePosListNbt.add(ConvertPos2Nbt(block.getPos()))
            nodeEntity.persistentData.put('relatedNodePos', relatedNodePosListNbt)
            RenderBlockOutlineInTimeNbt(player, ConvertBlockPosListNbt2OutlineRenderListNbt(relatedNodePosListNbt.copy(), '#000000'), 20 * 15)
            player.setStatusMessage(Text.translatable('status.kubejs.poi_container_tool.add_poi_container.1'))
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
        RenderBlockOutlineInTimeNbt(player, ConvertBlockPosListNbt2OutlineRenderListNbt(relatedNodePosListNbt.copy(), '#000000'), 20 * 15)
        player.setStatusMessage(Text.translatable('status.kubejs.poi_container_tool.show_poi_container.1'))
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
            player.setStatusMessage(Text.translatable('status.kubejs.poi_container_tool.clear_poi_container.1'))
        } else {
            let relatedNodePosListNbt = nodeEntity.persistentData.getList('relatedNodePos', GET_COMPOUND_TYPE)
            // 删除node绑定
            relatedNodePosListNbt.removeIf(posNbt => {
                let pos = ConvertNbt2Pos(posNbt)
                return pos.equals(block.getPos())
            })
            nodeEntity.persistentData.put('relatedNodePos', relatedNodePosListNbt)
            RemoveBlockOutlineRender(player, [new OutlineRenderModel(block.getPos(), '#000000')])
            player.setStatusMessage(Text.translatable('status.kubejs.poi_container_tool.remove_poi_container.1'))
        }        
    } else {
        if (!item.hasNBT() || !item.nbt.contains('nodePos')) return
        // 解除掉工具对于node的绑定
        item.nbt.remove('nodePos')
        ClearBlockOutlineRender(player)
        player.setStatusMessage(Text.translatable('status.kubejs.poi_container_tool.clear_selected_poi.1'))
    }
})