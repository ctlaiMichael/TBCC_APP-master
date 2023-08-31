/**
 * 線上申貸-同一關係人(共用)
 * 婚姻狀況 marital_status
 * 1:單身
 * 2:已婚
 * 3:其他
 * 受撫養子女數 supportChildren
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { MortgageIncreaseService } from '@pages/online-loan/shared/service/mortgage-increase.service';
import { RelationFormService } from './relation-form.service';
import { CheckService } from '@shared/check/check.service';
import { AuthService } from '@core/auth/auth.service';

@Component({
    selector: 'app-relation-form',
    templateUrl: './relation-form.component.html',
    styleUrls: [],
    providers: [RelationFormService]
})

export class RelationFormComponent implements OnInit {
    @Input() type: string;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Input() fullData: any; // 前一頁傳來之reqData，這頁送電文用
    @Input() resver: string; //是否為預填單 'Y':預填,'N':非預填
    @Input() action: string; //紀錄返回狀態，'go':進入此頁，'back':返回此頁
    // 下一流程需要
    reqData = {
        relationKind1: '',
        relationKind2: '',
        relationKind3: ''
    };

    // 儲存資料
    relativeData = []; // 資料：授信申請人配偶、二親等以內之血親
    companyData = []; // 資料：授信申請人擔任負責人之企業
    coupleData = []; // 資料：填寫配偶負責人企業資料

    allData: any = {};
    nowPage = 'familyPage';
    Required = 0; // 必填欄位
    // 上限
    maxAllowCount = {
        relative: 6,
        company: 4,
        couple: 4
    };

    constructor(
        private _logger: Logger
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private alert: AlertService
        , private _uiContentService: UiContentService
        , private _allService: MortgageIncreaseService
        , private _mainService: RelationFormService
        , private _checkService: CheckService
        , private auth: AuthService
    ) { }

    ngOnInit() {
        // 左側返回
        // this._headerCtrl.setLeftBtnClick(() => {
        //     this.onCancel();
        // });
        let stageData = this._allService.getStageStaus();
        let stage = stageData['relation'];
        this.allData = this._allService.getAllData();
        // this._logger.error("into relation!");
        // this._logger.error("fullData:", this.fullData);
        this.Required = this._mainService.checkRequiredNum(); // 必填數量
        //若為上一頁返回，需執行資料回傳(顯示之前使用者輸入之資料)
        if (this.action == 'back') {
            this.setOutputData(false); //返回使用
        } else if (stage == true) {
            this.setOutputData(stage); //返回使用
        } else {
            let tmp_i = 0;
            for (tmp_i = 0; tmp_i < this.Required; tmp_i++) {
                if (tmp_i >= this.maxAllowCount['relative']) {
                    break;
                }
                this.onInsert('family', true, true);
            }
            this.onInsert('company', true);
            this.onInsert('couple', true);
        }
        // this._logger.log("Required:", this.Required);

        this.doBack();
    }

    // 血親上一步(OK)
    onCancel() {
        this.onBackPageData({}, 'back');
    }

    /**
     * 血親下一步(OK)
     */
    onConfirm() {
        this.doBack();
        // 畫面上數量 小於 必填數(不符)
        let check_required = this.checkRelativeCount();
        if (!check_required) {
            // 數量檢核
            return false;
        }
        this._logger.log("onConfirm, relativeData:", this.relativeData);
        let check_data = this._mainService.checkRelationFamilyData(this.relativeData);
        this.relativeData = check_data.data;
        if (!check_data.status) {
            return false;
        }
        this._allService.setRelationData(this.relativeData, 1);
        this.reqData.relationKind1 = check_data.dataSaveStr;
        this.nowPage = 'compPage';
        this.doScrollTop();
    }


    // 申請人_負責人 上一步 (OK)
    onCancel_2() {
        this.nowPage = 'familyPage';
        this.doScrollTop();
    }


    // 申請人_負責人 下一步
    onConfirm_2() {
        this.doBack();
        let check_data = this._mainService.checkRelationCompanyData(this.companyData);
        this.companyData = check_data.data;
        if (!check_data.status) {
            return false;
        }

        this._allService.setRelationData(this.companyData, 2);
        this.reqData.relationKind2 = check_data.dataSaveStr;
        this.nowPage = 'spousePage';
        this.doScrollTop();
    }


    // 配偶_負責人 上一步 (OK)
    onCancel_3() {
        this.nowPage = 'compPage';
        this.doScrollTop();
    }


    // 配偶_負責人 下一步
    onConfirm_3() {
        this.doBack();
        let check_data = this._mainService.checkRelationCompanyData(this.coupleData);
        this.coupleData = check_data.data;
        if (!check_data.status) {
            return false;
        }
        this._allService.setRelationData(this.coupleData, 3);
        this.reqData.relationKind3 = check_data.dataSaveStr;
        this.nowPage = 'confirmPage';
        this.doScrollTop();
    }

    // 確認頁 上一步 (OK)
    onCancel_4() {
        this.nowPage = 'spousePage';
        this.doScrollTop();
    }

    //確認頁 下一步
    onConfirm_4() {
        this.doBack();
        this._logger.log("last, reqData:", this.reqData);
        let saveRelation: any = {};
        //在進入下一個階段前，先發保持登入電文
        this.auth.keepLogin();
        this._allService.saveRelationData(this.reqData).then(
            (result) => {
                this._logger.log("kyc save success", result);
                saveRelation = result;
                this._logger.log("kyc, saveRelation:", saveRelation);
                if (saveRelation['status'] == true) {
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
                this._logger.log("kyc save error", errorObj);
            }
        );
    }


    /**
     * 刪除
     * @param setype
     * @param tk
     */
    onDelete(setype, tk?: any) {
        this.doScrollTop();
        let s_index = tk;
        // if (s_index < 0) {
        //     s_index = 0;
        // }
        this._logger.log('delete: tk/s_index/tk-1/tk+1', tk, s_index, (tk - 1), (tk + 1));
        switch (setype) {
            case 'family': // 血親
                let check_data = this.checkRelativeCount(true);
                if (!check_data) {
                    return false;
                }
                if (this.relativeData.length >= 1 && !!this.relativeData[tk]) {
                    this.relativeData.splice(s_index, 1);
                }
                break;
            case 'company': // 申請人
                if (this.companyData.length >= 1 && !!this.companyData[tk]) {
                    this.companyData.splice(s_index, 1);
                }
                break;
            case 'couple': // 配偶
                if (this.coupleData.length >= 1 && !!this.coupleData[tk]) {
                    this.coupleData.splice(s_index, 1);
                }
                break;
            default:
                // nodo
                this.alert.show('請選擇要刪除的同一關係人類別');
                break;
        }
    }

    /**
     * 新增
     * @param setype
     */
    onInsert(setype: string, is_init?: boolean, required?: boolean) {
        let tmp_data: any;
        let is_max = false;
        switch (setype) {
            case 'family': // 授信申請人配偶、二親等以內之血親
                if (this.relativeData.length >= this.maxAllowCount['relative']) {
                    is_max = true;
                } else {
                    tmp_data = this._mainService.addFimary(setype, required);
                    if (!!tmp_data) {
                        this.relativeData.push(tmp_data);
                    }
                }
                break;
            case 'company': // 授信申請人擔任負責人之企業
                if (this.companyData.length >= this.maxAllowCount['company']) {
                    is_max = true;
                } else {
                    tmp_data = this._mainService.addFimary(setype);
                    if (!!tmp_data) {
                        this.companyData.push(tmp_data);
                    }
                }
                break;
            case 'couple': // 填寫配偶負責人企業資料
                if (this.coupleData.length >= this.maxAllowCount['couple']) {
                    is_max = true;
                } else {
                    tmp_data = this._mainService.addFimary(setype);
                    if (!!tmp_data) {
                        this.coupleData.push(tmp_data);
                    }
                }
                break;
            default:
                this.alert.show('請選擇要新增的同一關係人類別');
                break;
        }
        if (is_max && !is_init) {
            this.alert.show('您已超過輸入限制，無法再增加');
        }

    }

    //返回處理
    doBack() {
        this._headerCtrl.setLeftBtnClick(() => {
            switch (this.nowPage) {
                case 'familyPage':
                    this.onBackPageData({}, 'back');
                    break;
                case 'compPage':
                    this.nowPage = 'familyPage';
                    break;
                case 'spousePage':
                    this.nowPage = 'compPage';
                    break;
                case 'confirmPage':
                    this.nowPage = 'spousePage';
                    break;
                default:
                    this._logger.log("no page");
                    break;
            }
        });
    }


    /**
     * 子層返回事件(分頁)
     * @param e
     * 
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
     * @param type 
     */
    onBackPageData(item?: any, type?) {
        // 返回最新消息選單
        let output = {
            'page': 'relation-form',
            'type': 'go',
            'data': this.allData
        };
        if (type == 'back') {
            output.type = 'back';
        }
        this._logger.log("relation onBackPageData, output:", output);
        this.backPageEmit.emit(output);
    }

    /**
     * 失敗回傳(分頁)
     * @param error_obj 失敗物件
     * 
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


    /**
     * 檢核刪除
     * @param isDel
     */
    private checkRelativeCount(isDel?: boolean) {
        let output = true;
        let item = this.relativeData.length;
        let show_itme = this.Required.toString();
        let show_msg = '您的「配偶、二親等以內之血親」欄位必填數量為' + show_itme + '人';
        if (item < this.Required) {
            output = false;
            // 訊息待改，先用這個測試 2019/11/05
            this.alert.show(show_msg + '，請點擊增加', {
                title: '提醒您',
                btnTitle: '我知道了',
            });
        } else if (!!isDel && item == this.Required) {
            output = false;
            // 訊息待改，先用這個測試 2019/11/05
            this.alert.show(show_msg + '，無法刪除', {
                title: '提醒您',
                btnTitle: '我知道了',
            });
        }
        return output;
    }

    private doScrollTop() {
        this._uiContentService.scrollTop();
    }

    //output返回時，將資料帶入
    setOutputData(stage) {
        let relationData = this._allService.getRelationData();
        this._logger.log("relation output, relationData:", JSON.parse(JSON.stringify(relationData)));
        this.relativeData = relationData.family;
        this.companyData = relationData.company;
        this.coupleData = relationData.consumer;
        this.onConfirm();
        this.onConfirm_2();
        this.onConfirm_3();
        if (stage == true) {
            this.nowPage = 'familyPage';
        } else {
            this.nowPage = 'confirmPage';
        }
    }

}
