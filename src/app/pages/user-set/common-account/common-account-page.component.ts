/**
 * Header
 */
import { Component, OnInit, Input, Renderer2, NgZone } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CommonAccountService } from '@pages/user-set/shared/service/commonAccount.service';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Component({
    selector: 'app-common-account-page',
    templateUrl: './common-account-page.component.html',
    styleUrls: [],
    providers: [CommonAccountService]
})
/**
  * 常用帳設定
  */
export class CommonAccountPageComponent implements OnInit {

    //查詢回之資料
    commonArr = [];
    //修改之資料
    editData = {};
    dataTime = '';
    pageType: string = 'search';    //預設進入編輯頁



    constructor(
        private _logger: Logger
        , private _mainService: CommonAccountService
        , private router: ActivatedRoute
        , private authService: AuthService
        , private _handleError: HandleErrorService

    ) { }

    ngOnInit() {
        this.getAccount();
    }

    /**
   * 取得常用帳號
   */
    getAccount(): Promise<any> {
        return this._mainService.getAccount().then(
            (res) => {
                

                if (res.hasOwnProperty('data')) {
                    this.commonArr = res.data;
                }
                if (res.hasOwnProperty('dataTime')) {
                    this.dataTime = res.dataTime;
                };
            },
            (errorObj) => {
                
                errorObj['type'] = 'dialog';
                this._handleError.handleError(errorObj);
            }
        );
    }
    /**
   * 修改常用帳號
   */
    modifyData(editData?) {

        if (editData) {
            this.pageType = 'modify';
            
            this.editData = editData;
            let safeObj = { 'USER_SAFE': '' , 'SEND_INFO' : ''};
            this.editData = Object.assign(this.editData, safeObj);
        } else {
            this.pageType = 'add';
        }

    }




}
