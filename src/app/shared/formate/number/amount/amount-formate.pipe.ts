/**
 * Amount Pipe
 */
import { Pipe, PipeTransform } from '@angular/core';
import { AmountUtil } from '@shared/util/formate/number/amount-util';


/**
 * 幣別與金額pipe
 * @param value 金額
 * @param currency 幣別
 * {{'23111.01' | currencyMoney:'TWD'}} // TWD 23,111
 * {{'23111.01' | currencyMoney:'USD'}} // USD 23,111.01
 */
@Pipe({
    name: 'currencyMoney'
})
export class CurrencyMoneyPipe implements PipeTransform {
    constructor(
    ) { }
    transform(value: any, currency: any): any {
        return AmountUtil.currencyAmount(value, currency);
    }
}

