import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivationIdentityComponent } from './activation-identity.component';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { ConfirmOptions } from '@shared/popup/confirm/confirm-options';
import { AlertService } from '@shared/popup/alert/alert.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { CheckActivationService } from '../shared/service/check-activation.service';

@Component({
  selector: 'app-activation-statement',
  templateUrl: 'activation-statement.component.html'
  // providers: [ActivationIdentityComponent]
})

export class ActivationStatementComponent implements OnInit {
  @Output() activationPage: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild(ActivationIdentityComponent) activationIdentityComponent: ActivationIdentityComponent;

  agree = false; // 同意事項狀態
  titleMsg = '';
  activation: string;

  constructor(
    private confirm: ConfirmService,
    private alert: AlertService,
    private _headerCtrl: HeaderCtrlService,
    private navgator: NavgatorService,
    private _checkActivationService: CheckActivationService,
  ) { }

  ngOnInit() {
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
  }

  // 已讀?
  haveReadStatus() {
    if (this.agree === false) {
      this.agree = true;
    } else {
      this.agree = false;
    }
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

  // 下一步
  goNext() {
    if (!this.agree) {
      // logger.debug('dialog');
      return this.alert.show('請同意使用者條款', { title: '' })
        .then(() => { });
    } else {
      this.activationPage.emit('identity');
    }

  }

}
