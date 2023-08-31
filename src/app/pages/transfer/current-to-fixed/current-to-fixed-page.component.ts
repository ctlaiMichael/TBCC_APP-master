/**
 * Header
 * 綜活存轉綜定
 */
import { Component, OnInit, Output } from '@angular/core';
import { CurrentToFixedService } from '@pages/transfer/shared/service/current-to-fixed.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { CheckService } from '@shared/check/check.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { ReplaceUtil } from '@shared/util/formate/string/replace-util';
import { PadUtil } from '@shared/util/formate/string/pad-util';
import { SelectSecurityService } from '@shared/transaction-security/select-security/select-security.srevice';
import { AccountFormateAllPipe } from '@shared/formate/mask/account/account-mask.pipe';
import { AuthService } from '@core/auth/auth.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';


@Component({
	selector: 'app-current-to-fixed-page',
	templateUrl: './current-to-fixed-page.component.html',
	styleUrls: [],
	providers: [CurrentToFixedService, AccountFormateAllPipe]
})
export class CurrentToFixedPageComponent implements OnInit {
	page = 'edit';
	showCaptcha = true; // 非約狀態開啟圖形驗證190705cheng wei 
	// 加入安控機制
	transactionObj = {
		serviceId: 'f6000102',
		categoryId: '1',
		transAccountType: '1',
		showCaptcha: this.showCaptcha, // 非約狀態開啟圖形驗證190705cheng wei
		customAuth: ['1', '2'] // 客制權限
	};
	// 綁定資料
	viewShowData = {

	};
	currentFixedResultData = {};
	// 錯誤訊息控制
	errorMsg = {
		inteAccnt: '', // 綜存帳號
		transfrType: '', // 轉存類別
		transfrTimes: '', // 轉存期別
		transfrRateType: '', // 轉存利率別
		transfrAmount: '', // 轉存金額
		autoTransCode: '', // 續存方式
	};
	// 送出資料
	currentFixedData = {
		inteAccnt: { name: '', value: '' }, // 綜存帳號
		transfrType: { name: '', value: '' }, // 轉存類別
		transfrTimes: { name: '', value: '' }, // 轉存期別
		transfrRateType: { name: '', value: '' }, // 轉存利率別
		transfrAmount: { name: '', value: '' }, // 轉存金額
		autoTransCode: { name: '', value: '' }, // 續存方式
		businessType: '', // 次營業日註記
		trnsToken: '', // 交易控制碼
		sendInfo: [],
		user_safe: ''
	};

	// 轉存類別選單
	synthesDepositType = ['定期存款', '整存整付', '存本取息'];
	// 轉存期別
	synthesDepositPeriod = [];
	// 轉存利率別選單
	synthesDepositRateType = ['固定利率', '機動利率'];
	// 續存方式選單
	synthesDepositSavesWay = ['到期解約', '本金續存', '本息續存'];
	// 綜存帳號
	trnsOutAccts = [];
	// 金額上限值
	limitAmount = 1000000;
	transDataObj = {
		limitAmount: this.limitAmount
	};

	constructor(
		private _mainService: CurrentToFixedService,
		private _handleError: HandleErrorService,
		private _errorCheck: CheckService,
		private _headerCtrl: HeaderCtrlService,
		private _authService: AuthService,
		private confirm: ConfirmService,
		private navgator: NavgatorService,
		private selectSecurityService: SelectSecurityService,
		private accountFormateAllPipe: AccountFormateAllPipe,
		private _uiContentService: UiContentService,
		private _checkService: CheckService
	) { }

	ngOnInit() {
		this._headerCtrl.setLeftBtnClick(() => {
			this.cancelEdit();
		});
		// 取得綜存帳號
		this.getAccount();
	}
	toEditPage(e) {
		if (e) {
			this._headerCtrl.setLeftBtnClick(() => {
				this.cancelEdit();
			});
			this.page = 'edit'
		}
	}

