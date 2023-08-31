/**
 * 變更現金收益存入帳號內容頁
 */
import { Component, OnChanges, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ActivatedRoute } from '@angular/router';
import { SearchDepositAccountService } from '@pages/fund/shared/service/searchDepositAccount.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { TwdToForeignService } from '@pages/foreign-exchange/shared/service/twd-to-foreign.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';

@Component({
  selector: 'app-deposit-account-content',
  templateUrl: './deposit-account-content.component.html',
  styleUrls: [],
  providers: [
    SearchDepositAccountService,
    TwdToForeignService
  ]
})
export class DepositAccountContentComponent implements OnInit, OnChanges {
  @Input() setData: any;
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();

  showContent = false; // 顯示內容頁 false: 列表頁, true 內容頁
  newsNo: any = ''; // 消息編號
  unitType: string;
  trnsInAccts = []; // 轉入帳號
  nowType: any = {};
  content_data: any = {
    custId: '', // custId	身分證字號
    trustAcnt: '', // trustAcnt	信託帳號
    transCode: '', // transCode	交易編號
    fundCode: '', // fundCode	基金代碼
    amount: '', // 信託金額
    unit: '', // 庫存單位數
    oriProfitAcnt: '', // 原現金收益存入帳號
    profitAcnt: '' // 現金收益存入帳號
  };

  fullData = {
    trnsRsltCode: '' // trnsRsltCode	交易結果代碼
    , hostCode: '' // hostCode	交易結果
    , hostCodeMsg: '' // hostCodeMsg	主機代碼訊息
    , custId: '' // custId	身分證字號
    , trnsToken: ''
    , trustAcnt: '' // trustAcnt	信託帳號
    , transCode: '' // transCode	交易編號
    , fundCode: '' // fundCode	基金代碼
    , fundType: '' // fundType	業務別
    , payDate1: '' // payDate1	每月扣款日期1
    , payDate2: '' // payDate2	每月扣款日期2
    , payDate3: '' // payDate3	每月扣款日期3
    , payDate4: '' // payDate4	每月扣款日期4
    , payDate5: '' // payDate5	每月扣款日期5
    , payAcnt: '' // payAcnt	定期定額扣款帳號
    , profitAcnt: '' // profitAcnt	現金收益存入帳號
    , breakFlag: '' // breakFlag	定期定額終止扣款註記
    , purchAmnt: '' // purchAmnt	定期定額申購金額
    , unit: '' // unit	庫存單位數
    , INCurrency: '' // 投資幣別
  };
  fundName = '';

  // request
  userAddress = {
    'USER_SAFE': '',
    'SEND_INFO': ''
  };


  // =====================  安控變數 start =============================
  'SEND_INFO': '';
  transactionObj = {
    serviceId: 'FI000704',
    categoryId: '6', // 基金業務
    transAccountType: '1',
  };

  securityObj = {
    'action': 'init',
    'sendInfo': {}
  };

  safeE = {};
  // ====================  安控變數 end =============================
  //整理完的帳號
  InAC = [];
  trnsOutAcct = [];

  constructor(
    private _logger: Logger
    , private _handleError: HandleErrorService
    , private _headerCtrl: HeaderCtrlService
    , private navgator: NavgatorService
    , private route: ActivatedRoute
    , private _mainService: SearchDepositAccountService
    , private confirm: ConfirmService
    , private _twdService: TwdToForeignService
    , private _checkSecurityService: CheckSecurityService
    , private _authService: AuthService
    , private _formateService: FormateService
  ) {
  }

  ngOnInit() {
    this.fundName = this.setData.fundName;
    // --- 頁面設定 ---- //
    this._headerCtrl.updateOption({
      'leftBtnIcon': 'back'
    });
    this._headerCtrl.setLeftBtnClick(() => {
      this.onBackPageData();
    });
    // --- 頁面設定 End ---- //
    // 安控變數初始化
    this.securityObj = {
      'action': 'init',
      'sendInfo': this.userAddress.SEND_INFO
    };
  }

  ngOnChanges() {
    this.getData();
  }

