import { Injectable } from '@angular/core';

import { DeviceService } from '@lib/plugins/device.service';
import { CryptoService } from '@lib/plugins/crypto.service';

import { RegisterApiService } from '@api/handshake/register/register-api.service';
import { HandshakeApiService } from '@api/handshake/handshake/handshake-api.service';
import { ExchangekeyApiService } from '@api/handshake/exchangekey/exchangekey-api.service';
import { CommonApiService } from '@api/handshake/common/common-api.service';
import { ReqHeader } from '@base/api/model/req-header';
import { logger } from '@shared/util/log-util';
import { SessionStorageService } from '@lib/storage/session-storage.service';
import { NetworkInfoService } from '@lib/plugins/network-info.service';
import { HandleErrorOptions } from '@core/handle-error/handlerror-options';
import { HandshakeTelegramService } from './handshake-telegram.service';
import { FieldUtil } from '@shared/util/formate/modify/field-util';
import { HTTP_SERVER_STOP_LIST, HTTP_SERVER_TIMEOUT_LIST } from '@conf/http-status';

@Injectable()
export class HandshakeService {
  reqUrl: string;
  isNeedHandshake: boolean;  // 判斷是否需要handshake
  isNeedHandshakeLock: boolean;  // 判斷是否已在執行handshake
  retry: number;
  constructor(
    private network: NetworkInfoService,
    private deviceInfo: DeviceService,
    private crypto: CryptoService,
    private session: SessionStorageService,
    private registerApi: RegisterApiService,
    private handshakeApi: HandshakeApiService,
    private handshakeTelegram: HandshakeTelegramService<any>,
    private exchangekeyApi: ExchangekeyApiService,
    private commandApi: CommonApiService,
  ) {
    this.reqUrl = '';

    const temp_hitrust_auth = sessionStorage.temp_hitrust_auth;
    const temp_auth_token = sessionStorage.temp_auth_token;
    this.isNeedHandshake = (!temp_hitrust_auth || !temp_auth_token);
    this.isNeedHandshakeLock = false;
    this.retry = 0;
  }

  /**
   * 設定需要重新handshake
   */
  reset() {
    delete sessionStorage.temp_hitrust_auth;
    delete sessionStorage.temp_auth_token;
    this.isNeedHandshake = true;
    this.isNeedHandshakeLock = false;
    this.handshakeTelegram.reset();
  }



