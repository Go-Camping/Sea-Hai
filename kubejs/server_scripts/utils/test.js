BlockEvents.rightClicked('kubejs:fish_shop', event => {
    let {item, block} = event
    if (item.id != 'minecraft:blaze_rod') return
    block.entity.persistentData.putInt('test', 1)
})