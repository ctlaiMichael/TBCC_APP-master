/**
 * Util Money Check
 * 金額檢查處理
 */
import { CommonUtil } from '@shared/util/common-util';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { StringCheckUtil } from '@shared/util/check/string-check-util';
import { NumberCheckUtil } from '@shared/util/check/number-check-util';
import { AmountUtil } from '@shared/util/formate/number/amount-util';
import { logger } from '@shared/util/log-util';

export const MoneyCheckUtil = {


    /**
     * 金額欄位檢查
     * @param money 金額
     * @param set_data 其他檢驗項目
     *      return_type 回傳格式 true: boolean, false/undefined: Object (Default)
     *      currency 幣別 (TWD或JPY時，金額只能為整數) (Default)='' (POSITIVE): 只能輸入正整數
     *      check_empty 檢查空值: true 檢查 (Default) , false 不檢查
     *      not_zero 允許0: true 不可有0  (Default), false 可有0
     */
    checkMoney(money: string|number, set_data?: any) {
        let data = {
            status: false,
            msg: 'CHECK.AMOUNT', // 請輸入金額
            data: '',
            data_formate: ''
        };
        // == 參數處理 == //
        let return_type = false;
        let currency = '';
        const currency_list = ['TWD', 'JPY', 'POSITIVE']; // 指定幣別只允許出現正整數
        let check_empty = true;
        let not_zero = true;
        let maxIntNum = 13; // 交易金額整數位最長為13碼
        let maxDocNum = 2; // 交易金額小數位最長為2碼
        if (set_data instanceof Object) {
            return_type = (set_data.hasOwnProperty('return_type') && set_data.return_type) ? true : false;
            currency = (set_data.hasOwnProperty('currency')) ? set_data.currency : '';
            check_empty = (set_data.hasOwnProperty('check_empty') && set_data.check_empty === false) ? false : true;
            not_zero = (set_data.hasOwnProperty('not_zero') && set_data.not_zero === false) ? false : true;
            if (set_data.hasOwnProperty('maxIntNum') && NumberCheckUtil.checkNumber(set_data['maxIntNum'], 'positive', true)) {
                maxIntNum = parseInt(set_data['maxIntNum']);
            }
            if (set_data.hasOwnProperty('maxDocNum') && NumberCheckUtil.checkNumber(set_data['maxDocNum'], 'positive', true)) {
                maxDocNum = parseInt(set_data['maxDocNum']);
            }
        }

        let check_str = money.toString();
        if (check_empty) {
            const checkEmptyError = ObjectCheckUtil.checkEmpty(check_str, false, not_zero);
            if (!checkEmptyError.status) {
                return CommonUtil.modifyReturn(data, return_type);
            }
            check_str = checkEmptyError.data_trim;
        }
        check_str = check_str.replace(/,/g, ''); // 清除格式化資訊

        if (not_zero && parseFloat(check_str) === 0) {
            // 不可為0
            return CommonUtil.modifyReturn(data, return_type);
        }

        // == [Check1: 數字檢查] == //
        const number_type = (currency !== '' && currency_list.indexOf(currency) > -1) ? 'positive' : 'positive_float'; // 正整數/正符點數
        if (!NumberCheckUtil.checkNumber(check_str, number_type, true) && check_str !== '0') {
            // 檢驗不可輸入0，以於上述checkEmpty環節完成，故此區塊出現0時須核可
            if (number_type === 'positive') {
                // data.msg = this._langTransService.instant('CHECK.AMOUNT_CURRENCY', currency); // 幣別為 %0 時，金額只能為整數！
                data.msg = '幣別為 %0 時，金額只能為整數！'.replace('%0', currency); // 幣別為 %0 時，金額只能為整數！
                if (currency === 'POSITIVE') {
                    data.msg = 'CHECK.NUMBER.POSITIVE'; // 幣別為 %0 時，金額只能為整數！
                }
                // data.msg = 'CHECK.AMOUNT_DECIMAL'; // AMOUNT_DECIMAL
            // } else if (number_type === 'positive_float') {
            //     data.msg = '幣別為 %0 時，金額只能為數字！'.replace('%0', currency);
            }
            return CommonUtil.modifyReturn(data, return_type);
        }

        // == [Check2: 長度檢查] == //
        const number_list = check_str.split('.');
        let check_length = StringCheckUtil.checkLength(number_list[0], maxIntNum, 'amount_max');
        if (!check_length.status) {
            // data.msg = this._langTransService.instant('CHECK.NUMBER.moneyIntMaxLength', maxIntNum.toString()); // 金額整數位最長為%0碼
            data.msg = '金額整數位最長為%0碼'.replace('%0', maxIntNum.toString()); // 金額整數位最長為%0位
            return CommonUtil.modifyReturn(data, return_type);
        }
        if (number_type === 'positive_float' && typeof number_list[1] !== 'undefined') {
            check_length = StringCheckUtil.checkLength(number_list[1], maxDocNum, 'decimal_max');
            if (!check_length.status) {
                // data.msg = this._langTransService.instant('CHECK.NUMBER.moneyIntMinLength', maxDocNum.toString()); // 金額小數欄位最多為%0位
                data.msg = '金額小數欄位最多為%0位'.replace('%0', maxDocNum.toString()); // 金額小數欄位最多為%0位
                return CommonUtil.modifyReturn(data, return_type);
            }
        }

        data.status = true;
        data.msg = '';
        data.data_formate = AmountUtil.amount(check_str);
        if (/\.(|0(|0)|[1-9]{1}0)$/.test(data.data_formate)) {
            data.data_formate = data.data_formate.replace(/(\.0(|0)$|0$|\.$)/, ''); // 強制去除.00或.X0的0
        }
        return CommonUtil.modifyReturn(data, return_type);
    }



};
