// priority: 500

const RELATE_POSITION_TOOL = 'kubejs:relate_position_tool'

ItemEvents.firstRightClicked(RELATE_POSITION_TOOL, event => {
    let { item, player, level } = event
    let rayTraceResult = player.rayTrace(player.blockReach)
    let block = rayTraceResult.block
    if (block) {
        if (block.tags.contains(TAG_POI_ENTRANCE)) {
            // 选中POI模式
            ClearBlockOutlineRender(player)
            let nbt = item.getOrCreateTag()
            nbt.put('poiPos', ConvertPos2Nbt(block.getPos()))
            RenderBlockOutlineInTime(player, [new OutlineRenderModel(block.getPos(), '#00ea33')], 20 * 15)
            player.setStatusMessage(Text.translatable('status.kubejs.relate_position_tool.selected_poi.1'))
        } else {
            if (!item.hasNBT() || !item.nbt.contains('poiPos')) return
            let poiPos = ConvertNbt2Pos(item.nbt.get('poiPos'))
            let poiBlock = level.getBlock(poiPos)
            if (!poiBlock.tags.contains(TAG_POI_ENTRANCE)) return

            let shopPOIModel = new ShopPOIBlock(poiBlock)
            let posListNbt = shopPOIModel.getRelatedPosListNbt()
            let posList = ConvertNbt2PosList(posListNbt)
            // 选中容器绑定
            if (posList.some(pos => { if (pos.equals(block.getPos())) return true })) return
            posListNbt.add(ConvertPos2Nbt(block.getPos()))
            shopPOIModel.setRelatedPosListNbt(posListNbt)
            RenderBlockOutlineInTimeNbt(player, ConvertBlockPosListNbt2OutlineRenderListNbt(posListNbt.copy(), '#00ea33'), 20 * 15)
            player.setStatusMessage(Text.translatable('status.kubejs.relate_position_tool.add_relate_position.1'))
        }
    } else {
        if (!item.hasNBT() || !item.nbt.contains('poiPos')) return
        ClearBlockOutlineRender(player)
        // 展示所有POI绑定容器
        let poiPos = ConvertNbt2Pos(item.nbt.get('poiPos'))
        let poiBlock = level.getBlock(poiPos)
        if (!poiBlock.tags.contains(TAG_POI_ENTRANCE)) return
        let shopPOIModel = new ShopPOIBlock(poiBlock)
        let posListNbt = shopPOIModel.getRelatedPosListNbt()
        RenderBlockOutlineInTimeNbt(player, ConvertBlockPosListNbt2OutlineRenderListNbt(posListNbt.copy(), '#00ea33'), 20 * 15)
        player.setStatusMessage(Text.translatable('status.kubejs.relate_position_tool.show_relate_position.1'))
    }
    
})

ItemEvents.firstLeftClicked(RELATE_POSITION_TOOL, event => {
    let { item, player, level } = event
    let rayTraceResult = player.rayTrace(player.blockReach)
    let block = rayTraceResult.block
    if (block) {
        if (block.tags.contains(TAG_POI_ENTRANCE)) {
            // 清空POI中的所有绑定容器
            if (!item.hasNBT() || !item.nbt.contains('poiPos')) return
            ClearBlockOutlineRender(player)
            let shopPOIModel = new ShopPOIBlock(block)
            shopPOIModel.setRelatedPosListNbt(new $ListTag())
            player.setStatusMessage(Text.translatable('status.kubejs.relate_position_tool.clear_relate_position.1'))
        } else {
            if (!item.hasNBT() || !item.nbt.contains('poiPos')) return
            let poiPos = ConvertNbt2Pos(item.nbt.get('poiPos'))
            let poiBlock = level.getBlock(poiPos)
            if (!poiBlock.tags.contains(TAG_POI_ENTRANCE)) return

            let shopPOIModel = new ShopPOIBlock(poiBlock)
            let posListNbt = shopPOIModel.getRelatedPosListNbt()
            // 删除容器绑定
            posListNbt.removeIf(posNbt => {
                let pos = ConvertNbt2Pos(posNbt)
                return pos.equals(block.getPos())
            })
            shopPOIModel.setRelatedPosListNbt(posListNbt)
            RemoveBlockOutlineRender(player, [new OutlineRenderModel(block.getPos(), '#00ea33')])
            player.setStatusMessage(Text.translatable('status.kubejs.relate_position_tool.remove_relate_position.1'))
        }        
    } else {
        if (!item.hasNBT() || !item.nbt.contains('poiPos')) return
        // 解除掉工具对于POI的绑定
        ClearBlockOutlineRender(player)
        item.nbt.remove('poiPos')
        player.setStatusMessage(Text.translatable('status.kubejs.relate_position_tool.clear_selected_poi.1'))
    }
})