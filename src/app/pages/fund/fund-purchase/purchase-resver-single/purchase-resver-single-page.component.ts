/**
 * 基金申購(預約單筆申購)
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { CheckService } from '@shared/check/check.service';
import { FundPurchaseSingleService } from '@pages/fund/shared/service/fund-purchase-single.service';
import { FundInvestDes } from '@conf/terms/fund/fund-invest-des';
import { InfomationService } from '@shared/popup/infomation/infomation.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { FundInformation1 } from '@conf/terms/fund/fund-information1';
import { FundInformation2 } from '@conf/terms/fund/fund-information2';
import { AlertService } from '@shared/popup/alert/alert.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';

@Component({
	selector: 'app-purchase-resver-single',
	templateUrl: './purchase-resver-single-page.component.html',
	styleUrls: [],
	providers: [FundPurchaseSingleService]
})
export class PurchaseResverSinglePageComponent implements OnInit {
	/**
	  * 參數處理
	  */
	@Input() setInfo: any; //fi000401 資訊
	@Input() set_twAcnt: any; //台幣約定轉出帳號
	@Input() set_frgn: any; //外幣約定轉出帳號
	@Input() set_trust: any; //信託帳號
	@Input() fundSubject: any; //投資基金標的
	@Input() fundStatus: any; //紀錄基金狀態(國內、國外、精選、)
	@Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
	@Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
	nowPage = 'single_edit_1'; //顯示哪一頁
	showCheck = true; //是否打勾
	showDisable = false;
	item = {}; //選擇的扣款帳號(台幣)，綁ngModel

	autoFlag = false;
	immFlag = false;
	emailFlag = false;
	sales = []; // 銷售人員資訊，整理過
	intro = []; //轉借人員資訊，整理過
	today = ''; //預設今天

	// 頁面錯誤訊息
	errorMsg = {
		amount: '',
		balance1: '',
		balance2: ''
	};

	//ngModel綁定
	inp_data = {
		twAcntNo: '', //台幣轉出帳號
		frgnNo: '', //外幣轉出帳號
		trustNo: '', //信託帳號
		amount: '', //金額
		currType: '', //台幣：1，外幣：2
		date: '', //申購日期
		sales: '', //理財專員
		intro: '' //轉借人員
	}

	//----------- 停損停利設定(資訊，使用者輸入，綁ngModel) ----------
	balanceData = {
		custId: '',
		details: {
			detail: [
				{
					trustAcnt: '',
					transCode: '',
					fundCode: '',
					capital: '',
					incomePoint: '', //停損點
					profitPoint: '', //獲利點
					webNotice: 'N', //即時(通知)
					emailNotice: 'N', //email(通知)
					code: '',
					investType: '',
					incomeState: ''
				}
			]
		}
	}
	agree1 = false;
	agree2 = false;
	agree3 = false;
	//*送往下一頁的值，使用者輸入
	singleReq = {
		custId: '',
		trustAcnt: '', //信託帳號
		fundCode: '',//基金代碼
		currType: '', //台幣：1，外幣：2
		amount: '', //金額
		payAcnt: '', //轉出帳號(外幣)
		salesId: '', //銷售行員ID
		salesName: '', //銷售行員姓名
		introId: '', //轉借人員ID
		introName: '', //轉借人員姓名
		date: '' //申購日期
	};

	//----------- 檢查金額 --------------
	saveAmount = {};
	amount_error = ''; //金額檢核錯誤訊息
	checkAmount = false; //是否顯示紅框(金額)
	amountPlace = '';

	//----------- 檢查日期 --------------
	saveDate = {};
	date_error = '';

	//----------- 是否顯示紅框 -----------
	checkDate = false;
	check_trust = false;
	check_twAcnt = false;
	check_frgn = false;
	check_sales = false;
	check_intro = false;

	continue = false;
	showFundBook = false; //控制「基金公開說明書」checkbox
	showFundInfo = false; //控制「基金通路資訊」checkbox

	//----------- 接收fi000403基金申購申請 -----------
	purchaseInfo: any = {};

	constructor(
		private _logger: Logger
		, private _headerCtrl: HeaderCtrlService
		, private _handleError: HandleErrorService
		, private _formateServcie: FormateService
		, private navgator: NavgatorService
		, private _checkService: CheckService
		, private _mainService: FundPurchaseSingleService
		, private infomationService: InfomationService
		, private confirm: ConfirmService
		, private alert: AlertService
		, private _uiContentService: UiContentService
	) {

	}


	ngOnInit() {
		this.nowPage = 'single_edit_1';
		this._headerCtrl.updateOption({
			'leftBtnIcon': 'back',
			'title': '基金單筆申購(預約)'
		});
		this._headerCtrl.setLeftBtnClick(() => {
			// switch (this.nowPage) {
			// 	case 'single_edit_1':
			// 		this.leftBack('edit1');
			// 		break;
			// 	case 'single_edit_2':
			// 		this.leftBack('edit2');
			// 		break;
			// 	case 'single_edit_3':
			// 		this.leftBack('edit3');
			// 		break;
			// }
			this.confirm.show('您是否放棄此次編輯?', {
                title: '提醒您'
              }).then(
                () => {
                  // 返回投資理財選單
                  this.navgator.push('fund');
                },
                () => {
                }
              );
		});

		this.inp_data['trustNo'] = this.set_trust[0].trustAcntNo;
		//整理轉售人員資料
		this.intro = this._mainService.intro_sort(this.set_trust);
		//整理銷售人員資料
		this.sales = this._mainService.sales_sort(this.set_trust);
		//將基金代碼帶入
		this.singleReq['fundCode'] = this.fundSubject['fundCode'];
		//抓取今天時間，帶入預設日期
		this.today = this._mainService.setToday('resver');
		this.inp_data['date'] = this.today;

	}

	//點擊國內or國外
	selectCurr(curr) {
		//國內
		if (this.fundStatus.foreginType == '1') {
			if (curr == 'twd') {
				this.showCheck = true;
				this.showDisable = false;
				//使用者反悔，將相反欄位清空，ex:點台幣，清空外幣
				this.singleReq.payAcnt = '';
				this.amountPlace = '請輸入金額';
			} else if (curr == 'forgen') {
				this.showCheck = true;
				this.showDisable = true;
				//使用者反悔，將相反欄位清空，ex:點台幣，清空外幣
				this.singleReq.payAcnt = '';
				this._handleError.handleError({
					type: 'dialog',
					title: 'POPUP.NOTICE.TITLE',
					content: 'CHECK.STRING.TWD_SUBJECT'
				});
				this.amountPlace = '請輸入金額';
				//外幣約定轉出帳號，有可能沒資料，要跳出訊息
				if (this.set_frgn.length <= 0 || typeof this.set_frgn === null) {
					this._handleError.handleError({
						type: '提醒您',
						title: '我知道了',
						content: '請先臨櫃辦理約定「外幣轉出帳號」'
					});
				}
			}
			//國外
		} else if (this.fundStatus.foreginType == '2') {
			if (curr == 'twd') {
				this.showCheck = true;
				this.showDisable = false;
				//使用者反悔，將相反欄位清空，ex:點台幣，清空外幣
				this.singleReq.payAcnt = '';
				this.amountPlace = '請輸入金額';
			} else if (curr == 'forgen') {
				this.showCheck = false;
				this.showDisable = false;
				//使用者反悔，將相反欄位清空，ex:點台幣，清空外幣
				this.singleReq.payAcnt = '';
				this.amountPlace = '請輸入金額';

				//外幣約定轉出帳號，有可能沒資料，要跳出訊息
				if (this.set_frgn.length <= 0 || typeof this.set_frgn === null) {
					this._handleError.handleError({
						type: '提醒您',
						title: '我知道了',
						content: '請先臨櫃辦理約定「外幣轉出帳號」'
					});
				}
			}
		}
	}

	//點擊確認
	onConfirm() {
		//檢查風險屬性符合?
		//rtType：1,不可買RR4、RR5, rtType：2,不可買RR5
		if (this.setInfo['rtType'] == '1' && (this.fundSubject['risk'] == 'RR4' || this.fundSubject['risk'] == 'RR5')) {
			this.rangeCheck();
			return false;
		}
		if (this.setInfo['rtType'] == '2' && this.fundSubject['risk'] == 'RR5') {
			this.rangeCheck();
			return false;
		}

		//檢查金額
		this.saveAmount = this._checkService.checkMoney(this.inp_data.amount);
		this._logger.log("saveAmount:", this.saveAmount);
		if (this.saveAmount['status'] == false) {
			this.amount_error = this.saveAmount['msg'];
			this.checkAmount = true;
			this.singleReq['amount'] = '';
		} else {
			this.checkAmount = false;
			this.singleReq['amount'] = this.inp_data['amount'];
		}

		//檢查申購日期
		this.saveDate = this._checkService.checkDate(this.inp_data.date);
		this._logger.log("saveDate:", this.saveDate);
		if (this.saveDate['status'] == false) {
			this.date_error = this.saveDate['msg'];
			this.checkDate = true;
			this.singleReq['date'] = '';
		} else {
			this.checkDate = false;
			this.singleReq['date'] = this.saveDate['formate'];
		}

		//檢查信託帳號
		// if (this.inp_data['trustNo'] == '') {
		// 	this.check_trust = true;
		// 	this.singleReq['trustAcnt'] = '';
		// } else {
		// 	this.check_trust = false;
		// 	this.singleReq['trustAcnt'] = this.inp_data['trustNo']['trustAcntNo'];
		// }


		if (this.showCheck == true) {
			this.singleReq['currType'] = '1';
			//檢查扣款帳號(台幣)
			if (this.inp_data['twAcntNo'] == '') {
				this.check_twAcnt = true;
				this.singleReq['payAcnt'] = '';
			} else {
				this.check_twAcnt = false;
				this.singleReq['payAcnt'] = this.inp_data['twAcntNo']['twAcntNo'];
			}
			if (this.singleReq['amount'] && this.singleReq['date']
				&& this.inp_data['twAcntNo'] !== '' && this.inp_data['trustNo'] !== '') {
				this.nowPage = 'single_edit_2';
				this._logger.log("singleReq:", this.singleReq);
				this._logger.log("inp_data", this.inp_data);
			} else {
				return false;
			}

		} else {
			this.singleReq['currType'] = '2';
			//檢查扣款帳號(外幣)
			if (this.inp_data['frgnNo'] == '') {
				this.check_frgn = true;
				this.singleReq['payAcnt'] = '';
			} else {
				this.check_frgn = false;
				this.singleReq['payAcnt'] = this.inp_data['frgnNo']['frgnAcntNo'];
			}
			if (this.singleReq['amount'] && this.singleReq['date']
				&& this.inp_data['frgnNo'] != '' && this.inp_data['trustNo'] !== '') {
				this.nowPage = 'single_edit_2';
				this._logger.log("singleReq:", this.singleReq);
				this._logger.log("inp_data", this.inp_data);
			} else {
				return false;
			}
		}
	}

	//點擊上一步
	onBack() {
		this.onBackPageData({});
	}

	//點擊取消
	onCancel() {
		this.navgator.push('fund');
	}

	private rangeCheck() {
		this.confirm.show('您本次欲申購/轉入的基金「' + this.fundSubject['fundCode'] + this.fundSubject['fundName'] + '(' + this.fundSubject['risk'] + ')' + '」，其風險等級為' + this.fundSubject['risk']
			+ '，已較您投資屬性之風險承受度高，本行依主管機關規定，當您購買商品風險等級超出您的投資屬性之風險承受度時(如下)，將不可進行交易。\n'
			+ '*保守型客戶不可購買風險等級為RR4-RR5之商品。\n' + '*穩健型客戶不可購買風險等級為RR5之商品。請點選下方按鈕進行「風險承受度測驗」後，再重新進行基金下單交易。', {
				title: '提醒您',
				btnYesTitle: '風險承受度測驗',
				btnNoTitle: '取消'
			}).then(
				() => {
					//繼續(popup)內層
					//跳轉風險成受度測驗
					this.navgator.push('fund-group-resk-test');
				},
				() => {
					//離開(popup)內層
					this.navgator.push('fund');
				}
			);
		return false;
	}

	//---------------------------------- 編輯頁2 ------------------------------------------
	//選擇通知/出場方式
	onNotice(notice) {
		switch (notice) {
			case 'auto':
				this._logger.log("line 329 into auto!");
				//點自動贖回，如果其他有開著，全部關閉
				if (this.autoFlag == false) {
					this.autoFlag = true;
					if (this.immFlag == true || this.emailFlag == true) {
						this.immFlag = false;
						this.emailFlag = false;
					}
				} else {
					this.autoFlag = false;
				}
				break;
			case 'imm':
				this._logger.log("line 337 into imm!");
				//如果自動贖回勾著，其他的不能選
				if (this.autoFlag == true) {
					this.immFlag = false;
				} else {
					//正常開關
					if (this.immFlag == false) {
						this.immFlag = true;
						this.balanceData['details']['detail'][0]['webNotice'] = 'Y';
					} else {
						this.immFlag = false;
						this.balanceData['details']['detail'][0]['webNotice'] = 'N';
					}
				}
				break;
			case 'email':
				this._logger.log("line 345 into email!");
				if (this.autoFlag == true) {
					this.emailFlag = false;
				} else {
					if (this.emailFlag == false) {
						this.emailFlag = true;
						this.balanceData['details']['detail'][0]['emailNotice'] = 'Y';
					} else {
						this.emailFlag = false;
						this.balanceData['details']['detail'][0]['emailNotice'] = 'N';
					}
				}
				break;
		}
	}

	//點擊繼續扣款
	onContinue(use) {
		if (use == 'Y') {
			this.continue = true;
		} else {
			this.continue = false;
		}
	}

	//點擊下一步
	onNext() {
		//檢核理財專員
		if (this.inp_data['sales'] == '') {
			this.check_sales = true;
			this.singleReq['salesId'] = '';
			this.singleReq['salesName'] = '';
		} else {
			this.check_sales = false;
			this.singleReq['salesId'] = this.inp_data['sales']['salesId'];
			this.singleReq['salesName'] = this.inp_data['sales']['salesName'];
		}
		this._logger.log("line 249:", this.singleReq);

		//檢查銷售行員
		if (this.inp_data['intro'] == '') {
			this.check_intro = true;
			this.singleReq['introId'] = '';
			this.singleReq['introName'] = '';
		} else {
			this.check_intro = false;
			this.singleReq['introId'] = this.inp_data['intro']['introId'];
			this.singleReq['introName'] = this.inp_data['intro']['introName'];
		}

		// 檢查停損停利點
		if (this.errorMsg.balance1 != '' || this.errorMsg.balance2 != '') {
			let alertMsg = '';
			if (this.errorMsg.balance1 != '') {
				alertMsg = this.errorMsg.balance1;
			} else if (this.errorMsg.balance2 != '') {
				alertMsg = this.errorMsg.balance2;
			}
			this.alert.show(alertMsg, {
				title: '提醒您',
				btnTitle: '我知道了',
			}).then(
				() => {
				}
			);
			// 當使用者輸入有誤時，將頁面拉回最上方。
			this._uiContentService.scrollTop();
			return false;
		}

		// 20190626 依合庫需求改為非必填，請參考文件:轉置案UAT問題追蹤表@20190625.xls-問題編號353
		// if (this.inp_data['sales'] !== '' && this.inp_data['intro'] !== '') {
		// if (this.inp_data['intro'] !== '') {
		this.nowPage = 'single_edit_3';
		// } else {
		// return false;
		// }
	}

	//編輯頁2點擊上一步
	onBackEdit1() {
		this.nowPage = 'single_edit_1';
	}

	//---------------------------------- 編輯頁3 ------------------------------------------
	// 同意事項頁面 -基金之公開說明書 popup
	linkToBook1() {
		// this.nowPageType = 'fundInformation1';
		const set_data = new FundInformation1();
		this.infomationService.show(set_data);
	}

	// 同意事項頁面 -基金通路報酬揭露資訊 popup
	linkToBook2() {
		// this.nowPageType = 'fundInformation2';
		// const set_data = new FundInformation2();
		// this.infomationService.show(set_data);
		const navParams = {};
		const params = {
			p: this.fundSubject['fundCode']
		};
		this._logger.step('FUND', 'linkToBook2: ', params);
		this.navgator.push('web:fund-info', {}, params);
	}
	/**
		* 第一個checkbox url
		*/
	goFundUrl(type) {
		if (type == '1') {
			this.navgator.push('web:overseas-info-fund', {});
		} else {
			this.navgator.push('web:public-info-fund', {});
		}
	}
    /**
     * 點選checkbox
     */
	chgAgree(type) {
		if (type == '1') {
			this.agree1 = !this.agree1;
		} else if (type == '2') {
			this.agree2 = !this.agree2;
		} else if (type == '3') {
			this.agree3 = !this.agree3;
		}
	}

	//點擊確認
	onConfirm3(fundBook, fundInfo) {
		if (this.agree1==true && this.agree2==true) {
			this._logger.log("line 294 go confirm page!!!");
			this._mainService.getResverPurchase(this.singleReq).then(
				(result) => {
					this.purchaseInfo = result.info_data;
					//成功後，切換至確認頁
					this.nowPage = 'singleConfirm';
					this._logger.log("line 303, purchaseInfo:", this.purchaseInfo);
				},
				(errorObj) => {
					this._handleError.handleError(errorObj);
					this.navgator.push('fund');
				}
			);
		} else {
			// 未勾選同意事項
			this._handleError.handleError({
				type: 'dialog',
				title: 'POPUP.NOTICE.TITLE',
				content: '未勾選同意事項或閱讀條款。'
			});
			return false;
		}
	}

	//編輯頁3點擊取消
	onBackEdit2() {
		this.nowPage = 'single_edit_2';
	}

	//左側返回
	leftBack(page) {
		switch (page) {
			case 'edit1':
				this.confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
					title: '提醒您'
				}).then(
					() => {
						//確定
						this.onBackPageData({});
					},
					() => {

					}
				);
				break;
			case 'edit2':
				this.confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
					title: '提醒您'
				}).then(
					() => {
						//確定
						this.nowPage = 'single_edit_1';
					},
					() => {

					}
				);
				break;
			case 'edit3':
				this.confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
					title: '提醒您'
				}).then(
					() => {
						//確定
						this.nowPage = 'single_edit_2';
					},
					() => {

					}
				);
				break;
		}
	}

	/**
	 * 子層返回事件(分頁)
	 * @param e
	 */
	onPageBackEvent(e) {
		this._logger.step('Deposit', 'onPageBackEvent', e);
		let page = 'list';
		let pageType = 'list';
		let tmp_data: any;
		let fundStatus: any;
		if (typeof e === 'object') {
			if (e.hasOwnProperty('page')) {
				page = e.page;
			}
			if (e.hasOwnProperty('type')) {
				pageType = e.type;
			}
			if (e.hasOwnProperty('data')) {
				tmp_data = e.data;
			}
			if (e.hasOwnProperty('fundStatus')) {
				fundStatus = e.fundStatus;
			}
		}
		this._logger.log("page:", page);
		this._logger.log("pageType:", pageType);
		this._logger.log("tmp_data:", tmp_data);
		this._logger.log("fundStatus:", fundStatus);
	}

	/**
	 * 失敗回傳
	 * @param error_obj 失敗物件
	 */
	onErrorBackEvent(error_obj, page) {
		let output = {
			'page': 'list-item',
			'type': 'error',
			'data': error_obj
		};
		if (page == 'single-page') {
			output.page = page;
		}
		this._logger.error('ContentDetailResult get error', error_obj);
		this.errorPageEmit.emit(output);
	}



	/**
	 * 返回上一層
	 * @param item
	 */
	onBackPageData(item?: any) {
		// 返回最新消息選單
		let output = {
			'page': 'purchase-resver-single',
			'type': 'back',
			'data': item
		};
		if (item.hasOwnProperty('page')) {
			output.page = item.page;
		}
		if (item.hasOwnProperty('type')) {
			output.type = item.type;
		}
		if (item.hasOwnProperty('data')) {
			output.data = item.data;
		}
		this.backPageEmit.emit(output);
	}

	// // --------------------------------------------------------------------------------------------
	// //  ____       _            _         _____                 _
	// //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
	// //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
	// //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
	// //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
	// // --------------------------------------------------------------------------------------------

	/**
	 * 基金投資說明
	 */
	investDesc() {
		const set_data = new FundInvestDes();
		this.infomationService.show(set_data);
	}

	amntCheck(checkAmount, checkCurrency, msgType?: any) {
		const req_curr = {
			currency: 'POSITIVE'
		};
		this._logger.step('FUND', 'CHnage1: ', checkAmount, req_curr);
		const check_obj = this._checkService.checkMoney(checkAmount, req_curr); // 金額檢核
		if (check_obj.status) {
			if ((msgType == 'balance1' || msgType == 'balance2') && checkAmount.length > 3) {
				this.errorMsg[msgType] = '請輸入3位內整數';
			} else if (msgType == 'balance1' && parseInt(checkAmount, 0) > 100) {
				this.errorMsg[msgType] = '停損點最小限制額-100%';
			} else {
				this.errorMsg[msgType] = '';
			}
		} else {
			if ((msgType == 'balance1' || msgType == 'balance2') && checkAmount == '') {
				this.errorMsg[msgType] = '';
			} else {
				this.errorMsg[msgType] = check_obj.msg;
			}
		}
		this._logger.step('FUND', 'CHnage2: ', check_obj);

	}
}
