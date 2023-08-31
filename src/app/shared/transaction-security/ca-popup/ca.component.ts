import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { CheckService } from '@shared/check/check.service';
import { ResolveEnd } from '@angular/router';
import { initDomAdapter } from '@angular/platform-browser/src/browser';
import { CaptchaComponent } from '@shared/captcha/captcha.component';
import { logger } from '@shared/util/log-util';
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-Ca',
  templateUrl: './ca.component.html',
  styleUrls: ['./ca.component.css'],
  providers: [AuthService, CheckService]
})

export class CaComponent implements OnInit {
  @ViewChild(CaptchaComponent) _captcha: CaptchaComponent;
  ulClass = 'inner_table_frame';
  CA_error_msg: string = '';

  promise: Promise<any>;
  title: string;
  inputName: string;
  noteTitle: string;
  noteContent: string;
  content: string;
  btnYesTitle: string;
  btnNoTitle: string;
  check: boolean;
  captchaFlag = false;
  showCaptcha: boolean;
  checkCaptchaFlag = false;
  transAccountType: string;
  returnObj = {
    ERROR: {
      title: '',
      status: null,
      message: '',
      content: '',
      type: ''
    },
    CA_val: '' // 輸入的CA保護密碼值
  }

  constructor(
    private _checkService: CheckService
  ) {

    this.promise = new Promise((resolve, reject) => {
      this.check = true;
      this.yes = () => {
        if (this.transAccountType === '2' && this.showCaptcha === true) {
          this.checkCaptchaFlag = this._captcha.checkCaptchaVal();
        }
        let checkEmpty = this._checkService.checkEmpty(this.returnObj.CA_val, true, false);
        if (!checkEmpty) {
          this.ulClass = 'inner_table_frame active_warnning';
          this.CA_error_msg = '請輸入憑證保護密碼';
        } else {

          let check_max = this._checkService.checkLength(this.returnObj.CA_val, 12, 'max');
          let check_min = this._checkService.checkLength(this.returnObj.CA_val, 4, 'min');
          let check_english_number = this._checkService.checkEnglish(this.returnObj.CA_val, 'english_number');

          // if (!check_max.status || !check_min.status || !check_english_number.status) {
          if (!check_max.status || !check_min.status) {
            this.ulClass = 'inner_table_frame active_warnning';
            // 密碼長度不可少於4碼及不可多餘12碼
            // 簽章失敗，請確認憑證保護密碼是否輸入正確。
            this.CA_error_msg = '保護密碼必須為4-12位英數字，請重新輸入';

          } else {
            if (this.transAccountType === '2' && this.showCaptcha === true && this.checkCaptchaFlag === true) {
              resolve(this.returnObj);
            } else if (this.transAccountType !== '2' || (this.transAccountType==='2' &&  this.showCaptcha === false )) {
              resolve(this.returnObj);
            }
            this.ulClass = 'inner_table_frame';
          }
        }
      };

      this.no = () => {
        let ERROR = {
          title: '',
          status: false,
          message: '使用者取消',
          content: '使用者取消',
          type: '',
          errorCode: 'USER_CANCEL'
        };
        reject(ERROR);
      };

    });
  }

  ngOnInit() {

  }
  yes() {

  }
  no() {

  }


}

