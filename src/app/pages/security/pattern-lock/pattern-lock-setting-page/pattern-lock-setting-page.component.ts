import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { PatternLockService } from '@shared/pattern-lock/pattern-lock.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { SecurityService } from '@pages/security/shared/service/security.service';
import { Base64Util } from '@shared/util/formate/modify/base64-util';
import { DeviceService } from '@lib/plugins/device.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { AuthService } from '@core/auth/auth.service';
import { CryptoService } from '@lib/plugins/crypto.service';
import { ROUTING_PATH } from '@conf/menu/routing-path';
import { logger } from '@shared/util/log-util';
import { SessionStorageService } from '@lib/storage/session-storage.service';

@Component({
  selector: 'app-pattern-lock-setting-page',
  templateUrl: './pattern-lock-setting-page.component.html',
  providers: [AuthService, CryptoService]
})
export class PatternLockSettingPageComponent implements OnInit, OnDestroy {
  fromLogin = false;
  redirectUrl = ''; // 設定完圖形密碼後之跳轉頁
  redirectPath = '';
  step = 0; // 目前進度 0 - 第一次輸入圖形密碼、1 - 確認圖形密碼
  minPatternLength = 6; // 最小密碼長度
  captionTitle: Array<string>; // 上方說明文字
  captionTitleOption = [
    ['PG_SECURITY.PATTERN_LOCK.TOP_CAPTION_1_1', 'PG_SECURITY.PATTERN_LOCK.TOP_CAPTION_1_2'],
    ['PG_SECURITY.PATTERN_LOCK.TOP_CAPTION_2_1']
  ];
  //   ['此圖形密碼可代替登入密碼', '圖形密碼至少需連結6個點'],
  //   ['請再次確認圖形密碼']


  patternLock; // 圖形密碼
  patternPwd = ''; // 圖形密碼產生的密碼 ex: 123698
  result = false;
  resultObj: any = {}; // 傳至result的obj
  subscriptionOnDraw: any;
  constructor(
    private navigator: NavgatorService,
    private alertService: AlertService,
    private patternLockService: PatternLockService,
    private localStorageService: LocalStorageService,
    private securityService: SecurityService,
    private handleError: HandleErrorService,
    private headerCtrl: HeaderCtrlService,
    private deviceService: DeviceService,
    private confirmService: ConfirmService,
    private auth: AuthService,
    private crypto: CryptoService,
    private zone: NgZone,
    private SessionStorage:SessionStorageService
  ) { }

  ngOnInit() {
    if (this.navigator.getParams()[0] == 'fromLogin') {
      this.fromLogin = true;
      this.headerCtrl.setLeftBtnClick(
        () => {
          this.navigator.push('security_ftlogin_set');
        }
      );
    }
    if (!!this.navigator.getParams()[1]) {
      this.redirectUrl = this.navigator.getParams()[1];
    }
    this.setStep(0);
    this.result = false;
    this.subscriptionOnDraw = this.patternLockService.onDrawSubject.subscribe(
      () => {
        this.onDraw();
      }
    );
  }

  /**
   * 使用者畫完圖形密碼自動執行
   */
  onDraw() {
    if (this.patternLockService.getPatternPwd().length == 1) { // 可能是不小心點到"一個點"(圖形鎖)
      this.patternLockService.resetPattern();
      return;
    }
    logger.error('step'+this.step+' ',this.patternLockService.getPatternPwd().length,this.patternPwd );
    this.zone.run(() => {
      switch (this.step) {
        case 0: {
          // 長度 < 6
          if (this.patternLockService.getPatternPwd().length < this.minPatternLength) {
            this.alertService.show('PG_SECURITY.PATTERN_LOCK.TOP_CAPTION_1_2'); // 圖形密碼至少需連結6個點
            this.patternLockService.resetPattern();
            break;
          } else {
            this.confirm();
            break;
          }
        }
        case 1: {
          if (this.patternLockService.getPatternPwd() !== this.patternPwd) {
            this.alertService.show('CHECK.PATTERNLOCK_NOTSAME'); // 您輸入的圖形密碼與第一次不相同，請重新輸入
            this.patternLockService.resetPattern();
            break;
          } else {
            this.confirm();
            break;
          }
        }
      }
    });

  }


  /**
   * 第0步 - 確定 -> 再輸入一次圖形密碼
   * 第1步 - 確定 -> 圖形密碼註冊 BI000103
   */
  confirm() {
    this.zone.run(() => {
      switch (this.step) {
        case 0: {
          if (this.patternLockService.getPatternPwd().length < this.minPatternLength) {
            this.alertService.show('PG_SECURITY.PATTERN_LOCK.TOP_CAPTION_1_2'); // 圖形密碼至少需連結6個點
            this.patternLockService.resetPattern();
            break;
          }
          this.setStep(1);
          this.patternPwd = this.patternLockService.getPatternPwd();
          this.patternLockService.resetPattern(); // 清除圖形密碼
          this.patternLockService.enablePattern();
          break;
        }
        case 1: {
          if (this.patternLockService.getPatternPwd() !== this.patternPwd) {
            this.alertService.show('CHECK.PATTERNLOCK_NOTSAME'); // 您輸入的圖形密碼與第一次不相同，請重新輸入
            this.patternLockService.resetPattern();
            break;
          } else {
            this.patternLockService.disablePattern();
            this.registerPatternLock();
          }
          break;
        }
      }
    });
  }

