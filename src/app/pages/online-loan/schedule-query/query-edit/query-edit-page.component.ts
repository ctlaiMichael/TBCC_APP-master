/**
 * 進度查詢-編輯頁
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FormateService } from '@shared/formate/formate.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { ScheduleQueryService } from '@pages/online-loan/shared/service/schedule-query.service';

@Component({
    selector: 'app-query-edit',
    templateUrl: './query-edit-page.component.html',
    styleUrls: [],
    providers: [ScheduleQueryService]
})

export class QueryEditPageComponent implements OnInit {
    @Input() page: string | number = 1;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    nowPage = 'query1Page';
    reqData = {
        // "custId": "",
        "caseStatus": ""
    };
    queryInfo = {};
    queryData = [];

    constructor(
        private _logger: Logger
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private _formateService: FormateService
        , private navgator: NavgatorService
        , private alert: AlertService
        , private _mainService: ScheduleQueryService
    ) { }

    ngOnInit() {
        this._logger.error("into query1!");
        if (typeof this.page === 'undefined') {
            this.page = 1;
        } else {
            this.page = parseInt(this.page.toString(), 10);
        }
        this._mainService.getQuery(this.reqData, this.page).then(
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

    /**
 * 重新設定page data
 * @param item
 */
    onBackPageData(item) {
        const output = {
            'page': 'list-item',
            'type': 'page_info',
            'data': item
        };
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
        switch (page) {
            case 'query-edit':
                output.page = page;
                break;
        }
        this.errorPageEmit.emit(output);
    }
}