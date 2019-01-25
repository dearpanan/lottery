//个人中心-追号记录详细弹出框
var PopOrder = function() {

	var initDoc = function(data) {
		var actions = '';
		if(data.allowCancel) {
			actions += '<input data-id="' + data.billno + '" data-command="cancel-general" value="撤销订单" type="button" class="button">';
			if(data.type == 1) {
				actions += '<input data-no="' + data.chaseBillno + '" data-command="cancel-chase" value="撤销追号" type="button" class="button green">';
			}
		} else {
			actions = '<input value="无操作" type="button" class="button grey">';
		}
		var innerHtml =
		'<div class="lottery-order-details sffsdf32">'+
			'<table class="info">'+
				'<tbody>'+
					'<tr>'+
						'<td class="label-f" width="140">订单编号</td>'+
						'<td class="value">' + data.billno + '</td>'+
						'<td class="label-f">状态</td>'+
						'<td class="value" rel="'+data.status+'">' + DataFormat.formatUserBetsStatus(data.status) + '</td>'+
					'</tr>'+
					'<tr>'+
						'<td class="label-f">彩种</td>'+
						'<td>' + data.lottery + '</td>'+
						'<td class="label-f">期号</td>'+
						'<td>' + data.issue + '期</td>'+
					'</tr>'+
					'<tr>'+
						'<td class="label-f">玩法</td>'+
						'<td>' + data.method + '</td>'+
						'<td class="label-f">注数</td>'+
						'<td>' + data.nums + '注</td>'+
					'</tr>'+
					'<tr>'+
						'<td class="label-f">资金模式</td>'+
						'<td>' + DataFormat.formatUserBetsModel(data.model) + '</td>'+
						'<td class="label-f">倍数</td>'+
						'<td>' + data.multiple + '倍</td>'+
					'</tr>'+
					'<tr>'+
						'<td class="label-f">奖级</td>'+
						'<td>' + data.code + '</td>'+
						'<td class="label-f">返点</td>'+
						'<td>' + data.point.toFixed(1) + '%</td>'+
					'</tr>'+
					'<tr>'+
						'<td class="label-f">投注金额</td>'+
						'<td>¥ ' + data.money.toFixed(3) + '</td>'+
						'<td class="label-f">中奖金额</td>'+
						'<td>¥ ' + (data.winMoney ? data.winMoney : 0).toFixed(3) + '</td>'+
					'</tr>'+
					'<tr>'+
						'<td class="label-f">下单时间</td>'+
						'<td colspan="3">' + moment(data.orderTime).format('YYYY-MM-DD HH:mm:ss') + '</td>'+
						//'<td class="label-f">封单时间</td>'+
						//'<td>' + moment(data.stopTime).format('YYYY-MM-DD HH:mm:ss') + '</td>'+
					'</tr>'+
					'<tr>'+
						'<td class="label-f">开奖号码</td>'+
						'<td colspan="3">' + (data.openCode ? data.openCode : '无') + '</td>'+
					'</tr>'+
					'<tr>'+
						'<td class="label-f">投注内容<br><a class="hand print">打印</a></td>'+
						'<td colspan="3" class="v-middle">'+'<div id="printnow"></div>'+
							'<div class="scroller" style="height: 60px; overflow-x: hidden;overflow-y: auto;">'+
								'<div class="text-codes">' + data.content + '</div>'+
							'</div>'+
						'</td>'+
					'</tr>'+
				'</tbody>'+
			'</table>'+
			'<div class="button-groups">' + actions + '<input data-command="cancel" value="取消" type="button" class="button green"></div>'+
		'</div>';
		return innerHtml;
	}
	var initEvent = function(thisContent, data, callback) {
		$('.lottery-order-details').find('[data-command="cancel-general"]').click(function() {
			var id = $(this).attr('data-id');
			cancelGeneral(id, thisContent, callback);
		});

    $('.lottery-order-details').find('.print').click(function() {
      $('.lottery-order-details #printfr').remove();
      $('.lottery-order-details #printnow').html('<iframe id="printfr" rel="/static/print.html"></iframe>');
      $('.lottery-order-details #printfr').attr('src','/static/print.html').load(function(){
        var iframe = $('.lottery-order-details #printfr');
        var innerDoc = iframe[0].contentDocument || iframe[0].contentWindow.document;
        innerDoc.write([
          '<style media="all">.PrintArea{color:#000;width:228px;}.smallNum{display:block;}em{font-style:normal;}ul{margin:0px;padding:0px;}li{line-height:25px;}hr{border:none;height:2px;background-color: #000000;border-bottom:2px solid #000000;}h2{font-size:18px;padding:0px;margin:0px;text-align:center;line-height:45px;}.bl{display:block;}.printContent{word-break: break-all;max-height: 220px;overflow-y: hidden;display: inline-block;}</style>',
          '<div class="PrintArea">',
            '<h2>彩票投注单</h2>',
            '<ul>',
              '<li><span>下单时间：</span><em>',moment(data.orderTime).format('MM-DD HH:mm:ss'),'</em></li>',
              '<li><span>投注彩种：</span><em>',data.lottery,'</em></li>',
              '<li class="lottime"><span>投注期号：</span><em>',data.issue,'</em><hr/></li>',
              '<li class="lotbh"><span>注单编号：</span><em class="smallNum">',data.billno,'</em></li>',
              '<li><span>投注玩法：</span><em>',data.method,'</em></li>',
              '<li><span class="bl">投注内容：</span><em class="printContent">',(data.content.length > 100 ? data.content.substr(0, 100)+'... 投注内容较长，只显示部分投注内容。' : data.content),'</em></li>',
              '<li class="lotje"><span>投注金额：</span><em>',data.money.toFixed(3),'元</em></li>',
              '<li class="lotmon"><hr/>　　<span>总金额：</span><em>',data.money.toFixed(3),'元</em></li>',
            '</ul>',
          '</div>',
        ].join(''));
        console.log(innerDoc,iframe[0].contentWindow);
        iframe[0].contentWindow.print();
      });
    });
		$('.lottery-order-details').find('[data-command="cancel-chase"]').click(function() {
			var chaseBillno = $(this).attr('data-no');
			cancelChase(chaseBillno, thisContent, callback);
		});
		$('.lottery-order-details').find('[data-command="cancel"]').click(function() {
			var box = Will.getBox();if(box) box.close();
		});

    //		cancel-single-trace
	}

	var details = function(id, thisContent, callback, isAgent) {
		var url = Route.PATH + '/game-lottery/get-order';
		//if(isAgent) url = '/api/agent/get-lottery-order';
		Will.ajax({billno:id},url, function(data){
			Will.initBox('订单详情', initDoc(data),800,420,function() {
        initEvent(thisContent, data, callback);
      });
		})
	}
	var doCancelOrder = function(data, thisContent, callback) {
		Will.ajax(data,Route.PATH + '/game-lottery/cancel-order', function(data){
			App.alert('success', '提示消息', '操作成功，该订单已成功撤销。', 500);
      $('.content:visible input[name="submit"]').click();
			if($.isFunction(callback)) callback();
		})
	}

	var cancelGeneral = function(id, thisContent, callback) {
		var box = Will.getBox();if(box) box.close();
		cancelGeneralOrder(id, thisContent, callback);
	}
	var cancelGeneralOrder = function(id, thisContent, callback) {
		App.confirm('question', '确认消息', '确定要撤销该订单？', 0, '确定', '取消', function() {
			var data = {type: 'general', billno: id};
			doCancelOrder(data, thisContent, callback);
		});
	}

	var doCancelTraceOrder = function(data, thisContent, callback) {
		Will.ajax(data,Route.PATH + '/game-lottery/cancel-single-chase', function(data){
			App.alert('success', '提示消息', '操作成功，该追号订单已成功撤销。', 500);
			if($.isFunction(callback)) callback();
		})
	}

	var cancelTraceOrder = function(id, thisContent, callback) {
		var box = Will.getBox();if(box) box.close();
		App.confirm('question', '确认消息', '确定要撤销该订单？', 0, '确定', '取消', function() {
			var data = {type: 'general', billno: id};
			doCancelTraceOrder(data, thisContent, callback);
		});
	}

	var cancelChase = function(chaseBillno, thisContent, callback) {
		var box = Will.getBox();if(box) box.close();
		App.confirm('question', '确认消息', '确定要撤销该追号订单？', 0, '确定', '取消', function() {
			var data = {type: 'chase', chaseBillno: chaseBillno};
			doCancelTraceOrder(data, thisContent, callback);
		});
	}

	var chaseDetail = function(id, thisContent, callback) {
		Will.ajax({billno: id},Route.PATH + '/game-lottery/get-chase', function(data){
			Will.initBox('订单详情', initDoc02(data),800,500,initEvent02);
		});
	}

	var initDoc02 = function(data) {
		var actions = '';
		if(data.allowCancel) {
				actions += '<input data-no="' + data.billno + '" data-command="cancel-chase" value="撤销追号" type="button" class="button green">';
		} else {
			actions = '<input value="无操作" type="button" class="button grey">';
		}
 		var innerHtml =
		'<div class="lottery-details"><span class="w-tabs">详细</span><span class="w-tabs">列表</span>'+
		'<div class="lottery-order-details w-cots">'+
			'<table class="info">'+
				'<tbody>'+
					'<tr>'+
						'<td class="label-f">订单编号</td>'+
						'<td class="value">' + data.billno + '</td>'+
						'<td class="label-f">状态</td>'+
						'<td class="value">' + DataFormat.formatUserChaseStatus(data.status) + '</td>'+
					'</tr>'+
					'<tr>'+
						'<td class="label-f">彩种</td>'+
						'<td>' + data.lottery + '</td>'+
						'<td class="label-f">玩法</td>'+
						'<td>' + data.method + '</td>'+

					'</tr>'+
					'<tr>'+
						'<td class="label-f">开始期号</td>'+
						'<td>' + data.startIssue + '期</td>'+
			/*			'<td class="label-f">截止期号</td>'+
						'<td>' + data.endIssue + '期</td>'+*/
						'<td class="label-f">返点</td>'+
						'<td>' + data.point.toFixed(1) + '%</td>'+
					'</tr>'+
					'<tr>'+
						'<td class="label-f">总期数</td>'+
						'<td>' + data.totalCount + '</td>'+
						'<td class="label-f">已追期数</td>'+
						'<td>' + data.clearCount + '</td>'+
					'</tr>'+
					'<tr>'+
						'<td class="label-f">资金模式</td>'+
						'<td>' + DataFormat.formatUserBetsModel(data.model) + '</td>'+
						'<td class="label-f">注数</td>'+
						'<td>' + data.nums + '注</td>'+
					'</tr>'+
					'<tr>'+
						/*'<td class="label-f">奖级</td>'+
						'<td>' + data.code + '</td>'+*/
					'</tr>'+
					'<tr>'+
						'<td class="label-f">总金额</td>'+
						'<td>¥ ' + data.totalMoney.toFixed(3) + '</td>'+
						'<td class="label-f">总奖金</td>'+
						'<td>¥ ' + (data.winMoney ? data.winMoney : 0).toFixed(3) + '</td>'+
					'</tr>'+
					'<tr>'+
						'<td class="label-f">下单时间</td>'+
						'<td colspan="3">' + moment(data.orderTime).format('YYYY-MM-DD HH:mm:ss') + '</td>'+
						//'<td class="label-f">封单时间</td>'+
						//'<td>' + moment(data.stopTime).format('YYYY-MM-DD HH:mm:ss') + '</td>'+
					'</tr>'+
					'<tr>'+
						'<td class="label-f">中奖是否撤单</td>'+
						'<td>' + (data.winStop ? '是' : '否') + '</td>'+
						'<td class="label-f"> </td>'+
						'<td>   </td>'+
					'</tr>'+

					'<tr>'+
						'<td class="label-f">投注内容</td>'+
						'<td colspan="3" class="v-middle">'+
							'<div class="scroller" style="height: 60px; overflow: hidden;">'+
								'<div class="text-codes">' + data.content + '</div>'+
							'</div>'+
						'</td>'+
					'</tr>'+
				'</tbody>'+
			'</table>'+
		'</div>'+
					'<span class="button-groups">' + actions + '<input data-command="cancel" value="取消" type="button" class="button green"></span>'+
					'<div class="w-list lottery-chase-list  w-cots" style="display:none">'+
						'<table class="wh-table">'+
							'<thead>'+
								'<tr>'+
									'<td width="110">期号</td>'+
									'<td width="50">倍数</td>'+
								/*	'<td width="150">开奖时间</td>'+*/
									'<td width="60">投注金额</td>'+
									'<td width="60">中奖金额</td>'+
									'<td width="80">状态</td>'+
									'<td width="150">开奖号码</td>'+
									'<td width="80">操作</td>'+
								'</tr>'+
							'</thead>'+
						'</table>'+
						'<div class="scroll">'+
							'<table class="w-table">				'+
								'<tbody>'+generateChaseOrderList(data)+
								'</tbody>'+
							'</table>'+
						'<div>'+
					'</div>	'+

		'</div>';


		return innerHtml;
	}

	var generateChaseOrderList = function(data){
		var trHtml ='';
		$.each(data.chaseList, function(i, val) {  //.attr('data-id',ele.billno).attr('chaseBillno',data.billno);
			trHtml +=
			'<tr data-id="201604041211297402427179">'+
				'<td width="110">'+val.issue+'</td>'+
				'<td width="50">'+val.multiple+'</td>'+
			/*	'<td width="150">'+moment(val.openTime).format('YYYY-MM-DD HH:mm:ss')+'</td>'+*/
				'<td width="60">¥ '+val.money.toFixed(3)+'</td>'+
				'<td width="60">¥ '+val.winMoney.toFixed(3)+'</td>'+
				'<td width="80">'+val.statusRemark+'</td>'+
				'<td width="150" class="code"><span class="data">'+(val.openCode?val.openCode:'无')+'</span></td>		'+
				'<td width="80">'+(val.allowCancel?'<input data-id="'+val.billno+'"  chaseBillno="'+data.billno+'" data-command="cancel-single-trace" value="撤销订单" type="button" class="button stracebtn">':'无操作')+'</td>		'+
			'</tr>';
		});
		return trHtml;
	}

	var initEvent02 = function(thisContent, callback) {
		//追号列表的撤销订单操作
		$('.lottery-details').delegate("[data-command='cancel-general']","click",function(){
			var id = $(this).attr('data-id');
			var chaseId = $(this).attr('chaseBillno');
			cancelGeneralOrder(id, thisContent, function(){
 				Will.ajax({billno:chaseId},Route.PATH +'/game-lottery/get-chase', function(data){
 					var sb = $('.lottery-details');
  					$('.lottery-details .scroll tbody').empty().append(generateChaseOrderList(data));
  					$('.lottery-details > span:eq(1)').click();
 				})
			});
		});
		$('.lottery-details').find('[data-command="cancel-chase"]').click(function() {
			var chaseBillno = $(this).attr('data-no');
			cancelChase(chaseBillno, thisContent, callback);
		});
		$('.lottery-details').find('[data-command="cancel-single-trace"]').click(function() {
      //var chaseBillno = $(this).attr('data-no');
			var biilno = $(this).attr('data-id');;
			cancelTraceOrder(biilno, thisContent, callback);
		});
		$('.lottery-details').find('[data-command="cancel"]').click(function() {
			var box = Will.getBox();if(box) box.close();
		});

		$('.lottery-details > .w-tabs').click(function(){
			$('.lottery-details > .w-tabs').removeClass('active');
			$(this).addClass('active');
			$('.lottery-details > .w-cots').hide();
			$('.lottery-details > .w-cots').eq($(this).index()).show();
		});
		$('.lottery-details > .w-tabs:eq(0)').click();
	}



	var doCancelChase = function(data, thisContent, callback) {
		Will.ajax(data,Route.PATH + '/game-lottery/cancel-chase', function(data){
			App.alert('success', '提示消息', '操作成功，该追号订单已成功撤销。', 3000);
		});
	}

	var cancelChase = function(chaseBillno, thisContent, callback) {
		var box = Will.getBox();if(box) box.close();
		App.confirm('question', '确认消息', '确定要撤销该追号订单？', 0, '确定', '取消', function() {
			var data = {type: 'chase', billno: chaseBillno};
			doCancelChase(data, thisContent, callback);
		});
	}

	//details方法可同时被个人和代理游戏记录详细调用
	//chaseDetail追号详细
	return {details: details ,chaseDetail: chaseDetail, cancelGeneral: cancelGeneral, cancelChase: cancelChase,cancelTraceOrder:cancelTraceOrder}

}();

