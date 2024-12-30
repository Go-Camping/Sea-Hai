// priority: 900

/**
 * 装饰器模型构建
 * @param {string} type
 * @param {function(Internal.Level, BlockPos, number)} predictor
 * @param {function(Internal.Level, BlockPos, number)} action
 * @returns 
 */
function SphereDecoratorModel(type, predictor, action) {
    this.type = type
    /**
     * 预测器仅用于处理通用的判断逻辑，用于判断这里是否能够执行某个action，而不需要关心sphere的相对状态
     * 如果需要进行sphere的状态的判断，则需要在type处新增枚举，并且在每个sphere的对应位置设置好切入点
     * 这么做的原因主要是sphere的逻辑和定义存在差异性，需要差分式的设计以避免后续扩展性的问题
     */
    this.predictor = predictor
    /**
     * 执行器，用于处理具体的逻辑，这里的pos是相对于sphere的相对位置，而不是全局的绝对位置
     */
    this.action = action
}


/**
 * 按照decorators的type去打包到不同的执行器中
 */
function SphereDecoratorPackerModel() {
    this.innerDecorators = []
}

SphereDecoratorPackerModel.prototype = {
    addDecorator: function (decorator) {
        switch (decorator.type) {
            case 'inner':
                // 球壳内部空闲空间
                this.innerDecorators.push(decorator)
                break
        }
    },
    runInnerDecorators: function (level, pos, radius) {
        for (let i = 0; i < this.innerDecorators.length; i++) {
            let decorator = this.innerDecorators[i]
            decorator.predictor(level, pos, radius)
        }
    },
}