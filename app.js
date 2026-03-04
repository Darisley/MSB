// ============================================
// EXPORTAÇÕES GLOBAIS PARA O HTML
// ============================================

// Funções de navegação
window.mudarAba = function(aba) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    document.querySelector(`.tab[onclick="mudarAba('${aba}')"]`).classList.add('active');
    document.getElementById(`aba-${aba}`).classList.add('active');
};

// Funções de cadastro
window.cadastrarFuncionario = function() {
    const nome = document.getElementById('nomeFuncionario')?.value;
    const cpf = document.getElementById('cpfFuncionario')?.value;
    const funcao = document.getElementById('funcaoFuncionario')?.value;
    
    if (!nome || !cpf || !funcao) {
        NotificationSystem.error('Preencha todos os campos');
        return;
    }
    
    EPISystem.addFuncionario(nome, cpf, funcao);
    carregarSelects();
    atualizarDashboard();
    carregarBaseDados();
    
    // Limpar campos
    document.getElementById('nomeFuncionario').value = '';
    document.getElementById('cpfFuncionario').value = '';
    document.getElementById('funcaoFuncionario').value = '';
};

window.cadastrarEPI = function() {
    const nome = document.getElementById('nomeEPI')?.value;
    const ca = document.getElementById('caEPI')?.value;
    const qtd = document.getElementById('qtdEPI')?.value;
    const valor = document.getElementById('valorEPI')?.value;
    const fornecedor = document.getElementById('fornecedorEPI')?.value;
    
    if (!nome || !ca || !qtd || !valor) {
        NotificationSystem.error('Preencha todos os campos obrigatórios');
        return;
    }
    
    EPISystem.addEPI(nome, ca, qtd, valor, fornecedor);
    atualizarDashboard();
    carregarBaseDados();
    
    // Limpar campos
    document.getElementById('nomeEPI').value = '';
    document.getElementById('caEPI').value = '';
    document.getElementById('qtdEPI').value = '';
    document.getElementById('valorEPI').value = '';
    document.getElementById('fornecedorEPI').value = '';
};

// Funções de importação
window.processarNotaFiscal = function(input) {
    if (!input.files || !input.files[0]) return;
    
    const file = input.files[0];
    document.getElementById('notaArquivo').textContent = file.name;
    
    // Simular leitura do arquivo
    const reader = new FileReader();
    reader.onload = function(e) {
        // Exemplo de dados simulados
        produtosNota = [
            {
                id: 1,
                nome: "Capacete de Segurança",
                codigo: "CA-12345",
                quantidade: 10,
                valor: 45.90,
                fornecedor: "Fornecedor Exemplo",
                status: "novo"
            },
            {
                id: 2,
                nome: "Óculos de Proteção",
                codigo: "CA-67890",
                quantidade: 20,
                valor: 15.50,
                fornecedor: "Fornecedor Exemplo",
                status: "novo"
            }
        ];
        
        infoNotaAtual = {
            arquivo: file.name,
            fornecedor: "Fornecedor Exemplo",
            numero: "123456",
            data: new Date().toLocaleDateString('pt-BR'),
            total: 779.00
        };
        
        atualizarInfoNota();
        renderizarProdutosNota();
        document.getElementById('infoNota').classList.remove('hidden');
    };
    reader.readAsText(file);
};

window.atualizarInfoNota = function() {
    document.getElementById('notaFornecedor').textContent = infoNotaAtual.fornecedor || '-';
    document.getElementById('notaNumero').textContent = infoNotaAtual.numero || '-';
    document.getElementById('notaData').textContent = infoNotaAtual.data || '-';
    document.getElementById('notaTotal').textContent = formatarMoeda(infoNotaAtual.total || 0);
    document.getElementById('produtosCount').textContent = produtosNota.length;
};

