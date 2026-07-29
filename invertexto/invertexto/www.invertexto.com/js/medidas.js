$(function(){
	
	//Clear all inputs
	$('input').val('');

	//Bind inputs
	$('.temperature').bind('change paste keyup', temperature);
	$('.length').bind('change paste keyup', length);
	$('.mass').bind('change paste keyup', mass);
	$('.speed').bind('change paste keyup', speed);
	$('.timec').bind('change paste keyup', timec);
});

var configurableRoundingFormatter = function(maxDecimals) {
	return function(scalar, units) {
		var pow = Math.pow(10, maxDecimals);
		var rounded = Math.round(scalar * pow) / pow;

		return rounded;
	};
};

function temperature(){

	var F,C,K;
	var Value;
	Qty.formatter = configurableRoundingFormatter(4);

	Value = parseFloat($(this).val());

	if(isNaN(Value)){
		$('.temperature').not($(this)).val('');
		return;
	}

	var id = $(this).attr('id');
	C = Qty(Value, id).to('tempC');
	F = Qty(Value, id).to('tempF');
	K = Qty(Value, id).to('tempK');

	$('#tempF').not($(this)).val(F.format());
	$('#tempC').not($(this)).val(C.format());
	$('#tempK').not($(this)).val(K.format());
}

function length(){

	var Mi,Ft,In,Km,M,Cm;
	var Value;
	Qty.formatter = configurableRoundingFormatter(4);

	Value = parseFloat($(this).val());

	if(isNaN(Value))
	{
		$('.length').not($(this)).val('');
		return;
	}

	var id = $(this).attr('id');
	 M = Qty(Value, id).to('m');
	Km = Qty(Value, id).to('km');
	Cm = Qty(Value, id).to('cm');
	In = Qty(Value, id).to('in');
	Ft = Qty(Value, id).to('ft');
	Mi = Qty(Value, id).to('mi');

	$('#mi').not($(this)).val(Mi.format());
	$('#ft').not($(this)).val(Ft.format());
	$('#in').not($(this)).val(In.format());
	$('#km').not($(this)).val(Km.format());
	$('#m' ).not($(this)).val(M.format());
	$('#cm').not($(this)).val(Cm.format());
}

function mass(){

	var tonne,kg,g,mg,lbs,oz;
	var Value;
	Qty.formatter = configurableRoundingFormatter(4);

	Value = parseFloat($(this).val());

	if(isNaN(Value)){
		$('.mass').not($(this)).val('');
		return;
	}

	var id = $(this).attr('id');
	tonne = Qty(Value, id).to('tonne');
	kg = Qty(Value, id).to('kg');
	g = Qty(Value, id).to('g');
	mg = Qty(Value, id).to('mg');
	lbs = Qty(Value, id).to('lbs');
	oz = Qty(Value, id).to('oz');

	$('#tonne').not($(this)).val(tonne.format());
	$('#kg').not($(this)).val(kg.format());
	$('#g').not($(this)).val(g.format());
	$('#mg').not($(this)).val(mg.format());
	$('#lbs').not($(this)).val(lbs.format());
	$('#oz').not($(this)).val(oz.format());
}

function speed(){

	var kph,mph,fps,knot;
	var Value;
	Qty.formatter = configurableRoundingFormatter(4);

	Value = parseFloat($(this).val());

	if(isNaN(Value)){
		$('.speed').not($(this)).val('');
		return;
	}

	var id = $(this).attr('id');
	kph = Qty(Value, id).to('kph');
	mph = Qty(Value, id).to('mph');
	fps = Qty(Value, id).to('fps');
	knot = Qty(Value, id).to('knot');

	$('#kph').not($(this)).val(kph.format());
	$('#mph').not($(this)).val(mph.format());
	$('#fps').not($(this)).val(fps.format());
	$('#knot').not($(this)).val(knot.format());
}

function timec(){

	var sec,min,hr,day,week,year;
	var Value;
	Qty.formatter = configurableRoundingFormatter(4);

	Value = parseFloat($(this).val());

	if(isNaN(Value)){
		$('.timec').not($(this)).val('');
		return;
	}

	var id = $(this).attr('id');
	sec = Qty(Value, id).to('sec');
	min = Qty(Value, id).to('min');
	hr = Qty(Value, id).to('hr');
	day = Qty(Value, id).to('day');
	week = Qty(Value, id).to('week');
	year = Qty(Value, id).to('year');

	$('#sec').not($(this)).val(sec.format());
	$('#min').not($(this)).val(min.format());
	$('#hr').not($(this)).val(hr.format());
	$('#day').not($(this)).val(day.format());
	$('#week').not($(this)).val(week.format());
	$('#year').not($(this)).val(year.format());
}
