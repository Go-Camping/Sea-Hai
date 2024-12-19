// priority: 500
ItemEvents.entityInteracted('kubejs:flyer', event => {
    let { item } = event
    /** @type {Internal.PathfinderMob} */
    let target = event.target
    if (!target instanceof $EntityCustomNpc) return
    if (!item.hasNBT() || !item.nbt.contains('poiPos')) return
    let poiPos = ConvertNbt2Pos(item.nbt.get('poiPos'))
    if (GetEntityStatus(target) != STATUS_IDLE && GetEntityStatus(target) != STATUS_ROUTE_MOVE) {
        // todo
        NPCSaySurrounding(target, NPC_LINE_SATISFIED)
        return
    }
    let targetPos = GetEntityPosition(target)
    if (poiPos.distSqr(new Vec3i(targetPos.x, targetPos.y, targetPos.z)) > 1024) return
    let findPOIModel = new EntityFindPOI(target)
    if (findPOIModel.checkIsMarkedPOI(poiPos)) return
    SetEntityStatus(target, STATUS_FIND_POI)
    findPOIModel.setTargetPOI(poiPos)
})


ItemEvents.firstRightClicked('kubejs:flyer', event => {
    let { item, player } = event
    let rayTraceResult = player.rayTrace(player.blockReach)
    let block = rayTraceResult.block
    if (item.hasNBT()) {
        player.setStatusMessage(Text.translatable('status.kubejs.flyer.had_selected.1'))
        return
    }
    if (block) {
        if (block.tags.contains(TAG_POI_ENTRANCE)) {
            // 选中POI模式
            let nbt = item.getOrCreateTag()
            nbt.put('poiPos', ConvertPos2Nbt(block.getPos()))
            player.setStatusMessage(Text.translatable('status.kubejs.flyer.select_poi.1'))
        }
    }
})
