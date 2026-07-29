const months = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];

// Estado da aplicação
const state = {
    quantity: 1,
    items: [{
        creditor: null,
        creditor_doc: null,
        debtor: null,
        debtor_doc: null,
        debtor_address: null,
        city: null,
        day: null,
        month: null,
        year: null,
        due_day: null,
        due_month: null,
        due_year: null,
        value: '0,00'
    }]
};

// Cache para elementos DOM
const domCache = {
    printButton: null,
    quantityInput: null,
    clearButton: null,
    container: null,
    tooltip: null
};

function initDOMCache() {
    domCache.printButton = document.getElementById('print');
    domCache.quantityInput = document.getElementById('quantity-input');
    domCache.clearButton = document.getElementById('clear');
    domCache.container = document.getElementById('document-container');
    domCache.tooltip = domCache.printButton ? domCache.printButton.parentElement : null;
}

// Versão otimizada do saveToLocalStorage com debounce
const saveToLocalStorage = debounce(function() {
    try {
        localStorage.setItem('promissories', JSON.stringify(state.items));
    } catch(e) {
        console.error('Erro ao salvar no localStorage:', e);
    }
}, 500);

// Adicionar flush ao debounce
saveToLocalStorage.flush = function() {
    try {
        localStorage.setItem('promissories', JSON.stringify(state.items));
    } catch(e) {
        console.error('Erro ao salvar no localStorage:', e);
    }
};

// Funções auxiliares
function getFullNumber(value) {
    return value !== '0,00' ? value.extenso(true) : 'zero reais';
}

function getFullDate(dueDay, dueMonth, dueYear) {
    if (dueDay && dueMonth && dueYear) {
        return dueDay.extenso() + ' de ' + dueMonth.toLowerCase() + ' de ' + dueYear.extenso();
    }
    return 'de vencimento';
}

function checkMonth(month) {
    return month && !months.includes(month.toLowerCase());
}

// Função para criar HTML de uma promissória
function createPromissoryHTML(item, number, quantity) {
    return `
        <div class="recibo ${number !== 1 ? 'segunda-via' : ''}" data-index="${number - 1}">
            <div class="flex justify-between">
                <div class="title">
                    <div style="margin-right:10px">NOTA PROMISSÓRIA</div>
                    <div class="title-detail">Nº ${number} de ${quantity}</div>
                </div>
                <div class="text-right">
                    <p class="text-bold">Vencimento: <span contenteditable="true" data-field="due_day" placeholder="Dia"></span> de <span contenteditable="true" data-field="due_month" placeholder="Mês"></span> de <span contenteditable="true" data-field="due_year" placeholder="Ano"></span></p>
                    <p class="text-bold">Valor: R$ <span contenteditable="true" data-field="value" placeholder="0,00" class="valor"></span></p>
                </div>
            </div>
            
            <div class="body">
                <p>No dia <span class="full-date">de vencimento</span> pagarei(emos) por esta única via de NOTA PROMISSÓRIA a <span contenteditable="true" data-field="creditor" placeholder="Nome do Credor"></span> <span class="creditor-doc-title">CPF/CNPJ</span> nº <span contenteditable="true" data-field="creditor_doc" placeholder="000.000.000-00"></span> ou à sua ordem, a quantia de <span class="full-number">zero reais</span> em moeda corrente desse país.</p>

                <div class="flex justify-between" style="margin-top:20px">
                    <div style="width:50%">
                        Emitente: <span contenteditable="true" data-field="debtor" placeholder="Nome do Emitente"></span><br>
                        <span class="debtor-doc-title">CPF/CNPJ</span>: <span contenteditable="true" data-field="debtor_doc" placeholder="000.000.000-00"></span><br>
                        Endereço: <span contenteditable="true" data-field="debtor_address" placeholder="Endereço do Emitente"></span><br>
                    </div>
                    <div class="text-right" style="width:50%">
                        <span contenteditable="true" data-field="city" placeholder="Cidade"></span>, <span contenteditable="true" data-field="day" placeholder="Dia"></span> de <span contenteditable="true" data-field="month" placeholder="Mês"></span> de <span contenteditable="true" data-field="year" placeholder="Ano"></span>
                    </div>
                </div>
                
                <div class="signature text-center">
                    <p>_________________________________________________</p>
                    <p>Assinatura do Emitente</p>
                </div>
            </div>
        </div>
    `;
}

