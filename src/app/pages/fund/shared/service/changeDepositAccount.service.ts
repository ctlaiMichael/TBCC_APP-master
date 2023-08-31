/**
 * 現金收益存入帳號異動
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
// API
// import { FB000501ApiService } from '@api/fb/fb000501/fb000501-api.service';
// import { FB000502ApiService } from '@api/fb/fb000502/fb000502-api.service';
import { FI000704ApiService } from '@api/fi/fi000704/fi000704-api.service';
import { FI000704ReqBody } from '@api/fi/fI000704/FI000704-req';

@Injectable()
export class ChangeDepositAccountService {
    /**
     * 參數處理
     */

    constructor(
        private _logger: Logger
        // , private fb000501: FB000501ApiService
        // , private fb000502: FB000502ApiService
        , private fi000704: FI000704ApiService
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
        return this.fi000704.getData(req, page, sort, reqHeader).then(
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
                trnsRsltCode: '' // trnsRsltCode	交易結果代碼
                , hostCode: '' // hostCode	交易結果
                , hostCodeMsg: '' // hostCodeMsg	主機代碼訊息
                , custId: '' // custId	身分證字號
                , trustAcnt: '' // trustAcnt	信託帳號
                , transCode: '' // transCode	交易編號
                , fundCode: '' // fundCode	基金代碼
                , unit: '' // unit	庫存單位數
                , amount: '' // amount	信託金額
                , oriProfitAcnt: '' // oriProfitAcnt	原現金收益存入帳號
                , profitAcnt: '' // debitStatus	現金收益存入帳號
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
            output.data.unit = this._formateService.checkField(other_data, 'unit');
            output.data.amount = this._formateService.checkField(other_data, 'amount');
            output.data.oriProfitAcnt = this._formateService.checkField(other_data, 'oriProfitAcnt');
            output.data.profitAcnt = this._formateService.checkField(other_data, 'profitAcnt');
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

        //抓今日
        public setToday() {
            let today = new Date();
            let y = (today.getFullYear()-1911).toString(); //西元年
            let m = (today.getMonth() + 1).toString();
            if (parseInt(m) < 10) {
                m = '0' + m;
            }
            let d = today.getDate().toString();
            let enrollDate;

                if (parseInt(d) < 10) {
                    d = '0' + d;
                }
                enrollDate = y + '/' + m + '/' + d;
            return enrollDate;
        }

}


