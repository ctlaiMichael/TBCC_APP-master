import { Pipe, PipeTransform } from '@angular/core';
import { DepositUtil } from '@shared/util/formate/mask/deposit-util';

/**
 * 顯示[定存到期日]或[最後交易日]
  * {{ 'CK' | lastTransType: 'TW' }}
 */
@Pipe({
  name: 'lastTransType'
})
export class LastTranTypePipe implements PipeTransform {

  transform(values: string, depositType?: string): string {
    return DepositUtil.transLastTransType(values, depositType);
  }
}
/**
 * 顯示[去除合庫字樣的開戶分行名稱]
  * {{ 'CK' | lastTransType: 'TW' }}
 */
@Pipe({
    name: 'branchName'
})
export class BranchNamePipe implements PipeTransform {

  transform(values: string, args?: boolean|Object): string {
      return DepositUtil.transbranchName(values, args);
  }
}

/**
 * 顯示帳戶別
 * {{ '0796-899-300865' | acctTypeName: 'GD' }}
 * @param values 帳號(13位)
 * @param args 提供帳號別代碼
 */
@Pipe({
  name: 'acctTypeName'
})
export class AcctTypeNamePipe implements PipeTransform {

  transform(values: string, args?: string | Array<any>): string {
    let acctType = '';
    let acctGroup = '';
    if (args instanceof Array) {
      acctType = (typeof args[0] !== 'undefined') ? args[0] : '';
      acctType = (typeof args[1] !== 'undefined') ? args[1] : '';
    } else {
      acctType = args;
    }
    return DepositUtil.getAcctTypeName(values, acctType, acctGroup);
  }
}

/**
 * 顯示nick name
 * {{ 'CK' | acctTypeNickName: 'TW' }}
 * {{ 'CK' | acctTypeNickName: ['TW', '支票存款'] }}
 */
@Pipe({
  name: 'acctTypeNickName'
})
export class AcctTypeNickNamePipe implements PipeTransform {

  transform(values: string, args?: string | Array<string>): string {
    return DepositUtil.acctTypeNickName(values, args);
  }
}

/**
 * 顯示利率別
 * {{ '0' | rateTypeName }}
 */
@Pipe({
  name: 'rateTypeName'
})
export class RateTypeNamePipe implements PipeTransform {

  transform(values: string): string {
    return DepositUtil.getRateTypeName(values);
  }
}
