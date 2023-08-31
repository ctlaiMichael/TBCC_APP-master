import { Injectable } from '@angular/core';
import { F1000101ApiService } from '@api/f1/f1000101/f1000101-api.service';
import { F1000101ReqBody } from '@api/f1/f1000101/f1000101-req';
import { FG000501ApiService } from '@api/fg/fg000501/fg000501-api.service';
import { FG000501ReqBody } from '@api/fg/fg000501/fg000501-req';
import { AuthService } from '@core/auth/auth.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { SystemParameterService } from '@core/system/system-parameter/system-parameter.service';
import { TcbbService } from '@lib/plugins/tcbb/tcbb.service';
import { CertService } from '@lib/plugins/tcbb/cert.service';
import { CertificateService } from '@pages/security/shared/service/certificate.service';
import { StringCheckUtil } from '@shared/util/check/string-check-util';
import { FormateService } from '@shared/formate/formate.service';
import { logger } from '@shared/util/log-util';
import { PushService } from '@lib/plugins/push.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { HandleErrorOptions } from '@core/handle-error/handlerror-options';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { A11yConfirmService } from '@shared/popup/a11y/confirm/confirm.service';
import { A11yAlertService } from '@shared/popup/a11y/alert/alert.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { SecurityService } from '@pages/security/shared/service/security.service';
import { environment } from '@environments/environment';
import { FC000303ApiService } from '@api/fc/fc000303/fc000303-api.service';
import { FC000303ReqBody } from '@api/fc/fc000303/fc000303-req';
import { SessionStorageService } from '@lib/storage/session-storage.service';
@Injectable()
export class LoginService {
    appMode = {isA11y: false};
    isa11y = false;
    logintopage = 'a11yhomekey';
    constructor(
        private F1000101: F1000101ApiService,
        private FC000303: FC000303ApiService, 
        private FG000501: FG000501ApiService,
        private auth: AuthService,
        private navgator: NavgatorService,
        private alert: AlertService,
        private confirm: ConfirmService,
        private tcbb: TcbbService,
        private systemparameter: SystemParameterService,
        private cert: CertService,
        private certUpdate: CertificateService,
        private _formateService: FormateService,
        private push: PushService,
        private errorHandler: HandleErrorService,
        private headerCtrl: HeaderCtrlService,
        private a11yalert: A11yAlertService,
        private a11yconfirm: A11yConfirmService,
        private _localStorage: LocalStorageService,
        private securityService: SecurityService,
        private session: SessionStorageService,
    ) {
        this.appMode = this._localStorage.getObj('appMode');
        this.isa11y = this.appMode.isA11y;
    }


