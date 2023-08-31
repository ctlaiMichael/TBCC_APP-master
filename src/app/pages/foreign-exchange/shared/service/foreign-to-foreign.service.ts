/**
 * 外幣轉外幣
 *
 */
import { Injectable } from '@angular/core';
import { F5000101ApiService } from '@api/f5/f5000101/f5000101-api.service';
import { F5000102ApiService } from '@api/f5/f5000102/f5000102-api.service';
import { F5000104ApiService } from '@api/f5/f5000104/f5000104-api.service';
import { InfomationService } from '@shared/popup/infomation/infomation.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ForexToForexInfo } from '@conf/terms/forex/forex-to-forex-info';
import { F5000102ReqBody } from '@api/f5/f5000102/f5000102-req';
@Injectable()

export class ForeignToForeignService {
    /**
     * 參數處理
     */

    constructor(
        private f5000101: F5000101ApiService,
        private f5000102: F5000102ApiService,
        private f5000104: F5000104ApiService,
        private _infoService: InfomationService,
        private navgator: NavgatorService
    ) {
    }
    showInfo() {
        const info = new ForexToForexInfo();
        this._infoService.show(info)
            .then(
                () => {
                    // close
                },
                () => {
                    // 更多內容
                    if (typeof info.linkList['more'] !== 'undefined') {
                        this.navgator.push(info.linkList['more']);
                    }
                }
            );
    }

    /**
     *
     * @param page 查詢頁數
     * @param sort 排序 ['排序欄位', 'ASC|DESC']
     */
    getData(type, searchAccount?: string): Promise<any> {

        return this.f5000101.getData(type).then(
            (sucess) => {
                // let output = this.midfyDefaultAccount(sucess, searchAccount);
                return Promise.resolve(sucess);
            },
            (failed) => {
                return Promise.reject(failed);
            }
        );
    }
    getRate(reqObj): Promise<any> {
        let data = new F5000102ReqBody();
        if (reqObj.hasOwnProperty('trnsfrOutCurr') && reqObj.hasOwnProperty('trnsfrOutAmount') &&
            reqObj.hasOwnProperty('trnsfrInCurr') && reqObj.hasOwnProperty('trnsfrInAmount')) {
            data.custId = '';
            data.trnsfrOutCurr = reqObj.trnsfrOutCurr;
            data.trnsfrOutAmount = reqObj.trnsfrOutAmount;
            data.trnsfrInCurr = reqObj.trnsfrInCurr;
            data.trnsfrInAmount = reqObj.trnsfrInAmount
        }
        return this.f5000102.getData(data).then(
            (output) => {
                return Promise.resolve(output);
            },
            (error_obj) => {
                return Promise.reject(error_obj);
            }
        );
    }
    getResult(reqObj: object, securityResult: any): Promise<any> {

        let reqHeader = {
            header: securityResult.headerObj
        };
        return this.f5000104.getData(reqObj, reqHeader).then(

            (output) => {
                return Promise.resolve(output);
            },
            (error_obj) => {
                return Promise.reject(error_obj);
            }
        );
    }
}




  // --------------------------------------------------------------------------------------------
  //  ____       _            _         _____                 _
  //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
  //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
  //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
  //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
  // --------------------------------------------------------------------------------------------




