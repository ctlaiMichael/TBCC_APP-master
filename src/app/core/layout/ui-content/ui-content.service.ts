import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { LocalStorageService } from '@lib/storage/local-storage.service';


@Injectable()
export class UiContentService {

  constructor(
    private localStorageService: LocalStorageService
  ) { }
  contentChange: Subject<any> = new Subject<any>();
  contentReload: Subject<string> = new Subject<string>();

  changeContent(context: any) {
    this.contentChange.next(context);
  }

  reloadContent(context: any) {
    this.contentReload.next(context);
  }


  /**
   * 找outlet為primary的route的data
   * @param route_obj 要找的物件
   * @param key_name 要找的資料
   */
  scrollTop(obj?: any) {
    if (typeof obj === 'undefined') {
      const bodyScrollTop: any = document.getElementsByTagName('section');
      if (bodyScrollTop.length > 0) {
        obj = bodyScrollTop[0];
      }
    }
    if (typeof obj !== 'undefined') {
      obj.scrollTop = 0;
    }
  }

  /**
   * 重設定section滾動事件
   * @param type 滾動開關
   */
  setSectionScroll(type: boolean) {
    const sections = document.getElementsByTagName('section');
    if (!sections || typeof sections === 'undefined') {
      return false;
    }
    let do_str = 'auto';
    if (!type) {
      do_str = 'hidden';
    }

    for (let i = 0; i < sections.length; i++) {
      if (typeof sections[i] !== 'undefined' && sections[i] != null
        && typeof sections[i].style !== 'undefined' && sections[i].style != null
        && typeof sections[i].style.overflowY !== 'undefined' && sections[i].style.overflowY != null
      ) {
        sections[i].style.overflowY = do_str;
      }
    }
  }
  /**
   * 
   * @param type 
   */
  getGuide(type) {
    let firstGuide = this.localStorageService.getObj('firstGuide');
    if (typeof firstGuide === 'object' && !!firstGuide) {
      if (firstGuide.hasOwnProperty(type)) {
        return firstGuide[type];
      } else {
        return '0';
      }
    } else {
      return '0';
    }
  }

  /**
   * 
   * @param type 
   * @param value 
   */
  setGuide(type, value) {
    let firstGuide: any = this.localStorageService.getObj('firstGuide');
    if (typeof firstGuide != 'object' || !firstGuide) {
      firstGuide = {
        'guide':'0',
        'home':'0',
        'user-home':'0'
      };
    }
    firstGuide[type] = value;

    this.localStorageService.setObj('firstGuide', firstGuide);
  }
}
