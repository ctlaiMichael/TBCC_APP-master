/**
 * 信託業務推介-列表
 */
import { Component, OnInit, ViewChild, HostListener, ViewContainerRef } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
// == 分頁 == //
import { RecommendationContentComponent } from './content/recommendation-content.component';
import { FI000607ApiService } from '@api/fi/fI000607/fi000607-api.service';
// == 分頁 End == //
@Component({
  selector: 'app-fund-recommendation',
  templateUrl: './fund-recommendation.component.html',
  providers: [FI000607ApiService]
})
export class FundRecommendationComponent implements OnInit {
  /**
   * 參數處理
   */
  @ViewChild('pageBox', { read: ViewContainerRef }) pageBox: ViewContainerRef;
  showContent = false; // 顯示內容頁 false: 列表頁, true 內容頁
  showListType = '';
  content_data: any; // 內容頁資料
  nowType: any = {};
  showData = false;
  data = [];
  dataType = [];
  fullData = {
    custId: '',
    act: '',
    condition: '',
    modifyDate: '',
    trnsRsltCode: '',
    hostCode: '',
    hostCodeMsg: ''
  };
  showPage = '';

  // == 分頁物件 == //
  // @ViewChild('firstpage', { read: ViewContainerRef }) firstpage: ViewContainerRef;

  private _defaultHeaderOption: any;

  constructor(
    private _logger: Logger
    , private _headerCtrl: HeaderCtrlService
    , private _uiContentService: UiContentService
    , private _handleError: HandleErrorService
    , private navgator: NavgatorService
    , private _fi000607Service: FI000607ApiService
  ) { }

  ngOnInit() {
    this._defaultHeaderOption = this.navgator.getHeader();
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

    this._logger.step('FUND', 'onBackPage[]: ', tmp_data, page, pageType);
    if (page === 'enter-recommendation' && pageType === 'success') {
      if (tmp_data == false) {
        this.navgator.push('fund');
      } else {
        // 發送FI000607 信託業務推介查詢
        let req = {};
        this._fi000607Service.getData(req).then(
          (result) => {
            this._logger.step('FUND', '發送FI000607 result: ', result);
            this.fullData = result.info_data;
            this.showPage = 'contentPage';
          },
          (errorObj) => {
            errorObj['type'] = 'dialog';
            this._handleError.handleError(errorObj);
            this.navgator.push('fund');
          }
        );
      }
    }
  }

  /**
   * 失敗回傳
   * @param error_obj 失敗物件
   */
  onErrorBackEvent(e) {
    this._logger.step('FUND', 'onErrorBackEvent', e);
    let page = 'list';
    let pageType = 'list';
    let errorObj: any;
    if (typeof e === 'object') {
      if (e.hasOwnProperty('page')) {
        page = e.page;
      }
      if (e.hasOwnProperty('type')) {
        pageType = e.type;
      }
      if (e.hasOwnProperty('data')) {
        errorObj = e.data;
      }
    }
    switch (page) {
      case 'content':
        // == 內容返回(先顯示列表再顯示錯誤訊息) == //
        errorObj['type'] = 'dialog';
        this._handleError.handleError(errorObj);
        break;
    }

  }


}
