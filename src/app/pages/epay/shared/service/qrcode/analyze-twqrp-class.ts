/**
 * QR Code TWQRP 分析資訊
 */
import { ScanErrorOptions } from '@base/options/scan-error-options';
import { QrcodeFieldsOptions } from '@pages/epay/shared/service/qrcode/qrcode-fields-options';

export class AnalyzeTWQRP {

    constructor() {
    }

    /**
     * TWQRP 分析
     * QR Code為 「TWQRP://」
     */
    analyze1(qrcode: string, pos: number): QrcodeFieldsOptions {
        let output = new QrcodeFieldsOptions();
        output.PayType = '1'; // 加入繳款類別
        output.data.PayType = '1'; // 加入繳款類別

        qrcode = qrcode.substring(pos + 8); // qrcode 從8開始計算

        //  取得商店名稱
        pos = qrcode.indexOf('/');
        if (pos !== -1) {
            output.data['storeName'] = qrcode.substring(0, pos);
            qrcode = qrcode.substring(pos + 1); // qrcode 從8+店名長度開始計算
        } else {
            output.error_data.msg = 'ERROR.SCAN.QRCODE_FORMATE_ERROR'; // QRCode 格式錯誤
            return output;
        }
        //  取得國別碼
        pos = qrcode.indexOf('/');
        if (pos !== -1) {
            output.data['countryCode'] = qrcode.substring(0, pos);
            qrcode = qrcode.substring(pos + 1);
        } else {
            output.error_data.msg = 'ERROR.SCAN.QRCODE_FORMATE_ERROR'; // QRCode 格式錯誤
            return output;
        }
        //  取得交易型態
        pos = qrcode.indexOf('/');
        if (pos !== -1) {
            output.data['trnsType'] = qrcode.substring(0, pos);
            qrcode = qrcode.substring(pos + 1);
            if (output.data['trnsType'] != '01' && output.data['trnsType'] != '03' && output.data['trnsType'] != '02') {
                //  output.error_data.msg = '僅接受購物交易';
                output.error_data.msg = 'EPAY.ERROR.TRANS_NOSUPPORT'; // 此交易尚未開放
                return output;
            }
        } else {
            output.error_data.msg = 'ERROR.SCAN.QRCODE_FORMATE_ERROR'; // QRCode 格式錯誤
            return output;
        }
        //  版本
        pos = qrcode.indexOf('?');
        if (pos !== -1) {
            output.data['version'] = qrcode.substring(0, pos);
            qrcode = qrcode.substring(pos + 1);
        } else {
            output.error_data.msg = 'ERROR.SCAN.QRCODE_FORMATE_ERROR'; // QRCode 格式錯誤
            return output;
        }
        //  有效期限(有才檢查)
        if (qrcode.indexOf('D12=') > -1) {
            let d12 = qrcode.substr(qrcode.indexOf('D12=') + 4, 8);
            let rightNow = new Date();
            let now = rightNow.toISOString().slice(0, 10).replace(/-/g, '');
            if (d12 === null || d12.length != 8 || now > d12) {
                output.error_data.msg = 'EPAY.ERROR.EXPIRED'; // QR Code效期逾期
                return output;
            }
        }

        output.status = true;
        return output;
    }


