/**
 * FC001003-額度調整查詢
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';
import { FC001003ResBody } from './fc001003-res';
import { FC001003ReqBody } from './fc001003-req';
import { Logger } from '@core/system/logger/logger.service';

@Injectable()
export class FC001003ApiService extends ApiBase<FC001003ReqBody, FC001003ResBody> {

    constructor(public telegram: TelegramService<FC001003ResBody>,
        public errorHandler: HandleErrorService
        , private authService: AuthService
        , private _formateService: FormateService
        , private _logger: Logger
    ) {
        super(telegram, errorHandler, 'FC001003');
    }

    /**
     * 取得額度調整資訊
     * @param set_data 參數
     */
    getData(set_data?: Object): Promise<any> {
        // 參數處理
        let data: FC001003ReqBody = new FC001003ReqBody();
        data.custId = set_data['custId'];
        data.type = set_data['type'];
        this._logger.log("send fc001003 data:",data);
        return this.send(data).then(
            (resObj) => {
                let output = {
                    status: false,
                    msg: '',
                    info_data:{},
                    data:[],
                    cardList:[]
                };
                this._logger.log("resObj:",resObj);
                let jsonObj = (resObj.hasOwnProperty('body'))?resObj['body']:{};
                this._logger.log("jsonObj:",jsonObj);
                output.info_data = jsonObj;
                if(jsonObj.hasOwnProperty('details') && jsonObj['details'] 
                && jsonObj['details'].hasOwnProperty('detail') && jsonObj['details']['detail']) {
                    output.data = jsonObj['details']['detail']; //帳單明細(未整理過)
                    this._logger.log("output.data:",output.data);
                    //整理信用卡號資訊，方便爾後切換卡號對應額度
                    output.data.forEach(item => {
                        output['cardList'][item.cardNumer] = (parseInt(item['cardCRLimit'])/10000).toString(); //金額除10000(畫面顯示用，送request時，*10000回來)
                    });
                    this._logger.log("output['cardList']:",output['cardList']);
                }
                output.status = true;
                output.msg = '';
                return Promise.resolve(output);
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        );
    }
}
