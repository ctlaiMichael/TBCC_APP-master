/**
 * Util Account Check
 * 帳號檢查處理
 */
import { CommonUtil } from '@shared/util/common-util';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { StringCheckUtil } from '@shared/util/check/string-check-util';
import { NumberCheckUtil } from '@shared/util/check/number-check-util';

export const AccountCheckUtil = {

    /**
     * [checkActNum 檢查銀行帳號]
     * @param val 
     * @param set_data 其他檢驗項目
     *      return_type 回傳格式 true: boolean, false/undefined: Object (Default)
     *      check_length 檢驗長度 (Default)=3
     *      check_empty 檢查空值: true 檢查 (Default) , false 不檢查
     *      not_zero 允許0: true 不可有0  (Default), false 可有0
     *      check_formate 帳號允許特殊格式
     *          english_number
     *          number
     *          false 不檢查
     */
    checkActNum(val: string|number, set_data?: any) {
        let data = {
            status: false,
            msg: 'CHECK.ACCOUNT', // 請輸入正確的帳號資料
            data: '',
            data_formate: ''
        };
        // == 參數處理 == //
        let return_type = false;
        let check_empty = true;
        let not_zero = true;
        let check_formate: any = 'number';
        let check_length = 3;
        if (set_data instanceof Object) {
            return_type = (set_data.hasOwnProperty('return_type') && set_data.return_type) ? true : false;
            check_empty = (set_data.hasOwnProperty('check_empty') && set_data.check_empty === false) ? false : true;
            not_zero = (set_data.hasOwnProperty('not_zero') && set_data.not_zero === false) ? false : true;
            if (set_data.hasOwnProperty('check_formate')) {
                check_formate = set_data.check_formate;
            }
            if (set_data.hasOwnProperty('check_length') && typeof set_data.check_length === 'number') {
                check_length = set_data.check_length;
            }
        }

        let check_str = val.toString();
        if (check_empty) {
            // 不為空，且僅可為大於零的數字
            const checkEmptyError = ObjectCheckUtil.checkEmpty(check_str, false, not_zero);
            if (!checkEmptyError.status) {
                return CommonUtil.modifyReturn(data, return_type);
            }
        }

        // == [Check1: 格式檢查] == //
        if (check_formate) {
            if (check_formate === 'english_number') {
                //  (外幣授款人帳號檢核)
                // == 輸入英數字、「.」、「-」、「/」、「空白」! == //
                // (1) 檢核僅可輸入半形字
                if (!StringCheckUtil.checkHalfWidth(check_str, true)) {
                    data.msg = 'CHECK.ENGLISH_ACCOUNT';
                    return CommonUtil.modifyReturn(data, return_type);
                }
                // (2) 允許：英文、數字、「.」、「-」、「/」、「空白」，且前後不可以為空白
                let res = /^[A-Za-z0-9\.\-\/](|(|[A-Za-z0-9\s\.\-\/])+[A-Za-z0-9\.\-\/])$/;
                if (!res.test(check_str)) {
                    data.msg = 'CHECK.ENGLISH_ACCOUNT';
                    return CommonUtil.modifyReturn(data, return_type);
                }
            } else if (check_formate === 'not_do') {
                // 啥都不做
            } else {
                // == 純數值 == //
                const number_type = 'positive'; // 正整數檢查
                const checkNumError = NumberCheckUtil.checkNumber(check_str, number_type, false);
                if (!checkNumError.status && check_str !== '0') {
                    // 檢驗不可輸入0，以於上述checkEmpty環節完成，故此區塊出現0時須核可
                    data.msg = checkNumError.msg;
                    return CommonUtil.modifyReturn(data, return_type);
                }
            }
        }

        // == [Check2: 長度檢查] == //
        // 長度不能小於3碼
        const checkLengthError = StringCheckUtil.checkLength(check_str, check_length, 'min');
        if (!checkLengthError.status) {
            data.msg = checkLengthError.msg;
            return CommonUtil.modifyReturn(data, return_type);
        }

        data.status = true;
        data.msg = '';
        return CommonUtil.modifyReturn(data, return_type);
    }




};
