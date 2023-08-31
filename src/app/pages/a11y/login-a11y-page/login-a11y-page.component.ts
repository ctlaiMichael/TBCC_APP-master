import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavgatorService } from '@core/navgator/navgator.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { TcbbService } from '@lib/plugins/tcbb/tcbb.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { FtLoginService } from '@pages/login/shared/ftlogin.service';
import { LoginService } from '@pages/login/shared/login.service';
import { A11yConfirmService } from '@shared/popup/a11y/confirm/confirm.service';
import { A11yAlertService } from '@shared/popup/a11y/alert/alert.service';
import { CustomValidators } from 'ng2-validation';
import { ValidatorcustId, ValidatoruserId, Validatorpwd } from '@shared/validator/validator';
import { SystemParameterService } from '@core/system/system-parameter/system-parameter.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { Logger } from '@core/system/logger/logger.service';

@Component({
  selector: 'app-login-a11y-page',
  templateUrl: './login-a11y-page.component.html',
  styleUrls: ['./login-a11y-page.component.css']
})
export class LoginA11yPageComponent implements OnInit {
  @ViewChild('userId', { read: ElementRef }) userIdInput: ElementRef; // body區塊
  @ViewChild('pwd', { read: ElementRef }) pwdInput: ElementRef; // body區塊
  loginForm2: FormGroup;
  // 登入資訊
  loginRemember = {
    userData: {
      custId: '',
      userId: ''
    },
    rememberMe: { // 記住我 0 關閉 1 啟用
      remcust: '0',
      remuser: '0',
    },
    ftlogin: {
      type: '', // 圖形鎖(pattern) or 生物辨識(biometric) or 一般登入(pwdlogin)
      fastlogin: '0', // 是否快速登入 0 關閉 1 啟用
      pay_setting: '0' // 生物辨識付款
    }
  };

  // 快速登入資訊
  ftloginRemember = {
    comparecustId: '',
    compareuserId: '',
  };

  // 看見我資訊
  seeObj = {
    seecust: true,
    seeuser: true,
    seepwd: true,
  };

  // 錯誤Obj
  errorObj = {
    type: '',
    content: ''
  };


  // 快速登入隱藏
  showFt = true;
  // 提示註冊快速登入
  showAgree = true;
  // 錯誤次數
  loginErrorCount = 0;


  infodata: string = 'a11yhomekey';

  obj = {
    style: 'normal_a11y',
    showMainInfo: false,
    leftBtnIcon: 'home',
    rightBtnIcon: 'noshow',
    title: '合作金庫',
    backPath: '',
  };
  login_status = false;
  constructor(
    private headerCtrl: HeaderCtrlService,
    private navgator: NavgatorService,
    private loginService: LoginService,
    private localStorageService: LocalStorageService,
    private tcbb: TcbbService,
    private alert: A11yAlertService,
    private systemparameter: SystemParameterService,
    private ftloginService: FtLoginService,
    private errorHandler: HandleErrorService,
    private confirm: A11yConfirmService,
    private _logger: Logger
  ) {
    //this.navgator.displaymicroBoxSubject.next(false);
    this.loginForm2 = new FormGroup(
      {
        custId: new FormControl('', [Validators.required, CustomValidators.rangeLength([1, 12]), ValidatorcustId]),
        userId: new FormControl('', [Validators.required, CustomValidators.rangeLength([1, 16]), ValidatoruserId]),
        pwd: new FormControl('', [Validators.required, CustomValidators.rangeLength([1, 12]), Validatorpwd])
      }
    );
    // this.headerCtrl.setHeaderStyle('normal_a11y');
    this.headerCtrl.setOption(this.obj);
    //this.headerCtrl.setRightBtnClick(this.loginMethod);
    this.headerCtrl.setRightBtnClick(() => {//右邊button
    });
    this.headerCtrl.setLeftBtnClick(() => {
      this.loginMethod2();
    });

    // 取用 登入資訊Storage
    const tempRem = this.localStorageService.getObj('Remember');
    if (tempRem !== null && tempRem.hasOwnProperty('userData') && tempRem.hasOwnProperty('rememberMe') && tempRem.hasOwnProperty('ftlogin')) {
      this.tcbb.fastAESDecode([tempRem.userData.custId, tempRem.userData.userId])
        .then((res_Dncode) => {
          tempRem.userData = res_Dncode;
          this.loginRemember = tempRem;
          return Promise.resolve();
        }, (error_Dncode) => {
          this._logger.debug('error_Dncode', error_Dncode);
          return Promise.resolve();
        }
        ).then((res_compare) => {
          // 取用 快入登入資訊Storage
          const tempFtData = this.localStorageService.getObj('Compare');
          if (tempFtData !== null && tempFtData.hasOwnProperty('comparecustId') && tempFtData.hasOwnProperty('compareuserId')) {
            this.tcbb.fastAESDecode([tempFtData.comparecustId, tempFtData.compareuserId]).then(
              (res_Dncode) => {
                tempFtData.comparecustId = res_Dncode.custId;
                tempFtData.compareuserId = res_Dncode.userId;
                this.ftloginRemember = tempFtData;
                this.common();
              },
              (error_Dncode) => {
                this.common();
                this._logger.debug('error_Dncode', error_Dncode);
              }
            );
          } else {
            this.common();
          }
        }, (error_compare) => {
          this._logger.debug('error_compare', error_compare);
        });
    } else {
      this.oldStorageCompilr();
    }
  }
  /**
   * 驗證表單
   * @param fieldName 欄位名稱
   */
  validate(fieldName: string) {
    if (typeof this.loginForm2 !== 'undefined') {
      const field = this.loginForm2.get(fieldName);
      return (field.touched && field.invalid);
    }
    return false;
  }
  logintopage = '';
  ngOnInit() {

    if (JSON.stringify(this.navgator.getParams()) != '{}') {
      this.infodata = this.navgator.getParams();//由上一頁點擊後取得之詳細資料
    }
    this.systemparameter.set('logintopage', this.infodata);

  }

