/**
 * formate Module: Math
 */
import { NgModule } from '@angular/core';
// == pipe == //
import {
    MathSumPipe
    , MathPercentPipe
} from './math-formate.pipe';


/**
 * Pipe清單
 */
const PipeList = [
    MathSumPipe
    , MathPercentPipe
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
export class MathFormateModule { }
