/**
 * 線上申貸-往來分行(紓困)
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewContainerRef } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FormateService } from '@shared/formate/formate.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { ContactBranchService } from './contact-branch.service';
import { MortgageIncreaseService } from '@pages/online-loan/shared/service/mortgage-increase.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { PaginatorCtrlService } from '@shared/paginator/paginator-ctrl.srevice';
// import { CreditBranchCaseComponent } from '../credit-branch-case/credit-branch-case.component';
import { CaptchaComponent } from '@shared/captcha/captcha.component';
import { AuthService } from '@core/auth/auth.service';

@Component({
    selector: 'app-contact-branch',
    templateUrl: './contact-branch.component.html',
    styleUrls: [],
    providers: [ContactBranchService, PaginatorCtrlService]
})

export class ContactBranchComponent implements OnInit {
    @Input() type: string;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Input() fullData: any;  //前一頁傳來之reqData，這頁送電文用
    @Input() resver: string; //是否為預填單 'Y':預填,'N':非預填
    @Input() action: string; //紀錄返回狀態，'go':進入此頁，'back':返回此頁

    //綁定於畫面之資料
    bindData = {
        accountcd: '', //中文科目
        increaseAmount: '', //可增貸金額
        outBrch1: '', //放款帳號分行代碼
        outBrch2: '', //委託繳息帳號分行代碼
        outBrchName2: '', //委託繳息帳號分行名稱
        outBrchname1: '', //放款帳號分行名稱
        outGnamt: '', //委託繳息帳號餘額
        outLaral: '', //現欠
        outLaran: '', //放款帳號
        outLargn: '', //委託繳息帳號
        outLarpm: '', //額度(核准金額)
        outRate: '', //利率值
        txkind: '' //種類
    };
    nowPage = 'commission'; //委託暨扣款
    backFlag: boolean; //上一步 or 取消
    branchInfo: any = {}; //分行資訊
    branchData: any = []; //分行明細

    //----- 查無帳號相關 -----
    hasAccount = true; //控制是否有委託扣款帳號，false要顯示下拉選擇
    accountData_505 = []; //存505帳號
    accountBind = ""; //綁定帳號下拉(存放選擇的那筆)
    dfAccountFlag = false; //控制是否顯示存款科目、餘額，預設不顯示，選擇帳號後顯示
    check_hasAccount = false; //自行選委託扣款帳號(檢核:紅框)
    error_hasAccount = ''; //自行選委託扣款帳號 訊息

    //----- 信貸分行相關 -----
    branckCheck = true; //radio 選擇
    branchSelect = true;//是否顯示 選擇分行module
    returnData = {
        branchId: '',
        branchName: '',
        city: ''
    };
    //信貸確認頁顯示
    selectData = {
        openBranchId: '', //分行代號
        openBranchName: '', //存款行
        acctType: '', //存款科目
        acctNo: '', //存款帳號
        balance: '', //餘額
        accountcd: '' //中文科目
    };
    //分頁相關
    // dataTime: string; // 資料日期
    // pageCounter = 1; // 當前頁次
    // totalPages = 0; // 全部頁面
    // @ViewChild('pageBox', { read: ViewContainerRef }) pageBox: ViewContainerRef;
    //圖形驗證
    checkCaptchaFlag: any;
    @ViewChild(CaptchaComponent) _captcha: CaptchaComponent;

    constructor(
        private _logger: Logger
        , private _handleError: HandleErrorService
        , private _mainService: ContactBranchService
        , private _allService: MortgageIncreaseService
        , private _headerCtrl: HeaderCtrlService
        , private _formateService: FormateService
        , private navgator: NavgatorService
        , private alert: AlertService
        , private _uiContentService: UiContentService
        , private paginatorCtrl: PaginatorCtrlService
        , private auth: AuthService
    ) { }

    ngOnInit() {
        this._logger.log("fullData:", this.fullData);
        // this._headerCtrl.setLeftBtnClick(() => {
        //     this._logger.log("into init left back");
        //     this.onBackPageData({}, "back");
        // });
        let stageData = this._allService.getStageStaus();
        let stage = stageData['branch'];

        //若為上一階段返回，拿取暫存
        if (this.action == 'back') {
            this._logger.log("into action == back");
            this.setOutputData(false);
            //房貸因為前面有選擇原案件，因此不可帶入預設(房貸暫存過資料，再進來一次房貸)
        } else if (stage == true && this.type == 'credit') {
            this.setOutputData(stage);
        } else {
            //信貸:上一步， 房貸:取消
            //信貸
            this._logger.log("into action == go");
            //信貸(預填單)    
            this.fullData.txkind = 'E';
            this.backFlag = true;
            //預填單只有自行選擇
            this.branckCheck = false;
            this.branchSelect = false; //2020/02/21 預填單修改為一進入分行開啟自選poupop

        }
        this.doBack();
    }

    //---------- 查無帳號料相關 START----------

    //當選擇之帳號改變，改變其他欄位對應之值
    onAccountChange() {
        this._logger.log("into onAccountChange, accountBind:", this.accountBind);
        this.dfAccountFlag = true; //有選擇帳號，就顯示存款科目、餘額欄位
        //點擊請選擇，清空值，並不做 中文科目處理
        if (this.accountBind == '') {
            this.bindData.accountcd = '';
            this.bindData.increaseAmount = '';
            this.bindData.outBrch1 = '';
            this.bindData.outBrch2 = '';
            this.bindData.outBrchName2 = '';
            this.bindData.outBrchname1 = '';
            this.bindData.outGnamt = '';
            this.bindData.outLaral = '';
            this.bindData.outLaran = '';
            this.bindData.outLargn = '';
            this.bindData.outLarpm = '';
            this.bindData.outRate = '';
            this.dfAccountFlag = false; //不顯示存款科目、餘額欄位
        } else {
            //帶入上一頁存款帳號相關，委託帳號相關由此頁綁定的ngModel取得
            this.dfAccountFlag = true;
            //如果不判斷返回，fullData為空物件，帶入確認頁會有問題，'go'的時候fullData為input data，才有原案件資料
            if (this.action != 'back') {
                this.bindData.increaseAmount = this.fullData.increaseAmount;
                this.bindData.outLaran = this.fullData.outLaran;
                this.bindData.outBrch1 = this.fullData.outBrch1;
                this.bindData.outBrchname1 = this.fullData.outBrchname1;
                this.bindData.outLarpm = this.fullData.outLarpm;
                this.bindData.outLaral = this.fullData.outLaral;
                this.bindData.outRate = this.fullData.outRate;
                this.bindData.outBrch2 = this.fullData.outBrch1; //2019/12/10 新規則帶入前一頁的代碼(非委扣代號)
            }

            //新查詢到的綁ngModel帳號資料，帶畫面(委託扣款帳號相關)
            this.bindData.outLargn = this.accountBind['acctNo'];
            this.bindData.outGnamt = this.accountBind['balance'];
            // this.bindData.outBrch2 = this.accountBind['openBranchId'];
            this.bindData.outBrchName2 = this.accountBind['openBranchName'];
            //需重新計算一次「中文科目」
            let tempCd = this._mainService.getAccountcd(this.accountBind['acctNo']);
            this.bindData.accountcd = tempCd['data'];
            this.bindData.outLargn = tempCd['account']; //帶入去'-'之帳號
            this._logger.log("bindData:", this.bindData);
        }
    }

    //---------- 查無帳號料相關 END----------

    //回到查詢原案件畫面
    onBack2() {
        this.onBackPageData({}, "back");
    }

    onNext2() {
        this._logger.log("into confirm page bindData:", this.bindData);
        //查無委託帳號，使用自行選擇，進下一頁要檢核
        if (this.hasAccount == false) {
            if (this.accountBind == '') {
                this.check_hasAccount = true;
                this.error_hasAccount = '請選擇帳號';
            } else {
                this.check_hasAccount = false;
                this.error_hasAccount = '';
                this._allService.setAccountBind(this.accountBind);
                //進確認頁
                this.nowPage = 'confirmPage';
                this._uiContentService.scrollTop();
                this._headerCtrl.setLeftBtnClick(() => {
                    this._logger.log("hasAccount into confirmPage back");
                        this.nowPage = 'confirmPage';
                });
            }
        } else {
            this.nowPage = 'confirmPage';
            this._uiContentService.scrollTop();
            this._headerCtrl.setLeftBtnClick(() => {
                this._logger.log("nothasAccount into confirmPage back");
                    this.nowPage = 'confirmPage';
            });
        }
    }
    // //檢核，查無委託帳號，使用自行選擇(有無選擇帳號)
    // checkHasNotAccount() {

    // }
    onBack3() {
        this.nowPage = 'commission';
    }
    onNext3() {
        let saveBranch: any = {};
        //信貸組reqest，流程與房貸增貸不一樣，會額外組一次
        let saveData: any = {};
        // txkind: '', //種類: 房貸 信貸
        // acctno: '', //放款帳號
        // account: '', //指定撥入帳號
        // branchId: '', //受理分行代號
        // branchName: '', //受理分行中文名
        // accountbrid: '', //指定撥入帳號分行代號
        // accountbrcn: '' //指定撥入帳號分行名稱

        let type = '';
            //信貸
            saveData.txkind = this.fullData.txkind;
            saveData.account = this.selectData.acctNo;
            saveData.acctno = ''; //房貸增貸填入欲增貸之原放款帳號、信貸空白
            saveData.branchId = this.selectData.openBranchId;
            saveData.branchName = this.selectData.openBranchName;
            saveData.accountbrid = this.selectData.openBranchId; //信貸無帶空
            saveData.accountbrcn = this.selectData.openBranchName; //信貸無帶空
            saveData.accountcd = this.selectData.accountcd; //中文科目
            saveData.balance = this.selectData.balance; //餘額
            type = 'credit';
            //為了返回暫存資料機制，暫存資料
            this._allService.setCreditBranchData(saveData);
            //存取縣市資料
            this._allService.setCityData(this.returnData);
            //存取分行狀態(自選or台幣帳戶)
            this._allService.setBranchStatus(this.branckCheck);

        //在進入下一個階段前，先發保持登入電文
        this.auth.keepLogin();
        //暫存分行資料
        this._logger.log("saveBranchData, saveData:", saveData);
        this._allService.saveBranchData(saveData, type).then(
            (result) => {
                this._logger.log("branch save success", result);
                saveBranch = result;
                this._logger.log("branch, saveBranch:", saveBranch);
                if (saveBranch['status'] == true) {
                    //登入(非預填)，繼續後續申請流程
                        //預填單，進行圖形驗證
                        this.checkCaptchaFlag = this._captcha.checkCaptchaVal(); //紀錄驗證是否成功
                        if (this.checkCaptchaFlag == true) {
                            //發f9000410 非會員api
                            this._logger.log("into checkCaptchaFlag true, send 410api");
                            let reqData = this._allService.allData;
                            //申請種類欄位防呆，2019/12/25有申請欄位送出為空之狀況
                            if (reqData['txkind'] == null || typeof reqData['txkind'] == 'undefined' || reqData['txkind'] == '') {
                                this._logger.log("into cant find reqData['txkind']");

                                    reqData['txkind'] = 'B'; //信貸

                            }
                            //formate金額...等
                            this._allService.formateReqData(reqData);
                            this._logger.log("reqData:", reqData);
                            this._mainService.sendAPI410(reqData).then(
                                (result) => {
                                    if (result.respCode != '4001' || result.result != '0') {
                                        this._logger.log("result !=4001 || result != 0");
                                        result['resultStatus'] = '4';
                                        result['msg'] = result['respCodeMsg'];
                                        this._logger.log("410 success result:", result);
                                    } else {
                                        result['resultStatus'] = '1';
                                        result['msg'] = result['respCodeMsg'];
                                    }
                                    // let info_data = result.info_data;
                                    this._logger.log("result:", result);
                                    this.onBackPageData(result);
                                    this._logger.log("go result page");
                                },
                                (errorObj) => {
                                    errorObj['type'] = 'message';
                                    errorObj['button'] = 'PG_ONLINE.BTN.BACKLOAN';
                                    errorObj['backType'] = 'online-loan';
                                    this._handleError.handleError(errorObj);
                                }
                            );
                        } else {
                            return false;
                        }

                } else {
                    return false;
                }
            },
            (errorObj) => {
                this._logger.log("branch save error", errorObj);
            }
        );
    }

    //-------------------------  信貸分行相關  --------------------------------------
    selectBranch(setype) {
        //原存款分行
        if (setype == 'original') {
            this.branckCheck = true;
            this.branchSelect = true;
            //將自行選擇值清空
            this.returnData.branchId = '';
            this.returnData.branchName = '';
            this.returnData.city = '';
            //自行選擇
        } else {
            this.branckCheck = false;
            this.branchSelect = false;
        }
    }

    //重新選擇
    onReSelect() {
        this.branckCheck = false;
        this.branchSelect = false;
    }
    //點擊選擇分行(最後選擇)
    onGoSelect(setype?, setData?) {
        //原存款
        if (setype == 'original') {
            this._logger.log("into onGoSelect, original");
            this._logger.log("original ,setData:", setData);
            this.selectData.acctType = setData.acctType;
            this.selectData.acctNo = setData.acctNo;
            this.selectData.balance = setData.balance;
            this.selectData.openBranchId = setData.openBranchId;
            this.selectData.openBranchName = setData.openBranchName;
            this.selectData.accountcd = setData.accountcd;
            this._logger.log("selectData:", this.selectData);
            //自行選擇
        } else {
            this._logger.log("into onGoSelect, select");
            this._logger.log("select ,returnData:", this.returnData);
            this.selectData.acctType = ''; //自選無此欄位
            this.selectData.acctNo = ''; //自選無此欄位
            this.selectData.balance = ''; //自選無此欄位
            this.selectData.openBranchId = this.returnData.branchId;
            this.selectData.openBranchName = this.returnData.branchName;
            this.selectData.accountcd = '';
            //查無分行代號，提示訊息，並不可執行下一頁
            if (this.returnData.branchId == '' || this.returnData.branchId == null
                || typeof this.returnData.branchId == 'undefined') {
                this.alert.show('查無分行代號，請重新選擇', {
                    title: '提醒您',
                    btnTitle: '了解',
                }).then(
                    () => {
                    }
                );
                return false;
            }
            this._logger.log("selectData:", this.selectData);
        }
        this.nowPage = 'confirmPage';
        this.doBack();
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
        //信貸選擇分行回傳
        if (pageType == 'go' && page == 'select-branch') {
            this._logger.log("tmp_data:", tmp_data); //選擇回傳之資料
            this.type = 'credit';
            //將回傳資料顯示
            this.returnData.branchId = tmp_data.branchId;
            this.returnData.branchName = tmp_data.branchName;
            this.returnData.city = tmp_data.city;
            this.branchSelect = true; //popoup
            this.branckCheck = false; //radio
            this.nowPage = 'commission';
        } else if (pageType == 'back' && page == 'select-branch') {
                //顯示預填畫面(不可選擇原存款)
                this._logger.log("branchSelect cancel back, type:", this.type);
                this.branckCheck = false;
                this.branchSelect = true;
                this.nowPage = 'commission';
        } else {
            //分頁點擊「選擇分行 pageType === 'go-branch'    
            if (page == 'branch-case') {
                this._logger.log("into branch-case go branch");
                this.onGoSelect('original', tmp_data);
            }
        }
    }


    //     /**
    // * Scroll Event
    // * @param next_page
    // */
    //     onScrollEvent(next_page) {
    //         this._logger.log('pageCounter:', this.pageCounter, 'next_page:', next_page);
    //         this.pageCounter = next_page;
    //         const componentRef: any = this.paginatorCtrl.addPages(this.pageBox, CreditBranchCaseComponent);
    //         componentRef.instance.page = next_page;
    //         componentRef.instance.backPageEmit.subscribe(event => this.onPageBackEvent(event));
    //         componentRef.instance.errorPageEmit.subscribe(event => this.onErrorBackEvent(event));
    //     }

    //返回操作
    doBack() {
        this._headerCtrl.setLeftBtnClick(() => {
            switch (this.nowPage) {
                case 'commission':
                    this.onBackPageData({}, "back");
                    break;
                case 'confirmPage':
                    this.nowPage = 'commission';
                    break;
                default:
                    this._logger.log("has not page");
                    break;
            }
        });
    }

    /**
 * 返回上一層
 * @param item
 */
    onBackPageData(item?: any, type?) {
        // 返回最新消息選單
        let output = {
            'page': 'contact-branch',
            'type': 'go',
            'data': item
        };
        let allData = {};
        if (type == 'back') {
            allData = this._allService.allData;
            output.data = allData;
            output.type = 'back';
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
        this._logger.log("into setOutputData");
            this._logger.log("into setOutputData type credit");
            let branchData = this._allService.getCreditBranchData();
            this._logger.log("into branchData:", branchData);
            this.selectData.openBranchId = branchData['branchId'];
            this.selectData.openBranchName = branchData['branchName'];
            this.selectData.accountcd = branchData['accountcd'];
            this.selectData.acctNo = branchData['account'];
            this.selectData.balance = branchData['balance'];
            let cityData = this._allService.getCityData();
            this._logger.log("setOutputData credit, cityData:", cityData);
            this.returnData = cityData;
            let branchStatus = this._allService.getBranchStatus();
            this._logger.log("setOutputData credit, branchStatus:", branchStatus);
            this.branckCheck = branchStatus;
            if (stage == true) {
                this.nowPage = 'commission';
            } else {
                this.nowPage = 'confirmPage';
            }
    }
}
