function init(code) {
	code_to_table(code, $(".code"));
	_init(code);
}

function step() {
	var before = function() {
	};

	var after = function() {
		display_current();
		display_store();
	};

	_step(before, after);
}

function code_to_table(code, table) {
	code = code.split("\n");

	for(var y in code) {
		code[y] = code[y].split("");
		var $tr = $("<tr>");
		for(var x in code[y]) {
			$tr.append($("<td>" + code[y][x] + "</td>"));
		}
		table.append($tr);
	}
}

function display_current() {
	$(".code tr td").removeClass("active");
	$(".code tr:nth-child(" + (_y+1) + ") td:nth-child(" + (_x+1) + ")").addClass("active");
}

function display_store() {
	$(".store").html("");

	for(var n in _store) {
		var s = _store[n];
		var $tr = $("<tr>");

		$tr.append("<td class='storename'>" + n + "</td>");
		if(_store_now == n) $tr.find(".storename").addClass("active");

		if(s.length !== 0) {
			for(var i=0 ; i < s.length ; i++) {
				$tr.append("<td>" + s[i] + "</td>");
			}
		}

		$(".store").append($tr);
	}
}

