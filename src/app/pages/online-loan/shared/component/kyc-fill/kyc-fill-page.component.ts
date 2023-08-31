/**
 * 線上申貸--KYC表單(共用)
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FormateService } from '@shared/formate/formate.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { KycFillPageService } from './kyc-fill-page.service';
import { CheckService } from '@shared/check/check.service';
import { MortgageIncreaseService } from '../../service/mortgage-increase.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { AuthCheckUtil } from '@shared/util/check/word/auth-check-util';
import { AuthService } from '@core/auth/auth.service';


@Component({
    selector: 'app-kyc-fill',
    templateUrl: './kyc-fill-page.component.html',
    styleUrls: [],
    providers: [KycFillPageService]
})

export class KycFillPageComponent implements OnInit {
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Input() type: string;
    @Input() fullData: any; //前一頁傳來之reqData，這頁送電文用
    @Input() resver: string; //是否為預填單 'Y':預填,'N':非預填
    @Input() action: string; //紀錄返回狀態，'go':進入此頁，'back':返回此頁
    /**
     * 新規則：kyc借款用途不存，值存「資金用途」table欄位，借款用途欄位eloan會處理
     */
    //下一流程需要
    reqData: any = {
        custId: '', //身分證字號
        rep_name: '', //申請人姓名
        txKind: '', //申請種類
        give_amt: '', //申請金額
        give_dur_yymm: '', //貸款期間
        applyTrade: '', //行業別
        metier: '', //職業別細項
        metier_sub: '', //職業別分項
        m_year: '', //最近財務收支年度
        apply_nt: '', //年收入-本人
        total_nt: '', //年收入-合計(家庭)
        expense: '', //年支出(家庭)
        kycYn: '', //本人識字且採用國語作為本次個人貸款客戶K Y C表之填答方式
        kycloanUsage: '', //借款用途
        loanUsage: '', //資金用途
        kycold: '', //年齡
        kycEtch: '', //票據帳戶使用狀況
        kycEtchNo: '', //票據帳戶使用狀況-退票未註銷張數
        kycBankel: '', //銀行貸款狀況
        kycCard: '', //信用卡使用狀況
        kycPayMo: '', //銀行貸款每月應繳金額
        kycElamt: '', //貸款餘額
        kycElmo: '', //原貸款總金額
        kycKo: '1', //本人已填妥「個人貸款客戶KYC表」無誤
        name: '', //姓名
        id_no: '', //身分證字號
        applyBir: '' //出生年月日(預填單的狀況才有值)
    };
    personalData: any = {}; //基本資料
    jobData: any = {}; //職業別資料
    //確認頁顯示狀態相關欄位
    showStatus = {
        usage: '', //借款用途
        kycEtch: '', //票據帳戶使用狀況
        kycBankel: '', //銀行貸款狀況
        kycCard: '', //信用卡使用狀況
        applyTrade: '', //行業別 確認頁使用
        metier: '', //職業別細項 確認頁使用
        metier_sub: '', //職業別分項 確認頁使用
        kycPayMo: '' //每月應繳金額
    };
    nowPage = "basicPage1"; //現在頁面

    ticketData = {
        ticketTemp: [
            { type: '1', name: '未開立帳戶' },
            { type: '2', name: '正常' },
            { type: '3', name: '一年內有退補紀錄' },
            { type: '4', name: '退票未註銷' },
            { type: '5', name: '拒絕往來戶' },
        ]
    };
    ticketFlag = false;
    bankData = {
        bankTemp: [
            { type: '1', name: '無借款' },
            { type: '2', name: '履約正常' },
            { type: '3', name: '偶有遲延，目前正常' },
            { type: '4', name: '尚無法正常履約' },
            { type: '5', name: '催收戶' },
        ]
    };
    creditData = {
        creditTemp: [
            { type: '1', name: '未申請' },
            { type: '2', name: '每期全額繳清' },
            { type: '3', name: '使用循環信用' },
            { type: '4', name: '自行停卡不用' },
            { type: '5', name: '強制停卡中' },
        ]
    };
    //期限
    yearData = ['01', '02', '03', '04', '05', '06', '07'];
    // 借款金額
    amtData = [];
    //借款用途
    usageData = {
        usageTemp: []
    };
    //最近兩年
    mYearData = [];
    //檢核相關
    check_error = {
        //第一頁
        check_give_amt: false, //申請金額(錯誤紅框)
        give_amt_error: '', // 申請金額(錯誤訊息)
        check_give_dur_yymm: false, //申請期限
        give_dur_yymm_error: '', //申請期限 訊息
        check_kycLoan_usage: false, //借款用途
        kycLoan_usage_error: '', //借款用途 訊息
        check_kycEtch: false, //票據帳戶使用狀況
        kycEtch_error: '', //票據帳戶使用狀況 訊息
        check_kycBankel: false, //銀行貸款狀態
        kycBankel_error: '', //銀行貸款狀態 訊息
        check_kycCard: false, //信用卡狀況
        kycCard_error: '', //信用卡狀況 訊息
        check_applyTrade: false, //行業別
        applyTrade_error: '', //行業別 紅框
        check_metier: false, //職業別細項
        metier_error: '', //職業別 紅框
        check_metier_sub: false, //職業別分項
        metier_sub_error: '', //職業別分項 紅框
        name_error: '', //姓名(預填單才檢核)
        id_no_error: '', //身分證字號(預填單才檢核)
        kycold_error: '', //年齡(預填單才檢核)
        error_applyBir: '', //出生年月日(預填單才會出現此欄位)
        status: false, // 關閉紓困
        
        //第二頁
        check_m_year: false, //財務收入年度
        m_year_error: '', //財務收入年度 訊息
        check_apply_nt: false, //個人年收入
        apply_nt_error: '', //個人年收入 訊息
        check_total_nt: false, //家庭年收入
        total_nt_error: '', //家庭年收入 訊息
        check_expense: false, //家庭支出
        expense_error: '', //家庭支出 訊息
        check_kycPayMo: false, //每月應繳
        kycPayMo_error: '', //每月應繳 訊息
        check_kycElamt: false, //貸款餘額
        kycElamt_error: '', //貸款餘額 訊息
        check_kycElmo: false, //原貸款總金額
        kycElmo_error: '', //原貸款總金額 訊息
        check_kycEtchNo: false, //張數
        kycEtchNo_error: '' //張數 訊息
    };
    select_sub = []; //職業別分項
    select_sub_flag = false; //是否顯示職業別分項
    specialJobFlag = false; //是否為特殊職業
    select_loage = {}; //選擇之借款用途資料，帶入409req判斷
    default_job: any = {}; //kyc選擇之職業資料，帶入申請書預設

    minDay = '';      // 日期可選之最小值
    maxDay = '';      // 日期可選之最大值
    status = 'Y';
    constructor(
        private _logger: Logger
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private _formateService: FormateService
        , private navgator: NavgatorService
        , private alert: AlertService
        , private _mainService: KycFillPageService
        , private _allService: MortgageIncreaseService
        , private _checkService: CheckService
        , private _uiContentService: UiContentService
        , private headerCtrl: HeaderCtrlService
        , private auth: AuthService
    ) { }

    ngOnInit() {
        this._logger.error("into kyc module!");
        this._logger.log("resver:", this.resver);
        this._logger.log("type:", this.type);
        this._logger.log("fullData:", this.fullData);
        this._logger.log("kyc action:", this.action);
        this._logger.log("****into kyc allData:", this._allService.allData);
        this._logger.log("into nowPage:", this.nowPage);
        let stageData = this._allService.getStageStaus();
        let stage = stageData['kyc'];
        this._logger.log("stageData:", stageData);
        this._logger.log("stage:", stage);

        this.jobData = this._allService.getJobData(); //取得職業資料 (f9000403取得)
        this._logger.log("kyc get getJobData:", this.jobData);

        // this._mainService.getClose().then(
        //     (result) => {
        //         this._logger.log("result:", result);
        //         this.status = result.info_data.status;
                
        //     },
        //     (errorObj) => {
        //         this._logger.log("errorObj:", errorObj);
        //         // this.onErrorBackEvent(errorObj, 'errorBack');
        //     }
        // );
        
        //預填    kind:'1'信貸 '2'房貸增貸 '3'信貸預填 '4'房貸預填
        if (this.resver == 'Y') {
            let temp = [{ type: '01', name: '新購屋' }, { type: '02', name: '購屋轉貸' }, { type: '03', name: '修繕貸款' }, { type: '04', name: '家庭生活支出' }, { type: '05', name: '理財投資用途' }];
            let temp2 = [{ type: '01', name: '新購屋' }, { type: '02', name: '購屋轉貸' }, { type: '03', name: '修繕貸款' }, { type: '04', name: '家庭生活支出' }, { type: '05', name: '理財投資用途' }];
            if (this.type == 'house') {
                this.reqData.txKind = 'D'; //房屋貸款
                this.usageData.usageTemp = temp2;
                this.yearData = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
                //若為上一頁返回，需執行資料回傳(顯示之前使用者輸入之資料)
                if (this.action == 'back') {
                    this._logger.log("house, into back");
                    this.setOutputData(false); //返回使用
                    this.doDate();
                } else if (stage == true && this.action == 'go') {
                    this._logger.log("house, into stage == true");
                    this.setOutputData(stage); //返回使用(使用者以儲存過資料)
                    this.doDate();
                } else {
                    this.doDate(); //沒返回過
                }
            } else if (this.type == 'credit') {
                this.reqData.txKind = 'B'; //信貸預填單
                this.usageData.usageTemp = temp;
                this.yearData = ['05', '06', '07'];
                //若為上一頁返回，需執行資料回傳(顯示之前使用者輸入之資料)
                if (this.action == 'back') {
                    this._logger.log("credit, into back");
                    this.setOutputData(false); //返回使用
                    this.doDate();
                } else if (stage == true && this.action == 'go') {
                    this._logger.log("credit, into stage == true");
                    this.setOutputData(stage); //返回使用(使用者以儲存過資料)
                    this.doDate();
                } else {
                    this.doDate(); //沒返回過
                }
            }
            //非預填(登入)
        } else {
            let temp = [{ type: '02', name: '消費性支出' }];
            let temp2 = [{ type: '05', name: '理財投資用途' }, { type: '04', name: '家庭生活支出' }];
            if (this.type == 'mortgage') {
                this.reqData.txKind = 'A'; //房貸增貸
                this.usageData.usageTemp = temp2;
                this._logger.log("into type mortgage, temp2:", temp2);
                this._logger.log("into type mortgage, usageData.usageTemp:", this.usageData.usageTemp);
                this.yearData = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
                //若為上一頁返回，需執行資料回傳(顯示之前使用者輸入之資料)
                if (this.action == 'back') {
                    this._logger.log("mortgage, into back");
                    this.setOutputData(false); //返回使用
                } else if (stage == true && this.action == 'go') {
                    this._logger.log("mortgage, into stage == true");
                    this.setOutputData(stage); //返回使用(使用者以儲存過資料)
                }
            } else if (this.type == 'credit') {
                this.reqData.txKind = 'B'; //信貸
                // this.usageData.usageTemp = [{ type: '02', name: '消費性支出' },{ type: '09', name: '勞工紓困' }];
                this.usageData.usageTemp = [{ type: '02', name: '消費性支出' }];
                this.yearData = ['05', '06', '07'];
                //若為上一頁返回，需執行資料回傳(顯示之前使用者輸入之資料)
                if (this.action == 'back') {
                    this._logger.log("credit resver, into back");
                    this.setOutputData(false); //返回使用
                } else if (stage == true && this.action == 'go') {
                    this._logger.log("credit resver, into stage == true");
                    this.setOutputData(stage); //返回使用(使用者以儲存過資料)
                }
            }
        }

        //同意條款進kyc才需顯示，申請書返回時不須顯示
        if (this.action == 'go') {
            this.alert.show('本人識字且採用國語作為本次個人貸款客戶K Y C表之填答方式：', {
                title: '',
                btnTitle: '同意',
            }).then(
                () => {
                    this.reqData['kycYn'] = '1';
                }
            );
        }

        this.mYearData = this._mainService.getRecentYear(); //財務年收支
        this._logger.log("mYearData:", this.mYearData);
        this._allService.setMYear(this.mYearData);
        //有登入才需取得 f9000401使用者相關資料(非預填)，預填單自行輸入
        if (this.resver == 'N') {
            this.personalData = this._allService.getPersonalData(); //取得基本暫存資料，*response無年齡欄位，待確認
            this.reqData.id_no = this.personalData.id_no; //基本資料 身分證 => req
            this.reqData.name = this.personalData.name; //基本資料 中文戶名 => req
            this.reqData.kycold = this._mainService.getAge(this.personalData.birth_date); //取得年齡
            this._logger.log("kyc get personalData:", this.personalData);
        }

        this.doBack();
    }

    usageChange(){
        if(this.status == 'Y'){
            if (this.reqData['kycloanUsage'] == '09'){
                this.yearData =['01','02','03'];
                this.amtData = ['01','02','03','04','05', '06', '07','08','09','10'];
                this.reqData.txKind = 'E'; // 紓困貸款
                this.reqData.give_amt = '10';
                this.reqData.give_dur_yymm ='03';
            } else if (this.reqData['kycloanUsage'] == '02'){
                this.yearData = ['05', '06', '07'];
                // this.amtData = ['01','02','03'];
            } 
        } else if ( this.status == 'N' && this.reqData['kycloanUsage'] == '09'){
            this.yearData =['01','02','03'];
            this.amtData = ['01','02','03','04','05', '06', '07','08','09','10'];
            this.alert.show('依據勞動部通知，勞工紓困貸款停止受理。', {
                title: '',
                btnTitle: '確定',
            }).then(
                () => {
                    
                    //this.navgator.push("online-loan-desk");
                }
            );
        }
    }
    
    //職業變化
    jobChange() {
        this._logger.log("into job change");
        this._logger.log("reqData.metier:", this.reqData.metier);
        //職業細項變化，有變化，就需將分項之檢核錯誤拔除
        this.check_error.check_metier_sub = false;
        this.check_error.metier_sub_error = '';
        this.reqData.metier_sub = '';
        this._logger.log("jobChange, reqData:", this.reqData);

        //如果選的細項有分項資料
        if (typeof this.reqData.metier == 'object' && this.reqData.metier
            && this.reqData.metier.hasOwnProperty('detail')
            && (this.reqData.metier['detail'] instanceof Array)
            && this.reqData.metier['detail'].length > 0
        ) {
            this._logger.log("is sub");
            this.select_sub = this.reqData.metier['detail']; //將對應的分項資料帶入
            this.select_sub_flag = true;
            //選擇之細項無分項資料，清空
        } else {
            this._logger.log("into not sub");
            this.select_sub = [];
            this.reqData.metier_sub = '';
            this.select_sub_flag = false;
        }
    }
    //票據帳戶使用狀況變化
    ticketChange() {
        this._logger.log("reqData.kycEtch:", this.reqData.kycEtch);
        if (this.reqData['kycEtch'] == '4') {
            this.ticketFlag = true;
        } else {
            this.reqData['kycEtchNo'] = '';
            this.ticketFlag = false;
        }
        if (this.reqData['kycEtch'] == '4' || this.reqData['kycEtch'] == '5') {
            this._logger.log("into cant apply");
        }
    }
    //銀行貸款狀況變化
    bankChange() {
        this._logger.log("reqData.kycBankel:", this.reqData.kycBankel);
        //尚無法正常履約 or 催收戶，不予核准
        if (this.reqData['kycBankel'] == '4' || this.reqData['kycBankel'] == '5') {
            this._logger.log("into cant apply");
        }
    }
    //信用卡使用狀況變化
    creditChange() {
        this._logger.log("reqData.kycCard:", this.reqData.kycCard);
        //強制停卡中，不予核准
        if (this.reqData['kycCard'] == '5') {
            this._logger.log("into cant apply");
        }
    }

    //選擇之用途
    selectLoage(temp) {
        this._logger.log("selectLoage, temp:", temp);
        let output = {};
        temp.forEach(item => {
            if (item.type == this.reqData.kycloanUsage) {
                output = item;
            }
        });
        this._logger.log("selectLoage, output:", output);
        return output;
    }

    //------------------------------ 基本資料 -------------------------------------------
    //基本資料1,上一步
    onBasicBack1() {
        this.onBackPageData({}, 'back');
    }
    //基本資料1,下一步
    onBasicNext1() {
        this._logger.log("reqData:", this.reqData);
        this.doBack(); //返回控制
        this.select_loage = this.selectLoage(this.usageData.usageTemp); //取得選擇之那筆(借款用途)
        this._logger.log("select_loage:", this.select_loage);
        //檢核第一頁
        let check_page = this.checkPage1();
        let checkAge = this.checkAge(this.reqData.kycold); //檢核年齡未達20不可繼續流程
        //歲數檢核成功，再最終檢核全頁資料
        if (checkAge['status'] == true) {
            if (check_page['status'] == true) {
                this.nowPage = 'basicPage2';
                this.doScrollTop();
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    //基本資料2,上一步
    onBasicBack2() {
        this.nowPage = 'basicPage1';
        this.doScrollTop();
    }
    //基本資料2,下一步
    onBasicNext2() {
        this.doBack(); //返回控制
        //檢查第二頁
        let check_page = this.checkPage2();
        if (check_page.status == true) {
            this.backShowData();
            // //--- 下方為確認頁狀態欄位(顯示用) ---
            // //票據帳戶使用狀況
            // switch (this.reqData['kycEtch']) {
            //     case '1':
            //         this.showStatus['kycEtch'] = '未開立帳戶'; //確認頁 顯示用
            //         break;
            //     case '2':
            //         this.showStatus['kycEtch'] = '正常';
            //         break;
            //     case '3':
            //         this.showStatus['kycEtch'] = '一年內有退補紀錄';
            //         break;
            //     case '4':
            //         this.showStatus['kycEtch'] = '退票未註銷';
            //         break;
            //     case '5':
            //         this.showStatus['kycEtch'] = '拒絕往來戶';
            //         break;
            // }
            // //銀行貸款狀態
            // switch (this.reqData['kycBankel']) {
            //     case '1':
            //         this.showStatus['kycBankel'] = '無借款'; //確認頁 顯示用
            //         break;
            //     case '2':
            //         this.showStatus['kycBankel'] = '履約正常';
            //         break;
            //     case '3':
            //         this.showStatus['kycBankel'] = '偶有遲延，目前正常';
            //         break;
            //     case '4':
            //         this.showStatus['kycBankel'] = '尚無法正常履約';
            //         break;
            //     case '5':
            //         this.showStatus['kycBankel'] = '催收戶';
            //         break;
            // }
            // //信用卡使用狀況
            // switch (this.reqData['kycCard']) {
            //     case "1":
            //         this.showStatus['kycCard'] = '未申請'; //確認頁 顯示用
            //         break;
            //     case "2":
            //         this.showStatus['kycCard'] = '每期全額繳清';
            //         break;
            //     case "3":
            //         this.showStatus['kycCard'] = '使用循環信用';
            //         break;
            //     case "4":
            //         this.showStatus['kycCard'] = '自行停卡不用';
            //         break;
            //     case "5":
            //         this.showStatus['kycCard'] = '強制停卡中';
            //         break;
            // }
            // if (this.reqData['applyTrade'] != '' && this.reqData['applyTrade'] != null
            //     && typeof this.reqData['applyTrade'] != 'undefined') {
            //     this.showStatus['applyTrade'] = this.reqData['applyTrade']['CNAME1']; //行業別
            // } else {
            //     this.showStatus['applyTrade'] = '';
            // }
            // if (!this.reqData['metier'].hasOwnProperty('CNAME1') || this.reqData['metier']['CNAME1'] == ''
            //     || this.reqData['metier']['CNAME1'] == null || typeof this.reqData['metier']['CNAME1'] == 'undefined') {
            //     this.showStatus['metier'] = '';
            // } else {
            //     this.showStatus['metier'] = this.reqData['metier']['CNAME1']; //職業別細項
            // }
            // if (!this.reqData['metier_sub'].hasOwnProperty('CNAME1') || this.reqData['metier_sub']['CNAME1'] == ''
            //     || this.reqData['metier_sub']['CNAME1'] == null || typeof this.reqData['metier_sub']['CNAME1'] == 'undefined') {
            //     this.showStatus['metier_sub'] = '';
            // } else {
            //     this.showStatus['metier_sub'] = this.reqData['metier_sub']['CNAME1']; //職業別細項
            // }
            this.alert.show('本人已填妥「個人貸款客戶KYC表」無誤。', {
                title: '',
                btnTitle: '同意',
            }).then(
                () => {
                    //點擊同意
                    this.reqData['kycKo'] = '1';
                    this._logger.log("reqData:", this.reqData);
                    this.nowPage = 'goConfirm';
                    this.doScrollTop();
                }
            );
        } else {
            return false;
        }
    }

    //---------- 確認頁 ------------
    //確認頁，上一步
    onConfirmBack() {
        this.nowPage = 'basicPage2';
        this.doScrollTop();
    }
    //確認頁，下一步
    onConfirmNext() {
        this.doBack(); //返回控制
        this._logger.log("reqData:", this.reqData);
        let saveKyc: any = {};
        if (typeof this.reqData.kycPayMo == 'number') {
            this.reqData.kycPayMo = this.reqData.kycPayMo.toString();
            this.showStatus.kycPayMo = this.reqData.kycPayMo.toString();
        }
        //在進入下一個階段前，先發保持登入電文
        this.auth.keepLogin();
        this._logger.log("kyc before save, reqData:", this.reqData);
        //本人識字欄位在強制帶入一次(返回沒帶入到)
        this.reqData['kycYn'] = '1';
        this._allService.saveKycData(this.reqData, this.resver).then(
            (result) => {
                this._logger.log("kyc save success", result);
                saveKyc = result;
                this._logger.log("kyc, saveKyc:", saveKyc);
                if (saveKyc['status'] == true) {
                    this.alert.show('資料已儲存完畢，即將進入下一步驟。', {
                        title: '提醒您',
                        btnTitle: '了解',
                    }).then(
                        () => {
                            this.onBackPageData(this.reqData);
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
        //儲存預填單資料
        if (this.resver == 'Y') {
            this._logger.log("into resver=='Y', save resverData");
            this._allService.setResverData(this.reqData);
        }
    }

    //檢核第一頁
    checkPage1() {
        let output = {
            status: false,
            data: {},
            msg: ''
        };
        let checkAmt_rule = {};

        //檢核申請金額
        let checkGive_amt = this._checkService.checkMoney(this.reqData.give_amt);
        if (checkGive_amt['status'] == false || this.reqData.give_amt == '') {
            this.check_error.check_give_amt = true;
            this.check_error.give_amt_error = checkGive_amt['msg'];
        } else {
            //檢核成功，檢核業務規則，房貸10~999，信貸5~200
            //房貸 type:'1'
            if (this.type == 'mortgage' || this.type == 'house') {
                checkAmt_rule = this._mainService.checkGiveAmt(this.reqData.give_amt, '1');
            } else if (this.reqData.kycloanUsage == '09') { //勞工紓困
                //信貸 type:'2'
            } else {
                checkAmt_rule = this._mainService.checkGiveAmt(this.reqData.give_amt, '2');
            }
            if (checkAmt_rule['status'] == false) {
                this.check_error.check_give_amt = true;
                this.check_error.give_amt_error = checkAmt_rule['msg'];
            } else {
                this.check_error.check_give_amt = false;
                this.check_error.give_amt_error = '';
            }
        }
        //檢核預計申請期限
        if (this.reqData['give_dur_yymm'] == '') {
            this.check_error.check_give_dur_yymm = true;
            this.check_error.give_dur_yymm_error = "請選擇預計申請期限";
        } else {
            this.check_error.check_give_dur_yymm = false;
            this.check_error.give_dur_yymm_error = '';
        }

        //關閉紓困
        if (this.status == 'N' && this.type == 'credit' && this.reqData.kycloanUsage == '09') {
            this.check_error.status = true;
            this.alert.show('依據勞動部通知，勞工紓困貸款停止受理。', {
                title: '',
                btnTitle: '確定',
            }).then(
                () => {
                    
                    //this.navgator.push("online-loan-desk");
                }
            );
        } else {
            this.check_error.status = false;
            
        }

        //檢核借款用途
        if (this.reqData['kycloanUsage'] == '') {
            this.check_error.check_kycLoan_usage = true;
            this.check_error.kycLoan_usage_error = '請選擇借款用途';
        } else {
            this.check_error.check_kycLoan_usage = false;
            this.check_error.kycLoan_usage_error = '';
        }
        //檢核票據帳戶使用狀況
        if (this.reqData['kycEtch'] == '') {
            this.check_error.check_kycEtch = true;
            this.check_error.kycEtch_error = '請選擇票據帳戶使用狀況';
        } else {
            this.check_error.check_kycEtch = false;
            this.check_error.kycEtch_error = '';
        }
        //檢核銀行貸款狀況
        if (this.reqData['kycBankel'] == '') {
            this.check_error.check_kycBankel = true;
            this.check_error.kycBankel_error = '請選擇銀行貸款狀況';
        } else {
            this.check_error.check_kycBankel = false;
            this.check_error.kycBankel_error = '';
        }
        //檢核信用卡使用狀況
        if (this.reqData['kycCard'] == '') {
            this.check_error.check_kycCard = true;
            this.check_error.kycCard_error = '請選擇信用卡使用狀況';
        } else {
            this.check_error.check_kycCard = false;
            this.check_error.kycCard_error = '';
        }
        //張數檢查
        if (this.ticketFlag == true) {
            let checkTicket = this._mainService.checkTicket(this.reqData['kycEtchNo']);
            if (checkTicket['status'] == false) {
                this.check_error.check_kycEtchNo = true;
                this.check_error.kycEtchNo_error = checkTicket['msg'];
            } else {
                this.check_error.check_kycEtchNo = false;
                this.check_error.kycEtchNo_error = '';
            }
        }
        //行業別檢查
        if (this.reqData['applyTrade'] == '') {
            this.check_error.check_applyTrade = true;
            this.check_error.applyTrade_error = '請選擇行業別';
        } else {
            this.check_error.check_applyTrade = false;
            this.check_error.applyTrade_error = '';
        }
        //行業別細項檢查
        if (this.reqData['metier'] == '') {
            this.check_error.check_metier = true;
            this.check_error.metier_error = '請選擇職業別細項';
        } else {
            this.check_error.check_metier = false;
            this.check_error.metier_error = '';
        }
        //職業別分項
        if (this.select_sub_flag == true) {
            this._logger.log("into select_sub_flag == true", this.select_sub_flag);
            if (this.reqData['metier_sub'] == '') {
                this.check_error.check_metier_sub = true;
                this.check_error.metier_sub_error = '請選擇職業別分項';
            } else {
                this.check_error.check_metier_sub = false;
                this.check_error.metier_sub_error = '';
            }
        }
        //如為預填單，須檢核「姓名」、「身分證」、「年齡」
        if (this.resver == 'Y') {
            this._logger.log("into kyc check, resver=='Y'");
            //檢核姓名
            let checkName = this._mainService.checkText(this.reqData.name);
            if (checkName['status'] == false) {
                this.check_error.name_error = checkName['msg'];
            } else {
                this.check_error.name_error = '';
            }
            //檢核身分證
            let checkIdno = this._checkService.checkIdentity(this.reqData.id_no);
            if (checkIdno['status'] == false) {
                this.check_error.id_no_error = checkIdno['msg'];
            } else {
                this.check_error.id_no_error = '';
            }
            //檢核生日
            if (this.reqData.applyBir == '') {
                this.check_error.error_applyBir = '請選擇出生年月日';
            } else {
                this.check_error.error_applyBir = '';
            }
            //檢核年齡
            let checKycold = this._checkService.checkNumber(this.reqData.kycold);
            if (checKycold['status'] == false) {
                this.check_error.kycold_error = checKycold['msg'];
            } else {
                this.check_error.kycold_error = '';
                let age = parseInt(this.reqData.kycold);
                if (age < 20 || age > 100) {
                    this.check_error.error_applyBir = '年齡須符合20~100歲'; //錯誤訊息顯示於生日欄位
                } else {
                    this.check_error.error_applyBir = '';
                }
            }
        }
        //非預填不檢核，出生年月日
        if (this.resver == 'N') {
            //全都過 
            if (this.check_error.status == false && this.check_error.check_give_amt == false && this.check_error.check_give_dur_yymm == false
                && this.check_error.check_kycLoan_usage == false && this.check_error.check_kycEtch == false
                && this.check_error.check_kycBankel == false && this.check_error.check_kycCard == false &&
                this.check_error.check_applyTrade == false && this.check_error.check_metier == false
                && this.check_error.check_metier_sub == false && this.check_error.check_kycEtchNo == false
                && this.check_error.name_error == '' && this.check_error.id_no_error == '' &&
                this.check_error.kycold_error == '') {
                output.status = true;
                output.msg = 'success'
            } else {
                output.status = false;
                output.msg = 'failed';
            }
        } else {
            //全都過(含出生年月日)
            if (this.check_error.check_give_amt == false && this.check_error.check_give_dur_yymm == false
                && this.check_error.check_kycLoan_usage == false && this.check_error.check_kycEtch == false
                && this.check_error.check_kycBankel == false && this.check_error.check_kycCard == false &&
                this.check_error.check_applyTrade == false && this.check_error.check_metier == false
                && this.check_error.check_metier_sub == false && this.check_error.check_kycEtchNo == false
                && this.check_error.name_error == '' && this.check_error.id_no_error == '' &&
                this.check_error.kycold_error == '' && this.check_error.error_applyBir == '') {
                output.status = true;
                output.msg = 'success'
            } else {
                output.status = false;
                output.msg = 'failed';
            }
        }
        return output;
    }

    //檢核第二頁
    checkPage2() {
        this._logger.log("reqData:", this.reqData);
        let output = {
            status: false,
            msg: '',
            data: {}
        };
        //檢核財務收入年度 2019/11/20 非必填不檢核
        if (this.reqData.m_year == '') {
            this.check_error.check_m_year = true;
            this.check_error.m_year_error = '請選擇財務收支年度';
        } else {
            this.check_error.check_m_year = false;
            this.check_error.m_year_error = '';
        }

        let checkApply_nt: any = {}; //檢核個人年收入
        //學生:061410 農林漁牧業:0615A0 無業、家管、退休人員:061700，不檢核個人年收入(只檢核空值、數字)，
        //不是以上欄位在檢核
        let check_list = ['061410', '0615A0', '061700']; //特殊職業代號
        let money_allow_zero = true; //true: 不可有0，false可有0
        if (check_list.indexOf(this.reqData.applyTrade['CN01']) > -1) {
            money_allow_zero = false; //符合以上三者特殊職業，帶false
            this.specialJobFlag = true; //為特殊職業
            this._logger.log("into special job");
        } else {
            this.specialJobFlag = false; //不為特殊職業
            this._logger.log("into not special job");
        }
        if (this.type == 'credit' && this.reqData.kycloanUsage == '09') {  // alex 紓困收入可為0
			money_allow_zero = false; 
		};
        //檢核個人年收入
        checkApply_nt = this._checkService.checkMoney(this.reqData.apply_nt, {
            currency: 'TWD',
            not_zero: money_allow_zero
        });
        if (checkApply_nt['status'] == false) {
            this.check_error.check_apply_nt = true;
            this.check_error.apply_nt_error = checkApply_nt['msg'];
        } else {
            this.check_error.check_apply_nt = false;
            this.check_error.apply_nt_error = '';
            //檢查業務邏輯
            this.checkTotalNt(this.reqData.apply_nt, this.reqData.total_nt);
        }

        //檢核家庭年收入
        let checkTotal_nt = this._checkService.checkMoney(this.reqData.total_nt, { currency: 'TWD', not_zero: false });
        if (checkTotal_nt['status'] == false) {
            this.check_error.check_total_nt = true;
            this.check_error.total_nt_error = checkTotal_nt['msg'];
        } else {
            this.check_error.check_total_nt = false;
            this.check_error.total_nt_error = '';
            //檢查業務邏輯
            this.checkTotalNt(this.reqData.apply_nt, this.reqData.total_nt);
        }
        //檢核家庭支出
        let checkExpense = this._checkService.checkMoney(this.reqData.expense, { currency: 'TWD', not_zero: false });
        if (checkExpense['status'] == false) {
            this.check_error.check_expense = true;
            this.check_error.expense_error = checkExpense['msg'];
        } else {
            this.check_error.check_expense = false;
            this.check_error.expense_error = '';
        }
        //檢核每月應繳
        let tmp_kycpaymo_data = parseFloat(this.reqData.kycPayMo);
        let checkKycPayMo = this._checkService.checkMoney(tmp_kycpaymo_data, {
            maxDocNum: 1,
            not_zero: false
        });
        if (checkKycPayMo['status']) {
            if (tmp_kycpaymo_data > 99999.9) {
                this.check_error.check_kycPayMo = true;
                this.check_error.kycPayMo_error = '請輸入0~99999.9的金額';
            } else {
                this.reqData.kycPayMo = tmp_kycpaymo_data;
                this.check_error.check_kycPayMo = false;
                this.check_error.kycPayMo_error = '';
            }
        } else {
            this.check_error.check_kycPayMo = true;
            this.check_error.kycPayMo_error = '請輸入0~99999.9的金額';
        }

        //檢核貸款餘額
        let checkKycElamt = this._checkService.checkMoney(this.reqData.kycElamt, {
            currency: 'TWD',
            not_zero: false
        });
        if (checkKycElamt['status'] == false) {
            this.check_error.check_kycElamt = true;
            this.check_error.kycElamt_error = checkKycElamt['msg'];
        } else {
            this.check_error.check_kycElamt = false;
            this.check_error.kycElamt_error = '';
        }
        //檢核原貸款總金額
        let checkKycElmo = this._checkService.checkMoney(this.reqData.kycElmo, {
            currency: 'TWD',
            not_zero: false
        });
        if (checkKycElmo['status'] == false) {
            this.check_error.check_kycElmo = true;
            this.check_error.kycElmo_error = checkKycElmo['msg'];
        } else {
            this.check_error.check_kycElmo = false;
            this.check_error.kycElmo_error = '';
        }
        //檢核 貸款餘額 不可大於 原貸款總金額
        if (this.check_error.check_kycElamt == false && this.check_error.check_kycElmo == false) {
            this.checKycElmo(this.reqData.kycElmo, this.reqData.kycElamt);
        }

        //全過
        if (this.check_error.check_apply_nt == false && this.check_error.check_m_year == false
            && this.check_error.check_total_nt == false && checkExpense['status'] == true
            && this.check_error.check_kycPayMo == false && this.check_error.check_kycElamt == false
            && this.check_error.check_kycElmo == false) {
            output.status = true;
            output.msg = 'success';
        } else {
            output.status = false;
            output.msg = 'failed';
        }
        return output;
    }

    //檢查家庭年收入
    checkTotalNt(personal, total) {
        let output = {
            status: false,
            data: {
                personal: personal,
                total: total
            },
            msg: ''
        };
        let personalNt = parseInt(personal);
        let totalNt = parseInt(total);
        //個人年收不可大於家庭年收
        if (personalNt > totalNt) {
            output.status = false;
            output.msg = 'failed';
            //個人
            this.check_error.check_apply_nt = true;
            this.check_error.apply_nt_error = '個人年收入不可大於家庭年收入';
            //家庭
            this.check_error.check_total_nt = true;
            this.check_error.total_nt_error = '個人年收入不可大於家庭年收入';

        } else {
            output.status = true;
            output.msg = 'success';
            this.check_error.check_apply_nt = false;
            this.check_error.apply_nt_error = '';
            //家庭
            this.check_error.check_total_nt = false;
            this.check_error.total_nt_error = '';
        }
        //成功再檢核一次特殊職業
        if (output.status == true) {
            //不是特殊職業，需再檢核一次，個人年收入不可輸入0
            let checkApply_nt = {};
            let money_allow_zero = true;
            if (this.specialJobFlag == false) {
                money_allow_zero = true; //不可有0
            } else {
                money_allow_zero = false; //可有0
            }
            if (this.type == 'credit'&& this.reqData.kycloanUsage == '09') {  // alex 紓困收入可為0
                money_allow_zero = false; 
            };
            checkApply_nt = this._checkService.checkMoney(this.reqData.apply_nt, {
                currency: 'TWD',
                not_zero: money_allow_zero
            });
            if (checkApply_nt['status'] == false) {
                output.status = false;
                this.check_error.check_apply_nt = true;
                this.check_error.apply_nt_error = checkApply_nt['msg'];
            } else {
                output.status = true;
                this.check_error.check_apply_nt = false;
                this.check_error.apply_nt_error = '';
            }
        }
    }

    //檢核 原貸款總金額需大於等於 貸款餘額
    /** 
     * total:原貸款總金額，remain:餘額
    */
    public checKycElmo(total, remain) {
        let output = {
            status: false,
            data: {
                original: total,
                total: remain
            },
            msg: ''
        };
        let t_money = parseInt(total);
        let r_money = parseInt(remain);
        if (t_money < r_money) {
            output.status = false;
            output.msg = 'erorr';
            this.check_error.check_kycElmo = true;
            this.check_error.kycElmo_error = '貸款餘額不可大於原貸款總金額';
            //餘額
            this.check_error.check_kycElamt = true;
            this.check_error.kycElamt_error = '貸款餘額不可大於原貸款總金額';
        } else {
            output.status = true;
            output.msg = '';
            this.check_error.check_kycElmo = false;
            this.check_error.kycElmo_error = '';
            //餘額
            this.check_error.check_kycElamt = false;
            this.check_error.kycElamt_error = '';
        }
        return output;
    }

    //檢查年齡無達到20歲不可繼續流程
    checkAge(setData) {
        let output = {
            status: false,
            data: setData,
            msg: ''
        };
        let age = parseInt(setData);
        if (age < 20) {
            output.status = false;
            output.msg = 'error';
            this.alert.show('須年滿20歲以上，方可申請房貸、信貸。', {
                title: '提醒您',
                btnTitle: '了解',
            }).then(
                () => {
                }
            );
        } else {
            output.status = true;
            output.msg = 'success';
        }
        return output;
    }

    doScrollTop() {
        this._uiContentService.scrollTop();
    }

    //返回處理
    doBack() {
        this._logger.log("into doBack");
        this._headerCtrl.setLeftBtnClick(() => {
            switch (this.nowPage) {
                case 'basicPage1':
                    this._logger.log("doBack, basicPage1 back");
                    this.onBackPageData({}, 'back');
                    break;
                case 'basicPage2':
                    this._logger.log("doBack, basicPage2 back");
                    this.nowPage = 'basicPage1';
                    this.doScrollTop();
                    break;
                case 'goConfirm':
                    this._logger.log("doBack, goConfirm back");
                    this.nowPage = 'basicPage2';
                    this.doScrollTop();
                    break;
                default:
                    this._logger.log("no page");
                    break;
            }
        });
    }

    //日期套件處理
    doDate() {
        this._logger.log("into doDate function");
        const date_data = this._checkService.getDateSet({
            baseDate: 'today', // 基礎日
            rangeType: 'M', // "查詢範圍類型" M OR D
            rangeNum: '', // 查詢範圍限制
            rangeDate: '' // 比較日
        }, 'strict');
        this.maxDay = date_data.maxDate;
        this.minDay = date_data.minDate;
    }

    /**
* 日期選擇返回事件
* @param e
*/
    onInputBack(e) {
        if (this.reqData.applyBir.indexOf('-') > 0) {
            this.reqData.applyBir = this.reqData.applyBir.replace(/-/g, '/');
        }
        let birthYear = e.substring(0,4);
        let today = new Date;
        let y = (today.getFullYear()).toString(); //西元年
        this.reqData.kycold = (parseInt(y)-parseInt(birthYear)).toString();
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
    }

    /**
     * 返回上一層
     * @param item
     */
    onBackPageData(item?: any, type?: string, showData?) {
        // 返回最新消息選單
        let output = {
            'page': 'kyc',
            'type': 'go',
            'data': item,
            'showData': showData
        };
        if (type == 'back') {
            this._logger.log("into kyc back");
            output.type = type;
        }
        this.backPageEmit.emit(output);
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

    //output返回時，將資料帶入
    setOutputData(stage) {
        this._logger.log("kyc output, fullData:", this.fullData);
        let allData = this._allService.allData;
        this._logger.log("apply output, allData:", allData);
        this._logger.log("kyc output, usageData.usageTemp:", this.usageData.usageTemp);
        this.reqData.give_amt = this._formateService.checkField(allData, 'giveAmt'); //申請金額
        this.reqData.give_dur_yymm = this._formateService.checkField(allData, 'giveDurYymm'); //貸款期間
        //非預填(登入)
        if (this.resver == 'N') {
            if(allData['loanUsage'] =='09') {
                this.yearData =['01','02','03'];
                this.amtData = ['01','02','03','04','05', '06', '07','08','09','10'];
                this.reqData.txKind = 'E'; // 紓困貸款
                // this.reqData.give_amt = '10';
                // this.reqData.give_dur_yymm ='03';
            }
            this.reqData.kycloanUsage = this._formateService.checkField(allData, 'loanUsage'); //借款用途(值暫存在資金用途)
            //預填單
        } else {
            this.reqData.kycloanUsage = this._formateService.checkField(allData, 'kycloanUsage'); //值存在各自欄位(因此這裡待借款用途)
            if (allData['applyBir'].indexOf('-') < 0) {
                let year = allData['applyBir'].substring(0, 4);
                let month = allData['applyBir'].substring(4, 6);
                let day = allData['applyBir'].substring(6, 8);
                this.reqData.applyBir = year + '-' + month + '-' + day;
                this._logger.log("into back, reqData.applyBir:", this.reqData.applyBir);
            } else {
                this.reqData.applyBir = this._formateService.checkField(allData, 'applyBir');
            }
        }
        //為房貸增貸時，將強制勾搭的用途值轉回來
        if (this.type == 'mortgage') {
            if (this.reqData.kycloanUsage == '03') {
                this.reqData.kycloanUsage = '05'; //理財週轉金03 => 理財投資用途05 (返回時轉回來)
            } else if (this.reqData.kycloanUsage == '06') {
                this.reqData.kycloanUsage = '04'; //家計消費06 => 家庭生活支出04 (返回時轉回來)
            }
        }

        this.select_loage = this.selectLoage(this.usageData.usageTemp);
        this.reqData.name = this._formateService.checkField(allData, 'repName'); //申請人姓名
        this.reqData.id_no = this._formateService.checkField(allData, 'custId'); //身分證字號
        this.reqData.kycold = this._formateService.checkField(allData, 'kycold'); //年齡
        this.reqData.kycEtch = this._formateService.checkField(allData, 'kycetch'); //票據帳戶使用狀況
        //退票未註銷，顯示張數
        if (this.reqData['kycEtch'] == '4') {
            this.ticketFlag = true;
        } else {
            this.reqData['kycEtchNo'] = '';
            this.ticketFlag = false;
        }
        this.reqData.kycEtchNo = this._formateService.checkField(allData, 'kycetchno'); //張數
        this.reqData.kycBankel = this._formateService.checkField(allData, 'kycbankel'); //銀行貸款狀況
        this.reqData.kycCard = this._formateService.checkField(allData, 'kyccard'); //信用卡使用狀況
        this.default_job = this._allService.getKycJobData(); //取得Kyc選擇之職業資料(全部)，帶入申請書預設
        this._logger.log("1. default_job:", this.default_job);
        this.reqData.applyTrade = this._formateService.checkField(this.default_job, 'applyTrade'); //kyc選擇之行業別帶入
        this.reqData.metier = this._formateService.checkField(this.default_job, 'metier'); //kyc選擇之職業別細項帶入
        this.reqData.metier_sub = this._formateService.checkField(this.default_job, 'metier_sub'); //kyc選擇之職業別分項帶入
        //如果選的細項有分項資料
        if (typeof this.reqData.metier == 'object' && this.reqData.metier
            && this.reqData.metier.hasOwnProperty('detail')
            && (this.reqData.metier['detail'] instanceof Array)
            && this.reqData.metier['detail'].length > 0
        ) {
            this._logger.log("is sub");
            this.select_sub = this.reqData.metier['detail']; //將對應的分項資料帶入
            this.select_sub_flag = true;
            //選擇之細項無分項資料，清空
        } else {
            this._logger.log("into not sub");
            this.select_sub = [];
            this.reqData.metier_sub = '';
            this.select_sub_flag = false;
        }
        this.reqData.m_year = this._formateService.checkField(allData, 'mYear'); //財務收支年度
        this.reqData.apply_nt = this._formateService.checkField(allData, 'applyNt'); //個人年收入(萬元)
        this.reqData.total_nt = this._formateService.checkField(allData, 'totalNt'); //家庭年收入(萬元)
        this.reqData.expense = this._formateService.checkField(allData, 'expense'); //家庭年支出(萬元)
        this.reqData.kycPayMo = this._formateService.checkField(allData, 'kycpaymo'); //*銀行貸款 每月應繳金額(萬元)
        this.reqData.kycElamt = this._formateService.checkField(allData, 'kycelamt'); //貸款餘額(萬元)
        this.reqData.kycElmo = this._formateService.checkField(allData, 'kycelmo'); //原貸款總金額(萬元)
        this.backShowData();
        if (stage == true) {
            this.nowPage = 'basicPage1'; //第一頁
        } else {
            this.nowPage = 'goConfirm'; //返回去認頁(顯示)
        }
    }

    //顯示中文名稱資料
    backShowData() {
        //--- 下方為確認頁狀態欄位(顯示用) ---
        //票據帳戶使用狀況
        switch (this.reqData['kycEtch']) {
            case '1':
                this.showStatus['kycEtch'] = '未開立帳戶'; //確認頁 顯示用
                break;
            case '2':
                this.showStatus['kycEtch'] = '正常';
                break;
            case '3':
                this.showStatus['kycEtch'] = '一年內有退補紀錄';
                break;
            case '4':
                this.showStatus['kycEtch'] = '退票未註銷';
                break;
            case '5':
                this.showStatus['kycEtch'] = '拒絕往來戶';
                break;
        }
        //銀行貸款狀態
        switch (this.reqData['kycBankel']) {
            case '1':
                this.showStatus['kycBankel'] = '無借款'; //確認頁 顯示用
                break;
            case '2':
                this.showStatus['kycBankel'] = '履約正常';
                break;
            case '3':
                this.showStatus['kycBankel'] = '偶有遲延，目前正常';
                break;
            case '4':
                this.showStatus['kycBankel'] = '尚無法正常履約';
                break;
            case '5':
                this.showStatus['kycBankel'] = '催收戶';
                break;
        }
        //信用卡使用狀況
        switch (this.reqData['kycCard']) {
            case "1":
                this.showStatus['kycCard'] = '未申請'; //確認頁 顯示用
                break;
            case "2":
                this.showStatus['kycCard'] = '每期全額繳清';
                break;
            case "3":
                this.showStatus['kycCard'] = '使用循環信用';
                break;
            case "4":
                this.showStatus['kycCard'] = '自行停卡不用';
                break;
            case "5":
                this.showStatus['kycCard'] = '強制停卡中';
                break;
        }
        if (this.reqData['applyTrade'] != '' && this.reqData['applyTrade'] != null
            && typeof this.reqData['applyTrade'] != 'undefined') {
            this.showStatus['applyTrade'] = this.reqData['applyTrade']['CNAME1']; //行業別
        } else {
            this.showStatus['applyTrade'] = '';
        }
        if (!this.reqData['metier'].hasOwnProperty('CNAME1') || this.reqData['metier']['CNAME1'] == ''
            || this.reqData['metier']['CNAME1'] == null || typeof this.reqData['metier']['CNAME1'] == 'undefined') {
            this.showStatus['metier'] = '';
        } else {
            this.showStatus['metier'] = this.reqData['metier']['CNAME1']; //職業別細項
        }
        if (!this.reqData['metier_sub'].hasOwnProperty('CNAME1') || this.reqData['metier_sub']['CNAME1'] == ''
            || this.reqData['metier_sub']['CNAME1'] == null || typeof this.reqData['metier_sub']['CNAME1'] == 'undefined') {
            this.showStatus['metier_sub'] = '';
        } else {
            this.showStatus['metier_sub'] = this.reqData['metier_sub']['CNAME1']; //職業別細項
        }
    }
}
