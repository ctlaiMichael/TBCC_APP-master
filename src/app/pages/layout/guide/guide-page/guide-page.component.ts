/**
 * 使用者導覽頁
 */
import { Component, OnInit } from '@angular/core';
import Swiper from 'swiper/dist/js/swiper.js';
import { NavgatorService } from '@core/navgator/navgator.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
@Component({
    selector: 'app-guide-page',
    templateUrl: './guide-page.component.html',
    styleUrls: ['./guide-page.component.css']
})
export class GuidePageComponent implements OnInit {

    swiper: Swiper;
    showPage: string = '1';
    showStart = false;
    constructor(
        private navgator: NavgatorService,
        private localStorageService: LocalStorageService,
        private uiContentService: UiContentService
    ) {
    }
    ngOnInit() {

    }

    ngAfterViewInit() {

        setTimeout(() => {
            let self = this;
            this.swiper = new Swiper('.swiper-ad-container', {
                loop: false,
                pagination: {
                    el: '.swiper-ad-pagination',
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                on: {
                    slideChangeTransitionEnd: function (event) {
                        if (this.isEnd) {
                            self.showStart = true;
                        } else {
                            self.showStart = false;
                        }
                    }
                },
                observer: true,
                observeParents: true
            });
        }, 50);
    }

    skip() {
        this.uiContentService.setGuide('guide', '1');
        this.navgator.push('home');
    }
    onStart() {
      this.uiContentService.setGuide('guide', '1');
        this.navgator.push('home');
    }
}
