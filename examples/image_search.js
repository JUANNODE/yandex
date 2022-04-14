const {Yandex} = require('yandex');
const yandex = new Yandex();

yandex.image.search('fennec fox').then(r => {
  console.log(r);
}).catch(err => {
  console.log(err);
})
