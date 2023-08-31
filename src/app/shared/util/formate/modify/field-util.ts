/**
 * Util 欄位檢核
 */
import { CommonUtil } from '@shared/util/common-util';
import { EmptyUtil } from '../string/empty-util';
import { DateUtil } from '../date/date-util';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
export const FieldUtil = {

    /**
     * 檢查欄位
     * @param data 資料
     * @param field 檢查欄位，若資料
     * @param other_set 其他設定
     *      zero_type: true 允許0 (預設), false 不允許0
     *      empty_str: 預設空值
     *      trim_flag: 是否清空左右空白
     */
    checkField(data: any, field: string | number, other_set?: object): string {
        // other_set
        let zero_type = false; // 不可為0
        let empty_str = '';
        let trim_flag = false;
        let to_string = false;
        if (typeof other_set === 'object') {
            // 0值判斷: true 允許, false 不允許
            zero_type = (other_set.hasOwnProperty('zero_type') && other_set['zero_type']) ? true : false;
            empty_str = (other_set.hasOwnProperty('empty_str')) ? other_set['empty_str'] : '';
            trim_flag = (other_set.hasOwnProperty('trim_flag') && other_set['trim_flag']) ? true : false;
            to_string = (other_set.hasOwnProperty('to_string') && other_set['to_string']) ? true : false;
        }
        let output: any = empty_str;
        let check_empty = ObjectCheckUtil.checkEmpty(data, true, zero_type);
        if (!check_empty) {
            return output; // 空資料回傳
        } else if (typeof data === 'object') {
            if (CommonUtil.checkFieldExist(data, field)) {
                // 假設中台回傳之資料==null ，回傳空
                if (data[field] == null) {
                    output = empty_str;
                } else {
                    output = data[field];
                }
            }
            check_empty = ObjectCheckUtil.checkEmpty(output, true, zero_type);
            if (!check_empty) {
                return empty_str;
            }
        } else if (typeof data === 'string' || typeof data === 'number') {
            output = data.toString();
        }
        if (to_string) {
            if (typeof output != 'string' && typeof output != 'number') {
                output = '';
            }
            output = output.toString();
        }
        if (trim_flag && typeof output == 'string') {
            output = EmptyUtil.trim(output);
        }
        return output;
    }

    /**
     * 尋找資料
     */
    , findKey(str: string|Array<string>, key: string, range?: Array<number>) {
        let output = false;
        let check_index = str.indexOf(key);
        if (check_index != -1) {
            output = true;
            if (!!range && typeof range[0] !== 'undefined' && typeof range[1] !== 'undefined') {
                output = false;
                let check_str: any = str;
                if ((str instanceof Array) && typeof str[check_index] !== 'undefined') {
                    check_str = str[check_index];
                }
                if (typeof check_str == 'string' && check_str.substr(range[0], range[1]) === key) {
                    output = true;
                }
            }
        }
        return output;
    }

};
