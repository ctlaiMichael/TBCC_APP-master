/**
 * [選單處理 Directive]
 */
define([
	'app'
],function(MainApp){
//=====[mainMenuDirective 首頁選單]=====//
MainApp.register.directive('mainMenuDirective', function(i18n){
	var linkFun = function($scope, iElm, iAttrs, controller)
	{
		var menu_data = (typeof $scope.menu_data != 'undefined')
						? angular.copy($scope.menu_data)
						: [];
		var submenu;
		var show_html = '';
		var tmp_link = '';
		var tmp_name = '';
		for(key in menu_data)
		{
			show_html = '<ul>';
			for(subkey in menu_data[key])
			{
				submenu = menu_data[key][subkey];
				//i18n轉換
				tmp_name = i18n.getStringByTag(submenu.name);
				if(typeof tmp_name === 'string' && tmp_name !== ''){
					submenu.name = tmp_name;
				}
				tmp_link = (typeof submenu.link != 'undefined' && submenu.link != '')
							? submenu.link
							: 'javascript:MainUiTool.soonOpen();';
				show_html += '<li>';
				show_html += '<a href="'+tmp_link+'" ';
				show_html += (tmp_link.indexOf("http") == 0) ? ' target="_blank" ' : '';
				show_html += ' >';
				show_html += 	'<i class="btn btn_m '+submenu.class_name+'" ></i>';
				show_html += 	'<span>'+submenu.name+'</span>';
				show_html += '</a>';
				show_html += '</li>';
			}
			show_html += '</ul>';
			iElm.append(show_html);
		}
		//==create point 建立點點==//
		var slide_pagenum = iElm.find('ul').length;
		// var slide_pagenum = document.getElementById('nav_slider').getElementsByTagName('ul').length;
		if(slide_pagenum <= 1){
			return true;
		}
		// //效果先關掉,與art討論
		// var pagenaviElement = document.getElementById('pagenavi');
		// for(var i=1;i<=slide_pagenum;i++){
		// 	$('#pagenavi').append('<a href="#" class="">'+i+'</a>&nbsp;');
		// }
		// // 首頁主選單區塊 slide
		// console=window.console || {dir:new Function(),log:new Function()};
		// var active=0,
		// as=pagenaviElement.getElementsByTagName('a');
		// as[0].className='active';
		// for(var i=0;i<as.length;i++){
		// 	(function(){
		// 		var j=i;
		// 		as[i].onclick=function(){
		// 			t.slide(j);
		// 			return false;
		// 		}
		// 	})();
		// }
		// var t=new TouchSlider('nav_slider',{speed:300, direction:0, autoplay:false, fullsize:true});
		// t.on('before',function(m,n){
		// 	as[m].className='';
		// 	as[n].className='active';
		// });
	};
	return {
		restrict: 'A',
		template: '',
		replace: false,
		link: linkFun
	};
});
//=====[mainMenuDirective 首頁選單 END]=====//


//=====[leftMenuDirective 左側選單]=====//
MainApp.register.directive('leftMenuDirective', function(
	i18n
	,framework,deviceInfo
){
	var linkFun = function($scope, iElm, iAttrs, controller)
	{
		var menu_data = (typeof $scope.left_menu_data != 'undefined')
						? angular.copy($scope.left_menu_data)
						: [];
		var submenu;
		var show_html = '';
		var tmp_link = '';
		var tmp_name = '';
		var tmp_style = '';

		//==版本號==//
		var divice_version = deviceInfo.appVersion;
		// divice_version = '3.13.6580';
		var about_release = framework.getAbout("Release", '');
		//版本:手機裝置版本(about版本)
		var app_version = i18n.getStringByTag('VERSION') + ':'
							+ divice_version
							+ '('+about_release+')';
		menu_data.push({
			name : app_version,
			link : '',
			class_name : '',
			style:[
				'font-size:10px;',
				'text-align: right;',
				'color:#ccc;'
			]
		});

		for(key in menu_data)
		{
			//i18n轉換
			tmp_name = i18n.getStringByTag(menu_data[key]['name']);
			if(typeof tmp_name === 'string' && tmp_name !== ''){
				menu_data[key]['name'] = tmp_name;
			}
			tmp_link = 'javascript:void(0);';
			if(typeof menu_data[key]['sub_menu'] === 'undefined'){
				tmp_link = (typeof menu_data[key]['link'] != 'undefined' && menu_data[key]['link'] != '')
						? menu_data[key]['link']
						: 'javascript:MainUiTool.soonOpen();';
			}
			tmp_style = '';
			if(typeof menu_data[key]['style'] !== 'undefined'){
				if(typeof menu_data[key]['style']==='object'){
					menu_data[key]['style'] = menu_data[key]['style'].join('');
				}
				if(typeof menu_data[key]['style'] === 'string' && menu_data[key]['style'] !== ''){
					tmp_style = ' style="'+menu_data[key]['style']+'" ';
				}
			}


			if (menu_data[key].hasOwnProperty('class') && menu_data[key]['class'] == 'icon_epay') {  
				console.error('icon_epay',menu_data[key]);
                    show_html = '<li>';
                    show_html += '<a  class="nl_1 icon_epay" href="' + tmp_link + '" ' + tmp_style + ' ';
                    show_html += (tmp_link.indexOf("http") == 0) ? ' target="_blank" ' : '';
                    show_html += '>'
                        + menu_data[key]['name'] + '</a>';
                } else {
                    show_html = '<li>';
                    show_html += '<a  class="nl_1" href="' + tmp_link + '" ' + tmp_style + ' ';
                    show_html += (tmp_link.indexOf("http") == 0) ? ' target="_blank" ' : '';
                    show_html += '>'+menu_data[key]['name'] + '</a>';
                }
			//==sub menu==//
			if(typeof menu_data[key]['sub_menu'] != 'undefined')
			{
				show_html += '<ul class="sub_menu" >';
				for(subkey in menu_data[key]['sub_menu'])
				{
					submenu = menu_data[key]['sub_menu'][subkey];
					//i18n轉換
					tmp_name = i18n.getStringByTag(submenu['name']);
					if(typeof tmp_name === 'string' && tmp_name !== ''){
						submenu['name'] = tmp_name;
					}
					tmp_link = (typeof submenu.link != 'undefined' && submenu.link != '')
								? submenu.link
								: 'javascript:MainUiTool.soonOpen();';
					show_html += '<li><a  class="nl_2" href="'+tmp_link+'" ';
					show_html += (tmp_link.indexOf("http") == 0) ? ' target="_blank" ' : '';
					show_html += '>'+submenu['name']+'</a></li>';
				}
				show_html += '</ul>';
			}
			//==sub menu end==//
			show_html += '</li>';
			iElm.append(show_html);
		}
		MainUiTool.leftMenu(true);
	};
	return {
		restrict: 'A',
		template: '',
		replace: false,
		link: linkFun
	};
});
//=====[leftMenuDirective 左側選單 END]=====//

//=====[footerMenuDirective footer選單]=====//
MainApp.register.directive('footerMenuDirective', function(i18n){
	var linkFun = function($scope, iElm, iAttrs, controller)
	{
		var menu_data = (typeof $scope.footer_menu_data != 'undefined')
						? angular.copy($scope.footer_menu_data)
						: [];
		var submenu;
		var show_html = '';
		var tmp_link = '';
		var tmp_name = '';
		for(key in menu_data)
		{
			submenu = menu_data[key];
			//i18n轉換
			tmp_name = i18n.getStringByTag(submenu['name']);
			if(typeof tmp_name === 'string' && tmp_name !== ''){
				submenu['name'] = tmp_name;
			}
			tmp_link = (typeof submenu.link != 'undefined' && submenu.link != '')
						? submenu.link
						: 'javascript:MainUiTool.soonOpen();';
			 if (submenu.hasOwnProperty('class') && submenu['class'] == 'icon_epay') {
                    show_html = '<a href="' + tmp_link + '">'
                        + '<i class="btn btn_f ' + 'icon_epay' + '"></i>'
                        + '<span>' + submenu['name'] + '</span>'
                        + '</a>';
                } else {
                    show_html = '<a href="' + tmp_link + '">'
                        + '<i class="btn btn_f ' + submenu['class_name'] + '"></i>'
                        + '<span>' + submenu['name'] + '</span>'
                        + '</a>';
                }
			iElm.append(show_html);
		}
	};
	return {
		restrict: 'A',
		template: '',
		replace: false,
		link: linkFun
	};
});
//=====[footerMenuDirective footer選單 END]=====//

});