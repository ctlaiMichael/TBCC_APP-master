import { Component, OnInit } from '@angular/core';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AuthService } from '@core/auth/auth.service';
import { A11yConfirmService } from '@shared/popup/a11y/confirm/confirm.service';
import { securityManageService } from '@pages/user-set/shared/service/security-manage.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { Logger } from '@core/system/logger/logger.service';

@Component({
  selector: 'app-change-name-a11y-page',
  templateUrl: './change-name-a11y-page.component.html',
  styleUrls: []
})
export class ChangeNameA11yPageComponent implements OnInit {
  //標頭
  obj = {
    style: 'normal_a11y',
    showMainInfo: false,
    leftBtnIcon: 'back',
    rightBtnIcon: 'noshow',
    title: '代號變更',
    backPath: 'a11ysettingmenutkey'
  };
  //request需要
  usercode = {
    "OLD_CODE": "",
    "NEW_CODE": "",
    "USER_PSWD": "",
    "USER_NOID": ""
  };
  //頁面上的欄位
  public userInput = {
    "newcode": "",
    "userpw": ""
  }
  //check error
  errorMsg: any = { 'newcode': '', 'netpswd': '' };

  resultFlag = false;

  //變更結果
  result =
    {
      header: '代號變更',
      changenameresult: 'success',
      msg: '您已完成使用者代號變更'
    }


  constructor(private headerCtrl: HeaderCtrlService,
    private _logger: Logger,
    private router: Router,
    private _mainService: securityManageService,
    private _handleError: HandleErrorService,
    private a11yconfirm: A11yConfirmService,
    private navgator: NavgatorService,
    private authService: AuthService
  ) {
    this.headerCtrl.setOption(this.obj);
    this.headerCtrl.setLeftBtnClick(() => {
      //this.backtohome();
      this.cancelEdit();
    });
  }

  ngOnInit() {
    const userData = this.authService.getUserInfo();

    // 身分證
    this._logger.debug(userData);
    if (!userData.hasOwnProperty("custId") || userData.custId == '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    this.usercode.USER_NOID = userData.custId;
    this.getUserId();

    this.headerCtrl.setLeftBtnClick(() => {
      this.cancelEdit();
    });

  }


  //跳出popup是否返回
  cancelEdit() {
    this.a11yconfirm.show('您是否放棄此次編輯?', {
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
        this.usercode.OLD_CODE = res;
      },
      (errorObj) => {
        //!!!errorHandler
        errorObj['type'] = 'message';
        this._handleError.handleError(errorObj);
      });
  }
  //參數依序為 舊網路連線代號、新網路連線代號、連線密碼
  checkEvent() {

    let inputObj = [this.userInput.newcode, this.userInput.userpw];   //新使用者代碼、登入密碼
    let systemObj = [this.usercode.USER_NOID, this.usercode.OLD_CODE];  //身分證字號、舊代碼
    const check_obj = this._mainService.checkNetCodeChg(inputObj, systemObj);
    if (check_obj.status) {
      this.usercode.NEW_CODE = this.userInput.newcode;
      this.usercode.USER_PSWD = this.userInput.userpw;
      this._logger.debug('目前檢驗成功');
      this.sendUserData(this.usercode);
      this.errorMsg = {};
    } else {
      this.errorMsg = check_obj.error_list;
      this._logger.debug('errormsg', this.errorMsg, check_obj.error_list);
    }

  }
  // getUSERID(): Promise<any> {
  // }
  sendUserData(usercode): Promise<any> {
    return this._mainService.sendNetCodeChg(usercode).then(
      (res) => {
        if (res && res.result == '0') {
          this.resultFlag = true;
          this.authService.setUserInfo(this.authService.getUserInfo(), this.userInput.newcode);
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
  toresult() {
    this.navgator.push('a11yresultkey');
  }

}
