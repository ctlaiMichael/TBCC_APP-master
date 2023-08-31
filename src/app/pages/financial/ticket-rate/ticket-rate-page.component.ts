/**
 * 票券利率
 */
import { Component, OnInit } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { TicketRateService } from '@pages/financial/shared/service/ticketRate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
@Component({
    selector: 'app-ticket-rate-page',
    templateUrl: './ticket-rate-page.component.html',
    styleUrls: [],
    providers: [TicketRateService]
})
export class TicketRatePageComponent implements OnInit {
    /**
     * 參數處理
     */
    dataTime = ''; // 牌告時間
    showData = false; // 是否顯示資料
    menu_data = []; // menu
    bookmarkData = []; // 頁籤資料
    active_menu: any = {
        id: '',
        name: '',
        menu: { left: '', right: '' },
        data_key: { left: '', right: '' }
    }; // 顯示類別
    data = []; // show data
    info_data: any = {};    // 電文回傳所有資料
    tel = {
        'name': '',
        'show_tel': '',
        'tel': ''
    };

    constructor(
        private _mainService: TicketRateService
        , private _logger: Logger
        , private _handleError: HandleErrorService
        , private navgator: NavgatorService
    ) { }

    ngOnInit() {
        this.tel = this._mainService.getTel();
        this.bookmarkData = this._mainService.getMenuData();
        // this.onMenuEvent(this.menu_data[0]);
        this._mainService.getData().then(
            (result) => {
                // success
                // this._logger.step('Financial', 'getData', result);
                this.info_data = result.info_data;
                this.dataTime = result.dataTime;
                this.showData = true;
                this.data = result.data;
                // this._logger.step('Financial', 'data', this.data);
                this.navgator.pageInitEnd(); // 取得資料後顯示頁面
            },
            (errorObj) => {
                this.showData = false;
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
                this.navgator.pageInitEnd(); // 取得資料後顯示頁面
            }
        );
    }

    /**
     * 頁籤回傳
     * @param e
     */
    onBookMarkBack(e) {
        this._logger.step('Deposit', 'onBookMarkBack', e);
        let page = '';
        let set_data: any;
        let set_id: any = {
            id: '',
            name: '',
            menu: { left: '', right: '' },
            data_key: { left: '', right: '' }
        };
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
    }



}
