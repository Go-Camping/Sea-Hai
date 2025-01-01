// priority: 849
/**
 * 上球壳表面生成竹子
 * @type {SphereDecoratorModel}
 */
const UpShellBambooDecorator = new SphereDecoratorModel(
    'shell',
    (level, sphere, offset) => {
        return RandomChance(0.05) && IsUpShell(offset) && IsUpEmpty(level, sphere, offset)
    }, 
    (level, sphere, offset) => {
        return GenBamboo(level, sphere, offset)
    }
)