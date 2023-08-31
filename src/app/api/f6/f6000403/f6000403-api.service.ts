// F6000403:外幣綜定存中途解約
import { Injectable } from '@angular/core';
import { F6000403ResBody } from './f6000403-res';
import { F6000403ReqBody } from './f6000403-req';


import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';

@Injectable()
export class F6000403ApiService extends ApiBase<F6000403ReqBody, F6000403ResBody> {
    constructor(
        public telegram: TelegramService<F6000403ResBody>,
        public errorHandler: HandleErrorService,
        public authService: AuthService,
        // private _localStorge :LocalStorageService
    ) {
        super(telegram, errorHandler, 'F6000403');
    }

    /**
     *
     * @param page 查詢頁數
     * @param sort 排序 ['排序欄位', 'ASC|DESC']
     */
    getData(receivedObj, reqHeader): Promise<any> {
        // // 參數處理
        // let data: F6000403ReqBody = new F6000403ReqBody();
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty("custId") || userData.custId == '') {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        receivedObj.custId = userData.custId; // user info;
        // data.trnsToken=this._formateService.checkField();
        if (receivedObj.account == ''
            || receivedObj.trnsToken == ''
            || receivedObj.startDate == ''
            || receivedObj.maturityDate == ''
            || receivedObj.currencyName == ''
            || receivedObj.margin == ''
            || receivedObj.tax == ''
            || receivedObj.profit == ''
            || receivedObj.total == ''
            || receivedObj.amount == ''
            || receivedObj.trnsfrRate == ''
            || receivedObj.interestIncome == ''
            || receivedObj.midInt == ''
            || receivedObj.insuAmt == ''
            || receivedObj.insuAmtTw == ''
            || receivedObj.insuRate == ''
            || receivedObj.xsAcct == ''
            || receivedObj.accountBranch == ''
            || receivedObj.agentBranch == ''
            || receivedObj.xfdueDate == ''
            || receivedObj.xfMmDd == ''
            || receivedObj.taxTw == ''
            || receivedObj.bACKINTAMT == ''
            || receivedObj.arcIssuDate == ''
            || receivedObj.arcExpDate == ''
            || receivedObj.interestRate == ''
            || receivedObj.cancelRate == ''
            || receivedObj.intTW == ''
        ) {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
      

        return this.send(receivedObj, reqHeader).then(
            (resObj) => {
                let output = {
                    status: false,
                    trnsRsltCode: '',
                    hostCode: '',
                    hostCodeMsg: '',
                    title: 'ERROR.TITLE',
                    msg: 'ERROR.DEFAULT',
                    classType: 'error',
                    info_data: {}
                };


                const transRes = TransactionApiUtil.modifyResponse(resObj);
                let telegram = transRes.body;
                output.status = transRes.status;
                output.title = transRes.title;
                output.msg = transRes.msg;
                output.classType = transRes.classType;
                output.trnsRsltCode = transRes.trnsRsltCode;
                output.hostCode = transRes.hostCode;
                output.hostCodeMsg = transRes.hostCodeMsg;
                output.info_data = telegram;

                return Promise.resolve(output);
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        );
    }


}
