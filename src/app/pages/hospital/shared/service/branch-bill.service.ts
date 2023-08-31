/**
 *分院繳醫療費用(選單)Service
 */
import { Injectable, OnInit } from "@angular/core";
import { Logger } from '@core/system/logger/logger.service';
import { MathUtil } from 'app/shared/util/formate/number/math-util';
import { FH000201ApiService } from '@api/fh/fh000201/fh000201-api.service';
import { FH000201ReqBody } from '@api/fh/fh000201/fh000201-req';
import { FH000204ReqBody } from "@api/fh/fh000204/fh000204-req";
import { FH000204ApiService } from "@api/fh/fh000204/fh000204-api.service";
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { timeout } from 'rxjs/operators';
import { logger } from "@shared/util/log-util";
import { InAppBrowserService } from "@lib/plugins/in-app-browser/in-app-browser.service";
import { DeviceService } from "@lib/plugins/device.service";
import { JsonConvertUtil } from "@shared/util/json-convert-util";
import { HandleErrorService } from "@core/handle-error/handle-error.service";


@Injectable()
export class BranchBillService {
    constructor(
        private _logger: Logger,
        private fh000201: FH000201ApiService,
        private fh000204: FH000204ApiService,
        private http: HttpClient
        , private innerApp: InAppBrowserService
        , private deviceInfo: DeviceService
        , private _handleError: HandleErrorService
    ) { }

    error_msg = "";

    public getData(set_data: Object, channel): Promise<any> {
        this._logger.log("set_data6666:", set_data);
        // let reqData = new FH000201ReqBody();
        // this._logger.log("reqData1111111:",reqData);

        // reqData = set_data;
        // this._logger.log("reqData333333:",reqData);
        // let aaa = {};
        return this.fh000201.getData(set_data, channel).then(
            (sucess) => {
                this._logger.log(sucess);
                this._logger.log("SSSSSSSSSSSSSSS");
                return Promise.resolve(sucess);
            },
            (failed) => {
                this._logger.log(failed);
                this._logger.log("FFFFFFFFFFFFFFF");
                return Promise.reject(failed);
            }
        );
    }

    //檢核isPayable值，是否會勾選(顯示)
    public checkData(set_data: any) {
        set_data.forEach(item => {
            let checkitem = false;
            let disabledItem = false;
            if (item['isPayable'] == 2) {
                checkitem = true;
                disabledItem = true;
            } else if (item['isPayable'] == 1 || 0) {
                checkitem = false;
                disabledItem = true;
            }
            if (item['isPayable'] == "") {
                this.error_msg = "Empty";
            }
            item['showCheck'] = checkitem;
            item['showDisabled'] = disabledItem;
            this._logger.log("item:", item);
        });
        this._logger.log("set_data:", set_data);
        return set_data;
    }

    /**
 * [checkAmount 計算選取的帳單數]
 * @param  {[type]} data [所有繳費清單]
 * @param  {[type]} data_key  [指定資料]
 * @return {[type]}      [description]
 */
    public checkAmount(set_data) {
        let amountData = {
            count: 0,
            amount: 0,
            list: []
        };
        set_data.forEach(item => {
            if (item.showCheck == true) {
                amountData.count++;
                this._logger.log("item['amount']:", item['amount']);
                this._logger.log("typeof:", typeof item['amount']);
                if (amountData['amount'] == 0) {
                    amountData['amount'] = item['amount'];
                } else {

                    amountData['amount'] = MathUtil.sum(amountData['amount'], item['amount']);
                }
                // amountData['amount'] += parseInt(item['amount']);
            }
        });
        this._logger.log("amountData['amount']:", amountData['amount']);
        return amountData;
    }

    // //拿到203電文回傳的trnsToken
    // public getToken(): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         let output = {
    //             data: "",
    //             msg: ""
    //         };
    //         let telegram = {};
    //         telegram = { trnsToken: "8a80a7c72fb4d763012fb5053a000065" };
    //         if (telegram.hasOwnProperty("trnsToken") && !(telegram['trnsToken'] == "")) {
    //             output['data'] = telegram['trnsToken'];
    //         }
    //         if (output['data'] == "") {
    //             output['msg'] = "Empty!";
    //             reject(output);
    //             return false;
    //         }
    //         resolve(output);
    //         this._logger.log("output:",output);
    //         this._logger.log("output['data']:",output['data']);
    //     });
    // }




