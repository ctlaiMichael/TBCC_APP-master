import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SlideCtrlService {

  initialX: number;
  initialY: number;

  swipeLeftSubject: Subject<string> = new Subject<string>();
  swipeRightSubject: Subject<string> = new Subject<string>();

  isUse = false;

  constructor(

  ) {
    const container = document.getElementById('body');
    container.addEventListener('touchstart', this.startTouch, false);
    container.addEventListener('touchmove', this.moveTouch, false);
  }

  /**
   * 開始觸控
   */
  startTouch = (e) => {
    if (this.isUse) {
      this.initialX = e.touches[0].clientX;
      this.initialY = e.touches[0].clientY;
    }
  }

  /**
   * 計算滑動距離
   */
  moveTouch = (e) => {
    if (!this.initialX || !this.initialY || !this.isUse) {
      return;
    }

    let currentX = e.touches[0].clientX;
    let currentY = e.touches[0].clientY;

    let diffX = this.initialX - currentX;
    let diffY = this.initialY - currentY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 50) {
        // 往左滑動
        this.swipeLeftSubject.next();
      } else if (diffX < -50) {
        // 往右滑動
        this.swipeRightSubject.next();
      }
    }
  }

  /**
   * 設定開啟左右滑
   */
  openSlideCtrl() {
    this.isUse = true;
  }

  /**
   * 設定關閉左右滑
   */
  closeSlideCtrl() {
    this.isUse = false;
  }

}
