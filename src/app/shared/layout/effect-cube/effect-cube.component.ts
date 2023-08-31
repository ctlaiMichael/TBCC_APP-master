import { Component, OnInit, AfterViewInit, Input, OnChanges } from '@angular/core';
import Swiper from 'swiper/dist/js/swiper.js';
import { BannerService } from '@pages/home/shared/service/banner.service';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '@environments/environment';
import { InAppBrowserService } from '@lib/plugins/in-app-browser/in-app-browser.service';

@Component({
  selector: 'app-effect-cube',
  templateUrl: './effect-cube.component.html',
  styleUrls: ['./effect-cube.component.css']
})
export class EffectCubeComponent implements OnInit, AfterViewInit, OnChanges {
  swiper: Swiper;
  @Input() banners;
  constructor(
    public _DomSanitizer: DomSanitizer,
    private inAppBrowser: InAppBrowserService
  ) {

  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // this.swiper = this.swiper || new Swiper('.swiper-ad-container', {
    //   loop: true,
    //   autoplay: {
    //     delay: environment.AD_SLIDE_SPEED,
    //     disableOnInteraction: false,
    //   },
    //   pagination: {
    //     el: '.swiper-ad-pagination',
    //   },
    //   observer: true, // 修改swiper自己或子元素時，自動初始化swiper
    //   observeParents: true // 修改swiper的父元素時，自動初始化swiper

    //   // nextButton: '.swiper_chat_btn',
    //   // prevButton: '.swiper_friend_btn',
    //   // initialSlide: this.defaultIndex,
    //   // effect: 'cube',
    //   // grabCursor: true,
    //   // cubeEffect: {
    //   //   shadow: false,
    //   //   slideShadows: false,
    //   //   shadowOffset: 0,
    //   //   shadowScale: 1,
    //   // }
    // });
  }

  ngOnChanges() {
    if (this.banners.length) {
      this.swiperFnc();
    }
  }
  swiperFnc() {
    this.swiper = this.swiper || new Swiper('.swiper-ad-container', {
      // loop: true,
      autoplay: {
        delay: environment.AD_SLIDE_SPEED,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-ad-pagination',
      },
      observer: true, // 修改swiper自己或子元素時，自動初始化swiper
      observeParents: true // 修改swiper的父元素時，自動初始化swiper
    });
  }
  clickBanner(banner) {
    this.inAppBrowser.open(banner.BANNER_URL, '_system');
  }
}
