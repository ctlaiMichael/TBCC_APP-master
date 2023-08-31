
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { ConfirmOptions } from '@shared/popup/confirm/confirm-options';
import { CheckActivationService } from '../shared/service/check-activation.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { AlertService } from '@shared/popup/alert/alert.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { logger } from '@shared/util/log-util';

@Component({
  selector: 'app-activation-identity',
  templateUrl: 'activation-identity.component.html'
})

export class ActivationIdentityComponent implements OnInit {
  @Output() activationPage: EventEmitter<string> = new EventEmitter<string>();
  @Output() stepObj: EventEmitter<any> = new EventEmitter<any>();

  activation: string;
  titleMsg = '';
  security = {
    'SEND_INFO': '',
    'USER_SAFE': ''
  };
  // 安控傳參
  transactionObj = {
    serviceId: 'FB000704',
    categoryId: '7',
    transAccountType: '1',
  };
  securityObj = {
    'action': 'init',
    'sendInfo': ''
  };
  returnObj = {
    securityResult: {},
    activationPage: ''
  };

  constructor(
    private _logger: Logger
    , private authService: AuthService
    , private _handleError: HandleErrorService
    , private _headerCtrl: HeaderCtrlService
    , private confirm: ConfirmService
    , private _checkActivationService: CheckActivationService
    , private _checkSecurityService: CheckSecurityService
    , private alert: AlertService
    , private navgator: NavgatorService
  ) { }


  ngOnInit() {
    // logger.debug('goldTxFlag:' + this._checkActivationService.goldTxFlag);
    this.activation = this._checkActivationService.goldTxFlag;
    if (this.activation === '0') {
      this.titleMsg = 'GOLD.ACTIVATION_STATUS.APPLY_STOP_ACTIVE';
    } else {
      this.titleMsg = 'GOLD.ACTIVATION_STATUS.APPLY_ACTIVE';
    }
    // header title處理
    this._headerCtrl.updateOption({
      'leftBtnIcon': 'back',
      'title': this.titleMsg
    });
    this._headerCtrl.setLeftBtnClick(() => {
      this.doCancel();
    });

    this.securityObj = {
      'action': 'init',
      'sendInfo': this.security.SEND_INFO
    };
  }

  // 取消
  doCancel() {
    const confirmOpt = new ConfirmOptions();
    confirmOpt.btnYesTitle = 'BTN.CHECK';
    confirmOpt.btnNoTitle = 'BTN.CANCEL';
    confirmOpt.title = 'POPUP.CANCEL_EDIT.TITLE';
    this.confirm.show('POPUP.CANCEL_EDIT.CONTENT', confirmOpt)
      .then(() => {
        this.navgator.popTo('gold-business');
      })
      .catch(() => { });
  }

  // 確定
  check() {
    if (!this.security.SEND_INFO['status']) {
      // error handle
      let errorObj = {
        type: 'dialog',
        content: this.security.SEND_INFO['message'],
        message: this.security.SEND_INFO['message']
      };
      this._handleError.handleError(errorObj);
      return;
    }

    // logger.debug('check');
    this.securityObj = {
      'action': 'submit',
      'sendInfo': this.security.SEND_INFO
    };
    // logger.debug('securityObjx:' + JSON.stringify(this.securityObj));
  }

  // 安控檢核
  securityOptionBak(e) {
    // logger.debug('securityOptionBak:' + JSON.stringify(e));
    if (e.status) {
      // // 取得需要資料傳遞至下一頁子層變數
      this.security.SEND_INFO = e.sendInfo;
      this.security.USER_SAFE = e.sendInfo.selected;
      this.securityObj = {
        'action': 'init',
        'sendInfo': e.sendInfo
      };
      // logger.debug('securityObj1:' + JSON.stringify(this.securityObj));
    } else {
      // e.ERROR['type'] = 'message';
      // this._handleError.handleError(e);
      let error_obj: any = (!!e.ERROR) ? e.ERROR : e;
      error_obj['type'] = 'message';
      this._handleError.handleError(error_obj);
    }
  }

  stepBack(e) {
    // logger.debug('stepBack:' + JSON.stringify(e));
    if (e.status) {
      if (e.securityType === '2') {
        e.signText = {
          'custId': this.authService.getUserInfo().custId,
          'goldTxFlag': this.activation
        };
      }
      // logger.debug('stepBack2:' + JSON.stringify(e));
      // 統一叫service 做加密
      this._checkSecurityService.doSecurityNextStep(e).then(
        (S) => {
          // logger.debug(S);
          // logger.debug('onSend');
          this.returnObj = {
            securityResult: S.headerObj,
            activationPage: 'result'
          }
          this.stepObj.emit(this.returnObj);
        }, (F) => {
          logger.debug(F);
          // return this.alert.show('GOLD.BUY.DO_SECURITY_FAIL', { title: '' })
          // .then( () => {this.navgator.popTo('gold-business'); });
        }
      );
    } else {
      return false;
    }
  }

}
