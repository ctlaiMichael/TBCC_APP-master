/**
啟動流程
1.檢查網路->無網路提示->關閉APP
2.F1000103
3.檢查VerReming=1->app更新提示(Native)->前往Store->閉閉APP
4.DirectUpdate檢查->更新->RedirectToUpdate
5.首次啟用檢查->合庫APP使用權限說明->防毒提示(F1000103)
6.JB/Root檢查->整合提示(防毒+JB/Root)
7.FB000601重要公告->!!ErrorCode&&ErrorCode!=11402->顯示錯誤->關閉APP
8.new.no->localStorage沒有||不一樣||!dontShowAgain->顯示公告
9.檢查scheme->導頁
 */
import { Injectable } from '@angular/core';
import { F1000103ApiService } from '@api/f1/f1000103/f1000103-api.service';
import { F1000103ReqBody } from '@api/f1/f1000103/f1000103-req';
import { Fb000601ApiService } from '@api/fb/fb000601/fb000601-api.service';
import { FB000601ReqBody } from '@api/fb/fb000601/fb000601-req';

import { TelegramOption } from '@core/telegram/telegram-option';
import { HandleErrorOptions } from '@core/handle-error/handlerror-options';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { SystemParameterService } from '@core/system/system-parameter/system-parameter.service';
import { environment } from 'environments/environment';

import { NetworkInfoService } from '@lib/plugins/network-info.service';
import { TrustedDeviceService } from '@lib/plugins/trusted-device.service';
import { StartAppService } from '@lib/plugins/start-app/start-app.service';
import { ExitAppService } from '@lib/plugins/exit-app.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { DeviceService } from '@lib/plugins/device.service';
import { CertService } from '@lib/plugins/tcbb/cert.service';
import { SessionStorageService } from '@lib/storage/session-storage.service';
import { NavgatorService } from '@core/navgator/navgator.service';

import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { ConfirmOptions } from '@shared/popup/confirm/confirm-options';
import { AlertService } from '@shared/popup/alert/alert.service';
import { A11yAlertService } from '@shared/popup/a11y/alert/alert.service';
import { A11yConfirmService } from '@shared/popup/a11y/confirm/confirm.service';
import { UrlSchemeHandlerService } from './url-scheme-handler.service';
import { AuthService } from '@core/auth/auth.service';
import { logger } from '@shared/util/log-util';
import { PushService } from '@lib/plugins/push.service';
import { Shortcut3dtouchService } from '@lib/plugins/shortcut3dtouch.service';
import { TrustcertsService } from '@lib/plugins/trustcerts.service';
import { ShortcutService } from '@lib/plugins/shortcut.service';

@Injectable()

export class InitService {
  options: TelegramOption;
  appMode = {isA11y: false};
  isa11y = false;
  logintopage = 'a11yhomekey';
  doAlert:any;
  doConfirm:any;
  constructor(
    private network: NetworkInfoService,
    private errorHandler: HandleErrorService,
    private exitApp: ExitAppService,
    private confirm: ConfirmService,
    private systemParameter: SystemParameterService,
    private F1000103: F1000103ApiService,
    private FB000601: Fb000601ApiService,
    private localStorage: LocalStorageService,
    private alert: AlertService,
    private a11yAlert: A11yAlertService,  
    private a11yConfirm: A11yConfirmService,
    private trustedDevice: TrustedDeviceService,
    private startApp: StartAppService,
    // private webview:WebviewService,
    private auth: AuthService,
    private device: DeviceService,
    private cert: CertService,
    private session: SessionStorageService,
    private urlSchemeHandler: UrlSchemeHandlerService,
    private push: PushService,
    private shortcut3dtouch: Shortcut3dtouchService,
    private trustcerts: TrustcertsService,
    private showcurt: ShortcutService,
   
  ) {
    // 20200601 無障礙非約
    let appMode=this.localStorage.getObj('appMode');
    if(appMode){
      this.appMode = appMode;
    }

    this.isa11y = this.appMode.isA11y;
    if(this.isa11y){
      this.doAlert=this.a11yAlert;
      this.doConfirm=this.a11yConfirm;
    }else{
      this.doAlert=this.alert;
      this.doConfirm=this.confirm;
    }


   }

