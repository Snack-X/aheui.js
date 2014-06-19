var __temp_code, __run;

var $ = document.querySelector.bind(document);
var $$ = document.createElement.bind(document);

$(".ctrl-init").onclick = function() {
	__temp_code = $(".code textarea").value;

	$(".code textarea").remove();
	$(".code").appendChild($$("table"));

	_init(__temp_code, function(v) {
		$(".output pre").innerHTML += v;
	});

	code_to_table($(".code table"));

	$(".show-before").style.display = "none";
	$(".show-after").style.display = "block";
};

$(".ctrl-run").onclick = function() {
	if(typeof __run == "undefined") {
		__run = setInterval(step, 0);
	}
};

$(".ctrl-stop").onclick = function() {
	if(typeof __run == "number") {
		clearInterval(__run);
		__run = undefined;
	}
};

$(".ctrl-step").onclick = function() {
	if(typeof __run == "number") {
		clearInterval(__run);
		__run = undefined;
	}
	step();
};

$(".ctrl-reset").onclick = function() {
	if(typeof __run == "number") {
		clearInterval(__run);
		__run = undefined;
	}

	$(".code table").remove();
	var ta = $$("textarea");
	ta.value = __temp_code;
	$(".code").appendChild(ta);
	$(".output pre").innerHTML = "";
	$(".store table").innerHTML = "";

	$(".show-after").style.display = "none";
	$(".show-before").style.display = "block";
};

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
	table.innerHTML = "";

	for(var y in _code) {
		var tr = $$("tr");
		for(var x in _code[y]) {
			var td = $$("td");
			td.innerHTML = _code[y][x];
			tr.appendChild(td);
		}
		table.appendChild(tr);
		table.style.width = (20 * _code[0].length) + "px";
	}
}

function display_current() {
	var active = $(".code table tr td.active");
	if(active !== null) active.classList.remove("active");
	$(".code table tr:nth-child(" + (_y+1) + ") td:nth-child(" + (_x+1) + ")").classList.add("active");
}

function display_store() {
	$(".store table").innerHTML = "";

	for(var n in _store) {
		var s = _store[n];
		var tr = $$("tr");

		var td = $$("td");
		td.classList.add("storename");
		td.innerHTML = n;
		tr.appendChild(td);
		if(_store_now == n) tr.querySelector(".storename").classList.add("active");

		if(s.length !== 0) {
			for(var i=0 ; i < s.length ; i++) {
				var std = $$("td");
				std.innerHTML = s[i];
				tr.appendChild(std);
			}
		}

		$(".store table").appendChild(tr);
	}
}