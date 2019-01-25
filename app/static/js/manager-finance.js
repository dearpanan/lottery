var renewHight = function (a) {
	if (typeof window.parent.resetWindowHight !== 'undefined') {
		window.parent.resetWindowHight(parseInt(a, 10));
	}
};

var reTop = function (a) {
	if (typeof window.parent.resetToTop !== 'undefined') {
		window.parent.resetToTop();
	}
};

/*财务中心开始*/
var initThisPage01_fin = function () {
	var valueOfType = function (code) {
		/*if (code == 'baofoo') {
			return '宝付支付';
		}
		if (code == 'ecpss') {
			return '汇潮支付';
		}
		if (code == 'gopay') {
			return '国付宝支付';
		}
		if (code == 'ips') {
			return '环迅支付';
		}
		if (code == 'mobao') {
			return '摩宝支付';
		}
		if (code == 'newpay') {
			return '新生支付';
		}
		if (code == 'tonghui') {
			return '通汇支付';
		}
		if (code == 'yeepay') {
			return '易宝支付';
		}*/
	};

	//if (typeof QueryString.iframe !='undefined') {
	//  $('.menu02,.nav').hide();
	//}

	var thisContent = $('[data-init="content"]').eq(0);
	var thisForm = thisContent.find('.recharge-form');

	var transfersSection = thisForm.find('.section').eq(0);
	var transfersStep1 = transfersSection.find('[data-step="one"]');
	var transfersStep2 = transfersSection.find('[data-step="two"]');

	var onlinePaySection = thisForm.find('.section').eq(1);
	var onlinePayStep1 = onlinePaySection.find('[data-step="one"]');
	var onlinePayStep2 = onlinePaySection.find('[data-step="two"]');

	var qrPaySection = thisForm.find('.section').eq(2);
	var qrPayStep1 = qrPaySection.find('[data-step="one"]');
	var qrPayStep2 = qrPaySection.find('[data-step="two"]');

	var isLoading = false;
	var listPayment = function () {
		PaymentCtrl.requestAllMethod({
			beforeSend: function () {
				isLoading = true;
				App.blockUI({
					target: thisContent,
					boxed: true
				});
			},
			success: function (response) {
				if (response.error == 0) {
					//console.log(response.data)
					//console.log(response.data,'response.data');
					if (response.data.thridList.length) {
						$('.rechargerate').text((response.data.thridList[0].rate * 100) + '%');
					}
					buildPayment(response.data);
				}
				if (response.error == 1) {
					App.alert('warning', '提示消息', response.message);
				}
			},
			complete: function () {
				isLoading = false;
				App.unblockUI(thisContent);
			}
		});
	};
	//判断是否绑定银行卡
	var allqcodeDict = {};
	var buildPayment = function (data) {
		if (!data.rechargeConfig.isOpen) {
			App.alert('warning', '提示消息', data.rechargeConfig.serviceMsg, 3000);
			return;
		}
		var transferList = data.transferList;
		var thridList = data.thridList;
		var qrcodeList = data.qrCodeList;
		var hasPayMethod = false;
		var payType = thisForm.find('.pay-type');
		var thisAlipayItem;
		var transCard = {};
		// $('.pay-type .rechargerate').html(data['withdrawConfig']+'%');
		payType.find('label').remove();
		if (transferList != undefined && transferList.length != 0) {
			hasPayMethod = true;
			$.each(transferList, function (i, val) {
				thisAlipayItem = $('<label><input name="payType" type="radio" btype="' + val.bankType + '">' + (val.bankType == '5' ? '网银转账' : '支付宝银行' + i) + '</label>');
				if (typeof transCard[val.bankType] == 'undefined') {
					transCard[val.bankType] = [val];
				} else {
					transCard[val.bankType].push(val);
				}
				thisAlipayItem.find('input[type="radio"]').unbind().click(function () {
					$(this).parent().addClass('active').siblings().removeClass('active');
					if (!transfersSection.hasClass('active')) {
						transfersSection.addClass('active');
						onlinePaySection.removeClass('active');
						qrPaySection.removeClass('active');
						qrPayStep1.find('input[name="amount2"]').val('');
					}

					minOnlineRecharge = val.minUnitRecharge;
					maxOnlineRecharge = val.maxUnitRecharge;
					$('.recharge-form .rechargerate').html('0%');
					$('span[data-field="min-amountt"]').html(minOnlineRecharge);
					$('span[data-field="max-amountt"]').html(maxOnlineRecharge);
					//buildTransfers(transferList);
					//console.log(transCard[val.bankType],'transCard[val.bankType]transCard[val.bankType]transCard[val.bankType]');
					if (val.bankType == '5') {
						transfersSection.find('#payfuyan input').attr('placeholder', '付款人真实姓名');
						transfersSection.find('#payfuyan .label').last().html('请一定要输入正确的付款人姓名，否则无法到帐');
					} else {
						transfersSection.find('#payfuyan input').attr('placeholder', '支付宝付款人真实姓名');
						transfersSection.find('#payfuyan .label').last().html('请一定要输入正确的支付宝姓名，否则无法到帐');
					}

					buildTransfers(transCard[val.bankType]);
					setTransfersStep1();
				});
				payType.append(thisAlipayItem);
			});
		}

		if (thridList != undefined && thridList.length != 0) {
			hasPayMethod = true;
			//console.log(thridList,'thridListthridList');
			$.each(thridList, function (i, val) {
				var thisItem = $('<label><input name="payType" rate="' + val.rate + '" type="radio" typeid="' + val.channelCode + '"> ' + val.name + '</label>');
				thisItem.find('input[type="radio"]').unbind().click(function () {
					$(this).parent().addClass('active').siblings().removeClass('active');
					if (!onlinePaySection.hasClass('active')) {
						onlinePaySection.addClass('active');
						transfersSection.removeClass('active');
						qrPaySection.removeClass('active');
						qrPayStep1.find('input[name="amount2"]').val('');
					}
					$('.recharge-form .rechargerate').html((val['rate'] * 100) + '%');
					$('[data-field="end-amount"]').html('~');
					$("#rate_").html((val['rate'] * 100).toFixed(2));
					buildOnlinePay(val);
					fixedAmountFn(val);
					setOnlinePayStep1();
				});
				payType.append(thisItem);
				if (i == 0) {
					thisItem.find('input[type="radio"]').trigger('click');
				}
			});
			//  payType.append(thisAlipayItem);
		}
		// 扫码
		if (qrcodeList != undefined && qrcodeList.length != 0) {
			var nowQritem = null;
			$.each(qrcodeList, function (i, val) {
				allqcodeDict['qr_' + val.id] = val.fileByte;
				if (val.codeType == '4') {
					nowQritem = $('<label class="qrmethod" max=' + val.maxUnitRecharge + ' min=' + val.minUnitRecharge + ' dataId = ' + val.id + ' qtype=' + val.codeType + '><input name="payType" rel="4" " min="' + val.minUnitRecharge + '" max="' + val.maxUnitRecharge + '" type="radio">手机银行二维码<div class="redius"><div></div></div></label>');
				}
				if (val.codeType == '2') {
					nowQritem = $('<label class="qrmethod" max=' + val.maxUnitRecharge + ' min=' + val.minUnitRecharge + ' dataId = ' + val.id + ' qtype=' + val.codeType + '><input name="payType" rel="2" " min="' + val.minUnitRecharge + '" max="' + val.maxUnitRecharge + '" type="radio">微信二维码<div class="redius"><div></div></div></label>');
				}
				if (val.codeType == '3') {
					nowQritem = $('<label class="qrmethod" max=' + val.maxUnitRecharge + ' min=' + val.minUnitRecharge + ' dataId = ' + val.id + ' qtype=' + val.codeType + '><input name="payType" rel="3" " min="' + val.minUnitRecharge + '" max="' + val.maxUnitRecharge + '" type="radio">QQ二维码<div class="redius"><div></div></div></label>');
				} else {
					nowQritem = $('<label class="qrmethod" max=' + val.maxUnitRecharge + ' min=' + val.minUnitRecharge + ' dataId = ' + val.id + ' qtype=' + val.codeType + '><input name="payType" rel="' + val.codeType + '" " min="' + val.minUnitRecharge + '" max="' + val.maxUnitRecharge + '" type="radio">' + val.nickName + '<div class="redius"><div></div></div></label>');
				}
				payType.append(nowQritem);
				//payType.append(thisQQItem);
				//payType.append(thisYHKItem);
			});
			bindQrcodeEvent();
		}
		if (!hasPayMethod) {
			thisContent.find('.wrapper').eq(0).hide();
			thisContent.find('.wrapper').eq(1).show();
		} else {
			thisContent.find('.wrapper').eq(0).show();
			thisContent.find('.wrapper').eq(1).hide();
			thisAlipayItem && thisAlipayItem.find('input[type="radio"]').click();
		}
	};

	/**
	 * 转账汇款
	 */
	var minTransfersRecharge = 0, maxTransfersRecharge = 0;
	var buildTransfers = function (list) {
		//console.log(list,'listlistlistbuildTransfers');
		var generateMixed = function (n) {
			var me = this;
			var res = "";
			var jschars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
			for (var i = 0; i < n; i++) {
				var id = Math.ceil(Math.random() * 35);
				res += jschars[id];
			}
			return res;
		};

		var banklist = transfersStep1.find('.bank-list');
		banklist.empty();
		// 循环显示银行列表
		$.each(list, function (i, val) {
			var item = $('<a class="item">');
			item.append('<i class="checked"></i>');
			item.addClass('b' + val.bankId); // 银行标示
			item.attr('data-pid', val.id);
			item.attr('data-bank-id', val.bankId);
			item.attr('data-link', 'about:blank');
			item.attr('data-bank-name', val.bankName);
			item.attr('data-card-name', val.cardName);
			item.attr('data-card-id', val.cardId);
			item.attr('data-min', val.minUnitRecharge);
			item.attr('data-max', val.maxUnitRecharge);
			item.attr('bankType', val.bankType);
			//item.attr('data-link', val.link);
			banklist.append(item);
		});
		// 绑定选中函数
		banklist.find('.item').unbind().click(function () {
			if (!$(this).hasClass('selected')) {
				banklist.find('.item').removeClass('selected');
				$(this).addClass('selected');
				minTransfersRecharge = Number($(this).attr('data-min'));
				maxTransfersRecharge = Number($(this).attr('data-max'));
				//console.log(minTransfersRecharge,maxTransfersRecharge);
				//transfersStep1.find('input[name="fuyan"]').val(generateMixed(22));
				transfersStep1.find('input[name="pid"]').val($(this).attr('data-pid'));
				transfersStep1.find('[data-field="min-amount"]').html(minTransfersRecharge);
				transfersStep1.find('[data-field="max-amount"]').html(maxTransfersRecharge);

			}
		});
		// 默认选择第一个
		banklist.find('.item').eq(0).trigger('click');
	};

	/**
	 * 在线支付
	 */
	var minOnlineRecharge = 0, maxOnlineRecharge = 0;
	var buildOnlinePay = function (data) {
		onlinePayStep1.find('input[name="pid1"]').val(data.id);
		onlinePayStep1.find('input[name="typeid"]').val(data.channelCode);
		minOnlineRecharge = data.minUnitRecharge;
		maxOnlineRecharge = data.maxUnitRecharge;

		$('span[data-field="min-amountt"]').html(minOnlineRecharge);
		$('span[data-field="max-amountt"]').html(maxOnlineRecharge);
		//console.log(minOnlineRecharge,maxOnlineRecharge,'minOnlineRechargeminOnlineRechargeminOnlineRecharge');

		onlinePayStep1.find('[data-field="min-amount"]').html(minOnlineRecharge);
		onlinePayStep1.find('[data-field="max-amount"]').html(maxOnlineRecharge);
		onlinePayStep1.find('[data-field="deposit-rate"]').html((data.rate * 100).toFixed(2));

		var banklist = onlinePayStep1.find('.bank-list');
		banklist.empty();
		// 循环显示银行列表
		$.each(data.banklist, function (i, val) {
			var item = $('<a class="item">');
			item.append('<i class="checked"></i>');
			item.addClass('b' + val.bankId); // 银行标示
			item.attr('data-code', val.code);
			banklist.append(item);
		});
		// 绑定选中函数
		banklist.find('.item').unbind().click(function () {
			if (!$(this).hasClass('selected')) {
				banklist.find('.item').removeClass('selected');
				$(this).addClass('selected');
				onlinePayStep1.find('input[name="bankco1"]').val($(this).attr('data-code'));

			}
		});
		// 默认选择第一个
		banklist.find('.item').eq(0).trigger('click');
		//
		onlinePayStep1.find('[name="amount1"]').on('blur', function () {
			var lastMoney = Number(onlinePayStep1.find('[name="amount1"]').val()) * parseFloat(data.rate);
			console.log();
			lastMoney = Number(onlinePayStep1.find('[name="amount1"]').val()) - lastMoney;
			if (Number(data.rate) > 0) {
				onlinePayStep1.find('[data-field="end-amount"]').html(Number(lastMoney).toFixed(2));
			} else {
				onlinePayStep1.find('[data-field="end-amount"]').html('~');
			}
		});
	};
	var fixedAmountFn = function (data) {
		if (data.fixedAmount !== null) {
			onlinePayStep1.find('.fix-amount').show(); // 显示固定数额
			onlinePayStep1.find('.pay-amount').hide(); // 把选择银行隐藏
			var html = '<i class="dotball">1</i>选择金额<div class="mask"></div><div class="triangle"></div>';
			onlinePaySection.find('.pay-step tr > td:nth-child(1)').html(html); // 修改标题

			var fixedAmountArr = data.fixedAmount.split(','); // 把字符串转数组
			var ul = onlinePayStep1.find('.fix-amount');
			var li = '';
			for (var i = 0; i < fixedAmountArr.length; i++) {
				li += '<li>';
				li += fixedAmountArr[i];
				li += '</li>';
			}
			ul.empty(); // 清空，之前的数据
			ul.append(li);
			ul.find('li').unbind('click').click(function () {
				var li_index = ul.find('li').index($(this));
				console.log(li_index, 'li的位置');
				ul.find('li').removeClass('active');
				$(this).addClass('active');
				onlinePayStep1.find('input[name="pid1"]').val(data.id); // pid1;
				onlinePayStep1.find('input[name="amount1"]').val(fixedAmountArr[li_index]); // 选择金额
				// onlinePayStep1.find('.bankRate').html(Number(data.rate * 100).toFixed(2)); // 手续费
				// onlinePayStep1.find('[data-field="deposit-rate"]').html(Number(data.rate * 100).toFixed(2)); // 手续费
				onlinePayStep1.find('[data-field="rate"]').html(Number(data.rate * 100).toFixed(2)); // 手续费
				onlinePayStep1.find('[data-field="min-amount"]').html(data.minUnitRecharge); // 最小值
				onlinePayStep1.find('[data-field="max-amount"]').html(data.maxUnitRecharge); // 最大值

				var nowRate = parseFloat(onlinePayStep1.find('.bankRate').text()) / 100;
				var willPay = parseInt(onlinePayStep1.find('input[name="amount1"]').val(), 10);
				onlinePayStep1.find('[data-field="end-amount"]').html(Number(willPay - nowRate * willPay).toFixed(2));
				onlinePayStep1.find('[data-field="end-amount-cut"]').html(Number(nowRate * willPay).toFixed(2));
			});
			// console.log(fixedAmountArr,'fix');
		} else {
			onlinePayStep1.find('.fix-amount').hide();
			onlinePayStep1.find('.pay-amount').show();
			var html = '<i class="dotball">1</i>选择银行并输入金额<div class="mask"></div><div class="triangle"></div>';
			onlinePaySection.find('.pay-step tr > td:nth-child(1)').html(html);
		}
	};
	listPayment();

	/**
	 * 转账逻辑
	 */
	var setTransfersStep1 = function () {
		transfersStep1.show();
		$('.recharge-form input[name="amount1"]').val('');
		$('.recharge-form input[name="amount"]').val('');
		transfersStep2.hide();
		transfersSection.find('.pay-step tr > td').removeClass('current').eq(0).addClass('current');
	};
	transfersStep1.find('input[name="alipayname"]').blur(function () {
		//alert(transfersStep1.find('input[name="alipayname"]').val());
		var fuYan = transfersStep1.find('input[name="fuyan"]');
		fuYan.val($('span[data-field="username"]').first().text() + '' + transfersStep1.find('input[name="alipayname"]').val());
	});
	transfersStep1.find('input[name="next"]').unbind().click(function () {
		var pid = transfersStep1.find('input[name="pid"]').val();
		var fuyans = transfersStep1.find('input[name="fuyan"]').val();
		if (!/^[\u4e00-\u9fa5·]+$/.test(fuyans)) return App.alert('info', '提示消息', '此处请填写支付宝绑定的(真实姓名), 支付宝姓名需为汉字!', 3000);
		var fuYan = AppData.getMainAccount().username + ';' + fuyans;
		var payWay = transfersStep1.find('.bank-list .selected').attr('bankType');
		//console.log(fuYan, 43434343434	)

		var amount = Number(transfersStep1.find('input[name="amount"]').val());
		if (isNaN(amount)) {
			return App.alert('info', '提示消息', '请填写正确的充值金额！', 3000);
		}
		if (amount == 0) {
			return App.alert('info', '提示消息', '充值金额必须大于0元！', 3000);
		}
		if (fuYan == '') {
			return App.alert('info', '提示消息', '附言信息无效！', 3000);
		}
		if (amount < minTransfersRecharge) {
			return App.alert('info', '提示消息', '单笔最低充值金额为' + minTransfersRecharge + '元！', 3000);
		}
		if (amount > maxTransfersRecharge) {
			return App.alert('info', '提示消息', '单笔最高充值金额为' + maxTransfersRecharge + '元！', 3000);
		}
		var data = {pid: pid, amount: amount, fuYan: fuYan};
		if (typeof payWay != 'undefined') {
			data['payWay'] = payWay;
		}
		doPaymentTransfers(data);
	});

	var setTransfersStep2 = function (data) {
		transfersStep1.hide();
		transfersStep2.show();
		transfersSection.find('.pay-step tr > td').removeClass('current').eq(1).addClass('current');

		var bankinfo = transfersStep1.find('.bank-list > .item.selected').clone();
		//console.log(bankinfo,'bankinfobankinfo');

		bankinfo.removeClass('selected');
		transfersStep2.find('.bank-list').css('padding-top', 5).html(bankinfo);
		transfersStep2.find('[data-field="link"]').attr('href', bankinfo.attr('data-link'));

		transfersStep2.find('[data-field="billno"]').html(data.billno);

		var bankName = bankinfo.attr('data-bank-name');
		var cardName = bankinfo.attr('data-card-name');
		var cardId = bankinfo.attr('data-card-id');

		transfersStep2.find('[data-field="bankName"]').html(bankName);
		transfersStep2.find('[data-field="cardName"]').html(cardName);
		transfersStep2.find('[data-field="amount"]').html(data.amount.toFixed(2));
		transfersStep2.find('[data-field="cardId"]').html(cardId);
		transfersStep2.find('[data-field="postscript"]').html(data.attach);

		transfersStep2.find('.cancopy[rel="cardName"]').attr('data-clipboard-text', cardName);
		transfersStep2.find('.cancopy[rel="amount"]').attr('data-clipboard-text', data.amount.toFixed(2));
		transfersStep2.find('.cancopy[rel="cardId"]').attr('data-clipboard-text', cardId);
		transfersStep2.find('.cancopy[rel="postscript"]').attr('data-clipboard-text', data.attach);
		var setCopy = function (els, text) {
			var target = els.parent().find('[data-command="copy"]');
			target.attr('data-clipboard-text', text);
			var clipboard = new Clipboard(target);
			clipboard.on('success', function (e) {
				console.info('Action:', e.action);
				console.info('Text:', e.text);
				console.info('Trigger:', e.trigger);
				App.alert('info', '消息提示', '复制成功『' + text + '』！', 3000);
				e.clearSelection();
			});
			clipboard.on('error', function (e) {
				console.error('Action:', e.action);
				console.error('Trigger:', e.trigger);
			});
			/*var client = new ZeroClipboard(target);
			client.on( "ready", function( readyEvent ) {
			  //client.on('beforecopy', function(e){
			  //  client.setText(text);
			  //});
			  client.on( "aftercopy", function( event ) {
				App.alert('info', '消息提示', '复制成功『'+text+'』！', 3000);
				//alert('复制成功！'+text);
			  });
			}); */

			target.unbind('click').click(function () {

			});
		};

		var clipboard = new Clipboard('.cancopy');
		clipboard.on('success', function (e) {
			//console.info('Action:', e.action);
			//console.info('Text:', e.text);
			//console.info('Trigger:', e.trigger);
			e.clearSelection();
			App.alert('info', '消息提示', e.text + ' 已复制！', 2000);
		});

		clipboard.on('error', function (e) {
			//console.error('Action:', e.action);
			//console.error('Trigger:', e.trigger);
		});
		//setCopy(transfersStep2.find('[data-field="cardName"]'), cardName);
		//setCopy(transfersStep2.find('[data-field="amount"]'), data.amount.toFixed(2));
		//setCopy(transfersStep2.find('[data-field="cardId"]'), cardId);
		//setCopy(transfersStep2.find('[data-field="postscript"]'), data.attach);
		renewHight($('body').height());
	};

	transfersStep2.find('input[name="record"]').unbind().click(function () {
		window.location.href = '/userAccount#page=3_finance';
		//window.location.href = '?key=record';
	});

	transfersStep2.find('input[name="transfers"]').unbind().click(function () {
		window.location.href = '?key=transfers';
	});

	transfersStep2.find('input[name="success"]').unbind().click(function () {
		// TODO
	});

	transfersStep2.find('input[name="back"]').unbind().click(function () {
		reTop();
		setTransfersStep1();
	});

	transfersStep2.find('input[name="kefu"]').unbind().click(function () {
		// TODO
	});
	/**
	 * 扫码
	 */
	var bindQrcodeEvent = function () {
		var allQrTp = $('.pay-type .qrmethod');
		var minQrRecharge, maxQrRecharge, nowQrid, qrType;

		allQrTp.unbind().find('input[type="radio"]').unbind().click(function () {
			$(this).parent().addClass('active').siblings().removeClass('active');
			thisForm.find('.section').removeClass('active');
			qrPaySection.addClass('active');
			qrPayStep1.find('.button-groups').show();
			qrPayStep1.show();
			qrPayStep2.hide();
			var nowTp = $('.pay-type .qrmethod.active');
			minQrRecharge = parseInt(nowTp.find('input[type="radio"]').attr('min'), 10);
			maxQrRecharge = parseInt(nowTp.find('input[type="radio"]').attr('max'), 10);
			var nowrate = Number(nowTp.find('input[type="radio"]').attr('rate')).toFixed(2);
			nowQrid = nowTp.attr('dataid');
			qrType = nowTp.attr('qtype');
			console.log(minQrRecharge, maxQrRecharge, nowQrid, qrType);
			qrPayStep1.find('[data-field="min-amount"]').html(minQrRecharge);
			qrPayStep1.find('[data-field="max-amount"]').html(maxQrRecharge);
			qrPayStep1.find('[data-field="deposit-rate"]').html(nowrate);
		});

		qrPayStep1.find('input[name="next"]').unbind().click(function () {
			var pid = qrPayStep1.find('input[name="pid"]').val();
			var fuYan = $('.user_box p').first().attr('title') + ':' + (typeof qrPayStep1.find('input[name="fuyan"]').val() != 'undefined' ? qrPayStep1.find('input[name="fuyan"]').val() : '');
			console.log(qrPayStep1);
			var amount = Number(qrPayStep1.find('input[name="amount2"]').val());
			if (isNaN(amount)) {
				return App.alert('info', '提示消息', '请填写正确的充值金额！', 3000);
			}
			if (amount == 0) {
				return App.alert('info', '提示消息', '充值金额必须大于0元！', 3000);
			}
			if (fuYan == '') {
				return App.alert('info', '提示消息', '附言信息无效！', 3000);
			}
			if (amount < minQrRecharge) {
				return App.alert('info', '提示消息', '单笔最低充值金额为' + minQrRecharge + '元！', 3000);
			}
			if (amount > maxQrRecharge) {
				return App.alert('info', '提示消息', '单笔最高充值金额为' + maxQrRecharge + '元！', 3000);
			}
			var data = {pid: '', amount: amount, fuYan: fuYan, qrid: nowQrid, payWay: qrType};
			console.log(data);
			doQrcodeTransfers(data);
		});

		qrPayStep2.find('input[name="finish"]').unbind().click(function () {
			qrPayStep1.find('.button-groups').show();
			qrPayStep1.show();
			qrPayStep2.hide();
			qrPayStep1.find('input[name="amount2"]').val('');
			qrPayStep2.find('.ercodeImg img.fl').attr('src', '');
			qrPayStep2.find('.czid').html('');
			qrPayStep2.find('.needamount').html('');
			qrPayStep2.find('.cancopy').attr('data-clipboard-text', '');
		});
	};
	var setQrcodeStep2 = function (res, data) {
		console.log(res);
		qrPayStep1.find('.button-groups').hide();
		qrPayStep2.show();
		qrPayStep2.find('.ercodeImg img.fl').attr('src', 'data:image/gif;base64,' + allqcodeDict['qr_' + data.qrid]);
		qrPayStep2.find('.czid').html(res.billno);
		qrPayStep2.find('.needamount').html(res.amount);
		qrPayStep2.find('.cancopy').attr('data-clipboard-text', res.amount);

		if (typeof qrPayStep2.find('.cancopy').attr('copyed') == 'undefined') {
			var clipboard = new Clipboard('.cancopy');
			clipboard.on('success', function (e) {
				e.clearSelection();
				App.alert('info', '消息提示', e.text + ' 已复制！', 2000);
			});
			qrPayStep2.find('.cancopy').attr('copyed', 1);
		}

	};

	/**
	 * 第三方逻辑
	 */
	var setOnlinePayStep1 = function () {
		onlinePayStep1.show();
		onlinePayStep2.hide();
		$('.recharge-form input[name="amount1"]').val('');
		$('.recharge-form input[name="amount"]').val('');
		onlinePaySection.find('.pay-step tr > td').removeClass('current').eq(0).addClass('current');
	};

	onlinePayStep1.find('input[name="next"]').unbind().click(function () {
		var pid = onlinePayStep1.find('input[name="pid1"]').val();
		var bankco = onlinePayStep1.find('input[name="bankco1"]').val();
		var amount = Number(onlinePayStep1.find('input[name="amount1"]').val());
		var typeid = onlinePayStep1.find('input[name="typeid"]').val();

		onlinePayStep2.find('.button-groups input[name="redirect"]').show();
		if (isNaN(amount)) {
			return App.alert('info', '提示消息', '请填写正确的充值金额！', 3000);
		}
		if (amount == 0) {
			return App.alert('info', '提示消息', '充值金额必须大于0元！', 3000);
		}
		if (amount < minOnlineRecharge) {
			return App.alert('info', '提示消息', '单笔最低充值金额为' + minOnlineRecharge + '元！', 3000);
		}
		if (amount > maxOnlineRecharge) {
			return App.alert('info', '提示消息', '单笔最高充值金额为' + maxOnlineRecharge + '元！', 3000);
		}

		if (typeid == '18071301') {
//			if(amount % 100 == 0){
//				return App.alert('info', '提示消息', '充值金额不能为100的整数倍！', 3000);
//			}
		}

		var data = {pid: pid, bankco: bankco, amount: amount};
		doPaymentThrid(data);
	});

	var setOnlinePayStep2 = function (data) {
		onlinePayStep1.hide();
		onlinePayStep2.show();
		onlinePaySection.find('.pay-step tr > td').removeClass('current').eq(1).addClass('current');

		var bankinfo = onlinePayStep1.find('.bank-list > .item.selected').clone();
		bankinfo.removeClass('selected');
		//console.log(bankinfo,'bankinfobankinfobankinfo');

		onlinePayStep2.find('.bank-list').html(bankinfo);

		onlinePayStep2.find('[data-field="amount"]').html(Number(data.amount).toFixed(2));
		onlinePayStep2.find('[data-field="billno"]').html(data.billno);

		// 自动跳转
		var thisForm = onlinePayStep1.find('form');
		thisForm.attr('action', data.link);
		thisForm.find('input[name="text"]').val(data.text);
	};

	onlinePayStep2.find('input[name="back"]').unbind().click(function () {
		setOnlinePayStep1();
	});

	onlinePayStep2.find('input[name="redirect"]').unbind().click(function () {
		$(this).hide();
		onlinePayStep1.find('form').submit();
	});

	onlinePayStep2.find('input[name="game"]').unbind().click(function () {
		window.location.href = '/';
	});

	/**
	 * 请求第三方充值
	 */
	var doPaymentThrid = function (data) {
		PaymentCtrl.requestThridPay({
			data: data,
			beforeSend: function () {
				isLoading = true;
				App.blockUI({
					target: thisContent,
					boxed: true
				});
			},
			success: function (response) {
				if (response.error == 0) {
					setOnlinePayStep2(response.data);
					////console.log(onlinePayStep2.find('.bank-list').html(),onlinePayStep2.find('.bank-list').html().length,onlinePayStep2.find('.bank-list').html()=='');
					if (onlinePayStep2.find('.bank-list').html().length == 0) {
						onlinePayStep2.find('.bank-list').parent().hide();
					} else {
						onlinePayStep2.find('.bank-list').parent().show();
					}
				}
				if (response.error == 1 || response.error == 2) {
					App.alert('warning', '提示消息', response.message);
				}
				//alert($('body').height());
				renewHight($('body').height());
			},
			complete: function () {
				isLoading = false;
				App.unblockUI(thisContent);
			}
		});
	};

	/**
	 * 请求转账汇款
	 */
	var doPaymentTransfers = function (data) {
		Will.ajax(data, Route.PATH + '/payment/request-transfer-pay', function (data) {
			setTransfersStep2(data);
		});
	};
	/**
	 * 请求扫码
	 */
	var doQrcodeTransfers = function (data) {
		Will.ajax(data, Route.PATH + '/payment/request-transfer-pay', function (d) {
			setQrcodeStep2(d, data);
		});
	};

};
/*财务中心结束*/
/*提现开始*/
var initThisPage02_fin = function () {
	console.log('initThisPage02_fininitThisPage02_fin');
	var thisContent01 = $('[data-init="content"]').eq(1);

	$.get('/yx/u/api/account/get-bind-info', function (bdinfo) {
		console.log(bdinfo.data.withdrawName == null, bdinfo.data.withdrawName);
		if (bdinfo.data.withdrawName == null) {
			thisContent01.find('.wrapper').hide();
			thisContent01.find('.wrapper').eq(1).show();
		} else {
			thisContent01.find('.wrapper').hide();
			thisContent01.find('.wrapper').eq(0).show();
			loadWithdrawals();
		}
	}, 'JSON');

	if (typeof QueryString.iframe != 'undefined') {
		$('.menu02,.nav').hide();
	}

	var isLoading = false;
	var loadWithdrawals = function () {
		Will.ajax({}, Route.PATH + '/payment/prepare-withdraw', function (data) {
			buildWithdrawals(data);
		});
	};

	var feeRate = 0, maxFee = 0;
	var buildWithdrawals = function (data) {
		if (!data.withdrawConfig.isOpen) {
			App.alert('warning', '提示消息', data.withdrawConfig.serviceMsg, 3000);
			return;
		}
		//console.log(data,'buildWithdrawalsbuildWithdrawalsbuildWithdrawalsbuildWithdrawals');
		thisContent01.find('[name="amount"]').val('');
		thisContent01.find('[name="withdrawPwd"]').val('');
		if (data.myAccountStatus.hasWithdarwPwd) {
			if (data.accountCardList.length > 0) {
				thisContent01.find('.wrapper').hide();
				thisContent01.find('.wrapper').eq(0).show();
				thisContent01.find('[data-field="total"]').html(data.myAccountStatus.totalBalance.toFixed(3));
				thisContent01.find('[data-field="money"]').html(data.myAccountStatus.availableBalance.toFixed(3));
				thisContent01.find('[data-field="minUnitAmount"]').html(data.withdrawConfig.minUnitAmount.toFixed(3));
				thisContent01.find('[data-field="maxUnitAmount"]').html(data.withdrawConfig.maxUnitAmount.toFixed(3));
				thisContent01.find('[data-field="maxDailyAmount"]').html(data.withdrawConfig.maxDailyAmount.toFixed(3));
				thisContent01.find('[data-field="maxDailyCount"]').html(data.withdrawConfig.maxDailyCount);
				thisContent01.find('[data-field="feeRateTimes"]').html(data.withdrawConfig.freeDailyCount > 0 ? data.withdrawConfig.freeDailyCount : 0);
				feeRate = data.withdrawConfig.feeRate;
				maxFee = parseInt(data.withdrawConfig.dayWithdrawRateMax, 10);
				//console.log(!data.withdrawConfig.hasFee,'hasFeehasFeehasFee');

//      if (!data.withdrawConfig.hasFee) {
//        thisContent01.find('.aboutfee').hide();
//      }else {
//        thisContent01.find('.aboutfee').show();
//      }
				thisContent01.find('[data-field="freeDailyCount"]').html(data.withdrawConfig.freeDailyCount);
				thisContent01.find('[data-field="feeRate"]').html(data.withdrawConfig.feeRate * 100);
				thisContent01.find('[data-field="feeRateMin"]').html(data.withdrawConfig.dayWithdrawRateMin);
				//console.log(data.withdrawConfig.maxFee,'data.withdrawConfig.maxFeedata.withdrawConfig.maxFeedata.withdrawConfig.maxFee');
				thisContent01.find('[data-field="minFee"]').html(data.withdrawConfig.dayWithdrawRateMin);
				thisContent01.find('[data-field="maxFee"]').html(data.withdrawConfig.dayWithdrawRateMax);
				thisContent01.find('[data-field="serviceTime"]').html(data.withdrawConfig.serviceTime);
				thisContent01.find('[data-field="lotteryLimitAmount"]').html(data.myAccountStatus.lotteryLimitAmount.toFixed(3));
				thisContent01.find('[data-field="baccaratLimitAmount"]').html(data.myAccountStatus.baccaratLimitAmount.toFixed(3));
				thisContent01.find('[data-field="dailyAmount"]').html(data.myAccountStatus.dailyAmount.toFixed(3));
				thisContent01.find('[data-field="dailyCount"]').html(data.myAccountStatus.dailyCount);
				if (data.myAccountStatus.dailyCount >= data.withdrawConfig.freeDailyCount) {
					thisContent01.find('[data-hide="noFreeCount"]').show();
				} else {
					thisContent01.find('[data-hide="noFreeCount"]').hide();
				}
				buildCardList(data.accountCardList);
			} else {
				thisContent01.find('.wrapper').hide();
				thisContent01.find('.wrapper').eq(2).show();
			}
		} else {
			thisContent01.find('.wrapper').hide();
			thisContent01.find('.wrapper').eq(1).show();
		}
	};

	var buildCardList = function (list) {
		var myCardList = thisContent01.find('[data-field="card-list"]');
		myCardList.empty();
		var hasDefault = false;
		$.each(list, function (i, val) {
			var defaultHtml = val.isDefault == 1 ? 'selected' : '';
			// var innerHtml =
			// 	'<div class="card" data-id="' + val.id + '">'+
			// 		'<div class="logo b' + val.bankId + '"></div>'+
			// 		'<div class="cardno">' + val.bankCardId + '</div>'+
			// 		'<div class="name">' + val.bankCardName + '</div>'+ defaultHtml +
			// 		'<i class="checked"></i>'+
			// 	'</div>';
			var innerHtml =
				'<li data-id="' + val.id + '" style="line-height:38px;" class="bgcolorA card cursor clearfix fl ml15 ' + defaultHtml + '  bank' + val.bankId + '">' +

				'<p style="text-align:right;padding-right:10px;line-height: 46px;" rel="' + val.bankCardName + '">' + val.bankCardId + '</p>' +
				'</li>';
			myCardList.append(innerHtml);
			if (val.isDefault == true) {
				hasDefault = true;
				myCardList.find('.card').eq(i).addClass('selected');
			}
		});
		if (!hasDefault) {
			myCardList.find('.card').eq(0).addClass('selected');
		}
		myCardList.find('.card').unbind().click(function () {
			myCardList.find('.card').removeClass('selected');
			$(this).addClass('selected');
		});
	};

	var applyWithdrawals = function (data) {
		Will.ajax(data, Route.PATH + '/payment/apply-withdraw', function (data) {
			App.alert('success', '提示消息', '您的提现请求已申请，请等待工作人员处理！', 3000);
			loadWithdrawals();
			if (String(window.location.pathname).indexOf('manager-finance') > -1) {
				setTimeout(function () {
					//window.location.reload();
					AppLoop.init();
				}, 1000);
			}
		});
	};

	var testApply = function (amount, withdrawPwd) {
		if (amount == '') {
			App.alert('info', '提示消息', '请输入取现金额！', 3000);
			return false;
		}
		if (withdrawPwd == '') {
			App.alert('info', '提示消息', '请输入资金密码！', 3000);
			return false;
		}
		return true;
	};

	thisContent01.find('input[name="amount"]').change(function () {
		var amount = Number($(this).val());
		if (isNaN(amount)) {
			thisContent01.find('[data-field="feeAmount"]').html(0);
		} else {
			var feeAmount = amount * feeRate;
			if (feeAmount > maxFee) {
				feeAmount = maxFee;
			}
			thisContent01.find('[data-field="feeAmount"]').html(feeAmount.toFixed(2));
		}
	});

	thisContent01.find('input[name="submit"]').unbind().click(function () {
		var amount = thisContent01.find('input[name="amount"]').val();
		var cid = thisContent01.find('[data-field="card-list"] > .card.selected').attr('data-id');
		var withdrawPwd = thisContent01.find('input[name="withdrawPwd"]').val();
		if (testApply(amount, withdrawPwd)) {
			var data = {amount: amount, cardId: cid, withdrawPassword: md5(withdrawPwd)};
			applyWithdrawals(data);
		}
	});

	loadWithdrawals();
	//console.log('loadWithdrawalsloadWithdrawalsloadWithdrawals');

};
/*提现结束*/