  init() {
    // 若已初始化不需再次初始化
    if (this.session.get('init') === 'Y') {

      this.device.initUdid().then(() => {
        if (this.auth.isLoggedIn()) {
          const deadline = environment.AUTOLOGOUT_TIME; // 600
          const warningTime = environment.WARNING_BEFORE_LOGOUT_TIME; // 60
          const nowTime = Date.now(); // 現在時間
          const telegramResTime = this.localStorage.get('telegramResTime'); // 電文最後response時間
          const betweenTime = Math.round((nowTime - telegramResTime) / 1000);
          const remainingTime = deadline - betweenTime;  // 剩餘時間
          // logger.debug('nowTime:', nowTime);
          // logger.debug('telegramResTime:', telegramResTime);
          // logger.debug('betweenTime:', betweenTime);
          // logger.debug('remainingTime:', remainingTime);
          logger.log('betweenTime:', '(', nowTime, '-', telegramResTime, ')/1000 =', betweenTime);
          logger.log('remainingTime:', deadline, '-', betweenTime, '=', remainingTime);
          if (!environment.ONLINE && !telegramResTime && telegramResTime != '0') {
            return false; // simulation重整頁面處理(避免重登)
          }
          if (remainingTime <= 0) {
            // 已超過時間登出提示，發登出電文(>=600)
            this.doAlert.show('POPUP.LOGIN.AUTOLOGOUT').then(() => this.auth.logout());
          } else if (remainingTime <= warningTime) {
            // 已到了要提示登出的時間(>=540)
            this.auth.warningIdle(remainingTime);
          }
        }
      });

      // this.trustUnsecureCerts()
      //   .then(() => {
      //     this.device.initUdid().then(() => {
      //       if (!sessionStorage.temp_hitrust_auth || !sessionStorage.temp_auth_token) {
      //         this.auth.getServerCert();
      //       }
      //     });
      //   });
      return;
    }

    let settingInfo = {
      id: 'qrcodeShowPay',
      shortLabel: '出示付款碼',
      longLabel: '出示付款碼',
      intent: {
          action: 'android.intent.action.RUN',
          flags: 67108865,
          data: 'iTCBMobileBank://qrcodeShowPayFromHome'
      }
  };
    this.showcurt.setDynamic([settingInfo]);
    
    this.device.initUdid()
      // 1. 檢查網路
      .then(() => this.checkNetwork())
      // 1-1. only 測試環境使用
      .then(() => this.trustUnsecureCerts())
      // 2-1. 發電文F1000103取得系統參數
      .then(() => this.getSystemParameter())
      // 2-2. 儲存系統參數
      .then(dataF1000103 => this.saveSystemParameter(dataF1000103))
      // 3 檢查VerReming=1->app更新提示(Native)->前往Store->閉閉APP
      .then(() => this.remindStoreUpdate())
      // 4.DirectUpdate檢查->更新->RedirectToUpdate
      .then(() => this.checkDirectUpdate())
      // 5.首次啟用檢查->合庫APP使用權限說明->防毒提示(F1000103)
      .then(() => this.checkFirstStart())
      // 6.JB/Root檢查
      .then(showAntivirus => this.checkTrustDevice(showAntivirus))
      // 6-1 顯示整合提示(防毒+JB/Root)
      .then(showAlertMsg => this.showAlert(showAlertMsg))
      // 7.FB000601重要公告->!!ErrorCode&&ErrorCode!=11402->顯示錯誤->關閉APP
      .then(() => this.getAnnounce())
      // 8.new.no->localStorage沒有||不一樣 ->顯示公告
      .then(dataFB000601 => this.showAnnounce(dataFB000601))
      // 9.push init
      .then(() => this.pushInit())
      // 10.檢查scheme->導頁
      .then(() => this.checkScheme())
      // 異常處理
      .catch(err => {
        this.errorHandler.handleError(err).then(() => {
          this.exitApp.exit();
        });
      });
  }

  /**
   * 檢查網路狀態
   */
  private checkNetwork(): Promise<any> {
    logger.debug('checkNetwork');
    return this.network.checkConnection().then(({ status }) => {
      logger.debug('checkNetwork:' + status);
      if (status === 'NONE') {
        const err = new HandleErrorOptions('ERROR.NO_NETWORK', 'ERROR.TITLE');
        return Promise.reject(err);
      } else {
        // 網路正常
        return;
      }
    });
  }

