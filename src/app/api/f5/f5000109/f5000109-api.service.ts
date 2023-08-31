// F5000109:-外幣議價查詢
import { Injectable } from '@angular/core';
import { F5000109ResBody } from './f5000109-res';
import { F5000109ReqBody } from './f5000109-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { AuthService } from '@core/auth/auth.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { Logger } from '@core/system/logger/logger.service';

@Injectable()
export class F5000109ApiService extends ApiBase<F5000109ReqBody, F5000109ResBody> {
    constructor(
        public telegram: TelegramService<F5000109ResBody>,
        public authService: AuthService,
        public errorHandler: HandleErrorService,
        private _logger: Logger,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'F5000109');

    }

    getData(req: object): Promise<any> {
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty('custId') || userData.custId == '') {
            this._logger.error('DATA_FORMAT_ERROR login', userData);
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        // 參數處理
        let data: F5000109ReqBody = new F5000109ReqBody();
        data.custId = userData.custId; 
        data.negotiatedCurr = this._formateService.checkField(req, 'negotiatedCurr');//議價幣別
        data.fnctType = this._formateService.checkField(req, 'fnctType');//交易類別
       
        if (data.negotiatedCurr == '' || data.fnctType=='') {
            this._logger.error('DATA_FORMAT_ERROR api req', data, req);
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        return this.send(data).then(
            (resObj) => {
                let output = {
                    status: false,
                    msg: 'Error',
                    info_data: {},
                    detail: []            
                };

               
                let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};

                output.info_data = jsonObj;


                if (jsonObj.hasOwnProperty('details') && jsonObj['details']
                    && jsonObj['details'].hasOwnProperty('detail') && jsonObj['details']['detail']
                ) {
                    output.detail = this.modifyTransArray(jsonObj.details['detail']);
                } else {
                    output.detail = [];
                };


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
