/**
 * 存摺相關處理
 */
import { DepositTypeSet } from '@conf/deposit_type';
import { FieldUtil } from '@shared/util/formate/modify/field-util';
import { ReplaceUtil } from '@shared/util/formate/string/replace-util';
import { PadUtil } from '@shared/util/formate/string/pad-util';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
export const DepositUtil = {

    /**
     * 顯示[定存到期日]或[最後交易日]
      * transLastTransType('CK', 'TW')
     */
    transLastTransType(values: string, depositType?: string): string {
        let output = 'PG_DEPOSIT.FIELD.dateNameField';
        if (typeof depositType === 'undefined') {
            depositType = 'ALL';
        }
        if (DepositTypeSet.hasOwnProperty(depositType)
            && (DepositTypeSet[depositType]['lastTrnsDate']['expirationDate'] instanceof Array)
        ) {
            if (DepositTypeSet[depositType]['lastTrnsDate']['expirationDate'].indexOf(values) > -1) {
                // 定存到期日
                output = 'PG_DEPOSIT.FIELD.expirationDate';
            } else {
                // 最後交易日
                output = 'PG_DEPOSIT.FIELD.lastTrnsDate';
            }
        }
        return output;
    },
    /**
     * 顯示[去除回應電文中合庫字樣的分行名稱]
     */
    transbranchName(values: string, args?: boolean|Object): string {
        let output = values;
        let replace_flag = true;
        if (typeof args !== 'undefined') {
            if (typeof args === 'object' && !!args) {
                if (ObjectCheckUtil.checkObjectList(args, 'replace') && args['replace'] === false) {
                    replace_flag = false;
                }
            } else if (args === false) {
                replace_flag = false;
            }
        }
        if (!!values && values != '') {
            output = values;
            if (replace_flag) {
                output = values.replace('合庫', '');
            }
        }
        // 「營業部」特殊處理 => 中台提供為「合庫營」
        if (output === '營' || output === '合庫營') {
            output = '營業部';
        }

        return output;
    },

    /**
     * 顯示nick name
     * @param values
     * @param args
     * acctTypeNickName('CK', 'TW')
     * acctTypeNickName('CK', ['TW', '支存'])
     */
    acctTypeNickName(values: string, args?: string | Array<string>): string {
        let depositType = 'ALL';
        let old_name = values;
        if (args instanceof Array) {
            depositType = (typeof args[0] !== 'undefined') ? args[0] : '';
            old_name = (typeof args[1] !== 'undefined') ? args[1] : '';
        } else if (typeof args === 'string') {
            depositType = args;
        }

        let output = old_name;
        if (DepositTypeSet.hasOwnProperty(depositType)) {
            let nick_name = FieldUtil.checkField(DepositTypeSet[depositType]['TYPE'], values);
            if (nick_name !== '') {
                output = nick_name;
            }
        }
        // console.error(old_name, depositType, values, output);

        return output;
    },

    /**
     * 查詢帳號別名稱
     * @param account 帳號(13位)
     * @param acctType 提供帳號別代碼
     */
    getAcctTypeName(account: string, acctType?: string, acctGroup?: string): string {
        let searchType = (typeof acctType !== 'undefined') ? acctType : '';
        let data_obj = DepositTypeSet['ALL'];
        if (typeof acctGroup !== 'undefined' && DepositTypeSet.hasOwnProperty(acctGroup)) {
            data_obj = DepositTypeSet[acctGroup];
        }
        let output = FieldUtil.checkField(data_obj['TYPE'], searchType);
        if (searchType === 'GD' || searchType === '') {
            let check_str = PadUtil.pad(ReplaceUtil.baseSymbol(account), 13, 'left');
            let check_type = check_str.substr(4, 3);
            let output_other = FieldUtil.checkField(data_obj['accountType'], check_type);
            if (output_other !== '') {
                output = output_other;
            }
        }

        return output;
    },

    /**
     * 查詢利率別名稱
     * @param rateType 利率別
     */
    getRateTypeName(rateType: string | number): string {
        let output = '';
        let type_list = {
            '0': 'PG_DEPOSIT.TIME_DEPOSIT.rateTypeNameList.type0',
            '1': 'PG_DEPOSIT.TIME_DEPOSIT.rateTypeNameList.type1'
        };
        let check_str = rateType.toString();
        if (type_list.hasOwnProperty(check_str)) {
            output = type_list[check_str];
        }
        return output;
    }


};

