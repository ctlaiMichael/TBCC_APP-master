import { Component, OnInit } from '@angular/core';
import { FQ000304ApiService } from '@api/fq/fq000304/fq000304-api.service';
// import { FQ000304ReqBody } from '@api/fq/fq000304/fq000304-req';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { EPayCardService } from '../shared/epay-card.service';
import { logger } from '@shared/util/log-util';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { DateCheckUtil } from '@shared/util/check/date-check-util';
import { FormateService } from '@shared/formate/formate.service';
import { TaiPowerService } from '../shared/taiPower.service';

@Component({
    selector: 'app-search-record-card',
    templateUrl: './search-record-card.component.html',
    styleUrls: ['./search-record-card.component.css']
})
export class SearchRecordCardComponent implements OnInit {

    //===================日期=====================//
    currentYear = new Date().getFullYear();    // 取得當下年份
    currentMonth = new Date().getMonth() + 1;  // 取得當下月份
    currentDay = new Date().getDate();         // 取得當下日期
    currentTime = this.currentYear + '/' + (this.currentMonth < 10 ? '0' + this.currentMonth : this.currentMonth) + '/' + (this.currentDay < 10 ? '0' + this.currentDay : this.currentDay);

    //===================日期 End=================//
    inp_data = {
        startDate: this.currentTime,
        endDate: this.currentTime,
        type: {},
        qrtype: ''
    };

    dateData = {
        year: '',
        month: '',
        date: '',
        dateformate: '',
        today: ''
    };
    show_date = {
        startDate: '',
        endDate: '',
    };

    qrTrnsType = [
        {
            Name: '全部',
            Type: '0'
        },
        {
            Name: '支付',
            Type: '1'
        },
        {
            Name: '轉帳購物',
            Type: '6'
        },
        {
            Name: '繳費',
            Type: '2'
        },
        {
            Name: '繳稅',
            Type: '3'
        },
        {
            Name: '轉帳',
            Type: '4'
        },
        {
            Name: '退貨',
            Type: '5'
        }
    ];

    onePage = true; // false時顯示查詢結果
    twoPage = true; // false時顯示查詢結果明細
    showQrcode = false; // true時顯示退款交易qrcode
    resultPage = false; // 結果頁
    resultData: any // 結果頁資料
    qrcode: string; // 儲存退款碼的qrcode
    barcode: string; // 儲存退款碼的brcode
    isCard = false; // 根據trunk程式判斷帳戶長度為13===信用卡 未來可能根據電文欄位判斷??
    details = [];
    taiPowerFee = [];//台電繳費結果明細
    taiPowerFeeresult = [];//台電繳費結果明細
    feeTypetoString = '';
    detail: any;
    hasData: boolean = true; // 是否有搜尋結果
    sortD: number = 0; // 排序交易日期
    sortA: number = 0; // 排序交易帳號
    sortDateSignal: string = '-';
    sortAcctSignal: string = '-';
    showQrBtn: boolean; // 是否顯示"出示退款碼"按鈕
    showBigQrCode: boolean = false; // 是否顯示大Qrcode
    showBigbarcode: boolean = false; // 是否顯示大barCode
    interval;
    timeLeft: number = 0; // 退款qrcode剩餘秒數
    timeoutSec: number = 180; // 退款qrcode倒數秒數
    checkSec: number = 20; // 多少秒數發一次電文
    queryMinDate; // 查詢最早時間(一年前)
    queryMaxDate; // 查詢最晚日期(今天)
    constructor(
        private fq000304: FQ000304ApiService,
        private auth: AuthService,
        private handleError: HandleErrorService,
        private alert: AlertService,
        private headerCtrl: HeaderCtrlService,
        private navigator: NavgatorService,
        private epayService: EPayCardService,
        private taiPowerService: TaiPowerService,
        private _formateService: FormateService
    ) { }

