// ==UserScript==
// @name         Steam Bundle Sites Extension
// @homepage     https://github.com/clancy-chao/Steam-Bundle-Sites-Extension
// @namespace    http://tampermonkey.net/
// @version      2.14.1
// @updateURL    https://github.com/clancy-chao/Steam-Bundle-Sites-Extension/raw/master/SBSE.meta.js
// @downloadURL  https://github.com/clancy-chao/Steam-Bundle-Sites-Extension/raw/master/SBSE.user.js
// @description  A steam bundle sites' tool kits.
// @icon         http://store.steampowered.com/favicon.ico
// @author       Bisumaruko, Cloud
// @include      http*://store.steampowered.com/*
// @include      https://www.indiegala.com/gift*
// @include      https://www.indiegala.com/profile*
// @include      https://www.indiegala.com/game*
// @include      https://www.fanatical.com/*
// @include      https://www.humblebundle.com/*
// @include      http*://*dailyindiegame.com/*
// @include      http*://www.ccyyshop.com/order/*
// @include      https://groupees.com/purchases
// @include      https://groupees.com/profile/purchases/*
// @include      http*://*agiso.com/*
// @include      https://steamdb.steamcn.com/tooltip*
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
// @connect      steamdb.steamcn.com
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
GM_addStyle(GM_getResourceText('flagIcon').replace(/\.\.\//g, 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.1.0/'));

// inject script css styles
GM_addStyle(`
    pre.SBSE-errorMsg { height: 200px; text-align: left; white-space: pre-wrap; }
    a.SBSE-link-steam_store, a.SBSE-link-steam_db { text-decoration: none; font-size: smaller; }
    a.SBSE-link-steam_store:hover, a.SBSE-link-steam_db:hover { text-decoration: none; }

    /* switch */
    .SBSE-switch { position: relative; display: inline-block; width: 60px; height: 30px; }
    .SBSE-switch input { display: none; }
    .SBSE-switch__slider {
        position: absolute;
        top: 0; right: 0; bottom: 0; left: 0;
        background-color: #CCC;
        transition: 0.4s;
        cursor: pointer;
    }
    .SBSE-switch__slider:before {
        width: 26px; height: 26px;
        position: absolute;
        bottom: 2px; left: 2px;
        background-color: white;
        transition: 0.4s;
        content: "";
    }
    .SBSE-switch input:checked + .SBSE-switch__slider { background-color: #2196F3; }
    .SBSE-switch input:focus + .SBSE-switch__slider { box-shadow: 0 0 1px #2196F3; }
    .SBSE-switch input:checked + .SBSE-switch__slider:before { transform: translateX(30px); }
    .SBSE-switch--small { width: 40px; height: 20px; }
    .SBSE-switch--small .SBSE-switch__slider:before { width: 16px; height: 16px; }
    .SBSE-switch--small input:checked + .SBSE-switch__slider:before { transform: translateX(20px); }

    /* dropdown */
    .SBSE-dropdown { display: inline-block; position: relative; }
    .SBSE-dropdown__list {
        width: calc(100% - 10px);
        max-height: 0;
        display: inline-block;
        position: absolute;
        top: 35px; left: 0;
        padding: 0;
        transition: max-height 0.5s ease;
        overflow: hidden;
        list-style-type: none;
        background-color: #EEE;
    }
    .SBSE-dropdown__list > li { width: 100%; display: block; padding: 3px 0; text-align: center; }
    .SBSE-dropdown:hover > .SBSE-dropdown__list { max-height: 500px; }

    /* settings */
    .SBSE-container__content__model[data-feature="setting"] .name { text-align: right; vertical-align: top; }
    .SBSE-container__content__model[data-feature="setting"] .value { text-align: left; }
    .SBSE-container__content__model[data-feature="setting"] .value > * { height: 30px; margin: 0 20px 10px; }
    .SBSE-container__content__model[data-feature="setting"] > span { display: inline-block; color: white; cursor: pointer; }

    /* container */
    .SBSE-container { width: 100%; }
    .SBSE-container__nav > ul { display: flex; margin: 0; padding: 0; list-style: none; }
    .SBSE-container__nav__item {
        flex: 1 1 auto;
        text-align: center;
        cursor: pointer;
    }
    .SBSE-container__nav__item--show {
        border-bottom: 1px solid #29B6F6;
        color: #29B6F6;
    }
    .SBSE-container__nav__item > span { display: block; padding: 10px; }
    .SBSE-container__content__model {
        width: 100%; height: 200px;
        display: flex;
        margin-top: 10px;
        flex-direction: column;
        box-sizing: border-box;
    }
    .SBSE-container__content__model { display: none; }
    .SBSE-container__content__model[data-feature="setting"] { height: 100%; display: block; }
    .SBSE-container__content__model--show { display: block; }
    .SBSE-container__content__model > textarea {
        width: 100%; height: 150px;
        padding: 5px;
        border: none;
        box-sizing: border-box;
        resize: none;
        outline: none;
    }
    .SBSE-container__content__model > div { width: 100%; padding-top: 5px; box-sizing: border-box; }
    .SBSE-button {
        width: 120px;
        position: relative;
        margin-right: 10px;
        line-height: 28px;
        transition: all 0.5s;
        box-sizing: border-box;
        outline: none;
        cursor: pointer;
    }
    .SBSE-select { max-width:120px; height: 30px; }
    .SBSE-container label { margin-right: 10px; }
    .SBSE-dropdown__list-export a { text-decoration: none; color: #333; transition: color 0.3s ease; }
    .SBSE-dropdown__list-export a:hover { text-decoration: none; color: #787878; }
    .SBSE-button-setting {
        width: 20px; height: 20px;
        float: right;
        margin-top: 3px; margin-right: 0; margin-left: 10px;
        background-color: transparent;
        background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGhlaWdodD0iMzJweCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzIgMzI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjMycHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnIGlkPSJMYXllcl8xIi8+PGcgaWQ9ImNvZyI+PHBhdGggZD0iTTMyLDE3Ljk2OXYtNGwtNC43ODEtMS45OTJjLTAuMTMzLTAuMzc1LTAuMjczLTAuNzM4LTAuNDQ1LTEuMDk0bDEuOTMtNC44MDVMMjUuODc1LDMuMjUgICBsLTQuNzYyLDEuOTYxYy0wLjM2My0wLjE3Ni0wLjczNC0wLjMyNC0xLjExNy0wLjQ2MUwxNy45NjksMGgtNGwtMS45NzcsNC43MzRjLTAuMzk4LDAuMTQxLTAuNzgxLDAuMjg5LTEuMTYsMC40NjlsLTQuNzU0LTEuOTEgICBMMy4yNSw2LjEyMWwxLjkzOCw0LjcxMUM1LDExLjIxOSw0Ljg0OCwxMS42MTMsNC43MDMsMTIuMDJMMCwxNC4wMzF2NGw0LjcwNywxLjk2MWMwLjE0NSwwLjQwNiwwLjMwMSwwLjgwMSwwLjQ4OCwxLjE4OCAgIGwtMS45MDIsNC43NDJsMi44MjgsMi44MjhsNC43MjMtMS45NDVjMC4zNzksMC4xOCwwLjc2NiwwLjMyNCwxLjE2NCwwLjQ2MUwxNC4wMzEsMzJoNGwxLjk4LTQuNzU4ICAgYzAuMzc5LTAuMTQxLDAuNzU0LTAuMjg5LDEuMTEzLTAuNDYxbDQuNzk3LDEuOTIybDIuODI4LTIuODI4bC0xLjk2OS00Ljc3M2MwLjE2OC0wLjM1OSwwLjMwNS0wLjcyMywwLjQzOC0xLjA5NEwzMiwxNy45Njl6ICAgIE0xNS45NjksMjJjLTMuMzEyLDAtNi0yLjY4OC02LTZzMi42ODgtNiw2LTZzNiwyLjY4OCw2LDZTMTkuMjgxLDIyLDE1Ljk2OSwyMnoiIHN0eWxlPSJmaWxsOiM0RTRFNTA7Ii8+PC9nPjwvc3ZnPg==);
        background-size: contain;
        background-repeat: no-repeat;
        background-origin: border-box;
        border: none;
        vertical-align: top;
        cursor: pointer;
    }

    /* terminal */
    .SBSE-terminal {
        height: 150px;
        display: none;
        margin: 0;
        padding: 0;
        background-color: #000;
    }
    .SBSE-terminal--show { display: block; }
    .SBSE-terminal > div {
        max-height: 100%;
        display: flex;
        flex-direction: column;
        overflow: auto;
        background-color: transparent;
    }
    .SBSE-terminal > div > span {
        display: inline-block;
        padding-left: 20px;
        color: #FFF;
        text-indent: -20px;
    }
    .SBSE-terminal > div > span:before {
        content: '>';
        width: 20px;
        display: inline-block;
        text-align: center;
        text-indent: 0;
    }
    .SBSE-terminal__message {}
    .SBSE-terminal__input {
        width: 100%;
        position: relative;
        order: 9999;
        box-sizing: border-box;
    }
    .SBSE-terminal__input > input {
        width: inherit;
        max-width: calc(100% - 30px);
        position: absolute;
        top: 0; right: 0; bottom: 0; left: 20px;
        padding: 0;
        border: none;
        outline: none;
        background-color: transparent;
        color: #FFF;
    }
    .SBSE-terminal__input > input:first-child { z-index: 9; }
    .SBSE-terminal__input > input:last-child {
        z-index: 3;
        color: gray;
    }

    /* spinner button affect */
    .SBSE-button:before {
        width: 20px; height: 20px;
        content: '';
        position: absolute;
        margin-top: 5px;
        right: 10px;
        border: 3px solid;
        border-left-color: transparent;
        border-radius: 50%;
        box-sizing: border-box;
        opacity: 0;
        transition: opacity 0.5s;
        animation-duration: 1s;
        animation-iteration-count: infinite;
        animation-name: rotate;
        animation-timing-function: linear;
    }
    .SBSE-button.SBSE-button--narrow.SBSE-button--working {
        width: 100px;
        padding-right: 40px;
        transition: all 0.5s;
    }
    .SBSE-button.SBSE-button--working:before {
        transition-delay: 0.5s;
        transition-duration: 1s;
        opacity: 1;
    }
    @keyframes rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    /* types */
    .SBSE-type {
        height: 20px;
        display: none;
        margin-right: 5px;
        justify-content: center;
    }
    .SBSE-type:before, .SBSE-type:after {
        content: '';
        box-sizing: border-box;
        pointer-events: none;
    }
    .SBSE-type:after { padding: 0 2px; }
    .SBSE-item--game .SBSE-type { background-color: rgba(97,100,101,0.3); }
    .SBSE-item--game .SBSE-type:after { content: 'Game'; }
    .SBSE-item--DLC .SBSE-type { background-color: rgba(165,84,177,0.8); }
    .SBSE-item--DLC .SBSE-type:before {
        content: 'ꜜ';
        width: 14px; height: 14px;
        margin: 3px 0 0 2px;
        border-radius: 50%;
        background-color: #000;
        color: rgba(165,84,177,0.8);
        text-align: center;
        font-size: 28px;
        line-height: 28px;
    }
    .SBSE-item--DLC .SBSE-type:after { content: 'DLC'; }
    .SBSE-item--package .SBSE-type { background-color: rgba(47,137,188,0.8); }
    .SBSE-item--package .SBSE-type:after { content: 'Package'; }
    .SBSE-item--steam .SBSE-type { display: flex; }

    /* icons */
    .SBSE-icon {
        width: 20px; height: 20px;
        display: none;
        margin-left: 5px;
        border-radius: 50%;
        background-color: #E87A90;
        transform: rotate(45deg);
    }
    .SBSE-icon:before, .SBSE-icon:after {
        content: '';
        width: 3px; height: 14px;
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        border-radius: 5px;
        pointer-events: none;
    }
    .SBSE-icon:after { transform: translate(-50%, -50%) rotate(-90deg); }
    .SBSE-item--owned .SBSE-icon { background-color: #9CCC65; }
    .SBSE-item--owned .SBSE-icon:before, .SBSE-item--owned .SBSE-icon:after { transform: none; }
    .SBSE-item--owned .SBSE-icon:before {
        width: 3px; height: 11px;
        top: 4px; left: 10px;
        border-radius: 5px 5px 5px 0;
    }
    .SBSE-item--owned .SBSE-icon:after {
        width: 5px; height: 3px;
        top: 12px; left: 6px;
        border-radius: 5px 0 0 5px;
    }
    .SBSE-item--wished .SBSE-icon { transform: rotate(0); background-color: #29B6F6; }
    .SBSE-item--wished .SBSE-icon:before, .SBSE-item--wished .SBSE-icon:after {
        width: 6px; height: 10px;
        top: 5px; left: 10px;
        border-radius: 6px 6px 0 0;
        transform: rotate(-45deg);
        transform-origin: 0 100%;
    }
    .SBSE-item--wished .SBSE-icon:after {
        left: 4px;
        transform: rotate(45deg);
        transform-origin :100% 100%;
    }
    .SBSE-item--ignored .SBSE-icon { background-color: rgb(135, 173, 189); }
    .SBSE-item--notApplicable .SBSE-icon { transform: rotate(0); background-color: rgb(248, 187, 134); }
    .SBSE-item--notApplicable .SBSE-icon:before {
        content: '?';
        width: 0; height: 10px;
        top: 5px; left: 7px;
        color: white;
        font-size: 16px; font-weight: 900;
    }
    .SBSE-item--notApplicable .SBSE-icon:after { display: none; }
    .SBSE-item--fetching .SBSE-icon { transform: rotate(0); background-color: transparent; }
    .SBSE-item--fetching .SBSE-icon:before {
        width: 20px; height: 20px;
        top: 0; left: 0;
        border: 3px solid grey;
        border-left-color: transparent;
        border-radius: 50%;
        box-sizing: border-box;
        transition: opacity 0.5s;
        animation-duration: 1s;
        animation-iteration-count: infinite;
        animation-name: rotate;
        animation-timing-function: linear;
    }
    .SBSE-item--fetching .SBSE-icon:after { display: none; }
    .SBSE-item--notFetched .SBSE-icon { background-color: transparent; }
    .SBSE-item--notFetched .SBSE-icon:before, .SBSE-item--notFetched .SBSE-icon:after { display: none; }
    .SBSE-item--failed .SBSE-icon { transform: rotate(0); }
    .SBSE-item--failed .SBSE-icon:before {
        content: '!';
        width: 0; height: 10px;
        top: 5px; left: 8.5px;
        color: white;
        font-size: 16px; font-weight: 900;
    }
    .SBSE-item--failed .SBSE-icon:after { display: none; }
    .SBSE-item--steam .SBSE-icon { display: inline-block; }

    /* Steam Tooltip */
    .SBSE-tooltip {
        width: 308px;
        display: none;
        position: fixed;
        overflow: hidden;
        background: url(https://steamstore-a.akamaihd.net/public/images/v6/blue_body_darker_repeat.jpg) -700px center repeat-y scroll rgb(0, 0, 0);
        border: 0;
        box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5);
        transition: all 0.5s;
        z-index: 999;
    }
    .SBSE-tooltip--show{ display: block; }

    /* Tooltip */
    [tooltip]::before, [tooltip]::after {
        position: absolute;
        opacity: 0;
        transition: all 0.15s ease;
    }
    [tooltip]::before {
        width: max-content;
        content: attr(tooltip);
        top: calc(100% + 10px); left: 0;
        padding: 10px;
        color: #4a4c45;
        background-color: white;
        border-radius: 3px;
        box-shadow: 1px 2px 3px rgba(0,0,0,0.45);
    }
    [tooltip]::after {
        content: "";
        top: calc(100% + 5px); left: 10px;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 5px solid white;
    }
    [tooltip]:hover::before, [tooltip]:hover::after { opacity: 1; }
    [tooltip]:not([tooltip-persistent])::before, [tooltip]:not([tooltip-persistent])::after { pointer-events: none; }
`);

// load up
const regURL = /(https?:\/\/)?([.\w]*steam[-.\w]*){1}\/.*?(apps?|subs?){1}\/(\d+){1}(\/.*\/?)?/m;
const regKey = /(?:(?:([A-Z0-9])(?!\1{4})){5}-){2,5}[A-Z0-9]{5}/g;
const eol = "\n";
const tab = "\t";
const has = Object.prototype.hasOwnProperty;
const forEachAsync = (array, callback, lastIterationCallback) => {
    if (!Array.isArray(array)) throw Error('Not an array');
    if (typeof callback !== 'function') throw Error('Not an function');

    const iterators = [...array.keys()];
    const processor = (taskStartTime) => {
        let taskFinishTime;

        do {
            const iterator = iterators.shift();

            if (iterator in array) callback(array[iterator], iterator, array);

            taskFinishTime = window.performance.now();
        } while (taskFinishTime - taskStartTime < 1000 / 60);

        if (iterators.length > 0) requestAnimationFrame(processor);
        // finished iterating array
        else if (typeof lastIterationCallback === 'function') lastIterationCallback();
    };

    requestAnimationFrame(processor);
};
const unique = a => [...new Set(a)];
const isArray = value => Array.isArray(value);
const isObject = value => Object(value) === value;
const request = options => new Promise((resolve, reject) => {
    options.onerror = reject;
    options.ontimeout = reject;
    options.onload = resolve;

    GM_xmlhttpRequest(options);
});

// setup jQuery
const $ = jQuery.noConflict(true);

$.fn.pop = [].pop;
$.fn.shift = [].shift;
$.fn.eachAsync = function eachAsync(callback, lastIterationCallback) {
    forEachAsync(this.get(), callback, lastIterationCallback);
};

const config = {
    data: JSON.parse(GM_getValue('SBSE_config', '{}')),
    set(key, value, callback) {
        this.data[key] = value;
        GM_setValue('SBSE_config', JSON.stringify(this.data));

        if (typeof callback === 'function') callback();
    },
    get(key) {
        return has.call(this.data, key) ? this.data[key] : null;
    },
    init() {
        if (!has.call(this.data, 'autoUpdateSessionID')) this.data.autoUpdateSessionID = true;
        if (!has.call(this.data, 'autoSyncLibrary')) this.data.autoSyncLibrary = true;
        if (!has.call(this.data, 'ASFFormat')) this.data.ASFFormat = false;
        if (!has.call(this.data, 'titleComesLast')) this.data.titleComesLast = false;
        if (!has.call(this.data, 'activateAllKeys')) this.data.activateAllKeys = false;
        if (!has.call(this.data, 'enableTooltips')) this.data.enableTooltips = this.get('language') !== 'english';
        if (!has.call(this.data, 'enableASFIPC')) this.data.enableASFIPC = false;
        if (!has.call(this.data, 'ASFIPCProtocol')) this.data.ASFIPCProtocol = 'http';
        if (!has.call(this.data, 'ASFIPCServer')) this.data.ASFIPCServer = '127.0.0.1';
        if (!has.call(this.data, 'ASFIPCPort')) this.data.ASFIPCPort = 1242;
        if (!has.call(this.data, 'ASFIPCPassword')) this.data.ASFIPCPassword = '';
    },
};
const i18n = {
    data: {
        tchinese: {
            name: '繁體中文',
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
            settingsEnableTooltips: 'SteamCN 論壇提示框',
            settingsEnableASFIPC: '啟用ASF IPC',
            settingsASFIPCProtocol: 'ASF IPC 傳輸協定',
            settingsASFIPCServer: 'ASF IPC IP位址',
            settingsASFIPCPort: 'ASF IPC 連接埠',
            settingsASFIPCPassword: 'ASF IPC 密碼',
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
            package: '合集',
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
            platiFilterStatus: '顯示狀態',
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
            settingsEnableTooltips: 'SteamCN 论坛提示窗',
            settingsEnableASFIPC: '启用ASF IPC',
            settingsASFIPCProtocol: 'ASF IPC 传输协议',
            settingsASFIPCServer: 'ASF IPC IP地址',
            settingsASFIPCPort: 'ASF IPC 端口',
            settingsASFIPCPassword: 'ASF IPC 密码',
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
            package: '礼包',
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
            platiFilterStatus: '显示状态',
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
            settingsEnableTooltips: 'Tooltips from SteamCN',
            settingsEnableASFIPC: 'Enable ASF IPC',
            settingsASFIPCProtocol: 'ASF IPC Protocol',
            settingsASFIPCServer: 'ASF IPC IP Address',
            settingsASFIPCPort: 'ASF IPC Port',
            settingsASFIPCPassword: 'ASF IPC Password',
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
            package: 'Package',
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
            platiFilterStatus: 'Show Status',
        },
    },
    language: null,
    set() {
        const selectedLanguage = has.call(this.data, config.get('language')) ? config.get('language') : 'english';

        this.language = this.data[selectedLanguage];
    },
    get(key) {
        return has.call(this.language, key) ? this.language[key] : this.data.english[key];
    },
    init() {
        this.set();
    },
};
const ISO2 = {
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
            ZW: '辛巴威',
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
            ZW: '津巴布韦',
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
            ZW: 'Zimbabwe',
        },
    },
    get(code, language) {
        const data = this.name[(language || config.get('language') || 'english')];

        return has.call(data, code) ? data[code] : code;
    },
};
const xe = {
    exchangeRate: JSON.parse(GM_getValue('SBSE_xe', '{}')),
    currencies: {
        AUD: {
            english: 'Australian Dollar',
            tchinese: '澳幣',
            schinese: '澳元',
            symbol: 'AU$',
            decimal: true,
        },
        CAD: {
            english: 'Canadian Dollar',
            tchinese: '加幣',
            schinese: '加元',
            symbol: 'CA$',
            decimal: true,
        },
        CNY: {
            english: 'Chinese Yuan',
            tchinese: '人民幣',
            schinese: '人民币',
            symbol: 'CN¥',
            decimal: true,
        },
        EUR: {
            english: 'Euro',
            tchinese: '歐元',
            schinese: '欧元',
            symbol: '€',
            decimal: true,
        },
        GBP: {
            english: 'Great Britain Pound',
            tchinese: '英鎊',
            schinese: '英镑',
            symbol: '£',
            decimal: true,
        },
        HKD: {
            english: 'Hong Kong Dollar',
            tchinese: '港幣',
            schinese: '港元',
            symbol: 'HK$',
            decimal: false,
        },
        JPY: {
            english: 'Japanese Yen',
            tchinese: '日圓',
            schinese: '日元',
            symbol: 'JP¥',
            decimal: false,
        },
        KRW: {
            english: 'South Korean Won',
            tchinese: '韓圓',
            schinese: '韩币',
            symbol: '₩',
            decimal: false,
        },
        MYR: {
            english: 'Malaysian Ringgit',
            tchinese: '令吉',
            schinese: '林吉特',
            symbol: 'RM',
            decimal: true,
        },
        NTD: {
            english: 'New Taiwan Dollar',
            tchinese: '台幣',
            schinese: '台币',
            symbol: 'NT$',
            decimal: false,
        },
        NZD: {
            english: 'New Zealand Dollar',
            tchinese: '紐幣',
            schinese: '新西兰元',
            symbol: 'NZ$',
            decimal: true,
        },
        RUB: {
            english: 'Russian Ruble',
            tchinese: '盧布',
            schinese: '卢布',
            symbol: '₽',
            decimal: false,
        },
        USD: {
            english: 'United States Dollar',
            tchinese: '美元',
            schinese: '美元',
            symbol: 'US$',
            decimal: true,
        },
    },
    getRate() {
        const self = this;

        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml',
            onload: (res) => {
                if (res.status === 200) {
                    try {
                        const exchangeRate = {
                            lastUpdate: Date.now(),
                            rates: {},
                        };

                        res.response.split(eol).forEach((line) => {
                            if (line.includes('currency=')) {
                                const currency = line.split('currency=\'').pop().slice(0, 3);
                                const rate = line.trim().split('rate=\'').pop().slice(0, -3);

                                exchangeRate.rates[currency] = parseFloat(rate);
                            }
                        });
                        exchangeRate.rates.EUR = 1;

                        // get NTD
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: 'https://www.google.com/search?q=1+EUR+%3D+NTD',
                            onload: (searchRes) => {
                                const rate = parseFloat(searchRes.response.split('<div class="vk_ans vk_bk">').pop().slice(0, 7).trim());
                                const NTDRate = isNaN(rate) ? exchangeRate.rates.HKD * 3.75 : rate;

                                exchangeRate.rates.NTD = NTDRate;
                                self.exchangeRate = exchangeRate;
                                GM_setValue('SBSE_xe', JSON.stringify(exchangeRate));
                            },
                        });

                        // get UAH
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: 'https://www.google.com/search?q=1+EUR+%3D+UAH',
                            onload: (searchRes) => {
                                const rate = parseFloat(searchRes.response.split('<div class="vk_ans vk_bk">').pop().slice(0, 7).trim());
                                const UAHRate = isNaN(rate) ? 32.85 : rate;

                                exchangeRate.rates.UAH = UAHRate;
                                self.exchangeRate = exchangeRate;
                                GM_setValue('SBSE_xe', JSON.stringify(exchangeRate));
                            },
                        });
                    } catch (e) {
                        swal(
                            'Parsing Failed',
                            'An error occured when parsing exchange rate data, please reload to try again',
                            'error',
                        );
                    }
                } else {
                    swal(
                        'Loading Failed',
                        'Unable to fetch exchange rate data, please reload to try again',
                        'error',
                    );
                }
            },
        });
    },
    update(targetCurrency = 'USD') {
        $('.SBSE-price').each((i, ele) => {
            const originalCurrency = ele.dataset.currency;
            const originalValue = parseInt(ele.dataset.value, 10);
            const originalRate = this.exchangeRate.rates[originalCurrency];
            const targetRate = this.exchangeRate.rates[targetCurrency];
            const exchangedValue = Math.trunc((originalValue / originalRate) * targetRate);
            const symbol = this.currencies[targetCurrency].symbol;
            const decimalPlace = this.currencies[targetCurrency].decimal ? 2 : 0;

            $(ele).text(symbol + (exchangedValue / 100).toFixed(decimalPlace));
        });
        GM_setValue('SBSE_selectedCurrency', targetCurrency);
    },
    init() {
        const updateTimer = 12 * 60 * 60 * 1000; // update every 12 hours
        const newRate = ['UAH'];

        if (Object.keys(this.exchangeRate).length === 0 ||
            this.exchangeRate.lastUpdate < (Date.now() - updateTimer) ||
            newRate.filter(x => !has.call(this.exchangeRate.rates, x)).length > 0
        ) this.getRate();
    },
};
const steam = {
    library: JSON.parse(GM_getValue('SBSE_steam_library', '{}')),
    games: JSON.parse(GM_getValue('SBSE_steam_games', '{}')),
    getSessionID: async () => {
        const res = await request({
            method: 'GET',
            url: 'https://store.steampowered.com/',
        });

        if (res.status === 200) {
            const accountID = res.response.match(/g_AccountID = (\d+)/).pop();
            const sessionID = res.response.match(/g_sessionID = "(\w+)"/).pop();

            if (accountID > 0) config.set('sessionID', sessionID);
            else {
                swal({
                    title: i18n.get('notLoggedInTitle'),
                    text: i18n.get('notLoggedInMsg'),
                    type: 'error',
                    showCancelButton: true,
                }).then((result) => {
                    if (result.value === true) window.open('https://store.steampowered.com/');
                });
            }
        }
    },
    sync(a = []) {
        if (!isArray(a) || a.length === 0) {
            a.push(
                { key: 'library', sync: true, save: true },
                { key: 'games', sync: true, save: true },
            );
        }

        const self = this;

        a.forEach((o) => {
            if (o.key === 'library' && o.sync !== false) {
                if (o.notify === true) swal.showLoading();
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://store.steampowered.com/dynamicstore/userdata/t=${Math.random()}`,
                    onload(res) {
                        const data = JSON.parse(res.response);

                        if (!isObject(self.library)) self.reset([o]);

                        self.library.owned = {
                            app: isArray(data.rgOwnedApps) ? data.rgOwnedApps : [],
                            sub: isArray(data.rgOwnedPackages) ? data.rgOwnedPackages : [],
                        };
                        self.library.wished = {
                            app: isArray(data.rgWishlist) ? data.rgWishlist : [],
                            sub: [],
                        };
                        self.library.ignored = {
                            app: isArray(data.rgIgnoredApps) ? data.rgIgnoredApps : [],
                            sub: isArray(data.rgIgnoredPackages) ? data.rgIgnoredPackages : [],
                        };
                        self.library.lastSync = Date.now();
                        self.save([o]);

                        if (o.notify === true) {
                            swal({
                                title: i18n.get('syncSuccessTitle'),
                                text: i18n.get('syncSuccess'),
                                type: 'success',
                                timer: 3000,
                            });
                        }

                        if (typeof o.callback === 'function') o.callback();
                    },
                    onerror() {
                        swal({
                            title: i18n.get('syncFailTitle'),
                            text: i18n.get('syncFail'),
                            type: 'error',
                            confirmButtonText: i18n.get('visitSteam'),
                            showCancelButton: true,
                        }).then((result) => {
                            if (result.value === true) window.open('https://store.steampowered.com/');
                        });
                    },
                });
            }
            if (o.key === 'games' && o.sync !== false) {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'http://steamspy.com/api.php?request=all',
                    onload(res) {
                        try {
                            const data = JSON.parse(res.response);

                            self.games = {
                                list: Object.keys(data).map(x => parseInt(x, 10)),
                                lastSync: Date.now(),
                            };
                            self.save([o]);

                            if (typeof o.callback === 'function') o.callback();
                        } catch (e) {
                            throw e.stack;
                        }
                    },
                });
            }
        });
    },
    reset(a = []) {
        if (!isArray(a) || a.length === 0) {
            a.push(
                { key: 'library', reset: true, save: true },
                { key: 'games', reset: true, save: true },
            );
        }

        a.forEach((o) => {
            if (o.key === 'library' && o.reset !== false) {
                this.library = {
                    lastSync: 0,
                    owned: { app: [], sub: [] },
                    wished: { app: [], sub: [] },
                    ignored: { app: [], sub: [] },
                };
            }
            if (o.key === 'games' && o.reset !== false) {
                this.games = {
                    lastSync: 0,
                    list: [],
                };
            }

            if (o.save !== false) this.save([o]);
        });
    },
    save(a = []) {
        if (!isArray(a) || a.length === 0) {
            a.push(
                { key: 'library', save: true },
                { key: 'games', save: true },
            );
        }

        a.forEach((o) => {
            if (has.call(this, o.key) && o.save !== false) {
                GM_setValue(`SBSE_steam_${o.key}`, JSON.stringify(this[o.key]));
                if (typeof o.callback === 'function') o.callback();
            }
        });
    },
    lastSync(key) {
        return has.call(this, key) ? this[key].lastSync : null;
    },
    isOwned(o) {
        return this.library.owned.app.includes(o.app) || this.library.owned.sub.includes(o.sub);
    },
    isWished(o) {
        return this.library.wished.app.includes(o.app) || this.library.wished.sub.includes(o.sub);
    },
    isIgnored(o) {
        return this.library.ignored.app.includes(o.app) || this.library.ignored.sub.includes(o.sub);
    },
    isGame(o) {
        return this.games.list.length > 0 && this.games.list.includes(o.app);
    },
    isDLC(o) {
        return has.call(o, 'app') && this.games.list.length > 0 && !this.games.list.includes(o.app);
    },
    isPackage(o) {
        return has.call(o, 'sub');
    },
    init() {
        if (!isObject(this.library) ||
            !has.call(this.library, 'owned') ||
            !has.call(this.library, 'wished') ||
            !has.call(this.library, 'ignored')) this.reset([{ key: 'library' }]);

        if (!isObject(this.games) ||
            !has.call(this.games, 'list')) this.reset([{ key: 'games' }]);

        if (config.get('autoSyncLibrary')) {
            // sync Steam library every 10 min
            const libraryTimer = 10 * 60 * 1000;
            const libraryLastSync = this.lastSync('library');

            if (!libraryLastSync || libraryLastSync < (Date.now() - libraryTimer)) this.sync([{ key: 'library' }]);

            // sync Steam games list every day
            const gamesTimer = 1 * 24 * 60 * 60 * 1000;
            const gamesLastSync = this.lastSync('games');

            if (!gamesLastSync || gamesLastSync < (Date.now() - gamesTimer) || this.games.list.length === 0) this.sync([{ key: 'games' }]);
        }

        // delete odd values
        GM_deleteValue('SBSE_steam');
    },
};
const activator = {
    activated: JSON.parse(GM_getValue('SBSE_activated', '[]')),
    isActivated(key) {
        return this.activated.includes(key);
    },
    pushActivated(key) {
        this.activated.push(key);
        GM_setValue('SBSE_activated', JSON.stringify(this.activated));
    },
    keyDetails: {},
    isOwned(key) {
        return has.call(this.keyDetails, key) ? this.keyDetails[key].owned : false;
    },
    pushKeyDetails(data) {
        if (!has.call(this.keyDetails, data.key)) this.keyDetails[data.key] = data;
    },
    getKeyDetails(key) {
        return has.call(this.keyDetails, key) ? this.keyDetails[key] : null;
    },
    results: [],
    resultDetails(result) {
        // result from Steam
        if (result.SBSE !== true) {
            // get status
            let status = i18n.get('failStatus');
            let statusMsg = i18n.get('failDetailUnexpected');
            const errorCode = result.purchase_result_details;
            const errors = {
                14: i18n.get('failDetailInvalidKey'),
                15: i18n.get('failDetailUsedKey'),
                53: i18n.get('failDetailRateLimited'),
                13: i18n.get('failDetailCountryRestricted'),
                9: i18n.get('failDetailAlreadyOwned'),
                24: i18n.get('failDetailMissingBaseGame'),
                36: i18n.get('failDetailPS3Required'),
                50: i18n.get('failDetailGiftWallet'),
            };

            if (result.success === 1) {
                status = i18n.get('successStatus');
                statusMsg = i18n.get('successDetail');
            } else if (result.success === 2) {
                if (has.call(errors, errorCode)) statusMsg = errors[errorCode];
            }

            result.status = `${status}/${statusMsg}`;

            // get description
            const info = result.purchase_receipt_info;
            const chuncks = [];

            if (info && info.line_items) {
                info.line_items.forEach((item) => {
                    const chunk = [];

                    if (item.packageid > 0) chunk.push(`sub: ${item.packageid}`);
                    if (item.appid > 0) chunk.push(`app: ${item.appid}`);
                    chunk.push(item.line_item_description);

                    chuncks.push(chunk.join(' '));
                });
            }

            result.descripton = chuncks.join(', ');
        }

        const temp = [result.key];

        if (result.status) temp.push(result.status);
        if (result.descripton) temp.push(result.descripton);

        return temp.join(' | ');
    },
    activate(keys, callback) {
        this.results.length = 0;

        const updateResults = () => {
            $('.SBSE-container__content__model[data-feature="SBSE"] > textarea').val(this.results.concat(keys).join(eol));
        };
        const activateHandler = () => {
            const key = keys.shift();

            if (key) {
                if (this.isActivated(key)) {
                    this.results.push(this.resultDetails({
                        SBSE: true,
                        key,
                        status: `${i18n.get('skippedStatus')}/${i18n.get('activatedDetail')}`,
                        descripton: i18n.get('noItemDetails'),
                    }));
                    updateResults();

                    // next key
                    activateHandler();
                } else if (this.isOwned(key) && !config.get('activateAllKeys')) {
                    const detail = this.getKeyDetails(key);
                    const description = [];

                    ['app', 'sub'].forEach((type) => {
                        if (has.call(detail, type)) description.push(`${type}: ${detail[type]} ${detail.title}`);
                    });

                    this.results.push(this.resultDetails({
                        SBSE: true,
                        key,
                        status: `${i18n.get('skippedStatus')}/${i18n.get('failDetailAlreadyOwned')}`,
                        descripton: description.join(),
                    }));
                    updateResults();

                    // next key
                    activateHandler();
                } else {
                    const self = this;

                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: 'https://store.steampowered.com/account/ajaxregisterkey/',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            Origin: 'https://store.steampowered.com',
                            Referer: 'https://store.steampowered.com/account/registerkey',
                        },
                        data: `product_key=${key}&sessionid=${config.get('sessionID')}`,
                        onload(res) {
                            if (res.status === 200) {
                                const result = JSON.parse(res.response);

                                // update activated
                                const failCode = result.purchase_result_details;
                                if (result.success === 1 || [14, 15, 9].includes(failCode)) {
                                    self.pushActivated(key);

                                    // dispatch activated event
                                    $(document).trigger('activated', [key, result]);
                                }

                                result.key = key;
                                self.results.push(self.resultDetails(result));
                                updateResults();

                                // next key
                                setTimeout(activateHandler.bind(self), 2000);
                            } else {
                                const errorMsg = [];

                                errorMsg.push('<pre class="SBSE-errorMsg">');
                                errorMsg.push(`sessionID: ${config.get('sessionID') + eol}`);
                                errorMsg.push(`autoUpdate: ${config.get('autoUpdateSessionID') + eol}`);
                                errorMsg.push(`status: ${res.status + eol}`);
                                errorMsg.push(`response: ${res.response + eol}`);
                                errorMsg.push('</pre>');

                                swal({
                                    title: i18n.get('failTitle'),
                                    html: i18n.get('failDetailRequestFailedNeedUpdate') + eol + errorMsg.join(''),
                                    type: 'error',
                                });
                                steam.getSessionID();
                                if (typeof callback === 'function') callback();
                            }
                        },
                    });
                }
            } else if (typeof callback === 'function') callback();
        };

        activateHandler();
    },
};

