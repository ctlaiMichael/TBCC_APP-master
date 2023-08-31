import { Component, NgZone, OnInit, Renderer2 ,ViewChild, ElementRef} from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { HeaderOptions } from '@core/layout/header/header-options';
import { PersonalInfo } from '@core/layout/header/personal-info';
import { LeftMenuService } from '@core/layout/left-menu/left-menu.service';
import { MicroInteractionService } from '@core/layout/micro-interaction.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { SlideCtrlService } from '@core/slide/slide-ctrl.service';
import { environment } from '@environments/environment';
import { ExitAppService } from '@lib/plugins/exit-app.service';
import { QrcodeService } from '@lib/plugins/qrcode.service';
import { OverAmountOptions } from '@shared/layout/over-amount-style/over-amount-options';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { logger } from '@shared/util/log-util';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  title: string;
  leftIcon: string;
  leftBtnClass: string;
  rightBtnClass: string;
  rightIcon: string;
  disableNativeReturn = false;
  personalInfo: PersonalInfo;
  subscriptionLeftBtnClickChange: any;
  subscriptionRightBtnClickChange: any;
  subscriptOption: any;
  subscriptUpdateOption: any;
  subscriptPersonalInfo: any;
  subscriptCloseMenu: any;
  subscriptDisableNativeReturn: any;
  subscriptBakBtnfocus:any;
  subscriptSwipeLeft: Subscription;
  subscriptSwipeRight: Subscription;
  subscriptShowSecBadge: Subscription;
  options: HeaderOptions;
  amountOption: OverAmountOptions;
  hasDialog = false;
  rightSecBtnClass: string = 'nav_right_second_button icon_bell';
  showRightSecBtn: boolean = true; // 顯示第二的right button
  showRightSecBadge: boolean = false; // 顯示第二的right button是否有未讀訊息
  rightSecBadge: number = 0;
  overHundred: boolean = false;

  @ViewChild('a11yBakBtn', { read: ElementRef }) private a11yBakBtn: ElementRef; // a11ynbakbtn

  constructor(
    public leftMenu: LeftMenuService,
    private zone: NgZone,
    private confirm: ConfirmService,
    private exitApp: ExitAppService,
    private auth: AuthService,
    private _render: Renderer2,
    private headerCtrl: HeaderCtrlService,
    private microInteraction: MicroInteractionService,
    private navgator: NavgatorService,
    private scan: QrcodeService,
    private slideCtrl: SlideCtrlService
  ) {
    this.options = new HeaderOptions();
    this.options.style = 'login';
    if (!environment.NATIVE) {
      this.options.style = 'normal';
    }
    this.options.leftBtnIcon = 'menu';
    this.leftBtnClick = this.toggleMenu;
    this.leftBtnClass = 'active';
    this.personalInfo = new PersonalInfo();
    this.setBodyClass(this.options.style);

    this.amountOption = new OverAmountOptions();
    this.amountOption.animate_flag = true;

    // 返回動作處理
    this._render.listen('document', 'backbutton', () => {
      this.onReturnBtn();
    });
    document.addEventListener('backbutton', function () { }, false);
  }

  leftBtnClick() {
    this.back();
    // 後續被subscribe複寫
  }
  rightBtnClick() {
    this.navgator.push('edit_mainBlock');
    // 後續被subscribe複寫
  }
 rightSecBtnClick() {
    this.showRightSecBadge = false;
    this.navgator.push('msg-overview');
  }

  ngOnInit() {
    this.subscriptionLeftBtnClickChange = this.headerCtrl.changeLeftBtnClick.subscribe((value: any) => {
      this.leftBtnClick = value;
    });
    this.subscriptionRightBtnClickChange = this.headerCtrl.changeRightBtnClick.subscribe((value: any) => {
      this.rightBtnClick = value;
    });
   this.subscriptShowSecBadge = this.headerCtrl.showRightSecBadgeSubject.subscribe((num) => {
      this.rightSecBadge = num > 99 ? 99 : num;
      this.overHundred = num > 99;
      if (num > 0) {
        this.showRightSecBadge = true;
      } else {
        this.showRightSecBadge = false;
      }
    })
    this.subscriptOption = this.headerCtrl.changeOption.subscribe((value: any) => {
      const defaultOptiong = new HeaderOptions();
      this.options = { ...defaultOptiong, ...value };
      this._modifyHeaderOptions(false);
      this.setBodyClass(this.options.style);
    });
    this.subscriptUpdateOption = this.headerCtrl.updateOptionSubject.subscribe((value: any) => {
      this.options = { ...this.options, ...value };
      this._modifyHeaderOptions(true);
      this.setBodyClass(this.options.style);
    });
    this.subscriptPersonalInfo = this.headerCtrl.changePersonalInfo.subscribe((value: PersonalInfo) => {
      this.personalInfo = value;
    });
    this.subscriptCloseMenu = this.headerCtrl.closeMenuSubject.subscribe(() => {
      this.leftMenu.close();
    });
    this.subscriptDisableNativeReturn = this.headerCtrl.disableNativeReturnSubject.subscribe((disable: boolean) => {
      this.disableNativeReturn = disable;
    });
    this.subscriptSwipeLeft = this.slideCtrl.swipeLeftSubject.pipe(debounceTime(100)).subscribe(() => {
      if (this.leftMenu.isOpened) {
        this.leftMenu.close();
      }
    });
    this.subscriptSwipeRight = this.slideCtrl.swipeRightSubject.pipe(debounceTime(100)).subscribe(() => {
      const path = this.navgator.getLastPath();
      if (path === 'user-home') {
        if (!this.leftMenu.isOpened) {
          this.leftMenu.open();
        }
      } else {
        this.onReturnBtn();
      }
    });

  }

  setBakFocuse(){
    setTimeout(
      () => {
        console.log('do on focus');
        this.a11yBakBtn.nativeElement.focus();
      },
      800
    );
  }

  getHeaderOption(){
    return this.options;
    
  }


  /**
   * Android返回鍵動作
   */
  onReturnBtn() {
    if (!!this.disableNativeReturn || !!sessionStorage.disableNativeReturn) {
      return;
    } else if (!!sessionStorage.microMenuOpened) {
      // 微交互選單開啟時只關閉微交互
      this.zone.run(() => {
        this.microInteraction.hideMicroMenu();
      });
      return;
    } else if (!!sessionStorage.scanCameraOn) {
      // 掃描相機開啟時只關掉相機
      this.navgator.displayScanBox(false);
      return;
    } else {
      this.zone.run(() => {
        const path = this.navgator.getLastPath();
        if (!path || path === '' || path === 'home') {
          if (!!this.hasDialog) {
            return;
          }
          this.hasDialog = true;
          this.confirm.show('POPUP.RETURN.EXIT_APP', { title: 'POPUP.RETURN.EXIT_APP_TITLE' }).then(() => {
            this.exitApp.exit();
            this.hasDialog = false;
          }).catch(() => this.hasDialog = false);
        } else if (path === 'user-home') {
          if (!!this.hasDialog) {
            return;
          }
          this.hasDialog = true;
          this.confirm.show('POPUP.RETURN.LOGOUT', { title: 'POPUP.RETURN.LOGOUT_TITLE' }).then(() => {
            this.auth.logout();
            this.hasDialog = false;
          }).catch(() => this.hasDialog = false);
        } else {
          this.leftBtnClick();
        }
      });
    }
  }

  setBodyClass(style: string) {
    if (style === 'normal') {
      this.headerCtrl.setBodyClass(['inner_page']);
    } else if (style === 'normal_a11y') {
      if (this.options.leftBtnIcon === 'menu') {
        this.leftBtnClass = 'active_a11y';
      } else if (this.options.leftBtnIcon === 'back') {
        this.leftBtnClass = 'back_button_a11y';
      }
      this.headerCtrl.setBodyClass(['inner_page_a11y']);
    } else if (style === 'user_home') {
      this.headerCtrl.setBodyClass(['inner_page', 'home_page']);
    } else if (style === 'login') {
      this.headerCtrl.setBodyClass(['initial_page']);
    } else if (style === 'result') {
      this.headerCtrl.setBodyClass(['inner_page']);
    }
    this.zone.run(() => { });
  }

  /**
   * 點選Menu按鈕
   */
  toggleMenu() {
    this.leftMenu.toggle();
  }

  /**
   * 返回動作
   */
  back() {
    if (!!this.options && !!this.options.backPath) {
      this.navgator.popTo(this.options.backPath);
    } else {
      this.navgator.pop();
    }
  }

  /**
   * 參數整理
   */
  private _modifyHeaderOptions(is_update: boolean) {
    // logger.log('header set', is_update, JSON.parse(JSON.stringify(this.options)));
    this.navgator.saveHeaderData(this.options);
    // 左側按鈕樣式
    if (this.options.leftBtnIcon === 'menu') {
      this.leftBtnClick = this.toggleMenu;
      this.leftBtnClass = 'active';
    } else if (this.options.leftBtnIcon === 'back') {
      this.leftBtnClick = this.back;
      this.leftBtnClass = 'back_button';
    }

    // 右側按鈕樣式
    let doEventCheck = (this.options.style !== 'normal_a11y') ? true : false;
    if (!!this.options.rightBtnIcon && !!doEventCheck) {
      let r_event_path: string;
      switch (this.options.rightBtnIcon) {
        case 'btn_info': // 系統資訊
          this.rightBtnClass = 'nav_right_button icon_desc_w';
          r_event_path = 'systemInfo';
          break;
        case 'btn_remind': // 鈴鐺
          this.rightBtnClass = 'nav_right_remind_button initPage';
          r_event_path = 'news';
          break;
        case 'nav_right_edit_button': // 編輯
          this.rightBtnClass = 'nav_right_edit_button';
          r_event_path = 'edit_mainBlock';
          break;
        case 'nav_right_gearwheel_button': // 齒輪
          this.rightBtnClass = 'nav_right_button icon_gearwheel';
          r_event_path = 'msg-overview-settings'; // 訊息總覽 - 推播設定
          break;
        default:
          this.rightBtnClass = 'nav_right_edit_button';
          r_event_path = 'edit_mainBlock';
          break;
      }
      this.headerCtrl.setRightBtnClick(() => {
        this.navgator.push(r_event_path);
      });
    }
    if (!!this.options.rightSecBtn && this.options.rightSecBtn == 'noshow') {
        this.showRightSecBtn = false;
      } else {
        this.showRightSecBtn = true;
      }
  }



}
