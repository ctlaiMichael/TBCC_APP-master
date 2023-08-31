/**
 * 當日匯入款項-明細列表
 * (單頁)
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { DayRemittanceService } from '@pages/deposit/shared/service/day-remittance.service';
import { FormateService } from '@shared/formate/formate.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';

@Component({
    selector: 'app-day-remit-detail-paginator',
    templateUrl: './day-remit-detail-paginator.component.html',
    providers: [DayRemittanceService]
})
export class DayRemitDetailPaginatorComponent implements OnInit {
    /**
     * 參數處理
     */
    @Input() page: string | number = 1;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    data: any;
    @Input() acctObj: object;
    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private _mainService: DayRemittanceService
        , private _headerCtrl: HeaderCtrlService
        , private navgator: NavgatorService
    ) { 

    // --- 頁面設定 End ---- //
    }

    ngOnInit() {
        if (typeof this.page === 'undefined') {
            this.page = 1;
        } else {
            this.page = parseInt(this.page.toString());
        }
        let reqObj = {
            'account': this.acctObj['account']
        };
        this._mainService.getDetailData(reqObj, this.page).then(
            (result) => {
                this.data = result.data;
                this.onBackPageData(result);
            },
            (errorObj) => {
                this.onErrorBackEvent(errorObj);
            }
        );

    }

    /**
     * 重新設定page data
     * @param item
     */
    onBackPageData(item) {
        let output = {
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
    onErrorBackEvent(error_obj) {
        let output = {
            'page': 'list-item',
            'type': 'error',
            'data': error_obj
        };

        this.errorPageEmit.emit(output);
    }
}

