/**
 * 基金申購(定期不定額)結果頁
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FundPurchaseRegularService } from '@pages/fund/shared/service/fund-purchase-regular.service';

@Component({
    selector: 'app-purchase-regular-not-result',
    templateUrl: './purchase-regular-not-result-page.component.html',
    styleUrls: [],
    providers: [FundPurchaseRegularService]
})
export class PurchaseRegularNotResultPageComponent implements OnInit {
    /**
      * 參數處理
      */
    @Input() setData: any;
    @Input() e;
    @Input() riskLvl;
    @Input() investAttribute: string; //客戶投資屬性 1:保守2:穩健3:積極
    @Input() fundSubject: any; //基金投資標的資訊
    @Input() serviceBranch: any; //服務分行， branchName: 服務分行名稱, unitCall: 服務分行電話, prospectus: 公開說明書取得方式，0:已取得並詳閱,1:已自行下載
    //okCode: Y:同意投資屬性低客戶購買高風險產品， N:不同意投資屬性低客戶購買高風險產品
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    //送fi000710 request用
    reqData = {
        custId: '',
        trnsToken: '',
        trustAcnt: '',
        fundCode: '',
        enrollDate: '',
        currency: '',
        amount: '',
        payAcnt: '',
        effectDate: '',
        baseRate: '',
        favorRate: '',
        serviceFee: '',
        fundType: '',
        investAttribute: '',
        riskLvl: '',
        okCode: '',
        prospectus: '',
        payDateS: '',
        salesId: '',
        salesName: '',
        introId: '',
        introName: '',
        branchName: '',
        unitCall: '',
        code: '',
        payDate31: '',
        payDate5W: '',
        notiCD: '',
        sLossCD: '',
        sLoss: '',
        sProCD: '',
        sPro: '',
        continue: '',
        decline1Cd: '',
        decline1: '',
        decline2Cd: '',
        decline2: '',
        decline3Cd: '',
        decline3: '',
        decline4Cd: '',
        decline4: '',
        decline5Cd: '',
        decline5: '',
        gain1Cd: '',
        gain1: '',
        gain2Cd: '',
        gain2: '',
        gain3Cd: '',
        gain3: '',
        gain4Cd: '',
        gain4: '',
        gain5Cd: '',
        gain5: ''
    };
    info_data: any = {};
    resTitle = '';
    trnsRsltCode = '';
    processing = true; //處理中
    sucess = false; //交易成功
    failed = false; //交易失敗
    failed_x = false;
    failed_1 = false;
    showBalanceLoss = '';
    showBalancePros = '';
    constructor(
        private _logger: Logger
        , private _headerCtrl: HeaderCtrlService
        , private _handleError: HandleErrorService
        , private _formateService: FormateService
        , private navgator: NavgatorService
        , private _mainService: FundPurchaseRegularService
    ) {

    }

    ngOnInit() {
        this._logger.log("line 43 setData:", this.setData);
        //塞request值
        this.reqData['trnsToken'] = this.setData['trnsToken'];
        this.reqData['trustAcnt'] = this.setData['trustAcnt'];
        this.reqData['fundCode'] = this.setData['fundCode'];
        this.reqData['enrollDate'] = this.setData['enrollDate'];
        this.reqData['currency'] = this.setData['currency'];
        this.reqData['amount'] = this.setData['amount'];
        this.reqData['payAcnt'] = this.setData['payAcnt'];
        this.reqData['effectDate'] = this.setData['effectDate'];
        this.reqData['baseRate'] = this.setData['baseRate'];
        this.reqData['favorRate'] = this.setData['favorRate'];
        this.reqData['serviceFee'] = this.setData['serviceFee'];
        this.reqData['fundType'] = this.serviceBranch['fundType'];
        this.reqData['investAttribute'] = this.investAttribute;
        this.reqData['riskLvl'] = this.riskLvl;
        this.reqData['okCode'] = this.serviceBranch['okCode'];
        this.reqData['prospectus'] = this.serviceBranch['prospectus'];
        this.reqData['payDateS'] = this.setData['payDateS'];
        this.reqData['salesId'] = this.setData['salesId'];
        this.reqData['salesName'] = this.setData['salesName'];
        this.reqData['introId'] = this.setData['introId'];
        this.reqData['introName'] = this.setData['introName'];
        this.reqData['branchName'] = this.serviceBranch['branchName'];
        this.reqData['unitCall'] = this.serviceBranch['unitCall'];
        this.reqData['code'] = this.setData['code'];
        this.reqData['payDate31'] = this.setData['payDate31'];
        this.reqData['payDate5W'] = this.setData['payDate5W'];
        this.reqData['notiCD'] = this.setData['notiCD'];
        this.reqData['sLossCD'] = this.setData['sLossCD'];
        this.reqData['sLoss'] = this.setData['sLoss'];
        this.reqData['sProCD'] = this.setData['sProCD'];
        this.reqData['sPro'] = this.setData['sPro'];
        this.reqData['continue'] = this.setData['continue'];
        this.reqData['decline1Cd'] = this.setData['decline1Cd'];
        this.reqData['decline1'] = this.setData['decline1'];
        this.reqData['decline2Cd'] = this.setData['decline2Cd'];
        this.reqData['decline2'] = this.setData['decline2'];
        this.reqData['decline3Cd'] = this.setData['decline3Cd'];
        this.reqData['decline3'] = this.setData['decline3'];
        this.reqData['decline4Cd'] = this.setData['decline4Cd'];
        this.reqData['decline4'] = this.setData['decline4'];
        this.reqData['decline5Cd'] = this.setData['decline5Cd'];
        this.reqData['decline5'] = this.setData['decline5'];
        this.reqData['gain1Cd'] = this.setData['gain1Cd'];
        this.reqData['gain1'] = this.setData['gain1'];
        this.reqData['gain2Cd'] = this.setData['gain2Cd'];
        this.reqData['gain2'] = this.setData['gain2'];
        this.reqData['gain3Cd'] = this.setData['gain3Cd'];
        this.reqData['gain3'] = this.setData['gain3'];
        this.reqData['gain4Cd'] = this.setData['gain4Cd'];
        this.reqData['gain4'] = this.setData['gain4'];
        this.reqData['gain5Cd'] = this.setData['gain5Cd'];
        this.reqData['gain5'] = this.setData['gain5'];
        this._logger.log("line 156 reqData:", this.reqData);
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'menu',
            'title': '基金定期不定額申購'
        });
    

        this._logger.log("line 167 reqData:", this.reqData);
        this._mainService.getPurchase_Result(this.reqData, this.e).then(
            (result) => {
                this.processing = false;
                this.sucess = true;
                this.failed = false;
                this.info_data = result.info_data;
                this.resTitle = result.hostCodeMsg;
                this.trnsRsltCode = result.trnsRsltCode;
                if (this.info_data['trnsRsltCode'] == '1' || this.info_data['trnsRsltCode'] == 'X') {
                    this.resTitle = result.hostCodeMsg;
                    this._headerCtrl.updateOption({
                        'leftBtnIcon': 'menu'
                    });
                    this.sucess = false;
                    this.failed = true;
                    if (this.info_data['trnsRsltCode'] == 'X') {
                        this._headerCtrl.updateOption({
                            'leftBtnIcon': 'menu'
                        });
                        this.failed_x = true;
                    } else {
                        this.failed_1 = true;
                    }
                }
                let sLossCD = this._formateService.checkField(this.info_data,'sLossCD');
                let sProCD = this._formateService.checkField(this.info_data,'sProCD');
                let sLoss = this._formateService.checkField(this.info_data,'sLoss');
                let sPro = this._formateService.checkField(this.info_data,'sPro');
               //處理用於畫面顯示之停損停利值
                if(sLoss!='') {
                    if(sLossCD!='-') {
                        this.showBalanceLoss = '+';
                    } else {
                        this.showBalanceLoss = '-';
                    }
                    this.showBalanceLoss += sLoss;
                } else {
                    this.showBalanceLoss = '--';
                }
                if(sPro!='') {
                    if(sProCD!='-') {
                        this.showBalancePros = '+';
                    } else {
                        this.showBalancePros = '-';
                    }
                    this.showBalancePros += sPro;
                } else {
                    this.showBalancePros = '--';
                }
            },
            (errorObj) => {
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
                this.navgator.push('fund');
            }
        );
    }

    //點擊確認
    sucessEnd() {
        this.navgator.push('fund');
    }

    //點擊返回行動網銀
    onHome() {
        this.navgator.push('home');
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
        let fundStatus: any;
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
            if (e.hasOwnProperty('fundStatus')) {
                fundStatus = e.fundStatus;
            }
        }
        this._logger.log("page:", page);
        this._logger.log("pageType:", pageType);
        this._logger.log("tmp_data:", tmp_data);
        this._logger.log("fundStatus:", fundStatus);
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
 * 失敗回傳
 * @param error_obj 失敗物件
 */
    onErrorBackEvent(error_obj) {
        const output = {
            'page': 'result',
            'type': 'error',
            'data': error_obj
        };
        this.errorPageEmit.emit(output);
    }

    // // --------------------------------------------------------------------------------------------
    // //  ____       _            _         _____                 _
    // //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    // //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    // //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    // //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // // --------------------------------------------------------------------------------------------

}
