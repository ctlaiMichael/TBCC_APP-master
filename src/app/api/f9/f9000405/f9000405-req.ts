import { ReqBody } from '@base/api/model/req-body';

export class F9000405ReqBody extends ReqBody {
  custId = '';
  rep_name = '';
  txKind = '';
  give_amt = '';
  give_dur_yymm = '';
  apply_trade = '';
  metier = '';
  metier_sub = '';
  m_year = '';
  apply_nt = '';
  total_nt = '';
  expense = '';
  kycYn = '';
  kycLoan_usage = '';
  kycOld = '';
  kycEtch = '';
  kycEtchNo = '';
  kycBankel = '';
  kycCard = '';
  kycPayMo = '';
  kycElamt = '';
  kycElmo = '';
  kycKo = '';

  constructor() {
    super();
  }
}

