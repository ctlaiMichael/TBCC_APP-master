import { Injectable, OnInit } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { BiometricService } from '@lib/plugins/biometric.service';
import { DeviceService } from '@lib/plugins/device.service';

import { F1000101ApiService } from '@api/f1/f1000101/f1000101-api.service';
import { F1000101ReqBody } from '@api/f1/f1000101/f1000101-req';
import { BI000100ApiService } from '@api/bi/bi000100/bi000100-api.service';
import { BI000100ReqBody } from '@api/bi/bi000100/bi000100-req';
import { BI000102ApiService } from '@api/bi/bi000102/bi000102-api.service';
import { BI000102ReqBody } from '@api/bi/bi000102/bi000102-req';
import { TcbbService } from '@lib/plugins/tcbb/tcbb.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { logger } from '@shared/util/log-util';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { Base64Util } from '@shared/util/formate/modify/base64-util';
import { SecurityService } from '@pages/security/shared/service/security.service';
import { CryptoService } from '@lib/plugins/crypto.service';
import { FormateService } from '@shared/formate/formate.service';
import { BI000105ApiService } from '@api/bi/bi000105/bi000105-api.service';
import { BI000105ReqBody } from '@api/bi/bi000105/bi000105-req';
import { SessionStorageService } from '@lib/storage/session-storage.service';
@Injectable()
export class FtLoginService {

  constructor(
    private F1000101: F1000101ApiService,
    private BI000100: BI000100ApiService,
    private BI000102: BI000102ApiService,
    private BI000105: BI000105ApiService,
    private authService: AuthService,
    private biometricService: BiometricService,
    private deviceInfo: DeviceService,
    private tcbb: TcbbService,
    private auth: AuthService,
    private errorHandle: HandleErrorService,
    private localStorageService: LocalStorageService,
    private deviceService: DeviceService,
    private securityService: SecurityService,
    private crypto: CryptoService,
    private _formateService: FormateService,
    private session: SessionStorageService
  ) { }

  // 錯誤次數判斷
  loginErrorCount = 0;

  login(obj): Promise<any> {
    return new Promise((resolve, reject) => {
      // 檢核有沒有輸入
      if (obj.custId == null || obj.custId === '') {
        reject({
          title: '登入失敗',
          content: '請輸入身分證字號'
        });
      } else if (obj.userId === '' || obj.userId == null) {
        reject({
          title: '登入失敗',
          content: '請輸入網路連線代號'
        });
      } else if (obj.pwd == null || obj.pwd === '') {
        reject({
          title: '登入失敗',
          content: '請輸入密碼'
        });
      } else {
        // 登入流程
        this.authService.digitalEnvelop(obj.pwd).then(
          (res) => {
            const form = new F1000101ReqBody();
            form.userId = obj.userId;
            form.custId = obj.custId;
            form.password = obj.pwd;
            this.F1000101.send(form).then(
              (res1001) => {
                this.authService.userInfo = res1001; // 儲存userInfo;
                resolve(res1001);
              }).catch(
                (error) => {
                  reject(error);
                });
          }).catch(
            (err) => {
              reject(err);
            });
      }
    }
    );
  }

