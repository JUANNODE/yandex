const axios = require('axios');
const randomUseragent = require('random-useragent');

const options = {
  headers: {
    // eslint-disable-next-line max-len
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en,ru;q=0.9,en-GB;q=0.8,en-US;q=0.7',
    'cache-control': 'max-age=0',
    'user-agent': '',
  },
};

// eslint-disable-next-line require-jsdoc
function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

let apiKey;

// eslint-disable-next-line require-jsdoc
class Yandex {
  // eslint-disable-next-line require-jsdoc
  constructor(key) {
    apiKey = key;
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

  // eslint-disable-next-line require-jsdoc
  translateLanguages(query) {
    return new Promise(function(resolve, reject) {
      if (!query) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({
          'info': 'No query provided',
          'success': false,
        });
        return;
      }
      axios.post('https://translate.api.cloud.yandex.net/translate/v2/languages', query, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }).then((r) => {
        resolve(r.data);
      }).catch((err) => {
        reject(err.response.data);
      });
    });
  }

  // eslint-disable-next-line require-jsdoc
  translateDetect(query) {
    return new Promise(function(resolve, reject) {
      if (!query) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({
          'info': 'No query provided',
          'success': false,
        });
        return;
      }
      axios.post('https://translate.api.cloud.yandex.net/translate/v2/detect', query, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }).then((r) => {
        resolve(r.data);
      }).catch((err) => {
        reject(err.response.data);
      });
    });
  }

  // eslint-disable-next-line require-jsdoc
  translateTranslate(query) {
    return new Promise(function(resolve, reject) {
      if (!query) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({
          'info': 'No query provided',
          'success': false,
        });
        return;
      }
      axios.post('https://translate.api.cloud.yandex.net/translate/v2/translate', query, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }).then((r) => {
        resolve(r.data);
      }).catch((err) => {
        reject(err.response.data);
      });
    });
  }

  // eslint-disable-next-line require-jsdoc
  imageSearch(query) {
    return new Promise(function(resolve, reject) {
      if (!query) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({
          'info': 'No query provided',
          'success': false,
        });
        return;
      }
      axios.get('https://yandex.ru/images/search?text=' + encodeURIComponent(query), options).then((r) => {
        // eslint-disable-next-line max-len
        let finalObject = r.data.split('"').filter((t) => t.startsWith('//') && t.includes('avatars.mds.yandex.net'));
        if (finalObject.length === 0) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({
            'info': 'Failed to find images',
            'success': false,
          });
          return;
        }
        finalObject = replaceAll(JSON.stringify(finalObject), '//avatars.mds.yandex.net', 'https://avatars.mds.yandex.net');
        finalObject = JSON.parse(finalObject);
        resolve(finalObject);
      }).catch((err) => {
        console.log(err);
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({
          'info': 'Failed to find or parse result',
          'success': false,
        });
      });
    });
  }
}

module.exports.Yandex = Yandex;
