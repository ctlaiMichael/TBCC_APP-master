import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { CordovaService } from '@base/cordova/cordova.service';
import { F1000102ResBody } from '@api/f1/f1000102/f1000102-res';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { SessionStorageService } from '@lib/storage/session-storage.service';
import { FieldUtil } from '@shared/util/formate/modify/field-util';
import { logger } from '@shared/util/log-util';
import { DeviceService } from '@lib/plugins/device.service';
declare var plugin: any;
/**
 * 介接TCBB Native
 */

@Injectable()
export class TcbbService extends CordovaService {
  private maxErrorCount = 3;
  private certErrorKey = 'certErrorTimes';

  constructor(
    private _localStorage: LocalStorageService,
    private _sessionStorage: SessionStorageService,
    private _deviceService: DeviceService
  ) {
    super();
  }

  public doLogin(): Promise<any> {
    return this.onDeviceReady.then(
      () =>
        new Promise((resolve, reject) => plugin.tcbb.doLogin(resolve, reject))
    );
  }

  public doLogout(): Promise<any> {
    return this.onDeviceReady.then(
      () =>
        new Promise((resolve, reject) => plugin.tcbb.doLogout(resolve, reject))
    );
  }

  public returnHome(): Promise<any> {
    return this.onDeviceReady.then(
      () =>
        new Promise((resolve, reject) =>
          plugin.tcbb.returnHome(resolve, reject)
        )
    );
  }

  public getSessionID(): Promise<any> {
    return this.onDeviceReady.then(
      () =>
        new Promise((resolve, reject) =>
          plugin.tcbb.getSessionID(resolve, reject)
        )
    );
  }

  /**
   * 全景數位信封加密
   * @param type 類別 PureSign or CertEncrypt
   * @param nbCert 數位信封簽章
   * @param signText 密碼
   */
  public doCGUMethod(type, nbCert, signText): Promise<any> {
    let ArrData = [];
    if (type === 'PureSign') {
      ArrData = ['PureSign', nbCert, signText];
    } else if (type === 'CertEncrypt') {
      ArrData = ['CertEncrypt', nbCert, signText, 0];
    }

    return this.onDeviceReady
    .then(() => new Promise((resolve, reject) => {
      let successMethod = (resObj) => {
        if (type !== 'PureSign') {
          resolve(resObj);
          // logger.log('doCGUMethod=>CertEncrypt');
          return;
        }
        // logger.log('doCGUMethod=>PureSign');

        // 不能去auth.service拿，此檔案有被auth.service引用
        let userInfo = this._sessionStorage.getObj('userInfo');
        if (typeof userInfo != 'object' || !userInfo) {
          userInfo = {};
        }
        let sn = FieldUtil.checkField(userInfo, 'serialNumber');
        if (!sn) {
          sn = '';
        }

        logger.log('SN', sn);

        let output: any = {
          plugin_back_type: 'success_method',
          status: false,
          error: 0,
          value: '',
          retry: false,
          lock: false,
          msg: '',
          error_times: 0
        };
        logger.log('successMethod', resObj);

        let errorCode = FieldUtil.checkField(resObj, 'error');
        output.error = errorCode;
        output.value = FieldUtil.checkField(resObj, 'value');
        // logger.log('errorCode', errorCode);
        let obj = this.getCertError(sn);
        let countCertificateError = obj.errorTimes;
        // 5064?5071?
        if (errorCode == '5064' || errorCode == '5071') {
          // error
          this.saveCertError(sn, 1);
          countCertificateError++;
          output.status = false;
          output.msg = '憑證保護密碼錯誤';
          output.error_times = countCertificateError;
          output.retry = true;
        } else if (errorCode == '0') {
          if (countCertificateError < this.maxErrorCount) {
            // success
            output.status = true;
            output.error_times = 0;
            this.saveCertError(sn, 0);
          }
        } else {
          output.status = false;
          output.error = errorCode;
          output.retry = true;
          output.msg = '錯誤碼 ( ' + errorCode + ' )';
        }

        if (countCertificateError >= this.maxErrorCount) {
          output.status = false;
          output.lock = true;
          output.retry = false;
          output.msg = '憑證保護密碼連續錯誤3次，憑證己被鎖';
          this.saveCertError(sn, 2);
        }

        if (output.status) {
          // logger.log('doCGUMethod output', output);
          resolve(output);
        } else {
          logger.error('doCGUMethod output', output);
          reject(output);
        }
      };
      let errorMethod = (errObj) => {
        logger.log('errorMethod', errObj);
        reject(errObj);
      };

      if (environment.NATIVE) {
        plugin.tcbb.doCGUMethod(ArrData, successMethod, errorMethod);
      } else {
        //tslint:disable-next-line:max-line-length
        successMethod({error: 0, value: 'MIIB3QYJKoZIhvcNAQcDoIIBzjCCAcoCAQAxggGFMIIBgQIBADBpMGExCzAJBgNVBAYTAlRXMRswGQYDVQQKExJUQUlXQU4tQ0EuQ09NIEluYy4xGDAWBgNVBAsTD0V2YWx1YXRpb24gT25seTEbMBkGA1UEAxMSVGFpQ0EgVGVzdCBGWE1MIENBAgRO0Xc7MA0GCSqGSIb3DQEBAQUABIIBAFpq9HgytSKoCOy8zx0XjL3TbeqcxCg3K+fGKrZ8FzTRcUIrHiieM1rVcGMuI2O80dmKL1xg0o6z2HX/Pv3fqdZMvVfXD5ecKAqrRlp4vEzPtSIIYcofubQ6YCDXTh/cDAE1L04N0f37OU4F+jLElaW0JRvOApyMzAYDPOzbGDl47+JBwJQjg7S47k73xybH/6my1qWaLxtDSXm1CgJXi1163mFTyffpbkZibkb44oQ5LFb0wfV+ZwoYoPJIeRFGhKmRnzXozn2HiA/99JywrI/AiIDWytvVZKxCdh/ZDomBHxf+w/B7UYU+WUFAbCs3SVzTcRTNXZnR2hMvqX+aW2IwPAYJKoZIhvcNAQcBMB0GCWCGSAFlAwQBAgQQ9rqH4y2+hsIKGQmioTjYLIAQgzFQfP1Dc/YfPJ/ahEPooQ==' });
        //successMethod({ value: '', error: 5071 });
      }
    }));
  }

