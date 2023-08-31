import {branchDetail} from '@pages/location/location-search-page/locationobject';

// 票卡資料
export interface NumberTicketInfo {
  saleId: string;                      // 業務類別
  department: string;                 // 服務櫃別
  ticketNumber: string | number;      // 票卡號碼
  currentNumber: string | number;     // 目前叫號
  waitingSequence: string | number;   // 等待人數
  isShowNumberPassed: boolean;        // 是否過號
}

// 票卡項目
export interface TicketItem {
  ticketInfo: NumberTicketInfo;     // 票卡資料
  branchInfo: branchDetail;       // 分行資訊

}