  /**
     * localStorage 一般流程合併
     */
  common() {
    let custId = '';
    let userId = '';
    // 一般登入是否有記住我
    if (this.loginRemember.rememberMe.remcust === '1' && this.loginRemember.userData.custId !== '') {
      custId = this.loginRemember.userData.custId;
    } else {
      this.loginRemember.rememberMe.remcust = '0';
    }

    if (this.loginRemember.rememberMe.remuser === '1' && this.loginRemember.userData.userId !== '') {
      userId = this.loginRemember.userData.userId;
    } else {
      this.loginRemember.rememberMe.remuser = '0';
    }
    // this.loginForm2 = new FormGroup(
    //   {
    //     custId: new FormControl(custId, [Validators.required, CustomValidators.rangeLength([1, 12]), ValidatorcustId]),
    //     userId: new FormControl(userId, [Validators.required, CustomValidators.rangeLength([1, 16]), ValidatoruserId]),
    //     pwd: new FormControl('', [Validators.required, CustomValidators.rangeLength([1, 12]), Validatorpwd])
    //   }
    // );
    this.loginForm2.setValue({ custId: custId, userId: userId, pwd: '' });
    // 是否啟動快速登入 0 關閉 1 啟用
    if (this.loginRemember.ftlogin.fastlogin === '1') {
      // 快速登入開啟為生物辨識
      if (this.loginRemember.ftlogin.type === 'biometric') {
        this.fastLogin();
      } else if (this.loginRemember.ftlogin.type === 'pattern') {
        // TODO 圖形鎖function
      }
    }
  }

  /**
   * 一般登入
   */
  async loginMethod() {
    if (this.loginForm2.invalid) {
      // tslint:disable-next-line:forin
      for (const key in this.loginForm2.controls) {
        console.warn('this.loginForm2', this.loginForm2);
        this.loginForm2.controls[key].markAsTouched();
      }
      return;
    }
    this.loginService.login(this.loginForm2.value).then(
      (res) => {
        this.loginRemember.userData.custId = this.loginForm2.value.custId;
        this.loginRemember.userData.userId = this.loginForm2.value.userId;
        // 加密儲存到localStorage
        this.tcbb.fastAESEncode([this.loginRemember.userData.custId, this.loginRemember.userData.userId]).then(
          (res_Encode) => {
            const copy = Object.assign({}, this.loginRemember);
            copy.userData = res_Encode;
            this.localStorageService.setObj('Remember', copy);
            if (!this.showFt) {
              const copyFT = Object.assign({}, this.ftloginRemember);
              copyFT.comparecustId = res_Encode.custId;
              copyFT.compareuserId = res_Encode.userId;
              this.localStorageService.setObj('Compare', copyFT);
              // 註冊頁
              this.navgator.push('security_ftlogin_agree', {});
            } else {
              this.loginService.doAfterLogin(res, this.loginForm2.value);
            }
          },
          (error_Encode) => {
            this._logger.debug('error_Encode', error_Encode);
          }
        );
      },
      (error) => {
        this._logger.debug('loginMethod error', error);
        this.errorObj = error;
        this.errorHandler.handleError(error);
        // this.alert.show(error.content, { title: '錯誤' }).then(res => { });
      }
    );
  }