/*转账开始*/
var initThisPage03_fin = function () {

	var thisContent = $('[data-init="content"]').eq(2);
	$('.total-money [data-field="lotteryBalance"]').text($('.bar [data-field="lotteryBalance"]').first().text());

	$('.manager .nav > a').eq(2).addClass('active');

	var transOutList = thisContent.find('.trans-out-list');
	var transInList = thisContent.find('.trans-in-list');
	var transInListPwd = thisContent.find('.trans-in-pwd');

	var isLoading = false;
	var loadUserTransfers = function () {
		if (!isLoading) {
			isLoading = true;
			App.blockUI({
				target: thisContent,
				boxed: true
			});
			$.ajax({
				type: 'post',
				url: Route.PATH + '/account/prepare-transfer',
				data: {},
				timeout: 10000,
				dataType: 'json',
				success: function (response) {
					isLoading = false;
					App.unblockUI(thisContent);
					if (response.error == 0) {
						buildUserTransfers(response.data);
					}
					if (response.error == 1) {
						App.alert('warning', '提示消息', response.message);
					}
				},
				error: function () {
					isLoading = false;
					App.unblockUI(thisContent);
				}
			});
		}
	};

	var loadToken = function (back) {
		// /yx/api/i/u/bank/playerTransferRefreshToken
		$.ajax({
			type: 'get',
			url: '/yx/api/i/u/bank/playerTransferRefreshToken',
			data: {},
			timeout: 10000,
			dataType: 'json',
			success: function (tk) {
				if (typeof back == 'function') {
					back(tk);
				}
			},
			error: function () {
				//isLoading = false;
				//App.unblockUI(thisContent);
			}
		});
	};

	var getThirdBal = function () {
		$.ajax({
			type: 'get',
			url: '/yx/api/i/u/bank/getPcodeCbBaseList',
			timeout: 10000,
			dataType: 'json',
			success: function (bals) {
				//console.log(bals);
				var baldata = bals.data;
				var selctLine = $(".accontMainBox select");
				selctLine.empty();
				var html = "<option value=\"sobet_01\" id=\"sobet_balance\" selected>主账户</option>";
				for (var i = 0; i < baldata.length; i++) {
					html += " <option value="+baldata[i].cbId+" data-id="+baldata[i].platformId+">"+baldata[i].cbName+"</option>";
				}
				selctLine.html(html);
				masterMoney($('.fromacc_m'));
				masterMoney($('.toacc_m'));
			},
			error: function () {
			}
		});
	};
	getThirdBal();

	function masterMoney (moneyDom){
		$.ajax({
			type: 'post',
			url: '/yx/game-lottery/init-page',
			data: {},
			timeout: 10000,
			dataType: 'json',
			success: function (res) {
				moneyDom.html(res.data.lottery.availableBalance);
			},
			error: function () {
			}
		})
	}

	function selectThird(dom,moneyDom){
		//转账，切换不同第三方游戏读取的余额接口
		thisContent.find(moneyDom).html('');
		dom.off('change').on('change',function(){
			var id = $(this).find("option:selected").attr("data-id");
			thisContent.find(moneyDom).html('正在加载');
			if(id){
				$.ajax({
					type: 'get',
					url: '/yx/thirdGameApi/common/showThirdAmount',
					data: {platformId:id,isForced:true},
					timeout: 10000,
					dataType: 'json',
					success: function (res) {
						thisContent.find(moneyDom).html(res.data);
					},
					error: function () {
					}
				});
			}else{
				// thisContent.find(moneyDom).html('');
				masterMoney(moneyDom);

			}
		});

	};

	selectThird($(".transferWrap #fromacc"),$(".fromacc_m"));
	selectThird($(".transferWrap #toacc"),$(".toacc_m"));


	var PlatformList = [];
	var PlatformBalance = {};
	var buildUserTransfers = function (data) {
		PlatformList = [];
		PlatformBalance = data.platformBalance;
		if (typeof PlatformBalance.sobet_01 == 'undefined') {
			PlatformList.push({code: "sobet_01", name: "主钱包", id: "sobet_01", status: -1});
		}

		for (var i = 0; i < data.platformList.length; i++) {
			var nowlines = data.platformList[i];
			PlatformList.push({code: nowlines.code, name: nowlines.name, id: nowlines.id, status: -1});
		}
		transOutList.find('.list').html('');
		//console.log(PlatformList,'PlatformListPlatformList');
		$('.sobet_left').html(PlatformBalance.sobet_01);
		initOutDoc();
	};

	var updateMoney = function () {
		var amount = Number(transOutList.find('.list > .item.selected').find('input').val());
		//console.log(amount,'updateMoneyupdateMoneyupdateMoney',transOutList.find('[data-field="amount"]'));
		transOutList.find('[data-field="amount"]').html(amount);
	};

	var initOutDoc = function () {
		transOutList.find('.list').empty();
		//console.log(PlatformList,'PlatformList');
		$.each(PlatformList, function (i, val) {
			var balance = PlatformBalance[val.code];
			if (typeof balance == 'undefined') {
				balance = Number($('.bar [data-field="lotteryBalance"]').first().text());
			}
			console.log(balance, $('.bar [data-field="lotteryBalance"]').first().text());
			var innerHtml =
				'<div data-id="' + val.id + '" data-code="' + val.code + '" class="item">' +
				'<div class="label">' + val.name + '：¥ ' + balance.toFixed(3) + '</div>' +
				'<div class="value">' +
				'<input data-max="' + balance + '" type="text" value="' + balance + '" autocomplete="off"/>' +
				'<a data-command="all">全部</a>' +
				'</div>' +
				'<i class="checked"></i>' +
				'</div>';
			transOutList.find('.list').append(innerHtml);
		});
		initOutEvent();
	};

	var initInDoc = function (id) {
		transInList.find('.list').empty();
		$.each(PlatformList, function (i, val) {
			if (id != val.id) {
				var innerHtml =
					'<div data-id="' + val.id + '" data-code="' + val.code + '" class="item">' + val.name + '</div>';
				transInList.find('.list').append(innerHtml);
			}
		});
		initInEvent();
	};

	var initOutEvent = function () {
		var items = transOutList.find('.list > .item');
		items.unbind().click(function () {
			if (!$(this).hasClass('selected')) {
				items.removeClass('selected');
				$(this).addClass('selected');
				updateMoney(); // 更新资金
				var id = $(this).attr('data-id');
				initInDoc(id);
			}
		});
		items.eq(0).trigger('click');
		// 绑定输入框函数
		items.each(function () {
			var input = $(this).find('input');
			input.keyup(function () {
				if ($(this).val() == '') return;
				var val = Number($(this).val());
				var max = Number($(this).attr('data-max'));
				if (!isNaN(val)) {
					if (val < 0) $(this).val(0);
					if (val > max) $(this).val(max);
				} else {
					$(this).val('');
				}
				updateMoney();
			});
			input.blur(function () {
				if ($(this).val() == '') {
					$(this).val(0);
				}
				updateMoney();
			});
			var all = $(this).find('[data-command="all"]');
			all.unbind().click(function () {
				input.val(input.attr('data-max'));
				updateMoney();
			});
		});
	};

	var initInEvent = function () {
		var items = transInList.find('.list > .item');
		items.unbind().click(function () {
			if (!$(this).hasClass('selected')) {
				items.removeClass('selected');
				$(this).addClass('selected');
			}
		});
		items.eq(0).trigger('click');
	};

	// loadUserTransfers();

	var doSelfUserTransfers = function (data) {
		if (!isLoading) {
			isLoading = true;
			App.blockUI({
				target: thisContent,
				boxed: true
			});
			$.ajax({
				type: 'post',
				//url: Route.PATH +'/account/apply-transfer',
				url: '/yx/api/i/u/bank/playerTransfer',
				data: data,
				timeout: 10000,
				dataType: 'json',
				success: function (response) {
					isLoading = false;
					App.unblockUI(thisContent);
					if (response.error == 0) {
						App.alert('success', '提示消息', '您的资金已经转到指定账户！', 3000);
						AppLoop.init();
						getThirdBal();
						// loadUserTransfers();
						$('#manualre').click();
						$('.manualre').first().click();
						$('#pwd,#transamount').val('');
					}
					if (response.error == 1 || response.error == 2) {
						App.alert('warning', '提示消息', response.message);
					}
				},
				error: function () {
					isLoading = false;
					App.unblockUI(thisContent);
				}
			});
		}
	};
	var thePageinner = thisContent.parent().find('.page-inner');
	/*thePageinner.find('a[name="submit"]').unbind().click(function() {
    var from = thePageinner.find('[name="fromacc"]').val();
		var to = thePageinner.find('[name="toacc"]').val();
		var amount = Number(thePageinner.find('[name="amount"]').val());
    //console.log(from,to,amount);
    if ($('#reverse').hasClass('reversed')) {
      from = thePageinner.find('[name="toacc"]').val();
		  to = thePageinner.find('[name="fromacc"]').val();
    }
		if(from == '') {
			return App.alert('info', '提示消息', '请选择转出账户！', 3000);
		}
		if(to == '') {
			return App.alert('info', '提示消息', '请选择转入账户！', 3000);
		}
		if(isNaN(amount)) {
			return App.alert('info', '提示消息', '请输入正确的金额！', 3000);
		}
		if(amount <= 0) {
			return App.alert('info', '提示消息', '转账金额必须大于0元！', 3000);
		}
		var data = {fromCode: from, toCode: to, amount: amount};
		doSelfUserTransfers(data);
	});*/

	thisContent.find('#suretrans').unbind().click(function () {
		var from = thisContent.find('[name="fromacc"]').val();
		var to = thisContent.find('[name="toacc"]').val();
		var amount = Number(thisContent.find('[name="amount"]').val());
		var psw = thisContent.find('#pwd').val();

		//console.log(amount,psw,'amountamountamountamountamountppppppp');
		if (from == '') {
			return App.alert('info', '提示消息', '请选择转出账户！', 3000);
		}
		if (to == '') {
			return App.alert('info', '提示消息', '请选择转入账户！', 3000);
		}
		if (isNaN(amount)) {
			return App.alert('info', '提示消息', '请输入正确的金额！', 3000);
		}
		if (amount <= 0) {
			return App.alert('info', '提示消息', '转账金额必须大于0元！', 3000);
		}
		//var data = {fromCode: from, toCode: to, amount: amount};
		//console.log(from,to,psw,'pswpswpswpswpswpswpsw');
		loadToken(function (t) {
			//console.log(t.data);
			var data = {
				turnOut: from,
				turnIn: to,
				cash: amount,
				payPasswd: md5(psw),
				token: t.data
			};
			doSelfUserTransfers(data);
		});

	});

};

