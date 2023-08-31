import { Directive, ElementRef, Input, OnDestroy, AfterViewChecked } from '@angular/core';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';

@Directive({
  selector: '[appUiContentTo]'
})
export class UiContentToDirective implements AfterViewChecked, OnDestroy {

  @Input('appUiContentTo') appUiContentTo: string;

  constructor(private el: ElementRef, private uiContentService: UiContentService) {
  }

  ngAfterViewChecked() {
    this.el.nativeElement.style.display = 'none';
    this.uiContentService.changeContent({ to: this.appUiContentTo, content: this.el.nativeElement.innerHTML });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.uiContentService.reloadContent(this.appUiContentTo);
  }
}