  /**
   * 設定目前步驟
   * @param step 更新後的步數 0 - 第一次輸入圖形密碼、1 - 確認圖形密碼
   */
  setStep(step: number) {
    this.step = step;
    this.captionTitle = this.captionTitleOption[step];
  }

  /**
   * 註冊圖形密碼 - 發送電文
   */
  registerPatternLock() {
    logger.info('registerPatternLock');
    this.zone.run(() => {
      /**
           * 數位信封加密
           * 1.圖形手勢對映數值序列。
           * 2.Device唯一碼。
           * 3.註冊時間資訊：於註冊流程會存取至APP的localStroage，APP刪除後會消失。目前用秒數
           */
      this.deviceService.devicesInfo().then(
        (deviceInfo) => {
          logger.info('deviceInfo', deviceInfo);
          let patternDeviceId = deviceInfo.udid;
          const now = new Date().getTime();
          let signText = this.patternPwd + patternDeviceId + String(now) + this.auth.getCustId();
          this.crypto.SHA256(signText).then(
            (SHA256res) => {
              let keepBase64Value = Base64Util.encode(SHA256res.value).value;
              this.auth.digitalEnvelop(Base64Util.encode(SHA256res.value).value).then((digitalEnvelopeRes) => {
                let reqObj = {
                  license: digitalEnvelopeRes.value
                };
                this.securityService.sendPatternLock(reqObj).then( // BI000103
                  (resObj) => {
                    if (resObj.hostCodeMsg == '綁定設備超過上限') {
                      this.confirmService.show('此帳號已於其它裝置啟用圖形密碼，是否解除舊裝置並改以此設備進行圖形密碼', { title: '圖形密碼重複啟用' }).then(
                        (ok) => {
                          this.securityService.sendForcePatternLock(reqObj).then( // 強制圖形密碼註冊綁定
                            (forceRes) => {
                              if (forceRes.trnsRsltCode === '0') { // 強制註冊圖形密碼成功
                                let login_method = this.SessionStorage.getObj('login_method');
                                // if (login_method == '2') {
                                // } else {
                                this.securityService.resNoRegister();
                                // }
                                this.securityService.keepPatternLock(keepBase64Value, '1');
                                keepBase64Value = '';
                                this.patternLockSuccess(now, patternDeviceId);
                                this.setResultHeader();
                                this.resultObj = forceRes;
                                this.resultObj.fromLogin = this.fromLogin;
                                this.resultObj.redirectUrl = this.redirectUrl;
                                this.resultObj.redirectPath = this.redirectPath;
                                this.result = true; // 轉至結果
                              }
                            },
                            (forceErr) => {
                              this.handleError.handleError(forceErr);
                              this.navigator.push('security_ftlogin_set'); // 快速登入/交易設定
                            }
                          );
                        },
                        (cancel) => { // 不取消舊裝置上的圖形密碼
                          this.navigator.push('security_ftlogin_set'); // 快速登入/交易設定
                        }
                      );
                      return;
                    } else if (resObj.trnsRsltCode === '0') { // 設定成功
                      this.securityService.keepPatternLock(keepBase64Value, '1');
                      keepBase64Value = '';
                      this.patternLockSuccess(now, patternDeviceId);
                    }
                    this.setResultHeader();
                    this.resultObj = resObj;
                    this.resultObj.fromLogin = this.fromLogin;
                    this.resultObj.redirectUrl = this.redirectUrl;
                    this.resultObj.redirectPath = this.redirectPath;
                    this.result = true; // 轉至結果
                  },
                  (sendPatternLockError) => {
                    this.handleError.handleError(sendPatternLockError).then(
                      () => {
                        if (this.fromLogin) {
                          this.navigator.push('user-home'); // 返回首頁
                        } else {
                          this.navigator.push('security_ftlogin_set'); // 返回快速登入設定頁
                        }
                      }
                    );
                  }
                );
              }).catch((error) => {
                this.handleError.handleError(error);
              });
            }
          ).catch((error) => {
            this.handleError.handleError(error);
          });
        }
      ).catch(
        (err) => {
          logger.info('err', err);
          this.handleError.handleError(err);
        }
      );
    });
  }

