/**
 * 台幣定期存款
 */
import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { DepositInquiryDetailService } from '@pages/deposit/shared/service/deposit-inquiry-detail.service';
import { NavgatorService } from '@core/navgator/navgator.service';

@Component({
    selector: 'app-time-deposit',
    templateUrl: './time-deposit.component.html',
    styleUrls: ['./time-deposit.component.css'],
    providers: []
})
export class TimeDepositComponent implements OnInit, AfterViewInit {
    /**
	 * 參數處理
	 */
    @Input() public acctObj;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    showCurrency = ''; // 若只顯示為TWD(無小數)，請加上'TWD'
    // 取得回傳電文資料
    data: any;
    info_data = {};
    dataTime = '';
    showData = true;

    constructor(
        private _logger: Logger
        , private _headerCtrl: HeaderCtrlService
        , private _handleError: HandleErrorService
        , private navgator: NavgatorService
        , private _mainService: DepositInquiryDetailService
    ) {
    }

    ngOnInit() {
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back'
        });
        this._headerCtrl.setLeftBtnClick(() => {
            this.onBackPageData();
        });
        this._initEvent();
    }

    ngAfterViewInit() {
        this._mainService.getTimeDepoist(this.acctObj).then(
            (result) => {
                this.showData = true;
                this.data = result.data;
                this.info_data = result.info_data;
                this.dataTime = result.dataTime;
                this.navgator.pageInitEnd(); // 取得資料後顯示頁面
            },
            (errorObj) => {
                this.showData = false;
                this._logger.error('getTimeDepoist get error', errorObj);
                this.navgator.pageInitEnd(); // 取得資料後顯示頁面
            }
        );

    }



    onBackPageData(item?: any) {

        // 返回最新消息選單
        let output = {
            'page': 'deposit-time',
            'type': 'back',
            'data': item
        };
        this.backPageEmit.emit(output);
    }

    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------
    private _initEvent() {

    }

}

