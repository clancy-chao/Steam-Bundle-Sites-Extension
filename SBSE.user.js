'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// ==UserScript==
// @name         Steam Bundle Sites Extension
// @homepage     https://github.com/clancy-chao/Steam-Bundle-Sites-Extension
// @namespace    http://tampermonkey.net/
// @version      2.4.0
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
// @include      http*://bundle.ccyycn.com/order/*
// @include      https://groupees.com/purchases
// @include      https://groupees.com/profile/purchases/*
// @include      http*://*agiso.com/*
// @include      https://steamdb.steamcn.com/tooltip*
// @include      https://yuplay.ru/orders/*/
// @include      https://yuplay.ru/product/*/
// @include      http://gama-gama.ru/personal/settings/*
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
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

/* global swal */

// setup jQuery
var $ = jQuery.noConflict(true);

$.fn.pop = [].pop;
$.fn.shift = [].shift;

// inject external css styles
GM_addStyle(GM_getResourceText('sweetalert2CSS'));
GM_addStyle(GM_getResourceText('currencyFlags'));
GM_addStyle(GM_getResourceText('flagIcon').replace(/\.\.\//g, 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.1.0/'));

// inject script css styles
GM_addStyle('\n    pre.SBSE_errorMsg { height: 200px; text-align: left; white-space: pre-wrap; }\n\n    /* settings */\n    .SBSE_settings .name { text-align: right; vertical-align: top; }\n    .SBSE_settings .value { text-align: left; }\n    .SBSE_settings .value > * { height: 30px; margin: 0 20px 10px; }\n    .SBSE_settings .switch { position: relative; display: inline-block; width: 60px; }\n    .SBSE_settings .switch input { display: none; }\n    .SBSE_settings .slider {\n        position: absolute;\n        top: 0; right: 0; bottom: 0; left: 0;\n        background-color: #CCC;\n        transition: 0.4s;\n        cursor: pointer;\n    }\n    .SBSE_settings .slider:before {\n        width: 26px; height: 26px;\n        position: absolute;\n        bottom: 2px; left: 2px;\n        background-color: white;\n        transition: 0.4s;\n        content: "";\n    }\n    .SBSE_settings input:checked + .slider { background-color: #2196F3; }\n    .SBSE_settings input:focus + .slider { box-shadow: 0 0 1px #2196F3; }\n    .SBSE_settings input:checked + .slider:before { transform: translateX(30px); }\n    .SBSE_settings > span { display: inline-block; color: white; cursor: pointer; }\n\n    /* container */\n    .SBSE_container {\n        width: 100%; height: 200px;\n        display: flex;\n        flex-direction: column;\n        box-sizing: border-box;\n    }\n    .SBSE_container > textarea {\n        width: 100%; height: 150px;\n        padding: 5px;\n        border: none;\n        box-sizing: border-box;\n        resize: none;\n        outline: none;\n    }\n    .SBSE_container > div { width: 100%; padding-top: 5px; box-sizing: border-box; }\n    .SBSE_container > div > button, .SBSE_container > div > a {\n        width: 120px;\n        position: relative;\n        margin-right: 10px;\n        line-height: 28px;\n        transition: all 0.5s;\n        box-sizing: border-box;\n        outline: none;\n        cursor: pointer;\n    }\n    .SBSE_container > div > a { display: inline-block; text-align: center; }\n    .SBSE_container select { max-width:120px; height: 30px; }\n    .SBSE_container label { margin-right: 10px; }\n    #SBSE_BtnSettings {\n        width: 20px; height: 20px;\n        float: right;\n        margin-top: 3px; margin-right: 0; margin-left: 10px;\n        background-color: transparent;\n        background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGhlaWdodD0iMzJweCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzIgMzI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjMycHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnIGlkPSJMYXllcl8xIi8+PGcgaWQ9ImNvZyI+PHBhdGggZD0iTTMyLDE3Ljk2OXYtNGwtNC43ODEtMS45OTJjLTAuMTMzLTAuMzc1LTAuMjczLTAuNzM4LTAuNDQ1LTEuMDk0bDEuOTMtNC44MDVMMjUuODc1LDMuMjUgICBsLTQuNzYyLDEuOTYxYy0wLjM2My0wLjE3Ni0wLjczNC0wLjMyNC0xLjExNy0wLjQ2MUwxNy45NjksMGgtNGwtMS45NzcsNC43MzRjLTAuMzk4LDAuMTQxLTAuNzgxLDAuMjg5LTEuMTYsMC40NjlsLTQuNzU0LTEuOTEgICBMMy4yNSw2LjEyMWwxLjkzOCw0LjcxMUM1LDExLjIxOSw0Ljg0OCwxMS42MTMsNC43MDMsMTIuMDJMMCwxNC4wMzF2NGw0LjcwNywxLjk2MWMwLjE0NSwwLjQwNiwwLjMwMSwwLjgwMSwwLjQ4OCwxLjE4OCAgIGwtMS45MDIsNC43NDJsMi44MjgsMi44MjhsNC43MjMtMS45NDVjMC4zNzksMC4xOCwwLjc2NiwwLjMyNCwxLjE2NCwwLjQ2MUwxNC4wMzEsMzJoNGwxLjk4LTQuNzU4ICAgYzAuMzc5LTAuMTQxLDAuNzU0LTAuMjg5LDEuMTEzLTAuNDYxbDQuNzk3LDEuOTIybDIuODI4LTIuODI4bC0xLjk2OS00Ljc3M2MwLjE2OC0wLjM1OSwwLjMwNS0wLjcyMywwLjQzOC0xLjA5NEwzMiwxNy45Njl6ICAgIE0xNS45NjksMjJjLTMuMzEyLDAtNi0yLjY4OC02LTZzMi42ODgtNiw2LTZzNiwyLjY4OCw2LDZTMTkuMjgxLDIyLDE1Ljk2OSwyMnoiIHN0eWxlPSJmaWxsOiM0RTRFNTA7Ii8+PC9nPjwvc3ZnPg==);\n        background-size: contain;\n        background-repeat: no-repeat;\n        background-origin: border-box;\n        border: none;\n        vertical-align: top;\n    }\n\n    /* spinner button affect */\n    .SBSE_container > div > button:before {\n        width: 20px; height: 20px;\n        content: \'\';\n        position: absolute;\n        margin-top: 5px;\n        right: 10px;\n        border: 3px solid;\n        border-left-color: transparent;\n        border-radius: 50%;\n        box-sizing: border-box;\n        opacity: 0;\n        transition: opacity 0.5s;\n        animation-duration: 1s;\n        animation-iteration-count: infinite;\n        animation-name: rotate;\n        animation-timing-function: linear;\n    }\n    .SBSE_container > div > button.narrow.working {\n        width: 100px;\n        padding-right: 40px;\n        transition: all 0.5s;\n    }\n    .SBSE_container > div > button.working:before {\n        transition-delay: 0.5s;\n        transition-duration: 1s;\n        opacity: 1;\n    }\n    @keyframes rotate {\n        0% { transform: rotate(0deg); }\n        100% { transform: rotate(360deg); }\n    }\n\n    /* icons */\n    .SBSE_icon {\n        width: 20px; height: 20px;\n        display: none;\n        border-radius: 50%;\n        background-color: #E87A90;\n        transform: rotate(45deg);\n    }\n    .SBSE_icon:before, .SBSE_icon:after {\n        content: \'\';\n        width: 3px; height: 14px;\n        position: absolute;\n        top: 50%; left: 50%;\n        transform: translate(-50%, -50%);\n        background-color: white;\n        border-radius: 5px;\n        pointer-events: none;\n    }\n    .SBSE_icon:after { transform: translate(-50%, -50%) rotate(-90deg); }\n    .SBSE_owned .SBSE_icon { background-color: #9CCC65; }\n    .SBSE_owned .SBSE_icon:before, .SBSE_owned .SBSE_icon:after { transform: none; }\n    .SBSE_owned .SBSE_icon:before {\n        width: 3px; height: 11px;\n        top: 4px; left: 10px;\n        border-radius: 5px 5px 5px 0;\n    }\n    .SBSE_owned .SBSE_icon:after {\n        width: 5px; height: 3px;\n        top: 12px; left: 6px;\n        border-radius: 5px 0 0 5px;\n    }\n    .SBSE_wished .SBSE_icon { transform: rotate(0); background-color: #29B6F6; }\n    .SBSE_wished .SBSE_icon:before, .SBSE_wished .SBSE_icon:after {\n        width: 6px; height: 10px;\n        top: 5px; left: 10px;\n        border-radius: 6px 6px 0 0;\n        transform: rotate(-45deg);\n        transform-origin: 0 100%;\n    }\n    .SBSE_wished .SBSE_icon:after {\n        left: 4px;\n        transform: rotate(45deg);\n        transform-origin :100% 100%;\n    }\n    .isSteam .SBSE_icon { display: inline-block; }\n\n    /* Steam Tooltip */\n    .SBSE_tooltip {\n        width: 308px;\n        position: fixed;\n        overflow: hidden;\n        background: url(https://steamstore-a.akamaihd.net/public/images/v6/blue_body_darker_repeat.jpg) -700px center repeat-y scroll rgb(0, 0, 0);\n        border: 0;\n        box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5);\n        transition: all 0.5s;\n        z-index: 999;\n    }\n    .SBSE_tooltip.SBSE_hide { display: none; }\n\n    /* Tooltip */\n    [tooltip]::before, [tooltip]::after {\n        position: absolute;\n        opacity: 0;\n        transition: all 0.15s ease;\n    }\n    [tooltip]::before {\n        width: max-content;\n        content: attr(tooltip);\n        top: calc(100% + 10px); left: 0;\n        padding: 10px;\n        color: #4a4c45;\n        background-color: white;\n        border-radius: 3px;\n        box-shadow: 1px 2px 3px rgba(0,0,0,0.45);\n    }\n    [tooltip]::after {\n        content: "";\n        top: calc(100% + 5px); left: 10px;\n        border-left: 5px solid transparent;\n        border-right: 5px solid transparent;\n        border-bottom: 5px solid white;\n    }\n    [tooltip]:hover::before, [tooltip]:hover::after { opacity: 1; }\n    [tooltip]:not([tooltip-persistent])::before, [tooltip]:not([tooltip-persistent])::after { pointer-events: none; }\n');

// load up
var regKey = /(?:(?:([A-Z0-9])(?!\1{4})){5}-){2,5}[A-Z0-9]{5}/g;
var eol = "\r\n";
var has = Object.prototype.hasOwnProperty;
var unique = function unique(a) {
    return [].concat(_toConsumableArray(new Set(a)));
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
        if (!has.call(this.data, 'preselectIncludeTitle')) this.data.preselectIncludeTitle = false;
        if (!has.call(this.data, 'titleComesLast')) this.data.titleComesLast = false;
        if (!has.call(this.data, 'preselectJoinKeys')) this.data.preselectJoinKeys = false;
        if (!has.call(this.data, 'joinKeysASFStyle')) this.data.joinKeysASFStyle = true;
        if (!has.call(this.data, 'activateAllKeys')) this.data.activateAllKeys = false;
        if (!has.call(this.data, 'enableTooltips')) this.data.enableTooltips = this.get('language') !== 'english';
    }
};
var i18n = {
    data: {
        tchinese: {
            name: '繁體中文',
            updateSuccessTitle: '更新成功！',
            updateSuccess: '成功更新Steam sessionID',
            successStatus: '成功',
            successDetail: '無資料',
            skippedStatus: '跳過',
            activatedDetail: '已啟動',
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
            settingsSyncLibrary: '同步遊戲庫資料',
            settingsSyncLibraryButton: '同步',
            settingsLanguage: '語言',
            settingsPreselectIncludeTitle: '預選包括遊戲名',
            settingsTitleComesLast: '遊戲名置後',
            settingsPreselectJoinKeys: '預選合併序號',
            settingsJoinKeysASFStyle: '合併ASF 格式序號',
            settingsActivateAllKeys: '不跳過、啟動所有序號',
            settingsEnableTooltips: 'SteamCN 論壇提示框',
            HBAlreadyOwned: '遊戲已擁有',
            HBRedeemAlreadyOwned: '確定刮開 %title% Steam 序號？',
            HBActivationRestrictions: '啟動限制',
            HBDisallowedCountries: '限制以下地區啟動',
            HBExclusiveCountries: '僅限以下地區啟動',
            HBCurrentLocation: '當前位於：',
            DIGEasyBuyPurchase: '購買',
            DIGEasyBuySelectAll: '全選',
            DIGEasyBuySelectCancel: '取消',
            DIGEasyBuyHideOwned: '隱藏已擁有',
            DIGEasyBuyShowOwned: '顯示已擁有',
            DIGEasyBuyLoadAllPages: '加載所有頁',
            DIGEasyBuyLoading: '加載第%page%頁中',
            DIGEasyBuyLoadingComplete: '加載完成',
            DIGButtonPurchasing: '購買中',
            DIGInsufficientFund: '餘額不足，準備回到帳號頁',
            DIGMarketSearchResult: '目前市集上架中',
            DIGRateAllPositive: '全部好評',
            DIGClickToHideThisRow: '隱藏此上架遊戲',
            buttonReveal: '刮開',
            buttonRetrieve: '提取',
            buttonActivate: '啟動',
            buttonCopy: '複製',
            buttonReset: '清空',
            buttonExport: '匯出',
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
            lastSyncTime: '已於%seconds% 秒前同步收藏庫'
        },
        schinese: {
            name: '简体中文',
            updateSuccessTitle: '更新成功',
            updateSuccess: '成功更新Steam sessionID',
            successStatus: '成功',
            successDetail: '无信息',
            activatedDetail: '已激活',
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
            settingsSyncLibrary: '同步游戏库资料',
            settingsSyncLibraryButton: '同步',
            settingsLanguage: '语言',
            settingsPreselectIncludeTitle: '预选包括游戏名',
            settingsTitleComesLast: '游戏名置后',
            settingsPreselectJoinKeys: '预选合并激活码',
            settingsJoinKeysASFStyle: '合并ASF 格式激活码',
            settingsActivateAllKeys: '不跳过、激活所有激活码',
            settingsEnableTooltips: 'SteamCN 论坛提示窗',
            HBAlreadyOwned: '游戏已拥有',
            HBRedeemAlreadyOwned: '确定刮开 %title% Steam 激活码？',
            HBActivationRestrictions: '激活限制',
            HBDisallowedCountries: '限制以下地区激活',
            HBExclusiveCountries: '仅限以下地区激活',
            HBCurrentLocation: '当前位于：',
            DIGEasyBuyPurchase: '购买',
            DIGEasyBuySelectAll: '全选',
            DIGEasyBuySelectCancel: '取消',
            DIGEasyBuyHideOwned: '隐藏已拥有',
            DIGEasyBuyShowOwned: '显示已拥有',
            DIGEasyBuyLoadAllPages: '加载所有页',
            DIGEasyBuyLoading: '加载第%page%页中',
            DIGEasyBuyLoadingComplete: '加载完成',
            DIGButtonPurchasing: '购买中',
            DIGInsufficientFund: '余额不足，准备回到账号页',
            DIGMarketSearchResult: '目前市集上架中',
            DIGRateAllPositive: '全部好评',
            DIGClickToHideThisRow: '隐藏此上架游戏',
            buttonReveal: '刮开',
            buttonRetrieve: '提取',
            buttonActivate: '激活',
            buttonCopy: '复制',
            buttonReset: '清空',
            buttonExport: '导出',
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
            lastSyncTime: '已于%seconds% 秒前同步游戏库'
        },
        english: {
            name: 'English',
            updateSuccessTitle: 'Update Successful!',
            updateSuccess: 'Steam sessionID is successfully updated',
            successStatus: 'Success',
            successDetail: 'No Detail',
            activatedDetail: 'Activated',
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
            settingsSyncLibrary: 'Sync Library Data',
            settingsSyncLibraryButton: 'Sync',
            settingsLanguage: 'Language',
            settingsPreselectIncludeTitle: 'Pre-select Include Title',
            settingsTitleComesLast: 'Title Comes Last',
            settingsPreselectJoinKeys: 'Pre-select Join Keys',
            settingsJoinKeysASFStyle: 'Join Keys w/ ASF Style',
            settingsActivateAllKeys: 'No skip & activate all keys',
            settingsEnableTooltips: 'Tooltips from SteamCN',
            HBAlreadyOwned: 'Game Already Owned',
            HBRedeemAlreadyOwned: 'Are you sure to redeem %title% Steam Key?',
            HBActivationRestrictions: 'Activation Restrictions',
            HBDisallowedCountries: 'Cannot be activated in the following regions',
            HBExclusiveCountries: 'Can only be activated in the following regions',
            HBCurrentLocation: 'Current Location: ',
            DIGEasyBuyPurchase: 'Purchase',
            DIGEasyBuySelectAll: 'Select All',
            DIGEasyBuySelectCancel: 'Cancel',
            DIGEasyBuyHideOwned: 'Hide Owned',
            DIGEasyBuyShowOwned: 'Show Owned',
            DIGEasyBuyLoadAllPages: 'Load All Pages',
            DIGEasyBuyLoading: 'Loading page %page%',
            DIGEasyBuyLoadingComplete: 'Loaded',
            DIGButtonPurchasing: 'Purchassing',
            DIGInsufficientFund: 'Insufficient fund, returning to account page',
            DIGMarketSearchResult: 'Currently listing in marketplace',
            DIGRateAllPositive: 'Mark All Positive',
            DIGClickToHideThisRow: 'Hide this game from listings',
            buttonReveal: 'Reveal',
            buttonRetrieve: 'Retrieve',
            buttonActivate: 'Activate',
            buttonCopy: 'Copy',
            buttonReset: 'Reset',
            buttonExport: 'Export',
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
            lastSyncTime: 'Library data synced %seconds% seconds ago'
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
            symbol: 'AU$'
        },
        CAD: {
            english: 'Canadian Dollar',
            tchinese: '加幣',
            schinese: '加元',
            symbol: 'CA$'
        },
        CNY: {
            english: 'Chinese Yuan',
            tchinese: '人民幣',
            schinese: '人民币',
            symbol: 'CN¥'
        },
        EUR: {
            english: 'Euro',
            tchinese: '歐元',
            schinese: '欧元',
            symbol: '€'
        },
        GBP: {
            english: 'Great Britain Pound',
            tchinese: '英鎊',
            schinese: '英镑',
            symbol: '£'
        },
        HKD: {
            english: 'Hong Kong Dollar',
            tchinese: '港幣',
            schinese: '港元',
            symbol: 'HK$'
        },
        JPY: {
            english: 'Japanese Yen',
            tchinese: '日圓',
            schinese: '日元',
            symbol: 'JP¥'
        },
        KRW: {
            english: 'South Korean Won',
            tchinese: '韓圓',
            schinese: '韩币',
            symbol: '₩'
        },
        MYR: {
            english: 'Malaysian Ringgit',
            tchinese: '令吉',
            schinese: '林吉特',
            symbol: 'RM'
        },
        NTD: {
            english: 'New Taiwan Dollar',
            tchinese: '台幣',
            schinese: '台币',
            symbol: 'NT$'
        },
        NZD: {
            english: 'New Zealand Dollar',
            tchinese: '紐幣',
            schinese: '新西兰元',
            symbol: 'NZ$'
        },
        RUB: {
            english: 'Russian Ruble',
            tchinese: '盧布',
            schinese: '卢布',
            symbol: 'руб'
        },
        USD: {
            english: 'United States Dollar',
            tchinese: '美元',
            schinese: '美元',
            symbol: 'US$'
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

                        res.response.split("\n").forEach(function (line) {
                            if (line.includes('currency=')) {
                                var currency = line.split('currency=\'').pop().slice(0, 3);
                                var rate = line.trim().split('rate=\'').pop().slice(0, -3);

                                exchangeRate.rates[currency] = parseFloat(rate);
                            }
                        });

                        // get NTD
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: 'https://www.google.com/search?q=1+EUR+%3D+NTD',
                            onload: function onload(searchRes) {
                                var rate = parseFloat(searchRes.response.split('<div class="vk_ans vk_bk">').pop().slice(0, 7).trim());
                                var NTDRate = isNaN(rate) ? exchangeRate.rates.HKD * 3.75 : rate;

                                exchangeRate.rates.NTD = NTDRate;
                                exchangeRate.rates.EUR = 1;
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

        $('.SBSE_price').each(function (i, ele) {
            var originalCurrency = ele.dataset.currency;
            var originalValue = parseInt(ele.dataset.value, 10);
            var originalRate = _this.exchangeRate.rates[originalCurrency];
            var targetRate = _this.exchangeRate.rates[targetCurrency];
            var exchangedValue = originalValue / originalRate * targetRate;

            $(ele).text(_this.currencies[targetCurrency].symbol + (exchangedValue / 100).toFixed(2));
        });
    },
    init: function init() {
        var updateTimer = 12 * 60 * 60 * 1000; // update every 12 hours

        if (Object.keys(this.exchangeRate).length === 0 || this.exchangeRate.lastUpdate < Date.now() - updateTimer) this.getRate();
    }
};
var steam = {
    library: JSON.parse(localStorage.getItem('SBSE_steam') || '{}'),
    sync: function sync() {
        var notify = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        var self = this;
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://store.steampowered.com/dynamicstore/userdata/t=' + Math.random(),
            onload: function onload(res) {
                var data = JSON.parse(res.response);

                self.library.owned.app = data.rgOwnedApps;
                self.library.owned.sub = data.rgOwnedPackages;
                self.library.wished.app = data.rgWishlist;
                self.library.wished.sub = [];
                self.library.ignored.app = data.rgIgnoredApps;
                self.library.ignored.sub = data.rgIgnoredPackages;
                self.library.lastSync = Date.now();
                self.set();

                if (notify === true) {
                    swal({
                        title: i18n.get('syncSuccessTitle'),
                        text: i18n.get('syncSuccess'),
                        type: 'success',
                        timer: 3000
                    });
                }
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
    },
    set: function set() {
        localStorage.setItem('SBSE_steam', JSON.stringify(this.library));
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
    lastSync: function lastSync() {
        return this.library.lastSync;
    },
    init: function init() {
        if (Object.keys(this.library).length === 0) {
            this.library.owned = { app: {}, sub: {} };
            this.library.wished = { app: {}, sub: {} };
            this.library.ignored = { app: {}, sub: {} };
            this.set();
        }

        // update steam library every 10 min
        var updateTimer = 10 * 60 * 1000;

        if (!this.lastSync() || this.lastSync() < Date.now() - updateTimer) this.sync(false);
    }
};

// functions
var getSessionID = function getSessionID() {
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://store.steampowered.com/',
        onload: function onload(res) {
            if (res.status === 200) {
                var accountID = res.response.match(/g_AccountID = (\d+)/).pop();
                var sessionID = res.response.match(/g_sessionID = "(\w+)"/).pop();

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
        }
    });
};
var steamCNTooltip = {
    timeoutID: 0,
    load: function load(data) {
        var _this2 = this;

        if (config.get('enableTooltips')) {
            var $container = $('<div/>');

            (Array.isArray(data) ? data : [data]).forEach(function (d) {
                ['app', 'sub'].forEach(function (type) {
                    if (has.call(d, type)) {
                        var url = 'https://steamdb.steamcn.com/tooltip?v=4#' + type + '/' + d[type] + '#steam_info_' + type + '_' + d[type] + '_1';

                        $container.append($('<iframe id="tooltip_' + (type + d[type]) + '" class="SBSE_tooltip SBSE_hide" data-url="' + url + '"></iframe>').mouseenter(function () {
                            clearTimeout(_this2.timeoutID);
                        }).mouseout(_this2.hide));
                    }
                });
            });

            $('body').append($container);
        }
    },
    show: function show(e) {
        var _this3 = this;

        var $target = $(e.currentTarget);
        var json = $target.closest('.SBSE_processed').attr('data-gameinfo');

        if (json.length > 0 && config.get('enableTooltips')) {
            var data = JSON.parse(json);
            var opened = !!$('.SBSE_tooltip:not(.SBSE_hide)').length;

            ['app', 'sub'].forEach(function (type) {
                var $tooltip = $('#tooltip_' + (type + data[type]));

                if ($tooltip.length > 0 && !opened) {
                    // load tooltip
                    if (!$tooltip.attr('src')) $tooltip.attr('src', $tooltip.attr('data-url'));

                    $tooltip.css({
                        top: e.clientY,
                        left: e.clientX + 10
                    }).removeClass('SBSE_hide');
                    _this3.reposition($tooltip, $tooltip.height());
                    $tooltip[0].contentWindow.postMessage('show', '*'); // get height

                    $target.one('mouseout', function () {
                        _this3.timeoutID = setTimeout(_this3.hide.bind(steamCNTooltip), 500);
                    });
                }
            });
        }
    },
    hide: function hide() {
        var $tooltip = $('.SBSE_tooltip:not(.SBSE_hide)');

        $tooltip.addClass('SBSE_hide');
        $tooltip[0].contentWindow.postMessage('hide', '*');
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
        var _this4 = this;

        window.addEventListener('message', function (e) {
            if (e.origin === 'https://steamdb.steamcn.com' && e.data.height && e.data.src) {
                var $tooltip = $('.SBSE_tooltip[src="' + e.data.src + '"]');

                $tooltip.height(e.data.height);
                _this4.reposition($tooltip, e.data.height);
            }
        });
    }
};
var settings = {
    construct: function construct() {
        var panelHTML = '\n            <div class="SBSE_settings">\n                <table>\n                    <tr>\n                        <td class="name">' + i18n.get('settingsAutoUpdateSessionID') + '</td>\n                        <td class="value">\n                            <label class="switch">\n                                <input type="checkbox" class="autoUpdateSessionID">\n                                <span class="slider"></span>\n                            </label>\n                        </td>\n                    </tr>\n                    <tr>\n                        <td class="name">' + i18n.get('settingsSessionID') + '</td>\n                        <td class="value">\n                            <input type="text" class="sessionID" value="' + config.get('sessionID') + '">\n                        </td>\n                    </tr>\n                    <tr>\n                        <td class="name">' + i18n.get('settingsSyncLibrary') + '</td>\n                        <td class="value">\n                            <button class="syncLibrary">' + i18n.get('settingsSyncLibraryButton') + '</button>\n                        </td>\n                    </tr>\n                    <tr>\n                        <td class="name">' + i18n.get('settingsLanguage') + '</td>\n                        <td class="value">\n                            <select class="language"></select>\n                        </td>\n                    </tr>\n                    <tr>\n                        <td class="name">' + i18n.get('settingsPreselectIncludeTitle') + '</td>\n                        <td class="value">\n                            <label class="switch">\n                                <input type="checkbox" class="preselectIncludeTitle">\n                                <span class="slider"></span>\n                            </label>\n                        </td>\n                    </tr>\n                    <tr>\n                        <td class="name">' + i18n.get('settingsTitleComesLast') + '</td>\n                        <td class="value">\n                            <label class="switch">\n                                <input type="checkbox" class="titleComesLast">\n                                <span class="slider"></span>\n                            </label>\n                        </td>\n                    </tr>\n                    <tr>\n                        <td class="name">' + i18n.get('settingsPreselectJoinKeys') + '</td>\n                        <td class="value">\n                            <label class="switch">\n                                <input type="checkbox" class="preselectJoinKeys">\n                                <span class="slider"></span>\n                            </label>\n                        </td>\n                    </tr>\n                    <tr>\n                        <td class="name">' + i18n.get('settingsJoinKeysASFStyle') + '</td>\n                        <td class="value">\n                            <label class="switch">\n                                <input type="checkbox" class="joinKeysASFStyle">\n                                <span class="slider"></span>\n                            </label>\n                        </td>\n                    </tr>\n                    <tr>\n                        <td class="name">' + i18n.get('settingsActivateAllKeys') + '</td>\n                        <td class="value">\n                            <label class="switch">\n                                <input type="checkbox" class="activateAllKeys">\n                                <span class="slider"></span>\n                            </label>\n                        </td>\n                    </tr>\n                    <tr>\n                        <td class="name">' + i18n.get('settingsEnableTooltips') + '</td>\n                        <td class="value">\n                            <label class="switch">\n                                <input type="checkbox" class="enableTooltips">\n                                <span class="slider"></span>\n                            </label>\n                        </td>\n                    </tr>\n                </table>\n            </div>\n        ';

        return panelHTML;
    },
    display: function display() {
        swal({
            title: i18n.get('settingsTitle'),
            html: this.construct()
        });

        // apply settings
        var $panel = $(swal.getContent());
        var $sessionID = $panel.find('.sessionID');
        var $language = $panel.find('.language');

        // toggles
        $panel.find('input[type=checkbox]').each(function (index, input) {
            var $input = $(input);

            $input.prop('checked', config.get(input.className));
            $input.change(function (e) {
                swal.showLoading();

                var setting = e.delegateTarget.className;
                var state = e.delegateTarget.checked;

                config.set(setting, state);

                if (setting === 'autoUpdateSessionID') $sessionID.attr('disabled', state);

                setTimeout(swal.hideLoading, 500);
            });
        });

        // sessionID input
        $sessionID.prop('disabled', config.get('autoUpdateSessionID'));
        $sessionID.change(function () {
            swal.showLoading();

            config.set('sessionID', $sessionID.val().trim());

            setTimeout(swal.hideLoading, 500);
        });

        // sync library
        $panel.find('.syncLibrary').click(function () {
            steam.sync();
        });

        // language
        Object.keys(i18n.data).forEach(function (language) {
            $language.append(new Option(i18n.data[language].name, language));
        });
        $panel.find('option[value=' + config.get('language') + ']').prop('selected', true);
        $language.change(function () {
            swal.showLoading();

            var newLanguage = $language.val();
            config.set('language', newLanguage);
            i18n.set();

            setTimeout(swal.hideLoading, 500);
        });
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
        if (result.sbse !== true) {
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

            result.status = status + '/' + statusMsg;

            // get description
            var info = result.purchase_receipt_info;
            var chuncks = [];

            if (info && info.line_items) {
                info.line_items.forEach(function (item) {
                    var chunk = [];

                    if (item.packageid > 0) chunk.push('sub: ' + item.packageid);
                    if (item.appid > 0) chunk.push('app: ' + item.appid);
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
            $('.SBSE_container > textarea').val(_this5.results.concat(keys).join(eol));
        };
        var activateHandler = function activateHandler() {
            var key = keys.shift();

            if (key) {
                if (_this5.isActivated(key)) {
                    _this5.results.push(_this5.resultDetails({
                        sbse: true,
                        key: key,
                        status: i18n.get('skippedStatus') + '/' + i18n.get('activatedDetail'),
                        descripton: i18n.get('noItemDetails')
                    }));
                    updateResults();

                    // next key
                    activateHandler();
                } else if (_this5.isOwned(key) && !config.get('activateAllKeys')) {
                    var detail = _this5.getKeyDetails(key);
                    var description = [];

                    ['app', 'sub'].forEach(function (type) {
                        if (has.call(detail, type)) description.push(type + ': ' + detail[type] + ' ' + detail.title);
                    });

                    _this5.results.push(_this5.resultDetails({
                        sbse: true,
                        key: key,
                        status: i18n.get('skippedStatus') + '/' + i18n.get('failDetailAlreadyOwned'),
                        descripton: description.join()
                    }));
                    updateResults();

                    // next key
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
                        data: 'product_key=' + key + '&sessionid=' + config.get('sessionID'),
                        onload: function onload(res) {
                            if (res.status === 200) {
                                var result = JSON.parse(res.response);

                                // update activated
                                var failCode = result.purchase_result_details;
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
                                var errorMsg = [];

                                errorMsg.push('<pre class="SBSE_errorMsg">');
                                errorMsg.push('sessionID: ' + (config.get('sessionID') + eol));
                                errorMsg.push('autoUpdate: ' + (config.get('autoUpdateSessionID') + eol));
                                errorMsg.push('status: ' + (res.status + eol));
                                errorMsg.push('response: ' + (res.response + eol));
                                errorMsg.push('</pre>');

                                swal({
                                    title: i18n.get('failTitle'),
                                    html: i18n.get('failDetailRequestFailedNeedUpdate') + eol + errorMsg.join(''),
                                    type: 'error'
                                });
                                getSessionID();
                                if (typeof callback === 'function') callback();
                            }
                        }
                    });
                }
            } else if (typeof callback === 'function') callback();
        };

        activateHandler();
    }
};
var getContainer = function getContainer(handlers) {
    var $container = $('\n        <div class="SBSE_container">\n            <textarea></textarea>\n            <div>\n                <button class="SBSE_BtnReveal">' + i18n.get('buttonReveal') + '</button>\n                <button class="SBSE_BtnRetrieve">' + i18n.get('buttonRetrieve') + '</button>\n                <button class="SBSE_BtnActivate">' + i18n.get('buttonActivate') + '</button>\n                <button class="SBSE_BtnCopy">' + i18n.get('buttonCopy') + '</button>\n                <button class="SBSE_BtnReset">' + i18n.get('buttonReset') + '</button>\n                <a class="SBSE_BtnExport">' + i18n.get('buttonExport') + '</a>\n                <label><input type="checkbox" class="SBSE_ChkTitle">' + i18n.get('checkboxIncludeGameTitle') + '</label>\n                <label><input type="checkbox" class="SBSE_ChkJoin">' + i18n.get('checkboxJoinKeys') + '</label>\n                <select class="SBSE_SelFilter">\n                    <option value="All" selected>' + i18n.get('selectFilterAll') + '</option>\n                    <option value="Owned">' + i18n.get('selectFilterOwned') + '</option>\n                    <option value="NotOwned">' + i18n.get('selectFilterNotOwned') + '</option>\n                </select>\n                <button id="SBSE_BtnSettings"> </button>\n            </div>\n        </div>\n    ');

    if (typeof handlers.reveal !== 'function') handlers.reveal = function () {};
    if (typeof handlers.retrieve !== 'function') {
        handlers.retrieve = function () {
            var data = handlers.extract();
            var keys = [];
            var includeTitle = !!$('.SBSE_ChkTitle:checked').length;
            var joinKeys = !!$('.SBSE_ChkJoin:checked').length;
            var selected = $('.SBSE_SelFilter').val() || 'All';
            var skipUsed = !!$('.SBSE_ChkSkipUsed:checked').length;
            var skipMarketListing = !$('.SBSE_ChkMarketListings:checked').length;
            var separator = joinKeys ? ',' : eol;
            var prefix = joinKeys && config.get('joinKeysASFStyle') ? '!redeem ' : '';

            for (var i = 0; i < data.items.length; i += 1) {
                var item = data.items[i];

                if (selected === 'Owned' && !item.owned) continue;
                if (selected === 'NotOwned' && item.owned) continue;
                if (skipUsed && item.used) continue;
                if (skipMarketListing && item.marketListing) continue;

                var temp = [item.key];

                if (includeTitle) temp.unshift(item.title);
                if (config.get('titleComesLast')) temp.reverse();

                keys.push(temp.join(', '));
            }

            $('.SBSE_container > textarea').val(prefix + keys.join(separator));
        };
    }
    if (typeof handlers.activate !== 'function') {
        handlers.activate = function (e) {
            var $textarea = $container.find('textarea');
            var keys = unique($textarea.val().match(regKey));

            if (keys.length > 0) {
                var $activateBtn = $(e.currentTarget);

                $activateBtn.prop('disabled', true).addClass('working');
                $textarea.attr('disabled', '');

                $textarea.val(keys.join(eol));
                activator.activate(keys, function () {
                    $activateBtn.prop('disabled', false).removeClass('working');
                    $textarea.removeAttr('disabled');
                });
            } else $textarea.val(i18n.get('emptyInput'));
        };
    }
    if (typeof handlers.copy !== 'function') {
        handlers.copy = function () {
            $('.SBSE_container > textarea').select();
            document.execCommand('copy');
        };
    }
    if (typeof handlers.reset !== 'function') {
        handlers.reset = function () {
            $('.SBSE_container > textarea').val('');
        };
    }
    if (typeof handlers.export !== 'function') {
        handlers.export = function (e) {
            var data = handlers.extract();

            if (data.items.length > 0) {
                var $exportBtn = $(e.currentTarget);

                $exportBtn.removeAttr('href').removeAttr('download');

                var filename = data.filename.replace(/[\\/:*?"<>|!]/g, '');
                var formattedData = data.items.map(function (line) {
                    var temp = [];

                    if (line.title) temp.push(line.title.replace(/,/g, ' '));
                    temp.push(line.key);

                    return temp.join();
                }).join(eol);

                $exportBtn.attr({
                    href: 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(formattedData),
                    download: filename + '.csv'
                });
            }
        };
    }
    if (typeof handlers.settings !== 'function') {
        handlers.settings = function () {
            settings.display();
        };
    }

    // bind event
    $container.find('button').click(function (e) {
        e.preventDefault();
    });
    $container.find('.SBSE_BtnReveal').click(handlers.reveal);
    $container.find('.SBSE_BtnRetrieve').click(handlers.retrieve);
    $container.find('.SBSE_BtnActivate').click(handlers.activate);
    $container.find('.SBSE_BtnCopy').click(handlers.copy);
    $container.find('.SBSE_BtnReset').click(handlers.reset);
    $container.find('.SBSE_BtnExport').click(handlers.export);
    $container.find('#SBSE_BtnSettings').click(handlers.settings);

    // apply settings
    if (config.get('preselectIncludeTitle')) $container.find('.SBSE_ChkTitle').prop('checked', true);
    if (config.get('preselectJoinKeys')) $container.find('.SBSE_ChkJoin').prop('checked', true);

    return $container;
};
var siteHandlers = {
    indiegala: function indiegala() {
        // inject css
        GM_addStyle('\n            .SBSE_container { margin-top: 10px; }\n            .SBSE_container > textarea { border: 1px solid #CC001D; border-radius: 3px; }\n            .SBSE_container > div > button, .SBSE_container > div > a { width: 100px; background-color: #CC001D; color: white; border-radius: 3px; }\n            .SBSE_container > div > a:hover { color: white; }\n            .swal2-popup .slider { margin: 0; }\n            .SBSE_icon { vertical-align: middle; }\n        ');

        var handlers = {
            extract: function extract() {
                var source = location.pathname === '/profile' ? 'div[id*="_sale_"].collapse.in' : document;
                var bundleTitle = $('[aria-expanded="true"] > div#bundle-title, #bundle-title, #indie_gala_2 > div > span').eq(0).text().trim();
                var data = {
                    title: bundleTitle,
                    filename: 'IndieGala ' + bundleTitle + ' Keys',
                    items: []
                };

                $(source).find('.game-key-string').each(function (i, ele) {
                    var $ele = $(ele);
                    var key = $ele.find('.keys').val();

                    if (key) {
                        var d = JSON.parse($(ele).closest('.SBSE_processed').attr('data-gameinfo') || '{}');

                        if (Object.keys(d).length === 0) {
                            var $a = $ele.find('.title_game > a');
                            var matched = $a.attr('href').match(/steam.+\/(app|sub)\/(\d+)/);

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
            reveal: function reveal(e) {
                var source = location.pathname === '/profile' ? 'div[id*="_sale_"].collapse.in' : document;
                var $revealBtn = $(e.currentTarget);
                var selected = $('.SBSE_SelFilter').val() || 'All';
                var handler = function handler($games, callback) {
                    var game = $games.shift();

                    if (game) {
                        var $game = $(game);
                        var code = $game.attr('id').split('_').pop();
                        var id = $game.attr('onclick').match(/steampowered\.com\/(app|sub)\/(\d+)/)[2];
                        var d = JSON.parse($game.closest('.SBSE_processed').attr('data-gameinfo') || '{}');

                        if (selected === 'All' || selected === 'Owned' && d.owned || selected === 'NotOwned' && !d.owned) {
                            $.ajax({
                                method: 'GET',
                                url: '/myserials/syncget',
                                dataType: 'json',
                                data: {
                                    code: code,
                                    cache: false,
                                    productId: id
                                },
                                beforeSend: function beforeSend() {
                                    $('#permbutton_' + code + ', #fetchlink_' + code + ', #info_key_' + code).hide();
                                    $('#fetching_' + code).fadeIn();
                                    $('#ajax_loader_' + code).show();
                                    $('#container_activate_' + code).html('');
                                },
                                success: function success(data) {
                                    $('#ajax_loader_' + code + ', #fetching_' + code + ', #info_key_' + code).hide();
                                    $('#serial_' + code).fadeIn();
                                    $('#serial_n_' + code).val(data.serial_number);
                                    $game.parent().prev().find('.btn-convert-to-trade').remove();

                                    handler($games, callback);
                                },
                                error: function error() {
                                    swal(i18n.get('failTitle'), i18n.get('failDetailUnexpected'), 'error');
                                }
                            });
                        } else handler($games, callback);
                    } else callback();
                };

                $revealBtn.addClass('working');

                handler($(source).find('a[id^=fetchlink_]'), function () {
                    $revealBtn.removeClass('working');
                    $('.SBSE_BtnRetrieve').click();
                });
            }
        };
        var process = function process() {
            var tooltipsData = [];

            $('.game-key-string').each(function (i, ele) {
                var $ele = $(ele);
                var $a = $ele.find('.title_game > a');
                var d = {
                    title: $a.text().trim()
                };

                var matched = $a.attr('href').match(/steam.+\/(app|sub)\/(\d+)/);
                if (matched) d[matched[1]] = parseInt(matched[2], 10);

                // check if owned & wished
                d.owned = steam.isOwned(d);
                d.wished = steam.isWished(d);

                if (d.owned) $ele.addClass('SBSE_owned');
                if (d.wished) $ele.addClass('SBSE_wished');

                // append icon
                $a.after($('<span class="SBSE_icon"></span>').mouseenter(steamCNTooltip.show.bind(steamCNTooltip)));

                tooltipsData.push(d);

                $ele.attr('data-gameinfo', JSON.stringify(d)).addClass('SBSE_processed isSteam');
            });

            // load SteamCN tooltip
            steamCNTooltip.load(tooltipsData);
        };
        var $container = getContainer(handlers);

        process();

        // insert container
        $('#library-contain').eq(0).before($container);

        // support for new password protected gift page
        var $node = $('#gift-contents');

        if ($node.length > 0) {
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    Array.from(mutation.addedNodes).forEach(function (addedNode) {
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
    fanatical: function fanatical() {
        var _this6 = this;

        // inject css
        GM_addStyle('\n            .SBSE_container { margin-top: 10px; }\n            .SBSE_container > textarea { background-color: #434343; color: #eee; }\n            .SBSE_container > div > button, .SBSE_container > div > a { width: 80px; }\n            .SBSE_container > div > button, .SBSE_container select, .SBSE_container > div > a { border: 1px solid transparent; background-color: #1c1c1c; color: #eee; }\n            .SBSE_container > div > button:hover, .SBSE_container select:hover, .SBSE_container > div > a:hover { color: #A8A8A8; }\n            .SBSE_container > div > a { text-decoration: none; }\n            .SBSE_container label { color: #DEDEDE; }\n            .SBSE_container span { margin-right: 0; margin-left: 10px; float: right; }\n            .SBSE_container span { margin-top: 5px; }\n\n            /* product page */\n            .cardBlock { width: 100%; padding: 0 .875rem 0 .875rem; }\n            .cardBlock > div { padding: 1rem; }\n            .cardBlock .currencyToggler {\n                width: 100%; height: 40px;\n                margin-bottom: 10px;\n                font-size: 20px;\n                border-radius: 3px;\n            }\n            .starDeal { padding: 1rem; }\n            .starDeal > div { display: flex; align-items: center; justify-content: space-evenly; }\n            .starDeal .currencyToggler {\n                width: 300px; height: 40px;\n                font-size: 20px;\n                border-radius: 3px;\n            }\n            .pricingDetail { background-color: transparent; }\n            .pricingDetail th { padding-top: 10px; }\n            .pricingDetail .cheapest { border-bottom: 1px solid #ff9800; font-weight: bold; }\n            .pricingDetail .currency-flag { vertical-align: text-bottom; }\n            .swal2-popup table { background-color: white; }\n            .SBSE_icon { margin-top: -16px; align-self: flex-end; }\n        ');

        var APIData = null;
        var fetchAPIData = function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(s, c) {
                var slug, callback, JSONString, res;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                slug = s;
                                callback = c;

                                if (typeof s === 'function') {
                                    callback = s;
                                    slug = location.href.split('/').pop();
                                }

                                JSONString = GM_getValue('Fanatical-' + slug, '');

                                if (!(JSONString.length === 0)) {
                                    _context.next = 16;
                                    break;
                                }

                                _context.next = 7;
                                return fetch('https://www.fanatical.com/api/products/' + slug);

                            case 7:
                                res = _context.sent;

                                if (!res.ok) {
                                    _context.next = 15;
                                    break;
                                }

                                _context.next = 11;
                                return res.text();

                            case 11:
                                JSONString = _context.sent;


                                GM_setValue('Fanatical-' + slug, JSONString);
                                _context.next = 16;
                                break;

                            case 15:
                                JSONString = '{}';

                            case 16:

                                APIData = JSON.parse(JSONString);

                                if (typeof callback === 'function') callback();

                            case 18:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, _this6);
            }));

            return function fetchAPIData(_x3, _x4) {
                return _ref.apply(this, arguments);
            };
        }();
        var productHandler = function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var language, $priceExt, $currencyToggler, $pricingDetail, selectedCurrency, isStarDeal, starDeal, res, discount, i, $prices;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!(Object.keys(APIData).length > 0)) {
                                    _context2.next = 33;
                                    break;
                                }

                                language = config.get('language');
                                $priceExt = $('\n                    <div class="cardBlock">\n                        <div>\n                            <select class="currencyToggler"></select>\n                            <table class="pricingDetail"></table>\n                        </div>\n                    </div>\n                ');
                                $currencyToggler = $priceExt.find('.currencyToggler');
                                $pricingDetail = $priceExt.find('.pricingDetail');
                                selectedCurrency = GM_getValue('SBSE_selectedCurrency', 'CNY');
                                isStarDeal = !!$('.stardeal-purchase-info').length;
                                starDeal = {};

                                if (!isStarDeal) {
                                    _context2.next = 17;
                                    break;
                                }

                                $priceExt.toggleClass('cardBlock starDeal');

                                // fetch star-deal data
                                _context2.next = 12;
                                return fetch('https://www.fanatical.com/api/star-deal');

                            case 12:
                                res = _context2.sent;

                                if (!res.ok) {
                                    _context2.next = 17;
                                    break;
                                }

                                _context2.next = 16;
                                return res.json();

                            case 16:
                                starDeal = _context2.sent;

                            case 17:

                                Object.keys(xe.currencies).forEach(function (currency) {
                                    var selected = currency === selectedCurrency ? ' selected' : '';

                                    $currencyToggler.append($('<option value="' + currency + '"' + selected + '>' + xe.currencies[currency][language] + '</option>'));
                                });

                                $currencyToggler.change(function () {
                                    xe.update($currencyToggler.val());
                                    GM_setValue('SBSE_selectedCurrency', $currencyToggler.val());
                                });

                                // bundle page
                                APIData.bundles.forEach(function (tier, index) {
                                    if (APIData.bundles.length > 1) $pricingDetail.append('<tr><th colspan="3">Tier ' + (index + 1) + '</th></tr>');
                                    Object.keys(tier.price).forEach(function (currency) {
                                        var value = tier.price[currency];

                                        $pricingDetail.append('\n                            <tr class="tier' + (index + 1) + '">\n                                <td><div class="currency-flag currency-flag-' + currency.toLowerCase() + '"></div></td>\n                                <td>' + (xe.currencies[currency].symbol + value / 100) + '</td>\n                                <td> \u2248 <span class="SBSE_price" data-currency="' + currency + '" data-value="' + value + '"></span></td>\n                            </tr>\n                        ');
                                    });
                                });

                                // game page
                                if (location.href.includes('/game/') || location.href.includes('/dlc/')) {
                                    discount = 1;


                                    if (has.call(APIData, 'current_discount') && new Date(APIData.current_discount.until).getTime() > Date.now()) discount = 1 - APIData.current_discount.percent;

                                    if (isStarDeal) discount = 1 - $('.discount-percent').text().replace(/\D/g, '') / 100;

                                    Object.keys(APIData.price).forEach(function (currency) {
                                        var value = (APIData.price[currency] * discount).toFixed(2);

                                        // if star-deal data loaded successfully
                                        if (has.call(starDeal, 'promoPrice')) value = starDeal.promoPrice[currency];

                                        $pricingDetail.append('\n                            <tr class="tier1">\n                                <td><div class="currency-flag currency-flag-' + currency.toLowerCase() + '"></div></td>\n                                <td>' + (xe.currencies[currency].symbol + (value / 100).toFixed(2)) + '</td>\n                                <td> \u2248 <span class="SBSE_price" data-currency="' + currency + '" data-value="' + value + '"></span></td>\n                            </tr>\n                        ');
                                    });
                                }

                                $('.product-commerce-container').append($priceExt);
                                $('.stardeal-purchase-info').after($priceExt);
                                xe.update(selectedCurrency);

                                // highlight the cheapest
                                i = 1;

                            case 25:
                                if (!(i < 10)) {
                                    _context2.next = 33;
                                    break;
                                }

                                $prices = $('.tier' + i + ' .SBSE_price');

                                if (!($prices.length === 0)) {
                                    _context2.next = 29;
                                    break;
                                }

                                return _context2.abrupt('break', 33);

                            case 29:

                                $($prices.toArray().sort(function (a, b) {
                                    return a.textContent.replace(/\D/g, '') - b.textContent.replace(/\D/g, '');
                                }).shift()).closest('tr').addClass('cheapest');

                            case 30:
                                i += 1;
                                _context2.next = 25;
                                break;

                            case 33:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, _this6);
            }));

            return function productHandler() {
                return _ref2.apply(this, arguments);
            };
        }();
        var handlers = {
            extract: function extract() {
                var bundleTitle = $('h5').eq(0).text().trim();
                var data = {
                    title: bundleTitle,
                    filename: 'Fanatical ' + bundleTitle + ' Keys',
                    items: []
                };

                $('.account-content dl:has(input)').each(function (i, dl) {
                    var $dl = $(dl);
                    var key = $dl.find('input').val();

                    if (key) {
                        var d = JSON.parse($dl.closest('.SBSE_processed').attr('data-gameinfo') || '{}');

                        if (Object.keys(d).length === 0) {
                            d.title = $dl.find('dd').eq(1).text().trim();
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
                var selected = $('.SBSE_SelFilter').val() || 'All';
                var handler = function handler($games, callback) {
                    var game = $games.shift();

                    if (game) {
                        var d = JSON.parse($(game).closest('.SBSE_processed').attr('data-gameinfo') || '{}');

                        if (selected === 'All' || selected === 'Owned' && d.owned || selected === 'NotOwned' && !d.owned) {
                            game.click();
                            setTimeout(handler.bind(null, $games, callback), 300);
                        } else setTimeout(handler.bind(null, $games, callback), 1);
                    } else setTimeout(callback, 500);
                };

                $revealBtn.addClass('working');

                handler($('.account-content dl button'), function () {
                    $revealBtn.removeClass('working');
                    $('.SBSE_BtnRetrieve').click();
                });
            }
        };
        var process = function process($node) {
            var title = $node.find('h5').eq(0).text();
            var slug = title.trim().toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');

            // empty textarea
            $('.SBSE_container textarea').val('');

            if (slug.length > 0) {
                fetchAPIData(slug, function () {
                    if (Object.keys(APIData).length > 0) {
                        var tooltipsData = [];
                        var matchGame = function matchGame(data) {
                            if (has.call(data, 'steam') && data.steam.id) {
                                var $gameTitle = $node.find('dd > div:contains(' + data.name + ')').filter(function (index, name) {
                                    return data.name === name.textContent.trim();
                                });
                                var $dl = $gameTitle.closest('dl');
                                var d = {
                                    title: data.name,
                                    app: parseInt(data.steam.id, 10)
                                };

                                d.owned = steam.isOwned(d);
                                d.wished = steam.isWished(d);

                                // check if owned & wished
                                if (d.owned) $dl.addClass('SBSE_owned');
                                if (d.wished) $dl.addClass('SBSE_wished');

                                // wrap link
                                $gameTitle.contents().filter(function (i, n) {
                                    return n.nodeType === 3;
                                }).wrap('<a href="http:www.steampowered.com/app/' + data.steam.id + '/"></a>');

                                // insert filler
                                if ($gameTitle.find('.drm-container-steam').length === 0) {
                                    $gameTitle.append('<div class="drm-container-steam"></div>');
                                }

                                // append icon
                                $gameTitle.append($('<span class="SBSE_icon"></span>').mouseenter(steamCNTooltip.show.bind(steamCNTooltip)));

                                tooltipsData.push(d);

                                $dl.addClass('SBSE_processed isSteam').attr('data-gameinfo', JSON.stringify(d));
                            }
                        };

                        matchGame(APIData);
                        APIData.bundles.forEach(function (tier) {
                            tier.games.forEach(matchGame);
                        });

                        // load SteamCN tooltip
                        steamCNTooltip.load(tooltipsData);
                    }
                });
            }
        };
        var $container = getContainer(handlers);

        $container.find('button').addClass('narrow'); // narrow buttons
        $container.find('a').attr('href', ''); // dodge from master css selector

        new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                Array.from(mutation.addedNodes).filter(function (x) {
                    return x.nodeType === 1;
                }).forEach(function (node) {
                    var $node = $(node);

                    // url changed
                    if (node.matches('[property="og:url"]')) {
                        var currentURL = location.href;

                        if (currentURL.includes('/orders/')) {
                            // insert container
                            var $anchor = $('h3:contains(Order Keys)');

                            if ($('.SBSE_container').length === 0 && $anchor.length > 0) $anchor.eq(0).before($container);
                        }
                        if (currentURL.includes('/bundle/') || currentURL.includes('/game/') || currentURL.includes('/dlc/')) fetchAPIData(productHandler);
                    }

                    // order contents loaded
                    if ($node.find('dl').length > 0) process($node);
                });
            });
        }).observe($('html')[0], {
            childList: true,
            subtree: true
        });
    },
    humblebundle: function humblebundle() {
        var _this7 = this;

        // inject css
        GM_addStyle('\n            .SBSE_container > div { position: relative; }\n            .SBSE_container > textarea {\n                border: 1px solid #CFCFCF;\n                border-radius: 5px;\n                color: #4a4c45;\n                text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);\n            }\n            .SBSE_container > div > button, .SBSE_container > div > a {\n                width: 70px;\n                border: 1px solid #C9CCD3;\n                border-radius: 3px;\n                background-color: #C5C5C5;\n                background: linear-gradient(to top, #cacaca, #e7e7e7);\n                color: #4a4c45 !important;\n            }\n            .SBSE_container > div > button:hover, .SBSE_container > div > a:hover {\n                border: 1px solid #b7bac0;\n                background-color: #fafcff;\n                color: #555961 !important;\n            }\n            .SBSE_container > div > button.narrow.working { width: 76px; padding-right: 36px; }\n            #SBSE_BtnSettings { position: absolute; right: 0; }\n            .SBSE_owned .sr-unredeemed-steam-button {\n                background-color: #F3F3F3;\n                background: linear-gradient(to top, #E8E8E8, #F6F6F6);\n            }/*\n            .SBSE_owned .heading-text h4 > span:not(.steam-owned):last-child::after {\n                content: \'\\f085\';\n                font-family: hb-icons;\n                color: #17A1E5;\n            }*/\n            .SBSE_activationRestrictions { float: right; margin-right: 5px; cursor: pointer; }\n            .swal2-icon-text { font-size: inherit; }\n            .flag-icon { width: 4em; height: 3em; border-radius: 3px; }\n            .flag-icon-unknown { border: 1px solid; text-align: center; line-height: 3em; }\n        ');

        var atDownload = location.pathname === '/downloads';
        var fetchKey = function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3($node, machineName, callback) {
                var res, d;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return fetch('https://www.humblebundle.com/humbler/redeemkey', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                                        Origin: 'https://www.humblebundle.com',
                                        Referer: location.href
                                    },
                                    body: 'keytype=' + machineName + '&key=' + unsafeWindow.gamekeys[0] + '&keyindex=0',
                                    credentials: 'same-origin'
                                });

                            case 2:
                                res = _context3.sent;

                                if (!res.ok) {
                                    _context3.next = 10;
                                    break;
                                }

                                _context3.next = 6;
                                return res.json();

                            case 6:
                                d = _context3.sent;


                                if (d.success) {
                                    $node.closest('.container').html('\n                        <div title="' + d.key + '" class="keyfield redeemed">\n                            <div class="keyfield-value">' + d.key + '</div>\n                            <a class="steam-redeem-button" href="https://store.steampowered.com/account/registerkey?key=' + d.key + '" target="_blank">\n                                <div class="steam-redeem-text">Redeem</div>\n                                <span class="tooltiptext">Redeem on Steam</span>\n                            </a>\n                            <div class="spinner"></div>\n                        </div>\n                    ');
                                } else swal(i18n.get('failTitle'), JSON.stringify(d), 'error');
                                _context3.next = 11;
                                break;

                            case 10:
                                $node.click();

                            case 11:
                                if (typeof callback === 'function') callback();

                            case 12:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, _this7);
            }));

            return function fetchKey(_x5, _x6, _x7) {
                return _ref3.apply(this, arguments);
            };
        }();
        var handlers = {
            extract: function extract() {
                var bundleTitle = $('title').text().split(' (').shift();
                var data = {
                    title: bundleTitle,
                    filename: 'Humble Bundle ' + bundleTitle + ' Keys',
                    items: []
                };

                $('.keyfield.redeemed .keyfield-value').each(function (i, ele) {
                    var $ele = $(ele);
                    var key = $ele.text().trim();

                    if (key) {
                        var d = JSON.parse($ele.closest('.SBSE_processed').attr('data-gameinfo') || '{}');

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
                var selected = $('.SBSE_SelFilter').val() || 'All';
                var handler = function handler($games, callback) {
                    var game = $games.shift();

                    if (game) {
                        var $game = $(game);
                        var machineName = $game.closest('.key-redeemer').attr('data-machineName');
                        var d = JSON.parse($(game).closest('.SBSE_processed').attr('data-gameinfo') || '{}');

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

                $revealBtn.addClass('working');

                handler($('.key-redeemer.isSteam .keyfield:not(.redeemed)'), function () {
                    $revealBtn.removeClass('working');
                    $('.SBSE_BtnRetrieve').click();
                });
            }
        };
        var process = function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4($node) {
                var gameKey, json, res, data, tooltipsData;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                gameKey = unsafeWindow.gamekeys[0] || location.href.split('key=').pop().split('&').shift();
                                json = GM_getValue(gameKey, '');

                                if (!(json.length === 0)) {
                                    _context4.next = 10;
                                    break;
                                }

                                _context4.next = 5;
                                return fetch('https://www.humblebundle.com/api/v1/order/' + gameKey + '?all_tpkds=true', {
                                    method: 'GET',
                                    credentials: 'same-origin'
                                });

                            case 5:
                                res = _context4.sent;

                                if (!res.ok) {
                                    _context4.next = 10;
                                    break;
                                }

                                _context4.next = 9;
                                return res.text();

                            case 9:
                                json = _context4.sent;

                            case 10:
                                _context4.prev = 10;
                                data = JSON.parse(json);
                                tooltipsData = [];


                                data.tpkd_dict.all_tpks.forEach(function (game) {
                                    var $keyRedeemer = $node.find('.key-redeemer:has(.heading-text[data-title="' + game.human_name + '"])');

                                    if ($keyRedeemer.length > 0) {
                                        if (game.key_type === 'steam') {
                                            $keyRedeemer.addClass('isSteam');

                                            var d = {
                                                title: game.human_name,
                                                app: parseInt(game.steam_app_id, 10)
                                            };

                                            d.owned = steam.isOwned(d);
                                            d.wished = steam.isWished(d);

                                            // apply owned effect on game title
                                            if (d.owned) $keyRedeemer.addClass('SBSE_owned');
                                            if (d.wished) $keyRedeemer.addClass('SBSE_wished');

                                            // store data
                                            $keyRedeemer.attr({
                                                'data-machineName': game.machine_name,
                                                'data-humanName': game.human_name,
                                                'data-gameinfo': JSON.stringify(d)
                                            });

                                            tooltipsData.push(d);
                                        }

                                        // activation restrictions
                                        var html = '';
                                        var disallowed = game.disallowed_countries.map(function (c) {
                                            return ISO2.get(c);
                                        });
                                        var exclusive = game.exclusive_countries.map(function (c) {
                                            return ISO2.get(c);
                                        });
                                        var separator = config.get('language').includes('chinese') ? '、' : ', ';

                                        if (disallowed.length > 0) html += '<p>' + i18n.get('HBDisallowedCountries') + '<br>' + disallowed.join(separator) + '</p>';
                                        if (exclusive.length > 0) html += '<p>' + i18n.get('HBExclusiveCountries') + '<br>' + exclusive.join(separator) + '</p>';
                                        if (disallowed.length > 0 || exclusive.length > 0) {
                                            $('<span class="SBSE_activationRestrictions">' + i18n.get('HBActivationRestrictions') + '</span>').click(function () {
                                                swal({
                                                    title: game.human_name + '<br>' + i18n.get('HBActivationRestrictions'),
                                                    html: html,
                                                    type: 'info'
                                                });
                                            }).insertBefore($keyRedeemer.find('.heading-text > h4'));
                                        }

                                        $keyRedeemer.addClass('SBSE_processed');
                                    }
                                });

                                // override default popups
                                document.addEventListener('click', function (e) {
                                    var $target = $(e.target).closest('.keyfield:not(.redeemed)');
                                    var $keyRedeemer = $target.closest('.key-redeemer.isSteam');
                                    var machineName = $keyRedeemer.attr('data-machineName');

                                    if ($target.length > 0 && $keyRedeemer.length > 0 && machineName) {
                                        e.stopPropagation();

                                        if ($keyRedeemer.hasClass('SBSE_owned')) {
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
                                }, true);

                                // load SteamCN tooltip
                                steamCNTooltip.load(tooltipsData);
                                _context4.next = 21;
                                break;

                            case 18:
                                _context4.prev = 18;
                                _context4.t0 = _context4['catch'](10);
                                throw _context4.t0;

                            case 21:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, _this7, [[10, 18]]);
            }));

            return function process(_x8) {
                return _ref4.apply(this, arguments);
            };
        }();
        var $container = getContainer(handlers);
        var $keyManager = $('.js-key-manager-holder');

        // narrow buttons
        $container.find('div > button').addClass('narrow');

        // at home page
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

            observer.observe($keyManager[0], { childList: true });
            // at download page
        } else {
            var _observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    Array.from(mutation.addedNodes).forEach(function () {
                        var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(addedNode) {
                            var $node;
                            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                                while (1) {
                                    switch (_context5.prev = _context5.next) {
                                        case 0:
                                            $node = $(addedNode);


                                            if ($node.hasClass('key-list') || $node.find('.key-list').length > 0) {
                                                _observer.disconnect();
                                                $node.closest('.whitebox-redux').before($container);

                                                // fetch game heading & wrap heading
                                                $node.find('.heading-text > h4').each(function (i, heading) {
                                                    heading.parentElement.dataset.title = heading.innerText.trim();
                                                    $(heading.firstChild).wrap('<span/>');
                                                    $(heading).append($('<span class="SBSE_icon"></span>').mouseenter(steamCNTooltip.show.bind(steamCNTooltip)));
                                                });

                                                // fetch & process key data
                                                process($node);
                                            }

                                        case 2:
                                        case 'end':
                                            return _context5.stop();
                                    }
                                }
                            }, _callee5, _this7);
                        }));

                        return function (_x9) {
                            return _ref5.apply(this, arguments);
                        };
                    }());
                });
            });

            _observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        // append user's region
        var countryCode = unsafeWindow.models.request.country_code;

        if (countryCode) {
            var code = countryCode.toLowerCase();
            var countryName = ISO2.get(countryCode);
            var $flag = $('<span class="flag-icon flag-icon-unknown" tooltip="' + i18n.get('HBCurrentLocation') + '?"></span>');

            if (GM_getResourceText('flagIcon').includes(code + '.svg')) {
                $flag.toggleClass('flag-icon-unknown flag-icon-' + code).attr('tooltip', i18n.get('HBCurrentLocation') + countryName);
            } else $flag.text('?');

            $('.navbar-content').prepend($flag);
        }
    },
    dailyindiegame: function dailyindiegame() {
        var _this8 = this;

        var MPHideList = JSON.parse(GM_getValue('SBSE_DIGMPHideList') || '[]');
        var pathname = location.pathname;

        if (pathname.includes('/account_page') || pathname.includes('/account_update')) {
            // force sync library
            steam.sync(false);

            // inject css
            GM_addStyle('\n                .SBSE_container { padding: 5px; border: 1px solid #424242; }\n                .SBSE_container > textarea { border: 1px solid #000; }\n                .SBSE_container > div > button {\n                    border: none;\n                    background-color: #FD5E0F;\n                    color: rgb(49, 49, 49);\n                    font-family: Ropa Sans;\n                    font-size: 15px;\n                    font-weight: 600;\n                }\n            ');

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

                    $('.quickaction').val(1);
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
            var $container = getContainer(handlers);

            $container.find('.SBSE_SelFilter').hide(); // hide filter selector
            $container.find('.SBSE_BtnExport').remove(); // remove export button
            $container.find('#SBSE_BtnSettings').before('\n                <label><input type="checkbox" class="SBSE_ChkMarketListings">' + i18n.get('checkboxMarketListings') + '</label>\n            '); // append checkbox for market keys

            $('#TableKeys').eq(0).before($container);

            // rate all positive
            var $awaitRatings = $('a[href^="account_page_0_ratepositive"]');

            if ($awaitRatings.length > 0) {
                $('#TableKeys td:contains(Rate TRADE)').text(i18n.get('DIGRateAllPositive')).css('cursor', 'pointer').click(function () {
                    $awaitRatings.each(function () {
                        var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(i, a) {
                            var res;
                            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                                while (1) {
                                    switch (_context6.prev = _context6.next) {
                                        case 0:
                                            _context6.next = 2;
                                            return fetch(a.href, {
                                                method: 'GET',
                                                credentials: 'same-origin'
                                            });

                                        case 2:
                                            res = _context6.sent;


                                            if (res.ok) $(a).parent('td').html('<span class="DIG3_14_Orange">Positive</span>');

                                        case 4:
                                        case 'end':
                                            return _context6.stop();
                                    }
                                }
                            }, _callee6, _this8);
                        }));

                        return function (_x10, _x11) {
                            return _ref6.apply(this, arguments);
                        };
                    }());
                });
            }
            // DIG EasyBuy
        } else if (pathname.includes('/account_digstore') || pathname.includes('/account_trades') || pathname.includes('/account_tradesXT') || pathname.includes('/store_update') || pathname.includes('/storeXT_update')) {
            // inject css styles
            GM_addStyle('\n                .DIGEasyBuy_row { height: 30px; }\n                .DIGEasyBuy button { padding: 4px 8px; outline: none; cursor: pointer; }\n                .DIGEasyBuy_checked { background-color: #222; }\n                .DIGEasyBuy_hideOwned tr.SBSE_hide { display: none; }\n                .DIGEasyBuy_hideOwned tr.SBSE_hide + .SBSE_searchResults { display: none; }\n                .SBSE_searchResults td { padding: 0 }\n                .SBSE_searchResults iframe {\n                    width: 100%; height: 300px;\n                    display: none;\n                    background-color: white;\n                    border: none;\n                }\n                .SBSE_owned a[href*="steam"] .DIG3_14_Gray { color: #9ccc65; }\n                .SBSE_wished a[href*="steam"] .DIG3_14_Gray { color: #29b6f6; }\n                .SBSE_ignored a[href*="steam"] .DIG3_14_Gray { text-decoration: line-through;}\n                #form3 #sortby { width: 250px; }\n            ');

            // setup row data & event
            var easyBuySetup = function easyBuySetup(i, ele) {
                var $game = $(ele);
                var $row = $game.closest('tr');

                $row.attr('data-id', $game.attr('href').replace(/\D/g, ''));
                $row.attr('data-price', parseInt($row.find('td:contains(DIG Points)').text(), 10) || 0);
                $row.click(function () {
                    $row.toggleClass('DIGEasyBuy_checked');
                });
                $row.addClass('DIGEasyBuy_row');
            };

            $('a[href^="account_buy"]').each(easyBuySetup);

            // check if owned / manually hid
            var check = function check(i, a) {
                var $a = $(a);
                var $tr = $a.closest('tr');
                var data = a.pathname.slice(1).split('/');
                var steamID = parseInt(data[1], 10);
                var id = parseInt($tr.attr('data-id'), 10);
                var d = _defineProperty({}, data[0], steamID);

                if (steam.isOwned(d)) $tr.addClass('SBSE_owned SBSE_hide');
                if (steam.isWished(d)) $tr.addClass('SBSE_wished');
                if (steam.isIgnored(d)) $tr.addClass('SBSE_ignored');
                if (MPHideList.includes(id)) $tr.addClass('SBSE_hide');

                // append manual hide feature
                $tr.children().eq(0).attr('title', i18n.get('DIGClickToHideThisRow')).click(function (e) {
                    e.stopPropagation();

                    if (id > 0) {
                        MPHideList.push(id);
                        GM_setValue('SBSE_DIGMPHideList', JSON.stringify(MPHideList));

                        $tr.addClass('SBSE_hide');
                    }
                });

                // no appID found, pre-load Google search result
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
                        url: 'https://www.google.com/search?q=steam+' + gameTitle,
                        onload: function onload(res) {
                            var html = res.responseText;

                            // inset style
                            var index = html.indexOf('</head>');
                            var style = '\n                                <style>\n                                    body { overflow-x: hidden; }\n                                    .sfbgx, #sfcnt, #searchform, #top_nav, #appbar, #taw { display: none; }\n                                    #center_col { margin-left: 0 !important; }\n                                </style>\n                            ';
                            html = html.slice(0, index) + style + html.slice(index);

                            // stripe script tags
                            html = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');

                            // manipulate urls
                            html = html.replace(/\/images\//g, 'https://www.google.com/images/').replace(/\/url\?/g, 'https://www.google.com/url?');

                            $tr.after('\n                                <tr class="SBSE_searchResults">\n                                    <td colspan="11"><iframe sandbox="allow-scripts" srcdoc=\'' + html.replace(/[&<>"']/g, function (m) {
                                return map[m];
                            }) + '\'></frame></td>\n                                </tr>\n                            ');
                        }
                    });

                    $game.unwrap('a').css({
                        cursor: 'pointer',
                        color: 'red'
                    }).click(function (e) {
                        e.stopPropagation();

                        $tr.next('.SBSE_searchResults').find('iframe').slideToggle('fast');
                    });
                }
            };

            $('tr a[href*="steampowered"]').each(check);

            // append menu buttons
            var $target = $('#form3').closest('tr').children().eq(0);
            var $DIGEasyBuy = $('\n                <div class="DIGEasyBuy">\n                    <button class="DIGButtonPurchase DIG3_Orange_15_Form">' + i18n.get('DIGEasyBuyPurchase') + '</button>\n                    <button class="DIGButtonSelectAll DIG3_Orange_15_Form">' + i18n.get('DIGEasyBuySelectAll') + '</button>\n                    <button class="DIGButtonHideOwned DIG3_Orange_15_Form">' + i18n.get('DIGEasyBuyHideOwned') + '</button>\n                </div>\n            ');

            if ($target.children().length > 0) {
                var $tr = $('<tr/>');

                $tr.append($target.clone());
                $target.parent().before($tr);
            }

            $target.empty().append($DIGEasyBuy);

            if (pathname === '/account_tradesXT.html') {
                $DIGEasyBuy.append('\n                    <button class="DIGButtonLoadAllPages DIG3_Orange_15_Form">' + i18n.get('DIGEasyBuyLoadAllPages') + '</button>\n                ');
            }

            // append sync time and event
            var seconds = Math.round((Date.now() - steam.lastSync()) / 1000);

            $DIGEasyBuy.append('\n                <span> ' + i18n.get('lastSyncTime').replace('%seconds%', seconds) + '</span>\n            ');

            // bind button event
            $('.DIGButtonPurchase').click(function (e) {
                var bought = 0;
                var balance = parseInt($('div:contains(Usable DIG Points) > span').text().split(' ').shift().replace(/\D/g, ''), 10);
                var $self = $(e.currentTarget);

                $self.prop('disabled', true).text(i18n.get('DIGButtonPurchasing'));

                $('.DIGEasyBuy_checked').each(function () {
                    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(i, ele) {
                        var $ele, id, price, url, requestInit, res;
                        return regeneratorRuntime.wrap(function _callee7$(_context7) {
                            while (1) {
                                switch (_context7.prev = _context7.next) {
                                    case 0:
                                        $ele = $(ele);
                                        id = $ele.data('id');
                                        price = parseInt($ele.data('price'), 10);

                                        if (!(id && price > 0)) {
                                            _context7.next = 15;
                                            break;
                                        }

                                        if (!(balance - price > 0)) {
                                            _context7.next = 14;
                                            break;
                                        }

                                        url = location.origin + '/account_buy.html';
                                        requestInit = {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                            body: 'quantity=1&xgameid=' + id + '&xgameprice1=' + price + '&send=Purchase',
                                            mode: 'same-origin',
                                            credentials: 'same-origin',
                                            cache: 'no-store',
                                            referrer: location.origin + '/account_buy_' + id + '.html'
                                        };


                                        if (pathname === '/account_trades.html' || pathname === '/account_tradesXT.html') {
                                            url = location.origin + '/account_buytrade_' + id + '.html';
                                            requestInit.body = 'gameid=' + id + '&send=Purchase';
                                            requestInit.referrer = url;
                                        }

                                        _context7.next = 10;
                                        return fetch(url, requestInit);

                                    case 10:
                                        res = _context7.sent;


                                        if (res.ok) {
                                            $ele.click();
                                            bought += 1;
                                            balance -= price;
                                        }
                                        _context7.next = 15;
                                        break;

                                    case 14:
                                        swal({
                                            title: i18n.get('failTitle'),
                                            text: i18n.get('DIGInsufficientFund'),
                                            type: 'error'
                                        }).then(function () {
                                            window.location = location.origin + '/account_page.html';
                                        });

                                    case 15:
                                    case 'end':
                                        return _context7.stop();
                                }
                            }
                        }, _callee7, _this8);
                    }));

                    return function (_x12, _x13) {
                        return _ref7.apply(this, arguments);
                    };
                }());

                if (bought) window.location = location.origin + '/account_page.html';else $self.prop('disabled', false).text(i18n.get('DIGButtonPurchase'));
            });
            $('.DIGButtonSelectAll').click(function (e) {
                var $self = $(e.currentTarget);
                var state = !$self.data('state');
                var selector = $('.DIGEasyBuy_hideOwned').length > 0 ? '.DIGEasyBuy_row:not(.SBSE_hide)' : '.DIGEasyBuy_row';

                $(selector).toggleClass('DIGEasyBuy_checked', state);
                $self.data('state', state);
                $self.text(state ? i18n.get('DIGEasyBuySelectCancel') : i18n.get('DIGEasyBuySelectAll'));
            });
            $('.DIGButtonHideOwned').click(function (e) {
                var $self = $(e.currentTarget);
                var state = !$self.data('state');

                $('#TableKeys').toggleClass('DIGEasyBuy_hideOwned', state);
                $self.data('state', state);
                $self.text(state ? i18n.get('DIGEasyBuyShowOwned') : i18n.get('DIGEasyBuyHideOwned'));
            });
            $('.DIGButtonLoadAllPages').click(function (e) {
                // auto load all pages at marketplace
                var $self = $(e.currentTarget);
                var $tbody = $('#TableKeys > tbody');
                var load = function () {
                    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(page) {
                        var retry = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                        var res, $result;
                        return regeneratorRuntime.wrap(function _callee8$(_context8) {
                            while (1) {
                                switch (_context8.prev = _context8.next) {
                                    case 0:
                                        $self.text(i18n.get('DIGEasyBuyLoading').replace('%page%', page));

                                        _context8.next = 3;
                                        return fetch(location.origin + '/account_tradesXT_' + page + '.html', {
                                            method: 'GET',
                                            credentials: 'same-origin'
                                        });

                                    case 3:
                                        res = _context8.sent;

                                        if (!res.ok) {
                                            _context8.next = 13;
                                            break;
                                        }

                                        _context8.t0 = $;
                                        _context8.next = 8;
                                        return res.text();

                                    case 8:
                                        _context8.t1 = _context8.sent;
                                        $result = (0, _context8.t0)(_context8.t1).find('#TableKeys tr.DIG3_14_Gray');


                                        if ($result.length > 0) {
                                            $result.find('a[href^="account_buy"]').each(easyBuySetup);
                                            $result.find('a[href*="steampowered"]').each(check);
                                            $tbody.append($result);
                                            load(page + 1);
                                        } else $self.text(i18n.get('DIGEasyBuyLoadingComplete'));
                                        _context8.next = 14;
                                        break;

                                    case 13:
                                        if (retry < 3) load(page, retry + 1);else load(page + 1);

                                    case 14:
                                    case 'end':
                                        return _context8.stop();
                                }
                            }
                        }, _callee8, _this8);
                    }));

                    return function load(_x14) {
                        return _ref8.apply(this, arguments);
                    };
                }();

                load(1);
                $self.prop('disabled', true);
            });
            // extension for creating trade at market place
        } else if (pathname === '/account_createtrade.html') {
            var $form = $('#form_createtrade');

            // create trade page
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
                });

                // search for current market price when click dropdown menu
                var $searchResult = $('<div/>');

                $gameTitle.closest('table').after($searchResult);
                $searchResult.before('<h3>' + i18n.get('DIGMarketSearchResult') + '</h3>');

                $('.tt-dropdown-menu').click(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
                    var res, result;
                    return regeneratorRuntime.wrap(function _callee9$(_context9) {
                        while (1) {
                            switch (_context9.prev = _context9.next) {
                                case 0:
                                    $searchResult.empty();

                                    _context9.next = 3;
                                    return fetch(location.origin + '/account_tradesXT.html', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                        body: 'search=' + encodeURIComponent($gameTitle.val()).replace(/%20/g, '+') + '&button=SEARCH',
                                        credentials: 'same-origin'
                                    });

                                case 3:
                                    res = _context9.sent;

                                    if (!res.ok) {
                                        _context9.next = 12;
                                        break;
                                    }

                                    _context9.t1 = $;
                                    _context9.next = 8;
                                    return res.text();

                                case 8:
                                    _context9.t2 = _context9.sent;
                                    _context9.t0 = (0, _context9.t1)(_context9.t2).find('#TableKeys');
                                    _context9.next = 13;
                                    break;

                                case 12:
                                    _context9.t0 = 'Network response was not ok.';

                                case 13:
                                    result = _context9.t0;


                                    $searchResult.append(result);

                                case 15:
                                case 'end':
                                    return _context9.stop();
                            }
                        }
                    }, _callee9, _this8);
                })));

                // apply last input price
                var lastPrice = GM_getValue('SBSE_DIGLastPrice', 20);
                var $priceField = $('input[name=price]');

                $priceField.val(lastPrice).trigger('input');
                $('#form_createtrade').submit(function () {
                    var price = parseInt($priceField.val(), 10);

                    if (price !== lastPrice) GM_setValue('SBSE_DIGLastPrice', price);
                });
                // result page
            } else {
                GM_addStyle('\n                    .check.icon {\n                        width: 42px; height: 24px;\n                        margin: 12px 0 5px 9px;\n                        border-bottom: solid 3px currentColor;\n                        border-left: solid 3px currentColor;\n                        transform: rotate(-45deg);\n                        color: #5cb85c;\n                    }\n                    .remove.icon { color: #d9534f; margin-left: 9px; margin-top: 30px; }\n                    .remove.icon:before, .remove.icon:after {\n                        width: 45px; height: 3px;\n                        position: absolute;\n                        content: \'\';\n                        background-color: currentColor;\n                        transform: rotate(45deg);\n                    }\n                    .remove.icon:after { transform: rotate(-45deg); }\n                ');

                var $anchor = $('td.DIG3_14_Gray > table:first-child');
                var IsSucceed = !!$('td.DIG3_14_Gray:contains("The game key has been added to the DIG MarketPlace.")').length;

                if (IsSucceed) $anchor.after('<div class="check icon"></div>');else $anchor.after('<div class="remove icon"></div>');
            }
        }
    },
    ccyycn: function ccyycn() {
        // inject css
        GM_addStyle('\n            .SBSE_container {\n                width: 80%;\n                margin: 0 auto;\n                font-size: 16px;\n                color: #000;\n            }\n            .SBSE_container > textarea {\n                background-color: #EEE;\n                box-shadow: 0 0 1px 1px rgba(204,204,204,0.5);\n                border-radius: 5px;\n            }\n            .SBSE_container > div { text-align: left; }\n            .SBSE_container > div > button, .SBSE_container > div > a {\n                width: 80px;\n                border: 1px solid #2e6da4;\n                border-radius: 5px;\n                background-color: #337ab7;\n                color: #FFF;\n            }\n            .SBSE_container > div > a:hover { text-decoration: none; opacity: 0.9; }\n            .SBSE_container label { color: #EEE; }\n            .expanded .showOrderMeta {\n                display: block !important;\n                position: absolute;\n                margin-top: -8px;\n                right: 265px;\n                z-index: 1;\n            }\n        ');

        var handlers = {
            extract: function extract() {
                var data = {
                    title: 'CCYYCN Bundle',
                    filename: 'CCYYCN Bundle',
                    items: []
                };

                $('.deliver-gkey:contains(-)').each(function (i, ele) {
                    var $ele = $(ele);
                    var d = {
                        title: $ele.parent().prev().text().trim(),
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

                $revealBtn.addClass('working');

                handler($('.deliver-btn'), function () {
                    $revealBtn.removeClass('working');
                    $('.SBSE_BtnRetrieve').click();
                });
            }
        };
        var $container = getContainer(handlers);

        $container.find('.SBSE_SelFilter').hide(); // hide filter selector
        $container.find('button').addClass('narrow'); // narrow buttons

        // insert textarea
        $('.featurette-divider').eq(0).after($container);
    },
    groupees: function groupees() {
        var _this9 = this;

        if (location.pathname.startsWith('/profile/')) {
            // inject css
            GM_addStyle('\n                .SBSE_container > textarea, .SBSE_container > div > button, .SBSE_container > div > a {\n                    background: transparent;\n                    border: 1px solid #8cc53f;\n                    border-radius: 3px;\n                    color: #8cc53f;\n                    transition: all 0.8s ease;\n                }\n                .SBSE_container > div > button:hover, .SBSE_container > div > a:hover {\n                    background-color: #8cc53f;\n                    color: white;\n                    text-decoration: none;\n                }\n                img.product-cover { display: none; }\n            ');
            var handlers = {
                extract: function extract() {
                    var bundleTitle = $('h2').text().trim();
                    var data = {
                        title: bundleTitle,
                        filename: 'Groupees ' + bundleTitle + ' Keys',
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

                    $revealBtn.addClass('working');

                    var $reveals = $('.product:has(img[title*=Steam]) .reveal-product');
                    var timer = $reveals.length > 0 ? 1500 : 0;

                    $reveals.click();
                    setTimeout(function () {
                        handler($('.btn-reveal-key'), function () {
                            $revealBtn.removeClass('working');
                            $('.SBSE_BtnRetrieve').click();
                        });
                    }, timer);
                }
            };
            var $container = getContainer(handlers);

            $container.find('.SBSE_SelFilter').hide(); // hide filter selector

            // append checkbox for used-key
            $('#SBSE_BtnSettings').before('\n                <label><input type="checkbox" class="SBSE_ChkSkipUsed" checked>' + i18n.get('checkboxSkipUsed') + '</label>\n            ');

            // insert container
            $('.table-products').before($container);

            // load details
            $('img[src*="steam.svg"]').each(function () {
                var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(index, ele) {
                    return regeneratorRuntime.wrap(function _callee10$(_context10) {
                        while (1) {
                            switch (_context10.prev = _context10.next) {
                                case 0:
                                    $.ajax({
                                        url: $(ele).closest('tr').find('.item-link').attr('href'),
                                        data: { v: 1 },
                                        dataType: 'script'
                                    });

                                case 1:
                                case 'end':
                                    return _context10.stop();
                            }
                        }
                    }, _callee10, _this9);
                }));

                return function (_x16, _x17) {
                    return _ref10.apply(this, arguments);
                };
            }());

            // bind custom event
            $(document).on('activated', function (e, key, result) {
                if (result.success === 1) $('.btn-steam-redeem[href*=' + key + ']').next('.key-usage-toggler').click();
            });
        } else {
            // inject css
            GM_addStyle('\n                .SBSE_container { margin-bottom: 20px; }\n                .SBSE_container > textarea { background-color: #EEE; border-radius: 3px; }\n                .SBSE_container > div > button, .SBSE_container > div > a { outline: none !important; }\n                .SBSE_container > div > a {\n                    -webkit-appearance: button;\n                    -moz-appearance: button;\n                    padding: 3px 6px;\n                    color: inherit;\n                    text-decoration: none;\n                }\n                #SBSE_BtnSettings { margin-top: 8px; }\n            ');

            var _handlers = {
                extract: function extract() {
                    var bundleTitle = $('.expanded .caption').text().trim();
                    var data = {
                        title: bundleTitle,
                        filename: 'Groupees ' + bundleTitle + ' Keys',
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

                    $revealBtn.addClass('working');

                    var $reveals = $('.product:has(img[title*=Steam]) .reveal-product');
                    var timer = $reveals.length > 0 ? 1500 : 0;

                    $reveals.click();
                    setTimeout(function () {
                        handler($('.expanded .reveal'), function () {
                            $revealBtn.removeClass('working');
                            $('.SBSE_BtnRetrieve').click();
                        });
                    }, timer);
                }
            };
            var _$container = getContainer(_handlers);

            // append checkbox for used-key
            _$container.find('#SBSE_BtnSettings').before($('\n                <label><input type="checkbox" class="SBSE_ChkSkipUsed" checked>' + i18n.get('checkboxSkipUsed') + '</label>\n            '));
            // add buttons style via groupees's class
            _$container.find('.SBSE_container > div > button, .SBSE_container > div > a').addClass('btn btn-default');

            // insert container
            $('.container > div').eq(1).before(_$container);

            // append mark all as used button
            new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    Array.from(mutation.addedNodes).forEach(function (addedNode) {
                        var $orderMeta = $(addedNode).find('.order-meta');

                        if ($orderMeta.length > 0) {
                            $orderMeta.after($('<button class="btn btn-default" style="margin-right: 10px;"><b>' + i18n.get('markAllAsUsed') + '</b></button>').click(function () {
                                $('.expanded .usage').each(function (i, checkbox) {
                                    if (!checkbox.checked) checkbox.click();
                                });
                            }));
                            $orderMeta.parent().addClass('showOrderMeta');
                        }
                    });
                });
            }).observe($('#profile_content')[0], { childList: true });

            // bind custom event
            $(document).on('activated', function (e, key, result) {
                if (result.success === 1) $('li.key:has(input[value=' + key + ']) .usage').click();
            });
        }
    },
    agiso: function agiso() {
        var keys = unique($('body').text().match(regKey));

        if (keys.length > 0) {
            // inject css
            GM_addStyle('\n                .SBSE_container > textarea { border: 1px solid #AAAAAA; }\n                .SBSE_container > div > button, .SBSE_container > div > a {\n                    border: 1px solid #d3d3d3;\n                    background: #e6e6e6 url(images/ui-bg_glass_75_e6e6e6_1x400.png) 50% 50% repeat-x;\n                    color: #555555;\n                }\n                .SBSE_container > div > button:hover, .SBSE_container > div > a:hover {\n                    border-color: #999999;\n                    background: #dadada url(images/ui-bg_glass_75_dadada_1x400.png) 50% 50% repeat-x;\n                    color: #212121;\n                }\n            ');

            var handlers = {
                extract: function extract() {
                    var bundleTitle = $('a[href*="tradeSnap.htm"]').eq(1).text().trim();
                    var data = {
                        title: bundleTitle,
                        filename: 'agiso ' + bundleTitle + ' Keys',
                        items: []
                    };

                    keys.forEach(function (key) {
                        data.items.push({ key: key });
                    });

                    return data;
                }
            };
            var $container = getContainer(handlers);

            $container.find('.SBSE_SelFilter').hide(); // hide filter selector
            $container.find('.SBSE_BtnReveal').remove(); // remove reveal

            // insert container
            $('#tabs').eq(0).prepend($container);
        }
    },
    steamcn: function steamcn() {
        if (location.pathname.startsWith('/tooltip')) {
            GM_addStyle('body { overflow: hidden; }');
        }
    },
    yuplay: function yuplay() {
        // inject css
        GM_addStyle('\n            .SBSE_container { margin-top: 20px; }\n            .SBSE_container > textarea { background-color: rgb(230, 230, 229); color: rgb(27, 26, 26); }\n            .SBSE_container > div { text-align: left; }\n            .SBSE_container > div > button, .SBSE_container > div > a {\n                width: 80px;\n                border: 1px solid #b4de0a;\n                background-color: #b4de0a;\n                color: #1a1a1a;\n            }\n            .SBSE_container > div > button:hover, .SBSE_container > div > a:hover {\n                border: 1px solid #a4ca09;\n                background-color: #a4ca09;\n            }\n            .SBSE_container > div > a { text-decoration: none; }\n            .SBSE_container label { color: #1a1a1a; font-weight: 400; }\n            .SBSE_appList { margin-bottom: 10px; }\n            .SBSE_appList td { vertical-align: top; }\n            .SBSE_appList a { display: block; margin-bottom: 5px; }\n            .SBSE_icon { position: relative; top: 5px; }\n        ');

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
                var $appList = $('<table class="SBSE_appList"></table>');

                $appList.append('<tr><td colspan="2">App List</td></tr>');

                data.forEach(function (d) {
                    var $row = $('<tr/>');

                    $row.append($('<td/>').append($('<span class="SBSE_icon"></span>').mouseenter(steamCNTooltip.show.bind(steamCNTooltip))), $('<td><a href="https://store.steampowered.com/app/' + d.app + '" target="_blank">' + d.title + '</a></td>'));

                    d.owned = steam.isOwned(d);
                    d.wished = steam.isWished(d);

                    if (d.owned) $row.addClass('SBSE_owned');
                    if (d.wished) $row.addClass('SBSE_wished');

                    $row.addClass('SBSE_processed isSteam').attr('data-gameinfo', JSON.stringify(d));

                    $appList.append($row);
                });

                $('.list-character').after($appList);

                // load SteamCN tooltip
                steamCNTooltip.load(data);
            }
        };
        var $container = getContainer(handlers);

        $container.find('.SBSE_SelFilter').hide(); // hide filter selector
        $container.find('button').addClass('narrow'); // narrow buttons
        $container.find('.SBSE_BtnReveal').remove(); // remove reveal

        // insert textarea
        $('.table-light').eq(0).before($container);

        // append info from SteamDB if found subid
        $('.list-character p').each(function (i, ele) {
            var $ele = $(ele);
            var text = $ele.text().trim();

            if (text.startsWith('Steam')) {
                var subID = text.match(/\d+/)[0];
                var steamDBUrl = 'https://steamdb.info/sub/' + subID + '/';
                var steamDBKey = 'SBSE_steamDB_sub_' + subID;
                var steamDBData = GM_getValue(steamDBKey, '');

                $ele.find('span').replaceWith('<a href="' + steamDBUrl + '" target="_blank">' + subID + '</a>');

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
        GM_addStyle('\n            .SBSE_container {  }\n            .SBSE_container > textarea { background-color: #ededed; color: #33; border-radius: 4px; }\n            .SBSE_container > div > button, .SBSE_container > div > a {\n                width: 80px; height: 35px;\n                border: none; border-radius: 4px;\n                background: linear-gradient(to bottom, #47bceb 0, #18a4dd 30%, #127ba6 100%);\n                color: #fff;\n                box-shadow: 0 1px 3px 1px rgba(0,0,0,.8);\n            }\n            .SBSE_container > div > button { font-family: inherit; font-size: inherit; }\n            .SBSE_container > div > a { line-height: 35px; vertical-align: top; }\n            .SBSE_container > div > button:hover, .SBSE_container > div > a:hover {\n                background: linear-gradient(to bottom, #47bceb, #18a4dd);\n            }\n            .SBSE_container > div > a { text-decoration: none; }\n        ');

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
        var $container = getContainer(handlers);

        $container.find('.SBSE_SelFilter').hide(); // hide filter selector
        $container.find('button').addClass('narrow'); // narrow buttons
        $container.find('.SBSE_BtnReveal').remove(); // remove reveal

        // insert textarea
        $('.user-info').eq(0).after($container);
    }
};
var init = function init() {
    config.init();
    i18n.init();
    xe.init();
    steam.init();

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
        var site = location.hostname.replace(/(www|alds|bundle|steamdb)\./, '').split('.').shift();

        // check sessionID
        if (!config.get('sessionID')) getSessionID();

        if (has.call(siteHandlers, site)) siteHandlers[site](true);
    }

    steamCNTooltip.listen();
};

$(init);
