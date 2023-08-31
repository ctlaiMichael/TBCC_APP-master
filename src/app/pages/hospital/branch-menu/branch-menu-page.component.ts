/**
 * 該分院功能選單
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HospitalService } from '@pages/hospital/shared/service/hospital.service';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FormateService } from '@shared/formate/formate.service';
import { AuthService } from '@core/auth/auth.service';
import { StartAppService } from '@lib/plugins/start-app/start-app.service';
import { StartAppOption } from '@lib/plugins/start-app/start-app-option';
import * as app from '@conf/external-app';
import { DeviceService } from '@lib/plugins/device.service';
import { reject } from 'q';
import { logger } from '@shared/util/log-util';
// import { HandleErrorService } from '@service/global';

@Component({
    selector: 'app-branch-menu',
    templateUrl: './branch-menu-page.component.html',
    styleUrls: [],
    providers: [HospitalService]
})
export class BranchMenuPageComponent implements OnInit {

    showSearchData = false;
    // varbal(存取醫院主選單Component傳來的資料)
    reqData = {
        hospitalId: '',
        branchId: ''
    };
    //定義醫療or產壽變數
    nowPageType = 'branch';
    type = ""; //1: 醫療 , 2: 產壽 (不會發request)
    type_name = '';
    hospitalName: string;
    showData = true; //是否顯示資料(後端)
    showInfo = true; //顯示表單明細(ex:醫療資訊)
    showBill = true; //顯示表單明細(ex:醫療費用)
    // showBranchMenu = true; //顯示分院選單頁面
    // showPageInfo = false; //顯示醫療資訊選單頁面
    data = [];
    info_data: any = {};
    custId = ''; //登入者身分證號

    note = false; //顯視提醒您欄位

    showTung = false; //顯示童綜合(已繳醫療費查詢、常用繳款帳號設定)
    showWwu = false; //顯示旺旺(繳費單繳費)
    disableATM = false; //判斷合庫MATM有無安裝
    showNtuhButton = false; //顯示台大登出按鈕
    //傳給已繳醫療費查詢頁面(童綜合用)
    haspayReq = {
        custId: '',
        hospitalId: '',
        branchId: '',
        hospitalName: ''
    }
    // goHasPay = false; //顯示以繳醫療費頁面

    onDeviceReady: Promise<any>;

    constructor(

        private route: ActivatedRoute
        , private _logger: Logger
        // , private _handleError: HandleErrorService
        , private _mainService: HospitalService
        , private router: Router
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private navgator: NavgatorService
        , private _formateService: FormateService
        , public authService: AuthService
        , private startAppService: StartAppService
        , private device: DeviceService

    ) {
    }

    ngOnInit() {
        //取得上一頁帶過來的參數(url)
        this.route.queryParams.subscribe(params => {
            if (params.hasOwnProperty('hospitalId') && params.hasOwnProperty('branchId')) {
                // set data
                this.reqData.hospitalId = params.hospitalId; //接到傳參值(url)
                this.reqData.branchId = params.branchId;
                // this.reqData.type = params.type;
                this._logger.log("reqData:", this.reqData);
                this._logger.log("params:", params);
            }
            this.type_name = this._formateService.checkField(params, "type");
            if (this.type_name != "insurance") {
                this.type = "1";
            } else {
                this.type = "2";
            }
            // this.reqData.type = this.type;
            this._logger.log("type is:", this.type);
            this._logger.log("reqData:", this.reqData);
            if (this.reqData.hospitalId == "TUNG") {
                this.showTung = true;
            }
            if(this.reqData.hospitalId == "NTUH") {
                this.showNtuhButton = true;
            }
            //之後改為下方判斷，Var.isOpenCommonAcct=true(資訊來源不明),因此目前寫死童綜合!!!
            // if(this.info_data.hospitalId != 'NTUH' && this.info_data.intraBankTrns == 'Y') {
            //     this.showTung = true;  
            // } else if(this.info_data.hospitalId != 'NTUH' && this.info_data.intraBankTrns == 'N') {
            //     this.showTung = false;
            // }

            //判斷合庫matm有無

            const appProfile: StartAppOption = app['matm'];
            this.device.devicesInfo().then(
                (deviceInfo) => {

                    let appUri;

                    if (deviceInfo.platform.toLowerCase() == 'android') {
                        appUri = { "package": appProfile.android.uri };
                    } else if (deviceInfo.platform.toLowerCase() == 'ios') {
                        appUri = appProfile.ios.uri;
                    } else {
                        reject();
                    }
                    logger.error('appUri',appUri,deviceInfo.platform.toLowerCase());
                    this.startAppService.doCheckApp(appUri).then(
                        (resolve) => {
                            this._logger.log('EPay','有安裝');
                            this.disableATM = true;
                        },
                        (reject) => {
                            this._logger.log('EPay','無安裝',reject);
                            this.disableATM = false;
                        }
                    )
                },
                (fail) => {

                }
            )


        });

        // get data
        //去service拿全部資料
        this._mainService.getMoreData(this.reqData, this.type).then(
            (result) => {
                //sucess
                this._logger.step('Financial', 'getData:', result);
                //拿一整個電文資料{}
                this.info_data = result.info_data;
                //判斷 info_data有無branchName
                this.hospitalName = this._formateService.checkField(this.info_data, 'branchName');
                // 台大name 特規
                //拿{}中的詳細資料[]
                this.data = result.data;
                this.showData = true;
                this.showInfo = result.showInfo;
                this.showBill = result.showBill;
                this.note = result.note;
                this._logger.log("note:", this.note);
                // this.showBranchMenu = result.showBranchMenu; // ???
                // this.showPageInfo = result.showPageInfo; // ????

                //判斷醫療資訊 infoLink => 0: 不顯示、1: 連結內部APP、2: 呼叫外部APP、3: 內部APP + 外部APP
                if (this.info_data.infoLink == '0') {
                    this.showInfo = false;
                }
                //2: 呼叫外部APP、3: 內部APP + 外部APP  (未完成)!!!

                if (this.reqData.hospitalId === 'TCBL') {
                    this.onInforEvent(this.info_data.infoLinkDesc);
                } else {
                    this.onChangePage('list');
                }
                this._logger.log("info_data:", this.info_data);
                this._logger.log("data:", this.data);
                if (this.reqData.hospitalId == "WWU") {
                    this.showWwu = true;
                    this.note = true;
                }

                this.showSearchData = true;
                this.navgator.pageInitEnd(); // 取得資料後顯示頁面
            },
            (errorObj) => {

                //error
                this._logger.step('Hospital', 'getData', errorObj);
                this.showData = false;
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);

            }
        );
    }
    //點擊其中一項資訊
    onInfo(menu) {
        //1: 連結內部APP
        if (this.info_data.infoLink == '1') {
            this.navgator.push(menu.infoUrl);
        }
    }

    onInforEvent(titleName) {
        this._logger.step('Hospital', 'onInforEvent', titleName);
        // this.nowPageType = 'page_info';
        // this.showBranchMenu = false;
        // this.showPageInfo = true;
        this._headerCtrl.updateOption({
            'title': titleName
        });
        this.onChangePage('page_info');
    }

    onBillEvent(titleName) {
        let url_params = {
            hospitalId: '',
            branchId: '',
            type: '',
            branchName: '',
            intraBankTrns: '', //行動銀行轉帳顯示註記
            eBillTrns: '', //本人帳戶繳費顯示註記
            icCardTrns: '', //金融卡轉帳顯示註記
            creditNoticeUrl: '',//注意事項URL
            titleName: titleName,    //標題名稱
            note3: this.info_data.note3,            //提醒事項3
            disableATM:this.disableATM  //有無安裝合庫MATM
        };
        this._logger.log('titleName', titleName);

        if (this.info_data.hasOwnProperty("hospitalId") && this.info_data['hospitalId'] == "NTUH"
            && this.info_data.hasOwnProperty("branchId")) {
            url_params['hospitalId'] = this.info_data['hospitalId'];
            url_params['branchId'] = this.info_data['branchId'];
            url_params['type'] = this.type;
            url_params['branchName'] = this.hospitalName;
            url_params['intraBankTrns'] = this.info_data.intraBankTrns;
            url_params['eBillTrns'] = this.info_data.eBillTrns;
            url_params['icCardTrns'] = this.info_data.icCardTrns;
            url_params['creditNoticeUrl'] = this.info_data.creditNoticeUrl;
            this._logger.log('NUTHBillParams:', url_params);
            this.navgator.push('ntuh', {}, url_params);
        } else if(this.info_data.hasOwnProperty("hospitalId") && this.info_data['hospitalId'] == "WWU"
         && this.info_data.hasOwnProperty("branchId")) {
            //  this._mainService.getWwuHospitalAp(this.info_data,this.disableATM);
            url_params['hospitalId'] = this.info_data['hospitalId'];
            url_params['branchId'] = this.info_data['branchId'];
            url_params['type'] = this.type;
            url_params['branchName'] = this.hospitalName;
            url_params['intraBankTrns'] = this.info_data.intraBankTrns;
            url_params['eBillTrns'] = this.info_data.eBillTrns;
            url_params['icCardTrns'] = this.info_data.icCardTrns;
            url_params['creditCardTrns'] = this.info_data.creditCardTrns;
            url_params['creditNoticeUrl'] = this.info_data.creditNoticeUrl;
            url_params['disableATM'] = this.disableATM;
            this.navgator.push('insurance-bill', {}, url_params);
        }
        
        else {
            url_params['hospitalId'] = this.info_data['hospitalId'];
            url_params['branchId'] = this.info_data['branchId'];
            url_params['type'] = this.type;
            url_params['branchName'] = this.hospitalName;
            url_params['intraBankTrns'] = this.info_data.intraBankTrns;
            url_params['eBillTrns'] = this.info_data.eBillTrns;
            url_params['icCardTrns'] = this.info_data.icCardTrns;
            url_params['creditCardTrns'] = this.info_data.creditCardTrns;
            url_params['creditNoticeUrl'] = this.info_data.creditNoticeUrl;
            url_params['disableATM'] = this.disableATM;
            this._logger.log('BillParams:', url_params);
            if (url_params.type == '2') {
                this.navgator.push('insurance-bill', {}, url_params);
            } else {
                this.navgator.push('hospital-bill', {}, url_params);
            }
            // this.router.navigate([{ outlets: { primary: 'hospital/pay/bill' } }], { queryParams: url_params });
        }
    }

    //已繳醫療費查詢(童綜合)
    onHaspayQuery() {
        const userData = this.authService.getUserInfo(); //拿使用者資料
        this._logger.log("userData:", this.authService.getUserInfo());
        if (typeof userData === 'undefined' || userData == '') {
            this.navgator.push('home'); //導回登入頁
            return false;
        } else {
            this.custId = userData.custId;
        }
        this._logger.log("custId:", this.custId);

        this.haspayReq.custId = this.custId;
        this.haspayReq.hospitalId = this.info_data['hospitalId'];
        this.haspayReq.branchId = this.info_data['branchId'];
        this.haspayReq.hospitalName = this.hospitalName;
        this._logger.step('Hospital', "haspayReq:", this.haspayReq);
        this.onChangePage('haspay-query');
    }

    //常用繳款帳號設定(童綜合)
    onAccountSet() {
        const userData = this.authService.getUserInfo(); //拿使用者資料
        this._logger.log("userData:", this.authService.getUserInfo());
        if (typeof userData === 'undefined' || userData == '') {
            this.navgator.push('home'); //導回登入頁
        } else {
            this.custId = userData.custId;
        }
        this._logger.log("custId:", this.custId);
        this.haspayReq.custId = this.custId;
        this.haspayReq.hospitalId = this.info_data['hospitalId'];
        this.haspayReq.branchId = this.info_data['branchId'];
        this.haspayReq.hospitalName = this.hospitalName;
        this.onChangePage('account-set');

    }
    //繳費單繳費
    onDebitCard() {
        logger.error('this.disableATM',this.disableATM);
        if(!this.disableATM){    //無安裝
            this._handleError.handleError({
                type: 'dialog',
                title: '提醒您',
                content: "請先安裝合庫mATM"
            });
            return false; 
            
        }
        let obj = { 'hospitalId': this.info_data['hospitalId'], 'branchId': this.info_data['branchId'], 'hospitalName': this.hospitalName };
        this.navgator.push('debit-card', {}, obj);
    }

    //旺旺點選(安裝mAtm)
    onmAtm() {
        this.navgator.push('app:matm');
    }

    /**
     * 子層返回事件
     * @param e 
     */
    onBackPage(e) {
        this._logger.step('Hospital', 'onBackPage', e);
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
        // if (page === 'list-item' && pageType === 'page_info') {
        //     // 設定頁面資料
        //     if (tmp_data.hasOwnProperty('page_info')
        //         && this.pageCounter == 1
        //     ) {
        //         // 第一頁才要設定，其他不變
        //         this.totalPages = tmp_data['page_info']['totalPages'];
        //     }
        //     return false;
        // }

        this.onChangePage(pageType, tmp_data);
    }

    /**
     * 失敗回傳
     * @param error_obj 失敗物件
     */
    onErrorBackEvent(e) {
        this._logger.step('Hospital', 'onErrorBackEvent', e);
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

        // this._logger.error('back', errorObj, e);

        switch (page) {
            case 'haspay-query':
                // == 內容返回(先顯示列表再顯示錯誤訊息) == //
                this.onBackPage('list');
                errorObj['type'] = 'dialog';
                this._handleError.handleError(errorObj);
                break;
        }
    }


    /**
    * 頁面切換
    * @param pageType 頁面切換判斷參數
    *        'list' : 顯示額度使用明細查詢頁(page 1)
    *        'content' : 顯示額度使用明細結果頁(page 2)
    * @param pageData 其他資料
    */
    onChangePage(pageType: string, pageData?: any) {
        this._logger.step('Hospital', 'onChangePage', pageType, pageData);
        //如果傳進來的參數為以下狀況 => haspay-query ,page_info, list
        switch (pageType) {
            case 'haspay-query': //已繳醫療費查詢
                // this.goHasPay = true;
                this.nowPageType = 'goHasPay'; //view透過 nowPageType 切換顯示[ngSwitch]="nowPageType"
                break;
            case 'account-set': //常用扣款帳號設定
                // this.goHasPay = true;
                this.nowPageType = 'accountSet'; //view透過 nowPageType 切換顯示[ngSwitch]="nowPageType"
                break;
            case 'page_info': // 資訊頁
                this.nowPageType = 'page_info';
                this._logger.log('onChangePageonChangePage', this.nowPageType);
                this._headerCtrl.setLeftBtnClick(() => { //左側選單返回
                    if (this.reqData.hospitalId == "TCBL") {
                        this._logger.log('this.type_name', this.type_name);
                        this.navgator.push(this.type_name); //轉址
                    } else {
                        this.onChangePage('list');
                        this._logger.log('onChangePageonChangePage back', this.nowPageType);
                    }
                });
                break;
            // case 'haspay-query-back': 
            //     this.nowPageType = 'branch';
            //     this._headerCtrl.updateOption({
            //         'leftBtnIcon': 'back',
            //         'title': this.hospitalName
            //     });
            //     break;
            case 'list':
            default: // 分院頁
                // this.goHasPay = false;
                this.nowPageType = 'branch';
                // --- 頁面設定 ---- //
                this._headerCtrl.updateOption({
                    'leftBtnIcon': 'back',
                    'title': this.hospitalName
                });
                this._logger.log('list ', this.nowPageType);
                this._headerCtrl.setLeftBtnClick(() => {
                    // this._logger.error('is list back');
                    // if(this.reqData.hospitalId=="TCBL"){
                    //     this._logger.log('this.type_name',this.type_name);
                    // }else{
                    this.navgator.push(this.type_name); //轉址
                    // }
                });
                // --- 頁面設定 End ---- //
                break;
        }
    }

}