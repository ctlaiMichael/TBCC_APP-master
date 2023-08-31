/**
 * 額度調整
 */
import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { CardQuotaService } from '../../shared/service/card-quota/card-quota.service';
import { AuthService } from '@core/auth/auth.service';
import { SmsService } from '@shared/transaction-security/sms/sms.service';
import { CheckService } from '@shared/check/check.service';
import { UserCheckUtil } from "@shared/util/check/data/user-check-util";
import { AlertService } from '@shared/popup/alert/alert.service';
import { UserMaskUtil } from '@shared/util/formate/mask/user-mask-util';


@Component({
    selector: 'app-card-quota',
    templateUrl: './card-quota.component.html',
    styleUrls: [],
    providers: []
})
export class CardQuotaComponent implements OnInit {

    setType = '';
    popupFlag = false;
    nowPage = 'page1'; //當前頁面
    errorMsg = {
        quotaAmount: '', //額度金額
        reason: '', //原因
        cardNumer: '', //卡號
        applyDate: '', //申請日
        endDate: '', //申請迄日
        cityPhone: '', //市內電話
        applyTelExt: '' //分機
    };
    //目前額度
    nowQuota = '0';
    //按鈕相關
    buttonBind = {
        quotaCheck: true, //選擇申請類別，額度
        agree: false //是否詳閱
    };
    //fc001003 request
    basicReq = {
        custId: '',
        type: '' //0:額度調整，1:補件上傳
    };
    basicData: any; //fc001003取得(基本資訊、額度資訊)
    messageData: any; //fc001009,fc001010回傳
    cardList: any; //信用卡相關資訊，卡號、額度

