/**
 * 線上簽約對保-契約頁
 *
 */
import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewEncapsulation } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { FormateService } from '@shared/formate/formate.service';
import { CryptoService } from '@lib/plugins/crypto.service';

@Component({
	selector: 'app-sign-protect-contract',
	templateUrl: './sign-protect-contract-page.component.html',
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./sign-protect-contract-page.css'],
	providers: []
})

export class SignProtectContractPageComponent implements OnInit {
	@Input() fullData: any;
	@Input() custInfo: any;
	@Input() otherInfo: any;
	@Input() draftContractData: String;
	@Input() signDate: any;
	@Input() todayDate: any;
	@Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
	@Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
	contractType = 'normal';
	contractPageFlag = 'draft';   // 契約切換
	// 原始合約內容送回會取代
	OrgContract = {
		normal: '',
		staff: ''
	};
	// 前端顯示合約內容
	contract: any; 		// 借款契約草稿內容(暫存)
	staffContract: any; // 員工條款(暫存)
	contractId = {
		normal: '#contractDiv',
		staff: '#staffContractDiv'
	};

	replaceObj: any; // 合約取代物件
	// 送回req內容
	returnContractData = {
		isStaff: 'N', // 是否為員工
		singelDate: '', // YYYYMMDD 撥款日期
		blobData: '', // 合約HTMLb64壓
		blobDataStaff: '', // 員工合約HTMLb64壓
		aprprdbgn: '', // 借款期間起YYYMMDD
		aprprdend: '', // 借款期間迄YYYMMDD
		trnsToken: ''
	};

	ContractErrorMSG = '親愛的客戶您好，您尚未勾選同意條款';
	// 一般條款內的checkBox設定
	normalContract = {
		credit: [ // 信貸
			{ id: 'check0', comment: '0', checkedStatus: false, inputObj: null },
			{ id: 'check6', comment: '6', checkedStatus: false, inputObj: null },
			{ id: 'check9N', comment: '9', checkedStatus: false, inputObj: null },
			{ id: 'check9Y', comment: '9', checkedStatus: false, inputObj: null },
			{ id: 'check10', comment: '10', checkedStatus: false, inputObj: null },
			{ id: 'check12', comment: '12', checkedStatus: false, inputObj: null },
			{ id: 'checkall', comment: '-1', checkedStatus: false, inputObj: null }
		],
		house: [ // 房貸
			{ id: 'check0', comment: '0', checkedStatus: false, inputObj: null },
			{ id: 'check5', comment: '5', checkedStatus: false, inputObj: null },
			{ id: 'check10N', comment: '10', checkedStatus: false, inputObj: null },
			{ id: 'check10Y', comment: '10', checkedStatus: false, inputObj: null },
			{ id: 'check16', comment: '16', checkedStatus: false, inputObj: null },
			{ id: 'check20', comment: '20', checkedStatus: false, inputObj: null },
			{ id: 'checkall', comment: '-1', checkedStatus: false, inputObj: null }
		]
	};

	draftCheckBox = {
		normal: []
		, staff: [ // 員工增加條款
			{ id: 'checkall', comment: '-1', checkedStatus: false, inputObj: null }
		]
	};
	turnTodayDate = ''; //儲存西元日期

	// 指定撥入帳號科目中文對照
	// accountcdData = {
	// 	227: "行員活期儲蓄存款",
	// 	699: "職工活期儲蓄存款",
	// 	717: "活期存款",
	// 	765: "活期儲蓄存款",
	// 	766: "活期儲蓄存款",
	// 	871: "綜合活期存款",
	// 	872: "綜合活期儲蓄存款",
	// 	899: "財富管理帳戶綜合活儲",
	// }




	constructor(
		private _logger: Logger,
		private navgator: NavgatorService,
		private alert: AlertService,
		private _headerCtrl: HeaderCtrlService,
		private confirm: ConfirmService,
		private _uiContentService: UiContentService,
		private elementRef: ElementRef,
		private _formateService: FormateService,
		private _cryptoService: CryptoService
	) { }

