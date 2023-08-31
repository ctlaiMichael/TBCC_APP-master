# Template說明: 列表展開
## 目的
點擊展開效果


## 層級



## 基本module引用
  import { ExpandListModule } from '@shared/template/list/expand/expand-list.module';
    
  @NgModule({
      imports: [
          ExpandListModule
      ]
  })...

## component
`N/A`

## html
    <ul class="table_data_frame">
    <!-- 標題Start -->
      <li class="table_data">
        <span class="data_cell">日期</span>
        <i class="data_cell">摘要</i>
        <b class="data_cell">支出/存入</b>
        <s class="data_cell"></s>
      </li>
      <!-- 標題 End -->
      <!-- 列表start -->
      <li class="table_data" expandList>
        <span class="data_cell">09/09</span>
        <i class="data_cell">現金提</i>
        <b class="data_cell color_ded">-3000</b>
        <s class="data_cell">
          <button class="sub_open"></button>
        </s>
      </li>
      <div class="sub_open_info_frame">
        <dl class="sub_open_info">
        <dt class="sub_open_row">
          <span></span>
          <span>結餘</span>
          <span>31</span>
          <span></span>
        </dt>
        <dt class="sub_open_row">
          <span></span>
          <span>註記</span>
          <span></span>
          <span></span>
        </dt>
        <dt class="sub_open_row">
          <span></span>
          <span>備註</span>
          <span>郵匯局</span>
          <span></span>
          </dt>
        </dl>
      </div>
    <!-- 列表 End  -->
    </ul>

