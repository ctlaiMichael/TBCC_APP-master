/**
 * Check Util 物件檢核
 */
import { CommonUtil } from '@shared/util/common-util';
import { logger } from '../log-util';
export const ObjectCheckUtil = {
    /**
     * checkUndefined 檢查資料是否存在
     * @param inp_data
     * @param required_list
     */
    checkUndefined(inp_data: Object, required_list: Array<any>) {
        const data = {
            status: false,
            msg: 'Error checkUndefined',
            error_msg_list: {}
        };
        data.error_msg_list = {};
        let result;
        required_list.forEach((obj_key) => {
            result = this.checkEmpty(inp_data[obj_key]);
            if (!result.status) {
                // console.log('check empty :'+obj_key+'/'+inp_data[obj_key]);
                data.error_msg_list[obj_key] = result.msg;
            }
        });
        // ==check end== //
        if (Object.keys(data.error_msg_list).length === 0) {
            data.status = true;
            data.msg = '';
            return data;
        }
        return data;
    },

    /**
	 * [checkEmpty 判斷空值]
	 * @param  str [字串]
	 * @param  type [回傳類型] 1 blooean , 0 obj
	 * @param  zero_type [0是否可以] true : 不可為0
     */
    checkEmpty(str: string | number | object, type?: boolean, zero_type?: boolean): any {
        let data = {
            status: false,
            msg: 'CHECK.EMPTY',
            data: str,
            data_trim: str
        };
        const return_type = (typeof type !== 'undefined' && type) ? true : false;
        if (typeof str === 'object') {
            data.status = (!!str && Object.keys(str).length > 0) ? true : false;
            if (data.status) {
                data.msg = '';
            }
            return CommonUtil.modifyReturn(data, return_type);
        }
        // == 字串 == //
        if (typeof str === 'number') {
            str = str.toString();
        }
        if (typeof str !== 'string') {
            return CommonUtil.modifyReturn(data, return_type);
        }
        str = str.replace(/^\s+|\s+$/g, '');
        data.data_trim = str;

        if (str !== '') {
            data.status = true;
        }
        // == 0的判斷 == //
        // tslint:disable-next-line:radix
        if (zero_type && parseFloat(str) == 0) {
            data.status = false;
        }

        if (data.status) {
            data.msg = '';
        }

        return CommonUtil.modifyReturn(data, return_type);
    },

    checkObject(jsonObj, field?: string): boolean {
        let output = false;
        if (typeof jsonObj === 'object' && jsonObj && !(jsonObj instanceof Array)) {
            output = true;
            if (typeof field !== 'undefined' && (
                !jsonObj.hasOwnProperty(field) || !jsonObj[field] || jsonObj === null
            )) {
                output = false;
            }
        }
        return output;
    },

    /**
     * 檢查物件
     * @param jsonObj 檢查物件
     * @param check_list 檢查層級
     * @param return_type 回傳類別
     */
    checkObjectList(jsonObj: any, check_list: string, return_type?: string): any {
        const tmp_list = check_list.split('.');
        let data: any = jsonObj;
        let check_flag = true;
        while (tmp_list.length > 0) {
            let tmp_key = tmp_list.shift();
            if (this.checkObject(data, tmp_key)) {
                data = data[tmp_key];
            } else {
                check_flag = false;
                data = undefined;
                break;
            }
        }
        if (!check_flag && typeof data !== 'undefined' && typeof return_type !== 'undefined') {
            switch (return_type) {
                case 'array':
                    check_flag = (data instanceof Array);
                    break;
                case 'object':
                    check_flag = this.checkObject(data);
                    break;
                case 'string':
                    check_flag = (typeof data === 'string');
                    break;
            }
        }
        if (check_flag) {
            return data;
        } else {
            return undefined;
        }

    },

    /**
     * Array轉碼 (for 合庫)
     */
    modifyTransArray(obj: any): Array<any> {
        let output: Array<any>;
        if (obj instanceof Array) {
            output = obj;
        } else {
            output = [obj];
        }
        return output;
    }

};
