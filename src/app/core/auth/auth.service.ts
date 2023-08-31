import { Injectable, NgZone } from '@angular/core';
import { F1000102ApiService } from '@api/f1/f1000102/f1000102-api.service';
import { F1000102ReqBody } from '@api/f1/f1000102/f1000102-req';
import { TcbbService } from '@lib/plugins/tcbb/tcbb.service';
import { AuthUserInfo } from './auth-userinfo';
import { OtpUserInfo } from './otp-userinfo.class';
import { NavgatorService } from '@core/navgator/navgator.service';
import { F1000109ApiService } from '@api/f1/f1000109/f1000109-api.service';
import { F1000109ReqBody } from '@api/f1/f1000109/f1000109-req-body';
import { Router } from '@angular/router';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { SessionStorageService } from '@lib/storage/session-storage.service';
import { FormateService } from '@shared/formate/formate.service';
import { Logger } from '@core/system/logger/logger.service';
import { TmpUserInfo } from '@core/auth/tmp-userinfo';
import { HandshakeService } from '@core/telegram/handshake.service';
import { Timer } from '@shared/util/timer.class';
import { environment } from '@environments/environment';
import { TelegramService } from '@core/telegram/telegram.service';
import { logger } from '@shared/util/log-util';
import { AutoLogoutService } from '@shared/popup/auto-logout/auto-logout.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { ObjectUtil } from '@shared/util/formate/modify/object-util';
import { CacheService } from '@core/system/cache/cache.service';
import { MicroInteractionService } from '@core/layout/micro-interaction.service';
import { CommonUtil } from '@shared/util/common-util';
import { DateCheckUtil } from '@shared/util/check/date-check-util';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { SystemParameterService } from '@core/system/system-parameter/system-parameter.service';
import { A11yAutoLogoutService } from '@shared/popup/a11y/auto-logout/auto-logout.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { F1000103ApiService } from '@api/f1/f1000103/f1000103-api.service';
import { PersonalInfo } from '@core/layout/header/personal-info';
import { A11yAlertService } from '@shared/popup/a11y/alert/alert.service';
import { A11yConfirmService } from '@shared/popup/a11y/confirm/confirm.service';


@Injectable()
export class AuthService {
  redirectUrl: string;
  userInfo: AuthUserInfo;
  nbCert: string;
  tmpInfo: TmpUserInfo; // 登入後暫存之資訊(因登入後無更新資料，導至系統相關功能異常)
  autoLogoutTimer: Timer;
  pauseTime: number;
  subscriptAuthError: any;
  appMode = {isA11y: false};
  isa11y = false; // 是否啟用無障礙

  constructor(
    private zone: NgZone,
    private f1000102: F1000102ApiService,
    private f1000109: F1000109ApiService,
    private f1000103: F1000103ApiService,
    private tcbb: TcbbService,
    private navgator: NavgatorService,
    private headerCtrl: HeaderCtrlService,
    private router: Router,
    private handshake: HandshakeService,
    private session: SessionStorageService,
    private telegram: TelegramService<{}>,
    private autoLogoutTimeBomb: AutoLogoutService,
    private alert: AlertService,
    private _formateService: FormateService,
    private cache: CacheService,
    private microInteraction: MicroInteractionService,
    private _logger: Logger,
    private systemparameter: SystemParameterService,
    private a11yautoLogoutTimeBomb: A11yAutoLogoutService,
    private a11yalert: A11yAlertService,
    private a11yconfirm: A11yConfirmService,
    private localStorageService: LocalStorageService,
    private confirm: ConfirmService
  ) {
    // this.userInfo = new AuthUserInfo();
    if (this.isLoggedIn()) {
      this.initTimer();
    }
    document.addEventListener('pause', () => {
      logger.log('[STEP] APP on pause');
      this.onPauseHandler();
    }, false);

    document.addEventListener('resume', () => {
      logger.log('[STEP] APP on resume');
      this.onResumeHandler();
    }, false);

    this.subscriptAuthError = this.navgator.authErrorSubject.subscribe(() => {
      this.logout();
    });
  }

