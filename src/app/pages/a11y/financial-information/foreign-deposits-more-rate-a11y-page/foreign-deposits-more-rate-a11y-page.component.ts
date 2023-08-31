import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { DataExchange } from '../shared/Dataexchange';

@Component({
  selector: 'app-foreign-deposits-more-rate-a11y-page',
  templateUrl: './foreign-deposits-more-rate-a11y-page.component.html',
  styleUrls: []
})
export class ForeignDepositsMoreRateA11yPageComponent implements OnInit {


  showData = false;
  // @Input() detailData: any;
  // @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  hasPap: boolean; // 是否有父層
  detailData = this.navgator.getParams();
  constructor(
    private _logger: Logger,
    private _handleError: HandleErrorService,
    private _headerCtrl: HeaderCtrlService,
    private navgator: NavgatorService,
    private dataExchange: DataExchange
  ) {
    this._logger.debug('detailData', this.detailData);
    this.hasPap = false;
    this._headerCtrl.updateOption({
      'leftBtnIcon': 'back',
      'style': 'normal_a11y',
      'title': this.detailData.currName + '(' + this.detailData.currency + ')'
    });
    // this._headerCtrl.setLeftBtnClick(() => {
    //     this.onBackPageData();
    // });
  }
  dataTime = '';  //電文回傳資料時間
  searchTime = ''; //查詢時間
  mydataTime: any; //報讀告牌利率時間

  ngOnInit() {
    let time = this.detailData.searchTime.split(/[\s\/:]+/);
    this.mydataTime = "查詢時間" + time[0] + "年" + time[1] + "月" + time[2] + "日" + time[3] + "點" + time[4] + "分" + time[5] + "秒";
    // this.searchTime = result.searchTime;
    if (this.detailData) {
      this.showData = true;
    }
    this._headerCtrl.updateOption({
      'leftBtnIcon': 'back',
      'style': 'normal_a11y',
      'title': this.detailData.currName + '(' + this.detailData.currency + ')'
    });
    // this._headerCtrl.setLeftBtnClick(() => {
    //   //this.onBackPageData();
    // });
  }
  //   /**
  // * 重新設定page data
  // * @param item
  // */
  //   onBackPageData() {
  //     this.backPageEmit.emit({});
  //   }

}
