// ==UserScript==
// @name         Steam Bundle Sites Extension
// @namespace    http://tampermonkey.net/
// @version      1.9.3
// @updateURL    https://github.com/clancy-chao/Steam-Bundle-Sites-Extension/raw/master/SBSE.meta.js
// @downloadURL  https://github.com/clancy-chao/Steam-Bundle-Sites-Extension/raw/master/SBSE.user.js
// @description  A steam bundle sites' tool kits.
// @icon         http://store.steampowered.com/favicon.ico
// @author       Bisumaruko, Cloud
// @include      http*://store.steampowered.com/*
// @include      https://www.indiegala.com/gift*
// @include      https://www.indiegala.com/profile*
// @include      https://www.indiegala.com/game*
// @include      http*://*bundlestars.com/*
// @include      https://www.fanatical.com/*
// @include      https://www.humblebundle.com/downloads*
// @include      https://www.humblebundle.com/home/*
// @include      http*://*dailyindiegame.com/*
// @include      http*://bundle.ccyycn.com/order/*
// @include      https://groupees.com/purchases
// @include      http*://*agiso.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/6.6.6/sweetalert2.min.js
// @resource     SweetAlert2CSS https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/6.6.6/sweetalert2.min.css
// @connect      store.steampowered.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-start
// @noframes
// ==/UserScript==

/* global GM_xmlhttpRequest, GM_setValue, GM_getValue, GM_addStyle, GM_getResourceText,
   swal, g_AccountID, g_sessionID, g_oSuggestParams,
   window, document, location, fetch, localStorage, MutationObserver, Option */

// setup jQuery
const $ = jQuery.noConflict(true);

$.fn.pop = [].pop;
$.fn.shift = [].shift;

// inject swal css
GM_addStyle(GM_getResourceText('SweetAlert2CSS'));

// inject script css
GM_addStyle(`
    pre.SBSE_errorMsg {
        height: 200px;
        text-align: left;
        white-space: pre-wrap;
    }
`);

// load up
const regKey = /((?:([A-Z0-9])(?!\2{4})){5}-){2,5}[A-Z0-9]{5}/g;
const eol = "\r\n";

const has = Object.prototype.hasOwnProperty;
const unique = a => [...new Set(a)];

const owned = JSON.parse(localStorage.getItem('SBSE_owned') || '{}');
const activated = {
    data: JSON.parse(GM_getValue('SBSE_activated') || '[]'),
    push(key) {
        this.data.push(key);
        GM_setValue('SBSE_activated', JSON.stringify(this.data));
    },
    check(key) {
        return this.data.includes(key);
    }
};
const config = {
    data: JSON.parse(GM_getValue('SBSE_config') || '{}'),
    set(key, value, callback = null) {
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
    }
};
const keyDetails = {
    data: {},
    set(key = '', obj) {
        if (key.length > 0) {
            obj.title = has.call(obj, 'title') ? obj.title.trim() : '';
            if (has.call(obj, 'app')) obj.app = parseInt(obj.app, 10);
            if (has.call(obj, 'sub')) obj.sub = parseInt(obj.sub, 10);
            if (has.call(obj, 'url')) {
                const matched = obj.url.match(/steam.+\/(app|sub)\/(\d+)/);

                if (matched) obj[matched[1]] = parseInt(matched[2], 10);
            }

            this.data[key] = obj;
        }
    },
    get(key) {
        return has.call(this.data, key) ? this.data[key] : null;
    },
    isOwned(key) {
        const detail = this.data[key];

        if (detail && owned.app.includes(detail.app)) return true;
        if (detail && owned.sub.includes(detail.sub)) return true;

        return false;
    }
};

config.init();

// text
const i18n = {
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
        settingsLanguage: '語言',
        settingsPreselectIncludeTitle: '預選包括遊戲名',
        settingsTitleComesLast: '遊戲名置後',
        settingsPreselectJoinKeys: '預選合併序號',
        settingsJoinKeysASFStyle: '合併ASF 格式序號',
        DIGEasyBuyPurchase: '購買',
        DIGEasyBuySelectAll: '全選',
        DIGEasyBuySelectCancel: '取消',
        DIGButtonPurchasing: '購買中',
        DIGInsufficientFund: '餘額不足，準備回到帳號頁',
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
        selectConnector: '至',
        markAllAsUsed: '標記全部已使用'
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
        settingsLanguage: '语言',
        settingsPreselectIncludeTitle: '预选包括游戏名',
        settingsTitleComesLast: '游戏名置后',
        settingsPreselectJoinKeys: '预选合并激活码',
        settingsJoinKeysASFStyle: '合并ASF 格式激活码',
        DIGEasyBuyPurchase: '购买',
        DIGEasyBuySelectAll: '全选',
        DIGEasyBuySelectCancel: '取消',
        DIGButtonPurchasing: '购买中',
        DIGInsufficientFund: '余额不足，准备回到账号页',
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
        selectConnector: '至',
        markAllAsUsed: '标记全部已使用'
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
        settingsLanguage: 'Language',
        settingsPreselectIncludeTitle: 'Pre-select Include Title',
        settingsTitleComesLast: 'Title Comes Last',
        settingsPreselectJoinKeys: 'Pre-select Join Keys',
        settingsJoinKeysASFStyle: 'Join Keys w/ ASF Style',
        DIGEasyBuyPurchase: 'Purchase',
        DIGEasyBuySelectAll: 'Select All',
        DIGEasyBuySelectCancel: 'Cancel',
        DIGButtonPurchasing: 'Purchassing',
        DIGInsufficientFund: 'Insufficient fund, returning to account page',
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
        selectConnector: 'to',
        markAllAsUsed: 'Mark All as Used'
    }
};
let text = has.call(i18n, config.get('language')) ? i18n[config.get('language')] : i18n.english;

