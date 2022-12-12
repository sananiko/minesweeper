var map = {
    width: 0, //Max: 40, Min: 1 //Easy: 10, Medium: 20, Hard: 40
    height: 0, //Max: 30, Min: 1 //Easy: 5, Medium: 10, Hard: 30
    bombNum: 0,                  //Easy: 2, Medium: 15, Hard: 200
    colors: {
        1: 'blue',
        2: 'green',
        3: 'red',
        4: 'purple',
        5: 'maroon',
        6: 'turquoise',
        7: 'black',
        8: 'grey'
    },
    layout: null,
    clickCount: 0,
    win: false
};

function startGame(difficulity){
    //reset
    document.getElementById("lost").style.visibility = "hidden";
    document.getElementById("field").textContent = null;
    map.clickCount = 0;
    map.win = false;
    if(difficulity == 'easy'){
        map.width = 10;
        map.height = 5;
        map.bombNum = 6;
    }
    else if(difficulity == 'medium'){
        map.width = 20;
        map.height = 10;
        map.bombNum = 30;
    }
    else if(difficulity == 'hard'){
        map.width = 40;
        map.height = 30;
        map.bombNum = 240;
    }
    map.layout = new Array(map.height);
    for(let i = 0; i < map.height; i++){
        map.layout[i] = new Array(map.width);
    }
    for(let i = 0; i < map.height; i++){
        for(let j = 0; j < map.width; j++){
            map.layout[i][j] = 0;
        }
    }
    mapGeneration();
    document.getElementById('field').appendChild(createButtons());
}

