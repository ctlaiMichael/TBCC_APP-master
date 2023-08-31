/**
 * PaymentMenu(費用主選單)
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BranchBillService } from '@pages/hospital/shared/service/branch-bill.service';
import { CheckService } from '@shared/check/check.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FormateService } from '@shared/formate/formate.service';
import { Logger } from '@core/system/logger/logger.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { logger } from '@shared/util/log-util';
import { AlertService } from '@shared/popup/alert/alert.service';

@Component({
    selector: 'app-bill-menu',
    templateUrl: './bill-menu-page.component.html',
    styleUrls: [],
    providers: [BranchBillService, CheckService]
})

export class BillMenuPageComponent implements OnInit {
    //前一頁傳來
    reqData = {
        hospitalId: '',
        branchId: '',
        type: '',
        branchName: '',
        intraBankTrns: '',
        eBillTrns: '',
        icCardTrns: '',
        creditCardTrns: '',
        creditNoticeUrl: ''
    };

    //ngModel綁定
    inp_data = {
        personId: '',
        birthday: '',
        custId: '',
        licenseNo: ''
    };

    today = new Date();
    dd = String(this.today.getDate()).padStart(2, '0');
    MM = String(this.today.getMonth() + 1).padStart(2, '0');
    yyyy = this.today.getFullYear();
    todate = this.yyyy + '/' + this.MM + '/' + this.dd;
    max_date = '';
    min_date = '';

    type_name: string = '';

    paramsError = ''; //沒拿到 hospitalId,branchId

    checkPersonId = false; //是否加入錯誤訊息和紅框
    checkBirthday = false; //是否加入錯誤訊息和紅框
    checkLicense = false; //是否加入錯誤訊息和紅框
    showHospital = true; //顯示醫療
    showInsurance = true; //顯示產壽

    savePersonId = {}; //傳給billData
    saveDate = {};
    saveEditor = {}; //傳給billData
    saveLicenseNo = {}; //傳給billData
    personId_errorMsg = ''; //身分證錯誤訊息(view使用)
    birthday_errorMsg = ''; //日期錯誤訊息(view使用)
    license_errorMsg = ''; //車牌錯誤訊息(view使用)

    //將資料送出
    billData = {
        custId: '', //身分證字號
        hospitalId: '',
        branchId: '',
        personId: '', //身分證字號，若有登入，則帶入登入者身分證號
        birthday: '', //出生年月日，若為產險，填入空白
        licenseNo: '', //車牌號碼，若為醫療，填入空白
        channel: '', //1: 醫療 , 2: 產壽險
        intraBankTrns: '',
        eBillTrns: '',
        icCardTrns: '',
        creditCardTrns: '',
        creditNoticeUrl: ''
    };
    disableATMObj = {
        disableATM: false,
        branchName: ''
    };  //是否安裝MATM
    WwuShow = false;
    goNextPage = false; //顯示子層
    info_data = {
        note3: ''
    };
    constructor(
        private route: ActivatedRoute
        , private _logger: Logger
        , private _mainService: BranchBillService
        , private _checkService: CheckService
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private navgator: NavgatorService
        , private _formateService: FormateService
        , private confirm: ConfirmService
        , private alert: AlertService,
    ) {
    }

    ngOnInit() {
        this.inp_data['date'] = this._formateService.transDate(this.todate, 'yyyy-MM-dd');
        const oldAge = (this.yyyy - 120) + '/' + this.MM + '/' + this.dd;
        this.min_date = oldAge;
        this.max_date = this.todate;
        this.checkHospitalName();
        this._initEvent();
    }


    //判斷設定標題，並設定傳入父層的值
    checkHospitalName() {
        this.route.queryParams.subscribe(params => {
            //setData
            if (params.hasOwnProperty("hospitalId") && params.hasOwnProperty("branchId")) {
                logger.error("params:", params);
                this.reqData.hospitalId = params.hospitalId;
                this.reqData.branchId = params.branchId;
                this.reqData.type = params.type;
                this.reqData.branchName = params.branchName;
                this.reqData.intraBankTrns = params.intraBankTrns;
                this.reqData.eBillTrns = params.eBillTrns;
                this.reqData.icCardTrns = params.icCardTrns;
                this.reqData.creditCardTrns = params.creditCardTrns;
                this.reqData.creditNoticeUrl = params.creditNoticeUrl;
                this.type_name = params.type == '2' ? 'insurance' : 'hospital';
                logger.error("infoReqData:", this.reqData);
                this.billData.hospitalId = this.reqData.hospitalId;
                this.billData.branchId = this.reqData.branchId;
                this.billData.channel = this.reqData.type;
                this.billData.intraBankTrns = this.reqData.intraBankTrns;
                this.billData.eBillTrns = this.reqData.eBillTrns;
                this.billData.icCardTrns = this.reqData.icCardTrns;
                this.billData.creditCardTrns = this.reqData.creditCardTrns;
                this.billData.creditNoticeUrl = this.reqData.creditNoticeUrl;
                if (params.hasOwnProperty("disableATM")) {
                    this.disableATMObj.disableATM = params.disableATM;
                    this.disableATMObj.branchName = params.branchName;
                }
                logger.error("billData.channel:", this.billData.channel);
                if (this.billData.channel == "1") {
                    this.showHospital = true;
                    this.showInsurance = false;
                    this.WwuShow = false;
                    this._headerCtrl.updateOption({
                        'leftBtnIcon': 'back',
                        'title': params.titleName
                    });
                } else {
                    this.showHospital = false;
                    this.showInsurance = true;
                    this.WwuShow = false;
                    this._headerCtrl.updateOption({
                        'leftBtnIcon': 'back',
                        'title': params.titleName
                    });
                    if (this.reqData.hospitalId == 'WWU') {
                        this.WwuShow = true;
                        this.showInsurance = false;
                        this.showHospital = false;
                    }
                }
                this.info_data.note3 = params.note3;
                logger.error("billData:", this.billData);

            } else {
                this.paramsError = "get params error!";
                this.showHospital = false;
                this.showInsurance = false;
            }
        });
    }


    //按下確定(醫療)
    public actionHospital() {
        logger.error("inp_data:", this.inp_data);
        this._logger.log("into hospital check");
        //身分證檢核
        // this.savePersonId = this._checkService.checkIdentity(this.inp_data.personId);
        // if (this.savePersonId['status'] == false) {
        //     this.checkPersonId = true;
        //     this.personId_errorMsg = this.savePersonId['msg'];
        //     this.billData.personId = '';
        // } else {
        //     this.checkPersonId = false;
        //     this.billData.personId = this.savePersonId['data'];
        // }

        // logger.error("billData:", this.billData);

        // this.billData.personId = personId; //先不檢核

        //年月日檢核
        this.saveDate = this._checkService.checkDate(this.inp_data.birthday);
        if (this.saveDate['status'] == false) {
            this.checkBirthday = true;
            this.birthday_errorMsg = this.saveDate['msg'];
            this.billData.birthday = '';
        } else {
            this.checkBirthday = false;
            this.billData.birthday = this.saveDate['formate'];
        }

        logger.error("billData:", this.billData);

        // this.billData.birthday = birthday; //先不檢核

        //檢核成功顯示子層
        // if (this.billData.personId && this.billData.birthday) {
        if (this.billData.birthday) {
            this.goNextPage = true;
            this.billData.personId = this.inp_data.personId;
        } else {
            return false;
        }


        //
        this.goNextPage = true;
    }

    //--------------------------------------------------------------
    //按下確定(產壽) 
    public actionInsurance() {
        //旺旺特規，可輸入公司統編，要特別去判斷
        let wwuCustId = this.inp_data.custId.substring(0, 1); //取第一個字
        let wwuStayId = this.inp_data.custId.substring(1, 2); //取第二個字(居留證使用)
        let identity = this.inp_data.custId.substring(3, 11); //第二個字以後之流水號
        const firstNO = /^[a-zA-Z]{1}$/;
        const secondNO = /^[a-zA-Z]{1}[a-dA-D]{1}[0-9]{8}$/;
        this._logger.log("wwuCustId:", wwuCustId);
        this._logger.log("wwuStayId:", wwuStayId);
        this._logger.log("identity:", identity);
        if (this.WwuShow == true) {
            //如果輸入公司統編
            if (!firstNO.test(wwuCustId)) {
                this.saveEditor = this._mainService.checkCompanyNo(this.inp_data.custId);
                this._logger.log("compny saveEditor:", this.saveEditor);
                //如果輸入居留證
            } else if (secondNO.test(this.inp_data.custId)) {
                this.saveEditor['status'] = true;
                this.saveEditor['data'] = this.inp_data.custId;
                this.saveEditor['msg'] = '';
                //如果輸入身分證
            } else {
                this._logger.log("into wwu check_custId");
                this.saveEditor = this._checkService.checkIdentity(this.inp_data.custId)
            }
            if (this.saveEditor['status'] == false) {
                this.checkPersonId = true;
                this.personId_errorMsg = this.saveEditor['msg'];
                this.billData.personId = '';
            } else {
                this.checkPersonId = false;
                this.billData.personId = this.saveEditor['data'];
            }
            if (this.inp_data['licenseNo'] != '') {
                this.billData.licenseNo = this.inp_data['licenseNo'];
            }
            //檢核成功顯示子層：車牌號碼非必填(不檢核)
            if (this.billData.personId) {
                this._logger.log("into wwu check true");
                //旺旺傳參進hospitalAp
                // this._mainService.getWwuHospitalAp();
                this.goNextPage = true;
            }
            //非旺旺其他產壽險
        } else {
            this._logger.log("into anowther Insurance");
            //身分證檢核
            // this.saveEditor = this._checkService.checkIdentity(this.inp_data.custId);
            // if (this.saveEditor['status'] == false) {
            //     this.checkPersonId = true;
            //     this.personId_errorMsg = this.saveEditor['msg'];
            //     this.billData.personId = '';
            // } else {
            //     this.checkPersonId = false;
            //     this.billData.personId = this.saveEditor['data'];
            // }
            if (this.inp_data['licenseNo'] != '') {
                this.billData.licenseNo = this.inp_data['licenseNo'];
            }
            logger.error("billData:", this.billData);
            // 檢查輸入為空
            if (this.inp_data.custId == '' || this.inp_data.custId == null) {
                this.alert.show('請輸入身分證字號');
            } else {
                this.goNextPage = true;
                this.billData.personId = this.inp_data.custId;
            }
        }
    }

    onCancel() {
        this.cancelEdit();
    }


    /**
     * 失敗回傳
     * @param error_obj 失敗物件
     */
    onErrorBackEvent(e) {
        this._logger.step('Hospital', 'onErrorBackEvent', e);
        let page = 'form';
        let pageType = 'form';
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


        this.goNextPage = false; //驗證頁顯示開啟

        switch (pageType) {
            case 'cancel-edit': //左側返回(接收)
                // this.inp_data = { //將原有資料清空
                //     personId: '',
                //     birthday: '',
                //     custId: '',
                //     licenseNo: ''
                // };
                this.checkHospitalName();
                this._initEvent();
                break;
            case 'back': //checkbox頁，按取消(接收)
                // this.inp_data = { //將原有資料清空
                //     personId: '',
                //     birthday: '',
                //     custId: '',
                //     licenseNo: ''
                // };
                this.checkHospitalName();
                this._initEvent();
                break;
            default:
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
                break;
        }
    }


    /**
     * 啟動事件
     */
    private _initEvent() {
        this._headerCtrl.setLeftBtnClick(() => {
            this.cancelEdit();
        });
    }

    //跳出popup是否返回
    cancelEdit() {
        this.confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
            title: '提醒您'
        }).then(
            () => {
                //確定
                this.navgator.push(this.type_name);
            },
            () => {

            }
        );
    }

}
