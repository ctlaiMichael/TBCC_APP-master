/**
 * 線上申貸-房屋貸款-主頁
 * 
 * 流程：同意選單=>KYC=>申請書=>同一關係人=>分行=>文件上傳=>結果
 */
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewContainerRef } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FormateService } from '@shared/formate/formate.service';
import { PaginatorCtrlService } from '@shared/paginator/paginator-ctrl.srevice';
import { BranchCaseComponent } from '@pages/online-loan/shared/component/branch-case/branch-case.component';
import { MortgageIncreaseService } from '@pages/online-loan/shared/service/mortgage-increase.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';

@Component({
    selector: 'app-house-loan-main',
    templateUrl: './house-loan-main.component.html',
    styleUrls: [],
    providers: [PaginatorCtrlService]
})

export class HouseLoanMainComponent implements OnInit {
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    nowPage = "";
    fullData = {}; //下一頁需要的資料
    agreeStep = '';
    dataTime: string; // 資料日期
    pageCounter = 1; // 當前頁次
    totalPages = 0; // 全部頁面
    @ViewChild('pageBox', { read: ViewContainerRef }) pageBox: ViewContainerRef;
    personalData: any = {}; //個人基本資料
    action = ''; //傳回子層狀態，'go'：進入下一階段，'back':返回前一階段


    constructor(
        private _logger: Logger
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private _formateService: FormateService
        , private navgator: NavgatorService
        , private paginatorCtrl: PaginatorCtrlService
        , private _allService: MortgageIncreaseService
        , private _uiContentService: UiContentService
    ) { }