var initThisPage03_fin_simple = function () {
	var thisContent = $('[data-init="content"]').eq(2);
};
/*转账结束*/

/*充值记录开始*/
var initThisPage04_fin = function () {

	var thisContent03 = $('[data-init="content"]').eq(3);
	var params = thisContent03.find('.params');
	var thisResultTable = thisContent03.find('.result > table');

	initDatePicker();

	var getSearchParams = function () {
		var type = params.find('select[name="type"]').val();
		var billno = params.find('input[name="billno"]').val();
		var time = params.find('input[name="time"]').val();
		var sTime = time.split(' 至 ')[0];
		var eTime = time.split(' 至 ')[1];
		return {status: type, billno: billno, sTime: sTime + " 00:00:00", eTime: eTime + " 23:59:59"};
	};

	//查询充值记录
	Will.page(thisContent03, getSearchParams, Route.PATH + '/account/search-recharge', '没有查询到相关记录', function (list) {
		thisResultTable.find('tbody').empty();
		$.each(list, function (i, val) {
			var innerHtml =
				'<tr data-id="' + val.id + '">' +
				'<td>' + val.billno + '</td>' +
				'<td>' + DataFormat.formatUserRechargeType(val.method) + '</td>' +
				'<td>¥ ' + val.amount.toFixed(2) + '</td>' +
				/*'<td>¥ ' + val.balanceAfter.toFixed(2) + '</td>'+*/
				'<td>' + moment(val.orderTime).format('YYYY-MM-DD HH:mm:ss') + '</td>' +
				/*'<td><a title="' + val.infos + '" data-command="infos">详情</a></td>'+*/
				'<td>' + DataFormat.formatUserRechargeStatus(val.orderStatus) + '</td>' +
				'</tr>';
			thisResultTable.find('tbody').append(innerHtml);
		});
		thisResultTable.find('a[data-command="infos"]').jBox('Tooltip', {
			position: {x: 'right', y: 'center'},
			outside: 'x'
		});
	});
	params.find('input[name="submit"]').unbind().click(function () {
		Will.getPage(thisContent03).init();
	});

	//Will.getPage(thisContent03).init();
};

