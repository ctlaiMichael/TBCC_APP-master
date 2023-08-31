/**
 * Header
 * 台幣轉帳
 * 
 * 約定帳號，只要有「戶名」則優先秀出「戶名」的資訊，
 * 若無戶名值則秀出「好記名稱」資訊，只要是「戶名」就依原規格，隱第一碼呈現
 * 若是「好記名稱」就完整呈現，使用 「trnsInAcctaName」 控制
 */
import { Component, OnInit, Output } from '@angular/core';
import { TwdTransferService } from '@pages/transfer/shared/service/twdTransfer.service';
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
import { EmptyUtil } from '@shared/util/formate/string/empty-util';
import { FormateService } from '@shared/formate/formate.service';


@Component({
	selector: 'app-twd-transfer-page',
	templateUrl: './twd-transfer-page.component.html',
	styleUrls: [],
	providers: [TwdTransferService, AccountFormateAllPipe]
})
export class TwdTransferPageComponent implements OnInit {
	/**
	 *
	 */
	info_data: any = {};                   // F4000101資料
	info_other_data = [];                  // F2000101資料
	trnsOutAccts = [];                     // 轉出帳號列表
	trnsInAccts = [];                      // 約定帳號列表
	commonTrnsInAccts = [];                // 常用帳號列表(常用帳號列表頁)
	trnsInAccts_security = [];             // 約定帳號列表
	agreedAccountList = [];                // 約定帳號列表(為了檢查限額)
	balance = '';                          // 可用餘額
	currentTimeData = '';                  // 取得當下時間
	remarks = false;                       // 編寫備註  預設為 false 不顯示, true 則顯示
	commonIcon = false;                    // 沒有常用帳號時，不允許按鈕點擊。
	agreedIcon = false;                    // 沒有約定帳號時，不允許按鈕點擊。
	allowNonAgreeAcctFlag = true;		   // 飛遠轉註記開啟，禁止非約轉
	isCurrentTime = false;                 // 判斷是否預約轉帳
	addCommonAccount = true;               // 加入常用帳號按鈕判斷 true不亮燈
	isCommonAccount = [];                  // 判斷轉入帳號是否為常用
	defaultTrnsOutAccts = true;            // 轉出帳號僅有一組時，預設該帳號。
	selectFlag = false;
	trnsfrOutAccntFlag = false;
	showCaptcha = true; // 非約狀態開啟圖形驗證190705cheng wei 
	authType = '';      // 使用者可使用安控機制
	/**
	 * 20191106 
	 * 因應使用者僅有「OTP」安控，而不在剛進入頁面時跳出提示訊息
	 */
	securityControl = false;

	/**
	 * 給收款人訊息(備註二)，因ngclass衝突，再用一個變數控制
	 * 1.非本行時不可輸入
	 * 2.長度過長錯誤提示
	 */
	notePayeeFlag = false;

	/**
	 * 因銀行代碼與轉入帳號在同一div中，且ngClass無法同時宣告兩次，故追加一個變數，以便控制ngClass。
	 * trnsfrInBank_trnsfrInAccntError : 銀行代碼未輸入或轉入帳號未輸入
	 * trnsfrInBank_trnsfrInAccnt : 該使用者沒有憑證或OTP時，不予自行輸入。
	 */
	trnsfrInBank_trnsfrInAccnt = false;
	trnsfrInBank_trnsfrInAccntError = false;

	/**
	 * 轉帳頁面切換
	 * ('original':原始轉帳頁，'bankPage':銀行列表頁，'agreedAccountPage':約定帳號頁
	 * 'commonAccountPage':常用帳號頁，'addCommonAccountPage':加為常用帳號頁，'confirmPage':確認頁)
	 */
	showPage = 'original';


	// 錯誤檢核提示
	errorMsg = {
		trnsfrOutAccntError: '',    // 轉出帳號
		trnsfrAmountError: '',      // 轉帳金額
		trnsfrInBankError: '',      // 轉入行庫
		trnsfrInAccntError: '',     // 轉入帳號
		notePayerError: '',          // 付款人備註
		notePayeeError: ''           // 給收款人訊息
	};


