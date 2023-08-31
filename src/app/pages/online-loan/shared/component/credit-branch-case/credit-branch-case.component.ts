/**
 * 線上申貸-信貸分行選單(共用)
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FormateService } from '@shared/formate/formate.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { CreditBranchCaseService } from './credit-branch-case.service';

@Component({
    selector: 'app-credit-branch-case',
    templateUrl: './credit-branch-case.component.html',
    styleUrls: [],
    providers: [CreditBranchCaseService]
})

export class CreditBranchCaseComponent implements OnInit {
    @Input() type: string;
    @Input() page: string | number = 1;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    //下一流程需要
    reqData = {
        custId: "",
        incirid: ""
    };
    // backFlag: boolean; //上一步 or 取消
    branchInfo: any = {}; //分行資訊
    branchData: any = []; //分行明細
    //綁ngModel(欄位名稱皆須修改)
    // viewInfo = {
    //     case: '', //原申請案件
    //     branchName: '', //貸款分行
    //     account: '', //放款帳號
    // };
    // caseData: any = []; //原案件明細
    // accountData: any = []; //帳號明細

    creditFlag = true; //控制台幣帳戶是否查到資料顯示

    constructor(
        private _logger: Logger
        , private _handleError: HandleErrorService
        , private _mainService: CreditBranchCaseService
        , private _headerCtrl: HeaderCtrlService
        , private _formateService: FormateService
        , private navgator: NavgatorService
        , private alert: AlertService
    ) { }

    ngOnInit() {
        //信貸:上一步， 房貸:取消
        // if (this.type == 'credit') {
        //     this.backFlag = true;
        //     this.reqData['txKind'] = 'B';
        // } else {
        //     this.backFlag = false;
        //     this.reqData['txKind'] = 'A';
        // }

        //查詢分行資料
        // if (typeof this.page === 'undefined') {
        //     this.page = 1;
        // } else {
        //     this.page = parseInt(this.page.toString(), 10);
        // }

        //2019/01/02 比照網銀發送過濾帳號api，並且無分頁機制
        let reqData_505 = {
            custId: ''
        };
        this._mainService.getBranchCode(reqData_505).then(
            (result) => {
                this._logger.log("result:", result);
                this.branchInfo = result.info_data;
                //如果查無資料
                if (result.data == null || typeof result.data == 'undefined' || result.data.length == 0) {
                    this.creditFlag = false;
                    this.alert.show('查無帳號資訊，造成您的不便，敬請見諒。', {
                        title: '提醒您',
                        btnTitle: '我知道了',
                    }).then(
                        () => {
                        }
                    );
                } else {
                    this.creditFlag = true;
                    //處理科目中文，及處理null or undefield
                    result.data.forEach(item => {
                        item['acctNo'] = this._formateService.checkField(item, 'acctNo');
                        item['openBranchId'] = this._formateService.checkField(item, 'openBranchId');
                        item['openBranchName'] = this._formateService.checkField(item, 'openBranchName');
                        item['acctType'] = this._formateService.checkField(item, 'acctType');
                        item['acctTypeName'] = this._formateService.checkField(item, 'acctTypeName');
                        if (item['balance'] == '' || typeof item['balance'] == 'undefined' || item['balance'] == null) {
                            item['balance'] = '--'; //*這段需確認，沒資料 
                        }
                        item['lastTrnsDate'] = this._formateService.checkField(item, 'lastTrnsDate');
                        //如果帳號欄位有 '-'，去掉
                        if (item['acctNo'].indexOf('-') != -1) {
                            item['acctNo'] = item['acctNo'].replace(/-/g, '');
                            let formateStr = this.formateAccountcd(item['acctNo']);
                            this._logger.log("formateStr:", formateStr);
                            //指定撥入帳號科目中文
                            item['accountcd'] = formateStr['data'];
                            this._logger.log("into indexOf:!-1,  item['accountcd']:", item['accountcd']);
                        } else {
                            let formateStr = this.formateAccountcd(item['acctNo']);
                            this._logger.log("formateStr:", formateStr);
                            //指定撥入帳號科目中文
                            item['accountcd'] = formateStr['data'];
                            this._logger.log("into indexOf:-1,  item['accountcd']:", item['accountcd']);
                        }
                    });
                }
                this.branchData = result.data;
                this._logger.log("branchInfo:", this.branchInfo);
                this._logger.log("branchData:", this.branchData);
                this.onBackPageData(result, 'page_info');
            },
            (errorObj) => {
                this._logger.log("errorObj:", errorObj);
                this._handleError.handleError(errorObj);
            }
        );
    }

    //指定撥入帳號科目中文
    formateAccountcd(setData) {
        let output: any = {
            status: false,
            data: '', //str
            msg: 'failed',
            fittler: false //是否為過濾後帳號(符合 227、699、717、765、766、871、872、899)，符合為true
        };
        let accountcd_MAP: any = [
            '行員活期儲蓄存款', //227
            '活期儲蓄存款', //699
            '活期存款', //717
            '活期儲蓄存款', //765
            '活期儲蓄存款', //766
            '綜合活期存款', //871
            '綜合活期儲蓄存款', //872
            '財富管理帳戶綜合活儲' //899
        ];
        this._logger.log('formateAccountcd, setData:', setData);
        let str = setData.substring(4, 7);
        switch (str) {
            case '227':
                this._logger.log('227');
                output.data = accountcd_MAP[0];
                output.fittler = true;
                break;
            case '699':
                this._logger.log('699');
                output.data = accountcd_MAP[1];
                output.fittler = true;
                break;
            case '717':
                this._logger.log('717');
                output.data = accountcd_MAP[2];
                output.fittler = true;
                break;
            case '765':
                this._logger.log('765');
                output.data = accountcd_MAP[3];
                output.fittler = true;
                break;
            case '766':
                this._logger.log('766');
                output.data = accountcd_MAP[4];
                output.fittler = true;
                break;
            case '871':
                this._logger.log('871');
                output.data = accountcd_MAP[5];
                output.fittler = true;
                break;
            case '872':
                this._logger.log('872');
                output.data = accountcd_MAP[6];
                output.fittler = true;
                break;
            case '899':
                this._logger.log('899');
                output.data = accountcd_MAP[7];
                output.fittler = true;
                break;
            default:
                output.data = '--';
        }
        output.status = true;
        output.msg = 'success';
        return output;
    }

    //選擇分行
    onSelect(item) {
        this._logger.log("click into onApply, item:", item);
        this.onBackPageData(item, "goBranch");
    }

    // onBack() {

    // }
    // onNext() {
    //     this.nowPage = 'commission';
    // }
    // onBack2() {
    //     this.nowPage = 'numberPage';
    // }
    // //房貸:取消返回選單
    // onCancel() {
    //     this.navgator.push('online-loan');
    // }
    // onNext2() {
    //     this.nowPage = 'confirmPage';
    // }
    // onBack3() {
    //     this.nowPage = 'commission';
    // }
    // onNext3() {
    //     this.alert.show('資料已儲存完畢，即將進入下一步驟。', {
    //         title: '提醒您',
    //         btnTitle: '了解',
    //     }).then(
    //         () => {
    //             this.onBackPageData(this.reqData);
    //         }
    //     );
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
    }

    /**
     * 重新設定page data
     * @param item
     */
    onBackPageData(item?, setype?, page?) {
        this._logger.log("into case back to main");
        const output = {
            'page': 'list-item',
            'type': 'page_info',
            'data': item
        };
        this._logger.log("item:", item);
        //點擊選擇分行(返回父)
        if (setype == 'goBranch') {
            this._logger.log("into go branch back");
            output.page = 'branch-case';
            output.type = 'go-branch';
        }
        //點擊返回(回到同意選單)
        if (setype == 'back') {
            this._logger.log("into back branch back");
            output.page = 'branch-case';
            output.type = 'back';
        }
        if (setype == 'back' && page == 'contact-branch') {
            output.page = 'contact-branch';
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
}