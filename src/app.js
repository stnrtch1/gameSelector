/*
    Changes made for not using Babel
    --Declared the cookieManagerObject to be equal to the object declared in the CookieManager file
    --Removed inializing the CookieManager Class in main()
*/

//import CookieManager from CookieManager file
import {cookieManager} from "./CookieManager.js";

//CookieManager object
let cookieManagerObject = cookieManager;

//Game Array object
let gameArchive = [];

//JSON Array object needed for saving
let jsonArray;

//Game object
let game;

//Dropdown Object
let lstGames;

//input Objects
let gameInput;
let numberInput;

//list/page objects
let listOutput;
let randomHTML;
let randomOutput;

//various game buttons
let submitGame;
let selectGame;
let gameList;
let btnToggleRandom;
let randomList;
let deleteGame;


//--------------------------------------------------private methods
function populateDropdown(){
    //clear the dropdown before repopulating it
    for(let i = lstGames.options.length - 1; i>= 0; i--){
        lstGames.remove(i);
    }

    let tempArchive = [];
    tempArchive = gameArchive;
    for (let i=0;i<tempArchive.length;i++){
        let option = document.createElement("option");
        option.text = tempArchive[i];
        option.value = tempArchive[i];

        lstGames.add(option);
    }

    //check if there are any games in the dropdown
    if(tempArchive.length != 0){
        //if there is any, make sure the appropriate buttons are enabled
        deleteGame.disabled = false;
        btnToggleRandom.disabled = false;
        randomList.disabled = false;
    } else{
        //if there isn't any games, then disable the appropriate buttons
        deleteGame.disabled = true;
        btnToggleRandom.disabled = true;
        randomList.disabled = true;
    }
}
//--------------------------------------------------event handlers
function checkInput(){
    //the gameInput value
    game = gameInput.value;
    //get rid of all white space for value testing
    let gameValue = game.replace(/^\s+/, '').replace(/\s+$/, '');
    
    //if there is anything in the input field, enable the submit button
    if (gameValue != ""){
        submitGame.disabled = false;
    } else{
        submitGame.disabled = true;
    }
}

function onSubmit(){
    //console.log("Game Submit Works!");
    //when the user hits the submit button, the game is added to the array
    game = gameInput.value;

    //but first, check to see if there is anything in the game value
    if (game != ""){
        gameArchive.push(game);

        //once the game is pushed in, the textbox and error message should be cleared
        document.getElementsByClassName("input__error")[0].innerHTML = "";
        gameInput.value = "";
        gameInput.focus();
        console.log(game + " Added");

        populateDropdown();
        //save the list once an item has been added
        saveData();
    } else{
        document.getElementsByClassName("input__error")[0].innerHTML = "No Game Value Specified!";
    }
    
    
}

function onSelect(){
    //console.log("Game Get Works!");
    //if there are games in the list to pick, then the game picks one
    if (gameArchive.length != 0){
        //when the user hits the get button, it randomly picks a game from the array and show it to the user
        let games = gameArchive.length;
        //console.log(games + " games in the array");
        //this will select a random number, based on how many games are in the array
        let randomGame = Math.floor(Math.random() * (games));
        //console.log(randomGame);
        //tell the user what game was selected
        document.getElementsByClassName("output__selection")[0].innerHTML = gameArchive[(randomGame)];
        
        selectGame.value = "Select Another Game";
    } else{
        //if not, then tell the user there are no games to pick
        document.getElementsByClassName("output__selection")[0].innerHTML = "No games are in your list...";
    }
}

function createList(){
    //toggle the list output depending on what the show list button shows
    if (gameList.value == "Show Games List"){
        //show the list output
        listOutput.style.display = "block";

        if (gameArchive.length != 0){
            //create the heading for the list
            listOutput.innerHTML = "Games in your list: <br>";
            //now for the contents of the list
            let list =  document.getElementsByClassName("list__contents")[0];
            let lineBreak = document.createElement("br"); 
            for (let n=0;n<gameArchive.length;n++){
                list.innerHTML += (n+1) + ". " + gameArchive[n];
                list.appendChild(lineBreak);
            }
        } else {
            listOutput.innerHTML = "There are no games in your list. All of them are completed! ...or you forgot to add some in";
        }

        //change the button value
        gameList.value = "Hide Games List";
    } else{
        //if the button says "hide list" then clear out the html and hide the div
        //clear out the list html
        listOutput.innerHTML = "";
        listOutput.style.display = "none";
        //change the button value
        gameList.value = "Show Games List";
    }

    
}

