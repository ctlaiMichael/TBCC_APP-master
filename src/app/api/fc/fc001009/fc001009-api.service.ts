/**
 * FC001009-簡訊密碼請求
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';
import { FC001009ResBody } from './fc001009-res';
import { FC001009ReqBody } from './fc001009-req';
import { Logger } from '@core/system/logger/logger.service';

@Injectable()
export class FC001009ApiService extends ApiBase<FC001009ReqBody, FC001009ResBody> {

    constructor(public telegram: TelegramService<FC001009ResBody>,
        public errorHandler: HandleErrorService
        , private authService: AuthService
        , private _formateService: FormateService
        , private _logger: Logger
    ) {
        super(telegram, errorHandler, 'FC001009');
    }

    /**
     * 取得簡訊請求資訊
     * @param set_data 參數
     */
    getData(set_data?: Object): Promise<any> {
        this._logger.log("into fc000109 api service getData");
        // 參數處理
        let data: FC001009ReqBody = new FC001009ReqBody();
        data.custId = set_data['custId'];
        data.phone = set_data['phone'];
        this._logger.log("send fc001009 data:", data);
        return this.send(data).then(
            (resObj) => {
                let output = {
                    status: false,
                    msg: '',
                    info_data: {}
                };
                this._logger.log("resObj:", resObj);
                let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
                this._logger.log("jsonObj:", jsonObj);
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
