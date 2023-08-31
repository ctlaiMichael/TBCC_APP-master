/**
 * 線上申貸同意條款(共用)
 */
import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { AgreeTermService } from './agree-term.service';
import { MortgageIncreaseService } from '../../service/mortgage-increase.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { FileUploadService } from '../file-upload/file-upload.service';
import { AuthService } from '@core/auth/auth.service';

@Component({
    selector: 'app-agree-term',
    templateUrl: './agree-term.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./agree-term.component.css'],
    providers: [AgreeTermService, FileUploadService]
})
export class AgreeTermComponent implements OnInit {
    /**
     * 參數處理
     */
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Input() type: string;
    @Input() agreeStep: string; //判斷房貸顯示，簡介or其他
    @Input() fullData: any; //前一頁傳來之reqData，這頁送電文用
    @Input() resver: string; //是否為預填單 'Y':預填,'N':非預填
    @Input() action: string; //紀錄返回狀態，'go':進入此頁，'back':返回此頁
    nowPage = '';
    //綁check ngModel
    checkInfo = {
        //房貸
        showCheck1: false, //同意條款，是否勾選
        showCheck2: false,
        //信貸
        showCheck4: false,
        showCheck5: false,
        //共用
        showAgree: false, //同意
        showNotAgree: false, //不同意
        showCheck3: false
    };
    termInfo = {}; //response
    apply_trade_detail = []; //行業別
    metier_detail = []; //職業別細項
    metier_sub_detail = []; //職業別分項
    detail = []; //同意事項內容
    termData = {
        agree: '', //客戶同意事項文件種類+是否同意或取得(Y/N/O)內容版號
        agreeJc: '', //是否同意查詢聯徵
        agreeJcVer: '', //是否同意查詢聯徵版號
        agreeCt: '', //是否同意借款契約
        agreeCtVer: '', //是否同意借款契約版號
        agreeTr: '', //是否同意約定條款
        agreeTrVer: '', //是否同意約定條款版號
        agreeCm: '', //是否同意共同行銷
        agreeCmVer: '', //是否同意共同行銷版號
        dataType_jc: '',
        dataType_ct: '',
        dataType_tr: '',
        dataType_cm: '',
        agreeCp: '', //是否同意專人聯絡
        trnsToken: '', //交易控制碼
        txKind: '' //種類
    };
    reqData = {
        custId: '',
        txKind: '' //A:房貸 B:信貸 C:信用卡
    };
    contract = ""; //契約書
    content = ""; //說明
    joint = ""; //聯徵同意書
    sale = ""; //共同行銷
    apply = ""; //申請書含條款
    title = "";
    //專人同意相關
    checkExpert = true;
    buttonTitle = '';

    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private navgator: NavgatorService
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private alert: AlertService
        , private _mainService: AgreeTermService
        , private _allService: MortgageIncreaseService
        , private _uiContentService: UiContentService
        , private _fileService: FileUploadService
        , private auth: AuthService
    ) {
    }

    ngOnInit() {
        this._logger.error("into single agree-terms!");
        this._logger.log("into terms type:", this.type);
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
        });
        this.doBack(); //處理返回往哪一頁
        this._logger.log("fullData:", this.fullData);
        let stageData = this._allService.getStageStaus();
        let stage = stageData['term'];
        this._logger.log("into init action:", this.action);
        //簡介頁面時才出現提示訊息
        if (this.agreeStep == 'first') {
            //先顯示提醒訊息
            this.alert.show('請您在提出申請之前務必到本行的網站(或向本行服務人員索取)審閱相關的契約條款內容以及本行對於個資法所告知的一切事項，並請您務必詳實的填寫以下的欄位，以免影響申請額度的權益。', {
                title: '提醒您',
                btnTitle: '了解',
            }).then(
                () => {
                }
            );
        }

        if (this.type == 'mortgage' || this.type == 'house') {
            this.termData.txKind = 'A';
            this.reqData.txKind = 'A';
            this.title = "房屋貸款";
            this.buttonTitle = '金額試算表';
         } else if (this.type == 'credit') {
            this.termData.txKind = 'B';
            this.reqData.txKind = 'B';
            this.title = "信用貸款";
            this.buttonTitle = '可貸額度試算';
        } else {
            this.termData.txKind = 'C';
        }
        //一進來先重置 職業資料
        // this._allService.resetJobData();
        //取得同意選單、職業類別、細項、分項
        if (this.agreeStep != 'first') { //近來如果是簡介，先不發，條款內容再發
            this._logger.log("into agreeStep !first:", this.agreeStep);
            this.getApi403(this.reqData);
        }
        if (this.action == 'back' && this.agreeStep != 'first') {
            this._logger.log("into 111111");
            this.setOutputData(false);
        } else if (stage == true && this.agreeStep != 'first') {
            this._logger.log("into 2222222222222222222 term stage true");
            this.setOutputData(stage);
        } else {
            this._logger.log("into 222222");
            //判斷
            if (this.type == 'credit') {
                this._logger.log("into 33333 credit");
                this.nowPage = 'agreePage';
                this.doScrollTop();
            } else {
                this.nowPage = 'agreePage-mortgage';
                //一進來顯示(簡介)
                if (this.agreeStep == 'first') {
                    this.nowPage = 'agreePage-mortgage';
                    this.doScrollTop();
                } else {
                    //房屋借款契約
                    this.nowPage = 'promisePage-mortgage';
                    this.doScrollTop();
                }
            }
        }
    }

    //同意條款,點擊立即申請
    onConfrim() {
        this._logger.error("into onConfrim()");
        if (this.type == 'credit') {
            this.agreeStep = 'another'; //非簡介
            this.getApi403(this.reqData);
        } else if (this.type == 'house') {
            this.agreeStep = 'another';
            this.getApi403(this.reqData);
        } else {
            //前往原案件(分行)
            this.onBackPageData({}, "first");
        }
    }
    //點擊金額試算表
    onCountForm() {
        if (this.type == 'mortgage') {
            this.navgator.push("https://www.tcb-bank.com.tw/internet_money/Documents/estate.htm");
        } else {
            this.navgator.push("http://www.tcb-bank.com.tw/aboutfinance/personal_finance/Pages/personloan.aspx");
        }
    }
    //點擊借款契約
    onProForm() {
        this._logger.error("into onProForm()");
        if (this.type == 'mortgage') {
            this.navgator.push("http://www.tcb-bank.com.tw/open_info/Documents/tcb_contract/tcb_contract.htm");
        } else {
            this.navgator.push("http://www.tcb-bank.com.tw/open_info/Documents/tcb_contract/tcb_contract.htm");
        }
    }
    //預填單(下方連結)
    resverHref() {
        this.navgator.push("https://www.tcb-bank.com.tw/others/Pages/privacy1.aspx");
    }
    //------------------------------ 借款契約 -------------------------------------------

    //約定條款1,上一步
    onBack1() {
        //信貸 => 信貸簡介
        if (this.type == 'credit') {
            this.action = 'go';
            this.nowPage = 'agreePage';
            //房貸 => 房貸簡介
        } else if (this.type == 'house') {
            this.action = 'go';
            this.nowPage = 'agreePage-mortgage';
            //房貸增貸 => 原案件
        } else {
            this.onBackPageData({}, "back");
        }
    }
    //約定條款1,下一步
    onNext1() {
        //信貸
        if (this.type == 'credit') {
            if (this.checkInfo.showCheck4 == true) {
                this.nowPage = 'promisePage2';
                this.doScrollTop();
            } else {
                this.alertMessage('empty');
            }
            //房貸
        } else {
            if (this.checkInfo.showCheck1 == true) {
                this.nowPage = 'promisePage2-mortgage';
                this.doScrollTop();
            } else {
                this.alertMessage('empty');
            }

        }
    }
    //約定條款2,上一步
    onBack2() {
        if (this.type == 'credit') {
            this.nowPage = 'promisePage';
            this.doScrollTop();
        } else {
            this.nowPage = 'promisePage-mortgage';
            this.doScrollTop();
        }
    }
    //約定條款2,下一步
    onNext2() {
        //信貸
        if (this.type == 'credit') {
            if (this.checkInfo.showCheck5 == true) {
                this.nowPage = 'salePage';
                this.doScrollTop();
            } else {
                this.alertMessage('empty');
            }
            //房貸
        } else {
            if (this.checkInfo.showCheck2 == true) {
                this.nowPage = 'salePage';
                this.doScrollTop();
            } else {
                this.alertMessage('empty');
            }
        }
    }
    //------------------------------ 共同行銷 -------------------------------------------
    onSaleBack() {
        if (this.type == 'credit') {
            this.nowPage = 'promisePage2';
            this.doScrollTop();
        } else {
            this.nowPage = 'promisePage2-mortgage';
            this.doScrollTop();
        }
    }
    onSaleNext() {
        if (this.checkInfo.showAgree == true && this.checkInfo.showNotAgree == false) {
            this._logger.log("into showAgree Y");
            this.termData.agreeCm = 'Y';
            this.nowPage = 'joinPage';
            this.doScrollTop();
        } else if (this.checkInfo.showNotAgree == true && this.checkInfo.showAgree == false) {
            this._logger.log("into showNotAgree N");
            this.termData.agreeCm = 'N';
            this.nowPage = 'joinPage';
            this.doScrollTop();
        } else if (this.checkInfo.showAgree == false && this.checkInfo.showNotAgree == false) {
            this._logger.log("into showAgree N ,showNotAgree N");
            this.alertMessage('empty');
        } else {
            this._logger.log("into showAgree Y ,showNotAgree Y");
            this.alertMessage('error');
        }
    }
    //------------------------------ 聯徵查詢 -------------------------------------------
    onJoinBack() {
        this.nowPage = 'salePage';
        this.doScrollTop();
    }
    onJoinNext() {
        this.onSaleNext(); //強制組裝agreeCm(返回時無組裝到)
        //送暫存，能走到最後一步，代表前面都勾同意，req直接送同意
        let saveTerm: any = {};
        if (this.checkInfo.showCheck3 == true) {
            let temp = []; //條款系列有值，就儲存
            this.detail.forEach(detailItem => {
                if (typeof detailItem['verno'] == 'object') {
                    detailItem['verno'] = '';
                }
                switch (detailItem.dataType) {
                    case '01':
                        if (detailItem['verno'] != null && typeof detailItem['verno'] != 'undefined' && detailItem['verno'] != ''
                            && detailItem['dataType'] != null && typeof detailItem['dataType'] != 'undefined' && detailItem['dataType'] != '') {
                            this.termData.agreeCtVer = this._formateService.checkField(detailItem, "verno"); //借款契約版號
                            this.termData.agreeCt = 'Y'; //是否同意借款契約版號
                            this.termData.dataType_ct = detailItem.dataType; //同意事項種類 借款契約
                            temp.push(this.termData.dataType_ct + this.termData.agreeCt + this.termData.agreeCtVer);
                        }
                        break;
                    case '02':
                        if (detailItem['verno'] != null && typeof detailItem['verno'] != 'undefined' && detailItem['verno'] != ''
                            && detailItem['dataType'] != null && typeof detailItem['dataType'] != 'undefined' && detailItem['dataType'] != '') {
                            this.termData.agreeTrVer = this._formateService.checkField(detailItem, 'verno'); //約定條款版號
                            this.termData.agreeTr = 'Y'; //是否同意約定條款版號
                            this.termData.dataType_tr = detailItem.dataType; //同意事項種類 約定條款
                            temp.push(this.termData.dataType_tr + this.termData.agreeTr + this.termData.agreeTrVer);
                        }
                        break;
                    case '0H':
                        if (detailItem['verno'] != null && typeof detailItem['verno'] != 'undefined' && detailItem['verno'] != ''
                            && detailItem['dataType'] != null && typeof detailItem['dataType'] != 'undefined' && detailItem['dataType'] != '') {
                            this.termData.agreeCmVer = this._formateService.checkField(detailItem, 'verno'); //共同行銷版號
                            this.termData.agreeCm = this.termData.agreeCm; //是否同意共同行銷
                            this.termData.dataType_cm = detailItem.dataType; //同意事項種類 共同行銷
                            temp.push(this.termData.dataType_cm + this.termData.agreeCm + this.termData.agreeCmVer);
                        }
                        break;
                    case 'JC':
                        if (detailItem['verno'] != null && typeof detailItem['verno'] != 'undefined' && detailItem['verno'] != ''
                            && detailItem['dataType'] != null && typeof detailItem['dataType'] != 'undefined' && detailItem['dataType'] != '') {
                            this.termData.agreeJcVer = this._formateService.checkField(detailItem, 'verno'); //聯徵同意版號
                            this.termData.agreeJc = 'Y'; //是否同意聯徵同意版號
                            this.termData.dataType_jc = detailItem.dataType; ////同意事項種類 聯徵同意
                            temp.push(this.termData.dataType_jc + this.termData.agreeJc + this.termData.agreeJcVer);
                        }
                        break;
                }
            });
            this.termData.agree = temp.join(';');
            // this.termData.agree = this.termData.dataType_ct + this.termData.agreeCt + this.termData.agreeCtVer
            //     + ";" + this.termData.dataType_tr + this.termData.agreeTr + this.termData.agreeTrVer +
            //     ";" + this.termData.dataType_cm + this.termData.agreeCm + this.termData.agreeCmVer +
            //     ";" + this.termData.dataType_jc + this.termData.agreeJc + this.termData.agreeJcVer;

            //專人聯絡同意事項
            if (this.checkExpert == true) {
                this.termData.agreeCp = 'Y';
            } else {
                this.termData.agreeCp = 'N';
            }

            let termCheckData = {
                //房貸
                showCheck1: false, //同意條款，是否勾選
                showCheck2: false,
                //信貸
                showCheck4: false,
                showCheck5: false,
                //共用
                showAgree: false, //同意
                showNotAgree: false, //不同意
                showCheck3: false,
                checkExpert: false //專人聯絡
            };

            //儲存checkBox狀態使用
            termCheckData.showCheck1 = this.checkInfo.showCheck1;
            termCheckData.showCheck2 = this.checkInfo.showCheck2;
            termCheckData.showCheck4 = this.checkInfo.showCheck4;
            termCheckData.showCheck5 = this.checkInfo.showCheck5;
            termCheckData.showAgree = this.checkInfo.showAgree;
            termCheckData.showNotAgree = this.checkInfo.showNotAgree;
            termCheckData.showCheck3 = this.checkInfo.showCheck3;
            termCheckData.checkExpert = this.checkExpert;
            this._allService.setTermData(termCheckData);

            //在進入下一個階段前，先發保持登入電文
            this.auth.keepLogin();
            this._allService.saveTermData(this.termData).then(
                (result) => {
                    saveTerm = result;
                    this._logger.log("term, saveTerm:", saveTerm);
                    if (saveTerm['status'] == true) {
                        this.alert.show('資料已暫存完畢，即將進入下一步驟。', {
                            title: '提醒您',
                            btnTitle: '了解',
                        }).then(
                            () => {
                                this.onBackPageData(saveTerm);
                            }
                        );
                    } else {
                        return false;
                    }
                },
                (errorObj) => {
                    this._logger.log("branch save error", errorObj);
                }
            );
        } else {
            this.alertMessage('empty');
        }

    }
    //點擊checkbox，控制勾選
    agree1(setype) {
        //信貸
        if (setype == 'credit') {
            if (this.checkInfo.showCheck4 == false) {
                this.checkInfo.showCheck4 = true;
            } else {
                this.checkInfo.showCheck4 = false;
            }
            //房貸
        } else {
            if (this.checkInfo.showCheck1 == false) {
                this.checkInfo.showCheck1 = true;
            } else {
                this.checkInfo.showCheck1 = false;
            }
        }
    }
    //點擊checkbox，控制勾選
    agree2(setype) {
        //信貸
        if (setype == 'credit') {
            if (this.checkInfo.showCheck5 == false) {
                this.checkInfo.showCheck5 = true;
            } else {
                this.checkInfo.showCheck5 = false;
            }
            //房貸
        } else {
            if (this.checkInfo.showCheck2 == false) {
                this.checkInfo.showCheck2 = true;
            } else {
                this.checkInfo.showCheck2 = false;
            }
        }
    }
    //同意，不同意反向， 點擊checkbox，控制勾選
    agreeEvent(setype) {
        //點同意
        if (setype == 'agree') {
            this._logger.log("into agree");
            if (this.checkInfo.showAgree == true) {
                this.checkInfo.showAgree = false;
            } else {
                this.checkInfo.showAgree = true;
            }
        } else {
            this._logger.log("into not agree");
            if (this.checkInfo.showNotAgree == false) {
                this.checkInfo.showNotAgree = true;
            } else {
                this.checkInfo.showNotAgree = false;
            }
        }
    }
    //點擊checkbox，控制勾選
    agree3() {
        if (this.checkInfo.showCheck3 == true) {
            this.checkInfo.showCheck3 = false;
        } else {
            this.checkInfo.showCheck3 = true;
        }
    }
    //專人同意事項
    selectExpert(setype) {
        if (setype == 'agree') {
            this.checkExpert = true;
        } else {
            this.checkExpert = false;
        }
    }


    //alert訊息
    alertMessage(setype) {
        //未勾選
        if (setype == 'empty') {
            this.alert.show('親愛的客戶您好，您尚未勾選同意條款', {
                title: '提醒您',
                btnTitle: '我知道了',
            }).then(
                () => {
                }
            );
            //選到不同意
        } else {
            this.alert.show('親愛的客戶您好，請勾選正確選項，否則無法進行後續流程操作', {
                title: '提醒您',
                btnTitle: '我知道了',
            }).then(
                () => {
                }
            );
        }
        return false;
    }

    //f9000403 約定條款查詢
    getApi403(reqData) {
        this._logger.log("into getApi403 function");
        //發送f9000403 取得條款資料，職業資料
        this._mainService.getTerm(reqData).then(
            (result) => {
                this._logger.log("term page, result:", result);
                this.termInfo = result.info_data; //資訊
                this.apply_trade_detail = result.apply_trade_detail; //行業別
                this.metier_detail = result.metier_detail; //職業別細項
                this.metier_sub_detail = result.metier_sub_detail; //職業別分項
                this.detail = result.detail; //同意事項內容
                this.termData.trnsToken = result.info_data.trnsToken; //交易控制
                this.detail.forEach((item) => {
                    switch (item.dataType) {
                        case '01': //借款契約
                            var newStringBlobDate = item.blobData.replace('合作金庫商業銀行&nbsp;&nbsp;', '合作金庫商業銀行<br/><br/>');
                            newStringBlobDate = newStringBlobDate.replace('電子信箱(E-MAIL)：https://www.tcb-', '電子信箱(E-MAIL)：https://www.tcb-<br>');
                            newStringBlobDate = newStringBlobDate.replace('bank.com.tw/quickarea/Pages/sevmail.aspx', '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bank.com.tw/quickarea/Pages/sevmail.aspx');
                            this.contract = newStringBlobDate;
                            break;
                        case '02': //約定條款重要說明
                            this.content = item.blobData;
                            break;
                        case '0H': //共同行銷
                            this.sale = item.blobData;
                            break;
                        case 'JC': //聯徵同意
                            this.joint = item.blobData;
                            break;
                        case 'A1': //申請書含條款
                            this.apply = item.blobData;
                            break;
                        default:
                            this._logger.log("into default");
                            break;
                    }
                });
                this._logger.log("detail:", this.detail);
                this._logger.log("contract:", this.contract);
                this._logger.log("content:", this.content);
                this._logger.log("sale:", this.sale);
                this._logger.log("joint:", this.joint);
                this._logger.log("apply:", this.apply);

                //儲存職業別資料
                let stageData = this._allService.getStageStaus();
                let stage = stageData['term'];
                if (this.action != 'back' && stage == false) {
                    this._allService.setJobData(this.apply_trade_detail, this.metier_detail, this.metier_sub_detail);
                }

                //第一次進入，或 儲存過資料返回時
                //非預填(登入)
                if (this.resver == 'N') {
                    //信貸
                    if (this.type == 'credit' && this.action != 'back') {
                        this.nowPage = 'promisePage'; //借款契約
                    }
                    //預填單
                } else {
                    //預填單無條款頁(條款相關req帶空)，直接進入kyc
                    this.onBackPageData();
                }

            },
            (errorObj) => {
                this._logger.log("term page, errorObj:", errorObj);
                errorObj['type'] = 'message';
                errorObj['button'] = 'PG_ONLINE.BTN.BACKLOAN';
                errorObj['backType'] = 'online-loan';
                this._handleError.handleError(errorObj);
            }
        );
    }

    doScrollTop() {
        this._uiContentService.scrollTop();
    }

    //處理返回事件
    doBack() {
        this._headerCtrl.setLeftBtnClick(() => {
            //房貸
            if (this.type == 'mortgage') {
                //當前頁數決定返回哪頁
                switch (this.nowPage) {
                    case 'agreePage-mortgage':
                        this.navgator.push("online-loan");
                        break;
                    case 'promisePage-mortgage':
                        this.onBackPageData({}, "back");
                        break;
                    case 'promisePage2-mortgage':
                        this.nowPage = 'promisePage-mortgage';
                        this.doScrollTop();
                        break;
                    case 'salePage':
                        this.nowPage = 'promisePage2-mortgage';
                        this.doScrollTop();
                        break;
                    case 'joinPage':
                        this.nowPage = 'salePage';
                        this.doScrollTop();
                        break;
                    default:
                        this._logger.log("no page");
                        break;
                }
                //房屋貸款
            } else if (this.type == 'house') {
                //當前頁數決定返回哪頁
                switch (this.nowPage) {
                    case 'agreePage-mortgage':
                        this.navgator.push("online-loan-desk");
                        break;
                    case 'promisePage-mortgage':
                        this.action = 'go';
                        this.nowPage = 'agreePage-mortgage';
                        this.doScrollTop();
                        break;
                    case 'promisePage2-mortgage':
                        this.nowPage = 'promisePage-mortgage';
                        this.doScrollTop();
                        break;
                    case 'salePage':
                        this.nowPage = 'promisePage2-mortgage';
                        this.doScrollTop();
                        break;
                    case 'joinPage':
                        this.nowPage = 'salePage';
                        this.doScrollTop();
                        break;
                    default:
                        this._logger.log("no page");
                        break;
                }
            }
            //信貸
            else {
                switch (this.nowPage) {
                    case 'agreePage':
                        this.navgator.push("online-loan");
                        break;
                    case 'promisePage':
                        this.action = 'go';
                        this.nowPage = 'agreePage';
                        this.doScrollTop();
                        break;
                    case 'promisePage2':
                        this.nowPage = 'promisePage';
                        this.doScrollTop();
                        break;
                    case 'salePage':
                        this.nowPage = 'promisePage2';
                        this.doScrollTop();
                        break;
                    case 'joinPage':
                        this.nowPage = 'salePage';
                        this.doScrollTop();
                        break;
                    default:
                        this._logger.log("no page");
                        break;
                }
            }
        });
    }

    //解Base64
    // getBase64Encode(detail) {
    //     detail.forEach(item_detail => {
    //         if (item_detail.blobData != '' || typeof item_detail.blobData !== 'undefined'
    //             || item_detail.blobData != null) {
    //             this.cryptoService.Base64Encode(item_detail.blobData).then(
    //                 (result) => {
    //                     this._logger.log('Base64Encode', result);
    //                     item_detail.blobData = result.value;
    //                     this._logger.log("Base64Encode, item_detail.blobData:", item_detail.blobData);
    //                 }
    //                 ,
    //                 (errorObj) => {
    //                     this._logger.log('Base64Encode errorObj', errorObj);
    //                     errorObj['type'] = 'message';
    //                     this._handleError.handleError(errorObj);
    //                 }
    //             );
    //         }
    //     });
    // }

    /**
  * 返回上一層
  * @param item
  */
    onBackPageData(item?: any, pageType?) {
        // 返回最新消息選單
        let output = {
            'page': 'agree',
            'type': 'go',
            'data': item
        };
        if (pageType == 'first') {
            this._logger.log("into agree first go");
            output.page = 'agree-first';
            output.type = 'first-go';
        }
        if (pageType == 'back') {
            this._logger.log("into agree back");
            output.page = 'agree';
            output.type = 'back';
        }
        this.backPageEmit.emit(output);
    }


    /**
         * 子層返回事件(分頁)
         * @param e
         */
    onPageBackEvent(e) {
        this._logger.step('Deposit', 'onPageBackEvent', e);
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
        }
        if (page == 'kyc') {
            this.nowPage = 'joinPage';
        }
    }


    /**
 * 失敗回傳(分頁)
 * @param error_obj 失敗物件
 */
    onErrorBackEvent(e) {
        this._logger.step('Deposit', 'onErrorBackEvent', e);
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
        // 列表頁：首次近來錯誤推頁
        errorObj['type'] = 'dialog';
        this._handleError.handleError(errorObj);
    }

    //返回塞入存取狀態
    setOutputData(stage) {
        this._logger.log("into setOutputData function");
        let backTermData = this._allService.getTermData();
        this.checkInfo.showCheck1 = backTermData.showCheck1;
        this.checkInfo.showCheck2 = backTermData.showCheck2;
        this.checkInfo.showCheck4 = backTermData.showCheck4;
        this.checkInfo.showCheck5 = backTermData.showCheck5;
        this.checkInfo.showAgree = backTermData.showAgree;
        this.checkInfo.showNotAgree = backTermData.showNotAgree;
        this.checkInfo.showCheck3 = backTermData.showCheck3;
        this.checkExpert = backTermData.checkExpert;
        this._logger.log("backTermData:", this._formateService.transClone(backTermData));
        this._logger.log("agreeStep:", this.agreeStep);
        if (stage == true) {
            if (this.type == 'mortgage' || this.type == 'house') {
                this.nowPage = 'promisePage-mortgage'; //第一頁
            } else {
                this.nowPage = 'promisePage'; //第一頁
            }
        } else {
            this.nowPage = 'joinPage'; //聯徵
        }
        this._logger.log("nowPage:", this.nowPage);
    }

}