  /**
   * Handshake 獨佔
   * @param serviceId
   */
  waitHandshake(serviceId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.isNeedHandshake) {
        resolve(false);
      } else if (this.isNeedHandshake && !this.isNeedHandshakeLock) {
        logger.debug('waitHandshake start lock', serviceId);
        this.isNeedHandshakeLock = true;
        resolve(true);
      } else {
        logger.debug('waitHandshake start wait', serviceId);
        let listenEvent = setInterval(() => {
          if (!this.isNeedHandshake && !this.isNeedHandshakeLock) {
            logger.debug('waitHandshake end wait', serviceId);
            clearInterval(listenEvent);
            resolve(false);
          } else if (this.isNeedHandshake && !this.isNeedHandshakeLock) {
            logger.debug('waitHandshake start stop', serviceId);
            reject(false);
          } else {
            // logger.debug('waitHandshake still wait', serviceId);
          }
        }, 1000);
      }
    });
  }


  /**
   * 提供透過點對點加密發送介面
   * @param serviceId 電文代號
   * @param body 電文內容
   */
  send(serviceId: string, body: Object = {}, header?: ReqHeader): Promise<any> {
    return this.waitHandshake(serviceId)
    .then((needDoFlag) => {
      if (needDoFlag) {
        // return this.checkNetwork().then(() => this.handshake())
        return this.handshake()
          .then(() => {
            this.isNeedHandshakeLock = false;
            return Promise.resolve();
          })
          .then(() => this.post(serviceId, body, header))
          .catch(err => {
            this.isNeedHandshakeLock = false;
            return this.checkNetwork().then(() => {
              return Promise.reject(err);
            });
          });
      } else {
        return this.checkNetwork().then(() => this.post(serviceId, body, header));
      }
    },
    () => {
      // stop waitHandshake
      logger.debug('waitHandshake wait error', serviceId);
      return this.checkNetwork().then((err) => {
        return Promise.reject(err);
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
   * 發送AJAX請求
   * @param apiUrl API名稱
   * @param data 上傳資料
   */
  public post(serviceId: string, body: Object = {}, header?: ReqHeader): Promise<any> {

    return this.commandApi.apiSend(serviceId.toLowerCase(), body, header).then(res => {
      this.retry = 0;
      logger.debug('HandshakeService ' + serviceId + ' res:' + JSON.stringify(res));
      return res;
    }).catch(err => {
      if (err.ok === false && (err.result === 500 || err.status === 500)) {
        return Promise.reject(new HandleErrorOptions('ERROR.SERVER_EXCEPTION', 'ERROR.TITLE'));
      } else if (err.result === -401 || err.status === -401) {
        this.reset();
        return this.send(serviceId, body, header);
      } else if (this.retry < 3 && typeof err.error === 'number') {
        this.retry++;
        logger.error('retry:', serviceId);
        logger.error(JSON.stringify(err));
        this.reset();
        return this.send(serviceId, body, header);
      }
      this.retry = 0;
      return Promise.reject(err);
    });

  }

  public handshake(): Promise<any> {
    // device
    const started = Date.now();
    logger.debug('==============start==============:' + started);
    /**
     * 1.取得裝置資訊
     */
    logger.debug('1.start:');
    return this.deviceInfo.devicesInfo()
      /**
        * 2.初始化裝置資訊
        */
      .then((devicesInfo) => {
        devicesInfo.uuid = devicesInfo.udid;
        devicesInfo.appinfo.version = devicesInfo.appinfo.version + '.' + devicesInfo.appinfo.subVersion;
        logger.debug('2.devicesInfo:' + JSON.stringify(devicesInfo));
        return this.crypto.InitPhoneData(devicesInfo)
          .catch((err) => {
            // logger.error(err);
            let error = new HandleErrorOptions('裝置資訊初始化失敗');
            error.resultCode = err.error;
            error.resultData = err;
            return Promise.reject(error);
          });
      }
      )
      /**
        * 3.取得裝置資訊for register電文
        */
      .then((InitPhoneRes) => {
        logger.debug('3.InitPhoneRes:' + JSON.stringify(InitPhoneRes));
        if (!!InitPhoneRes) {
          return this.deviceInfo.devicesInfoForRegister()
          .catch((err) => {
            logger.error(err);
            let error = new HandleErrorOptions('裝置資訊取得失敗');
            error.resultCode = err.error;
            error.resultData = err;
            return Promise.reject(error);
          });
        } else {
          // TODO 異常處理
          logger.error('TODO 異常處理:InitPhoneRes is null');
          let error = new HandleErrorOptions('裝置資訊初始化取得失敗');
          error.resultCode = '';
          error.resultData = InitPhoneRes;
          return Promise.reject(error);
        }
      }
      )
      /**
        * 4.上傳裝置資訊,建立行動裝置session
        * success:回傳challenge(para1,para2)
        */
      .then((devicesInfoForRegister) => {
        logger.debug('4.deviceinfo:' + JSON.stringify(devicesInfoForRegister));
        // regist
        return this.registerApi.send('Register', devicesInfoForRegister)
        .catch((err) => {
          logger.error('registerApi error');
          let error = new HandleErrorOptions('目前無法與伺服器取得連線，請稍後再試！如造成您的困擾，敬請見諒。若有其他疑問，請聯繫客服中心。(ERR_401)');
          error.resultCode = 'ERR_401';
          error.resultData = err;
          return Promise.reject(error);
        });
      }
      )
      /**
        * 5.產生a.由challenge(para1,para2)產生的驗證資料
        *      b.特徵值(para3)  android only
        */
      .then((RegisterRes) => {
        // logger.debug('5.RegisterRes :'+RegisterRes);
        logger.debug('5.RegisterRes :' + JSON.stringify(RegisterRes));
        if (RegisterRes.result === 0) {
          return this.crypto.Handshake(RegisterRes.data)
          .catch((err) => {
            logger.error('registerApi error');
            let error = new HandleErrorOptions('目前無法與伺服器取得連線，請稍後再試！如造成您的困擾，敬請見諒。若有其他疑問，請聯繫客服中心。(ERR_502)');
            error.resultCode = 'ERR_502';
            error.resultData = err;
            return Promise.reject(error);
          });
        } else {
          let error_code = (!!RegisterRes.result) ? RegisterRes.result : 'ERR_501';
          let error = new HandleErrorOptions('目前無法與伺服器取得連線，請稍後再試！如造成您的困擾，敬請見諒。若有其他疑問，請聯繫客服中心。' + error_code);
          error.resultCode = error_code;
          logger.error('handshake error', error);
          return Promise.reject(error);
        }
      }
      )
      /**
        * 6.上傳驗證資料與特徵值(para3)
        *   success:回傳公鑰 public key
        */
      .then((CryptoHandshakeRes) => {
        // logger.debug('6.CryptoHandshakeRes 1:'+CryptoHandshakeRes);
        logger.debug('6.CryptoHandshakeRes 2:' + JSON.stringify(CryptoHandshakeRes));
        let sendObj = JSON.parse(CryptoHandshakeRes.value);
        // logger.debug('6.CryptoHandshakeRes 3:'+JSON.stringify(sendObj) );
        return this.handshakeApi.send('Handshake', sendObj)
        .catch((err) => {
          logger.error('registerApi error');
          let error = new HandleErrorOptions('目前無法與伺服器取得連線，請稍後再試！如造成您的困擾，敬請見諒。若有其他疑問，請聯繫客服中心。(ERR_601)');
          error.resultCode = 'ERR_601';
          error.resultData = err;
          return Promise.reject(error);
        });
      }
      )
      /**
        * 7.以公鑰產生session key
        */
      .then((HandshakeRes) => {
        // logger.debug('7.HandshakeRes :'+HandshakeRes);
        logger.debug('7.HandshakeRes :' + JSON.stringify(HandshakeRes));
        if (HandshakeRes.result == 0) {
          return this.crypto.ExchangeKey(HandshakeRes.data.para_key);
        } else {
          let error_code = (!!HandshakeRes.result) ? HandshakeRes.result : 'ERR_701';
          let error = new HandleErrorOptions('目前無法與伺服器取得連線，請稍後再試！如造成您的困擾，敬請見諒。若有其他疑問，請聯繫客服中心。' + error_code);
          error.resultCode = error_code;
          error.resultData = HandshakeRes;
          logger.error('handshake error', error);
          return Promise.reject(error);
        }
      }
      )
      /**
        * 8.上傳session key
        *   success:回傳版本資訊
        */
      .then((ExchangeKeyRes) => {
        // logger.debug('8.ExchangeKeyRes 1:'+ExchangeKeyRes);
        logger.debug('8.ExchangeKeyRes 2:' + JSON.stringify(ExchangeKeyRes));
        let sendObjx = {};
        sendObjx['para1'] = ExchangeKeyRes.value;
        let sendObj = JSON.parse(JSON.stringify(sendObjx));
        // logger.debug('8.ExchangeKeyRes 3:'+JSON.stringify(sendObj) );
        return this.exchangekeyApi.send('Exchangekey', sendObj);
      }
      )
      /**
        * 9.版本資訊 decrypt
        */
      .then((ExchangeKeyRes) => {
        // {"error":"OK","data":"Pd0uxlEgTU3XBksXnzFw7IlbWY62VsZEXQKl/0TXveBTUlyJN9oCBpopAqD+Gyuw","result":0}
        // logger.debug('9.ExchangeKeyRes :'+ExchangeKeyRes);
        logger.debug('9.ExchangeKeyRes :' + JSON.stringify(ExchangeKeyRes));
        if (ExchangeKeyRes.data !== undefined) {
          // logger.debug("9.ExchangeKeyRes.data != undefined");
          return this.crypto.AES_Decrypt('session', ExchangeKeyRes.data).then(val => {
            let output: any = {
              'AES_Decrypt': val, 'ExchangeKeyRes': ExchangeKeyRes
            };
            return Promise.resolve(output);
            // return { 'AES_Decrypt': val, 'ExchangeKeyRes': ExchangeKeyRes };
          });
        } else {
          let error_code = (!!ExchangeKeyRes.result) ? ExchangeKeyRes.result : 'ERR_901';
          let error = new HandleErrorOptions('目前無法與伺服器取得連線，請稍後再試！如造成您的困擾，敬請見諒。若有其他疑問，請聯繫客服中心。' + error_code);
          error.resultCode = ExchangeKeyRes.result;
          error.resultData = ExchangeKeyRes;
          logger.error('handshake error', error);
          return Promise.reject(error);
        }
      }
      )
      /**
        * 10.handshake作業完成
        */
      .then((ExchangekeyAES_Decrypt) => {
        // logger.debug('10.FinishRes :'+ExchangekeyAES_Decrypt);
        logger.debug('10.FinishRes :' , JSON.stringify(ExchangekeyAES_Decrypt));
        // 儲存handshake第三道電文結果到session
        this.session.set('directUpdateInformation', ExchangekeyAES_Decrypt.AES_Decrypt.value);
        let FinalRes = ExchangekeyAES_Decrypt.ExchangeKeyRes;
        FinalRes.data = JSON.parse(ExchangekeyAES_Decrypt.AES_Decrypt.value);
        // logger.debug("10.FinalRes:"+JSON.stringify(FinalRes));
        const ended = Date.now();
        const elapsed = ended - started;
        this.isNeedHandshake = false;
        sessionStorage.temp_hitrust_auth = this.handshakeTelegram.temp_hitrust_auth;
        sessionStorage.temp_auth_token = this.handshakeTelegram.temp_auth_token;
        logger.debug('==============finish==============:' + ended + ' ,cost:' + elapsed + 'ms');
        return Promise.resolve(FinalRes);
      }
      )
      .catch(err => {
        // TODO 異常處理
        // 回覆錯誤訊息
        let error_data = this.modifyError(err);
        // 清除handshake header
        this.reset();
        return Promise.reject(error_data);
      });
  }

  /**
   * 錯誤處理
   * @param err
   */
  private modifyError(err: any) {
    logger.error('handshake err:', err);
    logger.error(JSON.stringify(err));
    // console.log('is handle error', err);

    let output: HandleErrorOptions;
    if (typeof err == 'object' && (err instanceof HandleErrorOptions)) {
      output = err;
    } else {
      output = new HandleErrorOptions('目前無法與伺服器取得連線，請稍後再試！如造成您的困擾，敬請見諒。若有其他疑問，請聯繫客服中心。');
      output.resultData = err;
      // error.resultCode = err.error;
    }

    // server error
    if (typeof output.resultData != 'undefined') {
      let er_status = FieldUtil.checkField(output.resultData, 'status');
      let er_name = FieldUtil.checkField(output.resultData, 'name');
      if (er_name == 'HttpErrorResponse') {
        let error_list = HTTP_SERVER_STOP_LIST;
        let timeout_error_list = HTTP_SERVER_TIMEOUT_LIST;
        let error_code = er_status.toString();
        if (error_list.indexOf(error_code) > -1 ) {
          // 親愛的客戶您好，目前系統維護中，請稍後再試。造成您的不便，敬請見諒。
          output = new HandleErrorOptions('目前無法與伺服器取得連線，請稍後再試！如造成您的困擾，敬請見諒。若有其他疑問，請聯繫客服中心。(ERM003)');
          output.resultCode = error_code;
          output.resultData = err.resultData;
        } else if (timeout_error_list.indexOf(error_code) > -1 ) {
          output = new HandleErrorOptions('ERROR.CONNECTION_TIMEOUT', 'ERROR.TITLE');
          output.resultCode = error_code;
          output.resultData = err.resultData;
        } else {
          // output = new HandleErrorOptions('目前無法與伺服器取得連線，請稍後再試！如造成您的困擾，敬請見諒。若有其他疑問，請聯繫客服中心。(' + er_status + ')');
          output = new HandleErrorOptions('目前無法與伺服器取得連線，請稍後再試！如造成您的困擾，敬請見諒。若有其他疑問，請聯繫客服中心。');
          output.resultCode = er_status;
          output.resultData = err.resultData;
        }
      } else if (er_name == 'TimeoutError') {
        output = new HandleErrorOptions('ERROR.CONNECTION_TIMEOUT', 'ERROR.TITLE');
        output.resultCode = er_status;
        output.resultData = err.resultData;
      }
    }

    logger.error('handshake err output:', output);
    return output;
  }

}
