import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AuthService } from '@core/auth/auth.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { GoldSellBuyService } from '@pages/gold-business/shared/service/gold-sell-buy.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { HandleErrorOptions } from '@core/handle-error/handlerror-options';

@Component({
  selector: 'app-gold-sell-confirm-page',
  templateUrl: './gold-sell-confirm-page.component.html'
})
export class GoldSellConfirmPageComponent implements OnInit,OnDestroy{
  @Input() goldsellInfo; // userAddress;
  @Output() goldsellPage: EventEmitter<string> = new EventEmitter<string>();
  @Output() goldsellResult: EventEmitter<any> = new EventEmitter<any>();

  timeLeft: number = 0; // 倒數秒數80
  interval;
  timeout_flag: boolean = false; // 倒數=0，disable確定按鈕
  // 安控機制
  securityObj = {
    'action': 'init',
    'sendInfo': {}
  }
  // tmpsendInfo = { "status": true, "message": "", "selected": "1", "securityType": "1", "custId": "B121194483", "serviceId": "FB000708", "transAccountType": "1" };
  // tmpsendInfo = { "status": true, "message": "", "selected": "2", "securityType": "2", "custId": "B121194483", "serviceId": "FB000708", "transAccountType": "1" };
  constructor(
    private navigator: NavgatorService,
    private _authService: AuthService,
    private _checkSecurityService: CheckSecurityService,
    private confirmService: ConfirmService,
    private handleError: HandleErrorService,
    private goldSellBuyService: GoldSellBuyService,
    private headerCtrl: HeaderCtrlService
  ) { }

  ngOnInit() {
    this.headerCtrl.setLeftBtnClick(() => { this.cancel() });
    this.timeLeft = this.goldsellInfo.timeLimit;
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else if (this.timeLeft === 0) {
        this.timeout_flag = true;
      } else {
        clearInterval(this.interval);
      }
    }, 1000);
    this.securityObj = {
      'action': 'init',
      'sendInfo': this.goldsellInfo.SEND_INFO
    }
  }

  ngOnDestroy(){
    clearInterval(this.interval);
  }

  stepBack(e) {
    if (e.status) {
      if (e.securityType === '2') { // 1-SSL 2-憑證
        e.signText = {
          custId: this._authService.getUserInfo().custId,
          recType: '2',
          goldAccount: this.goldsellInfo['goldAccount'],
          trnsfrAccount: this.goldsellInfo['trnsfrAccount'],
          goldQuantity: this.goldsellInfo['goldQuantity'],
          goldRateTime: this.goldsellInfo['goldRateTime'],
          gold1GAmt: this.goldsellInfo['gold1GAmt'],
          transAmt: this.goldsellInfo['transAmt'],
          discountAmt: '0', // 回售固定帶 0
          trnsToken: this.goldsellInfo['trnsToken']
        };
      }
      // 統一叫service 做加密
      this._checkSecurityService.doSecurityNextStep(e).then(
        (S) => {
          let reqObj = {
            recType: '2',
            goldAccount: this.goldsellInfo['goldAccount'],
            trnsfrAccount: this.goldsellInfo['trnsfrAccount'],
            goldQuantity: this.goldsellInfo['goldQuantity'],
            goldRateTime: this.goldsellInfo['goldRateTime'],
            gold1GAmt: this.goldsellInfo['gold1GAmt'],
            transAmt: this.goldsellInfo['transAmt'],
            discountAmt: '0', // 回售固定帶 0
            trnsToken: this.goldsellInfo['trnsToken']
          };
          let security = S['headerObj'];

          this.goldSellBuyService.goldTransSend(reqObj, security).then(
            (resObj) => {
              if (resObj.trnsRsltCode === '0') { // 交易成功
                this.goldsellResult.emit(resObj);
                this.goldsellPage.emit('result'); // 切換至result頁
              } else {
                let err = new HandleErrorOptions(resObj.hostCodeMsg, 'ERROR.TITLE');
                err.resultCode = resObj.hostCode;
                err.resultData = resObj;
                err['type'] = 'message';
                this.handleError.handleError(err);
              }
            },
            (errObj) => {
              errObj['type'] = 'message';
              this.handleError.handleError(errObj);
            }
          )

        }, (F) => {
          this.handleError.handleError(F);
          this.navigator.push('gold-business'); // 返回黃金menu
        }
      );
    } else {
      return false;
    }
  }

  /**
   * 上一步
   */
  cancel() {
    this.goldsellPage.emit('edit');
    // this.confirmService.show("是否放棄此次編輯", {
    //   title: 'GOLD.ACTIVATION_STATUS.TITLE'
    // }).then(
    //   () => {
    //     this.navigator.push('gold-business'); // 返回黃金存摺menu
    //   },
    //   () => { }
    // );
  }

  /**
    * 點選確認，傳回
    */
  goResult() {
    this.securityObj = {
      'action': 'submit',
      'sendInfo': this.goldsellInfo.SEND_INFO // this.goldbuyInfo.SEND_INFO
    }
  };

  /**
   * 交易未於時間內完成
   */
  confirm_notification() {
    this.navigator.push('gold-business');
  }
}
