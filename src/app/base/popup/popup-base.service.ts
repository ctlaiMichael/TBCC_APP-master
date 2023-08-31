import { Injectable, Component, ComponentRef } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { PopupOverlayRef } from '@base/popup/popup-overlay-ref';
import { DialogConfig } from './dialog-config';
import { TranslateService } from '@ngx-translate/core/src/translate.service';
import { MicroInteractionService } from '@core/layout/micro-interaction.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { DomUtil } from '@shared/util/dom-util';
import { Subscription } from 'rxjs/Subscription';

const DEFAULT_CONFIG: DialogConfig = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
  panelClass: 'popup_content'
};

@Injectable()
export class PopupBaseService<C> {

  overlayRef: OverlayRef[];
  componentRef: ComponentRef<C>[];
  subscriptionClosePopup: Subscription;
  constructor(
    protected overlay: Overlay,
    protected translate: TranslateService,
    private headerCtrl: HeaderCtrlService,
    private microInteraction: MicroInteractionService
  ) {
    this.componentRef = [];
    this.overlayRef = [];
    this.init();
    this.subscriptionClosePopup = this.headerCtrl.closePopupSubject.subscribe(() => {
      this.closeAllPopup();
    });
  }

  // 提供自類別初始化用
  protected init(): void { }

  public isOpened(): boolean {
    return this.componentRef.length > 0;
  }

  public destroy = () => {
    this.componentRef.pop().destroy();
    this.overlayRef.pop().dispose();
    this.microInteraction.hideMicroBox(false); // 微交互開啟
    this.headerCtrl.disableNativeReturn(false); // 啟用實體返回
    // 重設捲動
    if (!DomUtil.isInitialPage()) {
      const sections = document.getElementsByTagName('section');
      for (let i = 0; i < sections.length; i++) {
        sections[i].style.overflowY = 'auto';
      }
    }
    // 2019/08/26 因IOS鍵盤開啟狀時觸發POPUP畫面會破版增加
    document.documentElement.style.top = '0px';
  }

  private closeAllPopup() {
    const len = this.componentRef.length;
    for (let i = 0; i < len; i++) {
      this.destroy();
    }
  }

  protected createComponent(component: ComponentType<C>, config: DialogConfig = {}): any {
    // Override default configuration
    const dialogConfig = { ...DEFAULT_CONFIG, ...config };
    // Returns an OverlayRef which is a PortalHost
    const localOverlayRef = this.createOverlay(dialogConfig);
    this.overlayRef.push(localOverlayRef);

    // Instantiate remote control
    const dialogRef = new PopupOverlayRef(localOverlayRef);

    // this.overlayRef.backdropClick().subscribe(_ => dialogRef.close());
    // Create ComponentPortal that can be attached to a PortalHost
    const componentPortal = new ComponentPortal(component);

    // Attach ComponentPortal to PortalHost
    const componentRef = localOverlayRef.attach(componentPortal);
    // 2019/08/26 因IOS鍵盤開啟狀時觸發POPUP畫面會破版增加
    document.documentElement.style.top = '0px';
    this.componentRef.push(componentRef);
    this.microInteraction.hideMicroBox(true); // 微交互隱藏
    this.headerCtrl.disableNativeReturn(true); // 禁用實體返回
    return componentRef.instance;
  }

  /**
   * 建立Overlay
   * @param config 自定設定
   */
  private createOverlay(config: DialogConfig) {
    const overlayConfig = this.getOverlayConfig(config);
    // 關閉捲動
    const sections = document.getElementsByTagName('section');
    for (let i = 0; i < sections.length; i++) {
      sections[i].style.overflowY = 'hidden';
    }
    return this.overlay.create(overlayConfig);
  }

  /**
   * 依設定轉換為OverlayConfig
   * @param config 自定設定
   */
  private getOverlayConfig(config: DialogConfig): OverlayConfig {
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();
    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });

    return overlayConfig;
  }

}
