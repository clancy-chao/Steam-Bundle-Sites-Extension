"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// ==UserScript==
// @name         Steam Bundle Sites Extension
// @homepage     https://github.com/clancy-chao/Steam-Bundle-Sites-Extension
// @namespace    http://tampermonkey.net/
// @version      2.16.5
// @updateURL    https://github.com/clancy-chao/Steam-Bundle-Sites-Extension/raw/master/SBSE.meta.js
// @downloadURL  https://github.com/clancy-chao/Steam-Bundle-Sites-Extension/raw/master/SBSE.user.js
// @description  A steam bundle sites' tool kits.
// @icon         http://store.steampowered.com/favicon.ico
// @author       Bisumaruko, Cloud
// @include      http*://store.steampowered.com/*
// @include      https://www.indiegala.com/gift*
// @include      https://www.indiegala.com/profile*
// @include      https://www.indiegala.com/library*
// @include      https://www.indiegala.com/game*
// @include      https://www.fanatical.com/*
// @include      https://www.humblebundle.com/*
// @include      http*://*dailyindiegame.com/*
// @include      http*://www.ccyyshop.com/order/*
// @include      https://groupees.com/purchases
// @include      https://groupees.com/profile/purchases/*
// @include      http*://*agiso.com/*
// @include      https://steamdb.keylol.com/tooltip*
// @include      https://yuplay.ru/orders/*/
// @include      https://yuplay.ru/product/*/
// @include      http*://gama-gama.ru/personal/settings/*
// @include      http*://*plati.ru/seller/*
// @include      http*://*plati.market/seller/*
// @include      http*://*plati.ru/cat/*
// @include      http*://*plati.market/cat/*
// @exclude      http*://store.steampowered.com/widget/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/7.18.0/sweetalert2.min.js
// @resource     sweetalert2CSS https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/7.18.0/sweetalert2.min.css
// @resource     currencyFlags https://cdnjs.cloudflare.com/ajax/libs/currency-flags/1.5.0/currency-flags.min.css
// @resource     flagIcon https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.1.0/css/flag-icon.min.css
// @connect      store.steampowered.com
// @connect      www.google.com
// @connect      www.google.com.tw
// @connect      www.google.com.au
// @connect      www.google.co.jp
// @connect      www.google.co.nz
// @connect      www.google.co.uk
// @connect      www.google.ca
// @connect      www.google.de
// @connect      www.google.it
// @connect      www.google.fr
// @connect      www.ecb.europa.eu
// @connect      steamdb.keylol.com
// @connect      steamdb.info
// @connect      steamspy.com
// @connect      github.com
// @connect      localhost
// @connect      127.0.0.1
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

