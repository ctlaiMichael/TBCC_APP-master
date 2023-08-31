/**
 * 風險承受度測驗表
 *
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FundKYCService } from '@pages/fund/shared/service/fund-KYC.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';
import { Logger } from '@core/system/logger/logger.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
@Component({
    selector: 'app-reskTest',
    templateUrl: './risk-test-page.component.html',
    providers: [FundKYCService]
})
export class RiskTestPageComponent implements OnInit {
    /**
     * 參數處理
     */
    @Input() info_data;
    @Input() data;
    @Input() baseData;
    @Input() safeType;
    @Output() backPageEmitLeft: EventEmitter<any> = new EventEmitter<any>();
    pageType = 'edit'
    question: string = '1';
    counter: number = 0;
    question_number;
    now_quest: any; // 目前問題
    quest_set: any = {
        multi: '',
        answer: '',
        answesArray: []
    };
    ansLists = [];//所有題目、答案編號
    next_flag = false;//是否切換到下一頁
    result_data = {};//取得計算結果
    prevFlag = false;
    specialCustomer = false;
    reqObj = {
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
        content: '客戶測驗內容',
        trnsToken: '',
        isFirstKYC: '',
        resultList: {
            detail: this.ansLists
        }

    };
    custData = {};


    //===========================安控==========================//
    //安控傳參
    transactionObj = {
        serviceId: 'FI000604',
        categoryId: '6',
        transAccountType: '1',
    };
    // safeE: any;
    securityObj = {
        'action': 'init',
        'sendInfo': ''
    };
    sendInfo: any = {
        custId: "",
        popObj: { message: "", showPopup: false },
        securityType: "",
        selected: "",
        serviceId: "FI000604",
        status: true,
        transAccountType: "1",
    };
    //===========================安控End=======================//

    constructor(
        private _logger: Logger
        , private _mainService: FundKYCService
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private navgator: NavgatorService
        , private _checkSecurityService: CheckSecurityService
        , private _authService: AuthService
        , private _formateService: FormateService
        , private confirm: ConfirmService
    ) {
    }

    ngOnInit() {
        // 設定左上返回鍵
        this._headerCtrl.setLeftBtnClick(() => {
            this.confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
                title: '提醒您'
            }).then(
                () => {
                    //確定
                    this.navgator.push('fund');
                },
                () => {
                }
            );
        });
        this._logger.log('info_data', this.info_data);
        this._logger.log('data', this.data);
        this.counter = 0;
        this.showQuest();
        this.securityObj = {
            'action': 'init',
            'sendInfo': this.sendInfo
        };

        //第一題
        let answer = '';
        let age = parseInt(this.info_data.age);
        if (age <= 19 || age >= 76) {
            answer = this.data[0].ansLists.answer[0].rcIndex;
        } else if (age >= 20 && age <= 45) {
            answer = this.data[0].ansLists.answer[1].rcIndex;
        } else if (age >= 46 && age <= 55) {
            answer = this.data[0].ansLists.answer[2].rcIndex;
        } else if (age >= 56 && age <= 65) {
            answer = this.data[0].ansLists.answer[3].rcIndex;
        } else if (age >= 66 && age <= 75) {
            answer = this.data[0].ansLists.answer[4].rcIndex;
        }
        if (this.ansLists.length < 1) {
            this.ansLists.push({ 'rtIndex': '10001', 'rcIndex': answer });
        }
    }


    onBackPage(e) {
        if (typeof e === 'object') {
            if (e.hasOwnProperty('answer')) {
                this.quest_set.answer = e.answer;
            }
            if (e.hasOwnProperty('multi')) {
                this.quest_set.multi = e.multi;
            }
            if (e.hasOwnProperty('answesArray')) {
                this.quest_set.answesArray = e.answesArray;
            }
        }
        this._logger.log('回傳', e);
        this._logger.log('this.quest_set', this.quest_set)
    }
    showQuest() {
        if (typeof this.data[this.counter] !== 'undefined') {
            this.now_quest = this.data[this.counter];
        } else {
            // question error miss
        }
    }
    onClick(page_ctrl: string) {
        this._logger.log('onClick', this.ansLists, this.counter, 'this.quest_set', this.quest_set);
        if (page_ctrl == 'next') {//下一頁按鈕
            this._logger.log('next 180', this.ansLists, this.counter, ' this.quest_set', this.quest_set, 'multi', this.quest_set.multi);
            if (((this.quest_set.answer !== '' || (this.ansLists[this.counter]) && this.quest_set.multi == 'N') || this.counter == 0)) {//有回傳且為單選
                if (this.quest_set.answer == '' && this.ansLists[this.counter]) {
                    this.quest_set.answer = this.ansLists[this.counter].rcIndex;
                }
                let result = {
                    'rtIndex': this.data[this.counter].rtIndex,
                    'rcIndex': this.quest_set.answer
                }
                if (this.counter == 7 || this.counter == 8) {
                    this._logger.log('7,8', this.quest_set, result)
                }
                //如果沒有選該題答案則直接放進題目答案陣列，如果該題目答案已在陣列中，則改變題目的答，
                if (typeof this.ansLists[this.counter] == 'undefined') {
                    this.ansLists.push(result);
                } else {
                    if (this.counter != 0 && result.rcIndex) {
                        this.ansLists[this.counter].rcIndex = result.rcIndex;
                    }
                }
                //針對教育程度、年收入處理、職業
                if (this.counter == 1) {
                    if (this.quest_set.answer == '10002001') {
                        this.custData['eduLevel'] = '1';
                    } else if (this.quest_set.answer == '10002002') {
                        this.custData['eduLevel'] = '2';
                    } else if (this.quest_set.answer == '10002003') {
                        this.custData['eduLevel'] = '3';
                    } else if (this.quest_set.answer == '10002004') {
                        this.custData['eduLevel'] = '4';
                    }
                }
                if (this.counter == 2) {
                    this.quest_set.answesArray.forEach(item => {
                        if (item.rcIndex == this.quest_set.answer) {
                            this.custData['profession'] = item.rcIndex;
                            this.custData['professionName'] = item.rcName;
                        }
                    })
                }
                if (this.counter == 3) {
                    if (this.quest_set.answer == '10004005' || this.quest_set.answer == '10004004') {
                        this.custData['familyIncome'] = '1';
                    } else if (this.quest_set.answer == '10004003') {
                        this.custData['familyIncome'] = '2';
                    } else if (this.quest_set.answer == '10004002') {
                        this.custData['familyIncome'] = '3';
                    } else if (this.quest_set.answer == '10004001') {
                        this.custData['familyIncome'] = '4';
                    }
                }
                this.quest_set.answer = '';//重置為沒有回傳狀態
                if (this.data[this.counter + 1].multi == 'Y') {
                    this.quest_set.multi = 'Y';
                } else {
                    this.quest_set.multi = 'N';
                }
                this.counter++;

            } else if (((this.quest_set.answesArray.length != 0 || this.quest_set.answesArray != []) && this.quest_set.multi == 'Y') || this.ansLists[this.counter]) {//有回傳且為多選
                this._logger.log('多選', this.quest_set)
                if (this.ansLists[this.counter] && this.quest_set.answesArray.length == 0) {
                    this.quest_set = {
                        multi: 'Y',
                        answer: this.ansLists[this.counter].rcIndex,
                        answesArray: this.data[this.counter].ansLists.answer
                    };
                }

                let tmp_anslist = [];
                for (let i = 0; i < this.quest_set.answesArray.length; i++) {
                    if (this.quest_set.answesArray[i].showCheck) {
                        tmp_anslist.push(this.quest_set.answesArray[i].rcIndex);
                    }
                }

                if (tmp_anslist.length == 0) {
                    this._mainService.showInfo('noInput');//訊息:請選擇答案
                    return false;
                };
                this.quest_set.answer = tmp_anslist.join();
                let result = {
                    'rtIndex': this.data[this.counter].rtIndex,
                    'rcIndex': this.quest_set.answer
                }

                //如果沒有選該題答案則直接放進題目答案陣列，如果該題目答案已在陣列中，則改變題目的答案
                if (typeof this.ansLists[this.counter] == 'undefined' || (this.info_data.age < 7 && (this.counter == 7 || this.counter == 8))) {
                    this.ansLists.push(result);
                } else {
                    this.ansLists[this.counter].rcIndex = result.rcIndex;
                }
                this._logger.log('多選answer', this.quest_set.answer, this.ansLists);
                this.quest_set.answesArray = [];//重置為沒有回傳狀態
                this.quest_set.answer = '';
                this._logger.log('判斷', this.data, this.counter)
                if (this.data[this.counter + 1].multi == 'N') {
                    this.quest_set.multi = 'N';
                } else {
                    this.quest_set.multi = 'Y';
                }
                this.counter++;
            } else {
                this._mainService.showInfo('noInput');//訊息:請選擇答案
                return false;
            }
            this.prevFlag = false;

        } else if (page_ctrl == 'prev') {//上一頁按鈕
            //點選上一題塞值
            if (this.quest_set.multi == 'N' && this.quest_set.answer != '') {
                if (this.quest_set.answer != '') {
                    let result = {
                        'rtIndex': this.data[this.counter].rtIndex,
                        'rcIndex': this.quest_set.answer
                    };
                    if (typeof this.ansLists[this.counter] == 'undefined') {
                        this.ansLists.push(result);
                    } else {
                        if (this.counter != 0 && result.rcIndex) {
                            this.ansLists[this.counter].rcIndex = result.rcIndex;
                        }
                    }
                }
            } else if (this.quest_set.multi == 'Y') {
                if (this.quest_set.answesArray != '') {
                    let tmp_anslist = [];
                    for (let i = 0; i < this.quest_set.answesArray.length; i++) {
                        if (this.quest_set.answesArray[i].showCheck) {
                            tmp_anslist.push(this.quest_set.answesArray[i].rcIndex);
                        }
                    }

                    this.quest_set.answer = tmp_anslist.join();
                    if (this.quest_set.answer == '') {
                        let result = {
                            'rtIndex': this.data[this.counter].rtIndex,
                            'rcIndex': ""
                        };
                        if (typeof this.ansLists[this.counter] == 'undefined') {
                            this.ansLists.push(result);
                        } else {
                            if (this.counter != 0) {
                                this.ansLists[this.counter].rcIndex = result.rcIndex;
                            }
                        }
                    } else {
                        let result = {
                            'rtIndex': this.data[this.counter].rtIndex,
                            'rcIndex': this.quest_set.answer
                        };
                        if (typeof this.ansLists[this.counter] == 'undefined') {
                            this.ansLists.push(result);
                        } else {
                            if (this.counter != 0 && result.rcIndex) {
                                this.ansLists[this.counter].rcIndex = result.rcIndex;
                            }
                        }
                    }
                }
            }
            this.prevFlag = true;
            this.quest_set.multi = this.data[this.counter - 1].multi;
            this.quest_set.answer = '';
            this.quest_set.answesArray = [];
            if (!this.ansLists[this.counter]) {
                this.data[this.counter].ansLists.answer.forEach(ans => {
                    ans.showCheck = false;
                });
            }
            this.counter--;

        } else {                        //計算結果按鈕
            //最後一題塞值
            if ((this.quest_set.answer !== '' || (this.ansLists[this.counter])) && this.quest_set.multi == 'N') {
                if(this.quest_set.answer == ''){
                    this.quest_set.answer =this.data[this.counter].rcIndex;
                }
                let result = {
                    'rtIndex': this.data[this.counter].rtIndex,
                    'rcIndex': this.quest_set.answer
                }
                //如果沒有選該題答案則直接放進題目答案陣列，如果該題目答案已在陣列中，則改變題目的答，
                if (typeof this.ansLists[this.counter] == 'undefined') {
                    this.ansLists.push(result);
                } else {
                    this.ansLists[this.counter].rcIndex = result.rcIndex;
                }
                // this.quest_set.answer = '';//重置為沒有回傳狀態
                this._logger.log(this.ansLists);
                if (this.info_data.isFirstKYC == 'Y') {
                    this.getSecurity();
                } else {
                    this.getResult(this.reqObj);
                }
            } else if (this.quest_set.answesArray.length !== 0 && this.quest_set.multi == 'Y') {
                let tmp_anslist = []
                let arr_len = this.quest_set.answesArray.length;
                for (let i = 0; i < arr_len; i++) {
                    if (this.quest_set.answesArray[i].showCheck) {
                        tmp_anslist.push(this.quest_set.answesArray[i].rcIndex);
                    }
                }
                this.quest_set.answer = tmp_anslist.join();
                let result = {
                    'rtIndex': this.data[this.counter].rtIndex,
                    'rcIndex': this.quest_set.answer
                }
                //如果沒有選該題答案則直接放進題目答案陣列，如果該題目答案已在陣列中，則改變題目的答案
                if (typeof this.ansLists[this.counter] == 'undefined') {
                    this.ansLists.push(result);
                } else {
                    this.ansLists[this.counter].rcIndex = result.rcIndex;
                }
                // this.quest_set.answesArray = [];//重置為沒有回傳狀態
                this._logger.log('多選answer', this.ansLists);
                this.getSecurity();
            } else {
                this._mainService.showInfo('noInput');//訊息:請選擇答案
                return;
            }

        }
    }

    getResult(safe?) {
        this.reqObj = {
            custId: this._authService.getUserInfo().custId,
            type: '2',
            eduLevel: this.custData['eduLevel'],
            familyIncome: this.custData['familyIncome'],
            custName: this.info_data.custName,
            custSex: this.info_data.custSex,
            birthday: this.info_data.birthday,
            age: this.info_data.age,
            custTelOffice: this.info_data.custTelOffice ? this.info_data.custTelOffice : "",
            custTelHome: this.info_data.custTelHome,
            custMobile: this.info_data.custMobile,
            custFax: this.info_data.custFax ? this.info_data.custFax : "",
            custAddr: this.info_data.custAddr,
            custEmail: this.info_data.custEmail,
            profession: this.custData['profession'],
            professionName: this.custData['professionName'],
            illnessCrd: this.baseData.injury,
            childNum: this.baseData.child,
            content: '客戶測驗內容',
            trnsToken: this.info_data.trnsToken,
            isFirstKYC: this.info_data.isFirstKYC,
            resultList: {
                detail: this.ansLists
            }
        };
        let check_data = this._mainService.makeSignText(this.reqObj);


        this._logger.log('this.reqObj', this.reqObj);
        this._logger.log('check_data', check_data);
        //特定客戶定義： (自動降至穩健型)
        //(1)年齡70歲(含)以上(計算方式同第1題年齡)
        //(2)學歷國中以下(第2題選項1者)
        //(3)持有全民健保重大傷病證明(重大傷病選是者)
        if (parseInt(this.info_data.age) > 70 && this.ansLists[this.counter].rcIndex == "10001001" &&
            this.baseData.injury == "Y"
        ) {
            this.specialCustomer = true;
        }
        this._mainService.getResult(check_data, safe).then(
            (resObj) => {
                this.result_data = resObj.info_data;
                this._logger.log('result_data', this.result_data);
                this.pageType = 'result';
            },
            (errorObj) => {
                errorObj['type'] = 'dialog';
                this._handleError.handleError(errorObj);
            });
    }


    getSecurity() {
        this.sendInfo = {
            custId: this._authService.getUserInfo().custId,
            // popObj: { message: "", showPopup: this.safeType == '2' ? true : false },
            popObj: { message: "", showPopup: true },
            securityType: this.safeType,
            selected: this.safeType,
            serviceId: "FI000604",
            status: true,
            transAccountType: "1",
        };
        this.securityObj = {
            'action': 'submit',
            'sendInfo': this.sendInfo
        }
    }
    stepBack(e) {
        this._logger.log(e);
        this._logger.log('憑證', this.reqObj)
        if (e.status) {
            // OTP須帶入的欄位
            if (e.securityType === '3') {
                e.otpObj.depositNumber = '0000'; // 轉出帳號
                e.otpObj.depositMoney = '0'; // 金額
                e.otpObj.OutCurr = ''; // 幣別
                e.transTypeDesc = ''; // 
            } else if (e.securityType === '2') {
                this.reqObj = {
                    custId: this._authService.getUserInfo().custId,
                    type: '2',
                    eduLevel: this.custData['eduLevel'],
                    familyIncome: this.custData['familyIncome'],
                    custName: this.info_data.custName,
                    custSex: this.info_data.custSex,
                    birthday: this.info_data.birthday,
                    age: this.info_data.age,
                    custTelOffice: this.info_data.custTelOffice,
                    custTelHome: this.info_data.custTelHome,
                    custMobile: this.info_data.custMobile,
                    custFax: this.info_data.custFax,
                    custAddr: this.info_data.custAddr,
                    custEmail: this.info_data.custEmail,
                    profession: this.custData['profession'],
                    professionName: this.custData['professionName'],
                    illnessCrd: this.baseData.injury,
                    childNum: this.baseData.child,
                    content: '客戶測驗內容',
                    trnsToken: this.info_data.trnsToken,
                    isFirstKYC: this.info_data.isFirstKYC,
                    resultList: {
                        detail: this.ansLists
                    }
                };
                e.signText = this._mainService.makeSignText(this.reqObj);
                let cloneObj = this._formateService.transClone(e.signText);
                this._logger.log('cloneObj', cloneObj);

            }
            // 統一叫service 做加密
            this._checkSecurityService.doSecurityNextStep(e).then(
                (S) => {
                    this._logger.log(S);
                    this.getResult({ securityResult: S });
                }, (F) => {
                    this._logger.log(F);
                    F['type'] = 'message';
                    this._handleError.handleError(F);
                }
            );
        } else {
            return false;
        }
    }


}
