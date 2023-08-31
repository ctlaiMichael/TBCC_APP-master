/**
 * 繳費方式(信用卡繳費)
 * 
 * 
 */
import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { CreditcardCheckService } from '@pages/hospital/shared/service/creditcard-check.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CheckService } from '@shared/check/check.service';
import { CardCheckUtil } from '@shared/util/check/data/card-check-util';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { Logger } from '@core/system/logger/logger.service';
import { SocialsharingPluginService } from '@lib/plugins/socialsharing/socialsharing-plugin.service';
import { AmountUtil } from '@shared/util/formate/number/amount-util';
import { CaptchaComponent } from '@shared/captcha/captcha.component';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { CreditcardInfo } from '@conf/terms/hospital/creditcard-info';

@Component({
    selector: 'app-creditcard-pay',
    templateUrl: 'creditcard-pay-page.component.html',
    styleUrls: [],
    providers: [CreditcardCheckService, CheckService, SocialsharingPluginService]
})

export class CreditCardPayPageComponent implements OnInit {
    /**
     * 參數處理
     */
    @ViewChild(CaptchaComponent) _captcha: CaptchaComponent;
    @Input() inputData: any = {};
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    // form data
    //送FH000208電文
    reqData = {
        custId: '',
        hospitalId: '',
        branchId: '',
        personId: '',
        creditCardNo: '',
        validDate: '',
        checkCode: '',
        totalCount: '',
        totalAmount: '',
        queryTime: '',
        trnsToken: '',
        details: {
            detail: [

            ]
        }
    };

    inp_data = {
        cardNo: '',
        date: '',
        code: ''
    };
    // error data (不為空顯示紅框)
    error_data = {
        cardNo: '',
        date: '',
        code: ''
    };
    resultContent = {
        title: '',
        content: '',
        classType: '',
        channelType: ''
    };


    //flag:
    submitFlag = false; // 擋重覆交易
    editShow = true; //顯示編輯頁
    provisionShow = false; // 顯示條款頁
    confirmShow = false; //顯示確認頁
    resultShow = false; //顯示結果頁
    successResultShow = true; //trnsRsltCode : 0(成功)
    failedResultShow = false; //trnsRsltCode : 1(失敗)
    abnormalResultShow = false; //trnsRsltCode : X(異常)
    processResultShow = false; //trnsRsltCode: 2(已扣款交易異常請至櫃台處理)

    creditCard = {}; //存信用卡卡號(驗證過)
    dateCheck = {}; //存信用卡有效年月(驗證過) 
    codeCheck = {}; //信用卡檢核碼(驗證過)

    // creditCardShow = false; //錯誤顯示紅框
    // dateShow = false; //錯誤顯示紅框
    // codeShow = false; //錯誤顯示紅框
    // creditCardError = ""; //信用卡號錯誤訊息顯示
    // dateError = ""; //有效月年錯誤訊息顯示
    // codeError = ""; //驗證碼錯誤訊息顯示
    channel = ""; //分辨: 醫療:1、產壽:2
    validDate: string = ""; //208電文request需要的有效年月(轉換完成) EX:11/18(mmyy) => 2018/11

    resultInfo = {}; //存放202電文回傳資料{}
    resultData = []; //存放202電文回傳資料[]

    //------ 確認頁顯示 ------
    sumAmount = ""; //金額總計: 總金額+手續費
    creditCardHidden = ""; //信用卡卡號(隱碼)
    // personIdHidden = ""; //身分證(隱碼)
    // personIdHidden2 = ""; //身分證(隱碼) 208電文回傳結果加工
    valid_date = '';
    //圖形驗證
    checkCaptchaFlag: any;

    agreeProvision: any; // 條款


    constructor(
        private _mainService: CreditcardCheckService
        , private _logger: Logger
        , private route: ActivatedRoute
        , private _checkService: CheckService
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private navgator: NavgatorService
        , private confirm: ConfirmService
        , private socialShare: SocialsharingPluginService
        , private _uiContentService: UiContentService
    ) { }

