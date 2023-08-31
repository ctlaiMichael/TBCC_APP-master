import { Injectable } from '@angular/core';
import { F6000101ResBody } from './f6000101-res';
import { F6000101ReqBody } from './f6000101-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class F6000101ApiService extends ApiBase<F6000101ReqBody, F6000101ResBody> {
    constructor(public telegram: TelegramService<F6000101ResBody>,
        public errorHandler: HandleErrorService,
        private authService: AuthService) {
        super(telegram, errorHandler, 'F6000101');
      }
    /**
     * F6000101-約定轉出綜存帳號查詢
     */
    send(data: F6000101ReqBody): Promise<any> {
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty("custId") || userData.custId == '') {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        data.custId = userData.custId;
        return super.send(data).then(
            (resObj) => {
                let output = {
                    status: false,
                    msg: 'Error',
                    info_data: {},
                    trnsOutAccts: [],
                    trnsInAccts: [],
                    commonTrnsInAccts: []
                };

                let telegram = (resObj.hasOwnProperty('body')) ? resObj.body : {};

                if (typeof telegram['trnsOutAccts'] !== 'undefined' && !!telegram['trnsOutAccts']['trnsOutAcct']) {
                    output.status = true;
                    output.msg = '';
                    output.info_data = telegram;
                    output.trnsOutAccts = this.checkObjectList(telegram, 'trnsOutAccts.trnsOutAcct');
                    output.trnsOutAccts = this.modifyTransArray(output.trnsOutAccts);
                    return Promise.resolve(output);
                } else {
                    output.msg = '你未設定綜存帳號，尚無法執行本項交易，欲設定綜存帳號，請洽本行營業單位辦理';
                    return Promise.reject(output);
                }
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        );
    }
}