    //fc001004 request：額度調整 ，以下欄位皆會變動(先自訂，api規格未出)
    reqData = {
        custId: '',
        cardAccount: '', //信用卡號
        applyType: '0', //申請類別 => 0:臨時額度，1:永久額度
        applyDate: '', //申請日
        endDate: undefined, //申請迄日
        applyAmount: '', //申請額度
        applyReason: '', //申請原因
        cellPhone: '', //手機號碼
        cityPhone: '' //市內電話
    };
    //電話欄位，綁定使用，送出時將電話、分機組合，帶入reqData
    bindPhoneData = {
        cityPhone: '', //市內電話
        applyTelExt: '' //分機
    };
    //----- 文件上傳相關 -----
    //fc001005 文件上傳request
    picReqData: any
    loadStatus = ''; //上傳狀態：'0':稍後上傳，'1'：1~5張，'2':全部傳
    //確認頁、結果頁需顯示隻資料(非發api)
    anotherData = {
        custId: '',
        chineseName: ''
    };
    resultData: any; //接收，確認頁發送結果api回傳
    //日期相關
    nextwoekDay;
    date_placeholder="請輸入交易迄日"
    markPhone="";   //手機隱碼
    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private _mainService: CardQuotaService
        , private navgator: NavgatorService
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private _uiContentService: UiContentService
        , private authService: AuthService
        , private _msgUpService: SmsService
        , private _checkService: CheckService
        , private alert: AlertService
    ) {
    }

    ngOnInit() {
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': '額度調整',
            'style': 'normal'
        });
        this.doBack();
        const userData = this.authService.getUserInfo(); //取得使用者狀態
        if (!userData.hasOwnProperty('custId') || userData.custId == '') {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }

        this.basicReq.custId = userData.custId;
        this.basicReq.type = '0'; //額度調整
        this._logger.log("basicReq:", this.basicReq);

        //發送額度調整查詢 fc001003
        this._mainService.getBaicData(this.basicReq).then(
            (result) => {
                this._logger.log("getData, result:", result);
                this.basicData = result;
                this.cardList = result['cardList'];
                this._logger.log("cardList:", this.cardList);
                this.nextwoekDay=this.basicData['info_data']['nextWorkDay'];//最近營業日
                this.nextwoekDay = this._formateService.transDate(this.nextwoekDay , { formate: 'yyyy/MM/dd', chinaYear: false });
                this.reqData.applyDate=this.nextwoekDay;//預設
                this.markPhone=UserMaskUtil.phone(this.basicData['info_data']['cellPhone']);  
                this._logger.log("markPhone:", this.markPhone);
                // this.reqData.endDate="請選擇交易迄日";
            },
            (errorObj) => {
                this._logger.log("getData, errorObj:", errorObj);
                errorObj['type'] = 'message';
                errorObj['backType']='2';
                this._handleError.handleError(errorObj);
            }
        );

    }

    //第一頁：
    //發送簡訊
    onSummit() {
        //fc001009 reqest其他欄位未開，待補
        let reqData = {
            custId: this.basicReq['custId'],
            phone: this.basicData['info_data']['cellPhone']
        };
        this.sendApiData(reqData);
    }
    onCancel() {
        this.navgator.push("web:card");
    }

    //發送簡訊密碼請求，
    sendApiData(setData) {
        this._logger.log("into sendAPi, setData:", setData);
        this._mainService.getMessageData({ reqData: setData }).then(
            (ressult) => {
                this._logger.log("sendAPi success, ressult:", ressult);
                this.messageData = ressult;
                this.nowPage = 'page2';
            },
            (errorObj) => {
                this._logger.log("sendAPi errorObj:", errorObj);
                //     if (errorObj.hasOwnProperty('ERROR')) {
                //     this._logger.log("into user cancel");
                //     this._handleError.handleError({
                //         type: 'alert',
                //         title: '提示',
                //         content: errorObj['ERROR']['content']
                //     });
                // }

                //若使用者取消 or 簡訊發送逾時 or API回應錯誤
                //*2020/05/25 往後有可能需判斷不能輸入錯誤5次，第5次推頁
                if (errorObj.hasOwnProperty('ERROR') && (errorObj['ERROR']['errorCode'] == 'USER_CANCEL' ||
                    errorObj['ERROR']['errorCode'] == 'TIME_ERROR' || errorObj['ERROR']['errorCode'] == 'errorApi')) {
                    this._logger.log("into user cancel");
                    this._handleError.handleError({
                        type: 'alert',
                        title: '提示',
                        backType:'2',
                        content: errorObj['ERROR']['content']
                    });
                } else {
                    this._logger.log("another error");
                    errorObj['type'] = 'message';
                    errorObj['content']=errorObj['ERROR']['content'];
                    errorObj['backType']='2';
                    this._handleError.handleError(errorObj);
                }
            }
        );
    }

    //第二頁：
    //type：0 臨時額度，1 永久額度
    selectQuota(type) {
        if (type == '0') {
            this.buttonBind.quotaCheck = true;
            this.reqData.applyType = '0';
        } else {
            this.buttonBind.quotaCheck = false;
            this.reqData.applyType = '1';
            //切換為「永久額度」還原「申請迄日」值，「永久額度」不可設定「申請迄日」
            this.reqData.endDate = '';
            this.errorMsg.endDate = '';
        }
    }
    //信用卡切換
    cardChange() {
        this._logger.log("into cardChange, reqData.cardAccount:", this.reqData.cardAccount);
        //目前額度根據所選卡號切換
        if (this.cardList.hasOwnProperty(this.reqData.cardAccount)) {
            this._logger.log("has Property reqData.cardAccount");
            this.nowQuota = this.cardList[this.reqData.cardAccount];
        } else {
            this._logger.log("has no Property reqData.cardAccount");
            this.nowQuota = '0';
        }
        this._logger.log("nowQuota:", this.nowQuota);
    }
    //已詳閱
    agree() {
        if (this.buttonBind.agree == false) {
            this.buttonBind.agree = true;
        } else {
            this.buttonBind.agree = false;
        }
    }
    onPage2Cancel() {
        this.popupFlag = false;
        this.nowPage = 'page1';
        this._uiContentService.scrollTop();
    }
    onPage2Confirm() {
        this._logger.log("into onPage2Confirm, reqData:", this.reqData);
        let checkEdit = this.checkEditData(); //檢核編輯頁
        if (checkEdit['status'] == false) {
            return false;
        } else {
            //編輯頁檢核成功後，組裝電話req，電話#分機 ex:0227565585#66526 
            this.reqData.cityPhone = this.bindPhoneData.cityPhone + '#' + this.bindPhoneData.applyTelExt;
            this.reqData.cellPhone = this.basicData['info_data']['cellPhone'];
            this.reqData.custId = this.basicReq['custId'];
            this._logger.log("checkEdit success, reqData:", this.reqData);
            this.nowPage = 'page3';
            this._uiContentService.scrollTop();
        }
    }
    /**
 * 日期選擇返回事件
 * @param e
 */
    onDateBack(e) {
        this._logger.log("onDateBack, e:", e);
        if (this.reqData.applyDate.indexOf('-') > 0) {
            this.reqData.applyDate = this.reqData.applyDate.replace(/-/g, '/');
        }
    }
    onEndBack(e) {
        this._logger.log("onEndBack, e:", e);
        if (this.reqData.endDate.indexOf('-') > 0) {
            this.reqData.endDate = this.reqData.endDate.replace(/-/g, '/');
        }
    }
    //檢核編輯頁輸入
    checkEditData() {
        let output = {
            status: false,
            msg: '',
            checkType: '' //申請類別
        };
        //日期檢核使用
        let setDate = {
            applyDate: this.reqData['applyDate'],
            endDate: this.reqData['endDate'],
            nextWorkDay: this.basicData['info_data']['nextWorkDay']
        };
        //臨時額度
        if (this.buttonBind.quotaCheck) {
            output.checkType = '0';
            this._logger.log("into output.checkType = 0");
            //檢核申請起日
            let checkApplyDate = this._mainService.checkApplyDate(setDate['applyDate'], setDate['nextWorkDay']);
            if (checkApplyDate['status'] == false) {
                this._logger.log("checkApplyDate error, checkApplyDate:", checkApplyDate);
                this.errorMsg.applyDate = checkApplyDate['msg'];
            } else {
                this._logger.log("checkApplyDate success, checkApplyDate:", checkApplyDate);
                this.errorMsg.applyDate = '';
            }
            //檢核申請迄日
            let checkEndDate = this._mainService.checkEndDate(setDate['endDate'], setDate['applyDate']);
            if (checkEndDate['status'] == false) {
                this._logger.log("checkEndDate error, checkEndDate:", checkEndDate);
                this.errorMsg.endDate = checkEndDate['msg'];
            } else {
                this._logger.log("checkEndDate success, checkEndDate:", checkEndDate);
                this.errorMsg.endDate = '';
            }
            //若申請、迄日都檢核成功，再檢核「兩者區間不可超過90日」
            if (checkApplyDate['status'] == true && checkEndDate['status'] == true) {
                this._logger.log("checkApplyDate['status'] == true && checkEndDate['status'] == true");
                let checkEndStartDate = this._mainService.checkEndtoStartDate(setDate['endDate'], setDate['applyDate']);
                if (checkEndStartDate['status'] == false) {
                    this.errorMsg.endDate = checkEndStartDate['msg'];
                    this.errorMsg.applyDate = checkEndStartDate['msg'];
                } else {
                    this.errorMsg.endDate = '';
                    this.errorMsg.applyDate = '';
                }
            }
            //永久額度
        } else {
            output.checkType = '1';
            this._logger.log("into output.checkType = 1");
            //檢核申請起日
            let checkApplyDate = this._mainService.checkApplyDate(setDate['applyDate'], setDate['nextWorkDay']);
            if (checkApplyDate['status'] == false) {
                this._logger.log("checkApplyDate error, checkApplyDate:", checkApplyDate);
                this.errorMsg.applyDate = checkApplyDate['msg'];
            } else {
                this._logger.log("checkApplyDate success, checkApplyDate:", checkApplyDate);
                this.errorMsg.applyDate = '';
            }
        }
        //檢核信用卡
        if (this.reqData.cardAccount == '') {
            this.errorMsg.cardNumer = '請選擇信用卡卡號';
        } else {
            this.errorMsg.cardNumer = '';
        }
        //檢核輸入金額
        let checkApplyAmount = this._checkService.checkMoney(this.reqData.applyAmount, { currency: 'TWD' });
        if (checkApplyAmount['status'] == false || this.reqData.applyAmount == '') {
            this._logger.log("checkApplyAmount error, checkApplyAmount:", checkApplyAmount);
            this.errorMsg.quotaAmount = checkApplyAmount['msg'];
        } else {
            //申請金額須大於目前額度
            if (parseInt(this.reqData.applyAmount) < parseInt(this.nowQuota)) {
                this._logger.log("into error, applyAmount < nowQuota");
                this.errorMsg.quotaAmount = '申請金額須大於目前額度';
            } else {
                this._logger.log("into checkApplyAmount success");
                this.errorMsg.quotaAmount = '';
            }
        }
        //檢核申請原因
        if (this.reqData.applyReason == '') {
            this._logger.log("into error, applyReason");
            this.errorMsg.reason = '請選擇申請原因';
        } else {
            this.errorMsg.reason = '';
        }
        //檢核室內電話
        if(this.bindPhoneData.cityPhone!=""){
            let checkCityPhone = UserCheckUtil.checkTel(this.bindPhoneData.cityPhone);
            if (checkCityPhone['status'] == false) {
                this.errorMsg.cityPhone = checkCityPhone['msg'];
            } else {
                this.errorMsg.cityPhone = '';
            }
        }
        //檢核分機
       if(this.bindPhoneData.applyTelExt!=""){
            let checkApplyTelExt = this._checkService.checkNumber(this.bindPhoneData.applyTelExt);
            if (checkApplyTelExt['status'] == false) {
                this.errorMsg.applyTelExt = checkApplyTelExt['msg'];
            } else {
                this.errorMsg.applyTelExt = '';
            }
       }
        
        //檢核是否勾同意事項
        if (this.buttonBind.agree == false) {
            this.alert.show('您未勾選申請同意事項。', {
                title: '提醒您',
                btnTitle: '了解',
            }).then(
                () => {
                }
            );
        }
        //最後檢核，都過status == true
        //臨時額度
        if (output.checkType == '0') {
            if (this.errorMsg.applyDate == '' && this.errorMsg.endDate == '' && this.errorMsg.cardNumer == ''
                && this.errorMsg.quotaAmount == '' && this.errorMsg.reason == '' && this.errorMsg.cityPhone == ''
                && this.errorMsg.applyTelExt == '' && this.buttonBind.agree == true) {
                this._logger.log("into last check, output.checkType == 0, success");
                output.status = true;
            } else {
                this._logger.log("into last check, output.checkType == 0, error");
                output.status = false;
            }
            //永久額度
        } else {
            if (this.errorMsg.applyDate == '' && this.errorMsg.cardNumer == '' && this.errorMsg.quotaAmount == ''
                && this.errorMsg.reason == '' && this.errorMsg.cityPhone == '' && this.errorMsg.applyTelExt == ''
                && this.buttonBind.agree == true) {
                this._logger.log("into last check, output.checkType == 1, success");
                output.status = true;
            } else {
                this._logger.log("into last check, output.checkType == 1, error");
                output.status = false;
            }
        }
        return output;
    }

    //接收子層返回
    backPageEmit(e) {
        let page = 'list';
        let pageType = 'list';
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
            if (e.hasOwnProperty('loadStatus')) {
                this.loadStatus = e.loadStatus;
            }
            this._logger.log("page:", page);
            this._logger.log("pageType:", pageType);
            this._logger.log("tmp_data:", tmp_data);
            //進下一步
            if (pageType == 'go') {
                if (page == 'upload') {
                    this._logger.log("backPageEmit, upload back to go confirm");
                    this._logger.log("tmp_data:", tmp_data);
                    this._logger.log("reqData:", this.reqData);
                    this.picReqData = tmp_data;
                    //確認、解果頁需顯示隻資料(非發api)
                    this.anotherData.chineseName = this.basicData['info_data']['chineseName'];
                    this.anotherData.custId = this.basicReq.custId;
                    this.nowPage = 'confirm';
                }
                if (page == 'confirm') {
                    this._logger.log("backPageEmit, confirm back to go resultPage");
                    this.resultData = tmp_data; //儲存結果api回傳資訊，帶入結果頁
                    this.nowPage = 'result';
                }
                //返回上一步or取消
            } else {
                this._logger.log("backPageEmit, confirm back");
                if (page == 'upload') {
                    this._logger.log("into upload back to edit");
                    this.nowPage = 'page2';
                }
                if (page == 'confirm') {
                    this.navgator.push('web:card');
                }
            }
        }
    }

    //返回流程
    doBack() {
        this._headerCtrl.setLeftBtnClick(() => {
            switch (this.nowPage) {
                case 'page1':
                    this.navgator.push('card-quota-menu');
                    break;
                case 'page2':
                    this.popupFlag = false;
                    this.nowPage = 'page1';
                    this._uiContentService.scrollTop();
                    break;
                case 'page3':
                    this.nowPage = 'page2';
                    this._uiContentService.scrollTop();
                    break;
                case 'page4':
                    this.nowPage = 'page3';
                    this._uiContentService.scrollTop();
                    break;
                default:
                    this.nowPage = 'page1';
                    this._uiContentService.scrollTop();
                    break;
            }
        });
    }
}