  /**
   * OS 指紋檢測
   * 指紋辨識使用
   * @param txData custId + userId
   * @param promptMessage popup msg
   * 回應資料:
   * ret_code - 回傳值
   * err_msg - 系統錯誤訊息
   * device_id - 設備識別碼
   * mac_value - 驗證值
   */
  requestBioService(userData, promptMessage: string, txData?: string): Promise<any> {
    return new Promise((resolve, reject) => {

      const end_data = {
        lock: false,
        hideError: false, // 不顯示錯誤
        data: {},
        msg: ''
      };

      txData = userData.custId + userData.userId.toUpperCase();

      const successMethod = (success) => {
        return this.auth.digitalEnvelop('123')    // 加密
          .then((res) => {  // 組BI000102上行
			logger.error('requestBioService success',success);
            end_data.data = success;
            const macValue = success.mac_value;
            const form = new BI000102ReqBody();
            form.custId = userData.custId;
            form.userId = userData.userId.toUpperCase();
            form.mac = macValue;
            return form;
          })
          .then(form => {
            // 取cn
            return this.tcbb.setF1000102Data({ nbCert: this.auth.nbCert }, form.custId, form.userId)
              .then(res_cn => {
                if (res_cn.cn.indexOf(form.custId) <= -1) {
                  res_cn.cn = '';
                  res_cn.sn = '';
                }
                let reqHeader = {
                  header: { cn: res_cn.cn }
                };
                return this.BI000102.send(form, reqHeader)
                  .then(
                    BI000102res => {
                      // 儲存資料
                      this.auth.setUserInfo(BI000102res.body, form.userId);
                      this.auth.setCn(res_cn.cn, res_cn.sn);
                      this.auth.initTimer();
                      resolve(BI000102res.body);
                    }).catch(
                      (err) => {
                        if (err.hasOwnProperty('body') && err.body.respCode === 'ERRBI_0001') {
                          this.biometricService.disableBioService().then(
                            (resObj) => {
                              resObj.ret_code = 'sendFail_BI000102_ERRBI_0001';
                              end_data.data = resObj;
                              end_data.msg = err.body.respCodeMsg;
                              reject(end_data);
                            },
                            (errorObj) => {
                              this.errorCompiler(errorObj).then(
                                // tslint:disable-next-line: no-shadowed-variable
                                (errorMsg) => {
                                  end_data.data = errorObj;
                                  end_data.msg = errorMsg;
                                  reject(end_data);
                                }
                              );
                            }
                          );
                        } else if (err.hasOwnProperty('body') && err.body.respCode === 'ERRBI_0005') {
                          const data = { ret_code: 'sendFail_BI000102_ERRBI_0005' };
                          end_data.data = data;
                          end_data.msg = err.body.respCodeMsg;
                          reject(end_data);
                        } else {
                          end_data.data = err;
                          end_data.msg = err.content;
                          reject(end_data);
                        }
                      });
              });
          }).catch(
            (sendError) => {
              this.errorHandle.handleError(sendError);
            }
          );
      };

      const errorMethod = (errorObj) => {
        end_data.data = errorObj;
        let check_code = this._formateService.checkField(errorObj, 'ret_code', {
          to_string: true,
          trim_flag: true
        });
        this.errorCompiler(errorObj).then(
          (errorMsg) => {
            end_data.msg = errorMsg;
            // ret_code = 4 取消生物辨識註冊
            if (check_code === '4') {
              this.biometricService.disableBioService().then(
                (disableRes) => {
                },
                (disableErr) => {
                }
              );
              const form = new BI000100ReqBody();
              form.custId = userData.custId;
              form.userId = userData.userId.toUpperCase();
              form.token = localStorage.getItem('token');
              form.functionType = '0';
              this.BI000100.send(form).then(
                (res) => {
                  // 清空快速登入設定參數
                  // this.clearBioLogin();
                  // resolve(res);
                }).catch(
                  (err) => {
					// reject(err);
                    end_data.data = err;
                    end_data.msg = err.content;
                    reject(err);
                  });
            } else if (check_code === '10') {
              // ret_code = 10 使用者取消
              end_data.hideError = true;
              reject(end_data);
            } else {
              reject(end_data);
            }
          }
        );
      };
      this.biometricService.requestBioService(promptMessage, txData).then(
        (resObj) => {
          successMethod(resObj);
        },
        (errorObj) => {
          errorMethod(errorObj);
        }
      );
    });
  }
/**
   * OS 指紋檢測 for 信卡
   * 指紋辨識使用
   * @param txData custId + userId
   * @param promptMessage popup msg
   * 回應資料:
   * ret_code - 回傳值
   * err_msg - 系統錯誤訊息
   * device_id - 設備識別碼
   * mac_value - 驗證值
   */
  requestBioService_card(userData, promptMessage: string, txData?: string): Promise<any> {
    return new Promise((resolve, reject) => {

      const end_data = {
        lock: false,
        hideError: false, // 不顯示錯誤
        data: {},
        msg: ''
      };

      txData = userData.custId + userData.userId.toUpperCase();

      const successMethod = (success) => {
        return this.auth.digitalEnvelop('123')    // 加密
          .then((res) => {  // 組BI000105上行
            end_data.data = success;
            const macValue = success.mac_value;
            const form = new BI000105ReqBody();
            form.custId = userData.custId;
            form.userId = userData.userId.toUpperCase();
            form.mac = macValue;
            return form;
          })
          .then(form => {     
                return this.BI000105.send(form)
                  .then(
                    BI000105res => {
                      if(BI000105res.body.validateResult!='0'){
                        reject(BI000105res);
                      }
                      logger.info('BI000105 success',BI000105res);
                      // 儲存資料
                      this.session.setObj('userInfo', {
                        custId:form.custId,
                        userId:form.userId.toUpperCase(),
                        isLogin:true,
                        loginCardUser:true,
                        sessionId:BI000105res.body.sessionId
                    });
                    sessionStorage.setItem('login_method','2');
                      // this.auth.setUserInfo_card();
                      this.auth.initTimer();
                      logger.error('will resolve');
                      resolve(BI000105res.body);
                    }).catch(
                      (err) => {
                        logger.info('BI000105 err',err);
                        if (err.hasOwnProperty('body') && err.body.respCode === 'ERRBI_0001') {
                          this.biometricService.disableBioService().then(
                            (resObj) => {
                              resObj.ret_code = 'sendFail_BI000102_ERRBI_0001';
                              end_data.data = resObj;
                              end_data.msg = err.body.respCodeMsg;
                              reject(end_data);
                            },
                            (errorObj) => {
                              this.errorCompiler(errorObj).then(
                                // tslint:disable-next-line: no-shadowed-variable
                                (errorMsg) => {
                                  end_data.data = errorObj;
                                  end_data.msg = errorMsg;
                                  reject(end_data);
                                }
                              );
                            }
                          );
                        } else if (err.hasOwnProperty('body') && err.body.respCode === 'ERRBI_0005') {
                          const data = { ret_code: 'sendFail_BI000102_ERRBI_0005' };
                          end_data.data = data;
                          end_data.msg = err.body.respCodeMsg;
                          reject(end_data);
                        } else {
                          end_data.data = err;
                          end_data.msg = err.content;
                          reject(end_data);
                        }
                      });
             
          }).catch(
            (sendError) => {
              this.errorHandle.handleError(sendError);
            }
          );
      };
      const errorMethod = (errorObj) => {
        end_data.data = errorObj;
        let check_code = this._formateService.checkField(errorObj, 'ret_code', {
          to_string: true,
          trim_flag: true
        });
        this.errorCompiler(errorObj).then(
          (errorMsg) => {
            end_data.msg = errorMsg;
            // ret_code = 4 取消生物辨識註冊
            if (check_code === '4') {
              this.biometricService.disableBioService().then(
                (disableRes) => {
                },
                (disableErr) => {
                }
              );
              const form = new BI000100ReqBody();
              form.custId = userData.custId;
              form.userId = userData.userId.toUpperCase();
              form.token = localStorage.getItem('token');
              form.functionType = '0';
              this.BI000100.send(form).then(
                (res) => {
                  // 清空快速登入設定參數
                  this.clearBioLogin();
                  resolve(res);
                }).catch(
                  (err) => {
                    // reject(err);
                    // end_data.data = err;
                    // end_data.msg = err.content;
                    // reject(end_data);
                  });
                  this.clearBioLogin();
                  reject(end_data);
            } else if (check_code === '10') {
              // ret_code = 10 使用者取消
              end_data.hideError = true;
              reject(end_data);
            } else {
              reject(end_data);
            }
          }
        );
      };
      this.biometricService.requestBioService(promptMessage, txData).then(
        (resObj) => {
          logger.info('requestBioService resObj',resObj);
          successMethod(resObj);
        },
        (errorObj) => {
          logger.info('requestBioService eror',errorObj);
          errorMethod(errorObj);
        }
      );
    });
  }

