// 左側側邊欄控制
$('#menu_control').click(function() {
  setTimeout(function() {$('body').addClass('open');}, 25 );
});
$('.aside_cover').click(function() {
  setTimeout(function() {$('body').removeClass('open');}, 25 );
});



// 輸入欄位文字消失出現控制
$('input[type="text"]').focus(function() {
  if (!$(this).data("DefaultText")) $(this).data("DefaultText", $(this).val());
  if ($(this).val() != "" && $(this).val() == $(this).data("DefaultText")) $(this).val("");
})
.blur(function(){
  if ($(this).val() == "") $(this).val($(this).data("DefaultText"));
});



// iOS10 解決無法鎖定縮放的方式
document.documentElement.addEventListener('touchstart', function (event) {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
}, false);
var lastTouchEnd = 0;
document.documentElement.addEventListener('touchend', function (event) {
  var now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);