	ngOnInit() {
		// this._logger.error("fullData:", this.fullData);
		// this._logger.error("custInfo:", this.custInfo);
		// console.log(this.signDate);
		// console.log(this.todayDate);

		// 後補的邏輯合約內容為信貸或房貸影響檢核邏輯
		if (this.fullData['txKind'] == 'B') {
			// 信貸
			this.draftCheckBox['normal'] = this.normalContract['credit'];
		} else {
			// 房貸
			this.draftCheckBox['normal'] = this.normalContract['house'];
		}

		// 塞合約
		this.contract = this.draftContractData['draft'];
		// replace contract 設定合約內變數
		this.replaceObj = this.setReplaceKeyValue();
		// 塞返回是否為員工資料 Y / N
		this.returnContractData['isStaff'] = this.otherInfo.info_data['isStaff'];
		this.returnContractData['trnsToken'] = this.otherInfo.info_data['trnsToken'];
		this.returnContractData['aprprdbgn'] = (this.replaceObj['BY'] + this.replaceObj['BM'] + this.replaceObj['BD']); // 借款期間起YYYMMDD
		this.returnContractData['aprprdend'] = (this.replaceObj['EY'] + this.replaceObj['EM'] + this.replaceObj['ED']); // 借款期間迄YYYMMDD
		this.returnContractData['singelDate'] = this.todayDate; // YYYYMMDD 撥款日期
		this._logger.log("1. otherInfo:", this.otherInfo);
		this._logger.log("2. otherInfo.aprintTy:", this.otherInfo.aprintTy);
		this._logger.log("1. this.todayDate:",this._formateService.transClone(this.todayDate));

		if (this.replaceObj) {
			// 一般合約
			// 轉換合約內變數
			this.contract = this.doContractReplace(this.contract, this.replaceObj);
			// 存入送出的原始內容
			this.OrgContract['normal'] = JSON.stringify({ normal: this.contract });
			// 不影響原始合約，調整前端顯示合約內容 CSS
			this.contract = this.contract.replace(/width=740/, 'width=100%');
			this.contract = this.contract.replace(/FONT-SIZE: 20pt/, 'FONT-SIZE: 17pt');

			// 員工合約
			if (this.draftContractData['staff'] != '' && this.returnContractData['isStaff'] == 'Y') {

				this.staffContract = this.draftContractData['staff'];
				let replaceObj_new = this.replaceCreditLoanDraft(this.replaceObj,this.turnTodayDate); //replace 1結尾的字串，ex: BY1_
				// 轉換合約內變數
				this.staffContract = this.doContractReplace(this.staffContract, replaceObj_new);
				// 存入送出的原始內容
				this.OrgContract['staff'] = JSON.stringify({ staff: this.staffContract });
				// 不影響原始合約，調整前端顯示合約內容 CSS
				this.staffContract = this.staffContract.replace(/width=740/, 'width=100%');
				this.staffContract = this.staffContract.replace(/FONT-SIZE: 20pt/, 'FONT-SIZE: 17pt');
				this.staffContract = this.staffContract.replace(/FONT-SIZE: 12pt/, 'FONT-SIZE: 10pt');
			}
		}

		this._logger.error('this.contract', this.contract);
		// 畫面還沒生成會抓不到暫時先用setTime out 抓取合約 舊手機不確定是否會有問題
		setTimeout(() => { this.setCheckboxLisn(this.contractType); }, 500);

		// 左上返回事件邏輯
		this._headerCtrl.setLeftBtnClick(() => {
			if (this.contractPageFlag == 'draft') {
				this.backPageEmit.emit({
					page: 'sign-date',
					type: 'go-date',
					data: this.fullData,
					custInfo: this.custInfo

				});
			} else if (this.contractPageFlag == 'normalContract') {

				this.setInputdisable('normal', 'revert');
				// this.checkdraft = false;
				this.contractPageFlag = 'draft';

			} else if (this.contractPageFlag == 'staffContract') {
				this.goBackNormalCheckContract();
				this.contractPageFlag = 'normalContract';

			}
		});
	}



