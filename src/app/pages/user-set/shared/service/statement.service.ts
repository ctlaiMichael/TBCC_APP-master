import { Injectable } from '@angular/core';
import { FJ000101ApiService } from '@api/fj/fj000101/fj000101-api.service';
import { FJ000101ReqBody } from '@api/fj/fj000101/fj000101-req';
@Injectable()
export class statementService {
    /**
     * 參數處理
    //  */

    constructor(
        private fj000101: FJ000101ApiService
    ) { }
    /**
     * 根據申請或異動取得不同內容
     */
    getContent(isElectApply, oldMail) {
        let Content;
        if (isElectApply != '') {
            if (isElectApply == '1') {  //異動
                Content = {
                    'input_1': '原留存電子郵件'
                    , 'input_2': '*變更電子郵件'
                    , 'inValue_1': oldMail
                    , 'inValue_2': ''
                }
            } else {
                Content = {      //申請
                    'input_1': '寄送方式'
                    , 'input_2': '*電子郵件'
                    , 'inValue_1': '電子郵件寄送'
                    , 'inValue_2': ''

                }
            }
        }
        return Content;

    }
    /**
     * 由登入資訊F1000101取得isElectApply暫存於記憶體
     * 於其他服務取得此 Flag判斷綜合對帳單是否申請過
     * 0為異動，1為申請
     *  
     */
    // getStatementSet() {
    //     let output: any = {
    //         'data': ''
    //     };
    //     let set_data = { isElectApply: '1' };
    //     if (set_data.hasOwnProperty('isElectApply')) {
    //         output.data = set_data['isElectApply'];
    //     };

    //     return output;
    // }




    /**
    * 送出資料
    */
    onSend(componentobj,security): Promise<any> {
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
        let reqObj = new FJ000101ReqBody();
        if (typeof componentobj === 'object' && componentobj.hasOwnProperty('NEW_MAIL')
            && componentobj.hasOwnProperty('TRANSFLAG')) {
            reqObj = {
                "custId": "",
                "newEmail": componentobj.NEW_MAIL,
                "transFlag": "1"
            }
        } else {
            return Promise.reject(output);
        };

        let reqHeader = {
            header: security.securityResult.headerObj
          };

        return this.fj000101.send(reqObj,reqHeader).then(
            (jsonObj) => {
                let output = jsonObj;
                if (output.hasOwnProperty('info_data') && typeof output['info_data'] === 'object'
                    && output['info_data'].hasOwnProperty('body')
                ) {
                    //更改成功
                    output.status = true;
                    output.info_data = jsonObj.info_data.body;
                    return Promise.resolve(output);
                } else {
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

}









