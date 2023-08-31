/**
 * 線上簽約對保-申請進度查詢 
 * 在這控制頁面切換與資料傳遞
 * (sign-main)-search-edit-contract-result
 * sign-main  控制頁(不顯示)
 * serach     查詢頁
 * edit       編輯頁
 * date-select 選擇日期頁
 * contract   合約頁
 * result     結果頁
 */
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { PaginatorCtrlService } from '@shared/paginator/paginator-ctrl.srevice';
import { SignProtectSearchPageComponent } from '../search/sign-protect-search-page.component';
import { SignProtectService } from '@pages/online-loan/shared/service/sign-protect.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { FormateService } from '@shared/formate/formate.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { AuthService } from '@core/auth/auth.service';


@Component({
	selector: 'app-sign-protect-main',
	templateUrl: './sign-protect-main-page.component.html',
	styleUrls: [],
	providers: [PaginatorCtrlService, SignProtectService]
})
export class SignProtectMainPageComponent implements OnInit {

	@ViewChild('pageBox', { read: ViewContainerRef }) pageBox: ViewContainerRef;
	transactionObj = {
		serviceId: 'F9000502', // 交易結果電文編號
		categoryId: '10', // 亂打目前未定義10為哪個功能
		showCaptcha: true,
		transAccountType: '2', // 非約功能
		customAuth: ['2', '3'] // 客製權限
	};
	securityData = {};
	securityObj = {
		'action': 'init',
		'sendInfo': {}
	};

	showPage = '';     // 頁面切換
	pageCounter = 1;   // 當前頁次
	totalPages = 0;    // 全部頁面
	fullData: any;     // 帶往下一頁之資料
	custInfo = {};     // 個人基本資料
	resultInfo = {};   // 存放結果頁資料
	todayDate = '';    // 
	contract: any; // 借款契約草稿內容(暫存)
	draftContract = {
		draft: '',
		staff: ''
	}; // 借款契約草稿內容
	signDate = '';  // 今日日期
	chineseDate = ''; // 今天明國年
	resultFlag = ''; // 結果頁呈現

	reqDate = {
		custId: '',
		txKind: '',
		ebkCaseNo: ''
	};

	// 502request 
	sendData = {
		custId: '',
		ebkcaseno: '',
		isStaff: '',
		aprprdbgn: '',
		aprprdend: '',
		singAgree: 'N', // 客戶是否同意核准條件(Y: 同意 N: 不同意)
		singKind: '',
		singelDate: '',
		blobData: '',
		blobDataStaff: '',
		trnsToken: '',
		sendInfo: [],
		user_safe: ''
	};

	// 504response
	otherInfo = {};
	private _defaultHeaderOption: any; // header setting暫存

	constructor(
		private _logger: Logger,
		private navgator: NavgatorService,
		private _handleError: HandleErrorService,
		private _headerCtrl: HeaderCtrlService,
		private paginatorCtrl: PaginatorCtrlService,
		private signProtectService: SignProtectService,
		private _checkSecurityService: CheckSecurityService,
		private _formateService: FormateService,
		private confirm: ConfirmService,
		private authService: AuthService,
	) { }

	ngOnInit() {
		this.showPage = 'inquiryPage';
	}


	/**
	 * Scroll Event
	 * @param next_page
	 */
	onScrollEvent(next_page) {
		this._logger.log('pageCounter:', this.pageCounter, 'next_page:', next_page);
		this.pageCounter = next_page;
		const componentRef: any = this.paginatorCtrl.addPages(this.pageBox, SignProtectSearchPageComponent);
		componentRef.instance.page = next_page;
		componentRef.instance.backPageEmit.subscribe(event => this.onPageBackEvent(event));
		componentRef.instance.errorPageEmit.subscribe(event => this.onErrorBackEvent(event));
	}

