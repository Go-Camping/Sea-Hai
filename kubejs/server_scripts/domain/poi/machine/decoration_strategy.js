// priority: 802
/**
 * @constant
 * @type {Record<string, (container: Internal.BlockContainerJS) => void>}
 */
const ContainerDecorationStrategy = {}



/**
 * @param {string} id 
 * @param {Record<string, (poiModel: DefaultPOIModel, container: Internal.BlockContainerJS) => void>} strategy 
 */
function RegistryContainerDecorationStrategy(id, strategy) {
    ContainerDecorationStrategy[id] = strategy
}


RegistryContainerDecorationStrategy('minecraft:stone', (poiModel, container) => {
    if (Math.random() > 0.1) poiModel.workInPOIModel.setNeedBuyMore(true)
})
RegistryContainerDecorationStrategy('minecraft:iron_block', (poiModel, container) => {
    poiModel.workInPOIModel.priceAttribute.addAttributeModifier(1, 'multiple', 'base')
})