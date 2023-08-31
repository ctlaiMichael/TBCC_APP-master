/**
 * FC001001-信用卡本期帳單查詢電文
 * [Response]
 *      result	結果 (0-成功, 1-表示失敗)
 *      respCode	電文回應代碼
 *      respCodeMsg	電文代碼說明
 *      payableAmt	本期應繳金額
 *      lowestPayableAmt	本期最低應繳金額
 *      maxInstallmentAmt	分期金額上限
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FC001001ReqBody } from './fc001001-req';
import { FC001001ResBody } from './fc001001-res';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { TelegramOption } from '@core/telegram/telegram-option';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';
import { CardApiUtil } from '@api/modify/card-api-util'; // 信用卡專區整理結果

@Injectable()
export class FC001001ApiService extends ApiBase<FC001001ReqBody, FC001001ResBody> {

    constructor(public telegram: TelegramService<FC001001ResBody>,
        public errorHandler: HandleErrorService
        , private authService: AuthService
        , private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'FC001001');
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
        let data: FC001001ReqBody = new FC001001ReqBody();
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty('custId') || userData.custId == '') {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        data.custId = userData.custId; // user info;
        data.appInputFlag = this._formateService.checkField(set_data, 'appInputFlag');
        data.paginator = this.modifyPageReq(data.paginator);

        let pSize = this._formateService.checkField(set_data, 'pageSize');
        if (!!pSize && pSize !== '') {
            data.paginator.pageSize = pSize;
        }

        return this.send(data, option).then(
            (resObj) => {
                const output = {
                    status: false,
                    msg: 'ERROR.DEFAULT',
                    info_data: {},
                    dataTime: '',
                    page_info: {},
                    data: []
                };
                const jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
                const modify_data = this._modifyRespose(jsonObj);
                output.data = modify_data.data;
                output.info_data = modify_data.info_data;
                output.page_info = this.pagecounter(jsonObj);
                if (output.data.length <= 0) {
                    output.msg = 'ERROR.EMPTY';
                    return Promise.reject(output);
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
    /**
   * Response整理
   * @param jsonObj 資料判斷
   */
    private _modifyRespose(jsonObj) {
        const output = {
            info_data: {},
            data: []
        };
        output.info_data = this._formateService.transClone(jsonObj);
        let check_obj = this.checkObjectList(jsonObj, 'details.detail');
        if (typeof check_obj !== 'undefined') {
            output.data = this.modifyTransArray(check_obj);
            output.data.forEach(element => {
                element['cost'] = parseInt(element['cost']);
            });
            delete output.info_data['details'];
        }
        return output;
    }
}