	/**
	 * 列表回傳
	 * @param e
	 */
	onPageBackEvent(e) {
		let page = 'list';
		let pageType = 'list';
		let tmp_data: any;
		let custInfo: any;
		let date: any;

		let signDate: any;
		let otherReqData: any;
		if (typeof e === 'object') {
			if (e.hasOwnProperty('page')) {
				page = e.page;
			}
			if (e.hasOwnProperty('type')) {
				pageType = e.type;
			}
			if (e.hasOwnProperty('data')) {
				// 清單頁來的
				tmp_data = e.data;
			}
			if (e.hasOwnProperty('custInfo')) {
				custInfo = e.custInfo;
			}
			if (e.hasOwnProperty('date')) {
				date = e.date;
			}
			if (e.hasOwnProperty('signDate')) {
				signDate = e.signDate;
			}
			if (e.hasOwnProperty('otherReqData')) {
				otherReqData = e.otherReqData;
			}

		}

		if (page == 'list-item' && pageType == 'page_info') {
			// 設定頁面資料
			this._logger.error("back to main page");
			this._headerCtrl.setLeftBtnClick(() => {
				this.navgator.push("online-loan");
			});
			if (tmp_data.hasOwnProperty('page_info') && this.pageCounter == 1) {
				// 第一頁才要設定，其他不變
				this.totalPages = tmp_data['page_info']['totalPages'];
			} else {
				return false;
			}
		}

		// 前往編輯頁
		if (page == 'sign-search' && pageType == 'go-sign') {
			this._logger.log("into goSign back main");
			// 多補組504資料
			this.fullData = tmp_data;
			this.custInfo = custInfo;
			this.getOtherData(otherReqData).then(
				(success) => {
					// 塞504資料
					this.otherInfo = success;
					this.sendData['isStaff'] = success.info_data.isStaff;
					this.sendData['trnsToken'] = success.info_data.trnsToken;
					this.draftContract = {
						draft: '',
						staff: ''
					};
					if (success.info_data.isStaff == 'Y') {
						if (success['agreeData'].hasOwnProperty('H2')) {
							this.draftContract['staff'] = success['agreeData']['H2'];
						}
					}
					if (success['agreeData'].hasOwnProperty('H1')) {
						this.draftContract['draft'] = success['agreeData']['H1'];
					}

					// 導頁
					this.showPage = 'editPage';
				}
			);
		}
		// 編輯頁面(左側返回)至查詢頁
		if (page == 'sign-edit' && pageType == 'back') {
			this._logger.log("into sign-edit back");
			this.showPage = 'inquiryPage';
			return false;
		}

		// 前往撥款日期頁
		if (page == 'sign-date' && pageType == 'go-date') {
			this._logger.error('main-date custInfo', this.custInfo);
			this.showPage = 'datePage';
			this._headerCtrl.setLeftBtnClick(() => {

			});

		}

		// 前往合約頁
		if (page == 'sign-contract' && pageType == 'go-contract') {

			this.fullData = tmp_data;
			this.custInfo = custInfo;
			this.reqDate.custId = this.custInfo['id_no'];
			this.reqDate.txKind = this.fullData['txKind'];
			this.reqDate.ebkCaseNo = this.fullData['ebkCaseNo'];
			this.signDate = signDate;
			this.todayDate = date;
			this.showPage = 'contractPage';
			this._logger.error('this.reqDate:', this.reqDate);
			// this._headerCtrl.setLeftBtnClick(() => {
			// 	this.showPage = 'inquiryPage';
			// });
		}
		// 顯示安控頁
		if (page == 'security' && pageType == 'go-security') {
			//
			// this.sendData
			let OtpCustInfo = this.authService.getTmpInfo('OtpCustInfo');
			if (!!OtpCustInfo) {
				if (!!OtpCustInfo['PhoneNo']) {
					tmp_data['phoneNum'] = OtpCustInfo['PhoneNo'];
				}
			}
			this.showPage = 'securityPage';
			this.chineseDate = signDate;
			this.sendData['aprprdbgn'] = tmp_data['aprprdbgn'];
			this.sendData['aprprdend'] = tmp_data['aprprdend'];
			this.sendData['singelDate'] = tmp_data['singelDate'].replace(/\-/g, '');
			this.sendData['singKind'] = '1';
			this.sendData['singAgree'] = 'Y';
			this.sendData['blobData'] = tmp_data['blobData'];
			this.sendData['blobDataStaff'] = tmp_data['blobDataStaff'];
			this.sendData['phoneNum'] = tmp_data['phoneNum'];
			this.sendData['trnsToken'] = tmp_data['trnsToken'];
			this.sendData['ebkcaseno'] = custInfo['ebkCaseNo'];
			this.resultFlag = 'success';
			this._headerCtrl.setLeftBtnClick(() => {
				this.showPage = 'contractPage';

			});
		}

		// 前往結果頁
		if (page == 'sign-result' && pageType == 'go-result') {

			// this.signDate = signDate;
			// // this.sendDate(this.custInfo);

		}

		// 案件核准條件點選不同意時
		if (page == 'sign-disagree' && pageType == 'go-disagree') {
			this._logger.error('disagree page!');

			this.fullData = tmp_data;
			this.custInfo = custInfo;
			this.resultFlag = 'disagree';
			this.sendData['custId'] = this.custInfo['id_no'];
			this.sendData['ebkcaseno'] = this.fullData['ebkCaseNo'];
			this.sendData['singAgree'] = 'N';
			this.sendData['trnsToken'] = this.custInfo['trnsToken'];

			this.sendDate(this.sendData);
		}


		// 客戶選擇親赴分行時
		if (page == 'sign-goto' && pageType == 'go-goto') {
			this._logger.error('goto page!');
			this.fullData = tmp_data;
			this.custInfo = custInfo;
			this.resultFlag = 'goto';
			this.sendData['custId'] = this.custInfo['id_no'];
			this.sendData['ebkcaseno'] = this.fullData['ebkCaseNo'];
			this.sendData['trnsToken'] = this.custInfo['trnsToken'];
			this.sendData['singAgree'] = 'Y';
			this.sendData['singKind'] = '2';
			this.sendDate(this.sendData);
		}
	}



