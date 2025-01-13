// priority: 802
/**
 * @constant
 * @type {Record<string, (container: Internal.BlockContainerJS) => void>}
 */
const ContainerDecorationStrategy = {}



/**
 * @param {string} id 
 * @param {Record<string, (container: Internal.BlockContainerJS) => void>} strategy 
 */
function RegistryContainerDecorationStrategy(id, strategy) {
    ContainerDecorationStrategy[id] = strategy
}


RegistryContainerDecorationStrategy('minecraft:stone', (container) => {
    if (Math.random() > 0.1) this.workInPOIModel.setNeedBuyMore(true)
})
RegistryContainerDecorationStrategy('minecraft:iron_block', (container) => {
    this.workInPOIModel.priceAttribute.addAttributeModifier(1, 'multiple', 'base')
})