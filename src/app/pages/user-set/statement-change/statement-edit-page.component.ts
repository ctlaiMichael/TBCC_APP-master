/**
 * Header
 */
import { Component, OnInit, Input, Renderer2, NgZone } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { statementService } from '@pages/user-set/shared/service/statement.service';

import { mailService } from '../shared/service/mail.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AuthService } from '@core/auth/auth.service';
@Component({
    selector: 'app-statement-edit-page',
    templateUrl: './statement-edit-page.component.html',
    styleUrls: [],
    providers: [statementService, mailService]
})
/**
  * 網路連線密碼變更
  */
export class StatementEditPageComponent implements OnInit {

    oldMail: string = ''; //olddMail
    sysMail: string = '';    //系統取得之mail
    sameMail = false; //同Email
    //input顯示之內容依申請、異動不同
    inputContent: any = {
        'input_1': ''
        , 'input_2': ''
        , 'inValue_1': ''
        , 'inValue_2': ''
    };   //內容

    userMail = {
        "OLD_MAIL": '',
        "NEW_MAIL": '',
        "USER_SAFE": '',
        "SEND_INFO": '',
        "TRANSFLAG": '',
        "SAMEFLAG": false
    }

    applyType: any = {}; //接收param
    newMail = '';         //變更之email
    pageType = 'edit';    //預設進入編輯頁
    //check error
    errorMsg: any = { 'email': '' };
    popFlag = false;

    //結果頁內容
    successMsg = "異動綜合對帳單成功";
    // successContent = {
    //     title: []
    //     , details: []
    // };
    successContent = [];
    transactionObj = {
        serviceId: 'FJ000101',
        categoryId: '7',
        transAccountType: '1',
    };
    constructor(
        private _logger: Logger
        , private _mainService: statementService
        , private mailService: mailService
        , private router: ActivatedRoute
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private confirm: ConfirmService
        , private navgator: NavgatorService
        , private authService: AuthService

    ) { }

    ngOnInit() {

      
        // this.getEmail();
        this.router.queryParams.subscribe(params => {
            if (params.hasOwnProperty('id') && params.hasOwnProperty('name')) {
                this.applyType = params;
            }
        });
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': this.applyType.name
        });
        this._headerCtrl.setLeftBtnClick(() => {
            this.cancelEdit();
        });
        // this.getEmail();
        //取得Email
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty("email") || userData.custId == '') {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        };
        this.sysMail = userData.email;

        // if (!userData.hasOwnProperty("OtpCustInfo")) {
        //     return Promise.reject({
        //         title: 'ERROR.TITLE',
        //         content: 'ERROR.DATA_FORMAT_ERROR'
        //     });
        // };

        // this.sysMail = userData.OtpCustInfo['Email'];

        this.getContent(this.applyType.id, this.sysMail);
        
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

    // 確認頁返回編輯頁
    toEditPage(e) {
        if (e) {
            this._headerCtrl.setLeftBtnClick(() => {
                this.cancelEdit();
            });
            
            this.pageType = 'edit';
        }
    };
    /**
   * 取得Email 
   */

    getEmail(): Promise<any> {
        return this.mailService.getMailData().then(
            (res) => {
                if (res.hasOwnProperty('email')) {
                    this.oldMail = res.email;
                }
                this.getContent(this.applyType.id, this.oldMail);
            },
            (errorObj) => {
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
            }
        );
    }
    /**
     * 根據申請或異動取得不同欄位內容
     */
    getContent(mailOut, oldMail) {
        this.inputContent = this._mainService.getContent(mailOut, oldMail);
        
    };
    /**
     * 同原old Email
     */
    onSameOld() {
        if (this.sameMail == false) {
            this.inputContent.inValue_2 = this.sysMail;
        };
    };
    /**
     * 使用者更改電子郵件
     */
    changeMail() {
        if (this.sameMail == true) {
            this.inputContent.inValue_2 = "";
            this.sameMail = false;
        };
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

        if (this.sameMail) {
            this.newMail = this.sysMail;
            this.userMail.NEW_MAIL = this.sysMail;
            this.inputContent.inValue_2 = this.sysMail;
        } else {
            this.userMail.NEW_MAIL = this.newMail;
            this.inputContent.inValue_2 = this.newMail;
        }
        
        let check_obj;
        let mail=this.userMail.NEW_MAIL;
        if(this.applyType.id=='0'){ //未申請時檢核只包含@
            check_obj = this.mailService.checkMailData(mail,true);
        }else{                      //申請時嚴格檢核
            check_obj = this.mailService.checkMailData(mail);
        };

        
        if (check_obj.status) {
            this.userMail.TRANSFLAG = this.applyType.id;    //申請或異動
            this.userMail.SAMEFLAG = this.sameMail;   //使否為舊email
            this.errorMsg.email = '';

            this.userMail.OLD_MAIL = this.oldMail;
            this.userMail.NEW_MAIL = this.newMail;
            this.pageType = 'confirm';
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
                    
                    //決定success
                    if (this.userMail.TRANSFLAG == '0') {
                        this.successMsg = '申請綜合對帳單成功';
                    } else {
                        this.successMsg = '異動綜合對帳單成功';
                    }
                    // this.successContent = {
                    //     title: ['交易時間', '交易序號', this.inputContent.input_1, this.inputContent.input_2]
                    //     , details: [res['info_data']['trnsDateTime'], res['info_data']['trnsNo'], this.inputContent.inValue_1, this.newMail]
                    // }
                    // let title= ['交易時間', '交易序號', this.inputContent.input_1, this.inputContent.input_2];
                    // let details= [res['info_data']['trnsDateTime'], res['info_data']['trnsNo'], this.inputContent.inValue_1, this.newMail];
                    // !!!
                    let mail_hide;
                    if (this.sameMail = true) {
                        // mail_hide = this.hitrustPipeService.transMaskEmail(this.inputContent.inValue_2);
                        mail_hide = this.inputContent.inValue_2;
                    } else {
                        mail_hide = this.inputContent.inValue_2;
                    }
                    let subObj = [];
                    // let suInput1=this.inputContent.input_1.replace);
                    subObj['交易時間'] = res['info_data']['trnsDateTime'];
                    subObj['交易序號'] = res['info_data']['trnsNo'];
                    subObj[this.inputContent.input_1.replace(/\*/, "")] = this.inputContent.inValue_1;
                    subObj[this.inputContent.input_2.replace(/\*/, "")] = mail_hide;

                    
                    for (let key in subObj) {
                        let temp_data = {
                            title: '',
                            detail: ''
                        };
                        temp_data.title = key;
                        temp_data.detail = subObj[key];
                        this.successContent.push(temp_data);
                    }
                    // let details={};
                    // this.successContent.push(title);
                    // this.successContent.push(details);
                    this.pageType = 'result';
                    const userData = this.authService.getUserInfo();
                    userData.email=this.userMail.NEW_MAIL;
                    userData.isElectApply='1';  //申請成功後狀態更改為異動
                    this.authService.updateInfo(userData);
                }
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
            this.userMail.USER_SAFE = e.sendInfo.selected;
        } else {
            e['type'] = 'message';
            this._handleError.handleError(e.ERROR);
        }
    }
}
