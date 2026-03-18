const tarefas = [];

const inputNome = document.getElementById('task-name');
const inputCategoria = document.getElementById('task-category');
const inputPrioridade = document.getElementById('task-priority');
const inputData = document.getElementById('task-date');
const botaoAdicionar = document.getElementById('btn-add');
const listaTarefas = document.getElementById('task-list');
const estadoVazio = document.getElementById('empty-state');
const contadorPendentes = document.getElementById('count-pending');
const contadorConcluidas = document.getElementById('count-done');
const filtroCategoria = document.getElementById('filter-category');
const filtroOrdenacao = document.getElementById('filter-sort');

const erroNome = document.getElementById('err-name');
const erroCategoria = document.getElementById('err-category');
const erroPrioridade = document.getElementById('err-priority');
const erroData = document.getElementById('err-date');

const ordemPrioridade = { Alta: 1, Média: 2, Baixa: 3 };

function validar() {
  let valido = true;

  erroNome.textContent = '';
  erroCategoria.textContent = '';
  erroPrioridade.textContent = '';
  erroData.textContent = '';

  if (!inputNome.value.trim()) {
    erroNome.textContent = 'Informe o nome da tarefa.';
    valido = false;
  }
  if (!inputCategoria.value) {
    erroCategoria.textContent = 'Selecione uma categoria.';
    valido = false;
  }
  if (!inputPrioridade.value) {
    erroPrioridade.textContent = 'Selecione a prioridade.';
    valido = false;
  }
  if (!inputData.value) {
    erroData.textContent = 'Informe a data limite.';
    valido = false;
  }

  return valido;
}

function formatarData(dataStr) {
  const [ano, mes, dia] = dataStr.split('-');
  return `${dia}/${mes}/${ano}`;
}

function adicionarTarefa() {
  if (!validar()) return;

  const novaTarefa = {
    id: Date.now(),
    nome: inputNome.value.trim(),
    categoria: inputCategoria.value,
    prioridade: inputPrioridade.value,
    data: inputData.value,
    concluida: false,
  };

  tarefas.push(novaTarefa);

  inputNome.value = '';
  inputCategoria.value = '';
  inputPrioridade.value = '';
  inputData.value = '';

  renderizar();
}

function alternarConcluida(id) {
  const tarefa = tarefas.find(t => t.id === id);
  if (tarefa) tarefa.concluida = !tarefa.concluida;
  renderizar();
}

function excluirTarefa(id) {
  const indice = tarefas.findIndex(t => t.id === id);
  if (indice !== -1) tarefas.splice(indice, 1);
  renderizar();
}

function obterFiltradas() {
  const pilhaAtiva = filtroCategoria.querySelector('.pill.active');
  const categoria = pilhaAtiva ? pilhaAtiva.dataset.value : 'Todas';
  const ordenacao = filtroOrdenacao.value;

  let filtradas = categoria === 'Todas' ? [...tarefas] : tarefas.filter(t => t.categoria === categoria);

  if (ordenacao === 'priority') {
    filtradas.sort((a, b) => ordemPrioridade[a.prioridade] - ordemPrioridade[b.prioridade]);
  } else if (ordenacao === 'date') {
    filtradas.sort((a, b) => new Date(a.data) - new Date(b.data));
  }

  return filtradas;
}

function atualizarContadores() {
  contadorPendentes.textContent = tarefas.filter(t => !t.concluida).length;
  contadorConcluidas.textContent = tarefas.filter(t => t.concluida).length;
}

function criarCard(tarefa) {
  const card = document.createElement('div');
  card.className = `task-card${tarefa.concluida ? ' done' : ''}`;
  card.dataset.id = tarefa.id;

  card.innerHTML = `
    <div class="task-main">
      <span class="task-name">${tarefa.nome}</span>
      <div class="task-meta">
        <span class="tag">${tarefa.categoria}</span>
        <span class="priority-badge ${tarefa.prioridade.toLowerCase()}">${tarefa.prioridade}</span>
      </div>
      <span class="task-date">⏳ ${formatarData(tarefa.data)}</span>
    </div>
    <div class="task-actions">
      <button class="btn-action check" title="Marcar como concluída">${tarefa.concluida ? '↩' : '✓'}</button>
      <button class="btn-action delete" title="Excluir tarefa">✕</button>
    </div>
    <div class="priority-bar ${tarefa.prioridade.toLowerCase()}"></div>
  `;

  card.querySelector('.check').addEventListener('click', () => alternarConcluida(tarefa.id));
  card.querySelector('.delete').addEventListener('click', () => excluirTarefa(tarefa.id));

  return card;
}

function renderizar() {
  const filtradas = obterFiltradas();

  listaTarefas.innerHTML = '';

  if (filtradas.length === 0) {
    listaTarefas.appendChild(estadoVazio);
    estadoVazio.style.display = 'flex';
  } else {
    estadoVazio.style.display = 'none';
    filtradas.forEach(tarefa => listaTarefas.appendChild(criarCard(tarefa)));
  }

  atualizarContadores();
}

botaoAdicionar.addEventListener('click', adicionarTarefa);

inputNome.addEventListener('keydown', e => {
  if (e.key === 'Enter') adicionarTarefa();
});

filtroCategoria.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', () => {
    filtroCategoria.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    renderizar();
  });
});

filtroOrdenacao.addEventListener('change', renderizar);

renderizar();