import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { SecurityService } from '@pages/security/shared/service/security.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ROUTING_PATH } from '@conf/menu/routing-path';
import { logger } from '@shared/util/log-util';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { ActivatedRoute } from '@angular/router';
import { SessionStorageService } from '@lib/storage/session-storage.service';
@Component({
  selector: 'app-fastlogin-set',
  templateUrl: './fastlogin-set.component.html',
  styleUrls: ['./fastlogin-set.component.css']
})
export class FastloginSetComponent implements OnInit {

  constructor(
    private localStorageService: LocalStorageService,
    private headerCtrl: HeaderCtrlService,
    private securityservice: SecurityService,
    private confirm: ConfirmService,
    private navgator: NavgatorService,
    private alert: AlertService,
    private navigator: NavgatorService,
    private confirmService: ConfirmService,
    private alertService: AlertService,
    private handleError: HandleErrorService,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private sessionStorageService: SessionStorageService
  ) {
    const routingPath = ROUTING_PATH['security_ftlogin_set'];
    this.headerCtrl.setOption(routingPath.header);
  }

  // 開關資訊物件
  check = {
    ftlogin: false,
    hasPatternLock: false, // 圖形密碼
    taiwanpay: false,
    payPattern: false // 交易使用圖形密碼
  };

  ngOnInit() {

    let type;
    this.route.queryParams.subscribe(params => {
      if (params.hasOwnProperty('type')) {
        // set data
        type = '1';
      } else {
        type = '2';
      }
    });
    let loginmethod = this.sessionStorageService.getObj('login_method');
    this.headerCtrl.setLeftBtnClick(() => {
      if (loginmethod && loginmethod == '2') {
        this.navgator.push('epay-card');
      } else {
        if (type == '1') {
          this.navgator.back();
        } else {
          this.navgator.push('user-set');
        }
      }
    });



    const tempFtData = this.localStorageService.getObj('Compare');
    const tempRem = this.localStorageService.getObj('Remember');
    //新增信用卡
    const tempFtData_card = this.localStorageService.getObj('Compare_card');
    const tempRem_card = this.localStorageService.getObj('Remember_card');
    //前四行為信卡or網銀會員的localstroage Remember/Compare相符 && 註冊過的custId 網銀與信卡相同
    if ((loginmethod=='1'&& tempRem && tempFtData && tempFtData.comparecustId === tempRem.userData.custId&&tempFtData.compareuserId === tempRem.userData.userId)
    ||(loginmethod=='2'&& tempRem_card && tempFtData.comparecustId==tempRem_card.userData.custId)) {
      logger.debug(JSON.stringify(tempRem));
      if (tempRem.ftlogin.fastlogin === '1') {
        this.check.ftlogin = true;
      }
      if (tempRem.ftlogin.pay_setting === '1') {
        this.check.taiwanpay = true;
      }
      if (tempRem.ftlogin.hasPatternLock === '1') {
        this.check.hasPatternLock = true;
      }
      if (tempRem.ftlogin.payPattern === '1') {
        this.check.payPattern = true;
      }
      this.securityservice.taiwanError.subscribe((display: boolean) => {
        this.check.taiwanpay = false;
      });
      logger.error('ftinit if', this.check);
      // this.alertService.show("PG_SECURITY.PATTERN_LOCK.CANCEL_FAIL");
    } else {
      // 不同帳號先不清空localstorage，等到強制綁定點擊確定後再更新localstorage
      // const loginRemember = this.localStorageService.getObj('Remember');
      // loginRemember.ftlogin.pay_setting = '0';
      // loginRemember.ftlogin.fastlogin = '0';
      // loginRemember.ftlogin.hasPatternLock = '0';
      // loginRemember.ftlogin.payPattern = '0';
      // this.localStorageService.setObj('Remember', loginRemember);
      this.check.taiwanpay = false;
      this.check.hasPatternLock = false;
      this.check.ftlogin = false;
      this.check.payPattern = false;
      //card user
      const tempFtData_card = this.localStorageService.getObj('Compare_card');
      const tempRem_card = this.localStorageService.getObj('Remember_card');
      if (this.sessionStorageService.getObj('login_method') == '2' &&
        tempFtData_card && tempRem_card &&
        (tempFtData_card.comparecustId === tempRem_card.userData.custId &&
          tempFtData_card.compareuserId === tempRem_card.userData.userId)) {
        if (tempRem.ftlogin.fastlogin === '1') {
          this.check.ftlogin = true;
        }
        if (tempRem.ftlogin.pay_setting === '1') {
          this.check.taiwanpay = true;
        }
        if (tempRem.ftlogin.hasPatternLock === '1') {
          this.check.hasPatternLock = true;
        }
        if (tempRem.ftlogin.payPattern === '1') {
          this.check.payPattern = true;
        }
      }
    }
    //新增信用卡
    // const tempFtData_card = this.localStorageService.getObj('Compare_card');
    // const tempRem_card = this.localStorageService.getObj('Remember_card');
    if ((loginmethod == '2' && tempRem_card && tempFtData_card && tempRem_card.userData.custId !== tempFtData_card.comparecustId) ||
      (loginmethod == '1' && tempFtData && tempRem && tempRem.userData.custId !== tempFtData.comparecustId)) {
      this.check.ftlogin = false;
      this.check.taiwanpay = false;
      this.check.hasPatternLock = false;
      this.check.payPattern = false;
    }
    // [check user agent] 20191021 by wei
    if (this.check.ftlogin || this.check.taiwanpay) {
      let check_allow = this.checkAllowBio();
      if (!check_allow) {
        this.check.taiwanpay = false;
        this.check.ftlogin = false;
      }
    }

    this.ref.detectChanges();
  }

