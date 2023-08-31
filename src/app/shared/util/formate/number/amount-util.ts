/**
 * Util Amount
 * 金額處理
 */
import { ObjectUtil } from '../modify/object-util';
import { EmptyUtil } from '../string/empty-util';

export const AmountUtil = {

    /**
     * 設定參數
     */
    getAmountSet(): object {
        return {
            decimal: 2, // 小數點位數
            // 無小數點幣別
            no_decimal: ['TWD', 'NTD', 'JPY']
        };
    },
    /**
     * 取得幣別類型
     * @param currency 
     */
    getCurrency(currency: any): object {
        let string_currency = '';
        let do_special = false;
        if (typeof currency !== 'undefined' && (currency instanceof Object)) {
            if (currency instanceof Array) {
                let currency_arr = ObjectUtil.clone(currency);
                currency = currency_arr.shift();
            }
            if (currency.hasOwnProperty('special')) {
                do_special = currency['special'];
            }
            currency = (currency.hasOwnProperty('currency') && typeof currency['currency'] === 'string') ? currency['currency'] : '';
        }
        // 把國家全部轉字串判斷(不給幣別比照外幣)
        if (typeof currency !== 'undefined') {
            // == 目前此功能關閉 == //
            string_currency = EmptyUtil.trimAll(currency).toLocaleUpperCase();
        }
        return {
            currency: string_currency,
            do_special: do_special
        };
    },

    /**
     * 金額格式化
     * @param value 金額
     * @param arg 幣別
     */
    amount(value: any, arg?: any): any {
        let replace_value;
        let num_value;
        let final_value;
        const error_value = value; // 錯誤回傳

        const amount_set = this.getAmountSet();
        let decimal_length = amount_set.decimal; // 小數點位數
        const no_decimal = amount_set.no_decimal;
        let currency = '';
        let do_empty = false;
        let empty_str = '- -';
        if (typeof arg !== 'object') {
            currency = arg;
        } else if (arg instanceof Array) {
            currency = (typeof arg[0] !== 'undefined') ? arg[0] : '';
            do_empty = (typeof arg[1] !== 'undefined' && arg[1]) ? true : false;
        } else if (typeof arg == 'object' && !!arg) {
            currency = (typeof arg['currency'] !== 'undefined') ? arg['currency'] : '';
            do_empty = (typeof arg['do_empty'] !== 'undefined' && arg['do_empty']) ? true : false;

            if (typeof arg['maxDocNum'] !== 'undefined') {
                let tmp_docnum = parseInt(arg['maxDocNum']);
                if (tmp_docnum) {
                    decimal_length = tmp_docnum;
                }
            }
        }

        const currency_set = this.getCurrency(currency);
        const do_special = currency_set.do_special;
        const string_currency = currency_set.currency;


        const Reg = /^(0|(\-|)([1-9]|[0-9]+\.[0-9]*|)[0-9][0-9]*)$/;
        // const Reg_Formate = new RegExp('^[1-9]\d*(((,\d{3}){1}){1,}?(\.\d{' + '2' + '})?)$');
        const Reg_Formate = /^(\-|)[1-9]\d*(((,\d{3}){1}){1,}?(\.\d{2})?)$/; // 金額formate

        // 判斷中台若回傳最後一位為.  則過濾掉.
        const tmp_str = value.toString();
        if (tmp_str.substr(-1) == '.') {
            value = tmp_str.substr(0, tmp_str.length - 1);
        }


        let has_pos = false;
        // 如果為字串判斷符不符合規則，不符合就擋掉
        replace_value = value;
        if (typeof value === 'string') {
            replace_value = value.replace(/,/g, '');
            if (replace_value.substr(0, 1) == '+') {
                has_pos = true;
                replace_value = replace_value.substr(1);
            }
        } else if (typeof value === 'object' && value) {
            return (!value && do_empty) ? empty_str : error_value;
        }

        // 數值檢查
        if (!Reg.test(replace_value)) {
            return (!value && do_empty) ? empty_str : error_value;
        }
        // 轉整數判斷是否為Nan
        num_value = parseFloat(replace_value);
        // console.error(isNaN(num_value))
        if (isNaN(num_value) === true) {
            return (!value && do_empty) ? empty_str : error_value;
        }
        // 是否已格式化檢查
        if (Reg_Formate.test(value)) {
            final_value = value;
        }

        // console.log('make formate', Reg_Formate.test(value), value, final_value);
        // == formate轉換 == //
        if (!final_value) {
            num_value = num_value.toFixed(decimal_length);
            final_value = num_value.toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        }
        // 特殊formate
        if (do_special && no_decimal.indexOf(string_currency) > -1 || no_decimal.indexOf(currency) > -1) {
            final_value = final_value.replace(/\.(\d*)?/g, '');
        }
        if (has_pos) {
            final_value = '+' + final_value;
        }
        return final_value;
    },
    /**
     * 顯示幣別與金額
     * @param value 
     * @param currency 
     */
    currencyAmount(value: any, currency?: any): any {
        let data = this.amount(value, currency);
        let ccy_str = '';
        if (typeof currency !== 'undefined') {
            const currency_data = this.getCurrency(currency);
            ccy_str = currency_data.currency;
        }
        if (ccy_str !== '') {
            data = ccy_str + ' ' + data;
        }
        return data;
    }


};