//彩票报表-团队报表
var initThisPage01_rpt = function() {

	var thisContent01 = $('[data-init="content"]').eq(4);
	var params = thisContent01.find('.params.S1');
	var thisResultTable = thisContent01.find('.result.S1 > table');

	var getSearchParams = function() {
		var username = params.find('input[name="username"]').val();
		var time = params.find('input[name="time"]').val();
		var sTime = time.split(' 至 ')[0];
		var eTime = time.split(' 至 ')[1];
		return {username: username, sTime: sTime + " 00:00:00", eTime: eTime + " 23:59:59"};
	}

  initDatePicker();

	Will.page(thisContent01,getSearchParams, Route.PATH + '/report/report-team-lottery','没有查询到相关记录',function(list){
		thisResultTable.find('tbody').empty();
			$.each(list, function(i, val) {
				var innerHtml =
				'<tr>'+
					'<td>' + (val.userName ?  val.userName : "汇总")+ '</td>'+
					'<td>' + DataFormat.formatUserStatus(val.userType) + '</td>'+
					'<td>' + (val.balance ? val.balance : 0) + '</td>'+
					'<td>' + val.depositAmount + '</td>'+
					'<td>' + val.withdrawAmount + '</td>'+
					'<td>' + val.confirmAmount + '</td>'+
					'<td>' + val.awardAmount + '</td>'+
					'<td>' + val.pointAmount + '</td>'+
					'<td>' + val.activityAmount + '</td>'+
					'<td ' + ((0 - val.profitAmount)<0 ? ' class="red"' : '') + '>' +(0 - val.profitAmount) + '</td>'+
				'</tr>';
				thisResultTable.find('tbody').append(innerHtml);
			});
	});
  //	Will.getPage(thisContent02).init();
	params.find('input[name="submit"]').unbind().click(function() {
		Will.getPage(thisContent01).init();
	});

 	/*//彩票报表-团队报表请求
	var doSearch = function() {
		Will.ajax(getSearchParams(),Route.PATH + '/report/report-team-lottery', function(data){
			buildData(data, (data.username ? true : false));
		});
	}

	var buildData = function(list, hasUser) {
		thisResultTable.find('tbody').empty();
		$.each(list, function(i, val) {
			var formatUser = val.field;
			var time = params.find('input[name="time"]').val().replace('至','P');
			if(i > 1) {
				formatUser = '<a href="#page=0&key=lottery&username=' + val.field + '&time=' + time + '">' + val.field + '</a>';
			}
			var innerHtml =
			'<tr>'+
				'<td>' + formatUser + '</td>'+
				'<td>' + val.recharge.toFixed(3) + '</td>'+
				'<td>' + val.withdraw.toFixed(3) + '</td>'+
				'<td>' + val.consume.toFixed(3) + '</td>'+
				'<td>' + val.bonus.toFixed(3) + '</td>'+
				'<td>' + (val.rebateConsume + val.rebateAgent).toFixed(3) + '</td>'+
				'<td>' + val.activity.toFixed(3) + '</td>'+
				'<td>' + val.profit.toFixed(3) + '</td>'+
			'</tr>';
			thisResultTable.find('tbody').append(innerHtml);
		});

	}

	params.find('input[name="submit"]').unbind().click(function() {
		doSearch();
	});*/

	// 设置请求参数值
	//{
	/*	var username = App.getHash('username');
		var time = App.getHash('time');
		if(username) {
			params.find('input[name="username"]').val(username);
		}else{
			params.find('input[name="username"]').val('');
		}
    // 		doSearch();
	}*/

}

