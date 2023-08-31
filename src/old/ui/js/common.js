// 表單輸入文字消失、回復預設值
$('input[type="text"], input[type="tel"]').focus(function() {
  if (!$(this).data("DefaultText")) $(this).data("DefaultText", $(this).val());
  if ($(this).val() != "" && $(this).val() == $(this).data("DefaultText")) $(this).val("");
}).blur(function(){
  if ($(this).val() == "") $(this).val($(this).data("DefaultText"));
});