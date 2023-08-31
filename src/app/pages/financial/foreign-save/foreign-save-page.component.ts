/**
 * 外幣放款利率
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { ForeignSaveService } from '@pages/financial/shared/service/foreignSave.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
@Component({
    selector: 'app-foreign-save-page',
    templateUrl: './foreign-save-page.component.html',
    styleUrls: [],
    providers: [ForeignSaveService]
})
export class ForeignSavePageComponent implements OnInit {
    /**
     * 參數
     */

    @Input() searchExchangeFlag;   //從外匯 綜存轉綜定頁面導過來 
    @Output() backExchange: EventEmitter<any> = new EventEmitter<any>();    //傳回外匯
    private _defaultHeaderOption: any;
    info_data: any = {};    // 所有電文資料
    data = [];              // 整理好呈現之資料

    dataTime = '';  // 電文回傳資料時間
    searchTime = ''; // 查詢時間
    showData = false;   // 查詢有無資料
    detailFlag = false;   // 切換至內容頁
    detailData = {};      // 傳送內容
    constructor(
        private _logger: Logger
        , private _mainService: ForeignSaveService
        , private _handleError: HandleErrorService
        , private navgator: NavgatorService
        , private _headerCtrl: HeaderCtrlService
    ) { }

    ngOnInit() {
        this._defaultHeaderOption = this.navgator.getHeader();
        this._headerCtrl.setLeftBtnClick(() => {
            if (this.searchExchangeFlag && this.searchExchangeFlag == 'search') {
                this.backExchange.emit({ type: 'exchange', value: true });
            } else {
                this.navgator.push('financial', {});
            }
        });
        this.getData().then(
            () => {
                this.navgator.pageInitEnd(); // 取得資料後顯示頁面
                // this._logger.step('Financial', 'data', this.data);
            },
            () => {
                this.showData = false;
                this.navgator.pageInitEnd(); // 取得資料後顯示頁面
            }
        );
    }



    public goDetails(i) {
        this.detailFlag = true;

        this.detailData = {
            'searchTime': this.searchTime,
            'currency': this.data[i].currency,
            'currName': this.data[i].currName,
            'currentRate': this.data[i].currentRate,
            'weekRate': this.data[i].weekRate,
            'oneMonRate': this.data[i].oneMonRate,
            'trdMonRate': this.data[i].trdMonRate,
            'sixMonRate': this.data[i].sixMonRate,
            'ninMonRate': this.data[i].ninMonRate,
            'yearRate': this.data[i].yearRate,
            'object': this.data[i]
        };
    }

    private getData(): Promise<any> {
        return this._mainService.getData().then(
            (result) => {
                this.info_data = result.info_data;
                this.dataTime = result.dataTime;
                this.searchTime = result.searchTime;
                this.data = result.data;
                this.showData = true;
                return Promise.resolve();
            }
            , (errorObj) => {
                this.showData = false;
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
                return Promise.reject(errorObj);
            }
        );

    }

    /**
     * 子層返回事件
     * @param e
     */
    onBackPage(e) {
        this.detailFlag = (this.detailFlag) ? false : true;
        this._headerCtrl.updateOption(this._defaultHeaderOption);

        this._headerCtrl.setLeftBtnClick(() => {
            if (this.searchExchangeFlag && this.searchExchangeFlag == 'search') {
                    this.backExchange.emit({ type: 'exchange', value: true });
            } else {
                this.navgator.push('financial', {});
            }
        });
    }
}
