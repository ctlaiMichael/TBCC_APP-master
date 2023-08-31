/**
 * 投資設定查詢
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
// API
// import { FB000501ApiService } from '@api/fb/fb000501/fb000501-api.service';
// import { FB000502ApiService } from '@api/fb/fb000502/fb000502-api.service';
import { FI000702ApiService } from '@api/fi/fi000702/fi000702-api.service';
import { FI000702ReqBody } from '@api/fi/fI000702/FI000702-req';

@Injectable()
export class SearchDepositAccountService {
    /**
     * 參數處理
     */

    constructor(
        private _logger: Logger
        // , private fb000501: FB000501ApiService
        // , private fb000502: FB000502ApiService
        , private fi000702: FI000702ApiService
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
     * formate漲跌幅級距，ex:回null轉為0
     * @param type：decline跌幅，gain漲幅
     * @param setData 
     */
    formateDecline(setData, type) {
        let output = {};

        for (let i = 1; i <= 5; i++) {
            output[type + i] = setData[type + i]; //先塞值，後面有錯誤會被取代
            output[type + i + 'Cd'] = setData[type + i + 'Cd'];
            //1.檢核漲跌幅值：
            //空字串
            if (setData[type + i] == '' && typeof setData[type + i] == 'string') {
                output[type + i] = '0';
            }
            //null
            if ((!setData[type + i] || setData[type + i] == null) && typeof setData[type + i] == 'object') {
                output[type + i] = '0';
            }
            //object
            if (setData[type + i] && typeof setData[type + i] == 'object') {
                output[type + i] = '';
            }
            //判斷非數字
            if (isNaN(setData[type + i]) == true) {
                output[type + i] = '';
            }
            //2.檢核+-號，若資料有誤，漲幅=>「-」，跌幅=>「+」
            if (setData[type + i + 'Cd'] == '' || !setData[type + i + 'Cd'] || setData[type + i + 'Cd'] == null
                || typeof setData[type + i + 'Cd'] == 'object' || (isNaN(setData[type + i + 'Cd']) == true
                    && setData[type + i + 'Cd'] != '-' && setData[type + i + 'Cd'] != '+')) {
                if (type == 'decline') {
                    output[type + i + 'Cd'] = '+';
                } else {
                    output[type + i + 'Cd'] = '-';
                }
            }
        }
        return output;
    }

    /**
     * 投資設定查詢列表
     * @param page 頁次
     * @param sort 排序
     */
    getData(req: object, page?: number, sort?: Array<any>): Promise<any> {
        return this.fi000702.getData(req, page, sort).then(
            (output) => {
                this._logger.step('FUND', 'SSSSSSSSSSSSSSSSSSSSSSs: ', output.info_data.hasOwnProperty('trnsRsltCode'));
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
     * 投資設定查詢編號
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
                , trnsToken: '' // 交易控制碼
                , trustAcnt: '' // trustAcnt	信託帳號
                , transCode: '' // transCode	交易編號
                , fundCode: '' // fundCode	基金代碼
                , fundType: '' // fundType	業務別
                , payDate1: '' // payDate1	每月扣款日期1
                , payDate2: '' // payDate2	每月扣款日期2
                , payDate3: '' // payDate3	每月扣款日期3
                , payDate4: '' // payDate4	每月扣款日期4
                , payDate5: '' // payDate5	每月扣款日期5
                , payAcnt: '' // payAcnt	定期定額扣款帳號
                , profitAcnt: '' // profitAcnt	現金收益存入帳號
                , breakFlag: '' // breakFlag	定期定額終止扣款註記
                , INCurrency: '' // 投資幣別
                , purchAmnt: '' // purchAmnt	定期定額申購金額
            }
        };

        if (typeof other_data !== 'undefined') {
            output.data.trnsRsltCode = this._formateService.checkField(other_data, 'trnsRsltCode');
            output.data.hostCode = this._formateService.checkField(other_data, 'hostCode');
            output.data.hostCodeMsg = this._formateService.checkField(other_data, 'hostCodeMsg');
            output.data.custId = this._formateService.checkField(other_data, 'custId');
            output.data.trnsToken = this._formateService.checkField(other_data, 'trnsToken');
            output.data.trustAcnt = this._formateService.checkField(other_data, 'trustAcnt');
            output.data.transCode = this._formateService.checkField(other_data, 'transCode');
            output.data.fundCode = this._formateService.checkField(other_data, 'fundCode');
            output.data.fundType = this._formateService.checkField(other_data, 'fundType');
            output.data.payDate1 = this._formateService.checkField(other_data, 'payDate1');
            output.data.payDate2 = this._formateService.checkField(other_data, 'payDate2');
            output.data.payDate3 = this._formateService.checkField(other_data, 'payDate3');
            output.data.payDate4 = this._formateService.checkField(other_data, 'payDate4');
            output.data.payDate5 = this._formateService.checkField(other_data, 'payDate5');
            output.data.payAcnt = this._formateService.checkField(other_data, 'payAcnt');
            output.data.profitAcnt = this._formateService.checkField(other_data, 'profitAcnt');
            output.data.breakFlag = this._formateService.checkField(other_data, 'breakFlag');
            output.data.INCurrency = this._formateService.checkField(other_data, 'INCurrency');
            output.data.purchAmnt = this._formateService.checkField(other_data, 'purchAmnt');

        }
        if (output.data.fundCode === '') {
            output['msg'] = 'ERROR.EMPTY';
            return Promise.reject(output);
        }


        output.status = true;
        output.msg = '';
        return Promise.resolve(output);
        // 目前不確定是否要發電文取得內容，暫時先不取得，減少中台連線
        // return this.fi000702.getData(id);
    }

}


