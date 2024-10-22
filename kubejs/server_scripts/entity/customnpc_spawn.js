// priority: 800

// 在退出重进后维持AI状态
EntityEvents.spawned('customnpcs:customnpc', event => {
    /**@type {Internal.EntityCustomNpc} */
    let entity = event.entity
    if (!entity.persistentData.contains('status')) return
    entity.updateTasks()
    entity.updateAI = false
    SetRouteMoveGoal(entity)
    SetFindPOIGoal(entity)
    SetWorkInPOIGoal(entity)
    SetDismissGoal(entity)
})