// Renderizar todas as promissórias
function renderPromissories() {
    if (!domCache.container) return;
    
    domCache.container.innerHTML = '';
    
    state.items.forEach((item, index) => {
        domCache.container.innerHTML += createPromissoryHTML(item, index + 1, state.quantity);
    });
    
    // Após renderizar, anexar event handlers
    attachAllEventHandlers();
}

// Atualizar displays dinâmicos de uma promissória específica
function updatePromissoryDisplays(promissoryElement, itemIndex) {
    const item = state.items[itemIndex];
    
    // Batch DOM updates
    const updates = [];
    
    // Atualizar título do documento do credor
    const creditorDocTitle = promissoryElement.querySelector('.creditor-doc-title');
    if (creditorDocTitle) {
        const title = getDocTitle(item.creditor_doc);
        if (creditorDocTitle.textContent !== title) {
            updates.push(() => creditorDocTitle.textContent = title);
        }
    }
    
    // Atualizar título do documento do devedor
    const debtorDocTitle = promissoryElement.querySelector('.debtor-doc-title');
    if (debtorDocTitle) {
        const title = getDocTitle(item.debtor_doc);
        if (debtorDocTitle.textContent !== title) {
            updates.push(() => debtorDocTitle.textContent = title);
        }
    }
    
    // Atualizar número por extenso
    const fullNumber = promissoryElement.querySelector('.full-number');
    if (fullNumber) {
        const number = getFullNumber(item.value);
        if (fullNumber.textContent !== number) {
            updates.push(() => fullNumber.textContent = number);
        }
    }
    
    // Atualizar data por extenso
    const fullDate = promissoryElement.querySelector('.full-date');
    if (fullDate) {
        const date = getFullDate(item.due_day, item.due_month, item.due_year);
        if (fullDate.textContent !== date) {
            updates.push(() => fullDate.textContent = date);
        }
    }
    
    // Aplicar todas as atualizações de uma vez
    if (updates.length > 0) {
        requestAnimationFrame(() => {
            updates.forEach(update => update());
        });
    }
}

// Anexar event handlers a uma promissória
function attachPromissoryHandlers(promissoryElement, itemIndex) {
    const fields = promissoryElement.querySelectorAll('[contenteditable="true"]');
    
    fields.forEach(field => {
        const fieldName = field.getAttribute('data-field');
        
        // Evitar re-anexar handlers se já existirem
        if (field.dataset.hasHandlers === 'true') return;
        field.dataset.hasHandlers = 'true';
        
        // Atualizar conteúdo inicial
        if (state.items[itemIndex][fieldName] !== null && state.items[itemIndex][fieldName] !== '') {
            field.textContent = state.items[itemIndex][fieldName];
            
            // Aplicar classes iniciais
            if (fieldName === 'value' && state.items[itemIndex][fieldName] === '0,00') {
                field.classList.add('zero');
            }
            if ((fieldName === 'creditor_doc' || fieldName === 'debtor_doc') && state.items[itemIndex][fieldName]) {
                const value = state.items[itemIndex][fieldName];
                if (!validarCPF(value) && !validarCNPJ(value)) {
                    field.classList.add('invalid');
                }
            }
            if (fieldName === 'due_month' && checkMonth(state.items[itemIndex][fieldName])) {
                field.classList.add('invalid');
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
                
                state.items[itemIndex][fieldName] = value;
                updatePromissoryDisplays(promissoryElement, itemIndex);
                
            } else if (fieldName === 'creditor_doc' || fieldName === 'debtor_doc') {
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
                
                state.items[itemIndex][fieldName] = value;
                updatePromissoryDisplays(promissoryElement, itemIndex);
                
            } else if (fieldName === 'due_month') {
                // Validar mês
                this.classList.remove('invalid');
                if (checkMonth(value)) {
                    this.classList.add('invalid');
                }
                
                state.items[itemIndex][fieldName] = value;
                updatePromissoryDisplays(promissoryElement, itemIndex);
                
            } else if (fieldName === 'due_day' || fieldName === 'due_year') {
                state.items[itemIndex][fieldName] = value;
                updatePromissoryDisplays(promissoryElement, itemIndex);
                
            } else {
                state.items[itemIndex][fieldName] = value;
            }
            
            saveToLocalStorage();
            checkButtonDisabled();
        });
        
        // Blur event
        field.addEventListener('blur', function() {
            const value = this.textContent;
            state.items[itemIndex][fieldName] = value;
            saveToLocalStorage.flush();
        });
    });
}