	// 編輯頁全部資料準備送至確認頁
	allTransferData = {
		custId: '',
		trnsfrDate: '',
		trnsfrOutAccnt: '',
		trnsfrInBank: '',
		trnsfrInAccnt: '',
		trnsfrAmount: '',
		notePayer: '',
		notePayee: '',
		businessType: '',
		trnsToken: '',
		trnsInSetType: '',
		trnsfrType: '', // 即時轉帳/預約轉帳
		SEND_INFO: '',	// 安控機制
		USER_SAFE: ''	// 安控機制
	};

	// 結果頁全部資料
	transferResultData = {};

	// 加為常用帳號
	goAddCommonAccount = {
		trnsfrInAccnt: '',       // 轉入帳號
		trnsfrInBank: '',        // 銀行代碼＋銀行名稱
		trnsfrInBankCode: '',    // 銀行代碼(使加入常用帳號順利通關，因該電文需要。)
		trnsfrInBankName: '',    // 銀行名稱(使加入常用帳號順利通關。)
		backToTWDTransfer: true, // 為了在加入常用帳號頁點擊返回時，會回到台幣轉帳，因而加入。
	}

	// 加入安控機制
	transactionObj = {
		serviceId: 'f4000102',  // F4000102 即時轉帳，F4000401預約轉帳
		categoryId: '1',
		transAccountType: '',  // 預設回傳1 (約轉)。 2 為(非約轉)。
		showCaptcha: this.showCaptcha, // 非約狀態開啟圖形驗證190705cheng wei 
		ulStyle: { 'width': '66%', 'padding-left': '0px' }
	};

	// 金額檢核必要參數
	currency = {
		currency: 'TWD'
	}

	//===================日期=====================//
	minDay = '';      // 日期可選之最小值
	maxDay = '';      // 日期可選之最大值
	//===================日期 End=================//


	// ----------20191014 因應安控機制僅有OTP-------//
	securityAccountObj = {
		flag: false,
		transAccountType: '',
	};
	// ------------------------------------------//


	constructor(
		private _mainService: TwdTransferService,
		private _handleError: HandleErrorService,
		private _errorCheck: CheckService,
		private _headerCtrl: HeaderCtrlService,
		private _authService: AuthService,
		private confirm: ConfirmService,
		private navgator: NavgatorService,
		private selectSecurityService: SelectSecurityService,
		private _uiContentService: UiContentService,
		private _checkService: CheckService,
		private _formateService: FormateService
	) { }

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

