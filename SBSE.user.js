function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// ==UserScript==
// @name         Steam Bundle Sites Extension
// @homepage     https://github.com/clancy-chao/Steam-Bundle-Sites-Extension
// @namespace    http://tampermonkey.net/
// @version      2.2.3
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
// @include      https://www.humblebundle.com/downloads*
// @include      https://www.humblebundle.com/home/*
// @include      http*://*dailyindiegame.com/*
// @include      http*://bundle.ccyycn.com/order/*
// @include      https://groupees.com/purchases
// @include      https://groupees.com/profile/purchases/*
// @include      http*://*agiso.com/*
// @include      https://steamdb.steamcn.com/tooltip*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/7.18.0/sweetalert2.min.js
// @resource     sweetalert2CSS https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/7.18.0/sweetalert2.min.css
// @resource     currencyFlags https://cdnjs.cloudflare.com/ajax/libs/currency-flags/1.5.0/currency-flags.min.css
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
// @connect      api.fanatical.com
// @connect      www.ecb.europa.eu
// @connect      steamdb.steamcn.com
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
const $ = jQuery.noConflict(true);

$.fn.pop = [].pop;
$.fn.shift = [].shift;

// inject external css styles
GM_addStyle(GM_getResourceText('sweetalert2CSS'));
GM_addStyle(GM_getResourceText('currencyFlags'));

// inject script css styles
GM_addStyle(`
    pre.SBSE_errorMsg { height: 200px; text-align: left; white-space: pre-wrap; }

    /* settings */
    .SBSE_settings .name { text-align: right; vertical-align: top; }
    .SBSE_settings .value { text-align: left; }
    .SBSE_settings .value > * { height: 30px; margin: 0 20px 10px; }
    .SBSE_settings .switch { position: relative; display: inline-block; width: 60px; }
    .SBSE_settings .switch input { display: none; }
    .SBSE_settings .slider {
        position: absolute;
        top: 0; right: 0; bottom: 0; left: 0;
        background-color: #CCC;
        transition: 0.4s;
        cursor: pointer;
    }
    .SBSE_settings .slider:before {
        width: 26px; height: 26px;
        position: absolute;
        bottom: 2px; left: 2px;
        background-color: white;
        transition: 0.4s;
        content: "";
    }
    .SBSE_settings input:checked + .slider { background-color: #2196F3; }
    .SBSE_settings input:focus + .slider { box-shadow: 0 0 1px #2196F3; }
    .SBSE_settings input:checked + .slider:before { transform: translateX(30px); }
    .SBSE_settings > span { display: inline-block; color: white; cursor: pointer; }

    /* container */
    .SBSE_container {
        width: 100%; height: 200px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
    }
    .SBSE_container > textarea {
        width: 100%; height: 150px;
        padding: 5px;
        border: none;
        box-sizing: border-box;
        resize: none;
        outline: none;
    }
    .SBSE_container > div { width: 100%; padding-top: 5px; box-sizing: border-box; }
    .SBSE_container > div > button, .SBSE_container > div > a {
        width: 120px;
        position: relative;
        margin-right: 10px;
        line-height: 28px;
        transition: all 0.5s;
        box-sizing: border-box;
        outline: none;
        cursor: pointer;
    }
    .SBSE_container > div > a { display: inline-block; text-align: center; }
    .SBSE_container label { margin-right: 10px; }
    #SBSE_BtnSettings {
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
    }

    /* spinner button affect */
    .SBSE_container > div > button:before {
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
    .SBSE_container > div > button.narrow.working {
        width: 100px;
        padding-right: 40px;
        transition: all 0.5s;
    }
    .SBSE_container > div > button.working:before {
        transition-delay: 0.5s;
        transition-duration: 1s;
        opacity: 1;
    }
    @keyframes rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    /* icons */
    .SBSE_icon {
        width: 20px; height: 20px;
        display: inline-block;
        border-radius: 50%;
        background-color: #E87A90;
        transform: rotate(45deg);
    }
    .SBSE_icon:before, .SBSE_icon:after {
        content: '';
        width: 3px; height: 14px;
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        border-radius: 5px;
        pointer-events: none;
    }
    .SBSE_icon:after {
        transform: translate(-50%, -50%) rotate(-90deg);
    }
    .SBSE_owned .SBSE_icon { background-color: #9CCC65; }
    .SBSE_owned .SBSE_icon:before, .SBSE_owned .SBSE_icon:after { transform: none; }
    .SBSE_owned .SBSE_icon:before {
        width: 3px; height: 11px;
        top: 4px; left: 10px;
        border-radius: 5px 5px 5px 0;
    }
    .SBSE_owned .SBSE_icon:after {
        width: 5px; height: 3px;
        top: 12px; left: 6px;
        border-radius: 5px 0 0 5px;
    }
    .SBSE_wished .SBSE_icon { transform: rotate(0); background-color: #29B6F6; }
    .SBSE_wished .SBSE_icon:before, .SBSE_wished .SBSE_icon:after {
        width: 6px; height: 10px;
        top: 5px; left: 10px;
        border-radius: 6px 6px 0 0;
        transform: rotate(-45deg);
        transform-origin: 0 100%;
    }
    .SBSE_wished .SBSE_icon:after {
        left: 4px;
        transform: rotate(45deg);
        transform-origin :100% 100%;
    }

    /* tooltip */
    .SBSE_tooltip {
        width: 308px;
        position: fixed;
        overflow: hidden;
        background: url(https://steamstore-a.akamaihd.net/public/images/v6/blue_body_darker_repeat.jpg) -700px center repeat-y scroll rgb(0, 0, 0);
        border: 0;
        box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5);
        transition: all 0.5s;
        z-index: 999;
    }
    .SBSE_tooltip.SBSE_hide { display: none; }
`);

