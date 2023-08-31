import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { logger } from '@shared/util/log-util';
import PatternLock from 'patternlock';
import { PatternLockService } from '@shared/pattern-lock/pattern-lock.service';
import { SlideCtrlService } from '@core/slide/slide-ctrl.service';
import { DeviceService } from '@lib/plugins/device.service';
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-Pattern',
  templateUrl: './pattern.component.html',
  styleUrls: ['./pattern.component.css'],
  providers: [PatternLockService, SlideCtrlService, DeviceService]
})

export class PatternComponent implements OnInit, OnDestroy {
  promise: Promise<any>;
  subscriptionResetPattern: any;
  subscriptionEnablePattern: any;
  subscriptionDisablePattern: any;
  subscriptionOnDraw: any; // 訂閱圖形鎖的onDraw
  patternPPWWDD: any; // 圖形鎖ppwwdd
  patternLock; // 圖形鎖
  patternLockControl: HTMLElement; //
  styleForNarrow = {}; // 手機過窄會使圖形密碼跑版，需調整margin left
  returnObj = {
    ERROR: {
      title: '',
      status: null,
      message: '',
      content: '',
      type: ''
    },
    Pattern_val: '' // 輸入的圖形密碼
  };
  constructor(
    private patternLockService: PatternLockService,
    private slideCtrl: SlideCtrlService,
    private device: DeviceService,
  ) {
    this.promise = new Promise((resolve, reject) => {
      this.yes = () => {
        this.patternPPWWDD = this.patternLockService.getPatternPwd();
        if (this.patternPPWWDD.length <= 1) {
          this.patternLockService.resetPattern();
          return;
        }
        this.slideCtrl.closeSlideCtrl();
        this.returnObj.Pattern_val = this.patternPPWWDD;
        resolve(this.returnObj);
      },

        this.cancel = () => {
          this.slideCtrl.closeSlideCtrl();
          let ERROR = {
            title: '',
            status: false,
            message: '使用者取消',
            content: '使用者取消',
            type: '',
            errorCode: 'USER_CANCEL'
          };
          reject(ERROR);
        };

    });
  }

  // 參考 http://ignitersworld.com/lab/patternLock.html
  ngOnInit() {
    this.slideCtrl.closeSlideCtrl();
    this.patternLockControl = document.getElementById('patternLock');
    this.patternLockControl.addEventListener('touchstart', (e) => {
      this.slideCtrl.closeSlideCtrl();
    }, true);
    // popup寬 = 90%螢幕，圖形密碼寬 = 310px
    const width = window.document.body.clientWidth;
    if (width < 344) { // 310/0.9 = 344
      const adjustMargin = (344 - width) / 2;
      this.styleForNarrow = { 'margin-left': `-${adjustMargin}px` };
    }

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
    });

    this.subscriptionOnDraw = this.patternLockService.onDrawSubject.subscribe(() => {
      this.yes();
    });

  }

  yes() { }
  cancel() { }

  ngOnDestroy() {
    this.patternLockService.setPatternPwd('');
    this.patternLockControl.removeEventListener('touchstart', this.slideCtrl.closeSlideCtrl);
    this.subscriptionResetPattern.unsubscribe();
    this.subscriptionEnablePattern.unsubscribe();
    this.subscriptionDisablePattern.unsubscribe();
    this.subscriptionOnDraw.unsubscribe();
    this.slideCtrl.closeSlideCtrl();
  }

}

