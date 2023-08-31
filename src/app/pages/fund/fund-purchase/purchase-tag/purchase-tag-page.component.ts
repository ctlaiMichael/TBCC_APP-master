/**
 * 基金申購(主tag，控制：單筆、定期)
 */
import { Component, OnInit, Input, Output, EventEmitter, ViewContainerRef, ViewChild } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { FundPurchaseTagService } from '@pages/fund/shared/service/fund-purchase-tag.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { InfomationService } from '@shared/popup/infomation/infomation.service';
import { FundInformationSinglePurchase } from '@conf/terms/fund/fund-information-single-purchase';
import { FundInformationRegularPurchase } from '@conf/terms/fund/fund-information-regular-purchase';
import { FundSubjectService } from '@pages/fund/shared/component/fund-subject/fund-subject.service';


@Component({
    selector: 'app-purchase-tag',
    templateUrl: './purchase-tag-page.component.html',
    styleUrls: [],
    providers: [FundPurchaseTagService, FundSubjectService]
})
export class PurchaseTagPageComponent implements OnInit {
    /**
      * 參數處理
      */
    @Input() inputData: any;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    nowPageType = 'single-one'; // 當前頁面名稱
    investType = 'single-one'; //交易別，判斷 A:單筆、B:小額(定期定額)、C:轉換、D:小額(定期不定額)
    sellType = ''; // 可購買項目1 單筆 2 定期定額 3 ALL
    flag = true;
    flag2 = true;
    checkFlag = true;
    checkFlag2 = false;
    //是否為預約申購
    resverFlag = false;
    reqData = {
        custId: '',
        trnsType: '1' // 1單筆申購, 2小額申購(定期、不定期), 3預約單筆申購
    };
    //單筆申購
    reqData1 = {
        custId: '',
        trnsType: '1'
    };
    //小額申購(定期、不定期)
    reqData2 = {
        custId: '',
        trnsType: '2'
    };
    //預約單筆申購
    reqData3 = {
        custId: '',
        trnsType: '3'
    };

    single_info: any = {}; //存API(單筆):fI000401，將資料帶往下一頁，ex: 理財專員
    single_twAcnt_data: any = []; //單筆,台幣約定轉出帳號列表
    single_frgn_data: any = []; //單筆,外幣約定轉出帳號列表
    single_trust_data: any = []; //單筆,信託帳號列表
    single_twAcnt_data_resver: any = []; //單筆,台幣約定轉出帳號列表(預約)
    single_frgn_data_resver: any = []; //單筆,外幣約定轉出帳號列表(預約)

    regular_info: any = {}; //存API(小額):fI000401，將資料帶往下一頁，ex: 理財專員
    regular_twAcnt_data: any = []; //小額,台幣約定轉出帳號列表
    regular_frgn_data: any = []; //小額,外幣約定轉出帳號列表
    regular_trust_data: any = []; //小額,信託帳號列表
    regular_pkg_data: any = []; //小額,定期不定額套餐

    resver_info: any = {}; //存API(預約):fI000401，將資料帶往下一頁，ex: 理財專員
    resver_twAcnt_data: any = []; //預約單筆,台幣約定轉出帳號列表
    resver_frgn_data: any = []; //預約單筆,外幣約定轉出帳號列表
    resver_trust_data: any = []; //預約單筆,信託帳號列表


    //送fi000402電文須帶入
    req: any = {
        custId: '', //身分證字號
        investType: '', //交易別
        fundType: '', //交易別，判斷 A:單筆、B:小額(定期定額)、C:轉換、D:小額(定期不定額)
        selectfund: '', //是否精選
        compCode: '', //基金公司代碼
        fundCode: '' //轉出基金代碼
    }
    goSubject = ''; //控制頁面
    //選擇的基金標的
    fundSubject = {
        currency: '',
        fundCode: '',
        fundName: '',
        hiIncome: '',
        ourFund: '',
        risk: ''
    };

