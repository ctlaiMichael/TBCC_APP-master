/**
 * 主掃
 */
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Logger } from '@core/system/logger/logger.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { FormateService } from '@shared/formate/formate.service';
import { CheckService } from '@shared/check/check.service';
import { CacheService } from '@core/system/cache/cache.service';
import { MenuPopupService } from '@shared/popup/menu-popup/menu-popup.service';
// == 頁面控制相關 == //
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
// == epay 相關 == //
import { QrcodeService } from '@lib/plugins/qrcode.service';
import { QRTpyeService } from '@pages/epay/shared/qrocdeType.service';
import { EPayService } from '@pages/epay/shared/epay.service';
import { ScanErrorOptions } from '@base/options/scan-error-options';
import { QRCodeTestCase } from '@pages/epay/shared/service/qrcode-testcase';
import { QrcodeAnalyzeOptions } from '@pages/epay/shared/service/qrcode/qrcode-analyze-options';
import { QrcodeFieldsOptions } from '@pages/epay/shared/service/qrcode/qrcode-fields-options';
import { AnalyzeTWQRP } from '@pages/epay/shared/service/qrcode/analyze-twqrp-class';
// == API 相關 == //
import { FQ000102ApiService } from '@api/fq/fq000102/fq000102-api.service';
import { FQ000104ApiService } from '@api/fq/fq000104/fq000104-api.service';

