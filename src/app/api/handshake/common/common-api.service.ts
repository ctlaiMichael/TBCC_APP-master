import { Injectable } from '@angular/core';
import { CommonReqBody } from './common-req';
import { CommonResBody } from './common-res';
import { HandshakeTelegramService } from '@core/telegram/handshake-telegram.service';
import { HandshakeApiBase } from '@base/api/handshake-api-base.class';
import { JsonConvertUtil } from '@shared/util/json-convert-util';
import { DeviceService } from '@lib/plugins/device.service';
import { CryptoService } from '@lib/plugins/crypto.service';
import { ReqHeader } from '@base/api/model/req-header';
import { FormateService } from '@shared/formate/formate.service';
import { ObjectUtil } from '@shared/util/formate/modify/object-util';
import { logger } from '@shared/util/log-util';
import { LocalStorageService } from '@lib/storage/local-storage.service';

@Injectable()
export class CommonApiService extends HandshakeApiBase<CommonReqBody, CommonResBody> {
  devicesInfo = {};

  constructor(
    public telegram: HandshakeTelegramService<CommonResBody>,
    private deviceInfo: DeviceService,
    private crypto: CryptoService,
    private formateService: FormateService,
    private localStorage: LocalStorageService,
  ) {
    super(telegram);
  }


  private combineEncrypt = function (str1, str2) {
    let str_data;
    const set_len = 46;

    str_data = str2.substr(set_len) + str1 + str2.substr(0, set_len);
    return str_data;
  };


  apiSend(serviceId: string, reqBody: any, header?: ReqHeader): Promise<any> {

    return this.deviceInfo.devicesInfo()
      .then((devicesInfo) => {
        this.devicesInfo = ObjectUtil.clone(devicesInfo);
        this.devicesInfo['serviceId'] = serviceId;
        logger.debug('devicesInfo:' + JSON.stringify(this.devicesInfo));
        let headerobj = JsonConvertUtil.setTelegramHeader(this.devicesInfo);
        logger.debug('headerobj:' + JSON.stringify(headerobj));
        headerobj = { ...headerobj, ...header };
        const jsonObj = JsonConvertUtil.converToXmlJson(serviceId, reqBody, headerobj);
        logger.debug('jsonObj:' + JSON.stringify(jsonObj));
        const jsonStr = (typeof jsonObj === 'object') ? JSON.stringify(jsonObj) : '';
        logger.debug('jsonStr:' + jsonStr);
        logger.step('Telegram', 'apiSend start', this.formateService.transClone(jsonStr));
        return this.crypto.AES_Encrypt('session', jsonStr);
      }
      )
      .then((encryptStr) => {
        // logger.debug('encryptStr res1:' + JSON.stringify(encryptStr));
        return this.crypto.SHA256(encryptStr.value).then((hashObj) => {
          return { 'hashObj': hashObj, 'encryptStr': encryptStr };
        });
      }
      )
      .then((SHA256Res) => {
        // logger.debug('SHA256Res res2:' + JSON.stringify(SHA256Res));
        return this.crypto.AES_Encrypt('session', SHA256Res.hashObj.value).then((hashEncrypt) => {
          return { 'hashEncrypt': hashEncrypt, 'SHA256Res': SHA256Res };
        });
      }
      )
      .then((AES_EncryptRes) => {
        // logger.debug('AES_EncryptRes res3:' + JSON.stringify(AES_EncryptRes));
        const tempBody = this.combineEncrypt(AES_EncryptRes.SHA256Res.encryptStr.value, AES_EncryptRes.hashEncrypt.value);
        // logger.debug("resultData :"+resultData);
        // logger.debug('CommonApiService reqUrl2:' + serviceId);
        // logger.debug('CommonApiService body2:' + this.tempBody);

        const ReFromatBody = { form: tempBody };
        // logger.debug('ReFromatBody:' + JSON.stringify(ReFromatBody));
        return this.send(serviceId, ReFromatBody).then(res => {
          // logger.debug('common api send res:' + JSON.stringify(res));
          // return callback wait process...
          const now = Date.now();
          this.localStorage.setObj('telegramResTime', now);
          return res;
        });
      }
      )
      .then((success) => {
        // logger.debug('success res:', success);
        logger.step('Telegram', 'apiSend end', this.formateService.transClone(success));
        if (!!success.data) {
          return this.crypto.AES_Decrypt('session', success.data);
        } else {
          return Promise.reject(success);
        }
      });



  }

}