    fundStatus: any = {};
    private _defaultHeaderOption: any;

    constructor(
        private _logger: Logger
        , private _headerCtrl: HeaderCtrlService
        , private _handleError: HandleErrorService
        , private _formateServcie: FormateService
        , private _mainService: FundPurchaseTagService
        , private navgator: NavgatorService
        , private confirm: ConfirmService
        , private alert: AlertService
        , private infomationService: InfomationService
        , private fundSubjectService: FundSubjectService
    ) {

    }

    ngOnInit() {
        this._logger.log("fundSubject", this.fundSubject);
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back'
        });
        this._headerCtrl.setLeftBtnClick(() => {
            this.navgator.push('fund');
        });

        if (this.fundSubject.currency == '' && this.fundSubject.fundName == ''
            && this.fundSubject.ourFund == '' && this.fundSubject.risk == ''
            && this.fundSubject.fundCode == '') {
            this._logger.log("line 113 into fundSubject null!!!");
            this.checkFlag2 = true;
        } else {
            this.checkFlag2 = false;
        }

        let investType = 'single-one';
        let targetParams = this.navgator.getParams();
        if (typeof targetParams === 'object' && targetParams != null) {
            // 投資理財導轉修改
            if (targetParams.investType == 'A' || targetParams.investType == 'E') {
                investType = 'single-one';
            } else if (targetParams.investType == 'B' || targetParams.investType == 'D') {
                investType = 'regular';
            }
        }
        //console.log("init");
        this.onChangePurchase(investType);
    }

    //切換TAG
    onChangePurchase(change_type, tag?) {
        this._logger.log("line 72!!!!!!!",tag);
        this.investType = change_type;
        // 如果有該申購方式不清空否則清空查詢

        // 原流程切換就清空選擇 導頁根據可選申購項目判斷是否清空
        
        if ((this.sellType == '3' || tag == '2') && this.fundSubject['fundCode'] != '') {
            // selltype ==3 可申購發方式(單筆與定期定額) || 定期定額切換
            // 不清空
            this.checkFlag2 = false;
        } else if (this.sellType == '') {
            this.checkFlag2 = true;
            this.fundSubject['currency'] = '';
            this.fundSubject['fundCode'] = '';
            this.fundSubject['fundName'] = '';
            this.fundSubject['hiIncome'] = '';
            this.fundSubject['ourFund'] = '';
            this.fundSubject['risk'] = '';
        }


        if (change_type == 'single-one') {
            // 切換tag為單筆(flag沒被改過)，送reqData1：'1'
            if (this.resverFlag == false) {
                this._logger.log("111 into resverFlag false:",this.resverFlag);
                this.nowPageType = 'single-one';
                this.flag = true;
                // this.checkFlag2 = (this.sellType == '3') ? false : true; // true 請選擇 false 不切換
                this.reqData.trnsType = '1';
                // 切換tag為預約單筆(flag被改過)，送reqData1：'3'
            } else {
                this._logger.log("222 into resverFlag true:",this.resverFlag);
                this.nowPageType = 'single-one';
                this.flag = true;
                this.reqData.trnsType = '3';
            }
        } else if (change_type == 'regular') {
            this.nowPageType = 'regular';
            this.flag = false;
            this.flag2 = true;
            this.reqData.trnsType = '2';
            // 判斷切換的tag
            if (tag == '2') {
                // 切換 定期定額 與 定期不定額 不重拉帳號
                // 不換下拉選單
                return true;
            }
        } else if (change_type == 'regular_not') {
            this.nowPageType = 'regular';
            this.flag2 = false;
            // 不重拉帳號
            return true;
        }
        this.sendPurchase();

    }
    // 發送帳好查詢電文
    sendPurchase() {
        this._logger.log("333 into sendPurchase, reqData:",this.reqData);
        this._mainService.getAccount(this.reqData).then(
            (result) => {
                if (this.reqData.trnsType == '1') {
                    this._logger.log("111 into result:",result);
                    this.single_info = result.info_data;
                    this.single_twAcnt_data = result.twAcnt_data;
                    this.single_frgn_data = result.frgn_data;
                    this.single_trust_data = result.trust_data;
                } else if (this.reqData.trnsType == '2') {
                    this._logger.log("222 into result:",result);
                    this.regular_info = result.info_data;
                    this.regular_twAcnt_data = result.twAcnt_data;
                    this.regular_frgn_data = result.frgn_data;
                    this.regular_trust_data = result.trust_data;
                    this.regular_pkg_data = result.pkg_data;
                } else if (this.reqData.trnsType == '3') {
                    this._logger.log("333 into result:",result);
                    this.resver_info = result.info_data;
                    this.resver_twAcnt_data = result.twAcnt_data;
                    this.resver_frgn_data = result.frgn_data;
                    this.resver_trust_data = result.trust_data;
                }
            }, (singleError) => {
                this._logger.log("line 133 singleError:", singleError);
                this._logger.log('line 134 singleError.resultCode:', singleError.resultCode);
                if (singleError.resultCode == 'ERR1C104') {
                    this.confirm.show('現在已超過本日交易時間，或非營業日，如您欲以預約方式申購，請點選 "繼續" !', {
                        title: '提醒您',
                        btnYesTitle: '繼續',
                        btnNoTitle: '離開'
                    }).then(
                        () => {
                            //繼續(popup)內層
                            //轉預約動作
                            this.resverFlag = true; //轉預約申購flag
                            this.reqData.trnsType = '3';
                            this.sendPurchase();
                        },
                        () => {
                            //離開(popup)內層
                            this.navgator.push('fund');
                        }
                    );
                } else if (singleError.resultCode == 'ERR1C101') {
                    this.alert.show('親愛的客戶您好，您尚未申請網路銀行基金下單，請至營業單位臨櫃辦理網路銀行基金下單功能', {
                        title: '提醒您',
                        btnTitle: '我知道了',
                    }).then(
                        () => {
                            // 選擇取消
                            this.navgator.push('fund');
                        }
                    );
                } else if (singleError.resultCode == 'ERR1C102') {
                    this.confirm.show('親愛的客戶您好：本行尚未有您的投資屬性，因此不能執行行動銀行基金下單交易!請點選下方按鈕進行「風險承受度測驗」後，再重新進行基金下單交易。', {
                        title: '提醒您',
                        btnYesTitle: '風險承受度測驗',
                        btnNoTitle: '取消'
                    }).then(
                        () => {
                            //繼續(popup)內層
                            //跳轉風險成受度測驗
                            this.navgator.push('fund-group-resk-test');
                        },
                        () => {
                            //離開(popup)內層
                            this.navgator.push('fund');
                        }
                    );
                } else if (singleError.resultCode == 'ERR1C103') {
                    this.confirm.show('親愛的客戶您好：您已超過一年以上未做風險承受度測驗，為充分瞭解您目前的投資風險承受度狀況，請點選下方按鈕進行「風險承受度測驗」後，再重新進行基金下單交易。', {
                        title: '提醒您',
                        btnYesTitle: '風險承受度測驗',
                        btnNoTitle: '取消'
                    }).then(
                        () => {
                            //繼續(popup)內層
                            //跳轉風險成受度測驗
                            this.navgator.push('fund-group-resk-test');
                        },
                        () => {
                            //離開(popup)內層
                            this.navgator.push('fund');
                        }
                    );
                } else {
                    this._handleError.handleError(singleError);
                    this.navgator.push('fund');
                    this._logger.log("line 194 not has data!");
                }
            }
        );
    }

    //選擇基金標的
    onSelectSub() {
        // 使用者選擇基金清空可申購項目
        this.sellType = '';
        //當下選擇的是：單筆申購
        if (this.investType == 'single-one') {
            this.req.investType = 'A';
            this._logger.log("single-one: line 129!!!");
            this._logger.log("investType:", this.req.investType);
            this.goSubject = 'select-subject';
        }
        //當下選擇的是：小額申購(定期定額)
        else if (this.investType == 'regular') {
            this.req.investType = 'B';
            this._logger.log("regular: line 135!!!");
            this._logger.log("investType:", this.req.investType);
            this.goSubject = 'select-subject';
        }
        //當下選擇的是：小額申購(定期不定額)
        else if (this.investType == 'regular_not') {
            this.req.investType = 'D';
            this._logger.log("regular-not: line 141!!!");
            this._logger.log("investType:", this.req.investType);
            this.goSubject = 'select-subject';
        }
    }

    //開始申購
    onPurchase() {
        //單筆
        if (this.investType == 'single-one') {
            if (this.fundSubject.currency !== '' && this.fundSubject.fundName !== ''
                && this.fundSubject.ourFund !== '' && this.fundSubject.risk !== ''
                && this.fundSubject.fundCode != '') {
                this._logger.log("line 258 fundSubject has");
                this._logger.log("line 259 fundSubject:", this.fundSubject);
                this.checkFlag = false;
                this.checkFlag2 = false;
                this._logger.log("go next page single!!");
                this.goSubject = 'go-single';
            } else {
                this._logger.log("line 264 fundSubject null", this.fundSubject);
                this.checkFlag = true;
                this.checkFlag2 = true;
                return false;
            }

            //定期定額
        } else if (this.investType == 'regular') {
            if (this.fundSubject.currency !== '' && this.fundSubject.fundName !== ''
                && this.fundSubject.ourFund !== '' && this.fundSubject.risk !== ''
                && this.fundSubject.fundCode !== '') {
                this.checkFlag = false;
                this.checkFlag2 = false;
                this._logger.log("go next page regular!!");
                this.goSubject = 'go-regular';
            } else {
                this.checkFlag = true;
                this.checkFlag2 = true;
                return false;
            }
            //定期不定額
        } else if (this.investType == 'regular_not') {
            if (this.fundSubject.currency !== '' && this.fundSubject.fundName !== ''
                && this.fundSubject.ourFund !== '' && this.fundSubject.risk !== ''
                && this.fundSubject.fundCode !== '') {
                this.checkFlag = false;
                this.checkFlag2 = false;
                this._logger.log("go next page regular_not!!");
                this.goSubject = 'go-regular-not';
            } else {
                this.checkFlag = true;
                this.checkFlag2 = true;
                return false;
            }
            //預約單筆
        }
        // else if (this.investType == 'single-one' && this.resverFlag == true) {
        //     if (this.fundSubject.currency !== '' && this.fundSubject.fundName !== ''
        //         && this.fundSubject.ourFund !== '' && this.fundSubject.risk !== ''
        //         && this.fundSubject.fundCode !== '') {
        //         this.checkFlag = false;
        //         this.checkFlag2 = false;
        //         this._logger.log("go next page regular_not!!");
        //         this.goSubject = 'go-resver-single';
        //     } else {
        //         this.checkFlag = true;
        //         this.checkFlag2 = true;
        //         return false;
        //     }
        // }
    }

    //取消
    onCanel() {
        //返回
        this.navgator.push('fund');

        //***用取消按鈕模擬「預約單筆申購」的狀況
        // this.confirm.show('現在已超過本日交易時間，或非營業日，如您欲以預約方式贖回，請點選 "繼續" !', {
        //     title: '提醒您',
        //     btnYesTitle: '繼續',
        //     btnNoTitle: '離開'
        // }).then(
        //     () => {
        //         //繼續(popup)內層
        //         //轉預約動作
        //         this.resverFlag = true; //轉預約申購flag
        //         this.resverPurchase();
        //     },
        //     () => {
        //         //離開(popup)內層
        //         this.navgator.push('fund');
        //     }
        // );

        //測試轉換用
        // this.req.investType = 'C';
        // this.req.fundCode = '30';
        // this.req.compCode = '';
        // this.goSubject = 'select-subject';
    }

    //點擊基金單筆申購說明
    onSinglePopoup() {
        // this.goSubject = 'single-popoup';
        const set_data = new FundInformationSinglePurchase();
        this.infomationService.show(set_data);
    }

    //點擊定期定額申購說明
    onRegularPopoup() {
        const set_data = new FundInformationRegularPurchase();
        this.infomationService.show(set_data);
    }

    //點擊定期定額套餐說明
    onRegularCodePopoup() {
        this.goSubject = 'regular-code-popuop';
    }

    /**
     * 子層返回事件(分頁)
     * @param e
     */
    onPageBackEvent(e) {
        this._logger.step('Deposit', 'onPageBackEvent', e);
        this._logger.log("onPageBack pagetag!");
        let page = 'list';
        let pageType = 'list';
        let tmp_data: any;
        let fundStatus: any;
        let converFundCompany: any; //轉換才有值
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
            if (e.hasOwnProperty('fundStatus')) {
                fundStatus = e.fundStatus;
            }
            if (e.hasOwnProperty('converFundCompany')) {
                converFundCompany = e.converFundCompany;
            }
        }

        //同意選單
        if (page == 'enter-agree' && pageType == 'success') {
            if (tmp_data == true) {
                tmp_data = {};

                // 同意 投資裡轉頁 如果使投資理財需要自動帶參數 Start
                let targetParams = this.navgator.getParams();

                if (typeof targetParams == 'object' && (Object.keys(targetParams).length > 0) && !!targetParams) {
                    console.log('457', targetParams);
                    // 必要參數確認

                    let fundCode = targetParams.hasOwnProperty('fundCode') ? targetParams['fundCode'] : '';
                    // 導到那個申購TAG 預設為A => 單筆 B => 定期定額
                    let whitchTag = targetParams.hasOwnProperty('investType') ? targetParams['investType'] : 'A';
                    // let fundType = targetParams.hasOwnProperty('fundType') ? targetParams['fundType'] : '';
                    // let selectfund = targetParams.hasOwnProperty('selectfund') ? targetParams['selectfund'] : '';
                    // let compCode = targetParams.hasOwnProperty('compCode') ? targetParams['compCode'] : '';
                    if (fundCode != '') {

                        let searchData = {
                            fundCode: fundCode,
                            investType: 'E', // 固定帶 E 查詢基金電文詳細資訊
                            fundType: '',
                            selectfund: '',
                            compCode: '',
                        };
                        // 發送查詢電文Fi000402
                        this.fundSubjectService.getSubject(searchData).then(
                            (search_S) => {
                                // 取得基金標的詳細資料電文內容
                                console.log('get fund target data', search_S);
                                search_S = search_S['data1'][0];
                                // 取得對應的基金標的
                                // let targetFundData = null;
                                // targetFundData = this.fundSubjectService.findFundData(searchData, search_S);
                                // if (targetFundData) {
                                //  比對後塞資料導申購頁
                                let setfundStatus = {
                                    foreginFund: '',
                                    foreginType: '',
                                    selectFund: '',
                                    selectType: ''
                                };
                                // 交易別
                                if (whitchTag == 'A' || whitchTag == 'E') {
                                    this.investType = 'single-one';
                                } else if (whitchTag == 'B') {
                                    this.investType = 'regular';
                                } else if (whitchTag == 'D') {
                                    this.investType = 'regular_not';
                                }

                                // 業務別

                                if (search_S.fundType == 'C') {
                                    setfundStatus.foreginFund = '國內基金';
                                    setfundStatus.foreginType = '1';
                                } else {
                                    setfundStatus.foreginFund = '國外基金';
                                    setfundStatus.foreginType = '2';
                                }
                                // 是否精選
                                if (search_S.selectfund == 'Y') {
                                    setfundStatus.selectFund = '精選基金';
                                    setfundStatus.selectType = '1';
                                } else {
                                    setfundStatus.selectFund = '自選基金';
                                    setfundStatus.selectType = '2';
                                }
                                // 可申購方式
                                this.sellType = search_S.hasOwnProperty('sellType') ? search_S['sellType'] : '';
                                this.fundStatus = setfundStatus;
                                this.fundSubject.currency = search_S.hasOwnProperty('currency') ? search_S['currency'] : '';
                                this.fundSubject.fundCode = search_S.hasOwnProperty('fundCode') ? search_S['fundCode'] : '';
                                this.fundSubject.fundName = search_S.hasOwnProperty('fundName') ? search_S['fundName'] : '';
                                this.fundSubject.hiIncome = search_S.hasOwnProperty('hiIncome') ? search_S['hiIncome'] : '';
                                this.fundSubject.ourFund = search_S.hasOwnProperty('ourFund') ? search_S['ourFund'] : '';
                                this.fundSubject.risk = search_S.hasOwnProperty('risk') ? search_S['risk'] : '';
                                console.log('agree', tmp_data);
                                this.goSubject = 'select-page';
                                this.checkFlag = false;
                                this.checkFlag2 = false;
                                return true;

                            }, (search_F) => {
                                // 查詢電文錯誤
                                this.goSubject = 'select-page';
                                this._handleError.handleError({
                                    title: '訊息',
                                    content: '無法取得對應的基金標的!',
                                    backType: 'dialog'
                                });
                            }
                        );
                    } else {
                        // 缺少參數 or 參數錯誤
                        this.goSubject = 'select-page';

                        this._handleError.handleError({
                            title: '訊息',
                            content: '傳入參數錯誤或路徑不存在',
                            backType: 'dialog'
                        });
                    }

                    //  投資裡轉頁end

                } else {
                    this.goSubject = 'select-page';
                }


            } else {
                this.navgator.push('fund');
            }
            this._logger.log('BACK FROM AGREE');
        }
        //單筆申購說明
        if (page == 'single-purchase-content' && pageType == 'success') {
            this._logger.log("line 462 into single-purchase-popoup!");
            this.goSubject = 'select-page';
        }
        //定期定額(不定額)說明
        if (page == 'regular-purchase-content' && pageType == 'success') {
            this._logger.log("line 467 into regular-purchase-popoup!");
            this.goSubject = 'select-page';
        }
        //定期定額(不定額)套餐說明
        if (page == 'regular-purchase-code' && pageType == 'success') {
            this.goSubject = 'select-page';
        }
        //單筆申購，編輯頁1(左側返回)
        if (page == 'purchase-single' && pageType == 'back') {
            this._logger.log("line 474 single back!");
            this.goSubject = 'select-page';
            this.nowPageType = 'single-one';
            this.flag = true;
            this._headerCtrl.updateOption(this._defaultHeaderOption);
        }
        //定期定額申購，編輯頁1(左側返回)
        if (page == 'purchase-regular' && pageType == 'back') {
            this._logger.log("line 487 regular back!");
            this.goSubject = 'select-page';
            this.nowPageType = 'regular';
            this.flag = false;
            this.flag2 = true;
            this._headerCtrl.updateOption(this._defaultHeaderOption);
        }
        //定期不定額申購，編輯頁1(左側返回)
        if (page == 'purchase-regular-not' && pageType == 'back') {
            this._logger.log("line 493 regular-not back!");
            this.goSubject = 'select-page';
            this.nowPageType = 'regular';
            this.flag = false;
            this.flag2 = false;
            this._headerCtrl.updateOption(this._defaultHeaderOption);
        }
        //預約單筆申購，編輯頁1(左側返回)
        if (page == 'purchase-resver-single' && pageType == 'back') {
            this._logger.log("line 502 resver-single!");
            this.goSubject = 'select-page';
            this.nowPageType = 'single-one';
            this.flag = true;
            this._headerCtrl.updateOption(this._defaultHeaderOption);
        }
        //投資標的module點擊左側返回(接收)
        if (page == 'select-subject' && this.fundSubject.currency == '' && this.fundSubject.fundName == ''
            && this.fundSubject.ourFund == '' && this.fundSubject.risk == '' && this.fundSubject.fundCode == '') {
            this._logger.log("into back select-subject letBtn!");
            this.goSubject = 'select-page';
            this._headerCtrl.setLeftBtnClick(() => {
                this.navgator.push('fund');
            });
        }

        this._logger.log("page:", page);
        this._logger.log("pageType:", pageType);
        this._logger.log("tmp_data:", tmp_data);
        this._logger.log("fundStatus:", fundStatus);
        this._logger.log('converFundCompany:', converFundCompany); //轉換用
        this.fundStatus = fundStatus;

        if (typeof tmp_data.currency !== 'undefined' && typeof tmp_data.fundCode !== 'undefined'
            && typeof tmp_data.fundName !== 'undefined' && typeof tmp_data.hiIncome !== 'undefined'
            && typeof tmp_data.ourFund !== 'undefined' && typeof tmp_data.risk !== 'undefined') {
            if (!tmp_data.hasOwnProperty('sellType')) {
                this.sellType = '';
            }
           
            this.fundSubject.currency = tmp_data.currency;
            this.fundSubject.fundCode = tmp_data.fundCode;
            this.fundSubject.fundName = tmp_data.fundName;
            this.fundSubject.hiIncome = tmp_data.hiIncome;
            this.fundSubject.ourFund = tmp_data.ourFund;
            this.fundSubject.risk = tmp_data.risk;
        } else {
            this.fundSubject.currency = '';
            this.fundSubject.fundCode = '';
            this.fundSubject.fundName = '';
            this.fundSubject.hiIncome = '';
            this.fundSubject.ourFund = '';
            this.fundSubject.risk = '';
            this.checkFlag = false;
        }

        this._logger.log("line 303 fundSubject:", this.fundSubject);

        //判斷回傳顯示，請選擇or欄位
        if (this.fundSubject.currency !== '' && this.fundSubject.fundName !== ''
            && this.fundSubject.ourFund !== '' && this.fundSubject.risk !== ''
            && this.fundSubject.fundCode !== '') {
            this.checkFlag = false;
            this.checkFlag2 = false;
        } else {
            this.checkFlag = false;
            this.checkFlag2 = true;
            return false;
        }

        if (pageType == 'success' && page == 'select-subject') {
            this._logger.log("into back select-subject success");
            this.goSubject = 'select-page';
        }
    }



    /**
     * 返回上一層
     * @param item
     */
    onBackPageData(item?: any) {
        // 返回最新消息選單
        let output = {
            'page': 'purchase-tag',
            'type': 'back',
            'data': item
        };
        if (item.hasOwnProperty('page')) {
            output.page = item.page;
        }
        if (item.hasOwnProperty('type')) {
            output.type = item.type;
        }
        if (item.hasOwnProperty('data')) {
            output.data = item.data;
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
            if (page == 'single-page') {
                if (errorObj.respCode == 'ERR1C108') {
                    this.ERR1C108();
                    return false;
                }
            }
        }
        // 列表頁：首次近來錯誤推頁
        errorObj['type'] = 'dialog';
        this._handleError.handleError(errorObj);
    }

    ERR1C108() {
        this._handleError.handleError({
            type: 'dialog',
            title: 'POPUP.NOTICE.TITLE',
            content: 'ERROR.CANNOT_PURCHARSE'
            //投資風險屬性不允許申購或轉換此檔基金
        });
    }



    // // --------------------------------------------------------------------------------------------
    // //  ____       _            _         _____                 _
    // //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    // //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    // //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    // //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // // --------------------------------------------------------------------------------------------

}