/*充值记录结束*/

/*提现记录开始*/
var initThisPage05_fin = function () {
	var thisContent04 = $('[data-init="content"]').eq(4);
	var params = thisContent04.find('.params');
	var thisResultTable = thisContent04.find('.result > table');
	initDatePicker();

	var getSearchParams = function () {
		var billno = params.find('input[name="billno"]').val();
		var time = params.find('input[name="time"]').val();
		var sTime = time.split(' 至 ')[0];
		var eTime = time.split(' 至 ')[1];
		return {billno: billno, sTime: sTime + " 00:00:00", eTime: eTime + " 23:59:59"};
	};
	//查询提现记录
	Will.page(thisContent04, getSearchParams, Route.PATH + '/account/search-withdraw', '没有查询到相关记录', function (list) {
		thisResultTable.find('tbody').empty();
		$.each(list, function (i, val) {
			var innerHtml =
				'<tr data-id="' + val.id + '">' +
				'<td>' + val.billno + '</td>' +
				//'<td>' + val.billno.substr(16) + '</td>'+
				'<td>¥ ' + val.amount.toFixed(2) + '</td>' +
				/*	'<td>¥ ' + val.feeAmount.toFixed(2) + '</td>'+
					'<td>¥ ' + val.actualAmount.toFixed(2) + '</td>'+
					'<td>¥ ' + val.balanceBefore.toFixed(2) + '</td>'+*/
				'<td>' + moment(val.orderTime).format('MM/DD HH:mm:ss') + '</td>' +
				'<td>' + DataFormat.formatUserWithdrawalsStatus(val.orderStatus) + '</td>';
			/*'<td><a title="' + val.infos + '" data-command="infos">详情</a></td>'+*/
			'</tr>';

			thisResultTable.find('tbody').append(innerHtml);
		});
		thisResultTable.find('a[data-command="infos"]').jBox('Tooltip', {
			position: {x: 'right', y: 'center'},
			outside: 'x'
		});

	});
	params.find('input[name="submit"]').unbind().click(function () {
		Will.getPage(thisContent04).init();
	});
	//Will.getPage(thisContent04).init();
};

