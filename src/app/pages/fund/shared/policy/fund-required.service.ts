/**
 * 基金權限控制
 * 1. 檢查是否中台開起強制基金關閉功能，有則顯示訊息，禁止進入基金功能
 * 2. 檢查是否有換約，
 *      有: 則引導進入換約流程
 *      無: 繼續流程
 *      不存在: 無信託帳號整個基金功能不提供使用
 */
import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Logger } from '@core/system/logger/logger.service';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';
import { CacheService } from '@core/system/cache/cache.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FI000401ApiService } from '@api/fi/fI000401/fI000401-api.service';

@Injectable()
export class FundRequired implements CanActivate {

  constructor(
    private _logger: Logger,
    private router: Router
    , private _authService: AuthService
    , private _formateService: FormateService
    , private _cacheService: CacheService
    , private errorHandler: HandleErrorService
    , private _fi000401Service: FI000401ApiService
    , private navgator: NavgatorService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const url: string = state.url;
    return this.checkCanUse(url, route).then(
      (haveDoAgree) => {
        return Promise.resolve(haveDoAgree);
      },
      (errorObj) => {
        return Promise.resolve(false);
      }
    ).catch((errorCatch) => {
      return Promise.resolve(false);
    });
  }

  /**
   * 檢查是否要換約
   * @param url
   * @param route
   *  1. 若為menu選單(因換約目前再menu選單)，且為換約頁面，強制忽略不檢查!!!! (避免無窮迴圈)
   *  2. 若為menu選單(因換約目前再menu選單)，且使用者狀態為不同意，不強制顯示 => 針對menu選單處理
   */
  checkCanUse(url: string, route): Promise<any> {
    let ignorCheck = true;
    if (!!route.data && !!route.data['checkPolicy']) {
      // 指定功能強制檢查
      ignorCheck = false;
    }
    const check_str = (url.search(/^\/fund\/menu/) > -1) ? true : false;
    let is_do_policy = (this._formateService.checkObjectList(route, 'queryParams.policy') == '1') ? true : false;
    let fundAgreeFlag = this._authService.getTmpInfo('fundAgreeFlag', 'string');
    if (check_str) {
      // 選單頁特規
      // this._logger.step('FUND', 'fundAgreeFlag', fundAgreeFlag);
      if (is_do_policy) {
        // 已強制引導使用者做換約功能，不在重做(避免無窮迴圈)
        ignorCheck = true;
      } else if (!is_do_policy && (url.search(/^\/fund\/menu\?policy=1/) > -1)) {
        // 已強制引導使用者做換約功能，不在重做(避免無窮迴圈) => 另一種判斷方式，避免不正確miss
        ignorCheck = true;
      } else if (!is_do_policy && fundAgreeFlag == '0') {
        // 已查過換約的資訊不重做(使用者未同意，重新登入或典籍需要換約的功能才會顯示)
        ignorCheck = true;
      }
    }

    // 無基金信託帳號，不允許使用基金功能
    let fundAllowFlag = this._authService.getTmpInfo('fundAllow', 'string');
    if (fundAllowFlag === 'N') {
      const now_allow_msg = this.showNotAllowMsg();
      this.errorHandler.handleError(now_allow_msg);
      return Promise.resolve(false);
    }

    if (ignorCheck) {
      // 如果已檢查情況，不執行
      this._logger.step('FUND', 'FundRequired ignor check', url, route);
      return Promise.resolve(true);
    }
    return this.checkNewAgreement().then(
      (haveDoAgree) => {
        if (haveDoAgree) {
          return Promise.resolve(true);
        } else {
          let getargs=this.navgator.getParams();

          if (typeof getargs == 'object' && getargs != null) {
            this.navgator.push('fund-policy', getargs);
            // this.router.navigate(['fund-policy'], { queryParams: getargs });
          }else{
            this.navgator.push('fund-policy');
          }
          return Promise.resolve(false);
        }
      },
      (errorObj) => {
        if (errorObj.resultCode == 'ERR1C119') {
          this.navgator.push('fund-network');
        } else {
          this.errorHandler.handleError(errorObj);
        }
        return Promise.resolve(false);
      }
    );
  }


  /**
   * 同意條款 - 首次申請發送FI000401
   *  trnsType 4: 新約簽訂註記查詢
   */
  async checkNewAgreement(): Promise<any> {
    try {
      this._logger.log('1. init checkNewAgree');
      let agreeData = await this.getAgreeNew();
      this._logger.log('2. get fundAgreeFlag');
      let fundAgreeFlag = this._authService.getTmpInfo('fundAgreeFlag');
      let haveDoAgree = (fundAgreeFlag == '1') ? true : false;
      if (!!agreeData.stopFund) {
        // 中台強制關閉基金功能
        let error_msg = agreeData.msg;
        return Promise.reject({
          type: 'message',
          title: 'FUNC.FUND',
          content: error_msg
        });
      }
      const fundAllowStr = (!!agreeData.noFund) ? 'N' : 'Y';
      this._authService.updateTmpInfo({ fundAllow: fundAllowStr });
      if (!!agreeData.noFund) {
        // 使用者未開通基金下單功能
        const now_allow_msg = this.showNotAllowMsg();
        return Promise.reject(now_allow_msg);
      }
      if (!!agreeData.agreeFlag) {
        fundAgreeFlag = '1';
        this._authService.updateTmpInfo({ fundAgreeFlag: '1' });
        haveDoAgree = true;
      }
      // 需要顯示換約頁面
      return Promise.resolve(haveDoAgree);
    } catch (errorObj) {
      // 換約都取不到，視同基金功能禁止使用
      this._logger.error(errorObj);
      errorObj['type'] = 'message';
      return Promise.reject(errorObj);
    }
  }


  /**
   * 取得換約條款註記狀態 & 基金主機狀態
   */
  private getAgreeNew(): Promise<any> {
    let cache_key = 'fund-newAgrCD';
    let cache_data = this._cacheService.checkCacheData(cache_key);
    if (!!cache_data) {
      if (cache_data.stopFund) {
        this._cacheService.remove(cache_key);
      } else {
        // 非停機才繼續處理，若cache為停機資訊，強制重取資料
        return Promise.resolve(cache_data);
      }
    }
    this._logger.log('1.2 ready to get fi401');
    return this._fi000401Service.getAgreeNew().then((resObj) => {
      const cache_option = this._cacheService.getCacheSet(cache_key);
      this._cacheService.save(cache_key, resObj, cache_option);
      return Promise.resolve(resObj);
    });
  }

  /**
   * 顯示無信託帳號權限訊息
   */
  private showNotAllowMsg() {
    let output = {
      type: 'message',
      classType: 'warning',
      title: 'FUNC.FUND',
      content: 'PG_FUND.ERROR.NO_FUND'
    };
    return output;
  }


}