//彩票报表-个人报表
var initThisPage02_rpt = function() {

	var thisContent02 = $('[data-init="content"]').eq(4);
	var params = thisContent02.find('.params.S2');
	var thisResultTable = thisContent02.find('.result.S2 > table');

  initDatePicker();

	var getSearchParams = function() {
		var type = params.find('select[name="prtype"]').val();
		var username = params.find('input[name="name"]').val();
		var time = params.find('input[name="time"]').val();
		var sTime = time.split(' 至 ')[0];
		var eTime = time.split(' 至 ')[1];
		return {sTime: sTime + " 00:00:00", eTime: eTime + " 23:59:59",username:username,type:type};
	}

  /* 	var doSearch = function() {
		Will.ajax(getSearchParams(),Route.PATH + '/report/report-game-lottery', function(data){
			buildData(data);
		});
	}

	var buildData = function(list) {
		thisResultTable.find('tbody').empty();
		$.each(list, function(i, val) {
			var innerHtml =
			'<tr>'+
				'<td>' + val.userName + '</td>'+
				'<td>' + val.date + '</td>'+
				'<td>' + val.depositAmount + '</td>'+
				'<td>' + val.withdrawAmount + '</td>'+
				'<td>' + val.confirmAmount + '</td>'+
				'<td>' + val.awardAmount + '</td>'+
				'<td>' + val.pointAmount + '</td>'+
				'<td>' + val.activityAmount + '</td>'+
				'<td>' + (0 - profitAmount) + '</td>'+
			'</tr>';
			thisResultTable.find('tbody').append(innerHtml);
		});
	}

	params.find('input[name="submit"]').unbind().click(function() {
		doSearch();
	});*/

	Will.page(thisContent02,getSearchParams, Route.PATH + '/report/report-game-lottery','没有查询到相关记录',function(list){
		thisResultTable.find('tbody').empty();
			$.each(list, function(i, val) {
				var innerHtml =
				'<tr>'+
					'<td>' + val.userName + '</td>'+
					'<td>' + val.date + '</td>'+
					'<td>' + val.depositAmount + '</td>'+
					'<td>' + val.withdrawAmount + '</td>'+
					'<td>' + val.confirmAmount + '</td>'+
					'<td>' + val.awardAmount + '</td>'+
					'<td>' + val.pointAmount + '</td>'+
					'<td>' + val.activityAmount + '</td>'+
					'<td>' + val.feeAmount + '</td>'+
					'<td' + ((0 - val.profitAmount)<0 ? ' class="red"' : '') + '>' + (0 - val.profitAmount) + '</td>'+
				'</tr>';
				thisResultTable.find('tbody').append(innerHtml);
			});
	});
  //	Will.getPage(thisContent02).init();
	params.find('input[name="submit"]').unbind().click(function() {
		Will.getPage(thisContent02).init();
	});

}