/*提现记录结束*/

/*转账记录开始*/
var initThisPage06_fin = function () {

	var thisContent05 = $('[data-init="content"]').eq(5);
	var params = thisContent05.find('.params');
	var thisResultTable = thisContent05.find('.result > table');

	initDatePicker();

	var getSearchParams = function () {
		//var zbType = params.find('select[name="zbType"]').val();
		var zbType = '3';
		var billno = params.find('input[name="billno"]').val();
		var time = params.find('input[name="time"]').val();
		var sTime = time.split(' 至 ')[0];
		var eTime = time.split(' 至 ')[1];
		return {billno: billno, sTime: sTime + " 00:00:00", eTime: eTime + " 23:59:59", zbType: zbType};
	};
	//查询转账记录
	Will.page(thisContent05, getSearchParams, Route.PATH + '/account/search-zbrecord', '没有查询到相关记录', function (list) {
		thisResultTable.find('tbody').empty();
		$.each(list, function (i, val) {
			var innerHtml =
				'<tr>' +
				'<td>' + val.spsn.substr(8) + '</td>' +
				'<td>' + val.cn + '</td>' +
				'<td>' + val.createTime + '</td>' +
				'<td>' + val.changeTypeStr + '</td>' +
				'<td>' + val.changeTypeDetailStr + '</td>' +
				'<td>¥ ' + val.amount.toFixed(4) + '</td>' +
				'<td>¥' + val.point.toFixed(4) + '</td>' +
				'<td>' + String(val.note).replace(/\(.*\)/g, '') + '</td>' +
				/*'<td><a title="' + val.remarks + '" data-command="infos">详情</a></td>'+*/
				'</tr>';
			//console.log(String(val.note).replace(/\(.*\)/g,''));
			thisResultTable.find('tbody').append(innerHtml);
		});
		thisResultTable.find('a[data-command="infos"]').jBox('Tooltip', {
			position: {x: 'right', y: 'center'},
			outside: 'x'
		});

	});
	params.find('input[name="submit"]').unbind().click(function () {
		Will.getPage(thisContent05).init();
	});
	//Will.getPage(thisContent05).init();
};
/*转账记录结束*/

