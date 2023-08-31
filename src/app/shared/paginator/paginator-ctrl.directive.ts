/**
 * 分頁處理
 * Logger Key: Scroll
 * [output]
 *  scrollPosition: 當前scrollTop
 */
import {
  Directive, ElementRef, Input, Output, OnDestroy
  , HostListener, EventEmitter

} from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { PaginatorCtrlService } from '@shared/paginator/paginator-ctrl.srevice';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

@Directive({
  selector: '[paginatorCtrl]'
})
export class PaginatorCtrlDirective implements OnDestroy {
  /**
   * 參數處理
   */
  @Input('nowPage') nowPage: number;
  @Input('totalPages') totalPages: number;
  @Output() scrollPosition: EventEmitter<number> = new EventEmitter<number>(); // Scroll Position
  @Output() scrollEvent: EventEmitter<number> = new EventEmitter<number>(); // Scroll Position
  private scrollEvent$;
  private checkPageDistance = 0.9;

  constructor(
    private _logger: Logger
    , private el: ElementRef
    , private paginactorCtrl: PaginatorCtrlService // 分頁控制
  ) {
    this.scrollEvent$ = Observable.fromEvent(this.el.nativeElement, 'scroll').subscribe((e: any) => {
      const mainBox = (e.target) ? e.target : null;
      this.doScroll(mainBox);
    });
  }

  ngOnDestroy() {
    this.onScrollDistory();
  }

  /**
   * Scroll Event執行
   */
  onScrollEvent() {
    const next_page = this.nowPage + 1;
    this.scrollEvent.emit(next_page);
  }

  /**
   * 結束
   */
  onScrollDistory() {
    this.scrollEvent$.unsubscribe();
  }

  /**
   * 執行事件
   * @param mainBox 
   */
  private doScroll(mainBox) {
    if (!mainBox) {
      return false;
    }
    let output = {
      scrollTop: 0,
      offsetHeight: 0,
      scrollHeight: 0,
      distance_height: 0,
      distance_percent: 0
    };
    if (mainBox.scrollTop) {
      this.scrollPosition.emit(mainBox.scrollTop);
      output.scrollTop = mainBox.scrollTop;
    }
    output.offsetHeight = (mainBox.offsetHeight) ? mainBox.offsetHeight : 0;
    output.scrollHeight = (mainBox.scrollHeight) ? mainBox.scrollHeight : 0;

    output.distance_height = output.scrollHeight - output.offsetHeight;
    output.distance_percent = output.scrollTop / output.distance_height;
    this._logger.step('Scroll', 'data', JSON.parse(JSON.stringify(output)));
    if (output.distance_percent > this.checkPageDistance
      && (this.nowPage < this.totalPages)
    ) {
      this._logger.step('Scroll', 'pageCounter', this.nowPage);
      this.onScrollEvent();
    } else if (this.nowPage >= this.totalPages) {
      this._logger.step('Scroll', 'pageCounter is end', this.nowPage);
      // 不可以distory!!!!切換類別reset nowPage會沒作用!!!
      // this.onScrollDistory(); // End Scroll
    }
  }



}
