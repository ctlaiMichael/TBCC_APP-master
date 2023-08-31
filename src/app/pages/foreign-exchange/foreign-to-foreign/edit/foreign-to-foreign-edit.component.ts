/**
 * 台幣轉外幣
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { CheckService } from '@shared/check/check.service';
import { ForeignToForeignService } from '@pages/foreign-exchange/shared/service/foreign-to-foreign.service';
import { ForexToForexInfo } from '@conf/terms/forex/forex-to-forex-info';
import { InfomationService } from '@shared/popup/infomation/infomation.service';
import { NoAccountInfo } from '@conf/terms/forex/no-account-info';
import { TwdToForeignService } from '@pages/foreign-exchange/shared/service/twd-to-foreign.service';
import { ForeignToTwdService } from '@pages/foreign-exchange/shared/service/foreign-to-twd.service';
import { ExchangeService } from '@pages/financial/shared/service/exchange.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { logger } from '@shared/util/log-util';

@Component({
	selector: 'app-foreign-to-foreign-edit',
	templateUrl: './foreign-to-foreign-edit.component.html',
	styleUrls: [],
	providers: [ForeignToForeignService, ForeignToTwdService, ExchangeService]
})
export class ForeignToForeignEditComponent implements OnInit {
	@Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();

	popupFlag_currOut = false;
	popupFlag_currIn = false;
	searchExchangeFlag = 'edit';
	clear_type = '';
	// 電文
	info_Obj: any = {}; //5000101

	/**================== 頁面ngModel ====================*/
	trnsOutAccts = [];  			  //轉出帳號Arr
	trnsInAccts = [];   			  //轉入帳號Arr
	trnsOutCurr = [];   			  //轉出幣別Arr
	trnsInCurr = [];    			  //轉入幣別Arr

	trnsInAcctsObj = '';              //轉出ngModel
	trnsOutAcctsObj = '';             //轉入ngModel
	selectedOutCurr = '';             //轉出幣ngModel
	selectedInCurr = '';              //轉入幣ngModel
	trnsfrAmount: any = '';           //轉帳金額ngModel
	input_note: string = '';          //備註 ngModel
	curr_radio = { options: '1' };    //幣別預設選擇
	note_radio = { options: '1' };    //備註radio
	balance = '';                     //餘額
	info_other_data = [];             // F2000201資料
	/**================== 頁面ngModel End====================*/

	objectKeys = Object.keys;        //取得物件的key值

	/**================== 錯誤訊息 ====================*/
	errorObj = {
		trnsOutAcctsObj: '',    // 轉出帳號
		trnsInAcctsObj: '',     // 轉轉入帳號
		selectedOutCurr: '',        //轉出幣別
		selectedInCurr: '',        //轉入幣別
		trnsfrAmount: '',      // 轉帳金額
		input_note: ''           //備註
	};
	/**================== 錯誤訊息====================*/


	// 編輯頁全部資料準備送至確認頁
	formObj = {
		isReservation: '',
		trnsfrAmount: '',
		trnsfrCurr: '',
		trnsfrDate: '',

		//匯率查詢F5000102req START
		trnsfrOutCurr: '',
		trnsfrOutAmount: '',
		trnsfrInCurr: '',
		trnsfrInAmount: '',
		//匯率查詢F5000102req END

		//F5000102res START
		trnsfrOutRate: '',  //轉出匯率
		trnsfrInRate: '',   //轉入匯率
		//F5000102res END

		//F5000104req
		trnsfrOutAccnt: '',
		trnsfrInAccnt: '',
		trnsfrInId: '',
		businessType: '',
		trnsToken: '',
		note: '',
		//F5000104res END

		SEND_INFO: '',    //安控機制
		USER_SAFE: ''
	};


	//===================幣別 End=====================//
	popShow = false;
	new_table = [];
	//===================幣別 End=====================//

	/**     預約功能開啟時再打開
	// 取得當下日期
	currentYear = new Date().getFullYear();    // 取得當下年份
	currentMonth = new Date().getMonth() + 1;  // 取得當下月份
	currentDay = new Date().getDate();         // 取得當下日期
	currentTime = this.currentYear + '-' + (this.currentMonth < 10 ? '0' + this.currentMonth : this.currentMonth) + '-' + (this.currentDay < 10 ? '0' + this.currentDay : this.currentDay);
	trnsfrDate: string = this.currentTime;     // 此變數為所選之轉帳日期
	isReservation = false;                     // 判斷是否預約轉帳
	*/

	// 加入安控機制
	transactionObj = {
		serviceId: 'F5000104',  // F5000104 外幣約定即時轉帳
		categoryId: '4',
		transAccountType: '1',  // 預設回傳1 (約轉)。 2 為(非約轉)。
	};

	constructor(
		private _mainService: ForeignToForeignService,
		private _handleError: HandleErrorService,
		private _headerCtrl: HeaderCtrlService,
		private confirm: ConfirmService,
		private navgator: NavgatorService,
		private _checkService: CheckService,
		private infomationService: InfomationService,
		private twdToForeignService: TwdToForeignService,
		private foreignToTwdService: ForeignToTwdService,
		private _uiContentService: UiContentService) { }

	ngOnInit() {
		this._headerCtrl.setLeftBtnClick(() => {
			this.cancelEdit();
		});
		this._mainService.getData('1').then(
			(resObj) => {
				this.info_Obj = resObj;
				this.trnsOutAccts = this.toAcctArry(resObj.trnsOutAccts, 'out');
				this.trnsInAccts = this.toAcctArry(resObj.trnsInAccts, 'in');
				if (resObj.info_data.hasOwnProperty('businessType') && resObj.info_data.businessType == 'N') {
					this._handleError.handleError({
						type: 'message',
						title: '',
						content: "本交易限營業時間內始得辦理"
					});
					// this.navgator.push('foreign-exchange');
				} else {
					if (this.trnsInAccts.length <= 0 || this.trnsOutAccts.length <= 0) {
						//未約定轉出或約定轉入
						// const set_data = new NoAccountInfo();
						// this.infomationService.show(set_data);
						// this.navgator.push('foreign-exchange');
						this._handleError.handleError({
							type: 'message',
							title: 'ERROR.INFO_TITLE',
							content: "您未申請約定轉出/轉入帳號，尚無法執行本項交易。欲約定轉出/轉入帳號，請洽本行營業單位辦理"
						});
					} else {
						
						/** 20190627 提示訊息先關閉 start  */
						//const set_data = new ForexToForexInfo();
						// this.infomationService.show(set_data);
						/** 20190627 提示訊息先關閉 end  */

						// 取得可用餘額
						this.foreignToTwdService.getMoney().then(
							(result) => {
								result.data.forEach(element => {
									let acno = element.acctNo.replace(/-/g, '') + ' ' + element.currency;
									this.info_other_data[acno] = element.balance;
								});
							},
							(error) => {
								error['type'] = 'dialog';
								this._handleError.handleError(error);
							}
						)
					}
				}
			},
			(errorObj) => {
				errorObj['type'] = 'dialog';
				this._handleError.handleError(errorObj);
				this.navgator.push('foreign-exchange');
			});
		this.clear_type = this.curr_radio.options;
	}

	/**
	 * 整理約定轉出轉入帳號
	 * 外轉外幣 --->轉出轉入帳號 只要外幣
	 * @param oldArr 
	 * @param type 
	 */

	toAcctArry(oldArr, type) {
		let newArr = [];
		if (type == 'out') {
			oldArr.forEach(element => {
				if (element.trnsOutCurr != '' && !element.trnsOutCurr.includes('TWD')) {
					newArr.push(element);
				}
			});
		} else if (type == 'in') {
			oldArr.forEach(element => {
				if (element.trnsInCurr != '' && !element.trnsInCurr.includes('TWD')) {
					newArr.push(element);
				}
			});
		}
		return newArr;
	}

	/**
	 * f5000102
	 */
	getRate(): Promise<any> {
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

		if (this.curr_radio.options == '1') {           //選擇固定轉出幣
			this.formObj.trnsfrOutAmount = this.trnsfrAmount.toString();
			this.formObj.trnsfrInAmount = '0.00';
		} else if (this.curr_radio.options == '2') {    //選擇固定轉入幣
			this.formObj.trnsfrOutAmount = '0.00';
			this.formObj.trnsfrInAmount = this.trnsfrAmount.toString();
		}
		this.formObj.trnsfrOutCurr = this.selectedOutCurr;  //轉出幣別
		this.formObj.trnsfrInCurr = this.selectedInCurr;   //轉入幣別
		
		if (this.trnsOutAccts.length > 1) {
			this.formObj.trnsfrOutAccnt = this.trnsOutAcctsObj['trnsfrOutAccnt'];   //轉出帳號
		}

		if (this.trnsInAccts.length > 1) {
			this.formObj.trnsfrInAccnt = this.trnsInAcctsObj['trnsfrInAccnt'];      //轉入帳號
		}

		this.formObj.businessType = this.info_Obj.info_data.businessType;
		this.formObj.trnsToken = this.info_Obj.info_data.trnsToken;
		this.formObj.note = this.input_note;

		return this._mainService.getRate(this.formObj).then(
			(resObj) => {
				this.formObj.trnsfrOutRate = resObj.info_data.trnsfrOutRate;  //轉出匯率
				this.formObj.trnsfrInRate = resObj.info_data.trnsfrInRate;   //轉入匯率
				this.formObj.trnsfrOutAmount = resObj.info_data.trnsfrOutAmount;
				this.formObj.trnsfrInAmount = resObj.info_data.trnsfrInAmount;
				// //固定台幣
				// if (this.curr_radio.options == '1') {
				//     this.formObj.trnsfrOutCurr = 'TWD';
				//     this.formObj.trnsfrInCurr = this.selectedInCurr;
				//     this.formObj.trnsfrOutAmount = this.trnsfrAmount;
				//     this.formObj.trnsfrInAmount = (parseInt(this.trnsfrAmount) / parseFloat(this.formObj.trnsfrRate)).toString();
				// } else {
				//     //固定外幣
				//     this.formObj.trnsfrOutCurr = 'TWD';
				//     this.formObj.trnsfrInCurr = this.selectedOutCurr;
				//     this.formObj.trnsfrOutAmount = (parseInt(this.trnsfrAmount) * parseFloat(this.formObj.trnsfrRate)).toString();
				//     this.formObj.trnsfrInAmount = this.trnsfrAmount;
				//     //固定外幣限額
				//     if ((parseInt(this.trnsfrAmount) * parseFloat(this.formObj.trnsfrRate)) < 3000) {
				//         this.errorObj.trnsfrAmount = "交易金額不得小於TWD 3,000";
				//     } else if ((parseInt(this.trnsfrAmount) * parseFloat(this.formObj.trnsfrRate)) > 499999) {
				//         this.errorObj.trnsfrAmount = "交易金額不得大於TWD 499,999";
				//     } else {
				//         this.errorObj.trnsfrAmount = "";
				//     }
				// }
				if (this.errorObj.trnsfrAmount == "") {
					this.searchExchangeFlag = 'confirm';
				}
			},
			(errorObj) => {
				errorObj['type'] = 'dialog';
				this._handleError.handleError(errorObj);
			});

	}

	/**
	 * 轉出帳號改變
	 */
	onChangeOutAcct() {
		this.selectedOutCurr = '';
		this.trnsOutCurr = [];
		if (this.trnsOutAcctsObj != '') {
			//幣別
			let temp_trnsOutCurr = this.trnsOutAcctsObj["trnsOutCurr"];
			let tmp_arr = temp_trnsOutCurr.split(",");
			if (tmp_arr.length > 0) {
				for (let i = 0; i < tmp_arr.length; i++) {
					if (tmp_arr[i] !== "TWD") {
						this.trnsOutCurr.push(tmp_arr[i]);
					}
				}
			}
			//備註
			if (this.note_radio.options === '1') {
				this.input_note = this.trnsOutAcctsObj['trnsfrOutName'];
			}
		}
	}

	/**
	 * 轉入帳號改變
	 */
	onChangeInAcct() {
		this.trnsInCurr = [];
		
		if (this.trnsInAcctsObj != '') {
			let temp_trnsInCurr = this.trnsInAcctsObj["trnsInCurr"];
			let tmp_arr = temp_trnsInCurr.split(",");
			if (tmp_arr.length > 0) {
				for (let i = 0; i < tmp_arr.length; i++) {
					if (tmp_arr[i] !== "TWD") {
						this.trnsInCurr.push(tmp_arr[i]);
					}
				}
			}
		}
	}

	/**
	  * 轉出帳號改變時，備註跟隨改變
	  */
	chgNote(type) {
		if (type == '1') {
			if (this.trnsOutAcctsObj.hasOwnProperty('trnsfrOutName')) {
				this.input_note = this.trnsOutAcctsObj['trnsfrOutName'];
			}
		} else {
			this.input_note = '';
		}
	}
	/**
	 * 檢核
	 */
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

		if (this.selectedOutCurr == '') {
			this.errorObj.selectedOutCurr = "請選擇轉出幣別";
		} else {
			this.errorObj.selectedOutCurr = '';
		}

		if (this.selectedInCurr == '') {
			this.errorObj.selectedInCurr = "請選擇轉入幣別";
		} else {
			this.errorObj.selectedInCurr = '';
		}

		if (this.trnsfrAmount == null || this.trnsfrAmount == undefined) {
			this.errorObj.trnsfrAmount = "請輸入正確數字";
			return;
		}
		let checkDecimal = this.trnsfrAmount.toString().indexOf('.');
		let check_money = this._checkService.checkMoney(this.trnsfrAmount.toString());
		logger.error('checlmoney', check_money, checkDecimal, check_money)

		if (!check_money.status) {
			this.errorObj.trnsfrAmount = this._checkService.checkMoney(this.trnsfrAmount).msg;
		} else {
			if (((this.curr_radio.options == '2' && this.selectedInCurr == 'JPY') || (this.curr_radio.options == '1' && this.selectedOutCurr == 'JPY'))
				&& checkDecimal > 0) {
				this.errorObj.trnsfrAmount = '此計價幣別之交易金額僅提供整數交易(不可具有小數位)';
			} else if (this.trnsfrAmount.toString().indexOf('0') == 0) {
				this.errorObj.trnsfrAmount = '轉存金額第一位數不可為0或非數字';
			} else {
				this.errorObj.trnsfrAmount = "";
			}
		}
		if (this.input_note != "" && this.input_note != undefined) {
			let checkNotLen = this.twdToForeignService.checkNotLen(this.input_note);
			if (!checkNotLen.status) {
				this.errorObj.input_note = checkNotLen.msg;
			} else {
				this.errorObj.input_note = "";
			}
		} else {
			this.errorObj.input_note = "";
		}
	}


	//安控
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

	//======================================推頁popup事件=========================================//

	//查詢外幣利率
	searchExchange() {
		this.searchExchangeFlag = 'search';
	};

	//從按鈕推頁回來
	backExchange(e) {
		this.searchExchangeFlag = '';
		this._headerCtrl.setLeftBtnClick(() => {
			this.cancelEdit();
		});
		this._headerCtrl.updateOption({
			'title': 'FUNC_SUB.FOREX.FOREX_TO_FOREX'
		});
		this._headerCtrl.setLeftBtnClick(() => {
			this.cancelEdit();
		});
	};
	//取消編輯
	cancelEdit() {
		this.confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
			title: '提醒您'
		}).then(
			() => {
				//確定
				this.navgator.push('foreign-exchange');
			},
			() => {
			}
		);
	}
	//請選擇外幣幣別popup
	onCurrClick(currType: string) {

		switch (currType) {

			case 'currOut':

				if (currType == 'currOut' && this.trnsOutAcctsObj == '') {
					if (this.trnsOutAccts.length != 1) {
						this.popupFlag_currOut = true;
					} else {
						if (!this.popupFlag_currOut) {
							this.trnsOutCurr = this.trnsOutAccts[0]['trnsOutCurr'].split(',');
							this.new_table = [];
							this.trnsOutCurr.forEach(element => {
								let tmp_data = {
									buy: "",
									country: element,
									currecnyName: "",
									money: "",
									sell: "",
									type: "out"
								}
								this.new_table.push(tmp_data);
							});
							if (this.new_table.length > 0) {
								this.popShow = true;
							}
						}
					}
				} else {
					if (!this.popupFlag_currOut) {
						this.new_table = [];
						this.trnsOutCurr.forEach(element => {
							let tmp_data = {
								buy: "",
								country: element,
								currecnyName: "",
								money: "",
								sell: "",
								type: "out"
							}
							this.new_table.push(tmp_data);
						});
						if (this.new_table.length > 0) {
							this.popShow = true;
						}
					}
				}
				break;
			case 'currIn':
				if (currType == 'currIn' && this.trnsInAcctsObj == '') {
					if (this.trnsInAccts.length != 1) {
						this.popupFlag_currIn = true;
					} else {
						if (!this.popupFlag_currIn) {
							this.trnsInCurr = this.trnsInAccts[0]['trnsInCurr'].split(',');
							this.new_table = [];
							this.trnsInCurr.forEach(element => {
								let tmp_data = {
									buy: "",
									country: element,
									currecnyName: "",
									money: "",
									sell: "",
									type: "in"
								}
								this.new_table.push(tmp_data);
							});
							if (this.new_table.length > 0) {
								this.popShow = true;
							}
						}
					}
				} else {
					if (!this.popupFlag_currIn) {
						this.new_table = [];
						this.trnsInCurr.forEach(element => {
							let tmp_data = {
								buy: "",
								country: element,
								currecnyName: "",
								money: "",
								sell: "",
								type: "in"
							}
							this.new_table.push(tmp_data);
						});
						if (this.new_table.length > 0) {
							this.popShow = true;
						}
					}
				}
				break;
		}

	}
	//pop close
	confirm_curr() {
		this.popupFlag_currOut = false;
		this.popupFlag_currIn = false;
	}

	//換頁
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

	//確認頁返回
	backcomfirm(e) {
		if (e.hasOwnProperty('data')) {
			this.backPageEmit.emit(
				{
					from: 'confirm_page',
					assignPage: 'result_page',
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
	//幣別選擇完
	chooseOver(e) {
		// this.selectedCurr = e.baseCurrency.name;
		this.popShow = false;

		if (e.baseCurrency.type == 'out') {
			this.selectedOutCurr = e.baseCurrency.name;
		}

		if (e.baseCurrency.type == 'in') {
			this.selectedInCurr = e.baseCurrency.name;
		}
		logger.error('this.info_other_data', this.info_other_data);
		if (this.trnsOutAccts.length == 1) {
			let trnsAct = this.trnsOutAccts[0]['trnsfrOutAccnt'].replace(/-/g, '') + ' ' + this.selectedOutCurr;
			if (this.info_other_data[trnsAct]) {
				// this.balance = this.selectedOutCurr + ' ' + this.info_other_data[trnsAct];
				this.balance = this.info_other_data[trnsAct];
			}
		} else {
			let trnsAct = this.trnsOutAcctsObj['trnsfrOutAccnt'].replace(/-/g, '') + ' ' + this.selectedOutCurr;
			if (this.info_other_data[trnsAct]) {
				// this.balance = this.selectedOutCurr + ' ' + this.info_other_data[trnsAct];
				this.balance = this.info_other_data[trnsAct];
			}
		}
	}
	clearMoney(i) {
		if (this.clear_type != i) {
			this.trnsfrAmount = '';
			this.clear_type = i;
		}
	}
	//======================================推頁事件End======================================//
}
