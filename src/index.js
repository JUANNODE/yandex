const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const randomUseragent = require('random-useragent');

let options = {
    headers: {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en,ru;q=0.9,en-GB;q=0.8,en-US;q=0.7",
        "cache-control": "max-age=0",
        "user-agent": ""
    }
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

let apikey;

class Yandex {
    constructor(name) {
        apikey = name;
        this.useragent = randomUseragent.getRandom();
        this.image = [];
        this.translate = [];
        this.search = this.search;
        this.test = "123";
        this.image.search = this.imagesearch;
        this.translate.translate = this.translatetranslate;
        this.translate.detect = this.translatedetect;
        this.translate.languages = this.translatelanguages;
        this.translatetranslate.bind(this);
        options.headers["user-agent"] = this.useragent;
    }
    translatelanguages(query) {
        return new Promise(function(resolve, reject) {
            if (!query) {
                reject({
                    "info": "No query provided",
                    "success": false
                });
                return;
            }
            axios.post("https://translate.api.cloud.yandex.net/translate/v2/languages", query, {
                headers: {
                    Authorization: "Bearer " + apikey
                }
            }).then(r => {
                resolve(r.data);
            }).catch(err => {
                reject(err.response.data)
            })
        });
    }
    translatedetect(query) {
        return new Promise(function(resolve, reject) {
            if (!query) {
                reject({
                    "info": "No query provided",
                    "success": false
                });
                return;
            }
            axios.post("https://translate.api.cloud.yandex.net/translate/v2/detect", query, {
                headers: {
                    Authorization: "Bearer " + apikey
                }
            }).then(r => {
                resolve(r.data);
            }).catch(err => {
                reject(err.response.data)
            })
        });
    }
    translatetranslate(query) {
        return new Promise(function(resolve, reject) {
            if (!query) {
                reject({
                    "info": "No query provided",
                    "success": false
                });
                return;
            }
            axios.post("https://translate.api.cloud.yandex.net/translate/v2/translate", query, {
                headers: {
                    Authorization: "Bearer " + apikey
                }
            }).then(r => {
                resolve(r.data);
            }).catch(err => {
                reject(err.response.data)
            })
        });
    }
    imagesearch(query) {
        return new Promise(function(resolve, reject) {
            if (!query) {
                reject({
                    "info": "No query provided",
                    "success": false
                });
                return;
            }
            axios.get("https://yandex.ru/images/search?text=" + encodeURIComponent(query), options).then(r => {
                let final_object = r.data.split("\"").filter(t => t.startsWith("//") && t.includes("avatars.mds.yandex.net"));
                if (final_object.length == 0) {
                    reject({
                        "info": "Failed to find images",
                        "success": false
                    });
                    return;
                }
                final_object = replaceAll(JSON.stringify(final_object), "//avatars.mds.yandex.net", "https://avatars.mds.yandex.net");
                final_object = JSON.parse(final_object);
                resolve(final_object);
            }).catch(err => {
                console.log(err);
                reject({
                    "info": "Failed to find or parse result",
                    "success": false
                });
            })
        })
    }
}

module.exports.Yandex = Yandex;