  /**
   * 快速登入
   */
  fastLogin() {
    // 快速登入啟用狀態
    if (this.loginRemember.ftlogin.fastlogin === '1') {
      // 比對快速登入資訊 與 一般登入資訊 最後登入帳號是否相同
      if (this.ftloginRemember.comparecustId !== this.loginRemember.userData.custId &&
        this.ftloginRemember.compareuserId !== this.loginRemember.userData.userId) {
        this.alert.show('您現在的ID與設定生物辨識的ID不同，請先使用原帳號作一般登入', { title: '錯誤' }).then(
          success => {
            return;
          }
        );
      } else {
        this.ftloginService.requestBioService(this.loginRemember.userData, '請將您的指紋置於感應區域上').then(
          (res) => {
            // console.warn('requestBioService success', res);
            this._logger.warn('requestBioService success', res);
            this.loginRemember.ftlogin.fastlogin = '1';
            this.loginRemember.ftlogin.type = 'biometric';
            this.setObjCommon();
            this.loginService.doAfterLogin(res, this.loginForm2.value);
          },
          (error) => {
            // console.warn('requestBioService error', error);
            this._logger.warn('requestBioService error', error);
            this.alert.show(error.msg, { title: '錯誤' }).then(
              success_check => {
                if (error.data.ret_code === '4') {
                  this.loginRemember.ftlogin.fastlogin = '0';
                  this.loginRemember.ftlogin.type = '';
                  this.setObjCommon();
                } else if (error.data.ret_code === '12') {
                  // 第一次錯誤為0次
                  this.loginErrorCount += 1;
                  if (this.loginErrorCount === 2) {
                    this.loginRemember.ftlogin.fastlogin = '0';
                    this.loginRemember.ftlogin.type = '';
                    this.loginRemember.ftlogin.pay_setting = '0';
                    this.setObjCommon();
                  }
                } else if (error.data.ret_code === 'sendFail_BI000102_ERRBI_0001') {
                  this.loginRemember.ftlogin.fastlogin = '0';
                  this.loginRemember.ftlogin.type = '';
                  this.loginRemember.ftlogin.pay_setting = '0';
                  this.setObjCommon();
                } else if (error.data.ret_code === 'sendFail_BI000102_ERRBI_0005') {
                  this.loginRemember.ftlogin.fastlogin = '0';
                  this.loginRemember.ftlogin.type = '';
                  this.ftloginRemember.comparecustId = '';
                  this.setObjCommon();
                  this.tcbb.fastAESEncode([this.ftloginRemember.comparecustId, this.ftloginRemember.compareuserId]).then(
                    (res_Encode) => {
                      const copyFT = Object.assign({}, this.ftloginRemember);
                      copyFT.comparecustId = res_Encode.custId;
                      copyFT.compareuserId = res_Encode.userId;
                      this.localStorageService.setObj('Compare', copyFT);
                    },
                    (error_Encode) => {
                      this._logger.debug('error_Encode', error_Encode);
                    }
                  );
                }
              }
            );
          }
        );
      }
    } else {
      // 快速登入關閉狀態
      this.showAgree = false;
      this.showFt = false;
    }
  }

  /**
   * 加密統一儲存
   */
  setObjCommon() {
    // 加密儲存到localStorage
    this.tcbb.fastAESEncode([this.loginRemember.userData.custId, this.loginRemember.userData.userId]).then(
      (res_Encode) => {
        const copy = Object.assign({}, this.loginRemember);
        copy.userData = res_Encode;
        this.localStorageService.setObj('Remember', copy);
      },
      (error_Encode) => {
        this._logger.debug('error_Encode', error_Encode);
      }
    );
  }

