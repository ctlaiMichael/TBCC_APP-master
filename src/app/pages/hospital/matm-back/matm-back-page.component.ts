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
import { Base64Util } from '@shared/util/formate/modify/base64-util';
// import { HandleErrorService } from '@service/global';

@Component({
    selector: 'app-matm-back-page',
    templateUrl: './matm-back-page.component.html',
    styleUrls: [],
    providers: [HospitalService]
})
export class MatmBackPageComponent implements OnInit {


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
    sucMsg = '';
    pageShow = false;
    resultObj = {};
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
        let url = '';
        this.route.queryParams.subscribe(params => {
            url = params.schemeData.substr(params.schemeData.indexOf('=') + 1, params.schemeData.length).replace("=", "%3D");

            this.cryptoService.Base64Decode(decodeURIComponent(url)).then(
                (result) => {
                    if (result.hasOwnProperty('value')) {
                      
                        this.payResult(result.value);
                    } else {
                        // plugin 無法正常解析自己轉
                        this.payResult(this.decodeb64(decodeURIComponent(url)));
                    }
                }
                ,
                (errorObj) => {
                    this._logger.log('Base64Encode errorObj', errorObj);
                    errorObj['type'] = 'message';
                    this._handleError.handleError(errorObj);
                }
            );
        });

    }
    /**
     * f2000205
     */
    payResult(decodeResult) {
        this._mainService.payResult(decodeResult).then(
            (res) => {
                this._logger.log('res', res);
                this.resultObj = res;
                this.pageShow = true;
            },
            (rej) => {
                rej['type'] = 'message';
                this._handleError.handleError(rej);
                this._logger.log('rej', rej);
            }
        )
    }

    goMenu() {
        this.navgator.push('insurance');
    }

    decodeb64(convertString) {
        let b64Array = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'];
        let orgstringObj = Array.from(convertString);
        let totalBiString = '';

        orgstringObj.map(
            (x: any) => {
                let b64ArrayNum = b64Array.indexOf(x);
                // console.log(b64ArrayNum);
                if (b64ArrayNum != -1) {
                    let biString = b64ArrayNum.toString(2);
                    // console.log(biString);
                    if (biString.length < 8) {

                        biString = this.padToSix(biString);
                    }
                    totalBiString = totalBiString + biString;

                } else {
                    totalBiString = totalBiString + '000000';
                }

            });

        // 8碼切轉10進位
        let cutNum = 8;
        let ascIItimes = (totalBiString.length / cutNum);
        let from = 0;
        let end = cutNum;
        let finalString = '';
        for (let i = 0; i < ascIItimes; i++) {
            let cutString = totalBiString.substring(from, end);
            // console.log(cutString);
            //2 轉 10
            let biToTen = parseInt(cutString, 2);
            // console.log(biToTen);

            from = end;
            end = from + cutNum;
            if (biToTen != 0) {
                let tenToChart = String.fromCharCode(biToTen);
                // console.log(tenToChart);
                finalString = finalString + tenToChart;
            }
        
        }
        return finalString;
        // console.log(finalString);
        // console.log(totalBiString);
    }

    padToSix(str) {
        let addnum = (6 - str.length);
        let padZero = ''
        for (let i = 0; i < addnum; i++) {
            padZero = padZero + '0';
        }
        let newStr = padZero + str;
        return newStr;
        
    }

 
}