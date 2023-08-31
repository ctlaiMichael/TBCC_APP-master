import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { NocardAccountService } from '../../shared/service/nocard-account.service';

@Component({
  selector: 'app-record-detail',
  templateUrl: './record-detail-page.component.html',
  styleUrls: []
})
export class RecordDetailPageComponent implements OnInit {
  // ===== Component Properties =====

  @Input() queryTime: string;   // 查詢時間
  @Input() detailObj: any;      // 預約無卡提款-交易明細
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private _logger: Logger,
    private _headerCtrl: HeaderCtrlService,
    private _navgator: NavgatorService,
    private nocardaccountService: NocardAccountService,
  ) {
    this._headerCtrl.updateOption({
      'leftBtnIcon': 'back'
    });
    // 設定返回上一頁
    this._headerCtrl.setLeftBtnClick(() => {
      this.onBackPageData();
    });
  }

  ngOnInit() {
  }

  /**
   * 重新預約
   * @memberof RecordDetailPageComponent
   */
  renewTrns() {
    this.nocardaccountService.checkAllStatus('nocardreservationkey', this.detailObj);
  }
  // 返回交易紀錄查詢
  onBackPageData() {
    let output = {
        'page': 'list-item',
        'type': 'back',
        'data': ''
    };
    this.backPageEmit.emit(output);
}

  // 是否顯示提款時間欄位
  isShowWithdrawTime(status) {
    switch (status) {
      case '1':
      case '2':
      case '4':
      case '5':
        return true;
      default:
        return false;
    }
  }

}
