/**
 * 約定轉入帳號設定
 */
import { Injectable } from '@angular/core';
import { StringCheckUtil } from '@shared/util/check/string-check-util';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { FG000406ApiService } from '@api/fg/fg000406/fg000406-api.service';
import { FG000406ReqBody } from '@api/fg/fg000406/fg000406-req';
import { FG000401ApiService } from '@api/fg/fg000401/fg000401-api.service';
import { FG000401ReqBody } from '@api/fg/fg000401/fg000401-req';
import { FG000402ApiService } from '@api/fg/fg000402/fg000402-api.service';
import { FG000402ReqBody } from '@api/fg/fg000402/fg000402-req';
import { FG000405ApiService } from '@api/fg/fg000405/fg000405-api.service';
import { FG000405ReqBody } from '@api/fg/fg000405/fg000405-req';
import { F4000103ApiService } from '@api/f4/f4000103/f4000103-api.service';
import { F4000103ReqBody } from '@api/f4/f4000103/f4000103-req';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
@Injectable()
export class AgreedAccountService {

    constructor(
        private f4000103: F4000103ApiService, // F4000103-銀行代碼查詢
        private fg000406: FG000406ApiService, // FG000406(new)-新增約定轉入帳號_2010831
        private fg000401: FG000401ApiService, // FG000401-註銷約定轉入帳號查詢
        private fg000402: FG000402ApiService, // FG000402-註銷約定轉入帳號
        private fg000405: FG000405ApiService // FG000405(new)-合庫本人可約定帳戶查詢
        , private _handleError: HandleErrorService
    ) { }


    /**
     * 合庫本人可約定帳戶查詢
     */
    getAcntSelf(): Promise<any> {
        let output = {
            status: false,
            msg: 'ERROR.DEFAULT',
            info_data: []
        };


        let reqObj = new FG000405ReqBody();
        reqObj = {
            "custId": ""
        };


        return this.fg000405.send(reqObj).then(
            (jsonObj) => {
                let output: any = jsonObj;
                if (typeof jsonObj == 'object' && jsonObj.hasOwnProperty('data') && jsonObj['data'] != '') {
                    output.status = true;
                    output.msg = '';
                    output.info_data = jsonObj.data;
                    return Promise.resolve(output);
                } else {
                    return Promise.reject(output);
                }
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }

        );
    }


    /**
     * 註銷約定轉入帳號查詢
     */
    getAgreedAccount(): Promise<any> {
        let output = {
            status: false,
            msg: 'ERROR.DEFAULT',
            dataTime: '',
            data: []
        };

        let reqObj = new FG000401ReqBody();
        reqObj = {
            "custId": ""
        };

        return this.fg000401.send(reqObj).then(
            (jsonObj) => {
                let output: any = jsonObj;
                if (jsonObj.hasOwnProperty('status') && jsonObj.status == true && jsonObj.hasOwnProperty('data')
                    && jsonObj.hasOwnProperty('requestTime')) {
                    //查詢成功
                    output.msg = '';
                    output.status = true;
                    output.dataTime = jsonObj.requestTime;
                    output.data = jsonObj.data;
                    return Promise.resolve(output);
                } else {
                    output.status = false;
                    return Promise.reject(output);
                }
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }

        );
    }

    // /**
    //  * 取得銀行列表 => 已統一使用app-search-bank-page
    //  */
    // getBank(): Promise<any> {
    //     let output = {
    //         status: false,
    //         msg: 'ERROR.DEFAULT',
    //         info_data: []
    //     };


    //     let reqObj = new F4000103ReqBody();

    //     return this.f4000103.send(reqObj).then(
    //         (jsonObj) => {

    //             let output = jsonObj;
    //             if (jsonObj.hasOwnProperty('status') && jsonObj.status == true && jsonObj.hasOwnProperty('data')) {
    //                 //查詢成功
    //                 output.msg = '';
    //                 output.status = true;
    //                 output.info_data = jsonObj.data;
    //                 return Promise.resolve(output);
    //             } else {
    //                 output.status = false;
    //                 return Promise.reject(output);
    //             }
    //         },
    //         (errorObj) => {
    //             return Promise.reject(errorObj);
    //         }
    //     );
    // }