  /**
   * only 測試環境使用
   */
  private trustUnsecureCerts(): Promise<any> {
    logger.debug('trustUnsecureCerts');
    return this.trustcerts.trustUnsecureCerts()
      .then(() => {
        return Promise.resolve();
      })
      .catch(() => {
        return Promise.resolve();
      });
  }

  /**
   * 發f1000103取得系統參數
   */
  private getSystemParameter(): Promise<any> {
    return new Promise((resolve, reject) => {
      const form = new F1000103ReqBody();
      this.F1000103.send(form)
        .then(f1000103res => {
          resolve(f1000103res.body);
        })
        .catch(err => {
          let error_data: HandleErrorOptions;
          if (err instanceof HandleErrorOptions) {
            error_data = err;
          } else {
            error_data = new HandleErrorOptions('目前無法與伺服器取得連線，請稍後再試！如造成您的困擾，敬請見諒。若有其他疑問，請聯繫客服中心。(ERM002)', 'ERROR.TITLE');
          }
          reject(error_data);
        });
    });
  }

  /**
   * 儲存系統參數
   * @param res f1000103res.body
   */
  private saveSystemParameter(dataF1000103) {
    let key: any;
    // tslint:disable-next-line:forin
    for (key in dataF1000103) {
      this.systemParameter.set(key, dataF1000103[key]);
    }
  }
  /**
   * 提示Store版本更新
   */
  private remindStoreUpdate(): Promise<any> {
    const verRemind = this.systemParameter.get('verRemind');
    // logger.debug('verRemind:' + verRemind);
    if (verRemind === '1') { // 0:不更新 1:更新版本
      const confirmOpt = new ConfirmOptions();
      confirmOpt.btnYesTitle = 'POPUP.NOTICE.UPDATE_BTN';
      confirmOpt.title = 'POPUP.NOTICE.TITLE';
      return this.doConfirm.show('POPUP.NOTICE.VER_REMIND', confirmOpt)
        .then(() => this.startApp.startApp('tcbb'))
        .catch(() => {
          // const error = new HandleErrorOptions('已有最新版本，請至AppStore更新版本。', 'ERROR.TITLE');
          // return Promise.reject(error);
          return;
        });
    }
  }

  /**
   * DirectUpdate檢查->更新->RedirectToUpdate
   */
  private checkDirectUpdate(): Promise<any> {
    logger.debug('checkDirectUpdate');
    if (!environment.DIRECTUPDATE) {
      return Promise.resolve();
    }

    let directUpdateInformation = this.session.get('directUpdateInformation');
    if (typeof directUpdateInformation === 'string' && directUpdateInformation !== '') {
      directUpdateInformation = JSON.parse(directUpdateInformation.replace(/\\/g, ''));
    }
    // logger.debug('directUpdateInformation:' + JSON.stringify(directUpdateInformation));
    if (typeof directUpdateInformation !== 'object') {
      return Promise.resolve();
    }

    // loader路徑
    const loaderPath = 'www/index.html#';
    // 要更新的資訊
    const queryString = '?para_count=' + directUpdateInformation.para_count +
      '&para_path=' + directUpdateInformation.para_path +
      '&para_update=' + directUpdateInformation.para_update +
      '&para_force=' + directUpdateInformation.para_force;

    if (directUpdateInformation.para_force === true) {
      logger.debug('App Force Update'); // 強制更新
      return this.doAlert.show('資料同步', { title: '' })
        .then(() => {
          // logger.debug(window.location.href + loaderPath + queryString);
          window.location.replace(this.device.getCordovaFileApplicationDirectory() + loaderPath + queryString);
        });
    } else if (directUpdateInformation.para_update === true) {
      logger.debug('App Need Update'); // 提示更新
      const confirmOpt = new ConfirmOptions();
      confirmOpt.btnYesTitle = '確定';
      confirmOpt.btnNoTitle = '取消';
      if(!this.isa11y){
        confirmOpt.title = '';
      }else{
        confirmOpt.title = 'POPUP.NOTICE.TITLE';
      }
      return this.doConfirm.show('是否現在執行同步資料', confirmOpt)
        .then(() => {
          // logger.debug(window.location.href + loaderPath + queryString);
          window.location.replace(this.device.getCordovaFileApplicationDirectory() + loaderPath + queryString);
        })
        .catch(() => {
          return Promise.resolve();
        });
    }
  }

