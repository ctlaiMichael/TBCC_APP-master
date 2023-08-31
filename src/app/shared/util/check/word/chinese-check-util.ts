/**
 * Util Chinese String Check
 * 數值檢查處理
 */
import { CommonUtil } from '@shared/util/common-util';
import { StringCheckUtil } from '../string-check-util';
import { SymbolCheckUtil } from './symbol-check-util';

export const ChineseCheckUtil = {

    /**
     * 中文檢查
     * @param str 
     * @param check_type 特殊處理
     *  {
     *      english: boolean (true 允許英文)
     *      symbol: boolean (true 允許符號)
     *      number: boolean (true 允許數值)
     *  }
     *  or
     *  string:
     *      chinese_english (只允許中英文)
     *      onlychinese (只檢查中文)
     */
    checkChinese(str: string, check_type?: any) {
        let data = {
            status: true,
            msg: ''
        };
        let onlychinese = false;
        let check_english = true;
        let check_symbol = true;
        let check_number = true;
        if (typeof check_type === 'object') {
            check_english = (check_type.hasOwnProperty('english') && check_type['english']) ? true : false;
            check_symbol = (check_type.hasOwnProperty('symbol') && check_type['symbol']) ? true : false;
            check_number = (check_type.hasOwnProperty('number') && check_type['number']) ? true : false;
        } else if (typeof check_type === 'string') {
            switch (check_type) {
                case 'onlychinese': // 允許中英文
                    onlychinese = true;
                    break;
                case 'chinese_english': // 允許中英文
                    check_english = true;
                    check_number = false;
                    check_symbol = false;
                    break;
                case 'no_symbol': // 不允許符號
                    check_english = true;
                    check_number = true;
                    check_symbol = false;
                    break;
            }
        }

        // == error msg (中英數符) == //
        const error_msg = {
            '1111': '請勿輸入非中英數與特殊符號',
            '1000': '請勿輸入非中文',
            '1100': '請勿輸入非中英文',
            '1010': '請勿輸入英文與特殊符號',
            '1110': '請勿輸入特殊符號'
        };

        if (onlychinese) {
            data.msg = error_msg['1000'];
        } else {
            let error_key = '1';
            error_key += (check_english) ? '1' : '0';
            error_key += (check_number) ? '1' : '0';
            error_key += (check_symbol) ? '1' : '0';
            data.msg = (error_msg.hasOwnProperty(error_key)) ? error_msg[error_key] : error_msg['1111'];
        }

        // == 檢查表
        let exceptionArray = [
            0x0021, 0xff01, 0x0026, 0xff06, 0x0028, 0xff08, 0x0029, 0xff09, 0x002c, 0xff0c,
            0x002e, 0x3002, 0x003a, 0xff1a, 0x003b, 0xff1b, 0x003c, 0x300a, 0x003e, 0x300b,
            0x003f, 0xff1f, 0x0040, 0xff20, 0x005b, 0x005d, 0xff3b, 0xff3d, 0x3010, 0x3011,
            0x005f, 0xff3f, 0x0030, 0xff10, 0x0031, 0xff11, 0x0032, 0xff12, 0x0033, 0xff13,
            0x0034, 0xff14, 0x0035, 0xff15, 0x0036, 0xff16, 0x0037, 0xff17, 0x0038, 0xff18,
            0x0039, 0xff19
        ];

        let i: any;
        for (i = 0; i < str.length; i++) {
            let tmp_check = false;
            let check_str = str.charCodeAt(i);
            // 例外處理 2017/12/14@S 新增
            if (exceptionArray.indexOf(str.charCodeAt(i)) > -1) {
                tmp_check = true;
            }
            // 中文判斷(1)
            if (!tmp_check && check_str >= 0x2E80 && check_str <= 0x2FDF) {
                tmp_check = true;
            }
            // 中文判斷(2)
            if (!tmp_check && check_str >= 0x3400 && check_str <= 0x4DBF) {
                tmp_check = true;
            }
            // 中文判斷(3)
            if (!tmp_check && check_str >= 0x4E00 && check_str <= 0x9FFF) {
                tmp_check = true;
            }
            // 擴充中文
            if (!tmp_check && check_str >= 0xF900 && check_str <= 0xFAFF) {
                tmp_check = true;
            }
            // 注音判斷(沒用)
            if (!tmp_check && check_str >= 0x31A0 && check_str <= 0x31BF) {
                tmp_check = true;
            }
            // 允許英文數字特殊符號 // https://www.obliquity.com/computer/html/unicode0000.html
            if (!onlychinese && !tmp_check && check_str >= 0x0020 && check_str <= 0x007E) {
                tmp_check = true;
                // 數值 0030~0039
                let is_type = 'symbol';
                if (check_str >= 0x0030 && check_str <= 0x0039) {
                    is_type = 'number';
                    if (!check_number) {
                        // 不允許數值
                        tmp_check = false;
                    }
                }
                // 英文 0041~005A, 0061~007A
                if ((check_str >= 0x0041 && check_str <= 0x005A)
                    || (check_str >= 0x0061 && check_str <= 0x007A)
                ) {
                    is_type = 'english';
                    if (!check_english) {
                        // 不允許英文
                        tmp_check = false;
                    }
                }
                // 不允許特殊符號
                if (!check_symbol && is_type === 'symbol') {
                    tmp_check = false;
                }
            }


            if (!tmp_check) {
                data.status = false;
                break;
            }
        }

        if (data.status) {
            data.msg = '';
        }
        return data;
    },

    /**
     * text檢查
     * 一般文字檢核
     * @param str 字串
     */
    checkText(str: string, specail_symbol?: string) {
        let data = {
            status: true,
            msg: ''
        };
        // == 檢查表情符號 == //
        let check = StringCheckUtil.emojiCheck(str);
        if (!check.status) {
            data.status = false;
            data.msg = check.msg;
            return data;
        }
        // == 特殊符號檢查 == //
        if (typeof specail_symbol === 'undefined') {
            specail_symbol = '';
        }
        let check_symbol = SymbolCheckUtil.check(str, specail_symbol);
        if (!check_symbol.status) {
            data.status = false;
            data.msg = check_symbol.msg;
            return data;
        }

        let check_chin = this.checkChinese(str, {
            english: true,
            number: true,
            symbol: true
        });
        if (!check_chin.status) {
            data.status = false;
            data.msg = check_symbol.msg;
            return data;
        }


        return data;
    },

    notChinese(str) {
        let data = {
            status: false,
            msg: 'CHECK.ENGLISH_NUMBER'
        };
        let reg = /[\u2E80-\u9FFF]/;
        if (reg.exec(str) === null) {
            data.status = true;

        }
        return data;
    }
};
