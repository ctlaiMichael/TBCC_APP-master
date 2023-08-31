/**
 * 最新消息內容頁
 */
import { Component, OnChanges, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ActivatedRoute } from '@angular/router';
import { NewsBoardService } from '@pages/news/shared/service/news-board.service';

@Component({
  selector: 'app-news-board-content',
  templateUrl: './news-board-content.component.html',
  styleUrls: [],
})
export class NewsBoardContentComponent implements OnInit, OnChanges {
  @Input() setData: object;
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();

  newsNo: any = ''; // 消息編號
  hasPap: boolean; // 是否有父層

  fullData = {
    newsSubject: ''
    , newsBody: ''
    , applyDateTime: ''
    , expireDateTime: ''
    , image: ''
    , fileType: ''
  };

  constructor(
    private _logger: Logger
    , private _handleError: HandleErrorService
    , private _headerCtrl: HeaderCtrlService
    , private navgator: NavgatorService
    , private route: ActivatedRoute
    , private _mainService: NewsBoardService
  ) {
    this.hasPap = false;
    // --- 頁面設定 ---- //
    this._headerCtrl.updateOption({
      'leftBtnIcon': 'back'
    });
    this._headerCtrl.setLeftBtnClick(() => {
      this.onBackPageData();
    });
    // --- 頁面設定 End ---- //
  }

  ngOnInit() {
    // 取得(url)
    this.route.queryParams.subscribe(params => {
      if (params.hasOwnProperty('news')) {
        this.hasPap = false;
        this.newsNo = params['news'];
      }
    });
    if (!this.hasPap) {
      this.getData();
    }
  }

  ngOnChanges() {
    this.hasPap = (typeof this.setData !== 'undefined') ? true : false;
    if (this.hasPap) {
      this.newsNo = (this.setData.hasOwnProperty('newsNo')) ? this.setData['newsNo'] : '';
    }
    this.getData();
  }

  private getData() {
    this._mainService.getContent(this.newsNo, this.setData).then(
      (resObj) => {
        this.fullData = resObj.data;
      },
      (errorObj) => {
        this.onErrorBackEvent(errorObj);
      }
    );
  }

  /**
   * 重新設定page data
   * @param item 
   */
  onBackPageData(item?: any) {
    if (!this.hasPap) {
      // 返回最新消息選單
      this.navgator.push('news-board');
    } else {
      // 返回最新消息選單
      let output = {
        'page': 'content',
        'type': 'back',
        'data': item
      };
      this.backPageEmit.emit(output);
    }

  }


  /**
   * 失敗回傳
   * @param error_obj 失敗物件
   */
  onErrorBackEvent(error_obj) {
    if (this.hasPap) {
      // 有父層回父層
      let output = {
        'page': 'content',
        'type': 'error',
        'data': error_obj
      };
      this.errorPageEmit.emit(output);
    } else {
      error_obj['type'] = 'message'; // 導頁
      // error_obj['backType'] = 'news'; // 返回最新消息選單
      this._handleError.handleError(error_obj);
    }
  }


}
