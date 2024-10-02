// priority: 800

// 在退出重进后维持AI状态
EntityEvents.spawned('customnpcs:customnpc', event => {
    /**@type {Internal.EntityCustomNpc} */
    let entity = event.entity
    if (!entity.persistentData.contains('status')) return
    SetRouteMoveGoal(entity)
    SetFindPOIGoal(entity)
    SetWorkInPOIGoal(entity)
    SetDismissGoal(entity)
    entity.updateAI = false
})
