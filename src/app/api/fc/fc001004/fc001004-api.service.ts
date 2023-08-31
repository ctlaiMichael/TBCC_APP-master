/**
 * FC001004-額度調整
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';
import { Logger } from '@core/system/logger/logger.service';
import { FC001004ReqBody } from './fc001004-req';
import { FC001004ResBody } from './fc001004-res';

@Injectable()
export class FC001004ApiService extends ApiBase<FC001004ReqBody, FC001004ResBody> {

    constructor(public telegram: TelegramService<FC001004ResBody>,
        public errorHandler: HandleErrorService
        , private authService: AuthService
        , private _formateService: FormateService
        , private _logger: Logger
    ) {
        super(telegram, errorHandler, 'FC001004');
    }

    /**
     * 取得額度調整資訊
     * @param set_data 參數
     */
    getData(set_data?: Object): Promise<any> {
        // 參數處理
        let data: FC001004ReqBody = new FC001004ReqBody();
        data.custId = set_data['custId'];
        data.cardAccount = set_data['cardAccount'];
        data.applyType = set_data['applyType'];
        data.applyDate = set_data['applyDate'];
        data.endDate = set_data['endDate'];
        data.applyAmount = set_data['applyAmount'];
        data.applyReason = set_data['applyReason'];
        data.cellPhone = set_data['cellPhone'];
        data.cityPhone = set_data['cityPhone'];
        this._logger.log("fc001004 send data:", data);
        return this.send(data).then(
            (resObj) => {
                let output = {
                    status: false,
                    msg: '',
                    info_data: {},
                    excError: true //其他例外使用，false為有錯誤 ex: respCode!=4001 、 result==1 
                };
                this._logger.log("resObj:", resObj);
                let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
                this._logger.log("jsonObj:", jsonObj);
                output.info_data = jsonObj;
                //api規格不會回details
                output.status = true;
                output.msg = '';
                //409如果respCode不是4001，雖然成功，但要導失敗 , result == '1'(失敗)
                if (jsonObj.respCode != '4001' || jsonObj.result != '0') {
                    output.excError = false; //其他例外錯誤
                    return Promise.resolve(output);
                } else {
                    output.excError = true; //無其他例外錯誤
                    return Promise.resolve(output);
                }
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        );
    }
}
