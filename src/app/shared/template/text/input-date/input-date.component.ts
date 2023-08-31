/**
 * date輸入欄位(需雷同input date)
 * <input type="date" class="inner_input_data" min="{{startDate.min}}" max="{{startDate.max}}" [(ngModel)]="startDate.data">
 *  改成
 * <input-date [min]="startDate.min" [max]="startDate.max" [(ngModel)]="startDate.data"
        [setData]="set_data" (backValueEmit)="onInputBack($event)"></input-date>
 *
 * setData = {
 *      title : '欄位標題',
 *      placeholder: '欄位說明',
 *      readOnlyFlag: false, // 選填欄位，是否只可閱讀(default: false)
 *      min: '', // 選填欄位，最小日期設定
 *      max: '' // 選填欄位，最大日期設定
 * }
 */
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { TranslateService } from '@ngx-translate/core';
import { CheckService } from '@shared/check/check.service';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { DateCheckUtil } from '@shared/util/check/date-check-util';
import { DatepickerPopService } from '@shared/popup/datepicker-pop/datepicker-pop.service';
import { DateService } from '@core/date/date.service';
/**
 * 此段為了讓component可以使用ngModel!!!!
 * Angular的DI機制會找到所有擴充NG_VALUE_ACCESSOR的來源，並把它視為表單控制項來使用。
 * https://dotblogs.com.tw/wellwind/2017/03/20/angular-advanced-customize-component-with-ngmodel
 */
import { forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
export const InputDateValueAccessor: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputDateComponent),
    multi: true
};


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'input-date',
    templateUrl: './input-date.component.html',
    styleUrls: [],
    providers: [InputDateValueAccessor]
})
export class InputDateComponent implements OnInit, OnChanges, ControlValueAccessor {
    /**
     * 參數處理
     */
    @Input() setData: any;
    @Input() min: string; // 最小日期設定
    @Input() max: string; // 最大日期設定
    @Input() valueStr: any;
    @Input() checkBusinessDay: boolean;
    @Input() errorStr: any;
    @Input() checkDate: any;  //議價匯率判斷是否繼續往下跳日期
    @Output() backValueEmit: EventEmitter<string> = new EventEmitter<string>();
    showLayout = false; // 顯示外框: true 顯示外框, false 只顯示input
    title = 'FIELD.DATE'; // 查詢日期
    placeholderStr = 'FIELD.DATE_EDIT'; // 請輸入日期
    inp_data = '';
    error_data = '';
    disabledFlag = false;
    requireFlag = false;
    minDate = ''; // 最小日期
    maxDate = ''; // 最大日期
    onChangeEvent: (value) => {};
    onTouchedEvent: () => {};

    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private _checkService: CheckService
        , private translate: TranslateService
        , private datepicker: DatepickerPopService
        , private dateService: DateService
        , private _handleError: HandleErrorService
        , private logger:Logger
    ) {
    }


    ngOnInit() {
        if (typeof this.valueStr === 'string' && this.valueStr !== '' && this.inp_data != this.valueStr) {
            // 避免init時資料消失
            this.inp_data = this.valueStr;
            this.onCheckEvent();
        }
        if (typeof this.setData === 'object' && this.setData) {
            if (this.setData.hasOwnProperty('require')) {
                this.requireFlag = (!!this.setData['require']) ? true : false;
            }
            if (this.setData.hasOwnProperty('showLayout') && this.setData['showLayout']) {
                this.showLayout = true;
            }
            if (this.setData.hasOwnProperty('title') && this.setData['title'] && this.setData['title'] !== '') {
                this.translate.get(this.setData['title']).subscribe((val) => {
                    if (this.requireFlag) {
                        this.title = '*' + val;
                    } else {
                        this.title = val;
                    }
                });
            }
            if (this.setData.hasOwnProperty('placeholder') && this.setData['placeholder'] && this.setData['placeholder'] !== '') {
                this.placeholderStr = this.setData['placeholder'];
            }
            if (this.setData.hasOwnProperty('readOnlyFlag')) {
                this.modifyDisabled(this.setData['readOnlyFlag']);
            } else {
                this.modifyDisabled(this.disabledFlag);
            }
            if (this.setData.hasOwnProperty('minDate')) {
                this.modifyMinDate(this.setData.minDate);
            }
            if (this.setData.hasOwnProperty('maxDate')) {
                this.modifyMaxDate(this.setData.maxDate);
            }
        }
        if (this.min && this.min !== '') {
            // [min] > setData.min
            this.modifyMinDate(this.min);
        }
        if (this.max && this.max !== '') {
            this.modifyMaxDate(this.max);
        }
    }

    ngOnChanges() {
        if (typeof this.errorStr === 'string' && this.errorStr !== '' && this.error_data != this.errorStr) {
            this.error_data = this.errorStr;
        }
    }

    /**
     * 返回上一層
     * @param e data
     * @param type 類別
     */
    onBackPageData(e, type?: string) {
        if (type === 'change') {
            // change event
            this._logger.step('Date', 'change', this.inp_data);
            // 檢查資料
            this.onCheckEvent();
        } else {
            // module change (focuse in)
            this._logger.step('Date', 'model change', this.inp_data);
        }
        this.backValueEmit.emit(this.inp_data);
        this.notifyValueChange();
    }

    /**
     * 資料檢查
     */
    onCheckEvent() {
        this.error_data = '';
        let do_check = false;
        // 空值檢查
        if (!ObjectCheckUtil.checkEmpty(this.inp_data, true, false)) {
            if (this.requireFlag) {
                // 顯示空值錯誤
                // 非必須輸入欄位，空值不檢核
                do_check = true;
            }
        } else {
            do_check = true; // 只要有輸入都要做檢查
        }
        if (do_check) {
            if (this.checkBusinessDay == true) {
                this.inp_data = this.dateService.getBusinessDay(this.inp_data).replace(/-/g, '/');
            }
            const check_data = DateCheckUtil.checkDate(this.inp_data);
            if (!check_data.status) {
                this.error_data = check_data.msg;
                this.errorStr = check_data.msg;
                this._logger.error('Date', this.inp_data, check_data);
            }
        }
    }

    /**
     * 日期選擇
     */
    onDateSelect() {
        this.logger.log('checkdate:',this.checkDate);
        if(this.checkDate!="" && this.checkDate!=undefined && this.checkDate=='1'){
            this._handleError.handleError({
                type: 'dialog',
                title: '提醒您',
                content: "議價匯率限為當日交易"
            });
            return false;
        }
        let set_data = {
            date: this.inp_data,
            min: this.minDate,
            max: this.maxDate
        };
        this.datepicker.show(set_data).then(
            (res_data) => {
                this._logger.step('Date', 'date', res_data, typeof res_data);
                this.inp_data = DateUtil.transDate(res_data, 'date');
                this.onBackPageData(res_data, 'change');
            },
            (error_data) => {
                this._logger.error('Date', 'Select Error', error_data);
            }
        );
    }


    // --------------------------------------------------------------------------------------------
    //  _      _____ _      ____  ____  _____ _
    // / \  /|/  __// \__/|/  _ \/  _ \/  __// \
    // | |\ ||| |  _| |\/||| / \|| | \||  \  | |
    // | | \||| |_//| |  ||| \_/|| |_/||  /_ | |_/\
    // \_/  \|\____\\_/  \|\____/\____/\____\\____/
    // --------------------------------------------------------------------------------------------

    /**
     * ngModel處理: 當來源資料變更時呼叫
     * (string) 日期格式
     */
    writeValue(obj: any): void {
        let set_val = obj;
        if (!set_val) {
            set_val = '';
        }
        this.inp_data = DateUtil.transDate(set_val, 'date');
        this._logger.step('Date', 'writeValue', obj, set_val, this.inp_data);
    }

    /**
     * ngModel處理:
     *  提供Component內資料變更需要binding時呼叫的方法，
     *  會Component初始化時傳一個function當作參數，
     *  我們需要在Component內保留此變數，在資料變需要綁定時進行呼叫。
     */
    registerOnChange(fn: any): void {
        this.onChangeEvent = fn;
        // this._logger.step('Date', 'registerOnChange', fn, this.onChangeEvent);
    }

    /**
     * ngModel處理: 同registerOnChange，只不過是在狀態變更為touched時呼叫
     */
    registerOnTouched(fn: any): void {
        this.onTouchedEvent = fn;
        // this._logger.step('Date', 'registerOnTouched', fn, this.onChangeEvent);
    }


    /**
     * ngModel處理: 當控制項的disabled屬性變更時會呼叫的方法
     */
    setDisabledState(isDisabled: boolean): void {
        this.modifyDisabled(isDisabled);
        this._logger.step('Date', 'registerOnTouched', isDisabled);
    }

    /**
     * ngModel處理:
     * 資料變更時將要綁定的資料透過registerOnChange時傳過來的方法傳遞回去。
     * 而在Component中當資料被設定時（setter）在乎叫這個方法，來完成通知變更的動作。
     */
    notifyValueChange() {
        if (this.onChangeEvent) {
            this.onChangeEvent(this.inp_data);
            this._logger.step('Date', 'notifyValueChange', this.inp_data);
        }
    }



    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------

    /**
     * disabled處理
     */
    private modifyDisabled(isDisabled: boolean) {
        this.disabledFlag = (!!isDisabled) ? true : false;
        if (this.disabledFlag) {
            this.placeholderStr = ''; // disabled不顯示說明視窗
        }
    }

    /**
     * min date處理
     * @param date
     */
    private modifyMinDate(date: string) {
        this.minDate = DateUtil.transDate(date);
    }

    /**
     * max date處理
     * @param date
     */
    private modifyMaxDate(date: string) {
        this.maxDate = DateUtil.transDate(date);
    }

}

