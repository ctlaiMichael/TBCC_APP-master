import { Component, OnInit, ViewChild } from '@angular/core';
import { F1000105ApiService } from '@api/f1/f1000105/f1000105-api.service';
import { F1000105ReqBody } from '@api/f1/f1000105/f1000105-req';
import { CaptchaComponent } from '@shared/captcha/captcha.component';
import { CheckService } from '@shared/check/check.service';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { resolve } from 'url';
import { reject } from 'q';
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css'],
  providers: [F1000105ApiService, CheckService]
})

export class OtpComponent implements OnInit {
  @ViewChild(CaptchaComponent) _captcha: CaptchaComponent;
  promise: Promise<any>;
  title: string;
  content: string;
  btnYesTitle: string;
  btnNoTitle: string;
  check: boolean;
  otpView: boolean;
  reqData: object;
  captchaFlag = false;
  checkCaptchaFlag = false;
  OTP_flag: boolean;
  transAccountType: string;
  showCaptcha: boolean;
  OTP_error_msg: string;
  ulClass = 'inner_table_frame';
  resData = {
    ERROR: {
      title: '',
      status: null,
      message: '',
      content: '',
      type: '',
      errorCode: ''
    },
    OTP_SEC: 0,
    checkCode: '',
    accessToken: '',
    OTP_val: ''
  };
  timeObj: any;
  ignorCheckInfo: boolean; // 是否顯示OTP提示訊息



  constructor(

    private F1000105: F1000105ApiService,
    private _checkService: CheckService,
    private _logger: Logger,
    private errorHandler: HandleErrorService,
    // private auth: AuthService
  ) {

    this.check = true;
    this.otpView = false;
    this.promise = new Promise((resolve, reject) => {
      this.otpYes = () => {
        this.OTP_flag = true;
        // 圖形驗證
        if (this.transAccountType === '2' && this.showCaptcha === true) {
          this.checkCaptchaFlag = this._captcha.checkCaptchaVal();
        }
        // 空值驗證
        let checkEmpty = this._checkService.checkEmpty(this.resData.OTP_val, true, false);
        if (!checkEmpty) {
          this.OTP_flag = false;
          this.ulClass = 'inner_table_frame active_warnning';
          this.OTP_error_msg = '請輸入OTP驗證碼';
        }
        // 數值驗證
        let checkNumber = this._checkService.checkNumber(this.resData.OTP_val);
        // 長度檢核
        let check_min = this._checkService.checkLength(this.resData.OTP_val, 6, 'min');
        if (!check_min.status) {
          this.OTP_flag = false;
          this.ulClass = 'inner_table_frame active_warnning';
          this.OTP_error_msg = 'OTP碼長度必須為6位數字，請重新輸入';
        }
        if (!checkNumber.status) {
          this.OTP_flag = false;
          this.ulClass = 'inner_table_frame active_warnning';
          this.OTP_error_msg = '請輸入數值';
        }
        // 回傳
        if (this.OTP_flag) {
          this.ulClass = 'inner_table_frame';
        }
        if (this.transAccountType === '2' && this.showCaptcha === true && this.checkCaptchaFlag === true && this.OTP_flag) {
          this.countTimerStop(this.timeObj);
          resolve(this.resData);
        } else if ((this.transAccountType !== '2' && this.OTP_flag) || (this.transAccountType==='2' &&  this.showCaptcha === false )) {
          this.countTimerStop(this.timeObj);
          resolve(this.resData);
        }
      }, this.no = () => {
        reject(this.resData);
      };

    });

  }

  ngOnInit() {
    let req = this.reqData;
    this._logger.log('req', req);
    // if (!!this.ignorCheckInfo) {
    //   // 忽略不顯示OTP提示訊息
    //   this.yes();
    // }
    // 目前都不顯示提示訊息(2019/8/8 電金調整)
    this.yes();
  }


  yes() {
    this._logger.log('116reqData', this.reqData);
    if (this.reqData) {
      let res = this.reqData;

      return this.sendOtp(res).then(
        (S) => {
          // 紀錄資料
          this._logger.log('pre to show next', S);
          this.resData.OTP_SEC = S.OTP_SEC;
          this.resData.checkCode = S.checkCode;
          this.resData.accessToken = S.accessToken;
          this.check = false;
          this.otpView = true;
          if (this.otpView) {
            this.countTimer(this.resData.OTP_SEC);
          }

        }, (F) => {

          // reject(F);
          this._logger.log('bakF', F);
          this.no();
          if (F.hasOwnProperty('telegram') && F['telegram'] == 'error') {
            this.errorHandler.handleError({
              type: 'dialog',
              title: 'ERROR.TITLE',
              content: F.content
            });
          }
        }

      );
    }

  }
  no() { }

  onCancel() {
    this.resData.ERROR = {
      title: '',
      status: false,
      message: '使用者取消',
      content: '使用者取消',
      type: '',
      errorCode: 'USER_CANCEL'
    };
    this.no();
  }


  otpNo() {
    this.countTimerStop(this.timeObj);
    this.resData.ERROR = {
      title: '',
      status: false,
      message: '使用者取消',
      content: '使用者取消',
      type: '',
      errorCode: 'USER_CANCEL'
    };
    this.no();
  }

  otpYes() {
  }

  // 計時
  countTimer(time) {
    if (time) {
      this.timeObj = setTimeout(
        () => {
          if (this.resData.OTP_SEC > 0) {
            this._logger.log(this.resData.OTP_SEC);
            this.resData.OTP_SEC = this.resData.OTP_SEC - 1;
            this.countTimer(this.resData.OTP_SEC);
          }
        }, 1000);
    } else {
      // error handle popUP 逾時
      this._logger.log('count stop');
      this.resData.ERROR.title = '';
      this.resData.ERROR.content = 'OTP 逾時';
      this.resData.ERROR.message = 'OTP 逾時';
      this.resData.ERROR.status = false;
      this.resData.ERROR.type = '';
      this.countTimerStop(this.timeObj);
      this.no();
    }
  }
  // 清除倒數
  countTimerStop(timeObj) {
    clearTimeout(timeObj);
  }

  /**
    * 取得憑證
    *   <co:custId>F121374529</co:custId>
        <fnctId>F4000102</fnctId>
        <depositNumber>9997705072432</depositNumber>
        <depositMoney>100</depositMoney>
        <OutCurr>TWD</OutCurr>
        <transTypeDesc>10</transTypeDesc>
    */
  sendOtp(req): Promise<any> {
    return new Promise((resolve, reject) => {
      this.F1000105.send(req).then(
        (f1000105res) => {
          this._logger.log('105S', f1000105res);
          resolve(f1000105res);

        }, (f1000105_error) => {
          f1000105_error['telegram'] = 'error';
          reject(f1000105_error);
        }
      ).catch(
        (err) => {
          this._logger.log('105F', err);
          err['telegram'] = 'error';
          reject(err);
        });
    });
  }
}
