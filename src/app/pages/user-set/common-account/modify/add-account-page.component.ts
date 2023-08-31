/**
 * Header
 */
import { Component, OnInit, Input, Output, Renderer2, NgZone, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { CommonAccountService } from '@pages/user-set/shared/service/commonAccount.service';
import { AgreedAccountService } from '@pages/user-set/shared/service/agreedAccount.service';
import { AccountCheckUtil } from '@shared/util/check/data/account-check-util';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AuthService } from '@core/auth/auth.service';

@Component({
	selector: 'app-add-account-page',
	templateUrl: './add-account-page.component.html',
	styleUrls: [],
	providers: [CommonAccountService, AgreedAccountService]
})


export class AddAccountPageComponent implements OnInit {
	@Input() goBackFlag;   //返回辨識專用
	@Output() backToTWDTransfer: EventEmitter<any> = new EventEmitter<any>();  // 返回台幣轉帳專用


	agreeAccList = []; //約定帳號
	bankList = [];     //銀行列表

	//INPUT欄位
	userAcnt = {
		"trnsInBank": '',
		"trnsInBankName": '',
		"bankAllname": '',
		"trnsInAccnt": '',
		"USER_SAFE": '',
		"SEND_INFO": '',
		"accntName": ''
	}


	action = '1'; //執行動作 1.新增 2.修改 3.刪除

	selectAcnt;
	selectBank;
	//預設約定帳號
	acntRadio = {
		type: '1'
		, flag: false
	};
	easyName: string = '';
	//check error
	errorMsg: any = { 'easyName': '', 'errAcnt': '' };
	popFlag = false;
	//頁面切換
	pageModify = 'edit';
	showPage = '';
	dis_input = false;    //選擇完約定pop後 ，input不能再輸入
	//結果頁內容
	successMsg = "新增常用帳號成功";
	successContent = [];
	isNAAcct;    //開放非約定帳戶註記


	// 加入安控機制
	transactionObj = {
		serviceId: 'FG000404',
		categoryId: '7',
		transAccountType: '1',   // 1:約定,2:非約定(預設)
	};
	constructor(
		private _logger: Logger
		, private _mainService: CommonAccountService
		, private agreedService: AgreedAccountService
		, private _handleError: HandleErrorService
		, private _headerCtrl: HeaderCtrlService
		, private confirm: ConfirmService
		, private authService: AuthService
		, private navgator: NavgatorService
	) { }

	ngOnInit() {

		//取得約定帳號
		this.getAgreeAccount();
		// this.getBank();
		this._headerCtrl.setLeftBtnClick(() => {
			this.cancelEdit();
		});
	

		this.isNAAcct = this.authService.getUserInfo().isNAAcct;
	}

	//跳出popup是否返回
	cancelEdit() {
		if (this.showPage == 'bankPage') {
			this.showPage = '';
		} else {
			this.confirm.show('您是否放棄此次編輯?', {
				title: '提醒您'
			}).then(
				() => {
					//確定
					// 台幣轉帳進入加為常用帳號時，想返回至台幣轉帳--判斷式
					if (this.goBackFlag) {
						if (this.goBackFlag.backToTWDTransfer == true) {
							this.backToTWDTransfer.emit(this.goBackFlag);
							this.navgator.popTo('twd-transfer');
						}
					} else {
						this.navgator.push('user-set');
					}
				},
				() => {

				}
			);
		}
	};

	toEditPage(e) {
		if (e) {
			this._headerCtrl.setLeftBtnClick(() => {
				this.cancelEdit();
			});
			this._headerCtrl.updateOption({
				'title': '常用帳號設定'
			});
			this._logger.log('toEditPage', this.pageModify);
			this.pageModify = 'edit';
		}
	};
	/**
	 * 選擇銀行
	 */
	selectCode() {

		if (this.acntRadio.type != '1') {

			this.showPage = 'bankPage';
		} else {
			if (this.agreeAccList.length == 0 || !this.agreeAccList[0]) {
				this._handleError.handleError({
					type: 'dialog',
					title: 'ERROR.INFO_TITLE',
					content: "您未約定轉入帳號"
				});
				return false;
			}
			this.acntRadio.flag = this.acntRadio.flag ? false : true;
		};
	};
	/**
	 * 輸入帳號欄位，若是約定帳號則不給輸入直接跳出約定帳號select選單
	 */
	enterAcnt() {
		if (this.acntRadio.type == '1') {
			// this.dis_input = true;
			this.selectCode();
		};
	}
	/**
	 * 取消popup
	 */
	cancel_pop() {
		this.acntRadio.flag = false;
	};
	/**
	 * pop選擇完
	 */
	check_pop(popNo) {
		if (popNo == '1') {
			this.userAcnt.trnsInBank = this.selectAcnt.bankId;
			this.userAcnt.trnsInBankName = this.selectAcnt.bankName;
			this.userAcnt.trnsInAccnt = this.selectAcnt.acctNo;
			this.userAcnt.bankAllname = this.selectAcnt.bankId + '-' + this.selectAcnt.bankName;
			this.acntRadio.flag = false;
		} else {
			// this.userAcnt.transInBank = this.selectBank.bankCode;
			// this.userAcnt.trnsInBankName = this.selectBank.bankName;
			// this.userAcnt.bankAllname = this.selectBank.bankCode + '-' + this.selectBank.bankName;
			// this.acntRadio.flag = false;
		}
	};