  private getData() {
    const reqData = {
      trustAcnt: this.setData.trustAcnt,
      transCode: this.setData.transCode,
      fundCode: this.setData.fundCode,
      cost: this.setData.cost
    };
    this._logger.step('FUND', 'setData(FI000701): ', this.setData);
    this._logger.step('FUND', 'content reqData: ', reqData);
    this._mainService.getData(reqData).then(
      (result) => {
        this._logger.step('FUND', 'result(FI000702): ', result);
        this.fullData = result.info_data;
        this.fullData.trustAcnt = (!!this.fullData.trustAcnt) ? this.fullData.trustAcnt : '';
        if (this.fullData.trnsRsltCode == '1') {
          this._logger.step('FUND', '交易失敗 ');
          this.onErrorBackEvent(result);
          return false;
        }
        this._logger.step('FUND', 'this.fullData(FI000702): ', this.fullData);
        this.getTWDList();
      },
      (errorObj) => {
        this.onErrorBackEvent(errorObj);
      }
    );
  }

  //F5000101電文
  private getTWDList() {
    let r_data = {};
    r_data = this.fullData;
    //以下為修改-------------------------------
    let temp_INCurrency = 'TWD';
    let currencyType = 'B'; //台幣(F5000101 request)
    if (r_data['INCurrency'] == 'NTD' || r_data['INCurrency'] == 'TWD') {
      temp_INCurrency = 'TWD';
      currencyType = 'B';
    } else {
      temp_INCurrency = r_data['INCurrency'];
      currencyType = '1';
    }
    //-----------------------------------------
    this._logger.step('FUND', 'result.data profitAcnt: ', r_data['profitAcnt']);
    const defaultAccount = (r_data['profitAcnt'] == '') ? '請選擇' : r_data['profitAcnt'];
    this._twdService.getData(currencyType, defaultAccount).then(
      (resObj) => {
        this.trnsInAccts = resObj.trnsInAccts;
        this.trnsOutAcct = resObj['trnsOutAccts'];
        this._logger.log("trnsOutAcct:", this.trnsOutAcct);
        //---------------- 舊 --------------------
        // if (resObj['_defaultInAccount']) {
        //   this.trnsInAccts.unshift(resObj['_defaultInAccount']);
        // }
        // this.nowType = (typeof this.trnsInAccts[0] !== 'undefined') ? this.trnsInAccts[0] : {};


        let setDef = false;
        //---------------- 2019/08/23修改 START --------------------
        //整理此投資設定帳號，是台幣or外幣
        this.trnsOutAcct.forEach(trnsItem => {
          let tempIn = {};
          //如果702投資設定API的投資幣別為台幣
          if (temp_INCurrency == 'TWD') {
            //帳號列表存在台幣
            if (trnsItem['trnsOutCurr'].indexOf(temp_INCurrency) > -1) {
              tempIn['acctNo'] = trnsItem['trnsfrOutAccnt'];
              if (tempIn['acctNo'] == this.fullData['profitAcnt']) {
                setDef = true;
              } else {
                this.InAC.push(tempIn);
              }
            }
            //如果702投資設定API的投資幣別為外幣
          } else {
            //
            if (trnsItem['trnsOutCurr'].indexOf("TWD") == -1) {
              tempIn['acctNo'] = trnsItem['trnsfrOutAccnt'];
              if (tempIn['acctNo'] == this.fullData['profitAcnt']) {
                setDef = true;
              } else {
                this.InAC.push(tempIn);
              }
            }
          }
        });

        //修改 2019/08/15 (預設 現金收益帳號變更)
        if (typeof this.fullData['profitAcnt'] !== 'undefined' || this.fullData !== null) {
          //702api預設之帳號，為預設
          this.nowType = this.fullData['profitAcnt'];
          this.InAC.unshift({acctNo: this.fullData['profitAcnt']});
          this._logger.log("InAC,last:", this.InAC);
        }
      },
      //---------------- 2019/08/23修改 END --------------------
      (errorObj) => {
        errorObj['type'] = 'dialog';
        this._handleError.handleError(errorObj);
      });
  }

