/**
 * 憑證下載
 * 1. FD000101-憑證CN查詢
 * 2. 輸入憑證申請密碼
 * 3. 輸入憑證保護密碼
 *    CN+憑證保護密碼(使用者自定)
 * 4. plugin.cert.setFD000101Data //取得CSER
 *    憑證申請密碼
 * 5. FD000102
 * 6. plugin.cert.setFD000102Data
 */
import { Component, OnInit } from '@angular/core';
import { FD000101ResBody, FD000101Res } from '@api/fd/fd000101/fd000101.res';
import { FD000101ApiService } from '@api/fd/fd000101/fd000101-api.service';
import { FD000102ApiService } from '@api/fd/fd000102/fd000102-api.service';
import { CertService } from '@lib/plugins/tcbb/cert.service';
import { SystemParameterService } from '@core/system/system-parameter/system-parameter.service';
import { AuthService } from '@core/auth/auth.service';
import { FD000101ReqBody } from '@api/fd/fd000101/fd000101.req';
import { InputCertProtectPwdService } from '@shared/popup/input-cert-protect-pwd/input-cert-protect-pwd.service';
import { FD000102ReqBody } from '@api/fd/fd000102/fd000102.req';
import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';
import { FD000102Res, FD000102ResBody } from '@api/fd/fd000102/fd000102.res';
import { ResBody } from '@base/api/model/res-body';
import { NavgatorService } from '@core/navgator/navgator.service';
import { logger } from '@shared/util/log-util';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { AlertService } from '@shared/popup/alert/alert.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HandleErrorOptions } from '@core/handle-error/handlerror-options';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { TcbbService } from '@lib/plugins/tcbb/tcbb.service';
import { InputCertOptions } from '@shared/popup/input-cert-protect-pwd/input-cert-protect-pwd-option';
import { CommonUtil } from '@shared/util/common-util';

@Component({
  selector: 'app-certificate-application',
  templateUrl: './certificate-application.component.html',
  styleUrls: ['./certificate-application.component.css']
})
export class CertificateApplicationComponent implements OnInit {
  certForm: FormGroup;
  custId: string;
  certList: any = [];
  CNFromServer: boolean;
  certCN: string;

  constructor(
    private fd000101: FD000101ApiService,
    private fd000102: FD000102ApiService,
    private certService: CertService,
    private authService: AuthService,
    private inputCertProtectPwdService: InputCertProtectPwdService,
    private navgator: NavgatorService,
    private errorHandler: HandleErrorService,
    private alert: AlertService,
    private headerCtrl: HeaderCtrlService,
    private auth: AuthService,
    private tcbb: TcbbService
  ) {
    this.CNFromServer = true;
    this.headerCtrl.setLeftBtnClick(() => {
      this.backTo();
    });
    this.custId = this.authService.getUserInfo().custId;
    this.certForm = new FormGroup(
      {
        cert: new FormControl('', [Validators.required]),
        pwd: new FormControl('', [Validators.required, CustomValidators.rangeLength([1, 16])])
      }
    );
    this.getCertFromServer().then(
      res => {
        // TODO 需檢核非null
        if (this.CNFromServer) {
          this.certList = res;
          this.certForm.setValue({
            cert: this.certList[0].CertCN,
            pwd: ''
          });
        }
      }
    ).catch(err => {
      this.errorHandler.handleError({
        type: 'dialog',
        title: 'ERROR.TITLE',
        content: '您的行動裝置無合庫行動網銀憑證，請洽營業單位申請。'
      }).then(() =>
        this.navgator.popTo('user-set')
      );
    });
  }

  ngOnInit() {
  }

  backTo() {
    this.navgator.popTo('user-set');
    logger.log('backTo');
  }

  /**
   * 驗證表單
   * @param fieldName 欄位名稱
   */
  validate(fieldName: string) {
    const field = this.certForm.get(fieldName);
    return (field.touched && field.invalid);
  }

  cancel() {
    this.navgator.push('user-set');
    logger.log('cancel');
  }

