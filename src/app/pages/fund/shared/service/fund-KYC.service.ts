/**
 *風險承受度 KYC
 */
import { Injectable, OnInit } from "@angular/core";
import { Logger } from '@core/system/logger/logger.service';
import { FI000603ApiService } from "@api/fi/fi000603/fi000603-api.service";
import { FI000604ApiService } from "@api/fi/fi000604/fi000604-api.service";
import { InfomationService } from "@shared/popup/infomation/infomation.service";
import { FundInformationRiskTest } from "@conf/terms/fund/fund-risk-test/fund-information-risk-test";
import { AuthService } from "@core/auth/auth.service";
import { FormateService } from "@shared/formate/formate.service";

@Injectable()

export class FundKYCService {
    constructor(
        private _logger: Logger,
        private fi000603: FI000603ApiService,
        private fi000604: FI000604ApiService
        , private _infoService: InfomationService
        , private _authService: AuthService
        , private _formateService: FormateService
    ) { }
    showInfo(message) {
        switch (message) {
            case 'noInput':
                const info_risk_test = new FundInformationRiskTest();
                this._infoService.show(info_risk_test)
                    .then(
                        () => {
                            // close
                        },
                        () => {
                            // 更多內容
                        }
                    );
                break;
            case 'get_tmp_result':
                const info_get_tmp_result = new FundInformationRiskTest();
                this._infoService.show(info_get_tmp_result)
                    .then(
                        () => {
                            // close
                        },
                        () => {
                            // 更多內容

                        }
                    );
                break;
            // case 'reservation':
            //     const info_reservation = new ReservationInfo();
            //     this._infoService.show(info_reservation)
            //         .then(
            //             () => {
            //                 // close
            //             },
            //             () => {
            //                 // 更多內容

            //             }
            //         );
            //     break;
        }

    }
    getData(): Promise<any> {
        return this.fi000603.getData().then(
            (sucess)=> {
                return Promise.resolve(sucess);
            },
            (failed)=> {
                return Promise.reject(failed);
            }
        )
    }
    getResult(reqOjb,security?): Promise<any> {
        if(reqOjb.isFirstKYC=='Y'){   //首次
            let reqHeader = {
                header: security.securityResult.headerObj
            };
            return this.fi000604.getData(reqOjb,reqHeader).then(
                (sucess)=> {
                    return Promise.resolve(sucess);
                },
                (failed)=> {
                    return Promise.reject(failed);
                }
            )
        }else{          //非首次
            return this.fi000604.getData(reqOjb).then(
                (sucess)=> {
                    return Promise.resolve(sucess);
                },
                (failed)=> {
                    return Promise.reject(failed);
                }
            )
        }
    }

    makeSignText(obj) {
        let signText = {
            custId: '',
            type: '',
            eduLevel: '',
            familyIncome: '',
            custName: '',
            custSex: '',
            birthday: '',
            age: '',
            custTelOffice: '',
            custTelHome: '',
            custMobile: '',
            custFax: '',
            custAddr: '',
            custEmail: '',
            profession: '',
            professionName: '',
            illnessCrd: '',
            childNum: '',
            content: '',
            trnsToken: '',
            isFirstKYC: '',
            resultList: {
                // detail: []
            }
        }

        signText.custId = this._authService.getUserInfo().custId;
        signText.type = '2';
        signText.eduLevel = this._formateService.checkField(obj, 'eduLevel');
        signText.familyIncome = this._formateService.checkField(obj, 'familyIncome');
        signText.custName = this._formateService.checkField(obj, 'custName');
        signText.custSex = this._formateService.checkField(obj, 'custSex');
        signText.birthday = this._formateService.checkField(obj, 'birthday');
        signText.age = this._formateService.checkField(obj, 'age');
        signText.custTelOffice = this._formateService.checkField(obj, 'custTelOffice');
        signText.custTelHome = this._formateService.checkField(obj, 'custTelHome');
        signText.custMobile = this._formateService.checkField(obj, 'custMobile');
        signText.custFax = this._formateService.checkField(obj, 'custFax');
        signText.custAddr = this._formateService.checkField(obj, 'custAddr');
        signText.custEmail = this._formateService.checkField(obj, 'custEmail');
        signText.profession = this._formateService.checkField(obj, 'profession');
        signText.professionName = this._formateService.checkField(obj, 'professionName');
        signText.illnessCrd = this._formateService.checkField(obj, 'illnessCrd');
        signText.childNum = this._formateService.checkField(obj, 'childNum');
        signText.content = '客戶測驗內容';
        signText.trnsToken = this._formateService.checkField(obj, 'trnsToken');
        signText.isFirstKYC = this._formateService.checkField(obj, 'isFirstKYC');
        signText.resultList = this._formateService.checkField(obj, 'resultList');
        this._logger.log('makeSignText: ', signText);
        return signText;
    }
}


