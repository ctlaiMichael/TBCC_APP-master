
/**
 * Header
 * 
 * 醫院清單Service
 * FH000301-醫院清單查詢     getData()
 * FH000302-醫院__定查詢     getMoreData()
 * 
 */
import { Injectable } from "@angular/core";
import { FH000301ApiService } from "@api/fh/fh000301/fh000301-api.service";
import { FH000302ApiService } from '@api/fh/fh000302/fh000302-api.service';
import { CacheService } from "@core/system/cache/cache.service";
import { FH000207ApiService } from '@api/fh/fh000207/fh000207-api.service';
import { FH000207ReqBody } from '@api/fh/fh000207/fh000207-req';

import { FH000204ApiService } from '@api/fh/fh000204/fh000204-api.service';
import { FH000204ReqBody } from '@api/fh/fh000204/fh000204-req';

import { Logger } from '@core/system/logger/logger.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FH000205ApiService } from "@api/fh/fh000205/fh000205-api.service";
import { FH000205ReqBody } from "@api/fh/fh000205/fh000205-req";
import { environment } from "@environments/environment";
import { DeviceService } from "@lib/plugins/device.service";
import { JsonConvertUtil } from "@shared/util/json-convert-util";
import { InAppBrowserService } from "@lib/plugins/in-app-browser/in-app-browser.service";
import { HandleErrorService } from "@core/handle-error/handle-error.service";
import { FormateService } from "@shared/formate/formate.service";
import { AuthService } from "@core/auth/auth.service";

@Injectable()

export class HospitalService {

	// 判斷所選為 醫療服務或產壽險服務
	reqData = {
		type: ""
	}

	constructor(
		private _logger: Logger,
		private fh000301: FH000301ApiService,
		private fh000302: FH000302ApiService,
		private fh000204: FH000204ApiService,
		private fh000205: FH000205ApiService,
		private fh000207: FH000207ApiService,
		private deviceInfo: DeviceService,
		private innerApp: InAppBrowserService,
		private _handleError: HandleErrorService,
		private _formateService: FormateService,
		private authService: AuthService,
		private _cacheService: CacheService) { }


	/**
	 * 取得醫院資料
	 * FH000301-醫院清單查詢電文
	 * @param set_type 
	 */

	getData(set_type: string): Promise<any> {
		let request_type = (set_type == 'insurance') ? "2" : "1";
		this.reqData.type = request_type;
		let option = {
			'background': false,
			'reget': false
		}

		const cache_key = set_type;
		const cache_check = this._cacheService.checkCacheSet(option);
		if (cache_check.reget) {
			// 強制取得最新的
			this._cacheService.remove(cache_key);
		} else {
			// 取cache
			const cache_data = this._cacheService.load(cache_key);
			if (cache_data) {
				return Promise.resolve(cache_data);
			}
		}

		return this.fh000301.getData(this.reqData).then(
			(sucess) => {
				let cache_option = this._cacheService.getCacheSet(cache_key);
				this._cacheService.save(cache_key, sucess, cache_option);
				return Promise.resolve(sucess);
			},
			(errorObj) => {
				return Promise.reject(errorObj);
			}
		);
	}









	//============================================================================

	/**
	 * 取得分院資料(包含醫療資訊、費用)
	 * FH000302-醫院__定查詢
	 * @param set_data 
	 */
	public getMoreData(set_data, type): Promise<any> {

		let main_cache_key = '';
		if (type == '1') {
			main_cache_key = 'hosptial';
		} else {
			main_cache_key = 'insurance';
		}

		let cache_key = main_cache_key + '@' + set_data.hospitalId + set_data.branchId;
		let option = {
			'background': false,
			'reget': false
		}
		const cache_check = this._cacheService.checkCacheSet(option);
		if (!cache_check.reget) {
			// 背景取得，首頁請求，取cache
			const cache_data = this._cacheService.load(cache_key);
			// 取cache
			if (cache_data) {
				return Promise.resolve(cache_data);
			}
		} else {
			this._cacheService.removeGroup(main_cache_key);
		}

		return this.fh000302.getBranch(set_data).then(
			(sucess) => {
				let cache_option = this._cacheService.getCacheSet(cache_key);
				this._cacheService.save(cache_key, sucess, cache_option);
				return Promise.resolve(sucess);
			},
			(failed) => {
				return Promise.reject(failed);
			}
		);
	}



