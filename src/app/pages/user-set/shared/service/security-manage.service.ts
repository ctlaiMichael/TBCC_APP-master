import { Injectable } from '@angular/core';
import { StringCheckUtil } from '@shared/util/check/string-check-util';
import { NumberCheckUtil } from '@shared/util/check/number-check-util';
import { ChineseCheckUtil } from '@shared/util/check/word/chinese-check-util';
import { AuthCheckUtil } from '@shared/util/check/word/auth-check-util';
import { UserChgUtil } from '@shared/util/check/data/userchg-check-util';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { FG000101ApiService } from '@api/fg/fg000101/fg000101-api.service';
import { FG000101ReqBody } from '@api/fg/fg000101/fg000101-req';
import { FG000201ApiService } from '@api/fg/fg000201/fg000201-api.service';
import { FG000201ReqBody } from '@api/fg/fg000201/fg000201-req';
import { F4000101ApiService } from '@api/f4/f4000101/f4000101-api.service';
import { F4000101ReqBody } from '@api/f4/f4000101/f4000101-req';
import { AuthService } from '@core/auth/auth.service';
// import { LangTransService } from 'app/shared/pipe/langTransPipe/lang-trans.service';
/**
 * 使用者代號、密碼變更檢核、電文
 */
@Injectable()
export class securityManageService {

    constructor(private fg000101: FG000101ApiService,
        private fg000201: FG000201ApiService,
        private f4000101: F4000101ApiService
        ,public authService: AuthService
    ) { }




