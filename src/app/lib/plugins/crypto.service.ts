import { Injectable } from '@angular/core';
import { CordovaService } from '@base/cordova/cordova.service';
declare var plugin: any;

@Injectable()
export class CryptoService extends CordovaService {



  public InitPhoneData(deviceInfo): Promise<any> {
    return this.onDeviceReady
      .then(() => new Promise((resolve, reject) => plugin.crypto.InitPhoneData(deviceInfo, resolve, reject)));
  }

  public GetServerToken(): Promise<any> {
    return this.onDeviceReady
      .then(() => new Promise((resolve, reject) => plugin.crypto.GetServerToken(resolve, reject)));
  }

  public GenerateSessionID(): Promise<any> {
    return this.onDeviceReady
      .then(() => new Promise((resolve, reject) => plugin.crypto.GenerateSessionID(resolve, reject)));
  }

  public Handshake(obj): Promise<any> {
    return this.onDeviceReady
      .then(() => new Promise((resolve, reject) => plugin.crypto.Handshake(obj, resolve, reject)));
  }

  public ExchangeKey(PublicKey): Promise<any> {
    return this.onDeviceReady
      .then(() => new Promise((resolve, reject) => plugin.crypto.ExchangeKey(PublicKey, resolve, reject)));
  }

  public ExchangeKeyEx(): Promise<any> {
    return this.onDeviceReady
      .then(() => new Promise((resolve, reject) => plugin.crypto.ExchangeKeyEx(resolve, reject)));
  }

  public RSA_Encrypt(pubkey, text): Promise<any> {
    return this.onDeviceReady
      .then(() => new Promise((resolve, reject) => plugin.crypto.RSA_Encrypt(pubkey, text, resolve, reject)));
  }

  public RSA_EncryptEx(text): Promise<any> {
    return this.onDeviceReady
      .then(() => new Promise((resolve, reject) => plugin.crypto.RSA_EncryptEx(text, resolve, reject)));
  }

  public MD5(text): Promise<any> {
    return this.onDeviceReady
      .then(() => new Promise((resolve, reject) => plugin.crypto.MD5(text, resolve, reject)));
  }

  public SHA1(text): Promise<any> {
    return this.onDeviceReady
      .then(() => new Promise((resolve, reject) => plugin.crypto.SHA1(text, resolve, reject)));
  }

  public SHA256(text): Promise<any> {
    return this.onDeviceReady
      .then(() => new Promise((resolve, reject) => plugin.crypto.SHA256(text, resolve, reject)));
  }

  public AES_Encrypt(keyLabel, text): Promise<any> {
    return this.onDeviceReady
      .then(() => new Promise((resolve, reject) => plugin.crypto.AES_Encrypt(keyLabel, text, resolve, reject)));
  }

  public AES_Decrypt(keyLabel, text): Promise<any> {
    return this.onDeviceReady
      .then(() => new Promise((resolve, reject) => plugin.crypto.AES_Decrypt(keyLabel, text, resolve, reject)));
  }

  public SaveDecryptedFile(version, src, dist): Promise<any> {
    return this.onDeviceReady
      .then(() => new Promise((resolve, reject) => plugin.crypto.SaveDecryptedFile(version, src, dist, resolve, reject)));
  }

  public Base64Encode(text): Promise<any> {
    return this.onDeviceReady
      .then(() => new Promise((resolve, reject) => plugin.crypto.Base64Encode(text, resolve, reject)));
  }

  public Base64Decode(base64Text): Promise<any> {
    return this.onDeviceReady
      .then(() => new Promise((resolve, reject) => plugin.crypto.Base64Decode(base64Text, resolve, reject)));
  }

}
