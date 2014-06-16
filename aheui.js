var __temp_code, __run;

$(function() {
	$(".ctrl-init").click(function() {
		__temp_code = $(".code textarea").val();

		$(".code textarea").remove();
		$(".code").append($("<table>"));

		_init(__temp_code, function(v) {
			$(".output pre").append(v);
		});

		code_to_table($(".code table"));

		$(".show-before").hide();
		$(".show-after").show();
	});

	$(".ctrl-run").click(function() {
		if(typeof __run == "undefined") {
			__run = setInterval(step, 0);
		}
	});

	$(".ctrl-stop").click(function() {
		if(typeof __run == "number") {
			clearInterval(__run);
			__run = undefined;
		}
	});

	$(".ctrl-step").click(function() {
		if(typeof __run == "number") {
			clearInterval(__run);
			__run = undefined;
		}
		step();
	});

	$(".ctrl-reset").click(function() {
		if(typeof __run == "number") {
			clearInterval(__run);
			__run = undefined;
		}

		$(".code table").remove();
		$(".code").append($("<textarea>").val(__temp_code));
		$(".output pre").html("");
		$(".store table").html("");

		$(".show-after").hide();
		$(".show-before").show();
	});
});

function step() {
	var before = function() {
	};

	var after = function() {
		display_current();
		display_store();
	};

	_step(before, after);
}

function code_to_table(table) {
	table.html("");

	for(var y in _code) {
		var $tr = $("<tr>");
		for(var x in _code[y]) {
			$tr.append($("<td>" + _code[y][x] + "</td>"));
		}
		table.append($tr);
		table.css("width", 20 * _code[0].length);
	}
}

function display_current() {
	$(".code table tr td").removeClass("active");
	$(".code table tr:nth-child(" + (_y+1) + ") td:nth-child(" + (_x+1) + ")").addClass("active");
}

function display_store() {
	$(".store table").html("");

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

		$(".store table").append($tr);
	}
}