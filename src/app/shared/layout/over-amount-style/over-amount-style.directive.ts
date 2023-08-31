/**
 * 分頁處理
 * Logger Key: Scroll
 * [output]
 *  scrollPosition: 當前scrollTop
 * [TODO:] 動畫處理
 */
import {
  Directive, ElementRef, Input, Output, OnDestroy
  , HostListener, EventEmitter, OnChanges
} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import { Logger } from '@core/system/logger/logger.service';
import { OverAmountOptions } from '@shared/layout/over-amount-style/over-amount-options';
import { FormateService } from '@shared/formate/formate.service';
import { CheckService } from '@shared/check/check.service';

@Directive({
  selector: '[overAmountStyle]',
  providers: [CheckService]
})
export class OverAmountStyleDirective implements OnChanges, OnDestroy {
  /**
   * 參數處理
   */
  @Input('content') content: any; // 內容
  @Input('option') option: OverAmountOptions; // option
  private pre_data = '';
  private now_option: OverAmountOptions;

  constructor(
    private _logger: Logger
    , private el: ElementRef
    , private _formateService: FormateService
    , private _checkService: CheckService
  ) {
  }

  ngOnChanges() {
    if (this.content !== this.pre_data) {
      this.modifyData();
    }

  }


  ngOnDestroy() {
  }

  private modifyData() {
    let df_set = new OverAmountOptions();
    this.now_option = { ...df_set, ...this.option };
    this.pre_data = this.content;
    let show_data = this.now_option.empty_str;
    if (this._checkService.checkEmpty(this.content, true, this.now_option.zero_type)) {
      if (this.now_option.show_currency) {
        show_data = this._formateService.currencyAmount(this.content, this.now_option.currency);
      } else {
        show_data = this._formateService.transMoney(this.content, this.now_option.currency);
      }
    }
    this.showEvent(show_data);
  }


  private showEvent(str: string) {
    const str_len = str.length;
    // 目前先不處理
    // if (str_len > this.now_option.over_length) {
    //   this.addClassEvent(this.now_option.over_class);
    // } else {
    //   this.removeClassEvent(this.now_option.over_class);
    // }
    this.el.nativeElement.innerHTML = str;
  }

  private addClassEvent(class_naem: string) {
    if (!this.el.nativeElement.classList.contains(class_naem)) {
      this.el.nativeElement.classList.add(class_naem);
    }
  }

  private removeClassEvent(class_naem: string) {
    if (this.el.nativeElement.classList.contains(class_naem)) {
      this.el.nativeElement.classList.remove(class_naem);
    }
  }

}
