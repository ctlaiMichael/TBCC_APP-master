import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { Logger } from '@core/system/logger/logger.service';
import { logger } from '@shared/util/log-util';

@Component({
    selector: 'app-risk-test-question',
    templateUrl: './risk-test-question.component.html',
})
export class RiskTestQuestionComponent implements OnChanges {

    @Input() questions: any;
    @Input() prevFlag: boolean;
    @Input() data;
    @Input() info_data;
    @Input() ansLists: any;
    @Input() counter;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    answers: any;
    shwQuestion = {
        'rtName': '',
        'rtIndex': '',
        'multi': '',
        'ansLists': [],
        'typeCtrl': ''
    };
    answerSelected = [];
    disabInput = false;
    queNumber = '';   //題號
    queNumber2 = '';
    age: any;

    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private _handleError: HandleErrorService
    ) { }

    ngOnChanges() {
        this.shwQuestion.ansLists = [];
        if (typeof this.questions === 'object' && this.questions) {


            this.queNumber = this.shwQuestion.rtName.substring(0, 1);//題號
            this.queNumber2 = this.shwQuestion.rtName.substring(1, 2); //題號後第二個字 確保題號正確
            // 物件檢核
            this.shwQuestion.rtIndex = this._formateService.checkField(this.questions, 'reIndex');
            this.shwQuestion.rtName = this._formateService.checkField(this.questions, 'rtName');
            this.shwQuestion.multi = this._formateService.checkField(this.questions, 'multi');
            this.shwQuestion.typeCtrl = this._formateService.checkField(this.questions, 'typeCtrl');
            // if(this.shwQuestion.ansLists)
            let check_obj = ObjectCheckUtil.checkObjectList(this.questions, 'ansLists.answer');
            this.shwQuestion.ansLists = this.questions.ansLists.answer;

            //複選紀錄
            if (typeof check_obj !== 'undefined') {
                this.shwQuestion.ansLists = ObjectCheckUtil.modifyTransArray(check_obj);
                if (this.ansLists[this.counter]) {
                    this.shwQuestion.ansLists.forEach(ans => {
                        if (this.ansLists[this.counter]['rcIndex'].indexOf(ans.rcIndex) >= 0 && this.shwQuestion.typeCtrl == 'checkbox') {
                            ans.showCheck = true;
                        } else {
                            ans.showCheck = false;
                        }
                    });
                }
            }
        }

        this.age = parseInt(this.info_data.age);
        if (this.age < 7 && (this.counter == 7 || this.counter == 8)) {
            this.shwQuestion.ansLists.forEach((ans, item) => {
                if (item == 0) {
                    ans.showCheck = true;
                }
                if (this.counter == 7) {
                    let output = {
                        //多選回傳答案
                        multi: 'Y',
                        answer: '10008001',//父層click時處理
                        answesArray: this.shwQuestion.ansLists////回傳各答案的linkRtIndex、linkRcIndex
                    };
                    logger.error('in 7', output)

                    this.backPageEmit.emit(output)
                } else if (this.counter == 8) {
                    let output = {
                        //多選回傳答案
                        multi: 'N',
                        answer: '10009001',//父層click時處理
                        answesArray: this.shwQuestion.ansLists////回傳各答案的linkRtIndex、linkRcIndex
                    };
                    logger.error('in 8', output)
                    this.backPageEmit.emit(output)
                }
            });
        }
        if (this.counter == 8 && this.ansLists[7].rcIndex == '10008001') {
            let output = {
                //多選回傳答案
                multi: 'N',
                answer: '10009001',
                answesArray: this.shwQuestion.ansLists
            };
            this.backPageEmit.emit(output);
            this.answers = '10009001';
        }

        if (this.ansLists[this.counter]) {
            this.answers = this.ansLists[this.counter].rcIndex;
        }
        if (this.age < 7 && (this.counter == 7 || this.counter == 8)) {
            if (this.counter == 7) {
                this.answers = '10008001';
            } else if (this.counter == 8) {
                this.answers = '10009001';
            }
        }
    }
    onBackPageData(e, type) {

        // output
        if (this.shwQuestion.multi == 'N') {
            let output = {
                //單選回傳答案
                multi: this.shwQuestion.multi,
                answer: this.answers,
                answesArray: this.shwQuestion.ansLists//回傳各答案的linkRtIndex、linkRcIndex

            };
            this.backPageEmit.emit(output)

        } else {
            let output = {
                //多選回傳答案
                multi: this.shwQuestion.multi,
                answer: '',//父層click時處理
                answesArray: this.shwQuestion.ansLists////回傳各答案的linkRtIndex、linkRcIndex
            };
            this.backPageEmit.emit(output)
        }




    }


    //點選checkbox選項中的一筆

    onCheck(item, set_val?: boolean) {

        if (item.showCheck) {
            item.showCheck = false; //相反值(checked動作)

        }
        else {
            item.showCheck = true;
        }
        item.showCheck = set_val;

    }
}
