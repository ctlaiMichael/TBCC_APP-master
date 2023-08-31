import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MicroInteractionService {
  displayMicroBoxSubject: Subject<any> = new Subject<any>();
  hiddenMicroBoxSubject: Subject<any> = new Subject<any>();
  hideMicroMenuSubject: Subject<any> = new Subject<any>();
  hiddenMicroBoxCount: number;
  constructor() {
    this.hiddenMicroBoxCount = 0;
  }

  /**
   * 隱藏微交互按鈕(只有顯示為true隱藏為false時會顯示)
   * @param hidden 是否隱藏
   */
  hideMicroBox(hidden: boolean) {
    if (hidden) {
      this.hiddenMicroBoxCount += 1;
      this.hiddenMicroBoxSubject.next(true);
    } else {
      this.hiddenMicroBoxCount -= 1;
      if (this.hiddenMicroBoxCount <= 0) {
        this.hiddenMicroBoxCount = 0;
        this.hiddenMicroBoxSubject.next(false);
      }
    }
  }

  /**
   * 顯示微交互
   * @param show 是否顯示
   * @param type 類型
   */
  displayMicroBox(show: boolean, type = '') {
    this.displayMicroBoxSubject.next({ show: show, type: type });
  }

  hideMicroMenu() {
    this.hideMicroMenuSubject.next();
  }

}
