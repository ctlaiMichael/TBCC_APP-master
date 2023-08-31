/**
 * 基金庫存明細
 */
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FundRichDetailService } from '@pages/fund/shared/service/fundRichDetail.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';


@Component({
  selector: 'app-rich-detail',
  templateUrl: './rich-detail-page.component.html',
  styleUrls: [],
  providers: [FundRichDetailService]
})
export class RichDetailPageComponent implements OnInit {
  @Input() page: string | number = 1;
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
  custId: string = '';
  info_data: any = {}; //fi000304存電文回傳
  data: any = []; //存fi000304電文回傳
  moreOverview = []; //存庫存總覽(點擊該筆看更多)
  info_querydata: any = {}; //fi000305存電文回傳
  querydata: any = []; //fi000305存電文回傳

  constructor(
    private _logger: Logger
    , private router: Router
    , private confirm: ConfirmService
    , private _handleError: HandleErrorService
    , private navgator: NavgatorService
    , private _mainService: FundRichDetailService
    , private _headerCtrl: HeaderCtrlService

  ) {
  }

  ngOnInit() {
    ;
    if (typeof this.page === 'undefined') {
      this.page = 1;
    } else {
      this.page = parseInt(this.page.toString(), 10);
    }
    this._mainService.getData({}, this.page, [], { reget: false }).then(
      (result) => {
        this.info_data = result.info_data;
        this.data = result.data;
        this.onBackPageData(result);
      },
      (errorObj) => {
        this.onErrorBackEvent(errorObj);
      }
    );
  }

  //點擊查詢
  onQuery(item) {
    this.onContentEvent(item);
  }


  /**
   * 顯示內容頁
   * @param item 內容頁資料
   */
  onContentEvent(item) {
    let output = {
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
    // if(typeof item ==='object' 
    // && item.) {

    // }

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
    * 子層返回事件
    * @param e
    */
  onBackPage(e) {
    this._logger.step('FUND', 'onBackPage', e);
    let page = 'list';
    let pageType = 'list';
    let tmp_data: any;
    if (typeof e === 'object') {
      if (e.hasOwnProperty('page')) {
        page = e.page;
      }
      if (e.hasOwnProperty('type')) {
        pageType = e.type;
      }
      if (e.hasOwnProperty('data')) {
        tmp_data = e.data;
      }
    }

    if (page === 'rich-detail-query' && pageType === 'detail-query') {
      // 設定頁面資料
      let output = {
        page: '',
        type: '',
        data: ''
      }
      output.page = page;
      output.type = pageType;
      output.data = tmp_data;
      this.goTagCancelData(output);
    }
  }

  /**
 * 重新設定page data
 * @param item
 */
  goTagCancelData(item) {
    const output = {
      'page': 'list-item',
      'type': 'page_info',
      'data': item.data
    };
    if (typeof item === 'object'
      && item.hasOwnProperty('page')
      && item.hasOwnProperty('type')
      && item.hasOwnProperty('data')) {
      output.page = item.page;
      output.type = item.type;
      output.data = item.data;
    }

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