let partidas = [];
let currentPartida = 0;

async function loadData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/andreflp2/camp/main/data.json');
        const data = await response.json();
        partidas = data.partidas;

        // Iniciar na última partida
        currentPartida = partidas.length - 1;

        updateTable();
        updateClassificacao();
        updatePartidaInfo();
        updateNavigationButtons();
    } catch (error) {
        displayError("Erro ao carregar os dados.");
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
            <td>${item.posicao === 1 ? 1 : 0}</td>
            <td>${item.kills}</td>
            <td>${calculatePontuacao(item.posicao, item.kills)}</td>
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
            <td>${item.vitórias}</td>
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
    document.getElementById('next-button').disabled = currentPartida === partidas.length - 1;
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

document.addEventListener('DOMContentLoaded', loadData);
