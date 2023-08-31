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
import { SelectBranchService } from './select-branch.service';

@Component({
    selector: 'app-select-branch',
    templateUrl: './select-branch.component.html',
    providers: [SelectBranchService],

})
export class SelectBranchComponent implements OnInit {
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
    //檢核相關(顯示)
    checkSelect = {
        error_city: '',
        error_branchName: ''
    };
    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private _handleError: HandleErrorService
        , private _mainService: SelectBranchService
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
        let checkSelectBranch = this.checkBranch();
        if (checkSelectBranch['status'] == false) {
            return false;
        } else {
            this.onBackPageData(this.bindData, 'go');
        }
    }

    //地區切換
    cityChange() {
        this.nameData = this.branchNameData[this.bindData.city];
        this.bindData.branchName = '';
    }

    //分行名切換
    onNameChange() {
        this.idData = this.branchIdData[this.bindData.branchName];
    }

    //檢核自選分行
    checkBranch() {
        let output = {
            status: false,
            msg: 'error',
        };
        //檢核自選地區
        if (this.bindData.city == '' || typeof this.bindData.city == 'undefined'
            || this.bindData.city == null) {
            this.checkSelect.error_city = '請選擇行政區';
            output.status = false;
        } else {
            this.checkSelect.error_city = '';
        }
        //檢核自選分行
        if (this.bindData.branchName == '' || typeof this.bindData.branchName == 'undefined'
            || this.bindData.branchName == null) {
            this.checkSelect.error_branchName = '請選擇分行';
            output.status = false;
        } else {
            this.checkSelect.error_branchName = '';
        }
        //都過
        if (this.checkSelect.error_city == '' && this.checkSelect.error_branchName == '') {
            output.status = true;
            output.msg = '';
        }
        return output;
    }

    /**
 * 重新設定page data
 * @param item
 */
    onBackPageData(item, type) {
        let output = {
            'page': 'select-branch',
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
            'page': 'select-branch',
            'type': 'error',
            'data': error_obj
        };
        this._logger.error('HomePage', 'gold', error_obj);
        output.type = type;
        this.errorPageEmit.emit(output);
    }
}