	getBankCode(e) {
		this.showPage = '';
		if (e.hasOwnProperty('bankcode') && e.hasOwnProperty('bankname')) {
			this.userAcnt.trnsInBank = e.bankcode;
			this.userAcnt.trnsInBankName = e.bankname;
			this.userAcnt.bankAllname = e.bankName;
		}
	}

	/**
	 * 切換radio,清空 1約定 2其他
	 */
	clearAcnt(type) {

		//未開放轉入非約定帳號
		this._logger.log(' this.acntRadio.type1', this.acntRadio.type);
		if (type == '1') {//約定
			if (this.agreeAccList.length == 0 || !this.agreeAccList[0]) {
				this.acntRadio.type = '1'; //!!!待修正radio
				this._handleError.handleError({
					type: 'dialog',
					title: 'ERROR.INFO_TITLE',
					content: "您未約定轉入帳號，尚無法執行本項交易，欲約定轉入帳號，請洽本行營業單位辦理"

				});
				return false;
			}
			this.dis_input = false;
		}else{//其他
			if (this.isNAAcct == '0') {
				this.acntRadio.type = '2'; //!!!待修正radio
				this._handleError.handleError({
					type: 'dialog',
					title: 'ERROR.INFO_TITLE',
					content: "您尚未開放非約定轉帳機制"
				});
				return false;
			}
		}

		if (this.acntRadio.type != type) {
			this.userAcnt.trnsInBank = '';
			this.userAcnt.trnsInBankName = '';
			this.userAcnt.trnsInAccnt = '';
			this.userAcnt.bankAllname = '';
			this.errorMsg.easyName = '';
			this.errorMsg.errAcnt = '';
		}


		this._logger.log(' this.acntRadio.type2', this.acntRadio.type);
	}
	/**
   * 取得約定帳號
   */
	getAgreeAccount(): Promise<any> {
		return this._mainService.getAgreeAccount().then(
			(res) => {

				if (res.hasOwnProperty('info_data') && res.hasOwnProperty('trnsInAccts')) {
					this.agreeAccList = res.trnsInAccts;
				}
				this._logger.log(' res.trnsInAccts', this.agreeAccList);
				//點選約定帳號彈出popup時之預設
				if (typeof this.agreeAccList === 'object' && this.agreeAccList[0].hasOwnProperty('bankId')) {
					this.selectAcnt = this.agreeAccList[0];
				};
				// 由台幣轉帳進入時，將所輸入銀行代碼與轉入帳號自動顯示於畫面上。
				if (this.goBackFlag.hasOwnProperty('trnsfrInBank') && this.goBackFlag.hasOwnProperty('trnsfrInAccnt')
					&& this.goBackFlag.trnsfrInBank != '' && this.goBackFlag.trnsfrInAccnt != '') {
					this._logger.log('add-account component line218', this.goBackFlag);
					this.userAcnt.bankAllname = this.goBackFlag.trnsfrInBank;           // 轉入行庫(數字+中文)
					this.userAcnt.trnsInAccnt = this.goBackFlag.trnsfrInAccnt;          // 轉入帳號
					this.userAcnt.trnsInBank = this.goBackFlag.trnsfrInBankCode;        // 轉入行庫(數字)
					this.userAcnt.trnsInBankName = this.goBackFlag.trnsfrInBankName;    // 轉入行庫(中文)
					let checkBreak = true;
					this.agreeAccList.forEach(element => {
						if (checkBreak) {
							if (this.goBackFlag.trnsfrInAccnt == element.acctNo) {
								this.acntRadio.type = '1';
								checkBreak = false;
							} else {
								this.acntRadio.type = '2';
							}
						}
					});
					//設定header
					this._headerCtrl.updateOption({
						'title': '常用帳號設定'
					});
					// 返回前一頁
					this._headerCtrl.setLeftBtnClick(() => {
						this.cancelEdit();
					});
				};
			},
			(errorObj) => {
				errorObj['type'] = 'dialog';
				this._handleError.handleError(errorObj);
			}
		);
	}

