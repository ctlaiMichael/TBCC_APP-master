/**
 * 模擬QR Code測試
 */

export const QRCodeTestCase = {
    /**
     * 消費扣款 (購物)
     */
    'shop': {
        name: '消費扣款',
        // tslint:disable-next-line:max-line-length (購物)
        qrcode: 'TWQRP%3A%2F%2F462QRCODE%E6%B8%AC%E8%A9%A6%E5%BA%97%2F158%2F01%2FV1%3FD3%3DAWhGu7sDQnep%26D10%3D901%26D11%3D00%2C46246226301561000310001002%3B02%2C46246226301561000310001002%26D17%3DM%2C%E5%93%81%E5%90%8D%2C%E5%9B%9B%E5%AD%A3%E7%8F%8D%E6%B3%A2%E6%A4%B0%2CN%26D18%3DM%2C%E6%95%B8%E9%87%8F%2C%2CY%26D19%3DO%2C%E5%82%99%E8%A8%BB%2C%2CY%26D20%3D***'
    }
    /**
     * 如邑堂
     */
    , 'emv_cookie': {
        name: '消費扣款-如邑堂',
        // tslint:disable-next-line:max-line-length
        qrcode: 'TWQRP%3A%2F%2F%E5%A6%82%E9%82%91%E5%A0%82%2F158%2F01%2FV1%3FD1%3D100%26D3%3DAYd7OlZvtEM7%26D11%3D00%2C00600643905420100110010001%3B01%2C00600643905420100110010001'
    }
    /**
     * emv
     */
    , 'emv': {
        name: '消費扣款-EMV',
        // tslint:disable-next-line:max-line-length
        qrcode: '0002010102110216400396006100104004155395940061001041316315805006100104535960012tw.com.twqrp0176V1158Ac5CJ9NjpN1W00,00600626309800100190010002;02,006006263098001001900100025204599953039015802TW5911006TESTSHOP6011TAIPEI CITY610311464210002ZH0111FISC金融卡25256304DC34'
    }
    , 'emv-card': {
        name: '消費扣款-EMV-純信用卡',
        // tslint:disable-next-line:max-line-length
        qrcode: '000201010211021640039600611201130415539594006112011131631580500611201185204800153039015802TW5922ABCDEFGHIJKLMNOPQ123456013Kaohsiung    61058724464140002ZH0104TEST6304A296'
    }
    /**
     * 繳費
     */
    , 'pay-card': {
        name: '繳費-繳卡費',
        // tslint:disable-next-line:max-line-length
        qrcode: 'TWQRP%3A%2F%2F462QRCODE%E6%B8%AC%E8%A9%A6%E5%BA%97%2F158%2F03%2FV1%3FD1%3D30000%26D3%3DAeyysARXl7ad%26D12%3D20201231123030%26D10%3D901%26D4%3D20170731%26D7%3D1234567890123456%26D8%3D%E4%BF%A1%E7%94%A8%E5%8D%A1%E8%B2%BB%26D11%3D00%2C4624622630156100011000100300000010'
    }
    /**
     *  中華電信CHT
     */
    , 'CHT': {
        name: '繳費-中華電信費',
        // tslint:disable-next-line:max-line-length
        qrcode: 'TWQRP%3A%2F%2F%E6%B8%AC%E8%A9%A6%E4%B8%AD%E8%8F%AF%E9%9B%BB%E4%BF%A1%E8%B2%BB%2F158%2F03%2FV1%3FD1%3D10%39%3900%26D3%3DAXQ4%2F8YB611s%26D7%3D++72+++++Y514%397%39%26D11%3D00%2C0040041000006700010001000100067805%26D14%3D5%2C0707%2C11%2C070820001%26D15%3D000'
    }
    /**
     * 繳稅
     */
    // tslint:disable-next-line:max-line-length
    , 'tax': {
        name: '繳稅',
        // tslint:disable-next-line:max-line-length
        qrcode: 'https%3A%2F%2Fpaytax.nat.gov.tw%2FQRCODE.aspx%3Fpar%3D113313304001474545000000006410805120205012941558'
    }
    /**
     * outbound
     */
    , 'outbound1': {
        name: 'outbound1',
        // tslint:disable-next-line:max-line-length
        qrcode: 'TWQRP%3A%2F%2FAlipay+Company+Ltd%2F158%2F01%2FV1%3FD12%3D20191231153154%26D2%3DOutSale190423151509%26D11%3D00%2C95095010000300415695000001%3B11%2C95095010000300415695000001%26D3%3DAdFN2rb2Uk8C%26D1%3D158500%26D10%3D901'
    }
    // tslint:disable-next-line:max-line-length
    // ,'outbound2': 'TWQRP%3A%2F%2FAlipay+Company+Ltd%2F158%2F01%2FV1%3FD12%3D20191231104049%26D2%3D2019061818011947631%26D11%3D00%2C95095010000100415695000001%3B11%2C95095010000100415695000001%26D3%3DASauT1RU6VKc%26D1%3D115400%26D10%3D901'
    /**
    *  P2P
    * 
    */
    , 'P2P': {
        name: 'P2P',
        // tslint:disable-next-line:max-line-length
        qrcode: 'TWQRP%3A%2F%2F%E5%80%8B%E4%BA%BA%E8%BD%89%E5%B8%B3%2F158%2F02%2FV1%3FD5%3D006%26D6%3D0009997872063037'
    }
     /**
     * 20191007_bug
     */
    , '20191007_bug': {
        name: '20191007_bug',
        // tslint:disable-next-line:max-line-length
        qrcode: '00020101021135660012tw.com.twqrp0146V1158AZ/Mb8sVY7b900,006006000000011105110550015204581253039015802TW5911YANG XIU LI6012Hsinchu City610330064130002ZH0103楊秀莉6304AA4B'
    }
     /**
     * 轉帳購物
     */
    // 需輸入轉帳金額
    , 'transfer_shop': {
        name: '轉帳購物-需輸入轉帳金額',
        // tslint:disable-next-line:max-line-length
        qrcode: 'TWQRP%3A%2F%2F462QRCODE%E6%B8%AC%E8%A9%A6%E5%BA%97%2F158%2F01%2FV1%3FD2%3DT201712310000003000%26D3%3DAeN2ibPXQKgp%26D10%3D901%26D11%3D00%2C46246226301561000410001001%3B51%2C4624622630156100041%26D12%3D20201231123030'
    }
    // 不需輸入轉帳金額
    , 'transfer_shop_2': {
        name: '轉帳購物-不需輸入轉帳金額',
        // tslint:disable-next-line:max-line-length
        qrcode: 'TWQRP%3A%2F%2F462QRCODE%E6%B8%AC%E8%A9%A6%E5%BA%97%2F158%2F01%2FV1%3FD1%3D39900%26D2%3DT201712310000004000%26D3%3DAeN2ibPXQKgp%26D10%3D901%26D11%3D00%2C46246226301561000410001001%3B51%2C4624622630156100041%26D12%3D20201231123030'
    }


};
