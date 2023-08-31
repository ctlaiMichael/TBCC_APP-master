/**
 * 停損停利設定查詢
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { FundBalanceSetService } from '../shared/service/fund-balance-set.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';

@Component({
    selector: 'app-fund-balance-set',
    templateUrl: './fund-balance-set.component.html',
    providers: [FundBalanceSetService]
})
export class FundBalanceSetComponent implements OnInit {
    /**
     * 參數處理
     */
    @Input() setData: any;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    nowPage = 'edit_page1';
    createSub = false; //跳popop
    setBalance = false; //跳popop
    custId = '';
    info_data = {}; //存api回傳
    data = []; //存api回傳
    fundData = []; //整理過
    fundInfo = {}; //整理過(資訊)
    selectedData = []; //設定過(view顯示)，畫面顯示主要用(主畫面)
    unselectData = []; //沒設定過(view顯示)，畫面顯示主要用(新增標的頁面)
    checkSub = []; //選擇要加入的標的

    //---------- 設定popoup頁面用 -------------
    //跟view頁面比對，綁ngModel

    itemData = {
        capital: '',
        code: '',
        emailNotice: '',
        fundCode: '',
        fundName: '',
        incomePoint: '',
        incomeState: '',
        investType: '',
        profitPoint: '',
        selected: false,
        showCheck: false,
        showDelete: false,
        transCode: '',
        trustAcnt: '',
        webNotice: '',
        autoRed: '',
        continue: '',
        sLossCD: '', //停損點正負號
        sProCD: '' //獲利點正負號
    };
    showImmCheck = false; //即時畫面
    showEmailCheck = false; //E-mail
    showAutoCheck = false; //自動贖回
    showContinCheck = true; //繼續、不繼續
    continueMode = '-繼續'; //紀錄使用者選擇，view顯示用 ex:繼續

    //綁ngModel
    pointMinus = {
        profitPoint: '', //獲利點 正負
        incomePoint: '' //停損點 正負
    };

    //送結果頁request用
    reqData: any = {};
    //刪除用
    deleteData = [];
    i = 0;

    save_profitPoint = {}; //檢核用
    save_incomePoint = {}; //檢核用
    check_profit = false; //紅框
    check_income = false; //紅框
    profit_msg = '';
    income_msg = '';
    //-------------------- 安控 -------------------------
    // request
    userAddress = {
        'USER_SAFE': '',
        'SEND_INFO': ''
    };

    "SEND_INFO": "";
    transactionObj = {
        serviceId: 'FI000706',
        categoryId: '6',
        transAccountType: '1',
    };

    securityObj = {
        'action': 'init',
        'sendInfo': {}
    }

    safeE = {};
    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private navgator: NavgatorService
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private _mainService: FundBalanceSetService
        , private alert: AlertService
        , private _checkSecurityService: CheckSecurityService
    ) {
    }


    ngOnInit() {
        this._initEvent();

        this._mainService.getBalanceQuery(this.custId).then(
            (result) => {
                this.info_data = result.info_data;
                this.data = result.data;
                this._logger.log("line 47 info_data:", this.info_data);
                //整理資料
                this.fundInfo = this._mainService.mappingBalance(this.data);
                this.fundData = this.fundInfo['fundData']; //整理過資料
                this.selectedData = this.fundInfo['selectedData'];
                this.unselectData = this.fundInfo['unselectData'];
                this._logger.log('line 61 fundData:', this.fundData);
                this._logger.log("line 64 selectedData", this.selectedData);
                this._logger.log("line 65 unselectData:", this.unselectData);
                if (this.fundInfo['hasSet'] == false) {
                    //alert訊息，目前尚未設定
                    this.alert.show('目前尚未設定基金通知標的', {
                        title: '提醒您',
                        btnTitle: '確認',
                    }).then(
                        () => {
                            // 選擇確認
                        }
                    );
                }
            },
            (errorObj) => {
                this._handleError.handleError(errorObj);
                this.navgator.push('fund');
                this._logger.log("line 51 get errorObj:", errorObj);
            }
        );

        // 安控變數初始化
        this.securityObj = {
            'action': 'init',
            'sendInfo': this.userAddress.SEND_INFO
        };
    }

    //啟動事件
    _initEvent() {
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': '停損/獲利點設定注意事項'
        });
        this._headerCtrl.setLeftBtnClick(() => {
            this.navgator.push('fund');
        });
    }

    //點擊新增投資標的
    onCreateSub() {
        this._logger.log("line 86 into onCreateSub()!");
        this._logger.log("line 88 unselectData", this.unselectData);
        this.createSub = true;
        if (this.unselectData.length <= 0) {
            this.createSub = false;
            //alert訊息，目前尚未設定
            this.alert.show('無可新增標的', {
                title: '提醒您',
                btnTitle: '確認',
            }).then(
                () => {
                    // 選擇確認
                }
            );
            this._logger.log('unselectData empty!!');
        }
    }
    //點擊確認(新增標的popoup)
    onPopConfirm() {
        this._logger.log("line 86 fundData:", this.fundData);
        this._logger.log("line 87 checkSub:", this.checkSub);
        this.checkSub.forEach(checkItem => {
            this._logger.log('checkItem:', checkItem);
            checkItem['selected'] = true;
            this.selectedData.unshift(checkItem);
            for (let i = 0; i < this.unselectData.length; i++) {
                if (this.unselectData[i]['transCode'] == checkItem['transCode']) {
                    this._logger.log('line 104 unselectData.length: ', checkItem['transCode']);
                    this.unselectData.splice(i, 1);
                }
            }
            this._logger.log('line 107 unselectData.length: ', this.unselectData.length);
            this._logger.log('line 107 unselectData: ', this.unselectData);
        });
        this.checkSub = []; //結束要把傳來的物件清空
        this.createSub = false; //關閉視窗
    }

    //點擊取消(新增標的popoup)
    onCancel() {
        this.checkSub = []; //清空選擇的
        this.createSub = false; //關閉視窗
    }

    //選擇其中一筆標的，勾選or取消勾選(新增標的popoup)
    onSelectOne(item) {
        this._logger.log("line 90 into onSelectOne()!");
        if (item['showCheck'] == false) {
            item['showCheck'] = true;
            this.checkSub.push(item);
            // item['selected'] = true;
        } else {
            item['showCheck'] = false;
            // item['selected'] = false;
            this.checkSub = []; //清空選擇的
        }
    }

    //點選設定(設定popoup)
    onSetBalance(item) {
        this.setBalance = true; //打開頁面
        //儲存點擊進來，該筆資料的停損、停利值
        this.itemData = item;

        this._logger.log('line 206 itemData:', this.itemData);

        if (item['webNotice'] == 'Y') {
            this._logger.log("line 243 into webNotice Y!");
            this.showImmCheck = true;
            
        } else {
            this._logger.log("line 243 into webNotice N!");
            this.showImmCheck = false;
           
        }
        if (item['emailNotice'] == 'Y') {
            this._logger.log("line 243 into emailNotice Y!");
            this.showEmailCheck = true;
            this.itemData.emailNotice = 'Y';
        } else {
            this._logger.log("line 243 into emailNotice N!");
            this.showEmailCheck = false;
            
        }
        if (item['autoRed'] == 'Y') {
            this._logger.log("line 243 into autoRed Y!");
            this.showAutoCheck = true;
            
        } else {
            this._logger.log("line 243 into autoRed N!");
            this.showAutoCheck = false;
           
        }
    }

    //點選取消(設定popoup)
    onCancelSet() {
        // this.itemData['incomePoint'] = '0';
        // this.itemData['profitPoint'] = '0';
        // this.itemData['webNotice'] = 'N';
        // this.itemData['emailNotice'] = 'N';
        // this.itemData['autoRed'] = 'N';
        this.continueMode = ''; //只有繼續、不繼續，有選擇才顯示
        this.setBalance = false;
    }

    //點選確定(設定popoup)
    onConfirmSet() {
        this._logger.log("line 187 itemData.profitPoint:", this.itemData['profitPoint']);
        this._logger.log("line 188 itemData.incomePoint:", this.itemData['incomePoint']);

        //檢核停利點
        this.save_profitPoint = this._mainService.check_profitPoint(this.itemData['profitPoint']);
        //檢核停損點
        this.save_incomePoint = this._mainService.check_incomePoint(this.itemData['incomePoint']);

        if (this.save_profitPoint['status'] == false) {
            this.check_profit = true;
            this.profit_msg = this.save_profitPoint['msg'];
        } else {
            this.check_profit = false;
        }

        if (this.save_incomePoint['status'] == false) {
            this.check_income = true;
            this.income_msg = this.save_incomePoint['msg'];
        } else {
            this.check_income = false;
        }
        if (this.save_profitPoint['status'] == true && this.save_incomePoint['status'] == true) {
            for (let i = 0; i < this.selectedData.length; i++) {
                if (this.itemData['transCode'] == this.selectedData[i]['transCode']) {
                    this.selectedData[i]['profitPoint'] = this.itemData['profitPoint'];
                    this.selectedData[i]['incomePoint'] = this.itemData['incomePoint'];
                    this.selectedData[i].autoRed = this.itemData.autoRed;
                    this.selectedData[i].continue = this.itemData.continue;
                    this.selectedData[i].webNotice = this.itemData.webNotice;
                    this.selectedData[i].emailNotice = this.itemData.emailNotice;
                    this.selectedData[i].sProCD = this.itemData.sProCD;
                    this.selectedData[i].sLossCD = this.itemData.sLossCD;
                }
            }
            
            this.setBalance = false; //關閉視窗
            this._logger.log('line 195 selectedData:', this.selectedData);
            this._logger.log("line 189 pointMinus:", this.pointMinus);
        } else {
            return false;
        }
    }

    //點選刪除(其中一筆)
    onDelete(item) {
        this._logger.log("line 145 into onDelete!");
        if (item['showDelete'] == false) {
            item['showDelete'] = true;
        } else {
            item['showDelete'] = false;
        }
    }

    //點選通知贖回(checkbox)
    onNotice(notice: string) {
        switch (notice) {
            case 'imm': //即時
                if (this.showImmCheck == false) {
                    this.showImmCheck = true;
                    this.itemData['webNotice'] = 'Y';
                    // this.noticeMode = '即時畫面';
                    this.continueMode = ''; //只有繼續、不繼續，有選擇才顯示
                } else {
                    this.showImmCheck = false;
                    this.itemData['webNotice'] = 'N';
                    // this.noticeMode = '';
                    this.continueMode = ''; //只有繼續、不繼續，有選擇才顯示
                }
                break;
            case 'email': //email
                if (this.showEmailCheck == false) {
                    this.showEmailCheck = true;
                    this.itemData['emailNotice'] = 'Y';
                    this.continueMode = ''; //只有繼續、不繼續，有選擇才顯示
                } else {
                    this.showEmailCheck = false;
                    this.itemData['emailNotice'] = 'N';
                    this.continueMode = ''; //只有繼續、不繼續，有選擇才顯示
                }
                break;
            //自動贖回，於新版開啟   
            case 'auto': //自動贖回
            
                if (this.showAutoCheck == false) {
                    this.showAutoCheck = true;
                    // this.noticeMode = '自動贖回';
                    this.continueMode = '-繼續';
                    this.showEmailCheck = false;
                    this.showImmCheck = false;
                    this.itemData.autoRed = 'Y';
                    this.showContinCheck = true;
                    this.itemData.continue = 'Y';
                    this.itemData.emailNotice = 'N';
                    this.itemData.webNotice = 'N';
                } else {
                    this.showAutoCheck = false;
                    // this.noticeMode = '';
                    this.showEmailCheck = false;
                    this.showImmCheck = false;
                    this.itemData.autoRed = 'N';
                    this.itemData.continue = 'N';
                    this.itemData.emailNotice = 'N';
                    this.itemData.webNotice = 'N';
                }
                break;
        }
    }

    //點選繼續、不繼續
    //於新版本開啟
    onContinue(mode: string) {
        if (mode == 'yes') {
            this.showContinCheck = true;
            this.continueMode = '-繼續';
            this.itemData.continue = 'Y';
            // this._logger.log("line 385 continue:", this.itemData.continue);
        } else {
            this.showContinCheck = false;
            this.continueMode = '-不繼續';
            this.itemData.continue = 'N';
            // this._logger.log("line 385 continue:", this.itemData.continue);
        }
    }

    //主畫面點擊「確定變更」
    onGoNext() {
        this._logger.log("line 314 selectedData:", this.selectedData);
        this.selectedData.forEach(item => {
            if (item['showDelete'] == true) {
                item['incomePoint'] = '00000';
                item['profitPoint'] = '00000';
            }
        });
        this._logger.log("line 385 selectedData:", this.selectedData);
        this.reqData = this._mainService.mappingReqData(this.selectedData,this.info_data);
        this._logger.log("line 378 test trnsToken, selectedData:",this.selectedData);
        this._logger.log("line 379 reqData:",this.reqData);
        this.nowPage = 'result_page';
        
        // // 安控變數設置
        // this.securityObj = {
        //     'action': 'submit',
        //     'sendInfo': this.userAddress.SEND_INFO
        // };
    }

    //主畫面點擊「回上頁」
    onBack() {
        this.navgator.push('fund');
    }

    //------------------------------------------------------
    // 安控函式
    // securityOptionBak(e) {
    //     this._logger.log('securityOptionBak: ', e);
    //     if (e.status) {
    //         // 取得需要資料傳遞至下一頁子層變數
    //         this.userAddress.SEND_INFO = e.sendInfo;
    //         this.userAddress.USER_SAFE = e.sendInfo.selected;
    //         this.securityObj = {
    //             'action': 'init',
    //             'sendInfo': e.sendInfo
    //         };
    //     } else {
    //         // do errorHandle 錯誤處理 推業或POPUP
    //         e['type'] = 'message';
    //         this._handleError.handleError(e.ERROR);
    //     }
    // }

    // stepBack(e) {
    //     if (e.status) {
    //         this._logger.log(e);
    //         if (e.securityType === '3') {
    //             e.otpObj.depositNumber = ''; // 轉出帳號 
    //             e.otpObj.depositMoney = ''; // 金額 
    //             e.otpObj.OutCurr = ''; // 幣別 
    //             e.transTypeDesc = ''; // 
    //         } else if(e.securityType === '2') {
    //              // 憑證 寫入簽章本文
    //             e.signText = this.reqData;
    //             this._logger.log("line 421 e.signText:",e.signText);
    //         }
    //         // 統一叫service 做加密 
    //         this._checkSecurityService.doSecurityNextStep(e).then(
    //             (S) => {
    //                 this._logger.log(S);
    //                 // 把S做為output傳回; 
    //                 // this.backPageEmit.emit({
    //                 //     type: 'goResult',
    //                 //     value: true,
    //                 //     securityResult: S
    //                 // });
    //                 this.safeE = {
    //                     securityResult: S
    //                 };
    //                 this.nowPage = 'result_page';
    //                 this._logger.log("nowPage:", this.nowPage);

    //             }, (F) => {
    //                 this._logger.log(F);
    //                 this.backPageEmit.emit({
    //                     type: 'goResult',
    //                     value: false,
    //                     securityResult: F
    //                 });
    //             }
    //         );
    //     } else {
    //         return false;
    //     }
    // }


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

        if (page == 'enter-balance' && pageType == 'success') {
            this.nowPage = 'edit_page1';
            this._logger.log('BACK FROM AGREE');
        } else {
            this.navgator.push('fund');
        }

        this._logger.log("page:", page);
        this._logger.log("pageType:", pageType);
        this._logger.log("tmp_data:", tmp_data);
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
}