    /**
     * 新增約定帳號
     * @param componentobj
     * @param security
     */
    onSend(componentobj, security): Promise<any> {
        let output = {
            msg: '',
            info_data: {},
            status: false
        };

        // 確認頁送出時再做一次檢測
        if (componentobj['bankNo'] == '' || componentobj['accountNo'] == '' ||
            componentobj['accountNickName'] == '' || componentobj['currency'] == ''
        ) {
            alert('資料有誤');
            return Promise.reject(output);
        }

        let reqObj = new FG000406ReqBody();

        if (typeof componentobj === 'object' && componentobj.hasOwnProperty('bankNo') &&
            componentobj.hasOwnProperty('accountNo') && componentobj.hasOwnProperty('accountNickName')
            && componentobj.hasOwnProperty('currency')) {
            reqObj = {
                "custId": "",
                "bankNo": componentobj.bankNo,
                "accountNo": componentobj.accountNo,
                "accountNickName": componentobj.accountNickName,
                "currency": componentobj.currency
            };
        } else {
            return Promise.reject(output);
        }
        let reqHeader = {
            header: security.securityResult.headerObj
        };

        return this.fg000406.send(reqObj, reqHeader).then(
            (jsonObj) => {
                let output: any = jsonObj;
                // 更動成功
                output.msg = '';
                return Promise.resolve(jsonObj);
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        );
    }


    /**
     * 註銷約定帳號
     * @param componentobj
     * @param security
     */
    onSendRemove(componentobj, security): Promise<any> {
        let output = {
            msg: '',
            info_data: {},
            status: false
        };

        // 確認頁送出時再做一次檢測
        if (componentobj['trnsInBank'] == '' || componentobj['trnsInAccnt'] == ''
        ) {
            return Promise.reject(output);
        }
        let reqObj = new FG000402ReqBody();
        if (typeof componentobj === 'object' && componentobj.hasOwnProperty('trnsInBank') &&
            componentobj.hasOwnProperty('trnsInAccnt')) {
            let trnsAcnt = componentobj.trnsInAccnt.replace(/-/g, '');
            reqObj = {
                "custId": "",
                "bank": componentobj.trnsInBank,
                "account": trnsAcnt
            };
        } else {
            return Promise.reject(output);
        }


        let reqHeader = {
            header: security.securityResult.headerObj
        };

        return this.fg000402.send(reqObj, reqHeader).then(
            (jsonObj) => {
                let output: any = jsonObj;
                // 更動成功
                output.msg = '';
                return Promise.resolve(jsonObj);
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        );
    }




    // /**
    // * 模擬 取得安控資訊
    // */
    // get_security(get_type?: string) {
    //     let output: any = {
    //         'list': {},
    //         'data': []
    //     };
    //     let safeData = [
    //         { id: '1', name: 'SSL' }
    //         , { id: '2', name: '憑證' }
    //     ]
    //     safeData.forEach((item) => {
    //         if (!item.hasOwnProperty('id')) {
    //             return false;
    //         }
    //         output.list[item.id] = item;
    //     });
    //     if (typeof safeData === 'object') {
    //         output.data = safeData;
    //     };
    //     if (typeof get_type !== 'undefined') {
    //         output = (output.hasOwnProperty(get_type)) ? output[get_type] : null;
    //     }
    //     return output;
    // }


    /**
     * 好記名稱檢核
     * @param nickName
     */
    checkNickName(nickName) {

        const data = {
            status: false,
            title: 'MESSAGE.ROOT.INFO',
            msg: 'CHECK.ERROR',
            error_list: {}
        };

        // 不能為空
        const checkEmpty = ObjectCheckUtil.checkEmpty(nickName);
        if (!checkEmpty['status']) {
            data.error_list = checkEmpty.msg;
        }
        // 表情符號
        const checkEmoji = StringCheckUtil.emojiCheck(nickName);
        if (!checkEmoji['status']) {
            data.error_list = checkEmoji['msg'];
        }
        // 需小於10
        if (nickName.length > 10) {
            data.error_list = 'CHECK.NICKNAME';
        }

        if (Object.keys(data.error_list).length < 1) {
            data.status = true;
            data.msg = '';
        }
        return data;
    }



    /**
     * 錯誤訊息顯示整理
     * (頁面的popup_window移除)
     * 目前其他錯誤都與OTP有關，但現行本功能不開放OTP做設定
     */
    popupShow(type: string) {
        let content_str: string;
        // 新增需使用憑證
        // popFlag.safe
        // 新增約定轉入帳號設定需使用「憑證」轉帳機制始得進行交易。
        this._handleError.handleError({
            type: 'dialog',
            title: 'FIELD.INFO_TITLE',
            content: '新增約定轉入帳號設定需使用「憑證」轉帳機制始得進行交易。',
            button: 'BTN.CHECK'
        });
    }




}









