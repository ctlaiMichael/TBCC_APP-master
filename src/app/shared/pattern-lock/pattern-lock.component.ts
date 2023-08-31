import { Component, OnInit } from '@angular/core';
import PatternLock from 'patternlock';
import { PatternLockService } from '@shared/pattern-lock/pattern-lock.service';
import { SlideCtrlService } from '@core/slide/slide-ctrl.service';

@Component({
  selector: 'app-pattern-lock',
  templateUrl: './pattern-lock.component.html'
})
export class PatternLockComponent implements OnInit {
  subscriptionResetPattern: any;
  subscriptionEnablePattern: any;
  subscriptionDisablePattern: any;
  patternLock; // 圖形鎖
  patternLockControl: HTMLElement; // 
  constructor(
    private patternLockService: PatternLockService,
    private slideCtrl: SlideCtrlService
  ) { }
  // 參考 http://ignitersworld.com/lab/patternLock.html
  ngOnInit() {
    this.patternLockControl = document.getElementById('patternLock');
    this.patternLockControl.addEventListener('touchstart', (e) => {
      this.slideCtrl.closeSlideCtrl();
    }, true);

    this.patternLock = new PatternLock('#patternLock', {
      onDraw: (pattern) => { // 畫完圖形鎖自動呼叫
        this.patternLockService.setPatternPwd(pattern);
        this.patternLockService.onDraw(); // 通知service畫完
        this.slideCtrl.closeSlideCtrl();
      }
    });
    this.subscriptionResetPattern = this.patternLockService.resetPatternSubject.subscribe(() => {
      this.patternLock.reset();
    });
    this.subscriptionEnablePattern = this.patternLockService.enablePatternSubject.subscribe(() => {
      this.patternLock.enable();
    });
    this.subscriptionDisablePattern = this.patternLockService.disablePatternSubject.subscribe(() => {
      this.patternLock.disable();
    })
  }

  ngOnDestroy() {
    this.patternLockService.setPatternPwd('');
    this.patternLockControl.removeEventListener('touchstart', this.slideCtrl.closeSlideCtrl);
  }

}
