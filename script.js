let partidas = [];
let currentPartida = 0;

async function loadData() {
    try {
        const response = await fetch('data.json'); // Caminho para o arquivo JSON
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`); // Lança um erro se a resposta não for 200
        }
        const data = await response.json();
        partidas = data.partidas;

        if (partidas.length === 0) {
            displayError("Não há dados disponíveis."); // Exibe mensagem se não houver partidas
            toggleNavigationButtons(false); // Oculta os botões se não houver partidas
            return;
        }

        // Iniciar na primeira partida
        currentPartida = 0;

        updateTable();
        updateClassificacao();
        updatePartidaInfo();
        updateNavigationButtons();
        toggleNavigationButtons(true); // Exibe os botões se houver partidas
    } catch (error) {
        displayError("Erro ao carregar os dados: " + error.message); // Exibe a mensagem de erro
    }
}

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

function calculatePontuacao(posicao, kills) {
    const pontosPorPosicao = [0, 10, 8, 6, 4, 2]; // Pontuação por posição
    return (pontosPorPosicao[posicao] || 0) + kills; // Adiciona kills ao total de pontos
}

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

function updatePartidaInfo() {
    const partidaInfo = document.getElementById('partida-info');
    partidaInfo.textContent = `Partida ${currentPartida + 1} de ${partidas.length}`;
}

function updateNavigationButtons() {
    document.getElementById('prev-button').disabled = currentPartida === 0;
    document.getElementById('next-button').disabled = currentPartida === partidas.length - 1; // Desativa se houver apenas uma partida
}

function toggleNavigationButtons(show) {
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    prevButton.style.display = show ? 'inline-block' : 'none';
    nextButton.style.display = show ? 'inline-block' : 'none';
}

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

// Carregar dados ao iniciar
document.addEventListener('DOMContentLoaded', loadData);
