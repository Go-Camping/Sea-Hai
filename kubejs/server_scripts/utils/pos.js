// priority: 1000

/**
 * 
 * @param {BlockPos} pos 
 * @returns {BlockPos}
 */
function RandomOffsetPos(pos, amplifier) {
    return pos.offset(Math.random() * amplifier * 2 - amplifier, 0, Math.random() * amplifier * 2 - amplifier);
}