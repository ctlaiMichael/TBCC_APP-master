import { Injectable } from '@angular/core';
import { ERROR_INFO_MSG } from '@conf/error/error_code';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { HandleErrorOptions } from './handlerror-options';
import { A11yAlertService } from '@shared/popup/a11y/alert/alert.service';
import { SystemParameterService } from '@core/system/system-parameter/system-parameter.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { A11yConfirmService } from '@shared/popup/a11y/confirm/confirm.service';
import { CacheService } from '@core/system/cache/cache.service';
import { StartAppService } from '@lib/plugins/start-app/start-app.service';
@Injectable()
export class HandleErrorService {

  defaultOptions: HandleErrorOptions;
  appMode = { isA11y: false };
  isa11y = false;
  authError = ['ERR19501', 'ERR10001', 'ERR10011', 'ERR5012'];
  bioPatternError = ['ERRBI_0009', 'ERRBI_0010'];
  constructor(
    private navgator: NavgatorService,
    private alert: AlertService,
    private a11yalert: A11yAlertService,
    private systemparameter: SystemParameterService,
    private confirm: ConfirmService,
    private a11yconfirm: A11yConfirmService,
    private _localStorage: LocalStorageService,
    private cacheService: CacheService,
    private startApp: StartAppService
  ) {

  }

  /**
    * 異常處理
    * @param error 處理的error
    *          title dialog的default title
    *          content dialog的default content
    *          event 執行dialog的回傳evnet
    *          event_reset 是否強制取代dialog event (預設不取代)
    */
  public handleError(error: HandleErrorOptions = {}) {
    this.appMode = this._localStorage.getObj('appMode');
    this.isa11y = this.appMode.isA11y;
    if (!!error['ERROR'] && !!error['sendInfo']) {
      // from select-security.component response
      error = error['ERROR'];
    }
    this.defaultOptions = new HandleErrorOptions();
    let option = { ...this.defaultOptions, ...error };
    if (!error.content && !!error['msg']) {
      option.content = error['msg'];
    }

    if (option.hasOwnProperty("resultCode") && option.resultCode == "ERR10006") {
      return this.alert.show(option.content, { title: 'POPUP.NOTICE.TITLE', btnTitle: 'POPUP.NOTICE.UPDATE_BTN' })
        .then(() => this.startApp.startApp('tcbb'))
        .catch(() => {
          return;
        });
    }
    // == 資料處理 (如果預設值設定不給content，固定回中台錯誤訊息) == //
    // if (typeof errorObj === 'string') {
    //   option.content = errorObj;
    // } else if (errorObj instanceof Object) {
    //   if (errorObj.hasOwnProperty('respCodeMsg')) {
    //     option.content = errorObj.respCodeMsg;
    //   }
    // }
    // const option = this._modifySet(errorObj, otherSet);
    switch (option.type) {
      // 倒轉特別頁
      case 'message':
        // // 預設回到首頁
        // const backType = (option.hasOwnProperty('backType')) ? option['backType'] : '0';
        // const message_obj = {
        //   title: option.title  ,
        //   content: option.content,
        //   backType: backType
        // };
        // // 取代按鈕
        // if (option.hasOwnProperty('buttonList')
        //   && option.buttonList instanceof Array && option.buttonList.length > 1
        // ) {
        //   message_obj['button'] = option.buttonList;
        // }
        if (this.bioPatternError.indexOf(option.resultCode) > -1) {
          const loginRemember = this._localStorage.getObj('Remember');
            if (option.resultCode === 'ERRBI_0010') {
              loginRemember.ftlogin.fastlogin = '0';
              loginRemember.ftlogin.type = loginRemember.ftlogin.hasPatternLock == '1' ? 'pattern' : 'pwdlogin';
              loginRemember.ftlogin.pay_setting = '0';
              this._localStorage.setObj('Remember', loginRemember);
            } else if (option.resultCode === 'ERRBI_0009') {
              loginRemember.ftlogin.hasPatternLock = '0';
              loginRemember.ftlogin.type = loginRemember.ftlogin.fastlogin == '1' ? 'biometric' : 'pwdlogin';
              loginRemember.ftlogin.patterLoginErrorCount = '0';
              loginRemember.ftlogin.payPattern = '0';
              delete localStorage['keepPatternLock'];
              this._localStorage.setObj('Remember', loginRemember);
            }
            // epay cache強制清除
            this.cacheService.removeGroup('epay-security');
        }
        if (this.isa11y) {
          this.navgator.push('a11yResultPage', option); // message頁面 目前尚未設定
        }else{
          this.navgator.push('result', option); // message頁面 目前尚未設定
        }
      
        break;

      // 重新導向指定頁面
      case 'redirect':
        // 預設回上一頁
        const redirect_back_type = (option.hasOwnProperty('backType')) ? option['backType'] : '1';
        const redirect_obj = {
          title: option.title,
          content: option.content,
          backType: redirect_back_type.trim()
        };
        if (this.authError.indexOf(option.resultCode) > -1) {
          this.navgator.authError();
        }
        switch (redirect_obj.backType) {
          case '0':
            if (!this.isa11y) {
              this.navgator.push('home');
            } else {
              this.navgator.push('a11yhomekey');
            }
            break;
          case '1':
          case '':
            this.navgator.pop();
            break;
          default:
            this.navgator.push(redirect_obj.backType);
            break;
        }
        break;
      // popup顯示
      case 'result':
        this.navgator.push('result', option);
        break;
      case 'confirm':
        if (!this.isa11y) {
          return this.confirm.show(option.content, option);
        } else {
          return this.a11yconfirm.show(option.content, option);
        }
      case 'alert':
      case 'dialog':
      default:
        // == dialog == //
        if (!this.isa11y) {
          if (this.authError.indexOf(option.resultCode) > -1) {
            // return new Promise(function (resolve)，會導致this並不是指向外面而取不到alert，因而改成箭頭函式
            return new Promise((resolve) => {
              this.alert.show(option.content, option).then(() => {
                this.navgator.authError();
                resolve();
              });
            });
          } else {
            return this.alert.show(option.content, option);
          }
        } else {
          return this.a11yalert.show(option.content, option);
        }
    }
  }
}
