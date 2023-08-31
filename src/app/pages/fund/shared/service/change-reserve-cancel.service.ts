/**
 * 現金收益存入帳號異動
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
// API
// import { FB000501ApiService } from '@api/fb/fb000501/fb000501-api.service';
// import { FB000502ApiService } from '@api/fb/fb000502/fb000502-api.service';
import { FI000602ApiService } from '@api/fi/fi000602/fi000602-api.service';
import { FI000602ReqBody } from '@api/fi/fI000602/FI000602-req';

@Injectable()
export class ChangeReserveCancelService {
    /**
     * 參數處理
     */

    constructor(
        private _logger: Logger
        // , private fb000501: FB000501ApiService
        // , private fb000502: FB000502ApiService
        , private fi000602: FI000602ApiService
        , private _formateService: FormateService
    ) { }

    getSetData() {
        let output = [
            {
                id: 'Y',
                name: 'Y'
            }
            , {
                id: 'N',
                name: 'N'
            }
            , {
                id: 'A',
                name: 'A'
            }
        ];
        return output;
    }


    /**
     * 現金收益存入帳號異動列表
     * @param page 頁次
     * @param sort 排序
     */
    getData(req: object, security?: any, page?: number, sort?: Array<any>): Promise<any> {
        let reqHeader = {
            header: security.securityResult.headerObj
          };
          this._logger.step('FUND', '處理reqHeader: ', reqHeader);
        return this.fi000602.getData(req, page, sort, reqHeader).then(
            (output) => {
                this._logger.step('FUND', 'SSSSSSSSSSSSSSSSSSSSSSs');
                return Promise.resolve(output);
            },
            (error_obj) => {
                this._logger.step('FUND', 'FFFFFFFFFFFFFFFFFFFFFFFFF');
                return Promise.reject(error_obj);
            }
        );


    }

    /**
     * 內文資料
     * 現金收益存入帳號異動編號
     * @param other_data 其他資料
     */
    getContent(other_data?: object): Promise<any> {
        const output = {
            status: false,
            msg: '',
            data: {
                custId: '' // custId身分證號
                , hostCode: '' // hostCode	交易結果
                , hostCodeMsg: '' // hostCodeMsg	主機代碼訊息
                , trnsRsltCode: '' // trnsRsltCode	交易結果代碼
                , trnsDateTime: '' // trnsDateTime 交易時間
                , reserveTransCode: '' // reserveTransCode 預約編號
                , enrollDate: '' // enrollDate 交易日期
                , effectDate: '' // effectDate 生效日期
                , transType: '' // transType 交易項目
                , transTypeDesc: '' // transTypeDesc 交易項目說明
                , fundCode: '' // fundCode	基金代碼
                , fundName: '' // fundName	基金名稱
                , transCode: '' // transCode	交易編號
                , currency: '' // currency 投資幣別
                , inCurrency: '' // inCurrency 基金幣別
                , purchAmnt: '' // purchAmnt 申購/轉換/贖回金額
                , serviceFee: '' // serviceFee	手續費
                , payAccount: '' // payAccount	扣款帳號
                , redeemAccount: '' // redeemAccount	入帳帳號
                , lastChangeDate: '' // lastChangeDate	處理日期
                , status: '' // status	處理結果
                , inFundCode: '' // inFundCode	轉入基金代碼
                , inFundName: '' // inFundName	轉入基金名稱
            }
        };

        if (typeof other_data !== 'undefined') {
            output.data.custId = this._formateService.checkField(other_data, 'custId');
            output.data.hostCode = this._formateService.checkField(other_data, 'hostCode');
            output.data.hostCodeMsg = this._formateService.checkField(other_data, 'hostCodeMsg');
            output.data.trnsRsltCode = this._formateService.checkField(other_data, 'trnsRsltCode');
            output.data.trnsDateTime = this._formateService.checkField(other_data, 'trnsDateTime');
            output.data.reserveTransCode = this._formateService.checkField(other_data, 'reserveTransCode');
            output.data.enrollDate = this._formateService.checkField(other_data, 'enrollDate');
            output.data.effectDate = this._formateService.checkField(other_data, 'effectDate');
            output.data.transType = this._formateService.checkField(other_data, 'transType');
            output.data.transTypeDesc = this._formateService.checkField(other_data, 'transTypeDesc');
            output.data.fundCode = this._formateService.checkField(other_data, 'fundCode');
            output.data.fundName = this._formateService.checkField(other_data, 'fundName');
            output.data.transCode = this._formateService.checkField(other_data, 'transCode');
            output.data.currency = this._formateService.checkField(other_data, 'currency');
            output.data.inCurrency = this._formateService.checkField(other_data, 'inCurrency');
            output.data.purchAmnt = this._formateService.checkField(other_data, 'purchAmnt');
            output.data.serviceFee = this._formateService.checkField(other_data, 'serviceFee');
            output.data.payAccount = this._formateService.checkField(other_data, 'payAccount');
            output.data.redeemAccount = this._formateService.checkField(other_data, 'redeemAccount');
            output.data.lastChangeDate = this._formateService.checkField(other_data, 'lastChangeDate');
            output.data.status = this._formateService.checkField(other_data, 'status');
            output.data.inFundCode = this._formateService.checkField(other_data, 'inFundCode');
            output.data.inFundName = this._formateService.checkField(other_data, 'inFundName');
        }
        if (output.data.fundCode === '') {
            output['msg'] = 'ERROR.EMPTY';
            return Promise.reject(output);
        }


        output.status = true;
        output.msg = '';
        return Promise.resolve(output);
        // 目前不確定是否要發電文取得內容，暫時先不取得，減少中台連線
        // return this.fi000704.getData(id);
    }

}


