import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { CertService } from '@lib/plugins/tcbb/cert.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { ValidatorEngNumSymbol } from '@shared/validator/validator';
import { logger } from '@shared/util/log-util';
import { NavgatorService } from '@core/navgator/navgator.service';
@Component({
  selector: 'app-certificate-changepwd',
  templateUrl: './certificate-changepwd.component.html',
  styleUrls: ['./certificate-changepwd.component.css']
})
export class CertificateChangepwdComponent implements OnInit {

  pwdChangeForm: FormGroup;

  constructor(
    private cert: CertService,
    private alert: AlertService,
    private resultPage: HandleErrorService,
    private navgator: NavgatorService
  ) { }


  ngOnInit() {
    let newPwd = new FormControl('', [Validators.required, CustomValidators.rangeLength([4, 12]), ValidatorEngNumSymbol]);
    // let checkPwd = new FormControl('', [Validators.required, CustomValidators.rangeLength([4, 12]), CustomValidators.equalTo(newPwd)]);
    this.pwdChangeForm = new FormGroup(
      {
        oldPwd: new FormControl('', [Validators.required, CustomValidators.rangeLength([4, 12]), ValidatorEngNumSymbol]),
        newPwd: newPwd,
        // tslint:disable-next-line: max-line-length
        checkPwd: new FormControl('', [Validators.required, CustomValidators.rangeLength([4, 12]), ValidatorEngNumSymbol, CustomValidators.equalTo(newPwd)])
      }
    );
  }

  /**
   * 驗證表單
   * @param fieldName 欄位名稱
   */
  validate(fieldName: string) {
    const field = this.pwdChangeForm.get(fieldName);
    return (field.touched && field.invalid);
  }

  async changePwd() {
    if (this.pwdChangeForm.invalid) {
      // tslint:disable-next-line:forin
      for (const key in this.pwdChangeForm.controls) {
        logger.warn('this.pwdChangeForm', this.pwdChangeForm);
        this.pwdChangeForm.controls[key].markAsTouched();
      }
      return;
    }
    try {
      const success = await this.cert.updateCertPwd(this.pwdChangeForm.value.oldPwd, this.pwdChangeForm.value.newPwd);
      this.resultPage.handleError({
        type: 'message', // 訊息頁面(message)
        title: '變更結果', // 標題
        content: '憑證保護密碼變更成功', // 錯誤訊息
        button: '返回服務憑證', // 確認
        backType: 'certificateService', // type = redirect 啟用: '0'= 回首頁 '1'= 返回上一頁 'route/path'= 直接連接到各頁面
        classType: 'success', // 訊息提示類型success, warning, error
      });
    } catch (error) {
      this.alert.show('簽章失敗，請確認憑證保護密碼是否輸入正確。');
    }
  }

  //點擊取消
  onCancel() {
    this.navgator.push('certificateService');
  }
}
