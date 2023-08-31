
import { Component, OnInit, Input, Renderer2, NgZone } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { addressService } from '@pages/user-set/shared/service/address.service';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';

@Component({
    selector: 'app-address-change-page',
    templateUrl: './address-change-page.component.html',
    styleUrls: [],
    providers: [addressService]
})
/**
  * 地址網路連線密碼變更
  */
export class AddressChgPageComponent implements OnInit {


    //request
    userAddress = {
        "USER_ZIPCODE": "",
        "USER_ADDRESS": "",
        "USER_TEL": "",
        "USER_NOID": "",
        "USER_SAFE": "",
        "SEND_INFO": ""
    };
    //舊的
    oldAddress = {
        "zipCode": "",
        "address": "",
        "tel": ""
    }
    //input頁面欄位
    userInput = {
        "zipCode": "",
        "address": "",
        "tel": ""
    }
    //check error
    errorMsg: any = { 'zipcode': '', 'address': '', 'tel': '' };
    pageType = 'edit';

    //安控
    popFlag = false;   //popup辨別
    //憑證傳回來的結果
    verifyResult = false;

    //安控傳參
    transactionObj = {
        serviceId: 'FF000102',
        categoryId: '7',
        transAccountType: '1',
        customAuth: ['2']
    };

    constructor(
        private _logger: Logger
        , private _mainService: addressService
        , private authService: AuthService
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private confirm: ConfirmService
        , private navgator: NavgatorService
    ) { };

    successMsg = "通訊地址變更成功";

    ngOnInit() {


        this.getAddressData();



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
    // 確認頁返回編輯頁
    toEditPage(e) {
        if (e) {
            this._headerCtrl.setLeftBtnClick(() => {
                this.cancelEdit();
            });
            this.pageType='edit';
        }
    }

    /**
        * 透過身分證取得通訊地址
        */
    getAddressData(): Promise<any> {
        return this._mainService.getAddressData().then(
            (res) => {
                if (res.hasOwnProperty('zipCode') && res.hasOwnProperty('address')
                    && res.hasOwnProperty('tel')) {
                    this.oldAddress.zipCode = res.zipCode;
                    this.oldAddress.address = res.address;
                    this.oldAddress.tel = res.tel;
                    this.userInput.zipCode = res.zipCode;
                    this.userInput.address = res.address;
                    this.userInput.tel = res.tel;
                    // this.userAddress.USER_ZIPCODE = this.userInput.zipCode;
                    // this.userAddress.USER_ADDRESS = this.userInput.address;
                    // this.userAddress.USER_TEL = this.userInput.tel;
                }
            },
            (errorObj) => {
                this._logger.log('error', errorObj);
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
            }
        );
    }
    /**
     * 檢查
     */
    checkEvent() {

        if (!this.userAddress.SEND_INFO['status']) {
            //error handle
            let errorObj = {
                type: 'dialog',
                content: this.userAddress.SEND_INFO['message'],
                message: this.userAddress.SEND_INFO['message']
            };
            this._handleError.handleError(errorObj);
            return;
        }

        let addressArr = [this.userInput.zipCode, this.userInput.address, this.userInput.tel];
        // let addressArr = [this.userAddress.USER_ZIPCODE, this.userAddress.USER_ADDRESS, this.userAddress.USER_TEL];
        const check_obj = this._mainService.checkAddressData(addressArr);
        if (check_obj.status) {

            this.userAddress.USER_ZIPCODE = this.userInput.zipCode;
            this.userAddress.USER_ADDRESS = this.userInput.address;
            this.userAddress.USER_TEL = this.userInput.tel;
            this.pageType = 'confirm';
        } else {
            this.errorMsg = check_obj.error_list;
        }
    }



    /**
      * 送電文
      */
    onSend(security) {
        this._mainService.onSend(this.userAddress, this.oldAddress, security).then(
            (res) => {
                if (res.status) {

                }
                this.pageType = 'result';
            },
            (errorObj) => {
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
            });
    }

    //確認頁點選確認
    goResult(e) {


        if (e.securityResult.ERROR.status == true) {
            this.onSend(e);
        } else {

        }

        //USER_SAFE 憑證跳popup
        // if (this.userAddress.USER_SAFE == '2') {
        //     this.popFlag = true;
        // } else {
        //     // this.checkEvent();
        //     this.onSend(e);
        // }
    }

    //監聽憑證回傳之output
    onVerifyResult(e) {
        if (e) {
            this.popFlag = false;
            this.checkEvent();
            this.onSend(e);
        }
    }

    //安控檢核
    securityOptionBak(e) {

        if (e.status) {
            // 取得需要資料傳遞至下一頁子層變數
            this.userAddress.SEND_INFO = e.sendInfo;
            this.userAddress.USER_SAFE = e.sendInfo.selected;
        } else {
            // do errorHandle 錯誤處理 推業或POPUP

            e.ERROR['type'] = 'message';
            this._handleError.handleError(e.ERROR);
        }
    }


}