  onPauseHandler() {
    // 取得無障礙的啟用參數
    this.appMode = this.localStorageService.getObj('appMode');
    this.isa11y = this.appMode.isA11y;    
    // 是否為無障礙
    if (!!this.isa11y) {
      if (this.a11yautoLogoutTimeBomb.isOpened()) {
        this.a11yautoLogoutTimeBomb.destroy();
      }
    } else {
    if (this.autoLogoutTimeBomb.isOpened()) {
      this.autoLogoutTimeBomb.destroy();
    }
    }
    if (this.isLoggedIn()) {
      this.zone.run(() => {
        this.pauseTime = new Date().getTime();
        this.autoLogoutTimer.stop();
      });
    }
  }

  onResumeHandler() {
    this.appMode = this.localStorageService.getObj('appMode');
    this.isa11y = this.appMode.isA11y;
    if (this.isLoggedIn()) {
      this.zone.run(() => {
        const now = new Date().getTime();
        const backgroundTime = Math.round((now - this.pauseTime) / 1000);
        const deadline = environment.AUTOLOGOUT_TIME;
        const warningTime = environment.WARNING_BEFORE_LOGOUT_TIME;
        if (!!this.autoLogoutTimer) {
          const t = this.autoLogoutTimer.getTime();
          const idleTime = t + backgroundTime;
          // 更新閒置時間
          this.autoLogoutTimer.setTime(idleTime);
          this.autoLogoutTimer.resume();
          const remainingTime = deadline - idleTime;  // 剩餘時間
          if (remainingTime <= 0) {
            // 已超過時間登出提示，發登出電文
            if (!!this.isa11y) {
              this.a11yalert.show('POPUP.LOGIN.AUTOLOGOUT').then(() => { this.a11ylogout(); });
            } else {
            this.alert.show('POPUP.LOGIN.AUTOLOGOUT').then(() => { this.logout(); });
            }
          } else if (remainingTime <= warningTime) {
            // 已到了要提示登出的時間
            this.warningIdle(remainingTime);
          }
          //  else {
          //   // 還在有效時間內
          // }
        } else {
          // 已登入但無計時? 此狀態不該出現
          // 提示已超過時間登出，發登出電文
          if (!!this.isa11y) {
            this.a11yalert.show('POPUP.LOGIN.AUTOLOGOUT').then(() => { this.a11ylogout(); });
          } else {
          this.alert.show('POPUP.LOGIN.AUTOLOGOUT').then(() => { this.logout(); });
        }
        }
      });
    }
  }

  /**
   * 登入狀態檢查
   */
  isLoggedIn(): boolean {
    return !!this.getUserInfo();
  }

