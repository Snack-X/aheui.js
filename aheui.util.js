var _cho = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ".split("");
var _jung = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ".split("");
var _jong = " ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ".split("");
var _jongval = [0,2,4,4,2,5,5,3,5,7,9,9,7,9,9,8,4,4,6,2,4,0,3,4,3,4,4,0];

function _han_disassemble(han) {
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

function _han_assemble(cho, jung, jong) {
	return String.fromCharCode(0xac00 + (((cho * 21) + jung) * 28) + jong);
}