		this.getData().then(
			(checkAcctInAllow) => {
				/**
				 * checkAcctInAllow.account 無約定轉入帳號
				 * checkAcctInAllow.common 無常用帳號
				 * checkAcctInAllow.input 禁止自行輸入
				 */
				if (checkAcctInAllow.account
					|| checkAcctInAllow.common
					|| checkAcctInAllow.input
				) {
					let allowSecurity = this._authService.getAllowSecurity();
					let setTransAccountType = '2';
					if ((checkAcctInAllow.account || checkAcctInAllow.common)
						&& (allowSecurity.ssl || allowSecurity.ca)
					) {
						// 預設為約定: 
						// 1. 安控需要為ssl或憑證
						// 2. 常用和約定不為空
						setTransAccountType = '1';
					}
					this.transactionObj.transAccountType = setTransAccountType;
					// console.error('show security', setTransAccountType, allowSecurity, checkAcctInAllow);
					setTimeout(() => {
						this.securityControl = true; // 顯示安控與下一步
					}, 100);
				} else {
					// 沒有任何可以選擇轉入帳號的方法...
					this.securityControl = true;
				}
			},
			() => {
				// no do
			}
		);
	}


	// 跳出popup是否返回
	cancelEdit() {
		if (this.showPage != 'original') {
			this.showPage = 'original';
		} else {
			this.confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
				title: '提醒您'
			}).then(
				() => {
					//確定
					this.navgator.push('transfer');
				},
				() => {
				}
			);
		}
	}

	/**
	 * 改變select選擇時
	 * @param menu
	 */

	onChangeType(menu?: any) {
		this.balance = this.info_other_data[(menu).replace(/-/g, '')];
		if (this.allTransferData.trnsfrOutAccnt != '') {
			this.errorMsg.trnsfrOutAccntError = '';
		}
	}

	/**
	 * 向service取得資料
	 */
	getData(): Promise<any> {
		return this._mainService.getData().then(
			(result) => {
				// 三種轉入帳號模式
				let output = {
					account: true, // 約轉
					common: true, // 常用
					input: true // 輸入
				};
				this.info_data = result.account;
				this.selectFlag = true;
				// 判斷是否有轉出帳號
				this.trnsOutAccts = result.account['trnsOutAccts'];
				if (this.trnsOutAccts.length <= 0 || typeof result.account['trnsOutAccts'] == 'undefined') {
					this._handleError.handleError({
						type: 'message',
						title: 'POPUP.NOTICE.TITLE',
						content: "PG_TRANSFER.ERROR.TRNSOUTACCT_2",
						classType: "warning"
					});
					return Promise.reject({
						type: 'message',
						title: 'POPUP.NOTICE.TITLE',
						content: "PG_TRANSFER.ERROR.TRNSOUTACCT_2",
						classType: "warning"
					});
				} else if (this.trnsOutAccts.length == 1) {
					this.defaultTrnsOutAccts = false;
					this.allTransferData.trnsfrOutAccnt = this.trnsOutAccts[0].acctNo;
					this.onChangeType(this.allTransferData.trnsfrOutAccnt);
				}

				/** 預設轉帳日期與請求電文回應時間 */
				this.allTransferData.trnsfrDate = DateUtil.transDate(result.account['searchTime'], 'yyyy-MM-dd');
				this.currentTimeData = DateUtil.transDate(result.account['searchTime'], 'date');
				/**-------------------------- */

				/** 放可用餘額 */
				result.balance.data.forEach(element => {
					this.info_other_data[element.acctNo] = element.balance;
				});
				/**--------- */

				/** 存入及判斷有無約定轉入帳號，沒有不予於點擊 */
				this.trnsInAccts = this.info_data.trnsInAccts;
				if (this.trnsInAccts.length <= 0) {
					this.agreedIcon = true;
					output.account = false;
				}
				/**----------------------------------------- */

				/** 
				 * 存入及判斷有無常用帳號，沒有不予於點擊
				 * 
				 * NonAgreeAcctListFlag :N----- Default
				 * NonAgreeAcctListFlag為N且無帳號時「您尚未設定常用帳號，請至其他服務新增常用帳號」
				 * NonAgreeAcctListFlag :Y----- 非約轉用戶不開放，常用帳號清單中被中台過濾非約定帳號
				 * NonAgreeAcctListFlag為Y時「您尚未開放非約定轉帳機制」，繼續讓user操作
				 */
				this.commonTrnsInAccts = this.info_data.commonTrnsInAccts;
				if (this.commonTrnsInAccts.length <= 0) {
					// 沒有常用帳號時，常用帳號按鈕關閉。
					this.commonIcon = true;
					output.common = false;
					/**
					 * 20190904 Boy
					 * 因電金副科要求，將下方關閉不提示使用者。
					 */

					// if (this.info_data.info_data.NonAgreeAcctListFlag == 'N') {
					// 	// 無常用帳號且NonAgreeAcctListFlag為N，常用帳號按鈕關閉。
					// 	this._handleError.handleError({
					// 		type: 'dialog',
					// 		title: 'POPUP.NOTICE.TITLE',
					// 		content: "您尚未設定常用帳號，請至其他服務新增常用帳號"
					// 	});
					// }

					/**--------20190904 end----------------------- */
				} else if (this.info_data.info_data.NonAgreeAcctListFlag == 'Y') {
					// 有常用帳號且NonAgreeAcctListFlag為Y，常用帳號按鈕開啟，且
					// 常用帳號清單中被中台過濾非約定帳號。
					this._handleError.handleError({
						type: 'dialog',
						title: 'POPUP.NOTICE.TITLE',
						content: "您尚未開放非約定轉帳機制"
					});
					this.commonIcon = false;
				}

				/**----------------------------------------- */

				/** 判斷有無OTP或憑證，沒有時無法自行輸入轉入帳號及銀行代碼 */
				let OTPInfo = this._authService.checkAllowOtp();
				let CAInfo = this._authService.checkAllowOtpAndCA();
				if (OTPInfo || CAInfo) {
					this.trnsfrInBank_trnsfrInAccnt = false;
				} else {
					output.input = false;
					this.trnsfrInBank_trnsfrInAccnt = true;
				}
				/**----------------------------------------------- */

				this.onChangeType(this.trnsOutAccts[0].acctNo);

				/** -----20190823 Boy 修改 --------
				 * 
				 * 是否開放非約定轉帳註記 Y: 允許非約定轉帳,N: 不允許非約定轉帳
				 * 如果allowNonAgreeAcctFlag為Y及isNAAcct為1時，才可
				 * 允許使用者自行輸入轉入帳號及銀行代碼(非約轉)。
				 * 
				 */
				if ('Y' == this.info_data.info_data.allowNonAgreeAcctFlag &&
					'1' == this._authService.getUserInfo().isNAAcct) {
					this.trnsfrInBank_trnsfrInAccnt = false;
				} else {
					this.trnsfrInBank_trnsfrInAccnt = true;
					this.allowNonAgreeAcctFlag = false;
					output.input = false;
					// this.selectFlag = false;
					// this._handleError.handleError({
					// 	type: 'message',
					// 	title: 'POPUP.NOTICE.TITLE',
					// 	content: "TRANS_SECURITY.ERROR.127",
					// 	classType: "warning"
					// });
					// return false;
				}
				//  -------20190823 Boy 修改 end--------
				return Promise.resolve(output);
			},
			(errorObj) => {
				errorObj['type'] = 'message';
				this._handleError.handleError(errorObj);
				return Promise.reject(errorObj);
			}
		);
	}

	// 常用帳號列表
	public commonAccount() {
		this.showPage = 'commonAccountPage';
		this._headerCtrl.setLeftBtnClick(() => {
			this.cancelEdit();
		});
	}

	// 取得該常用帳號帶回前一頁
	public getCommonAccount(accountObj) {
		this.showPage = 'original';
		//------- 20191014 因應使用者僅有OTP安控機制，而修改-------//
		this.securityAccountObj.flag = true;
		let transAccountType = this._formateService.transClone(this.transactionObj.transAccountType);
		this.securityAccountObj.transAccountType = transAccountType;
		//----------------------------------------------------//
		this.allTransferData.trnsfrInBank = accountObj.bankId + '-' + accountObj.bankName;
		this.allTransferData.trnsfrInAccnt = accountObj.acctNo;
		this.allTransferData.trnsInSetType = accountObj.commonInSetType;
		// 依據所選帳號而切換轉帳機制,1:臨櫃約定/2:線上約定/3:非約定帳號
		if (this.allTransferData.trnsInSetType == '1' || this.allTransferData.trnsInSetType == '2') {
			this.transactionObj.transAccountType = '1';
		} else {
			this.transactionObj.transAccountType = '2';
		}

		this.addCommonAccount = true;
		this.trnsfrInBank_trnsfrInAccntError = false;
		// 判斷是否為合作金庫帳號，以決定備註二的使用權限。
		this.notePayeeCheck(accountObj.bankId);
	}

	// 約定帳號列表
	public agreedAccount() {
		this.showPage = 'agreedAccountPage';
		// this._headerCtrl.setLeftBtnClick(() => {
		// 	this.cancelEdit();
		// });
	}

	// 取得該約定帳號帶回前一頁
	public getAgreedAccount(accountObj) {
		this.showPage = 'original';
		//------- 20191014 因應使用者僅有OTP安控機制，而修改-------//
		this.securityAccountObj.flag = true;
		let transAccountType = this._formateService.transClone(this.transactionObj.transAccountType);
		this.securityAccountObj.transAccountType = transAccountType;
		//----------------------------------------------------//
		this.allTransferData.trnsfrInBank = accountObj.bankId + '-' + accountObj.bankName;
		this.allTransferData.trnsfrInAccnt = accountObj.acctNo;
		this.allTransferData.trnsInSetType = accountObj.trnsInSetType;
		this.transactionObj.transAccountType = '1';

		/** 判斷該約定帳號是否已被加為常用 */
		this.commonTrnsInAccts.forEach(element => {
			this.isCommonAccount.push(element.acctNo);
		});



		/**-------------------------- */
		if(this.securityAccountObj.flag == true){
			this.addCommonAccount = true;
		} else {
			this.addCommonAccount = false;
		}
		this.trnsfrInBank_trnsfrInAccntError = false;
		// 判斷是否為合作金庫帳號，以決定備註二的使用權限。
		this.notePayeeCheck(accountObj.bankId);
	}

	// 取得銀行代碼
	public bankChoose() {
		if (!this.checkAccount()) {
			return false;
		}
		// 手動入統一改為非約轉  0624 Chengwei
		this.transactionObj.transAccountType = '2'
		this.allTransferData.trnsInSetType = '3';
		this.showPage = 'bankPage';
		this.allTransferData.trnsfrInAccnt = '';
	}

	// 編寫備註
	public writingRemark() {
		this.remarks = (this.remarks) ? false : true;
	}

	// 轉帳金額判斷
	public trnsfrAmountCheck(trnsfrAmount: string) {
		const check_obj = this._errorCheck.checkMoney(trnsfrAmount, this.currency)
		if (check_obj.status) {
			this.errorMsg.trnsfrAmountError = '';
		} else {
			this.errorMsg.trnsfrAmountError = check_obj.msg;
		}
		return check_obj;
	}

	/**
	 * 轉帳判斷，若為預約則顯示預約日期。
	 * 在html本來需使用[(ngModel)]allTransferData.trnsfrDate
	 * 但因使用<input-date>tag之output可取到值，故不需在綁定[(ngModel)]
	 * @param date 
	 * 
	 */
	public TransferDate(date?: any) {
		this.allTransferData.trnsfrDate = date;
		if (this.allTransferData.trnsfrDate != (DateUtil.transDate(this.info_data['searchTime'], 'date'))) {
			// 預約改結果電文
			let transAccountType = this.transactionObj.transAccountType;
			this.transactionObj = {
				serviceId: 'f4000401',  // F4000102 即時轉帳，F4000401預約轉帳
				categoryId: '1',
				showCaptcha: this.showCaptcha, // 非約狀態開啟圖形驗證190705cheng wei 
				transAccountType: transAccountType,  // 預設回傳1 (約轉)。 2 為(非約轉)。
				ulStyle: { 'width': '66%', 'padding-left': '0px' }
			};
			this.isCurrentTime = true;
		} else {
			// 非預約改結果電文
			let transAccountType = this.transactionObj.transAccountType;
			this.transactionObj = {
				serviceId: 'f4000102',  // F4000102 即時轉帳，F4000401預約轉帳
				categoryId: '1',
				showCaptcha: this.showCaptcha, // 非約狀態開啟圖形驗證190705cheng wei 
				transAccountType: transAccountType,  // 預設回傳1 (約轉)。 2 為(非約轉)。
				ulStyle: { 'width': '66%', 'padding-left': '0px' }
			};
			this.isCurrentTime = false;
		}
	}

	/**
	 * 加為常用帳號頁
	 */
	public commonAccountAdd() {
		this.goAddCommonAccount = {
			trnsfrInAccnt: this.allTransferData.trnsfrInAccnt,
			trnsfrInBank: this.allTransferData.trnsfrInBank,
			trnsfrInBankCode: this.allTransferData.trnsfrInBank.slice(0, 3),
			trnsfrInBankName: this.allTransferData.trnsfrInBank.slice(4, (this.allTransferData.trnsfrInBank).length),
			backToTWDTransfer: true,
		}
		this.showPage = 'addCommonAccountPage'
	}


	// 銀行代碼測試
	getBankCode(e) {
		this.showPage = 'original';
		this.allTransferData.trnsfrInBank = e.bankName;
		// 判斷是否為合作金庫帳號，以決定備註二的使用權限。
		this.notePayeeCheck(e.bankcode);
		if (this.allTransferData.trnsfrInBank != '') {
			this.trnsfrInBank_trnsfrInAccntError = false;
			this.errorMsg['trnsfrInBankError'] = '';
		}
		/**
		 * 預設加入常用帳號符號不亮。
		 * 若選擇約定帳號後且該約定帳號非『常用帳號』，符號亮燈。
		 * 若選擇約定帳號後，後悔想手動輸入，只可點擊『請輸入銀行代碼』，選完後，符號燈滅(回到預設值)。
		 * 
		 */
		if (this.addCommonAccount != true) {
			this.addCommonAccount = true;
		}
	}
	// 從加入常用帳號頁返回至台幣轉帳編輯頁
	public showOriginalPage() {
		this.showPage = 'original';
		this.addCommonAccount = true;
		//設定header
		this._headerCtrl.updateOption({
			'title': '台幣轉帳'
		});
		this._headerCtrl.setLeftBtnClick(() => {
			this.cancelEdit();
		});

	}

	/**
	 * 給收款人訊息(備註二)檢查
	 * 在選擇本行時，才可使用此備註。
	 */

	public notePayeeCheck(bankCode) {
		if (bankCode == '006') {
			this.notePayeeFlag = false;
		} else {
			this.notePayeeFlag = true;
			this.allTransferData.notePayee = '';
		}

	}

	/**
	 * 加入常用帳號符號判斷
	 * addCommonAccount:true(不可加入)，false(可以加入)
	 * 狀況一:約定帳號已被加為常用帳號()
	 * 
	 * @param trnsfrInAccnt 
	 */
	public addCommonSymbol() {
		// 手動入統一改為非約轉  0624 Chengwei
		let serviceId = this.transactionObj.serviceId;
		this.allTransferData.trnsInSetType = '3';
		this.transactionObj = {
			serviceId: serviceId,  // F4000102 即時轉帳，F4000401預約轉帳
			categoryId: '1',
			showCaptcha: this.showCaptcha, // 非約狀態開啟圖形驗證190705cheng wei 
			transAccountType: '2',  // 預設回傳1 (約轉)。 2 為(非約轉)。
			ulStyle: { 'width': '66%', 'padding-left': '0px' }
		};
		const check_trnsfrInAccnt = this._errorCheck.checkActNum(this.allTransferData.trnsfrInAccnt);    // 轉入帳號檢核
		if (check_trnsfrInAccnt.status) {
			this.errorMsg.trnsfrInAccntError = '';
			this.trnsfrInBank_trnsfrInAccntError = false;
			this.addCommonAccount = false;
		} else {
			this.errorMsg.trnsfrInAccntError = check_trnsfrInAccnt.msg;
			this.trnsfrInBank_trnsfrInAccntError = true;
			this.addCommonAccount = true;
		}
	}

	// 確認頁返回編輯頁
	toEditPage(e) {
		this.allTransferData.trnsfrDate = (DateUtil.transDate(this.allTransferData.trnsfrDate, 'date')).replace(/\//g, '-');
		if (e) {
			this._headerCtrl.setLeftBtnClick(() => {
				this.cancelEdit();
			});
			this.showPage = 'original'
		}
	}

	// 前往確認頁
	public transferConfirm() {
		// OTP 裝置綁定判斷
		if (!this.selectSecurityService.checkSecurityErrorPopup(this.allTransferData.SEND_INFO)) {
			return false;
		};

		// 轉出帳號呈現為XXXX-XXX-XXXXXX(13碼)
		// 但將此值送去檢測會出錯，因為沒有將 '—' 分出，所以會偵測到錯誤
		// 故先檢測空值
		const check_trnsfrOutAccnt = this.allTransferData.trnsfrOutAccnt                                // 轉出帳號檢核
		const check_amount = this.trnsfrAmountCheck(this.allTransferData.trnsfrAmount);                 // 轉帳金額檢核
		const check_trnsfrInBank = this.allTransferData.trnsfrInBank;                                   // 轉入行庫檢核
		const check_trnsfrInAccnt = this._errorCheck.checkActNum(this.allTransferData.trnsfrInAccnt);   // 轉入帳號檢核
		const check_notePayer = this.checkNotLen(this.allTransferData.notePayer);                       // 付款人自我備註
		const check_notePayee = this.checkNotLen(this.allTransferData.notePayee);                       // 給收款人訊息
		let final_notePayee = check_notePayee.str;                                                    // 檢核後給收款人訊息
		let final_notePayer = check_notePayer.str;                                                    // 檢核後給付款人自我備註




		if (check_trnsfrOutAccnt != '') {
			this.errorMsg.trnsfrOutAccntError = '';
			this.trnsfrOutAccntFlag = true;
		} else {
			this.errorMsg.trnsfrOutAccntError = 'PG_TRANSFER.ERROR.TRNSOUTACCT_1';
			this.trnsfrOutAccntFlag = false;

		}

		if (check_amount.status) {
			this.errorMsg.trnsfrAmountError = '';
		} else {
			this.errorMsg.trnsfrAmountError = check_amount.msg;
		}

		if (check_trnsfrInBank != '') {
			this.errorMsg.trnsfrInBankError = '';
			this.trnsfrInBank_trnsfrInAccntError = false;
		} else {
			this.errorMsg.trnsfrInBankError = '請選擇轉入行庫';
			this.trnsfrInBank_trnsfrInAccntError = true;
		}

		if (check_trnsfrInAccnt.status) {
			this.errorMsg.trnsfrInAccntError = '';
			this.trnsfrInBank_trnsfrInAccntError = false;
			//----------------限額判斷start-----------------------------------//
			/**
			 * 放限額型態判斷
			 * value = 1 臨櫃約定 單筆限額2000000(200萬)
			 * value = 2 線上約定 單筆限額50000(5萬)
			 * 
			 * 20190904 Boy 
			 * 將非約定 單筆限額由30000(3萬)調至50000(5萬)
			 * value = 3 非約定 單筆限額50000(5萬)
			 */
			this.trnsInAccts.forEach(element => {
				this.agreedAccountList[element.acctNo] = element.trnsInSetType;
			})

			if ('3' == this.allTransferData.trnsInSetType) {
				if (parseInt(this.allTransferData.trnsfrAmount) > 50000) {
					this._handleError.handleError({
						type: 'dialog',
						title: 'POPUP.NOTICE.TITLE',
						content: "非約定單筆已超過限額"
					});
					check_trnsfrInAccnt.status = false;
				}
			} else if ('1' == this.allTransferData.trnsInSetType) {
				if (parseInt(this.allTransferData.trnsfrAmount) > 2000000) {
					this._handleError.handleError({
						type: 'dialog',
						title: 'POPUP.NOTICE.TITLE',
						content: "臨櫃約定單筆轉帳已超過限額"
					});
					check_trnsfrInAccnt.status = false;
				}
			} else {
				if (parseInt(this.allTransferData.trnsfrAmount) > 50000) {
					this._handleError.handleError({
						type: 'dialog',
						title: 'POPUP.NOTICE.TITLE',
						content: "線上約定單筆轉帳已超過限額"
					});
					check_trnsfrInAccnt.status = false;
				}
			}
			//----------------限額判斷end----------------------------------//


			//----------------轉入帳號不得與轉出帳號相同判斷start-----------------------------------//
			if (this._modifyAccount(this.allTransferData.trnsfrInAccnt) == this.allTransferData.trnsfrOutAccnt.replace(/-/g, '')) {

				this._handleError.handleError({
					type: 'dialog',
					title: 'POPUP.NOTICE.TITLE',
					content: "轉入帳號不得與轉出帳號相同"
				});
				check_trnsfrInAccnt.status = false;
			}
			//----------------轉入帳號不得與轉出帳號相同判斷end----------------------------------//
		} else {
			this.errorMsg.trnsfrInAccntError = check_trnsfrInAccnt.msg;
			this.trnsfrInBank_trnsfrInAccntError = true;
		}

		if (check_notePayer.status) {
			this.errorMsg.notePayerError = '';
		} else {
			this.errorMsg.notePayerError = check_notePayer.msg;
		}

		if (check_notePayee.status) {
			this.errorMsg.notePayeeError = '';
		} else {
			this.errorMsg.notePayeeError = check_notePayee.msg;
		}

		if (check_amount.status && !this.trnsfrInBank_trnsfrInAccntError &&
			check_trnsfrInAccnt.status && check_notePayer.status && check_notePayee.status && this.trnsfrOutAccntFlag) {
			this.allTransferData = {
				custId: '',
				trnsfrDate: (DateUtil.transDate(this.allTransferData.trnsfrDate, 'date')).replace(/-/g, '/'),
				trnsfrOutAccnt: this.allTransferData.trnsfrOutAccnt,
				trnsfrInBank: this.allTransferData.trnsfrInBank,
				trnsfrInAccnt: this.allTransferData.trnsfrInAccnt,
				trnsfrAmount: this.allTransferData.trnsfrAmount,
				notePayer: final_notePayer,
				notePayee: final_notePayee,
				businessType: this.info_data['info_data'].businessType,
				trnsToken: this.info_data['info_data'].trnsToken,
				trnsfrType: '',
				trnsInSetType: this.allTransferData.trnsInSetType,
				SEND_INFO: this.allTransferData.SEND_INFO,
				USER_SAFE: this.allTransferData.USER_SAFE
			}
			this.showPage = 'confirmPage';
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
	 * 
	 * 	送電文
	 *  sendCurrent: 即時轉帳，sendReservation: 預約轉帳。
	 * @param security 
	 * 
	 */

	public finalCheckData(security) {
		// ||後是為了要判斷選擇SSL後的轉帳方式
		if (security.serviceId === 'f4000102' ||
			this.allTransferData.trnsfrDate == (DateUtil.transDate(this.info_data['searchTime'], 'date'))) {
			this.allTransferData.trnsfrType = '即時轉帳';
			this._mainService.sendCurrent(this.allTransferData, security).then(
				(result) => {
					if (result.status) {
						this.showPage = 'resultPage';
						this.transferResultData = result.info_data;
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
				})
		} else {
			this.allTransferData.trnsfrType = '預約轉帳';
			// this.transactionObj.serviceId = 'F4000401';
			this._mainService.sendReservation(this.allTransferData, security).then(
				(result) => {
					if (result.status) {
						this.showPage = 'resultPage';
						this.transferResultData = result.info_data;
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
				})
		}
	}



	/**
	 * 	安控選擇
	 * @param e 
	 */
	securityOptionBak(e) {
		if (e.status) {
			// 取得需要資料傳遞至下一頁子層變數
			this.allTransferData.SEND_INFO = e.sendInfo;
			this.allTransferData.USER_SAFE = e.sendInfo.selected;
		} else {
			// do errorHandle 錯誤處理 推業或POPUP
			e['ERROR']['type'] = 'dialog';
			this._handleError.handleError(e.ERROR).then(() => {
				let allowSecurity = this._authService.getAllowSecurity();
				if (this.transactionObj.transAccountType == '2') {
					// 非約轉需檢核
					if (!allowSecurity.ca
						&& !allowSecurity.otp
					) {
						// OTP檢核
						this._authService.checkSecurityOtp();
					}
				}
			});
			//------- 20191014 因應使用者僅有OTP安控機制，而修改-------//
			if (this.securityAccountObj.flag == true) {
				this.allTransferData.trnsfrInBank = '';
				this.allTransferData.trnsfrInAccnt = '';
				this.allTransferData.trnsInSetType = '';
				this.securityAccountObj.flag = false;
			} 
			//----------------------------------------------------//
		}
	}

	/**
	 * 檢查轉入帳號是否與轉出帳號相同
	 * 由service取得轉出帳號(本行)皆為13碼，並沒有加入'-'
	 * 轉入帳號：
	 * A：約定帳號
	 * 	他行帳號顯示為16碼
	 * 	本行帳號顯示為XXXX-XXX-XXXXXX
	 * B:非約定帳號
	 * 	常用帳號(含他行及本行)-------皆顯示16碼
	 * 	手動輸入------輸入長度最少13碼最多16碼
	 * 
	 * 故將全部轉入帳號由左邊開始將零刪除至非零，並將除帳號補至13碼，在與轉出帳號進行判斷。
	 * @param str 
	 */
	private _modifyAccount(str) {
		let output = ReplaceUtil.baseSymbol(str);
		output = ReplaceUtil.replaceLeftStr(output);
		if (output.length < 13) {
			output = PadUtil.padLeft(output, 13); // 左補0
		}
		return output;
	}

	/**
	 * 檢查付款人自我備註與給收款人訊息(限本行轉入帳號)
	 * 
	 * @param str 
	 * 
	 */
	checkNotLen(str: string) {
		let data = {
			status: true,
			msg: '',
			str: str
		}
		let chinese = false;
		let check_str = EmptyUtil.done(str,'all');
		if (check_str == '' ||  check_str == ' ') {
			str = ''
			data.str = str;
		}
		for (let i = 0; i < str.length; i++) {
			if ((str.charCodeAt(i) >= 0) && (str.charCodeAt(i) <= 255)) {

			} else {
				//有中文
				chinese = true;
				break;
			}
		}
		if (chinese && str.length > 8) {
			data.msg = 'PG_TRANSFER.ERROR.NOTE'
			data.status = false;
		} else if (str.length > 18) {
			data.msg = 'PG_TRANSFER.ERROR.NOTE'
			data.status = false;
		}
		return data;
	}

	/**
	 * 檢核約轉非約轉
	 */
	private checkAccount() {
		let output = true;
		if (!this.allowNonAgreeAcctFlag) {
			output = false;
			this._handleError.handleError({
				type: 'dialog',
				title: 'POPUP.NOTICE.TITLE',
				content: '您尚未開放非約定轉帳機制'
			});
		}
		return output;
	}

}
