/**
 * 只有一個option的時候預設選擇
 */
import {
    Directive, Input, Output, OnDestroy
    , EventEmitter, OnInit, OnChanges, ElementRef
} from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';

@Directive({
    selector: '[selectCheck]'
})
export class SelectCheckDirective implements OnInit, OnChanges, OnDestroy {
    /**
     * 參數處理
     */
    @Input() listData: Array<any>;
    @Input() ngModel: any;
    @Output() ngModelChange = new EventEmitter();

    private oldList: any;

    constructor(
        private _logger: Logger
        , private el: ElementRef
    ) {
    }


    ngOnDestroy() {
    }

    ngOnInit() {
        this.checkDefaultSel();
        /* Listening to the value of ngModel */
        // this.ngModel.valueChanges.subscribe((value) => {
        //     console.warn('ng model change', value);
        // });
    }

    ngOnChanges() {
        if (this.listData !== this.oldList) {
            this.checkDefaultSel();
        }
    }

    private checkDefaultSel() {
        if (this.listData.length == 1 && !!this.listData[0]) {
            this.ngModelChange.emit(this.listData[0]);
        }
        this.oldList = this.listData;
    }


}

