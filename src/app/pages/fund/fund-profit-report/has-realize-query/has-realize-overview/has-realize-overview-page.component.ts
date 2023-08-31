/**
 * 已實現損益明細
 */
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { FundHasRealizeOverviewService } from '@pages/fund/shared/service/fund-has-realize-overview.service';

@Component({
  selector: 'app-has-realize-overview',
  templateUrl: './has-realize-overview-page.component.html',
  styleUrls: [],
  providers: [FundHasRealizeOverviewService]
})
export class HasRealizeOverviewPageComponent implements OnInit {
  @Input() reqObj: any; //接收type
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
  info_data: any = {}; //fi000201存電文回傳
  data: any = {
    incomeState: [], // 全年損益
    payAmt: [], // 給付總額
    intAmt: [], // 交易所得
    terminateAmount: [], // 解約金額
    amount: [], // 原始信託金額
  };

  lookMoreOverview = false;
  moreOverview = []; //存庫存總覽(點擊該筆看更多)
  constructor(
    private _logger: Logger
    , private confirm: ConfirmService
    , private _handleError: HandleErrorService
    , private navgator: NavgatorService
    , private _headerCtrl: HeaderCtrlService
    , private _mainService: FundHasRealizeOverviewService

  ) {
  }

  ngOnInit() {
    this._initEvent();
    // this._logger.log("reqObj88888888:",this.reqObj);

    this._mainService.getOverview(this.reqObj).then(
      (result) => {
        this.info_data = result.info_data;
        this.data = result.modify_data;
        // this._logger.log("info_data:",this.info_data);
        // this.onBackPageData(result);
      },
      (errorObj) => {
        this.onErrorBackEvent(errorObj);
      });
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

  /**
* 啟動事件
*/
  private _initEvent() {
    // 設定header
    // this._headerCtrl.updateOption({
    //   // 'leftBtnIcon': 'back',
    //   'title': '已實現損益總覽'
    // });
  }

  /**
   * go
   *
   */

  // --------------------------------------------------------------------------------------------
  //  ____       _            _         _____                 _
  //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
  //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
  //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
  //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
  // --------------------------------------------------------------------------------------------

}