  /**
   * 綁定圖形密碼成功，儲存資訊
   */
  patternLockSuccess(now, patternDeviceId) {
    // 儲存快速登入資訊
    const loginRemember = this.localStorageService.getObj('Remember');
    // 同裝置不同帳號先清空
    let tempFtData = this.localStorageService.getObj('Compare');
    let login_method = this.SessionStorage.getObj("login_method");
    let loginRemember_card = this.localStorageService.getObj('Remember_card');
    let tempFtData_card = this.localStorageService.getObj('Compare_card');
    //此處使用者代碼判斷 移除&&
    //   tempFtData_card.compareuserId === loginRemember_card.userData.userId && tempFtData_card.compareuserId 
    //   tempFtData.compareuserId === loginRemember.userData.userId && tempFtData.compareuserId 
    if (login_method == '2') {  //card
      if (tempFtData && tempFtData.comparecustId && (tempFtData.comparecustId === loginRemember_card.userData.custId)) {
      } else {
        // logger.error('2清空', tempFtData_card.comparecustId, loginRemember_card.userData.custId, '&&',
        //   tempFtData_card.compareuserId, loginRemember_card.userData.userId);
        loginRemember.ftlogin.pay_setting = '0';
        loginRemember.ftlogin.fastlogin = '0';
        loginRemember.ftlogin.hasPatternLock = '0';
        loginRemember.ftlogin.payPattern = '0';
      }
    } else { //web
      if (tempFtData && tempFtData.comparecustId && (tempFtData.comparecustId === loginRemember.userData.custId
      )) {
      } else {
        // logger.error('1清空', tempFtData.comparecustId, loginRemember.userData.custId, '&&',
        //   tempFtData.compareuserId, loginRemember.userData.userId);
        loginRemember.ftlogin.pay_setting = '0';
        loginRemember.ftlogin.fastlogin = '0';
        loginRemember.ftlogin.hasPatternLock = '0';
        loginRemember.ftlogin.payPattern = '0';
      }
    }

    // 同裝置不同帳號先清空
    loginRemember.ftlogin.type = 'pattern'; // 點選登入時使用圖形密碼
    loginRemember.ftlogin.hasPatternLock = '1'; // 有圖形密碼綁定
    loginRemember.ftlogin.patternLockRegisterTime = String(now);
    loginRemember.ftlogin.patterLoginErrorCount = '0';
    // 設定圖形密碼,一併紀錄當下的deviceId
    if (typeof loginRemember.ftlogin.patternDeviceId === 'undefined') {
      loginRemember.ftlogin['patternDeviceId'] = patternDeviceId;
    } else {
      loginRemember.ftlogin.patternDeviceId = patternDeviceId;
    }
    this.localStorageService.setObj('Remember', loginRemember);

    // 儲存註冊快速登入時的身分證字號、使用者代號 
    //  comparecustId儲存為一樣的
    const copyFT = {
      comparecustId: '',
      compareuserId: '',
    };
    const copyFT_card = {
      comparecustId: '',
      compareuserId: '',
    };

    if (login_method == '2') {  //card會員
      copyFT_card.comparecustId = loginRemember_card.userData.custId;//compare_card.custId=remember_card.custId
      copyFT_card.compareuserId = loginRemember_card.userData.userId;//compare_card.userId=remember_card.userId
      if (tempFtData && tempFtData['comparecustId']) {
        tempFtData['comparecustId'] = loginRemember_card.userData.custId;//compare.custId=remember_card.custId
      } else {
        tempFtData = {
          comparecustId: loginRemember_card.userData.custId,
          compareuserId: ''
        }
        tempFtData.comparecustId = loginRemember_card.userData.custId;
      }
      this.localStorageService.setObj('Compare', tempFtData);
      this.localStorageService.setObj('Compare_card', copyFT_card);
      logger.error('pattern suc', copyFT_card, tempFtData);
    } else {  //web會員
      copyFT.comparecustId = loginRemember.userData.custId; //compare.custId=remember.custId
      copyFT.compareuserId = loginRemember.userData.userId; //compare.userId=remember.userId
      if (tempFtData_card && tempFtData_card['comparecustId']) {
        tempFtData_card['comparecustId'] = loginRemember.userData.custId; //compare_card.custId=remember.custId
      } else {
        tempFtData_card = {
          comparecustId: loginRemember.userData.custId,
          compareuserId: ''
        }
        tempFtData_card.comparecustId = loginRemember.userData.custId;
      }
      this.localStorageService.setObj('Compare', copyFT);
      this.localStorageService.setObj('Compare_card', tempFtData_card);
      logger.error('pattern suc', copyFT, tempFtData_card);
    }

  }

  private setResultHeader() {
    this.headerCtrl.setOption({ title: '快速登入(圖形密碼)設定' });
    if (!!this.redirectUrl) {
      this.redirectPath = Object.keys(ROUTING_PATH).find(key => ROUTING_PATH[key]['url'] == this.redirectUrl);
      if (!this.redirectPath) {
        this.redirectUrl = this.redirectUrl.substring(1);
        this.redirectPath = Object.keys(ROUTING_PATH).find(key => ROUTING_PATH[key]['url'] == this.redirectUrl);
      }
      this.headerCtrl.setLeftBtnClick(() => {
        this.navigator.push(this.redirectPath);
      });
    } else {
      this.headerCtrl.setLeftBtnClick(() => {
        this.navigator.push('home');
      });
    }
  }

  ngOnDestroy() {
    this.auth.redirectUrl = null;
    this.subscriptionOnDraw.unsubscribe();
    this.patternLockService.enablePattern();
  }

  resetPattern() {
    this.setStep(0);
  }
}
