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
	_status = false;
	_x = _y = _mx = _px = _py = 0;
	_my = 1;
	_store = {};
	_store_now = " ";
	_input_buffer = "";

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
	if(_input_buffer === "") {
		_input_buffer = prompt("입력하세요 (종료하려면 취소를 누르세요.)");

		if(_input_buffer === null) {
			_status = false;
			return;
		}

		_input_buffer += "\n";
	}

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
		return _store[_store_now].shift();
	}
	else {
		return _store[_store_now].pop();
	}
}

function _step(before_step, after_step) {
	if(_status === false) return;

	if(typeof before_step == "function") before_step();

	var ch = _code[_y][_x];
	var syl = _han_disassemble(ch);
	var force_return = false;
	var force_reverse = false;

	// 올바른 글자가 아닐 경우
	if(syl === false) {
		_move_cursor();
		if(typeof after_step == "function") after_step();
		return;
	}

	// ㅎ = 끝냄
	if(syl.cho == "ㅎ") {
		_status = false;
	}

	// 뽑아내는 명령일 때 저장 공간에 값이 모자라는지 체크 후 모자라면 반대 방향으로
	if("ㄷㄸㅌㄴㄹㅈ".indexOf(syl.cho) >= 0) {
		// 저장 공간에 값이 두 개 필요함
		if(_store[_store_now].length < 2) force_return = true;
	}
	else if("ㅁㅊ".indexOf(syl.cho) >= 0) {
		// 저장 공간에 값이 한 개 필요함
		if(_store[_store_now].length < 1) force_return = true;
	}

	// ㅁ = 뽑기
	if(syl.cho == "ㅁ") {
		var ext_v = _get_from_store();

		if(syl.jong == "ㅇ") {
			_write(ext_v);
		}
		else if(syl.jong == "ㅎ") {
			_write(String.fromCharCode(ext_v));
		}
	}
	// ㅂ = 집어넣기
	else if(syl.cho == "ㅂ") {
		var jong_v = _jong.indexOf(syl.jong);
		var ins_v = _jongval[jong_v];

		if(syl.jong == "ㅇ") {
			ins_v = parseInt(_read(), 10);
		}
		else if(syl.jong == "ㅎ") {
			ins_v = _read().charCodeAt(0);
		}

		_insert_to_store(ins_v);
	}
	// ㅃ = 중복
	else if(syl.cho == "ㅃ") {
		var tmp_s = _store[_store_now];

		if(_store_now == "ㅇ") {
			_store[_store_now].unshift(tmp_s[0]);
		}
		else {
			_store[_store_now].push(tmp_s[tmp_s.length - 1]);
		}
	}
	// ㅍ = 바꿔치기
	else if(syl.cho == "ㅍ") {
		var swap_v1 = _store[_store_now].pop();
		var swap_v2 = _store[_store_now].pop();
		if(_store_now == "ㅇ") {
			_store[_store_now].unshift(swap_v2);
			_store[_store_now].unshift(swap_v1);
		}
		else {
			_store[_store_now].push(swap_v2);
			_store[_store_now].push(swap_v1);
		}
	}
	// ㄷ = 덧셈
	// ㄸ = 곱셈
	// ㅌ = 뺄셈
	// ㄴ = 나눗셈
	// ㄹ = 나머지
	else if("ㄷㄸㅌㄴㄹ".indexOf(syl.cho) >= 0) {
		var v1 = _get_from_store(), v2 = _get_from_store();
		switch(syl.cho) {
			case "ㄷ": _insert_to_store(v1 + v2); break;
			case "ㄸ": _insert_to_store(v1 * v2); break;
			case "ㅌ": _insert_to_store(v2 - v1); break;
			case "ㄴ": _insert_to_store(Math.floor(v2 / v1)); break;
			case "ㄹ": _insert_to_store(v2 % v1); break;
		}
	}
	// ㅅ = 선택
	else if(syl.cho == "ㅅ") {
		_store_now = syl.jong;
	}
	// ㅆ = 이동
	else if(syl.cho == "ㅆ") {
		var move_v = _get_from_store();
		var orig_s = _store_now;
		_store_now = syl.jong;
		_insert_to_store(move_v);
		_store_now = orig_s;
	}
	// ㅈ = 비교
	else if(syl.cho == "ㅈ") {
		var comp_v1 = _get_from_store();
		var comp_v2 = _get_from_store();

		if(comp_v2 >= comp_v1) _insert_to_store(1);
		else _insert_to_store(0);
	}
	// ㅊ = 조건
	else if(syl.cho == "ㅊ") {
		var cond_v = _get_from_store();

		if(cond_v === 0) force_reverse = true;
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

	if(force_return) {
		_mx = _px - _x;
		_my = _py - _y;
	}
	else if(force_reverse) {
		_mx = -_mx;
		_my = -_my;
	}

	_move_cursor();

	if(typeof after_step == "function") after_step();

	return;
}