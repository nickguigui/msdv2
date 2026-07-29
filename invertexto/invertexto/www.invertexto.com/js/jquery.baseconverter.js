function limpaCampos(){
	$('#deci').val('');
	$('#bin').val('');
	$('#oct').val('');
	$('#hdeci').val('');	
}

// Conversoes
$('#deci').keyup(function(){
	var value = $(this).val();
	if(value==''){
		limpaCampos();
		return;
	}
	var num = new Number(value);
	$('#bin').val(num.toString(2));
	$('#oct').val(num.toString(8));
	$('#hdeci').val(num.toString(16));
});

$('#bin').keyup(function(){
	var value = $(this).val();
	if(value==''){
		limpaCampos();
		return;
	}
	var dec = parseInt(value, 2);
	var num = new Number(dec);
	$('#deci').val(num);
	$('#oct').val(num.toString(8));
	$('#hdeci').val(num.toString(16));
});

$('#oct').keyup(function(){
	var value = $(this).val();
	if(value==''){
		limpaCampos();
		return;
	}
	var dec = parseInt(value, 8);
	var num = new Number(dec);
	$('#deci').val(num);
	$('#bin').val(num.toString(2));
	$('#hdeci').val(num.toString(16));
});

$('#hdeci').keyup(function(){
	var value = $(this).val();
	if(value==''){
		limpaCampos();
		return;
	}
	var dec = parseInt(value, 16);
	var num = new Number(dec);
	$('#deci').val(num);
	$('#bin').val(num.toString(2));
	$('#oct').val(num.toString(8));
});

// Validacoes
$('#deci').keypress(function(event){
	var kc;
	if(window.event){
		kc=event.keyCode;
	}else{
		kc=event.which;
	}
	var num=$(this).val();
	if (kc!=8 && kc!=0){
		if (kc<48||kc>57){
			return false;
		}
	} 
});

$('#bin').keypress(function(event){
	var kc;
	if(window.event){
		kc=event.keyCode;
	}else{
		kc=event.which;
	}
	var num=$(this).val();
	if (kc!=8 && kc!=0){
		if (kc!=48 && kc!=49){
			return false;
		}
	} 
});

$('#oct').keypress(function(event){
	var kc;
	if(window.event){
		kc=event.keyCode;
	}else{
		kc=event.which;
	}
	var num=$(this).val();
	if (kc!=8 && kc!=0){
		if (kc<48 || kc>55){
			return false;
		}
	}
});

$('#hdeci').keypress(function(event){
	var kc;
	if(window.event){
		kc=event.keyCode;
	}else{
		kc=event.which;
	}

	if (kc>=65 && kc<=70){
		return true;
	}else if (kc>=97 && kc<=102){
		return true;
	}else if (kc>=48 && kc<=57){	
		return true;
	}else if (kc==8){	
		return true;
	}else if (kc==0){	
		return true;
	}else{
 		return false;
	}
});