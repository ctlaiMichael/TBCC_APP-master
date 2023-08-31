/**
 * 停損停利設定確認
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { FundBalanceSetService } from '../shared/service/fund-balance-set.service';
import { AlertService } from '@shared/popup/alert/alert.service';

@Component({
    selector: 'app-fund-balance-set-result',
    templateUrl: './fund-balance-set-result.component.html',
    providers: [FundBalanceSetService]
})
export class FundBalanceSetResultComponent implements OnInit {
    /**
     * 參數處理
     */
    @Input() setData: any;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    info_data: any = {};
    data: any = [];
    showData = false;
    resTitle = '';
    trnsRsltCode = '';
    mappingData = []; //處理過的結果資料

    processing = true; //處理中
    sucess = false; //交易成功
    failed = false; //交易失敗

    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private navgator: NavgatorService
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private _mainService: FundBalanceSetService
        , private alert: AlertService
    ) {
    }


    ngOnInit() {
        this._initEvent();
        this._logger.step('FUND', this.setData);
        this._mainService.getBalanceResult(this.setData).then(
            (result) => {
                this.processing = false;
                this.sucess = true;
                this.failed = false;
                this.info_data = result.info_data;
                this.data = result.data;
                this._logger.log("resultPage data:",this.data);
                //處理結果頁資料，畫面顯示用
                this.mappingData = this._mainService.mappingResult(this.data);
                this._logger.log("mappingData:",this.mappingData);
                this.resTitle = result.title;
                this.trnsRsltCode = result.trnsRsltCode;
                if(this.info_data['trnsRsltCode'] == '1' || this.info_data['trnsRsltCode'] == 'X') {
                    this.sucess = false;
                    this.failed = true;
                }
                // this._logger.step('FUND', this.info_data);
                // this._logger.step('FUND', this.data);
            },
            (errorObj) => {
                this._handleError.handleError(errorObj);
                this.navgator.push('fund');
            }
        );
    }

    //點擊確認
    onConfirmEnd() {
        this.navgator.push('fund');
    }

    //交易失敗，回網銀
    onHome() {
        this.navgator.push('home');
    }

    //啟動事件
    _initEvent() {
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': '停損/獲利點設定注意事項'
        });
        this._headerCtrl.setLeftBtnClick(() => {
            this.navgator.push('fund');
        });
    }
}

