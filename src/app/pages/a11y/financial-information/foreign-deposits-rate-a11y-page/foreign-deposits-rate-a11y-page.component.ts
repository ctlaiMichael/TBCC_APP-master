import { Component, OnInit } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { ForeignSaveService } from '@pages/financial/shared/service/foreignSave.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { DataExchange } from '../shared/Dataexchange';
import { Alert } from 'selenium-webdriver';

@Component({
  selector: 'app-foreign-deposits-rate-a11y-page',
  templateUrl: './foreign-deposits-rate-a11y-page.component.html',
  styleUrls: []
})
export class ForeignDepositsRateA11yPageComponent implements OnInit {
  /**
    *
    */
  obj = {
    style: 'normal_a11y',
    showMainInfo: false,
    leftBtnIcon: 'back',
    rightBtnIcon: 'noshow',
    title: '外幣存款利率',
    backPath: 'a11yfinancialinfokey'
  };
  private _defaultHeaderOption: any;
  info_data: any = {};    //所有電文資料
  data = [];              //整理好呈現之資料

  dataTime = '';  //電文回傳資料時間
  searchTime = ''; //查詢時間

  showData = false;   //查詢有無資料
  detailFlag = false;   //切換至內容頁
  mydataTime: any; //報讀告牌利率時間
  flagIcon = {          //國旗
    flag: { name: '', class: '' },
  }
  detailData = {};      //傳送內容
  constructor(
    private _logger: Logger,
    private _mainService: ForeignSaveService,
    private _handleError: HandleErrorService,
    private navgator: NavgatorService,
    private headerCtrl: HeaderCtrlService,
    private dataExchange: DataExchange
  ) {
    this.headerCtrl.setOption(this.obj);
    this.headerCtrl.setLeftBtnClick(() => { // 左邊button
      this.gobackPage();
    });
  }

  ngOnInit() {
    this._defaultHeaderOption = this.navgator.getHeader();
    this.getData();
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
    //alert(JSON.stringify(this.detailData));
    this.navgator.push('a11yforeigndepositsmorekey', this.detailData);
  }

  private getData(): Promise<any> {
    return this._mainService.getData().then(
      (result) => {
        this._logger.debug('Financial', 'getData', result);
        this.info_data = result.info_data;
        this.dataTime = this.dataExchange.exchangeData(result.searchTime);
        let time = this.dataTime.split(/[\s\/:]+/);
        this.mydataTime = "查詢時間" + time[0] + "年" + time[1] + "月" + time[2] + "日" + time[3] + "點" + time[4] + "分" + time[5] + "秒";
        this.searchTime = this.dataTime;
        this.data = result.data;
        this.showData = true;
      }
      , (errorObj) => {
        errorObj['type'] = 'message';
        this._handleError.handleError(errorObj);

      }
    );

  }

  /**
   * 子層返回事件
   * @param e
   */
  onBackPage(e) {
    this.headerCtrl.setOption(this.obj);
    this.detailFlag = (this.detailFlag) ? false : true;
    this.headerCtrl.updateOption(this._defaultHeaderOption);
  }

  //  反回上一頁
  gobackPage() { // 左邊button
    this.navgator.push('a11yfinancialinfokey');
  }
}
