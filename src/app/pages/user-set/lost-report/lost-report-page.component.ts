/**
 * Header
 */
import { Component, OnInit, Input, Renderer2, NgZone } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { LostReportService } from '@pages/user-set/shared/service/lost-report.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AuthCheckUtil } from '@shared/util/check/word/auth-check-util';
import { DateUtil } from '@shared/util/formate/date/date-util';

@Component({
    selector: 'app-lost-report-page',
    templateUrl: './lost-report-page.component.html',
    styleUrls: [],
})
/**
  * email變更
  */
export class LostReportPageComponent implements OnInit {

    pageType = 'edit';
    popFlag = false;
    successMsg = '';
    // 控制開關
    accountFlag = false;
    canReplacementFlag = false;
    selectReplacementFlag = true;
    sendAreaFlag = false;
    branchFlag = false;
    // 下拉選單
    showData = {};
    accountList: any; // 帳號選單
    replacementList: any; // 補發方式選單
    branchList: any; // 分行列表
    // 選擇項目
    lostType = '0'; // 選擇的lostType
    accountNo = '0'; // 選擇的帳號
    reissueType = '0'  // 補發方式
    cityVal = '0';    // 寄送地區key值
    cityName = ''; // 寄送地區name
    branchId = ''; // 分行ID
    branchName = ''; // 分行ID
    replacementRadio = '1';
    selectBranchIndex = '0';
    selectAccountIndex = '0';
    // 檢核
    classNameDefault = 'inner_table_frame';
    classNameError = 'inner_table_frame active_warnning';
    errorMsg = {
        'lostType': { 'className': this.classNameDefault, 'message': '請選擇種類' },
        'accountNo': { 'className': this.classNameDefault, 'message': '請選擇帳號/卡號' },
        'reissueType': { 'className': this.classNameDefault, 'message': '請選擇補發方式' },
        'cityName': { 'className': this.classNameDefault, 'message': '請選擇寄達地區' }
    };

    confirmListData = [];
    finalListData = [];
    finalReqObj = {
        lostType: '',
        accountNo: '',
        replacementWay: '',
        sendTo: '',
        password: ''
    };
    inpSetData = {
        // title: '',
        // placeholder: ''
    };
    inp_data = {
        pswd: ''
    };
    error_data = {
        pswd: ''
    };
    constructor(
        private _logger: Logger
        , private _lostReportService: LostReportService
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private confirm: ConfirmService
        , private navgator: NavgatorService
    ) { }

    ngOnInit() {
        this.getInitInfo();
    }

    /**
     * 輸入返回事件
     * @param e
     */
    onInputBack(e) {
        // this._logger.step('OTP', 'onInputBack', e);
        this.inp_data.pswd = e;
    }

    /**
    * 導致結果頁
    */
    goResult() {
        // 密碼檢核
        const check_data = AuthCheckUtil.checkOldPswd(this.inp_data.pswd);
        // 發送資料電文103
        if (check_data.status) {
            this.finalReqObj.lostType = this.lostType;
            this.finalReqObj.accountNo = this.accountNo;
            this.finalReqObj.replacementWay = this.reissueType;
            this.finalReqObj.sendTo = this.branchId;
            this.finalReqObj.password = this.inp_data.pswd;
            this._lostReportService.sendData(this.finalReqObj).then(
                (result_S) => {
                    // 
                    let transDate = DateUtil.transDate(result_S.trnsDateTime);
                    // 
                    this.successMsg = result_S.msg;
                    this.finalListData = this.confirmListData;
                    this.finalListData.splice(0, 0, { 'key': 'transTime', 'title': '交易時間', 'detail': transDate, 'show': true })
                    this.pageType = 'result';
                }, (result_F) => {
                    // 
                    result_F['type'] = 'message';
                    this._handleError.handleError(result_F);
                }
            );
        } else {
            this.error_data.pswd = check_data.msg;
        }
    }

    // 跳出popup是否返回
    cancelEdit() {
        this.confirm.show('您是否放棄此次編輯?', {
            title: '提醒您'
        }).then(
            () => {
                //確定
                this.navgator.push('user-set');
            },
            () => {

            }
        );
    };

