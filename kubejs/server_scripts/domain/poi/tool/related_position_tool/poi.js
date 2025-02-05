// priority: 500
RegistryRelatedPositionToolStrategy(
    new RelatedPositionToolModel()
        .whenBinding(
            (event, block) => {
                return block.tags.contains(TAG_POI_ENTRANCE)
            },
            (event, block) => {
                const { player, item } = event
                ClearBlockOutlineRender(player)
                let nbt = item.getOrCreateTag()
                // 选中POI模式
                nbt.put('savedPos', ConvertPos2Nbt(block.getPos()))
                RenderBlockOutlineInTime(player, [new OutlineRenderModel(block.getPos(), '#ff0d00')], 20 * 15)
                player.setStatusMessage(Text.translatable('status.kubejs.relate_position_tool.poi.selected_poi.1'))
                return
            }
        )
        .whenSelectBinding(
            (event, block, savedBlock) => {
                return savedBlock.tags.contains(TAG_POI_ENTRANCE) && block.tags.contains(TAG_POI_ENTRANCE)
            },
            (event, block, savedBlock) => {
                const { player } = event
                let shopPOIModel = new ShopPOIBlock(savedBlock)
                // 清空POI中的所有绑定容器
                ClearBlockOutlineRender(player)
                shopPOIModel.setRelatedPosListNbt(new $ListTag())
                player.setStatusMessage(Text.translatable('status.kubejs.relate_position_tool.poi.clear_relate_position.1'))
                return
            }
        )
        .whenAlreadyBinding(
            (event, block, savedBlock) => {
                return savedBlock.tags.contains(TAG_POI_ENTRANCE)
            },
            (event, block, savedBlock) => {
                const { player } = event
                let shopPOIModel = new ShopPOIBlock(savedBlock)
                let posListNbt = shopPOIModel.getRelatedPosListNbt()
                let posList = ConvertNbt2PosList(posListNbt)
                // 重复右键解绑
                if (posList.some(pos => { if (pos.equals(block.getPos())) return true })) {
                    let posListNbt = shopPOIModel.getRelatedPosListNbt()
                    // 删除容器绑定
                    posListNbt.removeIf(posNbt => {
                        let pos = ConvertNbt2Pos(posNbt)
                        return pos.equals(block.getPos())
                    })
                    shopPOIModel.setRelatedPosListNbt(posListNbt)
                    RemoveBlockOutlineRender(player, [new OutlineRenderModel(block.getPos(), '#ff0d00')])
                    player.setStatusMessage(Text.translatable('status.kubejs.relate_position_tool.poi.remove_relate_position.1'))
                    return
                }
                posListNbt.add(ConvertPos2Nbt(block.getPos()))
                shopPOIModel.setRelatedPosListNbt(posListNbt)

                RenderOutlineWithSavedBlock(player, savedBlock, posListNbt)
                player.setStatusMessage(Text.translatable('status.kubejs.relate_position_tool.poi.add_relate_position.1'))
                return
            }
        )
        .whenShowBinding(
            (event, savedBlock) => {
                return savedBlock.tags.contains(TAG_POI_ENTRANCE)
            },
            (event, savedBlock) => {
                const { player } = event
                ClearBlockOutlineRender(player)
                let shopPOIModel = new ShopPOIBlock(savedBlock)
                let posListNbt = shopPOIModel.getRelatedPosListNbt()
                
                RenderOutlineWithSavedBlock(player, savedBlock, posListNbt)
                player.setStatusMessage(Text.translatable('status.kubejs.relate_position_tool.poi.show_relate_position.1'))
                return
            }
        )
)