@Injectable()
export class OnscanService {
    openCaramsFlag = false; // 開啟相機狀態紀錄
    private QrcodeTypeList = {
        'TWQRP1': 'TWQRP://'
        , 'TWQRP2': 'https://paytax.nat.gov.tw/QRCODE.aspx?par='
        , 'TWQRP3': 'tw.com.twqrp'
        , 'EMV': '000201'
    };

    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private _checkService: CheckService
        , private localStorage: LocalStorageService
        , private navgator: NavgatorService
        , private handleError: HandleErrorService
        , private uiContent: UiContentService
        , private scan: QrcodeService
        , private qrtype: QRTpyeService
        , private epay: EPayService
        , private fq000102: FQ000102ApiService
        , private fq000104: FQ000104ApiService
        , private _cacheService: CacheService
        , private _menuPopup: MenuPopupService
    ) { }

    /**
     * 主掃啟動事件
     */
    initScan(): Promise<any> {
        this._logger.step('Epay', 'onscan init in service');
        // 查看上次交易狀態沒有的話給預設值
        let old_data = this.localStorage.get('lastTransaction');
        if (old_data === false || old_data == '') {
            this._logger.step('Epay', 'lastTransaction set 1');
            this.localStorage.set('lastTransaction', '1');
        }
        // 取資料
        return this.sendFQ000101().then(
            (resObj) => {
                // 檢查完成開始掃描QRCode
                return Promise.resolve(resObj);
            }
        ).catch((errorObj) => {
            this.closeScan();
            return Promise.reject(errorObj);
        });

    }

    getFq000101Data() {
        let cache_key = 'acct-epay-t';
        let cache_data = this._cacheService.load(cache_key);
        return cache_data;
    }

    /**
     * 離開主掃前往其他頁面
     * @param url
     */
    changePage(url, params?: any) {
        if (url == '') {
            url = 'epay';
        }
        if (typeof params === 'undefined' || !params) {
            params = {};
        }
        this.closeScan().then(
            (closeResObj) => {
                this._logger.step('Epay', 'cancelScan an go', closeResObj, url, params);
                this.navgator.push(url, params);
            },
            (closeErrorObj) => {
                this._logger.error('Epay', '[Error] cancelScan an go', closeErrorObj, url, params);
                this.navgator.push(url, params);
            }
        );
    }

    /**
     * 關閉主掃
     */
    closeScan(): Promise<any> {
        if (!!sessionStorage.cameraReady || !!this.openCaramsFlag) {
            this._logger.step('Epay', 'do cancel Scan', sessionStorage.cameraReady, this.openCaramsFlag);
            this.openCaramsFlag = false;
            delete sessionStorage.cameraReady;
            return this.scan.closeCamera().then(
                (closeResObj) => {
                    this._logger.step('Epay', 'cancelScan', closeResObj);
                    return Promise.resolve(closeResObj);
                },
                (closeErrorObj) => {
                    this._logger.error('Epay', '[Error] cancelScan', closeErrorObj);
                    return Promise.reject(closeErrorObj);
                }
            );
        } else {
            this._logger.step('Epay', 'cancelScan', 'no do');
            return Promise.resolve({});
        }
    }

    /**
     * 檢查失敗事件
     */
    checkError(resultObj) {
        this._logger.step('Epay', 'checkError', resultObj);
        let msg_code = this._formateService.checkField(resultObj, 'resultCode');
        let msg_code2 = this._formateService.checkField(resultObj, 'msg_code');
        if (msg_code == '' && msg_code2 !== '') {
            msg_code = msg_code2;
        }
        let msg_str = this._formateService.checkField(resultObj, 'msg');
        let real_obj = this._formateService.checkObjectList(resultObj, 'resultData');
        let isCancel = false;
        let isGoSet = false;
        if (typeof resultObj === 'object' && !!resultObj) {
            isCancel = (!!resultObj.cancelFlag) ? true : false;
            isGoSet = (!!resultObj.gotoSetFlag) ? true : false;
        }
        let real_str = '';
        let output = {
            type: 'dialog',
            title: 'ERROR.TITLE',
            content: 'ERROR.SCAN.SCAN', // 掃描失敗
            resultData: resultObj
        };
        if (real_obj) {
            real_str = this._formateService.checkField(real_obj, 'name');
        }

        if (isCancel || msg_code == 'SCAN_CANCEL') {
            this.closeScan();
            if (msg_code == 'STOP_PROMISE') {
                // 停止後續作業
                return false;
            }
            // QR Code掃描取消
            output.content = 'ERROR.SCAN.STOP_SCAN'; // 您已取消掃描
            this.handleError.handleError(output).then(
                () => {
                    this.changePage('epay');
                }
            );
        } else {
            let back_path = 'epay'; // 錯誤固定返回選單
            output.content = msg_str;
            if (output.content == '') {
                output.content = 'ERROR.DEFAULT'; // 很抱歉，發生未預期的錯誤！如造成您的困擾，敬請見諒。若有其他疑問，請聯繫客服中心。
            }
            this.handleError.handleError(output).then(
                () => {
                    this.closeScan();
                    if (back_path !== '') {
                        this.changePage(back_path);
                    }
                }
            );
        }
    }

    /**
     * 開啟主掃
     * return: 取得回傳字串
     */
    async openScan(): Promise<any> {
        this.openCaramsFlag = true;
        this._logger.step('Epay', 'open init');
        this.resetScanData();
        this.uiContent.setSectionScroll(false); // 停止頁面滾動
        this.scan.waitForReady().then(() => {
            if (!sessionStorage.cameraReady) {
                this._logger.step('Epay', 'open 2: sessionStorage.cameraReady set');
                sessionStorage.cameraReady = true;
            }
        }).catch((errorObj) => {
            this._logger.step('Epay', 'open 2: camera not open', errorObj);
        });
        this._logger.step('Epay', 'open 3: openCamera');
        try {
            sessionStorage.cameraReady = true;
            let Qrcode_res = await this.scan.openCamera();
            // this._logger.step('Epay', 'open 4: analyze ready', Qrcode_res);
            if (typeof Qrcode_res !== 'string') {
                let cancel_data = new ScanErrorOptions();
                cancel_data.resultCode = 'SCAN_CANCEL';
                cancel_data.resultData = Qrcode_res;
                cancel_data.msg = 'ERROR.SCAN.STOP_SCAN'; // 您已取消掃描
                cancel_data.cancelFlag = true;
                return Promise.reject(cancel_data);
            }

            // 掃描完畢即關閉
            this.closeScan();

            if (!environment.ONLINE) {
                // 模擬測試使用
                return this._testQrcode(Qrcode_res);
            } else {
                return Promise.resolve(Qrcode_res);
            }
        } catch (errorObj) {
            this._logger.error('Epay', 'open 4: Error', errorObj);
            return Promise.reject(errorObj);
        }
    }

    /**
     * 開啟圖片主掃
     * return: 取得回傳字串
     */
    async imageScan(): Promise<any> {
        this._logger.step('Epay', 'imageScan start');
        this.resetScanData();
        try {
            let Qrcode_res = await this.scan.imageScan();
            if (typeof Qrcode_res !== 'string') {
                let cancel_data = new ScanErrorOptions();
                cancel_data.resultCode = 'SCAN_CANCEL';
                cancel_data.resultData = Qrcode_res;
                cancel_data.msg = 'ERROR.SCAN.STOP_SCAN'; // 您已取消掃描
                cancel_data.cancelFlag = true;
                return Promise.reject(cancel_data);
            }

            if (!environment.ONLINE) {
                // 模擬測試使用
                return this._testQrcode(Qrcode_res);
            } else {
                return Promise.resolve(Qrcode_res);
            }
        } catch (errorObj) {
            this._logger.error('Epay', 'open 4: Error', errorObj);
            return Promise.reject(errorObj);
        }

    }


    // --------------------------------------------------------------------------------------------
    //                       __
    // _____    ____ _____  |  | ___.__.________ ____
    // \__  \  /    \\__  \ |  |<   |  |\___   // __ \
    //  / __ \|   |  \/ __ \|  |_\___  | /    /\  ___/
    // (____  /___|  (____  /____/ ____|/_____ \\___  >
    //      \/     \/     \/     \/           \/    \/
    // --------------------------------------------------------------------------------------------


    /**
     * 解析QR Code String (原系統的 scanQRCodeNew)
     * 不同QR Code類別請參考 modifyAnalyzeReq
     */
    async analyzeCode(Qrcode_res): Promise<any> {
        this._logger.step('Epay', 'analyze init', Qrcode_res);
        try {
            let reqData: QrcodeAnalyzeOptions = await this.modifyAnalyzeReq(Qrcode_res);
            let resultObj: QrcodeFieldsOptions = await this.processAnalyze(reqData);
            return Promise.resolve(resultObj);
        } catch (errorObj) {
            this._logger.error('Epay', 'analyze Error', errorObj);
            return Promise.reject(errorObj);
        }
    }

    /**
     * 解析QR Code類型
     * 目前提供兩類型：(後續請依照需求擴充)
     * retrun object
     * [type]:[subtype] 主類別: 子類別
     *      TWQRP: TWQRP1, TWQRP2
     *      EMV: EMV
     * [data] QR Code解析資料(傳入的QR Code str)
     * [preCheckQrcode] decodeURI QR Code
     */
    private analyzeQrcodeStr(jsonObj: string): QrcodeAnalyzeOptions {
        let output = new QrcodeAnalyzeOptions();
        output.errorData = new ScanErrorOptions();
        output.data = jsonObj;

        let inputStr = this.qrtype.decodeURI(jsonObj);
        output.preCheckQrcode = inputStr;

        let checkTwqrpPos = this._formateService.findKey(inputStr, this.QrcodeTypeList['TWQRP1']);
        let checkPaytaxPos = this._formateService.findKey(inputStr, this.QrcodeTypeList['TWQRP2']);
        if (checkTwqrpPos || checkPaytaxPos) {
            output.status = true;
            output.type = 'TWQRP';
            output.subtype = (checkTwqrpPos) ? 'TWQRP1' : 'TWQRP2';
            if (!!this.QrcodeTypeList[output.subtype]) {
                output.subtypeIndex = inputStr.indexOf(this.QrcodeTypeList[output.subtype]);
            }
        } else {
            let isEMV = this._formateService.findKey(
                inputStr
                , this.QrcodeTypeList['EMV']
                , [0, this.QrcodeTypeList['EMV'].length]
            );
            if (isEMV) {
                output.status = true;
                output.type = 'EMV';
                output.subtype = 'EMV';
            } else {
                output.errorData.resultCode = 'SCAN_ERROR';
                output.errorData.resultData = jsonObj;
                output.errorData.msg = 'ERROR.SCAN.SCAN_ERROR_EMV'; // QR Code掃描失敗(EMV)
            }
        }
        return output;
    }

    /**
     * 針對不同的QR Code進行檢析處理
     */
    private async modifyAnalyzeReq(Qrcode_res): Promise<any> {
        if (typeof Qrcode_res !== 'string') {
            let cancel_data = new ScanErrorOptions();
            cancel_data.resultCode = 'SCAN_CANCEL';
            cancel_data.resultData = Qrcode_res;
            cancel_data.msg = 'ERROR.SCAN.STOP_SCAN'; // 您已取消掃描
            cancel_data.cancelFlag = true;
            return Promise.reject(cancel_data);
        }
        let jsonObj = Qrcode_res;
        let output: QrcodeAnalyzeOptions = this.analyzeQrcodeStr(jsonObj);
        let preCheckQrcode = output.preCheckQrcode;
        let qrcodeType = output.type;
        this._logger.step('Epay', 'analyze ', qrcodeType);
        if (qrcodeType === 'TWQRP') {
            /**
             * TWQRP規格
             */
            this.qrtype.TaiwanPayTypeSet('1');
            return Promise.resolve(output);
        } else if (qrcodeType === 'EMV') {
            /**
             * EMV規格
             */
            this.qrtype.TaiwanPayTypeSet('0');
            let resfq000102 = await this.modifyAnalyzeEmv(preCheckQrcode, jsonObj);
            if (resfq000102.need104Flag) {
                output.type = 'EMV';
                return Promise.resolve(output);
            } else {
                // [evm 純信用卡] go to qrCodePayCardForm
                this.navgator.push('qrCodePayCardForm', {
                    trnsfrOutCard: '',
                    qrcode: resfq000102
                });
                // 後續執行取消交易作業
                let cancel_data = new ScanErrorOptions();
                cancel_data.resultCode = 'STOP_PROMISE';
                cancel_data.resultData = resfq000102;
                cancel_data.msg = ''; // change page
                cancel_data.cancelFlag = true;
                return Promise.reject(cancel_data);
            }
        } else {
            let error_data = output.errorData;
            if (error_data.msg == '') {
                error_data.resultCode = 'UNKNOW_QRCODE_TYPE';
                error_data.resultData = preCheckQrcode;
                error_data.msg = 'EPAY.ERROR.UNKNOW_QRCODE_TYPE'; // QR Code掃描失敗(不明類別)
            }
            return Promise.reject(error_data);
        }

    }

    /**
     * Emv解析
     */
    private modifyAnalyzeEmv(preCheckQrcode, jsonObj): Promise<any> {
        this._logger.step('Epay', 'analyze EMV');
        let req: any = {
            'EMVQRCode': preCheckQrcode
        };
        return this.fq000102.send(req).then(
            (resfq000102) => {
                if (resfq000102.need104Flag && !!resfq000102['boundleRes']) {
                    this.qrtype.fq000102ResSet(resfq000102);
                }
                return Promise.resolve(resfq000102);
            },
            (errorObj) => {
                let error_data = this.apiErrorModify(errorObj);
                return Promise.reject(error_data);
            }
        );
    }

    /**
     * 準備處理進行解析 (原系統的processSucess)
     */
    private processAnalyze(analyzeCode: QrcodeAnalyzeOptions): Promise<any> {
        let returnObj: QrcodeFieldsOptions;
        let qrcodeType = analyzeCode.type;
        let successQRCode = analyzeCode.data;
        // 加入判斷繳費與繳稅
        this._logger.step('Epay', 'analyzeCode', analyzeCode);
        returnObj = this.checkQRCode(analyzeCode);

        if (!returnObj.status) {
            return Promise.reject(returnObj.error_data);
        }

        if (returnObj.PayType == '2') {
            return Promise.resolve(returnObj);
        }
       
        // 準備發FQ000104進行解析
        let qrcode = successQRCode;
        let prefixURL;
        if (qrcode.indexOf('https') != '-1' && qrcode.indexOf('TWQRP') != '-1')  {  //判斷QRCode前段是否含有https
            prefixURL = qrcode.substring(0, qrcode.indexOf('TWQRP'));
        } else { prefixURL = ''; }
        qrcode = qrcode.substring(qrcode.indexOf('TWQRP'));
        let isTWQRP = this._formateService.findKey(qrcode, this.QrcodeTypeList['TWQRP3']);
        if (isTWQRP) {
            qrcode = qrcode.toString().replace(/\+/g, '%2B');
        }

        // let n = qrcode.indexOf('26D11%3D');
        // let k2, k1, k, m;
        // if (n > 0) {
        //     m = qrcode.substring(n);
        //     k2 = m.indexOf('%26D');
        //     if (k2 > 0) {
        //         k1 = qrcode.substring(n, n + k2);
        //         k = k1.indexOf('11%2C');
        //     } else {
        //         k1 = qrcode.substring(n);
        //         k = k1.indexOf('11%2C');
        //     }
        // }
        // if (n > 0 && k > 0) {
        // } else {
        //     qrcode = qrcode.toString().replace(/\+/g, '%2B');
        // }

        let req: any = {
            QRCode: qrcode,
            prefixURL: prefixURL
        };
        return this.fq000104.send(req).then(
            (resObj) => {
                let res_data = this._formateService.transClone(resObj.body);
                returnObj.checkRes = resObj; // fq000104新追加整理資訊
                returnObj.response = res_data; // (新追加變數)不知道為什麼要放response
                returnObj.data = res_data; // 原程式放data
                // returnObj.data = {
                //     trnsType: ''
                // };

                let qrExpirydate = this._formateService.checkField(res_data, 'qrExpirydate');
                if (qrExpirydate == '' || qrExpirydate.length != 8) {
                    returnObj.response['qrExpirydate'] = '';
                    returnObj.data['qrExpirydate'] = '';
                }
                let trnsType = this._formateService.checkField(res_data, 'trnsType');
                returnObj.response.trnsType = trnsType;
                returnObj.data.trnsType = trnsType;

                return Promise.resolve(returnObj);
            },
            (errorObj) => {
                let error_data = this.apiErrorModify(errorObj);
                return Promise.reject(error_data);
            }
        );
    }


    /**
     * QR Code資訊分析 (原系統的checkQRCode)
     * @param analyzeCode
     */
    private checkQRCode(analyzeCode: QrcodeAnalyzeOptions): QrcodeFieldsOptions {
        let output = new QrcodeFieldsOptions();
        let subType = analyzeCode.subtype;
        let qrcodeData = analyzeCode.data;
        if (subType === 'EMV') {
            output.status = true;
            return output;
        }
        //  檢查是否為空值
        if (!this._checkService.checkEmpty(qrcodeData, true)) {
            this._logger.step('Epay', 'Error empty', qrcodeData);
            output.error_data.msg = 'ERROR.SCAN.QRCODE_EMPTY'; // QR Code為空值
            return output;
        }

        //  避免字串有編碼統一解碼
        let qrcode = analyzeCode.preCheckQrcode;
        if (!this._checkService.checkEmpty(qrcode, true)) {
            qrcode = this.qrtype.decodeURI(qrcodeData);
        }
        //  檢查是否財金QRCode
        let analyzeTwqrpObj = new AnalyzeTWQRP();
        let pos = analyzeCode.subtypeIndex;
        if (subType === 'TWQRP1') {
            // QR Code為 「TWQRP://」
            output = analyzeTwqrpObj.analyze1(qrcode, pos);
        } else if (subType === 'TWQRP2') {
            // QR Code為 「https://paytax.nat.gov.tw/QRCODE.aspx?par=」
            output = analyzeTwqrpObj.analyze2(qrcode, pos);
        } else {
            output.error_data.msg = 'ERROR.SCAN.QRCODE_FORMATE_ERROR'; // QRCode 格式錯誤
        }

        this._logger.step('Epay', 'checkQrcode', output);
        return output;
    }


    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__| PART_BOX: private
    // --------------------------------------------------------------------------------------------

    /**
     * 強制在重掃資料時，全部資料重新設定
     */
    private resetScanData() {
        this.qrtype.TaiwanPayTypeSet('');
        this.qrtype.fq000102ResSet({}); // emv暫存資料
        this.qrtype.hasCardsSet('');
    }

    /**
     * 載入帳號和使用者設定
     */
    private async sendFQ000101(): Promise<any> {
        this._logger.step('Epay', 'get FQ000101 init');
        // 清空資料
        this.qrtype.trnsfrOutCardSet('');
        this.qrtype.trnsfrOutCardTypeSet('');
        try {
            const fq000101Data: any = await this.epay.sendFQ000101('T');
            let cache_key = 'acct-epay-t';
            let cache_option = this._cacheService.getCacheSet(cache_key);
            this._cacheService.save(cache_key, fq000101Data, cache_option);
            let output = {
                haveTerm: true,
                api_data: fq000101Data,
                myAcct: '',
                defaultTrnsOutAcct: '',
                trnsLimitAmt: ''
            };

            let accountData = fq000101Data._accountData;
            let trnsOutAcct = accountData.default;
            if (trnsOutAcct == '') {
                // 取得預設帳號，若無則導向設定頁
                output.haveTerm = false;
                // this.navgator.push('qrcodePayTerms');
            } else {
                this.qrtype.trnsfrOutCardSet(fq000101Data.defaultTrnsCard);
                this.qrtype.trnsfrOutCardTypeSet(fq000101Data.cardType);

                output.myAcct = accountData.mask;
                output.defaultTrnsOutAcct = trnsOutAcct;
                output.trnsLimitAmt = fq000101Data.trnsLimitAmt;
            }
            this._logger.step('Epay', 'fq000101Data', fq000101Data, output);
            return Promise.resolve(output);
        } catch (errorObj) {
            return Promise.reject(errorObj);
        }
    }

    /**
     * 電文回傳處理
     * @param errorObj
     */
    private apiErrorModify(errorObj) {
        let error_data = new ScanErrorOptions();
        error_data.resultCode = this._formateService.checkField(errorObj, 'resultCode');
        error_data.resultData = errorObj;
        let err_str1 = this._formateService.checkField(errorObj, 'msg');
        error_data.msg = this._formateService.checkField(errorObj, 'content');
        if (error_data.msg == '' && err_str1 !== '') {
            error_data.msg = err_str1;
        }
        if (error_data.msg === '') {
            error_data.msg = 'EPAY.ERROR.UNKNOW_API_ERROR'; // QR Code解析失敗(SERVER)
        }
        return error_data;
    }

    /**
     * QR Code模擬code
     * @param Qrcode_res
     */
    private _testQrcode(Qrcode_res): Promise<any> {
        let output = Qrcode_res;
        if (!!environment.ONLINE || !!environment.NATIVE) {
            return Promise.resolve(output);
        }
        let set_data = [];
        let tk: any;
        for (tk in QRCodeTestCase) {
            if (!!QRCodeTestCase[tk]) {
                let tmp_code = QRCodeTestCase[tk];
                let tmp_name = tk;
                if (typeof QRCodeTestCase[tk] == 'object') {
                    if (!!QRCodeTestCase[tk]['qrcode']) {
                        tmp_code = QRCodeTestCase[tk]['qrcode'];
                    }
                    if (!!QRCodeTestCase[tk]['name']) {
                        tmp_name = QRCodeTestCase[tk]['name'];
                    }
                }
                set_data.push({
                    id: tk,
                    name: tmp_name,
                    qrcode: tmp_code
                });
            }
        }
        return this._menuPopup.show({
            title: '請選擇欲測試項目'
            , menu: set_data
        }).then(
            (item) => {
                let test_case = (!!item['id']) ? item['id'] : '';
                // 模擬測試使用
                if (!!QRCodeTestCase && !!QRCodeTestCase[test_case]) {
                    output = (!!QRCodeTestCase[test_case]['qrcode']) ? QRCodeTestCase[test_case]['qrcode'] : QRCodeTestCase[test_case];
                }
                return Promise.resolve(output);
            },
            () => {
                return Promise.reject({
                    title: '測試',
                    msg: '取消掃描並返回選單'
                });
            }
        );
    }

}
