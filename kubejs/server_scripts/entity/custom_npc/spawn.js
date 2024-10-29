// priority: 800

// 在退出重进后维持AI状态
EntityEvents.spawned('customnpcs:customnpc', event => {
    /**@type {Internal.EntityCustomNpc} */
    let entity = event.entity
    if (!entity.persistentData.contains('status')) return
    // updateTasks，用于刷新cnpc的各种设定的状态；此方法会导致kjs注册的goal失效，因此需要确保该方法执行后，再注册Goal
    entity.updateTasks()
    // updateAI在entityTick中用于判断是否进行updateTasks，update后该值会置为false；因此需要手动设置该值为false
    entity.updateAI = false
    SetRouteMoveGoal(entity)
    SetFindPOIGoal(entity)
    SetWorkInPOIGoal(entity)
    SetDismissGoal(entity)
})