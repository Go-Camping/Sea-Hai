// priority: 800
ServerEvents.recipes(event => {
    event.recipes.custommachinery.custom_machine('kubejs:aether_gate', 1000)
        .requireFunctionEachTick(ctx => {
            if (ctx.remainingTime % 100 != 0) return ctx.success()

            let { machine, block } = ctx

            let item = machine.getItemStored('route_marker')

            if (!item || item.isEmpty() || !item.hasNBT() || !item.nbt.contains('posList') || item.nbt.getList('posList', GET_COMPOUND_TYPE).size() <= 0) return ctx.error('No route tool found')

            let entity = CreateCustomNPCEntity(block.level)

            let pos = RandomOffsetPos(block.pos, 5)
            entity.setPos(pos.x, pos.y, pos.z)
            let num = Math.ceil(Math.random() * 11)
            entity.display.setSkinTexture(`kubejs:textures/entity/skin/guest_${num}.png`)
            let routeMoveModel = new EntityRouteMove(entity)
            routeMoveModel.setPosListNbt(item.nbt.getList('posList', GET_COMPOUND_TYPE))
            SetEntityStatus(entity, STATUS_ROUTE_MOVE)
            block.level.addFreshEntity(entity)
            return ctx.success()
        })
        .requireFunctionToStart(ctx => {
            let machine = ctx.machine
            let item = machine.getItemStored('route_marker')
            if (item && !item.isEmpty()) return ctx.success()
            return ctx.error('')
        })


})


CustomMachineryEvents.upgrades(event => {
    event.create(Item.of('kubejs:aether_collector_1'))
        .machine('kubejs:aether_gate')
        .modifier(CMRecipeModifierBuilder.mulInput('custommachinery:speed', 1.2).min(10))
        .build()
})