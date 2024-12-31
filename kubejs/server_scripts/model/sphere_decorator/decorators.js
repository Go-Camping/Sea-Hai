// priority: 849
/**
 * 上球壳生成竹子
 * @type {SphereDecoratorModel}
 */
const UpShellBambooDecorator = new SphereDecoratorModel(
    'shell',
    (level, sphere, curPos) => {
        return IsUpShell(curPos)
    }, 
    (level, sphere, curPos) => {
        return GenBamboo(level, sphere, curPos)
    }
)