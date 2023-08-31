import { Injectable } from '@angular/core';
import { CordovaService } from '@base/cordova/cordova.service';
import { environment } from '@environments/environment';
import { FD000201ResBody } from '@api/fd/fd000201/fd000201.res';
import { DeviceService } from '@lib/plugins/device.service';
declare var plugin: any;

@Injectable()
export class CertService extends CordovaService {

  constructor(
    private _deviceService: DeviceService
  ) {
    super();
  }

  /**
   * 初始化資料庫(Android)
   */
  public initTable(): Promise<any> {
    if (!!environment.NATIVE) {
      return this.onDeviceReady.then(
        () => new Promise((resolve, reject) => plugin.cert.createTransposesTable(resolve, reject))
      );
    } else {
      return this.onDeviceReady.then(
        () => new Promise((resolve, reject) => resolve({}))
      );
    }
  }

  /**
   * 取得已下載憑證資訊
   * @readonly certificate_sign
   * @returns {serialNumber,beforeTime,afterTime,keySize,subject}
   */
  public getCertInfo(): Promise<any> {
    let send_device = this._deviceService.getCertDevice(false);
    if (!!environment.NATIVE) {
      return this.onDeviceReady.then(
        () =>
          new Promise((resolve, reject) => plugin.cert.getCertInfo(resolve, reject, [send_device]))
      );
    } else {
      return this.onDeviceReady.then(
        // tslint:disable-next-line:max-line-length
        () => new Promise((resolve, reject) => resolve({ serialNumber: '', beforeTime: '', afterTime: 'afterTime', keySize: 'keySize', subject: 'subject' }))
      );
    }
  }

  /**
   * 確認CSR檔案是否存在
   * @param cnList cnArray
   * @returns {CN:'123456', returnCode:'1'}
   */
  public checkCSR (cnList: any): Promise<any> {
    let cnArray = [];
    let send_device = this._deviceService.getCertDevice(false);
    for (let i in cnList) {
      cnArray.push(cnList[i].CertCN);
    }
    if (!!environment.NATIVE) {
      if (typeof plugin.cert == 'undefined' || typeof plugin.cert.checkCSR != 'function') {
        // 還原舊寫法(當native沒method處理)
        if (cnList.length === 0) {
          return Promise.reject('查無憑證');
        } else {
          return Promise.resolve({ CN: '', returnCode: 0 });
        }
      } else {
        return this.onDeviceReady.then(
          () => new Promise((resolve, reject) => plugin.cert.checkCSR([cnArray, send_device], resolve, reject))
        );
      }
    } else {
      return this.onDeviceReady.then(
        () => new Promise((resolve, reject) => resolve({ CN: 'certCN', returnCode: '0' }))
      );
    }
  }

  /**
   * 產生FD000102憑證下載所需CSR
   * @param CN 憑證
   * @param protectedKeyPass 憑證保護密碼
   * @param applyType 申請憑證的型態 'simple':簡單申請，不重新產生CSR 'complete':完整申請，重新產生CSR
   * @returns {signCSR, encCSR }
   */
  public genCsrForFD000102(CN: string, protectedKeyPass: string, applyType: string): Promise<any> {
    let send_device = this._deviceService.getCertDevice(false);
    if (!!environment.NATIVE) {
      return this.onDeviceReady.then(
        () => new Promise((resolve, reject) => plugin.cert.genFD000102Req([CN, protectedKeyPass, applyType, send_device], resolve, reject))
      );
    } else {
      return this.onDeviceReady.then(
        () => new Promise((resolve, reject) => resolve({ certCN: 'certCN', signCSR: 'signCSR', encCSR: 'encCSR' }))
      );
    }
  }

  /**
   * 儲存FD000102回傳憑證資料
   * @param signCertData 簽章憑證
   * @param encCertData 加密憑證
   * @returns
   */
  public saveCert(signCertData: string, encCertData: string): Promise<any> {
    let send_device = this._deviceService.getCertDevice(false);
    if (!!environment.NATIVE) {
      return this.onDeviceReady.then(
        () => new Promise((resolve, reject) => plugin.cert.setFD000102Res([signCertData, encCertData, send_device], resolve, reject))
      );
    } else {
      return this.onDeviceReady.then(
        () => new Promise((resolve, reject) => resolve({}))
      );
    }
  }