// Anexar handlers a todas as promissórias
function attachAllEventHandlers() {
    const promissories = document.querySelectorAll('.recibo');
    promissories.forEach((promissory, index) => {
        attachPromissoryHandlers(promissory, index);
        updatePromissoryDisplays(promissory, index);
    });
}

// Atualizar quantidade de promissórias
function updateQuantity() {
    const quantity = parseInt(state.quantity);
    
    if (isNaN(quantity) || quantity === 0 || quantity > 99) return;
    
    const item = state.items[0];
    const newItems = [];
    let year = parseInt(item.due_year) || new Date().getFullYear();
    let monthIndex = item.due_month ? months.indexOf(item.due_month.toLowerCase()) : 0;
    
    if (monthIndex === -1) monthIndex = 0;
    
    for (let i = 0; i < quantity; i++) {
        const obj = {};
        
        for (let prop in item) {
            if (i !== 0) {
                if (prop === 'due_month') {
                    if (monthIndex < 11) {
                        monthIndex++;
                    } else {
                        monthIndex = 0;
                        year++;
                    }
                    obj[prop] = months[monthIndex];
                } else if (prop === 'due_year') {
                    obj[prop] = year.toString();
                } else {
                    obj[prop] = item[prop] ? item[prop].toString() : null;
                }
            } else {
                obj[prop] = item[prop];
            }
        }
        newItems.push(obj);
    }
    
    state.items = newItems;
    saveToLocalStorage.flush();
    renderPromissories();
}

// Otimizar checkButtonDisabled com cache
let lastButtonState = null;
function checkButtonDisabled() {
    const quantity = parseInt(state.quantity);
    
    let isDisabled = false;
    
    if (isNaN(quantity) || quantity === 0 || quantity > 99) {
        isDisabled = true;
    } else {
        const item = state.items[0];
        for (let prop in item) {
            if (!item[prop]) {
                isDisabled = true;
                break;
            }
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

// Anexar handlers dos botões
function attachButtonHandlers() {
    // Botão limpar
    domCache.clearButton.addEventListener('click', function() {
        localStorage.removeItem('promissories');
        location.reload();
    });
    
    // Botão imprimir
    domCache.printButton.addEventListener('click', function() {
        updateQuantity();
        
        setTimeout(function() {
            document.querySelectorAll('.segunda-via').forEach(el => {
                el.style.display = 'block';
            });
            window.print();
        }, 100);
        
        setTimeout(function() {
            document.querySelectorAll('.segunda-via').forEach(el => {
                el.style.display = 'none';
            });
        }, 200);
    });
    
    // Input de quantidade
    domCache.quantityInput.addEventListener('input', function() {
        state.quantity = this.value;
        checkButtonDisabled();
    });
}

// Inicialização
function init() {
    // Inicializar cache DOM
    initDOMCache();
    
    // Carregar do localStorage
    if (localStorage.getItem('promissories')) {
        try {
            state.items = JSON.parse(localStorage.getItem('promissories'));
            state.quantity = state.items.length;
            if (domCache.quantityInput) {
                domCache.quantityInput.value = state.quantity;
            }
        } catch(e) {
            localStorage.removeItem('promissories');
        }
    }
    
    // Configurar data padrão no primeiro item se não existir
    const toTwoDigits = function(num) { return num < 10 ? '0' + num : num };
    const d = new Date();
    
    if (!state.items[0].day || !state.items[0].month || !state.items[0].year) {
        state.items[0].day = toTwoDigits(d.getDate());
        state.items[0].month = months[d.getMonth()];
        state.items[0].year = d.getFullYear().toString();
    }
    
    // Renderizar e anexar handlers
    renderPromissories();
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
