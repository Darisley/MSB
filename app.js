// CONTROLE DE EPI - JAVASCRIPT MELHORADO
// Sistema de Gestão de EPI com Validações e Toast Notifications

// ============================================
// SISTEMA DE NOTIFICAÇÕES (TOAST)
// ============================================

class NotificationSystem {
  static show(message, type = 'info', duration = 3000) {
    const container = document.querySelector('.toast-container') || this.createContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };
    
    toast.innerHTML = `
      <i class="${icons[type]}"></i>
      <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideInRight 0.3s ease reverse';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
  
  static createContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
  }
  
  static success(msg) { this.show(msg, 'success'); }
  static error(msg) { this.show(msg, 'error'); }
  static warning(msg) { this.show(msg, 'warning'); }
  static info(msg) { this.show(msg, 'info'); }
}

// ============================================
// VALIDAÇÕES
// ============================================

class Validator {
  static isValidCPF(cpf) {
    // Remove formatação
    let cleaned = cpf.replace(/\D/g, '');
    
    if (cleaned.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleaned)) return false;
    
    // Calcula primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += cleaned[i] * (10 - i);
    }
    let digit1 = (sum * 10) % 11;
    if (digit1 === 10) digit1 = 0;
    if (digit1 !== parseInt(cleaned[9])) return false;
    
    // Calcula segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += cleaned[i] * (11 - i);
    }
    let digit2 = (sum * 10) % 11;
    if (digit2 === 10) digit2 = 0;
    if (digit2 !== parseInt(cleaned[10])) return false;
    
    return true;
  }
  
  static isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  static isValidPhone(phone) {
    return /^(\d{10,11})$/.test(phone.replace(/\D/g, ''));
  }
  
  static isNotEmpty(value) {
    return value && value.toString().trim().length > 0;
  }
  
  static isNumber(value) {
    return !isNaN(value) && value.toString().trim().length > 0;
  }
  
  static isPositive(value) {
    return this.isNumber(value) && parseFloat(value) > 0;
  }
}

// ============================================
// GERENCIAMENTO DE DADOS
// ============================================

const DataManager = {
  // Salvar dados no localStorage com timestamp
  save(key, data) {
    try {
      const dataWithTimestamp = {
        data: data,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem(key, JSON.stringify(dataWithTimestamp));
      return true;
    } catch (error) {
      console.error(`Erro ao salvar ${key}:`, error);
      NotificationSystem.error(`Erro ao salvar dados: ${error.message}`);
      return false;
    }
  },
  
  // Carregar dados do localStorage
  load(key) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      return parsed.data || parsed; // Compatibilidade com versão anterior
    } catch (error) {
      console.error(`Erro ao carregar ${key}:`, error);
      return null;
    }
  },
  
  // Criar backup automático
  backup() {
    const backup = {
      funcionarios: this.load('funcionarios') || [],
      epis: this.load('epis') || [],
      entregas: this.load('entregas') || [],
      timestamp: new Date().toISOString()
    };
    return backup;
  },
  
  // Restaurar backup
  restore(backup) {
    try {
      if (backup.funcionarios) this.save('funcionarios', backup.funcionarios);
      if (backup.epis) this.save('epis', backup.epis);
      if (backup.entregas) this.save('entregas', backup.entregas);
      NotificationSystem.success('Backup restaurado com sucesso!');
      return true;
    } catch (error) {
      NotificationSystem.error('Erro ao restaurar backup');
      return false;
    }
  },
  
  // Limpar todos os dados
  clear() {
    if (confirm('Tem certeza? Esta ação não pode ser desfeita!')) {
      localStorage.clear();
      NotificationSystem.success('Todos os dados foram removidos');
      location.reload();
    }
  },
  
  // Obter estatísticas
  getStats() {
    const funcionarios = this.load('funcionarios') || [];
    const epis = this.load('epis') || [];
    const entregas = this.load('entregas') || [];
    
    return {
      totalFuncionarios: funcionarios.length,
      totalEPIs: epis.length,
      totalEntregas: entregas.length,
      dataUltimaAtualizacao: new Date().toLocaleDateString('pt-BR')
    };
  }
};

// ============================================
// DARK MODE
// ============================================

const ThemeManager = {
  init() {
    const saved = localStorage.getItem('theme') || 'light';
    this.setTheme(saved);
    this.setupToggle();
  },
  
  setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.style.colorScheme = 'dark';
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.style.colorScheme = 'light';
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('theme', theme);
  },
  
  setupToggle() {
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const current = localStorage.getItem('theme') || 'light';
        const next = current === 'light' ? 'dark' : 'light';
        this.setTheme(next);
      });
    }
  },
  
  toggle() {
    const current = localStorage.getItem('theme') || 'light';
    this.setTheme(current === 'light' ? 'dark' : 'light');
  }
};

// ============================================
// FUNCIONALIDADES DO SISTEMA
// ============================================

const EPISystem = {
  // Adicionar funcionário com validação
  addFuncionario(nome, cpf, funcao) {
    if (!Validator.isNotEmpty(nome)) {
      NotificationSystem.error('Nome é obrigatório');
      return false;
    }
    
    if (!Validator.isValidCPF(cpf)) {
      NotificationSystem.error('CPF inválido');
      return false;
    }
    
    if (!Validator.isNotEmpty(funcao)) {
      NotificationSystem.error('Função é obrigatória');
      return false;
    }
    
    const funcionarios = DataManager.load('funcionarios') || [];
    
    // Verifica duplicidade
    if (funcionarios.some(f => f.cpf.replace(/\D/g, '') === cpf.replace(/\D/g, ''))) {
      NotificationSystem.warning('Este CPF já está cadastrado');
      return false;
    }
    
    const novoFuncionario = {
      id: Date.now(),
      nome,
      cpf,
      funcao,
      dataCadastro: new Date().toLocaleDateString('pt-BR')
    };
    
    funcionarios.push(novoFuncionario);
    DataManager.save('funcionarios', funcionarios);
    NotificationSystem.success('Funcionário cadastrado com sucesso!');
    return true;
  },
  
  // Adicionar EPI com validação
  addEPI(nome, codigoCA, quantidade, valor, fornecedor) {
    if (!Validator.isNotEmpty(nome)) {
      NotificationSystem.error('Nome do EPI é obrigatório');
      return false;
    }
    
    if (!Validator.isNotEmpty(codigoCA)) {
      NotificationSystem.error('Código CA é obrigatório');
      return false;
    }
    
    if (!Validator.isPositive(quantidade)) {
      NotificationSystem.error('Quantidade deve ser maior que zero');
      return false;
    }
    
    if (!Validator.isPositive(valor)) {
      NotificationSystem.error('Valor deve ser maior que zero');
      return false;
    }
    
    const epis = DataManager.load('epis') || [];
    
    // Verifica duplicidade
    if (epis.some(e => e.codigoCA === codigoCA)) {
      NotificationSystem.warning('Este código CA já existe');
      return false;
    }
    
    const novoEPI = {
      id: Date.now(),
      nome,
      codigoCA,
      quantidade: parseInt(quantidade),
      valor: parseFloat(valor),
      fornecedor,
      dataCadastro: new Date().toLocaleDateString('pt-BR')
    };
    
    epis.push(novoEPI);
    DataManager.save('epis', epis);
    NotificationSystem.success('EPI cadastrado com sucesso!');
    return true;
  },
  
  // Registrar entrega
  addEntrega(funcionarioId, epiId, quantidade) {
    if (!Validator.isPositive(quantidade)) {
      NotificationSystem.error('Quantidade deve ser maior que zero');
      return false;
    }
    
    const funcionarios = DataManager.load('funcionarios') || [];
    const epis = DataManager.load('epis') || [];
    const entregas = DataManager.load('entregas') || [];
    
    const funcionario = funcionarios.find(f => f.id == funcionarioId);
    const epi = epis.find(e => e.id == epiId);
    
    if (!funcionario || !epi) {
      NotificationSystem.error('Funcionário ou EPI não encontrado');
      return false;
    }
    
    if (epi.quantidade < quantidade) {
      NotificationSystem.warning('Quantidade insuficiente em estoque');
      return false;
    }
    
    // Atualizar estoque
    epi.quantidade -= parseInt(quantidade);
    DataManager.save('epis', epis);
    
    const novaEntrega = {
      id: Date.now(),
      funcionarioId,
      epiId,
      quantidade: parseInt(quantidade),
      dataEntrega: new Date().toLocaleDateString('pt-BR'),
      horaEntrega: new Date().toLocaleTimeString('pt-BR')
    };
    
    entregas.push(novaEntrega);
    DataManager.save('entregas', entregas);
    NotificationSystem.success('Entrega registrada com sucesso!');
    return true;
  },
  
  // Deletar com confirmação
  deleteItem(type, id) {
    if (!confirm('Tem certeza que deseja deletar este item?')) return;
    
    const data = DataManager.load(type) || [];
    const index = data.findIndex(item => item.id == id);
    
    if (index !== -1) {
      const item = data[index];
      data.splice(index, 1);
      DataManager.save(type, data);
      NotificationSystem.success('Item removido com sucesso!');
      return true;
    }
    return false;
  }
};

// ============================================
// EXPORTAÇÃO
// ============================================

const ExportSystem = {
  // Exportar como JSON
  exportJSON() {
    const data = DataManager.backup();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `epi_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    NotificationSystem.success('Backup exportado com sucesso!');
  },
  
  // Importar JSON
  importJSON(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target.result);
        DataManager.restore(backup);
      } catch (error) {
        NotificationSystem.error('Erro ao importar arquivo');
      }
    };
    reader.readAsText(file);
  }
};

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Inicializar tema
  ThemeManager.init();
  
  // Registrar Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('Service Worker registrado'))
      .catch(err => console.log('Erro ao registrar Service Worker:', err));
  }
  
  // Atualizar data do sistema
  const dataSistemaEl = document.getElementById('dataSistema');
  if (dataSistemaEl) {
    const opcoes = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dataSistemaEl.textContent = new Date().toLocaleDateString('pt-BR', opcoes);
  }
  
  NotificationSystem.success('Sistema carregado com sucesso!');
});

// ============================================
// UTILITÁRIOS
// ============================================

function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

function formatarData(data) {
  return new Date(data).toLocaleDateString('pt-BR');
}

function formatarCPF(cpf) {
  return cpf.replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{2})$/, '$1-$2');
}

// Exportar para módulos ou uso global
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    NotificationSystem, 
    Validator, 
    DataManager, 
    ThemeManager, 
    EPISystem, 
    ExportSystem 
  };
}
