import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { PersonalInfo } from './personal-info';
import { HeaderOptions } from './header-options';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { MENU_SETTING } from '@conf/menu/main-menu';
import { ObjectUtil } from '@shared/util/formate/modify/object-util';
import { PushService } from '@lib/plugins/push.service';
@Injectable()
export class HeaderCtrlService {
  sliderMenu: any = []; // menu變動資料
  sliderMenuKey = 'sliderSetting';
  disableReturnCount: number;
  disableNativeReturnSubject: Subject<boolean> = new Subject<boolean>();
  changeLeftBtnClick: Subject<any> = new Subject<any>();
  changeRightBtnClick: Subject<any> = new Subject<any>();
  changeBakBtnfocus: Subject<any> = new Subject<any>();
  changeOption: Subject<any> = new Subject<any>();
  updateOptionSubject: Subject<any> = new Subject<any>();
  changePersonalInfo: Subject<any> = new Subject<any>();
  closeMenuSubject: Subject<any> = new Subject<any>();
  displayNavSliderFrameSubject: Subject<any> = new Subject<any>();
  changeSliderSubject: Subject<any> = new Subject<any>();
  checkFinishSubject: Subject<any> = new Subject<any>();
  closePopupSubject: Subject<any> = new Subject<any>();
  showRightSecBadgeSubject: Subject<number> = new Subject<number>();

  constructor(
    private localStorage: LocalStorageService,
    private push: PushService
  ) {
    this.disableReturnCount = 0;
    this.initSliderMenu();
  }

  initSliderMenu() {
    // 取localstorage 若取不到用預設選單
    const sliderSetting = this.localStorage.getObj(this.sliderMenuKey);

    /*  chengWei 20-04-10 目前短解 ，待選單改為ID清單對應優化後可刪除
        針對線上取號以設定選單的人更新localStorage URL
        Strat
    */
    const changeSliderSetting = this.localStorage.getObj('converSliderUrlFlag');
    if (sliderSetting && !changeSliderSetting) {
      let converSliderMenu = [];
      sliderSetting.forEach((item) => {
        if (item['name'] == 'FUNC_SUB.OTHER.OTN'  || item['name'] == 'MAIN_MENU.TICKET') {
          item['url'] = 'take-number';
        }
        converSliderMenu.push(item);
      });
      this.localStorage.setObj(this.sliderMenuKey, converSliderMenu);
      this.localStorage.setObj('converSliderUrlFlag', true);
    }
     /*  END chengWei 20-04-10 目前短解 */
    this.sliderMenu = sliderSetting || MENU_SETTING.SLIDER;
  }

  /**
   * 更新選單
   * @param newSliderMenu 新排序選單
   */
  updateSliderMenu(newSliderMenu) {
    this.sliderMenu = newSliderMenu;
    this.localStorage.setObj(this.sliderMenuKey, this.sliderMenu);
    this.changeSliderSubject.next(this.sliderMenu);
  }

  getSliderMenu(): any[] {
    return ObjectUtil.clone(this.sliderMenu);
  }

  /**
   * 設定個人資訊(存款餘額/信用卡消費)
   * @param info 個人資訊
   */
  setPersonalInfo(info: PersonalInfo) {
    this.changePersonalInfo.next(info);
  }

  /**
   * 清楚Body的class屬性
   */
  resetBodyClass() {
    const classList = [];
    const frameZones = Array.from(document.body.classList);
    frameZones.forEach((item) => classList.push(item));
    // document.body.classList.forEach((item) => classList.push(item));
    classList.forEach((item) => document.body.classList.remove(item));
  }

  /**
   * 設定Body的class 屬性
   * @param classList class清單
   */
  setBodyClass(classList: string[]) {
    this.resetBodyClass();
    classList.forEach((item) => document.body.classList.add(item));
  }

  /**
   * 設定Header樣式
   * @param style 樣式名稱 normal/login
   */
  setHeaderStyle(style: string) {
    const option = new HeaderOptions();
    option.style = style;
    this.setOption(option);
  }


  setBakBtnfocus(value: any) {
    this.changeBakBtnfocus.next(value);
  }
  /**
   * 設定Header選項
   * @param option Header設定
   */
  setOption(option) {
    this.changeOption.next(option);
  }

  /**
   * 更新Header選項
   * @param option Header設定
   */
  updateOption(option) {
    this.updateOptionSubject.next(option);
  }

  closePopup() {
    this.closePopupSubject.next();
  }

  /**
   * 設定左邊按鈕
   * @param clickLift 對應Function
   */
  setLeftBtnClick(clickLift: any) {
    this.changeLeftBtnClick.next(clickLift);
  }

  /**
   * 設定右邊按鈕
   * @param clickRight 對應Function
   */
  setRightBtnClick(clickRight: any) {
    this.changeRightBtnClick.next(clickRight);
  }

  /**
   * 關閉選單
   */
  closeMenu() {
    this.closeMenuSubject.next();
  }

  /**
   * 設定是否顯示NavSliderFrame
   * @param display 顯示狀態
   */
  displayNavSliderFrame(display: boolean) {
    this.displayNavSliderFrameSubject.next(display);
  }

  disableNativeReturn(disable: boolean) {
    if (disable) {
      this.disableReturnCount += 1;
      this.disableNativeReturnSubject.next(true);
    } else {
      this.disableReturnCount -= 1;
      if (this.disableReturnCount <= 0) {
        this.disableReturnCount = 0;
        this.disableNativeReturnSubject.next(false);
      }
    }

  }

  /**
   *
   */
  setCheckFinishStatus(checkFinish: boolean) {
    this.checkFinishSubject.next(checkFinish);
  }

  setRightSecBadge(num: number) {
    this.localStorage.set('unreadCount', String(num));
    this.showRightSecBadgeSubject.next(num);
  }

  /**
   * 初始化未讀筆數
   */
  initRightSecBadge() {
    let unreadCount = this.localStorage.get('unreadCount');
    if (!!unreadCount && Number(unreadCount) > 0) {
      this.showRightSecBadgeSubject.next(Number(unreadCount));
  }
  }

  /**
   * 更新未讀筆數
   */
  updateRightSecBadge() {
    this.push.getBroadcastList().then(res => {
      let unreadCount = 0;
      if (!!res['data'] && res['data'] instanceof Array && Object.keys(res['data']).length > 0) {
        unreadCount = res['data'].filter(element => !!element['IsReadContent'] && element['IsReadContent'] == '0').length;
      }
      this.setRightSecBadge(unreadCount);
    });
  }
}
