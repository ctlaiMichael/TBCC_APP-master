# 主要區塊說明
## 功能: 基本全域Pipe (String)


### 功能說明
提供基本呼叫的pipe


---

# 字串類Pipe
## 項目
* TrimStrPipe
* PadStrPipe
* ObjToEmptyPipe
---
## Pipe名稱: TrimStrPipe
(呼叫方式:) `
trimStr
`

### 說明
trim字串，去除空白等方法

### 使用介紹
`{{' 　  Hellow Word! 　  ' | trimStr}}`

 => "Hellow Word!"

`{{' 　  Hellow Word! 　  ' | trimStr:'left'}}`

 => "Hellow Word! 　  "

`{{' 　  Hellow Word! 　  ' | trimStr:'right'}}`

 => " 　  Hellow Word!"

`{{' 　  Hellow Word! 　  ' | trimStr:'all'}}`

 => "HellowWord!"

`{{' 　  Hellow Wo  rd! 　  ' | trimStr:'spe'}}`

 => "Hellow Word!"



---
## Pipe名稱: PadStrPipe
(呼叫方式:) `
padStr
`

### 說明
補字串

### 使用介紹
`{{'abcde' | padStr: [10]}}`

=> "00000abcde"

`{{'abcde' | padStr: [10, 'ab']}}`

=> "ababaabcde"

`{{'abcde' | padStr: [10, '0', 'right']}}`

=> "abcde00000"

`{{'abcde' | padStr: [10, 'ab', 'right']}}`

=> "abcdeababa"




---
## Pipe名稱: ObjToEmptyPipe
(呼叫方式:) `
ObjToEmpty
`

### 說明
假設傳進來的不是string則回傳空值

### 使用介紹

`{{'abcde' | ObjToEmpty}}`

=> "abcde"

`{{ {"1":"aa"} | ObjToEmpty}}`

=> ""