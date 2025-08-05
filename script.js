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
    gameBoard[clickedCellIndex] = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());
    clickedCell.textContent = currentPlayer;

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
    // Encontra todas as células vazias
    const emptyCells = gameBoard.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
    
    // Se houver células vazias, o computador escolhe uma aleatoriamente
    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const computerMoveIndex = emptyCells[randomIndex];
        
        // Simula o clique na célula escolhida
        const cellElement = cells[computerMoveIndex];
        
        gameBoard[computerMoveIndex] = computerPlayer;
        cellElement.classList.add(computerPlayer.toLowerCase());
        cellElement.textContent = computerPlayer;
        
        checkForWinner();
    }
}

// Função para checar por uma condição de vitória ou empate
function checkForWinner() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        const a = gameBoard[winCondition[0]];
        const b = gameBoard[winCondition[1]];
        const c = gameBoard[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }

        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
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
