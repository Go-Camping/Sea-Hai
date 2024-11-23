// priority: 950
/**
 * 将方块实体转换成为自定义机器定义的MachineJS对象
 * @param {Internal.BlockEntity} blockEntity 
 * @returns {CustomMachine} 
 */
function ConvertBlockEntity2MachineJS(blockEntity) {
    if (blockEntity instanceof $CustomMachineTile) {
        return $MachineJS.of(blockEntity)
    }
    return null
}