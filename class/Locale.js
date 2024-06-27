const en_US = require("../locales/en-US.json");

const id_ID = require("../translate/id-ID.json");
const da_DK = require("../translate/da-DK.json");
const de_DE = require("../translate/de-DE.json");
const en_GB = require("../translate/en-GB.json");
const es_ES = require("../translate/es-ES.json");
const fr_FR = require("../translate/fr-FR.json");
const hr_HR = require("../translate/hr-HR.json");
const it_IT = require("../translate/it-IT.json");
const lt_LT = require("../translate/lt-LT.json");
const hu_HU = require("../translate/hu-HU.json");
const nl_NL = require("../translate/nl-NL.json");
const no_NO = require("../translate/no-NO.json");
const pl_PL = require("../translate/pl-PL.json");
const pt_BR = require("../translate/pt-BR.json");
const ro_RO = require("../translate/ro-RO.json");
const fi_FI = require("../translate/fi-FI.json");
const sv_SE = require("../translate/sv-SE.json");
const vi_VN = require("../translate/vi-VN.json");
const tr_TR = require("../translate/tr-TR.json");
const cs_CZ = require("../translate/cs-CZ.json");
const el_GR = require("../translate/el-GR.json");
const bg_BG = require("../translate/bg-BG.json");
const ru_RU = require("../translate/ru-RU.json");
const uk_UA = require("../translate/uk-UA.json");
const hi_IN = require("../translate/hi-IN.json");
const th_TH = require("../translate/th-TH.json");
const ja_JP = require("../translate/ja-JP.json");
const zh_CN = require("../translate/zh-CN.json");
const ko_KR = require("../translate/ko-KR.json");

module.exports = class Locale {
    locale = "en-US";

    constructor(locale) {
        this.locale = locale;
    }

    getLocaleString(id) {
        try {
            switch (this.locale) {
                case "id":
                    return id_ID[id] || en_US[id] || id;
                case "da":
                    return da_DK[id] || en_US[id] || id;
                case "de":
                    return de_DE[id] || en_US[id] || id;
                case "en-GB":
                    return en_GB[id] || en_US[id] || id;
                case "en-US":
                    return en_US[id] || id;
                case "es-ES":
                    return es_ES[id] || en_US[id] || id;
                case "fr":
                    return fr_FR[id] || en_US[id] || id;
                case "hr":
                    return hr_HR[id] || en_US[id] || id;
                case "it":
                    return it_IT[id] || en_US[id] || id;
                case "lt":
                    return lt_LT[id] || en_US[id] || id;
                case "hu":
                    return hu_HU[id] || en_US[id] || id;
                case "nl":
                    return nl_NL[id] || en_US[id] || id;
                case "no":
                    return no_NO[id] || en_US[id] || id;
                case "pl":
                    return pl_PL[id] || en_US[id] || id;
                case "pt-BR":
                    return pt_BR[id] || en_US[id] || id;
                case "ro":
                    return ro_RO[id] || en_US[id] || id;
                case "fi":
                    return fi_FI[id] || en_US[id] || id;
                case "sv-SE":
                    return sv_SE[id] || en_US[id] || id;
                case "vi":
                    return vi_VN[id] || en_US[id] || id;
                case "tr":
                    return tr_TR[id] || en_US[id] || id;
                case "cs":
                    return cs_CZ[id] || en_US[id] || id;
                case "el":
                    return el_GR[id] || en_US[id] || id;
                case "bg":
                    return bg_BG[id] || en_US[id] || id;
                case "ru":
                    return ru_RU[id] || en_US[id] || id;
                case "uk":
                    return uk_UA[id] || en_US[id] || id;
                case "hi":
                    return hi_IN[id] || en_US[id] || id;
                case "th":
                    return th_TH[id] || en_US[id] || id;
                case "ja":
                    return ja_JP[id] || en_US[id] || id;
                case "zh-CN":
                    return zh_CN[id] || en_US[id] || id;
                case "ko":
                    return ko_KR[id] || en_US[id] || id;
                default:
                    return en_US[id] || id;
            }
        } catch (err) {
            console.error(err);

            return id;
        }
    }

    replacePlaceholders(template, data) {
        return template.replace(/{(\d+)}/g, (match, number) => {
            return typeof data[number] !== 'undefined' ? data[number] : match;
        });
    }

    getDefaultString(id) {
        try {
            if (en_US[id]) return en_US[id];
            else return id;
        } catch (err) {
            console.error(err);

            return id;
        }
    }
}