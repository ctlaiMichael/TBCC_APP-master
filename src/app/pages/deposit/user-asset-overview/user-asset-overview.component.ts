/**
 * 帳務總資產
 * 2019.12.09 我的金庫
 */
import { Component, OnInit, ElementRef } from '@angular/core';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { LeftMenuService } from '@core/layout/left-menu/left-menu.service';
import { Logger } from '@core/system/logger/logger.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { DepositInquiryService } from '@pages/deposit/shared/service/deposit-inquiry.service';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { LoadingSpinnerService } from '@core/layout/loading/loading-spinner.service';
declare var ringChart: any; // 引用外部javascript

@Component({
	selector: 'app-asset-overview',
	templateUrl: './user-asset-overview.component.html',
	styleUrls: ['./user-asset-overview.component.css']
})

export class UserAssetOverviewComponent implements OnInit {

	/**
	 * 參數處理
	 */
	// 確認資料取得狀態處理
	assetsData: any;
	showData = false;
	showTotalAmount = 0;
	listData = [];
	percentData = [
		// No1
		{ id: '', name: '', amount: 0, percentage: 0, status: false, path: '' },
		// No2
		{ id: '', name: '', amount: 0, percentage: 0, status: false, path: '' },
		// No3
		{ id: '', name: '', amount: 0, percentage: 0, status: false, path: '' }
	];
	ringChart: any;
	private loadingKey = '_UserAsset';
	closeAssets = true;

	constructor(
		private headerCtrl: HeaderCtrlService,
		public leftMenu: LeftMenuService,
		private _logger: Logger,
		private navgator: NavgatorService,
		private _depositInquiryService: DepositInquiryService,
		private _formateService: FormateService,
		private _elementRef: ElementRef
		, private _handleError: HandleErrorService
        , private loading: LoadingSpinnerService
	) {
		this.ringChart = new ringChart();
	}

	ngOnInit() {

		const header = this.navgator.getHeader();
		this.headerCtrl.updateOption(header);
		this.headerCtrl.setBodyClass(['inner_page', 'save_overview_page']);
		this.initDoEvent();
		// 取得台幣外幣

	}

	/**
	 * 點擊事件
	 * @param data
	 */
	onGoEvent(data) {
		let path = this._formateService.checkField(data, 'path');
		if (path && path != '') {
			this.navgator.push(path);
		}
	}

	onRetry() {
		this.initDoEvent(true);
	}

	// --------------------------------------------------------------------------------------------
	//  ____       _            _         _____                 _
	//  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
	//  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
	//  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
	//  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
	// --------------------------------------------------------------------------------------------


	private initDoEvent(retry?: boolean) {
		// 取得資料預設需與 預設listData上的做對應
		// 2019.12.09 我的金庫
        let option = {
            background: true,
            reget: false
		};
		if (retry) {
			option.reget = true;
		}

		let main_data = {
			'twd' : { id: 'twd', name: '台幣', amount: 0, percentage: 0, status: false, path: 'deposit-overview' }
			, 'forex': { id: 'forex', name: '外幣', amount: 0, percentage: 0, status: false, path: 'foreign-exchange-inquiry' }
			, 'fund': { id: 'fund', name: '基金', amount: 0, percentage: 0, status: false, path: 'fund-report' }
			// 黃金上線再開啟
			, 'gold': { id: 'gold', name: '黃金', amount: 0, percentage: 0, status: false, path: '' }
			// , 'gold': { id: 'gold', name: '黃金', amount: 0, percentage: 0, status: false, path: 'gold-detail' }
		};

		this.loading.show(this.loadingKey);
		this._depositInquiryService.getAssets(option).then(
            (resObj) => {
				let list_data = [];
				if (resObj.close) {
					this.closeAssets = true;
				} else if (typeof resObj['_modify'] == 'object' && resObj['_modify']) {
					this.closeAssets = false;
					let checkData = resObj['_modify'];
					// 總資產
					if (checkData.deposit.status) {
						this.showTotalAmount = checkData.deposit.amount;
					}

					let tmp_key: any;
					// 台幣
					tmp_key = 'twd';
					if (checkData.twd.status) {
						main_data[tmp_key].amount = checkData.twd.amount;
						main_data[tmp_key].percentage = checkData.twd.percentage;
						main_data[tmp_key].status = checkData.twd.status;
						list_data.push(main_data.twd);
					}
					// 外幣折台
					tmp_key = 'forex';
					if (checkData.forex.status) {
						main_data[tmp_key].amount = checkData.forex.amount;
						main_data[tmp_key].percentage = checkData.forex.percentage;
						main_data[tmp_key].status = checkData.forex.status;
						list_data.push(main_data.forex);
					}
					// 基金折台
					tmp_key = 'fund';
					if (checkData.fund.status) {
						main_data[tmp_key].amount = checkData.fund.amount;
						main_data[tmp_key].percentage = checkData.fund.percentage;
						main_data[tmp_key].status = checkData.fund.status;
						list_data.push(main_data.fund);
					}
					// 黃金折台
					tmp_key = 'gold';
					if (checkData.gold.status) {
						main_data[tmp_key].amount = checkData.gold.amount;
						main_data[tmp_key].percentage = checkData.gold.percentage;
						main_data[tmp_key].status = checkData.gold.status;
						list_data.push(main_data.gold);
					}
				}

				// 資料依金額大>小排序
				this.listData = this._formateService.transArraySort(list_data, { sort: 'amount', reverse: 'DESC', special: 'amount' });
				this.showData = true;
				this.loading.hide(this.loadingKey);
				this.setNewChartData();
			},
            (errorObj) => {
				this.loading.hide(this.loadingKey);
				errorObj['type'] = 'message';
				this._handleError.handleError(errorObj);
			}
		);
	}


