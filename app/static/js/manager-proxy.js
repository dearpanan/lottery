/*!
 * clipboard.js v1.6.1
 * https://zenorocha.github.io/clipboard.js
 *
 * Licensed MIT © Zeno Rocha
 */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.Clipboard=e()}}(function(){var e,t,n;return function e(t,n,o){function i(a,c){if(!n[a]){if(!t[a]){var l="function"==typeof require&&require;if(!c&&l)return l(a,!0);if(r)return r(a,!0);var u=new Error("Cannot find module '"+a+"'");throw u.code="MODULE_NOT_FOUND",u}var s=n[a]={exports:{}};t[a][0].call(s.exports,function(e){var n=t[a][1][e];return i(n?n:e)},s,s.exports,e,t,n,o)}return n[a].exports}for(var r="function"==typeof require&&require,a=0;a<o.length;a++)i(o[a]);return i}({1:[function(e,t,n){function o(e,t){for(;e&&e.nodeType!==i;){if(e.matches(t))return e;e=e.parentNode}}var i=9;if("undefined"!=typeof Element&&!Element.prototype.matches){var r=Element.prototype;r.matches=r.matchesSelector||r.mozMatchesSelector||r.msMatchesSelector||r.oMatchesSelector||r.webkitMatchesSelector}t.exports=o},{}],2:[function(e,t,n){function o(e,t,n,o,r){var a=i.apply(this,arguments);return e.addEventListener(n,a,r),{destroy:function(){e.removeEventListener(n,a,r)}}}function i(e,t,n,o){return function(n){n.delegateTarget=r(n.target,t),n.delegateTarget&&o.call(e,n)}}var r=e("./closest");t.exports=o},{"./closest":1}],3:[function(e,t,n){n.node=function(e){return void 0!==e&&e instanceof HTMLElement&&1===e.nodeType},n.nodeList=function(e){var t=Object.prototype.toString.call(e);return void 0!==e&&("[object NodeList]"===t||"[object HTMLCollection]"===t)&&"length"in e&&(0===e.length||n.node(e[0]))},n.string=function(e){return"string"==typeof e||e instanceof String},n.fn=function(e){var t=Object.prototype.toString.call(e);return"[object Function]"===t}},{}],4:[function(e,t,n){function o(e,t,n){if(!e&&!t&&!n)throw new Error("Missing required arguments");if(!c.string(t))throw new TypeError("Second argument must be a String");if(!c.fn(n))throw new TypeError("Third argument must be a Function");if(c.node(e))return i(e,t,n);if(c.nodeList(e))return r(e,t,n);if(c.string(e))return a(e,t,n);throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList")}function i(e,t,n){return e.addEventListener(t,n),{destroy:function(){e.removeEventListener(t,n)}}}function r(e,t,n){return Array.prototype.forEach.call(e,function(e){e.addEventListener(t,n)}),{destroy:function(){Array.prototype.forEach.call(e,function(e){e.removeEventListener(t,n)})}}}function a(e,t,n){return l(document.body,e,t,n)}var c=e("./is"),l=e("delegate");t.exports=o},{"./is":3,delegate:2}],5:[function(e,t,n){function o(e){var t;if("SELECT"===e.nodeName)e.focus(),t=e.value;else if("INPUT"===e.nodeName||"TEXTAREA"===e.nodeName){var n=e.hasAttribute("readonly");n||e.setAttribute("readonly",""),e.select(),e.setSelectionRange(0,e.value.length),n||e.removeAttribute("readonly"),t=e.value}else{e.hasAttribute("contenteditable")&&e.focus();var o=window.getSelection(),i=document.createRange();i.selectNodeContents(e),o.removeAllRanges(),o.addRange(i),t=o.toString()}return t}t.exports=o},{}],6:[function(e,t,n){function o(){}o.prototype={on:function(e,t,n){var o=this.e||(this.e={});return(o[e]||(o[e]=[])).push({fn:t,ctx:n}),this},once:function(e,t,n){function o(){i.off(e,o),t.apply(n,arguments)}var i=this;return o._=t,this.on(e,o,n)},emit:function(e){var t=[].slice.call(arguments,1),n=((this.e||(this.e={}))[e]||[]).slice(),o=0,i=n.length;for(o;o<i;o++)n[o].fn.apply(n[o].ctx,t);return this},off:function(e,t){var n=this.e||(this.e={}),o=n[e],i=[];if(o&&t)for(var r=0,a=o.length;r<a;r++)o[r].fn!==t&&o[r].fn._!==t&&i.push(o[r]);return i.length?n[e]=i:delete n[e],this}},t.exports=o},{}],7:[function(t,n,o){!function(i,r){if("function"==typeof e&&e.amd)e(["module","select"],r);else if("undefined"!=typeof o)r(n,t("select"));else{var a={exports:{}};r(a,i.select),i.clipboardAction=a.exports}}(this,function(e,t){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var i=n(t),r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},a=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),c=function(){function e(t){o(this,e),this.resolveOptions(t),this.initSelection()}return a(e,[{key:"resolveOptions",value:function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.action=t.action,this.emitter=t.emitter,this.target=t.target,this.text=t.text,this.trigger=t.trigger,this.selectedText=""}},{key:"initSelection",value:function e(){this.text?this.selectFake():this.target&&this.selectTarget()}},{key:"selectFake",value:function e(){var t=this,n="rtl"==document.documentElement.getAttribute("dir");this.removeFake(),this.fakeHandlerCallback=function(){return t.removeFake()},this.fakeHandler=document.body.addEventListener("click",this.fakeHandlerCallback)||!0,this.fakeElem=document.createElement("textarea"),this.fakeElem.style.fontSize="12pt",this.fakeElem.style.border="0",this.fakeElem.style.padding="0",this.fakeElem.style.margin="0",this.fakeElem.style.position="absolute",this.fakeElem.style[n?"right":"left"]="-9999px";var o=window.pageYOffset||document.documentElement.scrollTop;this.fakeElem.style.top=o+"px",this.fakeElem.setAttribute("readonly",""),this.fakeElem.value=this.text,document.body.appendChild(this.fakeElem),this.selectedText=(0,i.default)(this.fakeElem),this.copyText()}},{key:"removeFake",value:function e(){this.fakeHandler&&(document.body.removeEventListener("click",this.fakeHandlerCallback),this.fakeHandler=null,this.fakeHandlerCallback=null),this.fakeElem&&(document.body.removeChild(this.fakeElem),this.fakeElem=null)}},{key:"selectTarget",value:function e(){this.selectedText=(0,i.default)(this.target),this.copyText()}},{key:"copyText",value:function e(){var t=void 0;try{t=document.execCommand(this.action)}catch(e){t=!1}this.handleResult(t)}},{key:"handleResult",value:function e(t){this.emitter.emit(t?"success":"error",{action:this.action,text:this.selectedText,trigger:this.trigger,clearSelection:this.clearSelection.bind(this)})}},{key:"clearSelection",value:function e(){this.target&&this.target.blur(),window.getSelection().removeAllRanges()}},{key:"destroy",value:function e(){this.removeFake()}},{key:"action",set:function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"copy";if(this._action=t,"copy"!==this._action&&"cut"!==this._action)throw new Error('Invalid "action" value, use either "copy" or "cut"')},get:function e(){return this._action}},{key:"target",set:function e(t){if(void 0!==t){if(!t||"object"!==("undefined"==typeof t?"undefined":r(t))||1!==t.nodeType)throw new Error('Invalid "target" value, use a valid Element');if("copy"===this.action&&t.hasAttribute("disabled"))throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');if("cut"===this.action&&(t.hasAttribute("readonly")||t.hasAttribute("disabled")))throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');this._target=t}},get:function e(){return this._target}}]),e}();e.exports=c})},{select:5}],8:[function(t,n,o){!function(i,r){if("function"==typeof e&&e.amd)e(["module","./clipboard-action","tiny-emitter","good-listener"],r);else if("undefined"!=typeof o)r(n,t("./clipboard-action"),t("tiny-emitter"),t("good-listener"));else{var a={exports:{}};r(a,i.clipboardAction,i.tinyEmitter,i.goodListener),i.clipboard=a.exports}}(this,function(e,t,n,o){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function c(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e,t){var n="data-clipboard-"+e;if(t.hasAttribute(n))return t.getAttribute(n)}var u=i(t),s=i(n),f=i(o),d=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),h=function(e){function t(e,n){r(this,t);var o=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return o.resolveOptions(n),o.listenClick(e),o}return c(t,e),d(t,[{key:"resolveOptions",value:function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.action="function"==typeof t.action?t.action:this.defaultAction,this.target="function"==typeof t.target?t.target:this.defaultTarget,this.text="function"==typeof t.text?t.text:this.defaultText}},{key:"listenClick",value:function e(t){var n=this;this.listener=(0,f.default)(t,"click",function(e){return n.onClick(e)})}},{key:"onClick",value:function e(t){var n=t.delegateTarget||t.currentTarget;this.clipboardAction&&(this.clipboardAction=null),this.clipboardAction=new u.default({action:this.action(n),target:this.target(n),text:this.text(n),trigger:n,emitter:this})}},{key:"defaultAction",value:function e(t){return l("action",t)}},{key:"defaultTarget",value:function e(t){var n=l("target",t);if(n)return document.querySelector(n)}},{key:"defaultText",value:function e(t){return l("text",t)}},{key:"destroy",value:function e(){this.listener.destroy(),this.clipboardAction&&(this.clipboardAction.destroy(),this.clipboardAction=null)}}],[{key:"isSupported",value:function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:["copy","cut"],n="string"==typeof t?[t]:t,o=!!document.queryCommandSupported;return n.forEach(function(e){o=o&&!!document.queryCommandSupported(e)}),o}}]),t}(s.default);e.exports=h})},{"./clipboard-action":7,"good-listener":4,"tiny-emitter":6}]},{},[8])(8)});
//编辑下级配额
var PopEditLowerQuota = function() {

	var loadEditLowerQuota = function(thisContent, username, callback) {
		Will.ajax({username: username},Route.PATH + '/agent/prepare-edit-quota', function(data){
			buildProxyEditLowerQuota(data, callback);
		});
	}

	// 列出我的配额信息，下级配额信息
	var buildProxyEditLowerQuota = function(data, callback) {
		if(data) {
			if(data.uAccount.accountType == 0) {
				return App.alert('info', '提示消息', '该用户是玩家，无法分配配额。');
			}
			var doc = initDoc(data);
			if(doc == false) return;
			Will.initBox( '<i class="icon lock"></i>增减开户额</span>',doc,800,!function(){
				var rLength = data.uLotteryCodeQuotaList.length;
					if (rLength < 3) {
						rLength = 3;
					}
					var height = 206 + 36 * rLength;
					return height;
			}(),function(){
				initEvent(data.uAccount.username, callback);
			});
		}
	}

	var doEditProxyUserQuota = function(data, thisContent, callback) {
		Will.ajax(data, Route.PATH +'/agent/edit-quota', function(data){
			var box = Will.getBox() ; if(box) box.close();
			App.alert('success', '提示消息', '操作成功，下级开户额已变更！', 3000);
			if($.isFunction(callback)) callback();
		});
	}

 	var initDoc = function(data) {
		var bodyHtml = '';
		var allowEdit = false, surplusCount = 3;
		var mQuatMap = {};

		$.each(data.mLotteryCodeQuotaList, function(i, val) {
			mQuatMap[val.minCode]= val.surplusAmount;
		});

		$.each(data.uLotteryCodeQuotaList, function(i, val) {
			bodyHtml +=
			'<tr data-id="' + val.minCode +'">'+
				'<td>' + val.minPoint.toFixed(1) + ' ~ ' + val.maxPoint.toFixed(1) + '</td>'+
			/*	'<td>' + data.mLotteryCodeQuotaList[i].surplusAmount + '</td>'+*/
				'<td>' + mQuatMap[val.minCode] + '</td>'+
				'<td>' + val.surplusAmount + '</td>'+
				'<td>+ <input type="text" class="form-control" value="0" autocomplete="off"/></td>'+
				/*'<td>- <input type="text" class="form-control" value="0" autocomplete="off"/></td>'+*/
			'</tr>';
			allowEdit = true;
			surplusCount--;
		});
		if (allowEdit) {
			for (var i = 0; i < surplusCount; i++) {
				bodyHtml += '<tr><td>&emsp;</td><td>&emsp;</td><td>&emsp;</td><td>&emsp;</td><td>&emsp;</td></tr>';
			}
		} else {
			App.alert('info', '提示消息', '该用户无法分配配额。');
			return false;
		}
		var innerHtml =
		'<div id="EditLowerQuota" class="manager">'+
			'<div class="modal-float">'+
				'<div class="params">'+
					'<div class="row f14 quota">'+
						'<label>用户名：</label>'+
						'<div class="value">' + data.uAccount.username + '</div>'+
						'<label>昵称：</label>'+
						'<div class="value">' + data.uAccount.nickname + '</div>'+
						'<label>彩票返点：</label>'+
						'<div class="value">' + data.uGameLotteryAccount.point.toFixed(1) + '</div>'+
						'<label>彩票余额：</label>'+
						'<div class="value">¥ ' + data.uGameLotteryAccount.availableBalance.toFixed(3) + '</div>'+
					'</div>'+
				'</div>'+
				'<div class="result">'+
					'<table data-table="quota" class="form-control">'+
						'<thead>'+
							'<tr>'+
								'<td width="20%">开户区段</td>'+
								'<td width="20%">我的剩余开户额</td>'+
								'<td width="20%">下级剩余开户额</td>'+
								'<td width="20%">增加下级开户额</td>'+
								/*'<td width="20%">回收下级开户额</td>'+*/
							'</tr>'+
						'</thead>'+
						'<tbody>' + bodyHtml + '</tbody>'+
					'</table>'+
				'</div>'+
				'<div class="button-groups">'+
					'<input name="submit" type="button" class="button" value="确定"/>'+
				'</div>'+
			'</div>'+
		'</div>';
		return innerHtml;
	}

	var bindNumber = function(els) {
		if(els.length == 0) return;
		els.keydown(function(e) {
			if(e.keyCode == 38 || e.keyCode == 40) {
				if($(this).val() == '') return;
				var val = Number($(this).val());
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

	var initEvent = function(username, callback) {
		var thisContent = $('#EditLowerQuota');
		var tableQuota = thisContent.find('[data-table="quota"]');
		tableQuota.find('tbody > tr').each(function() {
			var els = $(this).find('input');
			bindNumber(els);
		});
		thisContent.find('input[name="submit"]').click(function() {
			var amounts = [];
			tableQuota.find('tbody > tr').each(function() {
				var add = $(this).find('input:eq(0)').val();
				var minCode = $(this).data("id");
				//var sub = $(this).find('input:eq(1)').val();
				/*if (!isNaN(add) && !isNaN(sub)) {
					amounts.push(add - sub);
				}*/
				amounts.push(minCode + "#" + add);
			});
			var data = {username: username, amounts: amounts.join(",")};
			doEditProxyUserQuota(data, thisContent, callback);
		});
	}

	var init = function(thisContent, username, callback) {
		loadEditLowerQuota(thisContent, username, callback);
	}
	return {init: init}
}();

//按配额升点
var PopEditLowerPointByQuota = function() {

	var loadEditLowerPoint = function(thisContent, username, callback) {
		Will.ajax({username: username},Route.PATH + '/agent/prepare-edit-point-by-quota', function(data){
			buildProxyEditLowerPoint(data, callback);
		})
	}

	var buildProxyEditLowerPoint = function(data, callback) {
		Will.initBox('<i class="icon lock"></i>配额升点</span>',initDoc(data),800,286 + 36 * data.mLotteryCodeQuotaList.length,function(){
			buildHelpData(data);
			buildQuotaData(data);
			initEvent(data.uAccount.username, callback);
		});
 	}

	var doEditProxyUserPoint = function(data, thisContent, callback) {
		Will.ajax(data,Route.PATH + '/agent/edit-point-by-quota', function(data){
			var box = Will.getBox() ; if(box) box.close();
			App.alert('success', '提示消息', '操作成功，下级返点已变更！', 3000);
			if($.isFunction(callback)) callback();
		})
	}

	var buildQuotaData = function(data) {
		var thisContent = $('#EditLowerPoint');
		var thisTable = thisContent.find('[data-table="quota"]');
		thisTable.find('tbody').empty();
		if(data.mLotteryCodeQuotaList.length > 0) {
			var isShow = false;
			var maxPoint = data.lotteryCodeRange.maxPoint;
			var minPoint = data.lotteryCodeRange.minPoint;
			$.each(data.mLotteryCodeQuotaList, function(i, val) {
				isShow = true;
				var formatPoint = val.minPoint.toFixed(1) + ' ~ ' + val.maxPoint.toFixed(1);
				if (val.minPoint == val.maxPoint) {
					formatPoint = val.minPoint.toFixed(1);
				}
				var innerHtml =
				'<tr>'+
					'<td>' + formatPoint + '</td>'+
					'<td>' + val.totalAmount + '</td>'+
					'<td>' + (val.totalAmount - val.surplusAmount) + '</td>'+
					'<td>' + val. surplusAmount + '</td>'+
				'</tr>';
				thisTable.find('tbody').append(innerHtml);
			});
			if(isShow == false) {
				thisTable.find('tbody').append('<tr class="nodata"><td colspan="20">您没有配额或配额不足，请联系上级调整。</td></tr>');
			}
		} else {
			thisTable.parent().hide();
		}
	}

	var buildHelpData = function(data) {
		var thisContent = $('#EditLowerPoint');
		var help = thisContent.find('[data-help="point"]');
		var minPoint = data.uGameLotteryAccount.point;
		minPoint = minPoint + 0.1;
		var maxPoint = data.mGameLotteryAccount.point;
		//if (!data.mGameLotteryAccount.allowEqualCode) {
		//maxPoint = maxPoint - 0.1;
		//}
    console.log(maxPoint);
		if (minPoint < maxPoint) {
			help.html('调整区间：' + minPoint.toFixed(1) + '~' + maxPoint.toFixed(1));
		} else {
			help.html('无法调整该用户返点');
			thisContent.find('input[name="point"]').attr('disabled', true);
		}
	}

	var initDoc = function(data) {
		var innerHtml =
		'<div id="EditLowerPoint" class="manager">'+
			'<div class="modal-float">'+
				'<div class="params">'+
					'<div class="row f14 quota">'+
						'<label>用户名：</label>'+
						'<div class="value">' + data.uAccount.username + '</div>'+
						'<label>昵称：</label>'+
						'<div class="value">' + data.uAccount.nickname + '</div>'+
						'<label>彩票返点：</label>'+
						'<div class="value">' + data.uGameLotteryAccount.point.toFixed(1) + '</div>'+
						'<label>彩票余额：</label>'+
						'<div class="value">¥ ' + data.uGameLotteryAccount.availableBalance.toFixed(3) + '</div>'+
					'</div>'+
				'</div>'+
				'<div class="form">'+
					'<table class="form-control-float">'+
						'<tbody>'+
							'<tr>'+
								'<td class="label-f">调整返点：</td>'+
								'<td class="value">'+
									'<input name="point" type="text" class="form-control input small" value="' + data.uGameLotteryAccount.point.toFixed(1) + '" autocomplete="off">'+
									'<span data-help="point" class="help-inline"></span>'+
								'</td>'+
							'</tr>'+
						'</tbody>'+
					'</table>'+
				'</div>'+
				'<div class="result" style="padding: 10px 0;">'+
					'<table data-table="quota" class="form-control">'+
						'<thead>'+
							'<tr>'+
								'<td width="25%">区段</td>'+
								'<td width="25%">总额</td>'+
								'<td width="25%">使用</td>'+
								'<td width="25%">剩余</td>'+
							'</tr>'+
						'</thead>'+
						'<tbody></tbody>'+
					'</table>'+
				'</div>'+
				'<div class="button-groups">'+
					'<input name="submit" type="button" class="button" value="确定"/>'+
				'</div>'+
			'</div>'+
		'</div>';
		return innerHtml;
	}

	var initEvent = function(username, callback) {
		var thisContent = $('#EditLowerPoint');
		thisContent.find('input[name="submit"]').click(function() {
			var point = Number(thisContent.find('input[name="point"]').val());
			if(isNaN(point)) {
				return App.alert('info', '提示消息', '请填写正确的返点数字！', 3000);
			}
			var data = {username: username, point: point};
			doEditProxyUserPoint(data, thisContent, callback);
		});
	}

	var init = function(thisContent, username, callback) {
		loadEditLowerPoint(thisContent, username, callback);
	}
	return {init: init}
}();

//按量升点
var PopEditLowerPointByAmount = function() {

	var loadEditLowerPointByAmount = function(thisContent, uid, callback) {
		Will.ajax({username: username},Route.PATH + '/agent/prepare-edit-point-by-amount', function(data){
			buildProxyEditLowerPointByAmount(data, callback);
		})
	}

	var buildProxyEditLowerPointByAmount = function(data, callback) {
		if(data.uAmountList.length == 0) {
			return App.alert('info', '提示消息', '该用户无法进行按量升点！', 3000);
		}
		Will.initBox('<i class="icon lock"></i>按量升点</span>',initDoc(data),800,323 + data.uAmountList.length * 37,function(){
			buildAmountData(data);
			initEvent(data.uAccount.username, callback);
		});
	}

	var doEditProxyUserPoint = function(data, thisContent, callback) {
		Will.ajax(data,Route.PATH + '/agent/edit-point-by-amount', function(data){
			var box = Will.getBox() ; if(box) box.close();
			App.alert('success', '提示消息', '操作成功，下级返点已变更！', 3000);
			if($.isFunction(callback)) callback();
		})
	}

	var buildAmountData = function(data) {
		var thisContent = $('#EditLowerPointByAmount');
		var thisSelect = thisContent.find('select[name="point"]');
		var thisTable = thisContent.find('[data-table="amount"]');
		thisTable.find('tbody').empty();
		if(data.uAmountList.length > 0) {
			$.each(data.uAmountList, function(i, val) {
				var innerHtml =
				'<tr>'+
					'<td>' + val.point.toFixed(1) + '</td>'+
					'<td>' + val.amount3 + '</td>'+
					'<td>' + val.amount7 + '</td>'+
				'</tr>';
				thisTable.find('tbody').append(innerHtml);
				if (val.point > data.uGameLotteryAccount.point) {
					thisSelect.append('<option value="' + val.point.toFixed(1) + '">' + val.point.toFixed(1) + '</option>');
				}
			});
		}
	}

 	var initDoc = function(data) {
		var innerHtml =
		'<div id="EditLowerPointByAmount" class="manager">'+
			'<div class="modal-float">'+
				'<div class="params">'+
					'<div class="row f14 quota">'+
						'<label>用户名：</label>'+
						'<div class="value">' + data.uAccount.username + '</div>'+
						'<label>昵称：</label>'+
						'<div class="value">' + data.uAccount.nickname + '</div>'+
						'<label>彩票返点：</label>'+
						'<div class="value">' + data.uGameLotteryAccount.point.toFixed(1) + '</div>'+
						'<label>余额：</label>'+
						'<div class="value">¥ ' + data.uGameLotteryAccount.availableBalance.toFixed(3) + '</div>'+
					'</div>'+
				'</div>'+
				'<div class="form">'+
					'<table class="form-control-float">'+
						'<tbody>'+
							'<tr>'+
								'<td class="label-f">调整返点：</td>'+
								'<td class="value">'+
									'<select name="point" class="form-control medium">'+
										'<option value="">请选择</option>'+
									'</select>'+
									'<span data-field="range" class="help-inline">（按量升点不占用配额）</span>'+
								'</td>'+
							'</tr>'+
						'</tbody>'+
					'</table>'+
				'</div>'+
				'<div class="result" style="padding: 10px 0;">'+
					'<table data-table="amount" class="form-control">'+
						'<thead>'+
							'<tr>'+
								'<td width="40%">返点</td>'+
								'<td width="30%">3天量</td>'+
								'<td width="30%">7天量</td>'+
							'</tr>'+
						'</thead>'+
						'<tbody></tbody>'+
					'</table>'+
				'</div>'+
				'<div class="notice">'+
					'<font class="f14">该会员近一个月团队3天量为：<span data-field="amount3">' + data.uTeamMaxAmount[0].toFixed(3) + '</span>；7天量为：<span data-field="amount7">' + data.uTeamMaxAmount[1].toFixed(3) + '</span>。</font>'+
				'</div>'+
				'<div class="button-groups">'+
					'<input name="submit" type="button" class="button" value="确定"/>'+
				'</div>'+
			'</div>'+
		'</div>';
		return innerHtml;
	}

	var initEvent = function(username, callback) {
		var thisContent = $('#EditLowerPointByAmount');
		thisContent.find('input[name="submit"]').click(function() {
			var point = Number(thisContent.find('select[name="point"]').val());
			if(isNaN(point)) {
				return App.alert('info', '提示消息', '请填写正确的返点数字！', 3000);
			}
			if(point == 0) return;
			var data = {username: username, point: point};
			doEditProxyUserPoint(data, thisContent, callback);
		});
		thisContent.find('select').dropkick({theme: Constant.dropkickColor,width:320});
	}

	var init = function(thisContent, username, callback) {
		loadEditLowerPointByAmount(thisContent, username, callback);
	}
	return {init: init}
}();

//日工资设置
var PopEditSalaryPointByAmount = function() {

	var loadEditLowerPointByAmount = function(thisContent, uinfo, callback) {
		//console.log(uinfo,'loadEditLowerPointByAmount');
    Will.ajax({username: uinfo.name},Route.PATH + '/agent/prepare-edit-point-by-quota', function(tdata){
			var topdata = tdata;
      Will.ajax({username: uinfo.name},Route.PATH + '/salary/init-xj-salary', function(sdata){
        //console.log(sdata,'sdatasdatasdata');
        topdata['salary'] = sdata;
        buildProxyEditLowerPointByAmount(topdata, uinfo.id, callback);
      });
    });
	}

	var buildProxyEditLowerPointByAmount = function(data, uid, callback) {
		//console.log('data',data);
    Will.initBox('<em class="m_ico">&#59259;</em>私返设置</span>',initDoc(data),600,350,function(){
      if (data.salary.mixPercent!=null) {
        var allmixPercent = JSON.parse("" + String(data.salary.mixPercent).replace(/\'/g, '"') + "");
        //console.log(allmixPercent,'allmixPercent');
        if (allmixPercent.length>0) {
          $('.rangeset li:first input:eq(0)').val(allmixPercent[0].amount);
          $('.rangeset li:first input:eq(1)').val(allmixPercent[0].activity);
          $('.rangeset li:first input:eq(2)').val(Number(allmixPercent[0].point*100).toFixed(2));
        }
        for (i = 0; i < allmixPercent.length-1; i++) {
          $('.rangeset li:last').after($('.rangeset li:last').clone());
          $('.rangeset li:eq('+(i+1)+') input:eq(0)').val(allmixPercent[(i+1)].amount);
          $('.rangeset li:eq('+(i+1)+') input:eq(1)').val(allmixPercent[(i+1)].activity);
          $('.rangeset li:eq('+(i+1)+') input:eq(2)').val(Number(allmixPercent[(i+1)].point*100).toFixed(2));
        }
        $('.rangeset li input').attr({disabled: 'disabled'});
        $('.rangeset li .m_add').addClass('disabled').css({opacity: 0});
        $('#EditSalaryPoint .button-groups').remove();
      }
      //console.log(data.salary,'data.salarydata.salary');
			initEvent(uid,callback,data.salary);
		});
	}

	var doEditProxyUserPoint = function(data, thisContent, callback) {
		Will.ajax(data,Route.PATH + '/salary/update-salary', function(data){
			var box = Will.getBox() ; if(box) box.close();
			App.alert('success', '提示消息', '操作成功，日工资设置已变更！', 3000);
			if($.isFunction(callback)) callback();
		})
	}

	var buildAmountData = function(data) {
		var thisContent = $('#EditSalaryPoint');
		var thisSelect = thisContent.find('select[name="point"]');
		var thisTable = thisContent.find('[data-table="amount"]');
		thisTable.find('tbody').empty();
		if(data.uAmountList.length > 0) {
			$.each(data.uAmountList, function(i, val) {
				var innerHtml =
				'<tr>'+
					'<td>' + val.point.toFixed(1) + '</td>'+
					'<td>' + val.amount3 + '</td>'+
					'<td>' + val.amount7 + '</td>'+
				'</tr>';
				thisTable.find('tbody').append(innerHtml);
				if (val.point > data.uGameLotteryAccount.point) {
					thisSelect.append('<option value="' + val.point.toFixed(1) + '">' + val.point.toFixed(1) + '</option>');
				}
			});
		}
	}

 	var initDoc = function(data) {
    //console.log(data,'initDoc');
    if (data.salary==null) {
      data.salary = {
        agentPoint:0,userPoint:0,setMinPoint:0,setMaxPoint:0
      }
    }
    //console.log(data.salary.mixPercent,'data.salary.mixPercentdata.salary.mixPercent');

		var innerHtml = [
		'<div id="EditSalaryPoint" class="manager">',
			'<div class="modal-float">',
				'<div class="params">',
					'<div class="row f14 quota"><ul class="quota_items"><li>',
						'<label>用户名：</label>',
						'<div class="value">' , data.uAccount.username , '</div></li>',
            '<li><label>可设置私返：</label><div class="value"><i>',Number(data.salary.setMinPoint*100).toFixed(2),'～',Number(data.salary.setMaxPoint*100).toFixed(2),'</i></div></li>',
						//'<label>昵称：</label>',
						//'<div class="value">' , data.uAccount.nickname , '</div>',
						//'<label>彩票返点：</label>',
						//'<div class="value">' , data.uGameLotteryAccount.point.toFixed(1) , '</div>',
						//'<label>彩票余额：</label>',
						//'<div class="value">¥ ' , data.uGameLotteryAccount.availableBalance.toFixed(3) , '</div>',
					'</div>',
				'</div>',
				'<div class="form"><div class="quota_box clearfix">',
				  '<span class="label">请输入私返：</span><!--<input name="point" type="text" class="form-control input small" value="' , (data.salary !=null ? Number(data.salary.setMinPoint*100).toFixed(2) : '-') , '" autocomplete="off">-->',
				  '<ul class="rangeset clearfix">',
            '<li class="clearfix"><span>最低团队流水</span><input name="in_amount" type="text" class="sm_inline"><span>活跃人数</span><input name="in_activity" type="text" class="sm_inline"><span>比例</span><input name="in_point" type="text" class="sm_inline sm_last">%<em class="m_ico m_add hand">&#58906;</em></li>',
          '</ul>',
        '</div>',
        '<div class="quota_box_tip">温馨提示：活跃人数若不需要则填0，下级日工资则是按照最低的比例-0.1%</div>',
        '</div>',
        '<div class="setcheck">账号设置结果：<span rel="now">我的日工资比例<i>',Number(data.salary.agentPoint*100).toFixed(2),'</i>%</span> <span rel="nowuser">用户当前日工资比例<i>',Number(data.salary.userPoint*100).toFixed(2),'</i>%</span> <span rel="nowmodify">修改为:<i>-</i>%</span> <span rel="nowrange">范围:<i>',Number(data.salary.setMinPoint*100).toFixed(2),'～',Number(data.salary.setMaxPoint*100).toFixed(2),'</i>%</span></div>',
				'<div class="button-groups" style="text-align:center;">',
					'<input name="submit" type="button" class="button" value="确定"/>',
				'</div>',
			'</div>',
		'</div>'].join('');
		return innerHtml;
	}

	var initEvent = function(uid, callback,salary) {
		var thisContent = $('#EditSalaryPoint');
    thisContent.find('input[name="point"]').on('blur',function() {
      var point = thisContent.find('input[name="point"]').val();
      //console.log(point,String(point).replace(/[^.\d]/g,''));
      thisContent.find('span[rel="nowmodify"] i').html(Number(parseFloat(String(point).replace(/[^.\d]/g,''))*1).toFixed('2'))
    });

    //增加行
    thisContent.find('.m_add').unbind('click').click(function() {
      if ($(this).hasClass('disabled')) {
        return false;
      }
      if ($('.rangeset li').size()<4) {
        $('.rangeset li:last').after($('.rangeset li:last').clone());
      }
      if ($('.rangeset li').size()==4){
        $('.rangeset li .m_add').css({opacity: 0});
      }
      //thisResultTable.find('.rangeset li:la')
    });
		thisContent.find('input[name="submit"]').click(function() {
			var point = Number(thisContent.find('input[name="point"]').val());
      var allmix = [];
      for (i = 0; i < thisContent.find('.rangeset li').length; i++) {
				var nowline = thisContent.find('.rangeset li:eq('+i+')');
				if (!$.isNumeric(nowline.find('input:eq(0)').val()) || !$.isNumeric(nowline.find('input:eq(2)').val())) {
					App.alert('info', '提示消息', '请填写正确的返点数字！', 3000);
					return false;
				}
        if (!$.isNumeric(nowline.find('input:eq(1)').val())) {
					App.alert('info', '提示消息', '请填写正确的活跃人数！', 3000);
					return false;
				}
        if ($.isNumeric(nowline.find('input:eq(2)').val()) && parseInt(nowline.find('input:eq(2)').val(),10)>30) {
					nowline.find('input:eq(1)').val(30);
          App.alert('info', '提示消息', '分红比例最高30%！', 3000);
					return false;
				}
				if (nowline.find('input:eq(0)').val()=='' || nowline.find('input:eq(1)').val()=='') {
					App.alert('info', '提示消息', '不能为空！', 3000);
					return false;
				}
				allmix.push("{'amount':"+nowline.find('input:eq(0)').val()+",'activity':"+nowline.find('input:eq(1)').val()+",'point':"+parseFloat(nowline.find('input:eq(2)').val()/100)+"}")
			}
			/*if(isNaN(point)) {
				return App.alert('info', '提示消息', '请填写正确的返点数字！', 3000);
			}
      if(point<Number(salary.setMinPoint*100,10)) {
				return App.alert('info', '提示消息', '请填写正确范围的返点数字！', 3000);
			}
      if(point>Number(salary.setMaxPoint*100,10)) {
				return App.alert('info', '提示消息', '请填写正确范围的返点数字！', 3000);
			}*/
      //console.log(allmix,point);
      //console.log(point,Number(salary.setMaxPoint*100,10),Number(salary.setMinPoint*100,10));
			if(point == 0) return;
			//var data = {userId: uid, toPoint: Number(point/100).toFixed(4)};//userId:57toPoint:0.104
      //var data = {userId: uid, mixPercent: '['+allmix.join(',')+']'};
      var data = {userId: uid, mixPercent: "["+allmix.join(',')+"]"};
			doEditProxyUserPoint(data, thisContent, callback);
		});
		thisContent.find('select').dropkick({theme: Constant.dropkickColor,width:320});
	}

	var init = function(thisContent, uinfo, callback) {
		loadEditLowerPointByAmount(thisContent, uinfo, callback);
	}
	return {init: init}
}();

//分红设置
var PopEditBonusPointByAmount = function() {

	var loadEditLowerPointByAmount = function(thisContent, uinfo, callback) {
		//console.log(uinfo,'loadEditLowerPointByAmount');
    Will.ajax({username: uinfo.name},Route.PATH + '/agent/prepare-edit-point-by-quota', function(tdata){
			var topdata = tdata;
      Will.ajax({username: uinfo.name},Route.PATH + '/bonus/init-xj-bonus', function(sdata){
        //console.log(sdata,'sdatasdatasdata');
        topdata['bonus'] = sdata;
        buildProxyEditLowerPointByAmount(topdata, uinfo.id, callback);
      });
    });
	}

	var buildProxyEditLowerPointByAmount = function(data, uid, callback) {
		Will.initBox('<i class="icon lock"></i>分红设置</span>',initDoc(data),800,286 + 36 * data.mLotteryCodeQuotaList.length,function(){
      //console.log(data.bonus.userPoints.length,'data.bonus.bonus');
			initEvent(uid, callback,data.bonus);
		});
	}

	var doEditProxyUserPoint = function(data, thisContent, callback) {
		Will.ajax(data,Route.PATH + '/bonus/update-bonusCfg', function(data){
			var box = Will.getBox() ; if(box) box.close();
			App.alert('success', '提示消息', '操作成功，分红设置已变更！', 3000);
			if($.isFunction(callback)) callback();
		})
	}

	var buildAmountData = function(data) {
		var thisContent = $('#EditBonusPoint');
		var thisSelect = thisContent.find('select[name="point"]');
		var thisTable = thisContent.find('[data-table="amount"]');
		thisTable.find('tbody').empty();
		if(data.uAmountList.length > 0) {
			$.each(data.uAmountList, function(i, val) {
				var innerHtml =
				'<tr>'+
					'<td>' + val.point.toFixed(1) + '</td>'+
					'<td>' + val.amount3 + '</td>'+
					'<td>' + val.amount7 + '</td>'+
				'</tr>';
				thisTable.find('tbody').append(innerHtml);
				if (val.point > data.uGameLotteryAccount.point) {
					thisSelect.append('<option value="' + val.point.toFixed(1) + '">' + val.point.toFixed(1) + '</option>');
				}
			});
		}
	}

 	var initDoc = function(data) {
		if (data.bonus==null) {
      data.bonus = {
        userPoints:0,minPoint:0,maxPoint:0,setMaxPoint:0
      }
    }

    var getUserBonus = function(bonus) {
      if (bonus.userPoints.length==0) {
        return '<li class="example">半月总销量(元) ≥：'+
              '<input type="text" class="form-control rangenum input small" style="background:#ccc;"  value="" autocomplete="off" '+(bonus.userPoints.length == 0 ? '' : ' disabled="disabled"')+'> 分红<input type="text" class="form-control bonusrate input small" style="background:#ccc;"  value="" autocomplete="off"'+(bonus.userPoints.length == 0 ? '' : ' disabled="disabled"')+'>%'+(bonus.userPoints.length == 0 ? ' <a class="likebtn hand newline">新增</a>' : '')+
            '</li>';
      }else {
        //console.log(JSON.parse(bonus.userPoints));
        var allsets = JSON.parse(bonus.userPoints);
        var output = [];
        for (i = 0; i < allsets.length; i++) {
          output.push('<li class="">半月总销量(元) ≥：'+
              '<input type="text" class="form-control rangenum input small" style="background:#ccc;"  value="'+allsets[i].amount+'" autocomplete="off" disabled="disabled"> 分红<input type="text" class="form-control bonusrate input small" style="background:#ccc;"  value="'+allsets[i].percent+'" autocomplete="off" disabled="disabled">%'+
            '</li>')
        }
        return output.join('');

      }
    }

    //console.log(data.bonus.checkLast,'data.bonus.checkLast');

    var innerHtml =
		'<div id="EditBonusPoint" class="manager">'+
			'<div class="modal-float">'+
				'<div class="params">'+
					'<div class="row f14 quota">'+
						'<label>用户名：</label>'+
						'<div class="value">' + data.uAccount.username + '</div>'+
						'<label>昵称：</label>'+
						'<div class="value">' + data.uAccount.nickname + '</div>'+
						'<label>彩票返点：</label>'+
						'<div class="value">' + data.uGameLotteryAccount.point.toFixed(1) + '</div>'+
						'<label>彩票余额：</label>'+
						'<div class="value">¥ ' + data.uGameLotteryAccount.availableBalance.toFixed(3) + '</div>'+
					'</div>'+
				'</div>'+
				'<div class="form">'+
          '<div><input type="checkbox" id="lastweek" name="lastweek" value="" '+(data.bonus.userPoints.length == 0 ? '' : ' disabled="disabled"')+''+(data.bonus.checkLast == 0 ? '' : ' checked="checked"')+'/><label for="lastweek">累计上周期模式</label></div>'+
          '<ul class="setsitem">'+ getUserBonus(data.bonus)+
          '</ul>'+
				'</div>'+
        '<div class="setcheck">您当前的分红最低为<i class="lowest">'+data.bonus.minPoint+'</i>%，最高位<i class="highest">'+data.bonus.maxPoint+'</i>%</div>'+

				'<div class="button-groups">'+
					'<input name="submit" type="button" class="button" value="签订契约"/>'+
				'</div>'+
			'</div>'+
		'</div>';
		return innerHtml;
	}

	var initEvent = function(uid, callback,bonus) {
		var thisContent = $('#EditBonusPoint');
    thisContent.find('.newline').off('click').on('click',function() {
      var nowline = $(this).parent();
      if (!$(this).hasClass('removeline')) {
        nowline.after($('.setsitem .example').clone(true));
        $(this).html('删除').addClass('removeline');
        nowline.removeClass('example');
      }else {
        nowline.remove();
      }

    });
    thisContent.find('input[name="point"]').on('blur',function() {
      var point = thisContent.find('input[name="point"]').val();
      //console.log(point,String(point).replace(/[^.\d]/g,''));
      thisContent.find('span[rel="nowmodify"] i').html(Number(parseFloat(String(point).replace(/[^.\d]/g,''))*1).toFixed('2'))
    });
    if (bonus.userPoints.length>0) {
      thisContent.find('input[name="submit"]').addClass('disabled');
    }else {
      thisContent.find('input[name="submit"]').removeClass('disabled');
    }
		thisContent.find('input[name="submit"]').click(function() {
			var point = Number(thisContent.find('input[name="point"]').val());
			if(thisContent.find('input[name="submit"]').hasClass('disabled')) {
				return App.alert('info', '提示消息', '已经签订契约分红！', 3000);
			}
      /*if(isNaN(point)) {
				return App.alert('info', '提示消息', '请填写正确的返点数字！', 3000);
			}
      if(point<Number(bonus.setMinPoint*100,10)) {
				return App.alert('info', '提示消息', '请填写正确范围的返点数字！', 3000);
			}
      if(point>Number(bonus.setMaxPoint*100,10)) {
				return App.alert('info', '提示消息', '请填写正确范围的返点数字！', 3000);
			}*/
      var allmix = [];
			for (i = 0; i < thisContent.find('.setsitem li').length; i++) {
				var nowline = thisContent.find('.setsitem li:eq('+i+')');
				if (!$.isNumeric(nowline.find('input:eq(0)').val()) || !$.isNumeric(nowline.find('input:eq(1)').val())) {
					return App.alert('info', '提示消息', '请填写正确的数字！', 3000);
				}
				if (nowline.find('input:eq(0)').val()=='' || nowline.find('input:eq(1)').val()=='') {
					return App.alert('info', '提示消息', '不能为空，请填写正确的数字！', 3000);
				}
				allmix.push('{"amount":'+nowline.find('input:eq(0)').val()+',"percent":'+nowline.find('input:eq(1)').val()+'}')
			}
      //console.log(allmix);
			if(point == 0) return;
      //userId : userId,
			//checkLast : ($('#lastweek').prop('checked') ? 1 : 0),
			//mixPercents : '['+allmix.join(',')+']'
			var data = {
        userId: uid,
        checkLast:(thisContent.find('#lastweek').prop('checked') ? 1 : 0),
        mixPercents: '['+allmix.join(',')+']'
      };//userId:57toPoint:0.104
			doEditProxyUserPoint(data, thisContent, callback);
		});
		thisContent.find('select').dropkick({theme: Constant.dropkickColor,width:320});
	}

	var init = function(thisContent, uinfo, callback) {
		loadEditLowerPointByAmount(thisContent, uinfo, callback);
	}
	return {init: init}
}();

//给用户充值
var PopRechargeToUser = function() {

 	var loadRechargeUser = function(thisContent, username, callback) {
		Will.ajax({username: username},Route.PATH +'/agent/prepare-transfer', function(resdata){
			console.log(resdata)
			buildRechargeUser(resdata, callback);
		})
	}

	var buildRechargeUser = function(data, callback) {
		if (data) {
			Will.initBox('<i class="icon lock"></i>转账</span>',initDoc(data),600,340,function(){
				initEvent(callback);
			});
 		}
	}

	var doRechargeUser = function(data, thisContent, callback) {
    //console.log(data);
		Will.ajax(data,Route.PATH +'/agent/apply-transfer', function(resdata){
			var box = Will.getBox() ; if(box) box.close();
			App.alert('success', '提示消息', '充值成功，您的资金已转到指定账号【'+data.username+'】！', 5000);
      AppLoop.init();
			if($.isFunction(callback)) callback();
		})
	}

 	var initDoc = function(data) {
		var innerHtml =
		'<div id="RechargeToUser" class="manager">'+
			'<div class="modal-float">'+
				'<div class="form">'+
					'<table class="form-control-float">'+
						'<tbody>'+
							'<tr>'+
								'<td class="label-f">转账用户：</td>'+
								'<td class="value"><span data-field="username" class="text-name">' + data.uAccount.username + '</span></td>'+
							'</tr>'+
							'<tr>'+
								'<td class="label-f">转账类型：</td>'+
								'<td class="value">'+
									'<select name="type" id="recharge_poptype"><option value="" selected="selected">充值</option><option value="1">活动</option></select>'+
								'</td>'+
							'</tr>'+
							'<tr>'+
								'<td class="label-f">转账金额：</td>'+
								'<td class="value">'+
									'<input name="amount" type="text" class="form-control input large" autocomplete="off">'+
								'</td>'+
							'</tr>'+
							'<tr>'+
								'<td class="label-f">资金密码：</td>'+
								'<td class="value">'+
									'<input name="withdrawPwd" type="password" class="form-control input large">'+
								'</td>'+
							'</tr>'+
							'<tr>'+
								'<td class="label-f">转账备注：</td>'+
								'<td class="value">'+
									'<input name="beizhu" type="text" class="form-control input large" autocomplete="off">'+
								'</td>'+
							'</tr>'+
							'<tr>'+
							'<tr class="actions">'+
								'<td class="label-f"></td>'+
								'<td class="value">'+
									'<div class="button-groups">'+
										'<input name="submit" type="button" class="button" value="确认转账"/>'+
										'<input name="cancel" type="button" class="button" value="取消"/>'+
									'</div>'+
								'</td>'+
							'</tr>'+
							'<tr class="actions">'+
								'<td class="label-f"></td>'+
								'<td class="value">'+
									'<div id="showErrorLys">'+
										''+
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

	var testRechargeUser = function(amount, withdrawPwd) {
		if(amount == '') {
			App.alert('info', '提示消息', '请输入转账金额！', 3000);
			return false;
		}
		if(isNaN(amount) || amount < 0) {
			App.alert('info', '提示消息', '请填写正确的转账金额！', 3000);
			return false;
		}
		if(withdrawPwd == '') {
			App.alert('info', '提示消息', '请输入资金密码！', 3000);
			return false;
		}
		return true;
	}

	var initEvent = function(callback) {
    //console.log(callback,'callback');
		var thisContent = $('#RechargeToUser');
    $('select#recharge_poptype').dropkick({theme: "black" ,width:80});
		thisContent.find('input[name="submit"]').click(function() {
			var username = thisContent.find('[data-field="username"]').html();
			var amount = thisContent.find('input[name="amount"]').val();
			var withdrawPwd = thisContent.find('input[name="withdrawPwd"]').val();
			var withdrawTyp = thisContent.find('#recharge_poptype').val();
      var remarkText = thisContent.find('input[name="beizhu"]').val();

			if(testRechargeUser(amount, withdrawPwd)) {
				App.confirm('warning', '确认消息', '确定转账吗？', 0, '确定', '取消', function() {
          var data = {username: username, amount: amount, type: withdrawTyp, remark: remarkText , withdrawPassword: md5(withdrawPwd)};
				  doRechargeUser(data, thisContent, callback);
        });
			}
      /*if(testRechargeUser(amount, withdrawPwd)) {
				var data = {username: username, amount: amount, withdrawPassword: md5(withdrawPwd)};
				doRechargeUser(data, thisContent, callback);
			}*/
		});
		thisContent.find('input[name="cancel"]').click(function() {
			var box = Will.getBox() ; if(box) box.close();
		});
	}

	var init = function(thisContent, username, callback) {
		loadRechargeUser(thisContent, username, callback);
	}
	return {init: init}
}();


var pageInitIndex = {
  "init07":0,
  "init08":8,
  "init01":1,
  "init01a":7,//团队报表
  "init02":2,
  "init03":3,
  "init04":4,
  "init04a":5,
  "init05":6,
  "init06":9,
  "init10":10,
}

//pageInitIndex['init08']
//团队总览开始
var initThisPage07_proxy = function() {
	var thisContent01 = $('[data-init="content"]').eq(pageInitIndex['init07']);


	var params = thisContent01.find('.params');

	//require.config({
	//	paths: {
	//		echarts: '/plugins/custom/echarts/build/dist/',
	//		macarons: '/plugins/custom/echarts/theme/macarons'
	//	}
  //});

	var timeGe = function(sDate, eDate) {
		//if(moment(sDate).isSame(eDate)) {
		//	return true;
		//}
		if(moment(sDate).isAfter(eDate)) {
			return true;
		}
		return false;
	}

	var timeLe = function(sDate, eDate) {
		//if(moment(sDate).isSame(eDate)) {
		//	return true;
		//}
		if(moment(sDate).isBefore(eDate)) {
			return true;
		}
		return false;
	}

	var sDateEls = params.find('input[name="sDate"]');
	var eDateEls = params.find('input[name="eDate"]');
	var doCheckDate = function() {
		if(sDateEls.val() != '' && eDateEls.val() != '') {
			if(timeGe(sDateEls.val(), eDateEls.val())) {
				$(this).val('');
			}
		}
	}
	sDateEls.change(doCheckDate);
	eDateEls.change(doCheckDate);

	params.find('.x-radio').each(function() {
		var inputs = $(this).find('a');
		inputs.unbind().click(function() {
			if(!$(this).hasClass('checked')) {
				inputs.removeClass('checked');
				$(this).addClass('checked');
				var thisVal = $(this).attr('data-value');
        if(thisVal == 'today') {
					sDateEls.val(moment().add(0, 'days').subtract(0, 'days').format('YYYY-MM-DD')).datepicker('update');
					eDateEls.val(moment().add(0, 'days').format('YYYY-MM-DD')).datepicker('update');
				}
				if(thisVal == '7days') {
					sDateEls.val(moment().add(0, 'days').subtract(7, 'days').format('YYYY-MM-DD')).datepicker('update');
					eDateEls.val(moment().add(0, 'days').format('YYYY-MM-DD')).datepicker('update');
				}
				if(thisVal == '1months') {
					sDateEls.val(moment().add(0, 'days').subtract(1, 'months').format('YYYY-MM-DD')).datepicker('update');
					eDateEls.val(moment().add(0, 'days').format('YYYY-MM-DD')).datepicker('update');
				}
			}
		});
		inputs.eq(0).trigger('click');
	});

	var isLoading = false, ThisData = {};
	var loadProxyIndex = function(data) {
		//查询团队总览
    //console.log(data,'teamOverview');

		Will.ajax(data,Route.PATH + '/agent/teamOverview', function(data2){
			ThisData = data2;
			buildProxyIndex();
		});

	}

	var setSumValue = function(target, list) {
		var totalValue = 0;
		for (var i = 0; i < list.length; i++) {
			totalValue += list[i];
		}
		if(totalValue >= 100 * 10000) {
			totalValue = (totalValue / 10000).toFixed(0) + 'w';
		} else if(totalValue >= 10000) {
			totalValue = (totalValue / 10000).toFixed(2) + 'w';
		} else {
			totalValue = totalValue.toFixed(2);
		}
		target.html(totalValue);
	}

	var buildProxyIndex = function() {
		//console.log(ThisData);

    var miniWan = function(str,len) {
      if (Number(str)>100000) {
        if (parseInt(str/10000,10)>=10000) {
          return Number(parseFloat(str/100000000)).toFixed(len)+'亿';
        }
        return Number(parseFloat(str/10000)).toFixed(len)+'万';
      }
      return str;
    }

    thisContent01.find('[data-field="totalUser"]').html(ThisData.data.userCount);
		thisContent01.find('[data-field="proxyUser"]').html(ThisData.data.agentCount);
		thisContent01.find('[data-field="playerUser"]').html(ThisData.data.memberCount);
		thisContent01.find('[data-field="onlineUser"]').html(ThisData.data.userOnlineCount);
		thisContent01.find('[data-field="totalBalance"]').html(ThisData.data.teamBalance.toFixed(4));
		thisContent01.find('[data-field="lotteryBalanceTeam"]').html(ThisData.data.teamBalance.toFixed(4));
		/*thisContent01.find('[data-field="baccaratBalance"]').html(ThisData.baccaratBalance.toFixed(3));*/

		thisContent01.find('[data-field="uRechargeChart"]').html(miniWan(ThisData.data.reports.depositAmountSum,3));
		thisContent01.find('[data-field="uWithdrawChart"]').html(miniWan(ThisData.data.reports.withdrawAmountSum,3));//ThisData.data.reports.awardAmountSum.toFixed(3)
		thisContent01.find('[data-field="uConsumeChart"]').html(miniWan(ThisData.data.reports.confirmAmountSum,3));//ThisData.data.reports.depositAmountSum.toFixed(3)
		thisContent01.find('[data-field="uBonusChart"]').html(miniWan(ThisData.data.reports.awardAmountSum,3));//ThisData.data.reports.pointAmountSum.toFixed(3)
		thisContent01.find('[data-field="uRebateChart"]').html(miniWan(ThisData.data.reports.pointAmountSum,3));//ThisData.data.reports.withdrawAmountSum.toFixed(3)
		//thisContent01.find('[data-field="uActivityChart"]').html(ThisData.data.reports.activityAmountSum.toFixed(3));
		//thisContent01.find('[data-field="uRegistChart"]'), ThisData.uRegistChart.yAxis[0]);

		thisContent01.find('input[name="stat"]').eq(0).trigger('click');
	}

	thisContent01.find('input[name="stat"]').unbind().click(function() {
		var thisVal = $(this).val();
    //console.log(thisVal,'thisValthisValthisVal');
    var xaxis = [],depositAmount=[],withdrawAmount=[],confirmAmount=[],awardAmount=[],pointAmount=[],activityAmount=[],userCount=[];
    if (typeof ThisData.data.registerList !='undefined') {
      for (var i = 0; i < ThisData.data.registerList.length; i++) {
        xaxis.push(moment(ThisData.data.registerList[i].registerDate).format('MM-DD'));
        userCount.push(ThisData.data.registerList[i].count);
        depositAmount.push(ThisData.data.reports.dayReportList[i].depositAmount);
        withdrawAmount.push(ThisData.data.reports.dayReportList[i].withdrawAmount);
        confirmAmount.push(ThisData.data.reports.dayReportList[i].confirmAmount);
        awardAmount.push(ThisData.data.reports.dayReportList[i].awardAmount);
        pointAmount.push(ThisData.data.reports.dayReportList[i].pointAmount);
        activityAmount.push(ThisData.data.reports.dayReportList[i].activityAmount);
        //depositAmount.push(ThisData.data.reports.dayReportList[i].depositAmount);
      }
    }

    //console.log(awardAmount,confirmAmount,userCount,'xaxisxaxisxaxis');

		if(thisVal == 'uRechargeChart') {
			//console.log(depositAmount);
      initChart('充值',xaxis,depositAmount);
		}
		if(thisVal == 'uWithdrawChart') {
			initChart('取款',xaxis,withdrawAmount);
      //initChart('取款', ThisData.uWithdrawChart.xAxis, ThisData.uWithdrawChart.yAxis[0]);
		}
		if(thisVal == 'uConsumeChart') {

			initChart('消费',xaxis,confirmAmount);
      //initChart('消费', ThisData.uConsumeChart.xAxis, ThisData.uConsumeChart.yAxis[0]);
		}
		if(thisVal == 'uBonusChart') {
			initChart('派奖',xaxis,awardAmount);
      //initChart('派奖', ThisData.uBonusChart.xAxis, ThisData.uBonusChart.yAxis[0]);
		}
		if(thisVal == 'uRebateChart') {
			initChart('返点',xaxis,pointAmount);
      //initChart('返点', ThisData.uRebateChart.xAxis, ThisData.uRebateChart.yAxis[0]);
		}
		if(thisVal == 'uActivityChart') {
			initChart('活动',xaxis,activityAmount);
      //initChart('活动', ThisData.uActivityChart.xAxis, ThisData.uActivityChart.yAxis[0]);
		}
		if(thisVal == 'uRegistChart') {
			initChart('注册',xaxis,userCount);
      //initChart('注册', ThisData.uRegistChart.xAxis, ThisData.uRegistChart.yAxis[0]);
		}
	});

	var docChart = thisContent01.find('.chart > .instance')[0];
	var initChart = function(name, date, data) {
    //console.log(typeof echarts,'echartsechartsecharts');
		//require(['echarts', 'echarts/chart/line'], function(echarts) {
			//require(['macarons'], function(theme){
	      var thisChart = echarts.init(docChart,'macarons');
				var option = {
					tooltip: {
						trigger: 'axis'
					},
					toolbox: {
						show : false
					},
          feature : {
            mark : {
                show : true,
                title : {
                    //mark : '辅助线-开关',
                    //markUndo : '辅助线-删除',
                    //markClear : '辅助线-清空'
                },
                lineStyle : {
                    width : 1,
                    color : '#1e90ff',
                    type : 'dashed'
                }
            }
          },
					calculable: false,
					grid: { x: 80, y: 30, x2: 80, y2: 50,borderWidth:1,borderColor:'#000' },
					xAxis: [{
						type : 'category',
            splitLine:{
              show:true,interval:1,lineStyle:['#333', '#ccc']
            },
						boundaryGap : false,
						data : date
					}],
					yAxis: [{
						type: 'value',
						boundaryGap: [0, 0.1]
					}],
					series: [{
						name: name,
						type: 'line',
						data: data,
            markPoint: {
              data: [
                {type: 'max', name: '最大值'},
                {type: 'min', name: '最小值'}
              ]
            },
						markLine: {
							data: [{
								type: 'average',
								name: '平均值'
							}]
						}
					}]
				};
				thisChart.setOption(option);
	    //});
		//});
	}

	thisContent01.find('input[name="submit"]').unbind().click(function() {
		doCheckDate();
		var sDate = sDateEls.val();
		var eDate = eDateEls.val();
		if(sDate == '') {
			return App.alert('info', '提示消息', '请选择查询开始时间！', 3000);
		}
		if(eDate == '') {
			return App.alert('info', '提示消息', '请选择查询结束时间！', 3000);
		}
		if(moment(sDate).add(1, 'months').isBefore(eDate)) {
			return App.alert('info', '提示消息', '最多只能查询一个月的数据！', 3000);
		}
		var data = {start: sDate, end: eDate};
		loadProxyIndex(data);
	}).trigger('click');

}
//团队总览结束


//日工资开始
var initThisPage08_proxy = function() {
	var thisContent08 = $('[data-init="content"]').eq(pageInitIndex['init08']);
	var params = thisContent08.find('.params');
	var thisResultTable = thisContent08.find('.result > table');
	initDatePicker();
  ////console.log(params);
  var getSearchParams = function() {
    //var account = params.find('select[name="account"]').val();
		//var type = params.find('select[name="type"]').val();
		var time = params.find('input[name="time"]').val();
		var sTime = time.split(' 至 ')[0];
		var eTime = time.split(' 至 ')[1];
		var username = params.find('input[name="username"]').val();
    ////console.log({sTime: sTime + " 00:00:00", eTime: eTime + " 23:59:59", userName: username});
    var back = {sTime: sTime + " 00:00:00", eTime: eTime + " 23:59:59", posttype:'get',currPage:1,pageSize:10};
    if (username!='') {
      back['userName']= username;
    }
		return back;
	}
  ////console.log(getSearchParams);
  Will.page(thisContent08,getSearchParams,Route.PATH + '/salary/xiaji-salary','没有查询到相关记录',function(list){
		thisResultTable.find('tbody').empty();
    ////console.log(list);
		$.each(list, function(i, val) {
      var innerHtml
      if (typeof val.teamAmountSum =='undefined') {
        innerHtml =
        '<tr>'+
          '<td>' + val.day + '</td>'+
          '<td>' + val.userName + '</td>'+
          '<td>' + Number(val.point*100).toFixed(2)  + '%</td>'+
          '<td>¥' + val.teamAmount + '</td>'+
          '<td>¥' + val.wholeBonus + '</td>'+
          '<td>' + val.statusStr + '</td>'+
        '</tr>';
      }else {
        innerHtml =
        '<tr>'+
          '<td>汇总</td>'+
          '<td></td>'+
          '<td></td>'+
          '<td>¥' + val.teamAmountSum + '</td>'+
          '<td>¥' + val.bonusSum + '</td>'+
          '<td></td>'+
        '</tr>';
      }
			thisResultTable.find('tbody').append(innerHtml);
    });
  });

  params.find('input[name="submit"]').unbind().click(function() {
		Will.getPage(thisContent08).init();
	});

  ////console.log(thisContent08,thisContent08.find('select[data-type="static"]'));

  thisContent08.find('select[data-type="static"]').dropkick({theme: "black" ,width:120});

	(function() {
		//var username = App.getHash('username');
		//if(username) {
		//params.find('input[name="username"]').val(username);
		Will.getPage(thisContent08).init();
		//}

		if (AppData.getLotteryAccount().isDividendAccount) {
			//thisContent06.find('select[name="type"]').append('<option value="1500">分红</option>');
		}
	})();

}
//日工资结束

/*开户中心开始*/
var initThisPage01_proxy = function() {

	var thisContent02 = $('[data-init="content"]').eq(pageInitIndex['init01']);
  ////console.log(thisContent02,'thisContent02thisContent02');

	initTabs();

	var thisSections = thisContent02.find('.panels > .section');
	var addNewPanel = thisSections.eq(0);
	var addLinkPanel = thisSections.eq(1);
	var listLinkPanel = thisSections.eq(2);

	var isLoading = false;
	var prepareAddAccount = function() {
		Will.ajax({},Route.PATH + '/agent/prepare-add-account', function(data){
			buildAddAccount(data);
		 });

	}

	prepareAddAccount();

	var buildAddAccount = function(data) {
		buildType(data);
		buildQuota(data);
	}

	var buildType = function(data) {

		if(localStorage.getItem('_userLevel') >= 5) {
			$('#onlyplayer').show();
			$('#onlyplayer_link').show();
		}
    ////console.log(data,AppData.getMainAccount().type);
    if (data==null && AppData.getMainAccount().type==0) {
      window.location.href = "/yx/hbs/manager-account.html#page=0";
    }

		var type = thisContent02.find('[data-field="type"]');
		type.find('[data-type="agent"]').attr('data-min', data.lotteryAgentRange.minPoint.toFixed(1));
		type.find('[data-type="agent"]').attr('data-max', data.lotteryAgentRange.maxPoint.toFixed(1));

		type.find('[data-type="player"]').attr('data-min', data.lotteryPlayerRange.minPoint.toFixed(1));
		type.find('[data-type="player"]').attr('data-max', data.lotteryPlayerRange.maxPoint.toFixed(1));

    type.find('.groupDivEventtype').unbind('click').click(function() {
      $('.groupDivEventtype').attr('class','groupDivEvent groupDivEventtype')
      $(this).attr('class','groupDiv groupDivEvent groupDivEventtype')
			var help = $(this).parents('form').find('[data-help="point"]');
      var pointinput = $(this).parents('form').find('input[name="point"]');
			var minPoint = Number($(this).attr('data-min'));
			var maxPoint = Number($(this).attr('data-max'));
      console.log(maxPoint,'maxPointmaxPoint');
      if (maxPoint< 14.8  && parseInt(AppData.getMainAccount().userLevel,10)>2  && parseInt(AppData.getMainAccount().userLevel,10)<5 && maxPoint!=minPoint ) {
        maxPoint = Number(maxPoint-0.1).toFixed(1);
      }
      if (maxPoint<0) {
        maxPoint =0
      }
      console.log(minPoint,maxPoint,minPoint < maxPoint);
      //if (minPoint == maxPoint) {
      //  help.html('开户区间：' + minPoint);
      //  addLinkPanel.find('[data-help="point"]').html('开户区间：' + minPoint);  
      //}
      
      if (minPoint < maxPoint) {
				help.html('开户区间：' + minPoint + '~' + maxPoint);
        addLinkPanel.find('[data-help="point"]').html('开户区间：' + minPoint + '~' + maxPoint);
			} else {
				help.html('开户区间：' + minPoint + '~' + maxPoint);
        addLinkPanel.find('[data-help="point"]').html('开户区间：' + minPoint + '~' + maxPoint);
        //help.html('无法开户，请联系上级代理调整返点');
        //addLinkPanel.find('[data-help="point"]').html('无法开户，请联系上级代理调整返点');
			}
      console.log(maxPoint==14.7 && parseInt(AppData.getMainAccount().userLevel,10)<3);
      if (maxPoint==14.7 && parseInt(AppData.getMainAccount().userLevel,10)<3) {
        addLinkPanel.find('[data-help="point"]').html('开户区间：'+ Number(maxPoint).toFixed(1));
        //addLinkPanel.find('[data-help="point"]').html('');
        addLinkPanel.find('input[name="point"]').val(Number(maxPoint).toFixed(1)).attr('disabled','disabled');
        pointinput.val(Number(maxPoint).toFixed(1)).attr('disabled','disabled');
        //help.html('')
;
        //$('#onlyplayer,#onlyplayer_link').hide();
        help.html('开户区间：' +  Number(maxPoint).toFixed(1));
      }
      if (maxPoint==14.6 && parseInt(AppData.getMainAccount().userLevel,10)==3) {
        //maxPoint = Number(maxPoint-0.1).toFixed(1);
        addLinkPanel.find('[data-help="point"]').html('开户区间：'+ Number(maxPoint).toFixed(1));
        //addLinkPanel.find('[data-help="point"]').html('');
        addLinkPanel.find('input[name="point"]').val(Number(maxPoint).toFixed(1)).attr('disabled','disabled');
        pointinput.val(Number(maxPoint).toFixed(1)).attr('disabled','disabled');
        help.html('');
        //$('#onlyplayer,#onlyplayer_link').hide();
        //help.html('开户区间：' +  Number(maxPoint-0.1).toFixed(1));
      }
      if (maxPoint==14.5 && parseInt(AppData.getMainAccount().userLevel,10)==4) {
        //maxPoint = Number(maxPoint-0.1).toFixed(1);
        addLinkPanel.find('[data-help="point"]').html('开户区间：'+ Number(maxPoint).toFixed(1));
        //addLinkPanel.find('[data-help="point"]').html('');
        addLinkPanel.find('input[name="point"]').val(Number(maxPoint).toFixed(1)).attr('disabled','disabled');
        pointinput.val(Number(maxPoint).toFixed(1)).attr('disabled','disabled');
        help.html('');
        //$('#onlyplayer,#onlyplayer_link').hide();
      }

      if (maxPoint< 12.8) {
        maxPoint = Number($(this).attr('data-max'));
        pointinput.removeAttr('disabled');
        //$('#onlyplayer,#onlyplayer_link').show();
      }
		});//.trigger('click');
    type.find('.groupDivEventtype').eq(0).trigger('click');
	}

	var buildQuota = function(data) {
		var thisTable = thisContent02.find('[data-table="quota"]');
		thisTable.find('tbody').empty();
		if(data.lotteryCodeQuotaList.length > 0) {
			var isShow = false;
			$.each(data.lotteryCodeQuotaList, function(i, val) {
				isShow = true;
				var formatPoint = val.minPoint.toFixed(1) + ' ~ ' + val.maxPoint.toFixed(1);
				if (val.minPoint == val.maxPoint) {
					formatPoint = val.minPoint.toFixed(1);
				}
				var innerHtml =
				'<tr>'+
					'<td>' + formatPoint + '</td>'+
					'<td>' + val.totalAmount + '</td>'+
					'<td>' + (val.totalAmount - val.surplusAmount) + '</td>'+
					'<td>' + val. surplusAmount + '</td>'+
				'</tr>';
				thisTable.find('tbody').append(innerHtml);
			});
			if(isShow) {
				thisTable.parent().show();
			} else {
				thisTable.parent().hide();
			}
		} else {
			thisTable.parent().hide();
		}
	}
	//用户中心-开户
	var doAddLowerUser = function(data) {
		Will.ajax(data, Route.PATH + '/agent/add-account', function(){
			addNewPanel.find('input[name="username"]').val('');
      addNewPanel.find('input[name="passwd"]').val('');
      //thisContent02
      App.alert('success', '提示消息', '恭喜，用户添加成功！<br/>用户名：' + data.username + '<br/>彩票返点：' + data.lotteryPoint + '', 3000);
		});

	}

	var testAddLower = function(username, pwd, locatePoint) {
		// var isn = function(str){
    //   //var letterNumber = /^[0-9a-zA-Z]*$/g;
    //   var letterNumber = /^[a-zA-Z]{4}[a-zA-Z0-9]{4,8}$/g;
    //   if(str.match(letterNumber)){
    //     return true;
    //   }
    //   return false;
    // }

	var isn = function(str){
      return /^([a-zA-Z0-9]){6,24}$/.test(str) ? true : false;
    }
	
	var isname = function (str) {
      return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,12}$/.test(str) ? true : false;
    }


    if(pwd == '') {
			App.alert('info', '提示消息', '密码不能为空！', 3000);
			return false;
		}

    if(pwd == 'a123456') {
			App.alert('info', '提示消息', '此密码过于简单无法使用！', 3000);
			return false;
		}

    if ((String(pwd).length<6 || String(pwd).length>24) || !isn(pwd)) {
      App.alert('info', '提示消息', '密码不符合要求！', 3000);
      return false;
    }

    if(username == '') {
			App.alert('info', '提示消息', '用户名不能为空！', 3000);
			return false;
		}
	if(locatePoint == '') {
		App.alert('info', '提示消息', '用户返点不能为空！', 3000);
		return false;
	}
	if(isNaN(locatePoint) || locatePoint < 0) {
		App.alert('info', '提示消息', '请填写正确的返点！', 3000);
		return false;
	}
	if (!isname(username)) {
      return App.alert('info', '消息提示', '用户名由字母和数字组成，长度为8-12位！', 3000);
    }
	return true;
	}

	addNewPanel.find('input[name="submit"]').unbind('click').click(function() {
		//var type = addNewPanel.find('input[name="type"]:checked').val();

  	var type = $('#groupDivEventLys .groupDiv')[0].getAttribute("value");
		var username = addNewPanel.find('input[name="username"]').val();
    var pwd = addNewPanel.find('input[name="passwd"]').val();
		var point = addNewPanel.find('input[name="point"]').val();
		if(testAddLower(username,pwd, point)) {
			point = Number(point).toFixed(1);
			var data = {type: type, username: username, passwd: md5(pwd), lotteryPoint: point};
			doAddLowerUser(data);
		}
	});
	//链接开户请求
	var doAddRegistLink = function(data) {
		 Will.ajax(data,Route.PATH + '/agent/add-regist-link', function(data1){
			Will.getPage(thisContent02).init();
			var registUrl = App.location()  + data1;
			App.alertLimit('linkopen','success', '提示消息', '恭喜，注册链接添加成功！<br/>注册地址：' + registUrl.replace('.html','') + '<a class="copy" data-command="copy" data-clipboard-text="' + registUrl.replace('.html','') + '">复制</a>',undefined,function() {
        var clipboard = new Clipboard('#linkopen [data-command="copy"]');
        clipboard.on('success', function(e) {
          //console.info('Action:', e.action);
          //console.info('Text:', e.text);
          //console.info('Trigger:', e.trigger);
          App.alert('info', '消息提示', '复制成功！', 1000);
          e.clearSelection();
        });
        clipboard.on('error', function(e) {
          //console.error('Action:', e.action);
          //console.error('Trigger:', e.trigger);
        });
      },'关闭');

			/*var copyClient = new ZeroClipboard(copyTarget);
			copyClient.on('ready', function() {
        copyClient.on('aftercopy', function() {
					//alert('复制成功！');
          App.alert('info', '消息提示', '复制成功！', 3000);
				});
			}); */
		});

	}

	var testAddLink = function( point) {
		/*if(amount <= 0) {
			App.alert('info', '提示消息', '衔接使用次数必须大于0！', 3000);
			return false;
		}*/
		if(point == '') {
			App.alert('info', '提示消息', '用户返点不能为空！', 3000);
			return false;
		}
		if(isNaN(point) || point < 0) {
			App.alert('info', '提示消息', '请填写正确的返点！', 3000);
			return false;
		}
		return true;
	}
	addLinkPanel.find('.groupDivEventtypelink').unbind('click').click(function() {
    $('.groupDivEventtypelink').attr('class','groupDivEvent groupDivEventtypelink')
    $(this).attr('class','groupDiv groupDivEvent groupDivEventtypelink')
		//alert('11111');
    if($(this).val() == 1) {
			//addLinkPanel.find('[data-help="point"]').html(0.1);
		}
		if($(this).val() == 2) {
			//addLinkPanel.find('[data-help="point"]').html(0);
		}
	})
  //console.log(addLinkPanel.find('input[name="type"]').eq(0));
  addLinkPanel.find('.groupDivEventtypelink').eq(0).trigger('click');

	addLinkPanel.find('input[name="submit"]').unbind().click(function() {
		var type = $('#groupDivEventLylinktype .groupDiv')[0].getAttribute("value");
		var time = addLinkPanel.find('select[name="time"]').val();
		var point = addLinkPanel.find('input[name="point"]').val();
		if(testAddLink(point)) {
			point = Number(point).toFixed(1);
			var data = {type: type, validDays: time, point: point};
			doAddRegistLink(data);
		}
	});

	var clipboard;

  var loadLinks = function() {
    //console.log('loadLinksloadLinks');
    Will.page(thisContent02,{},Route.PATH + '/agent/list-regist-link','您没有生成任何注册衔接',function(list){
      //console.log(list,'listlistlistlistlist');
      listLinkPanel.find('.result > table > tbody').empty();
      $.each(list, function(i, val) {
				console.log(val.code)
        var innerHtml =
        '<tr data-id="' + val.id + '">'+
          '<td>' + (i + 1) + '</a></td>'+
          '<td><a target="_black" href="' + App.location() + val.code.replace('.html','') + '">' + val.code.replace('.html','') + '</a></td>'+
          '<td>' + DataFormat.formatUserType(val.type) + '</td>'+
          '<td>' + val.point.toFixed(1) + '</td>'+
          '<td>' + (val.expireTime ? val.expireTime : '永不过期') + '</td>'+
          '<td><a class="copy" data-command="copy" data-clipboard-text="' + App.location() + val.code.replace('.html','') + '">复制</a>&nbsp;<a data-command="delete">删除</a></td>'+
        '</tr>';
        listLinkPanel.find('.result > table > tbody').append(innerHtml);

      });

      if (list.length==0) {
        listLinkPanel.find('.result > table > tbody').html('');
      }
      if (typeof clipboard !='undefined') {
        clipboard.destroy();
      }

      if ($('#reglinks .copy').size()>0) {
        clipboard = new Clipboard('#reglinks .copy');
        clipboard.on('success', function(e) {
          //console.info('Action:', e.action);
          //console.info('Text:', e.text);
          //console.info('Trigger:', e.trigger);
          App.alert('info', '消息提示', '复制成功！', 1000);
          e.clearSelection();
        });
        clipboard.on('error', function(e) {
          //console.error('Action:', e.action);
          //console.error('Trigger:', e.trigger);
        });
      }
      listLinkPanel.find('.result > table').find('[data-command="delete"]').unbind().click(function() {
        var id = $(this).parents('tr').attr('data-id');
        var islast = false;
        App.confirm('warning', '确认消息', '确定要删除该注册链接？', 0, '确定', '取消', function() {
          doDelRegistLink(id);
        });
      });
    });
  }
	loadLinks();

	Will.getPage(thisContent02).init();


	//开户-链接删除
	var doDelRegistLink = function(id) {
		var islast = false;
    if ($('#reglinks tbody tr').size()==1) {
      islast = true;
    }
    Will.ajax({id: id},Route.PATH + '/agent/delete-regist-link', function(data){
			App.alert('success', '提示消息', '该注册链接已成功删除！', 3000);
      console.log(thisContent02.find('.tabs > a'));
      thisContent02.find('.tabs > a').eq(2).click();
      if (islast) {
        $('#reglinks tbody tr').remove();
      }
		});

	}

	thisContent02.find('.tabs > a').eq(2).click(function() {
		//var isInit = $(this).attr('data-init');
		//if(!isInit) {
	  $(this).attr('data-init', true);
	  Will.getPage(thisContent02).init();
		//}
	});

  thisContent02.find('select[data-type="static"]').dropkick({theme: "black" ,width:120});
}
/*开户中心结束*/


/*团队管理开始*/
var initThisPage02_proxy = function() {
	var thisContent03 = $('[data-init="content"]').eq(pageInitIndex['init02']);
	var params = thisContent03.find('.params');
	var thisResultTable = thisContent03.find('.result > table');
	var SearchAction = 'User';
	var getSearchParams = function() {
		var username = params.find('input[name="username"]').val();
		var subName = params.find('input[name="subName"]').val();
		var minMoney = params.find('input[name="minMoney"]').val();
		var maxMoney = params.find('input[name="maxMoney"]').val();
		var time = params.find('select[name="time"]').val();
		var sTime = null, eTime = null;
		if('today' == time) {
			sTime = moment().subtract(0, 'days').format('YYYY-MM-DD');
		}
    if('7days' == time) {
			sTime = moment().subtract(7, 'days').format('YYYY-MM-DD');
		}
		if('1months' == time) {
			sTime = moment().subtract(1, 'months').format('YYYY-MM-DD');
		}
		if('3months' == time) {
			sTime = moment().subtract(3, 'months').format('YYYY-MM-DD');
		}
		if('6months' == time) {
			sTime = moment().subtract(6, 'months').format('YYYY-MM-DD');
		}
		if('earlier' == time) {
			eTime = moment().subtract(6, 'months').format('YYYY-MM-DD');
		}
    //console.log(sTime);
		return {action: SearchAction, userName: username,subName:subName, minMoney: minMoney, maxMoney: maxMoney, sTime: sTime + " 00:00:00", eTime: eTime + " 23:59:59"};
	}


	Will.page(thisContent03,getSearchParams,Route.PATH + '/agent/list-team-account','没有团队成员信息',function(list){


      //console.log(getSearchParams(),list,'listlistlistlistlist');
      thisResultTable.find('tbody').empty();
      var showsubbtn = true;
			$.each(list, function(i, val) {
				var actions = '';
				if(val.userType != 0) {
					actions += '<a data-command="quota" class="colorLys0">配额</a>';
				}
				actions += '<a data-command="point" class="colorLys0">升点</a><a data-command="recharge"  class="colorLys1">转账</a>';
        actions += '<a data-command="salary" rel="'+val.userId+'"  class="colorLys1" style="display:none;">工资管理</a>';//<a data-command="dividend" rel="'+val.userId+'"  class="colorLys1" style="display:none;">分红</a>
        /*var formatLoginTime = '从未登录过';
				if (val.loginTime) {
					formatLoginTime = moment(val.loginTime).format('MM/DD HH:mm:ss');
				}*/
        //console.log(getSearchParams().subName,'subNamesubNamesubName');
        if (getSearchParams().subName !='') {
          actions = '<a data-command="recharge">转账</a>';
          showsubbtn=false;
        }
				var innerHtml =
				'<tr data-name="' + val.userName + '">'+
					'<td><a data-command="lower">' + val.userName + '</a></td>'+
					'<td>' + (val.userType == 0? "会员" : "代理" )+ '</td>'+
					//'<td>' + val.totalCount + '</td>'+
					'<td>' + val.balance + '</td>'+
					'<td>' + val.teamBalance + '</td>'+
					'<td>' + val.point + '</td>'+
					'<td>' + (typeof val.onlineStatus !='undefined' ? (val.onlineStatus == '离线' ? '<em class="m_ico m_off">•</em>离线 ' : '<em class="m_ico m_online">•</em>在线 '):'') + (val.lastLoginTime != null ? val.lastLoginTime : '-') + '</td>'+
					'<td>' + (showsubbtn ? actions : actions) + '</td>'+
				'</tr>';
				thisResultTable.find('tbody').append(innerHtml);
			});

      $.get('/yx/u/api/account/querySalaryBonus',function(sets) {
        //console.log(sets);
        var sabo = sets.data;
        if (sabo.showBonusTab=='0') {
          thisResultTable.find('[data-command="dividend"]').remove();
          $('#bonuspage').remove();
        }else {
          $('#bonuspage').show();
          //分红设置
          thisResultTable.find('[data-command="dividend"]').show().unbind('click').click(function() {
            var username = $(this).parents('tr').attr('data-name');
            var uid = $(this).attr('rel');
            var showQuota = function() {
              setTimeout(function() {
                PopEditBonusPointByAmount.init(thisContent03, {'name':username,'id':uid}, function() {
                  Will.getPage(thisContent03).reload();
                });
              }, 300);
            }
            showQuota();

          });
        }
        if (sabo.salary=='0') {
          thisResultTable.find('[data-command="salary"]').remove();
          $('#salarypage').remove();
        }else {
          $('#salarypage').show();
          //日工资设置
          thisResultTable.find('[data-command="salary"]').show().unbind('click').click(function() {
            var username = $(this).parents('tr').attr('data-name');
            var uid = $(this).attr('rel');
            var showQuota = function() {
              setTimeout(function() {
                PopEditSalaryPointByAmount.init(thisContent03, {'name':username,'id':uid}, function() {
                  Will.getPage(thisContent03).reload();
                });
              }, 300);
            }
            showQuota();
          });
        }
      });
			thisResultTable.find('[data-command="lower"]').unbind('click').click(function() {

				var username = $(this).parents('tr').attr('data-name');
				thisContent03.find('[name="subName"]').val(username);
        thisContent03.find('[name="submit"]').click();
        //window.location.href = '#page=2&key=team&subName=' + username;
			});

			thisResultTable.find('[data-command="quota"]').unbind('click').click(function() {
				var username = $(this).parents('tr').attr('data-name');
				PopEditLowerQuota.init(thisContent03, username);
			});
			thisResultTable.find('[data-command="point"]').unbind('click').click(function() {
				var username = $(this).parents('tr').attr('data-name');
				var showQuota = function() {
					setTimeout(function() {
						PopEditLowerPointByQuota.init(thisContent03, username, function() {
							Will.getPage(thisContent03).reload();
						});
					}, 300);
				}
				var showAmount = function() {
					setTimeout(function() {
						PopEditLowerPointByAmount.init(thisContent03, username, function() {
							Will.getPage(thisContent03).reload();
						});
					}, 300);
				}
				//App.confirm('question', '操作提示', '请选择用户升点方式！', 0, '配额升点', '按量升点', showQuota, showAmount);
				showQuota();
			});
      //增加行
      thisResultTable.find('.m_add').unbind().click(function() {
				if ($('.rangeset li').size()<5) {
          $('.rangeset li:last').after($('.rangeset li:last').clone());
        }
        //thisResultTable.find('.rangeset li:la')
			});

			thisResultTable.find('[data-command="recharge"]').unbind().click(function() {
				var username = $(this).parents('tr').attr('data-name');
				PopRechargeToUser.init(thisContent03, username, function() {
					Will.getPage(thisContent03).reload();
          typeof refreshBalAgain !='undefined' ? refreshBalAgain() : !0;
				});
			});
	});

	params.find('input[name="submit"]').unbind().click(function() {
		SearchAction = 'User';
		Will.getPage(thisContent03).init();
	});


	var refresh = function() {
		var username = App.getHash('subName');
		if(username) {
			SearchAction = 'Lower';
			params.find('input[name="subName"]').val(username);
			Will.getPage(thisContent03).init();
		}else{
			params.find('input[name="subName"]').val('');
			Will.getPage(thisContent03).init();
		}
	}();

	return {refresh:refresh};
}

/*团队管理结束*/

/*在线会员开始*/
var initThisPage03_proxy = function() {
 	var thisContent04 = $('[data-init="content"]').eq(pageInitIndex['init03']);
	var thisResultTable = thisContent04.find('.result > table');

	Will.page(thisContent04,{},Route.PATH + '/agent/list-online-account','没有在线会员信息',function(list){
			thisResultTable.find('tbody').empty();
			////console.log(list);
      $.each(list, function(i, val) {
				var innerHtml =
				'<tr>'+
					'<td>' + val.username + '</td>'+
					'<td>' + Number(val.lotteryBalance).toFixed(4) + '</td>'+
					'<td>' + moment(val.loginTime).format('MM/DD HH:mm:ss') + '</td>'+
					'<td><a href="#page=4&username=' + val.username + '">订单</a><a href="#page=6&username=' + val.username + '">账单</a></td>'+
				'</tr>';
				thisResultTable.find('tbody').append(innerHtml);
			});

	});

	Will.getPage(thisContent04).init();


	var refresh = function() {
		var username = App.getHash('username');
		if(username) {
			SearchAction = 'Lower';
			params.find('input[name="username"]').val(username);
			Will.getPage(thisContent04).init();
		}
	}();

	return {refresh:refresh};

}

/*在线会员结束*/

/*游戏纪录开始*/
var initThisPage04_proxy = function() {
	var thisContent05 = $('[data-init="content"]').eq(pageInitIndex['init04']);
	var params = thisContent05.find('.params');
	var thisResultTable = thisContent05.find('.result > table');
	////console.log('initThisPage04_proxyinitThisPage04_proxy');
	loadLottery(function(list) {
		//var lottery = params.find('select[name="lottery"]');
    var lottery = $('#proxy-gamelist');
		////console.log(lottery,'lotterylotterylottery');
    //lottery.append('<option value="VR">VR金星1.5分彩</option>');
    lottery.append('<option value="TCFFC">天彩分分彩</option>');
    $.each(list, function(i, val) {
			if (String(val.showName).indexOf('微信')==-1 && String(val.showName).indexOf('急速')==-1 && val.id!='113' && val.id!='110' && val.id!='13' && val.id!='12' && val.id!='6') {
        lottery.append('<option value="' + val.shortName + '">' + val.showName + '</option>');
      }
		});
		lottery.dropkick({theme: "black" ,width:150});
	});
	initDatePicker();

	var getSearchParams = function() {
		var lottery = params.find('select[name="lottery_proxy"]').val();
		var status = params.find('select[name="status_proxy"]').val();
		var expect = params.find('input[name="expect"]').val().replace(/(^\s*)|(\s*$)/g, "");
		expect = !!expect?expect:undefined ;
		var time = params.find('input[name="time"]').val();
		var sTime = time.split(' 至 ')[0];
		var eTime = time.split(' 至 ')[1];
		var username = params.find('input[name="username"]').val();
    //console.log(lottery=='VR',lottery);
    if (lottery=='VR') {
      params.find('input[name="submit"]').attr('url','/yx/u/api/game/vr/order');
      return {vr:1,lottery: lottery, issue: expect, sTime: sTime + " 00:00:00", eTime: eTime + " 23:59:59", subName: username,status:status};
    }else if(lottery == 'TCFFC'){
        	 params.find('input[name="submit"]').attr('url', '/game/tcg/agent/order');
        	 return {
                gameCode: 'TCFFC',
                issueNo: expect,
                sTime: sTime + " 00:00:00",
                eTime: eTime + " 23:59:59",
                username: username,
                status: status
             };
        }else {
      params.find('input[name="submit"]').attr('url','/yx/u/api/game-lottery/search-order')
      return {lottery: lottery, issue: expect, sTime: sTime + " 00:00:00", eTime: eTime + " 23:59:59", subName: username,status:status};
    }

	}

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
  params.find('input[name="submit"]').attr('url','/yx/u/api/game-lottery/search-order');
	Will.page(thisContent05,getSearchParams,params.find('input[name="submit"]').attr('url'),'没有查询到相关记录',function(list){
			thisResultTable.find('tbody').empty();
      var innerHtml='';
      //console.log(list,'listlistlist');
			$.each(list, function(i, val) {
				if (typeof getSearchParams().vr !== 'undefined') {
          var prizenum = JSON.parse(val.prizedetail);
          innerHtml =
          '<tr data-id="' + val.serialnumber + '" data-billno="' + val.serialnumber + '">'+
            '<td>' + val.serialnumber + '</td>'+
            '<td>' + val.playername + '</td>'+
            '<td>' + val.channelname+'<br>'+val.bettypename + '</td>'+
            '<td>' + val.issuenumber + '</td>'+
            '<td>' + moment(val.createtime).format('YYYY-MM-DD HH:mm:ss') + '</td>'+
            '<td>' + val.unit + '注/' + val.multiple + '倍</td>'+
            '<td>¥ ' + val.cost.toFixed(3) + '</td>'+
            '<td'+(val.state=='3' ? ' class="red"' : '')+'>¥ ' + (val.playerprize ? val.playerprize : 0).toFixed(3) + '</td>'+
            '<td'+(val.state=='3' ? ' class="red"' : '')+'>' + vrstatus(val.substate) + '</td>'+
          '</tr>';
				}else {
          innerHtml =
          '<tr data-id="' + val.id + '" data-billno="' + val.billno + '">'+
            '<td><a data-command="details">' + val.billno + '</a></td>'+
            '<td>' + val.account + '</td>'+
            '<td>' + val.lottery+'<br>'+val.method + '</td>'+
            '<td>' + val.issue + '</td>'+
            '<td>' + moment(val.orderTime).format('YYYY-MM-DD HH:mm:ss') + '</td>'+
            '<td>' + val.nums + '注/' + val.multiple + '倍</td>'+
            '<td>¥ ' + val.money.toFixed(3) + '</td>'+
            '<td>¥ ' + (val.winMoney ? val.winMoney : 0).toFixed(3) + '</td>'+
            '<td>' + val.statusRemark + '</td>'+
          '</tr>';
        }
        thisResultTable.find('tbody').append(innerHtml);
			});
			thisResultTable.find('a[data-command="details"]').unbind().click(function() {
				var id = $(this).parents('tr').attr('data-billno');
 				PopOrder.details(id, thisContent05,function(){},true);
			});


	});

	params.find('input[name="submit"]').unbind().click(function() {
		Will.getPage(thisContent05).init();
	});
 	var refresh = function() {
		var username = App.getHash('username');
		if(username) {
			params.find('input[name="username"]').val(username);
			Will.getPage(thisContent05).init();
		}
	}();

  //thisContent05.find('.params select').dropkick({theme: "black" ,width:120});
  thisContent05.find('select[name="status_proxy"]').dropkick({theme: "black" ,width:120});

	return {refresh:refresh};
}

/*游戏纪录结束*/

/*VR游戏纪录开始*/
var initThisPage04_proxy_vr = function() {
	var thisContent05 = $('[data-init="content"]').eq(pageInitIndex['init04a']);
  ////console.log(thisContent05,'thisContent05thisContent05');
	var params = thisContent05.find('.params');
	var thisResultTable = thisContent05.find('.result > table');
	////console.log('initThisPage04_proxyinitThisPage04_proxy');
	loadLottery(function(list) {
		//var lottery = params.find('select[name="lottery"]');
    var lottery = $('#proxy-gamelist_vr');
		////console.log(lottery,'lotterylotterylottery');
    lottery.append('<option value="VR" selected="selected">VR金星1.5分彩</option>');
    /*$.each(list, function(i, val) {
			if (String(val.showName).indexOf('微信')==-1 && String(val.showName).indexOf('急速')==-1 && val.id!='113' && val.id!='110' && val.id!='13' && val.id!='12' && val.id!='6') {
        lottery.append('<option value="' + val.shortName + '">' + val.showName + '</option>');
      }
		});*/
		lottery.dropkick({theme: "black" ,width:150});
	});
	initDatePicker();

	var getSearchParams = function() {
		var lottery = params.find('select[name="lottery_proxy_vr"]').val();
		var status = params.find('select[name="status_proxy_vr"]').val();
		var expect = params.find('input[name="expect"]').val().replace(/(^\s*)|(\s*$)/g, "");
		expect = !!expect?expect:undefined ;
		var time = params.find('input[name="time"]').val();
		var sTime = time.split(' 至 ')[0];
		var eTime = time.split(' 至 ')[1];
		var username = params.find('input[name="username"]').val();
    //console.log(lottery=='VR',lottery);
    var searchtyp = 0;
    if (username!='') {
      searchtyp = 1;
    }
    if (lottery=='VR') {
      params.find('input[name="submit"]').attr('url','/yx/u/api/game/vr/order');
      return {vr:1,lottery: lottery, issue: expect, sTime: sTime + " 00:00:00", eTime: eTime + " 23:59:59", subName: username,selectType:searchtyp,status:status};
    }else {
      params.find('input[name="submit"]').attr('url','/yx/u/api/game-lottery/search-order')
      return {lottery: lottery, issue: expect, sTime: sTime + " 00:00:00", eTime: eTime + " 23:59:59", subName: username,selectType:searchtyp,status:status};
    }

	}

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
  //console.log(params.find('input[name="submit"]'));
  params.find('input[name="submit"]').attr('url','/yx/u/api/game-lottery/search-order');
	Will.page(thisContent05,getSearchParams,params.find('input[name="submit"]').attr('url'),'没有查询到相关记录',function(list){
			thisResultTable.find('tbody').empty();
      var innerHtml='';
      //console.log(list,'listlistlist');
			$.each(list, function(i, val) {
				if (typeof getSearchParams().vr !== 'undefined') {
          var prizenum = JSON.parse(val.prizedetail);
          innerHtml =
          '<tr data-id="' + val.serialnumber + '" data-billno="' + val.serialnumber + '">'+
            '<td>' + val.serialnumber + '</td>'+
            '<td>' + val.playername + '</td>'+
            '<td>' + val.channelname+'<br>'+val.bettypename + '</td>'+
            '<td>' + val.issuenumber + '</td>'+
            '<td>' + moment(val.createtime).format('YYYY-MM-DD HH:mm:ss') + '</td>'+
            '<td>' + val.unit + '注/' + val.multiple + '倍</td>'+
            '<td>¥ ' + val.cost.toFixed(3) + '</td>'+
            '<td'+(val.state=='3' ? ' class="red"' : '')+'>¥ ' + (val.playerprize ? val.playerprize : 0).toFixed(3) + '</td>'+
            '<td'+(val.state=='3' ? ' class="red"' : '')+'>' + vrstatus(val.substate) + '</td>'+
          '</tr>';
				}else {
          innerHtml =
          '<tr data-id="' + val.id + '" data-billno="' + val.billno + '">'+
            '<td><a data-command="details">' + val.billno + '</a></td>'+
            '<td>' + val.account + '</td>'+
            '<td>' + val.lottery+'<br>'+val.method + '</td>'+
            '<td>' + val.issue + '</td>'+
            '<td>' + moment(val.orderTime).format('YYYY-MM-DD HH:mm:ss') + '</td>'+
            '<td>' + val.nums + '注/' + val.multiple + '倍</td>'+
            '<td>¥ ' + val.money.toFixed(3) + '</td>'+
            '<td>¥ ' + (val.winMoney ? val.winMoney : 0).toFixed(3) + '</td>'+
            '<td>' + val.statusRemark + '</td>'+
          '</tr>';
        }
        thisResultTable.find('tbody').append(innerHtml);
			});
			thisResultTable.find('a[data-command="details"]').unbind().click(function() {
				var id = $(this).parents('tr').attr('data-billno');
 				PopOrder.details(id, thisContent05,function(){},true);
			});


	});

	params.find('input[name="submit"]').unbind().click(function() {
		Will.getPage(thisContent05).init();
	});
 	var refresh = function() {
		var username = App.getHash('username');
		if(username) {
			params.find('input[name="username"]').val(username);
			Will.getPage(thisContent05).init();
		}
	}();

  //thisContent05.find('.params select').dropkick({theme: "black" ,width:120});
  thisContent05.find('select[name="status_proxy_vr"]').dropkick({theme: "black" ,width:120});

	return {refresh:refresh};
}

/*VR游戏纪录结束*/

/*帐变纪录开始*/
var initThisPage05_proxy = function() {
	var thisContent06 = $('[data-init="content"]').eq(pageInitIndex['init05']);
	var params = thisContent06.find('.params');
	var thisResultTable = thisContent06.find('.result > table');
	initDatePicker();
	var getSearchParams = function() {
		var account = params.find('select[name="account"]').val();
		var type = params.find('select[name="type"]').val();
    var seltype = params.find('select[name="type"]').prev().find('.dk_option_current>a').attr('data-dk-dropdown-value');
    if (type=='' && seltype!='') {
      type = seltype;
    }
		var time = params.find('input[name="time"]').val();
		var sTime = time.split(' 至 ')[0];
		var eTime = time.split(' 至 ')[1];
		var username = params.find('input[name="username"]').val();
		return {accountType: account, zbType: type, sTime: sTime + " 00:00:00", eTime: eTime + " 23:59:59", userName: username};
	}

  var cutNote = function(str) {
    if (String(str).indexOf(':')>-1 && String(str).indexOf('转入')==-1) {
      return str.split(':')[1];
    }
    return str.replace('手工添加存款订单 管理员','')
  }
	Will.page(thisContent06,getSearchParams,Route.PATH + '/account/search-zbrecord','没有查询到相关记录',function(list){
		thisResultTable.find('tbody').empty();
		$.each(list, function(i, val) {
			/*var noTD = '';
			if(val.type == 1300 || val.type == 1301 || val.type == 1302 || val.type == 1303 || val.type == 1400){
				noTD = '<a data-command="details" data-id="' + val.billno + '">' + val.billno.substring(16) + '</a>';
			}else{
				noTD = val.billno.substring(16);
			}*/
      ////console.log(val.note);
			var deatilsDict = {
				'20':'彩票分红'
			}
			var innerHtml =
			'<tr>'+
				/*'<td>' + noTD + '</td>'+
				'<td>' + val.account + '</td>'+
				'<td>' + val.account + '</td>'+
				'<td>' + DataFormat.formatUserBillType(val.type) + '</td>'+
				'<td>¥ ' + val.balanceBefore.toFixed(3) + '</td>'+
				'<td>¥ ' + val.amount.toFixed(3) + '</td>'+
				'<td>¥ ' + val.balanceAfter.toFixed(3) + '</td>'+
				'<td>' + moment(val.time).format('MM/DD HH:mm:ss') + '</td>'+
				'<td><a title="' + val.remarks + '" data-command="remarks">详情</a></td>'+*/
				'<td title="'+val.spsn+'">' + val.spsn + '</td>'+
				'<td title="'+val.cn+'">' + val.cn + '</td>'+
				'<td  title="'+val.createTime+'">' + val.createTime  + '</td>'+
				'<td  title="'+val.changeTypeStr+'">' + val.changeTypeStr + '</td>'+
				'<td  title="'+(val.changeTypeDetailStr ? val.changeTypeDetailStr : deatilsDict[val.changeDetailType])+'">' + (val.changeTypeDetailStr ? val.changeTypeDetailStr : deatilsDict[val.changeDetailType]) + '</td>'+
				'<td  title="'+val.amount.toFixed(4)+'">¥ ' + val.amount.toFixed(4) + '</td>'+
				'<td title="'+val.point.toFixed(4)+'">¥' + (val.point.toFixed(4).length>9?val.point.toFixed(4).slice(0,7)+'...':val.point.toFixed(4)) + '</td>'+
				'<td  title="'+cutNote(val.note)+'">' + cutNote(val.note) + '</td>'+
				// '<td>' + val.spsn + '</td>'+
				// '<td>' + val.cn + '</td>'+
				// '<td>' + val.createTime  + '</td>'+
				// '<td>' + val.changeTypeStr + '</td>'+
				// '<td>' + val.changeTypeDetailStr + '</td>'+
				// '<td>¥ ' + val.amount.toFixed(4) + '</td>'+
				// '<td>¥' + val.point.toFixed(4) + '</td>'+
				// '<td>' + cutNote(val.note) + '</td>'+
			'</tr>';
			thisResultTable.find('tbody').append(innerHtml);
		});
		thisResultTable.find('a[data-command="details"]').unbind().click(function() {
			var id = $(this).attr('data-id');
 			PopBillDetail.details(id, thisContent06 ,'',true);
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
  //thisContent06.find('.params select').dropkick({theme: "black" ,width:120});

	(function() {
		var username = App.getHash('username');
		if(username) {
			params.find('input[name="username"]').val(username);
			Will.getPage(thisContent06).init();
		}

		if (AppData.getLotteryAccount().isDividendAccount) {
			//thisContent06.find('select[name="type"]').append('<option value="1500">分红</option>');
		}
	})();

}
/*帐变纪录结束*/

/*代理分红开始*/
var initThisPage06_proxy = function() {
  //console.log('initThisPage06_proxy');
	var thisContent06 = $('[data-init="content"]').eq(pageInitIndex['init06']);
	var params = thisContent06.find('.params');
	var thisResultTable = thisContent06.find('.result:eq(1) > table');
	initDatePicker();

  var getSearchParams = function() {
		var time = params.find('input[name="time"]').val();
		var sTime = time.split(' 至 ')[0];
		var eTime = time.split(' 至 ')[1];
		var username = params.find('input[name="username"]').val();
    var back = {sTime: sTime + " 00:00:00", eTime: eTime + " 23:59:59", posttype:'get',currPage:1,pageSize:10};
    if (username!='') {
      back['userName']= username;
    }
		return back;
	}

	Will.page(thisContent06,getSearchParams,Route.PATH + '/bonus/xiaji-bonus','没有查询到相关记录',function(list){
		//console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrr');


    thisResultTable.find('tbody').empty();
    initBounsFirst();
    ////console.log(list);
		$.each(list, function(i, val) {
      var innerHtml
      if (typeof val.bonusSum =='undefined') {
        innerHtml =
        '<tr>'+
          '<td>' + val.startDay + '</td>'+
          '<td>' + val.userName + '</td>'+
          '<td>' + Number(val.percent*100).toFixed(2)  + '%</td>'+
          '<td>¥' + val.teamAmount + '</td>'+
          '<td>¥' + val.bonus + '</td>'+
          '<td>' + val.statusStr + '</td>'+
        '</tr>';
      }else {
        innerHtml =
        '<tr>'+
          '<td>汇总</td>'+
          '<td></td>'+
          '<td></td>'+
          '<td>¥' + val.profitAmount + '</td>'+
          '<td>¥' + val.bonusSum + '</td>'+
          '<td></td>'+
        '</tr>';
      }
			thisResultTable.find('tbody').append(innerHtml);
    });
  });

  params.find('input[name="submit"]').unbind().click(function() {
		Will.getPage(thisContent06).init();
	});

  var initBounsFirst = function() {
    thisContent06 = $('[data-init="content"]').eq(pageInitIndex['init06']);
    Will.ajax({},Route.PATH + '/bonus/zj-bonus', function(zdata){
      //var thisRTable = thisContent06.find('.result:eq(0) > table');
      var thisRTable = $('#fenhong .page-half li.last table');
      var thisLTable = $('#fenhong .page-half li:eq(0) table');
      //console.log(thisRTable,zdata,'zdatazdatazdata');

      thisRTable.find('.lastpaifa').html(typeof zdata.startDay !='undefined' ? zdata.startDay : '');
      thisRTable.find('.lastpaifa_end').html((typeof zdata.startDay !='undefined' ? ('～'+zdata.endDay) : '-'));

      thisRTable.find('.teammoney').html((typeof zdata.profitAmount !='undefined' ? zdata.profitAmount : '0.000')+'元');
      thisRTable.find('.deservedBonus').html((typeof zdata.deservedBonus !='undefined' ? zdata.deservedBonus : '0.000')+'元');
      thisRTable.find('.receivedBonus').html((typeof zdata.receivedBonus !='undefined' ? zdata.receivedBonus : '0.000')+'元');
      //console.log(thisContent06,'thisContent06thisContent06',thisContent06.find('.receivedBonus'),zdata.shouleDistributBonus,'zdata.shouleDistributBonus');

      thisRTable.find('.shouleDistributBonus').html((typeof zdata.shouleDistributBonus !='undefined' ? zdata.shouleDistributBonus : '0.000')+'元');
      thisRTable.find('.alreadyDistributBonus').html((typeof zdata.alreadyDistributBonus !='undefined' ? zdata.alreadyDistributBonus : '0.000')+'元');
      thisRTable.find('.yetDistributBonus').html((typeof zdata.yetDistributBonus !='undefined' ? zdata.yetDistributBonus : '0.000')+'元');
      if (parseFloat(zdata.yetDistributBonus)>0 && parseInt(AppData.getMainAccount().userLevel,10)<5) {
        thisRTable.find('.sendnow').show();
      }else {
        thisRTable.find('.sendnow').hide();
      }

      thisRTable.find('.sendnow').off('click').click(function(){
        Will.initBox('<i class="icon lock"></i>确定现在派发？</span>','<p class="limithigh">金额不足时只会进行部分派发！</p><div align="center"><a class="hand likebtn sure">确定</a>&nbsp;<a class="hand likebtn cancel">取消</a></div>',280,150,function(a){
          ////console.log($(this),$(a.container).find('.sure').size());
          var atmp = $('body').data('box');
          var thishandel = a;
          $(a.container).find('.sure').off('click').on('click',function() {
            Will.ajax({},Route.PATH + '/bonus/pall-bonus', function(pall){
              thishandel.close();
              App.alert('info', '提示消息', '已成功派发！', 3000);
              initBounsFirst();
            });
          });
          $(a.container).find('.cancel').on('click',function() {
            a.close();
          })
        });
      });

      thisLTable.find('.viewmyrate').off('click').click(function(){
        var all = JSON.parse(zdata.mixPercents);
        var alldisplay =[];
        alldisplay.push('<ul class="myrates">');
        for (i = 0; i < all.length; i++) {
          alldisplay.push('<li>半月总销量(元)≥<em>'+all[i].amount+'</em><span class="gapin"></span>分红<em class="percent">'+all[i].percent+'</em>%</li>');
        }
        alldisplay.push('</ul>');
        Will.initBox('<em class="m_ico">&#59259;</em>查看分红比例</span>',alldisplay.join(''),600,350,function(){
          //console.log(all);

          //alert('111');
        });
      });

      for (a in zdata) {
        if (thisRTable.find('[rel="'+a+'"]').size()>0) {
          thisRTable.find('[rel="'+a+'"]').html(zdata[a])
        }
        ////console.log(a,thisRTable.find('[rel="'+a+'"]').size());
      }
      thisRTable.find('#showMixPercents').attr('rel',zdata['mixPercents']);
      thisRTable.find('#sendAll').off('click').on('click',function() {
        Will.initBox('<i class="icon lock"></i>确定现在派发？</span>','<p class="limithigh">金额不足时只会进行部分派发！</p><div align="center"><a class="hand likebtn sure">确定</a>&nbsp;<a class="hand likebtn cancel">取消</a></div>',280,150,function(a){
          ////console.log($(this),$(a.container).find('.sure').size());
          var atmp = $('body').data('box');
          var thishandel = a;
          $(a.container).find('.sure').on('click',function() {
            Will.ajax({},Route.PATH + '/bonus/pall-bonus', function(pall){
              thishandel.close();
              App.alert('info', '提示消息', '已成功派发！.', 3000);
              initBounsFirst();
            });
          });
          $(a.container).find('.cancel').on('click',function() {
            a.close();
          })
        });
      })
      thisRTable.find('#showMixPercents').off('click').on('click',function() {
        var getrate = $(this).attr('rel');
        var outRules = function(rates) {
          var allsets = JSON.parse(rates);
          ////console.log(allsets,zdata.checkLast,zdata.checkLast==true);
          var output= ['<div><input type="checkbox" id="lastweek" name="lastweek" value="" disabled="disabled" '+(zdata.checkLast==true ? ' checked="checked"' : '')+'><label for="lastweek">累计上周期模式</label></div><ul>'];
          for (i = 0; i < allsets.length; i++) {
            output.push('<li>半月总销量(元) ≥：<input type="text" class="form-control rangenum input small" value="'+allsets[i].amount+'" autocomplete="off" disabled="disabled"> 分红<input type="text" class="form-control bonusrate input small" value="'+allsets[i].percent+'" autocomplete="off" disabled="disabled">%</li>')
          }
          output.push('</ul>');
          return output.join('');
        }

        Will.initBox('<i class="icon lock"></i>查看分红设置</span>',outRules(getrate),600,260,function(){
          ////console.log('showed');
        });
      })
    });
  };

	//(function() {
		//var username = App.getHash('username');
		//if(username) {
		//params.find('input[name="username"]').val(username);
  //console.log('initBounsFirstinitBounsFirst');
  initBounsFirst();
  //console.log('initBounsFirstinitBounsFirstendddddddddddd');
  Will.getPage(thisContent06).init();
		//}

  if (AppData.getLotteryAccount().isDividendAccount) {
    // thisContent06.find('select[name="type"]').append('<option value="1500">分红</option>');
  }
	//})();
}
/*代理分红结束*/


//彩票报表
//彩票报表-团队报表
var initThisPage01a_proxy = function() {
	var returnArr = (function(){
		var arr = [];
		return {
			set: function(name){
				if(name == arr[arr.length-1]) return false;
				return arr.push(name);
			},
			get: function(){
				return arr.pop(),arr[arr.length-1];
			},
			gets:function(){
				return arr;
			}
		}
	})();
	var thisContent01 = $('[data-init="content"]').eq(pageInitIndex['init01a']);
	var params = thisContent01.find('.params.S1');
	var thisResultTable = thisContent01.find('.result.S1 > table');

	var getSearchParams = function() {
		var username = params.find('input[name="username"]').val();
		var time = params.find('input[name="time"]').val();
		var sTime = time.split(' 至 ')[0];
		var eTime = time.split(' 至 ')[1];
		return {username: username, sTime: sTime + ' 00:00:00', eTime: eTime + ' 23:59:59'};
	}

	Will.page(thisContent01,getSearchParams, Route.PATH + '/report/report-team-lottery','没有查询到相关记录',function(list){
		thisResultTable.find('tbody').empty();
			$.each(list, function(i, val) {
				var innerHtml =
				'<tr>'+
					'<td>' + (val.userName ?  ('<a class="directSearch hand" rel="'+val.userName+'">'+val.userName+'</a>') : "<a class='directSearch hand' rel=''>"+val.userName+"汇总</a>")+ '</td>'+
					'<td>' + DataFormat.formatUserStatus(val.userType) + '</td>'+
					'<td>' + (val.balance ? val.balance : 0) + '</td>'+
					'<td>' + val.depositAmount + '</td>'+
					'<td>' + val.withdrawAmount + '</td>'+
					'<td>' + val.confirmAmount + '</td>'+
					'<td>' + val.awardAmount +'/'+val.orderBonusAmount+ '</td>'+
					'<td>' + val.pointAmount + '</td>'+
					'<td>' + val.activityAmount + '</td>'+
					'<td>' + val.feeAmount + '</td>'+
					'<td>' +(0 - val.profitAmount) + '</td>'+
				'</tr>';
				thisResultTable.find('tbody').append(innerHtml);
			});
      thisResultTable.find('.directSearch').off('click').on('click',function() {
        var nowrel = $(this).attr('rel');
        params.find('input[name="username"]').val(nowrel);
        params.find('input[name="submit"]').click();
				returnArr.set(nowrel);
      });
	});

  initDatePicker();
  //	Will.getPage(thisContent02).init();
	params.find('input[name="submit"]').unbind().click(function() {
		Will.getPage(thisContent01).init();
	});
	params.find('a.backup').unbind().click(function(){
		params.find('input[name="username"]').val(returnArr.get());
		params.find('input[name="submit"]').click();
		console.log(returnArr.gets())
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
  //	{
  //		var username = App.getHash('username');
  //		var time = App.getHash('time');
  //		if(username) {
  //			params.find('input[name="username"]').val(username);
  //		}else{
  //			params.find('input[name="username"]').val('');
  //		}
  //    // 		doSearch();
  //	}

}

//彩票报表-个人报表
var initThisPage02a_proxy = function() {

	var thisContent02 = $('[data-init="content"]').eq(pageInitIndex['init01a']);
	var params = thisContent02.find('.params.S2');
	var thisResultTable = thisContent02.find('.result.S2 > table');

	var getSearchParams = function() {
		var type = params.find('select[name="type"]').val();
		var username = params.find('input[name="name"]').val();
		var time = params.find('input[name="time"]').val();
		var sTime = time.split(' 至 ')[0];
		var eTime = time.split(' 至 ')[1];
		return {sDate: sTime, eDate: eTime,username:username,type:type};
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
					'<td>' + (0 - val.profitAmount) + '</td>'+
				'</tr>';
				thisResultTable.find('tbody').append(innerHtml);
			});
	});
  //	Will.getPage(thisContent02).init();
	params.find('input[name="submit"]').unbind().click(function() {
		Will.getPage(thisContent02).init();
	});

}

var initThisPage04c_proxy = function(){
	//团队报表 个人报表
	var tabs = [initThisPage01a_proxy,initThisPage02a_proxy];
  ////console.log(AppData.getMainAccount());
  var mainInfo = AppData.getMainAccount();
  if (mainInfo.type=='0') {
    $("#tab01 a:eq(0)").remove();
    tabs = [initThisPage02a];
  }
	$("#tab01 a").unbind().click(function(){
		$('[data-init="content"]').eq(pageInitIndex['init01a']).find('.wrapper').hide();
		$('[data-init="content"]').eq(pageInitIndex['init01a']).find('.wrapper.'+$(this).attr('nav')).show();
		$("#tab01 a").removeClass('active');
		$(this).addClass('active');
		tabs[$(this).index()]();
	});
	$("#tab01 a:eq(0)").click();
}


// 第三方游戏报表团队
var initThisPage10_proxy = function(){
	var thisContent06 = $('[data-init="content"]').eq(pageInitIndex['init10']);
	var params = thisContent06.find('.params');
	var thisResultTable = thisContent06.find('.result > table');
	var returnar = [];
	function unique (arr) {
    let ret = [];
    let len = arr.length;
    let tmp = {};
    for (let i = 0; i < len; i++) {
      if (!tmp[arr[i]]) {
        tmp[arr[i]] = 1;
        ret.push(arr[i]);
      }
    }
    return ret;
  }
	function returnbtn(){
		returnar.pop();
		if(!returnar.length) returnar = [''];
		params.find('input[name="username"]').val(returnar[returnar.length-1]);
		Will.getPage(thisContent06).init();
	}
	initDatePicker();
  var getSearchParams = function() {
		var time = params.find('input[name="time"]').val();
		var sTime = time.split(' 至 ')[0];
		var eTime = time.split(' 至 ')[1];
		var username = params.find('input[name="username"]').val();
    var back = {betDateBegin: sTime , betDateEnd: eTime, userName: username};
		return back;
	}
	Will.page(thisContent06,getSearchParams,Route.PATH + '/report/third-team-report','没有查询到相关记录',function(list){
		console.log(list)
    thisResultTable.find('tbody').empty();
		var innerHtml = null;
		$.each(list, function(i, val) {
			if(!val.isCount){
				innerHtml =
				'<tr>'+
					'<td><a class="searchproxy" val="' + val.userName + '">' + val.userName + '</a></td>'+
					'<td>' + val.transferInAmount + '</td>'+
					'<td>' + val.transferOutAmount + '</td>'+
					'<td>¥' + val.confirmAmount + '</td>'+
					'<td>¥' + val.awardAmount + '</td>'+
					'<td>' + val.profitAmount + '</td>'+
					// '<td>' + val.rebateAmount + '</td>'+
				'</tr>';
			}else{
				innerHtml =
				'<tr>'+
					'<td>总计</td>'+
					'<td>' + val.transferInAmount + '</td>'+
					'<td>' + val.transferOutAmount + '</td>'+
					'<td>¥' + val.confirmAmount + '</td>'+
					'<td>¥' + val.awardAmount + '</td>'+
					'<td>' + val.profitAmount + '</td>'+
					// '<td>' + val.rebateAmount + '</td>'+
				'</tr>';
			}
			thisResultTable.find('tbody').append(innerHtml);
    });
  });
	params.find('input[name="submit"]').unbind().click(function() {
		Will.getPage(thisContent06).init();
	});
	params.find('input[name="returnback"]').unbind().click(function() {
		returnbtn();
	});
	thisResultTable.find('tbody').unbind().click(function(event) {
		if(event.target.className !== 'searchproxy')return false;
		var name = event.target.getAttribute('val');
		params.find('input[name="username"]').val(name);
			returnar.push(name);
			returnar = unique(returnar);
		Will.getPage(thisContent06).init();
	});


}
 

// 天彩VR
var initThisPage11_proxy = function(){
	
	var thisContent06 = $("#tcvr_content_proxy")
	var params = thisContent06.find('.params');
	var thisResultTable = thisContent06.find('.result > table');
	var returnar = [];
	initDatePicker();
	function returnbtn(){
		returnar.pop();
		if(!returnar.length) returnar = [''];
		params.find('input[name="username"]').val(returnar[returnar.length-1]);
		Will.getPage(thisContent06).init();
	}
	var getSearchParams = function() {
		var time = params.find('input[name="time"]').val();
		var sTime = time.split(' 至 ')[0];
		var eTime = time.split(' 至 ')[1];
		var username = params.find('input[name="username"]').val();
    var back = {betDateBegin: sTime , betDateEnd: eTime, userName: username};
		return back;
	}

	Will.page(thisContent06,getSearchParams,Route.PATH + '/report/tcg-agent-report','没有查询到相关记录',function(list){
    thisResultTable.find('tbody').empty();
		var innerHtml = null;
		$.each(list, function(i, val) {
			innerHtml =
			'<tr>'+
				'<td><a class="searchproxy" val="' + val.userName + '">' + val.userName + '</a></td>'+
				'<td>' + val.gameType + '</td>'+
				'<td>' + moment(val.calcTime).format('YYYY-MM-DD HH:mm:ss') + '</td>'+
				// '<td>¥' + val.transferInAmount + '</td>'+
				// '<td>¥' + val.transferOutAmount + '</td>'+
				'<td>' + val.confirmAmount + '</td>'+
				'<td>' + (val.awardAmount + val.bonusAmount + val.rebateAmount) + '</td>'+
				'<td>' + val.profitAmount + '</td>'+
				// '<td>' + val.rebateAmount + '</td>'+
			'</tr>';
			thisResultTable.find('tbody').append(innerHtml);
    });
  });

	params.find('input[name="submit"]').unbind().click(function() {
		Will.getPage(thisContent06).init();
	});
	thisResultTable.find('tbody').unbind().click(function(event) {
		if(event.target.className !== 'searchproxy')return false;
		var name = event.target.getAttribute('val');
		params.find('input[name="username"]').val(name);
			returnar.push(name);
			returnar = unique(returnar);
		Will.getPage(thisContent06).init();
	});
	params.find('input[name="returnback"]').unbind().click(function() {
		returnbtn();
	});
}


var initProxy = function() {
  if (AppData.getLotteryAccount().isDividendAccount) {
		$('[data-visible="dividend"]').show();
	} else {
		$('[data-visible="dividend"]').hide();
	}

  $.get('/yx/u/api/account/querySalaryBonus',function(sets) {
    //console.log(sets);
    var sabo = sets.data;
    if (sabo.showBonusTab=='0') {
      $('#bonuspage').remove();
    }else {
      $('#bonuspage').show();
    }
    if (sabo.salary=='0') {
      $('#salarypage').remove();
    }else {
      $('#salarypage').show();
    }
  });
  //null,
  Will.changeTabs([
    initThisPage07_proxy,
    initThisPage01_proxy,
    initThisPage02_proxy,
    initThisPage03_proxy,
    initThisPage04_proxy,initThisPage04_proxy_vr,
    initThisPage05_proxy,
    initThisPage04c_proxy,
    initThisPage08_proxy,
    initThisPage06_proxy,
	initThisPage10_proxy,
	initThisPage11_proxy,
  ])
}

 

 
