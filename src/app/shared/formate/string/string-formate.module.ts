/**
 * formate Module: String
 * 常用的formate方法與pipe
 */
import { NgModule } from '@angular/core';
// == 字串常用pipe == //
import {
    TrimStrPipe
    , PadStrPipe
    , ObjToEmptyPipe
    , SubStrPipe
} from './string-formate.pipe';


/**
 * Pipe清單
 */
const PipeList = [
    TrimStrPipe
    , PadStrPipe
    , ObjToEmptyPipe
    , SubStrPipe
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
export class StringFormateModule { }
