/**
 * formate Module: Object
 * 常用的formate方法與pipe
 */
import { NgModule } from '@angular/core';
import {
    ObjClonePipe
    , ArrayFormatePipe
    , SortFormatePipe
    , FieldCheckFormatePipe
} from './object-formate.pipe';


/**
 * Pipe清單
 */
const PipeList = [
    ObjClonePipe
    , ArrayFormatePipe
    , SortFormatePipe
    , FieldCheckFormatePipe
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
export class ObjectFormateModule { }