	// 取消導至列表頁
	contractCancel(whitchStep?) {
		if (!whitchStep) {
			this.confirm.show('您是否放棄此次編輯?', {
				title: '提醒您',
				btnYesTitle: '確定',
				btnNoTitle: '取消'
			}).then(
				() => {
					this.navgator.push('online-loan');
				},
				() => {

				}
			);
		} else if (whitchStep == 'staff') {
			// 員工回合約
			this.contractPageFlag = 'normalContract';
			this.goBackNormalCheckContract();


		} else if (whitchStep == 'normal') {
			// 合約回草約
			this.setInputdisable(whitchStep, 'revert');
			this.contractPageFlag = 'draft';

		}

	}

	goBackNormalCheckContract() {
		// 還原以勾選狀態與disable狀態
		let type = 'normal';
		setTimeout(() => {
			this.setCheckboxLisn(type, 'revert');
		}, 500);
	}

	// 設定合約取代的物件內容
	setReplaceKeyValue() {
		this._logger.log("2. this.todayDate:",this._formateService.transClone(this.todayDate));
		let aprprd_yymm = this._formateService.checkField(this.otherInfo.info_data, 'aprprd_yymm');
		// 客戶選則時間
		let todayDate = this._formateService.transDate(this._formateService.checkField(this, 'todayDate'), { formate: 'yyyMMdd', chinaYear: true });
		this.turnTodayDate = todayDate; //將西元日期儲存於全域(員工貸款會用到)
		this._logger.log("into setReplaceKeyValue, todayDate:", todayDate);
		this._logger.log("into setReplaceKeyValue, aprprd_yymm:", aprprd_yymm);
		let replaceObj = {
			Logo_img: '合作金庫商業銀行',    // 圖片
			ACCOUNTBRCN: this.fullData.accountbrcn, // 營業部 501
			ACCOUNTCD: this.fullData.accountcd, // 綜合活期存款 501 根據帳號4~7
			ACCOUNT: this.fullData.account.substring(7, 13), // 帳號(OK) 501 6碼
			// 電文 504 =>核准期間 aprprd_yymm YYMM 20 01
			BY: todayDate.substring(0, 3), // XX年，起(借款期間) 選擇日期顯示民國年
			BM: todayDate.substring(3, 5), // XX月，起(借款期間)
			BD: todayDate.substring(5, 7), // XX日，起(借款期間)
			EY: this.countPeriodYYMM(todayDate, aprprd_yymm)[0], // XX年，迄(借款期間) 起加和核准
			EM: this.countPeriodYYMM(todayDate, aprprd_yymm)[1], // XX月，迄(借款期間)
			ED: todayDate.substring(5, 7), // XX日，迄(借款期間)
		};
		//2020/01/07 Gary修改 需判斷房信貸
		//房貸
		if (this.fullData['txKind'] == 'A') {
			this._logger.log("into fullData.txKind == A");
			replaceObj = this.replaceHouseLoanDraft(replaceObj, todayDate);
			//信貸	
		} else {
			this._logger.log("into fullData.txKind == B || another");
			replaceObj = this.replaceCreditLoanDraft(replaceObj, todayDate);
		}



		// for (let i = 0; i < 3; i++) {
		// 	// console.log(i, this.otherInfo.data[i]);
		// 	if (this.otherInfo.data[i] && this.otherInfo.data[i].hasOwnProperty('aprRate') && this.otherInfo.data[i]['aprRate'] != '') {
		// 		let priodYYMM = this.convertPeriodToYYMM(this.otherInfo.data[i]['aprintBgn'], this.otherInfo.data[i]['aprintEnd']);
		// 		let startDay = todayDate;
		// 		this._logger.log("setReplaceKeyValue, priodYYMM:", this._formateService.transClone(priodYYMM));
		// 		this._logger.log("setReplaceKeyValue, startDay:", this._formateService.transClone(startDay));
		// 		// console.log("startDay", startDay);
		// 		if (i != 0) {
		// 			console.log("i", i);
		// 			startDay = replaceObj['EY1_' + i] + replaceObj['EM1_' + i] + replaceObj['ED1_' + i];
		// 			console.log("i_startDay", startDay);

		// 			replaceObj['BY1_' + (i + 1)] = replaceObj['EY1_' + i];
		// 			replaceObj['BM1_' + (i + 1)] = replaceObj['EM1_' + i];
		// 			replaceObj['BD1_' + (i + 1)] = replaceObj['ED1_' + i];
		// 		} else {
		// 			replaceObj['BY1_' + (i + 1)] = replaceObj['BY'];
		// 			replaceObj['BM1_' + (i + 1)] = replaceObj['BM'];
		// 			replaceObj['BD1_' + (i + 1)] = replaceObj['BD'];
		// 		}

		// 		let EYEM = this.countPeriodYYMM(startDay, priodYYMM);

		// 		replaceObj['EY1_' + (i + 1)] = EYEM[0];
		// 		replaceObj['EM1_' + (i + 1)] = EYEM[1];
		// 		replaceObj['ED1_' + (i + 1)] = todayDate.substring(5, 7);
		// 	} else {
		// 		replaceObj['BY1_' + (i + 1)] = '';
		// 		replaceObj['BM1_' + (i + 1)] = '';
		// 		replaceObj['BD1_' + (i + 1)] = '';
		// 		replaceObj['EY1_' + (i + 1)] = '';
		// 		replaceObj['EM1_' + (i + 1)] = '';
		// 		replaceObj['ED1_' + (i + 1)] = '';
		// 	}
		// }

		// let signDay = this._formateService.transDate(this._formateService.checkField(this, 'signDate'), { formate: 'yyyMMdd', chinaYear: true });
		// replaceObj['SignY'] = signDay.substring(0, 3);
		// replaceObj['SignM'] = signDay.substring(3, 5);
		// replaceObj['SignD'] = signDay.substring(5, 7);
		return replaceObj;

	}