   patternLockLogin(reqObj,loginType?): Promise<any> {
    return new Promise((resolve, reject) => {
      this.deviceService.devicesInfo().then(
        (deviceInfo) => {
          // 圖形鎖簽章
          // 1.圖形密碼對映數值序列。
          // 2.Device唯一碼。
          // 3.註冊時間資訊：於註冊流程會存取至APP的localStroage，APP刪除後會消失。目前用秒數
          // 4.custId
          const tempRem = this.localStorageService.getObj('Remember');
          // 如果設定圖形密碼當下的deviceId存在,則使用之
          // tslint:disable-next-line:max-line-length
          let patternDeviceId = (typeof tempRem.ftlogin.patternDeviceId === 'undefined' || (typeof tempRem.ftlogin.patternDeviceId === 'string' && tempRem.ftlogin.patternDeviceId === '')) ?
            deviceInfo.udid : tempRem.ftlogin.patternDeviceId;

          let signText = reqObj.patternPwd + patternDeviceId;
          // tslint:disable-next-line:max-line-length
          if (!!tempRem && tempRem.hasOwnProperty('userData') && tempRem.hasOwnProperty('rememberMe') && tempRem.hasOwnProperty('ftlogin')) {
            signText = signText + tempRem.ftlogin.patternLockRegisterTime;
            signText = signText + reqObj.custId;
          } else {
            return Promise.reject({});
          }
          this.crypto.SHA256(signText).then(
            (SHA256res) => {
              let keepBase64Value = Base64Util.encode(SHA256res.value).value;
              this.auth.digitalEnvelop(Base64Util.encode(SHA256res.value).value).then((digitalEnvelopeRes) => {
                //新增信用卡登入
                if( loginType == '2'){ 
                  const form = {
                    custId: reqObj.custId,
                    userId: reqObj.userId.toUpperCase(),
                    password:'',
                    mac: digitalEnvelopeRes.value, // 使用 base64 加密
                    licenseType: '1' // 1-圖形鎖
                  };
                  this.BI000105.send(form).then(
                    (BI000105res) => {
                      logger.error('BI000105res',BI000105res);
                      const tmpKeepPatternLock = this.localStorageService.getObj('keepPatternLock');
                      if (!tmpKeepPatternLock) {
                        this.securityService.keepPatternLock(keepBase64Value, '1');
                      }
                      keepBase64Value = '';
                      // 儲存資料
                      this.auth.setUserInfo(BI000105res.body, form.userId);
                      this.auth.initTimer();
                      resolve(BI000105res.body);
                    },
                    (BI000102error) => {
                      reject(BI000102error);
                    }
                  );
                }else{  //網銀登入
                  this.tcbb.setF1000102Data({ nbCert: this.auth.nbCert }, reqObj.custId, reqObj.userId).then(
                    (res_cn) => {
                      const form = {
                        custId: reqObj.custId,
                        userId: reqObj.userId.toUpperCase(),
                        mac: digitalEnvelopeRes.value, // 使用 base64 加密
                        licenseType: '1' // 1-圖形鎖
                      };
                      if (res_cn.cn.indexOf(reqObj.custId) <= -1) {
                        res_cn.cn = '';
                        res_cn.sn = '';
                      }
                      let reqHeader = {
                        header: { cn: res_cn.cn }
                      };
                      this.BI000102.send(form, reqHeader).then(
                        (BI000102res) => {
                          const tmpKeepPatternLock = this.localStorageService.getObj('keepPatternLock');
                          if (!tmpKeepPatternLock) {
                            this.securityService.keepPatternLock(keepBase64Value, '1');
                          }
                          keepBase64Value = '';
                          // 儲存資料
                          this.auth.setUserInfo(BI000102res.body, form.userId);
                          this.auth.setCn(res_cn.cn, res_cn.sn);
                          this.auth.initTimer();
                          resolve(BI000102res.body);
                        },
                        (BI000102error) => {
                          reject(BI000102error);
                        }
                      );
                    }
                  );
                }
              });
              // 取cn
            }
          ).catch(err => {
            this.errorHandle.handleError(err);
          });
        }
      );
    });
  }

