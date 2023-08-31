/**
 * 信託業務推介 查詢結果內容
 * (單頁)
 */
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FI000608ApiService } from '@api/fi/fI000608/fi000608-api.service';
@Component({
  selector: 'app-recommendation-content',
  templateUrl: './recommendation-content.component.html',
  providers: [FI000608ApiService]
})
export class RecommendationContentComponent implements OnInit {
  /**
   * 參數處理
   */
  @Input() setData: any;
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();

  showPage = '';
  modifyDate = {
    year: '',
    month: '',
    day: ''
  };
  ToDate = {
    year: '',
    month: '',
    day: ''
  };
  resultData = {
    custId: '',
    updateStatus: '',
    hostCode: '',
    hostCodeMsg: ''
  };

  constructor(
    private _logger: Logger
    , private confirm: ConfirmService
    , private navgator: NavgatorService
    , private _handleError: HandleErrorService
    , private _fi000608Service: FI000608ApiService
  ) { }

  ngOnInit() {
    this._logger.step('FUND', 'setData: ', this.setData);
    if (this.setData.act == '1') {
      // 已徵取同意書
      this.showPage = 'fundNoPush';
    } else if (this.setData.act == '2') {
      this.modifyDate.year = this.setData.modifyDate.substring(0, 4);
      this.modifyDate.month = this.setData.modifyDate.substring(4, 6);
      this.modifyDate.day = this.setData.modifyDate.substring(6, 8);
      this.showPage = 'fundHasPush';
    } else if (this.setData.act == '3') {
      this.showPage = 'fundErrorPush';
    }
  }

  // 已徵取同意書
  agreeSend(agreeResult) {
    // 發送FI000608-信託業務推介確認
    if (agreeResult == false) {
      this.leaveConfirmMsg();
    } else {
      let req = {
        CPKind: '1'
      };
      this._fi000608Service.getData(req).then(
        (result) => {
          this._logger.step('FUND', '已徵取同意書 get fi000608', result);
          this.resultData = result.info_data;
          this.showPage = 'resultPage';
        },
        (errorObj) => {
          this._logger.step('FUND', 'error fi000608', errorObj);
          errorObj['type'] = 'dialog';
          this._handleError.handleError(errorObj);
          this.navgator.push('fund');
        }
      );
    }
  }

  // 終止推介
  stopReccomand() {
    this._logger.step('FUND', '終止推介 go to fundStopPush');
    let Today = new Date();
    this.ToDate.year = Today.getFullYear().toString();
    this.ToDate.month = (Today.getMonth() + 1).toString();
    this.ToDate.day = (Today.getDate()).toString();
    this.showPage = 'fundStopPush';
  }
  // 終止推介
  agreeStop(agreeResult) {
    // 發送FI000608-信託業務推介確認
    this._logger.step('FUND', '終止推介 go to fundStopPush');
    if (agreeResult == false) {
      this.leaveConfirmMsg();
    } else {
      let req = {
        CPKind: '3'
      };
      this._fi000608Service.getData(req).then(
        (result) => {
          this._logger.step('FUND', '終止推介 get fi000608', result);
          this.resultData = result.info_data;
          this.showPage = 'resultPage';
        },
        (errorObj) => {
          this._logger.step('FUND', 'error fi000608', errorObj);
          errorObj['type'] = 'dialog';
          this._handleError.handleError(errorObj);
          this.navgator.push('fund');
        }
      );
    }

  }

  leaveConfirmMsg() {
    this.confirm.show('取消信託業務推介', {
      title: '提醒您'
    }).then(
      () => {
        // 返回投資理財選單
        this.navgator.push('fund');
      },
      () => {

      }
    );
  }

  backMenu() {
    this.navgator.push('fund');
  }

}
