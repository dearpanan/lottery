/**
 * 彩票投注辅助
 */
var LotteryUtils = function() {
	/**
	 * 输入框类型检测
	 */
	var _inputCheck_Num = function(datasel, l, fun, sort) {
		fun = $.isFunction(fun) ? fun : function(n, l) {
			return true;
		}
		var newsel = []; // 新的号码
		if(sort) { // 如果需要号码排序
			var sortsel = [];
			$.each(datasel, function(i, n) {
				sortsel.push(n.split('').sort().toString().replace(/\,/g, ''));
			});
			datasel = sortsel;
		}
		datasel = ArrayUtil.unique(datasel); // 去除重复
		var regex = new RegExp('^[0-9]{' + l + '}$');
		$.each(datasel, function(i, n) {
			if(regex.test(n) && fun(n, l)) {
				newsel.push(n);
			}
		});
		return newsel;
	}

	/**
	 * 和值检测
	 */
	var _HHZXCheck_Num = function(n, l) {
		var a = new Array();
		if (l == 2) {//两位
			a = [ '00', '11', '22', '33', '44', '55', '66', '77', '88', '99' ];
		} else {//三位[默认]
			a = [ '000', '111', '222', '333', '444', '555', '666', '777', '888', '999' ];
		}
		return $.inArray(n, a) == -1 ? true : false;
	}

	/**
	 * 多少注计算
	 */
	var _inputNumbers = function(type, datasel) {
		var nums = 0, tmp_nums = 1;
    //console.log(type,'typetypetypetype');

		switch (type) {
		case 'rx3z3':
			var maxplace = 1;
			if(datasel.length > 1) {
				var place = 0;
				for (var i = 0; i < datasel[0].length; i++) {
					if(datasel[0][i] == '√') place++;
				}
				var newsel = datasel[1];
				var m = 3;
				// 任选3必须大于选了3位以上才能组成组合
				if(place >= m) {
					var h = ArrayUtil.ComNum(place, m);
					if(h > 0) {// 组合数必须大于0
						for (var i = 0; i < maxplace; i++) {
							var s = newsel.length;
							// 组三必须选两位或者以上
							if (s > 1) {
								nums += s * (s - 1);
							}
						}
						nums *= h;
					}
				}
			}
			break;
   case 'rx4_zux_z24':
			var maxplace = 1;
			if(datasel.length > 1) {
				var place = 0;
				for (var i = 0; i < datasel[0].length; i++) {
					if(datasel[0][i] == '√') place++;
				}
				var newsel = datasel[1];
				var m = 4;
				// 任选4必须大于选了4位以上才能组成组合
				if(place >= m) {
					var h = ArrayUtil.ComNum(place, m);
          //console.log(h,place,m);

					if(h > 0) {// 组合数必须大于0
						for (var i = 0; i < maxplace; i++) {
							var s = newsel.length;
              var autosumsols = Array.apply(null, {length: s}).map(Number.call, Number);
							// 组三必须选两位或者以上
							if (s > 3) {
								cmb = Combinatorics.combination(autosumsols,4);
                nums += cmb.length;
							}
						}
						nums *= h;
					}
				}
			}
			break;
   case 'rx4_zux_z6':
			var maxplace = 1;
			if(datasel.length > 1) {
				var place = 0;
				for (var i = 0; i < datasel[0].length; i++) {
					if(datasel[0][i] == '√') place++;
				}
        var dpsel = datasel[1];
        //dpsel = _.difference(_.xor(datasel[1], datasel[2]), datasel[2]);
				//var newsel = datasel[2];
        var withouta = _.clone(datasel[1]);
        withouta.unshift(newsel)
        //console.log(dpsel,newsel);
        var xor = _.xor(dpsel,newsel);
        var outdiff = _.without.apply(this,withouta);
        var jiaoji = _.intersection(newsel,dpsel);
        var topleft = [];
        if (jiaoji.length>0) {
          topleft =  _.xor(dpsel,jiaoji);
        }
        var autosumsols;
				var m = 4;
				// 任选4必须大于选了4位以上才能组成组合
				if(place >= m) {
					var h = ArrayUtil.ComNum(place, m);
          //console.log(h,place,m);

					if(h > 0) {// 组合数必须大于0
						for (var i = 0; i < maxplace; i++) {
							var s = dpsel.length;
              var autosumsols = Array.apply(null, {length: s}).map(Number.call, Number);
							// 组三必须选两位或者以上
              //console.log(outdiff,dpsel.length);
							if (s > 1) {
                // 组三必须选两位或者以上
                cmb = Combinatorics.combination(autosumsols,2);
                nums += cmb.length;
							}
						}
						nums *= h;
					}
				}
			}
			break;
   case 'rx4_zux_z4':
			var maxplace = 1;
			if(datasel.length > 1) {
				var place = 0;
				for (var i = 0; i < datasel[0].length; i++) {
					if(datasel[0][i] == '√') place++;
				}
        var dpsel = datasel[1];
        //dpsel = _.difference(_.xor(datasel[1], datasel[2]), datasel[2]);
				var newsel = datasel[2];
        var withouta = _.clone(datasel[1]);
        withouta.unshift(newsel)
        //console.log(dpsel,newsel);
        var xor = _.xor(dpsel,newsel);
        var outdiff = _.without.apply(this,withouta);
        var jiaoji = _.intersection(newsel,dpsel);
        var topleft = [];
        if (jiaoji.length>0) {
          topleft =  _.xor(dpsel,jiaoji);
        }
        var autosumsols;
				var m = 4;
				// 任选4必须大于选了4位以上才能组成组合
				if(place >= m) {
					var h = ArrayUtil.ComNum(place, m);
          //console.log(h,place,m);

					if(h > 0) {// 组合数必须大于0
						for (var i = 0; i < maxplace; i++) {
							var s = newsel.length;
							// 组三必须选两位或者以上
							if (s > 1) {
                //三重号部分
                if (dpsel.length==1) {
                  //console.log(outdiff,'outdiffoutdiff');
                  autosumsols = Array.apply(null, {length: outdiff.length}).map(Number.call, Number);
                  cmb = Combinatorics.combination(autosumsols,1);
                  nums += cmb.length;
                }else if(dpsel.length==10 && newsel.length==10) {
                  autosumsols = Array.apply(null, {length: newsel.length-1}).map(Number.call, Number);
                  cmb = Combinatorics.combination(autosumsols,1);
                  nums += cmb.length*dpsel.length;
                }else {
                  //其他情况
                  var allcount = [];
                  for (j = 0; j < dpsel.length; j++) {
                    //console.log(dpsel[j]);
                    var outthis = [];
                    outthis.push(dpsel[j]);
                    outthis.unshift(newsel);
                    var thisout = _.without.apply(this,outthis);
                    //console.log(thisout);
                    cmb = Combinatorics.combination(thisout,1);
                    nums += cmb.length*1;
                  }
                }
							}
						}
						nums *= h;
					}
				}
			}
			break;
   case 'rx4_zux_z12':
			var maxplace = 1;
			if(datasel.length > 1) {
				var place = 0;
				for (var i = 0; i < datasel[0].length; i++) {
					if(datasel[0][i] == '√') place++;
				}
        var dpsel = datasel[1];
        //dpsel = _.difference(_.xor(datasel[1], datasel[2]), datasel[2]);
				var newsel = datasel[2];
        var withouta = _.clone(datasel[1]);
        withouta.unshift(newsel)
        //console.log(dpsel,newsel);
        var xor = _.xor(dpsel,newsel);
        var outdiff = _.without.apply(this,withouta);
        var jiaoji = _.intersection(newsel,dpsel);
        var topleft = [];
        if (jiaoji.length>0) {
          topleft =  _.xor(dpsel,jiaoji);
        }
        var autosumsols;
				var m = 4;
				// 任选4必须大于选了4位以上才能组成组合
				if(place >= m) {
					var h = ArrayUtil.ComNum(place, m);
          //console.log(h,place,m);

					if(h > 0) {// 组合数必须大于0
						for (var i = 0; i < maxplace; i++) {
							var s = newsel.length;
              var autosumsols = Array.apply(null, {length: s}).map(Number.call, Number);
							// 组三必须选两位或者以上
              //console.log(outdiff,dpsel.length);
							if (s > 1) {
                //二重号部分
                if (dpsel.length==1) {
                  autosumsols = Array.apply(null, {length: outdiff.length}).map(Number.call, Number);
                  cmb = Combinatorics.combination(autosumsols,2);
                  nums += cmb.length;
                }else if (dpsel.length==10 && newsel.length==10) {
                  autosumsols = Array.apply(null, {length: newsel.length-1}).map(Number.call, Number);
                  cmb = Combinatorics.combination(autosumsols,2);
                  nums += cmb.length*dpsel.length;
                }else {
                  //其他情况
                  var allcount = [];
                  for (j = 0; j < dpsel.length; j++) {
                    //console.log(dpsel[j]);
                    var outthis = [];
                    outthis.push(dpsel[j]);
                    outthis.unshift(newsel);
                    var thisout = _.without.apply(this,outthis);
                    //console.log(thisout);
                    cmb = Combinatorics.combination(thisout,2);
                    nums += cmb.length*1;
                  }
                }
							}
						}
						nums *= h;
					}
				}
			}
			break;
		case 'rx3z6':
			var maxplace = 1;
			if(datasel.length > 1) {
				var place = 0;
				for (var i = 0; i < datasel[0].length; i++) {
					if(datasel[0][i] == '√') place++;
				}
				var newsel = datasel[1];
				var m = 3;
				// 任选3必须大于选了3位以上才能组成组合
				if(place >= m) {
					var h = ArrayUtil.ComNum(place, m);
					if(h > 0) {// 组合数必须大于0
						for (var i = 0; i < maxplace; i++) {
							var s = newsel.length;
							// 组六必须选三位或者以上
							if (s > 2) {
								nums += s * (s - 1) * (s - 2) / 6;
							}
						}
						nums *= h;
					}
				}
			}
			break;
		case 'rx2zx':
			var maxplace = 1;
			if(datasel.length > 1) {
				var place = 0;
				for (var i = 0; i < datasel[0].length; i++) {
					if(datasel[0][i] == '√') place++;
				}
				var newsel = datasel[1];
				var m = 2;
				// 任选2必须大于选了2位以上才能组成组合
				if(place >= m) {
					var h = ArrayUtil.ComNum(place, m);
					if(h > 0) {// 组合数必须大于0
						for (var i = 0; i < maxplace; i++) {
							var s = newsel.length;
							// 二码不定位必须选两位或者以上
							if (s > 1) {
								nums += s * (s - 1) / 2;
							}
						}
						nums *= h;
					}
				}
			}
			break;
		case 'rx2_zx_hz':
			var maxplace = 1;
			if(datasel.length > 1) {
				var place = 0;
				for (var i = 0; i < datasel[0].length; i++) {
					if(datasel[0][i] == '√') place++;
				}
				var newsel = datasel[1];
				var m = 2;
        if(place >= m) {
          var h = ArrayUtil.ComNum(place, m);
          if(h > 0) {// 组合数必须大于0
            var cc = {0 : 1,1 : 2,2 : 3,3 : 4,4 : 5,5 : 6,6 : 7,7 : 8,8 : 9,9 : 10,10 : 9,11 : 8,12 : 7,13 : 6,14 : 5,15 : 4,16 : 3,17 : 2,18 : 1};
            var s = newsel.length;
            for (var i = 0; i < s; i++) {
              // 二码不定位必须选两位或者以上
              nums += cc[parseInt(datasel[1][i], 10)];
              //nums += s * (s - 1) / 2;
            }
            nums *= h;
          }
        }
			}
			break;
		case 'rx3_zx_hz':
			var maxplace = 1;
			if(datasel.length > 1) {
				var place = 0;
				for (var i = 0; i < datasel[0].length; i++) {
					if(datasel[0][i] == '√') place++;
				}
				var newsel = datasel[1];
				var m = 3;
        if(place >= m) {
          var h = ArrayUtil.ComNum(place, m);
          if(h > 0) {// 组合数必须大于0
            var cc = {0 : 1,1 : 3,2 : 6,3 : 10,4 : 15,5 : 21,6 : 28,7 : 36,8 : 45,9 : 55,10 : 63,11 : 69,12 : 73,13 : 75,14 : 75,15 : 73,16 : 69,17 : 63,18 : 55,19 : 45,20 : 36,21 : 28,22 : 21,23 : 15,24 : 10,25 : 6,26 : 3,27 : 1};
            var s = newsel.length;
            for (var i = 0; i < s; i++) {
              // 二码不定位必须选两位或者以上
              nums += cc[parseInt(datasel[1][i], 10)];
              //nums += s * (s - 1) / 2;
            }
            nums *= h;
          }
        }
			}
			break;
    case 'rx2_zux_hz':
			var maxplace = 1;
			if(datasel.length > 1) {
				var place = 0;
				for (var i = 0; i < datasel[0].length; i++) {
					if(datasel[0][i] == '√') place++;
				}
				var newsel = datasel[1];
				var m = 2;
        var h = ArrayUtil.ComNum(place, m);
        if(h > 0) {// 组合数必须大于0
          var cc = {1 : 1,2 : 1,3 : 2,4 : 2,5 : 3,6 : 3,7 : 4,8 : 4,9 : 5,10 : 4,11 : 4,12 : 3,13 : 3,14 : 2,15 : 2,16 : 1,17 : 1};
          var s = newsel.length;
          for (var i = 0; i < s; i++) {
            // 二码不定位必须选两位或者以上
            nums += cc[parseInt(datasel[1][i], 10)];
            //nums += s * (s - 1) / 2;
          }
          nums *= h;
        }
			}
			break;
    case 'rx3_zux_hz':
			var maxplace = 1;
			if(datasel.length > 1) {
				var place = 0;
				for (var i = 0; i < datasel[0].length; i++) {
					if(datasel[0][i] == '√') place++;
				}
				var newsel = datasel[1];
				var m = 3;
        var h = ArrayUtil.ComNum(place, m);
        if(h > 0) {// 组合数必须大于0
          var cc = {0 : 1,1 : 1,2 : 2,3 : 2,4 : 4,5 : 5,6 : 6,7 : 8,8 : 10,9 : 11,10 : 13,11 : 14,12 : 14,13 : 15,14 : 15,15 : 14,16 : 14,17 : 13,18 : 11,19 : 10,20 : 8,21 : 6,22 : 5,23 : 4,24 : 2,25 : 2,26 : 1};
          var s = newsel.length;
          for (var i = 0; i < s; i++) {
            // 二码不定位必须选两位或者以上
            nums += cc[parseInt(datasel[1][i], 10)];
            //nums += s * (s - 1) / 2;
          }
          nums *= h;
        }
			}
			break;
		case 'rx2ds':
		case 'rx3ds':
		case 'rx4ds':
			if(datasel.length > 1) {
				var place = 0;
				for (var i = 0; i < datasel[0].length; i++) {
					if(datasel[0][i] == '√') place++;
				}
				var newsel = [];
				for (var i = 1; i < datasel.length; i++) {
					newsel.push(datasel[i]);
				}
				var m = 0;
				if(type == 'rx2ds') {
					m = 2;
				}
				if(type == 'rx3ds') {
					m = 3;
				}
				if(type == 'rx4ds') {
					m = 4;
				}
				// 任选2必须大于选了2位以上才能组成组合
				if(place >= m) {
					var h = ArrayUtil.ComNum(place, m);
					if(h > 0) {// 组合数必须大于0
						nums += _inputCheck_Num(newsel, m).length;
						nums *=  h;
					}
				}
			}
			break;
		case 'rx3hh':
			if(datasel.length > 1) {
				var place = 0;
				for (var i = 0; i < datasel[0].length; i++) {
					if(datasel[0][i] == '√') place++;
				}
				var newsel = [];
				for (var i = 1; i < datasel.length; i++) {
					newsel.push(datasel[i]);
				}
				var m = 3;
				// 任选3必须大于选了3位以上才能组成组合
				if(place >= m) {
					var h = ArrayUtil.ComNum(place, m);
					if(h > 0) {// 组合数必须大于0
						nums = _inputCheck_Num(newsel, 3, _HHZXCheck_Num, true).length;
						nums *= h;
					}
				}
			}
			break;
		case 'wxzhixds':
			nums = _inputCheck_Num(datasel, 5).length;
			break;
		case 'sixzhixdsh':
		case 'sixzhixdsq':
			nums = _inputCheck_Num(datasel, 4).length;
			break;
		case 'sxzhixdsh':
		case 'sxzhixdsz':
		case 'sxzhixdsq':
			nums = _inputCheck_Num(datasel, 3).length;
			break;
		case 'sxhhzxh':
		case 'sxhhzxz':
		case 'sxhhzxq':
			nums = _inputCheck_Num(datasel, 3, _HHZXCheck_Num, true).length;
			break;
		case 'exzhixdsh':
		case 'exzhixdsq':
			nums = _inputCheck_Num(datasel, 2).length;
			break;
		case 'exzuxdsh':
		case 'exzuxdsq':
			nums = _inputCheck_Num(datasel, 2, _HHZXCheck_Num, true).length;
			break;
		case 'wxzux120':
			var s = datasel[0].length;
			if (s > 4) {
				nums += ArrayUtil.ComNum(s, 5);
			}
			break;
		case 'wxzux60':
		case 'wxzux30':
		case 'wxzux20':
		case 'wxzux10':
		case 'wxzux5':
			var minchosen = new Array();
			if(type == 'wxzux60') {
				minchosen = [1, 3];
			}
			if(type == 'wxzux30') {
				minchosen = [2, 1];
			}
			if(type == 'wxzux20') {
				minchosen = [1, 2];
			}
			if(type == 'wxzux10' || type == 'wxzux5') {
				minchosen = [1, 1];
			}
			if(datasel[0].length >= minchosen[0] && datasel[1].length >= minchosen[1]) {
				var h = ArrayUtil.intersect(datasel[0], datasel[1]).length;
				tmp_nums = ArrayUtil.ComNum(datasel[0].length, minchosen[0]) * ArrayUtil.ComNum(datasel[1].length, minchosen[1]);
				if (h > 0) {
					if (type == 'wxzux60') {
						tmp_nums -= ArrayUtil.ComNum(h, 1) * ArrayUtil.ComNum(datasel[1].length - 1, 2);
					}
					if (type == 'wxzux30') {
						tmp_nums -= ArrayUtil.ComNum(h, 2) * ArrayUtil.ComNum(2, 1);
						if (datasel[0].length - h > 0) {
							tmp_nums -= ArrayUtil.ComNum(h, 1) * ArrayUtil.ComNum(datasel[0].length - h, 1);
						}
					}
					if (type == 'wxzux20') {
						tmp_nums -= ArrayUtil.ComNum(h, 1) * ArrayUtil.ComNum(datasel[1].length - 1, 1);
					}
					if (type == 'wxzux10' || type == 'wxzux5') {
						tmp_nums -= ArrayUtil.ComNum(h, 1);
					}
				}
				nums += tmp_nums;
			}
			break;
		case 'sixzux24h':
		case 'sixzux24q':
			var s = datasel[0].length;
			if (s > 3) {
				nums += ArrayUtil.ComNum(s, 4);
			}
			break;
		case 'sixzux6h':
		case 'sixzux6q':
			var minchosen = [2];
			if (datasel[0].length >= minchosen[0]) {
				nums += ArrayUtil.ComNum(datasel[0].length, minchosen[0]);
			}
			break;
		case 'sixzux12h':
		case 'sixzux12q':
		case 'sixzux4h':
		case 'sixzux4q':
			var minchosen = new Array();
			if(type == 'sixzux12h' || type == 'sixzux12q') {
				minchosen = [1, 2];
			}
			if(type == 'sixzux4h' || type == 'sixzux4q') {
				minchosen = [1, 1];
			}
			if (datasel[0].length >= minchosen[0] && datasel[1].length >= minchosen[1]) {
				var h = ArrayUtil.intersect(datasel[0], datasel[1]).length;
				tmp_nums = ArrayUtil.ComNum(datasel[0].length, minchosen[0]) * ArrayUtil.ComNum(datasel[1].length, minchosen[1]);
				if (h > 0) {
					if (type == 'sixzux12h' || type == 'sixzux12q') {
						tmp_nums -= ArrayUtil.ComNum(h, 1) * ArrayUtil.ComNum(datasel[1].length - 1, 1);
					}
					if (type == 'sixzux4h' || type == 'sixzux4q') {
						tmp_nums -= ArrayUtil.ComNum(h, 1);
					}
				}
				nums += tmp_nums;
			}
			break;
		case 'sxzuxzsh':
		case 'sxzuxzsz':
		case 'sxzuxzsq':
			var maxplace = 1;
			for (var i = 0; i < maxplace; i++) {
				var s = datasel[i].length;
				// 组三必须选两位或者以上
				if (s > 1) {
					nums += s * (s - 1);
				}
			}
			break;
		case 'sxzuxzlh':
		case 'sxzuxzlz':
		case 'sxzuxzlq':
			var maxplace = 1;
			for (var i = 0; i < maxplace; i++) {
				var s = datasel[i].length;
				// 组六必须选三位或者以上
				if (s > 2) {
					nums += s * (s - 1) * (s - 2) / 6;
				}
			}
			break;
		case 'wxzhixzh':
		case 'sixzhixzhh':
		case 'sixzhixzhq':
			var maxplace = 0;
			if('wxzhixzh' == type) {
				maxplace = 5;
			}
			if('sixzhixzhh' == type || 'sixzhixzhq' == type) {
				maxplace = 4;
			}
			for (var i = 0; i < maxplace; i++) {
				// 有位置上没有选择
				if (datasel[i].length == 0) {
					tmp_nums = 0; break;
				}
				tmp_nums *= datasel[i].length;
			}
			nums += tmp_nums * maxplace;
			break;
		case 'sxzhixhzh':
		case 'sxzhixhzz':
		case 'sxzhixhzq':
		case 'exzhixhzh':
		case 'exzhixhzq':
			var cc = {0 : 1,1 : 3,2 : 6,3 : 10,4 : 15,5 : 21,6 : 28,7 : 36,8 : 45,9 : 55,10 : 63,11 : 69,12 : 73,13 : 75,14 : 75,15 : 73,16 : 69,17 : 63,18 : 55,19 : 45,20 : 36,21 : 28,22 : 21,23 : 15,24 : 10,25 : 6,26 : 3,27 : 1};
			if(type == 'exzhixhzh' || type == 'exzhixhzq') {
				cc = {0 : 1,1 : 2,2 : 3,3 : 4,4 : 5,5 : 6,6 : 7,7 : 8,8 : 9,9 : 10,10 : 9,11 : 8,12 : 7,13 : 6,14 : 5,15 : 4,16 : 3,17 : 2,18 : 1};
			}
		    for (var i = 0; i < datasel[0].length; i++) {
		    	nums += cc[parseInt(datasel[0][i], 10)];
			}
		    break;
		case 'qsm_zux_hz':
		case 'zsm_zx_hz':
		case 'hsm_zux_hz':
      var cc = {0 : 1,1 : 1,2 : 2,3 : 2,4 : 4,5 : 5,6 : 6,7 : 8,8 : 10,9 : 11,10 : 13,11 : 14,12 : 14,13 : 15,14 : 15,15 : 14,16 : 14,17 : 13,18 : 11,19 : 10,20 : 8,21 : 6,22 : 5,23 : 4,24 : 2,25 : 2,26 : 1};
			//if(type == 'exzhixhzh' || type == 'exzhixhzq') {
			//	cc = {0 : 1,1 : 2,2 : 3,3 : 4,4 : 5,5 : 6,6 : 7,7 : 8,8 : 9,9 : 10,10 : 9,11 : 8,12 : 7,13 : 6,14 : 5,15 : 4,16 : 3,17 : 2,18 : 1};
			//}
		  for (var i = 0; i < datasel[0].length; i++) {
		    	nums += cc[parseInt(datasel[0][i], 10)];
			}
		  break;
		case 'em_zux_qhz':
    case 'em_zux_hhz':
      var cc = {1 : 1,2 : 1,3 : 2,4 : 2,5 : 3,6 : 3,7 : 4,8 : 4,9 : 5,10 : 4,11 : 4,12 : 3,13 : 3,14 : 2,15 : 2,16 : 1,17 : 1};
		  for (var i = 0; i < datasel[0].length; i++) {
		    	nums += cc[parseInt(datasel[0][i], 10)];
			}
		  break;
    case 'ssc_zxkd_qs':
    case 'ssc_zxkd_zs':
    case 'ssc_zxkd_hs':
      var cc = {0 : 10,1 : 54,2 : 96,3 : 126,4 : 144,5 : 150,6 : 144,7 : 126,8 : 96,9 : 54};
		  for (var i = 0; i < datasel[0].length; i++) {
		    	nums += cc[parseInt(datasel[0][i], 10)];
			}
		  break;
    case 'ssc_zxkd_qer':
    case 'ssc_zxkd_her':
      var cc = {0 : 10,1 : 18,2 : 16,3 : 14,4 : 12,5 : 10,6 : 8,7 : 6,8 : 4,9 : 2};
		  for (var i = 0; i < datasel[0].length; i++) {
		    nums += cc[parseInt(datasel[0][i], 10)];
			}
		  break;
    case 'ssc_zuxbd_qs':
    case 'ssc_zuxbd_zs':
    case 'ssc_zuxbd_hs':
      var cc = {0 : 54,1 : 54,2 : 54,3 : 54,4 : 54,5 : 54,6 : 54,7 : 54,8 : 54,9 : 54};
		  for (var i = 0; i < datasel[0].length; i++) {
		    	nums += cc[parseInt(datasel[0][i], 10)];
			}
		  break;
    case 'ssc_zxbd_qer':
    case 'ssc_zxbd_her':
      var cc = {0 : 9,1 : 9,2 : 9,3 : 9,4 : 9,5 : 9,6 : 9,7 : 9,8 : 9,9 : 9};
		  for (var i = 0; i < datasel[0].length; i++) {
		    	nums += cc[parseInt(datasel[0][i], 10)];
			}
		  break;
    case 'sschzws_qs':
    case 'sschzws_zs':
    case 'sschzws_hs':
      var cc = {0 : 1,1 : 1,2 : 1,3 : 1,4 : 1,5 : 1,6 : 1,7 : 1,8 : 1,9 : 1};
		  for (var i = 0; i < datasel[0].length; i++) {
		    	nums += cc[parseInt(datasel[0][i], 10)];
			}
		  break;
    case 'ssctesh_qs':
    case 'ssctesh_zs':
    case 'ssctesh_hs':
      var cc = {'豹子' : 1,'顺子' : 1,'对子' : 1,'半顺' : 1,'杂六' : 1};
			//if(type == 'exzhixhzh' || type == 'exzhixhzq') {
			//	cc = {0 : 1,1 : 2,2 : 3,3 : 4,4 : 5,5 : 6,6 : 7,7 : 8,8 : 9,9 : 10,10 : 9,11 : 8,12 : 7,13 : 6,14 : 5,15 : 4,16 : 3,17 : 2,18 : 1};
			//}
		  for (var i = 0; i < datasel[0].length; i++) {
		    	nums += cc[datasel[0][i]];
			}
		  break;
    case 'ssc5x_sumdxds':
      var cc = {'总和大' : 1,'总和小' : 1,'总和单' : 1,'总和双' : 1};
		  for (var i = 0; i < datasel[0].length; i++) {
		    	nums += cc[datasel[0][i]];
			}
		  break;
    case 'rx2fs':
		case 'rx3fs':
		case 'rx4fs':
			var minplace = 0;
			if(type == 'rx2fs') {
				minplace = 2;
			}
			if(type == 'rx3fs') {
				minplace = 3;
			}
			if(type == 'rx4fs') {
				minplace = 4;
			}
			var newsel = [];
			for (var i = 0; i < datasel.length; i++) {
				if(datasel[i].length != 0) {
					newsel.push(datasel[i]);
				}
			}
			// 最少位数
			if(newsel.length >= minplace) {
				var l = ArrayUtil.ComNum(newsel.length, minplace);
				for (var i = 0; i < l; i++) {
					tmp_nums = 1;
					var data = ArrayUtil.ComVal(newsel, minplace, i);
					for (var j = 0; j < data.length; j++) {
						tmp_nums *= data[j].length;
					}
					nums += tmp_nums;
				}
			}
			break;
		case 'dw': //定位胆所有在一起特殊处理
			var maxplace = 5;
			for (var i = 0; i < maxplace; i++) {
				nums += datasel[i].length;
			}
			break;
		case 'bdw2mh':
		case 'bdw2mz':
		case 'bdw2mq':
		case 'exzuxfsh':
		case 'exzuxfsq':
			var maxplace = 1;
			for (var i = 0; i < maxplace; i++) {
				var s = datasel[i].length;
				// 二码不定位必须选两位或者以上
				if (s > 1) {
					nums += s * (s - 1) / 2;
				}
			}
			break;
		case 'kdqs':
		case 'kdzs':
		case 'kdhs':
		case 'kdqe':
		case 'kdhe':
			var cc = {0 : 10,1 : 54,2 : 96,3 : 126,4 : 144,5 : 150,6 : 144,7 : 126,8 : 96,9 : 54};
			if(type == 'kdqe' || type == 'kdhe') {
				cc = {0 : 10,1 : 18,2 : 16,3 : 14,4 : 12,5 : 10,6 : 8,7 : 6,8 : 4,9 : 2};
			}
		    for (var i = 0; i < datasel[0].length; i++) {
		    	nums += cc[parseInt(datasel[0][i], 10)];
			}
		    break;
		default:
			var maxplace = 0;
			switch (type) {
			case 'wxzhixfs':
				maxplace = 5;
				break;
			case 'sixzhixfsh':
			case 'sixzhixfsq':
				maxplace = 4;
				break;
			case 'sxzhixfsh':
			case 'sxzhixfsz':
			case 'sxzhixfsq':
				maxplace = 3;
				break;
			case 'exzhixfsh':
			case 'exzhixfsq':
			case 'dxdsh':
			case 'dxdsq':
				maxplace = 2;
				break;
      case 'bdd_bdd_wx2':
      case 'bdd_bdd_qsix2':
      case 'bdd_bdd_hsix2':
        var dpsel = datasel[0];
        if (dpsel.length>0) {
          var autosumsols = Array.apply(null, {length: dpsel.length}).map(Number.call, Number);
          if (autosumsols.length>1) {
            cmb = Combinatorics.combination(autosumsols,2);
            nums = cmb.length;
          }else {
            nums = 0;
          }
        }else {
          nums = 0;
        }
        break;
      case 'bdd_bdd_wx3':
        var dpsel = datasel[0];
        var autosumsols = Array.apply(null, {length: dpsel.length}).map(Number.call, Number);
        if (autosumsols.length>2) {
          cmb = Combinatorics.combination(autosumsols,3);
          nums = cmb.length;
        }else {
          nums = 0;
        }
        //cmb = Combinatorics.combination(autosumsols,3);
        //nums = cmb.length;
        break;
			case 'bdw1mh':
			case 'bdw1mz':
			case 'bdw1mq':
			case 'qwyffs':
			case 'qwhscs':
			case 'qwsxbx':
			case 'qwsjfc':
			case 'lhwq':
			case 'lhwb':
			case 'lhws':
			case 'lhwg':
			case 'lhqb':
			case 'lhqs':
			case 'lhqg':
			case 'lhbs':
			case 'lhbg':
			case 'lhsg':
      case 'bdd_bdd_wx1':
      case 'bdd_bdd_qsix1':
      case 'bdd_bdd_hsix1':
				maxplace = 1;
				break;
			}
			if(datasel.length == maxplace) {
				for (var i = 0; i < maxplace; i++) {
					// 有位置上没有选择
					if (datasel[i].length == 0) {
						tmp_nums = 0; break;
					}
					tmp_nums *= datasel[i].length;
				}
				nums += tmp_nums;
			}
		}
		return nums;
	}

	var _formatSelect_Num = function(datasel, m, n) {
		var newsel = new Array();
		if(!m) m = 0;
		if(!n) n = 0;
		for (var i = 0; i < m; i++) {
			newsel.push('-');
		}
		for (var i = 0; i < datasel.length; i++) {
			var f = datasel[i].toString().replace(/\,/g, '');
			if(f == '') {
				newsel.push('-');
			} else {
				newsel.push(f);
			}
		}
		for (var i = 0; i < n; i++) {
			newsel.push('-');
		}
		return newsel.toString();
	}

	var _formatTextarea_Num = function(type, datasel) {
		switch (type) {
		case 'wxzhixds':
			datasel = _inputCheck_Num(datasel, 5);
			break;
		case 'sixzhixdsh':
		case 'sixzhixdsq':
			datasel = _inputCheck_Num(datasel, 4);
			break;
		case 'sxzhixdsh':
		case 'sxzhixdsz':
		case 'sxzhixdsq':
			datasel = _inputCheck_Num(datasel, 3);
			break;
		case 'sxhhzxh':
		case 'sxhhzxz':
		case 'sxhhzxq':
			datasel = _inputCheck_Num(datasel, 3, _HHZXCheck_Num, true);
			break;
		case 'exzhixdsh':
		case 'exzhixdsq':
			datasel = _inputCheck_Num(datasel, 2);
			break;
		case 'exzuxdsh':
		case 'exzuxdsq':
			datasel = _inputCheck_Num(datasel, 2, _HHZXCheck_Num, true);
			break;
		case 'rx2ds':
		case 'rx3ds':
		case 'rx4ds':
			if(datasel.length > 1) {
				var place = 0;
				for (var i = 0; i < datasel[0].length; i++) {
					if(datasel[0][i] == '√') place++;
				}
				var newsel = [];
				for (var i = 1; i < datasel.length; i++) {
					newsel.push(datasel[i]);
				}
				var m = 0;
				if(type == 'rx2ds') {
					m = 2;
				}
				if(type == 'rx3ds') {
					m = 3;
				}
				if(type == 'rx4ds') {
					m = 4;
				}
				// 任选2必须大于选了2位以上才能组成组合
				if(place >= m) {
					var h = ArrayUtil.ComNum(place, m);
					if(h > 0) {// 组合数必须大于0
						return '[' + datasel[0] + ']' + _inputCheck_Num(newsel, m);
					}
				}
			}
			break;
		case 'rx3hh':
			if(datasel.length > 1) {
				var place = 0;
				for (var i = 0; i < datasel[0].length; i++) {
					if(datasel[0][i] == '√') place++;
				}
				var newsel = [];
				for (var i = 1; i < datasel.length; i++) {
					newsel.push(datasel[i]);
				}
				var m = 3;
				// 任选3必须大于选了3位以上才能组成组合
				if(place >= m) {
					var h = ArrayUtil.ComNum(place, m);
					if(h > 0) {// 组合数必须大于0
						return '[' + datasel[0] + ']' + _inputCheck_Num(newsel, 3, _HHZXCheck_Num, true);
					}
				}
			}
			break;
		default:
			break;
		}
		return datasel.toString().replace(/\,/g, ' ');
	}

	var _inputFormat = function(type, datasel) {
		switch (type) {
		case 'wxzhixds':
		case 'sixzhixdsh':
		case 'sixzhixdsq':
		case 'sxzhixdsh':
		case 'sxzhixdsz':
		case 'sxzhixdsq':
		case 'sxhhzxh':
		case 'sxhhzxz':
		case 'sxhhzxq':
		case 'exzhixdsh':
		case 'exzhixdsq':
		case 'exzuxdsh':
		case 'exzuxdsq':
		case 'rx2ds':
		case 'rx3ds':
		case 'rx3hh':
		case 'rx4ds':
			return _formatTextarea_Num(type, datasel);
		case 'rx3z3':
		case 'rx3z6':
		case 'rx2zx':
		case 'rx4_zux_z24':
    //case 'rx4_zux_z12':
			var space = datasel[0];
			return '[' + space + ']' + ArrayUtil.remove(datasel, 0).toString();
    case 'rx4_zux_z12':
		case 'rx4_zux_z4':
			var space = datasel[0];
      //console.log(datasel[1],datasel[2]);
			return '[' + space + ']' + datasel[1].join('')+','+datasel[2].join('');
    case 'rx4_zux_z6':
			var space = datasel[0];
      //console.log(datasel[1],datasel[2]);
			return '[' + space + ']' + datasel[1].join(',');
    case 'rx2_zx_hz':
    case 'rx2_zux_hz':
    case 'rx3_zx_hz':
    case 'rx3_zux_hz':
			var space = datasel[0];
			return '[' + space + ']' + ArrayUtil.remove(datasel, 0).toString();
		case 'wxzux120':
		case 'sixzux24h':
		case 'sixzux24q':
		case 'sixzux6h':
		case 'sixzux6q':
		case 'sxzuxzsh':
		case 'sxzuxzsz':
		case 'sxzuxzsq':
		case 'sxzuxzlh':
		case 'sxzuxzlz':
		case 'sxzuxzlq':
		case 'exzuxfsh':
		case 'exzuxfsq':
		case 'bdw1mh':
		case 'bdw1mz':
		case 'bdw1mq':
		case 'bdw2mh':
		case 'bdw2mz':
		case 'bdw2mq':
		case 'qwyffs':
		case 'qwhscs':
		case 'qwsxbx':
		case 'qwsjfc':
		case 'sxzhixhzh':
		case 'sxzhixhzz':
		case 'sxzhixhzq':
		case 'exzhixhzh':
		case 'exzhixhzq':
		case 'kdqs':
		case 'kdzs':
		case 'kdhs':
		case 'kdqe':
		case 'kdhe':
                case 'hsm_zux_hz':
			return datasel.toString();
		case 'lhwq':
		case 'lhwb':
		case 'lhws':
		case 'lhwg':
		case 'lhqb':
		case 'lhqs':
		case 'lhqg':
		case 'lhbs':
		case 'lhbg':
		case 'lhsg':
			return datasel[0].toString().replace(/\,/g , '|');
		case 'ssc5x_sumdxds':
    case 'ssctesh_qs':
    case 'ssctesh_zs':
    case 'ssctesh_hs':
    case 'qsm_zux_hz':
    case 'em_zux_qhz':
    case 'em_zux_hhz':
      return datasel[0].toString();
    case 'sixzhixfsh':
		case 'sixzhixzhh':
			return _formatSelect_Num(datasel, 1);
		case 'sixzhixfsq':
		case 'sixzhixzhq':
			return _formatSelect_Num(datasel, 0, 1);
		case 'sxzhixfsh':
			return _formatSelect_Num(datasel, 2);
		case 'sxzhixfsz':
			return _formatSelect_Num(datasel, 1, 1);
		case 'sxzhixfsq':
			return _formatSelect_Num(datasel, 0, 2);
		case 'exzhixfsh':
			return _formatSelect_Num(datasel, 3);
		case 'exzhixfsq':
			return _formatSelect_Num(datasel, 0, 3);
		default:
			return _formatSelect_Num(datasel);
		}
	}

	var _typeFormat = function(code) {
		var a = [code[0], code[1], code[2]];
		var b = [code[2], code[3], code[4]];
		var _a = a.uniquelize();
		var _b = b.uniquelize();
		var arr = [];
		if(_a.length == 1) arr[0] = '豹子';
		if(_a.length == 2) arr[0] = '组三';
		if(_a.length == 3) arr[0] = '组六';
		if(_b.length == 1) arr[1] = '豹子';
		if(_b.length == 2) arr[1] = '组三';
		if(_b.length == 3) arr[1] = '组六';
		return arr;
	}

	return {
    namespace:'ssc',
		inputNumbers: _inputNumbers,
		inputFormat: _inputFormat,
		typeFormat: _typeFormat
	}
}();