function toggleRandom(){
    //toggle the field
    if (btnToggleRandom.value == "Create Random List"){
        btnToggleRandom.value = "Hide Random List";
        randomHTML.style.display = "block";
    } else if (btnToggleRandom.value == "Hide Random List") {
        btnToggleRandom.value = "Create Random List";
        randomHTML.style.display = "none";
    }
}

function createRandomList(){
    //get the value from the input field
    let numGames = numberInput.value;
    console.log("Games Wanted : " + numGames);

    //if the user set the value 0 or too high, set the value to the number of games
    let games = gameArchive.length;
    if ((numGames == 0) || (numGames > games)){
        console.log("Using all games for the list");
        numGames = games;
    }

    //create two arrays, one will be a copy of the games array, while the other array will be used for creating the random list
    let copyArchive = Array.from(gameArchive);
    let randomArray = [];

    //create a value to be edited in the loop, it will be set to be the same as the number of games
    let arrayNum = games;

    //now, set up a for loop using the number of games selected
    for(let i=1;i<=numGames;i++){

        //for each loop around, pick a random number in the array
        let randomGame = Math.floor(Math.random() * (arrayNum));
        //select the game from the array
        let selectedGame = copyArchive[randomGame];
        //put the game into the random array
        randomArray.push(selectedGame);
        //now remove the selected game from the copyArchive
        copyArchive.splice(randomGame,1);

        //lower the arrayNumber by 1 now
        arrayNum--;

    }

    console.log(randomArray);

    //now to create the html to show to the user
    randomOutput.innerHTML = "Here's your random list: <br>";
    let lineBreak = document.createElement("br");
    for (let n=0;n<randomArray.length;n++){
        randomOutput.innerHTML += "- " + randomArray[n];
        randomOutput.appendChild(lineBreak);
    }

}

function onDelete(){
    //first grab what is selected from the dropdown
    let selected = lstGames.value;
    console.log(selected + " has been selected");

    //get the index of the selected game
    let index = gameArchive.indexOf(selected);
    //next remove the element from the array
    gameArchive.splice(index,1);

    //last, update the cookie and dropdown list
    saveData();
    populateDropdown();
    
    
}

function saveData(){
    //to efficiently save the data, it will be put into JSON first
    jsonArray = JSON.stringify(gameArchive); 
    cookieManagerObject.setCookie("games", jsonArray, 365);
    console.log("Games Saved");
}
//--------------------------------------------------main function
function main() {
    //reference to the dropdown
    lstGames = document.getElementById("lstGames");

    //reference to the page outputs
    listOutput = document.getElementsByClassName("list__contents")[0];
    randomHTML = document.getElementsByClassName("random__contents")[0];
    randomOutput = document.getElementsByClassName("random__list")[0];

    
    //contruct cookieManager
    //cookieManagerObject = new CookieManager();

    //get existing data from cookie, if it exists
    if (cookieManagerObject.getCookie("games") === undefined){
        //if there is no cookie, it will create a new one
        saveData();
    } else {
        //if there is a cookie, then it reads the data
        jsonArray = cookieManagerObject.getCookie("games");
        //turn the JSON file back into an array
        gameArchive = JSON.parse(jsonArray);
        
    }

    //setup event listeners
    gameInput = document.querySelectorAll("[type=text]")[0];
    submitGame = document.querySelectorAll("[type=button]")[0];
    selectGame = document.querySelectorAll("[type=button]")[1];
    gameList = document.querySelectorAll("[type=button]")[2];
    btnToggleRandom = document.querySelectorAll("[type=button]")[3];
    numberInput = document.querySelectorAll("[type=number]")[0];
    randomList = document.querySelectorAll("[type=button]")[4];
    deleteGame = document.querySelectorAll("[type=button]")[5];

    gameInput.addEventListener("keyup",checkInput);
    submitGame.addEventListener("click",onSubmit);
    selectGame.addEventListener("click",onSelect);
    gameList.addEventListener("click", createList);
    btnToggleRandom.addEventListener("click", toggleRandom);
    randomList.addEventListener("click", createRandomList);
    deleteGame.addEventListener("click", onDelete);

    //after the data is loaded, populate the dropdown
    populateDropdown();
}

main();