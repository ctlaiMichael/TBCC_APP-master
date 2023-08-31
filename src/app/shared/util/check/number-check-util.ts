/**
 * Util Number Check
 * 數值檢查處理
 */
import { CommonUtil } from '@shared/util/common-util';
import { logger } from '@shared/util/log-util';

export const NumberCheckUtil = {

    /**
     * 數值檢查 (NumberCheck)
     * @param val 判斷值
     * @param specail 特殊指定
     * @param tmp_return_flag 回傳boolean
     */
    checkNumber(val: string | number, specail?: string, return_flag?: any) {
        // 是否為英數字混和且6 ~12碼
        // 原本為checkNumber(str, specail)
        let data = {
            status: false,
            msg: 'CHECK.NUMBER.NUMBER',
            data: val
        };
        if ((typeof val === 'undefined' || val == null || val == '') && val != '0') {
            return CommonUtil.modifyReturn(data, return_flag);
        }
        let str = val.toString().replace(/,/g, '');
        let res = /^[0-9]*$/; // 只要數值就好(允許0000存在) ([FBO]: isPosInteger)
        if (typeof specail !== 'undefined') {
            switch (specail) {
                case 'positive': // 正整數不含0
                    res = /^[0-9]*[1-9][0-9]*$/;
                    data.msg = 'CHECK.NUMBER.POSITIVE';
                    break;
                case 'negative': // 負整數不含0
                    res = /^-[0-9]*[1-9][0-9]*$/;
                    data.msg = 'CHECK.NUMBER.NEGATIVE';
                    break;
                case 'positive_float': // 正數不含0
                    // str = parseFloat(str);
                    // res = /^(([1-9]|[0-9]+\.[0-9]*|)[1-9][0-9]*)$/; // => 不允許1.00,0,0.00
                    res = /^(([1-9]|[0-9]+\.[0-9]*|)[0-9][0-9]*)$/; // => 允許1.00,0,0.00
                    data.msg = 'CHECK.NUMBER.POSITIVE_FLOAT';
                    break;
                case 'negative_float': // 負數不含0
                    // str = parseFloat(str);
                    // res = /^-(([1-9]|[0-9]+\.[0-9]*|)[1-9][0-9]*)$/; // => 不允許-1.00,0,0.00
                    res = /^-(([1-9]|[0-9]+\.[0-9]*|)[0-9][0-9]*)$/; // => 允許-1.00,0,0.00
                    data.msg = 'CHECK.NUMBER.NEGATIVE_FLOAT';
                    break;
                case 'number': // 只要數值就好
                    res = /^(0|(\-|)([1-9]|[0-9]+\.[0-9]*|)[1-9][0-9]*)$/;
                    data.msg = 'CHECK.NUMBER.NUMBER';
                    break;
            }
        }
        if (res.test(str)) {
            data.status = true;
            data.msg = '';
            data.data = str;
        }
        // this._logger.log('Number check:', data, specail, str);
        return CommonUtil.modifyReturn(data, return_flag);
    }

    /**
     * 數值比較
     * @param n1
     * @param n2
     * @param checkType
     *  > : check n1 > n2
     *  < : check n1 < n2
     *  = : check n1 = n2
     *  >= : check n1 >= n2
     *  <= : check n1 <= n2
     * @param return_flag 回傳類型，true回傳boolean
     */
    , compareNumber(n1: string | number, n2: string | number, checkType: string, return_flag?: any) {
        let output = {
            status: false,
            msg: 'CHECK.NUMBER.NUMBER',
            data: {
                n1: n1,
                n2: n2
            },
            error_list: {
                n1: '',
                n2: ''
            }
        };
        let check1 = this.checkNumber(n1);
        let check2 = this.checkNumber(n2);
        if (!check1.status || !check2.status) {
            if (!check1.status) {
                output.error_list.n1 = check1.msg;
            }
            if (!check2.status) {
                output.error_list.n2 = check2.msg;
            }
            return CommonUtil.modifyReturn(output, return_flag);
        }
        n1 = parseFloat(check1.data);
        n2 = parseFloat(check2.data);
        let same = false;
        let min = false;
        if (n1 > n2) {
            min = false;
        } else if (n1 < n2) {
            min = true;
        } else if (n1 == n2) {
            min = false;
            same = true;
        }
        // logger.log(n1, n2, same, min);

        switch (checkType) {
            case '>':
                output.status = !min;
                break;
            case '<':
                output.status = min;
                break;
            case '=':
                output.status = same;
                break;
            case '>=':
                if (!min || same) {
                    output.status = true;
                }
                break;
            case '<=':
                if (min || same) {
                    output.status = true;
                }
                break;
            default:
                output.msg = 'ERROR.DATA_FORMAT_ERROR';
                // 非預期參數
                break;
        }
        if (output.status) {
            output.msg = '';
        }

        return CommonUtil.modifyReturn(output, return_flag);
    }
};
