//收件箱详细弹出框
var PopMessageDetail = function(){
		//收件箱-详细DOM
	var initDoc = function(type, data) {
		var formatUserLabel = '';
		var formatUserValue = '';
		var formatActions = '';
		if('inbox' == type) {
			formatUserLabel = '发件人';
			formatUserValue = data.createUser;
			var replyUrl = '';
			if (data.type == 0) {
				if (data.isFromUp) {
					replyUrl += '#page=1&target=up';
					formatUserValue = '上级';
				} else {
					replyUrl += '#page=1&target=down&username=' + data.fromAccount;
				}
			}
			if (data.type == 2) {
				replyUrl += '#page=1&target=admin';
				formatUserValue = '管理员';
			}
      formatActions = '';
			//formatActions = '<input data-url="' + replyUrl + '" name="reply" type="button" class="button" value="回复"/>';
			if (data.type == 1) {
				formatActions = '';
				formatUserValue = '系统';
			}
		}

    var cleanHtml = function(str) {
      var text = $("<span />", { html: str }).text();
      text = text.replace(/<\/?[^>]*>/g,'');
      return text;
    }
		var innerHtml =
		'<div id="MessageDetails" class="manager">'+
			'<div class="modal-float">'+
				'<div class="form">'+
					'<table class="form-control-float">'+
						'<tbody>'+
							'<tr>'+
								'<td class="label-sm">' + formatUserLabel + '：</td>'+
								'<td class="value">' + formatUserValue + '</td>'+
							'</tr>'+
							'<tr>'+
								'<td class="label-sm">主题：</td>'+
								'<td class="value">' + data.title + '</td>'+
							'</tr>'+
							'<tr class="textarea">'+
								'<td class="label-sm align-top">消息内容：</td>'+
								'<td class="value">'+
									'<textarea readonly="readonly" class="form-control message">' + cleanHtml(data.content) + '</textarea>'+
								'</td>'+
							'</tr>'+
							'<tr class="actions">'+
								'<td class="label-sm"></td>'+
								'<td class="value">'+
									'<div class="button-groups">'+
										formatActions +
										'<input data-id="' + data.userMessageId + '" name="delete" type="button" class="button" value="删除"/>'+'<a href="/userMessage#page=1_message" ref="/yx/hbs/manager-message.html?replay=1&nick='+formatUserValue+'#page=1" onclick="$(\'.jBox-closeButton\').click()"><input data-name="' + formatUserValue + '" name="replay" type="button" class="button" value="回复"/></a>'+
										'<input name="cancel" type="button" class="button" value="关闭"/>'+
									'</div>'+
								'</td>'+
							'</tr>'+
						'</tbody>'+
					'</table>'+
				'</div>'+
			'</div>'+
		'</div>';
		return innerHtml;
	}
	//收件箱-详细页面的事件
	var initEvent = function(type, callback) {
		var thisContent = $('#MessageDetails');
		thisContent.find('input[name="delete"]').click(function() {
			var box = Will.getBox();if(box) box.close();
			var id = $(this).attr('data-id');
			del(thisContent, type, [id].toString()+',', callback);
		});
		thisContent.find('input[name="reply"]').click(function() {
			var box = Will.getBox();if(box) box.close();
			window.location.href = $(this).attr('data-url');
		});
		thisContent.find('input[name="cancel"]').click(function() {
			var box = Will.getBox();if(box) box.close();
		});
	}

	// 收件箱-删除消息
	var del = function(thisContent, type, ids, callback) {
		App.confirm('info', '确认消息', '确定要删除该消息？', 0, '确定', '取消', function() {
			var data = {ids: ids};
			//收件箱-删除消息AJAX
			Will.ajax(data,Route.PATH + '/account/delete-message',function(data){
				if($.isFunction(callback)) callback();
				App.alert('success', '提示消息', '消息删除成功！', 500);
			})
		});
	}

	// 收件箱-分页内详细
	var details = function(type, data, callback) {
		console.log(data)
		Will.initBox('<i class="icon lock"></i>消息详情', initDoc(type,data,callback),750,490,function(){
			initEvent(type, callback);
		});
		if(type == 'inbox') { //点详细发送已读ajax
			Will.ajax({ids: [data.userMessageId].toString()},Route.PATH + '/account/read-message')
		}
	}

	return {del:del,details:details}
}()

