/**
 * Header
 */
import { Component, OnInit, Input, Renderer2, NgZone } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { securityManageService } from '../shared/service/security-manage.service';
// import { LayoutService, PopupService, ConfigService, SystemService } from '@service/global';
// import { LangTransService } from '@share_pipe/langTransPipe/lang-trans.service';
// import { HtFrameService } from '@service/global/ht_frame.service';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
@Component({
    selector: 'app-netcode-change-page',
    templateUrl: './netcode-change-page.component.html',
    styleUrls: [],
    providers: [securityManageService]
})
/**
  * 網路連線密碼變更
  */
export class NetCodeChgPageComponent implements OnInit {


    //request需要
    private usercode = {
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

    successMsg = "網路連線代號變更成功";
    resultFlag = false;
    constructor(
        private _logger: Logger
        , private _mainService: securityManageService
        , private router: Router
        , private authService: AuthService
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private confirm: ConfirmService
        , private navgator: NavgatorService
    ) { }

    ngOnInit() {


        const userData = this.authService.getUserInfo();

        // 身分證
        
        if (!userData.hasOwnProperty("custId") || userData.custId == '') {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        this.usercode.USER_NOID = userData.custId;
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
                this.navgator.push('user-set');
            },
            () => {

            }
        );
    }

    //取得使用者代碼
    getUserId(): Promise<any> {
        return this.authService.getUserId().then(
            (res) => {
                
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
            
            this.sendUserData(this.usercode);
            this.errorMsg = {};
        } else {
            this.errorMsg = check_obj.error_list;
            
        }

    }
    // getUSERID(): Promise<any> {
    // }
    sendUserData(usercode): Promise<any> {
        return this._mainService.sendNetCodeChg(usercode).then(
            (res) => {
                if (res && res.result == '0') {
                    this.resultFlag = true;

                    const userData = this.authService.getUserInfo();
                    this.authService.setUserInfo(userData, this.userInput.newcode);
                }
            },
            (errorObj) => {
                
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);

            })
    }



}
