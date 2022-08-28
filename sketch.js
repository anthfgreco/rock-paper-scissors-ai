var games_played = 0;
var games_won = 0;
var games_lost = 0;
var games_tied = 0;

var max_memory_size = 15;
var agent_move = 1;
const net = new brain.recurrent.LSTMTimeStep();
data = [1, 2, 3];  // 1 = rock, 2 = paper, 3 = scissors

// converts the predicted player move to agent move
const convert_to_agent_move = {
    1: 2,
    2: 3,
    3: 1
}

function keyPressed() {
    switch (key) {
        case '1':
            player_move = 1;
            play_round(player_move);
            break;
        case '2':
            player_move = 2;
            play_round(player_move);
            break;
        case '3':
            player_move = 3;
            play_round(player_move);
            break;
    }
}

// Add event listener on keydown
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case '1':
            player_move = 1;
            play_round(player_move);
            break;
        case '2':
            player_move = 2;
            play_round(player_move);
            break;
        case '3':
            player_move = 3;
            play_round(player_move);
            break;
    }
  }, false);


function play_round(player_move) {
    if (agent_move == player_move) {
        console.log('Tie!');
        games_tied++;
    }
    else if ((agent_move == 1 && player_move == 2) || (agent_move == 2 && player_move == 3) || (agent_move == 3 && player_move == 1)) {
        console.log('You win!');
        games_won++;
    }
    else {
        console.log('You lose!')
        games_lost++;;
    }

    games_played++;

    agent_move = predict_move(player_move);
    agent_move = Math.round(agent_move)
    agent_move = convert_to_agent_move[agent_move];
    console.log("games played: " + games_played, "games won: " + games_won, "games lost: " + games_lost, "games tied: " + games_tied);
}

function predict_move(player_move) {
    data.push(player_move);

    if (data.length > max_memory_size) {
        data.shift();
    }

    console.log(data);

    net.train(
        [data],
        { iterations: 100, log: false }
    );

    return net.run(data); // returns predicted move, will be a float in range of 1-3, occasionly 4
}
