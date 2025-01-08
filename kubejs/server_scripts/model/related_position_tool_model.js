// priority: 900

/**
 * 自定义结构的鱼类战利品表
 * @returns 
 */
function RelatedPositionToolModel() {
    this.bindingTester = (event, block) => { return false }
    this.bindingAction = (event, block) => { return }

    this.aleardyBindingTester = (event, block, savedBlock) => { return false }
    this.aleardyBindingAction = (event, block, savedBlock) => { return }

    this.showBindingTester = (event, savedBlock) => { return false }
    this.showBindingAction = (event, savedBlock) => { return }


    this.selectBindingTester = (event, block, savedBlock) => { return false }
    this.selectBindingAction = (event, block, savedBlock) => { return }
}

RelatedPositionToolModel.prototype = {
    /**
     * @param {function(Internal.ItemClickedEventJS, Internal.BlockContainerJS): boolean} bindingTester 
     * @param {function(Internal.ItemClickedEventJS, Internal.BlockContainerJS): void} bindingAction 
     * @returns 
     */
    whenBinding: function (bindingTester, bindingAction) {
        this.bindingAction = bindingAction
        this.bindingTester = bindingTester
        return this
    },
    /**
     * @param {function(Internal.ItemClickedEventJS, Internal.BlockContainerJS, Internal.BlockContainerJS): boolean} aleardyBindingTester 
     * @param {function(Internal.ItemClickedEventJS, Internal.BlockContainerJS, Internal.BlockContainerJS): void} aleardyBindingAction 
     * @returns 
     */
    whenAlreadyBinding: function (aleardyBindingTester, aleardyBindingAction) {
        this.aleardyBindingAction = aleardyBindingAction
        this.aleardyBindingTester = aleardyBindingTester
        return this
    },
    /**
     * @param {function(Internal.ItemClickedEventJS, Internal.BlockContainerJS): boolean} showBindingTester 
     * @param {function(Internal.ItemClickedEventJS, Internal.BlockContainerJS): void} showBindingAction 
     * @returns 
     */
    whenShowBinding: function (showBindingTester, showBindingAction) {
        this.showBindingAction = showBindingAction
        this.showBindingTester = showBindingTester
        return this
    },
    /**
     * @param {function(Internal.ItemClickedEventJS, Internal.BlockContainerJS): boolean} selectBindingTester 
     * @param {function(Internal.ItemClickedEventJS, Internal.BlockContainerJS): void} selectBindingAction 
     * @returns 
     */
    whenSelectBinding: function (selectBindingTester, selectBindingAction) {
        this.selectBindingTester = selectBindingTester
        this.selectBindingAction = selectBindingAction
        return this
    },
}