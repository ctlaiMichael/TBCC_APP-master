/**
 * 社群分享
 * [plugin]: cordova-plugin-x-socialsharing
 * [version]: 5.4.1
};
 */
import { Injectable } from '@angular/core';
import { CordovaService } from '@base/cordova/cordova.service';
import { environment } from '@environments/environment';
import { SocialsharingOption, SocialsharingImgTxtOption } from './socialsharing-option';
import { FieldUtil } from '@shared/util/formate/modify/field-util';
import { logger } from '@shared/util/log-util';

declare var plugins: any;

@Injectable()
export class SocialsharingPluginService extends CordovaService {

    constructor() {
        super();
    }

    /**
     * 純文字分享
     * @param set_data 設定參數
     *       message: '分享的訊息',
     *       subject: '分享的標題(email)',
     *       url: '分享的連結'
     */
    shareMsg(set_data): Promise<any> {
        let option = new SocialsharingOption();
        option.subject = FieldUtil.checkField(set_data, 'subject');
        option.message = FieldUtil.checkField(set_data, 'message');
        option.url = FieldUtil.checkField(set_data, 'url');
        option.files = [];
        return this.share(option);
    }

    /**
     *  圖片分享
     * @param set_data 
     * @param img_path 
     * @param img_txt_set 
     */
    shareImg(set_data, img_path: string, img_txt_set?: SocialsharingImgTxtOption): Promise<any> {
        if (img_path === '') {
            // 無圖片走純文字
            return this.shareMsg(set_data);
        }
        let option = new SocialsharingOption();
        option.message = FieldUtil.checkField(set_data, 'message');
        option.subject = FieldUtil.checkField(set_data, 'subject');
        option.url = FieldUtil.checkField(set_data, 'url');

        return new Promise((resolve, reject) => {
            let imageObj = new Image();
            imageObj.onload = () => {
                let canvas1 = document.createElement('canvas');
                canvas1.width = imageObj.width;
                canvas1.height = imageObj.height;
                canvas1.getContext('2d').drawImage(imageObj, 0, 0);

                const img_txt = this.modifyImgTxt(img_txt_set);
                // 增加文字在圖片上
                if (img_txt) {
                    let str = img_txt.content;
                    let initX = img_txt.initX;
                    let initY = img_txt.initY;
                    let lineHeight = img_txt.lineHeight;
                    let lineWidth = img_txt.lineWidth;
                    let ctx = canvas1.getContext('2d');
                    ctx.font = img_txt.font;
                    let canvasWidth = canvas1.width;
                    let lastSubStrIndex = 0;
                    let check_length = str.length - 1;
                    for (let i = 0; i < str.length; i++) {
                        lineWidth += ctx.measureText(str[i]).width;
                        if (lineWidth > canvasWidth - initX - 35) {
                            // 减去initX,防止边界出现的问题
                            ctx.fillText(str.substring(lastSubStrIndex, i), initX, initY);
                            initY += lineHeight;
                            lineWidth = 0;
                            lastSubStrIndex = i;
                        }
                        if (i == check_length) {
                            ctx.fillText(str.substring(lastSubStrIndex, i + 1), initX, initY);
                        }
                    }
                }

                let base64text = canvas1.toDataURL('image/png');
                // 把base64text資料放進要傳送object的files files需為array
                option.files = [base64text];

                this.share(option).then(
                    (res) => {
                        resolve(res);
                    },
                    (err) => {
                        reject(err);
                    }
                );
            };
            imageObj.src = img_path;
        });
    }


    /**
     *  檔案分享
     * @param set_data 
     * @param base64text
     */
    shareFile(set_data, base64text: string): Promise<any> {
        if (base64text === '') {
            // 無圖片走純文字
            return this.shareMsg(set_data);
        }
        let option = new SocialsharingOption();
        option.message = FieldUtil.checkField(set_data, 'message');
        option.subject = FieldUtil.checkField(set_data, 'subject');
        option.url = FieldUtil.checkField(set_data, 'url');

        return new Promise((resolve, reject) => {
            // 把base64text資料放進要傳送object的files files需為array
            option.files = [base64text];
            this.share(option).then(
                (res) => {
                    resolve(res);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    }

    /**
     * 社群分享
     * @param option 分享內容
     */
    share(set_data: SocialsharingOption): Promise<any> {
        logger.error('socialSharing-plugin line113',set_data);
        let option: any = {
            message: '',
            subject: ''
            // , url: ''
            // , files: []
            // , chooserTitle: ''
            // , appPackageName: ''
        };
        // 參數整理
        option.message = FieldUtil.checkField(set_data, 'message');
        option.subject = FieldUtil.checkField(set_data, 'subject');
        // option.url = FieldUtil.checkField(set_data, 'url');
        if (set_data.files.length > 0) {
            option.files = set_data.files;
        }
        const chooserTitle = FieldUtil.checkField(set_data, 'chooserTitle');
        if (chooserTitle !== '') {
            option.chooserTitle = chooserTitle;
        }
        // option.chooserTitle = FieldUtil.checkField(set_data, 'chooserTitle'); // android only
        // option.appPackageName = FieldUtil.checkField(set_data, 'appPackageName'); // android only


        if (environment.NATIVE) {
            return this.onDeviceReady
                .then(() => {
                    const successEvent = (result) => {
                        return Promise.resolve(result);
                    };
                    const errorEvent = (result) => {
                        return Promise.reject(result);
                    };
                    if (typeof plugins.socialsharing === 'undefined' || !plugins.socialsharing) {
                        return Promise.reject('Miss Plugin');
                    }
                    plugins.socialsharing.shareWithOptions(option, successEvent, errorEvent);
                });
        } else {
            return Promise.resolve({
                completed: '',
                app: ''
            });
            // return Promise.reject('Demo error open');
        }
    }

    /**
     * 整理圖片文字
     * @param set_data 
     */
    private modifyImgTxt(set_data: SocialsharingImgTxtOption) {
        let img_txt = FieldUtil.checkField(set_data, 'content');
        if (img_txt === '') {
            return false;
        }
        let output = {
            content: img_txt,
            initX: 0,
            initY: 0,
            lineWidth: 0,
            lineHeight: 0,
            font: ''
        };
        if (set_data.x || set_data.x == 0) {
            output.initX = set_data.x;
        }
        if (set_data.y || set_data.y == 0) {
            output.initY = set_data.y;
        }
        if (set_data.width || set_data.width == 0) {
            output.lineWidth = set_data.width;
        }
        if (set_data.height || set_data.height == 0) {
            output.lineHeight = set_data.height;
        }
        output.font = FieldUtil.checkField(set_data, 'font');

        return output;
    }

}
