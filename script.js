let partidas = [];
let partidaAtual = 0; // Inicializa com 0
let totalPartidas = 0; // Variável para armazenar o total de partidas

// Carrega o arquivo JSON com as partidas
fetch('partidas.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na rede: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        partidas = data.partidas;
        totalPartidas = partidas.length; // Armazena o total de partidas
        partidaAtual = totalPartidas - 1; // Define partidaAtual como a última partida
        atualizarClassificacao();
        mostrarResultados(partidaAtual);
    })
    .catch(error => {
        console.error('Erro ao carregar o arquivo JSON:', error);
    });

// Atualiza a classificação geral
function atualizarClassificacao() {
    const tabela = document.querySelector('#classificacao tbody');
    tabela.innerHTML = ''; // Limpa a tabela antes de atualizar
    const classificacao = calcularClassificacao();

    classificacao.forEach((dupla, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${dupla.dupla}</td>
            <td>${dupla.kills}</td>
            <td>${dupla.pontuacao}</td>
        `;
        tabela.appendChild(row);
    });
}

// Calcula a classificação com base nos resultados das partidas
function calcularClassificacao() {
    const duplas = {};

    partidas.forEach(partida => {
        partida.resultados.forEach(result => {
            if (!duplas[result.dupla]) {
                duplas[result.dupla] = { kills: 0, pontuacao: 0 };
            }
            duplas[result.dupla].kills += result.kills; // Soma kills
            duplas[result.dupla].pontuacao += calcularPontuacao(partida.vencedor, result.dupla); // Soma pontuação
        });
    });

    return Object.entries(duplas).map(([dupla, stats]) => ({
        dupla,
        kills: stats.kills,
        pontuacao: stats.pontuacao,
    })).sort((a, b) => b.pontuacao - a.pontuacao); // Ordena por pontuação
}

// Calcula a pontuação com base na posição e na vitória
function calcularPontuacao(vencedor, dupla) {
    const posicoes = {
        1: 10,
        2: 8,
        3: 6,
        4: 4,
        5: 2,
    };

    // Retorna a pontuação baseada na posição se a dupla venceu
    return (vencedor === dupla) ? posicoes[1] : 0; // Exemplo simples para pontuação da vitória
}

// Mostra os resultados da partida atual
function mostrarResultados(index) {
    const resultados = partidas[index].resultados;
    const tabelaResultados = document.querySelector('#resultados tbody');
    const mapName = document.querySelector('#mapName');

    tabelaResultados.innerHTML = ''; // Limpa a tabela antes de atualizar
    mapName.textContent = `Mapa: ${partidas[index].map}`; // Exibe o nome do mapa

    resultados.forEach((result, position) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${position + 1}</td>
            <td>${result.dupla}</td>
            <td>${result.kills}</td>
            <td>${calcularPontuacao(partidas[index].vencedor, result.dupla)}</td>
        `;
        tabelaResultados.appendChild(row);
    });

    // Atualiza informações da partida
    document.querySelector('#partidaInfo').textContent = `Partida ${index + 1} de ${totalPartidas}`;
    document.querySelector('#prevButton').disabled = index === 0; // Desabilita botão anterior se for a primeira partida
    document.querySelector('#nextButton').disabled = index === totalPartidas - 1; // Desabilita botão seguinte se for a última partida
}

// Eventos para os botões de navegação
document.querySelector('#prevButton').addEventListener('click', () => {
    if (partidaAtual > 0) {
        partidaAtual--;
        mostrarResultados(partidaAtual); // Atualiza os resultados para a partida anterior
    }
});

document.querySelector('#nextButton').addEventListener('click', () => {
    if (partidaAtual < totalPartidas - 1) {
        partidaAtual++;
        mostrarResultados(partidaAtual); // Atualiza os resultados para a próxima partida
    }
});
