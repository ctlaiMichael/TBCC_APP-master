/**
 * 台大醫院-繳醫療費
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FormateService } from '@shared/formate/formate.service';
import { NtuhPayService } from '@pages/hospital/shared/service/ntuh-pay.service';
import { CheckService } from '@shared/check/check.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { Logger } from '@core/system/logger/logger.service';
import { logger } from '@shared/util/log-util';


@Component({
    selector: 'app-ntuh-pay',
    templateUrl: 'ntuh-pay-page.component.html',
    styleUrls: [],
    providers: [NtuhPayService]
})

export class NtuhPayComponent implements OnInit {
    @Input() inputData: any;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    show_page = true;
    reqData = {
        custId: '',
        personId: '',
        chartNo: '',
        birthday: '',
        branchId: '',
        hospitalId: '',
        hospitalName: ''
    }

    //ngModel綁定
    inp_data = {
        personal: '',
        birthday: ''
    }

    notMySelfShow = false;

    personalNumber = "身分證字號";
    personal = "身分證字號"; //現在選擇狀態
    number = ""; //現在選擇狀態

    savePersonId = {}; //存檢核回傳(身分證)
    saveBirthday = {}; //存檢核回傳(生日)
    saveNumber = {}; //存檢核回傳(病例)

    personal_errorMsg = ''; //檢核錯誤訊息(身分證)
    birthday_errorMsg = ''; //檢核錯誤訊息(生日)

    checkPersonId = false; //顯示錯誤紅框(身分證)
    checkBirthday = false; //顯示錯誤紅框(生日)

    goPayList = false;

    today = new Date();
    dd = String(this.today.getDate()).padStart(2, '0');
    MM = String(this.today.getMonth() + 1).padStart(2, '0');
    yyyy = this.today.getFullYear();
    todate = this.yyyy + '/' + this.MM + '/' + this.dd;
    maxDay = '';
    minDay = '';

    constructor(
        private _logger: Logger,
        private _getQuery: NtuhPayService,
        private _handleError: HandleErrorService,
        private _headerCtrl: HeaderCtrlService,
        private _formateService: FormateService,
        private _checkService: CheckService,
        private navgator: NavgatorService,
        private _confirm: ConfirmService,
    ) { }

    ngOnInit() {
        const oldAge = (this.yyyy - 120) + '/' + this.MM + '/' + this.dd;
        this.minDay = oldAge;
        this.maxDay = this.todate;
        this.show_page = true;
        logger.error("inputData:", this.inputData);
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': '繳醫療費'
        });
        this._headerCtrl.setLeftBtnClick(() => {
            this._confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
                title: '提醒您'
            }).then(
                () => {
                    //確定
                    this.onBackPageData({},'');
                },
                () => {

                }
            );
        });

        this.reqData.custId = this.inputData.custId;
        this.reqData.branchId = this.inputData.branchId;
        this.reqData.hospitalId = this.inputData.hospitalId;
        this.reqData.hospitalName = this.inputData.hospitalName;
    }

    //點選本人帳戶
    onIsMySelf() {
        this.goPayList = true;
    }

    //點選非本人
    onNotMySelf() {
        this.notMySelfShow = true;
    }

    //切換身分證、病歷號碼(改變placeholder值)
    inputChange(type) {
        if (type == 'personal') {
            this.personalNumber = "身分證字號";
            this.personal = this.personalNumber;
            this.reqData.chartNo = '';
        } else {
            this.personalNumber = "病歷號碼";
            this.number = this.personalNumber;
            this.reqData.personId = '';
        }
    }

    //非本人按下確認
    confirm() {
        //判斷為身分證號碼 or 病歷號碼
        //身分證
        if (this.personalNumber == this.personal) {
            this.savePersonId = this._checkService.checkIdentity(this.inp_data.personal);
            logger.error("savePersonId1:", this.savePersonId);
            if (this.savePersonId['status'] == false) {
                logger.error("personalId!!!");
                this.checkPersonId = true;
                this.personal_errorMsg = this.savePersonId['msg'];
            } else {
                this.checkPersonId = false;
                this.reqData['personId'] = this.savePersonId['data'];
            }
            //檢核生日
            this.checkBirth();
            if(this.savePersonId['status']==true && this.saveBirthday['status']==true) {
                this.goPayList = true;
            } else {
                return false;
            }
        }
        //病歷號碼
        if (this.personalNumber == this.number) {
            logger.error("sicknumber!!!");
            this.saveNumber = this._getQuery.checkSickNumber(this.inp_data.personal);
            logger.error("saveNumber:", this.saveNumber);
            if (this.saveNumber['status'] == false) {
                logger.error("personalId!!!");
                this.checkPersonId = true;
                this.personal_errorMsg = this.saveNumber['msg'];
            } else {
                this.checkPersonId = false;
                this.reqData['chartNo'] = this.saveNumber['data'];
            }
            //檢核生日
            this.checkBirth();
            if(this.saveNumber['status']==true && this.saveBirthday['status']==true) {
                this.goPayList = true;
            } else {
                return false;
            }
        }

        //檢核成功顯示子層
        // if ((this.reqData.personId && this.reqData.birthday) || (this.reqData.chartNo && this.reqData.birthday)) {
        //     if((this.savePersonId['status']==true && this.saveBirthday['status']==true) ||
        //      (this.saveNumber['status']==true && this.saveBirthday['status']==true)) {
        //     this.goPayList = true;
        // } else {
        //     return false;
        // }
    }

    checkBirth() {
        this.saveBirthday = this._checkService.checkDate(this.inp_data.birthday);
        logger.error("saveBirthday:", this.saveBirthday);
        if (this.saveBirthday['status'] == false) {
            logger.error("11111111");
            this.checkBirthday = true;
            this.birthday_errorMsg = this.saveBirthday['msg'];
        } else {
            this.checkBirthday = false;
            let output_date = this._getQuery.formate_birthday(this.saveBirthday['formate']);
            this.reqData['birthday'] = output_date['formate'];
        }
        logger.error("reqData:", this.reqData);
    }


    /**
     * 重新設定page data
     * @param item 
     */
    onBackPageData(item,set_type) {
        let output = {
            'page': 'ntuh-pay',
            'type': 'back',
            'data': item
        };
        if(set_type !== '') {
            output.page = set_type;
        }
        logger.error("ntuh-pay page onBack output.page:",output.page);
        this.backPageEmit.emit(output);
    }

    /**
    * 子層返回事件(接收回傳)
    * @param e 
    */
    onBackPage(e) {
        this._logger.step('NEWS', 'onBackPage', e);
        let page = '';
        let pageType = '';
        let tmp_data: any;
        if (typeof e === 'object') {
            if (e.hasOwnProperty('page')) {
                page = e.page;
            }
            if (e.hasOwnProperty('type')) {
                pageType = e.type;
            }
            if (e.hasOwnProperty('data')) {
                tmp_data = e.data;
            }
        }
        if(page == 'ntuh-paylist') {
            this.notMySelfShow = false;
            this.goPayList = false;

            this._headerCtrl.setLeftBtnClick(() => {
                this._confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
                    title: '提醒您'
                }).then(
                    () => {
                        //確定
                        this.onBackPageData({},'');
                    },
                    () => {
    
                    }
                );
            });
        }
        if(page == 'go_account') {
            logger.log("ntuh-pay page into go_account!");
            this.show_page = false;
            this.onBackPageData({},'goto-account');
        }
    }

        /**
     * 失敗回傳
     * @param error_obj 失敗物件
     */
    onErrorBackEvent(e) {
        this._logger.step('Hospital', 'onErrorBackEvent', e);
        let page = 'list';
        let pageType = 'list';
        let errorObj: any;
        if (typeof e === 'object') {
            if (e.hasOwnProperty('page')) {
                page = e.page;
            }
            if (e.hasOwnProperty('type')) {
                pageType = e.type;
            }
            if (e.hasOwnProperty('data')) {
                errorObj = e.data;
            }
        }

        this._logger.error('back', errorObj, e);

        if(page == 'ntuh-paylist-error') {
            this.onBackPageData(errorObj,'ntuh-paylist-error');
        }

        switch (page) {
            case 'ntuh-paylist':
                // == 內容返回(先顯示列表再顯示錯誤訊息) == //
                this.onBackPage('list');
                errorObj['type'] = 'dialog';
                this._handleError.handleError(errorObj);
                break;
        }
    }

}