  /**
   * 錯誤訊息整理
   * @param Obj 生物辨識回傳Obj
   */
  errorCompiler(Obj): Promise<any> {
    let msg: string;
    let check_code = this._formateService.checkField(Obj, 'ret_code', {
      to_string: true,
      trim_flag: true
    });
    return new Promise((resolve, reject) => {
      switch (check_code) {
        case '-1':
          msg = '資料驗證失敗，請重新設定指紋/臉部快速登入';
          resolve(msg);
          break;
        case '1':
          msg = '硬體設備不支援';
          resolve(msg);
          break;
        case '2':
          msg = '生物辨識尚未啟用';
          resolve(msg);
          break;
        case '3':
          msg = '生物辨識尚未設定';
          resolve(msg);
          break;
        case '4':
          msg = '系統偵測到您的生物辨識有異動，請重新註冊生物辨識';
          resolve(msg);
          break;
        case '5':
          msg = '尚未產製設備信物';
          resolve(msg);
          break;
        case '6':
          msg = '尚未啟用驗證服務';
          resolve(msg);
          break;
        case '7':
          msg = '已啟用驗證服務';
          resolve(msg);
          break;
        case '13':
          msg = '驗證功能被鎖住';
          resolve(msg);
          break;
        case '10':
          msg = '您已取消驗證';
          resolve(msg);
          break;
        case '11':
          this.localStorageService.set('cancelFastLogin', '0');
          this.deviceInfo.devicesInfo().then(
            // tslint:disable-next-line: no-shadowed-variable
            (deviceData) => {
              if (deviceData.model === 'iPhone10,6' || deviceData.model === 'iPhone10,3') {
                msg = '臉部辨識錯誤已達3次，請確認後再試';
                resolve(msg);
              } else {
                msg = '指紋辨識錯誤已達3次，請確認後再試';
                resolve(msg);
              }
            },
            (deviceError) => {
              logger.error('device info error', deviceError);
              msg = '生物辨識錯誤已達3次，請確認後再試';
              resolve(msg);
            }
          );
          break;
        case '12':
          this.deviceInfo.devicesInfo().then(
            // tslint:disable-next-line: no-shadowed-variable
            (deviceData) => {
              // this.securityService.cancelftLogin();
              this.localStorageService.set('cancelFastLogin', '1');
              if (deviceData.model === 'iPhone10,6' || deviceData.model === 'iPhone10,3') {
                msg = '臉部辨識錯誤已達5次，請重新設定或改用密碼登入，系統將自動取消臉部辨識快速登入';
                resolve(msg);
              } else {
                msg = '指紋辨識錯誤已達5次，請重新設定或改用密碼登入，系統將自動取消指紋辨識快速登入';
                resolve(msg);
              }
              // }
            },
            (deviceError) => {
              logger.error('device info error', deviceError);
              msg = '生物辨識錯誤已達5次，請重新設定或改用密碼登入，系統將自動取消指紋辨識快速登入';
              resolve(msg);
            }
          );
          break;
        default:
          msg = '系統錯誤 ' + check_code;
          resolve(msg);
          break;
      }
    });
  }

