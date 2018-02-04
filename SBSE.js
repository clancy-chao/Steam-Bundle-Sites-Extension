// ==UserScript==
// @name         Steam Bundle Sites Extension
// @namespace    http://tampermonkey.net/
// @version      1.13.0
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
// @include      https://groupees.com/profile/purchases/*
// @include      http*://*agiso.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/7.9.2/sweetalert2.min.js
// @resource     sweetalert2CSS https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/7.9.2/sweetalert2.min.css
// @connect      store.steampowered.com
// @connect      www.google.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @run-at       document-start
// @noframes
// ==/UserScript==

/* global swal */

// setup jQuery
const $ = jQuery.noConflict(true);

$.fn.pop = [].pop;
$.fn.shift = [].shift;

// inject swal css
GM_addStyle(GM_getResourceText('sweetalert2CSS'));

// inject script css
GM_addStyle(`
    pre.SBSE_errorMsg { height: 200px; text-align: left; white-space: pre-wrap; }
`);

// load up
const regKey = /(?:(?:([A-Z0-9])(?!\1{4})){5}-){2,5}[A-Z0-9]{5}/g;
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
    },
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
        if (!has.call(this.data, 'activateAllKeys')) this.data.activateAllKeys = false;
    },
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
        settingsSyncLibrary: '同步遊戲庫資料',
        settingsSyncLibraryButton: '同步',
        settingsLanguage: '語言',
        settingsPreselectIncludeTitle: '預選包括遊戲名',
        settingsTitleComesLast: '遊戲名置後',
        settingsPreselectJoinKeys: '預選合併序號',
        settingsJoinKeysASFStyle: '合併ASF 格式序號',
        settingsActivateAllKeys: '不跳過、啟動所有序號',
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
    },
};
let text = has.call(i18n, config.get('language')) ? i18n[config.get('language')] : i18n.english;

// inject settings panel css
GM_addStyle(`
    .SBSE_settings .name { text-align: right; vertical-align: top; }
    .SBSE_settings .value { text-align: left; }
    .SBSE_settings .value > * { height: 30px; margin: 0 20px 10px; }
    .SBSE_settings .switch { position: relative; display: inline-block; width: 60px; }
    .SBSE_settings .switch input { display: none; }
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
    .SBSE_settings input:checked + .slider { background-color: #2196F3; }
    .SBSE_settings input:focus + .slider { box-shadow: 0 0 1px #2196F3; }
    .SBSE_settings input:checked + .slider:before { transform: translateX(30px); }
    .SBSE_settings > span { display: inline-block; cursor: pointer; color: white; }
`);

