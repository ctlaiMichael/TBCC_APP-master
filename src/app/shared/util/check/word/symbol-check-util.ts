/**
 * Util Number Check
 * 數值檢查處理
 */
import { CommonUtil } from '@shared/util/common-util';
import { StringCheckUtil } from '@shared/util/check/string-check-util';

export const SymbolCheckUtil = {
    /**
     * 特殊symbol檢核
     * @param str
     * @param symbol_type
     */
    check(str: string, symbol_type: string) {
        let data = {
            status: true,
            msg: ''
        };

        let check_symbol: any = { status: true };
        // == 依照客製化狀況調整 == //
        switch (symbol_type) {
            case 'base_symbol':
                check_symbol = this.base_symbol(str);
                break;
            default:
                break;
        }
        if (!check_symbol.status) {
            data.status = false;
            data.msg = check_symbol.msg;
            return data;
        }

        return data;
    },


    /**
     * 取得symbol清單
     * @param symbol_type 
     */
    getSymbol(symbol_type: string) {
        let output = {
            msg: '',
            data: []
        };
        switch (symbol_type) {
            case 'base':
                output.msg = '';
                output.data = [
                    // '~', '=', '!', '"', '%', '&', '*', '<', '>', ';'
                    // , '@', '#', '$', '[', ']', '\\', '_', '^', '`', '|'
                    // , '-', ':'
                ];
                break;
            default:
                output.data = [];
                break;
        }

        return output;
    },

    /**
    * 符號檢核
    * @param str 字串
    */
    base_symbol(str) {
        let data = {
            status: false,
            msg: '請勿輸入符號：\'"#$%^*'
            // msg: this._langTransService.instant('CHECK.STRING.CUSTOM01') // 請勿輸入符號：\'"#$%^*
        };
        let reg = /['"#$%^*]/g;
        if (!reg.test(str)) {
            data.status = true;
            return data;
        } else {
            return data;
        }
    },

    /**
     * 符號檢核 (第一碼)
     * 調整檢核規則
     */
    symbol_first(val: string | number, set_data?: Object) {
        let output_data = {
            status: false,
            msg: 'MESSAGE.ERROR.FORMATE'
        };
        const return_type = (set_data instanceof Object
            && set_data.hasOwnProperty('return_type') && set_data['return_type']) ? true : false;

        if (typeof val === 'undefined' || typeof val === 'object') {
            return CommonUtil.modifyReturn(output_data, return_type);
        }
        let str = val.toString();

        const check_list = this.getSymbol('base');
        if (StringCheckUtil.checkStr(str, check_list, true)) {
            output_data.status = true;
            output_data.msg = '';
        }

        return CommonUtil.modifyReturn(output_data, return_type);
    }




};
