(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CookieManager = function () {
    function CookieManager() {
        _classCallCheck(this, CookieManager);
    }

    _createClass(CookieManager, [{
        key: "setCookie",
        value: function setCookie(name, value) {
            var days = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 365;

            // construct date object - will be today's date by default
            var date = new Date();
            // set time to be today plus how many days specified
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            // concatenate the expires name/value pair with expiry date converted to GMT 
            var expires = "expires=" + date.toGMTString();
            // assemble cookie
            document.cookie = name + "=" + value + ";" + expires + ";";
        }
    }, {
        key: "getCookie",
        value: function getCookie(name) {
            // return undefined if no cookie stored
            if (document.cookie === "") return undefined;

            // value to be returned is undefined by default
            var value = void 0;
            // put cookie name/value pairs into an array split on the ; delimiter (since there could be multiple cookies in the file)
            var cookieArray = document.cookie.split(";");

            // APPROACH III - find() with arrow function
            // shorthand for inner annonymous function and return
            var cookie = cookieArray.find(function (cookie) {
                return cookie.split("=")[0].trim() == name;
            });
            if (cookie == undefined) return undefined;
            value = cookie.split("=")[1].trim();

            return value;
        }
    }]);

    return CookieManager;
}();

exports.CookieManager = CookieManager;

},{}],2:[function(require,module,exports){
"use strict";

var _CookieManager = require("./CookieManager");

//CookieManager object
var cookieManager = null;

//Game Array object
//import CookieManager from CookieManager file
var gameArchive = [];

//JSON Array object needed for saving
var jsonArray = void 0;

//Game object
var game = void 0;

//Dropdown Object
var lstGames = void 0;

//--------------------------------------------------private methods
function populateDropdown() {
    //clear the dropdown before repopulating it
    for (var i = lstGames.options.length - 1; i >= 0; i--) {
        lstGames.remove(i);
    }

    var tempArchive = [];
    tempArchive = gameArchive;
    for (var _i = 0; _i < tempArchive.length; _i++) {
        var option = document.createElement("option");
        option.text = tempArchive[_i];
        option.value = tempArchive[_i];

        lstGames.add(option);
    }
}
//--------------------------------------------------event handlers
function onSubmit(e) {
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

function onGet(e) {
    //console.log("Game Get Works!");
    //if there are games in the list to pick, then the game picks one
    if (gameArchive.length != 0) {
        //when the user hits the get button, it randomly picks a game from the array and show it to the user
        var games = gameArchive.length;
        console.log(games + " games in the array");
        //this will select a random number, based on how many games are in the array
        var randomGame = Math.floor(Math.random() * games);
        console.log(randomGame);
        document.getElementsByClassName("output__selection")[0].innerHTML = gameArchive[randomGame];
    } else {
        //if not, then tell the user there are no games to pick
        document.getElementsByClassName("output__selection")[0].innerHTML = "No games are in your list...";
    }
}

function createList(e) {
    //empty the list if there is a one already there
    document.getElementsByClassName("list__contents")[0].innerHTML = "";

    if (gameArchive.length != 0) {
        //create the heading for the list
        document.getElementsByClassName("list__heading")[0].innerHTML = "Games in your list";
        //now for the contents of the list
        var list = document.getElementsByClassName("list__contents")[0];
        var lineBreak = document.createElement("br");
        for (var n = 0; n < gameArchive.length; n++) {
            list.innerHTML += n + 1 + ". " + gameArchive[n];
            list.appendChild(lineBreak);
        }
    } else {
        document.getElementsByClassName("list__contents")[0].innerHTML = "There are no games in your list. All of them are completed! ...or you forgot to add some in";
    }
}

function onDelete(e) {
    //first grab what is selected from the dropdown
    var selected = lstGames.value;
    console.log(selected + " has been selected");

    //get the index of the selected game
    var index = gameArchive.indexOf(selected);
    //next remove the element from the array
    gameArchive.splice(index, 1);

    //last, update the cookie and dropdown list
    saveData();
    populateDropdown();
}

function saveData() {
    //to efficiently save the data, it will be put into JSON first
    jsonArray = JSON.stringify(gameArchive);
    cookieManager.setCookie("games", jsonArray, 365);
    console.log("Games Saved");
}
//--------------------------------------------------main function
function main() {
    //reference to the dropdown
    lstGames = document.getElementById("lstGames");

    //contruct cookieManager
    cookieManager = new _CookieManager.CookieManager();

    //get existing data from cookie, if it exists
    if (cookieManager.getCookie("games") === undefined) {
        //if there is no cookie, it will create a new one
        saveData();
    } else {
        //if there is a cookie, then it reads the data
        jsonArray = cookieManager.getCookie("games");
        //turn the JSON file back into an array
        gameArchive = JSON.parse(jsonArray);
    }

    //after the data is loaded, populate the dropdown
    populateDropdown();

    //setup event listeners
    var insertGame = document.querySelectorAll("[type=button]")[0];
    var getGame = document.querySelectorAll("[type=button]")[1];
    var gameList = document.querySelectorAll("[type=button]")[2];
    var deleteGame = document.querySelectorAll("[type=button]")[3];

    insertGame.addEventListener("click", onSubmit);
    getGame.addEventListener("click", onGet);
    gameList.addEventListener("click", createList);
    deleteGame.addEventListener("click", onDelete);
}

main();

},{"./CookieManager":1}]},{},[2])

//# sourceMappingURL=build.js.map
