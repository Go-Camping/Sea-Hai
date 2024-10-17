// priority: 950
/**
 * 展示方块的边框线
 * @param {Internal.ServerPlayer} player 
 * @param {OutlineRenderModel[]} outlineList 
 */
function RenderBlockOutline(player, outlineList) {
    let netNbt = new $CompoundTag()
    netNbt.put('outlineList', ConvertOutlineRenderList2Nbt(outlineList))
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
 * @param {OutlineRenderModel[]} outlineList
 */
function RemoveBlockOutlineRender(player, outlineList) {
    let netNbt = new $CompoundTag()
    netNbt.putInt('mode', 2)
    netNbt.put('outlineList', ConvertOutlineRenderList2Nbt(outlineList))
    player.sendData(NET_RENDER_OUTLINE, netNbt)
}

/**
 * 展示方块的边框线一段时间
 * @param {Internal.ServerPlayer} player 
 * @param {OutlineRenderModel[]} outlineList 
 * @param {number} time
 */
function RenderBlockOutlineInTime(player, outlineList, time) {
    let netNbt = new $CompoundTag()
    netNbt.put('outlineList', ConvertOutlineRenderList2Nbt(outlineList))
    netNbt.putInt('mode', 3)
    netNbt.putInt('time', time)
    player.sendData(NET_RENDER_OUTLINE, netNbt)
}

/**
 * 展示方块的边框线一段时间
 * @param {Internal.ServerPlayer} player 
 * @param {Internal.CompoundTag} outlineListNbt
 * @param {number} time
 */
function RenderBlockOutlineInTimeNbt(player, outlineListNbt, time) {
    let netNbt = new $CompoundTag()
    netNbt.put('outlineList', outlineListNbt)
    netNbt.putInt('mode', 3)
    netNbt.putInt('time', time)
    player.sendData(NET_RENDER_OUTLINE, netNbt)
}