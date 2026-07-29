//==========Language==========//

var lang = {
    weekDays: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
    daysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    daysMin: ["Do", "Se", "Te", "Qu", "Qu", "Se", "Sa", "Do"],
    monthsShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    months: ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"],
    mCalendar: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
};

//===========Clocks===========//

var firstRun=true;

function intToStrTwo(number) {
	return (number < 10 ? "0" + number : number)
}

function getDateText(day, date, month, year){
	return lang.weekDays[day]+', '+date+' de '+lang.months[month]+' de '+year;
}

function getOffsetString(current, compare){
	var difference = compare.utcOffset() - current.utcOffset();
	var sinal = (difference >= 0 ? "+" : "-");
	difference = Math.abs(difference);

	var day = current.dayOfYear() == compare.dayOfYear() ? 'Hoje' : (compare.year() < current.year() || compare.dayOfYear() < current.dayOfYear() ? 'Ontem' : 'Amanhã');
	return day + ', ' + sinal + Math.floor(difference / 60) + ' H';
}

function updateLabels(){

	// Update main clock
	var m = moment();
	$main = $('.clock-main');
	var timezone = $main.data('tz')
	if($main.data('tz')) m.tz(timezone);

	$main.find('.lbl-time').text(intToStrTwo(m.hours())+':'+intToStrTwo(m.minutes())+':'+intToStrTwo(m.seconds()));
	$main.find('.lbl-date').text(getDateText(m.day(),m.date(),m.month(),m.year()));

	// Update info at clock page
	if(firstRun && $('.tz-info')[0]){
		$('.tz-info').find('.lbl-offset').text(getOffsetString(moment(), m));

		var offset = moment.tz.zone(timezone).parse(moment().clone().tz('UTC'));
		var sinal = offset <= 0 ? '+' : '-';
		offset = Math.abs(offset);
		var string = '(UTC ' + sinal + intToStrTwo(Math.floor(offset / 60)) + ':' + intToStrTwo(offset % 60) + ') ' + timezone;
		$('.tz-info').find('.lbl-tz-name').text(string);
	}

	// Update mini clocks
	$('.clock-body').each(function(){
		m.tz($(this).data('tz'));
		var time = intToStrTwo(m.hours())+':'+intToStrTwo(m.minutes())+':'+intToStrTwo(m.seconds());
		$(this).find('.lbl-time').text(time);
	
		if(firstRun) $(this).find('.lbl-offset').text(getOffsetString(moment(), m));
	});

	firstRun=false;
}

updateLabels();
setInterval(updateLabels, 1000);

$('.clocks').on('click', '.close-clock', function(){
	var $panel = $(this).parent().parent().parent();
	removeClockPanel($panel.index());
	$panel.remove();
});

//========LocalStorage========//

var clockPanels=[];
var defaultPanels = [
	{city:'Manaus',country:'Brasil',slug:'manaus',timezone:'America/Manaus'},
	{city:'Sydney',country:'Austrália',slug:'sydney-australia',timezone:'Australia/Sydney'},
	{city:'Londres',country:'Reino Unido',slug:'londres-reino-unido',timezone:'Europe/London'},
];

function getHTMLPanel(obj){
	var title = obj.country!='Brasil' ? obj.city+', '+obj.country : obj.city;
	return '<div class="col-md-6"><div class="panel panel-default mini-clock">'+
	'<div class="panel-heading"><a href="/hora-certa/'+obj.slug+'">'+title+'</a><div class="close close-clock">&times;</div></div>'+
	'<div class="panel-body clock-body" data-tz="'+obj.timezone+'"><div class="lbl-time font-digit"></div><div class="lbl-offset"></div></div></div></div>'
}

function addClockPanel(obj){
	$('.clocks .col-md-6:last').before(getHTMLPanel(obj));
	clockPanels.push(obj);
	localStorage.setItem('clockPanels', JSON.stringify(clockPanels));
	firstRun=true;
	updateLabels();
}

function removeClockPanel(index){
	clockPanels.splice(index, 1);
	localStorage.setItem('clockPanels', JSON.stringify(clockPanels));
}

function loadClockPanels(){
	clockPanels = JSON.parse(localStorage.getItem('clockPanels'));
	if(!clockPanels) clockPanels = defaultPanels;

	var htmlPanels='';
	clockPanels.forEach(function(value, index){
		htmlPanels += getHTMLPanel(value);
	});

	$('.clocks .col-md-6:last').before(htmlPanels);
	firstRun=true;
	updateLabels();
}

loadClockPanels();

//===========Cities===========//
var obj;
var autocomplete;

function initAutocomplete() {
	var input = document.getElementById('autocomplete');
	var options = {
		types: ['geocode']
	};

	autocomplete = new google.maps.places.Autocomplete(input, options);
	autocomplete.addListener('place_changed', onPlaceChanged);
}

function onPlaceChanged() {
	obj = {
		place_id:null,
		city:null,
		country:null,
		lat:null,
		lng:null
	};

	var place = autocomplete.getPlace();
	console.log(place);

	if (place.geometry && place.address_components) {

		obj.place_id = place.place_id;
		obj.lat = place.geometry.location.lat();
		obj.lng = place.geometry.location.lng();

		for (var i = 0; i < place.address_components.length; i++) {
			place.address_components[i].types.forEach(function(value, index){
				if(value=='country'){
					obj.country = place.address_components[i]['long_name'];
				}
				if(value=='locality' || value=='administrative_area_level_1'){
					obj.city = place.address_components[i]['long_name'];
				}
			});
		}
		$('#add').prop('disabled', false);
	}	
}

$('#add').click(function(){
	$('#add').prop('disabled', true);
	$.ajax({type:'post', data:{json:JSON.stringify(obj)}, url:'/ajax/hora-certa.php', dataType:'json',
		success: function(j){
			if(j.error){
				$('#modal-error').text(j.error).show();
				$('#add').prop('disabled', false);
				return;
			}
			
			addClockPanel(j);
			$('#addModal').modal('hide');
		},
		error: function(j){
			console.log(j);
			$('#add').prop('disabled', false);
			$('#modal-error').text('Erro inesperado.').show();
		}
	});
});

$('#addModal').on('shown.bs.modal', function () {
	$('#autocomplete').focus();
})

$('#addModal').on('hidden.bs.modal', function (e) {
	$('#autocomplete').val('');
	$('#modal-error').text('').hide();
});