/* global swal */
// inject external css styles
GM_addStyle(GM_getResourceText('sweetalert2CSS'));
GM_addStyle(GM_getResourceText('currencyFlags'));
GM_addStyle(GM_getResourceText('flagIcon').replace(/\.\.\//g, 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.1.0/')); // inject script css styles

GM_addStyle("\n  pre.SBSE-errorMsg { height: 200px; text-align: left; white-space: pre-wrap; }\n  a.SBSE-link-steam_store, a.SBSE-link-steam_db { text-decoration: none; font-size: smaller; }\n  a.SBSE-link-steam_store:hover, a.SBSE-link-steam_db:hover { text-decoration: none; }\n\n  /* switch */\n  .SBSE-switch { position: relative; display: inline-block; width: 60px; height: 30px; }\n  .SBSE-switch input { display: none; }\n  .SBSE-switch__slider {\n    position: absolute;\n    top: 0; right: 0; bottom: 0; left: 0;\n    background-color: #CCC;\n    transition: 0.4s;\n    cursor: pointer;\n  }\n  .SBSE-switch__slider:before {\n    width: 26px; height: 26px;\n    position: absolute;\n    bottom: 2px; left: 2px;\n    background-color: white;\n    transition: 0.4s;\n    content: \"\";\n  }\n  .SBSE-switch input:checked + .SBSE-switch__slider { background-color: #2196F3; }\n  .SBSE-switch input:focus + .SBSE-switch__slider { box-shadow: 0 0 1px #2196F3; }\n  .SBSE-switch input:checked + .SBSE-switch__slider:before { transform: translateX(30px); }\n  .SBSE-switch--small { width: 40px; height: 20px; }\n  .SBSE-switch--small .SBSE-switch__slider:before { width: 16px; height: 16px; }\n  .SBSE-switch--small input:checked + .SBSE-switch__slider:before { transform: translateX(20px); }\n\n  /* dropdown */\n  .SBSE-dropdown { display: inline-block; position: relative; }\n  .SBSE-dropdown__list {\n    width: calc(100% - 10px);\n    max-height: 0;\n    display: inline-block;\n    position: absolute;\n    top: 35px; left: 0;\n    padding: 0;\n    transition: all 0.15s;\n    overflow: hidden;\n    list-style-type: none;\n    background-color: #EEE;\n    box-shadow: 1px 2px 3px rgba(0,0,0,0.45);\n    z-index: 999;\n  }\n  .SBSE-dropdown__list > li { width: 100%; display: block; padding: 3px 0; text-align: center; }\n  .SBSE-dropdown:hover > .SBSE-dropdown__list { max-height: 500px; }\n\n  /* grid */\n  .SBSE-grid { display: flex; flex-wrap: wrap; }\n  .SBSE-grid > span {\n    display: inline-block;\n    margin: 2px 10px;\n    padding: 0 5px;\n    border-radius: 5px;\n    cursor: pointer;\n  }\n  .SBSE-grid > .separator {\n    display: block;\n    width: 100%;\n    margin-top: 12px;\n    text-align: left;\n    font-weight: bold;\n    cursor: default;\n  }\n  .SBSE-grid > span.selected { background-color: antiquewhite; }\n\n  /* settings */\n  .SBSE-container__content__model[data-feature=\"setting\"] .name { text-align: right; vertical-align: top; }\n  .SBSE-container__content__model[data-feature=\"setting\"] .value { text-align: left; }\n  .SBSE-container__content__model[data-feature=\"setting\"] .value > * { height: 30px; margin: 0 20px 10px; }\n  .SBSE-container__content__model[data-feature=\"setting\"] > span { display: inline-block; color: white; cursor: pointer; }\n\n  /* container */\n  .SBSE-container { width: 100%; }\n  .SBSE-container__nav > ul { display: flex; margin: 0; padding: 0; list-style: none; }\n  .SBSE-container__nav__item { flex: 1 1 auto; text-align: center; cursor: pointer; }\n  .SBSE-container__nav__item--show { border-bottom: 1px solid #29B6F6; color: #29B6F6; }\n  .SBSE-container__nav__item > span { display: block; padding: 10px; }\n  .SBSE-container__content__model {\n    width: 100%; height: 200px;\n    display: flex;\n    margin-top: 10px;\n    flex-direction: column;\n    box-sizing: border-box;\n  }\n  .SBSE-container__content__model { display: none; }\n  .SBSE-container__content__model[data-feature=\"setting\"] { height: 100%; display: block; }\n  .SBSE-container__content__model--show { display: block; }\n  .SBSE-container__content__model > textarea {\n    width: 100%; height: 150px;\n    padding: 5px;\n    border: none;\n    box-sizing: border-box;\n    resize: none;\n    outline: none;\n  }\n  .SBSE-container__content__model > div { width: 100%; padding-top: 5px; box-sizing: border-box; }\n  .SBSE-button {\n    width: 120px;\n    position: relative;\n    margin-right: 10px;\n    line-height: 28px;\n    transition: all 0.5s;\n    box-sizing: border-box;\n    outline: none;\n    cursor: pointer;\n  }\n  .SBSE-select { max-width:120px; height: 30px; }\n  .SBSE-container label { margin-right: 10px; }\n  .SBSE-dropdown__list-export a { text-decoration: none; color: #333; transition: color 0.3s ease; }\n  .SBSE-dropdown__list-export a:hover { text-decoration: none; color: #787878; }\n  .SBSE-button-setting {\n    width: 20px; height: 20px;\n    float: right;\n    margin-top: 3px; margin-right: 0; margin-left: 10px;\n    background-color: transparent;\n    background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGhlaWdodD0iMzJweCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzIgMzI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjMycHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnIGlkPSJMYXllcl8xIi8+PGcgaWQ9ImNvZyI+PHBhdGggZD0iTTMyLDE3Ljk2OXYtNGwtNC43ODEtMS45OTJjLTAuMTMzLTAuMzc1LTAuMjczLTAuNzM4LTAuNDQ1LTEuMDk0bDEuOTMtNC44MDVMMjUuODc1LDMuMjUgICBsLTQuNzYyLDEuOTYxYy0wLjM2My0wLjE3Ni0wLjczNC0wLjMyNC0xLjExNy0wLjQ2MUwxNy45NjksMGgtNGwtMS45NzcsNC43MzRjLTAuMzk4LDAuMTQxLTAuNzgxLDAuMjg5LTEuMTYsMC40NjlsLTQuNzU0LTEuOTEgICBMMy4yNSw2LjEyMWwxLjkzOCw0LjcxMUM1LDExLjIxOSw0Ljg0OCwxMS42MTMsNC43MDMsMTIuMDJMMCwxNC4wMzF2NGw0LjcwNywxLjk2MWMwLjE0NSwwLjQwNiwwLjMwMSwwLjgwMSwwLjQ4OCwxLjE4OCAgIGwtMS45MDIsNC43NDJsMi44MjgsMi44MjhsNC43MjMtMS45NDVjMC4zNzksMC4xOCwwLjc2NiwwLjMyNCwxLjE2NCwwLjQ2MUwxNC4wMzEsMzJoNGwxLjk4LTQuNzU4ICAgYzAuMzc5LTAuMTQxLDAuNzU0LTAuMjg5LDEuMTEzLTAuNDYxbDQuNzk3LDEuOTIybDIuODI4LTIuODI4bC0xLjk2OS00Ljc3M2MwLjE2OC0wLjM1OSwwLjMwNS0wLjcyMywwLjQzOC0xLjA5NEwzMiwxNy45Njl6ICAgIE0xNS45NjksMjJjLTMuMzEyLDAtNi0yLjY4OC02LTZzMi42ODgtNiw2LTZzNiwyLjY4OCw2LDZTMTkuMjgxLDIyLDE1Ljk2OSwyMnoiIHN0eWxlPSJmaWxsOiM0RTRFNTA7Ii8+PC9nPjwvc3ZnPg==);\n    background-size: contain;\n    background-repeat: no-repeat;\n    background-origin: border-box;\n    border: none;\n    vertical-align: top;\n    cursor: pointer;\n  }\n\n  /* terminal */\n  .SBSE-terminal {\n    height: 150px;\n    display: none;\n    margin: 0;\n    padding: 0;\n    background-color: #000;\n  }\n  .SBSE-terminal--show { display: block; }\n  .SBSE-terminal > div {\n    max-height: 100%;\n    display: flex;\n    flex-direction: column;\n    overflow: auto;\n    background-color: transparent;\n  }\n  .SBSE-terminal > div > span {\n    display: inline-block;\n    padding-left: 20px;\n    color: #FFF;\n    text-indent: -20px;\n  }\n  .SBSE-terminal > div > span:before {\n    content: '>';\n    width: 20px;\n    display: inline-block;\n    text-align: center;\n    text-indent: 0;\n  }\n  .SBSE-terminal__message {}\n  .SBSE-terminal__input {\n    width: 100%;\n    position: relative;\n    order: 9999;\n    box-sizing: border-box;\n  }\n  .SBSE-terminal__input > input {\n    width: inherit;\n    max-width: calc(100% - 30px);\n    position: absolute;\n    top: 0; right: 0; bottom: 0; left: 20px;\n    padding: 0;\n    border: none;\n    outline: none;\n    background-color: transparent;\n    color: #FFF;\n  }\n  .SBSE-terminal__input > input:first-child { z-index: 9; }\n  .SBSE-terminal__input > input:last-child { z-index: 3; color: gray; }\n\n  /* spinner button affect */\n  .SBSE-button:before {\n    width: 20px; height: 20px;\n    content: '';\n    position: absolute;\n    margin-top: 5px;\n    right: 10px;\n    border: 3px solid;\n    border-left-color: transparent;\n    border-radius: 50%;\n    box-sizing: border-box;\n    opacity: 0;\n    transition: opacity 0.5s;\n    animation-duration: 1s;\n    animation-iteration-count: infinite;\n    animation-name: rotate;\n    animation-timing-function: linear;\n  }\n  .SBSE-button.SBSE-button--narrow.SBSE-button--working {\n    width: 100px;\n    padding-right: 40px;\n    transition: all 0.5s;\n  }\n  .SBSE-button.SBSE-button--working:before {\n    transition-delay: 0.5s;\n    transition-duration: 1s;\n    opacity: 1;\n  }\n  @keyframes rotate {\n    0% { transform: rotate(0deg); }\n    100% { transform: rotate(360deg); }\n  }\n\n  /* types */\n  .SBSE-type {\n    height: 20px;\n    display: none;\n    margin-right: 5px;\n    justify-content: center;\n  }\n  .SBSE-type:before, .SBSE-type:after {\n    content: '';\n    box-sizing: border-box;\n    pointer-events: none;\n  }\n  .SBSE-type:after { padding: 0 2px; }\n  .SBSE-item--game .SBSE-type { background-color: rgba(97,100,101,0.3); }\n  .SBSE-item--game .SBSE-type:after { content: 'Game'; }\n  .SBSE-item--DLC .SBSE-type { background-color: rgba(165,84,177,0.8); }\n  .SBSE-item--DLC .SBSE-type:before {\n    content: '\uA71C';\n    width: 14px; height: 14px;\n    margin: 3px 0 0 2px;\n    border-radius: 50%;\n    background-color: #000;\n    color: rgba(165,84,177,0.8);\n    text-align: center;\n    font-size: 28px;\n    line-height: 28px;\n  }\n  .SBSE-item--DLC .SBSE-type:after { content: 'DLC'; }\n  .SBSE-item--package .SBSE-type { background-color: rgba(47,137,188,0.8); }\n  .SBSE-item--package .SBSE-type:after { content: 'Package'; }\n  .SBSE-item--steam .SBSE-type { display: flex; }\n\n  /* icons */\n  .SBSE-icon {\n    width: 20px; height: 20px;\n    display: none;\n    margin-left: 5px;\n    border-radius: 50%;\n    background-color: #E87A90;\n    transform: rotate(45deg);\n  }\n  .SBSE-icon:before, .SBSE-icon:after {\n    content: '';\n    width: 3px; height: 14px;\n    position: absolute;\n    top: 50%; left: 50%;\n    transform: translate(-50%, -50%);\n    background-color: white;\n    border-radius: 5px;\n    pointer-events: none;\n  }\n  .SBSE-icon:after { transform: translate(-50%, -50%) rotate(-90deg); }\n  .SBSE-item--owned .SBSE-icon { background-color: #9CCC65; }\n  .SBSE-item--owned .SBSE-icon:before, .SBSE-item--owned .SBSE-icon:after { transform: none; }\n  .SBSE-item--owned .SBSE-icon:before {\n    width: 3px; height: 11px;\n    top: 4px; left: 10px;\n    border-radius: 5px 5px 5px 0;\n  }\n  .SBSE-item--owned .SBSE-icon:after {\n    width: 5px; height: 3px;\n    top: 12px; left: 6px;\n    border-radius: 5px 0 0 5px;\n  }\n  .SBSE-item--wished .SBSE-icon { transform: rotate(0); background-color: #29B6F6; }\n  .SBSE-item--wished .SBSE-icon:before, .SBSE-item--wished .SBSE-icon:after {\n    width: 6px; height: 10px;\n    top: 5px; left: 10px;\n    border-radius: 6px 6px 0 0;\n    transform: rotate(-45deg);\n    transform-origin: 0 100%;\n  }\n  .SBSE-item--wished .SBSE-icon:after {\n    left: 4px;\n    transform: rotate(45deg);\n    transform-origin :100% 100%;\n  }\n  .SBSE-item--ignored .SBSE-icon { background-color: rgb(135, 173, 189); }\n  .SBSE-item--notApplicable .SBSE-icon { transform: rotate(0); background-color: rgb(248, 187, 134); }\n  .SBSE-item--notApplicable .SBSE-icon:before {\n    content: '?';\n    width: 0; height: 10px;\n    top: 5px; left: 7px;\n    color: white;\n    font-size: 16px; font-weight: 900;\n  }\n  .SBSE-item--notApplicable .SBSE-icon:after { display: none; }\n  .SBSE-item--fetching .SBSE-icon { transform: rotate(0); background-color: transparent; }\n  .SBSE-item--fetching .SBSE-icon:before {\n    width: 20px; height: 20px;\n    top: 0; left: 0;\n    border: 3px solid grey;\n    border-left-color: transparent;\n    border-radius: 50%;\n    box-sizing: border-box;\n    transition: opacity 0.5s;\n    animation-duration: 1s;\n    animation-iteration-count: infinite;\n    animation-name: rotate;\n    animation-timing-function: linear;\n  }\n  .SBSE-item--fetching .SBSE-icon:after { display: none; }\n  .SBSE-item--notFetched .SBSE-icon { background-color: transparent; }\n  .SBSE-item--notFetched .SBSE-icon:before, .SBSE-item--notFetched .SBSE-icon:after { display: none; }\n  .SBSE-item--failed .SBSE-icon { transform: rotate(0); }\n  .SBSE-item--failed .SBSE-icon:before {\n    content: '!';\n    width: 0; height: 10px;\n    top: 5px; left: 8.5px;\n    color: white;\n    font-size: 16px; font-weight: 900;\n  }\n  .SBSE-item--failed .SBSE-icon:after { display: none; }\n  .SBSE-item--steam .SBSE-icon { display: inline-block; }\n\n  /* Steam Tooltip */\n  .SBSE-tooltip {\n    width: 308px;\n    display: none;\n    position: fixed;\n    overflow: hidden;\n    background: url(https://steamstore-a.akamaihd.net/public/images/v6/blue_body_darker_repeat.jpg) -700px center repeat-y scroll rgb(0, 0, 0);\n    border: 0;\n    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5);\n    transition: all 0.5s;\n    z-index: 999;\n  }\n  .SBSE-tooltip--show{ display: block; }\n\n  /* Tooltip */\n  [tooltip]::before, [tooltip]::after {\n    position: absolute;\n    opacity: 0;\n    transition: all 0.15s ease;\n  }\n  [tooltip]::before {\n    width: max-content;\n    content: attr(tooltip);\n    top: calc(100% + 10px); left: 0;\n    padding: 10px;\n    color: #4a4c45;\n    background-color: white;\n    border-radius: 3px;\n    box-shadow: 1px 2px 3px rgba(0,0,0,0.45);\n  }\n  [tooltip]::after {\n    content: \"\";\n    top: calc(100% + 5px); left: 10px;\n    border-left: 5px solid transparent;\n    border-right: 5px solid transparent;\n    border-bottom: 5px solid white;\n  }\n  [tooltip]:hover::before, [tooltip]:hover::after { opacity: 1; }\n  [tooltip]:not([tooltip-persistent])::before, [tooltip]:not([tooltip-persistent])::after { pointer-events: none; }\n"); // load up

var regURL = /(https?:\/\/)?([.\w]*steam[-.\w]*){1}\/.*?(apps?|subs?){1}\/(\d+){1}(\/.*\/?)?/m;
var regKey = /(?:(?:([A-Z0-9])(?!\1{4})){5}-){2,5}[A-Z0-9]{5}/g;
var eol = "\n";
var tab = "\t";
var has = Object.prototype.hasOwnProperty;

var forEachAsync = function forEachAsync(array, callback, lastIterationCallback) {
  if (!Array.isArray(array)) throw Error('Not an array');
  if (typeof callback !== 'function') throw Error('Not an function');

  var iterators = _toConsumableArray(array.keys());

  var processor = function processor(taskStartTime) {
    var taskFinishTime;

    do {
      var iterator = iterators.shift();
      if (iterator in array) callback(array[iterator], iterator, array);
      taskFinishTime = window.performance.now();
    } while (taskFinishTime - taskStartTime < 1000 / 60);

    if (iterators.length > 0) requestAnimationFrame(processor); // finished iterating array
    else if (typeof lastIterationCallback === 'function') lastIterationCallback();
  };

  requestAnimationFrame(processor);
};

var unique = function unique(a) {
  return _toConsumableArray(new Set(a));
};

var isArray = function isArray(value) {
  return Array.isArray(value);
};

var isObject = function isObject(value) {
  return Object(value) === value;
};

var request = function request(options) {
  return new Promise(function (resolve, reject) {
    options.onerror = reject;
    options.ontimeout = reject;
    options.onload = resolve;
    GM_xmlhttpRequest(options);
  });
}; // setup jQuery


var $ = jQuery.noConflict(true);
$.fn.pop = [].pop;
$.fn.shift = [].shift;

$.fn.eachAsync = function eachAsync(callback, lastIterationCallback) {
  forEachAsync(this.get(), callback, lastIterationCallback);
};

var config = {
  data: JSON.parse(GM_getValue('SBSE_config', '{}')),
  set: function set(key, value, callback) {
    this.data[key] = value;
    GM_setValue('SBSE_config', JSON.stringify(this.data));
    if (typeof callback === 'function') callback();
  },
  get: function get(key) {
    return has.call(this.data, key) ? this.data[key] : null;
  },
  init: function init() {
    if (!has.call(this.data, 'autoUpdateSessionID')) this.data.autoUpdateSessionID = true;
    if (!has.call(this.data, 'autoSyncLibrary')) this.data.autoSyncLibrary = true;
    if (!has.call(this.data, 'ASFFormat')) this.data.ASFFormat = false;
    if (!has.call(this.data, 'titleComesLast')) this.data.titleComesLast = false;
    if (!has.call(this.data, 'activateAllKeys')) this.data.activateAllKeys = false;
    if (!has.call(this.data, 'enableTooltips')) this.data.enableTooltips = this.get('language') !== 'english';
    if (!has.call(this.data, 'highlightedRegions')) this.data.highlightedRegions = ['CN', 'HK', 'TW'];
    if (!has.call(this.data, 'enableASFIPC')) this.data.enableASFIPC = false;
    if (!has.call(this.data, 'ASFWSProtocol')) this.data.ASFWSProtocol = 'ws';
    if (!has.call(this.data, 'ASFIPCProtocol')) this.data.ASFIPCProtocol = 'http';
    if (!has.call(this.data, 'ASFIPCServer')) this.data.ASFIPCServer = '127.0.0.1';
    if (!has.call(this.data, 'ASFIPCPort')) this.data.ASFIPCPort = 1242;
    if (!has.call(this.data, 'ASFIPCPassword')) this.data.ASFIPCPassword = '';
  }
};
var i18n = {
  data: {
    tchinese: {
      name: '正體中文',
      updateSuccessTitle: '更新成功！',
      updateSuccess: '成功更新Steam sessionID',
      successStatus: '成功',
      successTitle: '好極了！',
      successDetail: '無資料',
      skippedStatus: '跳過',
      activatedDetail: '已啟動',
      loadingSuccess: '加載完成！',
      failStatus: '失敗',
      failTitle: '糟糕！',
      failDetailUnexpected: '發生未知錯誤，請稍後再試',
      failDetailInvalidKey: '序號錯誤',
      failDetailUsedKey: '序號已被使用',
      failDetailRateLimited: '啟動受限',
      failDetailCountryRestricted: '地區限制',
      failDetailAlreadyOwned: '產品已擁有',
      failDetailMissingBaseGame: '未擁有主程式',
      failDetailPS3Required: '需要PS3 啟動',
      failDetailGiftWallet: '偵測到禮物卡／錢包序號',
      failDetailParsingFailed: '處理資料發生錯誤，請稍後再試',
      failDetailRequestFailedNeedUpdate: '請求發生錯誤，請稍後再試<br/>或者嘗試更新SessionID',
      noItemDetails: '無產品詳細資料',
      notLoggedInTitle: '未登入',
      notLoggedInMsg: '請登入Steam 以讓腳本紀錄SessionID',
      missingTitle: '未發現SessionID',
      missingMsg: '請問要更新SessionID 嗎？',
      emptyInput: '未發現Steam 序號',
      settingsTitle: '設定',
      settingsAutoUpdateSessionID: '自動更新SessionID',
      settingsSessionID: '我的SessionID',
      settingsAutoSyncLibrary: '自動同步Steam 遊戲庫',
      settingsSyncLibrary: '同步遊戲庫',
      settingsSyncLibraryButton: '同步',
      settingsLanguage: '語言',
      settingsASFFormat: '啟用ASF 格式',
      settingsTitleComesLast: '遊戲名置後',
      settingsActivateAllKeys: '不跳過、啟動所有序號',
      settingsEnableTooltips: 'Keylol 論壇提示框',
      settingshighlightedRegions: '標示出地區',
      settingshighlightedRegionsButton: '選擇地區',
      settingsEnableASFIPC: '啟用ASF IPC',
      settingsASFWSProtocol: 'ASF WS 傳輸協定',
      settingsASFIPCProtocol: 'ASF IPC 傳輸協定',
      settingsASFIPCServer: 'ASF IPC IP位址',
      settingsASFIPCPort: 'ASF IPC 連接埠',
      settingsASFIPCPassword: 'ASF IPC 密碼',
      settingsReportIssues: '回報問題／新功能請求',
      HBAlreadyOwned: '遊戲已擁有',
      HBRedeemAlreadyOwned: '確定刮開 %title% Steam 序號？',
      steamStore: 'Steam 商店',
      HBActivationRestrictions: '啟動限制',
      HBDisallowedCountries: '限制以下地區啟動',
      HBExclusiveCountries: '僅限以下地區啟動',
      HBCurrentLocation: '當前位於：',
      DIGMenuPurchase: '購買',
      DIGMenuSelectAll: '全選',
      DIGMenuSelectCancel: '取消',
      DIGButtonPurchasing: '購買中',
      DIGInsufficientFund: '餘額不足',
      DIGFinishedPurchasing: '購買完成',
      DIGMarketSearchResult: '目前市集上架中',
      DIGRateAllPositive: '全部好評',
      DIGClickToHideThisRow: '隱藏此上架遊戲',
      DIGCurrentBalance: '當前餘額：',
      DIGEditBalance: '更新DIG 錢包餘額',
      DIGPoint: 'DIG 點數',
      DIGTotalAmount: '購買總額：',
      buttonReveal: '刮開',
      buttonRetrieve: '提取',
      buttonActivate: '啟動',
      buttonCopy: '複製',
      buttonReset: '清空',
      buttonExport: '匯出',
      buttonCommands: '指令',
      buttonLog: '日誌',
      checkboxIncludeGameTitle: '遊戲名',
      checkboxJoinKeys: '合併',
      checkboxSkipUsed: '跳過已使用',
      checkboxMarketListings: '上架於市集',
      selectFilterAll: '選取全部',
      selectFilterOwned: '選取已擁有',
      selectFilterNotOwned: '選取未擁有',
      selectConnector: '至',
      markAllAsUsed: '標記全部已使用',
      syncSuccessTitle: '同步成功',
      syncSuccess: '成功同步Steam 遊戲庫資料',
      syncFailTitle: '同步失敗',
      syncFail: '失敗同步Steam 遊戲庫資料',
      visitSteam: '前往Steam',
      lastSyncTime: '已於%seconds% 秒前同步收藏庫',
      game: '遊戲',
      dlc: 'DLC',
      "package": '合集',
      bundle: '組合包',
      owned: '已擁有',
      wished: '於願望清單',
      ignored: '已忽略',
      notOwned: '未擁有',
      notApplicable: '無資料',
      notFetched: '未檢查',
      enablePlatiFeature: '啟用腳本',
      platiFetchOnStart: '自動檢查',
      platiInfiniteScroll: '自動換頁',
      platiFetchButton: '檢查',
      platiFilterType: '顯示類型',
      platiFilterStatus: '顯示狀態'
    },
    schinese: {
      name: '简体中文',
      updateSuccessTitle: '更新成功',
      updateSuccess: '成功更新Steam sessionID',
      successStatus: '成功',
      successTitle: '好极了！',
      successDetail: '无信息',
      activatedDetail: '已激活',
      loadingSuccess: '加载完成！',
      skippedStatus: '跳过',
      failStatus: '失败',
      failTitle: '糟糕！',
      failDetailUnexpected: '发生未知错误，请稍后再试',
      failDetailInvalidKey: '激活码错误',
      failDetailUsedKey: '激活码已被使用',
      failDetailRateLimited: '激活受限',
      failDetailCountryRestricted: '地区限制',
      failDetailAlreadyOwned: '产品已拥有',
      failDetailMissingBaseGame: '未拥有基础游戏',
      failDetailPS3Required: '需要PS3 激活',
      failDetailGiftWallet: '侦测到礼物卡／钱包激活码',
      failDetailParsingFailed: '处理资料发生错误，请稍后再试',
      failDetailRequestFailedNeedUpdate: '请求发生错误，请稍后再试<br/>或者尝试更新SessionID',
      noItemDetails: '无产品详细信息',
      notLoggedInTitle: '未登入',
      notLoggedInMsg: '请登入Steam 以让脚本记录SessionID',
      missingTitle: '未发现SessionID',
      missingMsg: '请问要更新SessionID 吗？',
      emptyInput: '未批配到Steam 激活码',
      settingsTitle: '设置',
      settingsAutoUpdateSessionID: '自动更新SessionID',
      settingsSessionID: '我的SessionID',
      settingsAutoSyncLibrary: '自动同步Steam 游戏库',
      settingsSyncLibrary: '同步游戏库',
      settingsSyncLibraryButton: '同步',
      settingsLanguage: '语言',
      settingsASFFormat: '启用ASF 格式',
      settingsTitleComesLast: '游戏名置后',
      settingsActivateAllKeys: '不跳过、激活所有激活码',
      settingsEnableTooltips: 'Keylol 论坛提示窗',
      settingshighlightedRegions: '标示出地区',
      settingshighlightedRegionsButton: '选择地区',
      settingsEnableASFIPC: '启用ASF IPC',
      settingsASFWSProtocol: 'ASF WS 传输协议',
      settingsASFIPCProtocol: 'ASF IPC 传输协议',
      settingsASFIPCServer: 'ASF IPC IP地址',
      settingsASFIPCPort: 'ASF IPC 端口',
      settingsASFIPCPassword: 'ASF IPC 密码',
      settingsReportIssues: '回报问题／新功能请求',
      HBAlreadyOwned: '游戏已拥有',
      HBRedeemAlreadyOwned: '确定刮开 %title% Steam 激活码？',
      steamStore: 'Steam 商店',
      HBActivationRestrictions: '激活限制',
      HBDisallowedCountries: '限制以下地区激活',
      HBExclusiveCountries: '仅限以下地区激活',
      HBCurrentLocation: '当前位于：',
      DIGMenuPurchase: '购买',
      DIGMenuSelectAll: '全选',
      DIGMenuSelectCancel: '取消',
      DIGButtonPurchasing: '购买中',
      DIGInsufficientFund: '余额不足',
      DIGFinishedPurchasing: '购买完成',
      DIGMarketSearchResult: '目前市集上架中',
      DIGRateAllPositive: '全部好评',
      DIGClickToHideThisRow: '隐藏此上架游戏',
      DIGCurrentBalance: '当前余额：',
      DIGEditBalance: '更新DIG 錢包餘額',
      DIGPoint: 'DIG 点数',
      DIGTotalAmount: '购买总额：',
      buttonReveal: '刮开',
      buttonRetrieve: '提取',
      buttonActivate: '激活',
      buttonCopy: '复制',
      buttonReset: '清空',
      buttonExport: '导出',
      buttonCommands: '指令',
      buttonLog: '日志',
      checkboxIncludeGameTitle: '游戏名',
      checkboxJoinKeys: '合并',
      checkboxSkipUsed: '跳过已使用',
      checkboxMarketListings: '上架于市集',
      selectFilterAll: '选取全部',
      selectFilterOwned: '选取已拥有',
      selectFilterNotOwned: '选取未拥有',
      selectConnector: '至',
      markAllAsUsed: '标记全部已使用',
      syncSuccessTitle: '同步成功',
      syncSuccess: '成功同步Steam 游戏库资料',
      syncFailTitle: '同步失败',
      syncFail: '失败同步Steam 游戏库资料',
      visitSteam: '前往Steam',
      lastSyncTime: '已于%seconds% 秒前同步游戏库',
      game: '游戏',
      dlc: 'DLC',
      "package": '礼包',
      bundle: '捆绑包',
      owned: '已拥有',
      wished: '于愿望清单',
      ignored: '已忽略',
      notOwned: '未拥有',
      notApplicable: '无资料',
      notFetched: '未检查',
      enablePlatiFeature: '启用脚本',
      platiFetchOnStart: '自动检查',
      platiInfiniteScroll: '自动换页',
      platiFetchButton: '检查',
      platiFilterType: '显示类型',
      platiFilterStatus: '显示状态'
    },
    english: {
      name: 'English',
      updateSuccessTitle: 'Update Successful!',
      updateSuccess: 'Steam sessionID is successfully updated',
      successStatus: 'Success',
      successTitle: 'Hurray!',
      successDetail: 'No Detail',
      activatedDetail: 'Activated',
      loadingSuccess: 'Loaded',
      skippedStatus: 'Skipped',
      failStatus: 'Fail',
      failTitle: 'Opps!',
      failDetailUnexpected: 'Unexpected Error',
      failDetailInvalidKey: 'Invalid Key',
      failDetailUsedKey: 'Used Key',
      failDetailRateLimited: 'Rate Limited',
      failDetailCountryRestricted: 'Country Restricted',
      failDetailAlreadyOwned: 'Product Already Owned',
      failDetailMissingBaseGame: 'Missing Base Game',
      failDetailPS3Required: 'PS3 Activation Required',
      failDetailGiftWallet: 'Gift Card/Wallet Code Detected',
      failDetailParsingFailed: 'Result parse failed',
      failDetailRequestFailedNeedUpdate: 'Request failed, please try again<br/>or update sessionID',
      noItemDetails: 'No Item Details',
      notLoggedInTitle: 'Not Logged-In',
      notLoggedInMsg: 'Please login to Steam so sessionID can be saved',
      missingTitle: 'Missing SessionID',
      missingMsg: 'Do you want to update your Steam sessionID?',
      emptyInput: 'Could not find Steam code',
      settingsTitle: 'Settings',
      settingsAutoUpdateSessionID: 'Auto Update SessionID',
      settingsSessionID: 'Your sessionID',
      settingsAutoSyncLibrary: 'Auto Sync Library',
      settingsSyncLibrary: 'Sync Library',
      settingsSyncLibraryButton: 'Sync',
      settingsLanguage: 'Language',
      settingsASFFormat: 'Enable ASF Format',
      settingsTitleComesLast: 'Title Comes Last',
      settingsActivateAllKeys: 'No skip & activate all keys',
      settingsEnableTooltips: 'Tooltips from Keylol',
      settingshighlightedRegions: 'Highlighted Regions',
      settingshighlightedRegionsButton: 'Select Regions',
      settingsEnableASFIPC: 'Enable ASF IPC',
      settingsASFWSProtocol: 'ASF WS Protocol',
      settingsASFIPCProtocol: 'ASF IPC Protocol',
      settingsASFIPCServer: 'ASF IPC IP Address',
      settingsASFIPCPort: 'ASF IPC Port',
      settingsASFIPCPassword: 'ASF IPC Password',
      settingsReportIssues: 'Report Issues or Request Features',
      HBAlreadyOwned: 'Game Already Owned',
      HBRedeemAlreadyOwned: 'Are you sure to redeem %title% Steam Key?',
      steamStore: 'Steam Store',
      HBActivationRestrictions: 'Activation Restrictions',
      HBDisallowedCountries: 'Cannot be activated in the following regions',
      HBExclusiveCountries: 'Can only be activated in the following regions',
      HBCurrentLocation: 'Current Location: ',
      DIGMenuPurchase: 'Purchase',
      DIGMenuSelectAll: 'Select All',
      DIGMenuSelectCancel: 'Cancel',
      DIGButtonPurchasing: 'Purchassing',
      DIGInsufficientFund: 'Insufficient fund',
      DIGFinishedPurchasing: 'Finished Purchasing',
      DIGMarketSearchResult: 'Currently listing in marketplace',
      DIGRateAllPositive: 'Mark All Positive',
      DIGClickToHideThisRow: 'Hide this game from listings',
      DIGCurrentBalance: 'Current Balance: ',
      DIGEditBalance: 'Edit DIG balance',
      DIGPoint: 'DIG Point',
      DIGTotalAmount: 'Total Amount: ',
      buttonReveal: 'Reveal',
      buttonRetrieve: 'Retrieve',
      buttonActivate: 'Activate',
      buttonCopy: 'Copy',
      buttonReset: 'Reset',
      buttonExport: 'Export',
      buttonCommands: 'Commands',
      buttonLog: 'Log',
      checkboxIncludeGameTitle: 'Game Title',
      checkboxJoinKeys: 'Join',
      checkboxSkipUsed: 'Skip Used',
      checkboxMarketListings: 'Market Listings',
      selectFilterAll: 'Select All',
      selectFilterOwned: 'Select Owned',
      selectFilterNotOwned: 'Select Not Owned',
      selectConnector: 'to',
      markAllAsUsed: 'Mark All as Used',
      syncSuccessTitle: 'Sync Successful',
      syncSuccess: 'Successfully sync Steam library data',
      syncFailTitle: 'Sync failed',
      syncFail: 'Failed to sync Steam library data',
      visitSteam: 'Visit Steam',
      lastSyncTime: 'Library data synced %seconds% seconds ago',
      game: 'Game',
      dlc: 'DLC',
      "package": 'Package',
      bundle: 'Bundle',
      owned: 'Owned',
      wished: 'Wishlisted',
      ignored: 'Ignored',
      notOwned: 'Not Owned',
      notApplicable: 'Not Applicable',
      notFetched: 'Not Checked',
      enablePlatiFeature: 'Enable Script',
      platiFetchOnStart: 'Auto Check',
      platiInfiniteScroll: 'Infinite Scroll',
      platiFetchButton: 'Check',
      platiFilterType: 'Show Type',
      platiFilterStatus: 'Show Status'
    }
  },
  language: null,
  set: function set() {
    var selectedLanguage = has.call(this.data, config.get('language')) ? config.get('language') : 'english';
    this.language = this.data[selectedLanguage];
  },
  get: function get(key) {
    return has.call(this.language, key) ? this.language[key] : this.data.english[key];
  },
  init: function init() {
    this.set();
  }
};
var ISO2 = {
  name: {
    tchinese: {
      AD: '安道爾',
      AE: '阿拉伯聯合大公國',
      AF: '阿富汗',
      AG: '安地卡及巴布達',
      AI: '安圭拉',
      AL: '阿爾巴尼亞',
      AM: '亞美尼亞',
      AO: '安哥拉',
      AQ: '南極洲',
      AR: '阿根廷',
      AS: '美屬薩摩亞',
      AT: '奧地利',
      AU: '澳大利亞',
      AW: '阿魯巴',
      AX: '奧蘭',
      AZ: '亞塞拜然',
      BA: '波士尼亞與赫塞哥維納',
      BB: '巴貝多',
      BD: '孟加拉',
      BE: '比利時',
      BF: '布吉納法索',
      BG: '保加利亞',
      BH: '巴林',
      BI: '蒲隆地',
      BJ: '貝南',
      BL: '聖巴泰勒米',
      BM: '百慕達',
      BN: '汶萊',
      BO: '玻利維亞',
      BQ: '波奈',
      BR: '巴西',
      BS: '巴哈馬',
      BT: '不丹',
      BV: '布威島',
      BW: '波札那',
      BY: '白俄羅斯',
      BZ: '貝里斯',
      CA: '加拿大',
      CC: '科科斯（基林）群島',
      CD: '剛果民主共和國',
      CF: '中非共和國',
      CG: '剛果共和國',
      CH: '瑞士',
      CI: '象牙海岸',
      CK: '庫克群島',
      CL: '智利',
      CM: '喀麥隆',
      CN: '中國',
      CO: '哥倫比亞',
      CR: '哥斯大黎加',
      CS: '塞爾維亞與蒙特內哥羅',
      CU: '古巴',
      CV: '維德角',
      CW: '古拉索',
      CX: '聖誕島',
      CY: '賽普勒斯',
      CZ: '捷克',
      DE: '德國',
      DJ: '吉布地',
      DK: '丹麥',
      DM: '多米尼克',
      DO: '多明尼加',
      DZ: '阿爾及利亞',
      EC: '厄瓜多',
      EE: '愛沙尼亞',
      EG: '埃及',
      EH: '西撒哈拉',
      ER: '厄利垂亞',
      ES: '西班牙',
      ET: '衣索比亞',
      FI: '芬蘭',
      FJ: '斐濟',
      FK: '福克蘭群島',
      FM: '密克羅尼西亞聯邦',
      FO: '法羅群島',
      FR: '法國',
      GA: '加彭',
      GB: '英國',
      GD: '格瑞那達',
      GE: '喬治亞',
      GF: '法屬圭亞那',
      GG: '根西',
      GH: '迦納',
      GI: '直布羅陀',
      GL: '格陵蘭',
      GM: '甘比亞',
      GN: '幾內亞',
      GP: '瓜德羅普',
      GQ: '赤道幾內亞',
      GR: '希臘',
      GS: '南喬治亞與南桑威奇',
      GT: '瓜地馬拉',
      GU: '關島',
      GW: '幾內亞比索',
      GY: '蓋亞那',
      HK: '香港',
      HM: '赫德島和麥克唐納群島',
      HN: '宏都拉斯',
      HR: '克羅埃西亞',
      HT: '海地',
      HU: '匈牙利',
      ID: '印尼',
      IE: '愛爾蘭',
      IL: '以色列',
      IM: '曼島',
      IN: '印度',
      IO: '英屬印度洋領地',
      IQ: '伊拉克',
      IR: '伊朗',
      IS: '冰島',
      IT: '義大利',
      JE: '澤西',
      JM: '牙買加',
      JO: '約旦',
      JP: '日本',
      KE: '肯亞',
      KG: '吉爾吉斯',
      KH: '柬埔寨',
      KI: '吉里巴斯',
      KM: '葛摩',
      KN: '聖克里斯多福及尼維斯',
      KP: '北韓',
      KR: '南韓',
      KW: '科威特',
      KY: '開曼群島',
      KZ: '哈薩克',
      LA: '寮國',
      LB: '黎巴嫩',
      LC: '聖露西亞',
      LI: '列支敦斯登',
      LK: '斯里蘭卡',
      LR: '賴比瑞亞',
      LS: '賴索托',
      LT: '立陶宛',
      LU: '盧森堡',
      LV: '拉脫維亞',
      LY: '利比亞',
      MA: '摩洛哥',
      MC: '摩納哥',
      MD: '摩爾多瓦',
      ME: '蒙特內哥羅',
      MF: '法屬聖馬丁',
      MG: '馬達加斯加',
      MH: '馬紹爾群島',
      MK: '馬其頓共和國',
      ML: '馬利',
      MM: '緬甸',
      MN: '蒙古',
      MO: '澳門',
      MP: '北馬里亞納群島',
      MQ: '馬丁尼克',
      MR: '茅利塔尼亞',
      MS: '蒙哲臘',
      MT: '馬爾他',
      MU: '模里西斯',
      MV: '馬爾地夫',
      MW: '馬拉威',
      MX: '墨西哥',
      MY: '馬來西亞',
      MZ: '莫三比克',
      NA: '納米比亞',
      NC: '新喀里多尼亞',
      NE: '尼日',
      NF: '諾福克島',
      NG: '奈及利亞',
      NI: '尼加拉瓜',
      NL: '荷蘭',
      NO: '挪威',
      NP: '尼泊爾',
      NR: '諾魯',
      NU: '紐埃',
      NZ: '紐西蘭',
      OM: '阿曼',
      PA: '巴拿馬',
      PE: '秘魯',
      PF: '法屬玻里尼西亞',
      PG: '巴布亞紐幾內亞',
      PH: '菲律賓',
      PK: '巴基斯坦',
      PL: '波瀾',
      PM: '聖皮耶與密克隆群島',
      PN: '皮特肯群島',
      PR: '波多黎各',
      PS: '巴勒斯坦',
      PT: '葡萄牙',
      PW: '帛琉',
      PY: '巴拉圭',
      QA: '卡達',
      RE: '留尼旺',
      RO: '羅馬尼亞',
      RS: '塞爾維亞',
      RU: '俄羅斯',
      RW: '盧安達',
      SA: '沙烏地阿拉伯',
      SB: '索羅門群島',
      SC: '塞席爾',
      SD: '蘇丹',
      SE: '瑞典',
      SG: '新加坡',
      SH: '聖赫勒拿、亞森欣與垂斯坦昆哈',
      SI: '斯洛維尼亞',
      SJ: '斯瓦巴和揚馬延',
      SK: '斯洛伐克',
      SL: '獅子山共和國',
      SM: '聖馬利諾',
      SN: '塞內加爾',
      SO: '索馬利亞',
      SR: '蘇利南',
      SS: '南蘇丹',
      ST: '聖多美普林西比',
      SV: '薩爾瓦多',
      SX: '荷屬聖馬丁',
      SY: '敘利亞',
      SZ: '史瓦濟蘭',
      TC: '土克凱可群島',
      TD: '查德',
      TF: '法屬南部和南極領地',
      TG: '多哥',
      TH: '泰國',
      TJ: '塔吉克',
      TK: '托克勞',
      TL: '東帝汶',
      TM: '土庫曼',
      TN: '突尼西亞',
      TO: '東加',
      TR: '土耳其',
      TT: '千里達及托巴哥',
      TV: '吐瓦魯',
      TW: '臺灣',
      TZ: '坦尚尼亞',
      UA: '烏克蘭',
      UG: '烏干達',
      UM: '美國本土外小島嶼',
      US: '美國',
      UY: '烏拉圭',
      UZ: '烏茲別克',
      VA: '聖座',
      VC: '聖文森及格瑞那丁',
      VE: '委內瑞拉',
      VG: '英屬維京群島',
      VI: '美屬維京群島',
      VN: '越南',
      VU: '萬那杜',
      WF: '瓦利斯和富圖納',
      WS: '薩摩亞',
      XK: '科索沃',
      YE: '葉門',
      YT: '馬約特',
      ZA: '南非',
      ZM: '尚比亞',
      ZW: '辛巴威'
    },
    schinese: {
      AD: '安道尔',
      AE: '阿拉伯联合酋长国',
      AF: '阿富汗',
      AG: '安提瓜和巴布达',
      AI: '安圭拉',
      AL: '阿尔巴尼亚',
      AM: '亚美尼亚',
      AO: '安哥拉',
      AQ: '南极洲',
      AR: '阿根廷',
      AS: '美属萨摩亚',
      AT: '奥地利',
      AU: '澳大利亚',
      AW: '阿鲁巴',
      AX: '奥兰群岛',
      AZ: '阿塞拜疆',
      BA: '波斯尼亚和黑塞哥维那',
      BB: '巴巴多斯',
      BD: '孟加拉',
      BE: '比利时',
      BF: '布基纳法索',
      BG: '保加利亚',
      BH: '巴林',
      BI: '布隆迪',
      BJ: '贝宁',
      BL: '圣巴托洛缪岛',
      BM: '百慕大',
      BN: '文莱',
      BO: '玻利维亚',
      BQ: '博奈尔',
      BR: '巴西',
      BS: '巴哈马',
      BT: '不丹',
      BV: '布韦岛',
      BW: '博兹瓦纳',
      BY: '白俄罗斯',
      BZ: '伯利兹',
      CA: '加拿大',
      CC: '科科斯（基林）群岛',
      CD: '刚果（金）',
      CF: '中非共和国',
      CG: '刚果（布）',
      CH: '瑞士',
      CI: '科特迪瓦',
      CK: '库克群岛',
      CL: '智利',
      CM: '喀麦隆',
      CN: '中国',
      CO: '哥伦比亚',
      CR: '哥斯达黎加',
      CS: '塞尔维亚和黑山',
      CU: '古巴',
      CV: '佛得角',
      CW: '库拉索',
      CX: '圣诞岛',
      CY: '塞浦路斯',
      CZ: '捷克',
      DE: '德国',
      DJ: '吉布提',
      DK: '丹麦',
      DM: '多米尼克',
      DO: '多米尼加',
      DZ: '阿尔及利亚',
      EC: '厄瓜多尔',
      EE: '爱沙尼亚',
      EG: '埃及',
      EH: '西撒哈拉',
      ER: '厄立特里亚',
      ES: '西班牙',
      ET: '埃塞俄比亚',
      FI: '芬兰',
      FJ: '斐济',
      FK: '福克兰群岛',
      FM: '密克罗尼西亚',
      FO: '法罗群岛',
      FR: '法国',
      GA: '加蓬',
      GB: '英国',
      GD: '格林纳达',
      GE: '格鲁吉亚',
      GF: '法属圭亚那',
      GG: '根西',
      GH: '加纳',
      GI: '直布罗陀',
      GL: '格陵兰',
      GM: '冈比亚',
      GN: '几内亚',
      GP: '瓜德鲁普',
      GQ: '赤道几内亚',
      GR: '希腊',
      GS: '南乔治亚岛和南桑威奇群岛',
      GT: '危地马拉',
      GU: '关岛',
      GW: '几内亚比绍',
      GY: '圭亚那',
      HK: '香港',
      HM: '赫德岛和麦克唐纳群岛',
      HN: '洪都拉斯',
      HR: '克罗地亚',
      HT: '海地',
      HU: '匈牙利',
      ID: '印尼',
      IE: '爱尔兰',
      IL: '以色列',
      IM: '马恩岛',
      IN: '印度',
      IO: '英属印度洋领地',
      IQ: '伊拉克',
      IR: '伊朗',
      IS: '冰岛',
      IT: '意大利',
      JE: '泽西岛',
      JM: '牙买加',
      JO: '约旦',
      JP: '日本',
      KE: '肯尼亚',
      KG: '吉尔吉斯',
      KH: '柬埔寨',
      KI: '基里巴斯',
      KM: '科摩罗',
      KN: '圣基茨和尼维斯',
      KP: '朝鲜',
      KR: '韩国',
      KW: '科威特',
      KY: '开曼群岛',
      KZ: '哈萨克斯坦',
      LA: '老挝',
      LB: '黎巴嫩',
      LC: '圣卢西亚',
      LI: '列支敦士登',
      LK: '斯里兰卡',
      LR: '利比里亚',
      LS: '莱索托',
      LT: '立陶宛',
      LU: '卢森堡',
      LV: '拉脱维亚',
      LY: '利比亚',
      MA: '摩洛哥',
      MC: '摩纳哥',
      MD: '摩尔多瓦',
      ME: '黑山',
      MF: '法属圣马丁',
      MG: '马达加斯加',
      MH: '马绍尔群岛',
      MK: '马其顿',
      ML: '马里',
      MM: '缅甸',
      MN: '蒙古',
      MO: '澳门',
      MP: '北马里亚纳群岛',
      MQ: '马提尼克',
      MR: '毛里塔尼亚',
      MS: '蒙塞拉特',
      MT: '马耳他',
      MU: '毛里求斯',
      MV: '马尔代夫',
      MW: '马拉维',
      MX: '墨西哥',
      MY: '马来西亚',
      MZ: '莫桑比克',
      NA: '纳米比亚',
      NC: '新喀里多尼亚',
      NE: '尼日尔',
      NF: '诺福克岛',
      NG: '尼日利',
      NI: '尼加拉瓜',
      NL: '荷兰',
      NO: '挪威',
      NP: '尼泊尔',
      NR: '瑙鲁',
      NU: '纽埃',
      NZ: '新西兰',
      OM: '阿曼',
      PA: '巴拿马',
      PE: '秘鲁',
      PF: '法属波利尼西亚a',
      PG: '巴布亚新几内亚',
      PH: '菲律宾',
      PK: '巴基斯坦',
      PL: '波兰',
      PM: '圣皮埃尔和密克隆',
      PN: '皮特凯恩群岛',
      PR: '波多黎各',
      PS: '巴勒斯坦',
      PT: '葡萄牙',
      PW: '帕劳',
      PY: '巴拉圭',
      QA: '卡塔尔',
      RE: '留尼旺島',
      RO: '罗马尼亚',
      RS: '塞尔维亚',
      RU: '俄罗斯',
      RW: '卢旺达',
      SA: '沙特阿拉伯',
      SB: '所罗门群岛',
      SC: '塞舌尔',
      SD: '苏丹',
      SE: '瑞典',
      SG: '新加坡',
      SH: '圣赫勒拿、阿森松与特斯坦达库尼亚',
      SI: '斯洛文尼',
      SJ: '斯瓦尔巴群岛和扬马延岛',
      SK: '斯洛伐克',
      SL: '塞拉利昂',
      SM: '圣马力诺',
      SN: '塞内加尔',
      SO: '索马里',
      SR: '苏里南',
      SS: '南苏丹',
      ST: '圣多美和普林西比',
      SV: '萨尔瓦多',
      SX: '荷属圣马丁',
      SY: '叙利亚',
      SZ: '斯威士兰',
      TC: '特克斯和凯科斯群岛',
      TD: '乍得',
      TF: '法属南部领土',
      TG: '多哥',
      TH: '泰国',
      TJ: '塔吉克斯坦',
      TK: '托克劳',
      TL: '东帝汶',
      TM: '土库曼斯坦',
      TN: '突尼斯',
      TO: '汤加',
      TR: '土耳其',
      TT: '特立尼达和多巴哥',
      TV: '图瓦卢',
      TW: '台湾',
      TZ: '坦桑尼亚',
      UA: '乌克兰',
      UG: '乌干达',
      UM: '美国本土外小岛屿',
      US: '美国',
      UY: '乌拉圭',
      UZ: '乌兹别克斯坦',
      VA: '圣座',
      VC: '圣文森特和格林纳丁斯',
      VE: '委内瑞拉',
      VG: '英属维尔京群岛',
      VI: '美属维尔京群岛',
      VN: '越南',
      VU: '瓦努阿图',
      WF: '瓦利斯和富图纳群岛',
      WS: '萨摩亚',
      XK: '科索沃',
      YE: '也门',
      YT: '马约特',
      ZA: '南非',
      ZM: '赞比亚',
      ZW: '津巴布韦'
    },
    english: {
      AD: 'Andorra',
      AE: 'United Arab Emirates',
      AF: 'Afghanistan',
      AG: 'Antigua and Barbuda',
      AI: 'Anguilla',
      AL: 'Albania',
      AM: 'Armenia',
      AO: 'Angola',
      AQ: 'Antarctica',
      AR: 'Argentina',
      AS: 'American Samoa',
      AT: 'Austria',
      AU: 'Australia',
      AW: 'Aruba',
      AX: 'Aland Islands',
      AZ: 'Azerbaijan',
      BA: 'Bosnia and Herzegovina',
      BB: 'Barbados',
      BD: 'Bangladesh',
      BE: 'Belgium',
      BF: 'Burkina Faso',
      BG: 'Bulgaria',
      BH: 'Bahrain',
      BI: 'Burundi',
      BJ: 'Benin',
      BL: 'Saint Barthélemy',
      BM: 'Bermuda',
      BN: 'Brunei',
      BO: 'Bolivia',
      BQ: 'Bonaire',
      BR: 'Brazil',
      BS: 'Bahamas',
      BT: 'Bhutan',
      BV: 'Bouvet Island',
      BW: 'Botswana',
      BY: 'Belarus',
      BZ: 'Belize',
      CA: 'Canada',
      CC: 'Cocos (Keeling) Islands',
      CD: 'East Congo',
      CF: 'Central African Republic',
      CG: 'West Congo',
      CH: 'Switzerland',
      CI: 'Ivory Coast',
      CK: 'Cook Islands',
      CL: 'Chile',
      CM: 'Cameroon',
      CN: 'China',
      CO: 'Colombia',
      CR: 'Costa Rica',
      CS: 'Serbia and Montenegro',
      CU: 'Cuba',
      CV: 'Cabo Verde',
      CW: 'Curaçao',
      CX: 'Christmas Island',
      CY: 'Cyprus',
      CZ: 'Czechia',
      DE: 'Germany',
      DJ: 'Djibouti',
      DK: 'Denmark',
      DM: 'Dominica',
      DO: 'Dominican Republic',
      DZ: 'Algeria',
      EC: 'Ecuador',
      EE: 'Estonia',
      EG: 'Egypt',
      EH: 'Western Sahara',
      ER: 'Eritrea',
      ES: 'Spain',
      ET: 'Ethiopia',
      FI: 'Finland',
      FJ: 'Fiji',
      FK: 'Falkland Islands',
      FM: 'Micronesia',
      FO: 'Faroe Islands',
      FR: 'France',
      GA: 'Gabon',
      GB: 'United Kingdom',
      GD: 'Grenada',
      GE: 'Georgia',
      GF: 'French Guiana',
      GG: 'Guernsey',
      GH: 'Ghana',
      GI: 'Gibraltar',
      GL: 'Greenland',
      GM: 'Gambia',
      GN: 'Guinea',
      GP: 'Guadeloupe',
      GQ: 'Equatorial Guinea',
      GR: 'Greece',
      GS: 'South Georgia and the South Sandwich Islands',
      GT: 'Guatemala',
      GU: 'Guam',
      GW: 'Guinea-Bissau',
      GY: 'Guyana',
      HK: 'Hong Kong',
      HM: 'Heard Island and McDonald Islands',
      HN: 'Honduras',
      HR: 'Croatia',
      HT: 'Haiti',
      HU: 'Hungary',
      ID: 'Indonesia',
      IE: 'Ireland',
      IL: 'Israel',
      IM: 'Isle of Man',
      IN: 'India',
      IO: 'British Indian Ocean Territory',
      IQ: 'Iraq',
      IR: 'Iran',
      IS: 'Iceland',
      IT: 'Italy',
      JE: 'Jersey',
      JM: 'Jamaica',
      JO: 'Jordan',
      JP: 'Japan',
      KE: 'Kenya',
      KG: 'Kyrgyzstan',
      KH: 'Cambodia',
      KI: 'Kiribati',
      KM: 'Comoros',
      KN: 'Saint Kitts and Nevis',
      KP: 'North Korea',
      KR: 'South Korea',
      KW: 'Kuwait',
      KY: 'Cayman Islands',
      KZ: 'Kazakhstan',
      LA: 'Lao',
      LB: 'Lebanon',
      LC: 'Saint Lucia',
      LI: 'Liechtenstein',
      LK: 'Sri Lanka',
      LR: 'Liberia',
      LS: 'Lesotho',
      LT: 'Lithuania',
      LU: 'Luxembourg',
      LV: 'Latvia',
      LY: 'Libya',
      MA: 'Morocco',
      MC: 'Monaco',
      MD: 'Moldova',
      ME: 'Montenegro',
      MF: 'Saint Martin (French part)',
      MG: 'Madagascar',
      MH: 'Marshall Islands',
      MK: 'Macedonia',
      ML: 'Mali',
      MM: 'Myanmar',
      MN: 'Mongolia',
      MO: 'Macao',
      MP: 'Northern Mariana Islands',
      MQ: 'Martinique',
      MR: 'Mauritania',
      MS: 'Montserrat',
      MT: 'Malta',
      MU: 'Mauritius',
      MV: 'Maldives',
      MW: 'Malawi',
      MX: 'Mexico',
      MY: 'Malaysia',
      MZ: 'Mozambique',
      NA: 'Namibia',
      NC: 'New Caledonia',
      NE: 'Niger',
      NF: 'Norfolk Island',
      NG: 'Nigeria',
      NI: 'Nicaragua',
      NL: 'Netherlands',
      NO: 'Norway',
      NP: 'Nepal',
      NR: 'Nauru',
      NU: 'Niue',
      NZ: 'New Zealand',
      OM: 'Oman',
      PA: 'Panama',
      PE: 'Peru',
      PF: 'French Polynesia',
      PG: 'Papua New Guinea',
      PH: 'Philippines',
      PK: 'Pakistan',
      PL: 'Poland',
      PM: 'Saint Pierre and Miquelon',
      PN: 'Pitcairn',
      PR: 'Puerto Rico',
      PS: 'Palestine',
      PT: 'Portugal',
      PW: 'Palau',
      PY: 'Paraguay',
      QA: 'Qatar',
      RE: 'Reunion',
      RO: 'Romania',
      RS: 'Serbia',
      RU: 'Russia',
      RW: 'Rwanda',
      SA: 'Saudi Arabia',
      SB: 'Solomon Islands',
      SC: 'Seychelles',
      SD: 'Sudan',
      SE: 'Sweden',
      SG: 'Singapore',
      SH: 'Saint Helena, Ascension and Tristan da Cunha',
      SI: 'Slovenia',
      SJ: 'Svalbard and Jan Mayen',
      SK: 'Slovakia',
      SL: 'Sierra Leone',
      SM: 'San Marino',
      SN: 'Senegal',
      SO: 'Somalia',
      SR: 'Suriname',
      SS: 'South Sudan',
      ST: 'Sao Tome and Principe',
      SV: 'El Salvador',
      SX: 'Sint Maarten (Dutch part)',
      SY: 'Syria',
      SZ: 'Swaziland',
      TC: 'Turks and Caicos Islands',
      TD: 'Chad',
      TF: 'French Southern Territories',
      TG: 'Togo',
      TH: 'Thailand',
      TJ: 'Tajikistan',
      TK: 'Tokelau',
      TL: 'Timor-Leste',
      TM: 'Turkmenistan',
      TN: 'Tunisia',
      TO: 'Tonga',
      TR: 'Turkey',
      TT: 'Trinidad and Tobago',
      TV: 'Tuvalu',
      TW: 'Taiwan',
      TZ: 'Tanzania',
      UA: 'Ukraine',
      UG: 'Uganda',
      UM: 'United States Minor Outlying Islands',
      US: 'United States',
      UY: 'Uruguay',
      UZ: 'Uzbekistan',
      VA: 'Holy See',
      VC: 'Saint Vincent and the Grenadines',
      VE: 'Venezuela',
      VG: 'Virgin Islands, British',
      VI: 'Virgin Islands, U.S.',
      VN: 'Viet Nam',
      VU: 'Vanuatu',
      WF: 'Wallis and Futuna',
      WS: 'Samoa',
      XK: 'Kosovo',
      YE: 'Yemen',
      YT: 'Mayotte',
      ZA: 'South Africa',
      ZM: 'Zambia',
      ZW: 'Zimbabwe'
    }
  },
  get: function get(code, language) {
    var data = this.name[language || config.get('language') || 'english'];
    return has.call(data, code) ? data[code] : code;
  }
};
var xe = {
  exchangeRate: JSON.parse(GM_getValue('SBSE_xe', '{}')),
  currencies: {
    AUD: {
      english: 'Australian Dollar',
      tchinese: '澳幣',
      schinese: '澳元',
      symbol: 'AU$',
      decimal: true
    },
    CAD: {
      english: 'Canadian Dollar',
      tchinese: '加幣',
      schinese: '加元',
      symbol: 'CA$',
      decimal: true
    },
    CNY: {
      english: 'Chinese Yuan',
      tchinese: '人民幣',
      schinese: '人民币',
      symbol: 'CN¥',
      decimal: true
    },
    EUR: {
      english: 'Euro',
      tchinese: '歐元',
      schinese: '欧元',
      symbol: '€',
      decimal: true
    },
    GBP: {
      english: 'Great Britain Pound',
      tchinese: '英鎊',
      schinese: '英镑',
      symbol: '£',
      decimal: true
    },
    HKD: {
      english: 'Hong Kong Dollar',
      tchinese: '港幣',
      schinese: '港元',
      symbol: 'HK$',
      decimal: false
    },
    JPY: {
      english: 'Japanese Yen',
      tchinese: '日圓',
      schinese: '日元',
      symbol: 'JP¥',
      decimal: false
    },
    KRW: {
      english: 'South Korean Won',
      tchinese: '韓圓',
      schinese: '韩币',
      symbol: '₩',
      decimal: false
    },
    MYR: {
      english: 'Malaysian Ringgit',
      tchinese: '令吉',
      schinese: '林吉特',
      symbol: 'RM',
      decimal: true
    },
    NTD: {
      english: 'New Taiwan Dollar',
      tchinese: '台幣',
      schinese: '台币',
      symbol: 'NT$',
      decimal: false
    },
    NZD: {
      english: 'New Zealand Dollar',
      tchinese: '紐幣',
      schinese: '新西兰元',
      symbol: 'NZ$',
      decimal: true
    },
    RUB: {
      english: 'Russian Ruble',
      tchinese: '盧布',
      schinese: '卢布',
      symbol: '₽',
      decimal: false
    },
    USD: {
      english: 'United States Dollar',
      tchinese: '美元',
      schinese: '美元',
      symbol: 'US$',
      decimal: true
    }
  },
  getRate: function getRate() {
    var self = this;
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml',
      onload: function onload(res) {
        if (res.status === 200) {
          try {
            var exchangeRate = {
              lastUpdate: Date.now(),
              rates: {}
            };
            res.response.split(eol).forEach(function (line) {
              if (line.includes('currency=')) {
                var currency = line.split('currency=\'').pop().slice(0, 3);
                var rate = line.trim().split('rate=\'').pop().slice(0, -3);
                exchangeRate.rates[currency] = parseFloat(rate);
              }
            });
            exchangeRate.rates.EUR = 1; // get NTD

            GM_xmlhttpRequest({
              method: 'GET',
              url: 'https://www.google.com/search?q=1+EUR+%3D+NTD',
              onload: function onload(searchRes) {
                var rate = parseFloat(searchRes.response.split('<div class="vk_ans vk_bk">').pop().slice(0, 7).trim());
                var NTDRate = isNaN(rate) ? exchangeRate.rates.HKD * 3.75 : rate;
                exchangeRate.rates.NTD = NTDRate;
                self.exchangeRate = exchangeRate;
                GM_setValue('SBSE_xe', JSON.stringify(exchangeRate));
              }
            }); // get UAH

            GM_xmlhttpRequest({
              method: 'GET',
              url: 'https://www.google.com/search?q=1+EUR+%3D+UAH',
              onload: function onload(searchRes) {
                var rate = parseFloat(searchRes.response.split('<div class="vk_ans vk_bk">').pop().slice(0, 7).trim());
                var UAHRate = isNaN(rate) ? 32.85 : rate;
                exchangeRate.rates.UAH = UAHRate;
                self.exchangeRate = exchangeRate;
                GM_setValue('SBSE_xe', JSON.stringify(exchangeRate));
              }
            });
          } catch (e) {
            swal('Parsing Failed', 'An error occured when parsing exchange rate data, please reload to try again', 'error');
          }
        } else {
          swal('Loading Failed', 'Unable to fetch exchange rate data, please reload to try again', 'error');
        }
      }
    });
  },
  update: function update() {
    var _this = this;

    var targetCurrency = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'USD';
    $('.SBSE-price').each(function (i, ele) {
      var originalCurrency = ele.dataset.currency;
      var originalValue = parseInt(ele.dataset.value, 10);
      var originalRate = _this.exchangeRate.rates[originalCurrency];
      var targetRate = _this.exchangeRate.rates[targetCurrency];
      var exchangedValue = Math.trunc(originalValue / originalRate * targetRate);
      var symbol = _this.currencies[targetCurrency].symbol;
      var decimalPlace = _this.currencies[targetCurrency].decimal ? 2 : 0;
      $(ele).text(symbol + (exchangedValue / 100).toFixed(decimalPlace));
    });
    GM_setValue('SBSE_selectedCurrency', targetCurrency);
  },
  init: function init() {
    var _this2 = this;

    var updateTimer = 12 * 60 * 60 * 1000; // update every 12 hours

    var newRate = ['UAH'];
    if (Object.keys(this.exchangeRate).length === 0 || this.exchangeRate.lastUpdate < Date.now() - updateTimer || newRate.filter(function (x) {
      return !has.call(_this2.exchangeRate.rates, x);
    }).length > 0) this.getRate();
  }
};
var steam = {
  library: JSON.parse(GM_getValue('SBSE_steam_library', '{}')),
  games: JSON.parse(GM_getValue('SBSE_steam_games', '{}')),
  getSessionID: function () {
    var _getSessionID = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var res, accountID, sessionID;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return request({
                method: 'GET',
                url: 'https://store.steampowered.com/'
              });

            case 2:
              res = _context.sent;

              if (res.status === 200) {
                accountID = res.response.match(/g_AccountID = (\d+)/).pop();
                sessionID = res.response.match(/g_sessionID = "(\w+)"/).pop();
                if (accountID > 0) config.set('sessionID', sessionID);else {
                  swal({
                    title: i18n.get('notLoggedInTitle'),
                    text: i18n.get('notLoggedInMsg'),
                    type: 'error',
                    showCancelButton: true
                  }).then(function (result) {
                    if (result.value === true) window.open('https://store.steampowered.com/');
                  });
                }
              }

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function getSessionID() {
      return _getSessionID.apply(this, arguments);
    }

    return getSessionID;
  }(),
  sync: function sync() {
    var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    if (!isArray(a) || a.length === 0) {
      a.push({
        key: 'library',
        sync: true,
        save: true
      }, {
        key: 'games',
        sync: true,
        save: true
      });
    }

    var self = this;
    a.forEach(function (o) {
      if (o.key === 'library' && o.sync !== false) {
        if (o.notify === true) swal.showLoading();
        GM_xmlhttpRequest({
          method: 'GET',
          url: "https://store.steampowered.com/dynamicstore/userdata/t=".concat(Math.random()),
          onload: function onload(res) {
            var data = JSON.parse(res.response);
            if (!isObject(self.library)) self.reset([o]);
            self.library.owned = {
              app: isArray(data.rgOwnedApps) ? data.rgOwnedApps : [],
              sub: isArray(data.rgOwnedPackages) ? data.rgOwnedPackages : []
            };
            self.library.wished = {
              app: isArray(data.rgWishlist) ? data.rgWishlist : [],
              sub: []
            };
            self.library.ignored = {
              app: isArray(data.rgIgnoredApps) ? data.rgIgnoredApps : [],
              sub: isArray(data.rgIgnoredPackages) ? data.rgIgnoredPackages : []
            };
            self.library.lastSync = Date.now();
            self.save([o]);

            if (o.notify === true) {
              swal({
                title: i18n.get('syncSuccessTitle'),
                text: i18n.get('syncSuccess'),
                type: 'success',
                timer: 3000
              });
            }

            if (typeof o.callback === 'function') o.callback();
          },
          onerror: function onerror() {
            swal({
              title: i18n.get('syncFailTitle'),
              text: i18n.get('syncFail'),
              type: 'error',
              confirmButtonText: i18n.get('visitSteam'),
              showCancelButton: true
            }).then(function (result) {
              if (result.value === true) window.open('https://store.steampowered.com/');
            });
          }
        });
      }

      if (o.key === 'games' && o.sync !== false) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: 'https://steamspy.com/api.php?request=all',
          onload: function onload(res) {
            try {
              var data = JSON.parse(res.response);
              self.games = {
                list: Object.keys(data).map(function (x) {
                  return parseInt(x, 10);
                }),
                lastSync: Date.now()
              };
              self.save([o]);
              if (typeof o.callback === 'function') o.callback();
            } catch (e) {
              throw e.stack;
            }
          }
        });
      }
    });
  },
  reset: function reset() {
    var _this3 = this;

    var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    if (!isArray(a) || a.length === 0) {
      a.push({
        key: 'library',
        reset: true,
        save: true
      }, {
        key: 'games',
        reset: true,
        save: true
      });
    }

    a.forEach(function (o) {
      if (o.key === 'library' && o.reset !== false) {
        _this3.library = {
          lastSync: 0,
          owned: {
            app: [],
            sub: []
          },
          wished: {
            app: [],
            sub: []
          },
          ignored: {
            app: [],
            sub: []
          }
        };
      }

      if (o.key === 'games' && o.reset !== false) {
        _this3.games = {
          lastSync: 0,
          list: []
        };
      }

      if (o.save !== false) _this3.save([o]);
    });
  },
  save: function save() {
    var _this4 = this;

    var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    if (!isArray(a) || a.length === 0) {
      a.push({
        key: 'library',
        save: true
      }, {
        key: 'games',
        save: true
      });
    }

    a.forEach(function (o) {
      if (has.call(_this4, o.key) && o.save !== false) {
        GM_setValue("SBSE_steam_".concat(o.key), JSON.stringify(_this4[o.key]));
        if (typeof o.callback === 'function') o.callback();
      }
    });
  },
  lastSync: function lastSync(key) {
    return has.call(this, key) ? this[key].lastSync : null;
  },
  isOwned: function isOwned(o) {
    return this.library.owned.app.includes(o.app) || this.library.owned.sub.includes(o.sub);
  },
  isWished: function isWished(o) {
    return this.library.wished.app.includes(o.app) || this.library.wished.sub.includes(o.sub);
  },
  isIgnored: function isIgnored(o) {
    return this.library.ignored.app.includes(o.app) || this.library.ignored.sub.includes(o.sub);
  },
  isGame: function isGame(o) {
    return this.games.list.length > 0 && this.games.list.includes(o.app);
  },
  isDLC: function isDLC(o) {
    return has.call(o, 'app') && this.games.list.length > 0 && !this.games.list.includes(o.app);
  },
  isPackage: function isPackage(o) {
    return has.call(o, 'sub');
  },
  init: function init() {
    if (!isObject(this.library) || !has.call(this.library, 'owned') || !has.call(this.library, 'wished') || !has.call(this.library, 'ignored')) this.reset([{
      key: 'library'
    }]);
    if (!isObject(this.games) || !has.call(this.games, 'list')) this.reset([{
      key: 'games'
    }]);

    if (config.get('autoSyncLibrary')) {
      // sync Steam library every 10 min
      var libraryTimer = 10 * 60 * 1000;
      var libraryLastSync = this.lastSync('library');
      if (!libraryLastSync || libraryLastSync < Date.now() - libraryTimer) this.sync([{
        key: 'library'
      }]); // sync Steam games list every day

      var gamesTimer = 1 * 24 * 60 * 60 * 1000;
      var gamesLastSync = this.lastSync('games');
      if (!gamesLastSync || gamesLastSync < Date.now() - gamesTimer || this.games.list.length === 0) this.sync([{
        key: 'games'
      }]);
    } // delete odd values


    GM_deleteValue('SBSE_steam');
  }
};
var activator = {
  activated: JSON.parse(GM_getValue('SBSE_activated', '[]')),
  isActivated: function isActivated(key) {
    return this.activated.includes(key);
  },
  pushActivated: function pushActivated(key) {
    this.activated.push(key);
    GM_setValue('SBSE_activated', JSON.stringify(this.activated));
  },
  keyDetails: {},
  isOwned: function isOwned(key) {
    return has.call(this.keyDetails, key) ? this.keyDetails[key].owned : false;
  },
  pushKeyDetails: function pushKeyDetails(data) {
    if (!has.call(this.keyDetails, data.key)) this.keyDetails[data.key] = data;
  },
  getKeyDetails: function getKeyDetails(key) {
    return has.call(this.keyDetails, key) ? this.keyDetails[key] : null;
  },
  results: [],
  resultDetails: function resultDetails(result) {
    // result from Steam
    if (result.SBSE !== true) {
      // get status
      var status = i18n.get('failStatus');
      var statusMsg = i18n.get('failDetailUnexpected');
      var errorCode = result.purchase_result_details;
      var errors = {
        14: i18n.get('failDetailInvalidKey'),
        15: i18n.get('failDetailUsedKey'),
        53: i18n.get('failDetailRateLimited'),
        13: i18n.get('failDetailCountryRestricted'),
        9: i18n.get('failDetailAlreadyOwned'),
        24: i18n.get('failDetailMissingBaseGame'),
        36: i18n.get('failDetailPS3Required'),
        50: i18n.get('failDetailGiftWallet')
      };

      if (result.success === 1) {
        status = i18n.get('successStatus');
        statusMsg = i18n.get('successDetail');
      } else if (result.success === 2) {
        if (has.call(errors, errorCode)) statusMsg = errors[errorCode];
      }

      result.status = "".concat(status, "/").concat(statusMsg); // get description

      var info = result.purchase_receipt_info;
      var chuncks = [];

      if (info && info.line_items) {
        info.line_items.forEach(function (item) {
          var chunk = [];
          if (item.packageid > 0) chunk.push("sub: ".concat(item.packageid));
          if (item.appid > 0) chunk.push("app: ".concat(item.appid));
          chunk.push(item.line_item_description);
          chuncks.push(chunk.join(' '));
        });
      }

      result.descripton = chuncks.join(', ');
    }

    var temp = [result.key];
    if (result.status) temp.push(result.status);
    if (result.descripton) temp.push(result.descripton);
    return temp.join(' | ');
  },
  activate: function activate(keys, callback) {
    var _this5 = this;

    this.results.length = 0;

    var updateResults = function updateResults() {
      $('.SBSE-container__content__model[data-feature="SBSE"] > textarea').val(_this5.results.concat(keys).join(eol));
    };

    var activateHandler = function activateHandler() {
      var key = keys.shift();

      if (key) {
        if (_this5.isActivated(key)) {
          _this5.results.push(_this5.resultDetails({
            SBSE: true,
            key: key,
            status: "".concat(i18n.get('skippedStatus'), "/").concat(i18n.get('activatedDetail')),
            descripton: i18n.get('noItemDetails')
          }));

          updateResults(); // next key

          activateHandler();
        } else if (_this5.isOwned(key) && !config.get('activateAllKeys')) {
          var detail = _this5.getKeyDetails(key);

          var description = [];
          ['app', 'sub'].forEach(function (type) {
            if (has.call(detail, type)) description.push("".concat(type, ": ").concat(detail[type], " ").concat(detail.title));
          });

          _this5.results.push(_this5.resultDetails({
            SBSE: true,
            key: key,
            status: "".concat(i18n.get('skippedStatus'), "/").concat(i18n.get('failDetailAlreadyOwned')),
            descripton: description.join()
          }));

          updateResults(); // next key

          activateHandler();
        } else {
          var self = _this5;
          GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://store.steampowered.com/account/ajaxregisterkey/',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Origin: 'https://store.steampowered.com',
              Referer: 'https://store.steampowered.com/account/registerkey'
            },
            data: "product_key=".concat(key, "&sessionid=").concat(config.get('sessionID')),
            onload: function onload(res) {
              if (res.status === 200) {
                var result = JSON.parse(res.response); // update activated

                var failCode = result.purchase_result_details;

                if (result.success === 1 || [14, 15, 9].includes(failCode)) {
                  self.pushActivated(key); // dispatch activated event

                  $(document).trigger('activated', [key, result]);
                }

                result.key = key;
                self.results.push(self.resultDetails(result));
                updateResults(); // next key

                setTimeout(activateHandler.bind(self), 2000);
              } else {
                var errorMsg = [];
                errorMsg.push('<pre class="SBSE-errorMsg">');
                errorMsg.push("sessionID: ".concat(config.get('sessionID') + eol));
                errorMsg.push("autoUpdate: ".concat(config.get('autoUpdateSessionID') + eol));
                errorMsg.push("status: ".concat(res.status + eol));
                errorMsg.push("response: ".concat(res.response + eol));
                errorMsg.push('</pre>');
                swal({
                  title: i18n.get('failTitle'),
                  html: i18n.get('failDetailRequestFailedNeedUpdate') + eol + errorMsg.join(''),
                  type: 'error'
                });
                steam.getSessionID();
                if (typeof callback === 'function') callback();
              }
            }
          });
        }
      } else if (typeof callback === 'function') callback();
    };

    activateHandler();
  }
}; // models

