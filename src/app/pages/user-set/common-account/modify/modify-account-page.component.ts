/**
 * Header
 */
import { Component, OnInit, Input, Output, Renderer2, NgZone } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CommonAccountService } from '@pages/user-set/shared/service/commonAccount.service';
import { AgreedAccountService } from '@pages/user-set/shared/service/agreedAccount.service';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';

@Component({
    selector: 'app-modify-account-page',
    templateUrl: './modify-account-page.component.html',
    styleUrls: [],
    providers: [CommonAccountService, AgreedAccountService]
})
/**
  * 常用帳號設定變更
  */
export class ModifyAccountPageComponent implements OnInit {

    //欲修改之資料
    @Input() editData;



    nickName = '';
    action = '2'; //執行動作 1.新增 2.修改 3.刪除
    safeType = [];    //全部轉帳機制
    nowType;    //select預設之轉帳機制
    easyName: string = '';
    //check error
    errorMsg: any = { 'easyName': '' };
    popFlag = false;
    //頁面切換
    pageModify = 'edit';
    //結果頁內容
    successMsg = "修改常用帳號成功";
    successContent = [];
    notice = '';
    transactionObj = {
        serviceId: 'FG000404',
        categoryId: '7',
        transAccountType: '1',
    };
    constructor(
        private _logger: Logger
        , private _mainService: CommonAccountService
        , private router: ActivatedRoute
        , private agreedService: AgreedAccountService
        , private authService: AuthService
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private confirm: ConfirmService
        , private navgator: NavgatorService

    ) { }

    ngOnInit() {
        //模擬取得安控以及預設SSL
        this.safeType = this._mainService.get_security('data');
        if (typeof this.safeType === 'object' && this.safeType[0].hasOwnProperty('id')) {
            this.nowType = this.safeType[0];
        };
        

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
    //確認頁點選確認
    goResult(e) {
        //USER_SAFE 憑證跳popup
        // if (this.nowType['id'] == '2') {
        //     this.popFlag = true;
        // } else {
        //     // this.checkEvent();
        //     this.onSend(e);
        // }
        // 

        if (e.securityResult.ERROR.status == true) {
            this.onSend(e);
        } else {

        }
    };
    // 確認頁返回編輯頁
    toEditPage(e) {
        if (e) {
            this._headerCtrl.setLeftBtnClick(() => {
                this.cancelEdit();
            });
            
            this.pageModify = 'edit';
        }
    };

    //監聽憑證回傳之output
    onVerifyResult(e) {
        if (e) {
            this.popFlag = false;
            // this.checkEvent();
            this.onSend(e);
        }
    }
    /**
      * 送電文
      */
    onSend(security) {
        this._mainService.onSend(this.editData, security).then(
            (res) => {
                this.successContent = [{ title: '轉入行庫', detail: this.editData['trnsInBank'] + '' + this.editData['trnsInBankName'] },
                { title: '轉入帳號', detail: this.editData['trnsInAccnt'] }, { title: '好記名稱', detail: this.editData['accntName'] }];
                if (res.status) {
                    
                }
                this.pageModify = 'result';
            },
            (errorObj) => {
                
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);

            });
    }


    /**
    * 檢查並前往下一頁
    */
    checkEvent(action) {

        if (!this.editData.SEND_INFO['status']) {
            //error handle
            let errorObj = {
                type: 'dialog',
                content: this.editData.SEND_INFO['message'],
                message: this.editData.SEND_INFO['message']
            };
            this._handleError.handleError(errorObj);
            return;
        }
        if (action == '3') {
            this.notice = '如預約定新帳號請持身份證、原申請網路銀行的存款印鑑就近至本行任一分行辦理，或於網路銀行/行動網銀線上辦理。';
            this.successMsg = "刪除常用帳號成功";
            this.pageModify = 'confirm';
        }
        //刪除此筆好記名稱可為空，點選下一步不能為空
        if (action == '2') {
            //action 1新增 2修改 3刪除
            const check_obj = this.agreedService.checkNickName(this.nickName);
            this.editData['accntName'] = this.nickName;
            
            if (check_obj.status) {
                this.errorMsg.easyName = '';
                
                this.pageModify = 'confirm';
            } else {
                this.errorMsg.easyName = check_obj.error_list;
                
            }
        }
        this.editData['USER_SAFE'] = this.nowType['id']
        let safeObj = { action: action };
        this.editData = Object.assign(this.editData, safeObj);
    }

    securityOptionBak(e) {
        if (e.status) {
            // 取得需要資料傳遞至下一頁子層變數
            this.editData.SEND_INFO = e.sendInfo;
            this.editData.USER_SAFE = e.selected;
        } else {
            e['type'] = 'message';
            this._handleError.handleError(e.ERROR);
        }
    }
}
