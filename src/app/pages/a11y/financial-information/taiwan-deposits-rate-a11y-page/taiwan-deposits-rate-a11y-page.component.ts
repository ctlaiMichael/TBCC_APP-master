import { Component, OnInit } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { TwdSaveService } from '@pages/financial/shared/service/twdSave.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { DataExchange } from '../shared/Dataexchange';
import { NavgatorService } from '@core/navgator/navgator.service';

@Component({
    selector: 'app-taiwan-deposits-rate-a11y-page',
    templateUrl: './taiwan-deposits-rate-a11y-page.component.html',
    styleUrls: [],
    providers: [TwdSaveService]
})
export class TaiwanDepositsRateA11yPageComponent implements OnInit {
    obj = {
        style: 'normal_a11y',
        showMainInfo: false,
        leftBtnIcon: 'back',
        rightBtnIcon: 'noshow',
        title: '台幣存款利率',
        backPath: 'a11yfinancialinfokey'
    };
    /**
         *
         */
    info_data: any = {};
    dataTime = ''; // data time
    nowType: any = {};
    dataType = [];
    fullData = {
        currentRatesData: [],
        savingsRatesData: [],
        fixRateData: []
    };
    showData = false;
    data = [];
    mydataTime: any;      // 報讀時間title

    constructor(
        private _logger: Logger,
        private _mainService: TwdSaveService,
        private _handleError: HandleErrorService,
        private headerCtrl: HeaderCtrlService,
        private dataExchange: DataExchange,
        private navgator: NavgatorService
    ) {
        this.headerCtrl.setOption(this.obj);
        this.headerCtrl.setLeftBtnClick(() => { // 左邊button
          this.gobackPage();
        });
    }
    ngOnInit() {
        this.dataType = this._mainService.getSetType('data');
        this.onChangeType(this.dataType[0]);
        this.getData({});
    }

    // onRegetEvent() {
    //     //刷新動作
    // }

    /**
     * 改變select選擇時
     * @param menu
     */
    onChangeType(menu?: Object) {
        this._logger.step('Financial', 'onChangeType1', menu);
        if (typeof menu !== 'undefined') {
            this.nowType = menu;
        }
        this._logger.step('Financial', 'onChangeType2', this.data, menu);
        this.showData = false;
        this.data = [];
        if (this.nowType.hasOwnProperty('id') && this.fullData.hasOwnProperty(this.nowType['id'])
            && this.fullData[this.nowType['id']].length > 0
        ) {
            this.showData = true;
            this.data = this.fullData[this.nowType['id']];
        }
    }



    private getData(set_data: any): Promise<any> {
        return this._mainService.getData(set_data).then(
            (result) => {
                this._logger.step('Financial', 'getData', result);
                this.info_data = result.info_data;
                this.dataTime = this.dataExchange.exchangeData(result.dataTime);
                let time = this.dataTime.split("/");
                this.mydataTime = "牌告日期" + time[0] + "年" + time[1] + "月" + time[2] + "日";
                this.fullData = result.data;
                this.onChangeType();
            }
            , (errorObj) => {

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
