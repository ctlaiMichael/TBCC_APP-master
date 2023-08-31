import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000604ResBody } from './fi000604-res';
import { FI000604ReqBody } from './fi000604-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { FundKYCService } from '@pages/fund/shared/service/fund-KYC.service';


@Injectable()
export class FI000604ApiService extends ApiBase<FI000604ReqBody, FI000604ResBody> {
    constructor(
        public telegram: TelegramService<FI000604ResBody>,
        public errorHandler: HandleErrorService,
        public authService: AuthService,
        private _formateService: FormateService,
        private _logger: Logger,
        // private fundKYCService: FundKYCService
    ) {
        super(telegram, errorHandler, 'FI000604');
    }


    /**
     * 風險承受度測驗結果回覆
     * req
     *  custId: (身分證字號)
     *  type: (類型)
     *  eduLevel: (教育程度)
     *  familyIncome: (個人/家庭年收入)
     *  resultList: (KYC結果列表)
     *    detail:
     *        rtIndex:題目代碼
     *        rcIndex:答案代碼
     */
    getData(req: object, reqHeader?): Promise<any> {
        const userData = this.authService.getUserInfo();

        if (!userData.hasOwnProperty('custId') || userData.custId === '') {
            this._logger.step('FUND', 'userData undefined');
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        this._logger.step('FUND', 'api604', req);
        let data = new FI000604ReqBody();
        // let check_data = this.fundKYCService.makeSignText(req);

        // let data = {...reqdata, ...req};

        // let cloneObj= this._formateService.transClone(data);
        // this._logger.step('FUND', 'cloneObj2',cloneObj);
        // ===================先mark======================
        // this._logger.step('FUND', 'new FI000604ReqBody1', data);
        data.custId = userData.custId; // user info;
        data.type = this._formateService.checkField(req, 'type');
        data.eduLevel = this._formateService.checkField(req, 'eduLevel');
        data.familyIncome = this._formateService.checkField(req, 'familyIncome');
        data.custName = this._formateService.checkField(req, 'custName');
        data.custSex = this._formateService.checkField(req, 'custSex');
        data.birthday = this._formateService.checkField(req, 'birthday');
        data.age = this._formateService.checkField(req, 'age');
        data.custTelOffice = this._formateService.checkField(req, 'custTelOffice');
        data.custTelHome = this._formateService.checkField(req, 'custTelHome');
        data.custMobile = this._formateService.checkField(req, 'custMobile');
        data.custFax = this._formateService.checkField(req, 'custFax');
        data.custAddr = this._formateService.checkField(req, 'custAddr');
        data.custEmail = this._formateService.checkField(req, 'custEmail');
        data.profession = this._formateService.checkField(req, 'profession');
        data.professionName = this._formateService.checkField(req, 'professionName');
        data.illnessCrd = this._formateService.checkField(req, 'illnessCrd');
        data.childNum = this._formateService.checkField(req, 'childNum');
        data.content = '客戶測驗內容';
        data.trnsToken = this._formateService.checkField(req, 'trnsToken');
        data.isFirstKYC = this._formateService.checkField(req, 'isFirstKYC');
        this._logger.step('FUND', 'new FI000604ReqBody2', data);

        // ===================先mark End======================

        // if (data.type == '' || data.eduLevel == '' || data.familyIncome == '') {
        //     this._logger.error('DATA_FORMAT_ERROR api req', data, req);
        //     this._logger.step('FUND', '1111');
        //     return Promise.reject({
        //         title: 'ERROR.TITLE',
        //         content: 'ERROR.DATA_FORMAT_ERROR'
        //     });
        // }

        let check_obj = ObjectCheckUtil.checkObjectList(req, 'resultList');
        this._logger.step('FUND', 'check_obj', check_obj);
        this._logger.step('FUND', 'data.resultList', data.resultList);
        // 陣列檢核
        if (typeof check_obj !== 'undefined') {
            // data.resultList = ObjectCheckUtil.modifyTransArray(check_obj);
            data.resultList = check_obj;
        } else {
            this._logger.step('FUND', '222');
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        this._logger.step('FUND', '604data', data);
        return this.send(data, reqHeader).then(
            (resObj) => {
                this._logger.step('FUND', 'testing');
                const output = {
                    status: false,
                    msg: 'ERROR.DEFAULT',
                    info_data: {},
                };
                this._logger.step('FUND', 'body:', userData.hasOwnProperty('body'));
                const jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
                const modify_data = this._modifyRespose(jsonObj);
                this._logger.step('FUND', 'resObj:', resObj);
                output.info_data = modify_data.info_data;
                this._logger.step('FUND', 'output:', output);

                output.status = true;
                output.msg = '';
                return Promise.resolve(output);
            },
            (errorObj) => {
                this._logger.step('FUND', 'errorObj');
                return Promise.reject(errorObj);
            }
        );
    }

    /**
     * Response整理
     * @param jsonObj 資料判斷
     */
    private _modifyRespose(jsonObj) {
        const output = {
            info_data: {},
        };
        output.info_data = this._formateService.transClone(jsonObj);
        return output;
    }


}
