import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FD000202ReqBody } from '@api/fd/fd000202/fd000202.req';
import { FD000202ApiService } from '@api/fd/fd000202/fd000202-api.service';
import { FD000202Res, FD000202ResBody } from '@api/fd/fd000202/fd000202.res';
import { F4000101ApiService } from '@api/f4/f4000101/f4000101-api.service';
import { F4000101ReqBody } from '@api/f4/f4000101/f4000101-req';
import { logger } from '@shared/util/log-util';
import { AuthService } from '@core/auth/auth.service';
import { CertService } from '@lib/plugins/tcbb/cert.service';
import { CertificateService } from '@pages/security/shared/service/certificate.service';
@Component({
  selector: 'app-certificate-change',
  templateUrl: './certificate-change.component.html',
  styleUrls: ['./certificate-change.component.css'],
  providers: [ CertificateService ]
})
export class CertificateChangeComponent implements OnInit {

  constructor(
    private navgator: NavgatorService,
    private fd000202: FD000202ApiService,
    private f4000101: F4000101ApiService,
    private auth: AuthService,
    private cert: CertService,
    private CertUpdate: CertificateService
  ) { }

  dataCertificate = {
    caStatus: '', // 憑證狀態
    caApplyDt: '', // 申請日期
    caEndDt: '', // 到期日期
    caPaymentAmount: '', // 繳費金額
    dataOutAccount: '', // 扣款帳號
    trnsToken: '' // 交易控制碼
  };

  dataOutAccount = [];

  ngOnInit() {
    this.CertUpdate.updateCertificate();
    // this.sendFd000202();
  }

  /**
   * 憑證到期繳費確認頁面
   */
  gotoConfirm() {
    this.navgator.push('certificateConfirm', this.dataCertificate);
  }

  /**
   * 返回上一頁
   */
  backPage() {
    this.navgator.pop();
  }

  /**
   * 發送FD000202-憑證申請
   * @param csr 憑證請求檔
   */
  sendFd000202() {
    const form = new FD000202ReqBody();
    form.custId = this.auth.userInfo.custId;
    this.fd000202.send(form).then(
      res => {
        this.dataCertificate.caApplyDt = res.body.caApplyDt;
        this.dataCertificate.caEndDt = res.body.caEndDt;
        this.dataCertificate.caPaymentAmount = res.body.caPaymentAmount;
        this.dataCertificate.caStatus = res.body.caStatus;
        if (this.dataCertificate.caStatus === '1') {
          this.sendF4000101();
        } else if (this.dataCertificate.caStatus === '0') {
          this.CertUpdate.updateCertificate();
        }
      }
    );
  }

  /**
   * 發送F4000101-取得扣款帳號
   */
  sendF4000101() {
    const form = new F4000101ReqBody();
    form.custId = this.auth.userInfo.custId;
    this.f4000101.send(form).then(
      res => {
        logger.debug('f4000101', res);
        this.dataOutAccount = res.trnsOutAccts;
        this.dataCertificate.dataOutAccount = this.dataOutAccount[0].acctNo;
        this.dataCertificate.trnsToken = res.info_data.trnsToken;
      }
    );
  }
}