    toEditPage() {
        this._headerCtrl.setLeftBtnClick(() => {
            this.cancelEdit();
        });
        // 
        this.pageType = 'edit';
    }
    // type===0 error
    changeClass(key, type?) {
        let setClass = this.classNameDefault;
        if (type === '0') {
            setClass = this.classNameError;
        }
        this.errorMsg[key].className = setClass;
    }
    /**
       * 檢查並至確認頁
       */
    checkEvent(type?) {
        let goNext = true;
        // 種類
        if (this.lostType === '0') {
            this.changeClass('lostType', '0');
            goNext = false;
        } else {
            this.changeClass('lostType');
        }
        // 帳戶
        if (this.accountNo === '0') {
            this.changeClass('accountNo', '0');
            goNext = false;
        } else {
            this.changeClass('accountNo');
        }
        // 能否補發
        if (this.canReplacementFlag) {
            // this.replacementRadio
            // 補發方式
            if (this.selectReplacementFlag) {
                // 
                if (this.reissueType === '1' && this.sendAreaFlag) {
                    // 親洽
                    if (this.cityVal === '0') {
                        this.changeClass('cityName', '0');
                        goNext = false;
                    } else {
                        this.changeClass('cityName');
                    }
                } else if (this.reissueType === '0') {
                    this.changeClass('reissueType', '0');
                    goNext = false;
                } else {
                    this.changeClass('reissueType');
                }
            }
        }
        if (goNext) {
            // 
            this.pageType = 'confirm';
            this.doShowList();
        }
    }

    callService() {
        this.confirm.show(
            '您要撥給合作金庫服務專線嗎?\n04-22273131',
            { title: '外撥提醒' }).then(
                () => {
                    location.href = 'tel:+886-4-22273131';
                }, () => { });
    }
    getInitInfo() {
        // 查詢 fk000101
        this._lostReportService.getLostUserInfo().then(
            (getInfo_S) => {
                this.showData = getInfo_S;
            }, (getInfo_F) => {
                this._handleError.handleError(getInfo_F);
            }
        );
    }

    // 切換掛失種類
    onChange(e) {
        // 資料初始設定
        this.resetData();
        this.resetClass();
        // 發電文fk000102帳號選單
        this.lostType = e.target.value;
        if (this.lostType !== '0') {
            let req = {
                lostType: e.target.value
            }
            this._lostReportService.getAccountList(req).then(
                (getAccount_S) => {
                    this.accountFlag = true;
                    this.accountList = getAccount_S;
                    // 
                }, (getAccount_F) => {
                    this.accountFlag = false;
                    // 
                    this._handleError.handleError(getAccount_F);
                }
            );
        }
    }
    onChangeAccount(e) {
        this.resetClass();
        // isCombo: 'default' 
        // 可補發
        // 
        // 
        this.selectAccountIndex = e.target.value;
        if (this.accountList[this.selectAccountIndex].isCombo !== 'default') {
            this.accountNo = this.accountList[this.selectAccountIndex].accountNo;

            if (this.showData['lostType'][this.lostType].replacementFlag !== '0') {
                this.canReplacementFlag = true;
                // 
                // 選擇為信用卡 且為comBod卡只能親洽
                // replacementWay 1=親洽,2=郵寄
                if (this.lostType === '2' && this.accountList[this.selectAccountIndex].isCombo === '1') {
                    this.replacementList = ['1'];
                } else {
                    this.replacementList = this.showData['lostType'][this.lostType].replacementWay.split(',');
                }
                if (this.replacementList.indexOf('0') < 0) {
                    this.replacementList.splice(0, 0, '0');
                }
                // 設定replacementWay List
            } else {
                this.canReplacementFlag = false;
            }
        } else {
            this.canReplacementFlag = false;
            this.accountNo = '0';
            this.onchangeRadio('1');
        }
    }

