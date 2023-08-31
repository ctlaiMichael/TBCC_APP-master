/**
 * F2000502-我的金庫查詢
 *
 * result	結果	0-成功, 1-表示失敗
 * respCode	電文回應代碼	4001表示成功, 其他代碼 表示失敗
 * respCodeMsg	電文代碼說明	失敗原因
 * twnBalance	台幣金額	查無資料都回覆 0
 * fxnBalance	外幣折台金額	查無資料都回覆 0
 * fundBalance	基金折台金額	查無資料都回覆 0
 * goldBalance	黃金存摺折台金額	查無資料都回覆 0
 * totalAmt	加總金額
 *
 */
import { Injectable } from '@angular/core';
import { F2000501ResBody } from './f2000501-res';
import { F2000501ReqBody } from './f2000501-req';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { TelegramOption } from '@core/telegram/telegram-option';
import { CommonApiUtil } from '@api/modify/common-api-util';

@Injectable()
export class F2000501ApiService extends ApiBase<F2000501ReqBody, F2000501ResBody> {
    constructor(
        public telegram: TelegramService<F2000501ResBody>,
        public errorHandler: HandleErrorService,
        public authService: AuthService,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'F2000501');
    }


    send(data: F2000501ReqBody, option?: any): Promise<any> {
        data.custId = this.authService.getCustId();
        if (!data.custId) {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        return super.send(data, option).then(
            (resObj) => {
                let output = {
                    status: false,
                    close: false, // 是否關閉資產查詢功能(交易量過大，暫時停止資料查詢)
                    msg: 'ERROR.RSP_FORMATE_ERROR',
                    hostCode: '',
                    hostCodeMsg: '',
                    dataTime: '',
                    data: {
                        totalAmt: '0', // 加總金額
                        twnBalance: '0', // 台幣金額
                        fxnBalance: '0', // 外幣折台金額
                        fundBalance: '0', // 基金折台金額
                        goldBalance: '0' // 黃金存摺折台金額
                    }
                };
                let modify_data = CommonApiUtil.modifyResponse(resObj);
                if (!modify_data.status) {
                    // 查詢失敗
                    return Promise.reject(modify_data);
                }
                output.status = modify_data.status;
                output.msg = modify_data.msg;
                output.hostCode = modify_data.hostCode;
                output.hostCodeMsg = modify_data.hostCodeMsg;
                output.dataTime = modify_data.dataTime;

                let jsonObj = modify_data.body;

                // --- 20200103針對基金折台先行隱藏處理(開放後請刪除此區塊) --- //
                let all_fund = this._formateService.checkField(jsonObj, 'totalAmt');
                let fund_balance = this._formateService.checkField(jsonObj, 'fundBalance');
                all_fund = all_fund.replace(',', '');
                fund_balance = fund_balance.replace(',', '');
                if (fund_balance != '') {
                    // tslint:disable-next-line: radix
                    jsonObj['totalAmt'] = parseInt(all_fund) - parseInt(fund_balance); // 強制去除
                }
                jsonObj['fundBalance'] = ''; // 強制清除
                // --- 20200103針對基金折台先行隱藏處理(開放後請刪除此區塊) End --- //

                output.data.totalAmt = this._checkData(jsonObj, 'totalAmt');
                output.data.twnBalance = this._checkData(jsonObj, 'twnBalance');
                output.data.fxnBalance = this._checkData(jsonObj, 'fxnBalance');
                output.data.fundBalance = this._checkData(jsonObj, 'fundBalance');
                output.data.goldBalance = this._checkData(jsonObj, 'goldBalance');

                if (output.hostCode == '3999') {
                    // 交易量過大，暫時停止資料查詢
                    output.close = true;
                }


                return Promise.resolve(output);
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        );
    }

    private _checkData(obj, field: string) {
        let output = this._formateService.checkField(obj, field);
        if (!!output) {
            output = this._formateService.transMoney(output, 'TWD');
        }
        return output;
    }


}
