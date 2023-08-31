/**
 * Util Auth Check
 * 安控與密碼等檢核
 */
import { CommonUtil } from '@shared/util/common-util';
import { StringCheckUtil } from '@shared/util/check/string-check-util';
import { EmptyUtil } from '@shared/util/formate/string/empty-util';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';

export const AuthCheckUtil = {

    /**
     * 檢核新密碼是否為相同字元
     */
    samechar(val: string | number, return_flag?: boolean) {
        let data = {
            status: false,
            msg: 'Error samechar'
        };
        if (val === null) {
            return CommonUtil.modifyReturn(data, return_flag);
        }
        let str = val.toString();
        let temp = str.charAt(0);
        let i = 0;
        for (i = 0; i < str.length; i++) {
            let ch = str.charAt(i);
            if (temp !== ch) {
                data.status = true;
                data.msg = '';
                return data;
            }
        }
        return CommonUtil.modifyReturn(data, return_flag);
    },

    /**
     * 檢核 新密碼 是否為連續字元
     * @param val
     */
    sequencechar(val: string | number, return_flag?: boolean) {
        let data = {
            status: false,
            msg: 'CHECK.PSWD.ERROR'
        };
        if (val === null) {
            return CommonUtil.modifyReturn(data, return_flag);
        }
        let flag1 = 0;
        let flag2 = 0;
        let flag3 = 0;
        let str = val.toString();
        let i: any;
        if (str.length === 1) {
            return CommonUtil.modifyReturn(data, return_flag);
        }
        // let temp = str.charCodeAt(0);
        i = 1;
        for (i = 1; i < str.length; i++) {
            let ch = str.charCodeAt(i);
            let temp = str.charCodeAt(i - 1);
            if (ch - temp === 1) {
                // console.error('ch_flag1', ch)
                // console.error('temp_flag1', temp)
                flag1++;
                if (flag1 >= 3) {
                    // data.status = true;
                    // data.msg='';
                    // break;
                    return data;
                }
            } else {
                flag1 = 0;
            }
        }
        i = 1;
        for (i = 1; i < str.length; i++) {
            let ch = str.charCodeAt(i);
            let temp = str.charCodeAt(i - 1);
            if (temp - ch === 1) {
                // console.error('ch_flag2', ch)
                // console.error('temp_flag2', temp)
                flag2++;
                if (flag2 >= 3) {
                    // data.status = true;
                    // data.msg='';
                    // break;
                    return CommonUtil.modifyReturn(data, return_flag);
                }
            } else {
                flag2 = 0;
            }
        }
        i = 1;
        for (i = 1; i < str.length; i++) {
            let ch = str.charCodeAt(i);
            let temp = str.charCodeAt(i - 1);
            if (temp - ch === 0) {
                // console.error('ch_flag3', ch)
                // console.error('temp_flag3', temp)
                flag3++;
                if (flag3 >= 3) {
                    // data.status = true;
                    // data.msg='';
                    // break;
                    return data;
                }
            } else {
                flag3 = 0;
            }
        }
        data.status = true;
        data.msg = '';
        return CommonUtil.modifyReturn(data, return_flag);
    },


    // 修改要不區分大小寫(密碼需區分，代號不區分) 跟設定連續字元長度
    // type為檢核代號
    sequenceChar(val: string, upcase: number, sequenceNum: number,type?) {
        let data = {
            status: false,
            msg: (type!='netCode')?'CHECK.PSWD.CONTINUE':'CHECK.CONNID.CONTINUE'
        };
        let thelastpos = (sequenceNum - 1);
        let limttimes = (sequenceNum - 1);
        let str = val.toString();
        if (upcase == 1) { // 不區分大小寫判斷連序數 ==1 就不區分
            str = str.toUpperCase(); // 轉全大寫
        }
        let MaxCountLen = (str.length - thelastpos); // 計算到哪一位

        for (let i = 0; i < MaxCountLen; i++) {
            let startnum = 0;
            let sqtimes1 = 0;
            let sqtimes2 = 0;
            let sqtimes3 = 0;   // 判斷相同的數字
            while (startnum < sequenceNum && sqtimes1 !== limttimes && sqtimes2 != limttimes && sqtimes3 != limttimes) {

                let S1 = str.charCodeAt(i + startnum);
                let S2 = str.charCodeAt(i + startnum + 1);


                if (S2 - S1 == 1) { // 遞增連續
                    sqtimes1++;
                } else if (S2 - S1 == -1) { // 遞減連續
                    sqtimes2++;
                } else if ((S2 - S1) > 1 || ((S2 - S1) < -1) || ((S2 - S1) == 0)) { // 中間有不連續，重新計算連續
                    sqtimes1 = 0;
                    sqtimes2 = 0;
                }

                if (S2 - S1 == 0) {   // 相同
                    sqtimes3++;
                } else if (S2 - S1 != 0) {
                    sqtimes3 = 0;
                }

                startnum++;
            }
            console.error('sequenceChar',sqtimes1,sqtimes2,sqtimes3,limttimes,val.length)
            if (sqtimes1 == limttimes || sqtimes2 == limttimes) {
                data.status = false;
                return data;
            } else if (sqtimes3 == sequenceNum-1) {
                data.status = false;
                data.msg = (type!='netCode')?'CHECK.PSWD.SAMEALL':'CHECK.CONNID.SAMEALL';
                return data;
            }
        }
        data.status = true;
        data.msg = '';
        return data;
    },

    /**
   * 是否為英數字混和且8 ~12碼 (密碼專用)
   * 英文至少兩碼
   * 檢查是否為全數字，英文(全英文暫時關閉，不確定密碼是否限制英數混和)
     * @param strict true為嚴謹模式 (為避免使用者密碼無法核可狀態)
   */
    checkPswd(val, strict?: boolean) {
        const data = {
            status: false,
            msg: 'CHECK.PSWD.ERROR'
        };

        if (typeof val === 'undefined' || val == null || val == '') {
            return data;
        }

        let countNum = 0; // 計算數字多少個
        let str = val.toString();

        if (str.length < 8 || str.length > 12) {
            data.msg = 'CHECK.PSWD.ERRORLEN';
            return data;
        }
        let i = 0;
        let tmp_flag = true;
        for (i = 0; i < str.length; i++) {

            let ch = str.charCodeAt(i);
            if (ch > 47 && ch < 58) {
                // 數值++ 0-9
                countNum++;
            }
            // 
            if (strict == true && ch >= 21 && ch <= 126) {
                tmp_flag = false;
                break;
            }
        }

        if (!tmp_flag) {
            data.msg = 'CHECK.PSWD.LOGINGCHECK'; // 密碼請輸入英數或符號
            return data;
        }
        if (countNum == str.length) {                   // 全數值
            data.msg = 'CHECK.PSWD.TWOENG';
            return data;
        }
        // if(countNum == 0){
        //     data.msg = 'CHECK.PSWD.SAMEALL';            //全英文
        //     return data;
        // }
        // 至少需包含兩個英文
        let eng_count=0;
        for (let i = 0; i < val.length; ++i) {
            if (/^[a-zA-Z]+$/.test(val.charAt(i))) {
                eng_count++;
            }
        }
        if (eng_count < 2) {
            data.msg = 'CHECK.PSWD.TWOENG';
            return data;
        }
        data.status = true;
        data.msg = '';
        return data;
    },

    /**
     * 密碼檢核(非登入使用)
     * @param strict true為嚴謹模式 (為避免使用者密碼無法核可狀態)
     * 1. 檢查不為空(trim後)
     * 2. 檢查長度不超過12
     * [嚴謹] 3. 英數符號
     *  https://www.obliquity.com/computer/html/unicode0000.html
     */
    checkOldPswd(str: string, strict?: boolean) {
        const data = {
            status: false,
            msg: 'CHECK.PSWD.ERROR', // 請輸入正確密碼格式
            data: str
        };
        str = EmptyUtil.trim(str);
        if (!ObjectCheckUtil.checkEmpty(str, true)) {
            return data;
        }
        data.data = str;
        if (str.length > 12) {
            data.msg = 'CHECK.PSWD.MAXLEN'; // 使用者密碼長度最多為12位
            return data;
        }
        if (strict == true) {
            let tmp_flag = true;
            for (let i = 0; i < str.length; i++) {
                const check_str = str.charCodeAt(i);
                if (!(check_str >= 21 && check_str <= 126)) {
                    tmp_flag = false;
                    break;
                }
            }
            if (!tmp_flag) {
                data.msg = 'CHECK.PSWD.LOGINGCHECK'; // 密碼請輸入英數或符號
                return data;
            }
            // 避免密碼過於老舊無法輸入 先mark起來
            // if(str.length<8){
            //     data.msg='密碼限制8-12碼，請修改密碼。';
            //     data.status = false;
            // }
        }

        data.status = true;
        data.msg = '';
        return data;
    },


    /**
     *  是否為英數字混和且6 ~16碼 (代號專用)
     */
    checkNetCode(val) {
        const data = {
            status: false,
            msg: 'CHECK.CONNID.ERROR'
        };
        if (typeof val === 'undefined' || val == null || val == '') {
            data.status = false;
            return data;
        }
        let str = val.toString();
        if (str.length < 6 || str.length > 16) {
            data.msg = 'CHECK.CONNID.ERRORLEN'
            return data;
        }
        data.status = true;
        data.msg = '';
        return data;
    },


    /**
    *  是否為英數字混和且8 ~16碼 (SSL專用)
    */
    checkSSL(val) {
        const data = {
            status: false,
            msg: 'CHECK.SSLWOED'
        };

        if (typeof val === 'undefined' || val == null || val == '') {
            return data;
        }

        let oneDecimal = false;
        let countNum = 0; // 計算數字多少個
        let str = val.toString();

        if (str.length < 8 || str.length > 16) {
            return data;
        }
        let allowAry = [34, 35, 36, 37, 39, 42, 44, 94, 96];
        let i = 0;
        for (i = 0; i < str.length; i++) {

            let ch = str.charCodeAt(i);
            if (ch > 47 && ch < 58) {
                // 數值++ 0-9
                countNum++;
            }
            // if (allowAry.indexOf(ch) > 0) {
            //     data.msg = 'CHECK.SSLWOED';
            //     return data;
            // }
        }

      
        // 至少需包含兩個英文
        let eng_count=0;
        for (let i = 0; i < val.length; ++i) {
            if (/^[a-zA-Z]+$/.test(val.charAt(i))) {
                eng_count++;
            }
        }
        if (eng_count < 2) {
            data.msg = 'CHECK.SSL.NOENGLISH';
            return data;
        }
        // if (countNum == str.length || countNum == 0) { // 全數值或全英文
        //     data.msg = 'CHECK.SSLWOED';
        //     return data;
        // }

        data.status = true;
        data.msg = '';
        return data;
    }
};