    ngOnInit() {
        this.inp_data.type = this.qrTrnsType[0];
        this.inp_data.qrtype = this.qrTrnsType[0].Type;
        // 取得查詢日期期間
        let dateObj: any = {
            baseDate: 'today', // 基礎日
            rangeType: 'M', // "查詢範圍類型" M OR D
            rangeNum: '12', // 查詢範圍限制
            rangeDate: '', // 比較日
            rangeBaseDate: '' // 當rangeType為自訂時，的基礎日期
        };
        let dateSet = DateCheckUtil.getDateSet(dateObj, 'strict');
        this.queryMinDate = dateSet.minDate.replace(/\//gi, '-');
        this.queryMaxDate = dateSet.maxDate.replace(/\//gi, '-');
    }

    // 點擊最近一週
    onWeek() {
        let dateObj: any = {
            baseDate: 'today', // 基礎日
            rangeType: 'D', // "查詢範圍類型" M OR D
            rangeNum: '7', // 查詢範圍限制
            rangeDate: '', // 比較日
            rangeBaseDate: '' // 當rangeType為自訂時，的基礎日期
        };
        let dateSet = DateCheckUtil.getDateSet(dateObj, 'strict');
        this.inp_data.startDate = dateSet.minDate;
        this.inp_data.endDate = dateSet.maxDate;
    }
    /**
     * 進入到查詢明細
     * @param detail 
     */
    twoPageChange(detail) {
        this.detail = detail;
        if (detail.feeType == '0') {
            this.feeTypetoString = '全國繳費網';
        } else if (detail.feeType == '1') {
            this.feeTypetoString = '汽燃費';
        } else if (detail.feeType == '2') {
            this.feeTypetoString = '台灣自來水費';
        } else if (detail.feeType == '3') {
            this.feeTypetoString = '電費';
        } else if (detail.feeType == '4') {
            this.feeTypetoString = '瓦斯費';
        } else if (detail.feeType == '5') {
            this.feeTypetoString = '中華電信費';
        } else {
            this.feeTypetoString = '';
        }

        if (detail.feeType == '3') {
            if (!!this.detail.feeType1) {
                this.taiPowerFee.push([this.feeTypetoStringfunction(this.detail.feeType1) + " " + this.taiPowerService.trnsDate(this.detail.billDate1)
                    , this.detail.chargeAmt1, this.detail.resultDesc1]);
            }
            if (!!this.detail.feeType2) {
                this.taiPowerFee.push([this.feeTypetoStringfunction(this.detail.feeType2) + " " + this.taiPowerService.trnsDate(this.detail.billDate2)
                    , this.detail.chargeAmt2, this.detail.resultDesc2]);
            }
            if (!!this.detail.feeType3) {
                this.taiPowerFee.push([this.feeTypetoStringfunction(this.detail.feeType3) + " " + this.taiPowerService.trnsDate(this.detail.billDate3)
                    , this.detail.chargeAmt3, this.detail.resultDesc3]);
            }
        }

        this.twoPage = false;
        this.resultPage = false;
        if (this.detail.trnsAcct.length == 13) {
            this.isCard = false;
        } else {
            this.isCard = true;
        }
        if (this.detail.mode == 0) {
            // 主掃只顯示 105 金融卡  (114為EMV信卡)
            this.showQrBtn = (detail.trnsType == '1' && detail.status == '0' && this.isCard == false) ? true : false;
        } else {
            // 被掃 105 114 都顯示
            this.showQrBtn = (detail.trnsType == '1' && detail.status == '0') ? true : false;
        }

        logger.debug(JSON.stringify(this.detail));
        this.headerCtrl.setLeftBtnClick(() => {
            this.backChange();
        }); // 從交易明細回到查詢
    }

    feeTypetoStringfunction(feeType) {
        if (feeType == "J") {
            return "線路設置費";
        } else if (feeType == "F") {
            return "接電費";
        } else if (feeType == "1") {
            return "電費";
        } else {
            return null;
        }
    }
    /**
     * 從交易明細回到查詢
     * @param detail 
     */
    backChange() {
        this.twoPage = true; // false時顯示交易明細
        this.onePage = false; // false時顯示查詢結果
        this.taiPowerFee = [];
        this.taiPowerFeeresult = [];
        this.headerCtrl.setLeftBtnClick(
            () => {
                this.navigator.push('epay-card');
            }
        );
    }

    // 點擊最近一個月
    onMonth() {
        let dateObj: any = {
            baseDate: 'today', // 基礎日
            rangeType: 'M', // "查詢範圍類型" M OR D
            rangeNum: '1', // 查詢範圍限制
            rangeDate: '', // 比較日
            rangeBaseDate: '' // 當rangeType為自訂時，的基礎日期
        };
        let dateSet = DateCheckUtil.getDateSet(dateObj, 'strict');
        this.inp_data.startDate = dateSet.minDate;
        this.inp_data.endDate = dateSet.maxDate;
    }

    sendFQ000304() {
        if (this.inp_data.startDate === '' || this.inp_data.endDate === '') {
            this.alert.show('尚未選擇查詢日期');
            return;
        }
        let checkDateStr = this.checkDate();
        if (checkDateStr.length > 0) {
            this.alert.show(checkDateStr);
            return;
        }
        // let form = new FQ000304ReqBody();
        // form.custId = this.auth.getCustId();
        // form.startDate = this._formateService.transDate(this.inp_data.startDate, 'yyyyMMdd');
        // form.endDate = this._formateService.transDate(this.inp_data.endDate, 'yyyyMMdd');
        // form.type = this.inp_data.qrtype;
        let form: any = {
            startDate: this.inp_data.startDate,
            endDate: this.inp_data.endDate,
            type: this.inp_data.qrtype
        };

        this.sortD = 0; // 排序交易日期
        this.sortA = 0; // 排序交易帳號
        this.sortDateSignal = '-';
        this.sortAcctSignal = '-';
        // console.error(this.inp_data.startDate, this.inp_data.endDate);
        this.show_date = {
            startDate: this._formateService.transDate(this.inp_data.startDate, 'date'),
            endDate: this._formateService.transDate(this.inp_data.endDate, 'date')
        };
        this.details = []; // reset data
        this.fq000304.send(form)
            .then(
                (fq000304res) => {
                    if (!!fq000304res.data) {
                        this.hasData = true;
                        this.details = fq000304res.data;
                        this.details.forEach((detail) => {
                            if (typeof detail.storeName == 'object') {
                                detail.storeName = '-';
                            }
                            detail['trnsAcct_trim'] = this.trimTrnsAcct(detail['trnsAcct']); // 在查詢結果只顯示交易帳號後六碼，並按照後六碼sort
                        });
                        this.sortTrnsDate(); // 查詢結果 - 初始以日期降冪排列

                    } else {
                        this.hasData = false;
                    }
                    this.resultPage = false;
                    this.onePage = false;

                }).catch(
                    (errorObj) => {
                        this.hasData = false;
                        errorObj['type'] = 'dialog';
                        this.handleError.handleError(errorObj);
                        // this.handleError.handleError({
                        //     type: 'dialog',
                        //     title: 'ERROR.TITLE',
                        //     content: '查無資料'
                        // });
                    });
    }

    onChange(e) {
        this.inp_data.qrtype = e.target.value;
    }


    /**
     * 從退款qrcode返回到交易明細
     */
    qrcodeToDetail() {
        clearTimeout(this.interval);
        this.showQrcode = false;
        this.twoPage = false;
        this.resultPage = false;
        this.headerCtrl.setLeftBtnClick(() => {
            this.backChange();
        }); // 從交易明細回到查詢
    }
    /**
     * 進入結果頁
     */

    /**
     * 從qrcode返回到查詢結果
     */
    qrcodeToResult() {
        clearTimeout(this.interval);
        this.showQrcode = false;
        this.resultPage = false;
        this.twoPage = true; // false時顯示交易明細
        this.onePage = false; // false時顯示查詢結果
        this.headerCtrl.setLeftBtnClick(
            () => {
                this.navigator.push('epay-card');
            }
        )
    }
    /**
     * 排序交易日期
     */
    sortTrnsDate() {
        if (this.sortD !== 0) { // 非第一次排序
            this.sortD *= -1;
            switch (this.sortD) {
                case 1:
                    this.sortDateSignal = '▲';
                    break;
                case -1:
                    this.sortDateSignal = '▼';
                    break;
            }
        } else { // 第一次排序
            this.sortD = -1;
            this.sortDateSignal = '▼';
        }
        this.sortAcctSignal = '-';
        this.details.sort((a, b) => (a.trnsDate > b.trnsDate) ? this.sortD : ((b.trnsDate > a.trnsDate) ? -this.sortD : 0));

    }

    /**
     * 排序交易帳號
     */
    sortTrnsAcct() {
        if (this.sortA !== 0) { // 非第一次排序
            this.sortA *= -1;
            switch (this.sortA) {
                case 1:
                    this.sortAcctSignal = '▲';
                    break;
                case -1:
                    this.sortAcctSignal = '▼';
                    break;
            }
        } else { // 第一次排序
            this.sortA = -1;
            this.sortAcctSignal = '▼';
        }
        this.sortDateSignal = '-';
        this.details.sort((a, b) => (a.trnsAcct_trim > b.trnsAcct_trim) ? this.sortA : (b.trnsAcct_trim > a.trnsAcct_trim) ? -this.sortA : 0);
    }

    /**
     * 測試商店在查詢結果最多顯示前八碼
     * @param storeName 測試商店string(from fq000304)
     */
    trimStoreName(storeName: string) {
        return storeName.substr(0, 8);
    }

    /**
     * 交易帳號在查詢結果顯示最後六碼
     * @param trnsAcct 交易帳號
     */
    trimTrnsAcct(trnsAcct: string) {
        return trnsAcct.substring(trnsAcct.length - 6, trnsAcct.length);
    }

    /**
     * 出示退款碼
     */
    showRefund() {
        let reqObj = {
            logId: this.detail.logId,
            mode: this.detail.mode // 被掃固定帶1
        }
        this.epayService.sendFQ000306(reqObj).then(
            (fq000306res) => {
                if (fq000306res['trnsRsltCode'] !== '0') {
                    this.alert.show('取得退款碼失敗').then(
                        () => {
                            this.backChange();
                        }
                    ).catch(
                        (err) => {
                            this.handleError.handleError(err);
                        }
                    );
                } else {
                    this.qrcode = fq000306res['qrcode'];
                    this.barcode = fq000306res['barcode'];
                    this.showQrcode = true;
                    this.resultPage = false;
                    this.timeLeft = this.timeoutSec; // 重設倒數秒數
                    this.interval = setInterval(() => {
                        if (this.timeLeft >= 0) {

                            this.timeLeft--;
                            // 發確認電文 307
                            if ((this.timeLeft % this.checkSec == 0) && (this.timeLeft > (this.checkSec - 1))) {
                                // 發307電文
                                this.checkBeScan(fq000306res['qrcodeSN']);

                            }
                        } else {
                            // TODO 強制返回查詢結果
                            this.alert.show('停留時間已經超過三分鐘囉，即將回到交易紀錄！如欲確認交易結果，請執行交易結果查詢進行確認');
                            clearTimeout(this.interval);
                            this.qrcodeToResult();
                        }
                    }, 1000);

                    this.headerCtrl.setLeftBtnClick(() => {
                        this.qrcodeToDetail();
                    });
                }
            }
        ).catch((errObj) => {

            this.handleError.handleError(errObj);
        });
    }

    checkBeScan(qrcodeSN) {

        this.epayService.sendFQ000307(qrcodeSN).then(
            (chkres) => {
                if (chkres['trnsRsltCode'] !== '2') {
                    // 資料整理
                    clearTimeout(this.interval);
                    this.resultData = this.epayService.doRsultData(chkres, this.detail);
                    this.showQrcode = false;
                    // 顯示結果頁
                    this.resultPage = true;
                }

            }, (error) => {
                this.alert.show(error.respCodeMsg).then(
                    () => {
                        this.backChange();
                    }
                ).catch(
                    (err) => {
                        this.handleError.handleError(err);
                    }
                );
            }
        );
    }
    /**
     * 查詢起訖日判斷
     */
    checkDate(): string {
        if (this.inp_data.startDate > this.inp_data.endDate) {
            return 'EPAY.SEARCH_RECORD.START_EXCEED_END'; // 查詢起日不可以大於查詢迄日
        }
        let dateObj: any = {
            baseDate: this.inp_data.endDate, // 基礎日
            rangeType: 'M', // "查詢範圍類型" M OR D
            rangeNum: '2', // 查詢範圍限制
            rangeDate: '', // 比較日
            rangeBaseDate: '' // 當rangeType為自訂時，的基礎日期
        };
        if (this.inp_data.startDate < DateCheckUtil.getDateSet(dateObj, 'strict').QuryLimt) {
            return 'EPAY.SEARCH_RECORD.INTERVAL_EXCEED_2M'; //資料查詢區間最大為2個月
        }
        return '';
    }
}
