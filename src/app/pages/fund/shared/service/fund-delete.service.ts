/**
 * 現金收益存入帳號異動
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
// API
// import { FB000501ApiService } from '@api/fb/fb000501/fb000501-api.service';
// import { FB000502ApiService } from '@api/fb/fb000502/fb000502-api.service';
import { FI000711ApiService } from '@api/fi/fi000711/fi000711-api.service';
import { FI000711ReqBody } from '@api/fi/fI000711/FI000711-req';

@Injectable()
export class FundDeleteService {
    /**
     * 參數處理
     */

    constructor(
        private _logger: Logger
        // , private fb000501: FB000501ApiService
        // , private fb000502: FB000502ApiService
        , private fi000711: FI000711ApiService
        , private _formateService: FormateService
    ) { }


    /**
     * 定期不定額刪除
     * @param page 頁次
     * @param sort 排序
     */
    getData(req: object, page?: number, sort?: Array<any>): Promise<any> {
        return this.fi000711.getData(req, page, sort).then(
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
     * 定期不定額刪除
     * @param other_data 其他資料
     */
    getContent(other_data?: object): Promise<any> {
        const output = {
            status: false,
            msg: '',
            data: {
                custId: '' // custId	身分證字號
                , successCode: '' // 處理狀態
            }
        };

        if (typeof other_data !== 'undefined') {
            output.data.custId = this._formateService.checkField(other_data, 'custId');
            output.data.successCode = this._formateService.checkField(other_data, 'successCode');

        }
        if (output.data.custId === '') {
            output['msg'] = 'ERROR.EMPTY';
            return Promise.reject(output);
        }


        output.status = true;
        output.msg = '';
        return Promise.resolve(output);
        // 目前不確定是否要發電文取得內容，暫時先不取得，減少中台連線
        // return this.fi000711.getData(id);
    }

}


