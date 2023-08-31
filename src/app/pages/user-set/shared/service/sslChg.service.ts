import { Injectable } from '@angular/core';
import { StringCheckUtil } from '@shared/util/check/string-check-util';
import { NumberCheckUtil } from '@shared/util/check/number-check-util';
import { ChineseCheckUtil } from '@shared/util/check/word/chinese-check-util';
import { AuthCheckUtil } from '@shared/util/check/word/auth-check-util';
import { UserChgUtil } from '@shared/util/check/data/userchg-check-util';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { FG000601ApiService } from '@api/fg/fg000601/fg000601-api.service';
import { FG000601ReqBody } from '@api/fg/fg000601/fg000601-req';
@Injectable()
export class sslChgService {
    /**
     * 參數處理
    //  */

    constructor(
        private fg000601: FG000601ApiService
    ) { }



    /**
     * 送電文
     * @param componentobj 
     */
    sendSSLChg(componentobj): Promise<any> {
        let output = {
            info_data: {},
            msg: '',
            result: '',
            status: false
        };


        //request 身分證、使用者代碼、舊密碼、新密碼

        let reqObj = new FG000601ReqBody();
        if (typeof componentobj === 'object'
            && componentobj.hasOwnProperty('OLD_SSL') && componentobj.hasOwnProperty('NEW_SSL')
            && componentobj.hasOwnProperty('CUSTID') && componentobj.hasOwnProperty('USER_CODE')) {
            reqObj = {
                "custId": componentobj.USER_ID,
                "connId": componentobj.USER_CODE,
                "oldConnPswd": componentobj.OLD_SSL,
                "newConnPswd": componentobj.NEW_SSL
            }
        } else {
            return Promise.reject(output);
        };
        //再確認

        return this.fg000601.send(reqObj).then(
            (jsonObj) => {
                let output = jsonObj;
                if (jsonObj.hasOwnProperty('status') && jsonObj.status == true) {
                    //查詢成功
                    output.status = true;
                    output.email = jsonObj.email;
                    return Promise.resolve(output);
                } else {
                    output.status = false;
                    return Promise.reject(output);
                }
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }

        )

    }



    //===================================檢查===================================
    /**
   * 密碼變更檢查
   * @param checkObj 資訊
   */
    checkPasswordData(checkObj: Object, userObj: Object) {
        const data = {
            status: false,
            title: 'MESSAGE.ROOT.INFO',
            msg: 'CHECK.ERROR',
            error_list: {}
        };
        // == 密碼檢核 == //

        const pswdStatus = this.checkSslPwd(checkObj, userObj);
        if (!pswdStatus['status']) {
            data.error_list = pswdStatus['errorMsg'];
        }
        if (Object.keys(data.error_list).length < 1) {
            data.status = true;
            data.msg = '';
        }
        return data;
    }