  /**
   * 登出
   */
  logout(): Promise<any> {
    const req = new F1000109ReqBody();
    req.custId = this.getUserInfo().custId;

    //清空header的變數值
    let assets_data = new PersonalInfo();
    let empty_str = '- -';
    assets_data.bill = empty_str;
    assets_data.deposit = empty_str;
    this.headerCtrl.setPersonalInfo(assets_data);

    this.handshake.reset();
    delete sessionStorage.userInfo;
    delete sessionStorage.userTmpInfo;
    delete sessionStorage.temp_auth_token;
    delete sessionStorage.temp_hitrust_auth;
    this.stopTimer();
    this.cache.clear('login');

    this.headerCtrl.closePopup();
    if (!!this.autoLogoutTimer) {
      this.autoLogoutTimer.stop();
      delete this.autoLogoutTimer;
    }
    if (this.autoLogoutTimeBomb.isOpened()) {
      this.autoLogoutTimeBomb.destroy();
    }

    this.microInteraction.displayMicroBox(false);
    this.navgator.home();
    this.session.setObj("login_method","");
    return this.f1000109.send(req, {background: true});
      // .then(res => {
      //   this.handshake.reset();
      //   // this.userInfo = null;
      //   delete sessionStorage.userInfo;
      //   delete sessionStorage.userTmpInfo;
      //   delete sessionStorage.temp_auth_token;
      //   delete sessionStorage.temp_hitrust_auth;
      //   this.stopTimer();
      //   this.cache.clear('login');
      // })
      // .catch(error => {
      //   this.handshake.reset();
      //   delete sessionStorage.userInfo;
      //   delete sessionStorage.userTmpInfo;
      //   delete sessionStorage.temp_auth_token;
      //   delete sessionStorage.temp_hitrust_auth;
      //   this.stopTimer();
      //   this.cache.clear('login');
      // })
      // // .then(() => {
      // //   const form = new F1000102ReqBody();
      // //   return this.f1000102.send(form);
      // // })
      // .then(() => {
      //   this.headerCtrl.closePopup();
      //   if (!!this.autoLogoutTimer) {
      //     this.autoLogoutTimer.stop();
      //     delete this.autoLogoutTimer;
      //   }
      //   if (this.autoLogoutTimeBomb.isOpened()) {
      //     this.autoLogoutTimeBomb.destroy();
      //   }
      //   // this.navgator.displaymicroBoxSubject.next(false);
      //   this.microInteraction.displayMicroBox(false);
      //   this.navgator.home();
      // });
  }
  /**
   * 無障礙登出
   */
  a11ylogout(): Promise<any> {
    const req = new F1000109ReqBody();
    req.custId = this.getUserInfo().custId;
    return this.f1000109.send(req).then(res => {
      this.handshake.reset();
      // this.userInfo = null;
      delete sessionStorage.userInfo;
      delete sessionStorage.userTmpInfo;
      delete sessionStorage.temp_auth_token;
      delete sessionStorage.temp_hitrust_auth;
      this.stopTimer();
      this.cache.clear('login');
    }).catch(error => {
      // this.userInfo = null;
      this.handshake.reset();
      delete sessionStorage.userInfo;
      delete sessionStorage.userTmpInfo;
      delete sessionStorage.temp_auth_token;
      delete sessionStorage.temp_hitrust_auth;
      this.stopTimer();
      this.cache.clear('login');
    }).then(() => {
      this.headerCtrl.closePopup();
      if (!!this.autoLogoutTimer) {
        this.autoLogoutTimer.stop();
        delete this.autoLogoutTimer;
      }
      if (this.a11yautoLogoutTimeBomb.isOpened()) {
        this.a11yautoLogoutTimeBomb.destroy();
      }
      this.microInteraction.displayMicroBox(false);
      this.navgator.push('a11yhomekey');
    });
  }

  /**
   * 登入後導頁
   */
  redirectAfterLogin() {
    let path = 'user-home';
    // 共同行銷Ｓtart

    let refuseMarkingType = this.getUserInfo().refuseMarkingType;
    if(refuseMarkingType == '0'){ 
      this.navgator.push('commonMarket',{fnctId:'L'});
      return;
    }
    // 共同行銷End

    if (!!this.redirectUrl) {
      this.session.remove('redirectToOldMenu');
      const header = this.navgator.getHeader();
      const args = this.redirectUrl.split('?');
      path = args[0];
      this.redirectUrl = null;
      this.headerCtrl.setOption(header);
      if (args.length > 1) {
        const param = CommonUtil.uriToJson(args[1]);
        this.router.navigate([path], { queryParams: param });
      } else {
        this.router.navigate([path]);
      }
      return;
    }
    const redirect = this.session.get('redirect');
    if (!!redirect) {
      this.session.remove('redirect');
      this.session.remove('redirectToOld');
      this.session.remove('redirectToOldMenu');
      path = redirect;
      this.navgator.push(path);
      return;
    }
    const redirectToOldMenu = this.session.get('redirectToOldMenu');
    if(!!redirectToOldMenu){
      let path_redirect=redirectToOldMenu;
      this.session.remove('redirectToOld');
      this.session.remove('redirectToOldMenu');
      this.navgator.push(path_redirect);
      return false;
    }
    const redirectToOld = this.session.get('redirectToOld');
    if (!!redirectToOld) {
      let path_redirect=redirectToOld;
      this.session.remove('redirectToOld');
      this.session.remove('redirectToOldMenu');
      window.location.replace(path_redirect);
      return false;
    }

    this.navgator.push(path);
  }
  /**
     * 無障礙登入後導頁
     */
  a11yredirectAfterLogin(info) {
    let path = info;
    if (!!this.redirectUrl) {
      path = this.redirectUrl;
      this.redirectUrl = null;
    }
    this.navgator.push(path);
  }

