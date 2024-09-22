// priority: 500

const SHOP_TOOL = 'minecraft:pink_dye'


ItemEvents.firstRightClicked(SHOP_TOOL, event => {
    let { item, player, level } = event
    let rayTraceResult = player.rayTrace(player.blockReach)
    let block = rayTraceResult.block
    if (block) {
        if (block.blockState.tags.anyMatch(tag => tag.equals(TAG_POI_ENTRANCE))) {
            // 选中POI模式
            ClearBlockOutlineRender(player)
            let nbt = item.getOrCreateTag()
            nbt.put('poiPos', ConvertPos2Nbt(block.getPos()))
            RenderBlockOutlineInTime(player, [block.getPos()], 20 * 15)
            player.setStatusMessage(Text.translatable('msg.kubejs.shop_tool.selected_poi.1'))
            return
        } else {
            if (!item.hasNBT() || !item.nbt.contains('poiPos')) return
            let poiPos = ConvertNbt2Pos(item.nbt.get('poiPos'))
            let poiBlock = level.getBlock(poiPos)
            if (!poiBlock.blockState.tags.anyMatch(tag => tag.equals(TAG_POI_ENTRANCE))) return

            let shopPOIModel = new ShopPOIBlock(poiBlock)
            let posListNbt = shopPOIModel.getPosListNbt()
            let posList = ConvertNbt2PosList(posListNbt)
            // 选中容器绑定
            if (posList.some(pos => { if (pos.equals(block.getPos())) return true })) return
            posListNbt.add(ConvertPos2Nbt(block.getPos()))
            shopPOIModel.setPosListNbt(posListNbt)
            RenderBlockOutlineInTimeNbt(player, posListNbt, 20 * 15)
            player.setStatusMessage(Text.translatable('msg.kubejs.shop_tool.add_poi_container.1'))
            return
        }
    } else {
        if (!item.hasNBT() || !item.nbt.contains('poiPos')) return
        ClearBlockOutlineRender(player)
        // 展示所有POI绑定容器
        let poiPos = ConvertNbt2Pos(item.nbt.get('poiPos'))
        let poiBlock = level.getBlock(poiPos)
        if (!poiBlock.blockState.tags.anyMatch(tag => tag.equals(TAG_POI_ENTRANCE))) return
        let shopPOIModel = new ShopPOIBlock(poiBlock)
        let posListNbt = shopPOIModel.getPosListNbt()
        RenderBlockOutlineInTimeNbt(player, posListNbt, 20 * 15)
        player.setStatusMessage(Text.translatable('msg.kubejs.shop_tool.show_poi_container.1'))
    }
})

ItemEvents.firstLeftClicked(SHOP_TOOL, event => {
    let { item, player, level } = event
    let rayTraceResult = player.rayTrace(player.blockReach)
    let block = rayTraceResult.block
    if (block) {
        if (block.blockState.tags.anyMatch(tag => tag.equals(TAG_POI_ENTRANCE))) {
            if (!item.hasNBT() || !item.nbt.contains('poiPos')) return
            ClearBlockOutlineRender(player)
            let shopPOIModel = new ShopPOIBlock(block)
            shopPOIModel.setPosListNbt(new $ListTag())
            player.setStatusMessage(Text.translatable('msg.kubejs.shop_tool.clear_poi_container.1'))
            return
        } else {
            if (!item.hasNBT() || !item.nbt.contains('poiPos')) return
            let poiPos = ConvertNbt2Pos(item.nbt.get('poiPos'))
            let poiBlock = level.getBlock(poiPos)
            if (!poiBlock.blockState.tags.anyMatch(tag => tag.equals(TAG_POI_ENTRANCE))) return

            let shopPOIModel = new ShopPOIBlock(poiBlock)
            let posListNbt = shopPOIModel.getPosListNbt()
            // 删除容器绑定
            posListNbt.removeIf(posNbt => {
                let pos = ConvertNbt2Pos(posNbt)
                return pos.equals(block.getPos())
            })
            shopPOIModel.setPosListNbt(posListNbt)
            RemoveBlockOutlineRender(player, posListNbt, 20 * 15)
            ClearBlockOutlineRender(player)
            RenderBlockOutlineInTimeNbt(player, posListNbt, 20 * 15)
            player.setStatusMessage(Text.translatable('msg.kubejs.shop_tool.remove_poi_container.1'))
            return
        }
    } else {
        if (!item.hasNBT() || !item.nbt.contains('poiPos')) return
        ClearBlockOutlineRender(player)
        item.nbt.remove('poiPos')
        player.setStatusMessage(Text.translatable('msg.kubejs.shop_tool.clear_selected_poi.1'))
    }
})