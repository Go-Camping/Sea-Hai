// priority: 500
ServerEvents.commandRegistry(event => {
    const { commands: Commands, arguments: Arguments } = event
    event.register(
        Commands.literal('sh')
            .requires(src => src.hasPermission(2))
            .then(Commands.literal('sdm_exchange')
                .then(Commands.argument('player', Arguments.PLAYER.create(event))
                    .then(Commands.argument('type', Arguments.WORD.create(event))
                        .then(Commands.argument('isExtract', Arguments.BOOLEAN.create(event))
                            .executes(ctx => {
                                let type = Arguments.WORD.getResult(ctx, 'type')
                                let isExtract = Arguments.BOOLEAN.getResult(ctx, 'isExtract')
                                let player = ctx.source.server.getPlayer(Arguments.PLAYER.getResult(ctx, 'player'))
                                switch (type) {
                                    case 'inv':
                                        if (isExtract) {
                                            let money = $SDMShopR.getMoney(player)
                                            let coinList = ConvertMoneyIntoCoinItemList(CoinList, money)
                                            coinList.forEach(coinItem => {
                                                player.give(coinItem)
                                            })
                                            $SDMShopR.setMoney(player, 0)
                                            player.tell(Text.translatable('command.kubejs.sdm_exchange.1', money))
                                        } else {
                                            let moneyList = {}
                                            player.inventory.allItems.forEach(item => {
                                                if (item.hasTag('lightmanscurrency:coins') && !item.hasTag('lightmanscurrency:event_coins')) {
                                                    if (moneyList[item.id]) {
                                                        moneyList[item.id] += item.count
                                                    } else {
                                                        moneyList[item.id] = item.count
                                                    }
                                                    item.setCount(0)
                                                }
                                            })
                                            let money = 0
                                            Object.keys(moneyList).forEach(coinItem => {
                                                money = ConvertItem2MoneyValue(Item.of(coinItem, moneyList[coinItem])).getCoreValue() + money
                                            })
                                            $SDMShopR.addMoney(player, money)
                                            player.tell(Text.translatable('command.kubejs.sdm_exchange.2', money))
                                        }
                                        break
                                    case 'bank':
                                        let playerBankAccount = $BankSaveData.GetBankAccount(player)
                                        if (isExtract) {
                                            let money = $SDMShopR.getMoney(player)
                                            playerBankAccount.depositMoney(ConvertMainMoneyValue(money))
                                            $SDMShopR.setMoney(player, 0)
                                            player.tell(Text.translatable('command.kubejs.sdm_exchange.3', money))
                                        } else {
                                            let moneyValueList = playerBankAccount.storedMoney.allValues()
                                            let moneyValueTotal = $CoinValue.fromNumber('main', 0)
                                            moneyValueList.forEach(moneyValue => {
                                                if (moneyValue.getUniqueName() == 'lightmanscurrency:coins!main') {
                                                    moneyValueTotal = moneyValueTotal.addValue(moneyValue)
                                                }
                                            })
                                            $SDMShopR.addMoney(player, moneyValueTotal.getCoreValue())
                                            playerBankAccount.extractMoney(moneyValueTotal, false)
                                            player.tell(Text.translatable('command.kubejs.sdm_exchange.2', moneyValueTotal.getCoreValue()))
                                        }
                                        break
                                    default:
                                        return 1
                                }
                                return 1
                            })
                        )
                    )
                )
            )
    )


})

ServerEvents.command((event) => {
    const player = event.parseResults.context.source.player
    if (!player || player.hasPermissions(4)) return
    if (event.input.startsWith('kubejs stages') || event.input.startsWith('kjs stages')) {
        //提示玩家缺少权限
        player.tell($Serializer.fromJsonLenient({ translate: 'commands.help.failed' }))
        event.cancel()
    }
})