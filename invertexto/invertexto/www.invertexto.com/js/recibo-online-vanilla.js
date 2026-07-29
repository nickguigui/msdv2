// Estado da aplicação
const state = {
    copies: 1,
    receipt: {
        image: null,
        user: null,
        user_doc: null,
        client: null,
        client_doc: null,
        service: null,
        city: null,
        day: null,
        month: null,
        year: null,
        value: '0,00',
        title: 'RECIBO Nº 1'
    }
};

// Cache de elementos DOM
const domCache = {
    printButton: null,
    clearButton: null,
    viasSelect: null,
    tooltip: null
};

function initDOMCache() {
    domCache.printButton = document.getElementById('print');
    domCache.clearButton = document.getElementById('clear');
    domCache.viasSelect = document.getElementById('vias');
    domCache.tooltip = domCache.printButton ? domCache.printButton.parentElement : null;
}

// Versão otimizada do saveToLocalStorage com debounce
const saveToLocalStorage = debounce(function() {
    try {
        localStorage.setItem('receipt', JSON.stringify(state.receipt));
    } catch(e) {
        console.error('Erro ao salvar no localStorage:', e);
    }
}, 500);

// Adicionar flush ao debounce
saveToLocalStorage.flush = function() {
    try {
        localStorage.setItem('receipt', JSON.stringify(state.receipt));
    } catch(e) {
        console.error('Erro ao salvar no localStorage:', e);
    }
};

// Funções de renderização e atualização
function updateUserDocTitle() {
    const title = getDocTitle(state.receipt.user_doc);
    const element = document.querySelector('.signature .doc-title');
    if (element && element.textContent !== title) {
        requestAnimationFrame(() => {
            element.textContent = title;
        });
    }
}

function updateClientDocTitle() {
    const title = getDocTitle(state.receipt.client_doc);
    const element = document.querySelector('.body .doc-title');
    if (element && element.textContent !== title) {
        requestAnimationFrame(() => {
            element.textContent = title;
        });
    }
}

function updateFullNumber() {
    const fullNumber = state.receipt.value !== '0,00' ? state.receipt.value.extenso(true) : 'zero reais';
    const element = document.querySelector('.full-number');
    if (element && element.textContent !== fullNumber) {
        requestAnimationFrame(() => {
            element.textContent = fullNumber;
        });
    }
}

function updateImage() {
    const container = document.querySelector('.logomarca');
    if (state.receipt.image) {
        container.classList.remove('empty');
        container.innerHTML = `<img src="${state.receipt.image}" alt="Receipt Image">
            <input type="file" id="getFile" accept="image/*" style="display:none">`;
    } else {
        container.classList.add('empty');
        container.innerHTML = `<div class="text-muted">
            <i class="glyphicon glyphicon-picture"></i> <span>Logomarca</span>
        </div>
        <input type="file" id="getFile" accept="image/*" style="display:none">`;
    }
    attachImageHandler();
}

// Otimizar checkButtonDisabled com cache
let lastButtonState = null;
function checkButtonDisabled() {
    let isDisabled = false;
    for (let prop in state.receipt) {
        if (prop !== 'image' && !state.receipt[prop]) {
            isDisabled = true;
            break;
        }
    }
    
    // Só atualiza o DOM se o estado mudou
    if (lastButtonState !== isDisabled && domCache.printButton) {
        lastButtonState = isDisabled;
        requestAnimationFrame(() => {
            domCache.printButton.disabled = isDisabled;
            if (domCache.tooltip) {
                if (isDisabled) {
                    domCache.tooltip.setAttribute('data-original-title', 'Preencha todos os campos');
                } else {
                    domCache.tooltip.setAttribute('data-original-title', '');
                }
            }
        });
    }
}

// Event handlers
function attachImageHandler() {
    const fileInput = document.getElementById('getFile');
    
    // Não precisa de onclick no label - ele já funciona automaticamente
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (file.size > 1000000) {
            alert('Tamanho limitado a 1 MB.');
            // Limpar input para permitir selecionar de novo
            this.value = '';
            return;
        }
        
        const fr = new FileReader();
        fr.onload = function(theFile) {
            const image = new Image();
            image.src = theFile.target.result;
            
            image.onload = function() {
                state.receipt.image = theFile.target.result;
                updateImage();
                saveToLocalStorage.flush();
                checkButtonDisabled();
            };
        };
        
        fr.readAsDataURL(file);
    };
}