// load up
const regKey = /(?:(?:([A-Z0-9])(?!\1{4})){5}-){2,5}[A-Z0-9]{5}/g;
const eol = "\r\n";
const has = Object.prototype.hasOwnProperty;
const unique = a => [...new Set(a)];

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
        if (!has.call(this.data, 'preselectIncludeTitle')) this.data.preselectIncludeTitle = false;
        if (!has.call(this.data, 'titleComesLast')) this.data.titleComesLast = false;
        if (!has.call(this.data, 'preselectJoinKeys')) this.data.preselectJoinKeys = false;
        if (!has.call(this.data, 'joinKeysASFStyle')) this.data.joinKeysASFStyle = true;
        if (!has.call(this.data, 'activateAllKeys')) this.data.activateAllKeys = false;
        if (!has.call(this.data, 'enableTooltips')) this.data.enableTooltips = this.get('language') !== 'english';
    }
};
const i18n = {
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
            checkboxSkipOwned: '跳過已擁有',
            checkboxMarketListings: '上架於市集',
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
            checkboxSkipOwned: '跳过已拥有',
            checkboxMarketListings: '上架于市集',
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
            checkboxSkipOwned: 'Skip Owned',
            checkboxMarketListings: 'Market Listings',
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
    set() {
        const selectedLanguage = has.call(this.data, config.get('language')) ? config.get('language') : 'english';

        this.language = this.data[selectedLanguage];
    },
    get(key) {
        return has.call(this.language, key) ? this.language[key] : this.data.english[key];
    },
    init() {
        this.set();
    }
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
    get(code, language) {
        const data = this.name[language || config.get('language') || 'english'];

        return has.call(data, code) ? data[code] : code;
    }
};
const xe = {
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
    getRate() {
        const self = this;

        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml',
            onload: res => {
                if (res.status === 200) {
                    try {
                        const exchangeRate = {
                            lastUpdate: Date.now(),
                            rates: {}
                        };

                        res.response.split("\n").forEach(line => {
                            if (line.includes('currency=')) {
                                const currency = line.split('currency=\'').pop().slice(0, 3);
                                const rate = line.trim().split('rate=\'').pop().slice(0, -3);

                                exchangeRate.rates[currency] = parseFloat(rate);
                            }
                        });

                        // get NTD
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: 'https://www.google.com/search?q=1+EUR+%3D+NTD',
                            onload: searchRes => {
                                const rate = parseFloat(searchRes.response.split('<div class="vk_ans vk_bk">').pop().slice(0, 7).trim());
                                const NTDRate = isNaN(rate) ? exchangeRate.rates.HKD * 3.75 : rate;

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
    update(targetCurrency = 'USD') {
        $('.SBSE_price').each((i, ele) => {
            const originalCurrency = ele.dataset.currency;
            const originalValue = parseInt(ele.dataset.value, 10);
            const originalRate = this.exchangeRate.rates[originalCurrency];
            const targetRate = this.exchangeRate.rates[targetCurrency];
            const exchangedValue = originalValue / originalRate * targetRate;

            $(ele).text(this.currencies[targetCurrency].symbol + (exchangedValue / 100).toFixed(2));
        });
    },
    init() {
        const updateTimer = 12 * 60 * 60 * 1000; // update every 12 hours

        if (Object.keys(this.exchangeRate).length === 0 || this.exchangeRate.lastUpdate < Date.now() - updateTimer) this.getRate();
    }
};
const steam = {
    library: JSON.parse(localStorage.getItem('SBSE_steam') || '{}'),
    sync(notify = true) {
        const self = this;
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://store.steampowered.com/dynamicstore/userdata/t=${Math.random()}`,
            onload(res) {
                const data = JSON.parse(res.response);

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
            onerror() {
                swal({
                    title: i18n.get('syncFailTitle'),
                    text: i18n.get('syncFail'),
                    type: 'error',
                    confirmButtonText: i18n.get('visitSteam'),
                    showCancelButton: true
                }).then(result => {
                    if (result.value === true) window.open('https://store.steampowered.com/');
                });
            }
        });
    },
    set() {
        localStorage.setItem('SBSE_steam', JSON.stringify(this.library));
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
    lastSync() {
        return this.library.lastSync;
    },
    init() {
        if (Object.keys(this.library).length === 0) {
            this.library.owned = { app: {}, sub: {} };
            this.library.wished = { app: {}, sub: {} };
            this.library.ignored = { app: {}, sub: {} };
            this.set();
        }

        // update steam library every 10 min
        const updateTimer = 10 * 60 * 1000;

        if (!this.lastSync() || this.lastSync() < Date.now() - updateTimer) this.sync(false);
    }
};

// functions
const getSessionID = () => {
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://store.steampowered.com/',
        onload(res) {
            if (res.status === 200) {
                const accountID = res.response.match(/g_AccountID = (\d+)/).pop();
                const sessionID = res.response.match(/g_sessionID = "(\w+)"/).pop();

                if (accountID > 0) config.set('sessionID', sessionID);else {
                    swal({
                        title: i18n.get('notLoggedInTitle'),
                        text: i18n.get('notLoggedInMsg'),
                        type: 'error',
                        showCancelButton: true
                    }).then(result => {
                        if (result.value === true) window.open('https://store.steampowered.com/');
                    });
                }
            }
        }
    });
};
const steamCNTooltip = {
    timeoutID: 0,
    load(data) {
        ['app', 'sub'].forEach(type => {
            if (has.call(data, type) && config.get('enableTooltips')) {
                const url = `https://steamdb.steamcn.com/tooltip?v=4#${type}/${data[type]}#steam_info_${type}_${data[type]}_1`;

                $('body').append($(`<iframe id="tooltip_${type + data[type]}" class="SBSE_tooltip SBSE_hide" src="${url}"></iframe>`).mouseenter(() => {
                    clearTimeout(this.timeoutID);
                }).mouseout(this.hide));
            }
        });
    },
    show(e) {
        const $target = $(e.currentTarget);
        const json = $target.closest('.SBSE_processed').attr('data-gameinfo');

        if (json.length > 0 && config.get('enableTooltips')) {
            const data = JSON.parse(json);
            const opened = !!$('.SBSE_tooltip:not(.SBSE_hide)').length;

            ['app', 'sub'].forEach(type => {
                const $tooltip = $(`#tooltip_${type + data[type]}`);

                if ($tooltip.length > 0 && !opened) {
                    $tooltip.css({
                        top: e.clientY,
                        left: e.clientX + 10
                    }).removeClass('SBSE_hide');
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
        const $tooltip = $('.SBSE_tooltip:not(.SBSE_hide)');

        $tooltip.addClass('SBSE_hide');
        $tooltip[0].contentWindow.postMessage('hide', '*');
    },
    reposition($tooltip, height) {
        const $window = $(window);
        const $document = $(document);
        const offsetTop = $tooltip.offset().top - $document.scrollTop();
        const offsetLeft = $tooltip.offset().left - $document.scrollLeft();
        const overflowX = offsetLeft + $tooltip.width() - ($window.width() - 20);
        const overflowY = offsetTop + height - ($window.height() - 20);

        if (overflowY > 0) $tooltip.css('top', offsetTop - overflowY);
        if (overflowX > 0) $tooltip.css('left', offsetLeft - overflowX);
    },
    listen() {
        window.addEventListener('message', e => {
            if (e.origin === 'https://steamdb.steamcn.com' && e.data.height && e.data.src) {
                const $tooltip = $(`.SBSE_tooltip[src="${e.data.src}"]`);

                $tooltip.height(e.data.height);
                this.reposition($tooltip, e.data.height);
            }
        });
    }
};
const settings = {
    construct() {
        const panelHTML = `
            <div class="SBSE_settings">
                <table>
                    <tr>
                        <td class="name">${i18n.get('settingsAutoUpdateSessionID')}</td>
                        <td class="value">
                            <label class="switch">
                                <input type="checkbox" class="autoUpdateSessionID">
                                <span class="slider"></span>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <td class="name">${i18n.get('settingsSessionID')}</td>
                        <td class="value">
                            <input type="text" class="sessionID" value="${config.get('sessionID')}">
                        </td>
                    </tr>
                    <tr>
                        <td class="name">${i18n.get('settingsSyncLibrary')}</td>
                        <td class="value">
                            <button class="syncLibrary">${i18n.get('settingsSyncLibraryButton')}</button>
                        </td>
                    </tr>
                    <tr>
                        <td class="name">${i18n.get('settingsLanguage')}</td>
                        <td class="value">
                            <select class="language"></select>
                        </td>
                    </tr>
                    <tr>
                        <td class="name">${i18n.get('settingsPreselectIncludeTitle')}</td>
                        <td class="value">
                            <label class="switch">
                                <input type="checkbox" class="preselectIncludeTitle">
                                <span class="slider"></span>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <td class="name">${i18n.get('settingsTitleComesLast')}</td>
                        <td class="value">
                            <label class="switch">
                                <input type="checkbox" class="titleComesLast">
                                <span class="slider"></span>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <td class="name">${i18n.get('settingsPreselectJoinKeys')}</td>
                        <td class="value">
                            <label class="switch">
                                <input type="checkbox" class="preselectJoinKeys">
                                <span class="slider"></span>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <td class="name">${i18n.get('settingsJoinKeysASFStyle')}</td>
                        <td class="value">
                            <label class="switch">
                                <input type="checkbox" class="joinKeysASFStyle">
                                <span class="slider"></span>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <td class="name">${i18n.get('settingsActivateAllKeys')}</td>
                        <td class="value">
                            <label class="switch">
                                <input type="checkbox" class="activateAllKeys">
                                <span class="slider"></span>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <td class="name">${i18n.get('settingsEnableTooltips')}</td>
                        <td class="value">
                            <label class="switch">
                                <input type="checkbox" class="enableTooltips">
                                <span class="slider"></span>
                            </label>
                        </td>
                    </tr>
                </table>
            </div>
        `;

        return panelHTML;
    },
    display() {
        swal({
            title: i18n.get('settingsTitle'),
            html: this.construct()
        });

        // apply settings
        const $panel = $(swal.getContent());
        const $sessionID = $panel.find('.sessionID');
        const $language = $panel.find('.language');

        // toggles
        $panel.find('input[type=checkbox]').each((index, input) => {
            const $input = $(input);

            $input.prop('checked', config.get(input.className));
            $input.change(e => {
                swal.showLoading();

                const setting = e.delegateTarget.className;
                const state = e.delegateTarget.checked;

                config.set(setting, state);

                if (setting === 'autoUpdateSessionID') $sessionID.attr('disabled', state);

                setTimeout(swal.hideLoading, 500);
            });
        });

        // sessionID input
        $sessionID.prop('disabled', config.get('autoUpdateSessionID'));
        $sessionID.change(() => {
            swal.showLoading();

            config.set('sessionID', $sessionID.val().trim());

            setTimeout(swal.hideLoading, 500);
        });

        // sync library
        $panel.find('.syncLibrary').click(() => {
            steam.sync();
        });

        // language
        Object.keys(i18n.data).forEach(language => {
            $language.append(new Option(i18n.data[language].name, language));
        });
        $panel.find(`option[value=${config.get('language')}]`).prop('selected', true);
        $language.change(() => {
            swal.showLoading();

            const newLanguage = $language.val();
            config.set('language', newLanguage);
            i18n.set();

            setTimeout(swal.hideLoading, 500);
        });
    }
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
        if (result.sbse !== true) {
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
                50: i18n.get('failDetailGiftWallet')
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
                info.line_items.forEach(item => {
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
            $('.SBSE_container > textarea').val(this.results.concat(keys).join(eol));
        };
        const activateHandler = () => {
            const key = keys.shift();

            if (key) {
                if (this.isActivated(key)) {
                    this.results.push(this.resultDetails({
                        sbse: true,
                        key,
                        status: `${i18n.get('skippedStatus')}/${i18n.get('activatedDetail')}`,
                        descripton: i18n.get('noItemDetails')
                    }));
                    updateResults();

                    // next key
                    activateHandler();
                } else if (this.isOwned(key) && !config.get('activateAllKeys')) {
                    const detail = this.getKeyDetails(key);
                    const description = [];

                    ['app', 'sub'].forEach(type => {
                        if (has.call(detail, type)) description.push(`${type}: ${detail[type]} ${detail.title}`);
                    });

                    this.results.push(this.resultDetails({
                        sbse: true,
                        key,
                        status: `${i18n.get('skippedStatus')}/${i18n.get('failDetailAlreadyOwned')}`,
                        descripton: description.join()
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
                            Referer: 'https://store.steampowered.com/account/registerkey'
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

                                errorMsg.push('<pre class="SBSE_errorMsg">');
                                errorMsg.push(`sessionID: ${config.get('sessionID') + eol}`);
                                errorMsg.push(`autoUpdate: ${config.get('autoUpdateSessionID') + eol}`);
                                errorMsg.push(`status: ${res.status + eol}`);
                                errorMsg.push(`response: ${res.response + eol}`);
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
const getContainer = handlers => {
    const $container = $(`
        <div class="SBSE_container">
            <textarea></textarea>
            <div>
                <button class="SBSE_BtnReveal">${i18n.get('buttonReveal')}</button>
                <button class="SBSE_BtnRetrieve">${i18n.get('buttonRetrieve')}</button>
                <button class="SBSE_BtnActivate">${i18n.get('buttonActivate')}</button>
                <button class="SBSE_BtnCopy">${i18n.get('buttonCopy')}</button>
                <button class="SBSE_BtnReset">${i18n.get('buttonReset')}</button>
                <a class="SBSE_BtnExport">${i18n.get('buttonExport')}</a>
                <label><input type="checkbox" class="SBSE_ChkTitle">${i18n.get('checkboxIncludeGameTitle')}</label>
                <label><input type="checkbox" class="SBSE_ChkJoin">${i18n.get('checkboxJoinKeys')}</label>
                <button id="SBSE_BtnSettings"> </button>
            </div>
        </div>
    `);

    if (typeof handlers.reveal !== 'function') handlers.reveal = () => {};
    if (typeof handlers.retrieve !== 'function') {
        handlers.retrieve = () => {
            const data = handlers.extract();
            const keys = [];
            const includeTitle = !!$('.SBSE_ChkTitle:checked').length;
            const joinKeys = !!$('.SBSE_ChkJoin:checked').length;
            const skipOwned = !!$('.SBSE_ChkSkipOwned:checked').length;
            const skipUsed = !!$('.SBSE_ChkSkipUsed:checked').length;
            const skipMarketListing = !$('.SBSE_ChkMarketListings:checked').length;
            const separator = joinKeys ? ',' : eol;
            const prefix = joinKeys && config.get('joinKeysASFStyle') ? '!redeem ' : '';

            for (let i = 0; i < data.items.length; i += 1) {
                const item = data.items[i];

                if (item.owned && skipOwned) continue;
                if (item.used && skipUsed) continue;
                if (item.marketListing && skipMarketListing) continue;

                const temp = [item.key];

                if (includeTitle) temp.unshift(item.title);
                if (config.get('titleComesLast')) temp.reverse();

                keys.push(temp.join(', '));
            }

            $('.SBSE_container > textarea').val(prefix + keys.join(separator));
        };
    }
    if (typeof handlers.activate !== 'function') {
        handlers.activate = e => {
            const $textarea = $container.find('textarea');
            const keys = unique($textarea.val().match(regKey));

            if (keys.length > 0) {
                const $activateBtn = $(e.currentTarget);

                $activateBtn.prop('disabled', true).addClass('working');
                $textarea.attr('disabled', '');

                $textarea.val(keys.join(eol));
                activator.activate(keys, () => {
                    $activateBtn.prop('disabled', false).removeClass('working');
                    $textarea.removeAttr('disabled');
                });
            } else $textarea.val(i18n.get('emptyInput'));
        };
    }
    if (typeof handlers.copy !== 'function') {
        handlers.copy = () => {
            $('.SBSE_container > textarea').select();
            document.execCommand('copy');
        };
    }
    if (typeof handlers.reset !== 'function') {
        handlers.reset = () => {
            $('.SBSE_container > textarea').val('');
        };
    }
    if (typeof handlers.export !== 'function') {
        handlers.export = e => {
            const data = handlers.extract();

            if (data.items.length > 0) {
                const $exportBtn = $(e.currentTarget);

                $exportBtn.removeAttr('href').removeAttr('download');

                const filename = data.filename.replace(/[\\/:*?"<>|!]/g, '');
                const formattedData = data.items.map(line => {
                    const temp = [];

                    if (line.title) temp.push(line.title.replace(/,/g, ' '));
                    temp.push(line.key);

                    return temp.join();
                }).join(eol);

                $exportBtn.attr({
                    href: `data:text/csv;charset=utf-8,\ufeff${encodeURIComponent(formattedData)}`,
                    download: `${filename}.csv`
                });
            }
        };
    }
    if (typeof handlers.settings !== 'function') {
        handlers.settings = () => {
            settings.display();
        };
    }

    // bind event
    $container.find('button').click(e => {
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
const siteHandlers = {
    indiegala() {
        // inject css
        GM_addStyle(`
            .SBSE_container { margin-top: 10px; }
            .SBSE_container > textarea { border: 1px solid #CC001D; border-radius: 3px; }
            .SBSE_container > div > button, .SBSE_container > div > a { width: 100px; background-color: #CC001D; color: white; border-radius: 3px; }
            .SBSE_container > div > a:hover { color: white; }
            .swal2-popup .slider { margin: 0; }
            .SBSE_icon { vertical-align: middle; }
        `);

        const handlers = {
            extract() {
                const source = location.pathname === '/profile' ? 'div[id*="_sale_"].collapse.in' : document;
                const bundleTitle = $('[aria-expanded="true"] > div#bundle-title, #bundle-title, #indie_gala_2 > div > span').eq(0).text().trim();
                const data = {
                    title: bundleTitle,
                    filename: `IndieGala ${bundleTitle} Keys`,
                    items: []
                };

                $(source).find('.game-key-string').each((i, ele) => {
                    const $ele = $(ele);
                    const key = $ele.find('.keys').val();

                    if (key) {
                        const d = JSON.parse($(ele).closest('.SBSE_processed').attr('data-gameinfo') || '{}');

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
                const handler = ($games, callback) => {
                    const game = $games.shift();

                    if (game) {
                        const $game = $(game);
                        const code = $game.attr('id').split('_').pop();
                        const id = $game.attr('onclick').match(/steampowered\.com\/(app|sub)\/(\d+)/)[2];

                        $.ajax({
                            method: 'GET',
                            url: '/myserials/syncget',
                            dataType: 'json',
                            data: {
                                code,
                                cache: false,
                                productId: id
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
                            }
                        });
                    } else callback();
                };

                $revealBtn.addClass('working');

                handler($(source).find('a[id^=fetchlink_]'), () => {
                    $revealBtn.removeClass('working');
                    $('.SBSE_BtnRetrieve').click();
                });
            }
        };
        const process = () => {
            $('.game-key-string').each((i, ele) => {
                const $ele = $(ele);
                const $a = $ele.find('.title_game > a');
                const d = {
                    title: $a.text().trim()
                };

                const matched = $a.attr('href').match(/steam.+\/(app|sub)\/(\d+)/);
                if (matched) d[matched[1]] = parseInt(matched[2], 10);

                // check if owned & wished
                d.owned = steam.isOwned(d);
                d.wished = steam.isWished(d);

                if (d.owned) $ele.addClass('SBSE_owned');
                if (d.wished) $ele.addClass('SBSE_wished');

                // append icon
                $a.after($('<span class="SBSE_icon"></span>').mouseenter(steamCNTooltip.show.bind(steamCNTooltip)));

                // load SteamCN tooltip
                steamCNTooltip.load(d);

                $ele.attr('data-gameinfo', JSON.stringify(d)).addClass('SBSE_processed');
            });
        };
        const $container = getContainer(handlers);

        process();

        // insert container
        $('#library-contain').eq(0).before($container);

        // support for new password protected gift page
        const $node = $('#gift-contents');

        if ($node.length > 0) {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    Array.from(mutation.addedNodes).forEach(addedNode => {
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
            .SBSE_container { margin-top: 10px; }
            .SBSE_container > textarea { background-color: #434343; color: #eee; }
            .SBSE_container > div > button, .SBSE_container > div > a { width: 80px; }
            .SBSE_container > div > button, .SBSE_container select, .SBSE_container > div > a { border: 1px solid transparent; background-color: #1c1c1c; color: #eee; }
            .SBSE_container > div > button:hover, .SBSE_container select:hover, .SBSE_container > div > a:hover { color: #A8A8A8; }
            .SBSE_container > div > a { text-decoration: none; }
            .SBSE_container label { color: #DEDEDE; }
            .SBSE_container select { max-width:120px; height: 30px; }
            .SBSE_container select, .SBSE_container span { margin-right: 0; margin-left: 10px; float: right; }
            .SBSE_container span { margin-top: 5px; }

            /* product page */
            .cardBlock { width: 100%; padding: 0 .875rem 0 .875rem; }
            .cardBlock > div { padding: 1rem; }
            .cardBlock .currencyToggler {
                width: 100%; height: 40px;
                margin-bottom: 10px;
                font-size: 20px;
                border-radius: 3px;
            }
            .starDeal { padding: 1rem; }
            .starDeal > div { display: flex; align-items: center; justify-content: space-evenly; }
            .starDeal .currencyToggler {
                width: 300px; height: 40px;
                font-size: 20px;
                border-radius: 3px;
            }
            .pricingDetail { background-color: transparent; }
            .pricingDetail th { padding-top: 10px; }
            .pricingDetail .cheapest { border-bottom: 1px solid #ff9800; font-weight: bold; }
            .pricingDetail .currency-flag { vertical-align: text-bottom; }
            .swal2-popup table { background-color: white; }
            .SBSE_icon { margin-top: -16px; align-self: flex-end; }
        `);

        let APIData = null;
        const fetchAPIData = (() => {
            var _ref = _asyncToGenerator(function* (s, c) {
                let slug = s;
                let callback = c;
                if (typeof s === 'function') {
                    callback = s;
                    slug = location.href.split('/').pop();
                }

                let JSONString = GM_getValue(`Fanatical-${slug}`, '');

                if (JSONString.length === 0) {
                    const res = yield fetch(`https://api.fanatical.com/api/products/${slug}`);

                    if (res.ok) {
                        JSONString = yield res.text();

                        GM_setValue(`Fanatical-${slug}`, JSONString);
                    } else JSONString = '{}';
                }

                APIData = JSON.parse(JSONString);

                if (typeof callback === 'function') callback();
            });

            return function fetchAPIData(_x, _x2) {
                return _ref.apply(this, arguments);
            };
        })();
        const productHandler = (() => {
            var _ref2 = _asyncToGenerator(function* () {
                if (Object.keys(APIData).length > 0) {
                    const language = config.get('language');
                    const $priceExt = $(`
                    <div class="cardBlock">
                        <div>
                            <select class="currencyToggler"></select>
                            <table class="pricingDetail"></table>
                        </div>
                    </div>
                `);
                    const $currencyToggler = $priceExt.find('.currencyToggler');
                    const $pricingDetail = $priceExt.find('.pricingDetail');
                    const selectedCurrency = GM_getValue('SBSE_selectedCurrency', 'CNY');
                    const isStarDeal = !!$('.stardeal-purchase-info').length;
                    let starDeal = {};

                    if (isStarDeal) {
                        $priceExt.toggleClass('cardBlock starDeal');

                        // fetch star-deal data
                        const res = yield fetch('https://api.fanatical.com/api/star-deal');

                        if (res.ok) starDeal = yield res.json();
                    }

                    Object.keys(xe.currencies).forEach(function (currency) {
                        const selected = currency === selectedCurrency ? ' selected' : '';

                        $currencyToggler.append($(`<option value="${currency}"${selected}>${xe.currencies[currency][language]}</option>`));
                    });

                    $currencyToggler.change(function () {
                        xe.update($currencyToggler.val());
                        GM_setValue('SBSE_selectedCurrency', $currencyToggler.val());
                    });

                    // bundle page
                    APIData.bundles.forEach(function (tier, index) {
                        if (APIData.bundles.length > 1) $pricingDetail.append(`<tr><th colspan="3">Tier ${index + 1}</th></tr>`);
                        Object.keys(tier.price).forEach(function (currency) {
                            const value = tier.price[currency];

                            $pricingDetail.append(`
                            <tr class="tier${index + 1}">
                                <td><div class="currency-flag currency-flag-${currency.toLowerCase()}"></div></td>
                                <td>${xe.currencies[currency].symbol + value / 100}</td>
                                <td> ≈ <span class="SBSE_price" data-currency="${currency}" data-value="${value}"></span></td>
                            </tr>
                        `);
                        });
                    });

                    // game page
                    if (location.href.includes('/game/') || location.href.includes('/dlc/')) {
                        let discount = 1;

                        if (has.call(APIData, 'current_discount') && new Date(APIData.current_discount.until).getTime() > Date.now()) discount = 1 - APIData.current_discount.percent;

                        if (isStarDeal) discount = 1 - $('.discount-percent').text().replace(/\D/g, '') / 100;

                        Object.keys(APIData.price).forEach(function (currency) {
                            let value = (APIData.price[currency] * discount).toFixed(2);

                            // if star-deal data loaded successfully
                            if (has.call(starDeal, 'promoPrice')) value = starDeal.promoPrice[currency];

                            $pricingDetail.append(`
                            <tr class="tier1">
                                <td><div class="currency-flag currency-flag-${currency.toLowerCase()}"></div></td>
                                <td>${xe.currencies[currency].symbol + (value / 100).toFixed(2)}</td>
                                <td> ≈ <span class="SBSE_price" data-currency="${currency}" data-value="${value}"></span></td>
                            </tr>
                        `);
                        });
                    }

                    $('.product-commerce-container').append($priceExt);
                    $('.stardeal-purchase-info').after($priceExt);
                    xe.update(selectedCurrency);

                    // highlight the cheapest
                    for (let i = 1; i < 10; i += 1) {
                        const $prices = $(`.tier${i} .SBSE_price`);

                        if ($prices.length === 0) break;

                        $($prices.toArray().sort(function (a, b) {
                            return a.textContent.replace(/\D/g, '') - b.textContent.replace(/\D/g, '');
                        }).shift()).closest('tr').addClass('cheapest');
                    }
                }
            });

            return function productHandler() {
                return _ref2.apply(this, arguments);
            };
        })();
        const handlers = {
            extract() {
                const bundleTitle = $('h5').eq(0).text().trim();
                const data = {
                    title: bundleTitle,
                    filename: `Fanatical ${bundleTitle} Keys`,
                    items: []
                };

                $('.account-content dl:has(input)').each((i, dl) => {
                    const $dl = $(dl);
                    const key = $dl.find('input').val();

                    if (key) {
                        const d = JSON.parse($dl.closest('.SBSE_processed').attr('data-gameinfo') || '{}');

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
            reveal(e) {
                const $revealBtn = $(e.currentTarget);
                const handler = ($games, callback) => {
                    const game = $games.shift();

                    if (game) {
                        game.click();
                        setTimeout(handler.bind(null, $games, callback), 300);
                    } else setTimeout(callback, 500);
                };

                $revealBtn.addClass('working');

                handler($('.account-content dl button'), () => {
                    $revealBtn.removeClass('working');
                    $('.SBSE_BtnRetrieve').click();
                });
            }
        };
        const process = () => {
            const title = $('.account-content h5').eq(0).text();
            const slug = title.trim().toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');

            // empty textarea
            $('.SBSE_container textarea').val('');

            if (slug.length > 0) {
                fetchAPIData(slug, () => {
                    if (Object.keys(APIData).length > 0) {
                        const matchGame = data => {
                            if (has.call(data, 'steam') && data.steam.id) {
                                const $gameTitle = $(`dd > div.d-flex.flex-column:contains(${data.name})`);
                                const $dl = $gameTitle.closest('dl');
                                const d = {
                                    title: data.name,
                                    app: parseInt(data.steam.id, 10)
                                };

                                d.owned = steam.isOwned(d);
                                d.wished = steam.isWished(d);

                                // check if owned & wished
                                if (d.owned) $dl.addClass('SBSE_owned');
                                if (d.wished) $dl.addClass('SBSE_wished');

                                // wrap link
                                $gameTitle.contents().filter((i, n) => n.nodeType === 3).wrap(`<a href="http:www.steampowered.com/app/${data.steam.id}/"></a>`);

                                // append icon
                                $gameTitle.append($('<span class="SBSE_icon"></span>').mouseenter(steamCNTooltip.show.bind(steamCNTooltip)));

                                // load SteamCN tooltip
                                steamCNTooltip.load(d);

                                $dl.addClass('SBSE_processed').attr('data-gameinfo', JSON.stringify(d));
                            }
                        };

                        matchGame(APIData);
                        APIData.bundles.forEach(tier => {
                            tier.games.forEach(matchGame);
                        });
                    }
                });
            }
        };
        const $container = getContainer(handlers);

        $container.find('button').addClass('narrow'); // narrow buttons
        $container.find('a').attr('href', ''); // dodge from master css selector

        new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                Array.from(mutation.addedNodes).filter(x => x.nodeType === 1).forEach(node => {
                    // url changed
                    if (node.matches('[property="og:url"]')) {
                        const currentURL = location.href;

                        if (currentURL.includes('/orders/')) {
                            // insert container
                            const $anchor = $('h3:contains(Order Keys)');

                            if ($('.SBSE_container').length === 0 && $anchor.length > 0) $anchor.eq(0).before($container);
                        }
                        if (currentURL.includes('/bundle/') || currentURL.includes('/game/') || currentURL.includes('/dlc/')) fetchAPIData(productHandler);
                    }

                    // order contents loaded
                    if ($(node).find('dl').length > 0) process();
                });
            });
        }).observe($('html')[0], {
            childList: true,
            subtree: true
        });
    },
    humblebundle() {
        // inject css
        GM_addStyle(`
            .SBSE_container > div { position: relative; }
            .SBSE_container > textarea {
                border: 1px solid #CFCFCF;
                border-radius: 5px;
                color: #4a4c45;
                text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
            }
            .SBSE_container > div > button, .SBSE_container > div > a {
                width: 70px;
                border: 1px solid #C9CCD3;
                border-radius: 3px;
                background-color: #C5C5C5;
                background: linear-gradient(to top, #cacaca, #e7e7e7);
                color: #4a4c45 !important;
            }
            .SBSE_container > div > button:hover, .SBSE_container > div > a:hover {
                border: 1px solid #b7bac0;
                background-color: #fafcff;
                color: #555961 !important;
            }
            .SBSE_container > div > button.narrow.working { width: 76px; padding-right: 36px; }
            #SBSE_BtnSettings { position: absolute; right: 0; }
            .SBSE_owned .sr-unredeemed-steam-button {
                background-color: #F3F3F3;
                background: linear-gradient(to top, #E8E8E8, #F6F6F6);
            }/*
            .SBSE_owned .heading-text h4 > span:not(.steam-owned):last-child::after {
                content: '\\f085';
                font-family: hb-icons;
                color: #17A1E5;
            }*/
            .SBSE_activationRestrictions { float: right; margin-right: 5px; cursor: pointer; }
            .swal2-icon-text { font-size: inherit; }
        `);

        const atDownload = location.pathname === '/downloads';
        const fetchKey = (() => {
            var _ref3 = _asyncToGenerator(function* ($node, machineName, callback) {
                const res = yield fetch('https://www.humblebundle.com/humbler/redeemkey', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        Origin: 'https://www.humblebundle.com',
                        Referer: location.href
                    },
                    body: `keytype=${machineName}&key=${unsafeWindow.gamekeys[0]}&keyindex=0`,
                    credentials: 'same-origin'
                });

                if (res.ok) {
                    const d = yield res.json();

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
            });

            return function fetchKey(_x3, _x4, _x5) {
                return _ref3.apply(this, arguments);
            };
        })();
        const handlers = {
            extract() {
                const bundleTitle = $('title').text().split(' (').shift();
                const data = {
                    title: bundleTitle,
                    filename: `Humble Bundle ${bundleTitle} Keys`,
                    items: []
                };

                $('.keyfield.redeemed .keyfield-value').each((i, ele) => {
                    const $ele = $(ele);
                    const key = $ele.text().trim();

                    if (key) {
                        const d = JSON.parse($ele.closest('.SBSE_processed').attr('data-gameinfo') || '{}');

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
                const skipOwned = !!$('.SBSE_ChkSkipOwned:checked').length;
                const notSelector = skipOwned ? ':not(.SBSE_owned)' : '';
                const handler = ($games, callback) => {
                    const game = $games.shift();

                    if (game) {
                        const $game = $(game);
                        const machineName = $game.closest('.key-redeemer').attr('data-machineName');

                        if (atDownload && machineName) {
                            fetchKey($game, machineName, () => {
                                handler($games, callback);
                            });
                        } else {
                            game.click();
                            $('.sr-warning-modal-confirm-button').click();

                            setTimeout(handler.bind(null, $games, callback), 200);
                        }
                    } else callback();
                };

                $revealBtn.addClass('working');

                handler($(`.key-redeemer${notSelector} .keyfield:not(.redeemed)`), () => {
                    $revealBtn.removeClass('working');
                    $('.SBSE_BtnRetrieve').click();
                });
            }
        };
        const process = (() => {
            var _ref4 = _asyncToGenerator(function* ($node) {
                const gameKey = unsafeWindow.gamekeys[0];
                let json = GM_getValue(gameKey, '');

                if (json.length === 0) {
                    const res = yield fetch(`https://www.humblebundle.com/api/v1/order/${gameKey}?all_tpkds=true`, {
                        method: 'GET',
                        credentials: 'same-origin'
                    });

                    json = yield res.text();
                }

                const data = JSON.parse(json);

                data.tpkd_dict.all_tpks.forEach(function (game) {
                    const $keyRedeemer = $node.find(`.key-redeemer:has(.heading-text[data-title="${game.human_name}"])`);

                    if ($keyRedeemer.length > 0) {
                        const d = {
                            title: game.human_name,
                            app: parseInt(game.steam_app_id, 10)
                        };

                        d.owned = steam.isOwned(d);
                        d.wished = steam.isWished(d);

                        // apply owned effect on game title
                        if (d.owned) $keyRedeemer.addClass('SBSE_owned');
                        if (d.wished) $keyRedeemer.addClass('SBSE_wished');

                        // load SteamCN tooltip
                        steamCNTooltip.load(d);

                        // activation restrictions
                        let html = '';
                        const disallowed = game.disallowed_countries.map(function (c) {
                            return ISO2.get(c);
                        });
                        const exclusive = game.exclusive_countries.map(function (c) {
                            return ISO2.get(c);
                        });
                        const separator = config.get('language').includes('chinese') ? '、' : ', ';

                        if (disallowed.length > 0) html += `<p>${i18n.get('HBDisallowedCountries')}<br>${disallowed.join(separator)}</p>`;
                        if (exclusive.length > 0) html += `<p>${i18n.get('HBExclusiveCountries')}<br>${exclusive.join(separator)}</p>`;
                        if (disallowed.length > 0 || exclusive.length > 0) {
                            $(`<span class="SBSE_activationRestrictions">${i18n.get('HBActivationRestrictions')}</span>`).click(function () {
                                swal({
                                    title: `${game.human_name}<br>${i18n.get('HBActivationRestrictions')}`,
                                    html,
                                    type: 'info'
                                });
                            }).insertBefore($keyRedeemer.find('.heading-text > h4'));
                        }

                        // store data
                        $keyRedeemer.attr({
                            'data-machineName': game.machine_name,
                            'data-humanName': game.human_name,
                            'data-gameinfo': JSON.stringify(d)
                        });

                        $keyRedeemer.addClass('SBSE_processed');
                    }
                });
            });

            return function process(_x6) {
                return _ref4.apply(this, arguments);
            };
        })();
        const $container = getContainer(handlers);
        const $keyManager = $('.js-key-manager-holder');

        // narrow buttons
        $container.find('div > button').addClass('narrow');

        // at home page
        if ($keyManager.length > 0) {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    Array.from(mutation.addedNodes).forEach(addedNode => {
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
            // append checkbox for owned game
            $container.find('#SBSE_BtnSettings').before(`
                <label><input type="checkbox" class="SBSE_ChkSkipOwned" checked>${i18n.get('checkboxSkipOwned')}</label>
            `);

            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    Array.from(mutation.addedNodes).forEach((() => {
                        var _ref5 = _asyncToGenerator(function* (addedNode) {
                            const $node = $(addedNode);

                            if ($node.hasClass('key-list') || $node.find('.key-list').length > 0) {
                                observer.disconnect();
                                $node.closest('.whitebox-redux').before($container);

                                // fetch game heading & wrap heading
                                $node.find('.heading-text > h4').each(function (i, heading) {
                                    heading.parentElement.dataset.title = heading.innerText.trim();
                                    $(heading.firstChild).wrap('<span/>');
                                    $(heading).append($('<span class="SBSE_icon"></span>').mouseenter(steamCNTooltip.show.bind(steamCNTooltip)));
                                });

                                // fetch & process key data
                                process($node);

                                // override default popups
                                document.addEventListener('click', function (e) {
                                    const $target = $(e.target).closest('.keyfield');

                                    if ($target.length > 0 && !$target.hasClass('redeemed')) {
                                        e.stopPropagation();

                                        const $keyRedeemer = $target.closest('.key-redeemer');
                                        const machineName = $keyRedeemer.attr('data-machineName');

                                        if (machineName) {
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
                                        } else $target.click();
                                    }
                                }, true);
                            }
                        });

                        return function (_x7) {
                            return _ref5.apply(this, arguments);
                        };
                    })());
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    },
    dailyindiegame() {
        const MPHideList = JSON.parse(GM_getValue('SBSE_DIGMPHideList') || '[]');
        const pathname = location.pathname;

        if (pathname.includes('/account_page')) {
            // force sync library
            steam.sync(false);

            // inject css
            GM_addStyle(`
                .SBSE_container { padding: 5px; border: 1px solid #424242; }
                .SBSE_container > textarea { border: 1px solid #000; }
                .SBSE_container > div > button {
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
                        items: []
                    };

                    $('#TableKeys tr').each((i, tr) => {
                        const $tds = $(tr).children();
                        const key = $tds.eq(4).text().trim();

                        if (key.includes('-')) {
                            const d = {
                                title: $tds.eq(2).text().trim(),
                                key,
                                marketListing: $tds.eq(6).text().includes('Cancel trade')
                            };

                            activator.pushKeyDetails(d);
                            data.items.push(d);
                        }
                    });

                    return data;
                },
                reveal() {
                    const $form = $('#form3');

                    $('.quickaction').val(1);
                    $.ajax({
                        method: 'POST',
                        url: $form.attr('action'),
                        data: $form.serializeArray(),
                        success() {
                            location.reload();
                        }
                    });
                }
            };
            const $container = getContainer(handlers);

            // remove export button
            $container.find('.SBSE_BtnExport').remove();
            // append checkbox for market keys
            $container.find('#SBSE_BtnSettings').before(`
                <label><input type="checkbox" class="SBSE_ChkMarketListings">${i18n.get('checkboxMarketListings')}</label>
            `);

            $('#TableKeys').eq(0).before($container);

            // rate all positive
            const $awaitRatings = $('a[href^="account_page_0_ratepositive"]');

            if ($awaitRatings.length > 0) {
                $('#TableKeys td:contains(Rate TRADE)').text(i18n.get('DIGRateAllPositive')).css('cursor', 'pointer').click(() => {
                    $awaitRatings.each((() => {
                        var _ref6 = _asyncToGenerator(function* (i, a) {
                            const res = yield fetch(a.href, {
                                method: 'GET',
                                credentials: 'same-origin'
                            });

                            if (res.ok) $(a).parent('td').html('<span class="DIG3_14_Orange">Positive</span>');
                        });

                        return function (_x8, _x9) {
                            return _ref6.apply(this, arguments);
                        };
                    })());
                });
            }
            // DIG EasyBuy
        } else if (pathname === '/account_digstore.html' || pathname === '/account_trades.html' || pathname === '/account_tradesXT.html') {
            // inject css styles
            GM_addStyle(`
                .DIGEasyBuy_row { height: 30px; }
                .DIGEasyBuy button { padding: 4px 8px; outline: none; cursor: pointer; }
                .DIGEasyBuy_checked { background-color: #222; }
                .DIGEasyBuy_hideOwned tr.SBSE_hide { display: none; }
                .DIGEasyBuy_hideOwned tr.SBSE_hide + .SBSE_searchResults { display: none; }
                .SBSE_searchResults td { padding: 0 }
                .SBSE_searchResults iframe {
                    width: 100%; height: 300px;
                    display: none;
                    background-color: white;
                    border: none;
                }
                .SBSE_owned a[href*="steam"] .DIG3_14_Gray { color: #9ccc65; }
                .SBSE_wished a[href*="steam"] .DIG3_14_Gray { color: #29b6f6; }
                .SBSE_ignored a[href*="steam"] .DIG3_14_Gray { text-decoration: line-through;}
                #form3 #sortby { width: 250px; }
            `);

            // setup row data & event
            const easyBuySetup = (i, ele) => {
                const $game = $(ele);
                const $row = $game.closest('tr');

                $row.attr('data-id', $game.attr('href').replace(/\D/g, ''));
                $row.attr('data-price', parseInt($row.find('td:contains(DIG Points)').text(), 10) || 0);
                $row.click(() => {
                    $row.toggleClass('DIGEasyBuy_checked');
                });
                $row.addClass('DIGEasyBuy_row');
            };

            $('a[href^="account_buy"]').each(easyBuySetup);

            // check if owned / manually hid
            const check = (i, a) => {
                const $a = $(a);
                const $tr = $a.closest('tr');
                const data = a.pathname.slice(1).split('/');
                const steamID = parseInt(data[1], 10);
                const id = parseInt($tr.attr('data-id'), 10);
                const d = { [data[0]]: steamID };

                if (steam.isOwned(d)) $tr.addClass('SBSE_owned SBSE_hide');
                if (steam.isWished(d)) $tr.addClass('SBSE_wished');
                if (steam.isIgnored(d)) $tr.addClass('SBSE_ignored');
                if (MPHideList.includes(id)) $tr.addClass('SBSE_hide');

                // append manual hide feature
                $tr.children().eq(0).attr('title', i18n.get('DIGClickToHideThisRow')).click(e => {
                    e.stopPropagation();

                    if (id > 0) {
                        MPHideList.push(id);
                        GM_setValue('SBSE_DIGMPHideList', JSON.stringify(MPHideList));

                        $tr.addClass('SBSE_hide');
                    }
                });

                // no appID found, pre-load Google search result
                if (steamID === -1 && !MPHideList.includes(id)) {
                    const $game = $a.find('span');
                    const gameTitle = encodeURIComponent($game.text().trim()).replace(/%20/g, '+');
                    const map = {
                        '&': '&amp;',
                        '<': '&lt;',
                        '>': '&gt;',
                        '"': '&quot;',
                        "'": '&#039;'
                    };

                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://www.google.com/search?q=steam+${gameTitle}`,
                        onload: res => {
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
                            html = html.replace(/\/images\//g, 'https://www.google.com/images/').replace(/\/url\?/g, 'https://www.google.com/url?');

                            $tr.after(`
                                <tr class="SBSE_searchResults">
                                    <td colspan="11"><iframe sandbox="allow-scripts" srcdoc='${html.replace(/[&<>"']/g, m => map[m])}'></frame></td>
                                </tr>
                            `);
                        }
                    });

                    $game.unwrap('a').css({
                        cursor: 'pointer',
                        color: 'red'
                    }).click(e => {
                        e.stopPropagation();

                        $tr.next('.SBSE_searchResults').find('iframe').slideToggle('fast');
                    });
                }
            };

            $('tr a[href*="steampowered"]').each(check);

            // append menu buttons
            const $target = $('#form3').closest('tr').children().eq(0);
            const $DIGEasyBuy = $(`
                <div class="DIGEasyBuy">
                    <button class="DIGButtonPurchase DIG3_Orange_15_Form">${i18n.get('DIGEasyBuyPurchase')}</button>
                    <button class="DIGButtonSelectAll DIG3_Orange_15_Form">${i18n.get('DIGEasyBuySelectAll')}</button>
                    <button class="DIGButtonHideOwned DIG3_Orange_15_Form">${i18n.get('DIGEasyBuyHideOwned')}</button>
                </div>
            `);

            if ($target.children().length > 0) {
                const $tr = $('<tr/>');

                $tr.append($target.clone());
                $target.parent().before($tr);
            }

            $target.empty().append($DIGEasyBuy);

            if (pathname === '/account_tradesXT.html') {
                $DIGEasyBuy.append(`
                    <button class="DIGButtonLoadAllPages DIG3_Orange_15_Form">${i18n.get('DIGEasyBuyLoadAllPages')}</button>
                `);
            }

            // append sync time and event
            const seconds = Math.round((Date.now() - steam.lastSync()) / 1000);

            $DIGEasyBuy.append(`
                <span> ${i18n.get('lastSyncTime').replace('%seconds%', seconds)}</span>
            `);

            // bind button event
            $('.DIGButtonPurchase').click(e => {
                let bought = 0;
                let balance = parseFloat($('a[href^="account_transac"]').parent('div').text().slice(19)) || 0;
                const $self = $(e.currentTarget);

                $self.prop('disabled', true).text(i18n.get('DIGButtonPurchasing'));

                $('.DIGEasyBuy_checked').each((() => {
                    var _ref7 = _asyncToGenerator(function* (i, ele) {
                        const $ele = $(ele);
                        const id = $ele.data('id');
                        const price = parseInt($ele.data('price'), 10);

                        if (id && price > 0) {
                            if (balance - price > 0) {
                                let url = `${location.origin}/account_buy.html`;
                                const requestInit = {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                    body: `quantity=1&xgameid=${id}&xgameprice1=${price}&send=Purchase`,
                                    mode: 'same-origin',
                                    credentials: 'same-origin',
                                    cache: 'no-store',
                                    referrer: `${location.origin}/account_buy_${id}.html`
                                };

                                if (pathname === '/account_trades.html' || pathname === '/account_tradesXT.html') {
                                    url = `${location.origin}/account_buytrade_${id}.html`;
                                    requestInit.body = `gameid=${id}&send=Purchase`;
                                    requestInit.referrer = url;
                                }

                                const res = yield fetch(url, requestInit);

                                if (res.ok) {
                                    $ele.click();
                                    bought += 1;
                                    balance -= price;
                                }
                            } else {
                                swal({
                                    title: i18n.get('failTitle'),
                                    text: i18n.get('DIGInsufficientFund'),
                                    type: 'error'
                                }).then(function () {
                                    window.location = `${location.origin}/account_page.html`;
                                });
                            }
                        }
                    });

                    return function (_x10, _x11) {
                        return _ref7.apply(this, arguments);
                    };
                })());

                if (bought) window.location = `${location.origin}/account_page.html`;else $self.prop('disabled', false).text(i18n.get('DIGButtonPurchase'));
            });
            $('.DIGButtonSelectAll').click(e => {
                const $self = $(e.currentTarget);
                const state = !$self.data('state');
                const selector = $('.DIGEasyBuy_hideOwned').length > 0 ? '.DIGEasyBuy_row:not(.SBSE_hide)' : '.DIGEasyBuy_row';

                $(selector).toggleClass('DIGEasyBuy_checked', state);
                $self.data('state', state);
                $self.text(state ? i18n.get('DIGEasyBuySelectCancel') : i18n.get('DIGEasyBuySelectAll'));
            });
            $('.DIGButtonHideOwned').click(e => {
                const $self = $(e.currentTarget);
                const state = !$self.data('state');

                $('#TableKeys').toggleClass('DIGEasyBuy_hideOwned', state);
                $self.data('state', state);
                $self.text(state ? i18n.get('DIGEasyBuyShowOwned') : i18n.get('DIGEasyBuyHideOwned'));
            });
            $('.DIGButtonLoadAllPages').click(e => {
                // auto load all pages at marketplace
                const $self = $(e.currentTarget);
                const $tbody = $('#TableKeys > tbody');
                const load = (() => {
                    var _ref8 = _asyncToGenerator(function* (page, retry = 0) {
                        $self.text(i18n.get('DIGEasyBuyLoading').replace('%page%', page));

                        const res = yield fetch(`${location.origin}/account_tradesXT_${page}.html`, {
                            method: 'GET',
                            credentials: 'same-origin'
                        });

                        if (res.ok) {
                            const $result = $((yield res.text())).find('#TableKeys tr.DIG3_14_Gray');

                            if ($result.length > 0) {
                                $result.find('a[href^="account_buy"]').each(easyBuySetup);
                                $result.find('a[href*="steampowered"]').each(check);
                                $tbody.append($result);
                                load(page + 1);
                            } else $self.text(i18n.get('DIGEasyBuyLoadingComplete'));
                        } else if (retry < 3) load(page, retry + 1);else load(page + 1);
                    });

                    return function load(_x12) {
                        return _ref8.apply(this, arguments);
                    };
                })();

                load(1);
                $self.prop('disabled', true);
            });
            // extension for creating trade at market place
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
                $steamKey.blur(e => {
                    const $self = $(e.delegateTarget);
                    const key = $self.val().match(regKey);

                    if (key) $self.val(key[0]);
                });
                $steamKey.attr({
                    size: 50,
                    maxlength: 200
                });

                // search for current market price when click dropdown menu
                const $searchResult = $('<div/>');

                $gameTitle.closest('table').after($searchResult);
                $searchResult.before(`<h3>${i18n.get('DIGMarketSearchResult')}</h3>`);

                $('.tt-dropdown-menu').click(_asyncToGenerator(function* () {
                    $searchResult.empty();

                    const res = yield fetch(`${location.origin}/account_tradesXT.html`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: `search=${encodeURIComponent($gameTitle.val()).replace(/%20/g, '+')}&button=SEARCH`,
                        credentials: 'same-origin'
                    });
                    const result = res.ok ? $((yield res.text())).find('#TableKeys') : 'Network response was not ok.';

                    $searchResult.append(result);
                }));

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

                if (IsSucceed) $anchor.after('<div class="check icon"></div>');else $anchor.after('<div class="remove icon"></div>');
            }
        }
    },
    ccyycn() {
        // inject css
        GM_addStyle(`
            .SBSE_container {
                width: 80%;
                margin: 0 auto;
                font-size: 16px;
                color: #000;
            }
            .SBSE_container > textarea {
                background-color: #EEE;
                box-shadow: 0 0 1px 1px rgba(204,204,204,0.5);
                border-radius: 5px;
            }
            .SBSE_container > div { text-align: left; }
            .SBSE_container > div > button, .SBSE_container > div > a {
                width: 80px;
                border: 1px solid #2e6da4;
                border-radius: 5px;
                background-color: #337ab7;
                color: #FFF;
            }
            .SBSE_container > div > a:hover { text-decoration: none; opacity: 0.9; }
            .SBSE_container label { color: #EEE; }
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
                    items: []
                };

                $('.deliver-gkey:contains(-)').each((i, ele) => {
                    const $ele = $(ele);
                    const d = {
                        title: $ele.parent().prev().text().trim(),
                        key: $ele.text().trim()
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

                $revealBtn.addClass('working');

                handler($('.deliver-btn'), () => {
                    $revealBtn.removeClass('working');
                    $('.SBSE_BtnRetrieve').click();
                });
            }
        };
        const $container = getContainer(handlers);

        // narrow buttons
        $container.find('button').addClass('narrow');

        // insert textarea
        $('.featurette-divider').eq(0).after($container);
    },
    groupees() {
        if (location.pathname.startsWith('/profile/')) {
            // inject css
            GM_addStyle(`
                .SBSE_container > textarea, .SBSE_container > div > button, .SBSE_container > div > a {
                    background: transparent;
                    border: 1px solid #8cc53f;
                    border-radius: 3px;
                    color: #8cc53f;
                    transition: all 0.8s ease;
                }
                .SBSE_container > div > button:hover, .SBSE_container > div > a:hover {
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
                        items: []
                    };

                    $('.key-block input.code').each((i, ele) => {
                        const $ele = $(ele);
                        const key = $ele.val();

                        if (key.includes('-')) {
                            const $titleEle = $ele.closest('tr').prev().find('td:nth-of-type(3)');
                            const d = {
                                title: $titleEle.text().trim(),
                                key,
                                used: !!$ele.closest('.key-block').find('.key-status:contains(used)').length
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

                    $revealBtn.addClass('working');

                    const $reveals = $('.product:has(img[title*=Steam]) .reveal-product');
                    const timer = $reveals.length > 0 ? 1500 : 0;

                    $reveals.click();
                    setTimeout(() => {
                        handler($('.btn-reveal-key'), () => {
                            $revealBtn.removeClass('working');
                            $('.SBSE_BtnRetrieve').click();
                        });
                    }, timer);
                }
            };
            const $container = getContainer(handlers);

            // append checkbox for used-key
            $('#SBSE_BtnSettings').before(`
                <label><input type="checkbox" class="SBSE_ChkSkipUsed" checked>${i18n.get('checkboxSkipUsed')}</label>
            `);

            // insert container
            $('.table-products').before($container);

            // load details
            $('img[src*="steam.svg"]').each((() => {
                var _ref10 = _asyncToGenerator(function* (index, ele) {
                    $.ajax({
                        url: $(ele).closest('tr').find('.item-link').attr('href'),
                        data: { v: 1 },
                        dataType: 'script'
                    });
                });

                return function (_x13, _x14) {
                    return _ref10.apply(this, arguments);
                };
            })());

            // bind custom event
            $(document).on('activated', (e, key, result) => {
                if (result.success === 1) $(`.btn-steam-redeem[href*=${key}]`).next('.key-usage-toggler').click();
            });
        } else {
            // inject css
            GM_addStyle(`
                .SBSE_container { margin-bottom: 20px; }
                .SBSE_container > textarea { background-color: #EEE; border-radius: 3px; }
                .SBSE_container > div > button, .SBSE_container > div > a { outline: none !important; }
                .SBSE_container > div > a {
                    -webkit-appearance: button;
                    -moz-appearance: button;
                    padding: 3px 6px;
                    color: inherit;
                    text-decoration: none;
                }
                #SBSE_BtnSettings { margin-top: 8px; }
            `);

            const handlers = {
                extract() {
                    const bundleTitle = $('.expanded .caption').text().trim();
                    const data = {
                        title: bundleTitle,
                        filename: `Groupees ${bundleTitle} Keys`,
                        items: []
                    };

                    $('.expanded .code').each((i, ele) => {
                        const $ele = $(ele);
                        const d = {
                            title: $ele.closest('.details').find('h3').text().trim(),
                            key: $ele.val(),
                            used: $ele.closest('li').find('.usage').prop('checked')
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

                    $revealBtn.addClass('working');

                    const $reveals = $('.product:has(img[title*=Steam]) .reveal-product');
                    const timer = $reveals.length > 0 ? 1500 : 0;

                    $reveals.click();
                    setTimeout(() => {
                        handler($('.expanded .reveal'), () => {
                            $revealBtn.removeClass('working');
                            $('.SBSE_BtnRetrieve').click();
                        });
                    }, timer);
                }
            };
            const $container = getContainer(handlers);

            // append checkbox for used-key
            $container.find('#SBSE_BtnSettings').before($(`
                <label><input type="checkbox" class="SBSE_ChkSkipUsed" checked>${i18n.get('checkboxSkipUsed')}</label>
            `));
            // add buttons style via groupees's class
            $container.find('.SBSE_container > div > button, .SBSE_container > div > a').addClass('btn btn-default');

            // insert container
            $('.container > div').eq(1).before($container);

            // append mark all as used button
            new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    Array.from(mutation.addedNodes).forEach(addedNode => {
                        const $orderMeta = $(addedNode).find('.order-meta');

                        if ($orderMeta.length > 0) {
                            $orderMeta.after($(`<button class="btn btn-default" style="margin-right: 10px;"><b>${i18n.get('markAllAsUsed')}</b></button>`).click(() => {
                                $('.expanded .usage').each((i, checkbox) => {
                                    if (!checkbox.checked) checkbox.click();
                                });
                            }));
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
                .SBSE_container > textarea { border: 1px solid #AAAAAA; }
                .SBSE_container > div > button, .SBSE_container > div > a {
                    border: 1px solid #d3d3d3;
                    background: #e6e6e6 url(images/ui-bg_glass_75_e6e6e6_1x400.png) 50% 50% repeat-x;
                    color: #555555;
                }
                .SBSE_container > div > button:hover, .SBSE_container > div > a:hover {
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
                        items: []
                    };

                    keys.forEach(key => {
                        data.items.push({ key });
                    });

                    return data;
                }
            };
            const $container = getContainer(handlers);

            $container.find('.SBSE_BtnReveal').remove(); // remove reveal

            // insert container
            $('#tabs').eq(0).prepend($container);
        }
    },
    steamcn() {
        if (location.pathname.startsWith('/tooltip')) {
            GM_addStyle('body { overflow: hidden; }');
        }
    }
};
const init = () => {
    config.init();
    i18n.init();
    xe.init();
    steam.init();

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
                            timer: 3000
                        });
                    });
                }
            }
        }
    } else {
        const site = location.hostname.replace(/(www|alds|bundle|steamdb)\./, '').split('.').shift();

        // check sessionID
        if (!config.get('sessionID')) getSessionID();

        if (has.call(siteHandlers, site)) siteHandlers[site](true);
    }

    steamCNTooltip.listen();
};

$(init);