//收件箱-
var initThisPage01_message = function(){
	var isUpdating = false;
	var doDeleteMessage = function(thisContent, data, callback) {
		if(!isUpdating) {
			isUpdating = true;
			App.blockUI({
				target: thisContent,
				boxed: true
			});
			$.ajax({
				type: 'post',
				url: Route.PATH + '/account/delete-message',
				data: data,
				timeout: 10000,
				dataType: 'json',
				success: function(response) {
					isUpdating = false;
					App.unblockUI(thisContent);
					if(response.error == 0) {
						if($.isFunction(callback)) callback();
						App.alert('success', '提示消息', '消息删除成功！', 3000);
					}
					if(response.error == 1 || response.error == 2) {
						App.alert('warning', '提示消息', response.message);
					}
				},
				error: function() {
					isUpdating = false;
					App.unblockUI(thisContent);
				}
			});
		}
	}
	var thisContent = $('[data-init="content"]:eq(0)');
	// 收件箱-大新消息按钮点击事件
	$('[name="new"]').unbind().click(function(){
		window.location.hash = '#page=1';
	})

	// 收件箱-大删除按钮点击事件
	var del = function(thisContent, type, ids, callback) {
		App.confirm('info', '确认消息', '确定要删除该消息？', 0, '确定', '取消', function() {
			var data = {ids: ids};
			doDeleteMessage(thisContent, data, callback);
		});
	}
	$('[name="delete"]').unbind().click(function() {
		var ids = [];
		if($(".wrapper-inbox table :checked").length==0){
			App.alert('warning', '提示消息', '请选择要删除的消息！', 3000);
			return;
		}
		$("table :checked").each(function(){
			var checked = $(this).parents('tr').attr('data-id');
			ids.push(checked);
		})
		del(thisContent, 'inbox', ids.toString(), function() {
			Will.getPage(thisContent).reload();
		});
	});

	//收件箱-分页
	Will.page(thisContent,{},Route.PATH +'/account/list-message','收件箱没有任何消息',function(list){
		  	var thisResultTable = thisContent.find('.result > table');
			thisResultTable.find('tbody').empty();
			$.each(list, function(i, val) {
				var formatAccount = val.fromAccount;
				if (val.type == 0) {
					if (val.isFromUp) {
						formatAccount = '上级';
					}
				}
				if (val.type == 1) {
					formatAccount = '系统';
				}
				if (val.type == 2) {
					formatAccount = '管理员';
				}
				var innerHtml =
				'<tr data-id="' + val.userMessageId + '">'+
					'<td class="mtd"><input type="checkbox"></td>'+
					'<td class="tdleft">' + ((String(val.createUser).indexOf('系统消息')==-1 && val.createUser!='上级') ? (String(val.createUser).substring(0,1)+'**') : val.createUser) + '</td>'+
					'<td>' + val.title + '</td>'+
					'<td>' + val.createDateString + '</td>'+
					'<td>' + val.readStateStr + '</td>'+
					'<td><a data-index="' + i + '" data-command="details">详情</a><a data-command="delete">删除</a></td>'+
				'</tr>';
				thisResultTable.find('tbody').append(innerHtml);
				var checkboxes = $('.form-control tbody td input[type="checkbox"]');
				 $('[data-command="check-true"]').click(function(){
						$.each(checkboxes, function() {
							if($(this).is(':checked') == false) {
								$(this).trigger('click');
							}
						});
				});
				 $('[data-command="check-false"]').click(function(){
					$.each(checkboxes, function() {
								if($(this).is(':checked') == true) {
									$(this).trigger('click');
								}
							});

				});
			});
			thisResultTable.find('a[data-command="details"]').click(function() {
				var index = $(this).attr('data-index');
				PopMessageDetail.details('inbox', list[index], function() {
					Will.getPage(thisContent).reload();
				});
			});
			thisResultTable.find('a[data-command="delete"]').click(function() {
				var id = $(this).parents('tr').attr('data-id');
				PopMessageDetail.del(thisContent, 'inbox', [id].toString(), function() {
					Will.getPage(thisContent).reload();
				});
			});
	});

	Will.getPage(thisContent).init();
}

//发消息-
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

