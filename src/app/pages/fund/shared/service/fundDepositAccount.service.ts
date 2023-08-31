/**
 * 現金收益存入帳號異動
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
// API
// import { FB000501ApiService } from '@api/fb/fb000501/fb000501-api.service';
// import { FB000502ApiService } from '@api/fb/fb000502/fb000502-api.service';
import { FI000701ApiService } from '@api/fi/fi000701/fi000701-api.service';
import { FI000701ReqBody } from '@api/fi/fI000701/FI000701-req';

@Injectable()
export class FundDepositAccountService {
    /**
     * 參數處理
     */

    constructor(
        private _logger: Logger
        // , private fb000501: FB000501ApiService
        // , private fb000502: FB000502ApiService
        , private fi000701: FI000701ApiService
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
    getData(req: object, page?: number, sort?: Array<any>): Promise<any> {
        return this.fi000701.getData(req, page, sort).then(
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
                fundCode: '' // fundCode	投資代碼
                , fundName: '' // fundName	投資標的名稱
                , investType: '' // investType	投資型態
                , investDesc: '' // investDesc	投資型態說明
                , iNCurrency: '' // iNCurrency	投資幣別
                , invenAmount: '' // invenAmount	庫存金額(信託本金)
                , transCode: '' // transCode	交易編號
                , trustAcnt: '' // trustAcnt	信託帳號
                // , unit: '' // unit	單位數
                // , account: '' // account	贖回預設存入帳號
                // , code: '' // code	定期不定額套餐代碼
                , debitStatus: '' // debitStatus	扣款狀態
                , deleteFlag: '' // deleteFlag	可否刪除定期(不)定額申購
            }
        };

        if (typeof other_data !== 'undefined') {
            output.data.fundCode = this._formateService.checkField(other_data, 'fundCode');
            output.data.fundName = this._formateService.checkField(other_data, 'fundName');
            output.data.investType = this._formateService.checkField(other_data, 'investType');
            output.data.investDesc = this._formateService.checkField(other_data, 'investDesc');
            output.data.iNCurrency = this._formateService.checkField(other_data, 'iNCurrency');
            output.data.invenAmount = this._formateService.checkField(other_data, 'invenAmount');
            output.data.transCode = this._formateService.checkField(other_data, 'transCode');
            output.data.trustAcnt = this._formateService.checkField(other_data, 'trustAcnt');
            // output.data.unit = this._formateService.checkField(other_data, 'unit');
            // output.data.account = this._formateService.checkField(other_data, 'account');
            // output.data.code = this._formateService.checkField(other_data, 'code');
            output.data.debitStatus = this._formateService.checkField(other_data, 'debitStatus');
            output.data.deleteFlag = this._formateService.checkField(other_data, 'deleteFlag');
        }
        if (output.data.fundCode === '' && output.data.fundName === '') {
            output['msg'] = 'ERROR.EMPTY';
            return Promise.reject(output);
        }


        output.status = true;
        output.msg = '';
        return Promise.resolve(output);
        // 目前不確定是否要發電文取得內容，暫時先不取得，減少中台連線
        // return this.fi000701.getData(id);
    }

}