//百家乐报表
var initThisPage03_rpt = function() {

	var thisContent03 = $('[data-init="content"]').eq(1);
	var params = thisContent03.find('.params');
	var thisResultTable = thisContent03.find('.result > table');

	var getSearchParams = function() {
		var username = params.find('input[name="username"]').val();
		var time = params.find('input[name="time"]').val();
		var sTime = time.split(' 至 ')[0];
		var eTime = time.split(' 至 ')[1];
		return {username: username, sTime: sTime + " 00:00:00", eTime: eTime + " 23:59:59"};
	}

	//百家乐报表请求
	var doSearch = function() {
		Will.ajax(getSearchParams(),'/api/agent/report-game-baccarat', function(data){
			buildData(data, (data.username ? true : false));
		});

	}

	var buildData = function(list, hasUser) {
		thisResultTable.find('tbody').empty();
		$.each(list, function(i, val) {
			var formatUser = val.name;
			if(i > (hasUser ? 1 : 0)) {
				formatUser = '<a href="?key=baccarat&username=' + val.name + '">' + val.name + '</a>';
			}
			var profit = val.prize + val.waterReturn + val.proxyReturn + val.activity - val.billingOrder;
			var innerHtml =
			'<tr>'+
				'<td>' + formatUser + '</td>'+
				'<td>' + val.transIn.toFixed(3) + '</td>'+
				'<td>' + val.transOut.toFixed(3) + '</td>'+
				'<td>' + val.billingOrder.toFixed(3) + '</td>'+
				'<td>' + val.prize.toFixed(3) + '</td>'+
				'<td>' + (val.waterReturn + val.proxyReturn).toFixed(3) + '</td>'+
				'<td>' + val.activity.toFixed(3) + '</td>'+
				'<td>' + profit.toFixed(3) + '</td>'+
			'</tr>';
			thisResultTable.find('tbody').append(innerHtml);
		});
	}

	params.find('input[name="submit"]').unbind().click(function() {
		doSearch();
	});

	// 设置请求参数值
	if(App.getUrl('username')) {
		var username = App.getUrl('username');
		params.find('input[name="username"]').val(username);
		doSearch();
	}

}

//彩票报表
var initThisPage04_rpt = function(){
	//团队报表 个人报表
	var tabs = [initThisPage02_rpt,initThisPage01_rpt];
  ////console.log(AppData.getMainAccount());
  var mainInfo = AppData.getMainAccount();
  //console.log(mainInfo.type,'mainInfo.typemainInfo.type');
  if (mainInfo.type=='0') {
    $("#tab01 a:eq(0)").remove();
    tabs = [initThisPage02_rpt];
  }
	$("#tab01 a").unbind().click(function(){
		//alert($(this).index());
    $('[data-init="content"]').eq(4).find('.wrapper').hide();
		$('[data-init="content"]').eq(4).find('.wrapper.'+$(this).attr('nav')).show();
		$("#tab01 a").removeClass('active');
		$(this).addClass('active');
		tabs[$(this).index()]();
    initDatePicker();
	});
	$("#tab01 a:eq(0)").click();
  if ($("#tab01 a").size()==0 && mainInfo.type=='0') {
    $('[data-init="content"]').eq(4).find('.wrapper').hide();
		$('[data-init="content"]').eq(4).find('.wrapper.S2').show();
		//$("#tab01 a").removeClass('active');
		//$(this).addClass('active');
		tabs[0]();
    initDatePicker();
  }
}

