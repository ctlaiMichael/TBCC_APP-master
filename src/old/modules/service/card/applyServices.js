/**
 * [信用卡申請]
 */
define([
	"app"
	, "service/messageServices"
	, "service/cardServices"
	, "service/formServices"
	, "service/areaServices"
	, "service/branchServices"
	, "app_telegram/fc000101Telegram"
	, "app_telegram/fc000102Telegram"
]
	, function (MainApp) {

		//=====[applyServices START 申請相關]=====//
		MainApp.register.service("applyServices", function (
			i18n, $log
			, messageServices, formServices, areaServices, branchServices
		) {
			var MainClass = this;

			var error_btn = {
				'apply': { 'name': i18n.getStringByTag('PAGE_TITLE.APPLY'), 'sref': 'apply' },
				'upload': { 'name': i18n.getStringByTag('PAGE_TITLE.UPLOAD'), 'sref': 'upload' }
			};
			//==錯誤訊息==//
			var errorCode = {};
			//----[system_XX 系統讀取資料不符規格]----//
			errorCode['FC0001_001'] = {
				message: i18n.getStringByTag('ERROR_CODE.FC0001_001.MESSAGE'), //查無卡片資料
				return_flag: false,
				go_state: 'message',
				state_set: {
					title: i18n.getStringByTag('ERROR_CODE.FC0001_001.TITLE'),
					content: i18n.getStringByTag('ERROR_CODE.FC0001_001.CONTENT'),
					btn_list: [error_btn.apply]
				}
			};
			//----[step_XXX 業務流程錯誤]----//
			errorCode['FC0001_002'] = i18n.getStringByTag('CTRL_APPLY.CHECK.IMAGE_NUM'); //請至少選擇一張圖片
			errorCode['FC0001_003'] = i18n.getStringByTag('CTRL_APPLY.CHECK.IMAGE_IDENTITY'); //請上傳正反身分證照片
			//申請信用卡失敗
			errorCode['FC0001_004'] = {
				message: i18n.getStringByTag('CTRL_APPLY.APPLY.ERROR'),
				return_flag: false,
				go_state: 'message',
				state_set: {
					title: i18n.getStringByTag('CTRL_APPLY.APPLY.ERROR'),
					content: i18n.getStringByTag('CTRL_APPLY.APPLY.ERROR'),
					btn_list: [error_btn.apply]
				}
			};
			//申請成功，但上傳失敗
			errorCode['FC0001_005'] = {
				message: i18n.getStringByTag('ERROR_CODE.FC0001_005.MESSAGE'),
				return_flag: false,
				go_state: 'message',
				state_set: {
					title: i18n.getStringByTag('ERROR_CODE.FC0001_005.TITLE'),
					content: i18n.getStringByTag('ERROR_CODE.FC0001_005.CONTENT'),
					btn_list: [error_btn.upload]
					, message_type: 'warning'
				}
			};
			//申請成功
			errorCode['FC0001_006'] = {
				message: i18n.getStringByTag('ERROR_CODE.FC0001_006.MESSAGE'),
				return_flag: false,
				go_state: 'message',
				state_set: {
					title: i18n.getStringByTag('ERROR_CODE.FC0001_006.TITLE'),
					content: i18n.getStringByTag('ERROR_CODE.FC0001_006.CONTENT')
					, message_type: 'success'
				}
			};
			//驗證碼
			errorCode['FC0001_007'] = {
				message: i18n.getStringByTag('驗證碼驗證失敗'),
				return_flag: false,
				go_state: 'message',
				state_set: {
					title: i18n.getStringByTag('驗證碼驗證失敗'),
					content: i18n.getStringByTag('驗證碼驗證失敗'),
					btn_list: [error_btn.apply]
				}
			};
			messageServices.setErrorCode(errorCode);
			this.getErrorMsg = messageServices.getErrorMsg;


			/**
			 * [getApplySetData 申請表單資料設定]
			 * @param  {[type]} key [取得特定資料]
			 * @return {[type]}     [description]
			 */
			this.getApplySetData = function (key, subkey) {
				var data = {};
				//==卡友檢查欄位==//
				data.have_card_input = ['idNo', 'cnName', 'email', 'mobile', 'branchId', 'birthday', 'elemSchool', 'ebillApply', 'cashRemark', 'channel'];
				//==表單必填欄位==//
				data.required = {
					'idNo': true,
					'cnName': true,
					'enName': true,
					'email': true,
					'ebillApply': false, //電子帳單
					'cashRemark': false,
					'mobile': true,
					//住家tel
					'currentTelArea': false, 'currentTel': false,
					//通訊address
					'sameAdd': false, 'currentPost': true, 'currentCity': true, 'currentTown': true, 'currentAddr': true,

					'education': true,
					'elemSchool': true,
					'birthday': true,
					//公司
					'compName': true, 'compId': true,
					//公司address
					'compPost': true, 'compCity': true, 'compTown': true, 'compAddr': true,
					//公司tel
					'compTelArea': true, 'compTel': true,
					'industryType': true, 'industryText': false,
					'posTitle': true,
					'workYear': true,
					'avgSalary': true,
					'billMailAddr': false,
					'branchId': false,
					'channel': false
				};

				//==education==//
				data.education = {
					1: '博、碩士',
					2: '大學、大專',
					3: '高中職',
					4: '國中、國小'
				};
				//==mail==//
				data.billMailAddr = {
					1: '同戶籍地址',
					2: '同通訊地址',
					3: '同公司地址'
				}
				//==industry==//
				data.industry = [
					'軍警',
					'公務員',
					'教育',
					'企業',
					'醫師',
					'會計師',
					'建築師',
					'律師',
					'電子',
					'資訊',
					'機械',
					'土木',
					'醫療',
					'金融/保險',
					'餐旅',
					'營造',
					'運輸',
					'自由業',
					'家管'
				];

				//==檢附資料設定==// 請參考imageUploadDirective.js設定
				data.upload = {
					'money': {
						name: i18n.getStringByTag('CTRL_APPLY.INPUT.finProof'), //'財力證明',
						save_name: 'finProof',
						max_num: 3
					},
					'identity': {
						name: i18n.getStringByTag('CTRL_APPLY.INPUT.idCopy'), //'身分證[正/反]影本',
						save_name: 'idCopy',
						max_num: 2
					}
				}

				if (typeof key != 'undefined') {
					if (key === 'post') {
						key = 'area';
					}
					data = (typeof data[key] != 'undefined')
						? data[key]
						: {};
					if (typeof subkey !== 'undefined') {
						data = (typeof data[subkey] !== 'undefined')
							? data[subkey]
							: false;
					}
				}
				return data;
			}

			/**
			 * [getRequireList 欄位設定資料取得]
			 * @param  {[type]} user_type [卡友/非卡友]
			 * @return {[type]}           [description]
			 */
			this.getRequireList = function (user_type) {
				var required_list = MainClass.getApplySetData('required');
				//==卡友調整==//
				if (user_type) {
					var tmp_list = MainClass.getApplySetData('have_card_input');
					var tmp = {};
					for (key in tmp_list) {
						key = tmp_list[key];
						if (typeof required_list[key] !== 'undefined') {
							tmp[key] = required_list[key];
						}
					}
					required_list = tmp;
					required_list.compName = false;
					required_list.compId = false;
					required_list.compPost = false;
					required_list.compCity = false;
					required_list.compTown = false;
					required_list.compAddr = false;
					required_list.compTelArea = false;
					required_list.compTel = false;
					required_list.posTitle = false;
					required_list.workYear = false;
					required_list.avgSalary = false;
				}
				return required_list;
			}

			/**
			 * [checkApplyForm 表單檢查]
			 * @param  {[type]} user_type [使用者類型]
			 * @param  {[type]} inp_data  [表單資料]
			 * @return {[type]}           [description]
			 */
			this.checkApplyForm = function (user_type, inp_data) {
				var data = {
					status: false,
					msg: 'INPUT_ERROR',
					inp: {},
					error_list: {}
				}
				data.inp = inp_data;
				if (typeof data.inp.show === 'undefined') {
					data.inp.show = {};
				}
				var required_list = MainClass.getRequireList(user_type);
				if (inp_data.sameAdd) {
					required_list.currentPost = false;
					required_list.currentCity = false;
					required_list.currentTown = false;
					required_list.currentAddr = false;
				}

				// 家管或自由業公司資料免填
				if (!user_type && (inp_data.industryType == '家管' ||  inp_data.industryType == '自由業')) {
					required_list.compName = false;
					required_list.compId = false;
					required_list.compPost = false;
					required_list.compCity = false;
					required_list.compTown = false;
					required_list.compAddr = false;
					required_list.compTelArea = false;
					required_list.compTel = false;
					required_list.posTitle = false;
					required_list.workYear = false;
					required_list.avgSalary = false;

				}else if (!user_type) {
					required_list.compName = true;
					required_list.compId = true;
					required_list.compPost = true;
					required_list.compCity = true;
					required_list.compTown = true;
					required_list.compAddr = true;
					required_list.compTelArea = true;
					required_list.compTel = true;
					required_list.posTitle = true;
					required_list.workYear = true;
					required_list.avgSalary = true;
				}
		
				//==檢查空資料==//
				var result;
				data.error_list = {};
				for (key in required_list) {
					if (required_list[key]) {
						result = formServices.checkEmpty(inp_data[key]);
						if (!result.status) {
							$log.debug('check empty :' + key);
							//==地址特殊處理==//
							if (['currentPost', 'currentCity', 'currentTown', 'currentAddr'].indexOf(key) > -1) {
								key = 'currentEmpty';
							}
							data.error_list[key] = result.msg;
						}
					}
				}

				//----------細部檢查----------//
				var inp_key = '';
				var inp_sub_key = [];
				//==identity==//
				inp_key = 'idNo';
				if (typeof data.error_list[inp_key] === 'undefined') {
					result = formServices.checkIdentity(inp_data[inp_key]);
					if (!result.status) {
						data.error_list[inp_key] = result.msg;
					}
				}

				//==email==//
				inp_key = 'email';
				if (typeof data.error_list[inp_key] === 'undefined') {
					result = formServices.checkEmail(inp_data[inp_key]);
					if (!result.status) {
						data.error_list[inp_key] = result.msg;
					}
				}

				
				//==居住地址==//
				inp_key = 'currentAddr';
				if (formServices.checkEmpty(inp_data[inp_key], true)
					&& typeof data.error_list[inp_key] === 'undefined'
				) {
					result = formServices.checkCnName(inp_data[inp_key]);
					if (!result.status) {
						data.error_list[inp_key] = result.msg;
					}
				}

				
				
				//==mobile==//
				inp_key = 'mobile';
				if (typeof data.error_list[inp_key] === 'undefined') {
					result = formServices.checkMobile(inp_data[inp_key]);
					if (!result.status) {
						data.error_list[inp_key] = result.msg;
					}
				}


				//==cn nmae==//
				inp_key = 'cnName';
				if (typeof data.error_list[inp_key] === 'undefined') {
					result = formServices.checkCnNameNew(inp_data[inp_key]);
					if (!result.status) {
						data.error_list[inp_key] = result.msg;
					}
				}

				//==en nmae==//
				inp_key = 'enName';
				if (required_list[inp_key] && typeof data.error_list[inp_key] === 'undefined') {
					result = formServices.checkEnglish(inp_data[inp_key], true);
					if (!result.status) {
						data.error_list[inp_key] = result.msg;
					}
				}

				//==birthday==//
				inp_key = 'birthday';
				if (typeof data.error_list[inp_key] === 'undefined') {
					result = formServices.checkDate(inp_data[inp_key]);
					if (!result.status) {
						data.error_list[inp_key] = result.msg;
					} else {
						data.inp[inp_key] = result.formate;
					}
				}

				//==year==// 「平均月收入(萬)」與「年資」輸出皆為正整數
				inp_key = 'workYear';
				if (formServices.checkEmpty(inp_data[inp_key], true)
					&& typeof data.error_list[inp_key] === 'undefined'
				) {
					result = formServices.checkNumber(inp_data[inp_key], 'positive');
					if (!result.status) {
						data.error_list[inp_key] = result.msg;
					}
				}

				//==salary==// 「平均月收入(萬)」與「年資」輸出皆為正整數
				inp_key = 'avgSalary';
				if (formServices.checkEmpty(inp_data[inp_key], true)
					&& typeof data.error_list[inp_key] === 'undefined'
				) {
					result = formServices.checkNumber(inp_data[inp_key], 'positive');
					if (!result.status) {
						data.error_list[inp_key] = result.msg;
					}
				}

				//==branch==//
				inp_key = 'branchId';
				if (formServices.checkEmpty(inp_data[inp_key], true)
					&& typeof data.error_list[inp_key] === 'undefined'
				) {
					result = branchServices.checkData('branch_id', inp_data[inp_key]);
					if (!result.status) {
						data.error_list[inp_key] = result.msg;
					} else {
						data.inp.show[inp_key] = result.data;
					}
				}
				//==畢業國小==//
				inp_key = 'elemSchool';
				if (formServices.checkEmpty(inp_data[inp_key], true)
					&& typeof data.error_list[inp_key] === 'undefined'
				) {
					result = formServices.checkCnName(inp_data[inp_key]);
					if (!result.status) {
						data.error_list[inp_key] = result.msg;
					}
				}
				//==非卡友判斷==//
				if (!user_type) {

					//==電話==//
					inp_key = 'currentTel';
					inp_sub_key = ['currentTelArea', 'currentTel'];
					if ((formServices.checkEmpty(inp_data[inp_sub_key[0]], true)
						|| formServices.checkEmpty(inp_data[inp_sub_key[1]], true)
					) && typeof data.error_list[inp_key] === 'undefined'
					) {
						result = formServices.checkTelphone({
							area: inp_data[inp_sub_key[0]],
							tel: inp_data[inp_sub_key[1]]
						});
						if (!result.status) {
							data.error_list[inp_key] = result.msg;
						}
					}

					//==公司電話==//
					inp_key = 'compTel';
					inp_sub_key = ['compTelArea', 'compTel'];
					if ((formServices.checkEmpty(inp_data[inp_sub_key[0]], true)
						|| formServices.checkEmpty(inp_data[inp_sub_key[1]], true)
					) && typeof data.error_list[inp_key] === 'undefined'
					) {
						result = formServices.checkTelphone({
							area: inp_data[inp_sub_key[0]],
							tel: inp_data[inp_sub_key[1]]
						});
						if (!result.status) {
							data.error_list[inp_key] = result.msg;
						}
					}
					
					//==公司地址==//
					inp_key = 'compAddr';
					if (formServices.checkEmpty(inp_data[inp_key], true)
						&& typeof data.error_list[inp_key] === 'undefined'
					) {
						result = formServices.checkCnName(inp_data[inp_key]);
						if (!result.status) {
							data.error_list[inp_key] = result.msg;
						}
					}

					//==公司名稱==//
					inp_key = 'compName';
					if (formServices.checkEmpty(inp_data[inp_key], true)
						&& typeof data.error_list[inp_key] === 'undefined'
					) {
						result = formServices.checkCnName(inp_data[inp_key]);
						if (!result.status) {
							data.error_list[inp_key] = result.msg;
						}
					}

					//==公司統編==//
					inp_key = 'compId';
					if (formServices.checkEmpty(inp_data[inp_key], true)
						&& typeof data.error_list[inp_key] === 'undefined'
					) {
						result = formServices.checkLength(inp_data[inp_key], 10, 'max');
						result2 = formServices.checkENnumber(inp_data[inp_key]);
						if(!result2.status){
							data.error_list[inp_key] = result2.msg;
						}else if (!result.status) {
							data.error_list[inp_key] = result.msg;
						}
					}

					//==職稱==//
					inp_key = 'posTitle';
					if (formServices.checkEmpty(inp_data[inp_key], true)
						&& typeof data.error_list[inp_key] === 'undefined'
					) {
						result = formServices.checkCnEN(inp_data[inp_key]);
						if (!result.status) {
							data.error_list[inp_key] = result.msg;
						}
					}

					//==industryType==//
					inp_key = 'industryType';
					if (formServices.checkEmpty(inp_data[inp_key], true)
						&& typeof data.error_list[inp_key] === 'undefined'
					) {
						if (inp_data[inp_key] === 'other') {
							result = formServices.checkEmpty(inp_data['industryText']);
							if (!result.status) {
								data.error_list[inp_key] = result.msg;
							}
						}
					}

					//-----------代號處理---------------//

					//==education==//
					inp_key = 'education';
					data.inp.show[inp_key] = '';
					if (typeof data.error_list[inp_key] === 'undefined'
						&& formServices.checkEmpty(inp_data[inp_key], true)
					) {
						result = MainClass.getApplySetData(inp_key, inp_data[inp_key]);
						if (result) {
							data.inp.show[inp_key] = result;
						}
					}
					//==billMailAddr==//
					inp_key = 'billMailAddr';
					data.inp.show[inp_key] = '';
					if (typeof data.error_list[inp_key] === 'undefined'
						&& formServices.checkEmpty(inp_data[inp_key], true)
					) {
						result = MainClass.getApplySetData(inp_key, inp_data[inp_key]);
						if (result) {
							data.inp.show[inp_key] = result;
						}
					}

					//==area==//
					var tmp_area_check = [
						{ 'post': 'currentPost', 'city': 'currentCity', 'area': 'currentTown' },
						{ 'post': 'compPost', 'city': 'compCity', 'area': 'compTown' }
					];
					var tmp_area;
					for (tmp_key in tmp_area_check) {
						for (tmp_check_key in tmp_area_check[tmp_key]) {
							tmp_area = tmp_area_check[tmp_key][tmp_check_key];
							data.inp.show[tmp_area] = '';
							if (typeof inp_data[tmp_area] !== 'undefined'
								&& formServices.checkEmpty(inp_data[tmp_area], true)
							) {
								result = areaServices.checkData(tmp_check_key, inp_data[tmp_area]);
								if (!result.status) {
									data.error_list[tmp_area] = result.msg;
								} else {
									data.inp.show[tmp_area] = result.data;
								}
							}
						}
					}
				}
				//==非卡友判斷 END==//

				//==check end==//
				if (Object.keys(data.error_list).length === 0) {
					data.status = true;
					data.msg = '';
					return data;
				}
				return data;
			}
			//==checkApplyForm end==//

			/**
			 * [modifyUploadData 修正圖片上傳資料]
			 * @param  {[type]} upload_data [圖片資料]
			 * @return {[type]}             [description]
			 */
			this.modifyUploadData = function (upload_data) {
				var data = {};
				var upload_set = MainClass.getApplySetData('upload');
				var real_name;
				for (key in upload_data) {
					real_name = key;
					if (typeof upload_set[key] !== 'undefined'
						&& typeof upload_set[key]['save_name'] !== 'undefined') {
						real_name = upload_set[key]['save_name'];
					}
					data[real_name] = upload_data[key];
				}
				return data;
			}
			//==modifyUploadData end==//

			/**
			 * 檢查信用卡申請身分證欄位
			 * @param {*} idno 
			 */
			this.checkUserId = function (idno) {
				var output = '';
				var result = formServices.checkIdentity(idno);
				if (result.status) {
					output = result.data;
				}
				return output;
			}

		});
		//=====[applyServices END]=====//

		//=====[applyServices START 申請相關]=====//
		MainApp.register.service("applySaveServices", function (
			cardServices, applyServices
			, fc000101Telegram, fc000102Telegram
		) {

			/**
			 * [saveApplyData description]
			 * @param  {[type]} card_id   [卡片編號]
			 * @param  {[type]} user_type [卡友/非卡友]
			 * @param  {[type]} set_data  [儲存的資料]
			 *                   upload_image 儲存的圖片資料
			 * @return {[type]}           [description]
			 */
			this.saveApplyData = function (card_id, user_type, set_data) {
				var data = {
					status: false,
					msg: 'FC0001_004'
				}
				var inp_data = {};

				var result;
				//==卡片檢查==//
				result = cardServices.getCardData(card_id);
				if (Object.keys(result).length <= 0) {
					data.msg = 'FC0001_001';
					return data;
				}
				//==表單檢查==//
				result = applyServices.checkApplyForm(user_type, set_data);
				if (!result.status) {
					data.msg = result.msg;
					return data;
				}
				inp_data = result.inp;
				//==參數設定==//
				var save_data = {};
				var verif_data = (typeof set_data.upload_image !== 'undefined')
					? applyServices.modifyUploadData(set_data.upload_image)
					: {};

				//---[需要類型轉換為文字的資料]---//
				var transfer_data = [
					'currentCity', 'currentTown', 'compCity', 'compTown'
				];
				var required_list = applyServices.getRequireList(user_type); //欄位必填
				//==參數調整==//
				save_data.creditCardType = card_id;
				save_data.applyUserType = user_type;
				for (key in required_list) {
					if (!required_list[key]
						&& typeof inp_data[key] === 'undefined' && inp_data[key] === ''
					) {
						continue;
					}
					save_data[key] = inp_data[key];
					if (transfer_data.indexOf(key) > -1 && typeof inp_data['show'][key] !== 'undefined') {
						save_data[key] = inp_data['show'][key];
					}
				}
				//==特殊處理==//
				if (typeof save_data['industryType'] !== 'undefined' && save_data['industryType'] === 'other') {
					save_data['industryType'] = inp_data['industryText'];
				}

				var upload_empty = false;
				//==method==//
				var upload_method = function (success, resultObj) {
					if (!success || upload_empty) {
						applyServices.getErrorMsg('FC0001_005');
						return false;
					}
					applyServices.getErrorMsg('FC0001_006');
					return true;
				}
				var apply_method = function (success, resultObj) {
					if (!success || typeof success !== "string") {
						applyServices.getErrorMsg('FC0001_004');
						return false;
					}
					var upload_data = (typeof set_data.upload_image !== 'undefined')
						? applyServices.modifyUploadData(set_data.upload_image)
						: {};
					if (typeof set_data.upload_image_empty !== 'undefined' && set_data.upload_image_empty) {
						upload_empty = true;
					}

					upload_data.txNo = success;
					var result = fc000102Telegram.saveData(1, upload_data, upload_method);
					//==送電文前的檢查異常==//
					if (!result.status) {
						applyServices.getErrorMsg('FC0001_005', result.msg);
						return data;
					}
				} //apply_method
				var verification_suc = function (success, resultObj) {
					console.error('success', success, resultObj)
					if (!success) {
						applyServices.getErrorMsg('FC0001_007');
						return false;
					}
					return fc000101Telegram.saveData(save_data, apply_method);
				}
				//==send==//
				// result = fc000101Telegram.saveData(save_data,apply_method);
				result = fc000102Telegram.saveData(5, verif_data, verification_suc)
				//==送電文前的檢查異常==//
				if (!result) {
					data.msg = 'FC0001_004';
					return data;
				}

				data.status = true;
				data.msg = '申請請求已送出';
				return data;
			}
			//==saveData end==//
		});
		//=====[applyServices END]=====//



	});