  /**
   * 首次啟用檢查->Android建立新憑證table->防毒提示(F1000103)
   */
  private checkFirstStart(): Promise<any> {
    // TODO
    logger.debug('checkFirstStart');
    if (this.localStorage.get('first_use') === null) {
      return this.cert.initTable()// initTable
        .then(() => this.device.devicesInfo())
        .then((deviceInfo) => {
          if (deviceInfo.platform.toLowerCase() === 'android') {
            return '為了提升交易安全，系統建議您於智慧型裝置安裝防毒軟體。';
          } else {  // iOS不顯示防毒軟體的提示;
            return '';
          }
        });
    }
    return Promise.resolve('');
  }

  /**
   * JB/Root檢查
   */
  private checkTrustDevice(showAntivirus): Promise<any> {
    const JB_CHECK_FLAG = this.systemParameter.get('JB_CHECK_FLAG');
    const VIRUS_CHECK_FLAG = this.systemParameter.get('VIRUS_CHECK_FLAG');

    let alertText = '';
    // 整合提示(防毒+JB/Root)
    // JB訊息檢查到破解都會顯示，防毒第一次開啟顯示
    if (JB_CHECK_FLAG === 'Y') {
      return this.trustedDevice.detection()
        .then((trusted) => {
          if (trusted === false) {
            alertText = '系統已經偵測到您的智慧型裝置已破解。提醒您這將可能造成交易過程風險的提升。';
          }
          // 組顯示字串
          if (VIRUS_CHECK_FLAG === 'Y' && !!showAntivirus && !!alertText) {
            alertText = showAntivirus + '\n' + alertText;
          } else {
            alertText = showAntivirus + alertText;
          }
          this.localStorage.set('first_use', 'used');
          return alertText;
        })
        .catch((err) => {
          const error = new HandleErrorOptions('JB/Root檢查失敗', 'ERROR.TITLE');
          return Promise.reject(error);
        });
    }
  }

  /**
   * 顯示整合提示(防毒+JB/Root)
   */
  private showAlert(showAlertMsg): Promise<any> {
    if (!!showAlertMsg) {
      return this.doAlert.show(showAlertMsg).then(() => {
        return Promise.resolve();
      });
    }
    return;
  }

  /**
   * FB000601重要公告->!!ErrorCode&&ErrorCode!=11402->顯示錯誤->關閉APP
   */
  private getAnnounce() {
    return new Promise((resolve, reject) => {
      const form = new FB000601ReqBody();
      this.FB000601.send(form)
        .then(fb000601res => {
          resolve(fb000601res.body);
        })
        .catch(err => {
          if (err.resultCode != '11402') {
            reject(err);
          }
          resolve();
          // const error = new HandleErrorOptions(err, 'ERROR.TITLE');
          // reject(error);
        });
    });
  }

  /**
   * new.no->localStorage沒有||不一樣  ->顯示公告
   * dontShowAgain 好像沒啥用處
   */
  private showAnnounce(dataFB000601) {
    if (!!dataFB000601 &&
      (this.localStorage.get('newsNo') === null
        || this.localStorage.get('newsNo') != dataFB000601.newsNo)
    ) {
      if (!!dataFB000601.newsNo && (!!dataFB000601.newsSubject || !!dataFB000601.newsBody)) {
        const confirmOpt = new ConfirmOptions();
        confirmOpt.btnYesTitle = '不要再提醒';
        confirmOpt.btnNoTitle = '關閉';
        confirmOpt.title = dataFB000601.newsSubject;
        return this.doConfirm.show(dataFB000601.newsBody, confirmOpt)
          .then(() => {
            this.localStorage.set('newsNo', dataFB000601.newsNo);
          })
          .catch(() => {
            return Promise.resolve();
          });
      }
    }
    return Promise.resolve();
  }

