const axios = require('axios');
const randomUseragent = require('random-useragent');

let options = {
  headers: {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en,ru;q=0.9,en-GB;q=0.8,en-US;q=0.7',
    'cache-control': 'max-age=0',
    'user-agent': ''
  }
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

class Yandex {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.useragent = randomUseragent.getRandom();
    this.image = [];
    this.translate = [];
    this.image.search = this.imageSearch;
    this.translate.translate = this.translateTranslate;
    this.translate.detect = this.translateDetect;
    this.translate.languages = this.translateLanguages;
    this.translateTranslate.bind(this);
    options.headers['user-agent'] = this.useragent;
  }

  translateLanguages(query) {
    return new Promise(function (resolve, reject) {
      if (!query) {
        reject({
          'info': 'No query provided',
          'success': false
        });
        return;
      }
      axios.post('https://translate.api.cloud.yandex.net/translate/v2/languages', query, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`
        }
      }).then(r => {
        resolve(r.data);
      }).catch(err => {
        reject(err.response.data)
      })
    });
  }

  translateDetect(query) {
    return new Promise(function (resolve, reject) {
      if (!query) {
        reject({
          'info': 'No query provided',
          'success': false
        });
        return;
      }
      axios.post('https://translate.api.cloud.yandex.net/translate/v2/detect', query, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`
        }
      }).then(r => {
        resolve(r.data);
      }).catch(err => {
        reject(err.response.data)
      })
    });
  }

  translateTranslate(query) {
    return new Promise(function (resolve, reject) {
      if (!query) {
        reject({
          'info': 'No query provided',
          'success': false
        });
        return;
      }
      axios.post('https://translate.api.cloud.yandex.net/translate/v2/translate', query, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`
        }
      }).then(r => {
        resolve(r.data);
      }).catch(err => {
        reject(err.response.data)
      })
    });
  }

  imageSearch(query) {
    return new Promise(function (resolve, reject) {
      if (!query) {
        reject({
          'info': 'No query provided',
          'success': false
        });
        return;
      }
      axios.get('https://yandex.ru/images/search?text=' + encodeURIComponent(query), options).then(r => {
        let final_object = r.data.split('"').filter(t => t.startsWith('//') && t.includes('avatars.mds.yandex.net'));
        if (final_object.length === 0) {
          reject({
            'info': 'Failed to find images',
            'success': false
          });
          return;
        }
        final_object = replaceAll(JSON.stringify(final_object), '//avatars.mds.yandex.net', 'https://avatars.mds.yandex.net');
        final_object = JSON.parse(final_object);
        resolve(final_object);
      }).catch(err => {
        console.log(err);
        reject({
          'info': 'Failed to find or parse result',
          'success': false
        });
      })
    });
  }
}

module.exports.Yandex = Yandex;
