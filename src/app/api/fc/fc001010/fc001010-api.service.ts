/**
 * FC001010-簡訊密碼驗證
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';
import { FC001010ResBody } from './fc001010-res';
import { FC001010ReqBody } from './fc001010-req';
import { Logger } from '@core/system/logger/logger.service';

@Injectable()
export class FC001010ApiService extends ApiBase<FC001010ReqBody, FC001010ResBody> {

    constructor(public telegram: TelegramService<FC001010ResBody>,
        public errorHandler: HandleErrorService
        , private authService: AuthService
        , private _formateService: FormateService
        , private _logger: Logger
    ) {
        super(telegram, errorHandler, 'FC001010');
    }

    /**
     * 取得簡訊請求資訊
     * @param set_data 參數
     */
    getData(set_data?: Object): Promise<any> {
        this._logger.log("into fc001010 api service getData");
        // 參數處理
        let data: FC001010ReqBody = new FC001010ReqBody();
        data.custId = set_data['custId'];
        data.verifyWeb = set_data['verifyWeb'];
        data.verifyCode = set_data['verifyCode'];
        this._logger.log("send fc001010 data:", data);
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
