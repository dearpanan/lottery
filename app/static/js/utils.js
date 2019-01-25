var LotteryUtils,LotteryMain,AppDataInitData,allres;

var RecordList = function() {

	/**
	 * 订单工具类
	 */
	var OrderUtils = function() {
		var isLoading = false;
		var loadData = function(billno, thisContent, callback) {
			var plen = arguments.length;
      if(!isLoading) {
				isLoading = true;
				App.blockUI({
					target: thisContent,
					boxed: true
				});
				$.ajax({
					type: 'post',
					url:  Route.PATH + '/game-lottery/get-order',
					data: {billno: billno},
					timeout: 10000,
					dataType: 'json',
					success: function(response) {
						isLoading = false;
						App.unblockUI(thisContent);
						if(response.error == 0) {
							if (plen<4) {
                initBox(response.data, thisContent, callback);
              }else {
                callback(response.data,thisContent);
              }
              //initBox(response.data, thisContent, callback);
						}
						if(response.error == 1 || response.error == 2) {
							App.alert('warning', '提示消息', response.message);
						}
					},
					error: function() {
						isLoading = false;
						App.unblockUI(thisContent);
					}
				});
			}
		}
		var initDoc = function(data) {
			var actions = '';
			if(data.allowCancel) {
				actions += '<input data-id="' + data.billno + '" data-command="cancel-general" value="撤销订单" type="button" class="button">';
			} else {
				actions = '<input value="无操作" type="button" class="button grey">';
			}
			var formatPrizeModel = data.point > 0 ? data.code + ' + 返点' + data.point.toFixed(1) + '%' : data.code;
			var innerHtml =
			'<div class="lottery-order-details">'+
				'<table class="info">'+
					'<tbody>'+
						'<tr>'+
							'<td class="label">订单编号</td>'+
							'<td class="value">' + data.billno + '</td>'+
							'<td class="label">状态</td>'+
							'<td class="value">' + data.statusRemark + '</td>'+
						'</tr>'+
						'<tr>'+
							'<td class="label">彩种</td>'+
							'<td>' + data.lottery + '</td>'+
							'<td class="label">期号</td>'+
							'<td>' + data.issue + '期</td>'+
						'</tr>'+
						'<tr>'+
							'<td class="label">玩法</td>'+
							'<td>' + data.method + '</td>'+
							'<td class="label">注数</td>'+
							'<td>' + data.nums + '注</td>'+
						'</tr>'+
						'<tr>'+
							'<td class="label">资金模式</td>'+
							'<td>' + DataFormat.formatUserBetsModel(data.model) + '</td>'+
							'<td class="label">倍数</td>'+
							'<td>' + data.multiple + '倍</td>'+
						'</tr>'+
						'<tr>'+
							'<td class="label">奖金模式</td>'+
							'<td>' + data.code + '</td>'+
							'<td class="label">返点</td>'+
							'<td>' + data.point.toFixed(1) + '%</td>'+
						'</tr>'+
						'<tr>'+
							'<td class="label">投注金额</td>'+
							'<td>¥ ' + data.money.toFixed(3) + '</td>'+
							'<td class="label">中奖金额</td>'+
							'<td>¥ ' + data.winMoney.toFixed(3) + '</td>'+
						'</tr>'+
						'<tr>'+
							'<td class="label">下单时间</td>'+
							'<td colspan="3">' + moment(data.orderTime).format('YYYY-MM-DD HH:mm:ss') + '</td>'+
							//'<td class="label" rel="封单时间"></td>'+
							//'<td rel="'+moment(data.stopTime).format('YYYY-MM-DD HH:mm:ss')+'"></td>'+
						'</tr>'+
						'<tr>'+
							'<td class="label">开奖号码</td>'+
							'<td colspan="3">' + (data.openCode ? data.openCode : '无') + '</td>'+
						'</tr>'+
						'<tr>'+
							'<td class="label">投注内容<br><a class="hand print">打印</a></td>'+
							'<td colspan="3" class="v-middle">'+ '<div id="printnow"></div>'+
								'<div class="scroller" style="height: 90px; overflow-x: hidden;overflow-y: auto;">'+
									'<div class="text-codes">' + (String(data.method).indexOf('单式')>-1 ? String(data.content).replace(/,/g,'').replace(/\|/g, ',') : data.content) + '</div>'+
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
				if(box) box.close();
			});
		}
		var box;
		var initBox = function(data, thisContent, callback) {
			if(box == undefined) {
				var doc = initDoc(data);
				box = new jBox('Modal', {
					width: 800,
					height: 498,
					title: '订单详情',
					overlay: true,
					closeOnClick: false,
					blockScroll: false,
					animation: {open: 'zoomIn'},
					closeButton: 'title',
					draggable: 'title',
					content: doc,
					addClass: 'common-modal grey',
					onInit: function() {
						this.open();
						initEvent(thisContent, data, callback);
						App.initScroll('.scroller');
            //App.initScroll();
            //
					},
					onCloseComplete: function() {
						this.destroy();
						box = undefined;
					}
				});
			} else {
				box.toggle();
			}
		}
		var details = function(billno, thisContent, callback) {
			loadData(billno, thisContent, callback);
		}
    var detailsnopop = function(billno, thisContent, callback) {
			loadData(billno, thisContent, callback, 1);
		}
		var isCanceling = false;
		var doCancelOrder = function(data, thisContent, callback) {
			if(!isCanceling) {
				isCanceling = true;
				App.blockUI({
					target: thisContent,
					boxed: true
				});
				$.ajax({
					type: 'post',
					url: Route.PATH + '/game-lottery/cancel-order',
					data: data,
					timeout: 10000,
					dataType: 'json',
					success: function(response) {
						isCanceling = false;
						App.unblockUI(thisContent);
						if(response.error == 0) {
							App.alert('success', '提示消息', '操作成功，该订单已成功撤销。', 3000);
							if($.isFunction(callback)) callback();
						}
						if(response.error == 1 || response.error == 2) {
							App.alert('warning', '提示消息', response.message);
						}
					},
					error: function() {
						isCanceling = false;
						App.unblockUI(thisContent);
					}
				});
			}
		}
		var cancelGeneral = function(billno, thisContent, callback) {
			if(box) box.close();
			App.confirm('question', '确认消息', '确定要撤销该订单？', 0, '确定', '取消', function() {
				var data = {billno: billno};
				doCancelOrder(data, thisContent, callback);
			},function() {

      },'cancel-common');
		}
		var cancelChase = function(chaseBillno, thisContent, callback) {
			if(box) box.close();
			App.confirm('question', '确认消息', '确定要撤销该追号订单？', 0, '确定', '取消', function() {
				var data = {type: 'chase', billno: chaseBillno};
				Will.ajax(data,Route.PATH + '/game-lottery/cancel-chase',callback);
			});
		}
		return {details: details,detailsnopop: detailsnopop, cancelGeneral: cancelGeneral, cancelChase: cancelChase}
	}();

  var PopOrderRecord = function() {

    var initDoc = function(data) {
      //console.log(data,'datadatadata');
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
              '<td class="label-f">投注内容</td>'+
              '<td colspan="3" class="v-middle">'+
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
    var initEvent = function(thisContent, callback) {
      $('.lottery-order-details').find('[data-command="cancel-general"]').click(function() {
        var id = $(this).attr('data-id');
        cancelGeneral(id, thisContent, callback);
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
        Will.initBox('订单详情', initDoc(data),800,420,initEvent);
      })
    }
    var doCancelOrder = function(data, thisContent, callback) {
      Will.ajax(data,Route.PATH + '/game-lottery/cancel-order', function(data){
        App.alert('success', '提示消息', '操作成功，该订单已成功撤销。', 500);
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
              '<td class="value" rel="'+data.status+'">' + data.statusStr + '</td>'+
              //'<td class="value">' + DataFormat.formatUserChaseStatus(data.status) + '</td>'+
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
                '<div class="scroller" style="height: 60px; width:584px; overflow-x: hidden; overflow-y: auto;">'+
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

  var repeatAgain = function(a,data) {
    var aviableMethod = GameData.getMethodList();
    //console.log('44444',aviableMethod);
    var methodcode = a.parent().attr('rel');
    var methodtime = a.parent().attr('time');
    var methodmodel = a.parent().attr('model');
    var methodcn = a.parent().attr('method');
    var methodcontent = a.parent().attr('content');
    console.log(methodcontent,'beforebeforebeforebeforebeforebefore');
    var postcontent = methodcontent.replace(/,/g,'').replace(/\|/g, ',');
    if (String(methodcn).indexOf('任选')>-1) {
      postcontent = methodcontent;
    }
    if (String(methodcn).indexOf('单式')>-1) {
      postcontent = methodcontent.replace(/,/g,'').replace(/\|/g, ' ');
    }
    console.log(methodcn,postcontent,'afterafterafterafterafterafter');
    var getdata = data;
    var bindNumber = function(els) {
      if(els.length == 0) return;
      els.keydown(function(e) {
        if(e.keyCode == 38 || e.keyCode == 40) {
          if($(this).val() == '') return;
          var val = Number($(this).val());
          if (val>999) {
            val = 999;
          }
          if(!isNaN(val)) {
            if(e.keyCode == 38) val++;
            if(e.keyCode == 40) val--;
            if(val < 0) val = 0;
            $(this).val(val);
          }
        }
      });
      els.keyup(function() {
        if($(this).val() == '') return;
        var val = Number($(this).val());
        if(/^[0-9]*$/.test(val)) {
          if(val < 0) $(this).val(1);
        } else {
          $(this).val(0);
        }
      });
      els.blur(function() {
        if($(this).val() == '') {
          $(this).val(0);
        }
      });
    }

    BootstrapDialog.show({
      cssClass:'quick-bet',
      title: '<i class="icon lock"></i>再来一注',
      onshow: function(d) {
        d.$modalBody.find('.totalm').data('money',getdata.money);
        d.$modalBody.find('.totalm').data('repeat',getdata.money);
        d.$modalBody.find('.totalm').data('times',1);
        //console.log(d.$modalBody.find('.totalm').data('repeat'),'rrrrrrrrrr');

        d.$modalBody.find('.betmodel').off('click').on('click','a',function() {
          $(this).siblings().removeClass('selected');$(this).addClass('selected');
          $('.record-list').data('m',$(this).data('val'));
          var plustime = {
            'yuan':1,'jiao':0.1,'fen':0.01,'li':0.001
          }
          var backrealt = d.$modalBody.find('.totalm').data('money')/plustime[getdata.model];

          //console.log(d.$modalBody.find('.totalm').data('money'),plustime[getdata.model]);
          //console.log(backrealt,d.$modalBody.find('.totalm').data('money'),plustime[d.$modalBody.find('.betmodel a.selected').data('val')]);

          //console.log(backrealm,d.$modalBody.find('.betmodel a.selected').data('val'));
          var newmoney = backrealt*plustime[d.$modalBody.find('.betmodel a.selected').data('val')]/methodtime;
          //console.log(newmoney,'initttttttttttt');
          d.$modalBody.find('.totalm').data('repeat',newmoney);
          newmoney = newmoney*parseInt(d.$modalBody.find('.multiple input').val(),10);
          if (typeof String(newmoney).split('.')[1] !== 'undefined' && String(newmoney).split('.')[1].length>10) {
            newmoney = Number(newmoney).toFixed(2);
          }
          //console.log(newmoney);
          d.$modalBody.find('.totalm i').html(newmoney);
        });
        d.$modalBody.find('.bettime input').val(methodtime);
        //console.log(methodtime,'methodtimemethodtime',getdata.model);
        //console.log($('.record-list').data('m'),'read');
        if (typeof $('.record-list').data('m') !='undefined') {
          d.$modalBody.find('.betmodel a').removeClass('selected');
          //console.log($('.record-list').data('m'));
          //console.log($('.record-list').data('m')!=getdata.model,$('.record-list').data('m'),getdata.model);
          if ($('.record-list').data('m')!=getdata.model) {
            d.$modalBody.find('.betmodel a[data-val="'+getdata.model+'"]').addClass('selected');
          }else {
            d.$modalBody.find('.betmodel a[data-val="'+$('.record-list').data('m')+'"]').addClass('selected');
          }
        }else {
          d.$modalBody.find('.betmodel a').removeClass('selected');
          d.$modalBody.find('.betmodel a[data-val="'+getdata.model+'"]').addClass('selected');
        }
        bindNumber(d.$modalBody.find('.bettime input'));
        d.$modalBody.find('.bettime .subm').off('click').on('click',function() {
          var event = $.Event("keydown");
          event.keyCode = 40;
          if (parseInt($(this).next().val(),10)==1) {
            return false;
          }
          $(this).next().trigger(event);
          $(this).next().trigger("keyup");
          var addtimem = d.$modalBody.find('.totalm').data('repeat')*parseInt($(this).next().val(),10);
          if (typeof String(addtimem).split('.')[1] !== 'undefined' && String(addtimem).split('.')[1].length>10) {
            addtimem = Number(addtimem).toFixed(2);
          }
          d.$modalBody.find('.totalm i').html(addtimem);
        });
        d.$modalBody.find('.bettime .addm').off('click').on('click',function() {
          var event = $.Event("keydown");
          event.keyCode = 38;
          $(this).prev().trigger(event);
          $(this).prev().trigger("keyup");
          var addtimem = d.$modalBody.find('.totalm').data('repeat')*parseInt($(this).prev().val(),10);
          if (typeof String(addtimem).split('.')[1] !== 'undefined' && String(addtimem).split('.')[1].length>10) {
            addtimem = Number(addtimem).toFixed(2);
          }
          d.$modalBody.find('.totalm i').html(addtimem);
        });
      },
      message:function(){
          return [
            "<div class='cftip lname'>彩种："+GameData.getInfo().showName+"</div>",
            "<div class='cftip digest'>"+methodcn+","+postcontent+"</div>",
            "<div class='cftip totalm'>付款总金额：<i>"+data.money+"</i>元</div>",
            "<div class='cftip betmodel'><label>模式：</label><div class='model'><a data-val='yuan' class='selected'>元</a><a data-val='jiao'>角</a><a data-val='fen'>分</a><a data-val='li'>厘</a></div></div>",
            "<div class='cftip bettime'><label>倍数：</label><div class='multiple'><span class='subm hand'>-</span><input name='multiple' type='text' value='1'><span class='addm hand'>+</span></div></div>",
            ""
          ].join('')
        }(),
      buttons: [{
        label: '确定投注',
        action: function(dialog) {
          //console.log(typeof GameLotteryCtrl !='undefined');
          //var data = { text: $.toJSON(list) };
          //"-,4,4,5,-"
          var modelv = dialog.$modalBody.find('.betmodel a.selected').data('val');
          var modelt = dialog.$modalBody.find('.bettime input').val();

          if (modelt>999) {
            modelt = 999;
          }
          var recontent = String(getdata.content).replace(/,/g,'').replace(/\|/g, ',');
          if (String(GameData.getInfo().shortName).indexOf('11Y')>-1) {
            recontent = String(getdata.content).replace(/,/g,' ').replace(/\|/g, ',')
            //postcontent = String(getdata.content).replace(/,/g,' ').replace(/\|/g, ',')+',-,-';
            //console.log(postcontent,'_____',recontent);
          }
          //alert(methodcn);
          if (String(GameData.getInfo().shortName).indexOf('PK10')>-1) {
            //recontent = String(getdata.content);
            if (String(getdata.content).indexOf('|')>-1) {
              recontent = String(getdata.content).replace(/,/g,' ').replace(/\|/g, ';');
            }else {
              recontent = String(getdata.content);
            }
            //postcontent = String(getdata.content).replace(/,/g,' ').replace(/\|/g, ',')+',-,-';
            //console.log(getdata.content,'_____',recontent);
          }

          if (String(methodcn).indexOf('单式')>-1) {
            recontent = String(getdata.content).replace(/,/g,'').replace(/\|/g, ' ');
          }

          if (String(GameData.getInfo().shortName).indexOf('K3')>-1) {
            recontent = String(getdata.content);
            //postcontent = String(getdata.content).replace(/,/g,' ').replace(/\|/g, ',')+',-,-';
            //console.log(getdata.content,'_____',recontent);
          }
          console.log(recontent,'recontent');
          if (postcontent!=recontent) {
            postcontent = recontent;
          }

          /*if (parseFloat(dialog.$modalBody.find('.totalm i').html())<0.01) {
            App.alert('warning', '提示消息', "使用厘模式进行投注，单注注单最小金额为0.01元！");
			      dialog.close();
            return;
          }*/
          //console.log(postcontent==String(getdata.content).replace(/,/g,'').replace(/\|/g, ','));
          var data = { text: '[{"lottery":"'+GameData.getInfo().shortName+'","issue":"'+$('[data-field="global-expect"]').text()+'","method":"'+methodcode+'","content":"'+postcontent+'","model":"'+modelv+'","multiple":"'+modelt+'","code":'+$('.lottery-betting .lottery-opearation .adjust-prize [data-field="code"]').html()+',"compress":false}]' };
          //console.log(data,'data');
          GameLotteryCtrl.addOrder({
            data: data,
            beforeSend: function() {

            },
            success: function(response) {
              if(response.error == 0) {
                App.alert('success', '提示消息', '您的订单已投注成功！', 3000);
                $('[data-field="lotteryBalance"]').html(response.data);
                if (typeof RecordList != 'undefined') {
                  RecordList.init();
                }
              }else {
                App.alert('info', '消息提示', response.message, 3000);
              }
            }
          });
          //alert('1');
          dialog.close();
        }
      }, {
        label: '取消',
        action: function(dialog) {
          dialog.close();
        }
      }]
    });
  }

  var shortMethodCn = function(m) {
    m = String(m).replace('二星后二', '后二').replace('二星前二', '前二');
    return (String(m).length>8 ? String(m).substring(0,8)+'...' : m)
  }

  var formatRepeatContent = function(cc,m,mcode) {
    //console.log(String(m).indexOf('后二')>-1 && mcode=='exzhixfsh',m,mcode);
    if (String(m).indexOf('后二')>-1 && mcode=='exzhixfsh') {
      return '-|-|-|'+cc;
    }
    return cc;
  }

	var initNotOpenOrder = function() {
		var thisContent = els().find('[data-content="NotOpenOrder"]');
		var thisResultTable = thisContent.find('.result > table');

		thisContent.show();

		var getSearchParams = function() {
			var sTime = moment().format('YYYY-MM-DD') + " 00:00:00";
			var eTime = moment().add(1, 'days').format('YYYY-MM-DD') + " 23:59:59";
			return {sTime: sTime, eTime: eTime, status: 0, lotteryType : 1};
		}

		var isSearching = false;
		var pagination = $.pagination({
			render: thisContent.find('.page-list'),
			pageSize: 5,
			ajaxType: 'post',
			ajaxUrl:  Route.PATH + '/game-lottery/search-order',
			ajaxData: getSearchParams,
			beforeSend: function() {
				isSearching = true;
				App.blockUI({
					target: thisContent,
					boxed: true
				});
			},
			complete: function() {
				isSearching = false;
				App.unblockUI(thisContent);
			},
			success: function(list) {
				thisResultTable.find('tbody').empty();
        var iscancancel = true;
        if (Number($('[data-field="global-last-time"]').attr('s'))<13) {
          iscancancel = false;
        }
				$.each(list, function(i, val) {
					var actions = '无操作';
					if(val.allowCancel) {
						actions = (iscancancel ? '<a data-command="cancel">撤单</a>' : '');
					}
          var shortMethod = String(val.method).replace(/[万千百十个]/g, '');
          if (actions!='无操作' && shortMethod.indexOf('任选')==-1) {
            actions += '<a style="margin-left:2px;" data-command="repeat" ><em class="icon" rel="再来一注">&#xe6c3;</em></a>';
          }else {
            if (shortMethod.indexOf('任选')==-1) {
              actions = '<a data-command="repeat"><em class="icon" rel="再来一注">&#xe6c3;</em></a>';
            }
          }

					var innerHtml =
					'<tr data-billno="' + val.billno + '">'+
						'<td><a data-command="details">' + val.billno.substr(16) + '</a></td>'+
						//'<td>' + val.lottery + '</td>'+
						'<td title="'+val.method+'">' + val.lottery+'/'+ shortMethodCn(shortMethod) + '</td>'+
						'<td>' + val.issue + '</td>'+
						'<td>' + moment(val.orderTime).format('MM-DD HH:mm:ss') + '</td>'+
						'<td>¥' + val.money.toFixed(3) + '</td>'+
						'<td>¥' + (val.winMoney ? val.winMoney : 0).toFixed(3) + '</td>'+
						'<td>' + val.statusRemark + '</td>'+
						'<td class="repeatbtn" rel="'+val.methodCode+'" model="'+val.model+'" time="'+val.multiple+'" method="'+val.method+'" content="'+formatRepeatContent(val.content,val.method,val.methodCode)+'">' + (val.lottery == GameData.getInfo().showName ? actions : '') + '</td>'+
					'</tr>';
					thisResultTable.find('tbody').append(innerHtml);
				});
				thisResultTable.find('a[data-command="details"]').click(function() {
					var billno = $(this).parents('tr').attr('data-billno');
					OrderUtils.details(billno, thisContent, function() {
						pagination.reload();
					});
				});
				thisResultTable.find('a[data-command="cancel"]').click(function() {
					var billno = $(this).parents('tr').attr('data-billno');
					OrderUtils.cancelGeneral(billno, thisContent, function() {
						pagination.reload();
					});
				});
				thisResultTable.find('a[data-command="repeat"]').click(function() {
          var billno = $(this).parents('tr').attr('data-billno');
          var t = $(this);
          OrderUtils.detailsnopop(billno, thisContent, function(res,c) {
						//console.log(res,c);
            repeatAgain(t,res);
            //pagination.reload();
					});
          //-,3,47,567,6转换到3|4,7|5,6,7|6
          //repeatAgain($(this),{});
				});
			},
			pageError: function(response) {
				isSearching = false;
			},
			emptyData: function() {
				isSearching = false;
				var emptyHtml = '<tr class="nodata"><td colspan="20"><em class="blanksign"></em></td></tr>';   //当前没有未开奖订单
				thisResultTable.find('tbody').html(emptyHtml);
			}
		});
		// 初始化
		pagination.init();
	}

	var initHistoryOrder = function() {
		var thisContent = els().find('[data-content="HistoryOrder"]');
		var thisResultTable = thisContent.find('.result > table');

		thisContent.show();

		var getSearchParams = function() {
			var sTime = moment().format('YYYY-MM-DD') + " 00:00:00";
			var eTime = moment().add(1, 'days').format('YYYY-MM-DD') + " 23:59:59";
			return {sTime: sTime, eTime: eTime, lotteryType : 1};
		}

		var isSearching = false;
		var pagination = $.pagination({
			render: thisContent.find('.page-list'),
			pageSize: 5,
			ajaxType: 'post',
			ajaxUrl:  Route.PATH + '/game-lottery/search-order',
			ajaxData: getSearchParams,
			beforeSend: function() {
				isSearching = true;
				App.blockUI({
					target: thisContent,
					boxed: true
				});
			},
			complete: function() {
				isSearching = false;
				App.unblockUI(thisContent);
			},
			success: function(list) {
				thisResultTable.find('tbody').empty();
				$.each(list, function(i, val) {
					var actions = '无操作';
          var iscancancel = true;
          //console.log($('[data-field="global-last-time"]').attr('s'));
          if (Number($('[data-field="global-last-time"]').attr('s'))<13) {
            iscancancel = false;
          }
					if(val.allowCancel) {
						actions = (iscancancel ? '<a data-command="cancel">撤单</a>' : '');
					}
          var shortMethod = String(val.method).replace(/[万千百十个]/g, '');
          if (actions!='无操作' && shortMethod.indexOf('任选')==-1) {
            actions += '<a data-command="repeat" style="margin-left:2px;"><em class="icon" rel="再来一注">&#xe6c3;</em></a>';
          }else {
            if (shortMethod.indexOf('任选')==-1) {
              actions = '<a data-command="repeat"><em class="icon" rel="再来一注">&#xe6c3;</em></a>';
            }
            // <em class="icon">&#xe6c3;</em>
          }
					var innerHtml =
					'<tr data-billno="' + val.billno + '">'+
						'<td><a data-command="details">' + val.billno.substr(16) + '</a></td>'+
						//'<td>' + val.lottery + '</td>'+shortMethodCn(shortMethod)
						'<td title="'+val.method+'"><label class="maxhidden">' + val.lottery+'/'+ val.method + '</label></td>'+
            '<td title="' + val.content + '">' + val.content.substr(0,9) + '</td>'+
						'<td>' + val.issue + '</td>'+
						'<td>' + moment(val.orderTime).format('MM-DD HH:mm:ss') + '</td>'+
						'<td title="'+val.money.toFixed(3)+'"><label class="maxmoney">¥' + val.money.toFixed(3) + '</label></td>'+
						'<td title="'+(val.winMoney ? val.winMoney : 0).toFixed(3)+'"><label class="maxmoney">¥' + (val.winMoney ? val.winMoney : 0).toFixed(3) + '</label></td>'+
						'<td>' + val.statusRemark + '</td>'+
						'<td class="repeatbtn" rel="'+val.methodCode+'" model="'+val.model+'" time="'+val.multiple+'" method="'+val.method+'" content="'+formatRepeatContent(val.content,val.method,val.methodCode)+'">' + (typeof GameData.getInfo() !='undefined' && val.lottery == GameData.getInfo().showName ? actions : '') + '</td>'+
					'</tr>';
					thisResultTable.find('tbody').append(innerHtml);
				});
				thisResultTable.find('a[data-command="details"]').click(function() {
					var billno = $(this).parents('tr').attr('data-billno');
					OrderUtils.details(billno, thisContent, function() {
						pagination.reload();
					});
				});
				thisResultTable.find('a[data-command="cancel"]').click(function() {
					var billno = $(this).parents('tr').attr('data-billno');
					OrderUtils.cancelGeneral(billno, thisContent, function() {
						pagination.reload();
					});
				});

				thisResultTable.find('a[data-command="repeat"]').click(function() {
					var billno = $(this).parents('tr').attr('data-billno');
					var t = $(this);
          OrderUtils.detailsnopop(billno, thisContent, function(res,c) {
						//console.log(res,c);
            repeatAgain(t,res);
            //pagination.reload();
					});

          //-,3,47,567,6转换到3|4,7|5,6,7|6
          //repeatAgain($(this));
				});
			},
			pageError: function(response) {
				isSearching = false;
			},
			emptyData: function() {
				isSearching = false;
				var emptyHtml = '<tr class="nodata"><td colspan="20"><em class="blanksign"></em></td></tr>';  //当前没有历史投注记录
				thisResultTable.find('tbody').html(emptyHtml);
			}
		});
		// 初始化
		pagination.init();
	}

	var initChaseOrder = function() {
		var thisContent = els().find('[data-content="ChaseOrder"]');
		var thisResultTable = thisContent.find('.result > table');

		thisContent.show();

		var getSearchParams = function() {
			var sTime = moment().format('YYYY-MM-DD');
			var eTime = moment().add(1, 'days').format('YYYY-MM-DD');
			return {sTime: sTime, eTime: eTime, lotteryType : 1};
		}

		var isSearching = false;
		var pagination = $.pagination({
			render: thisContent.find('.page-list'),
			pageSize: 5,
			ajaxType: 'post',
			ajaxUrl: Route.PATH + '/game-lottery/search-chase',
			ajaxData: getSearchParams,
			beforeSend: function() {
				isSearching = true;
				App.blockUI({
					target: thisContent,
					boxed: true
				});
			},
			complete: function() {
				isSearching = false;
				App.unblockUI(thisContent);
			},
			success: function(list) {
				thisResultTable.find('tbody').empty();
				$.each(list, function(i, val) {
					var actions = '无操作';
					if(val.allowCancel) {
						actions = '<a data-command="cancel-chase">撤单</a>';
					}
          var shortMethod = String(val.method).replace(/[万千百十个]/g, '');
					var innerHtml =
					'<tr data-id="' + val.billno + '">'+
						'<td><a class="hand" data-command="details">' + val.billno + '</a></td>'+
						//'<td>' + val.lottery + '</td>'+
            '<td title="'+val.method+'"><label class="maxhidden">' + val.lottery+'/'+ (String(shortMethod).length>8 ? String(shortMethod).substring(0,8)+'...' : shortMethod) + '</label></td>'+
						//'<td title="'+val.method+'">' + val.lottery+'/'+ (String(shortMethod).length>8 ? String(shortMethod).substring(0,8)+'...' : shortMethod) + '</td>'+
            //'<td>' + val.method + '</td>'+
						'<td>' + val.startIssue + '</td>'+
						'<td>' + val.clearCount + '/' + val.totalCount + '</td>'+
						'<td>¥' + val.totalMoney.toFixed(3) + '</td>'+
						'<td>¥' + val.winMoney.toFixed(3) + '</td>'+
						'<td>' + val.statusStr + '</td>'+
            //'<td>' + DataFormat.formatUserChaseStatus(val.status) + '</td>'+
						'<td>' + actions + '</td>'+
					'</tr>';
					thisResultTable.find('tbody').append(innerHtml);
				});
				thisResultTable.find('a[data-command="details"]').click(function() {
					var id = $(this).parents('tr').attr('data-id');
          //console.log(id,'idPopOrderRecordPopOrderRecordPopOrderRecord');
					PopOrderRecord.chaseDetail(id, thisContent, function() {
            pagination.reload();
          });
          //OrderUtils.details(id, thisContent, function() {
					//	pagination.reload();
					//});
				});
				/*thisResultTable.find('a[data-command="cancel"]').click(function() {
					var id = $(this).parents('tr').attr('data-id');
					OrderUtils.cancelGeneral(id, thisContent, function() {
						pagination.reload();
					});
				});*/
				thisResultTable.find('a[data-command="cancel-chase"]').click(function() {
					var billno = $(this).parents('tr').attr('data-id');
					OrderUtils.cancelChase(billno, thisContent, function() {
						pagination.reload();
					});
				});
			},
			pageError: function(response) {
				isSearching = false;
			},
			emptyData: function() {
				isSearching = false;
				var emptyHtml = '<tr class="nodata"><td colspan="20"><em class="blanksign"></em></td></tr>';  //当前没有追号记录
				thisResultTable.find('tbody').html(emptyHtml);
			}
		});
		// 初始化
		pagination.init();
	}

	var els = function() {
		return $('.record-list');
	}

  var refreshHistory = function() {

    var nowtag = $('.record-list .tabs .active').data('key');
    els().find('.tabs > a').removeClass('active');
    if (nowtag=="HistoryOrder") {
      els().find('.tabs > a.first').addClass('active');
      els().find('.panels > .content[data-content="ChaseOrder"]').hide();
      initHistoryOrder();
    }
    if (nowtag=="ChaseOrder") {
      els().find('.tabs > a').eq(1).addClass('active');
      els().find('.panels > .content[data-content="NotOpenOrder"]').hide();
      initChaseOrder();
    }
    //initHistoryOrder();
  }

	var init = function() {
     //		return;
		var goinit = function() {
      var key = els().find('.tabs > a.active').attr('data-key');
      //console.log(key);
      if(key == 'NotOpenOrder') {
        initNotOpenOrder();
      }
      if(key == 'HistoryOrder') {
        initHistoryOrder();
      }
      if(key == 'ChaseOrder') {
        initChaseOrder();
      }
    }
    goinit()
    //console.log(els().find('.tabs > a:not(.outerlink)'),'innnnnnnnnnnnnnnnn');
    els().find('.tabs > a:not(.outerlink)').off('click').on('click',function() {
			if(!$(this).hasClass('active')) {
				els().find('.tabs > a').removeClass('active');
				$(this).addClass('active');
				els().find('.panels > .content').hide();
				goinit();
			}
		});
	}

	return {
		init: init,refreshHistory: refreshHistory
	}

}();

var DataFormat = function() {

	var formatAmount = function(amount) {
		if (amount < 1) {
			return amount.toFixed(5);
		}
		if (amount < 100) {
			return amount.toFixed(3);
		}
		return amount.toFixed(3);
	}

	var formatAccountType = function(code) {
		if (code == 1) {
			return '彩票账户';
		}
		if (code == 2) {
			return '百家乐账户';
		}
	}

	var greeting = function() {
		var hour = moment().hour();
		if(hour >= 6 && hour < 11) {
			return '早上好';
		}
		if(hour >= 11 && hour < 13) {
			return '中午好';
		}
		if(hour >= 13 && hour < 19) {
			return '下午好';
		}
		if(hour >= 19 || hour < 6) {
			return '晚上好';
		}
	}

	var formatUserType = function(type) {
		if(type == 0) {
			return '玩家';
		}
		if(type == 1) {
			return '代理';
		}
	}

	var formatUserVipLevel = function(level) {
		if(level == 0) {
			return '普通会员';
		}
		if(level == 1) {
			return '青铜 VIP';
		}
		if(level == 2) {
			return '紫晶 VIP';
		}
		if(level == 3) {
			return '白金 VIP';
		}
		if(level == 4) {
			return '黄金 VIP';
		}
		if(level == 5) {
			return '钻石 VIP';
		}
		if(level == 6) {
			return '至尊 VIP';
		}
	}

	var formatLevelUsers = function(thisUser, list) {
		$.each(list, function(i, val) {
			thisUser += ' &gt; ' + val;
		});
		return thisUser;
	}

	var formatUserOnlineStatus = function(status) {
		if(status == 0) {
			return '离线';
		}
		if(status == 1) {
			return '在线';
		}
	}

	var formatUserPlanLevel = function(level) {
		if(level == 0) {
			return '菜鸟';
		}
		if(level == 1) {
			return '学徒';
		}
		if(level == 2) {
			return '出师';
		}
		if(level == 3) {
			return '操盘';
		}
		if(level == 4) {
			return '大师';
		}
		if(level == 5) {
			return '宗师';
		}
		if(level == 6) {
			return '大神';
		}
	}

	var formatUserCardStatus = function(status) {
		if(status == 0) {
			return '正常';
		}
		if(status == -1) {
			return '资料无效';
		}
		if(status == -2) {
			return '已锁定';
		}
	}

	var formatUserRechargeType = function(type) {
		if(type == 0) {
			return '网银充值';
		}
		if(type == 1) {
			return '转账汇款';
		}
		if(type == 3) {
			return '系统充值';
		}
	}

	var formatUserRechargeStatus = function(type) {
		if(type == 0) {
			return '成功';
		}
		if(type == 6 || type == 7) {
			return '失败';
		}
		if(type != 0 && type != 6 && type != 7) {
			return '待处理';
		}
	}

	var formatUserStatus = function(type) {
		if(!type) {
			return '';
		}
		if(type == 0) {
			return '会员';
		}
		return '代理';
	}

	var formatUserWithdrawalsStatus = function(status) {
		/*if(status == 0) {
			return '待处理';
		}
		if(status == 1) {
			return '已完成';
		}
		if(status == -1) {
			return '已拒绝';
		}*/
		if(status == 0){
			return '成功';
		}
		if(status == 6 ||status == 7 ||status == 2){
			return '失败';
		}
		if(status != 0 && status != 6 && status != 7){
			return '待处理';
		}
	}

	var formatUserTransferStatus = function(type) {
		if(type == 0) {
			return '处理中';
		}
		if(type == 1) {
			return '成功';
		}
		if(type == 2) {
			return '失败';
		}
	}

	var formatUserBetsModel = function(model) {
		if(model == 'yuan') {
			return '元';
		}
		if(model == 'jiao') {
			return '角';
		}
		if(model == 'fen') {
			return '分';
		}
		if(model == 'li') {
			return '厘';
		}
	}
  //NORMAL(0, "未开奖"), NON_WIN(1, "未中奖"), AWARDED(2, "已派奖"), WAIT_AWARD(3, "等待派奖"), CANCELED(4, "个人撤单"), CANCELD_SYSTEM(
  //5, "系统撤单"), ORDER_REFUND(6, "已退款"), WIN(7, "已中奖"), UNKNOWN(8, "异常状态");
	var formatUserBetsStatus = function(status) {
		if(status == 0) {
			return '未开奖';
		}
		if(status == 1) {
			return '未中奖';
		}
		if(status == 2) {
			return '已派奖';
		}
		if(status == 3) {
			return '等待派奖';
		}
		if(status == 4) {
			return '个人撤单';
		}
		if(status == 5) {
			return '系统撤单';
		}
		if(status == 6) {
			return '已退款';
		}
		if(status == 7) {
			return '已中奖';
		}
		if(status == 8) {
			return '异常状态';
		}
    return '异常状态';
	}

	var formatUserChaseStatus = function(status) {
		if (status == 0) {
			return '未开始';
		}
		if (status == 1) {
			return '进行中';
		}
		if (status == 2) {
			return '已完成';
		}
		if (status == -1) {
			return '已撤单';
		}
	}

	var formatUserBillType = function(code) {
		if (code == 1000) {
            return '存款';
        }
        if (code == 1001) {
            return '取款';
        }
        if (code == 1002) {
            return '取款退回';
        }
        if (code == 1100) {
            return '转入';
        }
        if (code == 1101) {
            return '转出'
        }
        if (code == 1102) {
            return '上下级转账';
        }
        if (code == 1200) {
            return '优惠活动';
        }
        if (code == 1300) {
            return '消费';
        }
        if (code == 1301) {
            return '派奖';
        }
        if (code == 1302) {
            return '消费返点';
        }
        if (code == 1303) {
            return '取消订单';
        }
        if (code == 1400) {
            return '代理返点';
        }
        if (code == 1500) {
            return '分红';
        }
        if (code == 1600) {
            return '管理员增';
        }
        if (code == 1601) {
            return '管理员减';
        }
        if (code == 1700) {
            return '积分兑换';
        }
        if (code == 1800) {
            return '支付佣金';
        }
        if (code == 1801) {
            return '获得佣金';
        }
        if (code == 1900) {
            return '会员返水';
        }
	}

	var formatUserMessageType = function(type) {
		if(type == 0) {
			return '建议反馈';
		}
		if(type == 1) {
			return '已收消息';
		}
		if(type == 2) {
			return '已发消息';
		}
	}

	var formatUserMessageStatus = function(status, type) {
		if(status == 0) {
			return '正常';
		}
		if(status == 1) {
			return '已读';
		}
		if(status == -1) {
			return '已删除';
		}
	}

	var formatUserSysMessageType = function(type) {
		if(type == 0) {
			return '系统通知';
		}
		if(type == 1) {
			return '到账通知';
		}
		if(type == 2) {
			return '提现通知';
		}
	}

	var formatLotteryPaymentThridType = function(type) {
		if(type == 'ips') {
			return '环讯支付';
		}
		if(type == 'baofoo') {
			return '宝付支付';
		}
		if(type == 'newpay') {
			return '新生支付';
		}
		if(type == 'ecpss') {
			return '汇潮支付';
		}
		if(type == 'yeepay') {
			return '易宝支付';
		}
		if(type == 'mobao') {
			return '摩宝支付';
		}
		if(type == 'gopay') {
			return '国付宝支付';
		}
		if(type == 'pay41') {
			return '通汇支付';
		}
	}

	return {
		formatAmount: formatAmount,
		formatAccountType: formatAccountType,
		greeting: greeting,
		// 用户类型
		formatUserType: formatUserType,
		// 用户 VIP等级
		formatUserVipLevel: formatUserVipLevel,
		// 用户层级关系
		formatLevelUsers: formatLevelUsers,
		// 用户在线状态
		formatUserOnlineStatus: formatUserOnlineStatus,
		// 计划等级
		formatUserPlanLevel: formatUserPlanLevel,
		// 用户银行卡状态
		formatUserCardStatus: formatUserCardStatus,
		// 充值类型
		formatUserRechargeType: formatUserRechargeType,
		// 取款状态
		formatUserWithdrawalsStatus: formatUserWithdrawalsStatus,
		// 账户转账状态
		formatUserTransferStatus: formatUserTransferStatus,
		// 投注模式
		formatUserBetsModel: formatUserBetsModel,
		// 订单状态
		formatUserBetsStatus: formatUserBetsStatus,
		// 账单类别
		formatUserBillType: formatUserBillType,
		// 消息类型
		formatUserMessageType: formatUserMessageType,
		// 消息状态
		formatUserMessageStatus: formatUserMessageStatus,
		// 系统消息类型
		formatUserSysMessageType: formatUserSysMessageType,
		// 第三方支付类别
		formatLotteryPaymentThridType: formatLotteryPaymentThridType,
		formatUserChaseStatus: formatUserChaseStatus,
		//充值状态
		formatUserRechargeStatus:formatUserRechargeStatus,
		formatUserStatus:formatUserStatus
	}
}();

/**
 * 路由器设置
 */
var Route = {
	//DOMAIN:"https://glzszy.com",
  //DOMAIN:"http://phone.caihong788.com",
  //DOMAIN:"http://192.168.0.101",
  DOMAIN:"",
	ROOTPATH: "/yx",
	PATH: "/yx/u/api",
	// 用户登录
	LOGIN: "/login",
	// 用户退出
	LOGOUT: "/logout",
	Account: {
		PATH: "/account",
		// 列出完整的用户信息
		LIST_FULL_INFO: "/list-full-info",
		// 检查用户名是否存在
		CHECK_USERNAME_EXIST: "/check-username-exist",
		// 修改用户昵称
		MODIFY_NICKNAME: "/modify-nickname",
		// 修改用户密码
		MODIFY_PASSWORD: "/modify-password",
		// 修改头像
		MODIFY_AVATAR: "/modify-avatar",
		// 修改用户资金密码
		MODIFY_WITHDRAW_PASSWORD: "/modify-withdraw-password",
		// 准备绑定
		PREPARE_BIND: "/prepare-bind",
		// 请求绑定
		APPLY_BIND: "/apply-bind",
		// 列出卡片
		LIST_CARD: "/list-card",
		// 准备绑定卡片
		PREPARE_BIND_CARD: "/prepare-bind-card",
		// 绑定卡片
		BIND_CARD: "/bind-card",
		// 设置默认卡片
		SET_DEFAULT_CARD: "/set-default-card",
		// 获取随机密保问题
		GET_RANDOM_SECURITY: "/get-random-security",
		// 绑定密保问题
		BIND_SECURITY: "/bind-security",
		// 搜索账单
		SEARCH_BILL: "/search-bill",
		// 获取账单详情
		GET_BILL_DETAILS: "/get-bill-details",
		// 搜索充值
		SEARCH_RECHARGE: "/search-recharge",
		// 准备提现
		PREPARE_WITHDRAW: "/prepare-withdraw",
		// 提现申请
		APPLY_WITHDRAW: "/apply-withdraw",
		// 搜索提现
		SEARCH_WITHDRAW: "/search-withdraw",
		// 同账户转账
		APPLY_SELF_TRANSFER: "/apply-self-transfer",
		// 上下级转账
		APPLY_ACCOUNT_TRANSFER: "/apply-account-transfer",
		// 彩票账户报表
		REPORT_GAME_LOTTERY: "/report-game-lottery",
		// 百家乐账户报表
		REPORT_GAME_BACCARAT: "/report-game-baccarat",
		// 获取消息列表
		LIST_MESSAGE: "/list-message",
		// 获取消息详情
		GET_MESSAGE_DETAILS: "/get-message-details",
		// 发送消息
		SEND_MESSAGE: "/send-message",
		// 读取消息
		READ_MESSAGE: "/read-message",
		// 删除消息
		DELETE_MESSAGE: "/delete-message",
		// 列出系统消息
		LIST_SYSTEM_MESSAGE: "/list-system-message",
		// 清空系统消息
		CLEAR_SYSTEM_MESSAGE: "/clear-system-message",
	},
	Agent: {
		PATH: "/agent",
		// 添加新的用户
		ADD_NEW_ACCOUNT: "/add-new-account",
		// 列出来账号配额
		LIST_CODE_QUOTA: "/list-code-quota",
		// 列出来团队账号
		LIST_TEAM_ACCOUNT: "/list-team-account",
		// 列出在线用户
		LIST_ONLINE_ACCOUNT: "/list-online-account",
		// 搜索彩票游戏订单
		SEARCH_GAME_LOTTERY_ORDER: "/search-game-lottery-order",
		// 搜索账户账单
		SEARCH_ACCOUNT_BILL: "/search-account-bill",
		// 彩票账户报表
		REPORT_GAME_LOTTERY: "/report-game-lottery",
		// 百家乐账户报表
		REPORT_GAME_BACCARAT: "/report-game-baccarat"
	},
	GameLottery: {
		PATH: "/game-lottery",
		// 彩票游戏信息
		STATIC_INFO: "/static-info",
		// 彩票游戏追号时间
		STATIC_CHASE_TIME: "/static-chase-time",
		// 彩票游戏开奖号码
		STATIC_OPEN_CODE: "/static-open-code",
		// 彩票游戏开奖时间
		STATIC_OPEN_TIME: "/static-open-time",
		// 添加订单
		ADD_ORDER: "/add-order",
		// 撤销订单
		CANCEL_ORDER: "/cancel-order",
		// 获取订单
		GET_ORDER: "/get-order",
		// 搜索订单
		SEARCH_ORDER: "/search-order",
		// 拉取开奖通知
		PULL_OPEN_NOTICE: "/pull-open-notice"
	},
	GameLotteryPankou: {
		INIT: "/xjw-lottery/init-game-lottery",
    BET: "/xjw-lottery/bet",
    CODE: "/game-lottery/static-open-code",
		// 彩票游戏信息
		STATIC_INFO: "/static-info",
		// 彩票游戏追号时间
		STATIC_CHASE_TIME: "/static-chase-time",
		// 彩票游戏开奖号码
		STATIC_OPEN_CODE: "/static-open-code",
		// 彩票游戏开奖时间
		STATIC_OPEN_TIME: "/static-open-time",
		// 添加订单
		ADD_ORDER: "/add-order",
		// 撤销订单
		CANCEL_ORDER: "/cancel-order",
		// 获取订单
		GET_ORDER: "/get-order",
		// 搜索订单
		SEARCH_ORDER: "/search-order",
		// 拉取开奖通知
		PULL_OPEN_NOTICE: "/pull-open-notice"
	},
	GameBaccarat: {
		PATH: "/game-baccarat",
	},
	Payment: {
		PATH: "/payment",
		// 列出银行
		STATIC_LIST_BANK: "/static-list-bank",
		// 列出所有可用支付方式
		REQUEST_ALL_METHOD: "/request-all-method",
		// 请求第三方支付
		REQUEST_THRID_PAY: "/request-thrid-pay",
	},
	System: {
		PATH: "/system",
		// 列出系统公告
		LIST_NOTICE: "/list-notice",
		// 获取公告详情
		GET_NOTICE_DETAILS: "/get-notice-details",
	},
	WebAjax: {
		PATH: "/game-lottery",
		// 初始化页面
		INIT_PAGE: "/init-page",
		// 循环
		LOOP: "/loop",
		// 初始化彩票页面
		INIT_GAME_LOTTERY: "/init-game-lottery",
	},
  LotteryGroups:{
    'ssc':[11,18,15,16,19,911],
    'pk10':[43,204],
    '11y':[24,21,23,22,26,28],
    '3d':[41,42],
    'k3':[33,35,36,31,32],
    'kl8':[7,8]
  },
  LotteryBonusGroups:[100000,200000,400000],
  LotteryBonusTip:function(id) {
    var ltgroups = Route.LotteryGroups;
    var limitnum = Route.LotteryBonusGroups[2];
    id = parseInt(id,10);
    $.inArray(id,Route.LotteryGroups['pk10'])>-1 ? limitnum= Route.LotteryBonusGroups[1] : true;
    $.inArray(id,Route.LotteryGroups['11y'])>-1 ? limitnum= Route.LotteryBonusGroups[1] : true;
    $.inArray(id,Route.LotteryGroups['3d'])>-1 ? limitnum= Route.LotteryBonusGroups[0] : true;
    $.inArray(id,Route.LotteryGroups['k3'])>-1 ? limitnum= Route.LotteryBonusGroups[1] : true;
    $.inArray(id,Route.LotteryGroups['kl8'])>-1 ? limitnum= Route.LotteryBonusGroups[1] : true;
    //console.log($.inArray(id,Route.LotteryGroups['pk10'])>-1,id,Route.LotteryGroups['pk10'],limitnum,'LotteryBonusTipLotteryBonusTip');
    return limitnum;
  }
};

/**
 * HTTP请求
 */
var HttpRequest = function(options) {
	var defaults = {
		type: 'post',
		data: {},
		dataType: 'json',
		async: true,
		cache: false,
		beforeSend: null,
		success: null,
		complete: null
	};
	var o = $.extend({}, defaults, options);
	$.ajax({
        type: 'post',
        url: o.url,
        data: o.data,
        dataType: 'json',
        contentType: (typeof o.contentType !='undefined' ? o.contentType : 'application/x-www-form-urlencoded'),
        async: o.async,
        timeout:10000,
        beforeSend: function() {
        	o.beforeSend && o.beforeSend();
        },
        error:function(xhr,textStatus,errorThrown) {
          //console.log(xhr,textStatus,errorThrown);
          if (typeof f7 !='undefined') {
            if (String(textStatus).indexOf('parse')==-1 && String(textStatus)!='error') {
              //f7.alert('提交失败['+textStatus+']', '提示：');
            }
            if (String(textStatus).indexOf('timeout')>-1) {
              //f7.alert('接口超时，请重试', '提示：');
            }
            //f7.alert('提交失败['+textStatus+']', '提示：');
          }
          if (typeof App !='undefined' && typeof App.unblockUI !='undefined') {
            App.unblockUI($('.mainlottery'));
          }
          if (typeof mui !='undefined' && String(textStatus).indexOf('timeout')==-1) {
            mui.back();
            mui.openWindow({
              id:'HBuilder',
              url:'index.html'
            });
          }
        },
        success: function(response) {
        	o.success && o.success(response);
        },
        complete: function() {
        	o.complete && o.complete();
        }
    });
};

var MainCtrl = function() {

	/**
	 * 登录方法
	 */
	var login = function(options) {
		//options.url = Route.PATH + Route.LOGIN;
		options.url = Route.DOMAIN + "/sso/login";
		HttpRequest(options);
	};

	/**
	 * 退出方法
	 */
	var logout = function(options) {
		options.url = "/sso/logout";
		HttpRequest(options);
	};

	return {
		login: login,
		logout: logout
	}

}();

var AccountCtrl = function() {

	var thisScope = 'Account';

	var getScopeUrl = function(key) {
		return Route.DOMAIN + Route.PATH + Route[thisScope].PATH + Route[thisScope][key];
	}

	/**
	 * 修改密码方法
	 */
	var modifyPassword = function(options) {
		options.url = getScopeUrl('MODIFY_PASSWORD');
		HttpRequest(options);
	}

	return {
		modifyPassword: modifyPassword
	}

}();

var GameLotteryCtrl = function() {

	var thisScope = 'GameLottery';

	var getScopeUrl = function(key) {
		return Route.DOMAIN + Route.PATH + Route[thisScope].PATH + Route[thisScope][key];
	}

	/**
	 * 获取彩票游戏开奖号码
	 */
	var staticOpenCode = function(options) {
		options.url = getScopeUrl('STATIC_OPEN_CODE');
		HttpRequest(options);
	}

	/**
	 * 获取彩票游戏开奖时间
	 */
	var staticOpenTime = function(options) {
		options.url = getScopeUrl('STATIC_OPEN_TIME');
		HttpRequest(options);
	}

	/**
	 * 投注方法
	 */
	var addOrder = function(options) {
		options.url = getScopeUrl('ADD_ORDER');
		HttpRequest(options);
	}

	var pullOpenNotice = function(options) {
		options.url = getScopeUrl('PULL_OPEN_NOTICE');
		HttpRequest(options);
	}

	return {
		staticOpenCode: staticOpenCode,
		staticOpenTime: staticOpenTime,
		addOrder: addOrder,
		pullOpenNotice: pullOpenNotice
	}

}();

var PaymentCtrl = function() {

	var thisScope = 'Payment';

	var getScopeUrl = function(key) {
		return Route.DOMAIN + Route.PATH + Route[thisScope].PATH + Route[thisScope][key];
	}

	var requestAllMethod = function(options) {
		options.url = getScopeUrl('REQUEST_ALL_METHOD');
    //console.log(options);

		HttpRequest(options);
	}

	var requestThridPay = function(options) {
		options.url = getScopeUrl('REQUEST_THRID_PAY');
		HttpRequest(options);
	}

	return {
		requestAllMethod: requestAllMethod,
		requestThridPay: requestThridPay
	}

}();

/**
 * 数据工厂
 */
var AppData = function() {

	var isLogin = false; // 是否登录
	var mainAccount; // 主账户
	var lotteryAccount; // 彩票账户
	var baccaratAccount; // 百家乐账户
	var info; // 信息
	var msgCount;

	var init = function(options) {
		if (options === undefined) {
			options = {};
		}
    var callbackinit;
    if (arguments.length > 1) {
      callbackinit = arguments[1];
    }
		options.url = Route.DOMAIN + Route.ROOTPATH + Route.WebAjax.PATH + Route.WebAjax.INIT_PAGE;
		options.async = false;
		options.success = function(response) {
			AppDataInitData = response;
      if (response.error == 0) {
				var data = response.data;
				isLogin = data.isLogin;
				if (isLogin) {
					mainAccount = data.main;
					lotteryAccount = data.lottery;
					info = data.info;
					msgCount = data.msgCount;
				}
        //console.log(mainAccount.type=='0');
        if (typeof mainAccount !='undefined') {
          if (mainAccount.type=='0') {
            $('#agent-top-nav').hide()
          }else {
            $('#agent-top-nav').show()
          }
        }

        if (typeof callbackinit !='undefined') {
          callbackinit(data);
        }

        setTimeout(function() {
          if (typeof lotteryAccount !='undefined') {
            if (parseInt(lotteryAccount.code,10)<1701) {
              $('a[data-dk-dropdown-value="91"]').parent().remove();
              $('#bonuspage').remove();
            }else {
              $('#bonuspage').show();
            }
          }
        },1000);
			}
		};
		HttpRequest(options);
	};

	return {
		init: init,
		isLogin: function() {
			return isLogin;
		},
		getMainAccount: function() {
			return mainAccount;
		},
		getLotteryAccount: function() {
			return lotteryAccount;
		},
		getBaccaratAccount: function() {
			return baccaratAccount;
		},
		getInfo: function() {
			return info;
		},
		getMsgCount: function() {
			return msgCount;
		}
	}

}();

/**
 * 循环请求
 */
var AppLoop = function() {

	var loop = [];
	var callback = [];

	var init = function() {
		function timeout(){
			var options = {

			}
			options.data = {
				//loop: $.toJSON(loop)
        loop: JSON.stringify(loop)
			}
			options.url = Route.DOMAIN + Route.PATH +  Route.WebAjax.LOOP;
			options.success = function(response) {
				if (response.error == 0) {
					$('[data-field="lotteryBalance"]').html(response.data.lotteryBalance);
					$('[data-field="baccaratBalance"]').html(response.data.baccaratBalance);
          $('#will-sum01').html(response.data.lotteryBalance);
					$('[data-field="msgCount"]').html(response.data.msgCount);
					for (var i = 0; i < callback.length; i++) {
						if ($.isFunction(callback[i])) {
							callback[i](response.data);
						}
					}
				}
			};
			HttpRequest(options);
			setTimeout(timeout,30000)
		}
		timeout();
	}

	var push = function(data, cb) {
		loop.push(data);
		callback.push(cb);
	}

	return {
		init: init,
		push: push
	}

}();

//轮播插件，不过只有fade的效果
(function($) {
	$.fn.BannerLoop = function(options) {
		var defaults = {
			focus: true,
			delay: 3000
		}
		var opts = $.extend({}, defaults, options);
		$(this).each(function() {
			var items = $(this).find('.list > .item');
			var loop = $(this).find('.loop');
			if(items.length <= 1) return;
			var index = 0;
			var show = function() {
				$.each(items, function(i) {
					if($(this).is(':visible')) {
						$(this).stop().fadeOut(1500).removeClass('active');
					}
					if(i == index) {
						$(this).stop().fadeIn(1500);
					}
				});
				setLoop();
			}
			var setLoop = function() {
				loop.find('a').removeClass('active').eq(index).addClass('active');
			}
			var initLoop = function() {
				$.each(items, function(i) {
					if(i == 0) {
						loop.append('<a class="active"></a>');
					} else {
						loop.append('<a></a>');
					}
				});
				loop.find('a').each(function(i) {
					$(this).click(function() {
						stop();
						if(!$(this).hasClass('active')) {
							index = i;
							show();
						}
						start();
					});
				});
				loop.show();
			}
			initLoop();
			var timer = null;
			var start = function() {
				timer = setInterval(function() {
					if(index == items.length - 1) {
						index = 0;
					} else {
						index++;
					}
					show(index);
				}, opts.delay);
			}
			var stop = function() {
				if(timer) clearInterval(timer);
			}
			start();
			if(opts.focus) {
				$(this).hover(stop, start);
			}
		});
	}
})(jQuery);

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};
var QueryString = function () {
  // This function is anonymous, is executed immediately and
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return query_string;
}();

// 盘口初始化
var PankouData = function() {
  var postparams = {"lotteryId":"CQSSCXJW","betParameters":[]};
  var chkpost = {};
  //{"id":822,"gname":"斗牛","BetContext":"牛5","Lines":"15.629","BetType":1,"Money":"5.00","IsTeMa":false,"IsForNumber":false,"mingxi_1":0}
  //初始化
  var init = function(id,callb) {
    var opt = {}

    opt.data = JSON.stringify({"lotteryId":"CQSSCXJW","numberPostion":""});
    opt.contentType = 'application/json; charset=utf-8'; // 很重要
    opt.url = Route.DOMAIN + Route.PATH + Route.GameLotteryPankou.INIT;
		opt.async = false;
		opt.success = function(response) {
      if (response.error == 0) {
				var data = response.data;
				//console.log(data);
			}
      if (typeof callb !='undefined') {
        callb(response)
      }
		};
		HttpRequest(opt);
    //console.log(id,callb,Route.GameLotteryPankou.INIT);
  }

  //倒计时结束
  var reinit = function(id,callb) {
    var opt = {}

    opt.data = JSON.stringify({"lotteryId":"CQSSCXJW","numberPostion":""});
    opt.contentType = 'application/json; charset=utf-8'; // 很重要
    opt.url = Route.DOMAIN + Route.PATH + Route.GameLotteryPankou.INIT;
		opt.async = false;
		opt.success = function(response) {
      if (response.error == 0) {
				var data = response.data;
				//console.log(data);
			}
      if (typeof callb !='undefined') {
        callb(response)

      }
      console.log(response.Obj.CloseCount,'CloseCountCloseCountCloseCount');
      $('#pankou-timer').data('left',response.Obj.CloseCount);
		};
		HttpRequest(opt);
    //console.log(id,callb,Route.GameLotteryPankou.INIT);
  }

  //问路TAB事件
  var tabletab = function() {
    console.log('tabletabtabletabtabletab');
    $('#wenlu .tab-bd').first().addClass('tab-bd-in');
    $('#luzhu .tab-bd').first().addClass('tab-bd-in');
    $('#wenlu .tab-item').off('click').on('click',function() {
      var nowindex = $(this).index();
      //console.log(nowindex);
      $('#wenlu .tab-bd-in').removeClass('tab-bd-in');
      $('#wenlu .tab-bd').eq(nowindex).addClass('tab-bd-in');
    });
    $('.pankou-opearation .play-groups > ul li').off('click').on('click',function() {
      var thisrel = $(this).attr('rel');
      $('.pankou-opearation .play-groups > ul .selected').removeClass('selected');
      $(this).find('a').addClass('selected');
      $('#j-all .now').removeClass('now').hide();
      $('#j-all > [rel="'+thisrel+'"]').addClass('now').show();
    });
    $('#luzhu .tab-item').off('click').on('click',function() {
      var nowindex = $(this).index();
      //console.log(nowindex);
      $('#luzhu .tab-bd-in').removeClass('tab-bd-in');
      $('#luzhu .tab-bd').eq(nowindex).addClass('tab-bd-in');
    });
    $('.record-list .panels .content').first().removeClass('hide');
    $('.pankou-opearation .tac .parlay').off('click').on('click',function() {
      //console.log(chkpost);
      var formatParams = {"lotteryId":"CQSSCXJW","betParameters":[]};
      var letsee = [];
      for (key in chkpost) {
        formatParams["betParameters"].push(chkpost[key]);
        //console.log(chkpost[key]);
        var nowitm = chkpost[key];
        letsee.push('<li><div class="cftip totalm">'+nowitm.gname+'【'+nowitm.BetContext+'】@'+nowitm.Lines+' X '+nowitm.Money+'</div></li>');
      }

      BootstrapDialog.show({
        cssClass:'quick-bet',
        title: '<i class="icon lock"></i>下注清单',
        message:function(){
            return [
              //"<div class='cftip lname'>彩种："+GameData.getInfo().showName+"</div>",
              "<div class='cftip lname'>你确认加入第"+$('.lottery-open-info [data-field="global-expect"]').text()+"期？</div>",
              "<div class='cftip totalm'>共计：￥4/1注，您确定要下注吗？</div><ul>",
              letsee.join(''),
              //"<li><div class='cftip totalm'>第三球【单】@1.960 X 2.00</div></li>",
              "</ul>"
            ].join('');
          }(),
        buttons: [{
          label: '确定投注',
          action: function(dialog) {
            PankouData.firehole(formatParams);
            dialog.close();
          }
        }, {
          label: '取消',
          action: function(dialog) {
            dialog.close();
          }
        }]
      });
    });
    //快捷切换
    $('.pankou-opearation .button-secondary-group button').off('click').on('click',function() {
      var thismode = $(this).data('mode');
      console.log(thismode);
      $('.pankou-opearation .button-secondary-group .button-current').removeClass('button-current');
      $(this).addClass('button-current');
      if (thismode=='quick') {
        $('#j-all .j-betting td.j-odds').hide();
      }else {
        $('#j-all .j-betting td.j-odds').show();
      }
    });
    //快捷的赔率事件
    $('.pankou-opearation #j-all .j-betting .odds-text').off('click').on('click',function() {

    });
  }
  //盘口事件
  var pankouevent = function() {
    $('.j-betting .j-odds input').on('focus',function() {
      console.log($(this).val());
    });
    $('.j-betting .j-odds input').on('blur',function() {
      console.log($(this).val());
      var nowtd = $(this).parent().parent();
      var tdid = nowtd.data('id');
      var tdm = $(this).val();
      var tdhead = nowtd.parent().prev().find('th').text();
      var lnhead = nowtd.find('td').first().text();
      var lnrate = nowtd.find('td').first().next().text();
      //console.log(tdid,tdhead,lnhead,lnrate,tdm);
      var nowDeal = {"id":tdid,"gname":tdhead,"BetContext":lnhead,"Lines":lnrate,"BetType":1,"Money":Number(tdm).toFixed(2),"IsTeMa":false,"IsForNumber":false,"mingxi_1":0};
      //console.log(postparams,nowDeal);
      if (typeof chkpost[tdid] =='undefined') {
        chkpost[tdid]=nowDeal;
        //postparams["betParameters"].push();
      }else {
        chkpost[tdid]=nowDeal;
      }
      if (tdm=='') {
        delete chkpost[tdid];
      }
      console.log(chkpost);
    });
  }
  //获取开奖号码
  var getcode = function(code,callb) {
    var opt = {}

    opt.data = {"name":code};
    //opt.contentType = 'application/json; charset=utf-8';
    opt.url = Route.DOMAIN + Route.PATH + Route.GameLotteryPankou.CODE;
		opt.async = false;
		opt.success = function(response) {
      if (response.error == 0) {
				var data = response.data;
				//console.log(data);
			}
      if (typeof callb !='undefined') {
        callb(response)
      }
		};
		HttpRequest(opt);
  }

  //提交盘口
  var firehole = function(data) {
    var opt = {}
    opt.data = JSON.stringify(data);
    console.log(data,'fireholefireholefirehole');
    //opt.data = JSON.stringify({"lotteryId":"CQSSCXJW","betParameters":[{"id":749,"gname":"第二球","BetContext":"大","Lines":"1.994","BetType":1,"Money":"5.00","IsTeMa":false,"IsForNumber":false,"mingxi_1":0}]});
    opt.contentType = 'application/json; charset=utf-8'; // 很重要
    opt.url = Route.DOMAIN + Route.PATH + Route.GameLotteryPankou.BET;
		opt.async = false;
		opt.success = function(response) {
      if (response.result=='5') {
        App.alert('success', '提示消息', response.msg, 3000);
      }
      if (response.result=='1') {
        App.alert('success', '提示消息', '您的订单已投注成功！', 3000);
        if(RecordList) RecordList.refreshHistory();
        $('#manualre').click();
        chkpost = {};
        $('.j-betting .j-odds input').val('');
      }
      if (response.error == 0) {
				var data = response.data;
				console.log(data);
			}
      if (typeof callb !='undefined') {
        callb(data)
      }
		};
		HttpRequest(opt);
    //console.log(id,callb,Route.GameLotteryPankou.INIT);
  }

  //问路和路珠
  var rendertrend = function(data,data2,lz,t,back) {
    //console.log(data,'rendertrend');
    var o = _.pluck(data.slice(0, 5), "n");
    var l = _.range(10);
    console.log(lz,'lzlzlzlzlzlzlz');
    var od = _.map(data2.hit, function(e) {
      return {
        item: e,
        number: l
      }
    });
    var lzo =_.where(lz, {
      p: 1
    });
    var lzo_sec =_.where(lz, {
      p: 0
    });
    var alllzo = _.flatten([lzo, lzo_sec]);
    console.log(alllzo,'alllzoalllzoalllzoalllzo');
    var clsmap = function(a) {
      if (a=='大') {
        return 'da'
      }
      if (a=='单') {
        return 'dan'
      }
      if (a=='龙') {
        return 'long'
      }
      return '';
    }
    var allu = _.map(alllzo, function(e) {
      var t = _.map(e.c.split(","), function(e) {
          var t = e.split(":"),
            n = t[0],
            r = t[1],
            i = r > 1 ? _.times(r, function() {
              return n
            }) : [n];
          //console.log(i);
          return {
            item: i,
            cls: (i.length==0 ? '' : clsmap(i[0]))
          }
        }),
        n = 30 - t.length;
      return n > 0 && _.times(n, function() {
        t.push({
          item: []
        })
      }), {
        hd: e.n,
        bd: {
          items: t.reverse()
        }
      }
    });
    //
    var endu = {
      hd: _.pluck(allu, "hd"),
      bd: _.pluck(allu, "bd")
    };
    console.log(endu,'enduenduenduenduenduendu');
    t.wenlu.hd=o;t.wenlu.bd=od;
    t.luzhu = endu;
    //console.log(t.wenlu,'t.wenlut.wenlut.wenlut.wenlut.wenlu');
    if (typeof back =='function') {
      back(t);
    }
    //var rendered = Mustache.render(t.wenlutpl, t.wenlu);
    //t.wenluhtml= rendered;
  }

  return {
		init: init,reinit:reinit,tabletab: tabletab,firehole: firehole,getcode: getcode,pankouevent: pankouevent,rendertrend :rendertrend
  }
}();


/**
 * 用户系统消息
 */
var UserSysMessage = function() {

	var idArray = [];
	var els = function() {
		return $('.sys-message-list');
	}

	// 更新方法
	var update = function(ids) {
		Will.ajax({ids: ids}, Route.DOMAIN + Route.PATH +'/account/clear-system-message', function(data){
 		});
	}

	// 播放声音
	var audio = function() {
		if($('.set-voice').find('.msg').hasClass('audio-on')) {
			$('audio#sys-message').remove();
			var audio = $('<audio id="sys-message" autoplay="autoplay">');
			audio.attr('src', '/audio/message.mp3').hide();
			$('body').append(audio);
		}
	}

	// 显示效果
	var show = function() {
		if(els().is(':hidden')) {
			var height = els().height();
			els().show().css({bottom: -height}).stop().animate({bottom: 0}, 1000, 'easeOutExpo');
		}
	}

	// 隐藏效果
	var hide = function() {
		els().hide();
	}

	// 有新的消息
	var lastTime = '';

  var cleanHtml = function(str) {
    return $("<span />", { html: str }).text()
    //return str.replace('&lt;/div&gt;&lt;div&gt;','')
  }
	var add = function(data) {
		var count = 0;
		if(data&&data.length > 0) {
			$.each(data, function(i, val) {
				if(lastTime && lastTime >= val.time) {
					return;
				}
				var item =
				'<div class="item"><a href="/yx/hbs/manager-message.html#page=0" target="_blank">\
					<div class="title">\
						<span class="type">' + DataFormat.formatUserSysMessageType(val.type) + '</span>\
						<span class="time">' + moment(val.time).format('HH:mm:ss') + '</span>\
					</a></div>\
					<div class="text">' + cleanHtml(val.content) + '</div>\
				</div>';
				els().find('.list').prepend(item);
				idArray.push(val.id);
				count++;
			});
			if(count>0){
				show();
				audio();
			}
			lastTime = data[data.length-1].time;
		}
	}

	// 初始化
	var init = function() {
		if(!AppData.isLogin()) return;
		var mList = $('<div class="sys-message-list">');
		mList.append('<div class="title">通知列表<a class="clear">清空</a></div>');
		mList.append('<div class="wrapper"><div class="scroller" data-handle-color="#aaa" data-handle-distance="2px"><div class="list"></div></div></div>');
		mList.find('.clear').click(function() {
			update(idArray.toString());
			idArray = [];
			els().find('.list').empty();
			hide();
		});
    if (!isMobile.any()) {
      $('body').append(mList);
    }
		App.initScroll('.scroller');
		start();
    var allname = [],realt=[];
    var taglink,tagname='#allopenlt';
    if ($('#allopenlt').size()>0) {
      taglink = $('#allopenlt a');
    }
    if ($('.gameport').size()>0) {
      taglink = $('ul.gameport a');
      tagname = 'ul.gameport';
    }
    if (typeof taglink !='undefined') {
      taglink.map(function(k,el) {
        if (typeof $(el).data('name') !='undefined') {
          allname.push($(el).text());
        }
      });
      var coder= {}
      $.ajax({
        type: 'post',
        url: Route.DOMAIN + Route.PATH +'/game-lottery/openLotterys',
        timeout: 10000,
        dataType: 'json',
        success: function(res) {
          var allok = [],allokid=[];
          for (i = 0; i < res.data.length; i++) {
            realt.push(String(res.data[i].code).toLowerCase())
            coder[res.data[i].showName] = String(res.data[i].code).toLowerCase();
            allok.push(String(res.data[i].code).toUpperCase());
            allokid.push(res.data[i].id);
          }
          for (j = 0; j < allname.length; j++) {
            if (typeof coder[allname[j]] =='undefined') {
              $(tagname+' a[data-name="'+allname[j]+'"]').remove();
            }
          }
          //console.log(LotteryMain,'LotteryMain');
          if (typeof LotteryMain !='undefined' && $.inArray(String(LotteryMain.getConfig().lottery).toUpperCase(), allok) == -1) {
            App.alert('info','提示消息','该彩种停售  <a href="/yx/home">返回首页</a>',0,'关闭<i class="icon close"></i>',function() {
              location.href='/yx/home';
            },function() {
              location.href='/yx/home';
            });
          }
          //剔除导航停售彩种
          $('.lottery_menu ol li').each(function(i,el) {
            var allhref = $(el).find('a').attr('href');
            var re = /(\d+)/g;
            var found = allhref.match(re);
            if (found.length>0) {
              if ($.inArray(parseInt(found[0],10), allokid) == -1) {
                $(el).remove()
              }
            }
          });
          //剔除首页下面停售彩种
          $('.gameport ol li').each(function(i,el) {
            var allhref = $(el).find('a').attr('href');
            var re = /(\d+)/g;
            var found = allhref.match(re);
            if (found.length>0) {
              if ($.inArray(parseInt(found[0],10), allokid) == -1) {
                $(el).remove()
              }
            }
          });
        }
      });
    }
	}

    var start = function(){
      Will.ajax({}, Route.DOMAIN + Route.PATH +'/account/list-system-message',function(data){
        add(data);
        //console.log(data,'sys');
      });

      setTimeout(start,60000);
    }

	return {
		init: init,
		add: add
	}

}();

var load = function(name){
	$.ajaxSetup({async: false});
	//$(".bar").load("/bar.html")
	if(arguments.length==1) $('.'+name).load('/include-'+name+'.html');
	if(arguments.length==2) arguments[0].load(arguments[1]);
	$.ajaxSetup({async: true});
}

//各种通用的函数
var Will = function(){
	var callbacks = [];

	return {
		ajax : ajax , initBox : initBox , getBox : getBox ,page:page,getPage:getPage , tabs : tabs ,changeTab:changeTab ,changeTabs:changeTabs,addHashChange:addHashChange
	}

	function addHashChange(callback){
		callbacks.push(callback);
	}
	function changeTabs(initPages,callback){
		if(callback) {addHashChange(callback);}
		var manager = $(".manager .nav > a");
		var content = $('[data-init="content"]');
		manager.each(function(idx,ele){
      if (!$(ele).hasClass('fixed') && !$(ele).hasClass('disabled')) {
        $(ele).attr('href','#page='+idx);
      }
		});
    var hindex = App.getHash('page');
    hindex = hindex.split('_')[0];
    //console.log(hindex,'hindexhindex');
    //console.log(callback,callback==null,hindex);
    if ($(".manager .nav > a:eq("+hindex+")").hasClass('disabled')) {
      //console.log($(".manager .nav > a:not(.disabled)").first().attr('href'));
      window.location.hash = $(".manager .nav > a:not(.disabled)").first().attr('href');
    }
		var change = function() {
 			var index = App.getHash('page');
      index = index.split('_')[0];
      //index = parseInt(index.split('_')[0],10);
			if(index && typeof initPages[index] =='function') {
				var page = $(".manager .nav > a").eq(index);
				if($(".manager .nav > a").length == index) {
					var page = $(".manager .nav > a").eq(9);
				}
				if( index == '9' || (index ==  '10' && $(".manager .nav > a").length == 9)) {
					var page = $(".manager .nav > a").eq(8);
				}
				if( index == '9') {
					var page = $(".manager .nav > a").eq(8);
				}
				console.log($(".manager .nav > a").length,index);
 				initPages[index]();

				page.addClass('active').siblings().removeClass('active');
				if (typeof content.eq(index).attr('manually-hide') == 'undefined') {
          content.eq(index).show();
        }
        console.log($(".manager .nav > a").length,index);
				content.eq(index).siblings('[data-init="content"]').hide();

        if(callbacks.length>0){
					for(idx in callbacks){
						var callback = callbacks[idx];

						if($.isFunction(callback)) callback();
					}
				}
			}
 		};
 		change();
 		window.onhashchange = change;
	}

	//带参数的URL查询,refresh,page必填 deprecated
	function changeTab(callback){
 		var change = function() {
			if(window.location.hash=='' || !App.getHash('refresh')) return;
			var index = App.getHash('page');
			if(index) {
				$(".manager .nav > a").eq(index).click() ;
      // 			}else{
				if($.isFunction(callback)) callback();
			}
		};
    // 		change();
		window.onhashchange = change;
	}
	//manager五个页面的tab切换 deprecated
	function tabs(initPages) {
		 var manager = $(".manager .nav > a");
		 var content = $('[data-init="content"]');
		 var index = App.getHash('page');
		 manager.each(function(idx,ele){
		 	if(idx==2) $(ele).attr('href','#page='+idx+'&refresh=1');
		 	else $(ele).attr('href','#page='+idx);
		 });
		 manager.click(function(){
			 $(this).addClass('active').siblings().removeClass('active');
			 var i = $(this).index();
			 content.eq(i).show();
			 content.eq(index).siblings('[data-init="content"]').hide();
        // 			 if(!$(this).data('initialized')) {
      // 			 	initPages[i]=initPages[i]();
				initPages[i]();
      // 				$(this).data('initialized',true);
      // 			 }
		 }).eq((index?index:0)).click();
	};

	//分页插件的封装
	function page(thisContent,data,url,emptyInfo,successCallback){
		var thisContent = thisContent;
    // 		var params = thisContent.find('.params');
		var thisResultTable = thisContent.find('.result > table');
		if (thisContent.find('.result').size()>1) {
      thisResultTable = thisContent.find('.result:eq(1) > table');
    }
		var searching = url + '/searching';
    // 		!thisContent.data(searching)
 		var pagination = $.pagination({
			render: thisContent.find('.page-list'),
			pageSize: 10,
			ajaxType: (typeof data.posttype !='undefined'? data.posttype : 'post'),
			ajaxUrl: url,
			ajaxData: data,
			beforeSend: function() {
				thisContent.data(searching,true);
				App.blockUI({
					target: thisContent,
					boxed: true
				});
			},
			complete: function() {
				thisContent.data(searching,false);
				App.unblockUI(thisContent);
			},
			success: function(list) {
				successCallback(list);
			},
			pageError: function(response) {
				thisContent.data(searching,false);
			},
			emptyData: function(data) {
				console.log(data, searching)
				thisContent.data(searching,false);
				var emptyHtml = '<tr class="nodata"><td colspan="20">'+emptyInfo+'</td></tr>';
				thisResultTable.find('tbody').html(emptyHtml);
			}
		});
		thisContent.data('pagination',pagination);
	}

	function getPage(thisContent){
		return thisContent.data('pagination');
	}
	//ajax的封装
	function ajax( data , url , successCallback ,errorCallback, isAsync) {
		var asyncc = isAsync===0?false:true
		var thisContent = $('[data-init="content"]');
		var datadom = $('body');
		var loading = url + '/loading';
		if(!datadom.data(loading)) {
			datadom.data(loading,true);
			App.blockUI({
				target: thisContent,
				boxed: true
			});
			$.ajax({
				type: 'post',
				url: url,
				data: data,
				timeout: 25000,
				dataType: 'json',
				async:asyncc,
				success: function(response) {
					datadom.data(loading,false);
					App.unblockUI(thisContent);
					if((typeof(response.error) == "undefined")){ //没有error,code,message的返回情况
						if($.isFunction(successCallback)) successCallback(response);
						return;
					}
					if(response.error != 0) {
						if(response.code == '0-1' || response.code == '0-4') {
							if(window.location.pathname=="/index.html") return;
							App.alert('warning', '提示消息', response.message,5000);
							setTimeout(function(){
								var domain = window.location.protocol + '//' + window.location.host;
								window.location.href = domain + '/index.html';
							},3000);
							return;
						}else{
              if (String(url).indexOf('zj-bonus')>-1) {
							  App.alert('warning', '提示消息', (response.message =='服务异常' ? '分红未配置' : response.message),5000);
              }else {
                App.alert('warning', '提示消息', (response.message !='' ? response.message : '失败，原因未知'),5000);
              }
              if (String(window.location.pathname).indexOf('manager-finance')>-1) {
                setTimeout(function(){
                  window.location.reload();
                },3000);
              }
						}
						if($.isFunction(errorCallback)) errorCallback(response.data,response);
					}
					if(response.error == 0) {
						if($.isFunction(successCallback)) successCallback(response.data,response);
					}
				},
				error: function() {
          //App.alert('warning', '提示消息', '连接失败，请稍候重试！');
					datadom.data(loading,false);
					App.unblockUI(thisContent);
				}
			});
		}
	}
	//详情弹出框的封装
	function initBox(title , content , width , height , onInitCallback , clz) {
		var box = $('body').data('box');
		if(box == undefined) {
			box = new jBox('Modal', {
				width: width,
				height: height,
				title: title,
				overlay: true,
				closeOnClick: false,
				blockScroll: false,
				animation: {open: 'zoomIn'},
				closeButton: 'title',
				draggable: 'title',
				content: content,
				addClass: (clz?clz:'common-modal grey'),
				onInit: function() {
					this.open();
	    // 				initEvent(thisContent, callback);
					if($.isFunction(onInitCallback)) onInitCallback(this);
					App.initScroll();
				},
				onCloseComplete: function() {
					this.destroy();
					$('body').removeData('box');
				}
			});
			$('body').data('box',box);
		} else {
			box.toggle();
		}
		return box;
	}

	function getBox(){
		return $('body').data('box')
	}
}()


/**
 * 加载彩票列表
 */
var loadLottery = function(callback) {
	Will.ajax({}, Route.DOMAIN + Route.PATH + '/game-lottery/static-info', function(data,response){
		if($.isFunction(callback)) {
			callback(data);
		}
	});
}
/**
 * 加载第三方游戏列表
 */
var loadThirdGame = function (key, callback) {
    Will.ajax({gameType : key}, Route.PATH + '/report/get-game-type', function (data, response) {
        if ($.isFunction(callback)) {
            callback(data);
        }
    });
}
/**
 * 初始化日期控件
 */
var initDatePicker = function() {
	if($('.d-range-picker').size()==0 && $('.date-picker').size()==0) return;
	var opts = {
		format: 'YYYY-MM-DD',
		separator: ' 至 ',
		ranges: {
			'今天': [moment(), moment().add(1, 'days')],
			'最近三天': [moment().subtract(2, 'days'), moment().add(1, 'days')],
			'最近七天': [moment().subtract(6, 'days'), moment().add(1, 'days')]
		},
		locale: {
			applyLabel: '确认',
			cancelLabel: '清除',
			fromLabel: '开始',
			toLabel: '结束',
			customRangeLabel: '自定义日期',
			daysOfWeek: ['日', '一', '二', '三', '四', '五','六'],
			monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			firstDay: 1
		}
	}
	$('.d-range-picker').each(function() {
		var opens = $(this).attr('data-time-opens');
		opts.opens = opens ? opens : 'left';
		var init = $(this).attr('data-time-init');
		if(init) {
			if(init > 0) {
				$(this).val(moment().format('YYYY-MM-DD') + ' 至 ' + moment().add(init, 'days').format('YYYY-MM-DD'));
			} else {
				$(this).val(moment().add(init, 'days').format('YYYY-MM-DD') + ' 至 ' + moment().add(1, 'days').format('YYYY-MM-DD'));
			}
		}
		$(this).daterangepicker(opts);
	});

	if(jQuery().datepicker) {
		$('.date-picker').datepicker({
			orientation : 'left',
			autoclose : true,
			format : 'yyyy-mm-dd',
			language : 'zh-CN'
		});
	}
}

/**
 * 初始化选项卡
 */
var initTabs = function() {
	$('.tabs').each(function() {
		var tabs = $(this).find('a');
		var panels = $(this).parent().find('.panels > .section');
		tabs.each(function(i) {
			$(this).click(function() {
				if(!$(this).hasClass('active')) {
					tabs.removeClass('active');
					$(this).addClass('active');
					panels.removeClass('active');
					panels.eq(i).addClass('active');
				}
			});
		})
	});
}

//加减乘除计算
var compt = function(){
    function add(a, b) {
        var c, d, e;
        try {
            c = a.toString().split(".")[1].length;
        } catch (f) {
            c = 0;
        }
        try {
            d = b.toString().split(".")[1].length;
        } catch (f) {
            d = 0;
        }
        return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
    }

    function sub(a, b) {
        var c, d, e;
        try {
            c = a.toString().split(".")[1].length;
        } catch (f) {
            c = 0;
        }
        try {
            d = b.toString().split(".")[1].length;
        } catch (f) {
            d = 0;
        }
        return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
    }

    function mul(a, b) {
        var c = 0,
            d = a.toString(),
            e = b.toString();
        try {
            c += d.split(".")[1].length;
        } catch (f) {}
        try {
            c += e.split(".")[1].length;
        } catch (f) {}
        return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
    }

    function div(a, b) {
        var c, d, e = 0,
            f = 0;
        try {
            e = a.toString().split(".")[1].length;
        } catch (g) {}
        try {
            f = b.toString().split(".")[1].length;
        } catch (g) {}
        return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
    }
    return {
        add:add,sub:sub,mul:mul,div:div
    }
}();

var disableRightClick= function(){
	$(this).contextmenu(function() {
		return false;
	});
	$(this).mousedown(function(e) {
		if (e.button == 2) return false;
	});
}

var showOrNotShow = function(){
	if (!AppData.isLogin()) {
		$('#login-form').show();
		$('#will-user-info').hide();
		return false;
	} else {
		$('#login-form').hide();
		$('#will-user-info').show();
		// 隐藏或显示代理账户
		if (AppData.getMainAccount().type == 0) {
			$('[data-visible="proxy"]').hide();
      $('#agtmenulink').remove();
		} else {
			$('[data-visible="proxy"]').show();
		}
	}
}

var kefu = function(){
	//在线客服弹出框
	$('a[data-command="kefu"]').each(function() {
		var url = 'https://messenger.providesupport.com/messenger/1nzu248s6uvbl0vs7xpqne8l5p.html';
		if(AppData.isLogin()){
			var username = AppData.getMainAccount().username;
			if(username) {
				url += '?username=' + username;
			}
		}
 		$(this).attr('href', url);
		$(this).attr('target', '_blank');
	});
}
var Api = Api || {};
Api = {
    url: '/yx',
    apimap: {
        route: {
            'getNoticeTitle': '/u/api/notice/list', //首页公告
            'getptList': '/pay/getPcodeCbBaseList', //平台列表
            'getPtBalance': '/pay/getPlayerBalance', //各平台余额
            'getBindCardInfo': '/u/api/account/bind-card', //绑定银行卡
            'getDrawCashInfo': '/mkg/api/users/queryWithDrawInfo', //取款-银行卡信息
            'getLowerUserList': '/pay/getAgentUserList', //下级用户列表
            'saveQuota': '/mkg/api/agent/update_quotas', //配额管理
            'getPtGamesData': "/u/api/pt/games", //pt游戏列表
            'getPtGamesMenu': "/u/api/pt/types", //pt游戏导航
            'getUserInfo': "/mkg/api/pt/userinfo", //pt用户信息
            'getCities': "/pay/getcities", //获取城市列表
            'getUserBalance': "/u/api/loop", //查询余额
            'getInitPage':'/game-lottery/init-page',//彩票初始化
            'getLotteryList': '/mkg/api/query/filters', //查询模块获取彩票彩种列表
            'getGameRecord': '/u/api/game-lottery/search-order', //查询游戏记录
            'getTraceRecord': '/u/api/game-lottery/search-chase', //追号记录
            'getCountRecord': '/u/api/account/search-zbrecord', //账变记录
            'getRechargeRecord': '/u/api/account/search-recharge', //充值记录
            'getWithdrawRecord': '/u/api/account/search-withdraw', //取款记录
            'getDayreportRecord': '/u/api/report/report-game-lottery', //个人报表
            'getTeamRecord': '/u/api/report/report-team-lottery', //团队报表
            'getUserList': '/u/api/agent/list-team-account', //用户列表
            'cancelOrder': '/mkg/api/order/cancel', //撤单
            'cancelTrace': '/mkg/api/order/trace_cancel', //追号撤单
            'getUserLinks': '/mkg/api/agent/links', //链接管理
            'deleteUserLinks': '/mkg/api/agent/link_delete', //删除链接
            'getMsgCount': '/u/api/message/queryUnRMCount', //获取消息数
            'getQueryMessage': '/u/api/account/list-message', //消息列表数据
            'getIsRead': '/u/api/account/read-message', //阅读信息传送
            'getWechatInfo': '/mkg/api/users/getTqrCodePayInfo?codeType=2', //支付宝支付信息
            'getAlipayInfo': '/mkg/api/users/getTqrCodePayInfo?codeType=1', //微信支付信息
            'getSportDeals': '/api/i/u/query/orders/sb', //沙巴游戏记录
            'getPTDeals': '/api/i/u/query/orders/pt', //娱乐场游戏记录
            'getAGDeals': '/api/i/u/query/orders/ag', //AG游戏记录
            'getGameForms': '/mkg/api/query/sportdeals', //体育结算注单,报表查询
            'getPromoInfo': '/mkg/api/users/activity/queryActivityImages', //新版活动
            'getCurrPromo': '/mkg/api/users/activity/queryImageById', //单个活动
            'getBonusInfo': '/u/api/game-lottery/get-last-open', //开奖中心
            'onlineLotterys':'/u/api/game-lottery/openLotterys',//在售彩种
            'getUserBindInfos':'/u/api/account/get-bind-info',//已绑定的信息
            'getUserBindCards':'/u/api/account/list-card',//已绑定的银行卡
            'changename':'/mkg/api/users/change-name',//修改名称
            'chgfund':'/u/api/account/modify-withdraw-password',
            'initAccount':'/u/api/agent/prepare-add-account',//精准开户读取返点
            'addAccount':'/u/api/agent/add-account',//开户接口
            'chglogin':'/u/api/account/modify-password',
            'getUserBindSn':'/u/api/account/get-bind-status',
            'getcities':'/pay/getcities',//?provid=4
            'getUpdatePointInfo':'/u/api/agent/prepare-edit-point-by-quota',//读取返点?userId=8118
            'saveuserpoint':'/u/api/agent/edit-point-by-quota',//保存返点 toPoint:126 userId:8150
            'lotterysCurrentIssue':'/mkg/api/issue/lotterysCurrentIssue',//读取所有彩种奖期
            'lowerTransfer':'/api/i/u/transfer/lowerTransfer',//下级转账
            'nowIssueEndTime':'/u/api/game-lottery/static-open-time',//特定彩种的封单时间，用于倒计时 /hz/mkg/api/issue/nowIssueEndTime?lotteryId=3
            'withDrawCash': '/mkg/api/users/withdraw', //提现数据提交接口
            'weBet':'/u/api/wx-lottery/bet',//聊天投注接口
            'weMsg':'/u/api/wx-lottery/getMessage',//获取消息
            'weStatus':'/u/api/wx-lottery/getStatus',//获取状态
            'weInitGame':'/u/api/wx-lottery/init-game',//初始化游戏
            'weHistory':'/u/api/wx-lottery/search-zbrecord',//新账变记录接口
            'weCodes':'/u/api/game-lottery/static-open-code',//开机号码
            'weQcode':'/u/api/wx-lottery/getQcode',//获取推广二维码
            'weCancel':'/u/api/game-lottery/cancel-order',//撤单
            'reqAllMethod':'/u/api/payment/request-all-method',
            'goThirdMethod':'/u/api/payment/request-thrid-pay',
            'goTransferPay':'/u/api/payment/request-transfer-pay',
            'getFavGame':'/u/api/game-lottery/get-favourite-game',//9个彩种
            'addFavGame':'/u/api/game-lottery/add-favourite-game',//9个彩种
            'removeFavGame':'/u/api/game-lottery/del-favourite-game',//9个彩种
            'vrlogin':'/u/api/game/vr',//VR登录链接
            'blank':''
        }
    },
    getUrl: function(apiName) {
        var params;
        if (arguments.length > 1) {
            params = arguments[1];
        }

        if (typeof Api.apimap.route[apiName] == 'object') {
            if (params) {
                if (arguments.length > 2) {
                    pageparams = arguments[2];
                    return [String(Api.apimap.route[apiName][params]).replace('.json', (pageparams.page > 1 ? '_' + pageparams.page : '') + '.json')].join('');
                }

                return [Api.apimap.route[apiName][params].join('')];
            }
        }
        return [Api.url, Api.apimap.route[apiName]].join('');
    },
    getCommon: function(route, p, fn, type) {
        var xhr = $.ajax({
            url: Api.getUrl(route, p),
            type: type == undefined ? 'GET' : type,
            dataType: "json",
            data: p,
            cache: false,
            timeout: 3000,
            success: function(data){
              if (data==-1) {
                //window.location.href = "/yx/login/sign.html";
                window.location.href = "/login";
              }
              //typeof loadingDialog !== 'undefined' && loadingDialog.close();
              fn(data);
            },
            error:function(xhr, type) {
              if (type == 'timeout') {
                  //typeof loadingDialog !== 'undefined' && loadingDialog.close();
              }else {
                  //typeof loadingDialog !== 'undefined' && loadingDialog.close();
              }
            },
            beforeSend: function() {
                //typeof loadingDialog !== 'undefined' && loadingDialog.open();
            }
        });
        /*xhr.done(function(res) {
            // wait.close();
            // $('.backdrop-dialog').remove();
            loadingDialog.close();
            fn(res);
        });
        xhr.fail(function() {
            // jb_this.close();
            fn('error');
        });*/
    },
    getCommonPass: function(route, p, fn, type) {
        var xhr = $.ajax({
            url: Api.getUrl(route, p),
            type: type == undefined ? 'GET' : type,
            dataType: "json",
            data: p,
            cache: false,
            timeout: 3000,
            success: function(data){
              if (data==-1) {
                $('.about .bar .a86 .b1').hide();$('.about nav').hide();
              }
              //typeof loadingDialog !== 'undefined' && loadingDialog.close();
              fn(data);
            },
            error:function(xhr, type) {
              if (type == 'timeout') {
                  //typeof loadingDialog !== 'undefined' && loadingDialog.close();
              }else {
                  //typeof loadingDialog !== 'undefined' && loadingDialog.close();
              }
            },
            beforeSend: function() {
                //typeof loadingDialog !== 'undefined' && loadingDialog.open();
            }
        });
        /*xhr.done(function(res) {
            // wait.close();
            // $('.backdrop-dialog').remove();
            loadingDialog.close();
            fn(res);
        });
        xhr.fail(function() {
            // jb_this.close();
            fn('error');
        });*/
    },
    getCommonNoLoading: function(route, p, fn, type) {
        var xhr = $.ajax({
            url: Api.getUrl(route, p),
            type: type == undefined ? 'GET' : type,
            dataType: "json",
            data: p,
            cache: false,
            success: function(data){
              if (data==-1) {
                window.location.href = ctx+"/auth/signin.html";
              }
              fn(data);
            },
            error:function(xhr, type) {
              fn('error');
            }
        });
        /*xhr.done(function(res) {
            if (res==-1) {
              window.location.href = ctx+"/auth/signin.html";
            }
            fn(res);
        });
        xhr.fail(function() {
            fn('error');
        });*/
    }
};

//显示时间插件
var showLocale = function(objD) {
  var str, colorhead, colorfoot;
  var yy = objD.getYear();
  if (yy < 1900) yy = yy + 1900;
  var MM = objD.getMonth() + 1;
  if (MM < 10) MM = '0' + MM;
  var dd = objD.getDate();
  if (dd < 10) dd = '0' + dd;
  var hh = objD.getHours();
  if (hh < 10) hh = '0' + hh;
  var mm = objD.getMinutes();
  if (mm < 10) mm = '0' + mm;
  var ss = objD.getSeconds();
  if (ss < 10) ss = '0' + ss;
  var ww = objD.getDay();
  if (ww == 0) colorhead = "<font>";
  if (ww > 0 && ww < 6) colorhead = "<font>";
  if (ww == 6) colorhead = "<font>";
  if (ww == 0) ww = "星期日";
  if (ww == 1) ww = "星期一";
  if (ww == 2) ww = "星期二";
  if (ww == 3) ww = "星期三";
  if (ww == 4) ww = "星期四";
  if (ww == 5) ww = "星期五";
  if (ww == 6) ww = "星期六";
  colorfoot = "</font>"
  //str = colorhead + yy + "年" + MM + "月" + dd + "日" + hh + ":" + mm + ":" + ss + " " + ww + colorfoot;
  str = colorhead + yy + "-" + MM + "-" + dd + " " + hh + ":" + mm + ":" + ss + " " + ww + colorfoot;
  return (str);
}
var formatSeconds = function(value, k) {
  var theTime = parseInt(value); // 秒
  var inTime = parseInt(value);

  var theTime1 = 0; // 分
  var theTime2 = 0; // 小时
  // alert(theTime);
  if (theTime > 60) {
    theTime1 = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);
    // alert(theTime1+"-"+theTime);
    if (theTime1 > 60) {
      theTime2 = parseInt(theTime1 / 60);
      theTime1 = parseInt(theTime1 % 60);
    }
  }
  //console.log(theTime,theTime1,theTime2);
  if (theTime > 0 || theTime1>0) {
    var result = "00:" + (parseInt(theTime) > 9 ? parseInt(theTime) : ("0" + parseInt(theTime))) + "";
    if (theTime1 > 0) {
      result = "" + (parseInt(theTime) > 9 ? parseInt(theTime) : ("0" + parseInt(theTime))) + "";
      result = "" + (parseInt(theTime1) > 9 ? parseInt(theTime1) : ("0" + parseInt(theTime1))) + ":" + result;
    }
    if (theTime2 > 0) {
      result = "" + (parseInt(theTime2) > 9 ? parseInt(theTime2) : ("0" + parseInt(theTime2))) + ":" + result;
    }
  } else {
    //console.log(inTime,'inTimeinTime');
    if (parseInt(theTime) == 0 && inTime < 60) {
      getLeftSec(k);
    }
    if (parseInt(theTime) < -1 && inTime < 60) {
      //console.log('need freah',typeof getLeftSec);
      getLeftSec(k);
    }
    //result = "" + (parseInt(theTime2) > 9 ? parseInt(theTime2) : ("0" + parseInt(theTime2))) + ":" + result;
    //console.log('000000000000000');
    //result = '00:00';
  }
  if (theTime==0 && theTime1==0 && theTime2==0) {
    result = '00:00';
  }
  if (typeof result =='undefined') {
    result = '00:00';
  }
  //console.log(theTime,theTime1,theTime2);
  if (k==99) {
    result = '<i>'+result.replace(/:/g,'</i>:<i>')+'</i>';
  }
  return {
    'str': result,
    'k': k
  };
}
//左侧倒计时
var tick = function(a) {
  var today;
  today = new Date();
  //document.getElementById("localtime").innerHTML = showLocale(today);
  var allleft = $('.lottery-navs .lt-countdown');
  if ($('#pankou-timer').size()>0) {
    var pleftsec = parseInt($('#pankou-timer').data('left'), 10);
    pleftsec--;
    if (pleftsec<0) {
      PankouData.reinit(parseInt($('#hashlid').text(),10));
    }
    var outpankou = formatSeconds(pleftsec, 99);
    $('#pankou-timer').html(outpankou.str);
    $('#pankou-timer').data('left', pleftsec);
  }
  allleft.each(function(k, el) {
    if (typeof $(el).data('left') != 'undefined' && !$(el).hasClass('nocounter')) {
      var leftsec = parseInt($(el).data('left'), 10);
      leftsec--;
      var outp = formatSeconds(leftsec, k);
      if (a == 0) {
        $(el).html(outp.str);
        $(el).data('left', leftsec)
      } else {
        if (leftsec < 0) {
          $('.lottery-navs ul').attr('next', k)
        }
        //console.log($('.lottery-navs ul').attr('next'),'next');
        $(el).html(outp.str);
        $(el).data('left', leftsec);
      }
      //console.log(formatSeconds(leftsec));
    }
  })
  window.setTimeout("tick(1)", 1000);
}
tick(0);

var getLeftSec = function(a) {

  //console.log('getLeftSec');
  typeof Api !='undefined' && Api.getCommon('getFavGame',{t:new Date().getTime()},function(res) {
  	if(res.message=="服务异常"){
		return
  	}
    //console.log(res);
    var ltall = ['<li class="title">&nbsp;常玩彩种<a class="nolink" rel="0" name="">隐藏</a></li>'],allres = res.data;
    var allopenid =[];
    for (i = 0; i < allres.length; i++) {
      if (String(allres[i].lotteryName).indexOf('微信')==-1 ) {
        allopenid.push(allres[i].lotteryId)
        ltall.push('<li class="mylt_'+allres[i].lotteryId+' normal'+(i==0 ? ' first' : '')+'"><a href="#'+allres[i].lotteryId+'" target="_self"><div class="lt-choose"><h3>'+allres[i].lotteryName+'</h3><span id="tc_'+allres[i].lotteryId+'" data-left="'+allres[i].surplusTime+'" class="lt-countdown">00:00</span></div></a></li>')
      }
    }
    ltall.push('<li class="end"><div class="lt-choose-sets"><a href="#" data-position="center" data-toggle="modal" data-target="#saveMy">设置</a></div></li>')
    if (a==null) {
      $('.lottery-navs ul').html(ltall.join(''));
    }else {
      if (typeof allres[a] !='undefined') {
        $('.lottery-navs .lt-countdown').eq(a).data('left',allres[a].surplusTime);
      }
      //console.log(a,'not need all reload',allres[a].surplusTime);
    }
    $('.lottery-navs ul').data('open',allopenid);
    if (typeof GameData !== 'undefined') {
      var ginfo = GameData.getInfo();
      if (typeof ginfo !='undefined' && $('.mylt_'+ginfo.id).size()>0) {
        $('.mylt_'+ginfo.id).addClass('on')
      }
    }
    $('.nolink').unbind('click').click(function(){
      $.cookie('TOGGLE'+$(this).attr('name'),$(this).attr('rel'));
      setToggle();
    });
  });
}

var setToggle = function() {
  //console.log($.cookie('TOGGLE'),$.cookie('TOGGLEA'));
  if (typeof $.cookie('TOGGLE') =='undefined') {
    $.cookie('TOGGLE','1')
  }
    if (typeof $.cookie('TOGGLEA') =='undefined') {
    $.cookie('TOGGLEA','1')
  }
  if ($.cookie('TOGGLE')=='0') {
    $('.lottery-navs .replacer').show();
    $('.lottery-navs > ul').hide();
  }
  if ($.cookie('TOGGLE')=='1') {
    $('.lottery-navs .replacer').hide();
    $('.lottery-navs > ul').show();
  }
  if ($.cookie('TOGGLEA')=='0') {
    $('.lottery-open-list .replacer').show();
    $('.lottery-open-list').addClass('transbg');
    $('.lottery-open-list > .bigtitle').hide();
    $('.lottery-open-list > .title').hide();
    $('.lottery-open-list > .content').hide();
  }
  if ($.cookie('TOGGLEA')=='1') {
    $('.lottery-open-list .replacer').hide();
    $('.lottery-open-list').removeClass('transbg');
    $('.lottery-open-list > .bigtitle').show();
    $('.lottery-open-list > .title').show();
    $('.lottery-open-list > .content').show();
  }
}

var getViewport = function() {
  var viewPortWidth;
  var viewPortHeight;
  // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
  if (typeof window.innerWidth != 'undefined') {
   viewPortWidth = window.innerWidth,
   viewPortHeight = window.innerHeight
  }
  // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
  else if (typeof document.documentElement != 'undefined'
  && typeof document.documentElement.clientWidth !=
  'undefined' && document.documentElement.clientWidth != 0) {
    viewPortWidth = document.documentElement.clientWidth,
    viewPortHeight = document.documentElement.clientHeight
  }
  // older versions of IE
  else {
   viewPortWidth = document.getElementsByTagName('body')[0].clientWidth,
   viewPortHeight = document.getElementsByTagName('body')[0].clientHeight
  }
  return [viewPortWidth, viewPortHeight];
}


var ArrayUtil = function() {

	// 组合数
	var ComNum = function(n, m) {
		m = parseInt(m);
		n = parseInt(n);
		if (m < 0 || n < 0) {
			return false;
		}
		if (m == 0 || n == 0) {
			return 1;
		}
		if (m > n) {
			return 0;
		}
		if (m > n / 2.0) {
			m = n - m;
		}
		var result = 0.0;
		for (var i = n; i >= (n - m + 1); i--) {
			result += Math.log(i);
		}
		for (var i = m; i >= 1; i--) {
			result -= Math.log(i);
		}
		result = Math.exp(result);
		return Math.round(result);
	}

	// 组合值
	var ComVal = function(source, m, x) {
		var n = source.length;
		var list = [];
		var start = 0;
		while (m > 0) {
			if (m == 1) {
				list.push(source[start + x]);
				break;
			}
			for (var i = 0; i <= n - m; i++) {
				var cnm = ComNum(n - 1 - i, m - 1);
				if (x <= cnm - 1) {
					list.push(source[start + i]);
					start = start + (i + 1);
					n = n - (i + 1);
					m--;
					break;
				} else {
					x = x - cnm;
				}
			}
		}
		return list;
	}

	// 判断是否存在
	var inArray = function(e, data) {
		for (var i = 0; i < data.length; i++) {
			if (data[i] == e) return true;
		}
		return false;
	}

	// 数组去重复
	var uniquelize = function(data) {
		var array = new Array();
		for (var i = 0; i < data.length; i++) {
			if (!inArray(data[i], array)) {
				array.push(data[i]);
			}
		}
		return array;
	}

	//求两个集合的并集
	var union = function(a, b) {
		return uniquelize(a.concat(b));
	}

	//求两个集合的差集
	var minus = function(a, b) {
		var array = new Array();
		var ua = uniquelize(a);
		for (var i = 0; i < ua.length; i++) {
			if(!inArray(ua[i], b)) {
				array.push(ua[i]);
			}
		}
		return array;
	}

	//求两个集合的交集
	var intersect = function(a, b) {
		var array = new Array();
		var ua = uniquelize(a);
		for (var i = 0; i < ua.length; i++) {
			if(inArray(ua[i], b)) {
				array.push(ua[i]);
			}
		}
		return array;
	}

	//求两个集合的补集
	var complement = function(a, b) {
		return minus(union(a, b), intersect(a, b));
	}

	// 去除重复，最快速方法，会排序
	var unique = function(data) {
		data.sort();
		var re = [data[0]];
		for(var i = 1; i < data.length; i++) {
			if(data[i] !== re[re.length - 1]) {
				re.push(data[i]);
			}
		}
		return re;
	}

	// 根据下标删除
	var remove = function(data, idx) {
		if(data.length > idx) {
			data.splice(idx, 1);
		}
		return data;
	}

	return {
		ComNum: ComNum,
		ComVal: ComVal,
		unique: unique,
		uniquelize: uniquelize,
		intersect: intersect,
		complement: complement,
		remove: remove,
	}

}();

var LZMAUtil = function() {

	var toHex = function(byte_arr) {
		var hex_str = '', i, len, tmp_hex;
		len = byte_arr.length;
		for (i = 0; i < len; ++i) {
			if (byte_arr[i] < 0) {
				byte_arr[i] = byte_arr[i] + 256;
			}
			tmp_hex = byte_arr[i].toString(16);
			if (tmp_hex.length === 1) {
				tmp_hex = '0' + tmp_hex;
			}
			hex_str += tmp_hex;
		}
		return hex_str.trim();
	}

	return {
		toHex: toHex
	}

}();

var LotteryChase = function() {

	var Config = {};

	var els = function() {
		return $('.lottery-chase');
	}

	var TimeList = [];
	var loadExpect = function(count, fn) {
		var url = Route.PATH + '/game-lottery/static-chase-time';
		var data = {name: Config.lottery};
		$.ajax({
			type: 'post',
			url: url,
			data: data,
			timeout: 10000,
			dataType: 'json',
			success: function(response) {
				TimeList = response;
				if($.isFunction(fn)) fn();
			}
		});
	}

	/**
	 * 计算投注列表信息
	 */
	var BListInfo = function() {
		var bList = function() {
			return LotteryMain.bList();
		}
		var money = function(multiple) {
			var amount = 0;
			var list = bList();
			for (var i = 0; i < list.length; i++) {
				var val = list[i];
				amount += multiple * val.num * Config.sysUnitMoney * PrizeUtils.model(val.model).money;
			}
			return amount;
		}
		var cList = function() {
			var list = [];
			var thisTable = els().find('.sections').find('table > tbody');
			thisTable.find('tr').each(function() {
				var thisRow = $(this);
				var checkbox = thisRow.find('input[type="checkbox"]');
				var expect = thisRow.find('.expect').html();
				var multiple = Number(thisRow.find('input[type="text"]').val());
				if(checkbox.is(':checked')) {
					list.push({expect: expect, multiple: multiple});
				}
			});
			return list;
		}
		return {
			bList: bList,
			cList: cList,
			money: money
		}
	}();

	/**
	 * 奖金工具
	 */
	var PrizeUtils = function() {
		var model = function(val) {
			if(val == 'yuan') {
				return {val: val, money: 1};
			}
			if(val == 'jiao') {
				return {val: val, money: 0.1};
			}
			if(val == 'fen') {
				return {val: val, money: 0.01};
			}
			if(val == 'li') {
				return {val: val, money: 0.001};
			}
		}
		var money = function(type, m, code) {
			var method = Config.method[type];
			var mMoney = model(m).money;
			var prize = [];
			if(method) {
				var ps = method.bonus.split(',');
        //console.log(ps,ps*(Config.sysUnitMoney / 2)*mMoney,'psssssssss',Config.sysUnitMoney,mMoney);
				for (var i = 0, j = ps.length; i < j; i++) {
					var pm = (code / Number(ps[i])) * (Config.sysUnitMoney / 2) * mMoney;
					prize[i] = pm.toFixed(3);
				}
			}
      //console.log(type, m, code,prize,'prizeprizeprizeprizeprize');
			return prize;
		}
		var tracesinglemoney = function(type, m, code, mincode) {
      //console.log(type,'typetypetype');
			var method = Config.method[type];
			var mMoney = model(m).money;
			var prize = [];
      console.log(method,'methodmethodmethod');
			if(method) {
				var ps = method.bonus.split(',');
        console.log(ps,'ppppppppp');
        //console.log('trace',code,ps,ps*(Config.sysUnitMoney / 2)*mMoney,'psssssssss',Config.sysUnitMoney,mMoney);
				for (var i = 0, j = ps.length; i < j; i++) {
          console.log(mincode);
					var percent = Number(ps[i])/mincode;
          //console.log(code,Number(ps[i]),ps,(Config.sysUnitMoney / 2),mMoney,'percentpercent');
          //var pm = (code()*percent / Number(ps[i])) * Number(ps[i]) * ($SysUnitMoney / 2);
          var pm = (code*percent / Number(ps[i])) * ps * (Config.sysUnitMoney / 2)*mMoney;
					prize[i] = pm.toFixed(3);
				}
			}
      console.log(prize,'tracesinglemoneytracesinglemoneylastprizeprizeprizeprizeprize');
			return prize;
		}
		return {
			model: model,
      tracesinglemoney : tracesinglemoney,
			money: money
		}
	}();

	/**
	 * 投注选项
	 */
	var Options = function() {
		var update = function() {
			var options = els().find('.options');
			var thisTable = els().find('.sections').find('table > tbody');
			var totalExpect = 0, totalMoney = 0;
			thisTable.find('tr').each(function() {
				var thisRow = $(this);
				var checkbox = thisRow.find('input[type="checkbox"]');
				var thisMoney = Number(thisRow.find('.money').html());
				if(checkbox.is(':checked')) {
					totalExpect++;
					totalMoney += thisMoney;
				}
			});
			options.find('[data-field="total-expect"]').html(totalExpect);
			options.find('[data-field="total-money"]').html(totalMoney.toFixed(3));
		}
		var isStop = function() {
			var options = els().find('.options');
			var isStop = options.find('input[name="isStop"]');
			return isStop.is(':checked') ? true : false;
		}
		return {update: update, isStop: isStop};
	}();

	/**
	 * 计算利润率
	 * count 追号期数
	 * sMultiple 开始倍数
	 * maxMultiple 最大倍投
	 * minProfit 最低利润率（百分比）
	 * money 单倍金额
	 * prize 单倍奖金
	 */
	var calculation = function(count, sMultiple, maxMultiple, minProfit, money, prize) {
		var result = []; // 结果
		var totalMoney = 0;
		var multiple = sMultiple;
		for (var i = 0; i < count; i++) {
			var thisMoney = 0;
			var thisPrize = 0;
			var thisProfit = 0;
			while (true) {
				thisMoney = money * multiple;
				thisPrize = prize * multiple;
				var tempTotal = totalMoney + thisMoney;
				thisProfit = (thisPrize - tempTotal) / tempTotal;
				if(thisProfit >= minProfit) break;
				if(multiple > maxMultiple) return result;
				multiple++;
			}
			totalMoney += thisMoney; // 累计投入
			//alert(multiple + '-' + thisMoney + '-' + totalMoney + '-' + thisPrize);
			result.push({multiple: multiple, thisMoney: thisMoney, thisPrize: thisPrize, thisProfit: thisProfit});
		}
		return result;
	}

	var doGenerate = function() {
		var tabs = els().find('.tabs');
		var options = els().find('.options');
		var thisTable = els().find('.sections').find('table > tbody');
		var total = Number(options.find('input[name="expect"]').val());
		var index = tabs.find('.active').attr('data-type');
		if(index == 0) {
			// 判断多订单
			if(BListInfo.bList().length > 1) {
				return App.alert('info', '提示消息', '多个订单不支持利润率追号！', 3000);
			}
			var data = BListInfo.bList()[0];
      //console.log(data,'ddddd');
			// 计算单倍奖金
      var usermincode = parseInt($('[data-command="chase"]').attr('code'),10);
      //alert(usermincode);
			var prize = PrizeUtils.tracesinglemoney(data.method, data.model, data.code,usermincode);
			if(prize.length > 1) {
				return App.alert('info', '提示消息', '该玩法不支持利润率追号！', 3000);
			}
			// 计算单倍投注金额
			var money = data.num * Config.sysUnitMoney * PrizeUtils.model(data.model).money;
			// 获取选项
			var sMultiple = Number(options.find('input[name="sMultiple"]').val());
			var maxMultiple = Number(options.find('input[name="maxMultiple"]').val());
			var minProfit = Number(options.find('input[name="minProfit"]').val());
			minProfit = minProfit / 100; // 变成百分比
      //console.log(minProfit,'minProfit');
      console.log(total, sMultiple, maxMultiple, minProfit, money, prize);
			var result = calculation(total, sMultiple, maxMultiple, minProfit, money, prize);
      console.log(result,'resultresultresult');
			thisTable.empty();
			if(result.length > 0) {
				for (var i = 0; i < result.length; i++) {
					if(i > TimeList.length - 1) break;
					var val = TimeList[i];
					var multiple = result[i].multiple;
					var innerHtml =
						'<tr>'+
						'<td class="checkbox"><input type="checkbox" checked="checked"></td>'+
						'<td class="expect">' + val.issue + '</td>'+
						'<td class="multiple"><input type="text" class="form-control" value="' + multiple + '"> 倍</td>'+
						'<td class="money">' + BListInfo.money(multiple).toFixed(3) + '</td>'+
						'<td class="time">' + val.stopTime + '</td>'+
						'</tr>';
					thisTable.append(innerHtml);
				}
			} else {
				var innerHtml = '<tr><td>没有符合要求的方案，请调整参数重新计算！</td></tr>';
				thisTable.append(innerHtml);
			}
			Options.update();
		}
		if(index == 1) {
			var sMultiple = Number(options.find('input[name="sMultiple"]').val());
			thisTable.empty();
			for (var i = 0; i < total; i++) {
				if(i > TimeList.length - 1) break;
				var val = TimeList[i];
				var innerHtml =
				'<tr>'+
					'<td class="checkbox"><input type="checkbox" checked="checked"></td>'+
					'<td class="expect">' + val.issue + '</td>'+
					'<td class="multiple"><input type="text" class="form-control" value="' + sMultiple + '"> 倍</td>'+
					'<td class="money">' + BListInfo.money(sMultiple).toFixed(3) + '</td>'+
					'<td class="time">' + val.stopTime + '</td>'+
				'</tr>';
				thisTable.append(innerHtml);
			}
			Options.update();
		}
		if(index == 2) {
			var sMultiple = Number(options.find('input[name="sMultiple"]').val());
			var operation = options.find('select[name="operation"]').val();
			var expTimes = Number(options.find('input[name="expTimes"]').val());
			var expMultiple = Number(options.find('input[name="expMultiple"]').val());
			thisTable.empty();
			for (var i = 0; i < total; i++) {
				if(i > TimeList.length - 1) break;
				var val = TimeList[i];
				var multiple = 1;
				if('x' == operation) {
					multiple = i < expTimes ? sMultiple : sMultiple * Math.pow(expMultiple, Math.floor(i / expTimes));
				}
				if('+' == operation) {
					multiple = i < expTimes ? sMultiple : sMultiple + expMultiple * Math.floor(i / expTimes);
				}
				if(multiple > 10000) return;
				var innerHtml =
				'<tr>'+
					'<td class="checkbox"><input type="checkbox" checked="checked"></td>'+
					'<td class="expect">' + val.issue + '</td>'+
					'<td class="multiple"><input type="text" class="form-control" value="' + multiple + '"> 倍</td>'+
					'<td class="money">' + BListInfo.money(multiple).toFixed(3) + '</td>'+
					'<td class="time">' + val.stopTime + '</td>'+
				'</tr>';
				thisTable.append(innerHtml);
			}
			Options.update();
		}
		initTableEvent();
	}

	var initNormal = function() {
		var options = els().find('.options');
    //console.log(TimeList,'TimeListTimeListTimeList');
		var thisTable = els().find('.sections').find('table > tbody');
		var total = Number(options.find('input[name="expect"]').val());
    //console.log(total,'totaltotaltotaltotaltotaltotal');
		thisTable.empty();
		for (var i = 0; i < total; i++) {
			var val = TimeList[i];
      if (typeof TimeList[i] !='undefined') {
        var innerHtml =
        '<tr>'+
          '<td class="checkbox"><input type="checkbox"></td>'+
          '<td class="expect">' + val.issue + '</td>'+
          '<td class="multiple"><input type="text" class="form-control" value="0" disabled="disabled"> 倍</td>'+
          '<td class="money">0.000</td>'+
          '<td class="time">' + val.stopTime + '</td>'+
        '</tr>';
        thisTable.append(innerHtml);
      }

		}
		initTableEvent();
	}

	var initTableEvent = function() {
		var thisTable = els().find('.sections').find('table > tbody');
		thisTable.find('tr').each(function() {
			var thisRow = $(this);
			var checkbox = thisRow.find('input[type="checkbox"]');
			var multiple = thisRow.find('input[type="text"]');
			var update = function() {
				var val = Number(multiple.val());
				if(isNaN(val)) val = 0;
				thisRow.find('.money').html(BListInfo.money(val).toFixed(3));
				Options.update();
			}
			checkbox.change(function() {
				if($(this).is(':checked')) {
					multiple.val(1);
					multiple.removeAttr('disabled');
				} else {
					multiple.val(0);
					multiple.attr('disabled', 'disabled');
				}
				update();
			});
			multiple.keyup(function() {
				if($(this).val() == '') return;
				var val = Number($(this).val());
				if(/^[0-9]*$/.test(val)) {
					if(val > 10000) $(this).val(10000);
					if(val < 1) $(this).val(1);
				} else {
					$(this).val(1);
				}
				update();
			});
			multiple.keydown(function(e) {
				if($(this).val() == '') return;
				var val = Number($(this).val());
				if(!isNaN(val)) {
					if(e.keyCode == 38) val++;
					if(e.keyCode == 40) val--;
					if(val > 10000) val = 10000;
					if(val < 1) val = 1;
					$(this).val(val);
				}
			});
		});
	}

	var bindNumber = function(els, defval) {
		if(els.length == 0) return;
		els.keydown(function(e) {
			if(e.keyCode == 38 || e.keyCode == 40) {
				if($(this).val() == '') return;
				var val = Number($(this).val());
				if(!isNaN(val)) {
					if(e.keyCode == 38) val++;
					if(e.keyCode == 40) val--;
					if(val < 0) val = defval;
					$(this).val(val);
				}
			}
		});
		els.keyup(function() {
			if($(this).val() == '') return;
			var val = Number($(this).val());
			if(/^[0-9]*$/.test(val)) {
				if(val < 0) $(this).val(1);
			} else {
				$(this).val(defval);
			}
		});
		els.blur(function() {
			if($(this).val() == '') {
				$(this).val(defval);
			}
		});
	}

	var initDocEvent = function() {
		var tabs = els().find('.tabs');
		var options = els().find('.options');
    var firegroup = els().find('.last-btn-group');
		tabs.find('a').click(function() {
			var index = $(this).attr('data-type');
			if(!$(this).hasClass('active')) {
				tabs.find('a').removeClass('active');
				$(this).addClass('active');
				options.find('section').removeClass('active');
				options.find('section[data-type="' + index + '"]').addClass('active');
			}
		});
		/*var expect = options.find('input[name="expect"]');
		expect.change(function() {
			initNormal();
		});*/
		options.find('[data-command="generate"]').click(function() {
			doGenerate();
		});
		firegroup.find('[data-command="submit"]').click(function() {
			var lottery = Config.lottery;
			var blist = BListInfo.bList();
			var clist = BListInfo.cList();
			var isStop = Options.isStop();
			doSubmit(lottery, blist, clist, isStop);
		});
		// 只能输入数字
		var expect = options.find('input[name="expect"]');
		var sMultiple = options.find('input[name="sMultiple"]');
		var maxMultiple = options.find('input[name="maxMultiple"]');
		var minProfit = options.find('input[name="minProfit"]');
		var expTimes = options.find('input[name="expTimes"]');
		var expMultiple = options.find('input[name="expMultiple"]');
		bindNumber(expect, 1);
		bindNumber(sMultiple, 1);
		bindNumber(maxMultiple, 1);
		bindNumber(minProfit, 1);
		bindNumber(expTimes, 1);
		bindNumber(expMultiple, 1);
	}

	// 投注
	var isLoading = false;
	var doSubmit = function(lottery, blist, clist, isStop) {
		if(!isLoading) {
			if(blist.length == 0) {
				return App.alert('info', '提示消息', '投注列表没有订单！', 3000);
			}
			if(clist.length == 0) {
				return App.alert('info', '提示消息', '您没有勾选任何追号计划！', 3000);
			}
			var orderList = [];
			$.each(blist, function(i, v) {
				orderList.push({
					lottery: v.lottery,
					method: v.method,
					content: v.content,
					model: v.model,
					code: v.code,
					compress: v.compress
				});
			});
			var planList = [];
			$.each(clist, function(i, v) {
				planList.push({
					issue: v.expect,
					multiple: v.multiple
				});
			});
			var text = {
				orderList: orderList,
				planList: planList,
				winStop: isStop
			}
			var data = { text: $.toJSON(text) };
			var url =Route.PATH + '/game-lottery/add-chase';
			isLoading = true;
			var thisContent = els().find('.jBox-content');
			App.blockUI({
				target: thisContent,
				boxed: true
			});
			$.ajax({
				type: 'post',
				url: url,
				data: data,
				timeout: 10000,
				dataType: 'json',
				success: function(response) {
					if(response.error == 0) {
						isLoading = false;
						App.unblockUI(thisContent);
						LotteryMain.clear();
						box.close();
						App.alert('success', '提示消息', '您的订单已投注成功！', 3000);
            $('[data-field="lotteryBalance"]').html(response.data);
						if(RecordList) RecordList.init();
					}
					if(response.error == 1) {
						if ('116-05' == response.code) {
							setTimeout(function() {
								isLoading = false;
								App.unblockUI(thisContent);
								App.alert('warning', '提示消息', '投注超时，请检查网路情况后重新重试。');
							}, 10000);
						} else if ('116-06' == response.code) {
							window.location.href = '/game/lottery/index.html';
						} else {
							isLoading = false;
							App.unblockUI(thisContent);
							App.alert('warning', '提示消息', response.message);
						}
					}
				},
				error : function() {
					isLoading = false;
					App.unblockUI(thisContent);
				}
			});
		}
	}

	var initDocument = function() {
		var innerHtml =
		'<div class="tabs"><a data-type="2">翻倍追号</a><a data-type="1">同倍追号</a><a data-type="0" class="active">利润率追号</a></div>'+
		'<div class="panels">'+
			'<div class="options">'+
				'<div class="row">'+
					'<label>追号期数：</label>'+
					'<input name="expect" type="text" class="form-control" value="10">'+
					'<label>&nbsp;总期数：<span class="text-dark-green" data-field="total-expect">0</span>期，</label>'+
					'<label>总追号金额：<span class="text-dark-green" data-field="total-money">0.000</span>元</label>'+
					'<input name="isStop" type="checkbox" checked="checked">'+
					'<label>中奖后停止追号</label>'+
				'</div>'+
				'<div class="row">'+
					'<label>起始倍数：</label>'+
					'<input name="sMultiple" type="text" class="form-control" value="1">'+
					'<section class="active" data-type="0">'+
						'<label>&nbsp;最大倍投：</label>'+
						'<input name="maxMultiple" type="text" class="form-control" value="100">'+
						'<label>&nbsp;最低收益率：</label>'+
						'<input name="minProfit" type="text" class="form-control" value="30">'+
						'<label>&nbsp;%</label>'+
					'</section>'+
					'<section data-type="2">'+
						'<label>&nbsp;隔&nbsp;</label>'+
						'<input name="expTimes" type="text" class="form-control" value="1">'+
						'<label>&nbsp;期，倍&nbsp;</label>'+
						'<select name="operation" class="form-control" style="width: 36px; border-right: none;">'+
							'<option value="x">x</option>'+
							'<option value="+">+</option>'+
						'</select>'+
						'<input name="expMultiple" type="text" class="form-control" value="2">'+
					'</section>'+
				'</div>'+
				'<div class="btn-group">'+
					'<a class="generate" data-command="generate">生成追号单</a>'+
					//'<a class="submit" data-command="submit">确认投注</a>'+
				'</div>'+
			'</div>'+
			'<div class="sections clearfix"><table><thead><tr><td class="checkbox">选择</td><td class="expect">期号</td><td class="multiple">倍数</td><td class="money">金额<em class="canhide">（元）</em></td><td class="time"><em class="canhide">代购</em>截止时间</td></tr></thead></table><div class="list"><div class="scroller" data-handle-distance="2px"><table><tbody></tbody></table></div></div></div>'+
      '<div class="last-btn-group"><a class="submit hand" data-command="submit">确认投注</a></div>'+
		'</div>';
		return innerHtml;
	}

	var box, defalutCount = 100;
	var init = function() {
		Config = LotteryMain.getConfig();
		if(BListInfo.bList().length == 0) {
			return App.alert('info', '提示消息', '投注列表没有可以追号的订单！');
		}
		if(box == undefined) {
			var thisExpect = $('.lottery-open-info').find('[data-field="global-expect"]').html();
      var doc = initDocument();
			var jOpt = {
        id:'chaseFloat',
        width: 800,
        height: 635,
        title: '我要追号<font class="f16">（当前销售第 <span data-field="global-expect">' + thisExpect + '</span>期，距离投注截止时间还有<span data-field="global-last-time">00:00:00</span></font>）',
        overlay: true,
        closeOnClick: false,
        blockScroll: false,
        animation: {open: 'zoomIn', close: 'zoomOut'},
        closeButton: 'title',
        draggable: 'title',
        content: doc,
        addClass: 'common-modal lottery-chase noselect default-cursor',
        onInit: function() {
          this.open();
          initDocEvent();
          App.initScroll();
          loadExpect(defalutCount, initNormal);
        },
        onCloseComplete: function() {
          this.destroy();
          box = undefined;
        }
      };
      if (typeof QueryString.iframe !='undefined') {
        jOpt.position = {
          x: 'center',
          y: $('lottery #lottery-frame', window.parent.document).scrollTop()+181//window.parent.document.body.clientHeight/2
        };
        //jOpt.fixed = true
        jOpt.offset = {
          x: 0,
          y: -180
        };
        //console.log(jOpt);
        //console.log($('lottery #lottery-frame', window.parent.document).scrollTop(),jOpt.position);
      }
      box = new jBox('Modal',jOpt);
      AppData.jbox = box;
		} else {
			box.toggle();
		}
	}
	return {init: init};
}();

/**
 * 走势图
 */
var LotteryTrend = function() {

	var init = function(shortName,no,chs) {
		var name = shortName;
		if(name == 'fbffc1m') name = 'ffc';
		if(name == 'fbffc3m') name = '3fc';
		if(name == 'fbffc5m') name = '5fc';
		$('.lottery-code-trend').attr('href', '/static/lottery-trend.html?id='+no+'&w=1&q=50&chs='+ encodeURI(chs));
		$('.lottery-code-trend').attr('target', new Date().getTime());
	}

	return {
		init: init
	}

}();

/**
 * 合买计划
 */
var LotteryPlan = function() {

	var init = function(lottery) {
		var name = lottery.shortName;
		if(name == 'fbffc1m') name = 'ffc';
		if(name == 'fbffc3m') name = '3fc';
		if(name == 'fbffc5m') name = '5fc';
		var thisButton = $('.lottery-record').find('[data-command="plan"]');
		thisButton.attr('href', '/lottery-plan.html?' + name);
	}

	return {
		init: init
	}

}();

/**
 * 彩票开奖时间
 */
var LotteryOpenTime = function() {

	var $Lottery; // 彩票游戏
	var $Timer; // 定时器

	var loadData = function() {
		var data = { name: $Lottery.shortName };
		GameLotteryCtrl.staticOpenTime({
			data: data,
			success: function(response) {
				if (response) {
          //if (typeof f7.loopmanage_2 !='undefined') {
          //  clearInterval(f7.loopmanage_2);
          //}
					handleData(response);
				}
			}
		});
	}

	// 格式化时间
	var formatTime = function(seconds) {
		var s = 1, m = 60 * s, h = m * 60;
		var ss = 0, mm = 0, hh = 0;
		if(s > 0) {
			hh = Math.floor(seconds / h);
			mm = Math.floor(seconds % h / m);
			ss = Math.floor(seconds % h % m / s);
		}
		var p = function(t) {
			return t < 10 ? '0' + t : t;
		}
		return [p(hh), p(mm), p(ss)];
	}

	var setTime = function(issue, openTime) {
		var seconds = openTime.diff(moment(), 'seconds');
		var time = formatTime(seconds);
		$('[data-field="global-expect"]').html(issue);
    $('#lottery .openzone .lastis,#basket .openzone .lastis,#zuomainbox .openzone .lastis,#autotrace .openzone .lastis').html((String(issue).indexOf('-')==-1 ? String(issue).substring(issue.length-3,issue.length) : String(issue).split('-')[1]));
		$('[data-field="global-last-time"]').html('<i>' + time[0] + '</i>:<i>' + time[1] + '</i>:<i>' + time[2] + '</i>');
    $('#lottery .openzone .lastco,#basket .openzone .lastco,#zuomainbox .openzone .lastco,#autotrace .openzone .lastco').html('<i>' + time[0] + '</i>:<i>' + time[1] + '</i>:<i>' + time[2] + '</i>');

    if ($('#basket .lastopis').html()=='') {
      $('#basket .lastopno').html($('#lottery .lastopno').html());
      $('#basket .lastopis').html($('#lottery .lastopis').html());
      $('#zuomainbox .lastopis').html($('#lottery .lastopis').html());
    }
    //console.log(typeof time[0]);
    //console.log($('lottery #topmcounter', window.parent.document).html());
    if (typeof $('lottery #topmcounter', window.parent.document) !='undefined') {
      $('lottery #topmcounter', window.parent.document).html((time[0] !='00' ? '<i>' + time[0] + '</i>:' : '')+'<i>' + time[1] + '</i>:<i>' + time[2] + '</i>');
    }
    if (typeof $('.footer-bar-deal #mcounter_other', window.parent.document) !='undefined') {
      $('.footer-bar-deal #mcounter_other', window.parent.document).html((time[0] !='00' ? '<i>' + time[0] + '</i>:' : '')+'<i>' + time[1] + '</i>:<i>' + time[2] + '</i>');
    }
		//$('.lottery-open-info .last-time > div').html('<i>' + time[0] + '</i><i>' + time[1] + '</i><i>' + time[2] + '</i>');

		if(seconds <= 10) {
      //倒计时声音
			/*if($('.set-voice').find('.cd').hasClass('audio-on')) {
				var lotteryCd = document.getElementById('lottery-cd');
				if(lotteryCd) {
					lotteryCd.play();
				} else {
					var audio = $('<audio id="lottery-cd" autoplay="autoplay">');
					audio.attr('src', 'assets/global/audio/cd.mp3').hide();
					$('body').append(audio);
				}
			} */
		}
    if (seconds == 0) {
      $('div[data-field="code"]').hide();
      $('.codeholder').show();
      if ($('#sys-message').size()> 0) {
        document.getElementById('sys-message').play()
      }else {
				if($('.set-voice').find('.cd').hasClass('audio-on') && !isMobile.any()) {
          var audio = $('<audio id="sys-message" autoplay="autoplay">');
          audio.attr('src', '/audio/message.mp3').hide();
          $('body').append(audio);
          document.getElementById('sys-message').play();
        }
      }
    }
    if (seconds%30== 0) {
      typeof RecordList !='undefined' && RecordList.init();
      //console.log('LotteryOpenCode.init');
      var linfo = GameData.getInfo();
      LotteryOpenCode.init(linfo);
    }
    if (seconds>30 && seconds<50) {
      //console.log(seconds% 5);
      if (seconds% 5== 0) {
        var linfo = GameData.getInfo();
        LotteryOpenCode.init(linfo);
      }
      $('div[data-field="code"]').show();
      $('.codeholder').hide();
    }

		if (seconds <= 0) {
			/*if (typeof f7.loopmanage_1 !='undefined') {
        clearInterval(f7.loopmanage_1);
      } */
      $('audio#lottery-cd').remove();
      $('[data-field="expect"]').html(issue);
      $('#lottery .lastopis,#basket .lastopis,#zuomainbox .lastopis').html((String(issue).indexOf('-')==-1 ? String(issue).substring(issue.length-3,issue.length) : String(issue).split('-')[1]));
			$('#lottery .lastopno,#basket .lastopno,#zuomainbox .lastopno').html('开奖中...');
      clearTimeout($Timer);
      if (String(location.pathname).indexOf('lottery')>-1) {
        App.alert('warning', '温馨提示', '第 <font class="f18" color="#ff4500">' + issue + '</font> 期 已截止，<br/>请注意投注期号！', 3000);
      }

			setTimeout(loadData, 1000);
			$Timer = setInterval(loadData, 5000);
      //f7.loopmanage_1 = $Timer;
		}
	}


	var handleData = function(data) {
		$Timer && clearTimeout($Timer);
		var issue = data.issue;
		var seconds = data.surplusTime + 1;
		var openTime = moment().add(seconds, 'seconds'); // moment对象
		setTime(issue, openTime);
		$Timer = setInterval(function() {
			setTime(issue, openTime);
		}, 1000);
    //f7.loopmanage_2 = $Timer;
	}

	var init = function(lottery) {
		$Lottery = lottery;
		loadData();
	}

	return {
		init: init
	}

}();

/**
 * 彩票开奖号码
 */
var LotteryOpenCode = function() {

	var $Lottery; // 彩票游戏
	var $Timer; // 定时器

	var $LastIssue; // 上一期的开奖号码

	var loadData = function(history) {
		//console.log(history);
    var data = { name: $Lottery.shortName, history: history };
		GameLotteryCtrl.staticOpenCode({
			data: data,
			success: function(response) {
				if (String(response)=='-1') {
          //window.location.href = "/yx/login/sign.html";
          return false;
        }
        if (response) {
					handleData(response);
				}
			}
		});
	}
	var $MoreTimer;
	var $CurrCode;
	var handleData = function(list) {
      var thisResultList = $('.lottery-open-list .list');
	    thisResultList.empty();
      var getRandomNum = function() {
        var arr = [],json = {};
        while(arr.length<5){
          var num = Math.round(Math.random()*9);
          if(!json[num]) {
            arr.push(num);
            json[num] = true;
          }
        }
        return arr;
      }

      var formatCode = function(code, lottery, zutype) {
          //console.log(lottery,'zutypezutype');
	        var format = $('<div class="code'+(typeof zutype !='undefined' ? '' : ' expand')+'">');
          //console.log(code,lottery);
          if (code == null) {
            //code = getRandomNum().join(',');
          }
	        var codes = code.split(',');
	        if (codes.length == 20 && (lottery == "hgffc" || lottery == "bjffc" || lottery == "twffc" || lottery == "jndffc")) {
	        	var bigAry = BigNumber(codes).bigAry;
	            for (var i = 0; i < 5; i++) {
	                format.append('<div class="num more">' + bigAry[i] + '</div>');
	            }
	        } else {
	            var length = codes.length > 5 ? 5 : codes.length;
	            if ($Lottery.type == 6) {
	            	length = codes.length;
	            }
	            for (var i = 0; i < length; i++) {
	                format.append('<div class="num">' + codes[i].split('|')[0] + '</div>');
	            }
	           if (codes.length >3&&codes.length <5) {
	                format.append('<a class="more">...</a>');
	            }
	        }
          //console.log($Lottery.type,$Lottery);
	        if($Lottery.type == 10 || String($Lottery.shortName).indexOf('PK10')>-1){
	        		format = $('<div class="code'+(typeof zutype !='undefined' ? '' : ' expand')+'">');
	            	var sb = code.split(',');
                var leftfive = _.take(sb, 5).join('</div><div class="num">');
                var lastfive = _.takeRight(sb, 5).join('</div><div class="num">');
	            	format.append('<div class="num">' + leftfive + '</div><br><div class="num">'+lastfive+'</div>')
	            }
	        return format;
	    }
      //console.log(list,'listlist');
      var shortIssue = function(str) {
        if (String(str).indexOf('-')>-1) {
          return str.split('-')[1]
        }
        if (str.length==6) {
          return str;
        }
        str = _.takeRight(str.split(''), 4).join('');
        return str
      }
      var hasDuplicates = function(a,len) {
        //console.log(a.length-_.uniq(a).length==2);
        return _.uniq(a).length !== a.length && (a.length-_.uniq(a).length==len);
      }
      var zutypemethod = function(textkey) {
        var chkdtwuxin = function(str) {
          if (str==null) {return '';  }
          var ar = str.split(',');
          //console.log(ar,'arararar');
          if (hasDuplicates(ar,0)){return '组120'}
          if (hasDuplicates(ar,1)){return '组60'}
          if (hasDuplicates(ar,2,2)){return '组30'}
          if (hasDuplicates(ar,2,3)){return '组20'}
          if (hasDuplicates(ar,3,3,2)){return '组10'}
          if (hasDuplicates(ar,2)){return '组5'}
          return '组120'
        }
        var chkdtsixin = function(str) {
          if (str==null) {return '';}
          var ar = str.split(',');
          ar = _.takeRight(ar, 4);
          //console.log(_.sortBy(ar));
          if (str==null) {return '';  }
          if (hasDuplicates(ar,0)){return '组24'}
          if (hasDuplicates(ar,1)){return '组12'}
          if (hasDuplicates(ar,2)){return '组6'}
          if (hasDuplicates(ar,2)){return '组4'}
          return '组24'
        }
        var chksan1 = function(str) {
          if (str==null) {return '';  }
          var allno = str.split(',');
          allno = _.take(allno, 3);
          //console.log(allno);
          if (hasDuplicates(allno,1)) {return '组三'}
          if (allno[0]==allno[1] && allno[0]==allno[2]) {return '豹子'}
          return '组六'
        }
        var chksan2 = function(str) {
          if (str==null) {return '';  }
          var allno = str.split(',');
          allno = _.takeRight(allno, 4);
          allno = _.take(allno, 3);
          if (hasDuplicates(allno,1)) {return '组三'}
          if (allno[0]==allno[1] && allno[0]==allno[2]) {return '豹子'}
          return '组六'
        }
        var chksan3 = function(str) {
          if (str==null) {return '';  }
          var allno = str.split(',');
          allno = _.takeRight(allno, 3);
          if (hasDuplicates(allno,1)) {return '组三'}
          if (allno[0]==allno[1] && allno[0]==allno[2]) {return '豹子'}
          return '组六'
        }
        var chktwo = function(str) {
          if (str==null) {return '';  }
          var allno = str.split(',');
          allno = _.takeRight(allno, 2);
          return eval(allno.join("+"));
        }
        var chktwo1 = function(str) {
          if (str==null) {return '';  }
          var allno = str.split(',');
          allno = _.take(allno, 2);
          return eval(allno.join("+"));
        }
        var chkthree = function(str) {
          if (str==null) {return '';  }
          var allno = str.split(',');
          allno = _.take(allno, 3);
          return eval(allno.join("+"));
        }
        var chkthree1 = function(str) {
          if (str==null) {return '';  }
          var allno = str.split(',');
          allno = _.takeRight(allno, 4);
          allno = _.take(allno, 3);
          return eval(allno.join("+"));
        }
        var chkthree2 = function(str) {
          if (str==null) {return '';  }
          var allno = str.split(',');
          allno = _.takeRight(allno, 3);
          return eval(allno.join("+"));
        }
        if (textkey=="五星") {
          return chkdtwuxin;
        }
        if (textkey=="后四") {
          return chkdtsixin;
        }
        if (textkey=="前三") {
          return chksan1;
        }
        if (textkey=="前三和值") {
          return chkthree;
        }
        if (textkey=="中三") {
          return chksan2;
        }
        if (textkey=="中三和值") {
          return chkthree1;
        }
        if (textkey=="后三") {
          return chksan3;
        }
        if (textkey=="后三和值") {
          return chkthree2;
        }
        if (textkey=="二星") {
          return chktwo;
        }
        if (textkey=="后二") {
          return chktwo;
        }
        if (textkey=="前二") {
          return chktwo1;
        }
        return undefined
      }
      var hasDuplicates = function(a,len) {
        if (arguments.length > 2) {
          var chkeylen = arguments[2];
          var bc =_.countBy(a, _.identity);
          var maxsame = 0;
          for (var key in bc) {
            if (typeof bc[key] !== 'undefined') {
              if (bc[key]>maxsame) {
                maxsame = bc[key];
              }
            }
          }
          var allkeys = Object.keys(bc);
          if (arguments.length > 3) {
            return _.uniq(a).length !== a.length && chkeylen==maxsame && arguments[3]==allkeys.length && (a.length-_.uniq(a).length==len);
          }
          return _.uniq(a).length !== a.length && chkeylen==maxsame && (a.length-_.uniq(a).length==len);
        }
        return _.uniq(a).length !== a.length && (a.length-_.uniq(a).length==len);
      }
      //console.log(list,'listlistlist');
      if (list.length>0) {
        //console.log(list[0].code);
        if (list[0].code!=null) {
          if (list[0].code.length<13) {
            $('#lottery .lastopno,#basket .lastopno,#zuomainbox .lastopno').html('<em class="ball">'+String(list[0].code).replace(/,/g,'</em><em class="ball">')+'</em>');
          }else {
            if (list[0].code<16) {
              $('#lottery .lastopno,#basket .lastopno,#zuomainbox .lastopno').html(list[0].code);
            }else {
              $('#lottery .lastopno,#basket .lastopno,#zuomainbox .lastopno').html(String(list[0].code).substr(0,14)+'...');
            }

          }
        }else {
          $('#lottery .lastopno,#basket .lastopno,#zuomainbox .lastopno').html('开奖中...');
        }
      }
	    $.each(list, function(i, val) {
	        if (i == 0) {
	        	$LastIssue = val.issue;
	        	$CurrCode = val;
            //console.log('val',$CurrCode);
	            showOpenCode(val);
	        }
	        var item = $('<div class="item">');
	        item.append('<div class="expect">' + shortIssue(val.issue) + '</div>');
          var nowtopm = $('.lottery-betting .play-groups a.selected').text();
          if (val.code!=null) {
            item.append(formatCode(val.code, val.lottery,zutypemethod(nowtopm)));
          }else {
            item.append('<div class="code wait'+(typeof zutypemethod(nowtopm) !='undefined' ? '' : ' expand')+'">等待开奖</div>');
          }

          //console.log(zutypemethod(nowtopm));
          //console.log(nowtopm);
          if (typeof zutypemethod(nowtopm) !== 'undefined' && parseInt($('#topltname').attr('rel'),10)!=43 && parseInt($('#topltname').attr('rel'),10)!=47 && parseInt($('#topltname').attr('rel'),10)!=204) {
            item.append('<div class="zutype" rel="'+val.code+'">' + zutypemethod(nowtopm)(val.code) + '</div>');
          }else {
            item.append('<div class="zutype" rel="'+val.code+'" style="display:none;"></div>');
          }

	        item.find('.code .more').hover(function() {
	            clearTimeout($MoreTimer);
	            showOpenCode(val);
	        }, function() {
	            $MoreTimer = setTimeout(function() {
	                showOpenCode($CurrCode);
	            }, 300);
	        });
	        thisResultList.append(item);
	    });
      //console.log(thisResultList);
	}

	var BigNumber = function(smallAry) {
	    var smallGroupAry = [];
	    var bigStr;
	    var bigAry = [];
	    var bigExpAry = [];
	    for (var i = 0; i < smallAry.length / 4; i++) {
	        var small = [];
	        var v1 = smallAry[i * 4];
	        var v2 = smallAry[i * 4 + 1];
	        var v3 = smallAry[i * 4 + 2];
	        var v4 = smallAry[i * 4 + 3];
	        small.push(v1, v2, v3, v4);
	        var sum = parseInt(v1) + parseInt(v2) + parseInt(v3) + parseInt(v4);
	        var exp = '' + v1 + "+" + v2 + "+" + v3 + "+" + v4 + "=" + (sum);
	        var expHtml = '' + exp;
	        var length = expHtml.length;
	        expHtml = expHtml.substr(0, length - 1) + '<span style="color:yellow">' + expHtml.substr(length - 1, length) + '</span>';
	        var sumStr = '' + sum;
	        bigAry.push(sumStr.substr(sumStr.length - 1, sumStr.length));
	        bigExpAry.push(exp);
	        smallGroupAry.push(small);
	    }
	    return {
	        bigAry: bigAry,
	        bigExpAry: bigExpAry,
	        smallGroupAry: smallGroupAry
	    }
	}

	/**
	 * 显示开奖号码
	 */
	var timeouter = 0;
	var showOpenCode = function(data) {
      if (data.code!=null) {
        //data.code = '8,8,8,8,8'
        $('.onlymobilecode').html(data.code);
        if ($('.codeholder:visible').size()>0) {
          $('div[data-field="code"]').show();
          $('.codeholder').hide();
        }
        var prevcode = $('.lottery-open-code').find('[data-field="expect"]').data('now');
        //console.log(data.code==prevcode);
        if (typeof prevcode !='undefined' && data.code==prevcode) {
          //console.log('noneed');
          return false;
        }
        var formatCode = function(code) {
            var format = $('<ul>');
            var codes = code.split(',');
            for (var i = 0; i < codes.length; i++) {
                // 检测号码个数
                if ($Lottery.type == 1 || $Lottery.type == 2) {
                    if (i >= 5) break;
                }
                if ($Lottery.type == 3 || $Lottery.type == 4) {
                    if (i >= 3) break;
                }
                if ($Lottery.type == 5) {
                    if (i >= 20) break;
                }
                if ($Lottery.type == 6) {
                    if (i >= 10) break;
                }
                // 格式化开奖号码
                if ($Lottery.type == 6) {
                    format.append('<li class="r' + codes[i] + '"></li>');
                } else {
                    format.append('<li>' + codes[i] + '</li>');
                }
            }
            return format;
        }
        $('.lottery-open-code').find('[data-field="expect"]').data('now',data.code).html(data.issue);
        $('#lottery .lastopis,#basket .lastopis,#zuomainbox .lastopis').html((String(data.issue).indexOf('-')==-1 ? String(data.issue).substring(data.issue.length-3,data.issue.length) : String(data.issue).split('-')[1]));
        var animateRotateShow = function(els, code, location) {
	        var codes = code.split(',');
	        var speed = 400,
	            bwidth = 68,
	            tdelay = 0;
	        var show = function(code, location, time, delay) {
	            setTimeout(function() {
	                var item = $('<div class="item">');
	                item.html(code);
	                item.css({
	                    'left': '-' + bwidth + 'px',
	                    'animation': '0.5s linear 0s normal none infinite rotate'
	                });
	                item.animate({
	                    'left': location
	                }, time, 'linear', function() {
	                    item.attr('style', 'left: ' + location + 'px');
	                });
	                els.find('.rotate').append(item);
	            }, delay);
	        }
	        for (var i = 0; i < codes.length; i++) {
	            var thisCode = codes[codes.length - 1 - i];
	            var thisLocation = location[codes.length - 1 - i];
	            var time = (thisLocation + bwidth) / speed * 1000;
	            show(thisCode, thisLocation, time, tdelay);
	            tdelay += time;
	        }
	      }
        var lotteryOpenCode = $('.lottery-open-code').find('[data-field="code"]');

        // 滚动效果的
        if ($Lottery.shortName == 'hgssc' || $Lottery.shortName == 'BJPK10' || $Lottery.shortName == 'bjssc'|| $Lottery.shortName == 'twbgssc') {
            clearTimeout(timeouter);
            var lotteryOpenCode02 = lotteryOpenCode;
            lotteryOpenCode02.addClass('higher');
            /*lotteryOpenCode02.css({
                webkitFilter: 'url(#go1)',
                filter: 'url(#go1)'
            });*/
            //var smallStr = data.code.split('|')[1];
            //var smallAry = smallStr.split(',');

            //小号数据分组
            //var temp = BigNumber(smallAry);
            var allcode = String(data.code).split(',');
            var temp = {
              bigAry:allcode,
              smallGroupAry:allcode,
            }
            var smallGroupAry = temp.smallGroupAry;
            var bigAry = temp.bigAry;
            var bigExpAry = temp.bigExpAry;

            //生成小号html
            var smallul = '<ul class="small" style="display:none;">';
            for (var idx1 in smallGroupAry) {
                smallul += '<span class="wp1"><span class="wp2">';
                //smallGroupAry[idx1];
                //for (var idx2 in smallGroupAry[idx1]) {
                    smallul += '<li>' + smallGroupAry[idx1] + '</li>';
                //}
                smallul += '</span></span>';
            }
            smallul += '</ul>';

            //生成大号html
            var bigsul = "<ul class='big'>";
            for (var idx1 in bigAry) {
                //bigsul += '<li class="ball_'+bigAry[idx1]+'">' + bigAry[idx1] + '</li>';
                bigsul += '<li class="ball_'+bigAry[idx1]+'"></li>';
            }
            smallul += '</ul>';


            lotteryOpenCode02.empty();
            var tip = $("<div class='tip1'></div>");
            //lotteryOpenCode02.append(smallul);
            lotteryOpenCode02.append(bigsul);
            lotteryOpenCode02.append(tip);
            lotteryOpenCode02.append('<div style="clear:both;"></div>')
            //lotteryOpenCode02.find('li').hide();

            //入场
            var smallli = lotteryOpenCode02.find('.small li');
            /*smallli.removeClass("zoomIn animated");
            smallli.each(function(idx, obj) {
                setTimeout(function() {
                    $(obj).css('display', 'block').addClass("zoomIn animated")
                }, idx * 50);
            });*/
            var bigli = lotteryOpenCode02.find('.big li');
            var smallGroup = lotteryOpenCode02.find('.small .wp2');


            //大小球动画
            !! function() {
                timeouter = setTimeout(function() {
                    lotteryOpenCode02.removeAttr("style");
                }, 1000);
                smallGroup.each(function(idx, obj) {
                    setTimeout(function() {
                        //$(obj).css('display', 'block').removeClass().addClass("wp2 zoomOut animated");
                        // 	                    bigli.eq(idx).css({'visibility':'visible','display':'block'}).removeClass().addClass("li2 bounceIn animated");
                        bigli.eq(idx).css('display', 'block').removeClass().addClass("li2 bounceIn animated");

                        //$(obj).css('display','block').removeClass().addClass("wp2 zoomOut animated");
                        //$(obj).css('display','block').removeClass().addClass("wp2 bounceOut animated");

                        // $(obj).find('li').css('display','block').removeClass().addClass("wp2 bounceOut animated");
                        // setTimeout(function(){
                        // bigli.eq(idx).css('display','block').removeClass().addClass("li2 bounceIn animated");
                        // },500);


                        // $(obj).css('display','block').removeClass().addClass("wp2 flip animated");
                        // setTimeout(function(){$(obj).css('display','block').removeClass().addClass("wp2 zoomOut animated")},800);
                        // setTimeout(function(){bigli.eq(idx).css('display','block').removeClass().addClass("li2 zoomIn animated")},800);

                        // $(obj).css('display','block').removeClass().addClass("wp2 hinge animated");
                        // bigli.eq(idx).css('display','block').removeClass().addClass("li2 rollIn animated");
                    }, 1000 + idx * 200);
                });
            }()

            //大球悬停动画
            /*bigli.unbind();
            bigli.hover(function() {
                // $(this).removeClass().addClass("flipOutY animated");
                // smallGroup.eq($(this).index()).removeClass().addClass("wp2 flipInY animated");
                var ls = smallGroup.eq($(this).index()).find('li');
                var html = "";
                var sum = 0;
                ls.each(function(idx, ele) {
                    var txt = $(this).html();
                    if (idx == ls.length - 1) html += txt + "=";
                    if (idx != ls.length - 1) html += txt + "+";
                    sum += parseInt(txt);
                });
                html += sum;
                var length = html.length;
                html = html.substr(0, length - 1) + '<span style="color:yellow">' + html.substr(length - 1, length) + '</span>';
                tip.html(html);
            }, function() {
                // $(this).removeClass().addClass("flipInY animated");
                // smallGroup.eq($(this).index()).removeClass().addClass("wp2 flipOutY animated");
            });*/

        } else {
            lotteryOpenCode.html(formatCode(data.code));
            //入场
            var list = $('.lottery-open-code .code li');
            list.each(function(idx, obj) {
                setTimeout(function() {
              //$(obj).css('display', 'block').addClass("zoomIn animated"); bounceInLeft
            var s = 'zoomIn';
            $(obj).css('visibility', 'visible');
            //$(obj).attr('style','visibility: visible;');
                    $(obj).addClass(s+" animated");     //visibility: visible;
              //$(obj).css('display', 'inline-block')
                }, idx * 100);
            });

            lotteryOpenCode.removeClass('higher');
        }

      }else {
        $('.lottery-open-code').find('[data-field="expect"]').data('now','').html(data.issue);
        $('#lottery .lastopis,#basket .lastopis,#zuomainbox .lastopis').html((String(data.issue).indexOf('-')==-1 ? String(data.issue).substring(data.issue.length-3,data.issue.length) : String(data.issue).split('-')[1]));
        $('div[data-field="code"]').hide();
        $('.codeholder').show();
      }
	}

	var init = function(lottery) {
		$Lottery = lottery;
		loadData(true);
	}

	var flush = function(data) {
		if (data.issue != $LastIssue) {
			loadData(true);
		}
	}

	return {
		init: init,
		flush: flush
	}

}();

/**
 * 开奖通知
 */
var LotteryOpenNotice = function() {

	var loadData = function() {
		GameLotteryCtrl.pullOpenNotice({
			success: function(response) {
				if (response.error == 0) {
					handleData(response.data);
				}
			}
		});
	}

	// 播放声音
	var audio = function() {
		if($('.set-voice').find('.win').hasClass('audio-on')) {
			$('audio#lottery-open').remove();
			var audio = $('<audio id="lottery-open" autoplay="autoplay">');
			audio.attr('src', 'assets/global/audio/lottery-open.mp3').hide();
			$('body').append(audio);
		}
	}

	var handleData = function(data) {
		audio();
		var msg = '当前彩种：' + data.lottery + '<br/>';
		msg += '当前期号：' + data.issue + '<br/>';
		msg += '当期投注：' + data.money.toFixed(3) + '元<br/>';
		msg += '当期中奖：' + data.winMoney.toFixed(3) + '元<br/>';
		msg += '当期盈亏：' + data.profit.toFixed(3) + '元<br/>';
		App.tips('消息提示', msg, 8000);
	}

	var pull = function() {
		loadData();
	}

	return {
		pull: pull
	}

}();

//========================================================
//以下是通用的投注初始化相关的功能
//========================================================


//兼容手机版本样式
var QueryString = function() {
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
      query_string[pair[0]] = arr;
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return query_string;
}();


var initPartOne = function() {
  //AppLoop.init();
	//屏蔽右键
  //disableRightClick();
	//系统消息初始化
 	//UserSysMessage.init();
 	//隐藏或显示代理账户相关功能
 	//showOrNotShow();
	//初始化日期控件
 	initDatePicker();
 	//在线客服弹出框
 	kefu();
  //帮助
  $('.fhelp').off('click').on('click',function() {
    var titlechs = $(this).text();
    var topoff = parseInt($(this).attr('rel'),10);
    BootstrapDialog.show({
      title: titlechs,
      size:'size-wide',
      message: $('<div class="floathelpbox"></div>').load('/static/help/content.html'),
      onshown:function() {
        $('.floathelpbox').scrollTop(topoff);
      }
    });
  });

  //彩种左侧保存
  //getLeftSec();
  $('.w-order-list').unbind('click').click(function(){
    //$('.record-list .panels').toggle();
    $('.record-list .panels').slideToggle();
  });

  $('#saveMy').on('shown.bs.modal', function() {
    var ltssc=[],ltxuan=[],ltkuai=[],ltother=[];
    var otherdict = {}
    var allres = $('#top-lt-list').data('all');
    var allops = $('.lottery-navs ul').data('open');
    var chkon =  function(array,id) {
      if (typeof array !='undefined') {
        //console.log($.inArray(id,array),id,array);
        if ($.inArray(id,array)>-1) {
          return '<em class="m_ico m_on">&#xe6c9;</em>'
        }
      }
      return '<em class="m_ico">&#xe6c4;</em>'
    }
    for (i = 0; i < allres.length; i++) {
      if (String(allres[i].showName).indexOf('微信')==-1 && String(allres[i].showName).indexOf('经典')==-1 && String(allres[i].showName).indexOf('急速')==-1 && allres[i].id!='113' && allres[i].id!='110' && allres[i].id!='13' && allres[i].id!='12') {
        if (String(allres[i].code).indexOf('SSC')>-1 ) {
          otherdict[allres[i].id]=1;
          ltssc.push('<li class="m_change" rel="'+allres[i].id+'">'+chkon(allops,allres[i].id)+allres[i].showName+'</li>')
        }
        if (String(allres[i].code).indexOf('11Y')>-1 ) {
          otherdict[allres[i].id]=1;
          ltxuan.push('<li class="m_change" rel="'+allres[i].id+'">'+chkon(allops,allres[i].id)+allres[i].showName+'</li>')
        }
        if (String(allres[i].code).indexOf('K3')>-1 ) {
          otherdict[allres[i].id]=1;
          ltkuai.push('<li class="m_change" rel="'+allres[i].id+'">'+chkon(allops,allres[i].id)+allres[i].showName+'</li>')
        }
        if (typeof otherdict[allres[i].id] =='undefined') {
          ltother.push('<li class="m_change" rel="'+allres[i].id+'">'+chkon(allops,allres[i].id)+allres[i].showName+'</li>')
        }
      }
    }
    $('.savemylt .seccls[rel="ssc"] ul').html(ltssc.join(''));
    $('.savemylt .seccls[rel="xuan"] ul').html(ltxuan.join(''));
    $('.savemylt .seccls[rel="kuai"] ul').html(ltkuai.join(''));
    $('.savemylt .seccls[rel="other"] ul').html(ltother.join(''));
    var errormsg = new $.zui.Messager('最大收藏9个游戏', {
      //icon: 'bell' // 定义消息图标
    })
    $('.savemylt').off('click').on('click','.m_change',function() {
      //console.log($(this).attr('rel'));
      var route = 'addFavGame';
      var nowel = $(this);

      //console.log($(this).find('.m_on').size());
      if (nowel.find('.m_on').size()>0) {route = 'removeFavGame';}
      //console.log($('.lottery-navs ul').data('open'),'oppppppp');
      Api.getCommon(route,{lotteryId:$(this).attr('rel')},function(res) {
        //console.log(res);
        if (res.code=='0' && res.error=='0') {
          if (nowel.find('.m_on').size()>0) {
            nowel.find('.m_on').html('&#59247;');
            nowel.find('.m_on').removeClass('m_on')
          }else {
            nowel.find('.m_ico').html('&#59246;');
            nowel.find('.m_ico').addClass('m_on')
          }
          //getLeftSec();
        }else {
          errormsg.show();
        }
      })
    })
  });
  //固定菜单
  if (parseInt($('body').width(),10)>1200){
    //$('.lottery-navs').css({'left':(parseInt($('body').width(),10)-1200)/2,'position':'fixed'});
    //$('.lottery-open-list').css({'top':50,'right':(parseInt($('body').width(),10)-1200)/2,'position':'fixed'});
  }else {
    //$('.lottery-navs').css({'left':-110,'position':'absolute'});
    //$('.lottery-open-list').css({'top':0,'right':-245,'position':'absolute'});
  }
  //console.log(AppData.getMainAccount());
  if (typeof AppData !='undefined') {
    var udata = AppData.getMainAccount();
    if (typeof udata !='undefined') {
      var utyp = udata.type;
      if (utyp=='1') {
        $('#agent-top-nav').show();
      }
    }

  }
  //刷新余额
  $('.lotteryBalance .m_ico,.menu02 .m_refresh').click(function(){
    $('[data-field="lotteryBalance"],#will-sum01').html('刷新中...');
    Api.getCommon('getUserBalance',{}, function(resp) {
      if (resp == -1) {
        window.location.href = "/yx/home";
        return false;
      } else {
        //console.log(resp.data);
        if(typeof resp.data !== 'undefined'){
          var left=resp.data.lotteryBalance;
          setTimeout(function() {
            $('[data-field="lotteryBalance"]').html(left);
            $('[data-user-account-available]').html(left);
            $('#will-sum01').html(left);
          },300)

        }
      }
    });
  });
  var goTop = function() {
    $(window).scroll(function(e) {
      //若滚动条离顶部大于100元素
      if($(window).scrollTop()>100)
        $(".goTop").fadeIn(1000);//以1秒的间隔渐显id=gotop的元素
      else
        $(".goTop").fadeOut(1000);//以1秒的间隔渐隐id=gotop的元素
    });
  }

  //返回顶部
  $('.goTop').unbind('click').click(function(){
    $('body,html').animate({scrollTop:0},300);
  });
  goTop();
}

var initPartOne_Sec = function() {
  //AppLoop.init();
	//屏蔽右键
  //disableRightClick();
	//系统消息初始化
 	//UserSysMessage.init();
 	//隐藏或显示代理账户相关功能
 	showOrNotShow();
	//初始化日期控件
 	initDatePicker();
 	//在线客服弹出框
 	kefu();
  //帮助
  $('.fhelp').off('click').on('click',function() {
    var titlechs = $(this).text();
    var topoff = parseInt($(this).attr('rel'),10);
    BootstrapDialog.show({
      title: titlechs,
      size:'size-wide',
      message: $('<div class="floathelpbox"></div>').load('/static/help/content.html'),
      onshown:function() {
        $('.floathelpbox').scrollTop(topoff);
      }
    });
  });
  //getLeftSec();
  $('.w-order-list').unbind('click').click(function(){
    //$('.record-list .panels').toggle();
    $('.record-list .panels').slideToggle();
  });

  $('#saveMy').on('shown.bs.modal', function() {
    var ltssc=[],ltxuan=[],ltkuai=[],ltother=[];
    var otherdict = {}
    var allres = $('#top-lt-list').data('all');
    var allops = $('.lottery-navs ul').data('open');
    var chkon =  function(array,id) {
      if (typeof array !='undefined') {
        if ($.inArray(id,array)>-1) {
          return '<em class="icon m_ico m_on">&#xe6c9;</em>'
        }
      }
      return '<em class="icon m_ico">&#xe6c4;</em>'
    }
    for (i = 0; i < allres.length; i++) {
      if (String(allres[i].showName).indexOf('微信')==-1 && String(allres[i].showName).indexOf('经典')==-1 && String(allres[i].showName).indexOf('急速')==-1 && allres[i].id!='113' && allres[i].id!='110' && allres[i].id!='13' && allres[i].id!='12') {
        if (String(allres[i].code).indexOf('SSC')>-1 ) {
          otherdict[allres[i].id]=1;
          ltssc.push('<li class="m_change" rel="'+allres[i].id+'">'+chkon(allops,allres[i].id)+allres[i].showName+'</li>')
        }
        if (String(allres[i].code).indexOf('11Y')>-1 ) {
          otherdict[allres[i].id]=1;
          ltxuan.push('<li class="m_change" rel="'+allres[i].id+'">'+chkon(allops,allres[i].id)+allres[i].showName+'</li>')
        }
        if (String(allres[i].code).indexOf('K3')>-1 ) {
          otherdict[allres[i].id]=1;
          ltkuai.push('<li class="m_change" rel="'+allres[i].id+'">'+chkon(allops,allres[i].id)+allres[i].showName+'</li>')
        }
        if (typeof otherdict[allres[i].id] =='undefined') {
          ltother.push('<li class="m_change" rel="'+allres[i].id+'">'+chkon(allops,allres[i].id)+allres[i].showName+'</li>')
        }
      }
    }
    $('.savemylt .seccls[rel="ssc"] ul').html(ltssc.join(''));
    $('.savemylt .seccls[rel="xuan"] ul').html(ltxuan.join(''));
    if (ltkuai.length>0) {
      $('.savemylt .seccls[rel="kuai"] ul').html(ltkuai.join(''));
      $('.savemylt .seccls[rel="kuai"]').show();
    }else {
      $('.savemylt .seccls[rel="kuai"]').hide();
    }

    $('.savemylt .seccls[rel="other"] ul').html(ltother.join(''));
    //var errormsg = new $.zui.Messager('最大收藏9个游戏', {
      //icon: 'bell' // 定义消息图标
    //})
    $('.savemylt').off('click').on('click','.m_change',function() {
      //console.log($(this).attr('rel'));
      var route = 'addFavGame';
      var nowel = $(this);

      //console.log($(this).find('.m_on').size());
      if (nowel.find('.m_on').size()>0) {route = 'removeFavGame';}
      //console.log($('.lottery-navs ul').data('open'),'oppppppp');
      Api.getCommon(route,{lotteryId:$(this).attr('rel')},function(res) {
        //console.log(res);
        if (res.code=='0' && res.error=='0') {
          if (nowel.find('.m_on').size()>0) {
            nowel.find('.m_on').html('&#xe6c4;');
            nowel.find('.m_on').removeClass('m_on')
          }else {
            nowel.find('.m_ico').html('&#xe6c9;');
            nowel.find('.m_ico').addClass('m_on')
          }
          //console.log(typeof getLeftSec);
          typeof getLeftSec !='undefined' && getLeftSec();
        }else {
          alert('最大收藏9个游戏');
          //errormsg.show();
        }
      })
    })
  });
  //固定菜单
  if (parseInt($('body').width(),10)>1200){
    //$('.lottery-navs').css({'left':(parseInt($('body').width(),10)-1200)/2,'position':'fixed'});
    //$('.lottery-open-list').css({'top':50,'right':(parseInt($('body').width(),10)-1200)/2,'position':'fixed'});
  }else {
    //$('.lottery-navs').css({'left':-110,'position':'absolute'});
    //$('.lottery-open-list').css({'top':0,'right':-245,'position':'absolute'});
  }
  //console.log(AppData.getMainAccount());
  if (typeof AppData !='undefined') {
    var udata = AppData.getMainAccount();
    if (typeof udata !='undefined') {
      var utyp = udata.type;
      if (utyp=='1') {
        $('#agent-top-nav').show();
      }
    }

  }
  //刷新余额
  $('.lotteryBalance .m_ico,.menu02 .m_refresh').click(function(){
    $('[data-field="lotteryBalance"],#will-sum01').html('刷新中...');
    Api.getCommon('getUserBalance',{}, function(resp) {
      if (resp == -1) {
        window.location.href = "/yx/home";
        return false;
      } else {
        //console.log(resp.data);
        if(typeof resp.data !== 'undefined'){
          var left=resp.data.lotteryBalance;
          setTimeout(function() {
            $('[data-field="lotteryBalance"]').html(left);
            $('[data-user-account-available]').html(left);
            $('#will-sum01').html(left);
          },300)

        }
      }
    });
  });
  var goTop = function() {
    $(window).scroll(function(e) {
      //若滚动条离顶部大于100元素
      if($(window).scrollTop()>100)
        $(".goTop").fadeIn(1000);//以1秒的间隔渐显id=gotop的元素
      else
        $(".goTop").fadeOut(1000);//以1秒的间隔渐隐id=gotop的元素
    });
  }

  //返回顶部
  $('.goTop').unbind('click').click(function(){
    $('body,html').animate({scrollTop:0},300);
  });
  goTop();
}

//游戏数据
var GameData = function() {

  var info; // 游戏信息
	var method; // 玩法规则
  var methodTreeLst=[]; // 玩法细类列表
  var methodLst=[]; // 玩法列表
	var config; // 配置信息
  var thisgame = this;

	var init = function(name) {
		var cbfun;
    if (arguments.length > 1){
      cbfun = arguments[1]
    }
    var options = {};
		options.url = Route.DOMAIN + Route.PATH + Route.WebAjax.PATH + Route.WebAjax.INIT_GAME_LOTTERY;
		options.data = { name: name };
		options.async = false;
		options.success = function(response) {
      //console.log('GAMEDATA');
      methodLst=[]
      methodTreeLst = [];
      var ptitle = $('lottery .now_lottery', window.parent.document);
      if (typeof ptitle !='undefined') {
        if (ptitle.html()=='') {
          ptitle.html(response.data.info.showName);
        }
      }
			if (response.error == 0) {
				var data = response.data;
				info = data.info;
        info.id = name;
        //$('#topltname i.first').html(info.showName);
				method = data.method;
        for (a in method) {
          var shortname = method[a].name.substr(0,3);
          var longname = method[a].name;
          //console.log(shortname,longname);
          if (String(method[a].name).indexOf('3D')>-1) {
            shortname = String(method[a].name).replace('3D','').substr(0,5);
          }

          if (shortname.indexOf('前四')>-1 && shortname.length==2) {
            shortname = '前四';
          }
          if (String(info.shortName)=='BJPK10') {
            shortname = String(method[a].name).substr(0,5);
          }
          if (String(info.shortName).indexOf('11Y')>-1) {
            shortname = String(method[a].name).substr(0,5);
          }
          if (shortname.indexOf('五星')>-1) {
            shortname = '五星';
          }
          if (shortname.indexOf('不定胆')>-1) {
            shortname = '不定胆';
          }
          if (shortname.indexOf('前二')>-1 || shortname.indexOf('后二')>-1 || shortname.indexOf('二星后')>-1 || shortname.indexOf('二星前')>-1) {
            shortname = ((String(method[a].name).indexOf('3D')>-1 || String(info.shortName).indexOf('11Y')>-1) ? '二码': '二星');
            if (String(info.shortName)=='BJPK10') {
              shortname ='前二';
            }
          }
          if (shortname.indexOf('任选')>-1) {
            shortname = '任选';
          }
          if (shortname.indexOf('单式任')>-1) {
            shortname = '任选';
          }
          if (shortname.indexOf('大小')>-1) {
            shortname = '大小';
          }
          if (shortname.indexOf('单双')>-1) {
            shortname = '单双';
          }
          if (shortname.indexOf('组选组六')>-1 || shortname.indexOf('组选组三')>-1) {
            shortname = (String(method[a].name).indexOf('3D')>-1 ? '三码': '三星');
          }
          if (shortname.indexOf('后三')>-1 && longname.indexOf('不定胆')==-1) {
            shortname = '后三';
          }
          if (longname.indexOf('不定胆')>-1) {
            shortname = '不定胆';
          }
          if (shortname.indexOf('定位胆')>-1) {
            shortname = '定位胆';
          }
          if (shortname.indexOf('前三')>-1) {
            shortname = '前三';
            if (String(info.shortName).indexOf('11Y')>-1) {
              shortname ='三码';
            }
          }
          if (shortname.indexOf('后四')>-1 && longname.indexOf('不定位')==-1) {
            shortname = '后四';
          }
          if (shortname.indexOf('猜1个')>-1) {
            shortname = '猜中位';
          }
          if (shortname.indexOf('猜前四')>-1) {
            shortname = '前四';
          }
          if (shortname.indexOf('猜前五')>-1) {
            shortname = '前五';
          }
          if (shortname.indexOf('龙虎和')>-1 || shortname.indexOf('龙虎1')>-1 || shortname.indexOf('龙虎2')>-1 || shortname.indexOf('龙虎3')>-1 || shortname.indexOf('龙虎4')>-1 || shortname.indexOf('龙虎5')>-1) {
            shortname = '龙虎';
          }
          if (shortname.indexOf('趣味三')>-1 || shortname.indexOf('趣味二')>-1 || shortname.indexOf('趣味一')>-1 || shortname.indexOf('趣味四')>-1 || shortname.indexOf('趣味好')>-1) {
            shortname = '趣味';
          }
          if (shortname.indexOf('冠军')>-1) {
            shortname = '前一';
          }
          if (shortname.indexOf('中三')>-1) {
            shortname = '中三';
          }
          if (shortname.indexOf('四星')>-1) {
            shortname = '后四';
          }
          if (String(method[a].name).indexOf('大小单双')>-1) {
            shortname = '大小单双';
          }
          methodTreeLst.push(a);
          if ($.inArray(shortname,methodLst)==-1) {
            methodLst.push(shortname);
          }
        }
				config = data.config;
        if (typeof cbfun =='function') {
          cbfun(config,thisgame);
        }
			}
      //console.log(methodLst,'methodTreeLstmethodTreeLstmethodTreeLst');
		};
		HttpRequest(options);
	};

	return {
		init: init,
		getInfo: function() {
			return info;
		},
		getMethod: function() {
			return method;
		},
		getMethods: function() {
			return methodTreeLst;
		},
		getMethodList: function() {
			return methodLst;
		},
		getConfig: function() {
			return config;
		}
	}

}();

var setLogo = function() {
  //$('.last-time').show().addClass('animated flash');
	var allgdata = GameData.getInfo();
  var showName = GameData.getInfo().showName;
	var shortName = GameData.getInfo().shortName;
  //console.log('GameData.getInfo()',allgdata);
	var lotteryType = GameData.getInfo().type;
	var description = GameData.getInfo().description;
	var lot = $("<div class='lot'>");
  var siteurl ='/static/help.html#game';
  if (typeof appConfig().officalsite[showName] !='undefined') {
    siteurl = appConfig().officalsite[showName];
    //console.log(appConfig().officalsite[showName]);
  }
	var wrapper1 = $('<div class="wrapper"><div class="logo animated flash"></div><div class="nav"><a href="#" class="lottery-code-trend" target="_blank"><em class="icon">&#xe69e;</em>走势图</a><a href="'+siteurl+'" target="_blank"><em class="icon">&#xe68d;</em>彩票官网</a></div></div>');
	var wrapper2 = $('<div class="wrapper">');
  //console.log(appConfig().officalsite[String(showName)],'sssssssssssssssss',appConfig().officalsite,showName);
  //console.log(showName);

	lot.append(wrapper1);
  if ($('.lottery-open .lot').size()==0) {
    $('.lottery-open').prepend(lot);
  }else {
    $('.lottery-open .lot').remove()
    $('.lottery-open').prepend(lot);
  }

  //console.log(shortName,'shortNameshortNameshortName');
	$('.lottery-open').find('.logo').addClass(shortName.toLowerCase().replace('30','2').replace(/[0346789]/g, ""));


 	$('title').html(showName);
 	$('.lottery-nav .menu .title span:eq(0)').text(showName);

	if(lotteryType==1 && shortName.indexOf("min")==0){
		$('.lottery-open').find('.logo').addClass('logo0');
	}else{
		$('.lottery-open').find('.logo').addClass('logo'+lotteryType);
	}

	$('.lottery-nav').append('<a class="will-back" href="/game-center.html">返回彩票大厅</a>');

  //console.log(allgdata.id,$('.mylt_'+allgdata.id).size());
  LotteryTrend.init(shortName,allgdata.id,allgdata.showName);

	$('.lottery-nav .title').append('<span class="lot-desc">' + (description ? description : '')+'</span>');

	//彩票温馨提示生成:早上10:00 - 晚上22:00（72期）10分钟一期，晚上22:00 - 凌晨02:00（48期）5分钟一期
	!function(){
		$('.account-info').empty();
		if(GameData.getInfo().description){
			$('.account-info').html('温馨提示：'+GameData.getInfo().description);
		}
		var tips = $('<div class="tips aaa"><i></i>彩票温馨提示</div>');
		wrapper2.append(tips);


		lot.append(wrapper2);
		$('.lottery-nav .menu .title span').text(showName);
	};

	!function(){
	//彩票
	var calculate = function(fixedMoney){
    //var input = $('<input type="text" name="fixedMoney" />');
    //$('.lottery-record > .button').prepend(input);

		var getPostion = function (fixed){
			var fixedStr = fixed+'';
			if(fixedStr.indexOf('.')<0) return 0;
			return (fixedStr.length-fixedStr.indexOf('.')-1)
		}

      //input.change(function(){
		  var num = parseInt($('.play-options [data-field="num"]').html());
		  var money = num*GameData.getConfig().sysUnitMoney;

      //var fixedMoney = parseFloat($('.lottery-record [name="fixedMoney"]').val());
		  var fixed = fixedMoney/money          //   90/6 = 15 9/6=1.5
		  if(fixed>10000) fixed =parseInt(fixed);
		  var fixedStr = fixed+'';          //   90/6 = 15 9/6=1.5
		  var pos = getPostion(fixed);
		  if(getPostion(fixed)>3) fixedStr=fixed.toFixed(3)+'';
		  var newMultiple = fixedStr.replace(/^[0\.]+|\./g,'');
		  var newModel = getPostion(fixed);

		  $('.play-options [name="multiple"]').val(newMultiple);
		  $('.play-options [name="multiple"]').trigger("keyup");
		  $('.play-options .model a').eq(newModel).click();
      //});
	}

	//弹出框
	var button = $('<input type="button" name="fixedMoney" value="快速投注"/>');
  //$('.lottery-record > .button').prepend(button);
	button.click(function(){
		var num = parseInt($('.play-options [data-field="num"]').html());
		if(num==0) return;
		var $doc = $('<div id="quick-bet">\
					<div>提示：您只需要输入金额，系统会自动计算倍数</div>\
					<div class="amounts">\
						<span>100元</span><span>100元</span><span>100元</span><span>100元</span>\
						<span>100元</span><span>100元</span><span>100元</span><span>100元</span>\
						<span>100元</span><span>100元</span><span>100元</span><span><input type="text" name="fixedMoney"/>元</span>\
					</div>\
					<div><span id="submit">确定投注</span></div>\
				</div>');
		$doc.find('.amounts span').click(function(){
			$(this).addClass('selected').siblings().removeClass('selected');
		});
		var box = Will.initBox('<i class="icon lock"></i>快速投注<span class="title-sm"></span>', $doc,550,230);
		$doc.find('#submit').click(function(){
			box.close();
			var selected;
			var $input = $doc.find('.selected input');
			if($input.val()==''){
				return;
			}
			if($input.size()==0) {
				selected = parseInt($doc.find('.selected').html());
			}else{
				selected = $input.val();
			}
			calculate(selected);
		});
	});
 }();

 //
 $(".lottery-nav .menu .list").append('<a class="close">×</a>');
 $(".lottery-nav .menu .title").click(function(){
		//$(this).next().stop().slideToggle();
 });
 $(".lottery-nav .menu .list .close").click(function(){
	 $(this).parent().slideUp();
 });
 var hoverTimer;
 $(".lottery-nav .menu .list").on('mouseout',function(){
  hoverTimer = setTimeout(function() {
    $('.lottery-nav .list:visible').slideUp();
  },500)
 });

 $(".lottery-nav .menu .list").on('mouseover',function(){
  clearTimeout(hoverTimer);
 });

 $('.page-container').on('click',function(ev) {
   if ($(".lottery-nav .title").length>0) {
     if (!$.contains($(".lottery-nav .title")[0],$(ev.target)[0]) && !$.contains($(".lottery-nav .list")[0],$(ev.target)[0]) && $('.lottery-nav .list:visible').size()>0) {
       $('.lottery-nav .list:visible').slideUp();
     }
   }
 })

 var issupzuo = function(id) {
    if ($.inArray(id,[11,46,151,911,161,119,711,6,811,191,200,601,201,51,202,203])>-1) {
      return true;
    }
    return false;
  }
  if (!issupzuo(GameData.getInfo().id)) {
    //$(".button").find('[data-command="generate"]').hide();
  }else {
    //$(".button").find('[data-command="generate"]').show();
  }
}

/**
 * 自动初始化
 */
var init_two = function() {
  var locSearch = window.location.pathname;
  var hashlid = $('#hashlid').text();
  //console.log(hashlid,$('#hashlid').text(),'$(#hashlid).text()$(#hashlid).text()$(#hashlid).text()');
	if(locSearch) {
    //		var a = 'http://127.0.0.1/hz/hbs/lottery/1.html';
		var a = locSearch;
		var reg = /\/\d+\.html/;
		var test = a.match(reg);
    if (test != null) {
      var reg1 = /\d+/;
      var lotteryId = test[0].match(reg1)[0];
      //var name = locSearch.substring(1);
      //console.info('AAAAAAAAAA');
      GameData.init(lotteryId);
    }else {
      if (typeof QueryString !='undefined' && typeof QueryString.lid !== 'undefined') {
        //console.info('BBBBBBBBB');
        GameData.init(QueryString.lid);
      }else {
        //console.info('CCCCCCCCCCC');
        GameData.init(hashlid,function(a,b){
          setLogo();
        });
      }
    }

	} else {
		//window.location.href = '/404.html';
	}
}


//$(document).ready(function() {
var init_one =function() {
  //console.log(GameData.getInfo());
	var lotteryInfo = GameData.getInfo();
	var lotteryMethod = GameData.getMethod();
	var lotteryConfig = GameData.getConfig();
	var lotteryName = typeof GameData.getInfo() !='undefined' ? GameData.getInfo().showName : false;
	var lotteryShortName = typeof GameData.getInfo() !='undefined' ? GameData.getInfo().shortName : false;
	var lotteryType = typeof GameData.getInfo() !='undefined' ? GameData.getInfo().type : false;
  var lotteryId = typeof GameData.getInfo() !='undefined' ? GameData.getInfo().id : false;
  //console.log('init_one',typeof RecordList);

	LotteryPlan.init(lotteryShortName);

	// 初始化彩票玩法
  if (typeof LotteryMain !='undefined') {
    //console.log('LotteryMainLotteryMainLotteryMain');
    LotteryMain.init({
      lottery: lotteryInfo.shortName,
      downCode: lotteryInfo.downCode,
      fenDownCode: lotteryInfo.fenDownCode,
      liDownCode: lotteryInfo.liDownCode,
      sysBaseCode:lotteryConfig.baseBetCode,
      method: lotteryMethod,
      //sysCode: (lotteryConfig.sysCode > lotteryConfig.maxBetCode ? lotteryConfig.maxBetCode : lotteryConfig.sysCode),
      sysCode: lotteryConfig.sysCode,
      sysUnitMoney: lotteryConfig.sysUnitMoney,
      userCode: (AppData.getLotteryAccount().code > lotteryConfig.maxBetCode ? lotteryConfig.maxBetCode : AppData.getLotteryAccount().code),
      userLp: AppData.getLotteryAccount().point
    });
    //console.log(typeof RecordList,'RecordListRecordListRecordList');
    // 投注记录
    typeof RecordList !='undefined' && RecordList.init();
    // 开奖信息
    LotteryOpenTime.init(lotteryInfo);
    // 开奖号码
    LotteryOpenCode.init(lotteryInfo);
    //LotteryTrend.init(lotteryShortName,lotteryId,lotteryName);
    // 	AppLoop.init();
    AppLoop.push({
      key: 'PlayLottery',
      lottery: lotteryInfo.shortName
    }, function(res) {
      var thisData = res.PlayLottery;
      if (thisData) {
        if (thisData.openCode) {
          LotteryOpenCode.flush(thisData.openCode);
        }
        if (thisData.hasNewNotice) {
          // 拉取盈亏消息
          //LotteryOpenNotice.pull();
          // 刷新订单
          //RecordList.init();
        }
      }
    });
  }

	//WebQQ.init();//聊天插件
  setTimeout(function() {
    var ptitle = $('lottery .iframebox', window.parent.document);
    ptitle.height($('body .page-content').height());
  },400)
  //});
  typeof Api !='undefined' && Api.getCommon('onlineLotterys',{t:new Date().getTime()},function(res) {
    allres = res.data;
    //console.log('onlineLotterysonlineLotterysonlineLotterys',allres);
    $('#top-lt-list').data('all',allres);
    //console.log($('#top-lt-list').data('all'));
    getLeftSec();

  });

  setToggle();
}

//购物篮临时存储
var BasketLtChoose = [];
//========================================================
//以下是通用的投注相关的功能
//========================================================
var init_three = function() {
  $('body').on('click',function(e) {
    if (typeof $('.quickgo', window.parent.document) !='undefined') {
      if (typeof $('.quickgo', window.parent.document).attr('shown') !='undefined') {
        if (typeof window.parent !='undefined') {
          window.parent.toggleLeftBar()
        }
      }
    }
  });
  var shortName = '';
  if (typeof GameData.getInfo() !='undefined') {
    shortName = GameData.getInfo().shortName.toLowerCase().replace(/[0-9]/g, "");
  }
  //alert(shortName);
  $('.ltp .openzone').attr('rel',shortName);
  $('.ltp .openzone').addClass(shortName);
	!function(){//增加+-号控制倍数按钮
		$('.lottery-betting .multiple .addm').size()==0 && $('.lottery-betting .multiple').append('<span class="addm">+</span>');
		$('.lottery-betting .multiple .subm').size()==0 && $('.lottery-betting .multiple').prepend('<span class="subm">-</span>');
		$('.lottery-betting .multiple .addm').off("click").on("click",function(){
			var event = $.Event("keydown");
			event.keyCode = 38;
			$(this).prev().trigger(event);
			$(this).prev().trigger("keyup");
		});
		$('.lottery-betting .multiple .subm').off("click").on("click",function(){
			var event = $.Event("keydown");
			event.keyCode = 40;
			$(this).next().trigger(event);
			$(this).next().trigger("keyup");
		});
	}();

	!function(){//行前序号
		$('.lottery-betting').delegate('[data-command="add"]',"click",function(){
 			var $trs = $('.lottery-record tr');
			$trs.each(function(){
				$(this).find('.content').prepend($(this).index()+1);
			});
		});
	}();
	if ($('.lottery-record .total .total-inner').size()==0) {
  $('.lottery-record .total').append([
    //'<div class="total">第<span data-field="global-expect">00000000</span>期投注截止时间  <span data-field="global-last-time">00:00:00</span>  &nbsp;&nbsp;订单总计 <span data-field="sum-order">0</span> 个  &nbsp;&nbsp;总注数 <span data-field="sum-num">0</span> 注  &nbsp;&nbsp;总金额 ¥ <span data-field="sum-money">0</span> 元</div>'
    //'<div class="total">订单总计 <span data-field="sum-order">0</span> 个  &nbsp;&nbsp;总注数 <span data-field="sum-num">0</span> 注  &nbsp;&nbsp;总金额 ¥ <span data-field="sum-money">0</span> 元</div>'
    '<div class="total-inner"><h5>总注数</h5><span data-field="sum-num">0</span>注<h5 class="nextlines">总金额</h5> ¥<span data-field="sum-money">0</span>元</div>'
    ].join('')
  );
  }

	var sumAll = function(){//计算总注数总金额
		if(!$('.lottery-record')) return;
		var mul = 0;
		var num = 0;
		var total = 0;
		var domNum = $('.lottery-record .list .nandm');
		domNum.each(function(){
			 num=compt.add(num,parseFloat($(this).attr('rel')));
		});
		$('.lottery-record .list .total').each(function(){
      total=compt.add(total,parseFloat($(this).text()));
		});
		$('[data-field="sum-order"]').text(domNum.size());
		$('[data-field="sum-num"],#basket .totaldeal').text(num);
		$('[data-field="sum-money"],#basket .totaldealamount').text(total.toFixed(3));
    //console.log(domNum.size(),num,total.toFixed(3));
		setTimeout(sumAll,500);
	};
	if($('[data-field="sum-num"]').size()>0){
    sumAll();
  }

	if (typeof LotteryMain !='undefined') {
  //投注列表的倍数修改和模式修改
	LotteryMain.addCallback(function() {
		var $tr = $('.lottery-record tr:last-child');
		if($tr.data('initialized')) return ;
		var $mul = $tr.find('.multiple')
		var mulHtml = $tr.find('.multiple').html();
		var $mulInput = $('<input name="multiple" type="text" value="'+parseInt(mulHtml) +'">');
		$mulInput.after('<span>倍</span>');
		$mul.html($mulInput);
		$mul.append('<span>倍</span>');
		var blist = LotteryMain.bList();
		var data = blist[$tr.index()];

		var strVar = "";
		strVar += "<select>";
		strVar += "        <option value='yuan'>元<\/option>";
		strVar += "        <option value='jiao'>角<\/option>";
		strVar += "        <option value='fen'>分<\/option>";
		strVar += "        <option value='li'>厘<\/option>";
		strVar += "<\/select>";
		var $select = $(strVar);
		$select.val(data.model);
		$tr.find('.multiple').after($select);
		$select.wrap("<td></td>");

		$mulInput.blur(function() {//倍数输入事件
			{//格式
				if($(this).val() == '') return;
				var val = $(this).val();
				if(/^[0-9]*$/.test(val)) {
					val = Number(val);
					if(val > 10000) $(this).val(10000);
					if(val < 1) $(this).val(1);
				} else {
					$(this).val(1);
				}
			}
			{//计算
				var oldMul=data.multiple;
				var newMul=$(this).val();
				data.multiple=newMul;
				var $total = $(this).parent().nextAll('.total');

  			//$total.html((parseInt($total.html())/oldMul*newMul).toFixed(3) + '元');
				$total.html(compt.mul(compt.div(parseFloat($total.html()),oldMul),newMul).toFixed(3) + '元');
			}
		});

		$select.change(function(){
			var model = $(this).val();
			var scale = 1;
			var oldScale = m2s(data.model);
			var newScale = m2s(model);
			data.model = model;
			var $total = $(this).parent().nextAll('.total');
      //$total.html((parseInt($total.html())/oldScale*newScale).toFixed(3) + '元');
			$total.html(compt.mul(compt.div(parseFloat($total.html()),oldScale),newScale).toFixed(3) + '元');

			function m2s(model){
				var scale = 1;
				if(model == 'yuan') { scale = 1; }
				else if(model == 'jiao') { scale =  0.1; }
				else if(model == 'fen') { scale =  0.01; }
				else if(model == 'li') { scale = 0.001; }
					return scale;
				}
			});
			$tr.data('initialized',true);
	});
  }

	//一键投注
	$(".button").find('[data-command="quick"]').off('click').click(function(){
		/*if($('[data-injection="order-list"]').bootstrapTable('getData').length){
			App.alert('warning', '提示消息', "请先完成购彩栏中的订单，如没有完成不能快速投注！");
			return ;
		}*/
		var num = parseInt($('.play-options [data-field="num"]').html());
		if(num==0) {
			App.alert('warning', '提示消息', "您还没选择号码！");
			return;
		}
    //$('[data-command="clear"]').click();

    var unitMoney = 1; // 单倍投注金额
    var maxMultiple = 99999; // 最大投注限额
    var modelPoint = function() {
      var points ={
        'yuan':1,'jiao':0.1,'fen':0.01,'li':0.001
      }
      return points[$('.model a.selected').data('val')]
    }
    var calculate = function(num, amount, multi) {
      var unitAmountYuan = num * unitMoney; // 单倍元模式投注金额
      var result;
      //console.log(amount,unitAmountYuan,'calculatecalculatecalculatecalculate');
      //amount = amount/parseInt($('.play-options [name="multiple"]').val(),10);
      if (amount >= unitAmountYuan) {
        var multiple = parseInt(amount / unitAmountYuan);
        var total = unitAmountYuan * multiple;
        if (multiple <= maxMultiple) {
          result = {
            model: 'yuan',
            multiple: multiple==1 ? (multi>maxMultiple ? maxMultiple : multi) : multiple,
            total: total
          };
        }
      }
      var unitAmountJiao = unitAmountYuan * 0.1; // 单倍角模式投注金额
      //console.log(amount,unitAmountJiao,amount >= unitAmountJiao);
      if (amount >= unitAmountJiao) {
        var multiple = parseInt(amount / unitAmountJiao);
        var total = unitAmountJiao * multiple;
        var isReplace = true;
        //console.log(multiple <= maxMultiple);
        if (multiple <= maxMultiple) {
          if (result) {
            if (total - result.total <= 1) {
              isReplace =  false;
            }
          }
          if (isReplace) {
            result = {
              model: 'jiao',
              multiple: multiple==1 ? (multi>maxMultiple ? maxMultiple : multi) : multiple,
              total: total
            };
            //console.log(result,'jiao');
          }
        }
      }
      var unitAmountFen = unitAmountJiao * 0.1; // 单倍分模式投注金额
      unitAmountFen = new Number(unitAmountFen).toFixed(2);
      //amount = new Number(amount).toFixed(2);
      //console.log(amount >= unitAmountFen,amount,unitAmountFen);
      if (parseFloat(amount) >= parseFloat(unitAmountFen)) {
        var multiple = parseInt(amount / unitAmountFen);
        var total = unitAmountFen * multiple;
        var isReplace = true;
        //console.log(multiple <= maxMultiple);
        if (multiple <= maxMultiple) {
          if (result) {
            if (total - result.total <= 0.1) {
              isReplace =  false;
            }
          }
          if (isReplace) {
            result = {
              model: 'fen',
              multiple: multiple==1 ? (multi>maxMultiple ? maxMultiple : multi) : multiple,
              total: total
            };
          }
        }
      }
      var unitAmountLi = unitAmountFen * 0.1; // 单倍厘模式投注金额
      //amount = new Number(amount).toFixed(2);
      //unitAmountLi = new Number(unitAmountLi);
      unitAmountLi = new Number(unitAmountLi).toFixed(3);
      //console.log(amount,unitAmountLi);
      if (amount >= unitAmountLi) {
        var multiple = parseInt(amount / unitAmountLi);
        var total = unitAmountLi * multiple;
        var isReplace = true;
        if (multiple <= maxMultiple) {
          if (result) {
            if (total - result.total <= 0.01) {
              isReplace =  false;
            }
          }
          //console.log(isReplace,multiple);
          if (isReplace) {
            result = {
              model: 'li',
              multiple: multiple==1 ? (multi>maxMultiple ? maxMultiple : multi) : multiple,
              total: total
            };
          }
        }
      }
      var newModel;
      //console.log(result);
      if(result.model=="yuan") newModel = 0;
      if(result.model=="jiao") newModel = 1;
      if(result.model=="fen") newModel = 2;
      if(result.model=="li") newModel = 3;
      //console.log(result.multiple,'result.multipleresult.multipleresult.multiple');
      $('.play-options [name="multiple"]').val(result.multiple);
      $('.play-options [name="multiple"]').trigger("keyup");
      $('.play-options .model a').eq(newModel).click();
      //$('[data-injection="order-list"]').bootstrapTable("removeAll");
      $('.btn-big[data-command="submit"]').attr('quick','1').click();
      //$('[name="multiple"]').val(1);
    }

    var amount = num*unitMoney*parseFloat(modelPoint());
    var chkamount = amount*parseInt($('.play-options [name="multiple"]').val(),10);
    //console.log(amount,chkamount,'chkamountchkamountchkamountchkamount');
    /*if (chkamount<0.01) {
      App.alert('warning', '提示消息', "使用厘模式进行投注，单注注单最小金额为0.01元！");
      return;
    }*/
    //console.log(amount,'amount',parseInt($('.play-options [name="multiple"]').val(),10));
    calculate(num,amount,parseInt($('.play-options [name="multiple"]').val(),10));

	});
}
