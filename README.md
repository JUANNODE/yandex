# About
This module is Yandex API wrapper. (Currently under construction)
It has official methods and non official (For example methods that are not in the official API but that people need)

## Example 
Install: 
```
npm i yandex
```

Usage:
```js
const { Yandex } = require('yandex');
const yandex = new Yandex();

yandex.image.search("fennec fox").then(r => {
    console.log(r);
}).catch(err => {
    console.log(err);
})
```

## Documentation
Cooming soon because there's only 1 method rn: `image.search`