	/**
	 * 新版本chart
	 * listData已排序
	 */
	private setNewChartData() {

		let circleNo1 = 'circle01'; // 中：No1
		let circleNo2 = 'circle03'; // 右：No2
		let circleNo3 = 'circle02'; // 左：No3
		let circleNo1_Obj = this._elementRef.nativeElement.querySelector('.' + circleNo1);
		let circleNo2_Obj = this._elementRef.nativeElement.querySelector('.' + circleNo2);
		let circleNo3_Obj = this._elementRef.nativeElement.querySelector('.' + circleNo3);
		let outerClassObj = this._elementRef.nativeElement.querySelector('.circle_area');

		// No1
		if (!!this.listData[0]) {
			this.percentData[0] = this.listData[0];
		}
		if (this.percentData[0].percentage == 0 || !this.percentData[0].percentage ) {
			this.percentData[0].status = false;
		}
		// No2
		if (!!this.listData[1]) {
			this.percentData[1] = this.listData[1];
		}
		if (this.percentData[1].percentage == 0 || !this.percentData[1].percentage ) {
			this.percentData[1].status = false;
		}
		// No3
		if (!!this.listData[2]) {
			this.percentData[2] = this.listData[2];
		}
		if (this.percentData[2].percentage == 0 || !this.percentData[2].percentage ) {
			this.percentData[2].status = false;
		}

		this._logger.log('Assets', this.percentData);

		// No1
		if (this.percentData[0].status) {
			let settingObj_0 = {
				className: circleNo1,
				classObj: circleNo1_Obj, // targetClassName
				charTotalDegrees: 360, // 圖形總度數
				percentage: this.percentData[0].percentage, // 資料趴數
				radiusTimes: 0.78, // 半徑大小
				lineCapType: 'round', // 線條樣式
				tolerance: 0.02, // 線條樣式為round 顯示會有誤差值
				lineWidth: 13, // 線條寬度
				startPI: 0.5, // 開始畫圖位置多少PI
				outerClassObj: outerClassObj // 最外層框
			};
			this.ringChart.doRingChart(settingObj_0);
		}

		// No2
		if (this.percentData[1].status) {
			let settingObj_1 = {
				className: circleNo2,
				classObj: circleNo2_Obj,  // targetClassName
				charTotalDegrees: 240, // 圖形總度數
				percentage: this.percentData[1].percentage, // 資料趴數
				radiusTimes: 0.78, // 半徑大小
				startPI: 0.833, // 開始畫圖位置多少PI
			};
			this.ringChart.doSectorChart(settingObj_1);
		}

		// No3
		if (this.percentData[2].status) {
			let settingObj_3 = {
				className: circleNo3, // targetClassName
				classObj: circleNo3_Obj, // targetClassName
				charTotalDegrees: 250, // 圖形總度數
				percentage: this.percentData[2].percentage, // 資料趴數
				radiusTimes: 0.70, // 半徑大小
				startPI: 0.15 // 開始畫圖位置多少PI
			};
			this.ringChart.doSectorChart(settingObj_3);
		}

		// this.navgator.pageInitEnd(); // 取得資料後顯示頁面
	}

}
