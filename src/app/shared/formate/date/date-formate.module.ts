/**
 * formate Module: Date
 * 常用的formate方法與pipe
 */
import { NgModule } from '@angular/core';
// == 數值常用pipe == //
import {
    HtDatePipe
} from './date-formate.pipe';


/**
 * Pipe清單
 */
const PipeList = [
    HtDatePipe
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
export class DateFormateModule { }