/*游戏纪录开始*/
var initThisPage04a_rpt = function() {

	var thisContent04 = $('[data-init="content"]').eq(0);
	var params = thisContent04.find('.params');
	var thisResultTable = thisContent04.find('.result > table');

  ////console.log('loadLotteryloadLotteryloadLottery');

	loadLottery(function(list) {
    ////console.log(list,'loadLotteryloadLotteryloadLotteryloadLotteryloadLotteryloadLotteryloadLotteryloadLotteryloadLottery');

		var lottery = $('#rpt-gamerecord').find('select[name="lottery"]');
    ////console.log($('#rpt-gamerecord'),thisContent04,thisContent04.find('.params'),lottery,'lotterylotterylotterylotterylotterylottery');

		lottery.append('<option value="VR">VR金星1.5分彩</option>');
		lottery.append('<option value="TCFFC">天彩分分彩</option>');
    $.each(list, function(i, val) {
      ////console.log(val.showName);
			if (String(val.showName).indexOf('微信')==-1 && String(val.showName).indexOf('急速')==-1 && val.id!='113' && val.id!='13' && val.id!='12') {
        lottery.append('<option value="' + val.shortName + '">' + val.showName + '</option>');
      }
		});
    lottery.dropkick({theme: "black" ,width:150});
 	});

	initDatePicker();

	var getSearchParams = function() {
		var lottery = params.find('select[name="lottery"]').val();
		var status = params.find('select[name="status"]').val();
		var issue = params.find('input[name="expect"]').val().replace(/(^\s*)|(\s*$)/g, "");
		issue = !!issue?issue:undefined ;
		var time = params.find('input[name="time"]').val();
		var sTime = time.split(' 至 ')[0];
		var eTime = time.split(' 至 ')[1];
    if (lottery=='VR') {
      params.find('input[name="submit"]').attr('url','/game/vr/order');
      return {vr:1,lottery: lottery, status: status, issue: issue, sTime: sTime + " 00:00:00", eTime: eTime + " 23:59:59"};
    }else if(lottery == 'TCFFC'){
        	 params.find('input[name="submit"]').attr('url', '/game/tcg/order');
        	 return {
                gameCode: 'TCFFC',
                issueNo: '',
                sTime: sTime + " 00:00:00",
                eTime: eTime + " 23:59:59",
                username: '',
                status: status
             };
        }else {
      params.find('input[name="submit"]').attr('url','/game-lottery/search-order');
      return {lottery: lottery, status: status, issue: issue, sTime: sTime + " 00:00:00", eTime: eTime + " 23:59:59"};
    }
	}

  params.find('input[name="submit"]').attr('url','/game-lottery/search-order');
	Will.page(thisContent04,getSearchParams, params.find('input[name="submit"]'),'没有查询到相关记录',function(list){
			////console.log(list,getSearchParams(),'vrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
      thisResultTable.find('tbody').empty();
			var vrstatus = function(str) {
        if (str==null) {
          return '-'
        }
        var statedict ={
          '1':'玩家撤单','2':'管理员撤单','4': '整期撤单','8':'重新颁奖'
        }
        if (typeof statedict[str] !== 'undefined') {
          return statedict[str];
        }
        return str;
      }

      $.each(list, function(i, val) {
				var actions = '无操作',innerHtml='';
				if(val.allowCancel) {
					actions = '<a data-command="cancel">撤单</a>';
				}
        if (typeof getSearchParams().vr !== 'undefined') {
          var prizenum = JSON.parse(val.prizedetail);
          ////console.log(prizenum,'prizenumprizenum');

          innerHtml =
          '<tr data-id="' + val.serialnumber + '">'+
            '<td><a data-command="vrdetails" class="vrid">' + val.serialnumber + '</a></td>'+
            '<td>' + val.channelname + '</td>'+
            '<td>' + val.bettypename + '</td>'+
            '<td>' + val.issuenumber + '</td>'+
            '<td>' + moment(val.createtime).format('YYYY-MM-DD HH:mm:ss') + '</td>'+
            '<td>¥ ' + val.cost.toFixed(3) + '</td>'+
            '<td'+(val.state=='3' ? ' class="red"' : '')+'>¥ ' + (val.playerprize ? val.playerprize : 0).toFixed(3) + '</td>'+
            '<td'+(val.state=='3' ? ' class="red"' : '')+'>' + vrstatus(val.substate) + '</td>'+
            '<td>' + actions + '</td>'+
          '</tr>';
        }else {
					console.log(val)
          // innerHtml =
          // '<tr data-id="' + val.billno + '">'+
          //   '<td><a data-command="details">' + val.billno.substring(16) + '</a></td>'+
          //   '<td>' + val.lottery + '</td>'+
          //   '<td class="red">' + val.method + '</td>'+
          //   '<td>' + val.issue + '</td>'+
          //   '<td>' + moment(val.orderTime).format('YYYY-MM-DD HH:mm:ss') + '</td>'+
          //   '<td>¥ ' + val.money.toFixed(3) + '</td>'+
          //   '<td'+(val.statusRemark=='已派奖' ? ' class="red"' : '')+'>¥ ' + (val.winMoney ? val.winMoney : 0).toFixed(3) + '</td>'+
          //   '<td'+(val.statusRemark=='已派奖' ? ' class="red"' : '')+'>' + val.statusRemark + '</td>'+
          //   '<td>' + actions + '</td>'+
          // '</tr>';
					innerHtml =
          '<tr data-id="' + val.billno + '">'+
            '<td><a data-command="details">' + val.billno.substring(16) + '</a></td>'+
            '<td>' + val.lottery + '</td>'+
            '<td class="red">' + val.method + '</td>'+
            '<td>' + val.issue + '</td>'+
            '<td>' + moment(val.orderTime).format('YYYY-MM-DD HH:mm:ss') + '</td>'+
            '<td>¥ ' + val.money.toFixed(3) + '</td>'+
            '<td class="activityAmountStatusc'+val.status+'">¥ ' + (val.winMoney ? val.winMoney : 0).toFixed(3) + '</td>'+
            '<td><span class="activityAmountStatus'+val.status+'">' + (val.status == '4'?'已撤单':val.statusRemark) + '</span></td>'+
            '<td>' + actions + '</td>'+
          '</tr>';
        }

				thisResultTable.find('tbody').append(innerHtml);
			});
			thisResultTable.find('a[data-command="details"]').unbind().click(function() {
				var id = $(this).parents('tr').attr('data-id');
				PopOrder.details(id, thisContent04, function() {
					pagination.reload();
				});
			});
			thisResultTable.find('a[data-command="cancel"]').unbind().click(function() {
				var id = $(this).parents('tr').attr('data-id');
				PopOrder.cancelGeneral(id, thisContent04, function() {
					pagination.reload();
				});
			});


	});
	params.find('input[name="submit"]').unbind().click(function() {
		Will.getPage(thisContent04).init();
	});

  thisContent04.find('.params select:eq(1)').dropkick({theme: "black" ,width:120});
 }


/*游戏纪录结束*/