	//房貸replace處理
	replaceHouseLoanDraft(replaceObj, todayDate) {
		this._logger.log("into replaceHouseLoanDraft function");
		for (let i = 0; i < 3; i++) {
			let type = ''; //有無限制期間(取代值變化)
			// console.log(i, this.otherInfo.data[i]);
			if (this.otherInfo.data[i] && this.otherInfo.data[i].hasOwnProperty('aprRate') && this.otherInfo.data[i]['aprRate'] != '') {
				let priodYYMM = this.convertPeriodToYYMM(this.otherInfo.data[i]['aprintBgn'], this.otherInfo.data[i]['aprintEnd']);
				let startDay = todayDate;
				// console.log("startDay", startDay);4
				//無限制清償期間
				if (this.otherInfo.info_data['aprlimit'] == '1') {
					this._logger.log("aprlimit == 1");
					type = '1';
					//限制清償期間
				} else {
					this._logger.log("aprlimit == 2");
					type = '2';
				}

				if (i != 0) {
					startDay = replaceObj['EY' + type + '_' + i] + replaceObj['EM' + type + '_' + i] + replaceObj['ED' + type + '_' + i];

					replaceObj['BY' + type + '_' + (i + 1)] = replaceObj['EY' + type + '_' + i];
					replaceObj['BM' + type + '_' + (i + 1)] = replaceObj['EM' + type + '_' + i];
					replaceObj['BD' + type + '_' + (i + 1)] = replaceObj['ED' + type + '_' + i];
				} else {
					replaceObj['BY' + type + '_' + (i + 1)] = replaceObj['BY'];
					replaceObj['BM' + type + '_' + (i + 1)] = replaceObj['BM'];
					replaceObj['BD' + type + '_' + (i + 1)] = replaceObj['BD'];
				}

				let EYEM = this.countPeriodYYMM(startDay, priodYYMM);

				replaceObj['EY' + type + '_' + (i + 1)] = EYEM[0];
				replaceObj['EM' + type + '_' + (i + 1)] = EYEM[1];
				replaceObj['ED' + type + '_' + (i + 1)] = todayDate.substring(5, 7);
			} else {
				replaceObj['BY' + type + '_' + (i + 1)] = '';
				replaceObj['BM' + type + '_' + (i + 1)] = '';
				replaceObj['BD' + type + '_' + (i + 1)] = '';
				replaceObj['EY' + type + '_' + (i + 1)] = '';
				replaceObj['EM' + type + '_' + (i + 1)] = '';
				replaceObj['ED' + type + '_' + (i + 1)] = '';
			}
		}

		let signDay = this._formateService.transDate(this._formateService.checkField(this, 'signDate'), { formate: 'yyyMMdd', chinaYear: true });
		replaceObj['SignY'] = signDay.substring(0, 3);
		replaceObj['SignM'] = signDay.substring(3, 5);
		replaceObj['SignD'] = signDay.substring(5, 7);
		return replaceObj;
	}