    /**
     * 一般登入
     * @param obj 使用者輸入資料
     */
    async login(obj) {
        // 無障礙登入轉導頁參數
        if (!!this.systemparameter.get('logintopage')) {
        this.logintopage = this.systemparameter.get('logintopage');
        } else {
          this.logintopage = 'a11yhomekey';
        }

        const res = await this.auth.digitalEnvelop(obj.pwd);
        const form = new F1000101ReqBody();
        form.userId = obj.userId.toUpperCase();
        form.custId = obj.custId;
        form.password = res.value;
        if (obj.pwd.length < 8) {
            form.lessPwdLength = 'Y';
        }
        // 取cn
        const res_cn = await this.tcbb.setF1000102Data({ nbCert: this.auth.nbCert }, obj.custId, obj.userId);
        logger.debug('res_cn', res_cn);
        logger.debug(JSON.stringify(res_cn));
        if (res_cn.cn.indexOf(obj.custId) <= -1) {
            res_cn.cn = '';
            res_cn.sn = '';
        }
        let reqHeader = {
            header: { cn: res_cn.cn }
        };
        const f1000101res = await this.F1000101.send(form, reqHeader);
        // 儲存資料
        this.auth.setUserInfo(f1000101res.body, obj.userId);
        this.auth.setCn(res_cn.cn, res_cn.sn);
        this.auth.initTimer();
        if (form.lessPwdLength === 'Y') {
          // 若啟用無障礙，套用無障礙樣式
        //   await ((!!this.isa11y) ? this.a11yalert.show('POPUP.LOGIN.PWD_TOO_SHORT')
        //   : this.alert.show('POPUP.LOGIN.PWD_TOO_SHORT'));
        }
        return f1000101res.body;
    }
/**
     * 信用卡登入
     */
    async card_login(obj) {
        // 無障礙登入轉導頁參數
        if (!!this.systemparameter.get('logintopage')) {
        this.logintopage = this.systemparameter.get('logintopage');
        } else {
          this.logintopage = 'a11yhomekey';
        }
        // await this.tcbb.setF1000102Data({ nbCert: this.auth.nbCert }, obj.custId, obj.userId);
        const res = await this.auth.digitalEnvelop(obj.pwd);
        const form = new FC000303ReqBody();
        form.custId = obj.custId;
        form.userId = obj.userId.toUpperCase();
        form.password = res.value;

        const fc000303res = await this.FC000303.send(form);
        logger.error('fc000303res',fc000303res);
        // if(fc000303res){
        //     this.errorHandler.handleError({
        //         type: 'dialog',
        //         content: fc000303res.value.failure.debugMessage?fc000303res.value.failure.debugMessage:""
        //       })
        //       return false;
        // }
        if (!!fc000303res && !!fc000303res.body && fc000303res.body.result == '0'){
        this.session.setObj('userInfo', {
            custId:obj.custId,
            userId:obj.userId.toUpperCase(),
            isLogin:true,
            loginCardUser:true,
            sessionId:fc000303res.body.sessionId
        });
        this.auth.initTimer();
        }
        return fc000303res.body;
    }
    /**
     * 清除登入導頁到舊版暫存資訊
     */
    cleanRedirect() {
        sessionStorage.removeItem('redirect');
        sessionStorage.removeItem('redirectToOld');
    }