var settings = {
  model: null,
  getModel: function getModel() {
    return this.model instanceof $ ? this.model : $();
  },
  display: function display() {
    swal({
      title: i18n.get('settingsTitle'),
      onBeforeOpen: function onBeforeOpen(dom) {
        $(dom).find('.swal2-content').append(settings.getModel());
      }
    });
  },
  init: function init() {
    var settingDetails = [{
      name: i18n.get('settingsAutoUpdateSessionID'),
      configItem: 'autoUpdateSessionID',
      type: 'switch'
    }, {
      name: i18n.get('settingsSessionID'),
      configItem: 'sessionID',
      type: 'text'
    }, {
      name: i18n.get('settingsAutoSyncLibrary'),
      configItem: 'autoSyncLibrary',
      type: 'switch'
    }, {
      name: i18n.get('settingsSyncLibrary'),
      configItem: 'syncLibrary',
      type: 'button',
      textContent: i18n.get('settingsSyncLibraryButton')
    }, {
      name: i18n.get('settingsLanguage'),
      configItem: 'language',
      type: 'select'
    }, {
      name: i18n.get('settingsASFFormat'),
      configItem: 'ASFFormat',
      type: 'switch'
    }, {
      name: i18n.get('settingsTitleComesLast'),
      configItem: 'titleComesLast',
      type: 'switch'
    }, {
      name: i18n.get('settingsActivateAllKeys'),
      configItem: 'activateAllKeys',
      type: 'switch'
    }, {
      name: i18n.get('settingsEnableTooltips'),
      configItem: 'enableTooltips',
      type: 'switch'
    }, {
      name: i18n.get('settingshighlightedRegions'),
      configItem: 'highlightedRegions',
      type: 'button',
      textContent: i18n.get('settingshighlightedRegionsButton')
    }, {
      name: i18n.get('settingsEnableASFIPC'),
      configItem: 'enableASFIPC',
      type: 'switch'
    }, {
      name: i18n.get('settingsASFWSProtocol'),
      configItem: 'ASFWSProtocol',
      type: 'select',
      options: ['ws', 'wss']
    }, {
      name: i18n.get('settingsASFIPCProtocol'),
      configItem: 'ASFIPCProtocol',
      type: 'select',
      options: ['http', 'https']
    }, {
      name: i18n.get('settingsASFIPCServer'),
      configItem: 'ASFIPCServer',
      type: 'text'
    }, {
      name: i18n.get('settingsASFIPCPort'),
      configItem: 'ASFIPCPort',
      type: 'text'
    }, {
      name: i18n.get('settingsASFIPCPassword'),
      configItem: 'ASFIPCPassword',
      type: 'text'
    }];
    var $model = $('<div class="SBSE-container__content__model" data-feature="setting"><table></table></div>'); // append settings

    settingDetails.forEach(function (detail) {
      var $tr = $("<tr><td class=\"name\">".concat(detail.name, "</td><td class=\"value\"></td></tr>")).appendTo($model.find('table'));

      switch (detail.type) {
        case 'switch':
          $tr.find('.value').append("\n            <label class=\"SBSE-switch\">\n              <input type=\"checkbox\" data-config=\"".concat(detail.configItem, "\">\n              <span class=\"SBSE-switch__slider\"></span>\n            </label>\n          "));
          break;

        case 'text':
          $tr.find('.value').append("<input type=\"text\" data-config=\"".concat(detail.configItem, "\" value=\"").concat(config.get(detail.configItem), "\">"));
          break;

        case 'button':
          $tr.find('.value').append("<button data-config=\"".concat(detail.configItem, "\">").concat(detail.textContent, "</button>"));
          break;

        case 'select':
          $tr.find('.value').append("<select data-config=\"".concat(detail.configItem, "\"></select>"));
          if (detail.options) $tr.find('select').append("".concat(detail.options.map(function (x) {
            return "<option value=\"".concat(x, "\">").concat(x, "</option>");
          })));
          break;

        default:
      }
    }); // append report section

    $model.find('table').append("\n      <tr>\n        <td class=\"name\">".concat(i18n.get('settingsReportIssues'), "</td>\n        <td class=\"value\">\n          <a href=\"https://keylol.com/t305330-1-1\" target=\"_blank\">\u5176\u4E50 Keylol</a>\n          <a href=\"https://github.com/clancy-chao/Steam-Bundle-Sites-Extension/issues\" target=\"_blank\">GitHub</a>\n        </td>\n      </tr>\n    ")); // apply settings

    var $sessionID = $model.find('[data-config="sessionID"]');
    var $language = $model.find('[data-config="language"]');
    var $ASFIPC = $model.find('[data-config^="ASFIPC"], [data-config^="ASFWS"]'); // toggles

    $model.find('.SBSE-switch input[type="checkbox"]').each(function (i, input) {
      var $input = $(input);
      $input.prop('checked', config.get(input.dataset.config));
      $input.on('change', function (e) {
        swal.showLoading();
        var configItem = e.delegateTarget.dataset.config;
        var state = e.delegateTarget.checked;
        config.set(configItem, state);
        if (configItem === 'autoUpdateSessionID') $sessionID.prop('disabled', state);
        if (configItem === 'enableASFIPC') $ASFIPC.prop('disabled', !state);
        setTimeout(swal.hideLoading, 500);
      });
    }); // toggle - disable related fields
    // sessionID

    $sessionID.prop('disabled', config.get('autoUpdateSessionID'));
    $ASFIPC.prop('disabled', !config.get('enableASFIPC')); // input text

    $model.find('input[type="text"]').on('input', function (e) {
      swal.showLoading();
      var configItem = e.delegateTarget.dataset.config;
      var value = e.delegateTarget.value.trim();
      config.set(configItem, value);
      setTimeout(swal.hideLoading, 500);
    }); // select

    $model.find('select').on('change', function (e) {
      swal.showLoading();
      var configItem = e.delegateTarget.dataset.config;
      var value = e.delegateTarget.value;
      config.set(configItem, value);
      if (configItem === 'language') i18n.set();
      setTimeout(swal.hideLoading, 500);
    }); // select - language options

    Object.keys(i18n.data).forEach(function (lang) {
      $language.append(new Option(i18n.data[lang].name, lang));
    }); // select - language

    $language.val(config.get('language')); // select - ASF protocols

    $ASFIPC.filter('select[data-config="ASFIPCProtocol"]').val(config.get('ASFIPCProtocol'));
    $ASFIPC.filter('select[data-config="ASFWSProtocol"]').val(config.get('ASFWSProtocol')); // button - sync library

    $model.find('[data-config="syncLibrary"]').on('click', function () {
      steam.sync([{
        key: 'library',
        notify: true
      }]);
    }); // button - select regions

    $model.find('[data-config="highlightedRegions"]').on('click', function () {
      swal({
        title: i18n.get('settingshighlightedRegionsButton'),
        width: '1200px',
        onBeforeOpen: function onBeforeOpen(dom) {
          var data = Object.assign({}, ISO2.name.english);
          ;
          var sortedCode = Object.keys(data).sort(function (a, b) {
            return data[a] < data[b] ? -1 : data[a] > data[b] ? 1 : 0;
          });
          var separators = {
            A: 'A',
            B: 'B',
            C: 'C',
            D: 'D, E, F',
            G: 'G, H, I',
            J: 'J, K, L',
            M: 'M',
            N: 'N',
            O: 'O, P, Q, R',
            S: 'S',
            T: 'T',
            U: 'U, V, W, X, Y, Z'
          };
          var html = '';
          sortedCode.forEach(function (code) {
            if (separators[data[code].charAt(0)]) {
              html += "<span class=\"separator\">".concat(separators[data[code].charAt(0)], "</span>");
              separators[data[code].charAt(0)] = undefined;
            }

            html += "<span data-code=\"".concat(code, "\">").concat(ISO2.get(code), "</span>");
          });
          $(dom).find('.swal2-content').append("<div class=\"SBSE-grid\">".concat(html, "</div>"));
          $(dom).find('.swal2-content span[data-code]').on('click', function (e) {
            $(e.delegateTarget).toggleClass('selected');
          });
          config.get('highlightedRegions').forEach(function (code) {
            $(dom).find(".swal2-content span[data-code=\"".concat(code, "\"]")).addClass('selected');
          });
        },
        onClose: function onClose(dom) {
          config.set('highlightedRegions', $(dom).find(".swal2-content span[data-code].selected").map(function (i, ele) {
            return $(ele).attr('data-code');
          }).get());
        },
        onAfterClose: settings.display
      });
    });
    this.model = $model;
  }
};
var SBSE = {
  model: null,
  handlers: {
    extract: function extract() {
      return {
        items: []
      };
    },
    retrieve: function retrieve() {
      var $model = SBSE.getModel();
      var data = this.extract();
      var keys = [];
      var includeTitle = $model.find('.SBSE-checkbox-title').prop('checked');
      var joinKeys = $model.find('.SBSE-checkbox-join').prop('checked');
      var selected = $model.find('.SBSE-select-filter').val() || 'All';
      var skipUsed = $model.find('.SBSE-checkbox-skipUsed').prop('checked');
      var skipMarketListing = !$model.find('.SBSE-checkbox-marketListings').prop('checked');
      var separator = joinKeys ? ',' : eol;
      var prefix = joinKeys && config.get('ASFFormat') ? '!redeem ' : '';

      for (var i = 0; i < data.items.length; i += 1) {
        var item = data.items[i];
        var skip = false;
        if (selected === 'Owned' && !item.owned) skip = true;
        if (selected === 'NotOwned' && item.owned) skip = true;
        if (skipUsed && item.used) skip = true;
        if (skipMarketListing && item.marketListing) skip = true;

        if (!skip) {
          var temp = [item.key];

          if (config.get('ASFFormat')) {
            if (!joinKeys) temp.unshift(item.title);
            keys.push(temp.join(tab));
          } else {
            if (includeTitle) temp.unshift(item.title);
            if (config.get('titleComesLast')) temp.reverse();
            keys.push(temp.join(', '));
          }
        }
      }

      $model.find('textarea').val(prefix + keys.join(separator));
    },
    activate: function activate(e) {
      var $textarea = SBSE.getModel().find('textarea');
      var keys = unique($textarea.val().match(regKey));

      if (keys.length > 0) {
        var $activateBtn = $(e.currentTarget);
        $activateBtn.prop('disabled', true).addClass('SBSE-button--working');
        $textarea.prop('disabled', true);
        $textarea.val(keys.join(eol));
        activator.activate(keys, function () {
          $activateBtn.prop('disabled', false).removeClass('SBSE-button--working');
          $textarea.prop('disabled', false);
        });
      } else $textarea.val(i18n.get('emptyInput'));
    },
    copy: function copy() {
      SBSE.getModel().find('textarea').select();
      document.execCommand('copy');
    },
    reset: function reset() {
      SBSE.getModel().find('textarea').val('');
    },
    "export": function _export(e) {
      var data = this.extract();

      if (data.items.length > 0) {
        var exportBtn = e.target;
        exportBtn.removeAttribute('href');
        exportBtn.removeAttribute('download');
        var fileType = exportBtn.dataset.filetype || 'txt';
        var filename = data.filename.replace(/[\\/:*?"<>|!]/g, '');
        var separator = {
          txt: ', ',
          csv: ',',
          keys: tab
        };
        var formattedData = data.items.map(function (line) {
          var temp = [];
          if (line.title) temp.push(line.title.replace(/,/g, ' '));
          temp.push(line.key);
          return temp.join(separator[fileType]);
        }).join(eol);
        exportBtn.href = "data:text/".concat(fileType, ";charset=utf-8,\uFEFF").concat(encodeURIComponent(formattedData));
        exportBtn.download = "".concat(filename, ".").concat(fileType);
      }
    }
  },
  setHandlers: function setHandlers(handlers) {
    this.handlers = Object.assign(this.handlers, handlers);
  },
  getModel: function getModel() {
    return this.model instanceof $ ? this.model : $();
  },
  init: function init() {
    // construct SBSE model
    var $model = $('<div class="SBSE-container__content__model" data-feature="SBSE"></div>');
    $model.append("\n      <textarea></textarea>\n        <div>\n          <button class=\"SBSE-button SBSE-button-reveal\">".concat(i18n.get('buttonReveal'), "</button>\n          <button class=\"SBSE-button SBSE-button-retrieve\">").concat(i18n.get('buttonRetrieve'), "</button>\n          <button class=\"SBSE-button SBSE-button-activate\">").concat(i18n.get('buttonActivate'), "</button>\n          <button class=\"SBSE-button SBSE-button-copy\">").concat(i18n.get('buttonCopy'), "</button>\n          <button class=\"SBSE-button SBSE-button-reset\">").concat(i18n.get('buttonReset'), "</button>\n          <div class=\"SBSE-dropdown SBSE-dropdown-export\">\n            <button class=\"SBSE-button SBSE-button-export\">").concat(i18n.get('buttonExport'), "</button>\n            <ul class=\"SBSE-dropdown__list SBSE-dropdown__list-export\">\n              <li><a data-fileType=\"txt\">.txt</a></li>\n              <li><a data-fileType=\"csv\">.csv</a></li>\n              <li><a data-fileType=\"keys\">.keys</a></li>\n            </ul>\n          </div>\n          <label><input type=\"checkbox\" class=\"SBSE-checkbox SBSE-checkbox-title\" data-config=\"SBSE_ChkTitle\">").concat(i18n.get('checkboxIncludeGameTitle'), "</label>\n          <label><input type=\"checkbox\" class=\"SBSE-checkbox SBSE-checkbox-join\" data-config=\"SBSE_ChkJoin\">").concat(i18n.get('checkboxJoinKeys'), "</label>\n          <select class=\"SBSE-select SBSE-select-filter\">\n            <option value=\"All\" selected>").concat(i18n.get('selectFilterAll'), "</option>\n            <option value=\"Owned\">").concat(i18n.get('selectFilterOwned'), "</option>\n            <option value=\"NotOwned\">").concat(i18n.get('selectFilterNotOwned'), "</option>\n          </select>\n          <button class=\"SBSE-button-setting\"> </button>\n      </div>\n    ")); // bind handlers

    var handlers = this.handlers;
    $model.find('button').click(function (e) {
      e.preventDefault();
    });
    $model.find('.SBSE-button-reveal').on('click.reveal', function (e) {
      handlers.reveal(e);
    });
    $model.find('.SBSE-button-retrieve').on('click.retrieve', function (e) {
      handlers.retrieve(e);
    });
    $model.find('.SBSE-button-activate').on('click.activate', function (e) {
      handlers.activate(e);
    });
    $model.find('.SBSE-button-copy').on('click.copy', function (e) {
      handlers.copy(e);
    });
    $model.find('.SBSE-button-reset').on('click.reset', function (e) {
      handlers.reset(e);
    });
    $model.find('.SBSE-dropdown__list-export').on('click.export', function (e) {
      handlers["export"](e);
    });
    $model.find('.SBSE-button-setting').on('click.setting', settings.display);
    $model.find('.SBSE-checkbox').on('change', function (e) {
      var key = e.currentTarget.dataset.config;
      if (key.length > 0) config.set(key, e.currentTarget.checked);
    }); // apply settings

    if (config.get('SBSE_ChkTitle')) $model.find('.SBSE-checkbox-title').prop('checked', true);
    if (config.get('SBSE_ChkJoin')) $model.find('.SBSE-checkbox-join').prop('checked', true);
    this.model = $model;
  }
};
var ASF = {
  model: null,
  terminal: {},
  getModel: function getModel() {
    return this.model instanceof $ ? this.model : $();
  },
  scrollToBottom: function scrollToBottom(key) {
    var terminal = this.terminal[key];
    if (terminal instanceof $) terminal.scrollTop(terminal[0].scrollHeight);
  },
  push: function push(key, line) {
    this.terminal[key].append("<span class=\"SBSE-terminal__message\">".concat(line, "</span>"));
    this.scrollToBottom(key);
  },
  listenLogs: function listenLogs() {
    var self = this;
    self.push('log', 'Establishing connection to ASF IPC server');
    var protocol = config.get('ASFWSProtocol');
    var domain = "".concat(config.get('ASFIPCServer'), ":").concat(config.get('ASFIPCPort'));
    var password = config.get('ASFIPCPassword');
    var url = "".concat(protocol, "://").concat(domain, "/Api/NLog").concat(password.length > 0 ? "?password=".concat(password) : '');

    try {
      var ws = new WebSocket(url);
      ws.addEventListener('open', function () {
        self.push('log', 'Connection established');
      });
      ws.addEventListener('error', function () {
        self.push('log', 'An error occured while connecting to ASF IPC server');
      });
      ws.addEventListener('message', function (e) {
        try {
          var data = JSON.parse(e.data);
          self.push('log', data.Result);
        } catch (error) {
          self.push('log', error.stack);
        }
      });
    } catch (error) {
      self.push('log', "Failed to establish connection, error message: ".concat(error.message));
    }
  },
  initCommands: function () {
    var _initCommands = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var ipc, self, requestOptions, sendCommand, $input, $hint, resCommands, html, $html, commands, resBots, data;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              ipc = {
                protocol: config.get('ASFIPCProtocol'),
                server: config.get('ASFIPCServer'),
                port: config.get('ASFIPCPort'),
                password: config.get('ASFIPCPassword'),
                commands: {},
                bots: []
              };
              self = ASF;

              requestOptions = function requestOptions(method, pathname) {
                var options = {
                  method: method
                };
                options.url = "".concat(ipc.protocol, "://").concat(ipc.server, ":").concat(ipc.port + pathname);
                if (ipc.password.length > 0) options.headers = {
                  Authentication: ipc.password
                };
                return options;
              };

              sendCommand = /*#__PURE__*/function () {
                var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(command) {
                  var res, data, msg;
                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          self.push('commands', command);
                          _context2.next = 3;
                          return request(requestOptions('POST', "/Api/Command/".concat(encodeURIComponent(command))));

                        case 3:
                          res = _context2.sent;

                          try {
                            data = JSON.parse(res.response);
                            msg = data.Success === true ? data.Result : data.Message;
                            self.push('commands', msg);
                          } catch (error) {
                            self.push('commands', error.stack);
                          }

                        case 5:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2);
                }));

                return function sendCommand(_x) {
                  return _ref.apply(this, arguments);
                };
              }(); // append terminal input


              $input = $("\n      <span class=\"SBSE-terminal__input\">\n        <input type=\"text\">\n        <input type=\"text\">\n      </span>\n    ").appendTo(self.terminal.commands).find('input:first-child');
              $hint = $input.next('input'); // bind event
              // display hint on input

              $input.on('input', function () {
                var newHint = '';
                var saved = $hint.attr('data-saved');
                var typed = $input.val().replace(/\s+/g, ' ');

                if (typed.length > 0) {
                  (function () {
                    var typedPieces = typed.split(' '); // perform a new search for command

                    if (!saved || saved.length === 0 || saved.indexOf(typedPieces[0]) === -1) {
                      saved = Object.keys(ipc.commands).find(function (x) {
                        return x.indexOf(typedPieces[0]) === 0;
                      }) || '';
                    }

                    var command = ipc.commands[saved]; // found matching command

                    if (isArray(command) && command.length > 0) {
                      var hintPieces = command.slice(0); // skip 1st piece as no need to process the command

                      var _loop = function _loop(i) {
                        if (typedPieces[i].length > 0) {
                          var newHintPiece = command[i]; // replace command argument if typed something

                          if (typedPieces[i].length > 0) newHintPiece = typedPieces[i]; // match bot name

                          if (command[i] === '<Bots>' || command[i] === '<TargetBot>') {
                            var found = ipc.bots.find(function (x) {
                              return x.indexOf(typedPieces[i]) === 0;
                            });
                            if (found) newHintPiece = found;
                          } // multiple arguments for last typed piece


                          if (i === typedPieces.length - 1 && newHintPiece.includes(',') && (command[i] === '<Bots>' || command[i] === '<GameIDs>' || command[i] === '<SteamIDs64>' || command[i] === '<AppIDs>' || command[i] === '<RealAppIDs>' || command[i] === '<AppIDsOrGameNames>' || command[i] === '<AppIDs,GameName>' || command[i] === '<Keys>' || command[i] === '<Modes>')) {
                            if (newHintPiece.slice(-1) === ',') {
                              newHintPiece += command[i];
                            } else if (command[i] === '<Bots>') {
                              var pieces = newHintPiece.split(',');
                              var last = pieces.length - 1;

                              var _found = ipc.bots.find(function (x) {
                                return x.indexOf(pieces[last]) === 0;
                              });

                              if (_found) {
                                pieces[last] = _found;
                                newHintPiece = pieces.join(',');
                              }
                            }
                          }

                          hintPieces[i] = newHintPiece;
                        }
                      };

                      for (var i = 1; i < typedPieces.length; i += 1) {
                        _loop(i);
                      }

                      newHint = hintPieces.filter(function (x) {
                        return x.length > 0;
                      }).join(' ');
                    }
                  })();
                } else saved = '';

                $hint.attr('data-saved', saved);
                $hint.val(newHint);
                $input.val(typed);
              }); // detect key board event

              $input.on('keydown', function (e) {
                // right arrow key, auto complete hint
                if (e.keyCode === 39 && $hint.val().length > $input.val().length) {
                  var bracket = $hint.val().indexOf('<');
                  var text = bracket > -1 ? $hint.val().slice(0, bracket) : $hint.val();
                  $input.val(text);
                } // enter key, send command


                if (e.keyCode === 13) {
                  sendCommand($input.val());
                  $input.val('');
                  $hint.val('');
                }
              }); // prevent the hint input getting focus

              $hint.on('focus', function () {
                $input.focus();
              }); // focus input field when click empty space

              self.terminal.commands.parent().on('click', function (e) {
                if ($(e.target).is('.SBSE-terminal-commands')) $input.focus();
              });
              self.push('commands', 'Fetching commands from ASF wiki'); // fetch commands

              _context3.next = 13;
              return request({
                method: 'GET',
                url: 'https://github.com/JustArchiNET/ArchiSteamFarm/wiki/Commands'
              });

            case 13:
              resCommands = _context3.sent;

              if (resCommands.status === 200) {
                html = resCommands.response.slice(resCommands.response.indexOf('<div id="wiki-body"'), resCommands.response.indexOf('<div id="wiki-rightbar"'));
                $html = $(html);
                commands = $html.find('h2:has(#user-content-commands-1) + table tbody tr td:first-child code').get().map(function (ele) {
                  return ele.innerText.trim();
                });
                commands.forEach(function (command) {
                  var pieces = command.split(' ');
                  ipc.commands[pieces[0]] = pieces;
                });
                self.push('commands', 'Commands successfully fetched');
              } else self.push('commands', 'Failed to fetch commands from ASF wiki, please refrsh to try again'); // fetch bots


              _context3.next = 17;
              return request(requestOptions('GET', '/api/bot/ASF'));

            case 17:
              resBots = _context3.sent;

              if (!(resBots.status === 200)) {
                _context3.next = 27;
                break;
              }

              _context3.prev = 19;
              data = JSON.parse(resBots.response);
              ipc.bots = Object.keys(data.Result);
              _context3.next = 27;
              break;

            case 24:
              _context3.prev = 24;
              _context3.t0 = _context3["catch"](19);
              throw _context3.t0;

            case 27:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[19, 24]]);
    }));

    function initCommands() {
      return _initCommands.apply(this, arguments);
    }

    return initCommands;
  }(),
  init: function init() {
    // construct SBSE model
    var $model = $('<div class="SBSE-container__content__model" data-feature="ASF"></div>');
    $model.append("\n      <div class=\"SBSE-terminal SBSE-terminal-commands\"><div></div></div>\n      <div class=\"SBSE-terminal SBSE-terminal-log SBSE-terminal--show\"><div></div></div>\n      <div>\n        <button class=\"SBSE-button SBSE-button-commands\">".concat(i18n.get('buttonCommands'), "</button>\n        <button class=\"SBSE-button SBSE-button-log\">").concat(i18n.get('buttonLog'), "</button>\n        <button class=\"SBSE-button-setting\"> </button>\n      </div>\n    "));
    $model.find('.SBSE-button-commands').on('click.commands', function () {
      $model.find('.SBSE-terminal--show').removeClass('SBSE-terminal--show');
      $model.find('.SBSE-terminal-commands').addClass('SBSE-terminal--show');
      $model.find('.SBSE-terminal__input input:first-child').focus();
    });
    $model.find('.SBSE-button-log').on('click.log', function () {
      $model.find('.SBSE-terminal--show').removeClass('SBSE-terminal--show');
      $model.find('.SBSE-terminal-log').addClass('SBSE-terminal--show');
    });
    $model.find('.SBSE-button-setting').on('click.setting', settings.display);
    this.model = $model;
    this.terminal.log = $model.find('.SBSE-terminal-log > div');
    this.terminal.commands = $model.find('.SBSE-terminal-commands > div');

    if (config.get('enableASFIPC')) {
      this.listenLogs();
      this.initCommands();
    } else {
      this.push('commands', 'ASF IPC feature not enabled, please go to settings and enable this feature');
      this.push('log', 'ASF IPC feature not enabled, please go to settings and enable this feature');
    }
  }
};
var container = {
  self: null,
  models: {},
  get: function get(feature, handlers) {
    this.show(feature);

    if (isObject(handlers)) {
      if (feature === 'SBSE') SBSE.setHandlers(handlers);
      if (feature === 'ASF') ASF.setHandlers(handlers);
    }

    return this.self;
  },
  show: function show(feature) {
    // nav
    this.self.find('.SBSE-container__nav__item--show').removeClass('SBSE-container__nav__item--show');
    this.self.find(".SBSE-container__nav__item[data-feature=\"".concat(feature, "\"]")).addClass('SBSE-container__nav__item--show'); // content

    this.self.find('.SBSE-container__content__model--show').removeClass('SBSE-container__content__model--show');
    this.self.find(".SBSE-container__content__model[data-feature=\"".concat(feature, "\"]")).addClass('SBSE-container__content__model--show');
  },
  init: function init() {
    this.self = $('<div class="SBSE-container"></div>');
    var $nav = $('<div class="SBSE-container__nav"></div>').appendTo(this.self);
    var $content = $('<div class="SBSE-container__content"></div>').appendTo(this.self); // construct nav

    $nav.append("\n      <ul>\n        <li class=\"SBSE-container__nav__item\" data-feature=\"SBSE\"><span>Steam Ext</span></li>\n        <li class=\"SBSE-container__nav__item\" data-feature=\"ASF\"><span>ASF IPC</span></li>\n      </ul>\n    "); // bind event

    $nav.find('.SBSE-container__nav__item').on('click', function (e) {
      var $target = $(e.delegateTarget);

      if (!$target.hasClass('SBSE-container__nav__item--show')) {
        container.show($target.attr('data-feature'));
      }
    }); // append models to content block

    this.models.SBSE = SBSE.getModel();
    this.models.ASF = ASF.getModel();
    $content.append(Object.values(this.models));
  }
};
var keylolTooltip = {
  timeoutID: 0,
  load: function load(data) {
    var _this6 = this;

    if (config.get('enableTooltips')) {
      var $container = $('<div/>');
      (Array.isArray(data) ? data : [data]).forEach(function (d) {
        var type = null;
        if (has.call(d, 'sub')) type = 'sub';
        if (has.call(d, 'app')) type = 'app';

        if (type !== null) {
          var url = "https://steamdb.keylol.com/tooltip?v=4#".concat(type, "/").concat(d[type], "#steam_info_").concat(type, "_").concat(d[type], "_1");
          $container.append($("<iframe id=\"SBSE-tooltip_".concat(type + d[type], "\" class=\"SBSE-tooltip\" data-url=\"").concat(url, "\"></iframe>")).mouseenter(function () {
            clearTimeout(_this6.timeoutID);
          }).mouseout(_this6.hide));
        }
      });
      $('body').append($container);
    }
  },
  show: function show(e) {
    var _this7 = this;

    var $target = $(e.currentTarget);
    var json = $target.closest('.SBSE-item--processed').attr('data-gameinfo');

    if (json.length > 0 && config.get('enableTooltips')) {
      var data = JSON.parse(json);
      var opened = !!$('.SBSE-tooltip--show').length;
      ['app', 'sub'].forEach(function (type) {
        var $tooltip = $("#SBSE-tooltip_".concat(type + data[type]));

        if ($tooltip.length > 0 && !opened) {
          // load tooltip
          if (!$tooltip.attr('src')) $tooltip.attr('src', $tooltip.attr('data-url'));
          $tooltip.css({
            top: e.clientY,
            left: e.clientX + 10
          }).addClass('SBSE-tooltip--show');

          _this7.reposition($tooltip, $tooltip.height());

          $tooltip[0].contentWindow.postMessage('show', '*'); // get height

          $target.one('mouseout', function () {
            _this7.timeoutID = setTimeout(_this7.hide.bind(keylolTooltip), 500);
          });
        }
      });
    }
  },
  hide: function hide() {
    var $tooltip = $('.SBSE-tooltip--show');

    if ($tooltip.length > 0) {
      $tooltip.removeClass('SBSE-tooltip--show');
      $tooltip[0].contentWindow.postMessage('hide', '*');
    }
  },
  reposition: function reposition($tooltip, height) {
    var $window = $(window);
    var $document = $(document);
    var offsetTop = $tooltip.offset().top - $document.scrollTop();
    var offsetLeft = $tooltip.offset().left - $document.scrollLeft();
    var overflowX = offsetLeft + $tooltip.width() - ($window.width() - 20);
    var overflowY = offsetTop + height - ($window.height() - 20);
    if (overflowY > 0) $tooltip.css('top', offsetTop - overflowY);
    if (overflowX > 0) $tooltip.css('left', offsetLeft - overflowX);
  },
  listen: function listen() {
    var _this8 = this;

    window.addEventListener('message', function (e) {
      if (e.origin === 'https://steamdb.keylol.com' && e.data.height && e.data.src) {
        var $tooltip = $(".SBSE-tooltip[src=\"".concat(e.data.src, "\"]"));
        $tooltip.height(e.data.height);

        _this8.reposition($tooltip, e.data.height);
      }
    });
  }
};
var siteHandlers = {
  indiegala: function indiegala() {
    // inject css
    GM_addStyle("\n      .SBSE-container { margin-top: 10px; }\n      .SBSE-container__nav__item--show { border-bottom: 1px solid #CC001D; color: #CC001D; }\n      .SBSE-container__content__model > textarea { border: 1px solid #CC001D; border-radius: 3px; }\n      .SBSE-button { width: 100px; background-color: #CC001D; color: white; border: none; border-radius: 3px; }\n      .swal2-popup .SBSE-switch__slider { margin: 0; }\n      .SBSE-icon { margin-top: 15px; }\n    ");
    var handlers = {
      extract: function extract() {
        var $tabCont = $('.profile-private-page-library-tab-cont');
        var $source = $tabCont.length > 1 ? $tabCont.filter('.profile-private-page-library-tab-active') : $tabCont;
        var bundleTitle = $('.profile-private-page-library-selected .profile-private-page-library-title').text().trim();
        var data = {
          title: bundleTitle,
          filename: "IndieGala ".concat(bundleTitle, " Keys"),
          items: []
        };
        $source.find('ul[class^="profile-private-page"][class$="-active"]').find('.profile-private-page-library-subitem').each(function (i, ele) {
          var $ele = $(ele);
          var key = $ele.find('input[class*="key-serial"]').val();

          if (key) {
            var d = JSON.parse($(ele).attr('data-gameinfo') || '{}');

            if (Object.keys(d).length === 0) {
              var $a = $ele.find('a[href*="steam"]');
              var matched = $a.attr('href').match(/steam.+\/(app|sub)\/(\d+)/);
              d.title = $ele.find('.profile-private-page-library-title *[title]').attr('title').trim();
              if (matched) d[matched[1]] = parseInt(matched[2], 10);
            }

            d.key = key;
            activator.pushKeyDetails(d);
            data.items.push(d);
          }
        });
        return data;
      },
      reveal: function reveal(e) {
        var $tabCont = $('.profile-private-page-library-tab-cont');
        var $source = $tabCont.length > 1 ? $tabCont.filter('.profile-private-page-library-tab-active') : $tabCont;
        var $revealBtn = $(e.currentTarget);
        var selected = $('.SBSE-select-filter').val() || 'All';

        var handler = function handler($games, callback) {
          var game = $games.shift();

          if (game) {
            var d = JSON.parse($(game).closest('.SBSE-item--processed').attr('data-gameinfo') || '{}');

            if (selected === 'All' || selected === 'Owned' && d.owned || selected === 'NotOwned' && !d.owned) {
              game.click();
              unsafeWindow.getSerialKeyGo = true; // fix: issue#27

              setTimeout(handler.bind(null, $games, callback), 700);
            } else setTimeout(handler.bind(null, $games, callback), 1);
          } else callback();
        };

        $revealBtn.addClass('SBSE-button--working');
        handler($source.find('button[onclick^="getSerialKey"]'), function () {
          $revealBtn.removeClass('SBSE-button--working');
          $('.SBSE-button-retrieve').click();
        });
      }
    };

    var process = function process($nodes) {
      var tooltipsData = [];
      var $source = $nodes && $nodes.length > 0 ? $nodes : $('.profile-private-page-library-subitem');
      $source.each(function (i, ele) {
        var $ele = $(ele);
        var $a = $ele.find('a[href*="steam"]');
        var d = {
          title: $ele.find('.profile-private-page-library-title *[title]').attr('title').trim()
        };

        if ($a.length > 0) {
          var matched = $a.attr('href').match(/steam.+\/(app|sub)\/(\d+)/);
          if (matched) d[matched[1]] = parseInt(matched[2], 10); // check if owned & wished

          d.owned = steam.isOwned(d);
          d.wished = steam.isWished(d);
          if (d.owned) $ele.addClass('SBSE-item--owned');
          if (d.wished) $ele.addClass('SBSE-item--wished');
        } // append icon


        $ele.find('.profile-private-page-library-title').after($('<span class="SBSE-icon"></span>').mouseenter(keylolTooltip.show.bind(keylolTooltip)));
        tooltipsData.push(d);
        $ele.attr('data-gameinfo', JSON.stringify(d)).addClass('SBSE-item--processed SBSE-item--steam');
      }); // load Keylol tooltip

      keylolTooltip.load(tooltipsData);
    };

    var $container = container.get('SBSE', handlers);
    process(); // insert container

    $('.profile-private-page-library-menu').eq(0).before($container);
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        Array.from(mutation.addedNodes).forEach(function (addedNode) {
          if (addedNode.nodeType === 1 && addedNode.classList.contains('profile-private-page-library-subitem')) process($(addedNode));
        });
      });
    });
    observer.observe($('.profile-private-page-library-cont')[0], {
      childList: true,
      subtree: true
    });
  },
  fanatical: function fanatical() {
    // inject css
    GM_addStyle("\n      .SBSE-container { margin-top: 10px; }\n      .SBSE-container__nav { background-color: rgb(28, 28, 28); }\n      .SBSE-container__nav__item--show {\n        border-bottom: 1px solid #ff9800;\n        color: #ff9800;\n      }\n      .SBSE-container__content { margin: 0; }\n      .SBSE-container__content__model > textarea { background-color: #434343; color: #eee; }\n      .SBSE-container__content__model label { color: #DEDEDE; }\n      .SBSE-button, .SBSE-select { border: 1px solid transparent; background-color: #1c1c1c; color: #eee; }\n      .SBSE-button:hover, .SBSE-select:hover { color: #A8A8A8; }\n      .SBSE-button--narrow { width: 80px; }\n\n      /* currency converter */\n      .SBSE-priceExt { positon: relative; }\n      .SBSE-priceExt ~ .SBSE-priceExt { display: none; }\n      .SBSE-priceExt--portrait { width: 100%; padding: 0 .875rem 0 .875rem; }\n      .SBSE-priceExt--portrait > div { padding: 1rem; }\n      .SBSE-priceExt--portrait .SBSE-priceExt__currencyToggler {\n        width: 100%; height: 40px;\n        margin-bottom: 10px;\n        font-size: 20px;\n        border-radius: 3px;\n      }\n      .SBSE-priceExt--landscape { padding: 1rem; }\n      .SBSE-priceExt--landscape > div { display: flex; align-items: center; justify-content: space-evenly; }\n      .SBSE-priceExt--landscape .SBSE-priceExt__currencyToggler {\n        width: 300px; height: 40px;\n        font-size: 20px;\n        border-radius: 3px;\n      }\n      .SBSE-priceExt__pricingDetail { background-color: transparent; }\n      .SBSE-priceExt__pricingDetail th { padding-top: 10px; }\n      .SBSE-priceExt__pricingDetail .cheapest { border-bottom: 1px solid #ff9800; font-weight: bold; }\n      .SBSE-priceExt__pricingDetail .currency-flag { vertical-align: text-bottom; }\n      .swal2-popup table { background-color: white; }\n      .SBSE-icon { vertical-align: bottom; }\n    ");

    var fetchAPIData = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(s, c) {
        var slug, callback, JSONString, res;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                slug = s;
                callback = c;

                if (typeof s === 'function') {
                  callback = s;
                  slug = location.href.split('/').pop();
                }

                JSONString = GM_getValue("Fanatical-".concat(slug), '');

                if (!(JSONString.length === 0)) {
                  _context4.next = 16;
                  break;
                }

                _context4.next = 7;
                return fetch("https://www.fanatical.com/api/products/".concat(slug));

              case 7:
                res = _context4.sent;

                if (!res.ok) {
                  _context4.next = 15;
                  break;
                }

                _context4.next = 11;
                return res.text();

              case 11:
                JSONString = _context4.sent;
                GM_setValue("Fanatical-".concat(slug), JSONString);
                _context4.next = 16;
                break;

              case 15:
                JSONString = '{}';

              case 16:
                if (typeof callback === 'function') callback(JSON.parse(JSONString));

              case 17:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      return function fetchAPIData(_x2, _x3) {
        return _ref2.apply(this, arguments);
      };
    }();

    var productHandler = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(APIData) {
        var language, $priceExt, $currencyToggler, $pricingDetail, selectedCurrency, isStarDeal, starDeal, res, discount, i, $prices;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!(Object.keys(APIData).length > 0)) {
                  _context5.next = 33;
                  break;
                }

                language = config.get('language');
                $priceExt = $("\n          <div class=\"SBSE-priceExt SBSE-priceExt--portrait\">\n            <div>\n              <select class=\"SBSE-priceExt__currencyToggler\"></select>\n            </div>\n          </div>\n        ");
                $currencyToggler = $priceExt.find('.SBSE-priceExt__currencyToggler');
                $pricingDetail = $('<table class="SBSE-priceExt__pricingDetail"></table>');
                selectedCurrency = GM_getValue('SBSE_selectedCurrency', 'USD');
                isStarDeal = !!$('.stardeal-purchase-info').length;
                starDeal = {};

                if (!isStarDeal) {
                  _context5.next = 16;
                  break;
                }

                _context5.next = 11;
                return fetch('https://www.fanatical.com/api/star-deal');

              case 11:
                res = _context5.sent;

                if (!res.ok) {
                  _context5.next = 16;
                  break;
                }

                _context5.next = 15;
                return res.json();

              case 15:
                starDeal = _context5.sent;

              case 16:
                // change orientation
                if (isStarDeal || $('.background-bundle, .bundle-header.container-fluid').length > 0) {
                  $priceExt.toggleClass('SBSE-priceExt--portrait SBSE-priceExt--landscape container');
                }

                Object.keys(xe.currencies).forEach(function (currency) {
                  var selected = currency === selectedCurrency ? ' selected' : '';
                  $currencyToggler.append($("<option value=\"".concat(currency, "\"").concat(selected, ">").concat(xe.currencies[currency][language], "</option>")));
                });
                $currencyToggler.change(function () {
                  xe.update($currencyToggler.val());
                }); // bundle page

                APIData.bundles.forEach(function (tier, index) {
                  var $detail = $pricingDetail.clone();
                  if (APIData.bundles.length > 1) $detail.append("<tr><th colspan=\"3\">Tier ".concat(index + 1, "</th></tr>"));
                  Object.keys(tier.price).sort().forEach(function (currency) {
                    var value = tier.price[currency];
                    var symbol = xe.currencies[currency].symbol;
                    var decimalPlace = xe.currencies[currency].decimal ? 2 : 0;
                    $detail.append("\n              <tr class=\"tier".concat(index + 1, "\">\n                <td><div class=\"currency-flag currency-flag-").concat(currency.toLowerCase(), "\"></div></td>\n                <td>").concat(symbol + (value / 100).toFixed(decimalPlace), "</td>\n                <td> \u2248 <span class=\"SBSE-price\" data-currency=\"").concat(currency, "\" data-value=\"").concat(value, "\"></span></td>\n              </tr>\n            "));
                  });
                  $detail.appendTo($currencyToggler.parent());
                }); // game page

                if (location.href.includes('/game/') || location.href.includes('/dlc/')) {
                  discount = 1;
                  if (has.call(APIData, 'current_discount') && new Date(APIData.current_discount.until).getTime() > Date.now()) discount = 1 - APIData.current_discount.percent;
                  if (isStarDeal) discount = 1 - $('.discount-percent').text().replace(/\D/g, '') / 100;
                  Object.keys(APIData.price).sort().forEach(function (currency) {
                    var value = Math.trunc(APIData.price[currency] * discount);
                    var symbol = xe.currencies[currency].symbol;
                    var decimalPlace = xe.currencies[currency].decimal ? 2 : 0; // if star-deal data loaded successfully

                    if (has.call(starDeal, 'promoPrice')) value = starDeal.promoPrice[currency];
                    $pricingDetail.append("\n              <tr class=\"tier1\">\n                <td><div class=\"currency-flag currency-flag-".concat(currency.toLowerCase(), "\"></div></td>\n                <td>").concat(symbol + (value / 100).toFixed(decimalPlace), "</td>\n                <td> \u2248 <span class=\"SBSE-price\" data-currency=\"").concat(currency, "\" data-value=\"").concat(value, "\"></span></td>\n              </tr>\n            ")).appendTo($currencyToggler.parent());
                  });
                }

                $('.product-commerce-container').append($priceExt);
                $('.stardeal-purchase-info, .bundle-header').filter(':visible').eq(0).after($priceExt);
                xe.update(selectedCurrency); // highlight the cheapest

                i = 1;

              case 25:
                if (!(i < 10)) {
                  _context5.next = 33;
                  break;
                }

                $prices = $(".tier".concat(i, " .SBSE-price"));

                if (!($prices.length === 0)) {
                  _context5.next = 29;
                  break;
                }

                return _context5.abrupt("break", 33);

              case 29:
                $($prices.toArray().sort(function (a, b) {
                  return a.textContent.replace(/\D/g, '') - b.textContent.replace(/\D/g, '');
                }).shift()).closest('tr').addClass('cheapest');

              case 30:
                i += 1;
                _context5.next = 25;
                break;

              case 33:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      return function productHandler(_x4) {
        return _ref3.apply(this, arguments);
      };
    }();

    var handlers = {
      extract: function extract() {
        var bundleTitle = $('h5').eq(0).text().trim();
        var data = {
          title: bundleTitle,
          filename: "Fanatical ".concat(bundleTitle, " Keys"),
          items: []
        };
        $('.account-content .order-item-details-container').each(function (i, orderItem) {
          var $orderItem = $(orderItem);
          var key = $orderItem.find('input[type="text"]').val();

          if (key) {
            var d = JSON.parse($orderItem.closest('.SBSE-item--processed').attr('data-gameinfo') || '{}');

            if (Object.keys(d).length === 0) {
              d.title = $orderItem.find('.game-name').text().trim();
            }

            d.key = key;
            activator.pushKeyDetails(d);
            data.items.push(d);
          }
        });
        return data;
      },
      reveal: function reveal(e) {
        var $revealBtn = $(e.currentTarget);
        var selected = $('.SBSE-select-filter').val() || 'All';

        var handler = function handler($games, callback) {
          var game = $games.shift();

          if (game) {
            var d = JSON.parse($(game).closest('.SBSE-item--processed').attr('data-gameinfo') || '{}');

            if (selected === 'All' || selected === 'Owned' && d.owned || selected === 'NotOwned' && !d.owned) {
              game.click();
              setTimeout(handler.bind(null, $games, callback), 300);
            } else setTimeout(handler.bind(null, $games, callback), 1);
          } else setTimeout(callback, 500);
        };

        $revealBtn.addClass('SBSE-button--working');
        handler($('.account-content .key-container button'), function () {
          $revealBtn.removeClass('SBSE-button--working');
          $('.SBSE-button-retrieve').click();
        });
      }
    };

    var process = function process($node) {
      // empty textarea
      SBSE.getModel().find('textarea').val(''); // retrieve title

      $('.account-content h5').each(function (i, h5) {
        var title = h5.textContent.trim();
        var slug = title.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        fetchAPIData(slug, function (APIData) {
          if (Object.keys(APIData).length > 0) {
            var tooltipsData = [];

            var matchGame = function matchGame(data) {
              if (has.call(data, 'steam') && data.steam.id) {
                var $gameTitle = $node.find(".order-item .game-name:contains(".concat(data.name, ")")).filter(function (index, name) {
                  return data.name === name.textContent.trim();
                });
                var $orderItem = $gameTitle.closest('.order-item');
                var d = {
                  title: data.name,
                  app: parseInt(data.steam.id, 10)
                };
                d.owned = steam.isOwned(d);
                d.wished = steam.isWished(d); // check if owned & wished

                if (d.owned) $orderItem.addClass('SBSE-item--owned');
                if (d.wished) $orderItem.addClass('SBSE-item--wished'); // append Steam store link

                $gameTitle.append("<span> | </span><a class=\"SBSE-link-steam_store\" href=\"https://store.steampowered.com/app/".concat(d.app, "/\" target=\"_blank\">").concat(i18n.get('steamStore'), "</a>"), $('<span class="SBSE-icon"></span>').mouseenter(keylolTooltip.show.bind(keylolTooltip)));
                tooltipsData.push(d);
                $orderItem.addClass('SBSE-item--processed SBSE-item--steam').attr('data-gameinfo', JSON.stringify(d));
              }
            };

            matchGame(APIData);
            APIData.bundles.forEach(function (tier) {
              tier.games.forEach(matchGame);
            }); // load Keylol tooltip

            keylolTooltip.load(tooltipsData);
          }
        });
      });
    };

    var $container = container.get('SBSE', handlers);
    $container.find('.SBSE-button').addClass('SBSE-button--narrow'); // narrow buttons

    $container.find('a').attr('href', ''); // dodge from master css selector

    new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        Array.from(mutation.addedNodes).filter(function (x) {
          return x.nodeType === 1;
        }).forEach(function (node) {
          var $node = $(node);
          var currentURL = location.href; // url changed

          if (node.matches('[property="og:url"]')) {
            if (currentURL.includes('/bundle/') || currentURL.includes('/game/') || currentURL.includes('/dlc/')) fetchAPIData(productHandler);
          } // order contents loaded


          if ($node.is('.order-item') || $node.children('div.order-bundle-items-container, div.order-item').length > 0) {
            if (currentURL.includes('/orders/')) {
              // insert container
              var $anchor = $('.account-content h3');

              if ($('.SBSE_container').length === 0 && $anchor.length > 0) {
                $anchor.parent().css({
                  'max-width': '100%',
                  'flex-basis': 'auto'
                });
                $anchor.eq(0).before($container);
              }
            }

            if (currentURL.includes('/product-library')) {
              // insert container
              var _$anchor = $('.key-list-container');

              if ($('.SBSE_container').length === 0 && _$anchor.length > 0) _$anchor.eq(0).before($container);
            }

            process($node);
          }
        });
      });
    }).observe($('html')[0], {
      childList: true,
      subtree: true
    });
  },
  humblebundle: function humblebundle() {
    // inject css
    GM_addStyle("\n      .SBSE-container__content__model > div { position: relative; }\n      .SBSE-container__content__model > textarea {\n        border: 1px solid #CFCFCF;\n        border-radius: 5px;\n        color: #4a4c45;\n        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);\n      }\n      .SBSE-button {\n        width: 70px;\n        border: 1px solid #C9CCD3;\n        border-radius: 3px;\n        background-color: #C5C5C5;\n        background: linear-gradient(to top, #cacaca, #e7e7e7);\n        color: #4a4c45 !important;\n      }\n      .SBSE-button:hover {\n        border: 1px solid #b7bac0;\n        background-color: #fafcff;\n        color: #555961 !important;\n      }\n      .SBSE-button--narrow.SBSE-button--working { width: 76px; padding-right: 36px; }\n      .SBSE-button-setting { position: absolute; right: 0; }\n      .SBSE-item--owned .sr-unredeemed-steam-button {\n        background-color: #F3F3F3;\n        background: linear-gradient(to top, #E8E8E8, #F6F6F6);\n      }/*\n      .SBSE-item--owned .heading-text h4 > span:not(.steam-owned):last-child::after {\n        content: '\\f085';\n        font-family: hb-icons;\n        color: #17A1E5;\n      }*/\n      .SBSE-activationRestrictions-title {\n        margin: 0 0 5px;\n        display: flex;\n        positon: relative;\n        cursor: pointer;\n      }\n      .SBSE-activationRestrictions-title::before, .SBSE-activationRestrictions-title::after { padding: 0 5px; }\n      .SBSE-activationRestrictions-title::before { content: '\uFF0B'; display: none; order: 2; }\n      .SBSE-activationRestrictions-title::after { content: '\uFF0D'; display: block; order: 3; }\n      .SBSE-activationRestrictions-details p { margin: 0; }\n      .SBSE-activationRestrictions-details .highlight { color: crimson; }\n      .SBSE-activationRestrictions--collapsed > h5::before { display: block; }\n      .SBSE-activationRestrictions--collapsed > h5::after { display: none; }\n      .SBSE-activationRestrictions--collapsed > div { display: none; }\n      .swal2-icon-text { font-size: inherit; }\n      .flag-icon { width: 4em; height: 3em; border-radius: 3px; }\n      .flag-icon-unknown { border: 1px solid; text-align: center; line-height: 3em; }\n      .key-redeemer:not(:first-child) h4 { margin-top: 50px; }\n      .key-redeemer h4 { position: relative; margin-bottom: 10px; }\n      .key-redeemer .SBSE-icon { position: absolute; top: 50%; margin-top: -10px; }\n    ");
    var gamekey;
    var atDownload = location.pathname === '/downloads';

    var fetchKey = /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6($node, machineName, callback) {
        var res, d;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!gamekey) {
                  _context6.next = 15;
                  break;
                }

                _context6.next = 3;
                return fetch('https://www.humblebundle.com/humbler/redeemkey', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    Origin: 'https://www.humblebundle.com',
                    Referer: location.href
                  },
                  body: "keytype=".concat(machineName, "&key=").concat(gamekey, "&keyindex=0"),
                  credentials: 'same-origin'
                });

              case 3:
                res = _context6.sent;

                if (!res.ok) {
                  _context6.next = 11;
                  break;
                }

                _context6.next = 7;
                return res.json();

              case 7:
                d = _context6.sent;

                if (d.success) {
                  $node.closest('.container').html("\n              <div title=\"".concat(d.key, "\" class=\"js-keyfield keyfield redeemed enabled\">\n                <div class=\"keyfield-value\">").concat(d.key, "</div>\n                <a class=\"steam-redeem-button js-steam-redeem-button\" href=\"https://store.steampowered.com/account/registerkey?key=").concat(d.key, "\" target=\"_blank\">\n                  <div class=\"steam-redeem-text\">Redeem</div>\n                  <span class=\"tooltiptext\">Redeem on Steam</span>\n                </a>\n                <div class=\"spinner-icon\" aria-label=\"Loading\">\n                  <i class=\"hb hb-spinner hb-spin\"></i>\n                </div>\n              </div>\n            "));
                } else swal(i18n.get('failTitle'), JSON.stringify(d), 'error');

                _context6.next = 12;
                break;

              case 11:
                $node.click();

              case 12:
                if (typeof callback === 'function') callback();
                _context6.next = 16;
                break;

              case 15:
                $node.click();

              case 16:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      return function fetchKey(_x5, _x6, _x7) {
        return _ref4.apply(this, arguments);
      };
    }();

    var handlers = {
      extract: function extract() {
        var bundleTitle = $('title').text().split(' (').shift();
        var data = {
          title: bundleTitle,
          filename: "Humble Bundle ".concat(bundleTitle, " Keys"),
          items: []
        };
        $('.keyfield.redeemed .keyfield-value').each(function (i, ele) {
          var $ele = $(ele);
          var key = $ele.text().trim();

          if (key) {
            var d = JSON.parse($ele.closest('.SBSE-item--processed').attr('data-gameinfo') || '{}');

            if (Object.keys(d).length === 0) {
              var $titleEle = $ele.closest(atDownload ? '.container' : '.redeemer-cell').prev().find('h4');
              d.title = $titleEle.contents().eq(0).text().trim();
            }

            d.key = key;
            activator.pushKeyDetails(d);
            data.items.push(d);
          }
        });
        return data;
      },
      reveal: function reveal(e) {
        var $revealBtn = $(e.currentTarget);
        var selected = $('.SBSE-select-filter').val() || 'All';

        var handler = function handler($games, callback) {
          var game = $games.shift();

          if (game) {
            var $game = $(game);
            var machineName = $game.closest('.key-redeemer').attr('data-machineName');
            var d = JSON.parse($(game).closest('.SBSE-item--processed').attr('data-gameinfo') || '{}');

            if (atDownload && machineName) {
              if (selected === 'All' || selected === 'Owned' && d.owned || selected === 'NotOwned' && !d.owned) {
                fetchKey($game, machineName, function () {
                  handler($games, callback);
                });
              } else setTimeout(handler.bind(null, $games, callback), 1);
            } else {
              game.click();
              $('.sr-warning-modal-confirm-button').click();
              setTimeout(handler.bind(null, $games, callback), 200);
            }
          } else callback();
        };

        $revealBtn.addClass('SBSE-button--working');
        handler($('.key-redeemer.SBSE-item--steam .keyfield:not(.redeemed)'), function () {
          $revealBtn.removeClass('SBSE-button--working');
          $('.SBSE-button-retrieve').click();
        });
      }
    };

    var process = /*#__PURE__*/function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7($node) {
        var json, res, data, tooltipsData;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                gamekey = new URLSearchParams(location.search).get('key');
                json = GM_getValue(gamekey, '');

                if (!(json.length === 0)) {
                  _context7.next = 10;
                  break;
                }

                _context7.next = 5;
                return fetch("https://www.humblebundle.com/api/v1/order/".concat(gamekey, "?all_tpkds=true"), {
                  method: 'GET',
                  credentials: 'same-origin'
                });

              case 5:
                res = _context7.sent;

                if (!res.ok) {
                  _context7.next = 10;
                  break;
                }

                _context7.next = 9;
                return res.text();

              case 9:
                json = _context7.sent;

              case 10:
                _context7.prev = 10;
                data = JSON.parse(json);
                tooltipsData = [];
                data.tpkd_dict.all_tpks.forEach(function (game) {
                  var $keyRedeemer = $node.find(".key-redeemer:has(.heading-text[data-title=\"".concat(game.human_name.replace(/"/g, '\\"'), "\"])"));

                  if ($keyRedeemer.length > 0) {
                    if (game.key_type === 'steam') {
                      $keyRedeemer.addClass('SBSE-item--steam');
                      var d = {
                        title: game.human_name,
                        app: parseInt(game.steam_app_id, 10),
                        sub: parseInt(game.steam_package_id, 10)
                      };
                      d.owned = steam.isOwned(d);
                      d.wished = steam.isWished(d); // apply owned effect on game title

                      if (d.owned) $keyRedeemer.addClass('SBSE-item--owned');
                      if (d.wished) $keyRedeemer.addClass('SBSE-item--wished'); // store data

                      $keyRedeemer.attr({
                        'data-machineName': game.machine_name,
                        'data-humanName': game.human_name,
                        'data-gameinfo': JSON.stringify(d)
                      }); // append Steam store link

                      var $target = $keyRedeemer.find('h4 > span').eq(0);

                      if (d.app > 0) {
                        $target.after("<span> | </span><a class=\"SBSE-link-steam_store\" href=\"https://store.steampowered.com/app/".concat(d.app, "/\" target=\"_blank\">").concat(i18n.get('steamStore'), "</a>"));
                      }

                      if (d.sub > 0) {
                        $target.after("<span> | </span><a class=\"SBSE-link-steam_db\" href=\"https://steamdb.info/sub/".concat(d.sub, "/\" target=\"_blank\">Steam DB</a>"));
                      }

                      tooltipsData.push(d);
                    } // activation restrictions


                    var _$container = $('<div class="SBSE-activationRestrictions"></div>');

                    var $title = $("<h5 class=\"SBSE-activationRestrictions-title\">".concat(i18n.get('HBActivationRestrictions'), "</h5>"));
                    var $details = $('<div class="SBSE-activationRestrictions-details"></div>');
                    var disallowed = game.disallowed_countries.map(function (c) {
                      return config.get('highlightedRegions').includes(c) ? "<span class=\"highlight\">".concat(ISO2.get(c), "</span>") : ISO2.get(c);
                    });
                    var exclusive = game.exclusive_countries.map(function (c) {
                      return config.get('highlightedRegions').includes(c) ? "<span class=\"highlight\">".concat(ISO2.get(c), "</span>") : ISO2.get(c);
                    });
                    var comma = config.get('language').includes('chinese') ? '、' : ', ';
                    if (disallowed.length > 0) $details.append("<p>".concat(i18n.get('HBDisallowedCountries'), "<br>").concat(disallowed.join(comma), "</p>"));
                    if (exclusive.length > 0) $details.append("<p>".concat(i18n.get('HBExclusiveCountries'), "<br>").concat(exclusive.join(comma), "</p>"));

                    if (disallowed.length > 0 || exclusive.length > 0) {
                      _$container.append($title, $details);

                      $keyRedeemer.find('.heading-text').after(_$container);
                      $title.on('click', function () {
                        _$container.toggleClass('SBSE-activationRestrictions--collapsed');
                      });
                    }

                    $keyRedeemer.addClass('SBSE-item--processed');
                  }
                }); // override default popups

                document.addEventListener('click', function (e) {
                  var $target = $(e.target).closest('.keyfield:not(.redeemed, .redeemed-gift)');
                  var $keyRedeemer = $target.closest('.key-redeemer.SBSE-item--steam');
                  var machineName = $keyRedeemer.attr('data-machineName');

                  if ($target.length > 0 && $keyRedeemer.length > 0 && machineName) {
                    e.stopPropagation();

                    if ($keyRedeemer.hasClass('SBSE-item--owned')) {
                      swal({
                        title: i18n.get('HBAlreadyOwned'),
                        text: i18n.get('HBRedeemAlreadyOwned').replace('%title%', $keyRedeemer.attr('data-humanName')),
                        type: 'question',
                        showCancelButton: true
                      }).then(function (result) {
                        if (result.value) fetchKey($target, machineName);
                      });
                    } else fetchKey($target, machineName);
                  }
                }, true); // load Keylol tooltip

                keylolTooltip.load(tooltipsData);
                _context7.next = 21;
                break;

              case 18:
                _context7.prev = 18;
                _context7.t0 = _context7["catch"](10);
                throw _context7.t0;

              case 21:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[10, 18]]);
      }));

      return function process(_x8) {
        return _ref5.apply(this, arguments);
      };
    }();

    var $container = container.get('SBSE', handlers);
    var $keyManager = $('.js-key-manager-holder'); // narrow buttons

    $container.find('.SBSE-button').addClass('SBSE-button--narrow'); // at home page

    if ($keyManager.length > 0) {
      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          Array.from(mutation.addedNodes).forEach(function (addedNode) {
            if (addedNode.className === 'header') {
              observer.disconnect();
              $(addedNode).after($container);
            }
          });
        });
      });
      observer.observe($keyManager[0], {
        childList: true
      }); // at download page
    } else {
      var _observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          Array.from(mutation.addedNodes).forEach( /*#__PURE__*/function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(addedNode) {
              var $node;
              return regeneratorRuntime.wrap(function _callee8$(_context8) {
                while (1) {
                  switch (_context8.prev = _context8.next) {
                    case 0:
                      $node = $(addedNode);

                      if ($node.hasClass('key-list') || $node.find('.key-list').length > 0) {
                        _observer.disconnect();

                        $node.closest('.whitebox-redux').before($container); // fetch game heading & wrap heading

                        $node.find('.heading-text > h4').each(function (i, heading) {
                          heading.parentElement.dataset.title = heading.innerText.trim();
                          $(heading.firstChild).wrap('<span/>');
                          $(heading).append($('<span class="SBSE-icon"></span>').mouseenter(keylolTooltip.show.bind(keylolTooltip)));
                        }); // fetch & process key data

                        process($node);
                      }

                    case 2:
                    case "end":
                      return _context8.stop();
                  }
                }
              }, _callee8);
            }));

            return function (_x9) {
              return _ref6.apply(this, arguments);
            };
          }());
        });
      });

      _observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    } // append user's region


    var countryCode = unsafeWindow.models.request.country_code;

    if (countryCode) {
      var code = countryCode.toLowerCase();
      var countryName = ISO2.get(countryCode);
      var $flag = $("<span class=\"flag-icon flag-icon-unknown\" tooltip=\"".concat(i18n.get('HBCurrentLocation'), "?\"></span>"));

      if (GM_getResourceText('flagIcon').includes("".concat(code, ".svg"))) {
        $flag.toggleClass("flag-icon-unknown flag-icon-".concat(code)).attr('tooltip', i18n.get('HBCurrentLocation') + countryName);
      } else $flag.text('?');

      $('.navbar-content').prepend($flag);
    }
  },
  dailyindiegame: function dailyindiegame() {
    var MPHideList = JSON.parse(GM_getValue('SBSE_DIGMPHideList') || '[]');
    var pathname = location.pathname;

    if (pathname.includes('/account_page') || pathname.includes('/account_update')) {
      // force sync library
      steam.sync([{
        key: 'library'
      }]); // update DIG balance

      var balanceText = $('a[href*="transactionhistory.html"]').eq(0).closest('div').text().match(/\$\d+\.\d+/);
      var balance = balanceText ? parseInt(balanceText[0].replace(/\D/g, ''), 10) : '';
      if (!isNaN(balance)) GM_setValue('SBSE_DIGBalance', balance); // inject css

      GM_addStyle("\n        .SBSE-container { padding: 5px; border: 1px solid #424242; }\n        .SBSE-container__nav__item--show {\n          border-bottom: 1px solid #FD5E0F;\n          color: #FD5E0F;\n        }\n        .SBSE-container__content__model > textarea { border: 1px solid #000; }\n        .SBSE-button {\n          border: none;\n          background-color: #FD5E0F;\n          color: rgb(49, 49, 49);\n          font-family: Ropa Sans;\n          font-size: 15px;\n          font-weight: 600;\n        }\n      ");
      var handlers = {
        extract: function extract() {
          var data = {
            title: 'DailyIndieGame Keys',
            filename: 'DailyIndieGame Keys',
            items: []
          };
          $('#TableKeys tr').each(function (i, tr) {
            var $tds = $(tr).children();
            var key = $tds.eq(4).text().trim();

            if (key.includes('-')) {
              var d = {
                title: $tds.eq(2).text().trim(),
                key: key,
                marketListing: $tds.eq(6).text().includes('Cancel trade')
              };
              activator.pushKeyDetails(d);
              data.items.push(d);
            }
          });
          return data;
        },
        reveal: function reveal() {
          var $form = $('#form3');
          $('#quickaction').val(1);
          $.ajax({
            method: 'POST',
            url: $form.attr('action'),
            data: $form.serializeArray(),
            success: function success() {
              location.reload();
            }
          });
        }
      };
      var $container = container.get('SBSE', handlers);
      $container.find('.SBSE-button-export, .SBSE-select-filter').remove();
      $container.find('label:has(.SBSE-checkbox-join)').after("\n        <label><input type=\"checkbox\" class=\"SBSE-checkbox-marketListings\">".concat(i18n.get('checkboxMarketListings'), "</label>\n      ")); // append checkbox for market keys

      $('#TableKeys').eq(0).before($container); // rate all positive

      var $awaitRatings = $('a[href^="account_page_0_ratepositive"]');

      if ($awaitRatings.length > 0) {
        $('#TableKeys td:contains(Rate TRADE)').text(i18n.get('DIGRateAllPositive')).css('cursor', 'pointer').click(function () {
          $awaitRatings.each( /*#__PURE__*/function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(i, a) {
              var res;
              return regeneratorRuntime.wrap(function _callee9$(_context9) {
                while (1) {
                  switch (_context9.prev = _context9.next) {
                    case 0:
                      _context9.next = 2;
                      return fetch(a.href, {
                        method: 'GET',
                        credentials: 'same-origin'
                      });

                    case 2:
                      res = _context9.sent;
                      if (res.ok) $(a).parent('td').html('<span class="DIG3_14_Orange">Positive</span>');

                    case 4:
                    case "end":
                      return _context9.stop();
                  }
                }
              }, _callee9);
            }));

            return function (_x10, _x11) {
              return _ref7.apply(this, arguments);
            };
          }());
        });
      } // DIG Menu

    } else if (pathname.includes('/account_digstore') || pathname.includes('/account_trades') || pathname.includes('/account_tradesXT') || pathname.includes('/store_update') || pathname.includes('/storeXT_update') || pathname.includes('/site_content_marketplace')) {
      // inject css styles
      GM_addStyle("\n        body.hideOwned .SBSE-item--owned,\n        body.hideOwned .SBSE-item--owned + .DIGMenu-searchResults { display: none; }\n        .headerRow > td:first-child { padding-left: 0; }\n        .headerRow > td:last-child { padding-right: 0; }\n        .DIGMenu > * { margin-right: 10px; padding: 4px 8px !important; cursor: pointer; }\n        .DIG-row { height: 30px; }\n        .DIGMenu button { padding: 4px 8px; outline: none; cursor: pointer; }\n        .DIG-row--checked { background-color: #222; }\n        .DIGMenu-searchResults td { padding: 0 }\n        .DIGMenu-searchResults iframe {\n          width: 100%; height: 300px;\n          display: none;\n          background-color: white;\n          border: none;\n        }\n        .SBSE-item--owned .DIG3_14_Gray { color: #9ccc65; }\n        .SBSE-item--wished .DIG3_14_Gray { color: #29b6f6; }\n        .SBSE-item--ignored .DIG3_14_Gray { text-decoration: line-through; }\n        .DIG2content select { max-width: 200px; }\n        #DIGSelectAll { display: none; }\n        #DIGSelectAll + span { display: inline-block; }\n        #DIGSelectAll ~ span:last-child { display: none; }\n        #DIGSelectAll:checked + span { display: none; }\n        #DIGSelectAll:checked ~ span:last-child { display: inline-block; }\n        .showOwnedListings { color: #FD5E0F; }\n        .showOwnedListings > label { vertical-align: text-bottom; }\n        .showOwnedListings input:checked + .SBSE-switch__slider { background-color: #FD5E0F; }\n        .DIGBalanceDetails > span { margin-right: 20px; }\n        .DIG__edit_balance {\n          display: inline-block;\n          position: relative;\n          transform: rotate(45deg);\n          cursor: pointer;\n        }\n        .DIG__edit_balance > span {\n          display: inline-block;\n        }\n        .DIG__edit_balance .tip {\n          width: 0; height: 0;\n          position: absolute;\n          top: 13px;\n          border-left: 2px solid transparent;\n          border-right: 2px solid transparent;\n          border-top: 3px solid #999;\n        }\n        .DIG__edit_balance .body {\n          width: 4px; height: 12px;\n          background-color: #999;\n        }\n        .DIG__edit_balance .rubber {\n          width: 4px; height: 2px;\n          position: absolute;\n          top: -3px;\n          background-color: #999;\n          top: -3px;\n        }\n      ");
      swal.showLoading(); // append menu buttons

      var $target = $('#form3').closest('tr').children().eq(0);
      var $DIGMenu = $("\n        <div class=\"DIGMenu\">\n          <label class=\"DIGSelectAll DIG3_Orange_15_Form\">\n            <input type=\"checkbox\" id=\"DIGSelectAll\">\n            <span>".concat(i18n.get('DIGMenuSelectAll'), "</span>\n            <span>").concat(i18n.get('DIGMenuSelectCancel'), "</span>\n          </label>\n          <span class=\"DIGButtonPurchase DIG3_Orange_15_Form\">").concat(i18n.get('DIGMenuPurchase'), "</span>\n          <label class=\"showOwnedListings\">\n            <label class=\"SBSE-switch SBSE-switch--small\">\n              <input type=\"checkbox\" id=\"showOwnedListings\" checked>\n              <span class=\"SBSE-switch__slider\"></span>\n            </label>\n            <span>").concat(i18n.get('owned'), "</span>\n          </label>\n        </div>\n            "));

      if ($target.children().length > 0) {
        var $tr = $('<tr/>');
        $tr.append($target.clone());
        $target.parent().before($tr);
      }

      $target.empty().append($DIGMenu);
      $target.parent().addClass('headerRow'); // bind button event

      $('.DIGButtonPurchase').click(function () {
        var balance = GM_getValue('SBSE_DIGBalance');
        var $games = $('.DIG-row--checked:visible');
        swal({
          title: i18n.get('DIGButtonPurchasing'),
          html: '<p></p>',
          onOpen: function onOpen() {
            swal.showLoading();
          }
        });
        (function () {
          var _purchaseHandler = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
            var game, $game, id, price, title, url, requestInit, res;
            return regeneratorRuntime.wrap(function _callee10$(_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    game = $games.shift();

                    if (!game) {
                      _context10.next = 25;
                      break;
                    }

                    $game = $(game);
                    id = $game.attr('data-id');
                    price = parseInt($game.attr('data-price'), 10);
                    title = $game.attr('data-title');
                    if (title.length > 0) swal.getContent().querySelector('p').textContent = title;

                    if (!(id && price > 0)) {
                      _context10.next = 22;
                      break;
                    }

                    if (!(balance - price >= 0)) {
                      _context10.next = 19;
                      break;
                    }

                    url = "".concat(location.origin, "/account_buy.html");
                    requestInit = {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                      },
                      body: "quantity=1&xgameid=".concat(id, "&xgameprice1=").concat(price, "&send=Purchase"),
                      mode: 'same-origin',
                      credentials: 'same-origin',
                      cache: 'no-store',
                      referrer: "".concat(location.origin, "/account_buy_").concat(id, ".html")
                    };

                    if (pathname === '/account_trades.html' || pathname === '/account_tradesXT.html' || pathname === '/site_content_marketplace.html') {
                      url = "".concat(location.origin, "/account_buytrade_").concat(id, ".html");
                      requestInit.body = "gameid=".concat(id, "&send=Purchase");
                      requestInit.referrer = url;
                    }

                    _context10.next = 14;
                    return fetch(url, requestInit);

                  case 14:
                    res = _context10.sent;

                    if (res.ok) {
                      $game.click();
                      balance -= price;
                      $('.DIG__current_balance').attr('data-value', balance);
                    }

                    purchaseHandler();
                    _context10.next = 20;
                    break;

                  case 19:
                    swal({
                      title: i18n.get('failTitle'),
                      text: i18n.get('DIGInsufficientFund'),
                      type: 'error'
                    });

                  case 20:
                    _context10.next = 23;
                    break;

                  case 22:
                    purchaseHandler();

                  case 23:
                    _context10.next = 27;
                    break;

                  case 25:
                    GM_setValue('SBSE_DIGBalance', balance);
                    swal({
                      title: i18n.get('successTitle'),
                      text: i18n.get('DIGFinishedPurchasing'),
                      type: 'success'
                    });

                  case 27:
                  case "end":
                    return _context10.stop();
                }
              }
            }, _callee10);
          }));

          function purchaseHandler() {
            return _purchaseHandler.apply(this, arguments);
          }

          return purchaseHandler;
        })()();
      });
      $('#DIGSelectAll').on('change', function (e) {
        var checked = e.delegateTarget.checked;
        var total = 0;
        $('.DIG-row:visible').toggleClass('DIG-row--checked', checked);

        if (checked) {
          total = $('.DIG-row--checked:visible').map(function (i, row) {
            return parseInt(row.dataset.price, 10);
          }).get().reduce(function (a, b) {
            return a + b;
          });
        }

        $('.DIG_total_amount').attr('data-value', total);
      });
      $('#showOwnedListings').on('change', function (e) {
        var showOwnedListings = e.delegateTarget.checked;
        var $rows = $('.DIG-row--checked.SBSE-item--owned');
        $('body').toggleClass('hideOwned', !showOwnedListings);
        GM_setValue('DIGShowOwnedListings', showOwnedListings);

        if (!showOwnedListings && $rows.length > 0) {
          var total = $rows.map(function (i, row) {
            return parseInt(row.dataset.price, 10);
          }).get().reduce(function (a, b) {
            return a + b;
          });
          $rows.removeClass('DIG-row--checked');
          $('.DIG_total_amount').attr('data-value', function (i, value) {
            return parseInt(value, 10) - total;
          });
        }
      }); // menu settings

      $('#showOwnedListings').prop('checked', GM_getValue('DIGShowOwnedListings', true)).change(); // append sync time and event

      var seconds = Math.round((Date.now() - steam.lastSync('library')) / 1000);
      $target.closest('table').before("\n        <span> ".concat(i18n.get('lastSyncTime').replace('%seconds%', seconds), "</span>\n      ")); // append balance details

      $target.closest('table').before("\n        <div class=\"DIGBalanceDetails\">\n          <span>".concat(i18n.get('DIGCurrentBalance'), "$<span class=\"DIG__current_balance\" data-value=\"0\">0.00</span></span>\n          <span class=\"DIG__edit_balance\">\n            <span class=\"tip\"></span>\n            <span class=\"body\"></span>\n            <span class=\"rubber\"></span>\n          </span>\n          <span>").concat(i18n.get('DIGTotalAmount'), "$<span class=\"DIG_total_amount\" data-value=\"0\">0.00</span></span>\n        </div>\n      ")); // bind balance details event

      $('.DIGBalanceDetails span[data-value]').each(function (i, span) {
        new MutationObserver(function (mutations) {
          mutations.forEach(function (mutation) {
            if (mutation.attributeName === 'data-value') {
              var target = mutation.target;
              target.textContent = (target.dataset.value / 100).toFixed(2);
            }
          });
        }).observe(span, {
          attributes: true
        });
      });
      $('.DIG__edit_balance').on('click', function () {
        swal({
          title: i18n.get('DIGEditBalance'),
          input: 'number',
          inputPlaceholder: i18n.get('DIGPoint'),
          inputAttributes: {
            min: 1
          },
          showCancelButton: true
        }).then(function (result) {
          if (!isNaN(result.value)) {
            var _balance = Math.trunc(result.value);

            GM_setValue('SBSE_DIGBalance', _balance);
            $('.DIG__current_balance').attr('data-value', _balance);
          }
        });
      }); // bind row event

      var $totalAmount = $('.DIG_total_amount');

      var getPrice = function getPrice($tr) {
        var p = 0;
        var $DIGPoints = $tr.find('td:contains( DIG Points)');
        if ($DIGPoints.length === 1) p = $DIGPoints.text();else {
          var tds = $tr.children('td').get();

          for (var j = tds.length - 1; j >= 0; j -= 1) {
            var t = tds[j].textContent.trim();

            if (t.startsWith('$')) {
              p = t.replace(/\D/g, '');
              break;
            }
          }
        }
        return parseInt(p, 10);
      };

      $('a[href^="account_buy"]').eachAsync(function (ele) {
        var $ele = $(ele);
        var $tr = $ele.closest('tr');
        var $title = $tr.children('td').eq(pathname.includes('/account_digstore') ? 3 : 1);
        var id = $ele.attr('href').replace(/\D/g, '');
        var title = $title.text().trim();
        var price = getPrice($tr);
        var onclickHandler = $tr.attr('onclick'); // setup row data & event

        $tr.attr({
          'data-id': id,
          'data-title': title,
          'data-price': price
        });
        $tr.addClass('DIG-row').on('click', function () {
          $tr.toggleClass('DIG-row--checked');
          $totalAmount.attr('data-value', function (index, value) {
            return parseInt(value, 10) + price * ($tr.hasClass('DIG-row--checked') ? 1 : -1);
          });
        }); // re-locate onclick handler

        if (pathname.includes('/site_content_marketplace') && onclickHandler) {
          $title.wrapInner($('<span></span>').attr('onclick', onclickHandler));
          $tr.removeAttr('onclick');
        } // check if owned


        var $a = $tr.find('a[href*="steampowered"]');
        var d = {};
        var steamID = 0;

        if ($a.length === 1) {
          var data = $a[0].pathname.slice(1).split('/');
          steamID = parseInt(data[1], 10);
          d[data[0]] = steamID;
        } else if (onclickHandler.includes('site_gamelisting_')) {
          steamID = parseInt(onclickHandler.match(/_(\d+)\./)[1], 10);
          d.app = steamID;
        }

        if (steam.isOwned(d)) $tr.addClass('SBSE-item--owned');
        if (steam.isWished(d)) $tr.addClass('SBSE-item--wished');
        if (steam.isIgnored(d)) $tr.addClass('SBSE-item--ignored'); // no appID found, pre-load Google search result

        if (steamID === -1 && !MPHideList.includes(id)) {
          var $game = $a.find('span');
          var gameTitle = encodeURIComponent($game.text().trim()).replace(/%20/g, '+');
          var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
          };
          GM_xmlhttpRequest({
            method: 'GET',
            url: "https://www.google.com/search?q=steam+".concat(gameTitle),
            onload: function onload(res) {
              var html = res.responseText; // inset style

              var index = html.indexOf('</head>');
              var style = "\n                <style>\n                  body { overflow-x: hidden; }\n                  .sfbgx, #sfcnt, #searchform, #top_nav, #appbar, #taw { display: none; }\n                  #center_col { margin-left: 0 !important; }\n                </style>\n              ";
              html = html.slice(0, index) + style + html.slice(index); // stripe script tags

              html = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ''); // manipulate urls

              html = html.replace(/\/images\//g, 'https://www.google.com/images/').replace(/\/url\?/g, 'https://www.google.com/url?');
              $tr.after("\n                <tr class=\"DIGMenu-searchResults\">\n                  <td colspan=\"11\"><iframe sandbox=\"allow-scripts\" srcdoc='".concat(html.replace(/[&<>"']/g, function (m) {
                return map[m];
              }), "'></frame></td>\n                </tr>\n              "));
            }
          });
          $game.unwrap('a').css({
            cursor: 'pointer',
            color: 'red'
          }).click(function (e) {
            e.stopPropagation();
            $tr.next('.DIGMenu-searchResults').find('iframe').slideToggle('fast');
          });
        } // remove row if manually hid


        if (MPHideList.includes(id)) $tr.remove();else {
          // append manual hide feature
          $tr.children().eq(0).attr('title', i18n.get('DIGClickToHideThisRow')).click(function (e) {
            e.stopPropagation();

            if (id > 0) {
              MPHideList.push(id);
              GM_setValue('SBSE_DIGMPHideList', JSON.stringify(MPHideList));
              $tr.remove();
            }
          });
        }
      }, function () {
        swal({
          titleText: i18n.get('successTitle'),
          text: i18n.get('loadingSuccess'),
          type: 'success',
          timer: 3000
        });
      }); // setup current balance

      $('.DIG__current_balance').attr('data-value', GM_getValue('SBSE_DIGBalance', 0)); // extension for creating trade at market place
    } else if (pathname === '/site_content_giveaways.html') {
      swal.showLoading(); // inject css styles

      GM_addStyle("\n        body.hideOwned .SBSE-item--owned { display: none; }\n        .DIGMenu > * { margin-right: 10px; padding: 4px 0 !important; cursor: pointer; }\n        .DIG-row { height: 30px; }\n        .SBSE-item--owned .DIG4-Orange-14 { color: #9ccc65; }\n        .SBSE-item--wished .DIG4-Orange-14 { color: #29b6f6; }\n        .SBSE-item--ignored .DIG4-Orange-14 { text-decoration: line-through; }\n        .showOwnedListings { display: inline-block; color: #FD5E0F; }\n        .showOwnedListings > label { vertical-align: text-bottom; }\n        .showOwnedListings input:checked + .SBSE-switch__slider { background-color: #FD5E0F; }\n      "); // append menu buttons

      var _$target = $('a[href^="site_content_giveaways_"]').eq(0).closest('table#DIG2TableGray');

      var _$DIGMenu = $("\n        <div class=\"DIGMenu\">\n          <label class=\"showOwnedListings\">\n            <label class=\"SBSE-switch SBSE-switch--small\">\n              <input type=\"checkbox\" id=\"showOwnedListings\" checked>\n              <span class=\"SBSE-switch__slider\"></span>\n            </label>\n            <span>".concat(i18n.get('owned'), "</span>\n          </label>\n        </div>\n      "));

      _$target.before(_$DIGMenu); // bind button event


      $('.DIGButtonPurchase').click(function () {
        var balance = GM_getValue('SBSE_DIGBalance');
        var $games = $('.DIG-row--checked:visible');
        swal({
          title: i18n.get('DIGButtonPurchasing'),
          html: '<p></p>',
          onOpen: function onOpen() {
            swal.showLoading();
          }
        });
        (function () {
          var _purchaseHandler2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
            var game, $game, id, price, title, url, requestInit, res;
            return regeneratorRuntime.wrap(function _callee11$(_context11) {
              while (1) {
                switch (_context11.prev = _context11.next) {
                  case 0:
                    game = $games.shift();

                    if (!game) {
                      _context11.next = 25;
                      break;
                    }

                    $game = $(game);
                    id = $game.attr('data-id');
                    price = parseInt($game.attr('data-price'), 10);
                    title = $game.attr('data-title');
                    if (title.length > 0) swal.getContent().querySelector('p').textContent = title;

                    if (!(id && price > 0)) {
                      _context11.next = 22;
                      break;
                    }

                    if (!(balance - price >= 0)) {
                      _context11.next = 19;
                      break;
                    }

                    url = "".concat(location.origin, "/account_buy.html");
                    requestInit = {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                      },
                      body: "quantity=1&xgameid=".concat(id, "&xgameprice1=").concat(price, "&send=Purchase"),
                      mode: 'same-origin',
                      credentials: 'same-origin',
                      cache: 'no-store',
                      referrer: "".concat(location.origin, "/account_buy_").concat(id, ".html")
                    };

                    if (pathname === '/account_trades.html' || pathname === '/account_tradesXT.html' || pathname === '/site_content_marketplace.html') {
                      url = "".concat(location.origin, "/account_buytrade_").concat(id, ".html");
                      requestInit.body = "gameid=".concat(id, "&send=Purchase");
                      requestInit.referrer = url;
                    }

                    _context11.next = 14;
                    return fetch(url, requestInit);

                  case 14:
                    res = _context11.sent;

                    if (res.ok) {
                      $game.click();
                      balance -= price;
                      $('.DIG__current_balance').attr('data-value', balance);
                    }

                    purchaseHandler();
                    _context11.next = 20;
                    break;

                  case 19:
                    swal({
                      title: i18n.get('failTitle'),
                      text: i18n.get('DIGInsufficientFund'),
                      type: 'error'
                    });

                  case 20:
                    _context11.next = 23;
                    break;

                  case 22:
                    purchaseHandler();

                  case 23:
                    _context11.next = 27;
                    break;

                  case 25:
                    GM_setValue('SBSE_DIGBalance', balance);
                    swal({
                      title: i18n.get('successTitle'),
                      text: i18n.get('DIGFinishedPurchasing'),
                      type: 'success'
                    });

                  case 27:
                  case "end":
                    return _context11.stop();
                }
              }
            }, _callee11);
          }));

          function purchaseHandler() {
            return _purchaseHandler2.apply(this, arguments);
          }

          return purchaseHandler;
        })()();
      });
      $('#showOwnedListings').on('change', function (e) {
        var showOwnedListings = e.delegateTarget.checked;
        $('body').toggleClass('hideOwned', !showOwnedListings);
        GM_setValue('DIGShowOwnedListings', showOwnedListings);
      }); // menu settings

      $('#showOwnedListings').prop('checked', GM_getValue('DIGShowOwnedListings', true)).change(); // append sync time and event

      var _seconds = Math.round((Date.now() - steam.lastSync('library')) / 1000);

      _$DIGMenu.prepend("\n        <span class=\"DIG4-Gray-13\"> ".concat(i18n.get('lastSyncTime').replace('%seconds%', _seconds), "</span>\n      "));

      $('a[href^="site_gamelisting_"]').eachAsync(function (ele) {
        var $ele = $(ele);
        var $tr = $ele.closest('tr');
        var $title = $tr.children('td').eq(1);
        var id = $ele.attr('href').replace(/\D/g, '');
        var title = $title.text().trim(); // setup row data & event

        $tr.addClass('DIG-row').attr({
          'data-id': id,
          'data-title': title
        }); // check if owned

        var d = {
          app: parseInt(id, 10)
        };
        if (steam.isOwned(d)) $tr.addClass('SBSE-item--owned');
        if (steam.isWished(d)) $tr.addClass('SBSE-item--wished');
        if (steam.isIgnored(d)) $tr.addClass('SBSE-item--ignored');
      }, function () {
        swal({
          titleText: i18n.get('successTitle'),
          text: i18n.get('loadingSuccess'),
          type: 'success',
          timer: 3000
        });
      });
    } else if (pathname === '/account_createtrade.html') {
      var $form = $('#form_createtrade'); // create trade page

      if ($form.length > 0) {
        // trim input field
        var $gameTitle = $form.find('input[name="typeahead"]');
        var $steamKey = $form.find('input[name="STEAMkey"]');
        $gameTitle.blur(function () {
          unsafeWindow.jQuery('input.typeahead').typeahead('setQuery', $gameTitle.val().trim());
        });
        $steamKey.blur(function (e) {
          var $self = $(e.delegateTarget);
          var key = $self.val().match(regKey);
          if (key) $self.val(key[0]);
        });
        $steamKey.attr({
          size: 50,
          maxlength: 200
        }); // search for current market price when click dropdown menu

        var $searchResult = $('<div/>');
        $gameTitle.closest('table').after($searchResult);
        $searchResult.before("<h3>".concat(i18n.get('DIGMarketSearchResult'), "</h3>"));
        $('.tt-dropdown-menu').click( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
          var res, result;
          return regeneratorRuntime.wrap(function _callee12$(_context12) {
            while (1) {
              switch (_context12.prev = _context12.next) {
                case 0:
                  $searchResult.empty();
                  _context12.next = 3;
                  return fetch("".concat(location.origin, "/account_tradesXT.html"), {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: "search=".concat(encodeURIComponent($gameTitle.val()).replace(/%20/g, '+'), "&button=SEARCH"),
                    credentials: 'same-origin'
                  });

                case 3:
                  res = _context12.sent;

                  if (!res.ok) {
                    _context12.next = 12;
                    break;
                  }

                  _context12.t1 = $;
                  _context12.next = 8;
                  return res.text();

                case 8:
                  _context12.t2 = _context12.sent;
                  _context12.t0 = (0, _context12.t1)(_context12.t2).find('#TableKeys');
                  _context12.next = 13;
                  break;

                case 12:
                  _context12.t0 = 'Network response was not ok.';

                case 13:
                  result = _context12.t0;
                  $searchResult.append(result);

                case 15:
                case "end":
                  return _context12.stop();
              }
            }
          }, _callee12);
        }))); // apply last input price

        var lastPrice = GM_getValue('SBSE_DIGLastPrice', 20);
        var $priceField = $('input[name=price]');
        $priceField.val(lastPrice).trigger('input');
        $('#form_createtrade').submit(function () {
          var price = parseInt($priceField.val(), 10);
          if (price !== lastPrice) GM_setValue('SBSE_DIGLastPrice', price);
        }); // result page
      } else {
        GM_addStyle("\n          .check.icon {\n            width: 42px; height: 24px;\n            margin: 12px 0 5px 9px;\n            border-bottom: solid 3px currentColor;\n            border-left: solid 3px currentColor;\n            transform: rotate(-45deg);\n            color: #5cb85c;\n          }\n          .remove.icon { color: #d9534f; margin-left: 9px; margin-top: 30px; }\n          .remove.icon:before, .remove.icon:after {\n            width: 45px; height: 3px;\n            position: absolute;\n            content: '';\n            background-color: currentColor;\n            transform: rotate(45deg);\n          }\n          .remove.icon:after { transform: rotate(-45deg); }\n        ");
        var $anchor = $('td.DIG3_14_Gray > table:first-child');
        var IsSucceed = !!$('td.DIG3_14_Gray:contains("The game key has been added to the DIG MarketPlace.")').length;
        if (IsSucceed) $anchor.after('<div class="check icon"></div>');else $anchor.after('<div class="remove icon"></div>');
      }
    }
  },
  ccyyshop: function ccyyshop() {
    // inject css
    GM_addStyle("\n      .SBSE-container {\n        width: 80%;\n        position: relative;\n        margin: 0 auto;\n        font-size: 16px;\n        color: #000;\n        z-index: 999;\n      }\n      .SBSE-container__content__model > textarea {\n        background-color: #EEE;\n        box-shadow: 0 0 1px 1px rgba(204,204,204,0.5);\n        border-radius: 5px;\n      }\n      .SBSE-container__content__model > div { text-align: left; }\n      .SBSE-button {\n        width: 80px;\n        border: 1px solid #2e6da4;\n        border-radius: 5px;\n        background-color: #337ab7;\n        color: #FFF;\n      }\n      .SBSE-container label { color: #EEE; }\n      .expanded .showOrderMeta {\n        display: block !important;\n        position: absolute;\n        margin-top: -8px;\n        right: 265px;\n        z-index: 1;\n      }\n    ");
    var handlers = {
      extract: function extract() {
        var data = {
          title: 'CCYYCN Bundle',
          filename: 'CCYYCN Bundle',
          items: []
        };
        $('.deliver-gkey > *:contains(-)').each(function (i, ele) {
          var $ele = $(ele);
          var d = {
            title: $ele.closest('.deliver-game').prev().text().trim(),
            key: $ele.text().trim()
          };
          activator.pushKeyDetails(d);
          data.items.push(d);
        });
        return data;
      },
      reveal: function reveal(e) {
        var $revealBtn = $(e.currentTarget);

        var handler = function handler($games, callback) {
          var game = $games.shift();

          if (game) {
            game.click();
            setTimeout(handler.bind(null, $games, callback), 300);
          } else callback();
        };

        $revealBtn.addClass('SBSE-button--working');
        handler($('.deliver-btn'), function () {
          $revealBtn.removeClass('SBSE-button--working');
          $('.SBSE-button-retrieve').click();
        });
      }
    };
    var $container = container.get('SBSE', handlers);
    $container.find('.SBSE-select-filter').remove(); // hide filter selector

    $container.find('.SBSE-button').addClass('SBSE-button--narrow'); // narrow buttons
    // insert textarea

    $('.featurette-divider').eq(0).after($container);
  },
  groupees: function groupees() {
    if (location.pathname.startsWith('/profile/')) {
      // inject css
      GM_addStyle("\n        .SBSE-container__content__model > textarea, .SBSE-button {\n          background: transparent;\n          border: 1px solid #8cc53f;\n          border-radius: 3px;\n          color: #8cc53f;\n          transition: all 0.8s ease;\n        }\n        .SBSE-button:hover {\n          background-color: #8cc53f;\n          color: white;\n          text-decoration: none;\n        }\n        img.product-cover { display: none; }\n      ");
      var handlers = {
        extract: function extract() {
          var bundleTitle = $('h2').text().trim();
          var data = {
            title: bundleTitle,
            filename: "Groupees ".concat(bundleTitle, " Keys"),
            items: []
          };
          $('.key-block input.code').each(function (i, ele) {
            var $ele = $(ele);
            var key = $ele.val();

            if (key.includes('-')) {
              var $titleEle = $ele.closest('tr').prev().find('td:nth-of-type(3)');
              var d = {
                title: $titleEle.text().trim(),
                key: key,
                used: !!$ele.closest('.key-block').find('.key-status:contains(used)').length
              };
              activator.pushKeyDetails(d);
              data.items.push(d);
            }
          });
          return data;
        },
        reveal: function reveal(e) {
          var $revealBtn = $(e.currentTarget);

          var handler = function handler($games, callback) {
            var game = $games.shift();

            if (game) {
              game.click();
              setTimeout(handler.bind(null, $games, callback), 300);
            } else callback();
          };

          $revealBtn.addClass('SBSE-button--working');
          var $reveals = $('.product:has(img[title*=Steam]) .reveal-product');
          var timer = $reveals.length > 0 ? 1500 : 0;
          $reveals.click();
          setTimeout(function () {
            handler($('.btn-reveal-key'), function () {
              $revealBtn.removeClass('SBSE-button--working');
              $('.SBSE-button-retrieve').click();
            });
          }, timer);
        }
      };
      var $container = container.get('SBSE', handlers);
      $container.find('.SBSE-select-filter').hide(); // hide filter selector
      // append checkbox for used-key

      $('.SBSE-button-setting').before("\n        <label><input type=\"checkbox\" class=\"SBSE-checkbox-skipUsed\" checked>".concat(i18n.get('checkboxSkipUsed'), "</label>\n      ")); // insert container

      $('.table-products').before($container); // load details

      $('img[src*="steam.svg"]').each( /*#__PURE__*/function () {
        var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(index, ele) {
          return regeneratorRuntime.wrap(function _callee13$(_context13) {
            while (1) {
              switch (_context13.prev = _context13.next) {
                case 0:
                  $.ajax({
                    url: $(ele).closest('tr').find('.item-link').attr('href'),
                    data: {
                      v: 1
                    },
                    dataType: 'script'
                  });

                case 1:
                case "end":
                  return _context13.stop();
              }
            }
          }, _callee13);
        }));

        return function (_x12, _x13) {
          return _ref9.apply(this, arguments);
        };
      }()); // bind custom event

      $(document).on('activated', function (e, key, result) {
        if (result.success === 1) $(".btn-steam-redeem[href*=".concat(key, "]")).next('.key-usage-toggler').click();
      });
    } else {
      // inject css
      GM_addStyle("\n        .SBSE-container { margin-bottom: 20px; }\n        .SBSE-container__content__model > textarea { background-color: #EEE; border-radius: 3px; }\n        .SBSE-button { outline: none !important; }\n        .SBSE-button-setting { margin-top: 8px; }\n      ");
      var _handlers = {
        extract: function extract() {
          var bundleTitle = $('.expanded .caption').text().trim();
          var data = {
            title: bundleTitle,
            filename: "Groupees ".concat(bundleTitle, " Keys"),
            items: []
          };
          $('.expanded .code').each(function (i, ele) {
            var $ele = $(ele);
            var d = {
              title: $ele.closest('.details').find('h3').text().trim(),
              key: $ele.val(),
              used: $ele.closest('li').find('.usage').prop('checked')
            };
            activator.pushKeyDetails(d);
            data.items.push(d);
          });
          return data;
        },
        reveal: function reveal(e) {
          var $revealBtn = $(e.currentTarget);

          var handler = function handler($games, callback) {
            var game = $games.shift();

            if (game) {
              game.click();
              setTimeout(handler.bind(null, $games, callback), 300);
            } else callback();
          };

          $revealBtn.addClass('SBSE-button--working');
          var $reveals = $('.product:has(img[title*=Steam]) .reveal-product');
          var timer = $reveals.length > 0 ? 1500 : 0;
          $reveals.click();
          setTimeout(function () {
            handler($('.expanded .reveal'), function () {
              $revealBtn.removeClass('SBSE-button--working');
              $('.SBSE-button-retrieve').click();
            });
          }, timer);
        }
      };

      var _$container2 = container.get('SBSE', _handlers); // append checkbox for used-key


      _$container2.find('.SBSE-button-setting').before($("\n        <label><input type=\"checkbox\" class=\"SBSE-checkbox-skipUsed\" checked>".concat(i18n.get('checkboxSkipUsed'), "</label>\n      "))); // add buttons style via groupees's class


      _$container2.find('.SBSE-button').addClass('btn btn-default'); // insert container


      $('.container > div').eq(1).before(_$container2); // append mark all as used button

      new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          Array.from(mutation.addedNodes).forEach(function (addedNode) {
            var $orderMeta = $(addedNode).find('.order-meta');

            if ($orderMeta.length > 0) {
              $orderMeta.after($("<button class=\"btn btn-default\" style=\"margin-right: 10px;\"><b>".concat(i18n.get('markAllAsUsed'), "</b></button>")).click(function () {
                $('.expanded .usage').each(function (i, checkbox) {
                  if (!checkbox.checked) checkbox.click();
                });
              }));
              $orderMeta.parent().addClass('showOrderMeta');
            }
          });
        });
      }).observe($('#profile_content')[0], {
        childList: true
      }); // bind custom event

      $(document).on('activated', function (e, key, result) {
        if (result.success === 1) $("li.key:has(input[value=".concat(key, "]) .usage")).click();
      });
    }
  },
  agiso: function agiso() {
    var keys = unique($('body').text().match(regKey));

    if (keys.length > 0) {
      // inject css
      GM_addStyle("\n        .SBSE-container__content__model > textarea { border: 1px solid #AAAAAA; }\n        .SBSE-button {\n          border: 1px solid #d3d3d3;\n          background: #e6e6e6 url(images/ui-bg_glass_75_e6e6e6_1x400.png) 50% 50% repeat-x;\n          color: #555555;\n        }\n        .SBSE-button:hover {\n          border-color: #999999;\n          background: #dadada url(images/ui-bg_glass_75_dadada_1x400.png) 50% 50% repeat-x;\n          color: #212121;\n        }\n      ");
      var handlers = {
        extract: function extract() {
          var bundleTitle = $('a[href*="tradeSnap.htm"]').eq(1).text().trim();
          var data = {
            title: bundleTitle,
            filename: "agiso ".concat(bundleTitle, " Keys"),
            items: []
          };
          keys.forEach(function (key) {
            data.items.push({
              key: key
            });
          });
          return data;
        }
      };
      var $container = container.get('SBSE', handlers);
      $container.find('.SBSE-button-reveal, .SBSE-select-filter').remove(); // insert container

      $('#tabs').eq(0).prepend($container);
    }
  },
  keylol: function keylol() {
    if (location.pathname.startsWith('/tooltip')) {
      GM_addStyle('body { overflow: hidden; }');
    }
  },
  yuplay: function yuplay() {
    // inject css
    GM_addStyle("\n      .SBSE-container { margin-top: 20px; }\n      .SBSE-container__content__model > textarea { background-color: rgb(230, 230, 229); color: rgb(27, 26, 26); }\n      .SBSE-container__content__model > div { text-align: left; }\n      .SBSE-button {\n        width: 80px;\n        border: 1px solid #b4de0a;\n        background-color: #b4de0a;\n        color: #1a1a1a;\n      }\n      .SBSE-button:hover {\n        border: 1px solid #a4ca09;\n        background-color: #a4ca09;\n      }\n      .SBSE-container label { color: #1a1a1a; font-weight: 400; }\n      .SBSE-table-appList { margin-bottom: 10px; }\n      .SBSE-table-appList td { vertical-align: top; }\n      .SBSE-table-appList a { display: block; margin-bottom: 5px; }\n      .SBSE-icon { position: relative; top: 5px; }\n    ");
    var handlers = {
      extract: function extract() {
        var data = {
          title: 'Yuplay Games',
          filename: 'Yuplay Games',
          items: []
        };
        $('.product-info').each(function (i, ele) {
          var $ele = $(ele);
          var d = {
            title: $ele.find('.name').text().trim(),
            key: $ele.next('.keys').find('input').val()
          };
          activator.pushKeyDetails(d);
          data.items.push(d);
        });
        return data;
      }
    };

    var appListHandler = function appListHandler(data) {
      if (data.length > 0) {
        var $appList = $('<table class="SBSE-table-appList"></table>');
        $appList.append('<tr><td colspan="2">App List</td></tr>');
        data.forEach(function (d) {
          var $row = $('<tr/>');
          $row.append($('<td/>').append($('<span class="SBSE-icon"></span>').mouseenter(keylolTooltip.show.bind(keylolTooltip))), $("<td><a href=\"https://store.steampowered.com/app/".concat(d.app, "\" target=\"_blank\">").concat(d.title, "</a></td>")));
          d.owned = steam.isOwned(d);
          d.wished = steam.isWished(d);
          if (d.owned) $row.addClass('SBSE-item--owned');
          if (d.wished) $row.addClass('SBSE-item--wished');
          $row.addClass('SBSE-item--processed SBSE-item--steam').attr('data-gameinfo', JSON.stringify(d));
          $appList.append($row);
        });
        $('.list-character').after($appList); // load Keylol tooltip

        keylolTooltip.load(data);
      }
    };

    var $container = container.get('SBSE', handlers);
    $container.find('.SBSE-button').addClass('SBSE-button--narrow'); // narrow buttons

    $container.find('.SBSE-button-reveal, .SBSE-select-filter').remove(); // remove reveal
    // insert textarea

    $('.table-light').eq(0).before($container); // append info from SteamDB if found subid

    $('.list-character p').each(function (i, ele) {
      var $ele = $(ele);
      var text = $ele.text().trim();

      if (text.startsWith('Steam')) {
        var subID = text.match(/\d+/)[0];
        var steamDBUrl = "https://steamdb.info/sub/".concat(subID, "/");
        var steamDBKey = "SBSE_steamDB_sub_".concat(subID);
        var steamDBData = GM_getValue(steamDBKey, '');
        $ele.find('span').replaceWith("<a href=\"".concat(steamDBUrl, "\" target=\"_blank\">").concat(subID, "</a>"));

        if (steamDBData.length === 0) {
          GM_xmlhttpRequest({
            url: steamDBUrl,
            method: 'GET',
            onload: function onload(res) {
              if (res.status === 200) {
                var data = [];
                $(res.response).find('#apps .app').each(function (j, app) {
                  var $app = $(app);
                  var d = {
                    title: $app.children('td').eq(2).text().trim(),
                    app: parseInt($app.attr('data-appid'), 10)
                  };
                  data.push(d);
                });
                GM_setValue(steamDBKey, JSON.stringify(data));
                appListHandler(data);
              }
            }
          });
        } else appListHandler(JSON.parse(steamDBData));
      }
    });
  },
  'gama-gama': function gamaGama() {
    // inject css
    GM_addStyle("\n      .SBSE-container__content__model > textarea { background-color: #ededed; color: #33; border-radius: 4px; }\n      .SBSE-button {\n        width: 80px; height: 35px;\n        border: none; border-radius: 4px;\n        background: linear-gradient(to bottom, #47bceb 0, #18a4dd 30%, #127ba6 100%);\n        color: #fff;\n        box-shadow: 0 1px 3px 1px rgba(0,0,0,.8);\n      }\n      .SBSE-button { font-family: inherit; font-size: inherit; }\n      .SBSE-button:hover { background: linear-gradient(to bottom, #47bceb, #18a4dd); }\n    ");
    var handlers = {
      extract: function extract() {
        var data = {
          title: 'Gama Gama Games',
          filename: 'Gama Gama Games',
          items: []
        };
        $('.gift-line').each(function (i, ele) {
          var $ele = $(ele);
          $ele.find('.key-list > li').each(function (j, key) {
            var d = {
              title: $ele.find('.gift-header').text().trim(),
              key: key.textContent.trim()
            };
            activator.pushKeyDetails(d);
            data.items.push(d);
          });
        });
        return data;
      }
    };
    var $container = container.get('SBSE', handlers);
    $container.find('.SBSE-button').addClass('SBSE-button--narrow'); // narrow buttons

    $container.find('.SBSE-button-reveal, .SBSE-select-filter').remove(); // remove reveal
    // insert textarea

    $('.user-info').eq(0).after($container);
  },
  plati: function plati() {
    var selectedCurrency = GM_getValue('SBSE_selectedCurrency', 'USD');
    var platiCurrency = $('th.product-price select option:selected').text().trim();
    var plati = {
      data: JSON.parse(GM_getValue('SBSE_plati', '{}')),
      save: function save(callback) {
        GM_setValue('SBSE_plati', JSON.stringify(this.data));
        if (typeof callback === 'function') callback();
      },
      set: function set(key, value, callback) {
        this.data[key] = value;
        this.save(callback);
      },
      setItem: function setItem(id, value, save) {
        this.data.itemData[id] = value;
        if (save) this.save();
      },
      get: function get(key) {
        return has.call(this.data, key) ? this.data[key] : null;
      },
      getItem: function getItem(id) {
        return has.call(this.data.itemData, id) ? this.data.itemData[id] : null;
      },
      init: function init() {
        if (!has.call(this.data, 'enablePlatiFeature')) this.data.enablePlatiFeature = true;
        if (!has.call(this.data, 'fetchOnStart')) this.data.fetchOnStart = true;
        if (!has.call(this.data, 'infiniteScroll')) this.data.infiniteScroll = true;
        if (!has.call(this.data, 'itemData')) this.data.itemData = {};
        if (!has.call(this.data, 'filterGame')) this.data.filterGame = true;
        if (!has.call(this.data, 'filterDLC')) this.data.filterDLC = true;
        if (!has.call(this.data, 'filterPackage')) this.data.filterPackage = true;
        if (!has.call(this.data, 'filterBundle')) this.data.filterBundle = true;
        if (!has.call(this.data, 'filterOwned')) this.data.filterOwned = true;
        if (!has.call(this.data, 'filterWished')) this.data.filterWished = true;
        if (!has.call(this.data, 'filterIgnored')) this.data.filterIgnored = true;
        if (!has.call(this.data, 'filterNotOwned')) this.data.filterNotOwned = true;
        if (!has.call(this.data, 'filterNotApplicable')) this.data.filterNotApplicable = true;
        if (!has.call(this.data, 'filterNotFetched')) this.data.filterNotFetched = true;
        this.save();
      }
    };
    var infiniteScroll = {
      enabled: plati.get('infiniteScroll'),
      loading: false,
      lastPage: 0,
      reachedLastPage: false,
      pathname: $('head #popup-container + script').text().match(/\/asp\/block_goods.+?\.asp/)[0],
      parameters: {
        idr: 0,
        sort: 'name',
        page: 0,
        rows: 10,
        curr: 'USD',
        lang: unsafeWindow.plang || 'en-US'
      },
      setParameters: function setParameters() {
        var $paging = $('.pages_nav').eq(0).children('a');
        var onclickArguments = $paging.eq(0).attr('onclick').match(/\((.+)\)/);

        if (onclickArguments[1]) {
          var parameters = onclickArguments[1].split(',').map(function (x) {
            return isNaN(x) ? x.replace(/['"]+/g, '') : parseInt(x, 10);
          });
          this.parameters.idr = parameters[0];
          this.parameters.sort = parameters[1];
          this.parameters.rows = parameters[3];
          this.parameters.curr = parameters[4];
          this.parameters.page = parseInt($paging.filter('.active').text(), 10) + 1;
          this.lastPage = parseInt($paging.filter(':last-child').text(), 10);
        }

        if (this.pathname) {
          var type = this.pathname.slice(-5, -4);
          this.parameters["id_".concat(type)] = location.pathname.includes('/seller/') ? location.pathname.split('/').pop() : this.parameters.idr;
        }
      },
      fetchNextPage: function () {
        var _fetchNextPage = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
          var $loader, $wrap, $table, params, res, $resHTML, $trs;
          return regeneratorRuntime.wrap(function _callee14$(_context14) {
            while (1) {
              switch (_context14.prev = _context14.next) {
                case 0:
                  $loader = $('.content_center .platiru-loader').eq(0);
                  $loader.css('visibility', 'visible');
                  this.loading = true;
                  $wrap = $('.SBSE-infiniteScroll-wrap');
                  $table = $wrap.find('table.goods-table');
                  params = this.parameters;
                  params.rnd = Math.random();

                  if (!this.pathname) {
                    _context14.next = 18;
                    break;
                  }

                  _context14.next = 10;
                  return fetch("".concat(this.pathname, "?").concat($.param(params)));

                case 10:
                  res = _context14.sent;
                  _context14.t0 = $;
                  _context14.next = 14;
                  return res.text();

                case 14:
                  _context14.t1 = _context14.sent;
                  $resHTML = (0, _context14.t0)(_context14.t1);
                  $trs = $resHTML.find('tbody > tr');

                  if (res.ok && $trs.length > 0) {
                    $table.find('tbody').append($trs); // refresh paging

                    $wrap.siblings('.pages_nav, .sort_by').remove();
                    $wrap.after($resHTML.filter('.pages_nav, .sort_by'), $resHTML.find('.goods-table ~ *'));
                    params.page += 1;
                    this.reachedLastPage = params.page > this.lastPage;
                  }

                case 18:
                  this.loading = false;
                  this.scrollHandler();
                  $loader.css('visibility', 'hidden');

                case 21:
                case "end":
                  return _context14.stop();
              }
            }
          }, _callee14, this);
        }));

        function fetchNextPage() {
          return _fetchNextPage.apply(this, arguments);
        }

        return fetchNextPage;
      }(),
      scrollHandler: function scrollHandler() {
        var $wrap = $('.SBSE-infiniteScroll-wrap');

        if ($('body').is('.enablePlatiFeature.infiniteScroll') && $wrap.length > 0 && this.enabled === true && this.loading === false && this.reachedLastPage === false) {
          var spaceTillBotom = $wrap.prop('scrollHeight') - $wrap.scrollTop() - $wrap.height();
          if (spaceTillBotom < 200) this.fetchNextPage();
        }
      },
      init: function init() {
        if ($('.SBSE-infiniteScroll-wrap').length === 0) {
          $('.goods-table').wrap($('<div class="SBSE-infiniteScroll-wrap"></div>').on('scroll', this.scrollHandler.bind(this)));
        }

        this.scrollHandler();
      }
    };
    var processor = {
      fetchItem: function () {
        var _fetchItem = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(queue) {
          var tr, $tr, url, id, classes, res, itemPageHTML, description, found, type, steamID, item;
          return regeneratorRuntime.wrap(function _callee15$(_context15) {
            while (1) {
              switch (_context15.prev = _context15.next) {
                case 0:
                  tr = queue.shift();

                  if (!tr) {
                    _context15.next = 25;
                    break;
                  }

                  $tr = $(tr);
                  url = $tr.attr('data-url');
                  id = parseInt($tr.attr('data-id'), 10);
                  classes = ['SBSE-item--fetching', 'SBSE-item--fetched'];

                  if (!(url.length > 0 && id > 0)) {
                    _context15.next = 20;
                    break;
                  }

                  _context15.next = 9;
                  return fetch(url);

                case 9:
                  res = _context15.sent;

                  if (!res.ok) {
                    _context15.next = 19;
                    break;
                  }

                  _context15.next = 13;
                  return res.text();

                case 13:
                  itemPageHTML = _context15.sent;
                  description = itemPageHTML.slice(itemPageHTML.indexOf('goods-descr-text'), itemPageHTML.indexOf('goods_reviews'));
                  found = description.match(regURL);

                  if (found) {
                    type = found[3].slice(0, 3).toLowerCase();
                    steamID = parseInt(found[4], 10);
                    item = {};
                    item[type] = steamID;
                    plati.setItem(id, item);
                    if (steam.isOwned(item)) classes.push('SBSE-item--owned');
                    if (steam.isWished(item)) classes.push('SBSE-item--wished');
                    if (steam.isIgnored(item)) classes.push('SBSE-item--ignored');
                    if (classes.length === 1) classes.push('SBSE-item--notOwned');
                    if (steam.isGame(item)) classes.push('SBSE-item--game');
                    if (steam.isDLC(item)) classes.push('SBSE-item--DLC');
                    if (steam.isPackage(item)) classes.push('SBSE-item--package');
                  } else {
                    plati.setItem(id, {});
                    classes.push('SBSE-item--notApplicable');
                  }

                  _context15.next = 20;
                  break;

                case 19:
                  classes.push('SBSE-item--failed');

                case 20:
                  $tr.removeClass('SBSE-item--owned SBSE-item--wished SBSE-item--ignored SBSE-item--notOwned SBSE-item--notApplicable');
                  $tr.toggleClass(classes.join(' '));
                  this.fetchItem(queue);
                  _context15.next = 26;
                  break;

                case 25:
                  plati.save();

                case 26:
                case "end":
                  return _context15.stop();
              }
            }
          }, _callee15, this);
        }));

        function fetchItem(_x14) {
          return _fetchItem.apply(this, arguments);
        }

        return fetchItem;
      }(),
      fetchItems: function fetchItems(items) {
        var filters = ['.SBSE-item--fetching'];
        if (plati.get('fetchOnStart')) filters.push('.SBSE-item--fetched');
        var $trs = items && items.length > 0 ? $(items) : $('.goods-table tbody > tr');
        var $filtered = $trs.filter(".SBSE-item--steam:not(".concat(filters.join(), ")"));
        $filtered.addClass('SBSE-item--fetching').removeClass('SBSE-item--notFetched');
        this.fetchItem($filtered.get());
      },
      process: function process() {
        var $rows = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        if (plati.get('enablePlatiFeature')) {
          var $table = $('.goods-table');
          var $trs = $rows && $rows.length > 0 ? $rows : $table.find('tbody > tr'); // setup type & icon node

          $trs.find('td:not(.icon) + .product-sold').before("\n            <td class=\"type\"><span class=\"SBSE-type\"></span></td>\n            <td class=\"icon\"><span class=\"SBSE-icon\"></span></td>\n          "); // setup price node

          $trs.filter(':not(:has(.SBSE-price))').find('.product-price div').each(function (i, price) {
            var $price = $(price);
            var value = parseFloat($price.text().trim()) * 100;
            $price.replaceWith("<span class=\"SBSE-price\" data-currency=\"".concat(platiCurrency, "\" data-value=\"").concat(value, "\"></span>"));
          }); // process

          $trs.filter(':not(.SBSE-item--processing, .SBSE-item--processed)').addClass('SBSE-item--processing SBSE-item--steam').each(function (i, tr) {
            var $tr = $(tr);
            var url = $tr.find('.product-title a').attr('href');
            var id = parseInt(url.split('/').pop(), 10);

            if (url.length > 0 && id > 0) {
              var classes = [];
              var item = plati.getItem(id);

              if (item !== null) {
                classes.push('SBSE-item--fetched');

                if (item.app || item.sub) {
                  if (steam.isOwned(item)) classes.push('SBSE-item--owned');
                  if (steam.isWished(item)) classes.push('SBSE-item--wished');
                  if (steam.isIgnored(item)) classes.push('SBSE-item--ignored');
                  if (classes.length === 1) classes.push('SBSE-item--notOwned');
                  if (steam.isGame(item)) classes.push('SBSE-item--game');
                  if (steam.isDLC(item)) classes.push('SBSE-item--DLC');
                  if (steam.isPackage(item)) classes.push('SBSE-item--package');
                } else classes.push('SBSE-item--notApplicable');

                $tr.attr('data-item', JSON.stringify(item));
              }

              if (classes.length > 0) {
                $tr.removeClass('SBSE-item--owned SBSE-item--wished SBSE-item--ignored SBSE-item--notOwned SBSE-item--notApplicable').addClass(classes.join(' '));
              } else $tr.addClass('SBSE-item--notFetched');

              $tr.attr({
                'data-id': id,
                'data-url': location.origin + url
              });
            }
          }).removeClass('SBSE-item--processing').addClass('SBSE-item--processed'); // auto fetch on page visit

          if (plati.get('fetchOnStart')) this.fetchItems();
          xe.update(selectedCurrency);
        }
      },
      initTable: function initTable(table) {
        var $table = table ? $(table) : $('.goods-table');
        var filters = $('.SBSE-plati-menu [data-config^="filter"] input:not(:checked)').map(function (i, ele) {
          return ele.dataset.filter;
        }).get();
        platiCurrency = $table.find('th.product-price select option:selected').text().trim(); // apply filters

        $table.addClass(filters.join(' ')); // add type & icon

        $table.find('thead th:not(.icon) + .product-sold').before('<th class="type"></th><th class="icon"></th>'); // grab infinite scroll parameters

        infiniteScroll.setParameters(); // bind infinite scroll event

        if (plati.get('infiniteScroll')) infiniteScroll.init();
      },
      init: function init() {
        this.initTable();
        this.process();
        var self = this; // detect list changes

        new MutationObserver(function (mutations) {
          mutations.forEach(function (mutation) {
            Array.from(mutation.addedNodes).forEach(function (addedNode) {
              var $addedNode = $(addedNode);

              if ($addedNode.is('.goods-table')) {
                self.initTable.call(self, $addedNode);
                self.process.call(self, $addedNode.find('tbody tr'));
              }

              if ($addedNode.is('tr')) {
                self.process.call(self, $addedNode);
              }
            });
          });
        }).observe($('body')[0], {
          childList: true,
          subtree: true
        });
      }
    };

    var insertMenu = function insertMenu() {
      var $menu = $("\n        <ul class=\"SBSE-plati-menu\">\n          <li data-config=\"enablePlatiFeature\">\n            <label class=\"SBSE-switch SBSE-switch--small\">\n              <input type=\"checkbox\" id=\"enablePlatiFeature\">\n              <span class=\"SBSE-switch__slider\"></span>\n            </label>\n            <label for=\"enablePlatiFeature\"><span>".concat(i18n.get('enablePlatiFeature'), "</span></label>\n          </li>\n          <li data-config=\"fetchOnStart\">\n            <label class=\"SBSE-switch SBSE-switch--small\">\n              <input type=\"checkbox\" id=\"fetchOnStart\">\n              <span class=\"SBSE-switch__slider\"></span>\n            </label>\n            <label for=\"fetchOnStart\"><span>").concat(i18n.get('platiFetchOnStart'), "</span></label>\n          </li>\n          <li data-config=\"infiniteScroll\">\n            <label class=\"SBSE-switch SBSE-switch--small\">\n              <input type=\"checkbox\" id=\"infiniteScroll\">\n              <span class=\"SBSE-switch__slider\"></span>\n            </label>\n            <label for=\"infiniteScroll\"><span>").concat(i18n.get('platiInfiniteScroll'), "</span></label>\n          </li>\n          <li data-config=\"fetchButton\"><span>").concat(i18n.get('platiFetchButton'), "</span></li>\n          <li data-config=\"filterType\" class=\"SBSE-dropdown\">\n            <span>").concat(i18n.get('platiFilterType'), "</span>\n            <ul class=\"SBSE-dropdown__list\">\n              <li><label><input type=\"checkbox\" data-filter=\"filterGame\"><span>").concat(i18n.get('game'), "</span></label></li>\n              <li><label><input type=\"checkbox\" data-filter=\"filterDLC\"><span>").concat(i18n.get('dlc'), "</span></label></li>\n              <li><label><input type=\"checkbox\" data-filter=\"filterPackage\"><span>").concat(i18n.get('package'), "</span></label></li>\n              <li><label><input type=\"checkbox\" data-filter=\"filterBundle\"><span>").concat(i18n.get('bundle'), "</span></label></li>\n            </ul>\n          </li>\n          <li data-config=\"filterStatus\" class=\"SBSE-dropdown\">\n            <span>").concat(i18n.get('platiFilterStatus'), "</span>\n            <ul class=\"SBSE-dropdown__list\">\n              <li><label><input type=\"checkbox\" data-filter=\"filterOwned\"><span>").concat(i18n.get('owned'), "</span></label></li>\n              <li><label><input type=\"checkbox\" data-filter=\"filterWished\"><span>").concat(i18n.get('wished'), "</span></label></li>\n              <li><label><input type=\"checkbox\" data-filter=\"filterIgnored\"><span>").concat(i18n.get('ignored'), "</span></label></li>\n              <li><label><input type=\"checkbox\" data-filter=\"filterNotOwned\"><span>").concat(i18n.get('notOwned'), "</span></label></li>\n              <li><label><input type=\"checkbox\" data-filter=\"filterNotApplicable\"><span>").concat(i18n.get('notApplicable'), "</span></label></li>\n              <li><label><input type=\"checkbox\" data-filter=\"filterNotFetched\"><span>").concat(i18n.get('notFetched'), "</span></label></li>\n            </ul>\n          </li>\n          <li data-config=\"currency\" class=\"SBSE-dropdown\">\n            <span class=\"selectedCurrency\">").concat(xe.currencies[selectedCurrency][config.get('language')], "</span>\n            <ul class=\"SBSE-dropdown__list\"></ul>\n          </li>\n          <li data-config=\"syncButton\"><span>").concat(i18n.get('settingsSyncLibrary'), "</span></li>\n        </ul>\n      "));
      var $enablePlatiFeature = $menu.find('[data-config="enablePlatiFeature"] input');
      var $fetchOnStart = $menu.find('[data-config="fetchOnStart"] input');
      var $infiniteScroll = $menu.find('[data-config="infiniteScroll"] input');
      var $fetchButton = $menu.find('[data-config="fetchButton"] span');
      var $filters = $menu.find('[data-config^="filter"] input');
      var $currencyToggler = $menu.find('[data-config="currency"] ul');
      var $syncButton = $menu.find('[data-config="syncButton"] span'); // bind event

      $enablePlatiFeature.on('change', function () {
        var state = $enablePlatiFeature.prop('checked');
        plati.set('enablePlatiFeature', state);
        $menu.find('li:not([data-config="enablePlatiFeature"])').toggleClass('hide1', !state);
        if (state) processor.init();
        $('body').toggleClass('enablePlatiFeature', state);
      });
      $fetchOnStart.on('change', function () {
        var state = $fetchOnStart.prop('checked');
        plati.set('fetchOnStart', state);
        $fetchButton.parent().toggleClass('hide2', state);
      });
      $infiniteScroll.on('change', function () {
        var state = $infiniteScroll.prop('checked');
        plati.set('infiniteScroll', state);
        infiniteScroll.enabled = state;
        $('body').toggleClass('infiniteScroll', state); // bind infinite scroll event if not already

        if (state) infiniteScroll.init();
      });
      $fetchButton.on('click', processor.fetchItems.bind(processor));
      $filters.on('change', function (e) {
        var input = e.delegateTarget;
        var filter = input.dataset.filter;
        var state = input.checked;
        plati.set(filter, state);
        $('.goods-table').toggleClass(filter, !state);
        infiniteScroll.scrollHandler();
      });
      Object.keys(xe.currencies).forEach(function (currency) {
        var currencyName = xe.currencies[currency][config.get('language')];
        $currencyToggler.append($("<span>".concat(currencyName, "</span>")).on('click', function () {
          xe.update(currency);
          selectedCurrency = currency;
          $currencyToggler.prev('.selectedCurrency').text(currencyName);
        }));
      });
      $currencyToggler.find('span').wrap('<li></li>');
      $syncButton.on('click', function () {
        steam.sync([{
          key: 'library',
          sync: true,
          save: true,
          notify: true,
          callback: function callback() {
            processor.process($('.goods-table tbody tr.SBSE-item--notOwned')).call(processor);
          }
        }]);
      }); // apply config

      $enablePlatiFeature.prop('checked', plati.get('enablePlatiFeature'));
      $menu.find('li:not([data-config="enablePlatiFeature"])').toggleClass('hide1', !plati.get('enablePlatiFeature'));
      $fetchOnStart.prop('checked', plati.get('fetchOnStart'));
      $infiniteScroll.prop('checked', plati.get('infiniteScroll'));
      $fetchButton.parent().toggleClass('hide2', plati.get('fetchOnStart'));
      $filters.each(function (i, input) {
        var filter = input.dataset.filter;
        var state = plati.get(filter);
        input.checked = state;
        $('.goods-table').toggleClass(filter, !state);
      });
      $('body').toggleClass('enablePlatiFeature', plati.get('enablePlatiFeature')).toggleClass('infiniteScroll', plati.get('infiniteScroll'));
      var $target = $('.merchant_products');
      if ($target.length === 0) $('.content_center').before($menu);else $target.eq(0).prepend($menu);
    };

    plati.init(); // inject css styles

    GM_addStyle("\n      li[class*=\"hide\"] { display: none; }\n      .SBSE-plati-menu { display: flex; margin: 10px 0 0 0 !important; list-style: none; }\n      .SBSE-plati-menu > li { height: 30px; line-height: 30px; padding-right: 30px; }\n      .SBSE-plati-menu > li > .SBSE-switch { vertical-align: text-bottom; }\n      .SBSE-plati-menu > li > * { cursor: pointer; }\n      .SBSE-dropdown__list { width: max-content; z-index: 999; box-shadow: 5px 5px 10px grey; }\n      .SBSE-dropdown__list li { cursor: default; }\n      .SBSE-dropdown__list li > label, .SBSE-dropdown__list li > span { width: 100%; display: inline-block; margin: 0 10px; cursor: pointer; text-align: left; }\n      tr.SBSE-item--processed:hover { background-color: #f3f3f3; }\n      tr.SBSE-item--processed:hover .product-title > div::after { display: none; }\n      .filterGame tr.SBSE-item--game,\n      .filterDLC tr.SBSE-item--DLC,\n      .filterPackage tr.SBSE-item--package,\n      .filterBundle tr.SBSE_bundle,\n      .filterOwned tr.SBSE-item--owned,\n      .filterWished tr.SBSE-item--wished,\n      .filterIgnored tr.SBSE-item--ignored,\n      .filterNotOwned tr.SBSE-item--notOwned,\n      .filterNotApplicable tr.SBSE-item--notApplicable,\n      .filterNotFetched tr.SBSE-item--notFetched { display: none; }\n      body.enablePlatiFeature .content_center { width: initial; }\n      body.enablePlatiFeature .right_side { display: none; }\n      body.enablePlatiFeature .goods-table { width: initial; }\n      body.enablePlatiFeature .product-title > div { max-width: 600px !important; }\n      body.enablePlatiFeature.infiniteScroll .SBSE-infiniteScroll-wrap {\n        max-height: 600px;\n        margin: 10px 0;\n        overflow: auto;\n      }\n      body.enablePlatiFeature.infiniteScroll .goods-table { margin: 0; }\n      body.enablePlatiFeature.infiniteScroll .goods-table tbody > tr > td:last-child { padding-right: 5px; }\n      .SBSE-icon { vertical-align: middle; }\n      body:not(.enablePlatiFeature) .type,\n      body:not(.enablePlatiFeature) .icon { display: none; }\n      .merchant_products > .SBSE-plati-menu { margin: 0 0 10px 0 !important; }\n    ");

    if (location.pathname.startsWith('/seller/') || location.pathname.startsWith('/cat/')) {
      insertMenu();
      processor.init();
    }
  }
};

var init = function init() {
  config.init();
  i18n.init();
  xe.init();
  steam.init();
  settings.init();
  SBSE.init();
  ASF.init();
  container.init();

  if (location.hostname === 'store.steampowered.com') {
    // save sessionID
    if (unsafeWindow.g_AccountID > 0) {
      var currentID = config.get('sessionID');
      var sessionID = unsafeWindow.g_sessionID || '';
      var language = unsafeWindow.g_oSuggestParams.l || 'english';
      if (!config.get('language')) config.set('language', language);

      if (sessionID.length > 0) {
        var update = config.get('autoUpdateSessionID') && currentID !== sessionID;

        if (!currentID || update) {
          config.set('sessionID', sessionID, function () {
            swal({
              title: i18n.get('updateSuccessTitle'),
              text: i18n.get('updateSuccess'),
              type: 'success',
              timer: 3000
            });
          });
        }
      }
    }
  } else {
    var site = location.hostname.replace(/(www|alds|bundle|steamdb)\./, '').split('.').shift(); // check sessionID

    if (!config.get('sessionID')) steam.getSessionID();
    if (has.call(siteHandlers, site)) siteHandlers[site](true);
  }

  keylolTooltip.listen();
};

$(init);
