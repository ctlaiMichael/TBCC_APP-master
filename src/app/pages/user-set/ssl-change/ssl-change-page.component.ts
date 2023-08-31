/**
 * Header
 */
import { Component, OnInit, Input, Renderer2, NgZone } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { sslChgService } from '@pages/user-set/shared/service/sslChg.service';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
@Component({
    selector: 'app-ssl-change-page',
    templateUrl: './ssl-change-page.component.html',
    styleUrls: [],
    providers: [sslChgService]
})
/**
  * 網路連線密碼變更
  */
export class SslChgPageComponent implements OnInit {


    //
    private userpw = {
        "OLD_SSL": "",
        "NEW_SSL": "",
        "CUSTID": "",
        "CHECK_SSL": "",
        "USER_CODE": ""
    };
    //check error
    errorMsg: any = { 'oldpwd': '', 'newpwd': '', 'checkpwd': '' };

    successMsg = "SSL密碼變更成功";
    successDetail = '';
    resultFlag = false;
    constructor(
        private _logger: Logger
        , private _mainService: sslChgService
        , private authService: AuthService
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private confirm: ConfirmService
        , private navgator: NavgatorService
    ) { }

    ngOnInit() {

        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty("custId") || userData.custId == '') {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        };
        this.userpw.CUSTID = userData.custId;

        this._headerCtrl.setLeftBtnClick(() => {
            this.cancelEdit();
        });
        this.getToday();
        this.getUserId();
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
    /**
     * 密碼輸入值檢核
     * @param oldpw 舊密碼
     * @param newpw 新密碼
     * @param checkpw 確認新密碼
     */
    checkEvent() {
        let pwdObj = [this.userpw.OLD_SSL, this.userpw.NEW_SSL, this.userpw.CHECK_SSL];
        let userObj=[this.userpw.CUSTID, this.userpw.USER_CODE];
        const check_obj = this._mainService.checkPasswordData(pwdObj,userObj);
        if (check_obj.status) {
            this.errorMsg = '';
            
            this.sendData(this.userpw);
        } else {
            
            this.errorMsg = check_obj.error_list;
        }
    }


    /**
     * 密碼變更執行結果
     * @param userpw 密碼變更設定值(orgPWSD: 舊密碼 及 newPWSD: 新密碼)
     */
    sendData(userpw): Promise<any> {
        return this._mainService.sendSSLChg(userpw).then(
            (res) => {
                if (res) {
                    this.getToday();
                    this.resultFlag = true;
                }
            },
            (errorObj) => {
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
            });
    }
    /**
     * 獲取今日
     */
    private getToday() {
        let currentYear = new Date().getFullYear()    // 取得當下年份
        let currentMonth = new Date().getMonth() + 1  // 取得當下月份
        let currentDay = new Date().getDate()         // 取得當下日期
        let currentTime: string = currentYear + '年'
            + (currentMonth < 10 ? '0' + currentMonth : currentMonth)
            + '月' + (currentDay < 10 ? '0' + currentDay : currentDay) + '日';
        this.successDetail = '您已於' + currentTime + '變更SSL狀密碼成功。提醒您，下次請您使用新的SSL轉帳密碼。歡迎您多加利用本行多元便利的行動網銀服務。'
    }
}