  /**
   * 點擊快速登入開關
   */
  ftClick() {
    this.check.ftlogin = !this.check.ftlogin;
    if (this.check.ftlogin === true) {

      // [check user agent] 20191021 by wei
      let check_allow = this.checkAllowBio();
      if (!check_allow) {
        setTimeout(() => {
          this.check.ftlogin = false;
        }, 500);
        return;
      }

      this.navgator.push('security_ftlogin_agree', {});
      // this.securityservice.submitFtligon().then(
      //   success => {
      //     logger.debug('Ftligon submit success');
      //   },
      //   error => {
      //     logger.debug('Ftligon submit error', error);
      //     this.check.ftlogin = false;
      //   }
      // );
    } else {
      let taipay = this.check.taiwanpay;
      this.check.taiwanpay = false;
      this.securityservice.cancelftLogin().then(
        success => {
          logger.debug('Ftlogin close success', success);
          this.check.taiwanpay = false;
          // this.securityservice.cancelTaiwan().then(
          //   (sus) => {
          //     logger.debug('2Taiwan cancel success', sus);
          //   },
          //   (err) => {
          //     logger.debug('2Taiwan cancel error', err);
          //     this.check.taiwanpay = false;
          //   }
          // );

          // 快速登入就會就會清掉epay,不用在發一次cancelTaiwan() 20191204
          if (!!success.hostCodeMsg && String(success.hostCodeMsg).indexOf('尚未註冊') > -1) {
            this.noRegister();
          }
        },
        error => {
          logger.debug('Ftlogin close error', error);
          this.check.ftlogin = true;
          if (taipay) {
            this.check.taiwanpay = false;
          }
        }
      );
    }
  }
  /**
   * 點擊台灣pay交易
   */
  taiwanpayClick() {
    this.check.taiwanpay = !this.check.taiwanpay;
    let secObj;
    if (this.check.taiwanpay === true) {

      // [check user agent] 20191021 by wei
      let check_allow = this.checkAllowBio();
      if (!check_allow) {
        setTimeout(() => {
          this.check.taiwanpay = false;
        }, 500);
        return;
      }

      // const loginRemember = this.localStorageService.getObj('Remember');
      // if (loginRemember.ftlogin.fastlogin !== '1') {
      //   this.alert.show('請先進行快速登入(指紋/臉部)設定').then(() => { this.check.taiwanpay = false; });
      //   return;
      // }
      // this.confirm.show('您將啟用指紋/臉部辨識功能作為台灣Pay交易驗證', {
      //   title: '台灣Pay交易設定'
      // }).then(
      //   () => {
      //     this.check.taiwanpay = false;
      //     // 確定
      //     this.securityservice.submitTaiwan().then(
      //       success => {
      //         logger.debug('Taiwan submit success');
      //         if (!!success.hostCodeMsg && String(success.hostCodeMsg).indexOf('尚未註冊') > -1) {
      //           this.noRegister();
      //         } else {
      //           this.check.taiwanpay = true;
      //         }
      //       }
      //     ).catch(err => {
      //       this.check.taiwanpay = false;
      //       logger.debug('Taiwan submit error', err);
      //     });
      //   },
      //   () => {
      //     // 取消
      //     this.check.taiwanpay = false;
      //   }
      // );
      this.securityservice.checkPayPatternBio('bio')
        .then((res) => {
          secObj = res;
          this.confirm.show('您將啟用指紋/臉部辨識功能作為台灣Pay交易驗證', {
            title: '台灣Pay交易設定'
          }).then(
            () => {
              this.check.taiwanpay = false;
              // 確定
              this.securityservice.submitTaiwan(secObj).then(
                success => {
                  logger.debug('Taiwan submit success');
                  if (!!success.hostCodeMsg && String(success.hostCodeMsg).indexOf('尚未註冊') > -1) {
                    this.noRegister();
                  } else {
                    this.check.taiwanpay = true;
                  }
                }
              ).catch(err => {
                this.check.taiwanpay = false;
                logger.debug('Taiwan submit error', err);
              });
            },
            () => {
              // 取消
              this.check.taiwanpay = false;
            }
          ).catch(() => {
            this.check.taiwanpay = false;
          });
        })
        .catch(() => {
          this.check.taiwanpay = false;
        });

    } else {

      this.securityservice.cancelTaiwan().then(
        success => {
          this.check.taiwanpay = false;
          logger.debug('Taiwan cancel success');
          if (!!success.hostCodeMsg && String(success.hostCodeMsg).indexOf('尚未註冊') > -1) {
            this.noRegister();
          }
        },
        error => {
          logger.debug('Taiwan cancel error', error);
          this.check.taiwanpay = false;
        }
      );
    }
  }

