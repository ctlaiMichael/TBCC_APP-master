/**
 * formate Module: Amount
 * 常用的formate方法與pipe
 */
import { NgModule } from '@angular/core';
// == pipe == //
import {
    RatetransPipe
} from './rate-formate.pipe';


/**
 * Pipe清單
 */
const PipeList = [
    RatetransPipe
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
export class RateFormateModule { }
