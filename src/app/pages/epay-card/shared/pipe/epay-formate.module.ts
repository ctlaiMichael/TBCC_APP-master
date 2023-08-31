/**
 * formate Module: String
 * Epay使用的pipe
 */
import { NgModule } from '@angular/core';
import { EpayFormateService } from './epay-formate.service';
// == epay常用pipe == //
import {
    EpayAmtPipe
    , EpayNoticNbrPipe
} from './epay-formate.pipe';


/**
 * Pipe清單
 */
const PipeList = [
    EpayAmtPipe
    , EpayNoticNbrPipe
];


@NgModule({
    exports: [
        ...PipeList
    ],
    declarations: [
        ...PipeList
    ],
    providers: [
        EpayFormateService
    ]
})
export class EpayFormateModule { }