var initFinance = function () {
	var tabs = [initThisPage01_fin, initThisPage02_fin, initThisPage03_fin, initThisPage04_fin, initThisPage05_fin, initThisPage06_fin]; //initThisPage03
	var allback = function () {
		////console.log(typeof window.parent.resetWindowHight);
	};

	// initThisPage03_fin();
	Will.changeTabs([initThisPage01_fin, initThisPage02_fin, initThisPage03_fin, initThisPage04_fin, initThisPage05_fin, initThisPage06_fin]);

	// Will.changeTabs(tabs, allback);

	if (AppData.getLotteryAccount().isDividendAccount) {
		$('[data-visible="dividend"]').show();
	} else {
		$('[data-visible="dividend"]').hide();
	}

	//转账转换
	$('#reverse').click(function () {
		if (!$('#reverse').hasClass('reversed')) {
			$('#reverse').addClass('reversed');
			$("#select_acc_to").insertBefore($("#select_acc_from"));
		} else {
			$('#reverse').removeClass('reversed');
			$("#select_acc_from").insertBefore($("#select_acc_to"));
		}
	});

	$('select[data-type="static"]').dropkick({theme: "black", width: 120});
	$('select[data-type="static-bigger"]').dropkick({theme: "black", width: 190});
	//Will.changeTab();
	//AppLoop.init();
};

