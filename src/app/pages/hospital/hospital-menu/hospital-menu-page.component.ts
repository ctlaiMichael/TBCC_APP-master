/**
 * Header
 * 
 * Hospital
 * type: insurance 產壽險服務
 * type: hospital  醫療服務
 */
import { Component, OnInit } from '@angular/core';
import { HospitalService } from 'app/pages/hospital/shared/service/hospital.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { Logger } from '@core/system/logger/logger.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
	selector: 'app-hospital-menu-page',
	templateUrl: './hospital-menu-page.component.html',
	styleUrls: [],
	providers: [HospitalService]
})

export class HospitalMenuPageComponent implements OnInit {
	/**
	 * 參數設定
	 * 
	 */

	data = [];
	info_data = {};
	showData = true;       //是否顯示資料(後端)
	popupFlag = false;     //是否開啟popup
	hasBranchMenu = [];    //當下點選的醫院(有分院)
	setType = 'hospital';


	// 使用者所選醫院與其分院
	choseHospital = {
		hospital: {},
		branch: {}
	};

	select_branch = false; //顯示紅框(選擇了:請選擇)


	constructor(
        private _logger: Logger,
		private _mainService: HospitalService,
		private route: ActivatedRoute,
		private _handleError: HandleErrorService,
		private navgator: NavgatorService) {
	}

	ngOnInit() {

		// 判斷使用者所選為 醫療服務或產壽險服務
		this.route.queryParams.subscribe(params => {
			if (params.hasOwnProperty('type')) {
				// set data
				this.setType = params['type'];
			}
			this.getData(); // url params變更時執行
		});

	}

	/**
	 * 向service取得資料
	 */
	getData(): Promise<any> {
		return this._mainService.getData(this.setType).then(
			(result) => {
				this.info_data = result.info_data;
				this.data = result.data;
				this.info_data = result.info_data;   //拿一整個資料物件{}
				this.data = result.data;             //拿{}中的詳細資料[] 
				this.showData = true;
			},
			(errorObj) => {
				this.showData = false;
				// let error_msg = 'Error';
				// if (typeof errorObj === 'object' && errorObj.hasOwnProperty('msg')) {
				// 	error_msg = errorObj.msg; // 去service拿全部資料(失敗)
				// }
				errorObj['type'] = 'dialog';
				this._handleError.handleError(errorObj);
			}
		);
	}

	/**
	 * 點擊醫院
	 * @param menu 醫院或產壽險
	 */
	onBranchEvent(menu: Object) {
		this.choseHospital.hospital = menu;
		// service以判斷是否有分院
		if (this.choseHospital.hospital['_showBranch'] == true) {
			this.popupFlag = true;     //有分院顯視popup 
			this.hasBranchMenu.push({
				branchId: 'no_select',
				branchName: '請選擇',
				source: '請選擇',
				showName: '請選擇'
			});
			this.hasBranchMenu = this.hasBranchMenu.concat(menu['branch_menu']);
			this.choseHospital.branch = this.hasBranchMenu[0];
		} else {
			this.popupFlag = false;
			//沒有分院將資料清空
			this.choseHospital.branch = (typeof menu['branch_menu'][0] !== 'undefined') ? menu['branch_menu'][0] : {};
			this.onGoEvent();
		}

	}

	/**
	 * 取消popup
	 */
	onCancelEvent() {
		this.popupFlag = false;
		this.choseHospital.hospital = {};
		this.choseHospital.branch = {};
		this.hasBranchMenu = [];
		this.select_branch = false;
	}

	/**
	 * 進入該分院功能清單
	 */
	onGoEvent() {
		if (!this.choseHospital.branch.hasOwnProperty('branchId')
			|| this.choseHospital.branch['branchId'] === 'no_select'
		) {
			// alet no selet
			this.select_branch = true;
			return false;
		}
		//下一頁醫院or產壽險
		let typeParams = {
			type: ""
		}
		this.route.queryParams.subscribe(params => {
			if (params.hasOwnProperty('type')) {
				// set data
				typeParams.type = params['type'];
			}
		});

		// go to 
		let url_params = {
			hospitalId: '',
			branchId: '',
			branchName: '',
			type: ''
		};
		url_params['hospitalId'] = this.choseHospital['hospital']['hospitalId'];
		url_params['branchId'] = this.choseHospital['branch']['branchId'];
		url_params['branchName'] = this.choseHospital['branch']['branchName'];
		url_params['type'] = typeParams['type'];


		//將url導入下一頁使用
		// this.router.navigate([{ outlets: { primary: 'hospital/branch-menu' } }], { queryParams: url_params });
		if (url_params.type == 'insurance') {
			this.navgator.push('insurance-branch', {}, url_params);
		} else {
			this.navgator.push('hospital-branch', {}, url_params);
		}
	}

}