function mapGeneration(){
    let count = 1;
    while(true){
        var bombRow, bombCol;
        bombRow = Math.floor(Math.random() * map.height);
        bombCol = Math.floor(Math.random() * map.width);
        if(map.layout[bombRow][bombCol] == -1){
            continue;
        }
        else{
            map.layout[bombRow][bombCol] = -1;
            var upperAndLower = {
                upperRow: 0,
                lowerRow: 0,
                upperCol: 0,
                lowerCol: 0
            };
            decideUpperAndLower(upperAndLower, bombRow, bombCol);
            for(let i = upperAndLower.lowerRow; i <= upperAndLower.upperRow; i++){
                for(let j = upperAndLower.lowerCol; j <= upperAndLower.upperCol; j++){
                    if(map.layout[i][j] != -1)
                        map.layout[i][j]++;
                }
            }
        }
        if(count >= map.bombNum){
            break;
        }
        count++;
    }
    return;
}
function leftClick(button){
    button.clicked = true;
    button.style.backgroundColor = 'lightGrey';
    map.clickCount++;
    row = Number(button.id.substring(0,button.id.indexOf(",")));
    col = Number(button.id.substring(button.id.indexOf(",")+1,button.id.length));
    if(map.layout[row][col] > 0){
        button.style.color = map.colors[map.layout[row][col]];
        button.textContent = map.layout[row][col];
        if(map.clickCount >= (map.width*map.height-map.bombNum) && map.win == false)
            winGame(button);
    }
    else if(map.layout[row][col] == 0){
        var upperAndLower = {
            upperRow: 0,
            lowerRow: 0,
            upperCol: 0,
            lowerCol: 0
        }
        decideUpperAndLower(upperAndLower ,row, col);
        for(let i = upperAndLower.lowerRow; i <= upperAndLower.upperRow; i++){
            for(let j = upperAndLower.lowerCol; j <= upperAndLower.upperCol; j++){
                if(!document.getElementById(i+','+j).clicked)
                    leftClick(document.getElementById(i+','+j));
            }
        }
        if(map.clickCount >= (map.width*map.height-map.bombNum) && map.win == false)
            winGame(button);
    }
    else{
        button.style.backgroundColor = "red";
        button.textContent = "💣";
        gameover();
    }
}
function leftClickSingle(button){
    button.clicked = true;
    button.style.backgroundColor = 'lightGrey';
    row = Number(button.id.substring(0,button.id.indexOf(",")));
    col = Number(button.id.substring(button.id.indexOf(",")+1,button.id.length));
    if(map.layout[row][col] > 0){
        button.style.color = map.colors[map.layout[row][col]];
        button.textContent = map.layout[row][col];
    }
    else if(map.layout[row][col] == -1){
        button.style.backgroundColor = "red";
        button.textContent = "💣";
    }
}
function decideUpperAndLower(upperAndLower, benchMarkRow, benchMarkCol){
    if(benchMarkRow <= 0){
        upperAndLower.upperRow = benchMarkRow+1;
        upperAndLower.lowerRow = 0;
    }
    else if(benchMarkRow >= (map.height-1)){
        upperAndLower.upperRow = map.height-1;
        upperAndLower.lowerRow = benchMarkRow-1;
    }
    else{
        upperAndLower.upperRow = benchMarkRow+1;
        upperAndLower.lowerRow = benchMarkRow-1;
    }
    if(benchMarkCol <= 0){
        upperAndLower.upperCol = benchMarkCol+1;
        upperAndLower.lowerCol = 0;
    }
    else if(benchMarkCol >= (map.width-1)){
        upperAndLower.upperCol = map.width-1;
        upperAndLower.lowerCol = benchMarkCol-1;
    }
    else{
        upperAndLower.upperCol = benchMarkCol+1;
        upperAndLower.lowerCol = benchMarkCol-1;
    }
    return upperAndLower;
}
function createButtons(){
    var table, tr, td;
    table = document.createElement('table');
    for(let i = 0; i < map.height; i++){
        tr = document.createElement('tr');
        for(let j = 0; j < map.width; j++){
            td = document.createElement('td');
            td.id = (i+','+j);
            buttonListener(td);
            td.clicked = false;
            td.flagged = false;
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    return table;
}
function buttonListener(td){
    td.addEventListener('mouseover', function(e) {
        if(!this.clicked)
            this.style.backgroundColor = 'lightGrey';
    });
    td.addEventListener('mouseleave', function(e) {
        if(!this.clicked || this.flagged)
            this.style.backgroundColor = 'rgb(195, 195, 195)';
    });
    td.addEventListener('click', function(e) {
        row = Number(this.id.substring(0, this.id.indexOf(",")));
        col = Number(this.id.substring(this.id.indexOf(",")+1, this.id.length));
        if(!this.clicked) {
            leftClick(this);
        }
        else if(map.layout[row][col] > 0 && !this.flagged){
            var upperAndLower = {
                upperRow: 0,
                lowerRow: 0,
                upperCol: 0,
                lowerCol: 0
            }
            decideUpperAndLower(upperAndLower, row, col);
            let flag = 0;
            for(let i = upperAndLower.lowerRow; i <= upperAndLower.upperRow; i++){
                for(let j = upperAndLower.lowerCol; j <= upperAndLower.upperCol; j++){
                    if(document.getElementById(i+','+j).flagged)
                        flag++;
                }
            }
            if(flag == map.layout[row][col]){
                for(let i = upperAndLower.lowerRow; i <= upperAndLower.upperRow; i++){
                    for(let j = upperAndLower.lowerCol; j <= upperAndLower.upperCol; j++){
                        if(!document.getElementById(i+','+j).clicked)
                            leftClick(document.getElementById(i+','+j));
                    }
                }
            }
        }
    });
    td.oncontextmenu = function (event) { 
        rightClick(this);
        return false //on annule l'affichage du menu contextuel
    }
}
function gameover(){
    document.getElementsByTagName("h3")[0].textContent = "You got bombed!"
    document.getElementById("lost").style.visibility = "visible";
    for(let i = 0; i < map.height; i++){
        for(let j = 0; j < map.width; j++){
            var button = document.getElementById(i+','+j);
            if(button.flagged){
                button.clicked = false;
                button.textContent = "";
            }
            if(!button.clicked)
                leftClickSingle(button);
        }
    }
}
function winGame(button){
    map.win = true;
    document.getElementsByTagName("h3")[0].textContent = "You win!"
    document.getElementById("lost").style.visibility = "visible";
    for(let i = 0; i < map.height; i++){
        for(let j = 0; j < map.width; j++){
            var button = document.getElementById(i+','+j);
                button.clicked = true;
        }
    }
}
function rightClick(button){ //un clic droit permet d'ajouter un drapeau sur une case pour la marquer. elle devient alors "inclicable"
    if(button.flagged == false && button.clicked == false){
        button.clicked = true ;
        button.flagged = true ;
        button.textContent = "🚩";
    }
    else if(button.flagged == true){
        button.clicked = false ;
        button.flagged = false ;
        button.textContent = "";
    }
}