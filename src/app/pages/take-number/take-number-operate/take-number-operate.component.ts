import {Component, OnInit} from '@angular/core';
import {NavgatorService} from '@core/navgator/navgator.service';
import {AlertService} from '@shared/popup/alert/alert.service';
import {branchDetail} from '@pages/location/location-search-page/locationobject';
import { TakeNumLocationService } from '../shared/service/take-num-location.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import {Logger} from '@core/system/logger/logger.service';
import { TranslateService } from '@ngx-translate/core';
import {FO000103ReqBody} from '@api/fo/fo000103/fo000103-req';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';

@Component({
  selector: 'app-take-number-operate',
  templateUrl: './take-number-operate.component.html',
  styleUrls: ['./take-number-operate.component.css']
})

export class TakeNumberOperateComponent implements OnInit {

  selectBranchItem: branchDetail; // 該分行資料
  dateTime = '';                  // 電文發送時間
  businessList = [];              // 分行業務種類清單
  numLimit = '';                  // 取號上限次數
  isBusinessDate = false;         // 是否為營業時間
  noticeNote = '';                // 提醒您事項
  recordSearchTerm = '';          // 紀錄查詢條件: 選擇縣市, 選擇地區

  constructor(
    private navigator: NavgatorService,
    private alert: AlertService,
    private takeNumLocationService: TakeNumLocationService,
    private _handleError: HandleErrorService,
    private translate: TranslateService,
    private _logger: Logger,
    private headerCtrl: HeaderCtrlService
  ) {
    const getPrePageSet = this.navigator.getPrePageSet();
    this.headerCtrl.setLeftBtnClick(() => {
      if (getPrePageSet['path'] == 'take-number-operate' || getPrePageSet['path'] == 'take-number') {
          this.navigator.push('take-number', ['take-number-back', this.recordSearchTerm]);
        } else {
          this.navigator.pop();
        }
    });
  }

  ngOnInit() {
    this.initPage();
  }

  initPage() {
    this.noticeNote = 'RE_TAKE_NUMBER.POPUP.RESERVATION_LIMIT';
    const params = this.navigator.getParams();
    this._logger.debug('[DEBUG] operate_param :', params);
    if (params[0] === 'take-number-operate') {
      this.selectBranchItem = params[1];
      this.isBusinessDate = params[2];
      this.recordSearchTerm = params[3];
      this.onUpdateTimeClick();
    }
  }

  onUpdateTimeClick() {
    // === 重新取得該分行業務清單 === //
    this.takeNumLocationService.getBusinessList(this.selectBranchItem.branchId).then(
      (res) => {
        this.businessList = this.sortOutBusiness(res.saleList);
        this.dateTime = res.updateTime;
        this.numLimit = res.numLimit;
      },
      (err) => {
        this._logger.error('[ERR] getBusinessList', err);
        this.checkErrorStatus(err);
      }
    );
  }

  onTakeNumberTicketClick(business) {
    // === 取號 === //
    if (!this.isBusinessDate) {
      // 超過營業時間
      this.alert.show('RE_TAKE_NUMBER.POPUP.ERROR.0002');
    } else {

      const output = new FO000103ReqBody();
      output.branchId = this.selectBranchItem.branchId.toString();
      output.saleId = business.saleId;

      this.takeNumLocationService.getBusinessNumber(output).then(
        (res) => {
          let TicketItem = {
            branchInfo: this.selectBranchItem,
            ticketInfo: {
              saleId: res.takeNum.saleId,
              department: res.takeNum.saleName,
              ticketNumber: res.takeNum.callNo,
              currentNumber: res.takeNum.nowNumber,
              waitingSequence: res.takeNum.waitperson,
            }
          };
          this.navigator.push('take-number-ticket', ['take-number-ticket', [TicketItem], res.updateTime,
            this.isBusinessDate, this.recordSearchTerm]);
        },
        (err) => {
          this._logger.error('[ERR] getBusinessNumber', err);
          this.checkErrorStatus(err);
        }
      );
    }
  }

  /**
   * 業務清單排序-依業務代碼升冪
   * @saleList  業務清單
   */
  sortOutBusiness(saleList) {
    saleList = saleList.sort((a, b) => Number(a.saleId) > Number(b.saleId) ? 1 : -1);
    return saleList;
  }

  /**
   * 錯誤代碼檢核
   * @err 錯誤資料物件
   */
  checkErrorStatus(err) {
    if (err.hasOwnProperty('info_data') && !!err.info_data.hasOwnProperty('rtnCode')) {
      switch (err.info_data.rtnCode) {
        case '0001' :
          // 若已達每日上限次數
          this.translate.get('RE_TAKE_NUMBER.POPUP.ERROR.0001', {times: this.numLimit}).subscribe((val) => {
            this._handleError.handleError({ content: val});
          });
          break;
        case '0002':
          // 超過營業時間
          this._handleError.handleError({ content: 'RE_TAKE_NUMBER.POPUP.ERROR.0002'});
          break;
        case '0003':
          // 已取號且尚未過號
          this._handleError.handleError({ content: 'RE_TAKE_NUMBER.POPUP.ERROR.0003'});
          break;
        case '9001':
          // 取號失敗
          this._handleError.handleError({ content: 'RE_TAKE_NUMBER.POPUP.ERROR.9001'});
          break;
        case '9000':
          // 提示訊息「取得辦理業務之號碼失敗，請稍後再試，謝謝」。
          this._logger.error(err);
          this._handleError
            .handleError({content: 'RE_TAKE_NUMBER.POPUP.ERROR.9000'})
            .then(() => {
              this.navigator.pop();
            });
          break;
      }
    } else {
      this._handleError.handleError(err);
      this._logger.error(err);
    }
  }


}
