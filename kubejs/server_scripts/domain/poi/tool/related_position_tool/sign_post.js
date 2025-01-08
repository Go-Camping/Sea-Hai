// priority: 500
RegistryRelatedPositionToolStrategy(
    new RelatedPositionToolModel()
        .whenBinding(
            (event, block) => {
                return block.tags.contains(TAG_SIGN_POST_BLOCK)
            },
            (event, block) => {
                const { player, item } = event
                ClearBlockOutlineRender(player)
                let nbt = item.getOrCreateTag()
                // 选中标识模式
                nbt.put('savedPos', ConvertPos2Nbt(block.getPos()))
                RenderBlockOutlineInTime(player, [new OutlineRenderModel(block.getPos(), '#00ea33')], 20 * 15)
                player.setStatusMessage(Text.translatable('status.kubejs.relate_position_tool.node.selected_poi.1'))
                return
            }
        )
        .whenSelectBinding(
            (event, block, savedBlock) => {
                return savedBlock.tags.contains(TAG_SIGN_POST_BLOCK) && block.tags.contains(TAG_SIGN_POST_BLOCK)
            },
            (event, block, savedBlock) => {
                const { player } = event
                if (!savedBlock.entity) return
                let nodeEntity = savedBlock.entity
                ClearBlockOutlineRender(player)
                nodeEntity.persistentData.remove('relatedNodePos')
                nodeEntity.setChanged()
                player.setStatusMessage(Text.translatable('status.kubejs.relate_position_tool.node.clear_relate_position.1'))
                return
            }
        )
        .whenAlreadyBinding(
            (event, block, savedBlock) => {
                return savedBlock.tags.contains(TAG_SIGN_POST_BLOCK) && block.tags.contains(TAG_POI_ENTRANCE)
            },
            (event, block, savedBlock) => {
                const { player } = event
                if (!savedBlock.entity) return
                let nodeEntity = savedBlock.entity
                let relatedPoiPosListNbt = nodeEntity.persistentData.getList('relatedPoiPos', GET_COMPOUND_TYPE)
                let relatedPoiPosList = ConvertNbt2PosList(relatedPoiPosListNbt)
                // 重复右键解绑
                if (relatedPoiPosList.some(pos => { if (pos.equals(block.getPos())) return true })) {
                    // 删除node绑定
                    relatedPoiPosListNbt.removeIf(posNbt => {
                        let pos = ConvertNbt2Pos(posNbt)
                        return pos.equals(block.getPos())
                    })
                    nodeEntity.persistentData.put('relatedPoiPos', relatedPoiPosListNbt)
                    nodeEntity.setChanged()
                    RemoveBlockOutlineRender(player, [new OutlineRenderModel(block.getPos(), '#00ea33')])
                    player.setStatusMessage(Text.translatable('status.kubejs.relate_position_tool.node.remove_relate_position.1'))
                    return
                }
                // 添加节点绑定
                relatedPoiPosListNbt.add(ConvertPos2Nbt(block.getPos()))
                nodeEntity.persistentData.put('relatedPoiPos', relatedPoiPosListNbt)
                nodeEntity.setChanged()
                RenderBlockOutlineInTimeNbt(player, ConvertBlockPosListNbt2OutlineRenderListNbt(relatedPoiPosListNbt.copy(), '#00ea33'), 20 * 15)
                player.setStatusMessage(Text.translatable('status.kubejs.relate_position_tool.node.add_relate_position.1'))
                return
            }
        )
        .whenShowBinding(
            (event, savedBlock) => {
                return savedBlock.tags.contains(TAG_SIGN_POST_BLOCK)
            },
            (event, savedBlock) => {
                const { player } = event
                ClearBlockOutlineRender(player)
                if (!savedBlock.entity) return
                let nodeEntity = savedBlock.entity
                let relatedPoiPosListNbt = nodeEntity.persistentData.getList('relatedPoiPos', GET_COMPOUND_TYPE)
                RenderBlockOutlineInTimeNbt(player, ConvertBlockPosListNbt2OutlineRenderListNbt(relatedPoiPosListNbt.copy(), '#00ea33'), 20 * 15)
                player.setStatusMessage(Text.translatable('status.kubejs.relate_position_tool.node.show_relate_position.1'))
                return
            }
        )
)
