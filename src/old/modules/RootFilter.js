var RootFilterApp =angular.module('RootFilterApp', []);

/**
 * [getTypeFilter 判斷類型]
 */
RootFilterApp.filter('getTypeFilter', function(){
	return function(obj){
		return typeof(obj);
	};
});

/**
 * [identityMaskFilter 身分證遮罩]
 */
RootFilterApp.filter('identityMaskFilter', function(){
	return function(idval){
		if(typeof idval !== 'string'){
			return idval;
		}
		var strlen = idval.length;
		if (strlen > 4){
			tmp = idval.substring(0,3);
			if(strlen < 8){
				tmp += Array(strlen-4+1).join("●");
				tmp += idval.substring(strlen-1,strlen);
			}else{
				tmp += "●●●●" + idval.substring(7,strlen);
			}
		}

		return tmp;
	};
});
/**
 * [accountMaskFilter 卡號遮罩]
 */
RootFilterApp.filter('accountMaskFilter', function(){
	return function(str){
		if(typeof str === 'number'){
			str = str.toString();
		}
		if(typeof str !== 'string'){
			return str;
		}
		if(str === ''){
			return '';
		}
		str = str.replace(/[\/|\-|\.|\:|\s]/g,'');

		if(str.length < 16){
			str = ('0000000000000000'+str).substr(-16);
		}
		return '****-****-**'+str.substr(-6,2)+'-'+str.substr(-4,4);
	};
});


/**
 * [accountMaskFilter 卡號遮罩]
 */
RootFilterApp.filter('dateFilter', function(){
	var pad_left = function(str){
		if(str === ''){
			str = '00';
		}else if(str.toString().length < 2){
			str = '0' + str;
		}
		return str;
	}
	return function(str){
		if(typeof str !== 'string' && typeof str !== 'number'){
			return '';
		}
		str = str.toString();
		var show_time_flag = true;
		var obj_val = str.replace(/[\/|\-|\.|\:|\s]/g,'');
		var res = /^[0-9]+$/;
		if(res.test(obj_val))
		{
			var obj_length = obj_val.length;
			var date_list = ['','',''];
			switch(obj_length){
				case 6: //780101 民國78.01.01
				case 7: //1010101 民國101.01.01
					date_list[1] = obj_val.substr(-4,2);
					date_list[2] = obj_val.substr(-2,2);
					date_list[0] = obj_val.replace(obj_val.substr(-4,4),'');
					obj_val = date_list.join('/');
					show_time_flag = false;
				break;
				case 8://19890101 西元1989.01.01
					date_list[0] = obj_val.substr(0,4);
					date_list[1] = obj_val.substr(4,2);
					date_list[2] = obj_val.substr(6,2);
					obj_val = date_list.join('/');
					show_time_flag = false;
				break;
				case 12://780101126060
					date_list[1] = obj_val.substr(-10,2);
					date_list[2] = obj_val.substr(-8,2);
					date_list[3] = obj_val.substr(-6,2);
					date_list[4] = obj_val.substr(-4,2);
					date_list[5] = obj_val.substr(-2,2);
					date_list[0] = obj_val.replace(obj_val.substr(-10,10),'');
					obj_val = date_list[0]
								+ '/' + date_list[1]
								+ '/' + date_list[2]
								+ ' ' + date_list[3]
								+ ':' + date_list[4]
								+ ':' + date_list[5]
					;
				break;
				case 14://19890101125959 西元1989.01.01 12:59:59
					obj_val = obj_val.substr(0,4)
								+ '/' + obj_val.substr(4,2)
								+ '/' + obj_val.substr(6,2)
								+ ' ' + obj_val.substr(8,2)
								+ ':' + obj_val.substr(10,2)
								+ ':' + obj_val.substr(12,2)
					;
				break;
				default:
					error_flag = true;
				break;
			}

			//==民國轉換==//
			var tmp_date = obj_val.split('/');
			if(tmp_date[0] <= 1911 && tmp_date[0].length < 4){
				tmp_date[0] = parseInt(tmp_date[0]) + 1911;
				obj_val = tmp_date.join('/');
			}
		}else{
			obj_val = str;
		}

		var dt = new Date(obj_val);
		var timestamp = dt.getTime();
		if(!timestamp){
			return str;
		}

		var year = dt.getFullYear();
		var month = pad_left(dt.getMonth()+1);
		var day = pad_left(dt.getDate());
		var hour = pad_left(dt.getHours());
		var min = pad_left(dt.getMinutes());
		var sec = pad_left(dt.getSeconds());

		if(show_time_flag){
			return year+'/'+month+'/'+day+' '+hour+':'+min+':'+sec;
		}else{
			return year+'/'+month+'/'+day;
		}

	};
});

/**
 * [cleanspace 清除空白]
 */
RootFilterApp.filter('cleanSpace', function(){
	return function(str){
			var output_data = str;
			output_data = output_data.replace(/^(\r|\n|\r\n|\s|\t|[　])+|(\r|\n|\r\n|\s|\t|[　])+$/gm, '');
			return output_data;
		
	};
});