  /**
   * 點擊 圖形密碼
   */
  patternlockClick() {
    this.check.hasPatternLock = !this.check.hasPatternLock;
    if (this.check.hasPatternLock) {
      setTimeout(() => {
        this.navigator.push('security_patternlock_preface'); // 同意條款
      }, 300);
    } else {
      this.securityservice.cancelPatternLock().then(
        (resObj) => {
          let alertContent: string;
          this.check.payPattern = false;
          if (resObj.trnsRsltCode === '0') { // 取消成功
            logger.debug('patternlockClick cancel success', resObj);
          } else {
            logger.debug('patternlockClick cancel trnsRsltCode !== "0"', resObj);
            if (String(resObj.hostCodeMsg).indexOf('尚未註冊') > -1) {
              this.noRegister();
            } else {
              alertContent = resObj.hostCodeMsg; // 主機代碼訊息
              this.alertService.show(alertContent);
            }
          }
        },
        (errObj) => {
          logger.debug('patternlockClick cancel fail', errObj);
          this.handleError.handleError(errObj);
        }
      );
    }
  }


  /**
   * check allow
   * [check user agent] 20191021 by wei
   */
  private checkAllowBio() {
    let check_allow = this.securityservice.checkAllowDevice();
    let allow = check_allow.allow;
    if (!allow) {
      this.handleError.handleError(check_allow.error);
    }
    return allow;
  }

  /**
 * 點擊 台灣Pay交易(圖形密碼)
 */
  payPatternClick() {
    this.check.payPattern = !this.check.payPattern;
    let secObj;
    if (this.check.payPattern) { // 啟用圖形密碼交易
      this.securityservice.checkPayPatternBio('pattern')
        .then((res) => {
          secObj = res;
          this.confirm.show('您將啟用圖形密碼功能作為台灣Pay交易驗證', {
            title: '台灣Pay交易設定'
          }).then(() => {
            this.securityservice.set_PayPattern(secObj)
              .then((resObj) => {
                if (!!resObj.trnsRsltCode && resObj.trnsRsltCode === '0') {
                  this.alert.show('下次交易即可以使用圖形密碼驗證交易', { title: '台灣Pay交易設定成功' });
                  this.check.payPattern = true;
                } else {
                  if (String(resObj.hostCodeMsg).indexOf('尚未註冊') > -1) {
                    this.noRegister();
                  } else {
                    this.check.payPattern = false;
                  }
                }
              }, () => {
                this.check.payPattern = false;
              });
          }).catch(() => {
            this.check.payPattern = false;
          });
        })
        .catch(() => {
          this.check.payPattern = false;
        });
    } else { // 停用圖形密碼交易
      this.securityservice.cancel_PayPattern().then(
        (resObj) => {
          let alertContent: string;
          if (!!resObj.trnsRsltCode && resObj.trnsRsltCode === '0') {
            // this.check.payPattern = false;
            logger.debug('payPatternClick cancel success', resObj);
          } else {
            // this.check.payPattern = true;
            logger.debug('payPatternClick cancel fail', resObj);
            if (String(resObj.hostCodeMsg).indexOf('尚未註冊') > -1) {
              this.noRegister();
            } else {
              alertContent = resObj.hostCodeMsg; // 主機代碼訊息
              this.alertService.show(alertContent);
            }
          }
        }
      ).catch(() => {
        this.check.payPattern = true;
      });
    }
  }

  noRegister() {
    const beforeFlag = this.localStorageService.getObj('beforeClearBioPatternFlag');
    if (!!beforeFlag && beforeFlag === '1') {
      this.alert.show('此帳號已於其它裝置啟用快速登入，將解除舊裝置快速登入設定');
      this.localStorageService.setObj('beforeClearBioPatternFlag', '');
    }
    this.check.taiwanpay = false;
    this.check.hasPatternLock = false;
    this.check.ftlogin = false;
    this.check.payPattern = false;
  }
}
