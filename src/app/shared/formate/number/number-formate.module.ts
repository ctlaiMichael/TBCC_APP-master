/**
 * formate Module: Number
 * 常用的formate方法與pipe
 */
import { NgModule } from '@angular/core';
// == 數值常用pipe == //
import {
    HtNumberPipe
    , HtMoneyPipe
    , HtFinancialPipe
    , HtFundSetNumberPipe
} from './number-formate.pipe';


/**
 * Pipe清單
 */
const PipeList = [
    HtNumberPipe
    , HtMoneyPipe
    , HtFinancialPipe
    , HtFundSetNumberPipe
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
export class NumberFormateModule { }