    ngOnInit() {
        this._initEvent();
        // this._logger.log("inputData66666666666:", this.inputData);
        this.route.queryParams.subscribe(params => {
            if (params.hasOwnProperty("type") && !(params['type'] == '')) {
                this.channel = params['type'];
            }
        });
        //金額總計
        let totalAmount = parseInt(this.inputData['totalAmount']);
        if (this.channel == "1") {
            this.resultContent.channelType = '醫療服務';
            //醫療=> 金額總計: 總金額+手續費(10元)
            this.sumAmount = (totalAmount + 10).toString();
        } else {
            this.resultContent.channelType = '產壽險服務';
            //產壽=> 金額總計: 總金額+手續費(0元)
            this.sumAmount = (totalAmount).toString();
        }

        //塞request
        this.reqData['custId'] = this.inputData['custId'];
        this.reqData['hospitalId'] = this.inputData['hospitalId'];
        this.reqData['branchId'] = this.inputData['branchId'];
        this.reqData['personId'] = this.inputData['personId'];
        this.reqData['totalCount'] = this.inputData['totalCount'];
        this.reqData['totalAmount'] = this.inputData['totalAmount'];
        this.reqData['queryTime'] = this.inputData['queryTime'];
        if (this.inputData.hasOwnProperty('details') && typeof this.inputData['details'] === 'object'
            && this.inputData['details'].hasOwnProperty('detail')) {
            this.reqData['details'] = this.inputData['details'];
        }
        this._logger.log("line 144 reqData:", this.reqData);

        this.agreeProvision = new CreditcardInfo();
    }

    //----------------編輯頁-----------------
    //點擊確定
    public onCreditcard() {
        this._logger.log(this.inp_data);
        let check_data = this._mainService.checkCardNum(this.inp_data, this.error_data);
        this._logger.log("check_data:", check_data);
        if (!check_data.status) {
            this.error_data = check_data.error;
            this._logger.log("error_data:", this.error_data);
            this._logger.log("check_data:", check_data);
            return false;
        } else {
            this._logger.log("inputData['validDate']:", this.inputData['validDate']);
            this.reqData['creditCardNo'] = this.inp_data['cardNo'];
            this.reqData['checkCode'] = this.inp_data['code'];
            let month = this.inp_data['date'].substring(0, 2);
            let year = this.inp_data['date'].substring(2, 4);

            let today = new Date();
            let currentYear = today.getFullYear();
            //過一世紀
            if (currentYear > 2099) {
                if (parseInt(month) < 10) {
                    if (month.length == 1) {
                        this.reqData['validDate'] = '21' + year + '0' + month; //ex: 輸入9 => 09
                    } else {
                        this.reqData['validDate'] = '21' + year + month; //ex: 輸入09 保持
                    }
                } else {
                    this.reqData['validDate'] = '21' + year + month;
                }
                //20世紀
            } else {
                if (parseInt(month) < 10) {
                    if (month.length == 1) {
                        this.reqData['validDate'] = '20' + year + '0' + month; //ex: 輸入9 => 09
                    } else {
                        this.reqData['validDate'] = '20' + year + month; //ex: 輸入09 保持
                    }
                } else {
                    this.reqData['validDate'] = '20' + year + month;
                }
            }
            this._logger.log("reqData:", this.reqData);


            this.valid_date = this.reqData['validDate'].substring(0, 4) + '/' + this.reqData['validDate'].substring(4, 6);

            this.provisionShow = true;
            this.editShow = false;
            this.confirmShow = false;
            this._uiContentService.scrollTop();
        }

    }

    onProvision(agree) {
        if (!!agree.data) {
            this.editShow = false;
            this.confirmShow = true;
            this.provisionShow = false;
            this._uiContentService.scrollTop();
        } else {
            this.editShow = true;
            this.confirmShow = false;
            this.provisionShow = false;
            this._uiContentService.scrollTop();
        }
    }

    onCancel(type: string) {
        if (type === 'check') {
            this.editShow = true;
            this.confirmShow = false;
        } else {
            this.onErrorBackEvent({}, 'back');
        }
    }