    //--------------branchBill驗證程式-------------------

    //檢測公司統編8碼
    checkCompanyNo(setData) {
        this._logger.log("into wwu check_companyNo");
        let output = {
            status: false,
            msg: 'CHECK.COMPANY_NO',
            data: setData
        };
        let checkCompany = /^[0-9]{8}$/;
        if (checkCompany.test(setData)) {
            output.status = true;
        } else {
            output.status = false;
        }
        return output;
    }


    /**
* [checkIdentity 車牌檢查]
* @param  {string} identity [車牌檢查]
* @return {obj}	{status:blooean,msg:'error msg'}
*/

    //****車牌尚未完成
    checkLicenseNo(licenseNo) {
        let data = {
            status: false,
            msg: 'CHECK.LICENSE_PLATE',
            data: ''
        };
        if (licenseNo === '') {
            data.status = false;
            return data;
        } else {
            licenseNo = licenseNo.toUpperCase();
            data.data = licenseNo;
            data.status = true;
            return data;
        }
    }





    //--------------FH000204-金融卡繳費銷帳編號資訊查詢_繳費單-------------------

	/**
	 * FH000204-金融卡繳費銷帳編號資訊查詢_繳費單
	 */
    getDebitCardNumber(set_data): Promise<any> {
        let reqData = new FH000204ReqBody();
        this._logger.log('set_data', set_data);
        if (set_data.hasOwnProperty('hospitalId') && set_data.hasOwnProperty('branchId')) {
            reqData = {
                custId: '',
                hospitalId: set_data.hospitalId,
                branchId: set_data.branchId,
                personId: set_data.personId,
                totalCount: set_data.totalCount,
                totalAmount: set_data.totalAmount,
                queryTime: set_data.dateTime,
                details: set_data.details
            };
        }

        return this.fh000204.getData(reqData).then(
            (sucess) => {
                return Promise.resolve(sucess);
            },
            (failed) => {
                return Promise.reject(failed);
            }
        );
    }

