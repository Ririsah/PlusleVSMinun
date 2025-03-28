// ***** -------- Vars -------- *****
let data1 = document.querySelectorAll('.data1');
let data2 = document.querySelectorAll('.data2');

let hiddenStyle = document.querySelectorAll('.hidden');
let diceImageDisplay = document.querySelector('.dice_image');
let diceResultDisplay = document.querySelectorAll('.dice_result_display span');

let player1 = document.querySelector('.player_1');
let player2 = document.querySelector('.player_2');
let scorePlayer1 = document.querySelector('.score_player_1');
let scorePlayer2 = document.querySelector('.score_player_2');

let containerPlusle = document.querySelector('.container_2');
let containerMinun = document.querySelector('.container_4');

let isplaying, currentPlayer, scoreP1, scoreP2, totalScoreP1, totalScoreP2;



// ***** -------- Sound Effects -------- *****
let btnReset = new Audio("/src/assets/sfx/btn_reset.mp3");
let btnHoldRoll = new Audio("/src/assets/sfx/btn_roll_hold.mp3");
let finish = new Audio("/src/assets/sfx/finish.mp3");
let missPoints = new Audio("/src/assets/sfx/miss_points.mp3");
let gameTheme = new Audio("/src/assets/sfx/game_theme.mp3");

gameTheme.loop = true;
gameTheme.volume = 0.1;


// ***** -------- Functional Functions -------- *****
const init = function () {
    isplaying = true;
    currentPlayer = 1;
    scoreP1 = 0;
    scoreP2 = 0;
    totalScoreP1 = 0;
    totalScoreP2 = 0;
}

// troca de player ativo
const switchActivePlayer = function() {
    if (currentPlayer === 1) {
        currentPlayer = 2;
        changeCharactersExpressions('container_4_2', 'minun_1');
        changeCharactersLines('minun_lines', 'N-now I got this! ...I guess...');
    } else {
        currentPlayer = 1;
        changeCharactersExpressions('container_2_2', 'plusle_1');
        changeCharactersLines('plusle_lines', "GOAT's turn now!");
    }
}

// troca as classes do player ativo
const switchActivePlayerClass = function (NodeList, className) {
    NodeList.forEach(element => {
        element.classList.toggle(className);
    });
}

// soma o score total do player
const updateTotalScore = function (totalScore, diceValue) {
    totalScore += diceValue; 
    document.querySelector('.total_score').textContent = `${totalScore}`;
    return totalScore;
}; 

// atualiza o score com o score total acumulado
const updateHoldScore = function (holdScore) {
    document.querySelector('.hold_score').textContent = `${holdScore}`;
    document.querySelector('.total_score').textContent = 0;
}

// reseta o display
const resetDisplay = function(NodeList) {
    NodeList.forEach(element => {
        element.textContent = 0;
    });
}

// muda as expressoes dos personagens
const changeCharactersExpressions = function (className, img) {
    document.querySelector(`.${className}`).style.background = `url("src/assets/images/${img}.png") center / cover`;
}

// muda as falas dos personagens
//const changeCharactersLines = function (className, string) {
 //   document.querySelector(`.${className}`).innerHTML = `${string}`
//}

const changeCharactersLines = function (className, text) {
    const textElement = document.querySelector(`.${className}`);
    let index = 0;
    let typingTimeout;

    textElement.textContent = ""; 

    function typeText() {
        if (index < text.length) {
            textElement.textContent += text[index];
            index++;
            typingTimeout = setTimeout(typeText, 10);
        }
    }
    typeText();

    return typingTimeout;
};

init();



