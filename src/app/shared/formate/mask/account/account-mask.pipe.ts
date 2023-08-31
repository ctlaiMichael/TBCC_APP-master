/**
 * 遮碼Pipe: 帳號
 */
import { Pipe, PipeTransform } from '@angular/core';
import { AccountMaskUtil } from '@shared/util/formate/mask/account-mask-util';

/**
 * 帳戶formate
 * @param value 日期
 * @param args 格式
 * {{'4444000011111' | accountFormate }}
 * 4444-000-011111
 */
@Pipe({
    name: 'accountFormate'
})
export class AccountFormatePipe implements PipeTransform {

    constructor(
    ) { }

    transform(value: string): string {
        return AccountMaskUtil.accountNoFormate(value);
    }

}

/**
 * 帳戶formate
 * @param value 日期
 * @param args 格式
 * {{'4444000066668888' | accountFormateAll }} 4444000066668888
 * {{'44000066668888' | accountFormateAll }} 0044000066668888
 */
@Pipe({
    name: 'accountFormateAll'
})
export class AccountFormateAllPipe implements PipeTransform {

    constructor(
    ) { }

    transform(value: string): string {
        return AccountMaskUtil.accountAllNoFormate(value);
    }

}

/**
 * 帳號遮碼
 * @param value 日期
 * @param args 格式
 * {{'444400001111' | accountMask }}
 */
@Pipe({
    name: 'accountMask'
})
export class AccountMaskPipe implements PipeTransform {

    constructor(
    ) { }

    transform(value: string): string {
        return AccountMaskUtil.account(value);
    }

}

@Pipe({
    name: 'accountMask1'
})
export class AccountMaskPipe1 implements PipeTransform {

    constructor(
    ) { }

    transform(value: string): string {
        return AccountMaskUtil.account1(value);
    }

}


/**
 * 帳號遮碼
 * @param value 日期
 * @param args 格式
 * {{'444400001111' | cardMask }} ****-****-**00-111
 *
 */
@Pipe({
    name: 'cardMask'
})
export class CardMaskPipe implements PipeTransform {

    constructor(
    ) { }

    transform(value: string): string {
        return AccountMaskUtil.card(value);
    }

}

@Pipe({
    name: 'cardMask1'
})
export class CardMaskPipe1 implements PipeTransform {

    constructor(
    ) { }

    transform(value: string): string {
        return AccountMaskUtil.card1(value);
    }

}

/**
 * epay emv信用卡遮碼專用
 * @param value 日期
 * @param args 格式
 * {{'444400001111' | emvCardMask }} *001111
 *
 */
@Pipe({
    name: 'emvCardMask'
})
export class EmvCardMaskPipe implements PipeTransform {

    constructor(
    ) { }

    transform(value: string): string {
        return AccountMaskUtil.emvCard(value);
    }

}


/**
 * 水號formate
 * @param value 日期
 * @param args 格式
 * X-01-234567-8
 * {{'X012345678' | waterNumberFormate }}
 */
@Pipe({
    name: 'waterNumberFormate'
})
export class waterNumberPipe implements PipeTransform {

    constructor(
    ) { }

    transform(value: string): string {
        return AccountMaskUtil.waterNumberFormate(value);
    }

}

/**
     * 轉出帳號取末五碼
     * @param value 日期
     * @param args 格式
     */
    @Pipe({
        name: 'socailSharingAccntFormat'
    })
    export class socialSharingAccntPipe implements PipeTransform {

    constructor(
    ) { }

    transform(value: string): string {
        return AccountMaskUtil.socailSharingAccntFormat(value);
    }
}