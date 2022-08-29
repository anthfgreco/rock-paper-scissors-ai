var games_played = 0;
var games_won = 0;
var games_lost = 0;
var games_tied = 0;

var memory_size = 10;
var agent_move = 1;
var net = new brain.recurrent.LSTMTimeStep();
data = [1, 2];  
// 1 = rock, 2 = paper, 3 = scissors

function play_round(player_move) {
    // Shows which move the agent has chosen
    if (agent_move == 1) {
        $( "#agent-rock-div" ).show();
        $( "#agent-paper-div" ).hide();
        $( "#agent-scissors-div" ).hide();
    }
    if (agent_move == 2) {
        $( "#agent-rock-div" ).hide();
        $( "#agent-paper-div" ).show();
        $( "#agent-scissors-div" ).hide();
    }
    if (agent_move == 3) {
        $( "#agent-rock-div" ).hide();
        $( "#agent-paper-div" ).hide();
        $( "#agent-scissors-div" ).show();
    }

    // Rock paper scissors logic
    if (agent_move == player_move) {
        $( "#result-p" ).text("Tie!");
        console.log('Tie!');
        games_tied++;
        $( "#games-tied-div" ).text("Games Tied: " + games_tied);
    }
    else if ((agent_move == 1 && player_move == 2) || (agent_move == 2 && player_move == 3) || (agent_move == 3 && player_move == 1)) {
        $( "#result-p" ).text("You win!");
        console.log('You win!');
        games_won++;
        $( "#games-won-div" ).text("Games Won: " + games_won);
    }
    else {
        $( "#result-p" ).text("You lose!");
        console.log('You lose!')
        games_lost++;;
        $( "#games-lost-div" ).text("Games Lost: " + games_lost);
    }

    games_played++;

    predicted_player_move = predict_move(player_move);
    agent_move = convert_to_agent_move(predicted_player_move);
    console.log("games played: " + games_played, "\ngames won: " + games_won, "\ngames lost: " + games_lost, "\ngames tied: " + games_tied);
}

function predict_move(player_move) {
    data.push(player_move);

    // if the data size is greater than the memory size, remove the oldest data
    if (data.length > memory_size) {
        // data.shift();
        // Using shift does not reduce the size of the memory data when the user reduces the size of the memory, so I used splice
        data = data.splice(data.length-memory_size, data.length - 1);
    }

    console.log('memory:', data);

    net.train(
        [data],
        { iterations: 100, log: false }
    );

    return net.run(data); // returns predicted move, will be a float in range of 1-3
}

// Converts the predicted player move to agent move
// Ex. if the neural net predicts the user will pick 1 (rock), the function will return 2 (paper)
function convert_to_agent_move(user_move) {
    console.log(user_move)
    user_move = Math.round(user_move);
    if (user_move == 1) {
        return 2;
    }
    if (user_move == 2) {
        return 3;
    }
    else {
        return 1;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Listeners
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Shows value of memory size beside slider, resets neural net to delete old weights for new memory size
var memory_size_slider = document.getElementById("memory-size-slider");
memory_size_slider.addEventListener("change", (event) => {
    net = new brain.recurrent.LSTMTimeStep();
    memory_size = memory_size_slider.value;
});

// Keyboard functionality to play game
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
});

// Allows user to click images to play game
$( "#rock-div" ).click(function() {
    player_move = 1;
    play_round(player_move);
});

$( "#paper-div" ).click(function() {
    player_move = 2;
    play_round(player_move);
});

$( "#scissors-div" ).click(function() {
    player_move = 3;
    play_round(player_move);
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
