/**
 * 變更現金收益存入帳號內容頁
 */
import { Component, OnChanges, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { AuthService } from '@core/auth/auth.service';
import { FI000401ApiService } from '@api/fi/fI000401/fI000401-api.service'; // alex0520

@Component({
  selector: 'app-reserve-cancel-content',
  templateUrl: './reserve-cancel-content.component.html',
  styleUrls: [],
  providers: [
  ]
})
export class ReserveCancelContentComponent implements OnInit, OnChanges {
  @Input() setData: any;
  @Input() setDataInfo: any;
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();

  showContent = false; // 顯示編輯頁 false: 編輯頁, true 確認頁
  showResult = false; // 顯示結果頁 false: 確認頁, true 結果頁
  newsNo: any = ''; // 消息編號
  nowType: any = {};
  content_data: any = {
    custId: '', // custId	身分證字號
    reserveTransCode: '', // reserveTransCode	預約編號
    trnsToken: '', // trnsToken	交易控制碼
    branchName: '', // alex0520
    unitCall: ''
  };
  showAccount: any = '';
  cancelBtn: any = '';

  fullData = {
    enrollDate: '' // 交易日期
    , effectDate: '' // 生效日期
    , reserveTransCode: '' // 預約編號
    , transType: '' // 交易項目
    , transTypeDesc: '' // 交易項目說明
    , fundCode: '' // 投資代碼
    , fundName: '' // 投資標的名稱
    , fundRisk: '' // 基金風險屬性
    , investDesc: '' // 投資型態說明
    , transCode: '' // 交易編號
    , currency: '' //  投資幣別
    , iNCurrency: '' // 基金幣別
    , purchAmnt: ''// 申購/轉換/贖回金額
    , serviceFee: '' // 手續費
    , payAccount: '' // 扣款帳號
    , redeemAccount: '' // 入帳帳號
    , lastChangeDate: '' // 處理日期
    , status: '' // 處理結果(交易狀況)
    , statusDesc: '' // 處理結果說明
    , inFundCode: '' // 轉入基金代碼
    , inFundName: '' // 轉入基金名稱
  };

  // request
  userAddress = {
    'USER_SAFE': '',
    'SEND_INFO': ''
  };


  // =====================  安控變數 start =============================
  'SEND_INFO': '';
  transactionObj = {
    serviceId: 'FI000602',
    categoryId: '6', // 基金業務
    transAccountType: '1',
  };

  securityObj = {
    'action': 'init',
    'sendInfo': {}
  };

  safeE = {};
  info_401: any = {}; // alex0520
  // ====================  安控變數 end =============================

  constructor(
    private _logger: Logger
    , private _handleError: HandleErrorService
    , private _headerCtrl: HeaderCtrlService
    , private navgator: NavgatorService
    , private route: ActivatedRoute
    // , private _mainService:
    , private confirm: ConfirmService
    , private _checkSecurityService: CheckSecurityService
    , private _authService: AuthService
    , private _fi000401Service: FI000401ApiService // alex0520
  ) {
  }

  ngOnInit() {
    this._fi000401Service.getAgreeNew().then((resObj) => { // alex0520
      this.info_401 = resObj;
    });

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

    // 20190426 已列出問題，目前fi000601和fi000602 缺少申/轉/贖金額幣別和手續費幣別
    this._logger.step('FUND', 'custId: ', this.setDataInfo.custId);
    this._logger.step('FUND', 'trnsToken: ', this.setDataInfo.trnsToken);
    this._logger.step('FUND', 'trnsDateTime: ', this.setDataInfo.trnsDateTime);
    this._logger.step('FUND', 'setData: ', this.setData);
    this.fullData = this.setData;
    this._logger.step('FUND', 'fullData.status: ', this.fullData.status);
    this.cancelBtn = this.fullData.status;
    this._logger.step('FUND', 'this.fullData.transType: ', this.fullData.transType);
    this._logger.step('FUND', 'this.fullData.payAccount: ', this.fullData.payAccount);
    if (this.fullData.transType === '10' || this.fullData.transType === '20') {
      this.showAccount = this.fullData.payAccount;
    } else if (this.fullData.transType === '30') {
      this.showAccount = this.fullData.redeemAccount;
    }
  }

  ngOnChanges() {
    this._logger.step('FUND', 'setData: ', this.setData);
    this.getData();
  }

  private getData() {
    // const reqData = {
    //   trustAcnt: this.setData.trustAcnt,
    //   transCode: this.setData.transCode
    // };
    // this._logger.step('FUND', 'content reqData: ', reqData);
    // this._mainService.getData(reqData).then(
    //   (result) => {
    //     this.fullData = result.info_data;
    //     this.getTWDList();
    //   },
    //   (errorObj) => {
    //     this.onErrorBackEvent(errorObj);
    //   }
    // );
  }

  /**
   * 重新設定page data
   * @param item
   */
  onBackPageData(item?: any) {
    if (this.showContent == false) {
      // 返回查詢結果頁面
      const output = {
        'page': 'content',
        'type': 'back',
        'data': item
      };
      this.backPageEmit.emit(output);
    } else {
      this.confirm.show('您是否放棄此次編輯?', {
        title: '提醒您'
      }).then(
        () => {
          // 返回查詢頁面
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
  }

  /**
   * 切換確認頁面
   *
   */
  onCheckData() {
    this.showContent = true;
    this.showResult = false;
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
    // 安控變數設置
    this.securityObj = {
      'action': 'submit',
      'sendInfo': this.userAddress.SEND_INFO
    };


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
      if (e.securityType === '3') {
        e.otpObj.depositNumber = ''; // 轉出帳號
        e.otpObj.depositMoney = ''; // 金額
        e.otpObj.OutCurr = ''; // 幣別
        e.transTypeDesc = ''; //
      } else if (e.securityType === '2') {
        e.signText = {
          // 憑證 寫入簽章本文
          'custId': this._authService.getUserInfo().custId,
          'reserveTransCode': this.setData.reserveTransCode,
          'trnsToken': this.setDataInfo.trnsToken,
          'branchName': this.info_401.branchName, // alex
          'unitCall': this.info_401.unitCall

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
          this.content_data.custId = this.setDataInfo.custId;
          this.content_data.reserveTransCode = this.setData.reserveTransCode;
          this.content_data.trnsToken = this.setDataInfo.trnsToken;
          this.content_data.branchName = this.info_401.branchName; // alex0520
          this.content_data.unitCall = this.info_401.unitCall;
          this._logger.step('FUND', '_checkSecurityService 4: ', this.content_data);
          this.showResult = true;
          // this.showContent = true;
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

  public backMenuPage() {
    this.navgator.push('fund');
  }
}
