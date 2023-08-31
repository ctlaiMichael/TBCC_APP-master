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
import { FundHasRealizeService } from '@pages/fund/shared/service/fundHasRealize.service';


@Component({
  selector: 'app-has-realize-detail',
  templateUrl: './has-realize-detail-page.component.html',
  styleUrls: [],
  providers: [FundHasRealizeService]
})
export class HasRealizeDetailPageComponent implements OnInit {
  @Input() page: string | number = 1;
  @Input() reqObj: any; //接收type
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
  info_data: any = {}; //fi000202存電文回傳
  data: any = []; //存fi000202電文回傳

  // lookMoreOverview = false;
  // moreOverview = []; //存庫存總覽(點擊該筆看更多)
  constructor(
    private _logger: Logger
    , private router: Router
    , private confirm: ConfirmService
    , private _handleError: HandleErrorService
    , private navgator: NavgatorService
    , private _headerCtrl: HeaderCtrlService
    , private _detailService: FundHasRealizeService

  ) {
  }

  ngOnInit() {
    this._initEvent();
    // this._logger.log("inputType8888888:",this.reqObj);
    if (typeof this.page === 'undefined') {
      this.page = 1;
    } else {
      this.page = parseInt(this.page.toString(), 10);
    }

    this._detailService.getData(this.reqObj, this.page, [], { reget: false }).then(
      (result) => {
        this.info_data = result.info_data;
        this.data = result.data;
        // this._logger.log("info_data:",this.info_data);
        // this._logger.log("line 56 data:",this.data);

        // this._logger.log("line 70 data:", this.data);
        this.onBackPageData(result);
      },
      (errorObj) => {
        this.onErrorBackEvent(errorObj);
      });
  }

  /**
    * 重新設定page data
    * @param item
    */
  onBackPageData(item, page?) {
    let output = {
      'page': 'list-item',
      'type': 'page_info',
      'data': item,
      'info_data': this.info_data
    };
    output.page = page;
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


  //
  // iconTable(item) {
  //   this.lookMoreOverview = true;
  //   this.moreOverview = item;
  //   this._logger.log("moreOverview:",this.moreOverview);
  // }

  /**
* 啟動事件
*/
  private _initEvent() {
    //設定header
    //   this._headerCtrl.updateOption({
    //     'leftBtnIcon': 'back',
    //     'title': '已實現損益明細'
    // });
  }

  onQuery(dataItem) {
    let output = {
      'page': 'queryDetail',
      'type': 'query',
      'data': dataItem,
      'info_data': this.info_data
    };
    this.backPageEmit.emit(output);
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
