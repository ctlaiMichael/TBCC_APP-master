/**
 * 信託對帳單設定
 */
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
import { FundStatementService } from '../shared/service/fund-statement.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { AuthService } from '@core/auth/auth.service';
import { NavgatorService } from '@core/navgator/navgator.service';


@Component({
  selector: 'app-fund-statement',
  templateUrl: './fund-statement-page.component.html',
  styleUrls: [],
  providers: [FundStatementService]
})
export class FundStatementPageComponent implements OnInit {
  showPage = 'edit';
  mailOut = '';
  oldMailOut = '';
  trnsToken = '';
  security = {
    "USER_SAFE": '',
    "SEND_INFO": ''
  };
  //安控傳參
  transactionObj = {
    serviceId: 'FI000708',
    categoryId: '6',
    transAccountType: '1',
  };
  safeE: any;
  securityObj = {
    'action': 'init',
    'sendInfo': ''
  }
  constructor(
    private _logger: Logger
    , private router: Router
    , private _mainService: FundStatementService
    , private _handleError: HandleErrorService
    , private _headerCtrl: HeaderCtrlService
    , private _checkSecurityService: CheckSecurityService
    , private _authService: AuthService
    , private navgator: NavgatorService
  ) {
  }

  ngOnInit() {
    this.getMailOut()

    this.securityObj = {
      'action': 'init',
      'sendInfo': this.security.SEND_INFO
    }
  }

  /**
   * 取得信託對帳單寄送方式
   */
  getMailOut(): Promise<any> {
    return this._mainService.getMailOut().then(
      (res) => {
        if (res.hasOwnProperty('mailOut') && res.mailOut != '') {
          this.oldMailOut = res.mailOut;
          this.mailOut = res.mailOut;
          this.trnsToken = res.trnsToken;
        }
        this._logger.log(' 707res ', res);
      },
      (errorObj) => {
        this._logger.log('error', errorObj);
        errorObj['type'] = 'message';
        this._handleError.handleError(errorObj);
      }
    );
  };


  goResult() {
    this._logger.log('mail', this.mailOut);
    if (this.mailOut != '2' && this.mailOut != '3') {
      this._handleError.handleError({
        type: 'dialog',
        title: '提醒您',
        content: "請選擇異動方式"
      });
    }
    if (this.mailOut == this.oldMailOut) {
      this._handleError.handleError({
        type: 'dialog',
        title: '提醒您',
        content: "您未變更任何資料"
      });
    } else {
      this.securityObj = {
        'action': 'submit',
        'sendInfo': this.security.SEND_INFO

      }
      
    this._logger.log(' this.security.SEND_INFO', this.security.SEND_INFO);
    }
  };

  /**
     * 送電文前往結果頁 708
     */
  onSend(mailOut, trnsToken, security): Promise<any> {
    if (!this.security.SEND_INFO['status']) {
      //error handle
      let errorObj = {
        type: 'dialog',
        content: this.security.SEND_INFO['message'],
        message: this.security.SEND_INFO['message']
      };
      this._handleError.handleError(errorObj);
      return;
    }

    return this._mainService.onSend(mailOut, trnsToken, security).then(
      (res) => {
        if (res.status) {
          // this.mailOut = res.mailOut;
          this.showPage = 'result';
        }
      },
      (errorObj) => {
        this._logger.log('error', errorObj);
        errorObj['type'] = 'message';
        this._handleError.handleError(errorObj);
      }
    );
  };


  securityOptionBak(e) {
    if (e.status) {
      // 取得需要資料傳遞至下一頁子層變數
      this.security.SEND_INFO = e.sendInfo;
      this.security.USER_SAFE = e.sendInfo.selected;
      this.securityObj = {
        'action': 'init',
        'sendInfo': e.sendInfo
      };
    } else {
      // do errorHandle 錯誤處理 推業或POPUP
      e.ERROR['type'] = 'message';
      this._handleError.handleError(e.ERROR);
    }
    this._logger.log('securityOptionBak',e);
  }

  stepBack(e) {
    this._logger.log(e);
    if (e.status) {
      // OTP須帶入的欄位
      if (e.securityType === '3') {
        e.otpObj.depositNumber = ''; // 轉出帳號
        e.otpObj.depositMoney = ''; // 金額
        e.otpObj.OutCurr = ''; // 幣別
        e.transTypeDesc = ''; // 
      } else if (e.securityType === '2') {
        e.signText = {
          'custId': this._authService.getUserInfo().custId,
          'mailOut': this.mailOut,
          'trnsToken': this.trnsToken
        };
      }
      // 統一叫service 做加密
      this._checkSecurityService.doSecurityNextStep(e).then(
        (S) => {
          this._logger.log(S);
          this.safeE = {
            securityResult: S
          };
          this.onSend(this.mailOut, this.trnsToken, this.safeE);
        }, (F) => {
          this._logger.log(F);
        }
      );
    } else {
      return false;
    }
  }
  goMenu() {
    this.navgator.push('fund', {});
  }
}
