/**
 * 基本Date常用pipe
 */
import { Pipe, PipeTransform, WrappedValue } from '@angular/core';
import { FlagUtil } from '@shared/util/formate/view/flag-util';
import { Logger } from '@core/system/logger/logger.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * 幣別國旗顯示
 */
@Pipe({
  name: 'iconFlag'
})
export class IconFlagPipe implements PipeTransform {

  constructor(
    private _logger: Logger
  ) { }

  transform(value: string, arg?: string): string {
    let params_key: string = '';
    let params: any = {};
    if (typeof arg !== 'undefined') {
      params_key = arg;
    }
    return FlagUtil.transIconFlag(value, params_key);
  }
}


/**
 * 幣別國旗顯示
 */
@Pipe({
  name: 'currencyName'
  , pure: false
})
export class CurrencyNamePipe implements PipeTransform {

  private originValue = '';
  private originArg = '';
  private outputData = '';

  constructor(
    private _logger: Logger,
    private translate: TranslateService
  ) { }

  transform(value: string, arg?: string): any {
    let show_obj = FlagUtil.transCurrencyName(value, arg);
    let output = '';
    if (this.originValue == value && this.originArg == arg) {
      return this.outputData;
    }
    this.originArg = arg;
    this.originValue = value;

    if (show_obj.type === 'i18n') {
      const set_params = {currency: show_obj.currency};
      this.translate.get(show_obj.name, set_params).subscribe((val) => {
        output = val;
        this.outputData = output;
      });
      return WrappedValue.wrap(output);
    } else {
      output = show_obj.currency + ' ' + show_obj.name;
      this.outputData = output;
      return output;
    }
  }
}

