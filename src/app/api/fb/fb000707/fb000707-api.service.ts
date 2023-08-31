/**
 * FB000707:外匯存款帳戶查詢
 */
import { Injectable } from '@angular/core';
import { FB000707ResBody } from './fb000707-res';
import { FB000707ReqBody } from './fb000707-req';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { TelegramOption } from '@core/telegram/telegram-option';

@Injectable()
export class FB000707ApiService extends ApiBase<FB000707ReqBody, FB000707ResBody> {
    constructor(
        public telegram: TelegramService<FB000707ResBody>,
        public errorHandler: HandleErrorService,
        public authService: AuthService,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'FB000707');
    }
    returnData;
    /**
 * 最新消息
 * obj:
 * account: 帳號
 * startDate: 起始日期
 * endDate: 終止日期
 * paginator: Paginator
 */
    getData(obj): Promise<any> {
        // 黃金存摺
        const form = new FB000707ReqBody();
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty('custId') || userData.custId == '') {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        form.custId = userData.custId;
        form.account = obj;
        return this.send(form).then(
            (resObj) => {
                if (resObj.body != null) {
                    //[時間,黃金存摺清單查詢內容]

                    delete resObj.body['@xmlns:xsi'];
                    this.returnData = [resObj.header['responseTime'], resObj.body];

                } else {
                    this.returnData = null;
                }
                return Promise.resolve(this.returnData);
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        );




    }



}
