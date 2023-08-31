/**
 * 進度查詢-編輯頁
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { CardMainUploadService } from '@pages/card/shared/service/card-main-upload/card-main-upload.service';

@Component({
    selector: 'app-card-main-upload-query',
    templateUrl: './card-main-upload-query.component.html',
    styleUrls: [],
    providers: []
})

export class CardMainUploadQueryComponent implements OnInit {
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    nowPage = 'query1Page';
    reqData = {
        "custId": "",
        "type": "" //0:狀態全查 1:補件上傳
    };
    queryInfo = {};
    queryData = [];

    constructor(
        private _logger: Logger
        , private _queryService: CardMainUploadService
        , private _headerCtrl: HeaderCtrlService
    ) { }

    ngOnInit() {
        this._logger.error("into query component!");
        this.reqData['type'] = '1'; //補件上傳
        this._logger.log("reqData:",this.reqData);

        this._headerCtrl.setLeftBtnClick(() => {
            this.onBackPageData({},'searchPage','back');
        });

        this._queryService.getQuery(this.reqData).then(
            (result) => {
                this.queryInfo = result.info_data;
                this.queryData = result.data;
                this._logger.log("result:", result);
                this._logger.log("queryInfo:", this.queryInfo);
                this._logger.log("queryData:", this.queryData);
                this.onBackPageData(result);
            },
            (errorObj) => {
                this.onErrorBackEvent(errorObj, 'list-item');
                this._logger.log("errorObj:", errorObj);
            }
        );
    }

    //點擊上傳
    onUpload(setData) {
        this.onBackPageData(setData, 'searchPage', 'go');
    }

    /**
 * 重新設定page data
 * @param item
 */
    onBackPageData(item, page?, type?) {
        const output = {
            'page': 'list-item',
            'type': 'page_info',
            'data': item
        };
        if (page == 'searchPage') {
            output.page = page;
            output.type = type;
        }
        this.backPageEmit.emit(output);
    }

    /**
 * 失敗回傳
 * @param error_obj 失敗物件
 */
    onErrorBackEvent(error_obj, page) {
        const output = {
            'page': 'list-item',
            'type': 'error',
            'data': error_obj
        };
        output.page = page;
        // switch (page) {
        //     case 'query-edit':
        //         output.page = page;
        //         break;
        //     default:
        //         output.page = 'list-item';
        //         break;
        // }
        this.errorPageEmit.emit(output);
    }
}