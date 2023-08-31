import { Component, OnInit, ViewChild } from '@angular/core';
import { CheckActivationService } from '@pages/gold-business/shared/service/check-activation.service';
import { ActivationStatementComponent } from '@pages/gold-business/activation/activation-statement.component';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmOptions } from '@shared/popup/confirm/confirm-options';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorOptions } from '@core/handle-error/handlerror-options';

@Component({
  selector: 'app-activation',
  templateUrl: 'activation.component.html'
  // providers: [ActivationStatementComponent]
})

export class ActivationComponent implements OnInit {
  @ViewChild(ActivationStatementComponent) activationStatementComponent: ActivationStatementComponent;

  goldTxFlag: string;
  successMsg: string;
  successDetail: string;
  activation = false; // 預設啟動狀態
  activationPage = 'activation';
  titleMsg = '';

  constructor(
    private _checkActivationService: CheckActivationService,
    private _handleError: HandleErrorService,
    private authService: AuthService,
    private _headerCtrl: HeaderCtrlService,
    private confirm: ConfirmService,
    private navgator: NavgatorService,
  ) {

  }

  ngOnInit() {
    this.checkActivationStatus();
  }

  changePage(pageName) {
    // logger.debug('changePage:' + pageName);
    this.activationPage = pageName;
  }

  goToResultPage(obj) {
    // logger.debug('goToResultPage:' + JSON.stringify(obj));
    if (obj.activationPage === 'result') {
      this.sendActivationResult(obj.securityResult, obj.activationPage);
    }
  }

  // 取消
  doCancel() {
    // logger.debug('this.activationPage:' + this.activationPage);
    if (this.activationPage === 'result' || this.activationPage === 'activation') {
      this.navgator.popTo('gold-business');
    } else {
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
  }

  // 黃金存摺狀態
  doSwitch() {
    if (this.activation) {
      // 開啟=>轉關閉
      this.goldTxFlag = '0';
      this._checkActivationService.goldTxFlag = '0';
      this.changePage('identity');

    } else {
      // 關閉=>轉開啟
      this.goldTxFlag = '1';
      this._checkActivationService.goldTxFlag = '1';
      this.changePage('statement');
    }
  }

  // 狀態更新
  sendActivationResult(security, activationPage) {
    let req = {
      custId: this.authService.getUserInfo().custId, // 'B120281272',
      goldTxFlag: this.goldTxFlag,
    };
    // logger.debug('goldTxFlag' + JSON.stringify(req));
    this._checkActivationService.sendResult(req, security).then(
      (res) => {
        // logger.debug('sendResult:' + JSON.stringify(res));
        if (res.trnsRsltCode === '0') {
          const successDetail = '行動網銀黃金存摺' + (res.goldTxFlag === '1' ? '啟用' : '停用') + '設定成功';
          this.successMsg = '設定成功';
          this.successDetail = successDetail;
          this.activationPage = activationPage;
        } else {
          let err = new HandleErrorOptions(res.trnsRsltMsg, 'ERROR.TITLE');
          err.resultCode = res.trnsRsltCode;
          err.resultData = res;
          err['type'] = 'message';
          this._handleError.handleError(err);
        }
      },
      (error_obj) => {
        // logger.debug('FFFA', error_obj);
        error_obj['type'] = 'message';
        this._handleError.handleError(error_obj);
      }
    );
  }

  checkActivationStatus() {
    // 啟動狀態查詢
    let req = {
      custId: this.authService.getUserInfo().custId,
      trnsType: '8',
    };
    this._checkActivationService.getStatus(req).then(
      (S) => {
        // logger.debug('getStatus:' + JSON.stringify(S));
        if (S.trnsRsltCode === '0') {
          if (S.goldTxFlag === '1') {
            this.activation = true;
            this.titleMsg = 'GOLD.ACTIVATION_STATUS.APPLY_STOP_ACTIVE';
          } else {
            this.activation = false;
            this.titleMsg = 'GOLD.ACTIVATION_STATUS.APPLY_ACTIVE';
          }
          // header title處理
          this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': 'GOLD.ACTIVATION_STATUS.APPLY_ACTIVE' // 20191113user說固定 APPLY_ACTIVE // this.titleMsg
          });
          this._headerCtrl.setLeftBtnClick(() => {
            this.doCancel();
          });
        } else {
          let err = new HandleErrorOptions(S.trnsRsltMsg, 'ERROR.TITLE');
          err.resultCode = S.trnsRsltCode;
          err.resultData = S;
          err['type'] = 'message';
          this._handleError.handleError(err);
        }
      },
      (error_obj) => {
        error_obj['type'] = 'message';
        this._handleError.handleError(error_obj);
      }
    );


  }
}
