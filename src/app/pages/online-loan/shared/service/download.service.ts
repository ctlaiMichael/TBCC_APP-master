/**
 *簽約對保
 */
import { Injectable, OnInit } from "@angular/core";
import { Logger } from '@core/system/logger/logger.service';
import { F9000501ApiService } from "@api/f9/f9000501/f9000501-api.service";
import { F9000503ApiService } from "@api/f9/f9000503/f9000503-api.service";
import { FormateService } from "@shared/formate/formate.service";
import { Base64FileUtil } from "@shared/util/formate/modify/base64-file-util";

@Injectable()

export class DownloadService {

    constructor(
        private _logger: Logger,
        private f9000501: F9000501ApiService,
        private f9000503: F9000503ApiService
        , private _formateService: FormateService
    ) { }

    //查詢案件進度
    public getQuery(req: any, page?: number, option?: Object): Promise<any> {
        return this.f9000501.getData(req, page).then(
            (success) => {
                this._logger.log("success:", success);
                return Promise.resolve(success);
            },
            (failed) => {
                this._logger.log("failed:", failed);
                return Promise.reject(failed);
            }
        );
    }

    //約據下載
    public getDownload(req): Promise<any> {
        return this.f9000503.getData(req).then(
            (result) => {
                let ebkCaseNo = this._formateService.checkField(req, 'ebkCaseNo');
                if (!ebkCaseNo || ebkCaseNo == '') {
                    ebkCaseNo = 'download';
                }
                this._logger.log("result:", result);
                let output: any = {
                    status: false,
                    data: result,
                    base64Str: '',
                    pdfset: {
                        message: ebkCaseNo,
                        subject: ebkCaseNo
                    }
                };
                // let base64Data = this._formateService.checkField(result, 'blobData');
                
                if (!!result.blobData) {
                    let base64Data = result.blobData;
                    this._logger.log("base64Data:", base64Data);
                    output.base64Str = Base64FileUtil.base64ToPDF(base64Data);
                    // this.navgator.openPDF(base64Str);
                    // this._share.shareFile({
                    //     message: 'test',
                    //     subject: 'testdata.pdf'
                    // }, base64Str).then(() => {
                    //     this._logger.log("share success");
                    // }, () => {
                    //     this._logger.log("share error");
    
                    // });
                    output.status = true;
                    return Promise.resolve(output);
                } else {
                    return Promise.reject({
                        type: 'alert',
                        title: 'ERROR.INFO_TITLE',
                        content: 'PDF下載失敗'
                    });
                }
            },
            (failed) => {
                this._logger.log("failed:", failed);
                return Promise.reject(failed);
            }
        );
    }
}