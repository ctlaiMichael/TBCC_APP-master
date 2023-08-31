/**
 * 線上申貸-消費者貸款申請書(房貸.信貸共用)
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { MortgageIncreaseService } from '../../service/mortgage-increase.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { CheckService } from '@shared/check/check.service';
import { ConsumerApplyService } from './consumer-apply.service';
import { UserCheckUtil } from '@shared/util/check/data/user-check-util';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { AuthUserInfo } from '@core/auth/auth-userinfo';
import { AuthService } from '@core/auth/auth.service';

@Component({
	selector: 'app-consumer-apply',
	templateUrl: './consumer-apply.component.html',
	styleUrls: [],
	providers: [ConsumerApplyService]
})

export class ConsumerApplyComponent implements OnInit {
	@Input() type: string;
	@Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
	@Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
	@Input() fullData: any; //前一頁傳來之reqData，這頁送電文用
	@Input() resver: string; //是否為預填單 'Y':預填,'N':非預填
	@Input() action: string; //紀錄返回狀態，'go':進入此頁，'back':返回此頁
	//下一流程需要
	reqData: any = {
		refundWay: '', //償還方式
		refundName: '', //償還方式(中文)
		graveYymm: '', //本金寬限期
		showGraveYymm: '', //本金寬限期(畫面上使用)
		maritalStatus: '', //婚姻狀況
		supportChildren: '', //受撫養未成年子女數
		levelOfEducation: '', //教育程度
		sex: '', //性別
		sexName: '', //性別(中文)
		applyHouseAddr: '', //戶籍地址，郵遞區號+縣市+鄉鎮市區
		applyAddr: '', //通訊地址註記 01:同戶籍地址 99:其他
		applyLiveAddr: '', //通訊地址，郵遞區號+縣市+鄉鎮市區
		applyServeUnit: '', //公司名稱
		applyBussitem: '', //營業項目
		applyWorker: '', //員工人數
		applyTelFirm: '', //公司電話
		applyTelExt: '', //公司電話分機
		applyDept: '', //所屬部門
		applyTrade: '', //行業別
		metier: '', //職業別細項
		metier_sub: '', //職業別分項
		applyFirmAddr: '', //公司地址，郵遞區號+縣市+鄉鎮市區…
		applyPost: '', //擔任職務
		applyServeYymm: '', //服務年資
		applyServeMm: '', //服務年資(月)
		serverdur: '', //現職服務年資
		serverdurMm: '', //現職服務年資(月)
		applyTelSun: '', //聯絡電話（日）
		applyTelNight: '', //聯絡電話（夜）
		applyTelWalk: '', //聯絡電話（行動）
		applyTelFax: '', //傳真電話
		eMail: '', //電子信箱
		houseStatus: '', //住宅狀況
		homeownership2: '', //住宅狀況-設質情形
		houseDurYymm: '', //現在房屋居住期間
		mYear: '', //最近財務收支年度
		applyNt: '', //年收入-本人
		spouseNt: '', //年收入-配偶
		totalNt: '', //年收入-合計(家庭)
		expense: '', //家庭年支出
		loanUsage: '', //資金用途
		branchName: '', //受理分行中文名稱
		acctno: '', //原帳號
		giveAmt: '', //申請金額(帶入kyc，使用者可改)
		giveDurYymm: '', //貸款期限(帶入kyc，使用者可改)
		applyBir: '', //出生年月日
		companyId: '', //公司統編
		name: '', //姓名
		id_no: '' //身分證
	};
	//畫面顯示資料
	showData = {
		//本金寬緩期
		grave: [
			{ range: '0100', name: '1年按月付息，期滿按月本息平均攤還' },
			{ range: '0200', name: '2年按月付息，期滿按月本息平均攤還' },
			{ range: '0300', name: '3年按月付息，期滿按月本息平均攤還' }
		],
		//婚姻狀況
		marital_status: '',
		marital_name: '', //婚姻狀況(中文)
		//未成年子女數
		support_children: '',
		level_of_education: '', //教育程度
		level_of_education_name: '', //教育程度(中文)
		loanUsage: '', //資金用途
		houseStatus: '', //住宅狀況
		homeownership2: '', //設定情形
		showGraveYymm: '', //本金寬限期(畫面上使用)
		showGiveAmt: '', //申請金額
		showGiveDurYymm: '', //申請期限
		showApplyTrade: '', //行業別
		showMetier: '', //職業別細項
		showMetier_sub: '', //職業別分項
		sex: ''
	};
	nowPage = 'normalPage';
	jobData: any = {}; //職業別資料
	yearData = [];
	homeYearData = []; //已居住年數
	giveDurData = []; //貸款期間
	monthData = [];
	houseInfo = {};
	houseData = {
		houseTemp: [
			{ type: '0', name: '自有' },
			{ type: '4', name: '親屬所有' },
			{ type: '5', name: '宿舍' },
			{ type: '6', name: '租賃' },
			{ type: '7', name: '其他' },
		]
	}
	houseFlag = false;
	repayCheck = true;
	repayFlag = false;
	adressDisable = true;
	oldAdress = {
		region: '',
		city: '',
		area: '',
		adress: '',
	};
	adressCheck = true;
	personalData: any = {}; //基本資料
	allData: any = {}; //暫存資料
	sex = ''; //性別,1:男 2:女
	//檢核欄位
	checkError = {
		error_loanUsage: '',          //資金用途 訊息
		check_graveYymm: false,       //償還寬限 
		error_graveYymm: '',          //償還寬限 訊息
		check_sex: false,             //性別 
		error_sex: '',                //性別 訊息
		check_marital_status: false,  //婚姻狀況 
		error_marital_status: '',     //婚姻狀況 訊息
		check_child: false,           //撫養子女數 
		error_child: '',              //撫養子女數 訊息
		check_level: false,           //教育程度 
		error_level: '',              //教育程度 訊息
		giveAmt: '',                   //申請金額 訊息
		check_giveAmt: false,          //申請金額
		giveDurYymm: '',				  //貸款期間
		check_code_home1: false,       //戶籍郵遞
		error_code_home1: '',          //戶籍郵遞 訊息
		check_homeAdrr1: false,         //戶籍地址
		error_homeAdrr1: '',            //戶籍地址 訊息
		check_code_home2: false,        //通訊郵遞 
		error_code_home2: '',           //通訊郵遞 訊息
		check_homeAdrr2: false,         //通訊地址
		error_homeAdrr2: '',             //通訊地址 訊息
		check_applyTelSun: false,        //戶籍電話
		error_applyTelSun: '',           //戶籍電話 訊息
		check_applyTelNight: false,      //現住電話
		error_applyTelNight: '',         //現住電話 訊息
		check_applyTelWalk: false,       //行動電話 
		error_applyTelWalk: '',          //行動電話 訊息
		check_eMail: false,              //電子信箱
		error_eMail: '',                 //電子信箱 訊息
		check_houseStatus: false,        //房屋狀況已居住
		error_houseStatus: '',            //房屋狀況已居住 訊息
		check_homeownership2: false,     //設定情形
		error_homeownership2: '',         //設定情形 訊息
		check_houseDurYymm: false,        //已居住年
		error_houseDurYymm: '',           //已居住年 訊息
		check_applyServeUnit: false,     //任職公司
		error_applyServeUnit: '',       //任職公司 訊息
		check_applyTelFirm: false,      //連絡電話
		error_applyTelFirm: '',         //連絡電話 訊息
		check_applyPost: false,         //職稱
		error_applyPost: '',            //職稱 訊息
		check_applyServeYymm: false,    //年資(年)
		error_applyServeYymm: '',       // 年資(年) 訊息
		check_applyServeMm: false,      //年資(月)
		error_applyServeMm: '',         //年資(月) 訊息
		check_serverdur: false,         //現職服務年資
		error_serverdur: '',            //現職服務年資 訊息
		check_serverdurMm: false,       //現職服務年資(月)
		error_serverdurMm: '',          //現職服務年資(月) 訊息
		check_applyTrade: false,        //行業別
		error_applyTrade: '',           //行業別 訊息
		check_metier: false,           //職業別細項
		error_metier: '',              //職業別細項 訊息
		check_metier_sub: false,       //職業別分項
		error_metier_sub: '',          //職業別分項 訊息
		check_applyNt: false,          //本人年收入(萬元)
		error_appplyNt: '',            //本人年收入(萬元) 訊息
		check_expense: false,          //家庭年支出(萬元)
		error_expense: '',             //家庭年支出(萬元) 訊息
		check_totalNt: false,          //家庭年收入(萬元)
		error_totalNt: '',              //家庭年收入(萬元) 訊息
		check_companyId: false,         //公司統編
		error_companyId: '',             //公司統編 訊息
		error_mYear: '',                  //財務收支年度
		error_applyBir: '',                //檢核生日
		error_applyWorker: '',              //員工人數
		error_applyTelExt: '',               //分機
		error_applyTelFax: '',               //傳真
		error_applyBussitem: '',              //營業項目
		error_applyFirmAddr: '',              //公司地址
		error_applyDept: '',                  //所屬部門
		error_id_no: '',                  //身分證
		error_name: ''                    //姓名
	};
	default_job: any = {}; //kyc選擇之職業資料，帶入申請書預設
	select_sub = []; //職業別分項
	select_sub_flag = false; //是否顯示職業別分項

	//借款用途
	usageData = {
		usageTemp: []
	};
	//財務收支年度
	mYearData = [];
	//
	//償還方式控制顯示
	refundWay_flag = true; //false時顯示 依年金法...
	select_loage = {}; //選擇之借款用途資料，帶入409req判斷
	specialJobFlag = false; //是否為特殊職業

	constructor(
		private _logger: Logger
		, private _allService: MortgageIncreaseService
		, private _handleError: HandleErrorService
		, private _formateService: FormateService
		, private alert: AlertService
		, private _uiContentService: UiContentService
		, private _checkService: CheckService
		, private _mainService: ConsumerApplyService
		, private _headerCtrl: HeaderCtrlService
		, private auth: AuthService
	) { }

	ngOnInit() {
		this._logger.error("into consumer module!!!!");
		this.doBack(); //返回處理
		this._logger.log("apply action:", this.action);
		this._logger.log("apply fullData:", this.fullData);
		let stageData = this._allService.getStageStaus();
		let stage = stageData['apply'];
		this._logger.log("stageData:", stageData);
		this._logger.log("stage:", stage);

		//---------------------------- 判斷預填、非預填單 START ------------------------------------
		//預填 
		if (this.resver == 'Y') {
			this._logger.log("into resver: Y");
			//** */因為房屋貸款有三個欄位都帶02，為了區別原本為02之欄位改為A、B、C
			let temp = [{ type: '01', name: '其他家計週轉金' }, { type: '02', name: '消費性支出' }, { type: '03', name: '理財週轉金' }];
			let temp2 = [{ type: '07', name: '購置房屋' }, { type: '08', name: '整修房屋' }, { type: '03', name: '理財週轉金' }, { type: '09', name: '消費性貸款' }];
			if (this.type == 'house') {
				this._logger.log("into type == 'house'");
				this.reqData.txKind = 'D'; //房屋貸款
				this.usageData.usageTemp = temp2;
				this.giveDurData = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
				//若為上一頁返回，需執行資料回傳(顯示之前使用者輸入之資料)，output
				if (this.action == 'back') {
					this.setOutputData(false); //返回使用
				} else if (stage == true && this.action == 'go') {
					this.setOutputData(stage); //返回使用(使用者以儲存過資料)
				} else {
					//帶入預填單資料
					this.getResverData();
				}

			} else if (this.type == 'credit') {
				this._logger.log("into type == 'credit resver'");
				this.reqData.txKind = 'B'; //信貸預填單
				this.usageData.usageTemp = temp;
				this.giveDurData = ['05', '06', '07'];
				
				//若為上一頁返回，需執行資料回傳(顯示之前使用者輸入之資料)，output
				if (this.action == 'back') {
					this.setOutputData(false); //返回使用
				} else if (stage == true && this.action == 'go') {
					this.setOutputData(stage); //返回使用(使用者以儲存過資料)
				} else {
					//帶入預填單資料
					this.getResverData();
				}
			}


			//非預填(登入)
		} else {
			this._logger.log("into resver: N");
			let temp = [{ type: '02', name: '消費性支出' },{ type: '09', name: '勞工紓困' }]; // alex
			let temp2 = [{ type: '05', name: '理財週轉金' }, { type: '04', name: '家計消費' }];
			if (this.type == 'mortgage') {
				this._logger.log("into type == 'mortgage'");
				this.reqData.txKind = 'A'; //房貸增貸
				this.usageData.usageTemp = temp2;
				this.giveDurData = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];

				//若為上一頁返回，需執行資料回傳(顯示之前使用者輸入之資料)，output
				if (this.action == 'back') {
					this._logger.log("into action == back");
					this.setOutputData(false); //返回使用
				} else if (stage == true && this.action == 'go') {
					this.setOutputData(stage); //返回使用(使用者以儲存過資料)
				} else {
					//f9000401 data
					this._logger.log("into action == go");
					this.getNormalData(); //登入使用，取得基本資料
				}
			} else if (this.type == 'credit') {
				this._logger.log("into type == 'credit'");
				this.reqData.txKind = 'B'; //信貸
				this.usageData.usageTemp = [{ type: '02', name: '消費性支出' }]; // alex 
				this.giveDurData = ['05', '06', '07'];
				if (this.fullData['kycloanUsage'] == '09'){ // alex
					this.reqData.txKind = 'E';
				}
				// if (this.allData.loanUsage == '04') {
				// 	this.usageData.usageTemp = [{ type: '02', name: '消費性支出' },{ type: '04', name: '勞工紓困' }];
				// 	this.giveDurData = ['01','02','03','04','05', '06','07'];
				// }else {
				// 	this.usageData.usageTemp = temp;
				// 	this.giveDurData = ['05', '06', '07'];
				// }

				//若為上一頁返回，需執行資料回傳(顯示之前使用者輸入之資料)，output
				if (this.action == 'back') {
					// this.reqData.applyBir = this._formateService.checkField(this.fullData, 'applyBir'); //出生年月日
					this.setOutputData(false); //返回使用
				} else if (stage == true && this.action == 'go') {
					this.setOutputData(stage); //返回使用(使用者以儲存過資料)
				} else {
					//f9000401 data
					this.getNormalData(); //登入使用，取得基本資料
				}
			}
		}
		//---------------------------- 判斷預填、非預填單 END ------------------------------------

		this.allData = this._allService.getAllData(); //全部暫存資料
		if (this.type == 'credit' && this.allData.loanUsage == '09') { // alex
			this.usageData.usageTemp = [{ type: '02', name: '消費性支出' },{ type: '09', name: '勞工紓困' }];
			this.giveDurData = ['01','02','03'];
		}
		this.reqData.branchName = this.allData.branchName; //本次增貸案件
		this.reqData.acctno = this.allData.acctno; //放款帳號
		this.reqData.account = this.allData.account; //委託扣款帳號

		this.jobData = this._allService.getJobData(); //取得職業資料
		this.default_job = this._allService.getKycJobData(); //取得Kyc選擇之職業資料(全部)，帶入申請書預設
		this.reqData.applyTrade = this.default_job.applyTrade; //kyc選擇之行業別帶入
		this.reqData.metier = this.default_job.metier; //kyc選擇之職業別細項帶入
		this.reqData.metier_sub = this.default_job.metier_sub; //kyc選擇之職業別分項帶入

		//若為 本金寬限期 顯示下拉選擇
		if (!this.repayCheck) {
			this.repayFlag = true;
		} else {
			this.repayFlag = false;
		}

		//前往此頁(下一階段)，預設帶入，並不做轉換
		if (this.action == 'go') {
			//非預填單(登入)，需要聯動資料帶預設值
			if (this.resver == 'N') {
				this.reqData.loanUsage = this.allData.loanUsage; //預設帶入kyc選擇之借款用途(暫存存入資金用途，非預填之情況)
			} //預填單不聯動資料(不帶預設)，因此不處理
			//償還方式相關
			if (this.type == 'mortgage' || this.type == 'house') {
				this.refundWay_flag = false;
			} else {
				this.refundWay_flag = true;
			}
		}

		this.mYearData = this._allService.getMYear(); //取得財務收支年度
		this.showData.showGiveAmt = this.allData.giveAmt; //畫面顯示(申請金額)
		this.showData.showGiveDurYymm = this.allData.giveDurYymm; //畫面顯示(申請期限)

		//分項相關(帶預設)---------------------- START ----------------------------
		//如果選的細項有分項資料
		if (typeof this.reqData.metier == 'object' && this.reqData.metier
			&& this.reqData.metier.hasOwnProperty('detail')
			&& (this.reqData.metier['detail'] instanceof Array)
			&& this.reqData.metier['detail'].length > 0
		) {
			this._logger.log("is sub");
			this.select_sub = this.reqData.metier['detail']; //將對應的分項資料帶入
			this.select_sub_flag = true;
			//選擇之細項無分項資料，清空
		} else {
			this._logger.log("into not sub");
			this.select_sub = [];
			this.reqData.metier_sub = '';
			this.select_sub_flag = false;
		}
		//分項相關---------------------- END ----------------------------

		//將須設定預設值的欄位帶入(kyc之前填寫的)
		this.reqData.mYear = this.allData.mYear;
		//有值做處理
		if (this.allData.applyNt != '' && typeof this.allData.applyNt != 'undefined') {
			this.reqData.applyNt = this.allData.applyNt;
		} else {
			this.reqData.applyNt = '';
		}
		if (this.allData.spouseNt != '' && typeof this.allData.spouseNt != 'undefined') {
			this.reqData.spouseNt = this.allData.spouseNt;
		} else {
			this.reqData.spouseNt = '';
		}
		if (this.allData.totalNt != '' && typeof this.allData.totalNt != 'undefined') {
			this.reqData.totalNt = this.allData.totalNt;
		} else {
			this.reqData.totalNt = '';
		}
		if (this.allData.expense != '' && typeof this.allData.expense != 'undefined') {
			this.reqData.expense = this.allData.expense;
		} else {
			this.reqData.expense = '';
		}
		let spouseNt = this._mainService.getSpouseNt(this.reqData.applyNt, this.reqData.totalNt); //取配偶年收
		this.reqData.spouseNt = spouseNt['data'];
		this._logger.log("apply page, allData:", this.allData);
		this._logger.log("personalData:", this.personalData);

		for (let i = 0; i <= 99; i++) {
			let year = '';
			let homeYear = '';
			//已居住年補0，其他年數不補0
			if (i < 10 && i !== 0) {
				homeYear = '0' + (i.toString());
				year = i.toString();
			} else {
				homeYear = i.toString();
				year = i.toString();
			}
			this.yearData.push(year);
			this.homeYearData.push(homeYear);
		}
		this.homeYearData.splice(0, 1); //已居住年數，從01開始，故刪除第0
		for (let i = 0; i <= 11; i++) {
			let month = '';
			if (i < 10 && i !== 0) {
				month = '0' + i.toString();
			} else {
				month = i.toString();
			}
			this.monthData.push(month);
		}
	}

	//若為登入狀態(非預填單)，或非上一頁返回，帶入使用者資料f9000401
	getNormalData() {
		//*有登入才需取得 f9000401使用者相關資料(非預填)，預填單自行輸入
		this.personalData = this._allService.getPersonalData(); //個人基本資料
		this.reqData.name = this.personalData.name; //姓名
		this.reqData.id_no = this.personalData.id_no; //身分證
		let applyBir = this._mainService.getApplyBir(this.personalData.birth_date); //帶出生年月日
		this.reqData.applyBir = applyBir['data'];
		//電話欄位預設帶入
		this.reqData.applyTelNight = this.personalData.phone_h; //現住電話
		this.reqData.applyTelWalk = this.personalData.phone_m; //行動電話
		this.reqData.applyTelSun = this.personalData.phone_o; //聯絡電話(日) => 戶籍電話
		this.reqData.eMail = this.personalData.email_no //電子信箱
		//*非預填性別資料，取自f9000401使用者相關資料 
		let getSex = this._mainService.getSex(this.personalData.id_no); //取得性別資料
		this.showData.sex = getSex['data']; //畫面顯示
		this.reqData.sex = getSex['type']; //性別帶入req
		this._logger.log("getSex:", getSex);
		//*帶入地址，取自f9000401使用者相關資料 
		this.getOldAdress();
	}

	//若為預填單，帶入預填單資料
	getResverData() {
		//*預填單性別資料，取自暫存預填單資料(輸入)之身分證資號欄位換算
		let resverData = this._allService.getResverData(); //取得預填單資料
		let getSex = this._mainService.getSex(resverData.id_no); //取得性別資料
		this.showData.sex = getSex['data']; //畫面顯示
		this.reqData.sex = getSex['type']; //性別帶入req
		this._logger.log("getSex:", getSex);
		this.reqData.name = resverData.name; //帶入預填單 姓名
		this.reqData.id_no = resverData.id_no; //帶入預填單 身分證
		this.reqData.applyBir = resverData.applyBir; //帶入預填單 出生年月日
		//電話欄位自行輸入
	}

	//輸入身分證變換，性別欄為自動變更(預填單使用)
	idChange() {
		if (this.resver == 'Y') {
			let getSex = this._mainService.getSex(this.reqData.id_no); //取得性別資料
			this.showData.sex = getSex['data']; //畫面顯示
			this.reqData.sex = getSex['type']; //性別帶入req
		}
	}

	getOldAdress() {
		//儲存未修改過之地址資料
		this.oldAdress['adress'] = this.personalData['home_addr']; //地址
		this.oldAdress['region'] = this.personalData['code_home']; //郵遞區號
	}
	//勾選償還方式
	selectRepay(setype) {
		if (setype == '1') {
			//依年金法按月本息平均攤還
			this.reqData.graveYymm = '';
			this.repayCheck = true;
			this.repayFlag = false;
		} else {
			//本金寬限期
			this.repayCheck = false;
			this.repayFlag = true;
		}
	}
	//職業變化
	jobChange() {
		this._logger.log("into job change");
		this._logger.log("reqData.metier:", this.reqData.metier);
		//職業細項變化，有變化，就需將分項之檢核錯誤拔除
		this.checkError.check_metier_sub = false;
		this.checkError.error_metier_sub = '';
		this.reqData.metier_sub = '';
		this._logger.log("reqData.metier_sub:", this.reqData.metier_sub);
		this._logger.log("jobChange, reqData:", this.reqData);

		//如果選的細項有分項資料
		if (typeof this.reqData.metier == 'object' && this.reqData.metier
			&& this.reqData.metier.hasOwnProperty('detail')
			&& (this.reqData.metier['detail'] instanceof Array)
			&& this.reqData.metier['detail'].length > 0
		) {
			this._logger.log("is sub");
			this.select_sub = this.reqData.metier['detail']; //將對應的分項資料帶入
			this.select_sub_flag = true;
			//選擇之細項無分項資料，清空
		} else {
			this._logger.log("into not sub");
			this.select_sub = [];
			this.reqData.metier_sub = '';
			this.select_sub_flag = false;
		}
	}
	//房屋狀況變化
	houseChange() {
		//自有
		if (this.reqData.houseStatus == '0') {
			this.houseFlag = true;
		} else {
			this.houseFlag = false;
			this.reqData.homeownership2 = ''; //設定情形
			// this.reqData.houseDurYymm = ''; //已居住年數
		}
	}
	//選擇同戶籍地址or輸入
	selectAddress(setype) {
		//同戶籍地址
		if (setype == 'same') {
			this._logger.log("into setype==same");
			//disable時，要將戶籍地址輸入錯誤的顯示移除
			this.checkError.check_code_home2 = false; //通訊地址 郵遞區號
			this.checkError.error_code_home2 = ''; ////通訊地址 郵遞區號 訊息
			this.checkError.check_homeAdrr2 = false; //通訊地址
			this.checkError.error_homeAdrr2 = ''; //通訊地址 訊息
			this.adressDisable = true;
			this.adressCheck = true;
			this.getOldAdress();
			//自行輸入
		} else {
			this._logger.log("into setype==enter");
			this.adressDisable = false;
			this.adressCheck = false;
			this.oldAdress['adress'] = '';
			this.oldAdress['area'] = '';
			this.oldAdress['city'] = '';
			this.oldAdress['region'] = '';
		}
	}

	onBack() {
		this.onBackPageData({}, 'back');
	}

	//選擇之用途
	selectLoage(temp) {
		this._logger.log("selectLoage, temp:", temp);
		let output = {};
		temp.forEach(item => {
			if (item.type == this.reqData.loanUsage) {
				output = item;
			}
		});
		this._logger.log("selectLoage, output:", output);
		return output;
	}

	// 前往 2. 填寫基本資料
	onNext() {
		if (this.repayCheck) {
			if(this.type == 'credit' && this.reqData.loanUsage == '09') { // alex
				this.reqData.refundWay = '5';
				this.reqData.refundName = '第1-6個月本金寬緩，第7-12個月按月攤還本金，第2年起本息平均攤還。';
			}  //信貸 type:'2'
            else {this.reqData.refundWay = '1';
			this.reqData.refundName = '依年金法按月本息平均攤還';
			}
		} else {
			this.reqData.refundWay = '4';
			this.reqData.refundName = '本金償還寬限期限';
			switch (this.reqData.graveYymm) {
				case '0100':
					this.showData.showGraveYymm = '01';
					break;
				case '0200':
					this.showData.showGraveYymm = '02';
					break;
				case '0300':
					this.showData.showGraveYymm = '03';
					break;
			}
		}
		this.select_loage = this.selectLoage(this.usageData.usageTemp); //取得選擇之那筆(資金用途)
		this._logger.log("select_loage:", this.select_loage);

		//檢核第一頁
		let check_page = this.checkPage1();
		if (check_page.status) {
			//畫面顯示用帶req
			this.reqData.giveAmt = this.showData.showGiveAmt;
			this.reqData.giveDurYymm = this.showData.showGiveDurYymm;
			this.nowPage = 'basicPage';
			this.doScrollTop();
		} else {
			this.doScrollTop();
			return false;
		}
	}
	//----------------- 基本資料 --------------------
	onBasicBack() {
		this.nowPage = 'normalPage';
		this.doScrollTop();
	}
	onBasicNext() {
		if (this.reqData.sex == '1') {
			this.reqData.sexName = '男';
		} else {
			this.reqData.sexName = '女';
		}
		if (this.showData.marital_status == '1') {
			this.showData.marital_name = '單身';
			this.reqData.maritalStatus = '1';
		} else if (this.showData.marital_status == '2') {
			this.showData.marital_name = '已婚';
			this.reqData.maritalStatus = '2';
		} else {
			this.showData.marital_name = '其他';
			this.reqData.maritalStatus = '3';
		}
		switch (this.showData.level_of_education) {
			case '1':
				this.showData.level_of_education_name = '研究所以上';
				this.reqData.levelOfEducation = '1';
				break;
			case '2':
				this.showData.level_of_education_name = '大學';
				this.reqData.levelOfEducation = '2';
				break;
			case '3':
				this.showData.level_of_education_name = '專科';
				this.reqData.levelOfEducation = '3';
				break;
			case '4':
				this.showData.level_of_education_name = '高中職';
				this.reqData.levelOfEducation = '4';
				break;
			case '5':
				this.showData.level_of_education_name = '中學以下';
				this.reqData.levelOfEducation = '5';
				break;
			case '6':
				this.showData.level_of_education_name = '其他';
				this.reqData.levelOfEducation = '6';
				break;
			default:
				this.showData.level_of_education_name = '其他';
				this.reqData.levelOfEducation = '6';
		}
		//受撫養子女數
		this.reqData.supportChildren = this.showData.support_children; //畫面顯示帶入
		let check_page = this.checkPage2();
		if (check_page.status == true) {
			this.nowPage = 'basicPage2';
			this.doScrollTop();
		} else {
			return false;
		}
	}
	onBasicBack2() {
		this.nowPage = 'basicPage';
		this.doScrollTop();
	}
	onBasicNext2() {
		//同戶籍地址
		if (this.adressCheck == true) {
			this.reqData.applyAddr = '01'; //通訊地址註記 01:同通訊地址 99:其他
			//自行輸入
		} else {
			this.reqData.applyAddr = '99';
		}
		this.reqData.applyHouseAddr = this.personalData.code_home + this.personalData.home_addr; //戶籍地址
		this.reqData.applyLiveAddr = this.oldAdress.region + this.oldAdress.adress; //通訊地址
		let adressData = {
			code_home: '', //戶籍郵遞區號
			home_addr: '', //戶籍地址
			region: '', //通訊郵遞區號
			adress: '', //通訊地址
			checkStatus: false //勾選狀態：通訊地址、戶籍地址
		};
		adressData.code_home = this.personalData.code_home;
		adressData.home_addr = this.personalData.home_addr;
		adressData.region = this.oldAdress.region;
		adressData.adress = this.oldAdress.adress;
		adressData.checkStatus = this.adressCheck; //地址勾選狀態
		this._allService.saveAdressData(adressData); //暫存地址資料
		let check_page = this.checkPage3();
		if (check_page.status == true) {
			this.nowPage = 'basicPage3';
			this.doScrollTop();
		} else {
			return false;
		}
	}
	onBasicBack3() {
		this.nowPage = 'basicPage2';
		this.doScrollTop();
	}
	onBasicNext3() {
		this._logger.log("reqData.houseStatus:", this.reqData.houseStatus);
		switch (this.reqData.houseStatus) {
			case '0':
				this.showData.houseStatus = '自有';
				break;
			case '4':
				this.showData.houseStatus = '親屬所有';
				break;
			case '5':
				this.showData.houseStatus = '宿舍';
				break;
			case '6':
				this.showData.houseStatus = '租賃';
				break;
			case '7':
				this.showData.houseStatus = '其他';
				break;
			default:
				this.showData.houseStatus = '--';
		}
		if (this.houseFlag == true) {
			switch (this.reqData.homeownership2) {
				case '1':
					this.showData.homeownership2 = '無設定';
					break;
				case '2':
					this.showData.homeownership2 = '設定予本行';
					break;
				case '3':
					this.showData.homeownership2 = '設定予他行';
					break;
				default:
					this.showData.homeownership2 = '--';
			}
		}
		//在進入下一個階段前，先發保持登入電文
		this.auth.keepLogin();
		let check_page = this.checkPage4();
		if (check_page['status'] == true) {
			this.nowPage = 'careerPage1';
			this.doScrollTop();
		} else {
			return false;
		}
	}
	//----------------- 職業資料 --------------------
	onCareerBack1() {
		this.nowPage = 'basicPage3';
		this.doScrollTop();
	}
	onCareerNext1() {
		let check_page = this.checkPage5();
		if (check_page['status'] == true) {
			this._logger.log("1. reqData.companyId:", this.reqData['companyId']);
			this.nowPage = 'careerPage2';
			this.doScrollTop();
		} else {
			return false;
		}
	}
	onCareerBack2() {
		this.nowPage = 'careerPage1';
		this.doScrollTop();
	}
	onCareerNext2() {
		this._logger.log("job page, reqData:", this.reqData);
		let check_page = this.checkPage6();
		if (check_page['status'] == true) {
			this._logger.log("2. reqData.companyId:", this.reqData['companyId']);
			this.nowPage = 'financePage';
			this.doScrollTop();
		} else {
			return false;
		}
	}
	//----------------- 財務資料 --------------------
	onFinBack() {
		this.nowPage = 'careerPage2';
		this.doScrollTop();
	}
	onFinNext() {
		if (this.reqData['applyTrade'] != '' && this.reqData['applyTrade'] != null
			&& typeof this.reqData['applyTrade'] != 'undefined') {
			this.showData.showApplyTrade = this.reqData['applyTrade']['CNAME1'];
		} else {
			this.showData.showApplyTrade = '';
		}
		if (this.reqData['metier'].hasOwnProperty('CNAME1') && this.reqData['metier']['CNAME1'] != ''
			&& this.reqData['metier']['CNAME1'] != null && typeof this.reqData['metier']['CNAME1'] != 'undefined') {
			this.showData.showMetier = this.reqData['metier']['CNAME1'];
		} else {
			this.showData.showMetier = '';
		}
		if (this.reqData['metier_sub'].hasOwnProperty('CNAME1') && this.reqData['metier_sub']['CNAME1'] != ''
			&& this.reqData['metier_sub']['CNAME1'] != null && typeof this.reqData['metier_sub']['CNAME1'] != 'undefined') {
			this.showData.showMetier_sub = this.reqData['metier_sub']['CNAME1'];
		} else {
			this.showData.showMetier_sub = '';
		}
		this._logger.log("last edit page, reqData:", this.reqData);
		let check_page = this.checkPage7();
		if (check_page.status == true) {
			this._logger.log("3. reqData.companyId:", this.reqData['companyId']);
			this.nowPage = 'confirmPage';
			this.doScrollTop();
		} else {
			return false;
		}

	}
	//----------------- 確認頁 --------------------
	onCancel() {
		this.nowPage = 'financePage';
		this.doScrollTop();
	}
	onConfirm() {
		this._logger.log("onConfirm, reqData:", this.reqData);
		this.reqData.giveAmt = this.showData.showGiveAmt;
		this.reqData.giveDurYymm = this.showData.showGiveDurYymm;
		this.reqData.applyHouseAddr = this.personalData.code_home + this.personalData.home_addr; //戶籍地址
		this.reqData.applyLiveAddr = this.oldAdress.region + this.oldAdress.adress; //通訊地址
		let saveApply: any = {};
		//是否同戶籍地址，強制再塞一次，返回時會消失
		//同戶籍地址
		if (this.adressCheck == true) {
			this.reqData.applyAddr = '01'; //通訊地址註記 01:同通訊地址 99:其他
			//自行輸入
		} else {
			this.reqData.applyAddr = '99';
		}
		//在進入下一個階段前，先發保持登入電文
		this.auth.keepLogin();
		this._logger.log("1. apply reqData:", this._formateService.transClone(this.reqData));
		this._allService.saveApplyData(this.reqData, this.type, this.resver).then(
			(result) => {
				this._logger.log("result:", result);
				saveApply = result;
				if (saveApply['status'] == true) {
					this.alert.show('資料已暫存完畢，即將進入下一步驟。', {
						title: '提醒您',
						btnTitle: '了解',
					}).then(
						() => {
							this.onBackPageData(this.reqData);
						}
					);
				} else {
					return false;
				}
			},
			(erorrObj) => {
				this._logger.log("erorrObj:", erorrObj);
			}
		);
	}

	// 當使用者輸入有誤時，將頁面拉回最上方。
	doScrollTop() {
		this._uiContentService.scrollTop();
	}

	//家庭年收入，本人年收入值有變化，重新算配偶年收入
	spouseChange() {
		let spouseNt = this._mainService.getSpouseNt(this.reqData.applyNt, this.reqData.totalNt); //取配偶年收
		if (this.reqData.applyNt == '' || this.reqData.totalNt == '') {
			this.reqData.spouseNt = '';
		} else {
			this.reqData.spouseNt = spouseNt['data'];
		}
		let applyNt = parseInt(this.reqData.applyNt);
		let totalNt = parseInt(this.reqData.totalNt);
		if (applyNt > totalNt) {
			this.reqData.spouseNt = '';
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
		}
	}

	/**
 * 返回上一層
 * @param item
 */
	onBackPageData(item?: any, type?) {
		// 返回最新消息選單
		let output = {
			'page': 'consumer-apply',
			'type': 'go',
			'data': this.allData
		};
		if (type == 'back') {
			output.type = 'back';
		}
		this.backPageEmit.emit(output);
	}

	/**
 	* 失敗回傳(分頁)
 	* @param error_obj 失敗物件
 	*/
	onErrorBackEvent(e) {
		this._logger.step('Deposit', 'onErrorBackEvent', e);
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
		// 列表頁：首次近來錯誤推頁
		errorObj['type'] = 'dialog';
		this._handleError.handleError(errorObj);
	}

	//-----------檢核頁數 start-----------//

	//第一頁
	checkPage1() {
		let output = {
			status: false,
			data: {},
			msg: ''
		};
		const giveAmt_check = this._checkService.checkMoney(this.showData.showGiveAmt, { 'currency': 'TWD' });
		// const giveDurYymm_check = this._checkService.checkMoney(this.showData.showGiveDurYymm, { 'currency': 'TWD' });
		//貸款期間11/29改為下拉
		if (this.showData.showGiveDurYymm == '') {
			this.checkError.giveDurYymm = '請選擇貸款期間';
		} else {
			this.checkError.giveDurYymm = '';
		}
		const loanUsage_check = this.reqData.loanUsage;
		this._logger.error('giveAmt_check:', giveAmt_check);

		// 申請金額
		let checkAmt_rule = {};
		if (giveAmt_check.status) {
			//檢核成功，檢核業務規則 信貸5~200 房貸10~9999
			if (this.type == 'mortgage' || this.type == 'house') {
				checkAmt_rule = this._mainService.checkGiveAmt(this.showData.showGiveAmt, '1');
			} 
			else if (this.type == 'credit' && this.reqData.loanUsage == '09') { //勞工紓困 alex
				checkAmt_rule = this._mainService.checkGiveAmt(this.showData.showGiveAmt, '9');
			}
			else {
				checkAmt_rule = this._mainService.checkGiveAmt(this.showData.showGiveAmt, '2');
			}
			if (checkAmt_rule['status'] == true) {
				this.checkError.check_giveAmt = false;
				this.checkError.giveAmt = '';
			} else {
				this.checkError.check_giveAmt = true;
				this.checkError.giveAmt = checkAmt_rule['msg'];
			}
		} else {
			this.checkError.check_giveAmt = true;
			this.checkError.giveAmt = giveAmt_check.msg;
		}

		this._logger.error('this.checkError.giveAmt:', this.checkError.giveAmt);
		// 貸款期間
		// if (giveDurYymm_check.status) {
		// 	this.checkError.giveDurYymm = '';
		// } else {
		// 	this.checkError.giveDurYymm = giveDurYymm_check.msg;
		// }

		//  檢核資金用途
		if (loanUsage_check == '') {
			this.checkError.error_loanUsage = '請選擇資金用途';
		} else {
			this.checkError.error_loanUsage = '';
		}

		// 償還方式，選擇「本金寬限期」，但無選擇期限
		if (this.repayCheck == false && this.reqData.graveYymm == '') {
			this.checkError.check_graveYymm = true;
			this.checkError.error_graveYymm = '請選擇本金寬限期';
		} else {
			this.checkError.check_graveYymm = false;
			this.checkError.error_graveYymm = '';
		}


		if (this.checkError.check_giveAmt == false &&
			this.checkError.giveDurYymm == '' &&
			loanUsage_check != '' &&
			this.checkError.check_graveYymm == false) {
			output.status = true;
			output.msg = 'success';
		} else {
			output.status = false;
			output.msg = 'failed';
		}
		return output;
	}
	//第二頁
	checkPage2() {
		let output = {
			status: false,
			data: {},
			msg: ''
		};
		//檢核性別 2019/11/20為預設帶入，不檢核
		// if (this.reqData.sex == '') {
		// 	this.checkError.check_sex = true;
		// 	this.checkError.error_sex = '請選擇性別';
		// } else {
		// 	this.checkError.check_sex = false;
		// 	this.checkError.error_sex = '';
		// }
		//檢核婚姻狀況
		if (this.showData.marital_status == '') {
			this.checkError.check_marital_status = true;
			this.checkError.error_marital_status = '請選擇婚姻狀況';
		} else {
			this.checkError.check_marital_status = false;
			this.checkError.error_marital_status = '';
		}
		//檢核受撫養子女數
		let check_child = this._mainService.checkChild(this.showData.support_children);
		if (check_child['status'] == false) {
			this.checkError.check_child = true;
			this.checkError.error_child = check_child['msg'];
		} else {
			this.checkError.check_child = false;
			this.checkError.error_child = check_child['msg'];
		}
		//檢查教育程度
		if (this.showData.level_of_education == '') {
			this._logger.log("into level error");
			this._logger.log("error showData.level_of_education:", this.showData.level_of_education);
			this.checkError.check_level = true;
			this.checkError.error_level = '請選擇教育程度';
		} else {
			this._logger.log("into level success");
			this._logger.log("success showData.level_of_education:", this.showData.level_of_education);
			this.checkError.check_level = false;
			this.checkError.error_level = '';
		}
		//若為預填單，有些欄位改為自行輸入，須檢核
		//檢核生日
		if (this.resver == 'Y') {
			//先不檢核，待補(一定要補)
			// let checkBirth = this._mainService.checkResverBirth(this.reqData.applyBir);
			// if (checkBirth['status'] == false) {
			// 	this.checkError.error_applyBir = checkBirth['msg'];
			// } else {
			// 	this.checkError.error_applyBir = '';
			// }
			//檢核身分證
			let checkCustId = this._checkService.checkIdentity(this.reqData.id_no);
			if (checkCustId['status'] == false) {
				this.checkError.error_id_no = checkCustId['msg'];
			} else {
				this.checkError.error_id_no = '';
			}

			//檢核姓名
			let checkName = this._mainService.checkText(this.reqData.name);
			if (checkName['status'] == false) {
				this.checkError.error_name = checkName['msg'];
			} else {
				this.checkError.error_name = '';
			}
		}

		if (this.checkError.check_marital_status == false && this.checkError.error_applyBir == ''
			&& this.checkError.check_child == false && this.checkError.check_level == false
			&& this.checkError.error_id_no == '' && this.checkError.error_name == '') {
			output.status = true;
			output.msg = 'success';
		} else {
			output.status = false;
			output.msg = 'failed';
		}
		return output;
	}
	//第三頁
	checkPage3() {
		let output = {
			status: false,
			data: {},
			msg: ''
		};
		//檢核戶籍郵遞區號
		let checkHomeCode1 = this._mainService.checkHomeCode(this.personalData.code_home);
		if (checkHomeCode1['status'] == false) {
			this.checkError.check_code_home1 = true;
			this.checkError.error_code_home1 = checkHomeCode1['msg'];
		} else {
			this.checkError.check_code_home1 = false;
			this.checkError.error_code_home1 = '';
		}
		//檢核戶籍地址
		// if (this.personalData.home_addr == '') {
		// 	this.checkError.check_homeAdrr1 = true;
		// 	this.checkError.error_homeAdrr1 = '請輸入戶籍地址';
		// } else {
		// 	this.checkError.check_homeAdrr1 = false;
		// 	this.checkError.error_homeAdrr1 = '';
		// }
		let checkHome_addr = this._mainService.checkText(this.personalData.home_addr);
		if (checkHome_addr['status'] == false) {
			this.checkError.check_homeAdrr1 = true;
			this.checkError.error_homeAdrr1 = checkHome_addr['msg'];
		} else {
			this.checkError.check_homeAdrr1 = false;
			this.checkError.error_homeAdrr1 = '';
		}
		//檢核通訊郵遞區號
		let checkHomeCode2 = this._mainService.checkHomeCode(this.oldAdress.region);
		if (checkHomeCode2['status'] == false) {
			this.checkError.check_code_home2 = true;
			this.checkError.error_code_home2 = checkHomeCode2['msg'];
		} else {
			this.checkError.check_code_home2 = false;
			this.checkError.error_code_home2 = '';
		}
		//檢核通訊地址
		// if (this.oldAdress.adress == '') {
		// 	this.checkError.check_homeAdrr2 = true;
		// 	this.checkError.error_homeAdrr2 = '請輸入通訊地址';
		// } else {
		// 	this.checkError.check_homeAdrr2 = false;
		// 	this.checkError.error_homeAdrr2 = '';
		// }
		let checkHomeAdrr2 = this._mainService.checkText(this.oldAdress.adress, 55);
		if (checkHomeAdrr2['status'] == false) {
			this.checkError.check_homeAdrr2 = true;
			this.checkError.error_homeAdrr2 = checkHomeAdrr2['msg'];
		} else {
			this.checkError.check_homeAdrr2 = false;
			this.checkError.error_homeAdrr2 = '';
		}
		if (this.checkError.check_code_home1 == false && this.checkError.check_homeAdrr1 == false
			&& this.checkError.check_code_home2 == false && this.checkError.check_homeAdrr2 == false) {
			output.status = true;
			output.msg = 'success';
		} else {
			output.status = false;
			output.msg = 'failed';
		}
		return output;
	}
	//第四頁
	checkPage4() {
		let output = {
			status: false,
			data: {},
			msg: ''
		};
		//檢核戶籍電話
		let check_giveAmt = this._mainService.checkTel(this.reqData.applyTelSun, true);
		if (check_giveAmt.status == false) {
			this.checkError.check_applyTelSun = true;
			this.checkError.error_applyTelSun = check_giveAmt['msg'];
		} else {
			this.checkError.check_applyTelSun = false;
			this.checkError.error_applyTelSun = '';
		}
		//檢核現住電話
		let check_applyTelNight = this._mainService.checkTel(this.reqData.applyTelNight, true);
		if (check_applyTelNight.status == false) {
			this.checkError.check_applyTelNight = true;
			this.checkError.error_applyTelNight = check_applyTelNight['msg'];
		} else {
			this.checkError.check_applyTelNight = false;
			this.checkError.error_applyTelNight = '';
		}
		//檢核行動電話
		let check_applyTelWalk = UserCheckUtil.checkMobile(this.reqData.applyTelWalk);
		if (check_applyTelWalk.status == false) {
			this.checkError.check_applyTelWalk = true;
			//手機特定錯誤訊息formate
			if (check_applyTelWalk['msg'] == 'CHECK.MOBILE') {
				check_applyTelWalk['msg'] = 'CHECK.PHONE.LOANM11';
			}
			this.checkError.error_applyTelWalk = check_applyTelWalk['msg'];
			this._logger.log("check_applyTelWalk['msg']:", check_applyTelWalk['msg']);
		} else {
			this.checkError.check_applyTelWalk = false;
			this.checkError.error_applyTelWalk = '';
		}
		//傳真 **
		if (this._checkService.checkEmpty(this.reqData.applyTelFax, true)) {
			let reg = /^[0]{1}[1-8]{1}[1-9]{0,2}\d{7,8}$/
			if (reg.test(this.reqData.applyTelFax)) {
				this.checkError.error_applyTelFax = '';
			} else {
				this.checkError.error_applyTelFax = 'CHECK.PHONE.LOANM12';
			}
		} else {
			this.checkError.error_applyTelFax = '';
		}

		//檢核電子信箱
		let check_eMail = UserCheckUtil.checkEmail(this.reqData.eMail);
		if (check_eMail.status == false) {
			this.checkError.check_eMail = true;
			this.checkError.error_eMail = '請輸入電子信箱，例:mike1111@gmail.com';
		} else {
			this.checkError.check_eMail = false;
			this.checkError.error_eMail = '';
		}
		//檢核房屋狀況已居住
		if (this.reqData.houseStatus == '' || typeof this.reqData.houseStatus == 'undefined') {
			this.checkError.check_houseStatus = true;
			this.checkError.error_houseStatus = '請選擇房屋狀況';
		} else {
			this.checkError.check_houseStatus = false;
			this.checkError.error_houseStatus = '';
		}
		//檢核設定情形，房屋狀況已居住(自有: houseStatus:0)
		if (this.houseFlag == true && this.reqData.homeownership2 == '') {
			this.checkError.check_homeownership2 = true;
			this.checkError.error_homeownership2 = '請選擇設定情形';
		} else {
			this.checkError.check_homeownership2 = false;
			this.checkError.error_homeownership2 = '';
		}

		//已居住年，檢核
		if (this.reqData.houseDurYymm == '') {
			this.checkError.check_houseDurYymm = true;
			this.checkError.error_houseDurYymm = '請選擇已居住年數';
		} else {
			this.checkError.check_houseDurYymm = false;
			this.checkError.error_houseDurYymm = '';
		}

		//全部都過
		if (this.checkError.check_applyTelSun == false && this.checkError.check_applyTelNight == false
			&& this.checkError.check_applyTelWalk == false && this.checkError.check_eMail == false
			&& this.checkError.check_houseStatus == false && this.checkError.check_homeownership2 == false
			&& this.checkError.check_houseDurYymm == false && this.checkError.error_applyTelFax == '') {
			output.status = true;
			output.msg = 'success';
		} else {
			output.status = false;
			output.msg = 'failed';
		}
		return output;
	}
	//第五頁
	checkPage5() {
		let output = {
			status: false,
			data: {},
			msg: ''
		};
		//檢核任職公司
		let checkApplyServeUnit = this._mainService.checkText(this.reqData.applyServeUnit, 20);
		if (checkApplyServeUnit['status'] == false) {
			this.checkError.check_applyServeUnit = true;
			this.checkError.error_applyServeUnit = checkApplyServeUnit['msg'];
		} else {
			this.checkError.check_applyServeUnit = false;
			this.checkError.error_applyServeUnit = '';
		}
		//檢核聯絡電話，電話或手機
		let check_applyTelFirm = this._mainService.checkTel(this.reqData.applyTelFirm, true); //家用
		// let check_applyTelFirm = UserCheckUtil.checkTel(this.reqData.applyTelFirm); //家用
		if (check_applyTelFirm['status'] == false) {
			this.checkError.check_applyTelFirm = true;
			this.checkError.error_applyTelFirm = check_applyTelFirm['msg'];
		} else {
			this.checkError.check_applyTelFirm = false;
			this.checkError.error_applyTelFirm = '';
		}
		//公司統編有值再檢核
		if (this.reqData.companyId != '') {
			this._logger.log("into check reqData.companyId:", this.reqData.companyId);
			let check_companyId = UserCheckUtil.checkBusinessNo(this.reqData.companyId);
			if (check_companyId['status'] == false) {
				this.checkError.check_companyId = true;
				this.checkError.error_companyId = check_companyId['msg'];
			} else {
				this.checkError.check_companyId = false;
				this.checkError.error_companyId = '';
			}
			//無輸入不檢核
		} else {
			this.checkError.check_companyId = false;
			this.checkError.error_companyId = '';
		}

		//營業項目
		if (this._checkService.checkEmpty(this.reqData.applyBussitem, true)) {
			let checkBussitem = this._mainService.checkText(this.reqData.applyBussitem);
			if (checkBussitem['status'] == false) {
				this.checkError.error_applyBussitem = checkBussitem['msg'];
			} else {
				this.checkError.error_applyBussitem = '';
			}
		} else {
			this.checkError.error_applyBussitem = '';
		}

		//公司地址
		if (this._checkService.checkEmpty(this.reqData.applyFirmAddr, true)) {
			let checkFirmAddr = this._mainService.checkText(this.reqData.applyFirmAddr);
			if (checkFirmAddr['status'] == false) {
				this.checkError.error_applyFirmAddr = checkFirmAddr['msg'];
			} else {
				this.checkError.error_applyFirmAddr = '';
			}
		} else {
			this.checkError.error_applyFirmAddr = '';
		}

		//員工人數 有輸入時檢核 >0 && <=999999
		if (this._checkService.checkEmpty(this.reqData.applyWorker, true)) {
			let checkApplyWorker = this._mainService.checkApplyWorker(this.reqData.applyWorker);
			if (checkApplyWorker['status'] == false) {
				this.checkError.error_applyWorker = checkApplyWorker['msg'];
			} else {
				this.checkError.error_applyWorker = '';
			}
		} else {
			this.checkError.error_applyWorker = '';
		}

		//分機
		if (this.reqData.applyTelExt != '') {
			let checkApplyTelExt = this._checkService.checkNumber(this.reqData.applyTelExt);
			if (checkApplyTelExt['status'] == false) {
				this.checkError.error_applyTelExt = checkApplyTelExt['msg'];
			} else {
				this.checkError.error_applyTelExt = '';
			}
		} else {
			this.checkError.error_applyTelExt = '';
		}

		//所屬部門
		if (this._checkService.checkEmpty(this.reqData.applyDept, true)) {
			let checkApplyDept = this._mainService.checkText(this.reqData.applyDept);
			if (checkApplyDept['status'] == false) {
				this.checkError.error_applyDept = checkApplyDept['msg'];
			} else {
				this.checkError.error_applyDept = '';
			}
		} else {
			this.checkError.error_applyDept = '';
		}

		//全部過
		if (this.checkError.check_applyServeUnit == false && this.checkError.check_applyTelFirm == false
			&& this.checkError.check_companyId == false && this.checkError.error_applyWorker == ''
			&& this.checkError.error_applyTelExt == '' && this.checkError.error_applyBussitem == ''
			&& this.checkError.error_applyFirmAddr == '' && this.checkError.error_applyDept == '') {
			output.status = true;
			output.msg = 'success';
		} else {
			output.status = false;
			output.msg = 'failed';
		}
		return output;
	}
	//第六頁
	checkPage6() {
		let output = {
			status: false,
			data: {},
			msg: ''
		};
		//職稱
		let checkApplyPost = this._mainService.checkText(this.reqData.applyPost, 10);
		if (checkApplyPost['status'] == false) {
			this.checkError.check_applyPost = true;
			this.checkError.error_applyPost = '請輸入職稱';
		} else {
			this.checkError.check_applyPost = false;
			this.checkError.error_applyPost = '';
		}
		//年資(年)
		if (this.reqData.applyServeYymm == '' || typeof this.reqData.applyServeYymm == 'undefined') {
			this.checkError.check_applyServeYymm = true;
			this.checkError.error_applyServeYymm = '請輸入服務年資';
		} else {
			this.checkError.check_applyServeYymm = false;
			this.checkError.error_applyServeYymm = '';
			// this.checkServerdur(this.reqData.applyServeYymm, this.reqData.serverdur);
		}
		//年資(月)
		if (this.reqData.applyServeMm == '' || typeof this.reqData.applyServeMm == 'undefined') {
			this.checkError.check_applyServeMm = true;
			this.checkError.error_applyServeMm = '請輸入月份';
		} else {
			this.checkError.check_applyServeMm = false;
			this.checkError.error_applyServeMm = '';
		}
		//現職服務年資
		if (this.reqData.serverdur == '' || typeof this.reqData.serverdur == 'undefined') {
			this.checkError.check_serverdur = true;
			this.checkError.error_serverdur = '請輸入現職服務年資';
		} else {
			this.checkError.check_serverdur = false;
			this.checkError.error_serverdur = '';
			// this.checkServerdur(this.reqData.applyServeYymm, this.reqData.serverdur);
		}
		//現職服務年資(月)
		if (this.reqData.serverdurMm == '' || typeof this.reqData.serverdurMm == 'undefined') {
			this.checkError.check_serverdurMm = true;
			this.checkError.error_serverdurMm = '請輸入月份';
		} else {
			this.checkError.check_serverdurMm = false;
			this.checkError.error_serverdurMm = '';
		}
		//年資檢核(服務年資、現職服務年資 皆檢核成功，才判斷是否超過)
		if (!this.checkError.check_applyServeYymm && !this.checkError.check_serverdur) {
			this.checkServerdur(this.reqData.applyServeYymm, this.reqData.serverdur);
		}
		//行業別   
		if (this.reqData.applyTrade == '' || typeof this.reqData.applyTrade == 'undefined') {
			this.checkError.check_applyTrade = true;
			this.checkError.error_applyTrade = '請輸入行業別';
		} else {
			this.checkError.check_applyTrade = false;
			this.checkError.error_applyTrade = '';
		}
		//職業別細項    
		if (this.reqData.metier == '' || typeof this.reqData.metier == 'undefined') {
			this.checkError.check_metier = true;
			this.checkError.error_metier = '請輸入職業別細項';
		} else {
			this.checkError.check_metier = false;
			this.checkError.error_metier = '';
		}
		//職業別分項
		if (this.select_sub_flag == true) {
			if (this.reqData.metier_sub == '' || typeof this.reqData.metier_sub == 'undefined') {
				this.checkError.check_metier_sub = true;
				this.checkError.error_metier_sub = '請輸入職業別分項';
			} else {
				this.checkError.check_metier_sub = false;
				this.checkError.error_metier_sub = '';
			}
		}
		//全過
		if (this.checkError.check_applyPost == false && this.checkError.check_applyServeYymm == false
			&& this.checkError.check_serverdur == false && this.checkError.check_applyTrade == false
			&& this.checkError.check_metier == false && this.checkError.check_metier_sub == false
			&& this.checkError.check_applyServeMm == false && this.checkError.check_serverdurMm == false) {
			output.status = true;
			output.msg = 'success';
		} else {
			output.status = false;
			output.msg = 'failed';
		}
		return output;
	}
	//第七頁
	checkPage7() {
		let output = {
			status: false,
			data: {},
			msg: ''
		};
		let applyNt: any = {}; //檢核本人年收入
		//學生:061410 農林漁牧業:0615A0 無業、家管、退休人員:061700，不檢核個人年收入(只檢核空值、數字)，
		//不是以上欄位在檢核

		let check_list = ['061410', '0615A0', '061700']; //特殊職業代號
		let money_allow_zero = true; //true: 不可有0，false可有0
		if (check_list.indexOf(this.reqData.applyTrade['CN01']) > -1) {
			money_allow_zero = false; //符合以上三者特殊職業，帶false
			this.specialJobFlag = true; //為特殊職業
			this._logger.log("into special job");
		} else {
			this.specialJobFlag = false; //不為特殊職業
			this._logger.log("into not special job");
		}
		if (this.type == 'credit' && this.reqData.loanUsage == '09') {  // alex 紓困收入可為0
			money_allow_zero = false; 
		};
		//本人年收入(萬元)
		applyNt = this._checkService.checkMoney(this.reqData.applyNt, {
			currency: 'TWD',
			not_zero: money_allow_zero
		});
		if (applyNt['status'] == false) {
			this.checkError.check_applyNt = true;
			this.checkError.error_appplyNt = applyNt['msg'];
		} else {
			this.checkError.check_applyNt = false;
			this.checkError.error_appplyNt = '';
			this.checkTotalNt(this.reqData.applyNt, this.reqData.totalNt);
		}
		//財務收支年度 2019/12/09改為必填
		if (this.reqData.mYear == '') {
			this.checkError.error_mYear = '請選擇收支年度';
		} else {
			this.checkError.error_mYear = '';
		}

		//家庭年收入(萬元)
		let totalNt = this._checkService.checkMoney(this.reqData.totalNt, { currency: 'TWD', not_zero: false });
		if (totalNt.status == false) {
			this.checkError.check_totalNt = true;
			this.checkError.error_totalNt = totalNt['msg'];
		} else {
			this.checkError.check_totalNt = false;
			this.checkError.error_totalNt = '';
			this.checkTotalNt(this.reqData.applyNt, this.reqData.totalNt);
		}
		//家庭年支出(萬元)
		let expense = this._checkService.checkMoney(this.reqData.expense, { currency: 'TWD', not_zero: false });
		if (expense.status == false) {
			this.checkError.check_expense = true;
			this.checkError.error_expense = expense['msg'];
		} else {
			this.checkError.check_expense = false;
			this.checkError.error_expense = '';
		}
		//全過
		if (this.checkError.check_applyNt == false && this.checkError.check_expense == false
			&& this.checkError.check_totalNt == false && this.checkError.error_mYear == '') {
			output.status = true;
			output.msg = 'success';
		} else {
			output.status = false;
			output.msg = 'failed';
		}
		return output;
	}
	//-----------檢核頁數 end-----------//

	//檢查家庭年收入
	checkTotalNt(personal, total) {
		let output = {
			status: false,
			data: {
				personal: personal,
				total: total
			},
			msg: ''
		};
		let personalNt = parseInt(personal);
		let totalNt = parseInt(total);
		//個人年收不可大於家庭年收
		if (personalNt > totalNt) {
			output.status = false;
			output.msg = 'failed';
			//個人
			this.checkError.check_applyNt = true;
			this.checkError.error_appplyNt = '本人年收入不可大於家庭年收入';
			//家庭
			this.checkError.check_totalNt = true;
			this.checkError.error_totalNt = '本人年收入不可大於家庭年收入';

		} else {
			output.status = true;
			output.msg = 'success';
			this.checkError.check_applyNt = false;
			this.checkError.error_appplyNt = '';
			//家庭
			this.checkError.check_totalNt = false;
			this.checkError.error_totalNt = '';
		}
		//成功再檢核一次特殊職業
		if (output.status == true) {
			//不是特殊職業，需再檢核一次，個人年收入不可輸入0
			let checkApply_nt = {};
			let money_allow_zero = true;
			if (this.specialJobFlag == false) {
				money_allow_zero = true; //不可有0
			} else {
				money_allow_zero = false; //可有0
			}
			if (this.type == 'credit'&& this.reqData.loanUsage == '09') {  // alex 紓困收入可為0
				money_allow_zero = false; 
			};
			checkApply_nt = this._checkService.checkMoney(this.reqData.applyNt, {
				currency: 'TWD',
				not_zero: money_allow_zero
			});
			if (checkApply_nt['status'] == false) {
				output.status = false;
				this.checkError.check_applyNt = true;
				this.checkError.error_appplyNt = checkApply_nt['msg'];
			} else {
				output.status = true;
				this.checkError.check_applyNt = false;
				this.checkError.error_appplyNt = '';
			}
		}
	}

	//檢查年資、現職服務年資
	checkServerdur(year, nowYear) {
		let output = {
			status: false,
			msg: '',
			data: {
				year: year,
				nowYear: nowYear
			}
		};
		let year_Nt = 0;
		let nowYear_Nt = 0;
		if (year == null || typeof year == 'undefined' || year == '') {
			year_Nt = 0;
		} else {
			year_Nt = parseInt(year);
		}
		if (nowYear == null || typeof nowYear == 'undefined' || nowYear == '') {
			nowYear_Nt = 0;
		} else {
			nowYear_Nt = parseInt(nowYear);
		}
		//現職服務年資需小於年資
		if (nowYear_Nt > year_Nt) {
			output.status = false;
			output.msg = 'failed';
			//現職服務年資
			this.checkError.check_serverdur = true;
			this.checkError.error_serverdur = '現職服務年資不可大於服務年資';
			//服務年資
			this.checkError.check_applyServeYymm = true;
			this.checkError.error_applyServeYymm = '現職服務年資不可大於服務年資';
		} else {
			output.status = true;
			output.msg = 'success';
			this.checkError.check_serverdur = false;
			this.checkError.error_serverdur = '';

			this.checkError.check_applyServeYymm = false;
			this.checkError.error_applyServeYymm = '';
		}
		return output;
	}
	//返回處理
	doBack() {
		this._headerCtrl.setLeftBtnClick(() => {
			switch (this.nowPage) {
				case 'normalPage':
					this._logger.log("into back before");
					this.onBackPageData({}, 'back');
					break;
				case 'basicPage':
					this._logger.log("into back normalPage");
					this.nowPage = 'normalPage';
					this.doScrollTop();
					break;
				case 'basicPage2':
					this._logger.log("into back basicPage");
					this.nowPage = 'basicPage';
					this.doScrollTop();
					break;
				case 'basicPage3':
					this._logger.log("into back basicPage2");
					this.nowPage = 'basicPage2';
					this.doScrollTop();
					break;
				case 'careerPage1':
					this._logger.log("into back basicPage3");
					this.nowPage = 'basicPage3';
					this.doScrollTop();
					break;
				case 'careerPage2':
					this._logger.log("into back careerPage1");
					this.nowPage = 'careerPage1';
					this.doScrollTop();
					break;
				case 'financePage':
					this._logger.log("into back careerPage2");
					this.nowPage = 'careerPage2';
					this.doScrollTop();
					break;
				case 'confirmPage':
					this._logger.log("into back financePage");
					this.nowPage = 'financePage';
					this.doScrollTop();
					break;
				default:
					this._logger.log("no page");
					break;
			}
		});
	}


	//output返回時，將資料帶入
	setOutputData(stage) {
		this._logger.log("apply output, fullData:", this.fullData);
		let allData = this._allService.allData;
		this._logger.log("apply output, allData:", allData);
		this.showData.showGiveAmt = this._formateService.checkField(allData, 'giveAmt'); //預計申請金額
		this.showData.showGiveDurYymm = this._formateService.checkField(allData, 'giveDurYymm'); //貸款期間(年)
		let loanUsage = this._formateService.checkField(allData, 'loanUsage'); //資金用途
		//因為前端要將 借款、資金用途,勾搭在一起(預設)，因此這裡轉換為原本的值
		//非預填(登入)
		if (this.resver == 'N') {
			if (loanUsage == '03') {
				this.reqData.loanUsage = '05';
				this._logger.log("into 03 turn 05, reqData.loanUsage:", this.reqData.loanUsage);
			} else if (loanUsage == '06') {
				this.reqData.loanUsage = '04';
				this._logger.log("into 06 turn 04, reqData.loanUsage:", this.reqData.loanUsage);
			} else {
				this._logger.log("turn else");
				this.reqData.loanUsage = loanUsage;
				this._logger.log("reqData.loanUsage:", this.reqData.loanUsage);
			}
			this.reqData.applyBir = this._formateService.checkField(allData, 'applyBir'); //出生年月日
			//預填單
		} else {
			this.reqData.loanUsage = loanUsage;
			this._logger.log("into resver back reqData.applyBir:", this._formateService.transClone(this.reqData.applyBir));
			this.reqData.applyBir = this._formateService.checkField(allData, 'applyBir');
		}
		this.reqData.graveYymm = this._formateService.checkField(allData, 'graveYymm'); //本金寬限期
		this.reqData.refundWay = this._formateService.checkField(allData, 'refundWay'); //攤還方式
		if (this.type == 'mortgage' || this.type == 'house') {
			this.refundWay_flag = false;
		} else {
			this.refundWay_flag = true;
		}
		if (this.reqData.graveYymm != '') {
			this._logger.log("into reqData.graveYymm != ''");
			this.repayFlag = true;
			this.repayCheck = false;
		} else {
			this._logger.log("into reqData.graveYymm == ''");
			this.repayFlag = false;
			this.repayCheck = true;
		}
		this.reqData.name = this._formateService.checkField(allData, 'repName'); //申請人姓名
		let getSex = this._mainService.getSex(allData.id_no); //取得性別資料
		this.showData.sex = getSex['data']; //畫面顯示
		this.reqData.sex = getSex['type']; //性別帶入req
		this._logger.log("getSex:", getSex);
		this.reqData.id_no = this._formateService.checkField(allData, 'id_no'); //身分證字號
		this.showData.marital_status = this._formateService.checkField(allData, 'maritalStatus'); //婚姻狀況
		this._logger.log("showData.marital_status:", this.showData.marital_status);
		this.showData.support_children = this._formateService.checkField(allData, 'supportChildren'); //受扶養未成年子女數
		this.showData.level_of_education = this._formateService.checkField(allData, 'levelOfEducation'); //教育程度
		let adressData = this._allService.getAdressData(); //取得地址資料
		this.personalData.code_home = this._formateService.checkField(adressData, 'code_home'); //戶籍郵遞區號
		this.personalData.home_addr = this._formateService.checkField(adressData, 'home_addr'); //戶籍地址
		this.oldAdress.region = this._formateService.checkField(adressData, 'region'); //通訊郵遞區號
		this.oldAdress.adress = this._formateService.checkField(adressData, 'adress');  //通訊地址
		this.adressCheck = adressData['checkStatus']; //地址勾選狀態
		//若返回，勾同戶籍地址disable，反之解除disable
		if (this.adressCheck == true) {
			this.adressDisable = true;
		} else {
			this.adressDisable = false;
		}
		this.reqData.applyTelSun = this._formateService.checkField(allData, 'applyTelSun'); //戶籍電話
		this.reqData.applyTelNight = this._formateService.checkField(allData, 'applyTelNight'); //現住電話
		this.reqData.applyTelWalk = this._formateService.checkField(allData, 'applyTelWalk'); //行動電話
		this.reqData.applyTelFax = this._formateService.checkField(allData, 'applyTelFax'); //傳真電話
		this.reqData.eMail = this._formateService.checkField(allData, 'eMail'); //電子信箱
		this.reqData.houseStatus = this._formateService.checkField(allData, 'houseStatus'); //房屋狀況
		this.houseChange();
		this.reqData.homeownership2 = this._formateService.checkField(allData, 'homeownership2'); //設定情形
		this.reqData.houseDurYymm = this._formateService.checkField(allData, 'houseDurYymm'); //已居住年數
		this.reqData.applyServeUnit = this._formateService.checkField(allData, 'applyServeUnit'); //任職公司
		this.reqData.companyId = this._formateService.checkField(allData, 'companyId'); //公司統編
		this.reqData.applyBussitem = this._formateService.checkField(allData, 'applyBussitem'); //營業項目
		this.reqData.applyFirmAddr = this._formateService.checkField(allData, 'applyFirmAddr'); //公司地址
		this.reqData.applyWorker = this._formateService.checkField(allData, 'applyWorker'); //員工人數
		this.reqData.applyTelFirm = this._formateService.checkField(allData, 'applyTelFirm'); //公司電話
		this.reqData.applyTelExt = this._formateService.checkField(allData, 'applyTelExt'); //公司電話分機
		this.reqData.applyDept = this._formateService.checkField(allData, 'applyDept'); //所屬部門
		this.reqData.applyPost = this._formateService.checkField(allData, 'applyPost'); //職稱
		this.reqData.applyServeYymm = this._formateService.checkField(allData, 'applyServeYymm'); //服務年資
		this.reqData.applyServeMm = this._formateService.checkField(allData, 'applyServeMm'); //服務年資(月)
		this.reqData.serverdur = this._formateService.checkField(allData, 'serverdur'); //現職服務年資
		this.reqData.serverdurMm = this._formateService.checkField(allData, 'serverdurMm'); //現職服務年資(月)

		this.default_job = this._allService.getKycJobData(); //取得Kyc選擇之職業資料(全部)，帶入申請書預設
		this._logger.log("1. default_job:", this.default_job);
		this.reqData.applyTrade = this._formateService.checkField(this.default_job, 'applyTrade'); //kyc選擇之行業別帶入
		this.reqData.metier = this._formateService.checkField(this.default_job, 'metier'); //kyc選擇之職業別細項帶入
		this.reqData.metier_sub = this._formateService.checkField(this.default_job, 'metier_sub'); //kyc選擇之職業別分項帶入
		//如果選的細項有分項資料
		if (typeof this.reqData.metier == 'object' && this.reqData.metier
			&& this.reqData.metier.hasOwnProperty('detail')
			&& (this.reqData.metier['detail'] instanceof Array)
			&& this.reqData.metier['detail'].length > 0
		) {
			this._logger.log("is sub");
			this.select_sub = this.reqData.metier['detail']; //將對應的分項資料帶入
			this.select_sub_flag = true;
			//選擇之細項無分項資料，清空
		} else {
			this._logger.log("into not sub");
			this.select_sub = [];
			this.reqData.metier_sub = '';
			this.select_sub_flag = false;
		}
		this.reqData.mYear = this._formateService.checkField(allData, 'mYear'); //財務收支年度
		this.reqData.applyNt = this._formateService.checkField(allData, 'applyNt'); //本人年收入(萬元)
		this.reqData.spouseNt = this._formateService.checkField(allData, 'spouseNt'); //配偶年收入(萬元)
		this.reqData.totalNt = this._formateService.checkField(allData, 'totalNt'); //家庭年收入(萬元)
		this.reqData.expense = this._formateService.checkField(allData, 'expense'); //家庭年支出(萬元)
		this.reqData.branchName = this._formateService.checkField(allData, 'branchName'); //本次增貸案件(分行名)
		this.reqData.acctno = this._formateService.checkField(allData, 'acctno'); //帳號
		this.reqData.account = this._formateService.checkField(allData, 'account'); //委扣帳號
		this.backShowData();
		if (stage == true) {
			this.nowPage = 'normalPage'; //第一頁
		} else {
			this.nowPage = 'confirmPage'; //返回去認頁(顯示)
		}
	}

	//顯示中文名稱資料
	backShowData() {
		if (this.repayCheck) {
			this.reqData.refundWay = '1';
			this.reqData.refundName = '依年金法按月本息平均攤還';
		} else {
			this.reqData.refundWay = '4';
			this.reqData.refundName = '本金償還寬限期限';
			switch (this.reqData.graveYymm) {
				case '0100':
					this.showData.showGraveYymm = '01';
					break;
				case '0200':
					this.showData.showGraveYymm = '02';
					break;
				case '0300':
					this.showData.showGraveYymm = '03';
					break;
			}
		}
		this.select_loage = this.selectLoage(this.usageData.usageTemp); //取得選擇之那筆(資金用途)


		if (this.reqData.sex == '1') {
			this.reqData.sexName = '男';
		} else {
			this.reqData.sexName = '女';
		}
		if (this.showData.marital_status == '1') {
			this.showData.marital_name = '單身';
			this.reqData.maritalStatus = '1';
		} else if (this.showData.marital_status == '2') {
			this.showData.marital_name = '已婚';
			this.reqData.maritalStatus = '2';
		} else {
			this.showData.marital_name = '其他';
			this.reqData.maritalStatus = '3';
		}
		switch (this.showData.level_of_education) {
			case '1':
				this.showData.level_of_education_name = '研究所以上';
				this.reqData.levelOfEducation = '1';
				break;
			case '2':
				this.showData.level_of_education_name = '大學';
				this.reqData.levelOfEducation = '2';
				break;
			case '3':
				this.showData.level_of_education_name = '專科';
				this.reqData.levelOfEducation = '3';
				break;
			case '4':
				this.showData.level_of_education_name = '高中職';
				this.reqData.levelOfEducation = '4';
				break;
			case '5':
				this.showData.level_of_education_name = '中學以下';
				this.reqData.levelOfEducation = '5';
				break;
			case '6':
				this.showData.level_of_education_name = '其他';
				this.reqData.levelOfEducation = '6';
				break;
			default:
				this.showData.level_of_education_name = '其他';
				this.reqData.levelOfEducation = '6';
		}
		//受撫養子女數
		this.reqData.supportChildren = this.showData.support_children; //畫面顯示帶入


		switch (this.reqData.houseStatus) {
			case '0':
				this.showData.houseStatus = '自有';
				break;
			case '4':
				this.showData.houseStatus = '親屬所有';
				break;
			case '5':
				this.showData.houseStatus = '宿舍';
				break;
			case '6':
				this.showData.houseStatus = '租賃';
				break;
			case '7':
				this.showData.houseStatus = '其他';
				break;
			default:
				this.showData.houseStatus = '--';
		}
		if (this.houseFlag == true) {
			switch (this.reqData.homeownership2) {
				case '1':
					this.showData.homeownership2 = '無設定';
					break;
				case '2':
					this.showData.homeownership2 = '設定予本行';
					break;
				case '3':
					this.showData.homeownership2 = '設定予他行';
					break;
				default:
					this.showData.homeownership2 = '--';
			}
		}

		if (this.reqData['applyTrade'] != '' && this.reqData['applyTrade'] != null
			&& typeof this.reqData['applyTrade'] != 'undefined') {
			this.showData.showApplyTrade = this.reqData['applyTrade']['CNAME1'];
		} else {
			this.showData.showApplyTrade = '';
		}
		if (this.reqData['metier'].hasOwnProperty('CNAME1') && this.reqData['metier']['CNAME1'] != ''
			&& this.reqData['metier']['CNAME1'] != null && typeof this.reqData['metier']['CNAME1'] != 'undefined') {
			this.showData.showMetier = this.reqData['metier']['CNAME1'];
		} else {
			this.showData.showMetier = '';
		}
		if (this.reqData['metier_sub'].hasOwnProperty('CNAME1') && this.reqData['metier_sub']['CNAME1'] != ''
			&& this.reqData['metier_sub']['CNAME1'] != null && typeof this.reqData['metier_sub']['CNAME1'] != 'undefined') {
			this.showData.showMetier_sub = this.reqData['metier_sub']['CNAME1'];
		} else {
			this.showData.showMetier_sub = '';
		}
	}

	checkBasicData(type: any, value: any) {
		if (this.adressCheck == true) {
			switch (type) {
				case 'postalCode':
					this.oldAdress['region'] = value;
					break;
				case 'adress':
					this.oldAdress['adress'] = value;
					break;
			}
		}
	}

}
