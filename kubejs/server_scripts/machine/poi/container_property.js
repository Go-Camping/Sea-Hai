// priority: 802
/**
 * @constant
 * @type {Record<string, ContainerPropertyModel>}
 */
const ContainerProperty = {}

/**
 * 
 * @param {string} id 
 * @param {Record<string, any>} properties 
 */
function RegistryContainerProperty(id, properties) {
    ContainerProperty[id] = properties
}

function ContainerPropertyModel() {
    this.validDecorationAmount = 0
}
ContainerPropertyModel.prototype = {
    withValidDecorationAmount: function (amount) {
        this.validDecorationAmount = amount
        return this
    }
}

RegistryContainerProperty('minecraft:chest', new ContainerPropertyModel().withValidDecorationAmount(0))
RegistryContainerProperty('supplementaries:pedestal', new ContainerPropertyModel().withValidDecorationAmount(3))