import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { InputCertProtectPwdService } from '@shared/popup/input-cert-protect-pwd/input-cert-protect-pwd.service';
import { FD000203ApiService } from '@api/fd/fd000203/fd000203-api.service';
import { FD000203ReqBody } from '@api/fd/fd000203/fd000203.req';
import { FD000203Res, FD000203ResBody } from '@api/fd/fd000203/fd000203.res';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { logger } from '@shared/util/log-util';
@Component({
  selector: 'app-certificate-confirm',
  templateUrl: './certificate-confirm.component.html',
  styleUrls: ['./certificate-confirm.component.css']
})
export class CertificateConfirmComponent implements OnInit {

  constructor(
    private navgator: NavgatorService,
    private inpit_cert: InputCertProtectPwdService,
    private fd000203: FD000203ApiService,
    private auth: AuthService,
    private handleError: HandleErrorService,
    private headerCtrl: HeaderCtrlService,
    private check_security: CheckSecurityService
  ) {
    this.headerCtrl.setLeftBtnClick(() => {
      this.backTo();
    });
  }

  dataInput: any;

  ngOnInit() {
    this.dataInput = this.navgator.getParams();
    logger.debug('this.dataInput', this.dataInput);
  }

  backTo() {
    this.navgator.popTo('certificateService');
  }

  async paymentCertigicate() {
    try {
      // const form = new FD000203ReqBody();
      // form.custId = this.auth.userInfo.custId;
      // form.debitAcnt = this.dataInput.dataOutAccount;
      // form.caPaymentAmount = this.dataInput.caPaymentAmount;
      // form.trnsToken = this.dataInput.trnsToken;
      let req = {
        custId: this.auth.userInfo.custId,
        debitAcnt: this.dataInput.dataOutAccount,
        // caPaymentAmount: this.dataInput.caPaymentAmount,
        trnsToken: this.dataInput.trnsToken
      };

      const CA_Object = {
        securityType: '2',
        signText: req,
        serviceId: 'FD000203'
      };
      logger.error("CA_Object", CA_Object)
      const success = await this.check_security.doSecurityNextStep(CA_Object);
      try {
        logger.debug('doSecurityNextStep', success);
        let reqHeader = {
          header: success.headerObj
        };
        const Sendfd000203 = await this.fd000203.send(req, reqHeader);
        this.navgator.push('certificateResult', Sendfd000203.body);
      } catch (sendError) {
        this.handleError.handleError(sendError);
      }
    } catch (error) {
      logger.debug('cancel', error);
    }
  }

  /**
 * 返回上一頁
 */
  backPage() {
    // this.navgator.pop();
    this.navgator.popTo('certificateService');
  }

}
