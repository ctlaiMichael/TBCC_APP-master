/**
 * 外幣匯率(即期)
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { ExchangeService } from '@pages/financial/shared/service/exchange.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
@Component({
    selector: 'app-exchange-page',
    templateUrl: './exchange-page.component.html',
    styleUrls: [],
    providers: [ExchangeService]
})
export class ExchangePageComponent implements OnInit {
    /**
     * 參數處理
     */

    @Input() searchExchangeFlag: string;   //從外匯 台外轉頁面導過來 
    @Output() backExchange: EventEmitter<any> = new EventEmitter<any>();    //傳回外匯

    private _defaultHeaderOption: any; // header setting暫存
    showData = false;
    bookmarkData = []; // 頁籤資料
    info_data: any = {};
    data = []; // getdata回傳資料
    dataTime: any;
    popShow = false;
    nowPageType = '';
    active_menu: any = {
        id: '',
        name: '',
        menu: {
            left: '', center: '', right: ''
        },
        data_key: {
            left: '', center: '', right: ''
        }
    };
    new_table = [];   //給popup
    choosebaseCurrency = {
        name: 'TWD',
        currencyName: '',
        buyRate: '1'
    }; //popup選擇完後的基礎幣別
    hasPap: boolean; // 是否有父層
    nightType = false;

    constructor(
        private _mainService: ExchangeService
        , private _logger: Logger
        , private _headerCtrl: HeaderCtrlService
        , private navgator: NavgatorService
        , private _handleError: HandleErrorService
    ) { }

    ngOnInit() {

        if (typeof this.searchExchangeFlag != 'undefined' && this.searchExchangeFlag !== '') {
            this.hasPap = true;
            this._headerCtrl.updateOption({
                'title': 'FUNC_SUB.FINANCIAL.FOREX' //外幣匯率
            });
        } else {
            this.hasPap = false;
        }

        this.bookmarkData = this._mainService.getMenuData();
        this.getData().then(
            () => {
                this.navgator.pageInitEnd(); // 取得資料後顯示頁面
            },
            () => {
                this.navgator.pageInitEnd(); // 取得資料後顯示頁面
            }
        );
        this._defaultHeaderOption = this.navgator.getHeader();

    }

    /**
     * 打開popup
     */
    popOpen(e) {
        this.new_table = e;
        this.popShow = true;
    };
    /**
     * Popup選擇完
     * @param e 
     */
    chooseOver(e) {
        this.popShow = false;
        this.choosebaseCurrency = e.baseCurrency;
    };


    /**
     * 頁籤回傳
     * @param e
     */
    onBookMarkBack(e) {
        this._logger.step('Deposit', 'onBookMarkBack', e);
        let page = '';
        let set_data: any;
        let set_id: any;
        if (typeof e === 'object') {
            if (e.hasOwnProperty('page')) {
                page = e.page;
            }
            if (e.hasOwnProperty('data')) {
                set_data = e.data;
                if (set_data.hasOwnProperty('id')) {
                    set_id = set_data.id;
                }
            }
        }
        this.active_menu = set_data;
        this.onChangePage(set_id, set_data);
    }

    /**
    * 頁面切換
    * @param pageType 頁面切換判斷參數
    *        'spot' : 即期
    *        'cash' : 現鈔
    *        'count' : 匯率試算
    * @param pageData 其他資料
    */
    onChangePage(pageType: string, pageData?: any) {
        this._logger.step('Financial', 'onChangePage', pageType, JSON.stringify(pageData));
        if (pageType === 'content') {
            // 內容頁
            // this.showContent = true;
            // this.acctObj = pageData;
            // this.content_data = pageData;
            // this.navgator.displayCloneBox(true); // 進入內容頁clone start
            // this.showDemandDeposit = pageData['showDemandDeposit'];
        } else {
            // 列表頁
            if (this.hasPap) {
                this._headerCtrl.setLeftBtnClick(() => {
                    this.backExchange.emit({});
                });
            } else {
                // 從到價通知設定返回，左側按鈕返回金融資訊
                if (this.navgator.getHistory()[this.navgator.getHistoryLength() - 2] == 'rate-inform') {
                    this._headerCtrl.setLeftBtnClick(() => {
                        this.navgator.push('financial');
                    })
                } else {
                    this._logger.debug(`exchange page set leftBtnClick = _defaultHeaderOption`);
                this._headerCtrl.updateOption(this._defaultHeaderOption);
        }
            }
        }
        this.nowPageType = pageType;
    }


    /**
     * 查即期匯率
     */
    private getData(reget?: boolean): Promise<any> {
        let set_data = {};
        let option = {
            background: false,
            reget: (reget) ? true : false
        };
        return this._mainService.getData(set_data, option).then(
            (result) => {
                this.info_data = result.info_data;
                this.nightType = this.getNightType(result.dataTime);
                //此處用於隱藏無值時
                result.data.forEach(element => {
                    if((isNaN(parseFloat(element.cashBuy)) && isNaN(parseFloat(element.cashSell)))
                        || (parseFloat(element.cashBuy)==0 && parseFloat(element.cashSell)==0)){
                        element.cashFlag=true;

                    } else if(this.nightType && !this.isNightCurrency(element.currency)) {
                        element.cashFlag=true;

                    } else{
                        element.cashFlag=false;
                    }
                    if((isNaN(parseFloat(element.spotBuy)) && isNaN(parseFloat(element.spotSell)))
                    || (parseFloat(element.spotBuy)==0 && parseFloat(element.spotSell)==0)){
                        element.spotFlag=true;
                    }else{
                        element.spotFlag=false;
                    }
                });
                this.data = result.data;
                this.dataTime = result.dataTime;
                this.showData = true;
                return Promise.resolve();
            },
            (errorObj) => {
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
                return Promise.reject(errorObj);
            }
        );
    }

    private getNightType(dateTime: string) {
        const now = new Date(dateTime);
        const nightTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 45, 0, 0);
        return (now > nightTime);
    }

    private isNightCurrency(currency: string) {
        return (currency === "USD" || currency === "JPY");
    }
    goRateInform() {
        this.navgator.push('rate-inform');
    }
}
