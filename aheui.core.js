var _code;
var _status = false, _x=0, _y=0, _mx=0, _my=1, _px=0, _py=0;
var _store = {}, _store_now = " ";
var _input_buffer = "";

function _init_store() {
	for(var i in _jong) {
		if(_jong[i] == "ㅎ") continue;
		_store[_jong[i]] = [];
	}
}

function _init(code) {
	_code = code.split("\n");
	for(var y in _code) _code[y] = _code[y].split("");

	_init_store();

	_status = true;
}

function _move_cursor() {
	_px = _x;
	_py = _y;
	_x += _mx;
	_y += _my;
}

function _read() {
	if(_input_buffer === "") _input_buffer = prompt("입력하세요");
	_input_buffer += "\n";

	var ch = _input_buffer[0];
	_input_buffer = _input_buffer.substr(1);

	return ch;
}

function _write(value) {
	console.log(value);
}

function _insert_to_store(value) {
	_store[_store_now].push(value);
}

function _get_from_store() {
	if(_store_now == "ㅇ") {
		return _store[_store_now][0].shift();
	}
	else {
		var tmp_s = _store[_store_now];
		return tmp_s[tmp_s.length - 1].pop();
	}
}

function _step(before_step, after_step) {
	if(_status === false) return;

	if(typeof before_step == "function") before_step();

	var ch = _code[_y][_x];
	var syl = _han_disassemble(ch);

	if(syl === false) {
		_move_cursor();

		if(typeof after_step == "function") after_step();

		return;
	}

	switch(syl.cho) {
		case "ㅇ": break;
		case "ㅎ": _status = false; break;
		case "ㅁ":
			var v = _select_from_store();

			if(syl.jong == "ㅇ") {
				_write(v);
			}
			else if(syl.jong == "ㅎ") {
				_write("".fromCharCode(v));
			}

			break;
		case "ㅂ":
			var jong_v = _jong.indexOf(syl.jong);
			var ins_v = _jongval[jong_v];

			if(syl.jong == "ㅇ") {
				ins_v = parseInt(_read(), 10);
			}
			else if(syl.jong == "ㅎ") {
				ins_v = _read().charCodeAt(0);
			}

			_insert_to_store(ins_v);

			break;
		case "ㅃ":
			var tmp_s = _store[_store_now];

			if(_store_now == "ㅇ") {
				_store[_store_now].unshift(tmp_s[0]);
			}
			else {
				_store[_store_now].push(tmp_s[tmp_s.length - 1]);
			}

			break;
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

	_move_cursor();

	if(typeof after_step == "function") after_step();

	return;
}