import { Component, OnInit } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { securityManageService } from '@pages/user-set/shared/service/security-manage.service';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { A11yConfirmService } from '@shared/popup/a11y/confirm/confirm.service';

@Component({
  selector: 'app-change-pwd-a11y-page',
  templateUrl: './change-pwd-a11y-page.component.html',
  styleUrls: []
})
export class ChangePwdA11yPageComponent implements OnInit {
  //標頭
  obj = {
    style: 'normal_a11y',
    showMainInfo: false,
    leftBtnIcon: 'back',
    rightBtnIcon: 'noshow',
    title: '密碼變更',
    backPath: 'a11yhomekey'
  };
  //request需要
  private userpw = {
    "OLD_PSWD": "",
    "NEW_PSWD": "",
    "CNFM_PSWD": "",
    "USER_ID": "",
    "USER_CODE": ""
  };
  //頁面上的欄位
  public userInput = {
    "oldPw": "",
    "newPw": "",
    "checkPw": ""
  }
  //check error
  errorMsg: any = { 'oldpwd': '', 'newpwd': '', 'checkpwd': '' };
  //結果頁訊息
  resultFlag = false;

  //變更結果
  result =
    {
      header: '密碼變更',
      changenameresult: 'success',
      msg: '您已完成使用者密碼變更'
    }
  constructor(
    private headerCtrl: HeaderCtrlService,
    private _logger: Logger,
    private _mainService: securityManageService,
    public authService: AuthService,
    private _handleError: HandleErrorService,
    private _headerCtrl: HeaderCtrlService,
    private confirm: A11yConfirmService,
    private navgator: NavgatorService
  ) {

    this.headerCtrl.setOption(this.obj);
    this.headerCtrl.setLeftBtnClick(() => {
      //this.backtohome();
      this.cancelEdit();
    });
  }

  ngOnInit() {
    const userData = this.authService.getUserInfo();

    this._logger.debug(userData);
    if (!userData.hasOwnProperty("custId") || userData.custId == '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }

    this.userpw.USER_ID = userData.custId;
    this._logger.debug(this.userpw.USER_ID);

    // 使用者代碼
    this.getUserId();

    this._headerCtrl.setLeftBtnClick(() => {
      this.cancelEdit();
    });
  }
  //跳出popup是否返回
  cancelEdit() {
    this.confirm.show('您是否放棄此次編輯?', {
      title: '提醒您'
    }).then(
      () => {
        //確定
        this.navgator.push('a11ysettingmenutkey');
      },
      () => {

      }
    );
  }

  //取得使用者代碼
  getUserId(): Promise<any> {
    return this.authService.getUserId().then(
      (res) => {
        this._logger.debug('getUserId', res);
        this.userpw.USER_CODE = res;
      },
      (errorObj) => {
        errorObj['type'] = 'message';
        this._handleError.handleError(errorObj);
      });
  }
  checkEvent() {

    let pwdObj = [this.userInput.oldPw, this.userInput.newPw, this.userInput.checkPw];
    let systemObj = [this.userpw.USER_ID, this.userpw.USER_CODE]; //身分證字號、使用者代碼
    const check_obj = this._mainService.checkPasswordChg(pwdObj, systemObj);

    //格式正確
    if (check_obj.status) {
      this.userpw.OLD_PSWD = this.userInput.oldPw;
      this.userpw.NEW_PSWD = this.userInput.newPw;
      this.userpw.CNFM_PSWD = this.userInput.checkPw;
      this.sendUserData(this.userpw);
    } else {
      this.errorMsg = check_obj.error_list;
    }

  }

  /**
  * 確認送出資料
  */

  sendUserData(userpw): Promise<any> {
    return this._mainService.sendPswdChg(userpw).then(
      (res) => {
        if (res && res.result == '0') {
          this.resultFlag = true;
          this.navgator.push('a11yresultkey', this.result);
        }
      },
      (errorObj) => {
        this._logger.debug('errorObj:', errorObj);
        errorObj['type'] = 'message';
        this._handleError.handleError(errorObj);
        this.result.changenameresult = 'fail';
        this.result.msg = errorObj['content'];

        this.navgator.push('a11yresultkey', this.result);

      })
  }
}