  /**
   * F1000102取得伺服器憑證
   */
  getServerCert(): Promise<string> {
    if (!!this.nbCert) {
      return Promise.resolve(this.nbCert);
    }
    const form = new F1000102ReqBody();
    return this.f1000102.send(form)
      .then(res => {
        this.nbCert = res.body.nbCert;
        return this.nbCert;
      });
  }

  /**
   * 數位信封
   * @param signText 密碼
   */
  digitalEnvelop(signText): Promise<any> {
    // return new Promise((resolve, reject) => {
    return this.getServerCert()
      .then(nbCert => this.tcbb.doCGUMethod('CertEncrypt', nbCert, signText))
      // .then((res_CertEncrypt) => {
      //   logger.debug('res_CertEncrypt', res_CertEncrypt);
      //   return res_CertEncrypt;
      // })
      .catch((err) => {
        return Promise.reject(err);
      });
  }

  /**
   * 保持登入
   */
  keepLogin() {
    // this.getServerCert();
    this.f1000103.send({}, {background: true});
    this.resetTimer();
  }

  /**
   * 登出提示
   */
  warningIdle(deadline: number) {
    // 取得無障礙的啟用參數
    this.appMode = this.localStorageService.getObj('appMode');
    this.isa11y = this.appMode.isA11y;
    if (!!this.isa11y) {
      if (this.isLoggedIn() && !this.a11yautoLogoutTimeBomb.isOpened()) {
        this.a11yautoLogoutTimeBomb.show(deadline)
          .then(() => this.keepLogin())
          .catch(() => this.a11ylogout());
      }
    } else {
    if (this.isLoggedIn() && !this.autoLogoutTimeBomb.isOpened()) {
      this.autoLogoutTimeBomb.show(deadline)
        .then(() => this.keepLogin())
          .catch(() => this.logout());
        }
    }
  }

  /**
   * 初始化登出倒數
   */
  initTimer() {
    const self = this;
    const deadline = environment.AUTOLOGOUT_TIME - environment.WARNING_BEFORE_LOGOUT_TIME;
    if (!this.autoLogoutTimer) {
      this.autoLogoutTimer = new Timer(deadline, function () {
        self.warningIdle(environment.WARNING_BEFORE_LOGOUT_TIME);
      });
    }
    // this.autoLogoutTimer = this.autoLogoutTimer || new Timer(deadline, function () {
    //   self.warningIdle(environment.WARNING_BEFORE_LOGOUT_TIME);
    // });
    this.telegram.telegramSubject.subscribe(() => { this.resetTimer(); });
  }

  /**
   * 重設計時
   */
  resetTimer() {
    if (!!this.autoLogoutTimer) {
      this.autoLogoutTimer.restart();
    }
  }

  /**
   * 停止計時
   */
  stopTimer() {
    if (!!this.autoLogoutTimer) {
      this.autoLogoutTimer.stop();
      delete this.autoLogoutTimer;
    }
  }

