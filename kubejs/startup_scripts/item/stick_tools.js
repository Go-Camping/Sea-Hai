// priority: 900
StartupEvents.registry('item', event => {
    // 地点关联工具
    event.create('relate_position_tool').maxStackSize(1)
})