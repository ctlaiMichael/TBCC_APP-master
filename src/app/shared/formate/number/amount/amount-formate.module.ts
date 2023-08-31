/**
 * formate Module: Amount
 * 常用的formate方法與pipe
 */
import { NgModule } from '@angular/core';
// == pipe == //
import {
    CurrencyMoneyPipe
} from './amount-formate.pipe';


/**
 * Pipe清單
 */
const PipeList = [
    CurrencyMoneyPipe
];


@NgModule({
    exports: [
        ...PipeList
    ],
    declarations: [
        ...PipeList
    ],
    providers: []
})
export class AmountFormateModule { }