  /**
   * 設定登入後資訊
   * @param setObj response
   * @param userid userid
   */
  setUserInfo(setObj: AuthUserInfo, userid: string) {
    logger.error('setUserInfo',setObj,userid);
    this.userInfo = setObj;
    // 避免清除資料時錯誤
    if (!!this.userInfo) {
      this.userInfo.userId = userid;
      this.userInfo.lastUpdate = new Date().getTime();
    }
    this.userInfo.AuthType = (!!setObj.AuthType) ? setObj.AuthType : '';
    this.session.setObj('userInfo', this.userInfo);
    this.tmpUserInfoInit();
  }

  /**
   * 設定登入後資訊
   * @param setObj response
   * @param userid userid
   */
  setCn(cn: string, sn: string) {
    this.userInfo.cn = cn;
    this.userInfo.serialNumber = sn;
    this.userInfo.lastUpdate = new Date().getTime();
    this.session.setObj('userInfo', this.userInfo);
  }

  /**
  * 設定登入更新
  * @param updateObj
  */
  updateInfo(updateObj: object) {
    let old_user = this.getUserInfo();
    this.userInfo = { ...old_user, ...updateObj };
    this.userInfo.lastUpdate = new Date().getTime();
    this.session.setObj('userInfo', this.userInfo);
  }

  /**
   * 取得userInfo
   */
  getUserInfo(): AuthUserInfo {
    // const returnObj = ObjectUtil.clone(this.userInfo);
    const returnObj = this.session.getObj('userInfo');
    return returnObj;
  }

  /**
   * 取得userId in session
   */
  getUserId(): Promise<string> {
    const returnObj = this.session.getObj('userInfo');
    return Promise.resolve(returnObj.userId);
  }

  /**
   * 取得userId in userInfo
   */
  getUserIdStr(): string {
    const userData = this.getUserInfo();
    if (userData && userData.hasOwnProperty('userId') && userData.userId !== '') {
      return userData.userId;
    } else {
      return '';
    }
  }

  /**
   * 取得CustId
   * 當custid為空，請判斷
   */
  getCustId(): string {
    const userData = this.getUserInfo();
    if (userData && userData.hasOwnProperty('custId') && userData.custId !== '') {
      return userData.custId;
    } else {
      return '';
    }
  }

