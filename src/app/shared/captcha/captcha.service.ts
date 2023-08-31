
/**
 * GOTP
 * 產生: captchaCreateCode()
 * 檢查: checkCaptchaVal(使用者輸入的資料)
 */
import { Injectable } from '@angular/core';

@Injectable()
export class CaptchaService {
    /**
	 * [圖形驗證碼service]
	 *
	 */
    vaildCode: any = '';

    constructor(

    ) {

    }


    private initEvent() {

    }


    /**
     * 產生圖形驗證碼
     * @param checkCode canvas obj
     * @param len 驗證碼長度
     * @param fontColor 驗證碼文字顏色( Y=>彩色 , 其他值=>黑色)
     * @param noiseColor 雜訊顏色( Y=>彩色 , 其他值=>黑色)
     * @param noiseRate 雜訊百分比(越大雜訊越多)
     */
    captchaCreateCode(checkCode, len?: any, fontColor?: any, noiseColor?: any, noiseRate?: any) {
        // ==預設變數處理== //
        if (typeof len === 'undefined') {
            len = 5;
        }
        if (typeof fontColor === 'undefined') {
            fontColor = 'Y';
        }
        if (typeof noiseColor === 'undefined') {
            noiseColor = 'Y';
        }
        if (typeof noiseRate === 'undefined') {
            noiseRate = 0.07;
        }
        if (typeof checkCode !== 'object' || checkCode.length < 1) {
            return false;
        }
        let bgcolor = '#FFF'; // 背景色
        let codeLength = len; // 驗證碼的長度
        // let checkCode = document.getElementById("checkCode");
        let canvasW = checkCode.width;
        let canvasH = checkCode.height;
        let canvasLR_padding = 10;
        if (checkCode.getContext) {
            let ctx = checkCode.getContext('2d');
            ctx.fillStyle = bgcolor; // 背景色
            ctx.fillRect(0, 0, canvasW, canvasH); // 繪製矩形(X,Y,W,H)
            ctx.save();

            let wordObj = this.getCaptchaVal(codeLength, fontColor, bgcolor);

            let range = Math.floor(canvasW / codeLength);
            let wordRange, wordHeight, piusOrMinus, frontsize;
            let i = 0;
            let ck: any;
            for (ck in wordObj) {
                if (!wordObj.hasOwnProperty(ck)) {
                    continue;
                }
                i++;
                wordRange = Math.floor((range / 2) + (range / 4)) + 1;
                wordHeight = Math.floor((canvasH / 2) + (canvasH / 4));
                if (checkCode) {
                    // 隨機正負值
                    piusOrMinus = (Math.random() > 0.5 ? 1 : -1);
                    // 字體隨機加大or縮小0~10
                    frontsize = Math.floor((Math.random() * 10) + 20);
                    ctx.fillStyle = wordObj[ck]['color']; // 字的顏色
                    ctx.font = frontsize + 'px sans-serif'; // 字體大小
                    ctx.save();
                    // 隨機旋轉正負0~5度
                    ctx.rotate(piusOrMinus * (Math.PI / 180) * (Math.random() * 5));
                    // 填滿字串(str,X軸位置,Y軸位置)
                    ctx.fillText(wordObj[ck]['code'], (wordRange * i), wordHeight);
                    ctx.restore();
                }
            }
            this.createNoise(ctx, canvasW, canvasH, noiseRate, noiseColor);
            return true;
        }
    }

	/**
	 * [checkCaptchaVal 驗證圖形驗證碼]
	 * @param  {[type]} captchCode [description]
	 * @return {[type]}            [description]
	 */
    checkCaptchaVal(captchCode) {
        let data = {
            status: false,
            msg: 'CHECK.CAPTCHA.ERROR' // 圖形驗證碼檢驗失敗
        };
        if (captchCode.toString().toUpperCase() !== this.vaildCode.toUpperCase()) {
            return data;
        }
        data.status = true;
        data.msg = '';
        return data;
    }


	/**
	 * [saveCaptchaCode 設定圖形驗證碼]
	 * @param  {[type]} captchCode [description]
	 * @return {[type]}            [description]
	 */
    private saveCaptchaCode(captchCode) {
        if (typeof captchCode == 'string') {
            this.vaildCode = captchCode;
        }
    };