// ***** -------- Game Function -------- *****
// roda o dado somando os valores obtidos de cada player
document.querySelector('.roll_btn').addEventListener('click', function () {
    btnHoldRoll.play();
    if (isplaying) {
        gameTheme.play();
        let diceValue = Math.trunc(Math.random() * 6) + 1;
        diceResultDisplay.forEach(element => {
            element.textContent = diceValue;
        });
        diceImageDisplay.src = `src/assets/images/d_${diceValue}.png`
        
        // caso o resultado do dado seja igual a 1
        if (diceValue === 1) {
            missPoints.play();
            if (currentPlayer === 1) {
                scoreP1 = 0;
                totalScoreP1 = 0;
                changeCharactersExpressions('container_2_2', 'plusle_3');
                changeCharactersLines('plusle_lines', 'WHAT?!!');
            } else {
                scoreP2 = 0;
                totalScoreP2 = 0;
                changeCharactersExpressions('container_4_2', 'minun_3');
                changeCharactersLines('minun_lines', 'Oh no- S-SORRY!');
            }
            
            document.querySelector('.hold_score').textContent = 0;
            document.querySelector('.total_score').textContent = 0;
            switchActivePlayerClass(hiddenStyle, 'active_player');
            switchActivePlayerClass(data1, 'hold_score');
            switchActivePlayerClass(data2, 'total_score');
            switchActivePlayer();
        } 
        
        // caso o resultado do dado seja  diferente de 1
        if (diceValue !== 1) {
            if (currentPlayer === 1) {
                scoreP1 = updateTotalScore(scoreP1, diceValue);
            } else {
                scoreP2 = updateTotalScore(scoreP2, diceValue);
            }
        }
    }    
});


// passa para o proximo player armazenando o score acumulado
document.querySelector('.hold_btn').addEventListener('click', function () {
    btnHoldRoll.play();
    if (isplaying) {
        let totalScore = currentPlayer === 1 ? totalScoreP1 : totalScoreP2;
        let score = currentPlayer === 1 ? scoreP1 : scoreP2;

        totalScore += score;
        updateHoldScore(totalScore);

        if (currentPlayer === 1) {
            totalScoreP1 = totalScore;
            scoreP1 = 0;
            changeCharactersExpressions('container_2_2', 'plusle_2');
            changeCharactersLines('plusle_lines', 'And I rise to shine again!');
        } else {
            totalScoreP2 = totalScore;
            scoreP2 = 0;
            changeCharactersExpressions('container_4_2', 'minun_2');
            changeCharactersLines('minun_lines', "It wasn't bad after all!");
        }

        // caso a soma de pontos seja maior ou igual a 50 o jogo termina
        if (totalScore >= 50) {
            gameTheme.pause();
            finish.play();
            isplaying = false;
            if (currentPlayer === 1) {
                changeCharactersExpressions('container_2_2', 'plusle_2');
                changeCharactersLines('plusle_lines', 'EASY!');
                changeCharactersExpressions('container_4_2', 'minun_4');
                changeCharactersLines('minun_lines', 'I-i... i... Sorry T-T');
            } else {
                changeCharactersExpressions('container_2_2', 'plusle_4');
                changeCharactersLines('plusle_lines', 'Are you serious?');
                changeCharactersExpressions('container_4_2', 'minun_2');
                changeCharactersLines('minun_lines', 'I actually did it? Omg, I really did it!');
            }
        // se nao, ele continua ate um dos dois acumular 50
        } else {
            switchActivePlayerClass(hiddenStyle, 'active_player');
            switchActivePlayerClass(data1, 'hold_score');
            switchActivePlayerClass(data2, 'total_score');
            switchActivePlayer();
        }
        
    }
});


// reseta todo o jogo voltando para o player 1
document.querySelector('.reset_btn').addEventListener('click', function () {
    btnReset.play();
    gameTheme.currentTime = 0;
    gameTheme.play();

    containerPlusle.classList.add('active_player');
    player1.classList.add('hold_score');
    scorePlayer1.classList.add('total_score');
    
    containerMinun.classList.remove('active_player');
    player2.classList.remove('hold_score');
    scorePlayer2.classList.remove('total_score');

    changeCharactersExpressions('container_2_2', 'plusle_1');
    changeCharactersLines('plusle_lines', 'One more round, one more victory!');

    changeCharactersExpressions('container_4_2', 'minun_1');
    changeCharactersLines('minun_lines', "Fine, I'll try once more.");
    

    resetDisplay(data1);
    resetDisplay(data2);

    init();

    diceResultDisplay.forEach(element => {
        element.textContent = 0;
    });
    diceImageDisplay.src = `./assets/images/d_1.png`
});