  /**
   * 產生FD000201憑證更新所需CSR
   * @param CN 憑證
   * @param protectedKeyPass 憑證保護密碼
   * @returns {signCSR, signSig, encCSR, encSig, chgType, signSN, encSN}
   */
  public genCsrForFD000201(CN: string, protectedKeyPass: string): Promise<any> {
    let send_device = this._deviceService.getCertDevice(false);
    if (!!environment.NATIVE) {
      return this.onDeviceReady.then(
        () => new Promise((resolve, reject) => plugin.cert.genFD000201Req([CN, protectedKeyPass, send_device], resolve, reject))
      );
    } else {
      return this.onDeviceReady.then(
        // tslint:disable-next-line:max-line-length
        () => new Promise((resolve, reject) => resolve({ signCSR: 'signCSR', signSig: 'signSig', encCSR: 'encCSR', encSig: 'encSig', chgType: 'chgType', signSN: 'signSN', encSN: 'encSN' }))
      );
    }
  }

  /**
   * 更新憑證
   * 儲存FD000201回傳憑證資料
   * @param fd000201res
   * { custId, 身份證號
   * certCN, 憑證CN
   * signCertData, 簽章憑證
   * encCertData 加密憑證
   * } FD000201回傳
   * @returns
   */
  public updateCert(fd000201res: FD000201ResBody): Promise<any> {
    let send_device = this._deviceService.getCertDevice(false);
    if (!!environment.NATIVE) {
      return this.onDeviceReady.then(
        () => new Promise((resolve, reject) => plugin.cert.setFD000201Res([fd000201res, send_device], resolve, reject))
      );
    } else {
      return this.onDeviceReady.then(
        () => new Promise((resolve, reject) => resolve())
      );
    }
  }

  /**
   * 產生FD000301憑證暫禁所需CN
   * @param pwd 憑證保護密碼
   * @returns { CN }
   */
  public genCnForFD000301(pwd:string): Promise<any> {
    let send_device = this._deviceService.getCertDevice(false);
    if (!!environment.NATIVE) {
      return this.onDeviceReady.then(
        () => new Promise((resolve, reject) => plugin.cert.genFD000301Req([pwd, send_device], resolve, reject))
      );
    } else {
      return this.onDeviceReady.then(
        () => new Promise((resolve, reject) => resolve({ CN: 'certCN' }))
      );
    }
  }

  /**
   * 產生FD000401憑證刪除所需CN, SN
   * @returns { CN, SN }
   */
  public genDataForFD000401(): Promise<any> {
    if (!!environment.NATIVE) {
      return this.onDeviceReady.then(
        () => new Promise((resolve, reject) => plugin.cert.genFD000401Req(resolve, reject))
      );
    } else {
      return this.onDeviceReady.then(
        () => new Promise((resolve, reject) => resolve({ CN: 'certCN', SN: 'signCSR' }))
      );
    }
  }

  /**
   * 刪除憑證
   */
  public removeCert(): Promise<any> {
    let send_device = this._deviceService.getCertDevice(false);
    if (!!environment.NATIVE) {
      return this.onDeviceReady.then(
        () => new Promise((resolve, reject) => plugin.cert.setFD000401Res(resolve, reject, [send_device]))
      );
    } else {
      return this.onDeviceReady.then(
        () => new Promise((resolve, reject) => resolve())
      );
    }
  }

   /**
   * 更新憑證密碼
   * @param oldPwd 舊密碼
   * @param newPwd 新密碼
   */
  public updateCertPwd(oldPwd, newPwd): Promise<any> {
    let send_device = this._deviceService.getCertDevice(false);
    if (!!environment.NATIVE) {
      return this.onDeviceReady.then(
        () => new Promise((resolve, reject) => plugin.cert.updateCertPwd([oldPwd, newPwd, send_device], resolve, reject))
      );
    } else {
      return this.onDeviceReady.then(
        () => new Promise((resolve, reject) => resolve())
      );
    }
  }
}