    /**
     * 網銀開通
     * @param obj custid obj
     */
    enableMobileBank(obj): Promise<any> {
        return new Promise((resolve, reject) => {
            const form = new FG000501ReqBody();
            form.custId = obj.custId;
            this.FG000501.send(form)
                .then((fg000501res) => {
                    if (!!fg000501res && !!fg000501res.body && fg000501res.body.result === '0') {
                        resolve();
                    } else {
                        let err = new HandleErrorOptions('開通失敗');
                        reject(err);
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    /**
     * push setPushGuid
     */
    private pushSetPushGuid(res) {
        logger.debug('pushSetPushGuid');
        let arg = [];
        if (!!res.custId && !!res.pushGuid) {
            arg.push(res.custId);
            arg.push(res.pushGuid);
            return new Promise((resolve, reject) => {
                this.push.setPushGuid(arg)
                    .then(res => {
                        logger.debug('push setPushGuid res:' + JSON.stringify(res));
                    })
                    .catch(err => {
                        logger.debug('push setPushGuid err:' + JSON.stringify(err));
                    });
            });
        }
    }

    /**
   * 登入後程序
   * @param data101 登入成功資料
   */
    doAfterLogin(data101, loginForm) {
        this.headerCtrl.updateRightSecBadge();
        logger.debug('loginProcess', data101);
        this.pushSetPushGuid(data101);
        this.checkDeviceAllow().then(
        () => { // checkDeviceAllow start

        if (data101.validateResult !== '') {
            if (data101.isMobileFlag === '0') {
                const content = '親愛的客戶您好：\n'
                    + '您尚未開通本行行動網銀服務，若欲使用本項服務，請於閱讀下列注意事項後，點擊同意並開通按鈕，即可以網路銀行連線代號及密碼登入使用行動網銀查詢功能。\n\n'
                    + '注意事項：\n'
                    + '1.完成開通作業後，即可以網路銀行連線代號及密碼登入使用行動網銀查詢功能，若需使用交易（轉帳、繳費稅等）或設定（常用帳號設定等）功能，請先洽本行營業單位申請行動網銀憑證並開啟相關交易功能才可使用。\n'
                    + '2.網路銀行及行動網銀登入密碼錯誤連續達5次將暫停連線查詢服務，需回本行營業單位辦理密碼重設後才可繼續使用。';
                  // 若啟用無障礙，套用無障礙樣式
                  ((!!this.isa11y) ? this.a11yconfirm : this.confirm)
                    .show(content, {
                    title: '開通行動網銀',
                    btnYesTitle: '同意並開通',
                    btnNoTitle: '取消'
                }).then(() => {
                    // 同意開通並導頁至ssl密碼變更
                    this.enableMobileBank(loginForm).then(
                        res => {
                            // 開通成功導向SSL密碼變更
                            this.cleanRedirect();
                            // 若啟用無障礙，轉跳至無障礙變更SSL密碼功能
                            if (!!this.isa11y) {
                              this.navgator.push('a11ychangesslpwdkey');
                            } else {
                            this.navgator.push('sslChg');
                        }
                        }
                    ).catch(err => {
                      // 若啟用無障礙，套用無障礙樣式，且轉跳至無障礙登出畫面
                      if (!!this.isa11y) {
                        this.a11yalert.show('開通失敗').then(() => this.auth.a11ylogout());
                      } else {
                        this.alert.show('開通失敗').then(() => this.auth.logout());
                      }
                    });
                }).catch(() => {
                    // 取消則登出
                    if (!!this.isa11y) {
                      // 若啟用無障礙，轉跳至無障礙登出
                      this.auth.a11ylogout();
                    } else {
                    this.auth.logout();
                    }
                });
            } else {
                if (data101.validateResult === '0' && StringCheckUtil.containStr(data101.warnMsg, '4307')) {
                    // 數3帳戶強制變更密碼
                    this.alert.show('POPUP.LOGIN.FIRST_LOGIN').then(() => {
                        if (!!this.isa11y) {
                            this.auth.a11ylogout();
                        } else {
                            this.auth.logout();
                        }
                        let url = 'https://actlink.tcb-bank.com.tw/linepay/v1.0.0/digitalDep/toOTP?t=' + data101.daToken;
                        if (!environment.PRODUCTION) {
                            url = 'https://actlink.tcb-test.com.tw/openAPI/v1.0.0/digitalDep/toOTP?t=' + data101.daToken;
                        }
                        this.navgator.push(url);
                    });
                } else if (data101.validateResult === '0') {
                    this.headerCtrl.setCheckFinishStatus(true);
                    this.checkBoundID(data101);
                } else {
                    // 驗證失敗-需由Failure element取得錯誤代碼及訊息
                    logger.debug('login fail:' + JSON.stringify(data101));
                    // 若啟用無障礙，套用無障礙樣式
                    if (!!this.isa11y) {
                      this.a11yalert.show('連線密碼錯誤');
                    } else {
                    this.alert.show('連線密碼錯誤');
                }
            }
            }
        } else {
        }
        }); // checkDeviceAllow end
    }

    /**
     * 檢查裝置支援資訊
     */
    checkDeviceAllow(): Promise<any> {
        return new Promise((resolve, reject) => {
            let check_allow = this.securityService.checkAllowDevice();
            let allow = check_allow.allow;
            if (!allow && check_allow.have_bio) {
                this.alert.show(check_allow.error.content, {
                    title: check_allow.error.title
                }).then(
                    () => {
                        resolve();
                    }
                );
            } else {
                resolve();
            }
        });
    }

    /***
     * 檢查BoundID
     * 1：未申請
     * 2：已申請且裝置未認證，認證密碼有效
     * 3：已申請且裝置未認證，認證密碼逾期
     * 4：已申請且裝置已認證
     * 5：歸戶身分證已申請5組，但此裝置為第6組
     */
    checkBoundID(data101) {
        switch (data101.BoundID) {
            case '2':
                // 連結⾸首次登入裝置認證畫⾯面
                this.cleanRedirect();
               
                
                if (this.isa11y == false) {
                    this.navgator.push('device-bind-start');
                } else {
                    this.navgator.push('a11yDeviceBind');
                }
                break;

            case '3':
                // 顯⽰示立即啟⽤用/稍後啟⽤用對話⽅方塊(100):
                // 您已申請裝置認 證作業，認證密碼已逾時失效。您是否要直接申請裝置認證作業?按下立即申請，連結 裝置綁定服務。
                // 按下稍後申請，接續其他登入⾝身份狀狀態偵測處理理程序。若若所有偵測皆已 完成，則連結⾏行行動網銀畫⾯面。
                
                if(this.isa11y == false){
                    this.confirm.show('您已申請裝置認證作業，認證密碼已逾時失效。您是否要直接申請裝置認證作業?', { btnYesTitle: '立即啟用', btnNoTitle: '稍後啟用' }).then(
                        (res) => {
                            this.cleanRedirect();
                            this.navgator.push('device-bind-start', {});
                        },
                        (error) => {
                            if (this.isa11y == false) {
                                this.auth.redirectAfterLogin();
                            } else {
                                this.auth.a11yredirectAfterLogin(this.logintopage);
                            }
                        }
                    );
                }else{
                    this.a11yconfirm.show('您已申請裝置認證作業，認證密碼已逾時失效。您是否要直接申請裝置認證作業?', { btnYesTitle: '立即啟用', btnNoTitle: '稍後啟用' }).then(
                        (res) => {
                            this.cleanRedirect();
                            this.navgator.push('a11yDeviceBind');
                        },
                        (error) => {
                            this.auth.a11yredirectAfterLogin(this.logintopage);
                        }
                    );
                }

                
                break;
            case '1':
            case '4':
            case '5':
            default:
                // 若啟用無障礙，不檢核憑證
                if (!this.isa11y) {
                this.checkSSLID(data101);
                } else {
                    this.auth.a11yredirectAfterLogin(this.logintopage);
                }
                break;
            //  case '5':
            // 先保留留在記憶體，⾏動網銀畫⾯面點選裝置綁定服務時，再取出使⽤。
            // if (this.isa11y == false) {
            //     this.auth.redirectAfterLogin();
            // } else {
            //    this.auth.a11yredirectAfterLogin(this.logintopage);
            // }
            // break;
        }
    }

    /**
     * 確認SSLID
     * @param data101 登入成功資料
     */
    checkSSLID(data101) {
        logger.debug('checkBoundID:' + data101.BoundID);
        if (data101.SSLID === '1' || data101.SSLID === '3') {
            switch (data101.userCode) {
                case 'M001':
                    // 客⼾戶憑證即將到期通知
                    this.confirm.show('POPUP.CERT.WILL_EXPIRED', {
                        btnYesTitle: 'POPUP.CERT.UPDATE_BTN',
                        btnNoTitle: 'POPUP.CERT.CANCEL_BTN',
                        contentParam: { dueDate: (!!data101.cnEndDate ? this._formateService.transDate(data101.cnEndDate, 'date') : '') }
                    })
                        .then((res) => { this.certUpdate.updateCertificate(); })
                        .catch(() => {
                            if (this.isa11y == false) {
                                this.auth.redirectAfterLogin();
                            } else {
                                this.auth.a11yredirectAfterLogin(this.logintopage);
                            }
                        });
                    break;

                case 'M002':
                    // 客⼾戶憑證已經過期通知(已臨臨櫃)
                    this.confirm.show('POPUP.CERT.EXPIRED', { btnYesTitle: 'POPUP.CERT.DOWNLOAD_BTN', btnNoTitle: 'POPUP.CERT.CANCEL_BTN' })
                        .then(() => {
                            this.cleanRedirect();
                            this.navgator.push('certificateApplication');
                        })
                        .catch(() => this.checkWarnMsg(data101));
                    break;

                // case 'M003':
                //   // 客⼾戶憑證建議換發
                // tslint:disable-next-line:max-line-length
                //   this.confirm.show('依據主管機關法令規定，金融機構已經全面換發2048位元憑證金鑰。您目前的憑證金鑰為1024位元，無法進行交易，請您點選「立即更新」進行換發憑證，本行將於105年5月1日停止線上換發服務，屆時若您需要使用憑證進行交易，請您至本行臨櫃重新辦理憑證申請事宜。', { btnYesTitle: '立即更新', btnNoTitle: '取消' }).then(
                //     (res) => { this.navgator.push('certificateApplication', {}); },
                //     (error) => { this.checkWarnMsg(data101); }
                //   );
                //   this.checkWarnMsg(data101);
                //   break;

                // case 'M004':
                //   // 客⼾戶憑證立即換發
                // tslint:disable-next-line:max-line-length
                //   this.alert.show('依據主管機關法令規定，金融機構已經全面換發2048位元憑證金鑰。您目前的憑證金鑰為1024位元，無法進行交易，請您點選「立即更新」進行換發憑證，本行將於105年5月1日停止線上換發服務，屆時若您需要使用憑證進行交易，請您至本行臨櫃重新辦理憑證申請事宜。', { btnTitle: '立即更新' }).then(
                //     (res) => { this.navgator.push('certificateApplication', {}); },
                //     (error) => { this.checkWarnMsg(data101); }
                //   );
                //   break;

                case 'M005':
                    this.cert.getCertInfo().then(
                        res => {
                            if (this.isa11y == false) {
                                this.auth.redirectAfterLogin();
                            } else {
                                this.auth.a11yredirectAfterLogin(this.logintopage);
                            }
                        },
                        error => {
                            // 客⼾戶憑證申請通知功能(已臨臨櫃)
                            this.confirm.show('POPUP.CERT.HAS_CERT',
                                { btnYesTitle: 'POPUP.CERT.DOWNLOAD_BTN', btnNoTitle: 'POPUP.CERT.DOWNLOAD_LATTER_BTN' })
                                .then(() => {
                                    this.cleanRedirect();
                                    this.navgator.push('certificateApplication');
                                })
                                .catch(() => this.checkWarnMsg(data101));
                        }
                    );
                    break;
                case 'M006':
                case 'M007':
                case 'M008':
                    // 登入後，沒有動作
                    this.checkWarnMsg(data101);
                    break;
                default:
                    if (this.isa11y == false) {
                        this.auth.redirectAfterLogin();
                    } else {
                        this.auth.a11yredirectAfterLogin(this.logintopage);
                    }
            }
        } else {
            // 連結SSL轉帳密碼變更更通知畫⾯。
            this.confirm.show('POPUP.SSL.SSL_NOTICE',
                { btnYesTitle: 'POPUP.SSL.CHANGE_SSL', btnNoTitle: 'POPUP.SSL.CANCEL_BTN' })
                .then(() => {
                    this.cleanRedirect();
                    this.navgator.push('sslChg');
                })
                .catch(() => {
                    if (this.isa11y == false) {
                        this.auth.redirectAfterLogin();
                    } else {
                        this.auth.a11yredirectAfterLogin(this.logintopage);
                    }
                });
        }
    }

    /**
     * 確認訊息
     * @param data101 登入成功資料
     */
    checkWarnMsg(data101) {
        logger.debug('checkWarnMsg:' + data101.warnMsg);
        const warnMsg = data101.warnMsg;
        if (StringCheckUtil.containStr(warnMsg, '4002')) {
            // ⾸次登入
            this.alert.show('POPUP.LOGIN.FIRST_LOGIN').then(() => {
                // 密碼變更頁
                this.cleanRedirect();
                this.navgator.push('netPwdChg');
            });
        } else if (StringCheckUtil.containStr(warnMsg, '4306')) {
            // 一年未變更密碼
            const option = {
                btnYesTitle: 'POPUP.RETURN.UPDATE_NOW',
                btnNoTitle: 'POPUP.RETURN.REMIND_LATER'
            };
            this.confirm.show('POPUP.LOGIN.NEED_CHANGE_PWD', option).then(() => {
                // 密碼變更頁
                this.cleanRedirect();
                this.navgator.push('netPwdChg');
            }).catch(() => this.auth.redirectAfterLogin());
        } else if (StringCheckUtil.containStr(warnMsg, '4003')) {
            // (FundTrans)intent.putExtra("url", "index_main.html#/ReservationForeign/ 9700")
            // 強制填寫法遵基本資料(導頁)
            // 改為導到資料填寫頁面
            this.cleanRedirect();
            this.navgator.push('launder-prevention');
        } else {
            if (this.isa11y == false) {
                this.auth.redirectAfterLogin();
            } else {
                this.auth.a11yredirectAfterLogin(this.logintopage);
            }
        }
    }
}
