/**
 * 基本Number常用pipe
 */
import { Pipe, PipeTransform } from '@angular/core';
import { AmountUtil } from '@shared/util/formate/number/amount-util';
import { MathUtil } from '@shared/util/formate/number/math-util';
import { NumberUtil } from '@shared/util/formate/number/number-util';


/**
 * 數值pipe
 * @param value 數值
 * @param doParse 形態處理
 * {{'23,111.01' | htNumber}} // 23111
 * {{'23,111.01' | htNumber:'int'}} // 23111
 * {{'23,111.01' | htNumber:'float'}} // 23111.01
 */
@Pipe({
    name: 'htNumber'
})
export class HtNumberPipe implements PipeTransform {
    constructor(
    ) { }
    transform(value: any, doParse: any): any {
        return NumberUtil.toNumber(value, doParse);
    }
}

/**
 * 金額pipe
 * @param value 金額
 * @param currency 幣別
 * {{'2017/1/1' | htMoney:'TWD'}}
 * {{'2017/1/1' | htMoney:{currency:'TWD'}}}
 * {{'2017/1/1' | htMoney:{maxDocNum:1}}} // 強制指定小數位一位
 */
@Pipe({
    name: 'htMoney'
})
export class HtMoneyPipe implements PipeTransform {
    constructor(
    ) { }
    transform(value: any, set_data?: any): any {
        // string
        // undefined
        let currency;
        let arg: any;
        if (typeof set_data == 'object') {
            arg = set_data;
        } else {
            currency = set_data;
            arg = [currency, true]; // 強制呈現- -
        }

        return AmountUtil.amount(value, arg);
    }
}


/**
 * @param value 文字
 * {{'aaabb' | htFinancial}}
 * flag=>外幣匯率用
 */
@Pipe({
    name: 'htFinancial'
})
export class HtFinancialPipe implements PipeTransform {
    constructor(
    ) { }
    transform(value: any, symbol?: boolean,flag?:string) {
        return NumberUtil.toFinancial(value, symbol,flag);
    }
}


/**
 * @param value 文字
 * {{'aaabb' | htFundSetNumber}}
 * flag=>基金觀察組合專用
 */
@Pipe({
    name: 'htFundSetNumber'
})
export class HtFundSetNumberPipe implements PipeTransform {
    constructor(
    ) { }
    transform(value: any) {
        return NumberUtil.toFundSetNumber(value);
    }
}