// priority: 1000

/**
 * 
 * @param {BlockPos} pos 
 * @returns {BlockPos}
 */
function RandomOffsetPos(pos, amplifier) {
    return pos.offset(Math.random() * amplifier - amplifier / 2, 0, Math.random() * amplifier - amplifier / 2);
}