	// 安控下拉
	securityOptionBak(e) {
		if (e.status) {
			// 取得需要資料傳遞至下一頁子層變數
			this.securityData['sendInfo'] = e.sendInfo;
			this.securityData['user_safe'] = e.sendInfo.selected;
		} else {
			// if(this.selectFlag){
			// do errorHandle 錯誤處理 推業或POPUP
			e['type'] = 'dialog'; //2019/01/06改為alert
			// e['button'] = 'PG_ONLINE.BTN.BACKLOAN';
			// e['backType'] = 'online-loan';
			this._handleError.handleError(e.ERROR);
			// }
		}
	}
	// 安控頁取消
	cancelEdit() {

		this.confirm.show('您是否放棄此次編輯?', {
			title: '提醒您',
			btnYesTitle: '確定',
			btnNoTitle: '取消'
		}).then(
			() => {
				this.navgator.push('online-loan');
			}, () => { }
		);


	}
	// 安控頁確認送出
	finalCheck() {
		this.securityObj = {
			'action': 'submit',
			'sendInfo': this.securityData['sendInfo']
		};
	}
	// 針對選擇的安控做處理
	stepBack(e) {
		if (e.status) {
			// OTP須帶入的欄位
			if (e.securityType === '3') {
				e.otpObj.depositNumber = this._formateService.checkField(this.custInfo, 'account') ? this.custInfo['account'] : '1234567890123';
				e.otpObj.depositMoney = '0'; // 金額
				e.otpObj.OutCurr = 'TWD'; // 幣別
				e.transTypeDesc = ''; //
			} else if (e.securityType === '2') {
				// console.log('123sendData', this.sendData);
				// 憑證須帶入的欄位
				e.signText = {
					custId: this.custInfo['id_no'],
					ebkcaseno: this._formateService.checkField(this.sendData, 'ebkcaseno'),
					isStaff: this._formateService.checkField(this.sendData, 'isStaff'),
					aprprdbgn: this._formateService.checkField(this.sendData, 'aprprdbgn'),
					aprprdend: this._formateService.checkField(this.sendData, 'aprprdend'),
					singAgree: this._formateService.checkField(this.sendData, 'singAgree'),
					singKind: this._formateService.checkField(this.sendData, 'singKind'),
					singelDate: this._formateService.checkField(this.sendData, 'singelDate'),
					blobData: this._formateService.checkField(this.sendData, 'blobData'),
					blobDataStaff: this._formateService.checkField(this.sendData, 'blobDataStaff'),
					phoneNum: this._formateService.checkField(this.sendData, 'phoneNum'),
					trnsToken: this._formateService.checkField(this.sendData, 'trnsToken')
				};
			}
			// 統一叫service 做加密
			this._checkSecurityService.doSecurityNextStep(e).then(
				(securityResult_S) => {
					this.sendDate(this.sendData, securityResult_S);
				}, (securityResult_F) => {
					if (securityResult_F['errorCode'] != 'USER_CANCEL' && securityResult_F['errorCode'] != '') {
						securityResult_F['type'] = 'message';
						securityResult_F['button'] = 'PG_ONLINE.BTN.BACKLOAN';
						securityResult_F['backType'] = 'online-loan';
						this._handleError.handleError(securityResult_F);
					}
				}
			);
		} else {
			return false;
		}
	}