  /**
   * 清空生物辨識登入
   */
  private clearBioLogin() {
    let loginRemember = this.localStorageService.getObj('Remember');
    if (!!loginRemember.ftlogin) {
      // bioLogin=0
      if (!!loginRemember.ftlogin.fastlogin) {
        loginRemember.ftlogin.fastlogin = '0';
      }
      // login_setting=0
      if (!!loginRemember.ftlogin.type) {
        loginRemember.ftlogin.type = 'pwdlogin';
      }
      this.localStorageService.setObj('Remember', loginRemember);
    }
  }

  /**
   * 遮罩前N碼
   * @param firstN
   */
  getMaskedCustid(firstN: number, lastN?: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const tempFtData = this.localStorageService.getObj('Compare');
      if (tempFtData !== null && tempFtData.hasOwnProperty('comparecustId') && tempFtData.hasOwnProperty('compareuserId')) {
        this.tcbb.fastAESDecode([tempFtData.comparecustId, tempFtData.compareuserId]).then(
          (res_Dncode) => {
            // logger.debug('res_Dncode:', res_Dncode);
            if (lastN) {
              resolve(String(res_Dncode.custId).substr(firstN, lastN) + '*'.repeat(lastN));
            } else {
              resolve('*'.repeat(firstN) + String(res_Dncode.custId).substr(firstN));
            }
          },
          (error_Dncode) => {
            // logger.debug('error_Dncode:', error_Dncode);
            resolve('');
          }
        );
      } else {
        resolve('');
      }
    });
  }

/**
   * 遮罩前N碼(信卡)
   * @param firstN
   */
  getMaskedCustid_card(firstN: number, lastN?: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const tempFtData = this.localStorageService.getObj('Compare_card');
      if (tempFtData !== null && tempFtData.hasOwnProperty('comparecustId') && tempFtData.hasOwnProperty('compareuserId')) {
        this.tcbb.fastAESDecode([tempFtData.comparecustId, tempFtData.compareuserId]).then(
          (res_Dncode) => {
            // logger.debug('res_Dncode:', res_Dncode);
            if (lastN) {
              resolve(String(res_Dncode.custId).substr(firstN, lastN) + '*'.repeat(lastN));
            } else {
              resolve('*'.repeat(firstN) + String(res_Dncode.custId).substr(firstN));
            }
          },
          (error_Dncode) => {
            // logger.debug('error_Dncode:', error_Dncode);
            resolve('');
          }
        );
      } else {
        resolve('');
      }
    });
  }
    /**
   * 遮罩前N碼(信卡) 綁定過首次更新新卡登入版本
   * @param firstN
   */
  getMaskedCustid_Remember_card(firstN: number, lastN?: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const tempFtRemember =this.localStorageService.getObj('Remember_card'); //綁定過首次更新新卡登入版本
      if (tempFtRemember !== null && tempFtRemember.hasOwnProperty('userData') && tempFtRemember['userData'].hasOwnProperty('custId')) {
        this.tcbb.fastAESDecode([tempFtRemember.userData.custId, tempFtRemember.userData.userId]).then(
          (res_Dncode) => {
            // logger.debug('res_Dncode:', res_Dncode);
            if (lastN) {
              resolve(String(res_Dncode.custId).substr(firstN, lastN) + '*'.repeat(lastN));
            } else {
              resolve('*'.repeat(firstN) + String(res_Dncode.custId).substr(firstN));
            }
          },
          (error_Dncode) => {
            // logger.debug('error_Dncode:', error_Dncode);
            resolve('');
          }
        );
      } else {
        resolve('');
      }
    });
  }
}
