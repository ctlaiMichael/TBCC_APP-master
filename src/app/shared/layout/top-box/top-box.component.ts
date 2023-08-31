import { Component, OnInit, AfterViewInit, Input } from '@angular/core';

import { LocalStorageService } from '@lib/storage/local-storage.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import Swiper from 'swiper/dist/js/swiper.js';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { CommonUtil } from '@shared/util/common-util';

@Component({
  selector: 'app-top-box',
  templateUrl: './top-box.component.html',
  styleUrls: ['./top-box.component.css']
})
export class TopBoxComponent implements OnInit, AfterViewInit {
  @Input() className: string;
  swiper: Swiper;
  menuSlider: any = []; // menu變動資料
  subscriptionSliderChange: any;

  constructor(
    private navgator: NavgatorService,
    private headerCtrl: HeaderCtrlService,
    private localStorage: LocalStorageService
  ) {
    this.menuSlider = this.headerCtrl.getSliderMenu();
    if (!this.className) {
      this.className = 'initial_slider';
    }
  }

  ngOnInit() {
    this.subscriptionSliderChange = this.headerCtrl.changeSliderSubject.subscribe(sliderMenu => {
      this.menuSlider = sliderMenu;
      // 延遲更新確保畫面不會跑版
      CommonUtil.wait(500).then(() => this.swiper.update());
    });
  }

  ngAfterViewInit() {
    this.swiper = this.swiper || new Swiper('.' + this.className + '-swiper-container', {
      slidesPerView: 4,
      slidesPerGroup: 4,
      pagination: {
        el: '.' + this.className + '-pagination',
        bulletElement: 'li',
        renderBullet: function (index, className) {
          return '<li class="' + className + '" role="presentation"><button type="button" role="tab" >' + index + '</button></li>';
        },
        bulletClass: 'a',
        bulletActiveClass: 'slick-active',
        currentClass: 'slick-active'
      },
    });
  }

  public goNext(url: string) {
    this.navgator.push(url);
  }
}
