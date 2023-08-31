/**
 * 額度調整
 *
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FC001006ApiService } from '@api/fc/fc001006/fc001006-api.service';
import { FC001005ApiService } from '@api/fc/fc001005/fc001005-api.service';


@Injectable()

export class CardMainUploadService {
  /**
   * 參數處理
   */
  loadStatus = '';

  constructor(
    private _logger: Logger
    , private fc001006: FC001006ApiService
    , private fc001005: FC001005ApiService
  ) {
  }



  /**
   * 額度調整進件狀態查詢
   */
  getQuery(set_data?: Object): Promise<any> {
    return this.fc001006.getData(set_data).then(
      (success) => {
        this._logger.log("fc001006 success:", success);
        return Promise.resolve(success);
      },
      (failed) => {
        this._logger.log("fc001006 failed:", failed);
        return Promise.reject(failed);
      }
    );
  }

      //證明文件上傳(含往來分行設定)
      public sendUpLoad(req): Promise<any> {
        this._logger.log("into sendUpLoad");
        return this.fc001005.getData(req).then(
            (success) => {
                this._logger.log("105 success:", success);
                return Promise.resolve(success);
            },
            (failed) => {
                this._logger.log("105 failed:", failed);
                return Promise.reject(failed);
            }
        );
    }

  // --------------------------------------------------------------------------------------------
  //  ____       _            _         _____                 _
  //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
  //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
  //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
  //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
  // --------------------------------------------------------------------------------------------

}
