/**
 * 現金收益存入帳號異動
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
// API
// import { FB000501ApiService } from '@api/fb/fb000501/fb000501-api.service';
// import { FB000502ApiService } from '@api/fb/fb000502/fb000502-api.service';
import { FI000703ApiService } from '@api/fi/fi000703/fi000703-api.service';
import { FI000703ReqBody } from '@api/fi/fI000703/FI000703-req';
import { logger } from '@shared/util/log-util';
@Injectable()
export class PayChangeResultService {
    /**
     * 參數處理
     */

    constructor(
        private _logger: Logger
        // , private fb000501: FB000501ApiService
        // , private fb000502: FB000502ApiService
        , private fi000703: FI000703ApiService
        , private _formateService: FormateService
    ) { }


    /**
     * 現金收益存入帳號異動列表
     * @param page 頁次
     * @param sort 排序
     */
    getData(req: object, security?: any, page?: number, sort?: Array<any>): Promise<any> {
        let reqHeader = {
            header: security.securityResult.headerObj
          };
        return this.fi000703.getData(req, page, sort, reqHeader).then(
            (output) => {
                this._logger.step('FUND', 'SSSSSSSSSSSSSSSSSSSSSSs');
                return Promise.resolve(output);
            },
            (error_obj) => {
                logger.error('FUND', error_obj);
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
                trnsRsltCode: '' // trnsRsltCode	交易結果代碼
                , hostCode: '' // hostCode	交易結果
                , hostCodeMsg: '' // hostCodeMsg	主機代碼訊息
                , custId: '' // custId	身分證字號
                , trustAcnt: '' // trustAcnt	信託帳號
                , transCode: '' // transCode	交易編號
                , fundCode: '' // fundCode	基金代碼
                , investAmntFlag: '' // investAmntFlag	投資金額變更狀態
                , investAmnt: '' // investAmnt	投資金額
                , payDateFlag: '' // payDateFlag	扣款日期變更狀態
                , payDate1: '' // payDate1	扣款日期變更1
                , payDate2: '' // payDate2	扣款日期變更2
                , payDate3: '' // payDate3	扣款日期變更3
                , payDate4: '' // payDate4	扣款日期變更4
                , payDate5: '' // payDate4	扣款日期變更5
                , payTypeFlag: '' // payTypeFlag	扣款狀況變更
                , changeBegin: '' // changeBegin	變更起日
                , changeEnd: '' // changeEnd	變更迄日
                , payAcntStatus: '' // payAcntStatus	扣款帳號變更狀態
                , payAcnt: '' // payAcnt	扣款帳號
                , profitAcntFlag: '' // profitAcntFlag	現金收益存入帳號變更狀態
                , oriProfitAcnt: '' // oriProfitAcnt	原現金收益存入帳號
                , profitAcnt: '' // debitStatus	現金收益存入帳號
                , effectDate: '' // effectDate	生效日期
                , amount: '' // amount	信託金額
                , unit1: '' // unit1	單位數
            }
        };

        if (typeof other_data !== 'undefined') {
            output.data.trnsRsltCode = this._formateService.checkField(other_data, 'trnsRsltCode');
            output.data.hostCode = this._formateService.checkField(other_data, 'hostCode');
            output.data.hostCodeMsg = this._formateService.checkField(other_data, 'hostCodeMsg');
            output.data.custId = this._formateService.checkField(other_data, 'custId');
            output.data.trustAcnt = this._formateService.checkField(other_data, 'trustAcnt');
            output.data.transCode = this._formateService.checkField(other_data, 'transCode');
            output.data.fundCode = this._formateService.checkField(other_data, 'fundCode');
            output.data.investAmntFlag = this._formateService.checkField(other_data, 'investAmntFlag');
            output.data.investAmnt = this._formateService.checkField(other_data, 'investAmnt');
            output.data.payDateFlag = this._formateService.checkField(other_data, 'payDateFlag');
            output.data.payDate1 = this._formateService.checkField(other_data, 'payDate1');
            output.data.payDate2 = this._formateService.checkField(other_data, 'payDate2');
            output.data.payDate3 = this._formateService.checkField(other_data, 'payDate3');
            output.data.payDate4 = this._formateService.checkField(other_data, 'payDate4');
            output.data.payDate5 = this._formateService.checkField(other_data, 'payDate5');
            output.data.payTypeFlag = this._formateService.checkField(other_data, 'payTypeFlag');
            output.data.changeBegin = this._formateService.checkField(other_data, 'changeBegin');
            output.data.changeEnd = this._formateService.checkField(other_data, 'changeEnd');
            output.data.payAcntStatus = this._formateService.checkField(other_data, 'payAcntStatus');
            output.data.payAcnt = this._formateService.checkField(other_data, 'payAcnt');
            output.data.profitAcntFlag = this._formateService.checkField(other_data, 'profitAcntFlag');
            output.data.oriProfitAcnt = this._formateService.checkField(other_data, 'oriProfitAcnt');
            output.data.profitAcnt = this._formateService.checkField(other_data, 'profitAcnt');
            output.data.effectDate = this._formateService.checkField(other_data, 'effectDate');
            output.data.unit1 = this._formateService.checkField(other_data, 'unit1');
            output.data.amount = this._formateService.checkField(other_data, 'amount');
        }
        if (output.data.fundCode === '') {
            output['msg'] = 'ERROR.EMPTY';
            return Promise.reject(output);
        }


        output.status = true;
        output.msg = '';
        return Promise.resolve(output);
        // 目前不確定是否要發電文取得內容，暫時先不取得，減少中台連線
        // return this.fi000703.getData(id);
    }

}