  /**
   * 從舊版app Storage資訊同步更新到新app
   * @param type 判斷同步的狀態
   */
  oldStorageCompilr() {
    // 舊版localStorage更新
    // 有註冊過快速登入，並且有開啟
    if (this.localStorageService.get('bioLogin') !== null && this.localStorageService.get('bioLogin') === '1') {
      this.loginRemember.ftlogin.fastlogin = '1';
      this.loginRemember.ftlogin.type = 'biometric';
    }
    // 有啟用付款
    if (this.localStorageService.get('pay_setting') !== null && this.localStorageService.get('pay_setting') === '1') {
      this.loginRemember.ftlogin.pay_setting = '1';
    }
    // 有記住我的name
    if (this.localStorageService.get('loginname') !== null && this.localStorageService.get('loginname') !== '') {
      this.loginRemember.userData.custId = this.localStorageService.get('loginname');
    }
    // 有記住我的user
    if (this.localStorageService.get('loginuser') !== null && this.localStorageService.get('loginuser') !== '') {
      this.loginRemember.userData.userId = this.localStorageService.get('loginuser');
    }
    // 有勾選記住我name
    if (this.localStorageService.get('isstorename') !== null && this.localStorageService.get('isstorename') === 'yes') {
      this.loginRemember.rememberMe.remcust = '1';
    }
    // 有勾選記住我user
    if (this.localStorageService.get('isstoreuser') !== null && this.localStorageService.get('isstoreuser') === 'yes') {
      this.loginRemember.rememberMe.remuser = '1';
    }
    // 有記住快速登入資料name，且資料不是空值
    if (this.localStorageService.get('comparename') !== null && this.localStorageService.get('comparename') !== '') {
      this.ftloginRemember.comparecustId = this.localStorageService.get('comparename');
    }
    // 有記住快速登入資料user，且資料不是空值
    if (this.localStorageService.get('compareuser') !== null && this.localStorageService.get('compareuser') !== '') {
      this.ftloginRemember.compareuserId = this.localStorageService.get('compareuser');
    }
    this.tcbb.fastAESDecode([this.loginRemember.userData.custId, this.loginRemember.userData.userId]).then(
      (res_Dncode) => {
        this.loginRemember.userData.custId = res_Dncode.custId;
        this.loginRemember.userData.userId = res_Dncode.userId;
        return Promise.resolve;
      },
      (error_Dncode) => {
        this.common();
        this._logger.debug('error_Dncode', error_Dncode);
      }
    ).then(
      (res_compare) => {
        this.tcbb.fastAESDecode([this.ftloginRemember.comparecustId, this.ftloginRemember.compareuserId]).then(
          (res_Dncode) => {
            this.ftloginRemember.comparecustId = res_Dncode.custId;
            this.ftloginRemember.compareuserId = res_Dncode.userId;
            this.common();
          },
          (error_Dncode) => {
            this._logger.debug('error_Dncode', error_Dncode);
            this.common();
          }
        );
      },
      (error_compare) => {
        this.common();
      }
    );
  }

  /**
   * 返回前一頁
   */
  cancel() {
    this.navgator.pop();
  }


  /**
   * 切換input 密碼與文字切換
   * @param type 類別
   */
  switchSee(type) {
    switch (type) {
      case 'seecust':
        this.seeObj.seecust = !this.seeObj.seecust;
        break;

      case 'seeuser':
        this.seeObj.seeuser = !this.seeObj.seeuser;
        break;

      case 'seepwd':
        this.seeObj.seepwd = !this.seeObj.seepwd;
        break;
    }
  }

  /**
   * 記住我開關
   * @param type type
   */
  remember(type) {
    switch (type) {
      case 'remcust':
        if (this.loginRemember.rememberMe.remcust === '0') {
          this.loginRemember.rememberMe.remcust = '1';
        } else {
          this.loginRemember.rememberMe.remcust = '0';
        }
        break;

      case 'remuser':
        if (this.loginRemember.rememberMe.remuser === '0') {
          this.loginRemember.rememberMe.remuser = '1';
        } else {
          this.loginRemember.rememberMe.remuser = '0';
        }
        break;
    }
  }

  /**
   * 登入
   */
  loginMethod2() {
    this.navgator.push('a11yhomekey');
  }
  /**
   * 取消登入回首頁
   */
  cancellogin() {
    this.navgator.push(this.navgator.getHistory()[this.navgator.getHistoryLength() - 2]);
  }

  onEnter(elementId: string) {
    if (elementId === 'custId') {
      this.userIdInput.nativeElement.focus();
    } else if (elementId === 'userId') {
      this.pwdInput.nativeElement.focus();
    } else {
      document.getElementById('login').focus();
      this.loginMethod();
    }
  }
}
