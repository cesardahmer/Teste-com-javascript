// Seleciona todos os elementos de célula e o status do jogo
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartButton = document.getElementById('restart-button');

// Array para armazenar o estado do tabuleiro (vazio, X ou O)
let gameBoard = ['', '', '', '', '', '', '', '', ''];
// Variável para rastrear o jogador atual
let currentPlayer = 'X';
// Variável para verificar se o jogo está ativo
let isGameActive = true;
// Define o jogador do computador
const computerPlayer = 'O';

// Combinações de vitória (índices das células)
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Função para lidar com o clique em uma célula
function handleCellClick(e) {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    // Impede que o jogador humano jogue na vez do computador
    if (gameBoard[clickedCellIndex] !== '' || !isGameActive || currentPlayer === computerPlayer) {
        return;
    }

    // Processa a jogada do jogador humano
    updateBoard(clickedCellIndex, currentPlayer);
    
    // Checa se o jogador atual venceu ou se houve um empate
    checkForWinner();
    
    // Se o jogo continuar ativo, é a vez do computador
    if (isGameActive) {
        // Usa um pequeno delay para a jogada do computador parecer mais natural
        setTimeout(computerMove, 500); 
    }
}

// Função que simula a jogada do computador
function computerMove() {
    let move = getBestMove();
    if (move !== -1) {
        updateBoard(move, computerPlayer);
        checkForWinner();
    }
}

// Função que determina a melhor jogada para o computador
function getBestMove() {
    // 1. Checa se o computador pode vencer na próxima jogada
    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
            let tempBoard = [...gameBoard];
            tempBoard[i] = computerPlayer;
            if (checkWinning(tempBoard, computerPlayer)) {
                return i;
            }
        }
    }

    // 2. Checa se o jogador humano pode vencer na próxima jogada e bloqueia
    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
            let tempBoard = [...gameBoard];
            tempBoard[i] = 'X';
            if (checkWinning(tempBoard, 'X')) {
                return i;
            }
        }
    }

    // 3. Tenta pegar o centro
    if (gameBoard[4] === '') {
        return 4;
    }

    // 4. Tenta pegar um dos cantos
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(index => gameBoard[index] === '');
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // 5. Tenta pegar uma das bordas
    const edges = [1, 3, 5, 7];
    const availableEdges = edges.filter(index => gameBoard[index] === '');
    if (availableEdges.length > 0) {
        return availableEdges[Math.floor(Math.random() * availableEdges.length)];
    }

    return -1; // Sem jogada disponível
}

// Função auxiliar para verificar se um jogador venceu em um tabuleiro temporário
function checkWinning(board, player) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] === player && board[b] === player && board[c] === player) {
            return true;
        }
    }
    return false;
}

// Função para atualizar o tabuleiro (interface e array)
function updateBoard(index, player) {
    gameBoard[index] = player;
    const cellElement = cells[index];
    cellElement.classList.add(player.toLowerCase());
    cellElement.textContent = player;
}

// Função para checar por uma condição de vitória ou empate
function checkForWinner() {
    if (checkWinning(gameBoard, currentPlayer)) {
        statusText.textContent = `Jogador ${currentPlayer} venceu!`;
        isGameActive = false;
        return;
    }

    // Checa por empate (se todas as células estão preenchidas)
    if (!gameBoard.includes('')) {
        statusText.textContent = 'Empate!';
        isGameActive = false;
        return;
    }

    // Se ninguém venceu, troca o jogador
    changePlayer();
}

// Função para alternar o jogador
function changePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    
    if (currentPlayer === 'X') {
        statusText.textContent = `Vez do Jogador X`;
    } else {
        statusText.textContent = `Vez do Computador`;
    }
}

// Função para reiniciar o jogo
function restartGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    isGameActive = true;
    statusText.textContent = `Vez do Jogador X`;

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
}

// Adiciona os event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
