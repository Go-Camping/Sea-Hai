// priority: 950


// $BankAPI.API.BankDepositFromServer()

/**
 * @param {number} value 
 * @returns {Internal.MoneyValue}
 */
function ConvertMainMoneyValue(value) {
    return $CoinValue.fromNumber('main', value)
}
