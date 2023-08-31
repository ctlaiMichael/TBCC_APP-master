import { Component, OnInit } from '@angular/core';
import { ExchangeService } from '@pages/financial/shared/service/exchange.service';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { DataExchange } from '../shared/Dataexchange';

@Component({
    selector: 'app-foreign-exchange-rate-a11y-page',
    templateUrl: './foreign-exchange-rate-a11y-page.component.html',
    styleUrls: []
})
export class ForeignExchangeRateA11yPageComponent implements OnInit {
    obj = {
        style: 'normal_a11y',
        showMainInfo: false,
        leftBtnIcon: 'back',
        rightBtnIcon: 'noshow',
        title: '外幣匯率',
        backPath: 'a11yfinancialinfokey'
    };
    /**
     * 參數處理
     */
    private _defaultHeaderOption: any; // header setting暫存
    showData = false;
    bookmarkData = []; // 頁籤資料
    info_data: any = {};
    data = []; // getdata回傳資料
    dataTime: any;
    mydataTime: any;

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

    constructor(
        private _mainService: ExchangeService,
        private _logger: Logger,
        private _headerCtrl: HeaderCtrlService,
        private navgator: NavgatorService,
        private _handleError: HandleErrorService,
        private headerCtrl: HeaderCtrlService,
        private dataExchange: DataExchange
    ) {
        this.headerCtrl.setOption(this.obj);
        this._headerCtrl.setLeftBtnClick(() => { // 左邊button
          this.gobackPage();
        });
    }

    ngOnInit() {
        this._defaultHeaderOption = this.navgator.getHeader();
        this.bookmarkData = this._mainService.getMenuData();
        this.getData();
    }

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
        this._logger.info('set_data: ', set_data);
        //this.onChangePage(set_id, set_data);
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
                this.data = result.data;
                // this.dataTime = result.dataTime;
                this.dataTime = this.dataExchange.exchangeData(result.dataTime);
                let time = this.dataTime.split(/[\s\/:]+/);
                this.mydataTime = "掛牌時間" + time[0] + "年" + time[1] + "月" + time[2] + "日" + time[3] + "點" + time[4] + "分" + time[5] + "秒";
                this.showData = true;
                this.active_menu.id = 'spot';
            },
            (errorObj) => {
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
            }
        );
    }

  //  反回上一頁
  gobackPage() { // 左邊button
    this.navgator.push('a11yfinancialinfokey');
  }

}
