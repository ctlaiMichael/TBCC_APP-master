/**
 * [樣版] 選單
 */
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { SUB_MENU } from '@conf/menu/sub-menu';
import { FormateService } from '@shared/formate/formate.service';
import { SplashScreenService } from '@lib/plugins/splash-screen.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { SystemParameterService } from '@core/system/system-parameter/system-parameter.service';

@Component({
    selector: 'app-menu-temp',
    templateUrl: './menu-temp.component.html',
    styleUrls: [],
    providers: []
})
export class MenuTempComponent implements OnInit, OnChanges {
    /**
     * 參數處理
     */
    @Input() mainMenuKey: any;
    menuData = [];
    showData: boolean;
    showType = '1';

    constructor(
        private navgator: NavgatorService,
        private errorHandler: HandleErrorService,
        private _formateService: FormateService,
  		private splashScreen: SplashScreenService,
        private _localStorage: LocalStorageService,
        private _confirm: ConfirmService,
        private systemParameterService: SystemParameterService
    ) { }


    ngOnInit() {
    }

    ngOnChanges(changes) {
        this.menuData = this.getMenu();
    }


    /**
     * 選單事件
     * @param menu 選單
     */
    onGoEvent(menu) {
        if (typeof menu !== 'object' || !menu || !menu.hasOwnProperty('url')) {
            this.errorHandler.handleError({
                title: 'ERROR.TITLE',
                content: 'ERROR.DEFAULT'
            });
            return false;
        }
        if (menu.url === 'friendly') {
          this._confirm.show('您即將切換至友善行動網銀', {title: '提醒您'}).then(() => {
              this._localStorage.setObj('appMode', {isA11y: true, backNormal: false});
              window.location.reload();
            },
            () => {
              // 取消 Do nothing
            }
          );
        } else {
        this.navgator.push(menu.url);
    }
    }
    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------

    private getMenu() {
        let output: Array<any> = [];
        if (SUB_MENU.hasOwnProperty(this.mainMenuKey)) {
            const menuSet = this._formateService.transClone(SUB_MENU[this.mainMenuKey]);
            // 綜活轉綜定與中途解約根據參數檔判斷是否開起
            // let trnsSaveFlag = this.systemParameterService.get('NTD_CD_FLAG');
            // if (trnsSaveFlag != 'Y' && this.mainMenuKey == 'transfer') {
            //     menuSet.data = menuSet.data.filter(item => {
            //         return item.url != 'current-to-fixed' && item.url != 'fixed-release'
            //     });
            // }
            output = menuSet.data;
            this.showData = true;

            this.showType = (menuSet.hasOwnProperty('menuType')) ? menuSet['menuType'] : '1';
        } else {
            this.showData = false;
            this.errorHandler.handleError({
                type: 'message',
                title: 'ERROR.TITLE',
                content: 'ERROR.DEFAULT'
            });
        }
        return output;
    }

}
