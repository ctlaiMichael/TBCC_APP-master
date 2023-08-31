/**
 * custId	身分證字號
type	類型
eduLevel	教育程度(P2)
familyIncome	個人/家庭年收入(P4)
resultList	KYC結果列表
resultList.detail
    rtIndex
    rcIndex
 */
import { ReqBody } from '@base/api/model/req-body';
export class FI000604ReqBody extends ReqBody {
    custId = '';
    type = '';
    eduLevel = '';
    familyIncome = '';
    custName='';
    custSex='';
    birthday='';
    age='';
    custTelOffice='';
    custTelHome='';
    custMobile='';
    custFax='';
    custAddr='';
    custEmail='';
    profession='';
    professionName='';
    illnessCrd='';
    childNum='';
    content='';
    trnsToken='';
    isFirstKYC='';

    resultList :any = {
        // detail: []
    };

    constructor() {
        super();
    }
}
