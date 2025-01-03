// priority: 500

const DEBUG_TOOL = 'kubejs:route_tool'

ItemEvents.entityInteracted(DEBUG_TOOL, event => {
    let {item, target} = event
    if (!item.hasNBT()) return
    if (!item.nbt.contains('posList')) return
    let routeMoveModel = new EntityRouteMove(target)
    routeMoveModel.setRelatedPosListNbt(item.nbt.getList('posList', GET_COMPOUND_TYPE))
    SetEntityStatus(target, STATUS_ROUTE_MOVE)
    SetRouteMoveGoal(target)
    SetFindPOIGoal(target)
    SetWorkInPOIGoal(target)
    SetDismissGoal(target)
})


BlockEvents.rightClicked(event => {
    let {item, block, player} = event
    if (item.id != DEBUG_TOOL) return
    if (!item.hasNBT() || !item.nbt.contains('posList')) {
        let nbt = item.getOrCreateTag()
        nbt.put('posList', $ListTag())
    }
    let posListNbt = item.nbt.getList('posList', GET_COMPOUND_TYPE)
    posListNbt.add(ConvertPos2Nbt(block.getPos()))
    item.nbt.put('posList', posListNbt)
})