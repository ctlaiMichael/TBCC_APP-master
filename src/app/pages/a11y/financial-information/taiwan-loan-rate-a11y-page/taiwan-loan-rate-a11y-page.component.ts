import { Component, OnInit } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { TwdLoanService } from '@pages/financial/shared/service/twdLoan.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { DataExchange } from './../shared/Dataexchange';
import { NavgatorService } from '@core/navgator/navgator.service';

@Component({
  selector: 'app-taiwan-loan-rate-a11y-page',
  templateUrl: './taiwan-loan-rate-a11y-page.component.html',
  styleUrls: []
})
export class TaiwanLoanRateA11yPageComponent implements OnInit {

  /**
   * 參數設定
   */
  obj = {
    style: 'normal_a11y',
    showMainInfo: false,
    leftBtnIcon: 'back',
    rightBtnIcon: 'noshow',
    title: '台幣放款利率',
    backPath: 'a11yfinancialinfokey'
  };

  info_data: any = {};
  dataTime = '';        // data time
  nowType: any = {};
  fullData = [];
  showData = false;
  mydataTime: any;      // 報讀時間title

  constructor(
    private _logger: Logger,
    private _mainService: TwdLoanService,
    private _handleError: HandleErrorService,
    private headerCtrl: HeaderCtrlService,
    private _dataexchange: DataExchange,
    private navgator: NavgatorService
  ) {
      this.headerCtrl.setOption(this.obj);
      this.headerCtrl.setLeftBtnClick(() => { // 左邊button
        this.gobackPage();
      });
  }

  ngOnInit() {
    this.getData();
  }

  // 發送電文，取得台幣放款利率資料
  private getData(): Promise<any> {
    return this._mainService.getData().then(
      (result) => {
        this._logger.step('Financial', 'getData', result);
        this.info_data = result.info_data;
        this.dataTime = this._dataexchange.exchangeData(result.dataTime);
        let time = this.dataTime.split("/");
        this.mydataTime = "牌告日期" + time[0] + "年" + time[1] + "月" + time[2] + "日";
        // loanAddRate1: ''  //基準放款指數(本行)
        // loanAddRate2: ''  //基準放款指數(原農民銀行)
        // CreditCardRate: ''  //信用卡循環信用利率
        // BaseRate: ''  //基準利率
        // BaseRateM: ''  //月基準利率
        // FDRate: ''  //定儲指數利率
        // FDRateM: ''  //定儲指數月指標利率
        // BaseRate2: ''  //基準利率(原農民銀行)
        // FDRate2: ''  //定儲指數利率(原農民銀行)
        this.fullData['loanAddRate1'] = result.data.loanAddRate1;
        this.fullData['loanAddRate2'] = result.data.loanAddRate2;
        this.fullData['CreditCardRate'] = result.data.CreditCardRate;
        this.fullData['BaseRate'] = result.data.BaseRate;
        this.fullData['BaseRateM'] = result.data.BaseRateM;
        this.fullData['FDRate'] = result.data.FDRate;
        this.fullData['FDRateM'] = result.data.FDRateM;
        this.fullData['BaseRate2'] = result.data.BaseRate2;
        this.fullData['FDRate2'] = result.data.FDRate2;
        this.showData = true;
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