    /**
     * 使用者代號變更送電文
     */
    sendNetCodeChg(componentobj): Promise<any> {
        let output = {
            info_data: {},
            msg: '',
            result: '',
            status: false
        };

        
        let reqObj = new FG000201ReqBody();

        //request 身分證、使用者代碼、舊密碼、新密碼
        if (typeof componentobj === 'object'
            && componentobj.hasOwnProperty('OLD_CODE') && componentobj.hasOwnProperty('NEW_CODE')
            && componentobj.hasOwnProperty('USER_PSWD') && componentobj.hasOwnProperty('USER_NOID')) {
            reqObj = {
                "custId": componentobj.USER_NOID,
                "password": componentobj.USER_PSWD,
                "oldConnId": componentobj.OLD_CODE,
                "newConnId": componentobj.NEW_CODE
            }
        } else {
            return Promise.reject(output);
        };


        //再確認
        if (reqObj['custId'] == '' || reqObj['password'] == '' ||
            reqObj['oldConnId'] == '' || reqObj['newConnId'] == '') {
            output.msg = '格式不符';
            return Promise.reject(output);
        }
        return this.fg000201.send(reqObj).then(
            (jsonObj) => {
                let output = jsonObj;
                if (jsonObj.hasOwnProperty('status') && jsonObj.status == true) {
                    //更改成功
                    output.result = jsonObj.result;
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




    /**
     * 使用者密碼變更送電文
     */
    sendPswdChg(componentobj): Promise<any> {
        let output = {
            info_data: {},
            msg: '',
            result: '',
            status: false
        };

        

        //request 身分證、使用者代碼、舊密碼、新密碼
        let reqObj = new FG000101ReqBody();
        if (typeof componentobj === 'object'
            && componentobj.hasOwnProperty('OLD_PSWD') && componentobj.hasOwnProperty('NEW_PSWD')
            && componentobj.hasOwnProperty('USER_ID') && componentobj.hasOwnProperty('USER_CODE')) {
            reqObj = {
                "custId": componentobj.USER_ID,
                "connId": componentobj.USER_CODE,
                "oldConnPswd": componentobj.OLD_PSWD,
                "newConnPswd": componentobj.NEW_PSWD
            }
        } else {
            return Promise.reject(output);
        };

        //再確認
        if (reqObj['custId'] == '' || reqObj['connId'] == '' ||
            reqObj['oldConnPswd'] == '' || reqObj['newConnPswd'] == '') {
            output.msg = '格式不符';
            return Promise.reject(output);
        }
        return this.fg000101.send(reqObj).then(
            (jsonObj) => {
                let output = jsonObj;
                if (jsonObj.hasOwnProperty('status') && jsonObj.status == true) {
                    // 更改成功
                    output.result = jsonObj.result;
                    // 更新local session 密碼狀態
                    this.authService.updateInfo({ warnMsg: null });
                    return Promise.resolve(jsonObj);
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





	/**
	 *  發電文
	 *  F4000101-台幣活存約定轉出及轉入帳號查詢
	 */
    public getAccount(): Promise<any> {
        let req_data = new F4000101ReqBody();
        return this.f4000101.send(req_data).then(
            (res) => {
                return Promise.resolve(res);
            },
            (errorMsg) => {
                return Promise.reject(errorMsg);
            });
    }


    //===================================檢查============================================
    /**
       * 密碼變更檢查
       */
    public checkPasswordChg(checkObj: Object, systemObj: Object) {
        const data = {
            status: false,
            msg: 'CHECK.ERROR',
            error_list: {}
        };
        // 密碼檢核
        /**檢核暫時關閉 */
        const pswdStatus = this.checkPwdChg(checkObj, systemObj);
        
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
     * 密碼檢查
     * @param str
     */
    checkPwdChg(pwdObj: object, systemObj?: object) {

        /*pwdObj 參數照順序 為舊密碼 ,新密碼 ,認密碼
        //systemObj  參數照順序 身分證字號、使用者代碼
        */

        let checkPwdData: object;
        checkPwdData = {
            "inputData": {
                "oldpwd": pwdObj[0],
                "newpwd": pwdObj[1],
                "checkpwd": pwdObj[2]
            },
            "systemData": {
                "idNo": systemObj[0],
                "userId": systemObj[1]
            },
            "errorMsg": {
                "oldpwd": '',
                "newpwd": '',
                "checkpwd": '',
            },
            "status": true
        };

        // 三個input的驗空值、中文、表情符號

        let key: any;
        for (key in checkPwdData["inputData"]) {
            if (!checkPwdData["inputData"].hasOwnProperty(key)) {
                continue;
            };
            let empty = ObjectCheckUtil.checkEmpty(checkPwdData["inputData"][key]);
            //檢查空值
            if (empty.status == false) {
                checkPwdData["errorMsg"][key] = 'CHECK.INPUTEMPTY';
                checkPwdData["status"] = false;
            };
            //檢查中文
            let chineseCheck = ChineseCheckUtil.notChinese(checkPwdData["inputData"][key]);
            if (!chineseCheck.status) {
                checkPwdData["errorMsg"][key] = chineseCheck.msg;
                checkPwdData["status"] = false;
            };
            //表情符號
            let emojCheck = StringCheckUtil.emojiCheck(checkPwdData["inputData"][key]);
            if (!emojCheck.status) {
                checkPwdData["errorMsg"][key] = emojCheck.msg;
                checkPwdData["status"] = false;
            };

        }


        // 密碼規則- 檢核 新密碼 是否為英數字 & 檢查長度 
        let isnum = AuthCheckUtil.checkPswd(checkPwdData["inputData"].newpwd);
        if (isnum["status"] == false) {
            if (checkPwdData["errorMsg"]["newpwd"] == "") {
                checkPwdData["errorMsg"]["newpwd"] = isnum.msg;
            };
            checkPwdData["status"] = false;
        };
        // 檢核 新代號 是否與 身分證字號 相同
        let isSameAsCustId = UserChgUtil.isSameAsUserId(checkPwdData["inputData"].newcode, checkPwdData["systemData"].idNo);
        if (isSameAsCustId["status"] == false) {
            if (checkPwdData["errorMsg"]["newcode"] == "") {
                checkPwdData["errorMsg"]["newcode"] = isSameAsCustId.msg;
            }
            checkPwdData["status"] = false;
        }
        // 檢核 新代號 是否與 身分證字號後九碼 相同
        let cust_nine = checkPwdData["systemData"].idNo.substring(1, 10);
        let isSameAsCustId2 = UserChgUtil.isSameAsUserId(checkPwdData["inputData"].newcode, cust_nine);
        if (isSameAsCustId2["status"] == false) {

            if (checkPwdData["errorMsg"]["newcode"] == "") {
                checkPwdData["errorMsg"]["newcode"] = 'CHECK.PSWD.SAMECUST_2';
            }
            checkPwdData["status"] = false;
        }
        // 檢核 新密碼 是否與 使用者代碼 相同
        let isSameAsUserId = UserChgUtil.isSameAsUserId(checkPwdData["inputData"].newpwd, checkPwdData["systemData"].userId);
        if (isSameAsUserId["status"] == false) {
            //此用與檢核身分證同個function
            if (checkPwdData["errorMsg"]["newpwd"] == "") {
                checkPwdData["errorMsg"]["newpwd"] = 'CHECK.PSWD.SAMECONNID';
            };
            checkPwdData["status"] = false;
        };

        // 檢核 新密碼 與 舊密碼 是否相同
        let newEqualOld = UserChgUtil.newEqualOld(checkPwdData["inputData"].newpwd, checkPwdData["inputData"].oldpwd);
        if (newEqualOld["status"] == false) {

            if (checkPwdData["errorMsg"]["newpwd"] == "") {
                checkPwdData["errorMsg"]["newpwd"] = newEqualOld.msg;
            };
            checkPwdData["status"] = false;
        };
        // 檢核 確認新密碼 與 新密碼 是否一致
        let newNotEqualOld = UserChgUtil.newNotEqualOld(checkPwdData["inputData"].newpwd, checkPwdData["inputData"].checkpwd);
        if (newNotEqualOld["status"] == false) {

            if (checkPwdData["errorMsg"]["checkpwd"] == "") {
                checkPwdData["errorMsg"]["checkpwd"] = newNotEqualOld.msg;
            };
            checkPwdData["status"] = false;
        };
        // 密碼規則-參數設定(新密碼,連續數區分大小寫=1(不區分)),連續數限制長度)	 全英文全數字
        let sequenceChar = AuthCheckUtil.sequenceChar(checkPwdData["inputData"].newpwd, 0, 8);
        
        if (sequenceChar["status"] == false) {

            if (checkPwdData["errorMsg"]["newpwd"] == "") {
                checkPwdData["errorMsg"]["newpwd"] = sequenceChar.msg;
            };
            checkPwdData["status"] = false;
        };

        //舊密碼規則 避免密碼過於老舊無法輸入 先mark起來
        let checkOldPswd = AuthCheckUtil.checkOldPswd(checkPwdData["inputData"].oldpwd,false);
        if (sequenceChar["status"] == false) {
            if (checkPwdData["errorMsg"]["oldpwd"] == "") {
                checkPwdData["errorMsg"]["oldpwd"] = checkOldPswd.msg;
            };
            checkPwdData["status"] = false;
        };
        
        
        
        return checkPwdData;

    }

    /**
       * 使用者代碼變更檢查
       * @param set_data 資訊
       */
    public checkNetCodeChg(checkObj: Object, systemObj: Object) {
        const data = {
            status: false,
            title: 'MESSAGE.ROOT.INFO',
            msg: 'CHECK.ERROR',
            error_list: {}
        };
        /**檢核暫時關閉 */
        const checkCodeStatus = this.checkNetCode(checkObj, systemObj);

        if (!checkCodeStatus['status']) {
            data.error_list = checkCodeStatus['errorMsg'];
        }

        if (Object.keys(data.error_list).length < 1) {
            data.status = true;
            data.msg = '';
        }
        
        return data;
    }

    /**
       * 網路連線代號檢查
       * @param str
       */
    checkNetCode(accObj: object, sysmObj: object) {
        //accObj 參數照順序 新網路連線代號、連線密碼
        //systemObj  參數照順序 身分證、舊網路連線代號
        let checkCodeData: object;
        checkCodeData = {
            "inputData": {
                "newcode": accObj[0],
                "netpswd": accObj[1],
            },
            "systemData": {
                "idNo": sysmObj[0],
                "oldcode": sysmObj[1]
            },
            "errorMsg": {
                "newcode": '',
                "netpswd": '',
            },
            "status": true
        };
        

        // 驗空值
        let key: any;
        for (key in checkCodeData["inputData"]) {
            if (!checkCodeData["inputData"].hasOwnProperty(key)) {
                continue;
            }
            let empty = ObjectCheckUtil.checkEmpty(checkCodeData["inputData"][key]);
            if (empty.status == false) {
                checkCodeData["errorMsg"][key] = 'CHECK.INPUTEMPTY';
                checkCodeData["status"] = false;
            }

            let chineseCheck = ChineseCheckUtil.notChinese(checkCodeData["inputData"][key])
            if (!chineseCheck.status) {
                checkCodeData["errorMsg"][key] = chineseCheck.msg;
                checkCodeData["status"] = false;
            }
            //表情符號
            let emojCheck = StringCheckUtil.emojiCheck(checkCodeData["inputData"][key]);
            if (!emojCheck.status) {
                checkCodeData["errorMsg"][key] = emojCheck.msg;
                checkCodeData["status"] = false;
            }
            //檢查英數字
            let stringCheck = StringCheckUtil.checkEnglish(checkCodeData["inputData"][key], 'english_number');
            if (stringCheck.msg != "") {
                if (checkCodeData["errorMsg"][key] == "") {
                    checkCodeData["errorMsg"][key] = stringCheck.msg;
                    checkCodeData["status"] = false;
                }
            };
        }
        // 檢核 新代號 是否為6-16英數字
        let isnum = AuthCheckUtil.checkNetCode(checkCodeData["inputData"].newcode);
        if (isnum["status"] == false) {
            if (checkCodeData["errorMsg"]["newcode"] == "") {
                checkCodeData["errorMsg"]["newcode"] = isnum.msg;
            }
            checkCodeData["status"] = false;
        }
        // 檢核 新代號 是否與 身分證字號 相同 新連線代號不可設定與身份證字號相同
        let isSameAsUserId = UserChgUtil.isSameAsUserId(checkCodeData["inputData"].newcode, checkCodeData["systemData"].idNo);
        if (isSameAsUserId["status"] == false) {

            if (checkCodeData["errorMsg"]["newcode"] == "") {
                checkCodeData["errorMsg"]["newcode"] = 'CHECK.CONNID.SAMECONNID';
            }
            checkCodeData["status"] = false;
        }

        // 檢核 新代號 與 登入密碼 是否相同 此處不能相同 新連線代號不可設定與登入密碼相同
        let isSameAsPw = UserChgUtil.isSameAsPw(checkCodeData["inputData"].newcode, checkCodeData["inputData"].netpswd);
        if (isSameAsPw["status"] == false) {

            if (checkCodeData["errorMsg"]["newcode"] == "") {
                checkCodeData["errorMsg"]["newcode"] = 'CHECK.CONNID.SAMEPSWD';
            }
            checkCodeData["status"] = false;
        }

        // 檢核 新代號 與 舊代號 是否相同 新舊連線代號不得相同
        let newEqualOld = UserChgUtil.newEqualOld(checkCodeData["inputData"].newcode, checkCodeData["systemData"].oldcode);
        //此處借檢核舊密碼是否相同function (此為不能相同)
        if (newEqualOld["status"] == false) {

            if (checkCodeData["errorMsg"]["newcode"] == "") {
                checkCodeData["errorMsg"]["newcode"] = 'CHECK.CONNID.SAMEOLD';
            }
            checkCodeData["status"] = false;
        }
        // 參數設定(新代號,連續數區分大小寫=1(不區分)),連續數限制長度)	

        let sequenceChar = AuthCheckUtil.sequenceChar(checkCodeData["inputData"].newcode, 1, 6,'netCode');
        
        if (sequenceChar["status"] == false) {
            if (checkCodeData["errorMsg"]["newcode"] == "") {
                checkCodeData["errorMsg"]["newcode"] = sequenceChar.msg;
            }
            checkCodeData["status"] = false;
        }
        return checkCodeData;






    }
}
