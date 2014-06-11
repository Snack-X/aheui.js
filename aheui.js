var _code;

var _x=0, _y=0, _mx=0, _my=1, _px=0, _py=0;

var _store = {}, _store_now = " ";

var _cho = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ".split("");
var _jung = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ".split("");
var _jong = " ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ".split("");

function han_disassemble(han) {
	var ord = han.charCodeAt(0) - 0xac00;

	if(ord < 0 || ord > 11171) return false;

	var jong = ord % 28;
	ord = (ord - jong) / 28;
	var jung = ord % 21;
	ord = (ord - jung) / 21;
	var cho = ord;

	return {
		"cho": _cho[cho],
		"jung": _jung[jung],
		"jong": _jong[jong]
	};
}

function han_assemble(cho, jung, jong) {
	return String.fromCharCode(0xac00 + (((cho * 21) + jung) * 28) + jong);
}

function init_store() {
	for(var i in _jong) {
		if(_jong[i] == "ㅎ") continue;
		_store[_jong[i]] = [];
	}
}

function code_to_table(code, table) {
	_code = code;
	_code = _code.split("\n");

	for(var y in _code) {
		_code[y] = _code[y].split("");
		var $tr = $("<tr>");
		for(var x in _code[y]) {
			$tr.append($("<td>" + _code[y][x] + "</td>"));
		}
		table.append($tr);
	}
}

function init_aheui() {
	init_store();
	display_current();
}

function display_current() {
	$(".code tr td").removeClass("active");
	$(".code tr:nth-child(" + (_y+1) + ") td:nth-child(" + (_x+1) + ")").addClass("active");
}

function move_cursor() {
	_px = _x;
	_py = _y;
	_x += _mx;
	_y += _my;
}

function step() {
	var ch = _code[_y][_x];
	var syl = han_disassemble(ch);

	if(syl === false) {
		move_cursor();
		display_current();
		return;
	}

	switch(syl.cho) {
		case "ㅇ": break;
	}

	switch(syl.jung) {
		case "ㅏ": _mx =  1; _my =  0; break;
		case "ㅑ": _mx =  2; _my =  0; break;
		case "ㅓ": _mx = -1; _my =  0; break;
		case "ㅕ": _mx = -2; _my =  0; break;
		case "ㅗ": _mx =  0; _my = -1; break;
		case "ㅛ": _mx =  0; _my = -2; break;
		case "ㅜ": _mx =  0; _my =  1; break;
		case "ㅠ": _mx =  0; _my =  2; break;
		case "ㅢ": _mx = _px - _x; _my = _py - _y; break;
		case "ㅡ":
			if(_my === 0) _mx = (_mx > 0) ? 1 : -1;
			else _my = _py - _y;
			break;
		case "ㅣ":
			if(_mx === 0) _my = (_my > 0) ? 1 : -1;
			else _mx = _px - _x;
			break;
	}

	move_cursor();
	display_current();
	return;
}