/**
 * TODO 彩票投注主要方法
 */
var LotteryMain = function() {

	var $Lottery; // 彩票
	var $DownCode; // 降点
	var $FenDownCode; // 分模式降点
	var $LiDownCode; // 厘模式讲点

	var $Method; // 彩票玩法

	var $SysCode; // 系统号级别
  var $SysBaseCode; // 系统号基础奖金
	var $SysUnitMoney; // 单注金额

	var $UserCode; // 用户号级别
	var $UserLp; // 用户定位返点
	var $UserMaxCode; // 用户最高号
	var $UserMinCode; // 用户最低号

	var $bData = {}, $bList = [];

	// 布局
	var Layout = [
    {
      title: '五星',
      rows: [[{
        title: '五星直选',
        columns: [{
          showname: '复式',
          shortname: 'wxzhixfs',
          realname: '[五星_复式]',
          tips: '从万位、千位、百位、十位、个位各选一个号码组成一注。',
          example: '投注方案：23456；<br />开奖号码：23456，<br />',
          help: '从万、千、百、十、个位中选择一个5位号码组成一注，所选号码与开奖号码全部相同，且顺序一致，即为中奖。',
          select: {
            layout: [{
              title: '万位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '千位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '百位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '十位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '个位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '单式',
          shortname: 'wxzhixds',
          realname: '[五星_单式]',
          tips: '手动输入号码，至少输入1个五位数号码组成一注。',
          example: '投注方案：23456； 开奖号码：23456，即中五星直选一等奖',
          help: '手动输入一个5位数号码组成一注，所选号码的万位、千位、百位、十位、个位与开奖号码相同，且顺序一致，即为中奖。',
          textarea: {},
          compress: true
        }, {
          showname: '组合',
          shortname: 'wxzhixzh',
          realname: '[五星_组合]',
          tips: '从个、十、百、千、万位各选一个号码组成五注。',
          example: '五星组合示例，如购买：4+5+6+7+8，该票共10元，由以下5注：45678(五星)、5678(四星)、678(三星)、78(二星)、8(一星)构成。开奖号码：45678，即可中五星、四星、三星、二星、一星的一等奖各1注。',
          help: '从万、千、百、十、个中至少各选一个号码组成1-5星的组合，共五注，所选号码的个位与开奖号码相同，则中1个5等奖；所选号码的个位、十位与开奖号码相同，则中1个5等奖以及1个4等奖，依此类推，最高可中5个奖。',
          select: {
            layout: [{
              title: '万位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '千位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '百位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '十位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '个位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }]
      }], [{
        title: '五星组选',
        columns: [{
          showname: '组选120',
          shortname: 'wxzux120',
          realname: '[五星_组选120]',
          tips: '从0-9中选择5个号码组成一注。',
          example: '投注方案：02568，开奖号码的五个数字只要包含0、2、5、6、8，即可中五星组选120一等奖。',
          help: '从0-9中任意选择5个号码组成一注，所选号码与开奖号码的万位、千位、百位、十位、个位相同，顺序不限，即为中奖。',
          select: {
            layout: [{
              title: '选号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '组选60',
          shortname: 'wxzux60',
          realname: '[五星_组选60]',
          tips: '从“二重号”选择一个号码，“单号”中选择三个号码组成一注。',
          example: '投注方案：二重号：8，单号：0、2、5，只要开奖的5个数字包括 0、2、5、8、8，即可中五星组选60一等奖。',
          help: '选择1个二重号码和3个单号号码组成一注，所选的单号号码与开奖号码相同，且所选二重号码在开奖号码中出现了2次，即为中奖。',
          select: {
            layout: [{
              title: '二重号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '单　号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '组选30',
          shortname: 'wxzux30',
          realname: '[五星_组选30]',
          tips: '从“二重号”选择两个号码，“单号”中选择一个号码组成一注。',
          example: '投注方案：二重号：2、8，单号：0，只要开奖的5个数字包括 0、2、2、8、8，即可中五星组选30一等奖。',
          help: '选择2个二重号和1个单号号码组成一注，所选的单号号码与开奖号码相同，且所选的2个二重号码分别在开奖号码中出现了2次，即为中奖。',
          select: {
            layout: [{
              title: '二重号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '单　号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '组选20',
          shortname: 'wxzux20',
          realname: '[五星_组选20]',
          tips: '从“三重号”选择一个号码，“单号”中选择两个号码组成一注。',
          example: '投注方案：三重号：8，单号：0、2，只要开奖的5个数字包括 0、2、8、8、8，即可中五星组选20一等奖。',
          help: '选择1个三重号码和2个单号号码组成一注，所选的单号号码与开奖号码相同，且所选三重号码在开奖号码中出现了3次，即为中奖。',
          select: {
            layout: [{
              title: '三重号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '单　号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '组选10',
          shortname: 'wxzux10',
          realname: '[五星_组选10]',
          tips: '从“三重号”选择一个号码，“二重号”中选择一个号码组成一注。',
          example: '投注方案：三重号：8，二重号：2，只要开奖的5个数字包括 2、2、8、8、8，即可中五星组选10一等奖。',
          help: '选择1个三重号码和1个二重号码，所选三重号码在开奖号码中出现3次，并且所选二重号码在开奖号码中出现了2次，即为中奖。',
          select: {
            layout: [{
              title: '三重号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '二重号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '组选5',
          shortname: 'wxzux5',
          realname: '[五星_组选5]',
          tips: '从“四重号”选择一个号码，“单号”中选择一个号码组成一注。',
          example: '投注方案：四重号：8，单号：2，只要开奖的5个数字包括 2、8、8、8、8，即可中五星组选5一等奖。',
          help: '选择1个四重号码和1个单号号码组成一注，所选的单号号码与开奖号码相同，且所选四重号码在开奖号码中出现了4次，即为中奖。',
          select: {
            layout: [{
              title: '四重号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '单　号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }]
      }], [{
        title: '五星其他',
        columns: [{
          showname: '总和大小单双',
          shortname: 'ssc5x_sumdxds',
          realname: '[总和大小单双]',
          tips: '选择一个号码形态。',
          example: '投注方案：总和大，开奖号码：16568，开奖号码的总和26，即中总和大',
          help: '从四个形态中任意选择1个形态或多个形态组成一注，所选号码形态与开奖号码的总和形态一直，即为中奖。',
          select: {
            layout: [{
              title: '选号',
              balls: ['总和大','总和小','总和单','总和双'],
              cls:'long'
            }]
          }
        }]
      }]]
    }, {
      title: '后四',
      rows: [[{
        title: '后四直选',
        columns: [{
          showname: '复式',
          shortname: 'sixzhixfsh',
          realname: '[后四星_复式]',
          tips: '从千位、百位、十位、个位各选一个号码组成一注',
          example: '投注方案：3456；开奖号码：*3456，即中四星直选。',
          help: '从千位、百位、十位、个位中选择一个4位数号码组成一注，所选号码与开奖号码相同，且顺序一致，即为中奖。',
          select: {
            layout: [{
              title: '千位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '百位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '十位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '个位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '单式',
          shortname: 'sixzhixdsh',
          realname: '[后四星_单式]',
          tips: '手动输入号码，至少输入1个四位数号码组成一注。',
          example: '投注方案：3456； 开奖号码：3456，即中四星直选一等奖',
          help: '手动输入一个4位数号码组成一注，所选号码的千位、百位、十位、个位与开奖号码相同，且顺序一致，即为中奖。',
          textarea: {},
          compress: true
        }, {
          showname: '组合',
          shortname: 'sixzhixzhh',
          realname: '[后四星_组合]',
          tips: '在千位，百位，十位，个位任意位置上各选一个号码组成四注',
          example: '投注方案：购买5678，含以下4注：5678(四星)、678(三星)、78(二星)、8(一星)构成<br>开奖号码：45678，即可中四星、三星、二星、一星各1注',
          help: '从千位、百位、十位、个位中至少各选一个号码组成1-4星的组合，共四注，所选号码的个位与开奖号码全部相同，则中1个4等奖；所选号码的个位、十位与开奖号码相同，则中1个4等奖以及1个3等奖，依此类推，最高可中4个奖',
          select: {
            layout: [{
              title: '千位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '百位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '十位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '个位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }]
      }], [{
        title: '后四组选',
        columns: [{
          showname: '组选24',
          shortname: 'sixzux24h',
          realname: '[后四星_组选24]',
          tips: '从0-9中选择4个号码组成一注。',
          example: '投注方案：0568，开奖号码的四个数字只要包含0、5、6、8，即可中四星组选24一等奖。',
          help: '从0-9中任意选择4个号码组成一注，所选号码与开奖号码的千位、百位、十位、个位相同，且顺序不限，即为中奖。',
          select: {
            layout: [{
              title: '选号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '组选12',
          shortname: 'sixzux12h',
          realname: '[后四星_组选12]',
          tips: '从“二重号”选择一个号码，“单号”中选择两个号码组成一注。',
          example: '投注方案：二重号：8，单号：0、6，只要开奖的四个数字包括 0、6、8、8，即可中四星组选12一等奖。',
          help: '选择1个二重号码和2个单号号码组成一注，所选单号号码与开奖号码相同，且所选二重号码在开奖号码中出现了2次，即为中奖。',
          select: {
            layout: [{
              title: '二重号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '单　号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '组选6',
          shortname: 'sixzux6h',
          realname: '[后四星_组选6]',
          tips: '从“二重号”选择两个号码组成一注。',
          example: '投注方案：二重号28<br>开奖号码：62288（顺序不限），即可中四星组选6',
          help: '选择2个二重号码组成一注，所选的2个二重号码在开奖号码的千位、百位、十位、个位中分别出现了2次，即为中奖',
          select: {
            layout: [{
              title: '二重号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '组选4',
          shortname: 'sixzux4h',
          realname: '[后四星_组选4]',
          tips: '从“三重号”中选择一个号码，“单号”中选择一个号码组成一注。',
          example: '投注方案：三重号8，单号2<br>开奖号码：68828（顺序不限），即可中四星组选4',
          help: '选择1个三重号码和1个单号号码组成一注，所选号码与开奖号码的千位、百位、十位、个位相同，且所选三重号码在开奖号码中出现了3次，即为中奖',
          select: {
            layout: [{
              title: '三重号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '单　号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }]
      }]]
    }, {
      title: '前四',
      rows: [[{
        title: '前四直选',
        columns: [{
          showname: '复式',
          shortname: 'sixzhixfsq',
          realname: '[前四星_复式]',
          tips: '从万位、千位、百位、十位中选择一个4位数号码组成一注',
          example: '投注方案：3456；开奖号码：3456*，即中四星直选。',
          help: '从万、千、百、十中选择一个4位数号码组成一注，所选号码与开奖号码相同，且顺序一致，即为中奖。',
          select: {
            layout: [{
              title: '万位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '千位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '百位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '十位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '单式',
          shortname: 'sixzhixdsq',
          realname: '[前四星_单式]',
          tips: '手动输入号码，至少输入1个四位数号码组成一注。',
          example: '投注方案：3456； 开奖号码：3456，即中四星直选一等奖',
          help: '手动输入一个4位数号码组成一注，所选号码的千位、百位、十位、个位与开奖号码相同，且顺序一致，即为中奖。',
          textarea: {},
          compress: true
        }, {
          showname: '组合',
          shortname: 'sixzhixzhq',
          realname: '[前四星_组合]',
          tips: '在万位、千位、百位、十位任意位置上任意选择1个或1个以上号码。',
          example: '投注方案：1；开奖号码万位：1，即中定位胆万位一等奖。',
          help: '从万、千、百、十位任意位置上至少选择1个以上号码，所选号码与相同位置上的开奖号码一致，即为中奖。',
          select: {
            layout: [{
              title: '万位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '千位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '百位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '十位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }]
      }], [{
        title: '前四组选',
        columns: [{
          showname: '组选24',
          shortname: 'sixzux24q',
          realname: '[前四星_组选24]',
          tips: '从0-9中选择4个号码组成一注。',
          example: '投注方案：0568，开奖号码的四个数字只要包含0、5、6、8，即可中四星组选24一等奖。',
          help: '从0-9中任意选择4个号码组成一注，所选号码与开奖号码的千位、百位、十位、个位相同，且顺序不限，即为中奖。',
          select: {
            layout: [{
              title: '选号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '组选12',
          shortname: 'sixzux12q',
          realname: '[前四星_组选12]',
          tips: '从“二重号”选择一个号码，“单号”中选择两个号码组成一注。',
          example: '投注方案：二重号：8，单号：0、6，只要开奖的四个数字包括 0、6、8、8，即可中四星组选12一等奖。',
          help: '选择1个二重号码和2个单号号码组成一注，所选单号号码与开奖号码相同，且所选二重号码在开奖号码中出现了2次，即为中奖。',
          select: {
            layout: [{
              title: '二重号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '单　号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '组选6',
          shortname: 'sixzux6q',
          realname: '[前四星_组选6]',
          tips: '从“二重号”选择两个号码组成一注。',
          example: '投注方案：二重号：6、8，只要开奖的四个数字从小到大排列为 6、6、8、8，即可中四星组选6。',
          help: '选择2个二重号码组成一注，所选的2个二重号码在开奖号码中分别出现了2次，即为中奖。',
          select: {
            layout: [{
              title: '二重号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '组选4',
          shortname: 'sixzux4q',
          realname: '[前四星_组选4]',
          tips: '从“三重号”选择一个号码，“单号”中选择两个号码组成一注。',
          example: '投注方案：三重号：8，单号：2，只要开奖的四个数字从小到大排列为 2、8、8、8，即可中四星组选4。',
          help: '选择1个三重号码和1个单号号码组成一注，所选单号号码与开奖号码相同，且所选三重号码在开奖号码中出现了3次，即为中奖。',
          select: {
            layout: [{
              title: '三重号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '单　号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }]
      }]]
    }, {
      title: '前三',
      rows: [[{
        title: '前三直选',
        columns: [{
          showname: '复式',
          shortname: 'sxzhixfsq',
          realname: '[前三码_复式]',
          tips: '从万、千、百位各选一个号码组成一注。',
          example: '投注方案：345； 开奖号码：345，即中前三直选一等奖',
          help: '从万、千、百位中选择一个3位号码组成一注，所选号码与开奖号码的前3位相同，且顺序一致，即为中奖。',
          select: {
            layout: [{
              title: '万位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '千位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '百位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '单式',
          shortname: 'sxzhixdsq',
          realname: '[前三码_单式]',
          tips: '手动输入号码，至少输入1个三位数号码组成一注。',
          example: '投注方案：345； 开奖号码：345，即中前三直选一等奖',
          help: '手动输入一个3位数号码组成一注，所选号码的万位、千位、百位与开奖号码相同，且顺序一致，即为中奖。',
          textarea: {}
        }, {
          showname: '直选和值',
          shortname: 'sxzhixhzq',
          realname: '[前三码_和值]',
          tips: '从0-27中任意选择1个或1个以上号码',
          example: '投注方案：和值1；开奖号码前三位：001,010,100,即中前三直选一等奖',
          help: '所选数值等于开奖号码的万位、千位、百位三个数字相加之和，即为中奖。',
          select: {
            layout: [{
              balls: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27],
              cls: 'hz',
              tools: true
            }]
          }
        }, {
          showname: '直选跨度',
          shortname: 'ssc_zxkd_qs',
          realname: '[前三码_直选跨度]',
          tips: '从0-9中任意选择1个或1个以上号码',
          example: '投注方案：跨度8；开出的三个数字包括0,8,x，其中x≠9，即可中前三直选；',
          help: '开出的三个数字包括1,9,x，其中x≠0，即可中前三直选跨度。',
          select: {
            layout: [{
              balls: [0,1,2,3,4,5,6,7,8,9],
              cls: 'kd',
              tools: true
            }]
          }
        }]
      }], [{
        title: '前三组选',
        columns: [{
          showname: '组三',
          shortname: 'sxzuxzsq',
          realname: '[前三码_组三]',
          tips: '从0-9中任意选择2个或2个以上号码。',
          example: '投注方案：5,8,8；开奖号码前三位：1个5，2个8 (顺序不限)，即中前三组选三一等奖。',
          help: '从0-9中选择2个数字组成两注，所选号码与开奖号码的万位、千位、百位相同，且顺序不限，即为中奖。',
          select: {
            layout: [{
              title: '组三',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '组六',
          shortname: 'sxzuxzlq',
          realname: '[前三码_组六]',
          tips: '从0-9中任意选择3个或3个以上号码。',
          example: '投注方案：2,5,8；开奖号码前三位：1个2、1个5、1个8 (顺序不限)，即中前三组选六一等奖。',
          help: '从0-9中任意选择3个号码组成一注，所选号码与开奖号码的万位、千位、百位相同，顺序不限，即为中奖。',
          select: {
            layout: [{
              title: '组六',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '混合组选',
          shortname: 'sxhhzxq',
          realname: '[前三码_混合组选]',
          tips: '手动输入号码，至少输入1个三位数号码。',
          example: '投注方案：分別投注(0,0,1),以及(1,2,3)，开奖号码前三位包括：(1)0,0,1，顺序不限，即中得组三一等奖；或者(2)1,2,3，顺序不限，即中得组六一等奖。',
          help: '键盘手动输入购买号码，3个数字为一注，开奖号码的万位、千位、百位符合后三组三或组六均为中奖。',
          textarea: {}
        }, {
          showname: '组选和值',
          shortname: 'qsm_zux_hz',
          realname: '[前三码_和值]',
          tips: '从1-26中任意选择1个或1个以上号码',
          example: '投注方案：和值1；开奖号码前三位：001,010,100,即中前三组选和值',
          help: '所选数值等于开奖号码的万位、千位、百位三个数字相加之和，即为中奖。',
          select: {
            layout: [{
              balls: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],
              cls: 'hz',
              tools: true
            }]
          }
        }, {
          showname: '组选包胆',
          shortname: 'ssc_zuxbd_qs',
          realname: '[前三码_组选包胆]',
          tips: '从0-9中任选1个号码。',
          example: '投注方案：包胆3；开奖号码前三位：(1)出现3xx或者33x,即中前三组三；(2)出现3xy，即中前三组六。',
          help: '从0-9中任意选择1个号码组成一注，出现前三组三或组六，即为中奖。',
          select: {
            layout: [{
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: false,
              only:true
            }]
          }
        }]
      }], [{
        title: '前三其他',
        columns: [{
          showname: '特殊号',
          shortname: 'ssctesh_qs',
          realname: '[前三码_特殊号]',
          tips: '选择一个号码形态。',
          example: '投注方案：<br>豹子 开奖号码：000xx，即中豹子；顺子 开奖号码：123xx，即中顺子；对子 开奖号码：001xx，即中对子；半顺 开奖号码：124xx，即中半顺；杂六<br>开奖号码：158xx，即中杂六',
          help: '所选的号码特殊属性和开奖号码前3位的属性一致，即为中奖<br>1、豹子号指的是三位数字全部相同<br>2、顺子号指的是三位数字呈现连号状态（顺序不限）<br>3、对子号指的是三位数字中有任两码为相同号<br>4、半顺号指的是三位数字中，有两个号码呈现连号状态（顺序不限）<br>5、杂六号指的是三位数字中，状态非豹子号、顺子号、对子号、半顺号，即为杂六',
          select: {
            layout: [{
              balls: ['豹子','顺子','对子','半顺','杂六']
            }]
          }
        },{
          showname: '和值尾数',
          shortname: 'sschzws_qs',
          realname: '[前三码_和值尾数]',
          tips: '从0-9中选择1个号码。',
          example: '投注方案：和值尾数8，；开奖号码：前三位和值尾数为8，即中得和值尾数。',
          help: '从下方中选择1个号码组成1注，所选号码与开奖号码前三位和值的尾数相同，即为中奖。',
          select: {
            layout: [{
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }]
      }]]
    }, {
      title: '中三',
      rows: [[{
        title: '中三直选',
        columns: [{
          showname: '复式',
          shortname: 'sxzhixfsz',
          realname: '[中三码_复式]',
          tips: '从千、百、十位各选一个号码组成一注。',
          example: '投注方案：345； <br>开奖号码中三位：345，即中中三直选。',
          help: '从千位、百位、十位中选择一个3位数号码组成一注，所选号码与开奖号码的中间3位相同，且顺序一致，即为中奖。',
          select: {
            layout: [{
              title: '千位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '百位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '十位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '单式',
          shortname: 'sxzhixdsz',
          realname: '[中三码_单式]',
          tips: '手动输入号码，至少输入1个三位数号码组成一注。',
          example: '投注方案：345； <br>开奖号码中三位：345，即中中三直选。',
          help: '手动输入一个3位数号码组成一注，所选号码的千位、百位、十位与开奖号码相同，且顺序一致，即为中奖。',
          textarea: {}
        }, {
          showname: '直选和值',
          shortname: 'sxzhixhzz',
          realname: '[中三码_和值]',
          tips: '从0-27中任意选择1个或1个以上号码',
          example: '投注方案：和值1<br>开奖号码中三位：001、010、100，即中中三直选和值',
          help: '所选数值等于开奖号码的千位、百位、十位三个数字相加之和，即为中奖。',
          select: {
            layout: [{
              balls: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27],
              cls: 'hz',
              tools: true
            }]
          }
        }, {
          showname: '直选跨度',
          shortname: 'ssc_zxkd_zs',
          realname: '[中三码_直选跨度]',
          tips: '从0-9中任意选择1个或1个以上号码',
          example: '投注方案：跨度8；<br>开奖号码中三位：(1)开出的三个数字包括0,8,x，其中x≠9，即可中中三直选;(2)开出的三个数字包括1,9,x，其中x≠0，即可中中三直选跨度',
          help: '开出的三个数字包括1,9,x，其中x≠0，即可中 中三直选跨度。',
          select: {
            layout: [{
              balls: [0,1,2,3,4,5,6,7,8,9],
              cls: 'kd',
              tools: true
            }]
          }
        }]
      }], [{
        title: '中三组选',
        columns: [{
          showname: '组三',
          shortname: 'sxzuxzsz',
          realname: '[中三码_组三]',
          tips: '从0-9中任意选择2个或2个以上号码。',
          example: '投注方案：5,8,8；开奖号码中间三位：1个5，2个8 (顺序不限)，即中中三组选三一等奖。',
          help: '从0-9中选择2个数字组成两注，所选号码与开奖号码的千位、百位、十位相同，且顺序不限，即为中奖。',
          select: {
            layout: [{
              title: '组三',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '组六',
          shortname: 'sxzuxzlz',
          realname: '[中三码_组六]',
          tips: '从0-9中任意选择3个或3个以上号码。',
          example: '投注方案：2,5,8；开奖号码中间三位：1个2、1个5、1个8 (顺序不限)，即中中三组选六一等奖。',
          help: '从0-9中任意选择3个号码组成一注，所选号码与开奖号码的千位、百位、十位相同，顺序不限，即为中奖。',
          select: {
            layout: [{
              title: '组六',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '混合组选',
          shortname: 'sxhhzxz',
          realname: '[中三码_混合组选]',
          tips: '手动输入号码，至少输入1个三位数号码。',
          example: '投注方案：分別投注(0,0,1),以及(1,2,3)，开奖号码中间三位包括：(1)0,0,1，顺序不限，即中得组三一等奖；或者(2)1,2,3，顺序不限，即中得组六一等奖。',
          help: '键盘手动输入购买号码，3个数字为一注，开奖号码的千位、百位、十位符合中三组三或组六均为中奖。',
          textarea: {}
        }, {
          showname: '组选和值',
          shortname: 'zsm_zux_hz',
          realname: '[中三码_和值]',
          tips: '从1-26中任意选择1个或1个以上号码',
          example: '投注方案：和值1；开奖号码中间三位：001,010,100,即中 中三组选和值',
          help: '所选数值等于开奖号码的千位、百位、十位三个数字相加之和，即为中奖。',
          select: {
            layout: [{
              balls: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],
              cls: 'hz',
              tools: true
            }]
          }
        }, {
          showname: '组选包胆',
          shortname: 'ssc_zuxbd_zs',
          realname: '[前三码_组选包胆]',
          tips: '从0-9中任选1个号码。',
          example: '投注方案：包胆3；开奖号码中间三位：(1)出现3xx或者33x,即中 中三组三；(2)出现3xy，即中 中三组六。',
          help: '从0-9中任意选择1个号码组成一注，出现中三组三或组六，即为中奖。',
          select: {
            layout: [{
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: false,
              only:true
            }]
          }
        }]
      }], [{
        title: '中三其他',
        columns: [{
          showname: '特殊号',
          shortname: 'ssctesh_zs',
          realname: '[中三码_特殊号]',
          tips: '选择一个号码形态。',
          example: '投注方案：<br>豹子 开奖号码：x000x，即中豹子；顺子 开奖号码：x123x，即中顺子；对子 开奖号码：x001x，即中对子；半顺 开奖号码：x124x，即中半顺；杂六 开奖号码：x158x，即中杂六',
          help: '所选的号码特殊属性和开奖号码中3位的属性一致，即为中奖；<br>1、豹子号指的是三位数字全部相同<br>2、顺子号指的是三位数字呈现连号状态（顺序不限）<br>3、对子号指的是三位数字中有任两码为相同号<br>4、半顺号指的是三位数字中，有两个号码呈现连号状态（顺序不限）<br>5、杂六号指的是三位数字中，状态非豹子号、顺子号、对子号、半顺号，即为杂六',
          select: {
            layout: [{
              balls: ['豹子','顺子','对子','半顺','杂六']
            }]
          }
        },{
          showname: '和值尾数',
          shortname: 'sschzws_zs',
          realname: '[中三码_和值尾数]',
          tips: '从0-9中选择1个号码。',
          example: '投注方案：和值尾数8，；开奖号码：中间三位和值尾数为8，即中得和值尾数。',
          help: '从下方中选择1个号码组成1注，所选号码与开奖号码中三位和值的尾数相同，即为中奖。',
          select: {
            layout: [{
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }]
      }]]
    }, {
      title: '后三',
      rows: [[{
        title: '后三直选',
        columns: [{
          showname: '复式',
          shortname: 'sxzhixfsh',
          realname: '[后三码_复式]',
          tips: '从百位、十位、个位各选一个号码组成一注。',
          example: '投注方案：345；开奖号码：XX345；<br>即中后三直选一等奖',
          help: '从百位、十位、个位中选择一个3位数号码组成一注，所选号码与开奖号码后3位相同，且顺序一致，即为中奖。',
          select: {
            layout: [{
              title: '百位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '十位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '个位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '单式',
          shortname: 'sxzhixdsh',
          realname: '[后三码_单式]',
          tips: '手动输入号码，至少输入1个三位数号码组成一注。',
          example: '投注方案：345； 开奖号码：345，即中后三直选一等奖',
          help: '手动输入一个3位数号码组成一注，所选号码的百位、十位、个位与开奖号码相同，且顺序一致，即为中奖。',
          textarea: {}
        }, {
          showname: '直选和值',
          shortname: 'sxzhixhzh',
          realname: '[后三码_和值]',
          tips: '从0-27中任意选择1个或1个以上号码',
          example: '投注方案：和值1；开奖号码后三位：001,010,100,即中后三直选一等奖',
          help: '所选数值等于开奖号码的百位、十位、个位三个数字相加之和，即为中奖。',
          select: {
            layout: [{
              balls: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27],
              cls: 'hz',
              tools: true
            }]
          }
        }, {
          showname: '直选跨度',
          shortname: 'ssc_zxkd_hs',
          realname: '[后三码_直选跨度]',
          tips: '从0-9中任意选择1个或1个以上号码',
          example: '投注方案：跨度8；开出的三个数字包括0,8,x，其中x≠9，即可中后三直选；',
          help: '开出的三个数字包括1,9,x，其中x≠0，即可中后三直选跨度。',
          select: {
            layout: [{
              balls: [0,1,2,3,4,5,6,7,8,9],
              cls: 'kd',
              tools: true
            }]
          }
        }]
      }], [{
        title: '后三组选',
        columns: [{
          showname: '组三',
          shortname: 'sxzuxzsh',
          realname: '[后三码_组三]',
          tips: '从0-9中任意选择2个或2个以上号码。',
          example: '投注方案：5,8,8；开奖号码后三位：1个5，2个8 (顺序不限)，即中后三组选三一等奖。',
          help: '从0-9中选择2个数字组成两注，所选号码与开奖号码的百位、十位、个位相同，且顺序不限，即为中奖。',
          select: {
            layout: [{
              title: '组三',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '组六',
          shortname: 'sxzuxzlh',
          realname: '[后三码_组六]',
          tips: '从0-9中任意选择3个或3个以上号码。',
          example: '投注方案：2,5,8；开奖号码后三位：1个2、1个5、1个8 (顺序不限)，即中后三组选六一等奖。',
          help: '从0-9中任意选择3个号码组成一注，所选号码与开奖号码的百位、十位、个位相同，顺序不限，即为中奖。',
          select: {
            layout: [{
              title: '组六',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '混合组选',
          shortname: 'sxhhzxh',
          realname: '[后三码_混合组选]',
          tips: '手动输入号码，至少输入1个三位数号码。',
          example: '投注方案：分別投注(0,0,1),以及(1,2,3)，开奖号码后三位包括：(1)0,0,1，顺序不限，即中得组三一等奖；或者(2)1,2,3，顺序不限，即中得组六一等奖。',
          help: '键盘手动输入购买号码，3个数字为一注，开奖号码的百位、十位、个位符合后三组三或组六均为中奖。',
          textarea: {}
        }, {
          showname: '组选和值',
          shortname: 'hsm_zux_hz',
          realname: '[后三码_和值]',
          tips: '从1-26中任意选择1个或1个以上号码',
          example: '投注方案：和值1；开奖号码后三位：001,010,100,即中后三组选和值',
          help: '所选数值等于开奖号码的百位、十位、个位三个数字相加之和，即为中奖。',
          select: {
            layout: [{
              balls: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],
              cls: 'hz',
              tools: true
            }]
          }
        }, {
          showname: '组选包胆',
          shortname: 'ssc_zuxbd_hs',
          realname: '[后三码_组选包胆]',
          tips: '从0-9中任选1个号码。',
          example: '投注方案：包胆3；开奖号码后三位：(1)出现3xx或者33x,即中后三组三；(2)出现3xy，即中后三组六。',
          help: '从0-9中任意选择1个号码组成一注，出现后三组三或组六，即为中奖。',
          select: {
            layout: [{
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: false,
              only:true
            }]
          }
        }]
      }], [{
        title: '后三其他',
        columns: [{
          showname: '特殊号',
          shortname: 'ssctesh_hs',
          realname: '[后三码_特殊号]',
          tips: '选择一个号码形态。',
          example: '投注方案：<br>豹子 开奖号码：xx000，即中豹子；顺子 开奖号码：xx123，即中顺子；对子 开奖号码：xx001，即中对子；半顺 开奖号码：xx124，即中半顺；杂六 开奖号码：xx158，即中杂六',
          help: '所选的号码特殊属性和开奖号码后3位的属性一致，即为中奖<br>1、豹子号指的是三位数字全部相同<br>2、顺子号指的是三位数字呈现连号状态（顺序不限）<br>3、对子号指的是三位数字中有任两码为相同号<br>4、半顺号指的是三位数字中，有两个号码呈现连号状态（顺序不限）<br>5、杂六号指的是三位数字中，状态非豹子号、顺子号、对子号、半顺号，即为杂六',
          select: {
            layout: [{
              balls: ['豹子','顺子','对子','半顺','杂六']
            }]
          }
        },{
          showname: '和值尾数',
          shortname: 'sschzws_hs',
          realname: '[后三码_和值尾数]',
          tips: '从0-9中选择1个号码。',
          example: '投注方案：和值尾数8，；开奖号码：后三位和值尾数为8，即中得和值尾数。',
          help: '从下方中选择1个号码组成1注，所选号码与开奖号码后三位和值的尾数相同，即为中奖。',
          select: {
            layout: [{
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }]
      }]]
    }, {
      title: '二星',
      rows: [[{
        title: '后二星　直选',
        columns: [{
          showname: '复式',
          shortname: 'exzhixfsh',
          realname: '[后二码_直选_复式]',
          tips: '从十、个位各选一个号码组成一注。',
          example: '投注方案：58；开奖号码后二位：58，即中后二直选一等奖。',
          help: '从十位、个位中选择一个2位数号码组成一注，所选号码与开奖号码的十位、个位相同，且顺序一致，即为中奖。',
          select: {
            layout: [{
              title: '十位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '个位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '单式',
          shortname: 'exzhixdsh',
          realname: '[后二码_直选_单式]',
          tips: '手动输入号码，至少输入1个两位数号码。',
          example: '投注方案：58；开奖号码后二位：58，即中后二直选一等奖。',
          help: '手动输入一个2位数号码组成一注，所选号码的十位、个位与开奖号码相同，且顺序一致，即为中奖。',
          textarea: {}
        }, {
          showname: '直选和值',
          shortname: 'exzhixhzh',
          realname: '[后二码_直选_和值]',
          tips: '从0-18中任意选择1个或1个以上的和值号码。',
          example: '投注方案：和值1；开奖号码后二位：01,10，即中后二直选。',
          help: '所选数值等于开奖号码的十位、个位二个数字相加之和，即为中奖。',
          select: {
            layout: [{
              balls: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
              cls: 'hz',
              tools: true
            }]
          }
        }, {
          showname: '大小单双',
          shortname: 'dxdsh',
          realname: '[后二星_大小单双]',
          tips: '从十位、个位中的“大、小、单、双”中至少各选一个组成一注。',
          example: '投注方案：大单；开奖号码十位与个位：大单，即中后二大小单双一等奖。',
          help: '对十位和个位的“大（56789）小（01234）、单（13579）双（02468）”形态进行购买，所选号码的位置、形态与开奖号码的位置、形态相同，即为中奖。',
          select: {
            layout: [{
              title: '十位',
              balls: ['大', '小', '单', '双']
            }, {
              title: '个位',
              balls: ['大', '小', '单', '双']
            }]
          }
        }, {
          showname: '跨度',
          shortname: 'ssc_zxkd_her',
          realname: '[后二星_大小单双]',
          tips: '从0-9中选择1个号码。',
          example: '投注方案：跨度9；开奖号码为-,-,-,9,0或-,-,-,0,9，即中后二直选跨度。',
          help: '所选数值等于开奖号码的后2位最大与最小数字相减之差，即为中奖。',
          select: {
            layout: [{
              title:'选号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              cls: 'kd',
              tools: true
            }]
          }
        }]
      }, {
        title: '组选',
        columns: [{
          showname: '复式',
          shortname: 'exzuxfsh',
          realname: '[后二码_组选_复式]',
          tips: '从0-9中任意选择2个或2个以上号码。',
          example: '投注方案：5,8；开奖号码后二位：1个5，1个8 (顺序不限)，即中后二组选一等奖。',
          help: '从0-9中选2个号码组成一注，所选号码与开奖号码的十位、个位相同，顺序不限，即中奖。',
          select: {
            layout: [{
              title: '组选',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '单式',
          shortname: 'exzuxdsh',
          realname: '[后二码_组选_单式]',
          tips: '手动输入号码，至少输入1个两位数号码。',
          example: '投注方案：5,8；开奖号码后二位：1个5，1个8 (顺序不限)，即中后二组选一等奖。',
          help: '手动输入一个2位数号码组成一注，所选号码的十位、个位与开奖号码相同，顺序不限，即为中奖。',
          textarea: {}
        }, {
          showname: '和值',
          shortname: 'em_zux_hhz',
          realname: '[后二码_组选和值]',
          tips: '从1-17中任意选择1个或1个以上号码。',
          example: '投注方案：和值1；开奖号码后二位：10或01(顺序不限，不含对子号)，即中后二组选。',
          help: '从1-17中任意选择1个或1个以上号码。所选数值等于开奖号码的十位、个位二个数字相加之和（不含对子号），即为中奖。',
          select: {
            layout: [{
              //balls: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
              balls: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],
              cls: 'hz',
              tools: true
            }]
          }
        }, {
          showname: '包胆',
          shortname: 'ssc_zxbd_her',
          realname: '[后二码_组选_单式]',
          tips: '从0-9中任意选择1个包胆号码。',
          example: '投注方案：包胆号码8；开奖号码后二位：出现1个8（不包括2个8），即中后二组选。',
          help: '从0-9中任意选择1个包胆号码，开奖号码的十位、个位中任意1位包含所选的包胆号码相同（不含对子号），即为中奖。',
          select: {
            layout: [{
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: false,
              only:true
            }]
          }
        }]
      }], [{
        title: '前二星　直选',
        columns: [{
          showname: '复式',
          shortname: 'exzhixfsq',
          realname: '[前二码_直选_复式]',
          tips: '从万、千位各选一个号码组成一注。',
          example: '投注方案：58；开奖号码前二位：58，即中前二直选一等奖。',
          help: '从万位、千位中选择一个2位数号码组成一注，所选号码与开奖号码的前2位相同，且顺序一致，即为中奖。',
          select: {
            layout: [{
              title: '万位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '千位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '单式',
          shortname: 'exzhixdsq',
          realname: '[前二码_直选_单式]',
          tips: '手动输入号码，至少输入1个两位数号码。',
          example: '投注方案：58；开奖号码前二位：58，即中前二直选一等奖。',
          help: '手动输入一个2位数号码组成一注，所选号码的万位、千位与开奖号码相同，且顺序一致，即为中奖。',
          textarea: {}
        }, {
          showname: '直选和值',
          shortname: 'exzhixhzq',
          realname: '[前二码_直选_和值]',
          tips: '从0-18中任意选择1个或1个以上的和值号码。',
          example: '投注方案：和值1；开奖号码前二位：01,10，即中前二直选。',
          help: '所选数值等于开奖号码的万位、千位二个数字相加之和，即为中奖。',
          select: {
            layout: [{
              balls: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
              cls: 'hz',
              tools: true
            }]
          }
        }, {
          showname: '大小单双',
          shortname: 'dxdsq',
          realname: '[前二星_大小单双]',
          tips: '从万位、千位中的“大、小、单、双”中至少各选一个组成一注。',
          example: '投注方案：小双；开奖号码万位与千位：小双，即中前二大小单双一等奖。',
          help: '对百位、十位和个位的“大（56789）小（01234）、单（13579）双（02468）”形态进行购买，所选号码的位置、形态与开奖号码的位置、形态相同，即为中奖。',
          select: {
            layout: [{
              title: '万位',
              balls: ['大', '小', '单', '双']
            }, {
              title: '千位',
              balls: ['大', '小', '单', '双']
            }]
          }
        },{
          showname: '跨度',
          shortname: 'ssc_zxkd_qer',
          realname: '[前二星_大小单双]',
          tips: '从0-9中选择1个号码。',
          example: '投注方案：跨度9；开奖号码为9,0,-,-,-或0,9,-,-,-，即中前二直选跨度。',
          help: '所选数值等于开奖号码的前2位最大与最小数字相减之差，即为中奖。',
          select: {
            layout: [{
              title: '选号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }]
      }, {
        title: '组选',
        columns: [{
          showname: '复式',
          shortname: 'exzuxfsq',
          realname: '[前二码_组选_复式]',
          tips: '从0-9中任意选择2个或2个以上号码。',
          example: '投注方案：5,8；开奖号码前二位：1个5，1个8 (顺序不限)，即中前二组选一等奖。',
          help: '从0-9中选2个号码组成一注，所选号码与开奖号码的万位、千位相同，顺序不限，即中奖。',
          select: {
            layout: [{
              title: '组选',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '单式',
          shortname: 'exzuxdsq',
          realname: '[前二码_组选_单式]',
          tips: '手动输入号码，至少输入1个两位数号码。',
          example: '投注方案：5,8；开奖号码前二位：1个5，1个8 (顺序不限)，即中前二组选一等奖。',
          help: '手动输入一个2位数号码组成一注，所选号码的万位、千位与开奖号码相同，顺序不限，即为中奖。',
          textarea: {}
        }, {
          showname: '和值',
          shortname: 'em_zux_qhz',
          realname: '[前二码_组选_单式]',
          tips: '从1-17中任意选择1个或1个以上号码。',
          example: '投注方案：和值1；开奖号码前二位：10或01 (顺序不限，不含对子号)，即中前二组选。',
          help: '从1-17中任意选择1个或1个以上号码。所选数值等于开奖号码的万位、千位二个数字相加之和（不含对子号），即为中奖。',
          select: {
            layout: [{
              //balls: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
              balls: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],
              cls: 'hz',
              tools: true
            }]
          }
        }, {
          showname: '包胆',
          shortname: 'ssc_zxbd_qer',
          realname: '[前二码_组选_单式]',
          tips: '从0-9中任意选择1个包胆号码。',
          example: '投注方案：包胆号码8；开奖号码前二位：出现1个8（不包括2个8），即中前二组选。',
          help: '从0-9中任意选择1个包胆号码，开奖号码的万位、千位中任意1位包含所选的包胆号码相同（不含对子号），即为中奖。',
          select: {
            layout: [{
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: false,
              only:true,
              cls: 'bd'
            }]
          }
        }]
      }]]
    }, {
      title: '定位胆',
      rows: [[{
        title: '定位胆',
        columns: [{
          showname: '定位胆',
          shortname: 'dw',
          realname: '定位胆',
          tips: '在万千百十个位任意位置上任意选择1个或1个以上号码。',
          example: '投注方案：1；开奖号码万位：1，即中定位胆万位一等奖。',
          help: '从万、千、百、十、个位任意位置上至少选择1个以上号码，所选号码与相同位置上的开奖号码一致，即为中奖。',
          select: {
            layout: [{
              title: '万位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '千位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '百位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '十位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }, {
              title: '个位',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }]
      }]]
    }, {
      title: '不定胆',
      rows: [[{
        title: '五星不定胆',
        columns: [{
          showname: '一码不定位',
          shortname: 'bdd_bdd_wx1',
          realname: '[不定胆_五星一码]',
          tips: '从0-9中任意选择1个以上号码。',
          example: '投注方案：1；开奖号码至少出现1个1，即中五星一码不定位一等奖。',
          help: '从0-9中选择1个号码，每注由1个不同的号码组成，开奖号码的万位、千位、百位、十位、个位中同时包含所选的1个号码，即为中奖。',
          select: {
            layout: [{
              title: '不定胆',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        },{
          showname: '二码不定位',
          shortname: 'bdd_bdd_wx2',
          realname: '[不定胆_五星二码]',
          tips: '从0-9中任意选择2个以上号码。',
          example: '投注方案：1,2；<br>开奖号码：至少出现1和2各1个，即中五星二码不定位。',
          help: '从0-9中选择2个号码，每注由2个不同的号码组成，开奖号码的万位、千位、百位、十位、个位中同时包含所选的2个号码，即为中奖。',
          select: {
            layout: [{
              title: '不定胆',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        },{
          showname: '三码不定位',
          shortname: 'bdd_bdd_wx3',
          realname: '[不定胆_五星三码]',
          tips: '从0-9中任意选择3个以上号码。',
          example: '投注方案：1,2,3；<br>开奖号码：至少出现1、2、3各1个，即中五星三码不定位。',
          help: '从0-9中选择3个号码，每注由3个不同的号码组成，开奖号码的万位、千位、百位、十位、个位中同时包含所选的3个号码，即为中奖。',
          select: {
            layout: [{
              title: '不定胆',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }]
      }],[{
        title: '前四不定胆',
        columns: [{
          showname: '一码不定位',
          shortname: 'bdd_bdd_qsix1',
          realname: '[不定胆_前四星一码]',
          tips: '从0-9中任意选择1个以上号码。',
          example: '投注方案：1；<br>开奖号码前四位：至少出现1个1，即中前四星一码不定位。',
          help: '从0-9中选择1个号码，每注由1个号码组成，只要开奖号码的万位、千位、百位、十位中包含所选号码，即为中奖。',
          select: {
            layout: [{
              title: '不定胆',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        },{
          showname: '二码不定位',
          shortname: 'bdd_bdd_qsix2',
          realname: '[不定胆_前四星二码]',
          tips: '从0-9中任意选择2个以上号码。',
          example: '投注方案：1,2；<br>开奖号码前四位：至少出现1和2各1个，即中前四星二码不定位。',
          help: '从0-9中选择2个号码，每注由2个不同的号码组成，开奖号码的万位、千位、百位、十位中同时包含所选的2个号码，即为中奖。',
          select: {
            layout: [{
              title: '不定胆',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }]
      }],[{
        title: '后四不定胆',
        columns: [{
          showname: '一码不定位',
          shortname: 'bdd_bdd_hsix1',
          realname: '[不定胆_后四星一码]',
          tips: '从0-9中任意选择1个以上号码。',
          example: '投注方案：1；<br>开奖号码后四位：至少出现1个1，即中后四星一码不定位。',
          help: '从0-9中选择1个号码，每注由1个号码组成，只要开奖号码的千位、百位、十位、个位中包含所选号码，即为中奖。',
          select: {
            layout: [{
              title: '不定胆',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        },{
          showname: '二码不定位',
          shortname: 'bdd_bdd_hsix2',
          realname: '[不定胆_后四二码]',
          tips: '从0-9中任意选择2个以上号码。',
          example: '投注方案：1,2；<br>开奖号码后四位：至少出现1和2各1个，即中后四星二码不定位。',
          help: '从0-9中选择2个号码，每注由2个不同的号码组成，开奖号码的千位、百位、十位、个位中同时包含所选的2个号码，即为中奖。',
          select: {
            layout: [{
              title: '不定胆',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }]
      }],[{
        title: '三星不定胆一码',
        columns: [{
          showname: '后三',
          shortname: 'bdw1mh',
          realname: '[不定胆_后三一码]',
          tips: '从0-9中任意选择1个以上号码。',
          example: '投注方案：1；<br>开奖号码后三位：至少出现1个1，即中后三一码不定位。',
          help: '从0-9中选择1个号码，每注由1个不同的号码组成，开奖号码的百位、十位、个位中同时包含所选的1个号码，即为中奖。',
          select: {
            layout: [{
              title: '不定胆',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '中三',
          shortname: 'bdw1mz',
          realname: '[不定胆_中三一码]',
          tips: '从0-9中任意选择1个以上号码。',
          example: '投注方案：1；<br>开奖号码中三位：至少出现1个1，即中 中三一码不定位。',
          help: '从0-9中选择1个号码，每注由1个不同的号码组成，开奖号码的百位、十位、个位中同时包含所选的1个号码，即为中奖。',
          select: {
            layout: [{
              title: '不定胆',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '前三',
          shortname: 'bdw1mq',
          realname: '[不定胆_前三一码]',
          tips: '从0-9中任意选择1个以上号码。',
          example: '投注方案：1；<br>开奖号码前三位：至少出现1个1，即中前三一码不定位。',
          help: '从0-9中选择1个号码，每注由1个号码组成，只要开奖号码的万位、千位、百位中包含所选号码，即为中奖。',
          select: {
            layout: [{
              title: '不定胆',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }]
      }], [{
        title: '三星不定胆二码',
        columns: [{
          showname: '后三',
          shortname: 'bdw2mh',
          realname: '[不定胆_后三二码]',
          tips: '从0-9中任意选择2个以上号码。',
          example: '投注方案：1,2；<br>开奖号码后三位：至少出现1和2各1个，即中后三二码不定位。',
          help: '从0-9中选择2个号码，每注由2个不同的号码组成，开奖号码的百位、十位、个位中同时包含所选的2个号码，即为中奖。',
          select: {
            layout: [{
              title: '不定胆',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '中三',
          shortname: 'bdw2mz',
          realname: '[不定胆_中三二码]',
          tips: '从0-9中任意选择2个以上号码。',
          example: '投注方案：1,2；<br>开奖号码前三位：至少出现1和2各1个，即中 中三二码不定位。',
          help: '从0-9中选择2个号码，每注由2个不同的号码组成，开奖号码的百位、十位、个位中同时包含所选的2个号码，即为中奖。',
          select: {
            layout: [{
              title: '不定胆',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '前三',
          shortname: 'bdw2mq',
          realname: '[不定胆_前三二码]',
          tips: '从0-9中任意选择2个以上号码。',
          example: '投注方案：1,2；<br>开奖号码前三位：至少出现1和2各1个，即中前三二码不定位。',
          help: '从0-9中选择2个号码，每注由2个不同的号码组成，开奖号码的万位、千位、百位中同时包含所选的2个号码，即为中奖。',
          select: {
            layout: [{
              title: '不定胆',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }]
      }]]
    }, {
      title: '任选',
      rows: [[{
            title: '任二',
            columns: [{
                showname: '复式',
                shortname: 'rx2fs',
                realname: '[任选二_复试]',
                tips: '万、千、百、十、个任意2位，开奖号分别对应且顺序一致即中奖',
                example: '万位买0，千位买1，百位买2，开奖01234，则中奖。',
                help: '从万、千、百、十、个中至少2个位置各选一个或多个号码，将各个位置的号码进行组合，所选号码的各位与开奖号码相同则中奖。',
                select: {
                    layout: [{
                        title: '万位',
                        balls: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        tools: true
                    }, {
                        title: '千位',
                        balls: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        tools: true
                    }, {
                        title: '百位',
                        balls: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        tools: true
                    }, {
                        title: '十位',
                        balls: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        tools: true
                    }, {
                        title: '个位',
                        balls: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        tools: true
                    }]
                }
            }, {
                showname: '单式',
                shortname: 'rx2ds',
                realname: '[任选二_单式]',
                tips: '手动输入号码，至少输入1个两位数号码和至少选择两个位置',
                example: '输入号码01并选择万、千位置位，如开奖号码位01***； 则中奖',
                help: '手动输入一注或者多注的两个号码和至少两个位置，如果选中的号码与位置和开奖号码对应则中奖',
                checkbox: {
                    layout: [{
                        title: '位置',
                        value: ['万位', '千位', '百位', '十位', '个位']
                    }]
                },
                textarea: {}
            }, {
                showname: '组选',
                shortname: 'rx2zx',
                realname: '[任选二_组选]',
                tips: '从0-9中任意选择2个或2个以上号码和任意两个位置',
                example: '位置选择万、千，号码选择01；开奖号码为01***、则中奖',
                help: '从0-9中任意选择2个或2个以上号码和万、千、百、十、个任意的两个位置，如果组合的号码与开奖号码对应则中奖',
                checkbox: {
                    layout: [{
                        title: '位置',
                        value: ['万位', '千位', '百位', '十位', '个位']
                    }]
                },
                select: {
                    layout: [{
                        title: '号码',
                        balls: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        tools: true
                    }]
                }
            }, {
                showname: '直选和值',
                shortname: 'rx2_zx_hz',
                realname: '[任选二_直选和值]',
                tips: '投注方案：勾选位置千位、个位，选择和值15； <br>开奖号码：*8**7，即中任二直选和值。',
                example: '投注方案：勾选位置千位、个位，选择和值15； <br>开奖号码：*8**7，即中任二直选和值。',
                help: '从万位、千位、百位、十位、个位中任意勾选两个位置，然后选择一个和值，所选2个位置的开奖号码相加之和与所选和值一致，且顺序一致，即为中奖。',
                checkbox: {
                    layout: [{
                        title: '位置',
                        value: ['万位', '千位', '百位', '十位', '个位'],
                        chk:[0,0,0,0,0]
                    }]
                },
                select: {
                    layout: [{
                        title: '号码',
                        balls: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
                        tools: true
                    }]
                }
            }, {
                showname: '组选和值',
                shortname: 'rx2_zux_hz',
                realname: '[任选二_组选和值]',
                tips: '从万位、千位、百位、十位、个位中至少选择两个位置,至少选择一个和值号码构成一注。',
                example: '投注方案：勾选位置千位、个位，选择和值6； <br>开奖号码：*4**2 或 *2**4，均中任二组选和值。',
                help: '从万位、千位、百位、十位、个位中任意勾选两个位置，然后选择一个和值，所选2个位置的开奖号码相加之和与所选和值一致，顺序不限，即为中奖(不含对子号)。',
                checkbox: {
                    layout: [{
                        title: '位置',
                        value: ['万位', '千位', '百位', '十位', '个位']
                    }]
                },
                select: {
                    layout: [{
                        title: '号码',
                        balls: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],
                        tools: true
                    }]
                }
            }]
        }],[{
            title: '任三',
            columns: [{
                showname: '复式',
                shortname: 'rx3fs',
                realname: '[任选三_复式]',
                tips: '万、千、百、十、个任意3位，开奖号分别对应且顺序一致即中奖',
                example: '万位买0，千位买1，百位买2，十位买3，开奖01234，则中奖。',
                help: '从万、千、百、十、个中至少3个位置各选一个或多个号码，将各个位置的号码进行组合，所选号码的各位与开奖号码相同则中奖。',
                select: {
                    layout: [{
                        title: '万位',
                        balls: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        tools: true
                    }, {
                        title: '千位',
                        balls: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        tools: true
                    }, {
                        title: '百位',
                        balls: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        tools: true
                    }, {
                        title: '十位',
                        balls: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        tools: true
                    }, {
                        title: '个位',
                        balls: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        tools: true
                    }]
                }
            }, {
                showname: '单式',
                shortname: 'rx3ds',
                realname: '[任选三_单式]',
                tips: '手动输入号码，至少输入1个三位数号码和至少选择三个位置',
                example: '输入号码012选择万、千、百位置，如开奖号码位012**； 则中奖',
                help: '手动输入一注或者多注的三个号码和至少三个位置，如果选中的号码与位置和开奖号码对应则中奖',
                checkbox: {
                    layout: [{
                        title: '位置',
                        value: ['万位', '千位', '百位', '十位', '个位']
                    }]
                },
                textarea: {}
            }, {
                showname: '组三',
                shortname: 'rx3z3',
                realname: '[任选三_组三]',
                tips: '从0-9中任意选择2个或2个以上号码和任意三个位置',
                example: '位置选择万、千、百，号码选择01；开奖号码为110**、则中奖',
                help: '从0-9中任意选择2个或2个以上号码和万、千、百、十、个任意的三个位置，如果组合的号码与开奖号码对应则中奖',
                checkbox: {
                    layout: [{
                        title: '位置',
                        value: ['万位', '千位', '百位', '十位', '个位']
                    }]
                },
                select: {
                    layout: [{
                        title: '号码',
                        balls: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        tools: true
                    }]
                }
            }, {
                showname: '组六',
                shortname: 'rx3z6',
                realname: '[任选三_组六]',
                tips: '从0-9中任意选择3个或3个以上号码和任意三个位置',
                example: '位置选择万、千、百，号码选择012；开奖号码为012**、则中奖',
                help: '从0-9中任意选择3个或3个以上号码和万、千、百、十、个任意的三个位置，如果组合的号码与开奖号码对应则中奖',
                checkbox: {
                    layout: [{
                        title: '位置',
                        value: ['万位', '千位', '百位', '十位', '个位']
                    }]
                },
                select: {
                    layout: [{
                        title: '号码',
                        balls: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        tools: true
                    }]
                }
            }, {
                showname: '混合组选',
                shortname: 'rx3hh',
                realname: '[任选三_混合组选]',
                tips: '手动输入号码，至少输入1个三位数号码和任意三个位置',
                example: '投注方案：345； 选择对应位：百、十、个，开奖号码：**345，即为中奖',
                help: '3个数字为一注，所选开奖号码符合对应所选位置的组三或组六均为中奖。',
                checkbox: {
                    layout: [{
                        title: '位置',
                        value: ['万位', '千位', '百位', '十位', '个位']
                    }]
                },
                textarea: {}
            }, {
                showname: '直选和值',
                shortname: 'rx3_zx_hz',
                realname: '[任选三_直选和值]',
                tips: '从万、千、百、十、个位中至少选择3个位置,至少选择一个和值号码构成一注。',
                example: '投注方案：勾选位置万位、千位、个位，选择和值8； <br>开奖号码：22**4，即中任三直选和值。',
                help: '从万位、千位、百位、十位、个位中任意勾选三个位置，然后选择一个和值，所选3个位置的开奖号码相加之和与所选和值一致，且顺序一致，即为中奖。',
                checkbox: {
                    layout: [{
                        title: '位置',
                        value: ['万位', '千位', '百位', '十位', '个位'],
                        chk:[0,0,0,0,0]
                    }]
                },
                select: {
                    layout: [{
                        title: '号码',
                        balls: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27],
                        cls:'toolong',
                        tools: true
                    }]
                }
            }, {
                showname: '组选和值',
                shortname: 'rx3_zux_hz',
                realname: '[任选三_组选和值]',
                tips: '从万、千、百、十、个位中至少选择3个位置,至少选择一个和值号码构成一注。',
                example: '投注方案：勾选位置万位、千位、个位；选择和值8；<br>开奖号码：13**4 顺序不限，即中任三组选和值。',
                help: '从万位、千位、百位、十位、个位中任意勾选三个位置，然后选择一个和值，所选3个位置的开奖号码相加之和与所选和值一致，顺序不限，即为中奖(不含豹子号)。',
                checkbox: {
                    layout: [{
                        title: '位置',
                        value: ['万位', '千位', '百位', '十位', '个位']
                    }]
                },
                select: {
                    layout: [{
                        title: '号码',
                        balls: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],
                        tools: true
                    }]
                }
            }]
        }], [{
            title: '任四',
            columns: [{
                showname: '复式',
                shortname: 'rx4fs',
                realname: '[任选四_复试]',
                tips: '万、千、百、十、个任意4位，开奖号分别对应且顺序一致即中奖',
                example: '万位买0，千位买1，百位买2，十位买3，个位买4，开奖01234，则中奖。',
                help: '从万、千、百、十、个中至少4个位置各选一个或多个号码，将各个位置的号码进行组合，所选号码的各位与开奖号码相同则中奖。',
                select: {
                    layout: [{
                        title: '万位',
                        balls: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        tools: true
                    }, {
                        title: '千位',
                        balls: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        tools: true
                    }, {
                        title: '百位',
                        balls: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        tools: true
                    }, {
                        title: '十位',
                        balls: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        tools: true
                    }, {
                        title: '个位',
                        balls: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        tools: true
                    }]
                }
            }, {
                showname: '单式',
                shortname: 'rx4ds',
                realname: '[任选四_单式]',
                tips: '手动输入号码，至少输入1个四位数号码和至少选择四个位置',
                example: '输入号码0123选择万、千、百、十位置，如开奖号码位0123*； 则中奖',
                help: '手动输入一注或者多注的四个号码和至少四个位置，如果选中的号码与位置和开奖号码对应则中奖',
                checkbox: {
                    layout: [{
                        title: '位置',
                        value: ['万位', '千位', '百位', '十位', '个位']
                    }]
                },
                textarea: {}
            }, {
                showname: '组选24',
                shortname: 'rx4_zux_z24',
                realname: '[任选四_组选24]',
                tips: '从万位、千位、百位、十位、个位中至少选择四个位置,号码区至少选择四个号码构成一注。',
                example: '投注方案：勾选位置万位、千位、十位、个位，选择号码1234； <br>开奖号码：12*34 或 13*24，均中任四组选24。',
                help: '从万位、千位、百位、十位、个位中任意勾选四个位置，然后从0-9中选择四个号码组成一注，所选4个位置的开奖号码与所选号码一致，顺序不限，即为中奖。',
                checkbox: {
                    layout: [{
                        title: '位置',
                        value: ['万位', '千位', '百位', '十位', '个位']
                    }]
                },
                select: {
                    layout: [{
                        title: '号码',
                        balls: [0,1,2,3,4,5,6,7,8,9],
                        tools: true
                    }]
                }
            }, {
                showname: '组选12',
                shortname: 'rx4_zux_z12',
                realname: '[任选四_组选12]',
                tips: '从万位、千位、百位、十位、个位中至少选择四个位置,从“二重号”选择一个号码，“单号”中选择两个号码组成一注。',
                example: '投注方案：勾选位置万位、千位、十位、个位，选择二重号：8，单号：0、6； <br>开奖号码：88*06 或 08*68，均中任四组选12。',
                help: '从万位、千位、百位、十位、个位中任意勾选四个位置，然后选择1个二重号码和2个单号号码组成一注，所选4个位置的开奖号码中包含与所选号码，且所选二重号码在所选4个位置的开奖号码中出现了2次，即为中奖。',
                checkbox: {
                    layout: [{
                        title: '位置',
                        value: ['万位', '千位', '百位', '十位', '个位'],
                        chk:[0,0,0,0,0]
                    }]
                },
                select: {
                    layout: [{
                        title: '二重号',
                        balls: [0,1,2,3,4,5,6,7,8,9],
                        tools: true
                    },{
                        title: '单　号',
                        balls: [0,1,2,3,4,5,6,7,8,9],
                        tools: true
                    }]
                }
            }, {
                showname: '组选6',
                shortname: 'rx4_zux_z6',
                realname: '[任选四_组选6]',
                tips: '从万位、千位、百位、十位、个位中至少选择四个位置,从“二重号”中选择两个号码组成一注。',
                example: '投注方案：勾选位置万位、千位、十位、个位，选择二重号：6、8； <br>开奖号码：66*88 或 68*68，均中任四组选6。',
                help: '从万位、千位、百位、十位、个位中任意勾选四个位置，然后从0-9中选择2个二重号组成一注，所选4个位置的开奖号码与所选号码一致，并且所选的2个二重号码在所选4个位置的开奖号码中分别出现了2次，顺序不限，即为中奖。',
                checkbox: {
                    layout: [{
                        title: '位置',
                        value: ['万位', '千位', '百位', '十位', '个位'],
                        chk:[0,0,0,0,0]
                    }]
                },
                select: {
                    layout: [{
                        balls: [0,1,2,3,4,5,6,7,8,9],
                        tools: true
                    }]
                }
            }, {
                showname: '组选4',
                shortname: 'rx4_zux_z4',
                realname: '[任选四_组选4]',
                tips: '从万位、千位、百位、十位、个位中至少选择四个位置,从“三重号”中选择一个号码，“单号”中选择一个号码组成一注。',
                example: '投注方案：勾选位置万位、千位、十位、个位，选择三重号：8，单号：0； <br>开奖号码：88*80 或 80*88，均中任四组选4。',
                help: '从万位、千位、百位、十位、个位中任意勾选四个位置，然后从0-9中选择1个三重号和1个单号组成一注，所选4个位置的开奖号码与所选号码一致，并且所选三重号码在所选4个位置的开奖号码中出现了3次，顺序不限，即为中奖。',
                checkbox: {
                    layout: [{
                        title: '位置',
                        value: ['万位', '千位', '百位', '十位', '个位'],
                        chk:[0,0,0,0,0]
                    }]
                },
                select: {
                    layout: [{
                        title: '三重号',
                        balls: [0,1,2,3,4,5,6,7,8,9],
                        tools: true
                    },{
                        title: '单　号',
                        balls: [0,1,2,3,4,5,6,7,8,9],
                        tools: true
                    }]
                }
            }]
        }]]
    }, {
      title: '跨度',
      rows: [[{
        title: '跨度',
        columns: [{
          showname: '前三跨度',
          shortname: 'kdqs',
          realname: '跨度_前三',
          tips: '至少选择一个号码组成一注。',
          example: '投注方案：选择5, 等于开奖号前三位2,5,7的最大数7与最小数字2的差值，即为中奖。',
          help: '玩法：选择0-9，若所选号码与开奖号前三位的最大最小数字的差值相等，即中奖。',
          select: {
            layout: [{
              title: '选号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '中三跨度',
          shortname: 'kdzs',
          realname: '跨度_中三',
          tips: '至少选择一个号码组成一注。',
          example: '投注方案：选择5, 等于开奖号中三位2,5,7的最大数7与最小数字2的差值，即为中奖。',
          help: '玩法：选择0-9，若所选号码与开奖号中三位的最大最小数字的差值相等，即中奖。',
          select: {
            layout: [{
              title: '选号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '后三跨度',
          shortname: 'kdhs',
          realname: '跨度_后三',
          tips: '至少选择一个号码组成一注。',
          example: '投注方案：选择5, 等于开奖号后三位2,5,7的最大数7与最小数字2的差值，即为中奖。',
          help: '玩法：选择0-9，若所选号码与开奖号后三位的最大最小数字的差值相等，即中奖。',
          select: {
            layout: [{
              title: '选号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '前二跨度',
          shortname: 'kdqe',
          realname: '跨度_前二',
          tips: '至少选择一个号码组成一注。',
          example: '投注方案：选择5, 等于开奖号前二位2,7的最大数7与最小数字2的差值，即为中奖。',
          help: '玩法：选择0-9，若所选号码与开奖号前二位的最大最小数字的差值相等，即中奖。',
          select: {
            layout: [{
              title: '选号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '后二跨度',
          shortname: 'kdhe',
          realname: '跨度_后二',
          tips: '至少选择一个号码组成一注。',
          example: '投注方案：选择5, 等于开奖号后二位2,7的最大数7与最小数字2的差值，即为中奖。',
          help: '玩法：选择0-9，若所选号码与开奖号后二位的最大最小数字的差值相等，即中奖。。',
          select: {
            layout: [{
              title: '选号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }]
      }]]
    }, {
      title: '趣味',
      rows: [[{
        title: '特殊',
        columns: [{
          showname: '一帆风顺',
          shortname: 'qwyffs',
          realname: '[特殊_一帆风顺]',
          tips: '从0-9中任意选择1个以上号码。',
          example: '投注方案：8；开奖号码：至少出现1个8，即中一帆风顺。',
          help: '从0-9中任意选择1个号码组成一注，只要开奖号码的万位、千位、百位、十位、个位中包含所选号码，即为中奖。',
          select: {
            layout: [{
              title: '选号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '好事成双',
          shortname: 'qwhscs',
          realname: '[特殊_好事成双]',
          tips: '从0-9中任意选择1个以上的二重号码。',
          example: '投注方案：8；开奖号码：至少出现2个8，即中好事成双。',
          help: '从0-9中任意选择1个号码组成一注，只要所选号码在开奖号码的万位、千位、百位、十位、个位中出现2次，即为中奖。',
          select: {
            layout: [{
              title: '选号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '三星报喜',
          shortname: 'qwsxbx',
          realname: '[特殊_三星报喜]',
          tips: '从0-9中任意选择1个以上的三重号码。',
          example: '投注方案：8；开奖号码：至少出现3个8，即中三星报喜。',
          help: '从0-9中任意选择1个号码组成一注，只要所选号码在开奖号码的万位、千位、百位、十位、个位中出现3次，即为中奖。',
          select: {
            layout: [{
              title: '选号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }, {
          showname: '四季发财',
          shortname: 'qwsjfc',
          realname: '[特殊_四季发财]',
          tips: '从0-9中任意选择1个以上的四重号码。',
          example: '投注方案：8；开奖号码：至少出现4个8，即中四季发财。',
          help: '从0-9中任意选择1个号码组成一注，只要所选号码在开奖号码的万位、千位、百位、十位、个位中出现4次，即为中奖。',
          select: {
            layout: [{
              title: '选号',
              balls: [0,1,2,3,4,5,6,7,8,9],
              tools: true
            }]
          }
        }]
      }]]
    }, {
      title: '龙虎',
      rows: [[{
        title: '龙虎',
        columns: [{
          showname: '万千',
          shortname: 'lhwq',
          realname: '[龙虎_万千]',
          tips: '从万位、千位上选择一个形态组成一注。',
          example: '投注方案：龙；开奖号码万位大于千位：龙，即中奖。',
          help: '根据万位、千位号码数值比大小，万位号码大于千位号码为龙，万位号码小于千位号码为虎，号码相同则为和。所选形态与开奖号码形态一致，即为中奖。',
          select: {
            layout: [{
              title: '龙虎',
              balls: ['龙', '虎', '和']
            }]
          }
        }, {
          showname: '万百',
          shortname: 'lhwb',
          realname: '[龙虎_万百]',
          tips: '从万位、百位上选择一个形态组成一注。',
          example: '投注方案：龙；开奖号码万位大于百位：龙，即中奖。',
          help: '根据万位、百位号码数值比大小，万位号码大于百位号码为龙，万位号码小于百位号码为虎，号码相同则为和。所选形态与开奖号码形态一致，即为中奖。',
          select: {
            layout: [{
              title: '龙虎',
              balls: ['龙', '虎', '和']
            }]
          }
        }, {
          showname: '万十',
          shortname: 'lhws',
          realname: '[龙虎_万十]',
          tips: '从万位、十位上选择一个形态组成一注。',
          example: '投注方案：龙；开奖号码万位大于十位：龙，即中奖。',
          help: '根据万位、十位号码数值比大小，万位号码大于十位号码为龙，万位号码小于十位号码为虎，号码相同则为和。所选形态与开奖号码形态一致，即为中奖。',
          select: {
            layout: [{
              title: '龙虎',
              balls: ['龙', '虎', '和']
            }]
          }
        }, {
          showname: '万个',
          shortname: 'lhwg',
          realname: '[龙虎_万个]',
          tips: '从万位、个位上选择一个形态组成一注。',
          example: '投注方案：龙；开奖号码万位大于个位：龙，即中奖。',
          help: '根据万位、个位号码数值比大小，万位号码大于个位号码为龙，万位号码小于个位号码为虎，号码相同则为和。所选形态与开奖号码形态一致，即为中奖。',
          select: {
            layout: [{
              title: '龙虎',
              balls: ['龙', '虎', '和']
            }]
          }
        }, {
          showname: '千百',
          shortname: 'lhqb',
          realname: '[龙虎_千百]',
          tips: '从千位、百位上选择一个形态组成一注。',
          example: '投注方案：龙；开奖号码千位大于百位：龙，即中奖。',
          help: '根据千位、百位号码数值比大小，千位号码大于百位号码为龙，千位号码小于百位号码为虎，号码相同则为和。所选形态与开奖号码形态一致，即为中奖。',
          select: {
            layout: [{
              title: '龙虎',
              balls: ['龙', '虎', '和']
            }]
          }
        }, {
          showname: '千十',
          shortname: 'lhqs',
          realname: '[龙虎_千十]',
          tips: '从千位、十位上选择一个形态组成一注。',
          example: '投注方案：龙；开奖号码千位大于十位：龙，即中奖。',
          help: '根据千位、十位号码数值比大小，千位号码大于十位号码为龙，千位号码小于十位号码为虎，号码相同则为和。所选形态与开奖号码形态一致，即为中奖。',
          select: {
            layout: [{
              title: '龙虎',
              balls: ['龙', '虎', '和']
            }]
          }
        }, {
          showname: '千个',
          shortname: 'lhqg',
          realname: '[龙虎_千个]',
          tips: '从千位、个位上选择一个形态组成一注。',
          example: '投注方案：龙；开奖号码千位大于个位：龙，即中奖。',
          help: '根据千位、个位号码数值比大小，千位号码大于个位号码为龙，千位号码小于个位号码为虎，号码相同则为和。所选形态与开奖号码形态一致，即为中奖。',
          select: {
            layout: [{
              title: '龙虎',
              balls: ['龙', '虎', '和']
            }]
          }
        }, {
          showname: '百十',
          shortname: 'lhbs',
          realname: '[龙虎_百十]',
          tips: '从百位、十位上选择一个形态组成一注。',
          example: '投注方案：龙；开奖号码百位大于十位：龙，即中奖。',
          help: '根据百位、十位号码数值比大小，百位号码大于十位号码为龙，百位号码小于十位号码为虎，号码相同则为和。所选形态与开奖号码形态一致，即为中奖。',
          select: {
            layout: [{
              title: '龙虎',
              balls: ['龙', '虎', '和']
            }]
          }
        }, {
          showname: '百个',
          shortname: 'lhbg',
          realname: '[龙虎_百个]',
          tips: '从百位、个位上选择一个形态组成一注。',
          example: '投注方案：龙；开奖号码百位大于个位：龙，即中奖。',
          help: '根据百位、个位号码数值比大小，百位号码大于个位号码为龙，百位号码小于个位号码为虎，号码相同则为和。所选形态与开奖号码形态一致，即为中奖。',
          select: {
            layout: [{
              title: '龙虎',
              balls: ['龙', '虎', '和']
            }]
          }
        }, {
          showname: '十个',
          shortname: 'lhsg',
          realname: '[龙虎_十个]',
          tips: '从十位、个位上选择一个形态组成一注。',
          example: '投注方案：龙；开奖号码十位大于个位：龙，即中奖。',
          help: '根据十位、个位号码数值比大小，十位号码大于个位号码为龙，十位号码小于个位号码为虎，号码相同则为和。所选形态与开奖号码形态一致，即为中奖。',
          select: {
            layout: [{
              title: '龙虎',
              balls: ['龙', '虎', '和']
            }]
          }
        }]
      }]]
	}];

	/**
	 * TODO 逻辑开始
	 */

	// 得到用户选择的位置，格式化后的数据
	var getSelectPlace = function(playArea) {
		var places = [];
		var sp = playArea.find('.places');
		if(sp && sp.length > 0) {
			$.each(sp, function() {
				var place = [];
				var as = $(this).find('ul > li input[type="checkbox"]');
				$.each(as, function() {
					if($(this).is(':checked')) {
						place.push('√');
					} else {
						place.push('-');
					}
				});
				places.push(place);
			});
		}
		return places;
	}

	// 得到用户选择的号码，格式化后的数据
	var getSelectBall = function(playArea) {
		var datasel = [];
		var sb = playArea.find('.balls');
		if(sb && sb.length > 0) {
			$.each(sb, function() {
				var ball = [];
				var as = $(this).find('ul > li > a.selected');
				$.each(as, function() {
					var val = $(this).attr('data-val');
					ball.push(val);
				});
				datasel.push(ball);
			});
		}
		return datasel;
	}

	// 得到用户输入的号码，格式化后的数据
	var getTextareaBall = function(playArea) {
		var datasel = [];
		var textarea = playArea.find('.textarea > textarea');
		if(textarea && textarea.length > 0) {
			var format = textarea.val().replace(/\,|\;|\n|\t/g, ' ');
			var as = format.split(' ');
			$.each(as, function(idx, val) {
				datasel.push(val);
			});
		}
		return datasel;
	}

	// 构造选号区域 2388
	var buildSelectPlace = function(playArea, select) {
		$.each(select.layout, function(i, val) {
			var row = $('<div class="row clearfix">');
			if(val.title) {
				row.append('<div class="label">' + val.title + '<div class="triangle"></div></div>');
			}
			if(val.cls) {
				row.addClass(val.cls);
			}
      if (typeof val.only !== 'undefined') {
        //console.log(val.only,'onlyonlyonlyonly');
      }
			// 球
			var balls = $('<div class="balls">').append('<ul>');
			$.each(val.balls, function(j, ball) {
				balls.find('ul').append('<li'+(typeof val.only !== 'undefined' ? ' class="only"' :'')+'><a data-val="' + ball + '">' + ball + '</a></li>');
			});
			balls.find('ul > li > a').unbind('click').click(function() {
				//console.log(' b click ');
        if ($(this).parent().hasClass('only')) {
          balls.find('ul > li').removeClass('selected');
          balls.find('ul > li > a').removeClass('selected');
        }

        if($(this).hasClass('selected')) {
					$(this).parent().removeClass('selected');
          $(this).removeClass('selected');
				} else {
					$(this).parent().addClass('selected');
          $(this).addClass('selected');
				}
				PlayOptions.update();AdjustPrize.update();
			});
			row.append(balls);
			// 工具
			if(val.tools) {
				buildBallTools(row, balls);
			}
			playArea.append(row);
		});
	}

	// 构造选号工具
	var buildBallTools = function(row, balls) {
		var blist = balls.find('ul > li > a');
		var tools = $('<div class="tools">').append('<ul><li><a data-command="all">全</a></li><li><a data-command="big">大</a></li><li><a data-command="small">小</a></li><li><a data-command="single">单</a></li><li><a data-command="double">双</a></li><li><a data-command="clean">清</a></li></ul>');
		var setSelected = function(els, selected) {
			if(selected) {
				if(!els.hasClass('selected')) {
					els.trigger('click');
				}
			} else {
				if(els.hasClass('selected')) {
					els.trigger('click');
				}
			}
		}
		tools.find('a[data-command="all"]').unbind('click').click(function() {
			$.each(blist, function() {
				setSelected($(this), true);
			});
		});
		tools.find('a[data-command="big"]').unbind('click').click(function() {
			$.each(blist, function(idx) {
				if(idx < Math.round(blist.length/2)) {
					setSelected($(this), false);
				} else {
					setSelected($(this), true);
				}
			});
		});
		tools.find('a[data-command="small"]').unbind('click').click(function() {
			$.each(blist, function(idx) {
				if(idx < Math.round(blist.length/2)) {
					setSelected($(this), true);
				} else {
					setSelected($(this), false);
				}
			});
		});
		tools.find('a[data-command="single"]').unbind('click').click(function() {
			var arr = [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37];
			$.each(blist, function() {
				var val = parseInt($(this).attr('data-val'));
				if($.inArray(val, arr) != -1) {
					setSelected($(this), true);
				} else {
					setSelected($(this), false);
				}
			});
		});
		tools.find('a[data-command="double"]').unbind('click').click(function() {
			var arr = [0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38];
			$.each(blist, function() {
				var val = parseInt($(this).attr('data-val'));
				if($.inArray(val, arr) != -1) {
					setSelected($(this), true);
				} else {
					setSelected($(this), false);
				}
			});
		});
		tools.find('a[data-command="clean"]').unbind('click').click(function() {
			$.each(blist, function() {
				setSelected($(this), false);
			});
		});
		row.append(tools);
	}

	// 构造手动输入框
	var buildTextareaPlace = function(playArea) {
		var textarea = $('<div class="textarea">').append('<textarea>');
		var help = $('<div class="help">').html('<label class="lf">每注号码之间请用一个空格或英文逗号或英文分号隔开（输入的号码会自动排序并去除不合格号码）。</label><a class="hand clearTextarea rf">清空</a>');
		textarea.find('textarea').keyup(function() {
      $(this).val($(this).val().replace(/[；.,。，、|]/g, ' '));
			PlayOptions.update();
		});
    textarea.find('textarea').on('paste',function() {
      var thisarea = $(this);
      setTimeout(function() {
        thisarea.val(thisarea.val().replace(/[；.,。，、|]/g, ' '));
			  PlayOptions.update();
      },10)
		});
		playArea.append(textarea);
		playArea.append(help);

    //清空单式
    playArea.find('.clearTextarea').unbind('click').click(function(){
      $('.textarea textarea').val('').keyup()
    });
	}

	var lastCheckBox = [];
	// 构造位置
	var buildCheckboxPlace = function(playArea, checkbox) {
		$.each(checkbox.layout, function(i, val) {
			var row = $('<div class="row clearfix">');
			if(val.title) {
				row.append('<div class="label">' + val.title + '</div>');
			}
			// 位置
			var places = $('<div class="places">').append('<ul>');
			var allchk = val.chk;
      $.each(val.value, function(j, value) {
        //console.log(j,'jjjjjjjj',value);
        if (typeof allchk !='undefined') {
          places.find('ul').append('<li><label><input type="checkbox" '+(allchk[j]>0 ? ' checked="checked"' : '')+'>' + value + '</label></li>');
        }else {
          places.find('ul').append('<li><label><input type="checkbox">' + value + '</label></li>');
        }

			});
			places.find('ul > li input[type="checkbox"]').change(function() {
				lastCheckBox = getSelectPlace(playArea)[0];
				PlayOptions.update();
			});
			if (lastCheckBox) {
				for (var j = 0; j < lastCheckBox.length; j++) {
					if (lastCheckBox[j] == '√') {
						places.find('ul > li input[type="checkbox"]').eq(j).trigger('click');
					}
				}
			}
			row.append(places);
			playArea.append(row);
		});
	}

	var PlayArea = function() {
		var data = function() {
			var playArea = $('.lottery-betting .lottery-opearation > .play-area');
			var datasel = [];
			var places = getSelectPlace(playArea);
			var balls = getSelectBall(playArea);
			var textarea = getTextareaBall(playArea);
			var sb = datasel.concat(places).concat(balls).concat(textarea);
      return sb;
		}
		var reset = function() {
			var playList = $('.lottery-betting .lottery-opearation > .play-list');
			playList.find('[data-method="' + $bData.method + '"]').trigger('click');
		}

		return {data: data, reset: reset};
	}();

	// 构造选项栏
	var buildPlayOptions = function(playOptions) {
    //console.log('buildPlayOptions');
		playOptions.append([
      '<div class="part-one">',
      '<div class="label">您选择了 <span class="text-money" data-field="num">0</span> 注</div>',
      '<div class="multiple"><input name="multiple" type="text" value="1"></div><div class="label">倍</div>',
      '<div class="model" style="margin-right:0px;"><a data-val="yuan">元</a><a data-val="jiao">角</a><a data-val="fen">分</a><a data-val="li">厘</a></div>',
			'<div class="label">共投注 <span class="text-money" data-field="total">0.000</span> 元</div>',
      '<div class="label" style="padding-right:0px;">返点</div><div class="adjust-prize"></div>',

      '</div>'].join('')
    );
    playOptions.append([
      '<div class="part-two">',
      '<a class="same-zuohao same-zuohao-z"><em class="icon">&#xe63e;</em>一键投注</a><span class="same-gap"></span>',
      '<a class="same-zuohao same-zuohao-b"><em class="icon">&#xe616;</em>快速投注</a><span class="same-gap"></span>',
      '<a class="same-zuohao same-addnumber"><em class="icon">&#xe626;</em>添加号码</a>',
      '</div>'].join('')
    );
		// playHelp.append('');
		/*playOptions.append([
      '<div class="part-two">',
      //'<div class="label">模式</div>',
		  //'<div class="label">倍数</div>',
      '<div class="multiple"><input name="multiple" type="text" value="1"></div><div class="label">倍</div>',
      '<div class="model"><a data-val="yuan">元</a><a data-val="jiao">角</a><a data-val="fen">分</a><a data-val="li">厘</a></div>',
      '</div>'].join('')
    );*/
		//playOptions.append('<div class="button"><a data-command="add">添加到投注列表</a><a data-command="add">立即投注</a></div>');

		// GET Cookie Model Value
		var bDataModel = 'yuan';
		if($.cookie('USER_BDATA_MODEL')) {
			bDataModel = $.cookie('USER_BDATA_MODEL')
		}
		playOptions.find('.model > a[data-val="' + bDataModel + '"]').addClass('selected');

		// 倍数输入框
		var multiple = playOptions.find('.multiple > input');
		multiple.keyup(function() {
			if($(this).val() == '') return;
			var val = $(this).val();
			if(/^[0-9]*$/.test(val)) {
				val = Number(val);
				if(val > 99999) $(this).val(99999);
				if(val < 1) $(this).val(1);
				PlayOptions.update();
			} else {
				$(this).val(1);
				PlayOptions.update();
			}
		});
		multiple.keydown(function(e) {
			if(e.keyCode == 38 || e.keyCode == 40) {
				if($(this).val() == '') return;
				var val = Number($(this).val());
				if(!isNaN(val)) {
					if(e.keyCode == 38) val++;
					if(e.keyCode == 40) val--;
					if(val > 99999) val = 99999;
					if(val < 1) val = 1;
					$(this).val(val);
				}
			}
		});
		multiple.off('blur').blur(function() {
			if($(this).val() == '') {
				$(this).val(1);
				PlayOptions.update();
			}
		});
		// 分模式
		var fenModel = function() {
			if($FenDownCode > 0) {
				var thisCode = $SysCode - $FenDownCode;
				if($UserCode > thisCode) {
					$UserMaxCode = thisCode - $DownCode;
					App.alert('info', '提示消息', '分模式最高为' + $UserMaxCode + '。', 3000);
				}
			}
		}
		// 厘模式
		var liModel = function() {
			if($LiDownCode > 0) {
				var thisCode = $SysCode - $LiDownCode;
				if($UserCode > thisCode) {
					$UserMaxCode = thisCode - $DownCode;
					App.alert('info', '提示消息', '厘模式最高为' + $UserMaxCode + '。', 3000);
				}
			}
		}
		// 默认模式
		var defaultModel = function() {
			$UserMaxCode = $UserCode - $DownCode;
      //console.log($UserCode,$DownCode,$UserMaxCode);
			$UserMinCode = $SysCode - $UserLp * 20;
      //console.log($SysCode,$UserLp,$UserMinCode,'$UserMinCode');
		}
		// 更新默认
		var update = function(model) {
			if(model == 'fen') {
				fenModel();
			} else if(model == 'li') {
				liModel();
			} else {
				defaultModel();
			}
		}
		// 模式选择
		var models = playOptions.find('.model > a');
		models.click(function() {
			if(!$(this).hasClass('selected')) {
				models.removeClass('selected');
				$(this).addClass('selected');
				var model = $(this).attr('data-val');
				update(model);

				AdjustPrize.slider();
				AdjustPrize.update();
				PlayOptions.update();
				// SET Cookie Model Value
				var expires = new Date(moment().startOf('year').add(1, 'years'));
				$.cookie('USER_BDATA_MODEL', model, {expires: expires, path: '/'});
			}
		});
		update(bDataModel);
	}

	var PlayOptions = function() {
		var els = function() {
			return $('.lottery-betting .lottery-opearation > .play-options');
		}
		var multiple = function() {
			return Number(els().find('.multiple > input').val());
		}
		var model = function() {
			var val = els().find('.model > a.selected').attr('data-val');
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
		var update = function() {
      var sumstr = LotteryUtils.inputFormat($('.play-list .selected').data('method'), PlayArea.data());
      //console.log(PlayArea.data(),'PlayArea.data()PlayArea.data()PlayArea.data()');
      $('.ks_btn').attr('summary',(sumstr.length<20 ? sumstr : (sumstr.substring(0, 20)+'...')));
			//console.log('inputNumbers 2');

      var num = LotteryUtils.inputNumbers($bData.method, PlayArea.data());
			var total = multiple() * num * $SysUnitMoney * model().money;
			els().find('[data-field="num"]').html(num);
			els().find('[data-field="total"]').html(total.toFixed(3));
      //console.log(window.parent.document);
      //console.log($('.footer-bar-deal #mobile_dealcount', window.parent.document));
      if ($('.footer-bar-deal #mobile_dealcount', window.parent.document).length>0) {
        $('.footer-bar-deal #mobile_dealcount', window.parent.document).html(num);
        $('.footer-bar-deal #mobile_amount', window.parent.document).html(total.toFixed(3));
      }

      if (parseInt(num,10)>0) {
        $('.btn[data-command="add"]').addClass('active');
      }else {
        $('.btn[data-command="add"]').removeClass('active');
      }
      //console.log(typeof sumAll !='undefined','sumAllsumAll');
		}
		return {els: els, multiple: multiple, model: model, update: update};
	}();

	// 构造奖金
	var buildAdjustPrize = function(adjustPrize, column) {
    //console.log('buildAdjustPrize');
		adjustPrize.empty();
		adjustPrize.append('<div class="slider"></div><span data-field="code">0</span> / <span data-field="point">0.0</span>%');
		var slider = adjustPrize.find('.slider');
		var start = $UserMaxCode;
    //console.log(start,'start');
		// GET Cookie Code Value
		if($.cookie('USER_BDATA_CODE')) {
			var bCode = $.cookie('USER_BDATA_CODE');
			if (!isNaN(bCode)) {
				if(bCode > $UserMaxCode) {
					start = $UserMaxCode;
				} else if(bCode < $UserMinCode) {
					start = $UserMinCode;
				} else {
					start = bCode;
				}
			}
		}
    //console.log(start,'end start');
    var lc = GameData.getConfig();
    if (parseInt($UserMaxCode,10)>parseInt(lc.maxBetCode,10)) {
      $UserMaxCode=parseInt(lc.maxBetCode,10)
    }
    var sop = {connect: 'lower', behaviour: 'snap', step: 2, start: start,range: {'max': $UserMaxCode, 'min': $UserMinCode}};
		//console.log(typeof slider,typeof slider.noUiSlider,'noUiSlidernoUiSlidernoUiSlidernoUiSlider');
    if (typeof slider !='undefined') {
      if (typeof slider.noUiSlider =='function') {
        slider.noUiSlider(sop);
      }
    }
    $('[data-command="chase"]').attr('code',$UserMinCode);
		if ($UserMaxCode == $UserMinCode) {
			slider.attr('disabled', 'disabled');
		} else {
			slider.removeAttr('disabled');
		}
		var update = function(code) {
			var point = $UserLp - ((code - $UserMinCode) / 20.0).toFixed(1);
			adjustPrize.find('[data-field="code"]').html(code);
			adjustPrize.find('[data-field="point"]').html(point.toFixed(1));
      //console.log('AdjustPrize.update');
			AdjustPrize.update();
		}
		var onSet = function() {
			var code = Number(slider.val());
			update(code);
			// SET Cookie Code Value
			var expires = new Date(moment().startOf('year').add(1, 'years'));
			$.cookie('USER_BDATA_CODE', code, {expires: expires, path: '/'});
		}
		var onSlide = function() {
			var code = Number(slider.val());
			update(code);
		}
		slider.on({set: onSet, slide: onSlide});
		update(start);
	}

	// 玩法提示
	var PlayHelp = function() {
		var els = function() {
			return $('.lottery-betting .lottery-opearation > .play-help');
		}
		var update = function(t) {
			$('.lottery-betting .lottery-opearation .prize').find('[data-field="prize"]').html(t);
		}
		return {els: els, update: update};
	}();

	// 奖金调节获取值
	var AdjustPrize = function() {
		var els = function() {
			return $('.lottery-betting .lottery-opearation .adjust-prize');
		}
		var code = function() {
			return Number(els().find('[data-field="code"]').html());
		}
		var point = function() {
			return Number(els().find('[data-field="point"]').html());
		}
		var slider = function() {
      els().find('.slider').noUiSlider({range: {'max': $UserMaxCode, 'min': $UserMinCode}}, true);
		}
		var update = function() {
			var method = $Method[$bData.method];
			var model =  PlayOptions.model();
			var mMoney = PlayOptions.model().money;
			if(method) {
				var ps = method.bonus.split(',');
        var psx = Number(method.x);
        //console.log(ps,'pssssssssssssssss');
        /*if (String($bData.method).indexOf('lh')>-1 && String($bData.method)!='sxzuxzlh') {
          var topbonus = ps[0];
          ps.unshift(Number(parseFloat(topbonus/4.5)).toFixed(8));
          ps.unshift(Number(parseFloat(topbonus/4.5)).toFixed(8))
        } */
        /*if (String($bData.method).indexOf('hhzx')>-1) {
          var topbonus = ps[0];
          ps.unshift(Number(parseFloat(topbonus/2)).toFixed(2))
        }*/
				var t = [];
        //console.log($UserMinCode,'updateupdateupdate$UserMinCode$UserMinCode');
        $('[data-command="chase"]').attr('code',$UserMinCode);
				for (var i = 0, j = ps.length; i < j; i++) {
          //console.log(Number(ps[i]),$UserMinCode);
          var percent = Number(ps[i])/$UserMinCode;
          //console.log($SysBaseCode,'$SysBaseCode');
          //console.log(code(),percent,ps[i],$SysUnitMoney);
          var pm = (Number(ps[i]) +  ((code()-$SysBaseCode) / Number(2000)) * psx)* ($SysUnitMoney / 2);
          //var pm = (code()*percent / Number(ps[i])) * Number(ps[i]) * ($SysUnitMoney / 2);
          //console.log(pm);
          t.push(pm);
				}
				t.sort(function(a, b) {
					return Number(a) > Number(b) ? 1 : -1;
				});
        //console.log(t.length,t,'t.lengtht.lengtht.length');
				if(t.length == 1) {
          t[0]= t[0]*model.money;
					PlayHelp.update(t[0].toFixed(3));
				} else {
          var allbonusstr = [];
          if (t.length>2 && t.length<4) {
            for (j = 0; j < t.length; j++) {
              allbonusstr.push(Number(t[j]*model.money).toFixed(3));
            }
            PlayHelp.update(allbonusstr.join('/'));
          }else {
            t[0]= t[0]*model.money;
            t[t.length - 1] = t[t.length - 1]*model.money;
            PlayHelp.update(t[0].toFixed(3) + ' ~ ' + t[t.length - 1].toFixed(3));
          }
				}
			}
		}
		return {els: els, code: code, point: point, update: update, slider: slider};
	}();

	/**
	 * TODO 添加号码
	 */

	var addCallback = []; // 添加号码后的事件
	var addToList = function(callback,finalcall) {
		//var issue = ''; // 暂时不用填写期号
		var issue = $('[data-field="global-expect"]').html();
    var method = $bData.method;
		var compress = $bData.compress;
		var datasel = PlayArea.data();
		var num = LotteryUtils.inputNumbers(method, datasel);
		var content = LotteryUtils.inputFormat(method, datasel);
    var code = AdjustPrize.code();
		var point = AdjustPrize.point();
		var multiple = PlayOptions.multiple();
		var model = PlayOptions.model().val;
		var total = multiple * num * $SysUnitMoney * PlayOptions.model().money;
		if(num == 0) {
			App.alert('info', '提示消息', '您还没有选择号码或所选号码不全！', 3000000);
			return false;
		}
		var _method = $Method[method];
		if (num <= _method.oooNums) {
			App.confirm('question', '温馨提示', '您所投注内容属于单挑玩法，最高奖金为' + _method.oooBonus + '元，确认继续投注？', 0, '确认', '取消', function() {
				LotteryRecord.add(issue, method, compress, content, num, multiple, model, code, point, total, callback);
				PlayArea.reset();
			});
		} else {
      if (String(method).indexOf('lh')>-1) {
        //龙虎拆单
        var splitcontent = content.split('|');
        for (i = 0; i < splitcontent.length; i++) {
          var realnum = parseInt(num/splitcontent.length,10);
          total = multiple * realnum * $SysUnitMoney * PlayOptions.model().money;
          LotteryRecord.add(issue, method, compress, splitcontent[i], realnum, multiple, model, code, point, total, null);
        }
        if (typeof finalcall == 'function') {
          finalcall();
        }
      }else {
        LotteryRecord.add(issue, method, compress, content, num, multiple, model, code, point, total, callback);
      }

			PlayArea.reset();
		}
	}

	// 投注列表
	var LotteryRecord = function() {
		var els = function() {
			return $('.lottery-record');
		}
    var btnels = function() {
			return $('.lottery-onlybtns');
		}
		var name = function(method) {
			var method = $Method[method];
			return '[' + method.name + ']';
		}
		var format = function(content) {
			if(content.length > 16) {
				content = content.substring(0, 16) + '…<a data-command="details">[详细]';
			}
			return content;
		}
		var add = function(issue, method, compress, content, num, multiple, model, code, point, total, callback) {
			var tbody = els().find('.list table > tbody');
			var tr = $('<tr>');
      var cnmodel = function(m) {
        var cnm = {'yuan':'元','jiao':'角','fen':'分','li':'厘'}
        return cnm[m];
      }
      tr.data('c',content);
			tr.append('<td class="content">' + name(method) + '</td>');
      tr.append('<td class="short nandm" rel="'+num+'">' + format(content) + '</td>');
      //tr.append('<td class="content">' + name(method) + format(content) + '</td>');
			//tr.append('<td class="num">' + num + '注</td>');
			//tr.append('<td class="multiple">' + multiple + '倍</td>');
      //tr.append('<td class="nandm" rel="'+num+'">' + num + '注/' + multiple + '倍</td>');
			//tr.append('<td class="point">' + point.toFixed(1) + '%</td>');
			tr.append('<td class="total">' + total.toFixed(3) + '元</td>');
			tr.append('<td class="btn"><a data-command="del"><em class="icon">&#xe60b;</em></a></td>');
			tr.find('a[data-command="del"]').click(function() {
				var idx = tbody.find('tr').index(tr);
				ArrayUtil.remove($bList, idx);
				tr.remove();
        if (tbody.find('tr').size()==0) {
          $('.ks_btn[data-command="quick"]').removeClass('disabled');
        }
			});
			tbody.append(tr);
			// 加密处理开始
			if(compress === true && num >= 1000) {
				App.blockUI({
					target: els(),
					boxed: true,
					message: '超大注数处理中...'
				});
				//LZMA.compress(content, 3, function(result) {
					App.unblockUI(els());
					//if(result === false) {
					//	return App.alert('info', '消息提示', '号码添加失败，请重试！', 3000);
					//}
					//content = LZMAUtil.toHex(result);
          //console.log(content,'contentcontentcontentcontent');
          content = LZString.compressToEncodedURIComponent(content);
          //console.log(content,'LZMAUtil/LZString');
					$bList.push({lottery: $Lottery, issue: issue, content: content, num: num, method: method, multiple: multiple, model: model, code: code, compress: true});
					// 回调函数
					if($.isFunction(callback)) callback();
					for (var i = 0; i < addCallback.length; i++) {
						if($.isFunction(addCallback[i])) {
							addCallback[i]();
						}
					}
				//});
			} else {
				$bList.push({lottery: $Lottery, issue: issue, content: content, num: num, method: method, multiple: multiple, model: model, code: code, compress: false});
				// 回调函数
				if($.isFunction(callback)) callback();
				for (var i = 0; i < addCallback.length; i++) {
					if($.isFunction(addCallback[i])) {
						addCallback[i]();
					}
				}
			}

      tr.find('[data-command="details"]').off('click').click(function() {
        App.alertLimit('chknumdetail','info', '查看详细',tr.data('c'), 3000000);
      });
		}
		var clear = function() {
			els().find('.list table > tbody').empty();
			$bList = [];
		}
		var isInit = false;

    var init = function() {
      //console.log(!isInit,'sssc init');
			if(!isInit) {
				//isInit = true;
				App.initScroll();
				var button = btnels().find('.button');
				button.find('[data-command="add"]').off('click').click(function() {
					//console.log('addToListaddToList');
          addToList(function() {
            $('.ks_btn[data-command="quick"]').addClass('disabled')
          });
				});

        var sameaddbuttton = $('.lottery-opearation .same-addnumber');
        sameaddbuttton.off('click').click(function() {
          addToList(function() {
            $('.ks_btn[data-command="quick"]').addClass('disabled')
          });
				});
        var samequickbuttton = $('.lottery-opearation .same-zuohao-b,.lottery-opearation .same-zuohao-z');
        samequickbuttton.off('click').click(function() {
          $('.button [data-command="quick"]').click();
				});
        //console.log('reinit');
				button.find('[data-command="submit"]').unbind('click').click(function() {
          console.log('aaaaaaaaaaaaaa');
          /*BootstrapDialog.show({
            cssClass:'quick-bet',
            title: '<i class="icon lock"></i>快速投注',
            message:function(){
                return [
                  //"<div class='cftip lname'>彩种："+GameData.getInfo().showName+"</div>",
                  "<div class='cftip lname'>你确认加入第"+$('.lottery-open-info [data-field="global-expect"]').text()+"期？</div>",
                  "<div class='cftip totalm'>总注数："+($('.total-inner [data-field="sum-num"]').text() =='0' ? $('.text-money[data-field="num"]').text() : $('.total-inner [data-field="sum-num"]').text())+"</div>",
                  "<div class='cftip totalm'>订单笔数：1</div>","<div class='cftip totalm'>是否追号：否</div>",
                  //"<div class='cftip digest'>"+$('.play-list .selected').parent().find('>.label').text()+","+$('.play-list .selected').text()+" "+$('.ks_btn').attr('summary')+"</div>",
                  "<div class='cftip totalm'>投注总额："+($('.total-inner [data-field="sum-money"]').text() == '0.000' ? $('.text-money[data-field="total"]').text() : $('.total-inner [data-field="sum-money"]').text()) +"元</div>",
                  "<div class='cftip aboutmax'>温馨提示：本期最高奖金限额"+Route.LotteryBonusTip(GameData.getInfo().id)+"元，请会员谨慎投注！</div>"
                ].join('');
              }(),
            buttons: [{
              label: '确定投注',
              action: function(dialog) {
                //console.log($bList.length,'$bList.length$bList.length$bList.length');
                //console.log($('.lottery-betting .lottery-opearation > .play-options .multiple > input').val(),'multiplemultiplemultiple');
                if($bList.length > 0) {
                  //console.log('nolist',$bList);
                  doSubmit(dialog);
                } else {
                  addToList(function() {
                    doSubmit(dialog);
                  },function() {
                    doSubmit(dialog);
                  });
                }
              }
            }, {
              label: '取消',
              action: function(dialog) {
                dialog.close();
              }
            }]
          });*/
          if($bList.length > 0) {
            doSubmit();
          } else {
            addToList(function() {
              doSubmit();
            },function() {
              doSubmit();
            });
          }
          /*if($bList.length > 0) {
						doSubmit();
					} else {
						addToList(doSubmit);
					}*/
				});
				button.find('[data-command="clear"]').click(function() {
					clear();
				});
				button.find('[data-command="chase"]').unbind('click').click(function() {
					if (typeof QueryString.iframe !='undefined') {
            addToList();
          }
          console.log(LotteryChase,'LotteryChaseLotteryChase');
          LotteryChase.init();
				});
			}
		}
    var blist = function() {
      return $bList
    }
		return {init: init, add: add, clear: clear,blist: blist};
	}();

	// 初始化网页元素
	var initDocument = function() {
    $('.lottery-betting .lottery-opearation').empty();
		var main = $('.lottery-betting .lottery-opearation')
		var playGroups = $('<div class="play-groups">').append('<ul>');
		var playList = $('<div class="play-list">');
		var playHelp = $('<div class="play-help">');
		var playArea = $('<div class="play-area">');
		//var adjustPrize = $('<div class="adjust-prize">');
    var adjustPrize = $('.lottery-betting .lottery-opearation .adjust-prize');
		var playOptions = $('<div class="play-options clearfix">');
    var fullmethods = {};

    // 组态和值高亮
    var zutypech = {
      "任选":null,
      "五星":"五星组态",
      "后三":"后三组态",
      "二星":"直选和值",
      "前三":"前三组态",
      "定位胆":null,
      "后四":"四星组态",
      "中三":"中三组态"
    }
    var zutypemethod = function(textkey) {
      var chkdtwuxin = function(str) {
        var ar = str.split(',');
        //console.log(_.sortBy(ar));
        if (str==null) {return '';  }
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
        if (hasDuplicates(ar,2,2)){return '组6'}
        if (hasDuplicates(ar,2,3)){return '组4'}
        return '组24'
      }
      var chksan1 = function(str) {
        if (str==null) {return '';  }
        var allno = str.split(',');
        allno = _.take(allno, 3);
        //console.log(allno);
        if (hasDuplicates(allno,1)) {return '组三'}
        return '组六'
      }
      var chksan2 = function(str) {
        if (str==null) {return '';  }
        var allno = str.split(',');
        allno = _.takeRight(allno, 4);
        allno = _.take(allno, 3);
        if (hasDuplicates(allno,1)) {return '组三'}
        return '组六'
      }
      var chksan3 = function(str) {
        if (str==null) {return '';  }
        var allno = str.split(',');
        allno = _.takeRight(allno, 3);
        if (hasDuplicates(allno,1)) {return '组三'}
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
    var linfo = GameData.getInfo();
    // 初始化玩法组
		var initPlayGroups = function(index) {
			playGroups.find('ul').empty();
      var alllocalmethod = [];
      for (i = 0; i < Layout.length; i++) {
        alllocalmethod.push(Layout[i].title)
      }
			var ishavePankou = [11];
      var pankouLink = {
        '11':'80'
      }
      //console.log(GameData.getMethodList());
      var topmethodclsdict ={
        '五星':'wx','后四':'h4','前三':'q3','中三':'z3','后三':'h3','二星':'ex','定位胆':'dw','不定胆':'bdw','任选':'rx','趣味':'qw','龙虎':'lh'
      }
			$.each(Layout, function(i, group) {
        //console.log(group);

        if ($.inArray(group.title,GameData.getMethodList())>-1) {
          var thisGroup = $('<li>').append('<a>' + group.title + '</a>');
          // 点击效果
          var mtype = group.title;
          thisGroup.addClass(topmethodclsdict[group.title]);
          thisGroup.find('a').off('click').click(function() {
            //console.log('aaaaaaaclickclickclickclickclickclick');

            if(!$(this).hasClass('selected')) {
              playGroups.find('li > a.selected').removeClass('selected');
              $(this).addClass('selected');
              var topmname = $(this).text();
              //console.log(topmname);

              if (zutypech[$(this).text()]!=null) {
                $('.lottery-open-list .code').removeClass('expand');
                $('.lottery-open-list .title .zutype').html(zutypech[$(this).text()]).show();
                $('.lottery-open-list .list .zutype').show();
              }else {
                $('.lottery-open-list .code').addClass('expand');
                $('.lottery-open-list .title .zutype').html('').hide();
                $('.lottery-open-list .list .zutype').hide();
              }
              var nowmethod = zutypemethod(topmname);
              $('.lottery-open-list .list .zutype').each(function(i,el) {
                if (typeof nowmethod !='undefined') {
                  $(el).html(nowmethod($(el).attr('rel')))
                }
              });
              //LotteryOpenCode.init(linfo);
              initPlayList(group.rows);
            }
          });
          //console.log('thisGroupthisGroup',thisGroup);
          playGroups.find('ul').append(thisGroup);
        }

			});
			if ($.inArray(GameData.getInfo().id,ishavePankou)>-1) {
        if (typeof pankouLink[GameData.getInfo().id] !='undefined') {
          playGroups.find('ul').append($('<li><a class="linkpan" href="/yx/xjw/v/lottery/'+pankouLink[GameData.getInfo().id]+'.html" target="_blank">经典</a></li>'));
          $('div.fixed-right a.classic').attr('href','/yx/xjw/v/lottery/'+pankouLink[GameData.getInfo().id]+'.html').css('display','block');
        }
      }
			playGroups.find('ul > li > a').eq(index).trigger('click');
		}
		// 初始化玩法列表
		var initPlayList = function(list) {
			playList.empty();
      var aviableMethod = GameData.getMethodList();
			$.each(list, function(i, rows) {
				var thisRow = $('<div class="row">');
        console.log(rows);
				if (String(rows[0].title).indexOf('不定胆')>-1 && i>0 && String(rows[0].title).indexOf('后四不定胆')==-1) {
          thisRow.addClass('rowleft');
        }
        $.each(rows, function(j, row) {
					thisRow.append('<div class="label">' + row.title + '</div>');

					var allsee = [];
          $.each(row.columns, function(k, column) {
            //console.log(column.shortname,GameData.getMethods(),$.inArray(column.shortname,GameData.getMethods())>-1);
            if ($.inArray(column.shortname,GameData.getMethods())>-1) {
              allsee.push(k);
              var thisColumn = $('<div class="column">').attr('data-method', column.shortname).html(column.showname);
              // 点击效果
              thisColumn.click(function() {
                if(!$(this).hasClass('selected')) {
                  playList.find('.row > .column').removeClass('selected');
                  $(this).addClass('selected');
                }
                LotteryOpenCode.init(linfo);
                $bData.method = column.shortname; // 用户选中的方法
                $bData.compress = column.compress; // 是否加密传输
                buildPlayHelp(column);
                buildPlayArea(column);
                //console.log(adjustPrize,'buildAdjustPrizebuildAdjustPrize',$('.lottery-betting .lottery-opearation .adjust-prize'));
                //buildAdjustPrize(adjustPrize, column);
                buildAdjustPrize($('.lottery-betting .lottery-opearation .adjust-prize'), column);
                PlayOptions.update();
              });
              thisRow.append(thisColumn);
            }
					});
          if (allsee.length==0) {
            //thisRow.hide();
          }
				});
				playList.append(thisRow);
			});
			playList.find('.row > .column').eq(0).trigger('click');
      //console.log('swmttswmttswmttswmttswmttswmtt',typeof refreshigh);
      if (typeof refreshigh !='undefined') {
        refreshigh();
      }
		}
		// 初始化帮助信息
		var buildPlayHelp = function(column) {
			playHelp.empty();
			//console.log( column.tips)
			playHelp.append('<div class="tips"><em class="icon m_orange">&#xe67f;</em><span class="label">玩法提示：</span>' + column.tips + '</div>');
			playHelp.append('<div class="help-info"><i class="arrow"></i><div class="example">' + column.example + '</div><div class="help">' + column.help + '</div></div>');
			playHelp.append('<div class="prize"><em class="icon m_orange">&#xe689;</em>玩法奖金<span data-field="prize">0.00</span>元</div>');
			var show = function(els, target) {
				var top = $(els).position().top;
				var left = $(els).position().left;
				playHelp.find(target).css({top: top + 32, left: left}).show();
			}
			var hide = function(target) {
				playHelp.find(target).hide();
			}
			playHelp.find('.tips > em').hover(function() {show(this, '.help-info')}, function() {hide('.help-info')});
		}
		// 初始化玩法区域
		var buildPlayArea = function(column) {
			playArea.empty();
			if(column.checkbox) {
        //console.log('checkbox.layout.chkcheckbox.layout.chk');
				buildCheckboxPlace(playArea, column.checkbox);
			}
			if(column.select) {
				buildSelectPlace(playArea, column.select);
			}
			if(column.textarea) {
				buildTextareaPlace(playArea, column.textarea);
			}
		}
		// 初始化选项栏
		buildPlayOptions(playOptions);
		// 加载
		main.append(playGroups);
		main.append(playList);
		main.append(playHelp);
		main.append(playArea);
		//main.append(adjustPrize);
		main.append(playOptions);
		// 调用初始化方法
		initPlayGroups(4);
		// 初始化投注列表
		LotteryRecord.init();
	}

	// 初始化
	var init = function(data) {
		if (data) {
      //console.log(data,'datadatadata');
			$Lottery = data.lottery;
			$DownCode = data.downCode;
			$FenDownCode = data.fenDownCode;
			$LiDownCode = data.liDownCode;
			$Method = data.method;
			$SysCode = data.sysCode;
			$SysUnitMoney = data.sysUnitMoney;
			$UserCode = data.userCode;
			$UserLp = data.userLp;
      $SysBaseCode = data.sysBaseCode;
			// 计算得出
			$UserMaxCode = $UserCode - $DownCode;
      //console.log($SysCode,$UserCode,$UserLp);
			$UserMinCode = $SysCode - $UserLp * 20;
      //console.log($SysCode,$UserLp,$UserMinCode);
		}
		initDocument();
		LotteryRecord.clear();
	}

	var isLoading = false;
	var doSubmit = function(dialog) {
		var thisContent = $('.lottery-record');
		if(!isLoading) {
			if($bList.length == 0) {
				return App.alert('info', '提示消息', '投注列表没有订单！', 3000);
			}
			var list = [];
      //console.log($bList,'$bList$bList$bList');
      //setTimeout(function() {
        //console.log($bList.length,'$bList$bList.len');
      $.each($bList, function(i, v) {
        list.push({
          lottery: v.lottery,
          issue: v.issue,
          method: v.method,
          content: v.content,
          model: v.model,
          multiple: v.multiple,
          code: v.code,
          compress: v.compress
        });
      });

      //},100);
      //_.delay(function(text) {
      //  //console.log(text);
      //}, 1000, 'later');
      //
      var fireOrder = function(list,dialog) {
        var data = { text: $.toJSON(list) };
        GameLotteryCtrl.addOrder({
          data: data,
          beforeSend: function() {
            isLoading = true;
            App.blockUI({
              target: thisContent,
              boxed: true
            });
          },
          success: function(response) {
            if(response.error == 0) {
              isLoading = false;
              App.unblockUI(thisContent);
              LotteryRecord.clear();
              App.alert('success', '提示消息', '您的订单已投注成功！', 3000);
              if ($('.lottery-record .list table tr').size()==0) {
                $('.ks_btn[data-command="quick"]').removeClass('disabled');
              }
              $('[data-field="lotteryBalance"]').html(response.data);
              typeof dialog !='undefined' && dialog.close();
              console.log(typeof RecordList);
              if (typeof RecordList != 'undefined') {
                RecordList.init();
                RecordList.refreshHistory();
              }
            }
            if(response.error == 1) {
              if ('116-05' == response.code) {
                setTimeout(function() {
                  isLoading = false;
                  App.unblockUI(thisContent);
                  App.alert('warning', '提示消息', '投注超时，请检查网路情况后重新重试。');
                }, 10000);
              } else if ('116-06' == response.code) {
                window.location.href = './index.html';
              } else {
                isLoading = false;
                App.unblockUI(thisContent);
                //App.alert('warning', '提示消息', response.message);
                if (response.message!='该用户已被冻结') {
                  App.alert('warning', '提示消息', response.message);
                }else {
                  App.alert('normal', '提示消息', '<div class="cm">正在提交，请稍等</div>',30000,'',function() {},function() {
                    App.alert('warning', '提示消息', '投注失败，请注意核对：网络超时');
                  });
                }
              }
              typeof dialog !='undefined' && dialog.close();
            }
          }
        });
      }
      fireOrder(list,dialog);
      //fireOrder(list,dialog);
		}
	}

	return {
    namespace:'ssc',
		init: init,
		getConfig: function() {
			return {
				lottery: $Lottery,
				downCode: $DownCode,
				fenDownCode: $FenDownCode,
				liDownCode: $LiDownCode,
				method: $Method,
				sysCode: $SysCode,
				sysUnitMoney: $SysUnitMoney,
				userCode: $UserCode,
				userLp: $UserLp,
				userMaxCode: $UserMaxCode,
				userMinCode: $UserMinCode
			}
		},
		bList: function() {
			return $bList;
		},
		clear: function() {
			LotteryRecord.clear();
		},
		addCallback: function(cb) {
			addCallback.push(cb);
		}
	}

}();
