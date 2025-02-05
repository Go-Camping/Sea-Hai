// priority: 500
RegistryRelatedPositionToolStrategy(
    new RelatedPositionToolModel()
        .whenBinding(
            (event, block) => {
                return block.tags.contains(TAG_NODE_BLOCK) || block.tags.contains(TAG_NODE_ENTRANCE)
            },
            (event, block) => {
                const { player, item } = event
                ClearBlockOutlineRender(player)
                let nbt = item.getOrCreateTag()
                // 节点选中模式
                nbt.put('savedPos', ConvertPos2Nbt(block.getPos()))
                RenderBlockOutlineInTime(player, [new OutlineRenderModel(block.getPos(), '#ff0d00')], 20 * 15)
                player.setStatusMessage(Text.translatable('status.kubejs.relate_position_tool.node.selected_poi.1'))
                return
            }
        )
        .whenSelectBinding(
            (event, block, savedBlock) => {
                return (block.tags.contains(TAG_NODE_BLOCK) || block.tags.contains(TAG_NODE_ENTRANCE)) && (savedBlock.tags.contains(TAG_NODE_BLOCK) || savedBlock.tags.contains(TAG_NODE_ENTRANCE))
            },
            (event, block, savedBlock) => {
                const { player } = event
                if (!savedBlock.entity) return
                let nodeEntity = savedBlock.entity
                // 清空node中的所有绑定node
                ClearBlockOutlineRender(player)
                nodeEntity.persistentData.remove('relatedNodePos')
                nodeEntity.setChanged()
                player.setStatusMessage(Text.translatable('status.kubejs.relate_position_tool.node.clear_relate_position.1'))
                return
            }
        )
        .whenAlreadyBinding(
            (event, block, savedBlock) => {
                return (block.tags.contains(TAG_NODE_BLOCK) || block.tags.contains(TAG_NODE_ENTRANCE)) && (savedBlock.tags.contains(TAG_NODE_BLOCK) || savedBlock.tags.contains(TAG_NODE_ENTRANCE))
            },
            (event, block, savedBlock) => {
                const { player } = event
                if (!savedBlock.entity) return
                let nodeEntity = savedBlock.entity
                let relatedNodePosListNbt = nodeEntity.persistentData.getList('relatedNodePos', GET_COMPOUND_TYPE)
                let relatedNodePosList = ConvertNbt2PosList(relatedNodePosListNbt)
                // 重复右键解绑
                if (relatedNodePosList.some(pos => { if (pos.equals(block.getPos())) return true })) {
                    // 删除node绑定
                    relatedNodePosListNbt.removeIf(posNbt => {
                        let pos = ConvertNbt2Pos(posNbt)
                        return pos.equals(block.getPos())
                    })
                    nodeEntity.persistentData.put('relatedNodePos', relatedNodePosListNbt)
                    nodeEntity.setChanged()
                    RemoveBlockOutlineRender(player, [new OutlineRenderModel(block.getPos(), '#ff0d00')])
                    player.setStatusMessage(Text.translatable('status.kubejs.relate_position_tool.node.remove_relate_position.1'))
                    return
                }
                // 添加节点绑定
                relatedNodePosListNbt.add(ConvertPos2Nbt(block.getPos()))
                nodeEntity.persistentData.put('relatedNodePos', relatedNodePosListNbt)
                nodeEntity.setChanged()
                RenderOutlineWithSavedBlock(player, savedBlock, relatedNodePosListNbt)
                player.setStatusMessage(Text.translatable('status.kubejs.relate_position_tool.node.add_relate_position.1'))
                return
            }
        )
        .whenShowBinding(
            (event, savedBlock) => {
                return savedBlock.tags.contains(TAG_NODE_BLOCK) || savedBlock.tags.contains(TAG_NODE_ENTRANCE)
            },
            (event, savedBlock) => {
                const { player } = event
                ClearBlockOutlineRender(player)
                if (!savedBlock.entity) return
                let nodeEntity = savedBlock.entity
                let relatedNodePosListNbt = nodeEntity.persistentData.getList('relatedNodePos', GET_COMPOUND_TYPE)

                RenderOutlineWithSavedBlock(player, savedBlock, relatedNodePosListNbt)
                player.setStatusMessage(Text.translatable('status.kubejs.relate_position_tool.node.show_relate_position.1'))
                return
            }
        )
)
