// priority: 800
ServerEvents.recipes(event => {
    event.recipes.custommachinery.custom_machine('kubejs:shining_workbench', 200)
        .requireItem(Item.of('kubejs:shining_potion_fish'), 'potion_input')
        .requireFunctionToStart(ctx => {
            let machine = ctx.machine
            let itemOutput = machine.getItemStored('item_output')
            let expInput = machine.getItemStored('exp_input')
            if (!itemOutput.isEmpty() || !expInput.isEmpty()) return ctx.error('')

            let itemInput = machine.getItemStored('item_input')
            if (itemInput.isEmpty() || !itemInput.hasTag('kubejs:aquatic_products')) return ctx.error('')

            if (!machine.data.exp_bar || machine.data.exp_bar < 100) return ctx.error('')
            machine.data.exp_bar -= 100
            return ctx.success()
        })
        .requireFunctionOnEnd(ctx => {
            let machine = ctx.machine

            let itemOutput = machine.getItemStored('item_output')
            if (!itemOutput.isEmpty()) return ctx.error('')

            let itemInput = machine.getItemStored('item_input')
            if (itemInput.isEmpty() || !itemInput.hasTag('kubejs:aquatic_products')) return ctx.error('')
            let outputItem = itemInput.copy().withCount(1)
            new ItemQaulityModel(outputItem).increaseQuality()
            machine.setItemStored('item_input', itemInput.withCount(itemInput.getCount() - 1))
            machine.setItemStored('item_output', outputItem)
            return ctx.success()
        })
        .resetOnError()

    event.recipes.custommachinery.custom_machine('kubejs:shining_workbench', 40)
        .requireFunctionToStart(ctx => {
            let machine = ctx.machine
            let expInput = machine.getItemStored('exp_input')
            if (expInput.isEmpty() || !expInput.hasNBT()) return ctx.error('')

            return ctx.success()
        })
        .requireFunctionEachTick(ctx => {
            let machine = ctx.machine
            let expInput = machine.getItemStored('exp_input')
            if (expInput.isEmpty() || !expInput.hasNBT()) return ctx.error('')
            return ctx.success()
        })
        .requireFunctionOnEnd(ctx => {
            let machine = ctx.machine
            let expInput = machine.getItemStored('exp_input')
            if (expInput.isEmpty() || !expInput.hasNBT()) return ctx.error('')
            let expAmount = expInput.nbt.getInt('amount')
            machine.setItemStored('exp_input', Item.empty)

            machine.data.exp_bar = machine.data.exp_bar ? Math.min(machine.data.exp_bar + expAmount, BAR_MAX) : expAmount
            return ctx.success()
        })
        .resetOnError()
})