// F2000402-當日匯入匯款明細查詢
import { Injectable } from '@angular/core';
import { F2000402ResBody } from './f2000402-res';
import { F2000402ReqBody } from './f2000402-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
@Injectable()
export class F2000402ApiService extends ApiBase<F2000402ReqBody, F2000402ResBody> {
    constructor(
        public telegram: TelegramService<F2000402ResBody>,
        public authService: AuthService,
        public errorHandler: HandleErrorService,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'F2000402');
    }

    /**
     *
     * @param page 查詢頁數
     * @param sort 排序 ['排序欄位', 'ASC|DESC']
     */
    getPageData(req: object, page?: number, sort?: Array<any>): Promise<any> {
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty('custId') || userData.custId == '') {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        // 參數處理
        let data: F2000402ReqBody = new F2000402ReqBody();
        // data.paginator = this.modifyPageReq(data.paginator, page, sort);
        data.paginator = this.modifyPageReq(data.paginator, page, sort);
        data.custId = userData.custId; // user info;
        data.account = this._formateService.checkField(req, 'account'); // 從api F2000101取得

        data.paginator = this.modifyPageReq(data.paginator, page, sort);
        if (data.account == '') {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }


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
                        dataTime: output.dataTime
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
            page_info: {},
        };
        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        let jsonHeader = (resObj.hasOwnProperty('header')) ? resObj['header'] : {};
        output.dataTime = this._formateService.checkField(jsonHeader, 'responseTime');
        output.info_data = this._formateService.transClone(jsonObj);
        let check_obj = this.checkObjectList(jsonObj, 'details.detail');
        if (typeof check_obj !== 'undefined') {
            output.data = this.modifyTransArray(jsonObj['details']['detail']);
            output.data.forEach(function (item) {
                item.queryTime = item.importDate + item.importTime;
            });

            delete output.info_data['details'];
        }

        output.page_info = this.pagecounter(jsonObj);

        return output;
    }

    //         let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};

    //         output.info_data = jsonObj;

    //         if (jsonObj.hasOwnProperty('details') && jsonObj['details']
    //             && jsonObj['details'].hasOwnProperty('detail')
    //         ) {
    //             output.data = this.modifyTransArray(jsonObj.details['detail']);
    //         }

    //         if (output.data.length <= 0) {
    //             return Promise.reject({
    //                 title: 'ERROR.TITLE',
    //                 content: 'ERROR.EMPTY'
    //             });
    //         }

    //         let telegramHeader = (resObj.hasOwnProperty('header')) ? resObj.header : {};
    //         if (telegramHeader.hasOwnProperty('requestTime')) {
    //             output.requestTime = (telegramHeader.requestTime).replace(/-/g, "").replace(/T/g, "").replace(/:/g, "").substring(0, 14);
    //         }
    //         output.status = true;
    //         output.msg = '';

    //         output.page_info = this.pagecounter(jsonObj);
    //         output.totalPages = output.page_info['totalPages'];

    //         return Promise.resolve(output);
    //     },
    //     (errorObj) => {

    //         return Promise.reject(errorObj);
    //     }
    // );
    // }



}
