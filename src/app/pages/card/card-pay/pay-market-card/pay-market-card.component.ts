/**
 * 繳本人合庫信用卡款
 */
import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { CheckService } from '@shared/check/check.service';
import { CardBillService } from '@pages/card/shared/service/card-bill-service/card-bill.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { AuthService } from '@core/auth/auth.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { FC000403ApiService } from '@api/fc/fc000403/fc000403-api.service';
import { logger } from '@shared/util/log-util';
import { LocalStorageService } from '@lib/storage/local-storage.service';
@Component({
    selector: 'app-pay-market-card',
    templateUrl: './pay-market-card.component.html',
    styleUrls: ['./pay-market-card.component.css'],
    providers: [CardBillService]
})
export class PayMarketCardComponent implements OnInit {

    nowPage = 'edit-page';
    showFlag=false;
    //檢核欄位
    check_amount = false; //金額紅框
    ammount_errorMsg = '';

    //畫面按鈕
    selectItem='1';
    billObj:any={
        payableAmt:'',
        lowestPayableAmt:'',
        maxInstallmentAmt:'',
        amount:'',//使用者自行輸入
        showNote:false  //超過兩萬提示
    };
    genCardBarcode={
        code1:'',
        code2:'',
        code3:'',
        code4:''
    };
    limitTime = 300;
    interval:any;
    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private navgator: NavgatorService
        , private _handleError: HandleErrorService
        , private _mainService: CardBillService
        , private _checkService: CheckService
        , private alert: AlertService
        , private confirm: ConfirmService
        , private _headerCtrl: HeaderCtrlService
        , private authService: AuthService
        , private _checkSecurityService: CheckSecurityService
        , private localStorageService: LocalStorageService
    ) {
    }

    ngOnInit() {
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': '超商繳卡費',
            'style': 'normal'
        });
        this._headerCtrl.setLeftBtnClick(() => {
            this.confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
                title: '提醒您'
            }).then(
                () => {
                    //確定
                    this.onCancel();
                },
                () => {

                }
            );
        });
        this.localStorageService.setObj('redirectUrl', '');
        let option = {
            background: true,
            reget: false
        };
        this._mainService.getData({}, option).then(
            (resObj) => {
                this.showFlag=true;
                logger.error('resObj 403',resObj);
                if(resObj.status){
                    logger.error('resObj 403',resObj);
                    if(resObj.payableAmt <= 0){
                        this._handleError.handleError({
                            type: 'message',
                            title:'查無本期應繳金額',
                            content: '本期應繳金額為0'
                        })
                        return false;
                    }
                    this.billObj.payableAmt=this._formateService.checkField(resObj, 'payableAmt');//本期應繳金額
                    this.billObj.lowestPayableAmt=this._formateService.checkField(resObj, 'lowestPayableAmt');//本期最低應繳金額
                    this.billObj.maxInstallmentAmt=this._formateService.checkField(resObj, 'maxInstallmentAmt');//分期金額上限
                    if(parseInt(this.billObj.payableAmt)>20000){
                        this.billObj.showNote=true;
                    }
                }else{
                    this._handleError.handleError(({
                        type: 'message',
                        content: resObj.msg
                    }));
                }
            },
            (errorObj) => {
                this.showFlag=true;
                logger.error('errorObj');
                this._handleError.handleError(errorObj);
            }
        );
        
    }

    //產生條碼按鈕
    onConfirm() {
        let req={
            custId:'',
            amount:''
        }
        //自行輸入金額檢核
        if(this.selectItem=='3'){
            let saveAmount = this._checkService.checkMoney(this.billObj.amount);
            logger.error('saveAmount',saveAmount);
            if (saveAmount['status'] == false) {
                this.check_amount = true;
                this.ammount_errorMsg = saveAmount['msg'];
                return false;
            } else {
                this.check_amount = false;
                this.ammount_errorMsg = '';
            }
            if(this.billObj.amount==''){
                this.check_amount = true;
                this.ammount_errorMsg = '金額不能為空';
                return false;
            }
            if(this.billObj.amount.indexOf('.')>-1){
                this.check_amount = true;
                this.ammount_errorMsg = '金額不能含有小數';
                return false;
            }
            if (this.billObj.amount !== '' && saveAmount['status'] == true) {
                //不可超過2萬
                if (parseInt(this.billObj.amount) > 20000) {
                    this.check_amount = true;
                    this.ammount_errorMsg = '金額不能超過2萬元';
                    return false;
                }else{
                    this.check_amount = false;
                    this.ammount_errorMsg = '';
                }
            }
            logger.error('this.ammount_errorMsg',this.ammount_errorMsg);
            req.amount=this.billObj.amount;
        }else if(this.selectItem=='2'){
            req.amount=this.billObj.lowestPayableAmt;
        }else if(this.selectItem=='1'){
            if (parseInt(this.billObj.payableAmt) > 20000) {
                req.amount='20000';
            }else{
                req.amount=this.billObj.payableAmt;
            }
        }
        logger.error('req.amount',req.amount);
        //都輸入成功進下一頁
        this.onSend(req);
    }

    onCancel() {
        if(this.nowPage=='edit-page'){
            this.navgator.push("web:pay");
        }else{
            clearInterval(this.interval);
            this.nowPage='edit-page'
        }
    }


   
    //結果頁電文
    onSend(set_data) {
        if(set_data.amount==''||set_data.amount=='0'){
            this.alert.show('繳納金額不能為0').then(
                res => {
                }
            );
            return false;
        }
        this._mainService.getMarketPayQRCode(set_data).then(
            (result) => {
                logger.error("result:", this._formateService.transClone(result));
                let barcode=result.cardBarcode;
                logger.error('length',barcode.length);
                this.genCardBarcode.code4=barcode;//test delete
                if(barcode.length==40){
                    this.genCardBarcode.code1=barcode.substring(0,9);
                    this.genCardBarcode.code2=barcode.substring(9,25);
                    this.genCardBarcode.code3=barcode.substring(25,41);
                    logger.error('this.genCardBarcode',this.genCardBarcode);     
                    this.limitTime =300;   
                    this.controllTime();
                    this.nowPage = 'result-page'; //進結果頁
                }
            },
            (errorObj) => {
                logger.error("errorObj:", errorObj);
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
            }
        );
    }
   
    controllTime(){
        this.interval = setInterval(() => {
            if (this.limitTime > 0) {
                this.limitTime--;
            } else {
                this.alert.show('停留時間已經超過五分鐘囉，即將回到產生條碼頁!').then(
                    res => {
                    }
                );
                this.nowPage='edit-page';
                clearInterval(this.interval);
            }
        }, 1000)
    }
    backEdit(){
        this.nowPage='edit-page';
        clearInterval(this.interval);
    }
}