	/**
	 * FH000204-金融卡繳費銷帳編號資訊查詢_繳費單
	 */
	getDebitCardNumber(set_data): Promise<any> {
		let reqData = new FH000204ReqBody();
		if (set_data.hasOwnProperty('hospitalId') && set_data.hasOwnProperty('branchId')) {
			reqData = {
				custId: '',
				hospitalId: set_data.hospitalId,
				branchId: set_data.branchId,
				personId: '',
				totalCount: '',
				totalAmount: '',
				queryTime: '',
				details: [

				]
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





	/**
	 * FH000207-金融卡繳費資訊查詢_繳費單
	 */
	getDebitCard(set_data): Promise<any> {
		let reqData = new FH000207ReqBody();
		if (set_data.hasOwnProperty('hospitalId') && set_data.hasOwnProperty('branchId') &&
			set_data.hasOwnProperty('refNo') && set_data.hasOwnProperty('amount')) {
			reqData = {
				custId: '',
				hospitalId: set_data.hospitalId,
				branchId: set_data.branchId,
				refNo: set_data.refNo,
				amount: set_data.amount,
				payDt: ''
			};
		}


		return this.fh000207.getData(reqData).then(
			(sucess) => {
				return Promise.resolve(sucess);
			},
			(failed) => {
				return Promise.reject(failed);
			}
		);
	}


	/**
	 * FH000205-金融卡繳費結果通知 (不需登入)
	 */

	payResult(set_data): Promise<any> {

		let reqData = new FH000205ReqBody();

		let parser = new DOMParser();
		let doc = parser.parseFromString(set_data, "text/xml");
		if (doc.getElementsByTagName('RC')[0] != undefined) {
			let resultCode = doc.getElementsByTagName('RC')[0].childNodes[0].nodeValue;
			if (resultCode == '000' || resultCode == '0000' || resultCode == '4001' || resultCode == '4002') {
				reqData = {
					custId: '',
					sendSeqNo: doc.getElementsByTagName('SendSeqNo')[0].childNodes[0] ? doc.getElementsByTagName('SendSeqNo')[0].childNodes[0].nodeValue : "",
					refNo: doc.getElementsByTagName('ONO')[0].childNodes[0] ? doc.getElementsByTagName('ONO')[0].childNodes[0].nodeValue : "",
					rcode: doc.getElementsByTagName('RC')[0].childNodes[0] ? doc.getElementsByTagName('RC')[0].childNodes[0].nodeValue : "",
					rcMsg: doc.getElementsByTagName('MSG')[0].childNodes[0] ? doc.getElementsByTagName('MSG')[0].childNodes[0].nodeValue : "",
					bankIdFrom: doc.getElementsByTagName('BankIdFrom')[0].childNodes[0] ? doc.getElementsByTagName('BankIdFrom')[0].childNodes[0].nodeValue : "",
					acctIdFrom: doc.getElementsByTagName('AcctIdFrom')[0].childNodes[0] ? doc.getElementsByTagName('AcctIdFrom')[0].childNodes[0].nodeValue : "",
					trnsDt: doc.getElementsByTagName('TrnDt')[0].childNodes[0] ? doc.getElementsByTagName('TrnDt')[0].childNodes[0].nodeValue : "",
					dueDt: doc.getElementsByTagName('DueDt')[0].childNodes[0] ? doc.getElementsByTagName('DueDt')[0].childNodes[0].nodeValue : "",
					txnSeqNo: doc.getElementsByTagName('TxnSeqNo')[0].childNodes[0] ? doc.getElementsByTagName('TxnSeqNo')[0].childNodes[0].nodeValue : "",
					payTxnFee: doc.getElementsByTagName('PayTxnFee')[0].childNodes[0] ? doc.getElementsByTagName('PayTxnFee')[0].childNodes[0].nodeValue : "",
					mac: doc.getElementsByTagName('MAC')[0].childNodes[0] ? doc.getElementsByTagName('MAC')[0].childNodes[0].nodeValue : ""
				};

			} else {
				let output = {
					msg: '交易失敗（' + doc.getElementsByTagName('RC')[0].childNodes[0].nodeValue + ')',
					status: false
				}
				return Promise.reject(output);
			}
		} else {
			let output = {
				msg: '交易失敗(參數解析錯誤)',
				status: false
			}
			return Promise.reject(output);
		}


		return this.fh000205.getData(reqData).then(
			(sucess) => {
				return Promise.resolve(sucess);
			},
			(failed) => {
				return Promise.reject(failed);
			}
		);
	}

	//旺旺存參數進section，hospitalAp
	getWwuHospitalAp(setData, matm) {
		this._logger.log("into hospital setData:", setData);
		let url = environment.SERVER_URL;
		if (environment.PRODUCTION) {
			url = url.replace('NMobileBank', '');
		} else {
			url = url.replace('MobileBankDev_P4', '');
		}
		url += 'MobileHospital/AppInfoToWeb';
		let url_params = [];
		this.deviceInfo.devicesInfo().then(
			(deviceData) => {
				let reqHeader = JsonConvertUtil.setTelegramHeader(deviceData);
				url_params.push('appVersion=' + reqHeader.appVersion);
				url_params.push('osType=' + reqHeader.osType);
				url_params.push('hospitalId=' + this._formateService.checkField(setData, 'hospitalId'));
				url_params.push('branchId=' + this._formateService.checkField(setData, 'branchId'));
				url_params.push('ipAddress=' + reqHeader.ipAddress);
				url_params.push('mobileNo=' + reqHeader.mobileNo);
				url_params.push('note3=' + this._formateService.checkField(setData, 'note3'));
				url_params.push('hospitalName=' + this._formateService.checkField(setData, 'hospitalName'));
				url_params.push('intraBankTrns=' + this._formateService.checkField(setData, 'intraBankTrns'));
				url_params.push('icCardTrns=' + this._formateService.checkField(setData, 'icCardTrns'));
				url_params.push('eBillTrns=' + this._formateService.checkField(setData, 'eBillTrns'));
				if (matm == false) {
					url_params.push('canOpenmATM=' + 'N');
				} else {
					url_params.push('canOpenmATM=' + 'Y');
				}
				url_params.push('channel=' + '2');
				url_params.push('custId=' + this.authService.getCustId());
				url_params.push('creditCardTrns=' + this._formateService.checkField(setData, 'creditCardTrns'));
				url_params.push('creditNoticeUrl=' + this._formateService.checkField(setData, 'creditNoticeUrl'));
				url += '?' + url_params.join('&');
				this._logger.log("hospital url:", url);
				this.innerApp.open(url, '_blank');
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