	/**
	 * 失敗回傳
	 * @param error_obj 失敗物件
	 */
	onErrorBackEvent(e) {
		let page = 'list';
		let pageType = 'list';
		let errorObj: any;
		if (typeof e === 'object') {
			if (e.hasOwnProperty('page')) {
				page = e.page;
			}
			if (e.hasOwnProperty('type')) {
				pageType = e.type;
			}
			if (e.hasOwnProperty('data')) {
				errorObj = e.data;
			}
		}

		switch (page) {
			// page1 error回傳
			case 'list-item':
				// == 分頁返回 == //
				if (this.pageCounter == 1) {
					// 列表頁：首次近來錯誤推頁
					errorObj['type'] = 'message';
					errorObj['button'] = 'PG_ONLINE.BTN.BACKLOAN';
                    errorObj['backType'] = 'online-loan';
					this._handleError.handleError(errorObj);
				} else {
					// 其他分頁錯誤顯示alert錯誤訊息
					errorObj['type'] = 'dialog';
					this._handleError.handleError(errorObj);
				}
				break;
			case 'content':
				// == 內容返回(先顯示列表再顯示錯誤訊息) == //
				this.onChangePage('list');
				errorObj['type'] = 'dialog';
				this._handleError.handleError(errorObj);
				break;
		}
	}

	/**
	* 頁面切換
	* @param pageType 頁面切換判斷參數
	* @param pageData 其他資料
	*/
	onChangePage(pageType: string, pageData?: any) {
		switch (pageType) {
			case 'list':
			case 'inquiryPage':
				this.showPage = 'inquiryPage';
				break;
			default:
				this._resetPage();
				this.showPage = 'inquiryPage';
				this._headerCtrl.updateOption(this._defaultHeaderOption);
				break;
		}
	}


	private _resetPage() {
		this.pageCounter = 1;
		this.totalPages = 0;
	}


	// 送f9000502電文
	sendDate(sendData: any, securityResult?) {

		this._logger.error('f9000502 requestData', sendData);

		let reqHeader = null;
		if (securityResult) {
			reqHeader = {
				header: securityResult.headerObj
			};
		}

		this.signProtectService.sendDate(sendData, reqHeader).then(
			(success) => {
				this._logger.error('get F9000502 api successful!!!');
				if (success['info_data'].respCode != '4001' && success['info_data'].result != '0') {
					this.resultFlag = 'failed';
				}
				this.showPage = 'resultPage';
				this.resultInfo = success;
			},
			(failed) => {
				this._logger.error('get F9000502 api faile!!!!!!');
				failed['type'] = 'message';
				failed['button'] = 'PG_ONLINE.BTN.BACKLOAN';
				failed['backType'] = 'online-loan';
				this._handleError.handleError(failed);
				this._headerCtrl.updateOption({
					'leftBtnIcon': 'menu'
				});
			}
		);
	}

	// 取得借款契約草稿(f9000403)
	// getContract(reqData: any) {
	// 	this.signProtectService.getTerm(reqData).then(
	// 		(success) => {
	// 			this._logger.error('get F9000403 api successful!!!');
	// 			this.showPage = 'contractPage';
	// 			this.contract = success.detail;
	// 			this.contract.forEach(element => {
	// 				switch (element.dataType) {
	// 					case 'H1':
	// 						this.draftContract = element.blobData;
	// 				}
	// 			});
	// 		},
	// 		(failed) => {
	// 			this._logger.error('get F9000403 api faile!!!!!!');
	// 			failed['type'] = 'message';
	// 			this._handleError.handleError(failed);
	// 			this._headerCtrl.updateOption({
	// 				'leftBtnIcon': 'menu'
	// 			});
	// 		}
	// 	)
	// }

	// 取得期間與利率與是否為員工(f9000504) 之後要改為合約與取代值由504
	getOtherData(reqData: any) {
		this._logger.error('f9000504 requestData', reqData);
		return this.signProtectService.getOtherInfo(reqData).then(
			(success) => {
				this._logger.error('get F9000504 api successful!!!');

				return Promise.resolve(success);
			},
			(failed) => {
				this._logger.error('get F9000504 api faile!!!!!!');
				failed['type'] = 'message';
				failed['button'] = 'PG_ONLINE.BTN.BACKLOAN';
				failed['backType'] = 'online-loan';
				this._handleError.handleError(failed);
				return Promise.reject(false);
			}
		);
	}

}
