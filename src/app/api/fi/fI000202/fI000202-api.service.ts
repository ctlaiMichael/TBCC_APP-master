import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000202ResBody } from './FI000202-res';
import { FI000202ReqBody } from './FI000202-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';


@Injectable()
export class FI000202ApiService extends ApiBase<FI000202ReqBody, FI000202ResBody> {
    constructor(
        public telegram: TelegramService<FI000202ResBody>,
        public errorHandler: HandleErrorService,
        public authService: AuthService,
        private _formateService: FormateService,
        private _logger: Logger
    ) {
        super(telegram, errorHandler, 'FI000202');
    }


	/**
	 * 基金庫存明細
	 * req
	 * 
	 *   
	 *    
	 *   
	 */
    getData(req: object, page?: number, sort?: Array<any>): Promise<any> {
        const userData = this.authService.getUserInfo();

        if (!userData.hasOwnProperty('custId') || userData.custId === '') {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        const data = new FI000202ReqBody();
        data.custId = userData.custId; // user info;

        data.type = this._formateService.checkField(req['type'], 'type'); // 有確定本年度、前年度問題在加
        // data.startDate = this._formateService.checkField(req, 'startDate'); // 當api調整完開啟
        // data.endDate = this._formateService.checkField(req, 'endDate'); // 當api調整完開啟

        if (['1', '2'].indexOf(data.type) < 0
            // 當api調整完開啟
            // || data.startDate == '' || data.endDate == '' 
        ) {
            this._logger.error('DATA_FORMAT_ERROR api req', data, req);
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }

        data.paginator = this.modifyPageReq(data.paginator, page, sort);

        return this.send(data).then(
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
                    return Promise.reject({
                        title: 'ERROR.TITLE',
                        content: 'ERROR.EMPTY'
                    });
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
        if (jsonObj.hasOwnProperty('details') && jsonObj['details']
            && jsonObj['details'].hasOwnProperty('detail')
            && jsonObj['details']['detail']
        ) {
            output.data = this.modifyTransArray(jsonObj['details']['detail']);
            delete output.info_data['details'];
        }

        let tmp_range = this._formateService.checkField(output.info_data, 'queryDuring');
        let tmp_list = tmp_range.split('~');
        let new_range = [];
        tmp_list.forEach((item) => {
            let tmp_date = this._formateService.transChinDate(item, 'yyyy/MM');
            if (!!tmp_date) {
                new_range.push(tmp_date);
            }
        });
        output.info_data['_queryDuring'] = new_range.join('~');

        return output;
    }
}
