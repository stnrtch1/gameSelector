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

//input Object
let gameInput;

//list object
let listOutput;

//various game buttons
let submitGame;
let selectGame;
let gameList;
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
        //if there is any, make sure the button is enabled
        deleteGame.disabled = false;
    } else{
        //if there isn't any games, then disable the button
        deleteGame.disabled = true;
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
    if (gameList.value == "Show List"){
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
        gameList.value = "Hide List";
    } else{
        //if the button says "hide list" then clear out the html and hide the div
        //clear out the list html
        listOutput.innerHTML = "";
        listOutput.style.display = "none";
        //change the button value
        gameList.value = "Show List";
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

    //reference to the list output
    listOutput = document.getElementsByClassName("list__contents")[0];
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
    deleteGame = document.querySelectorAll("[type=button]")[3];

    gameInput.addEventListener("keyup",checkInput);
    submitGame.addEventListener("click",onSubmit);
    selectGame.addEventListener("click",onSelect);
    gameList.addEventListener("click", createList);
    deleteGame.addEventListener("click", onDelete);

    //after the data is loaded, populate the dropdown
    populateDropdown();
}

main();