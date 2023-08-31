/**
 * Header
 */
import { Component, OnInit, Input, Renderer2, NgZone } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { mailService } from '@pages/user-set/shared/service/mail.service';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';

@Component({
    selector: 'app-email-change-page',
    templateUrl: './email-change-page.component.html',
    styleUrls: [],
    providers: [mailService]
})
/**
  * email變更
  */
export class EmailChgPageComponent implements OnInit {

    //頁面欄位
    oldMail = '';
    newMail = '';
    pageType = 'edit';

    //安控

    //request
    userMail = {
        "USER_NOID": "",
        "OLD_MAIL": "",
        "NEW_MAIL": "",
        "USER_SAFE": "",
        "SEND_INFO": ""
    };
    transactionObj = {
        serviceId: 'FF000104',
        categoryId: '7',
        transAccountType: '1',
        customAuth: ['2']
    };
    popFlag = false;
    successMsg = "E-mail變更成功";
    //check error
    errorMsg: any = { 'email': '' };
    constructor(
        private _logger: Logger
        , private _mainService: mailService
        , private authService: AuthService
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private confirm: ConfirmService
        , private navgator: NavgatorService
    ) { }

    ngOnInit() {


        this.getMailData();

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
                this.navgator.push('user-set');
            },
            () => {

            }
        );
    };

    toEditPage(e) {
        if (e) {
            this._headerCtrl.setLeftBtnClick(() => {
                this.cancelEdit();
            });
            
            this.pageType = 'edit';
        }
    }
    /**
    * 透過身分證取得Email
    */
    getMailData(): Promise<any> {
        return this._mainService.getMailData().then(
            (res) => {
                if (res.hasOwnProperty('email')) {
                    this.oldMail = res.email;
                }
                
            },
            (errorObj) => {
                
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
            }
        );
    }
    /**
       * 檢查並至確認頁
       */
    checkEvent() {


        if (!this.userMail.SEND_INFO['status']) {
            //error handle
            let errorObj = {
                type: 'dialog',
                content: this.userMail.SEND_INFO['message'],
                message: this.userMail.SEND_INFO['message']
            };
            this._handleError.handleError(errorObj);
            return;
        }

        const check_obj = this._mainService.checkMailData(this.newMail);
        if (check_obj.status) {
            this.errorMsg.email = '';
            
            this.userMail.OLD_MAIL = this.oldMail;
            this.userMail.NEW_MAIL = this.newMail;
            this.pageType = 'confirm';


            // const userData = this.authService.getUserInfo();
            // userData.email = this.userMail.NEW_MAIL;
            // 
        } else {
            this.errorMsg.email = check_obj.error_list;
            
        }
    }
    /**
      * 導致結果頁
      */
    goResult(e) {

        // 
        // if (this.userMail.USER_SAFE == '2') {
        //     this.popFlag = true;
        // } else {
        //     this.checkEvent();
        //     this.onSend(e);
        // }



        if (e.securityResult.ERROR.status == true) {
            this.onSend(e);
        } else {

        }
    }

    /**
      * 監聽憑證回傳之output
      */
    onVerifyResult(e) {
        if (e) {
            this.popFlag = false;
            this.checkEvent();
            this.onSend(e);
        }
    }

    /**
      * 送電文
      */
    onSend(security) {
        this._mainService.onSend(this.userMail, security).then(
            (res) => {
                if (res.status) {
                    
                    this.pageType = 'result';

                    const userData = this.authService.getUserInfo();
                    userData.email = this.userMail.NEW_MAIL;
                    this.authService.updateInfo(userData);

                };
            },
            (errorObj) => {
                
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
            });
    }

    securityOptionBak(e) {
        if (e.status) {
            // 取得需要資料傳遞至下一頁子層變數
            this.userMail.SEND_INFO = e.sendInfo;
            this.userMail.USER_SAFE = e.selected;
        } else {
            e['type'] = 'message';
            this._handleError.handleError(e.ERROR);
            // do errorHandle 錯誤處理 推業或POPUP
        }
    }
}
