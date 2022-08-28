
var player_move = null; // 1 = rock, 2 = paper, 3 = scissors
var games_played = 0;
var games_won = 0;
var games_lost = 0;

const net = new brain.recurrent.LSTMTimeStep();
data = [1, 2];


// Ran once when the sketch is loaded
function setup() {
    var canvas = createCanvas(windowWidth, windowHeight);
}

// Ran every time the sketch is redrawn
function draw() {
    background(50);
}

function play_round() {
    data.push(player_move);

    if (data.length > 10) {
        data.shift();
    }

    console.log(data);

    net.train(
        [data],
        { iterations: 100, log: true }
    );

    result = net.run(data);
    console.log(result);
}

function keyPressed() {
    switch (key) {
        case '1':
            player_move = 1;
            break;
        case '2':
            player_move = 2;
            break;
        case '3':
            player_move = 3;
            break;
    }

    play_round();
  }