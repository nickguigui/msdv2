var invertedDict = {a:"ɐ",b:"q",c:"\u0254",d:"p",e:"\u01DD",f:"\u025F",g:"\u0183",h:"\u0265",i:"\u0131",j:"\u027E",k:"\u029E",l:"ן",m:"\u026F",n:"u",o:"o",p:"d",q:"b",r:"\u0279",s:"s",t:"\u0287",u:"n",v:"\u028C",w:"\u028D",x:"x",y:"\u028E",z:"z",A:"∀",B:"ᙠ",C:"Ɔ",D:"ᗡ",E:"Ǝ",F:"Ⅎ",G:"⅁",H:"H",I:"I",J:"ſ",L:"˥",M:"W",N:"N",O:"O",P:"Ԁ",R:"ᴚ",S:"S",T:"⊥",U:"∩",V:"Λ",W:"M",X:"X",Y:"⅄",Z:"Z","[":"]","]":"[","(":")",")":"(","{":"}","}":"{","?":"\u00BF","\u00BF":"?","!":"\u00A1","\'":",",",":"\'",".":"\u02D9","_":"\u203E",";":"\u061B",9:"6",6:"9"};

function removeAcento(strToReplace) {
	str_acento= 'áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ';
	str_sem_acento = 'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC';
	var nova='';
	for (var i = 0; i < strToReplace.length; i++) {
		if (str_acento.indexOf(strToReplace.charAt(i)) != -1) {
			nova+=str_sem_acento.substr(str_acento.search(strToReplace.substr(i,1)),1);
		} else {
			nova+=strToReplace.substr(i,1);
		}
	}
	return nova;
}

function flip() {
	var result = flipString(document.o.original.value);
	document.f.flipped.value = result;
}

function flipString(str) {
	var inverted = str.split('').map(function(s) {
		var add = null;
		if(String.prototype.normalize){
			var normalized = s.normalize('NFD');
			if(normalized.match(/[\u0301]/)) add = '\u0317';
			else if(normalized.match(/[\u0302]/)) add = '\u032e';
			else if(normalized.match(/[\u0303]/)) add = '\u0330';
		}
	
		s = removeAcento(s);
		if(add) return add + invertedDict[s] || s;
		return invertedDict[s] || s;
	}).join('');

	return inverted.split('').reverse().join('');
}