	//信貸replace處理
	replaceCreditLoanDraft(replaceObj, todayDate) {
		this._logger.log("into replaceCreditLoanDraft function");
		for (let i = 0; i < 3; i++) {
			// console.log(i, this.otherInfo.data[i]);
			if (this.otherInfo.data[i] && this.otherInfo.data[i].hasOwnProperty('aprRate') && this.otherInfo.data[i]['aprRate'] != '') {
				let priodYYMM = this.convertPeriodToYYMM(this.otherInfo.data[i]['aprintBgn'], this.otherInfo.data[i]['aprintEnd']);
				let startDay = todayDate;
				// console.log("startDay", startDay);
				if (i != 0) {
					startDay = replaceObj['EY1_' + i] + replaceObj['EM1_' + i] + replaceObj['ED1_' + i];

					replaceObj['BY1_' + (i + 1)] = replaceObj['EY1_' + i];
					replaceObj['BM1_' + (i + 1)] = replaceObj['EM1_' + i];
					replaceObj['BD1_' + (i + 1)] = replaceObj['ED1_' + i];
				} else {
					replaceObj['BY1_' + (i + 1)] = replaceObj['BY'];
					replaceObj['BM1_' + (i + 1)] = replaceObj['BM'];
					replaceObj['BD1_' + (i + 1)] = replaceObj['BD'];
				}

				let EYEM = this.countPeriodYYMM(startDay, priodYYMM);

				replaceObj['EY1_' + (i + 1)] = EYEM[0];
				replaceObj['EM1_' + (i + 1)] = EYEM[1];
				replaceObj['ED1_' + (i + 1)] = todayDate.substring(5, 7);
			} else {
				replaceObj['BY1_' + (i + 1)] = '';
				replaceObj['BM1_' + (i + 1)] = '';
				replaceObj['BD1_' + (i + 1)] = '';
				replaceObj['EY1_' + (i + 1)] = '';
				replaceObj['EM1_' + (i + 1)] = '';
				replaceObj['ED1_' + (i + 1)] = '';
			}
		}

		let signDay = this._formateService.transDate(this._formateService.checkField(this, 'signDate'), { formate: 'yyyMMdd', chinaYear: true });
		replaceObj['SignY'] = signDay.substring(0, 3);
		replaceObj['SignM'] = signDay.substring(3, 5);
		replaceObj['SignD'] = signDay.substring(5, 7);
		return replaceObj;
	}

	// 合約期間轉年月
	convertPeriodToYYMM(aprintBgn, aprintEnd) {

		if (aprintEnd && aprintBgn) {
			aprintEnd = parseInt(aprintEnd, 10);
			aprintBgn = parseInt(aprintBgn, 10);
			// 一期多少個月
			let YY = ((aprintEnd - aprintBgn + 1) / 12).toString();
			let MM = ((aprintEnd - aprintBgn + 1) % 12).toString();
			YY = parseInt(YY).toString(); //有可能為小數，強制轉為整數，再轉字串
			MM = parseInt(MM).toString(); //有可能為小數，強制轉為整數，再轉字串
	
			YY = (YY.length == 1) ? ('0' + YY) : YY;
			MM = (MM.length == 1) ? '0' + MM : MM;

			// console.log("期數YYMM", YY + MM);
			return (YY + MM);
		} else {
			return '';
		}
	}

