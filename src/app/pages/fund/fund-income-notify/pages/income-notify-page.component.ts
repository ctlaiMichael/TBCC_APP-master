/**
 * 停損獲利點通知-列表
 * (單頁)
 */
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { IncomeNotifyService } from '@pages/fund/shared/service/income-notify.service';
import { FI000705ApiService } from '@api/fi/fi000705/fI000705-api.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { NavgatorService } from '@core/navgator/navgator.service';
@Component({
  selector: 'app-income-notify-page',
  templateUrl: './income-notify-page.component.html',
  providers: [IncomeNotifyService]
})
export class IncomeNotifyPageComponent implements OnInit {
  /**
   * 參數處理
   */
  @Input() page: string | number = 1;
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
  notifyData: any;
  settingData: any;
  resultData = [];
  showData: any;
  // 停損獲利點設定
  incomeSetting = {
    incomePoint: 0.0, // 停損點
    profitPoint: 0.0 // 獲利點
  };

  // 送request的物件(fi000701)

  constructor(
    private _logger: Logger
    , private _mainService: IncomeNotifyService
    , private _fi000705Service: FI000705ApiService
    , private alert: AlertService
    , private navgator: NavgatorService
  ) { }

  ngOnInit() {

    this.getIncomeNotifyData();
    // this.getIncomeSetting();
  }

  // 取得停損停利點通知
  getIncomeNotifyData() {
    if (typeof this.page === 'undefined') {
      this.page = 1;
    } else {
      this.page = parseInt(this.page.toString(), 5);
    }
    const reqData = {};
    this._mainService.getData(reqData, this.page).then(
      (result) => {
        this.notifyData = result.data;
        this.onBackPageData(result);
      },
      (errorObj) => {
        this.onErrorBackEvent(errorObj);
      }
    );
  }

  // 取得停損停利點設定
  getIncomeSetting() {
    const reqData = {};
    this._fi000705Service.getData(reqData).then(
      (result) => {
        this._logger.step('FUND', '取得停損停利點設定: ', result);
        this.settingData = result.data;
        for (let i = 0; i < this.settingData.length; i++) {
          let item = this.settingData[i];
          this._logger.step('FUND', '取得停損停利點設定item: ', item);
          // let pointFloat = parseFloat(item.incomePoint.substring(0, 3));
          // let decimalPoint = parseFloat(item.incomePoint.substring(3, item.incomePoint.length)) / 100;
          // let pointFloat2 = parseFloat(item.profitPoint.substring(0, 3));
          // let decimalPoint2 = parseFloat(item.profitPoint.substring(3, item.profitPoint.length)) / 100;
          // this.incomeSetting.incomePoint = pointFloat + decimalPoint;
          // this.incomeSetting.profitPoint = pointFloat2 + decimalPoint2;
          this.incomeSetting.incomePoint = item.incomePoint;
          this.incomeSetting.profitPoint = item.profitPoint;
          this._logger.step('FUND', 'GET result: ', this.incomeSetting);
          this.settingData[i].incomePoint = this.incomeSetting.incomePoint;
          this.settingData[i].profitPoint = this.incomeSetting.profitPoint;

          if (item.webNotice == 'Y') {
            this.settingData[i].webNotice = '即時畫面';
          }
          if (item.emailNotice == 'Y') {
            this.settingData[i].emailNotice = 'Email';
          }
          this._logger.step('FUND', 'GET settingData[i]: ', this.settingData[i]);
        }
        this._logger.step('FUND', 'notifyData:', this.notifyData);
        this._logger.step('FUND', 'settingData:', this.settingData);
        for (let i = 0; i < this.notifyData.length; i++) {
          for (let j = 0; j < this.settingData.length; j++) {
            if (this.notifyData[i].tradeNo == this.settingData[j].transCode) {
              let setObj = this.notifyData[i];
              setObj['incomePoint'] = this.settingData[j].incomePoint;
              setObj['profitPoint'] = this.settingData[j].profitPoint;
              setObj['webNotice'] = this.settingData[j].webNotice;
              setObj['emailNotice'] = this.settingData[j].emailNotice;
              this.resultData.push(setObj);
              this._logger.step('FUND', i + '/' + j + ':', setObj);
              break;
            }
          }
        }
        if (this.resultData.length == 0) {
          this.alert.show('查詢結果無資料', {
            title: '停損停利點通知',
            btnTitle: '我知道了',
          }).then(
            () => {
              this.navgator.push('fund');
            }
          );
        }
      },
      (errorObj) => {
        this._logger.step('FUND', 'error fi000705: ', errorObj);
        this.onErrorBackEvent(errorObj);
      }
    );
  }


  /**
   * 顯示內容頁
   * @param item 內容頁資料
   */
  onContentEvent(item) {
    const output = {
      'page': 'list-item',
      'type': 'content',
      'data': item
    };

    this.backPageEmit.emit(output);
  }

  /**
   * 重新設定page data
   * @param item
   */
  onBackPageData(item) {
    const output = {
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
    const output = {
      'page': 'list-item',
      'type': 'error',
      'data': error_obj
    };

    this.errorPageEmit.emit(output);
  }

}
