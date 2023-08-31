import { Injectable } from '@angular/core';
import { TcbbService } from '@lib/plugins/tcbb/tcbb.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { CertService } from '@lib/plugins/tcbb/cert.service';
import { AuthService } from '@core/auth/auth.service';
import { FD000201ApiService } from '@api/fd/fd000201/fd000201-api.service';
import { FD000201ReqBody } from '@api/fd/fd000201/fd000201.req';
import { FD000201Res, FD000201ResBody } from '@api/fd/fd000201/fd000201.res';
import { resolve } from 'url';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HandleErrorOptions } from '@core/handle-error/handlerror-options';
import { InputCertProtectPwdService } from '@shared/popup/input-cert-protect-pwd/input-cert-protect-pwd.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { FD000301ReqBody } from '@api/fd/fd000301/fd000301.req';
import { FD000301ApiService } from '@api/fd/fd000301/fd000301-api.service';
import { logger } from '@shared/util/log-util';

@Injectable()
export class CertificateService {

  constructor(
    private tcbb: TcbbService,
    private alert: AlertService,
    private cert: CertService,
    private auth: AuthService,
    private fd000201: FD000201ApiService,
    private fd000301: FD000301ApiService,
    private navgator: NavgatorService,
    private errorHandle: HandleErrorService,
    private inpit_cert: InputCertProtectPwdService,
    private check_security: CheckSecurityService
  ) {

  }

  async stopCertificate() {
    try {
      let req = {
        custId: this.auth.userInfo.custId,
        certCN: this.auth.userInfo.cn,
      };
      const CA_Object = {
        securityType: '2',
        serviceId: 'FD000301',
        signText: req,
      };

      const protectedKeyPass = await this.check_security.doSecurityNextStep(CA_Object);
      try {
        logger.error('CA_Object', protectedKeyPass);
        const certObj = await this.cert.genCnForFD000301(protectedKeyPass.ca_protective_code);
        this.sendFd000301(certObj, protectedKeyPass.headerObj);
      } catch (certObjError) {
        logger.debug('certObjError', certObjError);
        this.stopCertError('憑證密碼輸入錯誤');
      }
    } catch (errorKey) {
      this.navgator.push('user-home');
    }
  }

  /**
  * 發送FD000301-憑證暫禁
  */
  sendFd000301(certObj: any, headerObj: any): Promise<any> {
    // tslint:disable-next-line: no-shadowed-variable
    return new Promise((resolve, reject) => {
      const form = new FD000301ReqBody();

      let reqHeader = {
        header: headerObj
      };

      let req = {
        custId: this.auth.userInfo.custId,
        certCN: this.auth.userInfo.cn,
      };
      this.fd000301.send(req, reqHeader).then(
        res => {
          this.finalCheckStop(res);
        },
        error => {
          this.errorHandle.handleError(error);
        }
      );
    });
  }

  /**
   * 暫禁憑證
   * @param fd000301res
   */
  async finalCheckStop(fd000301res) {
    try {
      let success = await this.alert.show('憑證暫禁成功!!!提醒您：憑證暫禁後，將無法繼續使用行動網銀服務。若您需要本項服務，請回本行營業單位辦理憑證解禁後即可繼續使用。',
        { title: '憑證暫禁狀態' }).then(
          success_push => {
            this.navgator.push('user-home');
          }
        );
    } catch (error) {
      this.stopCertError();
    }
  }

  stopCertError(msg = '憑證暫禁失敗') {
    this.alert.show(msg);
  }



  /**
   * 憑證更新
   */
  async updateCertificate() {
    try {
      const protectedKeyPass = await this.inpit_cert.show();
      try {
        logger.error('CA_Object', protectedKeyPass);
        const certObj = await this.cert.genCsrForFD000201('', protectedKeyPass);
        this.sendFd000201(certObj, protectedKeyPass);
      } catch (certObjError) {
        logger.debug('certObjError', certObjError);
        this.updateCertError(certObjError.errorMsg);
      }
    } catch (errorKey) {
      this.navgator.push('user-home');
    }
  }


  /**
  * 發送FD000201-憑證更新
  */
  sendFd000201(certObj: any, protectedKeyPass: string): Promise<any> {
    // tslint:disable-next-line: no-shadowed-variable
    return new Promise((resolve, reject) => {
      const form = new FD000201ReqBody();

      let req = {
        custId: this.auth.userInfo.custId,
        certCN: this.auth.userInfo.cn,
        signCSR: certObj.signCSR,
        signSig: certObj.signSig,
        signSN: certObj.signSN,
        encCSR: certObj.encCSR,
        encSig: certObj.encSig,
        encSN: certObj.encSN,
        certAplyPswd: '', // Native給空值
        chgType: certObj.chgType
      };

      const CA_Object = {
        securityType: '2',
        serviceId: 'FD000201',
        signText: req,
      };

      this.check_security.do_generate_header(CA_Object, protectedKeyPass).then(
        (headerObj) => {
          let reqHeader = {
            header: headerObj
          };
          this.fd000201.send(req, reqHeader).then(
            res => {
              this.finalCheckUpdate(res.body);
            },
            error => {
              this.errorHandle.handleError(error);
              this.navgator.push('certificateService');
            }
          );
        });

    });
  }

  /**
   * 更新憑證
   * @param fd000201res 儲存FD000201回傳憑證資料
   */
  async finalCheckUpdate(fd000201res) {
    try {
      const success = await this.cert.updateCert(fd000201res);
      this.alert.show('提醒您：憑證已更新成功，系統將自動註銷原使用之憑證。').then(
        success_push => {
          this.navgator.push('user-set');
        }
      );
    } catch (error) {
      this.updateCertError();
    }
  }

  updateCertError(msg = '憑證更新失敗') {
    this.alert.show(msg);
    this.navgator.push('certificateService');
  }
}
