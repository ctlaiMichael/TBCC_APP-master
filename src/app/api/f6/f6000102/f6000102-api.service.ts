import { Injectable } from '@angular/core';
import { F6000102ResBody } from './f6000102-res';
import { F6000102ReqBody } from './f6000102-req';
import { TelegramOption } from '@core/telegram/telegram-option';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class F6000102ApiService extends ApiBase<F6000102ReqBody, F6000102ResBody> {
    constructor(public telegram: TelegramService<F6000102ResBody>,
        public errorHandler: HandleErrorService,
        private authService: AuthService) {
        super(telegram, errorHandler, 'F6000102');
      }
    /**
     * F6000102-台幣綜合存款轉定期存款
     */
    send(data: F6000102ReqBody, security): Promise<any> {
        const userData = this.authService.getUserInfo();


        data.custId = userData.custId;
        return super.send(data, security).then(
            (resObj) => {
                let output = {
                    status: false,
                    msg: 'Error',
                    info_data: {},
                };

                let telegram = (resObj.hasOwnProperty('body')) ? resObj.body : {};
                return Promise.resolve(telegram);

            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        );
    }
}
