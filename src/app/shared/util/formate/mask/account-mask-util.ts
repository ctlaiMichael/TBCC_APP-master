/**
 * Util Account Mask
 * 帳號遮碼
 */
import { PadUtil } from '../string/pad-util';
import { ReplaceUtil } from '../string/replace-util';
export const AccountMaskUtil = {

    /**
     * 帳戶遮碼(自行)
     * dddd-ddd-dddddd
     * 超過13
     * dddd-ddd-dddddddddddd
     */
    accountNoFormate(str: string|number): string {
        if (typeof str === 'number') {
            str = str.toString();
        }
        if (typeof str !== 'string') {
            return str;
        }
        str = ReplaceUtil.baseSymbol(str, '');
        // 去除前面的0
        str = ReplaceUtil.replaceLeftStr(str, '0', '');
        if (str === '') {
            return '';
        }

        if (str.length < 13) {
            str = PadUtil.padLeft(str, 13); // 左補0
        }
        return str.substr(0, 4) + '-' + str.substr(4, 3) + '-' + str.substr(7);
    },
    /**
     * 帳戶(所有帳號)
     * dddddddddddddddd
     */
    accountAllNoFormate(str: string|number): string {
        if (typeof str === 'number') {
            str = str.toString();
        }
        if (typeof str !== 'string') {
            return str;
        }
        str = ReplaceUtil.baseSymbol(str, '');
        if (str === '') {
            return '';
        }

        if (str.length < 16) {
            str = PadUtil.padLeft(str, 16); // 左補0
        }
        return str;
    },
    /**
     * 帳號遮碼
     *  0560-***-***456
     *  dddd-***-***ddd
     * 超過13
     *  dddd-***-***ddddddddd
     */
    account(str: string|number): string {
        if (typeof str === 'number') {
            str = str.toString();
        }
        if (typeof str !== 'string') {
            return str;
        }
        str = ReplaceUtil.baseSymbol(str, '');
        // 去除前面的0
        str = ReplaceUtil.replaceLeftStr(str, '0', '');
        if (str === '') {
            return '';
        }

        if (str.length < 13) {
            str = PadUtil.padLeft(str, 13); // 左補0
        }
        return str.substr(0, 4) + '-***-***' + str.substr(10);
    },

    account1(str: string|number): string {
        if (typeof str === 'number') {
            str = str.toString();
        }
        if (typeof str !== 'string') {
            return str;
        }
        str = ReplaceUtil.baseSymbol(str, '');
        // 去除前面的0
        str = ReplaceUtil.replaceLeftStr(str, '0', '');
        if (str === '') {
            return '';
        }

        if (str.length < 13) {
            str = PadUtil.padLeft(str, 13); // 左補0
        }
        // return str.substr(0, 4) + '-***-***' + str.substr(10);
        return str.substr(0, 6) + '-***-***' + str.substr(12);
    },


    /**
     * 信用卡遮碼
     * (規則待確認)
     */
    card(str: string|number): string {
        if (typeof str === 'number') {
            str = str.toString();
        }
        if (typeof str !== 'string') {
            return str;
        }
        str = ReplaceUtil.baseSymbol(str, '');
        if (str === '') {
            return '';
        }
        if (str.length < 16) {
            // 基本上長度固定為16碼
            str = PadUtil.padLeft(str, 16); // 左補0
        }
        return '****-****-**' + str.substr(-6, 2) + '-' + str.substr(-4, 4);
    },
    
    // 信用卡7-12 隱碼 123456******7890
    card1(str: string|number): string {
        if (typeof str === 'number') {
            str = str.toString();
        }
        if (typeof str !== 'string') {
            return str;
        }
        str = ReplaceUtil.baseSymbol(str, '');
        if (str === '') {
            return '';
        }
        if (str.length < 16) {
            // 基本上長度固定為16碼
            str = PadUtil.padLeft(str, 16); // 左補0
        }
        // return '****-****-**' + str.substr(-6, 2) + '-' + str.substr(-4, 4);
        return  + str.substr(0 , 6) + '******' + str.substr(-4, 4);
    },

    /**
     * epay emv信用卡遮碼專用
     */
    emvCard(str: string|number): string {
        if (typeof str === 'number') {
            str = str.toString();
        }
        if (typeof str !== 'string') {
            return str;
        }
        str = ReplaceUtil.baseSymbol(str, '');
        if (str === '') {
            return '';
        }
        if (str.length < 16) {
            // 基本上長度固定為16碼
            str = PadUtil.padLeft(str, 16); // 左補0
        }
        return '*' + str.substr(-6, 2) + str.substr(-4, 4);
    },
    /**
     * 水號遮碼(自行,10碼)
     *  X-01-234567-8
     * @param str 
     */
    waterNumberFormate(str: string|number): string {
        if (typeof str === 'number') {
            str = str.toString();
        }
        if (typeof str !== 'string') {
            return str;
        }
        return str.substring(0,1) + '-' + str.substring(1, 3) + '-' + str.substring(3,9)+'-'+str.substring(9);
    },

    /**
     * 取轉出帳號末五碼
     * @param str 
     */
    socailSharingAccntFormat(str: string|number): string {
        if (typeof str === 'number') {
            str = str.toString();
        }
        if (typeof str !== 'string') {
            return str;
        }
        str = ReplaceUtil.baseSymbol(str, '');
        // 取該轉出帳號末五碼
        return str.substring(8,str.length);   
    }
};
