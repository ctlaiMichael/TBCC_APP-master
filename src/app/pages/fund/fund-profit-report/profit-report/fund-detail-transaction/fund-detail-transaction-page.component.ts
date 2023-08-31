/**
 * 基金交易明細查詢
 */
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { FundDetailTransactionService } from '@pages/fund/shared/service/fund-detail-transaction.service';


@Component({
  selector: 'app-fund-detail-transaction',
  templateUrl: './fund-detail-transaction-page.component.html',
  styleUrls: [],
  providers: [FundDetailTransactionService]
})
export class FundDetailTransactionComponent implements OnInit {
  @Input() page: string | number = 1;
  @Input() reqObj: any; //接收type
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
  info_data: any = {}; //fi000103存電文回傳
  data: any = []; //存fi000103電文回傳
  showData = true;
  showError = '';

  constructor(
    private _logger: Logger
    , private router: Router
    , private confirm: ConfirmService
    , private _handleError: HandleErrorService
    , private navgator: NavgatorService
    , private _headerCtrl: HeaderCtrlService
    , private _detailService: FundDetailTransactionService

  ) {
  }

  ngOnInit() {
    this._initEvent();
    if (typeof this.page === 'undefined') {
      this.page = 1;
    } else {
      this.page = parseInt(this.page.toString(), 10);
    }

    this._detailService.getData(this.reqObj, this.page).then(
      (result) => {
        this.showData = true;
        this.info_data = result.info_data;
        this.data = result.data;
        this.onBackPageData(result);

      },
      (errorObj) => {
        if (this.page === 1) {
          this.showData = false;
          this.showError = (!!errorObj.content) ? errorObj.content : '';
          this.navgator.pageInitEnd(); // 取得資料後顯示頁面
        } else {
          this.showData = true;
        }
        this.onErrorBackEvent(errorObj);
      });

  }

  /**
    * 重新設定page data
    * @param item
    */
  onBackPageData(item, page?, info_data?) {
    const output = {
      'page': 'list-item',
      'type': 'page_info',
      'data': item,
      'info_data': {}
    };
    if (page === 'queryDetail') {
      output.page = page;
      output.info_data = info_data;
    }
    if (page == 'detail-back') {
      output.page = page;
    }
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
    //設定header
    this._headerCtrl.updateOption({
      'leftBtnIcon': 'back',
      'title': '基金投資損益報告'
    });
    this._headerCtrl.setLeftBtnClick(() => {
      let page = 'detail-back'
      this.onBackPageData({}, page);
    });
  }

  onQuery(dataItem) {
    let page: string = 'queryDetail';
    this.onBackPageData(dataItem, page, this.info_data);
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