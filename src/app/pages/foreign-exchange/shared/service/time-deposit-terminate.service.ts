import { F5000101ApiService } from '@api/f5/f5000101/f5000101-api.service';
/**
 *外匯綜定存中途解約
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { F6000401ApiService } from '@api/f6/f6000401/f6000401-api.service';
import { F6000402ApiService } from '@api/f6/f6000402/f6000402-api.service';
import { F6000403ApiService } from '@api/f6/f6000403/f6000403-api.service';
import { ElectricityResultPageComponent } from '@pages/taxes/electricity/electricity-result-page.component';
import { F6000403ReqBody } from '@api/f6/f6000403/f6000403-req';
// import { HitrustPipeService } from '@share_pipe/hitrustPipe';
@Injectable()
export class TimeDepositTerminateService {
    /**
     * 參數處理
     */
    constructor(
        private _logger: Logger,
        private f6000401: F6000401ApiService,
        private f6000402: F6000402ApiService,
        private f6000403: F6000403ApiService,
        private f5000101: F5000101ApiService
    ) { }


    /**
     *@param set_data
     * 向service取得資料
     */
    // 發電文 F6000401-外匯綜定存查詢
    getData(): Promise<any> {

        return this.f6000401.getData().then(
            (output) => {
                if (output.status) {
                    return Promise.resolve(output);
                } else {
                    return Promise.reject(output);
                }
            },
            (error_obj) => {
                return Promise.reject(error_obj);
            }
        );

    }
    // 發電文 F6000402-外幣綜定存中途解約明細查詢
    getDetail(selectedItem): Promise<any> {

        return this.f6000402.getData(selectedItem).then(
            (output) => {
                if (output.status) {
                    return Promise.resolve(output);
                } else {
                    return Promise.reject(output);
                }
            },
            (error_obj) => {
                return Promise.reject(error_obj);
            }
        );
    }
    // 發電文 F6000403-外幣綜定存中途解約
    public onSend(sendObj, security): Promise<any> {
        let output = {
            status: false,
            msg: '',
            info_data: {}
        }
        let reqObj = new F6000403ReqBody();
        if (typeof sendObj === 'object' && sendObj.hasOwnProperty('account') &&
            sendObj.hasOwnProperty('startDate') && sendObj.hasOwnProperty('maturityDate') &&
            sendObj.hasOwnProperty('currencyName') && sendObj.hasOwnProperty('margin') &&
            sendObj.hasOwnProperty('tax') && sendObj.hasOwnProperty('profit') &&
            sendObj.hasOwnProperty('total') && sendObj.hasOwnProperty('amount') &&
            sendObj.hasOwnProperty('trnsfrRate') && sendObj.hasOwnProperty('interestIncome') &&
            sendObj.hasOwnProperty('midInt') && sendObj.hasOwnProperty('insuAmt') &&
            sendObj.hasOwnProperty('insuAmtTw') && sendObj.hasOwnProperty('insuRate') &&
            sendObj.hasOwnProperty('insuRate') && sendObj.hasOwnProperty('xsAcct') &&
            sendObj.hasOwnProperty('accountBranch') && sendObj.hasOwnProperty('xfdueDate') &&
            sendObj.hasOwnProperty('xfMmDd') && sendObj.hasOwnProperty('taxTw') &&
            sendObj.hasOwnProperty('bACKINTAMT') && sendObj.hasOwnProperty('arcIssuDate') &&
            sendObj.hasOwnProperty('arcExpDate') && sendObj.hasOwnProperty('interestRate') &&
            sendObj.hasOwnProperty('cancelRate') && sendObj.hasOwnProperty('intTW') &&
            sendObj.hasOwnProperty('trnsToken')
        ) {
            reqObj = {
                'custId': '',
                'account': sendObj.account,
                'trnsToken': sendObj.trnsToken,
                'startDate': sendObj.startDate,
                'maturityDate': sendObj.maturityDate,
                'currencyName': sendObj.currencyName,
                'margin': sendObj.margin,
                'tax': sendObj.tax,
                'profit': sendObj.profit,
                'total': sendObj.total,
                'amount': sendObj.amount,
                'trnsfrRate': sendObj.trnsfrRate,
                'interestIncome': sendObj.interestIncome,
                'midInt': sendObj.midInt,
                'insuAmt': sendObj.insuAmt,
                'insuAmtTw': sendObj.insuAmtTw,
                'insuRate': sendObj.insuRate,
                'xsAcct': sendObj.xsAcct,
                'accountBranch': sendObj.accountBranch,
                'agentBranch': sendObj.agentBranch,
                'xfdueDate': sendObj.xfdueDate,
                'xfMmDd': sendObj.xfMmDd,
                'taxTw': sendObj.taxTw,
                'bACKINTAMT': sendObj.bACKINTAMT,
                'arcIssuDate': sendObj.arcIssuDate,
                'arcExpDate': sendObj.arcExpDate,
                'interestRate': sendObj.interestRate,
                'cancelRate': sendObj.cancelRate,
                'intTW': sendObj.intTW
            }
        } else {
            return Promise.reject(output);
        };
        let reqHeader = {
            header: security.securityResult.headerObj
        };
        return this.f6000403.getData(reqObj, reqHeader).then(
            (jsonObj) => {
                output.info_data = jsonObj.info_data;
                output.status = true;
                return Promise.resolve(output);
            },
            (error_obj) => {
                return Promise.reject(error_obj);
            }
        );
    }
    /**
      *
      * @param page 查詢頁數
      * @param sort 排序 ['排序欄位', 'ASC|DESC']
      */
    getTime(type, searchAccount?: string): Promise<any> {

        return this.f5000101.getData(type).then(
            (sucess) => {
                // let output = this.midfyDefaultAccount(sucess, searchAccount);
                return Promise.resolve(sucess);
            },
            (failed) => {
                return Promise.reject(failed);
            }
        );
    }
}




