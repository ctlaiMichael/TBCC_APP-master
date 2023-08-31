/**
 * 外幣定存交易明細查詢
 *
 * custId 身分證字號
 * acctNo 帳號
 * currCode 幣別: 一定要有值
 * acctType 帳戶類別: XFS、XF
 * startDate	查詢起日
 * endDate	查詢迄日
 * paginator	分頁器
 *
 * [排序問題]
 * 現行不能使用transDate DESC => 日期降序，但同一天日期升序
 * 中台現行無法使用時間排序(僅有日期，無時間)
 * 待確認外幣主機有否提供降序資料(目前主機取得都為升序)
 */
import { ReqBody } from '@base/api/model/req-body';
import { Paginator } from '@base/api/model/paginator';

export class F2100202ReqBody extends ReqBody {
    custId = '';
    acctNo = '';
    acctType = '';
    currCode = '';
    startDate = '';
    endDate = '';
    paginator: Paginator;

    constructor() {
        super();
        this.paginator = new Paginator();
        // this.paginator['sortColName'] = 'transDate';
        // this.paginator['sortDirection'] = 'DESC';
        // native: ForeignDeferralDepositDetail
        this.paginator['sortColName'] = 'acctNo';
        this.paginator['sortDirection'] = 'ASC';
    }
}

