import { Injectable } from '@angular/core';
import { BiometricService } from '@lib/plugins/biometric.service';
import { DeviceService } from '@lib/plugins/device.service';
import { BI000101ApiService } from '@api/bi/bi000101/bi000101-api.service';
import { BI000101ReqBody } from '@api/bi/bi000101/bi000101-req';
import { BI000100ApiService } from '@api/bi/bi000100/bi000100-api.service';
import { BI000100ReqBody } from '@api/bi/bi000100/bi000100-req';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { TcbbService } from '@lib/plugins/tcbb/tcbb.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { AuthService } from '@core/auth/auth.service';
import { InputCertProtectPwdService } from '@shared/popup/input-cert-protect-pwd/input-cert-protect-pwd.service';
import { FH000203ApiService } from '@api/fh/fh000203/fh000203-api.service';
import { FH000203ReqBody } from '@api/fh/fh000203/fh000203-req';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { Subject } from 'rxjs/Subject';
import { SessionStorageService } from '@lib/storage/session-storage.service';
import { BI000103ReqBody } from '@api/bi/bi000103/bi000103-req';
import { BI000103ApiService } from '@api/bi/bi000103/bi000103-api.service';
import { logger } from '@shared/util/log-util';
import { CryptoService } from '@lib/plugins/crypto.service';
import { Base64Util } from '@shared/util/formate/modify/base64-util';
import { HandleErrorOptions } from '@core/handle-error/handlerror-options';
import { FormateService } from '@shared/formate/formate.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { BioDisAllowUserAgent } from '@conf/user-agent-check';
import { CacheService } from '@core/system/cache/cache.service';

declare var navigator: any;
import { BI000104ReqBody } from '@api/bi/bi000104/bi000104-req';
import { BI000104ApiService } from '@api/bi/bi000104/bi000104-api.service';
import { CardSafePopupService } from '@shared/transaction-security/card-safe-popup/card-safe-popup.service';


/**
 * 20191113 user修正綁定規則: 快速登入應該是在同一個裝置
 *        生物辨識註冊  圖形密碼註冊
 * 1.HTC      1           0
 * 2.HTC      1           0
 *   SONY     0           1
 * 3.HTC      0           1
 */

@Injectable()
export class SecurityService {

  private loginRemember: any;
  private method: any = ''; //登入方式
  constructor(
    private biometricService: BiometricService,
    private BI000101: BI000101ApiService,
    private BI000100: BI000100ApiService,
    private deviceInfo: DeviceService,
    private localStorageService: LocalStorageService,
    private navgator: NavgatorService,
    private tcbb: TcbbService,
    private alert: AlertService,
    private confirm: ConfirmService,
    private auth: AuthService,
    private inpit_cert: InputCertProtectPwdService,
    private fh000203: FH000203ApiService,
    private errorHandle: HandleErrorService,
    private check_security: CheckSecurityService,
    private session: SessionStorageService,
    private BI000103: BI000103ApiService,
    private BI000104: BI000104ApiService,
    private crypto: CryptoService,
    private _formateService: FormateService
    , private cacheService: CacheService
    , private sessionStorageService: SessionStorageService
    , private cardSafePopupService: CardSafePopupService
  ) {
    // this.loginRemember = this.localStorageService.getObj('Remember');
  }
  taiwanError: Subject<boolean> = new Subject<boolean>();
  getLoginRemember() {
    //新增信卡會員
    this.method = this.sessionStorageService.getObj('login_method');
    if (this.method == '2') {
      this.loginRemember = this.localStorageService.getObj('Remember_card');
    } else {
      this.loginRemember = this.localStorageService.getObj('Remember');
    }
  }
  /**
   * 生物辨識註冊
   */
  submitFtligon(): Promise<any> {
    this.getLoginRemember();
    return new Promise((resolve, reject) => {
      this.biometricService.getBiometricStatus().then(
        (resStatus) => {
          let check_code = this._formateService.checkField(resStatus, 'ret_code', {
            to_string: true,
            trim_flag: true
          });
          if (check_code == '0') {
            this._checkDoBio().then(
              (checkSuccess) => {
                this.generateBio().then(
                  (generateSuccess) => {
                    resolve(generateSuccess);
                  },
                  (generateErr) => {
                    reject(generateErr);
                  }
                );
              },
              (checkError) => {
                reject(checkError);
              }
            );
          } else if (check_code == '1') {
            this.alert.show('您的設備尚未設定生物辨識').then(() => reject(resStatus));
          } else {
            this.alert.show('您的設備不支援快速登入(指紋/臉部)功能').then(() => reject(resStatus));
          }
        },
        (errorStatus) => {
          let errorMsg = this.errorCompiler(errorStatus, null, 'generate');
          let check_code = this._formateService.checkField(errorStatus, 'ret_code', {
            to_string: true,
            trim_flag: true
          });
          if (check_code != '10') {
            this.alert.show(errorMsg).then(() => reject(errorStatus));
          }
        }
      );
    });
  }

  /**
   * 檢查是否已做生物辨識
   */
  _checkDoBio(): Promise<any> {
    let output: any = {
      status: false,
      msg: '',
      error_data: {}
    };
    return new Promise((resolve, reject) => {
      this.auth.getBioUserInfo().then(
        (successInfo) => {
          if (!!successInfo.status) {
            output.error_data = successInfo;
            // 判斷是否已有其他身分綁定生物辨識(判斷邏輯比照舊APP)
            if (!!successInfo.have_login && !!successInfo.have_bio
              && successInfo.login.custId != successInfo.bio.custId
              && successInfo.login.userId != successInfo.bio.userId
            ) {
              // this.confirm.show('已有其他帳號註冊過快速登入的功能，若您要註冊目前該帳號的快速登入的功能，原有帳號需重新註冊啟用快速登入的功能。', {
              this.confirm.show('您目前的裝置已有其他ID使用快速登入功能，若您要使用目前ID重新設定，原已設定之ID將一併重設', {
                title: 'ERROR.INFO_TITLE'
                , btnYesTitle: '繼續'
                , btnNoTitle: 'BTN.CANCEL'
              }).then(
                () => {
                  output.status = true;
                  resolve(output);
                },
                () => {
                  output.status = false;
                  // reject(output);
                  this.navgator.push('security_ftlogin_set'); // 按取消回到設定頁
                }
              );
            } else {
              // 直接綁定
              output.status = true;
              resolve(output);
            }
          } else {
            output.status = true;
            resolve(output);
          }
        },
        (errorInfo) => {
          output.status = false;
          output.error_data = errorInfo;
          reject(output);
        }
      );
    });
  }

