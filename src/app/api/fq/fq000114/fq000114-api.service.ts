import { Injectable } from '@angular/core';
import { FQ000114ReqBody } from './fq000114-req';
import { FQ000114ResBody } from './fq000114-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FQ000114ApiService extends ApiBase<FQ000114ReqBody, FQ000114ResBody> {

    constructor(
        public telegram: TelegramService<FQ000114ResBody>,
        public errorHandler: HandleErrorService,
        public authService: AuthService
    ) {
        super(telegram, errorHandler, 'FQ000114');
    }
    getReqBody() {
        // 參數處理
        let data: FQ000114ReqBody = new FQ000114ReqBody();
        // data.paginator = this.modifyPageReq(data.paginator, page, sort);
        const userData = this.authService.getUserInfo();
        if (userData.hasOwnProperty('custId') && userData.custId != '') {
            data.custId = userData.custId; // user info;
        }
        return data;
    }
    
}