// inject settings panel css
GM_addStyle(`
    .SBSE_settings .name {
        text-align: right;
        vertical-align: top;
    }
    .SBSE_settings .value {
        text-align: left;
    }
    .SBSE_settings .value > * {
        height: 30px;
        margin: 0 20px 10px;
    }
    .SBSE_settings .switch {
        position: relative;
        display: inline-block;
        width: 60px;
    }
    .SBSE_settings .switch input {
        display: none;
    }
    .SBSE_settings .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: 0.4s;
    }
    .SBSE_settings .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: 0.4s;
    }
    .SBSE_settings input:checked + .slider {
        background-color: #2196F3;
    }
    .SBSE_settings input:focus + .slider {
        box-shadow: 0 0 1px #2196F3;
    }
    .SBSE_settings input:checked + .slider:before {
        transform: translateX(30px);
    }
    .SBSE_settings > span {
        display: inline-block;
        cursor: pointer;
        color: white;
    }
`);

// functions
const getSessionID = () => {
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'http://store.steampowered.com/',
        onload: res => {
            if (res.status === 200) {
                const accountID = res.response.match(/g_AccountID = (\d+)/).pop();
                const sessionID = res.response.match(/g_sessionID = "(\w+)"/).pop();

                if (accountID > 0) config.set('sessionID', sessionID);else {
                    swal({
                        title: text.notLoggedInTitle,
                        text: text.notLoggedInMsg,
                        type: 'error',
                        showCancelButton: true
                    }).then(() => {
                        window.open('http://store.steampowered.com/');
                    });
                }
            }
        }
    });
};
const settings = {
    construct() {
        const panelHTML = `
            <div class="SBSE_settings">
                <table>
                    <tr>
                        <td class="name">${text.settingsAutoUpdateSessionID}</td>
                        <td class="value">
                            <label class="switch">
                                <input type="checkbox" class="autoUpdateSessionID">
                                <span class="slider"></span>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <td class="name">${text.settingsSessionID}</td>
                        <td class="value">
                            <input type="text" class="sessionID" value="${config.get('sessionID')}">
                        </td>
                    </tr>
                    <tr>
                        <td class="name">${text.settingsLanguage}</td>
                        <td class="value">
                            <select class="language"></select>
                        </td>
                    </tr>
                    <tr>
                        <td class="name">${text.settingsPreselectIncludeTitle}</td>
                        <td class="value">
                            <label class="switch">
                                <input type="checkbox" class="preselectIncludeTitle">
                                <span class="slider"></span>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <td class="name">${text.settingsTitleComesLast}</td>
                        <td class="value">
                            <label class="switch">
                                <input type="checkbox" class="titleComesLast">
                                <span class="slider"></span>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <td class="name">${text.settingsPreselectJoinKeys}</td>
                        <td class="value">
                            <label class="switch">
                                <input type="checkbox" class="preselectJoinKeys">
                                <span class="slider"></span>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <td class="name">${text.settingsJoinKeysASFStyle}</td>
                        <td class="value">
                            <label class="switch">
                                <input type="checkbox" class="joinKeysASFStyle">
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
            title: text.settingsTitle,
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

        // language
        Object.keys(i18n).forEach(language => {
            $language.append(new Option(i18n[language].name, language));
        });
        $panel.find(`option[value=${config.get('language')}]`).prop('selected', true);
        $language.change(() => {
            swal.showLoading();

            const newLanguage = $language.val();
            config.set('language', newLanguage);

            text = has.call(i18n, newLanguage) ? i18n[newLanguage] : i18n.english;

            setTimeout(swal.hideLoading, 500);
        });
    }
};
const activateHandler = {
    keys: [],
    results: {},
    updateResults(txt = null) {
        const $textarea = $('.SBSE_container > textarea');

        if (txt) $textarea.val(txt);else {
            const results = this.results;
            const parsed = [];

            Object.values(results).forEach(result => {
                parsed.push(result.join(' | '));
            });

            $textarea.val(parsed.join(eol));
        }
    },
    getResultStatus(result) {
        let status = text.failStatus;
        let statusMsg = text.failDetailUnexpected;
        const errors = {
            14: text.failDetailInvalidKey,
            15: text.failDetailUsedKey,
            53: text.failDetailRateLimited,
            13: text.failDetailCountryRestricted,
            9: text.failDetailAlreadyOwned,
            24: text.failDetailMissingBaseGame,
            36: text.failDetailPS3Required,
            50: text.failDetailGiftWallet
        };

        if (result.success === 1) {
            status = text.successStatus;
            statusMsg = text.successDetail;
        } else if (result.success === 2) {
            if (has.call(errors, result.purchase_result_details)) {
                statusMsg = errors[result.purchase_result_details];
            }
        }

        return `${status}/${statusMsg}`;
    },
    getResultItems(info) {
        const descriptions = [];

        if (info && info.line_items) {
            info.line_items.forEach(item => {
                const description = [];

                if (item.packageid > 0) description.push(`sub: ${item.packageid}`);
                if (item.appid > 0) description.push(`app: ${item.appid}`);
                description.push(item.line_item_description);

                descriptions.push(description.join(' '));
            });
        }

        return descriptions.join(', ');
    },
    activateKey(callback) {
        const self = this;
        const key = self.keys.shift();

        if (key) {
            if (activated.check(key)) {
                self.results[key].push(`${text.skippedStatus}/${text.activatedDetail}`, text.noItemDetails);
                self.updateResults();

                // next key
                self.activateKey(callback);
            } else if (keyDetails.isOwned(key)) {
                const detail = keyDetails.get(key);
                const itemDetail = `${detail.app || detail.sub}, ${detail.title}`;

                self.results[key].push(`${text.skippedStatus}/${text.failDetailAlreadyOwned}`, itemDetail);
                self.updateResults();

                // next key
                self.activateKey(callback);
            } else {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://store.steampowered.com/account/ajaxregisterkey/',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        Origin: 'https://store.steampowered.com',
                        Referer: 'https://store.steampowered.com/account/registerkey'
                    },
                    data: `product_key=${key}&sessionid=${config.get('sessionID')}`,
                    onload: res => {
                        if (res.status === 200) {
                            let status = '';
                            let items = '';

                            try {
                                const result = JSON.parse(res.response);

                                status = self.getResultStatus(result);
                                items = self.getResultItems(result.purchase_receipt_info);

                                // update activated
                                const failCode = result.purchase_result_details;
                                if (result.success === 1 || [14, 15, 9].includes(failCode)) {
                                    activated.push(key);

                                    // dispatch activated event
                                    $(document).trigger('activated', [key, result]);
                                }
                            } catch (e) {
                                status = `${text.failStatus}/${text.failDetailParsingFailed}`;
                                items = text.noItemDetails;
                            }

                            self.results[key].push(status, items);
                            self.updateResults();

                            // next key
                            setTimeout(self.activateKey.bind(self, callback), 2000);
                        } else {
                            const errorMsg = [];

                            errorMsg.push('<pre class="SBSE_errorMsg">');
                            errorMsg.push(`sessionID: ${config.get('sessionID') + eol}`);
                            errorMsg.push(`autoUpdate: ${config.get('autoUpdateSessionID') + eol}`);
                            errorMsg.push(`status: ${res.status + eol}`);
                            errorMsg.push(`response: ${res.response + eol}`);
                            errorMsg.push('</pre>');

                            swal({
                                title: text.failTitle,
                                html: text.failDetailRequestFailedNeedUpdate + eol + errorMsg.join(''),
                                type: 'error'
                            });
                            getSessionID();
                            callback();
                        }
                    }
                });
            }
        } else callback();
    },
    activateKeys(input, callback) {
        const self = this;
        const keys = unique(input.match(regKey));

        if (keys.length > 0) {
            keys.forEach(key => {
                self.results[key] = [key];
            });
            self.keys = Object.keys(self.results);
            self.updateResults();
            self.activateKey(callback);
        } else {
            self.updateResults(text.emptyInput);
            callback();
        }
    }
};
const bundleSitesBoxHandler = {
    reveal(handler, $games) {
        const $reveal = $('.SBSE_BtnReveal');

        $reveal.addClass('working');

        handler($games, () => {
            $reveal.removeClass('working');
            $('.SBSE_BtnRetrieve').click();
        });
    },
    retrieve(data) {
        if (data.length > 0) {
            const includeTitle = !!$('.SBSE_ChkTitle:checked').length;
            const joinKeys = !!$('.SBSE_ChkJoin:checked').length;
            const separator = joinKeys ? ',' : eol;
            const prefix = joinKeys && config.get('joinKeysASFStyle') ? '!redeem ' : '';
            const keys = [];

            data.forEach(d => {
                if (typeof d === 'string') {
                    keys.push(d);
                } else {
                    const temp = [d.key];

                    if (includeTitle) temp.unshift(d.title);
                    if (config.get('titleComesLast')) temp.reverse();

                    keys.push(temp.join(', '));
                }
            });

            $('.SBSE_container > textarea').val(prefix + keys.join(separator));
        }
    },
    activate(e) {
        const $self = $(e.delegateTarget);
        const $textarea = $('.SBSE_container > textarea');
        let input = $textarea.val().trim();

        if (input.length === 0) {
            $('.SBSE_BtnRetrieve').click();
            input = $textarea.val();
        }

        $self.prop('disabled', true).addClass('working');
        $textarea.attr('disabled', '');

        activateHandler.activateKeys(input, () => {
            $self.prop('disabled', false).removeClass('working');
            $textarea.removeAttr('disabled');
        });
    },
    copy() {
        $('.SBSE_container > textarea').select();
        document.execCommand('copy');
    },
    reset() {
        $('.SBSE_container > textarea').val('');
    },
    export(data, title) {
        // data: [{key: ..., title: ...}, ...]
        const $export = $('.SBSE_BtnExport');

        $export.removeAttr('href').removeAttr('download');

        if (Array.isArray(data) && data.length > 0) {
            const filename = title.replace(/[\\/:*?"<>|!]/g, '');
            const formattedData = data.map(line => `${line.title.replace(/,/g, ' ')},${line.key}`).join(eol);

            $export.attr('href', `data:text/csv;charset=utf-8,\ufeff${encodeURIComponent(formattedData)}`).attr('download', `${filename}.csv`);
        }
    },
    settings() {
        settings.display();
    }
};
const bundleSitesBox = () => {
    GM_addStyle(`
        .SBSE_container {
            width: 100%;
            height: 200px;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
        }
        .SBSE_container > textarea {
            width: 100%;
            height: 150px;
            padding: 5px;
            border: none;
            box-sizing: border-box;
            resize: none;
            outline: none;
        }
        .SBSE_container > div {
            width: 100%;
            padding-top: 5px;
            box-sizing: border-box;
        }
        .SBSE_container > div > button, .SBSE_container > div > a {
            width: 120px;
            position: relative;
            margin-right: 10px;
            line-height: 28px;
            box-sizing: border-box;
            outline: none;
            cursor: pointer;
            transition: all 0.5s;
        }
        .SBSE_container > div > a {
            display: inline-block;
            text-align: center;
        }
        .SBSE_container label { margin-right: 10px; }
        #SBSE_BtnSettings {
            width: 20px;
            height: 20px;
            float: right;
            margin-top: 3px;
            margin-right: 0;
            margin-left: 10px;
            background-color: transparent;
            background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGhlaWdodD0iMzJweCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzIgMzI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjMycHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnIGlkPSJMYXllcl8xIi8+PGcgaWQ9ImNvZyI+PHBhdGggZD0iTTMyLDE3Ljk2OXYtNGwtNC43ODEtMS45OTJjLTAuMTMzLTAuMzc1LTAuMjczLTAuNzM4LTAuNDQ1LTEuMDk0bDEuOTMtNC44MDVMMjUuODc1LDMuMjUgICBsLTQuNzYyLDEuOTYxYy0wLjM2My0wLjE3Ni0wLjczNC0wLjMyNC0xLjExNy0wLjQ2MUwxNy45NjksMGgtNGwtMS45NzcsNC43MzRjLTAuMzk4LDAuMTQxLTAuNzgxLDAuMjg5LTEuMTYsMC40NjlsLTQuNzU0LTEuOTEgICBMMy4yNSw2LjEyMWwxLjkzOCw0LjcxMUM1LDExLjIxOSw0Ljg0OCwxMS42MTMsNC43MDMsMTIuMDJMMCwxNC4wMzF2NGw0LjcwNywxLjk2MWMwLjE0NSwwLjQwNiwwLjMwMSwwLjgwMSwwLjQ4OCwxLjE4OCAgIGwtMS45MDIsNC43NDJsMi44MjgsMi44MjhsNC43MjMtMS45NDVjMC4zNzksMC4xOCwwLjc2NiwwLjMyNCwxLjE2NCwwLjQ2MUwxNC4wMzEsMzJoNGwxLjk4LTQuNzU4ICAgYzAuMzc5LTAuMTQxLDAuNzU0LTAuMjg5LDEuMTEzLTAuNDYxbDQuNzk3LDEuOTIybDIuODI4LTIuODI4bC0xLjk2OS00Ljc3M2MwLjE2OC0wLjM1OSwwLjMwNS0wLjcyMywwLjQzOC0xLjA5NEwzMiwxNy45Njl6ICAgIE0xNS45NjksMjJjLTMuMzEyLDAtNi0yLjY4OC02LTZzMi42ODgtNiw2LTZzNiwyLjY4OCw2LDZTMTkuMjgxLDIyLDE1Ljk2OSwyMnoiIHN0eWxlPSJmaWxsOiM0RTRFNTA7Ii8+PC9nPjwvc3ZnPg==);
            background-size: contain;
            background-repeat: no-repeat;
            background-origin: border-box;
            border: none;
            vertical-align: top;
        }
    `);

    // spinner button affect
    GM_addStyle(`
        .SBSE_container > div > button:before {
            content: '';
            position: absolute;
            margin-top: 5px;
            right: 10px;
            width: 20px;
            height: 20px;
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
    `);

    const $container = $(`
        <div class="SBSE_container">
            <textarea></textarea>
            <div>
                <button class="SBSE_BtnReveal">${text.buttonReveal}</button>
                <button class="SBSE_BtnRetrieve">${text.buttonRetrieve}</button>
                <button class="SBSE_BtnActivate">${text.buttonActivate}</button>
                <button class="SBSE_BtnCopy">${text.buttonCopy}</button>
                <button class="SBSE_BtnReset">${text.buttonReset}</button>
                <a class="SBSE_BtnExport">${text.buttonExport}</a>
                <label><input type="checkbox" class="SBSE_ChkTitle">${text.checkboxIncludeGameTitle}</label>
                <label><input type="checkbox" class="SBSE_ChkJoin">${text.checkboxJoinKeys}</label>
                <button id="SBSE_BtnSettings"> </button>
            </div>
        </div>
    `);

    // bind event
    $container.find('.SBSE_BtnCopy').click(bundleSitesBoxHandler.copy);
    $container.find('.SBSE_BtnReset').click(bundleSitesBoxHandler.reset);
    $container.find('.SBSE_BtnActivate').click(bundleSitesBoxHandler.activate);
    $container.find('#SBSE_BtnSettings').click(bundleSitesBoxHandler.settings);

    // apply settings
    if (config.get('preselectIncludeTitle')) $container.find('.SBSE_ChkTitle').prop('checked', true);
    if (config.get('preselectJoinKeys')) $container.find('.SBSE_ChkJoin').prop('checked', true);

    return $container;
};
const siteCache = {
    fanatical: {
        doms: ['.account-content']
    },
    bundlestars: {
        doms: [document]
    }
};
const siteHandlers = {
    indiegala() {
        const $box = bundleSitesBox();
        // insert textarea
        $('#library-contain').eq(0).before($box);

        // support for new password protected gift page
        const $node = $('#gift-contents');

        if ($node.length > 0) {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    Array.from(mutation.addedNodes).forEach(addedNode => {
                        if (addedNode.id === 'library-contain') {
                            $node.prepend($box);
                            observer.disconnect();
                        }
                    });
                });
            });

            observer.observe($node[0], { childList: true });
        }

        // inject css
        GM_addStyle(`
            .SBSE_container { margin-top: 10px; }
            .SBSE_container > textarea { border: 1px solid #CC001D; border-radius: 3px; }
            .SBSE_container > div > button, .SBSE_container > div > a { width: 100px; background-color: #CC001D; color: white; border-radius: 3px; }
            .SBSE_container > div > a:hover { color: white; }
        `);

        // dom source
        const source = location.pathname === '/profile' ? 'div[id*="_sale_"].collapse.in' : document;
        const extractKeys = () => {
            const keys = [];

            $(source).find('.game-key-string').each((index, element) => {
                const $ele = $(element);
                const key = $ele.find('.keys').val();

                if (key) {
                    const $a = $ele.find('.title_game > a');
                    const title = $a.text().trim();

                    // append key details
                    keyDetails.set(key, {
                        url: $a.attr('href'),
                        title: $a.text()
                    });

                    keys.push({
                        key,
                        title
                    });
                }
            });

            return keys;
        };

        // button click
        $box.find('.SBSE_BtnReveal').click(() => {
            const handler = ($games, callback) => {
                const game = $games.shift();

                if (game) {
                    const $game = $(game);
                    const code = $game.attr('id').split('_').pop();
                    const appID = $game.attr('onclick').match(/steampowered\.com\/app\/(\d+)/)[1];

                    $.ajax({
                        method: 'GET',
                        url: '/myserials/syncget',
                        dataType: 'json',
                        data: {
                            code,
                            cache: false,
                            productId: appID
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
                            swal(text.failTitle, text.failDetailUnexpected, 'error');
                        }
                    });
                } else callback();
            };

            bundleSitesBoxHandler.reveal(handler, $(source).find('a[id^=fetchlink_]'));
        });
        $box.find('.SBSE_BtnRetrieve').click(() => {
            bundleSitesBoxHandler.retrieve(extractKeys());
        });
        $box.find('.SBSE_BtnExport').click(() => {
            const $bundleTitle = location.pathname === '/profile' ? $('[aria-expanded="true"] > div#bundle-title') : $('#bundle-title, #indie_gala_2 > div > span');
            const title = `IndieGala ${$bundleTitle.length > 0 ? $bundleTitle.text() : 'Keys'}`;
            bundleSitesBoxHandler.export(extractKeys(), title);
        });
    },
    fanatical() {
        /*
        const cache = siteCache.fanatical;
        const selectGames = (selector) => {
        let $results = $();
        let from = parseInt($('.SBSE_container .selectFrom').val(), 10);
        let to = parseInt($('.SBSE_container .selectTo').val(), 10);
        if ($.isNumeric(from) && $.isNumeric(to)) {
        if (from === 0 && to > 0) from = 1;
        if (from > 0 && to === 0) to = cache.doms.length - 1;
        for (let i = Math.min(from, to); i <= Math.max(from, to); i += 1) {
          $results = $results.add(
              $(cache.doms[i]).find(selector),
          );
        }
        }
        return $results;
        };*/
        const extractKeys = () => {
            const keys = [];

            $('.account-content dl input').each((index, input) => {
                const $input = $(input);

                keys.push({
                    key: $input.val(),
                    title: $input.closest('dd').prev().text().trim()
                });
            });

            return keys;
        };
        const insertBox = () => {
            const $anchor = $('h3:contains(Order Keys)');

            if ($('.SBSE_container').length === 0 && $anchor.length > 0) {
                // insert textarea
                $anchor.eq(0).before(bundleSitesBox());

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
                `);

                // narrow buttons
                $('.SBSE_container > div > button').addClass('narrow');

                // dodge from master css selector
                $('.SBSE_container > div > a').attr('href', '');
                /*
                                // insert bundlestars select
                                $('.SBSE_container > div').append(`
                                    <select class="selectTo"></select>
                                    <span>${text.selectConnector}</span>
                                    <select class="selectFrom"></select>
                                `);
                */
                // button click
                $('.SBSE_BtnReveal').click(() => {
                    const handler = ($games, callback) => {
                        const game = $games.shift();

                        if (game) {
                            game.click();
                            setTimeout(handler.bind(null, $games, callback), 300);
                        } else setTimeout(callback, 500);
                    };

                    bundleSitesBoxHandler.reveal(handler, $('.account-content dl button'));
                });

                $('.SBSE_BtnRetrieve').click(() => {
                    bundleSitesBoxHandler.retrieve(extractKeys());
                });
                $('.SBSE_BtnExport').click(() => {
                    const $bundleTitle = $('h5');
                    const title = `Fanatical - ${$bundleTitle.length > 0 ? $bundleTitle.text() : 'Keys'}`;

                    bundleSitesBoxHandler.export(extractKeys(), title);
                });
                /*
                                // setup select
                                const $selects = $('.SBSE_container select');
                
                                $selects.empty();
                                $selects.append(new Option('All', 0));
                
                                // individual games
                                $anchor.parent().children('dl').each((index, dl) => {
                                    $selects.append(
                                        new Option($(dl).children().eq(1).text(), cache.doms.push(dl) - 1),
                                    );
                                });
                
                                // bundles
                                $anchor.parent().find('h5').each((index, bundle) => {
                                    const $bundle = $(bundle);
                                    const $tiers = $bundle.parent().find('h6');
                                    const bundleTitle = $bundle.text();
                
                                    if ($tiers.length > 0) {
                                        $tiers.each((i, tier) => {
                                            const tierTitle = $(tier).text().trim();
                
                                            $selects.append(
                                                new Option(`${bundleTitle} ${tierTitle}`, cache.doms.push(tier.parentNode) - 1),
                                            );
                                        });
                                    } else {
                                        $selects.append(
                                            new Option(bundleTitle, cache.doms.push(bundle.parentNode) - 1),
                                        );
                                    }
                                });*/
            }
        };

        new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                Array.from(mutation.addedNodes).forEach(addedNode => {
                    if (addedNode.tagName === 'META' && addedNode.name === 'twitter:title') insertBox();
                });
            });
        }).observe($('head')[0], { childList: true });
    },
    bundlestars(firstCalled) {
        const cache = siteCache.bundlestars;
        const $anchor = $('h2:contains(Order Keys)');
        const BSselect = selector => {
            let $results = $();
            let from = parseInt($('.SBSE_container .selectFrom').val(), 10);
            let to = parseInt($('.SBSE_container .selectTo').val(), 10);

            if ($.isNumeric(from) && $.isNumeric(to)) {
                if (from === 0 && to > 0) from = 1;
                if (from > 0 && to === 0) to = cache.doms.length - 1;

                for (let i = Math.min(from, to); i <= Math.max(from, to); i += 1) {
                    $results = $results.add($(cache.doms[i]).find(selector));
                }
            }

            return $results;
        };
        const extractKeys = () => {
            const keys = [];

            BSselect('.key-container input').each((index, input) => {
                const $input = $(input);

                keys.push({
                    key: $input.val(),
                    title: $input.closest('.key-container').prev().text().trim()
                });
            });

            return keys;
        };

        if ($('.SBSE_container').length === 0 && $anchor.length > 0) {
            // insert textarea
            $anchor.eq(0).before(bundleSitesBox());

            // inject css
            GM_addStyle(`
                .SBSE_container { border: 1px solid #424242; color: #999999; }
                .SBSE_container > textarea { background-color: #303030; color: #DDD; }
                .SBSE_container > div > button, .SBSE_container > div > a { width: 80px; }
                .SBSE_container > div > button, .SBSE_container select, .SBSE_container > div > a { border: 1px solid transparent; background-color: #262626; color: #DEDEDE; }
                .SBSE_container > div > button:hover, .SBSE_container select:hover, .SBSE_container > div > a:hover { color: #A8A8A8; }
                .SBSE_container > div > a { text-decoration: none; }
                .SBSE_container label { color: #DEDEDE; }
                .SBSE_container select { max-width:120px; height: 30px; }
                .SBSE_container select, .SBSE_container span { margin-right: 0; margin-left: 10px; float: right; }
                .SBSE_container span { margin-top: 5px; }
            `);

            // narrow buttons
            $('.SBSE_container > div > button').addClass('narrow');

            // insert bundlestars select
            $('.SBSE_container > div').append(`
                <select class="selectTo"></select>
                <span>${text.selectConnector}</span>
                <select class="selectFrom"></select>
            `);

            // button click
            $('.SBSE_BtnReveal').click(() => {
                const handler = ($games, callback) => {
                    const game = $games.shift();

                    if (game) {
                        if (!game.closest('.ng-hide')) {
                            game.click();
                            setTimeout(handler.bind(null, $games, callback), 300);
                        } else handler($games, callback);
                    } else setTimeout(callback, 500);
                };

                bundleSitesBoxHandler.reveal(handler, BSselect('.key-container a[ng-click^="redeemSerial"]'));
            });

            $('.SBSE_BtnRetrieve').click(() => {
                bundleSitesBoxHandler.retrieve(extractKeys());
            });
            $('.SBSE_BtnExport').click(() => {
                const $bundleTitle = $('h3.bundle');
                const title = `BundleStars - ${$bundleTitle.length > 0 ? $bundleTitle.text() : 'Keys'}`;

                bundleSitesBoxHandler.export(extractKeys(), title);
            });
        }

        // setup select
        const $selects = $('.SBSE_container select');

        $selects.empty();
        $selects.append(new Option('All', 0));
        cache.doms = [document];
        $('hr ~ div > div:not(.ng-hide)').each((index, block) => {
            const $block = $(block);
            const $bundle = $block.find('h3');
            const $tiers = $block.find('h4');

            if ($tiers.length > 1) {
                // bundles with multiple tiers
                $tiers.each((i, tier) => {
                    const $tier = $(tier);

                    $selects.append(new Option(`${$bundle.text()} ${$tier.text()}`, cache.doms.push($tier.parent()) - 1));
                });
            } else if ($bundle.length > 0) {
                // bundles with single tier
                $selects.append(new Option($bundle.text(), cache.doms.push($bundle.next()) - 1));
            } else {
                // individual games
                $selects.append(new Option($block.find('.title').text(), cache.doms.push($block) - 1));
            }
        });

        if (firstCalled) {
            new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    Array.from(mutation.removedNodes).forEach(removedNode => {
                        if (removedNode.id === 'loading-bar-spinner') siteHandlers.bundlestars();
                    });
                });
            }).observe(document.body, { childList: true });
        }
    },
    humblebundle() {
        const $box = bundleSitesBox();
        let atDownload = true;

        // insert textarea
        $('#steam-tab').closest('.whitebox').eq(0).before($box);

        // insert at /home/*
        const $keyManager = $('.js-key-manager-holder');

        if ($keyManager.length > 0) {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    Array.from(mutation.addedNodes).forEach(addedNode => {
                        if (addedNode.className === 'header') {
                            atDownload = false;

                            $(addedNode).after($box);
                            $box.find('.SBSE_ChkSkipOwned').parent().remove();

                            observer.disconnect();
                        }
                    });
                });
            });

            observer.observe($keyManager[0], { childList: true });
        }

        // inject css
        GM_addStyle(`
            .SBSE_container > div { position: relative; }
            .SBSE_container > textarea {
                border: 1px solid #CFCFCF;
                color: #4a4c45;
                text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
                border-radius: 5px;
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
        `);

        // narrow buttons
        $box.find('div > button').addClass('narrow');

        // append checkbox for owned game
        $box.find('#SBSE_BtnSettings').before($(`<label><input type="checkbox" class="SBSE_ChkSkipOwned">${text.checkboxSkipOwned}</label>`));

        const extractKeys = () => {
            const keys = [];

            $('.sr-redeemed-bubble .keyfield-text, tr:has(.hb-steam) .redeemed > .keyfield-value').each((index, element) => {
                const $game = $(element);
                const $heading = atDownload ? $game.closest('[class^=sr-key]').prev().children().eq(0) : $game.closest('td').prev('.game-name').find('h4');

                keys.push({
                    key: $game.text().trim(),
                    title: $heading.text().trim()
                });
            });

            return keys;
        };

        // button click
        $box.find('.SBSE_BtnReveal').click(() => {
            const handler = ($games, callback) => {
                const game = $games.shift();

                if (game) {
                    game.click();
                    setTimeout(() => {
                        const $popup = $('.sr-warning-modal-buttons');
                        const skipOwned = !!$('.SBSE_ChkSkipOwned:checked').length;
                        const selector = skipOwned ? '.sr-warning-modal-cancel-button' : '.sr-warning-modal-confirm-button';

                        if ($popup.length > 0) $popup.find(selector).click();

                        setTimeout(handler.bind(null, $games, callback), 300);
                    }, 300);
                } else callback();
            };

            bundleSitesBoxHandler.reveal(handler, $('.sr-unredeemed-steam-button, div[title="Reveal your Steam key"]'));
        });
        $box.find('.SBSE_BtnRetrieve').click(() => {
            bundleSitesBoxHandler.retrieve(extractKeys());
        });
        $box.find('.SBSE_BtnExport').click(() => {
            const $bundleTitle = $('meta[name=title]');
            const title = `Humble Bundle - ${$bundleTitle.length > 0 ? $bundleTitle.attr('content') : 'Keys'}`;

            bundleSitesBoxHandler.export(extractKeys(), title);
        });

        // setup key details
        const $script = $('.steam-keyredeemer-container').next();

        if ($script.length > 0) {
            let data = $script.text().split('var data = ').pop().split(';').shift();

            try {
                data = JSON.parse(data);

                data.keys.forEach(key => {
                    keyDetails.set(key.redeemedKeyVal, {
                        app: key.steamAppId,
                        title: key.humanName
                    });
                });
            } catch (e) {
                // no key details
            }
        }
    },
    dailyindiegame() {
        const pathname = location.pathname;

        if (pathname.includes('/account_page')) {
            // insert textarea
            $('#TableKeys').eq(0).before(bundleSitesBox());

            // inject css
            GM_addStyle(`
                .SBSE_container {
                    padding: 5px;
                    border: 1px solid #424242;
                }
                .SBSE_container > textarea {
                    border: 1px solid #000;
                }
                .SBSE_container > div > button {
                    border: none;
                    background-color: #FD5E0F;
                    color: rgb(49, 49, 49);
                    font-family: Ropa Sans;
                    font-size: 15px;
                    font-weight: 600;
                }
            `);

            const extractKeys = () => {
                const keys = [];

                $('#TableKeys tr').each((index, tr) => {
                    const $tds = $(tr).children();

                    if (tr.textContent.includes('-')) {
                        keys.push({
                            key: $tds.eq(4).text().trim(),
                            title: $tds.eq(2).text().trim()
                        });
                    }
                });

                return keys;
            };

            // button click
            $('.SBSE_BtnReveal').click(() => {
                const handler = () => {
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
                };

                bundleSitesBoxHandler.reveal(handler);
            });
            $('.SBSE_BtnRetrieve').click(() => {
                bundleSitesBoxHandler.retrieve(extractKeys());
            });
            $('.SBSE_BtnExport').remove();
        } else if (pathname === '/account_digstore.html' || pathname === '/account_trades.html') {
            // DIG EasyBuy
            GM_addStyle(`
                .DIGEasyBuy button { padding: 4px 8px; outline: none; }
                .DIGEasyBuy_checked { background-color: #222; }
            `);

            const $target = $('#form3').closest('tr').children().eq(0);
            const $DIGEasyBuy = $(`
                <div class="DIGEasyBuy">
                    <button class="DIGButtonPurchase DIG3_Orange_15_Form">${text.DIGEasyBuyPurchase}</button>
                    <button class="DIGButtonSelectAll DIG3_Orange_15_Form">${text.DIGEasyBuySelectAll}</button>
                </div>
            `);

            $target.empty().append($DIGEasyBuy);

            // bind button event
            $('.DIGButtonPurchase').click(e => {
                let bought = 0;
                let balance = parseInt($('a[href^="account_transac"]').closest('div').text().slice(12), 10) || 0;
                const $self = $(e.delegateTarget);
                const $checked = $('.DIGEasyBuy_checked');
                const handler = callback => {
                    const item = $checked.shift();

                    if (item) {
                        const $item = $(item);
                        const id = $item.data('id');
                        const price = parseInt($item.data('price'), 10);

                        if (id && price > 0) {
                            if (balance - price > 0) {
                                let url = `${location.origin}/account_buy.html`;
                                const requestInit = {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded'
                                    },
                                    body: `quantity=1&xgameid=${id}&xgameprice1=${price}&send=Purchase`,
                                    mode: 'same-origin',
                                    credentials: 'same-origin',
                                    cache: 'no-store',
                                    referrer: `${location.origin}/account_buy_${id}.html`
                                };

                                if (pathname === '/account_trades.html') {
                                    url = `${location.origin}/account_buytrade_${id}.html`;
                                    requestInit.body = `gameid=${id}&send=Purchase`;
                                    requestInit.referrer = url;
                                }

                                fetch(url, requestInit).then(res => {
                                    if (res.ok) {
                                        $item.click();
                                        bought += 1;
                                        balance -= price;

                                        setTimeout(handler.bind(null, callback), 300);
                                    } else handler(callback);
                                });
                            } else {
                                swal({
                                    title: text.failTitle,
                                    text: text.DIGInsufficientFund,
                                    type: 'error'
                                }).then(() => {
                                    window.location = `${location.origin}/account_page.html`;
                                });
                            }
                        } else handler(callback);
                    } else callback();
                };

                $self.prop('disabled', true).text(text.DIGButtonPurchasing);
                handler(() => {
                    if (bought) window.location = `${location.origin}/account_page.html`;else $self.prop('disabled', false).text(text.DIGButtonPurchase);
                });
            });
            $('.DIGButtonSelectAll').click(e => {
                const $self = $(e.delegateTarget);
                const state = !$self.data('state');

                $('.DIGEasyBuy_row').toggleClass('DIGEasyBuy_checked', state);
                $self.data('state', state);
                $self.text(state ? text.DIGEasyBuySelectCancel : text.DIGEasyBuySelectAll);
            });

            // setup row data & event
            $('a[href^="account_buy"]').each((index, element) => {
                const $game = $(element);
                const $row = $game.closest('tr');

                $row.data({
                    id: $game.attr('href').replace(/\D/g, ''),
                    price: parseInt($game.closest('td').prev().text(), 10) || 0
                });
                $row.click(() => {
                    $row.toggleClass('DIGEasyBuy_checked');
                });
                $row.addClass('DIGEasyBuy_row');
            });
        }
    },
    ccyycn() {
        // insert textarea
        $('.featurette-divider').eq(0).after(bundleSitesBox());

        // inject css
        GM_addStyle(`
            .SBSE_container {
                width: 80%;
                margin: 0 auto;
                color: #000;
                font-size: 16px;
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

        // narrow buttons
        $('.SBSE_container > div > button').addClass('narrow');

        const extractKeys = () => {
            const keys = [];

            $('.deliver-gkey:contains(-)').each((index, element) => {
                const $game = $(element);

                keys.push({
                    key: $game.text().trim(),
                    title: $game.parent().prev().text().trim()
                });
            });

            return keys;
        };

        // button click
        $('.SBSE_BtnReveal').click(() => {
            const handler = ($games, callback) => {
                const game = $games.shift();

                if (game) {
                    game.click();
                    setTimeout(handler.bind(null, $games, callback), 300);
                } else callback();
            };

            bundleSitesBoxHandler.reveal(handler, $('.deliver-btn'));
        });
        $('.SBSE_BtnRetrieve').click(() => {
            bundleSitesBoxHandler.retrieve(extractKeys());
        });
        $('.SBSE_BtnExport').click(() => {
            const bundleTitle = 'CCYYCN Bundle'; // can't find bundle title in html

            bundleSitesBoxHandler.export(extractKeys(), bundleTitle);
        });
    },
    groupees() {
        // insert textarea
        $('.container > div').eq(1).before(bundleSitesBox());

        // inject css
        GM_addStyle(`
            .SBSE_container { margin-bottom: 20px; }
            .SBSE_container > textarea { background-color: #EEE; border-radius: 3px; }
            .SBSE_container > div > button, .SBSE_container > div > a { outline: none !important; }
            #SBSE_BtnSettings { margin-top: 8px; }
        `);

        // append checkbox for used-key
        $('#SBSE_BtnSettings').before($(`<label><input type="checkbox" class="SBSE_ChkSkipUsed" checked>${text.checkboxSkipUsed}</label>`));

        // add buttons style via groupees's class
        $('.SBSE_container > div > button, .SBSE_container > div > a').addClass('btn btn-default');

        // append mark all as used button
        new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                Array.from(mutation.addedNodes).forEach(addedNode => {
                    const $orderMeta = $(addedNode).find('.order-meta');

                    if ($orderMeta.length > 0) {
                        $orderMeta.after($(`<button class="btn btn-default" style="margin-right: 10px;"><b>${text.markAllAsUsed}</b></button>`).click(() => {
                            $('.expanded .usage').each((i, checkbox) => {
                                if (!checkbox.checked) checkbox.click();
                            });
                        }));
                        $orderMeta.parent().addClass('showOrderMeta');
                    }
                });
            });
        }).observe($('#profile_content')[0], { childList: true });

        const extractKeys = () => {
            const skipUsed = !!$('.SBSE_ChkSkipUsed:checked').length;
            const keys = [];

            $('.expanded .code').each((index, element) => {
                const $game = $(element);
                const used = $game.closest('li').find('.usage').prop('checked');

                if (!used || used && !skipUsed) {
                    keys.push({
                        key: $game.val(),
                        title: $game.closest('.details').find('h3').text().trim()
                    });
                }
            });

            return keys;
        };

        // button click
        $('.SBSE_BtnReveal').click(() => {
            const handler = ($games, callback) => {
                const game = $games.shift();

                if (game) {
                    game.click();
                    setTimeout(handler.bind(null, $games, callback), 300);
                } else callback();
            };

            const $reveals = $('.product:has(img[title*=Steam]) .reveal-product');
            const timer = $reveals.length > 0 ? 1500 : 0;

            $reveals.click();
            setTimeout(() => {
                bundleSitesBoxHandler.reveal(handler, $('.expanded .reveal'));
            }, timer);
        });
        $('.SBSE_BtnRetrieve').click(() => {
            bundleSitesBoxHandler.retrieve(extractKeys());
        });
        $('.SBSE_BtnExport').click(() => {
            const bundleTitle = `Groupees - ${$('.expanded .caption').text()}`;

            bundleSitesBoxHandler.export(extractKeys(), bundleTitle);
        });

        // bind custom event
        $(document).on('activated', (e, key, result) => {
            if (result.success === 1) $(`li.key:has(input[value=${key}]) .usage`).click();
        });
    },
    agiso() {
        const keys = unique($('body').text().match(regKey));

        if (keys.length > 0) {
            // insert textarea
            $('#tabs').eq(0).prepend(bundleSitesBox());

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
                #SBSE_BtnSettings { width: 32px !important; height: 32px !important; }
            `);

            // remove event from agiso
            $('.SBSE_container > div > button').click(e => {
                e.preventDefault();
            });

            // hide reveal
            $('.SBSE_BtnReveal').hide();

            // button click
            $('.SBSE_BtnRetrieve').click(() => {
                bundleSitesBoxHandler.retrieve(keys);
            });
            $('.SBSE_BtnExport').click(() => {
                const bundleTitle = 'agiso Bundle';

                bundleSitesBoxHandler.export(keys, bundleTitle);
            });
        }
    }
};
const init = () => {
    if (location.hostname === 'store.steampowered.com') {
        // save sessionID
        if (g_AccountID > 0) {
            const currentID = config.get('sessionID');
            const sessionID = g_sessionID || '';
            const language = g_oSuggestParams.l || 'english';

            if (!config.get('language')) config.set('language', language);
            if (sessionID.length > 0) {
                const update = config.get('autoUpdateSessionID') && currentID !== sessionID;

                if (!currentID || update) {
                    config.set('sessionID', sessionID, () => {
                        swal({
                            title: text.updateSuccessTitle,
                            text: text.updateSuccess,
                            type: 'success',
                            timer: 3000
                        });
                    });
                }
            }
        }
        /* else {
            swal(text.notLoggedInTitle, text.notLoggedInMsg, 'error');
        } */
    } else {
        const site = location.hostname.replace(/(www|alds|bundle)\./, '').split('.').shift();

        // check sessionID
        if (!config.get('sessionID')) getSessionID();

        if (has.call(siteHandlers, site)) {
            siteHandlers[site](true);

            // update owned every 10 min
            const updateTimer = 10 * 60 * 1000;
            if (!owned.lastUpdate || owned.lastUpdate < Date.now() - updateTimer) {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `http://store.steampowered.com/dynamicstore/userdata/t=${Math.random()}`,
                    onload: res => {
                        if (res.status === 200) {
                            const data = JSON.parse(res.response);

                            owned.app = data.rgOwnedApps;
                            owned.sub = data.rgOwnedPackages;
                            owned.lastUpdate = Date.now();

                            localStorage.setItem('SBSE_owned', JSON.stringify(owned));
                        }
                    }
                });
            }
        }
    }
};

$(init);
