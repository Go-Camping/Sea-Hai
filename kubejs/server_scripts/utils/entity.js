// priority: 1000
/**
 * 获取生物状态
 * @param {Internal.PathfinderMob} mob 
 * @returns 
 */
function GetEntityStatus(mob) {
    if (mob.persistentData.contains('status')) {
        return mob.persistentData.getString('status')
    }
    return STATUS_IDLE
}

/**
 * 获取旧生物状态，这往往用于一些长效性的判断过程
 * @param {Internal.PathfinderMob} mob 
 * @returns {string[]}
 */
function GetEntityOldStatus(mob) {
    let oldStatsuList = []
    if (mob.persistentData.contains('oldStatus')) {
        let oldStatusNbtList = mob.persistentData.getList('oldStatus', GET_STRING_TYPE)
        oldStatusNbtList.forEach(oldStatus => {
            oldStatsuList.push(oldStatus)
        })
        return oldStatsuList
    }
    
    return oldStatsuList
}

/**
 * 设置生物状态
 * @param {Internal.PathfinderMob} mob 
 * @param {string} status
 * @returns {boolean}
 */
function SetEntityStatus(mob, status) {
    let oldStatus = GetEntityStatus(mob, status)
    let oldStatsuList = mob.persistentData.getList('oldStatus', GET_STRING_TYPE)
    if (!oldStatsuList) oldStatsuList = new $ListTag()
    oldStatsuList.add(oldStatus)
    mob.persistentData.put('oldStatus', oldStatsuList)
    mob.persistentData.putString('status', status)
    return STATUS_IDLE
}