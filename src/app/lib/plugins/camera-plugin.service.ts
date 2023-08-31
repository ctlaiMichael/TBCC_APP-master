/**
 * 
 * [plugin]: cordova-plugin-camera
 * [version]: 1.0
};
 */
import { Injectable } from '@angular/core';
import { CordovaService } from '@base/cordova/cordova.service';
import { environment } from '@environments/environment';
import { logger } from '@shared/util/log-util';
import { FieldUtil } from '@shared/util/formate/modify/field-util';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { Base64FileUtil } from '@shared/util/formate/modify/base64-file-util';

declare var Camera: any;
declare var navigator: any;
declare let StatusBar: any;

@Injectable()
export class CameraPluginService extends CordovaService {
    private _logKey = 'Camera';

    constructor() {
        super();
    }

    /**
     * 相機開啟事件
     * @param returnSource [boolean]
     *          true 回傳native資訊
     *          false 回傳img base64(預設)
     * @returns imgUri (base64)
     */
    openCamera(returnSource?: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            let output: any = {
                status: false,
                msg: 'ERROR.CAMERA.ERROPEN', // 無法啟動相機
                data: '',
                imgUri: '',
                isCancel: false,
                error: null
            };

            let options = this.initOptions('camera');
            let callBackSuccessEvent = (imageUri) => {
                logger.step(this._logKey, imageUri);
                if (imageUri != '') {
                    output.status = true;
                    output.imgUri = imageUri;
                    if (!returnSource) {
                        output.data = Base64FileUtil.base64ToImage(imageUri);
                    } else {
                        // 指定不轉換
                        output.data = imageUri;
                    }
                    resolve(output);
                } else {
                    output.status = false;
                    output.msg = 'ERROR.CAMERA.ERR_IMG1'; // 無法取得圖片
                    reject(output);
                }
                this.afterPluginEnd();
            };
            let callBackErrorEvent = (err) => {
                logger.error(err);
                output.status = false;
                output.msg = 'ERROR.CAMERA.ERROPEN'; // 無法啟動相機
                output.error = err;
                // 判別使用者取消，不顯示錯誤訊息
                if (err === 'No Image Selected') {
                    output.msg = 'ERROR.CAMERA.NO_SELECT'; // 無選擇圖片
                    output.isCancel = true;
                }
                reject(output);
                this.afterPluginEnd();
            };
            // if (options.sourceType == ''
            //     || options.destinationType == ''
            //     || options.encodingType == ''
            //     || options.mediaType == ''
            // ) {
            //     output.status = false;
            //     output.msg = 'ERROR.CAMERA.ERRPARAMS'; // 無法取得設定資訊
            //     output.error = options;
            //     reject(output);
            //     return false;
            // }

            if (environment.NATIVE) {
                this.onDeviceReady
                .then(() => {
                    navigator.camera.getPicture(callBackSuccessEvent, callBackErrorEvent, options);
                });
            } else {
                // 範例圖片
                callBackSuccessEvent('/assets/images/banner.jpg');
                // base64圖片測試
                // callBackSuccessEvent('iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IArs4c6QAABNRJREFUWAnNV11oXEUUPnP3bnb3JjHtiijxh4pIrQ+CPwQUQRCE2jZsu5vGh8T8vlgE9Ult+6A+RaiK2gcVzC4bjWKb7BoTJf3BPhTxRRGkCI0QgsaStmmauDF3/+4cz5nNXW5ud5fdaJYOLLNz5jsz5545vwA3yRCV5GhKjOyS0topNQgCygJWaCjQe9qMdM+X47391EjjyqoVBpANNkZokALQ5/btD/x8UnRaNt2ebxAEEUUgGetBhKOAeL8NdM4awGGzY/BtJ83535+IPo0SzxCNoBuHELAIKI4Hfbe9c6m9fc3e3SAIf8lyKj8KgCEB4rzQxHHUPT8ZunbNZtByzbgYCtHXVR6tk5NG2rOi2yjTspoxa+2is/voI7tAwAWhae3pA/1zjCkKwprwj8eSIHA3fcbra+GBD4QQaB/0f87GWGyPBBxGAamAJtqWD/QvF1XHz8GaYCHMyOD7WyUEf9BaR/93QocIPf19aYnqiYsa8Y1HZ+j7F8xI/1NbKYRTs76x6DF6gVd0PXCX0gh7Bxsm20S9hGCBNB0+BATdsjJ7lSDsorzBhslzvYa5f+BP8qLLZJ87C4JwnKDh9I56CUPesET2EVSCFINVvW533kPhkZyXbLeKseNczH95ST7rEd4fVsM9V5wsgWS8DXSxYLb3/OGk8/9KfG5sQSMUtnmDg5UbwOuFJTgoERIW5t9075N9fY7Z/FE3ndeV+Bx4uhNRaYRzh4DM4fIRs5AzEEQxd9gH0ft6SLX0KzXK89loiq5DFMVnlSDrCaxs7rCZtmJOh/sopVA6rOZwj1/7Np+RxzQhvqoGb2M2y2fz1zT7x4ZnKUd9WhNTCXDBWEtsVEMKTI7cQ3ZzpwCcqQZfCVPV07gP8H8zci/kcm9hJreXDPV3/y1Nn5huUI3rzWnEsqhogKtURLx6t3HHo9ef6Vyp8d6bF67KgEKNiW3pSO+5eotqTMQfxrznqnoaLnQR82e5vKu3IFbOigJkj6zbiIqAmrPGLCUQ545AYvjJUntuWtPX0QeNiS9b3fQS6waO2DUZ65VrsFtKOM9xozkRv7XEoYrkSwy/mMvDLzJvvlQO46bX5L7B1sZTi5dWTyDKwSziwcB4dFSANu1BnLEEGhLgEUpgAyjhcbroNwDfR+4Ly62VINz8ILU8XPIT8O9y4PknOjlcPGckop9JxCOUkQ8BWIdUt2TnbQF58oCPDaPhtaU9XWXPsu+gCo1TfmpdI/ocQB4KfQf8ZYPKzdRqTNHeVONE/CHLko8hyAcANS/FlYsaeqfMju75dDlmB31bMrbNtLCV7GNOCcJt4GQitUhq7SPcWQe24t9/Qr2/EoB/mxomyi5i9Ohe77QyVtWLUhvIHRg3P5s6tUYmzlNUwQ/R00ynQs9fLHpNS7P+Lqn2AndggUScjW3LhkqW2dxJEkR6hf4yX6Qiq32jPxnbQc3zae7AaOs97ju45Lf3/+u8/cyJlrVUqps1wUJQHxVOhwe+53M3CMKElqnR7ZlMZggBBwmsq76DSn7q4G2/QC7v7MqKedyDw3YhYkKxtFTegUABDj38HKyJVLi3WD7cEEdW9nVdp4NfaJz44g3uwLj5IWmDVPGvC82JV8y6L3euVe4Q1o/OGpddVHkHGSbbhNur/gXCKfw9TaZEIgAAAABJRU5ErkJggg==');
                // 取消測試
                // callBackErrorEvent('No Image Selected');
                // 失敗測試
                // callBackErrorEvent('test error');

            }
        });
    }

    /**
     * 相簿開啟事件
     * @param returnSource [boolean]
     *          true 回傳native資訊
     *          false 回傳img base64(預設)
     * @returns imgUri (base64)
     */
    openPicFile(returnSource?: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            let output: any = {
                status: false,
                msg: 'ERROR.CAMERA.ERROPEN_PHOTO', // 無法啟動相簿
                data: '',
                imgUri: '',
                isCancel: false,
                error: null
            };

            let options = this.initOptions('photo');
            let callBackSuccessEvent = (imageUri) => {
                logger.step(this._logKey, imageUri);
                if (imageUri != '') {
                    output.status = true;
                    output.imgUri = imageUri;
                    if (!returnSource) {
                        output.data = Base64FileUtil.base64ToImage(imageUri);
                    } else {
                        // 指定不轉換
                        output.data = imageUri;
                    }
                    resolve(output);
                } else {
                    output.status = false;
                    output.msg = 'ERROR.CAMERA.ERR_IMG1'; // 無法取得圖片
                    reject(output);
                }
                this.afterPluginEnd();
            };
            let callBackErrorEvent = (err) => {
                logger.error(err);
                output.status = false;
                output.msg = 'ERROR.CAMERA.ERROPEN_PHOTO'; // 無法啟動相簿
                output.error = err;
                // 判別使用者取消，不顯示錯誤訊息
                if (err === 'No Image Selected') {
                    output.msg = 'ERROR.CAMERA.NO_SELECT'; // 無選擇圖片
                    output.isCancel = true;
                }
                reject(output);
                this.afterPluginEnd();
            };
            // if (options.sourceType == ''
            //     || options.destinationType == ''
            //     || options.encodingType == ''
            //     || options.mediaType == ''
            // ) {
            //     output.status = false;
            //     output.msg = 'ERROR.CAMERA.ERRPARAMS'; // 無法取得設定資訊
            //     output.error = options;
            //     reject(output);
            //     return false;
            // }

            if (environment.NATIVE) {
                this.onDeviceReady
                .then(() => {
                    navigator.camera.getPicture(callBackSuccessEvent, callBackErrorEvent, options);
                });
            } else {
                // 範例圖片
                //callBackSuccessEvent('/assets/images/banner.jpg');
                // base64圖片測試
                callBackSuccessEvent('iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IArs4c6QAABNRJREFUWAnNV11oXEUUPnP3bnb3JjHtiijxh4pIrQ+CPwQUQRCE2jZsu5vGh8T8vlgE9Ult+6A+RaiK2gcVzC4bjWKb7BoTJf3BPhTxRRGkCI0QgsaStmmauDF3/+4cz5nNXW5ud5fdaJYOLLNz5jsz5545vwA3yRCV5GhKjOyS0topNQgCygJWaCjQe9qMdM+X47391EjjyqoVBpANNkZokALQ5/btD/x8UnRaNt2ebxAEEUUgGetBhKOAeL8NdM4awGGzY/BtJ83535+IPo0SzxCNoBuHELAIKI4Hfbe9c6m9fc3e3SAIf8lyKj8KgCEB4rzQxHHUPT8ZunbNZtByzbgYCtHXVR6tk5NG2rOi2yjTspoxa+2is/voI7tAwAWhae3pA/1zjCkKwprwj8eSIHA3fcbra+GBD4QQaB/0f87GWGyPBBxGAamAJtqWD/QvF1XHz8GaYCHMyOD7WyUEf9BaR/93QocIPf19aYnqiYsa8Y1HZ+j7F8xI/1NbKYRTs76x6DF6gVd0PXCX0gh7Bxsm20S9hGCBNB0+BATdsjJ7lSDsorzBhslzvYa5f+BP8qLLZJ87C4JwnKDh9I56CUPesET2EVSCFINVvW533kPhkZyXbLeKseNczH95ST7rEd4fVsM9V5wsgWS8DXSxYLb3/OGk8/9KfG5sQSMUtnmDg5UbwOuFJTgoERIW5t9075N9fY7Z/FE3ndeV+Bx4uhNRaYRzh4DM4fIRs5AzEEQxd9gH0ft6SLX0KzXK89loiq5DFMVnlSDrCaxs7rCZtmJOh/sopVA6rOZwj1/7Np+RxzQhvqoGb2M2y2fz1zT7x4ZnKUd9WhNTCXDBWEtsVEMKTI7cQ3ZzpwCcqQZfCVPV07gP8H8zci/kcm9hJreXDPV3/y1Nn5huUI3rzWnEsqhogKtURLx6t3HHo9ef6Vyp8d6bF67KgEKNiW3pSO+5eotqTMQfxrznqnoaLnQR82e5vKu3IFbOigJkj6zbiIqAmrPGLCUQ545AYvjJUntuWtPX0QeNiS9b3fQS6waO2DUZ65VrsFtKOM9xozkRv7XEoYrkSwy/mMvDLzJvvlQO46bX5L7B1sZTi5dWTyDKwSziwcB4dFSANu1BnLEEGhLgEUpgAyjhcbroNwDfR+4Ly62VINz8ILU8XPIT8O9y4PknOjlcPGckop9JxCOUkQ8BWIdUt2TnbQF58oCPDaPhtaU9XWXPsu+gCo1TfmpdI/ocQB4KfQf8ZYPKzdRqTNHeVONE/CHLko8hyAcANS/FlYsaeqfMju75dDlmB31bMrbNtLCV7GNOCcJt4GQitUhq7SPcWQe24t9/Qr2/EoB/mxomyi5i9Ohe77QyVtWLUhvIHRg3P5s6tUYmzlNUwQ/R00ynQs9fLHpNS7P+Lqn2AndggUScjW3LhkqW2dxJEkR6hf4yX6Qiq32jPxnbQc3zae7AaOs97ju45Lf3/+u8/cyJlrVUqps1wUJQHxVOhwe+53M3CMKElqnR7ZlMZggBBwmsq76DSn7q4G2/QC7v7MqKedyDw3YhYkKxtFTegUABDj38HKyJVLi3WD7cEEdW9nVdp4NfaJz44g3uwLj5IWmDVPGvC82JV8y6L3euVe4Q1o/OGpddVHkHGSbbhNur/gXCKfw9TaZEIgAAAABJRU5ErkJggg==');
                // 取消測試
                // callBackErrorEvent('No Image Selected');
                // 失敗測試
                // callBackErrorEvent('test error');

            }
        });
    }

    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__| PART_BOX: private
    // --------------------------------------------------------------------------------------------


    /**
     * 相機初始化事件
     */
    private initOptions(srcType: string) {
        let destinationType: any;
        let encodingType: any;
        let mediaType: any;
        let sourceType: any;

        if (environment.NATIVE) {
            if (typeof Camera == 'object' && !!Camera) {
                destinationType = Camera.DestinationType.DATA_URL;
                encodingType = Camera.EncodingType.JPEG;
                mediaType = Camera.MediaType.PICTURE;
                // destinationType = ObjectCheckUtil.checkObjectList(Camera, 'DestinationType.DATA_URL');
                // encodingType = ObjectCheckUtil.checkObjectList(Camera, 'EncodingType.JPEG');
                // mediaType = ObjectCheckUtil.checkObjectList(Camera, 'MediaType.PICTURE');

                if (srcType == 'photo') {
                    // 相簿
                    sourceType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
                    // sourceType = ObjectCheckUtil.checkObjectList(Camera, 'PictureSourceType.SAVEDPHOTOALBUM');
                } else {
                    // 相機
                    sourceType = Camera.PictureSourceType.CAMERA;
                    // sourceType = ObjectCheckUtil.checkObjectList(Camera, 'PictureSourceType.CAMERA');
                }
            }
        } else {
            // for develop
            destinationType = '0';
            encodingType = '0';
            mediaType = '0';
            sourceType = srcType;
        }
        if (!destinationType && destinationType != '0') {
            logger.step(this._logKey, 'miss option: destinationType', destinationType);
            destinationType = '';
        }
        if (!encodingType && encodingType != '0') {
            logger.step(this._logKey, 'miss option: encodingType', encodingType);
            encodingType = '';
        }
        if (!mediaType && mediaType != '0') {
            logger.step(this._logKey, 'miss option: mediaType', mediaType);
            mediaType = '';
        }
        if (!sourceType && sourceType != '0') {
            logger.step(this._logKey, 'miss option: sourceType/srcType', sourceType, srcType);
            sourceType = '';
        }

        let options = {
            // Some common settings are 20, 50, and 100
            quality: 50,
            destinationType: destinationType,
            // In this app, dynamically set the picture source, Camera or photo gallery
            sourceType: sourceType,
            encodingType: encodingType,
            mediaType: mediaType,
            allowEdit: false,
            correctOrientation: false,  //Corrects Android orientation quirks
            targetHeight: 2048,
            targetWidth: 2048
        };

        logger.log('camera plugin options', options);
        return options;
    }

    /**
     * 關閉plugin後事件
     */
    private afterPluginEnd() {
        return new Promise((resolve, reject) => {
            if (environment.NATIVE) {
                // 目前iphoneX以上手機stepbar返回相機會發生異常，暫時處理
                if (typeof StatusBar == 'object'
                    && typeof StatusBar.hide == 'function'
                    && typeof StatusBar.show == 'function'
                ) {
                    StatusBar.hide();
                    StatusBar.show();
                    resolve();
                } else {
                    reject('Miss Method');
                }
            } else {
                resolve();
            }
        });
    }

}
