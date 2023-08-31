/**
 * base64檔案轉換處理
 */

export const Base64FileUtil = {
    /**
     * 將base64檔案資料回傳為base64字串
     * @param str_64
     */
    toBase64(str_64:string) {
        let output: string;
        let tmp: any;
        let str_base64 = str_64.toString();
        //清base64
        if(str_base64.indexOf('base64,') > -1){
            tmp = str_base64.split('base64,');
            output = (typeof tmp[1] !== 'undefined') ? tmp[1] : '';
        } else {
            output = str_base64;
        }
        return output;
    },
    /**
     * 將base64字串回傳為base64圖片格式
     * @param str_base64
     */
    base64ToImage(str_base64:string): string {
        let output: string;
        let check = /\.(jpg|png|gif)\b/;
        let check_base64 = /base64,/;
        if(!check.test(str_base64)){
            str_base64 = str_base64.replace(/\n/g,'');
            if (!check_base64.test(str_base64)) {
                output = "data:image/jpeg;base64,"+str_base64;
            } else {
                output = str_base64;
            }
        } else {
            output = str_base64;
        }
        return output;
    },
    /**
     * 將base64字串回傳為base64 PDF格式
     * @param pdfStr
     */
    base64ToPDF(str_base64:string) {
        let output: string;
        let check = /\.(pdf)\b/;
        let check_base64 = /base64,/;
        if(!check.test(str_base64)){
            str_base64 = str_base64.replace(/\n/g,'');
            if (!check_base64.test(str_base64)) {
                output = "data:application/pdf;base64," + str_base64;
            } else {
                output = str_base64;
            }
        } else {
            output = str_base64;
        }
        return output;
    }
};
