/**
 * [申請信用卡Ctrl]
 * applyCtrl : 卡片申請
 */
define([
	'app'
	//==Directive==//
	, 'directive/applyDirective'
	, 'directive/templateDirective'
	, 'directive/imageUploadDirective'
	, 'directive/signatureDirective'
	, 'directive/checkDirective'
	//==Services==//
	, 'service/cardServices'
	, 'service/applyServices'
	, 'service/loginServices'
	, 'modules/telegram/qrcodePay/qrcodePayTelegram'
	, 'modules/service/qrcodePay/qrcodePayServices'
], function (MainApp) {

	/**
	 * [applyCtrl] 卡片申請
	 * @param  {[type]} $scope			[description]
	 * @param  {[type]} $state			[description]
	 */
	MainApp.register.controller('applyCtrl'
		, function (
			$scope, $state, $stateParams, $compile, $element, i18n
			, cardServices, applyServices, applySaveServices
			, loginServices, qrCodePayTelegram, qrcodePayServices, sysCtrl
		) {
			MainUiTool.setSectionClass('has_subtitle'); //section add class : 有大副標或者步驟列時使用的框架樣式
			//==變數設定==//
			//以卡辦卡信用卡類別
			$scope.credit_Type = (typeof $stateParams.credit_type !== 'undefined') ? $stateParams.credit_type : null;
			//==身分證檢核==//
			$scope.setUserId = '';
			$scope.fixUserId = false; // 允許輸入身分證: true 不允許, false 允許
			//申請的新用卡編號
			$scope.creditCardType = $stateParams.card_id;
			$scope.applyUserType = 0; //0:非卡友申請/1:卡友
			//==新增channel==//
			$scope.inp = {};
			$scope.channel = '';
			//==顯示設定==//
			$scope.showBoxStep = 0; //顯示階段
			$scope.haveBox = {
				'agree': 1
			}
			//==卡片資料檢查==//
			$scope.card_data = cardServices.getCardData($scope.creditCardType);
			if (Object.keys($scope.card_data).length <= 0) {
				applyServices.getErrorMsg('FC0001_001');
				return false;
			}

			var stepName = {
				1: '簽署條款',
				2: '填寫資料',
				3: '資料檢附',
				4: '簽名資料',
				5: '確認資料',
				6: '送件完成'
			};

			/**
			 * [changeViewStep 轉換template]
			 * @param  {[string]} directive_name [directive名稱]
			 * @param  {[number]} step           [頁面page]
			 * @return {[type]}                [description]
			 */
			$scope.changeViewStep = function (step, directive_name) {
				var box_size = Object.keys($scope.haveBox).length + 1;
				if (typeof directive_name !== 'undefined'
					&& typeof $scope.haveBox[directive_name] === 'undefined') {
					if (step !== box_size) {
						applyServices.getErrorMsg('STEP_ERROR');
						return false;
					}
					$scope.haveBox[directive_name] = step;
					var tmp_html = '<div class="step_box step' + step + '"><' + directive_name + '/></div>';
					$element.append($compile(tmp_html)($scope));
					box_size++;
				}
				if (box_size < step) {
					applyServices.getErrorMsg('STEP_ERROR');
					return false;
				}

				if ($scope.showBoxStep >= 1) {
					CelebrusInsertTool.celetbrslnsertClickEvent("step_" + $scope.showBoxStep + "_" + stepName[$scope.showBoxStep] + "_next");
				}
				CelebrusInsertTool.reinitialise("step_" + step + "_" + stepName[step]);

				$scope.showBoxStep = step;
				$element.find('.step_box').css('display', 'none');
				$element.find('.step_box.step' + step).css('display', 'block');
				MainUiTool.showProgressBar($scope.showBoxStep);

				MainUiTool.setSectionClass('pic_upload signature', true);
				switch (step) {
					case 3:
						MainUiTool.setSectionClass('pic_upload');
						break;
					case 4:
						MainUiTool.setSectionClass('signature');
						break;
				}
			}
			$scope.sameAddress = function () {
				if ($scope.inp.sameAdd) {	//同戶籍
					$scope.inp.currentPost = "";
					$scope.inp.currentCity = "";
					$scope.inp.currentTown = "";
					$scope.inp.currentAddr = "通訊地址同戶籍地址";
				} else {
					$scope.inp.currentAddr = "";
				}
			}
			if ($scope.credit_Type) {
				if ($scope.credit_Type === "other") {
					$scope.applyUserType = 0;
					$scope.channel = '1';
				} else {
					$scope.applyUserType = 1;
					$scope.channel = '2';
				}
				$scope.setUserId = (typeof $stateParams.idno !== 'undefined') ? $stateParams.idno : ''; // 以卡辦卡才處理身分證
				$scope.changeViewStep(1);
			} else {
				//登入加辦
				//==需要登入==//
				var isLogin = loginServices.checkLogin({ showLoginMenu: true });
				$scope.channel = '3';
				if (isLogin) {
					$scope.applyUserType = 0;
					$scope.form3 = {};
					//console.log("aa:"+typeof (sysCtrl.getUserModel().userId).valueOf());
					//console.log("bb:"+typeof (sysCtrl.getUserModel().userId));
					$scope.form3.custId = (sysCtrl.getUserModel().userId).valueOf();
					$scope.setUserId = $scope.form3.custId;
					//$scope.form3.custId = scope.form3.custId11.userId;
					//alert(JSON.stringify($scope.form3.custId));
					qrCodePayTelegram.send('qrcodePay/fc001001', $scope.form3, function (res, resultHeader) {
						//檢查帳戶清單是否為空，若為空值提示臨櫃申請後結束
						//alert(JSON.stringify(res));
						//alert(res.result);
						if (res) {
							$scope.applyUserType = 1;
							$scope.channel = '4';
							//alert($scope.applyUserType+99);
						}
						$scope.changeViewStep(1);
					});
					//alert($scope.applyUserType+"2");
				}
			}


			//==進度條設定==// 搬離section
			MainUiTool.showProgressBar(1, {
				'bar': {
					1: '簽署條款',
					2: '填寫資料',
					3: '資料檢附',
					4: '簽名資料',
					5: '確認資料',
					6: '送件完成'
				},
				'event': function (step) {
					if (step < $scope.showBoxStep) {
						$scope.showBoxStep = step;
						$scope.$apply();
						$scope.changeViewStep(step);
					}
				}
			});
			//==Step1.同意條款設定==//

			$scope.templateAgreeInformation = $scope.card_data.agree_list;
			//debugger;
			//alert($scope.card_data.name);
			//==Step2.同意條款檢查，進入表單頁==//
			$scope.stepChangeToForm = function (form_type) {
				//alert($scope.applyUserType);
				var checkbox_obj_num = $element.find('#apply_agree input[type=checkbox]').length;
				if (checkbox_obj_num < 1) {
					applyServices.getErrorMsg('ERROR_CONNECTION');
					return false;
				}
				var checked_list_num = $element.find('#apply_agree input[type=checkbox]:checked').length;
				if (checked_list_num !== checkbox_obj_num) {
					applyServices.getErrorMsg('AGREE_PROVISION');
					return false;
				}

				// == 強制指定身分證 == //
				var check_user_id = applyServices.checkUserId($scope.setUserId);
				if (check_user_id !== '') {
					$scope.fixUserId = true;
					$scope.setUserId = check_user_id;
				} else {
					$scope.setUserId = '';
				}


				$scope.applyFormList = applyServices.getApplySetData();
				$scope.changeViewStep(2, 'apply-form-directive');
			}
			//==Step3.表單檢查，進入上傳頁==//
			$scope.stepChangeToUpload = function () {
				CelebrusInsertTool.manualAddTextChange("Apply_Card_ID", "Apply_Card_ID", $scope.setUserId);
				CelebrusInsertTool.celetbrslnsertClickEvent("Apply_Card_ID");

				$scope.error_msg_list = {};
				if (!$scope.fixUserId) { // 非強制只顯示
					$scope.inp.idNo = angular.element('apply-form-directive').find('input[identity-mask-directive]').data('realvalue');
				}
				var result = applyServices.checkApplyForm($scope.applyUserType, $scope.inp);
				if (!result.status) {
					applyServices.getErrorMsg(result.msg);
					$scope.error_msg_list = result.error_list;
					return false;
				}
				$scope.inp = result.inp; //重新逞理資料
				//==圖片資料設定==//
				$scope.imageUploadSet = {};
				$scope.imageUploadSet.list = applyServices.getApplySetData('upload');
				$scope.imageUploadSet.button_row = {
					'btn1': {
						name: '稍後上傳',
						success: $scope.stepChangeToSignature
					},
					'btn2': {
						name: i18n.getStringByTag('BTN.NEXT'),
						success: $scope.stepChangeToSignature
					}
				};
				$scope.changeViewStep(3, 'image-upload-directive');
			}
			//==Step4. 檢附資料檢查，進入簽名檔頁==//
			$scope.stepChangeToSignature = function (btn_key) {
				$scope.inp.upload_image_empty = (btn_key === 'btn1') ? true : false;
				if (btn_key !== 'btn1' && Object.keys($scope.imageUploadData).length < 1) {
					applyServices.getErrorMsg('FC0001_002');
					return false;
				}
				//==判斷身分證必上傳兩張==//
				if (btn_key !== 'btn1' && typeof $scope.imageUploadData.identity !== 'undefined'
					&& $scope.imageUploadData.identity.length !== $scope.imageUploadSet.list.identity.max_num
				) {
					applyServices.getErrorMsg('FC0001_003');
					return false;
				}
				//==簽名檔資料設定==//
				$scope.signatureSet = {
					check_name: i18n.getStringByTag('BTN.NEXT'),
					success: $scope.stepChangeToCheck
				};
				$scope.changeViewStep(4, 'signature-directive');
			}
			//==Step5. 簽名檔檢查，進入確認頁==//
			$scope.stepChangeToCheck = function () {
				if (typeof $scope.signatureData === 'undefined' || !$scope.signatureData) {
					applyServices.getErrorMsg('SIGN');
					return false;
				}
				$scope.changeViewStep(5, 'apply-check-directive');
				//==重新產生圖形驗證碼==//
				// if($scope.haveBox['apply-check-directive']
				// 	&& typeof $scope.captchaChange === 'function'
				// ){
				// 	// $scope.captchaChange();
				// }
			}
			//==表單送出==//
			$scope.applySend = function () {
				CelebrusInsertTool.celetbrslnsertClickEvent("step_5_" + stepName[5] + "_next");
				//==使用captchaDirective::checkCaptchaDirective即會產生==//
				if (typeof $scope.checkCaptchaData === 'undefined'
					|| typeof $scope.checkCaptchaData.check_method !== 'function'
				) {
					applyServices.getErrorMsg('ERROR_CONNECTION');
					return false;
				}
				//==圖形驗證碼==//
				if (!$scope.checkCaptchaData.check_method()) {
					applyServices.getErrorMsg('CAPTCHA');
					return false;
				}
				//==表單檢查==//
				$scope.inp.channel = $scope.channel;
				var result = applyServices.checkApplyForm($scope.applyUserType, $scope.inp);
				if (!result.status) {
					applyServices.getErrorMsg(result.msg);
					$scope.error_msg_list = result.error_list;
					$scope.changeViewStep(2);
					return false;
				}
				//==簽名檔檢查==//
				if (typeof $scope.signatureData === 'undefined' || !$scope.signatureData) {
					applyServices.getErrorMsg('SIGN');
					$scope.changeViewStep(4);
					return false;
				}
				//==send==//
				var save_data = $scope.inp;
				save_data.upload_image = $scope.imageUploadData;
				save_data.upload_image['signiture'] = [];
				save_data.upload_image['signiture'].push($scope.signatureData);
				save_data.upload_image['captchaVal'] = $scope.checkCaptchaData.input;
				result = applySaveServices.saveApplyData($scope.creditCardType, $scope.applyUserType, save_data);
				if (!result.status) {
					applyServices.getErrorMsg(result.msg);
					return false;
				}
				CelebrusInsertTool.reinitialise("step_6_" + stepName[6]);
				return true;
			}


		});
	//=====[applyCtrl END]=====//




});
