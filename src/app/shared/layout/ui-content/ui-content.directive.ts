import { Directive, ElementRef, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';

@Directive({
  selector: '[appUiContent]'
})
export class UiContentDirective implements AfterViewInit, OnDestroy {

  @Input('appUiContent') appUiContent: string;

  subscriptionContentChange: any;
  subscriptionContentReload: any;
  defaultContent: string;


  constructor(private el: ElementRef, uiContentService: UiContentService) {
    this.subscriptionContentChange = uiContentService.contentChange.subscribe((value: any) => {
      if (value.to === this.appUiContent) {
        this.el.nativeElement.innerHTML = value.content;
      }
    });
    this.subscriptionContentReload = uiContentService.contentReload.subscribe((value: string) => {
      if (value === this.appUiContent) {
        this.el.nativeElement.innerHTML = this.defaultContent;
      }
    });
  }

  ngAfterViewInit() {
    this.defaultContent = this.el.nativeElement.innerHTML;
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscriptionContentChange.unsubscribe();
    this.subscriptionContentReload.unsubscribe();
  }

}