  /**
   * 執行生物辨識註冊產製
   */
  private async generateBio(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      // 註銷生物辨識
      // this.disableBioService().then(
      //   (disableRes) => {
      //   },
      //   (disableErr) => {
      //   }
      // );
      try { await this.disableBioService(); } catch (err) { }
      this.biometricService.generateBioToken('請將您的指紋置於感應區域上').then(
        (res) => {
          this.tcbb.fastAESDecode([this.loginRemember.userData.custId, this.loginRemember.userData.userId]).then(
            (res_Dncode) => {
              const loginResult: any = {
                token: res.device_token,
                custId: res_Dncode.custId,
                userId: res_Dncode.userId.toUpperCase(),
              };
              return Promise.resolve(loginResult);
            },
            (error_Dncode) => {
              logger.debug('error_Dncode', error_Dncode);
            }).then(
              (loginResult) => {
                const formBI000100 = new BI000100ReqBody();
                formBI000100.userId = loginResult.userId;
                formBI000100.custId = loginResult.custId;
                formBI000100.token = loginResult.token;
                formBI000100.functionType = '1';
                logger.error('formBI000100', formBI000100);
                this.BI000100.send(formBI000100).then(
                  (res_pass1) => {
                    logger.error('res_pass1', res_pass1);
                    const logininfo = res_pass1.body;
                    if (logininfo.hostCode == '0') {
                      this.localStorageService.set('token', formBI000100.token);
                      this.enableBioService();
                    } else if (logininfo.hostCodeMsg == '綁定設備超過上限') {
                      const successMethod = () => {
                        const form_BI000100 = new BI000100ReqBody();
                        form_BI000100.userId = loginResult.userId;
                        form_BI000100.custId = loginResult.custId;
                        form_BI000100.token = loginResult.token;
                        form_BI000100.functionType = '3';
                        logger.error('successMethod', form_BI000100);
                        this.BI000100.send(form_BI000100).then(
                          (res_pass2) => {
                            logger.error('suc sendBI000100', res_pass2);
                            if (res_pass2.body.hostCode == '0') {
                              this.localStorageService.set('token', formBI000100.token);
                              // this.resNoRegister();
                              this.enableBioService();
                            }
                          }).catch(
                            (err) => {
                              logger.error('err sendBI000100:', err);
                              logger.error(err);
                            });
                        // reject();
                      };
                      const errorMethod = () => {
                        logger.error('errorMethod');
                        this.navgator.pop();
                      };

                      this.confirm.show('此帳號已於其它裝置啟用快速登入，是否解除舊裝置並改以此設備進行快速登入', { title: '快速登入重複啟用' }).then(
                        (success) => {
                          logger.error('s', success);
                          successMethod();
                        },
                        (cancel) => {
                          logger.error('E', cancel);
                          this.navgator.push('security_ftlogin_set'); // 快速登入/交易設定
                        }
                      );
                    } else {
                      let error_msg = this._formateService.checkField(res_pass1, 'hostCodeMsg');
                      this.errorHandle.handleError({
                        type: 'dialog',
                        title: '綁定失敗',
                        content: error_msg
                      });
                    }
                  }).catch(
                    (err) => {
                      logger.error(err);
                      this.errorHandle.handleError(err);
                    });
              }
            );
        },
        (error) => {
          logger.error('error 127', error);
          this.deviceInfo.devicesInfo().then(
            device => {
              const msg = this.errorCompiler(error, device);
              let check_code = this._formateService.checkField(error, 'ret_code', {
                to_string: true,
                trim_flag: true
              });
              if (check_code != '10') {
                this.alert.show(msg).then(() => reject(error));
              } else {
                // 因為generateBio()已經先做disableBio
                // 但是新id執行生物辨識註冊產製的過程中又點擊取消(ret_code=='10')
                // 如果要bio_status===9&fastlogin==='1'要enableBio
                const loginRemember = this.localStorageService.getObj('Remember');
                this.biometricService.gueryBioService().then(
                  (res) => {
                    logger.log('gueryBio success', res);
                    // 未開啟驗證
                    if (res.bio_status === 9 && loginRemember.ftlogin.fastlogin === '1') {
                      this.biometricService.enableBioService().then(
                        (enable_success) => {
                          logger.log('enableBio success', enable_success);
                        },
                        (enable_error) => {
                          logger.log('enableBio error', enable_error);
                        });
                    }
                  },
                  (error_Dncode) => {
                    logger.log('gueryBio error', error_Dncode);
                  }
                );
                this.navgator.push('security_ftlogin_set'); // 20191126按取消回到設定頁
              }
            },
            err => {
              logger.debug('device info error');
              reject(error);
            }
          );
        });
    });
  }


  /**
   * TaiwanPay 註冊
   */
  submitTaiwan(obj): Promise<any> {
    return new Promise((resolve, reject) => {
      this.biometricService.gueryBioService().then(
        (res) => {
          // 有開啟驗證
          if (res.bio_status === 1) {
            this.biometricService.identifyByBiometric('請將您的指紋置於感應區域上').then(
              (res_identify) => {
                // let info = this.auth.getUserInfo();
                // let securityTypes = [];
                // let defaultTypes;

                // if (info.AuthType.indexOf('2') > -1) {
                //   if (info.cn == null || info.cn == '') { } else {
                //     securityTypes.push({
                //       name: '憑證',
                //       key: 'NONSET'
                //     });
                //     defaultTypes = {
                //       name: '憑證',
                //       key: 'NONSET'
                //     };
                //   }
                // }
                // if (info.AuthType.indexOf('3') > -1) {
                //   let OtpInfo = this.auth.getOtpUserInfo();
                //   // tslint:disable-next-line: max-line-length
                //   if (info.BoundID === '4' && info.OTPID === '2' && OtpInfo.checkAuthStatus() === true && OtpInfo.checkPwdStatus() === true) {
                //     securityTypes.push({
                //       name: 'OTP',
                //       key: 'OTP'
                //     });
                //     defaultTypes = {
                //       name: 'OTP',
                //       key: 'OTP'
                //     };
                //   }
                // }
                // if (securityTypes.length === 0) {
                //   this.alert.show('您無可用的安控機制').then(
                //     () => {
                //       if (info.AuthType.indexOf('3') > -1) {
                //         this.auth.checkSecurityOtp();
                //       }
                //     }
                //   );
                //   this.error_TaiwanPay();
                //   const loginRemember = this.localStorageService.getObj('Remember');
                //   loginRemember.ftlogin.pay_setting = '0';
                //   this.localStorageService.setObj('Remember', loginRemember);
                //   reject();
                // } else if (securityTypes.length === 1) {
                //   if (defaultTypes.name === '憑證') {
                //     const CA_Object = {
                //       securityType: '2',
                //       serviceId: 'BI000101'
                //     };
                //     this.send_TaiwanPay(CA_Object).then(
                //       success => {
                //         resolve(success);
                //       }
                //     ).catch(err => {
                //       reject();
                //     });
                //   } else {
                //     const OTP_Object = {
                //       securityType: '3',
                //       otpObj: {
                //         custId: this.auth.getCustId(),
                //         fnctId: "BI000101",
                //         depositNumber: '1',
                //         depositMoney: '1',
                //         OutCurr: '1',
                //         transTypeDesc: ''
                //       },
                //       serviceId: 'BI000101'
                //     };
                //     this.send_TaiwanPay(OTP_Object).then(
                //       success => {
                //         resolve(success);
                //       }
                //     ).catch(err => {
                //       reject();
                //     });
                //   }
                // } else if (securityTypes.length === 2) {
                //   // 如果有兩組安控機制,選擇使用憑證 20191206
                //   // const OTP_Object = {
                //   //   securityType: '3',
                //   //   otpObj: {
                //   //     custId: this.auth.getCustId(),
                //   //     fnctId: "BI000101",
                //   //     depositNumber: '1',
                //   //     depositMoney: '1',
                //   //     OutCurr: '1',
                //   //     transTypeDesc: ''
                //   //   },
                //   //   serviceId: 'BI000101'
                //   // };
                //   const CA_Object = {
                //     securityType: '2',
                //     serviceId: 'BI000101'
                //   };
                //   this.send_TaiwanPay(CA_Object).then(
                //     success => {
                //       resolve(success);
                //     }
                //   ).catch(err => {
                //     reject();
                //   });
                // }
                let login_method = this.session.getObj("login_method");
                logger.error('this.method', this.method);
                if (login_method && login_method == '2') {
                  this.send_TaiwanPay_card(obj).then(
                    success => {
                      resolve(success);
                    }
                  ).catch(err => {
                    reject();
                  });
                } else {
                  this.send_TaiwanPay(obj).then(
                    success => {
                      resolve(success);
                    }
                  ).catch(err => {
                    reject();
                  });
                }

              },
              (error_identify) => {
                this.deviceInfo.devicesInfo().then(
                  device => {
                    const msg = this.errorCompiler(error_identify, device);

                    let check_code = this._formateService.checkField(error_identify, 'ret_code', {
                      to_string: true,
                      trim_flag: true
                    });
                    if (check_code != '10') {
                      this.alert.show(msg);
                    }
                  },
                  err => {
                    logger.debug('device info error');
                  }
                );
              }
            );
          } else {
            this.alert.show('請先開啟快速登入功能');
            this.error_TaiwanPay();
            // reject('fffff');
          }
        },
        (error_Dncode) => {
          logger.debug('cancelftLogin submitTaiwan', error_Dncode);
          this.deviceInfo.devicesInfo().then(
            device => {
              const msg = this.errorCompiler(error_Dncode, device);
              this.alert.show(msg).then(() => reject(error_Dncode));
            },
            err => {
              logger.debug('device info error');
              reject(error_Dncode);
            }
          );
        }).catch((err) => {
          reject();
          logger.debug('BiometricService.gueryBioService Error', err);
        });
    });
  }

  /**
   * Otp電文發送流程
   */
  otp_TaiwanPay(obj) {

    // obj.signText =

    //   this.check_security.doSecurityNextStep(obj).then(
    //     res => {
    //       this.send_TaiwanPay();
    //     },
    //     error => {
    //       this.error_TaiwanPay();
    //       this.errorHandle.handleError(error);
    //     }
    // );
  }

  /**
   * 發台灣pay成功電文流程
   */
  send_TaiwanPay(obj): Promise<any> {
    return new Promise((resolve, reject) => {
      let reqData = new FH000203ReqBody();
      return this.fh000203.send(reqData).then(
        (sucess) => {
          logger.debug('success', sucess);
          return Promise.resolve(sucess.data);
        },
        (failed) => {
          this.error_TaiwanPay();
          return Promise.reject(failed);
        }
      ).then(
        (trnsToken) => {
          const formBI000101 = new BI000101ReqBody();
          formBI000101.custId = this.auth.getUserInfo().custId;
          formBI000101.trnsToken = trnsToken;
          let req = {
            custId: this.auth.getUserInfo().custId,
            trnsToken: trnsToken
          };
          obj.signText = req;
          this.check_security.doSecurityNextStep(obj).then(
            res => {
              let reqHeader = {
                header: res.headerObj
              };
              this.BI000101.send(req, reqHeader).then(
                (res_bi000101) => {
                  if (res_bi000101.body.hostCode === '0') {
                    const loginRemember = this.localStorageService.getObj('Remember');
                    loginRemember.ftlogin.pay_setting = '1';
                    this.localStorageService.setObj('Remember', loginRemember);
                    // epay cache強制清除
                    this.cacheService.removeGroup('epay-security');
                    this.alert.show('下次交易即可以使用指紋/臉部驗證交易', { title: '台灣Pay交易設定成功' });
                    resolve(res_bi000101.body);
                  } else {
                    if (res_bi000101.body.hostCodeMsg.indexOf('尚未註冊') > -1) {
                      this.resNoRegister();
                      // epay cache強制清除
                      this.cacheService.removeGroup('epay-security');
                      resolve(res_bi000101.body);
                    } else {
                      const error = new HandleErrorOptions();
                      error.content = res_bi000101.body.hostCodeMsg;
                      this.errorHandle.handleError(error);
                    }
                  }
                },
                (error_bi000101) => {
                  this.error_TaiwanPay();
                  this.errorHandle.handleError(error_bi000101);
                  reject();
                }
              );
            },
            error => {
              this.error_TaiwanPay();
              this.errorHandle.handleError(error);
            }
          );
        },
        (error) => {
          this.error_TaiwanPay();
          this.errorHandle.handleError(error);
        }
      );
    });
  }
  /**
     * 發台灣pay成功電文流程(信用卡專用)
     */
  send_TaiwanPay_card(obj): Promise<any> {
    return new Promise((resolve, reject) => {
      let reqData = new FH000203ReqBody();
      return this.fh000203.send(reqData).then(
        (sucess) => {
          logger.debug('success', sucess);
          return Promise.resolve(sucess.data);
        },
        (failed) => {
          this.error_TaiwanPay();
          return Promise.reject(failed);
        }
      ).then(
        (trnsToken) => {
          const formBI000101 = new BI000101ReqBody();
          formBI000101.custId = this.auth.getUserInfo().custId;
          formBI000101.trnsToken = trnsToken;

          this.cardSafePopupService.show('', {}).then(
            (popsuc) => {
              logger.error('pwd popup show', popsuc);
              if (popsuc['PD_val']) { //有接收到密碼 數位信封加密
                let diapwd = popsuc['PD_val'];
                this.auth.digitalEnvelop(diapwd).then(
                  (diasuc) => { //加密成功
                    let req = {
                      custId: this.auth.getUserInfo().custId,
                      trnsToken: trnsToken
                    };
                    let headerObj: any = {
                      SecurityType: '6',
                      SecurityPassword: diasuc.value
                    };
                    let reqHeader = {
                      header: headerObj
                    };
                    this.BI000101.send(req, reqHeader).then(
                      (res_bi000101) => {
                        if (res_bi000101.body.hostCode === '0') {
                          const loginRemember = this.localStorageService.getObj('Remember');
                          loginRemember.ftlogin.pay_setting = '1';
                          this.localStorageService.setObj('Remember', loginRemember);
                          // epay cache強制清除
                          this.cacheService.removeGroup('epay-security');
                          this.alert.show('下次交易即可以使用指紋/臉部驗證交易', { title: '台灣Pay交易設定成功' });
                          resolve(res_bi000101.body);
                        } else {
                          if (res_bi000101.body.hostCodeMsg.indexOf('尚未註冊') > -1) {
                            this.resNoRegister();
                            // epay cache強制清除
                            this.cacheService.removeGroup('epay-security');
                            resolve(res_bi000101.body);
                          } else {
                            const error = new HandleErrorOptions();
                            error.content = res_bi000101.body.hostCodeMsg;
                            this.errorHandle.handleError(error);
                          }
                        }
                      },
                      (error_bi000101) => {
                        logger.error('error_bi000101',error_bi000101);
                        if(error_bi000101.hasOwnProperty('content') && error_bi000101['content']=='(ERRCARD_0001)'){
                         error_bi000101['content']='信用卡登入密碼錯誤';
                        }
                        this.error_TaiwanPay();
                        this.errorHandle.handleError(error_bi000101);
                        reject();
                      });
                  },
                  (diafail) => { //加密失敗
                    logger.error('diafail', diafail);
                    reject(diafail);
                  }
                );

              }
            },
            (popfail) => {
              logger.error('pwd popup show false', popfail);
            }
          );



        },
        (error) => {
          this.error_TaiwanPay();
          this.errorHandle.handleError(error);
        }
      );
    });
  }
  /**
   * 快速登入設定取消
   */
  async cancelftLogin(): Promise<any> {
    this.getLoginRemember();
    // this.disableBioService().then(
    //   (disableRes) => {
    //   },
    //   (disableErr) => {
    //   }
    // );
    try { await this.disableBioService(); } catch (err) { }
    return new Promise((resolve, reject) => {
      this.tcbb.fastAESDecode([this.loginRemember.userData.custId, this.loginRemember.userData.userId]).then(
        (res_Dncode) => {
          const formBI000100 = new BI000100ReqBody();
          formBI000100.userId = res_Dncode.userId;
          formBI000100.custId = res_Dncode.custId;
          formBI000100.token = this.localStorageService.get('token');
          formBI000100.functionType = '0';
          this.BI000100.send(formBI000100).then(
            (res_pass1) => {
              let loginRemember: any;
              // if(this.method=='2'){
              //   loginRemember = this.localStorageService.getObj('Remember_card');
              // }else{
              //   loginRemember = this.localStorageService.getObj('Remember');
              // }
              loginRemember = this.localStorageService.getObj('Remember');
              //if use card login
              if (!loginRemember) {
                loginRemember = {
                  ftlogin: {
                    fastlogin: '0',
                    pay_setting: '0',
                    type: ''
                  }
                }
              }
              loginRemember.ftlogin.fastlogin = '0';
              loginRemember.ftlogin.pay_setting = '0';
              loginRemember.ftlogin.type = loginRemember.ftlogin.hasPatternLock == '1' ? 'pattern' : '';
              this.localStorageService.remove('token');
              // if(this.method =='2'){
              //   this.localStorageService.setObj('Remember_card', loginRemember);//
              // }else{

              // }
              this.localStorageService.setObj('Remember', loginRemember);//
              logger.error('BI000100!!', this.method);
              if (!!res_pass1.body.hostCodeMsg && res_pass1.body.hostCodeMsg.indexOf('尚未註冊') > -1) {
                this.resNoRegister();
              }
              // epay cache強制清除
              this.cacheService.removeGroup('epay-security');
              resolve(res_pass1.body);
            }).catch(
              (err) => {
                logger.error(err);
              });
        },
        (error_Dncode) => {
          logger.debug('error_Dncode', error_Dncode);
          this.deviceInfo.devicesInfo().then(
            device => {
              const msg = this.errorCompiler(error_Dncode, device);
              this.alert.show(msg).then(() => reject(error_Dncode));
            },
            err => {
              logger.debug('device info error');
              reject(error_Dncode);
            }
          );
        });
    });
  }

  /**
   * 台灣pay設定錯誤
   */
  error_TaiwanPay() {
    this.taiwanError.next(false);
    const loginRemember = this.localStorageService.getObj('Remember');
    loginRemember.ftlogin.pay_setting = '0';
    this.localStorageService.setObj('Remember', loginRemember);
  }
  /**
   * 台灣pay設定取消
   */
  cancelTaiwan(): Promise<any> {
    this.getLoginRemember();
    return new Promise((resolve, reject) => {
      this.tcbb.fastAESDecode([this.loginRemember.userData.custId, this.loginRemember.userData.userId]).then(
        (res_Dncode) => {
          const formBI000100 = new BI000100ReqBody();
          formBI000100.userId = res_Dncode.userId;
          formBI000100.custId = res_Dncode.custId;
          formBI000100.token = this.localStorageService.get('token');
          formBI000100.functionType = '2';
          this.BI000100.send(formBI000100).then(
            (res_pass1) => {
              this.error_TaiwanPay();
              if (!!res_pass1.body.hostCodeMsg && res_pass1.body.hostCodeMsg.indexOf('尚未註冊') > -1) {
                this.resNoRegister();
              }
              // epay cache強制清除
              this.cacheService.removeGroup('epay-security');
              resolve(res_pass1.body);
            }).catch(
              (err) => {
                logger.error(err);
              });
        },
        (error_Dncode) => {
          logger.debug('error_Dncode', error_Dncode);
          this.deviceInfo.devicesInfo().then(
            device => {
              const msg = this.errorCompiler(error_Dncode, device);
              this.alert.show(msg).then(() => reject(error_Dncode));
            },
            err => {
              logger.debug('device info error');
              reject(error_Dncode);
            }
          );
        });
    });
  }

  /**
   * 取消生物辨識
   */
  disableBioService(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.biometricService.disableBioService().then(
        (res) => {
          logger.log('disableBioService success', res);
          resolve(res);
        }
      ).catch((error) => {
        logger.error('disableBioService Error', error);
        reject(error);
      });
    });
  }

  /**
    * 回應資料:
    * ret_code - 回傳值
    * err_msg - 系統錯誤訊息
    * bio_status - 啟用狀態
    */
  enableBioService() {
    this.biometricService.enableBioService().then(
      (biomet) => {
        //增加信卡會員
        const login_method = this.session.getObj('login_method');
        if (login_method && login_method == '2') {
          const loginRemember = this.localStorageService.getObj('Remember_card');
          // 同裝置不同帳號先清空
          // 此處將userId判斷移除 
          const tempFtData = this.localStorageService.getObj('Compare_card');
          const Remember = this.localStorageService.getObj('Remember');
          const Compare = this.localStorageService.getObj('Compare');
          if (Compare && (Compare.comparecustId === loginRemember.userData.custId
            //&&
            //(tempFtData.compareuserId === loginRemember.userData.userId ||Compare.compareuserId === loginRemember.userData.userId)
          )) {
          } else {
            Remember.ftlogin.pay_setting = '0';
            Remember.ftlogin.fastlogin = '0';
            Remember.ftlogin.hasPatternLock = '0';
            Remember.ftlogin.payPattern = '0';
            if (typeof Remember.ftlogin.patternDeviceId === 'undefined') {
              Remember.ftlogin['patternDeviceId'] = '';
            } else {
              Remember.ftlogin.patternDeviceId = '';
            }
          }
          Remember.ftlogin.fastlogin = '1';
          Remember.ftlogin.type = 'biometric';
          this.localStorageService.setObj('Remember_card', loginRemember);
          const copyFT = {
            comparecustId: '',
            compareuserId: '',
          };
          copyFT.comparecustId = loginRemember.userData.custId;
          copyFT.compareuserId = loginRemember.userData.userId;
          this.localStorageService.setObj('Compare_card', copyFT);

          //新增 綁定是將web與card的 compareId同時變更一樣
          let compareFtData = this.localStorageService.getObj('Compare');
          if (compareFtData && compareFtData.comparecustId) {
            compareFtData['comparecustId'] = loginRemember.userData.custId;
          } else {
            compareFtData = {
              comparecustId: loginRemember.userData.custId,
              compareuserId: ''
            };
            compareFtData.comparecustId = loginRemember.userData.custId;
          }
          this.localStorageService.setObj('Compare', compareFtData);

          this.localStorageService.setObj('Remember', Remember);  //快速登入設定flag塞回Remember
          //紀錄最後一次生物辨識綁定
          let lastbind = {
            type: '2',
            cust: loginRemember.userData.custId,
            user: loginRemember.userData.userId ? loginRemember.userData.userId : ''
          }
          this.localStorageService.setObj('lastbind', lastbind);
          this.localStorageService.set('cancelFastLogin', '0');
          this.alert.show('下次登入即可以使用快速登入功能了喔！', { title: '登入設定成功' }).then(
            success => {
              this.navgator.push('security_ftlogin_set', {});
            },
            error => {
              logger.debug('popup error');
            }
          );
          return false;
        }
        //web會員
        const loginRemember = this.localStorageService.getObj('Remember');
        // 同裝置不同帳號先清空
        // 此處將userId判斷移除 &&tempFtData.compareuserId === loginRemember.userData.userId
        const tempFtData = this.localStorageService.getObj('Compare');
        logger.error('enableBioService', tempFtData);
        if (tempFtData && (tempFtData.comparecustId === loginRemember.userData.custId)) {
        } else {
          loginRemember.ftlogin.pay_setting = '0';
          loginRemember.ftlogin.fastlogin = '0';
          loginRemember.ftlogin.hasPatternLock = '0';
          loginRemember.ftlogin.payPattern = '0';
          if (typeof loginRemember.ftlogin.patternDeviceId === 'undefined') {
            loginRemember.ftlogin['patternDeviceId'] = '';
          } else {
            loginRemember.ftlogin.patternDeviceId = '';
          }
        }
        loginRemember.ftlogin.fastlogin = '1';
        loginRemember.ftlogin.type = 'biometric';
        this.localStorageService.setObj('Remember', loginRemember);
        const copyFT = {
          comparecustId: '',
          compareuserId: '',
        };
        copyFT.comparecustId = loginRemember.userData.custId;
        copyFT.compareuserId = loginRemember.userData.userId;
        this.localStorageService.setObj('Compare', copyFT);

        //新增 綁定是將web與card的 compareId同時變更一樣
        let compareFtData = this.localStorageService.getObj('Compare_card');
        if (compareFtData && compareFtData.comparecustId) {
          compareFtData['comparecustId'] = loginRemember.userData.custId;
        } else {
          compareFtData = {
            comparecustId: loginRemember.userData.custId,
            compareuserId: ''
          };
          compareFtData.comparecustId = loginRemember.userData.custId;
        }
        this.localStorageService.setObj('Compare_card', compareFtData);
        //紀錄最後一次生物辨識綁定
        let lastbind = {
          type: '1',
          cust: loginRemember.userData.custId,
          user: loginRemember.userData.userId ? loginRemember.userData.userId : ''
        }
        this.localStorageService.setObj('lastbind', lastbind);
        this.localStorageService.set('cancelFastLogin', '0');
        this.alert.show('下次登入即可以使用快速登入功能了喔！', { title: '登入設定成功' }).then(
          success => {
            this.navgator.push('security_ftlogin_set', {});
          },
          error => {
            logger.debug('popup error');
          }
        );
      },
      (error) => {
        this.deviceInfo.devicesInfo().then(
          device => {
            const msg = this.errorCompiler(error, device);
            // this.alert.show(msg);
          },
          err => {
            logger.debug('device info error');
          }
        );
      });
  }

  /**
    * 錯誤訊息整理
    * @param Obj 生物辨識回傳Obj
    * @param device 裝置資訊
    */
  errorCompiler(Obj, device?, dftype?: string) {
    let msg: string;
    let check_code = this._formateService.checkField(Obj, 'ret_code', {
      to_string: true,
      trim_flag: true
    });
    if (!!dftype && dftype == 'generate') {
      // 註冊前檢查
      switch (check_code) {
        case '1':
          msg = '您的設備尚未設定生物辨識';
          break;
        case '3':
          msg = '生物辨識尚未設定，請確認是否已設定(指紋/FaceID)';
          break;
        case '13':
          msg = '請重新開啟裝置畫面並輸入密碼解鎖';
          break;
        default:
          msg = '您的設備不支援快速登入(指紋/臉部)功能';
      }
      return msg;
    } else {
      switch (check_code) {
        case '1':
          msg = '硬體設備不支援';
          break;
        case '2':
          msg = '生物辨識尚未啟用';
          break;
        case '3':
          msg = '生物辨識尚未設定或生物辨識已被鎖定';
          break;
        case '4':
          msg = '系統偵測到您的生物辨識有異動';
          break;
        case '5':
          msg = '尚未產製設備信物';
          break;
        case '6':
          msg = '尚未啟用驗證服務';
          break;
        case '7':
          msg = '已啟用驗證服務';
          break;
        case '13':
          msg = '驗證功能被鎖住';
          break;
        case '10':
          msg = '使用者取消驗證';
          break;
        case '11':
          msg = '驗證超過警告次數';
          break;
        case '12':
          msg = '驗證超過允許次數';
          break;
        default:
          msg = '系統錯誤 ' + check_code;
          break;
      }
      return msg;
    }
  }

  /**
     * 圖形鎖註冊綁定
     */
  sendPatternLock(reqObj): Promise<any> {
    return this.deviceInfo.devicesInfo().then(
      (deviceInfo) => {
        const form = new BI000103ReqBody();
        const userInfo = this.session.getObj('userInfo');
        form.custId = userInfo.custId;
        form.userId = userInfo.userId;
        form.license = reqObj.license;
        form.deviceId = deviceInfo.udid;
        form.setType = '1';
        return this.BI000103.send(form).then(
          (resObj) => {
            if (!!resObj.body.hostCodeMsg && resObj.body.hostCodeMsg.indexOf('尚未註冊') > -1) {
              this.resNoRegister();
            }
            return Promise.resolve(resObj.body);
          },
          (errObj) => {
            return Promise.reject(errObj);
          }
        );
      }
    ).catch(
      (err) => {
        return Promise.reject(err);
      }
    );
  }

  /**
     * 強制圖形鎖註冊綁定
     */
  sendForcePatternLock(reqObj): Promise<any> {
    return this.deviceInfo.devicesInfo().then(
      (deviceInfo) => {
        const form = new BI000103ReqBody();
        const userInfo = this.session.getObj('userInfo');
        form.custId = userInfo.custId;
        form.userId = userInfo.userId;
        form.license = reqObj.license;
        form.deviceId = deviceInfo.udid;
        form.setType = '2';
        return this.BI000103.send(form).then(
          (resObj) => {
            if (!!resObj.body.hostCodeMsg && resObj.body.hostCodeMsg.indexOf('尚未註冊') > -1) {
              this.resNoRegister();
            }
            return Promise.resolve(resObj.body);
          },
          (errObj) => {
            this.errorHandle.handleError(errObj);
          }
        );
      }
    ).catch(
      (err) => {
        this.errorHandle.handleError(err);
      }
    );
  }

  /**
   * 取消圖形鎖綁定
   */
  cancelPatternLock(): Promise<any> {
    return this.deviceInfo.devicesInfo().then(
      (deviceInfo) => {
        const form = new BI000103ReqBody();
        const tempRem = this.localStorageService.getObj('Remember');
        const tempRem_card = this.localStorageService.getObj('Remember_card');
        let login_method = this.session.getObj('login_method');
        //增加信用卡特別處理
        let cust = '';
        let user = '';
        if (login_method == '2') {
          cust = tempRem_card.userData.custId;
          user = tempRem_card.userData.userId;
        } else {
          cust = tempRem.userData.custId;
          user = tempRem.userData.userId;
        }
        // tslint:disable-next-line:max-line-length
        let patternDeviceId = (typeof tempRem.ftlogin.patternDeviceId === 'undefined' || (typeof tempRem.ftlogin.patternDeviceId === 'string' && tempRem.ftlogin.patternDeviceId === '')) ?
          deviceInfo.udid : tempRem.ftlogin.patternDeviceId;
        if (tempRem !== null && tempRem.hasOwnProperty('userData') &&
          tempRem.hasOwnProperty('rememberMe') && tempRem.hasOwnProperty('ftlogin')) {
          return this.tcbb.fastAESDecode([cust, user]).then(
            (res_Dncode) => {
              let signText = '123456' + patternDeviceId;
              const tempRem = this.localStorageService.getObj('Remember');
              if (!!tempRem && tempRem.hasOwnProperty('userData')
                && tempRem.hasOwnProperty('rememberMe') && tempRem.hasOwnProperty('ftlogin')) {
                signText = signText + tempRem.ftlogin.patternLockRegisterTime;
                signText = signText + this.auth.getCustId();
              } else {
                return Promise.reject({});
              }
              return this.crypto.SHA256(signText).then(
                (SHA256res) => {
                  return this.auth.digitalEnvelop(Base64Util.encode(SHA256res.value).value).then((digitalEnvelopeRes) => {
                    form.custId = res_Dncode.custId;
                    form.userId = res_Dncode.userId;
                    form.license = digitalEnvelopeRes.value;
                    form.deviceId = patternDeviceId;
                    form.setType = '0';
                    logger.debug(JSON.stringify(form));
                    return this.BI000103.send(form).then(
                      (resObj) => {
                        // 更新local storage
                        if (!!resObj.body.hostCodeMsg && resObj.body.hostCodeMsg.indexOf('尚未註冊') > -1) {
                          this.resNoRegister();
                        } else {
                          const loginRemember = this.localStorageService.getObj('Remember');
                          loginRemember.ftlogin.type = loginRemember.ftlogin.fastlogin == '1' ? 'biometric' : '';
                          loginRemember.ftlogin.hasPatternLock = '0';
                          loginRemember.ftlogin.patternLockRegisterTime = '';
                          loginRemember.ftlogin.payPattern = '0';
                          if (typeof loginRemember.ftlogin.patternDeviceId === 'undefined') {
                            loginRemember.ftlogin['patternDeviceId'] = '';
                          } else {
                            loginRemember.ftlogin.patternDeviceId = '';
                          }
                          delete localStorage['keepPatternLock'];
                          this.localStorageService.setObj('Remember', loginRemember);
                        }
                        // epay cache強制清除
                        this.cacheService.removeGroup('epay-security');
                        return Promise.resolve(resObj.body);
                      },
                      (errObj) => {
                        logger.error('cancel pattern lock error' + errObj);
                        return Promise.reject(errObj);
                      }
                    );
                  }, (digitalEnvelopeErr) => {
                    logger.warn(digitalEnvelopeErr);
                  });
                },
                (SHA256err) => {
                  logger.warn(SHA256err);
                });
            },
            (res_Dncode_err) => {
              logger.warn('res_Dncode_err = ' + res_Dncode_err);
            }
          );
        } else {
          return Promise.reject({});
        }

      }
    ).catch(
      (err) => {
        this.errorHandle.handleError(err);
      }
    );

  }

  /**
   * check allow
   */
  checkAllowDevice() {
    let output: any = {
      allow: true,
      have_bio: false,
      error: {
        type: 'dialog',
        title: 'ERROR.INFO_TITLE',
        content: ''
      }
    };

    if (typeof navigator != 'undefined' && typeof navigator.userAgent != 'undefined') {
      let error_time = 0;
      let user_agent = navigator.userAgent.toString().toLocaleLowerCase();
      let check_list = (typeof BioDisAllowUserAgent != 'undefined') ? BioDisAllowUserAgent : [];

      check_list.forEach(item => {
        if (user_agent.indexOf(item) > -1) {
          error_time++;
        }
      });

      // 不允許
      if (error_time > 0) {
        output.allow = false;
        output.error = {
          type: 'dialog',
          title: 'ERROR.INFO_TITLE',
          content: 'ERROR.LOGIN.BIO_NOT_ALLOW'
        };

        let loginRemember = this.localStorageService.getObj('Remember');
        if (this._formateService.checkObjectList(loginRemember, 'ftlogin')
          && (loginRemember.ftlogin.fastlogin != '0' || loginRemember.ftlogin.pay_setting != '0')
        ) {
          output.have_bio = true;
          loginRemember.ftlogin.fastlogin = '0';
          loginRemember.ftlogin.pay_setting = '0';
          loginRemember.ftlogin.type = (loginRemember.ftlogin.hasPatternLock == '1') ? 'pattern' : '';
          this.localStorageService.setObj('Remember', loginRemember);
        }
      }
    }
    return output;
  }

  /**
   * 設定圖形密碼/生物辨識-台灣Pay交易 check
   */
  checkPayPatternBio(type: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const tempRem = this.localStorageService.getObj('Remember');
      const tempFtData = this.localStorageService.getObj('Compare');
      let info = this.auth.getUserInfo();
      let securityTypes = [];
      let defaultTypes;
      let login_method = this.session.getObj("login_method");
      if (info && login_method != '2') {
        logger.error('info', info);
        if (info.AuthType.indexOf('2') > -1) {
          if (info.cn === null || info.cn === '') { } else {
            securityTypes.push({
              name: '憑證',
              key: 'NONSET'
            });
            defaultTypes = {
              name: '憑證',
              key: 'NONSET'
            };
          }
        }
        if (info.AuthType.indexOf('3') > -1) {
          let OtpInfo = this.auth.getOtpUserInfo();
          // tslint:disable-next-line: max-line-length
          if (info.BoundID === '4' && info.OTPID === '2' && OtpInfo.checkAuthStatus() === true && OtpInfo.checkPwdStatus() === true) {
            securityTypes.push({
              name: 'OTP',
              key: 'OTP'
            });
            defaultTypes = {
              name: 'OTP',
              key: 'OTP'
            };
          }
        }
      } else {
        if (!info.hasOwnProperty('AuthType')) {
          this.auth.setUserInfo_card();
        }
        logger.error('securityTypes', securityTypes);
      }

      if (securityTypes.length === 0 && login_method != '2') {
        this.alert.show('無可用的安控機制').then(() => {
          if (type === 'pattern') {
            this.error_PayPattern();
          } else if (type === 'bio') {
            this.error_TaiwanPay();
            const loginRemember = this.localStorageService.getObj('Remember');
            loginRemember.ftlogin.pay_setting = '0';
            this.localStorageService.setObj('Remember', loginRemember);
          }
          reject();
        });
      } else {
        // tslint:disable-next-line:max-line-length
        if (type === 'pattern' && (tempRem.ftlogin.hasPatternLock !== '1' || (login_method != '2' && tempFtData && (tempFtData.comparecustId !== tempRem.userData.custId &&
          tempFtData.compareuserId !== tempRem.userData.userId)))) {
          this.alert.show('請先進行快速登入(圖形密碼)設定').then(() => {
            this.error_PayPattern();
            reject();
          });
          return;
          // tslint:disable-next-line:max-line-length
        } else if (type === 'bio' && (tempRem.ftlogin.fastlogin !== '1' || (login_method != '2' && tempFtData && (tempFtData.comparecustId !== tempRem.userData.custId &&
          tempFtData.compareuserId !== tempRem.userData.userId)))) {
          this.alert.show('請先進行快速登入(指紋/臉部)設定').then(() => {
            reject({
              login_method: '2'
            });
          });
          return;
        }

        // 檢核成功
        if (securityTypes.length === 1) {
          if (defaultTypes.name === '憑證') {
            const CA_Object = {
              securityType: '2',
              serviceId: (type === 'pattern') ? 'BI000104' : 'BI000101'
            };
            resolve(CA_Object);
          } else {
            const OTP_Object = {
              securityType: '3',
              otpObj: {
                custId: this.auth.getCustId(),
                fnctId: (type === 'pattern') ? 'BI000104' : 'BI000101',
                depositNumber: '1',
                depositMoney: '1',
                OutCurr: '1',
                transTypeDesc: ''
              },
              serviceId: (type === 'pattern') ? 'BI000104' : 'BI000101'
            };
            resolve(OTP_Object);
          }
        } else if (securityTypes.length === 2) {
          // 如果有兩組安控機制,選擇使用憑證 20191206
          const CA_Object = {
            securityType: '2',
            serviceId: (type === 'pattern') ? 'BI000104' : 'BI000101'
          };
          resolve(CA_Object);
        } else if (login_method == '2') { //新增信用卡
          resolve();
        }
      }
    });
  }

  /**
   * 圖形密碼台灣pay設定錯誤
   */
  error_PayPattern() {
    const tempRem = this.localStorageService.getObj('Remember');
    tempRem.ftlogin.payPattern = '0';
    this.localStorageService.setObj('Remember', tempRem);
  }

  /**
   * 發 設定圖形密碼-台灣pay電文流程
   * 注意: form.license = '';
   */
  set_PayPattern(obj): Promise<any> {
    return new Promise((resolve, reject) => {
      let reqData = new FH000203ReqBody();
      return this.fh000203.send(reqData).then( // 取 token
        (sucess) => {
          logger.debug('FH000203 success:', sucess);
          return Promise.resolve(sucess.data);
        },
        (failed) => {
          logger.debug('FH000203 failed:', failed);
          this.error_PayPattern();
          return Promise.reject(failed);
        }
      ).then((trnsToken) => {
        return this.deviceInfo.devicesInfo().then((deviceInfo) => {
          return { 'trnsToken': trnsToken, 'deviceInfo': deviceInfo };
        });
      }).then((allData) => {
        logger.debug('allData:', allData);
        const tempRem = this.localStorageService.getObj('Remember');
        // tslint:disable-next-line:max-line-length
        let patternDeviceId = (typeof tempRem.ftlogin.patternDeviceId === 'undefined' || (typeof tempRem.ftlogin.patternDeviceId === 'string' && tempRem.ftlogin.patternDeviceId === '')) ?
          allData.deviceInfo.udid : tempRem.ftlogin.patternDeviceId;
        const formBI000104 = new BI000104ReqBody();
        const userInfo = this.session.getObj('userInfo');
        formBI000104.custId = userInfo.custId;
        formBI000104.trnsToken = allData.trnsToken;
        formBI000104.bodyDeviceId = patternDeviceId;
        let req = {
          custId: userInfo.custId,
          trnsToken: allData.trnsToken,
          bodyDeviceId: patternDeviceId
        };
        req.bodyDeviceId = ''; // 一定要清空,不然中台匯回錯誤@
        let loginmethod = this.session.getObj('login_method');
        if (loginmethod == '2') {
          this.cardSafePopupService.show('', {}).then(
            (popsuc) => {
              logger.error('pd popup show', popsuc);
              if (popsuc['PD_val']) { //有接收到密碼 數位信封加密
                let diapwd = popsuc['PD_val'];
                this.auth.digitalEnvelop(diapwd).then(
                  (diasuc) => { //加密成功

                    let headerObj: any = {
                      SecurityType: '6',
                      SecurityPassword: diasuc.value
                    };
                    let reqHeader = {
                      header: headerObj
                    };
                    this.BI000104.send(req, reqHeader).then(
                      (res_bi000104) => {
                        logger.debug('bi000104 set res:' + JSON.stringify(res_bi000104));
                        if (res_bi000104.body.trnsRsltCode === '0') {
                          const loginRemember = this.localStorageService.getObj('Remember');
                          loginRemember.ftlogin.payPattern = '1';
                          this.localStorageService.setObj('Remember', loginRemember);
                          // epay cache強制清除
                          this.cacheService.removeGroup('epay-security');
                          resolve(res_bi000104.body);
                        } else {
                          if (!!res_bi000104.body.hostCodeMsg && res_bi000104.body.hostCodeMsg.indexOf('尚未註冊') > -1) {
                            this.resNoRegister();
                            // epay cache強制清除
                            this.cacheService.removeGroup('epay-security');
                            resolve(res_bi000104.body);
                          } else {
                            this.error_PayPattern();
                            const error = new HandleErrorOptions();
                            error.content = res_bi000104.body.hostCodeMsg;
                            this.errorHandle.handleError(error);
                            logger.debug('bi000104 err 1');
                            reject();
                          }
                        }
                      },
                      (error_bi000104) => {
                        logger.debug('bi000104 set err:', error_bi000104);
                        logger.error('error_bi000101',error_bi000104);
                        if(error_bi000104.hasOwnProperty('content') && error_bi000104['content']=='(ERRCARD_0001)'){
                         error_bi000104['content']='信用卡登入密碼錯誤';
                        }
                        this.error_PayPattern();
                        if (typeof error_bi000104 == 'object' && (error_bi000104 instanceof HandleErrorOptions)) {
                          this.errorHandle.handleError(error_bi000104);
                        }
                        // this.errorHandle.handleError(error_bi000104);
                        reject();
                      }
                    );
                  },
                  (diafail) => { //加密失敗
                    logger.error('diafail', diafail);
                    reject(diafail);
                  }
                );

              }
            },
            (popfail) => {
              logger.error('pwd popup show false', popfail);
              reject(popfail);
            }
          );

        } else {
          obj.signText = req;
          this.check_security.doSecurityNextStep(obj).then( // OTP、cert
            res => {
              logger.debug('doSecurityNextStep ok:' + JSON.stringify(res));
              let reqHeader = {
                header: res.headerObj
              };
              this.BI000104.send(req, reqHeader).then(
                (res_bi000104) => {
                  logger.debug('bi000104 set res:' + JSON.stringify(res_bi000104));
                  if (res_bi000104.body.trnsRsltCode === '0') {
                    const loginRemember = this.localStorageService.getObj('Remember');
                    loginRemember.ftlogin.payPattern = '1';
                    this.localStorageService.setObj('Remember', loginRemember);
                    // epay cache強制清除
                    this.cacheService.removeGroup('epay-security');
                    resolve(res_bi000104.body);
                  } else {
                    if (!!res_bi000104.body.hostCodeMsg && res_bi000104.body.hostCodeMsg.indexOf('尚未註冊') > -1) {
                      this.resNoRegister();
                      // epay cache強制清除
                      this.cacheService.removeGroup('epay-security');
                      resolve(res_bi000104.body);
                    } else {
                      this.error_PayPattern();
                      const error = new HandleErrorOptions();
                      error.content = res_bi000104.body.hostCodeMsg;
                      this.errorHandle.handleError(error);
                      logger.debug('bi000104 err 1');
                      reject();
                    }
                  }
                },
                (error_bi000104) => {
                  logger.debug('bi000104 set err:', error_bi000104);
                  this.error_PayPattern();
                  if (typeof error_bi000104 == 'object' && (error_bi000104 instanceof HandleErrorOptions)) {
                    this.errorHandle.handleError(error_bi000104);
                  }
                  // this.errorHandle.handleError(error_bi000104);
                  reject();
                }
              );
            },
            error => {
              logger.debug('doSecurityNextStep error:', error);
              this.error_PayPattern();
              // this.errorHandle.handleError(error);
              reject();
            }
          );
        }

      }).catch((error) => {
        logger.debug('catch err:', error);
        this.error_PayPattern();
        this.errorHandle.handleError(error);
        reject();
      });
    });
  }

  /**
   * 發 取消圖形密碼-台灣pay電文流程
   * 注意: form.license = '';
   */
  cancel_PayPattern(): Promise<any> {
    return this.deviceInfo.devicesInfo().then(
      (deviceInfo) => {
        const tempRem = this.localStorageService.getObj('Remember');
        // tslint:disable-next-line:max-line-length
        let patternDeviceId = (typeof tempRem.ftlogin.patternDeviceId === 'undefined' || (typeof tempRem.ftlogin.patternDeviceId === 'string' && tempRem.ftlogin.patternDeviceId === '')) ?
          deviceInfo.udid : tempRem.ftlogin.patternDeviceId;
        const form = new BI000103ReqBody();
        const userInfo = this.session.getObj('userInfo');
        form.custId = userInfo.custId;
        form.userId = userInfo.userId;
        form.license = '';
        form.deviceId = patternDeviceId;
        form.setType = '4';
        logger.debug(JSON.stringify(form));
        return this.BI000103.send(form).then(
          (resObj) => {
            logger.debug('bi000103 cancel res:' + JSON.stringify(resObj));
            if (!!resObj.body.hostCodeMsg && resObj.body.hostCodeMsg.indexOf('尚未註冊') > -1) {
              this.resNoRegister();
            } else {
              let tempRem = this.localStorageService.getObj('Remember');
              tempRem.ftlogin.payPattern = '0';
              this.localStorageService.setObj('Remember', tempRem);
            }
            // epay cache強制清除
            this.cacheService.removeGroup('epay-security');
            return Promise.resolve(resObj.body);
          },
          (errObj) => {
            logger.debug('bi000103 cancel errObj');
            return Promise.reject(errObj);
          }
        );
      }
    ).catch((err) => {
      logger.debug('catch err');
      this.errorHandle.handleError(err);
      return Promise.reject(err);
    });
  }

  /**
   * 圖形密碼base64 > SHA256 > AES_Encrypt
   * epay使用圖形密碼時比對之用
   * type==1, 圖形密碼啟用快速登入使用
   */
  keepPatternLock(base64Value: string, type?: string): Promise<any> {
    return this.crypto.SHA256(base64Value).then(
      (toSHA256res) => {
        // logger.debug('pattern SHA256 res:' + JSON.stringify(toSHA256res));
        if (type === '1') {
          // 圖形密碼啟用快速登入
          this.localStorageService.setObj('keepPatternLock', toSHA256res.value);
        }
        return Promise.resolve(toSHA256res.value);
      }
    ).catch((err) => {
      logger.debug('keepPatternLock catch err:' + err);
      return Promise.reject(err);
    });
  }

  resNoRegister() {
    const loginRemember = this.localStorageService.getObj('Remember');
    if (loginRemember.ftlogin.pay_setting === '1' ||
      loginRemember.ftlogin.fastlogin === '1' ||
      loginRemember.ftlogin.hasPatternLock === '1' ||
      loginRemember.ftlogin.payPattern === '1') {
      this.localStorageService.setObj('beforeClearBioPatternFlag', '1');
    }
    loginRemember.ftlogin.pay_setting = '0';
    loginRemember.ftlogin.fastlogin = '0';
    loginRemember.ftlogin.hasPatternLock = '0';
    loginRemember.ftlogin.patternLockRegisterTime = '';
    loginRemember.ftlogin.payPattern = '0';
    loginRemember.ftlogin.type = 'pwdlogin';
    if (typeof loginRemember.ftlogin.patternDeviceId === 'undefined') {
      loginRemember.ftlogin['patternDeviceId'] = '';
    } else {
      loginRemember.ftlogin.patternDeviceId = '';
    }
    delete localStorage['keepPatternLock'];
    this.localStorageService.setObj('Remember', loginRemember);
  }

}
