import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConfirmService} from '@shared/popup/confirm/confirm.service';
import {ConfirmDualContentService} from '@shared/popup/confirm-dual-content/confirm-dual-content.service';
import {NavgatorService} from '@core/navgator/navgator.service';
import {serviceAddress} from '@pages/location/location-search-page/locationobject';
import {TicketItem} from '@pages/take-number/shared/component/number-ticket/number-ticket.interface';
import {TakeNumLocationService} from '@pages/take-number/shared/service/take-num-location.service';
import {FO000103ReqBody} from '@api/fo/fo000103/fo000103-req';
import {AlertService} from '@shared/popup/alert/alert.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-number-ticket',
  templateUrl: './number-ticket.component.html',
  styleUrls: ['./number-ticket.component.css']
})
export class NumberTicketComponent implements OnInit {
  @Input() ticketList: TicketItem[];                  // 票卡項目
  @Input() paramsItem: any;                           // 查詢條件參數
  @Input() isShowConfirmButton = false;               // 是否顯示確認按鈕
  @Output() emitConfirmEvent = new EventEmitter();    // 確認事件

  params = this.navigator.getParams();                // 轉導頁參數:頁面名稱, 票號物件, 更新時間, 營業日, 頁面參數
  numLimit = '';                                      // 取號上限次數

  constructor(
    private navigator: NavgatorService,
    private confirm: ConfirmService,
    private alert: AlertService,
    private confirmDual: ConfirmDualContentService,
    private _handleError: HandleErrorService,
    private translate: TranslateService,
    private takeNumApi: TakeNumLocationService
  ) {
  }

  ngOnInit() {
    this.initPage();
  }

  initPage() {
    if (!this.params) { this.params = [5]; }
    if (!!this.paramsItem && this.paramsItem.hasOwnProperty('country')) {
      this.params[3] = (!!this.paramsItem['isBusinessDate']) ? true : false;
      this.params[4] = { country: this.paramsItem['country'], district: this.paramsItem['district']};
    }
  }

  /**
   * 地圖 Click 事件
   * @param branch  分行資訊物件
   */
  onGoMapClick(branch: serviceAddress) {
    this.navigator.push('take-number-map', [true, branch, false, this.params[3], this.params[4]]);
  }

  /**
   * 重新抽號 Click 事件
   * @param ticket Ticket物件
   */
  onReTakeNumberClick(ticket: TicketItem) {
    this.takeNumApi.getBusinessList(ticket.branchInfo.branchId)
      .then(result => {
        this.numLimit = result.numLimit;
        return this.confirmDual.show(
          'RE_TAKE_NUMBER.POPUP.CONTENT',
          'RE_TAKE_NUMBER.POPUP.RESERVATION_LIMIT',
          {
            title: 'RE_TAKE_NUMBER.POPUP.TITLE',
            titleSecond: 'RE_TAKE_NUMBER.POPUP.TITLE_NOTICE',
            contentParam: {branch: ticket.branchInfo.branchName, department: ticket.ticketInfo.department},
            contentParamSecond: {times: result.numLimit}
          });
      })
      .then(() => {
        const param = new FO000103ReqBody();
        param.branchId = ticket.branchInfo.branchId.toString();
        param.saleId = ticket.ticketInfo.saleId;

        return this.takeNumApi.getBusinessNumber(param);
      })
      .then(result => {
        const data: TicketItem = {
          branchInfo: ticket.branchInfo,
          ticketInfo: {
            saleId: result.takeNum.saleId,
            department: result.takeNum.saleName,
            ticketNumber: result.takeNum.callNo,
            currentNumber: result.takeNum.nowNumber,
            waitingSequence: result.takeNum.waitperson,
            isShowNumberPassed: false
          }
        };

        this.navigator.push('take-number-ticket', ['take-number-ticket', [data], result.updateTime, this.params[3], this.params[4]]);
      })
      .catch(err => {
        if (!err) {
          return;
        }

        const errCode = err['info_data']['rtnCode'] || '9001';
        if (errCode == '0001') {
          this.translate.get('RE_TAKE_NUMBER.POPUP.RESERVATION_LIMIT', {times: this.numLimit}).subscribe((val) => {
            this._handleError.handleError({ content: val});
          });
        } else {
          this.alert.show(`RE_TAKE_NUMBER.POPUP.ERROR.${errCode}`);
        }

      });
  }

  /**
   * 外撥電話 Click 事件
   * @param branchName  分行名稱
   * @param branchTel   分行電話
   */
  onPhoneCallClick(branchName: string, branchTel: string) {
    this.confirm.show('POPUP.TELPHONE.TEL_NOTICE', {
      title: 'POPUP.TELPHONE.TEL_TITEL',
      contentParam: {
        telName: branchName,
        telnumber: branchTel
      }
    }).then(
      (res) => {
        window.open('tel:' + branchTel);
      },
      (error) => {
      });
  }

  /**
   * 確認 Click 事件
   */
  onConfirmClick() {
    if (!!this.params) {
      this.emitConfirmEvent.emit();
    } else if (!!this.paramsItem) {
      this.emitConfirmEvent.emit(this.params[4]);
    }
  }
}
