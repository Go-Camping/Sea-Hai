StartupEvents.registry('item', event => {
    // route tool 路径编辑工具
    event.create('route_tool').maxStackSize(1)
    // poi tool poi内部地点标注工具（用于链接内部容纳器逻辑）
    event.create('relate_position_tool').maxStackSize(1)
    // relate node tool 关联节点工具
    event.create('relate_node_tool').maxStackSize(1)
})