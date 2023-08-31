/**
 * 展開列表處理
 * [output] N/A
 */
import {
  Directive, ElementRef, Input, Output, OnDestroy
  , HostListener, EventEmitter, Renderer
} from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
declare var $: any;

@Directive({
  selector: '[expandListCheckBox]'
})
export class ExpandListCheckBoxDirective implements OnDestroy {
  /**
   * 參數處理
   */
  isOpen = false; // 狀態控制
  public clickOutside = new EventEmitter<MouseEvent>();
  constructor(
    private _logger: Logger
    , private el: ElementRef
    , private renderer: Renderer
  ) {

  }

  ngOnDestroy() {
  }



  @HostListener('click') expandEvent() {
    let nowElement = this.el.nativeElement;
    let nextElement = this.el.nativeElement.parentElement.nextElementSibling;
    let parentElement=this.el.nativeElement.parentElement;
    console.log('nowElement',nowElement);
    console.log('nextElement',nextElement);
    console.log('parentElement',parentElement);
    if (!nowElement || !parentElement ) {
      return false;
    }
    // 確認next element class正確
    if (typeof nextElement.classList === 'undefined' || !nextElement.classList.contains('sub_open_info_frame')) {
      return false;
    }
    // 確認有sub_open按鈕
    let expandBtnElement = parentElement.querySelector('.sub_open');
    if (!expandBtnElement ) {
      return false;
    }

    this.isOpen = (this.isOpen) ? false : true;
    console.log('this.isopen',this.isOpen);
    if (this.isOpen === true) {
      // 列表
      this.renderer.setElementClass(parentElement, 'data_open', true);
      this.renderer.setElementClass(expandBtnElement, 'active', true);
      // 內容
      $(nextElement).slideToggle(200);
      // this.renderer.setElementStyle(nextElement, 'display', 'block');
    } else {
      // 列表
      this.renderer.setElementClass(parentElement, 'data_open', false);
      this.renderer.setElementClass(expandBtnElement, 'active', false);
      // 內容
      $(nextElement).slideToggle(200);
      // this.renderer.setElementStyle(nextElement, 'display', 'none');
    }
  }


}
