// priority: 1000

/**
 * 属性管理模型，用于解决自定义结构的乘算加算等数值问题
 * @param {number} attr
 */
function AttributeManagerModel(attr) {
    this.attr = attr
    this.baseAddModifier = 0
    this.baseMultiModifier = 1
    this.allAddModifier = 0
    this.allMultiModifier = 1
}

AttributeManagerModel.prototype = {
    /**
     * 设置新的基础值，这用于某些后验属性值的置入
     * @returns {number}
     */
    setBaseAttr: function (attr) {
        this.attr = attr
        return this
    },
    /**
     * 计算结果
     * @returns {number}
     */
    calResult: function () {
        return (this.attr + this.baseAddModifier) * this.baseMultiModifier * this.allMultiModifier + this.allAddModifier
    },
    /**
     * 
     * @param {Number} num 
     * @param {'addition'|'multiple'} modifierType 
     * @param {'base'|'all'} baseType 
     */
    addAttributeModifier: function (num, modifierType, baseType) {
        if (baseType == 'base') {
            if (modifierType == 'addition') {
                this.baseAddModifier = this.baseAddModifier + num
            } else if (modifierType == 'multiple') {
                this.baseMultiModifier = this.baseMultiModifier + num
            }
        } else if (baseType == 'all') {
            if (modifierType == 'addition') {
                this.allAddModifier = this.allAddModifier + num
            } else if (modifierType =='multiple') {
                this.allMultiModifier = this.allMultiModifier * num
            }
        }
        return this
    }
}