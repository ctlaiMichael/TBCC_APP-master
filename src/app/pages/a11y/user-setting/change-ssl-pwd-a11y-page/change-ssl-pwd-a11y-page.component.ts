import { Component, OnInit } from '@angular/core';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { Logger } from '@core/system/logger/logger.service';
import { sslChgService } from '@pages/user-set/shared/service/sslChg.service';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { A11yConfirmService } from '@shared/popup/a11y/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';

@Component({
    selector: 'app-change-ssl-pwd-a11y-page',
    templateUrl: './change-ssl-pwd-a11y-page.component.html',
    styleUrls: []
})
export class ChangeSslPwdA11yPageComponent implements OnInit {
    //標頭
    obj = {
        style: 'normal_a11y',
        showMainInfo: false,
        leftBtnIcon: 'back',
        rightBtnIcon: 'noshow',
        title: 'SSL變更',
        backPath: 'a11yhomekey'
    };
    //
    userpw = {
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
    //變更結果
    result =
        {
            header: 'SSL變更',
            changenameresult: 'success',
            msg: '您已完成使用者SSL密碼變更'
        }
    constructor(
        private headerCtrl: HeaderCtrlService,
        private _logger: Logger,
        private _mainService: sslChgService,
        private authService: AuthService,
        private _handleError: HandleErrorService,
        private confirm: A11yConfirmService,
        private navgator: NavgatorService
    ) { }

    ngOnInit() {
        this.headerCtrl.setOption(this.obj);
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty("custId") || userData.custId == '') {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        };
        this.userpw.CUSTID = userData.custId;

        this.headerCtrl.setLeftBtnClick(() => {
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
                this.navgator.push('a11ysettingmenutkey');
            },
            () => {

            }
        );
    }

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
    /**
     * 密碼輸入值檢核
     * @param oldpw 舊密碼
     * @param newpw 新密碼
     * @param checkpw 確認新密碼
     */
    checkEvent() {
        let pwdObj = [this.userpw.OLD_SSL, this.userpw.NEW_SSL, this.userpw.CHECK_SSL];
        let userObj = [this.userpw.CUSTID, this.userpw.USER_CODE];
        const check_obj = this._mainService.checkPasswordData(pwdObj, userObj);
        if (check_obj.status) {
          this.errorMsg = '';
          this._logger.debug('格式正確');
          this.sendData(this.userpw);
        } else {
          this._logger.debug('格式錯誤');
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
                    this.navgator.push('a11yresultkey', this.result);
                }
            },
            (errorObj) => {
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
                this.result.changenameresult = 'fail';
                this.result.msg = errorObj['content'];
                this.navgator.push('a11yresultkey', this.result);
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
