/**
 * 分頁處理
 */
import { Injectable, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';


@Injectable()
export class PaginatorCtrlService {
    /**
     * 參數處理
     */

    constructor(
        private _logger: Logger
        , private resolver: ComponentFactoryResolver
    ) { }



    /**
     * 動態產生物件
     * @param appendBox 產生的box ()
     * @param childComponent 動態產生的component物件
     */
    addPages(appendBox: ViewContainerRef, childComponent) {
        const factory = this.resolver.resolveComponentFactory(childComponent);
        let componentRef = appendBox.createComponent(factory);
        return componentRef;
    }


}


