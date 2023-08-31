import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
@Injectable()
export class PatternLockService {

  resetPatternSubject: Subject<any> = new Subject<any>();
  enablePatternSubject: Subject<any> = new Subject<any>();
  disablePatternSubject: Subject<any> = new Subject<any>();
  onDrawSubject: Subject<any> = new Subject<any>();
  patternPwd: string = ''; // 圖形鎖密碼 ex:123654

  constructor(
  ) { }

  /**
   * 清空圖形密碼圖案
   */
  resetPattern() {
    this.resetPatternSubject.next();
    this.setPatternPwd('');
  }

  /**
   * 設置圖形密碼
   */
  setPatternPwd(patternPwd: string) {
    this.patternPwd = patternPwd;
  }

  /**
   * 取得圖形密碼
   */
  getPatternPwd(): string {
    return this.patternPwd;
  }

  /**
   * 開啟圖形密碼(可以畫圖)
   */
  enablePattern() {
    this.enablePatternSubject.next();
  }

  /**
   * 鎖住圖形密碼(無法畫圖)
   */
  disablePattern() {
    this.disablePatternSubject.next();
  }

  /**
   * 僅供pattern-lock.component呼叫
   */
  onDraw() {
    this.onDrawSubject.next();
  }

}
