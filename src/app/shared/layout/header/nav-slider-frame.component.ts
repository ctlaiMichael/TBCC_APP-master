import { Component, OnInit } from '@angular/core';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';

@Component({
  selector: 'app-nav-slider-frame',
  template: '<div class="nav_open_cover" [hidden]="!display" (click)="clickScreen()"></div>'
})
export class NavSliderFrameComponent implements OnInit {
  display = false;
  subscriptDisplayChange: any;
  constructor(private headerCtrl: HeaderCtrlService) {
  }

  ngOnInit() {
    this.subscriptDisplayChange = this.headerCtrl.displayNavSliderFrameSubject.subscribe((status: any) => {
      this.display = status;
    });
  }

  clickScreen() {
    this.display = false;
    this.headerCtrl.closeMenu();
  }
}