window.renderizarProdutosNota = function() {
    const container = document.getElementById('produtosLista');
    if (!container) return;
    
    container.innerHTML = '';
    produtosNota.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'produto-card-enhanced';
        card.innerHTML = `
            <div class="produto-card-header">
                <div class="produto-checkbox">
                    <input type="checkbox" class="produto-check" data-id="${produto.id}" checked>
                </div>
                <div class="produto-codigo">
                    <small>Código/CA</small>
                    <div class="codigo-valor">${produto.codigo}</div>
                </div>
                <div class="status-badge status-${produto.status}">
                    ${produto.status === 'novo' ? 'Novo' : 'Duplicado'}
                </div>
            </div>
            <div class="produto-card-body">
                <div class="produto-descricao">
                    <small>Descrição</small>
                    <p class="descricao-valor">${produto.nome}</p>
                </div>
                <div class="produto-detalhes">
                    <div class="detalhe-item">
                        <small>Qtd</small>
                        <span>${produto.quantidade}</span>
                    </div>
                    <div class="detalhe-item">
                        <small>Unitário</small>
                        <span>${formatarMoeda(produto.valor)}</span>
                    </div>
                    <div class="detalhe-item">
                        <small>Total</small>
                        <span>${formatarMoeda(produto.valor * produto.quantidade)}</span>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
    
    atualizarSelecionados();
};

window.atualizarSelecionados = function() {
    const checkboxes = document.querySelectorAll('.produto-check:checked');
    document.getElementById('produtosSelecionados').textContent = checkboxes.length;
};

window.selecionarTodosProdutos = function() {
    document.querySelectorAll('.produto-check').forEach(cb => {
        cb.checked = true;
    });
    atualizarSelecionados();
};

window.limparSelecaoProdutos = function() {
    document.querySelectorAll('.produto-check').forEach(cb => {
        cb.checked = false;
    });
    atualizarSelecionados();
};

window.importarProdutosSelecionados = function() {
    const selecionados = Array.from(document.querySelectorAll('.produto-check:checked'))
        .map(cb => produtosNota.find(p => p.id == cb.dataset.id));
    
    if (selecionados.length === 0) {
        NotificationSystem.warning('Selecione pelo menos um produto');
        return;
    }
    
    selecionados.forEach(produto => {
        EPISystem.addEPI(
            produto.nome,
            produto.codigo,
            produto.quantidade,
            produto.valor,
            produto.fornecedor || 'Importado'
        );
    });
    
    NotificationSystem.success(`${selecionados.length} EPI(s) importado(s) com sucesso!`);
    atualizarDashboard();
    carregarBaseDados();
};

// Funções de entrega
window.inicializarCanvas = function() {
    canvas = document.getElementById('canvasAssinatura');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#1F3A5F';
    ctx.lineWidth = 2;
    
    canvas.addEventListener('mousedown', iniciarDesenho);
    canvas.addEventListener('mousemove', desenhar);
    canvas.addEventListener('mouseup', pararDesenho);
    canvas.addEventListener('mouseleave', pararDesenho);
    
    // Touch events para mobile
    canvas.addEventListener('touchstart', iniciarDesenhoTouch);
    canvas.addEventListener('touchmove', desenharTouch);
    canvas.addEventListener('touchend', pararDesenho);
};

window.iniciarDesenho = function(e) {
    desenhando = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
};

window.iniciarDesenhoTouch = function(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    desenhando = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
};

window.desenhar = function(e) {
    if (!desenhando) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
};

window.desenharTouch = function(e) {
    e.preventDefault();
    if (!desenhando) return;
    
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
};

window.pararDesenho = function() {
    desenhando = false;
};

window.limparAssinatura = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    assinaturaDataURL = '';
    document.getElementById('assinaturaStatus').innerHTML = '';
};

window.salvarAssinatura = function() {
    assinaturaDataURL = canvas.toDataURL();
    document.getElementById('assinaturaStatus').innerHTML = '<i class="fas fa-check-circle"></i> Assinatura salva!';
};

window.adicionarItemEPI = function() {
    contadorItensEPI++;
    const container = document.getElementById('episList');
    if (!container) return;
    
    const epis = DataManager.load('epis') || [];
    
    let options = '<option value="">Selecione um EPI...</option>';
    epis.forEach(epi => {
        options += `<option value="${epi.id}" data-estoque="${epi.quantidade}">${epi.nome} (Estoque: ${epi.quantidade})</option>`;
    });
    
    const item = document.createElement('div');
    item.className = 'epi-item';
    item.id = `epi-item-${contadorItensEPI}`;
    item.innerHTML = `
        <select class="form-control epi-select" onchange="atualizarResumoEntregas()">
            ${options}
        </select>
        <input type="number" class="form-control epi-qtd" min="1" value="1" onchange="atualizarResumoEntregas()">
        <button class="btn btn-danger btn-sm" onclick="removerItemEPI('${item.id}')">
            <i class="fas fa-trash"></i>
        </button>
    `;
    container.appendChild(item);
};

window.removerItemEPI = function(id) {
    document.getElementById(id)?.remove();
    atualizarResumoEntregas();
};

window.atualizarResumoEntregas = function() {
    const funcionarioSelect = document.getElementById('selectFuncionario');
    const funcionario = funcionarioSelect?.options[funcionarioSelect.selectedIndex]?.text;
    const items = document.querySelectorAll('.epi-item');
    const resumoDiv = document.getElementById('resumoEntregas');
    
    if (!funcionarioSelect?.value || items.length === 0) {
        resumoDiv?.classList.add('hidden');
        return;
    }
    
    let totalItens = 0;
    let htmlItens = '<ul style="margin-left: 20px;">';
    
    items.forEach(item => {
        const select = item.querySelector('.epi-select');
        const qtd = item.querySelector('.epi-qtd')?.value || 0;
        const epiNome = select?.options[select.selectedIndex]?.text.split(' (')[0] || 'EPI';
        
        if (select?.value) {
            totalItens += parseInt(qtd);
            htmlItens += `<li>${epiNome} - Quantidade: ${qtd}</li>`;
        }
    });
    
    htmlItens += '</ul>';
    
    document.getElementById('resumoFuncionario').innerHTML = `<strong>Funcionário:</strong> ${funcionario || '-'}`;
    document.getElementById('resumoItens').innerHTML = `<strong>Total de itens:</strong> ${totalItens}`;
    document.getElementById('resumoListaItens').innerHTML = htmlItens;
    
    resumoDiv?.classList.remove('hidden');
};

window.registrarEntregaMultipla = function() {
    const funcionarioId = document.getElementById('selectFuncionario')?.value;
    const obs = document.getElementById('obsEntrega')?.value;
    
    if (!funcionarioId) {
        NotificationSystem.error('Selecione um funcionário');
        return;
    }
    
    if (!assinaturaDataURL) {
        NotificationSystem.warning('É necessário salvar a assinatura antes de registrar a entrega');
        return;
    }
    
    const items = document.querySelectorAll('.epi-item');
    let registradas = 0;
    
    items.forEach(item => {
        const select = item.querySelector('.epi-select');
        const qtd = item.querySelector('.epi-qtd')?.value;
        
        if (select?.value && qtd > 0) {
            const success = EPISystem.addEntrega(funcionarioId, select.value, qtd);
            if (success) registradas++;
        }
    });
    
    if (registradas > 0) {
        // Salvar a assinatura com a entrega
        const entregas = DataManager.load('entregas') || [];
        if (entregas.length > 0) {
            entregas[entregas.length - 1].assinatura = assinaturaDataURL;
            entregas[entregas.length - 1].observacao = obs;
            DataManager.save('entregas', entregas);
        }
        
        NotificationSystem.success(`${registradas} entrega(s) registrada(s) com sucesso!`);
        limparAssinatura();
        atualizarDashboard();
        carregarBaseDados();
    }
};

// Funções de relatórios
window.gerarRelatorio = function() {
    const tipo = document.getElementById('filtroRelatorio')?.value;
    const dataInicio = document.getElementById('filtroDataInicio')?.value;
    const dataFim = document.getElementById('filtroDataFim')?.value;
    const funcionarioId = document.getElementById('filtroFuncionario')?.value;
    
    let html = '';
    
    switch(tipo) {
        case 'estoque':
            const epis = DataManager.load('epis') || [];
            html = `
                <table>
                    <thead>
                        <tr>
                            <th>EPI</th>
                            <th>Código CA</th>
                            <th>Quantidade</th>
                            <th>Valor Unit.</th>
                            <th>Valor Total</th>
                            <th>Fornecedor</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${epis.map(epi => `
                            <tr>
                                <td>${epi.nome}</td>
                                <td>${epi.codigoCA}</td>
                                <td>${epi.quantidade}</td>
                                <td>${formatarMoeda(epi.valor)}</td>
                                <td>${formatarMoeda(epi.valor * epi.quantidade)}</td>
                                <td>${epi.fornecedor || '-'}</td>
                                <td>${epi.quantidade < 10 ? '<span class="badge-danger">Baixo</span>' : '<span class="badge-success">Normal</span>'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            break;
            
        case 'entregas':
            const entregas = DataManager.load('entregas') || [];
            const funcionarios = DataManager.load('funcionarios') || [];
            const epis = DataManager.load('epis') || [];
            
            html = `
                <table>
                    <thead>
                        <tr>
                            <th>Data/Hora</th>
                            <th>Funcionário</th>
                            <th>EPI</th>
                            <th>Quantidade</th>
                            <th>Observação</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${entregas.map(entrega => {
                            const func = funcionarios.find(f => f.id == entrega.funcionarioId);
                            const epi = epis.find(e => e.id == entrega.epiId);
                            return `
                                <tr>
                                    <td>${entrega.dataEntrega} ${entrega.horaEntrega || ''}</td>
                                    <td>${func?.nome || 'N/A'}</td>
                                    <td>${epi?.nome || 'N/A'}</td>
                                    <td>${entrega.quantidade}</td>
                                    <td>${entrega.observacao || '-'}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            `;
            break;
    }
    
    document.getElementById('relatorioResultado').innerHTML = html;
};

window.exportarRelatorioExcel = function() {
    const relatorio = document.getElementById('relatorioResultado');
    if (!relatorio || relatorio.innerHTML === '') {
        NotificationSystem.warning('Gere um relatório primeiro');
        return;
    }
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(relatorio.querySelector('table'));
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
    XLSX.writeFile(wb, `relatorio_epi_${new Date().toISOString().split('T')[0]}.xlsx`);
};

window.gerarRelatorioPDF = function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Relatório de EPI - MSB Construções', 20, 20);
    doc.setFontSize(12);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 30);
    
    // Aqui você pode adicionar mais conteúdo do relatório
    
    doc.save(`relatorio_epi_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Funções de base de dados
window.carregarBaseDados = function() {
    const tipo = document.getElementById('seletorBase')?.value;
    const container = document.getElementById('baseResultado');
    if (!container) return;
    
    switch(tipo) {
        case 'estoque':
            const epis = DataManager.load('epis') || [];
            container.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Ações</th>
                            <th>EPI</th>
                            <th>Código CA</th>
                            <th>Quantidade</th>
                            <th>Valor Unit.</th>
                            <th>Valor Total</th>
                            <th>Fornecedor</th>
                            <th>Data Cadastro</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${epis.map(epi => `
                            <tr>
                                <td>
                                    <button class="btn btn-sm btn-outline" onclick="editarEPI(${epi.id})">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-danger" onclick="deletarEPI(${epi.id})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                                <td>${epi.nome}</td>
                                <td>${epi.codigoCA}</td>
                                <td>${epi.quantidade}</td>
                                <td>${formatarMoeda(epi.valor)}</td>
                                <td>${formatarMoeda(epi.valor * epi.quantidade)}</td>
                                <td>${epi.fornecedor || '-'}</td>
                                <td>${epi.dataCadastro || '-'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            break;
            
        case 'funcionarios':
            const funcionarios = DataManager.load('funcionarios') || [];
            container.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Ações</th>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th>Função</th>
                            <th>Data Cadastro</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${funcionarios.map(func => `
                            <tr>
                                <td>
                                    <button class="btn btn-sm btn-outline" onclick="editarFuncionario(${func.id})">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-danger" onclick="deletarFuncionario(${func.id})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                                <td>${func.nome}</td>
                                <td>${func.cpf}</td>
                                <td>${func.funcao}</td>
                                <td>${func.dataCadastro || '-'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            break;
            
        case 'estoque_baixo':
            const episBaixo = (DataManager.load('epis') || []).filter(e => e.quantidade < 10);
            container.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>EPI</th>
                            <th>Código CA</th>
                            <th>Quantidade Atual</th>
                            <th>Fornecedor</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${episBaixo.map(epi => `
                            <tr>
                                <td>${epi.nome}</td>
                                <td>${epi.codigoCA}</td>
                                <td class="text-danger">${epi.quantidade}</td>
                                <td>${epi.fornecedor || '-'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            break;
    }
};

window.atualizarDashboard = function() {
    const epis = DataManager.load('epis') || [];
    const funcionarios = DataManager.load('funcionarios') || [];
    const estoqueBaixo = epis.filter(e => e.quantidade < 10).length;
    const tiposEPI = new Set(epis.map(e => e.nome)).size;
    const totalEPIs = epis.reduce((acc, e) => acc + e.quantidade, 0);
    
    document.getElementById('totalEPIs').textContent = totalEPIs;
    document.getElementById('tiposEPI').textContent = tiposEPI;
    document.getElementById('totalFuncionarios').textContent = funcionarios.length;
    document.getElementById('estoqueBaixo').textContent = estoqueBaixo;
};

window.carregarSelects = function() {
    const funcionarios = DataManager.load('funcionarios') || [];
    const epis = DataManager.load('epis') || [];
    
    // Select de funcionários
    const selectFunc = document.getElementById('selectFuncionario');
    const filtroFunc = document.getElementById('filtroFuncionario');
    
    if (selectFunc) {
        selectFunc.innerHTML = '<option value="">Selecione...</option>';
        funcionarios.forEach(f => {
            selectFunc.innerHTML += `<option value="${f.id}">${f.nome}</option>`;
        });
    }
    
    if (filtroFunc) {
        filtroFunc.innerHTML = '<option value="">Todos</option>';
        funcionarios.forEach(f => {
            filtroFunc.innerHTML += `<option value="${f.id}">${f.nome}</option>`;
        });
    }
};

// Funções de edição/deleção
window.editarEPI = function(id) {
    const epis = DataManager.load('epis') || [];
    const epi = epis.find(e => e.id == id);
    if (!epi) return;
    
    document.getElementById('editIdEPI').value = epi.id;
    document.getElementById('editNomeEPI').value = epi.nome;
    document.getElementById('editCaEPI').value = epi.codigoCA;
    document.getElementById('editQtdEPI').value = epi.quantidade;
    document.getElementById('editValorEPI').value = epi.valor;
    document.getElementById('editFornecedorEPI').value = epi.fornecedor || '';
    
    document.getElementById('modalEditarEPI').style.display = 'block';
};

window.salvarEdicaoEPI = function() {
    const id = document.getElementById('editIdEPI').value;
    const epis = DataManager.load('epis') || [];
    const index = epis.findIndex(e => e.id == id);
    
    if (index === -1) return;
    
    epis[index] = {
        ...epis[index],
        nome: document.getElementById('editNomeEPI').value,
        codigoCA: document.getElementById('editCaEPI').value,
        quantidade: parseInt(document.getElementById('editQtdEPI').value),
        valor: parseFloat(document.getElementById('editValorEPI').value),
        fornecedor: document.getElementById('editFornecedorEPI').value
    };
    
    DataManager.save('epis', epis);
    NotificationSystem.success('EPI atualizado com sucesso!');
    fecharModalEditar();
    atualizarDashboard();
    carregarBaseDados();
};

window.fecharModalEditar = function() {
    document.getElementById('modalEditarEPI').style.display = 'none';
};

window.deletarEPI = function(id) {
    EPISystem.deleteItem('epis', id);
    atualizarDashboard();
    carregarBaseDados();
    carregarSelects();
};

window.editarFuncionario = function(id) {
    const funcionarios = DataManager.load('funcionarios') || [];
    const func = funcionarios.find(f => f.id == id);
    if (!func) return;
    
    document.getElementById('editIdFuncionario').value = func.id;
    document.getElementById('editNomeFuncionario').value = func.nome;
    document.getElementById('editCpfFuncionario').value = func.cpf;
    document.getElementById('editFuncaoFuncionario').value = func.funcao;
    
    document.getElementById('modalEditarFuncionario').style.display = 'block';
};

window.salvarEdicaoFuncionario = function() {
    const id = document.getElementById('editIdFuncionario').value;
    const funcionarios = DataManager.load('funcionarios') || [];
    const index = funcionarios.findIndex(f => f.id == id);
    
    if (index === -1) return;
    
    funcionarios[index] = {
        ...funcionarios[index],
        nome: document.getElementById('editNomeFuncionario').value,
        cpf: document.getElementById('editCpfFuncionario').value,
        funcao: document.getElementById('editFuncaoFuncionario').value
    };
    
    DataManager.save('funcionarios', funcionarios);
    NotificationSystem.success('Funcionário atualizado com sucesso!');
    fecharModalEditarFuncionario();
    atualizarDashboard();
    carregarBaseDados();
    carregarSelects();
};

window.fecharModalEditarFuncionario = function() {
    document.getElementById('modalEditarFuncionario').style.display = 'none';
};

window.deletarFuncionario = function(id) {
    EPISystem.deleteItem('funcionarios', id);
    atualizarDashboard();
    carregarBaseDados();
    carregarSelects();
};

// Funções de importação Excel
window.exportarModeloFuncionarios = function() {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
        ['Nome', 'CPF', 'Função'],
        ['João Silva', '12345678901', 'Pedreiro'],
        ['Maria Santos', '98765432101', 'Engenheira']
    ]);
    XLSX.utils.book_append_sheet(wb, ws, 'Modelo');
    XLSX.writeFile(wb, 'modelo_importacao_funcionarios.xlsx');
};

window.importarFuncionariosExcel = function(input) {
    if (!input.files || !input.files[0]) return;
    
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            
            let importados = 0;
            let erros = [];
            
            for (let i = 1; i < rows.length; i++) {
                const [nome, cpf, funcao] = rows[i];
                
                if (!nome || !cpf || !funcao) {
                    erros.push(`Linha ${i+1}: Campos obrigatórios não preenchidos`);
                    continue;
                }
                
                const cpfLimpo = cpf.toString().replace(/\D/g, '');
                if (cpfLimpo.length !== 11) {
                    erros.push(`Linha ${i+1}: CPF inválido (deve ter 11 dígitos)`);
                    continue;
                }
                
                const success = EPISystem.addFuncionario(nome, cpfLimpo, funcao);
                if (success) importados++;
            }
            
            if (importados > 0) {
                NotificationSystem.success(`${importados} funcionários importados com sucesso!`);
                carregarSelects();
                atualizarDashboard();
                carregarBaseDados();
            }
            
            if (erros.length > 0) {
                mostrarErrosImportacao(erros);
            }
            
        } catch (error) {
            NotificationSystem.error('Erro ao processar arquivo Excel');
        }
    };
    
    reader.readAsArrayBuffer(file);
};

window.mostrarErrosImportacao = function(erros) {
    const lista = document.getElementById('listaErrosImportacao');
    lista.innerHTML = erros.map(err => `<p style="color: #dc3545;">${err}</p>`).join('');
    document.getElementById('modalErrosImportacao').style.display = 'flex';
};

window.fecharModalErros = function() {
    document.getElementById('modalErrosImportacao').style.display = 'none';
};

// Funções de exportação
window.exportarBaseExcel = function() {
    const funcionarios = DataManager.load('funcionarios') || [];
    const epis = DataManager.load('epis') || [];
    const entregas = DataManager.load('entregas') || [];
    
    const wb = XLSX.utils.book_new();
    
    // Planilha de funcionários
    const wsFuncionarios = XLSX.utils.json_to_sheet(funcionarios);
    XLSX.utils.book_append_sheet(wb, wsFuncionarios, 'Funcionários');
    
    // Planilha de EPIs
    const wsEPIs = XLSX.utils.json_to_sheet(epis);
    XLSX.utils.book_append_sheet(wb, wsEPIs, 'EPIs');
    
    // Planilha de Entregas
    const wsEntregas = XLSX.utils.json_to_sheet(entregas);
    XLSX.utils.book_append_sheet(wb, wsEntregas, 'Entregas');
    
    XLSX.writeFile(wb, `base_completa_epi_${new Date().toISOString().split('T')[0]}.xlsx`);
};

window.configurarDragAndDrop = function() {
    const dropArea = document.getElementById('dropArea');
    if (!dropArea) return;
    
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('drag-over');
    });
    
    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('drag-over');
    });
    
    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const input = document.getElementById('fileInput');
            input.files = files;
            processarNotaFiscal(input);
        }
    });
};

// Inicialização adicional
document.addEventListener('DOMContentLoaded', function() {
    inicializarCanvas();
    carregarSelects();
    atualizarDashboard();
    carregarBaseDados();
    configurarDragAndDrop();
    
    // Adicionar primeiro item de EPI
    if (document.getElementById('episList')) {
        adicionarItemEPI();
    }
    
    // Máscara do CPF
    if (typeof $ !== 'undefined' && $('#cpfFuncionario').length) {
        $('#cpfFuncionario').mask('000.000.000-00');
    }
});