  submit() {
    if (this.certForm.invalid) {
      // TODO 錯誤處理
      this.alert.show('請輸入完整資訊');
      return;
    }
    logger.log('form:' + JSON.stringify(this.certForm.value));
    // 設定已選好的 憑證 和 憑證申請密碼
    // 輸入憑證保護密碼
    const inputCertOpt = new InputCertOptions();
    inputCertOpt.title = '憑證申請作業';
    inputCertOpt.certUpdate = false;
    if (this.CNFromServer) {
      CommonUtil.wait(500).then(() => this.inputCertProtectPwdService.show(inputCertOpt))
        .then(certProtectPwd => {
          // 產生CSR
          return this.certService.genCsrForFD000102(this.certForm.value.cert, certProtectPwd, 'complete')
            // 發送FD000102取回憑證
            .then(csr => this.sendFd000102(csr))
            // 儲存憑證
            .then(res => this.saveCert(res))
            // 結束
            .then(res => this.checkResult(res))
            .catch(
              err => {
                // TODO ErrorHandle
                logger.error('err', err);
                this.errorHandler.handleError(err);
              }
            );
        });
      } else { // 不重新產生csr流程
        return this.certService.genCsrForFD000102('', '', 'simple')
            // 發送FD000102取回憑證
            .then(csr => this.sendFd000102(csr))
            // 儲存憑證
            .then(res => this.saveCert(res))
            // 結束
            .then(res => this.checkResult(res))
            .catch(
              err => {
                // TODO ErrorHandle
                logger.error('err', err);
                this.errorHandler.handleError(err);
              }
          );
      }

    }


  /**
   * 發送FD000101-憑證CN查詢
   */
  getCertFromServer(): Promise<FD000101Res> {
    return this.fd000101.getData().then(
      (sucess) => {
        // if (sucess.length === 0) {
        //   const error = new HandleErrorOptions('查無憑證');
        //   error.backType = '0';
        //   return Promise.reject(error);
        // } else {
        //   return Promise.resolve(sucess);
        // }
        // return Promise.resolve(sucess);
        return this.certService.checkCSR(sucess)
          .then((res) => {
            if (res.returnCode === 0)
              return Promise.resolve(sucess);
            else if (res.returnCode === 1) {
              this.CNFromServer = false;
              this.certCN = res.CN;
              this.certForm.setValue({
                cert: res.CN,
                pwd: ''
              });
              return Promise.resolve(null);
            }
          })
          .catch((err) => {
            const error = new HandleErrorOptions('查無憑證');
            error.backType = '0';
            return Promise.reject(error);
          })
      },
      (failed) => {
        return Promise.reject(failed);
      }
    );
  }

  /**
   * 發送FD000102-憑證申請
   * @param csr 憑證請求檔
   */
  sendFd000102(csr): Promise<FD000102Res> {
    logger.log('getCertFromServer');
    const form = new FD000102ReqBody();
    form.custId = this.custId;
    form.certCN = this.certForm.value.cert;
    form.signCSR = csr.signCSR;
    form.encCSR = csr.encCSR;
    form.certAplyPswd = this.certForm.value.pwd;
    return this.fd000102.send(form);
  }

  /**
   * 儲存憑證
   * @param res FD000102Res
   */
  saveCert(res: FD000102Res) {
    logger.log('saveCert');
    const resBody = res.body;
    return this.certService.saveCert(resBody.signCertData, resBody.encCertData);
  }

  /**
   * 檢查儲存結果
   * @param res 儲存結果
   */
  checkResult(res) {
    let custId = this.auth.getUserInfo().custId;
    let userId = this.auth.getUserInfo().userId;
    logger.log('checkResult');
    return this.tcbb.setF1000102Data({ nbCert: this.auth.nbCert }, custId, userId)
      .then(res_cn => {
        if (res_cn.cn.indexOf(custId) <= -1) {
          res_cn.cn = '';
          res_cn.sn = '';
        }
        this.auth.setCn(res_cn.cn, res_cn.sn);
        this.navgator.push('certificateService');
      });
  }
}
