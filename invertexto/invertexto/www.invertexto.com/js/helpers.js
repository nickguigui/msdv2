function getDocTitle(doc){
    if(!doc) return 'CPF/CNPJ';
    var size = doc.replace(/\D/g, '').length;
    if(size<11) return 'CPF/CNPJ';
    else if(size==11) return 'CPF';
    else return 'CNPJ';
}

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g,'');
    if(cpf == '' || cpf.length != 11) return false;

    // Valida 1º digito
    add = 0;
    for (i=0; i < 9; i ++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
        return false;

    // Valida 2º digito
    add = 0;
    for (i = 0; i < 10; i ++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
        return false;
        
    return true;
}

function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g,'');
    if(cnpj == '') return false;
    if(cnpj.length != 14) return false;

    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0,tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if(resultado != digitos.charAt(0)) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0,tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if(pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if(resultado != digitos.charAt(1)) return false;

    return true;
}

//+ Carlos R. L. Rodrigues
//@ http://jsfromhell.com/string/extenso [rev. #3]
String.prototype.extenso = function(c){
    var ex = [
        ["zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"],
        ["dez", "vinte", "trinta", "quarenta", "cinqüenta", "sessenta", "setenta", "oitenta", "noventa"],
        ["cem", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"],
        ["mil", "milhão", "bilhão", "trilhão", "quadrilhão", "quintilhão", "sextilhão", "setilhão", "octilhão", "nonilhão", "decilhão", "undecilhão", "dodecilhão", "tredecilhão", "quatrodecilhão", "quindecilhão", "sedecilhão", "septendecilhão", "octencilhão", "nonencilhão"]
    ];
    var a, n, v, i, n = this.replace(c ? /[^,\d]/g : /\D/g, "").split(","), e = " e ", $ = "real", d = "centavo", sl;
    for(var f = n.length - 1, l, j = -1, r = [], s = [], t = ""; ++j <= f; s = []){
        j && (n[j] = (("." + n[j]) * 1).toFixed(2).slice(2));
        if(!(a = (v = n[j]).slice((l = v.length) % 3).match(/\d{3}/g), v = l % 3 ? [v.slice(0, l % 3)] : [], v = a ? v.concat(a) : v).length) continue;
        for(a = -1, l = v.length; ++a < l; t = ""){
            if(!(i = v[a] * 1)) continue;
            i % 100 < 20 && (t += ex[0][i % 100]) ||
            i % 100 + 1 && (t += ex[1][(i % 100 / 10 >> 0) - 1] + (i % 10 ? e + ex[0][i % 10] : ""));
            s.push((i < 100 ? t : !(i % 100) ? ex[2][i == 100 ? 0 : i / 100 >> 0] : (ex[2][i / 100 >> 0] + e + t)) +
            ((t = l - a - 2) > -1 ? " " + (i > 1 && t > 0 ? ex[3][t].replace("ão", "ões") : ex[3][t]) : ""));
        }
        a = ((sl = s.length) > 1 ? (a = s.pop(), s.join(" ") + e + a) : s.join("") || ((!j && (n[j + 1] * 1 > 0) || r.length) ? "" : ex[0][0]));
        a && r.push(a + (c ? (" " + (v.join("") * 1 > 1 ? j ? d + "s" : (/0{6,}$/.test(n[0]) ? "de " : "") + $.replace("l", "is") : j ? d : $)) : ""));
    }
    return r.join(e);
}

// Versão otimizada - digita da direita para esquerda (centavos primeiro)
function formatMoney(value) {
    // Remove tudo que não é dígito
    let numbers = value.replace(/\D/g, '');
    
    if (numbers === '' || numbers === '0') {
        return '0,00';
    }
    
    // Limita a 15 dígitos para evitar overflow
    if (numbers.length > 15) {
        numbers = numbers.slice(0, 15);
    }
    
    // Padeia com zeros à esquerda para sempre ter pelo menos 3 dígitos
    numbers = numbers.padStart(3, '0');
    
    // Separa os últimos 2 dígitos como centavos
    const cents = numbers.slice(-2);
    const reais = numbers.slice(0, -2);
    
    // Remove zeros à esquerda da parte inteira (exceto se for zero)
    const reaisClean = reais.replace(/^0+/, '') || '0';
    
    // Formata com separador de milhares
    const reaisFormatted = reaisClean.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    return reaisFormatted + ',' + cents;
}

function formatCPFCNPJ(value) {
    // Remove tudo que não é dígito
    value = value.replace(/\D/g, '');
    
    if (value.length <= 11) {
        // Formata como CPF
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
        // Formata como CNPJ
        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }
    
    return value;
}

// Função para salvar posição do cursor
function saveCursorPosition(element) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        return preCaretRange.toString().length;
    }
    return 0;
}

// Função para restaurar posição do cursor
function restoreCursorPosition(element, position) {
    const selection = window.getSelection();
    const range = document.createRange();

    // Normalizar posição
    if (typeof position !== 'number' || isNaN(position) || position < 0) {
        position = 0;
    }

    // Calcular comprimento total de texto dentro do elemento
    let totalLength = 0;
    let nodeStackForLength = [element];
    let nodeForLength;
    while ((nodeForLength = nodeStackForLength.pop())) {
        if (nodeForLength.nodeType === 3) {
            totalLength += nodeForLength.length;
        } else {
            let i = nodeForLength.childNodes.length;
            while (i--) nodeStackForLength.push(nodeForLength.childNodes[i]);
        }
    }

    // Clamp posição ao comprimento total (coloca no final se exceder)
    if (position > totalLength) position = totalLength;

    // Se não houver texto (totalLength === 0), posiciona caret no começo do elemento de forma segura
    if (totalLength === 0) {
        // Tenta colapsar no início do elemento (offset 0)
        try {
            range.setStart(element, 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        } catch (err) {
            // Fallback: criar nó de texto vazio e posicionar nele
            try {
                const textNode = document.createTextNode('');
                element.appendChild(textNode);
                range.setStart(textNode, 0);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            } catch (err2) {
                // Não é crítico — silenciar erro
            }
        }
        return;
    }

    // Procurar nó de texto correspondente à posição
    let charCount = 0;
    let nodeStack = [element];
    let node, foundStart = false;

    while (!foundStart && (node = nodeStack.pop())) {
        if (node.nodeType === 3) { // Text node
            const nextCharCount = charCount + node.length;
            if (position <= nextCharCount) {
                range.setStart(node, position - charCount);
                range.setEnd(node, position - charCount);
                foundStart = true;
                break;
            }
            charCount = nextCharCount;
        } else {
            let i = node.childNodes.length;
            while (i--) {
                nodeStack.push(node.childNodes[i]);
            }
        }
    }

    // Fallback: se não encontrou (por segurança), colapsa ao final do elemento
    if (!foundStart) {
        try {
            range.selectNodeContents(element);
            range.collapse(false); // no fim
        } catch (err) {
            // último recurso: criar/usar primeiro nó de texto
            try {
                let firstText = null;
                const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
                firstText = walker.nextNode();
                if (!firstText) {
                    firstText = document.createTextNode('');
                    element.appendChild(firstText);
                }
                range.setStart(firstText, firstText.length);
                range.collapse(true);
            } catch (err2) {
                // silencioso
            }
        }
    }

    // Aplicar seleção com try/catch para evitar exceções que quebrem o fluxo
    try {
        selection.removeAllRanges();
        selection.addRange(range);
    } catch (err) {
        // silencioso — evita perda de foco/erros
    }
}

// Debounce para otimizar localStorage
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