	/*
		計算起使年YYYMMDD 效期YYMM
		countPeriodYYMM(YYYMMDD , YYMM);
	*/
	countPeriodYYMM(startDay, YYMMPeriod) {
		let countM1 = parseInt(startDay.substring(3, 5), 10);
		let countM2 = parseInt(YYMMPeriod.substring(2, 4), 10);
		let EY: any;
		let EM: any;
		let countT = (12 - (countM1 + countM2));
		if (countT < 0) {
			EY = (parseInt(startDay.substring(0, 3), 10) + parseInt(YYMMPeriod.substring(0, 2), 10) + 1);
			EM = Math.abs(countT);

		} else {
			EY = (parseInt(startDay.substring(0, 3), 10) + parseInt(YYMMPeriod.substring(0, 2), 10));
			EM = (countM1 + countM2);
		}
		EY = EY.toString();
		if (EM.toString().length == 1) {
			EM = '0' + EM.toString();
		}
		return [EY, EM];
	}

	// 將合約內容的對應的KEY VALUE 置換
	doContractReplace(convertContract, convertObj) {
		let tmpContract = convertContract;

		for (let prop in convertObj) {
			let replace = '\\$' + prop + '\\$';
			let re = new RegExp(replace, 'g');

			tmpContract = tmpContract.replace(re, convertObj[prop]);
		}
		return tmpContract;
	}

	// 設定前端合約check box 監聽事件
	setCheckboxLisn(typeName, action?) {
		// get element checkbox value
		let self = this;
		for (let i = 0; i < self.draftCheckBox[typeName].length; i++) {
			if (self.draftCheckBox[typeName][i].hasOwnProperty('id')) {
				let htmlDom = null;
				htmlDom = self.elementRef.nativeElement.querySelector('#' + self.draftCheckBox[typeName][i]['id']);
				if (typeof htmlDom == 'object' && htmlDom != null) {
					self.draftCheckBox[typeName][i]['inputObj'] = htmlDom;
					if (action == 'revert') {
						if (self.draftCheckBox[typeName][i]['id'] != 'check9N' && self.draftCheckBox[typeName][i]['id'] != 'check10N') {
							htmlDom.checked = true;
						}
						htmlDom.disabled = true;
					}
					htmlDom.addEventListener('click', function () {
						self.draftCheckBox[typeName][i].checkedStatus = this.checked;
					});
				}
			}
		}
	}



	// disable contract checkBox 設定前端畫面勾選與不可改動
	async setInputdisable(type, action?): Promise<any> {

		let tmpObj = {};
		let tmpContract = '';
		let returnData = '';
		let htmlBack = await new Promise((resolve, reject) => {
			setTimeout(() => {
				for (let i = 0; i < this.draftCheckBox[type].length; i++) {
					// this.draftCheckBox[this.contractType].inputObj.checked = true;
					// console.log(this.draftCheckBox[type][i].inputObj);
					let tmpInputObj = this.elementRef.nativeElement.querySelector('#' + this.draftCheckBox[type][i]['id']);
					if (action == 'revert') {
						// if (this.draftCheckBox[type][i]['id'] != 'check9N' && this.draftCheckBox[type][i]['id'] != 'check10N') {
						// 	tmpInputObj.checked = true;
						// }
						tmpInputObj.disabled = false;
					} else {
						// 取得input checkbox 物件改 disable 跟勾選
						tmpInputObj.disabled = true;
						// set取代原始合約$check$的物件
						if (this.draftCheckBox[type][i]['checkedStatus']) {
							tmpObj[this.draftCheckBox[type][i]['id']] = 'checked disabled';
						} else {
							tmpObj[this.draftCheckBox[type][i]['id']] = 'disabled';
						}
					}
				}
				let finalContract = this.elementRef.nativeElement.querySelector(this.contractId[type]);
				finalContract.scrollTop = 0;
				// 原始和取代checked 並取代
				tmpContract = JSON.parse(this.OrgContract[type]);
				if (tmpContract) {
					returnData = this.doContractReplace(tmpContract[type], tmpObj);
					return resolve(returnData);

				} else {
					return reject(false);
				}

			}, (action == 'revert') ? 500 : 0);

		});
		// 滾動到最上方
		if (htmlBack) {
			return htmlBack;
		}
	}

