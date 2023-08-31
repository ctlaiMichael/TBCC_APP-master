import { Injectable } from '@angular/core';
import { StringCheckUtil } from '@shared/util/check/string-check-util';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { ChineseCheckUtil } from '@shared/util/check/word/chinese-check-util';

import { FF000101ApiService } from '@api/ff/ff000101/ff000101-api.service';
import { FF000101ReqBody } from '@api/ff/ff000101/ff000101-req';
import { FF000102ApiService } from '@api/ff/ff000102/ff000102-api.service';
import { FF000102ReqBody } from '@api/ff/ff000102/ff000102-req';
import { AuthService } from '@core/auth/auth.service';
@Injectable()
export class addressService {


    constructor(
        private ff000101: FF000101ApiService,
        private ff000102: FF000102ApiService 
        , private authService: AuthService
    ) { }



    /**
     * 送出資料
     * @param set_data 資訊
     */
    onSend(componentobj, oldaddress, security): Promise<any> {
        let output = {
            info_data: {},
            msg: '',
            result: '',
            status: false
        };
        
        
        //確認頁送出時再做一次檢測
        //值沒改變時 request回傳空值
        if (componentobj['USER_ZIPCODE'] == '' || componentobj['USER_ADDRESS'] == '' || componentobj['USER_TEL'] == '') {
            alert('欄位值不能為空');
            return Promise.reject(output);
        }

        
        let reqObj = new FF000102ReqBody();
        //值沒改變時 request回傳空值
        if (typeof componentobj === 'object'
            && componentobj.hasOwnProperty('USER_ZIPCODE') && componentobj.hasOwnProperty('USER_ADDRESS')
            && componentobj.hasOwnProperty('USER_TEL')  && oldaddress.hasOwnProperty('zipCode') && oldaddress.hasOwnProperty('address')
            && oldaddress.hasOwnProperty('tel')) {
            reqObj = {
                "custId": "",
                // "newZipCode": (componentobj.USER_ZIPCODE == oldaddress.zipCode) ? '' : componentobj.USER_ZIPCODE,
                // "newAddress": (componentobj.USER_ADDRESS == oldaddress.address) ? '' : componentobj.USER_ADDRESS,
                // "newTel": (componentobj.USER_TEL == oldaddress.tel) ? '' : componentobj.USER_TEL
                 "newZipCode": componentobj.USER_ZIPCODE,
                "newAddress":componentobj.USER_ADDRESS,
                "newTel":  componentobj.USER_TEL
            }
            
        
        } else {
            return Promise.reject(output);
        };
        
        

        const userData = this.authService.getUserInfo();
        let reqHeader = {
            header: security.securityResult.headerObj
        };
        return this.ff000102.send(reqObj,reqHeader).then(
            (jsonObj) => {
                let output = jsonObj;
                if (jsonObj.hasOwnProperty('status') && jsonObj.status == true) {
                    //更動成功
                    output.msg = '';
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
     * 取得舊地址資訊
     * @param set_data 身分證
     */
    getAddressData(): Promise<any> {
        let output = {
            status: false,
            msg: 'Error',
            zipCode: '',
            address: '',
            tel: ''
        };

        let reqObj = new FF000101ReqBody();


        return this.ff000101.send(reqObj).then(
            (jsonObj) => {
                let output = jsonObj;
                if (jsonObj.hasOwnProperty('status') && jsonObj.status == true) {
                    //查詢成功
                    output.msg = '';
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
    };


    /**
     * 模擬 取得安控資訊
     */
    get_security(get_type?: string) {
        let output: any = {
            'list': {},
            'data': []
        };
        let safeData = [
            { id: '1', name: 'SSL' }
            , { id: '2', name: '憑證' }
        ]
        safeData.forEach((item) => {
            if (!item.hasOwnProperty('id')) {
                return false;
            }
            output.list[item.id] = item;
        });
        if (typeof safeData === 'object') {
            output.data = safeData;
        };
        if (typeof get_type !== 'undefined') {
            output = (output.hasOwnProperty(get_type)) ? output[get_type] : null;
        }
        return output;
    }
    //=======================================檢查格式========================================
    /**
       * 通訊地址變更檢查
       * @param set_data 資訊
       */
    public checkAddressData(checkObj: Object) {
        const data = {
            status: false,
            title: 'MESSAGE.ROOT.INFO',
            msg: 'CHECK.ERROR',
            error_list: {}
        };
        const addressStatus = this.checkAddress(checkObj);
        if (!addressStatus['status']) {
            data.error_list = addressStatus['errorMsg'];
        }
        if (Object.keys(data.error_list).length < 1) {
            data.status = true;
            data.msg = '';
        }
        return data;
    }
    /**
         * 通訊地址變更檢查
         * @param str
         */
    checkAddress(inputObj: object) {
        let checkData: object;
        checkData = {
            "inputData": {
                "zipcode": inputObj[0],
                "address": inputObj[1],
                "tel": inputObj[2]
            },
            "errorMsg": {
                "zipcode": '',
                "address": '',
                "tel": ''
            },
            "status": true
        };
        let key: any;
        for (key in checkData["inputData"]) {
            if (!checkData["inputData"].hasOwnProperty(key)) {
                continue;
            }
            let empty = ObjectCheckUtil.checkEmpty(checkData["inputData"][key]);
            if (empty.status == false) {
                checkData["errorMsg"][key] = empty.msg;
                checkData["status"] = false;
            }
            //檢查中文  內層if表示跳過檢驗的表格
          
            let chineseCheck=ChineseCheckUtil.notChinese(checkData["inputData"][key])
            if (!chineseCheck.status) {
                if (key != 'address') {
                    checkData["errorMsg"][key] = chineseCheck.msg;
                    checkData["status"] = false;
                }
            }
            //表情符號
            let emojCheck=StringCheckUtil.emojiCheck(checkData["inputData"][key]);
            if (!emojCheck.status) {
                checkData["errorMsg"][key] = emojCheck.msg;
                checkData["status"] = false;
            }
        }
        return checkData;
    }
}









