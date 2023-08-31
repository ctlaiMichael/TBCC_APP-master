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
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { CommonUtil } from '@shared/util/common-util';
import { StringCheckUtil } from '@shared/util/check/string-check-util';
import { AmountUtil } from '@shared/util/formate/number/amount-util';
import { CheckService } from '@shared/check/check.service';
import { ChineseCheckUtil } from '@shared/util/check/word/chinese-check-util';
import { StartAppService } from '@lib/plugins/start-app/start-app.service';
import { CryptoService } from '@lib/plugins/crypto.service';
// import { HandleErrorService } from '@service/global';

@Component({
    selector: 'app-debit-card',
    templateUrl: './debit-card-page.component.html',
    styleUrls: [],
    providers: [HospitalService]
})
export class DebitCardPageComponent implements OnInit {


    reqData = {
        custId: '',
        hospitalId: '',
        branchId: '',
        refNo: '',
        amount: '',
        payDt: ''
    };
    hospitalName = '';

    errorMsg = {
        refNo: '',
        amount: ''
    };

    tmp_html='';
    constructor(
        private route: ActivatedRoute
        , private _logger: Logger
        , private _mainService: HospitalService
        , private router: Router
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private navgator: NavgatorService
        , private _formateService: FormateService
        , public authService: AuthService
        , private _errorCheck: CheckService
        , private startAppService: StartAppService
        , private cryptoService: CryptoService
    ) {
    }

    ngOnInit() {
        //取得上一頁帶過來的參數(url)
        this.route.queryParams.subscribe(params => {
            if (params.hasOwnProperty('hospitalId') && params.hasOwnProperty('branchId') && params.hasOwnProperty('hospitalName')) {
                // set data
                this.reqData.hospitalId = params.hospitalId; //接到傳參值(url)
                this.reqData.branchId = params.branchId;
                this.hospitalName = params.hospitalName;
                this._logger.log("reqData:", this.reqData);
                this._logger.log("params:", params);
            }
        });

    }

    /**
     * 返回上頁
     */
    cancel() {
        this.navgator.back();
    }


    /**
     * 檢核
     */
    checkEvent() {
        this.tmp_html='';
        //銷帳編號
        let checkSymbol = ChineseCheckUtil.checkChinese(this.reqData.refNo, 'no_symbol');  //符號
        let checkChinese = ChineseCheckUtil.notChinese(this.reqData.refNo);               //中文
        let checkEmptyRef = ObjectCheckUtil.checkEmpty(this.reqData.refNo);               //空
        if (!checkSymbol.status) {
            this.errorMsg.refNo = checkSymbol.msg;
        } else if (!checkChinese.status) {
            this.errorMsg.refNo = checkChinese.msg;
        } else if (!checkEmptyRef.status) {
            this.errorMsg.refNo = checkEmptyRef.msg;
        } else {
            this.errorMsg.refNo = '';
        }

        //金額
        const check_obj = this._errorCheck.checkMoney(this.reqData.amount, { 'currency': 'TWD' });//金額
        let checkEmptyAmount = ObjectCheckUtil.checkEmpty(this.reqData.refNo);               //空
        if (!check_obj.status) {
            this.errorMsg.amount = check_obj.msg;
        } else if (!checkEmptyAmount.status) {
            this.errorMsg.amount = checkEmptyAmount.msg;
        } else {
            this.errorMsg.amount = '';
        };

        if (this.errorMsg.amount == '' && this.errorMsg.refNo == '') {
            this.onDebitCard();
        }
    }
    /**
      *檢核後發電文
      */
    onDebitCard() {
        this._mainService.getDebitCard(this.reqData).then(
            (result) => {
                this._logger.log(result);
                this.onGoAtm(result.info_data);
            },
            (reject) => {
                reject['type'] = 'message';
                this._handleError.handleError(reject);
            }
        );
    }
    /**
     * 組xml格式
     */
    onGoAtm(set_data) {
        this.tmp_html ='';
        this.tmp_html += "<?xml version=\"1.0\" encoding=\"Big5\"?>";
        this.tmp_html += "<CardBillRq>";
        this.tmp_html += "<SendSeqNo>" + set_data.sendSeqNo + "</SendSeqNo>";
        this.tmp_html += "<TxType>" + set_data.txType + "</TxType>";
        this.tmp_html += "<PAYNO>" + set_data.payNo + "</PAYNO>";
        this.tmp_html += "<PayType>" + set_data.payType + "</PayType>";
        // this.tmp_html += "<UserData>"+this.hospitalName+"</UserData>";
        this.tmp_html += "<UserData></UserData>";
        this.tmp_html += "<ONO>" + set_data.refNo + "</ONO>";
        this.tmp_html += "<AcctIdTo>" + set_data.refNo + "</AcctIdTo>";
        this.tmp_html += "<CurAmt>" + set_data.amount + "</CurAmt>";
        this.tmp_html += "<PayDt>" + set_data.payDt + "</PayDt>";
        this.tmp_html += "<MAC>" + set_data.mac + "</MAC>";
        this.tmp_html += "<RsURL>iTCBLaunchFromPayBill://</RsURL>";//iTCBLaunchFromPayBill://String.format("%s://", 'iTCBLaunchFromATM') )
        this.tmp_html += "</CardBillRq>";
        this._logger.log('tmp_html', this.tmp_html);
    

        this.cryptoService.Base64Encode(this.tmp_html).then(
            (result) => {
              
                // let finalUrl = encodeURI(result.value);   //urlEncoding/
                let finalUrl = encodeURIComponent(result.value);   // urlEncoding
                this.startAppService.startAppParam('matm','debit',finalUrl);
                this.navgator.push('insurance');
            }
            ,
            (errorObj) => {
                this._logger.log('Base64Encode errorObj', errorObj);
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
            }
        );


    }

}