// priority: 500

/**
 * @type {BlockPos[]}
 */
let NeedRenderOutlinePosList = []

NetworkEvents.dataReceived(NET_RENDER_OUTLINE, event => {
    let data = event.data
    let mode = data.getInt('mode')
    /** @type {BlockPos[]} */
    let blockPosList = []
    if (data.contains('posList')) {
        blockPosList = ConvertNbt2PosList(data.getList('posList', GET_COMPOUND_TYPE))
    }
    let time = 0
    if (data.contains('time')) {
        time = data.getInt('time')
    }
    switch (mode) {
        case 1:
            NeedRenderOutlinePosList.length = 0
            break
        case 2:
            blockPosList.forEach(pos => {
                let index = NeedRenderOutlinePosList.findIndex(p => p.equals(pos))
                if (index >= 0) {
                    NeedRenderOutlinePosList.splice(index, 1)
                }
            })
            break
        case 3:
            NeedRenderOutlinePosList = NeedRenderOutlinePosList.concat(blockPosList)
            Client.scheduleInTicks(time, () => {
                blockPosList.forEach(pos => {
                    let index = NeedRenderOutlinePosList.indexOf(pos)
                    if (index >= 0) {
                        NeedRenderOutlinePosList.splice(index, 1)
                    }
                })
            })
            break
        default:
            NeedRenderOutlinePosList = NeedRenderOutlinePosList.concat(blockPosList)
            break
    }
})

RenderJSEvents.AddWorldRender(event => {
    event.addWorldRender(context => {
        NeedRenderOutlinePosList.forEach(blockPos => {
            RenderJSWorldRender.renderBlockOutLine1(blockPos, Blocks.STONE.defaultBlockState(), RenderJSWorldRender.getTopLayerLineType(), '#00FF24')
        })
    })
})