function attachEditableHandlers() {
    // Configurar todos os campos editáveis
    document.querySelectorAll('[contenteditable="true"]').forEach(field => {
        const fieldName = field.getAttribute('data-field');
        
        // Evitar re-anexar handlers se já existirem
        if (field.dataset.hasHandlers === 'true') return;
        field.dataset.hasHandlers = 'true';
        
        // Atualizar conteúdo inicial
        if (state.receipt[fieldName] !== null && state.receipt[fieldName] !== '') {
            field.textContent = state.receipt[fieldName];
            
            // Aplicar classes iniciais
            if (fieldName === 'value' && state.receipt[fieldName] === '0,00') {
                field.classList.add('zero');
            }
            if ((fieldName === 'user_doc' || fieldName === 'client_doc') && state.receipt[fieldName]) {
                const value = state.receipt[fieldName];
                if (!validarCPF(value) && !validarCNPJ(value)) {
                    field.classList.add('invalid');
                }
            }
        }
        
        // Prevenir quebra de linha
        field.addEventListener('keydown', function(e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                return false;
            }
        });
        
        // Prevenir paste com quebras de linha
        field.addEventListener('paste', function(e) {
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData('text');
            const cleanText = text.replace(/\r?\n|\r/g, ' ');
            document.execCommand('insertText', false, cleanText);
        });
        
        // Selecionar tudo ao clicar
        field.addEventListener('click', function() {
            const range = document.createRange();
            range.selectNodeContents(this);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        });
        
        // Input event com máscaras
        field.addEventListener('input', function(e) {
            let value = this.textContent;
            
            // Aplicar máscaras específicas
            if (fieldName === 'value') {
                value = formatMoney(value);
                
                // Atualizar sem preservar cursor (digitação da direita para esquerda)
                this.textContent = value;
                
                // Colocar cursor no final
                const range = document.createRange();
                const sel = window.getSelection();
                if (this.childNodes.length > 0) {
                    range.setStart(this.childNodes[0], value.length);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
                
                if (value === '0,00') {
                    this.classList.add('zero');
                } else {
                    this.classList.remove('zero');
                }
                
                state.receipt[fieldName] = value;
                updateFullNumber();
                
            } else if (fieldName === 'user_doc' || fieldName === 'client_doc') {
                const cursorPos = saveCursorPosition(this);
                const oldLength = value.length;
                value = formatCPFCNPJ(value);
                const newLength = value.length;
                const diff = newLength - oldLength;
                
                this.textContent = value;
                restoreCursorPosition(this, cursorPos + diff);
                
                // Validação
                this.classList.remove('invalid');
                const cleanValue = value.replace(/\D/g, '');
                if (cleanValue.length >= 11) {
                    if (!validarCPF(value) && !validarCNPJ(value)) {
                        this.classList.add('invalid');
                    }
                }
                
                state.receipt[fieldName] = value;
                
                // Atualizar título do documento
                if (fieldName === 'user_doc') {
                    updateUserDocTitle();
                } else {
                    updateClientDocTitle();
                }
            } else {
                state.receipt[fieldName] = value;
            }
            
            saveToLocalStorage();
            checkButtonDisabled();
        });
        
        // Blur event
        field.addEventListener('blur', function() {
            const value = this.textContent;
            state.receipt[fieldName] = value;
            saveToLocalStorage.flush();
        });
    });
}

function attachButtonHandlers() {
    // Botão limpar
    domCache.clearButton.addEventListener('click', function() {
        localStorage.removeItem('receipt');
        location.reload();
    });
    
    // Botão imprimir
    domCache.printButton.addEventListener('click', function() {
        document.querySelectorAll('.segunda-via').forEach(el => el.remove());
        
        if (state.copies == 2) {
            const recibo = document.querySelector('.recibo');
            const clone = recibo.cloneNode(true);
            clone.classList.add('segunda-via');
            document.querySelector('.document').appendChild(clone);
        }
        
        window.print();
    });
    
    // Select de vias
    domCache.viasSelect.addEventListener('change', function() {
        state.copies = this.value;
    });
}

// Inicialização
function init() {
    // Inicializar cache DOM
    initDOMCache();
    
    // Carregar do localStorage
    if (localStorage.getItem('receipt')) {
        try {
            const saved = JSON.parse(localStorage.getItem('receipt'));
            // Merge com valores padrão para não quebrar se faltar algum campo
            state.receipt = Object.assign({}, state.receipt, saved);
        } catch(e) {
            localStorage.removeItem('receipt');
        }
    }
    
    // Configurar data padrão se não existir
    if (!state.receipt.day || !state.receipt.month || !state.receipt.year) {
        const toTwoDigits = function(num) { return num < 10 ? '0' + num : num };
        const months = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
        
        const d = new Date();
        state.receipt.day = toTwoDigits(d.getDate());
        state.receipt.month = months[d.getMonth()];
        state.receipt.year = d.getFullYear();
    }
    
    // Atualizar UI
    updateImage();
    updateUserDocTitle();
    updateClientDocTitle();
    updateFullNumber();
    attachEditableHandlers();
    attachButtonHandlers();
    checkButtonDisabled();
    
    // Inicializar tooltip Bootstrap se disponível
    if (typeof $ !== 'undefined' && $.fn.tooltip) {
        $('[data-toggle="tooltip"]').tooltip();
    }
}

// Executar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
