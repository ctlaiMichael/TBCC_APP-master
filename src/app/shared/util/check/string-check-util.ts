/**
 * Util Number Check
 * 數值檢查處理
 */
import { CommonUtil } from '@shared/util/common-util';
import { AccountMaskUtil } from '@shared/util/formate/mask/account-mask-util';

export const StringCheckUtil = {

    /**
     * 檢查資料
     * @param str 
     * @param check_list 
     */
    checkStr(str: string, check_list: Array<any>, return_type?: boolean) {
        let output_data = {
            status: false,
            msg: 'MESSAGE.ERROR.FORMATE'
        };
        let tmp_flag = true;
        let i: any;
        for (i = 0; i < str.length; i++) {
            let ch = str.charAt(i);
            if (check_list.indexOf(ch) > -1) {
                tmp_flag = false;
                break;
            }
        }

        if (tmp_flag) {
            output_data.status = true;
            output_data.msg = '';
        }
        return CommonUtil.modifyReturn(output_data, return_type);
    },
    /**
      * [checkLength 字串長度檢查]
      * @param  {[type]} str    [字串]
      * @param  {[type]} length [檢核長度]
      * @param  {[type]} type [檢核類型]
      * @return {[type]}        [description]
      */
    checkLength(str, length, type) {
        let data = {
            status: false,
            msg: '',
            replace: ''
        };
        if (typeof str !== 'string') {
            return data;
        }
        if (typeof type === 'undefined') {
            type = 'same';
        }

        // 因為i18n改機制，所以更換處理方法
        const i18n_value = {
            'max': '長度不可超過 %0 位' // 'CHECK.STRING.OVER' // '長度不可超過 %0 位';
            , 'min': '長度不可小於 %0 位' // 'CHECK.STRING.LIMIT' // '長度不可小於 %0 位';
            , 'same': '長度不等於 %0 位' // 'CHECK.STRING.UNEQUAL' // '長度不等於 %0 位';
            , 'amount_max': '金額整數位最長為 %0 碼"' // 'CHECK.STRING.MAX'  // '金額整數位最長為 %0 碼';
            , 'integer_max': '整數位最長為 %0 碼' // 'CHECK.STRING.INTEGER_MAX' // 整數位最長為 %0 碼
            , 'decimal_max': '小數位最長為 %0 碼' // 'CHECK.STRING.DECIMAL_MAX' // 小數位最長為 %0 碼
        };
        const str_length = str.length;
        switch (type) {
            case 'amount_max':
            case 'integer_max':
            case 'decimal_max':
            case 'max':
                if (str_length > length) {
                    data.msg = i18n_value[type];
                    data.replace = length;
                    data.msg = data.msg.replace('%0', data.replace.toString());
                    return data;
                }
                break;
            case 'min':
                if (str_length < length) {
                    data.msg = i18n_value[type];
                    data.replace = length;
                    data.msg = data.msg.replace('%0', data.replace.toString());
                    return data;
                }
                break;
            case 'same':
                let check_list = [];
                if (length instanceof Array) {
                    check_list = length;
                } else {
                    check_list = [length];
                }
                let check_flag = false;
                check_list.forEach((ch_length) => {
                    if (str_length === length) {
                        check_flag = true;
                    }
                });
                if (!check_flag) {
                    const msg_length = check_list.join(',');
                    data.msg = i18n_value[type];
                    data.replace = msg_length;
                    data.msg = data.msg.replace('%0', data.replace.toString());
                    return data;
                }
                break;
        }

        data.status = true;
        data.msg = '';
        return data;
    },

    /**
     * 去除全形空白後的字串長度檢查 (checkLenZh)
     * @param str
     * @param return_type
     */
    checkHalfWidth(str: String, return_type?: any) {
        let data = {
            status: false,
            msg: 'CHECK.STRING.OnlyHalfChar',
            data: str,
            data_formate: ''
        };
        data.data_formate = str.replace(/[^\x00-\xff]/g, '**');

        if (str.length === data.data_formate.length) {
            data.status = true;
            data.msg = '';
        }
        return CommonUtil.modifyReturn(data, return_type);
    },

    /**
     * [checkEnglish 英文檢查]
     * @param  {string} str      [英文字串]
     * @param  {string} check_type [檢核類別]
     * @return {obj}	{status:blooean,msg:'error msg'}
     */
    checkEnglish(str: string, check_type?: string, return_type?: Boolean) {
        let data = {
            status: false,
            msg: 'CHECK.ENGLISH'
        };
        let res = /^[A-Za-z]+$/;
        if (typeof check_type !== 'undefined') {
            // == 其他格式檢查 == //
            switch (check_type) {
                case 'english_number': // 英數字 [FBO]: isAlpha
                    res = /^[A-Za-z0-9]+$/;
                    data.msg = 'CHECK.ENGLISH_NUMBER';
                    break;
                case 'english_number_symbol': // 英數字加特殊符號 [FBO]: isAlpha
                    res = /^[A-Za-z0-9\s\.-]+$/;
                    data.msg = 'CHECK.ENGLISH_NUMBER';
                    break;
                case 'spacebar':
                default:
                    res = /^[A-Za-z\s\.-]+$/; // 空白、.、-
                    data.msg = 'CHECK.ENGLISH_SPACEBAR';
                    break;
            }
        }
        if (res.test(str)) {
            data.status = true;
            data.msg = '';
        }
        let returnflag = (return_type) ? true : false;
        return CommonUtil.modifyReturn(data, returnflag);
    },

    /**
     * emoji檢查
     * @param str
     */
    emojiCheck(str: string) {
        // 未經驗證
        let data = {
            status: true,
            msg: '請勿輸入符號' // '請勿輸入符號'
        };

        let i = 0;
        for (i = 0; i < Array.from(str).length; i++) {
            let strA = Array.from(str)[i];
            if (Object.keys(strA).length >= 2) {
                data.status = false;
                break;
            }
        }
        return data;
    },

    /**
     * 檢查是否存在子字串
     * @param src 原字串
     * @param contain 子字串
     */
    containStr(src: string, contain: string) {
        if (!!src && !!contain) {
            return src.indexOf(contain) > -1;
        } else {
            return false;
        }
    }


};
