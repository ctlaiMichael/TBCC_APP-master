import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { validatorSame, vaildContinuous } from '@shared/validator/validator';

@Component({
  selector: 'app-input-cert-protect-pwd',
  templateUrl: './input-cert-protect-pwd.component.html',
  styleUrls: ['./input-cert-protect-pwd.component.css']
})
export class InputCertProtectPwdComponent implements OnInit {
  promise: Promise<any>;
  form: FormGroup;

  title: string;
  certUpdate: boolean;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.submit = () => {
        if (!this.certUpdate && this.form.valid) { //憑證申請
          resolve(this.form.value.pwd);
        }else if (this.certUpdate && this.form.valid) {
          resolve(this.form.value.pwd);
        }else {
          return;
        }  
      };

      this.cancel = () => {
        reject();
      };
    });
   }

  ngOnInit() {
    if (!this.certUpdate) {
      let pwd = new FormControl('', [Validators.required, CustomValidators.rangeLength([4, 12]), validatorSame, vaildContinuous]);
      this.form = new FormGroup(
      {
        pwd: pwd,
        pwdConfirm: new FormControl('', [Validators.required, CustomValidators.equalTo(pwd)])
      });
    }else {
      this.form = new FormGroup(
      {
        pwd: new FormControl('', [Validators.required, CustomValidators.rangeLength([4, 12])])
      });    
    }
  }

  submit() {}
  cancel() {}

  /**
   * 驗證表單
   * @param fieldName 欄位名稱
   */
  validate(fieldName: string) {
    if (typeof this.form !== 'undefined') {
      const field = this.form.get(fieldName);
      return (field.touched && field.invalid);
    }
    return false;
  }
}
