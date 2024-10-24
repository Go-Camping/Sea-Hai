StartupEvents.registry('item', event => {
    const NEWER_BOBBER = event.create('newer_fishing_line').maxStackSize(1)
    const NEWER_FISHING_LINE = event.create('newer_bobber').maxStackSize(1)
    const NEWER_HOOK = new $HookBuilder('newer').setModID("kubejs").setColor($ChatFromatting.GRAY).setWeight(new Vec3d(0.8, 1, 0.8)).build()
    const NEWER_BAIT = event.createCustom('newer_bait', () => $AquacultureAPI.createBait(20, 1))
})