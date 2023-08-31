import { Injectable } from '@angular/core';


import { FF000103ApiService } from '@api/ff/ff000103/ff000103-api.service';
import { FF000103ReqBody } from '@api/ff/ff000103/ff000103-req';
import { FF000104ApiService } from '@api/ff/ff000104/ff000104-api.service';
import { FF000104ReqBody } from '@api/ff/ff000104/ff000104-req';
// import { LangTransService } from 'app/shared/pipe/langTransPipe/lang-trans.service';

@Injectable()
export class mailService {

    constructor(
        private ff000103: FF000103ApiService,
        private ff000104: FF000104ApiService
    ) { }



    /**
     * 送出更改EMAIL資料
     * @param set_data 資訊
     */
    onSend(componentobj, security): Promise<any> {
        let output = {
            info_data: {},
            msg: '',
            result: '',
            status: false
        };

        
        //確認頁送出時再做一次檢測
        //值沒改變時 request回傳空值
        if (componentobj['NEW_MAIL'] == '') {
            alert('欄位值不能為空');
            return Promise.reject(output);
        }
        let reqObj = new FF000104ReqBody();

        if (typeof componentobj === 'object' && componentobj.hasOwnProperty('NEW_MAIL') &&
            componentobj.hasOwnProperty('USER_NOID')) {
            reqObj = {
                "custId": "",
                "newEmail": componentobj.NEW_MAIL,
            }
        } else {
            return Promise.reject(output);
        };
        
        let reqHeader = {
            header: security.securityResult.headerObj
        };
        return this.ff000104.send(reqObj, reqHeader).then(
            (jsonObj) => {
                let output = jsonObj;
                
                if (jsonObj.hasOwnProperty('status') && jsonObj.status == true) {
                    //查詢成功
                    output.status = true;
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
     * 取得email
     * @param set_data 身分證
     */
    getMailData(): Promise<any> {
        let output = {
            status: false,
            msg: 'Error',
            email: '',

        };
        let reqObj = new FF000103ReqBody();
        reqObj = {
            "custId": ""
        }
        // if (typeof set_data === 'string' && set_data != '') {
        //     reqObj.custId = set_data;
        // };

        return this.ff000103.send(reqObj).then(
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
    //===============================================================================
    /**
       * EMAIL變更檢查
       * @param set_data 資訊
       */
    public checkMailData(email: string,simple?: boolean) {
        const data = {
            status: false,
            title: 'MESSAGE.ROOT.INFO',
            msg: 'CHECK.EMAIL',
            error_list: {}
        };
        
        const emailStatus = this.checkEmail(email,simple);
        
        if (!emailStatus['status']) {
            data.error_list = emailStatus['msg'];
        }

        if (Object.keys(data.error_list).length < 1) {
            data.status = true;
            data.msg = '';
        }
        
        return data;
    }
    /**
    * email檢查
    * @param str email
    */
    checkEmail(str: string, simple?: boolean) {
        const data = {
            status: false,
            msg: 'CHECK.EMAIL',
            data: str
        };
        const res = /^[a-zA-Z0-9\._-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (simple) {
            if (str.indexOf("@") != -1) {
                data.status=true;
                data.msg = '';
            }
        };
        if (res.test(str)) {
            data.status = true;
            data.msg = '';
            return data;
        }

        return data;
    }

}









