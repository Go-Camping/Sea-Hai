// priority: 802
/**
 * @constant
 * @type {Record<string, (workInPOIModel: EntityWorkInPOI, container: Internal.BlockContainerJS) => void>}
 */
const ContainerDecorationStrategy = {}



/**
 * @param {string} id 
 * @param {Record<string, (workInPOIModel: EntityWorkInPOI, container: Internal.BlockContainerJS) => void>} strategy 
 */
function RegistryContainerDecorationStrategy(id, strategy) {
    ContainerDecorationStrategy[id] = strategy
}


RegistryContainerDecorationStrategy('minecraft:stone', (workInPOIModel, container) => {
    if (Math.random() > 0.1) workInPOIModel.setNeedBuyMore(true)
})
RegistryContainerDecorationStrategy('minecraft:iron_block', (workInPOIModel, container) => {
    workInPOIModel.setPriceMutiply(2)
})