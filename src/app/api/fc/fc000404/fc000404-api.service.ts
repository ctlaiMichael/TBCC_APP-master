/**
 * FC000404-信用卡專區超商繳信卡費
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FC000404ReqBody } from './fc000404-req';
import { FC000404ResBody } from './fc000404-res';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { TelegramOption } from '@core/telegram/telegram-option';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';
import { CardApiUtil } from '@api/modify/card-api-util'; // 信用卡專區整理結果
import { logger } from '@shared/util/log-util';

@Injectable()
export class FC000404ApiService extends ApiBase<FC000404ReqBody, FC000404ResBody> {

    constructor(public telegram: TelegramService<FC000404ResBody>,
        public errorHandler: HandleErrorService
        , private authService: AuthService
        , private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'FC000404');
    }

    /**
     * 取得帳單資料
     * @param set_data 參數
     * @param background 採取非同步取得
     */
    getData(set_data?: Object, background?: boolean): Promise<any> {
        // 參數處理
        let option: TelegramOption = new TelegramOption();
        if (background === true) {
            option.background = true;
        }
        let data: FC000404ReqBody = new FC000404ReqBody();
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty('custId') || userData.custId == '') {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        if(set_data.hasOwnProperty('amount')){
            let amount=parseInt(set_data['amount']).toString();
            data.amount=amount;
        }else{
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: '金額不能為空'
            });
        }
        data.custId = userData.custId; // user info;

        return this.send(data).then(
            (resObj) => {
                let output = {
                    status: false,
                    msg: '',
                    cardBarcode: ''
                };
                let modify_data = CardApiUtil.modifyResponse(resObj);
                if (!modify_data.status) {
                    return Promise.reject({
                        title: 'ERROR.TITLE',
                        content: modify_data.msg,
                        resultCode: modify_data.resultCode
                    });
                }
                let jsonObj = modify_data.body;

                output.cardBarcode = this._formateService.checkField(jsonObj, 'cardBarcode');
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
