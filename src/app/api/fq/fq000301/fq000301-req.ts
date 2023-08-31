import { ReqBody } from '@base/api/model/req-body';

export class FQ000301ReqBody extends ReqBody {
    custId= '';
    mobileBarcode= '';
    loveCode = '';
    socialWelfareName = ''
    defaultBarcode = ''; // 發票預設值 =1為雲端發票條碼，發票預設值 = 2為捐贈愛心碼
}