var initThisPage02_message = function() {
	var thisContent = $('[data-init="content"]:eq(1)');



	//发消息-发送消息按钮-AJAX
	var doSendMessage = function(data) {
		Will.ajax(data , Route.PATH + '/account/send-message' , function(){
			resetForm();
			App.alert('success', '提示消息', '消息发送成功！', 3000);
		});
	}

	//发消息-重置表单
	var resetForm = function() {
		thisContent.find('input[name="toUsers"]').val('');
		thisContent.find('input[name="subject"]').val('');
		thisContent.find('textarea[name="content"]').val('');
	}

  var defaultclick = 0;
  if (typeof QueryString.replay !== 'undefined') {
    defaultclick = 1;
    if (typeof QueryString.nick !== 'undefined') {
      thisContent.find('input[name="toUsers"]').val(QueryString.nick);
    }
  }

	//发消息-点击上级代理
	thisContent.find('input[name="target"]').unbind().click(function() {
		if($(this).val() == 'up') {
			thisContent.find('[data-group="toUsers"]').hide();
		}
		if($(this).val() == 'down') {
			thisContent.find('[data-group="toUsers"]').show();
		}
		if($(this).val() == 'admin') {
			thisContent.find('[data-group="toUsers"]').hide();
		}
	}).eq(defaultclick).trigger('click'); // 默认刷新后要选中第一个



	//发消息-下级会员-点击添加用户
	thisContent.find('input[name="add"]').unbind().click(function() {
		UserDirectLower.init(thisContent, function(data) {
			thisContent.find('input[name="toUsers"]').val(data);
		});
	});

	//发消息-下级会员-添加用户-下级列表
	var UserDirectLower = function() {

 		var initDoc = function(list) {
			var innerHtml =
			'<div id="UserDirectLower" class="manager">'+
				'<div class="modal-float">'+
					'<div class="params">'+
						'<div class="row">'+
							'<label>搜索用户：</label>'+
							'<input name="username" type="text" class="form-control input search" autocomplete="off" placeholder="搜索用户">'+
							'<input name="search" type="button" class="search" value="搜索">'+
						'</div>'+
					'</div>'+
					'<div class="list-user">';
						$.each(list, function(i, val) {
							innerHtml += '<label class="item"><input value="' + val + '" type="checkbox">' + val + '</label>';
						});
					innerHtml +=
					'</div>'+
					'<div class="action-groups">'+
						'<div class="radio-group noselect">'+
							'<label><input name="selectall" value="1" type="radio">全选</label>'+
							'<label><input name="selectall" value="0" type="radio">反选</label>'+
						'</div>'+
						'<input name="add" type="button" class="button right" value="添加用户"/>'+
					'</div>'+
				'</div>'+
			'</div>';
			return innerHtml;
		}
		var initEvent = function(callback) {
			var thisContent = $('#UserDirectLower');
			var checkboxes = thisContent.find('.list-user > .item > input[type="checkbox"]');
			thisContent.find('input[name="selectall"]').click(function() {
				if($(this).val() == 1) {
					$.each(checkboxes, function() {
						if($(this).is(':checked') == false) {
							$(this).trigger('click');
						}
					});
				}
				if($(this).val() == 0) {
					$.each(checkboxes, function() {
						if($(this).is(':checked') == true) {
							$(this).trigger('click');
						}
					});
				}
			});
			thisContent.find('input[name="cancel"]').click(function() {
				var box = Will.getBox();
				if(box) box.close();
			});
			thisContent.find('input[name="add"]').click(function() {
				var toUsers = [];
				$.each(checkboxes, function() {
					if($(this).is(':checked') == true) {
						toUsers.push($(this).val());
					}
				});
				if(!toUsers.length) return App.alert('success', '提示消息', '请至少选择一个要添加的下级会员', 3000);
				var box = Will.getBox();
				if(box) box.close();
				if($.isFunction(callback)) callback(toUsers);
			});
      thisContent.find('input[name="search"]').click(function() {
				var isnull = true;
        var searchname = thisContent.find('input[name="username"]').val();
				thisContent.find('.list-user > .item').hide();
        // thisContent.find('.list-user > .item').removeClass('highlight');
        thisContent.find('.list-user > .item').each(function(i, el) {
          //console.log(String($(el).text()).indexOf(searchname)>-1);
          if (String($(el).text()).indexOf(searchname)>-1) {
            // $(el).addClass('highlight');
						$(el).show();
						isnull&&(isnull = false);
          }
        });
				if(isnull){
					App.alert('success', '提示消息', '未查询到相关用户', 3000);
				}
			});
		}

		var init = function(thisContent, callback) {
			Will.ajax({},Route.PATH +'/agent/list-direct-account', function(data){
				Will.initBox('<i class="icon lock"></i>添加收件人', initDoc(data),672,410,function(){
					initEvent(callback);
				});
			})

		}

		return {init: init};
	}();


	//发消息-上级代理-点击清空列表
	thisContent.find('input[name="clear"]').unbind().click(function() {
		thisContent.find('input[name="toUsers"]').val('');
	});


	//发消息-验证表单
	var testForm = function(target, toUsers, subject, content) {
		if(target == 'down' && toUsers == '') {
			App.alert('info', '提示消息', '至少添加一位收件人！', 3000);
			return false;
		}
		if(subject == '') {
			App.alert('info', '提示消息', '消息主题不能为空！', 3000);
			return false;
		}
		if(content == '') {
			App.alert('info', '提示消息', '消息内容不能为空！', 3000);
			return false;
		}
		return true;
	}

	//发消息-提交表单
	thisContent.find('input[name="submit"]').unbind().click(function() {
		var target = thisContent.find('input[name="target"]:checked').val();
		var tos = thisContent.find('input[name="toUsers"]').val();
		var subject = thisContent.find('input[name="subject"]').val();
		var content = thisContent.find('textarea[name="content"]').val();
		if(testForm(target, tos, subject, content)) {
			var data = {target: target, tos: tos, subject: subject, content: content};
			doSendMessage(data);
		}
	});

	//发消息-取消按钮
	thisContent.find('input[name="cancel"]').unbind().click(function() {
		window.history.go(-1);
	});

	(function(){
		var target = App.getHash('target');
  		if(target) {
			thisContent.find('input[name="target"][value="' + target + '"]').trigger('click');
		}
		var username = App.getHash('username');
		if(username) {
			thisContent.find('input[name="toUsers"]').val(username);
		}
	})()

}

var initMessage = function() {
  Will.changeTabs([initThisPage01_message,initThisPage02_message]);
}

//$(document).ready(function() {
//
//});
