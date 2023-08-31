import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { CertService } from '@lib/plugins/tcbb/cert.service';
import { InputCertProtectPwdService } from '@shared/popup/input-cert-protect-pwd/input-cert-protect-pwd.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { AuthService } from '@core/auth/auth.service';
import { FD000301ApiService } from '@api/fd/fd000301/fd000301-api.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { CertificateService } from '@pages/security/shared/service/certificate.service';
import { logger } from '@shared/util/log-util';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';

@Component({
  selector: 'app-certificate-service',
  templateUrl: './certificate-service.component.html',
  styleUrls: ['./certificate-service.component.css'],
  providers: [ CertificateService ]
})
export class CertificateServiceComponent implements OnInit {
  cert: any;
  constructor(
    private navgator: NavgatorService,
    private certService: CertService,
    private inputCertProtect: InputCertProtectPwdService,
    private alert: AlertService,
    private headerCtrl: HeaderCtrlService,
    private auth: AuthService,
    private fd000301: FD000301ApiService,
    private errorHandle: HandleErrorService,
    private certificate: CertificateService,
    private confirm: ConfirmService
  ) {
    this.cert = {};
    this.headerCtrl.setLeftBtnClick(() => {
      this.backTo();
    });
    this.certService.getCertInfo()
      .then((cert) => {
        logger.debug('cert', cert);
        logger.debug('cert:' + JSON.stringify(cert));
        this.cert = cert;
        if (cert.error == 8877) {
          this.showUpdateDialog();
        }
      }).catch(
        error => {
          this.navgator.push('certificateApplication', {});
        }
      );
  }

  ngOnInit() {
  }

  backTo() {
    this.navgator.popTo('user-set');
  }

  /**
   * 更新失敗顯示提示訊息 2019.12.24
   */
  showUpdateDialog() {
    this.confirm.show('前次更新作業未完成!!\n請按下「確定」按鈕開始進行憑證更新。', {  title: '憑證更新', btnYesTitle: '確定', btnNoTitle: '取消' }).then(
      (res) => {
          this.gotoUpdate();
      },
      (error) => {
      }
  );
  }

  /**
   * 連結到憑證密碼變更
   */
  gotoChangePwd() {
    this.navgator.push('certificateChangepwd', {});
  }

  /**
   * 連結到憑證到期繳費
   */
  gotoUpdate() {
    // this.navgator.push('certificateChange', {});
    this.certificate.updateCertificate();
  }

  /**
   * 憑證暫停
   */
  async cerificateStop() {
    this.certificate.stopCertificate();
  }
}