  /**
   * 重新設定page data
   * @param item
   */
  onBackPageData(item?: any) {
    this.confirm.show('您是否放棄此次編輯?', {
      title: '提醒您'
    }).then(
      () => {
        // 返回投資理財選單
        const output = {
          'page': 'content',
          'type': 'back',
          'data': item
        };
        this.backPageEmit.emit(output);
      },
      () => {

      }
    );

  }


  /**
   * 失敗回傳
   * @param error_obj 失敗物件
   */
  onErrorBackEvent(error_obj) {
    const output = {
      'page': 'content',
      'type': 'error',
      'data': error_obj
    };
    this.errorPageEmit.emit(output);
  }

  private changeResultPage() {
    this._logger.step('FUND', '送出資料nowType/ fullData.profitAcnt: ', this.nowType, this.fullData.profitAcnt);
    if (this.nowType == this.fullData.profitAcnt) {
      this._handleError.handleError({
        type: 'dialog',
        title: 'POPUP.NOTICE.TITLE',
        content: '您未變更任何資料...'
      });
    } else {
      // 安控變數設置
      this.securityObj = {
        'action': 'submit',
        'sendInfo': this.userAddress.SEND_INFO
      };
    }
  }

  // 安控函式
  securityOptionBak(e) {
    this._logger.step('FUND', 'securityOptionBak: ', e);
    if (e.status) {
      // 取得需要資料傳遞至下一頁子層變數
      this.userAddress.SEND_INFO = e.sendInfo;
      this.userAddress.USER_SAFE = e.sendInfo.selected;
      this.securityObj = {
        'action': 'init',
        'sendInfo': e.sendInfo
      };
    } else {
      // do errorHandle 錯誤處理 推業或POPUP
      e['type'] = 'message';
      this._handleError.handleError(e.ERROR);
    }
  }

  stepBack(e) {
    this._logger.step('FUND', 'changeResultPage 2: [e]', e);
    if (e.status) {
      if (e.securityType === '3') { // OTP
        e.otpObj.depositNumber = ''; // 轉出帳號
        e.otpObj.depositMoney = ''; // 金額
        e.otpObj.OutCurr = ''; // 幣別
        e.transTypeDesc = ''; //
      } else if (e.securityType === '2') {
        e.signText = {
          'custId': this._authService.getUserInfo().custId,
          'trustAcnt': this.fullData.trustAcnt,
          'transCode': this.fullData.transCode,
          'fundCode': this.setData.fundCode,
          'amount': this._formateService.checkField(this.fullData, 'purchAmnt'),
          'unit': '1',
          'oriProfitAcnt': this.fullData.profitAcnt,
          'profitAcnt': this.nowType,
          'INCurrency': this.setData.iNCurrency,
          'trnsToken': this.fullData.trnsToken
        };
      }
      // 統一叫service 做加密
      this._checkSecurityService.doSecurityNextStep(e).then(
        (S) => {
          this._logger.step('FUND', 'changeResultPage 3: [S]', S);
          // this.safeE = S;
          // 把S做為output傳回;
          // this.backPageEmit.emit({
          //   type: 'goResult',
          //   value: true,
          //   securityResult: S
          // });
          this.safeE = {
            securityResult: S
          };
          this.content_data.custId = this.fullData.custId;
          this.content_data.INCurrency = this.setData.iNCurrency;
          this.content_data.amount = this.fullData.purchAmnt;
          this.content_data.unit = '1';
          this.content_data.trustAcnt = this.fullData.trustAcnt;
          this.content_data.fundCode = this.setData.fundCode;
          this.content_data.transCode = this.fullData.transCode;
          this.content_data.oriProfitAcnt = this.fullData.profitAcnt;
          this.content_data.profitAcnt = this.nowType;
          this.content_data.trnsToken = this.fullData.trnsToken;
          this._logger.step('FUND', 'this.content_data req(FI000704): ', this.content_data);
          this.showContent = true;
        }, (F) => {
          this.backPageEmit.emit({
            type: 'goResult',
            value: false,
            securityResult: F
          });
        }
      );
    } else {
      return false;
    }
  }
}
