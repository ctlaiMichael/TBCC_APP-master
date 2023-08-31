import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { logger } from '@shared/util/log-util';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
@Component({
  selector: 'app-bound-agree',
  templateUrl: './bound-agree.component.html',
  styleUrls: []
})
export class BoundAgreeComponent implements OnInit {
/**
 * 此功能安控機制，只可使用OTP
 */
  result: any; //FQ000420回傳結果
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private navgator: NavgatorService,
    private confirm: ConfirmService,
    private _headerCtrl: HeaderCtrlService,
    private _handleError: HandleErrorService
  ) { }

  ngOnInit() {
    this.result = this.navgator.getParams().result;
    logger.error("bound-agree, result:", this.result);
    this._headerCtrl.updateOption({
      'leftBtnIcon': 'back',
      'title': '同意跨境匯出'
    });
    this._headerCtrl.setLeftBtnClick(() => {
      this.navgator.push('epay');
    });
  }


  // clickSubmit() {
  //   let params = {
  //     result: this.result
  //   };
  //   this.navgator.push('outboundData', params);
  // }

  clickBack() {
    this.confirm.show('您已取消身分確認作業', {
      title: '跨境電子支付交易-身分認證程序',
    }).then(
      res => {
        this.navgator.pop();
      },
      error => {
      }
    );
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
    //條款(同意)
    if (page == 'bound-agree-enter') {
      let params = {
        result: this.result
      };
      this.navgator.push('outboundData', params);
    }
    //條款(不同意)
    if (page == 'bound-agree-back') {
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
