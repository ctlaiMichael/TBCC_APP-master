/**
 * 我的願望清單
 */
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { FundKYCService } from '@pages/fund/shared/service/fund-KYC.service';


@Component({
  selector: 'app-safe-check-page',
  templateUrl: './safe-check-page.component.html',
  styleUrls: [],

})
export class SafeCheckPageComponent implements OnInit {

  showPage = 'personal-capital';
  firstKYC = '';
  info_data;
  data;
  baseData = {};
  //================安控==================//
  // security = {
  //   "USER_SAFE": '',
  //   "SEND_INFO": ''
  // };
  // //安控傳參
  // transactionObj = {
  //   serviceId: 'FI000604',
  //   categoryId: '6',
  //   transAccountType: '1',
  // };

  // safeE: any;
  // securityObj = {
  //   'action': 'init',
  //   'sendInfo': ''
  // }

  safeType = '';
  safeArr = [];
  safeTypeEmpty = false;
  //================安控End===============//


  constructor(
    private _logger: Logger
    , private router: Router
    , private navgator: NavgatorService
    , private _authService: AuthService
    , private _handleError: HandleErrorService
    , private _headerCtrl: HeaderCtrlService
    , private _checkSecurityService: CheckSecurityService
    , private _mainService: FundKYCService

  ) {
  }

  ngOnInit() {
    // this.securityObj = {
    //   'action': 'init',
    //   'sendInfo': this.security.SEND_INFO
    // }
    //fi000603

    this._headerCtrl.updateOption({
      'leftBtnIcon': 'back',
    });
    this._headerCtrl.setLeftBtnClick(() => {
      this.changePage('fund');
    });
  }

  securutyCheck() {
    if (this.safeType == '') {
      this.safeTypeEmpty = true;
    } else {
      this.safeTypeEmpty = false;
    }
    if (!this.safeTypeEmpty) {
      this.showPage = 'base-data';
    }
  }

  //=======================推頁、output返回=============================//

  //個資條款頁確認
  onBackPage(e) {
    this._logger.log('onBackPage', e);
    if (e.data == true) {


      this._mainService.getData().then(
        (resObj) => {
          this._logger.log('resresres603', resObj);
          this.firstKYC = resObj.info_data.isFirstKYC;
          this.info_data = resObj.info_data;
          this.data = resObj.data;
          if (this.firstKYC == 'Y') {
            //第一次
            this._logger.log('safeArr', this.safeArr);
            //憑證
            if (this._authService.checkDownloadCA()) {
              this.safeArr.push('2')
            }
            //OTP
            let otpInfo = this._authService.getOtpUserInfo();
            let otpCanNot = otpInfo.checkKycOtp();
            this._logger.log('otpCanNot', otpCanNot);
            if (otpCanNot) {
              this.safeArr.push('3');
            }

            if (this.safeArr.length > 0) {
              this._logger.log('this.safeArr', this.safeArr);

              this.showPage = 'safe-check';
            } else {
              this._logger.log('error length safeArr')
              this._handleError.handleError({
                type: 'dialog',
                title: '提醒您',
                content: "您的行動裝置無合庫行動網銀轉帳機制，請洽營業單位申請。"
              });
              // this.navgator.push('fund');
            }
          } else {
            this._logger.log('this.firstKYC == N');
            this.showPage = 'base-data';
          }
        },
        (errorObj) => {
          console.error('errorObj',errorObj)
          if(!errorObj['content']){
            errorObj['content']='很抱歉，目前無法取得測驗題目，請稍後再試!如造成您的困擾，敬請見諒。若有其他疑問，請聯繫客服中心。'
          }
          errorObj['type'] = 'message';
          this._handleError.handleError(errorObj);
        });



    } else {
      this.navgator.push('fund');
    }
  }
  //填寫個人基本資料頁確認
  onBackBaseData(e) {
    this._logger.log('onBackBaseData', e);
    this.baseData = e;
    if (e.step == 'next') {
      this.showPage = 'reskTest';
    } else if (e.step == 'prev') {
      this.showPage = 'safe-check';
    }
  }

  //點選取消
  cancelBack() {
    this.navgator.push('fund');
  }
  //左上角返回
  changePage(page) {
    this._logger.log('page', page);
    if (page == 'fund') {
      this.navgator.push('fund');
    } else if (page == 'safe-check') {
      this.showPage = 'safe-check';
      this._headerCtrl.setLeftBtnClick(() => {
        this.changePage('personal-capital');
      });
    } else if (page == 'base-data') {
      this.showPage = 'base-data';
    } else if (page == 'personal-capital') {
      this.showPage = 'personal-capital';
      this._headerCtrl.setLeftBtnClick(() => {
        this.changePage('fund');
      });
    }
  }
  //========================推頁、output返回End===========================//
  //========================安控=========================================//
  // securityOptionBak(e) {
  //   if (e.status) {
  //     // 取得需要資料傳遞至下一頁子層變數
  //     this.security.SEND_INFO = e.sendInfo;
  //     this.security.USER_SAFE = e.sendInfo.selected;
  //     this.securityObj = {
  //       'action': 'init',
  //       'sendInfo': e.sendInfo
  //     };
  //   } else {
  //     // do errorHandle 錯誤處理 推業或POPUP
  //     e.ERROR['type'] = 'message';
  //     this._handleError.handleError(e.ERROR);
  //   }
  // }
  //========================安控End======================================//

}
