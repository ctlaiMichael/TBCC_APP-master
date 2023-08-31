/**
 * 
 * 
 * 分行查詢
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FundSelectBranchService } from './fund-select-branch.service';

@Component({
    selector: 'app-fund-select-branch',
    templateUrl: './fund-select-branch.component.html',
    providers: [FundSelectBranchService],

})
export class FundSelectBranchComponent implements OnInit {
    /**
     * 參數處理
     */
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    info_data: any = {};
    data: any = [];
    //綁ngModel
    bindData: any = {
        city: '',
        branchId: '',
        branchName: ''
    };
    cityData = []; //縣市
    branchNameData = []; //名稱
    branchIdData = []; //ID
    dfBranchName = [];
    //回傳
    returnData = {
        branchId: '', //分行代碼
        branchName: '', //分行名稱
        city: '' //所在縣市
    };
    nameData = [];
    idData = '';
    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private _handleError: HandleErrorService
        , private _mainService: FundSelectBranchService
    ) {
    }

    ngOnInit() {
        this._mainService.getBranch().then(
            (result) => {
                this._logger.log("result:", result);
                this.info_data = result.info_data;
                this.data = result.data;
                let formateData = result['_modify'];
                // let formateData = this._mainService.formateBranch(this.data);
                // let cityTemp = formateData['city'];
                // this._logger.log("cityTemp:", cityTemp);
                // //整理縣市順序
                // let cityList = ['基隆市', '台北市', '臺北市', '新北市', '桃園市', '桃園縣' , '新竹市', '新竹縣', '苗栗縣', '台中市', '臺中市', '彰化縣', '南投縣', '雲林縣', '嘉義市', '嘉義縣', '台南市', '臺南市', '高雄市', '屏東縣', '台東縣', '臺東縣', '花蓮縣', '宜蘭縣', '澎湖縣', '金門縣', '連江縣'];
                // let indexList = [];
                // let newList = [];
                // cityList.forEach(item => {
                //     let tmp_index = cityTemp.indexOf(item);
                //     if (tmp_index > -1) {
                //         this._logger.log("into has city");
                //         newList.push(item);
                //         indexList.push(tmp_index);
                //     }
                // });
                // if (newList.length < cityTemp.length) {
                //     // miss
                // }

                this.cityData = formateData['city'];
                this._logger.log("cityData:", this.cityData);
                this.branchNameData = formateData['city_branch'];
                this.branchIdData = formateData['branchId'];
                this._logger.log("info_data:", this.info_data);
                this._logger.log("data:", this.data);
                this._logger.log("formateData:", formateData);
            },
            (errorObj) => {
                this._logger.log("errorObj:", errorObj);
                this.onErrorBackEvent(errorObj, 'errorBack');
            }
        );
    }
    //取消
    onCancel() {
        this.onBackPageData({}, 'back');
    }
    //確認
    onPopConfirm() {
        this.bindData['branchId'] = this.idData[0];
        this._logger.log("bindData:", this.bindData);
        this.onBackPageData(this.bindData, 'go');
    }

    //地區切換
    cityChange() {
        this.nameData = this.branchNameData[this.bindData.city];
        console.log('branchNameData', this.branchNameData);
        console.log('bindData.city', this.bindData.city);
        console.log('nameData', this.nameData);
    }

    //分行名切換
    onNameChange() {
        this.idData = this.branchIdData[this.bindData.branchName];
    }

    /**
 * 重新設定page data
 * @param item
 */
    onBackPageData(item, type) {
        let output = {
            'page': 'select_branch',
            'type': 'go',
            'data': item,
        };
        output.type = type;
        this._logger.log("back output:", output);
        this.backPageEmit.emit(output);
    }

    /**
 * 失敗回傳
 * @param error_obj 失敗物件
 */
    onErrorBackEvent(error_obj, type) {
        let output = {
            'page': 'select_branch',
            'type': 'error',
            'data': error_obj
        };
        this._logger.error('HomePage', 'gold', error_obj);
        output.type = type;
        this.errorPageEmit.emit(output);
    }
}

