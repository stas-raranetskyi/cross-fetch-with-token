## Install

```sh
npm install --save fetch-with-token
```

## Usage

With [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise):

```javascript
import fetch, { settings }  from 'fetch-with-token';
settings.urlToken = 'https://yourdomain.com/api/connect/token/';
settings.clientData = {
    clientId: 'clientId',
    clientSecret: 'clientSecret',
    grantType: 'client_credentials'
};
fetch('url').then(res => {
    return res.json();
}).then(res => {
    console.log(res);
}).catch(err => {
    console.error(err);
});
```

### Settings

Option | Type | Default
------ | ---- | -------
urlToken | string | /
localStorePrefix | string | MY.APP
expiresToken | nubmer | 86400 (1 day)
clientData | object | {}

## Author

|[![@Stas Raranetskyi](https://avatars0.githubusercontent.com/u/11090889?s=128&v=4)](https://github.com/stas-raranetskyi/)|
|:---:|
|[Stas Raranetskyi](https://github.com/stas-raranetskyi/)|
