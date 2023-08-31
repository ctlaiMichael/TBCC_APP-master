import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CaptchaComponent } from '@shared/captcha/captcha.component';
import { CheckService } from '@shared/check/check.service';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FC001009ApiService } from '@api/fc/fc001009/fc001009-api.service';
import { FC001010ApiService } from '@api/fc/fc001010/fc001010-api.service';
import { AuthService } from '@core/auth/auth.service';
import { UserMaskUtil } from '@shared/util/formate/mask/user-mask-util';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-sms',
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.css'],
  providers: [FC001009ApiService, CheckService]
})

export class SmsComponent implements OnInit {
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
    OTP_SEC: 300, //中台有提供用中台回傳值，否則預設值
    checkCode: '',
    accessToken: '',
    OTP_val: '',
    apiData: { //儲存api相關資訊，fc001009,fc001010
      msgReqData: {}, //fc001009簡訊密碼請求 body
      msgReqInfo: {}, //fc001009簡訊密碼請求
      msgVerifyData: {}, //fc001010簡訊密碼驗證 body
      msgVerifyInfo: {} //fc001010簡訊密碼驗證
    }
  };
  timeObj: any;
  ignorCheckInfo: boolean; // 是否顯示OTP提示訊息
  markPhone;


  constructor(

    private F1001009: FC001009ApiService,
    private F1001010: FC001010ApiService,
    private _checkService: CheckService,
    private _logger: Logger,
    private errorHandler: HandleErrorService,
    private authService: AuthService
  ) {
    this.check = true;
    this.otpView = false;
    this.promise = new Promise((resolve, reject) => {
      this.otpYes = () => {
        this._logger.log("into click otpYes");
        this.OTP_flag = true;
        // 圖形驗證
        // if (this.transAccountType === '2' && this.showCaptcha === true) {
        //   this.checkCaptchaFlag = this._captcha.checkCaptchaVal();
        // }
        this._logger.log("before check, resData.OTP_val:", this.resData.OTP_val);
        // 空值驗證
        let checkEmpty = this._checkService.checkEmpty(this.resData.OTP_val, true, false);
        if (!checkEmpty) {
          this._logger.log("into checkEmpty error, checkEmpty:", checkEmpty);
          this.OTP_flag = false;
          this.ulClass = 'inner_table_frame active_warnning';
          this.OTP_error_msg = '請輸入簡訊驗證碼';
          return false;
        }
        // 數值驗證
        let checkNumber = this._checkService.checkNumber(this.resData.OTP_val);
        if (!checkNumber.status) {
          this._logger.log("into checkNumber error, checkNumber:", checkNumber);
          this.OTP_flag = false;
          this.ulClass = 'inner_table_frame active_warnning';
          this.OTP_error_msg = '請輸入數值';
          return false;
        }

        //檢查可英數字

        // 長度檢核
        let check_min = this._checkService.checkLength(this.resData.OTP_val, 6, 'min');
        if (!check_min.status) {
          this._logger.log("into check_min error, check_min:", check_min);
          this.OTP_flag = false;
          this.ulClass = 'inner_table_frame active_warnning';
          this.OTP_error_msg = '驗證碼長度必須為6位數字，請重新輸入';
          return false;
        }

        // 回傳，檢核成功，發送FC001010-簡訊密碼驗證
        if (this.OTP_flag) {
          this._logger.log("into OTP_flag success, OTP_flag:", this.OTP_flag);
          this.ulClass = 'inner_table_frame';
          this.countTimerStop(this.timeObj); //檢核成功停止計時
          //fc001010 req
          let reqData = {
            custId: '',
            verifyWeb: '',
            verifyCode: ''
          };
          const userData = this.authService.getUserInfo(); //取得使用者狀態
          if (!userData.hasOwnProperty('custId') || userData.custId == '') {
            return Promise.reject({
              title: 'ERROR.TITLE',
              content: 'ERROR.DATA_FORMAT_ERROR'
            });
          }
          //組裝req
          reqData.custId = userData.custId;
          reqData.verifyWeb = this.resData['apiData']['msgReqData']['verifyWeb'];
          reqData.verifyCode = this.resData.OTP_val;
          return this.sendVerify(reqData).then(
            (S) => {
              this._logger.log('pre to show next', S);
              let jsonObj = (S.hasOwnProperty('body')) ? S['body'] : {};
              this._logger.log("fc001010 jsonObj:", jsonObj);
              this.resData['apiData']['msgVerifyInfo'] = S; //fc001010
              this.resData['apiData']['msgVerifyData'] = jsonObj; //fc001010 body
              this._logger.log("fc001010 S, resData:", this.resData);
              resolve(this.resData);
            },
            (F) => {
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
        //不需要判斷安控種類，檢核成功後直接回傳: if (this.OTP_flag)
        // if (this.transAccountType === '2' && this.showCaptcha === true && this.checkCaptchaFlag === true && this.OTP_flag) {
        //   this.countTimerStop(this.timeObj);
        //   resolve(this.resData);
        // } else if ((this.transAccountType !== '2' && this.OTP_flag) || (this.transAccountType==='2' &&  this.showCaptcha === false )) {
        //   this.countTimerStop(this.timeObj);
        //   resolve(this.resData);
        // }
      }, this.no = () => {
        this._logger.log('into no');
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
          let jsonObj = (S.hasOwnProperty('body')) ? S['body'] : {};
          this._logger.log("fc000109 jsonObj:", jsonObj);
          this.resData['apiData']['msgReqInfo'] = S; //fc001009
          this.resData['apiData']['msgReqData'] = jsonObj; //fc001009 body
          this._logger.log("fc00109 S, resData:", this.resData);
          //中台有提供用中台回傳值，否則預設值(300秒)
          if (S.OTP_SEC) {
            this.resData.OTP_SEC = S.OTP_SEC;
          }
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
       
          if (F.hasOwnProperty('body') && F['body'].hasOwnProperty('result') 
          &&  F['body']['result']!= '0') { //簡訊次數超過 or other error
            this.resData.ERROR = {
              title: 'ERROR.TITLE',
              status: false,
              message: F['body']['respCodeMsg'],
              content: F['body']['respCodeMsg'],
              type: 'message',
              errorCode: ''
            };
          }
          if (F.hasOwnProperty('telegram') && F['telegram'] == 'errorApi') {
            this.resData.ERROR = {
              title: 'ERROR.TITLE',
              status: false,
              message: F.content,
              content: F.content,
              type: '',
              errorCode: 'errorApi'
            };
          }
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
  no() { this._logger.log("into no function"); }

  onCancel() {
    this._logger.log("into onCancel()");
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
    this._logger.log("into otpNo()");
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
    // this._logger.log("time:", time);
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
      this.resData.ERROR.content = '發送簡訊逾時';
      this.resData.ERROR.message = '發送簡訊逾時';
      this.resData.ERROR.status = false;
      this.resData.ERROR.type = '';
      this.resData.ERROR.errorCode = 'TIME_ERROR';
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
    this._logger.log("send fc001009 api, req:", req);
    return new Promise((resolve, reject) => {
      this.F1001009.send(req).then(
        (f1001009res) => {
          this._logger.log('109S', f1001009res);
          if(f1001009res.hasOwnProperty('body') && f1001009res['body'].hasOwnProperty('result')&&
          f1001009res.body.result=="0"){
            resolve(f1001009res);
          }else{
            reject(f1001009res);
          }
        }, (f1001009_error) => {
          this._logger.log("into f1001009_error");
          f1001009_error['telegram'] = 'errorApi';
          reject(f1001009_error);
        }
      ).catch(
        (err) => {
          this._logger.log('109F', err);
          err['telegram'] = 'error';
          reject(err);
        });
    });
  }

  sendVerify(req): Promise<any> {
    this._logger.log("fc001010 req:", req);
    return new Promise((resolve, reject) => {
      this.F1001010.send(req).then(
        (f1001010res) => {
          this._logger.log('1010S', f1001010res);
          resolve(f1001010res);

        }, (f1001010_error) => {
          f1001010_error['telegram'] = 'error';
          reject(f1001010_error);
        }
      ).catch(
        (err) => {
          this._logger.log('1010F', err);
          err['telegram'] = 'error';
          reject(err);
        });
    });
  }
}