	// 跳出popup是否返回
	cancelEdit() {

		this.confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
			title: '提醒您'
		}).then(
			() => {
				// 確定
				this.navgator.push('transfer');
			},
			() => {
			}
		);

	}



	/**
	 * 向service取得資料
	 */
	getAccount(): Promise<any> {
		return this._mainService.getAccount().then(
			(getAccount_S) => {
				//
				let noAcctMsg = '你未設定綜存帳號，尚無法執行本項交易，欲設定綜存帳號，請洽本行營業單位辦理';
				if (getAccount_S.status == true) {
					if (getAccount_S.info_data.businessType === 'T' ) {
						if (getAccount_S.trnsOutAccts.length >= 0) {
							// 資料處理
							console.log(getAccount_S);
							this.trnsOutAccts = getAccount_S.trnsOutAccts;
							// 塞值
							this.currentFixedData.trnsToken = getAccount_S.info_data.trnsToken;
							this.currentFixedData.businessType = getAccount_S.info_data.businessType;
						} else {
							// 無帳號
							this._handleError.handleError({
								type: 'message',
								title: '',
								content: noAcctMsg
							});
						}
					} else {
						// 非交易時間
						this._handleError.handleError({
							type: 'message',
							title: '',
							content: '本交易限營業時間內始得辦理'
						});
					}
				} else {
					// 無帳號欄位
					this._handleError.handleError({
						type: 'message',
						title: '',
						content: noAcctMsg
					});
				}

			}, (getAccount_F) => {
				// error hendle
				console.log(getAccount_F);
				getAccount_F.type = 'message';
				this._handleError.handleError(getAccount_F);

			}
		);
	}

	// 共用change事件 塞送出值
	changeDate(name, e) {
		if (this.currentFixedData.hasOwnProperty(name)) {
			this.currentFixedData[name].value = e.target.value;
			this.currentFixedData[name].name = e.target.selectedOptions[0].innerHTML;
		}
	}

	// 切換類別期別跟動
	changeDepositType(e) {
		// 異動先清空還原預設值
		let value = e.target.value;
		
		this.currentFixedData['transfrType'].value = value;
		this.currentFixedData['transfrType'].name = e.target.selectedOptions[0].innerHTML;
		// 還原預設
		this.currentFixedData['transfrTimes'] = { name: '', value: '' };
		if (value == '0') {
		
			// 定期存款1~11個月
			let tempData = [];
			for (let i = 1; i < 12; i++) {
				if (i < 10) {
					tempData.push('0' + i);
				} else {
					tempData.push(i);
				}

			}
			this.synthesDepositPeriod = tempData;

		} else if (value == '1' || value == '2') {
			// 其他 12~36個月
			let tempData = [];
			for (let i = 12; i < 37; i++) {
				tempData.push(i);
			}
			this.synthesDepositPeriod = tempData;
		} else {
			this.synthesDepositPeriod = [];
		}
	}

	checkMonyFormat() {
		console.log(this.currentFixedData.transfrAmount);
		let returnData = true;
		// 金錢格式檢核
		let checkMoneyFormat = this._checkService.checkMoney(
			this.currentFixedData.transfrAmount.value,
			{ return_type: true, currency: 'TWD', not_zero: true, check_empty: false }
		);

		if (checkMoneyFormat) {
			// 數值大小檢核
			let money = parseInt(this.currentFixedData.transfrAmount.value, 10);
			if (money <= this.limitAmount && money >= 10000) {
				this.errorMsg['transfrAmount'] = '';
			} else {
				returnData = false;
				this.errorMsg['transfrAmount'] = '轉存金額需介於$1~100萬元之間';
			}
		} else {
			returnData = false;
			this.errorMsg['transfrAmount'] = 'CURRENT_FIXED.ERROR_MSG.FORAMT.AMOUNT_FORMAT';
		}


		return returnData;

	}

	// 安控
	securityOptionBak(e) {
		console.log(e);
		if (e.status) {
			// 取得需要資料傳遞至下一頁子層變數
			this.currentFixedData.sendInfo = e.sendInfo;
			this.currentFixedData.user_safe = e.sendInfo.selected;
		} else {
			// if(this.selectFlag){
			// do errorHandle 錯誤處理 推業或POPUP
			e['type'] = 'message';
			this._handleError.handleError(e.ERROR);
			// }
		}
	}

	setErrorMsg(errorKey, msg?) {
		if (this.errorMsg.hasOwnProperty(errorKey)) {
			if (msg != undefined && msg != null) {
				console.log(errorKey, msg);
				this.errorMsg[errorKey] = msg;
			} else {
				console.log(errorKey, 'msmsmsss');
				this.errorMsg[errorKey] = 'CURRENT_FIXED.ERROR_MSG.EMPTY.' + errorKey.toUpperCase();
			}
		}
	}

	emptyCheck() {
		let returnStatus = true;
		for (let index in this.currentFixedData) {
			console.log(index);
			let status = true;
			if (this.currentFixedData[index].hasOwnProperty('value')) {
				status = this._checkService.checkEmpty(this.currentFixedData[index].value, true, false);
			}
			if (!status) {
				returnStatus = false;
				// 設定錯誤訊息
				this.setErrorMsg(index);
			} else {
				// 清空錯誤訊息
				this.setErrorMsg(index, '');
			}
		}
		return returnStatus;
	}

	transferConfirm() {
		// 空值檢核
		let emptyStatus = this.emptyCheck();
		// 金額檢核
		let monyFormatStatus = this.checkMonyFormat();
		console.log(this.currentFixedData);
		console.log(emptyStatus, monyFormatStatus);
		if (emptyStatus && monyFormatStatus) {

			console.log(this.currentFixedData);

			this.page = 'confirm';
		}
	}

	public finalCheckData(security) {
		// 發結果電文
		console.log(security);
		if (security.value) {
		
			this._mainService.getSendResult(this.currentFixedData, security.securityResult).then(
				(result_S) => {
					// 導至交易結果頁
					// console.log('response result', result_S);
					this.currentFixedResultData = result_S;
					this.page = 'result';
				}, (F) => {
					// erro handle
					F['type'] = 'message';
					this._handleError.handleError(F);
				});
			
		} else {

			this._handleError.handleError(security.securityResult);
		}

	}
}
