/**
 * 額度調整確認頁
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';
import { CardQuotaService } from '../../shared/service/card-quota/card-quota.service';

@Component({
    selector: 'app-card-quota-confirm',
    templateUrl: './card-quota-confirm.component.html',
    styleUrls: [],
    providers: []
})
export class CardQuotaConfirmComponent implements OnInit {
    /**
       *參數設定
       */
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Input() reqData: any; //fc001004：調整request
    @Input() picReqData: any; //fc001005：文件上傳request
    @Input() loadStatus: string; //判斷上傳狀態， '0':稍後上傳，'1'：1~5張，'2':全部傳
    @Input() anotherData: any; //確認頁、結果頁需顯示隻資料(非發api)
    resultData: any;
    constructor(
        private _logger: Logger
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private confirm: ConfirmService
        , private navgator: NavgatorService
        , private _authService: AuthService
        , private _formateService: FormateService
        , private _mainService: CardQuotaService
    ) {
    }

    ngOnInit() {
        this._logger.log("into confirm component");
        this._logger.log("reqData:", this.reqData);
        this._logger.log("picReqData:", this.picReqData);
        this._logger.log("loadStatus:", this.loadStatus);
        this._logger.log("anotherData:", this.anotherData);
        this._headerCtrl.setLeftBtnClick(() => {
            this.cancelEdit();
        });
        if (this.reqData['applyType'] == '0') {
            this.anotherData['showApplyType'] = '臨時額度';
        } else {
            this.anotherData['showApplyType'] = '永久額度';
        }
        if (this.reqData.hasOwnProperty('cityPhone') && this.reqData != '') {
            let temp = this.reqData['cityPhone'].split('#');
            this._logger.log("temp:", temp);
            this.anotherData['cityPhone'] = temp[0];
            this.anotherData['applyTelExt'] = temp[1];
        }
        this._logger.log("anotherData:", this.anotherData);
        this.reqData = this._mainService.formateReqData(this.reqData);
        this._logger.log("formate data, reqData:", this.reqData);
    }

    //上一頁
    cancelEdit() {
        this.confirm.show('您是否放棄此次編輯?', {
            title: '提醒您'
        }).then(
            () => {
                this.onPageBackEvent({}, 'back');
            },
            () => {

            }
        );
    }

    //下一頁
    onNextPgae() {
        this._mainService.sendResultData(this.reqData, this.picReqData, this.loadStatus).then(
            (success) => {
                this._logger.log("api success:", success);
                this.resultData = success;
                //處理結果頁顯示之資料(api不會回欄位，因此帶入確認頁顯示欄位)
                if (this.resultData.hasOwnProperty('data')) {
                    this._logger.log("into resultData hasOwnProperty data");
                    this.resultData['data']['chineseName'] = this.anotherData['chineseName'];
                    this.resultData['data']['custId'] = this.anotherData['custId'];
                    this.resultData['data']['applyType'] = this.anotherData['showApplyType'];
                    this.resultData['data']['applyDate'] = this.reqData['applyDate'];
                    this.resultData['data']['endDate'] = this.reqData['endDate'];
                    this.resultData['data']['applyAmount'] = this.reqData['applyAmount'];
                    this.resultData['data']['applyReason'] = this.reqData['applyReason'];
                    this.resultData['data']['cellPhone'] = this.reqData['cellPhone'];
                    this.resultData['data']['cityPhone'] = this.anotherData['cityPhone'];
                    this.resultData['data']['applyTelExt'] = this.anotherData['applyTelExt'];
                    this._logger.log("resultData:", this.resultData);
                }
                this.onPageBackEvent(this.resultData, 'go'); //成功走結果頁
            },
            (errorObj) => {
                this._logger.log("api errorObj:", errorObj);
                this._logger.log("into  api error alert, errorObj:", errorObj);
                errorObj['type'] = 'message';
                errorObj['backType']='2';
                this._handleError.handleError(errorObj); //失敗
            }
        );

        // this.onPageBackEvent(,'go');
        // this._mainService.getQuotaData().then(
        //     (result) => {
        //         this._logger.log("get fc001004 success, result:",result);
        //         this.resultData['fc001004'] = result;
        //         if(result) {

        //         }
        //     },
        //     (errorObj) => {
        //         this._logger.log("get fc001004 error, errorObj:",errorObj);
        //         this._handleError.handleError(errorObj);
        //     }
        // );
    }

    //子層返回
    onPageBackEvent(setData, type) {
        let output = {
            'page': 'confirm',
            'type': type,
            'data': setData
        };
        this.backPageEmit.emit(output);
    }
}