  /**
   * push init
   */
  private pushInit() {
    logger.debug('pushInit');
    return new Promise((resolve, reject) => {
      this.push.init()
        .then(res => {
          logger.log('push init res:' + JSON.stringify(res));
          resolve();
        })
        .catch(err => {
          logger.log('push init err:' + JSON.stringify(err));
          resolve();
        });
    });
  }
  /**
   * 檢查是否有urlScheme傳入資料
   */
  // private checkScheme() {
  //   logger.log('checkScheme');
  //   this.session.set('init', 'Y');
  //   // check if app was opened by custom url scheme
  //   const lastUrl: string = (window as any).handleOpenURL_LastURL || '';
  //   if (lastUrl && lastUrl !== '') {
  //     delete (window as any).handleOpenURL_LastURL;
  //     this.urlSchemeHandler.executeScheme(lastUrl);
  //   }
  // }
  private checkScheme() {
    logger.debug('checkScheme');
    this.session.set('init', 'Y');
    // check if app was opened by custom url scheme
    const lastUrl: string = (window as any).handleOpenURL_LastURL || ''; //測試此行mark
    // const lastUrl: string = "iTCBLaunchFromATM://?CardBillRs=PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iQmlnNSI/Pg0KPENhcmRCaWxsc1JzPg0KCTxBY2N0SWRGcm9tPjk5OTc4NzE1MjMyNDcwMTA8L0FjY3RJZEZyb20%2BDQoJPEFjY3RJZFRvPjk5OTg3MTMzMjEzMjM8L0FjY3RJZFRvPg0KCTxCYW5rSWRGcm9tPjAwNjwvQmFua0lkRnJvbT4NCgk8Q2hhbm5lbEZlZT4wPC9DaGFubmVsRmVlPg0KCTxDdXJBbXQ%2BMTA5OTwvQ3VyQW10Pg0KCTxEdWVEdD4yMDEzMDUwNzwvRHVlRHQ%2BDQoJPE1BQz48L01BQz4NCgk8TVNHPqXmqfamqKVcPC9NU0c%2BDQoJPE9OTz4xMDMwMjE0MDAzOTM8L09OTz4NCgk8UEFZTk8%2BMDA2MjcwNDU3OTk1MzAxPC9QQVlOTz4NCgk8UGF5RHQ%2BOTk5OTEyMzE8L1BheUR0Pg0KCTxQYXlUeG5GZWU%2BMDwvUGF5VHhuRmVlPg0KCTxQYXlUeXBlPjU5OTk5PC9QYXlUeXBlPg0KCTxSQz4wMDA8L1JDPg0KCTxSc1VSTD5pVENCTGF1bmNoRnJvbUFUTTovLzwvUnNVUkw%2BDQoJPFNhbGVJbmZvPiAgICAgICAgICAgICAgIC48L1NhbGVJbmZvPg0KCTxTZW5kU2VxTm8%2BMTAzMDIxNDAwMzkzPC9TZW5kU2VxTm8%2BDQoJPFRybkR0PjIwMTQwMjE0PC9Ucm5EdD4NCgk8VHJuVGltZT4xMDQ0MTQ8L1RyblRpbWU%2BDQoJPFR4VHlwZT4yNTYwPC9UeFR5cGU%2BDQoJPFR4blNlcU5vPjMwMTI3MDc8L1R4blNlcU5vPg0KPC9DYXJkQmlsbHNScz4NCg==";
    if (lastUrl && lastUrl !== '') {
      delete (window as any).handleOpenURL_LastURL;
      this.urlSchemeHandler.executeScheme(lastUrl);
    } else {
      const url = window.sessionStorage.getItem('UrlScheme');
      if (url) {
        this.urlSchemeHandler.executeScheme(url);
        delete sessionStorage['UrlScheme'];
      }
    }

    // ios
    // Initialize properly
    this.device.devicesInfo()
      .then((deviceInfo) => {
        if (deviceInfo.platform.toLowerCase() === 'ios') {
          this.shortcut3dtouch.initialize()
            .then(() => {
              const lastUrl_ios: string = (window as any).onShortcutEvent_LastURL || '';
              if (lastUrl_ios && lastUrl_ios !== '') {
                delete (window as any).onShortcutEvent_LastURL;
                this.urlSchemeHandler.executeScheme(lastUrl_ios);
              }
            });
        }
      });

  }
}
