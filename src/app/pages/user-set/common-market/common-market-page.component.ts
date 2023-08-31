/**
 * Header
 */
import { Component, OnInit, Input, Renderer2, NgZone } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { commonMarketService } from '../shared/service/commonMarket.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
@Component({
    selector: 'app-common-market-page',
    templateUrl: './common-market-page.component.html',
    styleUrls: [],
    providers: [commonMarketService]
})
/**
  * 共同行銷
  */
export class CommonMarketPageComponent implements OnInit {



    //結果頁訊息
    successMsg = "完成同意共同行銷";
    successDetail = "";
    agreeOrNot = "C";   //C同意行銷  D不同意行銷
    fnctId = 'T';
    loginPage = '0';
    resultFlag = false;
    agreeCheck = false; //按鈕有被勾宣
    popFlag = false;
    falseFlag = false;
    constructor(
        private _logger: Logger
        , private _mainService: commonMarketService
        , private _handleError: HandleErrorService
        , private navgator:NavgatorService
        , private _headerCtrl: HeaderCtrlService
    ) { }

    ngOnInit() {
        let params=this.navgator.getParams();
        if(params && params.hasOwnProperty('fnctId')){
            this.fnctId = params.fnctId;
        }

        if(this.fnctId == 'L'){
            this.loginPage = '1';
            this._headerCtrl.setLeftBtnClick(() => {
                this.navgator.push('user-home');
            });
        }
    }

    leave(){
        this.navgator.push('user-home');
    }

    doNextStep(){
        this.loginPage = '2';
        this._headerCtrl.setLeftBtnClick(() => {
            this.loginPage = '1';
            this._headerCtrl.setLeftBtnClick(() => {
                this.navgator.push('user-home');
            });
        });
    }

    finishBackFun(){

        if( this.fnctId == 'L'){
            this._headerCtrl.setLeftBtnClick(() => {
                this.navgator.push('user-home');
            });
        }else{
            this._headerCtrl.setLeftBtnClick(() => {
                this.navgator.push('user-set');
            });
        }
    }
    /**
     * 使用者點選不同意
     */
    noAgree() {
        if(this.agreeCheck){
            this.popFlag = true;
            return;
        }else{
            this.agreeOrNot = "D";
            this.successMsg = "完成終止共同行銷"
            this.falseFlag = true;
            this.getToday();
            this.sendData(this.agreeOrNot).then(
                (res) => {
                    if (res.hasOwnProperty('status') && res.status == true) {
                        this.resultFlag = true;
                    }
                },
                (errorObj) => {
                    errorObj['type'] = 'message';
                    this._handleError.handleError(errorObj);
                    
                })
        }

    }
    /**
     * 確認送出資料
     */
    sendData(agreeOrNot): Promise<any> {

        this.getToday();
        
        if (this.agreeCheck || this.falseFlag) {
            return this._mainService.sendData(this.agreeOrNot,this.fnctId).then(
                (res) => {
                    if (res.hasOwnProperty('status') && res.status == true) {
                        this.resultFlag = true;
                    }
                },
                (errorObj) => {
                    errorObj['type'] = 'message';
                    this._handleError.handleError(errorObj);
                })
        } else {
            this.popFlag = true;
        }

    }

    /**
     * pop close
     */
    popClose() {
        this.popFlag = false;
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
        this.successDetail = '您已於' + currentTime + '完成' + (this.agreeOrNot == 'C' ? '同意' : '終止') + '共同行銷。';
    }
}
