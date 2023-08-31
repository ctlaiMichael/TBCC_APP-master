
/**
 * F5000107:
 * 外幣預約轉帳註銷
 */
import { Injectable } from '@angular/core';
import { F5000108ResBody } from './f5000108-res';
import { F5000108ReqBody } from './f5000108-req';
import { TelegramService } from '@core/telegram/telegram.service';
import { AuthService } from '@core/auth/auth.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { Logger } from '@core/system/logger/logger.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';

@Injectable()
export class F5000108ApiService extends ApiBase<F5000108ReqBody, F5000108ResBody> {
    constructor(
        public telegram: TelegramService<F5000108ResBody>,
        public errorHandler: HandleErrorService,
        public authService: AuthService,
        private _logger: Logger,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'F5000108');

    }

    /**
     *
     * @param
     */
    getData(req: object, reqHeader?): Promise<any> {
        const custId = this.authService.getCustId();
        if (custId == '') {
            // this._logger.error('DATA_FORMAT_ERROR login', userData);
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        // 參數處理
        let data: F5000108ReqBody = new F5000108ReqBody();

        data.custId = custId; // user info;

        data.transDateS = this._formateService.checkField(req, 'transDateS');
        data.transDateS = data.transDateS.replace(/\//g, '');
        data.transDateE = this._formateService.checkField(req, 'transDateE');
        data.transDateE = data.transDateE.replace(/\//g, '');
         data.type = this._formateService.checkField(req, 'type');
        return this.send(data, reqHeader).then(
            (resObj) => {
                let output: any = {
                    status: false,
                    msg: 'Error',
                    info_data: {},
                    // data: [],
                    requestTime: '',
                    data: []
                };
                let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
                output.info_data = jsonObj;
                if (jsonObj.hasOwnProperty('details') && jsonObj.hasOwnProperty('outDate') && jsonObj.hasOwnProperty('outTime')
                    && jsonObj['details']['detail']
                ) {
                    output.data = this.modifyTransArray(jsonObj['details']['detail']);
                }

                if (output.data.length <= 0) {
                    return Promise.reject({
                        title: 'ERROR.TITLE',
                        content: 'ERROR.EMPTY',
                        data: output,
                        dataTime: output.dataTime
                    });
                }

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
