import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { CheckService } from '@shared/check/check.service';
import { ResolveEnd } from '@angular/router';
import { initDomAdapter } from '@angular/platform-browser/src/browser';
import { CaptchaComponent } from '@shared/captcha/captcha.component';
import { logger } from '@shared/util/log-util';
import { AuthCheckUtil } from '@shared/util/check/word/auth-check-util';
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-card-safe-popup',
  templateUrl: './card-safe-popup.component.html',
  styleUrls: ['./card-safe-popup.component.css'],
  providers: [AuthService, CheckService]
})

export class CardSafePopUpComponent implements OnInit {
  @ViewChild(CaptchaComponent) _captcha: CaptchaComponent;
  ulClass = 'inner_table_frame';
  Pwd_error_msg: string = '';

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
    PD_val: '' // 輸入的PWA保護密碼值
  }

  constructor(
    private _checkService: CheckService
  ) {

    this.promise = new Promise((resolve, reject) => {
      this.check = true;
      this.yes = () => {
 
        let checkEmpty = this._checkService.checkEmpty(this.returnObj.PD_val, true, false);
        const check_data = AuthCheckUtil.checkOldPswd(this.returnObj.PD_val,true);
        logger.error('check_data',check_data);
        if (!checkEmpty) {
          this.ulClass = 'inner_table_frame active_warnning';
          this.Pwd_error_msg = '請輸入信用卡會員登入密碼';
        }else if(!check_data.status){
          this.ulClass = 'inner_table_frame active_warnning';
          this.Pwd_error_msg = '密碼請輸入英數或符號';
        }else {
            resolve(this.returnObj);
            this.ulClass = 'inner_table_frame';
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

