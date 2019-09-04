/*
    Changes made for not using Babel
    --Declared the cookieManagerObject to be equal to the object declared in the CookieManager file
    --Removed inializing the CookieManager Class in main()
*/

//import CookieManager from CookieManager file
import {cookieManager} from "./CookieManager";

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

//insert/delete game buttons
let insertGame;
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
}
//--------------------------------------------------event handlers
function checkInput(){
    //the gameInput value
    let game = gameInput.value;
    //get rid of all white space for value testing
    let gameValue = game.replace(/^\s+/, '').replace(/\s+$/, '');
    

    //if there is anything in the input field, enable the submit button
    if (gameValue !== ""){
        insertGame.disabled = false;
    } else{
        insertGame.disabled = true;
    }
}

function onSubmit(e){
    //console.log("Game Submit Works!");
    //when the user hits the submit button, the game is added to the array
    game = document.getElementById("txtGame").value;
    gameArchive.push(game);

    //once the game is pushed in, the textbox should be cleared
    document.getElementById("txtGame").value = "";
    document.getElementById("txtGame").focus();
    console.log(game + " Added");

    populateDropdown();
    //save the list once an item has been added
    saveData();
}

function onGet(e){
    //console.log("Game Get Works!");
    //if there are games in the list to pick, then the game picks one
    if (gameArchive.length != 0){
        //when the user hits the get button, it randomly picks a game from the array and show it to the user
        let games = gameArchive.length;
        console.log(games + " games in the array");
        //this will select a random number, based on how many games are in the array
        let randomGame = Math.floor(Math.random() * (games));
        console.log(randomGame);
        document.getElementsByClassName("output__selection")[0].innerHTML = gameArchive[(randomGame)];
    } else{
        //if not, then tell the user there are no games to pick
        document.getElementsByClassName("output__selection")[0].innerHTML = "No games are in your list...";
    }
}

function createList(e){
    //empty the list if there is a one already there
    document.getElementsByClassName("list__contents")[0].innerHTML = "";

    if (gameArchive.length != 0){
        //create the heading for the list
        document.getElementsByClassName("list__heading")[0].innerHTML = "Games in your list";
        //now for the contents of the list
        let list =  document.getElementsByClassName("list__contents")[0];
        let lineBreak = document.createElement("br"); 
        for (let n=0;n<gameArchive.length;n++){
            list.innerHTML += (n+1) + ". " + gameArchive[n];
            list.appendChild(lineBreak);
        }
    } else {
        document.getElementsByClassName("list__contents")[0].innerHTML = "There are no games in your list. All of them are completed! ...or you forgot to add some in";
    }
}

function onDelete(e){
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

    //after the data is loaded, populate the dropdown
    populateDropdown();

    //setup event listeners
    gameInput = document.querySelectorAll("[type=text]")[0];
    insertGame = document.querySelectorAll("[type=button]")[0];
    let getGame = document.querySelectorAll("[type=button]")[1];
    let gameList = document.querySelectorAll("[type=button]")[2];
    deleteGame = document.querySelectorAll("[type=button]")[3];

    gameInput.addEventListener("keyup",checkInput);
    insertGame.addEventListener("click",onSubmit);
    getGame.addEventListener("click",onGet);
    gameList.addEventListener("click", createList);
    deleteGame.addEventListener("click", onDelete);
}

main();