    /**
     * 產生驗證碼值
     * @param len 
     * @param fontColor 
     * @param bgcolor 
     */
    private getCaptchaVal(len, fontColor, bgcolor, type?) {
        // 隨機取樣樣本
        let codeChars = [];
        if (type !== 'undefined' && type === 'EN') {
            codeChars = ['2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        } else {
            codeChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        }
        let i = 1;
        let charNum;
        let code = '';
        let codeObj = [];
        let tmp_obj = {};
        let codeLength = codeChars.length;
        let pre_color;
        for (i = 0; i < len; i++) {
            charNum = Math.floor(Math.random() * codeLength);
            tmp_obj = {
                code: codeChars[charNum],
                color: ''
            };
            pre_color = (typeof codeObj[codeObj.length - 1] !== 'undefined') ? codeObj[codeObj.length - 1]['color'] : '';
            tmp_obj['color'] = this.createRandomColor(fontColor, bgcolor, pre_color);
            code += tmp_obj['code'];
            codeObj.push(tmp_obj);
        }
        this.saveCaptchaCode(code);
        return codeObj;
    }

	/*
	*產生隨機色
	*
	*/
    private createRandomColor(colorful, bgcolor?, precolor?) {
        let randomColor = '';
        if (colorful == 'Y' || colorful == 'R') {
            let letters = '012345678';
            let j = 0;
            for (j = 0; j < 6; j++) {
                randomColor += letters[Math.floor(Math.random() * 10)];
            }
        } else {
            randomColor = '000';
        }
        let check: any;
        if (typeof bgcolor !== 'undefined' && bgcolor) {
            check = this.checkColor('#' + randomColor, bgcolor);
            if (!check) {
                randomColor = this.createRandomColor('R', bgcolor, precolor);
            }
        }
        if (typeof precolor !== 'undefined' && precolor) {
            check = this.checkColor('#' + randomColor, precolor, true);
            if (check < 1) {
                randomColor = this.createRandomColor('R', bgcolor, precolor);
            }
        }
        if (colorful === 'R') {
            return randomColor;
        }
        return '#' + randomColor;
    }


    /**
     * 產生雜訊
     *
     * @param ctx 畫布物件(必要)
     * @param canvasW 畫布寬(必要)
     * @param canvasH 畫布高(必要)
     * @param noiseRate 雜訊百分比(越大雜訊越多)
     * @param colorful 雜訊顏色( Y=>彩色 , 其他值=>黑色)
     */
    private createNoise(ctx, canvasW, canvasH, noiseRate, colorful) {
        if (typeof ctx == 'object' && typeof canvasW == 'number' && typeof canvasH == 'number') {
            let basicW = 5;
            let basicH = 5;
            let noise = Math.floor(noiseRate * basicH * basicW);
            let Xgrid = Math.floor(canvasW / basicW);
            let Ygrid = Math.floor(canvasH / basicH);
            // 跑每一格
            for (let k = 0; k < Xgrid; k++) {
                for (let m = 0; m < Ygrid; m++) {
                    // 隨機雜訊
                    for (let p = 0; p < noise; p++) {
                        let bgColor = this.createRandomColor(colorful);
                        // 背景色
                        ctx.fillStyle = bgColor;
                        // 繪製矩形(X,Y,W,H)
                        ctx.fillRect((k * basicW) + (Math.floor(Math.random() * basicW)), (m * basicH) + Math.floor(Math.random() * basicH), 1, 1);
                    }
                }
            }
        }
    }

	/**
	 * [checkColor 檢查差距是否大於30]
	 * @param  {[type]} foreValue [description]
	 * @param  {[type]} backValue [description]
	 * @return {[type]}           [description]
	 */
    private checkColor(foreValue, backValue, return_flag?) {
        foreValue = this.hexToRgb(foreValue);
        backValue = this.hexToRgb(backValue);
        // 100 x (((R1-R2)的平方 + (G1-G2)的平方 + (B1-B2) 的平方)/3)的0.5次方/255
        if (foreValue != null && backValue != null) {
            let r = backValue.r - foreValue.r; // (R1-R2)的平方
            let g = backValue.g - foreValue.g; // (G1-G2)的平方
            let b = backValue.b - foreValue.b; // (B1-B2) 的平方
            let result = 100 * ((r + g + b) / 3) / 255;
            result = Math.abs(result);
            if (return_flag) {
                return result;
            }
            // 顯示百分比，建議大於30%
            if (result >= 30) {
                return true;
            } else {
                return false;
            }
        }
    }
	/**
	 * [hexToRgb 取得顏色物件]
	 * @param  {[type]} hex [description]
	 * @return {[type]}     [description]
	 */
    private hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }


}
