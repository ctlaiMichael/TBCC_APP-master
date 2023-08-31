// 存款不足票據查詢
import { Injectable } from '@angular/core';
import { F2000301ResBody } from './f2000301-res';
import { F2000301ReqBody } from './f2000301-req';


import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';

@Injectable()
export class F2000301ApiService extends ApiBase<F2000301ReqBody, F2000301ResBody> {
    constructor(
        public telegram: TelegramService<F2000301ResBody>,
        public authService: AuthService,
        public errorHandler: HandleErrorService,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'F2000301');
    }

    /**
     *
     * @param page 查詢頁數
     * @param sort 排序 ['排序欄位', 'ASC|DESC']
     */
    getPageData(page?: number, sort?: Array<any>): Promise<any> {
        // 參數處理
        let data: F2000301ReqBody = new F2000301ReqBody();
        // data.paginator = this.modifyPageReq(data.paginator, page, sort);
        // data.custId = ''; // user info
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty("custId") || userData.custId == '') {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'

            });
        }
        data.custId = userData.custId; // user info;
        data.paginator = this.modifyPageReq(data.paginator, page, sort);
        return this.send(data).then(

            (resObj) => {
                let output = {
                    status: false,
                    msg: 'ERROR.RSP_FORMATE_ERROR',
                    info_data: {},
                    data: [],
                    page_info: {},
                    totalPages: 1,
                    dataTime: ''
                };
                let modify_data = this._modifyRespose(resObj);
                output.dataTime = modify_data.dataTime;
                output.info_data = modify_data.info_data;
                output.data = modify_data.data;
                output.page_info = modify_data.page_info;
                output.totalPages = output.page_info['totalPages'];

                if (output.data.length <= 0) {
                    return Promise.reject({
                        title: 'ERROR.TITLE',
                        content: 'ERROR.EMPTY',
                        data: output,
                        dataTime: output.dataTime,
                        // from_page: 'insufficient-bill'
                        notice: '本資料來源係根據台灣票據交換所之票據明細，經票交所判讀失敗 或當日臨櫃存入票據無法提供查詢，請向原開戶行洽詢'
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
    private _modifyRespose(resObj) {
        let output = {
            dataTime: '',
            info_data: {},
            data: [],
            page_info: {}
        };
        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        let jsonHeader = (resObj.hasOwnProperty('header')) ? resObj['header'] : {};
        output.dataTime = this._formateService.checkField(jsonHeader, 'responseTime');
        output.info_data = this._formateService.transClone(jsonObj);

        let check_obj = this.checkObjectList(jsonObj, 'details.detail');
        if (typeof check_obj !== 'undefined') {
            output.data = this.modifyTransArray(check_obj);
            delete output.info_data['details'];
        }
        output.page_info = this.pagecounter(jsonObj);

        return output;
    }


}
