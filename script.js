// Variáveis globais
let partidas = [];
let currentPartida = 0;

// -------------------------
// Lógica do Campeonato
// -------------------------

// Função para carregar dados do campeonato
async function loadData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/andreflp2/pubg_camp/refs/heads/main/data.json'); // URL do JSON
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const data = await response.json();
        partidas = data.partidas;

        if (partidas.length === 0) {
            displayError("Não há dados disponíveis.");
            toggleNavigationButtons(false);
            return;
        }

        currentPartida = 0;

        updateTable();
        updateClassificacao();
        updatePartidaInfo();
        updateNavigationButtons();
        toggleNavigationButtons(true);
    } catch (error) {
        displayError("Erro ao carregar os dados: " + error.message);
    }
}

// Função para atualizar a tabela de resultados da partida atual
function updateTable() {
    const tbody = document.getElementById('resultados-body');
    tbody.innerHTML = '';

    const partida = partidas[currentPartida].resultados;
    partida.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.dupla}</td>
            <td>${item.kills}</td>
        `;
        tbody.appendChild(row);
    });
}

// Função para calcular a pontuação com base na posição e nas kills
function calculatePontuacao(posicao, kills) {
    const pontosPorPosicao = [0, 10, 8, 6, 4, 2];
    return (pontosPorPosicao[posicao] || 0) + kills;
}

// Função para atualizar a classificação geral
function updateClassificacao() {
    const tbody = document.getElementById('classificacao-body');
    tbody.innerHTML = '';

    const classificacao = {};

    partidas.forEach(partida => {
        partida.resultados.forEach(item => {
            if (!classificacao[item.dupla]) {
                classificacao[item.dupla] = { vitórias: 0, kills: 0, pontuacao_total: 0 };
            }
            classificacao[item.dupla].vitórias += item.posicao === 1 ? 1 : 0;
            classificacao[item.dupla].kills += item.kills;
            classificacao[item.dupla].pontuacao_total += calculatePontuacao(item.posicao, item.kills);
        });
    });

    const sortedClassificacao = Object.entries(classificacao)
        .map(([dupla, stats]) => ({ dupla, ...stats }))
        .sort((a, b) => b.pontuacao_total - a.pontuacao_total);

    sortedClassificacao.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.dupla}</td>
            <td>${item.kills}</td>
            <td>${item.pontuacao_total}</td>
        `;
        tbody.appendChild(row);
    });
}

// Função para atualizar informações da partida atual
function updatePartidaInfo() {
    const partidaInfo = document.getElementById('partida-info');
    partidaInfo.textContent = `Partida ${currentPartida + 1} de ${partidas.length}`;
}

// Função para atualizar os botões de navegação
function updateNavigationButtons() {
    document.getElementById('prev-button').disabled = currentPartida === 0;
    document.getElementById('next-button').disabled = currentPartida === partidas.length - 1;
}

function toggleNavigationButtons(show) {
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    prevButton.style.display = show ? 'inline-block' : 'none';
    nextButton.style.display = show ? 'inline-block' : 'none';
}

// Função para mudar de partida
function changePartida(direction) {
    currentPartida += direction;
    updateTable();
    updatePartidaInfo();
    updateNavigationButtons();
}

// Adicionando eventos de clique aos botões de navegação
document.getElementById('prev-button').addEventListener('click', () => changePartida(-1));
document.getElementById('next-button').addEventListener('click', () => changePartida(1));

function displayError(message) {
    alert(message);
}

// -------------------------
// Lógica da Arrecadação
// -------------------------

// Evento para abrir e fechar o modal de arrecadação
const widgetModal = document.getElementById('widgetModal');
const openWidgetBtn = document.getElementById('openWidgetBtn');
const closeWidgetBtn = document.getElementsByClassName('close')[0];

// Função para abrir o modal
openWidgetBtn.onclick = function() {
    widgetModal.style.display = "block";
};

// Função para fechar o modal
closeWidgetBtn.onclick = function() {
    widgetModal.style.display = "none";
};

// Fechar o modal se o usuário clicar fora do conteúdo
window.onclick = function(event) {
    if (event.target === widgetModal) {
        widgetModal.style.display = "none";
    }
};

// Carregar dados ao iniciar
document.addEventListener('DOMContentLoaded', loadData);
