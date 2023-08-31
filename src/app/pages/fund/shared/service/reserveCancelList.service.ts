/**
 * 基金預約交易查詢
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
// API
// import { FB000501ApiService } from '@api/fb/fb000501/fb000501-api.service';
// import { FB000502ApiService } from '@api/fb/fb000502/fb000502-api.service';
import { FI000601ApiService } from '@api/fi/fi000601/fi000601-api.service';
import { FI000601ReqBody } from '@api/fi/fI000601/FI000601-req';

@Injectable()
export class ReserveCancelListService {
    /**
     * 參數處理
     */

    constructor(
        private _logger: Logger
        // , private fb000501: FB000501ApiService
        // , private fb000502: FB000502ApiService
        , private fi000601: FI000601ApiService
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
     * 基金預約交易查詢
     * @param page 頁次
     * @param sort 排序
     */
    getData(req: object, page?: number, sort?: Array<any>): Promise<any> {
        return this.fi000601.getData(req, page, sort).then(
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
     * 基金預約交易查詢
     * @param other_data 其他資料
     */
    getContent(other_data?: object): Promise<any> {
        const output = {
            status: false,
            msg: '',
            custId: '',
            trnsDateTime: '',
            transToken: '',
            data: {
                enrollDate: '' // 交易日期
                , effectDate: '' // 生效日期
                , reserveTransCode: '' // 預約編號
                , transType: '' // 交易項目
                , transTypeDesc: '' // 交易項目說明
                , fundCode: '' // 投資代碼
                , fundName: '' // 投資標的名稱
                , fundRisk: '' // 基金風險屬性
                , investDesc: '' // 投資型態說明
                , transCode: '' // 交易編號
                , currency: '' //  投資幣別
                , iNCurrency: '' // 基金幣別
                , purchAmnt: ''// 申購/轉換/贖回金額
                , serviceFee: '' // 手續費
                , payAccount: '' // 扣款帳號
                , redeemAccount: '' // 入帳帳號
                , lastChangeDate: '' // 處理日期
                , status: '' // 處理結果(交易狀況)
                , statusDesc: '' // 處理結果說明
                , inFundCode: '' // 轉入基金代碼
                , inFundName: '' // 轉入基金名稱
            }
        };

        if (typeof other_data !== 'undefined') {
            output.custId = this._formateService.checkField(other_data, 'custId');
            output.trnsDateTime = this._formateService.checkField(other_data, 'trnsDateTime');
            output.transToken = this._formateService.checkField(other_data, 'transToken');
            output.data.enrollDate = this._formateService.checkField(other_data, 'enrollDate');
            output.data.effectDate = this._formateService.checkField(other_data, 'effectDate');
            output.data.reserveTransCode = this._formateService.checkField(other_data, 'reserveTransCode');
            output.data.transType = this._formateService.checkField(other_data, 'transType');
            output.data.transTypeDesc = this._formateService.checkField(other_data, 'transTypeDesc');
            output.data.fundCode = this._formateService.checkField(other_data, 'fundCode');
            output.data.fundName = this._formateService.checkField(other_data, 'fundName');
            output.data.fundRisk = this._formateService.checkField(other_data, 'fundRisk');
            output.data.investDesc = this._formateService.checkField(other_data, 'investDesc');
            output.data.transCode = this._formateService.checkField(other_data, 'transCode');
            output.data.currency = this._formateService.checkField(other_data, 'currency');
            output.data.iNCurrency = this._formateService.checkField(other_data, 'iNCurrency');
            output.data.serviceFee = this._formateService.checkField(other_data, 'serviceFee');
            output.data.payAccount = this._formateService.checkField(other_data, 'payAccount');
            output.data.redeemAccount = this._formateService.checkField(other_data, 'redeemAccount');
            output.data.lastChangeDate = this._formateService.checkField(other_data, 'lastChangeDate');
            output.data.status = this._formateService.checkField(other_data, 'status');
            output.data.statusDesc = this._formateService.checkField(other_data, 'statusDesc');
            output.data.inFundCode = this._formateService.checkField(other_data, 'inFundCode');
            output.data.inFundName = this._formateService.checkField(other_data, 'inFundName');
        }
        if (output.transToken === '' && output.data.enrollDate === '' && output.data.effectDate === ''
             && output.data.fundCode === '' && output.data.fundName === '') {
            output['msg'] = 'ERROR.EMPTY';
            return Promise.reject(output);
        }


        output.status = true;
        output.msg = '';
        return Promise.resolve(output);
        // 目前不確定是否要發電文取得內容，暫時先不取得，減少中台連線
        // return this.fi000601.getData(id);
    }

}


