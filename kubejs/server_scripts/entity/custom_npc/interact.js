// priority: 999
/**
 * NPC互动策略
 * @constant
 * @type {Object<int,function(EntityWorkInPOI, Internal.BlockContainerJS):DefaultPOIModel>}
 */
const NPCSubStatusItemInteractModelStrategies = {}

/**
 * @param {int} id 
 * @param {function(Internal.ItemEntityInteractedEventJS, EntityWorkInPOI)} model 
 */
function RegistryNPCSubStatusItemInteractStrategy(id, strategy) {
    NPCSubStatusItemInteractModelStrategies[id] = (event, workInPOIModel) => strategy(event, workInPOIModel)
}


ItemEvents.entityInteracted(event => {
    /**@type {Internal.EntityCustomNpc} */
    const target = event.target
    if (!target instanceof $EntityCustomNpc) return
    if (event.getHand() == 'off_hand') return
    if (GetEntityStatus(target) != STATUS_WORK_IN_POI) return
    const workInPOIModel = new EntityWorkInPOI(target)
    const subStatus = workInPOIModel.getSubStatus()

    if (NPCSubStatusItemInteractModelStrategies[subStatus]) {
        NPCSubStatusItemInteractModelStrategies[subStatus](event, workInPOIModel)
    }
})