var initThisPage04a_rpt_vr = function () {

    var thisContent04 = $('[data-init="content"]').eq(5);
    //console.log(thisContent04);
    var params = thisContent04.find('.params');
    var thisResultTable = thisContent04.find('.result > table');

    ////console.log('loadLotteryloadLotteryloadLottery');

    loadLottery(function (list) {
        ////console.log(list,'loadLotteryloadLotteryloadLotteryloadLotteryloadLotteryloadLotteryloadLotteryloadLotteryloadLottery');

        var lottery = $('#rpt-gamerecord-vr').find('select[name="lotteryvr"]');
        ////console.log($('#rpt-gamerecord'),thisContent04,thisContent04.find('.params'),lottery,'lotterylotterylotterylotterylotterylottery');

        lottery.append('<option value="VR" selected="selected">VR金星1.5分彩</option>');
        /*$.each(list, function(i, val) {
          ////console.log(val.showName);
                if (String(val.showName).indexOf('微信')==-1 && String(val.showName).indexOf('急速')==-1 && val.id!='113' && val.id!='110' && val.id!='13' && val.id!='12' && val.id!='6') {
            lottery.append('<option value="' + val.shortName + '">' + val.showName + '</option>');
          }
            });*/
        lottery.dropkick({theme: "black", width: 120});
    });

    initDatePicker();

    var getSearchParams = function () {
        var lottery = params.find('select[name="lotteryvr"]').val();
        var status = params.find('select[name="statusvr"]').val();
        var issue = params.find('input[name="expect"]').val().replace(/(^\s*)|(\s*$)/g, "");
        issue = !!issue ? issue : undefined;
        var time = params.find('input[name="time"]').val();
        var sTime = time.split(' 至 ')[0];
        var eTime = time.split(' 至 ')[1];
        if (lottery == 'VR') {
            params.find('input[name="submit"]').attr('url', '/game/vr/order');
            return {
                vr: 1,
                lottery: lottery,
                state: status,
                issue: issue,
                sTime: sTime + " 00:00:00",
                eTime: eTime + " 23:59:59"
            };
        } else {
            params.find('input[name="submit"]').attr('url', '/game-lottery/search-order');
            return {
                lottery: lottery,
                state: status,
                issue: issue,
                sTime: sTime + " 00:00:00",
                eTime: eTime + " 23:59:59"
            };
        }
    }

    params.find('input[name="submit"]').attr('url', '/game-lottery/search-order');
    //console.log(params.find('input[name="submit"]'));
    Will.page(thisContent04, getSearchParams, params.find('input[name="submit"]'), '没有查询到相关记录', function (list) {
        ////console.log(list,getSearchParams(),'vrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
        thisResultTable.find('tbody').empty();
        var vrstatus = function (str) {
            if (str == null) {
                return '-'
            }
            var statedict = {
                '1': '玩家撤单', '2': '管理员撤单', '4': '整期撤单', '8': '重新颁奖'
            }
            if (typeof statedict[str] !== 'undefined') {
                return statedict[str];
            }
            return str;
        }

        $.each(list, function (i, val) {
            var actions = '无操作', innerHtml = '';
            if (val.allowCancel) {
                actions = '<a data-command="cancel">撤单</a>';
            }
            if (typeof getSearchParams().vr !== 'undefined') {
                var prizenum = JSON.parse(val.prizedetail);
                ////console.log(prizenum,'prizenumprizenum');

                innerHtml =
                    '<tr data-id="' + val.serialnumber + '">' +
                    '<td><a data-command="vrdetails" class="vrid">' + val.serialnumber + '</a></td>' +
                    '<td>' + val.channelname + '</td>' +
                    '<td>' + val.bettypename + '</td>' +
                    '<td>' + val.issuenumber + '</td>' +
                    '<td>' + moment(val.createtime).format('YYYY-MM-DD HH:mm:ss') + '</td>' +
                    '<td>¥ ' + val.cost.toFixed(3) + '</td>' +
                    '<td' + (val.state == '3' ? ' class="red"' : '') + '>¥ ' + (val.playerprize ? val.playerprize : 0).toFixed(3) + '</td>' +
                    '<td' + (val.state == '3' ? ' class="red"' : '') + '>' + vrstatus(val.substate) + '</td>' +
                    '<td>' + actions + '</td>' +
                    '</tr>';
            } else {
                innerHtml =
                    '<tr data-id="' + val.billno + '">' +
                    '<td><a data-command="details">' + val.billno.substring(16) + '</a></td>' +
                    '<td>' + val.lottery + '</td>' +
                    '<td>' + val.method + '</td>' +
                    '<td>' + val.issue + '</td>' +
                    '<td>' + moment(val.orderTime).format('YYYY-MM-DD HH:mm:ss') + '</td>' +
                    '<td>¥ ' + val.money.toFixed(3) + '</td>' +
                    '<td' + (val.statusRemark == '已派奖' ? ' class="red"' : '') + '>¥ ' + (val.winMoney ? val.winMoney : 0).toFixed(3) + '</td>' +
                    '<td' + (val.statusRemark == '已派奖' ? ' class="red"' : '') + '>' + val.statusRemark + '</td>' +
                    '<td>' + actions + '</td>' +
                    '</tr>';
            }

            thisResultTable.find('tbody').append(innerHtml);
        });
        thisResultTable.find('a[data-command="details"]').unbind().click(function () {
            var id = $(this).parents('tr').attr('data-id');
            PopOrder.details(id, thisContent04, function () {
                pagination.reload();
            });
        });
        thisResultTable.find('a[data-command="cancel"]').unbind().click(function () {
            var id = $(this).parents('tr').attr('data-id');
            PopOrder.cancelGeneral(id, thisContent04, function () {
                pagination.reload();
            });
        });


    });
    params.find('input[name="submit"]').unbind().click(function () {
        Will.getPage(thisContent04).init();
    });

    thisContent04.find('.params select:eq(1)').dropkick({theme: "black", width: 120});
}

