/**
 * 停損獲利點通知
 *
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FI000605ApiService } from '@api/fi/fI000605/fi00605-api.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';


@Injectable()

export class IncomeNotifyService {
    /**
     * 參數處理
     */

    constructor(
        private _logger: Logger,
        private fi000605: FI000605ApiService
        , private confirm: ConfirmService
        , private navgator: NavgatorService
        , private _handleError: HandleErrorService
    ) {
    }

    /**
     * 檢查通知提示
     */
    checkNotify(hide?: boolean, background?: boolean): Promise<any> {
        let page = 1;
        const reqData = {};
        let hidePop = (!!hide) ? true : false;
        let do_background = (hidePop) ? false : true;
        if (typeof background != 'undefined') {
            do_background = background;
        }
        return this.getData(reqData, page, [], do_background).then(
            (result) => {
                if (hidePop) {
                    return Promise.resolve(result);
                } else if (!!result.status) {
                    // 有通知要顯示
                    return this.confirm.show(
                        // 您目前投資的標的，已達到設定的停損/停利點，若欲了解詳細投資狀況，請按下「前往查看」。
                        'PG_FUND.NOTIFY.NotifyPop.CONTENT'
                        , {
                            title: 'PG_FUND.NOTIFY.NotifyPop.TITLE', // 停損獲利點通知
                            btnYesTitle: 'PG_FUND.NOTIFY.NotifyPop.OK_BTN', // 前往查看
                            btnNoTitle: 'BTN.CANCEL'
                        }
                    ).then(
                        () => {
                            this.navgator.push('fund-income-notify');
                            return Promise.resolve(result);
                        },
                        () => {
                            return Promise.resolve(result);
                        }
                    );
                } else {
                    return Promise.resolve(result);
                }
            },
            (errorObj) => {
                errorObj['type'] = 'dialog';
                this._handleError.handleError(errorObj);
                return Promise.reject(errorObj);
            }
        );
    }

    /**
     * 取得通知
     * @param req
     * @param page
     * @param sort
     */
    getData(req: object, page?: number, sort?: Array<any>, background?: boolean): Promise<any> {
        return this.fi000605.getData(req, page, sort, background).then(
            (result) => {
                return Promise.resolve(result);
            },
            (failed) => {
                return Promise.reject(failed);
            }
        );
    }
}
