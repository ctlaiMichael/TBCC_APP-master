import { Logger } from '@core/system/logger/logger.service';
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NocardRecordService } from '@pages/nocard/shared/service/nocard-record.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { NocardAccountService } from '../../../shared/service/nocard-account.service';

@Component({
  selector: 'app-record-list-paginator',
  templateUrl: './record-list-paginator.component.html',
  styleUrls: [],
  providers: [NocardRecordService]
})
export class RecordListPaginatorComponent implements OnInit {
  // ===== Component Properties =====
  hasRsrvtnTrns = false; // 是否顯示預約中區塊
  hasTrnsDatas = false;  // 是否顯示預約紀錄區塊
  items: any;            // 無卡提款-預約紀錄清單
  bookData: any;         // 預約中交易資料

  private trnsToken = '';// 交易控制碼

  @Input() page: string | number = 1;
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private _logger: Logger,
    private _mainService: NocardRecordService,
    private _confirm: ConfirmService,
    private _navgator: NavgatorService,
    private nocardaccountService: NocardAccountService
  ) { }

  ngOnInit() {
    if (typeof this.page === 'undefined') {
      this.page = 1;

    } else {
      this.page = parseInt(this.page.toString());
    }

    // 發送 FN000105 電文取得預約紀錄
    this._mainService.getDatas(this.page, [], {reget: false}).then(
      (S) => {
        this._logger.debug('FN000105 Response:', S);
        this.trnsToken = S.info_data.trnsToken;
        if (S.info_data.rsrvtnData) {
          this.bookData = S.info_data.rsrvtnData;
          this.hasRsrvtnTrns = true;
        }
        if (S.data.length > 0) {
          this.items = S.data;
          this.hasTrnsDatas = true;
        }
        this.onBackPageData(S);
      },
      (F) => {
        if (F.error.respCode !== '112A') {
          F['title'] = 'FUNC_SUB.CARDLESS.SEARCH_TRANS';
          this.onErrorBackEvent(F);
        } else {
          this.onBackPageData(F);
        }
      }
    );
  }

  // 取消預約
  cancelTrns(item) {
    this._confirm.show('您確定要取消該筆預約無卡提款交易？', {
      title: '提醒您'
    }).then(
      () => {
        // 確定
        this._mainService.cancelTrns(item, this.trnsToken).then(
          (S) => {
            this.onBackPageData(S, 'result');
          },
          (F) => {
            F['title'] = 'FUNC_SUB.CARDLESS.SEARCH_CANCEL';
            this.onErrorBackEvent(F);
          }
        );
      },
      () => {
        // 取消 Don't do anything
      }
    );
  }

  // 轉導至預約無卡提款
  goReservation() {
    this.nocardaccountService.checkAllStatus('nocardreservationkey');
  }

  // 畫面內容更新處理
  onContentEvent(item) {
    let output = {
      'page' : 'list-item',
      'type' : 'detail',
      'data' : item,
    };

    this.backPageEmit.emit(output);
  }

  // 返回父層
  onBackPageData(item, type?) {
    let output = {
      'page' : 'list-item',
      'type' : (type === undefined) ? 'page_info' : type,
      'data' : item
    };

    this.backPageEmit.emit(output);
  }

  // 錯誤訊息處理
  onErrorBackEvent(errorObj) {
    let output = {
      'page' : 'list-item',
      'data' : errorObj,
      'type' : 'result',
      'title' : errorObj.title,
      'content': errorObj.error.respCodeMsg,
      'backType' : 'nocard',
      'button' : '返回無卡提款',
    };

    this.errorPageEmit.emit(output);
  }

}