    //旺旺存參數進section，hospitalAp
    getWwuHospitalAp(setData?) {
        let url = environment.SERVER_URL;
        if (environment.PRODUCTION) {
            url = url.replace('NMobileBank', '');
        } else {
            url = url.replace('MobileBankDev_P4', '');
        }
        url  += 'MobileHospital/AppInfoToWeb';
        let url_params = [];
        this.deviceInfo.devicesInfo().then(
            (deviceData) => {
                let reqHeader = JsonConvertUtil.setTelegramHeader(deviceData);
                url_params.push('appVersion='+ reqHeader.appVersion);

                url += '?' + url_params.join('&');
                let inAppBrowserRef: any = this.innerApp.open(url, '_blank');
                if (inAppBrowserRef) {
                    inAppBrowserRef.addEventListener('loadstart', (res) => {
                        console.log("into inAppBrowser loadstart");
                        console.log("into inAppBrowser loadstart,res:",res);
                    });

                    inAppBrowserRef.addEventListener('loadstop', (res) => {
                        console.log("into inAppBrowser loadstop");
                        console.log("into inAppBrowser loadstop,res:",res);
                    });
                
                    inAppBrowserRef.addEventListener('loaderror', (res) => {
                        console.log("into inAppBrowser loaderror");
                        console.log("into inAppBrowser loaderror,res:",res);
                    });
                
                    inAppBrowserRef.addEventListener('beforeload', (res) => {
                        console.log("into inAppBrowser beforeload");
                        console.log("into inAppBrowser beforeload,res:",res);
                    });
                
                    inAppBrowserRef.addEventListener('message', (res) => {
                        console.log("into inAppBrowser message");
                        console.log("into inAppBrowser message,res:",res);
                    });
                }
            }
        ).catch((err) => {
            // show error
            this._handleError.handleError(err);
        });

        // http://210.200.4.11/MobileHospital/AppInfoToWeb
        // ?appVersion=3.02.1510
        // &osType=01
        // &hospitalId=WWU
        // &branchId=00
        // &ipAddress=10.4.0.108
        // &mobileNo=351554051186907
        // &note3=%E9%86%AB%E7%99%82%E8%B2%BB%E7%94%A8%E9%A0%81%E6%96%87%E6%A1%88%E6%B8%AC%E8%A9%A6
        // &hospitalName=%E9%95%B7%E5%BA%9A%E9%86%AB%E9%99%A2
        // &eBillTrns=Y
        // &intraBankTrns=Y
        // &eBillTrns=Y
        // &icCardTrns=Y
        // &canOpenmATM=Y
        // &channel=2
        // &custId=A123456789
        // &creditCardTrns=Y
        // &creditNoticeUrl=http://210.200.4.11/MobileBankDev_P2/AppView/msg/FH000302_WWU.html


        // if (environment.NATIVE) {
        //     this._logger.log("into native");
        //     // return cordova.InAppBrowser.open('http://210.200.4.11/MobileHospital/AppInfoToWeb?appVersion=3.02.1510&osType=01&hospitalId=WWU&branchId=00&ipAddress=10.4.0.108&mobileNo=351554051186907&note3=%E9%86%AB%E7%99%82%E8%B2%BB%E7%94%A8%E9%A0%81%E6%96%87%E6%A1%88%E6%B8%AC%E8%A9%A6&hospitalName=%E9%95%B7%E5%BA%9A%E9%86%AB%E9%99%A2&eBillTrns=Y&intraBankTrns=Y&eBillTrns=Y&icCardTrns=Y&canOpenmATM=Y&channel=2&custId=A123456789&creditCardTrns=Y&creditNoticeUrl=http://210.200.4.11/MobileBankDev_P2/AppView/msg/FH000302_WWU.html');
        // } else {
        //     this._logger.log("into not native")
        //     window.open("http://210.200.4.11/MobileHospital/hospital/payment/paymentlist.faces?appVersion=3.02.1510&osType=01&hospitalId=WWU&branchId=00&ipAddress=10.4.0.108&mobileNo=351554051186907&note3=醫療費用頁文案測試&hospitalName=旺旺友聯產險&eBillTrns=Y&intraBankTrns=Y&eBillTrns=Y&icCardTrns=Y&canOpenmATM=Y&channel=2&custId=A123456789&creditCardTrns=Y&creditNoticeUrl=http://210.200.4.11/MobileBankDev_P2/AppView/msg/FH000302_WWU.html");
        //     // return true;http://210.200.4.11/MobileHospital/AppInfoToWeb?appVersion=3.02.1510&osType=01&hospitalId=WWU&branchId=00&ipAddress=10.4.0.108&mobileNo=351554051186907&note3=%E9%86%AB%E7%99%82%E8%B2%BB%E7%94%A8%E9%A0%81%E6%96%87%E6%A1%88%E6%B8%AC%E8%A9%A6&hospitalName=%E9%95%B7%E5%BA%9A%E9%86%AB%E9%99%A2&eBillTrns=Y&intraBankTrns=Y&eBillTrns=Y&icCardTrns=Y&canOpenmATM=Y&channel=2&custId=A123456789&creditCardTrns=Y&creditNoticeUrl=http://210.200.4.11/MobileBankDev_P2/AppView/msg/FH000302_WWU.html
        // }

        // this._logger.log("setData:",setData);
        // let HospitalApUrl = '';
        // HospitalApUrl = 'http://210.200.4.11/MobileHospital/hospital/payment/paymentlist.faces?appVersion=3.02.1510&osType=01&hospitalId=WWU&branchId=00&ipAddress=10.4.0.108&mobileNo=351554051186907&note3=醫療費用頁文案測試&hospitalName=旺旺友聯產險&eBillTrns=Y&intraBankTrns=Y&eBillTrns=Y&icCardTrns=Y&canOpenmATM=Y&channel=2&custId=A123456789&creditCardTrns=Y&creditNoticeUrl=http://210.200.4.11/MobileBankDev_P2/AppView/msg/FH000302_WWU.html';
        // return this.http.post(
        //     HospitalApUrl,
        //     JSON.stringify(setData),
        //     {

        //     }
        // ).pipe(timeout(environment.HTTP_TIMEOUT)).toPromise()
        // .then((res) => {
        //     this._logger.warn('Hospital back', res);
        // })
        // .catch((err) => {
        //     this._logger.warn('Hospital error', err);

        // });
    }
}

