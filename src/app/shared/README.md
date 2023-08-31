# 新增Module
ng g m path/ModuleName
會產生
path/moudle-name/module-name.module.ts

# 新增Component

ng g c path/moudle-name/ComponentName
會產生  
path/module-name/component-name/component-name.component.ts
path/module-name/component-name/component-name.component.html
path/module-name/component-name/component-name.component.css    //可刪(要同時刪除component-name.component.ts裡的參考)
path/module-name/component-name/component-name.component.spec.ts    //單用測試用, 可直接刪除
會自動更新相同位置的module

#新增Service
ng g s path/module-name/ServiceName
會產生
path/module-name/service-name.service.ts
c