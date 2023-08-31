/**
 * FC001005-額度調整圖檔上傳
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';
import { Logger } from '@core/system/logger/logger.service';
import { FC001005ReqBody } from './fc001005-req';
import { FC001005ResBody } from './fc001005-res';

@Injectable()
export class FC001005ApiService extends ApiBase<FC001005ReqBody, FC001005ResBody> {

    constructor(public telegram: TelegramService<FC001005ResBody>,
        public errorHandler: HandleErrorService
        , private authService: AuthService
        , private _formateService: FormateService
        , private _logger: Logger
    ) {
        super(telegram, errorHandler, 'FC001005');
    }

    /**
     * 取得額度調整資訊
     * @param set_data 參數
     */
    getData(set_data?: Object): Promise<any> {
        // 參數處理
        let data: FC001005ReqBody = new FC001005ReqBody();
        data.custId = set_data['custId']; 
        data.txNo = set_data['txNo'];
        data.finProofReqr = set_data['finProofReqr'];
        data.finProof1 = set_data['finProof1'];
        this._logger.log("fc001004 send data:",data);
        return this.send(data).then(
            (resObj) => {
                let output = {
                    status: false,
                    msg: '',
                    info_data:{}
                };
                this._logger.log("resObj:",resObj);
                let jsonObj = (resObj.hasOwnProperty('body'))?resObj['body']:{};
                this._logger.log("jsonObj:",jsonObj);
                output.info_data = jsonObj;
                //api規格不會回details
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
