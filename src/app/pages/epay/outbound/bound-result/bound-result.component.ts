import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
@Component({
  selector: 'app-bound-result',
  templateUrl: './bound-result.component.html',
  styleUrls: ['./bound-result.component.css']
})
export class BoundResultComponent implements OnInit {
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private navgator: NavgatorService,
    private _headerCtrl: HeaderCtrlService,
    private _handleError: HandleErrorService
  ) { }

  ngOnInit() {
    this._headerCtrl.updateOption({
      'leftBtnIcon': 'back',
      'title': '同意跨境匯出'
    });
    this._headerCtrl.setLeftBtnClick(() => {
      this.navgator.push('epay');
    });
  }

  /**
   * 子層返回事件(分頁)
   * @param e
   */
  onPageBackEvent(e) {
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
    //確定
    if (page == 'bound-result-enter') {
      this.navgator.push('epay');
    }
  }

  /**
* 失敗回傳(分頁)
* @param error_obj 失敗物件
*/
  onErrorBackEvent(e) {
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
    // 列表頁：首次近來錯誤推頁
    errorObj['type'] = 'dialog';
    this._handleError.handleError(errorObj);
  }
}
