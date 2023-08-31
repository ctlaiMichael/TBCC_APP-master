/**
 * Header
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TaxesService } from '@pages/taxes/shared/service/taxes.service.ts';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { CheckService } from '@shared/check/check.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FuelFeeService } from '../shared/service/fuel-fee.service';
import { ActivatedRoute } from '@angular/router';
import { FormateService } from '@shared/formate/formate.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { PadUtil } from '@shared/util/formate/string/pad-util';
import { AlertService } from '@shared/popup/alert/alert.service';

@Component({
	selector: 'app-taxes-detail-page',
	templateUrl: './taxes-detail-page.component.html',
	styleUrls: [],
	providers: [TaxesService, FuelFeeService]
})
export class TaxesDetailPageComponent implements OnInit {

	@Input() taxesData: any;             // 使用者所選之稅款明細，也是f7000103-request所需資料。
	@Input() FuelFeeToConfirm: any       // 汽機車燃料使用費確認頁專用
	@Output() backToFirst: EventEmitter<any> = new EventEmitter<any>();    // 返回編輯頁

	/**
	 * 參數設定
	 */

	info_data = {};              // F7000103-所有資料
	trnsfrOutAccnt = [];         // 轉出帳號
	taxesList = [];              // 可繳交稅款列表
	today = '';                  // 當下日期
	defaultAcctNoFlag = true;   // 轉出帳號預設判斷
	defaultPayCategorys = true; // 繳款類別僅有一組時，預設該類別。
	taxesDetail = {              // 所選之稅款明細
		atmCode: '',
		subName: ''
	};

	/** 稅款開徵起訖日判斷 start */
	isInTime = true;        // 所選稅款是否在開徵起訖期間
	taxPayment = false;
	startD = '0101';       // 開徵起日
	endD = '1231';         // 開徵迄日
	currentDay = '';
	/** 稅款開徵起訖日判斷 end   */

	/**
	 * 各類稅款(不含汽機車燃料使用費)
	 * 編輯頁繳納截止日 YYMMDD(080704)
	 * 確認頁繳納截止日 YYYY/MM/DD
	 * 因轉換不易，故把編輯頁繳納截止日存於這。
	 */
	payEndDate = '';

	// 繳稅頁面切換 ('original':原始繳費頁，'confirm':確認頁，'result':結果頁)
	showPage = 'original';
	type_name = '';

	/**
	 * 汽機車燃料使用費為特規，欄位顯示與其他稅款不同，
	 * 故設置專屬flag，預設關閉。
	 */

	fuelFee = 'close';
	taxesAtmCode = [];
	allFuelFee = {
		trnsfrOutAccnt: '',
		payCategory: '',
		payNo: '',
		payEndDate: '',
		trnsfrAmount: '',
		businessType: '',
		taxType: '',
		trnsToken: '',
		SEND_INFO: '',
		USER_SAFE: '',
		identificationCode: ''
	};

	// 編輯頁全部資料送至確認頁(f7000101)
	allTaxesData = {
		trnsfrOutAccnt: '',
		payCategory: '',
		payNo: '',
		payEndDate: '',
		trnsfrAmount: '',
		businessType: '',
		taxType: '',
		trnsToken: '',
		SEND_INFO: '',
		USER_SAFE: ''
	};

	// 結果頁全部資料
	taxesResultData = {};

	// 將所有的錯誤資訊存入
	errorMsg = {
		trnsfrOutAccnt: '',
		payCategory: '',
		payNo: '',
		payEndDate: '',
		trnsfrAmount: '',
		taxType: '',
	};

	// 安控機制
	transactionObj = {
		serviceId: 'F7000101',
		categoryId: '2',
		transAccountType: '2'
	};

	// 金額檢核必要參數
	currency = {
		currency: 'TWD'
	}

	constructor(
		private _mainService: TaxesService,
		private _otherService: FuelFeeService,
		private _headerCtrl: HeaderCtrlService,
		private confirm: ConfirmService,
		private navgator: NavgatorService,
		private _errorCheckService: CheckService,
		private _handleError: HandleErrorService,
		private route: ActivatedRoute,
		private _formateService: FormateService,
		private _uiContentService: UiContentService,
		private alert: AlertService
	) { }

	ngOnInit() {
		// 判斷所選稅款是否超出開徵起.迄日
		this.isInTime = this.CheckDateIsOver(this.taxesData.startDate, this.taxesData.endDate);
		if (this.isInTime) {
			this.getData();
		} else {
			this.navgator.push('taxes-fees')
			this.alert.show('PG_TAX.COMMON.OUTOFTIME', {
				title: '提醒您'
			}).then(
				() => {
					//確定
					// this.backToFirst.emit({
					// 	type: 'goOriginal',
					// 	value: true
					// });
				}
			);
		}
		this._headerCtrl.updateOption({
			'title': '繳納稅款'
		});
		this._headerCtrl.setLeftBtnClick(() => {
			this.cancelEdit();
		});
	}

	// 跳出popup是否返回
	cancelEdit() {
		//取得帶過來的參數(url)
		this.route.queryParams.subscribe(params => {
			this.type_name = this._formateService.checkField(params, "type");
		});
		this.confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
			title: '提醒您'
		}).then(
			() => {
				//確定
				if (this.fuelFee == 'open' && this.type_name == 'fuel-fee') {
					this.navgator.push('taxes-fees');
				} else {
					this.backToFirst.emit({
						type: 'goOriginal',
						value: true
					});
				}
			},
			() => {
			}
		);
	}


	/**
	 * 改變select選擇時
	 * @param menu
	 */
	onChangeType(menu?: any) {
		// if (typeof menu !== 'undefined') {
		// 	this.trnsfrOutAccnt = menu;
		// }
		if (this.allTaxesData['trnsfrOutAccnt'] != '') {
			this.errorMsg['trnsfrOutAccnt'] = '';
		}
	}

	/**
	 * 改變select選擇時
	 * @param menu
	 */
	payCategoryChange(menu?: any) {
		// if (typeof menu !== 'undefined') {
		// 	this.acctNo = menu;
		// }
		if (this.allTaxesData['payCategory'] != '') {
			this.errorMsg['payCategory'] = '';
		}
	}

	/**
	 * taxesData 存有f7000103所需之request資料
	 * 
	 */
	getData(): Promise<any> {
		return this._mainService.getAccountData(this.taxesData).then(
			(result) => {
				this.info_data = result.info_data;

				//----20190907 Boy 判斷是否有扣款帳號-----//
				this.trnsfrOutAccnt = result.trnsOutAccts;
				this.onChangeType(this.trnsfrOutAccnt[0]);
				if (this.trnsfrOutAccnt.length <= 0) {
					this._handleError.handleError({
						type: 'message',
						title: 'POPUP.NOTICE.TITLE',
						content: "PG_TAX.ERROR.TRNSFROUTACCNT_3",
						classType: "warning"
					});
					return false;
				} else if (this.trnsfrOutAccnt.length == 1) {
					this.allTaxesData.trnsfrOutAccnt = this.trnsfrOutAccnt[0].acctNo;
					this.defaultAcctNoFlag = false;
					this.onChangeType(this.allTaxesData.trnsfrOutAccnt);
				}
				//------------------------------------//

				this.taxesList = result.taxesList;
				if (this.taxesList.length == 1) {
					this.defaultPayCategorys = false;
					this.allTaxesData.payCategory = this.taxesList[0].atmCode + '-' + this.taxesList[0].subName;
					this.payCategoryChange(this.allTaxesData.payCategory);
				} else {
					this.payCategoryChange(this.taxesList);
				}
				this.onChangeType(this.trnsfrOutAccnt[0]);

				// 將可選atmCode都存入此物件
				this.taxesList.forEach(element => {
					this.taxesAtmCode[element.atmCode] = [element.subName];
				});

				// 汽機車燃料使用費判斷，是的話頁面切換。
				if (this.taxesAtmCode["40005"]) {
					this.fuelFee = 'open';
					this.transactionObj = {
						serviceId: 'F7001101',
						categoryId: '2',
						transAccountType: '2'
					};
				} else {
					this.fuelFee = 'close';
				}
			},
			(errorObj) => {
				errorObj['type'] = 'dialog';
				this._handleError.handleError(errorObj);
			}
		);
	}


	/**
	 * taxesData 存有f7000103所需之request資料
	 * 與getData相同，但給汽機車燃料使用費專屬
	 */
	getFuelFeeData(taxData?: any): Promise<any> {
		return this._mainService.getAccountData(taxData).then(
			(result) => {
				this.info_data = result.info_data;
				this.trnsfrOutAccnt = result.trnsOutAccts;
				if (this.trnsfrOutAccnt.length == 1) {
					this.allTaxesData.trnsfrOutAccnt = this.trnsfrOutAccnt[0].acctNo;
					this.defaultAcctNoFlag = false;
				}
				this.taxesList = result.taxesList;
				this.onChangeType(this.trnsfrOutAccnt);
				this.payCategoryChange(this.taxesList);

				// 將可選atmCode都存入此物件
				this.taxesList.forEach(element => {
					this.taxesAtmCode[element.atmCode] = [element.subName];
				});
				// 汽機車燃料使用費判斷，是的話頁面切換。
				if (this.taxesAtmCode["40005"]) {
					this.fuelFee = 'open';
					this.transactionObj = {
						serviceId: 'F7001101',
						categoryId: '2',
						transAccountType: '2'
					};
				} else {
					this.fuelFee = 'close';
				}
			},
			(errorObj) => {
				errorObj['type'] = 'dialog';
				this._handleError.handleError(errorObj);
			}
		);
	}



	/**
	 * 銷帳編號檢核
	 * 最多16位'數字'
	 * @param str 
	 */

	checkPayNo(str: string) {
		let data = {
			status: false,
			msg: 'PG_TAX.ERROR.PAYNO_1',
			data: ''
		};

		if (typeof str !== 'string') {
			return data;
		}

		let res = /^\d{16}$/; // 檢查16碼純數值
		if (str.length < 16 && str != '' && !res.test(str)) {
			data.msg = 'PG_TAX.ERROR.PAYNO_2'
		}
		if (res.test(str)) {
			data.status = true;
			data.msg = '';
			return data;
		}
		data.data = str;
		return data;
	}


	/**
	 * 截止日檢核
	 * 最多6位'數字'
	 * @param str 
	 */

	checkPayEndDate(str: string) {
		let data = {
			status: false,
			msg: 'PG_TAX.ERROR.PAYENDDATE_1',
			data: ''
		};

		if (typeof str !== 'string') {
			return data;
		}

		let res = /^\d{6}$/; // 檢查6碼純數值
		if (str.length < 6 && str != '' && !res.test(str)) {
			data.msg = 'PG_TAX.ERROR.PAYENDDATE_2'
		}
		if (res.test(str)) {
			data.status = true;
			data.msg = '';
			return data;
		}
		data.data = str;
		return data;
	}

	/**
	 * 截止日檢核
	 * 最多8位'數字'
	 * @param str 
	 */

	checkPayEndDate_FuelFee(str: string) {
		let data = {
			status: false,
			msg: 'PG_TAX.ERROR.PAYENDDATE_1',
			data: ''
		};

		if (typeof str !== 'string') {
			return data;
		}

		let res = /^\d{8}$/; // 檢查8碼純數值
		if (str.length < 8 && str != '' && !res.test(str)) {
			data.msg = 'PG_TAX.ERROR.PAYENDDATE_3'
		}
		if (res.test(str)) {
			data.status = true;
			data.msg = '';
			return data;
		}
		data.data = str;
		return data;
	}


	/**
	 * 前往確認頁
	 */

	goConfirm() {
		const check_trnsfrOutAccnt = this.allTaxesData['trnsfrOutAccnt'];       // 轉出帳號(扣款帳號)
		const check_payNo = this.checkPayNo(this.allTaxesData['payNo']);        // 銷帳編號
		const check_payCategory = (this.fuelFee == 'open') ? '40005' : this.allTaxesData['payCategory'];             // 繳款類別


		// payEndDate(繳納截止日)--在汽機車燃料費時,限制為八碼，其餘限制為六碼。
		const check_payEndDate = ((this.fuelFee == 'open') ? this.checkPayEndDate_FuelFee(this.allTaxesData['payEndDate']) : this.checkPayEndDate(this.allTaxesData['payEndDate']));
		const check_trnsfrAmount = this._errorCheckService.checkMoney(this.allTaxesData['trnsfrAmount'], this.currency);   	   // 繳納金額

		if (check_trnsfrOutAccnt != '') {
			this.errorMsg['trnsfrOutAccnt'] = '';
		} else {
			this.errorMsg['trnsfrOutAccnt'] = 'PG_TAX.ERROR.TRNSFROUTACCNT';
		}

		if (check_trnsfrAmount.status) {
			this.errorMsg['trnsfrAmount'] = '';
		} else {
			this.errorMsg['trnsfrAmount'] = check_trnsfrAmount.msg;
		}

		if (check_payNo.status) {
			this.errorMsg['payNo'] = '';
		} else {
			this.errorMsg['payNo'] = check_payNo.msg;
		}

		if (check_payEndDate.status) {
			this.errorMsg['payEndDate'] = '';
		} else {
			this.errorMsg['payEndDate'] = check_payEndDate.msg;
		}

		if (check_payCategory != '') {
			this.errorMsg['payCategory'] = '';
		} else {
			this.errorMsg['payCategory'] = '請選擇繳款類別';
		}

		if (check_trnsfrOutAccnt != '' && check_trnsfrAmount.status && check_payCategory != ''
			&& check_payNo.status && check_payEndDate.status) {
			// 汽機車燃料費特規
			if (this.fuelFee == 'open') {
				this.allFuelFee = {
					trnsfrOutAccnt: this.allTaxesData['trnsfrOutAccnt'],
					payCategory: '40005',
					payNo: this.allTaxesData['payNo'],
					payEndDate: this.allTaxesData['payEndDate'],
					trnsfrAmount: this.allTaxesData['trnsfrAmount'],
					businessType: this.info_data['businessType'],
					taxType: this.taxesData['taxType'],
					trnsToken: this.info_data['trnsToken'],
					identificationCode: '',
					SEND_INFO: this.allTaxesData.SEND_INFO,
					USER_SAFE: this.allTaxesData.USER_SAFE
				};
			} else {
				this.payEndDate = this.allTaxesData.payEndDate;
				// 使用者輸入什麼就是什麼
				this.allTaxesData = {
					trnsfrOutAccnt: this.allTaxesData['trnsfrOutAccnt'],
					payCategory: this.allTaxesData['payCategory'],
					payNo: this.allTaxesData['payNo'],
					payEndDate: this.allTaxesData['payEndDate'],
					trnsfrAmount: this.allTaxesData['trnsfrAmount'],
					businessType: this.info_data['businessType'],
					taxType: this.taxesData['taxType'],
					trnsToken: this.info_data['trnsToken'],
					SEND_INFO: this.allTaxesData.SEND_INFO,
					USER_SAFE: this.allTaxesData.USER_SAFE
				};

				this.taxesDetail = {
					atmCode: this.allTaxesData['payCategory'].split('-')[0],
					subName: this.allTaxesData['payCategory'].split('-')[1],
				}
			}

			this.showPage = 'confirm';
		} else {
			this._handleError.handleError({
				type: 'dialog',
				title: '提醒您',
				content: "輸入項目有誤，請再次確認輸入欄位。"
			});
			// 當使用者輸入有誤時，將頁面拉回最上方。
			this._uiContentService.scrollTop();
		}
	}


	/**
	 * 	安控選擇
	 * @param e 
	 */
	securityOptionBak(e) {
		if (e.status) {
			// 取得需要資料傳遞至下一頁子層變數
			this.allTaxesData.SEND_INFO = e.sendInfo;
			this.allTaxesData.USER_SAFE = e.sendInfo.selected;
		} else {
			// do errorHandle 錯誤處理 推業或POPUP
			let error_obj: any = (!!e.ERROR) ? e.ERROR : e;
			error_obj['type'] = 'message';
			this._handleError.handleError(error_obj);
		}
	}


	// 確認頁返回編輯頁
	toEditPage(e) {
		// 依據不同稅款而有不同繳納截止日
		if (this.fuelFee == 'open') {
			this.allFuelFee.payEndDate = (this.allFuelFee.payEndDate).replace(/\//g, '');
		} else {
			this.allTaxesData.payEndDate = this.payEndDate;
		}
		if (e) {
			this._headerCtrl.setLeftBtnClick(() => {
				this.cancelEdit();
			});
			this.showPage = 'original'
		}
	}

	/**
	 * 日期格式判斷
	 * @param args 
	 * 
	 */

	getSet(args?: any): Object {
		let chinaYear = false; // 是否判斷民國年(可設定)
		let option = 'yyyy/MM/dd'; // 預設日期formate(可設定)
		let datepieFlag = false;
		if (typeof args !== 'undefined' && args) {
			let check_type = args;
			if (args instanceof Object && args.hasOwnProperty('formate')) {
				check_type = args.formate;
				if (args.hasOwnProperty('datepipe') && args.datepipe) {
					datepieFlag = true;
				}
				if (args.hasOwnProperty('chinaYear') && args.chinaYear) {
					chinaYear = true;
				}
			} else if ((args instanceof Array) && args.length < 3 && args[0]) {
				check_type = args[0];
				if (args[1] === 'datepipe') {
					datepieFlag = true;
				} else if (args[1] === 'chinaYear') {
					chinaYear = true;
				}
			}
			switch (check_type) {

				case 'date':
					option = 'yyyy/MM/dd';
					break;
				case 'dateInpt':
					option = 'yyyy-MM-dd';
					break;
				case 'number':
					option = 'yyyyMMddHHmmss';
					break;
				case 'timestamp':
					option = 'timestamp';
					break;
				case 'object':
					option = 'object';
					break;
				default:
					option = check_type;
					break;
			}
		}

		return {
			datepieFlag: datepieFlag,
			option: option,
			chinaYear: chinaYear
		};
	}
	/**
     * 取得日期物件
     * @param obj_val
     * @param chinaYear
     */
	getDateObj(obj_val, chinaYear: boolean): any {
		const dt = new Date(obj_val);
		const timestamp = dt.getTime();
		if (timestamp) {
			let year = dt.getFullYear();
			if (chinaYear) {
				year -= 1911;
			}
			const month = PadUtil.pad(dt.getMonth() + 1, 2);
			const day = PadUtil.pad(dt.getDate(), 2);
			const hour = PadUtil.pad(dt.getHours(), 2);
			const min = PadUtil.pad(dt.getMinutes(), 2);
			const sec = PadUtil.pad(dt.getSeconds(), 2);
			return {
				date_obj: dt,
				timestamp: timestamp,
				year: year.toString(),
				month: month,
				day: day,
				hour: hour,
				min: min,
				sec: sec
			};
		} else {
			return timestamp;
		}
	}


    /**
     * 日期字串判斷
     * @param value 日期
     * @param chinaYear 是否民國年
     */
	getDateString(value: string | number, chinaYear: boolean): string {
		let date = value.toString();
		// ==特殊文字處理== //
		if (date === 'NOW_TIME') {
			const tmp_dt = new Date();
			date = tmp_dt.getFullYear()
				+ '' + PadUtil.pad(tmp_dt.getMonth() + 1, 2)
				+ '' + PadUtil.pad(tmp_dt.getDate(), 2)
				+ '' + PadUtil.pad(tmp_dt.getHours(), 2)
				+ '' + PadUtil.pad(tmp_dt.getMinutes(), 2)
				+ '' + PadUtil.pad(tmp_dt.getSeconds(), 2)
				;
		}

		let show_time_flag = true;
		let obj_val = date.replace(/[\/|\-|\.|\:|\s]/g, '');
		const res = /^[0-9]+$/;
		if (res.test(obj_val)) {
			const obj_length = obj_val.length;
			const date_list = ['', '', ''];
			switch (obj_length) {
				case 6: // 780101 民國78.01.01  //080603
					date_list[1] = obj_val.substr(-4, 2);  // 06
					date_list[2] = obj_val.substr(-2, 2);  // 03
					date_list[0] = '1' + obj_val.replace(obj_val.substr(-4, 4), '');  //0603
					obj_val = date_list.join('/');
					show_time_flag = false;
					break;
				case 8: // 19890101 西元1989.01.01
					date_list[0] = obj_val.substr(0, 4);
					date_list[1] = obj_val.substr(4, 2);
					date_list[2] = obj_val.substr(6, 2);
					obj_val = date_list.join('/');
					show_time_flag = false;
					break;
			}

			// == 民國轉換 == //
			const tmp_date = obj_val.split('/');
			// tslint:disable-next-line:radix
			if (parseInt(tmp_date[0]) <= 1911 && tmp_date[0].length < 4) {
				tmp_date[0] = (parseInt(tmp_date[0], 10) + 1911).toString();
				obj_val = tmp_date.join('/');
			}
		} else {
			obj_val = date;
		} // obj_val end

		const check_date = this.getDateObj(obj_val, chinaYear);
		if (check_date) {
			if (show_time_flag) {
				date = check_date.year + '/' + check_date.month + '/' + check_date.day
					+ ' ' + check_date.hour + ':' + check_date.min + ':' + check_date.sec;
			} else {
				date = check_date.year + '/' + check_date.month + '/' + check_date.day;
			}
		}
		return date;
	}

	/**
	 * 日期轉換
	 * @param value object
	 * @param args 
	 */
	transDate(value: any, args?: any): any {
		let date = value;
		const get_set = this.getSet(args); // 參數判斷
		const datepieFlag = get_set['datepieFlag'];
		const option = get_set['option'];
		const chinaYear = get_set['chinaYear']; // 民國年

		if (typeof value === 'string' || typeof value === 'number') {
			date = this.getDateString(value, false); // 民國年統一轉換(下方處理)
		} // string end

		if (datepieFlag) {
			// 效能太差，不到必要請勿使用
			// return this.datePipe.transform(date, option); // 效能太差
		} else {
			let pie_str: any;
			const check_date = this.getDateObj(date, chinaYear);
			if (!check_date) {
				return date;
			} else {
				const timestamp = check_date.timestamp;
				const date_obj = check_date.date_obj;
				const year = check_date.year;
				const month = check_date.month;
				const day = check_date.day;
				const hour = check_date.hour;
				const min = check_date.min;
				const sec = check_date.sec;

				const timeObj = {
					time: timestamp,
					date: date_obj,
					formate: '',
					data: {
						year: year,
						month: month,
						day: day,
						hour: hour,
						min: min,
						sec: sec
					}
				};

				let set_formate = option;
				if (option === 'object') {
					set_formate = 'yyyy/MM/dd HH:mm:ss';
				}
				if (chinaYear) {
					set_formate = set_formate.replace(/yyyy/g, 'yyy');
					timeObj.formate = set_formate.replace(/yyy/g, year.toString());
				} else {
					timeObj.formate = set_formate.replace(/yyyy/g, year.toString());
				}

				timeObj.formate = timeObj.formate.replace(/MM/g, month);
				timeObj.formate = timeObj.formate.replace(/dd/g, day);
				timeObj.formate = timeObj.formate.replace(/HH/g, hour);
				timeObj.formate = timeObj.formate.replace(/mm/g, min);
				timeObj.formate = timeObj.formate.replace(/ss/g, sec);

				switch (option) {
					case 'timestamp':
						pie_str = timestamp;
						break;
					case 'object':
						pie_str = timeObj;
						break;
					default:
						pie_str = timeObj.formate;
						break;
				}
			}
			return pie_str;
		}
	}

	/**
	 * 檢查所選稅款是否在日期內
	 * 
	 * @param startDate
	 * @param endDate
	 * @return
	 */
	CheckDateIsOver(startDate: string, endDate: string) {

		const date_data = this._errorCheckService.getDateSet({
			baseDate: 'today', // 基礎日
			rangeType: 'D', // "查詢範圍類型" M OR D
			rangeNum: '1', // 查詢範圍限制
			rangeDate: '' // 比較日
		}, 'future');

		this.currentDay = ((date_data.minDate).replace(/\//g, '')).substr(4);
		this.startD = startDate;
		this.endD = endDate;

		if ((parseInt(this.startD) <= parseInt(this.currentDay)) &&
			(parseInt(this.currentDay) <= parseInt(this.endD))) {
			this.taxPayment = true;
		} else {
			this.taxPayment = false;
		}

		return this.taxPayment;
	}








	/**
	 * 	送電文
	 * @param security 
	 * 
	 */

	public finalCheckData(security) {
		let send_data: any = this._formateService.checkField(security, 'sendData');
		if (typeof send_data != 'object' || !send_data) {
			if (this.fuelFee != 'open') {
				send_data = this.allTaxesData;
			} else {
				send_data = this.allFuelFee;
			}

		}
		if (this.fuelFee != 'open') {
			this.allTaxesData.payCategory = this.taxesDetail.atmCode;
			this._mainService.sendData(send_data, security).then(
				(result) => {
					if (result.status) {
						this.showPage = 'result';
						this.taxesResultData = result.data;
					} else {
						result['type'] = 'message';
						this._handleError.handleError(result);
						this._headerCtrl.updateOption({
							'leftBtnIcon': 'menu'
						});
					}
				},
				(errorObj) => {
					errorObj['type'] = 'message';
					this._handleError.handleError(errorObj);
					this._headerCtrl.updateOption({
						'leftBtnIcon': 'menu'
					});
				});
		} else {
			// this.allFuelFee.payEndDate = DateUtil.transDate(this.allFuelFee.payEndDate, ['yyyMMdd', 'chinaYear']);
			this._otherService.sendData(send_data, security).then(
				(result) => {
					if (result.status) {
						this.showPage = 'result';
						this.taxesResultData = result.data;
					} else {
						result['type'] = 'message';
						this._handleError.handleError(result);
						this._headerCtrl.updateOption({
							'leftBtnIcon': 'menu'
						});
					}
				},
				(errorObj) => {
					errorObj['type'] = 'message';
					this._handleError.handleError(errorObj);
					this._headerCtrl.updateOption({
						'leftBtnIcon': 'menu'
					});
				});
		}
	}
}

