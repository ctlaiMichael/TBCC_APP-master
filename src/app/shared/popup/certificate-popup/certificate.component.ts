import { Component, OnInit } from '@angular/core';
import { FD000101ApiService } from '@api/fd/fd000101/fd000101-api.service';
import { FD000101ReqBody } from '@api/fd/fd000101/fd000101.req';
import { FD000102ReqBody } from '@api/fd/fd000102/fd000102.req';
import { FD000102ApiService } from '@api/fd/fd000102/fd000102-api.service';
import { AuthService } from '@core/auth/auth.service';
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-Certificate',
  templateUrl: './Certificate.component.html',
  styleUrls: ['./Certificate.component.css'],
  providers: [FD000101ApiService, FD000102ApiService, AuthService]
})

export class CertificateComponent implements OnInit {
  promise: Promise<any>;
  title: string;
  content: string;
  btnYesTitle: string;
  btnNoTitle: string;
  check: boolean;
  dataList: object;
  pwdInfo = {
    key: '', // 憑證
    certificate: '', // 憑證申請密碼
    certificate_protection: '', // 憑證保護密碼
    certificate_protectionCheck: '' // 憑證保護密碼確認
  };

  constructor(
    private FD000101: FD000101ApiService,
    private FD000102: FD000102ApiService,
    private auth: AuthService
  ) {
    this.promise = new Promise((resolve, reject) => {
      this.yes = () => {
        const form = new FD000102ReqBody();
        form.custId = this.auth.getUserInfo().custId; // 身分證字號
        form.certCN = this.pwdInfo.key; // 憑證CN
        form.encCSR = ''; // 加密憑證請求資料
        form.signCSR = ''; // 簽章憑證請求資料
        form.certAplyPswd = this.pwdInfo.certificate; // 憑證申請密碼
        this.FD000102.send(form).then(
          (fd000102res) => {
            resolve(fd000102res);
          }).catch(
            (err) => {
              reject(err);
            });
        resolve(this.pwdInfo);
      };

      this.no = () => {
        reject();
      };
    });
  }

  ngOnInit() {
    this.sendCertificate();
  }


  yes() { }
  no() { }

  noPage1() {
    this.no();
  }

  yesPage1() {
    this.check = false;
  }

  /**
    * 取得憑證
    */
  sendCertificate(): Promise<any> {
    return new Promise((resolve, reject) => {
      const form = new FD000101ReqBody();
      form.custId = this.auth.getUserInfo().custId;
      this.FD000101.send(form).then(
        (fd000101res) => {
          this.check = true;
          this.dataList = fd000101res.body.details.detail;
          this.pwdInfo.key = this.dataList[0].CertCN; // 取的第一筆資料
        }).catch(
          (err) => {
            reject(err);
          });
    });
  }
}
