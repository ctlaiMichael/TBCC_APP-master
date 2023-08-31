/**
 * 變更現金收益存入帳號內容頁
 */
import { Component, OnChanges, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ActivatedRoute } from '@angular/router';
import { ChangeReserveCancelService } from '@pages/fund/shared/service/change-reserve-cancel.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';

@Component({
  selector: 'app-reserve-cancel-result',
  templateUrl: './reserve-cancel-result.component.html',
  styleUrls: [],
  providers: [
    ChangeReserveCancelService
  ]
})
export class ReserveCancelResultComponent implements OnInit, OnChanges {
  @Input() setData: any;
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();

  newsNo: any = ''; // 消息編號
  trnsInAccts = []; // 轉入帳號
  nowType: any = {};
  trnsRsltCode = '';
  showAccount: any = '';
  erroMsg = '';
  processing = true; // 顯示處理中

  fullData = {
    custId: '' // custId身分證號
    , hostCode: '' // hostCode	交易結果
    , hostCodeMsg: '' // hostCodeMsg	主機代碼訊息
    , trnsRsltCode: '' // trnsRsltCode	交易結果代碼
    , trnsDateTime: '' // trnsDateTime 交易時間
    , reserveTransCode: '' // reserveTransCode 預約編號
    , enrollDate: '' // enrollDate 交易日期
    , effectDate: '' // effectDate 生效日期
    , transType: '' // transType 交易項目
    , transTypeDesc: '' // transTypeDesc 交易項目說明
    , fundCode: '' // fundCode	基金代碼
    , fundName: '' // fundName	基金名稱
    , transCode: '' // transCode	交易編號
    , currency: '' // currency 投資幣別
    , inCurrency: '' // inCurrency 基金幣別
    , purchAmnt: '' // purchAmnt 申購/轉換/贖回金額
    , serviceFee: '' // serviceFee	手續費
    , payAccount: '' // payAccount	扣款帳號
    , redeemAccount: '' // redeemAccount	入帳帳號
    , lastChangeDate: '' // lastChangeDate	處理日期
    , status: '' // status	處理結果
    , inFundCode: '' // inFundCode	轉入基金代碼
    , inFundName: '' // inFundName	轉入基金名稱
  };
  @Input() e;
  constructor(
    private _logger: Logger
    , private _handleError: HandleErrorService
    , private _headerCtrl: HeaderCtrlService
    , private navgator: NavgatorService
    , private route: ActivatedRoute
    , private _mainService: ChangeReserveCancelService
    , private confirm: ConfirmService
  ) {
  }

  ngOnInit() {
    // --- 頁面設定 ---- //
    this._headerCtrl.updateOption({
      'leftBtnIcon': 'menu'
    });
    // this._headerCtrl.setLeftBtnClick(() => {
    //   this.onBackPageData();
    // });
    // --- 頁面設定 End ---- //
    // 設定header
    this._logger.step('FUND', 'setData: ', this.setData);
  }

  ngOnChanges() {
    this._logger.step('FUND', 'setData:[e] ', this.e);
    this.getData(this.e);
  }

  private getData(e) {
    let reqData = {
      custId: '',
      reserveTransCode: '',
      trnsToken: ''
    };
    reqData = this.setData;
    this._logger.step('FUND', 'result e: ', e);
    this._mainService.getData(reqData, e).then(
      (result) => {
        this.processing = false;
        this.fullData = result.info_data;
        this.trnsRsltCode = this.fullData.trnsRsltCode;
        if (this.fullData.transType === '10' || this.fullData.transType === '20') {
          this.showAccount = this.fullData.payAccount;
        } else if (this.fullData.transType === '30') {
          this.showAccount = this.fullData.redeemAccount;
        }
        this._logger.step('FUND', 'result result.info_data', result.info_data);
      },
      (errorObj) => {
        this.processing = false;
        if (errorObj.hasOwnProperty('body')) {
          this.erroMsg = errorObj.body.respCodeMsg;
        } else {
          this.erroMsg = errorObj.content;
        }
        this._handleError.handleError(errorObj);
        // this.onErrorBackEvent(errorObj);
        // this.backMenuPage();
      }
    );
  }

  /**
   * 失敗回傳
   * @param error_obj 失敗物件
   */
  onErrorBackEvent(error_obj) {
    const output = {
      'page': 'result',
      'type': 'error',
      'data': error_obj
    };
    this.errorPageEmit.emit(output);
  }

  public backMenuPage() {
    this.navgator.push('fund');
  }

}
