// priority: 800
const MENU_WORKBENCH_INPUT_SOLT_LIST = ['input_1', 'input_2', 'input_3', 'input_4', 'input_5', 'input_6', 'input_7', 'input_8', 'input_9']
ServerEvents.recipes(event => {
    event.recipes.custommachinery.custom_machine('kubejs:menu_workbench', 20)
        .requireButtonPressed('start_botton')
        .requireFunctionOnStart(ctx => {
            let machine = ctx.machine
            let menuOutput = machine.getItemStored('menu_output')
            let paperInput = machine.getItemStored('paper_input')
            if (menuOutput && !menuOutput.isEmpty()) {
                return ctx.success()
            } else {
                if (paperInput && !paperInput.isEmpty()) {
                    machine.removeItemFromSlot('paper_input', 1, false)
                    return ctx.success()
                }
            }
            return ctx.error('')
        })
        .requireFunctionOnEnd(ctx => {
            let machine = ctx.machine
            let outputMenuItem = Item.of('kubejs:menu')
            let nbt = new $CompoundTag()
            let itemListNbt = new $ListTag()
            MENU_WORKBENCH_INPUT_SOLT_LIST.forEach(slotName => {
                if (machine.getItemStored(slotName).isEmpty()) return
                let soltItem = machine.getItemStored(slotName)
                itemListNbt.add(ConverItemStack2NBT(soltItem))
            })
            nbt.put('inventory', itemListNbt)
            machine.setItemStored('menu_output', outputMenuItem.withNBT(nbt))
            return ctx.success()
        })
        
})