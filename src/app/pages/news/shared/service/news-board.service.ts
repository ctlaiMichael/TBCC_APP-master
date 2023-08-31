/**
 * 最新消息
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
// API
import { FB000501ApiService } from '@api/fb/fb000501/fb000501-api.service';
import { FB000502ApiService } from '@api/fb/fb000502/fb000502-api.service';

@Injectable()
export class NewsBoardService {
    /**
     * 參數處理
     */
    constructor(
        private _logger: Logger
        , private fb000501: FB000501ApiService
        , private fb000502: FB000502ApiService
        , private _formateService: FormateService
    ) { }


    /**
     * 最新消息列表
     * @param page 頁次
     * @param sort 排序
     */
    getData(page?: number, sort?: Array<any>): Promise<any> {

        return this.fb000501.getData(page, sort).then(
            (output) => {
                return Promise.resolve(output);
            },
            (error_obj) => {
                return Promise.reject(error_obj);
            }
        );


    }

    /**
     * 內文資料
     * @param id 最新消息編號
     * @param other_data 其他資料
     */
    getContent(id: string, other_data?: object): Promise<any> {
        let output = {
            status: false,
            msg: '',
            id: id,
            data: {
                newsSubject: ''
                , newsBody: ''
                , applyDateTime: ''
                , expireDateTime: ''
                , image: ''
                , fileType: ''
            }
        };
        if (id == '') {
            output['msg'] = 'ERROR.DATA_FORMAT_ERROR';
            return Promise.reject(output);
        }

        if (typeof other_data !== 'undefined') {
            output.data.newsBody = this._formateService.checkField(other_data, 'newsBody');
            output.data.newsSubject = this._formateService.checkField(other_data, 'newsSubject');
            output.data.applyDateTime = this._formateService.checkField(other_data, 'applyDateTime');
            output.data.expireDateTime = this._formateService.checkField(other_data, 'expireDateTime');
        }
        if (output.data.newsSubject == '' && output.data.newsBody == '') {
            output['msg'] = 'ERROR.EMPTY';
            return Promise.reject(output);
        }
        if (typeof output.data.newsBody != 'string') {
            output.data.newsBody = '';
        }
        if (output.data.newsBody != '') {
            output.data.newsBody = output.data.newsBody.replace(/\n/g, '<br/>');
        }


        output.status = true;
        output.msg = '';
        return Promise.resolve(output);
        // 目前不確定是否要發電文取得內容，暫時先不取得，減少中台連線
        // return this.fb000502.getData(id);
    }

}


