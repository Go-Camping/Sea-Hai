// priority: 500

/**
 * @type {OutlineRenderModel[]}
 */
let NeedRenderOutlinePosList = []

NetworkEvents.dataReceived(NET_RENDER_OUTLINE, event => {
    let data = event.data
    let mode = data.getInt('mode')
    /** @type {OutlineRenderModel[]} */
    let outlineRenderList = []
    if (data.contains('outlineList')) {
        outlineRenderList = ConvertNbt2OutlineRenderList(data.getList('outlineList', GET_COMPOUND_TYPE))
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
            outlineRenderList.forEach(outline => {
                let index = NeedRenderOutlinePosList.findIndex(p => p.equals(outline))
                if (index >= 0) {
                    NeedRenderOutlinePosList.splice(index, 1)
                }
            })
            break
        case 3:
            NeedRenderOutlinePosList = NeedRenderOutlinePosList.concat(outlineRenderList)
            Client.scheduleInTicks(time, () => {
                outlineRenderList.forEach(outline => {
                    let index = NeedRenderOutlinePosList.indexOf(outline)
                    if (index >= 0) {
                        NeedRenderOutlinePosList.splice(index, 1)
                    }
                })
            })
            break
        default:
            NeedRenderOutlinePosList = NeedRenderOutlinePosList.concat(outlineRenderList)
            break
    }
})

RenderJSEvents.AddWorldRender(event => {
    event.addWorldRender(context => {
        NeedRenderOutlinePosList.forEach(outline => {
            RenderJSWorldRender.renderBlockOutLine1(outline.blockPos, Blocks.STONE.defaultBlockState(), RenderJSWorldRender.getTopLayerLineType(), outline.color)
        })
    })
})