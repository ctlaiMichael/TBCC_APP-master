
import { AfterContentInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]'
})
export class AutoFocusDirective implements AfterContentInit {

  @Input() public autoFocus: boolean;

  public constructor(private element: ElementRef) {

  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.element.nativeElement.focus();
    }, 500);
  }

}
