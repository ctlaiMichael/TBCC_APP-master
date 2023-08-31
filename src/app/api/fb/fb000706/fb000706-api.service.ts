/**
 * FB000706:外匯存款帳戶查詢
 */
import { Injectable } from '@angular/core';
import { FB000706ResBody } from './fb000706-res';
import { FB000706ReqBody } from './fb000706-req';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { TelegramOption } from '@core/telegram/telegram-option';

@Injectable()
export class FB000706ApiService extends ApiBase<FB000706ReqBody, FB000706ResBody> {
    constructor(
        public telegram: TelegramService<FB000706ResBody>,
        public errorHandler: HandleErrorService,
        public authService: AuthService,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'FB000706');
    }
    returnData: Array<any> = [];
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
        const form = new FB000706ReqBody();
        const userData = this.authService.getUserInfo();
        form.custId = userData.custId;
        form.account = obj.account;
        form.startDate = obj.startDate.split("/").join('');
        form.endDate = obj.endDate.split("/").join('');
        form.paginator = obj.paginator;
        return this.send(form).then(
            (resObj) => {
                this.returnData = [resObj.header['responseTime']];
                let check_obj = this.checkObjectList(resObj.body, 'details.detail');
                // if (!!resObj.body['details'] && !!resObj.body['details']['detail']) {
                if (typeof check_obj !== 'undefined') {
                    //[時間,黃金存摺清單查詢內容]
                    this.returnData.push(this.modifyTransArray(resObj.body['details']['detail']));
                } else {
                    this.returnData.push(null);
                }
                return Promise.resolve(this.returnData);
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        );




    }



}