	// 檢查契約checkBox設定錯誤訊息
	checkboxRule(type) {
		let returnFlag = true;
		this.ContractErrorMSG = '';
		for (let i = 0; i < this.draftCheckBox[type].length; i++) {
			// 一般的規則
			if (this.draftCheckBox[type][i]['id'] == 'check9N' || this.draftCheckBox[type][i]['id'] == 'check10N') {
				if (this.draftCheckBox[type][i]['checkedStatus']) {
					// 不同意的提示訊息
					this.ContractErrorMSG = '請勾選第' + this.draftCheckBox[type][i]['comment'] + '條同意事項';
					returnFlag = false;
					return returnFlag;
				}
			} else {
				if (!this.draftCheckBox[type][i]['checkedStatus']) {

					if (this.draftCheckBox[type][i]['comment'] == '0') {
						this.ContractErrorMSG = '請勾選最上方合理期間內審閱條款';
					} else if (this.draftCheckBox[type][i]['comment'] == '-1') {
						this.ContractErrorMSG = '請勾選最下方立約同意事項'; //2020/01/15客戶提出修改 本來為：請勾選最下方合理期間內審閱條款
					} else {
						this.ContractErrorMSG = '請勾選第' + this.draftCheckBox[type][i]['comment'] + '條下方立約同意事項';
					}
					returnFlag = false;
					return returnFlag;
				}
			}
		}
		return returnFlag;
	}
	// 前往契約頁
	goContract() {
		// 檢查合約是否都勾選
		this.returnContractData.blobData = '';
		let checkdraft = this.checkboxRule(this.contractType);
		// 前端草稿檢核
		if (checkdraft == true) {
			// 畫面切換由草稿變確認合約
			this.contractPageFlag = 'normalContract';
			this._uiContentService.scrollTop();
			this.setInputdisable(this.contractType).then(
				(normlaContract) => {
					this.returnContractData.blobData = normlaContract;
				}
			);
		} else {
			this.alert.show(this.ContractErrorMSG, {
				title: '提醒您',
				btnTitle: '了解'
			});
			this._uiContentService.scrollTop();
			return false;
		}
	}

	//
	async goSecurity(step?): Promise<any> {
		// 員工判斷
		if (this.returnContractData['isStaff'] == 'Y' && step != 'end') {
			// 顯是員工增加條款
			this.contractPageFlag = 'staffContract';
			setTimeout(() => { this.setCheckboxLisn('staff'); }, 500);
		} else {
			// 結束流程
			if (step == 'end' && this.returnContractData['isStaff'] == 'Y') {
				// 第二次檢核員工條款
				let contractType = 'staff';
				let checkdraft = this.checkboxRule(contractType);
				if (checkdraft == true) {

					await this.setInputdisable(contractType).then(
						(staffContract) => {
							this.returnContractData.blobDataStaff = staffContract;
						}
					);
					// 取代還原

				} else {
					this.alert.show(this.ContractErrorMSG, {
						title: '提醒您',
						btnTitle: '了解'
					});
					this._uiContentService.scrollTop();
					return false;
				}
			}

			let send_data = this.returnContractData['blobData'];
			this._cryptoService.Base64Encode(send_data).then(
				(result) => {
					this.returnContractData['blobData'] = result.value;
					if (this.returnContractData['isStaff'] == "Y" && this.returnContractData['blobDataStaff']) {
						this._cryptoService.Base64Encode(this.returnContractData['blobDataStaff']).then(
							(result2) => {
								this.returnContractData['blobDataStaff'] = result2.value;
								this.backEvent();
							});
					} else {

						this.backEvent();
					}
				}, (errorObj) => {
					this.backEvent();
				}
			);

		}

	}

	backEvent() {

		this.backPageEmit.emit({
			page: 'security',
			type: 'go-security',
			data: this.returnContractData,
			custInfo: this.fullData,
			signDate: [
				this.replaceObj['SignY'],
				this.replaceObj['SignM'],
				this.replaceObj['SignD']
			]
		});
	}

}