    /**
     * SSL密碼檢查
     * @param str
     */
    checkSslPwd(pwdObj: object, userObj: Object) {

        /*pwdObj 參數照順序 為舊密碼 ,新密碼 ,確認密碼
         userObj 身分證，使用者代碼
        */

        let checkPwdData: object;
        checkPwdData = {
            "inputData": {
                "oldpwd": pwdObj[0],
                "newpwd": pwdObj[1],
                "checkpwd": pwdObj[2]
            },
            "userData": {
                "custId": userObj[0],
                "connId": userObj[1],
            },
            "errorMsg": {
                "oldpwd": '',
                "newpwd": '',
                "checkpwd": '',
            },
            "status": true
        };

        // 驗空值

        let key: any;
        for (key in checkPwdData["inputData"]) {
            if (!checkPwdData["inputData"].hasOwnProperty(key)) {
                continue;
            }
            let empty = ObjectCheckUtil.checkEmpty(checkPwdData["inputData"][key]);
            if (empty.status == false) {
                checkPwdData["errorMsg"][key] = 'CHECK.INPUTEMPTY';
                checkPwdData["status"] = false;
            }
        };
        //檢查中文
        let chineseCheck = ChineseCheckUtil.notChinese(checkPwdData["inputData"].newpwd);
        if (!chineseCheck.status) {
            checkPwdData["errorMsg"].newpwd = 'CHECK.ENGLISH_NUMBER';
            checkPwdData["status"] = false;
        }

        //表情符號
        let emojCheck = StringCheckUtil.emojiCheck(checkPwdData["inputData"].newpwd);
        if (!emojCheck.status) {
            checkPwdData["errorMsg"].newpwd = 'CHRCK.EMOJI_ERROR';
            checkPwdData["status"] = false;
        }

        // 檢核 舊密碼長度
        if (checkPwdData["inputData"].oldpwd.length > 16) {
            checkPwdData["errorMsg"]["oldpwd"] = '舊SSL密碼不可超過16位';
            checkPwdData["status"] = false;
        };
        // 檢核 新密碼 是否為英數字 & 檢查長度
        let isnum = AuthCheckUtil.checkSSL(checkPwdData["inputData"].newpwd);
        if (isnum["status"] == false) {
            if (checkPwdData["errorMsg"]["newpwd"] == "") {
                checkPwdData["errorMsg"]["newpwd"] = isnum.msg;
            }
            checkPwdData["status"] = false;
        };


        // 檢核 新密碼 與 舊密碼 是否相同
        let newEqualOld = UserChgUtil.newEqualOld(checkPwdData["inputData"].newpwd, checkPwdData["inputData"].oldpwd);
        if (newEqualOld["status"] == false) {

            if (checkPwdData["errorMsg"]["newpwd"] == "") {
                checkPwdData["errorMsg"]["newpwd"] = 'CHECK.SSL.SAME_USERDATA';
            }
            checkPwdData["status"] = false;
        };

     
        // 參數設定(新代號,連續數區分大小寫=1(不區分)),連續數限制長度)	

        let sequenceChar = AuthCheckUtil.sequenceChar(checkPwdData["inputData"].newpwd, 1, 8);

        if (sequenceChar["status"] == false) {
            if (checkPwdData["errorMsg"]["newpwd"] == "") {
                checkPwdData["errorMsg"]["newpwd"] = '密碼不可為連續或相同數8位';
            }
            checkPwdData["status"] = false;
        }
         // 檢核 新密碼 與 身分證 是否相同
         let sameCust = UserChgUtil.newEqualOld(checkPwdData["inputData"].newpwd, checkPwdData["userData"].custId);
         if (sameCust["status"] == false) {
 
             if (checkPwdData["errorMsg"]["newpwd"] == "") {
                 checkPwdData["errorMsg"]["newpwd"] = 'CHECK.SSL.SAME_USERDATA';
             }
             checkPwdData["status"] = false;
         };
         // 檢核 新密碼 與 使用者代碼 是否相同
         let sameConnId = UserChgUtil.newEqualOld(checkPwdData["inputData"].newpwd, checkPwdData["userData"].connId);
         if (sameConnId["status"] == false) {
 
             if (checkPwdData["errorMsg"]["newpwd"] == "") {
                 checkPwdData["errorMsg"]["newpwd"] = 'CHECK.SSL.SAME_USERDATA';
             }
             checkPwdData["status"] = false;
         };
            // 檢核 確認新密碼 與 新密碼 是否一致
        let newNotEqualOld = UserChgUtil.newNotEqualOld(checkPwdData["inputData"].newpwd, checkPwdData["inputData"].checkpwd);
        if (newNotEqualOld["status"] == false) {

            if (checkPwdData["errorMsg"]["checkpwd"] == "") {
                checkPwdData["errorMsg"]["checkpwd"] = 'CHECK.SSL.NOTSAME';
            }
            checkPwdData["status"] = false;
        };
        return checkPwdData;
    }
}









