
import { CURRENCY_SETTING } from '@conf/currency';
import { ObjectUtil } from '@shared/util/formate/modify/object-util';
import { EmptyUtil } from '@shared/util/formate/string/empty-util';
export const FlagUtil = {

    /**
     * 國旗樣式
     * @param value
     * @param type
     */
    transIconFlag(value: string, type?: string) {
        let rc: string = '';
        // currency大物件 //
        let set_currency = CURRENCY_SETTING;
        // == type set == //
        const allow_list = ['class', 'name', 'object', 'chineseName', 'id'];
        let set_type = 'class';
        // if(type=='chinese'){
        //   set_type = allow_list[3];
        // }
        if (typeof type != 'undefined' && allow_list.indexOf(type) > -1) {
            set_type = type;
        }
        let currency = this.replaceCurrency(value);
        if (!set_currency.hasOwnProperty(currency)) {
            return rc;
        }
        if (!set_currency[currency]['enabled']) {
            return rc;
        }
        rc = (set_currency[currency].hasOwnProperty(set_type)) ? set_currency[currency][set_type] : '';
        switch (set_type) {
            case 'object':
                rc = ObjectUtil.clone(set_currency[currency]);
                break;
            case 'class':
                rc = 'icon_currency ' + rc;
                break;
        }
        return rc;
    },

    /**
     * 名稱顯示
     * @param value 幣別
     * @param set_name 指定名稱
     */
    transCurrencyName(value: string, set_name?: string) {
        let output = {
            name: '',
            type: '',
            currency: ''
        };
        let name = (typeof set_name != 'undefined') ? set_name : '';
        name = EmptyUtil.trimAll(name);
        let currency = this.replaceCurrency(value);
        output.currency = currency;
        if (!CURRENCY_SETTING.hasOwnProperty(currency) || !CURRENCY_SETTING[currency]['enabled']) {
            return output;
        }
        if (name == '') {
            output.type = 'i18n';
            output.name = CURRENCY_SETTING[currency]['name_currency'];
        } else {
            output.type = 'set';
            output.name = name;
        }
        return output;
    },

    /**
     * 特殊幣別轉換
     * @param currency 幣別代碼
     */
    replaceCurrency(currency: string) {
        let output = currency;
        if (typeof currency === 'string') {
            output = currency.toLocaleUpperCase();
        }
        let special_currency = {
            'NTD': 'TWD',
            'JPN': 'JPY'
        };
        if (special_currency.hasOwnProperty(output)) {
            output = special_currency[output];
        }
        return output;
    }

};

