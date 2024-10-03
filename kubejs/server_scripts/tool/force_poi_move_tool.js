// priority: 500

const FORCE_POI_MOVE_TOOL = 'kubejs:force_poi_move_tool'

ItemEvents.entityInteracted(FORCE_POI_MOVE_TOOL, event => {
    let { item, player, target } = event
    if (!item.hasNBT() || !item.nbt.contains('poiPos')) return
    let poiPos = ConvertNbt2Pos(item.nbt.get('poiPos'))
    if (GetEntityStatus(target) != STATUS_IDLE && GetEntityStatus(target) != STATUS_ROUTE_MOVE) return

    SetEntityStatus(target, STATUS_FIND_POI)
    let findPOIModel = new EntityFindPOI(target)
    findPOIModel.setTargetPOI(poiPos)
})


ItemEvents.firstRightClicked(FORCE_POI_MOVE_TOOL, event => {
    let { item, player, level } = event
    let rayTraceResult = player.rayTrace(player.blockReach)
    let block = rayTraceResult.block
    if (block) {
        if (block.blockState.tags.anyMatch(tag => tag.equals(TAG_POI_ENTRANCE))) {
            // 选中POI模式
            let nbt = item.getOrCreateTag()
            nbt.put('poiPos', ConvertPos2Nbt(block.getPos()))
            player.setStatusMessage(Text.translatable('status.kubejs.poi_container_tool.selected_poi.1'))
        }
    }
})

ItemEvents.firstLeftClicked(FORCE_POI_MOVE_TOOL, event => {
    let { item, player, level } = event

    if (!item.hasNBT() || !item.nbt.contains('poiPos')) return
    // 清除工具绑定的POI
    item.nbt.remove('poiPos')
    player.setStatusMessage(Text.translatable('status.kubejs.poi_container_tool.clear_poi.1'))
})