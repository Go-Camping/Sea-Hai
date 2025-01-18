// priority: 1000
function MultiStateTooltip(item) {
    this.item = item
    this.defaultTooltips = []
    this.ctrlTooltips = []
    this.shiftTooltips = []
    this.altTooltips = []
    this.shiftDescription = Text.translatable('tooltips.kubejs.multi_state.shift.1')
    this.shiftHoldingDescription = Text.translatable('tooltips.kubejs.multi_state.shift_holding.1')
    this.ctrlDescription = Text.translatable('tooltips.kubejs.multi_state.ctrl.1')
    this.ctrlHoldingDescription = Text.translatable('tooltips.kubejs.multi_state.ctrl_holding.1')
    this.altDescription = Text.translatable('tooltips.kubejs.multi_state.alt.1')
    this.altHoldingDescription = Text.translatable('tooltips.kubejs.multi_state.alt_holding.1')
}
MultiStateTooltip.prototype = {
    /**
     * @param {Internal.MutableComponent} textComponent
     */
    addDefault: function (textComponent) {
        this.defaultTooltips.push(textComponent)
        return this
    },
    /**
     * @param {Internal.MutableComponent} textComponent
     */
    addCtrl: function (textComponent) {
        this.ctrlTooltips.push(textComponent)
        return this
    },
    /**
     * @param {Internal.MutableComponent} textComponent
     */
    addShift: function (textComponent) {
        this.shiftTooltips.push(textComponent)
        return this
    },
    /**
     * @param {Internal.MutableComponent} textComponent
     */
    addAlt: function (textComponent) {
        this.altTooltips.push(textComponent)
        return this
    },
    /**
     * @param {Internal.MutableComponent} textComponent
     */
    setShiftDescription: function (textComponent) {
        this.shiftDescription = textComponent
        return this
    },
    /**
     * @param {Internal.MutableComponent} textComponent
     */
    setCtrlDescription: function (textComponent) {
        this.ctrlDescription = textComponent
        return this
    },
    /**
     * @param {Internal.MutableComponent} textComponent
     */
    setAltDescription: function (textComponent) {
        this.altDescription = textComponent
        return this
    },
    /**
     * @param {Internal.MutableComponent} textComponent
     */
    setShiftHoldingDescription: function (textComponent) {
        this.shiftHoldingDescription = textComponent
        return this
    },
    /**
     * @param {Internal.MutableComponent} textComponent
     */
    setCtrlHoldingDescription: function (textComponent) {
        this.ctrlHoldingDescription = textComponent
        return this
    },
    /**
     * @param {Internal.MutableComponent} textComponent
     */
    setAltHoldingDescription: function (textComponent) {
        this.altHoldingDescription = textComponent
        return this
    },
    registry: function () {
        RegisteryMultiStateTooltip(this)
    }
}


/**
 * @type {MultiStateTooltip[]}
 */
const MultiStateTooltipRegistryList = []
function RegisteryMultiStateTooltip(tooltipModel) {
    MultiStateTooltipRegistryList.push(tooltipModel)
}

ItemEvents.tooltip(tooltip => {
    MultiStateTooltipRegistryList.forEach(tooltipModel => {
        tooltip.addAdvanced(tooltipModel.item, (item, advanced, text) => {
            if (text.length > 2) {
                for (let i = 2; i < text.length; i++) {
                    text.remove(i)
                }
            }
            let lineNum = text.length
            if (tooltipModel.defaultTooltips.length > 0) {
                text.addAll(lineNum, tooltipModel.defaultTooltips)
                lineNum += tooltipModel.defaultTooltips.length
            }

            switch (true) {
                case tooltip.isShift():
                    if (tooltipModel.shiftTooltips.length > 0) {
                        text.add(lineNum++, tooltipModel.shiftHoldingDescription)
                        text.addAll(lineNum, tooltipModel.shiftTooltips)
                        lineNum += tooltipModel.shiftTooltips.length
                    }
                    return
                case tooltip.isCtrl():
                    if (tooltipModel.ctrlTooltips.length > 0) {
                        text.add(lineNum++, tooltipModel.ctrlHoldingDescription)
                        text.addAll(lineNum, tooltipModel.ctrlTooltips)
                        lineNum += tooltipModel.ctrlTooltips.length
                    }
                    return
                case tooltip.isAlt():
                    if (tooltipModel.altTooltips.length > 0) {
                        text.add(lineNum++, tooltipModel.altHoldingDescription)
                        text.addAll(lineNum, tooltipModel.altTooltips)
                        lineNum += tooltipModel.altTooltips.length
                    }
                    return
            }

            if (tooltipModel.shiftTooltips.length > 0) {
                text.add(lineNum++, tooltipModel.shiftDescription)
            }
            
            if (tooltipModel.ctrlTooltips.length > 0) {
                text.add(lineNum++, tooltipModel.ctrlDescription)
            }

            if (tooltipModel.altTooltips.length > 0) {
                text.add(lineNum++, tooltipModel.altDescription)
            }
        })
    })
})