// models
const settings = {
    model: null,
    getModel() {
        return this.model instanceof $ ? this.model : $();
    },
    display() {
        swal({
            title: i18n.get('settingsTitle'),
            onBeforeOpen: (dom) => {
                $(dom).find('.swal2-content').append(settings.getModel());
            },
        });
    },
    init() {
        const settingDetails = [{
            name: i18n.get('settingsAutoUpdateSessionID'),
            configItem: 'autoUpdateSessionID',
            type: 'switch',
        }, {
            name: i18n.get('settingsSessionID'),
            configItem: 'sessionID',
            type: 'text',
        }, {
            name: i18n.get('settingsAutoSyncLibrary'),
            configItem: 'autoSyncLibrary',
            type: 'switch',
        }, {
            name: i18n.get('settingsSyncLibrary'),
            configItem: 'syncLibrary',
            type: 'button',
            textContent: i18n.get('settingsSyncLibraryButton'),
        }, {
            name: i18n.get('settingsLanguage'),
            configItem: 'language',
            type: 'select',
        }, {
            name: i18n.get('settingsASFFormat'),
            configItem: 'ASFFormat',
            type: 'switch',
        }, {
            name: i18n.get('settingsTitleComesLast'),
            configItem: 'titleComesLast',
            type: 'switch',
        }, {
            name: i18n.get('settingsActivateAllKeys'),
            configItem: 'activateAllKeys',
            type: 'switch',
        }, {
            name: i18n.get('settingsEnableTooltips'),
            configItem: 'enableTooltips',
            type: 'switch',
        }, {
            name: i18n.get('settingsEnableASFIPC'),
            configItem: 'enableASFIPC',
            type: 'switch',
        }, {
            name: i18n.get('settingsASFIPCProtocol'),
            configItem: 'ASFIPCProtocol',
            type: 'select',
            options: ['http', 'https'],
        }, {
            name: i18n.get('settingsASFIPCServer'),
            configItem: 'ASFIPCServer',
            type: 'text',
        }, {
            name: i18n.get('settingsASFIPCPort'),
            configItem: 'ASFIPCPort',
            type: 'text',
        }, {
            name: i18n.get('settingsASFIPCPassword'),
            configItem: 'ASFIPCPassword',
            type: 'text',
        }];
        const $model = $('<div class="SBSE-container__content__model" data-feature="setting"><table></table></div>');

        // append settings
        settingDetails.forEach((detail) => {
            const $tr = $(`<tr><td class="name">${detail.name}</td><td class="value"></td></tr>`).appendTo($model.find('table'));

            switch (detail.type) {
                case 'switch':
                    $tr.find('.value').append(`
                        <label class="SBSE-switch">
                            <input type="checkbox" data-config="${detail.configItem}">
                            <span class="SBSE-switch__slider"></span>
                        </label>
                    `);
                    break;
                case 'text':
                    $tr.find('.value').append(`<input type="text" data-config="${detail.configItem}" value="${config.get(detail.configItem)}">`);
                    break;
                case 'button':
                    $tr.find('.value').append(`<button data-config="${detail.configItem}">${detail.textContent}</button>`);
                    break;
                case 'select':
                    $tr.find('.value').append(`<select data-config="${detail.configItem}"></select>`);
                    if (detail.options) $tr.find('select').append(`${detail.options.map(x => `<option value="${x}">${x}</option>`)}`);
                    break;
                default:
            }
        });

        // apply settings
        const $sessionID = $model.find('[data-config="sessionID"]');
        const $language = $model.find('[data-config="language"]');
        const $ASFIPC = $model.find('[data-config^="ASFIPC"]');

        // toggles
        $model.find('.SBSE-switch input[type="checkbox"]').each((i, input) => {
            const $input = $(input);

            $input.prop('checked', config.get(input.dataset.config));
            $input.on('change', (e) => {
                swal.showLoading();

                const configItem = e.delegateTarget.dataset.config;
                const state = e.delegateTarget.checked;

                config.set(configItem, state);

                if (configItem === 'autoUpdateSessionID') $sessionID.prop('disabled', state);
                if (configItem === 'enableASFIPC') $ASFIPC.prop('disabled', !state);

                setTimeout(swal.hideLoading, 500);
            });
        });

        // toggle - disable related fields
        // sessionID
        $sessionID.prop('disabled', config.get('autoUpdateSessionID'));
        $ASFIPC.prop('disabled', !config.get('enableASFIPC'));

        // input text
        $model.find('input[type="text"]').on('input', (e) => {
            swal.showLoading();

            const configItem = e.delegateTarget.dataset.config;
            const value = e.delegateTarget.value.trim();

            config.set(configItem, value);

            setTimeout(swal.hideLoading, 500);
        });

        // select
        $model.find('select').on('change', (e) => {
            swal.showLoading();

            const configItem = e.delegateTarget.dataset.config;
            const value = e.delegateTarget.value;

            config.set(configItem, value);
            if (configItem === 'language') i18n.set();

            setTimeout(swal.hideLoading, 500);
        });

        // select - language options
        Object.keys(i18n.data).forEach((lang) => {
            $language.append(new Option(i18n.data[lang].name, lang));
        });

        // select - language
        $language.val(config.get('language'));
        // select - ASF IPC protocol
        $ASFIPC.filter('select').val(config.get('ASFIPCProtocol'));

        // button - sync library
        $model.find('[data-config="syncLibrary"]').on('click', () => {
            steam.sync([{ key: 'library', notify: true }]);
        });

        this.model = $model;
    },
};
const SBSE = {
    model: null,
    handlers: {
        extract() {
            return { items: [] };
        },
        retrieve() {
            const $model = SBSE.getModel();
            const data = this.extract();
            const keys = [];
            const includeTitle = $model.find('.SBSE-checkbox-title').prop('checked');
            const joinKeys = $model.find('.SBSE-checkbox-join').prop('checked');
            const selected = $model.find('.SBSE-select-filter').val() || 'All';
            const skipUsed = $model.find('.SBSE-checkbox-skipUsed').prop('checked');
            const skipMarketListing = !$model.find('.SBSE-checkbox-marketListings').prop('checked');
            const separator = joinKeys ? ',' : eol;
            const prefix = joinKeys && config.get('ASFFormat') ? '!redeem ' : '';

            for (let i = 0; i < data.items.length; i += 1) {
                const item = data.items[i];
                let skip = false;

                if (selected === 'Owned' && !item.owned) skip = true;
                if (selected === 'NotOwned' && item.owned) skip = true;
                if (skipUsed && item.used) skip = true;
                if (skipMarketListing && item.marketListing) skip = true;

                if (!skip) {
                    const temp = [item.key];

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
        activate(e) {
            const $textarea = SBSE.getModel().find('textarea');
            const keys = unique($textarea.val().match(regKey));

            if (keys.length > 0) {
                const $activateBtn = $(e.currentTarget);

                $activateBtn.prop('disabled', true).addClass('SBSE-button--working');
                $textarea.prop('disabled', true);

                $textarea.val(keys.join(eol));
                activator.activate(keys, () => {
                    $activateBtn.prop('disabled', false).removeClass('SBSE-button--working');
                    $textarea.prop('disabled', false);
                });
            } else $textarea.val(i18n.get('emptyInput'));
        },
        copy() {
            SBSE.getModel().find('textarea').select();
            document.execCommand('copy');
        },
        reset() {
            SBSE.getModel().find('textarea').val('');
        },
        export(e) {
            const data = this.extract();

            if (data.items.length > 0) {
                const exportBtn = e.target;

                exportBtn.removeAttribute('href');
                exportBtn.removeAttribute('download');

                const fileType = exportBtn.dataset.filetype || 'txt';
                const filename = data.filename.replace(/[\\/:*?"<>|!]/g, '');
                const separator = {
                    txt: ', ',
                    csv: ',',
                    keys: tab,
                };
                const formattedData = data.items.map((line) => {
                    const temp = [];

                    if (line.title) temp.push(line.title.replace(/,/g, ' '));
                    temp.push(line.key);

                    return temp.join(separator[fileType]);
                }).join(eol);

                exportBtn.href = `data:text/${fileType};charset=utf-8,\ufeff${encodeURIComponent(formattedData)}`;
                exportBtn.download = `${filename}.${fileType}`;
            }
        },
    },
    setHandlers(handlers) {
        this.handlers = Object.assign(this.handlers, handlers);
    },
    getModel() {
        return this.model instanceof $ ? this.model : $();
    },
    init() {
        // construct SBSE model
        const $model = $('<div class="SBSE-container__content__model" data-feature="SBSE"></div>');

        $model.append(`
            <textarea></textarea>
            <div>
                <button class="SBSE-button SBSE-button-reveal">${i18n.get('buttonReveal')}</button>
                <button class="SBSE-button SBSE-button-retrieve">${i18n.get('buttonRetrieve')}</button>
                <button class="SBSE-button SBSE-button-activate">${i18n.get('buttonActivate')}</button>
                <button class="SBSE-button SBSE-button-copy">${i18n.get('buttonCopy')}</button>
                <button class="SBSE-button SBSE-button-reset">${i18n.get('buttonReset')}</button>
                <div class="SBSE-dropdown SBSE-dropdown-export">
                    <button class="SBSE-button SBSE-button-export">${i18n.get('buttonExport')}</button>
                    <ul class="SBSE-dropdown__list SBSE-dropdown__list-export">
                        <li><a data-fileType="txt">.txt</a></li>
                        <li><a data-fileType="csv">.csv</a></li>
                        <li><a data-fileType="keys">.keys</a></li>
                    </ul>
                </div>
                <label><input type="checkbox" class="SBSE-checkbox SBSE-checkbox-title" data-config="SBSE_ChkTitle">${i18n.get('checkboxIncludeGameTitle')}</label>
                <label><input type="checkbox" class="SBSE-checkbox SBSE-checkbox-join" data-config="SBSE_ChkJoin">${i18n.get('checkboxJoinKeys')}</label>
                <select class="SBSE-select SBSE-select-filter">
                    <option value="All" selected>${i18n.get('selectFilterAll')}</option>
                    <option value="Owned">${i18n.get('selectFilterOwned')}</option>
                    <option value="NotOwned">${i18n.get('selectFilterNotOwned')}</option>
                </select>
                <button class="SBSE-button-setting"> </button>
            </div>
        `);

        // bind handlers
        const handlers = this.handlers;

        $model.find('button').click((e) => {
            e.preventDefault();
        });
        $model.find('.SBSE-button-reveal').on('click.reveal', (e) => {
            handlers.reveal(e);
        });
        $model.find('.SBSE-button-retrieve').on('click.retrieve', (e) => {
            handlers.retrieve(e);
        });
        $model.find('.SBSE-button-activate').on('click.activate', (e) => {
            handlers.activate(e);
        });
        $model.find('.SBSE-button-copy').on('click.copy', (e) => {
            handlers.copy(e);
        });
        $model.find('.SBSE-button-reset').on('click.reset', (e) => {
            handlers.reset(e);
        });
        $model.find('.SBSE-dropdown__list-export').on('click.export', (e) => {
            handlers.export(e);
        });
        $model.find('.SBSE-button-setting').on('click.setting', settings.display);
        $model.find('.SBSE-checkbox').on('change', (e) => {
            const key = e.currentTarget.dataset.config;

            if (key.length > 0) config.set(key, e.currentTarget.checked);
        });

        // apply settings
        if (config.get('SBSE_ChkTitle')) $model.find('.SBSE-checkbox-title').prop('checked', true);
        if (config.get('SBSE_ChkJoin')) $model.find('.SBSE-checkbox-join').prop('checked', true);

        this.model = $model;
    },
};
const ASF = {
    model: null,
    terminal: {},
    getModel() {
        return this.model instanceof $ ? this.model : $();
    },
    scrollToBottom(key) {
        const terminal = this.terminal[key];

        if (terminal instanceof $) terminal.scrollTop(terminal[0].scrollHeight);
    },
    push(key, line) {
        this.terminal[key].append(`<span class="SBSE-terminal__message">${line}</span>`);
        this.scrollToBottom(key);
    },
    listenLogs() {
        const self = this;

        self.push('log', 'Establishing connection to ASF IPC server');

        const domain = `${config.get('ASFIPCServer')}:${config.get('ASFIPCPort')}`;
        const password = config.get('ASFIPCPassword');
        const protocol = config.get('ASFIPCProtocol');
        const url = `${protocol === 'https' ? 'wss' : 'ws'}://${domain}/Api/NLog${password.length > 0 ? `?password=${password}` : ''}`;

        try {
            const ws = new WebSocket(url);

            ws.addEventListener('open', () => {
                self.push('log', 'Connection established');
            });
            ws.addEventListener('error', () => {
                self.push('log', 'An error occured while connecting to ASF IPC server');
            });
            ws.addEventListener('message', (e) => {
                try {
                    const data = JSON.parse(e.data);

                    self.push('log', data.Result);
                } catch (error) {
                    self.push('log', error.stack);
                }
            });
        } catch (error) {
            self.push('log', `Failed to establish connection, error message: ${error.message}`);
        }
    },
    initCommands: async () => {
        const ipc = {
            protocol: config.get('ASFIPCProtocol'),
            server: config.get('ASFIPCServer'),
            port: config.get('ASFIPCPort'),
            password: config.get('ASFIPCPassword'),
            commands: {},
            bots: [],
        };
        const self = ASF;
        const requestOptions = (method, pathname) => {
            const options = { method };

            options.url = `${ipc.protocol}://${ipc.server}:${ipc.port + pathname}`;
            if (ipc.password.length > 0) options.headers = { Authentication: ipc.password };

            return options;
        };
        const sendCommand = async (command) => {
            self.push('commands', command);

            const res = await request(requestOptions('POST', `/Api/Command/${encodeURIComponent(command)}`));

            try {
                const data = JSON.parse(res.response);
                const msg = data.Success === true ? data.Result : data.Message;

                self.push('commands', msg);
            } catch (error) {
                self.push('commands', error.stack);
            }
        };

        // append terminal input
        const $input = $(`
            <span class="SBSE-terminal__input">
                <input type="text">
                <input type="text">
            </span>
        `).appendTo(self.terminal.commands).find('input:first-child');
        const $hint = $input.next('input');

        // bind event
        // display hint on input
        $input.on('input', () => {
            let newHint = '';
            let saved = $hint.attr('data-saved');
            const typed = $input.val().replace(/\s+/g, ' ');

            if (typed.length > 0) {
                const typedPieces = typed.split(' ');

                // perform a new search for command
                if (!saved || saved.length === 0 || saved.indexOf(typedPieces[0]) === -1) {
                    saved = Object.keys(ipc.commands).find(x => x.indexOf(typedPieces[0]) === 0) || '';
                }

                const command = ipc.commands[saved];

                // found matching command
                if (isArray(command) && command.length > 0) {
                    const hintPieces = command.slice(0);

                    // skip 1st piece as no need to process the command
                    for (let i = 1; i < typedPieces.length; i += 1) {
                        if (typedPieces[i].length > 0) {
                            let newHintPiece = command[i];

                            // replace command argument if typed something
                            if (typedPieces[i].length > 0) newHintPiece = typedPieces[i];

                            // match bot name
                            if (command[i] === '<Bots>' || command[i] === '<TargetBot>') {
                                const found = ipc.bots.find(x => x.indexOf(typedPieces[i]) === 0);

                                if (found) newHintPiece = found;
                            }

                            // multiple arguments for last typed piece
                            if (i === typedPieces.length - 1 &&
                                newHintPiece.includes(',') &&
                                (command[i] === '<Bots>' ||
                                command[i] === '<GameIDs>' ||
                                command[i] === '<SteamIDs64>' ||
                                command[i] === '<AppIDs>' ||
                                command[i] === '<RealAppIDs>' ||
                                command[i] === '<AppIDsOrGameNames>' ||
                                command[i] === '<AppIDs,GameName>' ||
                                command[i] === '<Keys>' ||
                                command[i] === '<Modes>')) {
                                if (newHintPiece.slice(-1) === ',') {
                                    newHintPiece += command[i];
                                } else if (command[i] === '<Bots>') {
                                    const pieces = newHintPiece.split(',');
                                    const last = pieces.length - 1;
                                    const found = ipc.bots.find(x => x.indexOf(pieces[last]) === 0);

                                    if (found) {
                                        pieces[last] = found;
                                        newHintPiece = pieces.join(',');
                                    }
                                }
                            }

                            hintPieces[i] = newHintPiece;
                        }
                    }

                    newHint = hintPieces.filter(x => x.length > 0).join(' ');
                }
            } else saved = '';

            $hint.attr('data-saved', saved);
            $hint.val(newHint);
            $input.val(typed);
        });

        // detect key board event
        $input.on('keydown', (e) => {
            // right arrow key, auto complete hint
            if (e.keyCode === 39 && $hint.val().length > $input.val().length) {
                const bracket = $hint.val().indexOf('<');
                const text = bracket > -1 ? $hint.val().slice(0, bracket) : $hint.val();

                $input.val(text);
            }

            // enter key, send command
            if (e.keyCode === 13) {
                sendCommand($input.val());
                $input.val('');
                $hint.val('');
            }
        });

        // prevent the hint input getting focus
        $hint.on('focus', () => {
            $input.focus();
        });

        // focus input field when click empty space
        self.terminal.commands.parent().on('click', (e) => {
            if ($(e.target).is('.SBSE-terminal-commands')) $input.focus();
        });

        self.push('commands', 'Fetching commands from ASF wiki');

        // fetch commands
        const resCommands = await request({
            method: 'GET',
            url: 'https://github.com/JustArchiNET/ArchiSteamFarm/wiki/Commands',
        });

        if (resCommands.status === 200) {
            const html = resCommands.response.slice(resCommands.response.indexOf('<div id="wiki-body"'), resCommands.response.indexOf('<div id="wiki-rightbar"'));
            const $html = $(html);
            const commands = $html.find('h2:has(#user-content-commands-1) + table tbody tr td:first-child code').get().map(ele => ele.innerText.trim());

            commands.forEach((command) => {
                const pieces = command.split(' ');

                ipc.commands[pieces[0]] = pieces;
            });

            self.push('commands', 'Commands successfully fetched');
        } else self.push('commands', 'Failed to fetch commands from ASF wiki, please refrsh to try again');

        // fetch bots
        const resBots = await request(requestOptions('GET', '/api/bot/ASF'));

        if (resBots.status === 200) {
            try {
                const data = JSON.parse(resBots.response);

                ipc.bots = Object.keys(data.Result);
            } catch (e) {
                throw e;
            }
        }
    },
    init() {
        // construct SBSE model
        const $model = $('<div class="SBSE-container__content__model" data-feature="ASF"></div>');

        $model.append(`
            <div class="SBSE-terminal SBSE-terminal-commands"><div></div></div>
            <div class="SBSE-terminal SBSE-terminal-log SBSE-terminal--show"><div></div></div>
            <div>
                <button class="SBSE-button SBSE-button-commands">${i18n.get('buttonCommands')}</button>
                <button class="SBSE-button SBSE-button-log">${i18n.get('buttonLog')}</button>
                <button class="SBSE-button-setting"> </button>
            </div>
        `);

        $model.find('.SBSE-button-commands').on('click.commands', () => {
            $model.find('.SBSE-terminal--show').removeClass('SBSE-terminal--show');
            $model.find('.SBSE-terminal-commands').addClass('SBSE-terminal--show');
            $model.find('.SBSE-terminal__input input:first-child').focus();
        });
        $model.find('.SBSE-button-log').on('click.log', () => {
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
    },
};
const container = {
    self: null,
    models: {},
    get(feature, handlers) {
        this.show(feature);
        if (isObject(handlers)) {
            if (feature === 'SBSE') SBSE.setHandlers(handlers);
            if (feature === 'ASF') ASF.setHandlers(handlers);
        }

        return this.self;
    },
    show(feature) {
        // nav
        this.self.find('.SBSE-container__nav__item--show').removeClass('SBSE-container__nav__item--show');
        this.self.find(`.SBSE-container__nav__item[data-feature="${feature}"]`).addClass('SBSE-container__nav__item--show');

        // content
        this.self.find('.SBSE-container__content__model--show').removeClass('SBSE-container__content__model--show');
        this.self.find(`.SBSE-container__content__model[data-feature="${feature}"]`).addClass('SBSE-container__content__model--show');
    },
    init() {
        this.self = $('<div class="SBSE-container"></div>');

        const $nav = $('<div class="SBSE-container__nav"></div>').appendTo(this.self);
        const $content = $('<div class="SBSE-container__content"></div>').appendTo(this.self);

        // construct nav
        $nav.append(`
            <ul>
                <li class="SBSE-container__nav__item" data-feature="SBSE"><span>Steam Ext</span></li>
                <li class="SBSE-container__nav__item" data-feature="ASF"><span>ASF IPC</span></li>
            </ul>
        `);

        // bind event
        $nav.find('.SBSE-container__nav__item').on('click', (e) => {
            const $target = $(e.delegateTarget);

            if (!$target.hasClass('SBSE-container__nav__item--show')) {
                container.show($target.attr('data-feature'));
            }
        });

        // append models to content block
        this.models.SBSE = SBSE.getModel();
        this.models.ASF = ASF.getModel();

        $content.append(Object.values(this.models));
    },
};

const steamCNTooltip = {
    timeoutID: 0,
    load(data) {
        if (config.get('enableTooltips')) {
            const $container = $('<div/>');

            (Array.isArray(data) ? data : [data]).forEach((d) => {
                let type = null;

                if (has.call(d, 'sub')) type = 'sub';
                if (has.call(d, 'app')) type = 'app';
                if (type !== null) {
                    const url = `https://steamdb.steamcn.com/tooltip?v=4#${type}/${d[type]}#steam_info_${type}_${d[type]}_1`;

                    $container.append(
                        $(`<iframe id="SBSE-tooltip_${type + d[type]}" class="SBSE-tooltip" data-url="${url}"></iframe>`)
                            .mouseenter(() => {
                                clearTimeout(this.timeoutID);
                            })
                            .mouseout(this.hide),
                    );
                }
            });

            $('body').append($container);
        }
    },
    show(e) {
        const $target = $(e.currentTarget);
        const json = $target.closest('.SBSE-item--processed').attr('data-gameinfo');

        if (json.length > 0 && config.get('enableTooltips')) {
            const data = JSON.parse(json);
            const opened = !!$('.SBSE-tooltip--show').length;

            ['app', 'sub'].forEach((type) => {
                const $tooltip = $(`#SBSE-tooltip_${type + data[type]}`);

                if ($tooltip.length > 0 && !opened) {
                    // load tooltip
                    if (!$tooltip.attr('src')) $tooltip.attr('src', $tooltip.attr('data-url'));

                    $tooltip.css({
                        top: e.clientY,
                        left: e.clientX + 10,
                    }).addClass('SBSE-tooltip--show');
                    this.reposition($tooltip, $tooltip.height());
                    $tooltip[0].contentWindow.postMessage('show', '*'); // get height

                    $target.one('mouseout', () => {
                        this.timeoutID = setTimeout(this.hide.bind(steamCNTooltip), 500);
                    });
                }
            });
        }
    },
    hide() {
        const $tooltip = $('.SBSE-tooltip--show');

        if ($tooltip.length > 0) {
            $tooltip.removeClass('SBSE-tooltip--show');
            $tooltip[0].contentWindow.postMessage('hide', '*');
        }
    },
    reposition($tooltip, height) {
        const $window = $(window);
        const $document = $(document);
        const offsetTop = $tooltip.offset().top - $document.scrollTop();
        const offsetLeft = $tooltip.offset().left - $document.scrollLeft();
        const overflowX = (offsetLeft + $tooltip.width()) - ($window.width() - 20);
        const overflowY = (offsetTop + height) - ($window.height() - 20);

        if (overflowY > 0) $tooltip.css('top', offsetTop - overflowY);
        if (overflowX > 0) $tooltip.css('left', offsetLeft - overflowX);
    },
    listen() {
        window.addEventListener('message', (e) => {
            if (e.origin === 'https://steamdb.steamcn.com' && e.data.height && e.data.src) {
                const $tooltip = $(`.SBSE-tooltip[src="${e.data.src}"]`);

                $tooltip.height(e.data.height);
                this.reposition($tooltip, e.data.height);
            }
        });
    },
};
const siteHandlers = {
    indiegala() {
        // inject css
        GM_addStyle(`
            .SBSE-container { margin-top: 10px; }
            .SBSE-container__nav__item--show {
                border-bottom: 1px solid #CC001D;
                color: #CC001D;
            }
            .SBSE-container__content__model > textarea { border: 1px solid #CC001D; border-radius: 3px; }
            .SBSE-button { width: 100px; background-color: #CC001D; color: white; border-radius: 3px; }
            .swal2-popup .SBSE-switch__slider { margin: 0; }
            .SBSE-icon { vertical-align: middle; }
        `);

        const handlers = {
            extract() {
                const source = location.pathname === '/profile' ? 'div[id*="_sale_"].collapse.in' : document;
                const bundleTitle = $('[aria-expanded="true"] > div#bundle-title, #bundle-title, #indie_gala_2 > div > span').eq(0).text().trim();
                const data = {
                    title: bundleTitle,
                    filename: `IndieGala ${bundleTitle} Keys`,
                    items: [],
                };

                $(source).find('.game-key-string').each((i, ele) => {
                    const $ele = $(ele);
                    const key = $ele.find('.keys').val();

                    if (key) {
                        const d = JSON.parse($(ele).closest('.SBSE-item--processed').attr('data-gameinfo') || '{}');

                        if (Object.keys(d).length === 0) {
                            const $a = $ele.find('.title_game > a');
                            const matched = $a.attr('href').match(/steam.+\/(app|sub)\/(\d+)/);

                            d.title = $a.text().trim();
                            if (matched) d[matched[1]] = parseInt(matched[2], 10);
                        }

                        d.key = key;

                        activator.pushKeyDetails(d);
                        data.items.push(d);
                    }
                });

                return data;
            },
            reveal(e) {
                const source = location.pathname === '/profile' ? 'div[id*="_sale_"].collapse.in' : document;
                const $revealBtn = $(e.currentTarget);
                const selected = $('.SBSE-select-filter').val() || 'All';
                const handler = ($games, callback) => {
                    const game = $games.shift();

                    if (game) {
                        const $game = $(game);
                        const code = $game.attr('id').split('_').pop();
                        const id = $game.attr('onclick').match(/steampowered\.com\/(app|sub)\/(\d+)/)[2];
                        const d = JSON.parse($game.closest('.SBSE-item--processed').attr('data-gameinfo') || '{}');

                        if (selected === 'All' || (selected === 'Owned' && d.owned) || (selected === 'NotOwned' && !d.owned)) {
                            $.ajax({
                                method: 'GET',
                                url: '/myserials/syncget',
                                dataType: 'json',
                                data: {
                                    code,
                                    cache: false,
                                    productId: id,
                                },
                                beforeSend() {
                                    $(`#permbutton_${code}, #fetchlink_${code}, #info_key_${code}`).hide();
                                    $(`#fetching_${code}`).fadeIn();
                                    $(`#ajax_loader_${code}`).show();
                                    $(`#container_activate_${code}`).html('');
                                },
                                success(data) {
                                    $(`#ajax_loader_${code}, #fetching_${code}, #info_key_${code}`).hide();
                                    $(`#serial_${code}`).fadeIn();
                                    $(`#serial_n_${code}`).val(data.serial_number);
                                    $game.parent().prev().find('.btn-convert-to-trade').remove();

                                    handler($games, callback);
                                },
                                error() {
                                    swal(i18n.get('failTitle'), i18n.get('failDetailUnexpected'), 'error');
                                },
                            });
                        } else handler($games, callback);
                    } else callback();
                };

                $revealBtn.addClass('SBSE-button--working');

                handler($(source).find('a[id^=fetchlink_]'), () => {
                    $revealBtn.removeClass('SBSE-button--working');
                    $('.SBSE-button-retrieve').click();
                });
            },
        };
        const process = () => {
            const tooltipsData = [];

            $('.game-key-string').each((i, ele) => {
                const $ele = $(ele);
                const $a = $ele.find('.title_game > a');
                const d = {
                    title: $a.text().trim(),
                };

                const matched = $a.attr('href').match(/steam.+\/(app|sub)\/(\d+)/);
                if (matched) d[matched[1]] = parseInt(matched[2], 10);

                // check if owned & wished
                d.owned = steam.isOwned(d);
                d.wished = steam.isWished(d);

                if (d.owned) $ele.addClass('SBSE-item--owned');
                if (d.wished) $ele.addClass('SBSE-item--wished');

                // append icon
                $a.after(
                    $('<span class="SBSE-icon"></span>').mouseenter(steamCNTooltip.show.bind(steamCNTooltip)),
                );

                tooltipsData.push(d);

                $ele.attr('data-gameinfo', JSON.stringify(d)).addClass('SBSE-item--processed SBSE-item--steam');
            });

            // load SteamCN tooltip
            steamCNTooltip.load(tooltipsData);
        };
        const $container = container.get('SBSE', handlers);

        process();

        // insert container
        $('#library-contain').eq(0).before($container);

        // support for new password protected gift page
        const $node = $('#gift-contents');

        if ($node.length > 0) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    Array.from(mutation.addedNodes).forEach((addedNode) => {
                        if (addedNode.id === 'library-contain') {
                            process();
                            $node.prepend($container);
                            observer.disconnect();
                        }
                    });
                });
            });

            observer.observe($node[0], { childList: true });
        }
    },
    fanatical() {
        // inject css
        GM_addStyle(`
            .SBSE-container { margin-top: 10px; }
            .SBSE-container__nav { background-color: rgb(28, 28, 28); }
            .SBSE-container__nav__item--show {
                border-bottom: 1px solid #ff9800;
                color: #ff9800;
            }
            .SBSE-container__content { margin: 0; }
            .SBSE-container__content__model > textarea { background-color: #434343; color: #eee; }
            .SBSE-container__content__model label { color: #DEDEDE; }
            .SBSE-button, .SBSE-select { border: 1px solid transparent; background-color: #1c1c1c; color: #eee; }
            .SBSE-button:hover, .SBSE-select:hover { color: #A8A8A8; }
            .SBSE-button--narrow { width: 80px; }

            /* currency converter */
            .SBSE-priceExt { positon: relative; }
            .SBSE-priceExt ~ .SBSE-priceExt { display: none; }
            .SBSE-priceExt--portrait { width: 100%; padding: 0 .875rem 0 .875rem; }
            .SBSE-priceExt--portrait > div { padding: 1rem; }
            .SBSE-priceExt--portrait .SBSE-priceExt__currencyToggler {
                width: 100%; height: 40px;
                margin-bottom: 10px;
                font-size: 20px;
                border-radius: 3px;
            }
            .SBSE-priceExt--landscape { padding: 1rem; }
            .SBSE-priceExt--landscape > div { display: flex; align-items: center; justify-content: space-evenly; }
            .SBSE-priceExt--landscape .SBSE-priceExt__currencyToggler {
                width: 300px; height: 40px;
                font-size: 20px;
                border-radius: 3px;
            }
            .SBSE-priceExt__pricingDetail { background-color: transparent; }
            .SBSE-priceExt__pricingDetail th { padding-top: 10px; }
            .SBSE-priceExt__pricingDetail .cheapest { border-bottom: 1px solid #ff9800; font-weight: bold; }
            .SBSE-priceExt__pricingDetail .currency-flag { vertical-align: text-bottom; }
            .swal2-popup table { background-color: white; }
            .SBSE-icon { vertical-align: bottom; }
        `);

        const fetchAPIData = async (s, c) => {
            let slug = s;
            let callback = c;
            if (typeof s === 'function') {
                callback = s;
                slug = location.href.split('/').pop();
            }

            let JSONString = GM_getValue(`Fanatical-${slug}`, '');

            if (JSONString.length === 0) {
                const res = await fetch(`https://www.fanatical.com/api/products/${slug}`);

                if (res.ok) {
                    JSONString = await res.text();

                    GM_setValue(`Fanatical-${slug}`, JSONString);
                } else JSONString = '{}';
            }

            if (typeof callback === 'function') callback(JSON.parse(JSONString));
        };
        const productHandler = async (APIData) => {
            if (Object.keys(APIData).length > 0) {
                const language = config.get('language');
                const $priceExt = $(`
                    <div class="SBSE-priceExt SBSE-priceExt--portrait">
                        <div>
                            <select class="SBSE-priceExt__currencyToggler"></select>
                        </div>
                    </div>
                `);
                const $currencyToggler = $priceExt.find('.SBSE-priceExt__currencyToggler');
                const $pricingDetail = $('<table class="SBSE-priceExt__pricingDetail"></table>');
                const selectedCurrency = GM_getValue('SBSE_selectedCurrency', 'USD');
                const isStarDeal = !!$('.stardeal-purchase-info').length;
                let starDeal = {};

                if (isStarDeal) {
                    // fetch star-deal data
                    const res = await fetch('https://www.fanatical.com/api/star-deal');

                    if (res.ok) starDeal = await res.json();
                }

                // change orientation
                if (isStarDeal || $('.background-bundle, .bundle-header.container-fluid').length > 0) {
                    $priceExt.toggleClass('SBSE-priceExt--portrait SBSE-priceExt--landscape container');
                }

                Object.keys(xe.currencies).forEach((currency) => {
                    const selected = currency === selectedCurrency ? ' selected' : '';

                    $currencyToggler.append(
                        $(`<option value="${currency}"${selected}>${xe.currencies[currency][language]}</option>`),
                    );
                });

                $currencyToggler.change(() => {
                    xe.update($currencyToggler.val());
                });

                // bundle page
                APIData.bundles.forEach((tier, index) => {
                    const $detail = $pricingDetail.clone();

                    if (APIData.bundles.length > 1) $detail.append(`<tr><th colspan="3">Tier ${index + 1}</th></tr>`);
                    Object.keys(tier.price).sort().forEach((currency) => {
                        const value = tier.price[currency];
                        const symbol = xe.currencies[currency].symbol;
                        const decimalPlace = xe.currencies[currency].decimal ? 2 : 0;

                        $detail.append(`
                            <tr class="tier${index + 1}">
                                <td><div class="currency-flag currency-flag-${currency.toLowerCase()}"></div></td>
                                <td>${symbol + (value / 100).toFixed(decimalPlace)}</td>
                                <td> ≈ <span class="SBSE-price" data-currency="${currency}" data-value="${value}"></span></td>
                            </tr>
                        `);
                    });

                    $detail.appendTo($currencyToggler.parent());
                });

                // game page
                if (location.href.includes('/game/') || location.href.includes('/dlc/')) {
                    let discount = 1;

                    if (has.call(APIData, 'current_discount') &&
                        new Date(APIData.current_discount.until).getTime() > Date.now()
                    ) discount = 1 - APIData.current_discount.percent;

                    if (isStarDeal) discount = 1 - ($('.discount-percent').text().replace(/\D/g, '') / 100);

                    Object.keys(APIData.price).sort().forEach((currency) => {
                        let value = Math.trunc(APIData.price[currency] * discount);
                        const symbol = xe.currencies[currency].symbol;
                        const decimalPlace = xe.currencies[currency].decimal ? 2 : 0;

                        // if star-deal data loaded successfully
                        if (has.call(starDeal, 'promoPrice')) value = starDeal.promoPrice[currency];

                        $pricingDetail.append(`
                            <tr class="tier1">
                                <td><div class="currency-flag currency-flag-${currency.toLowerCase()}"></div></td>
                                <td>${symbol + (value / 100).toFixed(decimalPlace)}</td>
                                <td> ≈ <span class="SBSE-price" data-currency="${currency}" data-value="${value}"></span></td>
                            </tr>
                        `).appendTo($currencyToggler.parent());
                    });
                }

                $('.product-commerce-container').append($priceExt);
                $('.stardeal-purchase-info, .bundle-header').filter(':visible').eq(0).after($priceExt);
                xe.update(selectedCurrency);

                // highlight the cheapest
                for (let i = 1; i < 10; i += 1) {
                    const $prices = $(`.tier${i} .SBSE-price`);

                    if ($prices.length === 0) break;

                    $($prices.toArray().sort((a, b) => a.textContent.replace(/\D/g, '') - b.textContent.replace(/\D/g, '')).shift()).closest('tr').addClass('cheapest');
                }
            }
        };
        const handlers = {
            extract() {
                const bundleTitle = $('h5').eq(0).text().trim();
                const data = {
                    title: bundleTitle,
                    filename: `Fanatical ${bundleTitle} Keys`,
                    items: [],
                };

                $('.account-content .order-item').each((i, orderItem) => {
                    const $orderItem = $(orderItem);
                    const key = $orderItem.find('input[type="text"]').val();

                    if (key) {
                        const d = JSON.parse($orderItem.closest('.SBSE-item--processed').attr('data-gameinfo') || '{}');

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
            reveal(e) {
                const $revealBtn = $(e.currentTarget);
                const selected = $('.SBSE-select-filter').val() || 'All';
                const handler = ($games, callback) => {
                    const game = $games.shift();

                    if (game) {
                        const d = JSON.parse($(game).closest('.SBSE-item--processed').attr('data-gameinfo') || '{}');

                        if (selected === 'All' || (selected === 'Owned' && d.owned) || (selected === 'NotOwned' && !d.owned)) {
                            game.click();
                            setTimeout(handler.bind(null, $games, callback), 300);
                        } else setTimeout(handler.bind(null, $games, callback), 1);
                    } else setTimeout(callback, 500);
                };

                $revealBtn.addClass('SBSE-button--working');

                handler($('.account-content .key-container button'), () => {
                    $revealBtn.removeClass('SBSE-button--working');
                    $('.SBSE-button-retrieve').click();
                });
            },
        };
        const process = ($node) => {
            // empty textarea
            SBSE.getModel().find('textarea').val('');

            // retrieve title
            $('.account-content h5').each((i, h5) => {
                const title = h5.textContent.trim();
                const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');

                fetchAPIData(slug, (APIData) => {
                    if (Object.keys(APIData).length > 0) {
                        const tooltipsData = [];
                        const matchGame = (data) => {
                            if (has.call(data, 'steam') && data.steam.id) {
                                const $gameTitle = $node.find(`.order-item .game-name:contains(${data.name})`).filter((index, name) => data.name === name.textContent.trim());
                                const $orderItem = $gameTitle.closest('.order-item');
                                const d = {
                                    title: data.name,
                                    app: parseInt(data.steam.id, 10),
                                };

                                d.owned = steam.isOwned(d);
                                d.wished = steam.isWished(d);

                                // check if owned & wished
                                if (d.owned) $orderItem.addClass('SBSE-item--owned');
                                if (d.wished) $orderItem.addClass('SBSE-item--wished');

                                // append Steam store link
                                $gameTitle.append(
                                    `<span> | </span><a class="SBSE-link-steam_store" href="https://store.steampowered.com/app/${d.app}/" target="_blank">${i18n.get('steamStore')}</a>`,
                                    $('<span class="SBSE-icon"></span>').mouseenter(steamCNTooltip.show.bind(steamCNTooltip)),
                                );

                                tooltipsData.push(d);

                                $orderItem.addClass('SBSE-item--processed SBSE-item--steam').attr('data-gameinfo', JSON.stringify(d));
                            }
                        };

                        matchGame(APIData);
                        APIData.bundles.forEach((tier) => {
                            tier.games.forEach(matchGame);
                        });

                        // load SteamCN tooltip
                        steamCNTooltip.load(tooltipsData);
                    }
                });
            });
        };
        const $container = container.get('SBSE', handlers);

        $container.find('.SBSE-button').addClass('SBSE-button--narrow'); // narrow buttons
        $container.find('a').attr('href', ''); // dodge from master css selector

        new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                Array.from(mutation.addedNodes).filter(x => x.nodeType === 1).forEach((node) => {
                    const $node = $(node);
                    const currentURL = location.href;

                    // url changed
                    if (node.matches('[property="og:url"]')) {
                        if (currentURL.includes('/bundle/') ||
                            currentURL.includes('/game/') ||
                            currentURL.includes('/dlc/')
                        ) fetchAPIData(productHandler);
                    }

                    // order contents loaded
                    if ($node.is('.order-item') || $node.children('div.order-bundle-items-container, div.order-item').length > 0) {
                        if (currentURL.includes('/orders/')) {
                            // insert container
                            const $anchor = $('.account-content h3');

                            if ($('.SBSE_container').length === 0 && $anchor.length > 0) $anchor.eq(0).before($container);
                        }

                        process($node);
                    }
                });
            });
        }).observe($('html')[0], {
            childList: true,
            subtree: true,
        });
    },
    humblebundle() {
        // inject css
        GM_addStyle(`
            .SBSE-container__content__model > div { position: relative; }
            .SBSE-container__content__model > textarea {
                border: 1px solid #CFCFCF;
                border-radius: 5px;
                color: #4a4c45;
                text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
            }
            .SBSE-button {
                width: 70px;
                border: 1px solid #C9CCD3;
                border-radius: 3px;
                background-color: #C5C5C5;
                background: linear-gradient(to top, #cacaca, #e7e7e7);
                color: #4a4c45 !important;
            }
            .SBSE-button:hover {
                border: 1px solid #b7bac0;
                background-color: #fafcff;
                color: #555961 !important;
            }
            .SBSE-button--narrow.SBSE-button--working { width: 76px; padding-right: 36px; }
            .SBSE-button-setting { position: absolute; right: 0; }
            .SBSE-item--owned .sr-unredeemed-steam-button {
                background-color: #F3F3F3;
                background: linear-gradient(to top, #E8E8E8, #F6F6F6);
            }/*
            .SBSE-item--owned .heading-text h4 > span:not(.steam-owned):last-child::after {
                content: '\\f085';
                font-family: hb-icons;
                color: #17A1E5;
            }*/
            .SBSE-span-activationRestrictions { float: right; margin-right: 5px; cursor: pointer; }
            .swal2-icon-text { font-size: inherit; }
            .flag-icon { width: 4em; height: 3em; border-radius: 3px; }
            .flag-icon-unknown { border: 1px solid; text-align: center; line-height: 3em; }
            .key-redeemer h4 { position: relative; }
            .key-redeemer .SBSE-icon { position: absolute; top: 50%; margin-top: -10px; }
        `);

        let gamekey;
        const atDownload = location.pathname === '/downloads';
        const fetchKey = async ($node, machineName, callback) => {
            if (gamekey) {
                const res = await fetch('https://www.humblebundle.com/humbler/redeemkey', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        Origin: 'https://www.humblebundle.com',
                        Referer: location.href,
                    },
                    body: `keytype=${machineName}&key=${gamekey}&keyindex=0`,
                    credentials: 'same-origin',
                });

                if (res.ok) {
                    const d = await res.json();

                    if (d.success) {
                        $node.closest('.container').html(`
                            <div title="${d.key}" class="keyfield redeemed">
                                <div class="keyfield-value">${d.key}</div>
                                <a class="steam-redeem-button" href="https://store.steampowered.com/account/registerkey?key=${d.key}" target="_blank">
                                    <div class="steam-redeem-text">Redeem</div>
                                    <span class="tooltiptext">Redeem on Steam</span>
                                </a>
                                <div class="spinner"></div>
                            </div>
                        `);
                    } else swal(i18n.get('failTitle'), JSON.stringify(d), 'error');
                } else $node.click();

                if (typeof callback === 'function') callback();
            } else $node.click();
        };
        const handlers = {
            extract() {
                const bundleTitle = $('title').text().split(' (').shift();
                const data = {
                    title: bundleTitle,
                    filename: `Humble Bundle ${bundleTitle} Keys`,
                    items: [],
                };

                $('.keyfield.redeemed .keyfield-value').each((i, ele) => {
                    const $ele = $(ele);
                    const key = $ele.text().trim();

                    if (key) {
                        const d = JSON.parse($ele.closest('.SBSE-item--processed').attr('data-gameinfo') || '{}');

                        if (Object.keys(d).length === 0) {
                            const $titleEle = $ele.closest(atDownload ? '.container' : '.redeemer-cell').prev().find('h4');

                            d.title = $titleEle.contents().eq(0).text().trim();
                        }

                        d.key = key;

                        activator.pushKeyDetails(d);
                        data.items.push(d);
                    }
                });

                return data;
            },
            reveal(e) {
                const $revealBtn = $(e.currentTarget);
                const selected = $('.SBSE-select-filter').val() || 'All';
                const handler = ($games, callback) => {
                    const game = $games.shift();

                    if (game) {
                        const $game = $(game);
                        const machineName = $game.closest('.key-redeemer').attr('data-machineName');
                        const d = JSON.parse($(game).closest('.SBSE-item--processed').attr('data-gameinfo') || '{}');

                        if (atDownload && machineName) {
                            if (selected === 'All' || (selected === 'Owned' && d.owned) || (selected === 'NotOwned' && !d.owned)) {
                                fetchKey($game, machineName, () => {
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

                handler($('.key-redeemer.SBSE-item--steam .keyfield:not(.redeemed)'), () => {
                    $revealBtn.removeClass('SBSE-button--working');
                    $('.SBSE-button-retrieve').click();
                });
            },
        };
        const process = async ($node) => {
            gamekey = new URLSearchParams(location.search).get('key');
            let json = GM_getValue(gamekey, '');

            if (json.length === 0) {
                const res = await fetch(`https://www.humblebundle.com/api/v1/order/${gamekey}?all_tpkds=true`, {
                    method: 'GET',
                    credentials: 'same-origin',
                });

                if (res.ok) json = await res.text();
            }

            try {
                const data = JSON.parse(json);
                const tooltipsData = [];

                data.tpkd_dict.all_tpks.forEach((game) => {
                    const $keyRedeemer = $node.find(`.key-redeemer:has(.heading-text[data-title="${game.human_name.replace(/"/g, '\\"')}"])`);

                    if ($keyRedeemer.length > 0) {
                        if (game.key_type === 'steam') {
                            $keyRedeemer.addClass('SBSE-item--steam');

                            const d = {
                                title: game.human_name,
                                app: parseInt(game.steam_app_id, 10),
                                sub: parseInt(game.steam_package_id, 10),
                            };

                            d.owned = steam.isOwned(d);
                            d.wished = steam.isWished(d);

                            // apply owned effect on game title
                            if (d.owned) $keyRedeemer.addClass('SBSE-item--owned');
                            if (d.wished) $keyRedeemer.addClass('SBSE-item--wished');

                            // store data
                            $keyRedeemer.attr({
                                'data-machineName': game.machine_name,
                                'data-humanName': game.human_name,
                                'data-gameinfo': JSON.stringify(d),
                            });

                            // append Steam store link
                            const $target = $keyRedeemer.find('h4 > span').eq(0);

                            if (d.app > 0) {
                                $target.after(`<span> | </span><a class="SBSE-link-steam_store" href="https://store.steampowered.com/app/${d.app}/" target="_blank">${i18n.get('steamStore')}</a>`);
                            }
                            if (d.sub > 0) {
                                $target.after(`<span> | </span><a class="SBSE-link-steam_db" href="https://steamdb.info/sub/${d.sub}/" target="_blank">Steam DB</a>`);
                            }

                            tooltipsData.push(d);
                        }

                        // activation restrictions
                        let html = '';
                        const disallowed = game.disallowed_countries.map(c => ISO2.get(c));
                        const exclusive = game.exclusive_countries.map(c => ISO2.get(c));
                        const separator = config.get('language').includes('chinese') ? '、' : ', ';

                        if (disallowed.length > 0) html += `<p>${i18n.get('HBDisallowedCountries')}<br>${disallowed.join(separator)}</p>`;
                        if (exclusive.length > 0) html += `<p>${i18n.get('HBExclusiveCountries')}<br>${exclusive.join(separator)}</p>`;
                        if (disallowed.length > 0 || exclusive.length > 0) {
                            $(`<span class="SBSE-span-activationRestrictions">${i18n.get('HBActivationRestrictions')}</span>`).click(() => {
                                swal({
                                    title: `${game.human_name}<br>${i18n.get('HBActivationRestrictions')}`,
                                    html,
                                    type: 'info',
                                });
                            }).insertBefore($keyRedeemer.find('.heading-text > h4'));
                        }

                        $keyRedeemer.addClass('SBSE-item--processed');
                    }
                });

                // override default popups
                document.addEventListener('click', (e) => {
                    const $target = $(e.target).closest('.keyfield:not(.redeemed, .redeemed-gift)');
                    const $keyRedeemer = $target.closest('.key-redeemer.SBSE-item--steam');
                    const machineName = $keyRedeemer.attr('data-machineName');

                    if ($target.length > 0 && $keyRedeemer.length > 0 && machineName) {
                        e.stopPropagation();

                        if ($keyRedeemer.hasClass('SBSE-item--owned')) {
                            swal({
                                title: i18n.get('HBAlreadyOwned'),
                                text: i18n.get('HBRedeemAlreadyOwned').replace('%title%', $keyRedeemer.attr('data-humanName')),
                                type: 'question',
                                showCancelButton: true,
                            }).then((result) => {
                                if (result.value) fetchKey($target, machineName);
                            });
                        } else fetchKey($target, machineName);
                    }
                }, true);

                // load SteamCN tooltip
                steamCNTooltip.load(tooltipsData);
            } catch (e) {
                throw e;
            }
        };
        const $container = container.get('SBSE', handlers);
        const $keyManager = $('.js-key-manager-holder');

        // narrow buttons
        $container.find('.SBSE-button').addClass('SBSE-button--narrow');

        // at home page
        if ($keyManager.length > 0) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    Array.from(mutation.addedNodes).forEach((addedNode) => {
                        if (addedNode.className === 'header') {
                            observer.disconnect();
                            $(addedNode).after($container);
                        }
                    });
                });
            });

            observer.observe($keyManager[0], { childList: true });
        // at download page
        } else {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    Array.from(mutation.addedNodes).forEach(async (addedNode) => {
                        const $node = $(addedNode);

                        if ($node.hasClass('key-list') || $node.find('.key-list').length > 0) {
                            observer.disconnect();
                            $node.closest('.whitebox-redux').before($container);

                            // fetch game heading & wrap heading
                            $node.find('.heading-text > h4').each((i, heading) => {
                                heading.parentElement.dataset.title = heading.innerText.trim();
                                $(heading.firstChild).wrap('<span/>');
                                $(heading).append(
                                    $('<span class="SBSE-icon"></span>').mouseenter(steamCNTooltip.show.bind(steamCNTooltip)),
                                );
                            });

                            // fetch & process key data
                            process($node);
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        }

        // append user's region
        const countryCode = unsafeWindow.models.request.country_code;

        if (countryCode) {
            const code = countryCode.toLowerCase();
            const countryName = ISO2.get(countryCode);
            const $flag = $(`<span class="flag-icon flag-icon-unknown" tooltip="${i18n.get('HBCurrentLocation')}?"></span>`);

            if (GM_getResourceText('flagIcon').includes(`${code}.svg`)) {
                $flag.toggleClass(`flag-icon-unknown flag-icon-${code}`).attr('tooltip', i18n.get('HBCurrentLocation') + countryName);
            } else $flag.text('?');

            $('.navbar-content').prepend($flag);
        }
    },
    dailyindiegame() {
        const MPHideList = JSON.parse(GM_getValue('SBSE_DIGMPHideList') || '[]');
        const pathname = location.pathname;

        if (pathname.includes('/account_page') || pathname.includes('/account_update')) {
            // force sync library
            steam.sync([{ key: 'library' }]);

            // update DIG balance
            const balanceText = $('a[href*="transactionhistory.html"]').eq(0).closest('div').text().match(/\$\d+\.\d+/);
            const balance = balanceText ? parseInt(balanceText[0].replace(/\D/g, ''), 10) : '';

            if (!isNaN(balance)) GM_setValue('SBSE_DIGBalance', balance);

            // inject css
            GM_addStyle(`
                .SBSE-container { padding: 5px; border: 1px solid #424242; }
                .SBSE-container__nav__item--show {
                    border-bottom: 1px solid #FD5E0F;
                    color: #FD5E0F;
                }
                .SBSE-container__content__model > textarea { border: 1px solid #000; }
                .SBSE-button {
                    border: none;
                    background-color: #FD5E0F;
                    color: rgb(49, 49, 49);
                    font-family: Ropa Sans;
                    font-size: 15px;
                    font-weight: 600;
                }
            `);

            const handlers = {
                extract() {
                    const data = {
                        title: 'DailyIndieGame Keys',
                        filename: 'DailyIndieGame Keys',
                        items: [],
                    };

                    $('#TableKeys tr').each((i, tr) => {
                        const $tds = $(tr).children();
                        const key = $tds.eq(4).text().trim();

                        if (key.includes('-')) {
                            const d = {
                                title: $tds.eq(2).text().trim(),
                                key,
                                marketListing: $tds.eq(6).text().includes('Cancel trade'),
                            };

                            activator.pushKeyDetails(d);
                            data.items.push(d);
                        }
                    });

                    return data;
                },
                reveal() {
                    const $form = $('#form3');

                    $('#quickaction').val(1);
                    $.ajax({
                        method: 'POST',
                        url: $form.attr('action'),
                        data: $form.serializeArray(),
                        success() {
                            location.reload();
                        },
                    });
                },
            };
            const $container = container.get('SBSE', handlers);

            $container.find('.SBSE-button-export, .SBSE-select-filter').remove();
            $container.find('label:has(.SBSE-checkbox-join)').after(`
                <label><input type="checkbox" class="SBSE-checkbox-marketListings">${i18n.get('checkboxMarketListings')}</label>
            `); // append checkbox for market keys

            $('#TableKeys').eq(0).before($container);

            // rate all positive
            const $awaitRatings = $('a[href^="account_page_0_ratepositive"]');

            if ($awaitRatings.length > 0) {
                $('#TableKeys td:contains(Rate TRADE)').text(i18n.get('DIGRateAllPositive')).css('cursor', 'pointer').click(() => {
                    $awaitRatings.each(async (i, a) => {
                        const res = await fetch(a.href, {
                            method: 'GET',
                            credentials: 'same-origin',
                        });

                        if (res.ok) $(a).parent('td').html('<span class="DIG3_14_Orange">Positive</span>');
                    });
                });
            }
        // DIG Menu
        } else if (pathname.includes('/account_digstore') ||
                   pathname.includes('/account_trades') ||
                   pathname.includes('/account_tradesXT') ||
                   pathname.includes('/store_update') ||
                   pathname.includes('/storeXT_update') ||
                   pathname.includes('/site_content_marketplace')) {
            // inject css styles
            GM_addStyle(`
                body.hideOwned .SBSE-item--owned,
                body.hideOwned .SBSE-item--owned + .DIGMenu-searchResults { display: none; }
                .headerRow > td:first-child { padding-left: 0; }
                .headerRow > td:last-child { padding-right: 0; }
                .DIGMenu > * { margin-right: 10px; padding: 4px 8px !important; cursor: pointer; }
                .DIG-row { height: 30px; }
                .DIGMenu button { padding: 4px 8px; outline: none; cursor: pointer; }
                .DIG-row--checked { background-color: #222; }
                .DIGMenu-searchResults td { padding: 0 }
                .DIGMenu-searchResults iframe {
                    width: 100%; height: 300px;
                    display: none;
                    background-color: white;
                    border: none;
                }
                .SBSE-item--owned .DIG3_14_Gray { color: #9ccc65; }
                .SBSE-item--wished .DIG3_14_Gray { color: #29b6f6; }
                .SBSE-item--ignored .DIG3_14_Gray { text-decoration: line-through; }
                .DIG2content select { max-width: 200px; }
                #DIGSelectAll { display: none; }
                #DIGSelectAll + span { display: inline-block; }
                #DIGSelectAll ~ span:last-child { display: none; }
                #DIGSelectAll:checked + span { display: none; }
                #DIGSelectAll:checked ~ span:last-child { display: inline-block; }
                .showOwnedListings { color: #FD5E0F; }
                .showOwnedListings > label { vertical-align: text-bottom; }
                .showOwnedListings input:checked + .SBSE-switch__slider { background-color: #FD5E0F; }
                .DIGBalanceDetails > span { margin-right: 20px; }
                .DIG__edit_balance {
                    display: inline-block;
                    position: relative;
                    transform: rotate(45deg);
                    cursor: pointer;
                }
                .DIG__edit_balance > span {
                    display: inline-block;
                }
                .DIG__edit_balance .tip {
                    width: 0; height: 0;
                    position: absolute;
                    top: 13px;
                    border-left: 2px solid transparent;
                    border-right: 2px solid transparent;
                    border-top: 3px solid #999;
                }
                .DIG__edit_balance .body {
                    width: 4px; height: 12px;
                    background-color: #999;
                }
                .DIG__edit_balance .rubber {
                    width: 4px; height: 2px;
                    position: absolute;
                    top: -3px;
                    background-color: #999;
                    top: -3px;
                }
            `);

            swal.showLoading();

            // append menu buttons
            const $target = $('#form3').closest('tr').children().eq(0);
            const $DIGMenu = $(`
                <div class="DIGMenu">
                    <label class="DIGSelectAll DIG3_Orange_15_Form">
                        <input type="checkbox" id="DIGSelectAll">
                        <span>${i18n.get('DIGMenuSelectAll')}</span>
                        <span>${i18n.get('DIGMenuSelectCancel')}</span>
                    </label>
                    <span class="DIGButtonPurchase DIG3_Orange_15_Form">${i18n.get('DIGMenuPurchase')}</span>
                    <label class="showOwnedListings">
                        <label class="SBSE-switch SBSE-switch--small">
                            <input type="checkbox" id="showOwnedListings" checked>
                            <span class="SBSE-switch__slider"></span>
                        </label>
                        <span>${i18n.get('owned')}</span>
                    </label>
                </div>
            `);

            if ($target.children().length > 0) {
                const $tr = $('<tr/>');

                $tr.append($target.clone());
                $target.parent().before($tr);
            }

            $target.empty().append($DIGMenu);
            $target.parent().addClass('headerRow');

            // bind button event
            $('.DIGButtonPurchase').click(() => {
                let balance = GM_getValue('SBSE_DIGBalance');
                const $games = $('.DIG-row--checked:visible');

                swal({
                    title: i18n.get('DIGButtonPurchasing'),
                    html: '<p></p>',
                    onOpen: () => {
                        swal.showLoading();
                    },
                });

                (async function purchaseHandler() {
                    const game = $games.shift();

                    if (game) {
                        const $game = $(game);
                        const id = $game.attr('data-id');
                        const price = parseInt($game.attr('data-price'), 10);
                        const title = $game.attr('data-title');

                        if (title.length > 0) swal.getContent().querySelector('p').textContent = title;

                        if (id && price > 0) {
                            if (balance - price >= 0) {
                                let url = `${location.origin}/account_buy.html`;
                                const requestInit = {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                    body: `quantity=1&xgameid=${id}&xgameprice1=${price}&send=Purchase`,
                                    mode: 'same-origin',
                                    credentials: 'same-origin',
                                    cache: 'no-store',
                                    referrer: `${location.origin}/account_buy_${id}.html`,
                                };

                                if (pathname === '/account_trades.html' || pathname === '/account_tradesXT.html' || pathname === '/site_content_marketplace.html') {
                                    url = `${location.origin}/account_buytrade_${id}.html`;
                                    requestInit.body = `gameid=${id}&send=Purchase`;
                                    requestInit.referrer = url;
                                }

                                const res = await fetch(url, requestInit);

                                if (res.ok) {
                                    $game.click();
                                    balance -= price;

                                    $('.DIG__current_balance').attr('data-value', balance);
                                }

                                purchaseHandler();
                            } else {
                                swal({
                                    title: i18n.get('failTitle'),
                                    text: i18n.get('DIGInsufficientFund'),
                                    type: 'error',
                                });
                            }
                        } else purchaseHandler();
                    } else {
                        GM_setValue('SBSE_DIGBalance', balance);
                        swal({
                            title: i18n.get('successTitle'),
                            text: i18n.get('DIGFinishedPurchasing'),
                            type: 'success',
                        });
                    }
                }());
            });
            $('#DIGSelectAll').on('change', (e) => {
                const checked = e.delegateTarget.checked;
                let total = 0;

                $('.DIG-row:visible').toggleClass('DIG-row--checked', checked);

                if (checked) {
                    total = $('.DIG-row--checked:visible').map((i, row) => parseInt(row.dataset.price, 10)).get().reduce((a, b) => a + b);
                }

                $('.DIG_total_amount').attr('data-value', total);
            });
            $('#showOwnedListings').on('change', (e) => {
                const showOwnedListings = e.delegateTarget.checked;
                const $rows = $('.DIG-row--checked.SBSE-item--owned');

                $('body').toggleClass('hideOwned', !showOwnedListings);
                GM_setValue('DIGShowOwnedListings', showOwnedListings);

                if (!showOwnedListings && $rows.length > 0) {
                    const total = $rows.map((i, row) => parseInt(row.dataset.price, 10)).get().reduce((a, b) => a + b);

                    $rows.removeClass('DIG-row--checked');
                    $('.DIG_total_amount').attr('data-value', (i, value) => parseInt(value, 10) - total);
                }
            });

            // menu settings
            $('#showOwnedListings').prop('checked', GM_getValue('DIGShowOwnedListings', true)).change();

            // append sync time and event
            const seconds = Math.round((Date.now() - steam.lastSync('library')) / 1000);

            $target.closest('table').before(`
                <span> ${i18n.get('lastSyncTime').replace('%seconds%', seconds)}</span>
            `);

            // append balance details
            $target.closest('table').before(`
                <div class="DIGBalanceDetails">
                    <span>${i18n.get('DIGCurrentBalance')}$<span class="DIG__current_balance" data-value="0">0.00</span></span>
                    <span class="DIG__edit_balance">
                        <span class="tip"></span>
                        <span class="body"></span>
                        <span class="rubber"></span>
                    </span>
                    <span>${i18n.get('DIGTotalAmount')}$<span class="DIG_total_amount" data-value="0">0.00</span></span>
                </div>
            `);

            // bind balance details event
            $('.DIGBalanceDetails span[data-value]').each((i, span) => {
                new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.attributeName === 'data-value') {
                            const target = mutation.target;

                            target.textContent = (target.dataset.value / 100).toFixed(2);
                        }
                    });
                }).observe(span, { attributes: true });
            });

            $('.DIG__edit_balance').on('click', () => {
                swal({
                    title: i18n.get('DIGEditBalance'),
                    input: 'number',
                    inputPlaceholder: i18n.get('DIGPoint'),
                    inputAttributes: { min: 1 },
                    showCancelButton: true,
                }).then((result) => {
                    if (!isNaN(result.value)) {
                        const balance = Math.trunc(result.value);

                        GM_setValue('SBSE_DIGBalance', balance);
                        $('.DIG__current_balance').attr('data-value', balance);
                    }
                });
            });

            // bind row event
            const $totalAmount = $('.DIG_total_amount');
            const getPrice = ($tr) => {
                let p = 0;
                const $DIGPoints = $tr.find('td:contains( DIG Points)');

                if ($DIGPoints.length === 1) p = $DIGPoints.text();
                else {
                    const tds = $tr.children('td').get();

                    for (let j = tds.length - 1; j >= 0; j -= 1) {
                        const t = tds[j].textContent.trim();

                        if (t.startsWith('$')) {
                            p = t.replace(/\D/g, '');
                            break;
                        }
                    }
                }

                return parseInt(p, 10);
            };

            $('a[href^="account_buy"]').eachAsync((ele) => {
                const $ele = $(ele);
                const $tr = $ele.closest('tr');
                const $title = $tr.children('td').eq(pathname.includes('/account_digstore') ? 3 : 1);

                const id = $ele.attr('href').replace(/\D/g, '');
                const title = $title.text().trim();
                const price = getPrice($tr);
                const onclickHandler = $tr.attr('onclick');

                // setup row data & event
                $tr.attr({
                    'data-id': id,
                    'data-title': title,
                    'data-price': price,
                });
                $tr.addClass('DIG-row').on('click', () => {
                    $tr.toggleClass('DIG-row--checked');
                    $totalAmount.attr('data-value', (index, value) => parseInt(value, 10) + (price * ($tr.hasClass('DIG-row--checked') ? 1 : -1)));
                });

                // re-locate onclick handler
                if (pathname.includes('/site_content_marketplace') && onclickHandler) {
                    $title.wrapInner(
                        $('<span></span>').attr('onclick', onclickHandler),
                    );
                    $tr.removeAttr('onclick');
                }

                // check if owned
                const $a = $tr.find('a[href*="steampowered"]');
                const d = {};
                let steamID = 0;

                if ($a.length === 1) {
                    const data = $a[0].pathname.slice(1).split('/');

                    steamID = parseInt(data[1], 10);
                    d[data[0]] = steamID;
                } else if (onclickHandler.includes('site_gamelisting_')) {
                    steamID = parseInt(onclickHandler.match(/_(\d+)\./)[1], 10);
                    d.app = steamID;
                }

                if (steam.isOwned(d)) $tr.addClass('SBSE-item--owned');
                if (steam.isWished(d)) $tr.addClass('SBSE-item--wished');
                if (steam.isIgnored(d)) $tr.addClass('SBSE-item--ignored');

                // no appID found, pre-load Google search result
                if (steamID === -1 && !MPHideList.includes(id)) {
                    const $game = $a.find('span');
                    const gameTitle = encodeURIComponent($game.text().trim()).replace(/%20/g, '+');
                    const map = {
                        '&': '&amp;',
                        '<': '&lt;',
                        '>': '&gt;',
                        '"': '&quot;',
                        "'": '&#039;',
                    };

                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://www.google.com/search?q=steam+${gameTitle}`,
                        onload: (res) => {
                            let html = res.responseText;

                            // inset style
                            const index = html.indexOf('</head>');
                            const style = `
                                <style>
                                    body { overflow-x: hidden; }
                                    .sfbgx, #sfcnt, #searchform, #top_nav, #appbar, #taw { display: none; }
                                    #center_col { margin-left: 0 !important; }
                                </style>
                            `;
                            html = html.slice(0, index) + style + html.slice(index);

                            // stripe script tags
                            html = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');

                            // manipulate urls
                            html = html
                                .replace(/\/images\//g, 'https://www.google.com/images/')
                                .replace(/\/url\?/g, 'https://www.google.com/url?');

                            $tr.after(`
                                <tr class="DIGMenu-searchResults">
                                    <td colspan="11"><iframe sandbox="allow-scripts" srcdoc='${html.replace(/[&<>"']/g, m => map[m])}'></frame></td>
                                </tr>
                            `);
                        },
                    });

                    $game.unwrap('a').css({
                        cursor: 'pointer',
                        color: 'red',
                    }).click((e) => {
                        e.stopPropagation();

                        $tr.next('.DIGMenu-searchResults').find('iframe')
                            .slideToggle('fast');
                    });
                }

                // remove row if manually hid
                if (MPHideList.includes(id)) $tr.remove();
                else {
                    // append manual hide feature
                    $tr.children().eq(0).attr('title', i18n.get('DIGClickToHideThisRow')).click((e) => {
                        e.stopPropagation();

                        if (id > 0) {
                            MPHideList.push(id);
                            GM_setValue('SBSE_DIGMPHideList', JSON.stringify(MPHideList));

                            $tr.remove();
                        }
                    });
                }
            }, () => {
                swal({
                    titleText: i18n.get('successTitle'),
                    text: i18n.get('loadingSuccess'),
                    type: 'success',
                    timer: 3000,
                });
            });

            // setup current balance
            $('.DIG__current_balance').attr('data-value', GM_getValue('SBSE_DIGBalance', 0));
        // extension for creating trade at market place
        } else if (pathname === '/site_content_giveaways.html') {
            swal.showLoading();

            // inject css styles
            GM_addStyle(`
                body.hideOwned .SBSE-item--owned { display: none; }
                .DIGMenu > * { margin-right: 10px; padding: 4px 0 !important; cursor: pointer; }
                .DIG-row { height: 30px; }
                .SBSE-item--owned .DIG4-Orange-14 { color: #9ccc65; }
                .SBSE-item--wished .DIG4-Orange-14 { color: #29b6f6; }
                .SBSE-item--ignored .DIG4-Orange-14 { text-decoration: line-through; }
                .showOwnedListings { display: inline-block; color: #FD5E0F; }
                .showOwnedListings > label { vertical-align: text-bottom; }
                .showOwnedListings input:checked + .SBSE-switch__slider { background-color: #FD5E0F; }
            `);

            // append menu buttons
            const $target = $('a[href^="site_content_giveaways_"]').eq(0).closest('table#DIG2TableGray');
            const $DIGMenu = $(`
                <div class="DIGMenu">
                    <label class="showOwnedListings">
                        <label class="SBSE-switch SBSE-switch--small">
                            <input type="checkbox" id="showOwnedListings" checked>
                            <span class="SBSE-switch__slider"></span>
                        </label>
                        <span>${i18n.get('owned')}</span>
                    </label>
                </div>
            `);

            $target.before($DIGMenu);

            // bind button event
            $('.DIGButtonPurchase').click(() => {
                let balance = GM_getValue('SBSE_DIGBalance');
                const $games = $('.DIG-row--checked:visible');

                swal({
                    title: i18n.get('DIGButtonPurchasing'),
                    html: '<p></p>',
                    onOpen: () => {
                        swal.showLoading();
                    },
                });

                (async function purchaseHandler() {
                    const game = $games.shift();

                    if (game) {
                        const $game = $(game);
                        const id = $game.attr('data-id');
                        const price = parseInt($game.attr('data-price'), 10);
                        const title = $game.attr('data-title');

                        if (title.length > 0) swal.getContent().querySelector('p').textContent = title;

                        if (id && price > 0) {
                            if (balance - price >= 0) {
                                let url = `${location.origin}/account_buy.html`;
                                const requestInit = {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                    body: `quantity=1&xgameid=${id}&xgameprice1=${price}&send=Purchase`,
                                    mode: 'same-origin',
                                    credentials: 'same-origin',
                                    cache: 'no-store',
                                    referrer: `${location.origin}/account_buy_${id}.html`,
                                };

                                if (pathname === '/account_trades.html' || pathname === '/account_tradesXT.html' || pathname === '/site_content_marketplace.html') {
                                    url = `${location.origin}/account_buytrade_${id}.html`;
                                    requestInit.body = `gameid=${id}&send=Purchase`;
                                    requestInit.referrer = url;
                                }

                                const res = await fetch(url, requestInit);

                                if (res.ok) {
                                    $game.click();
                                    balance -= price;

                                    $('.DIG__current_balance').attr('data-value', balance);
                                }

                                purchaseHandler();
                            } else {
                                swal({
                                    title: i18n.get('failTitle'),
                                    text: i18n.get('DIGInsufficientFund'),
                                    type: 'error',
                                });
                            }
                        } else purchaseHandler();
                    } else {
                        GM_setValue('SBSE_DIGBalance', balance);
                        swal({
                            title: i18n.get('successTitle'),
                            text: i18n.get('DIGFinishedPurchasing'),
                            type: 'success',
                        });
                    }
                }());
            });
            $('#showOwnedListings').on('change', (e) => {
                const showOwnedListings = e.delegateTarget.checked;

                $('body').toggleClass('hideOwned', !showOwnedListings);
                GM_setValue('DIGShowOwnedListings', showOwnedListings);
            });

            // menu settings
            $('#showOwnedListings').prop('checked', GM_getValue('DIGShowOwnedListings', true)).change();

            // append sync time and event
            const seconds = Math.round((Date.now() - steam.lastSync('library')) / 1000);

            $DIGMenu.prepend(`
                <span class="DIG4-Gray-13"> ${i18n.get('lastSyncTime').replace('%seconds%', seconds)}</span>
            `);

            $('a[href^="site_gamelisting_"]').eachAsync((ele) => {
                const $ele = $(ele);
                const $tr = $ele.closest('tr');
                const $title = $tr.children('td').eq(1);

                const id = $ele.attr('href').replace(/\D/g, '');
                const title = $title.text().trim();

                // setup row data & event
                $tr.addClass('DIG-row').attr({
                    'data-id': id,
                    'data-title': title,
                });

                // check if owned
                const d = { app: parseInt(id, 10) };

                if (steam.isOwned(d)) $tr.addClass('SBSE-item--owned');
                if (steam.isWished(d)) $tr.addClass('SBSE-item--wished');
                if (steam.isIgnored(d)) $tr.addClass('SBSE-item--ignored');
            }, () => {
                swal({
                    titleText: i18n.get('successTitle'),
                    text: i18n.get('loadingSuccess'),
                    type: 'success',
                    timer: 3000,
                });
            });
        } else if (pathname === '/account_createtrade.html') {
            const $form = $('#form_createtrade');

            // create trade page
            if ($form.length > 0) {
                // trim input field
                const $gameTitle = $form.find('input[name="typeahead"]');
                const $steamKey = $form.find('input[name="STEAMkey"]');

                $gameTitle.blur(() => {
                    unsafeWindow.jQuery('input.typeahead').typeahead('setQuery', $gameTitle.val().trim());
                });
                $steamKey.blur((e) => {
                    const $self = $(e.delegateTarget);
                    const key = $self.val().match(regKey);

                    if (key) $self.val(key[0]);
                });
                $steamKey.attr({
                    size: 50,
                    maxlength: 200,
                });

                // search for current market price when click dropdown menu
                const $searchResult = $('<div/>');

                $gameTitle.closest('table').after($searchResult);
                $searchResult.before(`<h3>${i18n.get('DIGMarketSearchResult')}</h3>`);

                $('.tt-dropdown-menu').click(async () => {
                    $searchResult.empty();

                    const res = await fetch(`${location.origin}/account_tradesXT.html`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: `search=${encodeURIComponent($gameTitle.val()).replace(/%20/g, '+')}&button=SEARCH`,
                        credentials: 'same-origin',
                    });
                    const result = res.ok ? $(await res.text()).find('#TableKeys') : 'Network response was not ok.';

                    $searchResult.append(result);
                });

                // apply last input price
                const lastPrice = GM_getValue('SBSE_DIGLastPrice', 20);
                const $priceField = $('input[name=price]');

                $priceField.val(lastPrice).trigger('input');
                $('#form_createtrade').submit(() => {
                    const price = parseInt($priceField.val(), 10);

                    if (price !== lastPrice) GM_setValue('SBSE_DIGLastPrice', price);
                });
            // result page
            } else {
                GM_addStyle(`
                    .check.icon {
                        width: 42px; height: 24px;
                        margin: 12px 0 5px 9px;
                        border-bottom: solid 3px currentColor;
                        border-left: solid 3px currentColor;
                        transform: rotate(-45deg);
                        color: #5cb85c;
                    }
                    .remove.icon { color: #d9534f; margin-left: 9px; margin-top: 30px; }
                    .remove.icon:before, .remove.icon:after {
                        width: 45px; height: 3px;
                        position: absolute;
                        content: '';
                        background-color: currentColor;
                        transform: rotate(45deg);
                    }
                    .remove.icon:after { transform: rotate(-45deg); }
                `);

                const $anchor = $('td.DIG3_14_Gray > table:first-child');
                const IsSucceed = !!$('td.DIG3_14_Gray:contains("The game key has been added to the DIG MarketPlace.")').length;

                if (IsSucceed) $anchor.after('<div class="check icon"></div>');
                else $anchor.after('<div class="remove icon"></div>');
            }
        }
    },
    ccyyshop() {
        // inject css
        GM_addStyle(`
            .cta .cta-inner:before { z-index: 10; }
            .SBSE-container {
                width: 80%;
                position: relative;
                margin: 0 auto;
                font-size: 16px;
                color: #000;
                z-index: 999;
            }
            .SBSE-container__content__model > textarea {
                background-color: #EEE;
                box-shadow: 0 0 1px 1px rgba(204,204,204,0.5);
                border-radius: 5px;
            }
            .SBSE-container__content__model > div { text-align: left; }
            .SBSE-button {
                width: 80px;
                border: 1px solid #2e6da4;
                border-radius: 5px;
                background-color: #337ab7;
                color: #FFF;
            }
            .SBSE-container label { color: #EEE; }
            .expanded .showOrderMeta {
                display: block !important;
                position: absolute;
                margin-top: -8px;
                right: 265px;
                z-index: 1;
            }
        `);

        const handlers = {
            extract() {
                const data = {
                    title: 'CCYYCN Bundle',
                    filename: 'CCYYCN Bundle',
                    items: [],
                };

                $('.deliver-gkey > *:contains(-)').each((i, ele) => {
                    const $ele = $(ele);
                    const d = {
                        title: $ele.closest('.deliver-game').prev().text().trim(),
                        key: $ele.text().trim(),
                    };

                    activator.pushKeyDetails(d);
                    data.items.push(d);
                });

                return data;
            },
            reveal(e) {
                const $revealBtn = $(e.currentTarget);
                const handler = ($games, callback) => {
                    const game = $games.shift();

                    if (game) {
                        game.click();
                        setTimeout(handler.bind(null, $games, callback), 300);
                    } else callback();
                };

                $revealBtn.addClass('SBSE-button--working');

                handler($('.deliver-btn'), () => {
                    $revealBtn.removeClass('SBSE-button--working');
                    $('.SBSE-button-retrieve').click();
                });
            },
        };
        const $container = container.get('SBSE', handlers);

        $container.find('.SBSE-select-filter').remove(); // hide filter selector
        $container.find('.SBSE-button').addClass('SBSE-button--narrow'); // narrow buttons

        // insert textarea
        $('.featurette-divider').eq(0).after($container);
    },
    groupees() {
        if (location.pathname.startsWith('/profile/')) {
            // inject css
            GM_addStyle(`
                .SBSE-container__content__model > textarea, .SBSE-button {
                    background: transparent;
                    border: 1px solid #8cc53f;
                    border-radius: 3px;
                    color: #8cc53f;
                    transition: all 0.8s ease;
                }
                .SBSE-button:hover {
                    background-color: #8cc53f;
                    color: white;
                    text-decoration: none;
                }
                img.product-cover { display: none; }
            `);
            const handlers = {
                extract() {
                    const bundleTitle = $('h2').text().trim();
                    const data = {
                        title: bundleTitle,
                        filename: `Groupees ${bundleTitle} Keys`,
                        items: [],
                    };

                    $('.key-block input.code').each((i, ele) => {
                        const $ele = $(ele);
                        const key = $ele.val();

                        if (key.includes('-')) {
                            const $titleEle = $ele.closest('tr').prev().find('td:nth-of-type(3)');
                            const d = {
                                title: $titleEle.text().trim(),
                                key,
                                used: !!$ele.closest('.key-block').find('.key-status:contains(used)').length,
                            };

                            activator.pushKeyDetails(d);
                            data.items.push(d);
                        }
                    });

                    return data;
                },
                reveal(e) {
                    const $revealBtn = $(e.currentTarget);
                    const handler = ($games, callback) => {
                        const game = $games.shift();

                        if (game) {
                            game.click();
                            setTimeout(handler.bind(null, $games, callback), 300);
                        } else callback();
                    };

                    $revealBtn.addClass('SBSE-button--working');

                    const $reveals = $('.product:has(img[title*=Steam]) .reveal-product');
                    const timer = $reveals.length > 0 ? 1500 : 0;

                    $reveals.click();
                    setTimeout(() => {
                        handler($('.btn-reveal-key'), () => {
                            $revealBtn.removeClass('SBSE-button--working');
                            $('.SBSE-button-retrieve').click();
                        });
                    }, timer);
                },
            };
            const $container = container.get('SBSE', handlers);

            $container.find('.SBSE-select-filter').hide(); // hide filter selector

            // append checkbox for used-key
            $('.SBSE-button-setting').before(`
                <label><input type="checkbox" class="SBSE-checkbox-skipUsed" checked>${i18n.get('checkboxSkipUsed')}</label>
            `);

            // insert container
            $('.table-products').before($container);

            // load details
            $('img[src*="steam.svg"]').each(async (index, ele) => {
                $.ajax({
                    url: $(ele).closest('tr').find('.item-link').attr('href'),
                    data: { v: 1 },
                    dataType: 'script',
                });
            });

            // bind custom event
            $(document).on('activated', (e, key, result) => {
                if (result.success === 1) $(`.btn-steam-redeem[href*=${key}]`).next('.key-usage-toggler').click();
            });
        } else {
            // inject css
            GM_addStyle(`
                .SBSE-container { margin-bottom: 20px; }
                .SBSE-container__content__model > textarea { background-color: #EEE; border-radius: 3px; }
                .SBSE-button { outline: none !important; }
                .SBSE-button-setting { margin-top: 8px; }
            `);

            const handlers = {
                extract() {
                    const bundleTitle = $('.expanded .caption').text().trim();
                    const data = {
                        title: bundleTitle,
                        filename: `Groupees ${bundleTitle} Keys`,
                        items: [],
                    };

                    $('.expanded .code').each((i, ele) => {
                        const $ele = $(ele);
                        const d = {
                            title: $ele.closest('.details').find('h3').text().trim(),
                            key: $ele.val(),
                            used: $ele.closest('li').find('.usage').prop('checked'),
                        };

                        activator.pushKeyDetails(d);
                        data.items.push(d);
                    });

                    return data;
                },
                reveal(e) {
                    const $revealBtn = $(e.currentTarget);
                    const handler = ($games, callback) => {
                        const game = $games.shift();

                        if (game) {
                            game.click();
                            setTimeout(handler.bind(null, $games, callback), 300);
                        } else callback();
                    };

                    $revealBtn.addClass('SBSE-button--working');

                    const $reveals = $('.product:has(img[title*=Steam]) .reveal-product');
                    const timer = $reveals.length > 0 ? 1500 : 0;

                    $reveals.click();
                    setTimeout(() => {
                        handler($('.expanded .reveal'), () => {
                            $revealBtn.removeClass('SBSE-button--working');
                            $('.SBSE-button-retrieve').click();
                        });
                    }, timer);
                },
            };
            const $container = container.get('SBSE', handlers);

            // append checkbox for used-key
            $container.find('.SBSE-button-setting').before($(`
                <label><input type="checkbox" class="SBSE-checkbox-skipUsed" checked>${i18n.get('checkboxSkipUsed')}</label>
            `));
            // add buttons style via groupees's class
            $container.find('.SBSE-button').addClass('btn btn-default');

            // insert container
            $('.container > div').eq(1).before($container);

            // append mark all as used button
            new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    Array.from(mutation.addedNodes).forEach((addedNode) => {
                        const $orderMeta = $(addedNode).find('.order-meta');

                        if ($orderMeta.length > 0) {
                            $orderMeta.after(
                                $(`<button class="btn btn-default" style="margin-right: 10px;"><b>${i18n.get('markAllAsUsed')}</b></button>`).click(() => {
                                    $('.expanded .usage').each((i, checkbox) => {
                                        if (!checkbox.checked) checkbox.click();
                                    });
                                }),
                            );
                            $orderMeta.parent().addClass('showOrderMeta');
                        }
                    });
                });
            }).observe($('#profile_content')[0], { childList: true });

            // bind custom event
            $(document).on('activated', (e, key, result) => {
                if (result.success === 1) $(`li.key:has(input[value=${key}]) .usage`).click();
            });
        }
    },
    agiso() {
        const keys = unique($('body').text().match(regKey));

        if (keys.length > 0) {
            // inject css
            GM_addStyle(`
                .SBSE-container__content__model > textarea { border: 1px solid #AAAAAA; }
                .SBSE-button {
                    border: 1px solid #d3d3d3;
                    background: #e6e6e6 url(images/ui-bg_glass_75_e6e6e6_1x400.png) 50% 50% repeat-x;
                    color: #555555;
                }
                .SBSE-button:hover {
                    border-color: #999999;
                    background: #dadada url(images/ui-bg_glass_75_dadada_1x400.png) 50% 50% repeat-x;
                    color: #212121;
                }
            `);

            const handlers = {
                extract() {
                    const bundleTitle = $('a[href*="tradeSnap.htm"]').eq(1).text().trim();
                    const data = {
                        title: bundleTitle,
                        filename: `agiso ${bundleTitle} Keys`,
                        items: [],
                    };

                    keys.forEach((key) => {
                        data.items.push({ key });
                    });

                    return data;
                },
            };
            const $container = container.get('SBSE', handlers);

            $container.find('.SBSE-button-reveal, .SBSE-select-filter').remove();

            // insert container
            $('#tabs').eq(0).prepend($container);
        }
    },
    steamcn() {
        if (location.pathname.startsWith('/tooltip')) {
            GM_addStyle('body { overflow: hidden; }');
        }
    },
    yuplay() {
        // inject css
        GM_addStyle(`
            .SBSE-container { margin-top: 20px; }
            .SBSE-container__content__model > textarea { background-color: rgb(230, 230, 229); color: rgb(27, 26, 26); }
            .SBSE-container__content__model > div { text-align: left; }
            .SBSE-button {
                width: 80px;
                border: 1px solid #b4de0a;
                background-color: #b4de0a;
                color: #1a1a1a;
            }
            .SBSE-button:hover {
                border: 1px solid #a4ca09;
                background-color: #a4ca09;
            }
            .SBSE-container label { color: #1a1a1a; font-weight: 400; }
            .SBSE-table-appList { margin-bottom: 10px; }
            .SBSE-table-appList td { vertical-align: top; }
            .SBSE-table-appList a { display: block; margin-bottom: 5px; }
            .SBSE-icon { position: relative; top: 5px; }
        `);

        const handlers = {
            extract() {
                const data = {
                    title: 'Yuplay Games',
                    filename: 'Yuplay Games',
                    items: [],
                };

                $('.product-info').each((i, ele) => {
                    const $ele = $(ele);
                    const d = {
                        title: $ele.find('.name').text().trim(),
                        key: $ele.next('.keys').find('input').val(),
                    };

                    activator.pushKeyDetails(d);
                    data.items.push(d);
                });

                return data;
            },
        };
        const appListHandler = (data) => {
            if (data.length > 0) {
                const $appList = $('<table class="SBSE-table-appList"></table>');

                $appList.append('<tr><td colspan="2">App List</td></tr>');

                data.forEach((d) => {
                    const $row = $('<tr/>');

                    $row.append(
                        $('<td/>').append($('<span class="SBSE-icon"></span>').mouseenter(steamCNTooltip.show.bind(steamCNTooltip))),
                        $(`<td><a href="https://store.steampowered.com/app/${d.app}" target="_blank">${d.title}</a></td>`),
                    );

                    d.owned = steam.isOwned(d);
                    d.wished = steam.isWished(d);

                    if (d.owned) $row.addClass('SBSE-item--owned');
                    if (d.wished) $row.addClass('SBSE-item--wished');

                    $row.addClass('SBSE-item--processed SBSE-item--steam').attr('data-gameinfo', JSON.stringify(d));

                    $appList.append($row);
                });

                $('.list-character').after($appList);

                // load SteamCN tooltip
                steamCNTooltip.load(data);
            }
        };
        const $container = container.get('SBSE', handlers);

        $container.find('.SBSE-button').addClass('SBSE-button--narrow'); // narrow buttons
        $container.find('.SBSE-button-reveal, .SBSE-select-filter').remove(); // remove reveal

        // insert textarea
        $('.table-light').eq(0).before($container);

        // append info from SteamDB if found subid
        $('.list-character p').each((i, ele) => {
            const $ele = $(ele);
            const text = $ele.text().trim();

            if (text.startsWith('Steam')) {
                const subID = text.match(/\d+/)[0];
                const steamDBUrl = `https://steamdb.info/sub/${subID}/`;
                const steamDBKey = `SBSE_steamDB_sub_${subID}`;
                const steamDBData = GM_getValue(steamDBKey, '');

                $ele.find('span').replaceWith(`<a href="${steamDBUrl}" target="_blank">${subID}</a>`);

                if (steamDBData.length === 0) {
                    GM_xmlhttpRequest({
                        url: steamDBUrl,
                        method: 'GET',
                        onload(res) {
                            if (res.status === 200) {
                                const data = [];

                                $(res.response).find('#apps .app').each((j, app) => {
                                    const $app = $(app);
                                    const d = {
                                        title: $app.children('td').eq(2).text().trim(),
                                        app: parseInt($app.attr('data-appid'), 10),
                                    };

                                    data.push(d);
                                });

                                GM_setValue(steamDBKey, JSON.stringify(data));
                                appListHandler(data);
                            }
                        },
                    });
                } else appListHandler(JSON.parse(steamDBData));
            }
        });
    },
    'gama-gama': () => {
        // inject css
        GM_addStyle(`
            .SBSE-container__content__model > textarea { background-color: #ededed; color: #33; border-radius: 4px; }
            .SBSE-button {
                width: 80px; height: 35px;
                border: none; border-radius: 4px;
                background: linear-gradient(to bottom, #47bceb 0, #18a4dd 30%, #127ba6 100%);
                color: #fff;
                box-shadow: 0 1px 3px 1px rgba(0,0,0,.8);
            }
            .SBSE-button { font-family: inherit; font-size: inherit; }
            .SBSE-button:hover { background: linear-gradient(to bottom, #47bceb, #18a4dd); }
        `);

        const handlers = {
            extract() {
                const data = {
                    title: 'Gama Gama Games',
                    filename: 'Gama Gama Games',
                    items: [],
                };

                $('.gift-line').each((i, ele) => {
                    const $ele = $(ele);

                    $ele.find('.key-list > li').each((j, key) => {
                        const d = {
                            title: $ele.find('.gift-header').text().trim(),
                            key: key.textContent.trim(),
                        };

                        activator.pushKeyDetails(d);
                        data.items.push(d);
                    });
                });

                return data;
            },
        };
        const $container = container.get('SBSE', handlers);

        $container.find('.SBSE-button').addClass('SBSE-button--narrow'); // narrow buttons
        $container.find('.SBSE-button-reveal, .SBSE-select-filter').remove(); // remove reveal

        // insert textarea
        $('.user-info').eq(0).after($container);
    },
    plati() {
        let selectedCurrency = GM_getValue('SBSE_selectedCurrency', 'USD');
        let platiCurrency = $('th.product-price select option:selected').text().trim();
        const plati = {
            data: JSON.parse(GM_getValue('SBSE_plati', '{}')),
            save(callback) {
                GM_setValue('SBSE_plati', JSON.stringify(this.data));

                if (typeof callback === 'function') callback();
            },
            set(key, value, callback) {
                this.data[key] = value;
                this.save(callback);
            },
            setItem(id, value, save) {
                this.data.itemData[id] = value;
                if (save) this.save();
            },
            get(key) {
                return has.call(this.data, key) ? this.data[key] : null;
            },
            getItem(id) {
                return has.call(this.data.itemData, id) ? this.data.itemData[id] : null;
            },
            init() {
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
            },
        };
        const infiniteScroll = {
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
                lang: unsafeWindow.plang || 'en-US',
            },
            setParameters() {
                const $paging = $('.pages_nav').eq(0).children('a');
                const onclickArguments = $paging.eq(0).attr('onclick').match(/\((.+)\)/);

                if (onclickArguments[1]) {
                    const parameters = onclickArguments[1].split(',').map(x => (isNaN(x) ? x.replace(/['"]+/g, '') : parseInt(x, 10)));

                    this.parameters.idr = parameters[0];
                    this.parameters.sort = parameters[1];
                    this.parameters.rows = parameters[3];
                    this.parameters.curr = parameters[4];
                    this.parameters.page = parseInt($paging.filter('.active').text(), 10) + 1;
                    this.lastPage = parseInt($paging.filter(':last-child').text(), 10);
                }

                if (this.pathname) {
                    const type = this.pathname.slice(-5, -4);

                    this.parameters[`id_${type}`] = location.pathname.includes('/seller/') ? location.pathname.split('/').pop() : this.parameters.idr;
                }
            },
            fetchNextPage: async function fetchNextPage() {
                const $loader = $('.content_center .platiru-loader').eq(0);

                $loader.css('visibility', 'visible');
                this.loading = true;

                const $wrap = $('.SBSE-infiniteScroll-wrap');
                const $table = $wrap.find('table.goods-table');
                const params = this.parameters;
                params.rnd = Math.random();

                if (this.pathname) {
                    const res = await fetch(`${this.pathname}?${$.param(params)}`);
                    const $resHTML = $(await res.text());
                    const $trs = $resHTML.find('tbody > tr');

                    if (res.ok && $trs.length > 0) {
                        $table.find('tbody').append($trs);

                        // refresh paging
                        $wrap.siblings('.pages_nav, .sort_by').remove();
                        $wrap.after($resHTML.filter('.pages_nav, .sort_by'), $resHTML.find('.goods-table ~ *'));

                        params.page += 1;
                        this.reachedLastPage = params.page > this.lastPage;
                    }
                }

                this.loading = false;
                this.scrollHandler();
                $loader.css('visibility', 'hidden');
            },
            scrollHandler() {
                const $wrap = $('.SBSE-infiniteScroll-wrap');

                if ($('body').is('.enablePlatiFeature.infiniteScroll') &&
                    $wrap.length > 0 &&
                    this.enabled === true &&
                    this.loading === false &&
                    this.reachedLastPage === false) {
                    const spaceTillBotom = $wrap.prop('scrollHeight') - $wrap.scrollTop() - $wrap.height();

                    if (spaceTillBotom < 200) this.fetchNextPage();
                }
            },
            init() {
                if ($('.SBSE-infiniteScroll-wrap').length === 0) {
                    $('.goods-table').wrap($('<div class="SBSE-infiniteScroll-wrap"></div>').on('scroll', this.scrollHandler.bind(this)));
                }

                this.scrollHandler();
            },
        };
        const processor = {
            fetchItem: async function fetchItem(queue) {
                const tr = queue.shift();

                if (tr) {
                    const $tr = $(tr);
                    const url = $tr.attr('data-url');
                    const id = parseInt($tr.attr('data-id'), 10);
                    const classes = ['SBSE-item--fetching', 'SBSE-item--fetched'];

                    if (url.length > 0 && id > 0) {
                        const res = await fetch(url);

                        if (res.ok) {
                            const itemPageHTML = await res.text();
                            const description = itemPageHTML.slice(itemPageHTML.indexOf('goods-descr-text'), itemPageHTML.indexOf('goods_reviews'));
                            const found = description.match(regURL);

                            if (found) {
                                const type = found[3].slice(0, 3).toLowerCase();
                                const steamID = parseInt(found[4], 10);
                                const item = {};
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
                        } else classes.push('SBSE-item--failed');
                    }

                    $tr.removeClass('SBSE-item--owned SBSE-item--wished SBSE-item--ignored SBSE-item--notOwned SBSE-item--notApplicable');
                    $tr.toggleClass(classes.join(' '));
                    this.fetchItem(queue);
                } else plati.save();
            },
            fetchItems(items) {
                const filters = ['.SBSE-item--fetching'];
                if (plati.get('fetchOnStart')) filters.push('.SBSE-item--fetched');

                const $trs = items && items.length > 0 ? $(items) : $('.goods-table tbody > tr');
                const $filtered = $trs.filter(`.SBSE-item--steam:not(${filters.join()})`);

                $filtered.addClass('SBSE-item--fetching').removeClass('SBSE-item--notFetched');
                this.fetchItem($filtered.get());
            },
            process($rows = null) {
                if (plati.get('enablePlatiFeature')) {
                    const $table = $('.goods-table');
                    const $trs = $rows && $rows.length > 0 ? $rows : $table.find('tbody > tr');

                    // setup type & icon node
                    $trs.find('td:not(.icon) + .product-sold').before(`
                        <td class="type"><span class="SBSE-type"></span></td>
                        <td class="icon"><span class="SBSE-icon"></span></td>
                    `);

                    // setup price node
                    $trs.filter(':not(:has(.SBSE-price))').find('.product-price div').each((i, price) => {
                        const $price = $(price);
                        const value = parseFloat($price.text().trim()) * 100;

                        $price.replaceWith(`<span class="SBSE-price" data-currency="${platiCurrency}" data-value="${value}"></span>`);
                    });

                    // process
                    $trs
                        .filter(':not(.SBSE-item--processing, .SBSE-item--processed)')
                        .addClass('SBSE-item--processing SBSE-item--steam')
                        .each((i, tr) => {
                            const $tr = $(tr);
                            const url = $tr.find('.product-title a').attr('href');
                            const id = parseInt(url.split('/').pop(), 10);

                            if (url.length > 0 && id > 0) {
                                const classes = [];
                                const item = plati.getItem(id);

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
                                    $tr
                                        .removeClass('SBSE-item--owned SBSE-item--wished SBSE-item--ignored SBSE-item--notOwned SBSE-item--notApplicable')
                                        .addClass(classes.join(' '));
                                } else $tr.addClass('SBSE-item--notFetched');

                                $tr.attr({
                                    'data-id': id,
                                    'data-url': location.origin + url,
                                });
                            }
                        })
                        .removeClass('SBSE-item--processing')
                        .addClass('SBSE-item--processed');

                    // auto fetch on page visit
                    if (plati.get('fetchOnStart')) this.fetchItems();

                    xe.update(selectedCurrency);
                }
            },
            initTable(table) {
                const $table = table ? $(table) : $('.goods-table');
                const filters = $('.SBSE-plati-menu [data-config^="filter"] input:not(:checked)').map((i, ele) => ele.dataset.filter).get();
                platiCurrency = $table.find('th.product-price select option:selected').text().trim();

                // apply filters
                $table.addClass(filters.join(' '));
                // add type & icon
                $table.find('thead th:not(.icon) + .product-sold').before('<th class="type"></th><th class="icon"></th>');

                // grab infinite scroll parameters
                infiniteScroll.setParameters();

                // bind infinite scroll event
                if (plati.get('infiniteScroll')) infiniteScroll.init();
            },
            init() {
                this.initTable();
                this.process();

                const self = this;

                // detect list changes
                new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        Array.from(mutation.addedNodes).forEach((addedNode) => {
                            const $addedNode = $(addedNode);

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
                    subtree: true,
                });
            },
        };
        const insertMenu = () => {
            const $menu = $(`
                <ul class="SBSE-plati-menu">
                    <li data-config="enablePlatiFeature">
                        <label class="SBSE-switch SBSE-switch--small">
                            <input type="checkbox" id="enablePlatiFeature">
                            <span class="SBSE-switch__slider"></span>
                        </label>
                        <label for="enablePlatiFeature"><span>${i18n.get('enablePlatiFeature')}</span></label>
                    </li>
                    <li data-config="fetchOnStart">
                        <label class="SBSE-switch SBSE-switch--small">
                            <input type="checkbox" id="fetchOnStart">
                            <span class="SBSE-switch__slider"></span>
                        </label>
                        <label for="fetchOnStart"><span>${i18n.get('platiFetchOnStart')}</span></label>
                    </li>
                    <li data-config="infiniteScroll">
                        <label class="SBSE-switch SBSE-switch--small">
                            <input type="checkbox" id="infiniteScroll">
                            <span class="SBSE-switch__slider"></span>
                        </label>
                        <label for="infiniteScroll"><span>${i18n.get('platiInfiniteScroll')}</span></label>
                    </li>
                    <li data-config="fetchButton"><span>${i18n.get('platiFetchButton')}</span></li>
                    <li data-config="filterType" class="SBSE-dropdown">
                        <span>${i18n.get('platiFilterType')}</span>
                        <ul class="SBSE-dropdown__list">
                            <li><label><input type="checkbox" data-filter="filterGame"><span>${i18n.get('game')}</span></label></li>
                            <li><label><input type="checkbox" data-filter="filterDLC"><span>${i18n.get('dlc')}</span></label></li>
                            <li><label><input type="checkbox" data-filter="filterPackage"><span>${i18n.get('package')}</span></label></li>
                            <li><label><input type="checkbox" data-filter="filterBundle"><span>${i18n.get('bundle')}</span></label></li>
                        </ul>
                    </li>
                    <li data-config="filterStatus" class="SBSE-dropdown">
                        <span>${i18n.get('platiFilterStatus')}</span>
                        <ul class="SBSE-dropdown__list">
                            <li><label><input type="checkbox" data-filter="filterOwned"><span>${i18n.get('owned')}</span></label></li>
                            <li><label><input type="checkbox" data-filter="filterWished"><span>${i18n.get('wished')}</span></label></li>
                            <li><label><input type="checkbox" data-filter="filterIgnored"><span>${i18n.get('ignored')}</span></label></li>
                            <li><label><input type="checkbox" data-filter="filterNotOwned"><span>${i18n.get('notOwned')}</span></label></li>
                            <li><label><input type="checkbox" data-filter="filterNotApplicable"><span>${i18n.get('notApplicable')}</span></label></li>
                            <li><label><input type="checkbox" data-filter="filterNotFetched"><span>${i18n.get('notFetched')}</span></label></li>
                        </ul>
                    </li>
                    <li data-config="currency" class="SBSE-dropdown">
                        <span class="selectedCurrency">${xe.currencies[selectedCurrency][config.get('language')]}</span>
                        <ul class="SBSE-dropdown__list"></ul>
                    </li>
                    <li data-config="syncButton"><span>${i18n.get('settingsSyncLibrary')}</span></li>
                </ul>
            `);
            const $enablePlatiFeature = $menu.find('[data-config="enablePlatiFeature"] input');
            const $fetchOnStart = $menu.find('[data-config="fetchOnStart"] input');
            const $infiniteScroll = $menu.find('[data-config="infiniteScroll"] input');
            const $fetchButton = $menu.find('[data-config="fetchButton"] span');
            const $filters = $menu.find('[data-config^="filter"] input');
            const $currencyToggler = $menu.find('[data-config="currency"] ul');
            const $syncButton = $menu.find('[data-config="syncButton"] span');

            // bind event
            $enablePlatiFeature.on('change', () => {
                const state = $enablePlatiFeature.prop('checked');

                plati.set('enablePlatiFeature', state);
                $menu.find('li:not([data-config="enablePlatiFeature"])').toggleClass('hide1', !state);

                if (state) processor.init();
                $('body').toggleClass('enablePlatiFeature', state);
            });
            $fetchOnStart.on('change', () => {
                const state = $fetchOnStart.prop('checked');

                plati.set('fetchOnStart', state);
                $fetchButton.parent().toggleClass('hide2', state);
            });
            $infiniteScroll.on('change', () => {
                const state = $infiniteScroll.prop('checked');

                plati.set('infiniteScroll', state);
                infiniteScroll.enabled = state;
                $('body').toggleClass('infiniteScroll', state);

                // bind infinite scroll event if not already
                if (state) infiniteScroll.init();
            });
            $fetchButton.on('click', processor.fetchItems.bind(processor));
            $filters.on('change', (e) => {
                const input = e.delegateTarget;
                const filter = input.dataset.filter;
                const state = input.checked;

                plati.set(filter, state);
                $('.goods-table').toggleClass(filter, !state);
                infiniteScroll.scrollHandler();
            });
            Object.keys(xe.currencies).forEach((currency) => {
                const currencyName = xe.currencies[currency][config.get('language')];

                $currencyToggler.append(
                    $(`<span>${currencyName}</span>`).on('click', () => {
                        xe.update(currency);
                        selectedCurrency = currency;
                        $currencyToggler.prev('.selectedCurrency').text(currencyName);
                    }),
                );
            });
            $currencyToggler.find('span').wrap('<li></li>');
            $syncButton.on('click', () => {
                steam.sync([{
                    key: 'library',
                    sync: true,
                    save: true,
                    notify: true,
                    callback() {
                        processor.process($('.goods-table tbody tr.SBSE-item--notOwned')).call(processor);
                    },
                }]);
            });

            // apply config
            $enablePlatiFeature.prop('checked', plati.get('enablePlatiFeature'));
            $menu.find('li:not([data-config="enablePlatiFeature"])').toggleClass('hide1', !plati.get('enablePlatiFeature'));
            $fetchOnStart.prop('checked', plati.get('fetchOnStart'));
            $infiniteScroll.prop('checked', plati.get('infiniteScroll'));
            $fetchButton.parent().toggleClass('hide2', plati.get('fetchOnStart'));
            $filters.each((i, input) => {
                const filter = input.dataset.filter;
                const state = plati.get(filter);

                input.checked = state;
                $('.goods-table').toggleClass(filter, !state);
            });

            $('body')
                .toggleClass('enablePlatiFeature', plati.get('enablePlatiFeature'))
                .toggleClass('infiniteScroll', plati.get('infiniteScroll'));

            const $target = $('.merchant_products');

            if ($target.length === 0) $('.content_center').before($menu);
            else $target.eq(0).prepend($menu);
        };

        plati.init();

        // inject css styles
        GM_addStyle(`
            li[class*="hide"] { display: none; }
            .SBSE-plati-menu { display: flex; margin: 10px 0 0 0 !important; list-style: none; }
            .SBSE-plati-menu > li { height: 30px; line-height: 30px; padding-right: 30px; }
            .SBSE-plati-menu > li > .SBSE-switch { vertical-align: text-bottom; }
            .SBSE-plati-menu > li > * { cursor: pointer; }
            .SBSE-dropdown__list { width: max-content; z-index: 999; box-shadow: 5px 5px 10px grey; }
            .SBSE-dropdown__list li { cursor: default; }
            .SBSE-dropdown__list li > label, .SBSE-dropdown__list li > span { width: 100%; display: inline-block; margin: 0 10px; cursor: pointer; text-align: left; }
            tr.SBSE-item--processed:hover { background-color: #f3f3f3; }
            tr.SBSE-item--processed:hover .product-title > div::after { display: none; }
            .filterGame tr.SBSE-item--game,
            .filterDLC tr.SBSE-item--DLC,
            .filterPackage tr.SBSE-item--package,
            .filterBundle tr.SBSE_bundle,
            .filterOwned tr.SBSE-item--owned,
            .filterWished tr.SBSE-item--wished,
            .filterIgnored tr.SBSE-item--ignored,
            .filterNotOwned tr.SBSE-item--notOwned,
            .filterNotApplicable tr.SBSE-item--notApplicable,
            .filterNotFetched tr.SBSE-item--notFetched { display: none; }
            body.enablePlatiFeature .content_center { width: initial; }
            body.enablePlatiFeature .right_side { display: none; }
            body.enablePlatiFeature .goods-table { width: initial; }
            body.enablePlatiFeature .product-title > div { max-width: 600px !important; }
            body.enablePlatiFeature.infiniteScroll .SBSE-infiniteScroll-wrap {
                max-height: 600px;
                margin: 10px 0;
                overflow: auto;
            }
            body.enablePlatiFeature.infiniteScroll .goods-table { margin: 0; }
            body.enablePlatiFeature.infiniteScroll .goods-table tbody > tr > td:last-child { padding-right: 5px; }
            .SBSE-icon { vertical-align: middle; }
            body:not(.enablePlatiFeature) .type,
            body:not(.enablePlatiFeature) .icon { display: none; }
            .merchant_products > .SBSE-plati-menu { margin: 0 0 10px 0 !important; }
        `);

        if (location.pathname.startsWith('/seller/') || location.pathname.startsWith('/cat/')) {
            insertMenu();
            processor.init();
        }
    },
};
const init = () => {
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
            const currentID = config.get('sessionID');
            const sessionID = unsafeWindow.g_sessionID || '';
            const language = unsafeWindow.g_oSuggestParams.l || 'english';

            if (!config.get('language')) config.set('language', language);
            if (sessionID.length > 0) {
                const update = config.get('autoUpdateSessionID') && currentID !== sessionID;

                if (!currentID || update) {
                    config.set('sessionID', sessionID, () => {
                        swal({
                            title: i18n.get('updateSuccessTitle'),
                            text: i18n.get('updateSuccess'),
                            type: 'success',
                            timer: 3000,
                        });
                    });
                }
            }
        }
    } else {
        const site = location.hostname.replace(/(www|alds|bundle|steamdb)\./, '').split('.').shift();

        // check sessionID
        if (!config.get('sessionID')) steam.getSessionID();

        if (has.call(siteHandlers, site)) siteHandlers[site](true);
    }

    steamCNTooltip.listen();
};

$(init);
