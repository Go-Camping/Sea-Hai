// priority: 950
/**
 * 展示方块的边框线
 * @param {Internal.ServerPlayer} player 
 * @param {BlockPos[]} posList 
 */
function RenderBlockOutline(player, posList) {
    let netNbt = new $CompoundTag()
    netNbt.put('posList', ConvertPosList2Nbt(posList))
    netNbt.putInt('mode', 0)
    player.sendData(NET_RENDER_OUTLINE, netNbt)
}

/**
 * 清除当前所有在显示的边框线
 * @param {Internal.ServerPlayer} player 
 */
function ClearBlockOutlineRender(player) {
    let netNbt = new $CompoundTag()
    netNbt.putInt('mode', 1)
    player.sendData(NET_RENDER_OUTLINE, netNbt)
}

/**
 * 删除某个位置的边框线展示
 * @param {Internal.ServerPlayer} player 
 * @param {BlockPos[]} posList
 */
function RemoveBlockOutlineRender(player, posList) {
    let netNbt = new $CompoundTag()
    netNbt.putInt('mode', 2)
    netNbt.put('posList', ConvertPosList2Nbt(posList))
    player.sendData(NET_RENDER_OUTLINE, netNbt)
}

/**
 * 展示方块的边框线一段时间
 * @param {Internal.ServerPlayer} player 
 * @param {BlockPos[]} posList 
 * @param {number} time
 */
function RenderBlockOutlineInTime(player, posList, time) {
    let netNbt = new $CompoundTag()
    netNbt.put('posList', ConvertPosList2Nbt(posList))
    netNbt.putInt('mode', 3)
    netNbt.putInt('time', time)
    player.sendData(NET_RENDER_OUTLINE, netNbt)
}

/**
 * 展示方块的边框线一段时间
 * @param {Internal.ServerPlayer} player 
 * @param {Internal.CompoundTag} posListNbt
 * @param {number} time
 */
function RenderBlockOutlineInTimeNbt(player, posListNbt, time) {
    let netNbt = new $CompoundTag()
    netNbt.put('posList', posListNbt)
    netNbt.putInt('mode', 3)
    netNbt.putInt('time', time)
    player.sendData(NET_RENDER_OUTLINE, netNbt)
}