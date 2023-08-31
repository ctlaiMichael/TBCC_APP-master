/**
 * Header
 */
import { Component, OnInit, Input, Renderer2, NgZone } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
import { statementService } from '@pages/user-set/shared/service/statement.service';
import { AuthService } from '@core/auth/auth.service';
import { NavgatorService } from '@core/navgator/navgator.service';
@Component({
    selector: 'app-statement-menu-page',
    templateUrl: './statement-menu-page.component.html',
    styleUrls: [],
    providers: [statementService]
})
/**
  * 綜合對帳單變更
  */
export class StatementMenuPageComponent implements OnInit {

    /**
     * 由登入資訊F1000101取得isElectApply暫存於記憶體
     * 於其他服務取得此 Flag判斷綜合對帳單是否申請過
     * 0為未申請，1為申請
     */
    applyMethod = "";
    mailOut = {
        'id': ''
        , 'name': ''
    }; //寄送方式
    constructor(
        private _logger: Logger
        , private _mainService: statementService
        , private router: Router
        , private authService: AuthService
        , private navgator: NavgatorService
    ) { }

    ngOnInit() {
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty("isElectApply") || userData.isElectApply == '') {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        this.applyMethod = userData.isElectApply;
        this.applyMethod='0';
        
        if (this.applyMethod != "") {
            this.getMethod();
        }
    }

    /**
     * 由登入資訊F1000101取得isElectApply暫存於記憶體
     * 於其他服務取得此 Flag判斷綜合對帳單是否申請過
     * 0為未申請 ，1為已申請
     */
    getMethod() {
        // let applyMethod;
        // applyMethod = this._mainService.getStatementSet();
        //0為未申請 ，1為已申請
        if (this.applyMethod == '1') {
            this.mailOut.name = '綜合對帳單異動';
            this.mailOut.id = '1';
        } else {
            this.mailOut.name = '綜合對帳單申請';
            this.mailOut.id = '0';
        }
    }

    /**
     * 轉往編輯頁
     */
    goEdit() {
        // this.navigate.push(['user-set/statementEdit'], { queryParams: this.mailOut });
        this.navgator.push('statementEdit', {}, this.mailOut);
    }
}
