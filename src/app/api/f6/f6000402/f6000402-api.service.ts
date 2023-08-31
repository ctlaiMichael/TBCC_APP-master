// F6000402:外幣綜定存中途解約明細查詢
import { Injectable } from '@angular/core';
import { F6000402ResBody } from './f6000402-res';
import { F6000402ReqBody } from './f6000402-req';


import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class F6000402ApiService extends ApiBase<F6000402ReqBody, F6000402ResBody> {
    constructor(
        public telegram: TelegramService<F6000402ResBody>,
        public errorHandler: HandleErrorService,
        public authService: AuthService,
    ) {
        super(telegram, errorHandler, 'F6000402');
    }

    /**
     *
     * @param page 查詢頁數
     * @param sort 排序 ['排序欄位', 'ASC|DESC']
     */
    getData(selectedItem): Promise<any> {
        // 參數處理
        let data: F6000402ReqBody = new F6000402ReqBody();
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty("custId") || userData.custId == '') {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        data.custId = userData.custId; // user info;
        if (!selectedItem.hasOwnProperty("account") || !selectedItem.hasOwnProperty("mBAccNo")) {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        data.account = selectedItem.account; // account info;
        data.mBAccNo = selectedItem.mBAccNo; // mBAccNo info;

        return this.send(data).then(
            (resObj) => {
                let output = {
                    status: false,
                    msg: 'Error',
                    info_data: {},
                };
                let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
                if(jsonObj.hasOwnProperty('trnsToken')){
                    output.info_data = jsonObj;
                    output.msg = '';
                    output.status = true;
                }else{
                    return Promise.reject(output);
                }
               

                return Promise.resolve(output);
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        );
    }



}
