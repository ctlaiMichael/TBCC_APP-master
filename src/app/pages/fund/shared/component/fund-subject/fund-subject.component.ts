/**
 * 基金投資標的查詢
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FundSubjectService } from './fund-subject.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { logger } from '@shared/util/log-util';

@Component({
    selector: 'app-fund-subject',
    templateUrl: './fund-subject.component.html',
    providers: [FundSubjectService]
})
export class FundSubjectComponent implements OnInit {
    /**
     * 參數處理
     */
    @Input() setData: any;
    @Input() search;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    nowPageType = 'optional'; //現在頁面，預設：自選基金
    flag = true; //控制tag
    flag2 = false; //控制tag
    showSubject = true; //顯示標的頁面
    companyPage = 'in-company'; //基金公司頁面
    showInOut = true; //顯示國外or國內基金公司
    fundCompany = {}; //基金公司
    showTag = true; //是否顯示上方tag
    showContent = '1';
    //國內精選(送request)
    subjectData1 = {
        custId: '',
        investType: '',
        fundType: 'C',
        selectfund: 'Y',
        compCode: '',
        fundCode: ''
    };
    //國外精選(送request)
    subjectData2 = {
        custId: '',
        investType: '',
        fundType: 'F',
        selectfund: 'Y',
        compCode: '',
        fundCode: ''
    };
    //國內自選(送request,拿companyLists)
    subjectData3 = {
        custId: '',
        investType: '',
        fundType: 'C',
        selectfund: 'N',
        compCode: '',
        fundCode: ''
    };
    //國外自選(送request,拿companyLists)
    subjectData4 = {
        custId: '',
        investType: '',
        fundType: 'F',
        selectfund: 'N',
        compCode: '',
        fundCode: ''
    };
    //轉換request，固定精選
    converRequest = {
        custId: '',
        investType: '',
        fundType: '', //轉換不需輸入
        selectfund: '', //轉換不需輸入
        compCode: '',
        fundCode: ''
    };

    in_feature = []; //api回傳，存國內精選
    out_feature = []; //api回傳，存國外精選
    in_optional = []; //api回傳，存國內自選
    out_optional = []; //api回傳，存國外自選

    //代號查詢
    compInfo = {};
    compData = [];

    //轉換公司代號查選單 (fundLists)
    converFundInfo = {};
    converFundData = [];

    //轉換基金代號查公司 (compLists)
    converCompInfo = {};
    converCompData = [];

    //左側返回使用
    leftBackStatus = {
        foreginFund: '', //國內or國外(記錄狀態)
        foreginType: '', //國內：1，國外：2
        selectFund: '', //精選or自選(紀錄狀態)
        selectType: '' //精選：1，自選：2
    }

    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private navgator: NavgatorService
        , private _mainService: FundSubjectService
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
    ) {
    }


    ngOnInit() {
        this._headerCtrl.setLeftBtnClick(() => {
            //左側返回
            this.onBackPageData({}, this.leftBackStatus,{});
        });

        logger.error("setData:", this.setData, this.search);
      
        if (this.setData.hasOwnProperty('investType') && this.setData.investType == 'A'
            || this.setData.investType == 'B' || this.setData.investType == 'D') {
            this.showTag = true;
            this.subjectData1.investType = this.setData.investType;
            this.subjectData2.investType = this.setData.investType;
            this.subjectData3.investType = this.setData.investType;
            this.subjectData4.investType = this.setData.investType;
            this.getAssets();
        }
        //轉換,investType == 'C'
        if (this.setData.hasOwnProperty('investType') && this.setData.investType == 'C') {
            this._logger.log("go in conver!!!");
            this.showTag = false; //轉換隱藏tag
            this.converRequest.investType = this.setData.investType;
            this.converRequest.fundCode = this.setData.fundCode;
            this.converRequest.compCode = this.setData.compCode;
            this._logger.log("converRequest:", this.converRequest);
            //轉換功能，點擊「選擇基金公司」，假如有帶值進來(基金代碼=>查 基金公司)
            if (this.setData.hasOwnProperty("fundCode") && this.setData.fundCode !== ''
                && this.setData.compCode == '') {
                this._logger.log("line 126 has fundCode!!");
                this.nowPageType = 'optional';
                this._mainService.getSubject(this.converRequest).then(
                    (converResult) => {
                        this.converCompInfo = converResult.info_data;
                        this.converCompData = converResult.data2;
                        this._logger.log("converCompInfo:", this.converCompInfo);
                        this._logger.log("converCompData:", this.converCompData);
                    },
                    (converError) => {
                        this._handleError.handleError(converError);
                        this._logger.log("line 137 get data error!!");
                    }
                );
            }
            //轉換功能，點擊「選擇基金」，假如有帶值進來(基金公司代碼=>查 基金選單)
            // if (this.setData.hasOwnProperty("compCode") && this.setData.compCode !== ''
            // && this.setData.fundCode == '') {
            //     this._logger.log("line 143 has compCode!!");
            //     this.nowPageType = 'converFund';
            //     this._mainService.getSubject(this.converRequest).then(
            //         (converResult) => {
            //             this.converFundInfo = converResult.info_data;
            //             this.converFundData = converResult.data1;
            //             this._logger.log("converFundInfo:", this.converFundInfo);
            //             this._logger.log("converFundData:", this.converFundData);
            //         },
            //         (converError) => {
            //             this._handleError.handleError(converError);
            //         }
            //     );
            // }

        }
       
    }

    /**
     * 一次取得所有情況之資料
     * 
     */
    getAssets(): Promise<any> {
        return new Promise((resolve, reject) => {
            let output: any = {
                status: false,
                msg: '',
                error_in_feature: {
                    status: false, // false 無取得data
                    data: {}
                },
                error_out_feature: {
                    status: false, // false 無取得data
                    data: {}
                },
                error_in_optional: {
                    status: false, // false 無取得data
                    data: {}
                },
                error_out_optional: {
                    status: false, // false 無取得data
                    data: {}
                },
                data: {
                    in_feature: {}, //國內精選
                    out_feature: {}, //國外精選
                    in_optional: {}, //國內自選
                    out_optional: {} //國外自選
                }
            };

            let finishData = {
                in_feature: false,
                out_feature: false,
                in_optional: false,
                out_optional: false
            };
            const checkCallBackEvent = (check_type) => {
                this._logger.step('HomePage', 'close ', check_type);
                if (finishData.hasOwnProperty(check_type)) {
                    finishData[check_type] = true;
                }
                let tmp_key: any;
                if (finishData.in_feature && finishData.out_feature
                    && finishData.in_optional && finishData.out_optional) {
                    if (!output.error_in_feature.status && !output.error_out_feature.status
                        && !output.error_in_optional.status && !output.error_out_optional.status) {
                        // 全部取得失敗
                        this._logger.step('HomePage', 'end error', output);
                        reject(output);
                    } else {
                        // 有一個資料就算成功
                        output.status = true;
                        this._logger.step('HomePage', 'end success', output);
                        resolve(output);
                    }
                }
            };
            //國內精選
            this._mainService.getSubject(this.subjectData1).then(
                (in_featureData) => {
                    output.error_in_feature.status = true;
                    output.data.in_feature = in_featureData;
                    output.error_in_feature.data = in_featureData;
                    this._logger.log("1.output.data.in_feature:", output.data.in_feature);
                    checkCallBackEvent('in_feature');
                    this.in_feature = output['data']['in_feature']['data1'];
                    this._logger.log("in_feature:", this.in_feature);
                },
                (errorObj) => {
                    output.error_in_feature.status = false;
                    output.error_in_feature.data = errorObj;
                    checkCallBackEvent('in_feature');
                }
            );

            //國外精選
            this._mainService.getSubject(this.subjectData2).then(
                (out_featureData) => {
                    output.error_out_feature.status = true;
                    output.data.out_feature = out_featureData;
                    output.error_out_feature.data = out_featureData;
                    this._logger.log("2.output.data.out_feature:", output.data.out_feature);
                    checkCallBackEvent('out_feature');
                    this.out_feature = output['data']['out_feature']['data1'];
                    this._logger.log("out_feature:", this.out_feature);
                },
                (errorObj) => {
                    output.error_out_feature.status = false;
                    output.error_out_feature.data = errorObj;
                    checkCallBackEvent('out_feature');
                }
            );

            //國內自選
            this._mainService.getSubject(this.subjectData3).then(
                (in_optionalData) => {
                    output.error_in_optional.status = true;
                    output.data.in_optional = in_optionalData;
                    output.error_in_optional.data = in_optionalData;
                    this._logger.log("3.output.data.in_optional:", output.data.in_optional);
                    checkCallBackEvent('in_optional');
                    this.in_optional = output['data']['in_optional']['data2'];
                    this._logger.log("in_optional:", this.in_optional);
                },
                (errorObj) => {
                    output.error_in_optional.status = false;
                    output.error_in_optional.data = errorObj;
                    checkCallBackEvent('in_optional');
                }
            );

            //國外自選
            this._mainService.getSubject(this.subjectData4).then(
                (out_optionalData) => {
                    output.error_out_optional.status = true;
                    output.data.out_optional = out_optionalData;
                    output.error_out_optional.data = out_optionalData;
                    this._logger.log("4.output.data.out_optional:", output.data.out_optional);
                    checkCallBackEvent('out_optional');
                    this.out_optional = output['data']['out_optional']['data2'];
                    this._logger.log("out_optional:", this.out_optional);
                },
                (errorObj) => {
                    output.error_out_optional.status = false;
                    output.error_out_optional.data = errorObj;
                    checkCallBackEvent('out_optional');
                }
            );
            if(this.search=='2'){
                    this.flag = false;
            }
        });
    }

    //切換上方tag標籤
    onChangeTag(change_type) {
        switch (change_type) {
            case 'in-subject':
                this.flag = true;
                if (this.flag2 == true) {
                    this.nowPageType = 'in-fundLists';
                } else {
                    this.nowPageType = 'optional';
                }
                break;
            case 'out-subject':
                this.flag = false;
                if (this.flag2 == true) {
                    this.nowPageType = 'out-fundLists';
                } else {
                    this.nowPageType = 'optional';
                }
                break;
            case 'feature':
                if (this.flag == true) {
                    this.nowPageType = 'in-fundLists';
                } else {
                    this.nowPageType = 'out-fundLists';
                }
                this.flag2 = true;
                break;
            case 'optional':
                this.nowPageType = 'optional';
                this.flag2 = false;
                break;
        }
    }

    //點擊，選擇其中一項標的
    onSelectSub(item) {

        let fundStatus = {
            foreginFund: '', //國內or國外(記錄狀態)
            foreginType: '', //國內：1，國外：2
            selectFund: '', //精選or自選(紀錄狀態)
            selectType: '' //精選：1，自選：2
        }
        if (this.flag == true) {
            fundStatus.foreginFund = '國內基金';
            fundStatus.foreginType = '1';
        } else {
            fundStatus.foreginFund = '國外基金';
            fundStatus.foreginType = '2';
        }
        if (this.flag2 == true) {
            fundStatus.selectFund = '精選基金';
            fundStatus.selectType = '1';
        } else {
            fundStatus.selectFund = '自選基金';
            fundStatus.selectType = '2';
        }

        if (this.setData.investType == 'C') {
            fundStatus.foreginFund = '';
            fundStatus.foreginType = '';
            fundStatus.selectFund = '';
            fundStatus.selectType = '';
        }
        this.onBackPageData(item, fundStatus, this.fundCompany);

    }

    //點擊，基金公司
    onSelectCompany() {
        if (this.setData.investType !== 'C') {
            this.showSubject = false;
            if (this.flag == true) {
                this.showInOut = true;
            } else {
                this.showInOut = false;
            }
        } else {
            this.nowPageType = 'converComp';
        }

    }

    //點擊，選擇其中一間基金公司
    chooseOver(companyItem) {
        this.showSubject = true;
        this.fundCompany = companyItem;

        let reqData = {
            custId: '',
            investType: '',
            fundType: '',
            selectfund: '',
            compCode: '',
            fundCode: ''
        }
        reqData.investType = this.setData.investType;
        if (this.flag == true) {
            reqData.fundType = 'C';
        } else {
            reqData.fundType = 'F';
        }
        reqData.selectfund = 'N';
        //轉換時 fundType(國內外)、selectfund(精選自選)清空
        if (reqData.investType == 'C') {
            reqData.fundType = '';
            reqData.selectfund = '';
        }
        reqData.compCode = companyItem['compCode'];
        this._logger.log("line 296 reqData:", reqData);

        this._mainService.getSubject(reqData).then(
            (result) => {
                this.compInfo = result.info_data;
                this.compData = result.data1;
                this._logger.log("compInfo:", this.compInfo);
                this._logger.log("compData:", this.compData);
            },
            (errorObj) => {
                this._handleError.handleError(errorObj);
            }
        );
        this.nowPageType = 'fundListsQuery';
    }


    //點擊，選擇其中一間基金公司(轉換使用)
    chooseConverOver(companyItem) {
        this.showSubject = true;
        this.fundCompany = companyItem;

        let reqData = {
            custId: '',
            investType: '',
            fundType: '',
            selectfund: '',
            compCode: '',
            fundCode: ''
        }
        reqData.investType = this.setData.investType;
        //轉換時 fundType(國內外)、selectfund(精選自選)清空
        if (reqData.investType == 'C') {
            reqData.fundType = '';
            reqData.selectfund = '';
        }
        reqData.compCode = companyItem['compCode'];
        this._logger.log("line 296 reqData:", reqData);

        this._mainService.getSubject(reqData).then(
            (result) => {
                this.compInfo = result.info_data;
                this.compData = result.data1;
                this._logger.log("compInfo:", this.compInfo);
                this._logger.log("compData:", this.compData);
            },
            (errorObj) => {
                this._handleError.handleError(errorObj);
            }
        );
        this.nowPageType = 'fundListsQuery';
    }


    /**
     * 重新設定page data
     * @param item
     */
    onBackPageData(item, fundStatus, converFundCompany) {
        if (!item.hasOwnProperty("fundName")) {
            this.backPageEmit.emit({'page': 'select-subject', 'type': 'back'});
        }
        else {
            let output = {
                'page': 'select-subject',
                'type': 'success',
                'data': item,
                'fundStatus': {
                    foreginFund: '',
                    foreginType: '',
                    selectFund: '',
                    selectType: ''
                },
                'converFundCompany': {} //轉換才有值
            };
            output.fundStatus.foreginFund = fundStatus.foreginFund;
            output.fundStatus.foreginType = fundStatus.foreginType;
            output.fundStatus.selectFund = fundStatus.selectFund;
            output.fundStatus.selectType = fundStatus.selectType;
            output.converFundCompany = converFundCompany; //轉換用，存公司
            this._logger.log("back output:", output);
            this.backPageEmit.emit(output);
        } 
    }

    /**
     * 失敗回傳
     * @param error_obj 失敗物件
     */
    onErrorBackEvent(error_obj) {
        let output = {
            'page': 'select-subject',
            'type': 'error',
            'data': error_obj
        };
        this._logger.error('HomePage', 'gold', error_obj);
        this.errorPageEmit.emit(output);
    }

}

