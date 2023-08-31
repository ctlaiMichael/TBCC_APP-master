/**
 * 變更現金收益存入帳號內容頁
 */
import { Component, OnChanges, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ActivatedRoute } from '@angular/router';
import { ChangeDepositAccountService } from '@pages/fund/shared/service/changeDepositAccount.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';

@Component({
  selector: 'app-deposit-account-result',
  templateUrl: './deposit-account-result.component.html',
  styleUrls: [],
  providers: [
    ChangeDepositAccountService
  ]
})
export class DepositAccountResultComponent implements OnInit, OnChanges {
  @Input() setData: any;
  @Input() fundName: string;
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();

  newsNo: any = ''; // 消息編號
  unitType: string;
  trnsInAccts = []; // 轉入帳號
  nowType: any = {};
  trnsRsltCode = '';
  erroMsg = '';

  fullData = {
    trnsRsltCode: '' // trnsRsltCode	交易結果代碼
    , hostCode: '' // hostCode	交易結果
    , hostCodeMsg: '' // hostCodeMsg	主機代碼訊息
    , custId: '' // custId	身分證字號
    , trustAcnt: '' // trustAcnt	信託帳號
    , transCode: '' // transCode	交易編號
    , fundCode: '' // fundCode	基金代碼
    , unit: '' // unit	庫存單位數
    , amount: '' // amount	信託金額
    , oriProfitAcnt: '' // oriProfitAcnt	原現金收益存入帳號
    , profitAcnt: '' // debitStatus	現金收益存入帳號
  };
  applyDate = '';
  @Input() e;
  constructor(
    private _logger: Logger
    , private _handleError: HandleErrorService
    , private _headerCtrl: HeaderCtrlService
    , private navgator: NavgatorService
    , private route: ActivatedRoute
    , private _mainService: ChangeDepositAccountService
    , private confirm: ConfirmService
  ) {
  }

  ngOnInit() {
    this.getDate();
    // --- 頁面設定 ---- //
    this._headerCtrl.updateOption({
      'leftBtnIcon': 'menu'
    });
    // this._headerCtrl.setLeftBtnClick(() => {
    //   this.onBackPageData();
    // });
    // --- 頁面設定 End ---- //
    // 設定header
  }

  ngOnChanges() {
    this._logger.step('FUND', 'setData:[e] ', this.e);
    this.getData(this.e);
  }

  private getData(e) {
    let reqData = {
      custId: '', // custId	身分證字號''
      trustAcnt: '',
      transCode: '',
      fundCode: '',
      INCurrency: '',
      amount: '',
      unit: '',
      oriProfitAcnt: '',
      profitAcnt: '',
      trnsToken: ''
    };
    reqData = this.setData;
    this._logger.step('FUND', 'result e: ', e);
    this._logger.step('FUND', 'result setData: ', this.setData);
    this._mainService.getData(reqData, e).then(
      (result) => {
        this.fullData = result.info_data;
        this.trnsRsltCode = this.fullData.trnsRsltCode;
        this._logger.step('FUND', 'result result.info_data', result.info_data);
      },
      (errorObj) => {
        this._logger.step('FUND', 'errorObj: ', errorObj);
        if (errorObj.hasOwnProperty('body')) {
          this.erroMsg = errorObj.body.hostCodeMsg;
        } else {
          this.erroMsg = errorObj.content;
        }
        this._handleError.handleError(errorObj);
        // this.navgator.push('fund');
      }
    );
  }
  //抓當日
  getDate() {
    this.applyDate = this._mainService.setToday();
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
