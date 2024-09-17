// priority: 500

const SHOP_TOOL = 'minecraft:pink_dye'


ItemEvents.firstRightClicked(SHOP_TOOL, event => {
    let { item, player, level } = event
    let rayTraceResult = player.rayTrace(player.blockReach)
    let block = rayTraceResult.block
    ClearBlockOutlineRender(player)
    if (block) {
        if (block.blockState.tags.anyMatch(tag => tag.equals(TAG_POI_ENTRANCE))) {
            // 选中POI模式
            let nbt = item.getOrCreateTag()
            nbt.put('targetPOIPos', ConvertPos2Nbt(block.getPos()))
            RenderBlockOutlineInTime(player, [block.getPos()], 20 * 15)
            player.setStatusMessage(Text.translatable('msg.kubejs.shop_tool.selected_poi.1'))
            return
        } else {
            if (!item.hasNBT() || !item.nbt.contains('targetPOIPos')) return
            let targetPOIPos = ConvertNbt2Pos(item.nbt.get('targetPOIPos'))
            let targetPOIBlock = level.getBlock(targetPOIPos)
            if (!targetPOIBlock.blockState.tags.anyMatch(tag => tag.equals(TAG_POI_ENTRANCE))) return
            let targetPOITile = targetPOIBlock.getEntity()
            let targetPOIPersistentData = targetPOITile.getPersistentData()

            let posListNbt = new $ListTag()
            if (targetPOIPersistentData.contains('posList')) {
                posListNbt = targetPOIPersistentData.getList('posList', GET_COMPOUND_TYPE)
            }
            // 选中容器绑定
            posListNbt.add(ConvertPos2Nbt(block.getPos()))
            targetPOIPersistentData.put('posList', posListNbt)
            RenderBlockOutlineInTimeNbt(player, posListNbt, 20 * 15)
            player.setStatusMessage(Text.translatable('msg.kubejs.shop_tool.add_poi_container.1'))
            return
        }
    } else {
        if (!item.hasNBT() || !item.nbt.contains('targetPOIPos')) return
        // 展示所有POI绑定容器
        let targetPOIPos = ConvertNbt2Pos(item.nbt.get('targetPOIPos'))
        let targetPOIBlock = level.getBlock(targetPOIPos)
        if (!targetPOIBlock.blockState.tags.anyMatch(tag => tag.equals(TAG_POI_ENTRANCE))) return
        let targetPOITile = targetPOIBlock.getEntity()
        let targetPOIPersistentData = targetPOITile.getPersistentData()

        let posListNbt = new $ListTag()
        if (targetPOIPersistentData.contains('posList')) {
            posListNbt = targetPOIPersistentData.getList('posList', GET_COMPOUND_TYPE)
        }
        RenderBlockOutlineInTimeNbt(player, posListNbt, 20 * 15)
        player.setStatusMessage(Text.translatable('msg.kubejs.shop_tool.show_poi_container.1'))

    }
})

ItemEvents.firstLeftClicked(SHOP_TOOL, event => {
    let { item, player, level } = event
    let rayTraceResult = player.rayTrace(player.blockReach)
    let block = rayTraceResult.block
    ClearBlockOutlineRender(player)
    if (block) {
        if (block.blockState.tags.anyMatch(tag => tag.equals(TAG_POI_ENTRANCE))) {
            if (!item.hasNBT() || !item.nbt.contains('targetPOIPos')) return
            let targetPOIPos = ConvertNbt2Pos(item.nbt.get('targetPOIPos'))
            let targetPOIBlock = level.getBlock(targetPOIPos)
            let targetPOITile = targetPOIBlock.getEntity()
            let targetPOIPersistentData = targetPOITile.getPersistentData()

            targetPOIPersistentData.put('posList', new $ListTag())
            player.setStatusMessage(Text.translatable('msg.kubejs.shop_tool.clear_poi_container.1'))
            return
        } else {
            if (!item.hasNBT() || !item.nbt.contains('targetPOIPos')) return
            let targetPOIPos = ConvertNbt2Pos(item.nbt.get('targetPOIPos'))
            let targetPOIBlock = level.getBlock(targetPOIPos)
            if (!targetPOIBlock.blockState.tags.anyMatch(tag => tag.equals(TAG_POI_ENTRANCE))) return
            let targetPOITile = targetPOIBlock.getEntity()
            let targetPOIPersistentData = targetPOITile.getPersistentData()

            let posListNbt = new $ListTag()
            if (targetPOIPersistentData.contains('posList')) {
                posListNbt = targetPOIPersistentData.getList('posList', GET_COMPOUND_TYPE)
            }
            // 删除容器绑定
            posListNbt.removeIf(posNbt => {
                let pos = ConvertNbt2Pos(posNbt)
                return pos.equals(block.getPos())
            })
            targetPOIPersistentData.put('posList', posListNbt)
            RenderBlockOutlineInTimeNbt(player, posListNbt, 20 * 15)
            player.setStatusMessage(Text.translatable('msg.kubejs.shop_tool.remove_poi_container.1'))
            return
        }
    } else {
        if (!item.hasNBT() || !item.nbt.contains('targetPOIPos')) return
        item.nbt.remove('targetPOIPos')
        player.setStatusMessage(Text.translatable('msg.kubejs.shop_tool.clear_selected_poi.1'))
    }
})