  /**
   * 解密
   * @param Data Array
   */
  public fastAESDecode(Data): Promise<any> {
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => plugin.tcbb.fastAESDecode(Data, resolve, reject)));
    } else {
      let tmp_custID = (!!Data[0]) ? Data[0].toString() : '';
      let tmp_userID = (!!Data[1]) ? Data[1].toString() : '';
      tmp_custID = tmp_custID.replace('hsIKGQmioTjYLIAQgzFQfP1Dc/YfPJ/ahEPooQ==', '');
      tmp_userID = tmp_userID.replace('TjYLIAQgzFQfP1Dc/YfPJ/ahEPooQ==', '');
      if (tmp_custID == '') {
        tmp_custID = 'A123456789';
      }
      if (tmp_userID == '') {
        tmp_userID = 'A12345678999';
      }
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({
              custId: tmp_custID,
              userId: tmp_userID
            });
          }, 100);
        }));
    }
  }

  /**
   * 加密
   * @param Data Array
   */
  public fastAESEncode(Data): Promise<any> {
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => new Promise((resolve, reject) => plugin.tcbb.fastAESEncode(Data, resolve, reject)));
    } else {
      let tmp_custID = (!!Data[0]) ? Data[0] : '';
      let tmp_userID = (!!Data[1]) ? Data[1] : '';
      return this.onDeviceReady
        // tslint:disable-next-line:max-line-length
        .then(() => new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({
              custId: 'hsIKGQmioTjYLIAQgzFQfP1Dc/YfPJ/ahEPooQ==' + tmp_custID
              , userId: 'TjYLIAQgzFQfP1Dc/YfPJ/ahEPooQ==' + tmp_userID
            });
          }, 100);
        }));
    }
  }

  public getBannerInfo(): Promise<any> {
    return this.onDeviceReady.then(
      () =>
        new Promise((resolve, reject) =>
          plugin.tcbb.getBannerInfo(resolve, reject)
        )
    );
  }

  /**
   * 
   * @param res F1000102ResBody
   * @param custId 身分證字號
   * @param userId 使用者代碼
   */
  public setF1000102Data(res: F1000102ResBody, custId: string, userId: string): Promise<any> {
    let send_device = this._deviceService.getCertDevice(false);
    logger.log('setF1000102Data send_device:',send_device);
    if (!environment.NATIVE) {
      // 模擬native測試
      let output = { cn: custId, sn: '4D1234' };
      return Promise.resolve(output);
    }
    return this.onDeviceReady.then(
      () => {
        return new Promise((resolve, reject) => {
          plugin.tcbb.setF1000102Data([res, custId, userId, send_device],
            (res_cn) => {
              let output: any = {
                  cn: '',
                  sn: ''
              };
              if (typeof res_cn == 'object' && !!res_cn
                  && typeof res_cn.cn != 'undefined'
                  && !!res_cn.cn
                  && res_cn.cn.indexOf(custId) > -1
              ) {
                  output = res_cn;
                  resolve(output);
                  return false;
              }

              // 20200130 Android憑證消失reget處理
              this.regetSetF1000102Data(res, custId, userId).then(
                (secn_output) => {
                  logger.log('regetSetF1000102Data back',secn_output);
                  if (!!secn_output) {
                    resolve(secn_output);
                  } else {
                    resolve(output);
                  }
                },
                (secn_error) => {
                  resolve(output);
                }
              );

            },
            (error) => {
              resolve({
                cn: '',
                sn: ''
              });
            });
        });
      }
    );
  }

  public getMobileNo(): Promise<any> {
    if (!environment.NATIVE) {
      return new Promise((resolve, reject) => resolve('12345'));
    } else {
      return this.onDeviceReady
      .then(() => {
        return new Promise((resolve, reject) => {
          plugin.tcbb.getMobileNo((res) => {
            let output = '';
            if (typeof res != 'undefined' && res) {
              output = res;
            }
            resolve(output);
          }, (err) => {
            reject(err);
          });
        });
      });
    }
  }

  public checkServer(): Promise<any> {
    return this.onDeviceReady.then(
      () =>
        new Promise((resolve, reject) =>
          plugin.tcbb.checkServer(resolve, reject)
        )
    );
  }

  public returnMobileBank(): Promise<any> {
    return this.onDeviceReady.then(
      () =>
        new Promise((resolve, reject) =>
          plugin.tcbb.returnMobileBank(resolve, reject)
        )
    );
  }

  public updateCertificateInfo(): Promise<any> {
    return this.onDeviceReady.then(
      () =>
        new Promise((resolve, reject) =>
          plugin.tcbb.updateCertificateInfo(resolve, reject)
        )
    );
  }

  /**
   * 檢查是否憑證已被鎖
   */
  public checkCertLock(): boolean {
    let userInfo = this._sessionStorage.getObj('userInfo');
    if (typeof userInfo != 'object' || !userInfo) {
      userInfo = {};
    }
    let sn = FieldUtil.checkField(userInfo, 'serialNumber');
    if (!sn) {
      sn = '';
      logger.log('sn', sn);
      return true;
    }
    logger.log('sn', sn);
    let errorObj = this.getCertError(sn);
    if (!!errorObj['isLock'] && errorObj['isLock'] == '1') {
      return true;
    } else {
      return false;
    }
  }


  // --------------------------------------------------------------------------------------------
  //  ____       _            _         _____                 _
  //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
  //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
  //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
  //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
  // --------------------------------------------------------------------------------------------

  /**
   * 儲存憑證錯誤次數
   */
  private saveCertError(sn, save_type: number) {
    let allErrorObj = this._localStorage.getObj(this.certErrorKey);
    if (typeof allErrorObj != 'object' || !allErrorObj) {
      allErrorObj = {};
    }

    if (typeof allErrorObj[sn] != 'object' || !allErrorObj[sn]) {
      allErrorObj[sn] = {
        errorTimes: 0,
        isLock: 0
      };
    }
    let error_times = allErrorObj[sn].errorTimes;
    let is_lock = allErrorObj[sn].isLock;

    logger.log('saveCertErrorTime', error_times);

    // 1. save_type=0 => allErrorObj[sn] = 0;
    // 2. save_type=1 => allErrorObj[sn]++;
    if (save_type === 0) {
      // save_times = 0;
      error_times = 0;
    } else if (save_type === 1) {
      // save_times++;
      error_times++;
    } else {
      is_lock = 1;
    }

    allErrorObj[sn].errorTimes = error_times;
    allErrorObj[sn].isLock = is_lock;

    // allErrorObj[sn] = save_times.toString();
    logger.log('saveCertErrorObj', allErrorObj);
    this._localStorage.setObj(this.certErrorKey, allErrorObj);
  }

  /**
   * 取得憑證錯誤次數
   */
  private getCertError(sn) {
    let allErrorObj = this._localStorage.getObj(this.certErrorKey);
    if (typeof allErrorObj != 'object' || !allErrorObj) {
      allErrorObj = {};
    }

    if (typeof allErrorObj[sn] != 'object' || !allErrorObj[sn]) {
      allErrorObj[sn] = {
        errorTimes: 0,
        isLock: 0
      };
    }
    logger.log('getCertErrorObj', allErrorObj[sn]);
    return allErrorObj[sn];

  }


  /**
   * 憑證重新取得
   * @param res
   * @param custId
   * @param userId
   */
  private regetSetF1000102Data(res: F1000102ResBody, custId: string, userId: string): Promise<any> {
    
    let deviceAllowReget=this._deviceService.checkCertDeviceReget();
    logger.log('deviceAllowReget',this._deviceService.checkCertDeviceReget());
    if (!deviceAllowReget) {
      return Promise.resolve(null);
    }
    let send_device = this._deviceService.getCertDevice(true);
    return this.onDeviceReady.then(
      () => {
        return new Promise((resolve, reject) => {
          plugin.tcbb.setF1000102Data([res, custId, userId, send_device],
            (res_cn) => {
              logger.log('second setF1000102Data',res_cn);
              let output: any = {
                  cn: '',
                  sn: ''
              };
              if (typeof res_cn == 'object' && !!res_cn
                  && typeof res_cn.cn != 'undefined'
                  && !!res_cn.cn
                  && res_cn.cn.indexOf(custId) > -1
              ) {
                  output = res_cn;
                  // 此處要強制重新設定certDeviceId，讓後續更新等功能正常
                  this._deviceService.changeCertDevice(send_device);
                resolve(output);
              } else {
                resolve(output);
              }
            },
            (error) => {
              reject(error);
            });
        });
      }
    );
  }

}