    // 切換是否補發
    onchangeRadio(val) {
        this.resetClass();
        this.sendAreaFlag = false;
        this.reissueType = '0';
        this.onChangeArea('0');
        this.replacementRadio = val;
        if (this.replacementRadio === '0') {
            this.selectReplacementFlag = false;
        } else {
            this.selectReplacementFlag = true;
        }
    }
    // 切換寄送方式
    onChangeReplace(e) {
        // 
        this.resetClass();
        this.onChangeArea('0');
        this.sendAreaFlag = false;
        this.reissueType = e.target.value;

        if (this.reissueType === '1') {
            // 親洽branchFlag
            this.sendAreaFlag = true;
        } else if (this.reissueType === '2') {
            // 寄送地址
        } else {
            // 預設
        }

    }
    // 切換地區
    onChangeArea(e) {
        this.resetClass();
        if (typeof e === 'string') {
            this.cityVal = e;
        } else {
            this.cityVal = e.target.value;
        }

        this.branchFlag = false;
        if (this.cityVal !== '0') {
            this.branchFlag = true;
            this.cityName = this.showData['city'][this.cityVal];
            this.branchList = this.showData['list'][this.cityName];
        } else {
            this.cityName = '';
            this.branchList = '';
            this.branchId = '';
        }
        this.onChangeBranch('0');
    }
    // 切換分行
    onChangeBranch(e) {
        // 
        if (typeof e === 'string') {
            this.selectBranchIndex = e;
        } else {
            this.selectBranchIndex = e.target.value;
        }
        // this.branchList[e.target.value]
        if (this.branchList) {
            this.branchId = this.branchList[this.selectBranchIndex].branchId;
            this.branchName = this.branchList[this.selectBranchIndex].branchName;
        }
    }
    resetClass() {
        for (let index in this.errorMsg) {
            this.changeClass(index);
        }
    }
    resetData() {
        this.accountNo = '0';
        this.branchId = '';
        this.selectBranchIndex = '0';
        this.selectAccountIndex = '0';
        this.accountFlag = false;
        this.canReplacementFlag = false;
        this.onchangeRadio('1');
    }


    doShowList() {
        let confirmObj = [
            { 'key': 'custName', 'title': '戶名', 'detail': this.showData['custName'], 'show': true },
            { 'key': 'lostType', 'title': '種類', 'detail': this.showData['lostType'][this.lostType]['name'], 'show': true },
            { 'key': 'accountNo', 'title': '帳號/卡號', 'detail': this.accountNo, 'show': true },
            { 'key': 'replacementFlag', 'title': '是否補發', 'detail': this.replacementRadio, 'show': true },
            { 'key': 'replacementWay', 'title': '補發方式', 'detail': this.reissueType, 'show': true },
            { 'key': 'city', 'title': '寄達區域', 'detail': this.cityVal, 'show': true },
            { 'key': 'branchName', 'title': '寄達地址', 'detail': this.branchId, 'show': true }
        ];
        // 
        let tempData = [];
        let breakFlag = false;
        for (let index in confirmObj) {
            //
            if (breakFlag) {
                return false;
            }
            if (!confirmObj[index].show) {
                continue;
            } else {
                tempData.push(confirmObj[index]);
                let tempIndex = (tempData.length - 1);
                if (confirmObj[index].key === 'replacementFlag') {

                    if (!this.canReplacementFlag) {

                        tempData[tempIndex].detail = '否';
                        breakFlag = true;
                    } else {
                        if (confirmObj[index].detail === '1') {
                            tempData[tempIndex].detail = '是';
                        } else {
                            tempData[tempIndex].detail = '否';

                            breakFlag = true;
                        }
                    }
                }
                // 寄送方式
                if (confirmObj[index].key === 'replacementWay') {
                    if (confirmObj[index].detail === '2') {
                        tempData[tempIndex].detail = '郵寄';

                    } else {
                        tempData[tempIndex].detail = '親洽';

                    }
                }
                if (confirmObj[index].key === 'city') {
                    if (confirmObj[index].detail && confirmObj[index].detail !== '0') {

                        tempData[tempIndex].detail = this.cityName;
                    } else {
                        tempData.splice(tempIndex, 1);
                    }
                }
                if (confirmObj[index].key === 'branchName') {
                    if (!confirmObj[index].detail || confirmObj[index].detail === '0') {
                        tempData[tempIndex].detail = '通訊地址';
                    } else {
                        tempData[tempIndex].detail = this.branchName;
                    }
                }
            }
            this.confirmListData = tempData;
        }

    }
}
