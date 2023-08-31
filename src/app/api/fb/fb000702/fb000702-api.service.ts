
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FB000702ReqBody } from './fb000702-req';
import { FB000702ResBody } from './fb000702-res';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';

@Injectable()
export class FB000702ApiService extends ApiBase<FB000702ReqBody, FB000702ResBody> {

    constructor(public telegram: TelegramService<FB000702ResBody>,
        public authService: AuthService,
        public errorHandler: HandleErrorService) {
        super(telegram, errorHandler, 'FB000702');
    }


    send(data): Promise<any> {
        // 參數處理
        const form = new FB000702ReqBody();
        const userData = this.authService.getUserInfo();
        // if (!userData.hasOwnProperty('custId') || userData.custId == '') {
        //     return Promise.reject({
        //         title: 'ERROR.TITLE',
        //         content: 'ERROR.DATA_FORMAT_ERROR'
        //     });
        // }
        form.queryType = data.queryType;
        form.startDate = data.startDate.split("/").join('');
        form.endDate = data.endDate.split("/").join('');
        return super.send(form).then(
            (resObj) => {
                let output = {
                    status: false,
                    msg: 'Error',
                    resTime: '',
                    info_data: {},
                    data: {
                        details: {
                            detail: []
                        }
                    }
                };

                output.resTime = resObj.header['responseTime'];
                let mytelegram = (resObj.hasOwnProperty('body')) ? resObj.body : {};
                output.status = true;
                output.msg = '';
                if (mytelegram.hasOwnProperty('details')) {
                    output.info_data = mytelegram['details'];
                }
                // if (mytelegram.hasOwnProperty('details') && mytelegram['details'].hasOwnProperty('detail')) {
                //     output.data['details']['detail'] = this.modifyTransArray(mytelegram['details']['detail']);
                // }
                let check_obj = this.checkObjectList(mytelegram, 'details.detail');
                if (typeof check_obj !== 'undefined') {
                    output.data['details']['detail'] = this.modifyTransArray(mytelegram['details']['detail']);
                }
                return Promise.resolve(output);
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        );
    }
}
