/**
 * FC000403-信用卡本期帳單查詢電文
 * [Response]
 *      result	結果 (0-成功, 1-表示失敗)
 *      respCode	電文回應代碼
 *      respCodeMsg	電文代碼說明
 *      payableAmt	本期應繳金額
 *      lowestPayableAmt	本期最低應繳金額
 *      maxInstallmentAmt	分期金額上限
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FC000403ReqBody } from './fc000403-req';
import { FC000403ResBody } from './fc000403-res';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { TelegramOption } from '@core/telegram/telegram-option';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';
import { CardApiUtil } from '@api/modify/card-api-util'; // 信用卡專區整理結果

@Injectable()
export class FC000403ApiService extends ApiBase<FC000403ReqBody, FC000403ResBody> {

    constructor(public telegram: TelegramService<FC000403ResBody>,
        public errorHandler: HandleErrorService
        , private authService: AuthService
        , private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'FC000403');
    }

    /**
     * 取得帳單資料
     * @param set_data 參數
     * @param background 採取非同步取得
     */
    getData(set_data?: Object, background?: boolean): Promise<any> {
        // 參數處理
        let option: TelegramOption = new TelegramOption();
        if (background === true) {
            option.background = true;
        }
        let data: FC000403ReqBody = new FC000403ReqBody();
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty('custId') || userData.custId == '') {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        data.custId = userData.custId; // user info;

        return this.send(data, option).then(
            (resObj) => {
                let output = {
                    status: false,
                    msg: '',
                    payableAmt: '', // 本期應繳金額
                    lowestPayableAmt: '', // 本期最低應繳金額
                    maxInstallmentAmt: '', // 分期金額上限
                    paidAmt: '',
                    custName: '',
                    dataTime: '', // 電文的回應時間
                    currentMonth: '',
                    preMonth: ''
                };
    // data: any = {
    //     'allAmt': '0', // 所有額度
    //     'useAmt': '0', // 已用額度
    //     'usableAmt': '0', // 可用餘額
    //     'bill': '0', // 未繳金額
    //     'percent': '0', // 比例
    //     'dateline': {
    //         'date': '00',
    //         'month': '00',
    //         'day': '00'
    //     }
    // };
                let modify_data = CardApiUtil.modifyResponse(resObj);
                if (!modify_data.status) {
                    return Promise.reject({
                        title: 'ERROR.TITLE',
                        content: modify_data.msg,
                        resultCode: modify_data.resultCode
                    });
                }
                let jsonObj = modify_data.body;
                let jsonHeader = modify_data.header;

                output.payableAmt = this._formateService.checkField(jsonObj, 'payableAmt');
                output.lowestPayableAmt = this._formateService.checkField(jsonObj, 'lowestPayableAmt');
                output.maxInstallmentAmt = this._formateService.checkField(jsonObj, 'maxInstallmentAmt');
                output.paidAmt = this._formateService.checkField(jsonObj, 'paidAmt');
                output.custName = this._formateService.checkField(jsonObj, 'custName');
                output.dataTime = this._formateService.checkField(jsonHeader, 'responseTime');
                if (output.dataTime !== '') {
                    output.currentMonth = this._formateService.transDate(output.dataTime, 'MM');
                    if ((Number(output.currentMonth) - 1)===0){
                        output.preMonth="12";
                    }else{
                        output.preMonth = (Number(output.currentMonth) - 1).toString();
                    }
                }







                output.status = true;
                output.msg = '';
                return Promise.resolve(output);
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        );
    }
}
