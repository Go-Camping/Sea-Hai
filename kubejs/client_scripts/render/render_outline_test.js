// priority: 500
// todo
RenderJSEvents.AddWorldRender(event => {
    event.addWorldRender(context => {
        // RenderAreaOutLine(context, new BlockPos(0, 0, 0), new BlockPos(10, 10, 10))
    })
})

/**
 * @param {Internal.RenderJSWorldRender$RenderContext} context
 * @param {BlockPos} blockPos0
 * @param {BlockPos} blockPos1
 */
function RenderAreaOutLine(context, blockPos0, blockPos1) {
    const bufferSource = Client.renderBuffers().bufferSource()
    const cameraPos = Client.gameRenderer.getMainCamera().getPosition()
    const poseStack = context.instance.poseStack
    const renderType = RenderJSWorldRender.getTopLayerLineType()

    poseStack.pushPose()
    poseStack.translate(-cameraPos.x(), -cameraPos.y(), -cameraPos.z())

    let startPos = new BlockPos(Math.min(blockPos0.x, blockPos1.x), Math.min(blockPos0.y, blockPos1.y), Math.min(blockPos0.z, blockPos1.z))
    let endPos = new BlockPos(Math.max(blockPos0.x, blockPos1.x) + 1, Math.max(blockPos0.y, blockPos1.y) + 1, Math.max(blockPos0.z, blockPos1.z) + 1)

    const bufferbuilder = $Tesselator.getInstance().getBuilder()
    bufferbuilder.begin(renderType.mode(), renderType.format())
    bufferbuilder.defaultColor(255, 255, 255, 255)

    bufferbuilder.vertex(startPos.x, startPos.y, startPos.z).endVertex()
    bufferbuilder.vertex(startPos.x, startPos.y, endPos.z).endVertex()

    bufferbuilder.vertex(startPos.x, startPos.y, startPos.z).endVertex()
    bufferbuilder.vertex(endPos.x, startPos.y, startPos.z).endVertex()

    bufferbuilder.vertex(endPos.x, startPos.y, endPos.z).endVertex()
    bufferbuilder.vertex(endPos.x, startPos.y, startPos.z).endVertex()

    bufferbuilder.vertex(endPos.x, startPos.y, endPos.z).endVertex()
    bufferbuilder.vertex(startPos.x, startPos.y, endPos.z).endVertex()

    bufferbuilder.vertex(startPos.x, endPos.y, startPos.z).endVertex()
    bufferbuilder.vertex(startPos.x, endPos.y, endPos.z).endVertex()

    bufferbuilder.vertex(startPos.x, endPos.y, startPos.z).endVertex()
    bufferbuilder.vertex(endPos.x, endPos.y, startPos.z).endVertex()

    bufferbuilder.vertex(endPos.x, endPos.y, endPos.z).endVertex()
    bufferbuilder.vertex(endPos.x, endPos.y, startPos.z).endVertex()

    bufferbuilder.vertex(endPos.x, endPos.y, endPos.z).endVertex()
    bufferbuilder.vertex(startPos.x, endPos.y, endPos.z).endVertex()

    bufferbuilder.vertex(startPos.x, startPos.y, startPos.z).endVertex()
    bufferbuilder.vertex(startPos.x, endPos.y, startPos.z).endVertex()

    bufferbuilder.vertex(endPos.x, startPos.y, endPos.z).endVertex()
    bufferbuilder.vertex(endPos.x, endPos.y, endPos.z).endVertex()

    bufferbuilder.vertex(startPos.x, startPos.y, endPos.z).endVertex()
    bufferbuilder.vertex(startPos.x, endPos.y, endPos.z).endVertex()

    bufferbuilder.vertex(endPos.x, startPos.y, endPos.z).endVertex()
    bufferbuilder.vertex(endPos.x, endPos.y, endPos.z).endVertex()

    const renderedBuffer = bufferbuilder.endOrDiscardIfEmpty()
    const vertexBuffer = new $VertexBuffer($VertexBuffer.Usage.STATIC)
    vertexBuffer.bind()
    vertexBuffer.upload(renderedBuffer)
    $VertexBuffer.unbind()
    bufferbuilder.unsetDefaultColor()

    const ps = $RenderSystem.getModelViewStack()
    ps.pushPose()
    ps.last().pose().mul(poseStack.last().pose())
    ps.last().normal().mul(poseStack.last().normal())
    $RenderSystem.applyModelViewMatrix()

    renderType.setupRenderState()
    vertexBuffer.bind()
    vertexBuffer.drawWithShader($RenderSystem.getModelViewMatrix(), $RenderSystem.getProjectionMatrix(), $GameRenderer.getPositionColorShader())
    $VertexBuffer.unbind()

    renderType.clearRenderState()
    $RenderSystem.getModelViewStack().popPose()
    $RenderSystem.applyModelViewMatrix()

    bufferSource.endBatch()
    poseStack.popPose()
}