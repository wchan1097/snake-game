import * from "./node_modules/jquery/dist/jquery";

var score = 0;
var time = 0;
var start = false;
var playerTop = 50;
var playerLeft = 50;
var currentDirection = "";
var itemTop = 0;
var itemLeft = 0;
var snakeList = [];

var checkBodyCollision = function (point) {
    for (var i = 1; i < snakeList.length; i++) {
        if (JSON.stringify(snakeList[i]) == JSON.stringify(point)) {
            return true;
        }
    }
    return false;
}

function placeFood() {
    var item = document.createElement("div");
    itemTop = (Math.random() * 95) + 5;
    itemLeft = (Math.random() * 95) + 5;
    item.setAttribute("id", "food");
    itemTop = itemTop - (itemTop % 5);
    itemLeft = itemLeft - (itemLeft % 5);
    $("#background").append(item);
    $("#food").css({ top: `${itemTop}%` });
    $("#food").css({ left: `${itemLeft}%` });
}

$(document).ready(() => {
    $("#player").css({ top: `${playerTop}%` });
    $("#player").css({ left: `${playerLeft}%` });
    $("#score").text(`Score: ${score}`);
    $("#time").text(`Time Played: ${time} Seconds`);
    $("#start").click(() => {
        startGame();
    });
    $(document).keydown((event) => {
        startGame();
    })
});

function startGame(){
    if (event.code == "Enter") {
        if (document.getElementById("food") != null) {
            $("#food").remove();
        }
        start = (start == true) ? false : true;
        console.log("Game Start!");
        placeFood();
        while (checkBodyCollision([itemTop, itemLeft])) {
            $("#food").remove();
            placeFood();
            console.log("Moving Food");
        }
        document.getElementById("start").disabled = true;
    }
}

$(document).keydown((event) => {
    if (start == true) {
        var key = event.code.charAt(event.code.length - 1);
        if ((key == "W") && (currentDirection != "Down")) {
            currentDirection = "Up";
        }
        else if ((key == "A") && (currentDirection != "Right")) {
            currentDirection = "Left";
        }
        else if ((key == "S") && (currentDirection != "Up")) {
            currentDirection = "Down";
        }
        else if ((key == "D") && (currentDirection != "Left")) {
            currentDirection = "Right";
        }
    }
});

setInterval(() => {
    if (start == true) {
        time += 1;
        $("#time").text(`Time Played: ${time} Seconds`);
    }
}, 1000);

setInterval(() => {
    if (start) {
        var playerCollision = ((playerTop == itemTop) && (playerLeft == itemLeft));
        if (playerCollision) {
            $("#food").remove();
            score++;
            placeFood();
            $("#score").text(`Score: ${score}`);
            var node = document.createElement("div");
            node.setAttribute("id", "segment" + score);
            node.classList.add("segment");
            $("#background").append(node);
        }
        while (checkBodyCollision([itemTop, itemLeft])) {
            $("#food").remove();
            placeFood();
            console.log("Moving Food");
        }
        var topCheck = (playerTop < 100) && (playerTop > 0);
        var leftCheck = (playerLeft < 100) && (playerLeft > 0);
        if ((topCheck == true) && (leftCheck == true)) {
            previousHeadLocation = [playerTop, playerLeft];
            switch (currentDirection) {
                case ("Up"):
                    playerTop -= 5;
                    break;
                case ("Down"):
                    playerTop += 5;
                    break;
                case ("Left"):
                    playerLeft -= 5;
                    break;
                case ("Right"):
                    playerLeft += 5;
                    break;
            }
            $("#player").css({ left: `${playerLeft}%` });
            $("#player").css({ top: `${playerTop}%` });

            snakeList.unshift([playerTop, playerLeft]);
            while (snakeList.length - 1 > score) {
                snakeList.pop();
            }

            if (checkBodyCollision([playerTop, playerLeft])) {
                console.log("Game Ended!");
                start = false;
                $("#death-screen").show();
                $("#death-score").text(`Score: ${score}`);
                $("#death-time").text(`Time Alive: ${time} Seconds`);
            }

            for (var count = 1; count < snakeList.length; count++) {
                var segmentID = $("#segment" + count).attr("id");
                $("#" + segmentID).css({ top: `${snakeList[count][0]}%` });
                $("#" + segmentID).css({ left: `${snakeList[count][1]}%` });
            }
        }
        else {
            console.log("Game Ended!");
            start = false;
            $("#death-screen").show();
            $("#death-score").text(`Score: ${score}`);
            $("#death-time").text(`Time Alive: ${time} Seconds`);
        }
    }
}, 100);

$("#restart").click(() => {
    if (document.getElementById("food") == null) {
        $("#food").remove();
    }
    $(".segment").remove();
    snakeList = [];
    score = 0;
    time = 0;
    playerLeft = 50;
    playerTop = 50;
    currentDirection = "";
    $("#player").css({ left: `${playerLeft}%` });
    $("#player").css({ top: `${playerTop}%` });
    $("#start").text("Start");
    $("#food").remove();
    $("#death-screen").hide();
    document.getElementById("start").disabled = false;
});