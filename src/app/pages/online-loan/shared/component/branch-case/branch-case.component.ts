/**
 * 線上申貸-分行原案件(共用)
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FormateService } from '@shared/formate/formate.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { BranchCaseService } from './branch-case.service';

@Component({
    selector: 'app-branch-case',
    templateUrl: './branch-case.component.html',
    styleUrls: [],
    providers: [BranchCaseService]
})

export class BranchCaseComponent implements OnInit {
    @Input() type: string;
    @Input() page: string | number = 1;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    //下一流程需要
    reqData = {
        custId:"",
        incirid:""
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

    constructor(
        private _logger: Logger
        , private _handleError: HandleErrorService
        , private _mainService: BranchCaseService
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

        this._headerCtrl.setLeftBtnClick(() => {
            this.onBackPageData({},'back');
        });

        //查詢分行資料
        if (typeof this.page === 'undefined') {
            this.page = 1;
        } else {
            this.page = parseInt(this.page.toString(), 10);
        }
        this._mainService.getBranchCode(this.reqData,this.page).then(
            (result) => {
                this._logger.log("result:", result);
                this.branchInfo = result.info_data;


                //處理科目中文，及處理null or undefield
                result.data.forEach(item => {
                    item['increaseAmount'] = this._formateService.checkField(item,'increaseAmount'); 
                    item['outBrch1'] = this._formateService.checkField(item,'outBrch1');
                    item['outBrch2'] = this._formateService.checkField(item,'outBrch2');
                    item['outBrchName2'] = this._formateService.checkField(item,'outBrchName2');
                    item['outBrchname1'] = this._formateService.checkField(item,'outBrchname1');
                    item['outGnamt'] = this._formateService.checkField(item,'outGnamt');
                    item['outLaral'] = this._formateService.checkField(item,'outLaral');
                    item['outLaran'] = this._formateService.checkField(item,'outLaran');
                    item['outLargn'] = this._formateService.checkField(item,'outLargn');
                    item['outLarpm'] = this._formateService.checkField(item,'outLarpm');
                    item['outRate'] = this._formateService.checkField(item,'outRate');

                    //如果帳號欄位有 '-'，去掉
                    if (item['outLargn'].indexOf('-') != -1) {
                        item['outLargn'] = item['outLargn'].replace(/-/g, '');
                        let formateStr = this.formateAccountcd(item['outLargn']);
                        this._logger.log("formateStr:", formateStr);
                        //指定撥入帳號科目中文
                        item['accountcd'] = formateStr['data'];
                        this._logger.log("into indexOf:!-1,  item['accountcd']:", item['accountcd']);
                    } else {
                        let formateStr = this.formateAccountcd(item['outLargn']);
                        this._logger.log("formateStr:", formateStr);
                        //指定撥入帳號科目中文
                        item['accountcd'] = formateStr['data'];
                        this._logger.log("into indexOf:-1,  item['accountcd']:", item['accountcd']);
                    }
                });


                this.branchData = this._mainService.getIncreaseAmount(result.data); //算可增貸金額
                this._logger.log("branchInfo:", this.branchInfo);
                this._logger.log("branchData:", this.branchData);
                this.onBackPageData(result);
            },
            (errorObj) => {
                this._logger.log("errorObj:", errorObj);
                this._handleError.handleError(errorObj);
            }
        );
    }
    //案件增貸
    onApply(item) {
        this._logger.log("click into onApply, item:",item);
        this.onBackPageData(item,"goBranch");
    }

    //指定撥入帳號科目中文
    formateAccountcd(setData) {
        let output: any = {
            status: false,
            data: '',
            msg: 'failed'
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
        this._logger.log('formateAccountcd, setData:',setData);
        let str = setData.substring(4, 7);
        switch (str) {
            case '227':
                this._logger.log('227');
                output.data = accountcd_MAP[0];
                break;
            case '699':
                this._logger.log('699');
                output.data = accountcd_MAP[1];
                break;
            case '717':
                this._logger.log('717');
                output.data = accountcd_MAP[2];
                break;
            case '765':
                this._logger.log('765');
                output.data = accountcd_MAP[3];
                break;
            case '766':
                this._logger.log('766');
                output.data = accountcd_MAP[4];
                break;
            case '871':
                this._logger.log('871');
                output.data = accountcd_MAP[5];
                break;
            case '872':
                this._logger.log('872');
                output.data = accountcd_MAP[6];
                break;
            case '899':
                this._logger.log('899');
                output.data = accountcd_MAP[7];
                break;
            default:
                output.data = '--';
        }
        output.status = true;
        output.msg = 'success';
        return output;
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
    onBackPageData(item?,setype?) {
        this._logger.log("into case back to main");
        const output = {
            'page': 'list-item',
            'type': 'page_info',
            'data': item
        };
        this._logger.log("item:",item);
        //點擊案件增貸按鈕(返回父)
        if(setype=='goBranch') {
            this._logger.log("into go branch back");
            output.page = 'branch-case';
            output.type = 'go-branch';
        }
        //點擊返回(回到同意選單)
        if(setype == 'back') {
            this._logger.log("into back branch back");
            output.page = 'branch-case';
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