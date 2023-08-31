import { Injectable } from '@angular/core';
import { CordovaService } from '@base/cordova/cordova.service';
import { environment } from 'environments/environment';
import { XML2JSService } from '@lib/xml2js/xml2js.service';
import { ObjectUtil } from '@shared/util/formate/modify/object-util';
import { logger } from '@shared/util/log-util';
import { HandleErrorOptions } from '@core/handle-error/handlerror-options';
import { SessionStorageService } from '@lib/storage/session-storage.service';
import { Logger } from '@core/system/logger/logger.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
declare var device: any;
declare var cordova: any;
declare var plugin: any;

@Injectable()
export class DeviceService extends CordovaService {

  constructor(
    private xml2js: XML2JSService,
    private session: SessionStorageService,
    private _logger: Logger,
    private localStorage: LocalStorageService
  ) {
    super();
  }

  private snStr = "SNO"; // ht device 第一位資訊(避免android 8 > 10 消失)

  public initUdid(): Promise<any> {
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => {
          let ht_udid = device.uuid;
          return this.getMobileNo()
            .catch(error => {
              logger.error('由於您未允許系統存取電話權限，故無法提供您完整的服務，請於裝置中自行調整權限:', error);
              return Promise.resolve(ht_udid);
              // 取不到強制使用網威udid
              // const err = new HandleErrorOptions('由於您未允許系統存取電話權限，故無法提供您完整的服務，請於裝置中自行調整權限', 'ERROR.TITLE');
              // return Promise.reject(err);
            });
        })
        .then((mobileNo) => {
          return new Promise((resolve, reject) => {
            if (typeof device.udid != 'undefined' || !device.platform || device.platform != "Android") {
              // 不是android跳過、非啟動流程跳過
              resolve(mobileNo);
              return false;
            }
            logger.log('initUdid android',device.udid);
            let is_not_first = this.localStorage.get('first_use');
            if (!is_not_first) {
              // 首次安裝不會有舊憑證
              device.certDeviceAllowReget = false;
              resolve(mobileNo);
              return false;
            }
          
            // 非首次安裝啟動!!
            let certDeviceAllowReget = false;
            let tmp = device.uuid.split('-');
            logger.log('not first install',tmp);
            if (typeof tmp[0] != 'undefined' && tmp[0] == "UNKNOWN") {
              certDeviceAllowReget = true;
            } else {
              this.setSnoToLocalstorage(tmp[0]);
            }
            device.certDeviceAllowReget = certDeviceAllowReget;
            if (!device.certDeviceAllowReget) { //非第一次且ㄋsdk 27
              resolve(mobileNo);
              return false;
            }
            // sdk 28 unknow 往下走 
            let ht_now_uuid = device.uuid;
            // retry 用28新方法抓看是否有舊憑證
            
            let afterRevertMobileNo=this.regetUUID(ht_now_uuid, false).then(
              (pre_uuid) => {
                // 非unknow udid = pre_uuid
                logger.log('ht_now_uuid',ht_now_uuid);
                if (pre_uuid != ht_now_uuid) { 
                  // 取得非unknow udid 將device.preUuid＝非unknow
                  logger.log('device.preUuid!=ht_now_uuid',pre_uuid);
                  device.preUuid = pre_uuid;
                }
                 // 讓native hitrust device id還原 device=> unknow 
                return this.regetUUID(ht_now_uuid, true).then(
                  ()=>{
                    logger.log('test what is mobileNo',mobileNo);
                    resolve(mobileNo); // final
                  }
                );
              }
            );
            resolve(afterRevertMobileNo);
          });
        })
        .then((mobileNo) => {
          if ((!mobileNo || mobileNo == '') && device.uuid != '') {
            // 當mobileNo為空，強制換
            mobileNo = device.uuid;
          }
          // 處理重執行index.html時，請求API和發送電文同時進行的衝突

          if (typeof device.udid == 'undefined') {
            device.udid = device.uuid; // hitrust uuid: 使用無卡提款、圖形鎖、challenge response
            device.mobileNo = mobileNo;
            device.uuid = mobileNo; // api request header: OTP、生物辨識
            device.certDeviceId = device.udid; // 取憑證要使用的uuid
            device.defaultUdid = device.uuid; // 最原本的hitust uuid
            if (typeof device.certDeviceAllowReget == 'undefined') {
              device.certDeviceAllowReget = false;
            }
            if (typeof device.preUuid == 'undefined') {
              device.preUuid = '';
              device.certDeviceAllowReget = false; // 無其他uuid就不用再取得了
            }

          }
          return Promise.resolve();
        });
    } else {
      return Promise.resolve();
    }
  }

  public devicesInfo(): Promise<any> {
    if (environment.NATIVE) {
      return this.onDeviceReady
        .then(() => {
          // 處理重執行index.html時，請求API和發送電文同時進行的衝突
          if (this.session.get('init') === 'Y'
            && (typeof device == 'undefined' || typeof device.udid == 'undefined')
          ) {
            // 啟動過程不可執行 否則會異常
            return this.initUdid();
          } else {
            return Promise.resolve();
          }
        })
        .then(() => this.getSubVersion())
        .then((subVersion) => new Promise((resolve, reject) => {
          device.appinfo.subVersion = subVersion;
          // 改抓三竹的UUID 轉致後須修改回來
          // this.getMobileNo().then(
          //   (S) => {
          //     device.uuid = S;
          //   }
          // );
          resolve(ObjectUtil.clone(device));
        }));
    } else {
      return this.getSubVersion()
        .then((subVersion) => {
          return new Promise((resolve, reject) => {
            resolve({
              'udid': 'test-1234-1234',
              'appuid': 'device.appinfo.identifier',
              'model': 'device.model',
              'platform': 'android',
              'osversion': '9.8.7',
              'appversion': '3.17',
              'appinfo': { 'version': '3.17.0604', 'subVersion': subVersion },
              'name': 'simulation',
              'manufacturer': 'device.manufacturer',
              'hack': false,
              'pushon': true,
              'tokenid': '123',
              uuid: 'test-1234-1234',
              mobileNo: 'test-1234-1234',
              defaultUdid: 'test-1234-1234',
              certDeviceId: 'test-1234-1234',
              certDeviceAllowReget: false
            });
          });
        });
    }
  }

  // handshark 註冊使用請勿隨意調整欄位
  public devicesInfoForRegister(): Promise<any> {
    return this.onDeviceReady
      .then(() => new Promise((resolve, reject) => {
        // logger.debug('Hitrust DeviceInfo0', device);
        // 重整版號
        // this.reOrgVersion();
        // this.getMobileNo().then(
        //   (S) => {
        //     device.uuid = S;
        //   }
        // );
        const form = {
          'udid': device.udid,
          'appuid': device.appinfo.identifier,
          'model': device.model,
          'platform': device.platform,
          'osversion': device.version,
          'appversion': device.appinfo.version + '.' + device.appinfo.subVersion,
          'name': device.hostname,
          'manufacturer': device.manufacturer,
          'hack': false,
          'pushon': true,
          'tokenid': '123'
        };
        resolve(form);
        // logger.debug('devicesInfoForRegister form0:' + JSON.stringify(form));
        // let subVersion = '';
        // const aboutXml = './assets/about.xml';
        // this.xml2js.getXmlFile(aboutXml).then((resultJson: any) => {
        //   // logger.debug('xml2js data:' + JSON.stringify(resultJson));
        //   subVersion = '.' + resultJson.About.Release;
        //   form.appversion = device.appinfo.version + subVersion;
        //   // logger.debug('devicesInfoForRegister form1:' + JSON.stringify(form));
        //   resolve(form);
        // });
      }));
  }

  /**
   * 取得子版號
   */
  public getSubVersion(): Promise<string> {
    const aboutXml = './resource/about.xml';
    return this.xml2js.getXmlFile(aboutXml)
      .then((resultJson) => {
        return resultJson.About.Release[0];
      });
  }

  public getCordovaFileApplicationDirectory() {
    if (environment.NATIVE) {
      logger.debug('getCordovaFileApplicationDirectory:' + cordova.file.applicationDirectory);
      return cordova.file.applicationDirectory;
    } else {
      return '.';
    }
  }

  /**
   * 判斷是否重做憑證device id
   */
  public checkCertDeviceReget() {
    if (!environment.NATIVE) {
      return false;
    }
    return (!!device.certDeviceAllowReget) ? true : false;
  }

  /**
   * 更改憑證device Udid
   * 不考慮一台多人登入多隻憑證狀況，此流程僅針對於憑證消失期間，重辦之用戶
   */
  public changeCertDevice(send_device) {
    if (!environment.NATIVE) {
      return false;
    }
    if (typeof device.certDeviceId != 'undefined' && !!device.certDeviceAllowReget) {
      logger.log('set device.certDeviceId',device.certDeviceId);
      device.certDeviceId = send_device;
    }
  }

  /**
   * 取得device Udid
   * @param reget [boolean] 是否更換certDeviceId進行確認
   */
  public getCertDevice(reget?: boolean) {
    let device_id = '';
    if (!environment.NATIVE) {
      device_id = 'test-1234-1234';
      return device_id;
    }
    logger.log('getCertDevice certDeviceId',device.certDeviceId);
    if (typeof device.certDeviceId != 'undefined') {
      device_id = device.certDeviceId;
      if (reget && !!device.certDeviceAllowReget) {
        // 特殊情況尋找可能的device
         
        if (device.preUuid != '' && device_id != device.preUuid) {
          device_id = device.preUuid;
        } else if (device_id != device.defaultUdid) {
          // 此狀況避免同一裝置多人使用時轉換處理...
          device_id = device.defaultUdid;
        }
      }
    }

    if (typeof device_id != 'string') {
      device_id = '';
    }
    return device_id;
  }




  /**
   * 重新取得hitrust uuid
   * @param set_old
   */
  private regetUUID(defaultUdid, set_old?: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!device.platform || device.platform != "Android"
        || typeof device.getNewUUID != 'function'
      ) {
        resolve(defaultUdid);
        return true;
      }

      let successMethod = (resObj) => {
        if (!!resObj && (typeof resObj == 'string' || typeof resObj == 'number')) {
          let tmp = resObj.toString().split('-');
          this.setSnoToLocalstorage(tmp[0]);
        }
        resolve(resObj);
      };

      let errorMethod = (err) => {
        logger.error('errorMethod', err);
        resolve(defaultUdid);
      };


      if (environment.NATIVE) {
        if (set_old) {
          // 取unknow的 舊方法
          device.getNewUUID(successMethod, errorMethod, 0);
        } else {
          // 新方法 android 9 adk 28 可抓到非unknow
          device.getNewUUID(successMethod, errorMethod, 1);
        }
      } else {
        if (set_old) {
          // 取unknow的
          successMethod('UNKNOW-1234-1234');
        } else {
          successMethod('test-1234-1234');
        }
      }
    });
  }


  private getMobileNo(): Promise<any> {
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

  private setSnoToLocalstorage(val: string) {
    let check = val.toLocaleUpperCase();
    if (check == "UNKNOWN") {
      return false;
    }
    let sno = this.localStorage.get(this.snStr);
    if (!sno || sno == "UNKNOWN") {
      this.localStorage.set(this.snStr, val);
    }
  }
}