    /**
     * TWQRP 分析
     * QR Code為 「https://paytax.nat.gov.tw/QRCODE.aspx?par=」
     */
    analyze2(qrcode: string, pos: number) {
        let output = new QrcodeFieldsOptions();
        output.PayType = '2'; // 加入繳款類別
        output.data.PayType = '2'; // 加入繳款類別

        qrcode = qrcode.substring(pos + 42); // qrcode 從8開始計算

        //  取得繳款類別
        output.data['payCategory'] = qrcode.substring(0, 5);
        //  edit by alex

        //  tslint:disable-next-line: no-unused-expression
        if (output.data['payCategory'] === '11331') { output.data['payCategory1'] === '11331-地價稅'; }
        //  tslint:disable-next-line: max-line-length
        let arr = ['11221', '11222', '11223', '11224', '11225', '11226', '11227', '11228', '11229', '11230', '11231', '11232', '11233', '11234', '11235', '11236'];
        let isExist = arr.indexOf(output.data['payCategory']);

        if (output.data['payCategory'] === '11331') { output.data['payCategory1'] = '11331-地價稅'; }
        //  tslint:disable-next-line: one-line
        else if (output.data['payCategory'] === '11201') { output.data['payCategory1'] = '11201-房屋稅'; }
        //  tslint:disable-next-line: one-line
        else if (output.data['payCategory'] === '15001') { output.data['payCategory1'] = '15001-綜合所得稅'; }
        //  tslint:disable-next-line: one-line
        else if (isExist != -1) { output.data['payCategory1'] = output.data['payCategory'] + '-牌照稅'; }
        //  tslint:disable-next-line: max-line-length
        //  tslint:disable-next-line: one-line
        else if (output.data['payCategory'] === '11002' || output.data['payCategory'] === '11003') { output.data['payCategory1'] = output.data['payCategory'] + '-綜所稅補徵稅款'; }
        //  tslint:disable-next-line: one-line
        else {
            output.error_data.msg = 'EPAY.ERROR.TAX_NOSUPPORT'; // 尚未提供此稅款繳納服務
            return output;
        }
        //  取得銷帳編號
        qrcode = qrcode.substring(5);
        output.data['payNo'] = qrcode.substring(0, 16);
        //  取得繳款金額
        qrcode = qrcode.substring(16);
        let payMoney = qrcode.substring(0, 10);
        output.data['trnsfrAmount'] = payMoney.replace(/\b(0+)/gi, ''); //  .replaceFirst("^0*", "")去除前面0
        output.data['trnsAmountStr'] = payMoney.replace(/\b(0+)/gi, ''); //  .replaceFirst("^0*", "")去除前面0
        //  取得繳納截止日
        qrcode = qrcode.substring(10);
        output.data['payEndDate'] = qrcode.substring(0, 6);
        //  edit by alex
        output.data['payEndDate1'] = '1'.concat(output.data['payEndDate']);
        //  取得期別代號
        qrcode = qrcode.substring(6);
        output.data['periodCode'] = qrcode.substring(0, 5);
        //  取得識別碼
        qrcode = qrcode.substring(5);
        output.data['identificationCode'] = qrcode.substring(0, 6);

        output.status = true;
        return output;
    }

    /**
  * TWQRP 分析
  * QR Code為 「twqrp/webtoapp?acqBank=006&terminalId=10011001&merchantId=006263198001001
  * &encQRCode=AcKSrTAGls19%2fnKMPQeUZKjT1dFK4L5LZJzxyZe55iHK%2bF41WknrdelQIVugMPK5dn%2b8HckdwMUzSGEWyrZej7NrAmkAc7W6VFYvnJYd5%2btgPvPRZkvtDlJTgOtke%2bvmYTWjbbs9uYZALZyNTWJsIggbTe1lzlTiQMBOAB5fR41DlDmQt%2fKCQwNpSiAggCxzijVIiJdJC265CUMH8zJMld5FGX857J2Mah6Q04cJkyS2Bgsontpsw1J6UmOu4ZzawpR6Za6spfpFhX3H0aJNQxeDQSsfnuUatWynSUH3J0Iil3fgWgViScbqLqDsJUiW0SyDA3WhLKbsrjGkYEBZpY3iPmgBL7q5aKtVJTvgDK%2blwczJjfvYihpYc5j75E3oYQ%3d%3d
  * &encRetURL=AXBC%2bDwtxAD%2b1svPy75UCILT4tiSEFOKDPPGhmK0xIdBmqLsnRgKZCqw4%2f%2fNTe9OEPp0%2fmxO6PZoAthsSmn7yrqAWGVTSCl7Ju3%2baEWQHb8X&orderNumber=QRP1234567890&verifyCode=2CB7A47FB8BC1E35FDE1ED5A2ADD22B46C376C96BE2A69B07D0439C1D347D095」
  */
  analyzeWebToApp(qrcode: string, objFormate: Object) {
    let output = new QrcodeFieldsOptions();
    /**
     * 將各資料取出來變成一個物件
     */
    const rep = qrcode.split('?')[1].split('&');
    rep.forEach((obj) => {
      const itemList = obj.split('=');
      const item = { [itemList[0]]: itemList[1] };
      Object.assign(objFormate, item);
    });
    const isEmpty = Object.keys(objFormate).every(x => (objFormate[x] === null || objFormate[x] === ''));
    if (isEmpty) {
      output.error_data.msg = 'ERROR.SCAN.QRCODE_FORMATE_ERROR'; // QRCode 格式錯誤
      output.status = false;
      return output;
    }
    output.data = objFormate;
    return output;
  }
}