//

function generateTwoDecimalPlaces(_this) {
	console.log($(_this).val());
	//var inputvalue=$(_this).val()*1;
	autoGet($(_this));
	// 生成随机数
}

function rd(n, m) {
	var c = m - n + 1;
	return Math.floor(Math.random() * c + n);
}

var thisOne = rd(10, 99);
var chkFormatMoney = function (a) {
	var nowv = parseInt(a.val(), 10) + '.' + thisOne;
	//console.log(nowv);
	//obj.value  =( Math.floor(Number(obj.value)) + randomFloat).toFixed(2);
	nowv = nowv.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
	nowv = nowv.replace(/^\./g, ""); // 验证第一个字符是数字而不是
	nowv = nowv.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的
	nowv = nowv.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
	nowv = nowv.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只能输入两个小数
	//console.log(nowv,'chkFormatMoneychkFormatMoney');
	a.val(nowv);
	changeCursorPos(a[0]);
};

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function autoGet(a) {
	var nowv = parseInt(a.val(), 10) + '.' + getRandomInt(10, 99);
	nowv = nowv.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
	nowv = nowv.replace(/^\./g, ""); // 验证第一个字符是数字而不是
	nowv = nowv.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的
	nowv = nowv.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
	nowv = nowv.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只能输入两个小数
	//console.log(nowv,'chkFormatMoneychkFormatMoney');
	a.val(nowv);
	changeCursorPos(a[0]);
}

// 焦点控制
function changeCursorPos(obj) {
	var index = obj.value.indexOf(".");
	if (obj.createTextRange) {
		var range = obj.createTextRange();
		range.move("character", index);
		// range.moveEnd("character",index);
		range.select();
	} else if (obj.setSelectionRange) {
		obj.setSelectionRange(index, index);
	}
}
