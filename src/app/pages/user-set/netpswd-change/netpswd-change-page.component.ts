/**
 * Header
 */
import { Component, OnInit, Input, Renderer2, NgZone } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { securityManageService } from '../shared/service/security-manage.service';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
@Component({
    selector: 'app-netpswd-change-page',
    templateUrl: './netpswd-change-page.component.html',
    styleUrls: [],
    providers: [securityManageService]
})
/**
  * 網路連線密碼變更
  */
export class NetPswdChgPageComponent implements OnInit {

    changePwdStatus = false; // 強制更換網銀密碼
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
    successMsg = "網路連線密碼變更成功";
    resultFlag = false;
    constructor(
        private _logger: Logger
        , private _mainService: securityManageService
        , public authService: AuthService
        , private _handleError: HandleErrorService
        ,  private _headerCtrl: HeaderCtrlService
        , private confirm: ConfirmService
        , private navgator: NavgatorService
    ) {}

    ngOnInit() {
        const userData = this.authService.getUserInfo();
        if (userData.hasOwnProperty('warnMsg') && userData['warnMsg']) {
            if (userData.warnMsg.indexOf('4002') > -1) {
                this.changePwdStatus = true;
            }
        }
        
        if (!userData.hasOwnProperty("custId") || userData.custId == '') {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }

        this.userpw.USER_ID = userData.custId;
        

        // 使用者代碼
        this.getUserId();

        this._headerCtrl.setLeftBtnClick(() => {
            
            this.cancelEdit();
        });
    }
        //跳出popup是否返回
        cancelEdit() {
            if(this.changePwdStatus){
                // 登出
                this.authService.logout();
            }else{

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
            }
           
        }
    
    //取得使用者代碼
    getUserId(): Promise<any> {
        return this.authService.getUserId().then(
            (res) => {
                
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
                }
            },
            (errorObj) => {
                
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);

            })
    }
}