    ngOnInit() {
        this._logger.log("into house-main page");
        //重置全部暫存資料
        this.restAllData();

        this.onChangePage(''); //走預設(簡介)

        //不登入功能，不取基本資料，使用者自己輸入資料，因此不發401

        //發送f9000401 取得基本資料
        // this._allService.sendPersonalData().then(
        //     (result) => {
        //         this._logger.log("get personalData,result:", result);
        //         this.personalData = result;
        //         //暫存個人基本資料
        //         this._allService.setPersonalData(this.personalData.info_data);
        //     },
        //     (errorObj) => {
        //         this._logger.log("errorObj:", errorObj);
        //     }
        // );
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
            //前往下一頁
            if (pageType == 'go') {
                switch (page) {
                    case 'agree': //同意選單(回傳) Go
                        this._logger.log("into term go main");
                        this.fullData = tmp_data;
                        this.action = 'go';
                        this.onChangePage('kyc-fill'); //前往kyc
                        break;
                    case 'kyc': //KYC(回傳) Go
                        this._logger.log("into kyc go main");
                        this.fullData = tmp_data;
                        this.action = 'go';
                        this.onChangePage('consumer-apply'); //前往申請書
                        break;
                    case 'consumer-apply': //申請書(回傳) Go
                        this._logger.log("into consumer-apply go main");
                        this.fullData = tmp_data;
                        this.action = 'go';
                        this.onChangePage('relation-form'); //前往同一關係人
                        break;
                    case 'relation-form': //同一關係人(回傳) Go
                        this._logger.log("into relation-form go main");
                        this.fullData = tmp_data;
                        this.action = 'go';
                        this.onChangePage('contact-branch'); //前往分行
                        break;
                    case 'contact-branch': //選擇分行(回傳) Go
                        this._logger.log("into contact-branch go main");
                        this.fullData = tmp_data;
                        this.action = 'go';
                        this._logger.log("main page fullData:", this.fullData);
                        this.onChangePage('result-page'); //前往結果頁
                        break;
                    // case 'file-upload': //證明文件上傳(回傳) Go
                    //     this._logger.log("into file-upload go main");
                    //     this.fullData = tmp_data;
                    //     this.action = 'go';
                    //     this.onChangePage('result-page'); //前往結果頁
                    //     break;
                }
                //返回前一頁
            } else if (pageType == 'back') {
                switch (page) {
                    case 'branch-case': //原案件(回傳) Back
                        this._logger.log("into branch-case back main");
                        this.fullData = tmp_data;
                        this.action = 'back';
                        this.agreeStep = 'first';
                        this.onChangePage("agree-term"); //返回簡介
                        break;
                    case 'contact-branch': //分行(回傳) Back
                        this._logger.log("into branch back main");
                        this.fullData = tmp_data;
                        this.action = 'back';
                        this.onChangePage("relation-form"); //返回同一關係人
                        break;
                    case 'agree': //同意選單(回傳) Back
                        this._logger.log("into term back main");
                        this.fullData = tmp_data;
                        this.action = 'back';
                        this.onChangePage('branch-case'); //返回原案件
                        break;
                    case 'kyc': //kyc(回傳) Back
                        this._logger.log("into kyc back main");
                        this.fullData = tmp_data;
                        this.action = 'back';
                        this.agreeStep = 'first'; //顯示簡介(預填單不顯示條款)
                        this.onChangePage('agree-term');  //返回同意選單
                        break;
                    case 'consumer-apply': //申請書(回傳) Back
                        this._logger.log("into consumer-apply back main");
                        this.fullData = tmp_data;
                        this.action = 'back';
                        this.onChangePage('kyc-fill'); //返回kyc表
                        break;
                    case 'relation-form': //同一關係人(回傳) Back
                        this._logger.log("into relation-form back main");
                        this.fullData = tmp_data;
                        this.action = 'back';
                        this.onChangePage('consumer-apply'); //返回申請書
                        break;
                    case 'file-upload': //文件上傳(回傳) Back
                        this._logger.log("into file-upload back main");
                        this.fullData = tmp_data;
                        this.action = 'back';
                        this.onChangePage('relation-form'); //返回同一關係人
                        break;
                }
            } else {
                switch (page) {
                    case 'agree-first': //簡介(回傳)  pageType == 'first-go'
                        this._logger.log("into agree-first back main");
                        this.fullData = tmp_data;
                        this.action = 'go';
                        this.onChangePage('branch-case'); //
                        break;
                    case 'list-item': //原案件分頁回傳 pageType === 'page_info'
                        // 設定頁面資料
                        if (tmp_data.hasOwnProperty('page_info')
                            && this.pageCounter === 1
                        ) {
                            // 第一頁才要設定，其他不變
                            this.totalPages = tmp_data['page_info']['totalPages'];
                        }
                        break;
                }
            }
        }
    }

    /**
 * Scroll Event
 * @param next_page
 */
    onScrollEvent(next_page) {
        this._logger.log('pageCounter:', this.pageCounter, 'next_page:', next_page);
        this.pageCounter = next_page;
        const componentRef: any = this.paginatorCtrl.addPages(this.pageBox, BranchCaseComponent);
        componentRef.instance.page = next_page;
        componentRef.instance.backPageEmit.subscribe(event => this.onPageBackEvent(event));
        componentRef.instance.errorPageEmit.subscribe(event => this.onErrorBackEvent(event));
    }

    /**
* 頁面切換
* @param pageType 頁面切換判斷參數
* @param pageData 其他資料
*/
    onChangePage(pageType: string, pageData?: any) {
        switch (pageType) {
            case 'branch-case':
                this.nowPage = 'branch-case';
                break;
            case 'contact-branch':
                this.nowPage = 'contact-branch';
                break;
            case 'agree-term':
                this.nowPage = 'agree-term';
                break;
            case 'kyc-fill':
                this.nowPage = 'kyc-fill';
                break;
            case 'consumer-apply':
                this.nowPage = 'consumer-apply';
                break;
            case 'relation-form':
                this.nowPage = 'relation-form';
                break;
            case 'file-upload':
                this.nowPage = 'file-upload';
                break;
            case 'result-page':
                this.nowPage = 'result-page';
                break;
            default:
                this.agreeStep = 'first'; //預設簡介
                this.nowPage = 'agree-term';
                break;
        }
        this._uiContentService.scrollTop();
    }

    private _resetPage() {
        this.pageCounter = 1;
        this.totalPages = 0;
    }

    /**
      * 失敗回傳
      * @param error_obj 失敗物件
      */
    onErrorBackEvent(e) {
        this._logger.step('FUND', 'onErrorBackEvent', e);
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

        switch (page) {
            // page1 error回傳
            case 'list-item':
                // == 分頁返回 == //

                if (this.pageCounter === 1) {
                    // 列表頁：首次近來錯誤推頁
                    errorObj['type'] = 'message';
                    errorObj['button'] = 'PG_ONLINE.BTN.BACKLOAN';
                    errorObj['backType'] = 'online-loan';
                    this._handleError.handleError(errorObj);
                } else {
                    // 其他分頁錯誤顯示alert錯誤訊息
                    errorObj['type'] = 'dialog';
                    this._handleError.handleError(errorObj);
                }
                break;
            case 'content':
                // == 內容返回(先顯示列表再顯示錯誤訊息) == //
                this.onChangePage('list');
                errorObj['type'] = 'dialog';
                this._handleError.handleError(errorObj);
                break;
        }
    }

        //重置全部暫存資料
        restAllData() {
            this._allService.resetData(); //重置全部暫存資料
            this._allService.resetPersonalData(); //重置個人資料...
            this._allService.resetJobData(); //重置職業資料
            this._allService.resetSelected_job(); //重置使用者選擇之行業別相關資料，帶入申請書預設
            this._allService.resetmYear(); //重置財務收支年度，kyc儲存帶入申請書
            this._allService.resetSelectLoanUsage();
            this._allService.resetResverData();
            this._allService.resetKycAllData();
            this._allService.resetApplyAllData();
            this._allService.resetAdressData();
            this._allService.resetRelationData();
            this._allService.resetTermData();
            this._allService.resetCreditBranchData();
            this._allService.resetHouseBranchData();
            this._allService.resetCityData();
            this._allService.resetStageStaus(); //重置哪個階段階段暫存過資料
        }


    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------
}