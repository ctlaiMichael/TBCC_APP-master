/**
 * formate Module: View (html,css..)
 * 常用的formate方法與pipe
 */
import { NgModule } from '@angular/core';
// == 數值常用pipe == //
import {
    SafeHtmlPipe
} from './view-formate.pipe';


/**
 * Pipe清單
 */
const PipeList = [
    SafeHtmlPipe
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
export class ViewFormateModule { }
