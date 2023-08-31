import { Component, OnInit, Input } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { CertService } from '@lib/plugins/tcbb/cert.service';
import { InputCertProtectPwdService } from '@shared/popup/input-cert-protect-pwd/input-cert-protect-pwd.service';
import { FD000201ApiService } from '@api/fd/fd000201/fd000201-api.service';
import { FD000201ReqBody } from '@api/fd/fd000201/fd000201.req';
import { FD000201Res, FD000201ResBody } from '@api/fd/fd000201/fd000201.res';
import { AuthService } from '@core/auth/auth.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { CertificateService } from '@pages/security/shared/service/certificate.service';

@Component({
  selector: 'app-certificate-result',
  templateUrl: './certificate-result-page.component.html',
  styleUrls: [],
  providers: [CertificateService]
})

export class CertificateResultComponent implements OnInit {

  dataInput: any;

  constructor(
    private _logger: Logger,
    private navgator: NavgatorService,
    private cert: CertService,
    private inpit_cert: InputCertProtectPwdService,
    private fd000201: FD000201ApiService,
    private auth: AuthService,
    private alert: AlertService,
    private certificate: CertificateService
  ) {
  }

  ngOnInit() {
    this.dataInput = this.navgator.getParams();
  }

  /**
   * 憑證更新
   */
  async updateCertificate() {
    this.certificate.updateCertificate();
  }
}