// functions
const getSessionID = () => {
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'http://store.steampowered.com/',
        onload: (res) => {
            if (res.status === 200) {
                const accountID = res.response.match(/g_AccountID = (\d+)/).pop();
                const sessionID = res.response.match(/g_sessionID = "(\w+)"/).pop();

                if (accountID > 0) config.set('sessionID', sessionID);
                else {
                    swal({
                        title: text.notLoggedInTitle,
                        text: text.notLoggedInMsg,
                        type: 'error',
                        showCancelButton: true,
                    }).then(() => {
                        window.open('http://store.steampowered.com/');
                    });
                }
            }
        },
    });
};
const syncLibrary = (notify = true) => {
    GM_xmlhttpRequest({
        method: 'GET',
        url: `http://store.steampowered.com/dynamicstore/userdata/t=${Math.random()}`,
        onload: (res) => {
            if (res.status === 200) {
                const data = JSON.parse(res.response);

                if (data.rgOwnedApps.length > 0) owned.app = data.rgOwnedApps;
                if (data.rgOwnedPackages.length > 0) owned.sub = data.rgOwnedPackages;
                owned.lastSync = Date.now();

                localStorage.setItem('SBSE_owned', JSON.stringify(owned));

                if (notify) {
                    swal({
                        title: text.syncSuccessTitle,
                        text: text.syncSuccess,
                        type: 'success',
                        timer: 3000,
                    });
                }
            }
        },
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
                        <td class="name">${text.settingsSyncLibrary}</td>
                        <td class="value">
                            <button class="syncLibrary">${text.settingsSyncLibraryButton}</button>
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
                    <tr>
                        <td class="name">${text.settingsActivateAllKeys}</td>
                        <td class="value">
                            <label class="switch">
                                <input type="checkbox" class="activateAllKeys">
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
            html: this.construct(),
        });

        // apply settings
        const $panel = $(swal.getContent());
        const $sessionID = $panel.find('.sessionID');
        const $language = $panel.find('.language');

        // toggles
        $panel.find('input[type=checkbox]').each((index, input) => {
            const $input = $(input);

            $input.prop('checked', config.get(input.className));
            $input.change((e) => {
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
        $panel.find('.syncLibrary').click(syncLibrary);

        // language
        Object.keys(i18n).forEach((language) => {
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
    },
};
const activateHandler = {
    keys: [],
    results: {},
    updateResults(txt = null) {
        const $textarea = $('.SBSE_container > textarea');

        if (txt) $textarea.val(txt);
        else {
            const results = this.results;
            const parsed = [];

            Object.values(results).forEach((result) => {
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
            50: text.failDetailGiftWallet,
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
            info.line_items.forEach((item) => {
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
            } else if (keyDetails.isOwned(key) && !config.get('activateAllKeys')) {
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
                        Referer: 'https://store.steampowered.com/account/registerkey',
                    },
                    data: `product_key=${key}&sessionid=${config.get('sessionID')}`,
                    onload: (res) => {
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
                                type: 'error',
                            });
                            getSessionID();
                            callback();
                        }
                    },
                });
            }
        } else callback();
    },
    activateKeys(input, callback) {
        const self = this;
        const keys = unique(input.match(regKey));

        if (keys.length > 0) {
            keys.forEach((key) => {
                self.results[key] = [key];
            });
            self.keys = Object.keys(self.results);
            self.updateResults();
            self.activateKey(callback);
        } else {
            self.updateResults(text.emptyInput);
            callback();
        }
    },
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

            data.forEach((d) => {
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

            $export
                .attr('href', `data:text/csv;charset=utf-8,\ufeff${encodeURIComponent(formattedData)}`)
                .attr('download', `${filename}.csv`);
        }
    },
    settings() {
        settings.display();
    },
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
        .SBSE_container > div { width: 100%; padding-top: 5px; box-sizing: border-box; }
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
        .SBSE_container > div > a { display: inline-block; text-align: center; }
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
        doms: ['.account-content'],
    },
    bundlestars: {
        doms: [document],
    },
};
const siteHandlers = {
    indiegala() {
        const $box = bundleSitesBox();
        // insert textarea
        $('#library-contain').eq(0).before($box);

        // support for new password protected gift page
        const $node = $('#gift-contents');

        if ($node.length > 0) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    Array.from(mutation.addedNodes).forEach((addedNode) => {
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
                        title: $a.text(),
                    });

                    keys.push({
                        key,
                        title,
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
                    const id = $game.attr('onclick').match(/steampowered\.com\/(app|sub)\/(\d+)/)[2];

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
                            swal(text.failTitle, text.failDetailUnexpected, 'error');
                        },
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
    fanatical() { /*
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
                    title: $input.closest('dd').prev().text().trim(),
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

        new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                Array.from(mutation.addedNodes).forEach((addedNode) => {
                    if (addedNode.tagName === 'META' && addedNode.name === 'twitter:title') insertBox();
                });
            });
        }).observe($('head')[0], { childList: true });
    },
    bundlestars(firstCalled) {
        const cache = siteCache.bundlestars;
        const $anchor = $('h2:contains(Order Keys)');
        const BSselect = (selector) => {
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
        };
        const extractKeys = () => {
            const keys = [];

            BSselect('.key-container input').each((index, input) => {
                const $input = $(input);

                keys.push({
                    key: $input.val(),
                    title: $input.closest('.key-container').prev().text().trim(),
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

            if ($tiers.length > 1) { // bundles with multiple tiers
                $tiers.each((i, tier) => {
                    const $tier = $(tier);

                    $selects.append(
                        new Option(`${$bundle.text()} ${$tier.text()}`, cache.doms.push($tier.parent()) - 1),
                    );
                });
            } else if ($bundle.length > 0) { // bundles with single tier
                $selects.append(
                    new Option($bundle.text(), cache.doms.push($bundle.next()) - 1),
                );
            } else { // individual games
                $selects.append(
                    new Option($block.find('.title').text(), cache.doms.push($block) - 1),
                );
            }
        });

        if (firstCalled) {
            new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    Array.from(mutation.removedNodes).forEach((removedNode) => {
                        if (removedNode.id === 'loading-bar-spinner') siteHandlers.bundlestars();
                    });
                });
            }).observe(document.body, { childList: true });
        }
    },
    humblebundle() {
        let atDownload = true;
        const $box = bundleSitesBox();
        const fetchKey = ($node, machineName, callback) => {
            fetch('https://www.humblebundle.com/humbler/redeemkey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    Origin: 'https://www.humblebundle.com',
                    Referer: location.href,
                },
                body: `gift=false&keytype=${machineName}&key=${unsafeWindow.gamekeys[0]}&keyindex=0`,
                credentials: 'same-origin',
            }).then((res) => {
                if (res.ok) return res.json();
                throw new Error('Network response was not ok.');
            }).then((d) => {
                if (d.success) {
                    $node.closest('.sr-unredeemed').replaceWith(`
                        <div class="sr-redeemed">
                            <div class="sr-redeemed">
                                <div class="sr-redeemed-bubble js-sr-redeemed-bubble ">
                                    <div class="keyfield-text">${d.key}</div>
                                    <a class="steam-redeem-button" href="https://store.steampowered.com/account/registerkey?key=${d.key}" target="_blank">
                                        <div class="steam-redeem-text">Redeem</div>
                                        <span class="tooltiptext">Redeem on Steam</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    `);
                } else swal(text.failTitle, JSON.stringify(d), 'error');

                if (typeof callback === 'function') callback();
            });
        };
        const extractKeys = () => {
            const skipOwned = !!$('.SBSE_ChkSkipOwned:checked').length;
            const keys = [];
            const selectors = [
                '.sr-redeemed-bubble .keyfield-text', // redeem page selector
                'tr:has(.hb-steam) .redeemed > .keyfield-value', // home page selector
            ];

            if (skipOwned) selectors[0] = `div:not(.SBSE_owned) > .sr-key ${selectors[0]}`;

            $(selectors.join()).each((index, element) => {
                const $game = $(element);
                const $heading = atDownload
                    ? $game.closest('[class^=sr-key]').prev().children().eq(0)
                    : $game.closest('td').prev('.game-name').find('h4');

                keys.push({
                    key: $game.text().trim(),
                    title: $heading.text().trim(),
                });
            });

            return keys;
        };
        const $keyManager = $('.js-key-manager-holder');

        // insert textarea
        // insert at /home/*
        if ($keyManager.length > 0) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    Array.from(mutation.addedNodes).forEach((addedNode) => {
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
        // insert at download page
        } else {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    Array.from(mutation.addedNodes).forEach((addedNode) => {
                        const $node = $(addedNode);

                        if ($node.hasClass('sr-widget') && $node.closest('.keytab').length > 0) {
                            $node.closest('.whitebox-redux').before($box);

                            // fetch key data
                            const $script = $('.steam-keyredeemer-container').next();

                            if ($script.length > 0) {
                                let data = $script.text()
                                    .split('var data = ')
                                    .pop()
                                    .split(';')
                                    .shift();

                                try {
                                    data = JSON.parse(data);

                                    data.keys.forEach((key) => {
                                        keyDetails.set(key.redeemedKeyVal, {
                                            app: key.steamAppId,
                                            title: key.humanName,
                                        });

                                        const $heading = $node.find(`.sr-key-heading:has(span[data-machine-name=${key.machineName}])`);

                                        // apply owned effect on game title
                                        const appID = parseInt(key.steamAppId, 10);

                                        if (appID && owned.app.includes(appID)) $heading.parent().parent().addClass('SBSE_owned');

                                        // activation restrictions
                                        let html = '';
                                        const disallowed = key.disallowedCountries.map(c => ISO2.get(c));
                                        const exclusive = key.exclusiveCountries.map(c => ISO2.get(c));
                                        const humanName = $heading.text().trim();
                                        const separator = config.get('language').includes('chinese') ? '、' : ', ';

                                        if (disallowed.length > 0) html += `<p>${text.HBDisallowedCountries}<br>${disallowed.join(separator)}</p>`;
                                        if (exclusive.length > 0) html += `<p>${text.HBExclusiveCountries}<br>${exclusive.join(separator)}</p>`;
                                        if (disallowed.length > 0 || exclusive.length > 0) {
                                            $(`<span class="SBSE_activationRestrictions">${text.HBActivationRestrictions}</span>`).click(() => {
                                                swal({
                                                    title: `${humanName}<br>${text.HBActivationRestrictions}`,
                                                    html,
                                                    type: 'info',
                                                });
                                            }).insertBefore($heading.parent().parent());
                                        }
                                    });
                                } catch (e) {
                                    // no key details
                                }
                            }

                            observer.disconnect();
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
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
            .SBSE_owned .sr-unredeemed-steam-button {
                background-color: #F3F3F3;
                background: linear-gradient(to top, #E8E8E8, #F6F6F6);
            }
            .SBSE_owned .sr-unredeemed-steam-button * { opacity: 0.37; }
            .SBSE_owned .sr-key-heading > span:last-child::after {
                content: '\\f085';
                font-family: hb-icons;
                color: #17A1E5;
            }
            .SBSE_activationRestrictions {
                float: right;
                cursor: pointer;
            }
        `);

        // narrow buttons
        $box.find('div > button').addClass('narrow');

        // append checkbox for owned game
        $box.find('#SBSE_BtnSettings').before(
            $(`<label><input type="checkbox" class="SBSE_ChkSkipOwned" checked>${text.checkboxSkipOwned}</label>`),
        );

        // button click
        $box.find('.SBSE_BtnReveal').click(() => {
            const skipOwned = !!$('.SBSE_ChkSkipOwned:checked').length;
            const handler = ($games, callback) => {
                const game = $games.shift();

                if (game) {
                    const $game = $(game);
                    const isOwned = !!$game.closest('.SBSE_owned').length;
                    const machineName = $game.closest('.sr-key').find('.js-admin-edit').data('machine-name');

                    if (skipOwned && isOwned) handler($games, callback);
                    else if (atDownload && machineName) {
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
            const selectors = [
                '.sr-unredeemed-steam-button', // redeem page selector
                'div.keyfield[title="Reveal your Steam key"]', // home page selector
            ];

            if (skipOwned) selectors[0] = `div:not(.SBSE_owned) > .sr-key ${selectors[0]}`;

            bundleSitesBoxHandler.reveal(handler, $(selectors.join()));
        });
        $box.find('.SBSE_BtnRetrieve').click(() => {
            bundleSitesBoxHandler.retrieve(extractKeys());
        });
        $box.find('.SBSE_BtnExport').click(() => {
            const $bundleTitle = $('meta[name=title]');
            const title = `Humble Bundle - ${$bundleTitle.length > 0 ? $bundleTitle.attr('content') : 'Keys'}`;

            bundleSitesBoxHandler.export(extractKeys(), title);
        });

        // override default popups
        document.addEventListener('click', (e) => {
            const $target = $(e.target).closest('.sr-unredeemed-steam-button');

            if ($target.length > 0) {
                e.stopPropagation();

                const $heading = $target.closest('.sr-key').find('.sr-key-heading');
                const machineName = $heading.find('.js-admin-edit').data('machine-name');
                const humanName = $heading.text().trim();
                const isOwned = !!$target.closest('.SBSE_owned').length;

                if (machineName) {
                    if (isOwned) {
                        swal({
                            title: text.HBAlreadyOwned,
                            text: text.HBRedeemAlreadyOwned.replace('%title%', humanName),
                            type: 'question',
                            showCancelButton: true,
                        }).then((result) => {
                            if (result.value) fetchKey($target, machineName);
                        });
                    } else fetchKey($target, machineName);
                }
            }
        }, true);
    },
    dailyindiegame() {
        const MPHideList = JSON.parse(GM_getValue('SBSE_DIGMPHideList') || '[]');
        const pathname = location.pathname;

        if (pathname.includes('/account_page')) {
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

            const extractKeys = () => {
                const keys = [];
                const marketListings = !!$('.SBSE_ChkMarketListings:checked').length;

                $('#TableKeys tr').each((index, tr) => {
                    const $tds = $(tr).children();

                    if ($tds.eq(4).text().includes('-') && (!$tds.eq(6).text().includes('Cancel trade') || marketListings)) {
                        keys.push({
                            key: $tds.eq(4).text().trim(),
                            title: $tds.eq(2).text().trim(),
                        });
                    }
                });

                return keys;
            };

            // insert textarea
            const $box = bundleSitesBox();
            $('#TableKeys').eq(0).before($box);

            // append checkbox for market keys
            $box.find('#SBSE_BtnSettings').before(
                $(`<label><input type="checkbox" class="SBSE_ChkMarketListings">${text.checkboxMarketListings}</label>`),
            );

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
                        },
                    });
                };

                bundleSitesBoxHandler.reveal(handler);
            });
            $('.SBSE_BtnRetrieve').click(() => {
                bundleSitesBoxHandler.retrieve(extractKeys());
            });
            $('.SBSE_BtnExport').remove();

            // rate all positive
            const $awaitRatings = $('a[href^="account_page_0_ratepositive"]');

            if ($awaitRatings.length > 0) {
                $('#TableKeys td:contains(Rate TRADE)').text(text.DIGRateAllPositive).css('cursor', 'pointer').click(() => {
                    $awaitRatings.each((index, a) => {
                        fetch(a.href, {
                            method: 'GET',
                            credentials: 'same-origin',
                        }).then((res) => {
                            if (res.ok) {
                                $(a).parent('td').html('<span class="DIG3_14_Orange">Positive</span>');
                            }
                        });
                    });
                });
            }
        } else if (pathname === '/account_digstore.html' ||
                   pathname === '/account_trades.html' ||
                   pathname === '/account_tradesXT.html') {
            // DIG EasyBuy
            GM_addStyle(`
                .DIGEasyBuy_row { height: 30px; }
                .DIGEasyBuy button { padding: 4px 8px; outline: none; cursor: pointer; }
                .DIGEasyBuy_checked { background-color: #222; }
                .DIGEasyBuy_hideOwned tr.SBSE_hide { display: none; }
                .DIGEasyBuy_hideOwned tr.SBSE_hide + .SBSE_searchResults { display: none; }
                .SBSE_searchResults td { padding: 0 }
                .SBSE_searchResults iframe {
                    width: 100%;
                    height: 300px;
                    display: none;
                    background-color: white;
                    border: none;
                }
            `);

            // setup row data & event
            const easyBuySetup = (i, element) => {
                const $game = $(element);
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
                const appID = parseInt(data[1], 10);
                const id = parseInt($tr.attr('data-id'), 10);

                if (owned[data[0]].includes(appID)) $tr.addClass('SBSE_owned SBSE_hide');
                if (MPHideList.includes(id)) $tr.addClass('SBSE_hide');

                // append manual hide feature
                $tr.children().eq(0).attr('title', text.DIGClickToHideThisRow).click((e) => {
                    e.stopPropagation();

                    if (id > 0) {
                        MPHideList.push(id);
                        GM_setValue('SBSE_DIGMPHideList', JSON.stringify(MPHideList));

                        $tr.addClass('SBSE_hide');
                    }
                });

                // no appID found, pre-load Google search result
                if (appID === -1 && !MPHideList.includes(id)) {
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
                                <tr class="SBSE_searchResults">
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

                        $tr.next('.SBSE_searchResults').find('iframe')
                            .slideToggle('fast');
                    });
                }
            };

            $('tr a[href*="steampowered"]').each(check);

            // append menu buttons
            const $target = $('#form3').closest('tr').children().eq(0);
            const $DIGEasyBuy = $(`
                <div class="DIGEasyBuy">
                    <button class="DIGButtonPurchase DIG3_Orange_15_Form">${text.DIGEasyBuyPurchase}</button>
                    <button class="DIGButtonSelectAll DIG3_Orange_15_Form">${text.DIGEasyBuySelectAll}</button>
                    <button class="DIGButtonHideOwned DIG3_Orange_15_Form">${text.DIGEasyBuyHideOwned}</button>
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
                    <button class="DIGButtonLoadAllPages DIG3_Orange_15_Form">${text.DIGEasyBuyLoadAllPages}</button>
                `);
            }

            // bind button event
            $('.DIGButtonPurchase').click((e) => {
                let bought = 0;
                let balance = parseInt($('a[href^="account_transac"]').closest('div').text().slice(12), 10) || 0;
                const $self = $(e.delegateTarget);
                const $checked = $('.DIGEasyBuy_checked');
                const handler = (callback) => {
                    const item = $checked.shift();

                    if (item) {
                        const $item = $(item);
                        const id = $item.data('id');
                        const price = parseInt($item.data('price'), 10);

                        if (id && price > 0) {
                            if ((balance - price) > 0) {
                                let url = `${location.origin}/account_buy.html`;
                                const requestInit = {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                    },
                                    body: `quantity=1&xgameid=${id}&xgameprice1=${price}&send=Purchase`,
                                    mode: 'same-origin',
                                    credentials: 'same-origin',
                                    cache: 'no-store',
                                    referrer: `${location.origin}/account_buy_${id}.html`,
                                };

                                if (pathname === '/account_trades.html' || pathname === '/account_tradesXT.html') {
                                    url = `${location.origin}/account_buytrade_${id}.html`;
                                    requestInit.body = `gameid=${id}&send=Purchase`;
                                    requestInit.referrer = url;
                                }

                                fetch(url, requestInit).then((res) => {
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
                                    type: 'error',
                                }).then(() => {
                                    window.location = `${location.origin}/account_page.html`;
                                });
                            }
                        } else handler(callback);
                    } else callback();
                };

                $self.prop('disabled', true).text(text.DIGButtonPurchasing);
                handler(() => {
                    if (bought) window.location = `${location.origin}/account_page.html`;
                    else $self.prop('disabled', false).text(text.DIGButtonPurchase);
                });
            });
            $('.DIGButtonSelectAll').click((e) => {
                const $self = $(e.delegateTarget);
                const state = !$self.data('state');

                $('.DIGEasyBuy_row').toggleClass('DIGEasyBuy_checked', state);
                $self.data('state', state);
                $self.text(state ? text.DIGEasyBuySelectCancel : text.DIGEasyBuySelectAll);
            });
            $('.DIGButtonHideOwned').click((e) => {
                const $self = $(e.delegateTarget);
                const state = !$self.data('state');

                $('#TableKeys').toggleClass('DIGEasyBuy_hideOwned', state);
                $self.data('state', state);
                $self.text(state ? text.DIGEasyBuyShowOwned : text.DIGEasyBuyHideOwned);
            });
            $('.DIGButtonLoadAllPages').click((e) => {
                // auto load all pages at marketplace
                const $self = $(e.delegateTarget);
                const $tbody = $('#TableKeys > tbody');
                const load = (page, retry = 0) => {
                    $self.text(text.DIGEasyBuyLoading.replace('%page%', page));

                    fetch(`${location.origin}/account_tradesXT_${page}.html`, {
                        method: 'GET',
                        credentials: 'same-origin',
                    }).then((res) => {
                        if (res.ok) return res.text();
                        throw new Error('Network response was not ok.');
                    }).then((html) => {
                        const $result = $(html).find('#TableKeys tr.DIG3_14_Gray');

                        if ($result.length > 0) {
                            $result.find('a[href^="account_buy"]').each(easyBuySetup);
                            $result.find('a[href*="steampowered"]').each(check);
                            $tbody.append($result);
                            load((page + 1));
                        } else $self.text(text.DIGEasyBuyLoadingComplete);
                    }).catch(() => {
                        if (retry < 3) load(page, (retry + 1));
                        else load((page + 1));
                    });
                };

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
                $steamKey.blur((e) => {
                    const $self = $(e.delegateTarget);
                    const key = $self.val().match(regKey);

                    if (key) $self.val(key[0]);
                });
                $steamKey.attr({
                    size: 50,
                    maxlength: 50,
                });

                // search for current market price when click dropdown menu
                const $searchResult = $('<div/>');

                $gameTitle.closest('table').after($searchResult);
                $searchResult.before(`<h3>${text.DIGMarketSearchResult}</h3>`);

                $('.tt-dropdown-menu').click(() => {
                    $searchResult.empty();
                    fetch(`${location.origin}/account_tradesXT.html`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: `search=${encodeURIComponent($gameTitle.val()).replace(/%20/g, '+')}&button=SEARCH`,
                        credentials: 'same-origin',
                    }).then((res) => {
                        if (res.ok) return res.text();
                        throw new Error('Network response was not ok.');
                    }).then((html) => {
                        $searchResult.append($(html).find('#TableKeys'));
                    });
                });
            // result page
            } else {
                GM_addStyle(`
                    .check.icon {
                        color: #5cb85c;
                        margin: 12px 0 5px 9px;
                        width: 42px;
                        height: 24px;
                        border-bottom: solid 3px currentColor;
                        border-left: solid 3px currentColor;
                        transform: rotate(-45deg);
                    }
                    .remove.icon { color: #d9534f; margin-left: 9px; margin-top: 30px; }
                    .remove.icon:before, .remove.icon:after {
                        content: '';
                        position: absolute;
                        width: 45px;
                        height: 3px;
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
                    title: $game.parent().prev().text().trim(),
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
        if (location.pathname.startsWith('/profile/')) {
            // insert textarea
            $('.table-products').before(bundleSitesBox());

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

            // load details
            $('img[src*="steam.svg"]').each(async (index, ele) => {
                $.ajax({
                    url: $(ele).closest('tr').find('.item-link').attr('href'),
                    data: { v: 1 },
                    dataType: 'script',
                });
            });

            const extractKeys = () => {
                const skipUsed = !!$('.SBSE_ChkSkipUsed:checked').length;
                const keys = [];

                $('.key-block input.code').each((index, element) => {
                    const $game = $(element);
                    const used = !!$game.closest('.key-block').find('.key-status:contains(used)').length;

                    if ($game.val().includes('-') && (!used || (used && !skipUsed))) {
                        keys.push({
                            key: $game.val(),
                            title: $game.closest('tr').prev().children('td').eq(2)
                                .text()
                                .trim(),
                        });
                    }
                });

                return keys;
            };

            // append checkbox for used-key
            $('#SBSE_BtnSettings').before(
                $(`<label><input type="checkbox" class="SBSE_ChkSkipUsed" checked>${text.checkboxSkipUsed}</label>`),
            );

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
                    bundleSitesBoxHandler.reveal(handler, $('.btn-reveal-key'));
                }, timer);
            });
            $('.SBSE_BtnRetrieve').click(() => {
                bundleSitesBoxHandler.retrieve(extractKeys());
            });
            $('.SBSE_BtnExport').click(() => {
                const bundleTitle = `Groupees - ${$('h2').text()}`;

                bundleSitesBoxHandler.export(extractKeys(), bundleTitle);
            });

            // bind custom event
            $(document).on('activated', (e, key, result) => {
                if (result.success === 1) $(`.btn-steam-redeem[href*=${key}]`).next('.key-usage-toggler').click();
            });
        } else {
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
            new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    Array.from(mutation.addedNodes).forEach((addedNode) => {
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

                    if (!used || (used && !skipUsed)) {
                        keys.push({
                            key: $game.val(),
                            title: $game.closest('.details').find('h3').text().trim(),
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
        }
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
            $('.SBSE_container > div > button').click((e) => {
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
    },
};
const init = () => {
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
                            title: text.updateSuccessTitle,
                            text: text.updateSuccess,
                            type: 'success',
                            timer: 3000,
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
            if (!owned.lastSync || owned.lastSync < (Date.now() - updateTimer)) syncLibrary(false);
        }
    }
};

$(init);