  /**
   * 檢查是否下載憑證
   */
  checkDownloadCA(check_end_date?: boolean): boolean {
    if (!this.isLoggedIn()) {
      return false;
    }
    const userData = this.getUserInfo();
    const cn = userData.cn;
    const sn = userData.serialNumber;
    // this._logger.log('cnEndDate', this.userInfo);
    if (cn && cn !== '' && sn && sn !== '') {
      // 憑證效期判斷
      if (!!check_end_date) {
        let todayDate = this._formateService.transDate('NOW_TIME');
        let apiCnEndDate = todayDate; // 憑證到期日
        if (!!userData && !!userData.cnEndDate) {
          apiCnEndDate = userData.cnEndDate;
        }
        let cnEndDate = this._formateService.transDate(apiCnEndDate, 'date');

        if (DateCheckUtil.checkSelectedDate(todayDate, cnEndDate, '<=')) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }

  /**
   * 判斷是否允許使用OTP安控
   * @param checkBind 是否檢查裝置綁定狀態
   */
  checkAllowOtp(checkBind: boolean = false): boolean {
    let output = false;
    let otpInfo = this.getOtpUserInfo();
    if (otpInfo.checkOtpAllow(checkBind)) {
      output = true;
    }
    return output;
  }

  /**
   * 判斷允許做OTP
   */
  checkSecurityOtp() {

    this.appMode = this.localStorageService.getObj('appMode');
    this.isa11y = this.appMode.isA11y;

    let output = false;
    let otpInfo = this.getOtpUserInfo();
    let check_otpallow = otpInfo.checkOtpAllowStatus();
    
    let confirm:any;
    let alert:any;
    confirm=this.confirm;
    alert=this.alert;
    let device_path='device-bind';

    if(this.isa11y){ 
      confirm=this.a11yconfirm;  
      alert=this.a11yalert;
      device_path='a11yDeviceBind';
    }
    if (check_otpallow.status) {
      output = true;
    } else if (!check_otpallow.bind) {
      confirm.bindDevice().then(
          () => {
            this.navgator.push(device_path);
          },
          () => {
            if(this.isa11y){ 
              this.navgator.push('a11yhomekey');
            }
          }
      );

    } else {
      alert.show(check_otpallow.msg , {
        title: 'ERROR.INFO_TITLE'
      }).then(()=>{
        if(this.isa11y){ 
          this.navgator.push('a11yhomekey');
        }
      });
    }
    return output;
  }

  /**
   * 判斷是否允許使用OTP和憑證安控
   * @param checkBind 是否檢查裝置綁定狀態
   */
  checkAllowOtpAndCA(checkBind: boolean = false): boolean {
    let output = false;
    let otpInfo = this.getOtpUserInfo();
    let allow_security = this.getAllowSecurity();
    if (allow_security.otp || allow_security.ca) {
      output = true;
    }
    return output;
  }

  /**
   * 取得OTP資訊與狀況判斷
   */
  getOtpUserInfo(): OtpUserInfo {
    // 取得OTP資訊
    const userData = this.getUserInfo();
    const loginFlag = this.isLoggedIn();
    const downloadCa = this.checkDownloadCA();
    let output = new OtpUserInfo(userData, loginFlag, downloadCa, this.tmpInfo);
    return output;
  }


  /**
   * 取得暫存資訊
   */
  getTmpInfo(set_key?: string, check_type?: string) {
    let output: any = ObjectUtil.clone(this.tmpInfo);
    if (typeof set_key !== 'undefined') {
      output = this._formateService.checkObjectList(output, set_key);
      if (typeof output == 'undefined' && !!check_type) {
        if (check_type === 'string') {
          output = '';
        }
      }
    }
    return output;
  }

  /**
   * 設定裝置綁定與OTP資訊
   * (除非重新登入否則無法更新之資訊)
  * @param updateObj
   */
  updateTmpInfo(updateObj: object) {
    this.tmpInfo = { ...this.tmpInfo, ...updateObj };
    this._logger.log('tmpInfo:', this.tmpInfo);
    this.session.setObj('userTmpInfo', this.tmpInfo);
    // 特殊資料同步
    let user_info = this.getUserInfo();
    if (!!user_info && !!user_info.BoundID && user_info.BoundID != this.tmpInfo.BoundID) {
      this.updateInfo({ BoundID: this.tmpInfo.BoundID });
    }
  }

  /**
   * 登入設定資訊暫存(後續其他功能異動可能變更)
   */
  tmpUserInfoInit() {
    // 處理其他設定檔
    if (!this.isLoggedIn()) {
      return false;
    }
    this.tmpInfo = new TmpUserInfo();
    const check_list = ['BoundID', 'OtpCustInfo'];
    let user_info = this.getUserInfo();
    check_list.forEach(check_key => {
      if (this.tmpInfo.hasOwnProperty(check_key) && !!user_info[check_key]) {
        this.tmpInfo[check_key] = user_info[check_key];
      }
    });
    this.session.setObj('userTmpInfo', this.tmpInfo);
  }

  /**
   * 設定黃金存摺帳戶狀態
   */
  setGoldAcct(status: string) {
    const userData = this.getUserInfo();
    userData.goldAcct = status;
    this.setUserInfo(userData, userData.custId);
    // console.log('setGoldAcct:' + JSON.stringify(this.getUserInfo()));
  }
  /**
   * 取得生物辨識登入資訊
   */
  getBioUserInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      const tempRem = this.localStorageService.getObj('Remember');
      const tempFtData = this.localStorageService.getObj('Compare');
      let output: any = {
        status: false,
        msg: '',
        have_login: false,
        login: {
          custId: '',
          userId: ''
        },
        have_bio: false,
        bio: {
          custId: '',
          userId: ''
        },
        error_data: {}
      };
      if (!tempRem ||  !tempRem.userData || !tempRem.userData.custId || !tempRem.userData.userId) {
        output.status = true;
        resolve(output);
        return false;
      }

      this.tcbb.fastAESDecode([tempRem.userData.custId, tempRem.userData.userId]).then(
        (res_Dncode) => {
          output.have_login = true;
          output.login.custId = res_Dncode.custId;
          output.login.userId = res_Dncode.userId;
          if (!tempFtData || !tempFtData.comparecustId || !tempFtData.compareuserId) {
            output.status = true;
            resolve(output);
            return false;
          }
          this.tcbb.fastAESDecode([tempFtData.comparecustId, tempFtData.compareuserId]).then(
            (resBioDncode) => {
              output.have_bio = true;
              output.bio.custId = resBioDncode.custId;
              output.bio.userId = resBioDncode.userId;
              output.status = true;
              resolve(output);
            },
            (errorBioDncode) => {
              output.msg = 'Decode bio data error';
              output.error_data = errorBioDncode;
              reject(output);
            }
          );
        },
        (error_Dncode) => {
          output.msg = 'Decode login data error';
          output.error_data = error_Dncode;
          reject(output);
        }
      );
    });

  }

  /**
   * 取得允許的權限
   */
  getAllowSecurity() {
    let output = {
      allow: [],
      ssl: false,
      ca: false,
      otp: false,
      bio: false,
      authType: [],
      default: ''
    };
    if (this.isLoggedIn()) {
      let usinfo = this.getUserInfo();
      let dfAuth = this._formateService.checkField(usinfo, 'DefAuthType');
      let authType = this._formateService.checkField(usinfo, 'AuthType');
      let auth_list = authType.split(',');
      auth_list.forEach((item) => {
        output.authType.push(item.toString());
      });
      // ssl
      if (output.authType.indexOf('1') > -1) {
        output.ssl = true;
        output.allow.push('1');
      }
      if (output.authType.indexOf('2') > -1
        && this.checkDownloadCA()
      ) {
        output.ca = true;
        output.allow.push('2');
      }
      let otpInfo = this.getOtpUserInfo();
      if (output.authType.indexOf('3') > -1
        && otpInfo.checkOtpAllow(true)
      ) {
        output.otp = true;
        output.allow.push('3');
      }
      if (this.checkBiometric()) {
        output.bio = true;
        output.allow.push('4');
      }
      if (output.allow.indexOf(dfAuth) > -1) {
        output.default = dfAuth;
      }
    }
    return output;
  }

  /**
   * 檢查生物辨識狀態
   */
  checkBiometric() {
    let output = false;
    // login已將舊pay_setting轉置完成
    const tempRem = this.localStorageService.getObj('Remember');
    const tempFtData = this.localStorageService.getObj('Compare');
    this._logger.step('Security', 'checkBio', tempRem, tempFtData);
    if (tempRem && tempFtData &&tempRem.ftlogin.pay_setting === '1' && (
      tempFtData.comparecustId === tempRem.userData.custId &&
      tempFtData.compareuserId === tempRem.userData.userId
    )
    ) {
      output = true;
    }
    return output;
  }
 /**
   * 檢查生物辨識狀態 (for 信卡)
   * Remember_card
   *   custId = Compare_card.compareuserId 
   *   userId = Compare_card.compareuserId || Compare.compareuserId
   */
  checkBiometric_card() {
    let output = false;
    // login已將舊pay_setting轉置完成
    let tempRem = this.localStorageService.getObj('Remember');
    let tempFtData = this.localStorageService.getObj('Compare');
    let tempRem_card = this.localStorageService.getObj('Remember_card');
    let tempFtData_card = this.localStorageService.getObj('Compare_card');
    let checkCompare={
      comparecustId:'',
      compareuserId:''
    };
    if(tempFtData && tempFtData.compareuserId){
      checkCompare.compareuserId=tempFtData.compareuserId;
    }else{
      checkCompare.compareuserId='';
    }
    if(!tempFtData_card || !tempFtData_card.comparecustId){
       tempFtData_card={
        comparecustId:'',
        compareuserId:''
       }      
    }
    this._logger.step('Security', 'checkBio', tempRem, tempFtData);
    logger.error(tempRem , tempFtData ,tempRem.ftlogin.pay_setting === '1', 
      tempFtData_card.comparecustId === tempRem_card.userData.custId,
      tempFtData_card.compareuserId === tempRem_card.userData.userId,tempFtData_card.compareuserId ,tempRem_card.userData.userId
    );
    if (tempRem && tempFtData &&tempRem.ftlogin.pay_setting === '1' && (
      tempFtData_card.comparecustId === tempRem_card.userData.custId
    )
    ) {
      output = true;
    }
    return output;
  }
  /**
   * 信用卡登入返回檢核
   */
  getUserType() {
    let login_method = this.session.get('login_method');
    let output = '';
    if (!!login_method) {
      output = login_method;
    }
    return output;
  }

  /**
   * 信用卡登入返回檢核
   * @param type 
   */
  checkUserType(type) {
    let output = false;
    let login_method = this.getUserType();
    if (type == 'card' && login_method == '2') {
      output = true;
    }

    return output;
  }

 /**
   * 設定登入後資訊(信用卡用)
   * @param setObj response
   * @param userid userid
   */
  setUserInfo_card() {
    let cardInfo = this.session.getObj('userInfo');
    if(!cardInfo.hasOwnProperty('custId') || !cardInfo.hasOwnProperty('userId') 
      ||cardInfo.custId=='' || cardInfo.userId==''){
        return false;
    }
    let obj:AuthUserInfo={
      custId: cardInfo.custId,
      sessionId: cardInfo.sessionId?cardInfo.sessionId:"",
      validateResult: "",
      isMobileFlag: "",
      warnMsg: null,
      userCode: "",
      cnEndDate: "",
      BoundID: "",
      SSLID: null,
      OTPID: "",
      DefAuthType: "",
      AuthType: "",
      CategorySecuritys: {CategorySecurity: []},
      OtpSttsInfo: {AuthStatus: "", PwdStatus: ""},
      OtpCustInfo: {PhoneNo: "", Email: ""},
      email: "",
      isTax: "",
      isAAcct: "",
      isNAAcct: "",
      isOlnATrnsInAcct: "",
      isElectApply: "",
      refuseMarkingType: "",
      userId: cardInfo.userId,
      lastUpdate: null,
      cn: "",
      serialNumber: ""
    }
    this.userInfo = obj;
    // 避免清除資料時錯誤
    if (!!this.userInfo) {
      this.userInfo.userId = obj.userId;
      this.userInfo.lastUpdate = new Date().getTime();
    }
    this.userInfo.AuthType = (obj.AuthType) ? obj.AuthType : '';
    this.session.setObj('userInfo', this.userInfo);
    logger.error('userInfo',this.session.getObj("userInfo"));
    //set usertmpInfo
    const check_list = ['BoundID', 'OtpCustInfo'];
    let user_tmpinfo = this.userInfo;
    logger.error('tmpInfo',this.tmpInfo);
    let tmp={
      BoundID: "",
      BIND_identity: "",
      otp_modifytimes: 0,
      OtpCustInfo:{
        PhoneNo: "",
        Email: ""
      },
      fundAllow: "",
      fundAgreeFlag: "",
      isfundIncomeNotified: "",
    };
    this.tmpInfo=this.tmpInfo?this.tmpInfo:tmp;
    check_list.forEach(check_key => {
      if (this.tmpInfo.hasOwnProperty(check_key) && !!user_tmpinfo[check_key]) {
        this.tmpInfo[check_key] = user_tmpinfo[check_key];
      }
    });
    this.session.setObj('userTmpInfo', this.tmpInfo);
  }
}