    //----------------確認頁-----------------
    //確認頁點擊確認(這裡必須得到208電文需要的request欄位)
    //先發203電文取得交易控制碼，再發208電文取得結果頁欄位
    public onConfirm() {

        //圖形驗證
        this.checkCaptchaFlag = this._captcha.checkCaptchaVal(); //紀錄驗證是否成功
        this._logger.log("reqData:", this.reqData);
        if (this.checkCaptchaFlag == true && this.submitFlag == false) {
            this._logger.log("checkCaptchaFlag:",this.checkCaptchaFlag == true);
            this._headerCtrl.setLeftBtnClick(() => {
                this.endResult();
            });
            this.submitFlag = true;
            this._mainService.sendData(this.reqData).then(
                (result) => {
                    let trnsRsltCode = result.transRes.trnsRsltCode;
                    let result_type = result.error_type;
                    this.resultInfo = result.info_data;
                    this.resultData = result.data;
                    if (result_type == 'success') {
                        this.successResultShow = true;
                        this.failedResultShow = false;
                    } else if (result_type == 'warning') {
                        this.successResultShow = false;
                        this.failedResultShow = true;
                    } else if (result_type == 'error') {
                        this.successResultShow = false;
                        this.failedResultShow = true;
                    }

                    this.resultContent.title = result.transRes.title;
                    this.resultContent.content = result.transRes.msg;
                    let class_list = {
                        'success': '',
                        'error': 'fault_active',
                        'warning': 'exclamation_active'
                    };
                    if (class_list.hasOwnProperty(result_type)) {
                        this.resultContent.classType = class_list[result_type];
                    } else {
                        this.resultContent.classType = class_list['success'];
                    }


                    // 結果頁
                    this._headerCtrl.updateOption({
                        'style': 'result',
                        'leftBtnIcon': 'back',
                        'title': '交易結果'
                    });

                    this.submitFlag = false;
                    this.editShow = false;
                    this.confirmShow = false;
                    this.resultShow = true;
                    this._uiContentService.scrollTop();

                    // this._logger.log("resultInfo66666666666:", this.resultInfo);
                    // if (!(this.resultInfo === '') && !(this.resultData.length <= 0)) {
                    //     this._headerCtrl.updateOption({
                    //         'leftBtnIcon': 'back',
                    //         'title': '交易結果'
                    //     });
                    //     this.editShow = false;
                    //     this.confirmShow = false;
                    //     this.resultShow = true;
                    // }
                    // if (this.resultInfo.hasOwnProperty("trnsRsltCode") && this.resultInfo['trnsRsltCode'] == '0') {
                    //     this.successResultShow = true;
                    //     this.failedResultShow = false;
                    //     this.abnormalResultShow = false;
                    //     this.processResultShow = false;
                    // } else if (this.resultInfo.hasOwnProperty("trnsRsltCode") && this.resultInfo['trnsRsltCode'] == '1') {
                    //     this.successResultShow = false;
                    //     this.failedResultShow = true;
                    //     this.abnormalResultShow = false;
                    //     this.processResultShow = false;
                    // } else if (this.resultInfo.hasOwnProperty("trnsRsltCode") && this.resultInfo['trnsRsltCode'] == 'X') {
                    //     this.successResultShow = false;
                    //     this.failedResultShow = false;
                    //     this.abnormalResultShow = true;
                    //     this.processResultShow = false;
                    // } else if (this.resultInfo.hasOwnProperty("trnsRsltCode") && this.resultInfo['trnsRsltCode'] == '2') {
                    //     this.successResultShow = false;
                    //     this.failedResultShow = false;
                    //     this.abnormalResultShow = false;
                    //     this.processResultShow = true;
                    // }
                },
                (errorObj) => {
                    this._logger.log("send result error errorObj:",errorObj);
                    errorObj['type'] = 'message';
                    this._handleError.handleError(errorObj);
                }
            );
        } else {
            return false;
        }
    }


    /**
     *  交易結果分享
     */

    socialSharing() {
        let totalAmount = AmountUtil.amount(this.resultInfo['totalAmount'], 'TWD');
        // Hi, 我已經繳醫療費500元囉!
        let show_msg = [];
        if (this.channel == "1") {
            show_msg.push('Hi, 我已經繳醫療費');
        } else {
            show_msg.push('Hi, 我已經繳產壽險費');
        }
        show_msg.push(totalAmount);
        show_msg.push('元囉!');

        this.socialShare.shareMsg({
            subject: '',
            message: show_msg.join('')
        }).then(
            (success) => {
                // success
            },
            (error) => {
                // error
            }
        );

    }


    /**
 * 啟動事件
 */
    private _initEvent() {
        //設定header
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': '繳費方式'
        });
        //左側返回
        this._headerCtrl.setLeftBtnClick(() => {
            this.onErrorBackEvent({}, 'cancel-edit');
        });
    }



    /**
     * 回傳(透過它回父層)
     * @param error_obj 失敗物件
     */
    onErrorBackEvent(error_obj, type?: string) {
        if (typeof type == 'undefined') {
            type = 'error';
        }
        let output = {
            'page': 'creditcard-pay',
            'type': type,
            'data': error_obj
        };

        this.errorPageEmit.emit(output);
    }

    onResultNotice() {
        this.goEnd();
    }

    onConfirmEnd() {
        this.goEnd();
    }

    private goEnd() {
        this.route.queryParams.subscribe(params => {
            if (params.hasOwnProperty('type')) {
                if (params.type == '1') {
                    this.navgator.push('hospital');
                } else if (params.type == '2') {
                    this.navgator.push('insurance');
                }
            }
        });
    }

    /**
     * 結果返回
     */
    endResult() {
        // let path = 'hospital-branch';
        // if (this.channel != '1') {
        //     path = 'insurance-branch';
        // }
        // let params = {
        //     hospitalId: this.inputData['hospitalId'],
        //     branchId: this.inputData['branchId']
        //     // , branchName: ''
        // };
        let path = 'hospital';
        if (this.channel != '1') {
            path = 'insurance';
        }
        this.navgator.push(path);
    }
}
