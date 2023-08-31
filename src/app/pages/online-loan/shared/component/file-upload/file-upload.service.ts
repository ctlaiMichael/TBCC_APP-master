/**
 *線上申貸 證明文件上傳(共用)
 */
import { Injectable } from "@angular/core";
import { Logger } from '@core/system/logger/logger.service';
import { F9000408ApiService } from "@api/f9/f9000408/f9000408-api.service";
import { F9000409ApiService } from "@api/f9/f9000409/f9000409-api.service";
import { FormateService } from "@shared/formate/formate.service";
import { CheckSecurityService } from "@shared/transaction-security/check-security/check-security.srevice";
import { resolve } from "url";

@Injectable()

export class FileUploadService {
    private closeSecurity = false; //true:無安控(p4)
    loadStatus = ''; //上傳狀態：'0':稍後上傳，'1'：1~5張，'3':全部傳

    constructor(
        private _logger: Logger,
        private _formateService: FormateService,
        private f9000408: F9000408ApiService, // upload
        private f9000409: F9000409ApiService // apply
        , private _checkSecurityService: CheckSecurityService
    ) { }


    /**
     * 申請資料上傳
     * @param req 
     * @param e security 
     * @param uploadData 上圖data
     */
    async sendData(req, e, uploadData?: Object, loadtype?: boolean, loadStatus?: string): Promise<any> {
        this._logger.log("into sendData, req:", req);
        this._logger.log("into sendData, e:", e);
        this._logger.log("into sendData, uploadData:", uploadData);
        this._logger.log("into sendData, loadtype:", loadtype);
        this.loadStatus = loadStatus; //上傳狀態
        let output = {
            status: false,
            msg: 'CHECK.EMPTY', // 請輸入正確資料
            type: 'dialog',
            data: {
            },
            title: '',
            errorType: 'check',
            error_list: {
            },
            resultData: {
                classType: 'error',
                title: '',
                content: '',
                content_params: {}
            },
            stage: '', //判斷資料哪個階段，'1':申請，'2':上傳，'2'代表起碼已經申請成功
            resultStatus: '', //** '1':申請、上傳皆成功，'2':申請成功，上傳圖有漏(無全部上傳)，'3':申請成功，上傳失敗，'4':交易失敗or!4001
            ebkCaseNo: '' //案件編號
            // reqErr: true, //409 respCode: 4001為true，非為false
        };


        this._logger.step('Loan', 'send start', this._formateService.transClone(req));
        // 取得欲簽章本文
        let security_obj: any = {};
        let set_security: any;
        let select_security = this._formateService.checkObjectList(e, 'SEND_INFO.selected');
        // let select_security = e.SEND_INFO.selected;
        this._logger.log("e:", e);
        this._logger.step('Loan', 'set_security start', e, select_security);
        this._logger.log("set, select_security:", select_security);
        set_security = this.f9000409.checkSecurity(req, false);
        this._logger.step('Loan', 'set_security start', this._formateService.transClone(set_security));
        if (select_security === '3') {
            //組otp資料
            security_obj.SSL_val = '';
            security_obj.otpObj = set_security.otpObj;
            security_obj.securityType = '3';
            security_obj.serviceId = set_security.serviceId;
            security_obj.showCaptcha = true;
            security_obj.signText = set_security.signText;
            security_obj.status = true;
            security_obj.transAccountType = '1';
            this._logger.log("security_obj.otpObj:", security_obj.otpObj);
        } else if (select_security === '2') {
            // e = set_security;
            //組憑證資料
            security_obj.SSL_val = '';
            security_obj.otpObj = set_security.otpObj;
            security_obj.securityType = '2';
            security_obj.serviceId = set_security.serviceId;
            security_obj.showCaptcha = true;
            security_obj.signText = set_security.signText;
            security_obj.status = true;
            security_obj.transAccountType = '1';
            this._logger.log("security_obj:", security_obj);
            this._logger.log("set_security:", set_security);
            this._logger.log("e.signText:", security_obj.signText);
            this._logger.log("last, e:", security_obj);
        }
        // if (e.securityType === '3') {
        //     e.otpObj = set_security.otpObj;
        //     e.serviceId = set_security.serviceId;
        //     e.signText = set_security.signText;
        //     e.transAccountType = '1';
        //     this._logger.log("e.otpObj:", e.otpObj);
        // } else if (e.securityType === '2') {
        //     // e = set_security;
        //     e.serviceId = set_security.serviceId;
        //     e.signText = set_security.signText;
        //     e.transAccountType = '1';
        //     this._logger.log("set_security:", set_security);
        //     this._logger.log("e.signText:", e.signText);
        //     this._logger.log("last, e:", e);
        // }

        // 進行安控處理
        let security: any;
        try {
            if (!this.closeSecurity) {
                security = await this._checkSecurityService.doSecurityNextStep(security_obj);
            } else {
                security = {
                    header: {}
                };
            }
        } catch (error_do_security) {
            this._logger.log("into doSecurityNextStep() reject");
            //OTP取消
            if (error_do_security.hasOwnProperty('ERROR') && error_do_security.ERROR.errorCode == 'USER_CANCEL') {
                this._logger.log("into otp cancel error_do_security reject");
                let errorObj = error_do_security.ERROR;
                return Promise.reject(errorObj);
            }
            // 解析失敗回傳
            return Promise.reject(error_do_security);
        }

        return this.f9000409.sendData(req, security).then(
            (resObj) => {
                let show_title = 'success';
                let show_content = resObj.respCodeMsg;
                output.status = true;
                output.errorType = '';
                output.msg = show_content;
                output.resultData = {
                    classType: 'success',
                    title: show_title,
                    content: show_content,
                    content_params: { date: this._formateService.transDate(resObj.dataTime, 'date') }
                };
                output.stage = '1'; //申請階段
                uploadData['txNo'] = resObj['txNo']; //408 req上傳 需要 (案件編號)
                output.ebkCaseNo = resObj['txNo']; //503 req約據下載 需要
                output.title = resObj.respCode;

                //交易失敗 or respCode != 4001
                if (resObj['excError'] == false) {
                    output.resultStatus = '4';
                    return Promise.resolve(output);
                }

                //409如果respCode不是4001，雖然成功，但要導失敗
                // if (resObj.respCode != '4001') {
                //     this._logger.log("into not 4001");
                //     output.stage = '1';
                //     output.msg = resObj.respCodeMsg;
                //     output.errorType = 'api';
                //     output.reqErr = false; //非4001
                //     return Promise.resolve(output);
                // }
                //true: 立即(需上傳文件)
                if (loadtype == true) {
                    this._logger.log("into loadtype == true");
                    return this.f9000408.sendData(uploadData).then(
                        (uploadS) => {
                            // V1: success
                            this._logger.log("uploadS:", uploadS);
                            output.stage = '2'; //圖片上傳階段
                            output.title = uploadS.respCode;
                            //若申請、上傳皆為成功，需判斷情境
                            //全部上傳(滿圖)
                            if (this.loadStatus == '2') {
                                output.resultStatus = '1';
                            } else {
                                //圖有漏，選擇1~5張    
                                output.resultStatus = '2';
                            }
                            return Promise.resolve(output);
                        },
                        (uploadE) => {
                            // V2: warning 圖失敗
                            //* 要改 會接不到
                            this._logger.log("into upload error, uploadE:", uploadE);
                            output.stage = '2'; //圖片上傳階段
                            output.msg = uploadE.content;
                            output.resultData.classType = 'warning';
                            output.errorType = 'api';
                            output.title = '申請上傳失敗';
                            //情境判斷(申請成功，但上傳失敗)
                            output.resultStatus = '3';
                            this._logger.log("uploadE, output:", output);
                            return Promise.resolve(output); //圖片上傳失敗扔然resolve回去
                        }
                    );
                } else {
                    // V2: warning 圖補(稍後傳)
                    output.resultStatus = '1'; //都成功，因為不需發上傳api
                    return Promise.resolve(output);
                }
            },
            (errorObj) => {
                // this._logger.log("into 409 errorObj:", errorObj);
                // let errorResult = errorObj.hasOwnProperty('resultData') ? errorObj.resultData : {};
                // this._logger.log("errorResult:", errorResult);
                // let errorBody = errorResult.hasOwnProperty('body') ? errorResult.body : {};
                // this._logger.log("errorBody:", errorBody);
                errorObj.errorType = 'api';
                // if (errorBody!={}) {
                //     output.msg = errorBody.respCodeMsg;
                // } else {
                //     output.msg = errorObj.msg;
                // }
                // let show_title = 'error';
                // let show_content = errorBody.respCodeMsg;
                // output.title = errorObj.respCode;
                // output.msg = errorObj.respCodeMsg;
                // output.resultData = {
                //     classType: 'error',
                //     title: show_title,
                //     content: show_content,
                //     content_params: {}
                // };
                this._logger.log("into 409 error output:", errorObj);
                return Promise.reject(errorObj);
            }
        );

    }


}