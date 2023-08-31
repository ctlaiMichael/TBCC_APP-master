import { EmptyUtil } from "@shared/util/formate/string/empty-util";
import { StringCheckUtil } from "../string-check-util";

/**
 * Util User Check
 * 使用者資訊檢查處理
 */
export const UserCheckUtil = {

    /**
	 * [checkIdentity 身份證字號檢查]
	 * @param  {string} identity [身分證字號檢查]
	 * @return {obj}	{status:blooean,msg:'error msg'}
	 */
    checkIdentity(identity: string) {
        let data = {
            status: false,
            msg: 'CHECK.IDENTITY',
            data: ''
        };
        if (typeof identity !== 'string') {
            return data;
        }
        identity = identity.toString();
        const res = /^[A-Z]{1}[12]{1}\d{8}$/;
        identity = identity.toUpperCase();
        if (!res.test(identity)) {
            return data;
        }
        const first_str = identity.charAt(0);
        // tslint:disable-next-line:max-line-length
        const first_list = { A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, G: 16, H: 17, I: 34, J: 18, K: 19, L: 20, M: 21, N: 22, O: 35, P: 23, Q: 24, R: 25, S: 26, T: 27, U: 28, V: 29, W: 32, X: 30, Y: 31, Z: 33 };
        let firstnum = first_list[first_str];
        let num = Math.floor(firstnum / 10) + firstnum % 10 * 9;
        const string_list = identity.substring(1, identity.length).split('');
        let i = 8;
        string_list.forEach((tmp_str) => {
            num += parseInt(tmp_str) * i;
            i--;
        });
        const check_num = parseInt(identity.charAt(9));
        const check_code = 10 - (num % 10);
        if (check_num === check_code % 10) {
            data.status = true;
            data.msg = '';
            data.data = identity;
            return data;
        }
        return data;
    },

    /**
     * email檢查
     * @param str email
     */
    checkEmail(str: string) {
        const data = {
            status: false,
            msg: 'CHECK.EMAIL',
            data: str
        };
        const res = /^[a-zA-Z0-9\._-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (res.test(str)) {
            data.status = true;
            data.msg = '';
            return data;
        }
        return data;
    },
    /**
     * [checkMobile 手機檢查]
     * @param  {string} str [手機]
     * @return {obj}	{status:blooean,msg:'error msg'}
     */
    checkMobile(str: string, onlynumber?: boolean) {
        let data = {
            status: false,
            msg: 'CHECK.MOBILE',
            data: ''
        };
        if (typeof str !== 'string') {
            return data;
        }
        let res = /^09\d{8}$/;
        if (onlynumber === true) {
            res = /^\d{10}$/; // 僅檢查10碼純數值
        }
        if (res.test(str)) {
            data.status = true;
            data.msg = '';
            return data;
        }
        data.data = str;
        return data;
    },

   /**
     * 最基本電話檢核
     * @param str 字串
     */
    checkTel(numberStr) {
        let data = {
            status: false,
            msg: 'CHECK.PHONE.CUSTOM01' // '電話格式錯誤，例:0911111111,0229111111,+886911111111'
        };

        let reg = /--/g;
        if (reg.test(numberStr)) {
            data.msg = 'CHECK.PHONE.CUSTOM02' // "請勿輸入兩個連續符號";
            return data;
        } else {
            numberStr = numberStr.replace(new RegExp('-', 'g'), '');
        }

        let parentheses = /\(\(/g;
        if (parentheses.test(numberStr)) {
            data.msg = 'CHECK.PHONE.CUSTOM02'; // "請勿輸入兩個連續符號";
            return data;
        } else {
            if (/\)\)/.test(numberStr)) {
                data.msg = 'CHECK.PHONE.CUSTOM02'; // "請勿輸入兩個連續符號";
                return data;
            } else if (numberStr.indexOf('(') !== -1 || numberStr.indexOf(')') !== -1) {
                let check = /(\([0-9]{1,})\)/;
                if (!check.test(numberStr)) {
                    data.msg = 'CHECK.PHONE.CUSTOM03'; // "括弧中間請包含數字";
                    return data;
                }
                numberStr = numberStr.replace('(', '');
                numberStr = numberStr.replace(')', '');
            }
        }

        // console.error(numberStr)

        // 判斷是否有國碼
        if (numberStr[0] == '+') {
            data.msg = 'CHECK.PHONE.CUSTOM04'; // "國家號碼輸入錯誤，分機請使用ext. _ #，例:+886912345678";
            // 國外號碼判斷，只驗國碼是否小於４碼，以及連續數字及長度是否在9-12之間
            numberStr = numberStr.replace('+', '');
            // numberStr = numberStr.replace(/\r|\n|\s|\t/g, '');
            // 國碼已知最長是４碼
            // let countryCode = 　numberStr.split('-')[0];
            // if (countryCode.length <= 4) {
            //     numberStr = numberStr.replace(new RegExp('-', 'g'), '');
            //     let phoneNo = numberStr.replace(countryCode, '');
            //     data.status = /^\d{9,15}$/.test(phoneNo);
            // }
            let key: string;
            if (numberStr.indexOf('#') !== -1) {
                key = '#';
            } else if (numberStr.indexOf('_') !== -1) {
                key = '_';
            } else if (numberStr.indexOf(' ext.') !== -1) {
                key = ' ext.';
            } else if (numberStr.indexOf('ext.') !== -1) {
                key = 'ext.';
            }


            if (numberStr.split(key).length == 2) {
                let phone_No = numberStr.split(key)[0];
                let extension = numberStr.split(key)[1];
                if ((/^\d{1,10}$/.test(extension))) {
                    data.status = /^\d{9,15}$/.test(phone_No);
                    if (!data.status) {
                        data.msg = 'CHECK.PHONE.CUSTOM05'; // "國家號碼輸入錯誤，例:+886912345678#123";
                    }
                    return data;
                } else {
                    data.msg = 'CHECK.PHONE.CUSTOM06'; // "分機號碼錯誤";
                    return data; // 分機號碼錯誤
                }

            } else {
                let phoneNo = numberStr.replace(new RegExp('g'), '');
                data.status = /^\d{9,15}$/.test(phoneNo);
                if (data.status) {
                    data.msg = '';
                }
                return data;
            }
        } else {
            // 國內號碼判斷
            numberStr = numberStr.replace(new RegExp('g'), '');
            numberStr = numberStr.replace(/\r|\n|\s|\t/g, '');
            let typeNo = numberStr.substring(0, 2); // 09:手機　0x:市話
            // 手機
            if (typeNo == '09') {
                data.status = /^[09]{2}\d{8}$/.test(numberStr);
                if (!data.status) {
                    data.msg = 'CHECK.PHONE.CUSTOM07'; // "手機號碼輸入錯誤，例:0912345678"
                }
                return data;
            } else {
                // 市話
                // 判斷是否有分機
                let key: string;
                if (numberStr.indexOf('#') !== -1) {
                    key = '#';
                } else if (numberStr.indexOf('_') !== -1) {
                    key = '_';
                } else if (numberStr.indexOf('ext.') !== -1) {
                    key = 'ext.';
                }
                if (numberStr.split(key).length == 2) {
                    let phone_No = numberStr.split(key)[0];
                    let extension = numberStr.split(key)[1];
                    if ((/^\d{1,10}$/.test(extension))) {
                        // 市話有8碼或9碼
                        data.status = (/^[0]{1}\d{8}$/.test(phone_No) || /^[0]{1}\d{9}$/.test(phone_No));
                        if (!data.status) {
                            data.msg = 'CHECK.PHONE.CUSTOM08'; // "電話號碼輸入錯誤，分機請使用ext. _ #，例:0229912345#323";
                        }
                        return data;
                    } else {
                        data.msg = 'CHECK.PHONE.CUSTOM06'; // "分機號碼錯誤";
                        return data;
                    }

                } else {
                    data.status = (/^[0]{1}\d{8}$/.test(numberStr) || /^[0]{1}\d{9}$/.test(numberStr));
                    if (!data.status) {
                        data.msg = 'CHECK.PHONE.CUSTOM09'; // "電話號碼輸入錯誤，分機請使用ext. _ #，例:0229912345";
                    }
                    return data;
                }
            }
        }
    },


    /**
	 * [checkBusinessNo 統一編號檢查]
	 * @param  {string} idNo [身分證字號檢查]
     * 8-10英數字
	 * @return {obj}	{status:blooean,msg:'error msg'}
	 */
    checkBusinessNo(idNo: string) {
        let data = {
            status: false,
            msg: '請輸入8至10位英數字',
            data: idNo
        };
        if (typeof idNo !== 'string') {
            return data;
        }
        idNo = idNo.toString();
        // 英數字檢核
        if (StringCheckUtil.checkEnglish(idNo, 'english_number', true)) {
            // 最小8
            let check_min = StringCheckUtil.checkLength(idNo, 8, 'min');
            // 最大10
            let check_max = StringCheckUtil.checkLength(idNo, 10, 'max');
            if (check_min.status && check_max.status) {
                data.status = true;
                data.msg = '';
            }
        }

        return data;
    }

};
