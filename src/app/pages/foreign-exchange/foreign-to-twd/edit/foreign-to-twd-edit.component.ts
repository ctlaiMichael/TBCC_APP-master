import { logger } from '@shared/util/log-util';

/**
 * Header
 * 外幣轉台幣
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { CheckService } from '@shared/check/check.service';
import { ForeignToTwdService } from '@pages/foreign-exchange/shared/service/foreign-to-twd.service';
import { DateService } from '@core/date/date.service';
import { TwdToForeignService } from '@pages/foreign-exchange/shared/service/twd-to-foreign.service';
import { SystemParameterService } from '@core/system/system-parameter/system-parameter.service';
import { ExchangeService } from '@pages/financial/shared/service/exchange.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { Logger } from '@core/system/logger/logger.service';
import { AmountUtil } from '@shared/util/formate/number/amount-util';
import { FormateService } from '@shared/formate/formate.service';

@Component({
	selector: 'app-foreign-to-twd-edit',
	templateUrl: './foreign-to-twd-edit.component.html',
	styleUrls: [],
	providers: [ForeignToTwdService, ExchangeService]
})
export class ForeignToTwdEditComponent implements OnInit {
	@Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();

	showNextPage = false;  //傳給子層返回上一頁
	searchExchangeFlag = '';
	//==================ngModel====================//
	info_Obj: any = {};
	datas = [];
	trnsOutAccts = []; //轉出Array
	trnsInAccts = [];  //轉入Array
	trnsInCurr = [];   //幣別Array 

	trnsInAcctsObj = '';    //ngModel轉入
	trnsOutAcctsObj = '';   //ngModel轉出
	propertyTypeTwToForeign: any = [];//結購細項選單
	objectKeys = Object.keys;//取得結購細項的key值
	selectedCurr = '';//選取的轉出幣別
	selectedSubType: string = ''; //選取的轉出類別
	trnsfrAmount: any = '';
	note_input: string;  //自訂備註
	curr_radio = { options: '2' };//幣別預設選擇
	note_radio = { options: '1' };//備註預設選擇
	rate_radio = { options: '2' };//議價匯率預設選擇
	notePlaceholder = '預設帶成交匯率';
	showCurr = '外幣'//固定外幣顯示選擇的外幣幣別
	balance = '';   //餘額
	bargin_datas: any;
	bargain_req = {	//109
		negotiatedBranch: "",
		negotiatedNo: "",	//
		negotiatedCurr: "",
		negotiatedRate: "",//
		RecordDate: "",
		effectiveDate: "",
		availableAmount: "",

	};
	info_other_data = [];                  // F2000201資料
	//==================ngModel End=================//

	//===================error=====================//
	errorObj = {
		trnsOutAcctsObj: '',    // 轉出帳號
		trnsInAcctsObj: '',     // 轉入帳號
		trnsDate: '',            //日期
		selectedCurr: '',        //轉入幣別
		trnsfrAmount: '',      // 轉帳金額
		selectedSubType: '',           // 外存結購性質
		note_input: '',              //備註過長
		bargain: ''
	};
	//===================error End=================//


	//===================傳遞資料=====================//
	formObj = {
		isReservation: false,
		//預約
		trnsfrAmount: '',
		trnsfrCurr: '',
		trnsfrDate: '',
		subTypeDscp: '',
		//預約END
		//匯率查詢F5000102req START
		trnsfrOutAmount: '',
		trnsfrInAmount: '',
		businessType: '',
		trnsfrOutCurr: '',  //即時、預約  幣別
		trnsfrInCurr: '',   //即時、預約  幣別
		trnsfrRate: '',// 成交匯率
		trnsfrCostRate: '',// 成本匯率
		openNightChk: 'Y', //夜間交易
		//nightType:'',
		//新增議價匯率
		fnctType: '', //交易類別
		negotiatedBranch: '',//議價分行
		negotiatedNo: '',//議價編號
		negotiatedCurr: '',//議價幣別
		negotiatedRate: '',//議價匯率
		recordDate: '',//議價日期
		effectiveDate: '',//議價有效日期
		availableAmount: '',//可用金額
		//新增議價匯率END
		//匯率查詢F5000102req END
		trnsfrOutAccnt: '',
		trnsfrInAccnt: '',
		trnsInSetType: '1',
		subType: '',
		note: '',
		trnsToken: '',
		SEND_INFO: '',    //安控機制
		USER_SAFE: '',
		rate:''
	};
	//===================傳遞資料 End=================//


	//===================日期=====================//
	currentYear = new Date().getFullYear();    // 取得當下年份
	currentMonth = new Date().getMonth() + 1;  // 取得當下月份
	currentDay = new Date().getDate();         // 取得當下日期
	currentTime = this.currentYear + '/' + (this.currentMonth < 10 ? '0' + this.currentMonth : this.currentMonth) + '/' + (this.currentDay < 10 ? '0' + this.currentDay : this.currentDay);
	trnsfrDate: string = this.currentTime;      // 此變數為所選之轉帳日期
	minDay = '';      // 日期可選之最小值
	maxDay = '';      // 日期可選之最大值
	isReservation = false;                     // 判斷是否預約轉帳
	//===================日期 End=================//
	nightType = ''; //夜間交易警語顯示註記



	initNum = '1';
	//===================安控=====================//
	transactionObj = {
		serviceId: 'F5000103',  // F5000103 即時轉帳，F5000105預約轉帳
		categoryId: '4',
		transAccountType: '1',  // 預設回傳1 (約轉)。 2 為(非約轉)。
	};
	//===================安控 End=====================//

	//===================幣別 End=====================//
	popShow = false;
	new_table = [];
	//===================幣別 End=====================//
	constructor(
		private _mainService: ForeignToTwdService,
		private _handleError: HandleErrorService,
		private _headerCtrl: HeaderCtrlService,
		private confirm: ConfirmService,
		private navgator: NavgatorService,
		private _checkService: CheckService,
		private dateService: DateService,
		private twdToForeignService: TwdToForeignService,
		private systemParameterService: SystemParameterService,
		private route: ActivatedRoute,
		private _uiContentService: UiContentService,
		private logger: Logger,
		private formateService: FormateService) { }

	ngOnInit() {
		this._headerCtrl.setLeftBtnClick(() => {
			this.cancelEdit();
		});

		// 轉帳日期帶入
		const date_data = this._checkService.getDateSet({
			baseDate: 'today', // 基礎日
			rangeType: 'M', // "查詢範圍類型" M OR D
			rangeNum: '6', // 查詢範圍限制
			rangeDate: '' // 比較日
		}, 'future');
		this.maxDay = date_data.maxDate;
		this.minDay = date_data.minDate;
		this.rate_radio.options = '2';
		this.trnsOutAcctsObj = '';
		this.trnsInAcctsObj = '';
		this.trnsInCurr = [];
		this.selectedCurr = '';
		/**
		 * F5000101
		 */
		this._mainService.getData('B', this.formObj.openNightChk).then(
			(resObj) => {
				this.info_Obj = resObj;
				this.trnsOutAccts = this.toAcctArry(resObj.trnsOutAccts);     //轉出
				this.trnsInAccts = resObj._twdToForexInAccount;               //約定轉入
				this.formObj.businessType = resObj.info_data.businessType;    //判斷目前是否營業時間內
				// if (this.isReservation === false){
				// this.nightType = resObj.info_data.nightType;}
				//超過3:30 轉預約 待討論
				// let tomoDay = false;
				// let reqTime = resObj.headerTime.substring(resObj.headerTime.indexOf('T') + 1, resObj.headerTime.indexOf('.')).replace(/:/g, '');
				// if (parseInt(reqTime) >= 153000) {
				// 	tomoDay = true;
				// }
				if (this.trnsInAccts.length <= 0 || this.trnsOutAccts.length <= 0) {
					//未約定轉出或約定轉入
					// this._mainService.showInfo('noAccount');
					// this.route.queryParams.subscribe(params => {
					// 	if (params.hasOwnProperty('type')) {
					// 		// set data
					// 		this.navgator.back();
					// 	} else {
					// 		this.navgator.push('foreign-exchange');
					// 	}
					// });
					this._handleError.handleError({
						type: 'message',
						title: 'ERROR.INFO_TITLE',
						content: "您未申請約定轉出/轉入帳號，尚無法執行本項交易。欲約定轉出/轉入帳號，請洽本行營業單位辦理"
					});
				} else {
					if (this.formObj.businessType == 'N') { //N次營業日,T營業日
						if (this.initNum === '1') {
							this.initNum = this.initNum + 1;
							this.nightType = resObj.info_data.nightType;
							if (this.nightType == 'N') {
								this.transactionObj.serviceId = 'F5000105';
								// 已過營業時間提示
								this._mainService.showInfo('reservation');
								this.isReservation = true;
								//營業日暫定+1
								let nextBussDay = this.dateService.getNextBussDay(this.trnsfrDate);
								this.minDay = nextBussDay;
								this.trnsfrDate = nextBussDay;
							}

						}
					}

					if (resObj.info_data.nightType == 'Y') {
						this.nightType = 'Y';
						let newArr = [];
						resObj.trnsOutAccts.forEach(element => {
						// if (element.trnsOutCurr.length > 0 && !element.trnsOutCurr.includes('TWD') && element.trnsOutCurr.includes('USD')) {
						if (element.trnsOutCurr.length > 0 && !element.trnsOutCurr.includes('TWD') ) {
								newArr.push(element);
							}
						})
						this.trnsOutAccts = newArr;
						if (this.trnsOutAccts.length == 0) {
							// this.errorObj.trnsInAcctsObj = "查無夜間交易適用幣別";
							this._handleError.handleError({
								type: 'dialog',
								title: '',
								content: "查無夜間交易適用幣別"
							});
						}
					} else { this.nightType = 'N' }
					/** 20190627 提示訊息先關閉 start  */
					// else {
					// 	this._mainService.showInfo('f1000103');
					// }
					/** 20190627 提示訊息先關閉 end  */

					this.propertyTypeTwToForeign = this._mainService.getPropertyTypeForeignToTw();

					// 取預設第一筆性質別
					for (let first in this.propertyTypeTwToForeign) {
						this.selectedSubType = first;
						break;
					}

					// 取得可用餘額
					this._mainService.getMoney().then(
						(result) => {
							result.data.forEach(element => {
								// let acno = element.acctNo.replace(/-/g, '') + '_' + element.currency.toUpperCase();
								//先處理「-」，再處理空白相關
								let tempStr = element.acctNo.replace(/-/g, '');
								let tempSpc = this.formateService.transEmpty(tempStr, "all");
								let acno = "";
								//若為字串才強制轉大寫
								if (typeof element.currency == 'string') {
									acno = tempSpc + '_' + element.currency.toUpperCase();
								} else {
									acno = tempSpc + '_' + element.currency;
								}
								this.info_other_data[acno] = element.balance;
							});
						},
						(error) => {
							error['type'] = 'dialog';
							this._handleError.handleError(error);
						}
					);
				}
			},
			(errorObj) => {
				errorObj['type'] = 'message';
				this._handleError.handleError(errorObj);
			});


	}

	/**
	 * f5000102
	 */
	getRate(): Promise<any> {
		this.onNextPage();
		this.onCheckEvent();
		// 檢核
		for (let key of this.objectKeys(this.errorObj)) {
			if (this.errorObj[key].length !== 0) {
				this._handleError.handleError({
					type: 'dialog',
					title: '提醒您',
					content: "輸入項目有誤，請再次確認輸入欄位。"
				});
				// 當使用者輸入有誤時，將頁面拉回最上方。
				this._uiContentService.scrollTop();
				return;
			}
		}
		if (this.rate_radio.options == '1') {


			return this.twdToForeignService.getBargainRate(this.formObj).then(
				(resObj) => {
					this.logger.log("getBargainRate", resObj);
					this.formObj.trnsfrRate = resObj.info_data.trnsfrRate;  //成交匯率
					this.formObj.trnsfrCostRate = resObj.info_data.trnsfrCostRate;  //成本匯率
					this.formObj.rate = resObj.info_data.rate;  // 牌告匯率
					//備註
					if (this.note_radio.options == '1') {
						this.formObj.note = resObj.info_data.negotiatedRate;     //取得成交匯率後代入
					} else if (this.note_radio.options == '2') {
						this.formObj.note = this.note_input;
					}
					//固定台幣
					if (this.curr_radio.options == '1') {
						this.formObj.trnsfrOutCurr = this.selectedCurr;
						this.formObj.trnsfrInCurr = 'TWD';
						this.formObj.trnsfrOutAmount = resObj.info_data.trnsfrOutAmount;
						this.formObj.trnsfrInAmount = resObj.info_data.trnsfrInAmount;
					} else {
						//固定外幣
						this.formObj.trnsfrOutCurr = this.selectedCurr;
						this.formObj.trnsfrInCurr = 'TWD';
						this.formObj.trnsfrInAmount = resObj.info_data.trnsfrInAmount;
						this.formObj.trnsfrOutAmount = resObj.info_data.trnsfrOutAmount;
						//固定外幣限額
						if (this.isReservation == false) { //即時才檢查，預約不檢查
							if (Math.round(parseFloat(this.trnsfrAmount) * parseFloat(this.formObj.trnsfrRate)) < 3000) {
								this.errorObj.trnsfrAmount = "交易金額不得小於TWD 3,000";
							} else if (Math.round(parseFloat(this.trnsfrAmount) * parseFloat(this.formObj.trnsfrRate)) > 499999) {
								this.errorObj.trnsfrAmount = "交易金額不得大於TWD 499,999";
							} else {
								this.errorObj.trnsfrAmount = "";
							}
						}
					}
					if (this.errorObj.trnsfrAmount == "") {
						this.searchExchangeFlag = 'bargin_confirm';
					}
				},
				(errorObj) => {
					errorObj['type'] = 'dialog';
					this._handleError.handleError(errorObj);
				});
		} else {
			return this._mainService.getRate(this.formObj).then(
				(resObj) => {
					this.formObj.trnsfrRate = resObj.info_data.trnsfrRate;  //成交匯率
					this.formObj.trnsfrCostRate = resObj.info_data.trnsfrCostRate;  //成本匯率
					this.formObj.rate = resObj.info_data.rate;  // 牌告匯率
					//備註
					if (this.isReservation) { //預約
						if (this.note_radio.options == '1') {
							this.formObj.note = '';
						} else if (this.note_radio.options == '2') {
							this.formObj.note = this.note_input;
						}
					} else {
						if (this.note_radio.options == '1') {
							this.formObj.note = resObj.info_data.trnsfrRate;     //取得成交匯率後代入
						} else if (this.note_radio.options == '2') {
							this.formObj.note = this.note_input;
						}
					}

					//固定台幣
					if (this.curr_radio.options == '1') {
						this.formObj.trnsfrOutCurr = this.selectedCurr;
						this.formObj.trnsfrInCurr = 'TWD';
						// if (this.selectedCurr == 'JPY') {//外轉台 固定為台幣時
						// 	this.formObj.trnsfrOutAmount = Math.round(parseInt(this.trnsfrAmount) / parseFloat(this.formObj.trnsfrRate)).toString();
						// } else {
						// 	this.formObj.trnsfrOutAmount = (parseInt(this.trnsfrAmount) / parseFloat(this.formObj.trnsfrRate)).toFixed(2).toString();
						// }
						this.formObj.trnsfrOutAmount = resObj.info_data.trnsfrOutAmount;
						this.formObj.trnsfrInAmount = resObj.info_data.trnsfrInAmount;

					} else {
						//固定外幣
						this.formObj.trnsfrOutCurr = this.selectedCurr;
						this.formObj.trnsfrInCurr = 'TWD';
						this.formObj.trnsfrOutAmount = resObj.info_data.trnsfrOutAmount;
						// if (this.selectedCurr == 'JPY') {	//外轉台 固定為日幣時
						// 	this.formObj.trnsfrInAmount = Math.round(parseInt(this.trnsfrAmount) * parseFloat(this.formObj.trnsfrRate)).toString();
						// } else {
						// 	this.formObj.trnsfrInAmount = (parseFloat(this.trnsfrAmount) * parseFloat(this.formObj.trnsfrRate)).toFixed(2).toString();
						// }
						this.formObj.trnsfrInAmount = resObj.info_data.trnsfrInAmount;
						//固定外幣限額
						if (this.isReservation == false) { //即時才檢查
							if (Math.round(parseFloat(this.trnsfrAmount) * parseFloat(this.formObj.trnsfrRate)) < 3000) {
								this.errorObj.trnsfrAmount = "交易金額不得小於TWD 3,000";
							} else if (Math.round(parseFloat(this.trnsfrAmount) * parseFloat(this.formObj.trnsfrRate)) > 499999) {
								this.errorObj.trnsfrAmount = "交易金額不得大於TWD 499,999";
							} else {
								this.errorObj.trnsfrAmount = "";
							}
						}
					}
					if (this.errorObj.trnsfrAmount == "") {
						// this.onChangePage('confirm_page', this.formObj);
						this.searchExchangeFlag = 'confirm';
					}
				},

				(errorObj) => {
					errorObj['type'] = 'dialog';
					this._handleError.handleError(errorObj);
				});
		}
	}

	cancelEdit() {

		let type;
		this.route.queryParams.subscribe(params => {
			if (params.hasOwnProperty('type')) {
				// set data
				type = '1';
			} else {
				type = '2';
			}
		});
		this.confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
			title: '提醒您'
		}).then(
			() => {
				//確定
				if (type == '1') {
					this.navgator.back();
				} else {
					this.navgator.push('foreign-exchange');
				}
			},
			() => {
			}
		);
	}

	securityOptionBak(e) {
		if (e.status) {
			// 取得需要資料傳遞至下一頁子層變數
			this.formObj.SEND_INFO = e.sendInfo;
			this.formObj.USER_SAFE = e.sendInfo.selected;
		} else {
			// do errorHandle 錯誤處理 推頁或POPUP
			e['type'] = 'message';
			this._handleError.handleError(e.ERROR);
		}
	}



	// 進入確認頁

	onNextPage() {


		// 取得需要資訊
		this.formObj.trnsfrDate = this.trnsfrDate;    //預約日期
		this.formObj.isReservation = this.isReservation;    //是否預約

		if (this.curr_radio.options == '1') {   //選擇固定台幣
			this.formObj.trnsfrOutAmount = '0.00';
			this.formObj.trnsfrInAmount = this.trnsfrAmount.toString();
			this.formObj.trnsfrCurr = 'TWD';
			this.formObj.trnsfrAmount = this.trnsfrAmount.toString();
		} else if (this.curr_radio.options == '2') {    //選擇固定外幣
			this.formObj.trnsfrOutAmount = this.trnsfrAmount.toString();
			this.formObj.trnsfrInAmount = '0.00';
			this.formObj.trnsfrCurr = this.selectedCurr;
			this.formObj.trnsfrAmount = this.trnsfrAmount.toString();
		}

		//info_Obj 501
		this.formObj.businessType = this.info_Obj.info_data.businessType;
		this.formObj.trnsToken = this.info_Obj.info_data.trnsToken;
		//this.formObj.nightType = this.info_Obj.info_data.nightType;


		//F5000102
		this.formObj.trnsfrOutCurr = this.selectedCurr; //轉出幣別
		this.formObj.trnsfrInCurr = 'TWD';              //轉入幣別固定TWD
		this.formObj.trnsfrOutAccnt = this.trnsOutAcctsObj['trnsfrOutAccnt'];
		this.formObj.trnsfrInAccnt = this.trnsInAcctsObj['trnsfrInAccnt'];
		this.formObj.subType = this.selectedSubType;
		this.formObj.subTypeDscp = this.propertyTypeTwToForeign[this.selectedSubType];
		if (this.note_radio.options === '1') {
			this.formObj.note = '';     //取得成交匯率後代入
		} else if (this.note_radio.options === '2') {
			this.formObj.note = this.note_input;
		}
	}
	/**
	 * 換頁
	 */
	onChangePage(assignPage: string, send_data?: object) {
		switch (assignPage) {

			case 'confirm_page':
				this.backPageEmit.emit({
					from: 'edit_page',
					assignPage: 'confirm_page',
					data: send_data
				});
				break;
		}
	}

	/**
	 * 約定轉出帳號change，幣別跟隨改變
	 */
	onChangeOutAcct() {
		// if (this.trnsOutAcctsObj == '') {
		this.selectedCurr = '';
		this.trnsInCurr = [];
		// }
		if (this.trnsOutAcctsObj.hasOwnProperty('trnsOutCurr')) {
			let outCurr = this.trnsOutAcctsObj['trnsOutCurr'].split(',');
			this.trnsInCurr = outCurr;
		}

	}

	/**
	* 約定轉出帳號change
	*/
	onChangeInAcct() {
		this.formObj.trnsInSetType = this.trnsInAcctsObj['trnsInSetType'];

	}
	/**
	 * 選擇外幣幣別前須先選擇外幣帳號
	 */
	onCurrClick() {
		if (this.trnsOutAcctsObj == '') {
			if (this.trnsOutAccts.length != 1) {
				this._handleError.handleError({
					type: 'dialog',
					title: '',
					content: "請先選擇轉出帳號，轉存幣別因轉出帳號的不同，有不同的設定。"
				});
			} else {
				//轉入只有一筆時處理

				this.trnsInCurr = this.trnsOutAccts[0]['trnsOutCurr'].split(',');
				this.new_table = [];
				this.trnsInCurr.forEach(element => {
					let tmp_data = {
						buy: "",
						country: element,
						currecnyName: "",
						money: "",
						sell: "",
					}
					this.new_table.push(tmp_data);
				});
				// if(this.nightType =='Y'){
				// 	this.new_table = [];
				// 	this.new_table[0] = { buy: "", country: "USD", currecnyName: "", money: "", sell: ""} ;}
				// }
				if (this.new_table.length > 0) {
					this.popShow = true;
				} else {
					this._handleError.handleError({
						type: 'dialog',
						title: '',
						content: "查無轉出幣別"
					});
				}
			}
		} else {
			this.new_table = [];
			this.trnsInCurr.forEach(element => {
				let tmp_data = {
					buy: "",
					country: element,
					currecnyName: "",
					money: "",
					sell: "",
				}
				this.new_table.push(tmp_data);
			});
			// if(this.nightType =='Y'){
			// 	this.new_table = [];
			// 	this.new_table[0] = { buy: "", country: "USD", currecnyName: "", money: "", sell: ""} ;}
			// }
			this.popShow = true;
		}
	}




	// 判斷是否走預約
	TransferDate(date?: any) {
		// 所選日期不等於今日
		this.trnsfrDate = date;
		if (this.trnsfrDate != this.currentTime) {
			this.isReservation = true;
			this.formObj.openNightChk = '';
			this.nightType = 'N';
			//   if (this.formObj.businessType == 'T'){ //在營業日避免重發F5000101
			//     this.ngOnInit();
			//   }
			this.ngOnInit();
			this.transactionObj.serviceId = 'F5000105';
		} else {
			this.isReservation = false;
			this.formObj.openNightChk = 'Y';
			// this.nightType = 'Y';
			// 		if (this.formObj.businessType == 'T'){ //在營業日避免重發F5000101
			//     this.ngOnInit();
			//   }
			this.ngOnInit();
			this.transactionObj.serviceId = 'F5000103';
		}

		//預約交易日期在選擇完日期後做即時檢核
		let timestamp = new Date(this.trnsfrDate).getTime();
		let day = new Date(timestamp).getDay();

		if (day == 0) {
			this._handleError.handleError({
				type: 'dialog',
				title: '提醒您',
				content: "星期日非交易日，請選擇其他日期"
			});
			this.errorObj.trnsDate = '星期日非交易日，請選擇其他日期';
			return false;
		} else {
			this.errorObj.trnsDate = '';
		}
	}

	/**
	 * 整理約定轉出帳號
	 * // 台轉外幣 --->轉入帳號 只要外幣
	 *            --->轉出帳號 只要台幣
	 * 
	 * //外轉台 --->轉出帳號 只要外幣
	 *          --->轉入帳號 只要台幣
	 *         
	 */
	toAcctArry(oldArr) {
		let newArr = [];
		oldArr.forEach(element => {
			if (element.trnsOutCurr.length > 0 && !element.trnsOutCurr.includes('TWD')) {
				newArr.push(element);
			}
		});
		return newArr;
	}

	/**
		 * 自訂備註選擇成交匯率清空
		 */
	chgNote(type) {
		if (type == '1') {
			this.note_input = ''
			this.notePlaceholder = '預設帶成交匯率';
		} else {
			this.notePlaceholder = '請輸入自訂備註';
		}
	}

	//======================================檢核============================================//
	onCheckEvent() {
		if (this.trnsOutAccts.length == 1) {
			this.formObj.trnsfrOutAccnt = this.trnsOutAccts[0].trnsfrOutAccnt;
			this.errorObj.trnsOutAcctsObj = '';
		} else {
			if (this.trnsOutAcctsObj == '') {
				this.errorObj.trnsOutAcctsObj = "請選擇轉出帳號";
			} else {
				this.errorObj.trnsOutAcctsObj = '';
			}
		}

		if (this.trnsInAccts.length == 1) {
			this.formObj.trnsfrInAccnt = this.trnsInAccts[0].trnsfrInAccnt;
			this.errorObj.trnsInAcctsObj = '';
		} else {
			if (this.trnsInAcctsObj == '') {
				this.errorObj.trnsInAcctsObj = "請選擇轉入帳號";
			} else {
				this.errorObj.trnsInAcctsObj = '';
			}
		}
		if (this.selectedCurr == '') {
			this.errorObj.selectedCurr = "請選擇轉出幣別";
		} else {
			this.errorObj.selectedCurr = '';
		}
		if (this.selectedSubType == '') {
			this.errorObj.selectedSubType = "請選擇外存結購性質";
		} else {
			this.errorObj.selectedSubType = '';
		}
		if (this.trnsfrAmount == null || this.trnsfrAmount == undefined) {
			this.errorObj.trnsfrAmount = "請輸入正確數字";
			return;
		}
		let checkDecimal = this.trnsfrAmount.toString().indexOf('.');
		let check_money = this._checkService.checkMoney(this.trnsfrAmount.toString());
		if (!check_money.status) {
			this.errorObj.trnsfrAmount = this._checkService.checkMoney(this.trnsfrAmount).msg;
		} else {
			//預約暫不檢核
			if (!this.isReservation) {
				if (this.curr_radio.options == '1') {   //固定台幣下限額

					if (checkDecimal > 0) {
						this.errorObj.trnsfrAmount = '此計價幣別(TWD)交易金額僅提供整數交易(不可具有小數位)';
					} else if (this.trnsfrAmount.toString().indexOf('0') == 0) {
						this.errorObj.trnsfrAmount = '轉存金額第一位數不可為0或非數字';
					} else if (parseInt(this.trnsfrAmount) < 3000) {
						this.errorObj.trnsfrAmount = "台幣最低限額不得小於3,000元";
					} else if (parseInt(this.trnsfrAmount) > 499999) {
						this.errorObj.trnsfrAmount = "台幣最高限額不得超過499,999元";
					} else {
						this.errorObj.trnsfrAmount = "";
					}

				} else {  //固定外幣
					if (this.selectedCurr == 'JPY' && checkDecimal > 0) {
						this.errorObj.trnsfrAmount = '此計價幣別之交易金額僅提供整數交易(不可具有小數位)';
					} else if (this.trnsfrAmount.toString().indexOf('0') == 0) {
						this.errorObj.trnsfrAmount = '轉存金額第一位數不可為0或非數字';
					} else {
						this.errorObj.trnsfrAmount = "";
					}
				}
			} else {
				if (this.curr_radio.options == '1') {//固定台幣
					if (checkDecimal > 0) {
						this.errorObj.trnsfrAmount = '此計價幣別(TWD)交易金額僅提供整數交易(不可具有小數位)';
					} else if (this.trnsfrAmount.toString().indexOf('0') == 0) {
						this.errorObj.trnsfrAmount = '轉存金額第一位數不可為0或非數字';
					} else if (parseInt(this.trnsfrAmount) < 3000) {
						this.errorObj.trnsfrAmount = "台幣最低限額不得小於3,000元";
					} else if (parseInt(this.trnsfrAmount) > 499999) {
						this.errorObj.trnsfrAmount = "台幣最高限額不得超過499,999元";
					} else {
						this.errorObj.trnsfrAmount = "";
					}
				} else {
					this.errorObj.trnsfrAmount = "";    //固定外幣
				}
			}
		}
		if (this.note_input != "" && this.note_input != undefined) {
			let checkNotLen = this.twdToForeignService.checkNotLen(this.note_input);
			if (!checkNotLen.status) {
				this.errorObj.note_input = checkNotLen.msg;
			} else {
				this.errorObj.note_input = "";
			}
		} else {
			this.errorObj.note_input = "";
		}
		if (this.rate_radio.options == '1') {
			if (this.bargain_req.negotiatedNo == '' || this.bargain_req.negotiatedRate == '') {
				this.errorObj.bargain = "請選擇議價編號";
			} else {
				this.errorObj.bargain = "";
			}
		}
	}

	//======================================檢核End=========================================//

	//======================================推頁事件=========================================//
	//確認頁返回
	backcomfirm(e) {
		if (e.hasOwnProperty('data')) {
			this.backPageEmit.emit(
				{
					from: 'confirm_page',
					assignPage: 'result_page',
					data: e.data
				}
			)
		} else {
			this.searchExchangeFlag = 'edit'
		}
		this._headerCtrl.setLeftBtnClick(() => {
			this.cancelEdit();
		});
	}
	//議價匯率確認返回
	backbargainconfirm(e) {
		if (e.hasOwnProperty('data')) {
			this.backPageEmit.emit(
				{
					from: 'confirm_bargain_page',
					assignPage: 'bargain_result_page',
					data: e.data,
					securityResult: e.securityResult
				}
			)
		} else {
			this.searchExchangeFlag = 'edit'
		}
		this._headerCtrl.setLeftBtnClick(() => {
			this.cancelEdit();
		});
	}
	//從按鈕推頁回來
	backExchange(e) {
		this.searchExchangeFlag = '';
		this._headerCtrl.setLeftBtnClick(() => {
			this.cancelEdit();
		});
		this._headerCtrl.updateOption({
			'title': 'FUNC_SUB.FOREX.FOREX_TO_TWD'
		});
		this._headerCtrl.setLeftBtnClick(() => {
			this.cancelEdit();
		});
	};

	//查詢外幣利率
	searchExchange() {
		this.searchExchangeFlag = 'search';
	};
	//查詢結購用途說明
	searchUse() {
		let purchaseUse = this.systemParameterService.get('MSG_F5000103_4_URL');
		this.navgator.push(purchaseUse);
	}

	//幣別選擇完
	chooseOver(e) {
		this.selectedCurr = e.baseCurrency.name;
		this.popShow = false;
		//只有一筆
		if (this.trnsOutAccts.length == 1) {
			// let trnsAct = this.trnsOutAccts[0]['trnsfrOutAccnt'].replace(/-/g, '') + '_' + this.selectedCurr.toUpperCase();
			//先處理「-」，再處理空白相關
			let tempStr = this.trnsOutAccts[0]['trnsfrOutAccnt'].replace(/-/g, '');
			let tempSpc = this.formateService.transEmpty(tempStr, "all");
			let trnsAct = "";
			//若為字串才強制轉大寫
			if (typeof this.selectedCurr == 'string') {
				trnsAct = tempSpc + '_' + this.selectedCurr.toUpperCase();
			} else {
				trnsAct = tempSpc + '_' + this.selectedCurr;
			}
			if (this.info_other_data[trnsAct]) {
				// this.balance = this.selectedCurr + ' ' + this.info_other_data[trnsAct];
				this.balance = this.info_other_data[trnsAct];
			} else {
				if (this.info_other_data[trnsAct] === 0) {
					this.balance = '0';
				} else {
					this.balance = '';
				}
			}
		} else {
			// let trnsAct = this.trnsOutAcctsObj['trnsfrOutAccnt'].replace(/-/g, '') + ' ' + this.selectedCurr;
			//先處理「-」，再處理空白相關
			let tempStr = this.trnsOutAcctsObj['trnsfrOutAccnt'].replace(/-/g, '');
			let tempSpc = this.formateService.transEmpty(tempStr, "all");
			let trnsAct = "";
			//若為字串才強制轉大寫
			if (typeof this.selectedCurr == 'string') {
				trnsAct = tempSpc + '_' + this.selectedCurr.toUpperCase();
			} else {
				trnsAct = tempSpc + '_' + this.selectedCurr;
			}
			if (this.info_other_data[trnsAct]) {
				// this.balance = this.selectedCurr + ' ' + this.info_other_data[trnsAct];
				this.balance = this.info_other_data[trnsAct];
			} else {
				if (this.info_other_data[trnsAct] === 0) {
					this.balance = '0';
				} else {
					this.balance = '';
				}
			}
		}
	}

	//外匯優惠  同綜活存轉綜定存之優惠
	goOffer() {
		this.navgator.push('web:demandOffer', {});
	}
	//======================================推頁事件End======================================//
	//議價匯率
	chgBargin() {
		if (this.selectedCurr == '' || this.selectedCurr == undefined) {
			this.errorObj.bargain = "請選擇轉入幣別";
			return false;
		} else {
			this.errorObj.bargain = "";
		}

		let req_bargin = {
			fnctType: "2",
			negotiatedCurr: this.selectedCurr
		};
		this.twdToForeignService.getBargain(req_bargin).then(
			(result) => {
				this.logger.log("result", result);
				this.bargin_datas = result.detail;
				if(result.hasOwnProperty('info_data') && result['info_data'] &&
				result['info_data'].hasOwnProperty('hostCodeMsg') && result['info_data']['hostCodeMsg'] 
				&& result['info_data'].hasOwnProperty('hostCode')&& result['info_data']['hostCode'] !='4001'){
				this._handleError.handleError({
					type: 'dialog',
					title: 'ERROR.INFO_TITLE',
					content: result.info_data.hostCodeMsg
				});
				return false;
			}
				if (this.bargin_datas == null || result.detail.length == 0) {
					this._handleError.handleError({
						type: 'dialog',
						title: 'ERROR.INFO_TITLE',
						content: "查無資料"
					});
					return false
				}
				this.searchExchangeFlag = "bargain";
			},
			(reject) => {
				this.logger.log("reject", reject);
				reject['type'] = 'dialog';
				this._handleError.handleError(reject);
			}
		)
	}
	backbargain(e) {
		this.searchExchangeFlag = "edit";
		this.logger.log('e', e);
		this.bargain_req = e;
		this.formObj.fnctType = '2';
		this.formObj.negotiatedBranch = this.bargain_req.negotiatedBranch;
		this.formObj.negotiatedNo = this.bargain_req.negotiatedNo;
		this.formObj.negotiatedCurr = this.bargain_req.negotiatedCurr;
		this.formObj.negotiatedRate = this.bargain_req.negotiatedRate;
		this.formObj.recordDate = this.bargain_req.RecordDate;
		this.formObj.effectiveDate = this.bargain_req.effectiveDate;
		this.formObj.availableAmount = this.bargain_req.availableAmount;
		this.logger.log('formObj', this.formObj);
		this.logger.log('rate_radio.options', this.rate_radio.options);
	}

}