// 第三方游戏记录开始
var initThisPage08_rpt = function () {
    var thisContent06 = $('[data-init="content"]').eq(6);
    var params = thisContent06.find('.params');
    var thisResultTable = thisContent06.find('.result > table');
    var thirdGames = appConfig().thirdPartyGame;
	var gameNames = ['AGIN', 'IM体育','DS棋牌','CQ9电游'];
	// var gameNames = ['KY棋牌', 'AGIN', 'IM体育','GM棋牌'];
    var gamesBtn = $('#third_party_game .games_btn'); // 第三方游戏按钮集合
    var datesBtn = $('#third_party_game .dates_btn'); // 时间按钮集合
    var childSelect = $('select[name="thirdParty"]');
    // 获取到第三方游戏的key,如‘ky’,'im'
    var getKeys = function() {
        var idx = 0;
        var arr = [];
        for (key in thirdGames) {
            arr.push({key : thirdGames[key].val.split('_')[0], gameName : gameNames[idx]})
            idx++;
        }
        return arr;
    }
    var keysArr = getKeys();
    // 处理子游戏数据
    var handleChildGames = function (list) {
        var _html = '<option value="" selected="selected">全部游戏</option>';
        childSelect.html('');
        list && list.forEach(function(item) {
            _html += '<option value="' + item.key + '">' + item.value + '</option>';
        })
        childSelect.html(_html);
        // childSelect.dropkick({theme: "black", width: 120});
    }

    // 初始化游戏按钮
    var initGameBtns = function () {
        // 组装按钮button
        let str = '';
        keysArr.forEach(function (item, idx) {
            str += '<li rel="' + item.key + '"' + (idx === 0 ? ' class="active"' : '') + '>' + item.gameName + '</li>';
        })
        gamesBtn.html(str);
        gamesBtn.attr('url','/report/' + keysArr[0].key + '-report');
        gamesBtn.find('li').unbind().click(function () {
            $(this).addClass('active').siblings().removeClass('active');
            loadThirdGame($(this).attr('rel'), handleChildGames);
        })
        datesBtn.find('li').unbind().click(function () {
            $(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active').siblings().removeClass('active');
        })
        // 获取第三方游戏的所有子游戏
        loadThirdGame(keysArr[0].key, handleChildGames);
    }
    initGameBtns();
    initDatePicker();
    // 将时间转化成2018-01-01格式
    var formatTime = function (dateObj, isMonth) {
        var year = dateObj.getFullYear();
        var month = dateObj.getMonth() < 9 ? '0' + dateObj.getMonth() : dateObj.getMonth() ;
        if (isMonth) {
            return year + '-' + (month - 0 + 1) + '-01';
        } else {
            var day = dateObj.getDate() < 10 ? '0' + dateObj.getDate() : dateObj.getDate();
            return year + '-' + (month - 0 + 1) + '-' + day;
        }
    }

    var dateObj = new Date();
    var millionTime = dateObj.getTime();
    var getSearchParams = function () {
        var childGameVal = params.find('select[name="thirdParty"]').val();
        var inputTime = params.find('input[name="time"]').val();
        var sTime = '';
        var eTime = formatTime(dateObj);
        var activeTimeBtn = datesBtn.find('li.active');
        btnKey = gamesBtn.find('li.active').attr('rel');
        gamesBtn.attr('url', '/report/' + btnKey + '-report');
        console.log(btnKey,'btnKeybtnKeybtnKeybtnKey');
        // 获取开始时间
        if (activeTimeBtn.length) {
            var dayNum = activeTimeBtn.attr('data-num');
            if (activeTimeBtn.attr('data-num') === 'month') {
                sTime = formatTime(dateObj, true);
            } else {
                sTime = formatTime(new Date(millionTime - 24 * 60 * 60 * 1000 * dayNum));
            }
        } else {
            sTime = inputTime.split(' 至 ')[0];
            eTime = inputTime.split(' 至 ')[1];
        }

        return {
            gameType: childGameVal,
            betDateBegin: sTime + " 00:00:00",
            betDateEnd: eTime + " 23:59:59"
        };
    }
    Will.page(thisContent06, getSearchParams, gamesBtn, '没有查询到相关记录', function (list) {
        thisResultTable.find('tbody').empty();

        list.length && $.each(list, function (i, val) {
            innerHtml =
                '<tr>' +
                '<td>' + val.userName  + '</td>' +
                '<td>' + val.gameName + '</td>' +
                '<td>' + moment(val.calcTime).format('YYYY-MM-DD HH:mm:ss') + '</td>' +
                '<td>' + val.transferInAmount + '</td>' +
                '<td>' + val.transferOutAmount + '</td>' +
                '<td>¥' + val.confirmAmount + '</td>' +
                '<td>¥ ' + val.awardAmount.toFixed(3) + '</td>' +
                '<td>¥' + val.profitAmount + '</td>' +
                '</tr>';

            thisResultTable.find('tbody').append(innerHtml);
        });
    }, true);
    params.find('input[name="submit"]').unbind().click(function () {
        Will.getPage(thisContent06).init();
    });

    thisContent06.find('.params select:eq(1)').dropkick({theme: "black", width: 120});
}
// 第三方游戏记录结束

/*追号记录开始*/
var initThisPage05_rpt = function() {

	var thisContent05 = $('[data-init="content"]').eq(1);
	var params = thisContent05.find('.params');
	var thisResultTable = thisContent05.find('.result > table');

	loadLottery(function(list) {
		var lottery = params.find('select[name="lottery"]');
		$.each(list, function(i, val) {
			lottery.append('<option value="' + val.shortName + '" >' + val.showName + '</option>');
		});
		lottery.dropkick({theme: "black" ,width:120});
	});

	initDatePicker();

	var getSearchParams = function() {
		var lottery = params.find('select[name="lottery"]').val();
		var status = params.find('select[name="status"]').val();
		var time = params.find('input[name="time"]').val();
		var sTime = time.split(' 至 ')[0];
		var eTime = time.split(' 至 ')[1];
		return {lottery: lottery, status: status, sTime: sTime + " 00:00:00", eTime: eTime + " 23:59:59"};
	}

	Will.page(thisContent05,getSearchParams, Route.PATH + '/game-lottery/search-chase','没有查询到相关记录',function(list){
			thisResultTable.find('tbody').empty();
			$.each(list, function(i, val) {
				var actions = '';
				if(val.allowCancel) {
						actions += '<input data-no="' + val.billno + '" data-command="cancel-chase" value="撤销追号" type="button" class="list-chase-cancel">';
				} else {
					actions = "无操作";
				}

				var innerHtml =
				'<tr data-id="' + val.billno + '">'+
					'<td><a data-command="details">' + val.billno + '</a></td>'+
					'<td>' + val.lottery + '</td>'+
					'<td>' + val.method + '</td>'+
					'<td>' + val.startIssue + '</td>'+
					'<td>' + val.clearCount + '/' + val.totalCount + '</td>'+
					'<td>¥ ' + val.totalMoney.toFixed(3) + '</td>'+
					'<td>¥ ' + val.winMoney.toFixed(3) + '</td>'+
					'<td>' +  DataFormat.formatUserChaseStatus(val.status) + '</td>'+
					'<td>' + actions + '</td>'+
 				'</tr>';
				thisResultTable.find('tbody').append(innerHtml);
			});
			thisResultTable.find('a[data-command="details"]').unbind().click(function() {
				var id = $(this).parents('tr').attr('data-id');
				PopOrder.chaseDetail(id, thisContent05, function() {
					Will.getPage(thisContent05).reload();
				});
			});
			thisResultTable.find('a[data-command="cancel"]').unbind().click(function() {
				var id = $(this).parents('tr').attr('data-id');
				PopOrder.cancelGeneral(id, thisContent05, function() {
					Will.getPage(thisContent05).reload();
				});
			});
			thisResultTable.find('[data-command="cancel-chase"]').unbind().click(function() {
				var chaseBillno = $(this).attr('data-no');
				PopOrder.cancelChase(chaseBillno, thisContent05,  function() {
					Will.getPage(thisContent05).reload();
				});
			});
	});

	params.find('input[name="submit"]').unbind().click(function() {
		Will.getPage(thisContent05).init();
	});

 }

/*追号记录结束*/

/*帐变记录开始*/

var initThisPage06_rpt = function() {

	var thisContent06 = $('[data-init="content"]').eq(2);
	var params = thisContent06.find('.params');
	var thisResultTable = thisContent06.find('.result > table');

	initDatePicker();

	var getSearchParams = function() {
		var account = params.find('select[name="account"]').val();
		var type = params.find('select[name="type"]').val();
		var time = params.find('input[name="time"]').val();
		var sTime = time.split(' 至 ')[0];
		var eTime = time.split(' 至 ')[1];
		return {accountType: account, zbType: type, sTime: sTime + " 00:00:00", eTime: eTime + " 23:59:59"};
	}

  var cutNote = function(str) {
    if (String(str).indexOf('转出')>-1 && String(str).indexOf('上级')>-1) {
      return str.replace(/\(.*\)/g,'');
    }
    return str
  }
	Will.page(thisContent06,getSearchParams, Route.PATH + '/account/search-zbrecord','没有查询到相关记录',function(list){
			thisResultTable.find('tbody').empty();
			$.each(list, function(i, val) {
				/*var noTD = '';
				if(val.type == 1300 || val.type == 1301 || val.type == 1302 || val.type == 1303 || val.type == 1400){
					noTD = '<a data-command="details">' + val.billno.substring(16) + '</a>';
				}else{
					noTD = val.billno.substring(16);
				}*/
        var deatilsDict = {
          '20':'彩票分红'
        }
				var innerHtml =
				/*'<tr data-id="' + val.billno + '">'+
					'<td>' + noTD + '</td>'+
					'<td>' + DataFormat.formatAccountType(val.accountType) + '</td>'+
					'<td>' + DataFormat.formatUserBillType(val.type) + '</td>'+
					'<td>¥ ' + DataFormat.formatAmount(val.balanceBefore) + '</td>'+
					'<td>¥ ' + DataFormat.formatAmount(val.amount) + '</td>'+
					'<td>¥ ' + DataFormat.formatAmount(val.balanceAfter) + '</td>'+
					'<td>' + moment(val.time).format('MM/DD HH:mm:ss') + '</td>'+
					'<td><a title="' + val.remarks + '" data-command="remarks">详情</a></td>'+
				'</tr>';val.spsn.substr(8)*/
					'<tr>'+
					'<td width="219px;" title="'+val.spsn +'">' + val.spsn + '</td>'+
					'<td width="51px;" title="'+val.cn +'">' + val.cn + '</td>'+
					'<td width="151px;" title="'+val.createTime +'">' + val.createTime  + '</td>'+
					'<td width="140px;" title="'+val.changeTypeStr +'">' + val.changeTypeStr + '</td>'+
					'<td width="140px;" title="'+(val.changeTypeDetailStr ? val.changeTypeDetailStr : deatilsDict[val.changeDetailType]) +'">' + (val.changeTypeDetailStr !='' ? val.changeTypeDetailStr : deatilsDict[val.changeDetailType]) + '</td>'+
					'<td width="67px;" title="'+val.amount.toFixed(4) +'" class="'+(val.optType==2?'greentd':'redtd') +'">¥ '+(val.optType==2?'-':'') + val.amount.toFixed(4) + '</td>'+
					'<td width="57px;" title="'+val.point.toFixed(4) +'">¥' + val.point.toFixed(4) + '</td>'+
					'<td width="177px;" title="'+cutNote(val.note) +'">' + cutNote(val.note) + '</td>'+
					/*'<td><a title="' + val.remarks + '" data-command="infos">详情</a></td>'+*/
				'</tr>';
				thisResultTable.find('tbody').append(innerHtml);
			});
			thisResultTable.find('a[data-command="details"]').unbind().click(function() {
				var id = $(this).parents('tr').attr('data-id');
				PopBillDetail.details(id, thisContent06);
			});
			thisResultTable.find('a[data-command="remarks"]').jBox('Tooltip', {position: {x: 'right', y: 'center'}, outside: 'x'});
	});
	params.find('input[name="submit"]').unbind().click(function() {
		Will.getPage(thisContent06).init();
	});

  $.get('/yx/u/api/account/querySalaryBonus',function(sets) {
    ////console.log(sets);
    var sabo = sets.data;
    if (sabo.bonus!='0') {
      thisContent06.find('select[name="type"]').append('<option value="91">分红</option>');
    }
    thisContent06.find('.params select').dropkick({theme: "black" ,width:120});
  });
 }

/*帐变记录结束*/
//天彩 vr 开始
var initThisPage08_tcvr = function() {


	var thisContent05 =$("#tcvr_report_content")
	function TcfiftertcGmaeList(code){
      for(var i = 0; i < tcGmaeList.length; i++) {
        var a = tcGmaeList[i];
        if(code == a['val'])return a['key'];
      }
      return '天彩VR'
    }
    initDatePicker();
    var thisContent06 = $('[data-init="content"]').eq(7);
    var params = thisContent06.find('.params');
    var thisResultTable = thisContent06.find('.result > table');
    var dateObj = new Date();
    var datesBtn = thisContent06.find('.dates_btn'); // 时间按钮集合
    var millionTime = dateObj.getTime();
    var formatTime = function (dateObj, isMonth) {
        var year = dateObj.getFullYear();
        var month = dateObj.getMonth() < 9 ? '0' + dateObj.getMonth() : dateObj.getMonth() ;
        if (isMonth) {
            return year + '-' + (month - 0 + 1) + '-01';
        } else {
            var day = dateObj.getDate() < 10 ? '0' + dateObj.getDate() : dateObj.getDate();
            return year + '-' + (month - 0 + 1) + '-' + day;
        }
    }
    var getSearchParams = function () {
        var childGameVal = params.find('select[name="thirdParty"]').val();
        var inputTime = params.find('input[name="time"]').val();
        var sTime = '';
        var eTime = formatTime(dateObj);
        var activeTimeBtn = datesBtn.find('li.active');
        // 获取开始时间
        if (activeTimeBtn.length) {
            var dayNum = activeTimeBtn.attr('data-num');
            if (activeTimeBtn.attr('data-num') === 'month') {
                sTime = formatTime(dateObj, true);
            } else {
                sTime = formatTime(new Date(millionTime - 24 * 60 * 60 * 1000 * dayNum));
            }
        } else {
            sTime = inputTime.split(' 至 ')[0];
            eTime = inputTime.split(' 至 ')[1];
        }

        return {
            gameType: childGameVal,
            betDateBegin: sTime + " 00:00:00",
            betDateEnd: eTime + " 23:59:59"
        };
    }
    datesBtn.find('li').unbind().click(function () {
        $(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active').siblings().removeClass('active');
    });
    Will.page(thisContent06, getSearchParams, '/yx/u/api/report/tcg-report',  '没有查询到相关记录', function (list) {
        thisResultTable.find('tbody').empty();

        list.length && $.each(list, function (i, val) {
            innerHtml =
                '<tr>' +
                '<td>' + val.userName  + '</td>' +
                '<td>'+TcfiftertcGmaeList(val.gameType)+'</td>' +
                '<td>' + moment(val.calcTime).format('YYYY-MM-DD HH:mm:ss') + '</td>' +
                '<td>¥' + val.confirmAmount + '</td>' +
                '<td>¥ ' + val.awardAmount.toFixed(3) + '</td>' +
                '<td>¥' + val.profitAmount + '</td>' +
                '</tr>';

            thisResultTable.find('tbody').append(innerHtml);
        });
    }, true);
    params.find('input[name="submit"]').unbind().click(function () {
        thisResultTable.find('tbody').empty();
        Will.getPage(thisContent06).init();
    });


 }

var initReport = function() {
  ////console.log('initReportinitReportinitReport');

  Will.changeTabs([initThisPage04a_rpt,initThisPage05_rpt,initThisPage06_rpt,null,initThisPage04_rpt,initThisPage04a_rpt_vr,initThisPage08_rpt,null,initThisPage08_tcvr]);
}

//添加天彩  VR 入口
//  $.ajax({
//  	type:"POST",
//  	url:"/yx/thirdGameApi/common/getLoginUrl?platformId=14",
//  	async:true,
//  	success:function(res){
//  	setTimeout(function(){
//  		console.log(res)
//  	   if (res.code === 0) {
//            $("#login_header ul.lotteryListMain:last").append('<li class="first_cls"  id="tcvrisShow"><a id="tcvrlink" target="_blank"  href="">天彩VR</a></li>');
//            $("#tcvrlink").attr({"href":res.data})
//         }else{
//         	$("#tcvrisShow").remove();
//         }},1000)
//  	}
//  });
