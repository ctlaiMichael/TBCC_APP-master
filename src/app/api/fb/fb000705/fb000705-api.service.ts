/**
 * FB000705:黃金存摺、扣款帳號與存入帳號清單查詢
 * req-queryType
 * 1:黃金交易明細查詢(僅查黃金存摺帳號)
 * 2:黃金買進(轉出=台幣帳號，轉入=黃金存摺帳號)
 * 3:黃金回售(轉出=黃金存摺帳號，轉入=台幣帳號)
 * 4:黃金定期定額買進(轉出=台幣帳號，轉入=黃金存摺帳號)
 */
import { Injectable } from '@angular/core';
import { FB000705ResBody } from './fb000705-res';
import { FB000705ReqBody } from './fb000705-req';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { TelegramOption } from '@core/telegram/telegram-option';

@Injectable()
export class FB000705ApiService extends ApiBase<FB000705ReqBody, FB000705ResBody> {
    constructor(
        public telegram: TelegramService<FB000705ResBody>,
        public errorHandler: HandleErrorService,
        public authService: AuthService,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'FB000705');
    }
    returnData;
    getData(obj): Promise<any> {
        // 黃金存摺
        const form = new FB000705ReqBody();
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty('custId') || userData.custId == '') {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        form.custId = userData.custId;
        form.queryType = obj.queryType;
        return this.send(form).then(
            (resObj) => {
                if (!!resObj.body['queryType'] &&
                   (resObj.body['queryType'] === '2' ||
                    resObj.body['queryType'] === '3' ||
                    resObj.body['queryType'] === '4')) {
                    if (!!resObj.body && !!resObj.body.trnsfrAccts && !!resObj.body.trnsfrAccts.detail) {
                      resObj.body.trnsfrAccts.detail = this.modifyTransArray(resObj.body.trnsfrAccts.detail);
                    }
                    if (!!resObj.body && !!resObj.body.goldAccts && !!resObj.body.goldAccts.detail) {
                      resObj.body.goldAccts.detail = this.modifyTransArray(resObj.body.goldAccts.detail);
                    }
                    return Promise.resolve(resObj);
                }
                if (!!resObj.body['goldAccts']['detail']) {
                    // [時間,黃金帳戶清單內容]
                    this.returnData = [resObj.header['responseTime'], this.modifyTransArray(resObj.body['goldAccts']['detail'])];
                    // 轉帳帳號
                    if (!!resObj.body['queryType'] && resObj.body['queryType'] !== '1' && !!resObj.body['trnsfrAccts']['detail']) {
                        this.returnData.push(this.modifyTransArray(resObj.body['trnsfrAccts']['detail']));
                    }
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