	// /**
	//  * 取得銀行列表
	//  */
	// getBank(): Promise<any> {
	// 	return this.agreedService.getBank().then(
	// 		(res) => {
	// 			if (res.hasOwnProperty('info_data') && typeof res['info_data'] === 'object') {
	// 				this.bankList = res['info_data'];
	// 			}
	// 			//點選約定帳號彈出popup時之預設
	// 			if (typeof this.agreeAccList === 'object') {
	// 				this.selectBank = this.bankList[0];
	// 			};
	// 		},
	// 		(errorObj) => {
	// 			errorObj['type'] = 'dialog';
	// 			this._handleError.handleError(errorObj);
	// 		}
	// 	);
	// }



	//確認頁點選確認
	goResult(e) {

		if (e.securityResult.ERROR.status == true) {
			this.onSend(e);
		} else {

		}
	}
	//監聽憑證回傳之output
	onVerifyResult(e) {
		if (e) {
			this.popFlag = false;
			this.checkEvent('1');
			this.onSend(e);
		}
	}
	/**
	  * 送電文
	  */
	onSend(security) {
		this._mainService.onSend(this.userAcnt, security).then(
			(res) => {
				this.successContent = [{ title: '轉入行庫', detail: this.userAcnt['bankAllname'] },
				{ title: '轉入帳號', detail: this.userAcnt['trnsInAccnt'] }, { title: '好記名稱', detail: this.userAcnt['accntName'] }];
				if (res.status) {
				}
				this.pageModify = 'result';
			},
			(errorObj) => {
				errorObj['type'] = 'message';
				this._handleError.handleError(errorObj);
			});
	}



	/**
	* 檢查並前往下一頁
	*/
	checkEvent(action) {

		if (!this.userAcnt.SEND_INFO['status']) {
			//error handle
			let errorObj = {
				type: 'dialog',
				content: this.userAcnt.SEND_INFO['message'],
				message: this.userAcnt.SEND_INFO['message']
			};
			this._handleError.handleError(errorObj);
			return;
		}
		const check_obj = this.agreedService.checkNickName(this.userAcnt.accntName);
		const check_act = AccountCheckUtil.checkActNum(this.userAcnt.trnsInAccnt);

		//轉入行庫不能為空
		if (this.userAcnt.trnsInBank == "") {
			this.errorMsg.errAcnt = 'CHECK.BANK';
		};
		//帳號
		if (!check_act.status) {
			this.errorMsg.errAcnt = check_act.msg;
		};
		//轉入行庫與帳號error清除
		if (this.userAcnt.trnsInBank != "" && check_act.status) {
			this.errorMsg.errAcnt = '';
		}
		//好記名稱
		if (check_obj.status) {
			this.errorMsg.easyName = '';
		} else {
			this.errorMsg.easyName = check_obj.error_list;
		};

		if (check_act.status && check_obj.status && this.userAcnt.trnsInBank != "") {
			this.pageModify = 'confirm';
		};

		let safeObj = { action: action };
		this.userAcnt = Object.assign(this.userAcnt, safeObj);
	}

	//安控檢核
	securityOptionBak(e) {
		if (e.status) {
			// 取得需要資料傳遞至下一頁子層變數
			this.userAcnt.SEND_INFO = e.sendInfo;
			this.userAcnt.USER_SAFE = e.sendInfo.selected;
		} else {
			// do errorHandle 錯誤處理 推業或POPUP
			e['type'] = 'message';
			this._handleError.handleError(e.ERROR);
		}

		this._logger.log('securityOptionBak', this.userAcnt.USER_SAFE, e.selected);
	}


	// 返回台幣轉帳
	toTWDTransfer() {
		this._logger.log('this is add-account-page line343', 'im here');
		this.goBackFlag.toTWDTransfer = false;
		this.backToTWDTransfer.emit(this.goBackFlag);
		this.navgator.popTo('twd-transfer');
	}
}
